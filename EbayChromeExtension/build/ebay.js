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
        let serverPurchaseHistory = serverLotInfoJson["purchaseHistory"];
        serverLotInfoJson["purchaseHistory"] = undefined;
        let lotInfoJson = lotInfo.toJSON();
        lotInfoJson["pcs"] = undefined;
        lotInfoJson["ignoreThatLot"] = undefined;
        lotInfoJson["manualConditionId"] = undefined;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50L2Jyb3dzZXIvb2F1dGgyLWNsaWVudC5taW4uanMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRWJheUNsaWVudC9FYmF5Q2xpZW50LnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL0ZldGNoV3JhcHBlckN1c3RvbS50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9tYWluLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9dCgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sdCk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5PQXV0aDJDbGllbnQ9dCgpOmUuT0F1dGgyQ2xpZW50PXQoKX0oc2VsZiwoKCk9PigoKT0+e3ZhciBlPXs5MzQ6KGUsdCxyKT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZ2VuZXJhdGVRdWVyeVN0cmluZz10Lk9BdXRoMkNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDQ0MyksaT1yKDYxOCk7ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBuZXcgVVJMKGUsdCkudG9TdHJpbmcoKX1mdW5jdGlvbiBzKGUpe3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhlKS5maWx0ZXIoKChbZSx0XSk9PnZvaWQgMCE9PXQpKSkpLnRvU3RyaW5nKCl9dC5PQXV0aDJDbGllbnQ9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy5kaXNjb3ZlcnlEb25lPSExLHRoaXMuc2VydmVyTWV0YWRhdGE9bnVsbCwobnVsbD09ZT92b2lkIDA6ZS5mZXRjaCl8fChlLmZldGNoPWZldGNoLmJpbmQoZ2xvYmFsVGhpcykpLHRoaXMuc2V0dGluZ3M9ZX1hc3luYyByZWZyZXNoVG9rZW4oZSl7aWYoIWUucmVmcmVzaFRva2VuKXRocm93IG5ldyBFcnJvcihcIlRoaXMgdG9rZW4gZGlkbid0IGhhdmUgYSByZWZyZXNoVG9rZW4uIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHJlZnJlc2ggdGhpc1wiKTtjb25zdCB0PXtncmFudF90eXBlOlwicmVmcmVzaF90b2tlblwiLHJlZnJlc2hfdG9rZW46ZS5yZWZyZXNoVG9rZW59O3JldHVybiB0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldHx8KHQuY2xpZW50X2lkPXRoaXMuc2V0dGluZ3MuY2xpZW50SWQpLHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHQpKX1hc3luYyBjbGllbnRDcmVkZW50aWFscyhlKXt2YXIgdDtjb25zdCByPVtcImNsaWVudF9pZFwiLFwiY2xpZW50X3NlY3JldFwiLFwiZ3JhbnRfdHlwZVwiLFwic2NvcGVcIl07aWYoKG51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXMpJiZPYmplY3Qua2V5cyhlLmV4dHJhUGFyYW1zKS5maWx0ZXIoKGU9PnIuaW5jbHVkZXMoZSkpKS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZXh0cmFQYXJhbXMgYXJlIGRpc2FsbG93ZWQ6ICcke3Iuam9pbihcIicsICdcIil9J2ApO2NvbnN0IG49e2dyYW50X3R5cGU6XCJjbGllbnRfY3JlZGVudGlhbHNcIixzY29wZTpudWxsPT09KHQ9bnVsbD09ZT92b2lkIDA6ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIiksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc307aWYoIXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KXRocm93IG5ldyBFcnJvcihcIkEgY2xpZW50U2VjcmV0IG11c3QgYmUgcHJvdmlkZWQgdG8gdXNlIGNsaWVudF9jcmVkZW50aWFsc1wiKTtyZXR1cm4gdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsbikpfWFzeW5jIHBhc3N3b3JkKGUpe3ZhciB0O2NvbnN0IHI9e2dyYW50X3R5cGU6XCJwYXNzd29yZFwiLC4uLmUsc2NvcGU6bnVsbD09PSh0PWUuc2NvcGUpfHx2b2lkIDA9PT10P3ZvaWQgMDp0LmpvaW4oXCIgXCIpfTtyZXR1cm4gdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIscikpfWdldCBhdXRob3JpemF0aW9uQ29kZSgpe3JldHVybiBuZXcgaS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudCh0aGlzKX1hc3luYyBpbnRyb3NwZWN0KGUpe2NvbnN0IHQ9e3Rva2VuOmUuYWNjZXNzVG9rZW4sdG9rZW5fdHlwZV9oaW50OlwiYWNjZXNzX3Rva2VuXCJ9O3JldHVybiB0aGlzLnJlcXVlc3QoXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIix0KX1hc3luYyBnZXRFbmRwb2ludChlKXtpZih2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKXJldHVybiBvKHRoaXMuc2V0dGluZ3NbZV0sdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2lmKFwiZGlzY292ZXJ5RW5kcG9pbnRcIiE9PWUmJihhd2FpdCB0aGlzLmRpc2NvdmVyKCksdm9pZCAwIT09dGhpcy5zZXR0aW5nc1tlXSkpcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoIXRoaXMuc2V0dGluZ3Muc2VydmVyKXRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGRldGVybWluZSB0aGUgbG9jYXRpb24gb2YgJHtlfS4gRWl0aGVyIHNwZWNpZnkgJHtlfSBpbiB0aGUgc2V0dGluZ3MsIG9yIHRoZSBcInNlcnZlclwiIGVuZHBvaW50IHRvIGxldCB0aGUgY2xpZW50IGRpc2NvdmVyIGl0LmApO3N3aXRjaChlKXtjYXNlXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9hdXRob3JpemVcIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwidG9rZW5FbmRwb2ludFwiOnJldHVybiBvKFwiL3Rva2VuXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcImRpc2NvdmVyeUVuZHBvaW50XCI6cmV0dXJuIG8oXCIvLndlbGwta25vd24vb2F1dGgtYXV0aG9yaXphdGlvbi1zZXJ2ZXJcIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvaW50cm9zcGVjdFwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKX19YXN5bmMgZGlzY292ZXIoKXt2YXIgZTtpZih0aGlzLmRpc2NvdmVyeURvbmUpcmV0dXJuO2xldCB0O3RoaXMuZGlzY292ZXJ5RG9uZT0hMDt0cnl7dD1hd2FpdCB0aGlzLmdldEVuZHBvaW50KFwiZGlzY292ZXJ5RW5kcG9pbnRcIil9Y2F0Y2goZSl7cmV0dXJuIHZvaWQgY29uc29sZS53YXJuKCdbb2F1dGgyXSBPQXV0aDIgZGlzY292ZXJ5IGVuZHBvaW50IGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBFaXRoZXIgc3BlY2lmeSB0aGUgXCJzZXJ2ZXJcIiBvciBcImRpc2NvdmVyeUVuZHBvaW50Jyl9Y29uc3Qgcj1hd2FpdCB0aGlzLnNldHRpbmdzLmZldGNoKHQse2hlYWRlcnM6e0FjY2VwdDpcImFwcGxpY2F0aW9uL2pzb25cIn19KTtpZighci5vaylyZXR1cm47aWYoIShudWxsPT09KGU9ci5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKSl8fHZvaWQgMD09PWU/dm9pZCAwOmUuc3RhcnRzV2l0aChcImFwcGxpY2F0aW9uL2pzb25cIikpKXJldHVybiB2b2lkIGNvbnNvbGUud2FybihcIltvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgd2FzIG5vdCBhIEpTT04gcmVzcG9uc2UuIFJlc3BvbnNlIGlzIGlnbm9yZWRcIik7dGhpcy5zZXJ2ZXJNZXRhZGF0YT1hd2FpdCByLmpzb24oKTtjb25zdCBuPVtbXCJhdXRob3JpemF0aW9uX2VuZHBvaW50XCIsXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIl0sW1widG9rZW5fZW5kcG9pbnRcIixcInRva2VuRW5kcG9pbnRcIl0sW1wiaW50cm9zcGVjdGlvbl9lbmRwb2ludFwiLFwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCJdXTtpZihudWxsIT09dGhpcy5zZXJ2ZXJNZXRhZGF0YSl7Zm9yKGNvbnN0W2Uscl1vZiBuKXRoaXMuc2VydmVyTWV0YWRhdGFbZV0mJih0aGlzLnNldHRpbmdzW3JdPW8odGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSx0KSk7dGhpcy5zZXJ2ZXJNZXRhZGF0YS50b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZHNfc3VwcG9ydGVkJiYhdGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZCYmKHRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2Q9dGhpcy5zZXJ2ZXJNZXRhZGF0YS50b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZHNfc3VwcG9ydGVkWzBdKX19YXN5bmMgcmVxdWVzdChlLHQpe2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRFbmRwb2ludChlKSxpPXtcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJ9O2xldCBvPXRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2Q7c3dpdGNoKG98fChvPXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0P1wiY2xpZW50X3NlY3JldF9iYXNpY1wiOlwiY2xpZW50X3NlY3JldF9wb3N0XCIpLG8pe2Nhc2VcImNsaWVudF9zZWNyZXRfYmFzaWNcIjppLkF1dGhvcml6YXRpb249XCJCYXNpYyBcIitidG9hKHRoaXMuc2V0dGluZ3MuY2xpZW50SWQrXCI6XCIrdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpO2JyZWFrO2Nhc2VcImNsaWVudF9zZWNyZXRfcG9zdFwiOnQuY2xpZW50X2lkPXRoaXMuc2V0dGluZ3MuY2xpZW50SWQsdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQmJih0LmNsaWVudF9zZWNyZXQ9dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpO2JyZWFrO2RlZmF1bHQ6dGhyb3cgbmV3IEVycm9yKFwiQXV0aGVudGljYXRpb24gbWV0aG9kIG5vdCB5ZXQgc3VwcG9ydGVkOlwiK28rXCIuIE9wZW4gYSBmZWF0dXJlIHJlcXVlc3QgaWYgeW91IHdhbnQgdGhpcyFcIil9Y29uc3QgYT1hd2FpdCB0aGlzLnNldHRpbmdzLmZldGNoKHIse21ldGhvZDpcIlBPU1RcIixib2R5OnModCksaGVhZGVyczppfSk7aWYoYS5vaylyZXR1cm4gYXdhaXQgYS5qc29uKCk7bGV0IGMsaCx1O3Rocm93IGEuaGVhZGVycy5oYXMoXCJDb250ZW50LVR5cGVcIikmJmEuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikuc3RhcnRzV2l0aChcImFwcGxpY2F0aW9uL2pzb25cIikmJihjPWF3YWl0IGEuanNvbigpKSwobnVsbD09Yz92b2lkIDA6Yy5lcnJvcik/KGg9XCJPQXV0aDIgZXJyb3IgXCIrYy5lcnJvcitcIi5cIixjLmVycm9yX2Rlc2NyaXB0aW9uJiYoaCs9XCIgXCIrYy5lcnJvcl9kZXNjcmlwdGlvbiksdT1jLmVycm9yKTooaD1cIkhUVFAgRXJyb3IgXCIrYS5zdGF0dXMrXCIgXCIrYS5zdGF0dXNUZXh0LDQwMT09PWEuc3RhdHVzJiZ0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKGgrPVwiLiBJdCdzIGxpa2VseSB0aGF0IHRoZSBjbGllbnRJZCBhbmQvb3IgY2xpZW50U2VjcmV0IHdhcyBpbmNvcnJlY3RcIiksdT1udWxsKSxuZXcgbi5PQXV0aDJFcnJvcihoLHUsYS5zdGF0dXMpfXRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKGUpe3JldHVybiBlLnRoZW4oKGU9Pnt2YXIgdDtyZXR1cm57YWNjZXNzVG9rZW46ZS5hY2Nlc3NfdG9rZW4sZXhwaXJlc0F0OmUuZXhwaXJlc19pbj9EYXRlLm5vdygpKzFlMyplLmV4cGlyZXNfaW46bnVsbCxyZWZyZXNoVG9rZW46bnVsbCE9PSh0PWUucmVmcmVzaF90b2tlbikmJnZvaWQgMCE9PXQ/dDpudWxsfX0pKX19LHQuZ2VuZXJhdGVRdWVyeVN0cmluZz1zfSw2MTg6KGUsdCxyKT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZ2V0Q29kZUNoYWxsZW5nZT10LmdlbmVyYXRlQ29kZVZlcmlmaWVyPXQuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9dm9pZCAwO2NvbnN0IG49cig5MzQpLGk9cig0NDMpO2FzeW5jIGZ1bmN0aW9uIG8oZSl7Y29uc3QgdD1zKCk7aWYobnVsbD09dD92b2lkIDA6dC5zdWJ0bGUpcmV0dXJuW1wiUzI1NlwiLGMoYXdhaXQgdC5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLGEoZSkpKV07e2NvbnN0IHQ9cigyMTIpLmNyZWF0ZUhhc2goXCJzaGEyNTZcIik7cmV0dXJuIHQudXBkYXRlKGEoZSkpLFtcIlMyNTZcIix0LmRpZ2VzdChcImJhc2U2NHVybFwiKV19fWZ1bmN0aW9uIHMoKXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuY3J5cHRvKXJldHVybiB3aW5kb3cuY3J5cHRvO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiZzZWxmLmNyeXB0bylyZXR1cm4gc2VsZi5jcnlwdG87Y29uc3QgZT1yKDIxMik7cmV0dXJuIGUud2ViY3J5cHRvP2Uud2ViY3J5cHRvOm51bGx9ZnVuY3Rpb24gYShlKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KGUubGVuZ3RoKTtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrKyl0W3JdPTI1NSZlLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9ZnVuY3Rpb24gYyhlKXtyZXR1cm4gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLm5ldyBVaW50OEFycmF5KGUpKSkucmVwbGFjZSgvXFwrL2csXCItXCIpLnJlcGxhY2UoL1xcLy9nLFwiX1wiKS5yZXBsYWNlKC89KyQvLFwiXCIpfXQuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy5jbGllbnQ9ZX1hc3luYyBnZXRBdXRob3JpemVVcmkoZSl7Y29uc3RbdCxyXT1hd2FpdCBQcm9taXNlLmFsbChbZS5jb2RlVmVyaWZpZXI/byhlLmNvZGVWZXJpZmllcik6dm9pZCAwLHRoaXMuY2xpZW50LmdldEVuZHBvaW50KFwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCIpXSk7bGV0IGk9e2NsaWVudF9pZDp0aGlzLmNsaWVudC5zZXR0aW5ncy5jbGllbnRJZCxyZXNwb25zZV90eXBlOlwiY29kZVwiLHJlZGlyZWN0X3VyaTplLnJlZGlyZWN0VXJpLGNvZGVfY2hhbGxlbmdlX21ldGhvZDpudWxsPT10P3ZvaWQgMDp0WzBdLGNvZGVfY2hhbGxlbmdlOm51bGw9PXQ/dm9pZCAwOnRbMV19O2Uuc3RhdGUmJihpLnN0YXRlPWUuc3RhdGUpLGUuc2NvcGUmJihpLnNjb3BlPWUuc2NvcGUuam9pbihcIiBcIikpO2NvbnN0IHM9T2JqZWN0LmtleXMoaSk7aWYoKG51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXMpJiZPYmplY3Qua2V5cyhlLmV4dHJhUGFyYW1zKS5maWx0ZXIoKGU9PnMuaW5jbHVkZXMoZSkpKS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZXh0cmFQYXJhbXMgYXJlIGRpc2FsbG93ZWQ6ICcke3Muam9pbihcIicsICdcIil9J2ApO3JldHVybiBpPXsuLi5pLC4uLm51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXN9LHIrXCI/XCIrKDAsbi5nZW5lcmF0ZVF1ZXJ5U3RyaW5nKShpKX1hc3luYyBnZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoZSx0KXtjb25zdHtjb2RlOnJ9PWF3YWl0IHRoaXMudmFsaWRhdGVSZXNwb25zZShlLHtzdGF0ZTp0LnN0YXRlfSk7cmV0dXJuIHRoaXMuZ2V0VG9rZW4oe2NvZGU6cixyZWRpcmVjdFVyaTp0LnJlZGlyZWN0VXJpLGNvZGVWZXJpZmllcjp0LmNvZGVWZXJpZmllcn0pfWFzeW5jIHZhbGlkYXRlUmVzcG9uc2UoZSx0KXt2YXIgcjtjb25zdCBuPW5ldyBVUkwoZSkuc2VhcmNoUGFyYW1zO2lmKG4uaGFzKFwiZXJyb3JcIikpdGhyb3cgbmV3IGkuT0F1dGgyRXJyb3IobnVsbCE9PShyPW4uZ2V0KFwiZXJyb3JfZGVzY3JpcHRpb25cIikpJiZ2b2lkIDAhPT1yP3I6XCJPQXV0aDIgZXJyb3JcIixuLmdldChcImVycm9yXCIpLDApO2lmKCFuLmhhcyhcImNvZGVcIikpdGhyb3cgbmV3IEVycm9yKGBUaGUgdXJsIGRpZCBub3QgY29udGFpbiBhIGNvZGUgcGFyYW1ldGVyICR7ZX1gKTtpZih0LnN0YXRlJiZ0LnN0YXRlIT09bi5nZXQoXCJzdGF0ZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSBcInN0YXRlXCIgcGFyYW1ldGVyIGluIHRoZSB1cmwgZGlkIG5vdCBtYXRjaCB0aGUgZXhwZWN0ZWQgdmFsdWUgb2YgJHt0LnN0YXRlfWApO3JldHVybntjb2RlOm4uZ2V0KFwiY29kZVwiKSxzY29wZTpuLmhhcyhcInNjb3BlXCIpP24uZ2V0KFwic2NvcGVcIikuc3BsaXQoXCIgXCIpOnZvaWQgMH19YXN5bmMgZ2V0VG9rZW4oZSl7Y29uc3QgdD17Z3JhbnRfdHlwZTpcImF1dGhvcml6YXRpb25fY29kZVwiLGNvZGU6ZS5jb2RlLHJlZGlyZWN0X3VyaTplLnJlZGlyZWN0VXJpLGNvZGVfdmVyaWZpZXI6ZS5jb2RlVmVyaWZpZXJ9O3JldHVybiB0aGlzLmNsaWVudC50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLmNsaWVudC5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHQpKX19LHQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9YXN5bmMgZnVuY3Rpb24oKXtjb25zdCBlPXMoKTtpZihlKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KDMyKTtyZXR1cm4gZS5nZXRSYW5kb21WYWx1ZXModCksYyh0KX17Y29uc3QgZT1yKDIxMik7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2UucmFuZG9tQnl0ZXMoMzIsKChlLG4pPT57ZSYmcihlKSx0KG4udG9TdHJpbmcoXCJiYXNlNjR1cmxcIikpfSkpfSkpfX0sdC5nZXRDb2RlQ2hhbGxlbmdlPW99LDQ0MzooZSx0KT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuT0F1dGgyRXJyb3I9dm9pZCAwO2NsYXNzIHIgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihlLHQscil7c3VwZXIoZSksdGhpcy5vYXV0aDJDb2RlPXQsdGhpcy5odHRwQ29kZT1yfX10Lk9BdXRoMkVycm9yPXJ9LDEzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJGZXRjaD12b2lkIDAsdC5PQXV0aDJGZXRjaD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLnRva2VuPW51bGwsdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsLHRoaXMuYWN0aXZlUmVmcmVzaD1udWxsLHRoaXMucmVmcmVzaFRpbWVyPW51bGwsdm9pZCAwPT09KG51bGw9PWU/dm9pZCAwOmUuc2NoZWR1bGVSZWZyZXNoKSYmKGUuc2NoZWR1bGVSZWZyZXNoPSEwKSx0aGlzLm9wdGlvbnM9ZSxlLmdldFN0b3JlZFRva2VuJiYodGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj0oYXN5bmMoKT0+e3RoaXMudG9rZW49YXdhaXQgZS5nZXRTdG9yZWRUb2tlbigpLHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49bnVsbH0pKCkpLHRoaXMuc2NoZWR1bGVSZWZyZXNoKCl9YXN5bmMgZmV0Y2goZSx0KXtjb25zdCByPW5ldyBSZXF1ZXN0KGUsdCk7cmV0dXJuIHRoaXMubXcoKShyLChlPT5mZXRjaChlKSkpfW13KCl7cmV0dXJuIGFzeW5jKGUsdCk9Pntjb25zdCByPWF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtsZXQgbj1lLmNsb25lKCk7bi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityKTtsZXQgaT1hd2FpdCB0KG4pO2lmKCFpLm9rJiY0MDE9PT1pLnN0YXR1cyl7Y29uc3Qgcj1hd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO249ZS5jbG9uZSgpLG4uaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsXCJCZWFyZXIgXCIrci5hY2Nlc3NUb2tlbiksaT1hd2FpdCB0KG4pfXJldHVybiBpfX1hc3luYyBnZXRUb2tlbigpe3JldHVybiB0aGlzLnRva2VuJiYobnVsbD09PXRoaXMudG9rZW4uZXhwaXJlc0F0fHx0aGlzLnRva2VuLmV4cGlyZXNBdD5EYXRlLm5vdygpKT90aGlzLnRva2VuOnRoaXMucmVmcmVzaFRva2VuKCl9YXN5bmMgZ2V0QWNjZXNzVG9rZW4oKXtyZXR1cm4gYXdhaXQgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiwoYXdhaXQgdGhpcy5nZXRUb2tlbigpKS5hY2Nlc3NUb2tlbn1hc3luYyByZWZyZXNoVG9rZW4oKXt2YXIgZSx0O2lmKHRoaXMuYWN0aXZlUmVmcmVzaClyZXR1cm4gdGhpcy5hY3RpdmVSZWZyZXNoO2NvbnN0IHI9dGhpcy50b2tlbjt0aGlzLmFjdGl2ZVJlZnJlc2g9KGFzeW5jKCk9Pnt2YXIgZSx0O2xldCBuPW51bGw7dHJ5eyhudWxsPT1yP3ZvaWQgMDpyLnJlZnJlc2hUb2tlbikmJihuPWF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKHIpKX1jYXRjaChlKXtjb25zb2xlLndhcm4oXCJbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2UnbGwgdHJ5IHJlYXV0aGVudGljYXRpbmdcIil9aWYobnx8KG49YXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCkpLCFuKXtjb25zdCByPW5ldyBFcnJvcihcIlVuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkXCIpO3Rocm93IG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLm9uRXJyb3IpfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSxyfXJldHVybiBufSkoKTt0cnl7Y29uc3Qgcj1hd2FpdCB0aGlzLmFjdGl2ZVJlZnJlc2g7cmV0dXJuIHRoaXMudG9rZW49cixudWxsPT09KHQ9KGU9dGhpcy5vcHRpb25zKS5zdG9yZVRva2VuKXx8dm9pZCAwPT09dHx8dC5jYWxsKGUsciksdGhpcy5zY2hlZHVsZVJlZnJlc2goKSxyfWNhdGNoKGUpe3Rocm93IHRoaXMub3B0aW9ucy5vbkVycm9yJiZ0aGlzLm9wdGlvbnMub25FcnJvcihlKSxlfWZpbmFsbHl7dGhpcy5hY3RpdmVSZWZyZXNoPW51bGx9fXNjaGVkdWxlUmVmcmVzaCgpe3ZhciBlO2lmKCF0aGlzLm9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoKXJldHVybjtpZih0aGlzLnJlZnJlc2hUaW1lciYmKGNsZWFyVGltZW91dCh0aGlzLnJlZnJlc2hUaW1lciksdGhpcy5yZWZyZXNoVGltZXI9bnVsbCksIShudWxsPT09KGU9dGhpcy50b2tlbil8fHZvaWQgMD09PWU/dm9pZCAwOmUuZXhwaXJlc0F0KXx8IXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKXJldHVybjtjb25zdCB0PXRoaXMudG9rZW4uZXhwaXJlc0F0LURhdGUubm93KCk7dDwxMmU0fHwodGhpcy5yZWZyZXNoVGltZXI9c2V0VGltZW91dCgoYXN5bmMoKT0+e3RyeXthd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoXCJbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaFwiLGUpfX0pLHQtNmU0KSl9fX0sMjEyOigpPT57fX0sdD17fTtmdW5jdGlvbiByKG4pe3ZhciBpPXRbbl07aWYodm9pZCAwIT09aSlyZXR1cm4gaS5leHBvcnRzO3ZhciBvPXRbbl09e2V4cG9ydHM6e319O3JldHVybiBlW25dKG8sby5leHBvcnRzLHIpLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4oKCk9PntcInVzZSBzdHJpY3RcIjt2YXIgZT1uO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuT0F1dGgyRXJyb3I9ZS5PQXV0aDJGZXRjaD1lLmdlbmVyYXRlQ29kZVZlcmlmaWVyPWUuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9ZS5PQXV0aDJDbGllbnQ9dm9pZCAwO3ZhciB0PXIoOTM0KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkNsaWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0Lk9BdXRoMkNsaWVudH19KTt2YXIgaT1yKDYxOCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiZ2VuZXJhdGVDb2RlVmVyaWZpZXJcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5nZW5lcmF0ZUNvZGVWZXJpZmllcn19KTt2YXIgbz1yKDEzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkZldGNoXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG8uT0F1dGgyRmV0Y2h9fSk7dmFyIHM9cig0NDMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRXJyb3JcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcy5PQXV0aDJFcnJvcn19KX0pKCksbn0pKCkpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2F1dGgyLWNsaWVudC5taW4uanMubWFwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIDxhdXRvLWdlbmVyYXRlZD5cclxuLy8gICAgIEdlbmVyYXRlZCB1c2luZyB0aGUgTlN3YWcgdG9vbGNoYWluIHYxMy4yMC4wLjAgKE5Kc29uU2NoZW1hIHYxMC45LjAuMCAoTmV3dG9uc29mdC5Kc29uIHYxMy4wLjAuMCkpIChodHRwOi8vTlN3YWcub3JnKVxyXG4vLyA8L2F1dG8tZ2VuZXJhdGVkPlxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbi8vIFJlU2hhcnBlciBkaXNhYmxlIEluY29uc2lzdGVudE5hbWluZ1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudCB7XHJcbiAgICBwcml2YXRlIGh0dHA6IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfTtcclxuICAgIHByaXZhdGUgYmFzZVVybDogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIGpzb25QYXJzZVJldml2ZXI6ICgoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IGFueSkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZVVybD86IHN0cmluZywgaHR0cD86IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfSkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IGh0dHAgPyBodHRwIDogd2luZG93IGFzIGFueTtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsICE9PSB1bmRlZmluZWQgJiYgYmFzZVVybCAhPT0gbnVsbCA/IGJhc2VVcmwgOiBcIi9hcGkvZWJheS92MVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBhbGwgcHJvZHVjdHNcclxuICAgICAqIEByZXR1cm4gT0tcclxuICAgICAqL1xyXG4gICAgZ2V0QWxsUHJvZHVjdHMoKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0QWxsUHJvZHVjdHMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldEFsbFByb2R1Y3RzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goUHJvZHVjdFdpdGhJZC5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8UHJvZHVjdFdpdGhJZFtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2R1Y3QocHJvZHVjdDogUHJvZHVjdFdpdGhvdXRJZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NDcmVhdGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDcmVhdGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IHJlc3VsdERhdGEyMDAgIT09IHVuZGVmaW5lZCA/IHJlc3VsdERhdGEyMDAgOiA8YW55Pm51bGw7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHN0cmluZz4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBkYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBkYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBEZWxldGVkXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVByb2R1Y3QoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NEZWxldGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NEZWxldGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LvQvtGC0LVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgdXBzZXJ0TG90SW5mbyhsb3RJbmZvOiBMb3RJbmZvLCBwcm9kdWN0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve3Byb2R1Y3RJZH0vbG90cy9cIjtcclxuICAgICAgICBpZiAocHJvZHVjdElkID09PSB1bmRlZmluZWQgfHwgcHJvZHVjdElkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdwcm9kdWN0SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntwcm9kdWN0SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgcHJvZHVjdElkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBzZXJ0TG90SW5mbyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBzZXJ0TG90SW5mbyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdEluZm8obG90SWQ6IG51bWJlcik6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdHMve2xvdElkfS9cIjtcclxuICAgICAgICBpZiAobG90SWQgPT09IHVuZGVmaW5lZCB8fCBsb3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnbG90SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntsb3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBsb3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDIwMCA9IExvdEluZm9XaXRoUHJvZHVjdElkLmZyb21KUyhyZXN1bHREYXRhMjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRg9GH0YLQtdC90L3Ri9GFINC70L7RgtCw0YVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TG90U3RhdGVzKGxvdElkczogbnVtYmVyW10pOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdF9zdGF0ZV9yZXF1ZXN0cy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdElkcyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RTdGF0ZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdFN0YXRlcyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChMb3RTdGF0ZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90U3RhdGVbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC00LDQtdGCINC/0LXRgNC10YfQtdC90Ywg0LLQvtC30LzQvtC20L3Ri9GFINGB0L7RgdGC0L7Rj9C90LjQuSDQv9GA0L7QtNCw0LLQsNC10LzQvtCz0L4g0YLQvtCy0LDRgNCwXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldE1hbnVhbENvbmRpdGlvbnNMaXN0KCk6IFByb21pc2U8TWFudWFsQ29uZGl0aW9uW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL21hbnVhbF9jb25kaXRpb25zL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldE1hbnVhbENvbmRpdGlvbnNMaXN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTWFudWFsQ29uZGl0aW9uLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxNYW51YWxDb25kaXRpb25bXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhvdXRJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzITogU2VhcmNoUXVlcnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRob3V0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIk5hbWVcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyEucHVzaChTZWFyY2hRdWVyeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRob3V0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlYXJjaFF1ZXJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5zZWFyY2hRdWVyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcmllczogU2VhcmNoUXVlcnlbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRoSWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzITogU2VhcmNoUXVlcnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRoSWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJOYW1lXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMhLnB1c2goU2VhcmNoUXVlcnkuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2R1Y3RXaXRoSWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQcm9kdWN0V2l0aElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIklkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlYXJjaFF1ZXJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5zZWFyY2hRdWVyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJpZXM6IFNlYXJjaFF1ZXJ5W107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hRdWVyeSBpbXBsZW1lbnRzIElTZWFyY2hRdWVyeSB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIHF1ZXJ5ITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJU2VhcmNoUXVlcnkpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiaWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMucXVlcnkgPSBfZGF0YVtcInF1ZXJ5XCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFNlYXJjaFF1ZXJ5IHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2VhcmNoUXVlcnkoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiaWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJxdWVyeVwiXSA9IHRoaXMucXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNlYXJjaFF1ZXJ5IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBxdWVyeTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mb1dpdGhQcm9kdWN0SWQgaW1wbGVtZW50cyBJTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgcHJvZHVjdElkITogc3RyaW5nO1xyXG4gICAgbG90SW5mbyE6IExvdEluZm87XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9kdWN0SWQgPSBfZGF0YVtcInByb2R1Y3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb3RJbmZvID0gX2RhdGFbXCJsb3RJbmZvXCJdID8gTG90SW5mby5mcm9tSlMoX2RhdGFbXCJsb3RJbmZvXCJdKSA6IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvV2l0aFByb2R1Y3RJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcm9kdWN0SWRcIl0gPSB0aGlzLnByb2R1Y3RJZDtcclxuICAgICAgICBkYXRhW1wibG90SW5mb1wiXSA9IHRoaXMubG90SW5mbyA/IHRoaXMubG90SW5mby50b0pTT04oKSA6IDxhbnk+dW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICBwcm9kdWN0SWQ6IHN0cmluZztcclxuICAgIGxvdEluZm86IExvdEluZm87XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RJbmZvIGltcGxlbWVudHMgSUxvdEluZm8ge1xyXG4gICAgbG90SWQhOiBudW1iZXI7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgcGNzITogbnVtYmVyO1xyXG4gICAgcHJpY2UhOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uITogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uRGVzY3JpcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWxsZXIhOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW4hOiBzdHJpbmc7XHJcbiAgICBpZ25vcmVUaGF0TG90ITogYm9vbGVhbjtcclxuICAgIG1hbnVhbENvbmRpdGlvbklkITogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5ITogUHVyY2hhc2VJbmZvW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnBjcyA9IF9kYXRhW1wicGNzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZyA9IF9kYXRhW1wic2hpcHBpbmdcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsID0gX2RhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gX2RhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWxsZXIgPSBfZGF0YVtcInNlbGxlclwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVkSW4gPSBfZGF0YVtcImxvY2F0ZWRJblwiXTtcclxuICAgICAgICAgICAgdGhpcy5pZ25vcmVUaGF0TG90ID0gX2RhdGFbXCJpZ25vcmVUaGF0TG90XCJdO1xyXG4gICAgICAgICAgICB0aGlzLm1hbnVhbENvbmRpdGlvbklkID0gX2RhdGFbXCJtYW51YWxDb25kaXRpb25JZFwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkhLnB1c2goUHVyY2hhc2VJbmZvLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcIm5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgZGF0YVtcInBjc1wiXSA9IHRoaXMucGNzO1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nXCJdID0gdGhpcy5zaGlwcGluZztcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdID0gdGhpcy5zaGlwcGluZ0FkZGl0aW9uYWw7XHJcbiAgICAgICAgZGF0YVtcImRlc2NyaXB0aW9uXCJdID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uXCJdID0gdGhpcy5jb25kaXRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdID0gdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbjtcclxuICAgICAgICBkYXRhW1wic2VsbGVyXCJdID0gdGhpcy5zZWxsZXI7XHJcbiAgICAgICAgZGF0YVtcImxvY2F0ZWRJblwiXSA9IHRoaXMubG9jYXRlZEluO1xyXG4gICAgICAgIGRhdGFbXCJpZ25vcmVUaGF0TG90XCJdID0gdGhpcy5pZ25vcmVUaGF0TG90O1xyXG4gICAgICAgIGRhdGFbXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHRoaXMubWFudWFsQ29uZGl0aW9uSWQ7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5wdXJjaGFzZUhpc3RvcnkpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnB1cmNoYXNlSGlzdG9yeSlcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdEluZm8ge1xyXG4gICAgbG90SWQ6IG51bWJlcjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHBjczogbnVtYmVyO1xyXG4gICAgcHJpY2U6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uRGVzY3JpcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWxsZXI6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbjogc3RyaW5nO1xyXG4gICAgaWdub3JlVGhhdExvdDogYm9vbGVhbjtcclxuICAgIG1hbnVhbENvbmRpdGlvbklkOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3Rvcnk6IFB1cmNoYXNlSW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHVyY2hhc2VJbmZvIGltcGxlbWVudHMgSVB1cmNoYXNlSW5mbyB7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHF1YW50aXR5ITogbnVtYmVyO1xyXG4gICAgZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVB1cmNoYXNlSW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5xdWFudGl0eSA9IF9kYXRhW1wicXVhbnRpdHlcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZSA9IF9kYXRhW1wiZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQdXJjaGFzZUluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQdXJjaGFzZUluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJxdWFudGl0eVwiXSA9IHRoaXMucXVhbnRpdHk7XHJcbiAgICAgICAgZGF0YVtcImRhdGVcIl0gPSB0aGlzLmRhdGU7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVB1cmNoYXNlSW5mbyB7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHF1YW50aXR5OiBudW1iZXI7XHJcbiAgICBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYW51YWxDb25kaXRpb24gaW1wbGVtZW50cyBJTWFudWFsQ29uZGl0aW9uIHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElNYW51YWxDb25kaXRpb24pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiaWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IE1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hbnVhbENvbmRpdGlvbigpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJpZFwiXSA9IHRoaXMuaWQ7XHJcbiAgICAgICAgZGF0YVtcImRlc2NyaXB0aW9uXCJdID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWFudWFsQ29uZGl0aW9uIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90U3RhdGUgaW1wbGVtZW50cyBJTG90U3RhdGUge1xyXG4gICAgbG90SWQhOiBudW1iZXI7XHJcbiAgICBpZ25vcmVUaGF0TG90ITogYm9vbGVhbjtcclxuICAgIGxhc3RVcGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RTdGF0ZSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pZ25vcmVUaGF0TG90ID0gX2RhdGFbXCJpZ25vcmVUaGF0TG90XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBfZGF0YVtcImxhc3RVcGRhdGVcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90U3RhdGUge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RTdGF0ZSgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcImxhc3RVcGRhdGVcIl0gPSB0aGlzLmxhc3RVcGRhdGU7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdFN0YXRlIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBpZ25vcmVUaGF0TG90OiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBfZGF0YVtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSBfZGF0YVtcInRpdGxlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IF9kYXRhW1wic3RhdHVzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRldGFpbCA9IF9kYXRhW1wiZGV0YWlsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gX2RhdGFbXCJpbnN0YW5jZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhYnN0cmFjdCBjbGFzcyAnUHJvYmxlbURldGFpbGVkSW5mbycgY2Fubm90IGJlIGluc3RhbnRpYXRlZC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJ0eXBlXCJdID0gdGhpcy50eXBlO1xyXG4gICAgICAgIGRhdGFbXCJ0aXRsZVwiXSA9IHRoaXMudGl0bGU7XHJcbiAgICAgICAgZGF0YVtcInN0YXR1c1wiXSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgIGRhdGFbXCJkZXRhaWxcIl0gPSB0aGlzLmRldGFpbDtcclxuICAgICAgICBkYXRhW1wiaW5zdGFuY2VcIl0gPSB0aGlzLmluc3RhbmNlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMyIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzMiB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9ycyBpbXBsZW1lbnRzIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9ycykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9ycyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9ycygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3JzMiBpbXBsZW1lbnRzIElFcnJvcnMyIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMyKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2RhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gX2RhdGFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogRXJyb3JzMiB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9yczIoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMyIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBzdGF0dXM6IG51bWJlcjtcclxuICAgIHJlc3BvbnNlOiBzdHJpbmc7XHJcbiAgICBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfTtcclxuICAgIHJlc3VsdDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGlzQXBpRXhjZXB0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBzdGF0aWMgaXNBcGlFeGNlcHRpb24ob2JqOiBhbnkpOiBvYmogaXMgQXBpRXhjZXB0aW9uIHtcclxuICAgICAgICByZXR1cm4gb2JqLmlzQXBpRXhjZXB0aW9uID09PSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aHJvd0V4Y2VwdGlvbihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0PzogYW55KTogYW55IHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhyb3cgcmVzdWx0O1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRocm93IG5ldyBBcGlFeGNlcHRpb24obWVzc2FnZSwgc3RhdHVzLCByZXNwb25zZSwgaGVhZGVycywgbnVsbCk7XHJcbn0iLCJpbXBvcnQge09BdXRoMkNsaWVudCwgT0F1dGgyVG9rZW59IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5cclxuXHJcbnR5cGUgT0F1dGgyRmV0Y2hPcHRpb25zID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXJlbmNlIHRvIE9BdXRoMiBjbGllbnQuXHJcbiAgICAgKi9cclxuICAgIGNsaWVudDogT0F1dGgyQ2xpZW50O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogWW91IGFyZSByZXNwb25zaWJsZSBmb3IgaW1wbGVtZW50aW5nIHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgKiBpdCdzIHB1cnBvc2UgaXMgdG8gc3VwcGx5IHRoZSAnaW5pdGlhbCcgb2F1dGgyIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gYG51bGxgIHRvIGZhaWwgdGhlIHByb2Nlc3MuXHJcbiAgICAgKi9cclxuICAgIGdldE5ld1Rva2VuKCk6IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHNldCwgd2lsbCBiZSBjYWxsZWQgaWYgYXV0aGVudGljYXRpb24gZmF0YWxseSBmYWlsZWQuXHJcbiAgICAgKi9cclxuICAgIG9uRXJyb3I/OiAoZXJyOiBFcnJvcikgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBhY3RpdmUgdG9rZW4gY2hhbmdlcy4gVXNpbmcgdGhpcyBpc1xyXG4gICAgICogb3B0aW9uYWwsIGJ1dCBpdCBtYXkgYmUgdXNlZCB0byAoZm9yIGV4YW1wbGUpIHB1dCB0aGUgdG9rZW4gaW4gb2ZmLWxpbmVcclxuICAgICAqIHN0b3JhZ2UgZm9yIGxhdGVyIHVzYWdlLlxyXG4gICAgICovXHJcbiAgICBzdG9yZVRva2VuPzogKHRva2VuOiBPQXV0aDJUb2tlbikgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsc28gYW4gb3B0aW9uYWwgZmVhdHVyZS4gSW1wbGVtZW50IHRoaXMgaWYgeW91IHdhbnQgdGhlIHdyYXBwZXIgdG8gdHJ5IGFcclxuICAgICAqIHN0b3JlZCB0b2tlbiBiZWZvcmUgYXR0ZW1wdGluZyBhIGZ1bGwgcmUtYXV0aGVudGljYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBudWxsIGlmIHRoZXJlIHdhcyBubyB0b2tlbi5cclxuICAgICAqL1xyXG4gICAgZ2V0U3RvcmVkVG9rZW4/OiAoKSA9PiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgc2NoZWR1bGUgdG9rZW4gcmVmcmVzaC5cclxuICAgICAqXHJcbiAgICAgKiBDZXJ0YWluIGV4ZWN1dGlvbiBlbnZpcm9ubWVudHMsIGUuZy4gUmVhY3QgTmF0aXZlLCBkbyBub3QgaGFuZGxlIHNjaGVkdWxlZFxyXG4gICAgICogdGFza3Mgd2l0aCBzZXRUaW1lb3V0KCkgaW4gYSBncmFjZWZ1bCBvciBwcmVkaWN0YWJsZSBmYXNoaW9uLiBUaGUgZGVmYXVsdFxyXG4gICAgICogYmVoYXZpb3IgaXMgdG8gc2NoZWR1bGUgcmVmcmVzaC4gU2V0IHRoaXMgdG8gZmFsc2UgdG8gZGlzYWJsZSBzY2hlZHVsaW5nLlxyXG4gICAgICovXHJcbiAgICBzY2hlZHVsZVJlZnJlc2g/OiBib29sZWFuO1xyXG5cclxuICAgIGZldGNoPzogdHlwZW9mIGZldGNoO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuXHJcbiAgICBwcml2YXRlIG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEN1cnJlbnQgYWN0aXZlIHRva2VuIChpZiBhbnkpXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdG9rZW46IE9BdXRoMlRva2VuIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgdXNlciBoYWQgYSBzdG9yZWRUb2tlbiwgdGhlIHByb2Nlc3MgdG8gZmV0Y2ggaXRcclxuICAgICAqIG1heSBiZSBhc3luYy4gV2Uga2VlcCB0cmFjayBvZiB0aGlzIHByb2Nlc3MgaW4gdGhpc1xyXG4gICAgICogcHJvbWlzZSwgc28gaXQgbWF5IGJlIGF3YWl0ZWQgdG8gYXZvaWQgcmFjZSBjb25kaXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEFzIHNvb24gYXMgdGhpcyBwcm9taXNlIHJlc29sdmVzLCB0aGlzIHByb3BlcnR5IGdldCBudWxsZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlR2V0U3RvcmVkVG9rZW46IG51bGwgfCBQcm9taXNlPHZvaWQ+ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnM/LnNjaGVkdWxlUmVmcmVzaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBpZiAob3B0aW9ucy5nZXRTdG9yZWRUb2tlbikge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBhd2FpdCBvcHRpb25zLmdldFN0b3JlZFRva2VuISgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVSZWZyZXNoKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG9lcyBhIGZldGNoIHJlcXVlc3QgYW5kIGFkZHMgYSBCZWFyZXIgLyBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBub3Qga25vd24sIHRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gZmV0Y2ggaXRcclxuICAgICAqIGZpcnN0LiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGFsbW9zdCBleHBpcmluZywgdGhpcyBmdW5jdGlvbiBtaWdodCBhdHRlbXB0XHJcbiAgICAgKiB0byByZWZyZXNoIGl0LlxyXG4gICAgICovXHJcbiAgICBhc3luYyBmZXRjaChpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7XHJcblxyXG4gICAgICAgIGlmIChpbml0LmhlYWRlcnMpIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyBhY2Nlc3NUb2tlblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVycyA9IHtBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyBhY2Nlc3NUb2tlbn1cclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3B0aW9ucy5mZXRjaChpbnB1dCwgaW5pdCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUb2tlbiA9IGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyBuZXdUb2tlblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3B0aW9ucy5mZXRjaChpbnB1dCwgaW5pdClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgY3VycmVudCB0b2tlbiBpbmZvcm1hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGVyZSByZXN1bHQgb2JqZWN0IHdpbGwgaGF2ZTpcclxuICAgICAqICAgKiBhY2Nlc3NUb2tlblxyXG4gICAgICogICAqIGV4cGlyZXNBdCAtIHdoZW4gdGhlIHRva2VuIGV4cGlyZXMsIG9yIG51bGwuXHJcbiAgICAgKiAgICogcmVmcmVzaFRva2VuIC0gbWF5IGJlIG51bGxcclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYXR0ZW1wdCB0byBhdXRvbWF0aWNhbGx5IHJlZnJlc2ggaWYgc3RhbGUuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4gJiYgKHRoaXMudG9rZW4uZXhwaXJlc0F0ID09PSBudWxsIHx8IHRoaXMudG9rZW4uZXhwaXJlc0F0ID4gRGF0ZS5ub3coKSkpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IHRva2VuIGlzIHN0aWxsIHZhbGlkXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBjdXJyZW50IGFjY2VzcyB0b2tlbiBpcyBub3Qga25vd24sIGl0IHdpbGwgYXR0ZW1wdCB0byBmZXRjaCBpdC5cclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgZXhwaXJpbmcsIGl0IHdpbGwgYXR0ZW1wdCB0byByZWZyZXNoIGl0LlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRBY2Nlc3NUb2tlbigpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cclxuICAgICAgICAvLyBFbnN1cmUgZ2V0U3RvcmVkVG9rZW4gZmluaXNoZWQuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbjtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdldFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuLmFjY2Vzc1Rva2VuO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEtlZXBpbmcgdHJhY2sgb2YgYW4gYWN0aXZlIHJlZnJlc2hUb2tlbiBvcGVyYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyB3aWxsIGFsbG93IHVzIHRvIGVuc3VyZSBvbmx5IDEgc3VjaCBvcGVyYXRpb24gaGFwcGVucyBhdCBhbnlcclxuICAgICAqIGdpdmVuIHRpbWUuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlUmVmcmVzaDogUHJvbWlzZTxPQXV0aDJUb2tlbj4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvcmNlcyBhbiBhY2Nlc3MgdG9rZW4gcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBhc3luYyByZWZyZXNoVG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBjdXJyZW50bHkgYWxyZWFkeSBkb2luZyB0aGlzIG9wZXJhdGlvbixcclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGRvbid0IGRvIGl0IHR3aWNlIGluIHBhcmFsbGVsLlxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb2xkVG9rZW4gPSB0aGlzLnRva2VuO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IChhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3VG9rZW46IE9BdXRoMlRva2VuIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFRva2VuPy5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYWQgYSByZWZyZXNoIHRva2VuLCBsZXRzIHNlZSBpZiB3ZSBjYW4gdXNlIGl0IVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ob2xkVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignW29hdXRoMl0gcmVmcmVzaCB0b2tlbiBub3QgYWNjZXB0ZWQsIHdlXFwnbGwgdHJ5IHJlYXV0aGVudGljYXRpbmcnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdVbmFibGUgdG8gb2J0YWluIE9BdXRoMiB0b2tlbnMsIGEgZnVsbCByZWF1dGggbWF5IGJlIG5lZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3I/LihlcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdUb2tlbjtcclxuXHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnN0b3JlVG9rZW4/Lih0b2tlbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVSZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjbGVhciB0aGUgY3VycmVudCByZWZyZXNoIG9wZXJhdGlvbi5cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGltZXIgdHJpZ2dlciBmb3IgdGhlIG5leHQgYXV0b21hdGVkIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBzY2hlZHVsZVJlZnJlc2goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlZnJlc2hUaW1lcik7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b2tlbj8uZXhwaXJlc0F0IHx8ICF0aGlzLnRva2VuLnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBkb24ndCBrbm93IHdoZW4gdGhlIHRva2VuIGV4cGlyZXMsIG9yIGRvbid0IGhhdmUgYSByZWZyZXNoX3Rva2VuLCBkb24ndCBib3RoZXIuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHRoaXMudG9rZW4uZXhwaXJlc0F0IC0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgLy8gV2Ugb25seSBzY2hlZHVsZSB0aGlzIGV2ZW50IGlmIGl0IGhhcHBlbnMgbW9yZSB0aGFuIDIgbWludXRlcyBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIGlmIChleHBpcmVzSW4gPCAxMjAgKiAxMDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNjaGVkdWxlIDEgbWludXRlIGJlZm9yZSBleHBpcnlcclxuICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2ZldGNoLW13LW9hdXRoMl0gZXJyb3Igd2hpbGUgZG9pbmcgYSBiYWNrZ3JvdW5kIE9BdXRoMiBhdXRvLXJlZnJlc2gnLCBlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZXhwaXJlc0luIC0gNjAgKiAxMDAwKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgICBDbGllbnQsXHJcbiAgICBMb3RJbmZvLFxyXG4gICAgTG90SW5mb1dpdGhQcm9kdWN0SWQsIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyxcclxuICAgIFB1cmNoYXNlSW5mbywgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm9cclxufSBmcm9tIFwiLi9FYmF5Q2xpZW50L0ViYXlDbGllbnRcIlxyXG5cclxuaW1wb3J0IHtnZW5lcmF0ZUNvZGVWZXJpZmllciwgT0F1dGgyQ2xpZW50fSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuaW1wb3J0IHtGZXRjaFdyYXBwZXJDdXN0b219IGZyb20gXCIuL0ZldGNoV3JhcHBlckN1c3RvbVwiO1xyXG5cclxuY29uc3QgaWdub3JlVGhhdExvdEZpZWxkTmFtZSA9IFwiaWdub3JlVGhhdExvdFwiO1xyXG5jb25zdCBtYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZSA9IFwibWFudWFsQ29uZGl0aW9uSWRcIjtcclxuY29uc3QgcHJvZHVjdEZpZWxkTmFtZSA9IFwicHJvZHVjdElkXCI7XHJcbmNvbnN0IHBjc0ZpZWxkTmFtZSA9IFwicGNzXCI7XHJcblxyXG5jb25zdCBwYW5lbENsYXNzID0gXCJwYW5lbC1kaXZcIjtcclxuY29uc3QgZm9ybUlkID0gXCJwcm9kdWN0LWZvcm0taWRcIlxyXG5jb25zdCBlcnJvckVsZW1lbnRJZCA9IFwiZXJyb3JFbGVtZW50XCJcclxuY29uc3Qgc3VibWl0SWQgPSBcInN1Ym1pdFwiXHJcbi8vY29uc3QgYmFja2VuZFVybCA9IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA5NS9cIlxyXG5jb25zdCBiYWNrZW5kVXJsID0gXCJodHRwczovLzE3OC4yMDguNjUuMTAwOjE3NDQzL1wiXHJcbmNvbnN0IGJhc2VBcGlVcmwgPSBgJHtiYWNrZW5kVXJsfWFwaS9lYmF5L3YxYDtcclxuY29uc3QgYXV0aFJlZGlyZWN0VXJsID0gXCJodHRwczovL3d3dy5lYmF5LmNvbS9cIlxyXG5jb25zdCBub3RTZXRWYWx1ZSA9IFwibm90U2V0XCJcclxuY29uc3QgbGlnaHRHcmVlbkNvbG9yID0gXCIjZWNmZmVjXCJcclxuY29uc3QgbGlnaHRQaW5rQ29sb3IgPSBcImxpZ2h0cGlua1wiXHJcbmNvbnN0IGxpZ2h0WWVsbG93Q29sb3IgPSBcIiNlMGUwN2ZcIlxyXG5cclxuXHJcblxyXG5jb25zdCBsb3RJbmZvID0gbmV3IExvdEluZm8oKTtcclxubGV0IF9zZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZDtcclxuXHJcbi8vIGZldGNoINGH0LXRgNC10LcgYmFja2dyb3VuZCBzY3JpcHQsINC/0L4g0LTRgNGD0LPQvtC80YMg0L3QtSDRgNCw0LHQvtGC0LDQtdGCXHJcbmZ1bmN0aW9uIGZldGNoUmVzb3VyY2UoaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2lucHV0LCBpbml0fSwgbWVzc2FnZVJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgW3Jlc3BvbnNlLCBlcnJvcl0gPSBtZXNzYWdlUmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSB1bmRlZmluZWQgb24gYSAyMDQgLSBObyBDb250ZW50XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gcmVzcG9uc2UuYm9keSA/IG5ldyBCbG9iKFtyZXNwb25zZS5ib2R5XSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBleHRyYWN0UHJpY2UocHJpY2UpIHtcclxuICAgIGxldCBtYXRjaGVzID0gcHJpY2UubWF0Y2goLyhcXEQrKShcXGQrKD86WywuXVxcZCspPykvKVxyXG4gICAgaWYgKG1hdGNoZXNbMV0gIT09IFwiVVMgJFwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUyAkIHByaWNlIGV4cGVjdGVkLCBidXQgd2FzJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdChtYXRjaGVzWzJdLnJlcGxhY2UoJywnLCAnLicpKVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHN0eWxlcyA9IGBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgcGFkZGluZzogMTVweDtcclxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzAwMDBjYztcclxuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgY29sb3I6ICMwMDAwY2M7XHJcbiAgICAgIHBvc2l0aW9uOmZpeGVkO1xyXG4gICAgICB6LWluZGV4OjEwMDtcclxuICAgICAgbGVmdDoxJTtcclxuICAgICAgYm90dG9tOjUlO1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWwge1xyXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGlucHV0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBzZWxlY3Qge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsOmFmdGVyIHsgY29udGVudDogXCI6IFwiIH1cclxuYFxyXG5cclxuICAgIGxldCBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpXHJcbiAgICBzdHlsZVNoZWV0LmlubmVyVGV4dCA9IHN0eWxlc1xyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGVTaGVldClcclxuXHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChwYW5lbENsYXNzKTtcclxuXHJcblxyXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJylcclxuICAgIGZvcm0uaWQgPSBmb3JtSWRcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBkb21haW4gPSBsb2NhdGlvbi5ob3N0bmFtZTtcclxuXHJcbiAgICBsZXQgaGlzdG9yeUJ1dHRvbkhyZWYgPSBgaHR0cHM6Ly8ke2RvbWFpbn0vYmluL3B1cmNoYXNlSGlzdG9yeT9pdGVtPSR7aXRlbUlkfWA7XHJcbiAgICAvLyBsYW5ndWFnZT1IVE1MXHJcbiAgICBmb3JtLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8YSBocmVmPVwiJHtoaXN0b3J5QnV0dG9uSHJlZn1cIiB0YXJnZXQ9XCJfYmxhbmtcIj7QmNGB0YLQvtGA0LjRjyDQv9GA0L7QtNCw0LYg0LvQvtGC0LA8L2E+IFxyXG4gICAgICAgIDxicj7QkdGN0LrQtdC90LQ6IDxhIGhyZWY9XCIke2JhY2tlbmRVcmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtiYWNrZW5kVXJsfTwvYT5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCI+0JjQs9C90L7RgNC40YDQvtCy0LDRgtGMINC70L7RgjwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiIHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIj7QotC+0LLQsNGAPC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCIgaWQ9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7QktGL0LHQtdGA0LjRgtC1INGC0L7QstCw0YA8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cGNzRmllbGROYW1lfVwiPlBDUzwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtwY3NGaWVsZE5hbWV9XCIgdHlwZT1cIm51bWJlclwiIG5hbWU9XCIke3Bjc0ZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPtCh0L7RgdGC0L7Rj9C90LjQtTwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIiBpZD1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7QktGL0LHQtdGA0LjRgtC1INCh0L7RgdGC0L7Rj9C90LjQtTwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6IHJlZDtcIiBpZD1cIiR7ZXJyb3JFbGVtZW50SWR9XCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7c3VibWl0SWR9XCIgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2F2ZVwiIGRpc2FibGVkLz5cclxuICAgIGA7XHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoZXZlbnQsIGNsaWVudClcclxuICAgIH0pO1xyXG5cclxuICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKVxyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PmV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgICAgIGxldCBpZ25vcmVUaGF0TG90ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2lnbm9yZVRoYXRMb3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZ25vcmVUaGF0TG90ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mb1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbG90SW5mb1snaWdub3JlVGhhdExvdCddID0gaWdub3JlVGhhdExvdDtcclxuXHJcbiAgICAgICAgaWYgKGlnbm9yZVRoYXRMb3QpIHtcclxuICAgICAgICAgICAgbG90SW5mby5wY3MgPSAxXHJcbiAgICAgICAgICAgIGxvdEluZm8ubWFudWFsQ29uZGl0aW9uSWQgPSBub3RTZXRWYWx1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIHRvIGJhY2tlbmQ6IFwiICsgSlNPTi5zdHJpbmdpZnkobG90SW5mbykpXHJcblxyXG5cclxuICAgICAgICBhd2FpdCBjbGllbnQudXBzZXJ0TG90SW5mbyhsb3RJbmZvLCBkYXRhLmdldCgncHJvZHVjdElkJykudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBhd2FpdCBzaG93RXJyb3IoZXJyb3IpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxTb2xkSXRlbXNSZXN1bHQoZml4ZWRQcmljZVJvd3M6IEhUTUxUYWJsZVJvd0VsZW1lbnRbXSwgcmVzdWx0OiBQdXJjaGFzZUluZm9Jbm5lcltdKSB7XHJcbiAgICBmb3IgKGxldCBmaXhlZFByaWNlUm93IG9mIGZpeGVkUHJpY2VSb3dzKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbLi4uZml4ZWRQcmljZVJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCBwcmljZSA9IGNvbHVtbnNbMV1cclxuXHJcbiAgICAgICAgaWYgKHByaWNlID09PSBcIkV4cGlyZWRcIiB8fCBwcmljZSA9PT0gXCJEZWNsaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgIT09IFwiU29sZCBhcyBhIHNwZWNpYWwgb2ZmZXJcIiAmJiBwcmljZSAhPT0gXCJDb3VudGVyLW9mZmVyZWRcIiAmJiBwcmljZSAhPT0gXCJBY2NlcHRlZFwiKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgUHVyY2hhc2VJbmZvSW5uZXIocGFyc2VJbnQoY29sdW1uc1syXSksIHBhcnNlRGF0ZShjb2x1bW5zWzNdKSwgZXh0cmFjdFByaWNlKHByaWNlKSkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFB1cmNoYXNlSW5mb0lubmVyKHBhcnNlSW50KGNvbHVtbnNbMl0pLCBwYXJzZURhdGUoY29sdW1uc1szXSkpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHVyY2hhc2VJbmZvSW5uZXIge1xyXG4gICAgY29uc3RydWN0b3IocXVhbnRpdHk6IG51bWJlciwgZGF0ZTogRGF0ZSwgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlXHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlXHJcbiAgICB9XHJcblxyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIHByaWNlOiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkYXRlOiBEYXRlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlRGF0ZShkYXRlU3RyaW5nKTogRGF0ZSB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IGRhdGVTdHJpbmcubWF0Y2goLyhcXGQrXFxzW0Etel0rXFxzXFxkKylcXHNhdFxccyhcXGQrKTooXFxkKyk6KFxcZCspKGFtfHBtKVxccyhbQS16XSspLylcclxuXHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKERhdGUucGFyc2UobWF0Y2hlc1sxXSArICcgMDA6MDA6MDAuMDAwWicpKVxyXG5cclxuICAgIGRhdGUuc2V0VVRDSG91cnMocGFyc2VJbnQobWF0Y2hlc1syXSkpO1xyXG4gICAgZGF0ZS5zZXRVVENNaW51dGVzKHBhcnNlSW50KG1hdGNoZXNbM10pKTtcclxuICAgIGRhdGUuc2V0VVRDU2Vjb25kcyhwYXJzZUludChtYXRjaGVzWzRdKSk7XHJcblxyXG4gICAgaWYgKG1hdGNoZXNbNV0gPT09IFwicG1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgIT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgKyAxMik7XHJcbiAgICB9XHJcbiAgICBpZiAobWF0Y2hlc1s1XSA9PT0gXCJhbVwiICYmIGRhdGUuZ2V0VVRDSG91cnMoKSA9PT0gMTIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSAtIDEyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobWF0Y2hlc1s2XSA9PT0gXCJNU0tcIikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdGltZXpvbmUgXCIgKyBtYXRjaGVzWzZdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0OiBzdHJpbmcpOiBQdXJjaGFzZUluZm9bXSB7XHJcbiAgICBsZXQgZG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCBcInRleHQvaHRtbFwiKVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBuZXcgQXJyYXk8UHVyY2hhc2VJbmZvSW5uZXI+KCk7XHJcbiAgICBsZXQgZml4ZWRQcmljZUJsb2NrID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5maXhlZC1wcmljZSB0Ym9keScpXHJcbiAgICBpZiAoZml4ZWRQcmljZUJsb2NrICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZpeGVkUHJpY2VSb3dzID0gWy4uLmZpeGVkUHJpY2VCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCd0cicpXVxyXG4gICAgICAgIGZpbGxTb2xkSXRlbXNSZXN1bHQoZml4ZWRQcmljZVJvd3MsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9mZmVyQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2Lm9mZmVyIHRib2R5JylcclxuICAgIGlmIChvZmZlckJsb2NrICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IG9mZmVyUm93cyA9IFsuLi5vZmZlckJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChvZmZlclJvd3MsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGIuZGF0ZS5nZXRUaW1lKCkgLSBhLmRhdGUuZ2V0VGltZSgpO1xyXG4gICAgfSkubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQdXJjaGFzZUluZm8oe1xyXG4gICAgICAgICAgICBkYXRlOiB4LmRhdGUudG9JU09TdHJpbmcoKSwgcXVhbnRpdHk6IHgucXVhbnRpdHksIHByaWNlOiB4LnByaWNlXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsSWQoKSB7XHJcbiAgICBsb3RJbmZvLmxvdElkID0gcGFyc2VJbnQobG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV0pO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJpY2UoKSB7XHJcbiAgICBsb3RJbmZvLnByaWNlID0gZXh0cmFjdFByaWNlKCg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1wcmljZS1wcmltYXJ5IHNwYW4nKSkuaW5uZXJUZXh0KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTmFtZSgpIHtcclxuICAgIGxvdEluZm8ubmFtZSA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcudmltIGgxJykpLmlubmVyVGV4dFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsU2VsbGVyKCkge1xyXG4gICAgbG90SW5mby5zZWxsZXIgPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2Lngtc2VsbGVyY2FyZC1hdGZfX2luZm9fX2Fib3V0LXNlbGxlciBhJykpLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxDb25kaXRpb24oKSB7XHJcbiAgICBsb3RJbmZvLmNvbmRpdGlvbiA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1pdGVtLWNvbmRpdGlvbi10ZXh0IHNwYW4udXgtdGV4dHNwYW5zJykpLmlubmVyVGV4dFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LngtaXRlbS1jb25kaXRpb24tZGVzYycpXHJcbiAgICBpZiAoY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ICE9IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gKDxIVE1MRWxlbWVudD5jb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQpLmlubmVyVGV4dFxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCcJywgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCfigJ0nLCAnJylcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFNoaXBwaW5nKCkge1xyXG4gICAgbGV0IHNoaXBwaW5nRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuZC1zaGlwcGluZy1tYXh2aWV3JylcclxuICAgIGxldCBzaGlwcGluZ1JhdGVzQXZhaWxhYmxlID0gc2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcignZGl2LnV4LWxheW91dC1zZWN0aW9uX190ZXh0dWFsLWRpc3BsYXktLWFza1NlbGxlcicpID09PSBudWxsXHJcbiAgICBpZiAoc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSkge1xyXG4gICAgICAgIGxldCBzaGlwcGluZ1RhYmxlID0gc2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcigndGFibGUudXgtdGFibGUtc2VjdGlvbi13aXRoLWhpbnRzLS1zaGlwcGluZ1RhYmxlJylcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zSGVhZGVyID0gWy4uLnNoaXBwaW5nVGFibGUucXVlcnlTZWxlY3RvcigndGhlYWQnKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGgnKV1cclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zVmFsdWVzID0gWy4uLnNoaXBwaW5nVGFibGUucXVlcnlTZWxlY3RvcigndGJvZHknKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcigndHInKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nTWF4dmlld1ZhbHVlcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gZGVsaXZlcnlDb2x1bW5zSGVhZGVyW2ldLmlubmVyVGV4dFxyXG4gICAgICAgICAgICBzaGlwcGluZ01heHZpZXdWYWx1ZXNba2V5XSA9IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlc1tpXS5xdWVyeVNlbGVjdG9yKCdzcGFuJykuaW5uZXJUZXh0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydUbyddICE9PSAnR2VybWFueScpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwcGluZyBjb3VudHJ5IG11c3QgYmUgR2VybWFueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nVmFsdWUgPSBzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ1NoaXBwaW5nIGFuZCBoYW5kbGluZyddXHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ1ZhbHVlICE9PSAnRnJlZSBzaGlwcGluZycpIHtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZyA9IGV4dHJhY3RQcmljZShzaGlwcGluZ1ZhbHVlKVxyXG5cclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlcy5oYXNPd25Qcm9wZXJ0eSgnRWFjaCBhZGRpdGlvbmFsIGl0ZW0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlYWNoQWRkaXRpb25hbCA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snRWFjaCBhZGRpdGlvbmFsIGl0ZW0nXVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYWNoQWRkaXRpb25hbCAhPT0gXCJGcmVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IGV4dHJhY3RQcmljZShlYWNoQWRkaXRpb25hbClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTG9jYXRlZEluKCkge1xyXG4gICAgbGV0IG1hdGNoID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi5kLXNoaXBwaW5nLW1pbnZpZXcnKSkuaW5uZXJUZXh0Lm1hdGNoKC9Mb2NhdGVkXFxzaW46XFxzKC4rKS8pXHJcbiAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmxvY2F0ZWRJbiA9IG1hdGNoWzFdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvdEluZm8ubG9jYXRlZEluID0gXCJVbmtub3duXCJcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbERlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGRlc2NyaXB0aW9uVXJsID0gKDxIVE1MSUZyYW1lRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJyNkZXNjX2lmcicpKS5zcmNcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoUmVzb3VyY2UoZGVzY3JpcHRpb25VcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxvdEluZm8uZGVzY3JpcHRpb24gPSBhd2FpdCByZXNwb25zZS50ZXh0KClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFB1cmNoYXNlSGlzdG9yeSgpIHtcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBwdXJjaGFzZUhpc3RvcnlVcmwgPSBgaHR0cHM6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoUmVzb3VyY2UocHVyY2hhc2VIaXN0b3J5VXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pXHJcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgbG90SW5mby5wdXJjaGFzZUhpc3RvcnkgPSBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2VhcmNoUXVlcnkoKSA6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAoZG9jdW1lbnQucmVmZXJyZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFVSTChkb2N1bWVudC5yZWZlcnJlcikuc2VhcmNoUGFyYW1zPy5nZXQoJ19ua3cnKT8udHJpbSgpPy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJvZHVjdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHByb2R1Y3RGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgcHJvZHVjdEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RJZCA9IHNlcnZlckxvdEluZm8/LnByb2R1Y3RJZD8udHJpbSgpPy50b0xvd2VyQ2FzZSgpXHJcbiAgICBsZXQgc2VhcmNoUXVlcnkgPSBnZXRTZWFyY2hRdWVyeSgpO1xyXG5cclxuICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IGNsaWVudC5nZXRBbGxQcm9kdWN0cygpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHByb2R1Y3RzW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBwcm9kdWN0c1tpXS5uYW1lO1xyXG5cclxuICAgICAgICBpZiAocHJvZHVjdElkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHNbaV0uaWQudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwcm9kdWN0c1tpXS5zZWFyY2hRdWVyaWVzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hRdWVyeSA9PT0geC5xdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2R1Y3RGaWVsZC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTWFudWFsQ29uZGl0aW9uKHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgY2xpZW50OiBDbGllbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9uRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QjJyArIG1hbnVhbENvbmRpdGlvbklkRmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9uSWQgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5tYW51YWxDb25kaXRpb25JZD8udHJpbSgpPy50b0xvd2VyQ2FzZSgpXHJcblxyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbnMgPSBhd2FpdCBjbGllbnQuZ2V0TWFudWFsQ29uZGl0aW9uc0xpc3QoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYW51YWxDb25kaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IG1hbnVhbENvbmRpdGlvbnNbaV0uaWQ7XHJcbiAgICAgICAgb3B0LmlubmVySFRNTCA9IG1hbnVhbENvbmRpdGlvbnNbaV0uZGVzY3JpcHRpb247XHJcblxyXG4gICAgICAgIGlmIChtYW51YWxDb25kaXRpb25JZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChtYW51YWxDb25kaXRpb25JZCA9PT0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYW51YWxDb25kaXRpb25GaWVsZC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudDogQ2xpZW50KTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBfc2VydmVyTG90SW5mbyA9IGF3YWl0IGNsaWVudC5nZXRMb3RJbmZvKGxvdEluZm8ubG90SWQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUGNzKHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBwY3NGaWVsZCA9IDxIVE1MSW5wdXRFbGVtZW50PnBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBwY3NGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5wY3NcclxuICAgIGlmIChzZXJ2ZXJQY3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHBjc0ZpZWxkLnZhbHVlID0gc2VydmVyUGNzLnRvU3RyaW5nKClcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbElnbm9yZVRoYXRMb3QocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IGlnbm9yZVRoYXRMb3RGaWVsZCA9IDxIVE1MSW5wdXRFbGVtZW50PnBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBpZ25vcmVUaGF0TG90RmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgc2VydmVyUGNzID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8uaWdub3JlVGhhdExvdFxyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWdub3JlVGhhdExvdEZpZWxkLmNoZWNrZWQgPSBzZXJ2ZXJQY3NcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvbXBhcmVMb3RJbmZvcyhzZXJ2ZXJMb3RJbmZvV2l0aFByb2R1Y3RJZDogTG90SW5mb1dpdGhQcm9kdWN0SWQpIHtcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvV2l0aFByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICBsZXQgc2VydmVyTG90SW5mb0pzb24gPSBzZXJ2ZXJMb3RJbmZvV2l0aFByb2R1Y3RJZC5sb3RJbmZvLnRvSlNPTigpXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcInBjc1wiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJpZ25vcmVUaGF0TG90XCJdID0gdW5kZWZpbmVkXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsZXQgc2VydmVyUHVyY2hhc2VIaXN0b3J5ID0gc2VydmVyTG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl1cclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gdW5kZWZpbmVkXHJcbiAgICBsZXQgbG90SW5mb0pzb24gPSBsb3RJbmZvLnRvSlNPTigpXHJcbiAgICBsb3RJbmZvSnNvbltcInBjc1wiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJpZ25vcmVUaGF0TG90XCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsZXQgbG90SW5mb1B1cmNoYXNlSGlzdG9yeSA9IGxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdO1xyXG4gICAgbG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl0gPSB1bmRlZmluZWRcclxuICAgIFxyXG4gICAgbGV0IHNlcnZlckxvdEluZm9Kc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoc2VydmVyTG90SW5mb0pzb24pXHJcbiAgICBsZXQgY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm9Kc29uKVxyXG4gICAgbGV0IHNlcnZlclB1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXJ2ZXJQdXJjaGFzZUhpc3RvcnkpXHJcbiAgICBsZXQgbG90SW5mb1B1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvUHVyY2hhc2VIaXN0b3J5KVxyXG5cclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcyk7XHJcbiAgICBpZiAoc2VydmVyTG90SW5mb0pzb25TdHJpbmcgPT09IGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGxvdEluZm9QdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nKVxyXG4gICAgICAgIGlmIChfc2VydmVyTG90SW5mby5sb3RJbmZvLmlnbm9yZVRoYXRMb3QgPT09IHRydWUgfHwgc2VydmVyUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9PT0gbG90SW5mb1B1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpIHtcclxuICAgICAgICAgICAgcGFuZWwuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0R3JlZW5Db2xvcn07YFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRZZWxsb3dDb2xvcn07YFxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFuZWwuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0UGlua0NvbG9yfTtgXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBmcm9tIHNlcnZlcjogXCIgKyBzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZylcclxuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudFBhZ2U6IFwiICsgY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZylcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YUZyb21QYWdlKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgcGFuZWwgPSA8SFRNTERpdkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MpXHJcblxyXG4gICAgZmlsbElkKCk7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFByaWNlKCksXHJcbiAgICAgICAgZmlsbE5hbWUoKSxcclxuICAgICAgICBmaWxsU2VsbGVyKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbigpLFxyXG4gICAgICAgIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGZpbGxMb2NhdGVkSW4oKSxcclxuICAgICAgICBmaWxsRGVzY3JpcHRpb24oKSxcclxuICAgICAgICBmaWxsUHVyY2hhc2VIaXN0b3J5KCksXHJcbiAgICAgICAgZ2V0U2VydmVyTG90SW5mbyhjbGllbnQpXHJcbiAgICBdKVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIGZpbGxQcm9kdWN0KHBhbmVsLCBjbGllbnQsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsTWFudWFsQ29uZGl0aW9uKHBhbmVsLCBjbGllbnQsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsUGNzKHBhbmVsLCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbElnbm9yZVRoYXRMb3QocGFuZWwsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsU2hpcHBpbmcoKSxcclxuICAgIF0pO1xyXG4gICAgXHJcbiAgICBhd2FpdCBjb21wYXJlTG90SW5mb3MoX3NlcnZlckxvdEluZm8pO1xyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYWRkUGFuZWwoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBib2R5RWxlbWVudCA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnYm9keScpO1xyXG4gICAgaWYgKGJvZHlFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGV4aXN0aW5nUGFuZWwgPSBib2R5RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuJyArIHBhbmVsQ2xhc3MpO1xyXG4gICAgICAgIGlmICghZXhpc3RpbmdQYW5lbCkge1xyXG4gICAgICAgICAgICBjcmVhdGVQYW5lbChib2R5RWxlbWVudCwgY2xpZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvcjogRXJyb3IpIHtcclxuICAgIGxldCBlcnJvckRpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzICsgJyAjJyArIGVycm9yRWxlbWVudElkKVxyXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGlvbkVycm9yID0gPFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvPmVycm9yXHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSBcItCe0YjQuNCx0LrQsCDQstCw0LvQuNC00LDRhtC40Lg6IFwiICsgSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvbkVycm9yLmVycm9ycylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3Iuc3RhY2spXHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSBlcnJvci5zdGFjaztcclxuICAgIH1cclxuXHJcbiAgICBlcnJvckRpdi5hcHBlbmRDaGlsZChzcGFuKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBlbmFibGVTdWJtaXRCdXR0b24oKSB7XHJcbiAgICAoPEhUTUxCdXR0b25FbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnIycgKyBzdWJtaXRJZCkpLmRpc2FibGVkID0gZmFsc2VcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXV0aG9yaXplRmV0Y2gob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpOiBGZXRjaFdyYXBwZXJDdXN0b20ge1xyXG4gICAgcmV0dXJuIG5ldyBGZXRjaFdyYXBwZXJDdXN0b20oe1xyXG4gICAgICAgIGNsaWVudDogb0F1dGgyQ2xpZW50LFxyXG4gICAgICAgIGdldE5ld1Rva2VuOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKS5jb2RlX3ZlcmlmaWVyO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGF3YWl0IG9BdXRoMkNsaWVudC5hdXRob3JpemF0aW9uQ29kZS5nZXRBdXRob3JpemVVcmkoe1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllcixcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBbJ0ViYXkuU2VydmVyQVBJJ11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0U3RvcmVkVG9rZW46IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGJhY2tlbmRVcmwgIT09IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiYmFja2VuZF91cmxcIl0pKS5iYWNrZW5kX3VybCkgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRva2VuX3N0b3JlXCJdKSkudG9rZW5fc3RvcmU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIEpTT04ucGFyc2UodG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoaWRlRXJyb3JzKCkge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQpXHJcbiAgICBlcnJvckRpdi5pbm5lckhUTUwgPSBcIlwiXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByb2R1Y3RQYWdlKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInByb2R1Y3RQYWdlXCIpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGFkZFBhbmVsKGNsaWVudCk7XHJcbiAgICAgICAgYXdhaXQgZ2V0RGF0YUZyb21QYWdlKGNsaWVudCk7XHJcbiAgICAgICAgYXdhaXQgZW5hYmxlU3VibWl0QnV0dG9uKClcclxuICAgICAgICBhd2FpdCBoaWRlRXJyb3JzKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgYXdhaXQgc2hvd0Vycm9yKGVycm9yKTtcclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYXV0aFBhZ2Uob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiYXV0aFBhZ2VcIilcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJjb2RlXCIpKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcbiAgICAgICAgbGV0IG9hdXRoMlRva2VuID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2JhY2tlbmRfdXJsOiBiYWNrZW5kVXJsfSlcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe3Rva2VuX3N0b3JlOiBKU09OLnN0cmluZ2lmeShvYXV0aDJUb2tlbil9KVxyXG5cclxuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gYXV0aFJlZGlyZWN0VXJsXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBzZWFyY2hQYWdlKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlNlYXJjaFBhZ2VcIilcclxuICAgIC8v0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDQv9GA0L7QtNCw0L3Ri9C1INC70L7RgtGLXHJcbiAgICBpZiAobmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXM/LmdldCgnTEhfU29sZCcpPy50cmltKCkgIT09IFwiMVwiKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHNlYXJjaFJlc3VsdHMgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ3VsLnNycC1yZXN1bHRzJylcclxuXHJcbiAgICBsZXQgbGlua3MgPSBbLi4uc2VhcmNoUmVzdWx0cy5xdWVyeVNlbGVjdG9yQWxsKCdsaS5zLWl0ZW0nKV1cclxuICAgICAgICAubWFwKGZ1bmN0aW9uICh4OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgbGluayA9IDxIVE1MQW5jaG9yRWxlbWVudD54LnF1ZXJ5U2VsZWN0b3IoJ2Eucy1pdGVtX19saW5rJylcclxuICAgICAgICAgICAgbGV0IHNvbGREYXRlID0gbmV3IERhdGUoKDxIVE1MRWxlbWVudD54LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uUE9TSVRJVkUnKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJTb2xkIFwiLCBcIlwiKSlcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMb3RMaW5rKHBhcnNlSW50KGxpbmsuaHJlZi5tYXRjaCgvaHR0cHM6XFwvXFwvW15cXC9dK1xcL2l0bVxcLyhcXGQrKS8pWzFdKSwgbGluaywgc29sZERhdGUpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgbGV0IF8gPSB1cGRhdGVTdGF0dXNJbmZpbml0ZShjbGllbnQsIGxpbmtzKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RhdHVzSW5maW5pdGUoY2xpZW50OiBDbGllbnQsIGxpbmtzOiBMb3RMaW5rW10pIHtcclxuICAgIGxldCBpZHMgPSBsaW5rcy5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geC5pZFxyXG4gICAgfSlcclxuICAgIC8vIG5vaW5zcGVjdGlvbiBJbmZpbml0ZUxvb3BKU1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nTG90U3RhdGVzXCIpXHJcbiAgICAgICAgICAgIGxldCBnZXRMb3RTdGF0ZXNBbnN3ZXIgPSBhd2FpdCBjbGllbnQuZ2V0TG90U3RhdGVzKGlkcylcclxuXHJcbiAgICAgICAgICAgIGxldCBrbm93bkxvdHMgPSBuZXcgTWFwKGdldExvdFN0YXRlc0Fuc3dlci5tYXAocCA9PiBbcC5sb3RJZCwgcF0pKTtcclxuXHJcbiAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29sb3IgPSB4LmNvbG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrbm93bkxvdHMuaGFzKHguaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvdFN0YXRlID0ga25vd25Mb3RzLmdldCh4LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG90U3RhdGUuaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGlmZkluRGF5cyA9IE1hdGguY2VpbCgoeC5zb2xkRGF0ZS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShsb3RTdGF0ZS5sYXN0VXBkYXRlKS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmZJbkRheXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRZZWxsb3dDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpZmZJbkRheXMpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0UGlua0NvbG9yXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHguY29sb3IgIT09IG51bGwgJiYgY29sb3IgIT09IHguY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB4Lmxpbmsuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke3guY29sb3J9O2BcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwMClcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTG90TGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudCwgc29sZERhdGU6IERhdGUpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWRcclxuICAgICAgICB0aGlzLmxpbmsgPSBsaW5rXHJcbiAgICAgICAgdGhpcy5zb2xkRGF0ZSA9IHNvbGREYXRlXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBpZDogbnVtYmVyO1xyXG4gICAgbGluazogSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICBzb2xkRGF0ZTogRGF0ZVxyXG4gICAgY29sb3I6IHN0cmluZyB8IG51bGxcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBFbGVtZW50TG9hZGVkKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEVsZW1lbnQ+IHtcclxuICAgIGxldCByZXRyeSA9IDBcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcmV0cnkrKztcclxuICAgICAgICBpZiAocmV0cnkgPiAxMDAwKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yIFwiICsgc2VsZWN0b3IpXHJcblxyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcclxuICAgICAgICBpZiAoZWxlbWVudCAhPT0gbnVsbCkgcmV0dXJuIGVsZW1lbnRcclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2F2ZUNvZGVWZXJpZmllcigpIHtcclxuICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKT8uY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICBpZiAoY29kZVZlcmlmaWVyID09PSBudWxsIHx8IGNvZGVWZXJpZmllciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IGF3YWl0IGdlbmVyYXRlQ29kZVZlcmlmaWVyKCk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXJ9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdmb290ZXInKVxyXG4gICAgYXdhaXQgc2F2ZUNvZGVWZXJpZmllcigpO1xyXG5cclxuICAgIGxldCBvQXV0aDJDbGllbnQgPSBuZXcgT0F1dGgyQ2xpZW50KHtcclxuICAgICAgICBzZXJ2ZXI6IGJhY2tlbmRVcmwsXHJcbiAgICAgICAgY2xpZW50SWQ6ICdFYmF5LkNocm9tZUV4dGVuc2lvbicsXHJcbiAgICAgICAgdG9rZW5FbmRwb2ludDogJy9jb25uZWN0L3Rva2VuJyxcclxuICAgICAgICBhdXRob3JpemF0aW9uRW5kcG9pbnQ6ICcvY29ubmVjdC9hdXRob3JpemUnLFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgY3VycmVudFBhZ2UgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgbG9jYXRpb24ucGF0aG5hbWVcclxuXHJcbiAgICBpZiAoY3VycmVudFBhZ2UgPT09IGF1dGhSZWRpcmVjdFVybCkge1xyXG4gICAgICAgIGF3YWl0IGF1dGhQYWdlKG9BdXRoMkNsaWVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjbGllbnQgPSBuZXcgQ2xpZW50KGJhc2VBcGlVcmwsIGdldEF1dGhvcml6ZUZldGNoKG9BdXRoMkNsaWVudCkpO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIikpIHtcclxuICAgICAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9zY2gvXCIpKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNlYXJjaFBhZ2UoY2xpZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9