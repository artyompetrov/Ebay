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
exports.ApiException = exports.Errors2 = exports.Errors = exports.ValidationProblemDetailedInfo = exports.NotFoundProblemDetailedInfo = exports.ProblemDetailedInfo = exports.Currency = exports.ShippingRate = exports.ShippingRates = exports.ShippingType = exports.ClientErrorInfo = exports.LotState = exports.ManualCondition = exports.PurchaseInfo = exports.LotInfo = exports.LotInfoWithProductId = exports.SearchQuery = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
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
     * MarkProductAsChecked
     * @return Updated
     */
    markProductAsChecked(id) {
        let url_ = this.baseUrl + "/products/{id}/mark_as_checked/";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "POST",
            headers: {}
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processMarkProductAsChecked(_response);
        });
    }
    processMarkProductAsChecked(response) {
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
    /**
     * @return Ok
     */
    getShippingRates() {
        let url_ = this.baseUrl + "/shipping_rates/";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetShippingRates(_response);
        });
    }
    processGetShippingRates(response) {
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
                        result200.push(ShippingType.fromJS(item));
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
     * @return Ok
     */
    getCurrencies() {
        let url_ = this.baseUrl + "/currencies/";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetCurrencies(_response);
        });
    }
    processGetCurrencies(response) {
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
                        result200.push(Currency.fromJS(item));
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
     * Save Error
     * @return Ok
     */
    saveError(error) {
        let url_ = this.baseUrl + "/error/";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(error);
        let options_ = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processSaveError(_response);
        });
    }
    processSaveError(response) {
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
            this.lastCheckTime = _data["LastCheckTime"];
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
        data["LastCheckTime"] = this.lastCheckTime;
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
            this.shippingCountry = _data["shippingCountry"];
            this.currency = _data["currency"];
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
        data["shippingCountry"] = this.shippingCountry;
        data["currency"] = this.currency;
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
class ClientErrorInfo {
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
            this.url = _data["url"];
            this.error = _data["error"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ClientErrorInfo();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["url"] = this.url;
        data["error"] = this.error;
        return data;
    }
}
exports.ClientErrorInfo = ClientErrorInfo;
class ShippingType {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
        if (!data) {
            this.rates = [];
        }
    }
    init(_data) {
        if (_data) {
            this.name = _data["name"];
            this.currency = _data["currency"];
            if (Array.isArray(_data["rates"])) {
                this.rates = [];
                for (let item of _data["rates"])
                    this.rates.push(ShippingRates.fromJS(item));
            }
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ShippingType();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["currency"] = this.currency;
        if (Array.isArray(this.rates)) {
            data["rates"] = [];
            for (let item of this.rates)
                data["rates"].push(item.toJSON());
        }
        return data;
    }
}
exports.ShippingType = ShippingType;
class ShippingRates {
    constructor(data) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
        }
        if (!data) {
            this.rates = [];
        }
    }
    init(_data) {
        if (_data) {
            if (Array.isArray(_data["specifiedCountries"])) {
                this.specifiedCountries = [];
                for (let item of _data["specifiedCountries"])
                    this.specifiedCountries.push(item);
            }
            if (Array.isArray(_data["rates"])) {
                this.rates = [];
                for (let item of _data["rates"])
                    this.rates.push(ShippingRate.fromJS(item));
            }
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ShippingRates();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.specifiedCountries)) {
            data["specifiedCountries"] = [];
            for (let item of this.specifiedCountries)
                data["specifiedCountries"].push(item);
        }
        if (Array.isArray(this.rates)) {
            data["rates"] = [];
            for (let item of this.rates)
                data["rates"].push(item.toJSON());
        }
        return data;
    }
}
exports.ShippingRates = ShippingRates;
class ShippingRate {
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
            this.minWeight = _data["minWeight"];
            this.maxWeight = _data["maxWeight"];
            this.price = _data["price"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new ShippingRate();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["minWeight"] = this.minWeight;
        data["maxWeight"] = this.maxWeight;
        data["price"] = this.price;
        return data;
    }
}
exports.ShippingRate = ShippingRate;
class Currency {
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
            this.ebayName = _data["ebayName"];
            this.rusName = _data["rusName"];
            this.rate = _data["rate"];
            this.lastUpdate = _data["lastUpdate"];
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new Currency();
        result.init(data);
        return result;
    }
    toJSON(data) {
        data = typeof data === 'object' ? data : {};
        data["ebayName"] = this.ebayName;
        data["rusName"] = this.rusName;
        data["rate"] = this.rate;
        data["lastUpdate"] = this.lastUpdate;
        return data;
    }
}
exports.Currency = Currency;
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
const supportedEuropeCountries = new Set(['Germany', 'Italy', 'France', 'United Kingdom']);
const supportedShippingCountries = ['Germany', 'Italy', 'France', 'United Kingdom', 'United States'];
const countryIndexParam = 'currentCountryIndex';
const shippingInfoNotFound = "shippingInfoNotFound";
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
    return new Price(parseFloat(matches[2].replace(',', '.')), matches[1].trim());
}
class Price {
    constructor(price, currency) {
        this.currency = currency;
        this.price = price;
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
    div.hidden = true;
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
            if (lotInfo.shippingCountry === shippingInfoNotFound) {
                ignoreThatLot = true;
            }
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
            yield showAndSaveError(error, client);
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
            let priceExtracted = extractPrice(price);
            if (priceExtracted.currency !== lotInfo.currency) {
                throw new Error("currency doesn't match with lot currency lot currency " + lotInfo.currency + " extracted currency " + priceExtracted.currency);
            }
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3]), priceExtracted));
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
        var _a;
        return new EbayClient_1.PurchaseInfo({
            date: x.date.toISOString(), quantity: x.quantity, price: (_a = x.price) === null || _a === void 0 ? void 0 : _a.price
        });
    });
}
function fillId() {
    lotInfo.lotId = parseInt(location.pathname.match(/\/itm\/([0-9]+)/)[1]);
}
function fillPrice() {
    return __awaiter(this, void 0, void 0, function* () {
        let price = extractPrice((yield sleepElementLoaded('div.x-price-primary span', document)).innerText);
        lotInfo.price = price.price;
        lotInfo.currency = price.currency;
    });
}
function fillName() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.name = (yield sleepElementLoaded('.vim h1', document)).innerText;
    });
}
function fillSeller() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.seller = (yield sleepElementLoaded('div.x-sellercard-atf__info__about-seller a', document)).innerText.toLowerCase();
    });
}
function fillCondition() {
    return __awaiter(this, void 0, void 0, function* () {
        lotInfo.condition = (yield sleepElementLoaded('div.x-item-condition-text span.ux-textspans', document)).innerText;
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
function hasShippingToCountry(country, shipsTo, excludes) {
    return (shipsTo.has('Worldwide') || (shipsTo.has("Europe") && supportedEuropeCountries.has(country)) || shipsTo.has(country)) && !excludes.has(country);
}
function changeShippingCountry(currentCountryIndex, shippingDiv, currentShippingCountry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentCountryIndex >= supportedShippingCountries.length)
            throw new Error("currentCountryIndex Out of supported shipping countries range");
        let shipsTo = getShipsTo(shippingDiv);
        let excludes = getExcludes(shippingDiv);
        let nextCountryIndex = currentCountryIndex;
        let nextCountry = supportedShippingCountries[nextCountryIndex];
        while (!hasShippingToCountry(nextCountry, shipsTo, excludes)) {
            nextCountryIndex = nextCountryIndex + 1;
            if (nextCountryIndex >= supportedShippingCountries.length)
                throw new Error("Out of supported shipping countries range");
            nextCountry = supportedShippingCountries[nextCountryIndex];
        }
        if (currentShippingCountry !== nextCountry) {
            let shipButton = (yield sleepElementLoaded('#gh-shipto-click button', document));
            yield sleep(1000);
            shipButton.click();
            let chooseShippingCountryDialog = yield sleepElementLoaded('#gh-shipto-click-modal', document);
            yield sleepUntil(() => chooseShippingCountryDialog.checkVisibility() === false);
            yield sleep(500);
            (yield sleepElementLoaded('button.menu-button__button', chooseShippingCountryDialog)).click();
            let itemsMenu = ((yield sleepElementLoaded('div.menu-button__items', chooseShippingCountryDialog)));
            yield sleepUntil(() => itemsMenu.checkVisibility() === false);
            yield sleep(500);
            getCountrySpanItem(nextCountry, itemsMenu).click();
            yield sleepUntil(() => { var _a; return ((_a = shipButton.getAttribute("aria-label")) === null || _a === void 0 ? void 0 : _a.includes(nextCountry)) !== true; });
            yield sleep(500);
            (yield sleepElementLoaded('button.shipto__close-btn', chooseShippingCountryDialog)).click();
        }
        yield sleep(3000);
        let url = new URL(document.location.href);
        url.searchParams.set(countryIndexParam, (nextCountryIndex).toString());
        document.location.href = url.toString();
    });
}
function getShipsTo(shippingDiv) {
    return new Set(shippingDiv.querySelector('div.ux-labels-values--shipsto').innerText.replace("Ships to:", "")
        .split(',').map(s => s.trim()));
}
function getExcludes(shippingDiv) {
    return new Set(shippingDiv.querySelector('div.ux-labels-values--excludes').innerText.replace("Excludes:", "")
        .split(',').map(s => s.trim()));
}
function fillShipping() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let url = new URL(document.location.href);
        let currentCountryIndex = parseInt((_a = url.searchParams.get(countryIndexParam)) !== null && _a !== void 0 ? _a : "0");
        let currentCountry = supportedShippingCountries[currentCountryIndex];
        let shippingDiv = yield sleepElementLoaded('div.d-shipping-maxview', document);
        let shippingRatesAvailable = shippingDiv.querySelector('div.ux-layout-section__textual-display--askSeller') === null;
        if (shippingRatesAvailable) {
            let shippingTable = shippingDiv.querySelector('table.ux-table-section-with-hints--shippingTable');
            if (shippingTable === null || shippingTable === undefined) {
                lotInfo.shipping = 0;
                lotInfo.shippingAdditional = 0;
                lotInfo.shippingCountry = shippingInfoNotFound;
                return;
            }
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
            let currentShippingCountry = shippingMaxviewValues['To'];
            if (currentShippingCountry !== currentCountry) {
                console.log("changing shipping country because current country " + currentShippingCountry + " doesn't match with expected " + currentCountry);
                yield changeShippingCountry(currentCountryIndex, shippingDiv, currentShippingCountry);
                return;
            }
            let shippingValue = shippingMaxviewValues['Shipping and handling'];
            if (shippingValue !== 'Free shipping') {
                let shippingPrice = extractPrice(shippingValue);
                if (shippingPrice.currency !== lotInfo.currency)
                    throw new Error("Shipping currency mismatch with lot currency");
                lotInfo.shipping = shippingPrice.price;
                if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {
                    let eachAdditional = shippingMaxviewValues['Each additional item'];
                    if (eachAdditional !== "Free") {
                        let eachAdditionalPrice = extractPrice(eachAdditional);
                        if (eachAdditionalPrice.currency !== lotInfo.currency)
                            throw new Error("Each additional shipping currency mismatch with lot currency");
                        lotInfo.shippingAdditional = eachAdditionalPrice.price;
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
            console.log('currentShippingCountry ' + currentShippingCountry);
            lotInfo.shippingCountry = currentShippingCountry;
        }
        else {
            console.log("Changing because there is no shipping to current country");
            yield changeShippingCountry(currentCountryIndex + 1, shippingDiv, null);
            return;
        }
    });
}
function sleepUntil(func, sleepMs = 100, maxAttempt = 100) {
    return __awaiter(this, void 0, void 0, function* () {
        let attempt = 0;
        while (func()) {
            attempt++;
            if (attempt > maxAttempt)
                throw new Error("Attempt counts exceeded " + maxAttempt + " " + func.toString());
            yield sleep(sleepMs);
        }
    });
}
function getCountrySpanItem(countryName, itemsMenu) {
    if (countryName === null || countryName === undefined)
        throw new Error("country name shouldn't be null or undefined");
    let spans = itemsMenu.querySelectorAll('span.cn');
    for (let i = 0; i < spans.length; ++i) {
        if (spans[i].innerText === countryName) {
            return spans[i];
        }
    }
    throw new Error("Unable to find country in list " + countryName);
}
function fillLocatedIn() {
    return __awaiter(this, void 0, void 0, function* () {
        let match = (yield sleepElementLoaded('div.d-shipping-minview', document)).innerText.match(/Located\sin:\s(.+)/);
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
        let foundElement = yield sleepElementLoadedAny(['#desc_ifr', '#vi_snippetdesc_btn']);
        let descriptionUrl;
        if (foundElement instanceof HTMLIFrameElement) {
            descriptionUrl = foundElement.src;
        }
        else if (foundElement instanceof HTMLAnchorElement) {
            descriptionUrl = foundElement.href;
        }
        console.log(descriptionUrl);
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
        serverLotInfoJson["shipping"] = undefined;
        serverLotInfoJson["shippingAdditional"] = undefined;
        serverLotInfoJson["shippingCountry"] = undefined;
        let serverPurchaseHistory = serverLotInfoJson["purchaseHistory"];
        serverLotInfoJson["purchaseHistory"] = undefined;
        let lotInfoJson = lotInfo.toJSON();
        lotInfoJson["pcs"] = undefined;
        lotInfoJson["ignoreThatLot"] = undefined;
        lotInfoJson["manualConditionId"] = undefined;
        lotInfoJson["description"] = undefined;
        lotInfoJson["shipping"] = undefined;
        lotInfoJson["shippingAdditional"] = undefined;
        lotInfoJson["shippingCountry"] = undefined;
        let lotInfoPurchaseHistory = lotInfoJson["purchaseHistory"];
        lotInfoJson["purchaseHistory"] = undefined;
        let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson);
        let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson);
        let serverPurchaseHistoryJsonString = JSON.stringify(serverPurchaseHistory);
        let lotInfoPurchaseHistoryJsonString = JSON.stringify(lotInfoPurchaseHistory);
        let panel = yield sleepElementLoaded('div.' + panelClass, document);
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
        let panel = yield sleepElementLoaded('div.' + panelClass, document);
        fillId();
        yield Promise.all([
            fillPrice(),
            fillName(),
            fillSeller(),
            fillCondition(),
            fillConditionDescription(),
            fillLocatedIn(),
            fillDescription(),
            getServerLotInfo(client)
        ]);
        yield Promise.all([
            fillPurchaseHistory(),
            fillProduct(panel, client, _serverLotInfo),
            fillManualCondition(panel, client, _serverLotInfo),
            fillPcs(panel, _serverLotInfo),
            fillIgnoreThatLot(panel, _serverLotInfo),
            fillShipping(),
        ]);
        console.log("show panel");
        panel.hidden = false;
        yield compareLotInfos(_serverLotInfo);
    });
}
function addPanel(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let bodyElement = yield sleepElementLoaded('body', document);
        if (bodyElement) {
            let existingPanel = bodyElement.querySelector('div.' + panelClass);
            if (!existingPanel) {
                createPanel(bodyElement, client);
            }
        }
    });
}
function saveErrorToBackend(error, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorText = JSON.stringify(error) + " " + error.stack;
        try {
            yield client.saveError(new EbayClient_1.ClientErrorInfo({
                error: errorText,
                url: document.location.href
            }));
        }
        catch (_a) {
            console.log("Unable to save error to backend " + errorText);
        }
    });
}
function showAndSaveError(error, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorText;
        if (error instanceof EbayClient_1.ValidationProblemDetailedInfo) {
            let validationError = error;
            errorText = JSON.stringify(validationError.errors);
        }
        else {
            errorText = error.stack;
        }
        console.log("ERROR " + errorText);
        let errorDiv = yield sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document);
        let span = document.createElement('span');
        span.innerHTML = errorText;
        errorDiv.appendChild(span);
        yield saveErrorToBackend(error, client);
    });
}
function enableSubmitButton() {
    return __awaiter(this, void 0, void 0, function* () {
        (yield sleepElementLoaded('#' + submitId, document)).disabled = false;
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
        let errorDiv = yield sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document);
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
            yield showAndSaveError(error, client);
        }
    });
}
function authPage(oAuth2Client) {
    var _a;
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
            let returnPage = (_a = (yield chrome.storage.local.get(["return_page"]))) === null || _a === void 0 ? void 0 : _a.return_page;
            if (returnPage !== null && returnPage !== undefined) {
                yield chrome.storage.local.set({ return_page: null });
                document.location.href = returnPage;
            }
            else {
                document.location.href = authRedirectUrl;
            }
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
        let searchResults = yield sleepElementLoaded('ul.srp-results', document);
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
                yield saveErrorToBackend(error, client);
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
function sleepElementLoaded(selector, elementToSearchIn) {
    return __awaiter(this, void 0, void 0, function* () {
        let retry = 0;
        while (true) {
            retry++;
            if (retry > 200)
                throw new Error("unable to find element by selector " + selector);
            let element = elementToSearchIn.querySelector(selector);
            if (element !== null)
                return element;
            yield sleep(100);
        }
    });
}
function sleepElementLoadedAny(selectors) {
    return __awaiter(this, void 0, void 0, function* () {
        let retry = 0;
        while (true) {
            retry++;
            if (retry > 1000)
                throw new Error("unable to find any element by selectors " + selectors.join(", "));
            let foundElement;
            selectors.forEach(function (x) {
                let element = document.querySelector(x);
                if (element != null) {
                    foundElement = element;
                }
            });
            if (foundElement !== null)
                return foundElement;
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
        yield sleepElementLoaded('footer', document);
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
            yield chrome.storage.local.set({ return_page: document.location.href });
            let client = new EbayClient_1.Client(baseApiUrl, getAuthorizeFetch(oAuth2Client));
            try {
                if (currentPage.startsWith("https://www.ebay.com/itm/")) {
                    yield productPage(client);
                }
                else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
                    yield searchPage(client);
                }
            }
            catch (error) {
                yield saveErrorToBackend(error, client);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxXQUFXLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQztvQkFDN0QsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDTCxDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDYixNQUFNLGtCQUFrQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUM7SUFFTCxDQUFDO0NBQUE7QUEvQkQsa0JBK0JDO0FBR0QsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7VUN2NkJOO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudC9icm93c2VyL29hdXRoMi1jbGllbnQubWluLmpzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL0ViYXlDbGllbnQvRWJheUNsaWVudC50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9GZXRjaFdyYXBwZXJDdXN0b20udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbWFpbi50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuT0F1dGgyQ2xpZW50PXQoKTplLk9BdXRoMkNsaWVudD10KCl9KHNlbGYsKCgpPT4oKCk9Pnt2YXIgZT17OTM0OihlLHQscik9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmdlbmVyYXRlUXVlcnlTdHJpbmc9dC5PQXV0aDJDbGllbnQ9dm9pZCAwO2NvbnN0IG49cig0NDMpLGk9cig2MTgpO2Z1bmN0aW9uIG8oZSx0KXtyZXR1cm4gbmV3IFVSTChlLHQpLnRvU3RyaW5nKCl9ZnVuY3Rpb24gcyhlKXtyZXR1cm4gbmV3IFVSTFNlYXJjaFBhcmFtcyhPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZSkuZmlsdGVyKCgoW2UsdF0pPT52b2lkIDAhPT10KSkpKS50b1N0cmluZygpfXQuT0F1dGgyQ2xpZW50PWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMuZGlzY292ZXJ5RG9uZT0hMSx0aGlzLnNlcnZlck1ldGFkYXRhPW51bGwsKG51bGw9PWU/dm9pZCAwOmUuZmV0Y2gpfHwoZS5mZXRjaD1mZXRjaC5iaW5kKGdsb2JhbFRoaXMpKSx0aGlzLnNldHRpbmdzPWV9YXN5bmMgcmVmcmVzaFRva2VuKGUpe2lmKCFlLnJlZnJlc2hUb2tlbil0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHRva2VuIGRpZG4ndCBoYXZlIGEgcmVmcmVzaFRva2VuLiBJdCdzIG5vdCBwb3NzaWJsZSB0byByZWZyZXNoIHRoaXNcIik7Y29uc3QgdD17Z3JhbnRfdHlwZTpcInJlZnJlc2hfdG9rZW5cIixyZWZyZXNoX3Rva2VuOmUucmVmcmVzaFRva2VufTtyZXR1cm4gdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXR8fCh0LmNsaWVudF9pZD10aGlzLnNldHRpbmdzLmNsaWVudElkKSx0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIix0KSl9YXN5bmMgY2xpZW50Q3JlZGVudGlhbHMoZSl7dmFyIHQ7Y29uc3Qgcj1bXCJjbGllbnRfaWRcIixcImNsaWVudF9zZWNyZXRcIixcImdyYW50X3R5cGVcIixcInNjb3BlXCJdO2lmKChudWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zKSYmT2JqZWN0LmtleXMoZS5leHRyYVBhcmFtcykuZmlsdGVyKChlPT5yLmluY2x1ZGVzKGUpKSkubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIGV4dHJhUGFyYW1zIGFyZSBkaXNhbGxvd2VkOiAnJHtyLmpvaW4oXCInLCAnXCIpfSdgKTtjb25zdCBuPXtncmFudF90eXBlOlwiY2xpZW50X2NyZWRlbnRpYWxzXCIsc2NvcGU6bnVsbD09PSh0PW51bGw9PWU/dm9pZCAwOmUuc2NvcGUpfHx2b2lkIDA9PT10P3ZvaWQgMDp0LmpvaW4oXCIgXCIpLC4uLm51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXN9O2lmKCF0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCl0aHJvdyBuZXcgRXJyb3IoXCJBIGNsaWVudFNlY3JldCBtdXN0IGJlIHByb3ZpZGVkIHRvIHVzZSBjbGllbnRfY3JlZGVudGlhbHNcIik7cmV0dXJuIHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLG4pKX1hc3luYyBwYXNzd29yZChlKXt2YXIgdDtjb25zdCByPXtncmFudF90eXBlOlwicGFzc3dvcmRcIiwuLi5lLHNjb3BlOm51bGw9PT0odD1lLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKX07cmV0dXJuIHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHIpKX1nZXQgYXV0aG9yaXphdGlvbkNvZGUoKXtyZXR1cm4gbmV3IGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQodGhpcyl9YXN5bmMgaW50cm9zcGVjdChlKXtjb25zdCB0PXt0b2tlbjplLmFjY2Vzc1Rva2VuLHRva2VuX3R5cGVfaGludDpcImFjY2Vzc190b2tlblwifTtyZXR1cm4gdGhpcy5yZXF1ZXN0KFwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCIsdCl9YXN5bmMgZ2V0RW5kcG9pbnQoZSl7aWYodm9pZCAwIT09dGhpcy5zZXR0aW5nc1tlXSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZihcImRpc2NvdmVyeUVuZHBvaW50XCIhPT1lJiYoYXdhaXQgdGhpcy5kaXNjb3ZlcigpLHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pKXJldHVybiBvKHRoaXMuc2V0dGluZ3NbZV0sdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2lmKCF0aGlzLnNldHRpbmdzLnNlcnZlcil0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBkZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mICR7ZX0uIEVpdGhlciBzcGVjaWZ5ICR7ZX0gaW4gdGhlIHNldHRpbmdzLCBvciB0aGUgXCJzZXJ2ZXJcIiBlbmRwb2ludCB0byBsZXQgdGhlIGNsaWVudCBkaXNjb3ZlciBpdC5gKTtzd2l0Y2goZSl7Y2FzZVwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvYXV0aG9yaXplXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcInRva2VuRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi90b2tlblwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJkaXNjb3ZlcnlFbmRwb2ludFwiOnJldHVybiBvKFwiLy53ZWxsLWtub3duL29hdXRoLWF1dGhvcml6YXRpb24tc2VydmVyXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcImludHJvc3BlY3Rpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2ludHJvc3BlY3RcIix0aGlzLnNldHRpbmdzLnNlcnZlcil9fWFzeW5jIGRpc2NvdmVyKCl7dmFyIGU7aWYodGhpcy5kaXNjb3ZlcnlEb25lKXJldHVybjtsZXQgdDt0aGlzLmRpc2NvdmVyeURvbmU9ITA7dHJ5e3Q9YXdhaXQgdGhpcy5nZXRFbmRwb2ludChcImRpc2NvdmVyeUVuZHBvaW50XCIpfWNhdGNoKGUpe3JldHVybiB2b2lkIGNvbnNvbGUud2FybignW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gRWl0aGVyIHNwZWNpZnkgdGhlIFwic2VydmVyXCIgb3IgXCJkaXNjb3ZlcnlFbmRwb2ludCcpfWNvbnN0IHI9YXdhaXQgdGhpcy5zZXR0aW5ncy5mZXRjaCh0LHtoZWFkZXJzOntBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uXCJ9fSk7aWYoIXIub2spcmV0dXJuO2lmKCEobnVsbD09PShlPXIuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikpfHx2b2lkIDA9PT1lP3ZvaWQgMDplLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSlyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oXCJbb2F1dGgyXSBPQXV0aDIgZGlzY292ZXJ5IGVuZHBvaW50IHdhcyBub3QgYSBKU09OIHJlc3BvbnNlLiBSZXNwb25zZSBpcyBpZ25vcmVkXCIpO3RoaXMuc2VydmVyTWV0YWRhdGE9YXdhaXQgci5qc29uKCk7Y29uc3Qgbj1bW1wiYXV0aG9yaXphdGlvbl9lbmRwb2ludFwiLFwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCJdLFtcInRva2VuX2VuZHBvaW50XCIsXCJ0b2tlbkVuZHBvaW50XCJdLFtcImludHJvc3BlY3Rpb25fZW5kcG9pbnRcIixcImludHJvc3BlY3Rpb25FbmRwb2ludFwiXV07aWYobnVsbCE9PXRoaXMuc2VydmVyTWV0YWRhdGEpe2Zvcihjb25zdFtlLHJdb2Ygbil0aGlzLnNlcnZlck1ldGFkYXRhW2VdJiYodGhpcy5zZXR0aW5nc1tyXT1vKHRoaXMuc2VydmVyTWV0YWRhdGFbZV0sdCkpO3RoaXMuc2VydmVyTWV0YWRhdGEudG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2RzX3N1cHBvcnRlZCYmIXRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2QmJih0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kPXRoaXMuc2VydmVyTWV0YWRhdGEudG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2RzX3N1cHBvcnRlZFswXSl9fWFzeW5jIHJlcXVlc3QoZSx0KXtjb25zdCByPWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoZSksaT17XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwifTtsZXQgbz10aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kO3N3aXRjaChvfHwobz10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldD9cImNsaWVudF9zZWNyZXRfYmFzaWNcIjpcImNsaWVudF9zZWNyZXRfcG9zdFwiKSxvKXtjYXNlXCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6aS5BdXRob3JpemF0aW9uPVwiQmFzaWMgXCIrYnRvYSh0aGlzLnNldHRpbmdzLmNsaWVudElkK1wiOlwiK3RoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KTticmVhaztjYXNlXCJjbGllbnRfc2VjcmV0X3Bvc3RcIjp0LmNsaWVudF9pZD10aGlzLnNldHRpbmdzLmNsaWVudElkLHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYodC5jbGllbnRfc2VjcmV0PXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIkF1dGhlbnRpY2F0aW9uIG1ldGhvZCBub3QgeWV0IHN1cHBvcnRlZDpcIitvK1wiLiBPcGVuIGEgZmVhdHVyZSByZXF1ZXN0IGlmIHlvdSB3YW50IHRoaXMhXCIpfWNvbnN0IGE9YXdhaXQgdGhpcy5zZXR0aW5ncy5mZXRjaChyLHttZXRob2Q6XCJQT1NUXCIsYm9keTpzKHQpLGhlYWRlcnM6aX0pO2lmKGEub2spcmV0dXJuIGF3YWl0IGEuanNvbigpO2xldCBjLGgsdTt0aHJvdyBhLmhlYWRlcnMuaGFzKFwiQ29udGVudC1UeXBlXCIpJiZhLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpJiYoYz1hd2FpdCBhLmpzb24oKSksKG51bGw9PWM/dm9pZCAwOmMuZXJyb3IpPyhoPVwiT0F1dGgyIGVycm9yIFwiK2MuZXJyb3IrXCIuXCIsYy5lcnJvcl9kZXNjcmlwdGlvbiYmKGgrPVwiIFwiK2MuZXJyb3JfZGVzY3JpcHRpb24pLHU9Yy5lcnJvcik6KGg9XCJIVFRQIEVycm9yIFwiK2Euc3RhdHVzK1wiIFwiK2Euc3RhdHVzVGV4dCw0MDE9PT1hLnN0YXR1cyYmdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQmJihoKz1cIi4gSXQncyBsaWtlbHkgdGhhdCB0aGUgY2xpZW50SWQgYW5kL29yIGNsaWVudFNlY3JldCB3YXMgaW5jb3JyZWN0XCIpLHU9bnVsbCksbmV3IG4uT0F1dGgyRXJyb3IoaCx1LGEuc3RhdHVzKX10b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbihlKXtyZXR1cm4gZS50aGVuKChlPT57dmFyIHQ7cmV0dXJue2FjY2Vzc1Rva2VuOmUuYWNjZXNzX3Rva2VuLGV4cGlyZXNBdDplLmV4cGlyZXNfaW4/RGF0ZS5ub3coKSsxZTMqZS5leHBpcmVzX2luOm51bGwscmVmcmVzaFRva2VuOm51bGwhPT0odD1lLnJlZnJlc2hfdG9rZW4pJiZ2b2lkIDAhPT10P3Q6bnVsbH19KSl9fSx0LmdlbmVyYXRlUXVlcnlTdHJpbmc9c30sNjE4OihlLHQscik9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmdldENvZGVDaGFsbGVuZ2U9dC5nZW5lcmF0ZUNvZGVWZXJpZmllcj10Lk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoOTM0KSxpPXIoNDQzKTthc3luYyBmdW5jdGlvbiBvKGUpe2NvbnN0IHQ9cygpO2lmKG51bGw9PXQ/dm9pZCAwOnQuc3VidGxlKXJldHVybltcIlMyNTZcIixjKGF3YWl0IHQuc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIixhKGUpKSldO3tjb25zdCB0PXIoMjEyKS5jcmVhdGVIYXNoKFwic2hhMjU2XCIpO3JldHVybiB0LnVwZGF0ZShhKGUpKSxbXCJTMjU2XCIsdC5kaWdlc3QoXCJiYXNlNjR1cmxcIildfX1mdW5jdGlvbiBzKCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LmNyeXB0bylyZXR1cm4gd2luZG93LmNyeXB0bztpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmc2VsZi5jcnlwdG8pcmV0dXJuIHNlbGYuY3J5cHRvO2NvbnN0IGU9cigyMTIpO3JldHVybiBlLndlYmNyeXB0bz9lLndlYmNyeXB0bzpudWxsfWZ1bmN0aW9uIGEoZSl7Y29uc3QgdD1uZXcgVWludDhBcnJheShlLmxlbmd0aCk7Zm9yKGxldCByPTA7cjxlLmxlbmd0aDtyKyspdFtyXT0yNTUmZS5jaGFyQ29kZUF0KHIpO3JldHVybiB0fWZ1bmN0aW9uIGMoZSl7cmV0dXJuIGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi5uZXcgVWludDhBcnJheShlKSkpLnJlcGxhY2UoL1xcKy9nLFwiLVwiKS5yZXBsYWNlKC9cXC8vZyxcIl9cIikucmVwbGFjZSgvPSskLyxcIlwiKX10Lk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMuY2xpZW50PWV9YXN5bmMgZ2V0QXV0aG9yaXplVXJpKGUpe2NvbnN0W3Qscl09YXdhaXQgUHJvbWlzZS5hbGwoW2UuY29kZVZlcmlmaWVyP28oZS5jb2RlVmVyaWZpZXIpOnZvaWQgMCx0aGlzLmNsaWVudC5nZXRFbmRwb2ludChcImF1dGhvcml6YXRpb25FbmRwb2ludFwiKV0pO2xldCBpPXtjbGllbnRfaWQ6dGhpcy5jbGllbnQuc2V0dGluZ3MuY2xpZW50SWQscmVzcG9uc2VfdHlwZTpcImNvZGVcIixyZWRpcmVjdF91cmk6ZS5yZWRpcmVjdFVyaSxjb2RlX2NoYWxsZW5nZV9tZXRob2Q6bnVsbD09dD92b2lkIDA6dFswXSxjb2RlX2NoYWxsZW5nZTpudWxsPT10P3ZvaWQgMDp0WzFdfTtlLnN0YXRlJiYoaS5zdGF0ZT1lLnN0YXRlKSxlLnNjb3BlJiYoaS5zY29wZT1lLnNjb3BlLmpvaW4oXCIgXCIpKTtjb25zdCBzPU9iamVjdC5rZXlzKGkpO2lmKChudWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zKSYmT2JqZWN0LmtleXMoZS5leHRyYVBhcmFtcykuZmlsdGVyKChlPT5zLmluY2x1ZGVzKGUpKSkubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIGV4dHJhUGFyYW1zIGFyZSBkaXNhbGxvd2VkOiAnJHtzLmpvaW4oXCInLCAnXCIpfSdgKTtyZXR1cm4gaT17Li4uaSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfSxyK1wiP1wiKygwLG4uZ2VuZXJhdGVRdWVyeVN0cmluZykoaSl9YXN5bmMgZ2V0VG9rZW5Gcm9tQ29kZVJlZGlyZWN0KGUsdCl7Y29uc3R7Y29kZTpyfT1hd2FpdCB0aGlzLnZhbGlkYXRlUmVzcG9uc2UoZSx7c3RhdGU6dC5zdGF0ZX0pO3JldHVybiB0aGlzLmdldFRva2VuKHtjb2RlOnIscmVkaXJlY3RVcmk6dC5yZWRpcmVjdFVyaSxjb2RlVmVyaWZpZXI6dC5jb2RlVmVyaWZpZXJ9KX1hc3luYyB2YWxpZGF0ZVJlc3BvbnNlKGUsdCl7dmFyIHI7Y29uc3Qgbj1uZXcgVVJMKGUpLnNlYXJjaFBhcmFtcztpZihuLmhhcyhcImVycm9yXCIpKXRocm93IG5ldyBpLk9BdXRoMkVycm9yKG51bGwhPT0ocj1uLmdldChcImVycm9yX2Rlc2NyaXB0aW9uXCIpKSYmdm9pZCAwIT09cj9yOlwiT0F1dGgyIGVycm9yXCIsbi5nZXQoXCJlcnJvclwiKSwwKTtpZighbi5oYXMoXCJjb2RlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIHVybCBkaWQgbm90IGNvbnRhaW4gYSBjb2RlIHBhcmFtZXRlciAke2V9YCk7aWYodC5zdGF0ZSYmdC5zdGF0ZSE9PW4uZ2V0KFwic3RhdGVcIikpdGhyb3cgbmV3IEVycm9yKGBUaGUgXCJzdGF0ZVwiIHBhcmFtZXRlciBpbiB0aGUgdXJsIGRpZCBub3QgbWF0Y2ggdGhlIGV4cGVjdGVkIHZhbHVlIG9mICR7dC5zdGF0ZX1gKTtyZXR1cm57Y29kZTpuLmdldChcImNvZGVcIiksc2NvcGU6bi5oYXMoXCJzY29wZVwiKT9uLmdldChcInNjb3BlXCIpLnNwbGl0KFwiIFwiKTp2b2lkIDB9fWFzeW5jIGdldFRva2VuKGUpe2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJhdXRob3JpemF0aW9uX2NvZGVcIixjb2RlOmUuY29kZSxyZWRpcmVjdF91cmk6ZS5yZWRpcmVjdFVyaSxjb2RlX3ZlcmlmaWVyOmUuY29kZVZlcmlmaWVyfTtyZXR1cm4gdGhpcy5jbGllbnQudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5jbGllbnQucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIix0KSl9fSx0LmdlbmVyYXRlQ29kZVZlcmlmaWVyPWFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgZT1zKCk7aWYoZSl7Y29uc3QgdD1uZXcgVWludDhBcnJheSgzMik7cmV0dXJuIGUuZ2V0UmFuZG9tVmFsdWVzKHQpLGModCl9e2NvbnN0IGU9cigyMTIpO3JldHVybiBuZXcgUHJvbWlzZSgoKHQscik9PntlLnJhbmRvbUJ5dGVzKDMyLCgoZSxuKT0+e2UmJnIoZSksdChuLnRvU3RyaW5nKFwiYmFzZTY0dXJsXCIpKX0pKX0pKX19LHQuZ2V0Q29kZUNoYWxsZW5nZT1vfSw0NDM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkVycm9yPXZvaWQgMDtjbGFzcyByIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUpLHRoaXMub2F1dGgyQ29kZT10LHRoaXMuaHR0cENvZGU9cn19dC5PQXV0aDJFcnJvcj1yfSwxMzooZSx0KT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuT0F1dGgyRmV0Y2g9dm9pZCAwLHQuT0F1dGgyRmV0Y2g9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy50b2tlbj1udWxsLHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49bnVsbCx0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbCx0aGlzLnJlZnJlc2hUaW1lcj1udWxsLHZvaWQgMD09PShudWxsPT1lP3ZvaWQgMDplLnNjaGVkdWxlUmVmcmVzaCkmJihlLnNjaGVkdWxlUmVmcmVzaD0hMCksdGhpcy5vcHRpb25zPWUsZS5nZXRTdG9yZWRUb2tlbiYmKHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49KGFzeW5jKCk9Pnt0aGlzLnRva2VuPWF3YWl0IGUuZ2V0U3RvcmVkVG9rZW4oKSx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGx9KSgpKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpfWFzeW5jIGZldGNoKGUsdCl7Y29uc3Qgcj1uZXcgUmVxdWVzdChlLHQpO3JldHVybiB0aGlzLm13KCkociwoZT0+ZmV0Y2goZSkpKX1tdygpe3JldHVybiBhc3luYyhlLHQpPT57Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7bGV0IG49ZS5jbG9uZSgpO24uaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsXCJCZWFyZXIgXCIrcik7bGV0IGk9YXdhaXQgdChuKTtpZighaS5vayYmNDAxPT09aS5zdGF0dXMpe2NvbnN0IHI9YXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtuPWUuY2xvbmUoKSxuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IuYWNjZXNzVG9rZW4pLGk9YXdhaXQgdChuKX1yZXR1cm4gaX19YXN5bmMgZ2V0VG9rZW4oKXtyZXR1cm4gdGhpcy50b2tlbiYmKG51bGw9PT10aGlzLnRva2VuLmV4cGlyZXNBdHx8dGhpcy50b2tlbi5leHBpcmVzQXQ+RGF0ZS5ub3coKSk/dGhpcy50b2tlbjp0aGlzLnJlZnJlc2hUb2tlbigpfWFzeW5jIGdldEFjY2Vzc1Rva2VuKCl7cmV0dXJuIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4sKGF3YWl0IHRoaXMuZ2V0VG9rZW4oKSkuYWNjZXNzVG9rZW59YXN5bmMgcmVmcmVzaFRva2VuKCl7dmFyIGUsdDtpZih0aGlzLmFjdGl2ZVJlZnJlc2gpcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtjb25zdCByPXRoaXMudG9rZW47dGhpcy5hY3RpdmVSZWZyZXNoPShhc3luYygpPT57dmFyIGUsdDtsZXQgbj1udWxsO3RyeXsobnVsbD09cj92b2lkIDA6ci5yZWZyZXNoVG9rZW4pJiYobj1hd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihyKSl9Y2F0Y2goZSl7Y29uc29sZS53YXJuKFwiW29hdXRoMl0gcmVmcmVzaCB0b2tlbiBub3QgYWNjZXB0ZWQsIHdlJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nXCIpfWlmKG58fChuPWF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpKSwhbil7Y29uc3Qgcj1uZXcgRXJyb3IoXCJVbmFibGUgdG8gb2J0YWluIE9BdXRoMiB0b2tlbnMsIGEgZnVsbCByZWF1dGggbWF5IGJlIG5lZWRlZFwiKTt0aHJvdyBudWxsPT09KHQ9KGU9dGhpcy5vcHRpb25zKS5vbkVycm9yKXx8dm9pZCAwPT09dHx8dC5jYWxsKGUscikscn1yZXR1cm4gbn0pKCk7dHJ5e2NvbnN0IHI9YXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO3JldHVybiB0aGlzLnRva2VuPXIsbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykuc3RvcmVUb2tlbil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHRoaXMuc2NoZWR1bGVSZWZyZXNoKCkscn1jYXRjaChlKXt0aHJvdyB0aGlzLm9wdGlvbnMub25FcnJvciYmdGhpcy5vcHRpb25zLm9uRXJyb3IoZSksZX1maW5hbGx5e3RoaXMuYWN0aXZlUmVmcmVzaD1udWxsfX1zY2hlZHVsZVJlZnJlc2goKXt2YXIgZTtpZighdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaClyZXR1cm47aWYodGhpcy5yZWZyZXNoVGltZXImJihjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpLHRoaXMucmVmcmVzaFRpbWVyPW51bGwpLCEobnVsbD09PShlPXRoaXMudG9rZW4pfHx2b2lkIDA9PT1lP3ZvaWQgMDplLmV4cGlyZXNBdCl8fCF0aGlzLnRva2VuLnJlZnJlc2hUb2tlbilyZXR1cm47Y29uc3QgdD10aGlzLnRva2VuLmV4cGlyZXNBdC1EYXRlLm5vdygpO3Q8MTJlNHx8KHRoaXMucmVmcmVzaFRpbWVyPXNldFRpbWVvdXQoKGFzeW5jKCk9Pnt0cnl7YXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKX1jYXRjaChlKXtjb25zb2xlLmVycm9yKFwiW2ZldGNoLW13LW9hdXRoMl0gZXJyb3Igd2hpbGUgZG9pbmcgYSBiYWNrZ3JvdW5kIE9BdXRoMiBhdXRvLXJlZnJlc2hcIixlKX19KSx0LTZlNCkpfX19LDIxMjooKT0+e319LHQ9e307ZnVuY3Rpb24gcihuKXt2YXIgaT10W25dO2lmKHZvaWQgMCE9PWkpcmV0dXJuIGkuZXhwb3J0czt2YXIgbz10W25dPXtleHBvcnRzOnt9fTtyZXR1cm4gZVtuXShvLG8uZXhwb3J0cyxyKSxvLmV4cG9ydHN9dmFyIG49e307cmV0dXJuKCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9bjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLk9BdXRoMkVycm9yPWUuT0F1dGgyRmV0Y2g9ZS5nZW5lcmF0ZUNvZGVWZXJpZmllcj1lLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PWUuT0F1dGgyQ2xpZW50PXZvaWQgMDt2YXIgdD1yKDkzNCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJDbGllbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdC5PQXV0aDJDbGllbnR9fSk7dmFyIGk9cig2MTgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImdlbmVyYXRlQ29kZVZlcmlmaWVyXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuZ2VuZXJhdGVDb2RlVmVyaWZpZXJ9fSk7dmFyIG89cigxMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJGZXRjaFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBvLk9BdXRoMkZldGNofX0pO3ZhciBzPXIoNDQzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkVycm9yXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHMuT0F1dGgyRXJyb3J9fSl9KSgpLG59KSgpKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9hdXRoMi1jbGllbnQubWluLmpzLm1hcCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyA8YXV0by1nZW5lcmF0ZWQ+XHJcbi8vICAgICBHZW5lcmF0ZWQgdXNpbmcgdGhlIE5Td2FnIHRvb2xjaGFpbiB2MTMuMjAuMC4wIChOSnNvblNjaGVtYSB2MTAuOS4wLjAgKE5ld3RvbnNvZnQuSnNvbiB2MTMuMC4wLjApKSAoaHR0cDovL05Td2FnLm9yZylcclxuLy8gPC9hdXRvLWdlbmVyYXRlZD5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4vLyBSZVNoYXJwZXIgZGlzYWJsZSBJbmNvbnNpc3RlbnROYW1pbmdcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnQge1xyXG4gICAgcHJpdmF0ZSBodHRwOiB7IGZldGNoKHVybDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IH07XHJcbiAgICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBqc29uUGFyc2VSZXZpdmVyOiAoKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnkpIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmw/OiBzdHJpbmcsIGh0dHA/OiB7IGZldGNoKHVybDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IH0pIHtcclxuICAgICAgICB0aGlzLmh0dHAgPSBodHRwID8gaHR0cCA6IHdpbmRvdyBhcyBhbnk7XHJcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybCAhPT0gdW5kZWZpbmVkICYmIGJhc2VVcmwgIT09IG51bGwgPyBiYXNlVXJsIDogXCIvYXBpL2ViYXkvdjFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3QgYWxsIHByb2R1Y3RzXHJcbiAgICAgKiBAcmV0dXJuIE9LXHJcbiAgICAgKi9cclxuICAgIGdldEFsbFByb2R1Y3RzKCk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldEFsbFByb2R1Y3RzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRBbGxQcm9kdWN0cyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKFByb2R1Y3RXaXRoSWQuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPFByb2R1Y3RXaXRoSWRbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzQ3JlYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ3JlYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSByZXN1bHREYXRhMjAwICE9PSB1bmRlZmluZWQgPyByZXN1bHREYXRhMjAwIDogPGFueT5udWxsO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxzdHJpbmc+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9XCI7XHJcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQgfHwgaWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2lkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7aWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgaWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1VwZGF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1VwZGF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVsZXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gRGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9kdWN0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRGVsZXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzRGVsZXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFya1Byb2R1Y3RBc0NoZWNrZWRcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICBtYXJrUHJvZHVjdEFzQ2hlY2tlZChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9L21hcmtfYXNfY2hlY2tlZC9cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc01hcmtQcm9kdWN0QXNDaGVja2VkKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NNYXJrUHJvZHVjdEFzQ2hlY2tlZChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIHVwc2VydExvdEluZm8obG90SW5mbzogTG90SW5mbywgcHJvZHVjdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3twcm9kdWN0SWR9L2xvdHMvXCI7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkIHx8IHByb2R1Y3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAncHJvZHVjdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7cHJvZHVjdElkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIHByb2R1Y3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkobG90SW5mbyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Vwc2VydExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1Vwc2VydExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9C40YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQu9C+0YLQtVxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRMb3RJbmZvKGxvdElkOiBudW1iZXIpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3RzL3tsb3RJZH0vXCI7XHJcbiAgICAgICAgaWYgKGxvdElkID09PSB1bmRlZmluZWQgfHwgbG90SWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2xvdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7bG90SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgbG90SWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RJbmZvKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RJbmZvKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQyMDAgPSBMb3RJbmZvV2l0aFByb2R1Y3RJZC5mcm9tSlMocmVzdWx0RGF0YTIwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90SW5mb1dpdGhQcm9kdWN0SWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YPRh9GC0LXQvdC90YvRhSDQu9C+0YLQsNGFXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdFN0YXRlcyhsb3RJZHM6IG51bWJlcltdKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3Rfc3RhdGVfcmVxdWVzdHMvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJZHMpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0TG90U3RhdGVzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RTdGF0ZXMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTG90U3RhdGUuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPExvdFN0YXRlW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDQv9C10YDQtdGH0LXQvdGMINCy0L7Qt9C80L7QttC90YvRhSDRgdC+0YHRgtC+0Y/QvdC40Lkg0L/RgNC+0LTQsNCy0LDQtdC80L7Qs9C+INGC0L7QstCw0YDQsFxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRNYW51YWxDb25kaXRpb25zTGlzdCgpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9tYW51YWxfY29uZGl0aW9ucy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0TWFudWFsQ29uZGl0aW9uc0xpc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxNYW51YWxDb25kaXRpb25bXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKE1hbnVhbENvbmRpdGlvbi5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TWFudWFsQ29uZGl0aW9uW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0U2hpcHBpbmdSYXRlcygpOiBQcm9taXNlPFNoaXBwaW5nVHlwZVtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9zaGlwcGluZ19yYXRlcy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRTaGlwcGluZ1JhdGVzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRTaGlwcGluZ1JhdGVzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8U2hpcHBpbmdUeXBlW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChTaGlwcGluZ1R5cGUuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPFNoaXBwaW5nVHlwZVtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldEN1cnJlbmNpZXMoKTogUHJvbWlzZTxDdXJyZW5jeVtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9jdXJyZW5jaWVzL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldEN1cnJlbmNpZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldEN1cnJlbmNpZXMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxDdXJyZW5jeVtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goQ3VycmVuY3kuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPEN1cnJlbmN5W10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNhdmUgRXJyb3JcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgc2F2ZUVycm9yKGVycm9yOiBDbGllbnRFcnJvckluZm8pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2Vycm9yL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NTYXZlRXJyb3IoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1NhdmVFcnJvcihyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhvdXRJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzITogU2VhcmNoUXVlcnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRob3V0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIk5hbWVcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyEucHVzaChTZWFyY2hRdWVyeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRob3V0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlYXJjaFF1ZXJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5zZWFyY2hRdWVyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcmllczogU2VhcmNoUXVlcnlbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRoSWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBsYXN0Q2hlY2tUaW1lPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VhcmNoUXVlcmllcyE6IFNlYXJjaFF1ZXJ5W107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiSWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0Q2hlY2tUaW1lID0gX2RhdGFbXCJMYXN0Q2hlY2tUaW1lXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMhLnB1c2goU2VhcmNoUXVlcnkuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2R1Y3RXaXRoSWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQcm9kdWN0V2l0aElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIklkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wiTGFzdENoZWNrVGltZVwiXSA9IHRoaXMubGFzdENoZWNrVGltZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlYXJjaFF1ZXJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5zZWFyY2hRdWVyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGxhc3RDaGVja1RpbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWFyY2hRdWVyaWVzOiBTZWFyY2hRdWVyeVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoUXVlcnkgaW1wbGVtZW50cyBJU2VhcmNoUXVlcnkge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBxdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVNlYXJjaFF1ZXJ5KSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcImlkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXJ5ID0gX2RhdGFbXCJxdWVyeVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBTZWFyY2hRdWVyeSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNlYXJjaFF1ZXJ5KCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wicXVlcnlcIl0gPSB0aGlzLnF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTZWFyY2hRdWVyeSB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgcXVlcnk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdEluZm9XaXRoUHJvZHVjdElkIGltcGxlbWVudHMgSUxvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgIHByb2R1Y3RJZCE6IHN0cmluZztcclxuICAgIGxvdEluZm8hOiBMb3RJbmZvO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90SW5mb1dpdGhQcm9kdWN0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdEluZm8gPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdElkID0gX2RhdGFbXCJwcm9kdWN0SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG90SW5mbyA9IF9kYXRhW1wibG90SW5mb1wiXSA/IExvdEluZm8uZnJvbUpTKF9kYXRhW1wibG90SW5mb1wiXSkgOiBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mb1dpdGhQcm9kdWN0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wicHJvZHVjdElkXCJdID0gdGhpcy5wcm9kdWN0SWQ7XHJcbiAgICAgICAgZGF0YVtcImxvdEluZm9cIl0gPSB0aGlzLmxvdEluZm8gPyB0aGlzLmxvdEluZm8udG9KU09OKCkgOiA8YW55PnVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgcHJvZHVjdElkOiBzdHJpbmc7XHJcbiAgICBsb3RJbmZvOiBMb3RJbmZvO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mbyBpbXBsZW1lbnRzIElMb3RJbmZvIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHBjcyE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nQ291bnRyeSE6IHN0cmluZztcclxuICAgIGN1cnJlbmN5ITogc3RyaW5nO1xyXG4gICAgcHJpY2UhOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uITogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uRGVzY3JpcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWxsZXIhOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW4hOiBzdHJpbmc7XHJcbiAgICBpZ25vcmVUaGF0TG90ITogYm9vbGVhbjtcclxuICAgIG1hbnVhbENvbmRpdGlvbklkITogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5ITogUHVyY2hhc2VJbmZvW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnBjcyA9IF9kYXRhW1wicGNzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQ291bnRyeSA9IF9kYXRhW1wic2hpcHBpbmdDb3VudHJ5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbmN5ID0gX2RhdGFbXCJjdXJyZW5jeVwiXTtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmcgPSBfZGF0YVtcInNoaXBwaW5nXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbCA9IF9kYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24gPSBfZGF0YVtcImNvbmRpdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsbGVyID0gX2RhdGFbXCJzZWxsZXJcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRlZEluID0gX2RhdGFbXCJsb2NhdGVkSW5cIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5tYW51YWxDb25kaXRpb25JZCA9IF9kYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5IS5wdXNoKFB1cmNoYXNlSW5mby5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJuYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJwY3NcIl0gPSB0aGlzLnBjcztcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdDb3VudHJ5XCJdID0gdGhpcy5zaGlwcGluZ0NvdW50cnk7XHJcbiAgICAgICAgZGF0YVtcImN1cnJlbmN5XCJdID0gdGhpcy5jdXJyZW5jeTtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ1wiXSA9IHRoaXMuc2hpcHBpbmc7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXSA9IHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcInNlbGxlclwiXSA9IHRoaXMuc2VsbGVyO1xyXG4gICAgICAgIGRhdGFbXCJsb2NhdGVkSW5cIl0gPSB0aGlzLmxvY2F0ZWRJbjtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB0aGlzLm1hbnVhbENvbmRpdGlvbklkO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHVyY2hhc2VIaXN0b3J5KSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5wdXJjaGFzZUhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwY3M6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nQ291bnRyeTogc3RyaW5nO1xyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW46IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBtYW51YWxDb25kaXRpb25JZDogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5OiBQdXJjaGFzZUluZm9bXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFB1cmNoYXNlSW5mbyBpbXBsZW1lbnRzIElQdXJjaGFzZUluZm8ge1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWFudGl0eSE6IG51bWJlcjtcclxuICAgIGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQdXJjaGFzZUluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHkgPSBfZGF0YVtcInF1YW50aXR5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGUgPSBfZGF0YVtcImRhdGVcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHVyY2hhc2VJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHVyY2hhc2VJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wicXVhbnRpdHlcIl0gPSB0aGlzLnF1YW50aXR5O1xyXG4gICAgICAgIGRhdGFbXCJkYXRlXCJdID0gdGhpcy5kYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQdXJjaGFzZUluZm8ge1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWFudWFsQ29uZGl0aW9uIGltcGxlbWVudHMgSU1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTWFudWFsQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcImlkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBNYW51YWxDb25kaXRpb24ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYW51YWxDb25kaXRpb24oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiaWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdFN0YXRlIGltcGxlbWVudHMgSUxvdFN0YXRlIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgaWdub3JlVGhhdExvdCE6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90U3RhdGUpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJZCA9IF9kYXRhW1wibG90SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gX2RhdGFbXCJsYXN0VXBkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdFN0YXRlIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90U3RhdGUoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJpZ25vcmVUaGF0TG90XCJdID0gdGhpcy5pZ25vcmVUaGF0TG90O1xyXG4gICAgICAgIGRhdGFbXCJsYXN0VXBkYXRlXCJdID0gdGhpcy5sYXN0VXBkYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgaWdub3JlVGhhdExvdDogYm9vbGVhbjtcclxuICAgIGxhc3RVcGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudEVycm9ySW5mbyBpbXBsZW1lbnRzIElDbGllbnRFcnJvckluZm8ge1xyXG4gICAgdXJsITogc3RyaW5nO1xyXG4gICAgZXJyb3IhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElDbGllbnRFcnJvckluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy51cmwgPSBfZGF0YVtcInVybFwiXTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IF9kYXRhW1wiZXJyb3JcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogQ2xpZW50RXJyb3JJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgQ2xpZW50RXJyb3JJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInVybFwiXSA9IHRoaXMudXJsO1xyXG4gICAgICAgIGRhdGFbXCJlcnJvclwiXSA9IHRoaXMuZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNsaWVudEVycm9ySW5mbyB7XHJcbiAgICB1cmw6IHN0cmluZztcclxuICAgIGVycm9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTaGlwcGluZ1R5cGUgaW1wbGVtZW50cyBJU2hpcHBpbmdUeXBlIHtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBjdXJyZW5jeSE6IHN0cmluZztcclxuICAgIHJhdGVzITogU2hpcHBpbmdSYXRlc1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJU2hpcHBpbmdUeXBlKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5yYXRlcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wibmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW5jeSA9IF9kYXRhW1wiY3VycmVuY3lcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wicmF0ZXNcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhdGVzID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcInJhdGVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmF0ZXMhLnB1c2goU2hpcHBpbmdSYXRlcy5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogU2hpcHBpbmdUeXBlIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2hpcHBpbmdUeXBlKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIm5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgZGF0YVtcImN1cnJlbmN5XCJdID0gdGhpcy5jdXJyZW5jeTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnJhdGVzKSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicmF0ZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnJhdGVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInJhdGVzXCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTaGlwcGluZ1R5cGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIHJhdGVzOiBTaGlwcGluZ1JhdGVzW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTaGlwcGluZ1JhdGVzIGltcGxlbWVudHMgSVNoaXBwaW5nUmF0ZXMge1xyXG4gICAgc3BlY2lmaWVkQ291bnRyaWVzPzogc3RyaW5nW10gfCB1bmRlZmluZWQ7XHJcbiAgICByYXRlcyE6IFNoaXBwaW5nUmF0ZVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJU2hpcHBpbmdSYXRlcykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmF0ZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcInNwZWNpZmllZENvdW50cmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BlY2lmaWVkQ291bnRyaWVzID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcInNwZWNpZmllZENvdW50cmllc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWNpZmllZENvdW50cmllcyEucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcInJhdGVzXCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJyYXRlc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhdGVzIS5wdXNoKFNoaXBwaW5nUmF0ZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogU2hpcHBpbmdSYXRlcyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNoaXBwaW5nUmF0ZXMoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNwZWNpZmllZENvdW50cmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcInNwZWNpZmllZENvdW50cmllc1wiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuc3BlY2lmaWVkQ291bnRyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInNwZWNpZmllZENvdW50cmllc1wiXS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnJhdGVzKSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicmF0ZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnJhdGVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInJhdGVzXCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTaGlwcGluZ1JhdGVzIHtcclxuICAgIHNwZWNpZmllZENvdW50cmllcz86IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xyXG4gICAgcmF0ZXM6IFNoaXBwaW5nUmF0ZVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2hpcHBpbmdSYXRlIGltcGxlbWVudHMgSVNoaXBwaW5nUmF0ZSB7XHJcbiAgICBtaW5XZWlnaHQhOiBudW1iZXI7XHJcbiAgICBtYXhXZWlnaHQhOiBudW1iZXI7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVNoaXBwaW5nUmF0ZSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm1pbldlaWdodCA9IF9kYXRhW1wibWluV2VpZ2h0XCJdO1xyXG4gICAgICAgICAgICB0aGlzLm1heFdlaWdodCA9IF9kYXRhW1wibWF4V2VpZ2h0XCJdO1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBTaGlwcGluZ1JhdGUge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBTaGlwcGluZ1JhdGUoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibWluV2VpZ2h0XCJdID0gdGhpcy5taW5XZWlnaHQ7XHJcbiAgICAgICAgZGF0YVtcIm1heFdlaWdodFwiXSA9IHRoaXMubWF4V2VpZ2h0O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNoaXBwaW5nUmF0ZSB7XHJcbiAgICBtaW5XZWlnaHQ6IG51bWJlcjtcclxuICAgIG1heFdlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJyZW5jeSBpbXBsZW1lbnRzIElDdXJyZW5jeSB7XHJcbiAgICBlYmF5TmFtZSE6IHN0cmluZztcclxuICAgIHJ1c05hbWUhOiBzdHJpbmc7XHJcbiAgICByYXRlITogbnVtYmVyO1xyXG4gICAgbGFzdFVwZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUN1cnJlbmN5KSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWJheU5hbWUgPSBfZGF0YVtcImViYXlOYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnJ1c05hbWUgPSBfZGF0YVtcInJ1c05hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucmF0ZSA9IF9kYXRhW1wicmF0ZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gX2RhdGFbXCJsYXN0VXBkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEN1cnJlbmN5IHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgQ3VycmVuY3koKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZWJheU5hbWVcIl0gPSB0aGlzLmViYXlOYW1lO1xyXG4gICAgICAgIGRhdGFbXCJydXNOYW1lXCJdID0gdGhpcy5ydXNOYW1lO1xyXG4gICAgICAgIGRhdGFbXCJyYXRlXCJdID0gdGhpcy5yYXRlO1xyXG4gICAgICAgIGRhdGFbXCJsYXN0VXBkYXRlXCJdID0gdGhpcy5sYXN0VXBkYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXJyZW5jeSB7XHJcbiAgICBlYmF5TmFtZTogc3RyaW5nO1xyXG4gICAgcnVzTmFtZTogc3RyaW5nO1xyXG4gICAgcmF0ZTogbnVtYmVyO1xyXG4gICAgbGFzdFVwZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBfZGF0YVtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSBfZGF0YVtcInRpdGxlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IF9kYXRhW1wic3RhdHVzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRldGFpbCA9IF9kYXRhW1wiZGV0YWlsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gX2RhdGFbXCJpbnN0YW5jZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhYnN0cmFjdCBjbGFzcyAnUHJvYmxlbURldGFpbGVkSW5mbycgY2Fubm90IGJlIGluc3RhbnRpYXRlZC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJ0eXBlXCJdID0gdGhpcy50eXBlO1xyXG4gICAgICAgIGRhdGFbXCJ0aXRsZVwiXSA9IHRoaXMudGl0bGU7XHJcbiAgICAgICAgZGF0YVtcInN0YXR1c1wiXSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgIGRhdGFbXCJkZXRhaWxcIl0gPSB0aGlzLmRldGFpbDtcclxuICAgICAgICBkYXRhW1wiaW5zdGFuY2VcIl0gPSB0aGlzLmluc3RhbmNlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICB0aXRsZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHN0YXR1cz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRldGFpbD86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgUHJvYmxlbURldGFpbGVkSW5mbyBpbXBsZW1lbnRzIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMyIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJlcnJvcnNcIl0gPSB0aGlzLmVycm9ycztcclxuICAgICAgICBzdXBlci50b0pTT04oZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzMiB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9ycyBpbXBsZW1lbnRzIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9ycykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9ycyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9ycygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3JzMiBpbXBsZW1lbnRzIElFcnJvcnMyIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMyKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2RhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gX2RhdGFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogRXJyb3JzMiB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEVycm9yczIoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMyIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBzdGF0dXM6IG51bWJlcjtcclxuICAgIHJlc3BvbnNlOiBzdHJpbmc7XHJcbiAgICBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfTtcclxuICAgIHJlc3VsdDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGlzQXBpRXhjZXB0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBzdGF0aWMgaXNBcGlFeGNlcHRpb24ob2JqOiBhbnkpOiBvYmogaXMgQXBpRXhjZXB0aW9uIHtcclxuICAgICAgICByZXR1cm4gb2JqLmlzQXBpRXhjZXB0aW9uID09PSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aHJvd0V4Y2VwdGlvbihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0PzogYW55KTogYW55IHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhyb3cgcmVzdWx0O1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRocm93IG5ldyBBcGlFeGNlcHRpb24obWVzc2FnZSwgc3RhdHVzLCByZXNwb25zZSwgaGVhZGVycywgbnVsbCk7XHJcbn0iLCJpbXBvcnQge09BdXRoMkNsaWVudCwgT0F1dGgyVG9rZW59IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5cclxuXHJcbnR5cGUgT0F1dGgyRmV0Y2hPcHRpb25zID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXJlbmNlIHRvIE9BdXRoMiBjbGllbnQuXHJcbiAgICAgKi9cclxuICAgIGNsaWVudDogT0F1dGgyQ2xpZW50O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogWW91IGFyZSByZXNwb25zaWJsZSBmb3IgaW1wbGVtZW50aW5nIHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgKiBpdCdzIHB1cnBvc2UgaXMgdG8gc3VwcGx5IHRoZSAnaW5pdGlhbCcgb2F1dGgyIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gYG51bGxgIHRvIGZhaWwgdGhlIHByb2Nlc3MuXHJcbiAgICAgKi9cclxuICAgIGdldE5ld1Rva2VuKCk6IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHNldCwgd2lsbCBiZSBjYWxsZWQgaWYgYXV0aGVudGljYXRpb24gZmF0YWxseSBmYWlsZWQuXHJcbiAgICAgKi9cclxuICAgIG9uRXJyb3I/OiAoZXJyOiBFcnJvcikgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBhY3RpdmUgdG9rZW4gY2hhbmdlcy4gVXNpbmcgdGhpcyBpc1xyXG4gICAgICogb3B0aW9uYWwsIGJ1dCBpdCBtYXkgYmUgdXNlZCB0byAoZm9yIGV4YW1wbGUpIHB1dCB0aGUgdG9rZW4gaW4gb2ZmLWxpbmVcclxuICAgICAqIHN0b3JhZ2UgZm9yIGxhdGVyIHVzYWdlLlxyXG4gICAgICovXHJcbiAgICBzdG9yZVRva2VuPzogKHRva2VuOiBPQXV0aDJUb2tlbikgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsc28gYW4gb3B0aW9uYWwgZmVhdHVyZS4gSW1wbGVtZW50IHRoaXMgaWYgeW91IHdhbnQgdGhlIHdyYXBwZXIgdG8gdHJ5IGFcclxuICAgICAqIHN0b3JlZCB0b2tlbiBiZWZvcmUgYXR0ZW1wdGluZyBhIGZ1bGwgcmUtYXV0aGVudGljYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBudWxsIGlmIHRoZXJlIHdhcyBubyB0b2tlbi5cclxuICAgICAqL1xyXG4gICAgZ2V0U3RvcmVkVG9rZW4/OiAoKSA9PiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgc2NoZWR1bGUgdG9rZW4gcmVmcmVzaC5cclxuICAgICAqXHJcbiAgICAgKiBDZXJ0YWluIGV4ZWN1dGlvbiBlbnZpcm9ubWVudHMsIGUuZy4gUmVhY3QgTmF0aXZlLCBkbyBub3QgaGFuZGxlIHNjaGVkdWxlZFxyXG4gICAgICogdGFza3Mgd2l0aCBzZXRUaW1lb3V0KCkgaW4gYSBncmFjZWZ1bCBvciBwcmVkaWN0YWJsZSBmYXNoaW9uLiBUaGUgZGVmYXVsdFxyXG4gICAgICogYmVoYXZpb3IgaXMgdG8gc2NoZWR1bGUgcmVmcmVzaC4gU2V0IHRoaXMgdG8gZmFsc2UgdG8gZGlzYWJsZSBzY2hlZHVsaW5nLlxyXG4gICAgICovXHJcbiAgICBzY2hlZHVsZVJlZnJlc2g/OiBib29sZWFuO1xyXG5cclxuICAgIGZldGNoPzogdHlwZW9mIGZldGNoO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuXHJcbiAgICBwcml2YXRlIG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEN1cnJlbnQgYWN0aXZlIHRva2VuIChpZiBhbnkpXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdG9rZW46IE9BdXRoMlRva2VuIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgdXNlciBoYWQgYSBzdG9yZWRUb2tlbiwgdGhlIHByb2Nlc3MgdG8gZmV0Y2ggaXRcclxuICAgICAqIG1heSBiZSBhc3luYy4gV2Uga2VlcCB0cmFjayBvZiB0aGlzIHByb2Nlc3MgaW4gdGhpc1xyXG4gICAgICogcHJvbWlzZSwgc28gaXQgbWF5IGJlIGF3YWl0ZWQgdG8gYXZvaWQgcmFjZSBjb25kaXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEFzIHNvb24gYXMgdGhpcyBwcm9taXNlIHJlc29sdmVzLCB0aGlzIHByb3BlcnR5IGdldCBudWxsZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlR2V0U3RvcmVkVG9rZW46IG51bGwgfCBQcm9taXNlPHZvaWQ+ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnM/LnNjaGVkdWxlUmVmcmVzaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBpZiAob3B0aW9ucy5nZXRTdG9yZWRUb2tlbikge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBhd2FpdCBvcHRpb25zLmdldFN0b3JlZFRva2VuISgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVSZWZyZXNoKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG9lcyBhIGZldGNoIHJlcXVlc3QgYW5kIGFkZHMgYSBCZWFyZXIgLyBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBub3Qga25vd24sIHRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gZmV0Y2ggaXRcclxuICAgICAqIGZpcnN0LiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGFsbW9zdCBleHBpcmluZywgdGhpcyBmdW5jdGlvbiBtaWdodCBhdHRlbXB0XHJcbiAgICAgKiB0byByZWZyZXNoIGl0LlxyXG4gICAgICovXHJcbiAgICBhc3luYyBmZXRjaChpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7XHJcblxyXG4gICAgICAgIGlmIChpbml0LmhlYWRlcnMpIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyBhY2Nlc3NUb2tlblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVycyA9IHtBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyBhY2Nlc3NUb2tlbn1cclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3B0aW9ucy5mZXRjaChpbnB1dCwgaW5pdCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUb2tlbiA9IGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyBuZXdUb2tlblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3B0aW9ucy5mZXRjaChpbnB1dCwgaW5pdClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgY3VycmVudCB0b2tlbiBpbmZvcm1hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGVyZSByZXN1bHQgb2JqZWN0IHdpbGwgaGF2ZTpcclxuICAgICAqICAgKiBhY2Nlc3NUb2tlblxyXG4gICAgICogICAqIGV4cGlyZXNBdCAtIHdoZW4gdGhlIHRva2VuIGV4cGlyZXMsIG9yIG51bGwuXHJcbiAgICAgKiAgICogcmVmcmVzaFRva2VuIC0gbWF5IGJlIG51bGxcclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYXR0ZW1wdCB0byBhdXRvbWF0aWNhbGx5IHJlZnJlc2ggaWYgc3RhbGUuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4gJiYgKHRoaXMudG9rZW4uZXhwaXJlc0F0ID09PSBudWxsIHx8IHRoaXMudG9rZW4uZXhwaXJlc0F0ID4gRGF0ZS5ub3coKSkpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IHRva2VuIGlzIHN0aWxsIHZhbGlkXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBjdXJyZW50IGFjY2VzcyB0b2tlbiBpcyBub3Qga25vd24sIGl0IHdpbGwgYXR0ZW1wdCB0byBmZXRjaCBpdC5cclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgZXhwaXJpbmcsIGl0IHdpbGwgYXR0ZW1wdCB0byByZWZyZXNoIGl0LlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRBY2Nlc3NUb2tlbigpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cclxuICAgICAgICAvLyBFbnN1cmUgZ2V0U3RvcmVkVG9rZW4gZmluaXNoZWQuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbjtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdldFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuLmFjY2Vzc1Rva2VuO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEtlZXBpbmcgdHJhY2sgb2YgYW4gYWN0aXZlIHJlZnJlc2hUb2tlbiBvcGVyYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyB3aWxsIGFsbG93IHVzIHRvIGVuc3VyZSBvbmx5IDEgc3VjaCBvcGVyYXRpb24gaGFwcGVucyBhdCBhbnlcclxuICAgICAqIGdpdmVuIHRpbWUuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlUmVmcmVzaDogUHJvbWlzZTxPQXV0aDJUb2tlbj4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvcmNlcyBhbiBhY2Nlc3MgdG9rZW4gcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBhc3luYyByZWZyZXNoVG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBjdXJyZW50bHkgYWxyZWFkeSBkb2luZyB0aGlzIG9wZXJhdGlvbixcclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGRvbid0IGRvIGl0IHR3aWNlIGluIHBhcmFsbGVsLlxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb2xkVG9rZW4gPSB0aGlzLnRva2VuO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IChhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3VG9rZW46IE9BdXRoMlRva2VuIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFRva2VuPy5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYWQgYSByZWZyZXNoIHRva2VuLCBsZXRzIHNlZSBpZiB3ZSBjYW4gdXNlIGl0IVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ob2xkVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignW29hdXRoMl0gcmVmcmVzaCB0b2tlbiBub3QgYWNjZXB0ZWQsIHdlXFwnbGwgdHJ5IHJlYXV0aGVudGljYXRpbmcnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdVbmFibGUgdG8gb2J0YWluIE9BdXRoMiB0b2tlbnMsIGEgZnVsbCByZWF1dGggbWF5IGJlIG5lZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3I/LihlcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdUb2tlbjtcclxuXHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnN0b3JlVG9rZW4/Lih0b2tlbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVSZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjbGVhciB0aGUgY3VycmVudCByZWZyZXNoIG9wZXJhdGlvbi5cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGltZXIgdHJpZ2dlciBmb3IgdGhlIG5leHQgYXV0b21hdGVkIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBzY2hlZHVsZVJlZnJlc2goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlZnJlc2hUaW1lcik7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b2tlbj8uZXhwaXJlc0F0IHx8ICF0aGlzLnRva2VuLnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBkb24ndCBrbm93IHdoZW4gdGhlIHRva2VuIGV4cGlyZXMsIG9yIGRvbid0IGhhdmUgYSByZWZyZXNoX3Rva2VuLCBkb24ndCBib3RoZXIuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHRoaXMudG9rZW4uZXhwaXJlc0F0IC0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgLy8gV2Ugb25seSBzY2hlZHVsZSB0aGlzIGV2ZW50IGlmIGl0IGhhcHBlbnMgbW9yZSB0aGFuIDIgbWludXRlcyBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIGlmIChleHBpcmVzSW4gPCAxMjAgKiAxMDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNjaGVkdWxlIDEgbWludXRlIGJlZm9yZSBleHBpcnlcclxuICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2ZldGNoLW13LW9hdXRoMl0gZXJyb3Igd2hpbGUgZG9pbmcgYSBiYWNrZ3JvdW5kIE9BdXRoMiBhdXRvLXJlZnJlc2gnLCBlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZXhwaXJlc0luIC0gNjAgKiAxMDAwKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgICBDbGllbnQsIENsaWVudEVycm9ySW5mbyxcclxuICAgIExvdEluZm8sXHJcbiAgICBMb3RJbmZvV2l0aFByb2R1Y3RJZCwgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLFxyXG4gICAgUHVyY2hhc2VJbmZvLCBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mb1xyXG59IGZyb20gXCIuL0ViYXlDbGllbnQvRWJheUNsaWVudFwiXHJcblxyXG5pbXBvcnQge2dlbmVyYXRlQ29kZVZlcmlmaWVyLCBPQXV0aDJDbGllbnR9IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5pbXBvcnQge0ZldGNoV3JhcHBlckN1c3RvbX0gZnJvbSBcIi4vRmV0Y2hXcmFwcGVyQ3VzdG9tXCI7XHJcblxyXG5jb25zdCBpZ25vcmVUaGF0TG90RmllbGROYW1lID0gXCJpZ25vcmVUaGF0TG90XCI7XHJcbmNvbnN0IG1hbnVhbENvbmRpdGlvbklkRmllbGROYW1lID0gXCJtYW51YWxDb25kaXRpb25JZFwiO1xyXG5jb25zdCBwcm9kdWN0RmllbGROYW1lID0gXCJwcm9kdWN0SWRcIjtcclxuY29uc3QgcGNzRmllbGROYW1lID0gXCJwY3NcIjtcclxuXHJcbmNvbnN0IHBhbmVsQ2xhc3MgPSBcInBhbmVsLWRpdlwiO1xyXG5jb25zdCBmb3JtSWQgPSBcInByb2R1Y3QtZm9ybS1pZFwiXHJcbmNvbnN0IGVycm9yRWxlbWVudElkID0gXCJlcnJvckVsZW1lbnRcIlxyXG5jb25zdCBzdWJtaXRJZCA9IFwic3VibWl0XCJcclxuLy9jb25zdCBiYWNrZW5kVXJsID0gXCJodHRwczovL2xvY2FsaG9zdDo3MDk1L1wiXHJcbmNvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vMTc4LjIwOC42NS4xMDA6MTc0NDMvXCJcclxuY29uc3QgYmFzZUFwaVVybCA9IGAke2JhY2tlbmRVcmx9YXBpL2ViYXkvdjFgO1xyXG5jb25zdCBhdXRoUmVkaXJlY3RVcmwgPSBcImh0dHBzOi8vd3d3LmViYXkuY29tL1wiXHJcbmNvbnN0IG5vdFNldFZhbHVlID0gXCJub3RTZXRcIlxyXG5jb25zdCBsaWdodEdyZWVuQ29sb3IgPSBcIiNlY2ZmZWNcIlxyXG5jb25zdCBsaWdodFBpbmtDb2xvciA9IFwibGlnaHRwaW5rXCJcclxuY29uc3QgbGlnaHRZZWxsb3dDb2xvciA9IFwiI2UwZTA3ZlwiXHJcblxyXG5jb25zdCBzdXBwb3J0ZWRFdXJvcGVDb3VudHJpZXMgPSBuZXcgU2V0KFsnR2VybWFueScsICdJdGFseScsICdGcmFuY2UnLCAnVW5pdGVkIEtpbmdkb20nXSlcclxuY29uc3Qgc3VwcG9ydGVkU2hpcHBpbmdDb3VudHJpZXMgPSBbJ0dlcm1hbnknLCAnSXRhbHknLCAnRnJhbmNlJywgJ1VuaXRlZCBLaW5nZG9tJywgJ1VuaXRlZCBTdGF0ZXMnXVxyXG5cclxuY29uc3QgY291bnRyeUluZGV4UGFyYW0gPSAnY3VycmVudENvdW50cnlJbmRleCdcclxuY29uc3Qgc2hpcHBpbmdJbmZvTm90Rm91bmQgPSBcInNoaXBwaW5nSW5mb05vdEZvdW5kXCJcclxuXHJcbmNvbnN0IGxvdEluZm8gPSBuZXcgTG90SW5mbygpO1xyXG5sZXQgX3NlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkO1xyXG5cclxuLy8gZmV0Y2gg0YfQtdGA0LXQtyBiYWNrZ3JvdW5kIHNjcmlwdCwg0L/QviDQtNGA0YPQs9C+0LzRgyDQvdC1INGA0LDQsdC+0YLQsNC10YJcclxuZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZShpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7aW5wdXQsIGluaXR9LCBtZXNzYWdlUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBbcmVzcG9uc2UsIGVycm9yXSA9IG1lc3NhZ2VSZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHVuZGVmaW5lZCBvbiBhIDIwNCAtIE5vIENvbnRlbnRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXNwb25zZS5ib2R5ID8gbmV3IEJsb2IoW3Jlc3BvbnNlLmJvZHldKSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiByZXNwb25zZS5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGV4dHJhY3RQcmljZShwcmljZTogc3RyaW5nKTogUHJpY2Uge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBwcmljZS5tYXRjaCgvKFxcRCspKFxcZCsoPzpbLC5dXFxkKyk/KS8pXHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcmljZShwYXJzZUZsb2F0KG1hdGNoZXNbMl0ucmVwbGFjZSgnLCcsICcuJykpLCBtYXRjaGVzWzFdLnRyaW0oKSlcclxufVxyXG5cclxuY2xhc3MgUHJpY2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJpY2U6IG51bWJlciwgY3VycmVuY3k6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbmN5ID0gY3VycmVuY3lcclxuICAgICAgICB0aGlzLnByaWNlID0gcHJpY2VcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW5jeTogc3RyaW5nO1xyXG4gICAgcHJpY2U6IG51bWJlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgc3R5bGVzID0gYFxyXG4gICAgLiR7cGFuZWxDbGFzc30ge1xyXG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgICBwYWRkaW5nOiAxNXB4O1xyXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCAjMDAwMGNjO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICBjb2xvcjogIzAwMDBjYztcclxuICAgICAgcG9zaXRpb246Zml4ZWQ7XHJcbiAgICAgIHotaW5kZXg6MTAwO1xyXG4gICAgICBsZWZ0OjElO1xyXG4gICAgICBib3R0b206NSU7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbCB7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgICBmbG9hdDogbGVmdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gaW5wdXQge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHNlbGVjdCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWw6YWZ0ZXIgeyBjb250ZW50OiBcIjogXCIgfVxyXG5gXHJcblxyXG4gICAgbGV0IHN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIilcclxuICAgIHN0eWxlU2hlZXQuaW5uZXJUZXh0ID0gc3R5bGVzXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChzdHlsZVNoZWV0KVxyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3MpO1xyXG5cclxuXHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKVxyXG4gICAgZm9ybS5pZCA9IGZvcm1JZFxyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IGRvbWFpbiA9IGxvY2F0aW9uLmhvc3RuYW1lO1xyXG5cclxuICAgIGxldCBoaXN0b3J5QnV0dG9uSHJlZiA9IGBodHRwczovLyR7ZG9tYWlufS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIC8vIGxhbmd1YWdlPUhUTUxcclxuICAgIGZvcm0uaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxhIGhyZWY9XCIke2hpc3RvcnlCdXR0b25IcmVmfVwiIHRhcmdldD1cIl9ibGFua1wiPtCY0YHRgtC+0YDQuNGPINC/0YDQvtC00LDQtiDQu9C+0YLQsDwvYT5cclxuICAgICAgICA8YnI+0JHRjdC60LXQvdC0OiA8YSBocmVmPVwiJHtiYWNrZW5kVXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YmFja2VuZFVybH08L2E+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiPtCY0LPQvdC+0YDQuNGA0L7QstCw0YLRjCDQu9C+0YI8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIiB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiLz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+0KLQvtCy0LDRgDwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiIGlkPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDRgtC+0LLQsNGAPC9vcHRpb24+XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Bjc0ZpZWxkTmFtZX1cIj5QQ1M8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7cGNzRmllbGROYW1lfVwiIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwiJHtwY3NGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIj7QodC+0YHRgtC+0Y/QvdC40LU8L2xhYmVsPlxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCIgaWQ9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDQodC+0YHRgtC+0Y/QvdC40LU8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT1cImNvbG9yOiByZWQ7XCIgaWQ9XCIke2Vycm9yRWxlbWVudElkfVwiPjwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3N1Ym1pdElkfVwiIHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlNhdmVcIiBkaXNhYmxlZC8+XHJcbiAgICBgO1xyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQ6IFN1Ym1pdEV2ZW50KSB7XHJcbiAgICAgICAgYXdhaXQgaGFuZGxlU3VibWl0KGV2ZW50LCBjbGllbnQpXHJcbiAgICB9KTtcclxuXHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybSlcclxuICAgIGRpdi5oaWRkZW4gPSB0cnVlO1xyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PmV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgICAgIGxldCBpZ25vcmVUaGF0TG90ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2lnbm9yZVRoYXRMb3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZ25vcmVUaGF0TG90ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mb1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGxvdEluZm8uc2hpcHBpbmdDb3VudHJ5ID09PSBzaGlwcGluZ0luZm9Ob3RGb3VuZCkge1xyXG4gICAgICAgICAgICBpZ25vcmVUaGF0TG90ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvdEluZm9bJ2lnbm9yZVRoYXRMb3QnXSA9IGlnbm9yZVRoYXRMb3Q7XHJcblxyXG4gICAgICAgIGlmIChpZ25vcmVUaGF0TG90KSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8ucGNzID0gMVxyXG4gICAgICAgICAgICBsb3RJbmZvLm1hbnVhbENvbmRpdGlvbklkID0gbm90U2V0VmFsdWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyB0byBiYWNrZW5kOiBcIiArIEpTT04uc3RyaW5naWZ5KGxvdEluZm8pKVxyXG5cclxuXHJcbiAgICAgICAgYXdhaXQgY2xpZW50LnVwc2VydExvdEluZm8obG90SW5mbywgZGF0YS5nZXQoJ3Byb2R1Y3RJZCcpLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgYXdhaXQgc2hvd0FuZFNhdmVFcnJvcihlcnJvciwgY2xpZW50KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzOiBIVE1MVGFibGVSb3dFbGVtZW50W10sIHJlc3VsdDogUHVyY2hhc2VJbmZvSW5uZXJbXSkge1xyXG4gICAgZm9yIChsZXQgZml4ZWRQcmljZVJvdyBvZiBmaXhlZFByaWNlUm93cykge1xyXG4gICAgICAgIGxldCBjb2x1bW5zID0gWy4uLmZpeGVkUHJpY2VSb3cucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJUZXh0O1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICBsZXQgcHJpY2UgPSBjb2x1bW5zWzFdXHJcblxyXG4gICAgICAgIGlmIChwcmljZSA9PT0gXCJFeHBpcmVkXCIgfHwgcHJpY2UgPT09IFwiRGVjbGluZWRcIikge1xyXG4gICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByaWNlICE9PSBcIlNvbGQgYXMgYSBzcGVjaWFsIG9mZmVyXCIgJiYgcHJpY2UgIT09IFwiQ291bnRlci1vZmZlcmVkXCIgJiYgcHJpY2UgIT09IFwiQWNjZXB0ZWRcIikge1xyXG5cclxuICAgICAgICAgICAgbGV0IHByaWNlRXh0cmFjdGVkID0gZXh0cmFjdFByaWNlKHByaWNlKVxyXG4gICAgICAgICAgICBpZiAocHJpY2VFeHRyYWN0ZWQuY3VycmVuY3kgIT09IGxvdEluZm8uY3VycmVuY3kpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImN1cnJlbmN5IGRvZXNuJ3QgbWF0Y2ggd2l0aCBsb3QgY3VycmVuY3kgbG90IGN1cnJlbmN5IFwiICsgbG90SW5mby5jdXJyZW5jeSArIFwiIGV4dHJhY3RlZCBjdXJyZW5jeSBcIiArIHByaWNlRXh0cmFjdGVkLmN1cnJlbmN5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pLCBwcmljZUV4dHJhY3RlZCkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFB1cmNoYXNlSW5mb0lubmVyKHBhcnNlSW50KGNvbHVtbnNbMl0pLCBwYXJzZURhdGUoY29sdW1uc1szXSkpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHVyY2hhc2VJbmZvSW5uZXIge1xyXG4gICAgY29uc3RydWN0b3IocXVhbnRpdHk6IG51bWJlciwgZGF0ZTogRGF0ZSwgcHJpY2U/OiBQcmljZSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGVcclxuICAgICAgICB0aGlzLnByaWNlID0gcHJpY2VcclxuICAgIH1cclxuXHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgcHJpY2U6IFByaWNlIHwgdW5kZWZpbmVkO1xyXG4gICAgZGF0ZTogRGF0ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURhdGUoZGF0ZVN0cmluZyk6IERhdGUge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBkYXRlU3RyaW5nLm1hdGNoKC8oXFxkK1xcc1tBLXpdK1xcc1xcZCspXFxzYXRcXHMoXFxkKyk6KFxcZCspOihcXGQrKShhbXxwbSlcXHMoW0Etel0rKS8pXHJcblxyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKG1hdGNoZXNbMV0gKyAnIDAwOjAwOjAwLjAwMFonKSlcclxuXHJcbiAgICBkYXRlLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1hdGNoZXNbMl0pKTtcclxuICAgIGRhdGUuc2V0VVRDTWludXRlcyhwYXJzZUludChtYXRjaGVzWzNdKSk7XHJcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobWF0Y2hlc1s0XSkpO1xyXG5cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcInBtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpICE9PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpICsgMTIpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1hdGNoZXNbNV0gPT09IFwiYW1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgPT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAxMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1hdGNoZXNbNl0gPT09IFwiTVNLXCIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSAtIDMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHRpbWV6b25lIFwiICsgbWF0Y2hlc1s2XSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dDogc3RyaW5nKTogUHVyY2hhc2VJbmZvW10ge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gbmV3IEFycmF5PFB1cmNoYXNlSW5mb0lubmVyPigpO1xyXG4gICAgbGV0IGZpeGVkUHJpY2VCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYuZml4ZWQtcHJpY2UgdGJvZHknKVxyXG4gICAgaWYgKGZpeGVkUHJpY2VCbG9jayAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaXhlZFByaWNlUm93cyA9IFsuLi5maXhlZFByaWNlQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvZmZlckJsb2NrID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5vZmZlciB0Ym9keScpXHJcbiAgICBpZiAob2ZmZXJCbG9jayAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBvZmZlclJvd3MgPSBbLi4ub2ZmZXJCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCd0cicpXVxyXG4gICAgICAgIGZpbGxTb2xkSXRlbXNSZXN1bHQob2ZmZXJSb3dzLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBiLmRhdGUuZ2V0VGltZSgpIC0gYS5kYXRlLmdldFRpbWUoKTtcclxuICAgIH0pLm1hcChmdW5jdGlvbiAoeCkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFB1cmNoYXNlSW5mbyh7XHJcbiAgICAgICAgICAgIGRhdGU6IHguZGF0ZS50b0lTT1N0cmluZygpLCBxdWFudGl0eTogeC5xdWFudGl0eSwgcHJpY2U6IHgucHJpY2U/LnByaWNlXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsSWQoKSB7XHJcbiAgICBsb3RJbmZvLmxvdElkID0gcGFyc2VJbnQobG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV0pO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJpY2UoKSB7XHJcbiAgICBsZXQgcHJpY2UgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXByaWNlLXByaW1hcnkgc3BhbicsIGRvY3VtZW50KSkuaW5uZXJUZXh0KVxyXG4gICAgbG90SW5mby5wcmljZSA9IHByaWNlLnByaWNlXHJcbiAgICBsb3RJbmZvLmN1cnJlbmN5ID0gcHJpY2UuY3VycmVuY3lcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbE5hbWUoKSB7XHJcbiAgICBsb3RJbmZvLm5hbWUgPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnLnZpbSBoMScsIGRvY3VtZW50KSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxTZWxsZXIoKSB7XHJcbiAgICBsb3RJbmZvLnNlbGxlciA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1zZWxsZXJjYXJkLWF0Zl9faW5mb19fYWJvdXQtc2VsbGVyIGEnLCBkb2N1bWVudCkpLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxDb25kaXRpb24oKSB7XHJcbiAgICBsb3RJbmZvLmNvbmRpdGlvbiA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1pdGVtLWNvbmRpdGlvbi10ZXh0IHNwYW4udXgtdGV4dHNwYW5zJywgZG9jdW1lbnQpKS5pbm5lclRleHRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLWRlc2MnKVxyXG4gICAgaWYgKGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgbG90SW5mby5jb25kaXRpb25EZXNjcmlwdGlvbiA9ICg8SFRNTEVsZW1lbnQ+Y29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50KS5pbm5lclRleHRcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnCcsICcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCdJywgJycpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBoYXNTaGlwcGluZ1RvQ291bnRyeShjb3VudHJ5OiBzdHJpbmcsIHNoaXBzVG86IFNldDxzdHJpbmc+LCBleGNsdWRlczogU2V0PHN0cmluZz4pIHtcclxuICAgIHJldHVybiAoc2hpcHNUby5oYXMoJ1dvcmxkd2lkZScpIHx8IChzaGlwc1RvLmhhcyhcIkV1cm9wZVwiKSAmJiBzdXBwb3J0ZWRFdXJvcGVDb3VudHJpZXMuaGFzKGNvdW50cnkpKSB8fCBzaGlwc1RvLmhhcyhjb3VudHJ5KSkgJiYgIWV4Y2x1ZGVzLmhhcyhjb3VudHJ5KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY2hhbmdlU2hpcHBpbmdDb3VudHJ5KGN1cnJlbnRDb3VudHJ5SW5kZXg6IG51bWJlciwgc2hpcHBpbmdEaXY6IEVsZW1lbnQsIGN1cnJlbnRTaGlwcGluZ0NvdW50cnk6IHN0cmluZyB8IG51bGwpIHtcclxuICAgIGlmIChjdXJyZW50Q291bnRyeUluZGV4ID49IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiY3VycmVudENvdW50cnlJbmRleCBPdXQgb2Ygc3VwcG9ydGVkIHNoaXBwaW5nIGNvdW50cmllcyByYW5nZVwiKVxyXG5cclxuICAgIGxldCBzaGlwc1RvID0gZ2V0U2hpcHNUbyhzaGlwcGluZ0Rpdik7XHJcbiAgICBsZXQgZXhjbHVkZXMgPSBnZXRFeGNsdWRlcyhzaGlwcGluZ0Rpdik7XHJcblxyXG4gICAgbGV0IG5leHRDb3VudHJ5SW5kZXggPSBjdXJyZW50Q291bnRyeUluZGV4XHJcbiAgICBsZXQgbmV4dENvdW50cnkgPSBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllc1tuZXh0Q291bnRyeUluZGV4XVxyXG5cclxuICAgIHdoaWxlICghaGFzU2hpcHBpbmdUb0NvdW50cnkobmV4dENvdW50cnksIHNoaXBzVG8sIGV4Y2x1ZGVzKSkge1xyXG4gICAgICAgIG5leHRDb3VudHJ5SW5kZXggPSBuZXh0Q291bnRyeUluZGV4ICsgMVxyXG4gICAgICAgIGlmIChuZXh0Q291bnRyeUluZGV4ID49IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiT3V0IG9mIHN1cHBvcnRlZCBzaGlwcGluZyBjb3VudHJpZXMgcmFuZ2VcIilcclxuICAgICAgICBuZXh0Q291bnRyeSA9IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzW25leHRDb3VudHJ5SW5kZXhdXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGN1cnJlbnRTaGlwcGluZ0NvdW50cnkgIT09IG5leHRDb3VudHJ5KSB7XHJcbiAgICAgICAgbGV0IHNoaXBCdXR0b24gPSAoPEhUTUxCdXR0b25FbGVtZW50Pihhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJyNnaC1zaGlwdG8tY2xpY2sgYnV0dG9uJywgZG9jdW1lbnQpKSk7XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwMClcclxuICAgICAgICBzaGlwQnV0dG9uLmNsaWNrKCk7XHJcblxyXG4gICAgICAgIGxldCBjaG9vc2VTaGlwcGluZ0NvdW50cnlEaWFsb2cgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJyNnaC1zaGlwdG8tY2xpY2stbW9kYWwnLCBkb2N1bWVudCk7XHJcbiAgICAgICAgYXdhaXQgc2xlZXBVbnRpbCgoKSA9PiBjaG9vc2VTaGlwcGluZ0NvdW50cnlEaWFsb2cuY2hlY2tWaXNpYmlsaXR5KCkgPT09IGZhbHNlKTtcclxuICAgICAgICBhd2FpdCBzbGVlcCg1MDApO1xyXG4gICAgICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+KGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnYnV0dG9uLm1lbnUtYnV0dG9uX19idXR0b24nLCBjaG9vc2VTaGlwcGluZ0NvdW50cnlEaWFsb2cpKSkuY2xpY2soKTtcclxuXHJcbiAgICAgICAgbGV0IGl0ZW1zTWVudSA9IDxIVE1MRGl2RWxlbWVudD4oKGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2Lm1lbnUtYnV0dG9uX19pdGVtcycsIGNob29zZVNoaXBwaW5nQ291bnRyeURpYWxvZykpKTtcclxuXHJcbiAgICAgICAgYXdhaXQgc2xlZXBVbnRpbCgoKSA9PiBpdGVtc01lbnUuY2hlY2tWaXNpYmlsaXR5KCkgPT09IGZhbHNlKTtcclxuICAgICAgICBhd2FpdCBzbGVlcCg1MDApO1xyXG4gICAgICAgIGdldENvdW50cnlTcGFuSXRlbShuZXh0Q291bnRyeSwgaXRlbXNNZW51KS5jbGljaygpXHJcblxyXG4gICAgICAgIGF3YWl0IHNsZWVwVW50aWwoKCkgPT4gc2hpcEJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpPy5pbmNsdWRlcyhuZXh0Q291bnRyeSkgIT09IHRydWUpO1xyXG4gICAgICAgIGF3YWl0IHNsZWVwKDUwMCk7XHJcblxyXG4gICAgICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdidXR0b24uc2hpcHRvX19jbG9zZS1idG4nLCBjaG9vc2VTaGlwcGluZ0NvdW50cnlEaWFsb2cpKS5jbGljaygpXHJcbiAgICB9XHJcbiAgICBhd2FpdCBzbGVlcCgzMDAwKVxyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChjb3VudHJ5SW5kZXhQYXJhbSwgKG5leHRDb3VudHJ5SW5kZXgpLnRvU3RyaW5nKCkpXHJcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gdXJsLnRvU3RyaW5nKClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2hpcHNUbyhzaGlwcGluZ0RpdjogRWxlbWVudCk6IFNldDxzdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgU2V0KCg8SFRNTERpdkVsZW1lbnQ+c2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcignZGl2LnV4LWxhYmVscy12YWx1ZXMtLXNoaXBzdG8nKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJTaGlwcyB0bzpcIiwgXCJcIilcclxuICAgICAgICAuc3BsaXQoJywnKS5tYXAocyA9PiBzLnRyaW0oKSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFeGNsdWRlcyhzaGlwcGluZ0RpdjogRWxlbWVudCk6IFNldDxzdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgU2V0KCg8SFRNTERpdkVsZW1lbnQ+c2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcignZGl2LnV4LWxhYmVscy12YWx1ZXMtLWV4Y2x1ZGVzJykpLmlubmVyVGV4dC5yZXBsYWNlKFwiRXhjbHVkZXM6XCIsIFwiXCIpXHJcbiAgICAgICAgLnNwbGl0KCcsJykubWFwKHMgPT4gcy50cmltKCkpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFNoaXBwaW5nKCkge1xyXG5cclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgbGV0IGN1cnJlbnRDb3VudHJ5SW5kZXggPSBwYXJzZUludCh1cmwuc2VhcmNoUGFyYW1zLmdldChjb3VudHJ5SW5kZXhQYXJhbSkgPz8gXCIwXCIpXHJcbiAgICBsZXQgY3VycmVudENvdW50cnkgPSBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllc1tjdXJyZW50Q291bnRyeUluZGV4XVxyXG5cclxuICAgIGxldCBzaGlwcGluZ0RpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LmQtc2hpcHBpbmctbWF4dmlldycsIGRvY3VtZW50KTtcclxuXHJcbiAgICBsZXQgc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSA9IHNoaXBwaW5nRGl2LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi51eC1sYXlvdXQtc2VjdGlvbl9fdGV4dHVhbC1kaXNwbGF5LS1hc2tTZWxsZXInKSA9PT0gbnVsbFxyXG4gICAgaWYgKHNoaXBwaW5nUmF0ZXNBdmFpbGFibGUpIHtcclxuICAgICAgICBsZXQgc2hpcHBpbmdUYWJsZSA9IHNoaXBwaW5nRGl2LnF1ZXJ5U2VsZWN0b3IoJ3RhYmxlLnV4LXRhYmxlLXNlY3Rpb24td2l0aC1oaW50cy0tc2hpcHBpbmdUYWJsZScpXHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ1RhYmxlID09PSBudWxsIHx8IHNoaXBwaW5nVGFibGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gMDtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQ291bnRyeSA9IHNoaXBwaW5nSW5mb05vdEZvdW5kXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlciA9IFsuLi5zaGlwcGluZ1RhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3RoZWFkJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJyldXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlcyA9IFsuLi5zaGlwcGluZ1RhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5JylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ3RyJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ01heHZpZXdWYWx1ZXMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlcltpXS5pbm5lclRleHRcclxuICAgICAgICAgICAgc2hpcHBpbmdNYXh2aWV3VmFsdWVzW2tleV0gPSBkZWxpdmVyeUNvbHVtbnNWYWx1ZXNbaV0ucXVlcnlTZWxlY3Rvcignc3BhbicpLmlubmVyVGV4dFxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY3VycmVudFNoaXBwaW5nQ291bnRyeSA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snVG8nXTtcclxuICAgICAgICBpZiAoY3VycmVudFNoaXBwaW5nQ291bnRyeSAhPT0gY3VycmVudENvdW50cnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGFuZ2luZyBzaGlwcGluZyBjb3VudHJ5IGJlY2F1c2UgY3VycmVudCBjb3VudHJ5IFwiICsgY3VycmVudFNoaXBwaW5nQ291bnRyeSArIFwiIGRvZXNuJ3QgbWF0Y2ggd2l0aCBleHBlY3RlZCBcIiArIGN1cnJlbnRDb3VudHJ5KVxyXG4gICAgICAgICAgICBhd2FpdCBjaGFuZ2VTaGlwcGluZ0NvdW50cnkoY3VycmVudENvdW50cnlJbmRleCwgc2hpcHBpbmdEaXYsIGN1cnJlbnRTaGlwcGluZ0NvdW50cnkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ1ZhbHVlID0gc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydTaGlwcGluZyBhbmQgaGFuZGxpbmcnXVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdWYWx1ZSAhPT0gJ0ZyZWUgc2hpcHBpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBzaGlwcGluZ1ByaWNlID0gZXh0cmFjdFByaWNlKHNoaXBwaW5nVmFsdWUpXHJcbiAgICAgICAgICAgIGlmIChzaGlwcGluZ1ByaWNlLmN1cnJlbmN5ICE9PSBsb3RJbmZvLmN1cnJlbmN5KSB0aHJvdyBuZXcgRXJyb3IoXCJTaGlwcGluZyBjdXJyZW5jeSBtaXNtYXRjaCB3aXRoIGxvdCBjdXJyZW5jeVwiKVxyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gc2hpcHBpbmdQcmljZS5wcmljZVxyXG5cclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlcy5oYXNPd25Qcm9wZXJ0eSgnRWFjaCBhZGRpdGlvbmFsIGl0ZW0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlYWNoQWRkaXRpb25hbCA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snRWFjaCBhZGRpdGlvbmFsIGl0ZW0nXVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYWNoQWRkaXRpb25hbCAhPT0gXCJGcmVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWFjaEFkZGl0aW9uYWxQcmljZSA9IGV4dHJhY3RQcmljZShlYWNoQWRkaXRpb25hbClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWFjaEFkZGl0aW9uYWxQcmljZS5jdXJyZW5jeSAhPT0gbG90SW5mby5jdXJyZW5jeSkgdGhyb3cgbmV3IEVycm9yKFwiRWFjaCBhZGRpdGlvbmFsIHNoaXBwaW5nIGN1cnJlbmN5IG1pc21hdGNoIHdpdGggbG90IGN1cnJlbmN5XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSBlYWNoQWRkaXRpb25hbFByaWNlLnByaWNlXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gMDtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZygnY3VycmVudFNoaXBwaW5nQ291bnRyeSAnICsgY3VycmVudFNoaXBwaW5nQ291bnRyeSlcclxuICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQ291bnRyeSA9IGN1cnJlbnRTaGlwcGluZ0NvdW50cnlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2luZyBiZWNhdXNlIHRoZXJlIGlzIG5vIHNoaXBwaW5nIHRvIGN1cnJlbnQgY291bnRyeVwiKVxyXG4gICAgICAgIGF3YWl0IGNoYW5nZVNoaXBwaW5nQ291bnRyeShjdXJyZW50Q291bnRyeUluZGV4ICsgMSwgc2hpcHBpbmdEaXYsIG51bGwpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNsZWVwVW50aWwoZnVuYzogKCkgPT4gYm9vbGVhbiwgc2xlZXBNczogbnVtYmVyID0gMTAwLCBtYXhBdHRlbXB0OiBudW1iZXIgPSAxMDApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBhdHRlbXB0ID0gMDtcclxuICAgIHdoaWxlIChmdW5jKCkpIHtcclxuICAgICAgICBhdHRlbXB0Kys7XHJcblxyXG4gICAgICAgIGlmIChhdHRlbXB0ID4gbWF4QXR0ZW1wdCkgdGhyb3cgbmV3IEVycm9yKFwiQXR0ZW1wdCBjb3VudHMgZXhjZWVkZWQgXCIgKyBtYXhBdHRlbXB0ICsgXCIgXCIgKyBmdW5jLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICAgIGF3YWl0IHNsZWVwKHNsZWVwTXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvdW50cnlTcGFuSXRlbShjb3VudHJ5TmFtZTogc3RyaW5nLCBpdGVtc01lbnU6IEhUTUxEaXZFbGVtZW50KTogSFRNTFNwYW5FbGVtZW50IHtcclxuXHJcbiAgICBpZiAoY291bnRyeU5hbWUgPT09IG51bGwgfHwgY291bnRyeU5hbWUgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKFwiY291bnRyeSBuYW1lIHNob3VsZG4ndCBiZSBudWxsIG9yIHVuZGVmaW5lZFwiKVxyXG5cclxuICAgIGxldCBzcGFucyA9IGl0ZW1zTWVudS5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuLmNuJyk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGlmICgoPEhUTUxFbGVtZW50PnNwYW5zW2ldKS5pbm5lclRleHQgPT09IGNvdW50cnlOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8SFRNTFNwYW5FbGVtZW50PnNwYW5zW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZmluZCBjb3VudHJ5IGluIGxpc3QgXCIgKyBjb3VudHJ5TmFtZSlcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbExvY2F0ZWRJbigpIHtcclxuICAgIGxldCBtYXRjaCA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuZC1zaGlwcGluZy1taW52aWV3JywgZG9jdW1lbnQpKS5pbm5lclRleHQubWF0Y2goL0xvY2F0ZWRcXHNpbjpcXHMoLispLylcclxuICAgIGlmIChtYXRjaCAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxvdEluZm8ubG9jYXRlZEluID0gbWF0Y2hbMV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG90SW5mby5sb2NhdGVkSW4gPSBcIlVua25vd25cIlxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgZm91bmRFbGVtZW50ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkQW55KFsnI2Rlc2NfaWZyJywgJyN2aV9zbmlwcGV0ZGVzY19idG4nXSlcclxuXHJcbiAgICBsZXQgZGVzY3JpcHRpb25Vcmw6IHN0cmluZ1xyXG4gICAgaWYgKGZvdW5kRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJRnJhbWVFbGVtZW50KSB7XHJcbiAgICAgICAgZGVzY3JpcHRpb25VcmwgPSAoPEhUTUxJRnJhbWVFbGVtZW50PmZvdW5kRWxlbWVudCkuc3JjXHJcbiAgICB9IGVsc2UgaWYgKGZvdW5kRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XHJcbiAgICAgICAgZGVzY3JpcHRpb25VcmwgPSAoPEhUTUxBbmNob3JFbGVtZW50PmZvdW5kRWxlbWVudCkuaHJlZlxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9uVXJsKVxyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShkZXNjcmlwdGlvblVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgbG90SW5mby5kZXNjcmlwdGlvbiA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHVyY2hhc2VIaXN0b3J5KCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IHB1cmNoYXNlSGlzdG9yeVVybCA9IGBodHRwczovLyR7bG9jYXRpb24uaG9zdG5hbWV9L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShwdXJjaGFzZUhpc3RvcnlVcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICBsb3RJbmZvLnB1cmNoYXNlSGlzdG9yeSA9IHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWFyY2hRdWVyeSgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xyXG4gICAgaWYgKGRvY3VtZW50LnJlZmVycmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwoZG9jdW1lbnQucmVmZXJyZXIpLnNlYXJjaFBhcmFtcz8uZ2V0KCdfbmt3Jyk/LnRyaW0oKT8udG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFByb2R1Y3QocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBjbGllbnQ6IENsaWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBwcm9kdWN0RmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QjJyArIHByb2R1Y3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBwcm9kdWN0SWQgPSBzZXJ2ZXJMb3RJbmZvPy5wcm9kdWN0SWQ/LnRyaW0oKT8udG9Mb3dlckNhc2UoKVxyXG4gICAgbGV0IHNlYXJjaFF1ZXJ5ID0gZ2V0U2VhcmNoUXVlcnkoKTtcclxuXHJcbiAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCBjbGllbnQuZ2V0QWxsUHJvZHVjdHMoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHQudmFsdWUgPSBwcm9kdWN0c1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gcHJvZHVjdHNbaV0ubmFtZTtcclxuXHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9kdWN0SWQgPT09IHByb2R1Y3RzW2ldLmlkLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcHJvZHVjdHNbaV0uc2VhcmNoUXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoUXVlcnkgPT09IHgucXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9kdWN0RmllbGQuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbE1hbnVhbENvbmRpdGlvbihwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbkZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBtYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbklkID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8ubWFudWFsQ29uZGl0aW9uSWQ/LnRyaW0oKT8udG9Mb3dlckNhc2UoKVxyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25zID0gYXdhaXQgY2xpZW50LmdldE1hbnVhbENvbmRpdGlvbnNMaXN0KClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFudWFsQ29uZGl0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHQudmFsdWUgPSBtYW51YWxDb25kaXRpb25zW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBtYW51YWxDb25kaXRpb25zW2ldLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgICAgICBpZiAobWFudWFsQ29uZGl0aW9uSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAobWFudWFsQ29uZGl0aW9uSWQgPT09IG1hbnVhbENvbmRpdGlvbnNbaV0uaWQudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFudWFsQ29uZGl0aW9uRmllbGQuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0U2VydmVyTG90SW5mbyhjbGllbnQ6IENsaWVudCk6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgX3NlcnZlckxvdEluZm8gPSBhd2FpdCBjbGllbnQuZ2V0TG90SW5mbyhsb3RJbmZvLmxvdElkKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFBjcyhwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcGNzRmllbGQgPSA8SFRNTElucHV0RWxlbWVudD5wYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgcGNzRmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgc2VydmVyUGNzID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8ucGNzXHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwY3NGaWVsZC52YWx1ZSA9IHNlcnZlclBjcy50b1N0cmluZygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxJZ25vcmVUaGF0TG90KHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBpZ25vcmVUaGF0TG90RmllbGQgPSA8SFRNTElucHV0RWxlbWVudD5wYW5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCMnICsgaWdub3JlVGhhdExvdEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/Lmlnbm9yZVRoYXRMb3RcclxuICAgIGlmIChzZXJ2ZXJQY3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlnbm9yZVRoYXRMb3RGaWVsZC5jaGVja2VkID0gc2VydmVyUGNzXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb21wYXJlTG90SW5mb3Moc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQ6IExvdEluZm9XaXRoUHJvZHVjdElkKSB7XHJcbiAgICBpZiAoc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgbGV0IHNlcnZlckxvdEluZm9Kc29uID0gc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQubG90SW5mby50b0pTT04oKVxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJwY3NcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wiaWdub3JlVGhhdExvdFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJkZXNjcmlwdGlvblwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJzaGlwcGluZ1wiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wic2hpcHBpbmdDb3VudHJ5XCJdID0gdW5kZWZpbmVkXHJcbiAgICBsZXQgc2VydmVyUHVyY2hhc2VIaXN0b3J5ID0gc2VydmVyTG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl1cclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gdW5kZWZpbmVkXHJcbiAgICBsZXQgbG90SW5mb0pzb24gPSBsb3RJbmZvLnRvSlNPTigpXHJcbiAgICBsb3RJbmZvSnNvbltcInBjc1wiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJpZ25vcmVUaGF0TG90XCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcImRlc2NyaXB0aW9uXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcInNoaXBwaW5nXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcInNoaXBwaW5nQWRkaXRpb25hbFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJzaGlwcGluZ0NvdW50cnlcIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5ID0gbG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl07XHJcbiAgICBsb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXSA9IHVuZGVmaW5lZFxyXG5cclxuICAgIGxldCBzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHNlcnZlckxvdEluZm9Kc29uKVxyXG4gICAgbGV0IGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvSnNvbilcclxuICAgIGxldCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoc2VydmVyUHVyY2hhc2VIaXN0b3J5KVxyXG4gICAgbGV0IGxvdEluZm9QdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobG90SW5mb1B1cmNoYXNlSGlzdG9yeSlcclxuXHJcbiAgICBsZXQgcGFuZWwgPSA8SFRNTERpdkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MsIGRvY3VtZW50KTtcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZyA9PT0gY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlcnZlclB1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpXHJcbiAgICAgICAgY29uc29sZS5sb2cobG90SW5mb1B1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpXHJcbiAgICAgICAgaWYgKF9zZXJ2ZXJMb3RJbmZvLmxvdEluZm8uaWdub3JlVGhhdExvdCA9PT0gdHJ1ZSB8fCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID09PSBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZykge1xyXG4gICAgICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRHcmVlbkNvbG9yfTtgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGFuZWwuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0WWVsbG93Q29sb3J9O2BcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodFBpbmtDb2xvcn07YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6IFwiICsgc2VydmVyTG90SW5mb0pzb25TdHJpbmcpXHJcbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnRQYWdlOiBcIiArIGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldERhdGFGcm9tUGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHBhbmVsID0gPEhUTUxEaXZFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzLCBkb2N1bWVudClcclxuXHJcbiAgICBmaWxsSWQoKTtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHJpY2UoKSxcclxuICAgICAgICBmaWxsTmFtZSgpLFxyXG4gICAgICAgIGZpbGxTZWxsZXIoKSxcclxuICAgICAgICBmaWxsQ29uZGl0aW9uKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgZmlsbExvY2F0ZWRJbigpLFxyXG4gICAgICAgIGZpbGxEZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGdldFNlcnZlckxvdEluZm8oY2xpZW50KVxyXG4gICAgXSlcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHVyY2hhc2VIaXN0b3J5KCksXHJcbiAgICAgICAgZmlsbFByb2R1Y3QocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxQY3MocGFuZWwsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsSWdub3JlVGhhdExvdChwYW5lbCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxTaGlwcGluZygpLFxyXG4gICAgXSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJzaG93IHBhbmVsXCIpXHJcbiAgICBwYW5lbC5oaWRkZW4gPSBmYWxzZTtcclxuXHJcbiAgICBhd2FpdCBjb21wYXJlTG90SW5mb3MoX3NlcnZlckxvdEluZm8pO1xyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYWRkUGFuZWwoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBib2R5RWxlbWVudCA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnYm9keScsIGRvY3VtZW50KTtcclxuICAgIGlmIChib2R5RWxlbWVudCkge1xyXG4gICAgICAgIGxldCBleGlzdGluZ1BhbmVsID0gYm9keUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgICAgICBpZiAoIWV4aXN0aW5nUGFuZWwpIHtcclxuICAgICAgICAgICAgY3JlYXRlUGFuZWwoYm9keUVsZW1lbnQsIGNsaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzYXZlRXJyb3JUb0JhY2tlbmQoZXJyb3I6IEVycm9yLCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IGVycm9yVGV4dCA9IEpTT04uc3RyaW5naWZ5KGVycm9yKSArIFwiIFwiICsgZXJyb3Iuc3RhY2tcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgY2xpZW50LnNhdmVFcnJvcihuZXcgQ2xpZW50RXJyb3JJbmZvKHtcclxuICAgICAgICAgICAgZXJyb3I6IGVycm9yVGV4dCxcclxuICAgICAgICAgICAgdXJsOiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmXHJcbiAgICAgICAgfSkpXHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBzYXZlIGVycm9yIHRvIGJhY2tlbmQgXCIgKyBlcnJvclRleHQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNob3dBbmRTYXZlRXJyb3IoZXJyb3I6IEVycm9yLCBjbGllbnQ6IENsaWVudCkge1xyXG5cclxuICAgIGxldCBlcnJvclRleHQ6IHN0cmluZ1xyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGlvbkVycm9yID0gPFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvPmVycm9yXHJcbiAgICAgICAgZXJyb3JUZXh0ID0gSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvbkVycm9yLmVycm9ycylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXJyb3JUZXh0ID0gZXJyb3Iuc3RhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJFUlJPUiBcIiArIGVycm9yVGV4dClcclxuICAgIFxyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQsIGRvY3VtZW50KVxyXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgc3Bhbi5pbm5lckhUTUwgPSBlcnJvclRleHRcclxuICAgIGVycm9yRGl2LmFwcGVuZENoaWxkKHNwYW4pXHJcblxyXG4gICAgYXdhaXQgc2F2ZUVycm9yVG9CYWNrZW5kKGVycm9yLCBjbGllbnQpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBlbmFibGVTdWJtaXRCdXR0b24oKSB7XHJcbiAgICAoPEhUTUxCdXR0b25FbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnIycgKyBzdWJtaXRJZCwgZG9jdW1lbnQpKS5kaXNhYmxlZCA9IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6ZUZldGNoKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KTogRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuICAgIHJldHVybiBuZXcgRmV0Y2hXcmFwcGVyQ3VzdG9tKHtcclxuICAgICAgICBjbGllbnQ6IG9BdXRoMkNsaWVudCxcclxuICAgICAgICBnZXROZXdUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSkuY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhd2FpdCBvQXV0aDJDbGllbnQuYXV0aG9yaXphdGlvbkNvZGUuZ2V0QXV0aG9yaXplVXJpKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXIsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogWydFYmF5LlNlcnZlckFQSSddXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFN0b3JlZFRva2VuOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWNrZW5kVXJsICE9PSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImJhY2tlbmRfdXJsXCJdKSkuYmFja2VuZF91cmwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRva2VuX3N0b3JlXCJdKSkudG9rZW5fc3RvcmU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIEpTT04ucGFyc2UodG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoaWRlRXJyb3JzKCkge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQsIGRvY3VtZW50KVxyXG4gICAgZXJyb3JEaXYuaW5uZXJIVE1MID0gXCJcIlxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwcm9kdWN0UGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJwcm9kdWN0UGFnZVwiKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBhZGRQYW5lbChjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGdldERhdGFGcm9tUGFnZShjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGVuYWJsZVN1Ym1pdEJ1dHRvbigpXHJcbiAgICAgICAgYXdhaXQgaGlkZUVycm9ycygpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dBbmRTYXZlRXJyb3IoZXJyb3IsIGNsaWVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGF1dGhQYWdlKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImF1dGhQYWdlXCIpXHJcbiAgICBsZXQgdXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKVxyXG4gICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKFwiY29kZVwiKSkge1xyXG4gICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKS5jb2RlX3ZlcmlmaWVyO1xyXG4gICAgICAgIGxldCBvYXV0aDJUb2tlbiA9IGF3YWl0IG9BdXRoMkNsaWVudC5hdXRob3JpemF0aW9uQ29kZS5nZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtiYWNrZW5kX3VybDogYmFja2VuZFVybH0pXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHt0b2tlbl9zdG9yZTogSlNPTi5zdHJpbmdpZnkob2F1dGgyVG9rZW4pfSlcclxuXHJcbiAgICAgICAgbGV0IHJldHVyblBhZ2UgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInJldHVybl9wYWdlXCJdKSk/LnJldHVybl9wYWdlO1xyXG5cclxuICAgICAgICBpZiAocmV0dXJuUGFnZSAhPT0gbnVsbCAmJiByZXR1cm5QYWdlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtyZXR1cm5fcGFnZTogbnVsbH0pXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSByZXR1cm5QYWdlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGF1dGhSZWRpcmVjdFVybFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoUGFnZVwiKVxyXG4gICAgLy/RgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INC/0YDQvtC00LDQvdGL0LUg0LvQvtGC0YtcclxuICAgIGlmIChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcz8uZ2V0KCdMSF9Tb2xkJyk/LnRyaW0oKSAhPT0gXCIxXCIpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgndWwuc3JwLXJlc3VsdHMnLCBkb2N1bWVudClcclxuXHJcbiAgICBsZXQgbGlua3MgPSBbLi4uc2VhcmNoUmVzdWx0cy5xdWVyeVNlbGVjdG9yQWxsKCdsaS5zLWl0ZW0nKV1cclxuICAgICAgICAubWFwKGZ1bmN0aW9uICh4OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgbGluayA9IDxIVE1MQW5jaG9yRWxlbWVudD54LnF1ZXJ5U2VsZWN0b3IoJ2Eucy1pdGVtX19saW5rJylcclxuICAgICAgICAgICAgbGV0IHNvbGREYXRlID0gbmV3IERhdGUoKDxIVE1MRWxlbWVudD54LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uUE9TSVRJVkUnKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJTb2xkIFwiLCBcIlwiKSlcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMb3RMaW5rKHBhcnNlSW50KGxpbmsuaHJlZi5tYXRjaCgvaHR0cHM6XFwvXFwvW15cXC9dK1xcL2l0bVxcLyhcXGQrKS8pWzFdKSwgbGluaywgc29sZERhdGUpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgbGV0IF8gPSB1cGRhdGVTdGF0dXNJbmZpbml0ZShjbGllbnQsIGxpbmtzKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RhdHVzSW5maW5pdGUoY2xpZW50OiBDbGllbnQsIGxpbmtzOiBMb3RMaW5rW10pIHtcclxuICAgIGxldCBpZHMgPSBsaW5rcy5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geC5pZFxyXG4gICAgfSlcclxuICAgIC8vIG5vaW5zcGVjdGlvbiBJbmZpbml0ZUxvb3BKU1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nTG90U3RhdGVzXCIpXHJcbiAgICAgICAgICAgIGxldCBnZXRMb3RTdGF0ZXNBbnN3ZXIgPSBhd2FpdCBjbGllbnQuZ2V0TG90U3RhdGVzKGlkcylcclxuXHJcbiAgICAgICAgICAgIGxldCBrbm93bkxvdHMgPSBuZXcgTWFwKGdldExvdFN0YXRlc0Fuc3dlci5tYXAocCA9PiBbcC5sb3RJZCwgcF0pKTtcclxuXHJcbiAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29sb3IgPSB4LmNvbG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrbm93bkxvdHMuaGFzKHguaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvdFN0YXRlID0ga25vd25Mb3RzLmdldCh4LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG90U3RhdGUuaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGlmZkluRGF5cyA9IE1hdGguY2VpbCgoeC5zb2xkRGF0ZS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShsb3RTdGF0ZS5sYXN0VXBkYXRlKS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmZJbkRheXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRZZWxsb3dDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0UGlua0NvbG9yXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHguY29sb3IgIT09IG51bGwgJiYgY29sb3IgIT09IHguY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB4Lmxpbmsuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke3guY29sb3J9O2BcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhd2FpdCBzYXZlRXJyb3JUb0JhY2tlbmQoZXJyb3IsIGNsaWVudClcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwMClcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTG90TGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudCwgc29sZERhdGU6IERhdGUpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWRcclxuICAgICAgICB0aGlzLmxpbmsgPSBsaW5rXHJcbiAgICAgICAgdGhpcy5zb2xkRGF0ZSA9IHNvbGREYXRlXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBpZDogbnVtYmVyO1xyXG4gICAgbGluazogSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICBzb2xkRGF0ZTogRGF0ZVxyXG4gICAgY29sb3I6IHN0cmluZyB8IG51bGxcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBFbGVtZW50TG9hZGVkKHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnRUb1NlYXJjaEluOiBEb2N1bWVudCB8IEVsZW1lbnQpOiBQcm9taXNlPEVsZW1lbnQ+IHtcclxuICAgIGxldCByZXRyeSA9IDBcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcmV0cnkrKztcclxuICAgICAgICBpZiAocmV0cnkgPiAyMDApIHRocm93IG5ldyBFcnJvcihcInVuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3IgXCIgKyBzZWxlY3RvcilcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBlbGVtZW50VG9TZWFyY2hJbi5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxyXG4gICAgICAgIGlmIChlbGVtZW50ICE9PSBudWxsKSByZXR1cm4gZWxlbWVudFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNsZWVwRWxlbWVudExvYWRlZEFueShzZWxlY3RvcnM6IHN0cmluZ1tdKTogUHJvbWlzZTxFbGVtZW50PiB7XHJcblxyXG4gICAgbGV0IHJldHJ5ID0gMFxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICByZXRyeSsrO1xyXG4gICAgICAgIGlmIChyZXRyeSA+IDEwMDApIHRocm93IG5ldyBFcnJvcihcInVuYWJsZSB0byBmaW5kIGFueSBlbGVtZW50IGJ5IHNlbGVjdG9ycyBcIiArIHNlbGVjdG9ycy5qb2luKFwiLCBcIikpXHJcblxyXG4gICAgICAgIGxldCBmb3VuZEVsZW1lbnQ6IEVsZW1lbnRcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoeClcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZm91bmRFbGVtZW50ID0gZWxlbWVudFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGZvdW5kRWxlbWVudCAhPT0gbnVsbCkgcmV0dXJuIGZvdW5kRWxlbWVudFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2F2ZUNvZGVWZXJpZmllcigpIHtcclxuICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKT8uY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICBpZiAoY29kZVZlcmlmaWVyID09PSBudWxsIHx8IGNvZGVWZXJpZmllciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IGF3YWl0IGdlbmVyYXRlQ29kZVZlcmlmaWVyKCk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXJ9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdmb290ZXInLCBkb2N1bWVudClcclxuICAgIGF3YWl0IHNhdmVDb2RlVmVyaWZpZXIoKTtcclxuXHJcbiAgICBsZXQgb0F1dGgyQ2xpZW50ID0gbmV3IE9BdXRoMkNsaWVudCh7XHJcbiAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgIGNsaWVudElkOiAnRWJheS5DaHJvbWVFeHRlbnNpb24nLFxyXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6ICcvY29ubmVjdC90b2tlbicsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcblxyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09PSBhdXRoUmVkaXJlY3RVcmwpIHtcclxuICAgICAgICBhd2FpdCBhdXRoUGFnZShvQXV0aDJDbGllbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe3JldHVybl9wYWdlOiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmfSlcclxuXHJcbiAgICAgICAgbGV0IGNsaWVudCA9IG5ldyBDbGllbnQoYmFzZUFwaVVybCwgZ2V0QXV0aG9yaXplRmV0Y2gob0F1dGgyQ2xpZW50KSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9pdG0vXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBwcm9kdWN0UGFnZShjbGllbnQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYWdlLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5lYmF5LmNvbS9zY2gvXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBzZWFyY2hQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhd2FpdCBzYXZlRXJyb3JUb0JhY2tlbmQoZXJyb3IsIGNsaWVudClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxucnVuKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==