// Loads another eBay page of the lot (purchase history, revision history) in an iframe and reads it once loaded,
// recorded as a span from creating the iframe until its content was read, with a `load` event when eBay delivered
// the page (openspec/specs/client-telemetry). Depends only on the DOM and what is passed in, so it is unit-tested
// directly.

import type {PageTelemetry, TelemetrySpan} from '../../infrastructure/telemetry/PageTelemetry';
import type {Logger} from '../../infrastructure/telemetry/Logger';

const FrameWidth = '1920';
const FrameHeight = '1080';

export interface HiddenPageFrame {
    /** Element id; a frame with this id is created only once per page. */
    id: string;
    url: string;
    /** Span name, e.g. `iframe purchase history`. */
    spanName: string;
    /** Reads the loaded page; runs inside the frame's span. */
    read: (frameDocument: Document, span: TelemetrySpan) => Promise<void>;
}

/** Creates the frame (unless it exists) and reads it when it has loaded. */
export function loadHiddenPageFrame(document: Document, telemetry: PageTelemetry, logger: Logger, frame: HiddenPageFrame): void {
    if (document.getElementById(frame.id)) {
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.id = frame.id;
    iframe.src = frame.url;
    iframe.width = FrameWidth;
    iframe.height = FrameHeight;
    iframe.style.border = '1px solid #ccc';

    const span = telemetry.startSpan(frame.spanName, {attributes: {'url.path': new URL(frame.url).pathname}});
    document.body.appendChild(iframe);

    iframe.addEventListener('load', async () => {
        span.addEvent('load');
        try {
            const frameDocument = iframe.contentDocument;
            if (!frameDocument) {
                logger.warn('Unable to get the content inside the iframe', {}, span);
                return;
            }

            await frame.read(frameDocument, span);
        } catch (error) {
            logger.warn('No access to the iframe due to the Same-Origin Policy', {'exception.message': String(error)}, span);
        } finally {
            span.end();
        }
    });
}
