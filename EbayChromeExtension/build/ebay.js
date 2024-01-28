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
exports.ApiException = exports.Errors2 = exports.Errors = exports.ValidationProblemDetailedInfo = exports.NotFoundProblemDetailedInfo = exports.ProblemDetailedInfo = exports.LotState = exports.ManualCondition = exports.PurchaseInfo = exports.LotInfo = exports.LotInfoWithProductId = exports.SearchQuery = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
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
        else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400 = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = ValidationProblemDetailedInfo.fromJS(resultData400);
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
        if (!data) {
            this.searchQueries = [];
        }
    }
    init(_data) {
        if (_data) {
            this.name = _data["Name"];
            if (Array.isArray(_data["SearchQueries"])) {
                this.searchQueries = [];
                for (let item of _data["SearchQueries"])
                    this.searchQueries.push(SearchQuery.fromJS(item));
            }
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
        if (Array.isArray(this.searchQueries)) {
            data["SearchQueries"] = [];
            for (let item of this.searchQueries)
                data["SearchQueries"].push(item.toJSON());
        }
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
        if (!data) {
            this.searchQueries = [];
        }
    }
    init(_data) {
        if (_data) {
            this.id = _data["Id"];
            this.name = _data["Name"];
            if (Array.isArray(_data["SearchQueries"])) {
                this.searchQueries = [];
                for (let item of _data["SearchQueries"])
                    this.searchQueries.push(SearchQuery.fromJS(item));
            }
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
        if (Array.isArray(this.searchQueries)) {
            data["SearchQueries"] = [];
            for (let item of this.searchQueries)
                data["SearchQueries"].push(item.toJSON());
        }
        return data;
    }
}
exports.ProductWithId = ProductWithId;
class SearchQuery {
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
            this.query = _data["query"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new SearchQuery();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["query"] = this.query;
        return data;
    }
}
exports.SearchQuery = SearchQuery;
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
//const backendUrl = "https://localhost:7095/"
const backendUrl = "https://178.208.65.100:17443/";
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/";
const notSetValue = "notSet";
const lightGreenColor = "#ecffec";
const lightPinkColor = "lightpink";
const lightYellowColor = "#e0e07f";
const lotInfo = new EbayClient_1.LotInfo();
let _serverLotInfo;
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
    return parseFloat(matches[2].replace(',', '.'));
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
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;
    let historyButtonHref = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    // language=HTML
    form.innerHTML = `
        <a href="${historyButtonHref}" target="_blank">История продаж лота</a> 
        <br>Бэкенд: <a href="${backendUrl}" target="_blank">${backendUrl}</a>
        <br>
        <br>
        <label for="${ignoreThatLotFieldName}">Игнорировать лот</label>
        <input id="${ignoreThatLotFieldName}" type="checkbox" name="${ignoreThatLotFieldName}"/>
        <br>
        <br>
        <label for="${productFieldName}">Товар</label>
        <select name="${productFieldName}" id="${productFieldName}">
            <option value="">Выберите товар</option>
        </select>
        <br>
        <label for="${pcsFieldName}">PCS</label>
        <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
        <br>
        <label for="${manualConditionIdFieldName}">Состояние</label>
        <select name="${manualConditionIdFieldName}" id="${manualConditionIdFieldName}">
            <option value="">Выберите Состояние</option>
        </select>
        <br>
        <div style="color: red;" id="${errorElementId}"></div>
        <br>
        <input id="${submitId}" type="submit" value="Save" disabled/>
    `;
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
            if (ignoreThatLot) {
                lotInfo.pcs = 1;
                lotInfo.manualConditionId = notSetValue;
            }
            console.log("Sending to backend: " + JSON.stringify(lotInfo));
            yield client.upsertLotInfo(lotInfo, data.get('productId').toString());
            yield productPage(client);
        }
        catch (error) {
            yield showError(error);
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
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3]), extractPrice(price)));
        }
        else {
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3])));
        }
    }
}
class PurchaseInfoInner {
    constructor(quantity, date, price) {
        this.quantity = quantity;
        this.date = date;
        this.price = price;
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
    return date;
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
    return result.sort(function (a, b) {
        return b.date.getTime() - a.date.getTime();
    }).map(function (x) {
        return new EbayClient_1.PurchaseInfo({
            date: x.date.toISOString(), quantity: x.quantity, price: x.price
        });
    });
}
function fillId() {
    lotInfo.lotId = parseInt(location.pathname.match(/\/itm\/([0-9]+)/)[1]);
}
function fillPrice() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.price = extractPrice((yield sleepElementLoaded('div.x-price-primary span')).innerText);
    });
}
function fillName() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.name = (yield sleepElementLoaded('.vim h1')).innerText;
    });
}
function fillSeller() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.seller = (yield sleepElementLoaded('div.x-sellercard-atf__info__about-seller a')).innerText.toLowerCase();
    });
}
function fillCondition() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.condition = (yield sleepElementLoaded('div.x-item-condition-text span.ux-textspans')).innerText;
    });
}
function fillConditionDescription() {
    return __awaiter(this, void 0, void 0, function* () {
        let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc');
        if (conditionDescriptionElement != null) {
            lotInfo.conditionDescription = conditionDescriptionElement.innerText
                .replace('“', '')
                .replace('”', '');
        }
    });
}
function fillShipping() {
    return __awaiter(this, void 0, void 0, function* () {
        let shippingDiv = yield sleepElementLoaded('div.d-shipping-maxview');
        let shippingRatesAvailable = shippingDiv.querySelector('div.ux-layout-section__textual-display--askSeller') === null;
        if (shippingRatesAvailable) {
            let shippingTable = shippingDiv.querySelector('table.ux-table-section-with-hints--shippingTable');
            let deliveryColumnsHeader = [...shippingTable.querySelector('thead')
                    .querySelectorAll('th')];
            let deliveryColumnsValues = [...shippingTable.querySelector('tbody')
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
                    let eachAdditional = shippingMaxviewValues['Each additional item'];
                    if (eachAdditional !== "Free") {
                        lotInfo.shippingAdditional = extractPrice(eachAdditional);
                    }
                    else {
                        lotInfo.shippingAdditional = 0;
                    }
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
        else {
            lotInfo.shipping = undefined;
            lotInfo.shippingAdditional = undefined;
        }
    });
}
function fillLocatedIn() {
    return __awaiter(this, void 0, void 0, function* () {
        let match = (yield sleepElementLoaded('div.d-shipping-minview')).innerText.match(/Located\sin:\s(.+)/);
        if (match !== null) {
            lotInfo.locatedIn = match[1];
        }
        else {
            lotInfo.locatedIn = "Unknown";
        }
    });
}
function fillDescription() {
    return __awaiter(this, void 0, void 0, function* () {
        let descriptionUrl = (yield sleepElementLoaded('#desc_ifr')).src;
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
function getSearchQuery() {
    var _a, _b, _c;
    if (document.referrer) {
        return (_c = (_b = (_a = new URL(document.referrer).searchParams) === null || _a === void 0 ? void 0 : _a.get('_nkw')) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
    }
    return undefined;
}
function fillProduct(panel, client, serverLotInfo) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let productField = panel.querySelector('select#' + productFieldName);
        let productId = (_b = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.productId) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        let searchQuery = getSearchQuery();
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
                products[i].searchQueries.forEach(function (x) {
                    if (searchQuery === x.query.trim().toLowerCase()) {
                        opt.selected = true;
                    }
                });
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
            _serverLotInfo = yield client.getLotInfo(lotInfo.lotId);
        }
        catch (error) {
            if (error instanceof EbayClient_1.NotFoundProblemDetailedInfo) {
                return undefined;
            }
            throw error;
        }
    });
}
function fillPcs(panel, serverLotInfo) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let pcsField = panel.querySelector('input#' + pcsFieldName);
        let serverPcs = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.lotInfo) === null || _a === void 0 ? void 0 : _a.pcs;
        if (serverPcs !== undefined) {
            pcsField.value = serverPcs.toString();
        }
    });
}
function fillIgnoreThatLot(panel, serverLotInfo) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let ignoreThatLotField = panel.querySelector('input#' + ignoreThatLotFieldName);
        let serverPcs = (_a = serverLotInfo === null || serverLotInfo === void 0 ? void 0 : serverLotInfo.lotInfo) === null || _a === void 0 ? void 0 : _a.ignoreThatLot;
        if (serverPcs !== undefined) {
            ignoreThatLotField.checked = serverPcs;
        }
    });
}
function compareLotInfos(serverLotInfoWithProductId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (serverLotInfoWithProductId === undefined)
            return;
        let serverLotInfoJson = serverLotInfoWithProductId.lotInfo.toJSON();
        serverLotInfoJson["pcs"] = undefined;
        serverLotInfoJson["ignoreThatLot"] = undefined;
        serverLotInfoJson["manualConditionId"] = undefined;
        serverLotInfoJson["description"] = undefined;
        let serverPurchaseHistory = serverLotInfoJson["purchaseHistory"];
        serverLotInfoJson["purchaseHistory"] = undefined;
        let lotInfoJson = lotInfo.toJSON();
        lotInfoJson["pcs"] = undefined;
        lotInfoJson["ignoreThatLot"] = undefined;
        lotInfoJson["manualConditionId"] = undefined;
        lotInfoJson["description"] = undefined;
        let lotInfoPurchaseHistory = lotInfoJson["purchaseHistory"];
        lotInfoJson["purchaseHistory"] = undefined;
        let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson);
        let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson);
        let serverPurchaseHistoryJsonString = JSON.stringify(serverPurchaseHistory);
        let lotInfoPurchaseHistoryJsonString = JSON.stringify(lotInfoPurchaseHistory);
        let panel = yield sleepElementLoaded('div.' + panelClass);
        if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
            console.log(serverPurchaseHistoryJsonString);
            console.log(lotInfoPurchaseHistoryJsonString);
            if (_serverLotInfo.lotInfo.ignoreThatLot === true || serverPurchaseHistoryJsonString === lotInfoPurchaseHistoryJsonString) {
                panel.style.cssText = `background-color: ${lightGreenColor};`;
            }
            else {
                panel.style.cssText = `background-color: ${lightYellowColor};`;
            }
        }
        else {
            panel.style.cssText = `background-color: ${lightPinkColor};`;
        }
        console.log("Received from server: " + serverLotInfoJsonString);
        console.log("CurrentPage: " + currentPageLotInfoJsonString);
    });
}
function getDataFromPage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let panel = yield sleepElementLoaded('div.' + panelClass);
        fillId();
        yield Promise.all([
            fillPrice(),
            fillName(),
            fillSeller(),
            fillCondition(),
            fillConditionDescription(),
            fillLocatedIn(),
            fillDescription(),
            fillPurchaseHistory(),
            getServerLotInfo(client)
        ]);
        yield Promise.all([
            fillProduct(panel, client, _serverLotInfo),
            fillManualCondition(panel, client, _serverLotInfo),
            fillPcs(panel, _serverLotInfo),
            fillIgnoreThatLot(panel, _serverLotInfo),
            fillShipping(),
        ]);
        yield compareLotInfos(_serverLotInfo);
    });
}
function addPanel(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let bodyElement = yield sleepElementLoaded('body');
        if (bodyElement) {
            let existingPanel = bodyElement.querySelector('div.' + panelClass);
            if (!existingPanel) {
                createPanel(bodyElement, client);
            }
        }
    });
}
function showError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorDiv = yield sleepElementLoaded('div.' + panelClass + ' #' + errorElementId);
        let span = document.createElement('span');
        if (error instanceof EbayClient_1.ValidationProblemDetailedInfo) {
            let validationError = error;
            span.innerHTML = "Ошибка валидации: " + JSON.stringify(validationError.errors);
        }
        else {
            console.log(error.stack);
            span.innerHTML = error.stack;
        }
        errorDiv.appendChild(span);
    });
}
function enableSubmitButton() {
    return __awaiter(this, void 0, void 0, function* () {
        (yield sleepElementLoaded('#' + submitId)).disabled = false;
    });
}
function getAuthorizeFetch(oAuth2Client) {
    return new FetchWrapperCustom_1.FetchWrapperCustom({
        client: oAuth2Client,
        getNewToken: () => __awaiter(this, void 0, void 0, function* () {
            let codeVerifier = (yield chrome.storage.local.get(["code_verifier"])).code_verifier;
            document.location.href = yield oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: authRedirectUrl,
                codeVerifier,
                scope: ['Ebay.ServerAPI']
            });
            return null;
        }),
        getStoredToken: () => __awaiter(this, void 0, void 0, function* () {
            if (backendUrl !== (yield chrome.storage.local.get(["backend_url"])).backend_url)
                return null;
            let token = (yield chrome.storage.local.get(["token_store"])).token_store;
            if (token)
                return JSON.parse(token);
            return null;
        }),
        fetch: fetchResource
    });
}
function hideErrors() {
    return __awaiter(this, void 0, void 0, function* () {
        let errorDiv = yield sleepElementLoaded('div.' + panelClass + ' #' + errorElementId);
        errorDiv.innerHTML = "";
    });
}
function productPage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("productPage");
        try {
            yield addPanel(client);
            yield getDataFromPage(client);
            yield enableSubmitButton();
            yield hideErrors();
        }
        catch (error) {
            yield showError(error);
            throw error;
        }
    });
}
function authPage(oAuth2Client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("authPage");
        let url = new URL(document.location.href);
        if (url.searchParams.has("code")) {
            let codeVerifier = (yield chrome.storage.local.get(["code_verifier"])).code_verifier;
            let oauth2Token = yield oAuth2Client.authorizationCode.getTokenFromCodeRedirect(document.location.href, {
                redirectUri: authRedirectUrl,
                codeVerifier
            });
            yield chrome.storage.local.set({ backend_url: backendUrl });
            yield chrome.storage.local.set({ token_store: JSON.stringify(oauth2Token) });
            document.location.href = authRedirectUrl;
        }
    });
}
function searchPage(client) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        console.log("SearchPage");
        //только на странице проданые лоты
        if (((_b = (_a = new URL(document.location.href).searchParams) === null || _a === void 0 ? void 0 : _a.get('LH_Sold')) === null || _b === void 0 ? void 0 : _b.trim()) !== "1")
            return;
        let searchResults = yield sleepElementLoaded('ul.srp-results');
        let links = [...searchResults.querySelectorAll('li.s-item')]
            .map(function (x) {
            let link = x.querySelector('a.s-item__link');
            let soldDate = new Date(x.querySelector('span.POSITIVE').innerText.replace("Sold ", ""));
            return new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate);
        });
        let _ = updateStatusInfinite(client, links);
    });
}
function updateStatusInfinite(client, links) {
    return __awaiter(this, void 0, void 0, function* () {
        let ids = links.map(function (x) {
            return x.id;
        });
        // noinspection InfiniteLoopJS
        while (true) {
            try {
                console.log("UpdatingLotStates");
                let getLotStatesAnswer = yield client.getLotStates(ids);
                let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));
                links.forEach(function (x) {
                    let color = x.color;
                    if (knownLots.has(x.id)) {
                        let lotState = knownLots.get(x.id);
                        if (!lotState.ignoreThatLot) {
                            let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                            if (diffInDays > 0) {
                                x.color = lightYellowColor;
                            }
                            else {
                                x.color = lightGreenColor;
                            }
                            console.log(diffInDays);
                        }
                        else {
                            x.color = lightGreenColor;
                        }
                    }
                    else {
                        x.color = lightPinkColor;
                    }
                    if (x.color !== null && color !== x.color) {
                        x.link.style.cssText = `background-color: ${x.color};`;
                    }
                });
            }
            catch (error) {
                console.log(error.stack);
            }
            yield sleep(1000);
        }
    });
}
class LotLink {
    constructor(id, link, soldDate) {
        this.id = id;
        this.link = link;
        this.soldDate = soldDate;
        this.color = null;
    }
}
function sleepElementLoaded(selector) {
    return __awaiter(this, void 0, void 0, function* () {
        let retry = 0;
        while (true) {
            retry++;
            if (retry > 1000)
                throw new Error("unable to find element by selector " + selector);
            let element = document.querySelector(selector);
            if (element !== null)
                return element;
            yield sleep(100);
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function saveCodeVerifier() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let codeVerifier = (_a = (yield chrome.storage.local.get(["code_verifier"]))) === null || _a === void 0 ? void 0 : _a.code_verifier;
        if (codeVerifier === null || codeVerifier === undefined) {
            let codeVerifier = yield (0, oauth2_client_1.generateCodeVerifier)();
            yield chrome.storage.local.set({ code_verifier: codeVerifier });
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleepElementLoaded('footer');
        yield saveCodeVerifier();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWJheS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxlQUFlLEtBQWlELG9CQUFvQixDQUF1SCxDQUFDLGlCQUFpQixPQUFPLGNBQWMsYUFBYSxzQ0FBc0MsU0FBUyw4Q0FBOEMsd0JBQXdCLGdCQUFnQiwrQkFBK0IsY0FBYywyR0FBMkcscUJBQXFCLGVBQWUsMEhBQTBILHNCQUFzQiwrR0FBK0csU0FBUyx5REFBeUQseUlBQXlJLDJCQUEyQixNQUFNLDJEQUEyRCxnS0FBZ0ssZUFBZSxJQUFJLFNBQVMsd0lBQXdJLDRHQUE0Ryx3RUFBd0Usa0JBQWtCLE1BQU0sU0FBUyxvRkFBb0Ysd0VBQXdFLHdCQUF3QixpREFBaUQsb0JBQW9CLFNBQVMsb0RBQW9ELCtDQUErQyxxQkFBcUIsNkVBQTZFLDhIQUE4SCxnRkFBZ0YsRUFBRSxtQkFBbUIsR0FBRywyRUFBMkUsVUFBVSx3RUFBd0UsNERBQTRELGlHQUFpRywwRUFBMEUsaUJBQWlCLE1BQU0sNkJBQTZCLE1BQU0sc0JBQXNCLElBQUksOENBQThDLFNBQVMsMElBQTBJLHFDQUFxQyxTQUFTLDJCQUEyQixFQUFFLGdCQUFnQiwrTUFBK00sbUNBQW1DLG1KQUFtSiwrQkFBK0IsMEZBQTBGLG1NQUFtTSxtQkFBbUIscUNBQXFDLG9EQUFvRCx5Q0FBeUMsdUZBQXVGLCtHQUErRyxNQUFNLHFJQUFxSSxNQUFNLG1IQUFtSCxxQ0FBcUMsa0NBQWtDLEVBQUUsOEJBQThCLFVBQVUsbWJBQW1iLDhCQUE4QixtQkFBbUIsTUFBTSxPQUFPLCtJQUErSSxJQUFJLHlCQUF5QixlQUFlLGFBQWEsc0NBQXNDLFNBQVMsbUZBQW1GLHdCQUF3QixvQkFBb0IsWUFBWSxvRkFBb0Ysb0NBQW9DLHNEQUFzRCxhQUFhLGtFQUFrRSw0REFBNEQsZUFBZSxvQ0FBb0MsY0FBYyxpQ0FBaUMsWUFBWSxXQUFXLDZCQUE2QixTQUFTLGNBQWMsK0dBQStHLHNDQUFzQyxlQUFlLGNBQWMseUJBQXlCLHlIQUF5SCxPQUFPLHNLQUFzSyxnRUFBZ0UsdUJBQXVCLGdLQUFnSyxlQUFlLElBQUksVUFBVSxxQ0FBcUMsb0NBQW9DLG9DQUFvQyxNQUFNLE9BQU8sZ0NBQWdDLGNBQWMsRUFBRSxzQkFBc0IsNkRBQTZELEVBQUUsNEJBQTRCLE1BQU0sZ0NBQWdDLCtIQUErSCw4RUFBOEUsRUFBRSxHQUFHLDZIQUE2SCxRQUFRLEdBQUcsT0FBTywwRUFBMEUsa0JBQWtCLFNBQVMscUdBQXFHLHVGQUF1Rix5Q0FBeUMsWUFBWSxNQUFNLDJCQUEyQixrQ0FBa0MsZUFBZSw0QkFBNEIsMEJBQTBCLG1DQUFtQyxHQUFHLElBQUksc0JBQXNCLGFBQWEsYUFBYSxzQ0FBc0MsU0FBUyx1QkFBdUIsc0JBQXNCLG1CQUFtQiw0Q0FBNEMsZ0JBQWdCLFlBQVksYUFBYSxzQ0FBc0MsU0FBUywyQ0FBMkMsZUFBZSx5T0FBeU8sbUVBQW1FLDRCQUE0QixpQkFBaUIseUJBQXlCLGtDQUFrQyxLQUFLLG9CQUFvQixvQ0FBb0MsZ0JBQWdCLDJDQUEyQyxpQkFBaUIsMEJBQTBCLGtDQUFrQyxnRkFBZ0YsVUFBVSxpQkFBaUIsaUhBQWlILHVCQUF1QiwyRUFBMkUscUJBQXFCLFFBQVEsZ0RBQWdELG1CQUFtQiw4QkFBOEIsUUFBUSxXQUFXLElBQUksK0VBQStFLFNBQVMsZ0ZBQWdGLCtDQUErQyxpRkFBaUYscUVBQXFFLFNBQVMsSUFBSSxJQUFJLGlDQUFpQyw2R0FBNkcsU0FBUyxzREFBc0QsUUFBUSx5QkFBeUIsa0JBQWtCLE1BQU0sd0NBQXdDLHdLQUF3Syx3Q0FBd0MsaURBQWlELElBQUksMEJBQTBCLFNBQVMseUZBQXlGLFlBQVksWUFBWSxNQUFNLGNBQWMsV0FBVywrQkFBK0IsWUFBWSxZQUFZLHFDQUFxQyxTQUFTLFlBQVksYUFBYSxRQUFRLHNDQUFzQyxTQUFTLDJHQUEyRyxhQUFhLHdDQUF3Qyw2QkFBNkIsdUJBQXVCLEVBQUUsYUFBYSx5REFBeUQsNkJBQTZCLHdDQUF3QyxrREFBa0QsNkJBQTZCLCtCQUErQixFQUFFLFlBQVksdUNBQXVDLDZCQUE2QixzQkFBc0IsRUFBRSxhQUFhLHVDQUF1Qyw2QkFBNkIsc0JBQXNCLEVBQUUsTUFBTTtBQUNuZ1c7Ozs7Ozs7Ozs7OztBQ0RBLHdCQUF3QjtBQUN4QixtQkFBbUI7QUFDbkIsNEhBQTRIO0FBQzVILG9CQUFvQjtBQUNwQix3QkFBd0I7OztBQUV4QixvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCLHVDQUF1QztBQUV2QyxNQUFhLE1BQU07SUFLZixZQUFZLE9BQWdCLEVBQUUsSUFBeUU7UUFGN0YscUJBQWdCLEdBQW1ELFNBQVMsQ0FBQztRQUduRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFhLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO0lBQ3hGLENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDdEMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpDLElBQUksUUFBUSxHQUFnQjtZQUN4QixNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUUsa0JBQWtCO2FBQy9CO1NBQ0osQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQW1CLEVBQUUsRUFBRTtZQUNoRSxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFUyxxQkFBcUIsQ0FBQyxRQUFrQjtRQUM5QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQUEsQ0FBQztRQUM3SSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqQixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxTQUFTLEdBQVEsSUFBSSxDQUFDO2dCQUMxQixJQUFJLGFBQWEsR0FBRyxhQUFhLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNuRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztvQkFDL0IsU0FBUyxHQUFHLEVBQVMsQ0FBQztvQkFDdEIsS0FBSyxJQUFJLElBQUksSUFBSSxhQUFhO3dCQUMxQixTQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsQ0FBQztxQkFDSSxDQUFDO29CQUNGLFNBQVMsR0FBUSxJQUFJLENBQUM7Z0JBQzFCLENBQUM7Z0JBQ0QsT0FBTyxTQUFTLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMxQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDOUMsT0FBTyxjQUFjLENBQUMsc0NBQXNDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvRixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQWtCLElBQVcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsT0FBeUI7UUFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDdEMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekMsSUFBSSxRQUFRLEdBQWdCO1lBQ3hCLElBQUksRUFBRSxRQUFRO1lBQ2QsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUU7Z0JBQ0wsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsUUFBUSxFQUFFLGtCQUFrQjthQUMvQjtTQUNKLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFtQixFQUFFLEVBQUU7WUFDaEUsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsb0JBQW9CLENBQUMsUUFBa0I7UUFDN0MsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBUSxFQUFFLENBQUM7UUFBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLENBQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUFBLENBQUM7UUFDN0ksSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztnQkFDMUIsSUFBSSxhQUFhLEdBQUcsYUFBYSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDL0YsU0FBUyxHQUFHLGFBQWEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQU0sSUFBSSxDQUFDO2dCQUV4RSxPQUFPLFNBQVMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUN4QixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxTQUFTLEdBQVEsSUFBSSxDQUFDO2dCQUMxQixJQUFJLGFBQWEsR0FBRyxhQUFhLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNuRyxTQUFTLEdBQUcsNkJBQTZCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNoRSxPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMxQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDOUMsT0FBTyxjQUFjLENBQUMsc0NBQXNDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvRixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQVMsSUFBVyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBQyxPQUF5QixFQUFFLEVBQVU7UUFDL0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztRQUMzQyxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksRUFBRSxLQUFLLElBQUk7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQzNELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6QyxJQUFJLFFBQVEsR0FBZ0I7WUFDeEIsSUFBSSxFQUFFLFFBQVE7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRTtnQkFDTCxjQUFjLEVBQUUsa0JBQWtCO2FBQ3JDO1NBQ0osQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQW1CLEVBQUUsRUFBRTtZQUNoRSxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFUyxvQkFBb0IsQ0FBQyxRQUFrQjtRQUM3QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQUEsQ0FBQztRQUM3SSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqQixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDOUMsT0FBTztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUM5QyxJQUFJLFNBQVMsR0FBUSxJQUFJLENBQUM7Z0JBQzFCLElBQUksYUFBYSxHQUFHLGFBQWEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ25HLFNBQVMsR0FBRyw2QkFBNkIsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hFLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzFDLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUM5QyxPQUFPLGNBQWMsQ0FBQyxzQ0FBc0MsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9GLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBTyxJQUFXLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsYUFBYSxDQUFDLEVBQVU7UUFDcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztRQUMzQyxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksRUFBRSxLQUFLLElBQUk7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQzNELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakMsSUFBSSxRQUFRLEdBQWdCO1lBQ3hCLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE9BQU8sRUFBRSxFQUNSO1NBQ0osQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQW1CLEVBQUUsRUFBRTtZQUNoRSxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFUyxvQkFBb0IsQ0FBQyxRQUFrQjtRQUM3QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQUEsQ0FBQztRQUM3SSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqQixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDOUMsT0FBTztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLE9BQU8sY0FBYyxDQUFDLHNDQUFzQyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFPLElBQVcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsT0FBZ0IsRUFBRSxTQUFpQjtRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLDZCQUE2QixDQUFDO1FBQ3hELElBQUksU0FBUyxLQUFLLFNBQVMsSUFBSSxTQUFTLEtBQUssSUFBSTtZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDbEUsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpDLElBQUksUUFBUSxHQUFnQjtZQUN4QixJQUFJLEVBQUUsUUFBUTtZQUNkLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFO2dCQUNMLGNBQWMsRUFBRSxrQkFBa0I7YUFDckM7U0FDSixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBbUIsRUFBRSxFQUFFO1lBQ2hFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVTLG9CQUFvQixDQUFDLFFBQWtCO1FBQzdDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO1FBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQU0sRUFBRSxDQUFNLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUM7UUFBQSxDQUFDO1FBQzdJLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUM5QyxPQUFPO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDeEIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztnQkFDMUIsSUFBSSxhQUFhLEdBQUcsYUFBYSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbkcsU0FBUyxHQUFHLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLE9BQU8sY0FBYyxDQUFDLHNDQUFzQyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFPLElBQVcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVLENBQUMsS0FBYTtRQUNwQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDO1FBQzNDLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDOUQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQyxJQUFJLFFBQVEsR0FBZ0I7WUFDeEIsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLGtCQUFrQjthQUMvQjtTQUNKLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFtQixFQUFFLEVBQUU7WUFDaEUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsaUJBQWlCLENBQUMsUUFBa0I7UUFDMUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBUSxFQUFFLENBQUM7UUFBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLENBQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUFBLENBQUM7UUFDN0ksSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztnQkFDMUIsSUFBSSxhQUFhLEdBQUcsYUFBYSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbkcsU0FBUyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxTQUFTLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDeEIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztnQkFDMUIsSUFBSSxhQUFhLEdBQUcsYUFBYSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbkcsU0FBUyxHQUFHLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDOUQsT0FBTyxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLE9BQU8sY0FBYyxDQUFDLHNDQUFzQyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUF1QixJQUFXLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLE1BQWdCO1FBQ3pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUM7UUFDakQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFeEMsSUFBSSxRQUFRLEdBQWdCO1lBQ3hCLElBQUksRUFBRSxRQUFRO1lBQ2QsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUU7Z0JBQ0wsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsUUFBUSxFQUFFLGtCQUFrQjthQUMvQjtTQUNKLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFtQixFQUFFLEVBQUU7WUFDaEUsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsbUJBQW1CLENBQUMsUUFBa0I7UUFDNUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBUSxFQUFFLENBQUM7UUFBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLENBQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUFBLENBQUM7UUFDN0ksSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztnQkFDMUIsSUFBSSxhQUFhLEdBQUcsYUFBYSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbkcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7b0JBQy9CLFNBQVMsR0FBRyxFQUFTLENBQUM7b0JBQ3RCLEtBQUssSUFBSSxJQUFJLElBQUksYUFBYTt3QkFDMUIsU0FBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUM7cUJBQ0ksQ0FBQztvQkFDRixTQUFTLEdBQVEsSUFBSSxDQUFDO2dCQUMxQixDQUFDO2dCQUNELE9BQU8sU0FBUyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQzlDLE9BQU8sY0FBYyxDQUFDLHNDQUFzQyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFhLElBQVcsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7O09BR0c7SUFDSCx1QkFBdUI7UUFDbkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztRQUNoRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakMsSUFBSSxRQUFRLEdBQWdCO1lBQ3hCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxrQkFBa0I7YUFDL0I7U0FDSixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBbUIsRUFBRSxFQUFFO1lBQ2hFLE9BQU8sSUFBSSxDQUFDLDhCQUE4QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVTLDhCQUE4QixDQUFDLFFBQWtCO1FBQ3ZELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO1FBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQU0sRUFBRSxDQUFNLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUM7UUFBQSxDQUFDO1FBQzdJLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUM5QyxJQUFJLFNBQVMsR0FBUSxJQUFJLENBQUM7Z0JBQzFCLElBQUksYUFBYSxHQUFHLGFBQWEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ25HLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO29CQUMvQixTQUFTLEdBQUcsRUFBUyxDQUFDO29CQUN0QixLQUFLLElBQUksSUFBSSxJQUFJLGFBQWE7d0JBQzFCLFNBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxDQUFDO3FCQUNJLENBQUM7b0JBQ0YsU0FBUyxHQUFRLElBQUksQ0FBQztnQkFDMUIsQ0FBQztnQkFDRCxPQUFPLFNBQVMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzFDLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUM5QyxPQUFPLGNBQWMsQ0FBQyxzQ0FBc0MsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9GLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBb0IsSUFBVyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNKO0FBM1hELHdCQTJYQztBQUVELE1BQWEsZ0JBQWdCO0lBSXpCLFlBQVksSUFBd0I7UUFDaEMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUssQ0FBQyxRQUFRLENBQUMsR0FBUyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUM1QixDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFXO1FBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQVMsQ0FBQztnQkFDL0IsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDO29CQUNuQyxJQUFJLENBQUMsYUFBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0QsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFTO1FBQ25CLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksTUFBTSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWE7Z0JBQy9CLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQTVDRCw0Q0E0Q0M7QUFPRCxNQUFhLGFBQWE7SUFLdEIsWUFBWSxJQUFxQjtRQUM3QixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDdkIsSUFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFTLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBUyxDQUFDO2dCQUMvQixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUM7b0JBQ25DLElBQUksQ0FBQyxhQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzRCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVM7UUFDbkIsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWE7Z0JBQy9CLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQS9DRCxzQ0ErQ0M7QUFRRCxNQUFhLFdBQVc7SUFJcEIsWUFBWSxJQUFtQjtRQUMzQixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDdkIsSUFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFTLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBVztRQUNaLElBQUksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFVO1FBQ2IsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBakNELGtDQWlDQztBQU9ELE1BQWEsb0JBQW9CO0lBSTdCLFlBQVksSUFBNEI7UUFDcEMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUssQ0FBQyxRQUFRLENBQUMsR0FBUyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBVztRQUNaLElBQUksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN2RixDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVU7UUFDYixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQU0sU0FBUyxDQUFDO1FBQ3hFLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQXBDRCxvREFvQ0M7QUFPRCxNQUFhLE9BQU87SUFnQmhCLFlBQVksSUFBZTtRQUN2QixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDdkIsSUFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFTLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDcEQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFTLENBQUM7Z0JBQ2pDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO29CQUNyQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlELENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFVO1FBQ2IsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ25DLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUMzQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbkQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlO2dCQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQWhGRCwwQkFnRkM7QUFtQkQsTUFBYSxZQUFZO0lBS3JCLFlBQVksSUFBb0I7UUFDNUIsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUssQ0FBQyxRQUFRLENBQUMsR0FBUyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVM7UUFDbkIsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQXBDRCxvQ0FvQ0M7QUFRRCxNQUFhLGVBQWU7SUFJeEIsWUFBWSxJQUF1QjtRQUMvQixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDdkIsSUFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFTLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBVztRQUNaLElBQUksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFVO1FBQ2IsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDdkMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBakNELDBDQWlDQztBQU9ELE1BQWEsUUFBUTtJQUtqQixZQUFZLElBQWdCO1FBQ3hCLElBQUksSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUN4QixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO29CQUN2QixJQUFLLENBQUMsUUFBUSxDQUFDLEdBQVMsSUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFXO1FBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFTO1FBQ25CLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVU7UUFDYixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFwQ0QsNEJBb0NDO0FBUUQsTUFBc0IsbUJBQW1CO0lBT3JDLFlBQVksSUFBMkI7UUFDbkMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUssQ0FBQyxRQUFRLENBQUMsR0FBUyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVM7UUFDbkIsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQXhDRCxrREF3Q0M7QUFVRCxNQUFhLDJCQUE0QixTQUFRLG1CQUFtQjtJQUdoRSxZQUFZLElBQW1DO1FBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLElBQUksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLDJCQUEyQixFQUFFLENBQUM7UUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVU7UUFDYixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQTNCRCxrRUEyQkM7QUFNRCxNQUFhLDZCQUE4QixTQUFRLG1CQUFtQjtJQUdsRSxZQUFZLElBQXFDO1FBQzdDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLElBQUksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLDZCQUE2QixFQUFFLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVU7UUFDYixJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQTNCRCxzRUEyQkM7QUFNRCxNQUFhLE1BQU07SUFJZixZQUFZLElBQWM7UUFDdEIsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUssQ0FBQyxRQUFRLENBQUMsR0FBUyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxJQUFJLFFBQVEsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVM7UUFDbkIsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBckNELHdCQXFDQztBQU9ELE1BQWEsT0FBTztJQUloQixZQUFZLElBQWU7UUFDdkIsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUssQ0FBQyxRQUFRLENBQUMsR0FBUyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVc7UUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxJQUFJLFFBQVEsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVM7UUFDbkIsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBckNELDBCQXFDQztBQU9ELE1BQWEsWUFBYSxTQUFRLEtBQUs7SUFPbkMsWUFBWSxPQUFlLEVBQUUsTUFBYyxFQUFFLFFBQWdCLEVBQUUsT0FBZ0MsRUFBRSxNQUFXO1FBQ3hHLEtBQUssRUFBRSxDQUFDO1FBU0YsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFQNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUlELE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBUTtRQUMxQixPQUFPLEdBQUcsQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDO0lBQ3ZDLENBQUM7Q0FDSjtBQXRCRCxvQ0FzQkM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFlLEVBQUUsTUFBYyxFQUFFLFFBQWdCLEVBQUUsT0FBZ0MsRUFBRSxNQUFZO0lBQ3JILElBQUksTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLEtBQUssU0FBUztRQUN2QyxNQUFNLE1BQU0sQ0FBQzs7UUFFYixNQUFNLElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5OUJELE1BQWEsa0JBQWtCO0lBa0IzQixZQUFZLE9BQTJCO1FBZHZDOztXQUVHO1FBQ0ssVUFBSyxHQUF1QixJQUFJLENBQUM7UUFFekM7Ozs7OztXQU1HO1FBQ0sseUJBQW9CLEdBQXlCLElBQUksQ0FBQztRQXdGMUQ7Ozs7O1dBS0c7UUFDSyxrQkFBYSxHQUFnQyxJQUFJLENBQUM7UUEwRDFEOztXQUVHO1FBQ0ssaUJBQVksR0FBeUMsSUFBSSxDQUFDO1FBdko5RCxJQUFJLFFBQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxlQUFlLE1BQUssU0FBUyxFQUFFLENBQUM7WUFDekMsT0FBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDbkMsQ0FBQztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLEdBQVMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFlLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUNyQyxDQUFDLEVBQUMsRUFBRSxDQUFDO1FBQ1QsQ0FBQztRQUNELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUUzQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0csS0FBSyxDQUFDLEtBQWtCLEVBQUUsSUFBa0I7O1lBRTlDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRWhELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsU0FBUyxHQUFHLFdBQVc7WUFDM0QsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBQyxhQUFhLEVBQUUsU0FBUyxHQUFHLFdBQVcsRUFBQztZQUMzRCxDQUFDO1lBQ0QsSUFBSSxDQUFDO2dCQUNELE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUN2QixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFFM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxTQUFTLEdBQUcsUUFBUTtvQkFDcEQsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7Z0JBQ2hELENBQUM7cUJBQU0sQ0FBQztvQkFDSixNQUFNLEtBQUssQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFHRDs7Ozs7Ozs7O09BU0c7SUFDRyxRQUFROztZQUVWLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUVyRixtQ0FBbUM7Z0JBQ25DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztZQUV0QixDQUFDO1lBRUQsT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFL0IsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDRyxjQUFjOztZQUVoQixrQ0FBa0M7WUFDbEMsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUM7WUFFaEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEMsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBRTdCLENBQUM7S0FBQTtJQVVEOztPQUVHO0lBQ0csWUFBWTs7O1lBRWQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLG9EQUFvRDtnQkFDcEQsOENBQThDO2dCQUM5QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDOUIsQ0FBQztZQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQVMsRUFBRTs7Z0JBRTdCLElBQUksUUFBUSxHQUF1QixJQUFJLENBQUM7Z0JBRXhDLElBQUksQ0FBQztvQkFDRCxJQUFJLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxZQUFZLEVBQUUsQ0FBQzt3QkFDekIscURBQXFEO3dCQUNyRCxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2hFLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0VBQWtFLENBQUMsQ0FBQztnQkFDckYsQ0FBQztnQkFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ1osUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDaEQsQ0FBQztnQkFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ1osTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztvQkFDckYsZ0JBQUksQ0FBQyxPQUFPLEVBQUMsT0FBTyxtREFBRyxHQUFHLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxHQUFHLENBQUM7Z0JBQ2QsQ0FBQztnQkFDRCxPQUFPLFFBQVEsQ0FBQztZQUVwQixDQUFDLEVBQUMsRUFBRSxDQUFDO1lBRUwsSUFBSSxDQUFDO2dCQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ25CLGdCQUFJLENBQUMsT0FBTyxFQUFDLFVBQVUsbURBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QsTUFBTSxHQUFHLENBQUM7WUFDZCxDQUFDO29CQUFTLENBQUM7Z0JBQ1Asb0RBQW9EO2dCQUNwRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUM5QixDQUFDOztLQUVKO0lBT08sZUFBZTs7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDaEMsT0FBTztRQUNYLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQzdCLENBQUM7UUFFRCxJQUFJLENBQUMsV0FBSSxDQUFDLEtBQUssMENBQUUsU0FBUyxLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyRCx3RkFBd0Y7WUFDeEYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFcEQsK0VBQStFO1FBQy9FLElBQUksU0FBUyxHQUFHLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUN6QixPQUFPO1FBQ1gsQ0FBQztRQUVELGtDQUFrQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxHQUFTLEVBQUU7WUFDdEMsSUFBSSxDQUFDO2dCQUNELE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNYLHNDQUFzQztnQkFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzRUFBc0UsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvRixDQUFDO1FBQ0wsQ0FBQyxHQUFFLFNBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFOUIsQ0FBQztDQUVKO0FBOU1ELGdEQThNQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaFFELHNHQUtnQztBQUVoQyxzSkFBNkU7QUFDN0Usd0dBQXdEO0FBRXhELE1BQU0sc0JBQXNCLEdBQUcsZUFBZSxDQUFDO0FBQy9DLE1BQU0sMEJBQTBCLEdBQUcsbUJBQW1CLENBQUM7QUFDdkQsTUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7QUFDckMsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBRTNCLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUMvQixNQUFNLE1BQU0sR0FBRyxpQkFBaUI7QUFDaEMsTUFBTSxjQUFjLEdBQUcsY0FBYztBQUNyQyxNQUFNLFFBQVEsR0FBRyxRQUFRO0FBQ3pCLDhDQUE4QztBQUM5QyxNQUFNLFVBQVUsR0FBRywrQkFBK0I7QUFDbEQsTUFBTSxVQUFVLEdBQUcsR0FBRyxVQUFVLGFBQWEsQ0FBQztBQUM5QyxNQUFNLGVBQWUsR0FBRyx1QkFBdUI7QUFDL0MsTUFBTSxXQUFXLEdBQUcsUUFBUTtBQUM1QixNQUFNLGVBQWUsR0FBRyxTQUFTO0FBQ2pDLE1BQU0sY0FBYyxHQUFHLFdBQVc7QUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTO0FBSWxDLE1BQU0sT0FBTyxHQUFHLElBQUksb0JBQU8sRUFBRSxDQUFDO0FBQzlCLElBQUksY0FBb0MsQ0FBQztBQUV6Qyx3REFBd0Q7QUFDeEQsU0FBUyxhQUFhLENBQUMsS0FBa0IsRUFBRSxJQUFpQjtJQUN4RCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxFQUFFLGVBQWUsQ0FBQyxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsZUFBZSxDQUFDO1lBQzFDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEIsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLHNDQUFzQztnQkFDdEMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNuRSxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO29CQUN2QixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07b0JBQ3ZCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtpQkFDbEMsQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFHRCxTQUFTLFlBQVksQ0FBQyxLQUFLO0lBQ3ZCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUM7SUFDbkQsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFLENBQUM7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQztJQUNuRCxDQUFDO0lBRUQsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUlELFNBQVMsV0FBVyxDQUFDLFdBQVcsRUFBRSxNQUFjO0lBQzVDLElBQUksTUFBTSxHQUFHO09BQ1YsVUFBVTs7Ozs7Ozs7Ozs7OztPQWFWLFVBQVU7Ozs7Ozs7T0FPVixVQUFVOzs7O09BSVYsVUFBVTs7OztPQUlWLFVBQVU7Q0FDaEI7SUFFRyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztJQUNoRCxVQUFVLENBQUMsU0FBUyxHQUFHLE1BQU07SUFDN0IsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7SUFFbkMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUc5QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUN6QyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU07SUFDaEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBRS9CLElBQUksaUJBQWlCLEdBQUcsV0FBVyxNQUFNLDZCQUE2QixNQUFNLEVBQUUsQ0FBQztJQUMvRSxnQkFBZ0I7SUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRzttQkFDRixpQkFBaUI7K0JBQ0wsVUFBVSxxQkFBcUIsVUFBVTs7O3NCQUdsRCxzQkFBc0I7cUJBQ3ZCLHNCQUFzQiwyQkFBMkIsc0JBQXNCOzs7c0JBR3RFLGdCQUFnQjt3QkFDZCxnQkFBZ0IsU0FBUyxnQkFBZ0I7Ozs7c0JBSTNDLFlBQVk7cUJBQ2IsWUFBWSx5QkFBeUIsWUFBWTs7c0JBRWhELDBCQUEwQjt3QkFDeEIsMEJBQTBCLFNBQVMsMEJBQTBCOzs7O3VDQUk5QyxjQUFjOztxQkFFaEMsUUFBUTtLQUN4QixDQUFDO0lBRUYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFnQixLQUFrQjs7WUFDOUQsTUFBTSxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUNyQyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDckIsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsU0FBZSxZQUFZLENBQUMsS0FBa0IsRUFBRSxNQUFjOztRQUMxRCxJQUFJLENBQUM7WUFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQWtCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2RCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFFMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRSxHQUFHO2dCQUU3QixJQUFJLEdBQUcsS0FBSyxlQUFlLEVBQUUsQ0FBQztvQkFDMUIsYUFBYSxHQUFHLElBQUk7Z0JBQ3hCLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsYUFBYSxDQUFDO1lBRXpDLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDZixPQUFPLENBQUMsaUJBQWlCLEdBQUcsV0FBVztZQUMzQyxDQUFDO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRzdELE1BQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVyRSxNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDN0IsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVELFNBQVMsbUJBQW1CLENBQUMsY0FBcUMsRUFBRSxNQUEyQjtJQUMzRixLQUFLLElBQUksYUFBYSxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ3ZDLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEQsR0FBRyxDQUFDLFVBQVUsSUFBSTtZQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDLENBQUM7UUFFTixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRXRCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssVUFBVSxFQUFFLENBQUM7WUFDOUMsU0FBUTtRQUNaLENBQUM7UUFFRCxJQUFJLEtBQUssS0FBSyx5QkFBeUIsSUFBSSxLQUFLLEtBQUssaUJBQWlCLElBQUksS0FBSyxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBRTdGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLENBQUM7YUFBTSxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFFRCxNQUFNLGlCQUFpQjtJQUNuQixZQUFZLFFBQWdCLEVBQUUsSUFBVSxFQUFFLEtBQTBCO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUk7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLO0lBQ3RCLENBQUM7Q0FLSjtBQUVELFNBQVMsU0FBUyxDQUFDLFVBQVU7SUFDekIsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyw0REFBNEQsQ0FBQztJQUU1RixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRTlELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7U0FBTSxDQUFDO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELE9BQU8sSUFBSTtBQUNmLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLElBQVk7SUFDcEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztJQUU1RCxJQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBcUIsQ0FBQztJQUM1QyxJQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDO0lBQ2hFLElBQUksZUFBZSxLQUFLLElBQUksRUFBRSxDQUFDO1FBQzNCLElBQUksY0FBYyxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsbUJBQW1CLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDO0lBQ3JELElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksU0FBUyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ2QsT0FBTyxJQUFJLHlCQUFZLENBQUM7WUFDcEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO1NBQ25FLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxPQUFPLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQUVELFNBQWUsU0FBUzs7UUFDcEIsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBYyxNQUFNLGtCQUFrQixDQUFDLDBCQUEwQixDQUFFLEVBQUMsU0FBUyxDQUFDO0lBQy9HLENBQUM7Q0FBQTtBQUVELFNBQWUsUUFBUTs7UUFDbkIsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFjLE1BQU0sa0JBQWtCLENBQUMsU0FBUyxDQUFFLEVBQUMsU0FBUztJQUMvRSxDQUFDO0NBQUE7QUFFRCxTQUFlLFVBQVU7O1FBQ3JCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBYyxNQUFNLGtCQUFrQixDQUFDLDRDQUE0QyxDQUFFLEVBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtJQUNsSSxDQUFDO0NBQUE7QUFFRCxTQUFlLGFBQWE7O1FBQ3hCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBYyxNQUFNLGtCQUFrQixDQUFDLDZDQUE2QyxDQUFFLEVBQUMsU0FBUztJQUN4SCxDQUFDO0NBQUE7QUFFRCxTQUFlLHdCQUF3Qjs7UUFDbkMsSUFBSSwyQkFBMkIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDO1FBQ3JGLElBQUksMkJBQTJCLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdEMsT0FBTyxDQUFDLG9CQUFvQixHQUFpQiwyQkFBNEIsQ0FBQyxTQUFTO2lCQUM5RSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztpQkFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVELFNBQWUsWUFBWTs7UUFDdkIsSUFBSSxXQUFXLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQztRQUNwRSxJQUFJLHNCQUFzQixHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsbURBQW1ELENBQUMsS0FBSyxJQUFJO1FBQ3BILElBQUksc0JBQXNCLEVBQUUsQ0FBQztZQUN6QixJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLGtEQUFrRCxDQUFDO1lBRWpHLElBQUkscUJBQXFCLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO3FCQUMvRCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLHFCQUFxQixHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztxQkFDL0QsYUFBYSxDQUFDLElBQUksQ0FBQztxQkFDbkIsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFNUIsSUFBSSxxQkFBcUIsR0FBRyxFQUFFLENBQUM7WUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEdBQUcsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUM1QyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUztZQUN6RixDQUFDO1lBRUQsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFFRCxJQUFJLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyx1QkFBdUIsQ0FBQztZQUVsRSxJQUFJLGFBQWEsS0FBSyxlQUFlLEVBQUUsQ0FBQztnQkFDcEMsT0FBTyxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDO2dCQUU5QyxJQUFJLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUM7b0JBRS9ELElBQUksY0FBYyxHQUFHLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDO29CQUVsRSxJQUFJLGNBQWMsS0FBSyxNQUFNLEVBQUUsQ0FBQzt3QkFDNUIsT0FBTyxDQUFDLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUM7b0JBQzdELENBQUM7eUJBQU0sQ0FBQzt3QkFDSixPQUFPLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO29CQUNuQyxDQUFDO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO1lBRUwsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixPQUFPLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVELFNBQWUsYUFBYTs7UUFDeEIsSUFBSSxLQUFLLEdBQUcsQ0FBYyxNQUFNLGtCQUFrQixDQUFDLHdCQUF3QixDQUFFLEVBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztRQUNuSCxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNqQixPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVM7UUFDakMsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVELFNBQWUsZUFBZTs7UUFDMUIsSUFBSSxjQUFjLEdBQUcsQ0FBb0IsTUFBTSxrQkFBa0IsQ0FBQyxXQUFXLENBQUUsRUFBQyxHQUFHO1FBQ25GLElBQUksUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLGNBQWMsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBQyxDQUFDO1FBQzNGLE9BQU8sQ0FBQyxXQUFXLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQy9DLENBQUM7Q0FBQTtBQUVELFNBQWUsbUJBQW1COztRQUM5QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELElBQUksa0JBQWtCLEdBQUcsV0FBVyxRQUFRLENBQUMsUUFBUSw2QkFBNkIsTUFBTSxFQUFFLENBQUM7UUFDM0YsSUFBSSxRQUFRLEdBQUcsTUFBTSxhQUFhLENBQUMsa0JBQWtCLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUMsQ0FBQztRQUMvRixJQUFJLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDaEMsT0FBTyxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7SUFDdEQsQ0FBQztDQUFBO0FBRUQsU0FBUyxjQUFjOztJQUNuQixJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixPQUFPLHNCQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSwwQ0FBRSxHQUFHLENBQUMsTUFBTSxDQUFDLDBDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUUsQ0FBQztJQUN2RixDQUFDO0lBQ0QsT0FBTyxTQUFTO0FBQ3BCLENBQUM7QUFFRCxTQUFlLFdBQVcsQ0FBQyxLQUFxQixFQUFFLE1BQWMsRUFBRSxhQUErQzs7O1FBQzdHLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLENBQUM7UUFFckUsSUFBSSxTQUFTLEdBQUcseUJBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxTQUFTLDBDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUU7UUFDL0QsSUFBSSxXQUFXLEdBQUcsY0FBYyxFQUFFLENBQUM7UUFFbkMsSUFBSSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsY0FBYyxFQUFFO1FBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxHQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDM0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRWpDLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUMxQixJQUFJLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7b0JBQ3BELEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSTtnQkFDdkIsQ0FBQztZQUNMLENBQUM7aUJBQU0sSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ25DLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztvQkFDekMsSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO3dCQUMvQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUk7b0JBQ3ZCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDO1lBRU4sQ0FBQztZQUNELFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsQ0FBQzs7Q0FDSjtBQUVELFNBQWUsbUJBQW1CLENBQUMsS0FBcUIsRUFBRSxNQUFjLEVBQUUsYUFBK0M7OztRQUNySCxJQUFJLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLDBCQUEwQixDQUFDLENBQUM7UUFFdkYsSUFBSSxpQkFBaUIsR0FBRywrQkFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLE9BQU8sMENBQUUsaUJBQWlCLDBDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUU7UUFFeEYsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRTtRQUM3RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDL0MsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxHQUFHLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNuQyxHQUFHLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztZQUVoRCxJQUFJLGlCQUFpQixLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLGlCQUFpQixLQUFLLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO29CQUNwRSxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUk7Z0JBQ3ZCLENBQUM7WUFDTCxDQUFDO1lBRUQsb0JBQW9CLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUM7O0NBQ0o7QUFFRCxTQUFlLGdCQUFnQixDQUFDLE1BQWM7O1FBQzFDLElBQUksQ0FBQztZQUNELGNBQWMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxLQUFLLFlBQVksd0NBQTJCLEVBQUUsQ0FBQztnQkFDL0MsT0FBTyxTQUFTLENBQUM7WUFDckIsQ0FBQztZQUVELE1BQU0sS0FBSyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFFRCxTQUFlLE9BQU8sQ0FBQyxLQUFxQixFQUFFLGFBQStDOzs7UUFDekYsSUFBSSxRQUFRLEdBQXFCLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxDQUFDO1FBRTlFLElBQUksU0FBUyxHQUFHLG1CQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsT0FBTywwQ0FBRSxHQUFHO1FBQzNDLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRTtRQUN6QyxDQUFDOztDQUNKO0FBRUQsU0FBZSxpQkFBaUIsQ0FBQyxLQUFxQixFQUFFLGFBQStDOzs7UUFDbkcsSUFBSSxrQkFBa0IsR0FBcUIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztRQUVsRyxJQUFJLFNBQVMsR0FBRyxtQkFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLE9BQU8sMENBQUUsYUFBYTtRQUNyRCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUMxQixrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsU0FBUztRQUMxQyxDQUFDOztDQUNKO0FBR0QsU0FBZSxlQUFlLENBQUMsMEJBQWdEOztRQUMzRSxJQUFJLDBCQUEwQixLQUFLLFNBQVM7WUFBRSxPQUFPO1FBQ3JELElBQUksaUJBQWlCLEdBQUcsMEJBQTBCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNuRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTO1FBQ3BDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxHQUFHLFNBQVM7UUFDOUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsR0FBRyxTQUFTO1FBQ2xELGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxHQUFHLFNBQVM7UUFDNUMsSUFBSSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUNoRSxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFNBQVM7UUFDaEQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNsQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUztRQUM5QixXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsU0FBUztRQUN4QyxXQUFXLENBQUMsbUJBQW1CLENBQUMsR0FBRyxTQUFTO1FBQzVDLFdBQVcsQ0FBQyxhQUFhLENBQUMsR0FBRyxTQUFTO1FBQ3RDLElBQUksc0JBQXNCLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDNUQsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsU0FBUztRQUUxQyxJQUFJLHVCQUF1QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUM7UUFDL0QsSUFBSSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUM5RCxJQUFJLCtCQUErQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUM7UUFDM0UsSUFBSSxnQ0FBZ0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDO1FBRTdFLElBQUksS0FBSyxHQUFtQixNQUFNLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsQ0FBQztRQUMxRSxJQUFJLHVCQUF1QixLQUFLLDRCQUE0QixFQUFFLENBQUM7WUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztZQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDO1lBQzdDLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFJLCtCQUErQixLQUFLLGdDQUFnQyxFQUFFLENBQUM7Z0JBQ3hILEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLHFCQUFxQixlQUFlLEdBQUc7WUFDakUsQ0FBQztpQkFFRCxDQUFDO2dCQUNHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLHFCQUFxQixnQkFBZ0IsR0FBRztZQUNsRSxDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDSixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsY0FBYyxHQUFHO1FBQ2hFLENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDO1FBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLDRCQUE0QixDQUFDO0lBQy9ELENBQUM7Q0FBQTtBQUVELFNBQWUsZUFBZSxDQUFDLE1BQWM7O1FBQ3pDLElBQUksS0FBSyxHQUFtQixNQUFNLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7UUFFekUsTUFBTSxFQUFFLENBQUM7UUFDVCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDZCxTQUFTLEVBQUU7WUFDWCxRQUFRLEVBQUU7WUFDVixVQUFVLEVBQUU7WUFDWixhQUFhLEVBQUU7WUFDZix3QkFBd0IsRUFBRTtZQUMxQixhQUFhLEVBQUU7WUFDZixlQUFlLEVBQUU7WUFDakIsbUJBQW1CLEVBQUU7WUFDckIsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO1NBQzNCLENBQUM7UUFDRixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDZCxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUM7WUFDMUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUM7WUFDbEQsT0FBTyxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7WUFDOUIsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQztZQUN4QyxZQUFZLEVBQUU7U0FDakIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUFBO0FBR0QsU0FBZSxRQUFRLENBQUMsTUFBYzs7UUFDbEMsSUFBSSxXQUFXLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNqQixXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBRUQsU0FBZSxTQUFTLENBQUMsS0FBWTs7UUFDakMsSUFBSSxRQUFRLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLElBQUksR0FBRyxjQUFjLENBQUM7UUFDcEYsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyxJQUFJLEtBQUssWUFBWSwwQ0FBNkIsRUFBRSxDQUFDO1lBQ2pELElBQUksZUFBZSxHQUFrQyxLQUFLO1lBQzFELElBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1FBQ2xGLENBQUM7YUFBTSxDQUFDO1lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNqQyxDQUFDO1FBRUQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDOUIsQ0FBQztDQUFBO0FBRUQsU0FBZSxrQkFBa0I7O1FBQzdCLENBQW9CLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBRSxFQUFDLFFBQVEsR0FBRyxLQUFLO0lBQ2xGLENBQUM7Q0FBQTtBQUVELFNBQVMsaUJBQWlCLENBQUMsWUFBMEI7SUFDakQsT0FBTyxJQUFJLHVDQUFrQixDQUFDO1FBQzFCLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFdBQVcsRUFBRSxHQUFTLEVBQUU7WUFDcEIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFFckYsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxZQUFZLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDO2dCQUMxRSxXQUFXLEVBQUUsZUFBZTtnQkFDNUIsWUFBWTtnQkFDWixLQUFLLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQzthQUM1QixDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsY0FBYyxFQUFFLEdBQVMsRUFBRTtZQUN2QixJQUFJLFVBQVUsS0FBSyxDQUFDLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVc7Z0JBQUcsT0FBTyxJQUFJLENBQUM7WUFDL0YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFDMUUsSUFBSSxLQUFLO2dCQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsS0FBSyxFQUFFLGFBQWE7S0FDdkIsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFlLFVBQVU7O1FBQ3JCLElBQUksUUFBUSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxJQUFJLEdBQUcsY0FBYyxDQUFDO1FBQ3BGLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRTtJQUMzQixDQUFDO0NBQUE7QUFFRCxTQUFlLFdBQVcsQ0FBQyxNQUFjOztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUMxQixJQUFJLENBQUM7WUFDRCxNQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QixNQUFNLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixNQUFNLGtCQUFrQixFQUFFO1lBQzFCLE1BQU0sVUFBVSxFQUFFO1FBQ3RCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkIsTUFBTSxLQUFLLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVELFNBQWUsUUFBUSxDQUFDLFlBQTBCOztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUN2QixJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUN6QyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDckYsSUFBSSxXQUFXLEdBQUcsTUFBTSxZQUFZLENBQUMsaUJBQWlCLENBQUMsd0JBQXdCLENBQzNFLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUN0QjtnQkFDSSxXQUFXLEVBQUUsZUFBZTtnQkFDNUIsWUFBWTthQUNmLENBQ0osQ0FBQztZQUNGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBQyxDQUFDO1lBQ3pELE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUMsQ0FBQztZQUUxRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxlQUFlO1FBQzVDLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFHRCxTQUFlLFVBQVUsQ0FBQyxNQUFjOzs7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFDekIsa0NBQWtDO1FBQ2xDLElBQUksaUJBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSwwQ0FBRSxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUFFLElBQUksRUFBRSxNQUFLLEdBQUc7WUFBRSxPQUFPO1FBRXpGLElBQUksYUFBYSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsZ0JBQWdCLENBQUM7UUFFOUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN2RCxHQUFHLENBQUMsVUFBVSxDQUFjO1lBQ3pCLElBQUksSUFBSSxHQUFzQixDQUFDLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDO1lBQy9ELElBQUksUUFBUSxHQUFHLElBQUksSUFBSSxDQUFlLENBQUMsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRyxDQUFDLENBQUM7UUFFTixJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7O0NBQy9DO0FBRUQsU0FBZSxvQkFBb0IsQ0FBQyxNQUFjLEVBQUUsS0FBZ0I7O1FBQ2hFLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxDQUFDLEVBQUU7UUFDZixDQUFDLENBQUM7UUFDRiw4QkFBOEI7UUFDOUIsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNWLElBQUksQ0FBQztnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDO2dCQUNoQyxJQUFJLGtCQUFrQixHQUFHLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7Z0JBRXZELElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5FLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO29CQUVyQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUVwQixJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ3RCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzt3QkFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs0QkFDMUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUNySCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQ0FDakIsQ0FBQyxDQUFDLEtBQUssR0FBRyxnQkFBZ0I7NEJBQzlCLENBQUM7aUNBQU0sQ0FBQztnQ0FDSixDQUFDLENBQUMsS0FBSyxHQUFHLGVBQWU7NEJBQzdCLENBQUM7NEJBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7d0JBQzNCLENBQUM7NkJBQU0sQ0FBQzs0QkFDSixDQUFDLENBQUMsS0FBSyxHQUFHLGVBQWU7d0JBQzdCLENBQUM7b0JBQ0wsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLENBQUMsQ0FBQyxLQUFLLEdBQUcsY0FBYztvQkFDNUIsQ0FBQztvQkFFRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLEtBQUssR0FBRztvQkFDMUQsQ0FBQztnQkFDTCxDQUFDLENBQUM7WUFDTixDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDNUIsQ0FBQztZQUNELE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBRUQsTUFBTSxPQUFPO0lBQ1QsWUFBWSxFQUFVLEVBQUUsSUFBdUIsRUFBRSxRQUFjO1FBQzNELElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRTtRQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVE7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJO0lBQ3JCLENBQUM7Q0FNSjtBQUVELFNBQWUsa0JBQWtCLENBQUMsUUFBZ0I7O1FBQzlDLElBQUksS0FBSyxHQUFHLENBQUM7UUFDYixPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1YsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLEtBQUssR0FBRyxJQUFJO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLEdBQUcsUUFBUSxDQUFDO1lBRW5GLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQzlDLElBQUksT0FBTyxLQUFLLElBQUk7Z0JBQUUsT0FBTyxPQUFPO1lBQ3BDLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFFRCxTQUFTLEtBQUssQ0FBQyxFQUFVO0lBQ3JCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVELFNBQWUsZ0JBQWdCOzs7UUFDM0IsSUFBSSxZQUFZLEdBQUcsT0FBQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsMENBQUUsYUFBYSxDQUFDO1FBRXRGLElBQUksWUFBWSxLQUFLLElBQUksSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDdEQsSUFBSSxZQUFZLEdBQUcsTUFBTSx3Q0FBb0IsR0FBRSxDQUFDO1lBQ2hELE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsYUFBYSxFQUFFLFlBQVksRUFBQyxDQUFDO1FBQ2pFLENBQUM7O0NBQ0o7QUFFRCxTQUFzQixHQUFHOztRQUNyQixNQUFNLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUNsQyxNQUFNLGdCQUFnQixFQUFFLENBQUM7UUFFekIsSUFBSSxZQUFZLEdBQUcsSUFBSSw0QkFBWSxDQUFDO1lBQ2hDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFFBQVEsRUFBRSxzQkFBc0I7WUFDaEMsYUFBYSxFQUFFLGdCQUFnQjtZQUMvQixxQkFBcUIsRUFBRSxvQkFBb0I7WUFDM0MsS0FBSyxFQUFFLGFBQWE7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUTtRQUU5RSxJQUFJLFdBQVcsS0FBSyxlQUFlLEVBQUUsQ0FBQztZQUNsQyxNQUFNLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNqQyxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksTUFBTSxHQUFHLElBQUksbUJBQU0sQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUVyRSxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDO2lCQUFNLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLENBQUM7Z0JBQzdELE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBekJELGtCQXlCQztBQUdELEdBQUcsRUFBRSxDQUFDOzs7Ozs7O1VDcnVCTjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQvYnJvd3Nlci9vYXV0aDItY2xpZW50Lm1pbi5qcyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9FYmF5Q2xpZW50L0ViYXlDbGllbnQudHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRmV0Y2hXcmFwcGVyQ3VzdG9tLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL21haW4udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk9BdXRoMkNsaWVudD10KCk6ZS5PQXV0aDJDbGllbnQ9dCgpfShzZWxmLCgoKT0+KCgpPT57dmFyIGU9ezkzNDooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXQuT0F1dGgyQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoNDQzKSxpPXIoNjE4KTtmdW5jdGlvbiBvKGUsdCl7cmV0dXJuIG5ldyBVUkwoZSx0KS50b1N0cmluZygpfWZ1bmN0aW9uIHMoZSl7cmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGUpLmZpbHRlcigoKFtlLHRdKT0+dm9pZCAwIT09dCkpKSkudG9TdHJpbmcoKX10Lk9BdXRoMkNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmRpc2NvdmVyeURvbmU9ITEsdGhpcy5zZXJ2ZXJNZXRhZGF0YT1udWxsLChudWxsPT1lP3ZvaWQgMDplLmZldGNoKXx8KGUuZmV0Y2g9ZmV0Y2guYmluZChnbG9iYWxUaGlzKSksdGhpcy5zZXR0aW5ncz1lfWFzeW5jIHJlZnJlc2hUb2tlbihlKXtpZighZS5yZWZyZXNoVG9rZW4pdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0b2tlbiBkaWRuJ3QgaGF2ZSBhIHJlZnJlc2hUb2tlbi4gSXQncyBub3QgcG9zc2libGUgdG8gcmVmcmVzaCB0aGlzXCIpO2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJyZWZyZXNoX3Rva2VuXCIscmVmcmVzaF90b2tlbjplLnJlZnJlc2hUb2tlbn07cmV0dXJuIHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0fHwodC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCksdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfWFzeW5jIGNsaWVudENyZWRlbnRpYWxzKGUpe3ZhciB0O2NvbnN0IHI9W1wiY2xpZW50X2lkXCIsXCJjbGllbnRfc2VjcmV0XCIsXCJncmFudF90eXBlXCIsXCJzY29wZVwiXTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+ci5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7ci5qb2luKFwiJywgJ1wiKX0nYCk7Y29uc3Qgbj17Z3JhbnRfdHlwZTpcImNsaWVudF9jcmVkZW50aWFsc1wiLHNjb3BlOm51bGw9PT0odD1udWxsPT1lP3ZvaWQgMDplLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfTtpZighdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpdGhyb3cgbmV3IEVycm9yKFwiQSBjbGllbnRTZWNyZXQgbXVzdCBiZSBwcm92aWRlZCB0byB1c2UgY2xpZW50X2NyZWRlbnRpYWxzXCIpO3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixuKSl9YXN5bmMgcGFzc3dvcmQoZSl7dmFyIHQ7Y29uc3Qgcj17Z3JhbnRfdHlwZTpcInBhc3N3b3JkXCIsLi4uZSxzY29wZTpudWxsPT09KHQ9ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIil9O3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixyKSl9Z2V0IGF1dGhvcml6YXRpb25Db2RlKCl7cmV0dXJuIG5ldyBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50KHRoaXMpfWFzeW5jIGludHJvc3BlY3QoZSl7Y29uc3QgdD17dG9rZW46ZS5hY2Nlc3NUb2tlbix0b2tlbl90eXBlX2hpbnQ6XCJhY2Nlc3NfdG9rZW5cIn07cmV0dXJuIHRoaXMucmVxdWVzdChcImludHJvc3BlY3Rpb25FbmRwb2ludFwiLHQpfWFzeW5jIGdldEVuZHBvaW50KGUpe2lmKHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoXCJkaXNjb3ZlcnlFbmRwb2ludFwiIT09ZSYmKGF3YWl0IHRoaXMuZGlzY292ZXIoKSx2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZighdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiAke2V9LiBFaXRoZXIgc3BlY2lmeSAke2V9IGluIHRoZSBzZXR0aW5ncywgb3IgdGhlIFwic2VydmVyXCIgZW5kcG9pbnQgdG8gbGV0IHRoZSBjbGllbnQgZGlzY292ZXIgaXQuYCk7c3dpdGNoKGUpe2Nhc2VcImF1dGhvcml6YXRpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2F1dGhvcml6ZVwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJ0b2tlbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvdG9rZW5cIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiZGlzY292ZXJ5RW5kcG9pbnRcIjpyZXR1cm4gbyhcIi8ud2VsbC1rbm93bi9vYXV0aC1hdXRob3JpemF0aW9uLXNlcnZlclwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9pbnRyb3NwZWN0XCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpfX1hc3luYyBkaXNjb3Zlcigpe3ZhciBlO2lmKHRoaXMuZGlzY292ZXJ5RG9uZSlyZXR1cm47bGV0IHQ7dGhpcy5kaXNjb3ZlcnlEb25lPSEwO3RyeXt0PWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoXCJkaXNjb3ZlcnlFbmRwb2ludFwiKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgY291bGQgbm90IGJlIGRldGVybWluZWQuIEVpdGhlciBzcGVjaWZ5IHRoZSBcInNlcnZlclwiIG9yIFwiZGlzY292ZXJ5RW5kcG9pbnQnKX1jb25zdCByPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2godCx7aGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvblwifX0pO2lmKCFyLm9rKXJldHVybjtpZighKG51bGw9PT0oZT1yLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSkpcmV0dXJuIHZvaWQgY29uc29sZS53YXJuKFwiW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCB3YXMgbm90IGEgSlNPTiByZXNwb25zZS4gUmVzcG9uc2UgaXMgaWdub3JlZFwiKTt0aGlzLnNlcnZlck1ldGFkYXRhPWF3YWl0IHIuanNvbigpO2NvbnN0IG49W1tcImF1dGhvcml6YXRpb25fZW5kcG9pbnRcIixcImF1dGhvcml6YXRpb25FbmRwb2ludFwiXSxbXCJ0b2tlbl9lbmRwb2ludFwiLFwidG9rZW5FbmRwb2ludFwiXSxbXCJpbnRyb3NwZWN0aW9uX2VuZHBvaW50XCIsXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIl1dO2lmKG51bGwhPT10aGlzLnNlcnZlck1ldGFkYXRhKXtmb3IoY29uc3RbZSxyXW9mIG4pdGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSYmKHRoaXMuc2V0dGluZ3Nbcl09byh0aGlzLnNlcnZlck1ldGFkYXRhW2VdLHQpKTt0aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWQmJiF0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kJiYodGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZD10aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWRbMF0pfX1hc3luYyByZXF1ZXN0KGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEVuZHBvaW50KGUpLGk9e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIn07bGV0IG89dGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZDtzd2l0Y2gob3x8KG89dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQ/XCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6XCJjbGllbnRfc2VjcmV0X3Bvc3RcIiksbyl7Y2FzZVwiY2xpZW50X3NlY3JldF9iYXNpY1wiOmkuQXV0aG9yaXphdGlvbj1cIkJhc2ljIFwiK2J0b2EodGhpcy5zZXR0aW5ncy5jbGllbnRJZCtcIjpcIit0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7Y2FzZVwiY2xpZW50X3NlY3JldF9wb3N0XCI6dC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCx0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKHQuY2xpZW50X3NlY3JldD10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBtZXRob2Qgbm90IHlldCBzdXBwb3J0ZWQ6XCIrbytcIi4gT3BlbiBhIGZlYXR1cmUgcmVxdWVzdCBpZiB5b3Ugd2FudCB0aGlzIVwiKX1jb25zdCBhPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2gocix7bWV0aG9kOlwiUE9TVFwiLGJvZHk6cyh0KSxoZWFkZXJzOml9KTtpZihhLm9rKXJldHVybiBhd2FpdCBhLmpzb24oKTtsZXQgYyxoLHU7dGhyb3cgYS5oZWFkZXJzLmhhcyhcIkNvbnRlbnQtVHlwZVwiKSYmYS5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSYmKGM9YXdhaXQgYS5qc29uKCkpLChudWxsPT1jP3ZvaWQgMDpjLmVycm9yKT8oaD1cIk9BdXRoMiBlcnJvciBcIitjLmVycm9yK1wiLlwiLGMuZXJyb3JfZGVzY3JpcHRpb24mJihoKz1cIiBcIitjLmVycm9yX2Rlc2NyaXB0aW9uKSx1PWMuZXJyb3IpOihoPVwiSFRUUCBFcnJvciBcIithLnN0YXR1cytcIiBcIithLnN0YXR1c1RleHQsNDAxPT09YS5zdGF0dXMmJnRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYoaCs9XCIuIEl0J3MgbGlrZWx5IHRoYXQgdGhlIGNsaWVudElkIGFuZC9vciBjbGllbnRTZWNyZXQgd2FzIGluY29ycmVjdFwiKSx1PW51bGwpLG5ldyBuLk9BdXRoMkVycm9yKGgsdSxhLnN0YXR1cyl9dG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4oZSl7cmV0dXJuIGUudGhlbigoZT0+e3ZhciB0O3JldHVybnthY2Nlc3NUb2tlbjplLmFjY2Vzc190b2tlbixleHBpcmVzQXQ6ZS5leHBpcmVzX2luP0RhdGUubm93KCkrMWUzKmUuZXhwaXJlc19pbjpudWxsLHJlZnJlc2hUb2tlbjpudWxsIT09KHQ9ZS5yZWZyZXNoX3Rva2VuKSYmdm9pZCAwIT09dD90Om51bGx9fSkpfX0sdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXN9LDYxODooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZXRDb2RlQ2hhbGxlbmdlPXQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDkzNCksaT1yKDQ0Myk7YXN5bmMgZnVuY3Rpb24gbyhlKXtjb25zdCB0PXMoKTtpZihudWxsPT10P3ZvaWQgMDp0LnN1YnRsZSlyZXR1cm5bXCJTMjU2XCIsYyhhd2FpdCB0LnN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsYShlKSkpXTt7Y29uc3QgdD1yKDIxMikuY3JlYXRlSGFzaChcInNoYTI1NlwiKTtyZXR1cm4gdC51cGRhdGUoYShlKSksW1wiUzI1NlwiLHQuZGlnZXN0KFwiYmFzZTY0dXJsXCIpXX19ZnVuY3Rpb24gcygpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jcnlwdG8pcmV0dXJuIHdpbmRvdy5jcnlwdG87aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJnNlbGYuY3J5cHRvKXJldHVybiBzZWxmLmNyeXB0bztjb25zdCBlPXIoMjEyKTtyZXR1cm4gZS53ZWJjcnlwdG8/ZS53ZWJjcnlwdG86bnVsbH1mdW5jdGlvbiBhKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09MjU1JmUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH1mdW5jdGlvbiBjKGUpe3JldHVybiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkoZSkpKS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoLz0rJC8sXCJcIil9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmNsaWVudD1lfWFzeW5jIGdldEF1dGhvcml6ZVVyaShlKXtjb25zdFt0LHJdPWF3YWl0IFByb21pc2UuYWxsKFtlLmNvZGVWZXJpZmllcj9vKGUuY29kZVZlcmlmaWVyKTp2b2lkIDAsdGhpcy5jbGllbnQuZ2V0RW5kcG9pbnQoXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIildKTtsZXQgaT17Y2xpZW50X2lkOnRoaXMuY2xpZW50LnNldHRpbmdzLmNsaWVudElkLHJlc3BvbnNlX3R5cGU6XCJjb2RlXCIscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV9jaGFsbGVuZ2VfbWV0aG9kOm51bGw9PXQ/dm9pZCAwOnRbMF0sY29kZV9jaGFsbGVuZ2U6bnVsbD09dD92b2lkIDA6dFsxXX07ZS5zdGF0ZSYmKGkuc3RhdGU9ZS5zdGF0ZSksZS5zY29wZSYmKGkuc2NvcGU9ZS5zY29wZS5qb2luKFwiIFwiKSk7Y29uc3Qgcz1PYmplY3Qua2V5cyhpKTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+cy5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7cy5qb2luKFwiJywgJ1wiKX0nYCk7cmV0dXJuIGk9ey4uLmksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc30scitcIj9cIisoMCxuLmdlbmVyYXRlUXVlcnlTdHJpbmcpKGkpfWFzeW5jIGdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChlLHQpe2NvbnN0e2NvZGU6cn09YXdhaXQgdGhpcy52YWxpZGF0ZVJlc3BvbnNlKGUse3N0YXRlOnQuc3RhdGV9KTtyZXR1cm4gdGhpcy5nZXRUb2tlbih7Y29kZTpyLHJlZGlyZWN0VXJpOnQucmVkaXJlY3RVcmksY29kZVZlcmlmaWVyOnQuY29kZVZlcmlmaWVyfSl9YXN5bmMgdmFsaWRhdGVSZXNwb25zZShlLHQpe3ZhciByO2NvbnN0IG49bmV3IFVSTChlKS5zZWFyY2hQYXJhbXM7aWYobi5oYXMoXCJlcnJvclwiKSl0aHJvdyBuZXcgaS5PQXV0aDJFcnJvcihudWxsIT09KHI9bi5nZXQoXCJlcnJvcl9kZXNjcmlwdGlvblwiKSkmJnZvaWQgMCE9PXI/cjpcIk9BdXRoMiBlcnJvclwiLG4uZ2V0KFwiZXJyb3JcIiksMCk7aWYoIW4uaGFzKFwiY29kZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSB1cmwgZGlkIG5vdCBjb250YWluIGEgY29kZSBwYXJhbWV0ZXIgJHtlfWApO2lmKHQuc3RhdGUmJnQuc3RhdGUhPT1uLmdldChcInN0YXRlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIFwic3RhdGVcIiBwYXJhbWV0ZXIgaW4gdGhlIHVybCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCB2YWx1ZSBvZiAke3Quc3RhdGV9YCk7cmV0dXJue2NvZGU6bi5nZXQoXCJjb2RlXCIpLHNjb3BlOm4uaGFzKFwic2NvcGVcIik/bi5nZXQoXCJzY29wZVwiKS5zcGxpdChcIiBcIik6dm9pZCAwfX1hc3luYyBnZXRUb2tlbihlKXtjb25zdCB0PXtncmFudF90eXBlOlwiYXV0aG9yaXphdGlvbl9jb2RlXCIsY29kZTplLmNvZGUscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV92ZXJpZmllcjplLmNvZGVWZXJpZmllcn07cmV0dXJuIHRoaXMuY2xpZW50LnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMuY2xpZW50LnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfX0sdC5nZW5lcmF0ZUNvZGVWZXJpZmllcj1hc3luYyBmdW5jdGlvbigpe2NvbnN0IGU9cygpO2lmKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoMzIpO3JldHVybiBlLmdldFJhbmRvbVZhbHVlcyh0KSxjKHQpfXtjb25zdCBlPXIoMjEyKTtyZXR1cm4gbmV3IFByb21pc2UoKCh0LHIpPT57ZS5yYW5kb21CeXRlcygzMiwoKGUsbik9PntlJiZyKGUpLHQobi50b1N0cmluZyhcImJhc2U2NHVybFwiKSl9KSl9KSl9fSx0LmdldENvZGVDaGFsbGVuZ2U9b30sNDQzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJFcnJvcj12b2lkIDA7Y2xhc3MgciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKGUsdCxyKXtzdXBlcihlKSx0aGlzLm9hdXRoMkNvZGU9dCx0aGlzLmh0dHBDb2RlPXJ9fXQuT0F1dGgyRXJyb3I9cn0sMTM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkZldGNoPXZvaWQgMCx0Lk9BdXRoMkZldGNoPWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMudG9rZW49bnVsbCx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGwsdGhpcy5hY3RpdmVSZWZyZXNoPW51bGwsdGhpcy5yZWZyZXNoVGltZXI9bnVsbCx2b2lkIDA9PT0obnVsbD09ZT92b2lkIDA6ZS5zY2hlZHVsZVJlZnJlc2gpJiYoZS5zY2hlZHVsZVJlZnJlc2g9ITApLHRoaXMub3B0aW9ucz1lLGUuZ2V0U3RvcmVkVG9rZW4mJih0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPShhc3luYygpPT57dGhpcy50b2tlbj1hd2FpdCBlLmdldFN0b3JlZFRva2VuKCksdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsfSkoKSksdGhpcy5zY2hlZHVsZVJlZnJlc2goKX1hc3luYyBmZXRjaChlLHQpe2NvbnN0IHI9bmV3IFJlcXVlc3QoZSx0KTtyZXR1cm4gdGhpcy5tdygpKHIsKGU9PmZldGNoKGUpKSl9bXcoKXtyZXR1cm4gYXN5bmMoZSx0KT0+e2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO2xldCBuPWUuY2xvbmUoKTtuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IpO2xldCBpPWF3YWl0IHQobik7aWYoIWkub2smJjQwMT09PWkuc3RhdHVzKXtjb25zdCByPWF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7bj1lLmNsb25lKCksbi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityLmFjY2Vzc1Rva2VuKSxpPWF3YWl0IHQobil9cmV0dXJuIGl9fWFzeW5jIGdldFRva2VuKCl7cmV0dXJuIHRoaXMudG9rZW4mJihudWxsPT09dGhpcy50b2tlbi5leHBpcmVzQXR8fHRoaXMudG9rZW4uZXhwaXJlc0F0PkRhdGUubm93KCkpP3RoaXMudG9rZW46dGhpcy5yZWZyZXNoVG9rZW4oKX1hc3luYyBnZXRBY2Nlc3NUb2tlbigpe3JldHVybiBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuLChhd2FpdCB0aGlzLmdldFRva2VuKCkpLmFjY2Vzc1Rva2VufWFzeW5jIHJlZnJlc2hUb2tlbigpe3ZhciBlLHQ7aWYodGhpcy5hY3RpdmVSZWZyZXNoKXJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7Y29uc3Qgcj10aGlzLnRva2VuO3RoaXMuYWN0aXZlUmVmcmVzaD0oYXN5bmMoKT0+e3ZhciBlLHQ7bGV0IG49bnVsbDt0cnl7KG51bGw9PXI/dm9pZCAwOnIucmVmcmVzaFRva2VuKSYmKG49YXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ocikpfWNhdGNoKGUpe2NvbnNvbGUud2FybihcIltvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZSdsbCB0cnkgcmVhdXRoZW50aWNhdGluZ1wiKX1pZihufHwobj1hd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKSksIW4pe2NvbnN0IHI9bmV3IEVycm9yKFwiVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWRcIik7dGhyb3cgbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykub25FcnJvcil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHJ9cmV0dXJuIG59KSgpO3RyeXtjb25zdCByPWF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtyZXR1cm4gdGhpcy50b2tlbj1yLG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLnN0b3JlVG9rZW4pfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpLHJ9Y2F0Y2goZSl7dGhyb3cgdGhpcy5vcHRpb25zLm9uRXJyb3ImJnRoaXMub3B0aW9ucy5vbkVycm9yKGUpLGV9ZmluYWxseXt0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbH19c2NoZWR1bGVSZWZyZXNoKCl7dmFyIGU7aWYoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpcmV0dXJuO2lmKHRoaXMucmVmcmVzaFRpbWVyJiYoY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKSx0aGlzLnJlZnJlc2hUaW1lcj1udWxsKSwhKG51bGw9PT0oZT10aGlzLnRva2VuKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5leHBpcmVzQXQpfHwhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pcmV0dXJuO2NvbnN0IHQ9dGhpcy50b2tlbi5leHBpcmVzQXQtRGF0ZS5ub3coKTt0PDEyZTR8fCh0aGlzLnJlZnJlc2hUaW1lcj1zZXRUaW1lb3V0KChhc3luYygpPT57dHJ5e2F3YWl0IHRoaXMucmVmcmVzaFRva2VuKCl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihcIltmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoXCIsZSl9fSksdC02ZTQpKX19fSwyMTI6KCk9Pnt9fSx0PXt9O2Z1bmN0aW9uIHIobil7dmFyIGk9dFtuXTtpZih2b2lkIDAhPT1pKXJldHVybiBpLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fX07cmV0dXJuIGVbbl0obyxvLmV4cG9ydHMsciksby5leHBvcnRzfXZhciBuPXt9O3JldHVybigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBlPW47T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5PQXV0aDJFcnJvcj1lLk9BdXRoMkZldGNoPWUuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9ZS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1lLk9BdXRoMkNsaWVudD12b2lkIDA7dmFyIHQ9cig5MzQpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQuT0F1dGgyQ2xpZW50fX0pO3ZhciBpPXIoNjE4KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJnZW5lcmF0ZUNvZGVWZXJpZmllclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLmdlbmVyYXRlQ29kZVZlcmlmaWVyfX0pO3ZhciBvPXIoMTMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRmV0Y2hcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gby5PQXV0aDJGZXRjaH19KTt2YXIgcz1yKDQ0Myk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJFcnJvclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzLk9BdXRoMkVycm9yfX0pfSkoKSxufSkoKSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYXV0aDItY2xpZW50Lm1pbi5qcy5tYXAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gPGF1dG8tZ2VuZXJhdGVkPlxyXG4vLyAgICAgR2VuZXJhdGVkIHVzaW5nIHRoZSBOU3dhZyB0b29sY2hhaW4gdjEzLjIwLjAuMCAoTkpzb25TY2hlbWEgdjEwLjkuMC4wIChOZXd0b25zb2Z0Lkpzb24gdjEzLjAuMC4wKSkgKGh0dHA6Ly9OU3dhZy5vcmcpXHJcbi8vIDwvYXV0by1nZW5lcmF0ZWQ+XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyogdHNsaW50OmRpc2FibGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuLy8gUmVTaGFycGVyIGRpc2FibGUgSW5jb25zaXN0ZW50TmFtaW5nXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcclxuICAgIHByaXZhdGUgaHR0cDogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9O1xyXG4gICAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQganNvblBhcnNlUmV2aXZlcjogKChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlVXJsPzogc3RyaW5nLCBodHRwPzogeyBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB9KSB7XHJcbiAgICAgICAgdGhpcy5odHRwID0gaHR0cCA/IGh0dHAgOiB3aW5kb3cgYXMgYW55O1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmwgIT09IHVuZGVmaW5lZCAmJiBiYXNlVXJsICE9PSBudWxsID8gYmFzZVVybCA6IFwiL2FwaS9lYmF5L3YxXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0IGFsbCBwcm9kdWN0c1xyXG4gICAgICogQHJldHVybiBPS1xyXG4gICAgICovXHJcbiAgICBnZXRBbGxQcm9kdWN0cygpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRBbGxQcm9kdWN0cyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0QWxsUHJvZHVjdHMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChQcm9kdWN0V2l0aElkLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxQcm9kdWN0V2l0aElkW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0NyZWF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NyZWF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gcmVzdWx0RGF0YTIwMCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0RGF0YTIwMCA6IDxhbnk+bnVsbDtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8c3RyaW5nPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZVByb2R1Y3QocHJvZHVjdDogUHJvZHVjdFdpdGhvdXRJZCwgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NVcGRhdGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NVcGRhdGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlbGV0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIERlbGV0ZWRcclxuICAgICAqL1xyXG4gICAgZGVsZXRlUHJvZHVjdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9XCI7XHJcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQgfHwgaWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2lkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7aWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgaWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0RlbGV0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0RlbGV0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQu9C+0YLQtVxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICB1cHNlcnRMb3RJbmZvKGxvdEluZm86IExvdEluZm8sIHByb2R1Y3RJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97cHJvZHVjdElkfS9sb3RzL1wiO1xyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgPT09IHVuZGVmaW5lZCB8fCBwcm9kdWN0SWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ3Byb2R1Y3RJZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie3Byb2R1Y3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBwcm9kdWN0SWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm8pO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NVcHNlcnRMb3RJbmZvKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NVcHNlcnRMb3RJbmZvKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJOb3RGb3VuZFwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LvQvtGC0LVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TG90SW5mbyhsb3RJZDogbnVtYmVyKTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvbG90cy97bG90SWR9L1wiO1xyXG4gICAgICAgIGlmIChsb3RJZCA9PT0gdW5kZWZpbmVkIHx8IGxvdElkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdsb3RJZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2xvdElkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGxvdElkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0TG90SW5mbyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0TG90SW5mbyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0MjAwID0gTG90SW5mb1dpdGhQcm9kdWN0SWQuZnJvbUpTKHJlc3VsdERhdGEyMDApO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJOb3RGb3VuZFwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPExvdEluZm9XaXRoUHJvZHVjdElkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INGD0YfRgtC10L3QvdGL0YUg0LvQvtGC0LDRhVxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRMb3RTdGF0ZXMobG90SWRzOiBudW1iZXJbXSk6IFByb21pc2U8TG90U3RhdGVbXT4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvbG90X3N0YXRlX3JlcXVlc3RzL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkobG90SWRzKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldExvdFN0YXRlcyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0TG90U3RhdGVzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TG90U3RhdGVbXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKExvdFN0YXRlLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxMb3RTdGF0ZVtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LTQsNC10YIg0L/QtdGA0LXRh9C10L3RjCDQstC+0LfQvNC+0LbQvdGL0YUg0YHQvtGB0YLQvtGP0L3QuNC5INC/0YDQvtC00LDQstCw0LXQvNC+0LPQviDRgtC+0LLQsNGA0LBcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TWFudWFsQ29uZGl0aW9uc0xpc3QoKTogUHJvbWlzZTxNYW51YWxDb25kaXRpb25bXT4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvbWFudWFsX2NvbmRpdGlvbnMvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0TWFudWFsQ29uZGl0aW9uc0xpc3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldE1hbnVhbENvbmRpdGlvbnNMaXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TWFudWFsQ29uZGl0aW9uW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChNYW51YWxDb25kaXRpb24uZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPE1hbnVhbENvbmRpdGlvbltdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0V2l0aG91dElkIGltcGxlbWVudHMgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJpZXMhOiBTZWFyY2hRdWVyeVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvZHVjdFdpdGhvdXRJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzIS5wdXNoKFNlYXJjaFF1ZXJ5LmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9kdWN0V2l0aG91dElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHJvZHVjdFdpdGhvdXRJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VhcmNoUXVlcmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNlYXJjaFF1ZXJpZXMpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzOiBTZWFyY2hRdWVyeVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aElkIHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJpZXMhOiBTZWFyY2hRdWVyeVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvZHVjdFdpdGhJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcIklkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIk5hbWVcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyEucHVzaChTZWFyY2hRdWVyeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRoSWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiSWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VhcmNoUXVlcmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNlYXJjaFF1ZXJpZXMpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcmllczogU2VhcmNoUXVlcnlbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNlYXJjaFF1ZXJ5IGltcGxlbWVudHMgSVNlYXJjaFF1ZXJ5IHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgcXVlcnkhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElTZWFyY2hRdWVyeSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJpZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5xdWVyeSA9IF9kYXRhW1wicXVlcnlcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogU2VhcmNoUXVlcnkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBTZWFyY2hRdWVyeSgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJpZFwiXSA9IHRoaXMuaWQ7XHJcbiAgICAgICAgZGF0YVtcInF1ZXJ5XCJdID0gdGhpcy5xdWVyeTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2VhcmNoUXVlcnkge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIHF1ZXJ5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RJbmZvV2l0aFByb2R1Y3RJZCBpbXBsZW1lbnRzIElMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICBwcm9kdWN0SWQhOiBzdHJpbmc7XHJcbiAgICBsb3RJbmZvITogTG90SW5mbztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm9XaXRoUHJvZHVjdElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJbmZvID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2R1Y3RJZCA9IF9kYXRhW1wicHJvZHVjdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvdEluZm8gPSBfZGF0YVtcImxvdEluZm9cIl0gPyBMb3RJbmZvLmZyb21KUyhfZGF0YVtcImxvdEluZm9cIl0pIDogbmV3IExvdEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm9XaXRoUHJvZHVjdElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInByb2R1Y3RJZFwiXSA9IHRoaXMucHJvZHVjdElkO1xyXG4gICAgICAgIGRhdGFbXCJsb3RJbmZvXCJdID0gdGhpcy5sb3RJbmZvID8gdGhpcy5sb3RJbmZvLnRvSlNPTigpIDogPGFueT51bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgIHByb2R1Y3RJZDogc3RyaW5nO1xyXG4gICAgbG90SW5mbzogTG90SW5mbztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdEluZm8gaW1wbGVtZW50cyBJTG90SW5mbyB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBwY3MhOiBudW1iZXI7XHJcbiAgICBwcmljZSE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlciE6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbiE6IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQhOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3RvcnkhOiBQdXJjaGFzZUluZm9bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucGNzID0gX2RhdGFbXCJwY3NcIl07XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nID0gX2RhdGFbXCJzaGlwcGluZ1wiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZ0FkZGl0aW9uYWwgPSBfZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uID0gX2RhdGFbXCJjb25kaXRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb24gPSBfZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGxlciA9IF9kYXRhW1wic2VsbGVyXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZWRJbiA9IF9kYXRhW1wibG9jYXRlZEluXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubWFudWFsQ29uZGl0aW9uSWQgPSBfZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5ID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSEucHVzaChQdXJjaGFzZUluZm8uZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wibmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wicGNzXCJdID0gdGhpcy5wY3M7XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdcIl0gPSB0aGlzLnNoaXBwaW5nO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl0gPSB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJzZWxsZXJcIl0gPSB0aGlzLnNlbGxlcjtcclxuICAgICAgICBkYXRhW1wibG9jYXRlZEluXCJdID0gdGhpcy5sb2NhdGVkSW47XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdGhpcy5tYW51YWxDb25kaXRpb25JZDtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnB1cmNoYXNlSGlzdG9yeSkpIHtcclxuICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMucHVyY2hhc2VIaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mbyB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgcGNzOiBudW1iZXI7XHJcbiAgICBwcmljZTogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmc/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWw/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlcjogc3RyaW5nO1xyXG4gICAgbG9jYXRlZEluOiBzdHJpbmc7XHJcbiAgICBpZ25vcmVUaGF0TG90OiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQ6IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeTogUHVyY2hhc2VJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQdXJjaGFzZUluZm8gaW1wbGVtZW50cyBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHkhOiBudW1iZXI7XHJcbiAgICBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHVyY2hhc2VJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gX2RhdGFbXCJxdWFudGl0eVwiXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gX2RhdGFbXCJkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFB1cmNoYXNlSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFB1cmNoYXNlSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInF1YW50aXR5XCJdID0gdGhpcy5xdWFudGl0eTtcclxuICAgICAgICBkYXRhW1wiZGF0ZVwiXSA9IHRoaXMuZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hbnVhbENvbmRpdGlvbiBpbXBsZW1lbnRzIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU1hbnVhbENvbmRpdGlvbikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJpZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTWFudWFsQ29uZGl0aW9uIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFudWFsQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RTdGF0ZSBpbXBsZW1lbnRzIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdFN0YXRlKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IF9kYXRhW1wibGFzdFVwZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RTdGF0ZSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdFN0YXRlKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibGFzdFVwZGF0ZVwiXSA9IHRoaXMubGFzdFVwZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90U3RhdGUge1xyXG4gICAgbG90SWQ6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IF9kYXRhW1widHlwZVwiXTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IF9kYXRhW1widGl0bGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gX2RhdGFbXCJzdGF0dXNcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsID0gX2RhdGFbXCJkZXRhaWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBfZGF0YVtcImluc3RhbmNlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGFic3RyYWN0IGNsYXNzICdQcm9ibGVtRGV0YWlsZWRJbmZvJyBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInR5cGVcIl0gPSB0aGlzLnR5cGU7XHJcbiAgICAgICAgZGF0YVtcInRpdGxlXCJdID0gdGhpcy50aXRsZTtcclxuICAgICAgICBkYXRhW1wic3RhdHVzXCJdID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgZGF0YVtcImRldGFpbFwiXSA9IHRoaXMuZGV0YWlsO1xyXG4gICAgICAgIGRhdGFbXCJpbnN0YW5jZVwiXSA9IHRoaXMuaW5zdGFuY2U7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9yczIgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlci5pbml0KF9kYXRhKTtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBfZGF0YVtcImVycm9yc1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMyIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3JzIGltcGxlbWVudHMgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJRXJyb3JzKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2RhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gX2RhdGFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogRXJyb3JzIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgRXJyb3JzKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHRoaXNbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMyIGltcGxlbWVudHMgSUVycm9yczIge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9yczIpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMyIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgRXJyb3JzMigpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9yczIge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHN0YXR1czogbnVtYmVyO1xyXG4gICAgcmVzcG9uc2U6IHN0cmluZztcclxuICAgIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9O1xyXG4gICAgcmVzdWx0OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaXNBcGlFeGNlcHRpb24gPSB0cnVlO1xyXG5cclxuICAgIHN0YXRpYyBpc0FwaUV4Y2VwdGlvbihvYmo6IGFueSk6IG9iaiBpcyBBcGlFeGNlcHRpb24ge1xyXG4gICAgICAgIHJldHVybiBvYmouaXNBcGlFeGNlcHRpb24gPT09IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRocm93RXhjZXB0aW9uKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ/OiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aHJvdyByZXN1bHQ7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhyb3cgbmV3IEFwaUV4Y2VwdGlvbihtZXNzYWdlLCBzdGF0dXMsIHJlc3BvbnNlLCBoZWFkZXJzLCBudWxsKTtcclxufSIsImltcG9ydCB7T0F1dGgyQ2xpZW50LCBPQXV0aDJUb2tlbn0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcblxyXG5cclxudHlwZSBPQXV0aDJGZXRjaE9wdGlvbnMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlcmVuY2UgdG8gT0F1dGgyIGNsaWVudC5cclxuICAgICAqL1xyXG4gICAgY2xpZW50OiBPQXV0aDJDbGllbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBpbXBsZW1lbnRpbmcgdGhpcyBmdW5jdGlvbi5cclxuICAgICAqIGl0J3MgcHVycG9zZSBpcyB0byBzdXBwbHkgdGhlICdpbml0aWFsJyBvYXV0aDIgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBgbnVsbGAgdG8gZmFpbCB0aGUgcHJvY2Vzcy5cclxuICAgICAqL1xyXG4gICAgZ2V0TmV3VG9rZW4oKTogT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgc2V0LCB3aWxsIGJlIGNhbGxlZCBpZiBhdXRoZW50aWNhdGlvbiBmYXRhbGx5IGZhaWxlZC5cclxuICAgICAqL1xyXG4gICAgb25FcnJvcj86IChlcnI6IEVycm9yKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGFjdGl2ZSB0b2tlbiBjaGFuZ2VzLiBVc2luZyB0aGlzIGlzXHJcbiAgICAgKiBvcHRpb25hbCwgYnV0IGl0IG1heSBiZSB1c2VkIHRvIChmb3IgZXhhbXBsZSkgcHV0IHRoZSB0b2tlbiBpbiBvZmYtbGluZVxyXG4gICAgICogc3RvcmFnZSBmb3IgbGF0ZXIgdXNhZ2UuXHJcbiAgICAgKi9cclxuICAgIHN0b3JlVG9rZW4/OiAodG9rZW46IE9BdXRoMlRva2VuKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxzbyBhbiBvcHRpb25hbCBmZWF0dXJlLiBJbXBsZW1lbnQgdGhpcyBpZiB5b3Ugd2FudCB0aGUgd3JhcHBlciB0byB0cnkgYVxyXG4gICAgICogc3RvcmVkIHRva2VuIGJlZm9yZSBhdHRlbXB0aW5nIGEgZnVsbCByZS1hdXRoZW50aWNhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIG51bGwgaWYgdGhlcmUgd2FzIG5vIHRva2VuLlxyXG4gICAgICovXHJcbiAgICBnZXRTdG9yZWRUb2tlbj86ICgpID0+IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBzY2hlZHVsZSB0b2tlbiByZWZyZXNoLlxyXG4gICAgICpcclxuICAgICAqIENlcnRhaW4gZXhlY3V0aW9uIGVudmlyb25tZW50cywgZS5nLiBSZWFjdCBOYXRpdmUsIGRvIG5vdCBoYW5kbGUgc2NoZWR1bGVkXHJcbiAgICAgKiB0YXNrcyB3aXRoIHNldFRpbWVvdXQoKSBpbiBhIGdyYWNlZnVsIG9yIHByZWRpY3RhYmxlIGZhc2hpb24uIFRoZSBkZWZhdWx0XHJcbiAgICAgKiBiZWhhdmlvciBpcyB0byBzY2hlZHVsZSByZWZyZXNoLiBTZXQgdGhpcyB0byBmYWxzZSB0byBkaXNhYmxlIHNjaGVkdWxpbmcuXHJcbiAgICAgKi9cclxuICAgIHNjaGVkdWxlUmVmcmVzaD86IGJvb2xlYW47XHJcblxyXG4gICAgZmV0Y2g/OiB0eXBlb2YgZmV0Y2g7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGZXRjaFdyYXBwZXJDdXN0b20ge1xyXG5cclxuICAgIHByaXZhdGUgb3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VycmVudCBhY3RpdmUgdG9rZW4gKGlmIGFueSlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0b2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSB1c2VyIGhhZCBhIHN0b3JlZFRva2VuLCB0aGUgcHJvY2VzcyB0byBmZXRjaCBpdFxyXG4gICAgICogbWF5IGJlIGFzeW5jLiBXZSBrZWVwIHRyYWNrIG9mIHRoaXMgcHJvY2VzcyBpbiB0aGlzXHJcbiAgICAgKiBwcm9taXNlLCBzbyBpdCBtYXkgYmUgYXdhaXRlZCB0byBhdm9pZCByYWNlIGNvbmRpdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQXMgc29vbiBhcyB0aGlzIHByb21pc2UgcmVzb2x2ZXMsIHRoaXMgcHJvcGVydHkgZ2V0IG51bGxlZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVHZXRTdG9yZWRUb2tlbjogbnVsbCB8IFByb21pc2U8dm9pZD4gPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucykge1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucz8uc2NoZWR1bGVSZWZyZXNoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zY2hlZHVsZVJlZnJlc2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdldFN0b3JlZFRva2VuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IGF3YWl0IG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4hKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gbnVsbDtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb2VzIGEgZmV0Y2ggcmVxdWVzdCBhbmQgYWRkcyBhIEJlYXJlciAvIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgdGhpcyBmdW5jdGlvbiBhdHRlbXB0cyB0byBmZXRjaCBpdFxyXG4gICAgICogZmlyc3QuIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgYWxtb3N0IGV4cGlyaW5nLCB0aGlzIGZ1bmN0aW9uIG1pZ2h0IGF0dGVtcHRcclxuICAgICAqIHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZldGNoKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtcclxuXHJcbiAgICAgICAgaWYgKGluaXQuaGVhZGVycykge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzID0ge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VufVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Rva2VuID0gYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIG5ld1Rva2VuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBjdXJyZW50IHRva2VuIGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoZXJlIHJlc3VsdCBvYmplY3Qgd2lsbCBoYXZlOlxyXG4gICAgICogICAqIGFjY2Vzc1Rva2VuXHJcbiAgICAgKiAgICogZXhwaXJlc0F0IC0gd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgbnVsbC5cclxuICAgICAqICAgKiByZWZyZXNoVG9rZW4gLSBtYXkgYmUgbnVsbFxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhdHRlbXB0IHRvIGF1dG9tYXRpY2FsbHkgcmVmcmVzaCBpZiBzdGFsZS5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0VG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi5leHBpcmVzQXQgPT09IG51bGwgfHwgdGhpcy50b2tlbi5leHBpcmVzQXQgPiBEYXRlLm5vdygpKSkge1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgdG9rZW4gaXMgc3RpbGwgdmFsaWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGN1cnJlbnQgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgaXQgd2lsbCBhdHRlbXB0IHRvIGZldGNoIGl0LlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBleHBpcmluZywgaXQgd2lsbCBhdHRlbXB0IHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEFjY2Vzc1Rva2VuKCk6IFByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBnZXRTdG9yZWRUb2tlbiBmaW5pc2hlZC5cclxuICAgICAgICBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gdG9rZW4uYWNjZXNzVG9rZW47XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogS2VlcGluZyB0cmFjayBvZiBhbiBhY3RpdmUgcmVmcmVzaFRva2VuIG9wZXJhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHdpbGwgYWxsb3cgdXMgdG8gZW5zdXJlIG9ubHkgMSBzdWNoIG9wZXJhdGlvbiBoYXBwZW5zIGF0IGFueVxyXG4gICAgICogZ2l2ZW4gdGltZS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZWZyZXNoOiBQcm9taXNlPE9BdXRoMlRva2VuPiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yY2VzIGFuIGFjY2VzcyB0b2tlbiByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2hUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIGN1cnJlbnRseSBhbHJlYWR5IGRvaW5nIHRoaXMgb3BlcmF0aW9uLFxyXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgZG8gaXQgdHdpY2UgaW4gcGFyYWxsZWwuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGRUb2tlbiA9IHRoaXMudG9rZW47XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gKGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdUb2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkVG9rZW4/LnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhZCBhIHJlZnJlc2ggdG9rZW4sIGxldHMgc2VlIGlmIHdlIGNhbiB1c2UgaXQhXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihvbGRUb2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2VcXCdsbCB0cnkgcmVhdXRoZW50aWNhdGluZycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcj8uKGVycik7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Rva2VuO1xyXG5cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcmVUb2tlbj8uKHRva2VuKTtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGNsZWFyIHRoZSBjdXJyZW50IHJlZnJlc2ggb3BlcmF0aW9uLlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaW1lciB0cmlnZ2VyIGZvciB0aGUgbmV4dCBhdXRvbWF0ZWQgcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlZnJlc2hUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNjaGVkdWxlUmVmcmVzaCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWZyZXNoVGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuPy5leHBpcmVzQXQgfHwgIXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGtub3cgd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgZG9uJ3QgaGF2ZSBhIHJlZnJlc2hfdG9rZW4sIGRvbid0IGJvdGhlci5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gdGhpcy50b2tlbi5leHBpcmVzQXQgLSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICAvLyBXZSBvbmx5IHNjaGVkdWxlIHRoaXMgZXZlbnQgaWYgaXQgaGFwcGVucyBtb3JlIHRoYW4gMiBtaW51dGVzIGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgaWYgKGV4cGlyZXNJbiA8IDEyMCAqIDEwMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2NoZWR1bGUgMSBtaW51dGUgYmVmb3JlIGV4cGlyeVxyXG4gICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaCcsIGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBleHBpcmVzSW4gLSA2MCAqIDEwMDApO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENsaWVudCxcclxuICAgIExvdEluZm8sXHJcbiAgICBMb3RJbmZvV2l0aFByb2R1Y3RJZCwgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLFxyXG4gICAgUHVyY2hhc2VJbmZvLCBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mb1xyXG59IGZyb20gXCIuL0ViYXlDbGllbnQvRWJheUNsaWVudFwiXHJcblxyXG5pbXBvcnQge2dlbmVyYXRlQ29kZVZlcmlmaWVyLCBPQXV0aDJDbGllbnR9IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5pbXBvcnQge0ZldGNoV3JhcHBlckN1c3RvbX0gZnJvbSBcIi4vRmV0Y2hXcmFwcGVyQ3VzdG9tXCI7XHJcblxyXG5jb25zdCBpZ25vcmVUaGF0TG90RmllbGROYW1lID0gXCJpZ25vcmVUaGF0TG90XCI7XHJcbmNvbnN0IG1hbnVhbENvbmRpdGlvbklkRmllbGROYW1lID0gXCJtYW51YWxDb25kaXRpb25JZFwiO1xyXG5jb25zdCBwcm9kdWN0RmllbGROYW1lID0gXCJwcm9kdWN0SWRcIjtcclxuY29uc3QgcGNzRmllbGROYW1lID0gXCJwY3NcIjtcclxuXHJcbmNvbnN0IHBhbmVsQ2xhc3MgPSBcInBhbmVsLWRpdlwiO1xyXG5jb25zdCBmb3JtSWQgPSBcInByb2R1Y3QtZm9ybS1pZFwiXHJcbmNvbnN0IGVycm9yRWxlbWVudElkID0gXCJlcnJvckVsZW1lbnRcIlxyXG5jb25zdCBzdWJtaXRJZCA9IFwic3VibWl0XCJcclxuLy9jb25zdCBiYWNrZW5kVXJsID0gXCJodHRwczovL2xvY2FsaG9zdDo3MDk1L1wiXHJcbmNvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vMTc4LjIwOC42NS4xMDA6MTc0NDMvXCJcclxuY29uc3QgYmFzZUFwaVVybCA9IGAke2JhY2tlbmRVcmx9YXBpL2ViYXkvdjFgO1xyXG5jb25zdCBhdXRoUmVkaXJlY3RVcmwgPSBcImh0dHBzOi8vd3d3LmViYXkuY29tL1wiXHJcbmNvbnN0IG5vdFNldFZhbHVlID0gXCJub3RTZXRcIlxyXG5jb25zdCBsaWdodEdyZWVuQ29sb3IgPSBcIiNlY2ZmZWNcIlxyXG5jb25zdCBsaWdodFBpbmtDb2xvciA9IFwibGlnaHRwaW5rXCJcclxuY29uc3QgbGlnaHRZZWxsb3dDb2xvciA9IFwiI2UwZTA3ZlwiXHJcblxyXG5cclxuXHJcbmNvbnN0IGxvdEluZm8gPSBuZXcgTG90SW5mbygpO1xyXG5sZXQgX3NlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkO1xyXG5cclxuLy8gZmV0Y2gg0YfQtdGA0LXQtyBiYWNrZ3JvdW5kIHNjcmlwdCwg0L/QviDQtNGA0YPQs9C+0LzRgyDQvdC1INGA0LDQsdC+0YLQsNC10YJcclxuZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZShpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7aW5wdXQsIGluaXR9LCBtZXNzYWdlUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBbcmVzcG9uc2UsIGVycm9yXSA9IG1lc3NhZ2VSZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHVuZGVmaW5lZCBvbiBhIDIwNCAtIE5vIENvbnRlbnRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXNwb25zZS5ib2R5ID8gbmV3IEJsb2IoW3Jlc3BvbnNlLmJvZHldKSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiByZXNwb25zZS5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGV4dHJhY3RQcmljZShwcmljZSkge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBwcmljZS5tYXRjaCgvKFxcRCspKFxcZCsoPzpbLC5dXFxkKyk/KS8pXHJcbiAgICBpZiAobWF0Y2hlc1sxXSAhPT0gXCJVUyAkXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VTICQgcHJpY2UgZXhwZWN0ZWQsIGJ1dCB3YXMnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUZsb2F0KG1hdGNoZXNbMl0ucmVwbGFjZSgnLCcsICcuJykpXHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgc3R5bGVzID0gYFxyXG4gICAgLiR7cGFuZWxDbGFzc30ge1xyXG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgICBwYWRkaW5nOiAxNXB4O1xyXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCAjMDAwMGNjO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICBjb2xvcjogIzAwMDBjYztcclxuICAgICAgcG9zaXRpb246Zml4ZWQ7XHJcbiAgICAgIHotaW5kZXg6MTAwO1xyXG4gICAgICBsZWZ0OjElO1xyXG4gICAgICBib3R0b206NSU7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbCB7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgICBmbG9hdDogbGVmdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gaW5wdXQge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHNlbGVjdCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWw6YWZ0ZXIgeyBjb250ZW50OiBcIjogXCIgfVxyXG5gXHJcblxyXG4gICAgbGV0IHN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIilcclxuICAgIHN0eWxlU2hlZXQuaW5uZXJUZXh0ID0gc3R5bGVzXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChzdHlsZVNoZWV0KVxyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3MpO1xyXG5cclxuXHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKVxyXG4gICAgZm9ybS5pZCA9IGZvcm1JZFxyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IGRvbWFpbiA9IGxvY2F0aW9uLmhvc3RuYW1lO1xyXG5cclxuICAgIGxldCBoaXN0b3J5QnV0dG9uSHJlZiA9IGBodHRwczovLyR7ZG9tYWlufS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIC8vIGxhbmd1YWdlPUhUTUxcclxuICAgIGZvcm0uaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxhIGhyZWY9XCIke2hpc3RvcnlCdXR0b25IcmVmfVwiIHRhcmdldD1cIl9ibGFua1wiPtCY0YHRgtC+0YDQuNGPINC/0YDQvtC00LDQtiDQu9C+0YLQsDwvYT4gXHJcbiAgICAgICAgPGJyPtCR0Y3QutC10L3QtDogPGEgaHJlZj1cIiR7YmFja2VuZFVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2JhY2tlbmRVcmx9PC9hPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIj7QmNCz0L3QvtGA0LjRgNC+0LLQsNGC0Ywg0LvQvtGCPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCIgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPtCi0L7QstCw0YA8L2xhYmVsPlxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIiBpZD1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPtCS0YvQsdC10YDQuNGC0LUg0YLQvtCy0LDRgDwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtwY3NGaWVsZE5hbWV9XCI+UENTPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3Bjc0ZpZWxkTmFtZX1cIiB0eXBlPVwibnVtYmVyXCIgbmFtZT1cIiR7cGNzRmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCI+0KHQvtGB0YLQvtGP0L3QuNC1PC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiIGlkPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPtCS0YvQsdC10YDQuNGC0LUg0KHQvtGB0YLQvtGP0L3QuNC1PC9vcHRpb24+XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJjb2xvcjogcmVkO1wiIGlkPVwiJHtlcnJvckVsZW1lbnRJZH1cIj48L2Rpdj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtzdWJtaXRJZH1cIiB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTYXZlXCIgZGlzYWJsZWQvPlxyXG4gICAgYDtcclxuXHJcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGV2ZW50OiBTdWJtaXRFdmVudCkge1xyXG4gICAgICAgIGF3YWl0IGhhbmRsZVN1Ym1pdChldmVudCwgY2xpZW50KVxyXG4gICAgfSk7XHJcblxyXG4gICAgZGl2LmFwcGVuZENoaWxkKGZvcm0pXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTdWJtaXQoZXZlbnQ6IFN1Ym1pdEV2ZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+ZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgbGV0IGlnbm9yZVRoYXRMb3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnaWdub3JlVGhhdExvdCcpIHtcclxuICAgICAgICAgICAgICAgIGlnbm9yZVRoYXRMb3QgPSB0cnVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb3RJbmZvW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb3RJbmZvWydpZ25vcmVUaGF0TG90J10gPSBpZ25vcmVUaGF0TG90O1xyXG5cclxuICAgICAgICBpZiAoaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnBjcyA9IDFcclxuICAgICAgICAgICAgbG90SW5mby5tYW51YWxDb25kaXRpb25JZCA9IG5vdFNldFZhbHVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgdG8gYmFja2VuZDogXCIgKyBKU09OLnN0cmluZ2lmeShsb3RJbmZvKSlcclxuXHJcblxyXG4gICAgICAgIGF3YWl0IGNsaWVudC51cHNlcnRMb3RJbmZvKGxvdEluZm8sIGRhdGEuZ2V0KCdwcm9kdWN0SWQnKS50b1N0cmluZygpKVxyXG5cclxuICAgICAgICBhd2FpdCBwcm9kdWN0UGFnZShjbGllbnQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dFcnJvcihlcnJvcilcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93czogSFRNTFRhYmxlUm93RWxlbWVudFtdLCByZXN1bHQ6IFB1cmNoYXNlSW5mb0lubmVyW10pIHtcclxuICAgIGZvciAobGV0IGZpeGVkUHJpY2VSb3cgb2YgZml4ZWRQcmljZVJvd3MpIHtcclxuICAgICAgICBsZXQgY29sdW1ucyA9IFsuLi5maXhlZFByaWNlUm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHByaWNlID0gY29sdW1uc1sxXVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgPT09IFwiRXhwaXJlZFwiIHx8IHByaWNlID09PSBcIkRlY2xpbmVkXCIpIHtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcmljZSAhPT0gXCJTb2xkIGFzIGEgc3BlY2lhbCBvZmZlclwiICYmIHByaWNlICE9PSBcIkNvdW50ZXItb2ZmZXJlZFwiICYmIHByaWNlICE9PSBcIkFjY2VwdGVkXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pLCBleHRyYWN0UHJpY2UocHJpY2UpKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgUHVyY2hhc2VJbmZvSW5uZXIocGFyc2VJbnQoY29sdW1uc1syXSksIHBhcnNlRGF0ZShjb2x1bW5zWzNdKSkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQdXJjaGFzZUluZm9Jbm5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihxdWFudGl0eTogbnVtYmVyLCBkYXRlOiBEYXRlLCBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGVcclxuICAgICAgICB0aGlzLnByaWNlID0gcHJpY2VcclxuICAgIH1cclxuXHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgcHJpY2U6IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRhdGU6IERhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVTdHJpbmcpOiBEYXRlIHtcclxuICAgIGxldCBtYXRjaGVzID0gZGF0ZVN0cmluZy5tYXRjaCgvKFxcZCtcXHNbQS16XStcXHNcXGQrKVxcc2F0XFxzKFxcZCspOihcXGQrKTooXFxkKykoYW18cG0pXFxzKFtBLXpdKykvKVxyXG5cclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShtYXRjaGVzWzFdICsgJyAwMDowMDowMC4wMDBaJykpXHJcblxyXG4gICAgZGF0ZS5zZXRVVENIb3VycyhwYXJzZUludChtYXRjaGVzWzJdKSk7XHJcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMocGFyc2VJbnQobWF0Y2hlc1szXSkpO1xyXG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKHBhcnNlSW50KG1hdGNoZXNbNF0pKTtcclxuXHJcbiAgICBpZiAobWF0Y2hlc1s1XSA9PT0gXCJwbVwiICYmIGRhdGUuZ2V0VVRDSG91cnMoKSAhPT0gMTIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSArIDEyKTtcclxuICAgIH1cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcImFtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpID09PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMTIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaGVzWzZdID09PSBcIk1TS1wiKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0aW1lem9uZSBcIiArIG1hdGNoZXNbNl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTb2xkSXRlbXNQYWdlKHRleHQ6IHN0cmluZyk6IFB1cmNoYXNlSW5mb1tdIHtcclxuICAgIGxldCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHRleHQsIFwidGV4dC9odG1sXCIpXHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IG5ldyBBcnJheTxQdXJjaGFzZUluZm9Jbm5lcj4oKTtcclxuICAgIGxldCBmaXhlZFByaWNlQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2LmZpeGVkLXByaWNlIHRib2R5JylcclxuICAgIGlmIChmaXhlZFByaWNlQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgZml4ZWRQcmljZVJvd3MgPSBbLi4uZml4ZWRQcmljZUJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb2ZmZXJCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYub2ZmZXIgdGJvZHknKVxyXG4gICAgaWYgKG9mZmVyQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgb2ZmZXJSb3dzID0gWy4uLm9mZmVyQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KG9mZmVyUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gYi5kYXRlLmdldFRpbWUoKSAtIGEuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICB9KS5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFB1cmNoYXNlSW5mbyh7XHJcbiAgICAgICAgICAgIGRhdGU6IHguZGF0ZS50b0lTT1N0cmluZygpLCBxdWFudGl0eTogeC5xdWFudGl0eSwgcHJpY2U6IHgucHJpY2VcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxJZCgpIHtcclxuICAgIGxvdEluZm8ubG90SWQgPSBwYXJzZUludChsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcmljZSgpIHtcclxuICAgIGxvdEluZm8ucHJpY2UgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXByaWNlLXByaW1hcnkgc3BhbicpKS5pbm5lclRleHQpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxOYW1lKCkge1xyXG4gICAgbG90SW5mby5uYW1lID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJy52aW0gaDEnKSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxTZWxsZXIoKSB7XHJcbiAgICBsb3RJbmZvLnNlbGxlciA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1zZWxsZXJjYXJkLWF0Zl9faW5mb19fYWJvdXQtc2VsbGVyIGEnKSkuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbENvbmRpdGlvbigpIHtcclxuICAgIGxvdEluZm8uY29uZGl0aW9uID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLXRleHQgc3Bhbi51eC10ZXh0c3BhbnMnKSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbigpIHtcclxuICAgIGxldCBjb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYueC1pdGVtLWNvbmRpdGlvbi1kZXNjJylcclxuICAgIGlmIChjb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQgIT0gbnVsbCkge1xyXG4gICAgICAgIGxvdEluZm8uY29uZGl0aW9uRGVzY3JpcHRpb24gPSAoPEhUTUxFbGVtZW50PmNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCkuaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCfigJwnLCAnJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnScsICcnKVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsU2hpcHBpbmcoKSB7XHJcbiAgICBsZXQgc2hpcHBpbmdEaXYgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi5kLXNoaXBwaW5nLW1heHZpZXcnKVxyXG4gICAgbGV0IHNoaXBwaW5nUmF0ZXNBdmFpbGFibGUgPSBzaGlwcGluZ0Rpdi5xdWVyeVNlbGVjdG9yKCdkaXYudXgtbGF5b3V0LXNlY3Rpb25fX3RleHR1YWwtZGlzcGxheS0tYXNrU2VsbGVyJykgPT09IG51bGxcclxuICAgIGlmIChzaGlwcGluZ1JhdGVzQXZhaWxhYmxlKSB7XHJcbiAgICAgICAgbGV0IHNoaXBwaW5nVGFibGUgPSBzaGlwcGluZ0Rpdi5xdWVyeVNlbGVjdG9yKCd0YWJsZS51eC10YWJsZS1zZWN0aW9uLXdpdGgtaGludHMtLXNoaXBwaW5nVGFibGUnKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkZWxpdmVyeUNvbHVtbnNIZWFkZXIgPSBbLi4uc2hpcHBpbmdUYWJsZS5xdWVyeVNlbGVjdG9yKCd0aGVhZCcpXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCd0aCcpXVxyXG4gICAgICAgIGxldCBkZWxpdmVyeUNvbHVtbnNWYWx1ZXMgPSBbLi4uc2hpcHBpbmdUYWJsZS5xdWVyeVNlbGVjdG9yKCd0Ym9keScpXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCd0cicpXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXVxyXG5cclxuICAgICAgICBsZXQgc2hpcHBpbmdNYXh2aWV3VmFsdWVzID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBkZWxpdmVyeUNvbHVtbnNIZWFkZXJbaV0uaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIHNoaXBwaW5nTWF4dmlld1ZhbHVlc1trZXldID0gZGVsaXZlcnlDb2x1bW5zVmFsdWVzW2ldLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5pbm5lclRleHRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ1RvJ10gIT09ICdHZXJtYW55Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NoaXBwaW5nIGNvdW50cnkgbXVzdCBiZSBHZXJtYW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2hpcHBpbmdWYWx1ZSA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snU2hpcHBpbmcgYW5kIGhhbmRsaW5nJ11cclxuXHJcbiAgICAgICAgaWYgKHNoaXBwaW5nVmFsdWUgIT09ICdGcmVlIHNoaXBwaW5nJykge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gZXh0cmFjdFByaWNlKHNoaXBwaW5nVmFsdWUpXHJcblxyXG4gICAgICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzLmhhc093blByb3BlcnR5KCdFYWNoIGFkZGl0aW9uYWwgaXRlbScpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVhY2hBZGRpdGlvbmFsID0gc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydFYWNoIGFkZGl0aW9uYWwgaXRlbSddXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVhY2hBZGRpdGlvbmFsICE9PSBcIkZyZWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gZXh0cmFjdFByaWNlKGVhY2hBZGRpdGlvbmFsKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZyA9IDA7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxMb2NhdGVkSW4oKSB7XHJcbiAgICBsZXQgbWF0Y2ggPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LmQtc2hpcHBpbmctbWludmlldycpKS5pbm5lclRleHQubWF0Y2goL0xvY2F0ZWRcXHNpbjpcXHMoLispLylcclxuICAgIGlmIChtYXRjaCAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxvdEluZm8ubG9jYXRlZEluID0gbWF0Y2hbMV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG90SW5mby5sb2NhdGVkSW4gPSBcIlVua25vd25cIlxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgZGVzY3JpcHRpb25VcmwgPSAoPEhUTUxJRnJhbWVFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnI2Rlc2NfaWZyJykpLnNyY1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShkZXNjcmlwdGlvblVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgbG90SW5mby5kZXNjcmlwdGlvbiA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHVyY2hhc2VIaXN0b3J5KCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IHB1cmNoYXNlSGlzdG9yeVVybCA9IGBodHRwczovLyR7bG9jYXRpb24uaG9zdG5hbWV9L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShwdXJjaGFzZUhpc3RvcnlVcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICBsb3RJbmZvLnB1cmNoYXNlSGlzdG9yeSA9IHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWFyY2hRdWVyeSgpIDogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmIChkb2N1bWVudC5yZWZlcnJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgVVJMKGRvY3VtZW50LnJlZmVycmVyKS5zZWFyY2hQYXJhbXM/LmdldCgnX25rdycpPy50cmltKCk/LnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcm9kdWN0KHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgY2xpZW50OiBDbGllbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcHJvZHVjdEZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBwcm9kdWN0RmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgcHJvZHVjdElkID0gc2VydmVyTG90SW5mbz8ucHJvZHVjdElkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuICAgIGxldCBzZWFyY2hRdWVyeSA9IGdldFNlYXJjaFF1ZXJ5KCk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgY2xpZW50LmdldEFsbFByb2R1Y3RzKClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gcHJvZHVjdHNbaV0uaWQ7XHJcbiAgICAgICAgb3B0LmlubmVySFRNTCA9IHByb2R1Y3RzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAocHJvZHVjdElkID09PSBwcm9kdWN0c1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RzW2ldLnNlYXJjaFF1ZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFF1ZXJ5ID09PSB4LnF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvZHVjdEZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBjbGllbnQ6IENsaWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBtYW51YWxDb25kaXRpb25GaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgbWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25JZCA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/Lm1hbnVhbENvbmRpdGlvbklkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9ucyA9IGF3YWl0IGNsaWVudC5nZXRNYW51YWxDb25kaXRpb25zTGlzdCgpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hbnVhbENvbmRpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gbWFudWFsQ29uZGl0aW9uc1tpXS5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkID09PSBtYW51YWxDb25kaXRpb25zW2ldLmlkLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hbnVhbENvbmRpdGlvbkZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlckxvdEluZm8oY2xpZW50OiBDbGllbnQpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIF9zZXJ2ZXJMb3RJbmZvID0gYXdhaXQgY2xpZW50LmdldExvdEluZm8obG90SW5mby5sb3RJZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQY3MocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHBjc0ZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIHBjc0ZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/LnBjc1xyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGNzRmllbGQudmFsdWUgPSBzZXJ2ZXJQY3MudG9TdHJpbmcoKVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsSWdub3JlVGhhdExvdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgaWdub3JlVGhhdExvdEZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5pZ25vcmVUaGF0TG90XHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZ25vcmVUaGF0TG90RmllbGQuY2hlY2tlZCA9IHNlcnZlclBjc1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29tcGFyZUxvdEluZm9zKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgaWYgKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGxldCBzZXJ2ZXJMb3RJbmZvSnNvbiA9IHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkLmxvdEluZm8udG9KU09OKClcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wiZGVzY3JpcHRpb25cIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnkgPSBzZXJ2ZXJMb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXVxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBsb3RJbmZvSnNvbiA9IGxvdEluZm8udG9KU09OKClcclxuICAgIGxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wiZGVzY3JpcHRpb25cIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5ID0gbG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl07XHJcbiAgICBsb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXSA9IHVuZGVmaW5lZFxyXG4gICAgXHJcbiAgICBsZXQgc2VydmVyTG90SW5mb0pzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXJ2ZXJMb3RJbmZvSnNvbilcclxuICAgIGxldCBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobG90SW5mb0pzb24pXHJcbiAgICBsZXQgc2VydmVyUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHNlcnZlclB1cmNoYXNlSGlzdG9yeSlcclxuICAgIGxldCBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm9QdXJjaGFzZUhpc3RvcnkpXHJcblxyXG4gICAgbGV0IHBhbmVsID0gPEhUTUxEaXZFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZyA9PT0gY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlcnZlclB1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpXHJcbiAgICAgICAgY29uc29sZS5sb2cobG90SW5mb1B1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpXHJcbiAgICAgICAgaWYgKF9zZXJ2ZXJMb3RJbmZvLmxvdEluZm8uaWdub3JlVGhhdExvdCA9PT0gdHJ1ZSB8fCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID09PSBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZykge1xyXG4gICAgICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRHcmVlbkNvbG9yfTtgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodFllbGxvd0NvbG9yfTtgXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRQaW5rQ29sb3J9O2BcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGZyb20gc2VydmVyOiBcIiArIHNlcnZlckxvdEluZm9Kc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50UGFnZTogXCIgKyBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXREYXRhRnJvbVBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcylcclxuXHJcbiAgICBmaWxsSWQoKTtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHJpY2UoKSxcclxuICAgICAgICBmaWxsTmFtZSgpLFxyXG4gICAgICAgIGZpbGxTZWxsZXIoKSxcclxuICAgICAgICBmaWxsQ29uZGl0aW9uKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgZmlsbExvY2F0ZWRJbigpLFxyXG4gICAgICAgIGZpbGxEZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGZpbGxQdXJjaGFzZUhpc3RvcnkoKSxcclxuICAgICAgICBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudClcclxuICAgIF0pXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFByb2R1Y3QocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxQY3MocGFuZWwsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsSWdub3JlVGhhdExvdChwYW5lbCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxTaGlwcGluZygpLFxyXG4gICAgXSk7XHJcbiAgICBcclxuICAgIGF3YWl0IGNvbXBhcmVMb3RJbmZvcyhfc2VydmVyTG90SW5mbyk7XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBhZGRQYW5lbChjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IGJvZHlFbGVtZW50ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdib2R5Jyk7XHJcbiAgICBpZiAoYm9keUVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgZXhpc3RpbmdQYW5lbCA9IGJvZHlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcyk7XHJcbiAgICAgICAgaWYgKCFleGlzdGluZ1BhbmVsKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yOiBFcnJvcikge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQpXHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uRXJyb3IgPSA8VmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8+ZXJyb3JcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IFwi0J7RiNC40LHQutCwINCy0LDQu9C40LTQsNGG0LjQuDogXCIgKyBKU09OLnN0cmluZ2lmeSh2YWxpZGF0aW9uRXJyb3IuZXJyb3JzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IGVycm9yLnN0YWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yRGl2LmFwcGVuZENoaWxkKHNwYW4pXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGVuYWJsZVN1Ym1pdEJ1dHRvbigpIHtcclxuICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcjJyArIHN1Ym1pdElkKSkuZGlzYWJsZWQgPSBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQ6IE9BdXRoMkNsaWVudCk6IEZldGNoV3JhcHBlckN1c3RvbSB7XHJcbiAgICByZXR1cm4gbmV3IEZldGNoV3JhcHBlckN1c3RvbSh7XHJcbiAgICAgICAgY2xpZW50OiBvQXV0aDJDbGllbnQsXHJcbiAgICAgICAgZ2V0TmV3VG9rZW46IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldEF1dGhvcml6ZVVyaSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsnRWJheS5TZXJ2ZXJBUEknXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTdG9yZWRUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYmFja2VuZFVybCAhPT0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJiYWNrZW5kX3VybFwiXSkpLmJhY2tlbmRfdXJsKSAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1widG9rZW5fc3RvcmVcIl0pKS50b2tlbl9zdG9yZTtcclxuICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gSlNPTi5wYXJzZSh0b2tlbik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2g6IGZldGNoUmVzb3VyY2VcclxuICAgIH0pXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhpZGVFcnJvcnMoKSB7XHJcbiAgICBsZXQgZXJyb3JEaXYgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcyArICcgIycgKyBlcnJvckVsZW1lbnRJZClcclxuICAgIGVycm9yRGl2LmlubmVySFRNTCA9IFwiXCJcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcHJvZHVjdFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwicHJvZHVjdFBhZ2VcIilcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgYWRkUGFuZWwoY2xpZW50KTtcclxuICAgICAgICBhd2FpdCBnZXREYXRhRnJvbVBhZ2UoY2xpZW50KTtcclxuICAgICAgICBhd2FpdCBlbmFibGVTdWJtaXRCdXR0b24oKVxyXG4gICAgICAgIGF3YWl0IGhpZGVFcnJvcnMoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBhd2FpdCBzaG93RXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBhdXRoUGFnZShvQXV0aDJDbGllbnQ6IE9BdXRoMkNsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJhdXRoUGFnZVwiKVxyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZilcclxuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmhhcyhcImNvZGVcIikpIHtcclxuICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSkuY29kZV92ZXJpZmllcjtcclxuICAgICAgICBsZXQgb2F1dGgyVG9rZW4gPSBhd2FpdCBvQXV0aDJDbGllbnQuYXV0aG9yaXphdGlvbkNvZGUuZ2V0VG9rZW5Gcm9tQ29kZVJlZGlyZWN0KFxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7YmFja2VuZF91cmw6IGJhY2tlbmRVcmx9KVxyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7dG9rZW5fc3RvcmU6IEpTT04uc3RyaW5naWZ5KG9hdXRoMlRva2VuKX0pXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhdXRoUmVkaXJlY3RVcmxcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoUGFnZVwiKVxyXG4gICAgLy/RgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INC/0YDQvtC00LDQvdGL0LUg0LvQvtGC0YtcclxuICAgIGlmIChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcz8uZ2V0KCdMSF9Tb2xkJyk/LnRyaW0oKSAhPT0gXCIxXCIpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgndWwuc3JwLXJlc3VsdHMnKVxyXG5cclxuICAgIGxldCBsaW5rcyA9IFsuLi5zZWFyY2hSZXN1bHRzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpLnMtaXRlbScpXVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHg6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gPEhUTUxBbmNob3JFbGVtZW50PngucXVlcnlTZWxlY3RvcignYS5zLWl0ZW1fX2xpbmsnKVxyXG4gICAgICAgICAgICBsZXQgc29sZERhdGUgPSBuZXcgRGF0ZSgoPEhUTUxFbGVtZW50PngucXVlcnlTZWxlY3Rvcignc3Bhbi5QT1NJVElWRScpKS5pbm5lclRleHQucmVwbGFjZShcIlNvbGQgXCIsIFwiXCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExvdExpbmsocGFyc2VJbnQobGluay5ocmVmLm1hdGNoKC9odHRwczpcXC9cXC9bXlxcL10rXFwvaXRtXFwvKFxcZCspLylbMV0pLCBsaW5rLCBzb2xkRGF0ZSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBsZXQgXyA9IHVwZGF0ZVN0YXR1c0luZmluaXRlKGNsaWVudCwgbGlua3MpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVTdGF0dXNJbmZpbml0ZShjbGllbnQ6IENsaWVudCwgbGlua3M6IExvdExpbmtbXSkge1xyXG4gICAgbGV0IGlkcyA9IGxpbmtzLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4LmlkXHJcbiAgICB9KVxyXG4gICAgLy8gbm9pbnNwZWN0aW9uIEluZmluaXRlTG9vcEpTXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRpbmdMb3RTdGF0ZXNcIilcclxuICAgICAgICAgICAgbGV0IGdldExvdFN0YXRlc0Fuc3dlciA9IGF3YWl0IGNsaWVudC5nZXRMb3RTdGF0ZXMoaWRzKVxyXG5cclxuICAgICAgICAgICAgbGV0IGtub3duTG90cyA9IG5ldyBNYXAoZ2V0TG90U3RhdGVzQW5zd2VyLm1hcChwID0+IFtwLmxvdElkLCBwXSkpO1xyXG5cclxuICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb2xvciA9IHguY29sb3I7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtub3duTG90cy5oYXMoeC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG90U3RhdGUgPSBrbm93bkxvdHMuZ2V0KHguaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb3RTdGF0ZS5pZ25vcmVUaGF0TG90KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkaWZmSW5EYXlzID0gTWF0aC5jZWlsKCh4LnNvbGREYXRlLmdldFRpbWUoKSAtIG5ldyBEYXRlKGxvdFN0YXRlLmxhc3RVcGRhdGUpLmdldFRpbWUoKSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZkluRGF5cyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSBsaWdodFllbGxvd0NvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRHcmVlbkNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlmZkluRGF5cylcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRHcmVlbkNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRQaW5rQ29sb3JcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoeC5jb2xvciAhPT0gbnVsbCAmJiBjb2xvciAhPT0geC5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHgubGluay5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7eC5jb2xvcn07YFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLnN0YWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMb3RMaW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGxpbms6IEhUTUxBbmNob3JFbGVtZW50LCBzb2xkRGF0ZTogRGF0ZSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZFxyXG4gICAgICAgIHRoaXMubGluayA9IGxpbmtcclxuICAgICAgICB0aGlzLnNvbGREYXRlID0gc29sZERhdGVcclxuICAgICAgICB0aGlzLmNvbG9yID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudDtcclxuICAgIHNvbGREYXRlOiBEYXRlXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgbnVsbFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzbGVlcEVsZW1lbnRMb2FkZWQoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8RWxlbWVudD4ge1xyXG4gICAgbGV0IHJldHJ5ID0gMFxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICByZXRyeSsrO1xyXG4gICAgICAgIGlmIChyZXRyeSA+IDEwMDApIHRocm93IG5ldyBFcnJvcihcInVuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3IgXCIgKyBzZWxlY3RvcilcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxyXG4gICAgICAgIGlmIChlbGVtZW50ICE9PSBudWxsKSByZXR1cm4gZWxlbWVudFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzYXZlQ29kZVZlcmlmaWVyKCkge1xyXG4gICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpPy5jb2RlX3ZlcmlmaWVyO1xyXG5cclxuICAgIGlmIChjb2RlVmVyaWZpZXIgPT09IG51bGwgfHwgY29kZVZlcmlmaWVyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gYXdhaXQgZ2VuZXJhdGVDb2RlVmVyaWZpZXIoKTtcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2NvZGVfdmVyaWZpZXI6IGNvZGVWZXJpZmllcn0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcbiAgICBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Zvb3RlcicpXHJcbiAgICBhd2FpdCBzYXZlQ29kZVZlcmlmaWVyKCk7XHJcblxyXG4gICAgbGV0IG9BdXRoMkNsaWVudCA9IG5ldyBPQXV0aDJDbGllbnQoe1xyXG4gICAgICAgIHNlcnZlcjogYmFja2VuZFVybCxcclxuICAgICAgICBjbGllbnRJZDogJ0ViYXkuQ2hyb21lRXh0ZW5zaW9uJyxcclxuICAgICAgICB0b2tlbkVuZHBvaW50OiAnL2Nvbm5lY3QvdG9rZW4nLFxyXG4gICAgICAgIGF1dGhvcml6YXRpb25FbmRwb2ludDogJy9jb25uZWN0L2F1dGhvcml6ZScsXHJcbiAgICAgICAgZmV0Y2g6IGZldGNoUmVzb3VyY2VcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBjdXJyZW50UGFnZSA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyBsb2NhdGlvbi5wYXRobmFtZVxyXG5cclxuICAgIGlmIChjdXJyZW50UGFnZSA9PT0gYXV0aFJlZGlyZWN0VXJsKSB7XHJcbiAgICAgICAgYXdhaXQgYXV0aFBhZ2Uob0F1dGgyQ2xpZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNsaWVudCA9IG5ldyBDbGllbnQoYmFzZUFwaVVybCwgZ2V0QXV0aG9yaXplRmV0Y2gob0F1dGgyQ2xpZW50KSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UGFnZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZWJheS5jb20vaXRtL1wiKSkge1xyXG4gICAgICAgICAgICBhd2FpdCBwcm9kdWN0UGFnZShjbGllbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL3NjaC9cIikpIHtcclxuICAgICAgICAgICAgYXdhaXQgc2VhcmNoUGFnZShjbGllbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbnJ1bigpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=