import * as EbayToolBackendClient from "../clients/EbayToolBackendClient";
import * as utils from "../infrastructure/Utils";
import * as constants from '../constants';
import { ISiteProcessor } from './ISiteProcessor';
// noinspection SpellCheckingInspection
import {v4 as uuidv4} from "uuid";
import {ClientsFactory} from "../clients/ClientsFactory";
import {ProductWithId} from "../clients/EbayToolBackendClient";

const chipFindRegex: RegExp = /(?:^|\.)chipfind\.ru$/i
const avitoRegex: RegExp = /(?:^|\.)avito\.ru$/i
const meshokfindRegex: RegExp = /(?:^|\.)meshok\.net$/i
const searchOnSites: RegExp[] = [
    avitoRegex,
    chipFindRegex,
    meshokfindRegex
]

export function tryGetSearchSitesProcessor() : ISiteProcessor | null {
    if (utils.matchesAnyRegex(searchOnSites, location.host)) {

        return new SearchSitesProcessor();
    }
    return null;
}

class ProductWithRegex {
    product: ProductWithId;
    regex: RegExp;
    regexString: string;
    regexFlagsString: string;
    revenueRub: number | null;
    isInteresting: boolean;
    
    constructor(product: EbayToolBackendClient.ProductWithId, regex: RegExp, rubRate: number) {
        this.product = product;
        this.regex = regex;
        this.regexString = regex.source;
        this.regexFlagsString = regex.flags;
        this.revenueRub = product.productCalculationResult?.revenueAvg * rubRate
        this.isInteresting = this.revenueRub > constants.Settings.interestingRevenueRub && product.productCalculationResult.quantityTotal >= constants.Settings.interestingCountInStatistics;
    }
}

class SearchSitesProcessor implements ISiteProcessor {
    private _ebayToolBackendClient: EbayToolBackendClient.EbayToolBackendClient;
    private _allItemsCacheIdentifier = "searchSitesAllItems";
    private _targetCurrencyRate: number;
    private _targetCurrencyCacheIdentifier = "targetCurrency";
    private _highlightKnownClass:string = "highlightKnown";
    private _highlightCheckedClass:string = "highlightChecked";
    private _highlightInterestingClass:string = "highlightInteresting";
    private _foundProductIdsAttribute: string = 'data-product-ids';
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
            result.set(product.product.id, new ProductWithRegex(product.product, new RegExp(product.regexString, product.regexFlagsString), this._targetCurrencyRate))
        }
        
        return result;
    }

    async getProductWithRegexes() : Promise<ProductWithRegex[]> {
        let products = await this._ebayToolBackendClient.getAllProducts();
        
        // Создаем регулярные выражения для каждого продукта
        const productsWithRegexes: ProductWithRegex[] = [];

        // Для каждого продукта создаем регулярку из его имени и поисковых запросов
        for (const product of products) {
            const productSearchTerms: string[] = [];

            // Добавляем имя продукта
            productSearchTerms.push(product.name);

            // Добавляем поисковые запросы
            if (product.ruSearchQueries && product.ruSearchQueries.length > 0) {
                for (const sq of product.ruSearchQueries) {
                    if (sq.query) {
                        productSearchTerms.push(sq.query);
                    }
                }
            }
            productsWithRegexes.push(
                new ProductWithRegex(
                    product,
                    this.createRegexPattern(productSearchTerms),
                    this._targetCurrencyRate));
        }

        return productsWithRegexes;
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


    // Создание и показ всплывающей подсказки
    createTooltip(): HTMLDivElement {
        // Удаляем существующий tooltip, если он есть
        let existingTooltip = document.getElementById('product-price-tooltip');
        if (existingTooltip) {
            document.body.removeChild(existingTooltip);
        }

        let tooltip = document.createElement('div');
        tooltip.id = 'product-price-tooltip';
        tooltip.style.cssText = `
        position: absolute;
        background-color: white;
        border: 2px solid #0000cc;
        border-radius: 5px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        display: none;
        font-size: 14px;
        color: #000;
        max-width: 300px;
        max-height: 30vh;
        overflow-y: auto;
        overflow-x: hidden;
        line-height: 1.5;
    `;

        // Добавляем крестик для закрытия
        const closeButton = document.createElement('div');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
        position: sticky;
        top: 0;
        right: 5px;
        float: right;
        cursor: pointer;
        font-weight: bold;
        padding: 3px;
        margin-left: 5px;
        z-index: 10000;
    `;
        closeButton.addEventListener('click', () => {
            tooltip.style.display = 'none';
        });

        tooltip.appendChild(closeButton);
        document.body.appendChild(tooltip);

        // Добавляем возможность закрытия по щелчку на подсказку
        tooltip.addEventListener('click', () => {
            tooltip.style.display = 'none';
        });

        return tooltip;
    }

    // Генерация HTML для отдельного продукта
    generateProductHtml(product: ProductWithRegex): string {
        if (!product) return '';

        // Формируем заголовок с именем продукта
        const productHeader = `
        <strong style="font-size: 16px; color: #0000aa;">
            <a href="${constants.Urls.backendUrl}LotSales/${product.product.id}" target="_blank" style="color: #0000aa; text-decoration: none; border-bottom: 1px dotted #0000aa;">
                ${product.product.name}
            </a>
        </strong>
    `;

        // Определяем содержимое в зависимости от наличия данных
        let productContent: string;

        if (product.product.productCalculationResult) {
            if (product.product.productCalculationResult.quantityTotal > 0) {
                
                const avgPrice = product.product.productCalculationResult.revenueAvg;
                productContent = `
                <div><strong>Средняя цена:</strong> ${(avgPrice * this._targetCurrencyRate).toFixed(0)} RUB</div>
                <div><strong>Всего продано:</strong> ${product.product.productCalculationResult.quantityTotal} шт.</div>
            `;
            } else {
                productContent = `Нет данных о продажах`;
            }
        } else {
            productContent = `Нет данных о средней цене`;
        }

        if (product.product.isCheckRequired) {
            productContent += '<div style="color: red;">Требуется проверка</div>';
        }

        if (product.product.weight === 0) {
            productContent += '<div style="color: red;">Вес не указан</div>';
        }
        let elementClass = this.getProductElementClass(product);

        // Собираем всё в единую структуру
        return `
        <div class="${elementClass}" style="position: relative; padding: 10px;">
            ${productHeader}<br>
            <div style="margin-top: 8px;">
                ${productContent}
            </div>
        </div>
    `;
    }

    private getProductElementClass(product: ProductWithRegex) {
        if (product.isInteresting) {
            return this._highlightInterestingClass
        } else if (!product.product.isCheckRequired) {
            return this._highlightCheckedClass
        } else {
            return this._highlightKnownClass
        }
    }

    // Позиционирование tooltip с учетом границ экрана и положения курсора
    positionTooltip(tooltip: HTMLElement, targetRect: DOMRect, event: MouseEvent): void {
        const tooltipWidth = 300; // максимальная ширина tooltip
        const padding = 10; // отступ от курсора

        // Получаем координаты курсора
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Проверяем, поместится ли tooltip справа от курсора
        if (mouseX + tooltipWidth + padding <= window.innerWidth) {
            tooltip.style.left = `${mouseX + padding}px`;
        } else {
            // Если не помещается справа, размещаем слева от курсора
            tooltip.style.left = `${Math.max(0, mouseX - tooltipWidth - padding)}px`;
        }

        // Проверяем, поместится ли tooltip снизу от курсора
        const tooltipHeight = tooltip.offsetHeight || 200; // Используем примерную высоту, если элемент еще не отрендерен
        if (mouseY + tooltipHeight + padding <= window.innerHeight) {
            tooltip.style.top = `${mouseY + window.scrollY + padding}px`;
        } else {
            // Если не помещается снизу, размещаем сверху от курсора
            tooltip.style.top = `${Math.max(0, mouseY + window.scrollY - tooltipHeight - padding)}px`;
        }
    }

    // Добавляет обработчики к tooltip
    setupTooltipHandlers(tooltip: HTMLElement): void {
        // Добавляем обработчик закрытия на крестик
        const closeButton = tooltip.querySelector('div[style*="cursor: pointer"]');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                tooltip.style.display = 'none';
            });
        }

        // Предотвращаем закрытие при клике на ссылки
        const statsLinks = tooltip.querySelectorAll('a');
        statsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    // Преобразует слово в регулярное выражение с учетом возможных вариаций написания
    createRegexPattern(word: string[]): RegExp {
        const processed = word.map(x => x.toLowerCase().trim()
            .replace('(', '\\(')
            .replace(')', '\\)')
            .replace('/', '\\/')
            .replace('.', ',')
            .replace(',', '[,.]')
            .replace(/[- ]/g, '[- ]?')
            .replace(/[aа]/g, '[aа]')
            .replace(/[cс]/g, '[cс]')
            .replace(/[pр]/g, '[pр]')
            .replace(/[eе]/g, '[eе]')
            .replace(/[oо]/g, '[oо]')
            .replace(/[xх]/g, '[xх]')
            .replace(/[yу]/g, '[yу]')
            .replace(/[bв]/g, '[bв]')
            .replace(/[hн]/g, '[hн]')
            .replace(/[kк]/g, '[kк]')
            .replace(/[mм]/g, '[mм]')
            .replace(/[tт]/g, '[tт]')
            .replace('0', '[- ]?[0оo][- ]?')
            .replace('1', '[- ]?1[- ]?')
            .replace('2', '[- ]?2[- ]?')
            .replace('3', '[- ]?[3з][- ]?')
            .replace('4', '[- ]?4[- ]?')
            .replace('5', '[- ]?5[- ]?')
            .replace('6', '[- ]?6[- ]?')
            .replace('7', '[- ]?7[- ]?')
            .replace('8', '[- ]?8[- ]?')
            .replace('9', '[- ]?9[- ]?')
        );
        
        return new RegExp(`(?:^|\\b|[\\s\\.,\\(\\)"\-_])(${processed.join('|')})(?:$|\\b|[\\s\\-,:;=\\(\\)\\."_])`, "ig");
    }

    // Выделяет текстовый узел и добавляет обработчики событий для tooltip
    highlightWord(
        node: Text
    ): void {
        let parent = node.parentElement;
        if (!parent) return;

        let originalText = node.textContent;
        if (!originalText) return;
        
        let matchedIdsString: string | null = null;
        let hasInteresting = false;
        let hasChecked = false;
        for (const product of this._products.values()) {
            product.regex.lastIndex = 0;
            if (product.regex.test(originalText)) {
                if (matchedIdsString === null) {
                    matchedIdsString = String(product.product.id);
                } else {
                    matchedIdsString += ',' + product.product.id;
                }
                
                if (product.isInteresting) {
                    hasInteresting = true;
                }
                if (product.product.isCheckRequired == false) {
                    hasChecked = true;
                }
            }
        }

        if (matchedIdsString !== null) {
            if (hasInteresting) {
                parent.classList.add(this._highlightInterestingClass);
            } else if (hasChecked) {
                parent.classList.add(this._highlightCheckedClass);
            }
            else {
                parent.classList.add(this._highlightKnownClass);
            }
            parent.setAttribute(this._foundProductIdsAttribute, matchedIdsString);
            parent.addEventListener('mouseenter', this.onMouseEnterHighlight.bind(this));
        }
    }
    
    async highlightWords() {
        console.log("highlightWords");
        
        const body = document.body;
        if (!body) {
            console.error("Document body is null. Unable to traverse DOM.");
            return;
        }

        let processedNodes = 0;
        const traverseNodes = async (element: HTMLElement | null): Promise<void> => {
            if (!element) return;
            
            // Пропускаем элемент, если он уже был обработан
            if (element.hasAttribute(this._foundProductIdsAttribute)) {
                return;
            }
            
            let children = Array.from(element.childNodes);
            for (let i = 0; i < children.length; i++) {
                const node = children[i];
                
                processedNodes++;
                // Каждые 50 узлов отдаем управление основному потоку
                if (processedNodes % 50 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
                
                if (node.nodeType === Node.TEXT_NODE) {
                    this.highlightWord(node as Text);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    await traverseNodes(node as HTMLElement);
                }
            }
        };

        await traverseNodes(body);
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

            let posts = document.querySelectorAll<HTMLTableCellElement>('table.post td.rr div');

            posts.forEach(function (post) {
                let plus = post.querySelector<HTMLDivElement>('div.plus');
                let contact = post.querySelector<HTMLDivElement>('div.contact');

                let contactHtml = contact?.innerHTML ?? "";
                plus?.remove();
                contact?.remove();
                post.innerHTML = '<pre>' + post.innerHTML.replace(/<br\s*\/?>/g, '</pre><pre>') + '</pre><br>' + contactHtml;
            });
        }
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
        await this.highlightWords();
    }
    
    onMouseEnterHighlight(event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;
        const productIds = target.getAttribute(this._foundProductIdsAttribute);
        
        if (productIds) {
            const ids = productIds.split(',');
            this.showTooltip(ids, event);
        }
    }

    private showTooltip(ids: string[], event: MouseEvent): void {
        // Создаем новое всплывающее окно
        const tooltip = this.createTooltip();
        
        // Получаем все найденные товары и сортируем их по цене (от большей к меньшей)
        const sortedProducts = ids
            .map(id => this._products.get(id))
            .filter(product => product !== undefined)
            .sort((a, b) => {
                const priceA = a.revenueRub || 0;
                const priceB = b.revenueRub || 0;
                return priceB - priceA;
            });
        
        // Генерируем содержимое для каждого найденного товара
        let tooltipContent = '';
        for (const product of sortedProducts) {
            tooltipContent += this.generateProductHtml(product);
            
            // Добавляем разделитель между товарами, кроме последнего
            if (product !== sortedProducts[sortedProducts.length - 1]) {
                tooltipContent += '<hr style="margin: 0; border: 0; border-top: 1px solid #ddd;">';
            }
        }
        
        // Вставляем контент после кнопки закрытия
        const closeButton = tooltip.firstChild;
        const contentContainer = document.createElement('div');
        contentContainer.innerHTML = tooltipContent;
        tooltip.insertBefore(contentContainer, closeButton.nextSibling);
        
        // Позиционируем всплывающее окно относительно курсора
        const targetElement = event.currentTarget as HTMLElement;
        this.positionTooltip(tooltip, targetElement.getBoundingClientRect(), event);
        
        // Показываем всплывающее окно
        tooltip.style.display = 'block';
        
        // Настраиваем обработчики событий для всплывающего окна
        this.setupTooltipHandlers(tooltip);
    }

    public async run(): Promise<void> {
        console.log("searchSitePages");
        
        const clientsFactory = new ClientsFactory();
        this._ebayToolBackendClient = await clientsFactory.getEbayToolBackendClient()

        this._targetCurrencyRate = await this.getTargetCurrencyCached();
        
        // Запускаем периодический анализ страницы
        const startBackgroundProcessing = async () => {
            while (true) {
                await this.processSitePage();
                // Ждем 2 секунды перед следующей итерацией
                await utils.sleep(2000);
            }
        };

        // Запускаем обработку независимо от состояния загрузки документа
        startBackgroundProcessing();

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
        style.textContent = `
.${this._highlightKnownClass} {
    background-color: ${constants.Colors.lightGray};
    font-weight: bold;
}

.${this._highlightCheckedClass} {
    background-color: ${constants.Colors.lightYellow};
    font-weight: bold;
}

.${this._highlightInterestingClass} {
    background-color: ${constants.Colors.lightGreen};
    font-weight: bold;
}
`;
        document.head.appendChild(style);
    }
}