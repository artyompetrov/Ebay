export const Colors = {
    lightGray: "lightgray",
    lightGreen: "rgb(166 255 166)",
    lightPink: "#f6cbd2",
    lightYellow: "#e5e582"
};

declare const EBAY_HELPER_BACKEND_DOMAIN: string;
const backendBaseUrl = `https://${EBAY_HELPER_BACKEND_DOMAIN}`.replace(/\/$/, '');

export const Urls = {
    backendUrl: `${backendBaseUrl}/`,
    extensionAuthRedirectUrl: `${backendBaseUrl}/chrome_extensions/auth`,
    ebayAuthRedirectUrl: `https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure`
};

export const Auth = {
    Ebay: {
        Server: "https://auth.ebay.com/",
        TokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        AuthorizationEndpoint: "/oauth2/authorize",
        Scope: "https://api.ebay.com/oauth/api_scope",
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
