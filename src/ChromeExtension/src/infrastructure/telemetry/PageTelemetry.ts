// Dependency-free span and log recorder of the content script (openspec/specs/client-telemetry).
// It runs on every page the extension is injected into, so it only builds plain objects: the OpenTelemetry SDK,
// batching across tabs, serialization and export live in the background worker (src/background.ts).
// Depends neither on the DOM nor on `chrome.*` (both are injected), so it is unit-tested directly.

import type {
    Attributes,
    AttributeValue,
    LogRecord,
    SeverityNumber,
    SpanContextRecord,
    SpanEventRecord,
    SpanKindValue,
    SpanRecord,
    SpanStatusValue,
    TelemetryBatchMessage
} from './TelemetryTypes';

export const Severity = {
    Trace: 1,
    Debug: 5,
    Information: 9,
    Warning: 13,
    Error: 17,
    Critical: 21
} as const satisfies Record<string, SeverityNumber>;

export const SpanKind = {
    Internal: 0,
    Client: 2
} as const satisfies Record<string, SpanKindValue>;

const StatusUnset: SpanStatusValue = 0;
const StatusError: SpanStatusValue = 2;

const TraceIdBytes = 16;
const SpanIdBytes = 8;
const HexRadix = 16;
const SessionIdBytes = 8;

/** Records are handed to the worker once this many are pending... */
const SendThreshold = 50;
/** ...or this long after the first pending one. */
const SendDelayMs = 1000;
/** Upper bound of records kept while waiting for a handler match or for the next send; the oldest are dropped. */
const MaxPendingRecords = 2048;
/** Longest attribute value or log message; longer ones are cut. */
const MaxValueLength = 4096;

const TraceParentVersion = '00';
const SampledFlags = '01';

const ExceptionEventName = 'exception';

// A URL's query string and fragment can carry tokens, OAuth codes or search terms: never record them.
const UrlWithQueryPattern = /(https?:\/\/[^\s"'<>?#]+)[?#][^\s"'<>]*/gi;
const BearerTokenPattern = /(Bearer\s+)[A-Za-z0-9\-._~+/]+=*/gi;
const RedactedToken = '$1[redacted]';

export type RandomBytes = (count: number) => Uint8Array;

export interface PageTelemetryOptions {
    randomBytes: RandomBytes;
    /** Current time in milliseconds since the Unix epoch, with sub-millisecond precision. */
    now: () => number;
    /** Hands records to the background worker. Must not throw. */
    send: (message: TelemetryBatchMessage) => void;
    /** Runs a callback later (setTimeout). */
    schedule: (callback: () => void, delayMs: number) => void;
}

export interface StartSpanOptions {
    /** Parent span; `null` starts a new trace. Without it the page root span is the parent. */
    parent?: TelemetrySpan | null;
    kind?: SpanKindValue;
    attributes?: Attributes;
    links?: SpanContextRecord[];
    /** Milliseconds since the Unix epoch; now when omitted. */
    startTime?: number;
}

/** Removes query strings and fragments of URLs and bearer tokens from a text. */
export function scrubText(text: string): string {
    return text.replace(UrlWithQueryPattern, '$1').replace(BearerTokenPattern, RedactedToken);
}

function limit(value: AttributeValue): AttributeValue {
    if (typeof value !== 'string') {
        return value;
    }

    const scrubbed = scrubText(value);
    return scrubbed.length > MaxValueLength ? scrubbed.slice(0, MaxValueLength) : scrubbed;
}

function toHex(bytes: Uint8Array): string {
    let hex = '';
    bytes.forEach((value: number) => {
        hex += ('0' + value.toString(HexRadix)).slice(-2);
    });
    return hex;
}

function errorAttributes(error: unknown): Attributes {
    if (error instanceof Error) {
        return {
            'exception.type': error.name || error.constructor.name,
            'exception.message': error.message,
            'exception.stacktrace': error.stack ?? ''
        };
    }

    return {'exception.type': typeof error, 'exception.message': String(error)};
}

export class TelemetrySpan {
    private readonly owner: PageTelemetry;
    private readonly record: SpanRecord;
    private ended = false;

    constructor(owner: PageTelemetry, record: SpanRecord) {
        this.owner = owner;
        this.record = record;
    }

    get context(): SpanContextRecord {
        return {traceId: this.record.traceId, spanId: this.record.spanId};
    }

    get isEnded(): boolean {
        return this.ended;
    }

    setAttribute(name: string, value: AttributeValue): this {
        this.record.attributes[name] = limit(value);
        return this;
    }

    setAttributes(attributes: Attributes): this {
        for (const name of Object.keys(attributes)) {
            this.setAttribute(name, attributes[name]);
        }
        return this;
    }

    addEvent(name: string, attributes: Attributes = {}, time?: number): this {
        const event: SpanEventRecord = {name, time: time ?? this.owner.now(), attributes: {}};
        for (const key of Object.keys(attributes)) {
            event.attributes[key] = limit(attributes[key]);
        }
        this.record.events.push(event);
        return this;
    }

    /** Adds an exception event and marks the span as failed. */
    recordException(error: unknown): this {
        this.addEvent(ExceptionEventName, errorAttributes(error));
        return this.setError(error instanceof Error ? error.message : String(error));
    }

    setError(message: string): this {
        this.record.status = StatusError;
        this.record.statusMessage = limit(message) as string;
        return this;
    }

    /** Ends the span and queues it for export; later calls are ignored. */
    end(time?: number): void {
        if (this.ended) {
            return;
        }

        this.ended = true;
        this.record.endTime = time ?? this.owner.now();
        this.owner.enqueueSpan(this.record);
    }
}

export class PageTelemetry {
    readonly sessionId: string;

    private readonly options: PageTelemetryOptions;
    private spans: SpanRecord[] = [];
    private logs: LogRecord[] = [];
    private activated = false;
    private discarded = false;
    private sendScheduled = false;
    private root: TelemetrySpan | undefined;

    constructor(options: PageTelemetryOptions) {
        this.options = options;
        this.sessionId = toHex(options.randomBytes(SessionIdBytes));
    }

    /** The page root span, once {@link startPageSpan} was called. */
    get pageSpan(): TelemetrySpan | undefined {
        return this.root;
    }

    get isActive(): boolean {
        return this.activated;
    }

    now(): number {
        return this.options.now();
    }

    /**
     * A handler matched the page: records start leaving the tab, including the ones written before the match.
     */
    activate(): void {
        if (this.discarded || this.activated) {
            return;
        }

        this.activated = true;
        this.scheduleSend();
    }

    /** No handler matched the page: everything recorded so far and later is dropped and nothing is sent. */
    discard(): void {
        this.discarded = true;
        this.spans = [];
        this.logs = [];
    }

    /** Starts the page root span, a new trace; later spans without an explicit parent become its children. */
    startPageSpan(name: string, startTime: number, attributes: Attributes = {}): TelemetrySpan {
        const root = this.startSpan(name, {parent: null, startTime, attributes});
        this.root = root;
        // Records written before the handler matched belong to this page too.
        for (const log of this.logs) {
            if (log.traceId === undefined) {
                log.traceId = root.context.traceId;
                log.spanId = root.context.spanId;
            }
        }
        return root;
    }

    startSpan(name: string, options: StartSpanOptions = {}): TelemetrySpan {
        const parent = options.parent === undefined ? this.root : options.parent ?? undefined;
        const parentContext = parent?.context;
        const span = new TelemetrySpan(this, {
            traceId: parentContext?.traceId ?? toHex(this.options.randomBytes(TraceIdBytes)),
            spanId: toHex(this.options.randomBytes(SpanIdBytes)),
            parentSpanId: parentContext?.spanId,
            name,
            kind: options.kind ?? SpanKind.Internal,
            startTime: options.startTime ?? this.options.now(),
            endTime: 0,
            attributes: {},
            events: [],
            links: options.links ?? [],
            status: StatusUnset
        });
        return span.setAttributes(options.attributes ?? {});
    }

    /**
     * Runs `work` inside a new span and ends it; an error thrown by `work` is recorded on the span and rethrown.
     */
    async withSpan<T>(name: string, options: StartSpanOptions, work: (span: TelemetrySpan) => Promise<T> | T): Promise<T> {
        const span = this.startSpan(name, options);
        try {
            return await work(span);
        } catch (error) {
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    /** W3C `traceparent` value that makes the receiver continue the trace under `span`. */
    traceParent(span: TelemetrySpan): string {
        const context = span.context;
        return `${TraceParentVersion}-${context.traceId}-${context.spanId}-${SampledFlags}`;
    }

    /** Records a log record in the trace of `span` (by default the page root span). */
    log(severity: SeverityNumber, message: string, attributes: Attributes = {}, error?: unknown, span?: TelemetrySpan): void {
        if (this.discarded) {
            return;
        }

        const context = (span ?? this.root)?.context;
        const record: LogRecord = {
            time: this.options.now(),
            severity,
            message: limit(message) as string,
            attributes: {},
            traceId: context?.traceId,
            spanId: context?.spanId
        };
        const all = error === undefined ? attributes : {...attributes, ...errorAttributes(error)};
        for (const name of Object.keys(all)) {
            record.attributes[name] = limit(all[name]);
        }

        this.logs.push(record);
        this.trim(this.logs);
        this.onRecordQueued();
    }

    /** Hands every pending record to the worker now (page hidden). */
    flush(): void {
        if (!this.activated || (this.spans.length === 0 && this.logs.length === 0)) {
            return;
        }

        const message: TelemetryBatchMessage = {kind: 'telemetry', sessionId: this.sessionId, spans: this.spans, logs: this.logs};
        this.spans = [];
        this.logs = [];
        this.options.send(message);
    }

    /** The page is being unloaded: ends the root span if it is still open and hands everything over. */
    unload(): void {
        if (this.root !== undefined && !this.root.isEnded) {
            this.root.setAttribute('page.unloaded', true);
            this.root.end();
        }
        this.flush();
    }

    /** @internal Called by {@link TelemetrySpan.end}. */
    enqueueSpan(record: SpanRecord): void {
        if (this.discarded) {
            return;
        }

        this.spans.push(record);
        this.trim(this.spans);
        this.onRecordQueued();
    }

    private onRecordQueued(): void {
        if (!this.activated) {
            return;
        }

        if (this.spans.length + this.logs.length >= SendThreshold) {
            this.flush();
        } else {
            this.scheduleSend();
        }
    }

    private scheduleSend(): void {
        if (this.sendScheduled) {
            return;
        }

        this.sendScheduled = true;
        this.options.schedule(() => {
            this.sendScheduled = false;
            this.flush();
        }, SendDelayMs);
    }

    private trim<T>(records: T[]): void {
        if (records.length > MaxPendingRecords) {
            records.splice(0, records.length - MaxPendingRecords);
        }
    }
}
