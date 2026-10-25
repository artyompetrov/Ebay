// Showing the lot registration panel (openspec/specs/client-telemetry, "Extension page reaction is traced from
// navigation start"): the moment it becomes visible is the extension's reaction time on a lot page.
// Depends only on the DOM and the span passed in, so it is unit-tested directly.

import type {TelemetrySpan} from '../../infrastructure/telemetry/PageTelemetry';

/** Makes the panel visible; the first time, adds a `panel.shown` event to the page root span. */
export function showLotPanel(panel: HTMLElement, pageSpan: TelemetrySpan | undefined): void {
    if (!panel.hidden) {
        return;
    }

    panel.hidden = false;
    pageSpan?.addEvent('panel.shown');
}
