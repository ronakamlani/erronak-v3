const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const portfolioData = require('../src/data/portfolio.json');
const BASE_URL = 'https://techacorn.com/';
const OUTPUT_ROOT = path.join(__dirname, '../src/assets/portfolio');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    // Ignore SSL certificate errors
    const agent = new https.Agent({ rejectUnauthorized: false });
    const options = url.startsWith('https') ? { agent } : {};

    protocol.get(url, options, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get ${url} (status: ${res.statusCode})`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          console.log(`✅ Downloaded: ${destPath}`);
          resolve();
        });
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

(async () => {
  console.log('📂 Preparing portfolio image download...');
  ensureDir(OUTPUT_ROOT);

  const downloads = [];

  portfolioData.forEach(project => {
    if (Array.isArray(project.gallery)) {
      project.gallery.forEach(item => {
        if (item.image && item.image.startsWith(BASE_URL)) {
          const relativePath = item.image.replace(BASE_URL, '');
          const folderPath = path.join(OUTPUT_ROOT, path.dirname(relativePath));
          const fileName = path.basename(relativePath);

          ensureDir(folderPath);

          const fileDest = path.join(folderPath, fileName);
          downloads.push({ url: item.image, dest: fileDest });
        }
      });
    }
  });

  console.log(`Found ${downloads.length} images to download.`);

  for (const { url, dest } of downloads) {
    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`❌ Failed downloading ${url}: ${err.message}`);
    }
  }

  console.log('✅ All image downloads attempted.');
})();