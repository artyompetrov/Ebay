import {EbayToolBackendClient, ProductWithoutId, RuSearchQuery, SearchQuery} from "./clients/EbayToolBackendClient";
import {OAuth2Client} from "@badgateway/oauth2-client";
import {v4 as uuidv4} from "uuid";

const lightGreenColor = "#ecffec";
const backendUrl = `https://tubessale.ddns.net/`;
const extensionAuthRedirectUrl = `${backendUrl}chrome_extensions/auth`;
const backendApiScope = 'ServerAPI';

const chipFindRegex: RegExp = /(?:^|\.)chipfind\.ru$/i;
const avitoRegex: RegExp = /(?:^|\.)avito\.ru$/i;

interface CachedData<T> {
    value: T;
    expirationTime: number;
}

// Функция для получения данных из кэша или через fallback логику
export async function getCachedDataOrFallback<T>(
    key: string,
    fallbackLogic: () => Promise<T>,
    ttlInSeconds: number
): Promise<T | null> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, async (result) => {
            const data: CachedData<T> | undefined = result[key];

            if (data && Date.now() <= data.expirationTime) {
                // Если данные валидны
                console.log(`${key} loaded from cache.`);
                resolve(data.value);
            } else {
                // Данные отсутствуют или устарели
                console.log(`${key} not in cache or expired. Fetching new data...`);
                try {
                    const newData = await fallbackLogic(); // Выполняем fallback логику
                    const expirationTime = Date.now() + ttlInSeconds * 1000;

                    // Сохраняем новые данные в кэш
                    const cachedData: CachedData<T> = { value: newData, expirationTime };
                    chrome.storage.local.set({ [key]: cachedData }, () => {
                        console.log(`${key} cached for ${ttlInSeconds} seconds.`);
                    });

                    resolve(newData); // Возвращаем данные из fallback логики
                } catch (error) {
                    console.error(`Failed to fetch data for ${key}:`, error);
                    reject(error);
                }
            }
        });
    });
}

// Удаление данных из кэша
export function removeFromCache(key: string){
    chrome.storage.local.remove(key, () => {} );
}

// Получение всех продуктов из кэша или с сервера
export async function getAllProductsCached(backendClient: EbayToolBackendClient, productId: string | null, allItemsCacheIdentifier: string) {
    let cached = await getCachedDataOrFallback(allItemsCacheIdentifier, async () => {
            return await backendClient.getAllProducts();
        },
        60 * 60);
    
    if (!cached) {
        return [];
    }
    
    if (productId) {
        const trimmedProductId = productId.trim().toLowerCase();
        if (!cached.some(p => p.id.trim().toLowerCase() === trimmedProductId)) {
            console.log(`Product ID ${trimmedProductId} not found in cache, refreshing cache, clearing cache...`);
            removeFromCache(allItemsCacheIdentifier);
            
            const refreshedCache = await getCachedDataOrFallback(allItemsCacheIdentifier, async () => {
                    return await backendClient.getAllProducts();
                },
                60 * 60);
                
            return refreshedCache || [];
        }
    }
    
    return cached;
}

// Функция для транслитерации текста с русского на английский
export function transliterate(text: string): string {
    const map: { [key: string]: string } = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
        "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
        "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
        "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "shch",
        "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
        "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "Yo",
        "Ж": "Zh", "З": "Z", "И": "I", "Й": "Y", "К": "K", "Л": "L", "М": "M",
        "Н": "N", "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U",
        "Ф": "F", "Х": "H", "Ц": "C", "Ч": "Ch", "Ш": "Sh", "Щ": "Shch",
        "Ъ": "", "Ы": "Y", "Ь": "", "Э": "E", "Ю": "Yu", "Я": "Ya",
    };
    return text
        .split("")
        .map((char) => map[char] || char) // Заменяем символы на основе таблицы
        .join("");
}


// Создание и показ всплывающей подсказки
export function createTooltip(): HTMLDivElement {
    // Проверяем, существует ли уже tooltip
    let existingTooltip = document.getElementById('product-price-tooltip');
    if (existingTooltip) return existingTooltip as HTMLDivElement;
    
    let tooltip = document.createElement('div');
    tooltip.id = 'product-price-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background-color: white;
        border: 2px solid #0000cc;
        border-radius: 5px;
        padding: 12px;
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
        color: #0000cc;
        background-color: white;
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
export function generateProductHtml(product: any, backendUrl: string): string {
    if (!product) return '';
    
    // Формируем заголовок с именем продукта
    const productHeader = `
        <strong style="font-size: 16px; color: #0000aa;">
            <a href="${backendUrl}LotSales/${product.id}" target="_blank" style="color: #0000aa; text-decoration: none; border-bottom: 1px dotted #0000aa;">
                ${product.name}
            </a>
        </strong>
    `;
    
    // Определяем содержимое в зависимости от наличия данных
    let productContent = '';
    
    if (product.productCalculationResult) {
        if (product.productCalculationResult.quantityTotal > 0) {
            const avgPrice = product.productCalculationResult.revenueAvg;
            productContent = `
                <div><strong>Средняя цена:</strong> ${avgPrice.toFixed(2)} USD</div>
                <div><strong>Всего продано:</strong> ${product.productCalculationResult.quantityTotal} шт.</div>
            `;
        } else {
            productContent = `Нет данных о продажах для этого товара`;
        }
    } else {
        productContent = `Нет данных о средней цене`;
    }
    
    // Собираем всё в единую структуру
    return `
        <div style="position: relative;">
            ${productHeader}<br>
            <div style="margin-top: 8px;">
                ${productContent}
            </div>
        </div>
    `;
}

// Позиционирование tooltip с учетом границ экрана
export function positionTooltip(tooltip: HTMLElement, targetRect: DOMRect): void {
    const tooltipWidth = 300; // максимальная ширина tooltip
    
    // Проверяем, поместится ли tooltip справа от элемента
    if (targetRect.right + tooltipWidth + 10 <= window.innerWidth) {
        tooltip.style.left = `${targetRect.right + 10}px`;
    } else {
        // Если не помещается справа, размещаем слева
        tooltip.style.left = `${Math.max(0, targetRect.left - tooltipWidth - 10)}px`;
    }
    
    tooltip.style.top = `${targetRect.top + window.scrollY}px`;
}

// Находит все подходящие продукты в тексте
export function findMatchingProducts(text: string, products: any[]): any[] {
    const trimmedText = text.trim().toLowerCase();
    const matches: any[] = [];
    
    // Ищем все продукты, которые могут соответствовать тексту
    for (const product of products) {
        // Прямое совпадение с именем
        if (trimmedText.includes(product.name.toLowerCase())) {
            matches.push(product);
            continue; // Продолжаем поиск других продуктов
        }
        
        // Поиск в ruSearchQueries
        const hasMatchingQuery = product.ruSearchQueries.some(sq => 
            trimmedText.includes(sq.query.toLowerCase()) || 
            sq.query.toLowerCase().includes(trimmedText)
        );
        
        if (hasMatchingQuery && !matches.some(p => p.id === product.id)) {
            matches.push(product);
        }
    }
    
    return matches;
}

// Добавляет обработчики к tooltip
export function setupTooltipHandlers(tooltip: HTMLElement): void {
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

// Выделяет текстовый узел и добавляет обработчики событий для tooltip
export function highlightWord(
    node: Text, 
    regex: RegExp, 
    highlightClass: string, 
    tooltip: HTMLDivElement, 
    products: any[],
    lastHighlightedElementRef: { current: HTMLElement | null },
    tooltipTimeoutRef: { current: number | null }
): void {
    let parent = node.parentElement;
    if (!parent) return;
    
    let originalText = node.textContent;
    if (!originalText) return;
    
    regex.lastIndex = 0;
    if (regex.test(originalText)) {
        parent.classList.add(highlightClass);
        
        // Проверяем, не добавлены ли уже обработчики
        if (parent.dataset.tooltipHandlersAdded === 'true') return;
        parent.dataset.tooltipHandlersAdded = 'true';
        
        // Добавляем обработчики событий на элемент
        parent.addEventListener('mouseenter', async (e) => {
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            
            lastHighlightedElementRef.current = parent;
            const text = parent.textContent || '';
            
            // Находим все соответствующие продукты
            const matchedProducts = findMatchingProducts(text, products);
            
            if (matchedProducts.length === 0) return;
            
            // Показываем tooltip с информацией о продуктах
            tooltip.innerHTML = 'Загрузка данных о ценах...';
            tooltip.style.display = 'block';
            
            // Позиционируем подсказку рядом с элементом
            const rect = parent.getBoundingClientRect();
            positionTooltip(tooltip, rect);
            
            if (lastHighlightedElementRef.current === parent) {
                // Формируем HTML для всех найденных продуктов
                let productsHtml = '';
                
                for (let i = 0; i < matchedProducts.length; i++) {
                    const product = matchedProducts[i];
                    
                    // Добавляем разделитель между продуктами
                    if (i > 0) {
                        productsHtml += '<hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">';
                    }
                    
                    // Используем функцию generateProductHtml вместо дублирования HTML кода
                    productsHtml += generateProductHtml(product, backendUrl);
                }
                
                // Добавляем крестик закрытия сверху
                tooltip.innerHTML = `
                    <div style="position: relative;">
                        <div style="position: sticky; top: 0; right: 0; float: right; cursor: pointer; font-weight: bold; color: #0000cc; background-color: white; padding: 3px; z-index: 10000;">✕</div>
                        ${productsHtml}
                    </div>
                `;
                
                // Настраиваем обработчики событий для tooltip
                setupTooltipHandlers(tooltip);
            }
        });
        
        parent.addEventListener('mouseleave', () => {
            lastHighlightedElementRef.current = null;
            tooltipTimeoutRef.current = window.setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300) as unknown as number;
        });
    }
}

// Подсвечивает слова на странице
export function highlightWords(words: string[], products: any[], highlightClass: string = "highlight"): void {
    console.log("highlightWords");
    //todo regex надо кешировать
    let wordsReplaced = words.map(x => x.toLowerCase()
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
    );
    const regex = new RegExp(`(?:^|\\s|\\.)(${wordsReplaced.join("|")})(?:$|\\s|-|,|\\.)`, "ig");
    console.log(regex);
    
    // Создаем tooltip один раз для всех подсвеченных элементов
    const tooltip = createTooltip();
    
    // Используем объекты для передачи ссылок на lastHighlightedElement и tooltipTimeout
    const lastHighlightedElementRef = { current: null as HTMLElement | null };
    const tooltipTimeoutRef = { current: null as number | null };
    
    const traverseNodes = (element: HTMLElement | null): void => {
        if (!element) return;
        let children = Array.from(element.childNodes);
        
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (node.nodeType === Node.TEXT_NODE) {
                highlightWord(node as Text, regex, highlightClass, tooltip, products, lastHighlightedElementRef, tooltipTimeoutRef);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                traverseNodes(node as HTMLElement);
            }
        }
    };
    
    // Обработчики для самого tooltip
    tooltip.addEventListener('mouseenter', () => {
        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    });
    
    tooltip.addEventListener('mouseleave', () => {
        lastHighlightedElementRef.current = null;
        tooltip.style.display = 'none';
    });
    
    const body = document.body;
    if (!body) {
        console.error("Document body is null. Unable to traverse DOM.");
        return;
    }
    
    traverseNodes(body);
}

// Обработка страницы chipfind.ru
export async function processChipFind() {
    console.log("processChipFind");
    if (location.pathname === "/market/search.htm" || location.pathname === "/market/") {
        await sleepElementLoaded('div.pages', document);
        await sleepElementLoaded('.plus a', document);

        let elements = document.querySelectorAll<HTMLAnchorElement>('.plus a');
        // Кликаем по каждому элементу
        for (const element of elements) {
            element.click();
            await sleep(300);
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
export async function processAvitoBackground() {
    console.log("processAvitoBackground");
    let found = false;
    do {
        await sleep(300);

        let moreButton = [...document.querySelectorAll('a')].filter(a => a.innerText.includes("Читать полностью"));

        if (moreButton.length > 0) {
            moreButton[0].click();
            found = true;
        }
    } while (!found);
}

// Обработка страницы avito.ru
export async function processAvito() {
    console.log("processAvito");
    let description = document.querySelectorAll<HTMLDivElement>('div[itemprop="description"]');

    description.forEach(function (post) {
        post.innerHTML = '<div>' + post.innerHTML.replace(/<br\s*\/?>/g, '</div><div>') + '</div><br>';
    });
}

// Показывает уведомление
export function showToast(message: string, duration = 3000) {
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
export async function processSitePage(backendClient: EbayToolBackendClient, allItemsCacheIdentifier: string) {
    let allProducts = await getAllProductsCached(backendClient, null, allItemsCacheIdentifier);
    let names = allProducts.map(x => x.name);
    let ruNames = allProducts.map(x => x.ruSearchQueries.map(x=>x.query)).reduce((acc, val) => acc.concat(val), []);
    console.log("names " + names.join(","));
    console.log("ruNames " + ruNames.join(","));
    
    let wordsToHighlight = Array.from(names.concat(ruNames));

    if (chipFindRegex.test(location.host)) {
        await processChipFind();
    } else if (avitoRegex.test(location.host)) {
       await processAvito();
       let _ = processAvitoBackground();
    }
    highlightWords(wordsToHighlight, allProducts);
}

// Получение авторизационного объекта для бэкенда
export function getBackendOAuth2Client(backendUrl: string, fetchResource: any): OAuth2Client {
    return new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });
}

// Получение fetch с авторизацией
export function getAuthorizeFetch(oAuth2Client: OAuth2Client, scope: string, tokenStore: string, redirectUri: string, fetchResource: any, backendUrl: string): any {
    return {
        client: oAuth2Client,
        getNewToken: async () => {
            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
            document.location.href = await oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: redirectUri,
                codeVerifier,
                scope: [scope]
            });
            return null;
        },
        getStoredToken: async () => {
            if (backendUrl !== (await chrome.storage.local.get(["backend_url"])).backend_url) return null;
            let token = (await chrome.storage.local.get(tokenStore))[tokenStore];
            if (token) return JSON.parse(token);
            return null;
        },
        fetch: fetchResource
    };
}

// Главная функция для поисковых страниц
export async function searchSitePages(fetchResource: any, allItemsCacheIdentifier: string) {
    console.log("searchSitePages");

    // Создаем OAuth2 клиент
    let backendOAuth2Client: OAuth2Client = getBackendOAuth2Client(backendUrl, fetchResource);
    await chrome.storage.local.set({return_page: document.location.href});
    
    // Создаем клиент для работы с бэкендом
    let backendClient = new EbayToolBackendClient(
        `${backendUrl}api/ebay/v1`, 
        getAuthorizeFetch(backendOAuth2Client, backendApiScope, "ebayToolTokenStore", extensionAuthRedirectUrl, fetchResource, backendUrl)
    );

    // Обрабатываем страницу
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => processSitePage(backendClient, allItemsCacheIdentifier));
    } else {
        await processSitePage(backendClient, allItemsCacheIdentifier);
    }

    // Слушаем сообщения от background скрипта
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action === "processText") {
            console.log("Received message", message.text);
            let productName = message.text.trim();
            await backendClient.createProduct(new ProductWithoutId({
                name: productName,
                searchQueries: Array.of(new SearchQuery({id: uuidv4(), query: transliterate(productName)})),
                ruSearchQueries: new Array<RuSearchQuery>(),
                weight: 0
            }));
            removeFromCache(allItemsCacheIdentifier);
            showToast("Product created \"" + productName + "\"");
        }
    });
    
    // Добавляем стили для подсветки
    const style = document.createElement("style");
    style.textContent = `
.highlight {
    background-color: ${lightGreenColor};
    font-weight: bold;
}
`;
    document.head.appendChild(style);
} 