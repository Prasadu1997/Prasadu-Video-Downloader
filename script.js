// Prasadu's Video Downloader - script.js
// Basic frontend + placeholder API call (replace with real API later)

const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const statusMessage = document.getElementById('statusMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultArea = document.getElementById('result');
const thumbnailImg = document.getElementById('thumbnail');
const titleEl = document.getElementById('title');
const durationEl = document.getElementById('duration');
const qualityOptions = document.getElementById('qualityOptions');
const darkModeToggle = document.getElementById('darkModeToggle');

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Enable/disable download button when URL is entered
videoUrlInput.addEventListener('input', () => {
  downloadBtn.disabled = !videoUrlInput.value.trim();
});

// Download button click
downloadBtn.addEventListener('click', async () => {
  const url = videoUrlInput.value.trim();
  if (!url) return;

  // Reset UI
  resultArea.style.display = 'none';
  loadingSpinner.style.display = 'block';
  statusMessage.textContent = 'Fetching video info...';
  qualityOptions.innerHTML = '';
  thumbnailImg.src = '';
  titleEl.textContent = '';
  durationEl.textContent = '';

  downloadBtn.disabled = true;

  try {
    // Placeholder API call - REPLACE THIS WITH REAL VIDEO DOWNLOADER API
    // Example: RapidAPI, savefrom.net API, or your own backend
    const response = await fetch(`https://api.allvideodownloader.net/api?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
      statusMessage.textContent = data.error || 'Failed to fetch video. Try another URL.';
      loadingSpinner.style.display = 'none';
      downloadBtn.disabled = false;
      return;
    }

    // Show preview
    thumbnailImg.src = data.thumbnail || '';
    titleEl.textContent = data.title || 'Video Title';
    durationEl.textContent = data.duration || 'Duration: Unknown';

    // Show quality options
    data.formats.forEach(format => {
      const btn = document.createElement('a');
      btn.href = format.url;
      btn.textContent = `${format.quality} - ${format.ext.toUpperCase()}`;
      btn.className = 'quality-btn';
      btn.download = `${data.title || 'video'}.${format.ext}`;
      btn.target = '_blank';
      qualityOptions.appendChild(btn);
    });

    loadingSpinner.style.display = 'none';
    resultArea.style.display = 'block';
    statusMessage.textContent = 'Ready to download!';
    downloadBtn.disabled = false;
  } catch (error) {
    statusMessage.textContent = 'Error: Could not fetch video. Check URL or try later.';
    loadingSpinner.style.display = 'none';
    downloadBtn.disabled = false;
    console.error('Fetch error:', error);
  }
});