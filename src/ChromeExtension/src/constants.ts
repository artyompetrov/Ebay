export const Colors = {
    lightGray: "lightgray",
    lightGreen: "rgb(166 255 166)",
    lightPink: "#f6cbd2",
    lightYellow: "#e5e582"
};

declare const BACKEND_DOMAIN: string;
declare const EBAY_CLIENT_ID: string;
declare const EBAY_CLIENT_SECRET: string;
declare const EBAY_REDIRECT_URI_CODE: string;
const backendBaseUrl = `https://${BACKEND_DOMAIN}`.replace(/\/$/, '');

export const Urls = {
    backendUrl: `${backendBaseUrl}/`,
    extensionAuthRedirectUrl: `${backendBaseUrl}/chrome_extensions/auth`,
    ebayAuthRedirectUrl: `https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure`
};

export const Auth = {
    Ebay: {
        Server: "https://auth.ebay.com/",
        ClientId: EBAY_CLIENT_ID,
        TokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        AuthorizationEndpoint: "/oauth2/authorize",
        ClientSecret: EBAY_CLIENT_SECRET,
        Scope: "https://api.ebay.com/oauth/api_scope",
        RedirectUriCode: EBAY_REDIRECT_URI_CODE,
    },
    Backend: {
        TokenEndpoint: '/connect/token',
        AuthorizationEndpoint: '/connect/authorize',
        ClientId: 'Ebay.ChromeExtension',
        Scope: 'ServerAPI',
    }
};

export const Settings = {
    extendedLogging: true
};