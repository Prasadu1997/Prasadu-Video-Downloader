const urlInput = document.getElementById('urlInput');
const downloadBtn = document.getElementById('downloadBtn');
const urlZone = document.getElementById('urlZone');
const statusMessage = document.getElementById('statusMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultArea = document.getElementById('result');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const previewsContainer = document.getElementById('previewsContainer');
const totalSavings = document.getElementById('totalSavings');
const darkModeToggle = document.getElementById('darkModeToggle');

let downloadedFiles = [];

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Enable/disable download button
function updateDownloadButton() {
  const url = urlInput.value.trim();
  downloadBtn.disabled = !url;  // Enable if URL is not empty
}

urlInput.addEventListener('input', updateDownloadButton);
updateDownloadButton();  // Initial state

urlZone.addEventListener('click', () => urlInput.focus());

downloadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    statusMessage.textContent = 'Please paste a valid video URL';
    statusMessage.className = 'status-message';
    return;
  }

  resultArea.style.display = 'none';
  loadingSpinner.style.display = 'block';
  progressContainer.style.display = 'block';
  downloadBtn.disabled = true;
  statusMessage.textContent = 'Fetching video...';

  previewsContainer.innerHTML = '';
  downloadedFiles = [];
  progressBar.value = 0;
  progressText.textContent = '0%';

  try {
    // YOUR RAPIDAPI DETAILS (already in your code)
    const apiKey = 'dbd4dc0ccbmsheceda5d4798d6c9p175e8bjsnb8e48a10408b';
    const host = 'all-media-downloader1.p.rapidapi.com';
    const endpoint = '/all';

    const response = await fetch(`https://${host}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': host,
        'x-rapidapi-key': apiKey
      },
      body: new URLSearchParams({
        url: url
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error || !data.url) {
      throw new Error(data.error || 'No download link returned');
    }

    // Show result (adjust if your API response fields are different)
    const title = data.title || 'Downloaded Video';
    const thumbnail = data.thumbnail || '';
    const downloadUrl = data.url || data.downloadUrl || data.videoUrl;

    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
      <strong>${title}</strong><br>
      ${thumbnail ? `<img src="${thumbnail}" alt="Thumbnail" style="max-width:100%; border-radius:8px; margin:10px 0;">` : ''}
      <div class="file-progress-container">
        <div class="file-progress-bar file-complete"></div>
      </div>
      <a href="${downloadUrl}" class="primary-btn" download="${title.replace(/[^a-z0-9]/gi, '_')}.mp4">Download Video</a>
    `;
    previewsContainer.appendChild(item);

    progressBar.value = 100;
    progressText.textContent = 'Ready 100%';
    loadingSpinner.style.display = 'none';
    resultArea.style.display = 'block';
    progressContainer.style.display = 'none';
    statusMessage.textContent = 'Video ready! Click to download.';
    downloadBtn.disabled = false;

  } catch (error) {
    statusMessage.textContent = 'Error: ' + error.message + '. Check URL or try later.';
    loadingSpinner.style.display = 'none';
    downloadBtn.disabled = false;
    console.error('Download error:', error);
  }
});