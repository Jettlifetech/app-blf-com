const socket = io();

socket.on('scan-progress', (data) => {
  const { scannedCount, totalUrls } = data;
  const progressPercent = totalUrls ? (scannedCount / totalUrls) * 100 : 0;
  document.getElementById('progress-bar').value = progressPercent;
  document.getElementById('status-text').textContent = `Scanned ${scannedCount} of ${totalUrls} URLs`;
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
