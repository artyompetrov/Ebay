import * as EbayClient from "./EbayClient"
import * as EbayToolWebApiClient from "./Generated/EbayToolWebApiClient";
import * as constants from '../constants';
import {generateCodeVerifier, OAuth2Client} from "@badgateway/oauth2-client";
import {fetchResource} from "../infrastructure/Utils";
import {FetchWrapperCustom} from "./FetchWrapperCustom";
import type {TelemetrySpan} from "../infrastructure/telemetry/PageTelemetry";
import {telemetry} from "../infrastructure/Telemetry";

/**
 * Parent of a client's calls: a span, or a function returning the current one (a polling client whose every
 * iteration is its own trace). Without it calls go under the current processor span or the page root span.
 */
export type SpanSource = TelemetrySpan | (() => TelemetrySpan | undefined);

/** Reads `chrome.storage.local`, recorded as a `storage get <keys>` span. */
function storageGet(keys: string[]): Promise<Record<string, any>> {
    return telemetry.withSpan(`storage get ${keys.join(', ')}`, {}, () => chrome.storage.local.get(keys));
}

/** Writes `chrome.storage.local`, recorded as a `storage set <keys>` span. */
function storageSet(items: Record<string, unknown>): Promise<void> {
    return telemetry.withSpan(`storage set ${Object.keys(items).join(', ')}`, {}, () => chrome.storage.local.set(items));
}

/** `fetch` whose calls are recorded as client spans under `parent`. */
function tracedFetch(parent?: SpanSource): typeof fetch {
    return (input: RequestInfo, init?: RequestInit) =>
        fetchResource(input, init ?? {}, typeof parent === 'function' ? parent() : parent);
}

export class ClientsFactory {
    async getEbaySettings(): Promise<{ clientId: string; clientSecret: string; redirectUriCode: string }> {
        const {
            ebay_client_id,
            ebay_client_secret,
            ebay_redirect_uri_code
        } = await storageGet(["ebay_client_id", "ebay_client_secret", "ebay_redirect_uri_code"]);
        
        if (ebay_client_id && ebay_client_secret && ebay_redirect_uri_code) {
            return {
                clientId: ebay_client_id,
                clientSecret: ebay_client_secret,
                redirectUriCode: ebay_redirect_uri_code
            };
        }
        
        else {
            alert("Missing ebay api credentials");
            throw new Error("Missing ebay api credentials");
        }
    }
    async saveCodeVerifier() {
        let codeVerifier = (await storageGet(["code_verifier"]))?.code_verifier;

        if (codeVerifier === null || codeVerifier === undefined) {
            let codeVerifier = await generateCodeVerifier();
            await storageSet({code_verifier: codeVerifier})
        }
    }

    async getBackendOAuth2Client(parent?: SpanSource): Promise<OAuth2Client> {
        await this.saveCodeVerifier();
        
        return new OAuth2Client({
            server: constants.Urls.backendUrl,
            clientId: constants.Auth.Backend.ClientId,
            tokenEndpoint:  constants.Auth.Backend.TokenEndpoint,
            authorizationEndpoint: constants.Auth.Backend.AuthorizationEndpoint,
            fetch: tracedFetch(parent)
        });
    }

    async getEbayOAuth2Client(parent?: SpanSource): Promise<OAuth2Client> {
        await this.saveCodeVerifier();
        const settings = await this.getEbaySettings();

        return new OAuth2Client({
            server: constants.Auth.Ebay.Server,
            clientId: settings.clientId,
            tokenEndpoint: constants.Auth.Ebay.TokenEndpoint,
            authorizationEndpoint: constants.Auth.Ebay.AuthorizationEndpoint,
            clientSecret: settings.clientSecret,
            fetch: tracedFetch(parent)
        })
    }

    /** Backend client whose calls are recorded under `parent` (by default the page root span). */
    async getEbayToolWebApiClient(parent?: SpanSource): Promise<EbayToolWebApiClient.EbayToolWebApiClient> {
        await storageSet({return_page: document.location.href});

        return new EbayToolWebApiClient.EbayToolWebApiClient(constants.Urls.backendUrl + 'api',
            this.getAuthorizeFetch(await this.getBackendOAuth2Client(parent), constants.Auth.Backend.Scope, "ebayToolTokenStore", constants.Urls.extensionAuthRedirectUrl, parent));

    }

    async getEbayToolBackendClient(parent?: SpanSource): Promise<EbayToolWebApiClient.EbayToolWebApiClient> {
        return this.getEbayToolWebApiClient(parent);
    }
    
    /** eBay API client whose calls are recorded under `parent` (by default the page root span). */
    async getEbayClient(parent?: SpanSource): Promise<EbayClient.EbayClient> {
        await storageSet({return_page: document.location.href});
        const settings = await this.getEbaySettings();

        return new EbayClient.EbayClient("https://api.ebay.com/buy/browse/v1",
            this.getAuthorizeFetch(await this.getEbayOAuth2Client(parent), constants.Auth.Ebay.Scope, "ebayTokenStore", settings.redirectUriCode, parent));

    }

    getAuthorizeFetch(oAuth2Client: OAuth2Client, scope: string, tokenStore: string, redirectUri: string, parent?: SpanSource): FetchWrapperCustom {
        return new FetchWrapperCustom({
            client: oAuth2Client,
            getNewToken: async () => {
                let codeVerifier = (await storageGet(["code_verifier"])).code_verifier;
                document.location.href = await oAuth2Client.authorizationCode.getAuthorizeUri({
                    redirectUri: redirectUri,
                    codeVerifier,
                    scope: [scope]
                });
                return null;
            },
            getStoredToken: async () => {
                if (constants.Urls.backendUrl !== (await storageGet(["backend_url"])).backend_url) return null;
                let token = (await storageGet([tokenStore]))[tokenStore];
                if (token) return JSON.parse(token);
                return null;
            },
            fetch: tracedFetch(parent)
        })
    }
}
