const panelClass = "panel-div";
const idFieldName = "id";
const nameFieldName = "name";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const descriptionFieldName = "description";
const conditionFieldName = "condition";
const conditionDescriptionFieldName = "conditionDescription";
const sellerFieldName = "seller";
const purchaseHistoryFieldName = "purchaseHistory";
const errorElementId = "errorElement"
const submitId = "submit"

function fetchResource(input, init) {
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

function createHistoryButton() {
  const itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
  const domain = location.hostname;
  const historyButton = document.createElement('a');
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

function createPanel(bodyElement) {
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
    
    .${panelClass} label:after { content: ": " }
`

  let styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  bodyElement.appendChild(styleSheet)
  
  let div = document.createElement('div');
  div.classList.add(panelClass);

  // language=HTML
  div.innerHTML = `
    <form action="">
      <label for="${idFieldName}">Id</label>
      <input id="${idFieldName}" type="number" name="${idFieldName}" readonly/>
      <br>
      <label for="${nameFieldName}">Name</label>
      <input id="${nameFieldName}" type="text" name="${nameFieldName}" readonly/>
      <br>
      <label for="${pcsFieldName}">PCS</label>
      <input id="${pcsFieldName}" type="text" name="${pcsFieldName}"/>
      <br>
      <label for="${priceFieldName}">Price US$</label>
      <input id="${priceFieldName}" type="text" name="${priceFieldName}"/>
      <br>
      <label for="${shippingFieldName}">Shipping to Germany</label>
      <input id="${shippingFieldName}" type="number" name="${shippingFieldName}"/>
      <br>
      <label for="${shippingAdditionalFieldName}">Shipping each additional</label>
      <input id="${shippingAdditionalFieldName}" type="number" name="${shippingAdditionalFieldName}"/>
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
      <div style="color: red;" id="${errorElementId}"></div>
      <br>
      <input id="${submitId}" type="submit" value="Save" disabled/>
    </form>`;
  
  bodyElement.appendChild(div);
}

async function fillPanelWithData() {
  let panel = document.querySelector('div.' + panelClass)

  let idField = panel.querySelector('input#' + idFieldName)
  let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
  idField.value = itemId;

  let priceField = panel.querySelector('input#' + priceFieldName)
  priceField.value = document.querySelector('div.x-price-primary span').innerText
      .match(/\d+(?:[,.]\d+)?/)[0].replace(',', '.')

  let nameField = panel.querySelector('input#' + nameFieldName)
  nameField.value = document.querySelector('.vim h1').innerText

  //todo seller не всегда правильно извлекается https://www.ebay.com/itm/134867374969?hash=item1f66b8d379:g:OfAAAOSwVNdk8KwU&amdata=enc%3AAQAIAAAA0OSeqn%2FREw2KNs1dcGci6e45%2BHSI4nHITB00b0YOLxopb9NaCJe4R1BkOVYt6oXtBq0fjrejU85j0r8xKlug21XYny77DuN%2FJCmqOOSkNbG5PX1fBEGNbHCLdnDTqUaQsbTBVFoENEuoZxnh8raR3cVLSY%2FIQxJqYy%2B6G%2BNkm%2FoBpTnRKW1GHokeC5RpydqA8I2A%2FvWvuOw6Bdc1y6VgaB2E%2FLp%2FcgTLhErIDCiZciNo9KeDMM%2Fd1NqR73YOS7XEDGQqwpMgU84A9k5tU3sokKE%3D%7Ctkp%3ABFBMhM-fmJZj
  let sellerField = panel.querySelector('input#' + sellerFieldName)
  sellerField.value = document.querySelector('div.x-sellercard-atf__info__about-seller a').innerText.toLowerCase()
  
  let conditionField = panel.querySelector('input#' + conditionFieldName)
  conditionField.value = document.querySelector('div.x-item-condition-text span.ux-textspans').innerText
  
  let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc')
  if (conditionDescriptionElement != null) {
    let conditionDescriptionField = panel.querySelector('input#' + conditionDescriptionFieldName)
    conditionDescriptionField.value = conditionDescriptionElement.innerText
        .replace('“', '')
        .replace('”', '')
  }

  let shippingField = panel.querySelector('input#' + shippingFieldName)
  let shippingAdditionalField = panel.querySelector('input#' + shippingAdditionalFieldName)

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
    shippingField.value = shippingValue.match(/\d+(?:[,.]\d+)?/)[0].replace(',', '.')

    if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {
      shippingAdditionalField.value = shippingMaxviewValues['Each additional item']
          .match(/\d+(?:[,.]\d+)?/)[0]
          .replace(',', '.')
    } else {
      shippingAdditionalField.value = 0;
    }

  } else {
    shippingField.value = 0;
    shippingAdditionalField.value = 0;
  }

  //todo добавить извлечение located in
  //todo количество отзывов у пользователя
  
  // далее ассинхронные запросы

  let descriptionUrl = document.querySelector('#desc_ifr').src
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

  let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
  fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
      .then((response) => {
        response.text().then((text) => {
          panel.querySelector('input#' + purchaseHistoryFieldName).value = text
        }).catch((err) => {
          showError(err);
        })
      })
      .catch((err) => {
        showError(err)
      })
}



function addPanel() {
  let bodyElement = document.querySelector('body');
  if (bodyElement) {
    let existingPanel = bodyElement.querySelector('div.'+panelClass );
    if (!existingPanel) {
      createPanel(bodyElement);
    }
  }
}

function showError(error) {
  let errorDiv = document.querySelector('div.' + panelClass + ' #' + errorElementId)
  
  let span = document.createElement('span');
  span.innerHTML = error;
  errorDiv.appendChild(span)
}

function enableSubmitButton() {
  document.querySelector('#' + submitId).disabled = false
}

async function run() {
  
  try {
    addHistoryButton();
    addPanel();
    await fillPanelWithData();
    //todo разрешать только если вообще нет ошибок
    enableSubmitButton()
  }
  catch (error) {
    showError(error);
  }
}

run();

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  await run();
});