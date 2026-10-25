import type {TelemetrySpan} from '../infrastructure/telemetry/PageTelemetry';

export interface ISiteProcessor {
    /** Name of the processor in telemetry (span names, the handler match event). */
    readonly name: string;

    /** Processes the page; `span` is the processor's span, the parent of the work it records. */
    run(span: TelemetrySpan): Promise<void>;
    
    breakAfterSearchProcessor: boolean;
}