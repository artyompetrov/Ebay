import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { highlightStockRows } from '../src/siteProcessors/ebayMag/StockQuantityHighlighter.ts';

const fixtureHtml = readFileSync(new URL('./fixtures/ebaymag-stock-table.html', import.meta.url), 'utf8');
const SkuCellIndex = 1;
const QuantityCellIndex = 2;
const UnderStockColor = 'rgb(212, 160, 0)';

interface RowElements {
    sku: HTMLElement;
    quantity: HTMLElement;
}

function loadStockPage(): Document {
    return new JSDOM(`<!doctype html><body>${fixtureHtml}</body>`).window.document;
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

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Quantity greater than available is highlighted red", "Listing offers more units than are in stock")]
test('quantity above available stock is red with an "only N in stock" tooltip', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '4');

    highlightStockRows(document, new Map([['55SOIJ2', 2]]));

    assert.equal(row.quantity.style.color, 'red');
    assert.equal(row.quantity.title, 'Only 2 in stock');
    assert.equal(row.sku.style.color, 'green');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Quantity greater than available is highlighted red", "Listing offers units of a lot with nothing in stock")]
test('any listed quantity of a lot with nothing in stock is red', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '4XX1JQJ', '1');

    highlightStockRows(document, new Map([['4XX1JQJ', 0]]));

    assert.equal(row.quantity.style.color, 'red');
    assert.equal(row.quantity.title, 'Only 0 in stock');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Quantity less than available is highlighted yellow", "Listing offers fewer units than are in stock")]
test('quantity below available stock is yellow with an "N in stock" tooltip', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '4XX1JQJ', '1');

    highlightStockRows(document, new Map([['4XX1JQJ', 3]]));

    assert.equal(row.quantity.style.color, UnderStockColor);
    assert.equal(row.quantity.title, '3 in stock');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Matching or foreign quantities are not highlighted", "Listing quantity equals available quantity")]
test('quantity equal to available stock is not highlighted', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '4VC20NV', '2');

    highlightStockRows(document, new Map([['4VC20NV', 2]]));

    assert.equal(row.quantity.style.color, '');
    assert.equal(row.quantity.getAttribute('title'), null);
    assert.equal(row.sku.style.color, 'green');
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Matching or foreign quantities are not highlighted", "Row of an unknown SKU")]
test('rows of SKUs that are not our lots are left untouched', () => {
    const document = loadStockPage();
    const row = findRow(document, '436teMv');

    highlightStockRows(document, new Map([['55SOIJ2', 2]]));

    assert.equal(row.sku.style.color, '');
    assert.equal(row.quantity.style.color, '');
    assert.equal(row.quantity.getAttribute('title'), null);
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Highlights follow the current row content", "Quantity is corrected on the page")]
test('correcting the quantity to available stock removes the red highlight and tooltip', () => {
    const document = loadStockPage();
    const availableQuantityByLotId = new Map([['55SOIJ2', 2]]);
    const row = setQuantity(document, '55SOIJ2', '4');
    highlightStockRows(document, availableQuantityByLotId);

    row.quantity.textContent = '2';
    highlightStockRows(document, availableQuantityByLotId);

    assert.equal(row.quantity.style.color, '');
    assert.equal(row.quantity.getAttribute('title'), null);
});

// [OpenSpecScenario("ebaymag-stock-quantity-check", "Highlights follow the current row content", "Row is reused for an unknown SKU")]
test('a row reused for an unknown SKU loses the SKU and quantity highlights', () => {
    const document = loadStockPage();
    const availableQuantityByLotId = new Map([['0000002', 0]]);
    const row = findRow(document, '0000002');
    highlightStockRows(document, availableQuantityByLotId);

    row.sku.textContent = 'ZZZZZZZ';
    highlightStockRows(document, availableQuantityByLotId);

    assert.equal(row.sku.style.color, '');
    assert.equal(row.quantity.style.color, '');
    assert.equal(row.quantity.getAttribute('title'), null);
});

test('the native tooltip of ebaymag is restored when the highlight is removed', () => {
    const document = loadStockPage();
    const availableQuantityByLotId = new Map([['4XX1JQJ', 3]]);
    const row = setQuantity(document, '4XX1JQJ', '1');
    row.quantity.title = 'native';
    highlightStockRows(document, availableQuantityByLotId);
    assert.equal(row.quantity.title, '3 in stock');

    row.quantity.textContent = '3';
    highlightStockRows(document, availableQuantityByLotId);

    assert.equal(row.quantity.title, 'native');
    assert.equal(row.quantity.style.color, '');
});

test('a non-numeric quantity is not highlighted', () => {
    const document = loadStockPage();
    const row = setQuantity(document, '55SOIJ2', '');

    highlightStockRows(document, new Map([['55SOIJ2', 2]]));

    assert.equal(row.quantity.style.color, '');
    assert.equal(row.sku.style.color, 'green');
});
