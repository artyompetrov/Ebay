import { ISiteProcessor } from './ISiteProcessor';
import {ClientsFactory} from "../clients/ClientsFactory";
import * as constants from '../constants';
import * as utils from "../infrastructure/Utils";

export function tryGetAuthPageProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname
    
    if (currentPage === constants.Urls.extensionAuthRedirectUrl || currentPage === constants.Urls.ebayAuthRedirectUrl) {

        return new AuthPageProcessor();
    }
    return null;
}


class AuthPageProcessor implements ISiteProcessor {
    breakAfterSearchProcessor: boolean = true;
    async run(): Promise<void> {
        let currentPage = location.protocol + '//' + location.host + location.pathname
        if (currentPage === constants.Urls.extensionAuthRedirectUrl) {
            await this.extensionAuthPage();
        } else if (currentPage === constants.Urls.ebayAuthRedirectUrl) {
            await this.ebayApiAuthPage();
        }
    }

    async  extensionAuthPage() {
        console.log("extensionAuthPage")
        let clientsFactory = new ClientsFactory();
        let backendOAuth2Client = await clientsFactory.getBackendOAuth2Client();
        let url = new URL(document.location.href)
        if (url.searchParams.has("code")) {
            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

            let oauth2Token = await backendOAuth2Client.authorizationCode.getTokenFromCodeRedirect(
                document.location.href,
                {
                    redirectUri: constants.Urls.extensionAuthRedirectUrl,
                    codeVerifier
                }
            );

            await chrome.storage.local.set({backend_url: constants.Urls.backendUrl})
            await chrome.storage.local.set({ebayToolTokenStore: JSON.stringify(oauth2Token)})

            let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

            if (returnPage) {
                await chrome.storage.local.set({return_page: null})
                utils.redirectWithoutReferer(returnPage);
            } else {
                document.location.href = constants.Urls.extensionAuthRedirectUrl
            }
        }
    }
    
    async  ebayApiAuthPage() {
        console.log("ebayApiAuthPage")
        let clientsFactory = new ClientsFactory();
        let ebayOAuth2Client = await clientsFactory.getEbayOAuth2Client();
        const settings = await clientsFactory.getEbaySettings();
        let url = new URL(document.location.href)
        if (url.searchParams.has("code")) {

            let oAuth2Client = ebayOAuth2Client;

            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

            let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
                document.location.href,
                {
                    redirectUri: settings.redirectUriCode,
                    codeVerifier
                }
            );

            await chrome.storage.local.set({ebayTokenStore: JSON.stringify(oauth2Token)})

            let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

            if (returnPage) {
                await chrome.storage.local.set({return_page: null})
                document.location.href = returnPage;
            }
        }
    }
    
}
