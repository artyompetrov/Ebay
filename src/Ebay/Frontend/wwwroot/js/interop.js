

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

let activeZoomSlider = null;

function removeZoomSlider() {
    activeZoomSlider?.remove();
    activeZoomSlider = null;
}

function createZoomSlider(html5QrCode, capabilities, reader) {
    const zoomCapability = capabilities?.zoom;
    if (!zoomCapability) {
        return;
    }

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "qr-scanner-zoom-slider";
    slider.min = zoomCapability.min;
    slider.max = zoomCapability.max;
    slider.step = zoomCapability.step ?? 0.1;
    slider.value = zoomCapability.min;

    slider.addEventListener("input", () => {
        html5QrCode.applyVideoConstraints({ advanced: [{ zoom: Number(slider.value) }] });
    });

    reader.insertAdjacentElement("afterend", slider);
    activeZoomSlider = slider;
}

export function StartQrScanner() {
    const reader = document.getElementById("reader");
    ApplyQrScannerOrientation(reader, IsMobileClient());
    removeZoomSlider();

    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: 250 };
    let stopped = false;

    return new Promise((resolve, reject) => {
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText, decodedResult) => {
                stopped = true;
                removeZoomSlider();
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                    resolve(decodedText);
                });
            },
            errorMessage => {
                // можно игнорировать
            }
        ).then(() => {
            if (stopped) {
                return;
            }
            createZoomSlider(html5QrCode, html5QrCode.getRunningTrackCapabilities?.(), reader);
        }).catch(err => {
            stopped = true;
            removeZoomSlider();
            reject(err);
        });
    });
}
