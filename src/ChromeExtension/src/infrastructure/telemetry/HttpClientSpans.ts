// Client spans of the content script's HTTP calls (openspec/specs/client-telemetry). The `traceparent` sent to the
// backend names the call's own span, so the backend's server span becomes its child; other hosts get no trace
// context. Depends only on the recorder passed in, so it is unit-tested directly.

import type {PageTelemetry, TelemetrySpan} from './PageTelemetry';
import type {WorkerFetchTiming} from './TelemetryTypes';

const ClientKind = 2;
const TraceParentHeader = 'traceparent';
const FirstServerErrorStatus = 500;

export interface ClientCall {
    span: TelemetrySpan;
    init: RequestInit;
    /** When the request was handed to the background worker, in milliseconds since the Unix epoch. */
    sentAt: number;
}

export interface ClientCallOutcome {
    status?: number;
    error?: unknown;
    timing?: WorkerFetchTiming;
}

function requestUrl(input: RequestInfo): string {
    return typeof input === 'string' ? input : input.url;
}

function toHeaderRecord(headers: HeadersInit | undefined): Record<string, string> {
    const record: Record<string, string> = {};
    if (headers === undefined) {
        return record;
    }

    if (headers instanceof Headers || Array.isArray(headers)) {
        new Headers(headers).forEach((value: string, name: string) => {
            record[name] = value;
        });
        return record;
    }

    for (const name of Object.keys(headers)) {
        record[name] = headers[name];
    }
    return record;
}

export function isBackendCall(input: RequestInfo, backendUrl: string): boolean {
    return requestUrl(input).startsWith(backendUrl);
}

/**
 * Starts the client span of a call (a child of `parent`, by default of the page root span) and returns the request
 * options to send: a backend call gets a sampled `traceparent` naming this span, any other call is left unchanged.
 */
export function startClientCall(
    telemetry: PageTelemetry,
    input: RequestInfo,
    init: RequestInit,
    backendUrl: string,
    parent?: TelemetrySpan
): ClientCall {
    const url = new URL(requestUrl(input));
    const method = (init.method ?? 'GET').toUpperCase();
    const span = telemetry.startSpan(`${method} ${url.pathname}`, {
        parent,
        kind: ClientKind,
        attributes: {
            'http.request.method': method,
            'server.address': url.host,
            'url.scheme': url.protocol.replace(':', ''),
            'url.path': url.pathname
        }
    });

    const sentInit = isBackendCall(input, backendUrl)
        ? {...init, headers: {...toHeaderRecord(init.headers), [TraceParentHeader]: telemetry.traceParent(span)}}
        : init;
    return {span, init: sentInit, sentAt: telemetry.now()};
}

/**
 * Ends the call's span with its status and, when the worker reported its timing, child spans for the hops:
 * page to worker, the worker's fetch and worker to page.
 */
export function finishClientCall(telemetry: PageTelemetry, call: ClientCall, outcome: ClientCallOutcome): void {
    const receivedAt = telemetry.now();
    const span = call.span;

    if (outcome.timing !== undefined) {
        // The worker and the page have their own clocks; keep the hops inside the call even if they drift apart.
        const fetchStart = Math.min(Math.max(outcome.timing.fetchStart, call.sentAt), receivedAt);
        const fetchEnd = Math.min(Math.max(outcome.timing.fetchEnd, fetchStart), receivedAt);
        telemetry.startSpan('message to worker', {parent: span, startTime: call.sentAt}).end(fetchStart);
        telemetry.startSpan('worker fetch', {parent: span, startTime: fetchStart}).end(fetchEnd);
        telemetry.startSpan('message from worker', {parent: span, startTime: fetchEnd}).end(receivedAt);
    }

    if (outcome.status !== undefined) {
        span.setAttribute('http.response.status_code', outcome.status);
        if (outcome.status >= FirstServerErrorStatus) {
            span.setError(`HTTP ${outcome.status}`);
        }
    }
    if (outcome.error !== undefined) {
        span.recordException(outcome.error);
    }

    span.end(receivedAt);
}
