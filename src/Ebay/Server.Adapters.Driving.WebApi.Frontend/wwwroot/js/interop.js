

export function SetFocusByElementId(elementId) {
    let element = document.getElementById(elementId);
    element.focus();
}

export function StartQrScanner() {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: 250 };

    return new Promise((resolve, reject) => {
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText, decodedResult) => {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                    resolve(decodedText);
                });
            },
            errorMessage => {
                // можно игнорировать
            }
        ).catch(err => {
            reject(err);
        });
    });
}