document.addEventListener('DOMContentLoaded', async () => {
    const {ebay_client_id, ebay_client_secret, ebay_redirect_uri_code} = await chrome.storage.local.get(["ebay_client_id", "ebay_client_secret", "ebay_redirect_uri_code"]);
    (document.getElementById('clientId') as HTMLInputElement).value = ebay_client_id ?? '';
    (document.getElementById('clientSecret') as HTMLInputElement).value = ebay_client_secret ?? '';
    (document.getElementById('redirectUriCode') as HTMLInputElement).value = ebay_redirect_uri_code ?? '';
});

function save() {
    const clientId = (document.getElementById('clientId') as HTMLInputElement).value;
    const clientSecret = (document.getElementById('clientSecret') as HTMLInputElement).value;
    const redirectUriCode = (document.getElementById('redirectUriCode') as HTMLInputElement).value;
    chrome.storage.local.set({
        ebay_client_id: clientId,
        ebay_client_secret: clientSecret,
        ebay_redirect_uri_code: redirectUriCode
    });
}

document.getElementById('save')?.addEventListener('click', save);
