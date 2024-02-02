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
            yield sleep(1000);
            let shipButton = (yield sleepElementLoaded('#gh-shipto-click button', document));
            shipButton.click();
            let chooseShippingCountryDialog = yield sleepElementLoaded('#gh-shipto-click-modal', document);
            yield sleepUntil(() => chooseShippingCountryDialog.checkVisibility() === false);
            yield sleep(1000);
            (yield sleepElementLoaded('button.menu-button__button', chooseShippingCountryDialog)).click();
            let itemsMenu = ((yield sleepElementLoaded('div.menu-button__items', chooseShippingCountryDialog)));
            yield sleepUntil(() => itemsMenu.checkVisibility() === false);
            yield sleep(1000);
            getCountrySpanItem(nextCountry, itemsMenu).click();
            yield sleepUntil(() => { var _a; return ((_a = shipButton.getAttribute("aria-label")) === null || _a === void 0 ? void 0 : _a.includes(nextCountry)) !== true; });
            yield sleep(1000);
            (yield sleepElementLoaded('button.shipto__close-btn', chooseShippingCountryDialog)).click();
        }
        yield sleep(1000);
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
        let errorDiv = yield sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLENBQUM7WUFDSixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBQyxDQUFDO1lBRXJFLElBQUksTUFBTSxHQUFHLElBQUksbUJBQU0sQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUM7Z0JBQ0QsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQztvQkFDdEQsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7cUJBQU0sSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQztvQkFDN0QsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDTCxDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDYixNQUFNLGtCQUFrQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUM7SUFFTCxDQUFDO0NBQUE7QUEvQkQsa0JBK0JDO0FBR0QsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7VUNuNUJOO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudC9icm93c2VyL29hdXRoMi1jbGllbnQubWluLmpzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL0ViYXlDbGllbnQvRWJheUNsaWVudC50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9GZXRjaFdyYXBwZXJDdXN0b20udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vbWFpbi50cyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuT0F1dGgyQ2xpZW50PXQoKTplLk9BdXRoMkNsaWVudD10KCl9KHNlbGYsKCgpPT4oKCk9Pnt2YXIgZT17OTM0OihlLHQscik9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmdlbmVyYXRlUXVlcnlTdHJpbmc9dC5PQXV0aDJDbGllbnQ9dm9pZCAwO2NvbnN0IG49cig0NDMpLGk9cig2MTgpO2Z1bmN0aW9uIG8oZSx0KXtyZXR1cm4gbmV3IFVSTChlLHQpLnRvU3RyaW5nKCl9ZnVuY3Rpb24gcyhlKXtyZXR1cm4gbmV3IFVSTFNlYXJjaFBhcmFtcyhPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZSkuZmlsdGVyKCgoW2UsdF0pPT52b2lkIDAhPT10KSkpKS50b1N0cmluZygpfXQuT0F1dGgyQ2xpZW50PWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMuZGlzY292ZXJ5RG9uZT0hMSx0aGlzLnNlcnZlck1ldGFkYXRhPW51bGwsKG51bGw9PWU/dm9pZCAwOmUuZmV0Y2gpfHwoZS5mZXRjaD1mZXRjaC5iaW5kKGdsb2JhbFRoaXMpKSx0aGlzLnNldHRpbmdzPWV9YXN5bmMgcmVmcmVzaFRva2VuKGUpe2lmKCFlLnJlZnJlc2hUb2tlbil0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHRva2VuIGRpZG4ndCBoYXZlIGEgcmVmcmVzaFRva2VuLiBJdCdzIG5vdCBwb3NzaWJsZSB0byByZWZyZXNoIHRoaXNcIik7Y29uc3QgdD17Z3JhbnRfdHlwZTpcInJlZnJlc2hfdG9rZW5cIixyZWZyZXNoX3Rva2VuOmUucmVmcmVzaFRva2VufTtyZXR1cm4gdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXR8fCh0LmNsaWVudF9pZD10aGlzLnNldHRpbmdzLmNsaWVudElkKSx0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIix0KSl9YXN5bmMgY2xpZW50Q3JlZGVudGlhbHMoZSl7dmFyIHQ7Y29uc3Qgcj1bXCJjbGllbnRfaWRcIixcImNsaWVudF9zZWNyZXRcIixcImdyYW50X3R5cGVcIixcInNjb3BlXCJdO2lmKChudWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zKSYmT2JqZWN0LmtleXMoZS5leHRyYVBhcmFtcykuZmlsdGVyKChlPT5yLmluY2x1ZGVzKGUpKSkubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIGV4dHJhUGFyYW1zIGFyZSBkaXNhbGxvd2VkOiAnJHtyLmpvaW4oXCInLCAnXCIpfSdgKTtjb25zdCBuPXtncmFudF90eXBlOlwiY2xpZW50X2NyZWRlbnRpYWxzXCIsc2NvcGU6bnVsbD09PSh0PW51bGw9PWU/dm9pZCAwOmUuc2NvcGUpfHx2b2lkIDA9PT10P3ZvaWQgMDp0LmpvaW4oXCIgXCIpLC4uLm51bGw9PWU/dm9pZCAwOmUuZXh0cmFQYXJhbXN9O2lmKCF0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCl0aHJvdyBuZXcgRXJyb3IoXCJBIGNsaWVudFNlY3JldCBtdXN0IGJlIHByb3ZpZGVkIHRvIHVzZSBjbGllbnRfY3JlZGVudGlhbHNcIik7cmV0dXJuIHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLG4pKX1hc3luYyBwYXNzd29yZChlKXt2YXIgdDtjb25zdCByPXtncmFudF90eXBlOlwicGFzc3dvcmRcIiwuLi5lLHNjb3BlOm51bGw9PT0odD1lLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKX07cmV0dXJuIHRoaXMudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5yZXF1ZXN0KFwidG9rZW5FbmRwb2ludFwiLHIpKX1nZXQgYXV0aG9yaXphdGlvbkNvZGUoKXtyZXR1cm4gbmV3IGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnQodGhpcyl9YXN5bmMgaW50cm9zcGVjdChlKXtjb25zdCB0PXt0b2tlbjplLmFjY2Vzc1Rva2VuLHRva2VuX3R5cGVfaGludDpcImFjY2Vzc190b2tlblwifTtyZXR1cm4gdGhpcy5yZXF1ZXN0KFwiaW50cm9zcGVjdGlvbkVuZHBvaW50XCIsdCl9YXN5bmMgZ2V0RW5kcG9pbnQoZSl7aWYodm9pZCAwIT09dGhpcy5zZXR0aW5nc1tlXSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZihcImRpc2NvdmVyeUVuZHBvaW50XCIhPT1lJiYoYXdhaXQgdGhpcy5kaXNjb3ZlcigpLHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pKXJldHVybiBvKHRoaXMuc2V0dGluZ3NbZV0sdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2lmKCF0aGlzLnNldHRpbmdzLnNlcnZlcil0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBkZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mICR7ZX0uIEVpdGhlciBzcGVjaWZ5ICR7ZX0gaW4gdGhlIHNldHRpbmdzLCBvciB0aGUgXCJzZXJ2ZXJcIiBlbmRwb2ludCB0byBsZXQgdGhlIGNsaWVudCBkaXNjb3ZlciBpdC5gKTtzd2l0Y2goZSl7Y2FzZVwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvYXV0aG9yaXplXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcInRva2VuRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi90b2tlblwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJkaXNjb3ZlcnlFbmRwb2ludFwiOnJldHVybiBvKFwiLy53ZWxsLWtub3duL29hdXRoLWF1dGhvcml6YXRpb24tc2VydmVyXCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpO2Nhc2VcImludHJvc3BlY3Rpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2ludHJvc3BlY3RcIix0aGlzLnNldHRpbmdzLnNlcnZlcil9fWFzeW5jIGRpc2NvdmVyKCl7dmFyIGU7aWYodGhpcy5kaXNjb3ZlcnlEb25lKXJldHVybjtsZXQgdDt0aGlzLmRpc2NvdmVyeURvbmU9ITA7dHJ5e3Q9YXdhaXQgdGhpcy5nZXRFbmRwb2ludChcImRpc2NvdmVyeUVuZHBvaW50XCIpfWNhdGNoKGUpe3JldHVybiB2b2lkIGNvbnNvbGUud2FybignW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gRWl0aGVyIHNwZWNpZnkgdGhlIFwic2VydmVyXCIgb3IgXCJkaXNjb3ZlcnlFbmRwb2ludCcpfWNvbnN0IHI9YXdhaXQgdGhpcy5zZXR0aW5ncy5mZXRjaCh0LHtoZWFkZXJzOntBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uXCJ9fSk7aWYoIXIub2spcmV0dXJuO2lmKCEobnVsbD09PShlPXIuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikpfHx2b2lkIDA9PT1lP3ZvaWQgMDplLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSlyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oXCJbb2F1dGgyXSBPQXV0aDIgZGlzY292ZXJ5IGVuZHBvaW50IHdhcyBub3QgYSBKU09OIHJlc3BvbnNlLiBSZXNwb25zZSBpcyBpZ25vcmVkXCIpO3RoaXMuc2VydmVyTWV0YWRhdGE9YXdhaXQgci5qc29uKCk7Y29uc3Qgbj1bW1wiYXV0aG9yaXphdGlvbl9lbmRwb2ludFwiLFwiYXV0aG9yaXphdGlvbkVuZHBvaW50XCJdLFtcInRva2VuX2VuZHBvaW50XCIsXCJ0b2tlbkVuZHBvaW50XCJdLFtcImludHJvc3BlY3Rpb25fZW5kcG9pbnRcIixcImludHJvc3BlY3Rpb25FbmRwb2ludFwiXV07aWYobnVsbCE9PXRoaXMuc2VydmVyTWV0YWRhdGEpe2Zvcihjb25zdFtlLHJdb2Ygbil0aGlzLnNlcnZlck1ldGFkYXRhW2VdJiYodGhpcy5zZXR0aW5nc1tyXT1vKHRoaXMuc2VydmVyTWV0YWRhdGFbZV0sdCkpO3RoaXMuc2VydmVyTWV0YWRhdGEudG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2RzX3N1cHBvcnRlZCYmIXRoaXMuc2V0dGluZ3MuYXV0aGVudGljYXRpb25NZXRob2QmJih0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kPXRoaXMuc2VydmVyTWV0YWRhdGEudG9rZW5fZW5kcG9pbnRfYXV0aF9tZXRob2RzX3N1cHBvcnRlZFswXSl9fWFzeW5jIHJlcXVlc3QoZSx0KXtjb25zdCByPWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoZSksaT17XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwifTtsZXQgbz10aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kO3N3aXRjaChvfHwobz10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldD9cImNsaWVudF9zZWNyZXRfYmFzaWNcIjpcImNsaWVudF9zZWNyZXRfcG9zdFwiKSxvKXtjYXNlXCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6aS5BdXRob3JpemF0aW9uPVwiQmFzaWMgXCIrYnRvYSh0aGlzLnNldHRpbmdzLmNsaWVudElkK1wiOlwiK3RoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KTticmVhaztjYXNlXCJjbGllbnRfc2VjcmV0X3Bvc3RcIjp0LmNsaWVudF9pZD10aGlzLnNldHRpbmdzLmNsaWVudElkLHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYodC5jbGllbnRfc2VjcmV0PXRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0KTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIkF1dGhlbnRpY2F0aW9uIG1ldGhvZCBub3QgeWV0IHN1cHBvcnRlZDpcIitvK1wiLiBPcGVuIGEgZmVhdHVyZSByZXF1ZXN0IGlmIHlvdSB3YW50IHRoaXMhXCIpfWNvbnN0IGE9YXdhaXQgdGhpcy5zZXR0aW5ncy5mZXRjaChyLHttZXRob2Q6XCJQT1NUXCIsYm9keTpzKHQpLGhlYWRlcnM6aX0pO2lmKGEub2spcmV0dXJuIGF3YWl0IGEuanNvbigpO2xldCBjLGgsdTt0aHJvdyBhLmhlYWRlcnMuaGFzKFwiQ29udGVudC1UeXBlXCIpJiZhLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpJiYoYz1hd2FpdCBhLmpzb24oKSksKG51bGw9PWM/dm9pZCAwOmMuZXJyb3IpPyhoPVwiT0F1dGgyIGVycm9yIFwiK2MuZXJyb3IrXCIuXCIsYy5lcnJvcl9kZXNjcmlwdGlvbiYmKGgrPVwiIFwiK2MuZXJyb3JfZGVzY3JpcHRpb24pLHU9Yy5lcnJvcik6KGg9XCJIVFRQIEVycm9yIFwiK2Euc3RhdHVzK1wiIFwiK2Euc3RhdHVzVGV4dCw0MDE9PT1hLnN0YXR1cyYmdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQmJihoKz1cIi4gSXQncyBsaWtlbHkgdGhhdCB0aGUgY2xpZW50SWQgYW5kL29yIGNsaWVudFNlY3JldCB3YXMgaW5jb3JyZWN0XCIpLHU9bnVsbCksbmV3IG4uT0F1dGgyRXJyb3IoaCx1LGEuc3RhdHVzKX10b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbihlKXtyZXR1cm4gZS50aGVuKChlPT57dmFyIHQ7cmV0dXJue2FjY2Vzc1Rva2VuOmUuYWNjZXNzX3Rva2VuLGV4cGlyZXNBdDplLmV4cGlyZXNfaW4/RGF0ZS5ub3coKSsxZTMqZS5leHBpcmVzX2luOm51bGwscmVmcmVzaFRva2VuOm51bGwhPT0odD1lLnJlZnJlc2hfdG9rZW4pJiZ2b2lkIDAhPT10P3Q6bnVsbH19KSl9fSx0LmdlbmVyYXRlUXVlcnlTdHJpbmc9c30sNjE4OihlLHQscik9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmdldENvZGVDaGFsbGVuZ2U9dC5nZW5lcmF0ZUNvZGVWZXJpZmllcj10Lk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoOTM0KSxpPXIoNDQzKTthc3luYyBmdW5jdGlvbiBvKGUpe2NvbnN0IHQ9cygpO2lmKG51bGw9PXQ/dm9pZCAwOnQuc3VidGxlKXJldHVybltcIlMyNTZcIixjKGF3YWl0IHQuc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIixhKGUpKSldO3tjb25zdCB0PXIoMjEyKS5jcmVhdGVIYXNoKFwic2hhMjU2XCIpO3JldHVybiB0LnVwZGF0ZShhKGUpKSxbXCJTMjU2XCIsdC5kaWdlc3QoXCJiYXNlNjR1cmxcIildfX1mdW5jdGlvbiBzKCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LmNyeXB0bylyZXR1cm4gd2luZG93LmNyeXB0bztpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmc2VsZi5jcnlwdG8pcmV0dXJuIHNlbGYuY3J5cHRvO2NvbnN0IGU9cigyMTIpO3JldHVybiBlLndlYmNyeXB0bz9lLndlYmNyeXB0bzpudWxsfWZ1bmN0aW9uIGEoZSl7Y29uc3QgdD1uZXcgVWludDhBcnJheShlLmxlbmd0aCk7Zm9yKGxldCByPTA7cjxlLmxlbmd0aDtyKyspdFtyXT0yNTUmZS5jaGFyQ29kZUF0KHIpO3JldHVybiB0fWZ1bmN0aW9uIGMoZSl7cmV0dXJuIGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi5uZXcgVWludDhBcnJheShlKSkpLnJlcGxhY2UoL1xcKy9nLFwiLVwiKS5yZXBsYWNlKC9cXC8vZyxcIl9cIikucmVwbGFjZSgvPSskLyxcIlwiKX10Lk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMuY2xpZW50PWV9YXN5bmMgZ2V0QXV0aG9yaXplVXJpKGUpe2NvbnN0W3Qscl09YXdhaXQgUHJvbWlzZS5hbGwoW2UuY29kZVZlcmlmaWVyP28oZS5jb2RlVmVyaWZpZXIpOnZvaWQgMCx0aGlzLmNsaWVudC5nZXRFbmRwb2ludChcImF1dGhvcml6YXRpb25FbmRwb2ludFwiKV0pO2xldCBpPXtjbGllbnRfaWQ6dGhpcy5jbGllbnQuc2V0dGluZ3MuY2xpZW50SWQscmVzcG9uc2VfdHlwZTpcImNvZGVcIixyZWRpcmVjdF91cmk6ZS5yZWRpcmVjdFVyaSxjb2RlX2NoYWxsZW5nZV9tZXRob2Q6bnVsbD09dD92b2lkIDA6dFswXSxjb2RlX2NoYWxsZW5nZTpudWxsPT10P3ZvaWQgMDp0WzFdfTtlLnN0YXRlJiYoaS5zdGF0ZT1lLnN0YXRlKSxlLnNjb3BlJiYoaS5zY29wZT1lLnNjb3BlLmpvaW4oXCIgXCIpKTtjb25zdCBzPU9iamVjdC5rZXlzKGkpO2lmKChudWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zKSYmT2JqZWN0LmtleXMoZS5leHRyYVBhcmFtcykuZmlsdGVyKChlPT5zLmluY2x1ZGVzKGUpKSkubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIGV4dHJhUGFyYW1zIGFyZSBkaXNhbGxvd2VkOiAnJHtzLmpvaW4oXCInLCAnXCIpfSdgKTtyZXR1cm4gaT17Li4uaSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfSxyK1wiP1wiKygwLG4uZ2VuZXJhdGVRdWVyeVN0cmluZykoaSl9YXN5bmMgZ2V0VG9rZW5Gcm9tQ29kZVJlZGlyZWN0KGUsdCl7Y29uc3R7Y29kZTpyfT1hd2FpdCB0aGlzLnZhbGlkYXRlUmVzcG9uc2UoZSx7c3RhdGU6dC5zdGF0ZX0pO3JldHVybiB0aGlzLmdldFRva2VuKHtjb2RlOnIscmVkaXJlY3RVcmk6dC5yZWRpcmVjdFVyaSxjb2RlVmVyaWZpZXI6dC5jb2RlVmVyaWZpZXJ9KX1hc3luYyB2YWxpZGF0ZVJlc3BvbnNlKGUsdCl7dmFyIHI7Y29uc3Qgbj1uZXcgVVJMKGUpLnNlYXJjaFBhcmFtcztpZihuLmhhcyhcImVycm9yXCIpKXRocm93IG5ldyBpLk9BdXRoMkVycm9yKG51bGwhPT0ocj1uLmdldChcImVycm9yX2Rlc2NyaXB0aW9uXCIpKSYmdm9pZCAwIT09cj9yOlwiT0F1dGgyIGVycm9yXCIsbi5nZXQoXCJlcnJvclwiKSwwKTtpZighbi5oYXMoXCJjb2RlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIHVybCBkaWQgbm90IGNvbnRhaW4gYSBjb2RlIHBhcmFtZXRlciAke2V9YCk7aWYodC5zdGF0ZSYmdC5zdGF0ZSE9PW4uZ2V0KFwic3RhdGVcIikpdGhyb3cgbmV3IEVycm9yKGBUaGUgXCJzdGF0ZVwiIHBhcmFtZXRlciBpbiB0aGUgdXJsIGRpZCBub3QgbWF0Y2ggdGhlIGV4cGVjdGVkIHZhbHVlIG9mICR7dC5zdGF0ZX1gKTtyZXR1cm57Y29kZTpuLmdldChcImNvZGVcIiksc2NvcGU6bi5oYXMoXCJzY29wZVwiKT9uLmdldChcInNjb3BlXCIpLnNwbGl0KFwiIFwiKTp2b2lkIDB9fWFzeW5jIGdldFRva2VuKGUpe2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJhdXRob3JpemF0aW9uX2NvZGVcIixjb2RlOmUuY29kZSxyZWRpcmVjdF91cmk6ZS5yZWRpcmVjdFVyaSxjb2RlX3ZlcmlmaWVyOmUuY29kZVZlcmlmaWVyfTtyZXR1cm4gdGhpcy5jbGllbnQudG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4odGhpcy5jbGllbnQucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIix0KSl9fSx0LmdlbmVyYXRlQ29kZVZlcmlmaWVyPWFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgZT1zKCk7aWYoZSl7Y29uc3QgdD1uZXcgVWludDhBcnJheSgzMik7cmV0dXJuIGUuZ2V0UmFuZG9tVmFsdWVzKHQpLGModCl9e2NvbnN0IGU9cigyMTIpO3JldHVybiBuZXcgUHJvbWlzZSgoKHQscik9PntlLnJhbmRvbUJ5dGVzKDMyLCgoZSxuKT0+e2UmJnIoZSksdChuLnRvU3RyaW5nKFwiYmFzZTY0dXJsXCIpKX0pKX0pKX19LHQuZ2V0Q29kZUNoYWxsZW5nZT1vfSw0NDM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkVycm9yPXZvaWQgMDtjbGFzcyByIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUpLHRoaXMub2F1dGgyQ29kZT10LHRoaXMuaHR0cENvZGU9cn19dC5PQXV0aDJFcnJvcj1yfSwxMzooZSx0KT0+e1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuT0F1dGgyRmV0Y2g9dm9pZCAwLHQuT0F1dGgyRmV0Y2g9Y2xhc3N7Y29uc3RydWN0b3IoZSl7dGhpcy50b2tlbj1udWxsLHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49bnVsbCx0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbCx0aGlzLnJlZnJlc2hUaW1lcj1udWxsLHZvaWQgMD09PShudWxsPT1lP3ZvaWQgMDplLnNjaGVkdWxlUmVmcmVzaCkmJihlLnNjaGVkdWxlUmVmcmVzaD0hMCksdGhpcy5vcHRpb25zPWUsZS5nZXRTdG9yZWRUb2tlbiYmKHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW49KGFzeW5jKCk9Pnt0aGlzLnRva2VuPWF3YWl0IGUuZ2V0U3RvcmVkVG9rZW4oKSx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGx9KSgpKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpfWFzeW5jIGZldGNoKGUsdCl7Y29uc3Qgcj1uZXcgUmVxdWVzdChlLHQpO3JldHVybiB0aGlzLm13KCkociwoZT0+ZmV0Y2goZSkpKX1tdygpe3JldHVybiBhc3luYyhlLHQpPT57Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7bGV0IG49ZS5jbG9uZSgpO24uaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsXCJCZWFyZXIgXCIrcik7bGV0IGk9YXdhaXQgdChuKTtpZighaS5vayYmNDAxPT09aS5zdGF0dXMpe2NvbnN0IHI9YXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtuPWUuY2xvbmUoKSxuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IuYWNjZXNzVG9rZW4pLGk9YXdhaXQgdChuKX1yZXR1cm4gaX19YXN5bmMgZ2V0VG9rZW4oKXtyZXR1cm4gdGhpcy50b2tlbiYmKG51bGw9PT10aGlzLnRva2VuLmV4cGlyZXNBdHx8dGhpcy50b2tlbi5leHBpcmVzQXQ+RGF0ZS5ub3coKSk/dGhpcy50b2tlbjp0aGlzLnJlZnJlc2hUb2tlbigpfWFzeW5jIGdldEFjY2Vzc1Rva2VuKCl7cmV0dXJuIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4sKGF3YWl0IHRoaXMuZ2V0VG9rZW4oKSkuYWNjZXNzVG9rZW59YXN5bmMgcmVmcmVzaFRva2VuKCl7dmFyIGUsdDtpZih0aGlzLmFjdGl2ZVJlZnJlc2gpcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtjb25zdCByPXRoaXMudG9rZW47dGhpcy5hY3RpdmVSZWZyZXNoPShhc3luYygpPT57dmFyIGUsdDtsZXQgbj1udWxsO3RyeXsobnVsbD09cj92b2lkIDA6ci5yZWZyZXNoVG9rZW4pJiYobj1hd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihyKSl9Y2F0Y2goZSl7Y29uc29sZS53YXJuKFwiW29hdXRoMl0gcmVmcmVzaCB0b2tlbiBub3QgYWNjZXB0ZWQsIHdlJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nXCIpfWlmKG58fChuPWF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpKSwhbil7Y29uc3Qgcj1uZXcgRXJyb3IoXCJVbmFibGUgdG8gb2J0YWluIE9BdXRoMiB0b2tlbnMsIGEgZnVsbCByZWF1dGggbWF5IGJlIG5lZWRlZFwiKTt0aHJvdyBudWxsPT09KHQ9KGU9dGhpcy5vcHRpb25zKS5vbkVycm9yKXx8dm9pZCAwPT09dHx8dC5jYWxsKGUscikscn1yZXR1cm4gbn0pKCk7dHJ5e2NvbnN0IHI9YXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO3JldHVybiB0aGlzLnRva2VuPXIsbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykuc3RvcmVUb2tlbil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHRoaXMuc2NoZWR1bGVSZWZyZXNoKCkscn1jYXRjaChlKXt0aHJvdyB0aGlzLm9wdGlvbnMub25FcnJvciYmdGhpcy5vcHRpb25zLm9uRXJyb3IoZSksZX1maW5hbGx5e3RoaXMuYWN0aXZlUmVmcmVzaD1udWxsfX1zY2hlZHVsZVJlZnJlc2goKXt2YXIgZTtpZighdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaClyZXR1cm47aWYodGhpcy5yZWZyZXNoVGltZXImJihjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpLHRoaXMucmVmcmVzaFRpbWVyPW51bGwpLCEobnVsbD09PShlPXRoaXMudG9rZW4pfHx2b2lkIDA9PT1lP3ZvaWQgMDplLmV4cGlyZXNBdCl8fCF0aGlzLnRva2VuLnJlZnJlc2hUb2tlbilyZXR1cm47Y29uc3QgdD10aGlzLnRva2VuLmV4cGlyZXNBdC1EYXRlLm5vdygpO3Q8MTJlNHx8KHRoaXMucmVmcmVzaFRpbWVyPXNldFRpbWVvdXQoKGFzeW5jKCk9Pnt0cnl7YXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKX1jYXRjaChlKXtjb25zb2xlLmVycm9yKFwiW2ZldGNoLW13LW9hdXRoMl0gZXJyb3Igd2hpbGUgZG9pbmcgYSBiYWNrZ3JvdW5kIE9BdXRoMiBhdXRvLXJlZnJlc2hcIixlKX19KSx0LTZlNCkpfX19LDIxMjooKT0+e319LHQ9e307ZnVuY3Rpb24gcihuKXt2YXIgaT10W25dO2lmKHZvaWQgMCE9PWkpcmV0dXJuIGkuZXhwb3J0czt2YXIgbz10W25dPXtleHBvcnRzOnt9fTtyZXR1cm4gZVtuXShvLG8uZXhwb3J0cyxyKSxvLmV4cG9ydHN9dmFyIG49e307cmV0dXJuKCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9bjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLk9BdXRoMkVycm9yPWUuT0F1dGgyRmV0Y2g9ZS5nZW5lcmF0ZUNvZGVWZXJpZmllcj1lLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50PWUuT0F1dGgyQ2xpZW50PXZvaWQgMDt2YXIgdD1yKDkzNCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJDbGllbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdC5PQXV0aDJDbGllbnR9fSk7dmFyIGk9cig2MTgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImdlbmVyYXRlQ29kZVZlcmlmaWVyXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuZ2VuZXJhdGVDb2RlVmVyaWZpZXJ9fSk7dmFyIG89cigxMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJGZXRjaFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBvLk9BdXRoMkZldGNofX0pO3ZhciBzPXIoNDQzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkVycm9yXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHMuT0F1dGgyRXJyb3J9fSl9KSgpLG59KSgpKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9hdXRoMi1jbGllbnQubWluLmpzLm1hcCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyA8YXV0by1nZW5lcmF0ZWQ+XHJcbi8vICAgICBHZW5lcmF0ZWQgdXNpbmcgdGhlIE5Td2FnIHRvb2xjaGFpbiB2MTMuMjAuMC4wIChOSnNvblNjaGVtYSB2MTAuOS4wLjAgKE5ld3RvbnNvZnQuSnNvbiB2MTMuMC4wLjApKSAoaHR0cDovL05Td2FnLm9yZylcclxuLy8gPC9hdXRvLWdlbmVyYXRlZD5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4vLyBSZVNoYXJwZXIgZGlzYWJsZSBJbmNvbnNpc3RlbnROYW1pbmdcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnQge1xyXG4gICAgcHJpdmF0ZSBodHRwOiB7IGZldGNoKHVybDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IH07XHJcbiAgICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBqc29uUGFyc2VSZXZpdmVyOiAoKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnkpIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmw/OiBzdHJpbmcsIGh0dHA/OiB7IGZldGNoKHVybDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IH0pIHtcclxuICAgICAgICB0aGlzLmh0dHAgPSBodHRwID8gaHR0cCA6IHdpbmRvdyBhcyBhbnk7XHJcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybCAhPT0gdW5kZWZpbmVkICYmIGJhc2VVcmwgIT09IG51bGwgPyBiYXNlVXJsIDogXCIvYXBpL2ViYXkvdjFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3QgYWxsIHByb2R1Y3RzXHJcbiAgICAgKiBAcmV0dXJuIE9LXHJcbiAgICAgKi9cclxuICAgIGdldEFsbFByb2R1Y3RzKCk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldEFsbFByb2R1Y3RzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRBbGxQcm9kdWN0cyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWRbXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKFByb2R1Y3RXaXRoSWQuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPFByb2R1Y3RXaXRoSWRbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHNcIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzQ3JlYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ3JlYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSByZXN1bHREYXRhMjAwICE9PSB1bmRlZmluZWQgPyByZXN1bHREYXRhMjAwIDogPGFueT5udWxsO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxzdHJpbmc+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSBwcm9kdWN0XHJcbiAgICAgKiBAcmV0dXJuIFVwZGF0ZWRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlUHJvZHVjdChwcm9kdWN0OiBQcm9kdWN0V2l0aG91dElkLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9XCI7XHJcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQgfHwgaWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2lkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7aWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgaWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1VwZGF0ZVByb2R1Y3QoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1VwZGF0ZVByb2R1Y3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkVycm9yXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVsZXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gRGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9kdWN0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRGVsZXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzRGVsZXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFya1Byb2R1Y3RBc0NoZWNrZWRcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICBtYXJrUHJvZHVjdEFzQ2hlY2tlZChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97aWR9L21hcmtfYXNfY2hlY2tlZC9cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc01hcmtQcm9kdWN0QXNDaGVja2VkKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NNYXJrUHJvZHVjdEFzQ2hlY2tlZChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIHVwc2VydExvdEluZm8obG90SW5mbzogTG90SW5mbywgcHJvZHVjdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3twcm9kdWN0SWR9L2xvdHMvXCI7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkIHx8IHByb2R1Y3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAncHJvZHVjdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7cHJvZHVjdElkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIHByb2R1Y3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkobG90SW5mbyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Vwc2VydExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1Vwc2VydExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9C40YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQu9C+0YLQtVxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRMb3RJbmZvKGxvdElkOiBudW1iZXIpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3RzL3tsb3RJZH0vXCI7XHJcbiAgICAgICAgaWYgKGxvdElkID09PSB1bmRlZmluZWQgfHwgbG90SWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ2xvdElkJyBtdXN0IGJlIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoXCJ7bG90SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgbG90SWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RJbmZvKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RJbmZvKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQyMDAgPSBMb3RJbmZvV2l0aFByb2R1Y3RJZC5mcm9tSlMocmVzdWx0RGF0YTIwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mby5mcm9tSlMocmVzdWx0RGF0YTQwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIk5vdEZvdW5kXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMsIHJlc3VsdDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90SW5mb1dpdGhQcm9kdWN0SWQ+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YPRh9GC0LXQvdC90YvRhSDQu9C+0YLQsNGFXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdFN0YXRlcyhsb3RJZHM6IG51bWJlcltdKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9sb3Rfc3RhdGVfcmVxdWVzdHMvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJZHMpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0TG90U3RhdGVzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RTdGF0ZXMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RTdGF0ZVtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTG90U3RhdGUuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPExvdFN0YXRlW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDQv9C10YDQtdGH0LXQvdGMINCy0L7Qt9C80L7QttC90YvRhSDRgdC+0YHRgtC+0Y/QvdC40Lkg0L/RgNC+0LTQsNCy0LDQtdC80L7Qs9C+INGC0L7QstCw0YDQsFxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRNYW51YWxDb25kaXRpb25zTGlzdCgpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9tYW51YWxfY29uZGl0aW9ucy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0TWFudWFsQ29uZGl0aW9uc0xpc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxNYW51YWxDb25kaXRpb25bXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKE1hbnVhbENvbmRpdGlvbi5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TWFudWFsQ29uZGl0aW9uW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNhdmUgRXJyb3JcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgc2F2ZUVycm9yKGVycm9yOiBDbGllbnRFcnJvckluZm8pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2Vycm9yL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBib2R5OiBjb250ZW50XyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NTYXZlRXJyb3IoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc1NhdmVFcnJvcihyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhvdXRJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aG91dElkIHtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzITogU2VhcmNoUXVlcnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRob3V0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIk5hbWVcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyEucHVzaChTZWFyY2hRdWVyeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRob3V0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlYXJjaFF1ZXJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5zZWFyY2hRdWVyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoUXVlcmllczogU2VhcmNoUXVlcnlbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RXaXRoSWQgaW1wbGVtZW50cyBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBsYXN0Q2hlY2tUaW1lPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VhcmNoUXVlcmllcyE6IFNlYXJjaFF1ZXJ5W107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9kdWN0V2l0aElkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiSWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0Q2hlY2tUaW1lID0gX2RhdGFbXCJMYXN0Q2hlY2tUaW1lXCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMhLnB1c2goU2VhcmNoUXVlcnkuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2R1Y3RXaXRoSWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQcm9kdWN0V2l0aElkKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIklkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiTmFtZVwiXSA9IHRoaXMubmFtZTtcclxuICAgICAgICBkYXRhW1wiTGFzdENoZWNrVGltZVwiXSA9IHRoaXMubGFzdENoZWNrVGltZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlYXJjaFF1ZXJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJTZWFyY2hRdWVyaWVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5zZWFyY2hRdWVyaWVzKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2R1Y3RXaXRoSWQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGxhc3RDaGVja1RpbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWFyY2hRdWVyaWVzOiBTZWFyY2hRdWVyeVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoUXVlcnkgaW1wbGVtZW50cyBJU2VhcmNoUXVlcnkge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBxdWVyeSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVNlYXJjaFF1ZXJ5KSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcImlkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXJ5ID0gX2RhdGFbXCJxdWVyeVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBTZWFyY2hRdWVyeSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNlYXJjaFF1ZXJ5KCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wicXVlcnlcIl0gPSB0aGlzLnF1ZXJ5O1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTZWFyY2hRdWVyeSB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgcXVlcnk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdEluZm9XaXRoUHJvZHVjdElkIGltcGxlbWVudHMgSUxvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgIHByb2R1Y3RJZCE6IHN0cmluZztcclxuICAgIGxvdEluZm8hOiBMb3RJbmZvO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90SW5mb1dpdGhQcm9kdWN0SWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdEluZm8gPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdElkID0gX2RhdGFbXCJwcm9kdWN0SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG90SW5mbyA9IF9kYXRhW1wibG90SW5mb1wiXSA/IExvdEluZm8uZnJvbUpTKF9kYXRhW1wibG90SW5mb1wiXSkgOiBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdEluZm9XaXRoUHJvZHVjdElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mb1dpdGhQcm9kdWN0SWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wicHJvZHVjdElkXCJdID0gdGhpcy5wcm9kdWN0SWQ7XHJcbiAgICAgICAgZGF0YVtcImxvdEluZm9cIl0gPSB0aGlzLmxvdEluZm8gPyB0aGlzLmxvdEluZm8udG9KU09OKCkgOiA8YW55PnVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgcHJvZHVjdElkOiBzdHJpbmc7XHJcbiAgICBsb3RJbmZvOiBMb3RJbmZvO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mbyBpbXBsZW1lbnRzIElMb3RJbmZvIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHBjcyE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nQ291bnRyeSE6IHN0cmluZztcclxuICAgIGN1cnJlbmN5ITogc3RyaW5nO1xyXG4gICAgcHJpY2UhOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uITogc3RyaW5nO1xyXG4gICAgY29uZGl0aW9uRGVzY3JpcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWxsZXIhOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW4hOiBzdHJpbmc7XHJcbiAgICBpZ25vcmVUaGF0TG90ITogYm9vbGVhbjtcclxuICAgIG1hbnVhbENvbmRpdGlvbklkITogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5ITogUHVyY2hhc2VJbmZvW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvdElkID0gX2RhdGFbXCJsb3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnBjcyA9IF9kYXRhW1wicGNzXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQ291bnRyeSA9IF9kYXRhW1wic2hpcHBpbmdDb3VudHJ5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbmN5ID0gX2RhdGFbXCJjdXJyZW5jeVwiXTtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmcgPSBfZGF0YVtcInNoaXBwaW5nXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQWRkaXRpb25hbCA9IF9kYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24gPSBfZGF0YVtcImNvbmRpdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsbGVyID0gX2RhdGFbXCJzZWxsZXJcIl07XHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRlZEluID0gX2RhdGFbXCJsb2NhdGVkSW5cIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5tYW51YWxDb25kaXRpb25JZCA9IF9kYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVyY2hhc2VIaXN0b3J5IS5wdXNoKFB1cmNoYXNlSW5mby5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJuYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJwY3NcIl0gPSB0aGlzLnBjcztcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdDb3VudHJ5XCJdID0gdGhpcy5zaGlwcGluZ0NvdW50cnk7XHJcbiAgICAgICAgZGF0YVtcImN1cnJlbmN5XCJdID0gdGhpcy5jdXJyZW5jeTtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ1wiXSA9IHRoaXMuc2hpcHBpbmc7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXSA9IHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXSA9IHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb247XHJcbiAgICAgICAgZGF0YVtcInNlbGxlclwiXSA9IHRoaXMuc2VsbGVyO1xyXG4gICAgICAgIGRhdGFbXCJsb2NhdGVkSW5cIl0gPSB0aGlzLmxvY2F0ZWRJbjtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB0aGlzLm1hbnVhbENvbmRpdGlvbklkO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHVyY2hhc2VIaXN0b3J5KSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5wdXJjaGFzZUhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwY3M6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nQ291bnRyeTogc3RyaW5nO1xyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW46IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBtYW51YWxDb25kaXRpb25JZDogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5OiBQdXJjaGFzZUluZm9bXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFB1cmNoYXNlSW5mbyBpbXBsZW1lbnRzIElQdXJjaGFzZUluZm8ge1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWFudGl0eSE6IG51bWJlcjtcclxuICAgIGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQdXJjaGFzZUluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHkgPSBfZGF0YVtcInF1YW50aXR5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGUgPSBfZGF0YVtcImRhdGVcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHVyY2hhc2VJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHVyY2hhc2VJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInByaWNlXCJdID0gdGhpcy5wcmljZTtcclxuICAgICAgICBkYXRhW1wicXVhbnRpdHlcIl0gPSB0aGlzLnF1YW50aXR5O1xyXG4gICAgICAgIGRhdGFbXCJkYXRlXCJdID0gdGhpcy5kYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQdXJjaGFzZUluZm8ge1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWFudWFsQ29uZGl0aW9uIGltcGxlbWVudHMgSU1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTWFudWFsQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBfZGF0YVtcImlkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2RhdGFbXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBNYW51YWxDb25kaXRpb24ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYW51YWxDb25kaXRpb24oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiaWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hbnVhbENvbmRpdGlvbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvdFN0YXRlIGltcGxlbWVudHMgSUxvdFN0YXRlIHtcclxuICAgIGxvdElkITogbnVtYmVyO1xyXG4gICAgaWdub3JlVGhhdExvdCE6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJTG90U3RhdGUpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb3RJZCA9IF9kYXRhW1wibG90SWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlVGhhdExvdCA9IF9kYXRhW1wiaWdub3JlVGhhdExvdFwiXTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gX2RhdGFbXCJsYXN0VXBkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IExvdFN0YXRlIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90U3RhdGUoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJpZ25vcmVUaGF0TG90XCJdID0gdGhpcy5pZ25vcmVUaGF0TG90O1xyXG4gICAgICAgIGRhdGFbXCJsYXN0VXBkYXRlXCJdID0gdGhpcy5sYXN0VXBkYXRlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgaWdub3JlVGhhdExvdDogYm9vbGVhbjtcclxuICAgIGxhc3RVcGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudEVycm9ySW5mbyBpbXBsZW1lbnRzIElDbGllbnRFcnJvckluZm8ge1xyXG4gICAgdXJsITogc3RyaW5nO1xyXG4gICAgZXJyb3IhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElDbGllbnRFcnJvckluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy51cmwgPSBfZGF0YVtcInVybFwiXTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IF9kYXRhW1wiZXJyb3JcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogQ2xpZW50RXJyb3JJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgQ2xpZW50RXJyb3JJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInVybFwiXSA9IHRoaXMudXJsO1xyXG4gICAgICAgIGRhdGFbXCJlcnJvclwiXSA9IHRoaXMuZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNsaWVudEVycm9ySW5mbyB7XHJcbiAgICB1cmw6IHN0cmluZztcclxuICAgIGVycm9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElQcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IF9kYXRhW1widHlwZVwiXTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IF9kYXRhW1widGl0bGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gX2RhdGFbXCJzdGF0dXNcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsID0gX2RhdGFbXCJkZXRhaWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBfZGF0YVtcImluc3RhbmNlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGFic3RyYWN0IGNsYXNzICdQcm9ibGVtRGV0YWlsZWRJbmZvJyBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcInR5cGVcIl0gPSB0aGlzLnR5cGU7XHJcbiAgICAgICAgZGF0YVtcInRpdGxlXCJdID0gdGhpcy50aXRsZTtcclxuICAgICAgICBkYXRhW1wic3RhdHVzXCJdID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgZGF0YVtcImRldGFpbFwiXSA9IHRoaXMuZGV0YWlsO1xyXG4gICAgICAgIGRhdGFbXCJpbnN0YW5jZVwiXSA9IHRoaXMuaW5zdGFuY2U7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHRpdGxlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc3RhdHVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGV0YWlsPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdChfZGF0YSk7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gX2RhdGFbXCJlcnJvcnNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIGV4dGVuZHMgSVByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBQcm9ibGVtRGV0YWlsZWRJbmZvIGltcGxlbWVudHMgSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9yczIgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlci5pbml0KF9kYXRhKTtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBfZGF0YVtcImVycm9yc1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImVycm9yc1wiXSA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHN1cGVyLnRvSlNPTihkYXRhKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMyIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3JzIGltcGxlbWVudHMgSUVycm9ycyB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJRXJyb3JzKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2RhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gX2RhdGFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogRXJyb3JzIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgRXJyb3JzKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHRoaXNbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMyIGltcGxlbWVudHMgSUVycm9yczIge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUVycm9yczIpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMyIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgRXJyb3JzMigpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSB0aGlzW3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9yczIge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHN0YXR1czogbnVtYmVyO1xyXG4gICAgcmVzcG9uc2U6IHN0cmluZztcclxuICAgIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9O1xyXG4gICAgcmVzdWx0OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaXNBcGlFeGNlcHRpb24gPSB0cnVlO1xyXG5cclxuICAgIHN0YXRpYyBpc0FwaUV4Y2VwdGlvbihvYmo6IGFueSk6IG9iaiBpcyBBcGlFeGNlcHRpb24ge1xyXG4gICAgICAgIHJldHVybiBvYmouaXNBcGlFeGNlcHRpb24gPT09IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRocm93RXhjZXB0aW9uKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIsIHJlc3BvbnNlOiBzdHJpbmcsIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogYW55OyB9LCByZXN1bHQ/OiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aHJvdyByZXN1bHQ7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhyb3cgbmV3IEFwaUV4Y2VwdGlvbihtZXNzYWdlLCBzdGF0dXMsIHJlc3BvbnNlLCBoZWFkZXJzLCBudWxsKTtcclxufSIsImltcG9ydCB7T0F1dGgyQ2xpZW50LCBPQXV0aDJUb2tlbn0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcblxyXG5cclxudHlwZSBPQXV0aDJGZXRjaE9wdGlvbnMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlcmVuY2UgdG8gT0F1dGgyIGNsaWVudC5cclxuICAgICAqL1xyXG4gICAgY2xpZW50OiBPQXV0aDJDbGllbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBpbXBsZW1lbnRpbmcgdGhpcyBmdW5jdGlvbi5cclxuICAgICAqIGl0J3MgcHVycG9zZSBpcyB0byBzdXBwbHkgdGhlICdpbml0aWFsJyBvYXV0aDIgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBtYXkgYmUgYXN5bmMuIFJldHVybiBgbnVsbGAgdG8gZmFpbCB0aGUgcHJvY2Vzcy5cclxuICAgICAqL1xyXG4gICAgZ2V0TmV3VG9rZW4oKTogT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgc2V0LCB3aWxsIGJlIGNhbGxlZCBpZiBhdXRoZW50aWNhdGlvbiBmYXRhbGx5IGZhaWxlZC5cclxuICAgICAqL1xyXG4gICAgb25FcnJvcj86IChlcnI6IEVycm9yKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGFjdGl2ZSB0b2tlbiBjaGFuZ2VzLiBVc2luZyB0aGlzIGlzXHJcbiAgICAgKiBvcHRpb25hbCwgYnV0IGl0IG1heSBiZSB1c2VkIHRvIChmb3IgZXhhbXBsZSkgcHV0IHRoZSB0b2tlbiBpbiBvZmYtbGluZVxyXG4gICAgICogc3RvcmFnZSBmb3IgbGF0ZXIgdXNhZ2UuXHJcbiAgICAgKi9cclxuICAgIHN0b3JlVG9rZW4/OiAodG9rZW46IE9BdXRoMlRva2VuKSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxzbyBhbiBvcHRpb25hbCBmZWF0dXJlLiBJbXBsZW1lbnQgdGhpcyBpZiB5b3Ugd2FudCB0aGUgd3JhcHBlciB0byB0cnkgYVxyXG4gICAgICogc3RvcmVkIHRva2VuIGJlZm9yZSBhdHRlbXB0aW5nIGEgZnVsbCByZS1hdXRoZW50aWNhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIG51bGwgaWYgdGhlcmUgd2FzIG5vIHRva2VuLlxyXG4gICAgICovXHJcbiAgICBnZXRTdG9yZWRUb2tlbj86ICgpID0+IE9BdXRoMlRva2VuIHwgbnVsbCB8IFByb21pc2U8T0F1dGgyVG9rZW4gfCBudWxsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBzY2hlZHVsZSB0b2tlbiByZWZyZXNoLlxyXG4gICAgICpcclxuICAgICAqIENlcnRhaW4gZXhlY3V0aW9uIGVudmlyb25tZW50cywgZS5nLiBSZWFjdCBOYXRpdmUsIGRvIG5vdCBoYW5kbGUgc2NoZWR1bGVkXHJcbiAgICAgKiB0YXNrcyB3aXRoIHNldFRpbWVvdXQoKSBpbiBhIGdyYWNlZnVsIG9yIHByZWRpY3RhYmxlIGZhc2hpb24uIFRoZSBkZWZhdWx0XHJcbiAgICAgKiBiZWhhdmlvciBpcyB0byBzY2hlZHVsZSByZWZyZXNoLiBTZXQgdGhpcyB0byBmYWxzZSB0byBkaXNhYmxlIHNjaGVkdWxpbmcuXHJcbiAgICAgKi9cclxuICAgIHNjaGVkdWxlUmVmcmVzaD86IGJvb2xlYW47XHJcblxyXG4gICAgZmV0Y2g/OiB0eXBlb2YgZmV0Y2g7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGZXRjaFdyYXBwZXJDdXN0b20ge1xyXG5cclxuICAgIHByaXZhdGUgb3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VycmVudCBhY3RpdmUgdG9rZW4gKGlmIGFueSlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0b2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSB1c2VyIGhhZCBhIHN0b3JlZFRva2VuLCB0aGUgcHJvY2VzcyB0byBmZXRjaCBpdFxyXG4gICAgICogbWF5IGJlIGFzeW5jLiBXZSBrZWVwIHRyYWNrIG9mIHRoaXMgcHJvY2VzcyBpbiB0aGlzXHJcbiAgICAgKiBwcm9taXNlLCBzbyBpdCBtYXkgYmUgYXdhaXRlZCB0byBhdm9pZCByYWNlIGNvbmRpdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQXMgc29vbiBhcyB0aGlzIHByb21pc2UgcmVzb2x2ZXMsIHRoaXMgcHJvcGVydHkgZ2V0IG51bGxlZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVHZXRTdG9yZWRUb2tlbjogbnVsbCB8IFByb21pc2U8dm9pZD4gPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9BdXRoMkZldGNoT3B0aW9ucykge1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucz8uc2NoZWR1bGVSZWZyZXNoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zY2hlZHVsZVJlZnJlc2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdldFN0b3JlZFRva2VuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IGF3YWl0IG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4hKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuID0gbnVsbDtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb2VzIGEgZmV0Y2ggcmVxdWVzdCBhbmQgYWRkcyBhIEJlYXJlciAvIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgdGhpcyBmdW5jdGlvbiBhdHRlbXB0cyB0byBmZXRjaCBpdFxyXG4gICAgICogZmlyc3QuIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgYWxtb3N0IGV4cGlyaW5nLCB0aGlzIGZ1bmN0aW9uIG1pZ2h0IGF0dGVtcHRcclxuICAgICAqIHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZldGNoKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtcclxuXHJcbiAgICAgICAgaWYgKGluaXQuaGVhZGVycykge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5pdC5oZWFkZXJzID0ge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIGFjY2Vzc1Rva2VufVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Rva2VuID0gYXdhaXQgdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0LmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIG5ld1Rva2VuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5vcHRpb25zLmZldGNoKGlucHV0LCBpbml0KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBjdXJyZW50IHRva2VuIGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoZXJlIHJlc3VsdCBvYmplY3Qgd2lsbCBoYXZlOlxyXG4gICAgICogICAqIGFjY2Vzc1Rva2VuXHJcbiAgICAgKiAgICogZXhwaXJlc0F0IC0gd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgbnVsbC5cclxuICAgICAqICAgKiByZWZyZXNoVG9rZW4gLSBtYXkgYmUgbnVsbFxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhdHRlbXB0IHRvIGF1dG9tYXRpY2FsbHkgcmVmcmVzaCBpZiBzdGFsZS5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0VG9rZW4oKTogUHJvbWlzZTxPQXV0aDJUb2tlbj4ge1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi5leHBpcmVzQXQgPT09IG51bGwgfHwgdGhpcy50b2tlbi5leHBpcmVzQXQgPiBEYXRlLm5vdygpKSkge1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgdG9rZW4gaXMgc3RpbGwgdmFsaWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW47XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFRva2VuKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhY2Nlc3MgdG9rZW4uXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIGN1cnJlbnQgYWNjZXNzIHRva2VuIGlzIG5vdCBrbm93biwgaXQgd2lsbCBhdHRlbXB0IHRvIGZldGNoIGl0LlxyXG4gICAgICogSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBleHBpcmluZywgaXQgd2lsbCBhdHRlbXB0IHRvIHJlZnJlc2ggaXQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEFjY2Vzc1Rva2VuKCk6IFByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBnZXRTdG9yZWRUb2tlbiBmaW5pc2hlZC5cclxuICAgICAgICBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gdG9rZW4uYWNjZXNzVG9rZW47XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogS2VlcGluZyB0cmFjayBvZiBhbiBhY3RpdmUgcmVmcmVzaFRva2VuIG9wZXJhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHdpbGwgYWxsb3cgdXMgdG8gZW5zdXJlIG9ubHkgMSBzdWNoIG9wZXJhdGlvbiBoYXBwZW5zIGF0IGFueVxyXG4gICAgICogZ2l2ZW4gdGltZS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZWZyZXNoOiBQcm9taXNlPE9BdXRoMlRva2VuPiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yY2VzIGFuIGFjY2VzcyB0b2tlbiByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2hUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIGN1cnJlbnRseSBhbHJlYWR5IGRvaW5nIHRoaXMgb3BlcmF0aW9uLFxyXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgZG8gaXQgdHdpY2UgaW4gcGFyYWxsZWwuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGRUb2tlbiA9IHRoaXMudG9rZW47XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSZWZyZXNoID0gKGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdUb2tlbjogT0F1dGgyVG9rZW4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkVG9rZW4/LnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhZCBhIHJlZnJlc2ggdG9rZW4sIGxldHMgc2VlIGlmIHdlIGNhbiB1c2UgaXQhXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLm9wdGlvbnMuY2xpZW50LnJlZnJlc2hUb2tlbihvbGRUb2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbb2F1dGgyXSByZWZyZXNoIHRva2VuIG5vdCBhY2NlcHRlZCwgd2VcXCdsbCB0cnkgcmVhdXRoZW50aWNhdGluZycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5nZXROZXdUb2tlbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBvYnRhaW4gT0F1dGgyIHRva2VucywgYSBmdWxsIHJlYXV0aCBtYXkgYmUgbmVlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcj8uKGVycik7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Rva2VuO1xyXG5cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcmVUb2tlbj8uKHRva2VuKTtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlZnJlc2goKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGNsZWFyIHRoZSBjdXJyZW50IHJlZnJlc2ggb3BlcmF0aW9uLlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaW1lciB0cmlnZ2VyIGZvciB0aGUgbmV4dCBhdXRvbWF0ZWQgcmVmcmVzaFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlZnJlc2hUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNjaGVkdWxlUmVmcmVzaCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWZyZXNoVGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuPy5leHBpcmVzQXQgfHwgIXRoaXMudG9rZW4ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGtub3cgd2hlbiB0aGUgdG9rZW4gZXhwaXJlcywgb3IgZG9uJ3QgaGF2ZSBhIHJlZnJlc2hfdG9rZW4sIGRvbid0IGJvdGhlci5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gdGhpcy50b2tlbi5leHBpcmVzQXQgLSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICAvLyBXZSBvbmx5IHNjaGVkdWxlIHRoaXMgZXZlbnQgaWYgaXQgaGFwcGVucyBtb3JlIHRoYW4gMiBtaW51dGVzIGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgaWYgKGV4cGlyZXNJbiA8IDEyMCAqIDEwMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2NoZWR1bGUgMSBtaW51dGUgYmVmb3JlIGV4cGlyeVxyXG4gICAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbZmV0Y2gtbXctb2F1dGgyXSBlcnJvciB3aGlsZSBkb2luZyBhIGJhY2tncm91bmQgT0F1dGgyIGF1dG8tcmVmcmVzaCcsIGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBleHBpcmVzSW4gLSA2MCAqIDEwMDApO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENsaWVudCwgQ2xpZW50RXJyb3JJbmZvLFxyXG4gICAgTG90SW5mbyxcclxuICAgIExvdEluZm9XaXRoUHJvZHVjdElkLCBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8sXHJcbiAgICBQdXJjaGFzZUluZm8sIFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvXHJcbn0gZnJvbSBcIi4vRWJheUNsaWVudC9FYmF5Q2xpZW50XCJcclxuXHJcbmltcG9ydCB7Z2VuZXJhdGVDb2RlVmVyaWZpZXIsIE9BdXRoMkNsaWVudH0gZnJvbSAnQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudCc7XHJcbmltcG9ydCB7RmV0Y2hXcmFwcGVyQ3VzdG9tfSBmcm9tIFwiLi9GZXRjaFdyYXBwZXJDdXN0b21cIjtcclxuXHJcbmNvbnN0IGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUgPSBcImlnbm9yZVRoYXRMb3RcIjtcclxuY29uc3QgbWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWUgPSBcIm1hbnVhbENvbmRpdGlvbklkXCI7XHJcbmNvbnN0IHByb2R1Y3RGaWVsZE5hbWUgPSBcInByb2R1Y3RJZFwiO1xyXG5jb25zdCBwY3NGaWVsZE5hbWUgPSBcInBjc1wiO1xyXG5cclxuY29uc3QgcGFuZWxDbGFzcyA9IFwicGFuZWwtZGl2XCI7XHJcbmNvbnN0IGZvcm1JZCA9IFwicHJvZHVjdC1mb3JtLWlkXCJcclxuY29uc3QgZXJyb3JFbGVtZW50SWQgPSBcImVycm9yRWxlbWVudFwiXHJcbmNvbnN0IHN1Ym1pdElkID0gXCJzdWJtaXRcIlxyXG4vL2NvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vbG9jYWxob3N0OjcwOTUvXCJcclxuY29uc3QgYmFja2VuZFVybCA9IFwiaHR0cHM6Ly8xNzguMjA4LjY1LjEwMDoxNzQ0My9cIlxyXG5jb25zdCBiYXNlQXBpVXJsID0gYCR7YmFja2VuZFVybH1hcGkvZWJheS92MWA7XHJcbmNvbnN0IGF1dGhSZWRpcmVjdFVybCA9IFwiaHR0cHM6Ly93d3cuZWJheS5jb20vXCJcclxuY29uc3Qgbm90U2V0VmFsdWUgPSBcIm5vdFNldFwiXHJcbmNvbnN0IGxpZ2h0R3JlZW5Db2xvciA9IFwiI2VjZmZlY1wiXHJcbmNvbnN0IGxpZ2h0UGlua0NvbG9yID0gXCJsaWdodHBpbmtcIlxyXG5jb25zdCBsaWdodFllbGxvd0NvbG9yID0gXCIjZTBlMDdmXCJcclxuXHJcbmNvbnN0IHN1cHBvcnRlZEV1cm9wZUNvdW50cmllcyA9IG5ldyBTZXQoWydHZXJtYW55JywgJ0l0YWx5JywgJ0ZyYW5jZScsICdVbml0ZWQgS2luZ2RvbSddKVxyXG5jb25zdCBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllcyA9IFsnR2VybWFueScsICdJdGFseScsICdGcmFuY2UnLCAnVW5pdGVkIEtpbmdkb20nLCAnVW5pdGVkIFN0YXRlcyddXHJcblxyXG5jb25zdCBjb3VudHJ5SW5kZXhQYXJhbSA9ICdjdXJyZW50Q291bnRyeUluZGV4J1xyXG5cclxuY29uc3QgbG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcbmxldCBfc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQ7XHJcblxyXG4vLyBmZXRjaCDRh9C10YDQtdC3IGJhY2tncm91bmQgc2NyaXB0LCDQv9C+INC00YDRg9Cz0L7QvNGDINC90LUg0YDQsNCx0L7RgtCw0LXRglxyXG5mdW5jdGlvbiBmZXRjaFJlc291cmNlKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdDogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtpbnB1dCwgaW5pdH0sIG1lc3NhZ2VSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyZXNwb25zZSwgZXJyb3JdID0gbWVzc2FnZVJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgdW5kZWZpbmVkIG9uIGEgMjA0IC0gTm8gQ29udGVudFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlc3BvbnNlLmJvZHkgPyBuZXcgQmxvYihbcmVzcG9uc2UuYm9keV0pIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZXh0cmFjdFByaWNlKHByaWNlOiBzdHJpbmcpOiBQcmljZSB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IHByaWNlLm1hdGNoKC8oXFxEKykoXFxkKyg/OlssLl1cXGQrKT8pLylcclxuXHJcbiAgICByZXR1cm4gbmV3IFByaWNlKHBhcnNlRmxvYXQobWF0Y2hlc1syXS5yZXBsYWNlKCcsJywgJy4nKSksIG1hdGNoZXNbMV0udHJpbSgpKVxyXG59XHJcblxyXG5jbGFzcyBQcmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwcmljZTogbnVtYmVyLCBjdXJyZW5jeTogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVuY3kgPSBjdXJyZW5jeVxyXG4gICAgICAgIHRoaXMucHJpY2UgPSBwcmljZVxyXG4gICAgfVxyXG5cclxuICAgIGN1cnJlbmN5OiBzdHJpbmc7XHJcbiAgICBwcmljZTogbnVtYmVyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQYW5lbChib2R5RWxlbWVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBzdHlsZXMgPSBgXHJcbiAgICAuJHtwYW5lbENsYXNzfSB7XHJcbiAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgIHBhZGRpbmc6IDE1cHg7XHJcbiAgICAgIGJvcmRlcjogM3B4IHNvbGlkICMwMDAwY2M7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgIGNvbG9yOiAjMDAwMGNjO1xyXG4gICAgICBwb3NpdGlvbjpmaXhlZDtcclxuICAgICAgei1pbmRleDoxMDA7XHJcbiAgICAgIGxlZnQ6MSU7XHJcbiAgICAgIGJvdHRvbTo1JTtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsIHtcclxuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBpbnB1dCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gc2VsZWN0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbDphZnRlciB7IGNvbnRlbnQ6IFwiOiBcIiB9XHJcbmBcclxuXHJcbiAgICBsZXQgc3R5bGVTaGVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKVxyXG4gICAgc3R5bGVTaGVldC5pbm5lclRleHQgPSBzdHlsZXNcclxuICAgIGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlU2hlZXQpXHJcblxyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQocGFuZWxDbGFzcyk7XHJcblxyXG5cclxuICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpXHJcbiAgICBmb3JtLmlkID0gZm9ybUlkXHJcbiAgICBsZXQgaXRlbUlkID0gbG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV07XHJcbiAgICBsZXQgZG9tYWluID0gbG9jYXRpb24uaG9zdG5hbWU7XHJcblxyXG4gICAgbGV0IGhpc3RvcnlCdXR0b25IcmVmID0gYGh0dHBzOi8vJHtkb21haW59L2Jpbi9wdXJjaGFzZUhpc3Rvcnk/aXRlbT0ke2l0ZW1JZH1gO1xyXG4gICAgLy8gbGFuZ3VhZ2U9SFRNTFxyXG4gICAgZm9ybS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgPGEgaHJlZj1cIiR7aGlzdG9yeUJ1dHRvbkhyZWZ9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+0JjRgdGC0L7RgNC40Y8g0L/RgNC+0LTQsNC2INC70L7RgtCwPC9hPlxyXG4gICAgICAgIDxicj7QkdGN0LrQtdC90LQ6IDxhIGhyZWY9XCIke2JhY2tlbmRVcmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtiYWNrZW5kVXJsfTwvYT5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCI+0JjQs9C90L7RgNC40YDQvtCy0LDRgtGMINC70L7RgjwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiIHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cHJvZHVjdEZpZWxkTmFtZX1cIj7QotC+0LLQsNGAPC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCIgaWQ9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7QktGL0LHQtdGA0LjRgtC1INGC0L7QstCw0YA8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cIiR7cGNzRmllbGROYW1lfVwiPlBDUzwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPVwiJHtwY3NGaWVsZE5hbWV9XCIgdHlwZT1cIm51bWJlclwiIG5hbWU9XCIke3Bjc0ZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPtCh0L7RgdGC0L7Rj9C90LjQtTwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIiBpZD1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7QktGL0LHQtdGA0LjRgtC1INCh0L7RgdGC0L7Rj9C90LjQtTwvb3B0aW9uPlxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6IHJlZDtcIiBpZD1cIiR7ZXJyb3JFbGVtZW50SWR9XCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7c3VibWl0SWR9XCIgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2F2ZVwiIGRpc2FibGVkLz5cclxuICAgIGA7XHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoZXZlbnQsIGNsaWVudClcclxuICAgIH0pO1xyXG5cclxuICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKVxyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCwgY2xpZW50OiBDbGllbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PmV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgICAgIGxldCBpZ25vcmVUaGF0TG90ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2lnbm9yZVRoYXRMb3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZ25vcmVUaGF0TG90ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG90SW5mb1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbG90SW5mb1snaWdub3JlVGhhdExvdCddID0gaWdub3JlVGhhdExvdDtcclxuXHJcbiAgICAgICAgaWYgKGlnbm9yZVRoYXRMb3QpIHtcclxuICAgICAgICAgICAgbG90SW5mby5wY3MgPSAxXHJcbiAgICAgICAgICAgIGxvdEluZm8ubWFudWFsQ29uZGl0aW9uSWQgPSBub3RTZXRWYWx1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIHRvIGJhY2tlbmQ6IFwiICsgSlNPTi5zdHJpbmdpZnkobG90SW5mbykpXHJcblxyXG5cclxuICAgICAgICBhd2FpdCBjbGllbnQudXBzZXJ0TG90SW5mbyhsb3RJbmZvLCBkYXRhLmdldCgncHJvZHVjdElkJykudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgICAgYXdhaXQgcHJvZHVjdFBhZ2UoY2xpZW50KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBhd2FpdCBzaG93QW5kU2F2ZUVycm9yKGVycm9yLCBjbGllbnQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxTb2xkSXRlbXNSZXN1bHQoZml4ZWRQcmljZVJvd3M6IEhUTUxUYWJsZVJvd0VsZW1lbnRbXSwgcmVzdWx0OiBQdXJjaGFzZUluZm9Jbm5lcltdKSB7XHJcbiAgICBmb3IgKGxldCBmaXhlZFByaWNlUm93IG9mIGZpeGVkUHJpY2VSb3dzKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbLi4uZml4ZWRQcmljZVJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCBwcmljZSA9IGNvbHVtbnNbMV1cclxuXHJcbiAgICAgICAgaWYgKHByaWNlID09PSBcIkV4cGlyZWRcIiB8fCBwcmljZSA9PT0gXCJEZWNsaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgIT09IFwiU29sZCBhcyBhIHNwZWNpYWwgb2ZmZXJcIiAmJiBwcmljZSAhPT0gXCJDb3VudGVyLW9mZmVyZWRcIiAmJiBwcmljZSAhPT0gXCJBY2NlcHRlZFwiKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJpY2VFeHRyYWN0ZWQgPSBleHRyYWN0UHJpY2UocHJpY2UpXHJcbiAgICAgICAgICAgIGlmIChwcmljZUV4dHJhY3RlZC5jdXJyZW5jeSAhPT0gbG90SW5mby5jdXJyZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY3VycmVuY3kgZG9lc24ndCBtYXRjaCB3aXRoIGxvdCBjdXJyZW5jeVwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pLCBwcmljZUV4dHJhY3RlZCkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFB1cmNoYXNlSW5mb0lubmVyKHBhcnNlSW50KGNvbHVtbnNbMl0pLCBwYXJzZURhdGUoY29sdW1uc1szXSkpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHVyY2hhc2VJbmZvSW5uZXIge1xyXG4gICAgY29uc3RydWN0b3IocXVhbnRpdHk6IG51bWJlciwgZGF0ZTogRGF0ZSwgcHJpY2U/OiBQcmljZSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGVcclxuICAgICAgICB0aGlzLnByaWNlID0gcHJpY2VcclxuICAgIH1cclxuXHJcbiAgICBxdWFudGl0eTogbnVtYmVyO1xyXG4gICAgcHJpY2U6IFByaWNlIHwgdW5kZWZpbmVkO1xyXG4gICAgZGF0ZTogRGF0ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURhdGUoZGF0ZVN0cmluZyk6IERhdGUge1xyXG4gICAgbGV0IG1hdGNoZXMgPSBkYXRlU3RyaW5nLm1hdGNoKC8oXFxkK1xcc1tBLXpdK1xcc1xcZCspXFxzYXRcXHMoXFxkKyk6KFxcZCspOihcXGQrKShhbXxwbSlcXHMoW0Etel0rKS8pXHJcblxyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKG1hdGNoZXNbMV0gKyAnIDAwOjAwOjAwLjAwMFonKSlcclxuXHJcbiAgICBkYXRlLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1hdGNoZXNbMl0pKTtcclxuICAgIGRhdGUuc2V0VVRDTWludXRlcyhwYXJzZUludChtYXRjaGVzWzNdKSk7XHJcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobWF0Y2hlc1s0XSkpO1xyXG5cclxuICAgIGlmIChtYXRjaGVzWzVdID09PSBcInBtXCIgJiYgZGF0ZS5nZXRVVENIb3VycygpICE9PSAxMikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpICsgMTIpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1hdGNoZXNbNV0gPT09IFwiYW1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgPT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAxMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1hdGNoZXNbNl0gPT09IFwiTVNLXCIpIHtcclxuICAgICAgICBkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSAtIDMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHRpbWV6b25lIFwiICsgbWF0Y2hlc1s2XSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dDogc3RyaW5nKTogUHVyY2hhc2VJbmZvW10ge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gbmV3IEFycmF5PFB1cmNoYXNlSW5mb0lubmVyPigpO1xyXG4gICAgbGV0IGZpeGVkUHJpY2VCbG9jayA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYuZml4ZWQtcHJpY2UgdGJvZHknKVxyXG4gICAgaWYgKGZpeGVkUHJpY2VCbG9jayAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaXhlZFByaWNlUm93cyA9IFsuLi5maXhlZFByaWNlQmxvY2sucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuICAgICAgICBmaWxsU29sZEl0ZW1zUmVzdWx0KGZpeGVkUHJpY2VSb3dzLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvZmZlckJsb2NrID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5vZmZlciB0Ym9keScpXHJcbiAgICBpZiAob2ZmZXJCbG9jayAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBvZmZlclJvd3MgPSBbLi4ub2ZmZXJCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCd0cicpXVxyXG4gICAgICAgIGZpbGxTb2xkSXRlbXNSZXN1bHQob2ZmZXJSb3dzLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBiLmRhdGUuZ2V0VGltZSgpIC0gYS5kYXRlLmdldFRpbWUoKTtcclxuICAgIH0pLm1hcChmdW5jdGlvbiAoeCkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFB1cmNoYXNlSW5mbyh7XHJcbiAgICAgICAgICAgIGRhdGU6IHguZGF0ZS50b0lTT1N0cmluZygpLCBxdWFudGl0eTogeC5xdWFudGl0eSwgcHJpY2U6IHgucHJpY2U/LnByaWNlXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsSWQoKSB7XHJcbiAgICBsb3RJbmZvLmxvdElkID0gcGFyc2VJbnQobG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcL2l0bVxcLyhbMC05XSspLylbMV0pO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJpY2UoKSB7XHJcbiAgICBsZXQgcHJpY2UgPSBleHRyYWN0UHJpY2UoKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXByaWNlLXByaW1hcnkgc3BhbicsIGRvY3VtZW50KSkuaW5uZXJUZXh0KVxyXG4gICAgbG90SW5mby5wcmljZSA9IHByaWNlLnByaWNlXHJcbiAgICBsb3RJbmZvLmN1cnJlbmN5ID0gcHJpY2UuY3VycmVuY3lcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbE5hbWUoKSB7XHJcbiAgICBsb3RJbmZvLm5hbWUgPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnLnZpbSBoMScsIGRvY3VtZW50KSkuaW5uZXJUZXh0XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxTZWxsZXIoKSB7XHJcbiAgICBsb3RJbmZvLnNlbGxlciA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1zZWxsZXJjYXJkLWF0Zl9faW5mb19fYWJvdXQtc2VsbGVyIGEnLCBkb2N1bWVudCkpLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxDb25kaXRpb24oKSB7XHJcbiAgICBsb3RJbmZvLmNvbmRpdGlvbiA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYueC1pdGVtLWNvbmRpdGlvbi10ZXh0IHNwYW4udXgtdGV4dHNwYW5zJywgZG9jdW1lbnQpKS5pbm5lclRleHRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbENvbmRpdGlvbkRlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLWRlc2MnKVxyXG4gICAgaWYgKGNvbmRpdGlvbkRlc2NyaXB0aW9uRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgbG90SW5mby5jb25kaXRpb25EZXNjcmlwdGlvbiA9ICg8SFRNTEVsZW1lbnQ+Y29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50KS5pbm5lclRleHRcclxuICAgICAgICAgICAgLnJlcGxhY2UoJ+KAnCcsICcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCdJywgJycpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBoYXNTaGlwcGluZ1RvQ291bnRyeShjb3VudHJ5OiBzdHJpbmcsIHNoaXBzVG86IFNldDxzdHJpbmc+LCBleGNsdWRlczogU2V0PHN0cmluZz4pIHtcclxuICAgIHJldHVybiAoc2hpcHNUby5oYXMoJ1dvcmxkd2lkZScpIHx8IChzaGlwc1RvLmhhcyhcIkV1cm9wZVwiKSAmJiBzdXBwb3J0ZWRFdXJvcGVDb3VudHJpZXMuaGFzKGNvdW50cnkpKSB8fCBzaGlwc1RvLmhhcyhjb3VudHJ5KSkgJiYgIWV4Y2x1ZGVzLmhhcyhjb3VudHJ5KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY2hhbmdlU2hpcHBpbmdDb3VudHJ5KGN1cnJlbnRDb3VudHJ5SW5kZXg6IG51bWJlciwgc2hpcHBpbmdEaXY6IEVsZW1lbnQsIGN1cnJlbnRTaGlwcGluZ0NvdW50cnkgOiBzdHJpbmcgfCBudWxsKSB7XHJcbiAgICBpZiAoY3VycmVudENvdW50cnlJbmRleCA+PSBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcImN1cnJlbnRDb3VudHJ5SW5kZXggT3V0IG9mIHN1cHBvcnRlZCBzaGlwcGluZyBjb3VudHJpZXMgcmFuZ2VcIilcclxuICAgIFxyXG4gICAgbGV0IHNoaXBzVG8gPSBnZXRTaGlwc1RvKHNoaXBwaW5nRGl2KTtcclxuICAgIGxldCBleGNsdWRlcyA9IGdldEV4Y2x1ZGVzKHNoaXBwaW5nRGl2KTtcclxuXHJcbiAgICBsZXQgbmV4dENvdW50cnlJbmRleCA9IGN1cnJlbnRDb3VudHJ5SW5kZXhcclxuICAgIGxldCBuZXh0Q291bnRyeSA9IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzW25leHRDb3VudHJ5SW5kZXhdXHJcbiAgICBcclxuICAgIHdoaWxlICghaGFzU2hpcHBpbmdUb0NvdW50cnkobmV4dENvdW50cnksIHNoaXBzVG8sIGV4Y2x1ZGVzKSkge1xyXG4gICAgICAgIG5leHRDb3VudHJ5SW5kZXggPSBuZXh0Q291bnRyeUluZGV4ICsgMVxyXG4gICAgICAgIGlmIChuZXh0Q291bnRyeUluZGV4ID49IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiT3V0IG9mIHN1cHBvcnRlZCBzaGlwcGluZyBjb3VudHJpZXMgcmFuZ2VcIilcclxuICAgICAgICBuZXh0Q291bnRyeSA9IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzW25leHRDb3VudHJ5SW5kZXhdXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChjdXJyZW50U2hpcHBpbmdDb3VudHJ5ICE9PSBuZXh0Q291bnRyeSkge1xyXG5cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKVxyXG4gICAgICAgIGxldCBzaGlwQnV0dG9uID0gKDxIVE1MQnV0dG9uRWxlbWVudD4oYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcjZ2gtc2hpcHRvLWNsaWNrIGJ1dHRvbicsIGRvY3VtZW50KSkpO1xyXG4gICAgICAgIHNoaXBCdXR0b24uY2xpY2soKTtcclxuXHJcbiAgICAgICAgbGV0IGNob29zZVNoaXBwaW5nQ291bnRyeURpYWxvZyA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnI2doLXNoaXB0by1jbGljay1tb2RhbCcsIGRvY3VtZW50KTtcclxuICAgICAgICBhd2FpdCBzbGVlcFVudGlsKCgpID0+IGNob29zZVNoaXBwaW5nQ291bnRyeURpYWxvZy5jaGVja1Zpc2liaWxpdHkoKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMDApO1xyXG4gICAgICAgICg8SFRNTEJ1dHRvbkVsZW1lbnQ+KGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnYnV0dG9uLm1lbnUtYnV0dG9uX19idXR0b24nLCBjaG9vc2VTaGlwcGluZ0NvdW50cnlEaWFsb2cpKSkuY2xpY2soKTtcclxuXHJcbiAgICAgICAgbGV0IGl0ZW1zTWVudSA9IDxIVE1MRGl2RWxlbWVudD4oKGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2Lm1lbnUtYnV0dG9uX19pdGVtcycsIGNob29zZVNoaXBwaW5nQ291bnRyeURpYWxvZykpKTtcclxuXHJcbiAgICAgICAgYXdhaXQgc2xlZXBVbnRpbCgoKSA9PiBpdGVtc01lbnUuY2hlY2tWaXNpYmlsaXR5KCkgPT09IGZhbHNlKTtcclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKTtcclxuICAgICAgICBnZXRDb3VudHJ5U3Bhbkl0ZW0obmV4dENvdW50cnksIGl0ZW1zTWVudSkuY2xpY2soKVxyXG5cclxuICAgICAgICBhd2FpdCBzbGVlcFVudGlsKCgpID0+IHNoaXBCdXR0b24uZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKT8uaW5jbHVkZXMobmV4dENvdW50cnkpICE9PSB0cnVlKTtcclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKTtcclxuXHJcbiAgICAgICAgKDxIVE1MQnV0dG9uRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2J1dHRvbi5zaGlwdG9fX2Nsb3NlLWJ0bicsIGNob29zZVNoaXBwaW5nQ291bnRyeURpYWxvZykpLmNsaWNrKClcclxuICAgIH1cclxuICAgIGF3YWl0IHNsZWVwKDEwMDApXHJcbiAgICBsZXQgdXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTtcclxuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KGNvdW50cnlJbmRleFBhcmFtLCAobmV4dENvdW50cnlJbmRleCkudG9TdHJpbmcoKSlcclxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmwudG9TdHJpbmcoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaGlwc1RvKHNoaXBwaW5nRGl2OiBFbGVtZW50KTogU2V0PHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoKDxIVE1MRGl2RWxlbWVudD5zaGlwcGluZ0Rpdi5xdWVyeVNlbGVjdG9yKCdkaXYudXgtbGFiZWxzLXZhbHVlcy0tc2hpcHN0bycpKS5pbm5lclRleHQucmVwbGFjZShcIlNoaXBzIHRvOlwiLCBcIlwiKVxyXG4gICAgICAgIC5zcGxpdCgnLCcpLm1hcChzID0+IHMudHJpbSgpKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEV4Y2x1ZGVzKHNoaXBwaW5nRGl2OiBFbGVtZW50KTogU2V0PHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoKDxIVE1MRGl2RWxlbWVudD5zaGlwcGluZ0Rpdi5xdWVyeVNlbGVjdG9yKCdkaXYudXgtbGFiZWxzLXZhbHVlcy0tZXhjbHVkZXMnKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJFeGNsdWRlczpcIiwgXCJcIilcclxuICAgICAgICAuc3BsaXQoJywnKS5tYXAocyA9PiBzLnRyaW0oKSkpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsU2hpcHBpbmcoKSB7XHJcblxyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICBsZXQgY3VycmVudENvdW50cnlJbmRleCA9IHBhcnNlSW50KHVybC5zZWFyY2hQYXJhbXMuZ2V0KGNvdW50cnlJbmRleFBhcmFtKSA/PyBcIjBcIilcclxuICAgIGxldCBjdXJyZW50Q291bnRyeSA9IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzW2N1cnJlbnRDb3VudHJ5SW5kZXhdXHJcblxyXG4gICAgbGV0IHNoaXBwaW5nRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuZC1zaGlwcGluZy1tYXh2aWV3JywgZG9jdW1lbnQpO1xyXG5cclxuICAgIGxldCBzaGlwcGluZ1JhdGVzQXZhaWxhYmxlID0gc2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcignZGl2LnV4LWxheW91dC1zZWN0aW9uX190ZXh0dWFsLWRpc3BsYXktLWFza1NlbGxlcicpID09PSBudWxsXHJcbiAgICBpZiAoc2hpcHBpbmdSYXRlc0F2YWlsYWJsZSkge1xyXG4gICAgICAgIGxldCBzaGlwcGluZ1RhYmxlID0gc2hpcHBpbmdEaXYucXVlcnlTZWxlY3RvcigndGFibGUudXgtdGFibGUtc2VjdGlvbi13aXRoLWhpbnRzLS1zaGlwcGluZ1RhYmxlJylcclxuXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlciA9IFsuLi5zaGlwcGluZ1RhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3RoZWFkJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJyldXHJcbiAgICAgICAgbGV0IGRlbGl2ZXJ5Q29sdW1uc1ZhbHVlcyA9IFsuLi5zaGlwcGluZ1RhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5JylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ3RyJylcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ01heHZpZXdWYWx1ZXMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGRlbGl2ZXJ5Q29sdW1uc0hlYWRlcltpXS5pbm5lclRleHRcclxuICAgICAgICAgICAgc2hpcHBpbmdNYXh2aWV3VmFsdWVzW2tleV0gPSBkZWxpdmVyeUNvbHVtbnNWYWx1ZXNbaV0ucXVlcnlTZWxlY3Rvcignc3BhbicpLmlubmVyVGV4dFxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY3VycmVudFNoaXBwaW5nQ291bnRyeSA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snVG8nXTtcclxuICAgICAgICBpZiAoY3VycmVudFNoaXBwaW5nQ291bnRyeSAhPT0gY3VycmVudENvdW50cnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGFuZ2luZyBzaGlwcGluZyBjb3VudHJ5IGJlY2F1c2UgY3VycmVudCBjb3VudHJ5IFwiICsgY3VycmVudFNoaXBwaW5nQ291bnRyeSArIFwiIGRvZXNuJ3QgbWF0Y2ggd2l0aCBleHBlY3RlZCBcIiArIGN1cnJlbnRDb3VudHJ5KVxyXG4gICAgICAgICAgICBhd2FpdCBjaGFuZ2VTaGlwcGluZ0NvdW50cnkoY3VycmVudENvdW50cnlJbmRleCwgc2hpcHBpbmdEaXYsIGN1cnJlbnRTaGlwcGluZ0NvdW50cnkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwcGluZ1ZhbHVlID0gc2hpcHBpbmdNYXh2aWV3VmFsdWVzWydTaGlwcGluZyBhbmQgaGFuZGxpbmcnXVxyXG5cclxuICAgICAgICBpZiAoc2hpcHBpbmdWYWx1ZSAhPT0gJ0ZyZWUgc2hpcHBpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBzaGlwcGluZ1ByaWNlID0gZXh0cmFjdFByaWNlKHNoaXBwaW5nVmFsdWUpXHJcbiAgICAgICAgICAgIGlmIChzaGlwcGluZ1ByaWNlLmN1cnJlbmN5ICE9PSBsb3RJbmZvLmN1cnJlbmN5KSB0aHJvdyBuZXcgRXJyb3IoXCJTaGlwcGluZyBjdXJyZW5jeSBtaXNtYXRjaCB3aXRoIGxvdCBjdXJyZW5jeVwiKVxyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gc2hpcHBpbmdQcmljZS5wcmljZVxyXG5cclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nTWF4dmlld1ZhbHVlcy5oYXNPd25Qcm9wZXJ0eSgnRWFjaCBhZGRpdGlvbmFsIGl0ZW0nKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlYWNoQWRkaXRpb25hbCA9IHNoaXBwaW5nTWF4dmlld1ZhbHVlc1snRWFjaCBhZGRpdGlvbmFsIGl0ZW0nXVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYWNoQWRkaXRpb25hbCAhPT0gXCJGcmVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWFjaEFkZGl0aW9uYWxQcmljZSA9IGV4dHJhY3RQcmljZShlYWNoQWRkaXRpb25hbClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWFjaEFkZGl0aW9uYWxQcmljZS5jdXJyZW5jeSAhPT0gbG90SW5mby5jdXJyZW5jeSkgdGhyb3cgbmV3IEVycm9yKFwiRWFjaCBhZGRpdGlvbmFsIHNoaXBwaW5nIGN1cnJlbmN5IG1pc21hdGNoIHdpdGggbG90IGN1cnJlbmN5XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSBlYWNoQWRkaXRpb25hbFByaWNlLnByaWNlXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nID0gMDtcclxuICAgICAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZygnY3VycmVudFNoaXBwaW5nQ291bnRyeSAnKyBjdXJyZW50U2hpcHBpbmdDb3VudHJ5KVxyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmdDb3VudHJ5ID0gY3VycmVudFNoaXBwaW5nQ291bnRyeVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5naW5nIGJlY2F1c2UgdGhlcmUgaXMgbm8gc2hpcHBpbmcgdG8gY3VycmVudCBjb3VudHJ5XCIpXHJcbiAgICAgICAgYXdhaXQgY2hhbmdlU2hpcHBpbmdDb3VudHJ5KGN1cnJlbnRDb3VudHJ5SW5kZXggKyAxLCBzaGlwcGluZ0RpdiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBVbnRpbChmdW5jOiAoKSA9PiBib29sZWFuLCBzbGVlcE1zOiBudW1iZXIgPSAxMDAsIG1heEF0dGVtcHQ6IG51bWJlciA9IDEwMCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGF0dGVtcHQgPSAwO1xyXG4gICAgd2hpbGUgKGZ1bmMoKSkge1xyXG4gICAgICAgIGF0dGVtcHQrKztcclxuXHJcbiAgICAgICAgaWYgKGF0dGVtcHQgPiBtYXhBdHRlbXB0KSB0aHJvdyBuZXcgRXJyb3IoXCJBdHRlbXB0IGNvdW50cyBleGNlZWRlZCBcIiArIG1heEF0dGVtcHQgKyBcIiBcIiArIGZ1bmMudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgICAgYXdhaXQgc2xlZXAoc2xlZXBNcylcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q291bnRyeVNwYW5JdGVtKGNvdW50cnlOYW1lOiBzdHJpbmcsIGl0ZW1zTWVudTogSFRNTERpdkVsZW1lbnQpOiBIVE1MU3BhbkVsZW1lbnQge1xyXG4gICAgXHJcbiAgICBpZiAoY291bnRyeU5hbWUgPT09IG51bGwgfHwgY291bnRyeU5hbWUgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKFwiY291bnRyeSBuYW1lIHNob3VsZG4ndCBiZSBudWxsIG9yIHVuZGVmaW5lZFwiKVxyXG4gICAgXHJcbiAgICBsZXQgc3BhbnMgPSBpdGVtc01lbnUucXVlcnlTZWxlY3RvckFsbCgnc3Bhbi5jbicpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBpZiAoKDxIVE1MRWxlbWVudD5zcGFuc1tpXSkuaW5uZXJUZXh0ID09PSBjb3VudHJ5TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gPEhUTUxTcGFuRWxlbWVudD5zcGFuc1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZpbmQgY291bnRyeSBpbiBsaXN0IFwiICsgY291bnRyeU5hbWUpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxMb2NhdGVkSW4oKSB7XHJcbiAgICBsZXQgbWF0Y2ggPSAoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LmQtc2hpcHBpbmctbWludmlldycsIGRvY3VtZW50KSkuaW5uZXJUZXh0Lm1hdGNoKC9Mb2NhdGVkXFxzaW46XFxzKC4rKS8pXHJcbiAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmxvY2F0ZWRJbiA9IG1hdGNoWzFdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvdEluZm8ubG9jYXRlZEluID0gXCJVbmtub3duXCJcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbERlc2NyaXB0aW9uKCkge1xyXG4gICAgbGV0IGZvdW5kRWxlbWVudCA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZEFueShbJyNkZXNjX2lmcicsICcjdmlfc25pcHBldGRlc2NfYnRuJ10pXHJcblxyXG4gICAgbGV0IGRlc2NyaXB0aW9uVXJsOiBzdHJpbmdcclxuICAgIGlmIChmb3VuZEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCkge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uVXJsID0gKDxIVE1MSUZyYW1lRWxlbWVudD5mb3VuZEVsZW1lbnQpLnNyY1xyXG4gICAgfSBlbHNlIGlmIChmb3VuZEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uVXJsID0gKDxIVE1MQW5jaG9yRWxlbWVudD5mb3VuZEVsZW1lbnQpLmhyZWZcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvblVybClcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoUmVzb3VyY2UoZGVzY3JpcHRpb25VcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgIGxvdEluZm8uZGVzY3JpcHRpb24gPSBhd2FpdCByZXNwb25zZS50ZXh0KClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFB1cmNoYXNlSGlzdG9yeSgpIHtcclxuICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgIGxldCBwdXJjaGFzZUhpc3RvcnlVcmwgPSBgaHR0cHM6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoUmVzb3VyY2UocHVyY2hhc2VIaXN0b3J5VXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pXHJcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgbG90SW5mby5wdXJjaGFzZUhpc3RvcnkgPSBwYXJzZVNvbGRJdGVtc1BhZ2UodGV4dClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2VhcmNoUXVlcnkoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmIChkb2N1bWVudC5yZWZlcnJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgVVJMKGRvY3VtZW50LnJlZmVycmVyKS5zZWFyY2hQYXJhbXM/LmdldCgnX25rdycpPy50cmltKCk/LnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcm9kdWN0KHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgY2xpZW50OiBDbGllbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgcHJvZHVjdEZpZWxkID0gcGFuZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0IycgKyBwcm9kdWN0RmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgcHJvZHVjdElkID0gc2VydmVyTG90SW5mbz8ucHJvZHVjdElkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuICAgIGxldCBzZWFyY2hRdWVyeSA9IGdldFNlYXJjaFF1ZXJ5KCk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgY2xpZW50LmdldEFsbFByb2R1Y3RzKClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gcHJvZHVjdHNbaV0uaWQ7XHJcbiAgICAgICAgb3B0LmlubmVySFRNTCA9IHByb2R1Y3RzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAocHJvZHVjdElkID09PSBwcm9kdWN0c1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RzW2ldLnNlYXJjaFF1ZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFF1ZXJ5ID09PSB4LnF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvZHVjdEZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxNYW51YWxDb25kaXRpb24ocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBjbGllbnQ6IENsaWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBtYW51YWxDb25kaXRpb25GaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgbWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBtYW51YWxDb25kaXRpb25JZCA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/Lm1hbnVhbENvbmRpdGlvbklkPy50cmltKCk/LnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9ucyA9IGF3YWl0IGNsaWVudC5nZXRNYW51YWxDb25kaXRpb25zTGlzdCgpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hbnVhbENvbmRpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZDtcclxuICAgICAgICBvcHQuaW5uZXJIVE1MID0gbWFudWFsQ29uZGl0aW9uc1tpXS5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKG1hbnVhbENvbmRpdGlvbklkID09PSBtYW51YWxDb25kaXRpb25zW2ldLmlkLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hbnVhbENvbmRpdGlvbkZpZWxkLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlckxvdEluZm8oY2xpZW50OiBDbGllbnQpOiBQcm9taXNlPExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIF9zZXJ2ZXJMb3RJbmZvID0gYXdhaXQgY2xpZW50LmdldExvdEluZm8obG90SW5mby5sb3RJZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQY3MocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHBjc0ZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIHBjc0ZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHNlcnZlclBjcyA9IHNlcnZlckxvdEluZm8/LmxvdEluZm8/LnBjc1xyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGNzRmllbGQudmFsdWUgPSBzZXJ2ZXJQY3MudG9TdHJpbmcoKVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsSWdub3JlVGhhdExvdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgaWdub3JlVGhhdExvdEZpZWxkID0gPEhUTUxJbnB1dEVsZW1lbnQ+cGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXQjJyArIGlnbm9yZVRoYXRMb3RGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5pZ25vcmVUaGF0TG90XHJcbiAgICBpZiAoc2VydmVyUGNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZ25vcmVUaGF0TG90RmllbGQuY2hlY2tlZCA9IHNlcnZlclBjc1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29tcGFyZUxvdEluZm9zKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgaWYgKHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGxldCBzZXJ2ZXJMb3RJbmZvSnNvbiA9IHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkLmxvdEluZm8udG9KU09OKClcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicGNzXCJdID0gdW5kZWZpbmVkXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcImlnbm9yZVRoYXRMb3RcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wibWFudWFsQ29uZGl0aW9uSWRcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wiZGVzY3JpcHRpb25cIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wic2hpcHBpbmdcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdID0gdW5kZWZpbmVkXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcInNoaXBwaW5nQ291bnRyeVwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbGV0IHNlcnZlclB1cmNoYXNlSGlzdG9yeSA9IHNlcnZlckxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdXHJcbiAgICBzZXJ2ZXJMb3RJbmZvSnNvbltcInB1cmNoYXNlSGlzdG9yeVwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbGV0IGxvdEluZm9Kc29uID0gbG90SW5mby50b0pTT04oKVxyXG4gICAgbG90SW5mb0pzb25bXCJwY3NcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wiaWdub3JlVGhhdExvdFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJkZXNjcmlwdGlvblwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJzaGlwcGluZ1wiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wic2hpcHBpbmdDb3VudHJ5XCJdID0gdW5kZWZpbmVkXHJcbiAgICBsZXQgbG90SW5mb1B1cmNoYXNlSGlzdG9yeSA9IGxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdO1xyXG4gICAgbG90SW5mb0pzb25bXCJwdXJjaGFzZUhpc3RvcnlcIl0gPSB1bmRlZmluZWRcclxuXHJcbiAgICBsZXQgc2VydmVyTG90SW5mb0pzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXJ2ZXJMb3RJbmZvSnNvbilcclxuICAgIGxldCBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobG90SW5mb0pzb24pXHJcbiAgICBsZXQgc2VydmVyUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHNlcnZlclB1cmNoYXNlSGlzdG9yeSlcclxuICAgIGxldCBsb3RJbmZvUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm9QdXJjaGFzZUhpc3RvcnkpXHJcblxyXG4gICAgbGV0IHBhbmVsID0gPEhUTUxEaXZFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzLCBkb2N1bWVudCk7XHJcbiAgICBpZiAoc2VydmVyTG90SW5mb0pzb25TdHJpbmcgPT09IGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhzZXJ2ZXJQdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGxvdEluZm9QdXJjaGFzZUhpc3RvcnlKc29uU3RyaW5nKVxyXG4gICAgICAgIGlmIChfc2VydmVyTG90SW5mby5sb3RJbmZvLmlnbm9yZVRoYXRMb3QgPT09IHRydWUgfHwgc2VydmVyUHVyY2hhc2VIaXN0b3J5SnNvblN0cmluZyA9PT0gbG90SW5mb1B1cmNoYXNlSGlzdG9yeUpzb25TdHJpbmcpIHtcclxuICAgICAgICAgICAgcGFuZWwuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0R3JlZW5Db2xvcn07YFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodFllbGxvd0NvbG9yfTtgXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRQaW5rQ29sb3J9O2BcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGZyb20gc2VydmVyOiBcIiArIHNlcnZlckxvdEluZm9Kc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50UGFnZTogXCIgKyBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXREYXRhRnJvbVBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcywgZG9jdW1lbnQpXHJcblxyXG4gICAgZmlsbElkKCk7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFByaWNlKCksXHJcbiAgICAgICAgZmlsbE5hbWUoKSxcclxuICAgICAgICBmaWxsU2VsbGVyKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbigpLFxyXG4gICAgICAgIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGZpbGxMb2NhdGVkSW4oKSxcclxuICAgICAgICBmaWxsRGVzY3JpcHRpb24oKSxcclxuICAgICAgICBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudClcclxuICAgIF0pXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFB1cmNoYXNlSGlzdG9yeSgpLFxyXG4gICAgICAgIGZpbGxQcm9kdWN0KHBhbmVsLCBjbGllbnQsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsTWFudWFsQ29uZGl0aW9uKHBhbmVsLCBjbGllbnQsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsUGNzKHBhbmVsLCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbElnbm9yZVRoYXRMb3QocGFuZWwsIF9zZXJ2ZXJMb3RJbmZvKSxcclxuICAgICAgICBmaWxsU2hpcHBpbmcoKSxcclxuICAgIF0pO1xyXG5cclxuICAgIGF3YWl0IGNvbXBhcmVMb3RJbmZvcyhfc2VydmVyTG90SW5mbyk7XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBhZGRQYW5lbChjbGllbnQ6IENsaWVudCkge1xyXG4gICAgbGV0IGJvZHlFbGVtZW50ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdib2R5JywgZG9jdW1lbnQpO1xyXG4gICAgaWYgKGJvZHlFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGV4aXN0aW5nUGFuZWwgPSBib2R5RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuJyArIHBhbmVsQ2xhc3MpO1xyXG4gICAgICAgIGlmICghZXhpc3RpbmdQYW5lbCkge1xyXG4gICAgICAgICAgICBjcmVhdGVQYW5lbChib2R5RWxlbWVudCwgY2xpZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNhdmVFcnJvclRvQmFja2VuZChlcnJvcjogRXJyb3IsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgZXJyb3JUZXh0ID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpICsgXCIgXCIgKyBlcnJvci5zdGFja1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBjbGllbnQuc2F2ZUVycm9yKG5ldyBDbGllbnRFcnJvckluZm8oe1xyXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JUZXh0LFxyXG4gICAgICAgICAgICB1cmw6IGRvY3VtZW50LmxvY2F0aW9uLmhyZWZcclxuICAgICAgICB9KSlcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHNhdmUgZXJyb3IgdG8gYmFja2VuZCBcIiArIGVycm9yVGV4dClcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2hvd0FuZFNhdmVFcnJvcihlcnJvcjogRXJyb3IsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgZXJyb3JEaXYgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcyArICcgIycgKyBlcnJvckVsZW1lbnRJZCwgZG9jdW1lbnQpXHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uRXJyb3IgPSA8VmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8+ZXJyb3JcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IFwi0J7RiNC40LHQutCwINCy0LDQu9C40LTQsNGG0LjQuDogXCIgKyBKU09OLnN0cmluZ2lmeSh2YWxpZGF0aW9uRXJyb3IuZXJyb3JzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IGVycm9yLnN0YWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yRGl2LmFwcGVuZENoaWxkKHNwYW4pXHJcblxyXG4gICAgYXdhaXQgc2F2ZUVycm9yVG9CYWNrZW5kKGVycm9yLCBjbGllbnQpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBlbmFibGVTdWJtaXRCdXR0b24oKSB7XHJcbiAgICAoPEhUTUxCdXR0b25FbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnIycgKyBzdWJtaXRJZCwgZG9jdW1lbnQpKS5kaXNhYmxlZCA9IGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6ZUZldGNoKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KTogRmV0Y2hXcmFwcGVyQ3VzdG9tIHtcclxuICAgIHJldHVybiBuZXcgRmV0Y2hXcmFwcGVyQ3VzdG9tKHtcclxuICAgICAgICBjbGllbnQ6IG9BdXRoMkNsaWVudCxcclxuICAgICAgICBnZXROZXdUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJjb2RlX3ZlcmlmaWVyXCJdKSkuY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhd2FpdCBvQXV0aDJDbGllbnQuYXV0aG9yaXphdGlvbkNvZGUuZ2V0QXV0aG9yaXplVXJpKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXIsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogWydFYmF5LlNlcnZlckFQSSddXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFN0b3JlZFRva2VuOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWNrZW5kVXJsICE9PSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImJhY2tlbmRfdXJsXCJdKSkuYmFja2VuZF91cmwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRva2VuX3N0b3JlXCJdKSkudG9rZW5fc3RvcmU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIEpTT04ucGFyc2UodG9rZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoaWRlRXJyb3JzKCkge1xyXG4gICAgbGV0IGVycm9yRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuJyArIHBhbmVsQ2xhc3MgKyAnICMnICsgZXJyb3JFbGVtZW50SWQsIGRvY3VtZW50KVxyXG4gICAgZXJyb3JEaXYuaW5uZXJIVE1MID0gXCJcIlxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwcm9kdWN0UGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJwcm9kdWN0UGFnZVwiKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBhZGRQYW5lbChjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGdldERhdGFGcm9tUGFnZShjbGllbnQpO1xyXG4gICAgICAgIGF3YWl0IGVuYWJsZVN1Ym1pdEJ1dHRvbigpXHJcbiAgICAgICAgYXdhaXQgaGlkZUVycm9ycygpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dBbmRTYXZlRXJyb3IoZXJyb3IsIGNsaWVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGF1dGhQYWdlKG9BdXRoMkNsaWVudDogT0F1dGgyQ2xpZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImF1dGhQYWdlXCIpXHJcbiAgICBsZXQgdXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKVxyXG4gICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKFwiY29kZVwiKSkge1xyXG4gICAgICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKS5jb2RlX3ZlcmlmaWVyO1xyXG4gICAgICAgIGxldCBvYXV0aDJUb2tlbiA9IGF3YWl0IG9BdXRoMkNsaWVudC5hdXRob3JpemF0aW9uQ29kZS5nZXRUb2tlbkZyb21Db2RlUmVkaXJlY3QoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiBhdXRoUmVkaXJlY3RVcmwsXHJcbiAgICAgICAgICAgICAgICBjb2RlVmVyaWZpZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtiYWNrZW5kX3VybDogYmFja2VuZFVybH0pXHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHt0b2tlbl9zdG9yZTogSlNPTi5zdHJpbmdpZnkob2F1dGgyVG9rZW4pfSlcclxuXHJcbiAgICAgICAgbGV0IHJldHVyblBhZ2UgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInJldHVybl9wYWdlXCJdKSk/LnJldHVybl9wYWdlO1xyXG5cclxuICAgICAgICBpZiAocmV0dXJuUGFnZSAhPT0gbnVsbCAmJiByZXR1cm5QYWdlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtyZXR1cm5fcGFnZTogbnVsbH0pXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSByZXR1cm5QYWdlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGF1dGhSZWRpcmVjdFVybFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoUGFnZVwiKVxyXG4gICAgLy/RgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INC/0YDQvtC00LDQvdGL0LUg0LvQvtGC0YtcclxuICAgIGlmIChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcz8uZ2V0KCdMSF9Tb2xkJyk/LnRyaW0oKSAhPT0gXCIxXCIpIHJldHVybjtcclxuXHJcbiAgICBsZXQgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgndWwuc3JwLXJlc3VsdHMnLCBkb2N1bWVudClcclxuXHJcbiAgICBsZXQgbGlua3MgPSBbLi4uc2VhcmNoUmVzdWx0cy5xdWVyeVNlbGVjdG9yQWxsKCdsaS5zLWl0ZW0nKV1cclxuICAgICAgICAubWFwKGZ1bmN0aW9uICh4OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgbGluayA9IDxIVE1MQW5jaG9yRWxlbWVudD54LnF1ZXJ5U2VsZWN0b3IoJ2Eucy1pdGVtX19saW5rJylcclxuICAgICAgICAgICAgbGV0IHNvbGREYXRlID0gbmV3IERhdGUoKDxIVE1MRWxlbWVudD54LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uUE9TSVRJVkUnKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJTb2xkIFwiLCBcIlwiKSlcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMb3RMaW5rKHBhcnNlSW50KGxpbmsuaHJlZi5tYXRjaCgvaHR0cHM6XFwvXFwvW15cXC9dK1xcL2l0bVxcLyhcXGQrKS8pWzFdKSwgbGluaywgc29sZERhdGUpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgbGV0IF8gPSB1cGRhdGVTdGF0dXNJbmZpbml0ZShjbGllbnQsIGxpbmtzKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RhdHVzSW5maW5pdGUoY2xpZW50OiBDbGllbnQsIGxpbmtzOiBMb3RMaW5rW10pIHtcclxuICAgIGxldCBpZHMgPSBsaW5rcy5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geC5pZFxyXG4gICAgfSlcclxuICAgIC8vIG5vaW5zcGVjdGlvbiBJbmZpbml0ZUxvb3BKU1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nTG90U3RhdGVzXCIpXHJcbiAgICAgICAgICAgIGxldCBnZXRMb3RTdGF0ZXNBbnN3ZXIgPSBhd2FpdCBjbGllbnQuZ2V0TG90U3RhdGVzKGlkcylcclxuXHJcbiAgICAgICAgICAgIGxldCBrbm93bkxvdHMgPSBuZXcgTWFwKGdldExvdFN0YXRlc0Fuc3dlci5tYXAocCA9PiBbcC5sb3RJZCwgcF0pKTtcclxuXHJcbiAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29sb3IgPSB4LmNvbG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrbm93bkxvdHMuaGFzKHguaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvdFN0YXRlID0ga25vd25Mb3RzLmdldCh4LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG90U3RhdGUuaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGlmZkluRGF5cyA9IE1hdGguY2VpbCgoeC5zb2xkRGF0ZS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShsb3RTdGF0ZS5sYXN0VXBkYXRlKS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmZJbkRheXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRZZWxsb3dDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0UGlua0NvbG9yXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHguY29sb3IgIT09IG51bGwgJiYgY29sb3IgIT09IHguY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB4Lmxpbmsuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke3guY29sb3J9O2BcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhd2FpdCBzYXZlRXJyb3JUb0JhY2tlbmQoZXJyb3IsIGNsaWVudClcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwMClcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTG90TGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudCwgc29sZERhdGU6IERhdGUpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWRcclxuICAgICAgICB0aGlzLmxpbmsgPSBsaW5rXHJcbiAgICAgICAgdGhpcy5zb2xkRGF0ZSA9IHNvbGREYXRlXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBpZDogbnVtYmVyO1xyXG4gICAgbGluazogSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICBzb2xkRGF0ZTogRGF0ZVxyXG4gICAgY29sb3I6IHN0cmluZyB8IG51bGxcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBFbGVtZW50TG9hZGVkKHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnRUb1NlYXJjaEluOiBEb2N1bWVudCB8IEVsZW1lbnQpOiBQcm9taXNlPEVsZW1lbnQ+IHtcclxuICAgIGxldCByZXRyeSA9IDBcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcmV0cnkrKztcclxuICAgICAgICBpZiAocmV0cnkgPiAyMDApIHRocm93IG5ldyBFcnJvcihcInVuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3IgXCIgKyBzZWxlY3RvcilcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBlbGVtZW50VG9TZWFyY2hJbi5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxyXG4gICAgICAgIGlmIChlbGVtZW50ICE9PSBudWxsKSByZXR1cm4gZWxlbWVudFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNsZWVwRWxlbWVudExvYWRlZEFueShzZWxlY3RvcnM6IHN0cmluZ1tdKTogUHJvbWlzZTxFbGVtZW50PiB7XHJcblxyXG4gICAgbGV0IHJldHJ5ID0gMFxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICByZXRyeSsrO1xyXG4gICAgICAgIGlmIChyZXRyeSA+IDEwMDApIHRocm93IG5ldyBFcnJvcihcInVuYWJsZSB0byBmaW5kIGFueSBlbGVtZW50IGJ5IHNlbGVjdG9ycyBcIiArIHNlbGVjdG9ycy5qb2luKFwiLCBcIikpXHJcblxyXG4gICAgICAgIGxldCBmb3VuZEVsZW1lbnQ6IEVsZW1lbnRcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoeClcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZm91bmRFbGVtZW50ID0gZWxlbWVudFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGZvdW5kRWxlbWVudCAhPT0gbnVsbCkgcmV0dXJuIGZvdW5kRWxlbWVudFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2F2ZUNvZGVWZXJpZmllcigpIHtcclxuICAgIGxldCBjb2RlVmVyaWZpZXIgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImNvZGVfdmVyaWZpZXJcIl0pKT8uY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICBpZiAoY29kZVZlcmlmaWVyID09PSBudWxsIHx8IGNvZGVWZXJpZmllciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IGF3YWl0IGdlbmVyYXRlQ29kZVZlcmlmaWVyKCk7XHJcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb2RlX3ZlcmlmaWVyOiBjb2RlVmVyaWZpZXJ9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdmb290ZXInLCBkb2N1bWVudClcclxuICAgIGF3YWl0IHNhdmVDb2RlVmVyaWZpZXIoKTtcclxuXHJcbiAgICBsZXQgb0F1dGgyQ2xpZW50ID0gbmV3IE9BdXRoMkNsaWVudCh7XHJcbiAgICAgICAgc2VydmVyOiBiYWNrZW5kVXJsLFxyXG4gICAgICAgIGNsaWVudElkOiAnRWJheS5DaHJvbWVFeHRlbnNpb24nLFxyXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6ICcvY29ubmVjdC90b2tlbicsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnL2Nvbm5lY3QvYXV0aG9yaXplJyxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGN1cnJlbnRQYWdlID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lXHJcblxyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09PSBhdXRoUmVkaXJlY3RVcmwpIHtcclxuICAgICAgICBhd2FpdCBhdXRoUGFnZShvQXV0aDJDbGllbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe3JldHVybl9wYWdlOiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmfSlcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY2xpZW50ID0gbmV3IENsaWVudChiYXNlQXBpVXJsLCBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQpKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIikpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL3NjaC9cIikpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHNlYXJjaFBhZ2UoY2xpZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNhdmVFcnJvclRvQmFja2VuZChlcnJvciwgY2xpZW50KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9