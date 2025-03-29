process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const OPENAPI_URL = 'https://localhost:8080/api/method/ebay.api.swagger.generate';
const TEMP_DIR = os.tmpdir();
const OPENAPI_FILE = path.join(TEMP_DIR, 'openapi.json');
const OUTPUT_FILE = './src/clients/FrappeClient.ts';

async function fetchAndSaveOpenApi() {
    try {
        console.log('📡 Fetching OpenAPI specification...');
        const response = await fetch(OPENAPI_URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.statusText}`);
        }

        const data = await response.json();
        fs.writeFileSync(OPENAPI_FILE, JSON.stringify(data['message'], null, 2));
        console.log(`✅ OpenAPI specification saved to ${OPENAPI_FILE}`);

        generateTypeScriptClient();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

function generateTypeScriptClient() {
    console.log('⚙️ Generating TypeScript client using NSwag...');
    
    const command = `nswag openapi2tsclient /input:${OPENAPI_FILE} /output:${OUTPUT_FILE} /ClassName:FrappeBackendClient`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Generation error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ NSwag warning: ${stderr}`);
        }
        console.log(`✅ TypeScript client generated: ${OUTPUT_FILE}`);
        console.log(stdout);
    });
}

// Запуск процесса
fetchAndSaveOpenApi();
