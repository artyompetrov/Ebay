const fs = require('fs');
const path = require('path');

const backendDomain = process.env.EBAY_HELPER_BACKEND_DOMAIN;
if (!backendDomain) {
  console.error('EBAY_HELPER_BACKEND_DOMAIN is not set');
  process.exit(1);
}

const version = process.env.BUILD_VERSION || "0.0.0.1"

const templatePath = path.join(__dirname, '_extension', 'manifest.json.template');
const outputPath = path.join(__dirname, '_extension', 'manifest.json');

const template = fs.readFileSync(templatePath, 'utf8');
const replaced = template.replace(/\$EBAY_HELPER_BACKEND_DOMAIN/g, backendDomain);
const manifest = JSON.parse(replaced);
manifest.version = version;

fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log(`manifest generated for ${backendDomain} version ${version}`);
