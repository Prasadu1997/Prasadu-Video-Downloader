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
const totalSavingsEl = document.getElementById('totalSavings');
const darkModeToggle = document.getElementById('darkModeToggle');

let downloadedBlobs = [];

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Enable/disable download button
urlInput.addEventListener('input', () => {
  downloadBtn.disabled = !urlInput.value.trim();
});

// Download button click
downloadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return;

  resultArea.style.display = 'none';
  loadingSpinner.style.display = 'block';
  progressContainer.style.display = 'block';
  downloadBtn.disabled = true;
  statusMessage.textContent = 'Fetching video info...';

  previewsContainer.innerHTML = '';
  downloadedBlobs = [];
  progressBar.value = 0;
  progressText.textContent = '0%';

  try {
    const apiKey = 'dbd4dc0ccbmsheceda5d4798d6c9p175e8bjsnb8e48a10408b'; // Your key
    const host = 'all-media-downloader1.p.rapidapi.com';

    const response = await fetch(`https://${host}/download?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host
      }
    });

    if (!response.ok) throw new Error('API error: ' + response.status);

    const data = await response.json();

    if (data.error) throw new Error(data.error);

    // Show preview
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
      <strong>${data.title || 'Video'}</strong><br>
      ${data.thumbnail ? `<img src="${data.thumbnail}" alt="Thumbnail" style="max-width:100%; border-radius:8px;">` : ''}
      <div class="file-progress-container">
        <div class="file-progress-bar file-complete"></div>
      </div>
      <small>Available qualities:</small>
      <div class="download-options"></div>
    `;
    previewsContainer.appendChild(item);

    const optionsContainer = item.querySelector('.download-options');

    // Assume API returns data.formats array (adjust based on your API response)
    (data.formats || []).forEach(format => {
      const btn = document.createElement('a');
      btn.href = format.url;
      btn.textContent = `${format.quality || format.res} (${format.ext || 'MP4'})`;
      btn.className = 'download-single';
      btn.download = `${data.title || 'video'}.${format.ext || 'mp4'}`;
      optionsContainer.appendChild(btn);
    });

    progressBar.value = 100;
    progressText.textContent = 'Ready 100%';
    loadingSpinner.style.display = 'none';
    resultArea.style.display = 'block';
    progressContainer.style.display = 'none';
    statusMessage.textContent = 'Video ready!';
    downloadBtn.disabled = false;

  } catch (error) {
    statusMessage.textContent = 'Error: ' + error.message + '. Check URL or API limits.';
    loadingSpinner.style.display = 'none';
    downloadBtn.disabled = false;
  }
});