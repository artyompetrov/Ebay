chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    fetch(request.input, request.init).then(function (response) {
        return response.text().then(function (text) {
            
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            
            sendResponse([{
                body: text,
                status: response.status,
                statusText: response.statusText,
                headers: headers
            }, null]);
        });
    }, function (error) {
        sendResponse([null, error]);
    });
    return true;
});