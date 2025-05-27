// background.js
self.importScripts('lib/jszip.min.js');

console.log('[Background] ReLiti service worker started');

const state = {
  tabId: null,
  ids: [],
  total: 0,
  current: 0,
  delayMs: 3000,   // 3 second default delay
  isDownloading: false,
  isPaused: false,
  timerId: null,
  failedDownloads: [],   // Track failed downloads
  descriptions: {},      // id -> description
  retryCounts: {},       // id -> count
  downloadCheckTimers: {},  // Timers for verifying download success
  lastClickTime: {},     // Track when each link was last clicked
  maxAttempts: 5,        // Increased max attempts (was 3)
  timeoutMs: 15000       // Consider a download timed out after 15 seconds
};

// Load state from storage
chrome.storage.local.get(['downloadState'], (result) => {
  if (result.downloadState) {
    Object.assign(state, result.downloadState);
    console.log('[Background] Restored state from storage:', state);
    // Broadcast status to any open popups
    broadcastStatus();
  }
});

function saveState() {
  // Create a copy of the state without the timers (which can't be serialized)
  const stateCopy = { ...state };
  delete stateCopy.downloadCheckTimers;
  delete stateCopy.lastClickTime;
  // Save the current state to storage
  chrome.storage.local.set({ downloadState: stateCopy });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'startDownloads') {
    state.tabId = msg.tabId;
    state.ids = msg.ids;
    state.descriptions = msg.descriptions || {};
    state.total = state.ids.length;
    state.current = 0;
    state.delayMs = msg.delayMs || 3000;
    state.isDownloading = true;
    state.isPaused = false;
    state.failedDownloads = [];
    state.retryCounts = {};
    state.downloadCheckTimers = {};
    state.lastClickTime = {};
    runNext();
    saveState();
    sendResponse({ success: true });
  }
  else if (msg.action === 'resetState') {
    // Reset the state to initial values
    console.log('[Background] Resetting state to initial values');
    state.tabId = null;
    state.ids = [];
    state.total = 0;
    state.current = 0;
    state.isDownloading = false;
    state.isPaused = false;
    state.failedDownloads = [];
    state.descriptions = {};
    state.retryCounts = {};
    
    // Clear any running timers
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
    
    // Clear any pending download check timers
    Object.values(state.downloadCheckTimers || {}).forEach(timer => clearTimeout(timer));
    state.downloadCheckTimers = {};
    state.lastClickTime = {};
    
    // Clear state from storage
    chrome.storage.local.remove('downloadState', () => {
      console.log('[Background] State data cleared from storage');
      // Broadcast the reset state to any open popups
      broadcastStatus();
      // Send response to caller
      sendResponse({ success: true });
    });
    
    return true; // Keep the message channel open for the async response
  }
  else if (msg.action === 'resumeDownloads') {
    if (state.isPaused) {
      console.log('[Background] Resuming downloads');
      state.isDownloading = true;
      state.isPaused = false;
      runNext();
      saveState();
      sendResponse({ success: true });
    }
  }
  else if (msg.action === 'pauseDownloads') {
    console.log('[Background] Pausing downloads');
    state.isPaused = true;
    state.isDownloading = false;
    clearTimeout(state.timerId);
    // Clear any pending download check timers
    Object.values(state.downloadCheckTimers).forEach(timer => clearTimeout(timer));
    state.downloadCheckTimers = {};
    broadcastStatus();
    saveState();
    sendResponse({ success: true });
  }
  else if (msg.action === 'stopDownloads') {
    console.log('[Background] Stopping downloads completely');
    state.isDownloading = false;
    state.isPaused = false;
    clearTimeout(state.timerId);
    // Clear any pending download check timers
    Object.values(state.downloadCheckTimers).forEach(timer => clearTimeout(timer));
    state.downloadCheckTimers = {};
    broadcastStatus();
    saveState();
    sendResponse({ success: true });
  }
  else if (msg.action === 'getStatus') {
    // Simply return the current state - the popup will decide what to do with it
    console.log('[Background] Status requested, returning current state');
    sendResponse({ ...state });
  }
  else if (msg.action === 'downloadStatusCheck') {
    // Message from content script about download status
    handleDownloadStatusCheck(msg);
    sendResponse({ received: true });
  }
  else if (msg.action === 'downloadSummary') {
    // Handle final download summary
    console.log('[Background] Received download summary:', msg);
    
    // Update our failed downloads with the final list
    if (msg.failed && Array.isArray(msg.failed)) {
      // Make sure we don't lose any failures already tracked
      const existingFailureIds = state.failedDownloads.map(f => f.id);
      
      // Add any new failures that aren't already in our list
      msg.failed.forEach(failure => {
        if (!existingFailureIds.includes(failure.id)) {
          console.log(`[Background] Adding new failure from summary: ${failure.id}`);
          state.failedDownloads.push(failure);
        }
      });
      
      // Make sure we update our status
      broadcastStatus();
      saveState();
    }
    
    sendResponse({ received: true });
  }
  else if (msg.action === 'progressUpdate') {
    // Update progress info from the content script
    const { id, attempts } = msg;
    if (id && attempts) {
      state.retryCounts[id] = attempts - 1; // attempts includes first try
    }
    broadcastStatus();
    sendResponse({ received: true });
  }
  else if (msg.action === 'retryFailedDownload') {
    // Request to retry a specific download
    retryFailedDownload(msg.id);
    sendResponse({ retrying: true });
  }
  else if (msg.action === 'forceScanForFailures') {
    // Request to scan the content page for failures
    forceScanForFailures();
    sendResponse({ scanning: true });
  }
  return true;
});

function handleDownloadStatusCheck(msg) {
  const { linkId, success, error, retries } = msg;
  
  console.log(`[Background] Received download status for ${linkId}: ${success ? 'Success' : 'Failed'}`);
  
  // Clear the download check timer
  if (state.downloadCheckTimers[linkId]) {
    clearTimeout(state.downloadCheckTimers[linkId]);
    delete state.downloadCheckTimers[linkId];
  }
  
  if (!success) {
    // If we've already moved past this download, we need to add it to failed retroactively
    const existingFailure = state.failedDownloads.find(f => f.id === linkId);
    if (!existingFailure) {
      state.failedDownloads.push({
        id: linkId,
        description: state.descriptions[linkId] || linkId,
        error: error || 'Download failed',
        verified: true,
        attempts: msg.attempts || state.retryCounts[linkId] || 0
      });
      
      console.log(`[Background] Download verified as failed for ${linkId}: ${error}`);
      broadcastStatus();
      saveState();
    } else if (error && (!existingFailure.error || existingFailure.error === 'Unknown error')) {
      // Update the error message if we now have more details
      existingFailure.error = error;
      broadcastStatus();
      saveState();
    }
  } else if (retries && retries > 0) {
    // If it succeeded but required retries, update the retry count
    state.retryCounts[linkId] = retries;
    console.log(`[Background] Download succeeded for ${linkId} after ${retries + 1} attempts`);
    
    // Also make sure to remove from failed downloads if it was there
    const failedIndex = state.failedDownloads.findIndex(f => f.id === linkId);
    if (failedIndex >= 0) {
      console.log(`[Background] Removing ${linkId} from failed downloads as it succeeded on retry`);
      state.failedDownloads.splice(failedIndex, 1);
    }
    
    broadcastStatus();
    saveState();
  }
}

// Force a scan for failures in the content script
function forceScanForFailures() {
  if (!state.tabId) return;
  
  chrome.tabs.sendMessage(
    state.tabId,
    { action: 'forceScanForFailures' },
    {},
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(`[Background] Error sending scan request: ${chrome.runtime.lastError.message}`);
        return;
      }
      
      console.log(`[Background] Scan for failures result:`, response);
      if (response && response.failures && response.failures.length > 0) {
        // Add any new failures to our list
        response.failures.forEach(failure => {
          const existingFailure = state.failedDownloads.find(f => f.id === failure.id);
          if (!existingFailure) {
            console.log(`[Background] Adding newly found failure: ${failure.id}`);
            state.failedDownloads.push({
              id: failure.id,
              description: state.descriptions[failure.id] || failure.description || failure.id,
              error: failure.error || 'Detected failure',
              verified: true
            });
          }
        });
        
        broadcastStatus();
        saveState();
      }
    }
  );
}

// Improved retry logic for download failures with verification
async function runNext() {
  if (!state.isDownloading || state.isPaused) return;
  
  if (state.current >= state.total) {
    state.isDownloading = false;
    
    // Final pass - scan for any missed failures
    forceScanForFailures();
    
    broadcastStatus();
    saveState();
    return;
  }
  
  const linkId = state.ids[state.current];
  state.retryCounts[linkId] = state.retryCounts[linkId] || 0;
  
  console.log(`[Background] Attempting download ${state.current + 1}/${state.total}: ${linkId}`);
  
  try {
    // Inject debugging script to check if ad blockers are active
    try {
      await chrome.scripting.executeScript({
        target: { tabId: state.tabId },
        world: 'MAIN',
        func: () => {
          console.log('[ReLiti] Debug: Checking for ad blockers or blockers');
          
          // Try to detect ad blockers
          const adBlockDetected = (() => {
            let detected = false;
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox';
            document.body.appendChild(testAd);
            window.setTimeout(() => {
              if (testAd.offsetHeight === 0) {
                detected = true;
              }
              testAd.remove();
              console.log(`[ReLiti] Ad blocker detection: ${detected ? 'DETECTED' : 'Not detected'}`);
            }, 100);
            return detected;
          })();
          
          return { adBlockDetected };
        }
      });
    } catch (debugError) {
      console.log('[Background] Debug script error:', debugError);
    }
    
    // FIX: Go back to direct clicking for more reliable initiating of downloads
    const results = await chrome.scripting.executeScript({
    target: { tabId: state.tabId },
    world: 'MAIN',
      func: (id) => {
        console.log(`[ReLiti] Attempting to click on element with ID: ${id}`);
        
        try {
      const el = document.getElementById(id);
          if (!el) {
            console.error(`[ReLiti] Element with ID ${id} not found!`);
            return { success: false, error: 'Element not found' };
          }
          
          console.log(`[ReLiti] Element found:`, el.outerHTML.substring(0, 100) + '...');
          
          // Set up a way to check if download succeeded
          window.postMessage({
            type: 'RELITI_DOWNLOAD_STARTED',
            linkId: id,
          }, '*');
          
          // Check if the element is visible 
          const rect = el.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          console.log(`[ReLiti] Element visibility check: ${isVisible ? 'Visible' : 'Not visible'}`);
          
          // Click the element - simple and direct
          console.log(`[ReLiti] Clicking element with ID: ${id}`);
        el.click();
          console.log(`[ReLiti] Click executed on element with ID: ${id}`);
          
        return { success: true };
        } catch (err) {
          console.error(`[ReLiti] Error clicking element: ${err.message}`);
          return { success: false, error: `Error clicking: ${err.message}` };
      }
    },
    args: [linkId]
    });
    
    const result = results[0]?.result;
    
    if (!result?.success) {
      console.log(`[Background] Download failed for ${linkId}: ${result?.error || 'Unknown error'}`);
      await handleDownloadFailure(linkId, result?.error || 'Unknown error');
    } else {
      console.log(`[Background] Download initiated for ${linkId}`);
      
      // Track when this link was clicked
      state.lastClickTime[linkId] = Date.now();
      
      // Set up a verification timeout - if we don't get a confirmation within a timeframe,
      // assume the download might have failed
      state.downloadCheckTimers[linkId] = setTimeout(async () => {
        // Try to check if the download succeeded
        await verifyDownload(linkId);
      }, state.delayMs - 500); 
      
      // Increment current counter
      state.current++;
      broadcastStatus();
      saveState();
    }
    
    // Schedule next download
    state.timerId = setTimeout(runNext, state.delayMs);
  } catch (error) {
    console.error('[Background] Error during download:', error);
    await handleDownloadFailure(linkId, error.message);
        state.timerId = setTimeout(runNext, state.delayMs);
  }
}

async function verifyDownload(linkId) {
  console.log(`[Background] Verifying download for ${linkId}`);
  
  // If too much time has passed, consider it a timeout
  const clickTime = state.lastClickTime[linkId] || 0;
  if (clickTime > 0) {
    const elapsedTime = Date.now() - clickTime;
    if (elapsedTime > state.timeoutMs) {
      console.log(`[Background] Download timeout detected for ${linkId} - ${elapsedTime}ms elapsed`);
      
      // Ask the content script to double-check this download
      chrome.tabs.sendMessage(
        state.tabId,
        {
          action: 'checkDownloadStatus',
          linkId: linkId
        },
        {},
        (response) => {
          console.log(`[Background] Content script verification response for ${linkId}:`, response);
        }
      );
    }
  }
  
  try {
    // Check if the link still exists and has a "canceled" status
    const results = await chrome.scripting.executeScript({
      target: { tabId: state.tabId },
      world: 'MAIN',
      func: (id) => {
        const el = document.getElementById(id);
        if (!el) return { success: false, error: 'Element not found' };
        
        // Check if the row has any indication of failure
        const row = el.closest('tr');
        if (row) {
          const rowText = row.innerText.toLowerCase();
          const isCanceled = rowText.includes('canceled') || 
                             rowText.includes('cancelled') || 
                             rowText.includes('failed') ||
                             rowText.includes('timeout') ||
                             rowText.includes('timed out');
          
          return { 
            success: !isCanceled, 
            error: isCanceled ? 'Download canceled or failed' : null,
            rowText: row.innerText
          };
        }
        
        return { success: true }; // No clear sign of failure
      },
      args: [linkId]
    });
    
    const result = results[0]?.result;
    
    if (!result?.success) {
      console.log(`[Background] Download verification failed for ${linkId}: ${result?.error}`);
      
      // Add to failed downloads if not already there
      const existingFailure = state.failedDownloads.find(f => f.id === linkId);
      if (!existingFailure) {
        state.failedDownloads.push({
          id: linkId,
          description: state.descriptions[linkId] || linkId,
          error: result?.error || 'Verification failed',
          verified: true,
          rowText: result?.rowText,
          attempts: state.retryCounts[linkId] || 0
        });
        
        broadcastStatus();
        saveState();
      }
    } else {
      console.log(`[Background] Download verification passed for ${linkId}`);
    }
  } catch (error) {
    console.error('[Background] Error during download verification:', error);
  }
  
  // Clear the timer since we're done with it
  if (state.downloadCheckTimers[linkId]) {
    clearTimeout(state.downloadCheckTimers[linkId]);
    delete state.downloadCheckTimers[linkId];
  }
}

async function handleDownloadFailure(linkId, errorMessage) {
  state.retryCounts[linkId]++;
  
  if (state.retryCounts[linkId] < state.maxAttempts) {
    // Retry after a delay
    console.log(`[Background] Retrying ${linkId} (Attempt ${state.retryCounts[linkId] + 1}/${state.maxAttempts}) after ${state.delayMs}ms`);
    broadcastStatus(); // Update UI with current status
    return; // Don't increment current, we'll retry
  } else {
    // After max attempts, mark as failed and move on
    console.log(`[Background] Giving up on ${linkId} after ${state.maxAttempts} attempts`);
    
    // Check if this failure is already recorded
    const existingFailure = state.failedDownloads.find(f => f.id === linkId);
    if (!existingFailure) {
      state.failedDownloads.push({
        id: linkId,
        description: state.descriptions[linkId] || linkId,
        attempts: state.retryCounts[linkId],
        error: errorMessage
      });
    } else {
      existingFailure.attempts = state.retryCounts[linkId];
      if (errorMessage && (!existingFailure.error || existingFailure.error === 'Unknown error')) {
        existingFailure.error = errorMessage;
      }
    }
    
    state.current++;
    broadcastStatus();
    saveState();
  }
}

// Function to explicitly retry a failed download
async function retryFailedDownload(id) {
  if (!state.tabId || !id) {
    console.log('[Background] Cannot retry - missing tab ID or download ID');
    return;
  }
  
  console.log(`[Background] Explicitly retrying download for ${id}`);
  
  // Remove from failed downloads list if it exists
  const failedIndex = state.failedDownloads.findIndex(f => f.id === id);
  if (failedIndex >= 0) {
    state.failedDownloads.splice(failedIndex, 1);
  }
  
  // Reset retry count to give it a fresh start
  state.retryCounts[id] = 0;
  
  try {
    // FIX: Use direct click method for manual retries
    const results = await chrome.scripting.executeScript({
      target: { tabId: state.tabId },
      world: 'MAIN',
      func: (id) => {
        const el = document.getElementById(id);
        if (el) {
          // Set up a way to check if download succeeded
          window.postMessage({
            type: 'RELITI_DOWNLOAD_STARTED',
            linkId: id,
          }, '*');
          
          // Click the element
          el.click();
          return { success: true };
        }
        return { success: false, error: 'Element not found' };
      },
      args: [id]
    });
    
    const result = results[0]?.result;
    
    if (result?.success) {
      console.log(`[Background] Retry click successful for ${id}`);
    } else {
      console.log(`[Background] Retry click failed for ${id}: ${result?.error || 'Unknown error'}`);
    }
    
    broadcastStatus();
    saveState();
  } catch (error) {
    console.error(`[Background] Error during retry: ${error.message}`);
  }
}

function broadcastStatus() {
  chrome.runtime.sendMessage({
    action: 'statusUpdate',
    total: state.total,
    current: state.current,
    isDownloading: state.isDownloading,
    isPaused: state.isPaused,
    failedDownloads: state.failedDownloads,
    descriptions: state.descriptions
  }).catch(err => {
    // Suppress errors when popup is closed
    console.log('[Background] Could not send status update (popup may be closed)');
  });
}

// Listen for tab updates to maintain state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === state.tabId && changeInfo.status === 'complete') {
    // If the tab we're working with refreshes, we might need to adjust our state
    console.log('[Background] Tab refreshed, updating state if necessary');
    broadcastStatus();
  }
});

// On extension install or update, initialize storage
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Extension installed/updated');
  // Initial state setup if needed
  chrome.storage.local.get(['downloadState'], (result) => {
    if (!result.downloadState) {
      const initialState = { ...state };
      delete initialState.downloadCheckTimers; // Can't serialize functions/timeouts
      delete initialState.lastClickTime;
      chrome.storage.local.set({ downloadState: initialState });
    }
  });
});
