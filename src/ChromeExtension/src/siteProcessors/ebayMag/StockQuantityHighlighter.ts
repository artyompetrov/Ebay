// Разметка строк ebaymag.com/stock для наших лотов: зелёный SKU, рядом маркер расхождения количества
// с наличием и ссылка на страницу товара. Модуль зависит только от DOM, чтобы его можно было
// тестировать на снимке разметки (tests/).

export interface StockLot {
    availableQuantity: number;
    productUrl: string;
}

const SkuColumnHeader = 'SKU';
const QuantityColumnHeader = 'Quantity';
const KnownSkuColor = 'green';
const OverStockMarker = '❗';
const UnderStockMarker = '⚠️';
const ProductLinkText = '🔗';
const ProductLinkTitle = 'Open the product in Ebay tool';
// Хранит исходный inline-цвет SKU, чтобы при снятии подсветки вернуть то, что выставил ebaymag.
const SkuColorDatasetKey = 'ebayToolSkuColor';
const BadgesAttribute = 'data-ebay-tool-sku-badges';
const BadgesStateDatasetKey = 'ebayToolSkuBadgesState';
const CellSelector = 'div[role="cell"], div[role="columnheader"]';
// Клики и нажатия по бейджам не должны доходить до обработчиков строки ebaymag (открытие редактора).
const BlockedEvents = ['click', 'auxclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup'] as const;

interface StockColumns {
    skuIndex: number;
    quantityIndex: number;
}

interface StockMarker {
    text: string;
    title: string;
}

interface OriginalColor {
    color: string;
    priority: string;
}

// Строки таблицы ebaymag переиспользуются и перерисовываются, поэтому на каждом проходе
// разметка приводится к текущему SKU и количеству строки и снимается там, где больше не нужна.
export function highlightStockRows(root: ParentNode, lotsById: ReadonlyMap<string, StockLot>): void {
    const rows = Array.from(root.querySelectorAll<HTMLElement>('div[role="row"]'));
    const columns = findStockColumns(rows);
    if (!columns) return;

    for (const row of rows) {
        const cells = getRowCells(row);
        const skuElement = cells[columns.skuIndex]?.querySelector<HTMLElement>('div[role="button"]');
        if (!skuElement) continue;

        const lot = lotsById.get(skuElement.textContent?.trim() ?? '');
        if (!lot) {
            setSkuColor(skuElement, null);
            removeBadges(skuElement);
            continue;
        }

        setSkuColor(skuElement, KnownSkuColor);

        const listedQuantity = readListedQuantity(cells[columns.quantityIndex]);
        // Пока ячейка количества в режиме редактирования, число не читается: оставляем бейджи как были,
        // чтобы маркер не пропадал ровно тогда, когда оператор меняет количество.
        if (listedQuantity === null && findBadges(skuElement)) continue;

        renderBadges(skuElement, getStockMarker(listedQuantity, lot.availableQuantity), lot.productUrl);
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

function readListedQuantity(quantityCell: HTMLElement | undefined): number | null {
    const quantityText = quantityCell?.querySelector<HTMLElement>('button')?.textContent?.trim() ?? '';
    return /^\d+$/.test(quantityText) ? Number(quantityText) : null;
}

function getStockMarker(listedQuantity: number | null, availableQuantity: number): StockMarker | null {
    if (listedQuantity === null) return null;

    if (listedQuantity > availableQuantity) {
        return {
            text: OverStockMarker,
            title: `Listed ${listedQuantity}, only ${availableQuantity} in stock: reduce the quantity`,
        };
    }

    if (listedQuantity < availableQuantity) {
        return {
            text: UnderStockMarker,
            title: `Listed ${listedQuantity}, ${availableQuantity} in stock: the quantity can be increased`,
        };
    }

    return null;
}

function setSkuColor(skuElement: HTMLElement, color: string | null): void {
    const savedOriginal = skuElement.dataset[SkuColorDatasetKey];

    if (color === null) {
        if (savedOriginal === undefined) return;

        const original: OriginalColor = JSON.parse(savedOriginal);
        if (original.color) {
            skuElement.style.setProperty('color', original.color, original.priority);
        } else {
            skuElement.style.removeProperty('color');
        }
        delete skuElement.dataset[SkuColorDatasetKey];
        return;
    }

    if (savedOriginal === undefined) {
        const original: OriginalColor = {
            color: skuElement.style.getPropertyValue('color'),
            priority: skuElement.style.getPropertyPriority('color'),
        };
        skuElement.dataset[SkuColorDatasetKey] = JSON.stringify(original);
    }

    skuElement.style.setProperty('color', color, 'important');
}

function findBadges(skuElement: HTMLElement): HTMLElement | null {
    return skuElement.parentElement?.querySelector<HTMLElement>(`:scope > [${BadgesAttribute}]`) ?? null;
}

function removeBadges(skuElement: HTMLElement): void {
    findBadges(skuElement)?.remove();
}

// Пересобираем бейджи только при изменении содержимого, чтобы не сбрасывать hover каждую секунду.
function renderBadges(skuElement: HTMLElement, marker: StockMarker | null, productUrl: string): void {
    const state = JSON.stringify({ marker, productUrl });
    const existing = findBadges(skuElement);
    if (existing?.dataset[BadgesStateDatasetKey] === state) return;

    const document = skuElement.ownerDocument;
    const badges = document.createElement('span');
    badges.setAttribute(BadgesAttribute, 'true');
    badges.dataset[BadgesStateDatasetKey] = state;
    badges.style.marginLeft = '4px';
    badges.style.whiteSpace = 'nowrap';
    for (const eventName of BlockedEvents) {
        badges.addEventListener(eventName, event => event.stopPropagation());
    }

    if (marker) {
        const markerElement = document.createElement('span');
        markerElement.setAttribute('data-ebay-tool-stock-marker', 'true');
        markerElement.textContent = marker.text;
        markerElement.title = marker.title;
        markerElement.style.cursor = 'help';
        badges.appendChild(markerElement);
    }

    const link = document.createElement('a');
    link.setAttribute('data-ebay-tool-product-link', 'true');
    link.href = productUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = ProductLinkText;
    link.title = ProductLinkTitle;
    link.style.textDecoration = 'none';
    badges.appendChild(link);

    if (existing) {
        existing.replaceWith(badges);
    } else {
        skuElement.after(badges);
    }
}
