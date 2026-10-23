// W3C trace context for the extension's backend calls (openspec/specs/observability-tracing):
// one trace id per loaded page, so the backend records every call made while processing that page in one trace.
// Depends neither on the DOM nor on `chrome.*`, so it is unit-tested directly.

const TraceParentHeader = 'traceparent';
const TraceParentVersion = '00';
const SampledFlags = '01';
const TraceIdBytes = 16;
const SpanIdBytes = 8;
const HexRadix = 16;

export type RandomBytes = (count: number) => Uint8Array;

const cryptoRandomBytes: RandomBytes = (count: number): Uint8Array => crypto.getRandomValues(new Uint8Array(count));

function toHex(bytes: Uint8Array): string {
    let hex = '';
    bytes.forEach((value: number) => {
        hex += ('0' + value.toString(HexRadix)).slice(-2);
    });
    return hex;
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

export class PageTraceContext {
    private readonly backendUrl: string;
    private readonly randomBytes: RandomBytes;

    /** Trace id shared by every backend call of this page, also logged so the trace can be found in Grafana. */
    readonly traceId: string;

    constructor(backendUrl: string, randomBytes: RandomBytes = cryptoRandomBytes) {
        this.backendUrl = backendUrl;
        this.randomBytes = randomBytes;
        this.traceId = toHex(randomBytes(TraceIdBytes));
    }

    isBackendCall(input: RequestInfo): boolean {
        return requestUrl(input).startsWith(this.backendUrl);
    }

    /**
     * Returns the request options with a sampled `traceparent` header (this page's trace id and a new parent span id)
     * for a backend call; options of a call to any other host are returned unchanged.
     */
    withTraceParent(input: RequestInfo, init: RequestInit): RequestInit {
        if (!this.isBackendCall(input)) {
            return init;
        }

        const headers = toHeaderRecord(init.headers);
        headers[TraceParentHeader] =
            `${TraceParentVersion}-${this.traceId}-${toHex(this.randomBytes(SpanIdBytes))}-${SampledFlags}`;
        return {...init, headers};
    }
}
