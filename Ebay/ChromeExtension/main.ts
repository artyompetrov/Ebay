import {ApiException, Client, LotInfo, ValidationProblemDetails} from "./EbayClient/EbayClient"
import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";

const panelClass = "panel-div";
const formId = "product-form-id"
const idFieldName = "lotId";
const nameFieldName = "name";
const productFieldName = "productId";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const descriptionFieldName = "description";
const conditionFieldName = "condition";
const conditionDescriptionFieldName = "conditionDescription";
const sellerFieldName = "seller";
const purchaseHistoryFieldName = "purchaseHistory";
const locatedInFieldName = "locatedIn";
const errorElementId = "errorElement"
const submitId = "submit"
const backendUrl = "https://localhost:7095/"
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/"

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
            <label for="${idFieldName}">Id</label>
            <input id="${idFieldName}" type="number" name="${idFieldName}" readonly/>
            <br>
            <label for="${productFieldName}">Товар</label>
            <select name="${productFieldName}" id="${productFieldName}">
                <option value="">Выберите товар</option>
            </select>
            <br>
            <label for="${nameFieldName}">Name</label>
            <input id="${nameFieldName}" type="text" name="${nameFieldName}" readonly/>
            <br>
            <label for="${pcsFieldName}">PCS</label>
            <input id="${pcsFieldName}" type="text" name="${pcsFieldName}"/>
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
            <label for="${conditionFieldName}">Condition</label>
            <input id="${conditionFieldName}" type="text" name="${conditionFieldName}"/>
            <br>
            <label for="${conditionDescriptionFieldName}">Condition description</label>
            <input id="${conditionDescriptionFieldName}" type="text" name="${conditionDescriptionFieldName}"/>
            <br>
            <label for="${descriptionFieldName}">Description</label>
            <input id="${descriptionFieldName}" type="text" name="${descriptionFieldName}" readonly/>
            <br>
            <label for="${purchaseHistoryFieldName}">PurchaseHistory</label>
            <input id="${purchaseHistoryFieldName}" type="text" name="${purchaseHistoryFieldName}" readonly/>
            <br>
            <label for="${sellerFieldName}">Seller</label>
            <input id="${sellerFieldName}" type="text" name="${sellerFieldName}" readonly/>
            <br>
            <label for="${locatedInFieldName}">Located in</label>
            <input id="${locatedInFieldName}" type="text" name="${locatedInFieldName}" readonly/>
            <br>
            <div style="color: red;" id="${errorElementId}"></div>
            <br>
            <input id="${submitId}" type="submit" value="Save" disabled/>`;

    form.addEventListener("submit", async function ( event: SubmitEvent) {
        await handleSubmit(event, client)
    }); 
    
    div.appendChild(form)
    bodyElement.appendChild(div);
}

async function handleSubmit(event: SubmitEvent, client: Client) {
    event.preventDefault();
    let data = new FormData(<HTMLFormElement>event.target);
    let object = {};
    data.forEach(function(value, key){ object[key] = value; });

    let  lotinfo = LotInfo.fromJS(object)
    
    try {
        await client.upsertLotInfo(lotinfo, data.get('productId').toString())
    }
    catch (error) {
        if (error instanceof ApiException) {
            let apiException = <ApiException>error
            console.log(apiException.status)
            console.log(apiException.response)
            //todo тут 400
        }
        else throw error;
    }
}



function fillSoldItemsResult(fixedPriceRows, result) {
    for (let fixedPriceRow of fixedPriceRows) {
        let columns = [...fixedPriceRow.querySelectorAll('td')]
            .map(function (item) {
                return item.innerText;
            })

        let price = columns[1]

        if (price === "Expired" || price === "Declined") {
            continue
        }

        let resultItem = {}

        if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {
            resultItem['price'] = extractPrice(price)
        }

        resultItem['quantity'] = columns[2]
        resultItem['date'] = parseDate(columns[3])

        result.push(resultItem)
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

function parseSoldItemsPage(text) {
    let doc = new DOMParser().parseFromString(text, "text/html")

    let result = []
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

    return JSON.stringify(result);
}

function fillId(panel) {
    let idField = panel.querySelector('input#' + idFieldName)
    idField.value = location.pathname.match(/\/itm\/([0-9]+)/)[1];
}

function fillPrice(panel) {
    let priceField = panel.querySelector('input#' + priceFieldName)
    priceField.value = extractPrice((<HTMLElement>document.querySelector('div.x-price-primary span')).innerText)
}

function fillName(panel) {
    let nameField = panel.querySelector('input#' + nameFieldName)
    nameField.value = (<HTMLElement>document.querySelector('.vim h1')).innerText
}

function fillSeller(panel) {
    let sellerField = panel.querySelector('input#' + sellerFieldName)
    sellerField.value = (<HTMLElement>document.querySelector('div.x-sellercard-atf__info__about-seller a')).innerText.toLowerCase()
}

function fillCondition(panel) {
    let conditionField = panel.querySelector('input#' + conditionFieldName)
    conditionField.value = (<HTMLElement>document.querySelector('div.x-item-condition-text span.ux-textspans')).innerText
}

function fillConditionDescription(panel) {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc')
    if (conditionDescriptionElement != null) {
        let conditionDescriptionField = panel.querySelector('input#' + conditionDescriptionFieldName)
        conditionDescriptionField.value = (<HTMLElement>conditionDescriptionElement).innerText
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

function fillLocatedIn(panel) {
    let locatedInField = panel.querySelector('input#' + locatedInFieldName)
    locatedInField.value = (<HTMLElement>document.querySelector('div.ux-labels-values--legalShipping div.col-9')).innerText.split("Located in: ")[1]
}

function fillDescription(panel) {
    let descriptionUrl = (<HTMLIFrameElement>document.querySelector('#desc_ifr')).src
    fetchResource(descriptionUrl, {method: 'GET', credentials: 'include'})
        .then((response) => {
            response.text().then((text) => {
                panel.querySelector('input#' + descriptionFieldName).value = text
            }).catch((err) => {
                showError(err);
            })
        })
        .catch((err) => {
            showError(err)
        })
}

function fillPurchaseHistory(panel) {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
        .then((response) => {
            (<Response>response).text().then((text) => {
                panel.querySelector('input#' + purchaseHistoryFieldName).value = parseSoldItemsPage(text)

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

    let products = await client.getAllProducts()
    for (let i = 0; i < products.length; i++) {
        let opt = document.createElement('option');
        opt.value = products[i].id;
        opt.innerHTML = products[i].name;
        productField.appendChild(opt);
    }
}

async function fillPanelWithData(client) {
    let panel = <HTMLDivElement>document.querySelector('div.' + panelClass)
    fillId(panel);
    await fillProduct(panel, client);
    fillPrice(panel);
    fillName(panel);
    fillSeller(panel);
    fillCondition(panel);
    fillConditionDescription(panel);
    fillShipping(panel);
    fillLocatedIn(panel);
    fillDescription(panel);
    fillPurchaseHistory(panel);
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

function showError(error) {
    let errorDiv = document.querySelector('div.' + panelClass + ' #' + errorElementId)

    let span = document.createElement('span');
    span.innerHTML = error.stack;
    errorDiv.appendChild(span)
}

function enableSubmitButton() {
    (<HTMLButtonElement>document.querySelector('#' + submitId)).disabled = false
}

function getAuthorizeFetch(oAuth2Client: OAuth2Client) : FetchWrapperCustom {
    return  new FetchWrapperCustom({
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