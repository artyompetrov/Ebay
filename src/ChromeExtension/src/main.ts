import {
    EbayToolBackendClient,
    ClientErrorInfo,
} from "./clients/EbayToolBackendClient"

import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";
import {searchSitePages as searchSitePagesFunc} from "./searchSites";
import * as consts from "./consts";
import * as EbayToolBackend from "./clients/EbayToolBackendClient";


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

async function frappeExtensionAuthPage() {
    console.log("frappeExtensionAuthPage")

    let backendOAuth2Client = getFrappeOAuth2Client();
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
        await chrome.storage.local.set({frappeTokenStore: JSON.stringify(oauth2Token)})

        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage) {
            await chrome.storage.local.set({return_page: null})
            redirectWithoutReferer(returnPage);
        } else {
            document.location.href = extensionAuthRedirectUrl
        }
    }
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


// Получение OAuth2 клиента для eBay
function getEbayOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: "https://auth.ebay.com/",
        clientId: 'ArtemPet-tubesSea-PRD-63b5a5e64-416f2036',
        tokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        authorizationEndpoint: '/oauth2/authorize',
        clientSecret: "PRD-689869074719-68a0-4a78-9b78-8c3f",
        fetch: fetchResource
    });
}

// Получение OAuth2 клиента для Frappe
function getFrappeOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: frappeBaseApiUrl,
        clientId: 'rucemhiaqo',
        tokenEndpoint: '/api/method/frappe.integrations.oauth2.get_token',
        authorizationEndpoint: '/api/method/frappe.integrations.oauth2.authorize',
        //clientSecret: "3533fa9cf9",
        fetch: fetchResource
    });
}

// Получение OAuth2 клиента для бэкенда
function getBackendOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });
}

// Поиск по сайтам (обертка для функции из модуля searchSites)
async function searchSitePages() {
    await searchSitePagesFunc(fetchResource, _allItemsCacheIdentifier);
}

export async function run() {


    let authorizeFetch = getAuthorizeFetch(ebayOAuth2Client, consts.Auth.ebayApiScope, "ebayTokenStore", consts.Auth.ebayRedirectUriCode)
    let ebayOAuth2Client: OAuth2Client = getEbayOAuth2Client();
    let backendOAuth2Client: OAuth2Client = getBackendOAuth2Client();
    _ebayClient = new EbayClient.EbayClient("https://api.ebay.com/buy/browse/v1", authorizeFetch);
    let backendClient = new EbayToolBackend.EbayToolBackendClient(consts.Urls.baseApiUrl, getAuthorizeFetch(backendOAuth2Client, consts.Auth.backendApiScope, "ebayToolTokenStore", consts.Urls.extensionAuthRedirectUrl));

    if (!matchesAnyRegex(workOnSites, location.host))
        return;
    
    console.log("Ebay extension is active on this page");
    
    await saveCodeVerifier();

    let _ = checkForUpdates();

    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === frappeAuthRedirectUrl) {
        await frappeExtensionAuthPage();
    }
    else if (currentPage === extensionAuthRedirectUrl) {
        await extensionAuthPage();
    } else if (currentPage === ebayAuthRedirectUrl) {
        await ebayApiAuthPage();
    } else if (ebaySiteRegex.test(location.host)) {
        await ebayPages(currentPage);
    } else if (matchesAnyRegex(searchOnSites, location.host)) {
        await searchSitePages();
    }
}


async function saveCodeVerifier() {
    let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

    if (codeVerifier === null || codeVerifier === undefined) {
        let codeVerifier = await generateCodeVerifier();
        await chrome.storage.local.set({code_verifier: codeVerifier})
    }
}



run();