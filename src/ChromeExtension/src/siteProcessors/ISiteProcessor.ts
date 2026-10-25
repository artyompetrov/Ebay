import type {TelemetrySpan} from '../infrastructure/telemetry/PageTelemetry';

export interface ISiteProcessor {
    /** Name of the processor in telemetry (span names, the handler match event). */
    readonly name: string;

    /** Processes the page; `span` is the processor's span, the parent of the work it records. */
    run(span: TelemetrySpan): Promise<void>;
    
    breakAfterSearchProcessor: boolean;

    /**
     * `false` for a processor that runs on any site: then the page's path is not recorded, only its host
     * (openspec/specs/client-telemetry). Recorded by default.
     */
    readonly recordsPagePath?: boolean;
}