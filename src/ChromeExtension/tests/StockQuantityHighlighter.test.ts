import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { highlightStockRows } from '../src/siteProcessors/ebayMag/StockQuantityHighlighter.ts';
import type { StockLot } from '../src/siteProcessors/ebayMag/StockQuantityHighlighter.ts';

const fixtureHtml = readFileSync(new URL('./fixtures/ebaymag-stock-table.html', import.meta.url), 'utf8');
const SkuCellIndex = 1;
const QuantityCellIndex = 2;
const ProductId = '707ae646-8334-41e3-ad24-15164d5b2377';
const ProductUrl = `https://anode.su/Product/${ProductId}/Measurements`;

interface RowElements {
    sku: HTMLElement;
    quantity: HTMLElement;
}

function loadStockPage(): Document {
    return new JSDOM(`<!doctype html><body>${fixtureHtml}</body>`).window.document;
}

function lots(sku: string, availableQuantity: number): ReadonlyMap<string, StockLot> {
    return new Map([[sku, { availableQuantity, productUrl: ProductUrl }]]);
}

function findRow(document: Document, sku: string): RowElements {
    for (const row of Array.from(document.querySelectorAll<HTMLElement>('div[role="row"]'))) {
        const cells = row.querySelectorAll<HTMLElement>('div[role="cell"]');
        const skuElement = cells[SkuCellIndex]?.querySelector<HTMLElement>('div[role="button"]');
        const quantityElement = cells[QuantityCellIndex]?.querySelector<HTMLElement>('button');
        if (skuElement?.textContent?.trim() === sku && quantityElement) {
            return { sku: skuElement, quantity: quantityElement };
        }
    }

    throw new Error(`Row with SKU ${sku} not found in the fixture`);
}

function setQuantity(document: Document, sku: string, quantity: string): RowElements {
    const row = findRow(document, sku);
    row.quantity.textContent = quantity;
    return row;
}

function marker(row: RowElements): HTMLElement | null {
    return row.sku.parentElement?.querySelector<HTMLElement>('[data-ebay-tool-stock-marker]') ?? null;
}

function productLink(row: RowElements): HTMLAnchorElement | null {
    return row.sku.parentElement?.querySelector<HTMLAnchorElement>('a[data-ebay-tool-product-link]') ?? null;
}

function assertQuantityCellUntouched(row: RowElements, quantity: string): void {
    assert.equal(row.quantity.textContent, quantity);
    assert.equal(row.quantity.getAttribute('style'), null);
    assert.equal(row.quantity.getAttribute('title'), null);
}

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Over-stock listing is marked next to the SKU", "Listing offers more units than are in stock")]
test('over-stock listing gets a red exclamation marker next to the SKU', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '4');

    highlightStockRows(document, lots('55SOIJ2', 2));

    assert.equal(marker(row)?.textContent, '❗');
    assert.equal(marker(row)?.title, 'Listed 4, only 2 in stock: reduce the quantity');
    assert.equal(row.sku.style.color, 'green');
    assertQuantityCellUntouched(row, '4');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Over-stock listing is marked next to the SKU", "Listing offers units of a lot with nothing in stock")]
test('any listed quantity of a lot with nothing in stock gets the over-stock marker', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '4XX1JQJ', '1');

    highlightStockRows(document, lots('4XX1JQJ', 0));

    assert.equal(marker(row)?.textContent, '❗');
    assert.equal(marker(row)?.title, 'Listed 1, only 0 in stock: reduce the quantity');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Under-stock listing is marked next to the SKU", "Listing offers fewer units than are in stock")]
test('under-stock listing gets a warning marker next to the SKU', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '4XX1JQJ', '1');

    highlightStockRows(document, lots('4XX1JQJ', 3));

    assert.equal(marker(row)?.textContent, '⚠️');
    assert.equal(marker(row)?.title, 'Listed 1, 3 in stock: the quantity can be increased');
    assertQuantityCellUntouched(row, '1');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "No marker for matching quantities or foreign SKUs", "Listing quantity equals available quantity")]
test('matching quantity gets no marker but keeps the product link', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '4VC20NV', '2');

    highlightStockRows(document, lots('4VC20NV', 2));

    assert.equal(marker(row), null);
    assert.notEqual(productLink(row), null);
    assert.equal(row.sku.style.color, 'green');
});

test('a lot whose quantity cannot be read gets only the product link', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '');

    highlightStockRows(document, lots('55SOIJ2', 2));

    assert.equal(marker(row), null);
    assert.notEqual(productLink(row), null);
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "No marker for matching quantities or foreign SKUs", "Row of an unknown SKU")]
test('rows of SKUs that are not our lots are left untouched', () => {
    const document = loadStockPage();
    const row = findRow(document, '436teMv');
    const skuCellHtml = row.sku.parentElement?.innerHTML;

    highlightStockRows(document, lots('55SOIJ2', 2));

    assert.equal(row.sku.style.color, '');
    assert.equal(row.sku.parentElement?.innerHTML, skuCellHtml);
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Product page link next to the SKU", "Link to the product of a known lot")]
test('a known lot gets a link to its product measurements page opening in a new tab', () => {
    const document = loadStockPage();
    const row = findRow(document, '55SOIJ2');

    highlightStockRows(document, lots('55SOIJ2', 2));

    const link = productLink(row);
    assert.equal(link?.href, ProductUrl);
    assert.equal(link?.target, '_blank');
    assert.equal(link?.rel, 'noopener noreferrer');
    assert.equal(link?.textContent, '🔗');
});

test('pressing and clicking the product link does not reach the ebaymag row handlers', () => {
    const document = loadStockPage();
    const row = findRow(document, '55SOIJ2');
    highlightStockRows(document, lots('55SOIJ2', 2));
    const reachedRow: string[] = [];
    const eventNames = ['mousedown', 'mouseup', 'click', 'auxclick'];
    for (const eventName of eventNames) {
        row.sku.parentElement?.addEventListener(eventName, () => reachedRow.push(eventName));
    }

    const window = document.defaultView as Window & typeof globalThis;
    for (const eventName of eventNames) {
        productLink(row)?.dispatchEvent(new window.MouseEvent(eventName, { bubbles: true, cancelable: true }));
    }

    assert.deepEqual(reachedRow, []);
});

test('repeated passes keep the same badges element', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '4');
    highlightStockRows(document, lots('55SOIJ2', 2));
    const firstMarker = marker(row);

    highlightStockRows(document, lots('55SOIJ2', 2));

    assert.equal(marker(row), firstMarker);
    assert.equal(row.sku.parentElement?.querySelectorAll('[data-ebay-tool-sku-badges]').length, 1);
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Markers follow the current row content", "Quantity is corrected on the page")]
test('correcting the quantity removes the marker and keeps the link', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '4');
    highlightStockRows(document, lots('55SOIJ2', 2));

    row.quantity.textContent = '2';
    highlightStockRows(document, lots('55SOIJ2', 2));

    assert.equal(marker(row), null);
    assert.notEqual(productLink(row), null);
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Markers follow the current row content", "Quantity cell is being edited")]
test('the marker stays while the quantity cell is replaced by an edit control', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '4');
    highlightStockRows(document, lots('55SOIJ2', 2));
    const markerBeforeEdit = marker(row);

    const editor = document.createElement('input');
    editor.value = '4';
    row.quantity.replaceWith(editor);
    highlightStockRows(document, lots('55SOIJ2', 2));

    assert.equal(marker(row), markerBeforeEdit);
    assert.equal(marker(row)?.textContent, '❗');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Markers follow the current row content", "Row is reused for an unknown SKU")]
test('a row reused for an unknown SKU loses the highlight, marker and link', () => {
    const document = loadStockPage();
    const row = findRow(document, '0000002');
    highlightStockRows(document, lots('0000002', 0));
    assert.notEqual(marker(row), null);

    row.sku.textContent = 'ZZZZZZZ';
    highlightStockRows(document, lots('0000002', 0));

    assert.equal(row.sku.style.color, '');
    assert.equal(marker(row), null);
    assert.equal(productLink(row), null);
});
