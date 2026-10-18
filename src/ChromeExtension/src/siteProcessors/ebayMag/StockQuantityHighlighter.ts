// Подсветка количества на странице ebaymag.com/stock: сравнивает количество в листинге с наличием лота.
// Модуль зависит только от DOM, чтобы его можно было тестировать на снимке разметки (tests/).

const SkuColumnHeader = 'SKU';
const QuantityColumnHeader = 'Quantity';
const KnownSkuColor = 'green';
const QuantityOverStockColor = 'red';
const QuantityUnderStockColor = '#d4a000';
// Хранит исходные color/title элемента, чтобы при снятии подсветки вернуть то, что выставил ebaymag.
const HighlightDatasetKey = 'ebayToolHighlight';
const CellSelector = 'div[role="cell"], div[role="columnheader"]';

interface StockColumns {
    skuIndex: number;
    quantityIndex: number;
}

interface Highlight {
    color: string;
    title: string | null;
}

interface OriginalStyle {
    color: string;
    colorPriority: string;
    title: string | null;
}

// Строки таблицы ebaymag переиспользуются и перерисовываются, поэтому на каждом проходе
// подсветка выставляется заново и снимается там, где она больше не применима.
export function highlightStockRows(root: ParentNode, availableQuantityByLotId: ReadonlyMap<string, number>): void {
    const rows = Array.from(root.querySelectorAll<HTMLElement>('div[role="row"]'));
    const columns = findStockColumns(rows);
    if (!columns) return;

    for (const row of rows) {
        const cells = getRowCells(row);
        const skuElement = cells[columns.skuIndex]?.querySelector<HTMLElement>('div[role="button"]');
        if (!skuElement) continue;

        const quantityElement = cells[columns.quantityIndex]?.querySelector<HTMLElement>('button') ?? null;
        const sku = skuElement.textContent?.trim() ?? '';
        const availableQuantity = availableQuantityByLotId.get(sku);

        if (availableQuantity === undefined) {
            setHighlight(skuElement, null);
            if (quantityElement) setHighlight(quantityElement, null);
            continue;
        }

        setHighlight(skuElement, { color: KnownSkuColor, title: null });
        if (quantityElement) {
            setHighlight(quantityElement, getQuantityHighlight(quantityElement, availableQuantity));
        }
    }
}

function findStockColumns(rows: readonly HTMLElement[]): StockColumns | null {
    for (const row of rows) {
        const cellTexts = getRowCells(row).map(cell => cell.textContent?.trim() ?? '');
        const skuIndex = cellTexts.indexOf(SkuColumnHeader);
        const quantityIndex = cellTexts.indexOf(QuantityColumnHeader);
        if (skuIndex >= 0 && quantityIndex >= 0) {
            return { skuIndex, quantityIndex };
        }
    }

    return null;
}

// Ячейки лежат во вложенных обёртках, поэтому берём все ячейки строки, кроме вложенных в другие ячейки.
function getRowCells(row: HTMLElement): HTMLElement[] {
    return Array.from(row.querySelectorAll<HTMLElement>(CellSelector))
        .filter(cell => cell.parentElement?.closest(CellSelector) === null);
}

function getQuantityHighlight(quantityElement: HTMLElement, availableQuantity: number): Highlight | null {
    const quantityText = quantityElement.textContent?.trim() ?? '';
    if (!/^\d+$/.test(quantityText)) return null;

    const listedQuantity = Number(quantityText);
    if (listedQuantity > availableQuantity) {
        return { color: QuantityOverStockColor, title: `Only ${availableQuantity} in stock` };
    }

    if (listedQuantity < availableQuantity) {
        return { color: QuantityUnderStockColor, title: `${availableQuantity} in stock` };
    }

    return null;
}

// Снимаем только то, что выставили сами, и возвращаем исходные color/title ebaymag.
function setHighlight(element: HTMLElement, highlight: Highlight | null): void {
    const savedOriginal = element.dataset[HighlightDatasetKey];

    if (!highlight) {
        if (savedOriginal === undefined) return;

        const original: OriginalStyle = JSON.parse(savedOriginal);
        if (original.color) {
            element.style.setProperty('color', original.color, original.colorPriority);
        } else {
            element.style.removeProperty('color');
        }
        setTitle(element, original.title);
        delete element.dataset[HighlightDatasetKey];
        return;
    }

    const original: OriginalStyle = savedOriginal === undefined
        ? {
            color: element.style.getPropertyValue('color'),
            colorPriority: element.style.getPropertyPriority('color'),
            title: element.getAttribute('title'),
        }
        : JSON.parse(savedOriginal);
    element.dataset[HighlightDatasetKey] = JSON.stringify(original);

    element.style.setProperty('color', highlight.color, 'important');
    setTitle(element, highlight.title ?? original.title);
}

function setTitle(element: HTMLElement, title: string | null): void {
    if (title === null) {
        element.removeAttribute('title');
    } else {
        element.title = title;
    }
}
