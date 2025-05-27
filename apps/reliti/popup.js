// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const reportCountElem = document.getElementById('reportCount');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const summaryElem = document.getElementById('summary');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const etaText = document.getElementById('etaText');
  const actionRow = document.querySelector('.action-row');
  const failedDownloadsContainer = document.getElementById('failed-downloads');
  const failedListContainer = document.getElementById('failed-list');
  const retryAllBtn = document.getElementById('retry-all-btn');

  // Track which downloads are currently being retried
  const retryingDownloads = new Set();

  // ETA tracking variables
  let downloadStartTime = 0;
  let lastUpdateTime = 0;
  let downloadTimes = [];
  const MAX_DOWNLOAD_TIMES = 10; // Only keep track of the last 10 downloads for average calculation

  // Get the current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab.id;
  
  // Function to reset the popup to initial state
  function resetPopup() {
    // Add spinning animation to refresh button
    refreshBtn.classList.add('spinning');
    
    // Reset UI
    reportCountElem.textContent = 'Loading…';
    startBtn.disabled = true;
    stopBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    progressBarContainer.style.display = 'none';
    progressText.textContent = '';
    etaText.textContent = '';
    summaryElem.innerHTML = '';
    failedDownloadsContainer.style.display = 'none';
    failedListContainer.innerHTML = '';
    actionRow.style.display = 'none';
    
    // Reset tracking
    downloadStartTime = 0;
    downloadTimes = [];
    retryingDownloads.clear();
    
    // Clear the download state in storage
    chrome.storage.local.remove('downloadState', () => {
      console.log('[Popup] Reset: Download state cleared from storage');
      
      // Re-fetch the report counts and IDs
      loadInitialData();
    });
  }
  
  // Function to load initial data
  async function loadInitialData() {
    try {
      // Get report IDs from the page
      const [{ result: idsAndDescriptions }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          // Add more detailed logging to help debug issues
          console.log('[ReLiti] Searching for download links on page...');
          const links = document.querySelectorAll("a[id*='LnkBtnPDF']");
          console.log(`[ReLiti] Found ${links.length} download links on page`);
          
          return Array.from(links).map(a => {
            const row = a.closest('tr');
            let description = '';
            if (row) {
              description = Array.from(row.children).map(cell => cell.innerText.trim()).filter(Boolean).join(', ');
            }
            return { id: a.id, description };
          });
        }
      });
      
      window.ids = idsAndDescriptions.map(x => x.id);
      window.descriptions = Object.fromEntries(idsAndDescriptions.map(x => [x.id, x.description]));
      const total = ids.length;
      
      reportCountElem.textContent = `${total} reports found`;
      startBtn.disabled = total === 0;
      
      // Remove spinning animation
      refreshBtn.classList.remove('spinning');
    } catch (error) {
      console.error('Error loading initial data:', error);
      reportCountElem.textContent = 'Error loading data';
      refreshBtn.classList.remove('spinning');
    }
  }
  
  // Function to calculate and update ETA
  function updateETA(current, total) {
    if (!downloadStartTime || current === 0) {
      downloadStartTime = Date.now();
      lastUpdateTime = downloadStartTime;
      etaText.textContent = 'Calculating ETA...';
      return;
    }

    const now = Date.now();
    const timeForLastDownload = now - lastUpdateTime;
    lastUpdateTime = now;
    
    // Keep track of download times for better average
    downloadTimes.push(timeForLastDownload);
    if (downloadTimes.length > MAX_DOWNLOAD_TIMES) {
      downloadTimes.shift(); // Remove oldest time
    }
    
    // Calculate average time per download
    const avgTimePerDownload = downloadTimes.reduce((sum, time) => sum + time, 0) / downloadTimes.length;
    
    // Calculate remaining time
    const remainingDownloads = total - current;
    const estimatedTimeMs = remainingDownloads * avgTimePerDownload;
    
    // Format the ETA
    if (estimatedTimeMs < 1000) {
      etaText.textContent = 'Less than a second remaining';
    } else if (estimatedTimeMs < 60000) {
      const seconds = Math.ceil(estimatedTimeMs / 1000);
      etaText.textContent = `About ${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
    } else if (estimatedTimeMs < 3600000) {
      const minutes = Math.floor(estimatedTimeMs / 60000);
      const seconds = Math.ceil((estimatedTimeMs % 60000) / 1000);
      etaText.textContent = `About ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds > 0 ? `and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''} remaining`;
    } else {
      const hours = Math.floor(estimatedTimeMs / 3600000);
      const minutes = Math.ceil((estimatedTimeMs % 3600000) / 60000);
      etaText.textContent = `About ${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''} remaining`;
    }
  }
  
  // Handle a retry for a specific download
  function retryDownload(id) {
    if (retryingDownloads.has(id)) {
      return; // Already retrying this one
    }
    
    // Mark as retrying
    retryingDownloads.add(id);
    console.log(`[Popup] Requesting retry for download ${id}`);
    
    // Update UI to show retrying status
    const retryBtn = document.querySelector(`[data-id="${id}"] .retry-btn`);
    if (retryBtn) {
      const retryingSpan = document.createElement('span');
      retryingSpan.className = 'retrying';
      retryingSpan.textContent = 'Retrying...';
      retryBtn.replaceWith(retryingSpan);
    }
    
    // Send retry request to background script
    chrome.runtime.sendMessage({
      action: 'retryFailedDownload',
      id: id
    });
  }
  
  // Function to update the failed downloads display with retry buttons
  function updateFailedDownloads(failedDownloads) {
    if (!failedDownloads || failedDownloads.length === 0) {
      failedDownloadsContainer.style.display = 'none';
      retryAllBtn.style.display = 'none';
      return;
    }
    
    failedDownloadsContainer.style.display = 'block';
    retryAllBtn.style.display = 'inline-block';
    failedListContainer.innerHTML = '';
    
    // Update the title to show count
    const failedTitle = failedDownloadsContainer.querySelector('.failed-title');
    if (failedTitle) {
      failedTitle.firstChild.textContent = `Failed Downloads (${failedDownloads.length}) `;
    }
    
    failedDownloads.forEach(fail => {
      const failItem = document.createElement('div');
      failItem.className = 'failed-item';
      failItem.setAttribute('data-id', fail.id);
      
      // Container for the text content
      const textDiv = document.createElement('div');
      textDiv.className = 'failed-item-text';
      
      const description = fail.description || fail.id;
      let errorText = fail.error ? `: ${fail.error}` : '';
      
      // Don't show the full error message, truncate if too long
      if (errorText.length > 40) {
        errorText = errorText.substring(0, 37) + '...';
      }
      
      textDiv.textContent = description + errorText;
      
      // Add attempts if available
      if (fail.attempts) {
        const attemptsSpan = document.createElement('span');
        attemptsSpan.className = 'failed-attempts';
        attemptsSpan.textContent = ` (${fail.attempts} attempts)`;
        textDiv.appendChild(attemptsSpan);
      }
      
      failItem.appendChild(textDiv);
      
      // Add retry button if not already retrying
      if (!retryingDownloads.has(fail.id)) {
        const retryBtn = document.createElement('button');
        retryBtn.className = 'retry-btn';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', () => {
          retryDownload(fail.id);
        });
        failItem.appendChild(retryBtn);
      } else {
        // Show retrying status
        const retryingSpan = document.createElement('span');
        retryingSpan.className = 'retrying';
        retryingSpan.textContent = 'Retrying...';
        failItem.appendChild(retryingSpan);
      }
      
      failedListContainer.appendChild(failItem);
    });
  }

  // Load initial data when popup opens
  loadInitialData();

  function showSummary(total, failed, descriptions) {
    const successCount = total - failed.length;
    
    let html = `<b>${successCount} of ${total} reports downloaded successfully</b>`;
    
    if (failed.length > 0) {
      html += `<p style="margin-top:8px;"><b>${failed.length} file${failed.length > 1 ? 's' : ''} failed to download</b> despite multiple retry attempts.</p>`;
      if (failed.length > 5) {
        html += `<p style="margin-top:4px;font-size:12px;">See the Failed Downloads section below for details. You can try to retry specific files.</p>`;
      } else {
        html += `<p style="margin-top:4px;font-size:12px;">You can click the "Retry" button on failed files to try again.</p>`;
      }
    } else {
      html += `<p style="margin-top:8px;color:var(--success-color);"><b>✓ All files downloaded successfully!</b></p>`;
    }
    
    summaryElem.innerHTML = html;
    updateFailedDownloads(failed);
    etaText.textContent = '';
  }

  function updateProgress(current, total) {
    if (total > 0) {
      progressBarContainer.style.display = '';
      const pct = Math.round((current / total) * 100);
      progressBar.style.width = pct + '%';
      progressText.textContent = `${current} / ${total} downloaded`;
      
      // Update ETA if downloading is in progress
      if (current > 0 && current < total) {
        updateETA(current, total);
      } else if (current >= total) {
        etaText.textContent = 'Download complete!';
      }
    } else {
      progressBarContainer.style.display = 'none';
      progressText.textContent = '';
      etaText.textContent = '';
    }
  }

  function updateUI(state) {
    updateProgress(state.current, state.total);
    startBtn.disabled = state.isDownloading;
    stopBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    resumeBtn.style.display = 'none';

    // Always update failed downloads list if available
    if (state.failedDownloads && state.failedDownloads.length > 0) {
      updateFailedDownloads(state.failedDownloads);
    }

    if (state.isDownloading && !state.isPaused) {
      actionRow.style.display = 'flex';
      stopBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'inline-block';
      stopBtn.textContent = 'Stop download';
      pauseBtn.textContent = 'Pause download';
      summaryElem.innerHTML = '<div class="loading-animation">Download in progress...</div>';
      
      // Restore default handlers
      stopBtn.onclick = () => {
        summaryElem.textContent = 'Stopping downloads...';
        chrome.runtime.sendMessage({ action: 'stopDownloads' });
      };
      pauseBtn.onclick = () => {
        summaryElem.innerHTML = 'Download paused. Press "Resume download" to continue from where you left off, or "Restart download" to start from the beginning.';
        chrome.runtime.sendMessage({ action: 'pauseDownloads' });
      };
    } else if (state.isPaused) {
      actionRow.style.display = 'flex';
      stopBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'inline-block';
      
      // Relabel buttons
      stopBtn.textContent = 'Restart download';
      pauseBtn.textContent = 'Resume download';
      
      // Set handlers for paused state
      stopBtn.onclick = () => {
        summaryElem.innerHTML = '<div class="loading-animation">Restarting downloads from the beginning...</div>';
        downloadStartTime = 0; // Reset download time tracking
        downloadTimes = [];
        chrome.runtime.sendMessage({
          action: 'startDownloads',
          tabId,
          ids,
          descriptions,
          delayMs: 3000
        });
      };
      pauseBtn.onclick = () => {
        summaryElem.innerHTML = '<div class="loading-animation">Resuming downloads...</div>';
        lastUpdateTime = Date.now(); // Update the last time before resuming
        chrome.runtime.sendMessage({ action: 'resumeDownloads' });
      };
      summaryElem.innerHTML = 'Download paused. Press "Resume download" to continue from where you left off, or "Restart download" to start from the beginning.';
      etaText.textContent = 'Download paused';
    } else if (state.current === state.total && state.total > 0) {
      actionRow.style.display = 'none';
      showSummary(state.total, state.failedDownloads || [], state.descriptions);
      etaText.textContent = '';
    } else if (state.current > 0 && state.current < state.total) {
      actionRow.style.display = 'flex';
      restartBtn.style.display = 'inline-block';
      restartBtn.textContent = 'Restart download';
      restartBtn.onclick = () => {
        summaryElem.innerHTML = '<div class="loading-animation">Restarting downloads from the beginning...</div>';
        downloadStartTime = 0; // Reset download time tracking
        downloadTimes = [];
        chrome.runtime.sendMessage({
          action: 'startDownloads',
          tabId,
          ids,
          descriptions,
          delayMs: 3000
        });
      };
      summaryElem.innerHTML = 'Download stopped. You can restart.';
      etaText.textContent = '';
    } else {
      actionRow.style.display = 'none';
      summaryElem.innerHTML = '';
      failedDownloadsContainer.style.display = 'none';
      etaText.textContent = '';
    }
  }

  // Handle "Retry All" button click
  retryAllBtn.addEventListener('click', () => {
    const failedItems = document.querySelectorAll('.failed-item');
    failedItems.forEach(item => {
      const id = item.getAttribute('data-id');
      if (id && !retryingDownloads.has(id)) {
        retryDownload(id);
      }
    });
  });
  
  // Handle Refresh button click - simplified implementation
  refreshBtn.addEventListener('click', () => {
    console.log('[Popup] Refresh button clicked');
    // Direct approach - reset the state and reload
    chrome.runtime.sendMessage({ action: 'resetState' }, () => {
      console.log('[Popup] State reset, refreshing popup');
      resetPopup();
    });
  });
  
  // On load, check for existing download state
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    // Only restore state if there's actual download progress
    if (response && response.total > 0 && (response.current > 0 || response.isDownloading)) {
      console.log(`[Popup] Restoring previous session: ${response.current}/${response.total}`);
      updateUI(response);
    } else {
      console.log('[Popup] No active download session found');
    }
  });

  startBtn.addEventListener('click', async () => {
    try {
      startBtn.disabled = true;
      summaryElem.innerHTML = '<div class="loading-animation">Starting download...</div>';
      updateProgress(0, ids.length);
      failedDownloadsContainer.style.display = 'none';
      downloadStartTime = 0; // Reset download time tracking
      downloadTimes = [];
      retryingDownloads.clear(); // Clear retry tracking
      
      console.log(`[ReLiti] Starting download for ${ids.length} reports`);
      
      chrome.runtime.sendMessage({
        action: 'startDownloads',
        tabId,
        ids,
        descriptions,
        delayMs: 3000
      }, response => {
        // Check for errors in the response
        if (chrome.runtime.lastError) {
          console.error('[ReLiti] Error sending start message:', chrome.runtime.lastError);
          summaryElem.innerHTML = `Error starting download: ${chrome.runtime.lastError.message}`;
          startBtn.disabled = false;
        } else if (response && !response.success) {
          console.error('[ReLiti] Start download failed:', response);
          summaryElem.innerHTML = `Download failed to start: ${response.error || 'Unknown error'}`;
          startBtn.disabled = false;
        }
      });
    } catch (error) {
      console.error('[ReLiti] Exception in start download:', error);
      summaryElem.innerHTML = `Exception occurred: ${error.message}`;
      startBtn.disabled = false;
    }
  });

  stopBtn.addEventListener('click', () => {
    summaryElem.textContent = 'Stopping downloads...';
    chrome.runtime.sendMessage({ action: 'stopDownloads' });
  });

  pauseBtn.addEventListener('click', () => {
    summaryElem.innerHTML = 'Download paused. Press "Resume download" to continue from where you left off, or "Restart download" to start from the beginning.';
    etaText.textContent = 'Download paused';
    chrome.runtime.sendMessage({ action: 'pauseDownloads' });
  });

  resumeBtn.addEventListener('click', () => {
    summaryElem.innerHTML = '<div class="loading-animation">Resuming downloads...</div>';
    lastUpdateTime = Date.now(); // Update the last time before resuming
    chrome.runtime.sendMessage({ action: 'resumeDownloads' });
  });

  restartBtn.addEventListener('click', () => {
    summaryElem.innerHTML = '<div class="loading-animation">Restarting downloads from the beginning...</div>';
    downloadStartTime = 0; // Reset download time tracking
    downloadTimes = [];
    retryingDownloads.clear(); // Clear retry tracking
    chrome.runtime.sendMessage({
      action: 'startDownloads',
      tabId,
      ids,
      descriptions,
      delayMs: 3000
    });
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'statusUpdate') {
      // A status update might indicate a successful retry
      if (msg.failedDownloads) {
        // Compare with current retrying set to see if any have been resolved
        retryingDownloads.forEach(id => {
          // If a retrying download is no longer in the failed list, it succeeded
          if (!msg.failedDownloads.some(item => item.id === id)) {
            retryingDownloads.delete(id);
          }
        });
      }
      updateUI(msg);
    }
  });
});
