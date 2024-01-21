import {ApiException, Client, LotInfo, PurchaseInfo, ValidationProblemDetails} from "./EbayClient/EbayClient"
import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";

const panelClass = "panel-div";
const formId = "product-form-id"
const productFieldName = "productId";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const errorElementId = "errorElement"
const submitId = "submit"
const backendUrl = "https://localhost:7095/"
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/"

const lotInfo = new LotInfo();

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


function extractPrice(price) {
    let matches = price.match(/(\D+)(\d+(?:[,.]\d+)?)/)
    if (matches[1] !== "US $") {
        throw new Error('US $ price expected, but was')
    }

    return matches[2].replace(',', '.')
}

function createHistoryButton() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;
    let historyButton = document.createElement('a');
    historyButton.classList.add('history-button');
    historyButton.textContent = 'HISTORY';
    historyButton.href = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    historyButton.style.cssText = `
    cursor: pointer;
    margin-left: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 3px 6px;
    text-decoration: none;
    color: black;
  `;
    historyButton.target = '_blank';

    return historyButton;
}

function addHistoryButton() {
    let productTitleContainer = document.querySelector('.vim[data-testid="x-item-title"]');
    if (productTitleContainer) {
        let existingButton = productTitleContainer.querySelector('a.history-button');
        if (!existingButton) {
            let historyButton = createHistoryButton();
            productTitleContainer.appendChild(historyButton);
        }
    }
}


function createPanel(bodyElement, client: Client) {
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
        <label for="${productFieldName}">Товар</label>
        <select name="${productFieldName}" id="${productFieldName}">
            <option value="">Выберите товар</option>
        </select>
        <br>
        <label for="${pcsFieldName}">PCS</label>
        <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
        <br>
        <label for="${priceFieldName}">Price US$</label>
        <input id="${priceFieldName}" type="number" step="0.01" name="${priceFieldName}"/>
        <br>
        <label for="${shippingFieldName}">Shipping to Germany</label>
        <input id="${shippingFieldName}" type="number" step="0.01" name="${shippingFieldName}"/>
        <br>
        <label for="${shippingAdditionalFieldName}">Shipping each additional</label>
        <input id="${shippingAdditionalFieldName}" type="number" step="0.01" name="${shippingAdditionalFieldName}"/>
        <br>
        <div style="color: red;" id="${errorElementId}"></div>
        <br>
        <input id="${submitId}" type="submit" value="Save" disabled/>`;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        await handleSubmit(event, client)
    });

    div.appendChild(form)
    bodyElement.appendChild(div);
}

async function handleSubmit(event: SubmitEvent, client: Client) {
    try {
        event.preventDefault();
        let data = new FormData(<HTMLFormElement>event.target);

        data.forEach(function (value, key) {
            lotInfo[key] = value;
        });

        console.log(JSON.stringify(lotInfo))


        await client.upsertLotInfo(lotInfo, data.get('productId').toString())
    } catch (error) {
        showError(error)
    }
}


function fillSoldItemsResult(fixedPriceRows: HTMLTableRowElement[], result: PurchaseInfo[]) {
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

            result.push(new PurchaseInfo({
                date: parseDate(columns[3]),
                quantity: parseInt(columns[2]),
                price: extractPrice(price)
            }))
        } else {
            result.push(new PurchaseInfo({
                date: parseDate(columns[3]),
                quantity: parseInt(columns[2])
            }))
        }
    }
}

function parseDate(dateString) {
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

    return date.toISOString()
}

function parseSoldItemsPage(text): PurchaseInfo[] {
    let doc = new DOMParser().parseFromString(text, "text/html")

    let result = new Array<PurchaseInfo>();
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

    return result;
}

function fillId() {
    lotInfo.lotId = parseInt(location.pathname.match(/\/itm\/([0-9]+)/)[1]);
}

function fillPrice(panel) {
    let priceField = panel.querySelector('input#' + priceFieldName)
    priceField.value = extractPrice((<HTMLElement>document.querySelector('div.x-price-primary span')).innerText)
}

function fillName() {
    lotInfo.name = (<HTMLElement>document.querySelector('.vim h1')).innerText
}

function fillSeller() {
    lotInfo.seller = (<HTMLElement>document.querySelector('div.x-sellercard-atf__info__about-seller a')).innerText.toLowerCase()
}

function fillCondition() {
    lotInfo.condition = (<HTMLElement>document.querySelector('div.x-item-condition-text span.ux-textspans')).innerText
}

function fillConditionDescription() {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc')
    if (conditionDescriptionElement != null) {
        lotInfo.conditionDescription = (<HTMLElement>conditionDescriptionElement).innerText
            .replace('“', '')
            .replace('”', '')
    }
}

function fillShipping(panel) {
    let shippingField = panel.querySelector('input#' + shippingFieldName)
    let shippingAdditionalField = panel.querySelector('input#' + shippingAdditionalFieldName)
    let shippingRatesAvailable = document.querySelector('div.ux-layout-section__textual-display--askSeller') === null
    if (shippingRatesAvailable) {
        let deliveryColumnsHeader = [...document.querySelector('div.d-shipping-maxview thead')
            .querySelectorAll('th')]
        let deliveryColumnsValues = [...document.querySelector('div.d-shipping-maxview tbody')
            .querySelector('tr')
            .querySelectorAll('td')]

        let shippingMaxviewValues = {};

        for (let i = 0; i < 3; i++) {
            let key = deliveryColumnsHeader[i].innerText
            shippingMaxviewValues[key] = deliveryColumnsValues[i].querySelector('span').innerText
        }

        if (shippingMaxviewValues['To'] !== 'Germany') {
            throw new Error('Shipping country must be Germany');
        }

        let shippingValue = shippingMaxviewValues['Shipping and handling']

        if (shippingValue !== 'Free shipping') {
            shippingField.value = extractPrice(shippingValue)

            if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {
                shippingAdditionalField.value = extractPrice(shippingMaxviewValues['Each additional item'])

            } else {
                shippingAdditionalField.value = 0;
            }

        } else {
            shippingField.value = 0;
            shippingAdditionalField.value = 0;
        }
    }
}

function fillLocatedIn() {
    lotInfo.locatedIn = (<HTMLElement>document.querySelector('div.d-shipping-minview')).innerText.match(/Located\sin:\s(.+)/)[1]
}

function fillDescription() {
    let descriptionUrl = (<HTMLIFrameElement>document.querySelector('#desc_ifr')).src
    fetchResource(descriptionUrl, {method: 'GET', credentials: 'include'})
        .then((response) => {
            response.text().then((text) => {
                lotInfo.description = text
            }).catch((err) => {
                showError(err);
            })
        })
        .catch((err) => {
            showError(err)
        })
}

function fillPurchaseHistory() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
        .then((response) => {
            (<Response>response).text().then((text) => {
                lotInfo.purchaseHistory = parseSoldItemsPage(text)
            }).catch((err) => {
                showError(err);
            })
        })
        .catch((err) => {
            showError(err)
        })
}

async function fillProduct(panel: HTMLDivElement, client: Client) {
    let productField = panel.querySelector('select#' + productFieldName);
    let searchQuery = new URLSearchParams(document.referrer)?.get('_nkw')?.trim()?.toLowerCase();

    let products = await client.getAllProducts()
    for (let i = 0; i < products.length; i++) {
        let opt = document.createElement('option');
        opt.value = products[i].id;
        opt.innerHTML = products[i].name;

        if (searchQuery !== undefined && searchQuery === products[i].searchQuery.trim().toLowerCase()) {
            opt.selected = true
        }
        productField.appendChild(opt);
    }
}

async function fillPanelWithData(client) {
    let panel = <HTMLDivElement>document.querySelector('div.' + panelClass)
    fillId();
    await fillProduct(panel, client);
    fillPrice(panel);
    fillShipping(panel);
    fillName();
    fillSeller();
    fillCondition();
    fillConditionDescription();
    fillLocatedIn();
    fillDescription();
    fillPurchaseHistory();
}


function addPanel(client: Client) {
    let bodyElement = document.querySelector('body');
    if (bodyElement) {
        let existingPanel = bodyElement.querySelector('div.' + panelClass);
        if (!existingPanel) {
            createPanel(bodyElement, client);
        }
    }
}


function showError(error: Error) {
    let errorDiv = document.querySelector('div.' + panelClass + ' #' + errorElementId)
    let span = document.createElement('span');

    if (error instanceof ApiException) {
        let apiException = <ApiException>error
        console.log(apiException.status + " code received")
        console.log(apiException.response)
        span.innerHTML = apiException.status + " " + apiException.response;
    } else {
        console.log(error.stack)
        span.innerHTML = error.stack;
    }

    errorDiv.appendChild(span)
}

function enableSubmitButton() {
    (<HTMLButtonElement>document.querySelector('#' + submitId)).disabled = false
}

function getAuthorizeFetch(oAuth2Client: OAuth2Client): FetchWrapperCustom {
    return new FetchWrapperCustom({
        client: oAuth2Client,
        getNewToken: async () => {
            let currentPage = location.protocol + '//' + location.host + location.pathname
            let codeVerifier = await generateCodeVerifier();
            await chrome.storage.local.set({code_verifier: codeVerifier, return_to_page: currentPage})
            document.location = await oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: authRedirectUrl,
                codeVerifier,
                scope: ['Ebay.ServerAPI']
            });
            return null;
        },
        getStoredToken: async () => {
            let token = (await chrome.storage.local.get(["token_store"])).token_store;
            if (token) return JSON.parse(token);
            return null;
        },
        fetch: fetchResource
    })
}

async function productPage(client: Client) {
    try {
        addHistoryButton();
        addPanel(client);
        await fillPanelWithData(client);
        //todo разрешать только если вообще нет ошибок
        enableSubmitButton()
    } catch (error) {
        showError(error);
        throw error;
    }
}

async function authPage(oAuth2Client: OAuth2Client) {
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

        await chrome.storage.local.set({token_store: JSON.stringify(oauth2Token)})
        document.location.href = (await chrome.storage.local.get(["return_to_page"])).return_to_page
    }
}

export async function run() {
    let oAuth2Client = new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });

    if (location.protocol + '//' + location.host + location.pathname === authRedirectUrl) {
        await authPage(oAuth2Client);
    } else {
        let client = new Client(baseApiUrl, getAuthorizeFetch(oAuth2Client));
        await productPage(client);
    }
}


run();