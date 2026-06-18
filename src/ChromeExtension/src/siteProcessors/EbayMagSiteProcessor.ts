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
