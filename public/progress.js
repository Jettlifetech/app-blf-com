const socket = io();

socket.on('scan-progress', (data) => {
  const { scannedCount, totalUrls, brokenUrls } = data;
  const progressPercent = totalUrls ? (scannedCount / totalUrls) * 100 : 0;
  document.getElementById('progress-bar').value = progressPercent;
  document.getElementById('status-text').textContent = `Scanned ${scannedCount} of ${totalUrls} URLs`;
  // Update total_urls and total_broken_urls elements in real-time
  document.getElementById('total_urls').textContent = totalUrls;
  document.getElementById('total_broken_urls').textContent = brokenUrls;
});

socket.on('report-generated', (reportPath) => {
  // Handle the event when the report is generated
  const downloadButton = document.getElementById('download-report');
  downloadButton.href = reportPath;
  downloadButton.style.display = 'block';
});

socket.on('scan-complete', () => {
  document.getElementById('status-text').textContent = 'Scan complete!';
  showModal();
});

function showModal() {
  document.getElementById('modal').style.display = 'block';
}

function toggleFullscreen() {
  const progressContainer = document.getElementById('progress-container');
  if (!document.fullscreenElement) {
    progressContainer.requestFullscreen().catch((err) => alert(`Error: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

// Function to show the realtime_results div
function showRealtimeResults() {
  document.getElementById('realtime_results').style.display = 'block';
  // Start the timer here if needed
}

// Assuming there is a "Run Commands" button with an ID of 'run-commands'
document.getElementById('run-commands').addEventListener('click', () => {
  showRealtimeResults();
  // Start the timer here if needed
});
