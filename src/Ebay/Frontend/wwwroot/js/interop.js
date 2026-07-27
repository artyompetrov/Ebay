

export function SetFocusByElementId(elementId) {
    let element = document.getElementById(elementId);
    element.focus();
}

const mobileUserAgentPattern = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;
const mobileReaderClass = "qr-scanner-mobile";
const nonMobileReaderClass = "qr-scanner-non-mobile";

export function IsMobileClient(clientNavigator = navigator) {
    if (typeof clientNavigator.userAgentData?.mobile === "boolean") {
        return clientNavigator.userAgentData.mobile;
    }

    return mobileUserAgentPattern.test(clientNavigator.userAgent ?? "");
}

export function ApplyQrScannerOrientation(reader, isMobileClient) {
    reader.classList.remove(mobileReaderClass, nonMobileReaderClass);
    reader.classList.add(isMobileClient ? mobileReaderClass : nonMobileReaderClass);
}

export function StartQrScanner() {
    const reader = document.getElementById("reader");
    ApplyQrScannerOrientation(reader, IsMobileClient());

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
