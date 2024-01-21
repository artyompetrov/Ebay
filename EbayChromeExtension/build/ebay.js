/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@badgateway/oauth2-client/browser/oauth2-client.min.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@badgateway/oauth2-client/browser/oauth2-client.min.js ***!
  \*****************************************************************************/
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(()=>(()=>{var e={934:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.generateQueryString=t.OAuth2Client=void 0;const n=r(443),i=r(618);function o(e,t){return new URL(e,t).toString()}function s(e){return new URLSearchParams(Object.fromEntries(Object.entries(e).filter((([e,t])=>void 0!==t)))).toString()}t.OAuth2Client=class{constructor(e){this.discoveryDone=!1,this.serverMetadata=null,(null==e?void 0:e.fetch)||(e.fetch=fetch.bind(globalThis)),this.settings=e}async refreshToken(e){if(!e.refreshToken)throw new Error("This token didn't have a refreshToken. It's not possible to refresh this");const t={grant_type:"refresh_token",refresh_token:e.refreshToken};return this.settings.clientSecret||(t.client_id=this.settings.clientId),this.tokenResponseToOAuth2Token(this.request("tokenEndpoint",t))}async clientCredentials(e){var t;const r=["client_id","client_secret","grant_type","scope"];if((null==e?void 0:e.extraParams)&&Object.keys(e.extraParams).filter((e=>r.includes(e))).length>0)throw new Error(`The following extraParams are disallowed: '${r.join("', '")}'`);const n={grant_type:"client_credentials",scope:null===(t=null==e?void 0:e.scope)||void 0===t?void 0:t.join(" "),...null==e?void 0:e.extraParams};if(!this.settings.clientSecret)throw new Error("A clientSecret must be provided to use client_credentials");return this.tokenResponseToOAuth2Token(this.request("tokenEndpoint",n))}async password(e){var t;const r={grant_type:"password",...e,scope:null===(t=e.scope)||void 0===t?void 0:t.join(" ")};return this.tokenResponseToOAuth2Token(this.request("tokenEndpoint",r))}get authorizationCode(){return new i.OAuth2AuthorizationCodeClient(this)}async introspect(e){const t={token:e.accessToken,token_type_hint:"access_token"};return this.request("introspectionEndpoint",t)}async getEndpoint(e){if(void 0!==this.settings[e])return o(this.settings[e],this.settings.server);if("discoveryEndpoint"!==e&&(await this.discover(),void 0!==this.settings[e]))return o(this.settings[e],this.settings.server);if(!this.settings.server)throw new Error(`Could not determine the location of ${e}. Either specify ${e} in the settings, or the "server" endpoint to let the client discover it.`);switch(e){case"authorizationEndpoint":return o("/authorize",this.settings.server);case"tokenEndpoint":return o("/token",this.settings.server);case"discoveryEndpoint":return o("/.well-known/oauth-authorization-server",this.settings.server);case"introspectionEndpoint":return o("/introspect",this.settings.server)}}async discover(){var e;if(this.discoveryDone)return;let t;this.discoveryDone=!0;try{t=await this.getEndpoint("discoveryEndpoint")}catch(e){return void console.warn('[oauth2] OAuth2 discovery endpoint could not be determined. Either specify the "server" or "discoveryEndpoint')}const r=await this.settings.fetch(t,{headers:{Accept:"application/json"}});if(!r.ok)return;if(!(null===(e=r.headers.get("Content-Type"))||void 0===e?void 0:e.startsWith("application/json")))return void console.warn("[oauth2] OAuth2 discovery endpoint was not a JSON response. Response is ignored");this.serverMetadata=await r.json();const n=[["authorization_endpoint","authorizationEndpoint"],["token_endpoint","tokenEndpoint"],["introspection_endpoint","introspectionEndpoint"]];if(null!==this.serverMetadata){for(const[e,r]of n)this.serverMetadata[e]&&(this.settings[r]=o(this.serverMetadata[e],t));this.serverMetadata.token_endpoint_auth_methods_supported&&!this.settings.authenticationMethod&&(this.settings.authenticationMethod=this.serverMetadata.token_endpoint_auth_methods_supported[0])}}async request(e,t){const r=await this.getEndpoint(e),i={"Content-Type":"application/x-www-form-urlencoded"};let o=this.settings.authenticationMethod;switch(o||(o=this.settings.clientSecret?"client_secret_basic":"client_secret_post"),o){case"client_secret_basic":i.Authorization="Basic "+btoa(this.settings.clientId+":"+this.settings.clientSecret);break;case"client_secret_post":t.client_id=this.settings.clientId,this.settings.clientSecret&&(t.client_secret=this.settings.clientSecret);break;default:throw new Error("Authentication method not yet supported:"+o+". Open a feature request if you want this!")}const a=await this.settings.fetch(r,{method:"POST",body:s(t),headers:i});if(a.ok)return await a.json();let c,h,u;throw a.headers.has("Content-Type")&&a.headers.get("Content-Type").startsWith("application/json")&&(c=await a.json()),(null==c?void 0:c.error)?(h="OAuth2 error "+c.error+".",c.error_description&&(h+=" "+c.error_description),u=c.error):(h="HTTP Error "+a.status+" "+a.statusText,401===a.status&&this.settings.clientSecret&&(h+=". It's likely that the clientId and/or clientSecret was incorrect"),u=null),new n.OAuth2Error(h,u,a.status)}tokenResponseToOAuth2Token(e){return e.then((e=>{var t;return{accessToken:e.access_token,expiresAt:e.expires_in?Date.now()+1e3*e.expires_in:null,refreshToken:null!==(t=e.refresh_token)&&void 0!==t?t:null}}))}},t.generateQueryString=s},618:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCodeChallenge=t.generateCodeVerifier=t.OAuth2AuthorizationCodeClient=void 0;const n=r(934),i=r(443);async function o(e){const t=s();if(null==t?void 0:t.subtle)return["S256",c(await t.subtle.digest("SHA-256",a(e)))];{const t=r(212).createHash("sha256");return t.update(a(e)),["S256",t.digest("base64url")]}}function s(){if("undefined"!=typeof window&&window.crypto)return window.crypto;if("undefined"!=typeof self&&self.crypto)return self.crypto;const e=r(212);return e.webcrypto?e.webcrypto:null}function a(e){const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=255&e.charCodeAt(r);return t}function c(e){return btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}t.OAuth2AuthorizationCodeClient=class{constructor(e){this.client=e}async getAuthorizeUri(e){const[t,r]=await Promise.all([e.codeVerifier?o(e.codeVerifier):void 0,this.client.getEndpoint("authorizationEndpoint")]);let i={client_id:this.client.settings.clientId,response_type:"code",redirect_uri:e.redirectUri,code_challenge_method:null==t?void 0:t[0],code_challenge:null==t?void 0:t[1]};e.state&&(i.state=e.state),e.scope&&(i.scope=e.scope.join(" "));const s=Object.keys(i);if((null==e?void 0:e.extraParams)&&Object.keys(e.extraParams).filter((e=>s.includes(e))).length>0)throw new Error(`The following extraParams are disallowed: '${s.join("', '")}'`);return i={...i,...null==e?void 0:e.extraParams},r+"?"+(0,n.generateQueryString)(i)}async getTokenFromCodeRedirect(e,t){const{code:r}=await this.validateResponse(e,{state:t.state});return this.getToken({code:r,redirectUri:t.redirectUri,codeVerifier:t.codeVerifier})}async validateResponse(e,t){var r;const n=new URL(e).searchParams;if(n.has("error"))throw new i.OAuth2Error(null!==(r=n.get("error_description"))&&void 0!==r?r:"OAuth2 error",n.get("error"),0);if(!n.has("code"))throw new Error(`The url did not contain a code parameter ${e}`);if(t.state&&t.state!==n.get("state"))throw new Error(`The "state" parameter in the url did not match the expected value of ${t.state}`);return{code:n.get("code"),scope:n.has("scope")?n.get("scope").split(" "):void 0}}async getToken(e){const t={grant_type:"authorization_code",code:e.code,redirect_uri:e.redirectUri,code_verifier:e.codeVerifier};return this.client.tokenResponseToOAuth2Token(this.client.request("tokenEndpoint",t))}},t.generateCodeVerifier=async function(){const e=s();if(e){const t=new Uint8Array(32);return e.getRandomValues(t),c(t)}{const e=r(212);return new Promise(((t,r)=>{e.randomBytes(32,((e,n)=>{e&&r(e),t(n.toString("base64url"))}))}))}},t.getCodeChallenge=o},443:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OAuth2Error=void 0;class r extends Error{constructor(e,t,r){super(e),this.oauth2Code=t,this.httpCode=r}}t.OAuth2Error=r},13:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OAuth2Fetch=void 0,t.OAuth2Fetch=class{constructor(e){this.token=null,this.activeGetStoredToken=null,this.activeRefresh=null,this.refreshTimer=null,void 0===(null==e?void 0:e.scheduleRefresh)&&(e.scheduleRefresh=!0),this.options=e,e.getStoredToken&&(this.activeGetStoredToken=(async()=>{this.token=await e.getStoredToken(),this.activeGetStoredToken=null})()),this.scheduleRefresh()}async fetch(e,t){const r=new Request(e,t);return this.mw()(r,(e=>fetch(e)))}mw(){return async(e,t)=>{const r=await this.getAccessToken();let n=e.clone();n.headers.set("Authorization","Bearer "+r);let i=await t(n);if(!i.ok&&401===i.status){const r=await this.refreshToken();n=e.clone(),n.headers.set("Authorization","Bearer "+r.accessToken),i=await t(n)}return i}}async getToken(){return this.token&&(null===this.token.expiresAt||this.token.expiresAt>Date.now())?this.token:this.refreshToken()}async getAccessToken(){return await this.activeGetStoredToken,(await this.getToken()).accessToken}async refreshToken(){var e,t;if(this.activeRefresh)return this.activeRefresh;const r=this.token;this.activeRefresh=(async()=>{var e,t;let n=null;try{(null==r?void 0:r.refreshToken)&&(n=await this.options.client.refreshToken(r))}catch(e){console.warn("[oauth2] refresh token not accepted, we'll try reauthenticating")}if(n||(n=await this.options.getNewToken()),!n){const r=new Error("Unable to obtain OAuth2 tokens, a full reauth may be needed");throw null===(t=(e=this.options).onError)||void 0===t||t.call(e,r),r}return n})();try{const r=await this.activeRefresh;return this.token=r,null===(t=(e=this.options).storeToken)||void 0===t||t.call(e,r),this.scheduleRefresh(),r}catch(e){throw this.options.onError&&this.options.onError(e),e}finally{this.activeRefresh=null}}scheduleRefresh(){var e;if(!this.options.scheduleRefresh)return;if(this.refreshTimer&&(clearTimeout(this.refreshTimer),this.refreshTimer=null),!(null===(e=this.token)||void 0===e?void 0:e.expiresAt)||!this.token.refreshToken)return;const t=this.token.expiresAt-Date.now();t<12e4||(this.refreshTimer=setTimeout((async()=>{try{await this.refreshToken()}catch(e){console.error("[fetch-mw-oauth2] error while doing a background OAuth2 auto-refresh",e)}}),t-6e4))}}},212:()=>{}},t={};function r(n){var i=t[n];if(void 0!==i)return i.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,r),o.exports}var n={};return(()=>{"use strict";var e=n;Object.defineProperty(e,"__esModule",{value:!0}),e.OAuth2Error=e.OAuth2Fetch=e.generateCodeVerifier=e.OAuth2AuthorizationCodeClient=e.OAuth2Client=void 0;var t=r(934);Object.defineProperty(e,"OAuth2Client",{enumerable:!0,get:function(){return t.OAuth2Client}});var i=r(618);Object.defineProperty(e,"OAuth2AuthorizationCodeClient",{enumerable:!0,get:function(){return i.OAuth2AuthorizationCodeClient}}),Object.defineProperty(e,"generateCodeVerifier",{enumerable:!0,get:function(){return i.generateCodeVerifier}});var o=r(13);Object.defineProperty(e,"OAuth2Fetch",{enumerable:!0,get:function(){return o.OAuth2Fetch}});var s=r(443);Object.defineProperty(e,"OAuth2Error",{enumerable:!0,get:function(){return s.OAuth2Error}})})(),n})()));
//# sourceMappingURL=oauth2-client.min.js.map

/***/ }),

/***/ "./EbayClient/EbayClient.ts":
/*!**********************************!*\
  !*** ./EbayClient/EbayClient.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.20.0.0 (NJsonSchema v10.9.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiException = exports.Errors = exports.ValidationProblemDetails = exports.ProblemDetails = exports.PurchaseInfo = exports.LotInfo = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming
class Client {
    constructor(baseUrl, http) {
        this.jsonParseReviver = undefined;
        this.http = http ? http : window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "/api/ebay/v1";
    }
    /**
     * List all products
     * @return OK
     */
    getAllProducts() {
        let url_ = this.baseUrl + "/products";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetAllProducts(_response);
        });
    }
    processGetAllProducts(response) {
        const status = response.status;
        let _headers = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => _headers[k] = v);
        }
        ;
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200 = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                if (Array.isArray(resultData200)) {
                    result200 = [];
                    for (let item of resultData200)
                        result200.push(ProductWithId.fromJS(item));
                }
                else {
                    result200 = null;
                }
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve(null);
    }
    /**
     * Create product
     * @return Updated
     */
    createProduct(product) {
        let url_ = this.baseUrl + "/products";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(product);
        let options_ = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processCreateProduct(_response);
        });
    }
    processCreateProduct(response) {
        const status = response.status;
        let _headers = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => _headers[k] = v);
        }
        ;
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200 = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = resultData200 !== undefined ? resultData200 : null;
                return result200;
            });
        }
        else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400 = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = ValidationProblemDetails.fromJS(resultData400);
                return throwException("Error", status, _responseText, _headers, result400);
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve(null);
    }
    /**
     * Update product
     * @return Updated
     */
    updateProduct(product, id) {
        let url_ = this.baseUrl + "/products/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(product);
        let options_ = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processUpdateProduct(_response);
        });
    }
    processUpdateProduct(response) {
        const status = response.status;
        let _headers = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => _headers[k] = v);
        }
        ;
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        }
        else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400 = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = ValidationProblemDetails.fromJS(resultData400);
                return throwException("Error", status, _responseText, _headers, result400);
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve(null);
    }
    /**
     * Delete product
     * @return Deleted
     */
    deleteProduct(id) {
        let url_ = this.baseUrl + "/products/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "DELETE",
            headers: {}
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processDeleteProduct(_response);
        });
    }
    processDeleteProduct(response) {
        const status = response.status;
        let _headers = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => _headers[k] = v);
        }
        ;
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve(null);
    }
    /**
     * Обновляет информацию о лоте
     * @return Ok
     */
    upsertLotInfo(lotInfo, productId) {
        let url_ = this.baseUrl + "/products/{productId}/lots/";
        if (productId === undefined || productId === null)
            throw new Error("The parameter 'productId' must be defined.");
        url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(lotInfo);
        let options_ = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processUpsertLotInfo(_response);
        });
    }
    processUpsertLotInfo(response) {
        const status = response.status;
        let _headers = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => _headers[k] = v);
        }
        ;
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve(null);
    }
}
exports.Client = Client;
class ProductWithoutId {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
    }
    init(_data) {
        if (_data) {
            this.name = _data["Name"];
            this.searchQuery = _data["SearchQuery"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ProductWithoutId();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["Name"] = this.name;
        data["SearchQuery"] = this.searchQuery;
        return data;
    }
}
exports.ProductWithoutId = ProductWithoutId;
class ProductWithId {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
    }
    init(_data) {
        if (_data) {
            this.id = _data["Id"];
            this.name = _data["Name"];
            this.searchQuery = _data["SearchQuery"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ProductWithId();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["Id"] = this.id;
        data["Name"] = this.name;
        data["SearchQuery"] = this.searchQuery;
        return data;
    }
}
exports.ProductWithId = ProductWithId;
class LotInfo {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
        if (!data) {
            this.purchaseHistory = [];
        }
    }
    init(_data) {
        if (_data) {
            this.lotId = _data["lotId"];
            this.name = _data["name"];
            this.pcs = _data["pcs"];
            this.price = _data["price"];
            this.shipping = _data["shipping"];
            this.shippingAdditional = _data["shippingAdditional"];
            this.description = _data["description"];
            this.condition = _data["condition"];
            this.conditionDescription = _data["conditionDescription"];
            this.seller = _data["seller"];
            this.locatedIn = _data["locatedIn"];
            if (Array.isArray(_data["purchaseHistory"])) {
                this.purchaseHistory = [];
                for (let item of _data["purchaseHistory"])
                    this.purchaseHistory.push(PurchaseInfo.fromJS(item));
            }
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new LotInfo();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["lotId"] = this.lotId;
        data["name"] = this.name;
        data["pcs"] = this.pcs;
        data["price"] = this.price;
        data["shipping"] = this.shipping;
        data["shippingAdditional"] = this.shippingAdditional;
        data["description"] = this.description;
        data["condition"] = this.condition;
        data["conditionDescription"] = this.conditionDescription;
        data["seller"] = this.seller;
        data["locatedIn"] = this.locatedIn;
        if (Array.isArray(this.purchaseHistory)) {
            data["purchaseHistory"] = [];
            for (let item of this.purchaseHistory)
                data["purchaseHistory"].push(item.toJSON());
        }
        return data;
    }
}
exports.LotInfo = LotInfo;
class PurchaseInfo {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
    }
    init(_data) {
        if (_data) {
            this.price = _data["price"];
            this.quantity = _data["quantity"];
            this.date = _data["date"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new PurchaseInfo();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["price"] = this.price;
        data["quantity"] = this.quantity;
        data["date"] = this.date;
        return data;
    }
}
exports.PurchaseInfo = PurchaseInfo;
class ProblemDetails {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
    }
    init(_data) {
        if (_data) {
            this.type = _data["type"];
            this.title = _data["title"];
            this.status = _data["status"];
            this.detail = _data["detail"];
            this.instance = _data["instance"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        throw new Error("The abstract class 'ProblemDetails' cannot be instantiated.");
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["type"] = this.type;
        data["title"] = this.title;
        data["status"] = this.status;
        data["detail"] = this.detail;
        data["instance"] = this.instance;
        return data;
    }
}
exports.ProblemDetails = ProblemDetails;
class ValidationProblemDetails extends ProblemDetails {
    constructor(data) {
        super(data);
    }
    init(_data) {
        super.init(_data);
        if (_data) {
            this.errors = _data["errors"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ValidationProblemDetails();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["errors"] = this.errors;
        super.toJSON(data);
        return data;
    }
}
exports.ValidationProblemDetails = ValidationProblemDetails;
class Errors {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
    }
    init(_data) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new Errors();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        return data;
    }
}
exports.Errors = Errors;
class ApiException extends Error {
    constructor(message, status, response, headers, result) {
        super();
        this.isApiException = true;
        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }
    static isApiException(obj) {
        return obj.isApiException === true;
    }
}
exports.ApiException = ApiException;
function throwException(message, status, response, headers, result) {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}


/***/ }),

/***/ "./FetchWrapperCustom.ts":
/*!*******************************!*\
  !*** ./FetchWrapperCustom.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FetchWrapperCustom = void 0;
class FetchWrapperCustom {
    constructor(options) {
        /**
         * Current active token (if any)
         */
        this.token = null;
        /**
         * If the user had a storedToken, the process to fetch it
         * may be async. We keep track of this process in this
         * promise, so it may be awaited to avoid race conditions.
         *
         * As soon as this promise resolves, this property get nulled.
         */
        this.activeGetStoredToken = null;
        /**
         * Keeping track of an active refreshToken operation.
         *
         * This will allow us to ensure only 1 such operation happens at any
         * given time.
         */
        this.activeRefresh = null;
        /**
         * Timer trigger for the next automated refresh
         */
        this.refreshTimer = null;
        if ((options === null || options === void 0 ? void 0 : options.scheduleRefresh) === undefined) {
            options.scheduleRefresh = true;
        }
        this.options = options;
        if (options.getStoredToken) {
            this.activeGetStoredToken = (() => __awaiter(this, void 0, void 0, function* () {
                this.token = yield options.getStoredToken();
                this.activeGetStoredToken = null;
            }))();
        }
        this.scheduleRefresh();
    }
    /**
     * Does a fetch request and adds a Bearer / access token.
     *
     * If the access token is not known, this function attempts to fetch it
     * first. If the access token is almost expiring, this function might attempt
     * to refresh it.
     */
    fetch(input, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this.getAccessToken();
            if (init.headers) {
                init.headers['Authorization'] = 'Bearer ' + accessToken;
            }
            else {
                init.headers = { Authorization: 'Bearer ' + accessToken };
            }
            try {
                return yield this.options.fetch(input, init);
            }
            catch (error) {
                if (error.status === 401) {
                    const newToken = yield this.refreshToken();
                    init.headers['Authorization'] = 'Bearer ' + newToken;
                    return yield this.options.fetch(input, init);
                }
                else {
                    throw error;
                }
            }
        });
    }
    /**
     * Returns current token information.
     *
     * There result object will have:
     *   * accessToken
     *   * expiresAt - when the token expires, or null.
     *   * refreshToken - may be null
     *
     * This function will attempt to automatically refresh if stale.
     */
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token && (this.token.expiresAt === null || this.token.expiresAt > Date.now())) {
                // The current token is still valid
                return this.token;
            }
            return this.refreshToken();
        });
    }
    /**
     * Returns an access token.
     *
     * If the current access token is not known, it will attempt to fetch it.
     * If the access token is expiring, it will attempt to refresh it.
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure getStoredToken finished.
            yield this.activeGetStoredToken;
            const token = yield this.getToken();
            return token.accessToken;
        });
    }
    /**
     * Forces an access token refresh
     */
    refreshToken() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeRefresh) {
                // If we are currently already doing this operation,
                // make sure we don't do it twice in parallel.
                return this.activeRefresh;
            }
            const oldToken = this.token;
            this.activeRefresh = (() => __awaiter(this, void 0, void 0, function* () {
                var _c, _d;
                let newToken = null;
                try {
                    if (oldToken === null || oldToken === void 0 ? void 0 : oldToken.refreshToken) {
                        // We had a refresh token, lets see if we can use it!
                        newToken = yield this.options.client.refreshToken(oldToken);
                    }
                }
                catch (err) {
                    console.warn('[oauth2] refresh token not accepted, we\'ll try reauthenticating');
                }
                if (!newToken) {
                    newToken = yield this.options.getNewToken();
                }
                if (!newToken) {
                    const err = new Error('Unable to obtain OAuth2 tokens, a full reauth may be needed');
                    (_d = (_c = this.options).onError) === null || _d === void 0 ? void 0 : _d.call(_c, err);
                    throw err;
                }
                return newToken;
            }))();
            try {
                const token = yield this.activeRefresh;
                this.token = token;
                (_b = (_a = this.options).storeToken) === null || _b === void 0 ? void 0 : _b.call(_a, token);
                this.scheduleRefresh();
                return token;
            }
            catch (err) {
                if (this.options.onError) {
                    this.options.onError(err);
                }
                throw err;
            }
            finally {
                // Make sure we clear the current refresh operation.
                this.activeRefresh = null;
            }
        });
    }
    scheduleRefresh() {
        var _a;
        if (!this.options.scheduleRefresh) {
            return;
        }
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        if (!((_a = this.token) === null || _a === void 0 ? void 0 : _a.expiresAt) || !this.token.refreshToken) {
            // If we don't know when the token expires, or don't have a refresh_token, don't bother.
            return;
        }
        const expiresIn = this.token.expiresAt - Date.now();
        // We only schedule this event if it happens more than 2 minutes in the future.
        if (expiresIn < 120 * 1000) {
            return;
        }
        // Schedule 1 minute before expiry
        this.refreshTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.refreshToken();
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.error('[fetch-mw-oauth2] error while doing a background OAuth2 auto-refresh', err);
            }
        }), expiresIn - 60 * 1000);
    }
}
exports.FetchWrapperCustom = FetchWrapperCustom;


/***/ }),

/***/ "./main.ts":
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const EbayClient_1 = __webpack_require__(/*! ./EbayClient/EbayClient */ "./EbayClient/EbayClient.ts");
const oauth2_client_1 = __webpack_require__(/*! @badgateway/oauth2-client */ "./node_modules/@badgateway/oauth2-client/browser/oauth2-client.min.js");
const FetchWrapperCustom_1 = __webpack_require__(/*! ./FetchWrapperCustom */ "./FetchWrapperCustom.ts");
const panelClass = "panel-div";
const formId = "product-form-id";
const idFieldName = "lotId";
const nameFieldName = "name";
const productFieldName = "productId";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const descriptionFieldName = "description";
const conditionFieldName = "condition";
const conditionDescriptionFieldName = "conditionDescription";
const sellerFieldName = "seller";
const purchaseHistoryFieldName = "purchaseHistory";
const locatedInFieldName = "locatedIn";
const errorElementId = "errorElement";
const submitId = "submit";
const backendUrl = "https://localhost:7095/";
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/";
// fetch через background script, по другому не работает
function fetchResource(input, init) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ input, init }, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            }
            else {
                // Use undefined on a 204 - No Content
                const body = response.body ? new Blob([response.body]) : undefined;
                resolve(new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
            }
        });
    });
}
function extractPrice(price) {
    let matches = price.match(/(\D+)(\d+(?:[,.]\d+)?)/);
    if (matches[1] !== "US $") {
        throw new Error('US $ price expected, but was');
    }
    return matches[2].replace(',', '.');
}
function createHistoryButton() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;
    let historyButton = document.createElement('a');
    historyButton.classList.add('history-button');
    historyButton.textContent = 'HISTORY';
    historyButton.href = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    historyButton.style.cssText = `
    cursor: pointer;
    margin-left: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 3px 6px;
    text-decoration: none;
    color: black;
  `;
    historyButton.target = '_blank';
    return historyButton;
}
function addHistoryButton() {
    let productTitleContainer = document.querySelector('.vim[data-testid="x-item-title"]');
    if (productTitleContainer) {
        let existingButton = productTitleContainer.querySelector('a.history-button');
        if (!existingButton) {
            let historyButton = createHistoryButton();
            productTitleContainer.appendChild(historyButton);
        }
    }
}
function createPanel(bodyElement, client) {
    let styles = `
    .${panelClass} {
      text-align: left;
      padding: 15px;
      border: 3px solid #0000cc;
      border-radius: 10px;
      color: #0000cc;
      position:fixed;
      z-index:100;
      left:1%;
      bottom:5%;
      background-color: white;
    }
    
    .${panelClass} label {
      font-weight: bold;
      display: block;
      width: 200px;
      float: left;
    }
    
    .${panelClass} input {
      width: 200px;
    }
    
    .${panelClass} select {
      width: 200px;
    }
    
    .${panelClass} label:after { content: ": " }
`;
    let styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    bodyElement.appendChild(styleSheet);
    let div = document.createElement('div');
    div.classList.add(panelClass);
    let form = document.createElement('form');
    form.id = formId;
    // language=HTML
    form.innerHTML = `
            <label for="${idFieldName}">Id</label>
            <input id="${idFieldName}" type="number" name="${idFieldName}" readonly/>
            <br>
            <label for="${productFieldName}">Товар</label>
            <select name="${productFieldName}" id="${productFieldName}">
                <option value="">Выберите товар</option>
            </select>
            <br>
            <label for="${nameFieldName}">Name</label>
            <input id="${nameFieldName}" type="text" name="${nameFieldName}" readonly/>
            <br>
            <label for="${pcsFieldName}">PCS</label>
            <input id="${pcsFieldName}" type="text" name="${pcsFieldName}"/>
            <br>
            <label for="${priceFieldName}">Price US$</label>
            <input id="${priceFieldName}" type="number" step="0.01" name="${priceFieldName}"/>
            <br>
            <label for="${shippingFieldName}">Shipping to Germany</label>
            <input id="${shippingFieldName}" type="number" step="0.01" name="${shippingFieldName}"/>
            <br>
            <label for="${shippingAdditionalFieldName}">Shipping each additional</label>
            <input id="${shippingAdditionalFieldName}" type="number" step="0.01" name="${shippingAdditionalFieldName}"/>
            <br>
            <label for="${conditionFieldName}">Condition</label>
            <input id="${conditionFieldName}" type="text" name="${conditionFieldName}"/>
            <br>
            <label for="${conditionDescriptionFieldName}">Condition description</label>
            <input id="${conditionDescriptionFieldName}" type="text" name="${conditionDescriptionFieldName}"/>
            <br>
            <label for="${descriptionFieldName}">Description</label>
            <input id="${descriptionFieldName}" type="text" name="${descriptionFieldName}" readonly/>
            <br>
            <label for="${purchaseHistoryFieldName}">PurchaseHistory</label>
            <input id="${purchaseHistoryFieldName}" type="text" name="${purchaseHistoryFieldName}" readonly/>
            <br>
            <label for="${sellerFieldName}">Seller</label>
            <input id="${sellerFieldName}" type="text" name="${sellerFieldName}" readonly/>
            <br>
            <label for="${locatedInFieldName}">Located in</label>
            <input id="${locatedInFieldName}" type="text" name="${locatedInFieldName}" readonly/>
            <br>
            <div style="color: red;" id="${errorElementId}"></div>
            <br>
            <input id="${submitId}" type="submit" value="Save" disabled/>`;
    form.addEventListener("submit", function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handleSubmit(event, client);
        });
    });
    div.appendChild(form);
    bodyElement.appendChild(div);
}
function handleSubmit(event, client) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        let data = new FormData(event.target);
        let object = {};
        data.forEach(function (value, key) { object[key] = value; });
        let lotinfo = EbayClient_1.LotInfo.fromJS(object);
        try {
            yield client.upsertLotInfo(lotinfo, data.get('productId').toString());
        }
        catch (error) {
            if (error instanceof EbayClient_1.ApiException) {
                let apiException = error;
                console.log(apiException.status);
                console.log(apiException.response);
                //todo тут 400
            }
            else
                throw error;
        }
    });
}
function fillSoldItemsResult(fixedPriceRows, result) {
    for (let fixedPriceRow of fixedPriceRows) {
        let columns = [...fixedPriceRow.querySelectorAll('td')]
            .map(function (item) {
            return item.innerText;
        });
        let price = columns[1];
        if (price === "Expired" || price === "Declined") {
            continue;
        }
        let resultItem = {};
        if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {
            resultItem['price'] = extractPrice(price);
        }
        resultItem['quantity'] = columns[2];
        resultItem['date'] = parseDate(columns[3]);
        result.push(resultItem);
    }
}
function parseDate(dateString) {
    let matches = dateString.match(/(\d+\s[A-z]+\s\d+)\sat\s(\d+):(\d+):(\d+)(am|pm)\s([A-z]+)/);
    let date = new Date(Date.parse(matches[1] + ' 00:00:00.000Z'));
    date.setUTCHours(parseInt(matches[2]));
    date.setUTCMinutes(parseInt(matches[3]));
    date.setUTCSeconds(parseInt(matches[4]));
    if (matches[5] === "pm" && date.getUTCHours() !== 12) {
        date.setHours(date.getHours() + 12);
    }
    if (matches[5] === "am" && date.getUTCHours() === 12) {
        date.setHours(date.getHours() - 12);
    }
    if (matches[6] === "MSK") {
        date.setHours(date.getHours() - 3);
    }
    else {
        throw new Error("unknown timezone " + matches[6]);
    }
    return date.toISOString();
}
function parseSoldItemsPage(text) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    let result = [];
    let fixedPriceBlock = doc.querySelector('div.fixed-price tbody');
    if (fixedPriceBlock !== null) {
        let fixedPriceRows = [...fixedPriceBlock.querySelectorAll('tr')];
        fillSoldItemsResult(fixedPriceRows, result);
    }
    let offerBlock = doc.querySelector('div.offer tbody');
    if (offerBlock !== null) {
        let offerRows = [...offerBlock.querySelectorAll('tr')];
        fillSoldItemsResult(offerRows, result);
    }
    return JSON.stringify(result);
}
function fillId(panel) {
    let idField = panel.querySelector('input#' + idFieldName);
    idField.value = location.pathname.match(/\/itm\/([0-9]+)/)[1];
}
function fillPrice(panel) {
    let priceField = panel.querySelector('input#' + priceFieldName);
    priceField.value = extractPrice(document.querySelector('div.x-price-primary span').innerText);
}
function fillName(panel) {
    let nameField = panel.querySelector('input#' + nameFieldName);
    nameField.value = document.querySelector('.vim h1').innerText;
}
function fillSeller(panel) {
    let sellerField = panel.querySelector('input#' + sellerFieldName);
    sellerField.value = document.querySelector('div.x-sellercard-atf__info__about-seller a').innerText.toLowerCase();
}
function fillCondition(panel) {
    let conditionField = panel.querySelector('input#' + conditionFieldName);
    conditionField.value = document.querySelector('div.x-item-condition-text span.ux-textspans').innerText;
}
function fillConditionDescription(panel) {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc');
    if (conditionDescriptionElement != null) {
        let conditionDescriptionField = panel.querySelector('input#' + conditionDescriptionFieldName);
        conditionDescriptionField.value = conditionDescriptionElement.innerText
            .replace('“', '')
            .replace('”', '');
    }
}
function fillShipping(panel) {
    let shippingField = panel.querySelector('input#' + shippingFieldName);
    let shippingAdditionalField = panel.querySelector('input#' + shippingAdditionalFieldName);
    let shippingRatesAvailable = document.querySelector('div.ux-layout-section__textual-display--askSeller') === null;
    if (shippingRatesAvailable) {
        let deliveryColumnsHeader = [...document.querySelector('div.d-shipping-maxview thead')
                .querySelectorAll('th')];
        let deliveryColumnsValues = [...document.querySelector('div.d-shipping-maxview tbody')
                .querySelector('tr')
                .querySelectorAll('td')];
        let shippingMaxviewValues = {};
        for (let i = 0; i < 3; i++) {
            let key = deliveryColumnsHeader[i].innerText;
            shippingMaxviewValues[key] = deliveryColumnsValues[i].querySelector('span').innerText;
        }
        if (shippingMaxviewValues['To'] !== 'Germany') {
            throw new Error('Shipping country must be Germany');
        }
        let shippingValue = shippingMaxviewValues['Shipping and handling'];
        if (shippingValue !== 'Free shipping') {
            shippingField.value = extractPrice(shippingValue);
            if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {
                shippingAdditionalField.value = extractPrice(shippingMaxviewValues['Each additional item']);
            }
            else {
                shippingAdditionalField.value = 0;
            }
        }
        else {
            shippingField.value = 0;
            shippingAdditionalField.value = 0;
        }
    }
}
function fillLocatedIn(panel) {
    let locatedInField = panel.querySelector('input#' + locatedInFieldName);
    locatedInField.value = document.querySelector('div.ux-labels-values--legalShipping div.col-9').innerText.split("Located in: ")[1];
}
function fillDescription(panel) {
    let descriptionUrl = document.querySelector('#desc_ifr').src;
    fetchResource(descriptionUrl, { method: 'GET', credentials: 'include' })
        .then((response) => {
        response.text().then((text) => {
            panel.querySelector('input#' + descriptionFieldName).value = text;
        }).catch((err) => {
            showError(err);
        });
    })
        .catch((err) => {
        showError(err);
    });
}
function fillPurchaseHistory(panel) {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    fetchResource(purchaseHistoryUrl, { method: 'GET', credentials: 'include' })
        .then((response) => {
        response.text().then((text) => {
            panel.querySelector('input#' + purchaseHistoryFieldName).value = parseSoldItemsPage(text);
        }).catch((err) => {
            showError(err);
        });
    })
        .catch((err) => {
        showError(err);
    });
}
function fillProduct(panel, client) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let productField = panel.querySelector('select#' + productFieldName);
        let searchQuery = (_c = (_b = (_a = new URLSearchParams(document.referrer)) === null || _a === void 0 ? void 0 : _a.get('_nkw')) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        let products = yield client.getAllProducts();
        for (let i = 0; i < products.length; i++) {
            let opt = document.createElement('option');
            opt.value = products[i].id;
            opt.innerHTML = products[i].name;
            if (searchQuery !== undefined && searchQuery === products[i].searchQuery.trim().toLowerCase()) {
                opt.selected = true;
            }
            productField.appendChild(opt);
        }
    });
}
function fillPanelWithData(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let panel = document.querySelector('div.' + panelClass);
        fillId(panel);
        yield fillProduct(panel, client);
        fillPrice(panel);
        fillName(panel);
        fillSeller(panel);
        fillCondition(panel);
        fillConditionDescription(panel);
        fillShipping(panel);
        fillLocatedIn(panel);
        fillDescription(panel);
        fillPurchaseHistory(panel);
    });
}
function addPanel(client) {
    let bodyElement = document.querySelector('body');
    if (bodyElement) {
        let existingPanel = bodyElement.querySelector('div.' + panelClass);
        if (!existingPanel) {
            createPanel(bodyElement, client);
        }
    }
}
function showError(error) {
    let errorDiv = document.querySelector('div.' + panelClass + ' #' + errorElementId);
    let span = document.createElement('span');
    span.innerHTML = error.stack;
    errorDiv.appendChild(span);
}
function enableSubmitButton() {
    document.querySelector('#' + submitId).disabled = false;
}
function getAuthorizeFetch(oAuth2Client) {
    return new FetchWrapperCustom_1.FetchWrapperCustom({
        client: oAuth2Client,
        getNewToken: () => __awaiter(this, void 0, void 0, function* () {
            let currentPage = location.protocol + '//' + location.host + location.pathname;
            let codeVerifier = yield (0, oauth2_client_1.generateCodeVerifier)();
            yield chrome.storage.local.set({ code_verifier: codeVerifier, return_to_page: currentPage });
            document.location = yield oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: authRedirectUrl,
                codeVerifier,
                scope: ['Ebay.ServerAPI']
            });
            return null;
        }),
        getStoredToken: () => __awaiter(this, void 0, void 0, function* () {
            let token = (yield chrome.storage.local.get(["token_store"])).token_store;
            if (token)
                return JSON.parse(token);
            return null;
        }),
        fetch: fetchResource
    });
}
function productPage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            addHistoryButton();
            addPanel(client);
            yield fillPanelWithData(client);
            //todo разрешать только если вообще нет ошибок
            enableSubmitButton();
        }
        catch (error) {
            showError(error);
            throw error;
        }
    });
}
function authPage(oAuth2Client) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = new URL(document.location.href);
        if (url.searchParams.has("code")) {
            let codeVerifier = (yield chrome.storage.local.get(["code_verifier"])).code_verifier;
            let oauth2Token = yield oAuth2Client.authorizationCode.getTokenFromCodeRedirect(document.location.href, {
                redirectUri: authRedirectUrl,
                codeVerifier
            });
            yield chrome.storage.local.set({ token_store: JSON.stringify(oauth2Token) });
            document.location.href = (yield chrome.storage.local.get(["return_to_page"])).return_to_page;
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let oAuth2Client = new oauth2_client_1.OAuth2Client({
            server: backendUrl,
            clientId: 'Ebay.ChromeExtension',
            tokenEndpoint: '/connect/token',
            authorizationEndpoint: '/connect/authorize',
            fetch: fetchResource
        });
        if (location.protocol + '//' + location.host + location.pathname === authRedirectUrl) {
            yield authPage(oAuth2Client);
        }
        else {
            let client = new EbayClient_1.Client(baseApiUrl, getAuthorizeFetch(oAuth2Client));
            yield productPage(client);
        }
    });
}
exports.run = run;
run();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVksQ0FBQyxDQUFDO1FBQ2pDLENBQUM7YUFBTSxDQUFDO1lBQ0osSUFBSSxNQUFNLEdBQUcsSUFBSSxtQkFBTSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFmRCxrQkFlQztBQUlELEdBQUcsRUFBRSxDQUFDOzs7Ozs7O1VDM2dCTjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQvYnJvd3Nlci9vYXV0aDItY2xpZW50Lm1pbi5qcyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9FYmF5Q2xpZW50L0ViYXlDbGllbnQudHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRmV0Y2hXcmFwcGVyQ3VzdG9tLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL21haW4udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk9BdXRoMkNsaWVudD10KCk6ZS5PQXV0aDJDbGllbnQ9dCgpfShzZWxmLCgoKT0+KCgpPT57dmFyIGU9ezkzNDooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXQuT0F1dGgyQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoNDQzKSxpPXIoNjE4KTtmdW5jdGlvbiBvKGUsdCl7cmV0dXJuIG5ldyBVUkwoZSx0KS50b1N0cmluZygpfWZ1bmN0aW9uIHMoZSl7cmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGUpLmZpbHRlcigoKFtlLHRdKT0+dm9pZCAwIT09dCkpKSkudG9TdHJpbmcoKX10Lk9BdXRoMkNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmRpc2NvdmVyeURvbmU9ITEsdGhpcy5zZXJ2ZXJNZXRhZGF0YT1udWxsLChudWxsPT1lP3ZvaWQgMDplLmZldGNoKXx8KGUuZmV0Y2g9ZmV0Y2guYmluZChnbG9iYWxUaGlzKSksdGhpcy5zZXR0aW5ncz1lfWFzeW5jIHJlZnJlc2hUb2tlbihlKXtpZighZS5yZWZyZXNoVG9rZW4pdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0b2tlbiBkaWRuJ3QgaGF2ZSBhIHJlZnJlc2hUb2tlbi4gSXQncyBub3QgcG9zc2libGUgdG8gcmVmcmVzaCB0aGlzXCIpO2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJyZWZyZXNoX3Rva2VuXCIscmVmcmVzaF90b2tlbjplLnJlZnJlc2hUb2tlbn07cmV0dXJuIHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0fHwodC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCksdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfWFzeW5jIGNsaWVudENyZWRlbnRpYWxzKGUpe3ZhciB0O2NvbnN0IHI9W1wiY2xpZW50X2lkXCIsXCJjbGllbnRfc2VjcmV0XCIsXCJncmFudF90eXBlXCIsXCJzY29wZVwiXTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+ci5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7ci5qb2luKFwiJywgJ1wiKX0nYCk7Y29uc3Qgbj17Z3JhbnRfdHlwZTpcImNsaWVudF9jcmVkZW50aWFsc1wiLHNjb3BlOm51bGw9PT0odD1udWxsPT1lP3ZvaWQgMDplLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfTtpZighdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpdGhyb3cgbmV3IEVycm9yKFwiQSBjbGllbnRTZWNyZXQgbXVzdCBiZSBwcm92aWRlZCB0byB1c2UgY2xpZW50X2NyZWRlbnRpYWxzXCIpO3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixuKSl9YXN5bmMgcGFzc3dvcmQoZSl7dmFyIHQ7Y29uc3Qgcj17Z3JhbnRfdHlwZTpcInBhc3N3b3JkXCIsLi4uZSxzY29wZTpudWxsPT09KHQ9ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIil9O3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixyKSl9Z2V0IGF1dGhvcml6YXRpb25Db2RlKCl7cmV0dXJuIG5ldyBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50KHRoaXMpfWFzeW5jIGludHJvc3BlY3QoZSl7Y29uc3QgdD17dG9rZW46ZS5hY2Nlc3NUb2tlbix0b2tlbl90eXBlX2hpbnQ6XCJhY2Nlc3NfdG9rZW5cIn07cmV0dXJuIHRoaXMucmVxdWVzdChcImludHJvc3BlY3Rpb25FbmRwb2ludFwiLHQpfWFzeW5jIGdldEVuZHBvaW50KGUpe2lmKHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoXCJkaXNjb3ZlcnlFbmRwb2ludFwiIT09ZSYmKGF3YWl0IHRoaXMuZGlzY292ZXIoKSx2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZighdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiAke2V9LiBFaXRoZXIgc3BlY2lmeSAke2V9IGluIHRoZSBzZXR0aW5ncywgb3IgdGhlIFwic2VydmVyXCIgZW5kcG9pbnQgdG8gbGV0IHRoZSBjbGllbnQgZGlzY292ZXIgaXQuYCk7c3dpdGNoKGUpe2Nhc2VcImF1dGhvcml6YXRpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2F1dGhvcml6ZVwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJ0b2tlbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvdG9rZW5cIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiZGlzY292ZXJ5RW5kcG9pbnRcIjpyZXR1cm4gbyhcIi8ud2VsbC1rbm93bi9vYXV0aC1hdXRob3JpemF0aW9uLXNlcnZlclwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9pbnRyb3NwZWN0XCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpfX1hc3luYyBkaXNjb3Zlcigpe3ZhciBlO2lmKHRoaXMuZGlzY292ZXJ5RG9uZSlyZXR1cm47bGV0IHQ7dGhpcy5kaXNjb3ZlcnlEb25lPSEwO3RyeXt0PWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoXCJkaXNjb3ZlcnlFbmRwb2ludFwiKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgY291bGQgbm90IGJlIGRldGVybWluZWQuIEVpdGhlciBzcGVjaWZ5IHRoZSBcInNlcnZlclwiIG9yIFwiZGlzY292ZXJ5RW5kcG9pbnQnKX1jb25zdCByPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2godCx7aGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvblwifX0pO2lmKCFyLm9rKXJldHVybjtpZighKG51bGw9PT0oZT1yLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSkpcmV0dXJuIHZvaWQgY29uc29sZS53YXJuKFwiW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCB3YXMgbm90IGEgSlNPTiByZXNwb25zZS4gUmVzcG9uc2UgaXMgaWdub3JlZFwiKTt0aGlzLnNlcnZlck1ldGFkYXRhPWF3YWl0IHIuanNvbigpO2NvbnN0IG49W1tcImF1dGhvcml6YXRpb25fZW5kcG9pbnRcIixcImF1dGhvcml6YXRpb25FbmRwb2ludFwiXSxbXCJ0b2tlbl9lbmRwb2ludFwiLFwidG9rZW5FbmRwb2ludFwiXSxbXCJpbnRyb3NwZWN0aW9uX2VuZHBvaW50XCIsXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIl1dO2lmKG51bGwhPT10aGlzLnNlcnZlck1ldGFkYXRhKXtmb3IoY29uc3RbZSxyXW9mIG4pdGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSYmKHRoaXMuc2V0dGluZ3Nbcl09byh0aGlzLnNlcnZlck1ldGFkYXRhW2VdLHQpKTt0aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWQmJiF0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kJiYodGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZD10aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWRbMF0pfX1hc3luYyByZXF1ZXN0KGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEVuZHBvaW50KGUpLGk9e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIn07bGV0IG89dGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZDtzd2l0Y2gob3x8KG89dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQ/XCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6XCJjbGllbnRfc2VjcmV0X3Bvc3RcIiksbyl7Y2FzZVwiY2xpZW50X3NlY3JldF9iYXNpY1wiOmkuQXV0aG9yaXphdGlvbj1cIkJhc2ljIFwiK2J0b2EodGhpcy5zZXR0aW5ncy5jbGllbnRJZCtcIjpcIit0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7Y2FzZVwiY2xpZW50X3NlY3JldF9wb3N0XCI6dC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCx0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKHQuY2xpZW50X3NlY3JldD10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBtZXRob2Qgbm90IHlldCBzdXBwb3J0ZWQ6XCIrbytcIi4gT3BlbiBhIGZlYXR1cmUgcmVxdWVzdCBpZiB5b3Ugd2FudCB0aGlzIVwiKX1jb25zdCBhPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2gocix7bWV0aG9kOlwiUE9TVFwiLGJvZHk6cyh0KSxoZWFkZXJzOml9KTtpZihhLm9rKXJldHVybiBhd2FpdCBhLmpzb24oKTtsZXQgYyxoLHU7dGhyb3cgYS5oZWFkZXJzLmhhcyhcIkNvbnRlbnQtVHlwZVwiKSYmYS5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSYmKGM9YXdhaXQgYS5qc29uKCkpLChudWxsPT1jP3ZvaWQgMDpjLmVycm9yKT8oaD1cIk9BdXRoMiBlcnJvciBcIitjLmVycm9yK1wiLlwiLGMuZXJyb3JfZGVzY3JpcHRpb24mJihoKz1cIiBcIitjLmVycm9yX2Rlc2NyaXB0aW9uKSx1PWMuZXJyb3IpOihoPVwiSFRUUCBFcnJvciBcIithLnN0YXR1cytcIiBcIithLnN0YXR1c1RleHQsNDAxPT09YS5zdGF0dXMmJnRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYoaCs9XCIuIEl0J3MgbGlrZWx5IHRoYXQgdGhlIGNsaWVudElkIGFuZC9vciBjbGllbnRTZWNyZXQgd2FzIGluY29ycmVjdFwiKSx1PW51bGwpLG5ldyBuLk9BdXRoMkVycm9yKGgsdSxhLnN0YXR1cyl9dG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4oZSl7cmV0dXJuIGUudGhlbigoZT0+e3ZhciB0O3JldHVybnthY2Nlc3NUb2tlbjplLmFjY2Vzc190b2tlbixleHBpcmVzQXQ6ZS5leHBpcmVzX2luP0RhdGUubm93KCkrMWUzKmUuZXhwaXJlc19pbjpudWxsLHJlZnJlc2hUb2tlbjpudWxsIT09KHQ9ZS5yZWZyZXNoX3Rva2VuKSYmdm9pZCAwIT09dD90Om51bGx9fSkpfX0sdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXN9LDYxODooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZXRDb2RlQ2hhbGxlbmdlPXQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDkzNCksaT1yKDQ0Myk7YXN5bmMgZnVuY3Rpb24gbyhlKXtjb25zdCB0PXMoKTtpZihudWxsPT10P3ZvaWQgMDp0LnN1YnRsZSlyZXR1cm5bXCJTMjU2XCIsYyhhd2FpdCB0LnN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsYShlKSkpXTt7Y29uc3QgdD1yKDIxMikuY3JlYXRlSGFzaChcInNoYTI1NlwiKTtyZXR1cm4gdC51cGRhdGUoYShlKSksW1wiUzI1NlwiLHQuZGlnZXN0KFwiYmFzZTY0dXJsXCIpXX19ZnVuY3Rpb24gcygpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jcnlwdG8pcmV0dXJuIHdpbmRvdy5jcnlwdG87aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJnNlbGYuY3J5cHRvKXJldHVybiBzZWxmLmNyeXB0bztjb25zdCBlPXIoMjEyKTtyZXR1cm4gZS53ZWJjcnlwdG8/ZS53ZWJjcnlwdG86bnVsbH1mdW5jdGlvbiBhKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09MjU1JmUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH1mdW5jdGlvbiBjKGUpe3JldHVybiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkoZSkpKS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoLz0rJC8sXCJcIil9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmNsaWVudD1lfWFzeW5jIGdldEF1dGhvcml6ZVVyaShlKXtjb25zdFt0LHJdPWF3YWl0IFByb21pc2UuYWxsKFtlLmNvZGVWZXJpZmllcj9vKGUuY29kZVZlcmlmaWVyKTp2b2lkIDAsdGhpcy5jbGllbnQuZ2V0RW5kcG9pbnQoXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIildKTtsZXQgaT17Y2xpZW50X2lkOnRoaXMuY2xpZW50LnNldHRpbmdzLmNsaWVudElkLHJlc3BvbnNlX3R5cGU6XCJjb2RlXCIscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV9jaGFsbGVuZ2VfbWV0aG9kOm51bGw9PXQ/dm9pZCAwOnRbMF0sY29kZV9jaGFsbGVuZ2U6bnVsbD09dD92b2lkIDA6dFsxXX07ZS5zdGF0ZSYmKGkuc3RhdGU9ZS5zdGF0ZSksZS5zY29wZSYmKGkuc2NvcGU9ZS5zY29wZS5qb2luKFwiIFwiKSk7Y29uc3Qgcz1PYmplY3Qua2V5cyhpKTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+cy5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7cy5qb2luKFwiJywgJ1wiKX0nYCk7cmV0dXJuIGk9ey4uLmksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc30scitcIj9cIisoMCxuLmdlbmVyYXRlUXVlcnlTdHJpbmcpKGkpfWFzeW5jIGdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChlLHQpe2NvbnN0e2NvZGU6cn09YXdhaXQgdGhpcy52YWxpZGF0ZVJlc3BvbnNlKGUse3N0YXRlOnQuc3RhdGV9KTtyZXR1cm4gdGhpcy5nZXRUb2tlbih7Y29kZTpyLHJlZGlyZWN0VXJpOnQucmVkaXJlY3RVcmksY29kZVZlcmlmaWVyOnQuY29kZVZlcmlmaWVyfSl9YXN5bmMgdmFsaWRhdGVSZXNwb25zZShlLHQpe3ZhciByO2NvbnN0IG49bmV3IFVSTChlKS5zZWFyY2hQYXJhbXM7aWYobi5oYXMoXCJlcnJvclwiKSl0aHJvdyBuZXcgaS5PQXV0aDJFcnJvcihudWxsIT09KHI9bi5nZXQoXCJlcnJvcl9kZXNjcmlwdGlvblwiKSkmJnZvaWQgMCE9PXI/cjpcIk9BdXRoMiBlcnJvclwiLG4uZ2V0KFwiZXJyb3JcIiksMCk7aWYoIW4uaGFzKFwiY29kZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSB1cmwgZGlkIG5vdCBjb250YWluIGEgY29kZSBwYXJhbWV0ZXIgJHtlfWApO2lmKHQuc3RhdGUmJnQuc3RhdGUhPT1uLmdldChcInN0YXRlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIFwic3RhdGVcIiBwYXJhbWV0ZXIgaW4gdGhlIHVybCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCB2YWx1ZSBvZiAke3Quc3RhdGV9YCk7cmV0dXJue2NvZGU6bi5nZXQoXCJjb2RlXCIpLHNjb3BlOm4uaGFzKFwic2NvcGVcIik/bi5nZXQoXCJzY29wZVwiKS5zcGxpdChcIiBcIik6dm9pZCAwfX1hc3luYyBnZXRUb2tlbihlKXtjb25zdCB0PXtncmFudF90eXBlOlwiYXV0aG9yaXphdGlvbl9jb2RlXCIsY29kZTplLmNvZGUscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV92ZXJpZmllcjplLmNvZGVWZXJpZmllcn07cmV0dXJuIHRoaXMuY2xpZW50LnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMuY2xpZW50LnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfX0sdC5nZW5lcmF0ZUNvZGVWZXJpZmllcj1hc3luYyBmdW5jdGlvbigpe2NvbnN0IGU9cygpO2lmKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoMzIpO3JldHVybiBlLmdldFJhbmRvbVZhbHVlcyh0KSxjKHQpfXtjb25zdCBlPXIoMjEyKTtyZXR1cm4gbmV3IFByb21pc2UoKCh0LHIpPT57ZS5yYW5kb21CeXRlcygzMiwoKGUsbik9PntlJiZyKGUpLHQobi50b1N0cmluZyhcImJhc2U2NHVybFwiKSl9KSl9KSl9fSx0LmdldENvZGVDaGFsbGVuZ2U9b30sNDQzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJFcnJvcj12b2lkIDA7Y2xhc3MgciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKGUsdCxyKXtzdXBlcihlKSx0aGlzLm9hdXRoMkNvZGU9dCx0aGlzLmh0dHBDb2RlPXJ9fXQuT0F1dGgyRXJyb3I9cn0sMTM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkZldGNoPXZvaWQgMCx0Lk9BdXRoMkZldGNoPWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMudG9rZW49bnVsbCx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGwsdGhpcy5hY3RpdmVSZWZyZXNoPW51bGwsdGhpcy5yZWZyZXNoVGltZXI9bnVsbCx2b2lkIDA9PT0obnVsbD09ZT92b2lkIDA6ZS5zY2hlZHVsZVJlZnJlc2gpJiYoZS5zY2hlZHVsZVJlZnJlc2g9ITApLHRoaXMub3B0aW9ucz1lLGUuZ2V0U3RvcmVkVG9rZW4mJih0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPShhc3luYygpPT57dGhpcy50b2tlbj1hd2FpdCBlLmdldFN0b3JlZFRva2VuKCksdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsfSkoKSksdGhpcy5zY2hlZHVsZVJlZnJlc2goKX1hc3luYyBmZXRjaChlLHQpe2NvbnN0IHI9bmV3IFJlcXVlc3QoZSx0KTtyZXR1cm4gdGhpcy5tdygpKHIsKGU9PmZldGNoKGUpKSl9bXcoKXtyZXR1cm4gYXN5bmMoZSx0KT0+e2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO2xldCBuPWUuY2xvbmUoKTtuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IpO2xldCBpPWF3YWl0IHQobik7aWYoIWkub2smJjQwMT09PWkuc3RhdHVzKXtjb25zdCByPWF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7bj1lLmNsb25lKCksbi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityLmFjY2Vzc1Rva2VuKSxpPWF3YWl0IHQobil9cmV0dXJuIGl9fWFzeW5jIGdldFRva2VuKCl7cmV0dXJuIHRoaXMudG9rZW4mJihudWxsPT09dGhpcy50b2tlbi5leHBpcmVzQXR8fHRoaXMudG9rZW4uZXhwaXJlc0F0PkRhdGUubm93KCkpP3RoaXMudG9rZW46dGhpcy5yZWZyZXNoVG9rZW4oKX1hc3luYyBnZXRBY2Nlc3NUb2tlbigpe3JldHVybiBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuLChhd2FpdCB0aGlzLmdldFRva2VuKCkpLmFjY2Vzc1Rva2VufWFzeW5jIHJlZnJlc2hUb2tlbigpe3ZhciBlLHQ7aWYodGhpcy5hY3RpdmVSZWZyZXNoKXJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7Y29uc3Qgcj10aGlzLnRva2VuO3RoaXMuYWN0aXZlUmVmcmVzaD0oYXN5bmMoKT0+e3ZhciBlLHQ7bGV0IG49bnVsbDt0cnl7KG51bGw9PXI/dm9pZCAwOnIucmVmcmVzaFRva2VuKSYmKG49YXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ocikpfWNhdGNoKGUpe2NvbnNvbGUud2FybihcIltvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZSdsbCB0cnkgcmVhdXRoZW50aWNhdGluZ1wiKX1pZihufHwobj1hd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKSksIW4pe2NvbnN0IHI9bmV3IEVycm9yKFwiVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWRcIik7dGhyb3cgbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykub25FcnJvcil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHJ9cmV0dXJuIG59KSgpO3RyeXtjb25zdCByPWF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtyZXR1cm4gdGhpcy50b2tlbj1yLG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLnN0b3JlVG9rZW4pfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpLHJ9Y2F0Y2goZSl7dGhyb3cgdGhpcy5vcHRpb25zLm9uRXJyb3ImJnRoaXMub3B0aW9ucy5vbkVycm9yKGUpLGV9ZmluYWxseXt0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbH19c2NoZWR1bGVSZWZyZXNoKCl7dmFyIGU7aWYoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpcmV0dXJuO2lmKHRoaXMucmVmcmVzaFRpbWVyJiYoY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKSx0aGlzLnJlZnJlc2hUaW1lcj1udWxsKSwhKG51bGw9PT0oZT10aGlzLnRva2VuKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5leHBpcmVzQXQpfHwhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pcmV0dXJuO2NvbnN0IHQ9dGhpcy50b2tlbi5leHBpcmVzQXQtRGF0ZS5ub3coKTt0PDEyZTR8fCh0aGlzLnJlZnJlc2hUaW1lcj1zZXRUaW1lb3V0KChhc3luYygpPT57dHJ5e2F3YWl0IHRoaXMucmVmcmVzaFRva2VuKCl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihcIltmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoXCIsZSl9fSksdC02ZTQpKX19fSwyMTI6KCk9Pnt9fSx0PXt9O2Z1bmN0aW9uIHIobil7dmFyIGk9dFtuXTtpZih2b2lkIDAhPT1pKXJldHVybiBpLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fX07cmV0dXJuIGVbbl0obyxvLmV4cG9ydHMsciksby5leHBvcnRzfXZhciBuPXt9O3JldHVybigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBlPW47T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5PQXV0aDJFcnJvcj1lLk9BdXRoMkZldGNoPWUuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9ZS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1lLk9BdXRoMkNsaWVudD12b2lkIDA7dmFyIHQ9cig5MzQpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQuT0F1dGgyQ2xpZW50fX0pO3ZhciBpPXIoNjE4KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJnZW5lcmF0ZUNvZGVWZXJpZmllclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLmdlbmVyYXRlQ29kZVZlcmlmaWVyfX0pO3ZhciBvPXIoMTMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRmV0Y2hcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gby5PQXV0aDJGZXRjaH19KTt2YXIgcz1yKDQ0Myk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJFcnJvclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzLk9BdXRoMkVycm9yfX0pfSkoKSxufSkoKSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYXV0aDItY2xpZW50Lm1pbi5qcy5tYXAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gPGF1dG8tZ2VuZXJhdGVkPlxyXG4vLyAgICAgR2VuZXJhdGVkIHVzaW5nIHRoZSBOU3dhZyB0b29sY2hhaW4gdjEzLjIwLjAuMCAoTkpzb25TY2hlbWEgdjEwLjkuMC4wIChOZXd0b25zb2Z0Lkpzb24gdjEzLjAuMC4wKSkgKGh0dHA6Ly9OU3dhZy5vcmcpXHJcbi8vIDwvYXV0by1nZW5lcmF0ZWQ+XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyogdHNsaW50OmRpc2FibGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuLy8gUmVTaGFycGVyIGRpc2FibGUgSW5jb25zaXN0ZW50TmFtaW5nXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcclxuICAgIHByaXZhdGUgaHR0cDogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9O1xyXG4gICAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQganNvblBhcnNlUmV2aXZlcjogKChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlVXJsPzogc3RyaW5nLCBodHRwPzogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9KSB7XHJcbiAgICAgICAgdGhpcy5odHRwID0gaHR0cCA/IGh0dHAgOiB3aW5kb3cgYXMgYW55O1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmwgIT09IHVuZGVmaW5lZCAmJiBiYXNlVXJsICE9PSBudWxsID8gYmFzZVVybCA6IFwiL2FwaS9lYmF5L3YxXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0IGFsbCBwcm9kdWN0c1xyXG4gICAgICogQHJldHVybiBPS1xyXG4gICAgICovXHJcbiAgICBnZXRBbGxQcm9kdWN0cygpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRBbGxQcm9kdWN0cyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0QWxsUHJvZHVjdHMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChQcm9kdWN0V2l0aElkLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxQcm9kdWN0V2l0aElkW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0NyZWF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NyZWF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gcmVzdWx0RGF0YTIwMCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0RGF0YTIwMCA6IDxhbnk+bnVsbDtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbHMuZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHN0cmluZz4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBkYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBkYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscy5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVsZXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gRGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9kdWN0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRGVsZXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzRGVsZXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIHVwc2VydExvdEluZm8obG90SW5mbzogTG90SW5mbywgcHJvZHVjdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3twcm9kdWN0SWR9L2xvdHMvXCI7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkIHx8IHByb2R1Y3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAncHJvZHVjdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7cHJvZHVjdElkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIHByb2R1Y3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkobG90SW5mbyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Vwc2VydExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1Vwc2VydExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRob3V0SWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcnkhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aG91dElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IF9kYXRhW1wiU2VhcmNoUXVlcnlcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRob3V0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcnlcIl0gPSB0aGlzLnNlYXJjaFF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0V2l0aElkIGltcGxlbWVudHMgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcnkhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcIklkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIk5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBfZGF0YVtcIlNlYXJjaFF1ZXJ5XCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2R1Y3RXaXRoSWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQcm9kdWN0V2l0aElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIklkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcnlcIl0gPSB0aGlzLnNlYXJjaFF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9kdWN0V2l0aElkIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyeTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mbyBpbXBsZW1lbnRzIElMb3RJbmZvIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHBjcyE6IG51bWJlcjtcclxuICAgIHByaWNlITogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmchOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWwhOiBudW1iZXI7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuICAgIGNvbmRpdGlvbiE6IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG4gICAgc2VsbGVyITogc3RyaW5nO1xyXG4gICAgbG9jYXRlZEluITogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5ITogUHVyY2hhc2VJbmZvW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnBjcyA9IF9kYXRhW1wicGNzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZyA9IF9kYXRhW1wic2hpcHBpbmdcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsID0gX2RhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gX2RhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWxsZXIgPSBfZGF0YVtcInNlbGxlclwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVkSW4gPSBfZGF0YVtcImxvY2F0ZWRJblwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkhLnB1c2goUHVyY2hhc2VJbmZvLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcIm5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgZGF0YVtcInBjc1wiXSA9IHRoaXMucGNzO1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nXCJdID0gdGhpcy5zaGlwcGluZztcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdID0gdGhpcy5zaGlwcGluZ0FkZGl0aW9uYWw7XHJcbiAgICAgICAgZGF0YVtcImRlc2NyaXB0aW9uXCJdID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uXCJdID0gdGhpcy5jb25kaXRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdID0gdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbjtcclxuICAgICAgICBkYXRhW1wic2VsbGVyXCJdID0gdGhpcy5zZWxsZXI7XHJcbiAgICAgICAgZGF0YVtcImxvY2F0ZWRJblwiXSA9IHRoaXMubG9jYXRlZEluO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHVyY2hhc2VIaXN0b3J5KSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5wdXJjaGFzZUhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwY3M6IG51bWJlcjtcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZzogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsOiBudW1iZXI7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgc2VsbGVyOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW46IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeTogUHVyY2hhc2VJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQdXJjaGFzZUluZm8gaW1wbGVtZW50cyBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHkhOiBudW1iZXI7XHJcbiAgICBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHVyY2hhc2VJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gX2RhdGFbXCJxdWFudGl0eVwiXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gX2RhdGFbXCJkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFB1cmNoYXNlSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFB1cmNoYXNlSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInF1YW50aXR5XCJdID0gdGhpcy5xdWFudGl0eTtcclxuICAgICAgICBkYXRhW1wiZGF0ZVwiXSA9IHRoaXMuZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb2JsZW1EZXRhaWxzIGltcGxlbWVudHMgSVByb2JsZW1EZXRhaWxzIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvYmxlbURldGFpbHMpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gX2RhdGFbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gX2RhdGFbXCJ0aXRsZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBfZGF0YVtcInN0YXR1c1wiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBfZGF0YVtcImRldGFpbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSA9IF9kYXRhW1wiaW5zdGFuY2VcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvYmxlbURldGFpbHMge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGFic3RyYWN0IGNsYXNzICdQcm9ibGVtRGV0YWlscycgY2Fubm90IGJlIGluc3RhbnRpYXRlZC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJ0eXBlXCJdID0gdGhpcy50eXBlO1xyXG4gICAgICAgIGRhdGFbXCJ0aXRsZVwiXSA9IHRoaXMudGl0bGU7XHJcbiAgICAgICAgZGF0YVtcInN0YXR1c1wiXSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgIGRhdGFbXCJkZXRhaWxcIl0gPSB0aGlzLmRldGFpbDtcclxuICAgICAgICBkYXRhW1wiaW5zdGFuY2VcIl0gPSB0aGlzLmluc3RhbmNlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9ibGVtRGV0YWlscyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscyBleHRlbmRzIFByb2JsZW1EZXRhaWxzIGltcGxlbWVudHMgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElWYWxpZGF0aW9uUHJvYmxlbURldGFpbHMpIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogVmFsaWRhdGlvblByb2JsZW1EZXRhaWxzIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxzKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxzIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxzIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9ycyBpbXBsZW1lbnRzIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9ycykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9ycyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9ycygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgc3RhdHVzOiBudW1iZXI7XHJcbiAgICByZXNwb25zZTogc3RyaW5nO1xyXG4gICAgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH07XHJcbiAgICByZXN1bHQ6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0OiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBpc0FwaUV4Y2VwdGlvbiA9IHRydWU7XHJcblxyXG4gICAgc3RhdGljIGlzQXBpRXhjZXB0aW9uKG9iajogYW55KTogb2JqIGlzIEFwaUV4Y2VwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG9iai5pc0FwaUV4Y2VwdGlvbiA9PT0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGhyb3dFeGNlcHRpb24obWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdD86IGFueSk6IGFueSB7XHJcbiAgICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRocm93IHJlc3VsdDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aHJvdyBuZXcgQXBpRXhjZXB0aW9uKG1lc3NhZ2UsIHN0YXR1cywgcmVzcG9uc2UsIGhlYWRlcnMsIG51bGwpO1xyXG59IiwiaW1wb3J0IHtPQXV0aDJDbGllbnQsIE9BdXRoMlRva2VufSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuXHJcblxyXG50eXBlIE9BdXRoMkZldGNoT3B0aW9ucyA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyZW5jZSB0byBPQXV0aDIgY2xpZW50LlxyXG4gICAgICovXHJcbiAgICBjbGllbnQ6IE9BdXRoMkNsaWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFlvdSBhcmUgcmVzcG9uc2libGUgZm9yIGltcGxlbWVudGluZyB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgICogaXQncyBwdXJwb3NlIGlzIHRvIHN1cHBseSB0aGUgJ2luaXRpYWwnIG9hdXRoMiB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIGBudWxsYCB0byBmYWlsIHRoZSBwcm9jZXNzLlxyXG4gICAgICovXHJcbiAgICBnZXROZXdUb2tlbigpOiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBzZXQsIHdpbGwgYmUgY2FsbGVkIGlmIGF1dGhlbnRpY2F0aW9uIGZhdGFsbHkgZmFpbGVkLlxyXG4gICAgICovXHJcbiAgICBvbkVycm9yPzogKGVycjogRXJyb3IpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgYWN0aXZlIHRva2VuIGNoYW5nZXMuIFVzaW5nIHRoaXMgaXNcclxuICAgICAqIG9wdGlvbmFsLCBidXQgaXQgbWF5IGJlIHVzZWQgdG8gKGZvciBleGFtcGxlKSBwdXQgdGhlIHRva2VuIGluIG9mZi1saW5lXHJcbiAgICAgKiBzdG9yYWdlIGZvciBsYXRlciB1c2FnZS5cclxuICAgICAqL1xyXG4gICAgc3RvcmVUb2tlbj86ICh0b2tlbjogT0F1dGgyVG9rZW4pID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbHNvIGFuIG9wdGlvbmFsIGZlYXR1cmUuIEltcGxlbWVudCB0aGlzIGlmIHlvdSB3YW50IHRoZSB3cmFwcGVyIHRvIHRyeSBhXHJcbiAgICAgKiBzdG9yZWQgdG9rZW4gYmVmb3JlIGF0dGVtcHRpbmcgYSBmdWxsIHJlLWF1dGhlbnRpY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gbnVsbCBpZiB0aGVyZSB3YXMgbm8gdG9rZW4uXHJcbiAgICAgKi9cclxuICAgIGdldFN0b3JlZFRva2VuPzogKCkgPT4gT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IHNjaGVkdWxlIHRva2VuIHJlZnJlc2guXHJcbiAgICAgKlxyXG4gICAgICogQ2VydGFpbiBleGVjdXRpb24gZW52aXJvbm1lbnRzLCBlLmcuIFJlYWN0IE5hdGl2ZSwgZG8gbm90IGhhbmRsZSBzY2hlZHVsZWRcclxuICAgICAqIHRhc2tzIHdpdGggc2V0VGltZW91dCgpIGluIGEgZ3JhY2VmdWwgb3IgcHJlZGljdGFibGUgZmFzaGlvbi4gVGhlIGRlZmF1bHRcclxuICAgICAqIGJlaGF2aW9yIGlzIHRvIHNjaGVkdWxlIHJlZnJlc2guIFNldCB0aGlzIHRvIGZhbHNlIHRvIGRpc2FibGUgc2NoZWR1bGluZy5cclxuICAgICAqL1xyXG4gICAgc2NoZWR1bGVSZWZyZXNoPzogYm9vbGVhbjtcclxuXHJcbiAgICBmZXRjaD86IHR5cGVvZiBmZXRjaDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZldGNoV3JhcHBlckN1c3RvbSB7XHJcblxyXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDdXJyZW50IGFjdGl2ZSB0b2tlbiAoaWYgYW55KVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIHVzZXIgaGFkIGEgc3RvcmVkVG9rZW4sIHRoZSBwcm9jZXNzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBtYXkgYmUgYXN5bmMuIFdlIGtlZXAgdHJhY2sgb2YgdGhpcyBwcm9jZXNzIGluIHRoaXNcclxuICAgICAqIHByb21pc2UsIHNvIGl0IG1heSBiZSBhd2FpdGVkIHRvIGF2b2lkIHJhY2UgY29uZGl0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBBcyBzb29uIGFzIHRoaXMgcHJvbWlzZSByZXNvbHZlcywgdGhpcyBwcm9wZXJ0eSBnZXQgbnVsbGVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZUdldFN0b3JlZFRva2VuOiBudWxsIHwgUHJvbWlzZTx2b2lkPiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zKSB7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zPy5zY2hlZHVsZVJlZnJlc2ggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNjaGVkdWxlUmVmcmVzaCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gYXdhaXQgb3B0aW9ucy5nZXRTdG9yZWRUb2tlbiEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvZXMgYSBmZXRjaCByZXF1ZXN0IGFuZCBhZGRzIGEgQmVhcmVyIC8gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCB0aGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBmaXJzdC4gSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBhbG1vc3QgZXhwaXJpbmcsIHRoaXMgZnVuY3Rpb24gbWlnaHQgYXR0ZW1wdFxyXG4gICAgICogdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZmV0Y2goaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgICAgICBpZiAoaW5pdC5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYWNjZXNzVG9rZW5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnMgPSB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgYWNjZXNzVG9rZW59XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgbmV3VG9rZW5cclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgdG9rZW4gaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhlcmUgcmVzdWx0IG9iamVjdCB3aWxsIGhhdmU6XHJcbiAgICAgKiAgICogYWNjZXNzVG9rZW5cclxuICAgICAqICAgKiBleHBpcmVzQXQgLSB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBudWxsLlxyXG4gICAgICogICAqIHJlZnJlc2hUb2tlbiAtIG1heSBiZSBudWxsXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGF0dGVtcHQgdG8gYXV0b21hdGljYWxseSByZWZyZXNoIGlmIHN0YWxlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLmV4cGlyZXNBdCA9PT0gbnVsbCB8fCB0aGlzLnRva2VuLmV4cGlyZXNBdCA+IERhdGUubm93KCkpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgY3VycmVudCB0b2tlbiBpcyBzdGlsbCB2YWxpZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgY3VycmVudCBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCBpdCB3aWxsIGF0dGVtcHQgdG8gZmV0Y2ggaXQuXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGV4cGlyaW5nLCBpdCB3aWxsIGF0dGVtcHQgdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0QWNjZXNzVG9rZW4oKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgLy8gRW5zdXJlIGdldFN0b3JlZFRva2VuIGZpbmlzaGVkLlxyXG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW47XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiB0b2tlbi5hY2Nlc3NUb2tlbjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBLZWVwaW5nIHRyYWNrIG9mIGFuIGFjdGl2ZSByZWZyZXNoVG9rZW4gb3BlcmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgd2lsbCBhbGxvdyB1cyB0byBlbnN1cmUgb25seSAxIHN1Y2ggb3BlcmF0aW9uIGhhcHBlbnMgYXQgYW55XHJcbiAgICAgKiBnaXZlbiB0aW1lLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZVJlZnJlc2g6IFByb21pc2U8T0F1dGgyVG9rZW4+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZXMgYW4gYWNjZXNzIHRva2VuIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgY3VycmVudGx5IGFscmVhZHkgZG9pbmcgdGhpcyBvcGVyYXRpb24sXHJcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBkbyBpdCB0d2ljZSBpbiBwYXJhbGxlbC5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZFRva2VuID0gdGhpcy50b2tlbjtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSAoYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1Rva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRUb2tlbj8ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGFkIGEgcmVmcmVzaCB0b2tlbiwgbGV0cyBzZWUgaWYgd2UgY2FuIHVzZSBpdCFcclxuICAgICAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKG9sZFRva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZVxcJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yPy4oZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VG9rZW47XHJcblxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zdG9yZVRva2VuPy4odG9rZW4pO1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY2xlYXIgdGhlIGN1cnJlbnQgcmVmcmVzaCBvcGVyYXRpb24uXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRpbWVyIHRyaWdnZXIgZm9yIHRoZSBuZXh0IGF1dG9tYXRlZCByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc2NoZWR1bGVSZWZyZXNoKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lcikge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4/LmV4cGlyZXNBdCB8fCAhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBkb24ndCBoYXZlIGEgcmVmcmVzaF90b2tlbiwgZG9uJ3QgYm90aGVyLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSB0aGlzLnRva2VuLmV4cGlyZXNBdCAtIERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgc2NoZWR1bGUgdGhpcyBldmVudCBpZiBpdCBoYXBwZW5zIG1vcmUgdGhhbiAyIG1pbnV0ZXMgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICBpZiAoZXhwaXJlc0luIDwgMTIwICogMTAwMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTY2hlZHVsZSAxIG1pbnV0ZSBiZWZvcmUgZXhwaXJ5XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoJywgZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGV4cGlyZXNJbiAtIDYwICogMTAwMCk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0FwaUV4Y2VwdGlvbiwgQ2xpZW50LCBMb3RJbmZvLCBWYWxpZGF0aW9uUHJvYmxlbURldGFpbHN9IGZyb20gXCIuL0ViYXlDbGllbnQvRWJheUNsaWVudFwiXHJcbmltcG9ydCB7Z2VuZXJhdGVDb2RlVmVyaWZpZXIsIE9BdXRoMkNsaWVudH0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcbmltcG9ydCB7RmV0Y2hXcmFwcGVyQ3VzdG9tfSBmcm9tIFwiLi9GZXRjaFdyYXBwZXJDdXN0b21cIjtcclxuXHJcbmNvbnN0IHBhbmVsQ2xhc3MgPSBcInBhbmVsLWRpdlwiO1xyXG5jb25zdCBmb3JtSWQgPSBcInByb2R1Y3QtZm9ybS1pZFwiXHJcbmNvbnN0IGlkRmllbGROYW1lID0gXCJsb3RJZFwiO1xyXG5jb25zdCBuYW1lRmllbGROYW1lID0gXCJuYW1lXCI7XHJcbmNvbnN0IHByb2R1Y3RGaWVsZE5hbWUgPSBcInByb2R1Y3RJZFwiO1xyXG5jb25zdCBwY3NGaWVsZE5hbWUgPSBcInBjc1wiO1xyXG5jb25zdCBwcmljZUZpZWxkTmFtZSA9IFwicHJpY2VcIjtcclxuY29uc3Qgc2hpcHBpbmdGaWVsZE5hbWUgPSBcInNoaXBwaW5nXCI7XHJcbmNvbnN0IHNoaXBwaW5nQWRkaXRpb25hbEZpZWxkTmFtZSA9IFwic2hpcHBpbmdBZGRpdGlvbmFsXCI7XHJcbmNvbnN0IGRlc2NyaXB0aW9uRmllbGROYW1lID0gXCJkZXNjcmlwdGlvblwiO1xyXG5jb25zdCBjb25kaXRpb25GaWVsZE5hbWUgPSBcImNvbmRpdGlvblwiO1xyXG5jb25zdCBjb25kaXRpb25EZXNjcmlwdGlvbkZpZWxkTmFtZSA9IFwiY29uZGl0aW9uRGVzY3JpcHRpb25cIjtcclxuY29uc3Qgc2VsbGVyRmllbGROYW1lID0gXCJzZWxsZXJcIjtcclxuY29uc3QgcHVyY2hhc2VIaXN0b3J5RmllbGROYW1lID0gXCJwdXJjaGFzZUhpc3RvcnlcIjtcclxuY29uc3QgbG9jYXRlZEluRmllbGROYW1lID0gXCJsb2NhdGVkSW5cIjtcclxuY29uc3QgZXJyb3JFbGVtZW50SWQgPSBcImVycm9yRWxlbWVudFwiXHJcbmNvbnN0IHN1Ym1pdElkID0gXCJzdWJtaXRcIlxyXG5jb25zdCBiYWNrZW5kVXJsID0gXCJodHRwczovL2xvY2FsaG9zdDo3MDk1L1wiXHJcbmNvbnN0IGJhc2VBcGlVcmwgPSBgJHtiYWNrZW5kVXJsfWFwaS9lYmF5L3YxYDtcclxuY29uc3QgYXV0aFJlZGlyZWN0VXJsID0gXCJodHRwczovL3d3dy5lYmF5LmNvbS9cIlxyXG5cclxuLy8gZmV0Y2gg0YfQtdGA0LXQtyBiYWNrZ3JvdW5kIHNjcmlwdCwg0L/QviDQtNGA0YPQs9C+0LzRgyDQvdC1INGA0LDQsdC+0YLQsNC10YJcclxuZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZShpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7aW5wdXQsIGluaXR9LCBtZXNzYWdlUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBbcmVzcG9uc2UsIGVycm9yXSA9IG1lc3NhZ2VSZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHVuZGVmaW5lZCBvbiBhIDIwNCAtIE5vIENvbnRlbnRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXNwb25zZS5ib2R5ID8gbmV3IEJsb2IoW3Jlc3BvbnNlLmJvZHldKSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiByZXNwb25zZS5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBleHRyYWN0UHJpY2UocHJpY2UpIHtcclxuICAgIGxldCBtYXRjaGVzID0gcHJpY2UubWF0Y2goLyhcXEQrKShcXGQrKD86WywuXVxcZCspPykvKVxyXG4gICAgaWYgKG1hdGNoZXNbMV0gIT09IFwiVVMgJFwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUyAkIHByaWNlIGV4cGVjdGVkLCBidXQgd2FzJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWF0Y2hlc1syXS5yZXBsYWNlKCcsJywgJy4nKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVIaXN0b3J5QnV0dG9uKCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IGRvbWFpbiA9IGxvY2F0aW9uLmhvc3RuYW1lO1xyXG4gICAgbGV0IGhpc3RvcnlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBoaXN0b3J5QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpc3RvcnktYnV0dG9uJyk7XHJcbiAgICBoaXN0b3J5QnV0dG9uLnRleHRDb250ZW50ID0gJ0hJU1RPUlknO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi5ocmVmID0gYGh0dHBzOi8vJHtkb21haW59L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDVweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjA7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgcGFkZGluZzogM3B4IDZweDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIGNvbG9yOiBibGFjaztcclxuICBgO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi50YXJnZXQgPSAnX2JsYW5rJztcclxuXHJcbiAgICByZXR1cm4gaGlzdG9yeUJ1dHRvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSGlzdG9yeUJ1dHRvbigpIHtcclxuICAgIGxldCBwcm9kdWN0VGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmltW2RhdGEtdGVzdGlkPVwieC1pdGVtLXRpdGxlXCJdJyk7XHJcbiAgICBpZiAocHJvZHVjdFRpdGxlQ29udGFpbmVyKSB7XHJcbiAgICAgICAgbGV0IGV4aXN0aW5nQnV0dG9uID0gcHJvZHVjdFRpdGxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2EuaGlzdG9yeS1idXR0b24nKTtcclxuICAgICAgICBpZiAoIWV4aXN0aW5nQnV0dG9uKSB7XHJcbiAgICAgICAgICAgIGxldCBoaXN0b3J5QnV0dG9uID0gY3JlYXRlSGlzdG9yeUJ1dHRvbigpO1xyXG4gICAgICAgICAgICBwcm9kdWN0VGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoaGlzdG9yeUJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHN0eWxlcyA9IGBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgcGFkZGluZzogMTVweDtcclxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzAwMDBjYztcclxuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgY29sb3I6ICMwMDAwY2M7XHJcbiAgICAgIHBvc2l0aW9uOmZpeGVkO1xyXG4gICAgICB6LWluZGV4OjEwMDtcclxuICAgICAgbGVmdDoxJTtcclxuICAgICAgYm90dG9tOjUlO1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWwge1xyXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGlucHV0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBzZWxlY3Qge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsOmFmdGVyIHsgY29udGVudDogXCI6IFwiIH1cclxuYFxyXG5cclxuICAgIGxldCBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpXHJcbiAgICBzdHlsZVNoZWV0LmlubmVyVGV4dCA9IHN0eWxlc1xyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGVTaGVldClcclxuXHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChwYW5lbENsYXNzKTtcclxuXHJcbiAgICBcclxuICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpXHJcbiAgICBmb3JtLmlkID0gZm9ybUlkXHJcbiAgICBcclxuICAgIC8vIGxhbmd1YWdlPUhUTUxcclxuICAgIGZvcm0uaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZEZpZWxkTmFtZX1cIj5JZDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIiR7aWRGaWVsZE5hbWV9XCIgdHlwZT1cIm51bWJlclwiIG5hbWU9XCIke2lkRmllbGROYW1lfVwiIHJlYWRvbmx5Lz5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPtCi0L7QstCw0YA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8c2VsZWN0IG5hbWU9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCIgaWQ9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDRgtC+0LLQsNGAPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke25hbWVGaWVsZE5hbWV9XCI+TmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIiR7bmFtZUZpZWxkTmFtZX1cIiB0eXBlPVwidGV4dFwiIG5hbWU9XCIke25hbWVGaWVsZE5hbWV9XCIgcmVhZG9ubHkvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke3Bjc0ZpZWxkTmFtZX1cIj5QQ1M8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCIke3Bjc0ZpZWxkTmFtZX1cIiB0eXBlPVwidGV4dFwiIG5hbWU9XCIke3Bjc0ZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7cHJpY2VGaWVsZE5hbWV9XCI+UHJpY2UgVVMkPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiJHtwcmljZUZpZWxkTmFtZX1cIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDFcIiBuYW1lPVwiJHtwcmljZUZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7c2hpcHBpbmdGaWVsZE5hbWV9XCI+U2hpcHBpbmcgdG8gR2VybWFueTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIiR7c2hpcHBpbmdGaWVsZE5hbWV9XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAxXCIgbmFtZT1cIiR7c2hpcHBpbmdGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke3NoaXBwaW5nQWRkaXRpb25hbEZpZWxkTmFtZX1cIj5TaGlwcGluZyBlYWNoIGFkZGl0aW9uYWw8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCIke3NoaXBwaW5nQWRkaXRpb25hbEZpZWxkTmFtZX1cIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDFcIiBuYW1lPVwiJHtzaGlwcGluZ0FkZGl0aW9uYWxGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2NvbmRpdGlvbkZpZWxkTmFtZX1cIj5Db25kaXRpb248L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCIke2NvbmRpdGlvbkZpZWxkTmFtZX1cIiB0eXBlPVwidGV4dFwiIG5hbWU9XCIke2NvbmRpdGlvbkZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7Y29uZGl0aW9uRGVzY3JpcHRpb25GaWVsZE5hbWV9XCI+Q29uZGl0aW9uIGRlc2NyaXB0aW9uPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiJHtjb25kaXRpb25EZXNjcmlwdGlvbkZpZWxkTmFtZX1cIiB0eXBlPVwidGV4dFwiIG5hbWU9XCIke2NvbmRpdGlvbkRlc2NyaXB0aW9uRmllbGROYW1lfVwiLz5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtkZXNjcmlwdGlvbkZpZWxkTmFtZX1cIj5EZXNjcmlwdGlvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIiR7ZGVzY3JpcHRpb25GaWVsZE5hbWV9XCIgdHlwZT1cInRleHRcIiBuYW1lPVwiJHtkZXNjcmlwdGlvbkZpZWxkTmFtZX1cIiByZWFkb25seS8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7cHVyY2hhc2VIaXN0b3J5RmllbGROYW1lfVwiPlB1cmNoYXNlSGlzdG9yeTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIiR7cHVyY2hhc2VIaXN0b3J5RmllbGROYW1lfVwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIiR7cHVyY2hhc2VIaXN0b3J5RmllbGROYW1lfVwiIHJlYWRvbmx5Lz5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtzZWxsZXJGaWVsZE5hbWV9XCI+U2VsbGVyPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiJHtzZWxsZXJGaWVsZE5hbWV9XCIgdHlwZT1cInRleHRcIiBuYW1lPVwiJHtzZWxsZXJGaWVsZE5hbWV9XCIgcmVhZG9ubHkvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2xvY2F0ZWRJbkZpZWxkTmFtZX1cIj5Mb2NhdGVkIGluPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiJHtsb2NhdGVkSW5GaWVsZE5hbWV9XCIgdHlwZT1cInRleHRcIiBuYW1lPVwiJHtsb2NhdGVkSW5GaWVsZE5hbWV9XCIgcmVhZG9ubHkvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJjb2xvcjogcmVkO1wiIGlkPVwiJHtlcnJvckVsZW1lbnRJZH1cIj48L2Rpdj5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCIke3N1Ym1pdElkfVwiIHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlNhdmVcIiBkaXNhYmxlZC8+YDtcclxuXHJcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKCBldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoZXZlbnQsIGNsaWVudClcclxuICAgIH0pOyBcclxuICAgIFxyXG4gICAgZGl2LmFwcGVuZENoaWxkKGZvcm0pXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTdWJtaXQoZXZlbnQ6IFN1Ym1pdEV2ZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+ZXZlbnQudGFyZ2V0KTtcclxuICAgIGxldCBvYmplY3QgPSB7fTtcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KXsgb2JqZWN0W2tleV0gPSB2YWx1ZTsgfSk7XHJcblxyXG4gICAgbGV0ICBsb3RpbmZvID0gTG90SW5mby5mcm9tSlMob2JqZWN0KVxyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGNsaWVudC51cHNlcnRMb3RJbmZvKGxvdGluZm8sIGRhdGEuZ2V0KCdwcm9kdWN0SWQnKS50b1N0cmluZygpKVxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQXBpRXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBhcGlFeGNlcHRpb24gPSA8QXBpRXhjZXB0aW9uPmVycm9yXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFwaUV4Y2VwdGlvbi5zdGF0dXMpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFwaUV4Y2VwdGlvbi5yZXNwb25zZSlcclxuICAgICAgICAgICAgLy90b2RvINGC0YPRgiA0MDBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzLCByZXN1bHQpIHtcclxuICAgIGZvciAobGV0IGZpeGVkUHJpY2VSb3cgb2YgZml4ZWRQcmljZVJvd3MpIHtcclxuICAgICAgICBsZXQgY29sdW1ucyA9IFsuLi5maXhlZFByaWNlUm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHByaWNlID0gY29sdW1uc1sxXVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgPT09IFwiRXhwaXJlZFwiIHx8IHByaWNlID09PSBcIkRlY2xpbmVkXCIpIHtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXN1bHRJdGVtID0ge31cclxuXHJcbiAgICAgICAgaWYgKHByaWNlICE9PSBcIlNvbGQgYXMgYSBzcGVjaWFsIG9mZmVyXCIgJiYgcHJpY2UgIT09IFwiQ291bnRlci1vZmZlcmVkXCIgJiYgcHJpY2UgIT09IFwiQWNjZXB0ZWRcIikge1xyXG4gICAgICAgICAgICByZXN1bHRJdGVtWydwcmljZSddID0gZXh0cmFjdFByaWNlKHByaWNlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0SXRlbVsncXVhbnRpdHknXSA9IGNvbHVtbnNbMl1cclxuICAgICAgICByZXN1bHRJdGVtWydkYXRlJ10gPSBwYXJzZURhdGUoY29sdW1uc1szXSlcclxuXHJcbiAgICAgICAgcmVzdWx0LnB1c2gocmVzdWx0SXRlbSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBtYXRjaGVzID0gZGF0ZVN0cmluZy5tYXRjaCgvKFxcZCtcXHNbQS16XStcXHNcXGQrKVxcc2F0XFxzKFxcZCspOihcXGQrKTooXFxkKykoYW18cG0pXFxzKFtBLXpdKykvKVxyXG5cclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShtYXRjaGVzWzFdICsgJyAwMDowMDowMC4wMDBaJykpXHJcblxyXG4gICAgZGF0ZS5zZXRVVENIb3VycyhwYXJzZUludChtYXRjaGVzWzJdKSk7XHJcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMocGFyc2VJbnQobWF0Y2hlc1szXSkpO1xyXG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKHBhcnNlSW50KG1hdGNoZXNbNF0pKTtcclxuXHJcbiAgICBpZiAobWF0Y2hlc1s1XSA9PT0gXCJwbVwiICYmIGRhdGUuZ2V0VVRDSG91cnMoKSAhPT0gMTIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSArIDEyKTtcclxuICAgIH1cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcImFtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpID09PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMTIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaGVzWzZdID09PSBcIk1TS1wiKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0aW1lem9uZSBcIiArIG1hdGNoZXNbNl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dCkge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gW11cclxuICAgIGxldCBmaXhlZFByaWNlQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2LmZpeGVkLXByaWNlIHRib2R5JylcclxuICAgIGlmIChmaXhlZFByaWNlQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgZml4ZWRQcmljZVJvd3MgPSBbLi4uZml4ZWRQcmljZUJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb2ZmZXJCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYub2ZmZXIgdGJvZHknKVxyXG4gICAgaWYgKG9mZmVyQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgb2ZmZXJSb3dzID0gWy4uLm9mZmVyQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KG9mZmVyUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbElkKHBhbmVsKSB7XHJcbiAgICBsZXQgaWRGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBpZEZpZWxkTmFtZSlcclxuICAgIGlkRmllbGQudmFsdWUgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFByaWNlKHBhbmVsKSB7XHJcbiAgICBsZXQgcHJpY2VGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBwcmljZUZpZWxkTmFtZSlcclxuICAgIHByaWNlRmllbGQudmFsdWUgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYueC1wcmljZS1wcmltYXJ5IHNwYW4nKSkuaW5uZXJUZXh0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsTmFtZShwYW5lbCkge1xyXG4gICAgbGV0IG5hbWVGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBuYW1lRmllbGROYW1lKVxyXG4gICAgbmFtZUZpZWxkLnZhbHVlID0gKDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmltIGgxJykpLmlubmVyVGV4dFxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsU2VsbGVyKHBhbmVsKSB7XHJcbiAgICBsZXQgc2VsbGVyRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgc2VsbGVyRmllbGROYW1lKVxyXG4gICAgc2VsbGVyRmllbGQudmFsdWUgPSAoPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LXNlbGxlcmNhcmQtYXRmX19pbmZvX19hYm91dC1zZWxsZXIgYScpKS5pbm5lclRleHQudG9Mb3dlckNhc2UoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsQ29uZGl0aW9uKHBhbmVsKSB7XHJcbiAgICBsZXQgY29uZGl0aW9uRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgY29uZGl0aW9uRmllbGROYW1lKVxyXG4gICAgY29uZGl0aW9uRmllbGQudmFsdWUgPSAoPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLXRleHQgc3Bhbi51eC10ZXh0c3BhbnMnKSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbihwYW5lbCkge1xyXG4gICAgbGV0IGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLWRlc2MnKVxyXG4gICAgaWYgKGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGNvbmRpdGlvbkRlc2NyaXB0aW9uRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgY29uZGl0aW9uRGVzY3JpcHRpb25GaWVsZE5hbWUpXHJcbiAgICAgICAgY29uZGl0aW9uRGVzY3JpcHRpb25GaWVsZC52YWx1ZSA9ICg8SFRNTEVsZW1lbnQ+Y29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50KS5pbm5lclRleHRcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnCcsICcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCdJywgJycpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxTaGlwcGluZyhwYW5lbCkge1xyXG4gICAgbGV0IHNoaXBwaW5nRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgc2hpcHBpbmdGaWVsZE5hbWUpXHJcbiAgICBsZXQgc2hpcHBpbmdBZGRpdGlvbmFsRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgc2hpcHBpbmdBZGRpdGlvbmFsRmllbGROYW1lKVxyXG4gICAgbGV0IHNoaXBwaW5nUmF0ZXNBdmFpbGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYudXgtbGF5b3V0LXNlY3Rpb25fX3RleHR1YWwtZGlzcGxheS0tYXNrU2VsbGVyJykgPT09IG51bGxcclxuICAgIGlmIChzaGlwcGluZ1JhdGVzQXZhaWxhYmxlKSB7XHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlciA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZC1zaGlwcGluZy1tYXh2aWV3IHRoZWFkJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJyldXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZC1zaGlwcGluZy1tYXh2aWV3IHRib2R5JylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ3RyJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ01heHZpZXdWYWx1ZXMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlcltpXS5pbm5lclRleHRcclxuICAgICAgICAgICAgc2hpcHBpbmdNYXh2aWV3VmFsdWVzW2tleV0gPSBkZWxpdmVyeUNvbHVtbnNWYWx1ZXNbaV0ucXVlcnlTZWxlY3Rvcignc3BhbicpLmlubmVyVGV4dFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snVG8nXSAhPT0gJ0dlcm1hbnknKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcHBpbmcgY291bnRyeSBtdXN0IGJlIEdlcm1hbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ1ZhbHVlID0gc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydTaGlwcGluZyBhbmQgaGFuZGxpbmcnXVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdWYWx1ZSAhPT0gJ0ZyZWUgc2hpcHBpbmcnKSB7XHJcbiAgICAgICAgICAgIHNoaXBwaW5nRmllbGQudmFsdWUgPSBleHRyYWN0UHJpY2Uoc2hpcHBpbmdWYWx1ZSlcclxuXHJcbiAgICAgICAgICAgIGlmIChzaGlwcGluZ01heHZpZXdWYWx1ZXMuaGFzT3duUHJvcGVydHkoJ0VhY2ggYWRkaXRpb25hbCBpdGVtJykpIHtcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nQWRkaXRpb25hbEZpZWxkLnZhbHVlID0gZXh0cmFjdFByaWNlKHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snRWFjaCBhZGRpdGlvbmFsIGl0ZW0nXSlcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaGlwcGluZ0FkZGl0aW9uYWxGaWVsZC52YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hpcHBpbmdGaWVsZC52YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIHNoaXBwaW5nQWRkaXRpb25hbEZpZWxkLnZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxMb2NhdGVkSW4ocGFuZWwpIHtcclxuICAgIGxldCBsb2NhdGVkSW5GaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBsb2NhdGVkSW5GaWVsZE5hbWUpXHJcbiAgICBsb2NhdGVkSW5GaWVsZC52YWx1ZSA9ICg8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LnV4LWxhYmVscy12YWx1ZXMtLWxlZ2FsU2hpcHBpbmcgZGl2LmNvbC05JykpLmlubmVyVGV4dC5zcGxpdChcIkxvY2F0ZWQgaW46IFwiKVsxXVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsRGVzY3JpcHRpb24ocGFuZWwpIHtcclxuICAgIGxldCBkZXNjcmlwdGlvblVybCA9ICg8SFRNTElGcmFtZUVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Rlc2NfaWZyJykpLnNyY1xyXG4gICAgZmV0Y2hSZXNvdXJjZShkZXNjcmlwdGlvblVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXNwb25zZS50ZXh0KCkudGhlbigodGV4dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIGRlc2NyaXB0aW9uRmllbGROYW1lKS52YWx1ZSA9IHRleHRcclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvd0Vycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICBzaG93RXJyb3IoZXJyKVxyXG4gICAgICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxQdXJjaGFzZUhpc3RvcnkocGFuZWwpIHtcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBwdXJjaGFzZUhpc3RvcnlVcmwgPSBgaHR0cHM6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIGZldGNoUmVzb3VyY2UocHVyY2hhc2VIaXN0b3J5VXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICg8UmVzcG9uc2U+cmVzcG9uc2UpLnRleHQoKS50aGVuKCh0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgcHVyY2hhc2VIaXN0b3J5RmllbGROYW1lKS52YWx1ZSA9IHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0KVxyXG5cclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvd0Vycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICBzaG93RXJyb3IoZXJyKVxyXG4gICAgICAgIH0pXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcm9kdWN0KHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwcm9kdWN0RmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QjJyArIHByb2R1Y3RGaWVsZE5hbWUpO1xyXG4gICAgbGV0IHNlYXJjaFF1ZXJ5ICA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZG9jdW1lbnQucmVmZXJyZXIpPy5nZXQoJ19ua3cnKT8udHJpbSgpPy50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IGNsaWVudC5nZXRBbGxQcm9kdWN0cygpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHByb2R1Y3RzW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBwcm9kdWN0c1tpXS5uYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkICYmIHNlYXJjaFF1ZXJ5ID09PSBwcm9kdWN0c1tpXS5zZWFyY2hRdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSApIHtcclxuICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9kdWN0RmllbGQuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFBhbmVsV2l0aERhdGEoY2xpZW50KSB7XHJcbiAgICBsZXQgcGFuZWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzKVxyXG4gICAgZmlsbElkKHBhbmVsKTtcclxuICAgIGF3YWl0IGZpbGxQcm9kdWN0KHBhbmVsLCBjbGllbnQpO1xyXG4gICAgZmlsbFByaWNlKHBhbmVsKTtcclxuICAgIGZpbGxOYW1lKHBhbmVsKTtcclxuICAgIGZpbGxTZWxsZXIocGFuZWwpO1xyXG4gICAgZmlsbENvbmRpdGlvbihwYW5lbCk7XHJcbiAgICBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24ocGFuZWwpO1xyXG4gICAgZmlsbFNoaXBwaW5nKHBhbmVsKTtcclxuICAgIGZpbGxMb2NhdGVkSW4ocGFuZWwpO1xyXG4gICAgZmlsbERlc2NyaXB0aW9uKHBhbmVsKTtcclxuICAgIGZpbGxQdXJjaGFzZUhpc3RvcnkocGFuZWwpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkUGFuZWwoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBib2R5RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuICAgIGlmIChib2R5RWxlbWVudCkge1xyXG4gICAgICAgIGxldCBleGlzdGluZ1BhbmVsID0gYm9keUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgICAgICBpZiAoIWV4aXN0aW5nUGFuZWwpIHtcclxuICAgICAgICAgICAgY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IpIHtcclxuICAgIGxldCBlcnJvckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcyArICcgIycgKyBlcnJvckVsZW1lbnRJZClcclxuXHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHNwYW4uaW5uZXJIVE1MID0gZXJyb3Iuc3RhY2s7XHJcbiAgICBlcnJvckRpdi5hcHBlbmRDaGlsZChzcGFuKVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVTdWJtaXRCdXR0b24oKSB7XHJcbiAgICAoPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgc3VibWl0SWQpKS5kaXNhYmxlZCA9IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6ZUZldGNoKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KSA6IEZldGNoV3JhcHBlckN1c3RvbSB7XHJcbiAgICByZXR1cm4gIG5ldyBGZXRjaFdyYXBwZXJDdXN0b20oe1xyXG4gICAgICAgIGNsaWVudDogb0F1dGgyQ2xpZW50LFxyXG4gICAgICAgIGdldE5ld1Rva2VuOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50UGFnZSA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyBsb2NhdGlvbi5wYXRobmFtZVxyXG4gICAgICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gYXdhaXQgZ2VuZXJhdGVDb2RlVmVyaWZpZXIoKTtcclxuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXIsIHJldHVybl90b19wYWdlOiBjdXJyZW50UGFnZX0pXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldEF1dGhvcml6ZVVyaSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsnRWJheS5TZXJ2ZXJBUEknXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTdG9yZWRUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRva2VuX3N0b3JlXCJdKSkudG9rZW5fc3RvcmU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIEpTT04ucGFyc2UodG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwcm9kdWN0UGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBhZGRIaXN0b3J5QnV0dG9uKCk7XHJcbiAgICAgICAgYWRkUGFuZWwoY2xpZW50KTtcclxuICAgICAgICBhd2FpdCBmaWxsUGFuZWxXaXRoRGF0YShjbGllbnQpO1xyXG4gICAgICAgIC8vdG9kbyDRgNCw0LfRgNC10YjQsNGC0Ywg0YLQvtC70YzQutC+INC10YHQu9C4INCy0L7QvtCx0YnQtSDQvdC10YIg0L7RiNC40LHQvtC6XHJcbiAgICAgICAgZW5hYmxlU3VibWl0QnV0dG9uKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKTtcclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYXV0aFBhZ2Uob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpIHtcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJjb2RlXCIpKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcbiAgICAgICAgbGV0IG9hdXRoMlRva2VuID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHt0b2tlbl9zdG9yZTogSlNPTi5zdHJpbmdpZnkob2F1dGgyVG9rZW4pfSlcclxuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJyZXR1cm5fdG9fcGFnZVwiXSkpLnJldHVybl90b19wYWdlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcbiAgICBsZXQgb0F1dGgyQ2xpZW50ID0gbmV3IE9BdXRoMkNsaWVudCh7XHJcbiAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgIGNsaWVudElkOiAnRWJheS5DaHJvbWVFeHRlbnNpb24nLFxyXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6ICcvY29ubmVjdC90b2tlbicsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyBsb2NhdGlvbi5wYXRobmFtZSA9PT0gYXV0aFJlZGlyZWN0VXJsKSB7XHJcbiAgICAgICAgYXdhaXQgYXV0aFBhZ2Uob0F1dGgyQ2xpZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNsaWVudCA9IG5ldyBDbGllbnQoYmFzZUFwaVVybCwgZ2V0QXV0aG9yaXplRmV0Y2gob0F1dGgyQ2xpZW50KSk7XHJcbiAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9