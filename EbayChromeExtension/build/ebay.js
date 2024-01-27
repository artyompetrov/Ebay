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
const notSetValue = "notSet";
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
    return __awaiter(this, void 0, void 0, function* () {
        let productTitleContainer = yield sleepElementLoaded('.vim[data-testid="x-item-title"]');
        if (productTitleContainer) {
            let existingButton = productTitleContainer.querySelector('a.history-button');
            if (!existingButton) {
                let historyButton = createHistoryButton();
                productTitleContainer.appendChild(historyButton);
            }
        }
    });
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
        let lotInfoJson = lotInfo.toJSON();
        lotInfoJson["pcs"] = undefined;
        lotInfoJson["ignoreThatLot"] = undefined;
        lotInfoJson["manualConditionId"] = undefined;
        if (serverLotInfoWithProductId.lotInfo.ignoreThatLot) {
            serverLotInfoJson["purchaseHistory"] = undefined;
            lotInfoJson["purchaseHistory"] = undefined;
        }
        let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson);
        let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson);
        let panel = yield sleepElementLoaded('div.' + panelClass);
        if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
            panel.style.cssText = `background-color: #ecffec;`;
        }
        else {
            panel.style.cssText = `background-color: lightpink;`;
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
            yield addHistoryButton();
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
                                x.color = '#e0e07f';
                            }
                            else {
                                x.color = 'lightgreen';
                            }
                            console.log(diffInDays);
                        }
                        else {
                            x.color = 'lightgreen';
                        }
                    }
                    else {
                        x.color = 'lightpink';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRSxnQkFBZ0I7WUFDL0IscUJBQXFCLEVBQUUsb0JBQW9CO1lBQzNDLEtBQUssRUFBRSxhQUFhO1NBQ3ZCLENBQUMsQ0FBQztRQUVILElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVE7UUFFOUUsSUFBSSxXQUFXLEtBQUssZUFBZSxFQUFFLENBQUM7WUFDbEMsTUFBTSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLE1BQU0sR0FBRyxJQUFJLG1CQUFNLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFckUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQztnQkFDdEQsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsQ0FBQztpQkFBTSxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO2dCQUM3RCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQXpCRCxrQkF5QkM7QUFHRCxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztVQ251Qk47VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50L2Jyb3dzZXIvb2F1dGgyLWNsaWVudC5taW4uanMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRWJheUNsaWVudC9FYmF5Q2xpZW50LnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL0ZldGNoV3JhcHBlckN1c3RvbS50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9tYWluLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9dCgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sdCk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5PQXV0aDJDbGllbnQ9dCgpOmUuT0F1dGgyQ2xpZW50PXQoKX0oc2VsZiwoKCk9PigoKT0+e3ZhciBlPXs5MzQ6KGUsdCxyKT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZ2VuZXJhdGVRdWVyeVN0cmluZz10Lk9BdXRoMkNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDQ0MyksaT1yKDYxOCk7ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBuZXcgVVJMKGUsdCkudG9TdHJpbmcoKX1mdW5jdGlvbiBzKGUpe3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhlKS5maWx0ZXIoKChbZSx0XSk9PnZvaWQgMCE9PXQpKSkpLnRvU3RyaW5nKCl9dC5PQXV0aDJDbGllbnQ9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy5kaXNjb3ZlcnlEb25lPSExLHRoaXMuc2VydmVyTWV0YWRhdGE9bnVsbCwobnVsbD09ZT92b2lkIDA6ZS5mZXRjaCl8fChlLmZldGNoPWZldGNoLmJpbmQoZ2xvYmFsVGhpcykpLHRoaXMuc2V0dGluZ3M9ZX1hc3luYyByZWZyZXNoVG9rZW4oZSl7aWYoIWUucmVmcmVzaFRva2VuKXRocm93IG5ldyBFcnJvcihcIlRoaXMgdG9rZW4gZGlkbid0IGhhdmUgYSByZWZyZXNoVG9rZW4uIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHJlZnJlc2ggdGhpc1wiKTtjb25zdCB0PXtncmFudF90eXBlOlwicmVmcmVzaF90b2tlblwiLHJlZnJlc2hfdG9rZW46ZS5yZWZyZXNoVG9rZW59O3JldHVybiB0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldHx8KHQuY2xpZW50X2lkPXRoaXMuc2V0dGluZ3MuY2xpZW50SWQpLHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHQpKX1hc3luYyBjbGllbnRDcmVkZW50aWFscyhlKXt2YXIgdDtjb25zdCByPVtcImNsaWVudF9pZFwiLFwiY2xpZW50X3NlY3JldFwiLFwiZ3JhbnRfdHlwZVwiLFwic2NvcGVcIl07aWYoKG51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXMpJiZPYmplY3Qua2V5cyhlLmV4dHJhUGFyYW1zKS5maWx0ZXIoKGU9PnIuaW5jbHVkZXMoZSkpKS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZXh0cmFQYXJhbXMgYXJlIGRpc2FsbG93ZWQ6ICcke3Iuam9pbihcIicsICdcIil9J2ApO2NvbnN0IG49e2dyYW50X3R5cGU6XCJjbGllbnRfY3JlZGVudGlhbHNcIixzY29wZTpudWxsPT09KHQ9bnVsbD09ZT92b2lkIDA6ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIiksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc307aWYoIXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KXRocm93IG5ldyBFcnJvcihcIkEgY2xpZW50U2VjcmV0IG11c3QgYmUgcHJvdmlkZWQgdG8gdXNlIGNsaWVudF9jcmVkZW50aWFsc1wiKTtyZXR1cm4gdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsbikpfWFzeW5jIHBhc3N3b3JkKGUpe3ZhciB0O2NvbnN0IHI9e2dyYW50X3R5cGU6XCJwYXNzd29yZFwiLC4uLmUsc2NvcGU6bnVsbD09PSh0PWUuc2NvcGUpfHx2b2lkIDA9PT10P3ZvaWQgMDp0LmpvaW4oXCIgXCIpfTtyZXR1cm4gdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIscikpfWdldCBhdXRob3JpemF0aW9uQ29kZSgpe3JldHVybiBuZXcgaS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudCh0aGlzKX1hc3luYyBpbnRyb3NwZWN0KGUpe2NvbnN0IHQ9e3Rva2VuOmUuYWNjZXNzVG9rZW4sdG9rZW5fdHlwZV9oaW50OlwiYWNjZXNzX3Rva2VuXCJ9O3JldHVybiB0aGlzLnJlcXVlc3QoXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIix0KX1hc3luYyBnZXRFbmRwb2ludChlKXtpZih2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKXJldHVybiBvKHRoaXMuc2V0dGluZ3NbZV0sdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2lmKFwiZGlzY292ZXJ5RW5kcG9pbnRcIiE9PWUmJihhd2FpdCB0aGlzLmRpc2NvdmVyKCksdm9pZCAwIT09dGhpcy5zZXR0aW5nc1tlXSkpcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoIXRoaXMuc2V0dGluZ3Muc2VydmVyKXRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGRldGVybWluZSB0aGUgbG9jYXRpb24gb2YgJHtlfS4gRWl0aGVyIHNwZWNpZnkgJHtlfSBpbiB0aGUgc2V0dGluZ3MsIG9yIHRoZSBcInNlcnZlclwiIGVuZHBvaW50IHRvIGxldCB0aGUgY2xpZW50IGRpc2NvdmVyIGl0LmApO3N3aXRjaChlKXtjYXNlXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9hdXRob3JpemVcIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwidG9rZW5FbmRwb2ludFwiOnJldHVybiBvKFwiL3Rva2VuXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcImRpc2NvdmVyeUVuZHBvaW50XCI6cmV0dXJuIG8oXCIvLndlbGwta25vd24vb2F1dGgtYXV0aG9yaXphdGlvbi1zZXJ2ZXJcIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvaW50cm9zcGVjdFwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKX19YXN5bmMgZGlzY292ZXIoKXt2YXIgZTtpZih0aGlzLmRpc2NvdmVyeURvbmUpcmV0dXJuO2xldCB0O3RoaXMuZGlzY292ZXJ5RG9uZT0hMDt0cnl7dD1hd2FpdCB0aGlzLmdldEVuZHBvaW50KFwiZGlzY292ZXJ5RW5kcG9pbnRcIil9Y2F0Y2goZSl7cmV0dXJuIHZvaWQgY29uc29sZS53YXJuKCdbb2F1dGgyXSBPQXV0aDIgZGlzY292ZXJ5IGVuZHBvaW50IGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBFaXRoZXIgc3BlY2lmeSB0aGUgXCJzZXJ2ZXJcIiBvciBcImRpc2NvdmVyeUVuZHBvaW50Jyl9Y29uc3Qgcj1hd2FpdCB0aGlzLnNldHRpbmdzLmZldGNoKHQse2hlYWRlcnM6e0FjY2VwdDpcImFwcGxpY2F0aW9uL2pzb25cIn19KTtpZighci5vaylyZXR1cm47aWYoIShudWxsPT09KGU9ci5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKSl8fHZvaWQgMD09PWU/dm9pZCAwOmUuc3RhcnRzV2l0aChcImFwcGxpY2F0aW9uL2pzb25cIikpKXJldHVybiB2b2lkIGNvbnNvbGUud2FybihcIltvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgd2FzIG5vdCBhIEpTT04gcmVzcG9uc2UuIFJlc3BvbnNlIGlzIGlnbm9yZWRcIik7dGhpcy5zZXJ2ZXJNZXRhZGF0YT1hd2FpdCByLmpzb24oKTtjb25zdCBuPVtbXCJhdXRob3JpemF0aW9uX2VuZHBvaW50XCIsXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIl0sW1widG9rZW5fZW5kcG9pbnRcIixcInRva2VuRW5kcG9pbnRcIl0sW1wiaW50cm9zcGVjdGlvbl9lbmRwb2ludFwiLFwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCJdXTtpZihudWxsIT09dGhpcy5zZXJ2ZXJNZXRhZGF0YSl7Zm9yKGNvbnN0W2Uscl1vZiBuKXRoaXMuc2VydmVyTWV0YWRhdGFbZV0mJih0aGlzLnNldHRpbmdzW3JdPW8odGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSx0KSk7dGhpcy5zZXJ2ZXJNZXRhZGF0YS50b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZHNfc3VwcG9ydGVkJiYhdGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZCYmKHRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2Q9dGhpcy5zZXJ2ZXJNZXRhZGF0YS50b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZHNfc3VwcG9ydGVkWzBdKX19YXN5bmMgcmVxdWVzdChlLHQpe2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRFbmRwb2ludChlKSxpPXtcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJ9O2xldCBvPXRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2Q7c3dpdGNoKG98fChvPXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0P1wiY2xpZW50X3NlY3JldF9iYXNpY1wiOlwiY2xpZW50X3NlY3JldF9wb3N0XCIpLG8pe2Nhc2VcImNsaWVudF9zZWNyZXRfYmFzaWNcIjppLkF1dGhvcml6YXRpb249XCJCYXNpYyBcIitidG9hKHRoaXMuc2V0dGluZ3MuY2xpZW50SWQrXCI6XCIrdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpO2JyZWFrO2Nhc2VcImNsaWVudF9zZWNyZXRfcG9zdFwiOnQuY2xpZW50X2lkPXRoaXMuc2V0dGluZ3MuY2xpZW50SWQsdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQmJih0LmNsaWVudF9zZWNyZXQ9dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpO2JyZWFrO2RlZmF1bHQ6dGhyb3cgbmV3IEVycm9yKFwiQXV0aGVudGljYXRpb24gbWV0aG9kIG5vdCB5ZXQgc3VwcG9ydGVkOlwiK28rXCIuIE9wZW4gYSBmZWF0dXJlIHJlcXVlc3QgaWYgeW91IHdhbnQgdGhpcyFcIil9Y29uc3QgYT1hd2FpdCB0aGlzLnNldHRpbmdzLmZldGNoKHIse21ldGhvZDpcIlBPU1RcIixib2R5OnModCksaGVhZGVyczppfSk7aWYoYS5vaylyZXR1cm4gYXdhaXQgYS5qc29uKCk7bGV0IGMsaCx1O3Rocm93IGEuaGVhZGVycy5oYXMoXCJDb250ZW50LVR5cGVcIikmJmEuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikuc3RhcnRzV2l0aChcImFwcGxpY2F0aW9uL2pzb25cIikmJihjPWF3YWl0IGEuanNvbigpKSwobnVsbD09Yz92b2lkIDA6Yy5lcnJvcik/KGg9XCJPQXV0aDIgZXJyb3IgXCIrYy5lcnJvcitcIi5cIixjLmVycm9yX2Rlc2NyaXB0aW9uJiYoaCs9XCIgXCIrYy5lcnJvcl9kZXNjcmlwdGlvbiksdT1jLmVycm9yKTooaD1cIkhUVFAgRXJyb3IgXCIrYS5zdGF0dXMrXCIgXCIrYS5zdGF0dXNUZXh0LDQwMT09PWEuc3RhdHVzJiZ0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKGgrPVwiLiBJdCdzIGxpa2VseSB0aGF0IHRoZSBjbGllbnRJZCBhbmQvb3IgY2xpZW50U2VjcmV0IHdhcyBpbmNvcnJlY3RcIiksdT1udWxsKSxuZXcgbi5PQXV0aDJFcnJvcihoLHUsYS5zdGF0dXMpfXRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKGUpe3JldHVybiBlLnRoZW4oKGU9Pnt2YXIgdDtyZXR1cm57YWNjZXNzVG9rZW46ZS5hY2Nlc3NfdG9rZW4sZXhwaXJlc0F0OmUuZXhwaXJlc19pbj9EYXRlLm5vdygpKzFlMyplLmV4cGlyZXNfaW46bnVsbCxyZWZyZXNoVG9rZW46bnVsbCE9PSh0PWUucmVmcmVzaF90b2tlbikmJnZvaWQgMCE9PXQ/dDpudWxsfX0pKX19LHQuZ2VuZXJhdGVRdWVyeVN0cmluZz1zfSw2MTg6KGUsdCxyKT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZ2V0Q29kZUNoYWxsZW5nZT10LmdlbmVyYXRlQ29kZVZlcmlmaWVyPXQuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9dm9pZCAwO2NvbnN0IG49cig5MzQpLGk9cig0NDMpO2FzeW5jIGZ1bmN0aW9uIG8oZSl7Y29uc3QgdD1zKCk7aWYobnVsbD09dD92b2lkIDA6dC5zdWJ0bGUpcmV0dXJuW1wiUzI1NlwiLGMoYXdhaXQgdC5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLGEoZSkpKV07e2NvbnN0IHQ9cigyMTIpLmNyZWF0ZUhhc2goXCJzaGEyNTZcIik7cmV0dXJuIHQudXBkYXRlKGEoZSkpLFtcIlMyNTZcIix0LmRpZ2VzdChcImJhc2U2NHVybFwiKV19fWZ1bmN0aW9uIHMoKXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuY3J5cHRvKXJldHVybiB3aW5kb3cuY3J5cHRvO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiZzZWxmLmNyeXB0bylyZXR1cm4gc2VsZi5jcnlwdG87Y29uc3QgZT1yKDIxMik7cmV0dXJuIGUud2ViY3J5cHRvP2Uud2ViY3J5cHRvOm51bGx9ZnVuY3Rpb24gYShlKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KGUubGVuZ3RoKTtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrKyl0W3JdPTI1NSZlLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9ZnVuY3Rpb24gYyhlKXtyZXR1cm4gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLm5ldyBVaW50OEFycmF5KGUpKSkucmVwbGFjZSgvXFwrL2csXCItXCIpLnJlcGxhY2UoL1xcLy9nLFwiX1wiKS5yZXBsYWNlKC89KyQvLFwiXCIpfXQuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy5jbGllbnQ9ZX1hc3luYyBnZXRBdXRob3JpemVVcmkoZSl7Y29uc3RbdCxyXT1hd2FpdCBQcm9taXNlLmFsbChbZS5jb2RlVmVyaWZpZXI/byhlLmNvZGVWZXJpZmllcik6dm9pZCAwLHRoaXMuY2xpZW50LmdldEVuZHBvaW50KFwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCIpXSk7bGV0IGk9e2NsaWVudF9pZDp0aGlzLmNsaWVudC5zZXR0aW5ncy5jbGllbnRJZCxyZXNwb25zZV90eXBlOlwiY29kZVwiLHJlZGlyZWN0X3VyaTplLnJlZGlyZWN0VXJpLGNvZGVfY2hhbGxlbmdlX21ldGhvZDpudWxsPT10P3ZvaWQgMDp0WzBdLGNvZGVfY2hhbGxlbmdlOm51bGw9PXQ/dm9pZCAwOnRbMV19O2Uuc3RhdGUmJihpLnN0YXRlPWUuc3RhdGUpLGUuc2NvcGUmJihpLnNjb3BlPWUuc2NvcGUuam9pbihcIiBcIikpO2NvbnN0IHM9T2JqZWN0LmtleXMoaSk7aWYoKG51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXMpJiZPYmplY3Qua2V5cyhlLmV4dHJhUGFyYW1zKS5maWx0ZXIoKGU9PnMuaW5jbHVkZXMoZSkpKS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZXh0cmFQYXJhbXMgYXJlIGRpc2FsbG93ZWQ6ICcke3Muam9pbihcIicsICdcIil9J2ApO3JldHVybiBpPXsuLi5pLC4uLm51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXN9LHIrXCI/XCIrKDAsbi5nZW5lcmF0ZVF1ZXJ5U3RyaW5nKShpKX1hc3luYyBnZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoZSx0KXtjb25zdHtjb2RlOnJ9PWF3YWl0IHRoaXMudmFsaWRhdGVSZXNwb25zZShlLHtzdGF0ZTp0LnN0YXRlfSk7cmV0dXJuIHRoaXMuZ2V0VG9rZW4oe2NvZGU6cixyZWRpcmVjdFVyaTp0LnJlZGlyZWN0VXJpLGNvZGVWZXJpZmllcjp0LmNvZGVWZXJpZmllcn0pfWFzeW5jIHZhbGlkYXRlUmVzcG9uc2UoZSx0KXt2YXIgcjtjb25zdCBuPW5ldyBVUkwoZSkuc2VhcmNoUGFyYW1zO2lmKG4uaGFzKFwiZXJyb3JcIikpdGhyb3cgbmV3IGkuT0F1dGgyRXJyb3IobnVsbCE9PShyPW4uZ2V0KFwiZXJyb3JfZGVzY3JpcHRpb25cIikpJiZ2b2lkIDAhPT1yP3I6XCJPQXV0aDIgZXJyb3JcIixuLmdldChcImVycm9yXCIpLDApO2lmKCFuLmhhcyhcImNvZGVcIikpdGhyb3cgbmV3IEVycm9yKGBUaGUgdXJsIGRpZCBub3QgY29udGFpbiBhIGNvZGUgcGFyYW1ldGVyICR7ZX1gKTtpZih0LnN0YXRlJiZ0LnN0YXRlIT09bi5nZXQoXCJzdGF0ZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSBcInN0YXRlXCIgcGFyYW1ldGVyIGluIHRoZSB1cmwgZGlkIG5vdCBtYXRjaCB0aGUgZXhwZWN0ZWQgdmFsdWUgb2YgJHt0LnN0YXRlfWApO3JldHVybntjb2RlOm4uZ2V0KFwiY29kZVwiKSxzY29wZTpuLmhhcyhcInNjb3BlXCIpP24uZ2V0KFwic2NvcGVcIikuc3BsaXQoXCIgXCIpOnZvaWQgMH19YXN5bmMgZ2V0VG9rZW4oZSl7Y29uc3QgdD17Z3JhbnRfdHlwZTpcImF1dGhvcml6YXRpb25fY29kZVwiLGNvZGU6ZS5jb2RlLHJlZGlyZWN0X3VyaTplLnJlZGlyZWN0VXJpLGNvZGVfdmVyaWZpZXI6ZS5jb2RlVmVyaWZpZXJ9O3JldHVybiB0aGlzLmNsaWVudC50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLmNsaWVudC5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHQpKX19LHQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9YXN5bmMgZnVuY3Rpb24oKXtjb25zdCBlPXMoKTtpZihlKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KDMyKTtyZXR1cm4gZS5nZXRSYW5kb21WYWx1ZXModCksYyh0KX17Y29uc3QgZT1yKDIxMik7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2UucmFuZG9tQnl0ZXMoMzIsKChlLG4pPT57ZSYmcihlKSx0KG4udG9TdHJpbmcoXCJiYXNlNjR1cmxcIikpfSkpfSkpfX0sdC5nZXRDb2RlQ2hhbGxlbmdlPW99LDQ0MzooZSx0KT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuT0F1dGgyRXJyb3I9dm9pZCAwO2NsYXNzIHIgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihlLHQscil7c3VwZXIoZSksdGhpcy5vYXV0aDJDb2RlPXQsdGhpcy5odHRwQ29kZT1yfX10Lk9BdXRoMkVycm9yPXJ9LDEzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJGZXRjaD12b2lkIDAsdC5PQXV0aDJGZXRjaD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLnRva2VuPW51bGwsdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsLHRoaXMuYWN0aXZlUmVmcmVzaD1udWxsLHRoaXMucmVmcmVzaFRpbWVyPW51bGwsdm9pZCAwPT09KG51bGw9PWU/dm9pZCAwOmUuc2NoZWR1bGVSZWZyZXNoKSYmKGUuc2NoZWR1bGVSZWZyZXNoPSEwKSx0aGlzLm9wdGlvbnM9ZSxlLmdldFN0b3JlZFRva2VuJiYodGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj0oYXN5bmMoKT0+e3RoaXMudG9rZW49YXdhaXQgZS5nZXRTdG9yZWRUb2tlbigpLHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49bnVsbH0pKCkpLHRoaXMuc2NoZWR1bGVSZWZyZXNoKCl9YXN5bmMgZmV0Y2goZSx0KXtjb25zdCByPW5ldyBSZXF1ZXN0KGUsdCk7cmV0dXJuIHRoaXMubXcoKShyLChlPT5mZXRjaChlKSkpfW13KCl7cmV0dXJuIGFzeW5jKGUsdCk9Pntjb25zdCByPWF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtsZXQgbj1lLmNsb25lKCk7bi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityKTtsZXQgaT1hd2FpdCB0KG4pO2lmKCFpLm9rJiY0MDE9PT1pLnN0YXR1cyl7Y29uc3Qgcj1hd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO249ZS5jbG9uZSgpLG4uaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsXCJCZWFyZXIgXCIrci5hY2Nlc3NUb2tlbiksaT1hd2FpdCB0KG4pfXJldHVybiBpfX1hc3luYyBnZXRUb2tlbigpe3JldHVybiB0aGlzLnRva2VuJiYobnVsbD09PXRoaXMudG9rZW4uZXhwaXJlc0F0fHx0aGlzLnRva2VuLmV4cGlyZXNBdD5EYXRlLm5vdygpKT90aGlzLnRva2VuOnRoaXMucmVmcmVzaFRva2VuKCl9YXN5bmMgZ2V0QWNjZXNzVG9rZW4oKXtyZXR1cm4gYXdhaXQgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiwoYXdhaXQgdGhpcy5nZXRUb2tlbigpKS5hY2Nlc3NUb2tlbn1hc3luYyByZWZyZXNoVG9rZW4oKXt2YXIgZSx0O2lmKHRoaXMuYWN0aXZlUmVmcmVzaClyZXR1cm4gdGhpcy5hY3RpdmVSZWZyZXNoO2NvbnN0IHI9dGhpcy50b2tlbjt0aGlzLmFjdGl2ZVJlZnJlc2g9KGFzeW5jKCk9Pnt2YXIgZSx0O2xldCBuPW51bGw7dHJ5eyhudWxsPT1yP3ZvaWQgMDpyLnJlZnJlc2hUb2tlbikmJihuPWF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKHIpKX1jYXRjaChlKXtjb25zb2xlLndhcm4oXCJbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2UnbGwgdHJ5IHJlYXV0aGVudGljYXRpbmdcIil9aWYobnx8KG49YXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCkpLCFuKXtjb25zdCByPW5ldyBFcnJvcihcIlVuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkXCIpO3Rocm93IG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLm9uRXJyb3IpfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSxyfXJldHVybiBufSkoKTt0cnl7Y29uc3Qgcj1hd2FpdCB0aGlzLmFjdGl2ZVJlZnJlc2g7cmV0dXJuIHRoaXMudG9rZW49cixudWxsPT09KHQ9KGU9dGhpcy5vcHRpb25zKS5zdG9yZVRva2VuKXx8dm9pZCAwPT09dHx8dC5jYWxsKGUsciksdGhpcy5zY2hlZHVsZVJlZnJlc2goKSxyfWNhdGNoKGUpe3Rocm93IHRoaXMub3B0aW9ucy5vbkVycm9yJiZ0aGlzLm9wdGlvbnMub25FcnJvcihlKSxlfWZpbmFsbHl7dGhpcy5hY3RpdmVSZWZyZXNoPW51bGx9fXNjaGVkdWxlUmVmcmVzaCgpe3ZhciBlO2lmKCF0aGlzLm9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoKXJldHVybjtpZih0aGlzLnJlZnJlc2hUaW1lciYmKGNsZWFyVGltZW91dCh0aGlzLnJlZnJlc2hUaW1lciksdGhpcy5yZWZyZXNoVGltZXI9bnVsbCksIShudWxsPT09KGU9dGhpcy50b2tlbil8fHZvaWQgMD09PWU/dm9pZCAwOmUuZXhwaXJlc0F0KXx8IXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKXJldHVybjtjb25zdCB0PXRoaXMudG9rZW4uZXhwaXJlc0F0LURhdGUubm93KCk7dDwxMmU0fHwodGhpcy5yZWZyZXNoVGltZXI9c2V0VGltZW91dCgoYXN5bmMoKT0+e3RyeXthd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoXCJbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaFwiLGUpfX0pLHQtNmU0KSl9fX0sMjEyOigpPT57fX0sdD17fTtmdW5jdGlvbiByKG4pe3ZhciBpPXRbbl07aWYodm9pZCAwIT09aSlyZXR1cm4gaS5leHBvcnRzO3ZhciBvPXRbbl09e2V4cG9ydHM6e319O3JldHVybiBlW25dKG8sby5leHBvcnRzLHIpLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4oKCk9PntcInVzZSBzdHJpY3RcIjt2YXIgZT1uO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuT0F1dGgyRXJyb3I9ZS5PQXV0aDJGZXRjaD1lLmdlbmVyYXRlQ29kZVZlcmlmaWVyPWUuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9ZS5PQXV0aDJDbGllbnQ9dm9pZCAwO3ZhciB0PXIoOTM0KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkNsaWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0Lk9BdXRoMkNsaWVudH19KTt2YXIgaT1yKDYxOCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiZ2VuZXJhdGVDb2RlVmVyaWZpZXJcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5nZW5lcmF0ZUNvZGVWZXJpZmllcn19KTt2YXIgbz1yKDEzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkZldGNoXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG8uT0F1dGgyRmV0Y2h9fSk7dmFyIHM9cig0NDMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRXJyb3JcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcy5PQXV0aDJFcnJvcn19KX0pKCksbn0pKCkpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2F1dGgyLWNsaWVudC5taW4uanMubWFwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIDxhdXRvLWdlbmVyYXRlZD5cclxuLy8gICAgIEdlbmVyYXRlZCB1c2luZyB0aGUgTlN3YWcgdG9vbGNoYWluIHYxMy4yMC4wLjAgKE5Kc29uU2NoZW1hIHYxMC45LjAuMCAoTmV3dG9uc29mdC5Kc29uIHYxMy4wLjAuMCkpIChodHRwOi8vTlN3YWcub3JnKVxyXG4vLyA8L2F1dG8tZ2VuZXJhdGVkPlxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbi8vIFJlU2hhcnBlciBkaXNhYmxlIEluY29uc2lzdGVudE5hbWluZ1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudCB7XHJcbiAgICBwcml2YXRlIGh0dHA6IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfTtcclxuICAgIHByaXZhdGUgYmFzZVVybDogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIGpzb25QYXJzZVJldml2ZXI6ICgoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IGFueSkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZVVybD86IHN0cmluZywgaHR0cD86IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfSkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IGh0dHAgPyBodHRwIDogd2luZG93IGFzIGFueTtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsICE9PSB1bmRlZmluZWQgJiYgYmFzZVVybCAhPT0gbnVsbCA/IGJhc2VVcmwgOiBcIi9hcGkvZWJheS92MVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBhbGwgcHJvZHVjdHNcclxuICAgICAqIEByZXR1cm4gT0tcclxuICAgICAqL1xyXG4gICAgZ2V0QWxsUHJvZHVjdHMoKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0QWxsUHJvZHVjdHMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldEFsbFByb2R1Y3RzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goUHJvZHVjdFdpdGhJZC5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8UHJvZHVjdFdpdGhJZFtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2R1Y3QocHJvZHVjdDogUHJvZHVjdFdpdGhvdXRJZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NDcmVhdGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDcmVhdGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IHJlc3VsdERhdGEyMDAgIT09IHVuZGVmaW5lZCA/IHJlc3VsdERhdGEyMDAgOiA8YW55Pm51bGw7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHN0cmluZz4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBkYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBkYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBEZWxldGVkXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVByb2R1Y3QoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NEZWxldGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NEZWxldGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LvQvtGC0LVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgdXBzZXJ0TG90SW5mbyhsb3RJbmZvOiBMb3RJbmZvLCBwcm9kdWN0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve3Byb2R1Y3RJZH0vbG90cy9cIjtcclxuICAgICAgICBpZiAocHJvZHVjdElkID09PSB1bmRlZmluZWQgfHwgcHJvZHVjdElkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdwcm9kdWN0SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntwcm9kdWN0SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgcHJvZHVjdElkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBzZXJ0TG90SW5mbyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBzZXJ0TG90SW5mbyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdEluZm8obG90SWQ6IG51bWJlcik6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdHMve2xvdElkfS9cIjtcclxuICAgICAgICBpZiAobG90SWQgPT09IHVuZGVmaW5lZCB8fCBsb3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnbG90SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntsb3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBsb3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDIwMCA9IExvdEluZm9XaXRoUHJvZHVjdElkLmZyb21KUyhyZXN1bHREYXRhMjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRg9GH0YLQtdC90L3Ri9GFINC70L7RgtCw0YVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TG90U3RhdGVzKGxvdElkczogbnVtYmVyW10pOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdF9zdGF0ZV9yZXF1ZXN0cy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdElkcyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RTdGF0ZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdFN0YXRlcyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChMb3RTdGF0ZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90U3RhdGVbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC00LDQtdGCINC/0LXRgNC10YfQtdC90Ywg0LLQvtC30LzQvtC20L3Ri9GFINGB0L7RgdGC0L7Rj9C90LjQuSDQv9GA0L7QtNCw0LLQsNC10LzQvtCz0L4g0YLQvtCy0LDRgNCwXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldE1hbnVhbENvbmRpdGlvbnNMaXN0KCk6IFByb21pc2U8TWFudWFsQ29uZGl0aW9uW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL21hbnVhbF9jb25kaXRpb25zL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldE1hbnVhbENvbmRpdGlvbnNMaXN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTWFudWFsQ29uZGl0aW9uLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxNYW51YWxDb25kaXRpb25bXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhvdXRJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRob3V0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJOYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gX2RhdGFbXCJTZWFyY2hRdWVyeVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9kdWN0V2l0aG91dElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHJvZHVjdFdpdGhvdXRJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyeVwiXSA9IHRoaXMuc2VhcmNoUXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRoSWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRoSWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiSWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IF9kYXRhW1wiU2VhcmNoUXVlcnlcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRoSWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiSWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyeVwiXSA9IHRoaXMuc2VhcmNoUXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RJbmZvV2l0aFByb2R1Y3RJZCBpbXBsZW1lbnRzIElMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICBwcm9kdWN0SWQhOiBzdHJpbmc7XHJcbiAgICBsb3RJbmZvITogTG90SW5mbztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm9XaXRoUHJvZHVjdElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJbmZvID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2R1Y3RJZCA9IF9kYXRhW1wicHJvZHVjdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvdEluZm8gPSBfZGF0YVtcImxvdEluZm9cIl0gPyBMb3RJbmZvLmZyb21KUyhfZGF0YVtcImxvdEluZm9cIl0pIDogbmV3IExvdEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm9XaXRoUHJvZHVjdElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInByb2R1Y3RJZFwiXSA9IHRoaXMucHJvZHVjdElkO1xyXG4gICAgICAgIGRhdGFbXCJsb3RJbmZvXCJdID0gdGhpcy5sb3RJbmZvID8gdGhpcy5sb3RJbmZvLnRvSlNPTigpIDogPGFueT51bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgIHByb2R1Y3RJZDogc3RyaW5nO1xyXG4gICAgbG90SW5mbzogTG90SW5mbztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdEluZm8gaW1wbGVtZW50cyBJTG90SW5mbyB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBwY3MhOiBudW1iZXI7XHJcbiAgICBwcmljZSE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlciE6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbiE6IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQhOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3RvcnkhOiBQdXJjaGFzZUluZm9bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucGNzID0gX2RhdGFbXCJwY3NcIl07XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nID0gX2RhdGFbXCJzaGlwcGluZ1wiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZ0FkZGl0aW9uYWwgPSBfZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uID0gX2RhdGFbXCJjb25kaXRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb24gPSBfZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGxlciA9IF9kYXRhW1wic2VsbGVyXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZWRJbiA9IF9kYXRhW1wibG9jYXRlZEluXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubWFudWFsQ29uZGl0aW9uSWQgPSBfZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5ID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSEucHVzaChQdXJjaGFzZUluZm8uZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wibmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wicGNzXCJdID0gdGhpcy5wY3M7XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdcIl0gPSB0aGlzLnNoaXBwaW5nO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl0gPSB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJzZWxsZXJcIl0gPSB0aGlzLnNlbGxlcjtcclxuICAgICAgICBkYXRhW1wibG9jYXRlZEluXCJdID0gdGhpcy5sb2NhdGVkSW47XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdGhpcy5tYW51YWxDb25kaXRpb25JZDtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnB1cmNoYXNlSGlzdG9yeSkpIHtcclxuICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMucHVyY2hhc2VIaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mbyB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgcGNzOiBudW1iZXI7XHJcbiAgICBwcmljZTogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmc/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWw/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlcjogc3RyaW5nO1xyXG4gICAgbG9jYXRlZEluOiBzdHJpbmc7XHJcbiAgICBpZ25vcmVUaGF0TG90OiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQ6IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeTogUHVyY2hhc2VJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQdXJjaGFzZUluZm8gaW1wbGVtZW50cyBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHkhOiBudW1iZXI7XHJcbiAgICBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHVyY2hhc2VJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gX2RhdGFbXCJxdWFudGl0eVwiXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gX2RhdGFbXCJkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFB1cmNoYXNlSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFB1cmNoYXNlSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInF1YW50aXR5XCJdID0gdGhpcy5xdWFudGl0eTtcclxuICAgICAgICBkYXRhW1wiZGF0ZVwiXSA9IHRoaXMuZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hbnVhbENvbmRpdGlvbiBpbXBsZW1lbnRzIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU1hbnVhbENvbmRpdGlvbikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJpZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTWFudWFsQ29uZGl0aW9uIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFudWFsQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RTdGF0ZSBpbXBsZW1lbnRzIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdFN0YXRlKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IF9kYXRhW1wibGFzdFVwZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RTdGF0ZSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdFN0YXRlKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibGFzdFVwZGF0ZVwiXSA9IHRoaXMubGFzdFVwZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90U3RhdGUge1xyXG4gICAgbG90SWQ6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IF9kYXRhW1widHlwZVwiXTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IF9kYXRhW1widGl0bGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gX2RhdGFbXCJzdGF0dXNcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsID0gX2RhdGFbXCJkZXRhaWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBfZGF0YVtcImluc3RhbmNlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGFic3RyYWN0IGNsYXNzICdQcm9ibGVtRGV0YWlsZWRJbmZvJyBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInR5cGVcIl0gPSB0aGlzLnR5cGU7XHJcbiAgICAgICAgZGF0YVtcInRpdGxlXCJdID0gdGhpcy50aXRsZTtcclxuICAgICAgICBkYXRhW1wic3RhdHVzXCJdID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgZGF0YVtcImRldGFpbFwiXSA9IHRoaXMuZGV0YWlsO1xyXG4gICAgICAgIGRhdGFbXCJpbnN0YW5jZVwiXSA9IHRoaXMuaW5zdGFuY2U7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9yczIgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlci5pbml0KF9kYXRhKTtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBfZGF0YVtcImVycm9yc1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMyIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3JzIGltcGxlbWVudHMgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJRXJyb3JzKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2RhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gX2RhdGFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogRXJyb3JzIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgRXJyb3JzKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHRoaXNbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMyIGltcGxlbWVudHMgSUVycm9yczIge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9yczIpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMyIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgRXJyb3JzMigpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9yczIge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHN0YXR1czogbnVtYmVyO1xyXG4gICAgcmVzcG9uc2U6IHN0cmluZztcclxuICAgIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9O1xyXG4gICAgcmVzdWx0OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaXNBcGlFeGNlcHRpb24gPSB0cnVlO1xyXG5cclxuICAgIHN0YXRpYyBpc0FwaUV4Y2VwdGlvbihvYmo6IGFueSk6IG9iaiBpcyBBcGlFeGNlcHRpb24ge1xyXG4gICAgICAgIHJldHVybiBvYmouaXNBcGlFeGNlcHRpb24gPT09IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRocm93RXhjZXB0aW9uKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ/OiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aHJvdyByZXN1bHQ7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhyb3cgbmV3IEFwaUV4Y2VwdGlvbihtZXNzYWdlLCBzdGF0dXMsIHJlc3BvbnNlLCBoZWFkZXJzLCBudWxsKTtcclxufSIsImltcG9ydCB7T0F1dGgyQ2xpZW50LCBPQXV0aDJUb2tlbn0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcblxyXG5cclxudHlwZSBPQXV0aDJGZXRjaE9wdGlvbnMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlcmVuY2UgdG8gT0F1dGgyIGNsaWVudC5cclxuICAgICAqL1xyXG4gICAgY2xpZW50OiBPQXV0aDJDbGllbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBpbXBsZW1lbnRpbmcgdGhpcyBmdW5jdGlvbi5cclxuICAgICAqIGl0J3MgcHVycG9zZSBpcyB0byBzdXBwbHkgdGhlICdpbml0aWFsJyBvYXV0aDIgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBgbnVsbGAgdG8gZmFpbCB0aGUgcHJvY2Vzcy5cclxuICAgICAqL1xyXG4gICAgZ2V0TmV3VG9rZW4oKTogT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgc2V0LCB3aWxsIGJlIGNhbGxlZCBpZiBhdXRoZW50aWNhdGlvbiBmYXRhbGx5IGZhaWxlZC5cclxuICAgICAqL1xyXG4gICAgb25FcnJvcj86IChlcnI6IEVycm9yKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGFjdGl2ZSB0b2tlbiBjaGFuZ2VzLiBVc2luZyB0aGlzIGlzXHJcbiAgICAgKiBvcHRpb25hbCwgYnV0IGl0IG1heSBiZSB1c2VkIHRvIChmb3IgZXhhbXBsZSkgcHV0IHRoZSB0b2tlbiBpbiBvZmYtbGluZVxyXG4gICAgICogc3RvcmFnZSBmb3IgbGF0ZXIgdXNhZ2UuXHJcbiAgICAgKi9cclxuICAgIHN0b3JlVG9rZW4/OiAodG9rZW46IE9BdXRoMlRva2VuKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxzbyBhbiBvcHRpb25hbCBmZWF0dXJlLiBJbXBsZW1lbnQgdGhpcyBpZiB5b3Ugd2FudCB0aGUgd3JhcHBlciB0byB0cnkgYVxyXG4gICAgICogc3RvcmVkIHRva2VuIGJlZm9yZSBhdHRlbXB0aW5nIGEgZnVsbCByZS1hdXRoZW50aWNhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIG51bGwgaWYgdGhlcmUgd2FzIG5vIHRva2VuLlxyXG4gICAgICovXHJcbiAgICBnZXRTdG9yZWRUb2tlbj86ICgpID0+IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBzY2hlZHVsZSB0b2tlbiByZWZyZXNoLlxyXG4gICAgICpcclxuICAgICAqIENlcnRhaW4gZXhlY3V0aW9uIGVudmlyb25tZW50cywgZS5nLiBSZWFjdCBOYXRpdmUsIGRvIG5vdCBoYW5kbGUgc2NoZWR1bGVkXHJcbiAgICAgKiB0YXNrcyB3aXRoIHNldFRpbWVvdXQoKSBpbiBhIGdyYWNlZnVsIG9yIHByZWRpY3RhYmxlIGZhc2hpb24uIFRoZSBkZWZhdWx0XHJcbiAgICAgKiBiZWhhdmlvciBpcyB0byBzY2hlZHVsZSByZWZyZXNoLiBTZXQgdGhpcyB0byBmYWxzZSB0byBkaXNhYmxlIHNjaGVkdWxpbmcuXHJcbiAgICAgKi9cclxuICAgIHNjaGVkdWxlUmVmcmVzaD86IGJvb2xlYW47XHJcblxyXG4gICAgZmV0Y2g/OiB0eXBlb2YgZmV0Y2g7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGZXRjaFdyYXBwZXJDdXN0b20ge1xyXG5cclxuICAgIHByaXZhdGUgb3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VycmVudCBhY3RpdmUgdG9rZW4gKGlmIGFueSlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0b2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSB1c2VyIGhhZCBhIHN0b3JlZFRva2VuLCB0aGUgcHJvY2VzcyB0byBmZXRjaCBpdFxyXG4gICAgICogbWF5IGJlIGFzeW5jLiBXZSBrZWVwIHRyYWNrIG9mIHRoaXMgcHJvY2VzcyBpbiB0aGlzXHJcbiAgICAgKiBwcm9taXNlLCBzbyBpdCBtYXkgYmUgYXdhaXRlZCB0byBhdm9pZCByYWNlIGNvbmRpdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQXMgc29vbiBhcyB0aGlzIHByb21pc2UgcmVzb2x2ZXMsIHRoaXMgcHJvcGVydHkgZ2V0IG51bGxlZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVHZXRTdG9yZWRUb2tlbjogbnVsbCB8IFByb21pc2U8dm9pZD4gPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucykge1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucz8uc2NoZWR1bGVSZWZyZXNoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zY2hlZHVsZVJlZnJlc2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdldFN0b3JlZFRva2VuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IGF3YWl0IG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4hKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gbnVsbDtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb2VzIGEgZmV0Y2ggcmVxdWVzdCBhbmQgYWRkcyBhIEJlYXJlciAvIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgdGhpcyBmdW5jdGlvbiBhdHRlbXB0cyB0byBmZXRjaCBpdFxyXG4gICAgICogZmlyc3QuIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgYWxtb3N0IGV4cGlyaW5nLCB0aGlzIGZ1bmN0aW9uIG1pZ2h0IGF0dGVtcHRcclxuICAgICAqIHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZldGNoKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtcclxuXHJcbiAgICAgICAgaWYgKGluaXQuaGVhZGVycykge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzID0ge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VufVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Rva2VuID0gYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIG5ld1Rva2VuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBjdXJyZW50IHRva2VuIGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoZXJlIHJlc3VsdCBvYmplY3Qgd2lsbCBoYXZlOlxyXG4gICAgICogICAqIGFjY2Vzc1Rva2VuXHJcbiAgICAgKiAgICogZXhwaXJlc0F0IC0gd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgbnVsbC5cclxuICAgICAqICAgKiByZWZyZXNoVG9rZW4gLSBtYXkgYmUgbnVsbFxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhdHRlbXB0IHRvIGF1dG9tYXRpY2FsbHkgcmVmcmVzaCBpZiBzdGFsZS5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0VG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi5leHBpcmVzQXQgPT09IG51bGwgfHwgdGhpcy50b2tlbi5leHBpcmVzQXQgPiBEYXRlLm5vdygpKSkge1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgdG9rZW4gaXMgc3RpbGwgdmFsaWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGN1cnJlbnQgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgaXQgd2lsbCBhdHRlbXB0IHRvIGZldGNoIGl0LlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBleHBpcmluZywgaXQgd2lsbCBhdHRlbXB0IHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEFjY2Vzc1Rva2VuKCk6IFByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBnZXRTdG9yZWRUb2tlbiBmaW5pc2hlZC5cclxuICAgICAgICBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gdG9rZW4uYWNjZXNzVG9rZW47XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogS2VlcGluZyB0cmFjayBvZiBhbiBhY3RpdmUgcmVmcmVzaFRva2VuIG9wZXJhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHdpbGwgYWxsb3cgdXMgdG8gZW5zdXJlIG9ubHkgMSBzdWNoIG9wZXJhdGlvbiBoYXBwZW5zIGF0IGFueVxyXG4gICAgICogZ2l2ZW4gdGltZS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZWZyZXNoOiBQcm9taXNlPE9BdXRoMlRva2VuPiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yY2VzIGFuIGFjY2VzcyB0b2tlbiByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2hUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIGN1cnJlbnRseSBhbHJlYWR5IGRvaW5nIHRoaXMgb3BlcmF0aW9uLFxyXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgZG8gaXQgdHdpY2UgaW4gcGFyYWxsZWwuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGRUb2tlbiA9IHRoaXMudG9rZW47XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gKGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdUb2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkVG9rZW4/LnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhZCBhIHJlZnJlc2ggdG9rZW4sIGxldHMgc2VlIGlmIHdlIGNhbiB1c2UgaXQhXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihvbGRUb2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2VcXCdsbCB0cnkgcmVhdXRoZW50aWNhdGluZycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcj8uKGVycik7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Rva2VuO1xyXG5cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcmVUb2tlbj8uKHRva2VuKTtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGNsZWFyIHRoZSBjdXJyZW50IHJlZnJlc2ggb3BlcmF0aW9uLlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaW1lciB0cmlnZ2VyIGZvciB0aGUgbmV4dCBhdXRvbWF0ZWQgcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlZnJlc2hUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNjaGVkdWxlUmVmcmVzaCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWZyZXNoVGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuPy5leHBpcmVzQXQgfHwgIXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGtub3cgd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgZG9uJ3QgaGF2ZSBhIHJlZnJlc2hfdG9rZW4sIGRvbid0IGJvdGhlci5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gdGhpcy50b2tlbi5leHBpcmVzQXQgLSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICAvLyBXZSBvbmx5IHNjaGVkdWxlIHRoaXMgZXZlbnQgaWYgaXQgaGFwcGVucyBtb3JlIHRoYW4gMiBtaW51dGVzIGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgaWYgKGV4cGlyZXNJbiA8IDEyMCAqIDEwMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2NoZWR1bGUgMSBtaW51dGUgYmVmb3JlIGV4cGlyeVxyXG4gICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaCcsIGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBleHBpcmVzSW4gLSA2MCAqIDEwMDApO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENsaWVudCxcclxuICAgIExvdEluZm8sXHJcbiAgICBMb3RJbmZvV2l0aFByb2R1Y3RJZCwgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLFxyXG4gICAgUHVyY2hhc2VJbmZvLCBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mb1xyXG59IGZyb20gXCIuL0ViYXlDbGllbnQvRWJheUNsaWVudFwiXHJcblxyXG5pbXBvcnQge2dlbmVyYXRlQ29kZVZlcmlmaWVyLCBPQXV0aDJDbGllbnR9IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5pbXBvcnQge0ZldGNoV3JhcHBlckN1c3RvbX0gZnJvbSBcIi4vRmV0Y2hXcmFwcGVyQ3VzdG9tXCI7XHJcblxyXG5jb25zdCBpZ25vcmVUaGF0TG90RmllbGROYW1lID0gXCJpZ25vcmVUaGF0TG90XCI7XHJcbmNvbnN0IG1hbnVhbENvbmRpdGlvbklkRmllbGROYW1lID0gXCJtYW51YWxDb25kaXRpb25JZFwiO1xyXG5jb25zdCBwcm9kdWN0RmllbGROYW1lID0gXCJwcm9kdWN0SWRcIjtcclxuY29uc3QgcGNzRmllbGROYW1lID0gXCJwY3NcIjtcclxuXHJcbmNvbnN0IHBhbmVsQ2xhc3MgPSBcInBhbmVsLWRpdlwiO1xyXG5jb25zdCBmb3JtSWQgPSBcInByb2R1Y3QtZm9ybS1pZFwiXHJcbmNvbnN0IGVycm9yRWxlbWVudElkID0gXCJlcnJvckVsZW1lbnRcIlxyXG5jb25zdCBzdWJtaXRJZCA9IFwic3VibWl0XCJcclxuY29uc3QgYmFja2VuZFVybCA9IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA5NS9cIlxyXG5jb25zdCBiYXNlQXBpVXJsID0gYCR7YmFja2VuZFVybH1hcGkvZWJheS92MWA7XHJcbmNvbnN0IGF1dGhSZWRpcmVjdFVybCA9IFwiaHR0cHM6Ly93d3cuZWJheS5jb20vXCJcclxuY29uc3Qgbm90U2V0VmFsdWUgPSBcIm5vdFNldFwiXHJcblxyXG5jb25zdCBsb3RJbmZvID0gbmV3IExvdEluZm8oKTtcclxubGV0IF9zZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZDtcclxuXHJcbi8vIGZldGNoINGH0LXRgNC10LcgYmFja2dyb3VuZCBzY3JpcHQsINC/0L4g0LTRgNGD0LPQvtC80YMg0L3QtSDRgNCw0LHQvtGC0LDQtdGCXHJcbmZ1bmN0aW9uIGZldGNoUmVzb3VyY2UoaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2lucHV0LCBpbml0fSwgbWVzc2FnZVJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgW3Jlc3BvbnNlLCBlcnJvcl0gPSBtZXNzYWdlUmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSB1bmRlZmluZWQgb24gYSAyMDQgLSBObyBDb250ZW50XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gcmVzcG9uc2UuYm9keSA/IG5ldyBCbG9iKFtyZXNwb25zZS5ib2R5XSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBleHRyYWN0UHJpY2UocHJpY2UpIHtcclxuICAgIGxldCBtYXRjaGVzID0gcHJpY2UubWF0Y2goLyhcXEQrKShcXGQrKD86WywuXVxcZCspPykvKVxyXG4gICAgaWYgKG1hdGNoZXNbMV0gIT09IFwiVVMgJFwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUyAkIHByaWNlIGV4cGVjdGVkLCBidXQgd2FzJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdChtYXRjaGVzWzJdLnJlcGxhY2UoJywnLCAnLicpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVIaXN0b3J5QnV0dG9uKCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IGRvbWFpbiA9IGxvY2F0aW9uLmhvc3RuYW1lO1xyXG4gICAgbGV0IGhpc3RvcnlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBoaXN0b3J5QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpc3RvcnktYnV0dG9uJyk7XHJcbiAgICBoaXN0b3J5QnV0dG9uLnRleHRDb250ZW50ID0gJ0hJU1RPUlknO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi5ocmVmID0gYGh0dHBzOi8vJHtkb21haW59L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDVweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjA7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgcGFkZGluZzogM3B4IDZweDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIGNvbG9yOiBibGFjaztcclxuICBgO1xyXG4gICAgaGlzdG9yeUJ1dHRvbi50YXJnZXQgPSAnX2JsYW5rJztcclxuXHJcbiAgICByZXR1cm4gaGlzdG9yeUJ1dHRvbjtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYWRkSGlzdG9yeUJ1dHRvbigpIHtcclxuICAgIGxldCBwcm9kdWN0VGl0bGVDb250YWluZXIgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJy52aW1bZGF0YS10ZXN0aWQ9XCJ4LWl0ZW0tdGl0bGVcIl0nKTtcclxuICAgIGlmIChwcm9kdWN0VGl0bGVDb250YWluZXIpIHtcclxuICAgICAgICBsZXQgZXhpc3RpbmdCdXR0b24gPSBwcm9kdWN0VGl0bGVDb250YWluZXIucXVlcnlTZWxlY3RvcignYS5oaXN0b3J5LWJ1dHRvbicpO1xyXG4gICAgICAgIGlmICghZXhpc3RpbmdCdXR0b24pIHtcclxuICAgICAgICAgICAgbGV0IGhpc3RvcnlCdXR0b24gPSBjcmVhdGVIaXN0b3J5QnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHByb2R1Y3RUaXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChoaXN0b3J5QnV0dG9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHN0eWxlcyA9IGBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgcGFkZGluZzogMTVweDtcclxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzAwMDBjYztcclxuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgY29sb3I6ICMwMDAwY2M7XHJcbiAgICAgIHBvc2l0aW9uOmZpeGVkO1xyXG4gICAgICB6LWluZGV4OjEwMDtcclxuICAgICAgbGVmdDoxJTtcclxuICAgICAgYm90dG9tOjUlO1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWwge1xyXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGlucHV0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBzZWxlY3Qge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsOmFmdGVyIHsgY29udGVudDogXCI6IFwiIH1cclxuYFxyXG5cclxuICAgIGxldCBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpXHJcbiAgICBzdHlsZVNoZWV0LmlubmVyVGV4dCA9IHN0eWxlc1xyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGVTaGVldClcclxuXHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChwYW5lbENsYXNzKTtcclxuXHJcblxyXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJylcclxuICAgIGZvcm0uaWQgPSBmb3JtSWRcclxuXHJcbiAgICAvLyBsYW5ndWFnZT1IVE1MXHJcbiAgICBmb3JtLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiPtCY0LPQvdC+0YDQuNGA0L7QstCw0YLRjCDQu9C+0YI8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIiB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+0KLQvtCy0LDRgDwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiIGlkPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDRgtC+0LLQsNGAPC9vcHRpb24+XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Bjc0ZpZWxkTmFtZX1cIj5QQ1M8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7cGNzRmllbGROYW1lfVwiIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwiJHtwY3NGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIj7QodC+0YHRgtC+0Y/QvdC40LU8L2xhYmVsPlxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCIgaWQ9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDQodC+0YHRgtC+0Y/QvdC40LU8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT1cImNvbG9yOiByZWQ7XCIgaWQ9XCIke2Vycm9yRWxlbWVudElkfVwiPjwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3N1Ym1pdElkfVwiIHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlNhdmVcIiBkaXNhYmxlZC8+YDtcclxuXHJcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGV2ZW50OiBTdWJtaXRFdmVudCkge1xyXG4gICAgICAgIGF3YWl0IGhhbmRsZVN1Ym1pdChldmVudCwgY2xpZW50KVxyXG4gICAgfSk7XHJcblxyXG4gICAgZGl2LmFwcGVuZENoaWxkKGZvcm0pXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTdWJtaXQoZXZlbnQ6IFN1Ym1pdEV2ZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+ZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgbGV0IGlnbm9yZVRoYXRMb3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnaWdub3JlVGhhdExvdCcpIHtcclxuICAgICAgICAgICAgICAgIGlnbm9yZVRoYXRMb3QgPSB0cnVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb3RJbmZvW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb3RJbmZvWydpZ25vcmVUaGF0TG90J10gPSBpZ25vcmVUaGF0TG90O1xyXG5cclxuICAgICAgICBpZiAoaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnBjcyA9IDFcclxuICAgICAgICAgICAgbG90SW5mby5tYW51YWxDb25kaXRpb25JZCA9IG5vdFNldFZhbHVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgdG8gYmFja2VuZDogXCIgKyBKU09OLnN0cmluZ2lmeShsb3RJbmZvKSlcclxuXHJcblxyXG4gICAgICAgIGF3YWl0IGNsaWVudC51cHNlcnRMb3RJbmZvKGxvdEluZm8sIGRhdGEuZ2V0KCdwcm9kdWN0SWQnKS50b1N0cmluZygpKVxyXG5cclxuICAgICAgICBhd2FpdCBwcm9kdWN0UGFnZShjbGllbnQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dFcnJvcihlcnJvcilcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93czogSFRNTFRhYmxlUm93RWxlbWVudFtdLCByZXN1bHQ6IFB1cmNoYXNlSW5mb0lubmVyW10pIHtcclxuICAgIGZvciAobGV0IGZpeGVkUHJpY2VSb3cgb2YgZml4ZWRQcmljZVJvd3MpIHtcclxuICAgICAgICBsZXQgY29sdW1ucyA9IFsuLi5maXhlZFByaWNlUm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHByaWNlID0gY29sdW1uc1sxXVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgPT09IFwiRXhwaXJlZFwiIHx8IHByaWNlID09PSBcIkRlY2xpbmVkXCIpIHtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcmljZSAhPT0gXCJTb2xkIGFzIGEgc3BlY2lhbCBvZmZlclwiICYmIHByaWNlICE9PSBcIkNvdW50ZXItb2ZmZXJlZFwiICYmIHByaWNlICE9PSBcIkFjY2VwdGVkXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pLCBleHRyYWN0UHJpY2UocHJpY2UpKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgUHVyY2hhc2VJbmZvSW5uZXIocGFyc2VJbnQoY29sdW1uc1syXSksIHBhcnNlRGF0ZShjb2x1bW5zWzNdKSkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQdXJjaGFzZUluZm9Jbm5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihxdWFudGl0eTogbnVtYmVyLCBkYXRlOiBEYXRlLCBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGVcclxuICAgICAgICB0aGlzLnByaWNlID0gcHJpY2VcclxuICAgIH1cclxuXHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgcHJpY2U6IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRhdGU6IERhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVTdHJpbmcpOiBEYXRlIHtcclxuICAgIGxldCBtYXRjaGVzID0gZGF0ZVN0cmluZy5tYXRjaCgvKFxcZCtcXHNbQS16XStcXHNcXGQrKVxcc2F0XFxzKFxcZCspOihcXGQrKTooXFxkKykoYW18cG0pXFxzKFtBLXpdKykvKVxyXG5cclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShtYXRjaGVzWzFdICsgJyAwMDowMDowMC4wMDBaJykpXHJcblxyXG4gICAgZGF0ZS5zZXRVVENIb3VycyhwYXJzZUludChtYXRjaGVzWzJdKSk7XHJcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMocGFyc2VJbnQobWF0Y2hlc1szXSkpO1xyXG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKHBhcnNlSW50KG1hdGNoZXNbNF0pKTtcclxuXHJcbiAgICBpZiAobWF0Y2hlc1s1XSA9PT0gXCJwbVwiICYmIGRhdGUuZ2V0VVRDSG91cnMoKSAhPT0gMTIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSArIDEyKTtcclxuICAgIH1cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcImFtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpID09PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMTIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaGVzWzZdID09PSBcIk1TS1wiKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0aW1lem9uZSBcIiArIG1hdGNoZXNbNl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTb2xkSXRlbXNQYWdlKHRleHQ6IHN0cmluZyk6IFB1cmNoYXNlSW5mb1tdIHtcclxuICAgIGxldCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHRleHQsIFwidGV4dC9odG1sXCIpXHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IG5ldyBBcnJheTxQdXJjaGFzZUluZm9Jbm5lcj4oKTtcclxuICAgIGxldCBmaXhlZFByaWNlQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2LmZpeGVkLXByaWNlIHRib2R5JylcclxuICAgIGlmIChmaXhlZFByaWNlQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgZml4ZWRQcmljZVJvd3MgPSBbLi4uZml4ZWRQcmljZUJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb2ZmZXJCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYub2ZmZXIgdGJvZHknKVxyXG4gICAgaWYgKG9mZmVyQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgb2ZmZXJSb3dzID0gWy4uLm9mZmVyQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KG9mZmVyUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gYi5kYXRlLmdldFRpbWUoKSAtIGEuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICB9KS5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFB1cmNoYXNlSW5mbyh7XHJcbiAgICAgICAgICAgIGRhdGU6IHguZGF0ZS50b0lTT1N0cmluZygpLCBxdWFudGl0eTogeC5xdWFudGl0eSwgcHJpY2U6IHgucHJpY2VcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxJZCgpIHtcclxuICAgIGxvdEluZm8ubG90SWQgPSBwYXJzZUludChsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcmljZSgpIHtcclxuICAgIGxvdEluZm8ucHJpY2UgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXByaWNlLXByaW1hcnkgc3BhbicpKS5pbm5lclRleHQpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxOYW1lKCkge1xyXG4gICAgbG90SW5mby5uYW1lID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJy52aW0gaDEnKSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxTZWxsZXIoKSB7XHJcbiAgICBsb3RJbmZvLnNlbGxlciA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1zZWxsZXJjYXJkLWF0Zl9faW5mb19fYWJvdXQtc2VsbGVyIGEnKSkuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbENvbmRpdGlvbigpIHtcclxuICAgIGxvdEluZm8uY29uZGl0aW9uID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLXRleHQgc3Bhbi51eC10ZXh0c3BhbnMnKSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbigpIHtcclxuICAgIGxldCBjb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYueC1pdGVtLWNvbmRpdGlvbi1kZXNjJylcclxuICAgIGlmIChjb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQgIT0gbnVsbCkge1xyXG4gICAgICAgIGxvdEluZm8uY29uZGl0aW9uRGVzY3JpcHRpb24gPSAoPEhUTUxFbGVtZW50PmNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCkuaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCfigJwnLCAnJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnScsICcnKVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsU2hpcHBpbmcoKSB7XHJcbiAgICBsZXQgc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi51eC1sYXlvdXQtc2VjdGlvbl9fdGV4dHVhbC1kaXNwbGF5LS1hc2tTZWxsZXInKSA9PT0gbnVsbFxyXG4gICAgaWYgKHNoaXBwaW5nUmF0ZXNBdmFpbGFibGUpIHtcclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zSGVhZGVyID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5kLXNoaXBwaW5nLW1heHZpZXcgdGhlYWQnKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGgnKV1cclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zVmFsdWVzID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5kLXNoaXBwaW5nLW1heHZpZXcgdGJvZHknKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcigndHInKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nTWF4dmlld1ZhbHVlcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gZGVsaXZlcnlDb2x1bW5zSGVhZGVyW2ldLmlubmVyVGV4dFxyXG4gICAgICAgICAgICBzaGlwcGluZ01heHZpZXdWYWx1ZXNba2V5XSA9IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlc1tpXS5xdWVyeVNlbGVjdG9yKCdzcGFuJykuaW5uZXJUZXh0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydUbyddICE9PSAnR2VybWFueScpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwcGluZyBjb3VudHJ5IG11c3QgYmUgR2VybWFueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nVmFsdWUgPSBzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ1NoaXBwaW5nIGFuZCBoYW5kbGluZyddXHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ1ZhbHVlICE9PSAnRnJlZSBzaGlwcGluZycpIHtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZyA9IGV4dHJhY3RQcmljZShzaGlwcGluZ1ZhbHVlKVxyXG5cclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlcy5oYXNPd25Qcm9wZXJ0eSgnRWFjaCBhZGRpdGlvbmFsIGl0ZW0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlYWNoQWRkaXRpb25hbCA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snRWFjaCBhZGRpdGlvbmFsIGl0ZW0nXVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYWNoQWRkaXRpb25hbCAhPT0gXCJGcmVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IGV4dHJhY3RQcmljZShlYWNoQWRkaXRpb25hbClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTG9jYXRlZEluKCkge1xyXG4gICAgbGV0IG1hdGNoID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi5kLXNoaXBwaW5nLW1pbnZpZXcnKSkuaW5uZXJUZXh0Lm1hdGNoKC9Mb2NhdGVkXFxzaW46XFxzKC4rKS8pXHJcbiAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmxvY2F0ZWRJbiA9IG1hdGNoWzFdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvdEluZm8ubG9jYXRlZEluID0gXCJVbmtub3duXCJcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbERlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGRlc2NyaXB0aW9uVXJsID0gKDxIVE1MSUZyYW1lRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJyNkZXNjX2lmcicpKS5zcmNcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoUmVzb3VyY2UoZGVzY3JpcHRpb25VcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxvdEluZm8uZGVzY3JpcHRpb24gPSBhd2FpdCByZXNwb25zZS50ZXh0KClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFB1cmNoYXNlSGlzdG9yeSgpIHtcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBwdXJjaGFzZUhpc3RvcnlVcmwgPSBgaHR0cHM6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoUmVzb3VyY2UocHVyY2hhc2VIaXN0b3J5VXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pXHJcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgbG90SW5mby5wdXJjaGFzZUhpc3RvcnkgPSBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2VhcmNoUXVlcnkoKSA6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAoZG9jdW1lbnQucmVmZXJyZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFVSTChkb2N1bWVudC5yZWZlcnJlcikuc2VhcmNoUGFyYW1zPy5nZXQoJ19ua3cnKT8udHJpbSgpPy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJvZHVjdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHByb2R1Y3RGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgcHJvZHVjdEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RJZCA9IHNlcnZlckxvdEluZm8/LnByb2R1Y3RJZD8udHJpbSgpPy50b0xvd2VyQ2FzZSgpXHJcbiAgICBsZXQgc2VhcmNoUXVlcnkgPSBnZXRTZWFyY2hRdWVyeSgpO1xyXG5cclxuICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IGNsaWVudC5nZXRBbGxQcm9kdWN0cygpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHByb2R1Y3RzW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBwcm9kdWN0c1tpXS5uYW1lO1xyXG5cclxuICAgICAgICBpZiAocHJvZHVjdElkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHNbaV0uaWQudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoc2VhcmNoUXVlcnkgPT09IHByb2R1Y3RzW2ldLnNlYXJjaFF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvZHVjdEZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBjbGllbnQ6IENsaWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBtYW51YWxDb25kaXRpb25GaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgbWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25JZCA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/Lm1hbnVhbENvbmRpdGlvbklkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9ucyA9IGF3YWl0IGNsaWVudC5nZXRNYW51YWxDb25kaXRpb25zTGlzdCgpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hbnVhbENvbmRpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gbWFudWFsQ29uZGl0aW9uc1tpXS5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkID09PSBtYW51YWxDb25kaXRpb25zW2ldLmlkLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hbnVhbENvbmRpdGlvbkZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlckxvdEluZm8oY2xpZW50OiBDbGllbnQpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIF9zZXJ2ZXJMb3RJbmZvID0gYXdhaXQgY2xpZW50LmdldExvdEluZm8obG90SW5mby5sb3RJZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQY3MocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHBjc0ZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIHBjc0ZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/LnBjc1xyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGNzRmllbGQudmFsdWUgPSBzZXJ2ZXJQY3MudG9TdHJpbmcoKVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsSWdub3JlVGhhdExvdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgaWdub3JlVGhhdExvdEZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5pZ25vcmVUaGF0TG90XHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZ25vcmVUaGF0TG90RmllbGQuY2hlY2tlZCA9IHNlcnZlclBjc1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29tcGFyZUxvdEluZm9zKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgaWYgKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGxldCBzZXJ2ZXJMb3RJbmZvSnNvbiA9IHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkLmxvdEluZm8udG9KU09OKClcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBsb3RJbmZvSnNvbiA9IGxvdEluZm8udG9KU09OKClcclxuICAgIGxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvV2l0aFByb2R1Y3RJZC5sb3RJbmZvLmlnbm9yZVRoYXRMb3QpIHtcclxuICAgICAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXSA9IHVuZGVmaW5lZFxyXG4gICAgICAgIGxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNlcnZlckxvdEluZm9Kc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoc2VydmVyTG90SW5mb0pzb24pXHJcbiAgICBsZXQgY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm9Kc29uKVxyXG4gICAgbGV0IHBhbmVsID0gPEhUTUxEaXZFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZyA9PT0gY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZykge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogI2VjZmZlYztgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRwaW5rO2BcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGZyb20gc2VydmVyOiBcIiArIHNlcnZlckxvdEluZm9Kc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50UGFnZTogXCIgKyBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXREYXRhRnJvbVBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcylcclxuXHJcbiAgICBmaWxsSWQoKTtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHJpY2UoKSxcclxuICAgICAgICBmaWxsTmFtZSgpLFxyXG4gICAgICAgIGZpbGxTZWxsZXIoKSxcclxuICAgICAgICBmaWxsQ29uZGl0aW9uKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgZmlsbExvY2F0ZWRJbigpLFxyXG4gICAgICAgIGZpbGxEZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGZpbGxQdXJjaGFzZUhpc3RvcnkoKSxcclxuICAgICAgICBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudClcclxuICAgIF0pXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFByb2R1Y3QocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxQY3MocGFuZWwsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsSWdub3JlVGhhdExvdChwYW5lbCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxTaGlwcGluZygpLFxyXG4gICAgXSk7XHJcbiAgICBcclxuICAgIGF3YWl0IGNvbXBhcmVMb3RJbmZvcyhfc2VydmVyTG90SW5mbyk7XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBhZGRQYW5lbChjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IGJvZHlFbGVtZW50ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdib2R5Jyk7XHJcbiAgICBpZiAoYm9keUVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgZXhpc3RpbmdQYW5lbCA9IGJvZHlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcyk7XHJcbiAgICAgICAgaWYgKCFleGlzdGluZ1BhbmVsKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yOiBFcnJvcikge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQpXHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uRXJyb3IgPSA8VmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8+ZXJyb3JcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IFwi0J7RiNC40LHQutCwINCy0LDQu9C40LTQsNGG0LjQuDogXCIgKyBKU09OLnN0cmluZ2lmeSh2YWxpZGF0aW9uRXJyb3IuZXJyb3JzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IGVycm9yLnN0YWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yRGl2LmFwcGVuZENoaWxkKHNwYW4pXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGVuYWJsZVN1Ym1pdEJ1dHRvbigpIHtcclxuICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcjJyArIHN1Ym1pdElkKSkuZGlzYWJsZWQgPSBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQ6IE9BdXRoMkNsaWVudCk6IEZldGNoV3JhcHBlckN1c3RvbSB7XHJcbiAgICByZXR1cm4gbmV3IEZldGNoV3JhcHBlckN1c3RvbSh7XHJcbiAgICAgICAgY2xpZW50OiBvQXV0aDJDbGllbnQsXHJcbiAgICAgICAgZ2V0TmV3VG9rZW46IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldEF1dGhvcml6ZVVyaSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsnRWJheS5TZXJ2ZXJBUEknXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTdG9yZWRUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRva2VuX3N0b3JlXCJdKSkudG9rZW5fc3RvcmU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIEpTT04ucGFyc2UodG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoaWRlRXJyb3JzKCkge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQpXHJcbiAgICBlcnJvckRpdi5pbm5lckhUTUwgPSBcIlwiXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByb2R1Y3RQYWdlKGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInByb2R1Y3RQYWdlXCIpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGFkZEhpc3RvcnlCdXR0b24oKTtcclxuICAgICAgICBhd2FpdCBhZGRQYW5lbChjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGdldERhdGFGcm9tUGFnZShjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGVuYWJsZVN1Ym1pdEJ1dHRvbigpXHJcbiAgICAgICAgYXdhaXQgaGlkZUVycm9ycygpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGF1dGhQYWdlKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImF1dGhQYWdlXCIpXHJcbiAgICBsZXQgdXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKVxyXG4gICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKFwiY29kZVwiKSkge1xyXG4gICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKS5jb2RlX3ZlcmlmaWVyO1xyXG4gICAgICAgIGxldCBvYXV0aDJUb2tlbiA9IGF3YWl0IG9BdXRoMkNsaWVudC5hdXRob3JpemF0aW9uQ29kZS5nZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7dG9rZW5fc3RvcmU6IEpTT04uc3RyaW5naWZ5KG9hdXRoMlRva2VuKX0pXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhdXRoUmVkaXJlY3RVcmxcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoUGFnZVwiKVxyXG4gICAgLy/RgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INC/0YDQvtC00LDQvdGL0LUg0LvQvtGC0YtcclxuICAgIGlmIChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcz8uZ2V0KCdMSF9Tb2xkJyk/LnRyaW0oKSAhPT0gXCIxXCIpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgndWwuc3JwLXJlc3VsdHMnKVxyXG5cclxuICAgIGxldCBsaW5rcyA9IFsuLi5zZWFyY2hSZXN1bHRzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpLnMtaXRlbScpXVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHg6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gPEhUTUxBbmNob3JFbGVtZW50PngucXVlcnlTZWxlY3RvcignYS5zLWl0ZW1fX2xpbmsnKVxyXG4gICAgICAgICAgICBsZXQgc29sZERhdGUgPSBuZXcgRGF0ZSgoPEhUTUxFbGVtZW50PngucXVlcnlTZWxlY3Rvcignc3Bhbi5QT1NJVElWRScpKS5pbm5lclRleHQucmVwbGFjZShcIlNvbGQgXCIsIFwiXCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExvdExpbmsocGFyc2VJbnQobGluay5ocmVmLm1hdGNoKC9odHRwczpcXC9cXC9bXlxcL10rXFwvaXRtXFwvKFxcZCspLylbMV0pLCBsaW5rLCBzb2xkRGF0ZSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBsZXQgXyA9IHVwZGF0ZVN0YXR1c0luZmluaXRlKGNsaWVudCwgbGlua3MpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVTdGF0dXNJbmZpbml0ZShjbGllbnQ6IENsaWVudCwgbGlua3M6IExvdExpbmtbXSkge1xyXG4gICAgbGV0IGlkcyA9IGxpbmtzLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4LmlkXHJcbiAgICB9KVxyXG4gICAgLy8gbm9pbnNwZWN0aW9uIEluZmluaXRlTG9vcEpTXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRpbmdMb3RTdGF0ZXNcIilcclxuICAgICAgICAgICAgbGV0IGdldExvdFN0YXRlc0Fuc3dlciA9IGF3YWl0IGNsaWVudC5nZXRMb3RTdGF0ZXMoaWRzKVxyXG5cclxuICAgICAgICAgICAgbGV0IGtub3duTG90cyA9IG5ldyBNYXAoZ2V0TG90U3RhdGVzQW5zd2VyLm1hcChwID0+IFtwLmxvdElkLCBwXSkpO1xyXG5cclxuICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb2xvciA9IHguY29sb3I7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtub3duTG90cy5oYXMoeC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG90U3RhdGUgPSBrbm93bkxvdHMuZ2V0KHguaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb3RTdGF0ZS5pZ25vcmVUaGF0TG90KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkaWZmSW5EYXlzID0gTWF0aC5jZWlsKCh4LnNvbGREYXRlLmdldFRpbWUoKSAtIG5ldyBEYXRlKGxvdFN0YXRlLmxhc3RVcGRhdGUpLmdldFRpbWUoKSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZkluRGF5cyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSAnI2UwZTA3ZidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSAnbGlnaHRncmVlbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaWZmSW5EYXlzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSAnbGlnaHRncmVlbidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSAnbGlnaHRwaW5rJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh4LmNvbG9yICE9PSBudWxsICYmIGNvbG9yICE9PSB4LmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5saW5rLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHt4LmNvbG9yfTtgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3Iuc3RhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIExvdExpbmsge1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgbGluazogSFRNTEFuY2hvckVsZW1lbnQsIHNvbGREYXRlOiBEYXRlKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkXHJcbiAgICAgICAgdGhpcy5saW5rID0gbGlua1xyXG4gICAgICAgIHRoaXMuc29sZERhdGUgPSBzb2xkRGF0ZVxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgaWQ6IG51bWJlcjtcclxuICAgIGxpbms6IEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgc29sZERhdGU6IERhdGVcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBudWxsXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNsZWVwRWxlbWVudExvYWRlZChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxFbGVtZW50PiB7XHJcbiAgICBsZXQgcmV0cnkgPSAwXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHJldHJ5Kys7XHJcbiAgICAgICAgaWYgKHJldHJ5ID4gMTAwMCkgdGhyb3cgbmV3IEVycm9yKFwidW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvciBcIiArIHNlbGVjdG9yKVxyXG5cclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IG51bGwpIHJldHVybiBlbGVtZW50XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNhdmVDb2RlVmVyaWZpZXIoKSB7XHJcbiAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSk/LmNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgaWYgKGNvZGVWZXJpZmllciA9PT0gbnVsbCB8fCBjb2RlVmVyaWZpZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSBhd2FpdCBnZW5lcmF0ZUNvZGVWZXJpZmllcigpO1xyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29kZV92ZXJpZmllcjogY29kZVZlcmlmaWVyfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bigpIHtcclxuICAgIGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZm9vdGVyJylcclxuICAgIGF3YWl0IHNhdmVDb2RlVmVyaWZpZXIoKTtcclxuXHJcbiAgICBsZXQgb0F1dGgyQ2xpZW50ID0gbmV3IE9BdXRoMkNsaWVudCh7XHJcbiAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgIGNsaWVudElkOiAnRWJheS5DaHJvbWVFeHRlbnNpb24nLFxyXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6ICcvY29ubmVjdC90b2tlbicsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcblxyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09PSBhdXRoUmVkaXJlY3RVcmwpIHtcclxuICAgICAgICBhd2FpdCBhdXRoUGFnZShvQXV0aDJDbGllbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY2xpZW50ID0gbmV3IENsaWVudChiYXNlQXBpVXJsLCBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQpKTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9pdG0vXCIpKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50UGFnZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZWJheS5jb20vc2NoL1wiKSkge1xyXG4gICAgICAgICAgICBhd2FpdCBzZWFyY2hQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxucnVuKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==