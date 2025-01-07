const fs = require('fs');

const version = process.argv[2];
if (!version) {
  console.error('Version not set');
  process.exit(1);
}

// Обновление manifest.json
const manifestJson = JSON.parse(fs.readFileSync('_extension/manifest.json', 'utf8'));
manifestJson.version = version;
fs.writeFileSync('_extension/manifest.json', JSON.stringify(manifestJson, null, 2));

console.log(`version updated ${version}`);
