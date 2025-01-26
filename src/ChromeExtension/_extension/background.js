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

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "processText",
        title: "Добавить товар",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "processText" && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, { action: "processText", text: info.selectionText }, (response) => { });
    }
});