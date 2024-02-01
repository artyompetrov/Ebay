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
exports.ApiException = exports.Errors2 = exports.Errors = exports.ValidationProblemDetailedInfo = exports.NotFoundProblemDetailedInfo = exports.ProblemDetailedInfo = exports.ClientErrorInfo = exports.LotState = exports.ManualCondition = exports.PurchaseInfo = exports.LotInfo = exports.LotInfoWithProductId = exports.SearchQuery = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
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
//const backendUrl = "https://178.208.65.100:17443/"
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
                throw new Error("currency doesn't match with lot currency");
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
        let price = extractPrice((yield sleepElementLoaded('div.x-price-primary span')).innerText);
        lotInfo.price = price.price;
        lotInfo.currency = price.currency;
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
        let errorDiv = yield sleepElementLoaded('div.' + panelClass + ' #' + errorElementId);
        let span = document.createElement('span');
        if (error instanceof EbayClient_1.ValidationProblemDetailedInfo) {
            let validationError = error;
            span.innerHTML = "Ошибка валидации: " + JSON.stringify(validationError.errors);
        }
        else {
            span.innerHTML = error.stack;
        }
        errorDiv.appendChild(span);
        yield saveErrorToBackend(error, client);
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
            yield showAndSaveError(error, client);
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
function sleepElementLoaded(selector) {
    return __awaiter(this, void 0, void 0, function* () {
        let retry = 0;
        while (true) {
            retry++;
            if (retry > 200)
                throw new Error("unable to find element by selector " + selector);
            let element = document.querySelector(selector);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztxQkFBTSxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO29CQUM3RCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUNMLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLE1BQU0sa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUVULENBQUM7Q0FBQTtBQS9CRCxrQkErQkM7QUFHRCxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztVQ3R5Qk47VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50L2Jyb3dzZXIvb2F1dGgyLWNsaWVudC5taW4uanMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRWJheUNsaWVudC9FYmF5Q2xpZW50LnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL0ZldGNoV3JhcHBlckN1c3RvbS50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9tYWluLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9dCgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sdCk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5PQXV0aDJDbGllbnQ9dCgpOmUuT0F1dGgyQ2xpZW50PXQoKX0oc2VsZiwoKCk9PigoKT0+e3ZhciBlPXs5MzQ6KGUsdCxyKT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZ2VuZXJhdGVRdWVyeVN0cmluZz10Lk9BdXRoMkNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDQ0MyksaT1yKDYxOCk7ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBuZXcgVVJMKGUsdCkudG9TdHJpbmcoKX1mdW5jdGlvbiBzKGUpe3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhlKS5maWx0ZXIoKChbZSx0XSk9PnZvaWQgMCE9PXQpKSkpLnRvU3RyaW5nKCl9dC5PQXV0aDJDbGllbnQ9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy5kaXNjb3ZlcnlEb25lPSExLHRoaXMuc2VydmVyTWV0YWRhdGE9bnVsbCwobnVsbD09ZT92b2lkIDA6ZS5mZXRjaCl8fChlLmZldGNoPWZldGNoLmJpbmQoZ2xvYmFsVGhpcykpLHRoaXMuc2V0dGluZ3M9ZX1hc3luYyByZWZyZXNoVG9rZW4oZSl7aWYoIWUucmVmcmVzaFRva2VuKXRocm93IG5ldyBFcnJvcihcIlRoaXMgdG9rZW4gZGlkbid0IGhhdmUgYSByZWZyZXNoVG9rZW4uIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHJlZnJlc2ggdGhpc1wiKTtjb25zdCB0PXtncmFudF90eXBlOlwicmVmcmVzaF90b2tlblwiLHJlZnJlc2hfdG9rZW46ZS5yZWZyZXNoVG9rZW59O3JldHVybiB0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldHx8KHQuY2xpZW50X2lkPXRoaXMuc2V0dGluZ3MuY2xpZW50SWQpLHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHQpKX1hc3luYyBjbGllbnRDcmVkZW50aWFscyhlKXt2YXIgdDtjb25zdCByPVtcImNsaWVudF9pZFwiLFwiY2xpZW50X3NlY3JldFwiLFwiZ3JhbnRfdHlwZVwiLFwic2NvcGVcIl07aWYoKG51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXMpJiZPYmplY3Qua2V5cyhlLmV4dHJhUGFyYW1zKS5maWx0ZXIoKGU9PnIuaW5jbHVkZXMoZSkpKS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZXh0cmFQYXJhbXMgYXJlIGRpc2FsbG93ZWQ6ICcke3Iuam9pbihcIicsICdcIil9J2ApO2NvbnN0IG49e2dyYW50X3R5cGU6XCJjbGllbnRfY3JlZGVudGlhbHNcIixzY29wZTpudWxsPT09KHQ9bnVsbD09ZT92b2lkIDA6ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIiksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc307aWYoIXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KXRocm93IG5ldyBFcnJvcihcIkEgY2xpZW50U2VjcmV0IG11c3QgYmUgcHJvdmlkZWQgdG8gdXNlIGNsaWVudF9jcmVkZW50aWFsc1wiKTtyZXR1cm4gdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsbikpfWFzeW5jIHBhc3N3b3JkKGUpe3ZhciB0O2NvbnN0IHI9e2dyYW50X3R5cGU6XCJwYXNzd29yZFwiLC4uLmUsc2NvcGU6bnVsbD09PSh0PWUuc2NvcGUpfHx2b2lkIDA9PT10P3ZvaWQgMDp0LmpvaW4oXCIgXCIpfTtyZXR1cm4gdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIscikpfWdldCBhdXRob3JpemF0aW9uQ29kZSgpe3JldHVybiBuZXcgaS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudCh0aGlzKX1hc3luYyBpbnRyb3NwZWN0KGUpe2NvbnN0IHQ9e3Rva2VuOmUuYWNjZXNzVG9rZW4sdG9rZW5fdHlwZV9oaW50OlwiYWNjZXNzX3Rva2VuXCJ9O3JldHVybiB0aGlzLnJlcXVlc3QoXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIix0KX1hc3luYyBnZXRFbmRwb2ludChlKXtpZih2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKXJldHVybiBvKHRoaXMuc2V0dGluZ3NbZV0sdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2lmKFwiZGlzY292ZXJ5RW5kcG9pbnRcIiE9PWUmJihhd2FpdCB0aGlzLmRpc2NvdmVyKCksdm9pZCAwIT09dGhpcy5zZXR0aW5nc1tlXSkpcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoIXRoaXMuc2V0dGluZ3Muc2VydmVyKXRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGRldGVybWluZSB0aGUgbG9jYXRpb24gb2YgJHtlfS4gRWl0aGVyIHNwZWNpZnkgJHtlfSBpbiB0aGUgc2V0dGluZ3MsIG9yIHRoZSBcInNlcnZlclwiIGVuZHBvaW50IHRvIGxldCB0aGUgY2xpZW50IGRpc2NvdmVyIGl0LmApO3N3aXRjaChlKXtjYXNlXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9hdXRob3JpemVcIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwidG9rZW5FbmRwb2ludFwiOnJldHVybiBvKFwiL3Rva2VuXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcImRpc2NvdmVyeUVuZHBvaW50XCI6cmV0dXJuIG8oXCIvLndlbGwta25vd24vb2F1dGgtYXV0aG9yaXphdGlvbi1zZXJ2ZXJcIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvaW50cm9zcGVjdFwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKX19YXN5bmMgZGlzY292ZXIoKXt2YXIgZTtpZih0aGlzLmRpc2NvdmVyeURvbmUpcmV0dXJuO2xldCB0O3RoaXMuZGlzY292ZXJ5RG9uZT0hMDt0cnl7dD1hd2FpdCB0aGlzLmdldEVuZHBvaW50KFwiZGlzY292ZXJ5RW5kcG9pbnRcIil9Y2F0Y2goZSl7cmV0dXJuIHZvaWQgY29uc29sZS53YXJuKCdbb2F1dGgyXSBPQXV0aDIgZGlzY292ZXJ5IGVuZHBvaW50IGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBFaXRoZXIgc3BlY2lmeSB0aGUgXCJzZXJ2ZXJcIiBvciBcImRpc2NvdmVyeUVuZHBvaW50Jyl9Y29uc3Qgcj1hd2FpdCB0aGlzLnNldHRpbmdzLmZldGNoKHQse2hlYWRlcnM6e0FjY2VwdDpcImFwcGxpY2F0aW9uL2pzb25cIn19KTtpZighci5vaylyZXR1cm47aWYoIShudWxsPT09KGU9ci5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKSl8fHZvaWQgMD09PWU/dm9pZCAwOmUuc3RhcnRzV2l0aChcImFwcGxpY2F0aW9uL2pzb25cIikpKXJldHVybiB2b2lkIGNvbnNvbGUud2FybihcIltvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgd2FzIG5vdCBhIEpTT04gcmVzcG9uc2UuIFJlc3BvbnNlIGlzIGlnbm9yZWRcIik7dGhpcy5zZXJ2ZXJNZXRhZGF0YT1hd2FpdCByLmpzb24oKTtjb25zdCBuPVtbXCJhdXRob3JpemF0aW9uX2VuZHBvaW50XCIsXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIl0sW1widG9rZW5fZW5kcG9pbnRcIixcInRva2VuRW5kcG9pbnRcIl0sW1wiaW50cm9zcGVjdGlvbl9lbmRwb2ludFwiLFwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCJdXTtpZihudWxsIT09dGhpcy5zZXJ2ZXJNZXRhZGF0YSl7Zm9yKGNvbnN0W2Uscl1vZiBuKXRoaXMuc2VydmVyTWV0YWRhdGFbZV0mJih0aGlzLnNldHRpbmdzW3JdPW8odGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSx0KSk7dGhpcy5zZXJ2ZXJNZXRhZGF0YS50b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZHNfc3VwcG9ydGVkJiYhdGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZCYmKHRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2Q9dGhpcy5zZXJ2ZXJNZXRhZGF0YS50b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZHNfc3VwcG9ydGVkWzBdKX19YXN5bmMgcmVxdWVzdChlLHQpe2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRFbmRwb2ludChlKSxpPXtcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJ9O2xldCBvPXRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2Q7c3dpdGNoKG98fChvPXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0P1wiY2xpZW50X3NlY3JldF9iYXNpY1wiOlwiY2xpZW50X3NlY3JldF9wb3N0XCIpLG8pe2Nhc2VcImNsaWVudF9zZWNyZXRfYmFzaWNcIjppLkF1dGhvcml6YXRpb249XCJCYXNpYyBcIitidG9hKHRoaXMuc2V0dGluZ3MuY2xpZW50SWQrXCI6XCIrdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpO2JyZWFrO2Nhc2VcImNsaWVudF9zZWNyZXRfcG9zdFwiOnQuY2xpZW50X2lkPXRoaXMuc2V0dGluZ3MuY2xpZW50SWQsdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQmJih0LmNsaWVudF9zZWNyZXQ9dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpO2JyZWFrO2RlZmF1bHQ6dGhyb3cgbmV3IEVycm9yKFwiQXV0aGVudGljYXRpb24gbWV0aG9kIG5vdCB5ZXQgc3VwcG9ydGVkOlwiK28rXCIuIE9wZW4gYSBmZWF0dXJlIHJlcXVlc3QgaWYgeW91IHdhbnQgdGhpcyFcIil9Y29uc3QgYT1hd2FpdCB0aGlzLnNldHRpbmdzLmZldGNoKHIse21ldGhvZDpcIlBPU1RcIixib2R5OnModCksaGVhZGVyczppfSk7aWYoYS5vaylyZXR1cm4gYXdhaXQgYS5qc29uKCk7bGV0IGMsaCx1O3Rocm93IGEuaGVhZGVycy5oYXMoXCJDb250ZW50LVR5cGVcIikmJmEuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikuc3RhcnRzV2l0aChcImFwcGxpY2F0aW9uL2pzb25cIikmJihjPWF3YWl0IGEuanNvbigpKSwobnVsbD09Yz92b2lkIDA6Yy5lcnJvcik/KGg9XCJPQXV0aDIgZXJyb3IgXCIrYy5lcnJvcitcIi5cIixjLmVycm9yX2Rlc2NyaXB0aW9uJiYoaCs9XCIgXCIrYy5lcnJvcl9kZXNjcmlwdGlvbiksdT1jLmVycm9yKTooaD1cIkhUVFAgRXJyb3IgXCIrYS5zdGF0dXMrXCIgXCIrYS5zdGF0dXNUZXh0LDQwMT09PWEuc3RhdHVzJiZ0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKGgrPVwiLiBJdCdzIGxpa2VseSB0aGF0IHRoZSBjbGllbnRJZCBhbmQvb3IgY2xpZW50U2VjcmV0IHdhcyBpbmNvcnJlY3RcIiksdT1udWxsKSxuZXcgbi5PQXV0aDJFcnJvcihoLHUsYS5zdGF0dXMpfXRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKGUpe3JldHVybiBlLnRoZW4oKGU9Pnt2YXIgdDtyZXR1cm57YWNjZXNzVG9rZW46ZS5hY2Nlc3NfdG9rZW4sZXhwaXJlc0F0OmUuZXhwaXJlc19pbj9EYXRlLm5vdygpKzFlMyplLmV4cGlyZXNfaW46bnVsbCxyZWZyZXNoVG9rZW46bnVsbCE9PSh0PWUucmVmcmVzaF90b2tlbikmJnZvaWQgMCE9PXQ/dDpudWxsfX0pKX19LHQuZ2VuZXJhdGVRdWVyeVN0cmluZz1zfSw2MTg6KGUsdCxyKT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZ2V0Q29kZUNoYWxsZW5nZT10LmdlbmVyYXRlQ29kZVZlcmlmaWVyPXQuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9dm9pZCAwO2NvbnN0IG49cig5MzQpLGk9cig0NDMpO2FzeW5jIGZ1bmN0aW9uIG8oZSl7Y29uc3QgdD1zKCk7aWYobnVsbD09dD92b2lkIDA6dC5zdWJ0bGUpcmV0dXJuW1wiUzI1NlwiLGMoYXdhaXQgdC5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLGEoZSkpKV07e2NvbnN0IHQ9cigyMTIpLmNyZWF0ZUhhc2goXCJzaGEyNTZcIik7cmV0dXJuIHQudXBkYXRlKGEoZSkpLFtcIlMyNTZcIix0LmRpZ2VzdChcImJhc2U2NHVybFwiKV19fWZ1bmN0aW9uIHMoKXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuY3J5cHRvKXJldHVybiB3aW5kb3cuY3J5cHRvO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiZzZWxmLmNyeXB0bylyZXR1cm4gc2VsZi5jcnlwdG87Y29uc3QgZT1yKDIxMik7cmV0dXJuIGUud2ViY3J5cHRvP2Uud2ViY3J5cHRvOm51bGx9ZnVuY3Rpb24gYShlKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KGUubGVuZ3RoKTtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrKyl0W3JdPTI1NSZlLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9ZnVuY3Rpb24gYyhlKXtyZXR1cm4gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLm5ldyBVaW50OEFycmF5KGUpKSkucmVwbGFjZSgvXFwrL2csXCItXCIpLnJlcGxhY2UoL1xcLy9nLFwiX1wiKS5yZXBsYWNlKC89KyQvLFwiXCIpfXQuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy5jbGllbnQ9ZX1hc3luYyBnZXRBdXRob3JpemVVcmkoZSl7Y29uc3RbdCxyXT1hd2FpdCBQcm9taXNlLmFsbChbZS5jb2RlVmVyaWZpZXI/byhlLmNvZGVWZXJpZmllcik6dm9pZCAwLHRoaXMuY2xpZW50LmdldEVuZHBvaW50KFwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCIpXSk7bGV0IGk9e2NsaWVudF9pZDp0aGlzLmNsaWVudC5zZXR0aW5ncy5jbGllbnRJZCxyZXNwb25zZV90eXBlOlwiY29kZVwiLHJlZGlyZWN0X3VyaTplLnJlZGlyZWN0VXJpLGNvZGVfY2hhbGxlbmdlX21ldGhvZDpudWxsPT10P3ZvaWQgMDp0WzBdLGNvZGVfY2hhbGxlbmdlOm51bGw9PXQ/dm9pZCAwOnRbMV19O2Uuc3RhdGUmJihpLnN0YXRlPWUuc3RhdGUpLGUuc2NvcGUmJihpLnNjb3BlPWUuc2NvcGUuam9pbihcIiBcIikpO2NvbnN0IHM9T2JqZWN0LmtleXMoaSk7aWYoKG51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXMpJiZPYmplY3Qua2V5cyhlLmV4dHJhUGFyYW1zKS5maWx0ZXIoKGU9PnMuaW5jbHVkZXMoZSkpKS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZXh0cmFQYXJhbXMgYXJlIGRpc2FsbG93ZWQ6ICcke3Muam9pbihcIicsICdcIil9J2ApO3JldHVybiBpPXsuLi5pLC4uLm51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXN9LHIrXCI/XCIrKDAsbi5nZW5lcmF0ZVF1ZXJ5U3RyaW5nKShpKX1hc3luYyBnZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoZSx0KXtjb25zdHtjb2RlOnJ9PWF3YWl0IHRoaXMudmFsaWRhdGVSZXNwb25zZShlLHtzdGF0ZTp0LnN0YXRlfSk7cmV0dXJuIHRoaXMuZ2V0VG9rZW4oe2NvZGU6cixyZWRpcmVjdFVyaTp0LnJlZGlyZWN0VXJpLGNvZGVWZXJpZmllcjp0LmNvZGVWZXJpZmllcn0pfWFzeW5jIHZhbGlkYXRlUmVzcG9uc2UoZSx0KXt2YXIgcjtjb25zdCBuPW5ldyBVUkwoZSkuc2VhcmNoUGFyYW1zO2lmKG4uaGFzKFwiZXJyb3JcIikpdGhyb3cgbmV3IGkuT0F1dGgyRXJyb3IobnVsbCE9PShyPW4uZ2V0KFwiZXJyb3JfZGVzY3JpcHRpb25cIikpJiZ2b2lkIDAhPT1yP3I6XCJPQXV0aDIgZXJyb3JcIixuLmdldChcImVycm9yXCIpLDApO2lmKCFuLmhhcyhcImNvZGVcIikpdGhyb3cgbmV3IEVycm9yKGBUaGUgdXJsIGRpZCBub3QgY29udGFpbiBhIGNvZGUgcGFyYW1ldGVyICR7ZX1gKTtpZih0LnN0YXRlJiZ0LnN0YXRlIT09bi5nZXQoXCJzdGF0ZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSBcInN0YXRlXCIgcGFyYW1ldGVyIGluIHRoZSB1cmwgZGlkIG5vdCBtYXRjaCB0aGUgZXhwZWN0ZWQgdmFsdWUgb2YgJHt0LnN0YXRlfWApO3JldHVybntjb2RlOm4uZ2V0KFwiY29kZVwiKSxzY29wZTpuLmhhcyhcInNjb3BlXCIpP24uZ2V0KFwic2NvcGVcIikuc3BsaXQoXCIgXCIpOnZvaWQgMH19YXN5bmMgZ2V0VG9rZW4oZSl7Y29uc3QgdD17Z3JhbnRfdHlwZTpcImF1dGhvcml6YXRpb25fY29kZVwiLGNvZGU6ZS5jb2RlLHJlZGlyZWN0X3VyaTplLnJlZGlyZWN0VXJpLGNvZGVfdmVyaWZpZXI6ZS5jb2RlVmVyaWZpZXJ9O3JldHVybiB0aGlzLmNsaWVudC50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLmNsaWVudC5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHQpKX19LHQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9YXN5bmMgZnVuY3Rpb24oKXtjb25zdCBlPXMoKTtpZihlKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KDMyKTtyZXR1cm4gZS5nZXRSYW5kb21WYWx1ZXModCksYyh0KX17Y29uc3QgZT1yKDIxMik7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2UucmFuZG9tQnl0ZXMoMzIsKChlLG4pPT57ZSYmcihlKSx0KG4udG9TdHJpbmcoXCJiYXNlNjR1cmxcIikpfSkpfSkpfX0sdC5nZXRDb2RlQ2hhbGxlbmdlPW99LDQ0MzooZSx0KT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuT0F1dGgyRXJyb3I9dm9pZCAwO2NsYXNzIHIgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihlLHQscil7c3VwZXIoZSksdGhpcy5vYXV0aDJDb2RlPXQsdGhpcy5odHRwQ29kZT1yfX10Lk9BdXRoMkVycm9yPXJ9LDEzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJGZXRjaD12b2lkIDAsdC5PQXV0aDJGZXRjaD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLnRva2VuPW51bGwsdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsLHRoaXMuYWN0aXZlUmVmcmVzaD1udWxsLHRoaXMucmVmcmVzaFRpbWVyPW51bGwsdm9pZCAwPT09KG51bGw9PWU/dm9pZCAwOmUuc2NoZWR1bGVSZWZyZXNoKSYmKGUuc2NoZWR1bGVSZWZyZXNoPSEwKSx0aGlzLm9wdGlvbnM9ZSxlLmdldFN0b3JlZFRva2VuJiYodGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj0oYXN5bmMoKT0+e3RoaXMudG9rZW49YXdhaXQgZS5nZXRTdG9yZWRUb2tlbigpLHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49bnVsbH0pKCkpLHRoaXMuc2NoZWR1bGVSZWZyZXNoKCl9YXN5bmMgZmV0Y2goZSx0KXtjb25zdCByPW5ldyBSZXF1ZXN0KGUsdCk7cmV0dXJuIHRoaXMubXcoKShyLChlPT5mZXRjaChlKSkpfW13KCl7cmV0dXJuIGFzeW5jKGUsdCk9Pntjb25zdCByPWF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtsZXQgbj1lLmNsb25lKCk7bi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityKTtsZXQgaT1hd2FpdCB0KG4pO2lmKCFpLm9rJiY0MDE9PT1pLnN0YXR1cyl7Y29uc3Qgcj1hd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO249ZS5jbG9uZSgpLG4uaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsXCJCZWFyZXIgXCIrci5hY2Nlc3NUb2tlbiksaT1hd2FpdCB0KG4pfXJldHVybiBpfX1hc3luYyBnZXRUb2tlbigpe3JldHVybiB0aGlzLnRva2VuJiYobnVsbD09PXRoaXMudG9rZW4uZXhwaXJlc0F0fHx0aGlzLnRva2VuLmV4cGlyZXNBdD5EYXRlLm5vdygpKT90aGlzLnRva2VuOnRoaXMucmVmcmVzaFRva2VuKCl9YXN5bmMgZ2V0QWNjZXNzVG9rZW4oKXtyZXR1cm4gYXdhaXQgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiwoYXdhaXQgdGhpcy5nZXRUb2tlbigpKS5hY2Nlc3NUb2tlbn1hc3luYyByZWZyZXNoVG9rZW4oKXt2YXIgZSx0O2lmKHRoaXMuYWN0aXZlUmVmcmVzaClyZXR1cm4gdGhpcy5hY3RpdmVSZWZyZXNoO2NvbnN0IHI9dGhpcy50b2tlbjt0aGlzLmFjdGl2ZVJlZnJlc2g9KGFzeW5jKCk9Pnt2YXIgZSx0O2xldCBuPW51bGw7dHJ5eyhudWxsPT1yP3ZvaWQgMDpyLnJlZnJlc2hUb2tlbikmJihuPWF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKHIpKX1jYXRjaChlKXtjb25zb2xlLndhcm4oXCJbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2UnbGwgdHJ5IHJlYXV0aGVudGljYXRpbmdcIil9aWYobnx8KG49YXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCkpLCFuKXtjb25zdCByPW5ldyBFcnJvcihcIlVuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkXCIpO3Rocm93IG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLm9uRXJyb3IpfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSxyfXJldHVybiBufSkoKTt0cnl7Y29uc3Qgcj1hd2FpdCB0aGlzLmFjdGl2ZVJlZnJlc2g7cmV0dXJuIHRoaXMudG9rZW49cixudWxsPT09KHQ9KGU9dGhpcy5vcHRpb25zKS5zdG9yZVRva2VuKXx8dm9pZCAwPT09dHx8dC5jYWxsKGUsciksdGhpcy5zY2hlZHVsZVJlZnJlc2goKSxyfWNhdGNoKGUpe3Rocm93IHRoaXMub3B0aW9ucy5vbkVycm9yJiZ0aGlzLm9wdGlvbnMub25FcnJvcihlKSxlfWZpbmFsbHl7dGhpcy5hY3RpdmVSZWZyZXNoPW51bGx9fXNjaGVkdWxlUmVmcmVzaCgpe3ZhciBlO2lmKCF0aGlzLm9wdGlvbnMuc2NoZWR1bGVSZWZyZXNoKXJldHVybjtpZih0aGlzLnJlZnJlc2hUaW1lciYmKGNsZWFyVGltZW91dCh0aGlzLnJlZnJlc2hUaW1lciksdGhpcy5yZWZyZXNoVGltZXI9bnVsbCksIShudWxsPT09KGU9dGhpcy50b2tlbil8fHZvaWQgMD09PWU/dm9pZCAwOmUuZXhwaXJlc0F0KXx8IXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKXJldHVybjtjb25zdCB0PXRoaXMudG9rZW4uZXhwaXJlc0F0LURhdGUubm93KCk7dDwxMmU0fHwodGhpcy5yZWZyZXNoVGltZXI9c2V0VGltZW91dCgoYXN5bmMoKT0+e3RyeXthd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoXCJbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaFwiLGUpfX0pLHQtNmU0KSl9fX0sMjEyOigpPT57fX0sdD17fTtmdW5jdGlvbiByKG4pe3ZhciBpPXRbbl07aWYodm9pZCAwIT09aSlyZXR1cm4gaS5leHBvcnRzO3ZhciBvPXRbbl09e2V4cG9ydHM6e319O3JldHVybiBlW25dKG8sby5leHBvcnRzLHIpLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4oKCk9PntcInVzZSBzdHJpY3RcIjt2YXIgZT1uO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuT0F1dGgyRXJyb3I9ZS5PQXV0aDJGZXRjaD1lLmdlbmVyYXRlQ29kZVZlcmlmaWVyPWUuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQ9ZS5PQXV0aDJDbGllbnQ9dm9pZCAwO3ZhciB0PXIoOTM0KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkNsaWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0Lk9BdXRoMkNsaWVudH19KTt2YXIgaT1yKDYxOCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiZ2VuZXJhdGVDb2RlVmVyaWZpZXJcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5nZW5lcmF0ZUNvZGVWZXJpZmllcn19KTt2YXIgbz1yKDEzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkZldGNoXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG8uT0F1dGgyRmV0Y2h9fSk7dmFyIHM9cig0NDMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRXJyb3JcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcy5PQXV0aDJFcnJvcn19KX0pKCksbn0pKCkpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2F1dGgyLWNsaWVudC5taW4uanMubWFwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIDxhdXRvLWdlbmVyYXRlZD5cclxuLy8gICAgIEdlbmVyYXRlZCB1c2luZyB0aGUgTlN3YWcgdG9vbGNoYWluIHYxMy4yMC4wLjAgKE5Kc29uU2NoZW1hIHYxMC45LjAuMCAoTmV3dG9uc29mdC5Kc29uIHYxMy4wLjAuMCkpIChodHRwOi8vTlN3YWcub3JnKVxyXG4vLyA8L2F1dG8tZ2VuZXJhdGVkPlxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbi8vIFJlU2hhcnBlciBkaXNhYmxlIEluY29uc2lzdGVudE5hbWluZ1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudCB7XHJcbiAgICBwcml2YXRlIGh0dHA6IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfTtcclxuICAgIHByaXZhdGUgYmFzZVVybDogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIGpzb25QYXJzZVJldml2ZXI6ICgoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IGFueSkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZVVybD86IHN0cmluZywgaHR0cD86IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfSkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IGh0dHAgPyBodHRwIDogd2luZG93IGFzIGFueTtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsICE9PSB1bmRlZmluZWQgJiYgYmFzZVVybCAhPT0gbnVsbCA/IGJhc2VVcmwgOiBcIi9hcGkvZWJheS92MVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBhbGwgcHJvZHVjdHNcclxuICAgICAqIEByZXR1cm4gT0tcclxuICAgICAqL1xyXG4gICAgZ2V0QWxsUHJvZHVjdHMoKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0QWxsUHJvZHVjdHMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldEFsbFByb2R1Y3RzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goUHJvZHVjdFdpdGhJZC5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8UHJvZHVjdFdpdGhJZFtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2R1Y3QocHJvZHVjdDogUHJvZHVjdFdpdGhvdXRJZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NDcmVhdGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDcmVhdGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IHJlc3VsdERhdGEyMDAgIT09IHVuZGVmaW5lZCA/IHJlc3VsdERhdGEyMDAgOiA8YW55Pm51bGw7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHN0cmluZz4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBkYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBkYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBEZWxldGVkXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVByb2R1Y3QoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NEZWxldGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NEZWxldGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXJrUHJvZHVjdEFzQ2hlY2tlZFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIG1hcmtQcm9kdWN0QXNDaGVja2VkKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH0vbWFya19hc19jaGVja2VkL1wiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzTWFya1Byb2R1Y3RBc0NoZWNrZWQoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc01hcmtQcm9kdWN0QXNDaGVja2VkKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LvQvtGC0LVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgdXBzZXJ0TG90SW5mbyhsb3RJbmZvOiBMb3RJbmZvLCBwcm9kdWN0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve3Byb2R1Y3RJZH0vbG90cy9cIjtcclxuICAgICAgICBpZiAocHJvZHVjdElkID09PSB1bmRlZmluZWQgfHwgcHJvZHVjdElkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdwcm9kdWN0SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntwcm9kdWN0SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgcHJvZHVjdElkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBzZXJ0TG90SW5mbyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBzZXJ0TG90SW5mbyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdEluZm8obG90SWQ6IG51bWJlcik6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdHMve2xvdElkfS9cIjtcclxuICAgICAgICBpZiAobG90SWQgPT09IHVuZGVmaW5lZCB8fCBsb3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnbG90SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntsb3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBsb3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDIwMCA9IExvdEluZm9XaXRoUHJvZHVjdElkLmZyb21KUyhyZXN1bHREYXRhMjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRg9GH0YLQtdC90L3Ri9GFINC70L7RgtCw0YVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TG90U3RhdGVzKGxvdElkczogbnVtYmVyW10pOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdF9zdGF0ZV9yZXF1ZXN0cy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdElkcyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RTdGF0ZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdFN0YXRlcyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChMb3RTdGF0ZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90U3RhdGVbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC00LDQtdGCINC/0LXRgNC10YfQtdC90Ywg0LLQvtC30LzQvtC20L3Ri9GFINGB0L7RgdGC0L7Rj9C90LjQuSDQv9GA0L7QtNCw0LLQsNC10LzQvtCz0L4g0YLQvtCy0LDRgNCwXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldE1hbnVhbENvbmRpdGlvbnNMaXN0KCk6IFByb21pc2U8TWFudWFsQ29uZGl0aW9uW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL21hbnVhbF9jb25kaXRpb25zL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldE1hbnVhbENvbmRpdGlvbnNMaXN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTWFudWFsQ29uZGl0aW9uLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxNYW51YWxDb25kaXRpb25bXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZSBFcnJvclxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBzYXZlRXJyb3IoZXJyb3I6IENsaWVudEVycm9ySW5mbyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvZXJyb3IvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1NhdmVFcnJvcihfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzU2F2ZUVycm9yKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0V2l0aG91dElkIGltcGxlbWVudHMgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJpZXMhOiBTZWFyY2hRdWVyeVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvZHVjdFdpdGhvdXRJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzIS5wdXNoKFNlYXJjaFF1ZXJ5LmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9kdWN0V2l0aG91dElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHJvZHVjdFdpdGhvdXRJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VhcmNoUXVlcmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNlYXJjaFF1ZXJpZXMpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzOiBTZWFyY2hRdWVyeVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aElkIHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIGxhc3RDaGVja1RpbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWFyY2hRdWVyaWVzITogU2VhcmNoUXVlcnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRoSWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJOYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RDaGVja1RpbWUgPSBfZGF0YVtcIkxhc3RDaGVja1RpbWVcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyEucHVzaChTZWFyY2hRdWVyeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRoSWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiSWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJMYXN0Q2hlY2tUaW1lXCJdID0gdGhpcy5sYXN0Q2hlY2tUaW1lO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VhcmNoUXVlcmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNlYXJjaFF1ZXJpZXMpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgbGFzdENoZWNrVGltZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlYXJjaFF1ZXJpZXM6IFNlYXJjaFF1ZXJ5W107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hRdWVyeSBpbXBsZW1lbnRzIElTZWFyY2hRdWVyeSB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIHF1ZXJ5ITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJU2VhcmNoUXVlcnkpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiaWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMucXVlcnkgPSBfZGF0YVtcInF1ZXJ5XCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFNlYXJjaFF1ZXJ5IHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2VhcmNoUXVlcnkoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiaWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJxdWVyeVwiXSA9IHRoaXMucXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNlYXJjaFF1ZXJ5IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBxdWVyeTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mb1dpdGhQcm9kdWN0SWQgaW1wbGVtZW50cyBJTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgcHJvZHVjdElkITogc3RyaW5nO1xyXG4gICAgbG90SW5mbyE6IExvdEluZm87XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9kdWN0SWQgPSBfZGF0YVtcInByb2R1Y3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb3RJbmZvID0gX2RhdGFbXCJsb3RJbmZvXCJdID8gTG90SW5mby5mcm9tSlMoX2RhdGFbXCJsb3RJbmZvXCJdKSA6IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvV2l0aFByb2R1Y3RJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcm9kdWN0SWRcIl0gPSB0aGlzLnByb2R1Y3RJZDtcclxuICAgICAgICBkYXRhW1wibG90SW5mb1wiXSA9IHRoaXMubG90SW5mbyA/IHRoaXMubG90SW5mby50b0pTT04oKSA6IDxhbnk+dW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICBwcm9kdWN0SWQ6IHN0cmluZztcclxuICAgIGxvdEluZm86IExvdEluZm87XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RJbmZvIGltcGxlbWVudHMgSUxvdEluZm8ge1xyXG4gICAgbG90SWQhOiBudW1iZXI7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgcGNzITogbnVtYmVyO1xyXG4gICAgY3VycmVuY3khOiBzdHJpbmc7XHJcbiAgICBwcmljZSE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlciE6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbiE6IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQhOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3RvcnkhOiBQdXJjaGFzZUluZm9bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucGNzID0gX2RhdGFbXCJwY3NcIl07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVuY3kgPSBfZGF0YVtcImN1cnJlbmN5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZyA9IF9kYXRhW1wic2hpcHBpbmdcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsID0gX2RhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gX2RhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWxsZXIgPSBfZGF0YVtcInNlbGxlclwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVkSW4gPSBfZGF0YVtcImxvY2F0ZWRJblwiXTtcclxuICAgICAgICAgICAgdGhpcy5pZ25vcmVUaGF0TG90ID0gX2RhdGFbXCJpZ25vcmVUaGF0TG90XCJdO1xyXG4gICAgICAgICAgICB0aGlzLm1hbnVhbENvbmRpdGlvbklkID0gX2RhdGFbXCJtYW51YWxDb25kaXRpb25JZFwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkhLnB1c2goUHVyY2hhc2VJbmZvLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcIm5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgZGF0YVtcInBjc1wiXSA9IHRoaXMucGNzO1xyXG4gICAgICAgIGRhdGFbXCJjdXJyZW5jeVwiXSA9IHRoaXMuY3VycmVuY3k7XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdcIl0gPSB0aGlzLnNoaXBwaW5nO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl0gPSB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJzZWxsZXJcIl0gPSB0aGlzLnNlbGxlcjtcclxuICAgICAgICBkYXRhW1wibG9jYXRlZEluXCJdID0gdGhpcy5sb2NhdGVkSW47XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdGhpcy5tYW51YWxDb25kaXRpb25JZDtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnB1cmNoYXNlSGlzdG9yeSkpIHtcclxuICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMucHVyY2hhc2VIaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcInB1cmNoYXNlSGlzdG9yeVwiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mbyB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgcGNzOiBudW1iZXI7XHJcbiAgICBjdXJyZW5jeTogc3RyaW5nO1xyXG4gICAgcHJpY2U6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbjogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uRGVzY3JpcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWxsZXI6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbjogc3RyaW5nO1xyXG4gICAgaWdub3JlVGhhdExvdDogYm9vbGVhbjtcclxuICAgIG1hbnVhbENvbmRpdGlvbklkOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3Rvcnk6IFB1cmNoYXNlSW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHVyY2hhc2VJbmZvIGltcGxlbWVudHMgSVB1cmNoYXNlSW5mbyB7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHF1YW50aXR5ITogbnVtYmVyO1xyXG4gICAgZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVB1cmNoYXNlSW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5xdWFudGl0eSA9IF9kYXRhW1wicXVhbnRpdHlcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZSA9IF9kYXRhW1wiZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQdXJjaGFzZUluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQdXJjaGFzZUluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJxdWFudGl0eVwiXSA9IHRoaXMucXVhbnRpdHk7XHJcbiAgICAgICAgZGF0YVtcImRhdGVcIl0gPSB0aGlzLmRhdGU7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVB1cmNoYXNlSW5mbyB7XHJcbiAgICBwcmljZT86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHF1YW50aXR5OiBudW1iZXI7XHJcbiAgICBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYW51YWxDb25kaXRpb24gaW1wbGVtZW50cyBJTWFudWFsQ29uZGl0aW9uIHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElNYW51YWxDb25kaXRpb24pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiaWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IE1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hbnVhbENvbmRpdGlvbigpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJpZFwiXSA9IHRoaXMuaWQ7XHJcbiAgICAgICAgZGF0YVtcImRlc2NyaXB0aW9uXCJdID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWFudWFsQ29uZGl0aW9uIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90U3RhdGUgaW1wbGVtZW50cyBJTG90U3RhdGUge1xyXG4gICAgbG90SWQhOiBudW1iZXI7XHJcbiAgICBpZ25vcmVUaGF0TG90ITogYm9vbGVhbjtcclxuICAgIGxhc3RVcGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RTdGF0ZSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pZ25vcmVUaGF0TG90ID0gX2RhdGFbXCJpZ25vcmVUaGF0TG90XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBfZGF0YVtcImxhc3RVcGRhdGVcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90U3RhdGUge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RTdGF0ZSgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcImlnbm9yZVRoYXRMb3RcIl0gPSB0aGlzLmlnbm9yZVRoYXRMb3Q7XHJcbiAgICAgICAgZGF0YVtcImxhc3RVcGRhdGVcIl0gPSB0aGlzLmxhc3RVcGRhdGU7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdFN0YXRlIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBpZ25vcmVUaGF0TG90OiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpZW50RXJyb3JJbmZvIGltcGxlbWVudHMgSUNsaWVudEVycm9ySW5mbyB7XHJcbiAgICB1cmwhOiBzdHJpbmc7XHJcbiAgICBlcnJvciE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUNsaWVudEVycm9ySW5mbykge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnVybCA9IF9kYXRhW1widXJsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yID0gX2RhdGFbXCJlcnJvclwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBDbGllbnRFcnJvckluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBDbGllbnRFcnJvckluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1widXJsXCJdID0gdGhpcy51cmw7XHJcbiAgICAgICAgZGF0YVtcImVycm9yXCJdID0gdGhpcy5lcnJvcjtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2xpZW50RXJyb3JJbmZvIHtcclxuICAgIHVybDogc3RyaW5nO1xyXG4gICAgZXJyb3I6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gX2RhdGFbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gX2RhdGFbXCJ0aXRsZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBfZGF0YVtcInN0YXR1c1wiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBfZGF0YVtcImRldGFpbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSA9IF9kYXRhW1wiaW5zdGFuY2VcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYWJzdHJhY3QgY2xhc3MgJ1Byb2JsZW1EZXRhaWxlZEluZm8nIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1widHlwZVwiXSA9IHRoaXMudHlwZTtcclxuICAgICAgICBkYXRhW1widGl0bGVcIl0gPSB0aGlzLnRpdGxlO1xyXG4gICAgICAgIGRhdGFbXCJzdGF0dXNcIl0gPSB0aGlzLnN0YXR1cztcclxuICAgICAgICBkYXRhW1wiZGV0YWlsXCJdID0gdGhpcy5kZXRhaWw7XHJcbiAgICAgICAgZGF0YVtcImluc3RhbmNlXCJdID0gdGhpcy5pbnN0YW5jZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlci5pbml0KF9kYXRhKTtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBfZGF0YVtcImVycm9yc1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZXJyb3JzXCJdID0gdGhpcy5lcnJvcnM7XHJcbiAgICAgICAgc3VwZXIudG9KU09OKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzMiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZXJyb3JzXCJdID0gdGhpcy5lcnJvcnM7XHJcbiAgICAgICAgc3VwZXIudG9KU09OKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9yczIgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMgaW1wbGVtZW50cyBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yczIgaW1wbGVtZW50cyBJRXJyb3JzMiB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJRXJyb3JzMikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9yczIge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMyKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHRoaXNbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JzMiB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgc3RhdHVzOiBudW1iZXI7XHJcbiAgICByZXNwb25zZTogc3RyaW5nO1xyXG4gICAgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH07XHJcbiAgICByZXN1bHQ6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0OiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBpc0FwaUV4Y2VwdGlvbiA9IHRydWU7XHJcblxyXG4gICAgc3RhdGljIGlzQXBpRXhjZXB0aW9uKG9iajogYW55KTogb2JqIGlzIEFwaUV4Y2VwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG9iai5pc0FwaUV4Y2VwdGlvbiA9PT0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGhyb3dFeGNlcHRpb24obWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdD86IGFueSk6IGFueSB7XHJcbiAgICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRocm93IHJlc3VsdDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aHJvdyBuZXcgQXBpRXhjZXB0aW9uKG1lc3NhZ2UsIHN0YXR1cywgcmVzcG9uc2UsIGhlYWRlcnMsIG51bGwpO1xyXG59IiwiaW1wb3J0IHtPQXV0aDJDbGllbnQsIE9BdXRoMlRva2VufSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuXHJcblxyXG50eXBlIE9BdXRoMkZldGNoT3B0aW9ucyA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyZW5jZSB0byBPQXV0aDIgY2xpZW50LlxyXG4gICAgICovXHJcbiAgICBjbGllbnQ6IE9BdXRoMkNsaWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFlvdSBhcmUgcmVzcG9uc2libGUgZm9yIGltcGxlbWVudGluZyB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgICogaXQncyBwdXJwb3NlIGlzIHRvIHN1cHBseSB0aGUgJ2luaXRpYWwnIG9hdXRoMiB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIGBudWxsYCB0byBmYWlsIHRoZSBwcm9jZXNzLlxyXG4gICAgICovXHJcbiAgICBnZXROZXdUb2tlbigpOiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBzZXQsIHdpbGwgYmUgY2FsbGVkIGlmIGF1dGhlbnRpY2F0aW9uIGZhdGFsbHkgZmFpbGVkLlxyXG4gICAgICovXHJcbiAgICBvbkVycm9yPzogKGVycjogRXJyb3IpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgYWN0aXZlIHRva2VuIGNoYW5nZXMuIFVzaW5nIHRoaXMgaXNcclxuICAgICAqIG9wdGlvbmFsLCBidXQgaXQgbWF5IGJlIHVzZWQgdG8gKGZvciBleGFtcGxlKSBwdXQgdGhlIHRva2VuIGluIG9mZi1saW5lXHJcbiAgICAgKiBzdG9yYWdlIGZvciBsYXRlciB1c2FnZS5cclxuICAgICAqL1xyXG4gICAgc3RvcmVUb2tlbj86ICh0b2tlbjogT0F1dGgyVG9rZW4pID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbHNvIGFuIG9wdGlvbmFsIGZlYXR1cmUuIEltcGxlbWVudCB0aGlzIGlmIHlvdSB3YW50IHRoZSB3cmFwcGVyIHRvIHRyeSBhXHJcbiAgICAgKiBzdG9yZWQgdG9rZW4gYmVmb3JlIGF0dGVtcHRpbmcgYSBmdWxsIHJlLWF1dGhlbnRpY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gbnVsbCBpZiB0aGVyZSB3YXMgbm8gdG9rZW4uXHJcbiAgICAgKi9cclxuICAgIGdldFN0b3JlZFRva2VuPzogKCkgPT4gT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IHNjaGVkdWxlIHRva2VuIHJlZnJlc2guXHJcbiAgICAgKlxyXG4gICAgICogQ2VydGFpbiBleGVjdXRpb24gZW52aXJvbm1lbnRzLCBlLmcuIFJlYWN0IE5hdGl2ZSwgZG8gbm90IGhhbmRsZSBzY2hlZHVsZWRcclxuICAgICAqIHRhc2tzIHdpdGggc2V0VGltZW91dCgpIGluIGEgZ3JhY2VmdWwgb3IgcHJlZGljdGFibGUgZmFzaGlvbi4gVGhlIGRlZmF1bHRcclxuICAgICAqIGJlaGF2aW9yIGlzIHRvIHNjaGVkdWxlIHJlZnJlc2guIFNldCB0aGlzIHRvIGZhbHNlIHRvIGRpc2FibGUgc2NoZWR1bGluZy5cclxuICAgICAqL1xyXG4gICAgc2NoZWR1bGVSZWZyZXNoPzogYm9vbGVhbjtcclxuXHJcbiAgICBmZXRjaD86IHR5cGVvZiBmZXRjaDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZldGNoV3JhcHBlckN1c3RvbSB7XHJcblxyXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDdXJyZW50IGFjdGl2ZSB0b2tlbiAoaWYgYW55KVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIHVzZXIgaGFkIGEgc3RvcmVkVG9rZW4sIHRoZSBwcm9jZXNzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBtYXkgYmUgYXN5bmMuIFdlIGtlZXAgdHJhY2sgb2YgdGhpcyBwcm9jZXNzIGluIHRoaXNcclxuICAgICAqIHByb21pc2UsIHNvIGl0IG1heSBiZSBhd2FpdGVkIHRvIGF2b2lkIHJhY2UgY29uZGl0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBBcyBzb29uIGFzIHRoaXMgcHJvbWlzZSByZXNvbHZlcywgdGhpcyBwcm9wZXJ0eSBnZXQgbnVsbGVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZUdldFN0b3JlZFRva2VuOiBudWxsIHwgUHJvbWlzZTx2b2lkPiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zKSB7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zPy5zY2hlZHVsZVJlZnJlc2ggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNjaGVkdWxlUmVmcmVzaCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gYXdhaXQgb3B0aW9ucy5nZXRTdG9yZWRUb2tlbiEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvZXMgYSBmZXRjaCByZXF1ZXN0IGFuZCBhZGRzIGEgQmVhcmVyIC8gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCB0aGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBmaXJzdC4gSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBhbG1vc3QgZXhwaXJpbmcsIHRoaXMgZnVuY3Rpb24gbWlnaHQgYXR0ZW1wdFxyXG4gICAgICogdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZmV0Y2goaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgICAgICBpZiAoaW5pdC5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYWNjZXNzVG9rZW5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnMgPSB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgYWNjZXNzVG9rZW59XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgbmV3VG9rZW5cclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgdG9rZW4gaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhlcmUgcmVzdWx0IG9iamVjdCB3aWxsIGhhdmU6XHJcbiAgICAgKiAgICogYWNjZXNzVG9rZW5cclxuICAgICAqICAgKiBleHBpcmVzQXQgLSB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBudWxsLlxyXG4gICAgICogICAqIHJlZnJlc2hUb2tlbiAtIG1heSBiZSBudWxsXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGF0dGVtcHQgdG8gYXV0b21hdGljYWxseSByZWZyZXNoIGlmIHN0YWxlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLmV4cGlyZXNBdCA9PT0gbnVsbCB8fCB0aGlzLnRva2VuLmV4cGlyZXNBdCA+IERhdGUubm93KCkpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgY3VycmVudCB0b2tlbiBpcyBzdGlsbCB2YWxpZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgY3VycmVudCBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCBpdCB3aWxsIGF0dGVtcHQgdG8gZmV0Y2ggaXQuXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGV4cGlyaW5nLCBpdCB3aWxsIGF0dGVtcHQgdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0QWNjZXNzVG9rZW4oKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgLy8gRW5zdXJlIGdldFN0b3JlZFRva2VuIGZpbmlzaGVkLlxyXG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW47XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiB0b2tlbi5hY2Nlc3NUb2tlbjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBLZWVwaW5nIHRyYWNrIG9mIGFuIGFjdGl2ZSByZWZyZXNoVG9rZW4gb3BlcmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgd2lsbCBhbGxvdyB1cyB0byBlbnN1cmUgb25seSAxIHN1Y2ggb3BlcmF0aW9uIGhhcHBlbnMgYXQgYW55XHJcbiAgICAgKiBnaXZlbiB0aW1lLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZVJlZnJlc2g6IFByb21pc2U8T0F1dGgyVG9rZW4+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZXMgYW4gYWNjZXNzIHRva2VuIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgY3VycmVudGx5IGFscmVhZHkgZG9pbmcgdGhpcyBvcGVyYXRpb24sXHJcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBkbyBpdCB0d2ljZSBpbiBwYXJhbGxlbC5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZFRva2VuID0gdGhpcy50b2tlbjtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSAoYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1Rva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRUb2tlbj8ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGFkIGEgcmVmcmVzaCB0b2tlbiwgbGV0cyBzZWUgaWYgd2UgY2FuIHVzZSBpdCFcclxuICAgICAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKG9sZFRva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZVxcJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yPy4oZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VG9rZW47XHJcblxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zdG9yZVRva2VuPy4odG9rZW4pO1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY2xlYXIgdGhlIGN1cnJlbnQgcmVmcmVzaCBvcGVyYXRpb24uXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRpbWVyIHRyaWdnZXIgZm9yIHRoZSBuZXh0IGF1dG9tYXRlZCByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc2NoZWR1bGVSZWZyZXNoKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lcikge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4/LmV4cGlyZXNBdCB8fCAhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBkb24ndCBoYXZlIGEgcmVmcmVzaF90b2tlbiwgZG9uJ3QgYm90aGVyLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSB0aGlzLnRva2VuLmV4cGlyZXNBdCAtIERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgc2NoZWR1bGUgdGhpcyBldmVudCBpZiBpdCBoYXBwZW5zIG1vcmUgdGhhbiAyIG1pbnV0ZXMgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICBpZiAoZXhwaXJlc0luIDwgMTIwICogMTAwMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTY2hlZHVsZSAxIG1pbnV0ZSBiZWZvcmUgZXhwaXJ5XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoJywgZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGV4cGlyZXNJbiAtIDYwICogMTAwMCk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgQ2xpZW50LCBDbGllbnRFcnJvckluZm8sXHJcbiAgICBMb3RJbmZvLFxyXG4gICAgTG90SW5mb1dpdGhQcm9kdWN0SWQsIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyxcclxuICAgIFB1cmNoYXNlSW5mbywgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm9cclxufSBmcm9tIFwiLi9FYmF5Q2xpZW50L0ViYXlDbGllbnRcIlxyXG5cclxuaW1wb3J0IHtnZW5lcmF0ZUNvZGVWZXJpZmllciwgT0F1dGgyQ2xpZW50fSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuaW1wb3J0IHtGZXRjaFdyYXBwZXJDdXN0b219IGZyb20gXCIuL0ZldGNoV3JhcHBlckN1c3RvbVwiO1xyXG5cclxuY29uc3QgaWdub3JlVGhhdExvdEZpZWxkTmFtZSA9IFwiaWdub3JlVGhhdExvdFwiO1xyXG5jb25zdCBtYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZSA9IFwibWFudWFsQ29uZGl0aW9uSWRcIjtcclxuY29uc3QgcHJvZHVjdEZpZWxkTmFtZSA9IFwicHJvZHVjdElkXCI7XHJcbmNvbnN0IHBjc0ZpZWxkTmFtZSA9IFwicGNzXCI7XHJcblxyXG5jb25zdCBwYW5lbENsYXNzID0gXCJwYW5lbC1kaXZcIjtcclxuY29uc3QgZm9ybUlkID0gXCJwcm9kdWN0LWZvcm0taWRcIlxyXG5jb25zdCBlcnJvckVsZW1lbnRJZCA9IFwiZXJyb3JFbGVtZW50XCJcclxuY29uc3Qgc3VibWl0SWQgPSBcInN1Ym1pdFwiXHJcbmNvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vbG9jYWxob3N0OjcwOTUvXCJcclxuLy9jb25zdCBiYWNrZW5kVXJsID0gXCJodHRwczovLzE3OC4yMDguNjUuMTAwOjE3NDQzL1wiXHJcbmNvbnN0IGJhc2VBcGlVcmwgPSBgJHtiYWNrZW5kVXJsfWFwaS9lYmF5L3YxYDtcclxuY29uc3QgYXV0aFJlZGlyZWN0VXJsID0gXCJodHRwczovL3d3dy5lYmF5LmNvbS9cIlxyXG5jb25zdCBub3RTZXRWYWx1ZSA9IFwibm90U2V0XCJcclxuY29uc3QgbGlnaHRHcmVlbkNvbG9yID0gXCIjZWNmZmVjXCJcclxuY29uc3QgbGlnaHRQaW5rQ29sb3IgPSBcImxpZ2h0cGlua1wiXHJcbmNvbnN0IGxpZ2h0WWVsbG93Q29sb3IgPSBcIiNlMGUwN2ZcIlxyXG5cclxuXHJcblxyXG5jb25zdCBsb3RJbmZvID0gbmV3IExvdEluZm8oKTtcclxubGV0IF9zZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZDtcclxuXHJcbi8vIGZldGNoINGH0LXRgNC10LcgYmFja2dyb3VuZCBzY3JpcHQsINC/0L4g0LTRgNGD0LPQvtC80YMg0L3QtSDRgNCw0LHQvtGC0LDQtdGCXHJcbmZ1bmN0aW9uIGZldGNoUmVzb3VyY2UoaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2lucHV0LCBpbml0fSwgbWVzc2FnZVJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgW3Jlc3BvbnNlLCBlcnJvcl0gPSBtZXNzYWdlUmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSB1bmRlZmluZWQgb24gYSAyMDQgLSBObyBDb250ZW50XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gcmVzcG9uc2UuYm9keSA/IG5ldyBCbG9iKFtyZXNwb25zZS5ib2R5XSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBleHRyYWN0UHJpY2UocHJpY2U6IHN0cmluZyk6IFByaWNlIHtcclxuICAgIGxldCBtYXRjaGVzID0gcHJpY2UubWF0Y2goLyhcXEQrKShcXGQrKD86WywuXVxcZCspPykvKVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJpY2UocGFyc2VGbG9hdChtYXRjaGVzWzJdLnJlcGxhY2UoJywnLCAnLicpKSwgbWF0Y2hlc1sxXS50cmltKCkpXHJcbn1cclxuXHJcbmNsYXNzIFByaWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByaWNlOiBudW1iZXIsIGN1cnJlbmN5OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW5jeSA9IGN1cnJlbmN5XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlXHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IHN0eWxlcyA9IGBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgcGFkZGluZzogMTVweDtcclxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzAwMDBjYztcclxuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgY29sb3I6ICMwMDAwY2M7XHJcbiAgICAgIHBvc2l0aW9uOmZpeGVkO1xyXG4gICAgICB6LWluZGV4OjEwMDtcclxuICAgICAgbGVmdDoxJTtcclxuICAgICAgYm90dG9tOjUlO1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWwge1xyXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGlucHV0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBzZWxlY3Qge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsOmFmdGVyIHsgY29udGVudDogXCI6IFwiIH1cclxuYFxyXG5cclxuICAgIGxldCBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpXHJcbiAgICBzdHlsZVNoZWV0LmlubmVyVGV4dCA9IHN0eWxlc1xyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGVTaGVldClcclxuXHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChwYW5lbENsYXNzKTtcclxuXHJcblxyXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJylcclxuICAgIGZvcm0uaWQgPSBmb3JtSWRcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBkb21haW4gPSBsb2NhdGlvbi5ob3N0bmFtZTtcclxuXHJcbiAgICBsZXQgaGlzdG9yeUJ1dHRvbkhyZWYgPSBgaHR0cHM6Ly8ke2RvbWFpbn0vYmluL3B1cmNoYXNlSGlzdG9yeT9pdGVtPSR7aXRlbUlkfWA7XHJcbiAgICAvLyBsYW5ndWFnZT1IVE1MXHJcbiAgICBmb3JtLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8YSBocmVmPVwiJHtoaXN0b3J5QnV0dG9uSHJlZn1cIiB0YXJnZXQ9XCJfYmxhbmtcIj7QmNGB0YLQvtGA0LjRjyDQv9GA0L7QtNCw0LYg0LvQvtGC0LA8L2E+IFxyXG4gICAgICAgIDxicj7QkdGN0LrQtdC90LQ6IDxhIGhyZWY9XCIke2JhY2tlbmRVcmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtiYWNrZW5kVXJsfTwvYT5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCI+0JjQs9C90L7RgNC40YDQvtCy0LDRgtGMINC70L7RgjwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiIHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIj7QotC+0LLQsNGAPC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCIgaWQ9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7QktGL0LHQtdGA0LjRgtC1INGC0L7QstCw0YA8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cGNzRmllbGROYW1lfVwiPlBDUzwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtwY3NGaWVsZE5hbWV9XCIgdHlwZT1cIm51bWJlclwiIG5hbWU9XCIke3Bjc0ZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPtCh0L7RgdGC0L7Rj9C90LjQtTwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIiBpZD1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7QktGL0LHQtdGA0LjRgtC1INCh0L7RgdGC0L7Rj9C90LjQtTwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6IHJlZDtcIiBpZD1cIiR7ZXJyb3JFbGVtZW50SWR9XCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7c3VibWl0SWR9XCIgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2F2ZVwiIGRpc2FibGVkLz5cclxuICAgIGA7XHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoZXZlbnQsIGNsaWVudClcclxuICAgIH0pO1xyXG5cclxuICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKVxyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PmV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgICAgIGxldCBpZ25vcmVUaGF0TG90ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2lnbm9yZVRoYXRMb3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZ25vcmVUaGF0TG90ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mb1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbG90SW5mb1snaWdub3JlVGhhdExvdCddID0gaWdub3JlVGhhdExvdDtcclxuXHJcbiAgICAgICAgaWYgKGlnbm9yZVRoYXRMb3QpIHtcclxuICAgICAgICAgICAgbG90SW5mby5wY3MgPSAxXHJcbiAgICAgICAgICAgIGxvdEluZm8ubWFudWFsQ29uZGl0aW9uSWQgPSBub3RTZXRWYWx1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIHRvIGJhY2tlbmQ6IFwiICsgSlNPTi5zdHJpbmdpZnkobG90SW5mbykpXHJcblxyXG5cclxuICAgICAgICBhd2FpdCBjbGllbnQudXBzZXJ0TG90SW5mbyhsb3RJbmZvLCBkYXRhLmdldCgncHJvZHVjdElkJykudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBhd2FpdCBzaG93QW5kU2F2ZUVycm9yKGVycm9yLCBjbGllbnQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxTb2xkSXRlbXNSZXN1bHQoZml4ZWRQcmljZVJvd3M6IEhUTUxUYWJsZVJvd0VsZW1lbnRbXSwgcmVzdWx0OiBQdXJjaGFzZUluZm9Jbm5lcltdKSB7XHJcbiAgICBmb3IgKGxldCBmaXhlZFByaWNlUm93IG9mIGZpeGVkUHJpY2VSb3dzKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbLi4uZml4ZWRQcmljZVJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCBwcmljZSA9IGNvbHVtbnNbMV1cclxuXHJcbiAgICAgICAgaWYgKHByaWNlID09PSBcIkV4cGlyZWRcIiB8fCBwcmljZSA9PT0gXCJEZWNsaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgIT09IFwiU29sZCBhcyBhIHNwZWNpYWwgb2ZmZXJcIiAmJiBwcmljZSAhPT0gXCJDb3VudGVyLW9mZmVyZWRcIiAmJiBwcmljZSAhPT0gXCJBY2NlcHRlZFwiKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJpY2VFeHRyYWN0ZWQgPSBleHRyYWN0UHJpY2UocHJpY2UpXHJcbiAgICAgICAgICAgIGlmIChwcmljZUV4dHJhY3RlZC5jdXJyZW5jeSAhPT0gbG90SW5mby5jdXJyZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImN1cnJlbmN5IGRvZXNuJ3QgbWF0Y2ggd2l0aCBsb3QgY3VycmVuY3lcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgUHVyY2hhc2VJbmZvSW5uZXIocGFyc2VJbnQoY29sdW1uc1syXSksIHBhcnNlRGF0ZShjb2x1bW5zWzNdKSwgcHJpY2VFeHRyYWN0ZWQpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFB1cmNoYXNlSW5mb0lubmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHF1YW50aXR5OiBudW1iZXIsIGRhdGU6IERhdGUsIHByaWNlPzogUHJpY2UgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlXHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlXHJcbiAgICB9XHJcblxyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIHByaWNlOiBQcmljZSB8IHVuZGVmaW5lZDtcclxuICAgIGRhdGU6IERhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVTdHJpbmcpOiBEYXRlIHtcclxuICAgIGxldCBtYXRjaGVzID0gZGF0ZVN0cmluZy5tYXRjaCgvKFxcZCtcXHNbQS16XStcXHNcXGQrKVxcc2F0XFxzKFxcZCspOihcXGQrKTooXFxkKykoYW18cG0pXFxzKFtBLXpdKykvKVxyXG5cclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShtYXRjaGVzWzFdICsgJyAwMDowMDowMC4wMDBaJykpXHJcblxyXG4gICAgZGF0ZS5zZXRVVENIb3VycyhwYXJzZUludChtYXRjaGVzWzJdKSk7XHJcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMocGFyc2VJbnQobWF0Y2hlc1szXSkpO1xyXG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKHBhcnNlSW50KG1hdGNoZXNbNF0pKTtcclxuXHJcbiAgICBpZiAobWF0Y2hlc1s1XSA9PT0gXCJwbVwiICYmIGRhdGUuZ2V0VVRDSG91cnMoKSAhPT0gMTIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSArIDEyKTtcclxuICAgIH1cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcImFtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpID09PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMTIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXRjaGVzWzZdID09PSBcIk1TS1wiKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0aW1lem9uZSBcIiArIG1hdGNoZXNbNl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTb2xkSXRlbXNQYWdlKHRleHQ6IHN0cmluZyk6IFB1cmNoYXNlSW5mb1tdIHtcclxuICAgIGxldCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHRleHQsIFwidGV4dC9odG1sXCIpXHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IG5ldyBBcnJheTxQdXJjaGFzZUluZm9Jbm5lcj4oKTtcclxuICAgIGxldCBmaXhlZFByaWNlQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2LmZpeGVkLXByaWNlIHRib2R5JylcclxuICAgIGlmIChmaXhlZFByaWNlQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgZml4ZWRQcmljZVJvd3MgPSBbLi4uZml4ZWRQcmljZUJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb2ZmZXJCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYub2ZmZXIgdGJvZHknKVxyXG4gICAgaWYgKG9mZmVyQmxvY2sgIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgb2ZmZXJSb3dzID0gWy4uLm9mZmVyQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KG9mZmVyUm93cywgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gYi5kYXRlLmdldFRpbWUoKSAtIGEuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICB9KS5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFB1cmNoYXNlSW5mbyh7XHJcbiAgICAgICAgICAgIGRhdGU6IHguZGF0ZS50b0lTT1N0cmluZygpLCBxdWFudGl0eTogeC5xdWFudGl0eSwgcHJpY2U6IHgucHJpY2U/LnByaWNlXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsSWQoKSB7XHJcbiAgICBsb3RJbmZvLmxvdElkID0gcGFyc2VJbnQobG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV0pO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJpY2UoKSB7XHJcbiAgICBsZXQgcHJpY2UgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXByaWNlLXByaW1hcnkgc3BhbicpKS5pbm5lclRleHQpXHJcbiAgICBsb3RJbmZvLnByaWNlID0gcHJpY2UucHJpY2VcclxuICAgIGxvdEluZm8uY3VycmVuY3kgPSBwcmljZS5jdXJyZW5jeVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTmFtZSgpIHtcclxuICAgIGxvdEluZm8ubmFtZSA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcudmltIGgxJykpLmlubmVyVGV4dFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsU2VsbGVyKCkge1xyXG4gICAgbG90SW5mby5zZWxsZXIgPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2Lngtc2VsbGVyY2FyZC1hdGZfX2luZm9fX2Fib3V0LXNlbGxlciBhJykpLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxDb25kaXRpb24oKSB7XHJcbiAgICBsb3RJbmZvLmNvbmRpdGlvbiA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1pdGVtLWNvbmRpdGlvbi10ZXh0IHNwYW4udXgtdGV4dHNwYW5zJykpLmlubmVyVGV4dFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LngtaXRlbS1jb25kaXRpb24tZGVzYycpXHJcbiAgICBpZiAoY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ICE9IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gKDxIVE1MRWxlbWVudD5jb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQpLmlubmVyVGV4dFxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCcJywgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCfigJ0nLCAnJylcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFNoaXBwaW5nKCkge1xyXG4gICAgbGV0IHNoaXBwaW5nRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuZC1zaGlwcGluZy1tYXh2aWV3JylcclxuICAgIGxldCBzaGlwcGluZ1JhdGVzQXZhaWxhYmxlID0gc2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcignZGl2LnV4LWxheW91dC1zZWN0aW9uX190ZXh0dWFsLWRpc3BsYXktLWFza1NlbGxlcicpID09PSBudWxsXHJcbiAgICBpZiAoc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSkge1xyXG4gICAgICAgIGxldCBzaGlwcGluZ1RhYmxlID0gc2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcigndGFibGUudXgtdGFibGUtc2VjdGlvbi13aXRoLWhpbnRzLS1zaGlwcGluZ1RhYmxlJylcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zSGVhZGVyID0gWy4uLnNoaXBwaW5nVGFibGUucXVlcnlTZWxlY3RvcigndGhlYWQnKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGgnKV1cclxuICAgICAgICBsZXQgZGVsaXZlcnlDb2x1bW5zVmFsdWVzID0gWy4uLnNoaXBwaW5nVGFibGUucXVlcnlTZWxlY3RvcigndGJvZHknKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcigndHInKVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nTWF4dmlld1ZhbHVlcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gZGVsaXZlcnlDb2x1bW5zSGVhZGVyW2ldLmlubmVyVGV4dFxyXG4gICAgICAgICAgICBzaGlwcGluZ01heHZpZXdWYWx1ZXNba2V5XSA9IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlc1tpXS5xdWVyeVNlbGVjdG9yKCdzcGFuJykuaW5uZXJUZXh0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydUbyddICE9PSAnR2VybWFueScpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwcGluZyBjb3VudHJ5IG11c3QgYmUgR2VybWFueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBwaW5nVmFsdWUgPSBzaGlwcGluZ01heHZpZXdWYWx1ZXNbJ1NoaXBwaW5nIGFuZCBoYW5kbGluZyddXHJcblxyXG4gICAgICAgIGlmIChzaGlwcGluZ1ZhbHVlICE9PSAnRnJlZSBzaGlwcGluZycpIHtcclxuICAgICAgICAgICAgbGV0IHNoaXBwaW5nUHJpY2UgPSBleHRyYWN0UHJpY2Uoc2hpcHBpbmdWYWx1ZSlcclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nUHJpY2UuY3VycmVuY3kgIT09IGxvdEluZm8uY3VycmVuY3kpIHRocm93IG5ldyBFcnJvcihcIlNoaXBwaW5nIGN1cnJlbmN5IG1pc21hdGNoIHdpdGggbG90IGN1cnJlbmN5XCIpXHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSBzaGlwcGluZ1ByaWNlLnByaWNlXHJcblxyXG4gICAgICAgICAgICBpZiAoc2hpcHBpbmdNYXh2aWV3VmFsdWVzLmhhc093blByb3BlcnR5KCdFYWNoIGFkZGl0aW9uYWwgaXRlbScpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVhY2hBZGRpdGlvbmFsID0gc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydFYWNoIGFkZGl0aW9uYWwgaXRlbSddXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVhY2hBZGRpdGlvbmFsICE9PSBcIkZyZWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlYWNoQWRkaXRpb25hbFByaWNlID0gZXh0cmFjdFByaWNlKGVhY2hBZGRpdGlvbmFsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlYWNoQWRkaXRpb25hbFByaWNlLmN1cnJlbmN5ICE9PSBsb3RJbmZvLmN1cnJlbmN5KSB0aHJvdyBuZXcgRXJyb3IoXCJFYWNoIGFkZGl0aW9uYWwgc2hpcHBpbmcgY3VycmVuY3kgbWlzbWF0Y2ggd2l0aCBsb3QgY3VycmVuY3lcIilcclxuICAgICAgICAgICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IGVhY2hBZGRpdGlvbmFsUHJpY2UucHJpY2VcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTG9jYXRlZEluKCkge1xyXG4gICAgbGV0IG1hdGNoID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi5kLXNoaXBwaW5nLW1pbnZpZXcnKSkuaW5uZXJUZXh0Lm1hdGNoKC9Mb2NhdGVkXFxzaW46XFxzKC4rKS8pXHJcbiAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmxvY2F0ZWRJbiA9IG1hdGNoWzFdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvdEluZm8ubG9jYXRlZEluID0gXCJVbmtub3duXCJcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbERlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGZvdW5kRWxlbWVudCA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZEFueSggWycjZGVzY19pZnInLCAnI3ZpX3NuaXBwZXRkZXNjX2J0biddKVxyXG4gICAgXHJcbiAgICBsZXQgZGVzY3JpcHRpb25VcmwgOiBzdHJpbmdcclxuICAgIGlmIChmb3VuZEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCkge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uVXJsID0gKDxIVE1MSUZyYW1lRWxlbWVudD5mb3VuZEVsZW1lbnQpLnNyY1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZm91bmRFbGVtZW50IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcclxuICAgICAgICBkZXNjcmlwdGlvblVybCA9ICg8SFRNTEFuY2hvckVsZW1lbnQ+Zm91bmRFbGVtZW50KS5ocmVmXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9uVXJsKVxyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShkZXNjcmlwdGlvblVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgbG90SW5mby5kZXNjcmlwdGlvbiA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHVyY2hhc2VIaXN0b3J5KCkge1xyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IHB1cmNoYXNlSGlzdG9yeVVybCA9IGBodHRwczovLyR7bG9jYXRpb24uaG9zdG5hbWV9L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShwdXJjaGFzZUhpc3RvcnlVcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICBsb3RJbmZvLnB1cmNoYXNlSGlzdG9yeSA9IHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWFyY2hRdWVyeSgpIDogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmIChkb2N1bWVudC5yZWZlcnJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgVVJMKGRvY3VtZW50LnJlZmVycmVyKS5zZWFyY2hQYXJhbXM/LmdldCgnX25rdycpPy50cmltKCk/LnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcm9kdWN0KHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgY2xpZW50OiBDbGllbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcHJvZHVjdEZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBwcm9kdWN0RmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgcHJvZHVjdElkID0gc2VydmVyTG90SW5mbz8ucHJvZHVjdElkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuICAgIGxldCBzZWFyY2hRdWVyeSA9IGdldFNlYXJjaFF1ZXJ5KCk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgY2xpZW50LmdldEFsbFByb2R1Y3RzKClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gcHJvZHVjdHNbaV0uaWQ7XHJcbiAgICAgICAgb3B0LmlubmVySFRNTCA9IHByb2R1Y3RzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAocHJvZHVjdElkID09PSBwcm9kdWN0c1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RzW2ldLnNlYXJjaFF1ZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFF1ZXJ5ID09PSB4LnF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvZHVjdEZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBjbGllbnQ6IENsaWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBtYW51YWxDb25kaXRpb25GaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgbWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25JZCA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/Lm1hbnVhbENvbmRpdGlvbklkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9ucyA9IGF3YWl0IGNsaWVudC5nZXRNYW51YWxDb25kaXRpb25zTGlzdCgpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hbnVhbENvbmRpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gbWFudWFsQ29uZGl0aW9uc1tpXS5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkID09PSBtYW51YWxDb25kaXRpb25zW2ldLmlkLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hbnVhbENvbmRpdGlvbkZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlckxvdEluZm8oY2xpZW50OiBDbGllbnQpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIF9zZXJ2ZXJMb3RJbmZvID0gYXdhaXQgY2xpZW50LmdldExvdEluZm8obG90SW5mby5sb3RJZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQY3MocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHBjc0ZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIHBjc0ZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/LnBjc1xyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGNzRmllbGQudmFsdWUgPSBzZXJ2ZXJQY3MudG9TdHJpbmcoKVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsSWdub3JlVGhhdExvdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgaWdub3JlVGhhdExvdEZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5pZ25vcmVUaGF0TG90XHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZ25vcmVUaGF0TG90RmllbGQuY2hlY2tlZCA9IHNlcnZlclBjc1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29tcGFyZUxvdEluZm9zKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgaWYgKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGxldCBzZXJ2ZXJMb3RJbmZvSnNvbiA9IHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkLmxvdEluZm8udG9KU09OKClcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wiZGVzY3JpcHRpb25cIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnkgPSBzZXJ2ZXJMb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXVxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBsb3RJbmZvSnNvbiA9IGxvdEluZm8udG9KU09OKClcclxuICAgIGxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBsb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wiZGVzY3JpcHRpb25cIl0gPSB1bmRlZmluZWRcclxuICAgIGxldCBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5ID0gbG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl07XHJcbiAgICBsb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXSA9IHVuZGVmaW5lZFxyXG4gICAgXHJcbiAgICBsZXQgc2VydmVyTG90SW5mb0pzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXJ2ZXJMb3RJbmZvSnNvbilcclxuICAgIGxldCBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobG90SW5mb0pzb24pXHJcbiAgICBsZXQgc2VydmVyUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHNlcnZlclB1cmNoYXNlSGlzdG9yeSlcclxuICAgIGxldCBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm9QdXJjaGFzZUhpc3RvcnkpXHJcblxyXG4gICAgbGV0IHBhbmVsID0gPEhUTUxEaXZFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzKTtcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvSnNvblN0cmluZyA9PT0gY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlcnZlclB1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpXHJcbiAgICAgICAgY29uc29sZS5sb2cobG90SW5mb1B1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpXHJcbiAgICAgICAgaWYgKF9zZXJ2ZXJMb3RJbmZvLmxvdEluZm8uaWdub3JlVGhhdExvdCA9PT0gdHJ1ZSB8fCBzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nID09PSBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZykge1xyXG4gICAgICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRHcmVlbkNvbG9yfTtgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodFllbGxvd0NvbG9yfTtgXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRQaW5rQ29sb3J9O2BcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGZyb20gc2VydmVyOiBcIiArIHNlcnZlckxvdEluZm9Kc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50UGFnZTogXCIgKyBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXREYXRhRnJvbVBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcylcclxuXHJcbiAgICBmaWxsSWQoKTtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHJpY2UoKSxcclxuICAgICAgICBmaWxsTmFtZSgpLFxyXG4gICAgICAgIGZpbGxTZWxsZXIoKSxcclxuICAgICAgICBmaWxsQ29uZGl0aW9uKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgZmlsbExvY2F0ZWRJbigpLFxyXG4gICAgICAgIGZpbGxEZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGdldFNlcnZlckxvdEluZm8oY2xpZW50KVxyXG4gICAgXSlcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBmaWxsUHVyY2hhc2VIaXN0b3J5KCksXHJcbiAgICAgICAgZmlsbFByb2R1Y3QocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWwsIGNsaWVudCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxQY3MocGFuZWwsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsSWdub3JlVGhhdExvdChwYW5lbCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxTaGlwcGluZygpLFxyXG4gICAgXSk7XHJcbiAgICBcclxuICAgIGF3YWl0IGNvbXBhcmVMb3RJbmZvcyhfc2VydmVyTG90SW5mbyk7XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBhZGRQYW5lbChjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IGJvZHlFbGVtZW50ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdib2R5Jyk7XHJcbiAgICBpZiAoYm9keUVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgZXhpc3RpbmdQYW5lbCA9IGJvZHlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcyk7XHJcbiAgICAgICAgaWYgKCFleGlzdGluZ1BhbmVsKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVBhbmVsKGJvZHlFbGVtZW50LCBjbGllbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2F2ZUVycm9yVG9CYWNrZW5kKGVycm9yOiBFcnJvciwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBlcnJvclRleHQgPSBKU09OLnN0cmluZ2lmeShlcnJvcikgKyBcIiBcIiArIGVycm9yLnN0YWNrXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGNsaWVudC5zYXZlRXJyb3IobmV3IENsaWVudEVycm9ySW5mbyh7XHJcbiAgICAgICAgICAgIGVycm9yOiBlcnJvclRleHQsXHJcbiAgICAgICAgICAgIHVybDogZG9jdW1lbnQubG9jYXRpb24uaHJlZlxyXG4gICAgICAgIH0pKVxyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gc2F2ZSBlcnJvciB0byBiYWNrZW5kIFwiICsgZXJyb3JUZXh0KVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzaG93QW5kU2F2ZUVycm9yKGVycm9yOiBFcnJvciwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBlcnJvckRpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzICsgJyAjJyArIGVycm9yRWxlbWVudElkKVxyXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGlvbkVycm9yID0gPFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvPmVycm9yXHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSBcItCe0YjQuNCx0LrQsCDQstCw0LvQuNC00LDRhtC40Lg6IFwiICsgSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvbkVycm9yLmVycm9ycylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSBlcnJvci5zdGFjaztcclxuICAgIH1cclxuXHJcbiAgICBlcnJvckRpdi5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgXHJcbiAgICBhd2FpdCBzYXZlRXJyb3JUb0JhY2tlbmQoZXJyb3IsIGNsaWVudCk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGVuYWJsZVN1Ym1pdEJ1dHRvbigpIHtcclxuICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcjJyArIHN1Ym1pdElkKSkuZGlzYWJsZWQgPSBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQ6IE9BdXRoMkNsaWVudCk6IEZldGNoV3JhcHBlckN1c3RvbSB7XHJcbiAgICByZXR1cm4gbmV3IEZldGNoV3JhcHBlckN1c3RvbSh7XHJcbiAgICAgICAgY2xpZW50OiBvQXV0aDJDbGllbnQsXHJcbiAgICAgICAgZ2V0TmV3VG9rZW46IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldEF1dGhvcml6ZVVyaSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsnRWJheS5TZXJ2ZXJBUEknXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTdG9yZWRUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYmFja2VuZFVybCAhPT0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJiYWNrZW5kX3VybFwiXSkpLmJhY2tlbmRfdXJsKSAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1widG9rZW5fc3RvcmVcIl0pKS50b2tlbl9zdG9yZTtcclxuICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gSlNPTi5wYXJzZSh0b2tlbik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2g6IGZldGNoUmVzb3VyY2VcclxuICAgIH0pXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhpZGVFcnJvcnMoKSB7XHJcbiAgICBsZXQgZXJyb3JEaXYgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcyArICcgIycgKyBlcnJvckVsZW1lbnRJZClcclxuICAgIGVycm9yRGl2LmlubmVySFRNTCA9IFwiXCJcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcHJvZHVjdFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwicHJvZHVjdFBhZ2VcIilcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgYWRkUGFuZWwoY2xpZW50KTtcclxuICAgICAgICBhd2FpdCBnZXREYXRhRnJvbVBhZ2UoY2xpZW50KTtcclxuICAgICAgICBhd2FpdCBlbmFibGVTdWJtaXRCdXR0b24oKVxyXG4gICAgICAgIGF3YWl0IGhpZGVFcnJvcnMoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBhd2FpdCBzaG93QW5kU2F2ZUVycm9yKGVycm9yLCBjbGllbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBhdXRoUGFnZShvQXV0aDJDbGllbnQ6IE9BdXRoMkNsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJhdXRoUGFnZVwiKVxyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZilcclxuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmhhcyhcImNvZGVcIikpIHtcclxuICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSkuY29kZV92ZXJpZmllcjtcclxuICAgICAgICBsZXQgb2F1dGgyVG9rZW4gPSBhd2FpdCBvQXV0aDJDbGllbnQuYXV0aG9yaXphdGlvbkNvZGUuZ2V0VG9rZW5Gcm9tQ29kZVJlZGlyZWN0KFxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7YmFja2VuZF91cmw6IGJhY2tlbmRVcmx9KVxyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7dG9rZW5fc3RvcmU6IEpTT04uc3RyaW5naWZ5KG9hdXRoMlRva2VuKX0pXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhdXRoUmVkaXJlY3RVcmxcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoUGFnZVwiKVxyXG4gICAgLy/RgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INC/0YDQvtC00LDQvdGL0LUg0LvQvtGC0YtcclxuICAgIGlmIChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcz8uZ2V0KCdMSF9Tb2xkJyk/LnRyaW0oKSAhPT0gXCIxXCIpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgndWwuc3JwLXJlc3VsdHMnKVxyXG5cclxuICAgIGxldCBsaW5rcyA9IFsuLi5zZWFyY2hSZXN1bHRzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpLnMtaXRlbScpXVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHg6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gPEhUTUxBbmNob3JFbGVtZW50PngucXVlcnlTZWxlY3RvcignYS5zLWl0ZW1fX2xpbmsnKVxyXG4gICAgICAgICAgICBsZXQgc29sZERhdGUgPSBuZXcgRGF0ZSgoPEhUTUxFbGVtZW50PngucXVlcnlTZWxlY3Rvcignc3Bhbi5QT1NJVElWRScpKS5pbm5lclRleHQucmVwbGFjZShcIlNvbGQgXCIsIFwiXCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExvdExpbmsocGFyc2VJbnQobGluay5ocmVmLm1hdGNoKC9odHRwczpcXC9cXC9bXlxcL10rXFwvaXRtXFwvKFxcZCspLylbMV0pLCBsaW5rLCBzb2xkRGF0ZSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBsZXQgXyA9IHVwZGF0ZVN0YXR1c0luZmluaXRlKGNsaWVudCwgbGlua3MpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVTdGF0dXNJbmZpbml0ZShjbGllbnQ6IENsaWVudCwgbGlua3M6IExvdExpbmtbXSkge1xyXG4gICAgbGV0IGlkcyA9IGxpbmtzLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4LmlkXHJcbiAgICB9KVxyXG4gICAgLy8gbm9pbnNwZWN0aW9uIEluZmluaXRlTG9vcEpTXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRpbmdMb3RTdGF0ZXNcIilcclxuICAgICAgICAgICAgbGV0IGdldExvdFN0YXRlc0Fuc3dlciA9IGF3YWl0IGNsaWVudC5nZXRMb3RTdGF0ZXMoaWRzKVxyXG5cclxuICAgICAgICAgICAgbGV0IGtub3duTG90cyA9IG5ldyBNYXAoZ2V0TG90U3RhdGVzQW5zd2VyLm1hcChwID0+IFtwLmxvdElkLCBwXSkpO1xyXG5cclxuICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb2xvciA9IHguY29sb3I7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtub3duTG90cy5oYXMoeC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG90U3RhdGUgPSBrbm93bkxvdHMuZ2V0KHguaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb3RTdGF0ZS5pZ25vcmVUaGF0TG90KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkaWZmSW5EYXlzID0gTWF0aC5jZWlsKCh4LnNvbGREYXRlLmdldFRpbWUoKSAtIG5ldyBEYXRlKGxvdFN0YXRlLmxhc3RVcGRhdGUpLmdldFRpbWUoKSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZkluRGF5cyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY29sb3IgPSBsaWdodFllbGxvd0NvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRHcmVlbkNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRHcmVlbkNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRQaW5rQ29sb3JcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoeC5jb2xvciAhPT0gbnVsbCAmJiBjb2xvciAhPT0geC5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHgubGluay5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7eC5jb2xvcn07YFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNhdmVFcnJvclRvQmFja2VuZChlcnJvciwgY2xpZW50KVxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMb3RMaW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGxpbms6IEhUTUxBbmNob3JFbGVtZW50LCBzb2xkRGF0ZTogRGF0ZSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZFxyXG4gICAgICAgIHRoaXMubGluayA9IGxpbmtcclxuICAgICAgICB0aGlzLnNvbGREYXRlID0gc29sZERhdGVcclxuICAgICAgICB0aGlzLmNvbG9yID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudDtcclxuICAgIHNvbGREYXRlOiBEYXRlXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgbnVsbFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzbGVlcEVsZW1lbnRMb2FkZWQoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8RWxlbWVudD4ge1xyXG4gICAgbGV0IHJldHJ5ID0gMFxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICByZXRyeSsrO1xyXG4gICAgICAgIGlmIChyZXRyeSA+IDIwMCkgdGhyb3cgbmV3IEVycm9yKFwidW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvciBcIiArIHNlbGVjdG9yKVxyXG5cclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IG51bGwpIHJldHVybiBlbGVtZW50XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBFbGVtZW50TG9hZGVkQW55KHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPEVsZW1lbnQ+IHtcclxuICAgIFxyXG4gICAgbGV0IHJldHJ5ID0gMFxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICByZXRyeSsrO1xyXG4gICAgICAgIGlmIChyZXRyeSA+IDEwMDApIHRocm93IG5ldyBFcnJvcihcInVuYWJsZSB0byBmaW5kIGFueSBlbGVtZW50IGJ5IHNlbGVjdG9ycyBcIiArIHNlbGVjdG9ycy5qb2luKFwiLCBcIikpXHJcblxyXG4gICAgICAgIGxldCBmb3VuZEVsZW1lbnQ6IEVsZW1lbnRcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoeClcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kRWxlbWVudCA9IGVsZW1lbnRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGZvdW5kRWxlbWVudCAhPT0gbnVsbCkgcmV0dXJuIGZvdW5kRWxlbWVudFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2F2ZUNvZGVWZXJpZmllcigpIHtcclxuICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKT8uY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICBpZiAoY29kZVZlcmlmaWVyID09PSBudWxsIHx8IGNvZGVWZXJpZmllciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IGF3YWl0IGdlbmVyYXRlQ29kZVZlcmlmaWVyKCk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXJ9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgXHJcbiAgIFxyXG4gICAgICAgIGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZm9vdGVyJylcclxuICAgICAgICBhd2FpdCBzYXZlQ29kZVZlcmlmaWVyKCk7XHJcblxyXG4gICAgICAgIGxldCBvQXV0aDJDbGllbnQgPSBuZXcgT0F1dGgyQ2xpZW50KHtcclxuICAgICAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgICAgICBjbGllbnRJZDogJ0ViYXkuQ2hyb21lRXh0ZW5zaW9uJyxcclxuICAgICAgICAgICAgdG9rZW5FbmRwb2ludDogJy9jb25uZWN0L3Rva2VuJyxcclxuICAgICAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICAgICAgZmV0Y2g6IGZldGNoUmVzb3VyY2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UGFnZSA9PT0gYXV0aFJlZGlyZWN0VXJsKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGF1dGhQYWdlKG9BdXRoMkNsaWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGNsaWVudCA9IG5ldyBDbGllbnQoYmFzZUFwaVVybCwgZ2V0QXV0aG9yaXplRmV0Y2gob0F1dGgyQ2xpZW50KSk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBwcm9kdWN0UGFnZShjbGllbnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50UGFnZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZWJheS5jb20vc2NoL1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlYXJjaFBhZ2UoY2xpZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHNhdmVFcnJvclRvQmFja2VuZChlcnJvciwgY2xpZW50KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbn1cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9