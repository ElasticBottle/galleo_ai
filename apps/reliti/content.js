// content.js

// Global tracking of downloads to ensure we catch all failures
const downloadTracker = {
  activeDownloads: {},
  failedDownloads: {},
  processedLinks: new Set(),
  
  // Initialize a download tracking
  startTracking: function(linkId) {
    this.activeDownloads[linkId] = {
      startTime: Date.now(),
      verified: false,
      success: false,
      retryCount: 0
    };
    console.log(`[ReLiti] Starting to track download for ${linkId}`);
  },
  
  // Mark a download as successful
  markSuccess: function(linkId) {
    if (this.activeDownloads[linkId]) {
      this.activeDownloads[linkId].success = true;
      this.activeDownloads[linkId].verified = true;
      console.log(`[ReLiti] Download marked as successful for ${linkId}`);
    }
    this.processedLinks.add(linkId);
    
    // Report success to background script
    chrome.runtime.sendMessage({
      action: 'downloadStatusCheck',
      linkId: linkId,
      success: true,
      verified: true
    });
  },
  
  // Mark a download as failed
  markFailed: function(linkId, error) {
    this.failedDownloads[linkId] = {
      error: error || 'Unknown error',
      time: Date.now()
    };
    
    if (this.activeDownloads[linkId]) {
      this.activeDownloads[linkId].success = false;
      this.activeDownloads[linkId].verified = true;
      this.activeDownloads[linkId].error = error;
    }
    
    console.log(`[ReLiti] Download marked as FAILED for ${linkId}: ${error}`);
    this.processedLinks.add(linkId);
    
    // Report to background script - make sure this happens
    try {
      chrome.runtime.sendMessage({
        action: 'downloadStatusCheck',
        linkId: linkId,
        success: false,
        error: error,
        attempts: this.getRetryCount(linkId)
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(`[ReLiti] Error sending failure message: ${chrome.runtime.lastError.message}`);
        } else {
          console.log(`[ReLiti] Failure message sent for ${linkId}`);
        }
      });
    } catch (e) {
      console.error(`[ReLiti] Exception sending failure message: ${e.message}`);
    }
  },
  
  // Check if a download is already being tracked
  isTracking: function(linkId) {
    return !!this.activeDownloads[linkId];
  },
  
  // Increment retry count
  incrementRetry: function(linkId) {
    if (this.activeDownloads[linkId]) {
      this.activeDownloads[linkId].retryCount++;
      return this.activeDownloads[linkId].retryCount;
    }
    return 0;
  },
  
  // Get retry count
  getRetryCount: function(linkId) {
    return this.activeDownloads[linkId]?.retryCount || 0;
  }
};

// Get description from a row
function getRowDescription(a) {
  const row = a.closest('tr');
  if (!row) return a.id;
  const cells = Array.from(row.querySelectorAll('td'));
  return cells.map(cell => cell.innerText.trim()).filter(Boolean).join(', ');
}

// Check the row's status text and styling for indicators of failure
function checkRowForFailure(row) {
  if (!row) return { failed: false };
  
  const rowText = row.innerText.toLowerCase();
  const rowHTML = row.innerHTML.toLowerCase();
  
  // Check for common failure keywords in text
  const failureKeywords = ['cancel', 'fail', 'error', 'timeout', 'denied', 'rejected'];
  const textFailure = failureKeywords.some(keyword => rowText.includes(keyword));
  
  // Check for parentheses that might contain status like (cancelled)
  const statusInParentheses = rowText.match(/\([^)]*\)/g);
  const parenthesesFailure = statusInParentheses && 
    statusInParentheses.some(status => 
      failureKeywords.some(keyword => status.toLowerCase().includes(keyword))
    );
  
  // Check for HTML indicators
  const htmlFailure = 
    row.querySelector('span.error, div.error, .failure, .canceled, .cancelled') !== null ||
    rowHTML.includes('class="error"') || 
    rowHTML.includes('style="color: red"') ||
    rowHTML.includes('style="color:#ff') ||
    rowHTML.includes('style="color: #ff');
  
  // Check for color indicators using computed style
  const redTextElements = Array.from(row.querySelectorAll('*')).filter(el => {
    const style = window.getComputedStyle(el);
    const color = style.color.toLowerCase();
    // Check for any reddish color
    return color.includes('rgb(255') || color.includes('#f') || color.includes('red');
  });
  
  const hasRedText = redTextElements.length > 0;
  
  const result = textFailure || parenthesesFailure || htmlFailure || hasRedText;
  
  if (result) {
    // Return details about why we think it failed
    return { 
      failed: true, 
      reason: textFailure ? 'Failure text detected' : 
              parenthesesFailure ? 'Status in parentheses indicates failure' :
              htmlFailure ? 'HTML error indicators present' : 'Red text detected',
      text: rowText
    };
  }
  
  return { failed: false };
}

// Create observer to monitor DOM changes for status updates
function createRowObserver(linkId, row) {
  if (!row) return null;
  
  const observer = new MutationObserver((mutations) => {
    // Check if the row or its children have changed
    const failureCheck = checkRowForFailure(row);
    if (failureCheck.failed) {
      console.log(`[ReLiti] Observer detected failure for ${linkId}: ${failureCheck.reason}`);
      downloadTracker.markFailed(linkId, `${failureCheck.reason}: ${failureCheck.text}`);
      observer.disconnect();
    }
  });
  
  observer.observe(row, { 
    attributes: true, 
    childList: true, 
    subtree: true, 
    characterData: true 
  });
  
  return observer;
}

// Listen for download status from the page
window.addEventListener('message', function(event) {
  // Only accept messages from this window
  if (event.source !== window) return;

  if (event.data.type === 'RELITI_DOWNLOAD_STARTED') {
    const { linkId } = event.data;
    
    if (!downloadTracker.isTracking(linkId)) {
      downloadTracker.startTracking(linkId);
    }
    
    // Set up verification at different intervals
    scheduleVerifications(linkId);
  }
});

// Schedule multiple verifications to increase chances of catching failures
function scheduleVerifications(linkId) {
  // Check immediately - for instant failures
  setTimeout(() => { verifyDownloadSuccess(linkId, 'immediate'); }, 500);
  
  // Check after a short delay
  setTimeout(() => { verifyDownloadSuccess(linkId, 'short'); }, 2000);
  
  // Check after a medium delay
  setTimeout(() => { verifyDownloadSuccess(linkId, 'medium'); }, 5000);
  
  // Final verification
  setTimeout(() => { verifyDownloadSuccess(linkId, 'final'); }, 10000);
  
  // Extra timeout verification - to catch very slow responses
  setTimeout(() => { verifyDownloadTimeout(linkId); }, 15000);
}

// Specific check for timeouts after a longer period
function verifyDownloadTimeout(linkId) {
  // Skip if already verified and processed
  if (downloadTracker.processedLinks.has(linkId)) {
    return;
  }
  
  // If we reached this point and the download is still not verified,
  // it's likely a timeout
  console.log(`[ReLiti] Download timeout detected for ${linkId} - no status update after 15 seconds`);
  downloadTracker.markFailed(linkId, "Download timed out - no status update after 15 seconds");
  
  // Make sure background script knows about this timeout
  try {
    chrome.runtime.sendMessage({
      action: 'downloadStatusCheck',
      linkId: linkId,
      success: false,
      error: "Download timed out - no status update after 15 seconds",
      attempts: downloadTracker.getRetryCount(linkId)
    });
  } catch (e) {
    console.error(`[ReLiti] Error sending timeout message: ${e.message}`);
  }
}

// Aggressively verify if a download succeeded
function verifyDownloadSuccess(linkId, checkPhase) {
  // Skip if already verified
  if (downloadTracker.processedLinks.has(linkId)) {
    console.log(`[ReLiti] ${checkPhase} check: Skipping ${linkId} - already processed`);
    return;
  }
  
  const el = document.getElementById(linkId);
  let success = false;
  let errorMessage = '';
  
  if (!el) {
    errorMessage = `Element not found during ${checkPhase} verification`;
    downloadTracker.markFailed(linkId, errorMessage);
    return;
  }
  
  // Check the row for any failure indicators
  const row = el.closest('tr');
  if (!row) {
    errorMessage = `Row not found for ${linkId} during ${checkPhase} verification`;
    downloadTracker.markFailed(linkId, errorMessage);
    return;
  }
  
  // Advanced check for all possible failure indicators
  const failureCheck = checkRowForFailure(row);
  
  if (failureCheck.failed) {
    errorMessage = `${failureCheck.reason} during ${checkPhase} verification: ${failureCheck.text}`;
    downloadTracker.markFailed(linkId, errorMessage);
    return;
  }
  
  // For the final check, if we haven't found any failures, consider it a success
  if (checkPhase === 'final') {
    console.log(`[ReLiti] Final verification for ${linkId} - assuming success (no failure detected)`);
    
    // Set up an observer to catch any later status changes
    const observer = createRowObserver(linkId, row);
    
    // Even if we think it succeeded, report status to background script
    chrome.runtime.sendMessage({
      action: 'downloadStatusCheck',
      linkId: linkId,
      success: true,
      verified: true
    });
    
    downloadTracker.markSuccess(linkId);
  }
}

// Global container to track network requests
let networkRequests = {};

// Create a MutationObserver to watch for cancelled network requests in the UI
function setupNetworkRequestObserver() {
  // Look for elements in the page that might indicate network states
  const observer = new MutationObserver((mutations) => {
    // Check for cancelled network requests in the DOM
    const cancelledRows = document.querySelectorAll('tr:contains("cancelled"), tr:contains("canceled")');
    
    if (cancelledRows.length > 0) {
      console.log(`[ReLiti] Found ${cancelledRows.length} cancelled network requests in the page`);
      
      // Force a scan of all download rows to check for failures
      const downloadLinks = Array.from(document.querySelectorAll("a[id*='LnkBtnPDF']"));
      
      downloadLinks.forEach(link => {
        const row = link.closest('tr');
        if (row) {
          const failureCheck = checkRowForFailure(row);
          if (failureCheck.failed && !downloadTracker.processedLinks.has(link.id)) {
            console.log(`[ReLiti] Found previously undetected failure for ${link.id}: ${failureCheck.reason}`);
            downloadTracker.markFailed(link.id, `${failureCheck.reason}: ${failureCheck.text}`);
          }
        }
      });
    }
  });
  
  // Observe the body and all its changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  return observer;
}

// Initialize network observer when page loads
setupNetworkRequestObserver();

// Click on a download link and monitor its status
async function clickAndMonitorDownload(id, description, attempt = 1) {
  const a = document.getElementById(id);
  if (!a) {
    console.log(`[ReLiti] Element ${id} not found for click`);
    return { success: false, error: `Element not found (attempt ${attempt})` };
  }
  
  const row = a.closest('tr');
  if (!row) {
    console.log(`[ReLiti] Row not found for ${id}`);
    return { success: false, error: `Row not found (attempt ${attempt})` };
  }
  
  // Check if already showing failure before we even click
  const preClickCheck = checkRowForFailure(row);
  if (preClickCheck.failed) {
    console.log(`[ReLiti] Detected failure for ${id} before clicking: ${preClickCheck.reason}`);
    return { success: false, error: `Pre-click failure: ${preClickCheck.reason}` };
  }
  
  // Notify that we're starting a download
  window.postMessage({
    type: 'RELITI_DOWNLOAD_STARTED',
    linkId: id,
  }, '*');
  
  // Set up an observer to monitor status changes
  const observer = createRowObserver(id, row);
  
  // Click the download link - FIX: Use simple click method to avoid interference
  console.log(`[ReLiti] Clicking download link ${id} (attempt ${attempt})`);
  a.click();
  
  // Wait for the download to progress
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Check the status after the wait
  const postClickCheck = checkRowForFailure(row);
  if (postClickCheck.failed) {
    console.log(`[ReLiti] Detected failure for ${id} after clicking: ${postClickCheck.reason}`);
    observer && observer.disconnect();
    return { success: false, error: `Post-click failure: ${postClickCheck.reason}` };
  }
  
  // Check if the download might have timed out (no visible success/failure)
  const downloadStartTime = downloadTracker.activeDownloads[id]?.startTime || Date.now();
  const elapsedTime = Date.now() - downloadStartTime;
  
  if (elapsedTime > 6000 && !downloadTracker.activeDownloads[id]?.verified) {
    console.log(`[ReLiti] Possible timeout for ${id} - no clear status after ${elapsedTime}ms`);
    return { success: false, error: `Possible timeout - no status update after ${Math.round(elapsedTime/1000)}s` };
  }
  
  // If we got here and no failure was detected, assume success for now
  // The background monitoring will continue to check
  return { success: true };
}

// Main download process
async function startDownloadProcess(idsAndDescriptions) {
  const failed = [];
  let successCount = 0;
  
  // Clear any existing tracked downloads
  for (const key in downloadTracker.activeDownloads) {
    delete downloadTracker.activeDownloads[key];
  }
  for (const key in downloadTracker.failedDownloads) {
    delete downloadTracker.failedDownloads[key];
  }
  downloadTracker.processedLinks.clear();

  for (let i = 0; i < idsAndDescriptions.length; i++) {
    const { id, description } = idsAndDescriptions[i];
    let success = false;
    let error = '';
    let attemptCount = 0;
    const maxAttempts = 5; // Increased from 3 to 5 for more aggressive retrying
    
    // Try up to maxAttempts times (increased from 3)
    while (attemptCount < maxAttempts && !success) {
      attemptCount++;
      
      // Update the tracker
      if (!downloadTracker.isTracking(id)) {
        downloadTracker.startTracking(id);
      } else {
        downloadTracker.incrementRetry(id);
      }
      
      // Try to download
      const result = await clickAndMonitorDownload(id, description, attemptCount);
      success = result.success;
      error = result.error;
      
      if (!success) {
        // Wait longer between retries for each subsequent attempt
        const waitTime = 2000 + (attemptCount * 1000);
        console.log(`[ReLiti] Attempt ${attemptCount} failed for ${id}, will retry in ${waitTime}ms...`);
        
        // Use increasing delays between retries
        await new Promise(res => setTimeout(res, waitTime));
        
        // Force a check of the current status before retrying
        const el = document.getElementById(id);
        if (el) {
          const row = el.closest('tr');
          if (row) {
            // Specifically look for timeout indicators
            const rowText = row.innerText.toLowerCase();
            if (rowText.includes('timeout') || rowText.includes('timed out')) {
              error = `Timeout detected: ${rowText}`;
              console.log(`[ReLiti] Timeout explicitly detected for ${id}`);
            }
          }
        }
      }
    }
    
    // Record the final outcome - always track all attempts, even if successful on retry
    if (!success) {
      const failDetails = {
        id,
        description,
        error: error || `Failed after all ${maxAttempts} retry attempts`,
        attempts: attemptCount
      };
      failed.push(failDetails);
      
      // Ensure it's marked as failed in the tracker
      downloadTracker.markFailed(id, failDetails.error);
      
      // Make sure the background script knows about this failure
      chrome.runtime.sendMessage({
        action: 'downloadStatusCheck',
        linkId: id,
        success: false,
        error: failDetails.error,
        attempts: attemptCount
      });
      
      console.log(`[ReLiti] All ${attemptCount} attempts failed for ${id}`);
    } else {
      successCount++;
      // If success came after retries, still log that information
      if (attemptCount > 1) {
        console.log(`[ReLiti] Download successful for ${id} after ${attemptCount} attempts`);
        
        // Report to background that we succeeded but required retries
        chrome.runtime.sendMessage({
          action: 'downloadStatusCheck',
          linkId: id,
          success: true,
          retries: attemptCount - 1,
          notes: `Required ${attemptCount} attempts to succeed`
        });
      } else {
        console.log(`[ReLiti] Download successful for ${id} on first attempt`);
      }
    }
    
    // Update progress
    chrome.runtime.sendMessage({
      action: 'progressUpdate',
      current: i + 1,
      total: idsAndDescriptions.length,
      success: success,
      id: id,
      description: description,
      attempts: attemptCount
    });
  }

  // Double-check for any downloads that weren't properly tracked
  const finalFailed = Object.keys(downloadTracker.failedDownloads).map(id => {
    const existingFailure = failed.find(f => f.id === id);
    if (existingFailure) return existingFailure;
    
    return {
      id,
      description: idsAndDescriptions.find(item => item.id === id)?.description || id,
      error: downloadTracker.failedDownloads[id].error,
      attempts: downloadTracker.getRetryCount(id)
    };
  });
  
  // Send final summary with all failed downloads
  chrome.runtime.sendMessage({
    action: 'downloadSummary',
    total: idsAndDescriptions.length,
    success: idsAndDescriptions.length - finalFailed.length,
    failed: finalFailed
  });
  
  console.log(`[ReLiti] Download process complete. ${successCount} succeeded, ${finalFailed.length} failed.`);
  
  // Final verification - scan the page one more time for any failures
  // that might have been missed
  setTimeout(() => {
    verifyAllDownloads(idsAndDescriptions);
  }, 2000);
}

// One final verification of all downloads
function verifyAllDownloads(idsAndDescriptions) {
  console.log('[ReLiti] Running final verification of all downloads');
  
  // Check for any failures that weren't detected
  let newFailures = 0;
  
  // Check especially for network canceled items
  const downloadLinks = Array.from(document.querySelectorAll("a[id*='LnkBtnPDF']"));
  
  downloadLinks.forEach(link => {
    const row = link.closest('tr');
    if (row) {
      const failureCheck = checkRowForFailure(row);
      if (failureCheck.failed && !downloadTracker.failedDownloads[link.id]) {
        console.log(`[ReLiti] Found previously undetected failure for ${link.id}: ${failureCheck.reason}`);
        downloadTracker.markFailed(link.id, `${failureCheck.reason}: ${failureCheck.text}`);
        newFailures++;
      }
    }
  });
  
  if (newFailures > 0) {
    console.log(`[ReLiti] Found ${newFailures} new failures in final verification`);
    
    // Collect all failed downloads for a new report
    const finalFailed = Object.keys(downloadTracker.failedDownloads).map(id => {
      return {
        id,
        description: idsAndDescriptions.find(item => item.id === id)?.description || id,
        error: downloadTracker.failedDownloads[id].error,
        attempts: downloadTracker.getRetryCount(id)
      };
    });
    
    // Send updated summary
    chrome.runtime.sendMessage({
      action: 'downloadSummary',
      total: idsAndDescriptions.length,
      success: idsAndDescriptions.length - finalFailed.length,
      failed: finalFailed
    });
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'startDownloadsContent') {
    startDownloadProcess(msg.idsAndDescriptions);
    sendResponse({ started: true });
  } else if (msg.action === 'checkDownloadStatus') {
    verifyDownloadSuccess(msg.linkId, 'manual-check');
    sendResponse({ checking: true });
  } else if (msg.action === 'forceScanForFailures') {
    // Scan all rows on the page for failures
    const downloadLinks = Array.from(document.querySelectorAll("a[id*='LnkBtnPDF']"));
    const failures = [];
    
    downloadLinks.forEach(link => {
      const row = link.closest('tr');
      if (row) {
        const failureCheck = checkRowForFailure(row);
        if (failureCheck.failed) {
          failures.push({
            id: link.id,
            description: getRowDescription(link),
            error: failureCheck.reason,
            text: failureCheck.text
          });
        }
      }
    });
    
    sendResponse({ failures, scanned: downloadLinks.length });
  } else if (msg.action === 'retryFailedDownload') {
    // Explicitly retry a specific failed download
    const { linkId } = msg;
    if (linkId) {
      console.log(`[ReLiti] Explicitly retrying download for ${linkId}`);
      const description = document.getElementById(linkId) ? 
        getRowDescription(document.getElementById(linkId)) : linkId;
      
      clickAndMonitorDownload(linkId, description, 
        downloadTracker.getRetryCount(linkId) + 1);
      
      sendResponse({ retrying: true });
    } else {
      sendResponse({ retrying: false, error: "No linkId provided" });
    }
  }
  return true;
});
