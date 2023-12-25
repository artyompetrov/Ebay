function createControlPanel() {
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
  
  /*const itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
  const domain = location.hostname;
  const div = document.createElement('div');
  div.style.cssText = `
	width: 300px;
	height: 50px;
	text-align: center;
	padding: 15px;
	border: 3px solid #0000cc;
	border-radius: 10px;
	color: #0000cc;
  `;

  return historyButton;*/
}

function addControlPanel() {
  const productTitleContainer = document.querySelector('.vim[data-testid="x-item-title"]');
  if (productTitleContainer) {
    const existingButton = productTitleContainer.querySelector('a.history-button');
    if (!existingButton) {
      const historyButton = createControlPanel();
      productTitleContainer.appendChild(historyButton);
    }
  }
}

addControlPanel();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	addControlPanel();
});