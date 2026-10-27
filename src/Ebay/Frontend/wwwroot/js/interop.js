

export function SetFocusByElementId(elementId) {
    let element = document.getElementById(elementId);
    element.focus();
}

const productDescriptionEditors = new Map();
let quillAssetsPromise = null;

function loadQuillAssets() {
    if (typeof Quill !== "undefined") {
        return Promise.resolve();
    }

    if (!quillAssetsPromise) {
        quillAssetsPromise = new Promise((resolve, reject) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css";
            document.head.appendChild(link);

            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/quill@2/dist/quill.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Quill"));
            document.head.appendChild(script);
        });
    }

    return quillAssetsPromise;
}

export function InitProductDescriptionEditor(elementId, initialHtml) {
    return loadQuillAssets().then(() => {
        const container = document.getElementById(elementId);
        if (!container) {
            return;
        }

        const quill = new Quill(container, { theme: "snow" });
        if (initialHtml) {
            quill.clipboard.dangerouslyPasteHTML(initialHtml);
        }

        productDescriptionEditors.set(elementId, quill);
    });
}

export function GetProductDescriptionEditorHtml(elementId) {
    const quill = productDescriptionEditors.get(elementId);
    if (!quill) {
        return "";
    }

    // Quill represents an empty document as a lone trailing newline (getLength() === 1),
    // rendered as "<p><br></p>" - treat that as empty rather than persisting the placeholder markup.
    return quill.getLength() <= 1 ? "" : quill.root.innerHTML;
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

// Frontend telemetry (openspec/specs/client-telemetry): what the browser observes is queued here and pulled by .NET
// (Telemetry/BrowserTelemetry.cs) on every export tick; the queues are bounded so a tab left open never grows them.
const maxQueuedTelemetryEntries = 200;
const longFrameThresholdMs = 50;
const maxLongFramesPerMinute = 60;
const millisecondsPerMinute = 60000;
const frontendAssembly = "Frontend.dll";

const telemetryQueues = { clicks: [], vitals: [], errors: [] };
let longFrameWindow = { start: 0, count: 0 };
let largestContentfulPaint = null;
let cumulativeLayoutShift = 0;
let reportedLayoutShift = 0;
let slowestInteraction = 0;
let reportedInteraction = 0;
let telemetryStarted = false;

function epochNow() {
    return performance.timeOrigin + performance.now();
}

function enqueue(queue, entry) {
    queue.push(entry);
    if (queue.length > maxQueuedTelemetryEntries) {
        queue.shift();
    }
}

function observe(type, callback) {
    try {
        new PerformanceObserver(list => list.getEntries().forEach(callback)).observe({ type, buffered: true });
        return true;
    } catch {
        return false;
    }
}

function recordLongFrame(start, duration, blockingDuration) {
    const now = epochNow();
    if (now - longFrameWindow.start >= millisecondsPerMinute) {
        longFrameWindow = { start: now, count: 0 };
    }
    if (duration <= longFrameThresholdMs || longFrameWindow.count >= maxLongFramesPerMinute) {
        return;
    }
    longFrameWindow.count++;
    enqueue(telemetryQueues.vitals, {
        name: "long_animation_frame",
        value: duration,
        time: performance.timeOrigin + start,
        blockingDuration
    });
}

// The element a click is named after: the nearest one with an id, never the app root itself.
export function ClickTargetId(target) {
    const element = target?.closest?.("[id]");
    return element && element.id !== "app" ? element.id : null;
}

export function ErrorOf(reason) {
    if (reason instanceof Error) {
        return { type: reason.name, message: reason.message, stack: reason.stack ?? null };
    }
    return { type: typeof reason, message: String(reason), stack: null };
}

/** Starts the observers and wires the export on hide to the [JSExport] TelemetryJsExports.FlushOnHidden. */
export function StartTelemetryCollection() {
    return startTelemetryCollection();
}

async function startTelemetryCollection() {
    if (telemetryStarted) {
        return;
    }
    telemetryStarted = true;

    document.addEventListener("click", event => {
        const id = ClickTargetId(event.target);
        if (id) {
            enqueue(telemetryQueues.clicks, { id, time: epochNow() });
        }
    }, { capture: true });

    window.addEventListener("error", event => {
        const error = event.error ? ErrorOf(event.error) : { type: "Error", message: event.message, stack: null };
        enqueue(telemetryQueues.errors, { ...error, time: epochNow() });
    });
    window.addEventListener("unhandledrejection", event => {
        enqueue(telemetryQueues.errors, { ...ErrorOf(event.reason), time: epochNow() });
    });

    observe("largest-contentful-paint", entry => {
        largestContentfulPaint = { name: "lcp", value: entry.startTime, time: performance.timeOrigin + entry.startTime };
    });
    observe("layout-shift", entry => {
        if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
        }
    });
    observe("event", entry => {
        if (entry.interactionId && entry.duration > slowestInteraction) {
            slowestInteraction = entry.duration;
        }
    });
    if (!observe("long-animation-frame", entry => recordLongFrame(entry.startTime, entry.duration, entry.blockingDuration))) {
        observe("longtask", entry => recordLongFrame(entry.startTime, entry.duration, null));
    }

    const runtime = await globalThis.getDotnetRuntime(0);
    const exports = await runtime.getAssemblyExports(frontendAssembly);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            exports.Client.Telemetry.TelemetryJsExports.FlushOnHidden();
        }
    });
}

export function GetTimeOrigin() {
    return performance.timeOrigin;
}

export function TakeClicks() {
    return JSON.stringify(telemetryQueues.clicks.splice(0));
}

export function BootTimingOf(navigation, resources, timeOrigin) {
    const atTime = value => value > 0 ? timeOrigin + value : null;
    const framework = resources.filter(resource => resource.name.includes("/_framework/"));
    return {
        responseEnd: atTime(navigation?.responseEnd ?? 0),
        domContentLoaded: atTime(navigation?.domContentLoadedEventEnd ?? 0),
        frameworkResources: framework.length,
        frameworkBytes: framework.reduce((sum, resource) => sum + (resource.transferSize || resource.encodedBodySize || 0), 0),
        frameworkStart: framework.length ? timeOrigin + Math.min(...framework.map(resource => resource.startTime)) : null,
        frameworkEnd: framework.length ? timeOrigin + Math.max(...framework.map(resource => resource.responseEnd)) : null
    };
}

export function TakeBootTiming() {
    return JSON.stringify(BootTimingOf(
        performance.getEntriesByType("navigation")[0],
        performance.getEntriesByType("resource"),
        performance.timeOrigin));
}

export function TakeTelemetryEvents() {
    const vitals = telemetryQueues.vitals.splice(0);
    const now = epochNow();
    if (largestContentfulPaint) {
        vitals.push(largestContentfulPaint);
        largestContentfulPaint = null;
    }
    if (cumulativeLayoutShift !== reportedLayoutShift) {
        reportedLayoutShift = cumulativeLayoutShift;
        vitals.push({ name: "cls", value: cumulativeLayoutShift, time: now });
    }
    if (slowestInteraction !== reportedInteraction) {
        reportedInteraction = slowestInteraction;
        vitals.push({ name: "inp", value: slowestInteraction, time: now });
    }
    return JSON.stringify({ vitals, errors: telemetryQueues.errors.splice(0) });
}
