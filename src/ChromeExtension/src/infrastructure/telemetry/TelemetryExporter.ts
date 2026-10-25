// Telemetry export of the background worker (openspec/specs/client-telemetry): collects the records of every tab,
// filters logs by the level the backend serves, serializes OTLP/JSON with the OpenTelemetry transformer and posts
// batches below 1 MiB to the backend relay. A failed batch is dropped and counted, never retried.
// Depends neither on `chrome.*` nor on `fetch` (both are injected), so it is unit-tested directly.

import {JsonLogsSerializer, JsonTraceSerializer} from '@opentelemetry/otlp-transformer';
import type {Attributes, LogRecord, SeverityNumber, SpanRecord, TelemetryBatchMessage} from './TelemetryTypes';

export type TelemetrySignal = 'traces' | 'logs';

export interface TelemetryExporterOptions {
    serviceVersion: string;
    /** Current time in milliseconds since the Unix epoch. */
    now: () => number;
    schedule: (callback: () => void, delayMs: number) => void;
    /** Posts one serialized batch to the relay; resolves `true` when it was accepted. Must not throw. */
    post: (signal: TelemetrySignal, body: Uint8Array) => Promise<boolean>;
    /** Minimum severity of exported log records, as served by the backend (above 21: none). Must not throw. */
    minSeverity: () => Promise<number>;
}

type ReadableSpans = Parameters<typeof JsonTraceSerializer.serializeRequest>[0];
type ReadableLogs = Parameters<typeof JsonLogsSerializer.serializeRequest>[0];
type HrTime = [number, number];

interface Resource {
    attributes: Attributes;
    schemaUrl?: string;
}

interface PendingSpan {
    resource: Resource;
    span: SpanRecord;
}

interface PendingLog {
    resource: Resource;
    log: LogRecord;
}

export const ServiceName = 'ebay_chrome_extension';
/** Storage keys of the backend token the content script stores after login (see ClientsFactory). */
export const BackendUrlKey = 'backend_url';
export const TokenStoreKey = 'ebayToolTokenStore';
const RelayPath = 'api/telemetry/v1/';
/** Session of records written by the worker itself. */
export const WorkerSessionId = 'background-worker';

const ExportDelayMs = 2000;
const ExportThreshold = 512;
const MaxPendingItems = 2048;
/** The relay rejects bodies above 1 MiB; keep some room below it. */
const MaxBatchBytes = 1024 * 1024 - 1024;

const MsPerSecond = 1000;
const NsPerMs = 1_000_000;
const SampledTraceFlags = 1;
const Scope = {name: ServiceName};
const WarningSeverity: SeverityNumber = 13;
const SeverityTexts: Record<SeverityNumber, string> = {
    1: 'Trace',
    5: 'Debug',
    9: 'Information',
    13: 'Warning',
    17: 'Error',
    21: 'Critical'
};

function toHrTime(epochMs: number): HrTime {
    const seconds = Math.floor(epochMs / MsPerSecond);
    return [seconds, Math.round((epochMs - seconds * MsPerSecond) * NsPerMs)];
}

function toReadableSpans(pending: PendingSpan[]): ReadableSpans {
    return pending.map(({resource, span}) => ({
        name: span.name,
        kind: span.kind,
        spanContext: () => ({traceId: span.traceId, spanId: span.spanId, traceFlags: SampledTraceFlags}),
        parentSpanContext: span.parentSpanId === undefined
            ? undefined
            : {traceId: span.traceId, spanId: span.parentSpanId, traceFlags: SampledTraceFlags},
        startTime: toHrTime(span.startTime),
        endTime: toHrTime(span.endTime),
        status: {code: span.status, message: span.statusMessage},
        attributes: span.attributes,
        links: span.links.map(link => ({context: {...link, traceFlags: SampledTraceFlags}})),
        events: span.events.map(event => ({name: event.name, time: toHrTime(event.time), attributes: event.attributes})),
        duration: toHrTime(span.endTime - span.startTime),
        ended: true,
        resource,
        instrumentationScope: Scope,
        droppedAttributesCount: 0,
        droppedEventsCount: 0,
        droppedLinksCount: 0
    })) as unknown as ReadableSpans;
}

function toReadableLogs(pending: PendingLog[]): ReadableLogs {
    return pending.map(({resource, log}) => ({
        hrTime: toHrTime(log.time),
        hrTimeObserved: toHrTime(log.time),
        spanContext: log.traceId === undefined || log.spanId === undefined
            ? undefined
            : {traceId: log.traceId, spanId: log.spanId, traceFlags: SampledTraceFlags},
        severityNumber: log.severity,
        severityText: SeverityTexts[log.severity],
        body: log.message,
        attributes: log.attributes,
        droppedAttributesCount: 0,
        resource,
        instrumentationScope: Scope
    })) as unknown as ReadableLogs;
}

const serializeSpans = (items: PendingSpan[]): Uint8Array | undefined => JsonTraceSerializer.serializeRequest(toReadableSpans(items));
const serializeLogs = (items: PendingLog[]): Uint8Array | undefined => JsonLogsSerializer.serializeRequest(toReadableLogs(items));

interface SerializedBatch {
    body: Uint8Array;
    itemCount: number;
}

/**
 * Serializes `items` into bodies below {@link MaxBatchBytes}, halving a batch until it fits; a single item that is
 * still too large is counted in `tooLarge` and left out.
 */
function serializeInBatches<T>(items: T[], serialize: (batch: T[]) => Uint8Array): {batches: SerializedBatch[]; tooLarge: number} {
    if (items.length === 0) {
        return {batches: [], tooLarge: 0};
    }

    const body = serialize(items);
    if (body.byteLength <= MaxBatchBytes) {
        return {batches: [{body, itemCount: items.length}], tooLarge: 0};
    }
    if (items.length === 1) {
        return {batches: [], tooLarge: 1};
    }

    const middle = Math.ceil(items.length / 2);
    const first = serializeInBatches(items.slice(0, middle), serialize);
    const second = serializeInBatches(items.slice(middle), serialize);
    return {batches: [...first.batches, ...second.batches], tooLarge: first.tooLarge + second.tooLarge};
}

interface StoredToken {
    accessToken: string;
    expiresAt?: number | null;
}

/**
 * The stored backend access token, if it was issued by `backendUrl` and has not expired. Telemetry never starts a
 * login: without such a token its batches are dropped.
 */
export function usableAccessToken(stored: Record<string, unknown>, backendUrl: string, nowMs: number): string | undefined {
    const serialized = stored[TokenStoreKey];
    if (stored[BackendUrlKey] !== backendUrl || typeof serialized !== 'string') {
        return undefined;
    }

    const token = JSON.parse(serialized) as StoredToken;
    return token.expiresAt != null && token.expiresAt <= nowMs ? undefined : token.accessToken;
}

/** The relay request for one batch. It carries no trace context: export calls must not be traced. */
export function relayRequest(backendUrl: string, signal: TelemetrySignal, body: Uint8Array, accessToken: string): {url: string; init: RequestInit} {
    return {
        url: backendUrl + RelayPath + signal,
        init: {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken},
            body
        }
    };
}

export class TelemetryExporter {
    private readonly options: TelemetryExporterOptions;
    private readonly resources = new Map<string, Resource>();
    private spans: PendingSpan[] = [];
    private logs: PendingLog[] = [];
    private droppedSpans = 0;
    private droppedLogs = 0;
    private exportScheduled = false;

    constructor(options: TelemetryExporterOptions) {
        this.options = options;
    }

    get pendingCount(): number {
        return this.spans.length + this.logs.length;
    }

    /** Queues the records of one tab (or of the worker itself). */
    accept(message: TelemetryBatchMessage): void {
        const resource = this.resourceOf(message.sessionId);
        this.spans.push(...message.spans.map(span => ({resource, span})));
        this.logs.push(...message.logs.map(log => ({resource, log})));
        this.droppedSpans += this.trim(this.spans);
        this.droppedLogs += this.trim(this.logs);

        if (this.pendingCount >= ExportThreshold) {
            void this.export();
        } else {
            this.scheduleExport();
        }
    }

    /**
     * Exports everything pending: spans first, then the logs at or above the served level. The pending records are
     * taken before anything is awaited, so overlapping exports never send the same records twice.
     */
    async export(): Promise<void> {
        const spans = this.spans;
        const pendingLogs = this.logs;
        this.spans = [];
        this.logs = [];

        this.droppedSpans += await this.send('traces', spans, serializeSpans);
        const minSeverity = await this.options.minSeverity();
        await this.reportDropped();
        this.droppedLogs += await this.send('logs', pendingLogs.filter(pending => pending.log.severity >= minSeverity), serializeLogs);
    }

    /** Sends the counts of dropped items on their own; on failure they are kept for the next export. */
    private async reportDropped(): Promise<void> {
        const droppedSpans = this.droppedSpans;
        const droppedLogs = this.droppedLogs;
        if (droppedSpans + droppedLogs === 0) {
            return;
        }

        this.droppedSpans = 0;
        this.droppedLogs = 0;
        const report = {resource: this.resourceOf(WorkerSessionId), log: this.droppedReport(droppedSpans, droppedLogs)};
        if (await this.send('logs', [report], serializeLogs) > 0) {
            this.droppedSpans += droppedSpans;
            this.droppedLogs += droppedLogs;
        }
    }

    /** Posts the items in batches; returns how many items were dropped. A failed batch is not retried. */
    private async send<T>(signal: TelemetrySignal, items: T[], serialize: (batch: T[]) => Uint8Array | undefined): Promise<number> {
        const {batches, tooLarge} = serializeInBatches(items, batch => serialize(batch) ?? new Uint8Array(0));
        let dropped = tooLarge;
        for (const batch of batches) {
            if (!await this.options.post(signal, batch.body)) {
                dropped += batch.itemCount;
            }
        }

        return dropped;
    }

    private droppedReport(droppedSpans: number, droppedLogs: number): LogRecord {
        return {
            time: this.options.now(),
            severity: WarningSeverity,
            message: `Telemetry dropped ${droppedSpans} spans and ${droppedLogs} log records`,
            attributes: {'telemetry.dropped_spans': droppedSpans, 'telemetry.dropped_logs': droppedLogs}
        };
    }

    private resourceOf(sessionId: string): Resource {
        let resource = this.resources.get(sessionId);
        if (resource === undefined) {
            resource = {
                attributes: {
                    'service.name': ServiceName,
                    'service.version': this.options.serviceVersion,
                    'session.id': sessionId
                }
            };
            this.resources.set(sessionId, resource);
        }

        return resource;
    }

    private scheduleExport(): void {
        if (this.exportScheduled) {
            return;
        }

        this.exportScheduled = true;
        this.options.schedule(() => {
            this.exportScheduled = false;
            void this.export();
        }, ExportDelayMs);
    }

    private trim<T>(items: T[]): number {
        const excess = items.length - MaxPendingItems;
        if (excess <= 0) {
            return 0;
        }

        items.splice(0, excess);
        return excess;
    }
}
