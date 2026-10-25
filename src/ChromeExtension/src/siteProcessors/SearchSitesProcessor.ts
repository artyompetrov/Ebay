import * as EbayToolBackendClient from "../clients/Generated/EbayToolWebApiClient";
import * as utils from "../infrastructure/Utils";
import * as constants from '../constants';
import { ISiteProcessor } from './ISiteProcessor';
import type {TelemetrySpan} from '../infrastructure/telemetry/PageTelemetry';
// noinspection SpellCheckingInspection
import {v4 as uuidv4} from "uuid";
import {ClientsFactory} from "../clients/ClientsFactory";
import {ProductWithId} from "../clients/Generated/EbayToolWebApiClient";
import {Mode} from '../mode';
import {
    buildHighlightStyles,
    getProductHighlightClass,
    ProductHighlighter,
    ProductIdsAttribute
} from './searchSites/ProductHighlighter';
import {ProductTooltip, TooltipElementId, TooltipProduct} from './searchSites/ProductTooltip';

declare const EBAY_HELPER_BACKEND_DOMAIN: string;

const chipFindRegex: RegExp = /(?:^|\.)chipfind\.ru$/i
const avitoRegex: RegExp = /(?:^|\.)avito\.ru$/i

const backendDomainRegex = new RegExp(
    `(?:^|\\.)${EBAY_HELPER_BACKEND_DOMAIN.replace(/\./g, '\\.')}(?::\\d+)?($|/)`,
    'i'
);

const excludeSites: RegExp[] = [
    /(?:^|\.)ebay\..*$/i,
    backendDomainRegex,
    /^localhost$/i,
];

export function tryGetSearchSitesProcessor() : ISiteProcessor | null {
    if (!utils.matchesAnyRegex(excludeSites, location.hostname)) {
        return new SearchSitesProcessor();
    }
    return null;
}

class ProductWithRegex {
    product: ProductWithId;
    regex: RegExp;
    regexString: string;
    regexFlagsString: string;
    
    constructor(product: EbayToolBackendClient.ProductWithId, regex: RegExp) {
        this.product = product;
        this.regex = regex;
        this.regexString = regex.source;
        this.regexFlagsString = regex.flags;
    }
}

class SearchSitesProcessor implements ISiteProcessor {
    readonly name = 'SearchSitesProcessor';
    breakAfterSearchProcessor: boolean = false;
    
    private _ebayToolBackendClient: EbayToolBackendClient.EbayToolWebApiClient;
    private _allItemsCacheIdentifier = "searchSitesAllItems";
    private _targetCurrencyRate: number;
    private _targetCurrencyCacheIdentifier = "targetCurrency";
    private _products: Map<string, ProductWithRegex>;


    async getTargetCurrencyCached(): Promise<number> {
        return await utils.getCachedDataOrFallback<number>(this._targetCurrencyCacheIdentifier, async () => {
                const currencies = await this._ebayToolBackendClient.getCurrencies();
                // Ищем RUB в списке валют
                const rubCurrency = currencies.find(currency => currency.ebayName === "RUB");
                if (!rubCurrency) {
                    throw new Error("Currency RUB not found in currencies list");
                }
                return rubCurrency.rate;
            },
            24 * 60 * 60);
    }

    // Получение всех продуктов из кэша или с сервера
    async getAllProductsCached(productId: string | null, allItemsCacheIdentifier: string) : Promise<Map<string, ProductWithRegex>> {
        let cached = await utils.getCachedDataOrFallback(allItemsCacheIdentifier, async () => {
                return await this.getProductWithRegexes()
            },
            60 * 60);

        if (productId) {
            const trimmedProductId = productId.trim().toLowerCase();
            if (!cached.some(p => p.product.id.trim().toLowerCase() === trimmedProductId)) {
                console.log(`Product ID ${trimmedProductId} not found in cache, refreshing cache, clearing cache...`);
                utils.removeFromCache(allItemsCacheIdentifier);

                cached = await utils.getCachedDataOrFallback(allItemsCacheIdentifier, async () => {
                        return await this.getProductWithRegexes()
                    },
                    60 * 60);
            }
        }

        let result = new Map<string, ProductWithRegex>();
        
        for (const product of cached) {
            result.set(product.product.id, new ProductWithRegex(product.product, new RegExp(product.regexString, product.regexFlagsString)))
        }
        
        return result;
    }

    async getProductWithRegexes() : Promise<ProductWithRegex[]> {
        let products = await this._ebayToolBackendClient.getAllProducts();

        return  products.map(product => {

            return  new ProductWithRegex(
                product,
                new RegExp(product.productRegex, "ig"))
        });
    }

    // Функция для транслитерации текста с русского на английский
    transliterate(text: string): string {
        const map: { [key: string]: string } = {
            "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
            "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
            "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
            "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "sh",
            "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
            "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "YO",
            "Ж": "J", "З": "Z", "И": "I", "Й": "Y", "К": "K", "Л": "L", "М": "M",
            "Н": "N", "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U",
            "Ф": "F", "Х": "H", "Ц": "C", "Ч": "CH", "Ш": "SH", "Щ": "SH",
            "Ъ": "", "Ы": "Y", "Ь": "", "Э": "E", "Ю": "YU", "Я": "YA",
        };
        return text
            .split("")
            .map((char) => map[char] || char) // Заменяем символы на основе таблицы
            .join("");
    }


// Обработка страницы chipfind.ru
    async processChipFind(): Promise<void> {
        console.log("processChipFind");
        if (location.pathname === "/market/search.htm" || location.pathname === "/market/") {
            await utils.sleepElementLoaded('div.pages', document);
            await utils.sleepElementLoaded('.plus a', document);

            let elements = document.querySelectorAll<HTMLAnchorElement>('.plus a');
            // Кликаем по каждому элементу
            for (const element of elements) {
                element.click();
                await utils.sleep(300);
            }
        }

        let posts = document.querySelectorAll<HTMLTableCellElement>('table.post');

        posts.forEach(function (post) {
            let plus = post.querySelector<HTMLDivElement>('div.plus');
            let contact = post.querySelector<HTMLDivElement>('div.contact');

            let contactHtml = contact?.innerHTML ?? "";
            plus?.remove();
            contact?.remove();

            let targetDiv = post.querySelector<HTMLDivElement>('div[id^="R"], td.rr');
            if (targetDiv) {
                targetDiv.innerHTML = '<pre>' + targetDiv.innerHTML.replace(/<br\s*\/?>/g, '</pre><pre>') + '</pre><br>' + contactHtml;
            }
        });
    
    }

    // Обработка страницы avito.ru в фоне
    async processAvitoBackground(): Promise<void> {
        console.log("processAvitoBackground");
        let found = false;
        do {
            await utils.sleep(300);

            let moreButton = [...document.querySelectorAll('a')].filter(a => a.innerText.includes("Читать полностью"));

            if (moreButton.length > 0) {
                moreButton[0].click();
                found = true;
            }
        } while (!found);
    }

    // Обработка страницы avito.ru
    async processAvito(): Promise<void> {
        console.log("processAvito");
        let description = document.querySelectorAll<HTMLDivElement>('div[itemprop="description"]');

        description.forEach(function (post) {
            post.innerHTML = '<div>' + post.innerHTML.replace(/<br\s*\/?>/g, '</div><div>') + '</div><br>';
        });
    }

    // Показывает уведомление
    showToast(message: string, duration: number = 3000): void {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.padding = "10px 20px";
        toast.style.background = "rgba(0, 0, 0, 0.8)";
        toast.style.color = "white";
        toast.style.borderRadius = "5px";
        toast.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
        toast.style.zIndex = "1000";
        toast.style.opacity = "1";
        toast.style.transition = "opacity 0.5s";

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => document.body.removeChild(toast), 500);
        }, duration);
    }

    // Обработка страницы поискового сайта
    async processSitePage(): Promise<void> {
        if (chipFindRegex.test(location.host)) {
            await this.processChipFind();
        } else if (avitoRegex.test(location.host)) {
            await this.processAvito();
            // noinspection JSUnusedLocalSymbols
            let _ = this.processAvitoBackground();
        }

        this._products = await this.getAllProductsCached(null, this._allItemsCacheIdentifier);
        this.startHighlighting();
    }

    // Подсветка и подсказка работают сами: подсветка - в периоды простоя браузера и по изменениям DOM.
    private startHighlighting(): void {
        const products = Array.from(this._products.values());
        new ProductHighlighter(
            document.body,
            products.map(product => ({
                id: product.product.id,
                regex: product.regex,
                isInteresting: product.product.isInteresting,
                isCheckRequired: product.product.isCheckRequired,
            })),
            callback => window.requestIdleCallback(callback),
            `#${TooltipElementId}`
        ).start();

        new ProductTooltip(
            document,
            ProductIdsAttribute,
            id => {
                const product = this._products.get(id);
                return product ? this.toTooltipProduct(product) : undefined;
            },
            id => `${constants.Urls.backendUrl}Product/${id}`
        ).start();
    }

    private toTooltipProduct(product: ProductWithRegex): TooltipProduct {
        const ruNames = product.product.ruSearchQueries?.map(query => query.query) ?? [];
        const calculation = product.product.productCalculationResult;
        return {
            id: product.product.id,
            name: product.product.name,
            searchNames: [product.product.name, ...ruNames],
            averagePriceRub: calculation ? calculation.revenueAvg * this._targetCurrencyRate : null,
            quantityTotal: calculation?.quantityTotal ?? 0,
            isCheckRequired: product.product.isCheckRequired,
            isWeightMissing: product.product.weight === 0,
            highlightClass: getProductHighlightClass(product.product),
        };
    }

    public async run(span: TelemetrySpan): Promise<void> {
        console.log("searchSitePages");
        
        const clientsFactory = new ClientsFactory();
        this._ebayToolBackendClient = await clientsFactory.getEbayToolBackendClient()

        this._targetCurrencyRate = await this.getTargetCurrencyCached();
        
        // Обрабатываем страницу
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.processSitePage());
        } else {
            await this.processSitePage();
        }


        // Слушаем сообщения от background скрипта
        // noinspection JSUnusedLocalSymbols
        chrome.runtime.onMessage.addListener(async (message: {action: string, text: string}, sender, sendResponse) => {
            if (message.action === "processText") {
                console.log("Received message", message.text);
                try {
                    const productName = message.text.trim();
                    await this._ebayToolBackendClient.createProduct(new EbayToolBackendClient.ProductWithoutId({
                        name: productName,
                        searchQueries: Array.of(new EbayToolBackendClient.SearchQuery({
                            id: uuidv4(),
                            query: this.transliterate(productName)
                        })),
                        ruSearchQueries: new Array<EbayToolBackendClient.RuSearchQuery>(),
                        weight: 0
                    }));
                    utils.removeFromCache(this._allItemsCacheIdentifier);
                    this.showToast("Product created \"" + productName + "\"");
                }
                catch (error) {
                    this.showToast("Error while creating a product");
                    console.log(JSON.stringify(error))
                }
            }
        });

        // Добавляем стили для подсветки
        const style = document.createElement("style");
        style.textContent = buildHighlightStyles({
            known: constants.Colors.lightGray,
            checked: constants.Colors.lightYellow,
            interesting: constants.Colors.lightGreen,
        });
        document.head.appendChild(style);
    }
}