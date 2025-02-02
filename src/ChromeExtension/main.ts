import {
    CategoryValue,
    EbayToolBackendClient,
    ClientErrorInfo,
    LotDataExtractedItem,
    LotDataToExtract,
    LotInfo,
    LotInfoWithProductId,
    NotFoundProblemDetailedInfo,
    PurchaseInfo,
    ValidationProblemDetailedInfo, ProductWithoutId, SearchQuery, RuSearchQuery
} from "./EbayClient/EbayToolBackendClient"
import {EbayClient, Item} from "./EbayClient/EbayClient"
import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";
import {EbayShoppingApiClient} from "./EbayShoppingApiClient";
import { v4 as uuidv4 } from 'uuid';

const productFieldName = "productId";
const ignoreThatLotFormId = "ignoreThatLot"
const pcsFieldName = "pcs";
const autoPcsFieldName = "autoPcs";
const categoryPrefix = 'category_'
const panelClass = "panel-div";
const panelInputClass = "panel-input-div";
const formId = "product-form-id"
const errorElementId = "errorElement"
const submitId = "submitButton"
const backendUrl = `https://tubessale.ddns.net/`;
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const extensionAuthRedirectUrl = `${backendUrl}chrome_extensions/auth`;
const ebayAuthRedirectUrl = `https://www.ebay.com/`;
//todo нужно как-то защитить данные авторизации на ebay
const ebayRedirectUriCode = "Artem_Petrov-ArtemPet-tubesS-dsrgu"
const ebayApiScope = "https://api.ebay.com/oauth/api_scope"
const backendApiScope = 'ServerAPI'
const lightGrayColor = "lightgray"
const lightGreenColor = "#ecffec"
const lightPinkColor = "lightpink"
const lightYellowColor = "#e0e07f"
const marketplaceId = "EBAY_US"
const batchOpen = 5
const categoriesDiv = "categoriesDiv"
const ignoredLotDiv = "ignoredLotDiv"
const currentProductIdParamName = "tool_productId"
let lotNotSupported = false;
let _lotInfo = new LotInfo()

let _serverLotInfo: LotInfoWithProductId | undefined;
let _needActualizationLotsIds: number[] = null
let _serverAndEbayAreEqual = false;
let _panel: HTMLDivElement;
let _currentProductId: string
let interestedInTopNItems = 10;
let extendedLogging = true;

function transliterate(text: string): string {
    const map: { [key: string]: string } = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
        "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
        "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
        "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
        "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
        "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "Yo",
        "Ж": "Zh", "З": "Z", "И": "I", "Й": "Y", "К": "K", "Л": "L", "М": "M",
        "Н": "N", "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U",
        "Ф": "F", "Х": "H", "Ц": "Ts", "Ч": "Ch", "Ш": "Sh", "Щ": "Shch",
        "Ъ": "", "Ы": "Y", "Ь": "", "Э": "E", "Ю": "Yu", "Я": "Ya",
    };
    return text
        .split("")
        .map((char) => map[char] || char) // Заменяем символы на основе таблицы
        .join("");
}

const ebaySiteRegex: RegExp =  /(?:^|\.)ebay\.com$/i;
const chipFindRegex: RegExp = /(?:^|\.)chipfind\.ru/i
const avitoRegex: RegExp = /(?:^|\.)avito\.ru/i

const searchOnSites: RegExp[] = [
    avitoRegex,
    chipFindRegex
]

const workOnSites: RegExp[] = [
    ...searchOnSites,
    ebaySiteRegex,
    /tubessale\.ddns\.net/i
];

class ShippingParameters {
constructor(regions: string[], zip: string | null) {
    this.regions = regions
    this.zip = zip
}

regions: string[];
zip: string | null
}

const supportedShippingCountries = new Map<string, ShippingParameters>();
supportedShippingCountries.set('DE', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('IT', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('FR', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('GB', new ShippingParameters(['EUROPE'], "SW1W 0NY"))
supportedShippingCountries.set('BG', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('LT', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('SK', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('LV', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('RO', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('EE', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('PL', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('US', new ShippingParameters([], "40202"))
supportedShippingCountries.set('AU', new ShippingParameters([], "3000–3999"))

const currencyMap = new Map<string, string>()
currencyMap.set("USD", "US $")
currencyMap.set("AUD", "AU $")
currencyMap.set("CAD", "C $")

interface CachedData<T> {
    value: T;
    expirationTime: number;
}

function removeFromCache(key: string){
    chrome.storage.local.remove(key, () => {} );
}

function getCachedDataOrFallback<T>(
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

// fetch через background script, по другому не работает
async function fetchResource(input: RequestInfo, init: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ input, init }, async messageResponse => {
            try {
                const [response, error] = messageResponse;
                let logEntry = "Request: " + JSON.stringify(input);
                if (extendedLogging) {
                    logEntry += "\n\nRequest body: \n" + JSON.stringify(init);
                }
                if (response === null) {
                    logEntry += "\n\nNo response"
                    console.log(logEntry);
                    reject(error);
                } else {
                    logEntry += "\n\nResponse " + response.status + " " + response.statusText;

                    if (extendedLogging) {
                        logEntry += "\n\nResponse headers:\n" + JSON.stringify(response.headers);
                    }

                    let body = new Blob([response.body]);
                    
                    if (extendedLogging) {
                        logEntry += "\n\nResponse body:\n";
                        try {
                            const loggedBody = await new Response(body).text();
                            logEntry += loggedBody;
                        } catch (logError) {
                            logEntry += "Failed to log response body: " + logError;
                        }
                    }
                    
                    console.log(logEntry);
                    resolve(new Response(body, {
                        headers: new Headers(response.headers),
                        status: response.status,
                        statusText: response.statusText
                    }));
                }
            } catch (error) {
                console.log("An error occurred while processing the response:", error);
                reject(error);
            }
        });
    });
}


function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractPrice(price: string): Price {
    let priceTrimmed = price.trim()
    let matches = priceTrimmed.match(/^(\D+)(\d+(?:,\d+)?(?:[.]\d+)?\s*)([(\/].+|$)/)
    if (matches) {
        return new Price(parseFloat(matches[2].replace(',', '')), matches[1].trim())
    } else {
        let matches = priceTrimmed.match(/^(\d+(?:,\d+)?(?:[.]\d+)?)(\D+)([(\/].+|$)/)
        if (matches) {
            return new Price(parseFloat(matches[1].replace(',', '')), matches[2].trim())
        }
        throw new Error("unexpected price: '" + price + "'")
    }
}

class Price {
    constructor(price: number, currency: string) {

        this.currency = currency
        this.price = price
    }

    currency: string;
    price: number;
}

async function sleepElementLoaded(selector: string, elementToSearchIn: Document | Element): Promise<Element> {
    let retry = 0
    while (true) {
        retry++;
        if (retry > 200) throw new Error("unable to find element by selector " + selector)

        let element = elementToSearchIn.querySelector(selector)
        if (element !== null) return element
        await sleep(100);
    }
}


async function createPanel(backendClient: EbayToolBackendClient, ebayClient: EbayClient, ebayShoppingApiClient: EbayShoppingApiClient): Promise<HTMLDivElement> {
    let bodyElement = await sleepElementLoaded('body', document);

    let panel = <HTMLDivElement>bodyElement.querySelector('div.' + panelClass)

    if (panel !== null && panel !== undefined) {
        panel.style.cssText = `background-color: white;`
        return panel;
    }

    let styles = `
    .${panelClass} {
      text-align: left;
      padding: 15px;
      border: 3px solid #0000cc;
      border-radius: 10px;
      color: #0000cc;
      position:fixed;
      z-index:100;
      left:1%;
      bottom:5%;
      background-color: white;
    }
    
    .${panelInputClass} label {
      font-weight: bold;
      display: block;
      width: 140px;
      float: left;
    }
    
    .${panelInputClass} input {
      width: 200px;
    }
    
    #${pcsFieldName} {
      width: 100px;
    }
    
    #${autoPcsFieldName} {
      width: 100px;
    }
    
    .${panelInputClass} select {
      width: 200px;
    }
    
    .${panelInputClass} label:after { content: ": " }
    
    #${categoriesDiv} label {
        padding-right: 10px;
    }
    
    #${submitId} {
        width: 350px;
        height: 30px;
    }
`

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    bodyElement.appendChild(styleSheet)

    let div = document.createElement('div');
    div.title = "Белый цвет - на сервере нет информации о лоте, желтый цвет - на сервере есть информация о лоте, но после последней актуализации были новые продажи, красный цвет - информация на сервере и в лоте не совпадает, требуется актуализация, зеленый цвет - информация на сервере актуальна."
    div.classList.add(panelClass);
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;
    let historyButtonHref = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    let revisionsButtonHref = `https://${domain}/rvh/${itemId}`;
    div.innerHTML = `
     <a href="${historyButtonHref}" target="_blank">История продаж лота</a>
        <br><a href="${revisionsButtonHref}" target="_blank">История изменений лота</a>
        <br>Бэкенд: <a href="${backendUrl}" target="_blank">${backendUrl}</a>
        <br><br>
        <div id="${ignoredLotDiv}" style="color: red;" hidden="hidden">Лот в игноре</div>
    `

    let formIgnoreThatLot = document.createElement('form')
    formIgnoreThatLot.id = ignoreThatLotFormId
    div.appendChild(formIgnoreThatLot)

    formIgnoreThatLot.addEventListener("submit", async function (event: SubmitEvent) {
        await handleIgnoreThatLotSubmit(event, backendClient)
    });

    let form = document.createElement('form')
    form.id = formId
    // language=HTML
    form.innerHTML = `
        <div class="${panelInputClass}">
            <label for="${productFieldName}">Товар</label>
            <select name="${productFieldName}" id="${productFieldName}">
                <option value="">Выберите товар</option>
            </select>
            <br>
            <label for="${pcsFieldName}">PCS</label>
            <input id="${pcsFieldName}" type="number" name="${pcsFieldName}" title="Вручную введенное количество"/>
            <input id="${autoPcsFieldName}" type="text" name="${autoPcsFieldName}" title="Автоматически определенное количество (желтый цвет - есть подозрение на неточность, зеленый все ОК)" readonly/>
        </div>
        <br>
        <div id="${categoriesDiv}">
        </div>
        <div style="color: red;" id="${errorElementId}"></div>
        <br>
        <input id="${submitId}" type="submit" value="Save" disabled/>
    `;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        await handleSubmit(event, backendClient, ebayClient, ebayShoppingApiClient)
    });

    div.appendChild(form)
    bodyElement.appendChild(div);
    div.hidden = true
    _panel = div;
}

async function handleIgnoreThatLotSubmit(event: SubmitEvent, backendClient: EbayToolBackendClient) {
    event.preventDefault();
    await ignoreThatLot(backendClient)
}

async function ignoreThatLot(backendClient: EbayToolBackendClient) {
    console.log("Ignoring lot " + _lotInfo.lotId + " for product " + _currentProductId)
    await backendClient.ignoreLots([_lotInfo.lotId], _currentProductId)
    showThatLotIsIgnored();
    window.close()
}

async function createOpenMultipleButton(): Promise<HTMLDivElement> {
    let bodyElement = await sleepElementLoaded('body', document);

    let panel = bodyElement.querySelector('div.' + panelClass)

    if (panel !== null && panel !== undefined) return <HTMLDivElement>panel;

    let styles = `
    .${panelClass} {
      text-align: left;
      padding: 15px;
      border: 3px solid #0000cc;
      border-radius: 10px;
      color: #0000cc;
      position:fixed;
      z-index:100;
      left:1%;
      bottom:5%;
      background-color: white;
    }
    
    #${submitId} {
        width: 120px;
        height: 30px;
    }
`

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    bodyElement.appendChild(styleSheet)

    let div = document.createElement('div');
    div.classList.add(panelClass);

    let form = document.createElement('form')
    form.id = formId

    // language=HTML
    form.innerHTML = `
        <input id="${submitId}" type="submit" value="Окрыть ${batchOpen} лотов"/>
    `;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        event.preventDefault()
        if (_needActualizationLotsIds === null) return;
        if (_needActualizationLotsIds.length === 0) {
            window.close()
        }

        let lastWindow: WindowProxy;

        for (let x of _needActualizationLotsIds.slice(0, batchOpen)) {
            let url = "https://www.ebay.com/itm/" + x + "?" + currentProductIdParamName + "=" + _currentProductId;
            lastWindow = window.open(url, '_blank');

            await sleep(50);
        }

        lastWindow?.focus()
    });

    div.appendChild(form)
    bodyElement.appendChild(div);

    return div
}

async function handleSubmit(event: SubmitEvent, backendClient: EbayToolBackendClient, ebayClient: EbayClient, ebayShoppingApiClient: EbayShoppingApiClient) {
    try {
        event.preventDefault();
        let data = new FormData(<HTMLFormElement>event.target);


        let categories = [];
        data.forEach(function (value, key) {

            if (key.startsWith(categoryPrefix)) {
                let category = key.replace(categoryPrefix, "")
                categories.push(new CategoryValue({type: category, value: value.toString()}))
            } else {
                _lotInfo[key] = value;
            }
        });

        _lotInfo.categories = categories;

        let productId = data.get('productId').toString();

        if (!productId) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("Product id not set");
        }

        console.log("Sending to backend: " + JSON.stringify(_lotInfo))
        await backendClient.upsertLotInfo(_lotInfo, productId)

        await productPage(backendClient, ebayClient, ebayShoppingApiClient)

        if (_serverAndEbayAreEqual) {
            window.close()
        }
    } catch (error) {
        await showAndSaveError(error, backendClient)
    }
}

function fillSoldItemsResult(fixedPriceRows: HTMLTableRowElement[], result: PurchaseInfoInner[]) {
    for (let fixedPriceRow of fixedPriceRows) {
        let columns = [...fixedPriceRow.querySelectorAll('td')]
            .map(function (item) {
                return item.innerText;
            })

        let price = columns[1]

        if (price === "Expired" || price === "Declined") {
            continue
        }

        if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {

            let priceExtracted = extractPrice(price)

            let lotInfoCurrency = currencyMap.has(_lotInfo.currency) ? currencyMap.get(_lotInfo.currency) : _lotInfo.currency

            if (priceExtracted.currency !== lotInfoCurrency) {
                throw new Error("currency doesn't match with lot currency lot currency " + lotInfoCurrency + " extracted currency " + priceExtracted.currency)
            }
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3]), priceExtracted))
        } else {
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3])))
        }
    }
}

class PurchaseInfoInner {
    constructor(quantity: number, date: Date, price?: Price | undefined) {
        this.quantity = quantity
        this.date = date
        this.price = price
    }

    quantity: number;
    price: Price | undefined;
    date: Date
}

function parseDate(dateString: string): Date {
    let matches = dateString.match(/(\d+\s[A-z]+\s\d+)\sat\s(\d+):(\d+):(\d+)(am|pm)\s([A-z]+)/)

    if (!matches) {
        matches = dateString.match(/([A-z]+\s\d+,\s\d+)\s(\d+):(\d+):(\d+)\s(PM|AM)\s([A-z]+)/)
    }

    if (!matches) throw new Error("Unable to parse time in " + dateString)

    let date = new Date(Date.parse(matches[1] + ' 00:00:00.000Z'))

    date.setUTCHours(parseInt(matches[2]));
    date.setUTCMinutes(parseInt(matches[3]));
    date.setUTCSeconds(parseInt(matches[4]));

    if (matches[5].toLowerCase() === "pm" && date.getUTCHours() !== 12) {
        date.setHours(date.getHours() + 12);
    }

    if (matches[5].toLowerCase() === "am" && date.getUTCHours() === 12) {
        date.setHours(date.getHours() - 12);
    }

    if (matches[6].toUpperCase() === "MSK") {
        date.setHours(date.getHours() - 3);
    } else {
        throw new Error("unknown timezone " + matches[6])
    }

    return date
}

function parseSoldItemsPage(text: string): PurchaseInfo[] {
    let doc = new DOMParser().parseFromString(text, "text/html")

    let result = new Array<PurchaseInfoInner>();
    let fixedPriceBlock = doc.querySelector('div.fixed-price tbody')
    if (fixedPriceBlock !== null) {
        let fixedPriceRows = [...fixedPriceBlock.querySelectorAll('tr')]
        fillSoldItemsResult(fixedPriceRows, result);
    }

    let offerBlock = doc.querySelector('div.offer tbody')
    if (offerBlock !== null) {
        let offerRows = [...offerBlock.querySelectorAll('tr')]
        fillSoldItemsResult(offerRows, result);
    }

    return result.sort(function (a, b) {
        return b.date.getTime() - a.date.getTime();
    }).map(function (x) {

        return new PurchaseInfo({
            date: x.date.toISOString(), quantity: x.quantity, price: x.price?.price
        })
    });
}


function hasShippingToCountry(country: string, shipsTo: Set<string>, excludes: Set<string>) {

    let countryParams = supportedShippingCountries.get(country);

    let shipsToRegionFound = false
    for (let region of countryParams.regions) {
        if (shipsTo.has(region)) {
            shipsToRegionFound = true
            break;
        }
    }

    let excludesRegionFound = false
    for (let region of countryParams.regions) {
        if (excludes.has(region)) {
            excludesRegionFound = true
            break;
        }
    }

    return (shipsTo.has('WORLDWIDE') || shipsToRegionFound || shipsTo.has(country)) && !excludesRegionFound && !excludes.has(country);
}

function showThatLotIsIgnored() {
    let ignoredLotDivElement = <HTMLDivElement>_panel.querySelector('div#' + ignoredLotDiv);
    let ignoreThatLotFormElement = <HTMLDivElement>_panel.querySelector('form#' + ignoreThatLotFormId);
    ignoredLotDivElement.hidden = false;
    ignoreThatLotFormElement.hidden = true;
}

async function fillIsIgnored(backendClient: EbayToolBackendClient) {
    let isIgnored = await backendClient.getIsLotIgnoredForProduct(_currentProductId, _lotInfo.lotId);
    if (!isIgnored) return
    showThatLotIsIgnored();
}

async function fillPurchaseHistory() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    let response = await fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
    let text = await response.text()
    _lotInfo.purchaseHistory = parseSoldItemsPage(text)
}

async function fillUpdateTitleDate() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let url = `https://${location.hostname}/rvh/${itemId}`;
    console.log(url);
    let response = await fetchResource(url, {method: 'GET', credentials: 'include'})
    let text = await response.text()
    _lotInfo.titleChangeDate = parseRevisionSummary(text).toISOString()
}

function parseRevisionSummary(text: string): Date {
    console.log("parseRevisionSummary")
    let doc = new DOMParser().parseFromString(text, "text/html")

    let table = doc.querySelector('div#vi-revision-history-layout-container table')
    if (table) {
        let rows = [...table.querySelectorAll('tr')]

        for (let row of rows.reverse()) {
            let columns = [...row.querySelectorAll('td')]
            if (columns.length === 0) continue;
            let changes = columns[2].innerText;
            if (changes.includes('Title')) {
                let date = columns[0].innerText
                let time = columns[1].innerText

                return parseDate(date + " " + time)
            }
        }
    }

    return new Date(0)
}

function getCurrentProductIdParam(): string | undefined {
    let currentProductId = new URL(document.location.href).searchParams?.get(currentProductIdParamName)?.trim()?.toLowerCase()
    if (currentProductId) return currentProductId

    if (document.referrer) {

        let productId = new URL(document.referrer).searchParams?.get(currentProductIdParamName)?.trim()?.toLowerCase()
        if (productId) {
            let currentUrl = new URL(document.location.href);
            currentUrl.searchParams.set(currentProductIdParamName, productId);
            window.history.pushState({}, null, currentUrl.toString());
        }

        return productId;
    }
}

async function fillProduct(client: EbayToolBackendClient) {
    let productField = _panel.querySelector('select#' + productFieldName);
    let ignoreThatLot = _panel.querySelector("form#" + ignoreThatLotFormId)
    let productIdServer = _serverLotInfo?.productId?.trim()?.toLowerCase()

    let products = await client.getAllProducts()
    for (let i = 0; i < products.length; i++) {
        let opt = document.createElement('option');
        opt.value = products[i].id;
        opt.innerHTML = products[i].name;

        if (productIdServer !== undefined) {
            if (productIdServer === products[i].id.trim().toLowerCase()) {
                opt.selected = true
            }
        } else if (_currentProductId === products[i].id.trim().toLowerCase()) {
            opt.selected = true
            ignoreThatLot.innerHTML = `<button>Игнорировать для ${products[i].name}</button><br><br>`
        }

        productField.appendChild(opt);
    }
}

async function fillManualCondition(client: EbayToolBackendClient, extractedDataByFieldName: {}) {
    let categoriesDivElement = _panel.querySelector('div#' + categoriesDiv);
    categoriesDivElement.innerHTML = ""

    let serverCategories = _serverLotInfo?.lotInfo?.categories?.reduce((dictionary, value) => {
        dictionary[value.type] = value.value;
        return dictionary;
    }, {});

    let categoryTypes = await client.getCategories()

    for (let categoryType of categoryTypes) {
        let categoryDiv = document.createElement("div")

        let extractedData: LotDataExtractedItem[] = extractedDataByFieldName[categoryType.type];

        let extractedDataCounts = extractedData?.reduce((dictionary, value) => {
            dictionary[value.value] = value.extractorInfo.length;
            return dictionary;
        }, {});

        let serverValue = serverCategories ? serverCategories[categoryType.type] : undefined

        let minMatchesCount = 0
        let inputToCheck: HTMLInputElement = undefined

        for (let categoryItem of categoryType.items) {
            let isInExtracted = extractedDataCounts && categoryItem.id in extractedDataCounts

            let input = <HTMLInputElement>document.createElement("input")
            let label = <HTMLLabelElement>document.createElement("label")
            let inputId = 'radio_' + categoryType.type + '_' + categoryItem.id
            input.type = 'radio'
            input.id = inputId
            input.name = categoryPrefix + categoryType.type
            input.value = categoryItem.id
            if (serverValue && serverValue === categoryItem.id) {
                inputToCheck = input
            }

            if (isInExtracted) {
                label.style.color = "green"
                label.title = "Зеленый цвет - автоматически определенная категория"

                if (!serverValue) {
                    let currentCount = extractedDataCounts[categoryItem.id]
                    if (currentCount > minMatchesCount) {
                        inputToCheck = input
                        minMatchesCount = currentCount
                    }
                }
            }

            label.innerText = categoryItem.description
            label.htmlFor = inputId

            categoryDiv.appendChild(input)
            categoryDiv.appendChild(label)

            if (!inputToCheck && extractedDataCounts) {
                inputToCheck = input
            }
        }

        if (inputToCheck) {
            inputToCheck.checked = true;
        }

        categoriesDivElement.appendChild(categoryDiv);
    }
}

async function getServerLotInfo(client: EbayToolBackendClient): Promise<void> {
    try {

        _serverLotInfo = await client.getLotInfo(_lotInfo.lotId);
    } catch (error) {
        if (error instanceof NotFoundProblemDetailedInfo) {
            return;
        }

        throw error;
    }
}

async function fillPcs(extractedDataByFieldName: {}) {
    let pcsField = <HTMLInputElement>_panel.querySelector('input#' + pcsFieldName);
    let autoPcsField = <HTMLInputElement>_panel.querySelector('input#' + autoPcsFieldName);

    let fillManualWithAutoValue = false
    let extractedData: LotDataExtractedItem[] = extractedDataByFieldName["pcs"];

    if (extractedData.length > 0) {

        autoPcsField.value = extractedData[0].value;

        if (extractedData.length === 1) {
            autoPcsField.style.backgroundColor = lightGreenColor;

            fillManualWithAutoValue = true
        } else {
            if (extractedData[0].extractorInfo.length > extractedData[1].extractorInfo.length) {
                autoPcsField.style.backgroundColor = lightYellowColor;

                fillManualWithAutoValue = false
            } else {
                autoPcsField.style.backgroundColor = lightPinkColor;
                fillManualWithAutoValue = false
            }
        }

    } else {
        autoPcsField.value = "1"
        autoPcsField.style.backgroundColor = lightYellowColor;

        fillManualWithAutoValue = false
    }

    let serverPcs = _serverLotInfo?.lotInfo?.pcs
    if (serverPcs !== undefined) {
        pcsField.value = serverPcs.toString()
    } else if (fillManualWithAutoValue) {
        pcsField.value = autoPcsField.value
    }
}


async function compareLotInfos(serverLotInfoWithProductId: LotInfoWithProductId) {
    if (serverLotInfoWithProductId === undefined) return;

    let serverLotInfoJson = serverLotInfoWithProductId.lotInfo.toJSON()
    serverLotInfoJson["pcs"] = undefined
    serverLotInfoJson["categories"] = undefined
    serverLotInfoJson["description"] = undefined
    serverLotInfoJson["shortDescription"] = undefined
    serverLotInfoJson["seller"] = undefined
    serverLotInfoJson["purchaseHistory"] = undefined

    let lotInfoJson = _lotInfo.toJSON()
    lotInfoJson["pcs"] = undefined
    lotInfoJson["categories"] = undefined
    lotInfoJson["description"] = undefined
    lotInfoJson["shortDescription"] = undefined
    lotInfoJson["seller"] = undefined
    lotInfoJson["purchaseHistory"] = undefined

    let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson)
    let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson)

    let panel = <HTMLDivElement>await sleepElementLoaded('div.' + panelClass, document);
    if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
        let serverMaxDate = getMax(serverLotInfoWithProductId.lotInfo.purchaseHistory.map(x => {
            if (x.price !== undefined) {
                return new Date(x.date).getTime()
            } else return 0;
        }))
        let ebayMaxDate = getMax(_lotInfo.purchaseHistory.map(x => {
            if (x.price !== undefined) {
                return new Date(x.date).getTime();
            } else return 0;
        }))
        
        if (ebayMaxDate === 0 || serverMaxDate === ebayMaxDate) {
            panel.style.cssText = `background-color: ${lightGreenColor};`
            _serverAndEbayAreEqual = true;
        } else {
            panel.style.cssText = `background-color: ${lightYellowColor};`
            console.log(`Update needed because last sale server ${serverMaxDate} and ebay last sale ${ebayMaxDate}`)
        }
    } else {
        panel.style.cssText = `background-color: ${lightPinkColor};`
        console.log(`Update needed because server and ebay lot info differs`)
    }

    console.log("Received from server: " + serverLotInfoJsonString)
    console.log("CurrentPage: " + currentPageLotInfoJsonString)
}


function getMax(array: number[]) {
    let largest = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {
            largest = array[i];
        }
    }
    return largest;
}


async function extractManualFieldsData(client: EbayToolBackendClient): Promise<{}> {
    let extractedData = (await client.extractData(new LotDataToExtract({
        name: _lotInfo.name,
        conditionDescription: _lotInfo.conditionDescription,
        condition: _lotInfo.condition,
        description: _lotInfo.description
    }))).reduce((dictionary, value) => {
        dictionary[value.fieldName] = value.extractedData;
        return dictionary;
    }, {})

    console.log(JSON.stringify(extractedData))
    return extractedData
}

function getShippingCountry(ebayItem: Item) {
    let shipsTo = ebayItem.shipToLocations.regionIncluded.reduce((set, value) => {
        set.add(value.regionId)
        return set
    }, new Set<string>());
    let excludes = ebayItem.shipToLocations.regionExcluded.reduce((set, value) => {
        set.add(value.regionId)
        return set
    }, new Set<string>());

    let currentCountry = ebayItem.itemLocation.country

    let supportedShippingCountriesArray = Array.from(supportedShippingCountries.keys())
    let position = -1
    while (!supportedShippingCountries.has(currentCountry) || !hasShippingToCountry(currentCountry, shipsTo, excludes)) {
        position++;
        if (position >= supportedShippingCountriesArray.length) throw new Error("Position is greater than supportedShippingCountriesArray lenght");
        currentCountry = supportedShippingCountriesArray[position]
    }
    return currentCountry;
}

async function getEbayItem(ebayClient: EbayClient, ebayShoppingApiClient: EbayShoppingApiClient) {
    let lotId = location.pathname.match(/\/itm\/([0-9]+)/)[1];

    let ebayItem = await ebayClient.getItemByLegacyId(undefined,
        lotId,
        undefined,
        undefined,
        undefined,
        marketplaceId);

    let shippingCountry = getShippingCountry(ebayItem);
    let zipCode = supportedShippingCountries.get(shippingCountry).zip ?? ""
    let shippingCostsXml = await ebayShoppingApiClient.getShippingCosts(lotId, shippingCountry, zipCode)

    await fillLotInfo(ebayItem, shippingCountry, shippingCostsXml)
}

async function fillShipping(shippingCostsXml: string, shippingCountry: string)  {
    console.log(shippingCostsXml)

    let parser = new DOMParser();
    let doc = parser.parseFromString(shippingCostsXml, "application/xml");

    let errorCode = doc.querySelector("GetShippingCostsResponse Errors ErrorCode")
    
    if (errorCode) {
        // Item has no shipping option.
        if (errorCode.innerHTML === '10.6') {
            lotNotSupported = true;
            console.log("Log not supported because Item has no shipping option");
            return
        }
        throw Error("Unexpected error during shipping price extraction: " + shippingCostsXml)
    }
    
    let shippingCostElement = doc.querySelector("ShippingDetails ShippingServiceCost")
    if (!shippingCostElement) {
        shippingCostElement = doc.querySelector("ListedShippingServiceCost")
    }
    let shippingCurrency = shippingCostElement.getAttribute("currencyID")
    if (_lotInfo.currency != shippingCurrency) throw new Error("Shipping and lot currency mismatch lot + " + _lotInfo.currency + " shipping " + shippingCurrency)
    _lotInfo.shipping = parseFloat(shippingCostElement.innerHTML)

    let shippingAdditionalCostElement = doc.querySelector("ShippingDetails ShippingServiceAdditionalCost")
    if (shippingAdditionalCostElement) {
        let shippingAdditionalCurrency = shippingAdditionalCostElement.getAttribute("currencyID")
        if (_lotInfo.currency != shippingAdditionalCurrency) throw new Error("Shipping and lot currency mismatch lot + " + _lotInfo.currency + " shipping additional " + shippingAdditionalCurrency)
        _lotInfo.shippingAdditional = parseFloat(shippingAdditionalCostElement.innerHTML)
    } else {
        _lotInfo.shippingAdditional = 0
    }

    _lotInfo.shippingCountry = shippingCountry
}

async function fillLotInfo(ebayItem: Item, shippingCountry: string, shippingCostXml: string) {
    console.log(JSON.stringify(ebayItem))

    _lotInfo.lotId = parseInt(ebayItem.legacyItemId)

    if (ebayItem.price.convertedFromValue === undefined) {
        _lotInfo.price = parseFloat(ebayItem.price.value)
        _lotInfo.currency = ebayItem.price.currency
    } else {
        _lotInfo.price = parseFloat(ebayItem.price.convertedFromValue)
        _lotInfo.currency = ebayItem.price.convertedFromCurrency
    }

    _lotInfo.name = ebayItem.title

    _lotInfo.seller = ebayItem.seller.username

    _lotInfo.condition = ebayItem.condition ?? "--"

    _lotInfo.conditionDescription = ebayItem.conditionDescription

    _lotInfo.description = ebayItem.description

    _lotInfo.locatedIn = ebayItem.itemLocation.country

    _lotInfo.shortDescription = ebayItem.shortDescription

    await fillShipping(shippingCostXml, shippingCountry);

    //todo categoryPath
}


async function checkForUpdates(): Promise<void> {
    const currentVersion = chrome.runtime.getManifest().version;
    const updateUrl = chrome.runtime.getManifest().update_url;

    if (!updateUrl) {
        throw new Error("Update URL not defined in manifest.");
    }
    const response = await fetchResource(updateUrl, {});
    if (!response.ok) {
        throw new Error("Failed to fetch update manifest: " + response.statusText);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    
    const updateCheckNode = xmlDoc.querySelector("updatecheck");
    const remoteVersion = updateCheckNode?.getAttribute("version");

    if (!remoteVersion) {
        console.error("Version not found in the update manifest.");
        return;
    }

    const isNewerVersion = (current: string, remote: string): boolean => {
        const currentParts = current.split('.').map(Number);
        const remoteParts = remote.split('.').map(Number);

        for (let i = 0; i < Math.max(currentParts.length, remoteParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const remotePart = remoteParts[i] || 0;

            if (remotePart > currentPart) {
                return true;
            } else if (remotePart < currentPart) {
                return false;
            }
        }

        return false;
    };
    
    if (isNewerVersion(currentVersion, remoteVersion)) {
        let alertMessage = `Ebay Helper extension New version available: ${remoteVersion}`
        if (currentVersion === "0") {
            // Локальный дебаг
            console.log("Alerting " + alertMessage)
        }
        else {
            alert(alertMessage);
        }
        return;
    }
    
    console.log("No updates available. Current version is up-to-date.");
}


async function getDataFromPage(backendClient: EbayToolBackendClient, ebayClient: EbayClient, ebayShoppingApiClient: EbayShoppingApiClient) {
    await Promise.all([
        await getEbayItem(ebayClient, ebayShoppingApiClient),
        await getServerLotInfo(backendClient),
    ]);

    let extractedDataByFieldName = await extractManualFieldsData(backendClient);

    await Promise.all([
        fillIsIgnored(backendClient),
        fillPurchaseHistory(),
        fillUpdateTitleDate(),
        fillProduct(backendClient),
        fillManualCondition(backendClient, extractedDataByFieldName),
        fillPcs(extractedDataByFieldName),
    ]);
    
    if (lotNotSupported) {
        await ignoreThatLot(backendClient);
    }
    
    await compareLotInfos(_serverLotInfo);
}

async function saveErrorToBackend(error: Error, client: EbayToolBackendClient) {
    let errorText = JSON.stringify(error) + " " + error?.stack
    try {
        let errorText = JSON.stringify(error) + " " + error?.stack
        await client.saveError(new ClientErrorInfo({
            error: errorText,
            url: document.location.href
        }))
    } catch {
        console.log("Unable to save error to backend " + errorText)
    }
}

async function showAndSaveError(error: Error, client: EbayToolBackendClient) {

    let errorText: string
    if (error instanceof ValidationProblemDetailedInfo) {
        let validationError = <ValidationProblemDetailedInfo>error
        errorText = JSON.stringify(validationError.errors)
    } else {
        errorText = error.stack;
    }

    console.log("ERROR " + errorText + " " + JSON.stringify(error))

    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document)
    let span = document.createElement('span');

    span.innerHTML = errorText
    errorDiv.appendChild(span)
    errorDiv.appendChild(document.createElement('br'))
    await saveErrorToBackend(error, client);
}

function getAuthorizeFetch(oAuth2Client: OAuth2Client, scope: string, tokenStore: string, redirectUri: string): FetchWrapperCustom {
    return new FetchWrapperCustom({
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
    })
}

async function hideErrorsAndEnableSubmit() {
    let submitButton = <HTMLInputElement>(await sleepElementLoaded('#' + submitId, document))
    submitButton.disabled = false;
    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document)
    errorDiv.innerHTML = ""
}

async function productPage(backendClient: EbayToolBackendClient, ebayClient: EbayClient, ebayShoppingApiClient: EbayShoppingApiClient) {
    console.log("productPage")

    await createPanel(backendClient, ebayClient, ebayShoppingApiClient)
    try {
        await getDataFromPage(backendClient, ebayClient, ebayShoppingApiClient);
        await hideErrorsAndEnableSubmit()
    } catch (error) {
        await showAndSaveError(error, backendClient);
    }
    _panel.hidden = false;
}

async function extensionAuthPage() {
    console.log("extensionAuthPage")
    
    let backendOAuth2Client = getBackendOAuth2Client();
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {
        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
        
        let oauth2Token = await backendOAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: extensionAuthRedirectUrl,
                codeVerifier
            }
        );
        
        await chrome.storage.local.set({backend_url: backendUrl})
        await chrome.storage.local.set({ebayToolTokenStore: JSON.stringify(oauth2Token)})
        
        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage) {
            await chrome.storage.local.set({return_page: null})
            redirectWithoutReferer(returnPage);
        } else {
            document.location.href = extensionAuthRedirectUrl
        }
    }
}

function redirectWithoutReferer(url: string) {
    window.open(url, '_self', 'noopener,noreferrer');
}

async function ebayApiAuthPage() {
    console.log("ebayApiAuthPage")
    let ebayOAuth2Client: OAuth2Client = getEbayOAuth2Client();
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {

        let oAuth2Client = ebayOAuth2Client;

        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
        
        let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: ebayRedirectUriCode,
                codeVerifier
            }
        );
        
        await chrome.storage.local.set({ebayTokenStore: JSON.stringify(oauth2Token)})
        
        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage) {
            await chrome.storage.local.set({return_page: null})
            document.location.href = returnPage;
        } else {
            document.location.href = ebayRedirectUriCode
        }
    }
}



async function searchPage(client: EbayToolBackendClient) {
    console.log("SearchPage")

    //только на странице проданые лоты
    if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;
    
    
    
    let searchResults = await sleepElementLoaded('ul.srp-results', document)
    
    if (!document.querySelector("div.srp-save-null-search")) { // что-то найдено

        let links: LotLink[] = [];
        for (let li of [...searchResults.querySelectorAll('li')]) {
            if (li.classList.contains("srp-river-answer--REWRITE_START") && li.innerText === "Results matching fewer words") break
            if (li.classList.contains("s-item")) {
                let link = <HTMLAnchorElement>li.querySelector('a.s-item__link')
                let soldDate = new Date((<HTMLElement>li.querySelector('span.POSITIVE')).innerText.replace("Sold ", ""))
                links.push(new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate));
            }
        }
        // noinspection JSUnusedLocalSymbols
        let _ = updateStatusInfinite(client, links);
    }

    await createOpenMultipleButton()
}

async function updateStatusInfinite(client: EbayToolBackendClient, links: LotLink[]) {
    let ids = links.map(function (x) {
        return x.id
    })
    // noinspection InfiniteLoopJS
    while (true) {
        try {
            //console.log("UpdatingLotStates")
            let getLotStatesAnswer = await client.getLotStates(ids)
            let ignoredLots = new Set(await client.getIgnoredLots(_currentProductId))

            let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));

            let notKnownItems = []
            
            let importantCount = 0;
            links.forEach(function (x) {
                let color = x.color;

                if (!ignoredLots.has(x.id)) {
                    if (knownLots.has(x.id)) {
                        let lotState = knownLots.get(x.id)

                        let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                        if (diffInDays > 0) {
                            x.color = lightYellowColor
                            notKnownItems.push(x.id);
                        } else {
                            x.color = lightGreenColor
                        }
                        importantCount++;
                    } else {
                        x.color = lightPinkColor
                        notKnownItems.push(x.id);
                        importantCount++;
                    }
                } else {
                    x.color = lightGrayColor
                }
                
                if (importantCount <= interestedInTopNItems){
                    if (x.color !== null && color !== x.color) {
                        x.link.style.cssText = `background-color: ${x.color};`
                    }
                }
            })

            _needActualizationLotsIds = notKnownItems
        } catch (error) {
            await saveErrorToBackend(error, client)
        }
        await sleep(1000)
    }
}

class LotLink {
    constructor(id: number, link: HTMLAnchorElement, soldDate: Date) {
        this.id = id
        this.link = link
        this.soldDate = soldDate
        this.color = null
    }

    id: number;
    link: HTMLAnchorElement;
    soldDate: Date
    color: string | null
}


async function saveCodeVerifier() {
    let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

    if (codeVerifier === null || codeVerifier === undefined) {
        let codeVerifier = await generateCodeVerifier();
        await chrome.storage.local.set({code_verifier: codeVerifier})
    }
}

async function ebayPages(currentPage: string) {
    let ebayOAuth2Client: OAuth2Client = getEbayOAuth2Client();
    let backendOAuth2Client: OAuth2Client = getBackendOAuth2Client();
    
    await sleepElementLoaded('footer', document)
    
    _currentProductId = getCurrentProductIdParam();
    if (!_currentProductId) {
        console.log("productId not found")
        return;
    }

    await chrome.storage.local.set({return_page: document.location.href})
    let authorizeFetch = getAuthorizeFetch(ebayOAuth2Client, ebayApiScope, "ebayTokenStore", ebayRedirectUriCode)

    let ebayClient = new EbayClient("https://api.ebay.com/buy/browse/v1", authorizeFetch);
    let ebayShoppingApiClient = new EbayShoppingApiClient(authorizeFetch)
    let backendClient = new EbayToolBackendClient(baseApiUrl, getAuthorizeFetch(backendOAuth2Client, backendApiScope, "ebayToolTokenStore", extensionAuthRedirectUrl));
    try {
        if (currentPage.startsWith("https://www.ebay.com/itm/")) {
            await productPage(backendClient, ebayClient, ebayShoppingApiClient);
        } else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
            await searchPage(backendClient);
        }
    } catch (error) {
        await saveErrorToBackend(error, backendClient)
    }
}


function highlightWords(words: string[], highlightClass: string = "highlight"): void {
    console.log("highlightWords")
    //todo regex надо кешировать
    let wordsReplaced = words.map(x => x.toLowerCase()
        .replace('(', '\(')
        .replace(')', '\)')
        .replace('/', '\/')
        .replace('.', ',')
        .replace(',', '[,.]')
        .replace(' ', '[ ]?')
        .replace('-', '[- ]?')
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
    )
    const regex = new RegExp(`(?:^|\\s|\.)(${wordsReplaced.join("|")})(?:$|\\s|-|,|\.)`, "ig");
    console.log(regex);
    
     const highlightWord = (node: Text) => {
        let parent = node.parentElement;
        if (!parent) return;
        
        let originalText = node.textContent;
        if (originalText && regex.test(originalText)) {
            parent.classList.add(highlightClass);
        }
    };

    const traverseNodes = (element: HTMLElement | null): void => {
        if (!element) return;
        let children = Array.from(element.childNodes);
        
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (node.nodeType === Node.TEXT_NODE) {
                highlightWord(node as Text);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                traverseNodes(node as HTMLElement);
            }
        }
    };
    
    const body = document.body;
    if (!body) {
        console.error("Document body is null. Unable to traverse DOM.");
        return;
    }
    
    traverseNodes(body);
}

async function processAvitoBackground() {
    console.log("processAvitoBackground");
    let found = false;
    do {
        await sleep(300);

        let moreButton = [...document.querySelectorAll('a')].filter(a => a.innerText.includes("Читать полностью"))

        if (moreButton.length > 0) {
            moreButton[0].click();
            found = true;
        }
    } while (!found);
}

async function processAvito() {
    console.log("processAvito");
    let description = document.querySelectorAll<HTMLDivElement>('div[itemprop="description"]');

    description.forEach(function (post) {
        post.innerHTML = '<pre>' + post.innerHTML.replace(/<br\s*\/?>/g, '</pre><pre>') + '</pre><br>';
    });
}

async function processChipFind() {
    console.log("processChipFind")
    if (location.pathname === "/market/search.htm" || location.pathname === "/market/") {

        await sleepElementLoaded('div.pages', document)
        await sleepElementLoaded('.plus a', document)


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
            contact?.remove()
            post.innerHTML = '<pre>' + post.innerHTML.replace(/<br\s*\/?>/g, '</pre><pre>') + '</pre><br>' + contactHtml;
        });
    }
}

async function processSitePage() {
    let backendOAuth2Client: OAuth2Client = getBackendOAuth2Client();
    let backendClient = new EbayToolBackendClient(baseApiUrl, getAuthorizeFetch(backendOAuth2Client, backendApiScope, "ebayToolTokenStore", extensionAuthRedirectUrl));

    let wordsToHighlight = await getCachedDataOrFallback("knownItems", async () => {
            let allProducts = await backendClient.getAllProducts();
            allProducts.map(x => x.name)
                .concat(allProducts.map(x=>x.ruSearchQueries.map(x=>x.query)).reduce((acc, val) => acc.concat(val), []))

            return Array.from(allProducts.map(x => x.name)
                .concat(allProducts.map(x=>x.ruSearchQueries.map(x=>x.query)).reduce((acc, val) => acc.concat(val), [])));
        },
        60 * 60)

    if (chipFindRegex.test(location.host)) {
        await processChipFind();
    }
    else if (avitoRegex.test(location.host)) {
       await processAvito();
       let _ = processAvitoBackground();
    }
    highlightWords(wordsToHighlight);
}

async function searchSitePages() {
    console.log("searchSitePages")

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", processSitePage);
    } else {
        await processSitePage();
    }
    
    let backendOAuth2Client: OAuth2Client = getBackendOAuth2Client();
    await chrome.storage.local.set({return_page: document.location.href})
    
    let backendClient = new EbayToolBackendClient(baseApiUrl, getAuthorizeFetch(backendOAuth2Client, backendApiScope, "ebayToolTokenStore", extensionAuthRedirectUrl));

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action === "processText") {
            console.log("Received message", message.text);
            let productName = message.text.trim();
            await backendClient.createProduct(new ProductWithoutId({
                name: productName,
                searchQueries: Array.of(new SearchQuery({id: uuidv4(), query: transliterate(productName)})),
                ruSearchQueries:  new Array<RuSearchQuery>(),
                weight: 0
            }));
            removeFromCache("knownItems");
            showToast("Product created \"" + productName + "\"");
        }
    });

    
    const style = document.createElement("style");
    style.textContent = `
.highlight {
    background-color: ${lightGreenColor};
    font-weight: bold;
}
`;
    document.head.appendChild(style);
}

function matchesAnyRegex(regexSet: RegExp[], value: string): boolean {
    return regexSet.some((regex) => regex.test(value));
}


function getEbayOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: "https://auth.ebay.com/",
        clientId: 'ArtemPet-tubesSea-PRD-63b5a5e64-416f2036',
        tokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        authorizationEndpoint: '/oauth2/authorize',
        clientSecret: "PRD-3b5a5e64bd92-2c90-41e9-bff8-e256",
        fetch: fetchResource
    });
}

function getBackendOAuth2Client() : OAuth2Client {
    return new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });
}

function showToast(message: string, duration = 3000) {
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

export async function run() {
  
    if (!matchesAnyRegex(workOnSites, location.host))
        return;
    
    console.log("Ebay extension is active on this page");
    
    await saveCodeVerifier();

    let _ = checkForUpdates();

    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === extensionAuthRedirectUrl) {
        await extensionAuthPage();
    } else if (currentPage === ebayAuthRedirectUrl) {
        await ebayApiAuthPage();
    } else if (ebaySiteRegex.test(location.host)) {
        await ebayPages(currentPage);
    }
    else {
        await searchSitePages();
    }
}


run();