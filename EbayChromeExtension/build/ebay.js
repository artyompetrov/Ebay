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
exports.ApiException = exports.Errors2 = exports.Errors = exports.ValidationProblemDetailedInfo = exports.NotFoundProblemDetailedInfo = exports.ProblemDetailedInfo = exports.LotState = exports.ManualCondition = exports.PurchaseInfo = exports.LotInfo = exports.LotInfoWithProductId = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
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
                result400 = ValidationProblemDetailedInfo.fromJS(resultData400);
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
                result400 = ValidationProblemDetailedInfo.fromJS(resultData400);
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
     * Получить информацию о лоте
     * @return Ok
     */
    getLotInfo(lotId) {
        let url_ = this.baseUrl + "/lots/{lotId}/";
        if (lotId === undefined || lotId === null)
            throw new Error("The parameter 'lotId' must be defined.");
        url_ = url_.replace("{lotId}", encodeURIComponent("" + lotId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetLotInfo(_response);
        });
    }
    processGetLotInfo(response) {
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
                result200 = LotInfoWithProductId.fromJS(resultData200);
                return result200;
            });
        }
        else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400 = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = NotFoundProblemDetailedInfo.fromJS(resultData400);
                return throwException("NotFound", status, _responseText, _headers, result400);
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
class LotInfoWithProductId {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
        if (!data) {
            this.lotInfo = new LotInfo();
        }
    }
    init(_data) {
        if (_data) {
            this.productId = _data["productId"];
            this.lotInfo = _data["lotInfo"] ? LotInfo.fromJS(_data["lotInfo"]) : new LotInfo();
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new LotInfoWithProductId();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["productId"] = this.productId;
        data["lotInfo"] = this.lotInfo ? this.lotInfo.toJSON() : undefined;
        return data;
    }
}
exports.LotInfoWithProductId = LotInfoWithProductId;
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
class ProblemDetailedInfo {
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
        throw new Error("The abstract class 'ProblemDetailedInfo' cannot be instantiated.");
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
exports.ProblemDetailedInfo = ProblemDetailedInfo;
class NotFoundProblemDetailedInfo extends ProblemDetailedInfo {
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
        let result = new NotFoundProblemDetailedInfo();
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
exports.NotFoundProblemDetailedInfo = NotFoundProblemDetailedInfo;
class ValidationProblemDetailedInfo extends ProblemDetailedInfo {
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
        let result = new ValidationProblemDetailedInfo();
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
exports.ValidationProblemDetailedInfo = ValidationProblemDetailedInfo;
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
class Errors2 {
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
        let result = new Errors2();
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
exports.Errors2 = Errors2;
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
const ignoreThatLotFieldName = "ignoreThatLot";
const manualConditionIdFieldName = "manualConditionId";
const productFieldName = "productId";
const pcsFieldName = "pcs";
const panelClass = "panel-div";
const formId = "product-form-id";
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
        <label for="${ignoreThatLotFieldName}">Игнорировать лот</label>
        <input id="${ignoreThatLotFieldName}" type="checkbox" name="${ignoreThatLotFieldName}"/>
        <br>
        <br>
        <label for="${productFieldName}">Товар</label>
        <select name="${productFieldName}" id="${productFieldName}">
            <option>Выберите товар</option>
        </select>
        <br>
        <label for="${pcsFieldName}">PCS</label>
        <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
        <br>
        <label for="${manualConditionIdFieldName}">Состояние</label>
        <select name="${manualConditionIdFieldName}" id="${manualConditionIdFieldName}">
            <option>Выберите Состояние</option>
        </select>
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
            let ignoreThatLot = false;
            data.forEach(function (value, key) {
                if (key === 'ignoreThatLot') {
                    ignoreThatLot = true;
                }
                else {
                    lotInfo[key] = value;
                }
            });
            lotInfo['ignoreThatLot'] = ignoreThatLot;
            console.log(JSON.stringify(lotInfo));
            yield client.upsertLotInfo(lotInfo, data.get('productId').toString());
            yield productPage(client);
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
function fillPrice() {
    lotInfo.price = extractPrice(document.querySelector('div.x-price-primary span').innerText);
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
function fillShipping() {
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
            lotInfo.shipping = extractPrice(shippingValue);
            if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {
                lotInfo.shippingAdditional = extractPrice(shippingMaxviewValues['Each additional item']);
            }
            else {
                lotInfo.shippingAdditional = 0;
            }
        }
        else {
            lotInfo.shipping = 0;
            lotInfo.shippingAdditional = 0;
        }
    }
}
function fillLocatedIn() {
    lotInfo.locatedIn = document.querySelector('div.d-shipping-minview').innerText.match(/Located\sin:\s(.+)/)[1];
}
function fillDescription() {
    return __awaiter(this, void 0, void 0, function* () {
        let descriptionUrl = document.querySelector('#desc_ifr').src;
        let response = yield fetchResource(descriptionUrl, { method: 'GET', credentials: 'include' });
        lotInfo.description = yield response.text();
    });
}
function fillPurchaseHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
        let response = yield fetchResource(purchaseHistoryUrl, { method: 'GET', credentials: 'include' });
        let text = yield response.text();
        lotInfo.purchaseHistory = parseSoldItemsPage(text);
    });
}
function fillProduct(panel, client, serverLotInfo) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        let productField = panel.querySelector('select#' + productFieldName);
        let productId = (_b = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.productId) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        let searchQuery = (_e = (_d = (_c = new URL(document.referrer).searchParams) === null || _c === void 0 ? void 0 : _c.get('_nkw')) === null || _d === void 0 ? void 0 : _d.trim()) === null || _e === void 0 ? void 0 : _e.toLowerCase();
        let products = yield client.getAllProducts();
        for (let i = 0; i < products.length; i++) {
            let opt = document.createElement('option');
            opt.value = products[i].id;
            opt.innerHTML = products[i].name;
            if (productId !== undefined) {
                if (productId === products[i].id.trim().toLowerCase()) {
                    opt.selected = true;
                }
            }
            else if (searchQuery !== undefined) {
                if (searchQuery === products[i].searchQuery.trim().toLowerCase()) {
                    opt.selected = true;
                }
            }
            productField.appendChild(opt);
        }
    });
}
function fillManualCondition(panel, client, serverLotInfo) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let manualConditionField = panel.querySelector('select#' + manualConditionIdFieldName);
        let manualConditionId = (_c = (_b = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.lotInfo) === null || _a === void 0 ? void 0 : _a.manualConditionId) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        let manualConditions = yield client.getManualConditionsList();
        for (let i = 0; i < manualConditions.length; i++) {
            let opt = document.createElement('option');
            opt.value = manualConditions[i].id;
            opt.innerHTML = manualConditions[i].description;
            if (manualConditionId !== undefined) {
                if (manualConditionId === manualConditions[i].id.trim().toLowerCase()) {
                    opt.selected = true;
                }
            }
            manualConditionField.appendChild(opt);
        }
    });
}
function getServerLotInfo(client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield client.getLotInfo(lotInfo.lotId);
        }
        catch (error) {
            if (error instanceof EbayClient_1.ApiException) {
                if (error.response["type"] === 'NotFoundProblemDetailedInfo') {
                    return undefined;
                }
                else
                    throw error;
            }
            else
                throw error;
        }
    });
}
function fillPcs(panel, serverLotInfo) {
    var _a;
    let pcsField = panel.querySelector('input#' + pcsFieldName);
    let serverPcs = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.lotInfo) === null || _a === void 0 ? void 0 : _a.pcs;
    if (serverPcs !== undefined) {
        pcsField.value = serverPcs.toString();
    }
}
function fillIgnoreThatLot(panel, serverLotInfo) {
    var _a;
    let ignoreThatLotField = panel.querySelector('input#' + ignoreThatLotFieldName);
    let serverPcs = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.lotInfo) === null || _a === void 0 ? void 0 : _a.ignoreThatLot;
    if (serverPcs !== undefined) {
        ignoreThatLotField.checked = serverPcs;
    }
}
function getDataFromPage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let panel = document.querySelector('div.' + panelClass);
        fillId();
        fillPrice();
        fillShipping();
        fillName();
        fillSeller();
        fillCondition();
        fillConditionDescription();
        fillLocatedIn();
        let serverLotInfo = yield getServerLotInfo(client);
        yield fillProduct(panel, client, serverLotInfo);
        yield fillManualCondition(panel, client, serverLotInfo);
        fillPcs(panel, serverLotInfo);
        fillIgnoreThatLot(panel, serverLotInfo);
        yield fillDescription();
        yield fillPurchaseHistory();
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
            let codeVerifier = yield (0, oauth2_client_1.generateCodeVerifier)();
            yield chrome.storage.local.set({ code_verifier: codeVerifier });
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
function hideErrors() {
    let errorDiv = document.querySelector('div.' + panelClass + ' #' + errorElementId);
    errorDiv.innerHTML = "";
}
function productPage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            addHistoryButton();
            addPanel(client);
            yield getDataFromPage(client);
            enableSubmitButton();
            hideErrors();
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
            let returnPage = (yield chrome.storage.local.get(["return_to_page"])).return_to_page;
            console.log("returning to " + returnPage);
            document.location.href = returnPage;
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
                if (!lotState.ignoreThatLot) {
                    let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                    console.log(diffInDays);
                    if (diffInDays > 0) {
                        x.link.style.cssText = `background-color: #e0e07f;`;
                    }
                    else {
                        x.link.style.cssText = `background-color: none;`;
                    }
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
            let currentPage = location.protocol + '//' + location.host + location.pathname;
            yield chrome.storage.local.set({ return_to_page: currentPage });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLEdBQUcsUUFBUSxDQUFDLFFBQVE7UUFFOUUsSUFBSSxXQUFXLEtBQUssZUFBZSxFQUFFLENBQUM7WUFDbEMsTUFBTSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxRQUFRO1lBQzlFLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsY0FBYyxFQUFFLFdBQVcsRUFBQyxDQUFDO1lBRTdELElBQUksTUFBTSxHQUFHLElBQUksbUJBQU0sQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNyRSxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDO2lCQUFNLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLENBQUM7Z0JBQzdELE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBeEJELGtCQXdCQztBQUdELEdBQUcsRUFBRSxDQUFDOzs7Ozs7O1VDdG1CTjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQvYnJvd3Nlci9vYXV0aDItY2xpZW50Lm1pbi5qcyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9FYmF5Q2xpZW50L0ViYXlDbGllbnQudHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRmV0Y2hXcmFwcGVyQ3VzdG9tLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL21haW4udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk9BdXRoMkNsaWVudD10KCk6ZS5PQXV0aDJDbGllbnQ9dCgpfShzZWxmLCgoKT0+KCgpPT57dmFyIGU9ezkzNDooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXQuT0F1dGgyQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoNDQzKSxpPXIoNjE4KTtmdW5jdGlvbiBvKGUsdCl7cmV0dXJuIG5ldyBVUkwoZSx0KS50b1N0cmluZygpfWZ1bmN0aW9uIHMoZSl7cmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGUpLmZpbHRlcigoKFtlLHRdKT0+dm9pZCAwIT09dCkpKSkudG9TdHJpbmcoKX10Lk9BdXRoMkNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmRpc2NvdmVyeURvbmU9ITEsdGhpcy5zZXJ2ZXJNZXRhZGF0YT1udWxsLChudWxsPT1lP3ZvaWQgMDplLmZldGNoKXx8KGUuZmV0Y2g9ZmV0Y2guYmluZChnbG9iYWxUaGlzKSksdGhpcy5zZXR0aW5ncz1lfWFzeW5jIHJlZnJlc2hUb2tlbihlKXtpZighZS5yZWZyZXNoVG9rZW4pdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0b2tlbiBkaWRuJ3QgaGF2ZSBhIHJlZnJlc2hUb2tlbi4gSXQncyBub3QgcG9zc2libGUgdG8gcmVmcmVzaCB0aGlzXCIpO2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJyZWZyZXNoX3Rva2VuXCIscmVmcmVzaF90b2tlbjplLnJlZnJlc2hUb2tlbn07cmV0dXJuIHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0fHwodC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCksdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfWFzeW5jIGNsaWVudENyZWRlbnRpYWxzKGUpe3ZhciB0O2NvbnN0IHI9W1wiY2xpZW50X2lkXCIsXCJjbGllbnRfc2VjcmV0XCIsXCJncmFudF90eXBlXCIsXCJzY29wZVwiXTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+ci5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7ci5qb2luKFwiJywgJ1wiKX0nYCk7Y29uc3Qgbj17Z3JhbnRfdHlwZTpcImNsaWVudF9jcmVkZW50aWFsc1wiLHNjb3BlOm51bGw9PT0odD1udWxsPT1lP3ZvaWQgMDplLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfTtpZighdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpdGhyb3cgbmV3IEVycm9yKFwiQSBjbGllbnRTZWNyZXQgbXVzdCBiZSBwcm92aWRlZCB0byB1c2UgY2xpZW50X2NyZWRlbnRpYWxzXCIpO3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixuKSl9YXN5bmMgcGFzc3dvcmQoZSl7dmFyIHQ7Y29uc3Qgcj17Z3JhbnRfdHlwZTpcInBhc3N3b3JkXCIsLi4uZSxzY29wZTpudWxsPT09KHQ9ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIil9O3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixyKSl9Z2V0IGF1dGhvcml6YXRpb25Db2RlKCl7cmV0dXJuIG5ldyBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50KHRoaXMpfWFzeW5jIGludHJvc3BlY3QoZSl7Y29uc3QgdD17dG9rZW46ZS5hY2Nlc3NUb2tlbix0b2tlbl90eXBlX2hpbnQ6XCJhY2Nlc3NfdG9rZW5cIn07cmV0dXJuIHRoaXMucmVxdWVzdChcImludHJvc3BlY3Rpb25FbmRwb2ludFwiLHQpfWFzeW5jIGdldEVuZHBvaW50KGUpe2lmKHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoXCJkaXNjb3ZlcnlFbmRwb2ludFwiIT09ZSYmKGF3YWl0IHRoaXMuZGlzY292ZXIoKSx2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZighdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiAke2V9LiBFaXRoZXIgc3BlY2lmeSAke2V9IGluIHRoZSBzZXR0aW5ncywgb3IgdGhlIFwic2VydmVyXCIgZW5kcG9pbnQgdG8gbGV0IHRoZSBjbGllbnQgZGlzY292ZXIgaXQuYCk7c3dpdGNoKGUpe2Nhc2VcImF1dGhvcml6YXRpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2F1dGhvcml6ZVwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJ0b2tlbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvdG9rZW5cIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiZGlzY292ZXJ5RW5kcG9pbnRcIjpyZXR1cm4gbyhcIi8ud2VsbC1rbm93bi9vYXV0aC1hdXRob3JpemF0aW9uLXNlcnZlclwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9pbnRyb3NwZWN0XCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpfX1hc3luYyBkaXNjb3Zlcigpe3ZhciBlO2lmKHRoaXMuZGlzY292ZXJ5RG9uZSlyZXR1cm47bGV0IHQ7dGhpcy5kaXNjb3ZlcnlEb25lPSEwO3RyeXt0PWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoXCJkaXNjb3ZlcnlFbmRwb2ludFwiKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgY291bGQgbm90IGJlIGRldGVybWluZWQuIEVpdGhlciBzcGVjaWZ5IHRoZSBcInNlcnZlclwiIG9yIFwiZGlzY292ZXJ5RW5kcG9pbnQnKX1jb25zdCByPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2godCx7aGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvblwifX0pO2lmKCFyLm9rKXJldHVybjtpZighKG51bGw9PT0oZT1yLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSkpcmV0dXJuIHZvaWQgY29uc29sZS53YXJuKFwiW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCB3YXMgbm90IGEgSlNPTiByZXNwb25zZS4gUmVzcG9uc2UgaXMgaWdub3JlZFwiKTt0aGlzLnNlcnZlck1ldGFkYXRhPWF3YWl0IHIuanNvbigpO2NvbnN0IG49W1tcImF1dGhvcml6YXRpb25fZW5kcG9pbnRcIixcImF1dGhvcml6YXRpb25FbmRwb2ludFwiXSxbXCJ0b2tlbl9lbmRwb2ludFwiLFwidG9rZW5FbmRwb2ludFwiXSxbXCJpbnRyb3NwZWN0aW9uX2VuZHBvaW50XCIsXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIl1dO2lmKG51bGwhPT10aGlzLnNlcnZlck1ldGFkYXRhKXtmb3IoY29uc3RbZSxyXW9mIG4pdGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSYmKHRoaXMuc2V0dGluZ3Nbcl09byh0aGlzLnNlcnZlck1ldGFkYXRhW2VdLHQpKTt0aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWQmJiF0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kJiYodGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZD10aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWRbMF0pfX1hc3luYyByZXF1ZXN0KGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEVuZHBvaW50KGUpLGk9e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIn07bGV0IG89dGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZDtzd2l0Y2gob3x8KG89dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQ/XCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6XCJjbGllbnRfc2VjcmV0X3Bvc3RcIiksbyl7Y2FzZVwiY2xpZW50X3NlY3JldF9iYXNpY1wiOmkuQXV0aG9yaXphdGlvbj1cIkJhc2ljIFwiK2J0b2EodGhpcy5zZXR0aW5ncy5jbGllbnRJZCtcIjpcIit0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7Y2FzZVwiY2xpZW50X3NlY3JldF9wb3N0XCI6dC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCx0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKHQuY2xpZW50X3NlY3JldD10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBtZXRob2Qgbm90IHlldCBzdXBwb3J0ZWQ6XCIrbytcIi4gT3BlbiBhIGZlYXR1cmUgcmVxdWVzdCBpZiB5b3Ugd2FudCB0aGlzIVwiKX1jb25zdCBhPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2gocix7bWV0aG9kOlwiUE9TVFwiLGJvZHk6cyh0KSxoZWFkZXJzOml9KTtpZihhLm9rKXJldHVybiBhd2FpdCBhLmpzb24oKTtsZXQgYyxoLHU7dGhyb3cgYS5oZWFkZXJzLmhhcyhcIkNvbnRlbnQtVHlwZVwiKSYmYS5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSYmKGM9YXdhaXQgYS5qc29uKCkpLChudWxsPT1jP3ZvaWQgMDpjLmVycm9yKT8oaD1cIk9BdXRoMiBlcnJvciBcIitjLmVycm9yK1wiLlwiLGMuZXJyb3JfZGVzY3JpcHRpb24mJihoKz1cIiBcIitjLmVycm9yX2Rlc2NyaXB0aW9uKSx1PWMuZXJyb3IpOihoPVwiSFRUUCBFcnJvciBcIithLnN0YXR1cytcIiBcIithLnN0YXR1c1RleHQsNDAxPT09YS5zdGF0dXMmJnRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYoaCs9XCIuIEl0J3MgbGlrZWx5IHRoYXQgdGhlIGNsaWVudElkIGFuZC9vciBjbGllbnRTZWNyZXQgd2FzIGluY29ycmVjdFwiKSx1PW51bGwpLG5ldyBuLk9BdXRoMkVycm9yKGgsdSxhLnN0YXR1cyl9dG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4oZSl7cmV0dXJuIGUudGhlbigoZT0+e3ZhciB0O3JldHVybnthY2Nlc3NUb2tlbjplLmFjY2Vzc190b2tlbixleHBpcmVzQXQ6ZS5leHBpcmVzX2luP0RhdGUubm93KCkrMWUzKmUuZXhwaXJlc19pbjpudWxsLHJlZnJlc2hUb2tlbjpudWxsIT09KHQ9ZS5yZWZyZXNoX3Rva2VuKSYmdm9pZCAwIT09dD90Om51bGx9fSkpfX0sdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXN9LDYxODooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZXRDb2RlQ2hhbGxlbmdlPXQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDkzNCksaT1yKDQ0Myk7YXN5bmMgZnVuY3Rpb24gbyhlKXtjb25zdCB0PXMoKTtpZihudWxsPT10P3ZvaWQgMDp0LnN1YnRsZSlyZXR1cm5bXCJTMjU2XCIsYyhhd2FpdCB0LnN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsYShlKSkpXTt7Y29uc3QgdD1yKDIxMikuY3JlYXRlSGFzaChcInNoYTI1NlwiKTtyZXR1cm4gdC51cGRhdGUoYShlKSksW1wiUzI1NlwiLHQuZGlnZXN0KFwiYmFzZTY0dXJsXCIpXX19ZnVuY3Rpb24gcygpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jcnlwdG8pcmV0dXJuIHdpbmRvdy5jcnlwdG87aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJnNlbGYuY3J5cHRvKXJldHVybiBzZWxmLmNyeXB0bztjb25zdCBlPXIoMjEyKTtyZXR1cm4gZS53ZWJjcnlwdG8/ZS53ZWJjcnlwdG86bnVsbH1mdW5jdGlvbiBhKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09MjU1JmUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH1mdW5jdGlvbiBjKGUpe3JldHVybiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkoZSkpKS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoLz0rJC8sXCJcIil9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmNsaWVudD1lfWFzeW5jIGdldEF1dGhvcml6ZVVyaShlKXtjb25zdFt0LHJdPWF3YWl0IFByb21pc2UuYWxsKFtlLmNvZGVWZXJpZmllcj9vKGUuY29kZVZlcmlmaWVyKTp2b2lkIDAsdGhpcy5jbGllbnQuZ2V0RW5kcG9pbnQoXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIildKTtsZXQgaT17Y2xpZW50X2lkOnRoaXMuY2xpZW50LnNldHRpbmdzLmNsaWVudElkLHJlc3BvbnNlX3R5cGU6XCJjb2RlXCIscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV9jaGFsbGVuZ2VfbWV0aG9kOm51bGw9PXQ/dm9pZCAwOnRbMF0sY29kZV9jaGFsbGVuZ2U6bnVsbD09dD92b2lkIDA6dFsxXX07ZS5zdGF0ZSYmKGkuc3RhdGU9ZS5zdGF0ZSksZS5zY29wZSYmKGkuc2NvcGU9ZS5zY29wZS5qb2luKFwiIFwiKSk7Y29uc3Qgcz1PYmplY3Qua2V5cyhpKTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+cy5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7cy5qb2luKFwiJywgJ1wiKX0nYCk7cmV0dXJuIGk9ey4uLmksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc30scitcIj9cIisoMCxuLmdlbmVyYXRlUXVlcnlTdHJpbmcpKGkpfWFzeW5jIGdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChlLHQpe2NvbnN0e2NvZGU6cn09YXdhaXQgdGhpcy52YWxpZGF0ZVJlc3BvbnNlKGUse3N0YXRlOnQuc3RhdGV9KTtyZXR1cm4gdGhpcy5nZXRUb2tlbih7Y29kZTpyLHJlZGlyZWN0VXJpOnQucmVkaXJlY3RVcmksY29kZVZlcmlmaWVyOnQuY29kZVZlcmlmaWVyfSl9YXN5bmMgdmFsaWRhdGVSZXNwb25zZShlLHQpe3ZhciByO2NvbnN0IG49bmV3IFVSTChlKS5zZWFyY2hQYXJhbXM7aWYobi5oYXMoXCJlcnJvclwiKSl0aHJvdyBuZXcgaS5PQXV0aDJFcnJvcihudWxsIT09KHI9bi5nZXQoXCJlcnJvcl9kZXNjcmlwdGlvblwiKSkmJnZvaWQgMCE9PXI/cjpcIk9BdXRoMiBlcnJvclwiLG4uZ2V0KFwiZXJyb3JcIiksMCk7aWYoIW4uaGFzKFwiY29kZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSB1cmwgZGlkIG5vdCBjb250YWluIGEgY29kZSBwYXJhbWV0ZXIgJHtlfWApO2lmKHQuc3RhdGUmJnQuc3RhdGUhPT1uLmdldChcInN0YXRlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIFwic3RhdGVcIiBwYXJhbWV0ZXIgaW4gdGhlIHVybCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCB2YWx1ZSBvZiAke3Quc3RhdGV9YCk7cmV0dXJue2NvZGU6bi5nZXQoXCJjb2RlXCIpLHNjb3BlOm4uaGFzKFwic2NvcGVcIik/bi5nZXQoXCJzY29wZVwiKS5zcGxpdChcIiBcIik6dm9pZCAwfX1hc3luYyBnZXRUb2tlbihlKXtjb25zdCB0PXtncmFudF90eXBlOlwiYXV0aG9yaXphdGlvbl9jb2RlXCIsY29kZTplLmNvZGUscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV92ZXJpZmllcjplLmNvZGVWZXJpZmllcn07cmV0dXJuIHRoaXMuY2xpZW50LnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMuY2xpZW50LnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfX0sdC5nZW5lcmF0ZUNvZGVWZXJpZmllcj1hc3luYyBmdW5jdGlvbigpe2NvbnN0IGU9cygpO2lmKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoMzIpO3JldHVybiBlLmdldFJhbmRvbVZhbHVlcyh0KSxjKHQpfXtjb25zdCBlPXIoMjEyKTtyZXR1cm4gbmV3IFByb21pc2UoKCh0LHIpPT57ZS5yYW5kb21CeXRlcygzMiwoKGUsbik9PntlJiZyKGUpLHQobi50b1N0cmluZyhcImJhc2U2NHVybFwiKSl9KSl9KSl9fSx0LmdldENvZGVDaGFsbGVuZ2U9b30sNDQzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJFcnJvcj12b2lkIDA7Y2xhc3MgciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKGUsdCxyKXtzdXBlcihlKSx0aGlzLm9hdXRoMkNvZGU9dCx0aGlzLmh0dHBDb2RlPXJ9fXQuT0F1dGgyRXJyb3I9cn0sMTM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkZldGNoPXZvaWQgMCx0Lk9BdXRoMkZldGNoPWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMudG9rZW49bnVsbCx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGwsdGhpcy5hY3RpdmVSZWZyZXNoPW51bGwsdGhpcy5yZWZyZXNoVGltZXI9bnVsbCx2b2lkIDA9PT0obnVsbD09ZT92b2lkIDA6ZS5zY2hlZHVsZVJlZnJlc2gpJiYoZS5zY2hlZHVsZVJlZnJlc2g9ITApLHRoaXMub3B0aW9ucz1lLGUuZ2V0U3RvcmVkVG9rZW4mJih0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPShhc3luYygpPT57dGhpcy50b2tlbj1hd2FpdCBlLmdldFN0b3JlZFRva2VuKCksdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsfSkoKSksdGhpcy5zY2hlZHVsZVJlZnJlc2goKX1hc3luYyBmZXRjaChlLHQpe2NvbnN0IHI9bmV3IFJlcXVlc3QoZSx0KTtyZXR1cm4gdGhpcy5tdygpKHIsKGU9PmZldGNoKGUpKSl9bXcoKXtyZXR1cm4gYXN5bmMoZSx0KT0+e2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO2xldCBuPWUuY2xvbmUoKTtuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IpO2xldCBpPWF3YWl0IHQobik7aWYoIWkub2smJjQwMT09PWkuc3RhdHVzKXtjb25zdCByPWF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7bj1lLmNsb25lKCksbi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityLmFjY2Vzc1Rva2VuKSxpPWF3YWl0IHQobil9cmV0dXJuIGl9fWFzeW5jIGdldFRva2VuKCl7cmV0dXJuIHRoaXMudG9rZW4mJihudWxsPT09dGhpcy50b2tlbi5leHBpcmVzQXR8fHRoaXMudG9rZW4uZXhwaXJlc0F0PkRhdGUubm93KCkpP3RoaXMudG9rZW46dGhpcy5yZWZyZXNoVG9rZW4oKX1hc3luYyBnZXRBY2Nlc3NUb2tlbigpe3JldHVybiBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuLChhd2FpdCB0aGlzLmdldFRva2VuKCkpLmFjY2Vzc1Rva2VufWFzeW5jIHJlZnJlc2hUb2tlbigpe3ZhciBlLHQ7aWYodGhpcy5hY3RpdmVSZWZyZXNoKXJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7Y29uc3Qgcj10aGlzLnRva2VuO3RoaXMuYWN0aXZlUmVmcmVzaD0oYXN5bmMoKT0+e3ZhciBlLHQ7bGV0IG49bnVsbDt0cnl7KG51bGw9PXI/dm9pZCAwOnIucmVmcmVzaFRva2VuKSYmKG49YXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ocikpfWNhdGNoKGUpe2NvbnNvbGUud2FybihcIltvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZSdsbCB0cnkgcmVhdXRoZW50aWNhdGluZ1wiKX1pZihufHwobj1hd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKSksIW4pe2NvbnN0IHI9bmV3IEVycm9yKFwiVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWRcIik7dGhyb3cgbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykub25FcnJvcil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHJ9cmV0dXJuIG59KSgpO3RyeXtjb25zdCByPWF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtyZXR1cm4gdGhpcy50b2tlbj1yLG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLnN0b3JlVG9rZW4pfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpLHJ9Y2F0Y2goZSl7dGhyb3cgdGhpcy5vcHRpb25zLm9uRXJyb3ImJnRoaXMub3B0aW9ucy5vbkVycm9yKGUpLGV9ZmluYWxseXt0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbH19c2NoZWR1bGVSZWZyZXNoKCl7dmFyIGU7aWYoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpcmV0dXJuO2lmKHRoaXMucmVmcmVzaFRpbWVyJiYoY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKSx0aGlzLnJlZnJlc2hUaW1lcj1udWxsKSwhKG51bGw9PT0oZT10aGlzLnRva2VuKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5leHBpcmVzQXQpfHwhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pcmV0dXJuO2NvbnN0IHQ9dGhpcy50b2tlbi5leHBpcmVzQXQtRGF0ZS5ub3coKTt0PDEyZTR8fCh0aGlzLnJlZnJlc2hUaW1lcj1zZXRUaW1lb3V0KChhc3luYygpPT57dHJ5e2F3YWl0IHRoaXMucmVmcmVzaFRva2VuKCl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihcIltmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoXCIsZSl9fSksdC02ZTQpKX19fSwyMTI6KCk9Pnt9fSx0PXt9O2Z1bmN0aW9uIHIobil7dmFyIGk9dFtuXTtpZih2b2lkIDAhPT1pKXJldHVybiBpLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fX07cmV0dXJuIGVbbl0obyxvLmV4cG9ydHMsciksby5leHBvcnRzfXZhciBuPXt9O3JldHVybigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBlPW47T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5PQXV0aDJFcnJvcj1lLk9BdXRoMkZldGNoPWUuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9ZS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1lLk9BdXRoMkNsaWVudD12b2lkIDA7dmFyIHQ9cig5MzQpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQuT0F1dGgyQ2xpZW50fX0pO3ZhciBpPXIoNjE4KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJnZW5lcmF0ZUNvZGVWZXJpZmllclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLmdlbmVyYXRlQ29kZVZlcmlmaWVyfX0pO3ZhciBvPXIoMTMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRmV0Y2hcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gby5PQXV0aDJGZXRjaH19KTt2YXIgcz1yKDQ0Myk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJFcnJvclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzLk9BdXRoMkVycm9yfX0pfSkoKSxufSkoKSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYXV0aDItY2xpZW50Lm1pbi5qcy5tYXAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gPGF1dG8tZ2VuZXJhdGVkPlxyXG4vLyAgICAgR2VuZXJhdGVkIHVzaW5nIHRoZSBOU3dhZyB0b29sY2hhaW4gdjEzLjIwLjAuMCAoTkpzb25TY2hlbWEgdjEwLjkuMC4wIChOZXd0b25zb2Z0Lkpzb24gdjEzLjAuMC4wKSkgKGh0dHA6Ly9OU3dhZy5vcmcpXHJcbi8vIDwvYXV0by1nZW5lcmF0ZWQ+XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyogdHNsaW50OmRpc2FibGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuLy8gUmVTaGFycGVyIGRpc2FibGUgSW5jb25zaXN0ZW50TmFtaW5nXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcclxuICAgIHByaXZhdGUgaHR0cDogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9O1xyXG4gICAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQganNvblBhcnNlUmV2aXZlcjogKChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlVXJsPzogc3RyaW5nLCBodHRwPzogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9KSB7XHJcbiAgICAgICAgdGhpcy5odHRwID0gaHR0cCA/IGh0dHAgOiB3aW5kb3cgYXMgYW55O1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmwgIT09IHVuZGVmaW5lZCAmJiBiYXNlVXJsICE9PSBudWxsID8gYmFzZVVybCA6IFwiL2FwaS9lYmF5L3YxXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0IGFsbCBwcm9kdWN0c1xyXG4gICAgICogQHJldHVybiBPS1xyXG4gICAgICovXHJcbiAgICBnZXRBbGxQcm9kdWN0cygpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRBbGxQcm9kdWN0cyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0QWxsUHJvZHVjdHMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChQcm9kdWN0V2l0aElkLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxQcm9kdWN0V2l0aElkW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0NyZWF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NyZWF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gcmVzdWx0RGF0YTIwMCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0RGF0YTIwMCA6IDxhbnk+bnVsbDtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8c3RyaW5nPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZVByb2R1Y3QocHJvZHVjdDogUHJvZHVjdFdpdGhvdXRJZCwgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NVcGRhdGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NVcGRhdGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlbGV0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIERlbGV0ZWRcclxuICAgICAqL1xyXG4gICAgZGVsZXRlUHJvZHVjdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9XCI7XHJcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQgfHwgaWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2lkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7aWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgaWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0RlbGV0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0RlbGV0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQu9C+0YLQtVxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICB1cHNlcnRMb3RJbmZvKGxvdEluZm86IExvdEluZm8sIHByb2R1Y3RJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97cHJvZHVjdElkfS9sb3RzL1wiO1xyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgPT09IHVuZGVmaW5lZCB8fCBwcm9kdWN0SWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ3Byb2R1Y3RJZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie3Byb2R1Y3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBwcm9kdWN0SWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm8pO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NVcHNlcnRMb3RJbmZvKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NVcHNlcnRMb3RJbmZvKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdEluZm8obG90SWQ6IG51bWJlcik6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdHMve2xvdElkfS9cIjtcclxuICAgICAgICBpZiAobG90SWQgPT09IHVuZGVmaW5lZCB8fCBsb3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnbG90SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntsb3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBsb3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDIwMCA9IExvdEluZm9XaXRoUHJvZHVjdElkLmZyb21KUyhyZXN1bHREYXRhMjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRg9GH0YLQtdC90L3Ri9GFINC70L7RgtCw0YVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TG90U3RhdGVzKGxvdElkczogbnVtYmVyW10pOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdF9zdGF0ZV9yZXF1ZXN0cy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdElkcyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RTdGF0ZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdFN0YXRlcyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChMb3RTdGF0ZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90U3RhdGVbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC00LDQtdGCINC/0LXRgNC10YfQtdC90Ywg0LLQvtC30LzQvtC20L3Ri9GFINGB0L7RgdGC0L7Rj9C90LjQuSDQv9GA0L7QtNCw0LLQsNC10LzQvtCz0L4g0YLQvtCy0LDRgNCwXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldE1hbnVhbENvbmRpdGlvbnNMaXN0KCk6IFByb21pc2U8TWFudWFsQ29uZGl0aW9uW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL21hbnVhbF9jb25kaXRpb25zL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldE1hbnVhbENvbmRpdGlvbnNMaXN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTWFudWFsQ29uZGl0aW9uLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxNYW51YWxDb25kaXRpb25bXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhvdXRJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRob3V0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJOYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gX2RhdGFbXCJTZWFyY2hRdWVyeVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9kdWN0V2l0aG91dElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHJvZHVjdFdpdGhvdXRJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyeVwiXSA9IHRoaXMuc2VhcmNoUXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRoSWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRoSWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiSWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IF9kYXRhW1wiU2VhcmNoUXVlcnlcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRoSWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiSWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyeVwiXSA9IHRoaXMuc2VhcmNoUXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RJbmZvV2l0aFByb2R1Y3RJZCBpbXBsZW1lbnRzIElMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICBwcm9kdWN0SWQhOiBzdHJpbmc7XHJcbiAgICBsb3RJbmZvITogTG90SW5mbztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm9XaXRoUHJvZHVjdElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJbmZvID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2R1Y3RJZCA9IF9kYXRhW1wicHJvZHVjdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvdEluZm8gPSBfZGF0YVtcImxvdEluZm9cIl0gPyBMb3RJbmZvLmZyb21KUyhfZGF0YVtcImxvdEluZm9cIl0pIDogbmV3IExvdEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm9XaXRoUHJvZHVjdElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInByb2R1Y3RJZFwiXSA9IHRoaXMucHJvZHVjdElkO1xyXG4gICAgICAgIGRhdGFbXCJsb3RJbmZvXCJdID0gdGhpcy5sb3RJbmZvID8gdGhpcy5sb3RJbmZvLnRvSlNPTigpIDogPGFueT51bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgIHByb2R1Y3RJZDogc3RyaW5nO1xyXG4gICAgbG90SW5mbzogTG90SW5mbztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdEluZm8gaW1wbGVtZW50cyBJTG90SW5mbyB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBwY3MhOiBudW1iZXI7XHJcbiAgICBwcmljZSE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nITogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsITogbnVtYmVyO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlciE6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbiE6IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQhOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3RvcnkhOiBQdXJjaGFzZUluZm9bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucGNzID0gX2RhdGFbXCJwY3NcIl07XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nID0gX2RhdGFbXCJzaGlwcGluZ1wiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZ0FkZGl0aW9uYWwgPSBfZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uID0gX2RhdGFbXCJjb25kaXRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb24gPSBfZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGxlciA9IF9kYXRhW1wic2VsbGVyXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZWRJbiA9IF9kYXRhW1wibG9jYXRlZEluXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubWFudWFsQ29uZGl0aW9uSWQgPSBfZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5ID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSEucHVzaChQdXJjaGFzZUluZm8uZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wibmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wicGNzXCJdID0gdGhpcy5wY3M7XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdcIl0gPSB0aGlzLnNoaXBwaW5nO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl0gPSB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJzZWxsZXJcIl0gPSB0aGlzLnNlbGxlcjtcclxuICAgICAgICBkYXRhW1wibG9jYXRlZEluXCJdID0gdGhpcy5sb2NhdGVkSW47XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdGhpcy5tYW51YWxDb25kaXRpb25JZDtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnB1cmNoYXNlSGlzdG9yeSkpIHtcclxuICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMucHVyY2hhc2VIaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mbyB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgcGNzOiBudW1iZXI7XHJcbiAgICBwcmljZTogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmc6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbDogbnVtYmVyO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uRGVzY3JpcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWxsZXI6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbjogc3RyaW5nO1xyXG4gICAgaWdub3JlVGhhdExvdDogYm9vbGVhbjtcclxuICAgIG1hbnVhbENvbmRpdGlvbklkOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3Rvcnk6IFB1cmNoYXNlSW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHVyY2hhc2VJbmZvIGltcGxlbWVudHMgSVB1cmNoYXNlSW5mbyB7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHF1YW50aXR5ITogbnVtYmVyO1xyXG4gICAgZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVB1cmNoYXNlSW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5xdWFudGl0eSA9IF9kYXRhW1wicXVhbnRpdHlcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZSA9IF9kYXRhW1wiZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQdXJjaGFzZUluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQdXJjaGFzZUluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJxdWFudGl0eVwiXSA9IHRoaXMucXVhbnRpdHk7XHJcbiAgICAgICAgZGF0YVtcImRhdGVcIl0gPSB0aGlzLmRhdGU7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVB1cmNoYXNlSW5mbyB7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHF1YW50aXR5OiBudW1iZXI7XHJcbiAgICBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYW51YWxDb25kaXRpb24gaW1wbGVtZW50cyBJTWFudWFsQ29uZGl0aW9uIHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElNYW51YWxDb25kaXRpb24pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiaWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IE1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hbnVhbENvbmRpdGlvbigpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJpZFwiXSA9IHRoaXMuaWQ7XHJcbiAgICAgICAgZGF0YVtcImRlc2NyaXB0aW9uXCJdID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWFudWFsQ29uZGl0aW9uIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90U3RhdGUgaW1wbGVtZW50cyBJTG90U3RhdGUge1xyXG4gICAgbG90SWQhOiBudW1iZXI7XHJcbiAgICBpZ25vcmVUaGF0TG90ITogYm9vbGVhbjtcclxuICAgIGxhc3RVcGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RTdGF0ZSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pZ25vcmVUaGF0TG90ID0gX2RhdGFbXCJpZ25vcmVUaGF0TG90XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBfZGF0YVtcImxhc3RVcGRhdGVcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90U3RhdGUge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RTdGF0ZSgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcImxhc3RVcGRhdGVcIl0gPSB0aGlzLmxhc3RVcGRhdGU7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdFN0YXRlIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBpZ25vcmVUaGF0TG90OiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBfZGF0YVtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSBfZGF0YVtcInRpdGxlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IF9kYXRhW1wic3RhdHVzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRldGFpbCA9IF9kYXRhW1wiZGV0YWlsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gX2RhdGFbXCJpbnN0YW5jZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhYnN0cmFjdCBjbGFzcyAnUHJvYmxlbURldGFpbGVkSW5mbycgY2Fubm90IGJlIGluc3RhbnRpYXRlZC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJ0eXBlXCJdID0gdGhpcy50eXBlO1xyXG4gICAgICAgIGRhdGFbXCJ0aXRsZVwiXSA9IHRoaXMudGl0bGU7XHJcbiAgICAgICAgZGF0YVtcInN0YXR1c1wiXSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgIGRhdGFbXCJkZXRhaWxcIl0gPSB0aGlzLmRldGFpbDtcclxuICAgICAgICBkYXRhW1wiaW5zdGFuY2VcIl0gPSB0aGlzLmluc3RhbmNlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMyIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzMiB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9ycyBpbXBsZW1lbnRzIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9ycykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9ycyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9ycygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3JzMiBpbXBsZW1lbnRzIElFcnJvcnMyIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMyKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2RhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gX2RhdGFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogRXJyb3JzMiB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9yczIoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMyIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBzdGF0dXM6IG51bWJlcjtcclxuICAgIHJlc3BvbnNlOiBzdHJpbmc7XHJcbiAgICBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfTtcclxuICAgIHJlc3VsdDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGlzQXBpRXhjZXB0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBzdGF0aWMgaXNBcGlFeGNlcHRpb24ob2JqOiBhbnkpOiBvYmogaXMgQXBpRXhjZXB0aW9uIHtcclxuICAgICAgICByZXR1cm4gb2JqLmlzQXBpRXhjZXB0aW9uID09PSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aHJvd0V4Y2VwdGlvbihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0PzogYW55KTogYW55IHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhyb3cgcmVzdWx0O1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRocm93IG5ldyBBcGlFeGNlcHRpb24obWVzc2FnZSwgc3RhdHVzLCByZXNwb25zZSwgaGVhZGVycywgbnVsbCk7XHJcbn0iLCJpbXBvcnQge09BdXRoMkNsaWVudCwgT0F1dGgyVG9rZW59IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5cclxuXHJcbnR5cGUgT0F1dGgyRmV0Y2hPcHRpb25zID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXJlbmNlIHRvIE9BdXRoMiBjbGllbnQuXHJcbiAgICAgKi9cclxuICAgIGNsaWVudDogT0F1dGgyQ2xpZW50O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogWW91IGFyZSByZXNwb25zaWJsZSBmb3IgaW1wbGVtZW50aW5nIHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgKiBpdCdzIHB1cnBvc2UgaXMgdG8gc3VwcGx5IHRoZSAnaW5pdGlhbCcgb2F1dGgyIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gYG51bGxgIHRvIGZhaWwgdGhlIHByb2Nlc3MuXHJcbiAgICAgKi9cclxuICAgIGdldE5ld1Rva2VuKCk6IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHNldCwgd2lsbCBiZSBjYWxsZWQgaWYgYXV0aGVudGljYXRpb24gZmF0YWxseSBmYWlsZWQuXHJcbiAgICAgKi9cclxuICAgIG9uRXJyb3I/OiAoZXJyOiBFcnJvcikgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBhY3RpdmUgdG9rZW4gY2hhbmdlcy4gVXNpbmcgdGhpcyBpc1xyXG4gICAgICogb3B0aW9uYWwsIGJ1dCBpdCBtYXkgYmUgdXNlZCB0byAoZm9yIGV4YW1wbGUpIHB1dCB0aGUgdG9rZW4gaW4gb2ZmLWxpbmVcclxuICAgICAqIHN0b3JhZ2UgZm9yIGxhdGVyIHVzYWdlLlxyXG4gICAgICovXHJcbiAgICBzdG9yZVRva2VuPzogKHRva2VuOiBPQXV0aDJUb2tlbikgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsc28gYW4gb3B0aW9uYWwgZmVhdHVyZS4gSW1wbGVtZW50IHRoaXMgaWYgeW91IHdhbnQgdGhlIHdyYXBwZXIgdG8gdHJ5IGFcclxuICAgICAqIHN0b3JlZCB0b2tlbiBiZWZvcmUgYXR0ZW1wdGluZyBhIGZ1bGwgcmUtYXV0aGVudGljYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBudWxsIGlmIHRoZXJlIHdhcyBubyB0b2tlbi5cclxuICAgICAqL1xyXG4gICAgZ2V0U3RvcmVkVG9rZW4/OiAoKSA9PiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgc2NoZWR1bGUgdG9rZW4gcmVmcmVzaC5cclxuICAgICAqXHJcbiAgICAgKiBDZXJ0YWluIGV4ZWN1dGlvbiBlbnZpcm9ubWVudHMsIGUuZy4gUmVhY3QgTmF0aXZlLCBkbyBub3QgaGFuZGxlIHNjaGVkdWxlZFxyXG4gICAgICogdGFza3Mgd2l0aCBzZXRUaW1lb3V0KCkgaW4gYSBncmFjZWZ1bCBvciBwcmVkaWN0YWJsZSBmYXNoaW9uLiBUaGUgZGVmYXVsdFxyXG4gICAgICogYmVoYXZpb3IgaXMgdG8gc2NoZWR1bGUgcmVmcmVzaC4gU2V0IHRoaXMgdG8gZmFsc2UgdG8gZGlzYWJsZSBzY2hlZHVsaW5nLlxyXG4gICAgICovXHJcbiAgICBzY2hlZHVsZVJlZnJlc2g/OiBib29sZWFuO1xyXG5cclxuICAgIGZldGNoPzogdHlwZW9mIGZldGNoO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuXHJcbiAgICBwcml2YXRlIG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEN1cnJlbnQgYWN0aXZlIHRva2VuIChpZiBhbnkpXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdG9rZW46IE9BdXRoMlRva2VuIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgdXNlciBoYWQgYSBzdG9yZWRUb2tlbiwgdGhlIHByb2Nlc3MgdG8gZmV0Y2ggaXRcclxuICAgICAqIG1heSBiZSBhc3luYy4gV2Uga2VlcCB0cmFjayBvZiB0aGlzIHByb2Nlc3MgaW4gdGhpc1xyXG4gICAgICogcHJvbWlzZSwgc28gaXQgbWF5IGJlIGF3YWl0ZWQgdG8gYXZvaWQgcmFjZSBjb25kaXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEFzIHNvb24gYXMgdGhpcyBwcm9taXNlIHJlc29sdmVzLCB0aGlzIHByb3BlcnR5IGdldCBudWxsZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlR2V0U3RvcmVkVG9rZW46IG51bGwgfCBQcm9taXNlPHZvaWQ+ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnM/LnNjaGVkdWxlUmVmcmVzaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBpZiAob3B0aW9ucy5nZXRTdG9yZWRUb2tlbikge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBhd2FpdCBvcHRpb25zLmdldFN0b3JlZFRva2VuISgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVSZWZyZXNoKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG9lcyBhIGZldGNoIHJlcXVlc3QgYW5kIGFkZHMgYSBCZWFyZXIgLyBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBub3Qga25vd24sIHRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gZmV0Y2ggaXRcclxuICAgICAqIGZpcnN0LiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGFsbW9zdCBleHBpcmluZywgdGhpcyBmdW5jdGlvbiBtaWdodCBhdHRlbXB0XHJcbiAgICAgKiB0byByZWZyZXNoIGl0LlxyXG4gICAgICovXHJcbiAgICBhc3luYyBmZXRjaChpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7XHJcblxyXG4gICAgICAgIGlmIChpbml0LmhlYWRlcnMpIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyBhY2Nlc3NUb2tlblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVycyA9IHtBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyBhY2Nlc3NUb2tlbn1cclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3B0aW9ucy5mZXRjaChpbnB1dCwgaW5pdCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUb2tlbiA9IGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyBuZXdUb2tlblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3B0aW9ucy5mZXRjaChpbnB1dCwgaW5pdClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgY3VycmVudCB0b2tlbiBpbmZvcm1hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGVyZSByZXN1bHQgb2JqZWN0IHdpbGwgaGF2ZTpcclxuICAgICAqICAgKiBhY2Nlc3NUb2tlblxyXG4gICAgICogICAqIGV4cGlyZXNBdCAtIHdoZW4gdGhlIHRva2VuIGV4cGlyZXMsIG9yIG51bGwuXHJcbiAgICAgKiAgICogcmVmcmVzaFRva2VuIC0gbWF5IGJlIG51bGxcclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYXR0ZW1wdCB0byBhdXRvbWF0aWNhbGx5IHJlZnJlc2ggaWYgc3RhbGUuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4gJiYgKHRoaXMudG9rZW4uZXhwaXJlc0F0ID09PSBudWxsIHx8IHRoaXMudG9rZW4uZXhwaXJlc0F0ID4gRGF0ZS5ub3coKSkpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IHRva2VuIGlzIHN0aWxsIHZhbGlkXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBjdXJyZW50IGFjY2VzcyB0b2tlbiBpcyBub3Qga25vd24sIGl0IHdpbGwgYXR0ZW1wdCB0byBmZXRjaCBpdC5cclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgZXhwaXJpbmcsIGl0IHdpbGwgYXR0ZW1wdCB0byByZWZyZXNoIGl0LlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRBY2Nlc3NUb2tlbigpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cclxuICAgICAgICAvLyBFbnN1cmUgZ2V0U3RvcmVkVG9rZW4gZmluaXNoZWQuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbjtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdldFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuLmFjY2Vzc1Rva2VuO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEtlZXBpbmcgdHJhY2sgb2YgYW4gYWN0aXZlIHJlZnJlc2hUb2tlbiBvcGVyYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyB3aWxsIGFsbG93IHVzIHRvIGVuc3VyZSBvbmx5IDEgc3VjaCBvcGVyYXRpb24gaGFwcGVucyBhdCBhbnlcclxuICAgICAqIGdpdmVuIHRpbWUuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlUmVmcmVzaDogUHJvbWlzZTxPQXV0aDJUb2tlbj4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvcmNlcyBhbiBhY2Nlc3MgdG9rZW4gcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBhc3luYyByZWZyZXNoVG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBjdXJyZW50bHkgYWxyZWFkeSBkb2luZyB0aGlzIG9wZXJhdGlvbixcclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGRvbid0IGRvIGl0IHR3aWNlIGluIHBhcmFsbGVsLlxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb2xkVG9rZW4gPSB0aGlzLnRva2VuO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IChhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3VG9rZW46IE9BdXRoMlRva2VuIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFRva2VuPy5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYWQgYSByZWZyZXNoIHRva2VuLCBsZXRzIHNlZSBpZiB3ZSBjYW4gdXNlIGl0IVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ob2xkVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignW29hdXRoMl0gcmVmcmVzaCB0b2tlbiBub3QgYWNjZXB0ZWQsIHdlXFwnbGwgdHJ5IHJlYXV0aGVudGljYXRpbmcnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdVbmFibGUgdG8gb2J0YWluIE9BdXRoMiB0b2tlbnMsIGEgZnVsbCByZWF1dGggbWF5IGJlIG5lZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3I/LihlcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdUb2tlbjtcclxuXHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnN0b3JlVG9rZW4/Lih0b2tlbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVSZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjbGVhciB0aGUgY3VycmVudCByZWZyZXNoIG9wZXJhdGlvbi5cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGltZXIgdHJpZ2dlciBmb3IgdGhlIG5leHQgYXV0b21hdGVkIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBzY2hlZHVsZVJlZnJlc2goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlZnJlc2hUaW1lcik7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b2tlbj8uZXhwaXJlc0F0IHx8ICF0aGlzLnRva2VuLnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBkb24ndCBrbm93IHdoZW4gdGhlIHRva2VuIGV4cGlyZXMsIG9yIGRvbid0IGhhdmUgYSByZWZyZXNoX3Rva2VuLCBkb24ndCBib3RoZXIuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHRoaXMudG9rZW4uZXhwaXJlc0F0IC0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgLy8gV2Ugb25seSBzY2hlZHVsZSB0aGlzIGV2ZW50IGlmIGl0IGhhcHBlbnMgbW9yZSB0aGFuIDIgbWludXRlcyBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIGlmIChleHBpcmVzSW4gPCAxMjAgKiAxMDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNjaGVkdWxlIDEgbWludXRlIGJlZm9yZSBleHBpcnlcclxuICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2ZldGNoLW13LW9hdXRoMl0gZXJyb3Igd2hpbGUgZG9pbmcgYSBiYWNrZ3JvdW5kIE9BdXRoMiBhdXRvLXJlZnJlc2gnLCBlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZXhwaXJlc0luIC0gNjAgKiAxMDAwKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgICBBcGlFeGNlcHRpb24sXHJcbiAgICBDbGllbnQsXHJcbiAgICBMb3RJbmZvLFxyXG4gICAgTG90SW5mb1dpdGhQcm9kdWN0SWQsXHJcbiAgICBQdXJjaGFzZUluZm9cclxufSBmcm9tIFwiLi9FYmF5Q2xpZW50L0ViYXlDbGllbnRcIlxyXG5cclxuaW1wb3J0IHtnZW5lcmF0ZUNvZGVWZXJpZmllciwgT0F1dGgyQ2xpZW50fSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuaW1wb3J0IHtGZXRjaFdyYXBwZXJDdXN0b219IGZyb20gXCIuL0ZldGNoV3JhcHBlckN1c3RvbVwiO1xyXG5cclxuY29uc3QgaWdub3JlVGhhdExvdEZpZWxkTmFtZSA9IFwiaWdub3JlVGhhdExvdFwiO1xyXG5jb25zdCBtYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZSA9IFwibWFudWFsQ29uZGl0aW9uSWRcIjtcclxuY29uc3QgcHJvZHVjdEZpZWxkTmFtZSA9IFwicHJvZHVjdElkXCI7XHJcbmNvbnN0IHBjc0ZpZWxkTmFtZSA9IFwicGNzXCI7XHJcblxyXG5jb25zdCBwYW5lbENsYXNzID0gXCJwYW5lbC1kaXZcIjtcclxuY29uc3QgZm9ybUlkID0gXCJwcm9kdWN0LWZvcm0taWRcIlxyXG5jb25zdCBlcnJvckVsZW1lbnRJZCA9IFwiZXJyb3JFbGVtZW50XCJcclxuY29uc3Qgc3VibWl0SWQgPSBcInN1Ym1pdFwiXHJcbmNvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vbG9jYWxob3N0OjcwOTUvXCJcclxuY29uc3QgYmFzZUFwaVVybCA9IGAke2JhY2tlbmRVcmx9YXBpL2ViYXkvdjFgO1xyXG5jb25zdCBhdXRoUmVkaXJlY3RVcmwgPSBcImh0dHBzOi8vd3d3LmViYXkuY29tL1wiXHJcbmNvbnN0IHJlc2NhblRpbWVEYXlzID0gNjBcclxuXHJcbmNvbnN0IGxvdEluZm8gPSBuZXcgTG90SW5mbygpO1xyXG5cclxuLy8gZmV0Y2gg0YfQtdGA0LXQtyBiYWNrZ3JvdW5kIHNjcmlwdCwg0L/QviDQtNGA0YPQs9C+0LzRgyDQvdC1INGA0LDQsdC+0YLQsNC10YJcclxuZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZShpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7aW5wdXQsIGluaXR9LCBtZXNzYWdlUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBbcmVzcG9uc2UsIGVycm9yXSA9IG1lc3NhZ2VSZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHVuZGVmaW5lZCBvbiBhIDIwNCAtIE5vIENvbnRlbnRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXNwb25zZS5ib2R5ID8gbmV3IEJsb2IoW3Jlc3BvbnNlLmJvZHldKSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiByZXNwb25zZS5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGV4dHJhY3RQcmljZShwcmljZSkge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBwcmljZS5tYXRjaCgvKFxcRCspKFxcZCsoPzpbLC5dXFxkKyk/KS8pXHJcbiAgICBpZiAobWF0Y2hlc1sxXSAhPT0gXCJVUyAkXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VTICQgcHJpY2UgZXhwZWN0ZWQsIGJ1dCB3YXMnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtYXRjaGVzWzJdLnJlcGxhY2UoJywnLCAnLicpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUhpc3RvcnlCdXR0b24oKSB7XHJcbiAgICBsZXQgaXRlbUlkID0gbG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV07XHJcbiAgICBsZXQgZG9tYWluID0gbG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICBsZXQgaGlzdG9yeUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGhpc3RvcnlCdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlzdG9yeS1idXR0b24nKTtcclxuICAgIGhpc3RvcnlCdXR0b24udGV4dENvbnRlbnQgPSAnSElTVE9SWSc7XHJcbiAgICBoaXN0b3J5QnV0dG9uLmhyZWYgPSBgaHR0cHM6Ly8ke2RvbWFpbn0vYmluL3B1cmNoYXNlSGlzdG9yeT9pdGVtPSR7aXRlbUlkfWA7XHJcbiAgICBoaXN0b3J5QnV0dG9uLnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBtYXJnaW4tbGVmdDogNXB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2YwZjBmMDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBwYWRkaW5nOiAzcHggNnB4O1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgY29sb3I6IGJsYWNrO1xyXG4gIGA7XHJcbiAgICBoaXN0b3J5QnV0dG9uLnRhcmdldCA9ICdfYmxhbmsnO1xyXG5cclxuICAgIHJldHVybiBoaXN0b3J5QnV0dG9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIaXN0b3J5QnV0dG9uKCkge1xyXG4gICAgbGV0IHByb2R1Y3RUaXRsZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aW1bZGF0YS10ZXN0aWQ9XCJ4LWl0ZW0tdGl0bGVcIl0nKTtcclxuICAgIGlmIChwcm9kdWN0VGl0bGVDb250YWluZXIpIHtcclxuICAgICAgICBsZXQgZXhpc3RpbmdCdXR0b24gPSBwcm9kdWN0VGl0bGVDb250YWluZXIucXVlcnlTZWxlY3RvcignYS5oaXN0b3J5LWJ1dHRvbicpO1xyXG4gICAgICAgIGlmICghZXhpc3RpbmdCdXR0b24pIHtcclxuICAgICAgICAgICAgbGV0IGhpc3RvcnlCdXR0b24gPSBjcmVhdGVIaXN0b3J5QnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHByb2R1Y3RUaXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChoaXN0b3J5QnV0dG9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHN0eWxlcyA9IGBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgcGFkZGluZzogMTVweDtcclxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzAwMDBjYztcclxuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgY29sb3I6ICMwMDAwY2M7XHJcbiAgICAgIHBvc2l0aW9uOmZpeGVkO1xyXG4gICAgICB6LWluZGV4OjEwMDtcclxuICAgICAgbGVmdDoxJTtcclxuICAgICAgYm90dG9tOjUlO1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWwge1xyXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGlucHV0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBzZWxlY3Qge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsOmFmdGVyIHsgY29udGVudDogXCI6IFwiIH1cclxuYFxyXG5cclxuICAgIGxldCBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpXHJcbiAgICBzdHlsZVNoZWV0LmlubmVyVGV4dCA9IHN0eWxlc1xyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGVTaGVldClcclxuXHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChwYW5lbENsYXNzKTtcclxuXHJcblxyXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJylcclxuICAgIGZvcm0uaWQgPSBmb3JtSWRcclxuXHJcbiAgICAvLyBsYW5ndWFnZT1IVE1MXHJcbiAgICBmb3JtLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiPtCY0LPQvdC+0YDQuNGA0L7QstCw0YLRjCDQu9C+0YI8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIiB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+0KLQvtCy0LDRgDwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiIGlkPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uPtCS0YvQsdC10YDQuNGC0LUg0YLQvtCy0LDRgDwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtwY3NGaWVsZE5hbWV9XCI+UENTPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3Bjc0ZpZWxkTmFtZX1cIiB0eXBlPVwibnVtYmVyXCIgbmFtZT1cIiR7cGNzRmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCI+0KHQvtGB0YLQvtGP0L3QuNC1PC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiIGlkPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIj5cclxuICAgICAgICAgICAgPG9wdGlvbj7QktGL0LHQtdGA0LjRgtC1INCh0L7RgdGC0L7Rj9C90LjQtTwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6IHJlZDtcIiBpZD1cIiR7ZXJyb3JFbGVtZW50SWR9XCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7c3VibWl0SWR9XCIgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2F2ZVwiIGRpc2FibGVkLz5gO1xyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQ6IFN1Ym1pdEV2ZW50KSB7XHJcbiAgICAgICAgYXdhaXQgaGFuZGxlU3VibWl0KGV2ZW50LCBjbGllbnQpXHJcbiAgICB9KTtcclxuXHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybSlcclxuICAgIGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudDogU3VibWl0RXZlbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD5ldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgICBsZXQgaWdub3JlVGhhdExvdCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2lnbm9yZVRoYXRMb3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZ25vcmVUaGF0TG90ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb3RJbmZvW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxvdEluZm9bJ2lnbm9yZVRoYXRMb3QnXSA9IGlnbm9yZVRoYXRMb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGxvdEluZm8pKVxyXG5cclxuXHJcbiAgICAgICAgYXdhaXQgY2xpZW50LnVwc2VydExvdEluZm8obG90SW5mbywgZGF0YS5nZXQoJ3Byb2R1Y3RJZCcpLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzOiBIVE1MVGFibGVSb3dFbGVtZW50W10sIHJlc3VsdDogUHVyY2hhc2VJbmZvW10pIHtcclxuICAgIGZvciAobGV0IGZpeGVkUHJpY2VSb3cgb2YgZml4ZWRQcmljZVJvd3MpIHtcclxuICAgICAgICBsZXQgY29sdW1ucyA9IFsuLi5maXhlZFByaWNlUm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHByaWNlID0gY29sdW1uc1sxXVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgPT09IFwiRXhwaXJlZFwiIHx8IHByaWNlID09PSBcIkRlY2xpbmVkXCIpIHtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcmljZSAhPT0gXCJTb2xkIGFzIGEgc3BlY2lhbCBvZmZlclwiICYmIHByaWNlICE9PSBcIkNvdW50ZXItb2ZmZXJlZFwiICYmIHByaWNlICE9PSBcIkFjY2VwdGVkXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm8oe1xyXG4gICAgICAgICAgICAgICAgZGF0ZTogcGFyc2VEYXRlKGNvbHVtbnNbM10pLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHBhcnNlSW50KGNvbHVtbnNbMl0pLFxyXG4gICAgICAgICAgICAgICAgcHJpY2U6IGV4dHJhY3RQcmljZShwcmljZSlcclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFB1cmNoYXNlSW5mbyh7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiBwYXJzZURhdGUoY29sdW1uc1szXSksXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogcGFyc2VJbnQoY29sdW1uc1syXSlcclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURhdGUoZGF0ZVN0cmluZykge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBkYXRlU3RyaW5nLm1hdGNoKC8oXFxkK1xcc1tBLXpdK1xcc1xcZCspXFxzYXRcXHMoXFxkKyk6KFxcZCspOihcXGQrKShhbXxwbSlcXHMoW0Etel0rKS8pXHJcblxyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKG1hdGNoZXNbMV0gKyAnIDAwOjAwOjAwLjAwMFonKSlcclxuXHJcbiAgICBkYXRlLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1hdGNoZXNbMl0pKTtcclxuICAgIGRhdGUuc2V0VVRDTWludXRlcyhwYXJzZUludChtYXRjaGVzWzNdKSk7XHJcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobWF0Y2hlc1s0XSkpO1xyXG5cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcInBtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpICE9PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpICsgMTIpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1hdGNoZXNbNV0gPT09IFwiYW1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgPT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAxMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1hdGNoZXNbNl0gPT09IFwiTVNLXCIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSAtIDMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHRpbWV6b25lIFwiICsgbWF0Y2hlc1s2XSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0KTogUHVyY2hhc2VJbmZvW10ge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gbmV3IEFycmF5PFB1cmNoYXNlSW5mbz4oKTtcclxuICAgIGxldCBmaXhlZFByaWNlQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2LmZpeGVkLXByaWNlIHRib2R5JylcclxuICAgIGlmIChmaXhlZFByaWNlQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgZml4ZWRQcmljZVJvd3MgPSBbLi4uZml4ZWRQcmljZUJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb2ZmZXJCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYub2ZmZXIgdGJvZHknKVxyXG4gICAgaWYgKG9mZmVyQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgb2ZmZXJSb3dzID0gWy4uLm9mZmVyQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KG9mZmVyUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsSWQoKSB7XHJcbiAgICBsb3RJbmZvLmxvdElkID0gcGFyc2VJbnQobG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsUHJpY2UoKSB7XHJcbiAgICBsb3RJbmZvLnByaWNlID0gZXh0cmFjdFByaWNlKCg8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LngtcHJpY2UtcHJpbWFyeSBzcGFuJykpLmlubmVyVGV4dClcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbE5hbWUoKSB7XHJcbiAgICBsb3RJbmZvLm5hbWUgPSAoPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aW0gaDEnKSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxTZWxsZXIoKSB7XHJcbiAgICBsb3RJbmZvLnNlbGxlciA9ICg8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2Lngtc2VsbGVyY2FyZC1hdGZfX2luZm9fX2Fib3V0LXNlbGxlciBhJykpLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxDb25kaXRpb24oKSB7XHJcbiAgICBsb3RJbmZvLmNvbmRpdGlvbiA9ICg8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LngtaXRlbS1jb25kaXRpb24tdGV4dCBzcGFuLnV4LXRleHRzcGFucycpKS5pbm5lclRleHRcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLWRlc2MnKVxyXG4gICAgaWYgKGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgbG90SW5mby5jb25kaXRpb25EZXNjcmlwdGlvbiA9ICg8SFRNTEVsZW1lbnQ+Y29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50KS5pbm5lclRleHRcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnCcsICcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCdJywgJycpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxTaGlwcGluZygpIHtcclxuICAgIGxldCBzaGlwcGluZ1JhdGVzQXZhaWxhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LnV4LWxheW91dC1zZWN0aW9uX190ZXh0dWFsLWRpc3BsYXktLWFza1NlbGxlcicpID09PSBudWxsXHJcbiAgICBpZiAoc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSkge1xyXG4gICAgICAgIGxldCBkZWxpdmVyeUNvbHVtbnNIZWFkZXIgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmQtc2hpcHBpbmctbWF4dmlldyB0aGVhZCcpXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCd0aCcpXVxyXG4gICAgICAgIGxldCBkZWxpdmVyeUNvbHVtbnNWYWx1ZXMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmQtc2hpcHBpbmctbWF4dmlldyB0Ym9keScpXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCd0cicpXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXVxyXG5cclxuICAgICAgICBsZXQgc2hpcHBpbmdNYXh2aWV3VmFsdWVzID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBkZWxpdmVyeUNvbHVtbnNIZWFkZXJbaV0uaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIHNoaXBwaW5nTWF4dmlld1ZhbHVlc1trZXldID0gZGVsaXZlcnlDb2x1bW5zVmFsdWVzW2ldLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5pbm5lclRleHRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ1RvJ10gIT09ICdHZXJtYW55Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NoaXBwaW5nIGNvdW50cnkgbXVzdCBiZSBHZXJtYW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2hpcHBpbmdWYWx1ZSA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snU2hpcHBpbmcgYW5kIGhhbmRsaW5nJ11cclxuXHJcbiAgICAgICAgaWYgKHNoaXBwaW5nVmFsdWUgIT09ICdGcmVlIHNoaXBwaW5nJykge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gZXh0cmFjdFByaWNlKHNoaXBwaW5nVmFsdWUpXHJcblxyXG4gICAgICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzLmhhc093blByb3BlcnR5KCdFYWNoIGFkZGl0aW9uYWwgaXRlbScpKSB7XHJcbiAgICAgICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IGV4dHJhY3RQcmljZShzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ0VhY2ggYWRkaXRpb25hbCBpdGVtJ10pXHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsTG9jYXRlZEluKCkge1xyXG4gICAgbG90SW5mby5sb2NhdGVkSW4gPSAoPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5kLXNoaXBwaW5nLW1pbnZpZXcnKSkuaW5uZXJUZXh0Lm1hdGNoKC9Mb2NhdGVkXFxzaW46XFxzKC4rKS8pWzFdXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxEZXNjcmlwdGlvbigpIHtcclxuICAgIGxldCBkZXNjcmlwdGlvblVybCA9ICg8SFRNTElGcmFtZUVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Rlc2NfaWZyJykpLnNyY1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShkZXNjcmlwdGlvblVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgbG90SW5mby5kZXNjcmlwdGlvbiA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHVyY2hhc2VIaXN0b3J5KCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IHB1cmNoYXNlSGlzdG9yeVVybCA9IGBodHRwczovLyR7bG9jYXRpb24uaG9zdG5hbWV9L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShwdXJjaGFzZUhpc3RvcnlVcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICBsb3RJbmZvLnB1cmNoYXNlSGlzdG9yeSA9IHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJvZHVjdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHByb2R1Y3RGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgcHJvZHVjdEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RJZCA9IHNlcnZlckxvdEluZm8/LnByb2R1Y3RJZD8udHJpbSgpPy50b0xvd2VyQ2FzZSgpXHJcbiAgICBsZXQgc2VhcmNoUXVlcnkgPSBuZXcgVVJMKGRvY3VtZW50LnJlZmVycmVyKS5zZWFyY2hQYXJhbXM/LmdldCgnX25rdycpPy50cmltKCk/LnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgY2xpZW50LmdldEFsbFByb2R1Y3RzKClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gcHJvZHVjdHNbaV0uaWQ7XHJcbiAgICAgICAgb3B0LmlubmVySFRNTCA9IHByb2R1Y3RzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAocHJvZHVjdElkID09PSBwcm9kdWN0c1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hRdWVyeSA9PT0gcHJvZHVjdHNbaV0uc2VhcmNoUXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9kdWN0RmllbGQuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbE1hbnVhbENvbmRpdGlvbihwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbkZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBtYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbklkID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8ubWFudWFsQ29uZGl0aW9uSWQ/LnRyaW0oKT8udG9Mb3dlckNhc2UoKVxyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25zID0gYXdhaXQgY2xpZW50LmdldE1hbnVhbENvbmRpdGlvbnNMaXN0KClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFudWFsQ29uZGl0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHQudmFsdWUgPSBtYW51YWxDb25kaXRpb25zW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBtYW51YWxDb25kaXRpb25zW2ldLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChtYW51YWxDb25kaXRpb25JZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChtYW51YWxDb25kaXRpb25JZCA9PT0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1hbnVhbENvbmRpdGlvbkZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlckxvdEluZm8oY2xpZW50OiBDbGllbnQpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBjbGllbnQuZ2V0TG90SW5mbyhsb3RJbmZvLmxvdElkKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQXBpRXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICgoPEFwaUV4Y2VwdGlvbj5lcnJvcikucmVzcG9uc2VbXCJ0eXBlXCJdID09PSAnTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSBlbHNlIHRocm93IGVycm9yO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFBjcyhwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcGNzRmllbGQgPSA8SFRNTElucHV0RWxlbWVudD5wYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgcGNzRmllbGROYW1lKTtcclxuICAgIFxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/LnBjc1xyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGNzRmllbGQudmFsdWUgPSBzZXJ2ZXJQY3MudG9TdHJpbmcoKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsSWdub3JlVGhhdExvdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgaWdub3JlVGhhdExvdEZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5pZ25vcmVUaGF0TG90XHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZ25vcmVUaGF0TG90RmllbGQuY2hlY2tlZCA9IHNlcnZlclBjc1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXREYXRhRnJvbVBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuJyArIHBhbmVsQ2xhc3MpXHJcblxyXG4gICAgZmlsbElkKCk7XHJcbiAgICBmaWxsUHJpY2UoKTtcclxuICAgIGZpbGxTaGlwcGluZygpO1xyXG4gICAgZmlsbE5hbWUoKTtcclxuICAgIGZpbGxTZWxsZXIoKTtcclxuICAgIGZpbGxDb25kaXRpb24oKTtcclxuICAgIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbigpO1xyXG4gICAgZmlsbExvY2F0ZWRJbigpO1xyXG4gICAgbGV0IHNlcnZlckxvdEluZm8gPSBhd2FpdCBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudClcclxuICAgIGF3YWl0IGZpbGxQcm9kdWN0KHBhbmVsLCBjbGllbnQsIHNlcnZlckxvdEluZm8pO1xyXG4gICAgYXdhaXQgZmlsbE1hbnVhbENvbmRpdGlvbihwYW5lbCwgY2xpZW50LCBzZXJ2ZXJMb3RJbmZvKTtcclxuICAgIGZpbGxQY3MocGFuZWwsIHNlcnZlckxvdEluZm8pO1xyXG4gICAgZmlsbElnbm9yZVRoYXRMb3QocGFuZWwsIHNlcnZlckxvdEluZm8pXHJcbiAgICBhd2FpdCBmaWxsRGVzY3JpcHRpb24oKTtcclxuICAgIGF3YWl0IGZpbGxQdXJjaGFzZUhpc3RvcnkoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZFBhbmVsKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgYm9keUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbiAgICBpZiAoYm9keUVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgZXhpc3RpbmdQYW5lbCA9IGJvZHlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcyk7XHJcbiAgICAgICAgaWYgKCFleGlzdGluZ1BhbmVsKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yOiBFcnJvcikge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzICsgJyAjJyArIGVycm9yRWxlbWVudElkKVxyXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQXBpRXhjZXB0aW9uKSB7XHJcbiAgICAgICAgbGV0IGFwaUV4Y2VwdGlvbiA9IDxBcGlFeGNlcHRpb24+ZXJyb3JcclxuICAgICAgICBjb25zb2xlLmxvZyhhcGlFeGNlcHRpb24uc3RhdHVzICsgXCIgY29kZSByZWNlaXZlZFwiKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGFwaUV4Y2VwdGlvbi5yZXNwb25zZSlcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IGFwaUV4Y2VwdGlvbi5zdGF0dXMgKyBcIiBcIiArIGFwaUV4Y2VwdGlvbi5yZXNwb25zZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3Iuc3RhY2spXHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSBlcnJvci5zdGFjaztcclxuICAgIH1cclxuXHJcbiAgICBlcnJvckRpdi5hcHBlbmRDaGlsZChzcGFuKVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVTdWJtaXRCdXR0b24oKSB7XHJcbiAgICAoPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgc3VibWl0SWQpKS5kaXNhYmxlZCA9IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6ZUZldGNoKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KTogRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuICAgIHJldHVybiBuZXcgRmV0Y2hXcmFwcGVyQ3VzdG9tKHtcclxuICAgICAgICBjbGllbnQ6IG9BdXRoMkNsaWVudCxcclxuICAgICAgICBnZXROZXdUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gYXdhaXQgZ2VuZXJhdGVDb2RlVmVyaWZpZXIoKTtcclxuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXJ9KVxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbiA9IGF3YWl0IG9BdXRoMkNsaWVudC5hdXRob3JpemF0aW9uQ29kZS5nZXRBdXRob3JpemVVcmkoe1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllcixcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBbJ0ViYXkuU2VydmVyQVBJJ11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0U3RvcmVkVG9rZW46IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRva2VuID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ0b2tlbl9zdG9yZVwiXSkpLnRva2VuX3N0b3JlO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pIHJldHVybiBKU09OLnBhcnNlKHRva2VuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZUVycm9ycygpIHtcclxuICAgIGxldCBlcnJvckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcyArICcgIycgKyBlcnJvckVsZW1lbnRJZClcclxuICAgIGVycm9yRGl2LmlubmVySFRNTCA9IFwiXCJcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcHJvZHVjdFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYWRkSGlzdG9yeUJ1dHRvbigpO1xyXG4gICAgICAgIGFkZFBhbmVsKGNsaWVudCk7XHJcbiAgICAgICAgYXdhaXQgZ2V0RGF0YUZyb21QYWdlKGNsaWVudCk7XHJcbiAgICAgICAgZW5hYmxlU3VibWl0QnV0dG9uKClcclxuICAgICAgICBoaWRlRXJyb3JzKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKTtcclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYXV0aFBhZ2Uob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpIHtcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJjb2RlXCIpKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcbiAgICAgICAgbGV0IG9hdXRoMlRva2VuID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHt0b2tlbl9zdG9yZTogSlNPTi5zdHJpbmdpZnkob2F1dGgyVG9rZW4pfSlcclxuICAgICAgICBsZXQgcmV0dXJuUGFnZSA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wicmV0dXJuX3RvX3BhZ2VcIl0pKS5yZXR1cm5fdG9fcGFnZVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmV0dXJuaW5nIHRvIFwiICsgcmV0dXJuUGFnZSlcclxuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gcmV0dXJuUGFnZVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzZWFyY2hQYWdlKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICAvL9GC0L7Qu9GM0LrQviDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0L/RgNC+0LTQsNC90YvQtSDQu9C+0YLRi1xyXG4gICAgaWYgKG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zPy5nZXQoJ0xIX1NvbGQnKT8udHJpbSgpICE9PSBcIjFcIikgcmV0dXJuO1xyXG5cclxuICAgIGxldCBsaW5rcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd1bC5zcnAtcmVzdWx0cycpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpLnMtaXRlbScpXVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHg6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gPEhUTUxBbmNob3JFbGVtZW50PngucXVlcnlTZWxlY3RvcignYS5zLWl0ZW1fX2xpbmsnKVxyXG4gICAgICAgICAgICBsZXQgc29sZERhdGUgPSBuZXcgRGF0ZSgoPEhUTUxFbGVtZW50PngucXVlcnlTZWxlY3Rvcignc3Bhbi5QT1NJVElWRScpKS5pbm5lclRleHQucmVwbGFjZShcIlNvbGQgXCIsIFwiXCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExvdExpbmsocGFyc2VJbnQobGluay5ocmVmLm1hdGNoKC9odHRwczpcXC9cXC9bXlxcL10rXFwvaXRtXFwvKFxcZCspLylbMV0pLCBsaW5rLCBzb2xkRGF0ZSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBsZXQgZ2V0TG90U3RhdGVzQW5zd2VyID0gYXdhaXQgY2xpZW50LmdldExvdFN0YXRlcyhsaW5rcy5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geC5pZFxyXG4gICAgfSkpXHJcblxyXG4gICAgbGV0IGtub3duTG90cyA9IG5ldyBNYXAoZ2V0TG90U3RhdGVzQW5zd2VyLm1hcChwID0+IFtwLmxvdElkLCBwXSkpO1xyXG5cclxuICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoa25vd25Mb3RzLmhhcyh4LmlkKSkge1xyXG4gICAgICAgICAgICBsZXQgbG90U3RhdGUgPSBrbm93bkxvdHMuZ2V0KHguaWQpXHJcbiAgICAgICAgICAgIGlmICghbG90U3RhdGUuaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpZmZJbkRheXMgPSBNYXRoLmNlaWwoKHguc29sZERhdGUuZ2V0VGltZSgpIC0gbmV3IERhdGUobG90U3RhdGUubGFzdFVwZGF0ZSkuZ2V0VGltZSgpKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaWZmSW5EYXlzKVxyXG4gICAgICAgICAgICAgICAgaWYgKGRpZmZJbkRheXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5saW5rLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogI2UwZTA3ZjtgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHgubGluay5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6IG5vbmU7YFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeC5saW5rLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRwaW5rO2BcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jbGFzcyBMb3RMaW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGxpbms6IEhUTUxBbmNob3JFbGVtZW50LCBzb2xkRGF0ZTogRGF0ZSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZFxyXG4gICAgICAgIHRoaXMubGluayA9IGxpbmtcclxuICAgICAgICB0aGlzLnNvbGREYXRlID0gc29sZERhdGVcclxuICAgIH1cclxuXHJcbiAgICBpZDogbnVtYmVyO1xyXG4gICAgbGluazogSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICBzb2xkRGF0ZTogRGF0ZVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgbGV0IG9BdXRoMkNsaWVudCA9IG5ldyBPQXV0aDJDbGllbnQoe1xyXG4gICAgICAgIHNlcnZlcjogYmFja2VuZFVybCxcclxuICAgICAgICBjbGllbnRJZDogJ0ViYXkuQ2hyb21lRXh0ZW5zaW9uJyxcclxuICAgICAgICB0b2tlbkVuZHBvaW50OiAnL2Nvbm5lY3QvdG9rZW4nLFxyXG4gICAgICAgIGF1dGhvcml6YXRpb25FbmRwb2ludDogJy9jb25uZWN0L2F1dGhvcml6ZScsXHJcbiAgICAgICAgZmV0Y2g6IGZldGNoUmVzb3VyY2VcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBjdXJyZW50UGFnZSA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyBsb2NhdGlvbi5wYXRobmFtZVxyXG5cclxuICAgIGlmIChjdXJyZW50UGFnZSA9PT0gYXV0aFJlZGlyZWN0VXJsKSB7XHJcbiAgICAgICAgYXdhaXQgYXV0aFBhZ2Uob0F1dGgyQ2xpZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtyZXR1cm5fdG9fcGFnZTogY3VycmVudFBhZ2V9KVxyXG5cclxuICAgICAgICBsZXQgY2xpZW50ID0gbmV3IENsaWVudChiYXNlQXBpVXJsLCBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQpKTtcclxuICAgICAgICBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIikpIHtcclxuICAgICAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9zY2gvXCIpKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNlYXJjaFBhZ2UoY2xpZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9