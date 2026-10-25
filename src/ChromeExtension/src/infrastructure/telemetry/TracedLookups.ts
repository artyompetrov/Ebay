// Spans of the content script's choke points: waiting for page elements and cached-data lookups
// (openspec/specs/client-telemetry). Depends only on what is passed in, so it is unit-tested directly.

import type {PageTelemetry} from './PageTelemetry';

const MaxAttempts = 200;
const MsPerSecond = 1000;

export interface CachedData<T> {
    value: T;
    expirationTime: number;
}

export interface CacheStore<T> {
    read: (key: string) => Promise<CachedData<T> | undefined>;
    write: (key: string, data: CachedData<T>) => void;
}

/**
 * Polls `root` for `selector` every `intervalMs` until it appears (at most 200 attempts unless `retryForever`),
 * recorded as a `wait <selector>` span with the number of attempts.
 */
export async function waitForElement(
    telemetry: PageTelemetry,
    selector: string,
    root: Document | Element,
    retryForever: boolean,
    sleep: () => Promise<unknown>
): Promise<Element> {
    return telemetry.withSpan(`wait ${selector}`, {attributes: {'dom.selector': selector}}, async span => {
        let attempts = 0;
        while (true) {
            attempts++;
            span.setAttribute('dom.attempts', attempts);
            const element = root.querySelector(selector);
            if (element !== null) {
                return element;
            }
            if (!retryForever && attempts > MaxAttempts) {
                throw new Error("unable to find element by selector " + selector);
            }
            await sleep();
        }
    });
}

/**
 * Returns the cached value of `key` while it is fresh, otherwise produces it with `fallback` and caches it for
 * `ttlSeconds`; recorded as a `cache <key>` span with `cache.hit`, the fallback running inside it.
 */
export async function cachedOrFallback<T>(
    telemetry: PageTelemetry,
    key: string,
    store: CacheStore<T>,
    fallback: () => Promise<T>,
    ttlSeconds: number,
    nowMs: () => number
): Promise<T> {
    return telemetry.withSpan(`cache ${key}`, {attributes: {'cache.key': key}}, async span => {
        const data = await store.read(key);
        const hit = data !== undefined && nowMs() <= data.expirationTime;
        span.setAttribute('cache.hit', hit);
        if (data !== undefined && hit) {
            return data.value;
        }

        const value = await fallback();
        store.write(key, {value, expirationTime: nowMs() + ttlSeconds * MsPerSecond});
        return value;
    });
}
