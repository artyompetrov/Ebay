import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";
import { ClientsFactory } from "../clients/ClientsFactory";
import type { EbayToolWebApiClient as EbayToolWebApiClientType } from "../clients/Generated/EbayToolWebApiClient";

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

export function tryGetEbayMagSiteProcessor(): ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname;

    if ((/^https:\/\/ebaymag\.com\/stock$/.test(currentPage)))
    {
        return new EbayMagSiteProcessor();
    }
    return null;
}

class EbayMagSiteProcessor implements ISiteProcessor {
    breakAfterSearchProcessor: boolean = true;
    private backendClient: EbayToolWebApiClientType | null = null;
    private readonly lotDescriptionCache = new Map<string, string>();

    async run(): Promise<void> {
        await utils.sleepElementLoaded('body', document);

        let clientsFactory = new ClientsFactory();
        this.backendClient = await clientsFactory.getEbayToolWebApiClient();

        const lotsForSale = await this.backendClient.getLotForSales();
        const availableQuantityByLotId: ReadonlyMap<string, number> =
            new Map(lotsForSale.map(x => [x.id, x.availableQuantity]));

        const startBackground = async () => {
            while (true) {
                try {
                    this.highlightStockRows(availableQuantityByLotId);
                    await this.searchForDescription();
                }
                catch (e) {
                    console.error(e);
                }

                await utils.sleep(1000);
            }
        };

        void startBackground();
    }

    // Строки таблицы ebaymag переиспользуются и перерисовываются, поэтому на каждом проходе
    // подсветка выставляется заново и снимается там, где она больше не применима.
    private highlightStockRows(availableQuantityByLotId: ReadonlyMap<string, number>): void {
        const rows = Array.from(document.querySelectorAll<HTMLElement>('div[role="row"]'));
        const columns = this.findStockColumns(rows);
        if (!columns) return;

        for (const row of rows) {
            const cells = this.getRowCells(row);
            const skuElement = cells[columns.skuIndex]?.querySelector<HTMLElement>('div[role="button"]');
            if (!skuElement) continue;

            const quantityElement = cells[columns.quantityIndex]?.querySelector<HTMLElement>('button') ?? null;
            const sku = skuElement.textContent?.trim() ?? '';
            const availableQuantity = availableQuantityByLotId.get(sku);

            if (availableQuantity === undefined) {
                this.setHighlight(skuElement, null);
                if (quantityElement) this.setHighlight(quantityElement, null);
                continue;
            }

            this.setHighlight(skuElement, { color: KnownSkuColor, title: null });
            if (quantityElement) {
                this.setHighlight(quantityElement, this.getQuantityHighlight(quantityElement, availableQuantity));
            }
        }
    }

    private findStockColumns(rows: readonly HTMLElement[]): StockColumns | null {
        for (const row of rows) {
            const cellTexts = this.getRowCells(row).map(cell => cell.textContent?.trim() ?? '');
            const skuIndex = cellTexts.indexOf(SkuColumnHeader);
            const quantityIndex = cellTexts.indexOf(QuantityColumnHeader);
            if (skuIndex >= 0 && quantityIndex >= 0) {
                return { skuIndex, quantityIndex };
            }
        }

        return null;
    }

    // Ячейки лежат во вложенных обёртках, поэтому берём все ячейки строки, кроме вложенных в другие ячейки.
    private getRowCells(row: HTMLElement): HTMLElement[] {
        return Array.from(row.querySelectorAll<HTMLElement>(CellSelector))
            .filter(cell => cell.parentElement?.closest(CellSelector) === null);
    }

    private getQuantityHighlight(quantityElement: HTMLElement, availableQuantity: number): Highlight | null {
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
    private setHighlight(element: HTMLElement, highlight: Highlight | null): void {
        const savedOriginal = element.dataset[HighlightDatasetKey];

        if (!highlight) {
            if (savedOriginal === undefined) return;

            const original: OriginalStyle = JSON.parse(savedOriginal);
            if (original.color) {
                element.style.setProperty('color', original.color, original.colorPriority);
            } else {
                element.style.removeProperty('color');
            }
            this.setTitle(element, original.title);
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
        this.setTitle(element, highlight.title ?? original.title);
    }

    private setTitle(element: HTMLElement, title: string | null): void {
        if (title === null) {
            element.removeAttribute('title');
        } else {
            element.title = title;
        }
    }

    private async searchForDescription(): Promise<void> {
        const element = document.querySelector<HTMLDivElement>('#productFormScrollarea');
        if (!element) return;

        const textarea = element.querySelector<HTMLTextAreaElement>('textarea[placeholder^="Describe the item"]');
        if (!textarea) return;

        
        // мы используем такой замудренный способ для поиска id потому что ebaymag не дает получить sku иным стабильным способом
        const match = textarea.value.match(/<!--\s*(.*?)\s*-->/);
        if (!match) return;

        const lotId = match[1].trim();
        if (!lotId) return;

        const descDiv = [...document.querySelectorAll<HTMLDivElement>('div[role="presentation"]')]
            .find(el => (el.textContent ?? '').trim().startsWith('Description'));
        if (!descDiv) return;

        const referenceDescription = await this.getReferenceDescription(lotId);
        if (!referenceDescription) return;

        const link = this.getOrCreateDescriptionLink(descDiv, lotId);
        const hasDifference = this.hasDescriptionDifference(referenceDescription, textarea.value);
        this.setLinkDifferenceState(link, hasDifference);
        link.onclick = async (event) => {
            event.preventDefault();
            await this.updateLotDescription(lotId, referenceDescription, link);
        };
    }

    private getOrCreateDescriptionLink(
        descDiv: HTMLDivElement,
        lotId: string): HTMLAnchorElement {
        const previousLink = descDiv.querySelector<HTMLAnchorElement>('a[data-lot-description-link="true"]');
        if (previousLink?.dataset.lotDescriptionLotId === lotId) {
            return previousLink;
        }

        previousLink?.remove();

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = "Update content " + lotId;
        link.style.display = 'block';
        link.setAttribute('data-lot-description-link', 'true');
        link.dataset.lotDescriptionLotId = lotId;
        descDiv.appendChild(link);

        return link;
    }

    private hasDescriptionDifference(
        referenceDescription: string,
        currentDescription: string): boolean {
        return this.cleanHtmlText(referenceDescription) !== this.cleanHtmlText(currentDescription);
    }

    private setLinkDifferenceState(
        link: HTMLAnchorElement,
        hasDifference: boolean): void {
        if (hasDifference) {
            link.style.setProperty('color', 'red', 'important');
            return;
        }

        link.style.removeProperty('color');
    }

    private async getReferenceDescription(lotId: string): Promise<string | null> {
        const cachedDescription = this.lotDescriptionCache.get(lotId);
        if (cachedDescription) {
            return cachedDescription;
        }

        if (!this.backendClient) {
            return null;
        }

        try {
            const description = await this.backendClient.getLotForSaleDescription(lotId);
            if (!description) {
                return null;
            }

            this.lotDescriptionCache.set(lotId, description);
            return description;
        }
        catch (error) {
            console.error('Failed to load lot description', error);
            return null;
        }
    }

    private cleanHtmlText(html: string): string {
        return html
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/>\s+</g, '><')
            .trim();
    }

    private async updateLotDescription(
        lotId: string,
        description: string,
        link: HTMLAnchorElement): Promise<void> {
        if (!this.backendClient) {
            return;
        }

        const element = document.querySelector<HTMLDivElement>('#productFormScrollarea');
        const textarea = element?.querySelector<HTMLTextAreaElement>('textarea[placeholder^="Describe the item"]');
        if (!textarea) {
            return;
        }

        const initialText = link.textContent;
        link.textContent = `${lotId} (loading...)`;

        try {
            textarea.value = description;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            link.textContent = initialText;
            this.setLinkDifferenceState(link, this.hasDescriptionDifference(description, textarea.value));
        } catch (error) {
            console.error('Failed to update lot description', error);
            link.textContent = initialText ?? lotId;
        }
    }
}
