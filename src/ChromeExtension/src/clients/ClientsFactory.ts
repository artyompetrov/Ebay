import * as EbayClient from "./EbayClient"
import * as EbayToolBackendClient from "./Generated/EbayToolBackendClient";
import * as constants from '../constants';
import {generateCodeVerifier, OAuth2Client} from "@badgateway/oauth2-client";
import {fetchResource} from "../infrastructure/Utils";
import {FetchWrapperCustom} from "./FetchWrapperCustom";

export class ClientsFactory {
    async getEbaySettings(): Promise<{ clientId: string; clientSecret: string; redirectUriCode: string }> {
        const {ebay_client_id, ebay_client_secret, ebay_redirect_uri_code} = await chrome.storage.local.get(["ebay_client_id", "ebay_client_secret", "ebay_redirect_uri_code"]);
        return {
            clientId: ebay_client_id ?? "",
            clientSecret: ebay_client_secret ?? "",
            redirectUriCode: ebay_redirect_uri_code ?? ""
        };
    }
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
            clientId: constants.Auth.Backend.ClientId,
            tokenEndpoint:  constants.Auth.Backend.TokenEndpoint,
            authorizationEndpoint: constants.Auth.Backend.AuthorizationEndpoint,
            fetch: fetchResource
        });
    }

    async getEbayOAuth2Client(): Promise<OAuth2Client> {
        await this.saveCodeVerifier();
        const settings = await this.getEbaySettings();

        return new OAuth2Client({
            server: constants.Auth.Ebay.Server,
            clientId: settings.clientId,
            tokenEndpoint: constants.Auth.Ebay.TokenEndpoint,
            authorizationEndpoint: constants.Auth.Ebay.AuthorizationEndpoint,
            clientSecret: settings.clientSecret,
            fetch: fetchResource
        })
    }

    async getEbayToolBackendClient(): Promise<EbayToolBackendClient.EbayToolBackendClient> {
        await chrome.storage.local.set({return_page: document.location.href});

        return new EbayToolBackendClient.EbayToolBackendClient(constants.Urls.backendUrl + 'api/ebay/v1',
            this.getAuthorizeFetch(await this.getBackendOAuth2Client(), constants.Auth.Backend.Scope, "ebayToolTokenStore", constants.Urls.extensionAuthRedirectUrl));

    }
    
    async getEbayClient(): Promise<EbayClient.EbayClient> {
        await chrome.storage.local.set({return_page: document.location.href});
        const settings = await this.getEbaySettings();

        return new EbayClient.EbayClient("https://api.ebay.com/buy/browse/v1",
            this.getAuthorizeFetch(await this.getEbayOAuth2Client(), constants.Auth.Ebay.Scope, "ebayTokenStore", settings.redirectUriCode));

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
