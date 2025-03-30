import { ISiteProcessor } from './ISiteProcessor';
import {ClientsFactory} from "../clients/ClientsFactory";
import * as constants from '../constants';
import * as utils from "../infrastructure/Utils";

export function tryGetAuthPageProssor() : ISiteProcessor | null {
    if (document.location) {

        return new AuthPageProcessor();
    }
    return null;
}

class AuthPageProcessor implements ISiteProcessor {
    
    async run(): Promise<void> {
        
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
        let url = new URL(document.location.href)
        if (url.searchParams.has("code")) {

            let oAuth2Client = ebayOAuth2Client;

            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

            let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
                document.location.href,
                {
                    redirectUri: constants.Auth.ebayRedirectUriCode,
                    codeVerifier
                }
            );

            await chrome.storage.local.set({ebayTokenStore: JSON.stringify(oauth2Token)})

            let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

            if (returnPage) {
                await chrome.storage.local.set({return_page: null})
                document.location.href = returnPage;
            } else {
                document.location.href = constants.Auth.ebayRedirectUriCode
            }
        }
    }
    
}