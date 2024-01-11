chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    fetch(request.input, request.init).then(function (response) {
        return response.text().then(function (text) {
            sendResponse([{
                body: text,
                status: response.status,
                statusText: response.statusText,
            }, null]);
        });
    }, function (error) {
        sendResponse([null, error]);
    });
    return true;
});

/*import {Client} from './EbayClient/EbayClient.js'

const baseUrl = "https://178.208.65.100:17443/api/ebay/v1/";

function fetchResource(input, init) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                // Use undefined on a 204 - No Content
                const body = response.body ? new Blob([response.body]) : undefined;
                resolve(new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
            }
        });
    });
}
const client = new Client(baseUrl, {fetch: fetchResource});
client.getAllProducts()
*/