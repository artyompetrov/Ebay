// The content script's telemetry: one recorder per page load (content scripts are loaded once per page), handing its
// records to the background worker (openspec/specs/client-telemetry).

import {PageTelemetry} from './telemetry/PageTelemetry';
import {Logger, logUncaughtErrors} from './telemetry/Logger';
import type {TelemetryBatchMessage} from './telemetry/TelemetryTypes';

function send(message: TelemetryBatchMessage): void {
    try {
        chrome.runtime.sendMessage(message).catch(() => {
            // The worker may be restarting or the extension was updated: telemetry must never break the page.
        });
    } catch {
        // The extension context is gone (extension reloaded); nothing can be sent anymore.
    }
}

const now = (): number => performance.timeOrigin + performance.now();

/** When the content script started running, in milliseconds since the Unix epoch. */
export const scriptStart = now();

export const telemetry = new PageTelemetry({
    randomBytes: count => crypto.getRandomValues(new Uint8Array(count)),
    now,
    send,
    schedule: (callback, delayMs) => {
        setTimeout(callback, delayMs);
    }
});

/** Logs to the console and records for export (the worker exports what the backend's level allows). */
export const logger = new Logger(telemetry, console);

logUncaughtErrors(window, logger, chrome.runtime.getURL(''), () => telemetry.currentSpan);

// Hidden: hand everything over now, a background tab may never get another chance. Unloaded: also end the root.
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        telemetry.flush();
    }
});
window.addEventListener('pagehide', () => telemetry.unload());
