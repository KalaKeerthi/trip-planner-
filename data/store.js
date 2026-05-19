const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readJson(filename, defaultValue) {
  ensureDataDir();
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function writeJson(filename, data) {
  ensureDataDir();
  fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJson, writeJson };
