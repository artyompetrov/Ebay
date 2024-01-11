let mainSrc = chrome.runtime.getURL("main.js");

async function run() {
    let mainModule = await import(mainSrc);
    await mainModule.run();
}

run();