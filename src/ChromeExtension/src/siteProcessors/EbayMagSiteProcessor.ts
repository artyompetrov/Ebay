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

        const textarea = <HTMLTextAreaElement>element.querySelector('textarea[placeholder^="Describe the item"]');
        if (!textarea) return;

        const match = textarea.value.match(/<!--\s*(.*?)\s*-->/);
        if (!match) return;

        const commentContent = match[1].trim();
        if (element.dataset.processedLotId === commentContent) return;

        const descDiv = [...document.querySelectorAll<HTMLDivElement>('div[role="presentation"]')]
            .find(el => (el.textContent ?? '').trim().startsWith('Description'));
        if (!descDiv) return;

        const previousLink = descDiv.querySelector<HTMLAnchorElement>('a[data-lot-description-link="true"]');
        if (previousLink) {
            previousLink.remove();
        }

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = "Update content " + commentContent ;
        link.style.display = 'block';
        link.setAttribute('data-lot-description-link', 'true');
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.updateLotDescription(commentContent, textarea, link);
        });

        descDiv.appendChild(link);
        element.dataset.processedLotId = commentContent;
    }

    private async updateLotDescription(
        lotId: string,
        textarea: HTMLTextAreaElement,
        link: HTMLAnchorElement): Promise<void> {
        if (!this.backendClient) {
            return;
        }

        const initialText = link.textContent;
        link.textContent = `${lotId} (loading...)`;

        try {
            const description = await this.backendClient.getLotForSaleDescription(lotId);
            if (!description) {
                throw new Error(`Description for lot ${lotId} is empty.`);
            }

            textarea.value = description;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            link.textContent = initialText;
        } catch (error) {
            console.error('Failed to update lot description', error);
            link.textContent = initialText ?? lotId;
        }
    }
}
