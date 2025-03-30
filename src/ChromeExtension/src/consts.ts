// Секция цветов
export const Colors = {
    lightGray: "lightgray",
    lightGreen: "#ecffec",
    lightPink: "lightpink",
    lightYellow: "#e0e07f"
};

// Секция URL-адресов
export const Urls = {
    backendUrl: `https://tubessale.ddns.net/`,
    baseApiUrl: `https://tubessale.ddns.net/api/ebay/v1`,
    frappeBaseApiUrl: "https://tubessale.ddns.net:8081",
    extensionAuthRedirectUrl: `https://tubessale.ddns.net/chrome_extensions/auth`,
    frappeAuthRedirectUrl: `https://tubessale.ddns.net:8081/api/method/ebay.api.chrome_extension_auth_page.auth`,
    ebayAuthRedirectUrl: `https://www.ebay.com/`
};

// Секция авторизации
export const Auth = {
    ebayRedirectUriCode: "Artem_Petrov-ArtemPet-tubesS-dsrgu",
    ebayApiScope: "https://api.ebay.com/oauth/api_scope",
    backendApiScope: 'ServerAPI',
    frappeScope: 'all openid'
};

// Секция настроек
export const Settings = {
    extendedLogging: true,
    allItemsCacheIdentifier: "allProducts"
};

// Секция регулярных выражений для сайтов
export const RegexPatterns = {
    ebaySite: /(?:^|\.)ebay\.com$/i,
    chipFind: /(?:^|\.)chipfind\.ru$/i,
    avito: /(?:^|\.)avito\.ru$/i
};

// Группы сайтов
export const searchOnSites: RegExp[] = [
    RegexPatterns.avito,
    RegexPatterns.chipFind
];

export const workOnSites: RegExp[] = [
    ...searchOnSites,
    RegexPatterns.ebaySite,
    /^localhost$/i,
    /^localhost:8080$/i,
    /^localhost:8081$/i,
    /^tubessale\.ddns\.net$/i,
    /^tubessale\.ddns\.net:8080$/i,
    /^tubessale\.ddns\.net:8081$/i
];