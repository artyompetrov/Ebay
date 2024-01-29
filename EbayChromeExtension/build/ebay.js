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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudC9icm93c2VyL29hdXRoMi1jbGllbnQubWluLmpzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL0ViYXlDbGllbnQvRWJheUNsaWVudC50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9GZXRjaFdyYXBwZXJDdXN0b20udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbWFpbi50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuT0F1dGgyQ2xpZW50PXQoKTplLk9BdXRoMkNsaWVudD10KCl9KHNlbGYsKCgpPT4oKCk9Pnt2YXIgZT17OTM0OihlLHQscik9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmdlbmVyYXRlUXVlcnlTdHJpbmc9dC5PQXV0aDJDbGllbnQ9dm9pZCAwO2NvbnN0IG49cig0NDMpLGk9cig2MTgpO2Z1bmN0aW9uIG8oZSx0KXtyZXR1cm4gbmV3IFVSTChlLHQpLnRvU3RyaW5nKCl9ZnVuY3Rpb24gcyhlKXtyZXR1cm4gbmV3IFVSTFNlYXJjaFBhcmFtcyhPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZSkuZmlsdGVyKCgoW2UsdF0pPT52b2lkIDAhPT10KSkpKS50b1N0cmluZygpfXQuT0F1dGgyQ2xpZW50PWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMuZGlzY292ZXJ5RG9uZT0hMSx0aGlzLnNlcnZlck1ldGFkYXRhPW51bGwsKG51bGw9PWU/dm9pZCAwOmUuZmV0Y2gpfHwoZS5mZXRjaD1mZXRjaC5iaW5kKGdsb2JhbFRoaXMpKSx0aGlzLnNldHRpbmdzPWV9YXN5bmMgcmVmcmVzaFRva2VuKGUpe2lmKCFlLnJlZnJlc2hUb2tlbil0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHRva2VuIGRpZG4ndCBoYXZlIGEgcmVmcmVzaFRva2VuLiBJdCdzIG5vdCBwb3NzaWJsZSB0byByZWZyZXNoIHRoaXNcIik7Y29uc3QgdD17Z3JhbnRfdHlwZTpcInJlZnJlc2hfdG9rZW5cIixyZWZyZXNoX3Rva2VuOmUucmVmcmVzaFRva2VufTtyZXR1cm4gdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXR8fCh0LmNsaWVudF9pZD10aGlzLnNldHRpbmdzLmNsaWVudElkKSx0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIix0KSl9YXN5bmMgY2xpZW50Q3JlZGVudGlhbHMoZSl7dmFyIHQ7Y29uc3Qgcj1bXCJjbGllbnRfaWRcIixcImNsaWVudF9zZWNyZXRcIixcImdyYW50X3R5cGVcIixcInNjb3BlXCJdO2lmKChudWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zKSYmT2JqZWN0LmtleXMoZS5leHRyYVBhcmFtcykuZmlsdGVyKChlPT5yLmluY2x1ZGVzKGUpKSkubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIGV4dHJhUGFyYW1zIGFyZSBkaXNhbGxvd2VkOiAnJHtyLmpvaW4oXCInLCAnXCIpfSdgKTtjb25zdCBuPXtncmFudF90eXBlOlwiY2xpZW50X2NyZWRlbnRpYWxzXCIsc2NvcGU6bnVsbD09PSh0PW51bGw9PWU/dm9pZCAwOmUuc2NvcGUpfHx2b2lkIDA9PT10P3ZvaWQgMDp0LmpvaW4oXCIgXCIpLC4uLm51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXN9O2lmKCF0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCl0aHJvdyBuZXcgRXJyb3IoXCJBIGNsaWVudFNlY3JldCBtdXN0IGJlIHByb3ZpZGVkIHRvIHVzZSBjbGllbnRfY3JlZGVudGlhbHNcIik7cmV0dXJuIHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLG4pKX1hc3luYyBwYXNzd29yZChlKXt2YXIgdDtjb25zdCByPXtncmFudF90eXBlOlwicGFzc3dvcmRcIiwuLi5lLHNjb3BlOm51bGw9PT0odD1lLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKX07cmV0dXJuIHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHIpKX1nZXQgYXV0aG9yaXphdGlvbkNvZGUoKXtyZXR1cm4gbmV3IGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQodGhpcyl9YXN5bmMgaW50cm9zcGVjdChlKXtjb25zdCB0PXt0b2tlbjplLmFjY2Vzc1Rva2VuLHRva2VuX3R5cGVfaGludDpcImFjY2Vzc190b2tlblwifTtyZXR1cm4gdGhpcy5yZXF1ZXN0KFwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCIsdCl9YXN5bmMgZ2V0RW5kcG9pbnQoZSl7aWYodm9pZCAwIT09dGhpcy5zZXR0aW5nc1tlXSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZihcImRpc2NvdmVyeUVuZHBvaW50XCIhPT1lJiYoYXdhaXQgdGhpcy5kaXNjb3ZlcigpLHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pKXJldHVybiBvKHRoaXMuc2V0dGluZ3NbZV0sdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2lmKCF0aGlzLnNldHRpbmdzLnNlcnZlcil0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBkZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mICR7ZX0uIEVpdGhlciBzcGVjaWZ5ICR7ZX0gaW4gdGhlIHNldHRpbmdzLCBvciB0aGUgXCJzZXJ2ZXJcIiBlbmRwb2ludCB0byBsZXQgdGhlIGNsaWVudCBkaXNjb3ZlciBpdC5gKTtzd2l0Y2goZSl7Y2FzZVwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvYXV0aG9yaXplXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcInRva2VuRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi90b2tlblwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJkaXNjb3ZlcnlFbmRwb2ludFwiOnJldHVybiBvKFwiLy53ZWxsLWtub3duL29hdXRoLWF1dGhvcml6YXRpb24tc2VydmVyXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcImludHJvc3BlY3Rpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2ludHJvc3BlY3RcIix0aGlzLnNldHRpbmdzLnNlcnZlcil9fWFzeW5jIGRpc2NvdmVyKCl7dmFyIGU7aWYodGhpcy5kaXNjb3ZlcnlEb25lKXJldHVybjtsZXQgdDt0aGlzLmRpc2NvdmVyeURvbmU9ITA7dHJ5e3Q9YXdhaXQgdGhpcy5nZXRFbmRwb2ludChcImRpc2NvdmVyeUVuZHBvaW50XCIpfWNhdGNoKGUpe3JldHVybiB2b2lkIGNvbnNvbGUud2FybignW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gRWl0aGVyIHNwZWNpZnkgdGhlIFwic2VydmVyXCIgb3IgXCJkaXNjb3ZlcnlFbmRwb2ludCcpfWNvbnN0IHI9YXdhaXQgdGhpcy5zZXR0aW5ncy5mZXRjaCh0LHtoZWFkZXJzOntBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uXCJ9fSk7aWYoIXIub2spcmV0dXJuO2lmKCEobnVsbD09PShlPXIuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikpfHx2b2lkIDA9PT1lP3ZvaWQgMDplLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSlyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oXCJbb2F1dGgyXSBPQXV0aDIgZGlzY292ZXJ5IGVuZHBvaW50IHdhcyBub3QgYSBKU09OIHJlc3BvbnNlLiBSZXNwb25zZSBpcyBpZ25vcmVkXCIpO3RoaXMuc2VydmVyTWV0YWRhdGE9YXdhaXQgci5qc29uKCk7Y29uc3Qgbj1bW1wiYXV0aG9yaXphdGlvbl9lbmRwb2ludFwiLFwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCJdLFtcInRva2VuX2VuZHBvaW50XCIsXCJ0b2tlbkVuZHBvaW50XCJdLFtcImludHJvc3BlY3Rpb25fZW5kcG9pbnRcIixcImludHJvc3BlY3Rpb25FbmRwb2ludFwiXV07aWYobnVsbCE9PXRoaXMuc2VydmVyTWV0YWRhdGEpe2Zvcihjb25zdFtlLHJdb2Ygbil0aGlzLnNlcnZlck1ldGFkYXRhW2VdJiYodGhpcy5zZXR0aW5nc1tyXT1vKHRoaXMuc2VydmVyTWV0YWRhdGFbZV0sdCkpO3RoaXMuc2VydmVyTWV0YWRhdGEudG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2RzX3N1cHBvcnRlZCYmIXRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2QmJih0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kPXRoaXMuc2VydmVyTWV0YWRhdGEudG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2RzX3N1cHBvcnRlZFswXSl9fWFzeW5jIHJlcXVlc3QoZSx0KXtjb25zdCByPWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoZSksaT17XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwifTtsZXQgbz10aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kO3N3aXRjaChvfHwobz10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldD9cImNsaWVudF9zZWNyZXRfYmFzaWNcIjpcImNsaWVudF9zZWNyZXRfcG9zdFwiKSxvKXtjYXNlXCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6aS5BdXRob3JpemF0aW9uPVwiQmFzaWMgXCIrYnRvYSh0aGlzLnNldHRpbmdzLmNsaWVudElkK1wiOlwiK3RoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KTticmVhaztjYXNlXCJjbGllbnRfc2VjcmV0X3Bvc3RcIjp0LmNsaWVudF9pZD10aGlzLnNldHRpbmdzLmNsaWVudElkLHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYodC5jbGllbnRfc2VjcmV0PXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIkF1dGhlbnRpY2F0aW9uIG1ldGhvZCBub3QgeWV0IHN1cHBvcnRlZDpcIitvK1wiLiBPcGVuIGEgZmVhdHVyZSByZXF1ZXN0IGlmIHlvdSB3YW50IHRoaXMhXCIpfWNvbnN0IGE9YXdhaXQgdGhpcy5zZXR0aW5ncy5mZXRjaChyLHttZXRob2Q6XCJQT1NUXCIsYm9keTpzKHQpLGhlYWRlcnM6aX0pO2lmKGEub2spcmV0dXJuIGF3YWl0IGEuanNvbigpO2xldCBjLGgsdTt0aHJvdyBhLmhlYWRlcnMuaGFzKFwiQ29udGVudC1UeXBlXCIpJiZhLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpJiYoYz1hd2FpdCBhLmpzb24oKSksKG51bGw9PWM/dm9pZCAwOmMuZXJyb3IpPyhoPVwiT0F1dGgyIGVycm9yIFwiK2MuZXJyb3IrXCIuXCIsYy5lcnJvcl9kZXNjcmlwdGlvbiYmKGgrPVwiIFwiK2MuZXJyb3JfZGVzY3JpcHRpb24pLHU9Yy5lcnJvcik6KGg9XCJIVFRQIEVycm9yIFwiK2Euc3RhdHVzK1wiIFwiK2Euc3RhdHVzVGV4dCw0MDE9PT1hLnN0YXR1cyYmdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQmJihoKz1cIi4gSXQncyBsaWtlbHkgdGhhdCB0aGUgY2xpZW50SWQgYW5kL29yIGNsaWVudFNlY3JldCB3YXMgaW5jb3JyZWN0XCIpLHU9bnVsbCksbmV3IG4uT0F1dGgyRXJyb3IoaCx1LGEuc3RhdHVzKX10b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbihlKXtyZXR1cm4gZS50aGVuKChlPT57dmFyIHQ7cmV0dXJue2FjY2Vzc1Rva2VuOmUuYWNjZXNzX3Rva2VuLGV4cGlyZXNBdDplLmV4cGlyZXNfaW4/RGF0ZS5ub3coKSsxZTMqZS5leHBpcmVzX2luOm51bGwscmVmcmVzaFRva2VuOm51bGwhPT0odD1lLnJlZnJlc2hfdG9rZW4pJiZ2b2lkIDAhPT10P3Q6bnVsbH19KSl9fSx0LmdlbmVyYXRlUXVlcnlTdHJpbmc9c30sNjE4OihlLHQscik9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmdldENvZGVDaGFsbGVuZ2U9dC5nZW5lcmF0ZUNvZGVWZXJpZmllcj10Lk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoOTM0KSxpPXIoNDQzKTthc3luYyBmdW5jdGlvbiBvKGUpe2NvbnN0IHQ9cygpO2lmKG51bGw9PXQ/dm9pZCAwOnQuc3VidGxlKXJldHVybltcIlMyNTZcIixjKGF3YWl0IHQuc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIixhKGUpKSldO3tjb25zdCB0PXIoMjEyKS5jcmVhdGVIYXNoKFwic2hhMjU2XCIpO3JldHVybiB0LnVwZGF0ZShhKGUpKSxbXCJTMjU2XCIsdC5kaWdlc3QoXCJiYXNlNjR1cmxcIildfX1mdW5jdGlvbiBzKCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LmNyeXB0bylyZXR1cm4gd2luZG93LmNyeXB0bztpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmc2VsZi5jcnlwdG8pcmV0dXJuIHNlbGYuY3J5cHRvO2NvbnN0IGU9cigyMTIpO3JldHVybiBlLndlYmNyeXB0bz9lLndlYmNyeXB0bzpudWxsfWZ1bmN0aW9uIGEoZSl7Y29uc3QgdD1uZXcgVWludDhBcnJheShlLmxlbmd0aCk7Zm9yKGxldCByPTA7cjxlLmxlbmd0aDtyKyspdFtyXT0yNTUmZS5jaGFyQ29kZUF0KHIpO3JldHVybiB0fWZ1bmN0aW9uIGMoZSl7cmV0dXJuIGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi5uZXcgVWludDhBcnJheShlKSkpLnJlcGxhY2UoL1xcKy9nLFwiLVwiKS5yZXBsYWNlKC9cXC8vZyxcIl9cIikucmVwbGFjZSgvPSskLyxcIlwiKX10Lk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMuY2xpZW50PWV9YXN5bmMgZ2V0QXV0aG9yaXplVXJpKGUpe2NvbnN0W3Qscl09YXdhaXQgUHJvbWlzZS5hbGwoW2UuY29kZVZlcmlmaWVyP28oZS5jb2RlVmVyaWZpZXIpOnZvaWQgMCx0aGlzLmNsaWVudC5nZXRFbmRwb2ludChcImF1dGhvcml6YXRpb25FbmRwb2ludFwiKV0pO2xldCBpPXtjbGllbnRfaWQ6dGhpcy5jbGllbnQuc2V0dGluZ3MuY2xpZW50SWQscmVzcG9uc2VfdHlwZTpcImNvZGVcIixyZWRpcmVjdF91cmk6ZS5yZWRpcmVjdFVyaSxjb2RlX2NoYWxsZW5nZV9tZXRob2Q6bnVsbD09dD92b2lkIDA6dFswXSxjb2RlX2NoYWxsZW5nZTpudWxsPT10P3ZvaWQgMDp0WzFdfTtlLnN0YXRlJiYoaS5zdGF0ZT1lLnN0YXRlKSxlLnNjb3BlJiYoaS5zY29wZT1lLnNjb3BlLmpvaW4oXCIgXCIpKTtjb25zdCBzPU9iamVjdC5rZXlzKGkpO2lmKChudWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zKSYmT2JqZWN0LmtleXMoZS5leHRyYVBhcmFtcykuZmlsdGVyKChlPT5zLmluY2x1ZGVzKGUpKSkubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIGV4dHJhUGFyYW1zIGFyZSBkaXNhbGxvd2VkOiAnJHtzLmpvaW4oXCInLCAnXCIpfSdgKTtyZXR1cm4gaT17Li4uaSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfSxyK1wiP1wiKygwLG4uZ2VuZXJhdGVRdWVyeVN0cmluZykoaSl9YXN5bmMgZ2V0VG9rZW5Gcm9tQ29kZVJlZGlyZWN0KGUsdCl7Y29uc3R7Y29kZTpyfT1hd2FpdCB0aGlzLnZhbGlkYXRlUmVzcG9uc2UoZSx7c3RhdGU6dC5zdGF0ZX0pO3JldHVybiB0aGlzLmdldFRva2VuKHtjb2RlOnIscmVkaXJlY3RVcmk6dC5yZWRpcmVjdFVyaSxjb2RlVmVyaWZpZXI6dC5jb2RlVmVyaWZpZXJ9KX1hc3luYyB2YWxpZGF0ZVJlc3BvbnNlKGUsdCl7dmFyIHI7Y29uc3Qgbj1uZXcgVVJMKGUpLnNlYXJjaFBhcmFtcztpZihuLmhhcyhcImVycm9yXCIpKXRocm93IG5ldyBpLk9BdXRoMkVycm9yKG51bGwhPT0ocj1uLmdldChcImVycm9yX2Rlc2NyaXB0aW9uXCIpKSYmdm9pZCAwIT09cj9yOlwiT0F1dGgyIGVycm9yXCIsbi5nZXQoXCJlcnJvclwiKSwwKTtpZighbi5oYXMoXCJjb2RlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIHVybCBkaWQgbm90IGNvbnRhaW4gYSBjb2RlIHBhcmFtZXRlciAke2V9YCk7aWYodC5zdGF0ZSYmdC5zdGF0ZSE9PW4uZ2V0KFwic3RhdGVcIikpdGhyb3cgbmV3IEVycm9yKGBUaGUgXCJzdGF0ZVwiIHBhcmFtZXRlciBpbiB0aGUgdXJsIGRpZCBub3QgbWF0Y2ggdGhlIGV4cGVjdGVkIHZhbHVlIG9mICR7dC5zdGF0ZX1gKTtyZXR1cm57Y29kZTpuLmdldChcImNvZGVcIiksc2NvcGU6bi5oYXMoXCJzY29wZVwiKT9uLmdldChcInNjb3BlXCIpLnNwbGl0KFwiIFwiKTp2b2lkIDB9fWFzeW5jIGdldFRva2VuKGUpe2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJhdXRob3JpemF0aW9uX2NvZGVcIixjb2RlOmUuY29kZSxyZWRpcmVjdF91cmk6ZS5yZWRpcmVjdFVyaSxjb2RlX3ZlcmlmaWVyOmUuY29kZVZlcmlmaWVyfTtyZXR1cm4gdGhpcy5jbGllbnQudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5jbGllbnQucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIix0KSl9fSx0LmdlbmVyYXRlQ29kZVZlcmlmaWVyPWFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgZT1zKCk7aWYoZSl7Y29uc3QgdD1uZXcgVWludDhBcnJheSgzMik7cmV0dXJuIGUuZ2V0UmFuZG9tVmFsdWVzKHQpLGModCl9e2NvbnN0IGU9cigyMTIpO3JldHVybiBuZXcgUHJvbWlzZSgoKHQscik9PntlLnJhbmRvbUJ5dGVzKDMyLCgoZSxuKT0+e2UmJnIoZSksdChuLnRvU3RyaW5nKFwiYmFzZTY0dXJsXCIpKX0pKX0pKX19LHQuZ2V0Q29kZUNoYWxsZW5nZT1vfSw0NDM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkVycm9yPXZvaWQgMDtjbGFzcyByIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUpLHRoaXMub2F1dGgyQ29kZT10LHRoaXMuaHR0cENvZGU9cn19dC5PQXV0aDJFcnJvcj1yfSwxMzooZSx0KT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuT0F1dGgyRmV0Y2g9dm9pZCAwLHQuT0F1dGgyRmV0Y2g9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy50b2tlbj1udWxsLHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49bnVsbCx0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbCx0aGlzLnJlZnJlc2hUaW1lcj1udWxsLHZvaWQgMD09PShudWxsPT1lP3ZvaWQgMDplLnNjaGVkdWxlUmVmcmVzaCkmJihlLnNjaGVkdWxlUmVmcmVzaD0hMCksdGhpcy5vcHRpb25zPWUsZS5nZXRTdG9yZWRUb2tlbiYmKHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49KGFzeW5jKCk9Pnt0aGlzLnRva2VuPWF3YWl0IGUuZ2V0U3RvcmVkVG9rZW4oKSx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGx9KSgpKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpfWFzeW5jIGZldGNoKGUsdCl7Y29uc3Qgcj1uZXcgUmVxdWVzdChlLHQpO3JldHVybiB0aGlzLm13KCkociwoZT0+ZmV0Y2goZSkpKX1tdygpe3JldHVybiBhc3luYyhlLHQpPT57Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7bGV0IG49ZS5jbG9uZSgpO24uaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsXCJCZWFyZXIgXCIrcik7bGV0IGk9YXdhaXQgdChuKTtpZighaS5vayYmNDAxPT09aS5zdGF0dXMpe2NvbnN0IHI9YXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtuPWUuY2xvbmUoKSxuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IuYWNjZXNzVG9rZW4pLGk9YXdhaXQgdChuKX1yZXR1cm4gaX19YXN5bmMgZ2V0VG9rZW4oKXtyZXR1cm4gdGhpcy50b2tlbiYmKG51bGw9PT10aGlzLnRva2VuLmV4cGlyZXNBdHx8dGhpcy50b2tlbi5leHBpcmVzQXQ+RGF0ZS5ub3coKSk/dGhpcy50b2tlbjp0aGlzLnJlZnJlc2hUb2tlbigpfWFzeW5jIGdldEFjY2Vzc1Rva2VuKCl7cmV0dXJuIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4sKGF3YWl0IHRoaXMuZ2V0VG9rZW4oKSkuYWNjZXNzVG9rZW59YXN5bmMgcmVmcmVzaFRva2VuKCl7dmFyIGUsdDtpZih0aGlzLmFjdGl2ZVJlZnJlc2gpcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtjb25zdCByPXRoaXMudG9rZW47dGhpcy5hY3RpdmVSZWZyZXNoPShhc3luYygpPT57dmFyIGUsdDtsZXQgbj1udWxsO3RyeXsobnVsbD09cj92b2lkIDA6ci5yZWZyZXNoVG9rZW4pJiYobj1hd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihyKSl9Y2F0Y2goZSl7Y29uc29sZS53YXJuKFwiW29hdXRoMl0gcmVmcmVzaCB0b2tlbiBub3QgYWNjZXB0ZWQsIHdlJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nXCIpfWlmKG58fChuPWF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpKSwhbil7Y29uc3Qgcj1uZXcgRXJyb3IoXCJVbmFibGUgdG8gb2J0YWluIE9BdXRoMiB0b2tlbnMsIGEgZnVsbCByZWF1dGggbWF5IGJlIG5lZWRlZFwiKTt0aHJvdyBudWxsPT09KHQ9KGU9dGhpcy5vcHRpb25zKS5vbkVycm9yKXx8dm9pZCAwPT09dHx8dC5jYWxsKGUscikscn1yZXR1cm4gbn0pKCk7dHJ5e2NvbnN0IHI9YXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO3JldHVybiB0aGlzLnRva2VuPXIsbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykuc3RvcmVUb2tlbil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHRoaXMuc2NoZWR1bGVSZWZyZXNoKCkscn1jYXRjaChlKXt0aHJvdyB0aGlzLm9wdGlvbnMub25FcnJvciYmdGhpcy5vcHRpb25zLm9uRXJyb3IoZSksZX1maW5hbGx5e3RoaXMuYWN0aXZlUmVmcmVzaD1udWxsfX1zY2hlZHVsZVJlZnJlc2goKXt2YXIgZTtpZighdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaClyZXR1cm47aWYodGhpcy5yZWZyZXNoVGltZXImJihjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpLHRoaXMucmVmcmVzaFRpbWVyPW51bGwpLCEobnVsbD09PShlPXRoaXMudG9rZW4pfHx2b2lkIDA9PT1lP3ZvaWQgMDplLmV4cGlyZXNBdCl8fCF0aGlzLnRva2VuLnJlZnJlc2hUb2tlbilyZXR1cm47Y29uc3QgdD10aGlzLnRva2VuLmV4cGlyZXNBdC1EYXRlLm5vdygpO3Q8MTJlNHx8KHRoaXMucmVmcmVzaFRpbWVyPXNldFRpbWVvdXQoKGFzeW5jKCk9Pnt0cnl7YXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKX1jYXRjaChlKXtjb25zb2xlLmVycm9yKFwiW2ZldGNoLW13LW9hdXRoMl0gZXJyb3Igd2hpbGUgZG9pbmcgYSBiYWNrZ3JvdW5kIE9BdXRoMiBhdXRvLXJlZnJlc2hcIixlKX19KSx0LTZlNCkpfX19LDIxMjooKT0+e319LHQ9e307ZnVuY3Rpb24gcihuKXt2YXIgaT10W25dO2lmKHZvaWQgMCE9PWkpcmV0dXJuIGkuZXhwb3J0czt2YXIgbz10W25dPXtleHBvcnRzOnt9fTtyZXR1cm4gZVtuXShvLG8uZXhwb3J0cyxyKSxvLmV4cG9ydHN9dmFyIG49e307cmV0dXJuKCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9bjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLk9BdXRoMkVycm9yPWUuT0F1dGgyRmV0Y2g9ZS5nZW5lcmF0ZUNvZGVWZXJpZmllcj1lLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PWUuT0F1dGgyQ2xpZW50PXZvaWQgMDt2YXIgdD1yKDkzNCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJDbGllbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdC5PQXV0aDJDbGllbnR9fSk7dmFyIGk9cig2MTgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImdlbmVyYXRlQ29kZVZlcmlmaWVyXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuZ2VuZXJhdGVDb2RlVmVyaWZpZXJ9fSk7dmFyIG89cigxMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJGZXRjaFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBvLk9BdXRoMkZldGNofX0pO3ZhciBzPXIoNDQzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkVycm9yXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHMuT0F1dGgyRXJyb3J9fSl9KSgpLG59KSgpKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9hdXRoMi1jbGllbnQubWluLmpzLm1hcCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyA8YXV0by1nZW5lcmF0ZWQ+XHJcbi8vICAgICBHZW5lcmF0ZWQgdXNpbmcgdGhlIE5Td2FnIHRvb2xjaGFpbiB2MTMuMjAuMC4wIChOSnNvblNjaGVtYSB2MTAuOS4wLjAgKE5ld3RvbnNvZnQuSnNvbiB2MTMuMC4wLjApKSAoaHR0cDovL05Td2FnLm9yZylcclxuLy8gPC9hdXRvLWdlbmVyYXRlZD5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4vLyBSZVNoYXJwZXIgZGlzYWJsZSBJbmNvbnNpc3RlbnROYW1pbmdcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnQge1xyXG4gICAgcHJpdmF0ZSBodHRwOiB7IGZldGNoKHVybDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IH07XHJcbiAgICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBqc29uUGFyc2VSZXZpdmVyOiAoKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnkpIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmw/OiBzdHJpbmcsIGh0dHA/OiB7IGZldGNoKHVybDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IH0pIHtcclxuICAgICAgICB0aGlzLmh0dHAgPSBodHRwID8gaHR0cCA6IHdpbmRvdyBhcyBhbnk7XHJcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybCAhPT0gdW5kZWZpbmVkICYmIGJhc2VVcmwgIT09IG51bGwgPyBiYXNlVXJsIDogXCIvYXBpL2ViYXkvdjFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3QgYWxsIHByb2R1Y3RzXHJcbiAgICAgKiBAcmV0dXJuIE9LXHJcbiAgICAgKi9cclxuICAgIGdldEFsbFByb2R1Y3RzKCk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldEFsbFByb2R1Y3RzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRBbGxQcm9kdWN0cyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKFByb2R1Y3RXaXRoSWQuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPFByb2R1Y3RXaXRoSWRbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzQ3JlYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ3JlYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSByZXN1bHREYXRhMjAwICE9PSB1bmRlZmluZWQgPyByZXN1bHREYXRhMjAwIDogPGFueT5udWxsO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxzdHJpbmc+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9XCI7XHJcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQgfHwgaWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2lkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7aWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgaWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1VwZGF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1VwZGF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVsZXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gRGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9kdWN0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRGVsZXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzRGVsZXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIHVwc2VydExvdEluZm8obG90SW5mbzogTG90SW5mbywgcHJvZHVjdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3twcm9kdWN0SWR9L2xvdHMvXCI7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkIHx8IHByb2R1Y3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAncHJvZHVjdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7cHJvZHVjdElkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIHByb2R1Y3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkobG90SW5mbyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Vwc2VydExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1Vwc2VydExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9C40YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQu9C+0YLQtVxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRMb3RJbmZvKGxvdElkOiBudW1iZXIpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3RzL3tsb3RJZH0vXCI7XHJcbiAgICAgICAgaWYgKGxvdElkID09PSB1bmRlZmluZWQgfHwgbG90SWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2xvdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7bG90SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgbG90SWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RJbmZvKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RJbmZvKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQyMDAgPSBMb3RJbmZvV2l0aFByb2R1Y3RJZC5mcm9tSlMocmVzdWx0RGF0YTIwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90SW5mb1dpdGhQcm9kdWN0SWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YPRh9GC0LXQvdC90YvRhSDQu9C+0YLQsNGFXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdFN0YXRlcyhsb3RJZHM6IG51bWJlcltdKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3Rfc3RhdGVfcmVxdWVzdHMvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJZHMpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0TG90U3RhdGVzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RTdGF0ZXMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTG90U3RhdGUuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPExvdFN0YXRlW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDQv9C10YDQtdGH0LXQvdGMINCy0L7Qt9C80L7QttC90YvRhSDRgdC+0YHRgtC+0Y/QvdC40Lkg0L/RgNC+0LTQsNCy0LDQtdC80L7Qs9C+INGC0L7QstCw0YDQsFxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRNYW51YWxDb25kaXRpb25zTGlzdCgpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9tYW51YWxfY29uZGl0aW9ucy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0TWFudWFsQ29uZGl0aW9uc0xpc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxNYW51YWxDb25kaXRpb25bXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKE1hbnVhbENvbmRpdGlvbi5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TWFudWFsQ29uZGl0aW9uW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRob3V0SWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcmllcyE6IFNlYXJjaFF1ZXJ5W107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aG91dElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJOYW1lXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMhLnB1c2goU2VhcmNoUXVlcnkuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQcm9kdWN0V2l0aG91dElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIk5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zZWFyY2hRdWVyaWVzKSkge1xyXG4gICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuc2VhcmNoUXVlcmllcylcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJpZXM6IFNlYXJjaFF1ZXJ5W107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0V2l0aElkIGltcGxlbWVudHMgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcmllcyE6IFNlYXJjaFF1ZXJ5W107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiSWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzIS5wdXNoKFNlYXJjaFF1ZXJ5LmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9kdWN0V2l0aElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHJvZHVjdFdpdGhJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJJZFwiXSA9IHRoaXMuaWQ7XHJcbiAgICAgICAgZGF0YVtcIk5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zZWFyY2hRdWVyaWVzKSkge1xyXG4gICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuc2VhcmNoUXVlcmllcylcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9kdWN0V2l0aElkIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzOiBTZWFyY2hRdWVyeVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoUXVlcnkgaW1wbGVtZW50cyBJU2VhcmNoUXVlcnkge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBxdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVNlYXJjaFF1ZXJ5KSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcImlkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXJ5ID0gX2RhdGFbXCJxdWVyeVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBTZWFyY2hRdWVyeSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNlYXJjaFF1ZXJ5KCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wicXVlcnlcIl0gPSB0aGlzLnF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTZWFyY2hRdWVyeSB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgcXVlcnk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdEluZm9XaXRoUHJvZHVjdElkIGltcGxlbWVudHMgSUxvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgIHByb2R1Y3RJZCE6IHN0cmluZztcclxuICAgIGxvdEluZm8hOiBMb3RJbmZvO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90SW5mb1dpdGhQcm9kdWN0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdEluZm8gPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdElkID0gX2RhdGFbXCJwcm9kdWN0SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG90SW5mbyA9IF9kYXRhW1wibG90SW5mb1wiXSA/IExvdEluZm8uZnJvbUpTKF9kYXRhW1wibG90SW5mb1wiXSkgOiBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mb1dpdGhQcm9kdWN0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wicHJvZHVjdElkXCJdID0gdGhpcy5wcm9kdWN0SWQ7XHJcbiAgICAgICAgZGF0YVtcImxvdEluZm9cIl0gPSB0aGlzLmxvdEluZm8gPyB0aGlzLmxvdEluZm8udG9KU09OKCkgOiA8YW55PnVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgcHJvZHVjdElkOiBzdHJpbmc7XHJcbiAgICBsb3RJbmZvOiBMb3RJbmZvO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mbyBpbXBsZW1lbnRzIElMb3RJbmZvIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHBjcyE6IG51bWJlcjtcclxuICAgIHByaWNlITogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmc/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWw/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuICAgIGNvbmRpdGlvbiE6IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyITogc3RyaW5nO1xyXG4gICAgbG9jYXRlZEluITogc3RyaW5nO1xyXG4gICAgaWdub3JlVGhhdExvdCE6IGJvb2xlYW47XHJcbiAgICBtYW51YWxDb25kaXRpb25JZCE6IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeSE6IFB1cmNoYXNlSW5mb1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90SW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJZCA9IF9kYXRhW1wibG90SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wibmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5wY3MgPSBfZGF0YVtcInBjc1wiXTtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmcgPSBfZGF0YVtcInNoaXBwaW5nXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbCA9IF9kYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24gPSBfZGF0YVtcImNvbmRpdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsbGVyID0gX2RhdGFbXCJzZWxsZXJcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRlZEluID0gX2RhdGFbXCJsb2NhdGVkSW5cIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5tYW51YWxDb25kaXRpb25JZCA9IF9kYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5IS5wdXNoKFB1cmNoYXNlSW5mby5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJuYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJwY3NcIl0gPSB0aGlzLnBjcztcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ1wiXSA9IHRoaXMuc2hpcHBpbmc7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXSA9IHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcInNlbGxlclwiXSA9IHRoaXMuc2VsbGVyO1xyXG4gICAgICAgIGRhdGFbXCJsb2NhdGVkSW5cIl0gPSB0aGlzLmxvY2F0ZWRJbjtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB0aGlzLm1hbnVhbENvbmRpdGlvbklkO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHVyY2hhc2VIaXN0b3J5KSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5wdXJjaGFzZUhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwY3M6IG51bWJlcjtcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW46IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBtYW51YWxDb25kaXRpb25JZDogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5OiBQdXJjaGFzZUluZm9bXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFB1cmNoYXNlSW5mbyBpbXBsZW1lbnRzIElQdXJjaGFzZUluZm8ge1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWFudGl0eSE6IG51bWJlcjtcclxuICAgIGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQdXJjaGFzZUluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHkgPSBfZGF0YVtcInF1YW50aXR5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGUgPSBfZGF0YVtcImRhdGVcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHVyY2hhc2VJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHVyY2hhc2VJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wicXVhbnRpdHlcIl0gPSB0aGlzLnF1YW50aXR5O1xyXG4gICAgICAgIGRhdGFbXCJkYXRlXCJdID0gdGhpcy5kYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQdXJjaGFzZUluZm8ge1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWFudWFsQ29uZGl0aW9uIGltcGxlbWVudHMgSU1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTWFudWFsQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcImlkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBNYW51YWxDb25kaXRpb24ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYW51YWxDb25kaXRpb24oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiaWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdFN0YXRlIGltcGxlbWVudHMgSUxvdFN0YXRlIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgaWdub3JlVGhhdExvdCE6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90U3RhdGUpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJZCA9IF9kYXRhW1wibG90SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gX2RhdGFbXCJsYXN0VXBkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdFN0YXRlIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90U3RhdGUoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJpZ25vcmVUaGF0TG90XCJdID0gdGhpcy5pZ25vcmVUaGF0TG90O1xyXG4gICAgICAgIGRhdGFbXCJsYXN0VXBkYXRlXCJdID0gdGhpcy5sYXN0VXBkYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgaWdub3JlVGhhdExvdDogYm9vbGVhbjtcclxuICAgIGxhc3RVcGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gX2RhdGFbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gX2RhdGFbXCJ0aXRsZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBfZGF0YVtcInN0YXR1c1wiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBfZGF0YVtcImRldGFpbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSA9IF9kYXRhW1wiaW5zdGFuY2VcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYWJzdHJhY3QgY2xhc3MgJ1Byb2JsZW1EZXRhaWxlZEluZm8nIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1widHlwZVwiXSA9IHRoaXMudHlwZTtcclxuICAgICAgICBkYXRhW1widGl0bGVcIl0gPSB0aGlzLnRpdGxlO1xyXG4gICAgICAgIGRhdGFbXCJzdGF0dXNcIl0gPSB0aGlzLnN0YXR1cztcclxuICAgICAgICBkYXRhW1wiZGV0YWlsXCJdID0gdGhpcy5kZXRhaWw7XHJcbiAgICAgICAgZGF0YVtcImluc3RhbmNlXCJdID0gdGhpcy5pbnN0YW5jZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlci5pbml0KF9kYXRhKTtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBfZGF0YVtcImVycm9yc1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZXJyb3JzXCJdID0gdGhpcy5lcnJvcnM7XHJcbiAgICAgICAgc3VwZXIudG9KU09OKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzMiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZXJyb3JzXCJdID0gdGhpcy5lcnJvcnM7XHJcbiAgICAgICAgc3VwZXIudG9KU09OKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9yczIgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMgaW1wbGVtZW50cyBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yczIgaW1wbGVtZW50cyBJRXJyb3JzMiB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJRXJyb3JzMikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9yczIge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMyKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHRoaXNbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JzMiB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgc3RhdHVzOiBudW1iZXI7XHJcbiAgICByZXNwb25zZTogc3RyaW5nO1xyXG4gICAgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH07XHJcbiAgICByZXN1bHQ6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0OiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBpc0FwaUV4Y2VwdGlvbiA9IHRydWU7XHJcblxyXG4gICAgc3RhdGljIGlzQXBpRXhjZXB0aW9uKG9iajogYW55KTogb2JqIGlzIEFwaUV4Y2VwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG9iai5pc0FwaUV4Y2VwdGlvbiA9PT0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGhyb3dFeGNlcHRpb24obWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdD86IGFueSk6IGFueSB7XHJcbiAgICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRocm93IHJlc3VsdDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aHJvdyBuZXcgQXBpRXhjZXB0aW9uKG1lc3NhZ2UsIHN0YXR1cywgcmVzcG9uc2UsIGhlYWRlcnMsIG51bGwpO1xyXG59IiwiaW1wb3J0IHtPQXV0aDJDbGllbnQsIE9BdXRoMlRva2VufSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuXHJcblxyXG50eXBlIE9BdXRoMkZldGNoT3B0aW9ucyA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyZW5jZSB0byBPQXV0aDIgY2xpZW50LlxyXG4gICAgICovXHJcbiAgICBjbGllbnQ6IE9BdXRoMkNsaWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFlvdSBhcmUgcmVzcG9uc2libGUgZm9yIGltcGxlbWVudGluZyB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgICogaXQncyBwdXJwb3NlIGlzIHRvIHN1cHBseSB0aGUgJ2luaXRpYWwnIG9hdXRoMiB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIGBudWxsYCB0byBmYWlsIHRoZSBwcm9jZXNzLlxyXG4gICAgICovXHJcbiAgICBnZXROZXdUb2tlbigpOiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBzZXQsIHdpbGwgYmUgY2FsbGVkIGlmIGF1dGhlbnRpY2F0aW9uIGZhdGFsbHkgZmFpbGVkLlxyXG4gICAgICovXHJcbiAgICBvbkVycm9yPzogKGVycjogRXJyb3IpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgYWN0aXZlIHRva2VuIGNoYW5nZXMuIFVzaW5nIHRoaXMgaXNcclxuICAgICAqIG9wdGlvbmFsLCBidXQgaXQgbWF5IGJlIHVzZWQgdG8gKGZvciBleGFtcGxlKSBwdXQgdGhlIHRva2VuIGluIG9mZi1saW5lXHJcbiAgICAgKiBzdG9yYWdlIGZvciBsYXRlciB1c2FnZS5cclxuICAgICAqL1xyXG4gICAgc3RvcmVUb2tlbj86ICh0b2tlbjogT0F1dGgyVG9rZW4pID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbHNvIGFuIG9wdGlvbmFsIGZlYXR1cmUuIEltcGxlbWVudCB0aGlzIGlmIHlvdSB3YW50IHRoZSB3cmFwcGVyIHRvIHRyeSBhXHJcbiAgICAgKiBzdG9yZWQgdG9rZW4gYmVmb3JlIGF0dGVtcHRpbmcgYSBmdWxsIHJlLWF1dGhlbnRpY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gbnVsbCBpZiB0aGVyZSB3YXMgbm8gdG9rZW4uXHJcbiAgICAgKi9cclxuICAgIGdldFN0b3JlZFRva2VuPzogKCkgPT4gT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IHNjaGVkdWxlIHRva2VuIHJlZnJlc2guXHJcbiAgICAgKlxyXG4gICAgICogQ2VydGFpbiBleGVjdXRpb24gZW52aXJvbm1lbnRzLCBlLmcuIFJlYWN0IE5hdGl2ZSwgZG8gbm90IGhhbmRsZSBzY2hlZHVsZWRcclxuICAgICAqIHRhc2tzIHdpdGggc2V0VGltZW91dCgpIGluIGEgZ3JhY2VmdWwgb3IgcHJlZGljdGFibGUgZmFzaGlvbi4gVGhlIGRlZmF1bHRcclxuICAgICAqIGJlaGF2aW9yIGlzIHRvIHNjaGVkdWxlIHJlZnJlc2guIFNldCB0aGlzIHRvIGZhbHNlIHRvIGRpc2FibGUgc2NoZWR1bGluZy5cclxuICAgICAqL1xyXG4gICAgc2NoZWR1bGVSZWZyZXNoPzogYm9vbGVhbjtcclxuXHJcbiAgICBmZXRjaD86IHR5cGVvZiBmZXRjaDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZldGNoV3JhcHBlckN1c3RvbSB7XHJcblxyXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDdXJyZW50IGFjdGl2ZSB0b2tlbiAoaWYgYW55KVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIHVzZXIgaGFkIGEgc3RvcmVkVG9rZW4sIHRoZSBwcm9jZXNzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBtYXkgYmUgYXN5bmMuIFdlIGtlZXAgdHJhY2sgb2YgdGhpcyBwcm9jZXNzIGluIHRoaXNcclxuICAgICAqIHByb21pc2UsIHNvIGl0IG1heSBiZSBhd2FpdGVkIHRvIGF2b2lkIHJhY2UgY29uZGl0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBBcyBzb29uIGFzIHRoaXMgcHJvbWlzZSByZXNvbHZlcywgdGhpcyBwcm9wZXJ0eSBnZXQgbnVsbGVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZUdldFN0b3JlZFRva2VuOiBudWxsIHwgUHJvbWlzZTx2b2lkPiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zKSB7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zPy5zY2hlZHVsZVJlZnJlc2ggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNjaGVkdWxlUmVmcmVzaCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gYXdhaXQgb3B0aW9ucy5nZXRTdG9yZWRUb2tlbiEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvZXMgYSBmZXRjaCByZXF1ZXN0IGFuZCBhZGRzIGEgQmVhcmVyIC8gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCB0aGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBmaXJzdC4gSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBhbG1vc3QgZXhwaXJpbmcsIHRoaXMgZnVuY3Rpb24gbWlnaHQgYXR0ZW1wdFxyXG4gICAgICogdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZmV0Y2goaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgICAgICBpZiAoaW5pdC5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYWNjZXNzVG9rZW5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnMgPSB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgYWNjZXNzVG9rZW59XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgbmV3VG9rZW5cclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgdG9rZW4gaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhlcmUgcmVzdWx0IG9iamVjdCB3aWxsIGhhdmU6XHJcbiAgICAgKiAgICogYWNjZXNzVG9rZW5cclxuICAgICAqICAgKiBleHBpcmVzQXQgLSB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBudWxsLlxyXG4gICAgICogICAqIHJlZnJlc2hUb2tlbiAtIG1heSBiZSBudWxsXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGF0dGVtcHQgdG8gYXV0b21hdGljYWxseSByZWZyZXNoIGlmIHN0YWxlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLmV4cGlyZXNBdCA9PT0gbnVsbCB8fCB0aGlzLnRva2VuLmV4cGlyZXNBdCA+IERhdGUubm93KCkpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgY3VycmVudCB0b2tlbiBpcyBzdGlsbCB2YWxpZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgY3VycmVudCBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCBpdCB3aWxsIGF0dGVtcHQgdG8gZmV0Y2ggaXQuXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGV4cGlyaW5nLCBpdCB3aWxsIGF0dGVtcHQgdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0QWNjZXNzVG9rZW4oKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgLy8gRW5zdXJlIGdldFN0b3JlZFRva2VuIGZpbmlzaGVkLlxyXG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW47XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiB0b2tlbi5hY2Nlc3NUb2tlbjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBLZWVwaW5nIHRyYWNrIG9mIGFuIGFjdGl2ZSByZWZyZXNoVG9rZW4gb3BlcmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgd2lsbCBhbGxvdyB1cyB0byBlbnN1cmUgb25seSAxIHN1Y2ggb3BlcmF0aW9uIGhhcHBlbnMgYXQgYW55XHJcbiAgICAgKiBnaXZlbiB0aW1lLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZVJlZnJlc2g6IFByb21pc2U8T0F1dGgyVG9rZW4+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZXMgYW4gYWNjZXNzIHRva2VuIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgY3VycmVudGx5IGFscmVhZHkgZG9pbmcgdGhpcyBvcGVyYXRpb24sXHJcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBkbyBpdCB0d2ljZSBpbiBwYXJhbGxlbC5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZFRva2VuID0gdGhpcy50b2tlbjtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSAoYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1Rva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRUb2tlbj8ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGFkIGEgcmVmcmVzaCB0b2tlbiwgbGV0cyBzZWUgaWYgd2UgY2FuIHVzZSBpdCFcclxuICAgICAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKG9sZFRva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZVxcJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yPy4oZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VG9rZW47XHJcblxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zdG9yZVRva2VuPy4odG9rZW4pO1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY2xlYXIgdGhlIGN1cnJlbnQgcmVmcmVzaCBvcGVyYXRpb24uXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRpbWVyIHRyaWdnZXIgZm9yIHRoZSBuZXh0IGF1dG9tYXRlZCByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc2NoZWR1bGVSZWZyZXNoKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lcikge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4/LmV4cGlyZXNBdCB8fCAhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBkb24ndCBoYXZlIGEgcmVmcmVzaF90b2tlbiwgZG9uJ3QgYm90aGVyLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSB0aGlzLnRva2VuLmV4cGlyZXNBdCAtIERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgc2NoZWR1bGUgdGhpcyBldmVudCBpZiBpdCBoYXBwZW5zIG1vcmUgdGhhbiAyIG1pbnV0ZXMgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICBpZiAoZXhwaXJlc0luIDwgMTIwICogMTAwMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTY2hlZHVsZSAxIG1pbnV0ZSBiZWZvcmUgZXhwaXJ5XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoJywgZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGV4cGlyZXNJbiAtIDYwICogMTAwMCk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgQ2xpZW50LFxyXG4gICAgTG90SW5mbyxcclxuICAgIExvdEluZm9XaXRoUHJvZHVjdElkLCBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8sXHJcbiAgICBQdXJjaGFzZUluZm8sIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvXHJcbn0gZnJvbSBcIi4vRWJheUNsaWVudC9FYmF5Q2xpZW50XCJcclxuXHJcbmltcG9ydCB7Z2VuZXJhdGVDb2RlVmVyaWZpZXIsIE9BdXRoMkNsaWVudH0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcbmltcG9ydCB7RmV0Y2hXcmFwcGVyQ3VzdG9tfSBmcm9tIFwiLi9GZXRjaFdyYXBwZXJDdXN0b21cIjtcclxuXHJcbmNvbnN0IGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUgPSBcImlnbm9yZVRoYXRMb3RcIjtcclxuY29uc3QgbWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWUgPSBcIm1hbnVhbENvbmRpdGlvbklkXCI7XHJcbmNvbnN0IHByb2R1Y3RGaWVsZE5hbWUgPSBcInByb2R1Y3RJZFwiO1xyXG5jb25zdCBwY3NGaWVsZE5hbWUgPSBcInBjc1wiO1xyXG5cclxuY29uc3QgcGFuZWxDbGFzcyA9IFwicGFuZWwtZGl2XCI7XHJcbmNvbnN0IGZvcm1JZCA9IFwicHJvZHVjdC1mb3JtLWlkXCJcclxuY29uc3QgZXJyb3JFbGVtZW50SWQgPSBcImVycm9yRWxlbWVudFwiXHJcbmNvbnN0IHN1Ym1pdElkID0gXCJzdWJtaXRcIlxyXG4vL2NvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vbG9jYWxob3N0OjcwOTUvXCJcclxuY29uc3QgYmFja2VuZFVybCA9IFwiaHR0cHM6Ly8xNzguMjA4LjY1LjEwMDoxNzQ0My9cIlxyXG5jb25zdCBiYXNlQXBpVXJsID0gYCR7YmFja2VuZFVybH1hcGkvZWJheS92MWA7XHJcbmNvbnN0IGF1dGhSZWRpcmVjdFVybCA9IFwiaHR0cHM6Ly93d3cuZWJheS5jb20vXCJcclxuY29uc3Qgbm90U2V0VmFsdWUgPSBcIm5vdFNldFwiXHJcbmNvbnN0IGxpZ2h0R3JlZW5Db2xvciA9IFwiI2VjZmZlY1wiXHJcbmNvbnN0IGxpZ2h0UGlua0NvbG9yID0gXCJsaWdodHBpbmtcIlxyXG5jb25zdCBsaWdodFllbGxvd0NvbG9yID0gXCIjZTBlMDdmXCJcclxuXHJcblxyXG5cclxuY29uc3QgbG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcbmxldCBfc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQ7XHJcblxyXG4vLyBmZXRjaCDRh9C10YDQtdC3IGJhY2tncm91bmQgc2NyaXB0LCDQv9C+INC00YDRg9Cz0L7QvNGDINC90LUg0YDQsNCx0L7RgtCw0LXRglxyXG5mdW5jdGlvbiBmZXRjaFJlc291cmNlKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdDogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtpbnB1dCwgaW5pdH0sIG1lc3NhZ2VSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyZXNwb25zZSwgZXJyb3JdID0gbWVzc2FnZVJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgdW5kZWZpbmVkIG9uIGEgMjA0IC0gTm8gQ29udGVudFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlc3BvbnNlLmJvZHkgPyBuZXcgQmxvYihbcmVzcG9uc2UuYm9keV0pIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZXh0cmFjdFByaWNlKHByaWNlKSB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IHByaWNlLm1hdGNoKC8oXFxEKykoXFxkKyg/OlssLl1cXGQrKT8pLylcclxuICAgIGlmIChtYXRjaGVzWzFdICE9PSBcIlVTICRcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVVMgJCBwcmljZSBleHBlY3RlZCwgYnV0IHdhcycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hlc1syXS5yZXBsYWNlKCcsJywgJy4nKSlcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQYW5lbChib2R5RWxlbWVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBzdHlsZXMgPSBgXHJcbiAgICAuJHtwYW5lbENsYXNzfSB7XHJcbiAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgIHBhZGRpbmc6IDE1cHg7XHJcbiAgICAgIGJvcmRlcjogM3B4IHNvbGlkICMwMDAwY2M7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgIGNvbG9yOiAjMDAwMGNjO1xyXG4gICAgICBwb3NpdGlvbjpmaXhlZDtcclxuICAgICAgei1pbmRleDoxMDA7XHJcbiAgICAgIGxlZnQ6MSU7XHJcbiAgICAgIGJvdHRvbTo1JTtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsIHtcclxuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBpbnB1dCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gc2VsZWN0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbDphZnRlciB7IGNvbnRlbnQ6IFwiOiBcIiB9XHJcbmBcclxuXHJcbiAgICBsZXQgc3R5bGVTaGVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKVxyXG4gICAgc3R5bGVTaGVldC5pbm5lclRleHQgPSBzdHlsZXNcclxuICAgIGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlU2hlZXQpXHJcblxyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQocGFuZWxDbGFzcyk7XHJcblxyXG5cclxuICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpXHJcbiAgICBmb3JtLmlkID0gZm9ybUlkXHJcbiAgICBsZXQgaXRlbUlkID0gbG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV07XHJcbiAgICBsZXQgZG9tYWluID0gbG9jYXRpb24uaG9zdG5hbWU7XHJcblxyXG4gICAgbGV0IGhpc3RvcnlCdXR0b25IcmVmID0gYGh0dHBzOi8vJHtkb21haW59L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgLy8gbGFuZ3VhZ2U9SFRNTFxyXG4gICAgZm9ybS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgPGEgaHJlZj1cIiR7aGlzdG9yeUJ1dHRvbkhyZWZ9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+0JjRgdGC0L7RgNC40Y8g0L/RgNC+0LTQsNC2INC70L7RgtCwPC9hPiBcclxuICAgICAgICA8YnI+0JHRjdC60LXQvdC0OiA8YSBocmVmPVwiJHtiYWNrZW5kVXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YmFja2VuZFVybH08L2E+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiPtCY0LPQvdC+0YDQuNGA0L7QstCw0YLRjCDQu9C+0YI8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIiB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+0KLQvtCy0LDRgDwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiIGlkPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDRgtC+0LLQsNGAPC9vcHRpb24+XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Bjc0ZpZWxkTmFtZX1cIj5QQ1M8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7cGNzRmllbGROYW1lfVwiIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwiJHtwY3NGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIj7QodC+0YHRgtC+0Y/QvdC40LU8L2xhYmVsPlxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCIgaWQ9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDQodC+0YHRgtC+0Y/QvdC40LU8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT1cImNvbG9yOiByZWQ7XCIgaWQ9XCIke2Vycm9yRWxlbWVudElkfVwiPjwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3N1Ym1pdElkfVwiIHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlNhdmVcIiBkaXNhYmxlZC8+XHJcbiAgICBgO1xyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQ6IFN1Ym1pdEV2ZW50KSB7XHJcbiAgICAgICAgYXdhaXQgaGFuZGxlU3VibWl0KGV2ZW50LCBjbGllbnQpXHJcbiAgICB9KTtcclxuXHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybSlcclxuICAgIGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudDogU3VibWl0RXZlbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD5ldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgICBsZXQgaWdub3JlVGhhdExvdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdpZ25vcmVUaGF0TG90Jykge1xyXG4gICAgICAgICAgICAgICAgaWdub3JlVGhhdExvdCA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm9ba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvdEluZm9bJ2lnbm9yZVRoYXRMb3QnXSA9IGlnbm9yZVRoYXRMb3Q7XHJcblxyXG4gICAgICAgIGlmIChpZ25vcmVUaGF0TG90KSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8ucGNzID0gMVxyXG4gICAgICAgICAgICBsb3RJbmZvLm1hbnVhbENvbmRpdGlvbklkID0gbm90U2V0VmFsdWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyB0byBiYWNrZW5kOiBcIiArIEpTT04uc3RyaW5naWZ5KGxvdEluZm8pKVxyXG5cclxuXHJcbiAgICAgICAgYXdhaXQgY2xpZW50LnVwc2VydExvdEluZm8obG90SW5mbywgZGF0YS5nZXQoJ3Byb2R1Y3RJZCcpLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgYXdhaXQgc2hvd0Vycm9yKGVycm9yKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzOiBIVE1MVGFibGVSb3dFbGVtZW50W10sIHJlc3VsdDogUHVyY2hhc2VJbmZvSW5uZXJbXSkge1xyXG4gICAgZm9yIChsZXQgZml4ZWRQcmljZVJvdyBvZiBmaXhlZFByaWNlUm93cykge1xyXG4gICAgICAgIGxldCBjb2x1bW5zID0gWy4uLmZpeGVkUHJpY2VSb3cucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJUZXh0O1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICBsZXQgcHJpY2UgPSBjb2x1bW5zWzFdXHJcblxyXG4gICAgICAgIGlmIChwcmljZSA9PT0gXCJFeHBpcmVkXCIgfHwgcHJpY2UgPT09IFwiRGVjbGluZWRcIikge1xyXG4gICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByaWNlICE9PSBcIlNvbGQgYXMgYSBzcGVjaWFsIG9mZmVyXCIgJiYgcHJpY2UgIT09IFwiQ291bnRlci1vZmZlcmVkXCIgJiYgcHJpY2UgIT09IFwiQWNjZXB0ZWRcIikge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFB1cmNoYXNlSW5mb0lubmVyKHBhcnNlSW50KGNvbHVtbnNbMl0pLCBwYXJzZURhdGUoY29sdW1uc1szXSksIGV4dHJhY3RQcmljZShwcmljZSkpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFB1cmNoYXNlSW5mb0lubmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHF1YW50aXR5OiBudW1iZXIsIGRhdGU6IERhdGUsIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZVxyXG4gICAgICAgIHRoaXMucHJpY2UgPSBwcmljZVxyXG4gICAgfVxyXG5cclxuICAgIHF1YW50aXR5OiBudW1iZXI7XHJcbiAgICBwcmljZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGF0ZTogRGF0ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURhdGUoZGF0ZVN0cmluZyk6IERhdGUge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBkYXRlU3RyaW5nLm1hdGNoKC8oXFxkK1xcc1tBLXpdK1xcc1xcZCspXFxzYXRcXHMoXFxkKyk6KFxcZCspOihcXGQrKShhbXxwbSlcXHMoW0Etel0rKS8pXHJcblxyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKG1hdGNoZXNbMV0gKyAnIDAwOjAwOjAwLjAwMFonKSlcclxuXHJcbiAgICBkYXRlLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1hdGNoZXNbMl0pKTtcclxuICAgIGRhdGUuc2V0VVRDTWludXRlcyhwYXJzZUludChtYXRjaGVzWzNdKSk7XHJcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobWF0Y2hlc1s0XSkpO1xyXG5cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcInBtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpICE9PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpICsgMTIpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1hdGNoZXNbNV0gPT09IFwiYW1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgPT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAxMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1hdGNoZXNbNl0gPT09IFwiTVNLXCIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSAtIDMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHRpbWV6b25lIFwiICsgbWF0Y2hlc1s2XSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dDogc3RyaW5nKTogUHVyY2hhc2VJbmZvW10ge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gbmV3IEFycmF5PFB1cmNoYXNlSW5mb0lubmVyPigpO1xyXG4gICAgbGV0IGZpeGVkUHJpY2VCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYuZml4ZWQtcHJpY2UgdGJvZHknKVxyXG4gICAgaWYgKGZpeGVkUHJpY2VCbG9jayAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaXhlZFByaWNlUm93cyA9IFsuLi5maXhlZFByaWNlQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvZmZlckJsb2NrID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5vZmZlciB0Ym9keScpXHJcbiAgICBpZiAob2ZmZXJCbG9jayAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBvZmZlclJvd3MgPSBbLi4ub2ZmZXJCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCd0cicpXVxyXG4gICAgICAgIGZpbGxTb2xkSXRlbXNSZXN1bHQob2ZmZXJSb3dzLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBiLmRhdGUuZ2V0VGltZSgpIC0gYS5kYXRlLmdldFRpbWUoKTtcclxuICAgIH0pLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHVyY2hhc2VJbmZvKHtcclxuICAgICAgICAgICAgZGF0ZTogeC5kYXRlLnRvSVNPU3RyaW5nKCksIHF1YW50aXR5OiB4LnF1YW50aXR5LCBwcmljZTogeC5wcmljZVxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbElkKCkge1xyXG4gICAgbG90SW5mby5sb3RJZCA9IHBhcnNlSW50KGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFByaWNlKCkge1xyXG4gICAgbG90SW5mby5wcmljZSA9IGV4dHJhY3RQcmljZSgoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LngtcHJpY2UtcHJpbWFyeSBzcGFuJykpLmlubmVyVGV4dClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbE5hbWUoKSB7XHJcbiAgICBsb3RJbmZvLm5hbWUgPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnLnZpbSBoMScpKS5pbm5lclRleHRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFNlbGxlcigpIHtcclxuICAgIGxvdEluZm8uc2VsbGVyID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXNlbGxlcmNhcmQtYXRmX19pbmZvX19hYm91dC1zZWxsZXIgYScpKS5pbm5lclRleHQudG9Mb3dlckNhc2UoKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsQ29uZGl0aW9uKCkge1xyXG4gICAgbG90SW5mby5jb25kaXRpb24gPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LngtaXRlbS1jb25kaXRpb24tdGV4dCBzcGFuLnV4LXRleHRzcGFucycpKS5pbm5lclRleHRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLWRlc2MnKVxyXG4gICAgaWYgKGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgbG90SW5mby5jb25kaXRpb25EZXNjcmlwdGlvbiA9ICg8SFRNTEVsZW1lbnQ+Y29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50KS5pbm5lclRleHRcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnCcsICcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCdJywgJycpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxTaGlwcGluZygpIHtcclxuICAgIGxldCBzaGlwcGluZ0RpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LmQtc2hpcHBpbmctbWF4dmlldycpXHJcbiAgICBsZXQgc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSA9IHNoaXBwaW5nRGl2LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi51eC1sYXlvdXQtc2VjdGlvbl9fdGV4dHVhbC1kaXNwbGF5LS1hc2tTZWxsZXInKSA9PT0gbnVsbFxyXG4gICAgaWYgKHNoaXBwaW5nUmF0ZXNBdmFpbGFibGUpIHtcclxuICAgICAgICBsZXQgc2hpcHBpbmdUYWJsZSA9IHNoaXBwaW5nRGl2LnF1ZXJ5U2VsZWN0b3IoJ3RhYmxlLnV4LXRhYmxlLXNlY3Rpb24td2l0aC1oaW50cy0tc2hpcHBpbmdUYWJsZScpXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlciA9IFsuLi5zaGlwcGluZ1RhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3RoZWFkJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJyldXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlcyA9IFsuLi5zaGlwcGluZ1RhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5JylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ3RyJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ01heHZpZXdWYWx1ZXMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlcltpXS5pbm5lclRleHRcclxuICAgICAgICAgICAgc2hpcHBpbmdNYXh2aWV3VmFsdWVzW2tleV0gPSBkZWxpdmVyeUNvbHVtbnNWYWx1ZXNbaV0ucXVlcnlTZWxlY3Rvcignc3BhbicpLmlubmVyVGV4dFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snVG8nXSAhPT0gJ0dlcm1hbnknKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcHBpbmcgY291bnRyeSBtdXN0IGJlIEdlcm1hbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ1ZhbHVlID0gc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydTaGlwcGluZyBhbmQgaGFuZGxpbmcnXVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdWYWx1ZSAhPT0gJ0ZyZWUgc2hpcHBpbmcnKSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSBleHRyYWN0UHJpY2Uoc2hpcHBpbmdWYWx1ZSlcclxuXHJcbiAgICAgICAgICAgIGlmIChzaGlwcGluZ01heHZpZXdWYWx1ZXMuaGFzT3duUHJvcGVydHkoJ0VhY2ggYWRkaXRpb25hbCBpdGVtJykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWFjaEFkZGl0aW9uYWwgPSBzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ0VhY2ggYWRkaXRpb25hbCBpdGVtJ11cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWFjaEFkZGl0aW9uYWwgIT09IFwiRnJlZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSBleHRyYWN0UHJpY2UoZWFjaEFkZGl0aW9uYWwpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gMDtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG90SW5mby5zaGlwcGluZyA9IHVuZGVmaW5lZDtcclxuICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbExvY2F0ZWRJbigpIHtcclxuICAgIGxldCBtYXRjaCA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuZC1zaGlwcGluZy1taW52aWV3JykpLmlubmVyVGV4dC5tYXRjaCgvTG9jYXRlZFxcc2luOlxccyguKykvKVxyXG4gICAgaWYgKG1hdGNoICE9PSBudWxsKSB7XHJcbiAgICAgICAgbG90SW5mby5sb2NhdGVkSW4gPSBtYXRjaFsxXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb3RJbmZvLmxvY2F0ZWRJbiA9IFwiVW5rbm93blwiXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxEZXNjcmlwdGlvbigpIHtcclxuICAgIGxldCBkZXNjcmlwdGlvblVybCA9ICg8SFRNTElGcmFtZUVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcjZGVzY19pZnInKSkuc3JjXHJcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaFJlc291cmNlKGRlc2NyaXB0aW9uVXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pXHJcbiAgICBsb3RJbmZvLmRlc2NyaXB0aW9uID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQdXJjaGFzZUhpc3RvcnkoKSB7XHJcbiAgICBsZXQgaXRlbUlkID0gbG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV07XHJcbiAgICBsZXQgcHVyY2hhc2VIaXN0b3J5VXJsID0gYGh0dHBzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX0vYmluL3B1cmNoYXNlSGlzdG9yeT9pdGVtPSR7aXRlbUlkfWA7XHJcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaFJlc291cmNlKHB1cmNoYXNlSGlzdG9yeVVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgbGV0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KClcclxuICAgIGxvdEluZm8ucHVyY2hhc2VIaXN0b3J5ID0gcGFyc2VTb2xkSXRlbXNQYWdlKHRleHQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlYXJjaFF1ZXJ5KCkgOiBzdHJpbmcgfCB1bmRlZmluZWQge1xyXG4gICAgaWYgKGRvY3VtZW50LnJlZmVycmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwoZG9jdW1lbnQucmVmZXJyZXIpLnNlYXJjaFBhcmFtcz8uZ2V0KCdfbmt3Jyk/LnRyaW0oKT8udG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFByb2R1Y3QocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBjbGllbnQ6IENsaWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBwcm9kdWN0RmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QjJyArIHByb2R1Y3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBwcm9kdWN0SWQgPSBzZXJ2ZXJMb3RJbmZvPy5wcm9kdWN0SWQ/LnRyaW0oKT8udG9Mb3dlckNhc2UoKVxyXG4gICAgbGV0IHNlYXJjaFF1ZXJ5ID0gZ2V0U2VhcmNoUXVlcnkoKTtcclxuXHJcbiAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCBjbGllbnQuZ2V0QWxsUHJvZHVjdHMoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHQudmFsdWUgPSBwcm9kdWN0c1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gcHJvZHVjdHNbaV0ubmFtZTtcclxuXHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9kdWN0SWQgPT09IHByb2R1Y3RzW2ldLmlkLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcHJvZHVjdHNbaV0uc2VhcmNoUXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoUXVlcnkgPT09IHgucXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9kdWN0RmllbGQuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbE1hbnVhbENvbmRpdGlvbihwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbkZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBtYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbklkID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8ubWFudWFsQ29uZGl0aW9uSWQ/LnRyaW0oKT8udG9Mb3dlckNhc2UoKVxyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25zID0gYXdhaXQgY2xpZW50LmdldE1hbnVhbENvbmRpdGlvbnNMaXN0KClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFudWFsQ29uZGl0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHQudmFsdWUgPSBtYW51YWxDb25kaXRpb25zW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBtYW51YWxDb25kaXRpb25zW2ldLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgICAgICBpZiAobWFudWFsQ29uZGl0aW9uSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAobWFudWFsQ29uZGl0aW9uSWQgPT09IG1hbnVhbENvbmRpdGlvbnNbaV0uaWQudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFudWFsQ29uZGl0aW9uRmllbGQuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0U2VydmVyTG90SW5mbyhjbGllbnQ6IENsaWVudCk6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgX3NlcnZlckxvdEluZm8gPSBhd2FpdCBjbGllbnQuZ2V0TG90SW5mbyhsb3RJbmZvLmxvdElkKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFBjcyhwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcGNzRmllbGQgPSA8SFRNTElucHV0RWxlbWVudD5wYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgcGNzRmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgc2VydmVyUGNzID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8ucGNzXHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwY3NGaWVsZC52YWx1ZSA9IHNlcnZlclBjcy50b1N0cmluZygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxJZ25vcmVUaGF0TG90KHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBpZ25vcmVUaGF0TG90RmllbGQgPSA8SFRNTElucHV0RWxlbWVudD5wYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgaWdub3JlVGhhdExvdEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/Lmlnbm9yZVRoYXRMb3RcclxuICAgIGlmIChzZXJ2ZXJQY3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlnbm9yZVRoYXRMb3RGaWVsZC5jaGVja2VkID0gc2VydmVyUGNzXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb21wYXJlTG90SW5mb3Moc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQ6IExvdEluZm9XaXRoUHJvZHVjdElkKSB7XHJcbiAgICBpZiAoc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgbGV0IHNlcnZlckxvdEluZm9Kc29uID0gc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQubG90SW5mby50b0pTT04oKVxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJwY3NcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wiaWdub3JlVGhhdExvdFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJkZXNjcmlwdGlvblwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbGV0IHNlcnZlclB1cmNoYXNlSGlzdG9yeSA9IHNlcnZlckxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbGV0IGxvdEluZm9Kc29uID0gbG90SW5mby50b0pTT04oKVxyXG4gICAgbG90SW5mb0pzb25bXCJwY3NcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wiaWdub3JlVGhhdExvdFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJkZXNjcmlwdGlvblwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbGV0IGxvdEluZm9QdXJjaGFzZUhpc3RvcnkgPSBsb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXTtcclxuICAgIGxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gdW5kZWZpbmVkXHJcbiAgICBcclxuICAgIGxldCBzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHNlcnZlckxvdEluZm9Kc29uKVxyXG4gICAgbGV0IGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvSnNvbilcclxuICAgIGxldCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoc2VydmVyUHVyY2hhc2VIaXN0b3J5KVxyXG4gICAgbGV0IGxvdEluZm9QdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobG90SW5mb1B1cmNoYXNlSGlzdG9yeSlcclxuXHJcbiAgICBsZXQgcGFuZWwgPSA8SFRNTERpdkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MpO1xyXG4gICAgaWYgKHNlcnZlckxvdEluZm9Kc29uU3RyaW5nID09PSBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2VydmVyUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZylcclxuICAgICAgICBjb25zb2xlLmxvZyhsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZylcclxuICAgICAgICBpZiAoX3NlcnZlckxvdEluZm8ubG90SW5mby5pZ25vcmVUaGF0TG90ID09PSB0cnVlIHx8IHNlcnZlclB1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcgPT09IGxvdEluZm9QdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodEdyZWVuQ29sb3J9O2BcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGFuZWwuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0WWVsbG93Q29sb3J9O2BcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodFBpbmtDb2xvcn07YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6IFwiICsgc2VydmVyTG90SW5mb0pzb25TdHJpbmcpXHJcbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnRQYWdlOiBcIiArIGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldERhdGFGcm9tUGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHBhbmVsID0gPEhUTUxEaXZFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzKVxyXG5cclxuICAgIGZpbGxJZCgpO1xyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIGZpbGxQcmljZSgpLFxyXG4gICAgICAgIGZpbGxOYW1lKCksXHJcbiAgICAgICAgZmlsbFNlbGxlcigpLFxyXG4gICAgICAgIGZpbGxDb25kaXRpb24oKSxcclxuICAgICAgICBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24oKSxcclxuICAgICAgICBmaWxsTG9jYXRlZEluKCksXHJcbiAgICAgICAgZmlsbERlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgZmlsbFB1cmNoYXNlSGlzdG9yeSgpLFxyXG4gICAgICAgIGdldFNlcnZlckxvdEluZm8oY2xpZW50KVxyXG4gICAgXSlcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHJvZHVjdChwYW5lbCwgY2xpZW50LCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbE1hbnVhbENvbmRpdGlvbihwYW5lbCwgY2xpZW50LCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbFBjcyhwYW5lbCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxJZ25vcmVUaGF0TG90KHBhbmVsLCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbFNoaXBwaW5nKCksXHJcbiAgICBdKTtcclxuICAgIFxyXG4gICAgYXdhaXQgY29tcGFyZUxvdEluZm9zKF9zZXJ2ZXJMb3RJbmZvKTtcclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGFkZFBhbmVsKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgYm9keUVsZW1lbnQgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2JvZHknKTtcclxuICAgIGlmIChib2R5RWxlbWVudCkge1xyXG4gICAgICAgIGxldCBleGlzdGluZ1BhbmVsID0gYm9keUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgICAgICBpZiAoIWV4aXN0aW5nUGFuZWwpIHtcclxuICAgICAgICAgICAgY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3I6IEVycm9yKSB7XHJcbiAgICBsZXQgZXJyb3JEaXYgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcyArICcgIycgKyBlcnJvckVsZW1lbnRJZClcclxuICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgbGV0IHZhbGlkYXRpb25FcnJvciA9IDxWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbz5lcnJvclxyXG4gICAgICAgIHNwYW4uaW5uZXJIVE1MID0gXCLQntGI0LjQsdC60LAg0LLQsNC70LjQtNCw0YbQuNC4OiBcIiArIEpTT04uc3RyaW5naWZ5KHZhbGlkYXRpb25FcnJvci5lcnJvcnMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yLnN0YWNrKVxyXG4gICAgICAgIHNwYW4uaW5uZXJIVE1MID0gZXJyb3Iuc3RhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgZXJyb3JEaXYuYXBwZW5kQ2hpbGQoc3BhbilcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZW5hYmxlU3VibWl0QnV0dG9uKCkge1xyXG4gICAgKDxIVE1MQnV0dG9uRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJyMnICsgc3VibWl0SWQpKS5kaXNhYmxlZCA9IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6ZUZldGNoKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KTogRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuICAgIHJldHVybiBuZXcgRmV0Y2hXcmFwcGVyQ3VzdG9tKHtcclxuICAgICAgICBjbGllbnQ6IG9BdXRoMkNsaWVudCxcclxuICAgICAgICBnZXROZXdUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSkuY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhd2FpdCBvQXV0aDJDbGllbnQuYXV0aG9yaXphdGlvbkNvZGUuZ2V0QXV0aG9yaXplVXJpKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXIsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogWydFYmF5LlNlcnZlckFQSSddXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFN0b3JlZFRva2VuOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWNrZW5kVXJsICE9PSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImJhY2tlbmRfdXJsXCJdKSkuYmFja2VuZF91cmwpICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHRva2VuID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ0b2tlbl9zdG9yZVwiXSkpLnRva2VuX3N0b3JlO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pIHJldHVybiBKU09OLnBhcnNlKHRva2VuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSlcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGlkZUVycm9ycygpIHtcclxuICAgIGxldCBlcnJvckRpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzICsgJyAjJyArIGVycm9yRWxlbWVudElkKVxyXG4gICAgZXJyb3JEaXYuaW5uZXJIVE1MID0gXCJcIlxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwcm9kdWN0UGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJwcm9kdWN0UGFnZVwiKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBhZGRQYW5lbChjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGdldERhdGFGcm9tUGFnZShjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGVuYWJsZVN1Ym1pdEJ1dHRvbigpXHJcbiAgICAgICAgYXdhaXQgaGlkZUVycm9ycygpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGF1dGhQYWdlKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImF1dGhQYWdlXCIpXHJcbiAgICBsZXQgdXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKVxyXG4gICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKFwiY29kZVwiKSkge1xyXG4gICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKS5jb2RlX3ZlcmlmaWVyO1xyXG4gICAgICAgIGxldCBvYXV0aDJUb2tlbiA9IGF3YWl0IG9BdXRoMkNsaWVudC5hdXRob3JpemF0aW9uQ29kZS5nZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtiYWNrZW5kX3VybDogYmFja2VuZFVybH0pXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHt0b2tlbl9zdG9yZTogSlNPTi5zdHJpbmdpZnkob2F1dGgyVG9rZW4pfSlcclxuXHJcbiAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGF1dGhSZWRpcmVjdFVybFxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoUGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJTZWFyY2hQYWdlXCIpXHJcbiAgICAvL9GC0L7Qu9GM0LrQviDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0L/RgNC+0LTQsNC90YvQtSDQu9C+0YLRi1xyXG4gICAgaWYgKG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zPy5nZXQoJ0xIX1NvbGQnKT8udHJpbSgpICE9PSBcIjFcIikgcmV0dXJuO1xyXG5cclxuICAgIGxldCBzZWFyY2hSZXN1bHRzID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCd1bC5zcnAtcmVzdWx0cycpXHJcblxyXG4gICAgbGV0IGxpbmtzID0gWy4uLnNlYXJjaFJlc3VsdHMucXVlcnlTZWxlY3RvckFsbCgnbGkucy1pdGVtJyldXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoeDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGxpbmsgPSA8SFRNTEFuY2hvckVsZW1lbnQ+eC5xdWVyeVNlbGVjdG9yKCdhLnMtaXRlbV9fbGluaycpXHJcbiAgICAgICAgICAgIGxldCBzb2xkRGF0ZSA9IG5ldyBEYXRlKCg8SFRNTEVsZW1lbnQ+eC5xdWVyeVNlbGVjdG9yKCdzcGFuLlBPU0lUSVZFJykpLmlubmVyVGV4dC5yZXBsYWNlKFwiU29sZCBcIiwgXCJcIikpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTG90TGluayhwYXJzZUludChsaW5rLmhyZWYubWF0Y2goL2h0dHBzOlxcL1xcL1teXFwvXStcXC9pdG1cXC8oXFxkKykvKVsxXSksIGxpbmssIHNvbGREYXRlKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIGxldCBfID0gdXBkYXRlU3RhdHVzSW5maW5pdGUoY2xpZW50LCBsaW5rcyk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVN0YXR1c0luZmluaXRlKGNsaWVudDogQ2xpZW50LCBsaW5rczogTG90TGlua1tdKSB7XHJcbiAgICBsZXQgaWRzID0gbGlua3MubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHguaWRcclxuICAgIH0pXHJcbiAgICAvLyBub2luc3BlY3Rpb24gSW5maW5pdGVMb29wSlNcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGluZ0xvdFN0YXRlc1wiKVxyXG4gICAgICAgICAgICBsZXQgZ2V0TG90U3RhdGVzQW5zd2VyID0gYXdhaXQgY2xpZW50LmdldExvdFN0YXRlcyhpZHMpXHJcblxyXG4gICAgICAgICAgICBsZXQga25vd25Mb3RzID0gbmV3IE1hcChnZXRMb3RTdGF0ZXNBbnN3ZXIubWFwKHAgPT4gW3AubG90SWQsIHBdKSk7XHJcblxyXG4gICAgICAgICAgICBsaW5rcy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbG9yID0geC5jb2xvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa25vd25Mb3RzLmhhcyh4LmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsb3RTdGF0ZSA9IGtub3duTG90cy5nZXQoeC5pZClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWxvdFN0YXRlLmlnbm9yZVRoYXRMb3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRpZmZJbkRheXMgPSBNYXRoLmNlaWwoKHguc29sZERhdGUuZ2V0VGltZSgpIC0gbmV3IERhdGUobG90U3RhdGUubGFzdFVwZGF0ZSkuZ2V0VGltZSgpKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaWZmSW5EYXlzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0WWVsbG93Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSBsaWdodEdyZWVuQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSBsaWdodEdyZWVuQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSBsaWdodFBpbmtDb2xvclxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh4LmNvbG9yICE9PSBudWxsICYmIGNvbG9yICE9PSB4LmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5saW5rLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHt4LmNvbG9yfTtgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3Iuc3RhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIExvdExpbmsge1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgbGluazogSFRNTEFuY2hvckVsZW1lbnQsIHNvbGREYXRlOiBEYXRlKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkXHJcbiAgICAgICAgdGhpcy5saW5rID0gbGlua1xyXG4gICAgICAgIHRoaXMuc29sZERhdGUgPSBzb2xkRGF0ZVxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgaWQ6IG51bWJlcjtcclxuICAgIGxpbms6IEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgc29sZERhdGU6IERhdGVcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBudWxsXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNsZWVwRWxlbWVudExvYWRlZChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxFbGVtZW50PiB7XHJcbiAgICBsZXQgcmV0cnkgPSAwXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHJldHJ5Kys7XHJcbiAgICAgICAgaWYgKHJldHJ5ID4gMTAwMCkgdGhyb3cgbmV3IEVycm9yKFwidW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvciBcIiArIHNlbGVjdG9yKVxyXG5cclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IG51bGwpIHJldHVybiBlbGVtZW50XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNhdmVDb2RlVmVyaWZpZXIoKSB7XHJcbiAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSk/LmNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgaWYgKGNvZGVWZXJpZmllciA9PT0gbnVsbCB8fCBjb2RlVmVyaWZpZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSBhd2FpdCBnZW5lcmF0ZUNvZGVWZXJpZmllcigpO1xyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29kZV92ZXJpZmllcjogY29kZVZlcmlmaWVyfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bigpIHtcclxuICAgIGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZm9vdGVyJylcclxuICAgIGF3YWl0IHNhdmVDb2RlVmVyaWZpZXIoKTtcclxuXHJcbiAgICBsZXQgb0F1dGgyQ2xpZW50ID0gbmV3IE9BdXRoMkNsaWVudCh7XHJcbiAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgIGNsaWVudElkOiAnRWJheS5DaHJvbWVFeHRlbnNpb24nLFxyXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6ICcvY29ubmVjdC90b2tlbicsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcblxyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09PSBhdXRoUmVkaXJlY3RVcmwpIHtcclxuICAgICAgICBhd2FpdCBhdXRoUGFnZShvQXV0aDJDbGllbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY2xpZW50ID0gbmV3IENsaWVudChiYXNlQXBpVXJsLCBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQpKTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9pdG0vXCIpKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50UGFnZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZWJheS5jb20vc2NoL1wiKSkge1xyXG4gICAgICAgICAgICBhd2FpdCBzZWFyY2hQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxucnVuKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==