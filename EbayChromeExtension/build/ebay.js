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
exports.ApiException = exports.Errors = exports.ValidationProblemDetails = exports.ProblemDetails = exports.LotState = exports.ManualCondition = exports.PurchaseInfo = exports.LotInfo = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
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
    /**
     * Получает информацию о учтенных лотах
     * @return Ok
     */
    getLotStates(lotIds) {
        let url_ = this.baseUrl + "/lot_state_requests/";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(lotIds);
        let options_ = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetLotStates(_response);
        });
    }
    processGetLotStates(response) {
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
                        result200.push(LotState.fromJS(item));
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
     * Отдает перечень возможных состояний продаваемого товара
     * @return Ok
     */
    getManualConditionsList() {
        let url_ = this.baseUrl + "/manual_conditions/";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetManualConditionsList(_response);
        });
    }
    processGetManualConditionsList(response) {
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
                        result200.push(ManualCondition.fromJS(item));
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
            this.ignoreThatLot = _data["ignoreThatLot"];
            this.manualConditionId = _data["manualConditionId"];
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
        data["ignoreThatLot"] = this.ignoreThatLot;
        data["manualConditionId"] = this.manualConditionId;
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
class ManualCondition {
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
            this.id = _data["id"];
            this.description = _data["description"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ManualCondition();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["description"] = this.description;
        return data;
    }
}
exports.ManualCondition = ManualCondition;
class LotState {
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
            this.lotId = _data["lotId"];
            this.ignoreThatLot = _data["ignoreThatLot"];
            this.lastUpdate = _data["lastUpdate"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new LotState();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["lotId"] = this.lotId;
        data["ignoreThatLot"] = this.ignoreThatLot;
        data["lastUpdate"] = this.lastUpdate;
        return data;
    }
}
exports.LotState = LotState;
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
const lastUpdateTime = "lastUpdate";
const formId = "product-form-id";
const productFieldName = "productId";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const errorElementId = "errorElement";
const submitId = "submit";
const backendUrl = "https://localhost:7095/";
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/";
const rescanTimeDays = 60;
const lotInfo = new EbayClient_1.LotInfo();
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
        <label for="${lastUpdateTime}">Время актуализации</label>
        <input id="${lastUpdateTime}" type="text" name="${lastUpdateTime}" readonly/>
        <br>
        <label for="${productFieldName}">Товар</label>
        <select name="${productFieldName}" id="${productFieldName}">
            <option value="">Выберите товар</option>
        </select>
        <br>
        <label for="${pcsFieldName}">PCS</label>
        <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
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
        try {
            event.preventDefault();
            let data = new FormData(event.target);
            data.forEach(function (value, key) {
                lotInfo[key] = value;
            });
            console.log(JSON.stringify(lotInfo));
            yield client.upsertLotInfo(lotInfo, data.get('productId').toString());
        }
        catch (error) {
            showError(error);
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
        if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {
            result.push(new EbayClient_1.PurchaseInfo({
                date: parseDate(columns[3]),
                quantity: parseInt(columns[2]),
                price: extractPrice(price)
            }));
        }
        else {
            result.push(new EbayClient_1.PurchaseInfo({
                date: parseDate(columns[3]),
                quantity: parseInt(columns[2])
            }));
        }
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
    let result = new Array();
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
    return result;
}
function fillId() {
    lotInfo.lotId = parseInt(location.pathname.match(/\/itm\/([0-9]+)/)[1]);
}
function fillPrice(panel) {
    let priceField = panel.querySelector('input#' + priceFieldName);
    priceField.value = extractPrice(document.querySelector('div.x-price-primary span').innerText);
}
function fillName() {
    lotInfo.name = document.querySelector('.vim h1').innerText;
}
function fillSeller() {
    lotInfo.seller = document.querySelector('div.x-sellercard-atf__info__about-seller a').innerText.toLowerCase();
}
function fillCondition() {
    lotInfo.condition = document.querySelector('div.x-item-condition-text span.ux-textspans').innerText;
}
function fillConditionDescription() {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc');
    if (conditionDescriptionElement != null) {
        lotInfo.conditionDescription = conditionDescriptionElement.innerText
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
function fillLocatedIn() {
    lotInfo.locatedIn = document.querySelector('div.d-shipping-minview').innerText.match(/Located\sin:\s(.+)/)[1];
}
function fillDescription() {
    let descriptionUrl = document.querySelector('#desc_ifr').src;
    fetchResource(descriptionUrl, { method: 'GET', credentials: 'include' })
        .then((response) => {
        response.text().then((text) => {
            lotInfo.description = text;
        }).catch((err) => {
            showError(err);
        });
    })
        .catch((err) => {
        showError(err);
    });
}
function fillPurchaseHistory() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    fetchResource(purchaseHistoryUrl, { method: 'GET', credentials: 'include' })
        .then((response) => {
        response.text().then((text) => {
            lotInfo.purchaseHistory = parseSoldItemsPage(text);
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
        let searchQuery = (_c = (_b = (_a = new URL(document.referrer).searchParams) === null || _a === void 0 ? void 0 : _a.get('_nkw')) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
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
function fillLastUpdateDate(panel, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentLotInfo = yield client.getLotStates([lotInfo.lotId]);
        let lastUpdateInput = panel.querySelector('input#' + lastUpdateTime);
        if (currentLotInfo.length > 0) {
            let lastUpdate = currentLotInfo[0].lastUpdate;
            let diffInDays = Math.ceil(Math.abs(new Date().getTime() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
            console.log("diff in days " + diffInDays);
            if (diffInDays > rescanTimeDays) {
                lastUpdateInput.style.cssText = `background-color: #df9191;`;
            }
            else {
                lastUpdateInput.style.cssText = `background-color: none;`;
            }
            lastUpdateInput.value = lastUpdate;
        }
        else {
            lastUpdateInput.style.cssText = `background-color: #df9191;`;
        }
    });
}
function fillPanelWithData(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let panel = document.querySelector('div.' + panelClass);
        fillId();
        yield fillLastUpdateDate(panel, client);
        yield fillProduct(panel, client);
        fillPrice(panel);
        fillShipping(panel);
        fillName();
        fillSeller();
        fillCondition();
        fillConditionDescription();
        fillLocatedIn();
        fillDescription();
        fillPurchaseHistory();
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
    if (error instanceof EbayClient_1.ApiException) {
        let apiException = error;
        console.log(apiException.status + " code received");
        console.log(apiException.response);
        span.innerHTML = apiException.status + " " + apiException.response;
    }
    else {
        console.log(error.stack);
        span.innerHTML = error.stack;
    }
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
function searchPage(client) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        //только на странице проданые лоты
        if (((_b = (_a = new URL(document.location.href).searchParams) === null || _a === void 0 ? void 0 : _a.get('LH_Sold')) === null || _b === void 0 ? void 0 : _b.trim()) !== "1")
            return;
        let links = [...document.querySelector('ul.srp-results').querySelectorAll('li.s-item')]
            .map(function (x) {
            let link = x.querySelector('a.s-item__link');
            let soldDate = new Date(x.querySelector('span.POSITIVE').innerText.replace("Sold ", ""));
            return new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate);
        });
        let getLotStatesAnswer = yield client.getLotStates(links.map(function (x) {
            return x.id;
        }));
        let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));
        links.forEach(function (x) {
            if (knownLots.has(x.id)) {
                let lotState = knownLots.get(x.id);
                let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                console.log(diffInDays);
                if (diffInDays > 0) {
                    x.link.style.cssText = `background-color: #e0e07f;`;
                }
                else {
                    x.link.style.cssText = `background-color: none;`;
                }
            }
            else {
                x.link.style.cssText = `background-color: lightpink;`;
            }
        });
    });
}
class LotLink {
    constructor(id, link, soldDate) {
        this.id = id;
        this.link = link;
        this.soldDate = soldDate;
    }
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
        let currentPage = location.protocol + '//' + location.host + location.pathname;
        if (currentPage === authRedirectUrl) {
            yield authPage(oAuth2Client);
        }
        else {
            let client = new EbayClient_1.Client(baseApiUrl, getAuthorizeFetch(oAuth2Client));
            if (currentPage.startsWith("https://www.ebay.com/itm/")) {
                yield productPage(client);
            }
            else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
                yield searchPage(client);
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDO2lCQUFNLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLENBQUM7Z0JBQzdELE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBckJELGtCQXFCQztBQUdELEdBQUcsRUFBRSxDQUFDOzs7Ozs7O1VDdmpCTjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQvYnJvd3Nlci9vYXV0aDItY2xpZW50Lm1pbi5qcyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9FYmF5Q2xpZW50L0ViYXlDbGllbnQudHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRmV0Y2hXcmFwcGVyQ3VzdG9tLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL21haW4udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk9BdXRoMkNsaWVudD10KCk6ZS5PQXV0aDJDbGllbnQ9dCgpfShzZWxmLCgoKT0+KCgpPT57dmFyIGU9ezkzNDooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXQuT0F1dGgyQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoNDQzKSxpPXIoNjE4KTtmdW5jdGlvbiBvKGUsdCl7cmV0dXJuIG5ldyBVUkwoZSx0KS50b1N0cmluZygpfWZ1bmN0aW9uIHMoZSl7cmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGUpLmZpbHRlcigoKFtlLHRdKT0+dm9pZCAwIT09dCkpKSkudG9TdHJpbmcoKX10Lk9BdXRoMkNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmRpc2NvdmVyeURvbmU9ITEsdGhpcy5zZXJ2ZXJNZXRhZGF0YT1udWxsLChudWxsPT1lP3ZvaWQgMDplLmZldGNoKXx8KGUuZmV0Y2g9ZmV0Y2guYmluZChnbG9iYWxUaGlzKSksdGhpcy5zZXR0aW5ncz1lfWFzeW5jIHJlZnJlc2hUb2tlbihlKXtpZighZS5yZWZyZXNoVG9rZW4pdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0b2tlbiBkaWRuJ3QgaGF2ZSBhIHJlZnJlc2hUb2tlbi4gSXQncyBub3QgcG9zc2libGUgdG8gcmVmcmVzaCB0aGlzXCIpO2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJyZWZyZXNoX3Rva2VuXCIscmVmcmVzaF90b2tlbjplLnJlZnJlc2hUb2tlbn07cmV0dXJuIHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0fHwodC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCksdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfWFzeW5jIGNsaWVudENyZWRlbnRpYWxzKGUpe3ZhciB0O2NvbnN0IHI9W1wiY2xpZW50X2lkXCIsXCJjbGllbnRfc2VjcmV0XCIsXCJncmFudF90eXBlXCIsXCJzY29wZVwiXTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+ci5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7ci5qb2luKFwiJywgJ1wiKX0nYCk7Y29uc3Qgbj17Z3JhbnRfdHlwZTpcImNsaWVudF9jcmVkZW50aWFsc1wiLHNjb3BlOm51bGw9PT0odD1udWxsPT1lP3ZvaWQgMDplLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfTtpZighdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpdGhyb3cgbmV3IEVycm9yKFwiQSBjbGllbnRTZWNyZXQgbXVzdCBiZSBwcm92aWRlZCB0byB1c2UgY2xpZW50X2NyZWRlbnRpYWxzXCIpO3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixuKSl9YXN5bmMgcGFzc3dvcmQoZSl7dmFyIHQ7Y29uc3Qgcj17Z3JhbnRfdHlwZTpcInBhc3N3b3JkXCIsLi4uZSxzY29wZTpudWxsPT09KHQ9ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIil9O3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixyKSl9Z2V0IGF1dGhvcml6YXRpb25Db2RlKCl7cmV0dXJuIG5ldyBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50KHRoaXMpfWFzeW5jIGludHJvc3BlY3QoZSl7Y29uc3QgdD17dG9rZW46ZS5hY2Nlc3NUb2tlbix0b2tlbl90eXBlX2hpbnQ6XCJhY2Nlc3NfdG9rZW5cIn07cmV0dXJuIHRoaXMucmVxdWVzdChcImludHJvc3BlY3Rpb25FbmRwb2ludFwiLHQpfWFzeW5jIGdldEVuZHBvaW50KGUpe2lmKHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoXCJkaXNjb3ZlcnlFbmRwb2ludFwiIT09ZSYmKGF3YWl0IHRoaXMuZGlzY292ZXIoKSx2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZighdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiAke2V9LiBFaXRoZXIgc3BlY2lmeSAke2V9IGluIHRoZSBzZXR0aW5ncywgb3IgdGhlIFwic2VydmVyXCIgZW5kcG9pbnQgdG8gbGV0IHRoZSBjbGllbnQgZGlzY292ZXIgaXQuYCk7c3dpdGNoKGUpe2Nhc2VcImF1dGhvcml6YXRpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2F1dGhvcml6ZVwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJ0b2tlbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvdG9rZW5cIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiZGlzY292ZXJ5RW5kcG9pbnRcIjpyZXR1cm4gbyhcIi8ud2VsbC1rbm93bi9vYXV0aC1hdXRob3JpemF0aW9uLXNlcnZlclwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9pbnRyb3NwZWN0XCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpfX1hc3luYyBkaXNjb3Zlcigpe3ZhciBlO2lmKHRoaXMuZGlzY292ZXJ5RG9uZSlyZXR1cm47bGV0IHQ7dGhpcy5kaXNjb3ZlcnlEb25lPSEwO3RyeXt0PWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoXCJkaXNjb3ZlcnlFbmRwb2ludFwiKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgY291bGQgbm90IGJlIGRldGVybWluZWQuIEVpdGhlciBzcGVjaWZ5IHRoZSBcInNlcnZlclwiIG9yIFwiZGlzY292ZXJ5RW5kcG9pbnQnKX1jb25zdCByPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2godCx7aGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvblwifX0pO2lmKCFyLm9rKXJldHVybjtpZighKG51bGw9PT0oZT1yLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSkpcmV0dXJuIHZvaWQgY29uc29sZS53YXJuKFwiW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCB3YXMgbm90IGEgSlNPTiByZXNwb25zZS4gUmVzcG9uc2UgaXMgaWdub3JlZFwiKTt0aGlzLnNlcnZlck1ldGFkYXRhPWF3YWl0IHIuanNvbigpO2NvbnN0IG49W1tcImF1dGhvcml6YXRpb25fZW5kcG9pbnRcIixcImF1dGhvcml6YXRpb25FbmRwb2ludFwiXSxbXCJ0b2tlbl9lbmRwb2ludFwiLFwidG9rZW5FbmRwb2ludFwiXSxbXCJpbnRyb3NwZWN0aW9uX2VuZHBvaW50XCIsXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIl1dO2lmKG51bGwhPT10aGlzLnNlcnZlck1ldGFkYXRhKXtmb3IoY29uc3RbZSxyXW9mIG4pdGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSYmKHRoaXMuc2V0dGluZ3Nbcl09byh0aGlzLnNlcnZlck1ldGFkYXRhW2VdLHQpKTt0aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWQmJiF0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kJiYodGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZD10aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWRbMF0pfX1hc3luYyByZXF1ZXN0KGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEVuZHBvaW50KGUpLGk9e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIn07bGV0IG89dGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZDtzd2l0Y2gob3x8KG89dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQ/XCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6XCJjbGllbnRfc2VjcmV0X3Bvc3RcIiksbyl7Y2FzZVwiY2xpZW50X3NlY3JldF9iYXNpY1wiOmkuQXV0aG9yaXphdGlvbj1cIkJhc2ljIFwiK2J0b2EodGhpcy5zZXR0aW5ncy5jbGllbnRJZCtcIjpcIit0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7Y2FzZVwiY2xpZW50X3NlY3JldF9wb3N0XCI6dC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCx0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKHQuY2xpZW50X3NlY3JldD10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBtZXRob2Qgbm90IHlldCBzdXBwb3J0ZWQ6XCIrbytcIi4gT3BlbiBhIGZlYXR1cmUgcmVxdWVzdCBpZiB5b3Ugd2FudCB0aGlzIVwiKX1jb25zdCBhPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2gocix7bWV0aG9kOlwiUE9TVFwiLGJvZHk6cyh0KSxoZWFkZXJzOml9KTtpZihhLm9rKXJldHVybiBhd2FpdCBhLmpzb24oKTtsZXQgYyxoLHU7dGhyb3cgYS5oZWFkZXJzLmhhcyhcIkNvbnRlbnQtVHlwZVwiKSYmYS5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSYmKGM9YXdhaXQgYS5qc29uKCkpLChudWxsPT1jP3ZvaWQgMDpjLmVycm9yKT8oaD1cIk9BdXRoMiBlcnJvciBcIitjLmVycm9yK1wiLlwiLGMuZXJyb3JfZGVzY3JpcHRpb24mJihoKz1cIiBcIitjLmVycm9yX2Rlc2NyaXB0aW9uKSx1PWMuZXJyb3IpOihoPVwiSFRUUCBFcnJvciBcIithLnN0YXR1cytcIiBcIithLnN0YXR1c1RleHQsNDAxPT09YS5zdGF0dXMmJnRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYoaCs9XCIuIEl0J3MgbGlrZWx5IHRoYXQgdGhlIGNsaWVudElkIGFuZC9vciBjbGllbnRTZWNyZXQgd2FzIGluY29ycmVjdFwiKSx1PW51bGwpLG5ldyBuLk9BdXRoMkVycm9yKGgsdSxhLnN0YXR1cyl9dG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4oZSl7cmV0dXJuIGUudGhlbigoZT0+e3ZhciB0O3JldHVybnthY2Nlc3NUb2tlbjplLmFjY2Vzc190b2tlbixleHBpcmVzQXQ6ZS5leHBpcmVzX2luP0RhdGUubm93KCkrMWUzKmUuZXhwaXJlc19pbjpudWxsLHJlZnJlc2hUb2tlbjpudWxsIT09KHQ9ZS5yZWZyZXNoX3Rva2VuKSYmdm9pZCAwIT09dD90Om51bGx9fSkpfX0sdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXN9LDYxODooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZXRDb2RlQ2hhbGxlbmdlPXQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDkzNCksaT1yKDQ0Myk7YXN5bmMgZnVuY3Rpb24gbyhlKXtjb25zdCB0PXMoKTtpZihudWxsPT10P3ZvaWQgMDp0LnN1YnRsZSlyZXR1cm5bXCJTMjU2XCIsYyhhd2FpdCB0LnN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsYShlKSkpXTt7Y29uc3QgdD1yKDIxMikuY3JlYXRlSGFzaChcInNoYTI1NlwiKTtyZXR1cm4gdC51cGRhdGUoYShlKSksW1wiUzI1NlwiLHQuZGlnZXN0KFwiYmFzZTY0dXJsXCIpXX19ZnVuY3Rpb24gcygpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jcnlwdG8pcmV0dXJuIHdpbmRvdy5jcnlwdG87aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJnNlbGYuY3J5cHRvKXJldHVybiBzZWxmLmNyeXB0bztjb25zdCBlPXIoMjEyKTtyZXR1cm4gZS53ZWJjcnlwdG8/ZS53ZWJjcnlwdG86bnVsbH1mdW5jdGlvbiBhKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09MjU1JmUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH1mdW5jdGlvbiBjKGUpe3JldHVybiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkoZSkpKS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoLz0rJC8sXCJcIil9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmNsaWVudD1lfWFzeW5jIGdldEF1dGhvcml6ZVVyaShlKXtjb25zdFt0LHJdPWF3YWl0IFByb21pc2UuYWxsKFtlLmNvZGVWZXJpZmllcj9vKGUuY29kZVZlcmlmaWVyKTp2b2lkIDAsdGhpcy5jbGllbnQuZ2V0RW5kcG9pbnQoXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIildKTtsZXQgaT17Y2xpZW50X2lkOnRoaXMuY2xpZW50LnNldHRpbmdzLmNsaWVudElkLHJlc3BvbnNlX3R5cGU6XCJjb2RlXCIscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV9jaGFsbGVuZ2VfbWV0aG9kOm51bGw9PXQ/dm9pZCAwOnRbMF0sY29kZV9jaGFsbGVuZ2U6bnVsbD09dD92b2lkIDA6dFsxXX07ZS5zdGF0ZSYmKGkuc3RhdGU9ZS5zdGF0ZSksZS5zY29wZSYmKGkuc2NvcGU9ZS5zY29wZS5qb2luKFwiIFwiKSk7Y29uc3Qgcz1PYmplY3Qua2V5cyhpKTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+cy5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7cy5qb2luKFwiJywgJ1wiKX0nYCk7cmV0dXJuIGk9ey4uLmksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc30scitcIj9cIisoMCxuLmdlbmVyYXRlUXVlcnlTdHJpbmcpKGkpfWFzeW5jIGdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChlLHQpe2NvbnN0e2NvZGU6cn09YXdhaXQgdGhpcy52YWxpZGF0ZVJlc3BvbnNlKGUse3N0YXRlOnQuc3RhdGV9KTtyZXR1cm4gdGhpcy5nZXRUb2tlbih7Y29kZTpyLHJlZGlyZWN0VXJpOnQucmVkaXJlY3RVcmksY29kZVZlcmlmaWVyOnQuY29kZVZlcmlmaWVyfSl9YXN5bmMgdmFsaWRhdGVSZXNwb25zZShlLHQpe3ZhciByO2NvbnN0IG49bmV3IFVSTChlKS5zZWFyY2hQYXJhbXM7aWYobi5oYXMoXCJlcnJvclwiKSl0aHJvdyBuZXcgaS5PQXV0aDJFcnJvcihudWxsIT09KHI9bi5nZXQoXCJlcnJvcl9kZXNjcmlwdGlvblwiKSkmJnZvaWQgMCE9PXI/cjpcIk9BdXRoMiBlcnJvclwiLG4uZ2V0KFwiZXJyb3JcIiksMCk7aWYoIW4uaGFzKFwiY29kZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSB1cmwgZGlkIG5vdCBjb250YWluIGEgY29kZSBwYXJhbWV0ZXIgJHtlfWApO2lmKHQuc3RhdGUmJnQuc3RhdGUhPT1uLmdldChcInN0YXRlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIFwic3RhdGVcIiBwYXJhbWV0ZXIgaW4gdGhlIHVybCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCB2YWx1ZSBvZiAke3Quc3RhdGV9YCk7cmV0dXJue2NvZGU6bi5nZXQoXCJjb2RlXCIpLHNjb3BlOm4uaGFzKFwic2NvcGVcIik/bi5nZXQoXCJzY29wZVwiKS5zcGxpdChcIiBcIik6dm9pZCAwfX1hc3luYyBnZXRUb2tlbihlKXtjb25zdCB0PXtncmFudF90eXBlOlwiYXV0aG9yaXphdGlvbl9jb2RlXCIsY29kZTplLmNvZGUscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV92ZXJpZmllcjplLmNvZGVWZXJpZmllcn07cmV0dXJuIHRoaXMuY2xpZW50LnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMuY2xpZW50LnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfX0sdC5nZW5lcmF0ZUNvZGVWZXJpZmllcj1hc3luYyBmdW5jdGlvbigpe2NvbnN0IGU9cygpO2lmKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoMzIpO3JldHVybiBlLmdldFJhbmRvbVZhbHVlcyh0KSxjKHQpfXtjb25zdCBlPXIoMjEyKTtyZXR1cm4gbmV3IFByb21pc2UoKCh0LHIpPT57ZS5yYW5kb21CeXRlcygzMiwoKGUsbik9PntlJiZyKGUpLHQobi50b1N0cmluZyhcImJhc2U2NHVybFwiKSl9KSl9KSl9fSx0LmdldENvZGVDaGFsbGVuZ2U9b30sNDQzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJFcnJvcj12b2lkIDA7Y2xhc3MgciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKGUsdCxyKXtzdXBlcihlKSx0aGlzLm9hdXRoMkNvZGU9dCx0aGlzLmh0dHBDb2RlPXJ9fXQuT0F1dGgyRXJyb3I9cn0sMTM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkZldGNoPXZvaWQgMCx0Lk9BdXRoMkZldGNoPWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMudG9rZW49bnVsbCx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGwsdGhpcy5hY3RpdmVSZWZyZXNoPW51bGwsdGhpcy5yZWZyZXNoVGltZXI9bnVsbCx2b2lkIDA9PT0obnVsbD09ZT92b2lkIDA6ZS5zY2hlZHVsZVJlZnJlc2gpJiYoZS5zY2hlZHVsZVJlZnJlc2g9ITApLHRoaXMub3B0aW9ucz1lLGUuZ2V0U3RvcmVkVG9rZW4mJih0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPShhc3luYygpPT57dGhpcy50b2tlbj1hd2FpdCBlLmdldFN0b3JlZFRva2VuKCksdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsfSkoKSksdGhpcy5zY2hlZHVsZVJlZnJlc2goKX1hc3luYyBmZXRjaChlLHQpe2NvbnN0IHI9bmV3IFJlcXVlc3QoZSx0KTtyZXR1cm4gdGhpcy5tdygpKHIsKGU9PmZldGNoKGUpKSl9bXcoKXtyZXR1cm4gYXN5bmMoZSx0KT0+e2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO2xldCBuPWUuY2xvbmUoKTtuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IpO2xldCBpPWF3YWl0IHQobik7aWYoIWkub2smJjQwMT09PWkuc3RhdHVzKXtjb25zdCByPWF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7bj1lLmNsb25lKCksbi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityLmFjY2Vzc1Rva2VuKSxpPWF3YWl0IHQobil9cmV0dXJuIGl9fWFzeW5jIGdldFRva2VuKCl7cmV0dXJuIHRoaXMudG9rZW4mJihudWxsPT09dGhpcy50b2tlbi5leHBpcmVzQXR8fHRoaXMudG9rZW4uZXhwaXJlc0F0PkRhdGUubm93KCkpP3RoaXMudG9rZW46dGhpcy5yZWZyZXNoVG9rZW4oKX1hc3luYyBnZXRBY2Nlc3NUb2tlbigpe3JldHVybiBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuLChhd2FpdCB0aGlzLmdldFRva2VuKCkpLmFjY2Vzc1Rva2VufWFzeW5jIHJlZnJlc2hUb2tlbigpe3ZhciBlLHQ7aWYodGhpcy5hY3RpdmVSZWZyZXNoKXJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7Y29uc3Qgcj10aGlzLnRva2VuO3RoaXMuYWN0aXZlUmVmcmVzaD0oYXN5bmMoKT0+e3ZhciBlLHQ7bGV0IG49bnVsbDt0cnl7KG51bGw9PXI/dm9pZCAwOnIucmVmcmVzaFRva2VuKSYmKG49YXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ocikpfWNhdGNoKGUpe2NvbnNvbGUud2FybihcIltvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZSdsbCB0cnkgcmVhdXRoZW50aWNhdGluZ1wiKX1pZihufHwobj1hd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKSksIW4pe2NvbnN0IHI9bmV3IEVycm9yKFwiVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWRcIik7dGhyb3cgbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykub25FcnJvcil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHJ9cmV0dXJuIG59KSgpO3RyeXtjb25zdCByPWF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtyZXR1cm4gdGhpcy50b2tlbj1yLG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLnN0b3JlVG9rZW4pfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpLHJ9Y2F0Y2goZSl7dGhyb3cgdGhpcy5vcHRpb25zLm9uRXJyb3ImJnRoaXMub3B0aW9ucy5vbkVycm9yKGUpLGV9ZmluYWxseXt0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbH19c2NoZWR1bGVSZWZyZXNoKCl7dmFyIGU7aWYoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpcmV0dXJuO2lmKHRoaXMucmVmcmVzaFRpbWVyJiYoY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKSx0aGlzLnJlZnJlc2hUaW1lcj1udWxsKSwhKG51bGw9PT0oZT10aGlzLnRva2VuKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5leHBpcmVzQXQpfHwhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pcmV0dXJuO2NvbnN0IHQ9dGhpcy50b2tlbi5leHBpcmVzQXQtRGF0ZS5ub3coKTt0PDEyZTR8fCh0aGlzLnJlZnJlc2hUaW1lcj1zZXRUaW1lb3V0KChhc3luYygpPT57dHJ5e2F3YWl0IHRoaXMucmVmcmVzaFRva2VuKCl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihcIltmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoXCIsZSl9fSksdC02ZTQpKX19fSwyMTI6KCk9Pnt9fSx0PXt9O2Z1bmN0aW9uIHIobil7dmFyIGk9dFtuXTtpZih2b2lkIDAhPT1pKXJldHVybiBpLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fX07cmV0dXJuIGVbbl0obyxvLmV4cG9ydHMsciksby5leHBvcnRzfXZhciBuPXt9O3JldHVybigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBlPW47T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5PQXV0aDJFcnJvcj1lLk9BdXRoMkZldGNoPWUuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9ZS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1lLk9BdXRoMkNsaWVudD12b2lkIDA7dmFyIHQ9cig5MzQpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQuT0F1dGgyQ2xpZW50fX0pO3ZhciBpPXIoNjE4KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJnZW5lcmF0ZUNvZGVWZXJpZmllclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLmdlbmVyYXRlQ29kZVZlcmlmaWVyfX0pO3ZhciBvPXIoMTMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRmV0Y2hcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gby5PQXV0aDJGZXRjaH19KTt2YXIgcz1yKDQ0Myk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJFcnJvclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzLk9BdXRoMkVycm9yfX0pfSkoKSxufSkoKSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYXV0aDItY2xpZW50Lm1pbi5qcy5tYXAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gPGF1dG8tZ2VuZXJhdGVkPlxyXG4vLyAgICAgR2VuZXJhdGVkIHVzaW5nIHRoZSBOU3dhZyB0b29sY2hhaW4gdjEzLjIwLjAuMCAoTkpzb25TY2hlbWEgdjEwLjkuMC4wIChOZXd0b25zb2Z0Lkpzb24gdjEzLjAuMC4wKSkgKGh0dHA6Ly9OU3dhZy5vcmcpXHJcbi8vIDwvYXV0by1nZW5lcmF0ZWQ+XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyogdHNsaW50OmRpc2FibGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuLy8gUmVTaGFycGVyIGRpc2FibGUgSW5jb25zaXN0ZW50TmFtaW5nXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcclxuICAgIHByaXZhdGUgaHR0cDogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9O1xyXG4gICAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQganNvblBhcnNlUmV2aXZlcjogKChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlVXJsPzogc3RyaW5nLCBodHRwPzogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9KSB7XHJcbiAgICAgICAgdGhpcy5odHRwID0gaHR0cCA/IGh0dHAgOiB3aW5kb3cgYXMgYW55O1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmwgIT09IHVuZGVmaW5lZCAmJiBiYXNlVXJsICE9PSBudWxsID8gYmFzZVVybCA6IFwiL2FwaS9lYmF5L3YxXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0IGFsbCBwcm9kdWN0c1xyXG4gICAgICogQHJldHVybiBPS1xyXG4gICAgICovXHJcbiAgICBnZXRBbGxQcm9kdWN0cygpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRBbGxQcm9kdWN0cyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0QWxsUHJvZHVjdHMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChQcm9kdWN0V2l0aElkLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxQcm9kdWN0V2l0aElkW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0NyZWF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NyZWF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gcmVzdWx0RGF0YTIwMCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0RGF0YTIwMCA6IDxhbnk+bnVsbDtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbHMuZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHN0cmluZz4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBkYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBkYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscy5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVsZXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gRGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9kdWN0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRGVsZXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzRGVsZXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIHVwc2VydExvdEluZm8obG90SW5mbzogTG90SW5mbywgcHJvZHVjdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3twcm9kdWN0SWR9L2xvdHMvXCI7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkIHx8IHByb2R1Y3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAncHJvZHVjdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7cHJvZHVjdElkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIHByb2R1Y3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkobG90SW5mbyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Vwc2VydExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1Vwc2VydExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YPRh9GC0LXQvdC90YvRhSDQu9C+0YLQsNGFXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdFN0YXRlcyhsb3RJZHM6IG51bWJlcltdKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3Rfc3RhdGVfcmVxdWVzdHMvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJZHMpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0TG90U3RhdGVzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RTdGF0ZXMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTG90U3RhdGUuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPExvdFN0YXRlW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDQv9C10YDQtdGH0LXQvdGMINCy0L7Qt9C80L7QttC90YvRhSDRgdC+0YHRgtC+0Y/QvdC40Lkg0L/RgNC+0LTQsNCy0LDQtdC80L7Qs9C+INGC0L7QstCw0YDQsFxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRNYW51YWxDb25kaXRpb25zTGlzdCgpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9tYW51YWxfY29uZGl0aW9ucy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0TWFudWFsQ29uZGl0aW9uc0xpc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxNYW51YWxDb25kaXRpb25bXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKE1hbnVhbENvbmRpdGlvbi5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TWFudWFsQ29uZGl0aW9uW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRob3V0SWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcnkhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aG91dElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IF9kYXRhW1wiU2VhcmNoUXVlcnlcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRob3V0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcnlcIl0gPSB0aGlzLnNlYXJjaFF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0V2l0aElkIGltcGxlbWVudHMgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcnkhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcIklkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIk5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBfZGF0YVtcIlNlYXJjaFF1ZXJ5XCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2R1Y3RXaXRoSWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQcm9kdWN0V2l0aElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIklkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcnlcIl0gPSB0aGlzLnNlYXJjaFF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9kdWN0V2l0aElkIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyeTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mbyBpbXBsZW1lbnRzIElMb3RJbmZvIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHBjcyE6IG51bWJlcjtcclxuICAgIHByaWNlITogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmchOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWwhOiBudW1iZXI7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuICAgIGNvbmRpdGlvbiE6IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyITogc3RyaW5nO1xyXG4gICAgbG9jYXRlZEluITogc3RyaW5nO1xyXG4gICAgaWdub3JlVGhhdExvdCE6IGJvb2xlYW47XHJcbiAgICBtYW51YWxDb25kaXRpb25JZCE6IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeSE6IFB1cmNoYXNlSW5mb1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90SW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJZCA9IF9kYXRhW1wibG90SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wibmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5wY3MgPSBfZGF0YVtcInBjc1wiXTtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmcgPSBfZGF0YVtcInNoaXBwaW5nXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbCA9IF9kYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24gPSBfZGF0YVtcImNvbmRpdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsbGVyID0gX2RhdGFbXCJzZWxsZXJcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRlZEluID0gX2RhdGFbXCJsb2NhdGVkSW5cIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5tYW51YWxDb25kaXRpb25JZCA9IF9kYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5IS5wdXNoKFB1cmNoYXNlSW5mby5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJuYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJwY3NcIl0gPSB0aGlzLnBjcztcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ1wiXSA9IHRoaXMuc2hpcHBpbmc7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXSA9IHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcInNlbGxlclwiXSA9IHRoaXMuc2VsbGVyO1xyXG4gICAgICAgIGRhdGFbXCJsb2NhdGVkSW5cIl0gPSB0aGlzLmxvY2F0ZWRJbjtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB0aGlzLm1hbnVhbENvbmRpdGlvbklkO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHVyY2hhc2VIaXN0b3J5KSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5wdXJjaGFzZUhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwY3M6IG51bWJlcjtcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZzogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsOiBudW1iZXI7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlcjogc3RyaW5nO1xyXG4gICAgbG9jYXRlZEluOiBzdHJpbmc7XHJcbiAgICBpZ25vcmVUaGF0TG90OiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQ6IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeTogUHVyY2hhc2VJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQdXJjaGFzZUluZm8gaW1wbGVtZW50cyBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHkhOiBudW1iZXI7XHJcbiAgICBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHVyY2hhc2VJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gX2RhdGFbXCJxdWFudGl0eVwiXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gX2RhdGFbXCJkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFB1cmNoYXNlSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFB1cmNoYXNlSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInF1YW50aXR5XCJdID0gdGhpcy5xdWFudGl0eTtcclxuICAgICAgICBkYXRhW1wiZGF0ZVwiXSA9IHRoaXMuZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hbnVhbENvbmRpdGlvbiBpbXBsZW1lbnRzIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU1hbnVhbENvbmRpdGlvbikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJpZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTWFudWFsQ29uZGl0aW9uIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFudWFsQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RTdGF0ZSBpbXBsZW1lbnRzIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdFN0YXRlKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IF9kYXRhW1wibGFzdFVwZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RTdGF0ZSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdFN0YXRlKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibGFzdFVwZGF0ZVwiXSA9IHRoaXMubGFzdFVwZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90U3RhdGUge1xyXG4gICAgbG90SWQ6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm9ibGVtRGV0YWlscyBpbXBsZW1lbnRzIElQcm9ibGVtRGV0YWlscyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2JsZW1EZXRhaWxzKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IF9kYXRhW1widHlwZVwiXTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IF9kYXRhW1widGl0bGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gX2RhdGFbXCJzdGF0dXNcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsID0gX2RhdGFbXCJkZXRhaWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBfZGF0YVtcImluc3RhbmNlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2JsZW1EZXRhaWxzIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhYnN0cmFjdCBjbGFzcyAnUHJvYmxlbURldGFpbHMnIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1widHlwZVwiXSA9IHRoaXMudHlwZTtcclxuICAgICAgICBkYXRhW1widGl0bGVcIl0gPSB0aGlzLnRpdGxlO1xyXG4gICAgICAgIGRhdGFbXCJzdGF0dXNcIl0gPSB0aGlzLnN0YXR1cztcclxuICAgICAgICBkYXRhW1wiZGV0YWlsXCJdID0gdGhpcy5kZXRhaWw7XHJcbiAgICAgICAgZGF0YVtcImluc3RhbmNlXCJdID0gdGhpcy5pbnN0YW5jZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvYmxlbURldGFpbHMge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbHMgZXh0ZW5kcyBQcm9ibGVtRGV0YWlscyBpbXBsZW1lbnRzIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbHMge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxzKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlscyBleHRlbmRzIElQcm9ibGVtRGV0YWlscyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMgaW1wbGVtZW50cyBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHN0YXR1czogbnVtYmVyO1xyXG4gICAgcmVzcG9uc2U6IHN0cmluZztcclxuICAgIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9O1xyXG4gICAgcmVzdWx0OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaXNBcGlFeGNlcHRpb24gPSB0cnVlO1xyXG5cclxuICAgIHN0YXRpYyBpc0FwaUV4Y2VwdGlvbihvYmo6IGFueSk6IG9iaiBpcyBBcGlFeGNlcHRpb24ge1xyXG4gICAgICAgIHJldHVybiBvYmouaXNBcGlFeGNlcHRpb24gPT09IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRocm93RXhjZXB0aW9uKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ/OiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aHJvdyByZXN1bHQ7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhyb3cgbmV3IEFwaUV4Y2VwdGlvbihtZXNzYWdlLCBzdGF0dXMsIHJlc3BvbnNlLCBoZWFkZXJzLCBudWxsKTtcclxufSIsImltcG9ydCB7T0F1dGgyQ2xpZW50LCBPQXV0aDJUb2tlbn0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcblxyXG5cclxudHlwZSBPQXV0aDJGZXRjaE9wdGlvbnMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlcmVuY2UgdG8gT0F1dGgyIGNsaWVudC5cclxuICAgICAqL1xyXG4gICAgY2xpZW50OiBPQXV0aDJDbGllbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBpbXBsZW1lbnRpbmcgdGhpcyBmdW5jdGlvbi5cclxuICAgICAqIGl0J3MgcHVycG9zZSBpcyB0byBzdXBwbHkgdGhlICdpbml0aWFsJyBvYXV0aDIgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBgbnVsbGAgdG8gZmFpbCB0aGUgcHJvY2Vzcy5cclxuICAgICAqL1xyXG4gICAgZ2V0TmV3VG9rZW4oKTogT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgc2V0LCB3aWxsIGJlIGNhbGxlZCBpZiBhdXRoZW50aWNhdGlvbiBmYXRhbGx5IGZhaWxlZC5cclxuICAgICAqL1xyXG4gICAgb25FcnJvcj86IChlcnI6IEVycm9yKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGFjdGl2ZSB0b2tlbiBjaGFuZ2VzLiBVc2luZyB0aGlzIGlzXHJcbiAgICAgKiBvcHRpb25hbCwgYnV0IGl0IG1heSBiZSB1c2VkIHRvIChmb3IgZXhhbXBsZSkgcHV0IHRoZSB0b2tlbiBpbiBvZmYtbGluZVxyXG4gICAgICogc3RvcmFnZSBmb3IgbGF0ZXIgdXNhZ2UuXHJcbiAgICAgKi9cclxuICAgIHN0b3JlVG9rZW4/OiAodG9rZW46IE9BdXRoMlRva2VuKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxzbyBhbiBvcHRpb25hbCBmZWF0dXJlLiBJbXBsZW1lbnQgdGhpcyBpZiB5b3Ugd2FudCB0aGUgd3JhcHBlciB0byB0cnkgYVxyXG4gICAgICogc3RvcmVkIHRva2VuIGJlZm9yZSBhdHRlbXB0aW5nIGEgZnVsbCByZS1hdXRoZW50aWNhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIG51bGwgaWYgdGhlcmUgd2FzIG5vIHRva2VuLlxyXG4gICAgICovXHJcbiAgICBnZXRTdG9yZWRUb2tlbj86ICgpID0+IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBzY2hlZHVsZSB0b2tlbiByZWZyZXNoLlxyXG4gICAgICpcclxuICAgICAqIENlcnRhaW4gZXhlY3V0aW9uIGVudmlyb25tZW50cywgZS5nLiBSZWFjdCBOYXRpdmUsIGRvIG5vdCBoYW5kbGUgc2NoZWR1bGVkXHJcbiAgICAgKiB0YXNrcyB3aXRoIHNldFRpbWVvdXQoKSBpbiBhIGdyYWNlZnVsIG9yIHByZWRpY3RhYmxlIGZhc2hpb24uIFRoZSBkZWZhdWx0XHJcbiAgICAgKiBiZWhhdmlvciBpcyB0byBzY2hlZHVsZSByZWZyZXNoLiBTZXQgdGhpcyB0byBmYWxzZSB0byBkaXNhYmxlIHNjaGVkdWxpbmcuXHJcbiAgICAgKi9cclxuICAgIHNjaGVkdWxlUmVmcmVzaD86IGJvb2xlYW47XHJcblxyXG4gICAgZmV0Y2g/OiB0eXBlb2YgZmV0Y2g7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGZXRjaFdyYXBwZXJDdXN0b20ge1xyXG5cclxuICAgIHByaXZhdGUgb3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VycmVudCBhY3RpdmUgdG9rZW4gKGlmIGFueSlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0b2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSB1c2VyIGhhZCBhIHN0b3JlZFRva2VuLCB0aGUgcHJvY2VzcyB0byBmZXRjaCBpdFxyXG4gICAgICogbWF5IGJlIGFzeW5jLiBXZSBrZWVwIHRyYWNrIG9mIHRoaXMgcHJvY2VzcyBpbiB0aGlzXHJcbiAgICAgKiBwcm9taXNlLCBzbyBpdCBtYXkgYmUgYXdhaXRlZCB0byBhdm9pZCByYWNlIGNvbmRpdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQXMgc29vbiBhcyB0aGlzIHByb21pc2UgcmVzb2x2ZXMsIHRoaXMgcHJvcGVydHkgZ2V0IG51bGxlZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVHZXRTdG9yZWRUb2tlbjogbnVsbCB8IFByb21pc2U8dm9pZD4gPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucykge1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucz8uc2NoZWR1bGVSZWZyZXNoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zY2hlZHVsZVJlZnJlc2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdldFN0b3JlZFRva2VuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IGF3YWl0IG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4hKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gbnVsbDtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb2VzIGEgZmV0Y2ggcmVxdWVzdCBhbmQgYWRkcyBhIEJlYXJlciAvIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgdGhpcyBmdW5jdGlvbiBhdHRlbXB0cyB0byBmZXRjaCBpdFxyXG4gICAgICogZmlyc3QuIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgYWxtb3N0IGV4cGlyaW5nLCB0aGlzIGZ1bmN0aW9uIG1pZ2h0IGF0dGVtcHRcclxuICAgICAqIHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZldGNoKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtcclxuXHJcbiAgICAgICAgaWYgKGluaXQuaGVhZGVycykge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzID0ge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VufVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Rva2VuID0gYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIG5ld1Rva2VuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBjdXJyZW50IHRva2VuIGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoZXJlIHJlc3VsdCBvYmplY3Qgd2lsbCBoYXZlOlxyXG4gICAgICogICAqIGFjY2Vzc1Rva2VuXHJcbiAgICAgKiAgICogZXhwaXJlc0F0IC0gd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgbnVsbC5cclxuICAgICAqICAgKiByZWZyZXNoVG9rZW4gLSBtYXkgYmUgbnVsbFxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhdHRlbXB0IHRvIGF1dG9tYXRpY2FsbHkgcmVmcmVzaCBpZiBzdGFsZS5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0VG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi5leHBpcmVzQXQgPT09IG51bGwgfHwgdGhpcy50b2tlbi5leHBpcmVzQXQgPiBEYXRlLm5vdygpKSkge1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgdG9rZW4gaXMgc3RpbGwgdmFsaWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGN1cnJlbnQgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgaXQgd2lsbCBhdHRlbXB0IHRvIGZldGNoIGl0LlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBleHBpcmluZywgaXQgd2lsbCBhdHRlbXB0IHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEFjY2Vzc1Rva2VuKCk6IFByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBnZXRTdG9yZWRUb2tlbiBmaW5pc2hlZC5cclxuICAgICAgICBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gdG9rZW4uYWNjZXNzVG9rZW47XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogS2VlcGluZyB0cmFjayBvZiBhbiBhY3RpdmUgcmVmcmVzaFRva2VuIG9wZXJhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHdpbGwgYWxsb3cgdXMgdG8gZW5zdXJlIG9ubHkgMSBzdWNoIG9wZXJhdGlvbiBoYXBwZW5zIGF0IGFueVxyXG4gICAgICogZ2l2ZW4gdGltZS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZWZyZXNoOiBQcm9taXNlPE9BdXRoMlRva2VuPiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yY2VzIGFuIGFjY2VzcyB0b2tlbiByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2hUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIGN1cnJlbnRseSBhbHJlYWR5IGRvaW5nIHRoaXMgb3BlcmF0aW9uLFxyXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgZG8gaXQgdHdpY2UgaW4gcGFyYWxsZWwuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGRUb2tlbiA9IHRoaXMudG9rZW47XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gKGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdUb2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkVG9rZW4/LnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhZCBhIHJlZnJlc2ggdG9rZW4sIGxldHMgc2VlIGlmIHdlIGNhbiB1c2UgaXQhXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihvbGRUb2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2VcXCdsbCB0cnkgcmVhdXRoZW50aWNhdGluZycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcj8uKGVycik7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Rva2VuO1xyXG5cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcmVUb2tlbj8uKHRva2VuKTtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGNsZWFyIHRoZSBjdXJyZW50IHJlZnJlc2ggb3BlcmF0aW9uLlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaW1lciB0cmlnZ2VyIGZvciB0aGUgbmV4dCBhdXRvbWF0ZWQgcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlZnJlc2hUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNjaGVkdWxlUmVmcmVzaCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWZyZXNoVGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuPy5leHBpcmVzQXQgfHwgIXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGtub3cgd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgZG9uJ3QgaGF2ZSBhIHJlZnJlc2hfdG9rZW4sIGRvbid0IGJvdGhlci5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gdGhpcy50b2tlbi5leHBpcmVzQXQgLSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICAvLyBXZSBvbmx5IHNjaGVkdWxlIHRoaXMgZXZlbnQgaWYgaXQgaGFwcGVucyBtb3JlIHRoYW4gMiBtaW51dGVzIGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgaWYgKGV4cGlyZXNJbiA8IDEyMCAqIDEwMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2NoZWR1bGUgMSBtaW51dGUgYmVmb3JlIGV4cGlyeVxyXG4gICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaCcsIGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBleHBpcmVzSW4gLSA2MCAqIDEwMDApO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtBcGlFeGNlcHRpb24sIENsaWVudCwgTG90SW5mbywgUHVyY2hhc2VJbmZvfSBmcm9tIFwiLi9FYmF5Q2xpZW50L0ViYXlDbGllbnRcIlxyXG5pbXBvcnQge2dlbmVyYXRlQ29kZVZlcmlmaWVyLCBPQXV0aDJDbGllbnR9IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5pbXBvcnQge0ZldGNoV3JhcHBlckN1c3RvbX0gZnJvbSBcIi4vRmV0Y2hXcmFwcGVyQ3VzdG9tXCI7XHJcblxyXG5jb25zdCBwYW5lbENsYXNzID0gXCJwYW5lbC1kaXZcIjtcclxuY29uc3QgbGFzdFVwZGF0ZVRpbWUgPSBcImxhc3RVcGRhdGVcIlxyXG5jb25zdCBmb3JtSWQgPSBcInByb2R1Y3QtZm9ybS1pZFwiXHJcbmNvbnN0IHByb2R1Y3RGaWVsZE5hbWUgPSBcInByb2R1Y3RJZFwiO1xyXG5jb25zdCBwY3NGaWVsZE5hbWUgPSBcInBjc1wiO1xyXG5jb25zdCBwcmljZUZpZWxkTmFtZSA9IFwicHJpY2VcIjtcclxuY29uc3Qgc2hpcHBpbmdGaWVsZE5hbWUgPSBcInNoaXBwaW5nXCI7XHJcbmNvbnN0IHNoaXBwaW5nQWRkaXRpb25hbEZpZWxkTmFtZSA9IFwic2hpcHBpbmdBZGRpdGlvbmFsXCI7XHJcbmNvbnN0IGVycm9yRWxlbWVudElkID0gXCJlcnJvckVsZW1lbnRcIlxyXG5jb25zdCBzdWJtaXRJZCA9IFwic3VibWl0XCJcclxuY29uc3QgYmFja2VuZFVybCA9IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA5NS9cIlxyXG5jb25zdCBiYXNlQXBpVXJsID0gYCR7YmFja2VuZFVybH1hcGkvZWJheS92MWA7XHJcbmNvbnN0IGF1dGhSZWRpcmVjdFVybCA9IFwiaHR0cHM6Ly93d3cuZWJheS5jb20vXCJcclxuY29uc3QgcmVzY2FuVGltZURheXMgPSA2MFxyXG5cclxuY29uc3QgbG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcblxyXG4vLyBmZXRjaCDRh9C10YDQtdC3IGJhY2tncm91bmQgc2NyaXB0LCDQv9C+INC00YDRg9Cz0L7QvNGDINC90LUg0YDQsNCx0L7RgtCw0LXRglxyXG5mdW5jdGlvbiBmZXRjaFJlc291cmNlKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdDogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtpbnB1dCwgaW5pdH0sIG1lc3NhZ2VSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyZXNwb25zZSwgZXJyb3JdID0gbWVzc2FnZVJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgdW5kZWZpbmVkIG9uIGEgMjA0IC0gTm8gQ29udGVudFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlc3BvbnNlLmJvZHkgPyBuZXcgQmxvYihbcmVzcG9uc2UuYm9keV0pIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZXh0cmFjdFByaWNlKHByaWNlKSB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IHByaWNlLm1hdGNoKC8oXFxEKykoXFxkKyg/OlssLl1cXGQrKT8pLylcclxuICAgIGlmIChtYXRjaGVzWzFdICE9PSBcIlVTICRcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVVMgJCBwcmljZSBleHBlY3RlZCwgYnV0IHdhcycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hdGNoZXNbMl0ucmVwbGFjZSgnLCcsICcuJylcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSGlzdG9yeUJ1dHRvbigpIHtcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBkb21haW4gPSBsb2NhdGlvbi5ob3N0bmFtZTtcclxuICAgIGxldCBoaXN0b3J5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaXN0b3J5LWJ1dHRvbicpO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi50ZXh0Q29udGVudCA9ICdISVNUT1JZJztcclxuICAgIGhpc3RvcnlCdXR0b24uaHJlZiA9IGBodHRwczovLyR7ZG9tYWlufS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIGhpc3RvcnlCdXR0b24uc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIG1hcmdpbi1sZWZ0OiA1cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGYwO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIHBhZGRpbmc6IDNweCA2cHg7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbiAgYDtcclxuICAgIGhpc3RvcnlCdXR0b24udGFyZ2V0ID0gJ19ibGFuayc7XHJcblxyXG4gICAgcmV0dXJuIGhpc3RvcnlCdXR0b247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhpc3RvcnlCdXR0b24oKSB7XHJcbiAgICBsZXQgcHJvZHVjdFRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpbVtkYXRhLXRlc3RpZD1cIngtaXRlbS10aXRsZVwiXScpO1xyXG4gICAgaWYgKHByb2R1Y3RUaXRsZUNvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCBleGlzdGluZ0J1dHRvbiA9IHByb2R1Y3RUaXRsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhLmhpc3RvcnktYnV0dG9uJyk7XHJcbiAgICAgICAgaWYgKCFleGlzdGluZ0J1dHRvbikge1xyXG4gICAgICAgICAgICBsZXQgaGlzdG9yeUJ1dHRvbiA9IGNyZWF0ZUhpc3RvcnlCdXR0b24oKTtcclxuICAgICAgICAgICAgcHJvZHVjdFRpdGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKGhpc3RvcnlCdXR0b24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgc3R5bGVzID0gYFxyXG4gICAgLiR7cGFuZWxDbGFzc30ge1xyXG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgICBwYWRkaW5nOiAxNXB4O1xyXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCAjMDAwMGNjO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICBjb2xvcjogIzAwMDBjYztcclxuICAgICAgcG9zaXRpb246Zml4ZWQ7XHJcbiAgICAgIHotaW5kZXg6MTAwO1xyXG4gICAgICBsZWZ0OjElO1xyXG4gICAgICBib3R0b206NSU7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbCB7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgICBmbG9hdDogbGVmdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gaW5wdXQge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHNlbGVjdCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWw6YWZ0ZXIgeyBjb250ZW50OiBcIjogXCIgfVxyXG5gXHJcblxyXG4gICAgbGV0IHN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIilcclxuICAgIHN0eWxlU2hlZXQuaW5uZXJUZXh0ID0gc3R5bGVzXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChzdHlsZVNoZWV0KVxyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3MpO1xyXG5cclxuXHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKVxyXG4gICAgZm9ybS5pZCA9IGZvcm1JZFxyXG5cclxuICAgIC8vIGxhbmd1YWdlPUhUTUxcclxuICAgIGZvcm0uaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke2xhc3RVcGRhdGVUaW1lfVwiPtCS0YDQtdC80Y8g0LDQutGC0YPQsNC70LjQt9Cw0YbQuNC4PC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke2xhc3RVcGRhdGVUaW1lfVwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIiR7bGFzdFVwZGF0ZVRpbWV9XCIgcmVhZG9ubHkvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPtCi0L7QstCw0YA8L2xhYmVsPlxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIiBpZD1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPtCS0YvQsdC10YDQuNGC0LUg0YLQvtCy0LDRgDwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtwY3NGaWVsZE5hbWV9XCI+UENTPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3Bjc0ZpZWxkTmFtZX1cIiB0eXBlPVwibnVtYmVyXCIgbmFtZT1cIiR7cGNzRmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cHJpY2VGaWVsZE5hbWV9XCI+UHJpY2UgVVMkPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3ByaWNlRmllbGROYW1lfVwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMVwiIG5hbWU9XCIke3ByaWNlRmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7c2hpcHBpbmdGaWVsZE5hbWV9XCI+U2hpcHBpbmcgdG8gR2VybWFueTwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtzaGlwcGluZ0ZpZWxkTmFtZX1cIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDFcIiBuYW1lPVwiJHtzaGlwcGluZ0ZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3NoaXBwaW5nQWRkaXRpb25hbEZpZWxkTmFtZX1cIj5TaGlwcGluZyBlYWNoIGFkZGl0aW9uYWw8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7c2hpcHBpbmdBZGRpdGlvbmFsRmllbGROYW1lfVwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMVwiIG5hbWU9XCIke3NoaXBwaW5nQWRkaXRpb25hbEZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJjb2xvcjogcmVkO1wiIGlkPVwiJHtlcnJvckVsZW1lbnRJZH1cIj48L2Rpdj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtzdWJtaXRJZH1cIiB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTYXZlXCIgZGlzYWJsZWQvPmA7XHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoZXZlbnQsIGNsaWVudClcclxuICAgIH0pO1xyXG5cclxuICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKVxyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PmV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgICBsb3RJbmZvW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobG90SW5mbykpXHJcblxyXG5cclxuICAgICAgICBhd2FpdCBjbGllbnQudXBzZXJ0TG90SW5mbyhsb3RJbmZvLCBkYXRhLmdldCgncHJvZHVjdElkJykudG9TdHJpbmcoKSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93czogSFRNTFRhYmxlUm93RWxlbWVudFtdLCByZXN1bHQ6IFB1cmNoYXNlSW5mb1tdKSB7XHJcbiAgICBmb3IgKGxldCBmaXhlZFByaWNlUm93IG9mIGZpeGVkUHJpY2VSb3dzKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbLi4uZml4ZWRQcmljZVJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCBwcmljZSA9IGNvbHVtbnNbMV1cclxuXHJcbiAgICAgICAgaWYgKHByaWNlID09PSBcIkV4cGlyZWRcIiB8fCBwcmljZSA9PT0gXCJEZWNsaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgIT09IFwiU29sZCBhcyBhIHNwZWNpYWwgb2ZmZXJcIiAmJiBwcmljZSAhPT0gXCJDb3VudGVyLW9mZmVyZWRcIiAmJiBwcmljZSAhPT0gXCJBY2NlcHRlZFwiKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgUHVyY2hhc2VJbmZvKHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IHBhcnNlRGF0ZShjb2x1bW5zWzNdKSxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBwYXJzZUludChjb2x1bW5zWzJdKSxcclxuICAgICAgICAgICAgICAgIHByaWNlOiBleHRyYWN0UHJpY2UocHJpY2UpXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm8oe1xyXG4gICAgICAgICAgICAgICAgZGF0ZTogcGFyc2VEYXRlKGNvbHVtbnNbM10pLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHBhcnNlSW50KGNvbHVtbnNbMl0pXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBtYXRjaGVzID0gZGF0ZVN0cmluZy5tYXRjaCgvKFxcZCtcXHNbQS16XStcXHNcXGQrKVxcc2F0XFxzKFxcZCspOihcXGQrKTooXFxkKykoYW18cG0pXFxzKFtBLXpdKykvKVxyXG5cclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShtYXRjaGVzWzFdICsgJyAwMDowMDowMC4wMDBaJykpXHJcblxyXG4gICAgZGF0ZS5zZXRVVENIb3VycyhwYXJzZUludChtYXRjaGVzWzJdKSk7XHJcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMocGFyc2VJbnQobWF0Y2hlc1szXSkpO1xyXG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKHBhcnNlSW50KG1hdGNoZXNbNF0pKTtcclxuXHJcbiAgICBpZiAobWF0Y2hlc1s1XSA9PT0gXCJwbVwiICYmIGRhdGUuZ2V0VVRDSG91cnMoKSAhPT0gMTIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSArIDEyKTtcclxuICAgIH1cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcImFtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpID09PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMTIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaGVzWzZdID09PSBcIk1TS1wiKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0aW1lem9uZSBcIiArIG1hdGNoZXNbNl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dCk6IFB1cmNoYXNlSW5mb1tdIHtcclxuICAgIGxldCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHRleHQsIFwidGV4dC9odG1sXCIpXHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IG5ldyBBcnJheTxQdXJjaGFzZUluZm8+KCk7XHJcbiAgICBsZXQgZml4ZWRQcmljZUJsb2NrID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5maXhlZC1wcmljZSB0Ym9keScpXHJcbiAgICBpZiAoZml4ZWRQcmljZUJsb2NrICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZpeGVkUHJpY2VSb3dzID0gWy4uLmZpeGVkUHJpY2VCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCd0cicpXVxyXG4gICAgICAgIGZpbGxTb2xkSXRlbXNSZXN1bHQoZml4ZWRQcmljZVJvd3MsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9mZmVyQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2Lm9mZmVyIHRib2R5JylcclxuICAgIGlmIChvZmZlckJsb2NrICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IG9mZmVyUm93cyA9IFsuLi5vZmZlckJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChvZmZlclJvd3MsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbElkKCkge1xyXG4gICAgbG90SW5mby5sb3RJZCA9IHBhcnNlSW50KGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFByaWNlKHBhbmVsKSB7XHJcbiAgICBsZXQgcHJpY2VGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBwcmljZUZpZWxkTmFtZSlcclxuICAgIHByaWNlRmllbGQudmFsdWUgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYueC1wcmljZS1wcmltYXJ5IHNwYW4nKSkuaW5uZXJUZXh0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsTmFtZSgpIHtcclxuICAgIGxvdEluZm8ubmFtZSA9ICg8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpbSBoMScpKS5pbm5lclRleHRcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNlbGxlcigpIHtcclxuICAgIGxvdEluZm8uc2VsbGVyID0gKDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYueC1zZWxsZXJjYXJkLWF0Zl9faW5mb19fYWJvdXQtc2VsbGVyIGEnKSkuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKClcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbENvbmRpdGlvbigpIHtcclxuICAgIGxvdEluZm8uY29uZGl0aW9uID0gKDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYueC1pdGVtLWNvbmRpdGlvbi10ZXh0IHNwYW4udXgtdGV4dHNwYW5zJykpLmlubmVyVGV4dFxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LngtaXRlbS1jb25kaXRpb24tZGVzYycpXHJcbiAgICBpZiAoY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ICE9IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gKDxIVE1MRWxlbWVudD5jb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQpLmlubmVyVGV4dFxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCcJywgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCfigJ0nLCAnJylcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNoaXBwaW5nKHBhbmVsKSB7XHJcbiAgICBsZXQgc2hpcHBpbmdGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBzaGlwcGluZ0ZpZWxkTmFtZSlcclxuICAgIGxldCBzaGlwcGluZ0FkZGl0aW9uYWxGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBzaGlwcGluZ0FkZGl0aW9uYWxGaWVsZE5hbWUpXHJcbiAgICBsZXQgc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi51eC1sYXlvdXQtc2VjdGlvbl9fdGV4dHVhbC1kaXNwbGF5LS1hc2tTZWxsZXInKSA9PT0gbnVsbFxyXG4gICAgaWYgKHNoaXBwaW5nUmF0ZXNBdmFpbGFibGUpIHtcclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zSGVhZGVyID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5kLXNoaXBwaW5nLW1heHZpZXcgdGhlYWQnKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGgnKV1cclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zVmFsdWVzID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5kLXNoaXBwaW5nLW1heHZpZXcgdGJvZHknKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcigndHInKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nTWF4dmlld1ZhbHVlcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gZGVsaXZlcnlDb2x1bW5zSGVhZGVyW2ldLmlubmVyVGV4dFxyXG4gICAgICAgICAgICBzaGlwcGluZ01heHZpZXdWYWx1ZXNba2V5XSA9IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlc1tpXS5xdWVyeVNlbGVjdG9yKCdzcGFuJykuaW5uZXJUZXh0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydUbyddICE9PSAnR2VybWFueScpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwcGluZyBjb3VudHJ5IG11c3QgYmUgR2VybWFueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nVmFsdWUgPSBzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ1NoaXBwaW5nIGFuZCBoYW5kbGluZyddXHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ1ZhbHVlICE9PSAnRnJlZSBzaGlwcGluZycpIHtcclxuICAgICAgICAgICAgc2hpcHBpbmdGaWVsZC52YWx1ZSA9IGV4dHJhY3RQcmljZShzaGlwcGluZ1ZhbHVlKVxyXG5cclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlcy5oYXNPd25Qcm9wZXJ0eSgnRWFjaCBhZGRpdGlvbmFsIGl0ZW0nKSkge1xyXG4gICAgICAgICAgICAgICAgc2hpcHBpbmdBZGRpdGlvbmFsRmllbGQudmFsdWUgPSBleHRyYWN0UHJpY2Uoc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydFYWNoIGFkZGl0aW9uYWwgaXRlbSddKVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nQWRkaXRpb25hbEZpZWxkLnZhbHVlID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzaGlwcGluZ0ZpZWxkLnZhbHVlID0gMDtcclxuICAgICAgICAgICAgc2hpcHBpbmdBZGRpdGlvbmFsRmllbGQudmFsdWUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbExvY2F0ZWRJbigpIHtcclxuICAgIGxvdEluZm8ubG9jYXRlZEluID0gKDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZC1zaGlwcGluZy1taW52aWV3JykpLmlubmVyVGV4dC5tYXRjaCgvTG9jYXRlZFxcc2luOlxccyguKykvKVsxXVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgZGVzY3JpcHRpb25VcmwgPSAoPEhUTUxJRnJhbWVFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZXNjX2lmcicpKS5zcmNcclxuICAgIGZldGNoUmVzb3VyY2UoZGVzY3JpcHRpb25VcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4oKHRleHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm8uZGVzY3JpcHRpb24gPSB0ZXh0XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNob3dFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgc2hvd0Vycm9yKGVycilcclxuICAgICAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsUHVyY2hhc2VIaXN0b3J5KCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IHB1cmNoYXNlSGlzdG9yeVVybCA9IGBodHRwczovLyR7bG9jYXRpb24uaG9zdG5hbWV9L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgZmV0Y2hSZXNvdXJjZShwdXJjaGFzZUhpc3RvcnlVcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgKDxSZXNwb25zZT5yZXNwb25zZSkudGV4dCgpLnRoZW4oKHRleHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm8ucHVyY2hhc2VIaXN0b3J5ID0gcGFyc2VTb2xkSXRlbXNQYWdlKHRleHQpXHJcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNob3dFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgc2hvd0Vycm9yKGVycilcclxuICAgICAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJvZHVjdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgcHJvZHVjdEZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBwcm9kdWN0RmllbGROYW1lKTtcclxuICAgIGxldCBzZWFyY2hRdWVyeSA9IG5ldyBVUkwoZG9jdW1lbnQucmVmZXJyZXIpLnNlYXJjaFBhcmFtcz8uZ2V0KCdfbmt3Jyk/LnRyaW0oKT8udG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCBjbGllbnQuZ2V0QWxsUHJvZHVjdHMoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHQudmFsdWUgPSBwcm9kdWN0c1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gcHJvZHVjdHNbaV0ubmFtZTtcclxuXHJcbiAgICAgICAgaWYgKHNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgc2VhcmNoUXVlcnkgPT09IHByb2R1Y3RzW2ldLnNlYXJjaFF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvZHVjdEZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxMYXN0VXBkYXRlRGF0ZShwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgY3VycmVudExvdEluZm8gPSBhd2FpdCBjbGllbnQuZ2V0TG90U3RhdGVzKFtsb3RJbmZvLmxvdElkXSlcclxuICAgIGxldCBsYXN0VXBkYXRlSW5wdXQgPSA8SFRNTElucHV0RWxlbWVudD5wYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgbGFzdFVwZGF0ZVRpbWUpO1xyXG4gICAgaWYgKGN1cnJlbnRMb3RJbmZvLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgbGFzdFVwZGF0ZSA9IGN1cnJlbnRMb3RJbmZvWzBdLmxhc3RVcGRhdGVcclxuXHJcbiAgICAgICAgbGV0IGRpZmZJbkRheXMgPSBNYXRoLmNlaWwoTWF0aC5hYnMobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShsYXN0VXBkYXRlKS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRpZmYgaW4gZGF5cyBcIiArIGRpZmZJbkRheXMpXHJcbiAgICAgICAgaWYgKGRpZmZJbkRheXMgPiByZXNjYW5UaW1lRGF5cykge1xyXG4gICAgICAgICAgICBsYXN0VXBkYXRlSW5wdXQuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAjZGY5MTkxO2BcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYXN0VXBkYXRlSW5wdXQuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiBub25lO2BcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFzdFVwZGF0ZUlucHV0LnZhbHVlID0gbGFzdFVwZGF0ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsYXN0VXBkYXRlSW5wdXQuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAjZGY5MTkxO2BcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFBhbmVsV2l0aERhdGEoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuJyArIHBhbmVsQ2xhc3MpXHJcbiAgICBmaWxsSWQoKTtcclxuICAgIGF3YWl0IGZpbGxMYXN0VXBkYXRlRGF0ZShwYW5lbCwgY2xpZW50KVxyXG4gICAgYXdhaXQgZmlsbFByb2R1Y3QocGFuZWwsIGNsaWVudCk7XHJcbiAgICBmaWxsUHJpY2UocGFuZWwpO1xyXG4gICAgZmlsbFNoaXBwaW5nKHBhbmVsKTtcclxuICAgIGZpbGxOYW1lKCk7XHJcbiAgICBmaWxsU2VsbGVyKCk7XHJcbiAgICBmaWxsQ29uZGl0aW9uKCk7XHJcbiAgICBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24oKTtcclxuICAgIGZpbGxMb2NhdGVkSW4oKTtcclxuICAgIGZpbGxEZXNjcmlwdGlvbigpO1xyXG4gICAgZmlsbFB1cmNoYXNlSGlzdG9yeSgpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkUGFuZWwoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBib2R5RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuICAgIGlmIChib2R5RWxlbWVudCkge1xyXG4gICAgICAgIGxldCBleGlzdGluZ1BhbmVsID0gYm9keUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgICAgICBpZiAoIWV4aXN0aW5nUGFuZWwpIHtcclxuICAgICAgICAgICAgY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RXJyb3IoZXJyb3I6IEVycm9yKSB7XHJcbiAgICBsZXQgZXJyb3JEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQpXHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBBcGlFeGNlcHRpb24pIHtcclxuICAgICAgICBsZXQgYXBpRXhjZXB0aW9uID0gPEFwaUV4Y2VwdGlvbj5lcnJvclxyXG4gICAgICAgIGNvbnNvbGUubG9nKGFwaUV4Y2VwdGlvbi5zdGF0dXMgKyBcIiBjb2RlIHJlY2VpdmVkXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2coYXBpRXhjZXB0aW9uLnJlc3BvbnNlKVxyXG4gICAgICAgIHNwYW4uaW5uZXJIVE1MID0gYXBpRXhjZXB0aW9uLnN0YXR1cyArIFwiIFwiICsgYXBpRXhjZXB0aW9uLnJlc3BvbnNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IGVycm9yLnN0YWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yRGl2LmFwcGVuZENoaWxkKHNwYW4pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuYWJsZVN1Ym1pdEJ1dHRvbigpIHtcclxuICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBzdWJtaXRJZCkpLmRpc2FibGVkID0gZmFsc2VcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXV0aG9yaXplRmV0Y2gob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpOiBGZXRjaFdyYXBwZXJDdXN0b20ge1xyXG4gICAgcmV0dXJuIG5ldyBGZXRjaFdyYXBwZXJDdXN0b20oe1xyXG4gICAgICAgIGNsaWVudDogb0F1dGgyQ2xpZW50LFxyXG4gICAgICAgIGdldE5ld1Rva2VuOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50UGFnZSA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyBsb2NhdGlvbi5wYXRobmFtZVxyXG4gICAgICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gYXdhaXQgZ2VuZXJhdGVDb2RlVmVyaWZpZXIoKTtcclxuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXIsIHJldHVybl90b19wYWdlOiBjdXJyZW50UGFnZX0pXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldEF1dGhvcml6ZVVyaSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsnRWJheS5TZXJ2ZXJBUEknXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTdG9yZWRUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRva2VuX3N0b3JlXCJdKSkudG9rZW5fc3RvcmU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIEpTT04ucGFyc2UodG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwcm9kdWN0UGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBhZGRIaXN0b3J5QnV0dG9uKCk7XHJcbiAgICAgICAgYWRkUGFuZWwoY2xpZW50KTtcclxuICAgICAgICBhd2FpdCBmaWxsUGFuZWxXaXRoRGF0YShjbGllbnQpO1xyXG4gICAgICAgIC8vdG9kbyDRgNCw0LfRgNC10YjQsNGC0Ywg0YLQvtC70YzQutC+INC10YHQu9C4INCy0L7QvtCx0YnQtSDQvdC10YIg0L7RiNC40LHQvtC6XHJcbiAgICAgICAgZW5hYmxlU3VibWl0QnV0dG9uKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKTtcclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYXV0aFBhZ2Uob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpIHtcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJjb2RlXCIpKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcbiAgICAgICAgbGV0IG9hdXRoMlRva2VuID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHt0b2tlbl9zdG9yZTogSlNPTi5zdHJpbmdpZnkob2F1dGgyVG9rZW4pfSlcclxuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJyZXR1cm5fdG9fcGFnZVwiXSkpLnJldHVybl90b19wYWdlXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIC8v0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDQv9GA0L7QtNCw0L3Ri9C1INC70L7RgtGLXHJcbiAgICBpZiAobmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXM/LmdldCgnTEhfU29sZCcpPy50cmltKCkgIT09IFwiMVwiKSByZXR1cm47XHJcblxyXG4gICAgbGV0IGxpbmtzID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3VsLnNycC1yZXN1bHRzJykucXVlcnlTZWxlY3RvckFsbCgnbGkucy1pdGVtJyldXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoeDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGxpbmsgPSA8SFRNTEFuY2hvckVsZW1lbnQ+eC5xdWVyeVNlbGVjdG9yKCdhLnMtaXRlbV9fbGluaycpXHJcbiAgICAgICAgICAgIGxldCBzb2xkRGF0ZSA9IG5ldyBEYXRlKCg8SFRNTEVsZW1lbnQ+eC5xdWVyeVNlbGVjdG9yKCdzcGFuLlBPU0lUSVZFJykpLmlubmVyVGV4dC5yZXBsYWNlKFwiU29sZCBcIiwgXCJcIikpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTG90TGluayhwYXJzZUludChsaW5rLmhyZWYubWF0Y2goL2h0dHBzOlxcL1xcL1teXFwvXStcXC9pdG1cXC8oXFxkKykvKVsxXSksIGxpbmssIHNvbGREYXRlKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIGxldCBnZXRMb3RTdGF0ZXNBbnN3ZXIgPSBhd2FpdCBjbGllbnQuZ2V0TG90U3RhdGVzKGxpbmtzLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4LmlkXHJcbiAgICB9KSlcclxuXHJcbiAgICBsZXQga25vd25Mb3RzID0gbmV3IE1hcChnZXRMb3RTdGF0ZXNBbnN3ZXIubWFwKHAgPT4gW3AubG90SWQsIHBdKSk7XHJcblxyXG4gICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGlmIChrbm93bkxvdHMuaGFzKHguaWQpKSB7XHJcbiAgICAgICAgICAgIGxldCBsb3RTdGF0ZSA9IGtub3duTG90cy5nZXQoeC5pZClcclxuICAgICAgICAgICAgbGV0IGRpZmZJbkRheXMgPSBNYXRoLmNlaWwoKHguc29sZERhdGUuZ2V0VGltZSgpIC0gbmV3IERhdGUobG90U3RhdGUubGFzdFVwZGF0ZSkuZ2V0VGltZSgpKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpZmZJbkRheXMpXHJcbiAgICAgICAgICAgIGlmIChkaWZmSW5EYXlzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgeC5saW5rLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogI2UwZTA3ZjtgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB4Lmxpbmsuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiBub25lO2BcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4Lmxpbmsuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodHBpbms7YFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNsYXNzIExvdExpbmsge1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgbGluazogSFRNTEFuY2hvckVsZW1lbnQsIHNvbGREYXRlOiBEYXRlKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkXHJcbiAgICAgICAgdGhpcy5saW5rID0gbGlua1xyXG4gICAgICAgIHRoaXMuc29sZERhdGUgPSBzb2xkRGF0ZVxyXG4gICAgfVxyXG5cclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudDtcclxuICAgIHNvbGREYXRlOiBEYXRlXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcbiAgICBsZXQgb0F1dGgyQ2xpZW50ID0gbmV3IE9BdXRoMkNsaWVudCh7XHJcbiAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgIGNsaWVudElkOiAnRWJheS5DaHJvbWVFeHRlbnNpb24nLFxyXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6ICcvY29ubmVjdC90b2tlbicsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcblxyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09PSBhdXRoUmVkaXJlY3RVcmwpIHtcclxuICAgICAgICBhd2FpdCBhdXRoUGFnZShvQXV0aDJDbGllbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY2xpZW50ID0gbmV3IENsaWVudChiYXNlQXBpVXJsLCBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQpKTtcclxuICAgICAgICBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIikpIHtcclxuICAgICAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9zY2gvXCIpKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNlYXJjaFBhZ2UoY2xpZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9