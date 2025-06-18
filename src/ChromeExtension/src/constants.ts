export const Colors = {
    lightGray: "lightgray",
    lightGreen: "rgb(166 255 166)",
    lightPink: "#f6cbd2",
    lightYellow: "#e5e582"
};

export const Urls = {
    backendUrl: `https://radiotubes.kz/`,
    extensionAuthRedirectUrl: `https://radiotubes.kz/chrome_extensions/auth`,
    ebayAuthRedirectUrl: `https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure`
};

export const Auth = {
    Ebay: {
        Server: "https://auth.ebay.com/",
        ClientId: 'ArtemPet-tubesSea-PRD-63b5a5e64-416f2036',
        TokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        AuthorizationEndpoint: "/oauth2/authorize",
        ClientSecret: "PRD-689869074719-68a0-4a78-9b78-8c3f",
        Scope: "https://api.ebay.com/oauth/api_scope",
        RedirectUriCode: "Artem_Petrov-ArtemPet-tubesS-hvzqfkk",
    },
    Backend: {
        TokenEndpoint: '/connect/token',
        AuthorizationEndpoint: '/connect/authorize',
        ClientId: 'Ebay.ChromeExtension',
        Scope: 'ServerAPI',
    }
};

export const Settings = {
    extendedLogging: true,
    interestingRevenueRub: 1000,
    interestingCountInStatistics: 3 /*если продано от 5-ти штук на ebay для репрезентативности*/
};