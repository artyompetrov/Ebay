// Background service worker: makes the HTTP calls of the content script (page CORS rules do not apply here) and
// exports the telemetry of every tab to the backend relay (openspec/specs/client-telemetry).

import * as constants from './constants';
import {
    BackendUrlKey,
    relayRequest,
    TelemetryExporter,
    TokenStoreKey,
    usableAccessToken,
    WorkerSessionId
} from './infrastructure/telemetry/TelemetryExporter';
import type {TelemetrySignal} from './infrastructure/telemetry/TelemetryExporter';
import type {
    FetchMessage,
    LogRecord,
    SeverityNumber,
    TelemetryBatchMessage,
    WorkerFetchTiming
} from './infrastructure/telemetry/TelemetryTypes';

const SettingsPath = 'api/telemetry/v1/settings';
const SettingsCacheMs = 10 * 60 * 1000;
const ErrorSeverity: SeverityNumber = 17;
const DefaultMinSeverity: SeverityNumber = 5;
/** Above every severity: the backend serves `None` to stop log export. */
const NoLogsSeverity = 25;
const SeverityByLevel: Record<string, number> = {
    Trace: 1,
    Debug: 5,
    Information: 9,
    Warning: 13,
    Error: 17,
    Critical: 21,
    None: NoLogsSeverity
};
/** Session storage survives the worker being stopped when idle, unlike module state. */
const SettingsCacheKey = 'telemetryMinSeverity';

function now(): number {
    return performance.timeOrigin + performance.now();
}

async function storedAccessToken(): Promise<string | undefined> {
    return usableAccessToken(await chrome.storage.local.get([BackendUrlKey, TokenStoreKey]), constants.Urls.backendUrl, Date.now());
}

async function postTelemetry(signal: TelemetrySignal, body: Uint8Array): Promise<boolean> {
    try {
        const token = await storedAccessToken();
        if (token === undefined) {
            return false;
        }

        const request = relayRequest(constants.Urls.backendUrl, signal, body, token);
        const response = await fetch(request.url, request.init);
        return response.ok;
    } catch {
        return false;
    }
}

async function minSeverity(): Promise<number> {
    const cached = (await chrome.storage.session.get(SettingsCacheKey))[SettingsCacheKey] as {value: number; fetchedAt: number} | undefined;
    if (cached !== undefined && Date.now() - cached.fetchedAt < SettingsCacheMs) {
        return cached.value;
    }

    let value: number = DefaultMinSeverity;
    try {
        const token = await storedAccessToken();
        if (token !== undefined) {
            const response = await fetch(constants.Urls.backendUrl + SettingsPath, {headers: {Authorization: 'Bearer ' + token}});
            if (response.ok) {
                const settings = await response.json() as {minLevel: string};
                value = SeverityByLevel[settings.minLevel] ?? DefaultMinSeverity;
            }
        }
    } catch {
        // The default level applies until the settings can be read.
    }

    await chrome.storage.session.set({[SettingsCacheKey]: {value, fetchedAt: Date.now()}});
    return value;
}

const exporter = new TelemetryExporter({
    serviceVersion: chrome.runtime.getManifest().version,
    now,
    schedule: (callback, delayMs) => setTimeout(callback, delayMs),
    post: postTelemetry,
    minSeverity
});

function recordWorkerError(message: string, error: unknown): void {
    const log: LogRecord = {
        time: now(),
        severity: ErrorSeverity,
        message,
        attributes: error instanceof Error
            ? {'exception.type': error.name, 'exception.message': error.message, 'exception.stacktrace': error.stack ?? ''}
            : {'exception.message': String(error)}
    };
    exporter.accept({kind: 'telemetry', sessionId: WorkerSessionId, spans: [], logs: [log]});
}

self.addEventListener('error', (event: ErrorEvent) => recordWorkerError('Uncaught error in the background worker', event.error ?? event.message));
self.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) =>
    recordWorkerError('Unhandled promise rejection in the background worker', event.reason));

function handleFetch(message: FetchMessage, sendResponse: (response: unknown) => void): void {
    const fetchStart = now();
    fetch(message.input, message.init).then(response => response.text().then(text => {
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        const timing: WorkerFetchTiming = {fetchStart, fetchEnd: now()};
        sendResponse([{body: text, status: response.status, statusText: response.statusText, headers}, null, timing]);
    }), error => {
        const timing: WorkerFetchTiming = {fetchStart, fetchEnd: now()};
        sendResponse([null, String(error), timing]);
    });
}

chrome.runtime.onMessage.addListener((message: FetchMessage | TelemetryBatchMessage, _sender, sendResponse) => {
    if (message.kind === 'telemetry') {
        exporter.accept(message);
        return false;
    }

    handleFetch(message, sendResponse);
    // The response is sent asynchronously.
    return true;
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'processText',
        title: 'Добавить товар',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'processText' && info.selectionText && tab?.id !== undefined) {
        chrome.tabs.sendMessage(tab.id, {action: 'processText', text: info.selectionText}, () => {});
    }
});
