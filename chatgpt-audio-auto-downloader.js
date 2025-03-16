// ChatGPT Read Aloud Audio Downloader
// Paste this in your browser console when on ChatGPT

(function() {
  console.log("ChatGPT Audio Downloader activated!");
  
  // Keep track of audio URLs we've seen
  const processedUrls = new Set();
  
  // Create UI for downloads
  const createDownloadUI = () => {
    const container = document.createElement('div');
    container.id = 'audio-download-ui';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #10a37f;
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: none;
    `;
    container.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: bold;">Audio Downloader</div>
      <div id="audio-download-status">Waiting for audio...</div>
      <div id="audio-download-link" style="margin-top: 8px;"></div>
    `;
    document.body.appendChild(container);
    return container;
  };
  
  // Initialize the UI
  const downloadUI = createDownloadUI();
  downloadUI.style.display = 'block';
  const statusElement = document.getElementById('audio-download-status');
  const linkContainer = document.getElementById('audio-download-link');
  
  // Function to download blob as file
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    
    // Show info in the UI
    statusElement.textContent = 'Auto-downloading audio...';
    
    // Create download buttons as fallback options
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'chatgpt-audio.mp3';
    a.style.cssText = `
      display: inline-block;
      background: white;
      color: #10a37f;
      padding: 5px 10px;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 5px;
      font-weight: bold;
    `;
    a.textContent = 'Download Audio (Manual)';
    
    // Make sure we clear any previous download links
    linkContainer.innerHTML = '';
    linkContainer.appendChild(a);
    
    // Log to console for debugging
    console.log('Auto-downloading audio file:', filename);
    
    // AUTO DOWNLOAD - Create and trigger a temporary link
    const autoDownloadLink = document.createElement('a');
    autoDownloadLink.href = url;
    autoDownloadLink.download = filename;
    autoDownloadLink.style.display = 'none';
    document.body.appendChild(autoDownloadLink);
    
    // Trigger the download automatically
    setTimeout(() => {
      autoDownloadLink.click();
      statusElement.textContent = 'Audio downloaded automatically!';
      console.log('Auto-download initiated for:', filename);
      
      // Clean up after download starts
      setTimeout(() => {
        document.body.removeChild(autoDownloadLink);
        // Keep URL object a bit longer
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 1000);
    }, 500);
    
    // Add a direct click handler as backup
    a.addEventListener('click', function(e) {
      console.log('Manual download link clicked');
      // Keep the URL object around a bit longer
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  };
  
  // Listen for fetch requests
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    const response = await originalFetch(input, init);
    
    try {
      // Clone the response so we can examine it without consuming it
      const responseClone = response.clone();
      
      // Check if this is an audio response
      const url = typeof input === 'string' ? input : input.url;
      const contentType = response.headers.get('content-type');
      
      if (
        url && 
        !processedUrls.has(url) && 
        (
          (contentType && (
            contentType.includes('audio') || 
            contentType.includes('mp3') || 
            contentType.includes('mpeg')
          )) ||
          url.includes('tts') || 
          url.includes('audio') || 
          url.includes('voice')
        )
      ) {
        processedUrls.add(url);
        statusElement.textContent = 'Audio detected! Processing...';
        
        // Get the audio blob
        responseClone.blob().then(blob => {
          console.log('Audio URL detected:', url);
          console.log('Content-Type:', contentType);
          
          // Generate filename based on timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `chatgpt-audio-${timestamp}.mp3`;
          
          statusElement.textContent = 'Audio ready for download!';
          downloadBlob(blob, filename);
        }).catch(err => {
          console.error('Error processing audio:', err);
          statusElement.textContent = 'Error processing audio';
        });
      }
    } catch (e) {
      console.error('Error in fetch interceptor:', e);
    }
    
    return response;
  };
  
  // Also intercept XMLHttpRequest for older implementations
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this.addEventListener('load', function() {
      try {
        if (
          url && 
          !processedUrls.has(url) && 
          (
            (this.getResponseHeader('content-type') && (
              this.getResponseHeader('content-type').includes('audio') || 
              this.getResponseHeader('content-type').includes('mp3')
            )) ||
            url.includes('tts') || 
            url.includes('audio') || 
            url.includes('voice')
          )
        ) {
          processedUrls.add(url);
          statusElement.textContent = 'Audio detected via XHR! Processing...';
          
          console.log('Audio URL detected via XHR:', url);
          
          if (this.response instanceof Blob) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `chatgpt-audio-${timestamp}.mp3`;
            
            statusElement.textContent = 'Audio ready for download!';
            downloadBlob(this.response, filename);
          }
        }
      } catch (e) {
        console.error('Error in XHR interceptor:', e);
      }
    });
    
    return originalXHROpen.apply(this, arguments);
  };
  
  // Add close button to the UI
  const closeButton = document.createElement('div');
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 8px;
    cursor: pointer;
    font-size: 16px;
  `;
  closeButton.textContent = '×';
  closeButton.onclick = () => {
    downloadUI.style.display = 'none';
  };
  downloadUI.style.position = 'relative';
  downloadUI.appendChild(closeButton);
  
  // Add toggle button in case user wants to show UI again
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Audio DL';
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10a37f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    z-index: 9999;
    display: none;
  `;
  toggleButton.onclick = () => {
    downloadUI.style.display = 'block';
    toggleButton.style.display = 'none';
  };
  document.body.appendChild(toggleButton);
  
  closeButton.onclick = () => {
    downloadUI.style.display = 'none';
    toggleButton.style.display = 'block';
  };
})();
