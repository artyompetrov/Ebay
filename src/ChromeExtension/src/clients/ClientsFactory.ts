import * as EbayClient from "../clients/EbayClient"
import * as EbayToolBackendClient from "../clients/EbayToolBackendClient";
import * as constants from '../constants';
import {generateCodeVerifier, OAuth2Client} from "@badgateway/oauth2-client";
import {fetchResource} from "../infrastructure/ChromeExtensionApi";
import {FetchWrapperCustom} from "./FetchWrapperCustom";

export class ClientsFactory {
    async saveCodeVerifier() {
        let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

        if (codeVerifier === null || codeVerifier === undefined) {
            let codeVerifier = await generateCodeVerifier();
            await chrome.storage.local.set({code_verifier: codeVerifier})
        }
    }

    async getBackendOAuth2Client(): Promise<OAuth2Client> {
        await this.saveCodeVerifier();
        
        return new OAuth2Client({
            server: constants.Urls.backendUrl,
            clientId: 'Ebay.ChromeExtension',
            tokenEndpoint: '/connect/token',
            authorizationEndpoint: '/connect/authorize',
            fetch: fetchResource
        });
    }

    async getEbayOAuth2Client(): Promise<OAuth2Client> {
        await this.saveCodeVerifier();
        
        return new OAuth2Client({
            server: constants.Urls.backendUrl,
            clientId: 'Ebay.ChromeExtension',
            tokenEndpoint: '/connect/token',
            authorizationEndpoint: '/connect/authorize',
            fetch: fetchResource
        })
    }

    async getEbayToolBackendClient(): Promise<EbayToolBackendClient.EbayToolBackendClient> {
        await chrome.storage.local.set({return_page: document.location.href});

        return new EbayToolBackendClient.EbayToolBackendClient(constants.Urls.baseApiUrl,
            this.getAuthorizeFetch(await this.getBackendOAuth2Client(), constants.Auth.backendApiScope, "ebayToolTokenStore", constants.Urls.extensionAuthRedirectUrl));

    }
    
    async getEbayClient(): Promise<EbayClient.EbayClient> {
        await chrome.storage.local.set({return_page: document.location.href});

        return new EbayClient.EbayClient("https://api.ebay.com/buy/browse/v1",
            this.getAuthorizeFetch(await this.getEbayOAuth2Client(), constants.Auth.ebayApiScope, "ebayTokenStore", constants.Auth.ebayRedirectUriCode));

    }

    getAuthorizeFetch(oAuth2Client: OAuth2Client, scope: string, tokenStore: string, redirectUri: string): FetchWrapperCustom {
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
                if (constants.Urls.backendUrl !== (await chrome.storage.local.get(["backend_url"])).backend_url) return null;
                let token = (await chrome.storage.local.get(tokenStore))[tokenStore];
                if (token) return JSON.parse(token);
                return null;
            },
            fetch: fetchResource
        })
    }
}