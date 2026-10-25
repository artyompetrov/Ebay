import * as constants from "../constants";
import {telemetry} from "./Telemetry";
import {finishClientCall, isBackendCall, startClientCall} from "./telemetry/HttpClientSpans";
import {cachedOrFallback, CachedData, waitForElement} from "./telemetry/TracedLookups";
import type {TelemetrySpan} from "./telemetry/PageTelemetry";
import type {WorkerFetchTiming} from "./telemetry/TelemetryTypes";

const ElementPollIntervalMs = 100;

interface WorkerResponse {
    body: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

export function getMax(array: number[]) {
    let largest = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {
            largest = array[i];
        }
    }
    return largest;
}


// Функция для ожидания загрузки элемента; ожидание записывается спаном `wait <selector>`.
export async function sleepElementLoaded(selector: string, elementToSearchIn: Document | Element,  retryForever: boolean = false): Promise<Element> {
    return waitForElement(telemetry, selector, elementToSearchIn, retryForever, () => sleep(ElementPollIntervalMs));
}

// Функция для паузы выполнения кода
export function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCachedDataOrFallback<T>(
    key: string,
    fallbackLogic: () => Promise<T>,
    ttlInSeconds: number
): Promise<T> {
    return cachedOrFallback(telemetry, key, {
        read: async (cacheKey: string) => (await chrome.storage.local.get(cacheKey))[cacheKey] as CachedData<T> | undefined,
        write: (cacheKey: string, data: CachedData<T>) => {
            chrome.storage.local.set({[cacheKey]: data}).catch(error => console.error(`Failed to cache ${cacheKey}:`, error));
        }
    }, fallbackLogic, ttlInSeconds, Date.now);
}

export function removeFromCache(key: string){
    chrome.storage.local.remove(key, () => {} );
}

export function redirectWithoutReferer(url: string) {
    window.open(url, '_self', 'noopener,noreferrer');
}

export function escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (match) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[match] as string));
}


// Вспомогательная функция для проверки соответствия регулярному выражению
export function matchesAnyRegex(regexSet: RegExp[], value: string): boolean {
    return regexSet.some((regex) => regex.test(value));
}

/**
 * Makes an HTTP call through the background worker, recorded as a client span under `parent` (by default the page
 * root span); a backend call carries a `traceparent` naming that span.
 */
export async function fetchResource(input: RequestInfo, originalInit: RequestInit, parent?: TelemetrySpan): Promise<Response> {
    const call = startClientCall(telemetry, input, originalInit, constants.Urls.backendUrl, parent);
    const init = call.init;
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ kind: 'fetch', input, init }, async messageResponse => {
            try {
                const [response, error, timing] = messageResponse as [WorkerResponse | null, unknown, WorkerFetchTiming];
                finishClientCall(telemetry, call, response === null ? { error, timing } : { status: response.status, timing });
                let logEntry = "Request: " + JSON.stringify(input);
                if (isBackendCall(input, constants.Urls.backendUrl)) {
                    logEntry += "\nTrace id: " + call.span.context.traceId;
                }
                if (constants.Settings.extendedLogging) {
                    logEntry += "\n\nRequest body: \n" + JSON.stringify(init);
                }
                if (response === null) {
                    logEntry += "\n\nNo response"
                    console.log(logEntry);
                    reject(error);
                } else {
                    logEntry += "\n\nResponse " + response.status + " " + response.statusText;

                    if (constants.Settings.extendedLogging) {
                        logEntry += "\n\nResponse headers:\n" + JSON.stringify(response.headers);
                    }

                    let body = new Blob([response.body]);


                    if (constants.Settings.extendedLogging) {
                        logEntry += "\n\nResponse body:\n";
                        try {
                            const loggedBody = await new Response(body).text();
                            logEntry += loggedBody;
                        } catch (logError) {
                            logEntry += "Failed to log response body: " + logError;
                        }
                    }

                    console.log(logEntry);
                    resolve(new Response(body, {
                        headers: new Headers(response.headers),
                        status: response.status,
                        statusText: response.statusText
                    }));
                }
            } catch (error) {
                console.log("An error occurred while processing the response:", error);
                reject(error);
            }
        });
    });
}