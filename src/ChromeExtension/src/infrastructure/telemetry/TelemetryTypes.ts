// Plain telemetry records the content script hands to the background worker (openspec/specs/client-telemetry).
// Types only: modules share them with `import type`, which Node's type stripping erases, so tests can load each
// module on its own. Numeric values follow OTLP (span kind, status code, severity number).

export type AttributeValue = string | number | boolean;

export type Attributes = Record<string, AttributeValue>;

/** OTLP `SpanKind` minus one, as in the OpenTelemetry API: 0 internal, 2 client. */
export type SpanKindValue = 0 | 2;

/** OTLP status code: 0 unset, 1 ok, 2 error. */
export type SpanStatusValue = 0 | 1 | 2;

/** OTLP severity numbers of Trace, Debug, Information, Warning, Error and Critical. */
export type SeverityNumber = 1 | 5 | 9 | 13 | 17 | 21;

export interface SpanContextRecord {
    traceId: string;
    spanId: string;
}

export interface SpanEventRecord {
    name: string;
    /** Milliseconds since the Unix epoch, with sub-millisecond precision. */
    time: number;
    attributes: Attributes;
}

export interface SpanRecord {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    name: string;
    kind: SpanKindValue;
    /** Milliseconds since the Unix epoch, with sub-millisecond precision. */
    startTime: number;
    endTime: number;
    attributes: Attributes;
    events: SpanEventRecord[];
    links: SpanContextRecord[];
    status: SpanStatusValue;
    statusMessage?: string;
}

export interface LogRecord {
    /** Milliseconds since the Unix epoch, with sub-millisecond precision. */
    time: number;
    severity: SeverityNumber;
    message: string;
    attributes: Attributes;
    traceId?: string;
    spanId?: string;
}

/** Records of one tab, sent from the content script to the background worker. */
export interface TelemetryBatchMessage {
    kind: 'telemetry';
    /** Random per tab page load; becomes the `session.id` resource attribute. */
    sessionId: string;
    spans: SpanRecord[];
    logs: LogRecord[];
}

/** Request of the content script for an HTTP call made by the background worker. */
export interface FetchMessage {
    kind: 'fetch';
    input: RequestInfo;
    init: RequestInit;
}

/** Times the background worker spent on a fetch, in milliseconds since the Unix epoch. */
export interface WorkerFetchTiming {
    fetchStart: number;
    fetchEnd: number;
}
