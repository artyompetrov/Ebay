import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";
import { ClientsFactory } from "../clients/ClientsFactory";
import type { EbayToolWebApiClient as EbayToolWebApiClientType } from "../clients/Generated/EbayToolWebApiClient";

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

        let lotsForSale = await this.backendClient.getLotForSales();
        const lotForSaleIds = new Set(lotsForSale.map(x => x.id));

        const startBackground = async () => {
            while (true) {
                try {
                    this.highlightKnownSkuElements(lotForSaleIds);
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

    private highlightKnownSkuElements(lotForSaleIds: ReadonlySet<string>): void {
        const skuElements = Array.from(document.querySelectorAll<HTMLElement>('div[role="button"]'))
            .filter(element => element.textContent?.trim().length === 7);

        for (const skuElement of skuElements) {
            const sku = skuElement.textContent?.trim();
            if (sku && lotForSaleIds.has(sku)) {
                skuElement.style.setProperty('color', 'green', 'important');
            }
        }
    }

    private async searchForDescription(): Promise<void> {
        const element = document.querySelector<HTMLDivElement>('#productFormScrollarea');
        if (!element) return;

        const lotId = element.dataset.processedLotId?.trim();
        if (!lotId) return;

        const textarea = element.querySelector<HTMLTextAreaElement>('textarea[placeholder^="Describe the item"]');
        if (!textarea) return;

        const descDiv = [...document.querySelectorAll<HTMLDivElement>('div[role="presentation"]')]
            .find(el => (el.textContent ?? '').trim().startsWith('Description'));
        if (!descDiv) return;

        const referenceDescription = await this.getReferenceDescription(lotId);
        if (!referenceDescription) return;

        const previousLink = descDiv.querySelector<HTMLAnchorElement>('a[data-lot-description-link="true"]');
        const hasDifference = this.normalizeHtml(referenceDescription) !== this.normalizeHtml(textarea.value);
        if (previousLink?.dataset.lotDescriptionLotId === lotId) {
            this.setLinkDifferenceState(previousLink, hasDifference);
            return;
        }

        if (previousLink) {
            previousLink.remove();
        }

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = "Update content " + lotId;
        link.style.display = 'block';
        link.setAttribute('data-lot-description-link', 'true');
        link.dataset.lotDescriptionLotId = lotId;
        this.setLinkDifferenceState(link, hasDifference);
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.updateLotDescription(lotId, referenceDescription, link);
        });

        descDiv.appendChild(link);
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

    private normalizeHtml(html: string): string {
        const template = document.createElement('template');
        template.innerHTML = html;
        this.normalizeHtmlNode(template.content);

        return template.innerHTML.trim();
    }

    private normalizeHtmlNode(node: Node): void {
        for (const child of [...node.childNodes]) {
            if (child.nodeType === Node.COMMENT_NODE) {
                child.remove();
                continue;
            }

            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent ?? '';
                if (!/\S/.test(text)) {
                    child.remove();
                    continue;
                }

                child.textContent = text.replace(/\s+/g, ' ');
                continue;
            }

            this.normalizeHtmlNode(child);
        }
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
            this.setLinkDifferenceState(link, false);
        } catch (error) {
            console.error('Failed to update lot description', error);
            link.textContent = initialText ?? lotId;
        }
    }
}
