import bot from './assets/bot.svg'
import user from './assets/user.svg'

const fileInput = document.getElementById('fileInput');
const submitButton = document.getElementById('submitButton');
const resultsDiv = document.getElementById('resultsDiv');
const downloadButton = document.getElementById('downloadButton');

submitButton.addEventListener('click', async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://chatgpt.developeralmagir.com/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    alert('Error processing file');
    return;
  }

  const results = await response.json();

  resultsDiv.innerHTML = '';

  for (const result of results) {
    const promptDiv = document.createElement('div');
    promptDiv.innerHTML = `<strong>Prompt:</strong> ${result.prompt}`;

    const botDiv = document.createElement('div');
    botDiv.innerHTML = `<strong>Bot:</strong> ${result.bot}`;

    const separator = document.createElement('hr');

    resultsDiv.appendChild(promptDiv);
    resultsDiv.appendChild(botDiv);
    resultsDiv.appendChild(separator);
  }

  const text = results.map(result => result.bot).join('\n');
  downloadButton.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
});

downloadButton.addEventListener('click', () => {
  downloadButton.download = 'generated_text.txt';
});
