// Logging of the content script (openspec/specs/client-telemetry): every record is written to the browser console and
// recorded for export in the trace of the given span (by default the current processor or page span); the worker
// exports the records at or above the level the backend serves. Depends only on what is passed in, so it is
// unit-tested directly.

import type {PageTelemetry, TelemetrySpan} from './PageTelemetry';
import type {Attributes, SeverityNumber} from './TelemetryTypes';

const TraceSeverity: SeverityNumber = 1;
const DebugSeverity: SeverityNumber = 5;
const InformationSeverity: SeverityNumber = 9;
const WarningSeverity: SeverityNumber = 13;
const ErrorSeverity: SeverityNumber = 17;

/** Longest body logged at Trace level; the rest is cut. */
const MaxLoggedBodyLength = 4096;
/** OAuth endpoints of the backend: their bodies are codes and tokens and are never logged. */
const OAuthPathPrefix = '/connect/';

export interface ConsoleLike {
    debug(...data: unknown[]): void;
    log(...data: unknown[]): void;
    warn(...data: unknown[]): void;
    error(...data: unknown[]): void;
}

export interface HttpCallLogEntry {
    method: string;
    /** Request URL; its query string is never recorded. */
    url: string;
    status: number | undefined;
    isBackendCall: boolean;
    requestBody?: string;
    responseBody?: string;
    span: TelemetrySpan;
}

export class Logger {
    private readonly telemetry: PageTelemetry;
    private readonly output: ConsoleLike;

    constructor(telemetry: PageTelemetry, output: ConsoleLike) {
        this.telemetry = telemetry;
        this.output = output;
    }

    /** Full details (request and response bodies of backend calls); exported only when the backend serves Trace. */
    trace(message: string, attributes: Attributes = {}, span?: TelemetrySpan): void {
        this.output.debug(message);
        this.telemetry.log(TraceSeverity, message, attributes, undefined, span);
    }

    /** Diagnostic details: progress of a processor, HTTP calls without bodies. */
    debug(message: string, attributes: Attributes = {}, span?: TelemetrySpan): void {
        this.output.debug(message);
        this.telemetry.log(DebugSeverity, message, attributes, undefined, span);
    }

    /** Business events: a lot sent to the backend, a lot ignored. */
    info(message: string, attributes: Attributes = {}, span?: TelemetrySpan): void {
        this.output.log(message);
        this.telemetry.log(InformationSeverity, message, attributes, undefined, span);
    }

    warn(message: string, attributes: Attributes = {}, span?: TelemetrySpan): void {
        this.output.warn(message);
        this.telemetry.log(WarningSeverity, message, attributes, undefined, span);
    }

    /** A failure; `error` adds its type, message and stack trace. */
    error(message: string, error?: unknown, attributes: Attributes = {}, span?: TelemetrySpan): void {
        this.output.error(message, error);
        this.telemetry.log(ErrorSeverity, message, attributes, error, span);
    }

    /** Console only, never exported: data of third-party sites (eBay payloads, page content). */
    local(message: string, ...data: unknown[]): void {
        this.output.debug(message, ...data);
    }

    /**
     * Logs an HTTP call: method, path and status at Debug, and the bodies of a backend call at Trace, cut to 4 KB.
     * Bodies of calls to other hosts stay in the console. Headers are never logged.
     */
    httpCall(entry: HttpCallLogEntry): void {
        const url = new URL(entry.url);
        const summary = `${entry.method} ${url.origin}${url.pathname} answered ${entry.status ?? 'no response'}`;
        this.debug(summary, {'http.request.method': entry.method, 'url.path': url.pathname, 'server.address': url.host}, entry.span);

        if (!entry.isBackendCall) {
            this.local(`${summary}: request body`, entry.requestBody, 'response body', entry.responseBody);
            return;
        }
        if (url.pathname.startsWith(OAuthPathPrefix)) {
            return;
        }

        if (entry.requestBody !== undefined) {
            this.trace(`${summary}: request body ${cut(entry.requestBody)}`, {}, entry.span);
        }
        if (entry.responseBody !== undefined) {
            this.trace(`${summary}: response body ${cut(entry.responseBody)}`, {}, entry.span);
        }
    }
}

function cut(body: string): string {
    return body.length > MaxLoggedBodyLength ? body.slice(0, MaxLoggedBodyLength) : body;
}

function stackOf(value: unknown): string {
    return value !== null && typeof value === 'object' && typeof (value as {stack?: unknown}).stack === 'string'
        ? (value as {stack: string}).stack
        : '';
}

/**
 * Reports uncaught errors and unhandled promise rejections that come from this extension's scripts (see
 * {@link reportCaughtError}) on the span `currentSpan` returns; errors of the host page are not ours and are ignored.
 * A rejection is attributed by the stack of its reason, so a reason without a stack cannot be told apart from the
 * page's own and is ignored.
 */
export function logUncaughtErrors(target: EventTarget, logger: Logger, extensionUrl: string, currentSpan: () => TelemetrySpan | undefined): void {
    target.addEventListener('error', (event: Event) => {
        const errorEvent = event as ErrorEvent;
        if (errorEvent.filename?.startsWith(extensionUrl) || stackOf(errorEvent.error).includes(extensionUrl)) {
            reportCaughtError(logger, 'Uncaught error in the extension', errorEvent.error ?? errorEvent.message, currentSpan());
        }
    });
    target.addEventListener('unhandledrejection', (event: Event) => {
        const reason = (event as PromiseRejectionEvent).reason;
        if (stackOf(reason).includes(extensionUrl)) {
            reportCaughtError(logger, 'Unhandled promise rejection in the extension', reason, currentSpan());
        }
    });
}

/**
 * Reports an error caught by extension code: an Error record with the exception's type, message and stack trace,
 * and the exception recorded on `span` (the span it was caught in), which is marked as failed.
 */
export function reportCaughtError(logger: Logger, message: string, error: unknown, span: TelemetrySpan | undefined, details: Attributes = {}): void {
    logger.error(message, error, details, span);
    span?.recordException(error);
}
