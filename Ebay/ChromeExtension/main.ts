import {
    Client, ClientErrorInfo,
    LotInfo,
    LotInfoWithProductId, NotFoundProblemDetailedInfo,
    PurchaseInfo, ValidationProblemDetailedInfo
} from "./EbayClient/EbayClient"

import jsonpath from "jsonpath";
import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";

const ignoreThatLotFieldName = "ignoreThatLot";
const manualConditionIdFieldName = "manualConditionId";
const productFieldName = "productId";
const pcsFieldName = "pcs";

const panelClass = "panel-div";
const formId = "product-form-id"
const errorElementId = "errorElement"
const submitId = "submitButton"
//const backendUrl = "https://localhost:7095/"
const backendUrl = "https://naks42.ru:17443/"
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/"
const notSetValue = "notSet"
const lightGreenColor = "#ecffec"
const lightPinkColor = "lightpink"
const lightYellowColor = "#e0e07f"
const supportedEuropeCountries = new Set([
    'Germany',
    'Italy',
    'France',
    'United Kingdom',
    'Bulgaria',
    'Lithuania',
    'Slovakia',
    'Latvia',
    'Romania',
    'Estonia',
    'Poland'
])
const supportedShippingCountries = [
    'Germany',
    'Italy',
    'France',
    'United Kingdom',
    'Bulgaria',
    'Lithuania',
    'Slovakia',
    'Latvia',
    'Romania',
    'Estonia',
    'Poland',
    'United States',
    'Australia'
]
const supportedShippingCountriesDictionary = {
    "Germany": "DEU",
    "Italy": "ITA",
    "France": "FRA",
    "United Kingdom": "GBR",
    "United States": "USA",
    "Australia": "AUS",
    'Bulgaria':"BGR",
    'Lithuania':"LTU",
    'Slovakia':"SVK",
    'Latvia':"LVA",
    'Romania':"ROU",
    'Estonia':"EST",
    'Poland':"POL",
}
const zipCodes = {
    "United States": "40202",
    "Australia": "3000–3999"
}
const batchOpen = 5

const searchQueryParam = 'searchQuery'

const ignoreThatLotDiv = "ignoreThatLotDiv"
const unsupportedLotDiv = "unsupportedLotDiv"

const lotInfo = new LotInfo();
let _serverLotInfo: LotInfoWithProductId;
let _unsupportedLot = false;
let _knownLotsIds: number[] = []

// fetch через background script, по другому не работает
function fetchResource(input: RequestInfo, init: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                // Use undefined on a 204 - No Content
                const body = response.body ? new Blob([response.body]) : undefined;
                resolve(new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
            }
        });
    });
}


function extractPrice(price: string): Price {
    let priceTrimmed = price.trim()
    console.log(priceTrimmed)
    let matches = priceTrimmed.match(/^(\D+)(\d+(?:[,.]\d+)?\s*)([(\/].+|$)/)
    if (matches) {
        return new Price(parseFloat(matches[2].replace(',', '.')), matches[1].trim())
    } else {
        let matches = priceTrimmed.match(/^(\d+(?:[,.]\d+)?)(\D+)([(\/].+|$)/)
        return new Price(parseFloat(matches[1].replace(',', '.')), matches[2].trim())
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

async function createPanel(client: Client): Promise<HTMLDivElement> {
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
    
    .${panelClass} label {
      font-weight: bold;
      display: block;
      width: 200px;
      float: left;
    }
    
    .${panelClass} input {
      width: 200px;
    }
    
    .${panelClass} select {
      width: 200px;
    }
    
    .${panelClass} label:after { content: ": " }
`

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    bodyElement.appendChild(styleSheet)

    let div = document.createElement('div');
    div.classList.add(panelClass);


    let form = document.createElement('form')
    form.id = formId
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;

    let historyButtonHref = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    // language=HTML
    form.innerHTML = `
        <a href="${historyButtonHref}" target="_blank">История продаж лота</a>
        <br>Бэкенд: <a href="${backendUrl}" target="_blank">${backendUrl}</a>
        <br>
        <br>
        <div id="${ignoreThatLotDiv}">
            <label for="${ignoreThatLotFieldName}">Игнорировать лот</label>
            <input id="${ignoreThatLotFieldName}" type="checkbox" name="${ignoreThatLotFieldName}"/>
            <br>
            <br>
        </div>
        <label for="${productFieldName}">Товар</label>
        <select name="${productFieldName}" id="${productFieldName}">
            <option value="">Выберите товар</option>
        </select>
        <br>
        <label for="${pcsFieldName}">PCS</label>
        <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
        <br>
        <label for="${manualConditionIdFieldName}">Состояние</label>
        <select name="${manualConditionIdFieldName}" id="${manualConditionIdFieldName}">
            <option value="">Выберите Состояние</option>
        </select>
        <br>
        <div id="${unsupportedLotDiv}" hidden="hidden">Лот не поддерживается, будет добавлен в игнор
        </div>
        <div style="color: red;" id="${errorElementId}"></div>
        <br>
        <input id="${submitId}" type="submit" value="Save" disabled/>
    `;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        await handleSubmit(event, client)
    });

    div.appendChild(form)
    div.hidden = true;
    bodyElement.appendChild(div);

    return div
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
    
    .${panelClass} label {
      font-weight: bold;
      display: block;
      width: 200px;
      float: left;
    }
    
    .${panelClass} input {
      width: 200px;
    }
    
    .${panelClass} select {
      width: 200px;
    }
    
    .${panelClass} label:after { content: ": " }
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
        let lastWindow: WindowProxy;
        for (let x of _knownLotsIds.slice(0, batchOpen)) {
            let url = "https://www.ebay.com/itm/" + x;
            lastWindow = window.open(url, '_blank');

            await sleep(50);
        }

        lastWindow.focus()
    });

    div.appendChild(form)
    bodyElement.appendChild(div);

    return div
}

async function handleSubmit(event: SubmitEvent, client: Client) {
    try {
        event.preventDefault();
        let data = new FormData(<HTMLFormElement>event.target);

        let ignoreThatLot = false;

        data.forEach(function (value, key) {

            if (key === 'ignoreThatLot') {
                ignoreThatLot = true
            } else {
                lotInfo[key] = value;
            }
        });

        if (_unsupportedLot) {
            ignoreThatLot = true;
        }

        lotInfo['ignoreThatLot'] = ignoreThatLot;

        if (ignoreThatLot) {
            if (!lotInfo.pcs) {
                lotInfo.pcs = 1
            }
            if (!lotInfo.manualConditionId) {
                lotInfo.manualConditionId = notSetValue
            }
        }

        console.log("Sending to backend: " + JSON.stringify(lotInfo))


        await client.upsertLotInfo(lotInfo, data.get('productId').toString())

        await productPage(client)
    } catch (error) {
        await showAndSaveError(error, client)
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
            if (priceExtracted.currency !== lotInfo.currency) {
                throw new Error("currency doesn't match with lot currency lot currency " + lotInfo.currency + " extracted currency " + priceExtracted.currency)
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

function parseDate(dateString): Date {
    let matches = dateString.match(/(\d+\s[A-z]+\s\d+)\sat\s(\d+):(\d+):(\d+)(am|pm)\s([A-z]+)/)

    let date = new Date(Date.parse(matches[1] + ' 00:00:00.000Z'))

    date.setUTCHours(parseInt(matches[2]));
    date.setUTCMinutes(parseInt(matches[3]));
    date.setUTCSeconds(parseInt(matches[4]));

    if (matches[5] === "pm" && date.getUTCHours() !== 12) {
        date.setHours(date.getHours() + 12);
    }
    if (matches[5] === "am" && date.getUTCHours() === 12) {
        date.setHours(date.getHours() - 12);
    }

    if (matches[6] === "MSK") {
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

function fillId() {
    lotInfo.lotId = parseInt(location.pathname.match(/\/itm\/([0-9]+)/)[1]);
}

async function fillPrice() {
    let price = extractPrice((<HTMLElement>await sleepElementLoaded('div.x-price-primary span', document)).innerText)
    lotInfo.price = price.price
    lotInfo.currency = price.currency
}

async function fillName() {
    lotInfo.name = (<HTMLElement>await sleepElementLoaded('.vim h1', document)).innerText
}

async function fillSeller() {
    lotInfo.seller = (<HTMLElement>await sleepElementLoaded('div.x-sellercard-atf__info__about-seller a', document)).innerText.toLowerCase()
}

async function fillCondition() {
    lotInfo.condition = (<HTMLElement>await sleepElementLoaded('div.x-item-condition-text span.ux-textspans', document)).innerText
}

async function fillConditionDescription() {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc')
    if (conditionDescriptionElement != null) {
        lotInfo.conditionDescription = (<HTMLElement>conditionDescriptionElement).innerText
            .replace('“', '')
            .replace('”', '')
    }
}


function hasShippingToCountry(country: string, shipsTo: Set<string>, excludes: Set<string>) {
    return (shipsTo.has('Worldwide') || (shipsTo.has("Europe") && supportedEuropeCountries.has(country)) || shipsTo.has(country)) && !excludes.has(country);
}

function getShipsTo(shippingDiv: Element): Set<string> {
    return new Set((<HTMLDivElement>shippingDiv.querySelector('div.ux-labels-values--shipsto')).innerText.replace("Ships to:", "")
        .split(',').map(s => s.trim()));
}

function getExcludes(shippingDiv: Element): Set<string> {
    return new Set((<HTMLDivElement>shippingDiv.querySelector('div.ux-labels-values--excludes')).innerText.replace("Excludes:", "")
        .split(',').map(s => s.trim()));
}

async function showLotIsNotSupported() {
    (<HTMLDivElement>(await sleepElementLoaded('div#' + ignoreThatLotDiv, document))).hidden = true;
    (<HTMLDivElement>(await sleepElementLoaded('div#' + unsupportedLotDiv, document))).hidden = false;

    _unsupportedLot = true;
}

async function fillShipping() {
    let shippingDiv = await sleepElementLoaded('div.d-shipping-maxview', document);
    let shipsTo = getShipsTo(shippingDiv);
    let excludes = getExcludes(shippingDiv);

    let shippingFromCountry = lotInfo.locatedIn.split(',').pop().trim()
    let indexOfShippingFromCountries = supportedShippingCountries.indexOf(shippingFromCountry)

    if (indexOfShippingFromCountries >= 0) {
        supportedShippingCountries[indexOfShippingFromCountries] = supportedShippingCountries[0]
        supportedShippingCountries[0] = shippingFromCountry
    }

    let shippingCountry: string | null
    for (let i = 0; i < supportedShippingCountries.length; i++) {
        let currentShippingCountry = supportedShippingCountries[i]
        if (hasShippingToCountry(currentShippingCountry, shipsTo, excludes)) {
            shippingCountry = currentShippingCountry
            break;
        }
    }

    if (shippingCountry === null) {
        throw new Error("shippingCountry is null")
    }

    let countryCode = supportedShippingCountriesDictionary[shippingCountry]
    let zipCode = zipCodes[shippingCountry] ?? ""

    let shippingRatesUrl = "https://www.ebay.com/itemmodules/" + lotInfo.lotId +
        "?module_groups=GET_RATES_MODULE_GROUP&co=0&isGetRates=1&rt=nc&quantity=1&shipToCountryCode=" + countryCode
        + "&shippingZipCode=" + zipCode

    let shippingInfoResponse = await fetchResource(shippingRatesUrl, {method: 'GET', credentials: "include"})
    let text = await shippingInfoResponse.text()

    let shippingJson = JSON.parse(text)
    //console.log(text)
    let jsonPathTablePrefix = "$.states[?(@.eventName=='ux-app__d-shipping-max-view__refreshState')].state.model.SHIPPING_SECTION_MODULE.sections.shippingTable.table"

    let jsonPathHeaderPrefix = jsonPathTablePrefix + ".header.cells"
    let jsonPathCellsPrefix = jsonPathTablePrefix + ".rows[0].cells"


    let headers = {}
    for (let i = 0; i <= 3; i++) {
        let jsonPathHeader = jsonPathHeaderPrefix + "[" + i + "].textSpans[0].text"
        let headerName = jsonpath.query(shippingJson, jsonPathHeader)[0].toString()
        headers[headerName] = i
    }

    let shippingJsonPath = jsonPathCellsPrefix + "[0].textSpans[0].text"

    let shippingString = jsonpath.query(shippingJson, shippingJsonPath)[0].toString()
    if (shippingString === "Free shipping") {
        lotInfo.shipping = 0;
    } else {
        let shipping = extractPrice(shippingString)
        if (shipping.currency !== lotInfo.currency) throw new Error("shipping and lot currency mismatch, lotCurrency " + lotInfo.currency + ", shippingCurrency " + shipping.currency)
        lotInfo.shipping = shipping.price
    }

    if (headers.hasOwnProperty("Each additional item")) {
        let shippingAdditionalJsonPath = jsonPathCellsPrefix + "[1].textSpans[0].text"

        let shippingAdditionalString = jsonpath.query(shippingJson, shippingAdditionalJsonPath)[0].toString()
        if (shippingAdditionalString === "Free") {
            lotInfo.shippingAdditional = 0;
        } else {
            let shippingAdditional = extractPrice(shippingAdditionalString)
            if (shippingAdditional.currency !== lotInfo.currency)
                throw new Error("shipping additional and lot currency mismatch, lotCurrency " + lotInfo.currency + ", shippingAdditionalCurrency " + shippingAdditional.currency)
            lotInfo.shippingAdditional = shippingAdditional.price
        }
    } else {
        lotInfo.shippingAdditional = 0;
    }

    let shippingToJsonPath = jsonPathCellsPrefix + "[" + headers["To"] + "].textSpans[0].text"

    let shippingTo = jsonpath.query(shippingJson, shippingToJsonPath)[0].toString()
    if (shippingTo !== shippingCountry) throw new Error("Shipping country expected to be " + shippingCountry + " but was " + shippingTo)

    lotInfo.shippingCountry = shippingCountry
}


async function sleepUntil(func: () => boolean, sleepMs: number = 100, maxAttempt: number = 100): Promise<void> {
    let attempt = 0;
    while (func()) {
        attempt++;

        if (attempt > maxAttempt) throw new Error("Attempt counts exceeded " + maxAttempt + " " + func.toString())

        await sleep(sleepMs)
    }
}

function getCountrySpanItem(countryName: string, itemsMenu: HTMLDivElement): HTMLSpanElement {

    if (countryName === null || countryName === undefined) throw new Error("country name shouldn't be null or undefined")

    let spans = itemsMenu.querySelectorAll('span.cn');

    for (let i = 0; i < spans.length; ++i) {
        if ((<HTMLElement>spans[i]).innerText === countryName) {
            return <HTMLSpanElement>spans[i];
        }
    }

    throw new Error("Unable to find country in list " + countryName)
}

async function fillLocatedIn() {
    let match = (<HTMLElement>await sleepElementLoaded('div.d-shipping-minview', document)).innerText.match(/Located\sin:\s(.+)/)
    if (match !== null) {
        lotInfo.locatedIn = match[1]
    } else {
        lotInfo.locatedIn = "Unknown"
    }
}

async function fillDescription() {
    let foundElement = await sleepElementLoadedAny(['#desc_ifr', '#vi_snippetdesc_btn'])

    let descriptionUrl: string
    if (foundElement instanceof HTMLIFrameElement) {
        descriptionUrl = (<HTMLIFrameElement>foundElement).src
    } else if (foundElement instanceof HTMLAnchorElement) {
        descriptionUrl = (<HTMLAnchorElement>foundElement).href
    }

    console.log(descriptionUrl)
    let response = await fetchResource(descriptionUrl, {method: 'GET', credentials: 'include'})
    lotInfo.description = await response.text()
}

async function fillPurchaseHistory() {
    if (!_unsupportedLot) {
        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
        let response = await fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
        let text = await response.text()
        lotInfo.purchaseHistory = parseSoldItemsPage(text)
    }
}

function getSearchQuery(): string | undefined {
    if (document.referrer) {
        return new URL(document.referrer).searchParams?.get('_nkw')?.trim()?.toLowerCase();
    }

    return new URL(document.location.href).searchParams?.get(searchQueryParam)?.trim()?.toLowerCase();
}

async function fillProduct(panel: HTMLDivElement, client: Client, serverLotInfo: LotInfoWithProductId | undefined) {
    let productField = panel.querySelector('select#' + productFieldName);

    let productId = serverLotInfo?.productId?.trim()?.toLowerCase()
    let searchQuery = getSearchQuery();

    let products = await client.getAllProducts()
    for (let i = 0; i < products.length; i++) {
        let opt = document.createElement('option');
        opt.value = products[i].id;
        opt.innerHTML = products[i].name;

        if (productId !== undefined) {
            if (productId === products[i].id.trim().toLowerCase()) {
                opt.selected = true
            }
        } else if (searchQuery !== undefined) {
            products[i].searchQueries.forEach(function (x) {
                if (searchQuery === x.query.trim().toLowerCase()) {
                    opt.selected = true
                }
            })

        }
        productField.appendChild(opt);
    }
}

async function fillManualCondition(panel: HTMLDivElement, client: Client, serverLotInfo: LotInfoWithProductId | undefined) {
    let manualConditionField = panel.querySelector('select#' + manualConditionIdFieldName);

    let manualConditionId = serverLotInfo?.lotInfo?.manualConditionId?.trim()?.toLowerCase()

    let manualConditions = await client.getManualConditionsList()
    for (let i = 0; i < manualConditions.length; i++) {
        let opt = document.createElement('option');
        opt.value = manualConditions[i].id;
        opt.innerHTML = manualConditions[i].description;

        if (manualConditionId !== undefined) {
            if (manualConditionId === manualConditions[i].id.trim().toLowerCase()) {
                opt.selected = true
            }
        }

        manualConditionField.appendChild(opt);
    }
}

async function getServerLotInfo(client: Client): Promise<LotInfoWithProductId | undefined> {
    try {
        _serverLotInfo = await client.getLotInfo(lotInfo.lotId);
    } catch (error) {
        if (error instanceof NotFoundProblemDetailedInfo) {
            return undefined;
        }

        throw error;
    }
}

async function fillPcs(panel: HTMLDivElement, serverLotInfo: LotInfoWithProductId | undefined) {
    let pcsField = <HTMLInputElement>panel.querySelector('input#' + pcsFieldName);

    let serverPcs = serverLotInfo?.lotInfo?.pcs
    if (serverPcs !== undefined) {
        pcsField.value = serverPcs.toString()
    }
}

async function fillIgnoreThatLot(panel: HTMLDivElement, serverLotInfo: LotInfoWithProductId | undefined) {
    let ignoreThatLotField = <HTMLInputElement>panel.querySelector('input#' + ignoreThatLotFieldName);

    let serverPcs = serverLotInfo?.lotInfo?.ignoreThatLot
    if (serverPcs !== undefined) {
        ignoreThatLotField.checked = serverPcs
    }
}


async function compareLotInfos(serverLotInfoWithProductId: LotInfoWithProductId) {
    if (serverLotInfoWithProductId === undefined) return;

    let serverLotInfoJson = serverLotInfoWithProductId.lotInfo.toJSON()
    serverLotInfoJson["pcs"] = undefined
    serverLotInfoJson["ignoreThatLot"] = undefined
    serverLotInfoJson["manualConditionId"] = undefined
    serverLotInfoJson["description"] = undefined
    serverLotInfoJson["seller"] = undefined
    serverLotInfoJson["purchaseHistory"] = undefined

    let lotInfoJson = lotInfo.toJSON()
    lotInfoJson["pcs"] = undefined
    lotInfoJson["ignoreThatLot"] = undefined
    lotInfoJson["manualConditionId"] = undefined
    lotInfoJson["description"] = undefined
    lotInfoJson["seller"] = undefined
    lotInfoJson["purchaseHistory"] = undefined

    let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson)
    let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson)

    let panel = <HTMLDivElement>await sleepElementLoaded('div.' + panelClass, document);
    if (serverLotInfoJsonString === currentPageLotInfoJsonString) {

        let serverMaxDate = getMax(serverLotInfoWithProductId.lotInfo.purchaseHistory.map(x => new Date(x.date).getTime()))
        let ebayMaxDate = getMax(lotInfo.purchaseHistory.map(x => {
            return new Date(x.date).getTime();
        }))
        if (_serverLotInfo.lotInfo.ignoreThatLot === true || ebayMaxDate === 0 || serverMaxDate === ebayMaxDate) {
            panel.style.cssText = `background-color: ${lightGreenColor};`
        } else {
            panel.style.cssText = `background-color: ${lightYellowColor};`
        }
    } else {
        panel.style.cssText = `background-color: ${lightPinkColor};`
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

async function checkIfTypedLot() {
    let mainContentDiv = await sleepElementLoaded('div#mainContent', document)

    if (mainContentDiv.querySelector('div.x-msku__box-cont')) {

        await showLotIsNotSupported()
    }
}

async function getDataFromPage(client: Client) {

    fillId();
    await Promise.all([
        fillPrice(),
        fillName(),
        fillSeller(),
        fillCondition(),
        fillConditionDescription(),
        fillLocatedIn(),
        fillDescription(),
        checkIfTypedLot(),
        getServerLotInfo(client)
    ])

    let panel = await createPanel(client);

    await Promise.all([
        fillPurchaseHistory(),
        fillProduct(panel, client, _serverLotInfo),
        fillManualCondition(panel, client, _serverLotInfo),
        fillPcs(panel, _serverLotInfo),
        fillIgnoreThatLot(panel, _serverLotInfo),
        fillShipping(),
    ]);

    console.log("show panel")
    panel.hidden = false;

    await compareLotInfos(_serverLotInfo);
}

async function saveErrorToBackend(error: Error, client: Client) {
    let errorText = JSON.stringify(error) + " " + error.stack
    try {
        await client.saveError(new ClientErrorInfo({
            error: errorText,
            url: document.location.href
        }))
    } catch {
        console.log("Unable to save error to backend " + errorText)
    }
}

async function showAndSaveError(error: Error, client: Client) {

    let errorText: string
    if (error instanceof ValidationProblemDetailedInfo) {
        let validationError = <ValidationProblemDetailedInfo>error
        errorText = JSON.stringify(validationError.errors)
    } else {
        errorText = error.stack;
    }

    console.log("ERROR " + errorText)

    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document)
    let span = document.createElement('span');

    span.innerHTML = errorText
    errorDiv.appendChild(span)

    await saveErrorToBackend(error, client);
}

async function enableSubmitButton() {
    (<HTMLButtonElement>await sleepElementLoaded('#' + submitId, document)).disabled = false
}

function getAuthorizeFetch(oAuth2Client: OAuth2Client): FetchWrapperCustom {
    return new FetchWrapperCustom({
        client: oAuth2Client,
        getNewToken: async () => {
            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

            document.location.href = await oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: authRedirectUrl,
                codeVerifier,
                scope: ['Ebay.ServerAPI']
            });
            return null;
        },
        getStoredToken: async () => {
            if (backendUrl !== (await chrome.storage.local.get(["backend_url"])).backend_url) return null;
            let token = (await chrome.storage.local.get(["token_store"])).token_store;
            if (token) return JSON.parse(token);
            return null;
        },
        fetch: fetchResource
    })
}

async function hideErrors() {
    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document)
    errorDiv.innerHTML = ""
}

async function productPage(client: Client) {
    console.log("productPage")
    try {
        await getDataFromPage(client);
        await enableSubmitButton()
        await hideErrors()
    } catch (error) {
        await showAndSaveError(error, client);
    }
}

async function authPage(oAuth2Client: OAuth2Client) {
    console.log("authPage")
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {
        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
        let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: authRedirectUrl,
                codeVerifier
            }
        );
        await chrome.storage.local.set({backend_url: backendUrl})
        await chrome.storage.local.set({token_store: JSON.stringify(oauth2Token)})

        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage !== null && returnPage !== undefined) {
            await chrome.storage.local.set({return_page: null})
            document.location.href = returnPage
        } else {
            document.location.href = authRedirectUrl
        }
    }
}


async function searchPage(client: Client) {
    console.log("SearchPage")
    //только на странице проданые лоты
    if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;

    let searchResults = await sleepElementLoaded('ul.srp-results', document)

    let links : LotLink[] = [];
    for (let li of [...searchResults.querySelectorAll('li')]) {
        if (li.classList.contains("srp-river-answer--REWRITE_START")) break
        if (li.classList.contains("s-item")) {
            let link = <HTMLAnchorElement>li.querySelector('a.s-item__link')
            let soldDate = new Date((<HTMLElement>li.querySelector('span.POSITIVE')).innerText.replace("Sold ", ""))
            links.push(new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate));
        }
    }

    let _ = updateStatusInfinite(client, links);

    await createOpenMultipleButton()
}

async function updateStatusInfinite(client: Client, links: LotLink[]) {
    let ids = links.map(function (x) {
        return x.id
    })
    // noinspection InfiniteLoopJS
    while (true) {
        try {
            //console.log("UpdatingLotStates")
            let getLotStatesAnswer = await client.getLotStates(ids)


            let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));

            let notKnownItems = []

            links.forEach(function (x) {

                let color = x.color;

                if (knownLots.has(x.id)) {
                    let lotState = knownLots.get(x.id)
                    if (!lotState.ignoreThatLot) {
                        let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                        if (diffInDays > 0) {
                            x.color = lightYellowColor
                            notKnownItems.push(x.id);
                        } else {
                            x.color = lightGreenColor
                        }
                    } else {
                        x.color = lightGreenColor
                    }
                } else {
                    x.color = lightPinkColor
                    notKnownItems.push(x.id);
                }

                if (x.color !== null && color !== x.color) {
                    x.link.style.cssText = `background-color: ${x.color};`
                }
            })

            _knownLotsIds = notKnownItems
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

async function sleepElementLoadedAny(selectors: string[]): Promise<Element> {

    let retry = 0
    while (true) {
        retry++;
        if (retry > 1000) throw new Error("unable to find any element by selectors " + selectors.join(", "))

        let foundElement: Element
        selectors.forEach(function (x) {
            let element = document.querySelector(x)
            if (element != null) {
                foundElement = element
            }
        })

        if (foundElement !== null) return foundElement
        await sleep(100);
    }
}


function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveCodeVerifier() {
    let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

    if (codeVerifier === null || codeVerifier === undefined) {
        let codeVerifier = await generateCodeVerifier();
        await chrome.storage.local.set({code_verifier: codeVerifier})
    }
}

export async function run() {
    await sleepElementLoaded('footer', document)
    await saveCodeVerifier();

    let oAuth2Client = new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });

    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === authRedirectUrl) {
        await authPage(oAuth2Client);
    } else {
        await chrome.storage.local.set({return_page: document.location.href})

        let client = new Client(baseApiUrl, getAuthorizeFetch(oAuth2Client));
        try {
            if (currentPage.startsWith("https://www.ebay.com/itm/")) {
                await productPage(client);
            } else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
                await searchPage(client);
            }
        } catch (error) {
            await saveErrorToBackend(error, client)
        }
    }

}


run();