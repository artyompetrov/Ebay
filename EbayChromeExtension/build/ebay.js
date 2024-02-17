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

/***/ "./node_modules/jsonpath/jsonpath.js":
/*!*******************************************!*\
  !*** ./node_modules/jsonpath/jsonpath.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! jsonpath 1.1.1 */

(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=undefined;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=undefined;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./aesprim":[function(require,module,exports){
/*
  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
  Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint bitwise:true plusplus:true */
/*global esprima:true, define:true, exports:true, window: true,
throwErrorTolerant: true,
throwError: true, generateStatement: true, peek: true,
parseAssignmentExpression: true, parseBlock: true, parseExpression: true,
parseFunctionDeclaration: true, parseFunctionExpression: true,
parseFunctionSourceElements: true, parseVariableIdentifier: true,
parseLeftHandSideExpression: true,
parseUnaryExpression: true,
parseStatement: true, parseSourceElement: true */

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.esprima = {}));
    }
}(this, function (exports) {
    'use strict';

    var Token,
        TokenName,
        FnExprTokens,
        Syntax,
        PropertyKind,
        Messages,
        Regex,
        SyntaxTreeDelegate,
        source,
        strict,
        index,
        lineNumber,
        lineStart,
        length,
        delegate,
        lookahead,
        state,
        extra;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8,
        RegularExpression: 9
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';
    TokenName[Token.RegularExpression] = 'RegularExpression';

    // A function following one of those tokens is an expression.
    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
                    'return', 'case', 'delete', 'throw', 'void',
                    // assignment operators
                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
                    '&=', '|=', '^=', ',',
                    // binary/unary operators
                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
                    '<=', '<', '>', '!=', '!=='];

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
    };

    PropertyKind = {
        Data: 1,
        Get: 2,
        Set: 4
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken:  'Unexpected token %0',
        UnexpectedNumber:  'Unexpected number',
        UnexpectedString:  'Unexpected string',
        UnexpectedIdentifier:  'Unexpected identifier',
        UnexpectedReserved:  'Unexpected reserved word',
        UnexpectedEOS:  'Unexpected end of input',
        NewlineAfterThrow:  'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp:  'Invalid regular expression: missing /',
        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally:  'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith:  'Strict mode code may not include a with statement',
        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord:  'Use of future reserved word in strict mode'
    };

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        /* istanbul ignore if */
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57);   // 0..9
    }

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
    }


    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch == 0x40) ||  (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
    }

    // 7.6.1.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {
        case 'class':
        case 'enum':
        case 'export':
        case 'extends':
        case 'import':
        case 'super':
            return true;
        default:
            return false;
        }
    }

    function isStrictModeReservedWord(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    // 7.6.1.1 Keywords

    function isKeyword(id) {
        if (strict && isStrictModeReservedWord(id)) {
            return true;
        }

        // 'const' is specialized as Keyword in V8.
        // 'yield' and 'let' are for compatiblity with SpiderMonkey and ES.next.
        // Some others are from future reserved words.

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') ||
                (id === 'try') || (id === 'let');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    // 7.4 Comments

    function addComment(type, value, start, end, loc) {
        var comment, attacher;

        assert(typeof start === 'number', 'Comment must have valid position');

        // Because the way the actual token is scanned, often the comments
        // (if any) are skipped twice during the lexical analysis.
        // Thus, we need to skip adding a comment if the comment array already
        // handled it.
        if (state.lastCommentStart >= start) {
            return;
        }
        state.lastCommentStart = start;

        comment = {
            type: type,
            value: value
        };
        if (extra.range) {
            comment.range = [start, end];
        }
        if (extra.loc) {
            comment.loc = loc;
        }
        extra.comments.push(comment);
        if (extra.attachComment) {
            extra.leadingComments.push(comment);
            extra.trailingComments.push(comment);
        }
    }

    function skipSingleLineComment(offset) {
        var start, loc, ch, comment;

        start = index - offset;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart - offset
            }
        };

        while (index < length) {
            ch = source.charCodeAt(index);
            ++index;
            if (isLineTerminator(ch)) {
                if (extra.comments) {
                    comment = source.slice(start + offset, index - 1);
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart - 1
                    };
                    addComment('Line', comment, start, index - 1, loc);
                }
                if (ch === 13 && source.charCodeAt(index) === 10) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                return;
            }
        }

        if (extra.comments) {
            comment = source.slice(start + offset, index);
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            addComment('Line', comment, start, index, loc);
        }
    }

    function skipMultiLineComment() {
        var start, loc, ch, comment;

        if (extra.comments) {
            start = index - 2;
            loc = {
                start: {
                    line: lineNumber,
                    column: index - lineStart - 2
                }
            };
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (isLineTerminator(ch)) {
                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                ++index;
                lineStart = index;
                if (index >= length) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            } else if (ch === 0x2A) {
                // Block comment ends with '*/'.
                if (source.charCodeAt(index + 1) === 0x2F) {
                    ++index;
                    ++index;
                    if (extra.comments) {
                        comment = source.slice(start + 2, index - 2);
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        addComment('Block', comment, start, index, loc);
                    }
                    return;
                }
                ++index;
            } else {
                ++index;
            }
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    function skipComment() {
        var ch, start;

        start = (index === 0);
        while (index < length) {
            ch = source.charCodeAt(index);

            if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                ++index;
                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                start = true;
            } else if (ch === 0x2F) { // U+002F is '/'
                ch = source.charCodeAt(index + 1);
                if (ch === 0x2F) {
                    ++index;
                    ++index;
                    skipSingleLineComment(2);
                    start = true;
                } else if (ch === 0x2A) {  // U+002A is '*'
                    ++index;
                    ++index;
                    skipMultiLineComment();
                } else {
                    break;
                }
            } else if (start && ch === 0x2D) { // U+002D is '-'
                // U+003E is '>'
                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
                    // '-->' is a single-line comment
                    index += 3;
                    skipSingleLineComment(3);
                } else {
                    break;
                }
            } else if (ch === 0x3C) { // U+003C is '<'
                if (source.slice(index + 1, index + 4) === '!--') {
                    ++index; // `<`
                    ++index; // `!`
                    ++index; // `-`
                    ++index; // `-`
                    skipSingleLineComment(4);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = source[index++];
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function getEscapedIdentifier() {
        var ch, id;

        ch = source.charCodeAt(index++);
        id = String.fromCharCode(ch);

        // '\u' (U+005C, U+0075) denotes an escaped character.
        if (ch === 0x5C) {
            if (source.charCodeAt(index) !== 0x75) {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
            ++index;
            ch = scanHexEscape('u');
            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
            id = ch;
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (!isIdentifierPart(ch)) {
                break;
            }
            ++index;
            id += String.fromCharCode(ch);

            // '\u' (U+005C, U+0075) denotes an escaped character.
            if (ch === 0x5C) {
                id = id.substr(0, id.length - 1);
                if (source.charCodeAt(index) !== 0x75) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
                ++index;
                ch = scanHexEscape('u');
                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
                id += ch;
            }
        }

        return id;
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (ch === 0x5C) {
                // Blackslash (U+005C) marks Unicode escape sequence.
                index = start;
                return getEscapedIdentifier();
            }
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        // Backslash (U+005C) starts an escaped character.
        id = (source.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }


    // 7.7 Punctuators

    function scanPunctuator() {
        var start = index,
            code = source.charCodeAt(index),
            code2,
            ch1 = source[index],
            ch2,
            ch3,
            ch4;

        switch (code) {

        // Check for most common single-character punctuators.
        case 0x2E:  // . dot
        case 0x28:  // ( open bracket
        case 0x29:  // ) close bracket
        case 0x3B:  // ; semicolon
        case 0x2C:  // , comma
        case 0x7B:  // { open curly brace
        case 0x7D:  // } close curly brace
        case 0x5B:  // [
        case 0x5D:  // ]
        case 0x3A:  // :
        case 0x3F:  // ?
        case 0x7E:  // ~
            ++index;
            if (extra.tokenize) {
                if (code === 0x28) {
                    extra.openParenToken = extra.tokens.length;
                } else if (code === 0x7B) {
                    extra.openCurlyToken = extra.tokens.length;
                }
            }
            return {
                type: Token.Punctuator,
                value: String.fromCharCode(code),
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };

        default:
            code2 = source.charCodeAt(index + 1);

            // '=' (U+003D) marks an assignment or comparison operator.
            if (code2 === 0x3D) {
                switch (code) {
                case 0x2B:  // +
                case 0x2D:  // -
                case 0x2F:  // /
                case 0x3C:  // <
                case 0x3E:  // >
                case 0x5E:  // ^
                case 0x7C:  // |
                case 0x25:  // %
                case 0x26:  // &
                case 0x2A:  // *
                    index += 2;
                    return {
                        type: Token.Punctuator,
                        value: String.fromCharCode(code) + String.fromCharCode(code2),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };

                case 0x21: // !
                case 0x3D: // =
                    index += 2;

                    // !== and ===
                    if (source.charCodeAt(index) === 0x3D) {
                        ++index;
                    }
                    return {
                        type: Token.Punctuator,
                        value: source.slice(start, index),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
            }
        }

        // 4-character punctuator: >>>=

        ch4 = source.substr(index, 4);

        if (ch4 === '>>>=') {
            index += 4;
            return {
                type: Token.Punctuator,
                value: ch4,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        // 3-character punctuators: === !== >>> <<= >>=

        ch3 = ch4.substr(0, 3);

        if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: ch3,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        // Other 2-character punctuators: ++ -- << >> && ||
        ch2 = ch3.substr(0, 2);

        if ((ch1 === ch2[1] && ('+-<>&|'.indexOf(ch1) >= 0)) || ch2 === '=>') {
            index += 2;
            return {
                type: Token.Punctuator,
                value: ch2,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        // 1-character punctuators: < > = ! + - * % & | ^ /
        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    // 7.8.3 Numeric Literals

    function scanHexLiteral(start) {
        var number = '';

        while (index < length) {
            if (!isHexDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt('0x' + number, 16),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanOctalLiteral(start) {
        var number = '0' + source[index++];
        while (index < length) {
            if (!isOctalDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 8),
            octal: true,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    ++index;
                    return scanHexLiteral(start);
                }
                if (isOctalDigit(ch)) {
                    return scanOctalLiteral(start);
                }

                // decimal number starts with '0' such as '09' is illegal.
                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'u':
                    case 'x':
                        restore = index;
                        unescaped = scanHexEscape(ch);
                        if (unescaped) {
                            str += unescaped;
                        } else {
                            index = restore;
                            str += ch;
                        }
                        break;
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;

                    default:
                        if (isOctalDigit(ch)) {
                            code = '01234567'.indexOf(ch);

                            // \0 is not octal escape sequence
                            if (code !== 0) {
                                octal = true;
                            }

                            if (index < length && isOctalDigit(source[index])) {
                                octal = true;
                                code = code * 8 + '01234567'.indexOf(source[index++]);

                                // 3 digits are only allowed when string starts
                                // with 0, 1, 2, 3
                                if ('0123'.indexOf(ch) >= 0 &&
                                        index < length &&
                                        isOctalDigit(source[index])) {
                                    code = code * 8 + '01234567'.indexOf(source[index++]);
                                }
                            }
                            str += String.fromCharCode(code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch ===  '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            startLineNumber: startLineNumber,
            startLineStart: startLineStart,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function testRegExp(pattern, flags) {
        var value;
        try {
            value = new RegExp(pattern, flags);
        } catch (e) {
            throwError({}, Messages.InvalidRegExp);
        }
        return value;
    }

    function scanRegExpBody() {
        var ch, str, classMarker, terminated, body;

        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];

        classMarker = false;
        terminated = false;
        while (index < length) {
            ch = source[index++];
            str += ch;
            if (ch === '\\') {
                ch = source[index++];
                // ECMA-262 7.8.5
                if (isLineTerminator(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnterminatedRegExp);
                }
                str += ch;
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                throwError({}, Messages.UnterminatedRegExp);
            } else if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
                }
            } else {
                if (ch === '/') {
                    terminated = true;
                    break;
                } else if (ch === '[') {
                    classMarker = true;
                }
            }
        }

        if (!terminated) {
            throwError({}, Messages.UnterminatedRegExp);
        }

        // Exclude leading and trailing slash.
        body = str.substr(1, str.length - 2);
        return {
            value: body,
            literal: str
        };
    }

    function scanRegExpFlags() {
        var ch, str, flags, restore;

        str = '';
        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch.charCodeAt(0))) {
                break;
            }

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        for (str += '\\u'; restore < index; ++restore) {
                            str += source[restore];
                        }
                    } else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                    }
                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
                } else {
                    str += '\\';
                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            } else {
                flags += ch;
                str += ch;
            }
        }

        return {
            value: flags,
            literal: str
        };
    }

    function scanRegExp() {
        var start, body, flags, pattern, value;

        lookahead = null;
        skipComment();
        start = index;

        body = scanRegExpBody();
        flags = scanRegExpFlags();
        value = testRegExp(body.value, flags.value);

        if (extra.tokenize) {
            return {
                type: Token.RegularExpression,
                value: value,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        return {
            literal: body.literal + flags.literal,
            value: value,
            start: start,
            end: index
        };
    }

    function collectRegex() {
        var pos, loc, regex, token;

        skipComment();

        pos = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        regex = scanRegExp();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        /* istanbul ignore next */
        if (!extra.tokenize) {
            // Pop the previous token, which is likely '/' or '/='
            if (extra.tokens.length > 0) {
                token = extra.tokens[extra.tokens.length - 1];
                if (token.range[0] === pos && token.type === 'Punctuator') {
                    if (token.value === '/' || token.value === '/=') {
                        extra.tokens.pop();
                    }
                }
            }

            extra.tokens.push({
                type: 'RegularExpression',
                value: regex.literal,
                range: [pos, index],
                loc: loc
            });
        }

        return regex;
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    function advanceSlash() {
        var prevToken,
            checkToken;
        // Using the following algorithm:
        // https://github.com/mozilla/sweet.js/wiki/design
        prevToken = extra.tokens[extra.tokens.length - 1];
        if (!prevToken) {
            // Nothing before that: it cannot be a division.
            return collectRegex();
        }
        if (prevToken.type === 'Punctuator') {
            if (prevToken.value === ']') {
                return scanPunctuator();
            }
            if (prevToken.value === ')') {
                checkToken = extra.tokens[extra.openParenToken - 1];
                if (checkToken &&
                        checkToken.type === 'Keyword' &&
                        (checkToken.value === 'if' ||
                         checkToken.value === 'while' ||
                         checkToken.value === 'for' ||
                         checkToken.value === 'with')) {
                    return collectRegex();
                }
                return scanPunctuator();
            }
            if (prevToken.value === '}') {
                // Dividing a function by anything makes little sense,
                // but we have to check for that.
                if (extra.tokens[extra.openCurlyToken - 3] &&
                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
                    // Anonymous function.
                    checkToken = extra.tokens[extra.openCurlyToken - 4];
                    if (!checkToken) {
                        return scanPunctuator();
                    }
                } else if (extra.tokens[extra.openCurlyToken - 4] &&
                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
                    // Named function.
                    checkToken = extra.tokens[extra.openCurlyToken - 5];
                    if (!checkToken) {
                        return collectRegex();
                    }
                } else {
                    return scanPunctuator();
                }
                // checkToken determines whether the function is
                // a declaration or an expression.
                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
                    // It is an expression.
                    return scanPunctuator();
                }
                // It is a declaration.
                return collectRegex();
            }
            return collectRegex();
        }
        if (prevToken.type === 'Keyword') {
            return collectRegex();
        }
        return scanPunctuator();
    }

    function advance() {
        var ch;

        skipComment();

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: index,
                end: index
            };
        }

        ch = source.charCodeAt(index);

        if (isIdentifierStart(ch)) {
            return scanIdentifier();
        }

        // Very common: ( and ) and ;
        if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
            return scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (ch === 0x27 || ch === 0x22) {
            return scanStringLiteral();
        }


        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (ch === 0x2E) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(ch)) {
            return scanNumericLiteral();
        }

        // Slash (/) U+002F can also start a regex.
        if (extra.tokenize && ch === 0x2F) {
            return advanceSlash();
        }

        return scanPunctuator();
    }

    function collectToken() {
        var loc, token, range, value;

        skipComment();
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        token = advance();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        if (token.type !== Token.EOF) {
            value = source.slice(token.start, token.end);
            extra.tokens.push({
                type: TokenName[token.type],
                value: value,
                range: [token.start, token.end],
                loc: loc
            });
        }

        return token;
    }

    function lex() {
        var token;

        token = lookahead;
        index = token.end;
        lineNumber = token.lineNumber;
        lineStart = token.lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();

        index = token.end;
        lineNumber = token.lineNumber;
        lineStart = token.lineStart;

        return token;
    }

    function peek() {
        var pos, line, start;

        pos = index;
        line = lineNumber;
        start = lineStart;
        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        index = pos;
        lineNumber = line;
        lineStart = start;
    }

    function Position(line, column) {
        this.line = line;
        this.column = column;
    }

    function SourceLocation(startLine, startColumn, line, column) {
        this.start = new Position(startLine, startColumn);
        this.end = new Position(line, column);
    }

    SyntaxTreeDelegate = {

        name: 'SyntaxTree',

        processComment: function (node) {
            var lastChild, trailingComments;

            if (node.type === Syntax.Program) {
                if (node.body.length > 0) {
                    return;
                }
            }

            if (extra.trailingComments.length > 0) {
                if (extra.trailingComments[0].range[0] >= node.range[1]) {
                    trailingComments = extra.trailingComments;
                    extra.trailingComments = [];
                } else {
                    extra.trailingComments.length = 0;
                }
            } else {
                if (extra.bottomRightStack.length > 0 &&
                        extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments &&
                        extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments[0].range[0] >= node.range[1]) {
                    trailingComments = extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                    delete extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                }
            }

            // Eating the stack.
            while (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].range[0] >= node.range[0]) {
                lastChild = extra.bottomRightStack.pop();
            }

            if (lastChild) {
                if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
                    node.leadingComments = lastChild.leadingComments;
                    delete lastChild.leadingComments;
                }
            } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
                node.leadingComments = extra.leadingComments;
                extra.leadingComments = [];
            }


            if (trailingComments) {
                node.trailingComments = trailingComments;
            }

            extra.bottomRightStack.push(node);
        },

        markEnd: function (node, startToken) {
            if (extra.range) {
                node.range = [startToken.start, index];
            }
            if (extra.loc) {
                node.loc = new SourceLocation(
                    startToken.startLineNumber === undefined ?  startToken.lineNumber : startToken.startLineNumber,
                    startToken.start - (startToken.startLineStart === undefined ?  startToken.lineStart : startToken.startLineStart),
                    lineNumber,
                    index - lineStart
                );
                this.postProcess(node);
            }

            if (extra.attachComment) {
                this.processComment(node);
            }
            return node;
        },

        postProcess: function (node) {
            if (extra.source) {
                node.loc.source = extra.source;
            }
            return node;
        },

        createArrayExpression: function (elements) {
            return {
                type: Syntax.ArrayExpression,
                elements: elements
            };
        },

        createAssignmentExpression: function (operator, left, right) {
            return {
                type: Syntax.AssignmentExpression,
                operator: operator,
                left: left,
                right: right
            };
        },

        createBinaryExpression: function (operator, left, right) {
            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
                        Syntax.BinaryExpression;
            return {
                type: type,
                operator: operator,
                left: left,
                right: right
            };
        },

        createBlockStatement: function (body) {
            return {
                type: Syntax.BlockStatement,
                body: body
            };
        },

        createBreakStatement: function (label) {
            return {
                type: Syntax.BreakStatement,
                label: label
            };
        },

        createCallExpression: function (callee, args) {
            return {
                type: Syntax.CallExpression,
                callee: callee,
                'arguments': args
            };
        },

        createCatchClause: function (param, body) {
            return {
                type: Syntax.CatchClause,
                param: param,
                body: body
            };
        },

        createConditionalExpression: function (test, consequent, alternate) {
            return {
                type: Syntax.ConditionalExpression,
                test: test,
                consequent: consequent,
                alternate: alternate
            };
        },

        createContinueStatement: function (label) {
            return {
                type: Syntax.ContinueStatement,
                label: label
            };
        },

        createDebuggerStatement: function () {
            return {
                type: Syntax.DebuggerStatement
            };
        },

        createDoWhileStatement: function (body, test) {
            return {
                type: Syntax.DoWhileStatement,
                body: body,
                test: test
            };
        },

        createEmptyStatement: function () {
            return {
                type: Syntax.EmptyStatement
            };
        },

        createExpressionStatement: function (expression) {
            return {
                type: Syntax.ExpressionStatement,
                expression: expression
            };
        },

        createForStatement: function (init, test, update, body) {
            return {
                type: Syntax.ForStatement,
                init: init,
                test: test,
                update: update,
                body: body
            };
        },

        createForInStatement: function (left, right, body) {
            return {
                type: Syntax.ForInStatement,
                left: left,
                right: right,
                body: body,
                each: false
            };
        },

        createFunctionDeclaration: function (id, params, defaults, body) {
            return {
                type: Syntax.FunctionDeclaration,
                id: id,
                params: params,
                defaults: defaults,
                body: body,
                rest: null,
                generator: false,
                expression: false
            };
        },

        createFunctionExpression: function (id, params, defaults, body) {
            return {
                type: Syntax.FunctionExpression,
                id: id,
                params: params,
                defaults: defaults,
                body: body,
                rest: null,
                generator: false,
                expression: false
            };
        },

        createIdentifier: function (name) {
            return {
                type: Syntax.Identifier,
                name: name
            };
        },

        createIfStatement: function (test, consequent, alternate) {
            return {
                type: Syntax.IfStatement,
                test: test,
                consequent: consequent,
                alternate: alternate
            };
        },

        createLabeledStatement: function (label, body) {
            return {
                type: Syntax.LabeledStatement,
                label: label,
                body: body
            };
        },

        createLiteral: function (token) {
            return {
                type: Syntax.Literal,
                value: token.value,
                raw: source.slice(token.start, token.end)
            };
        },

        createMemberExpression: function (accessor, object, property) {
            return {
                type: Syntax.MemberExpression,
                computed: accessor === '[',
                object: object,
                property: property
            };
        },

        createNewExpression: function (callee, args) {
            return {
                type: Syntax.NewExpression,
                callee: callee,
                'arguments': args
            };
        },

        createObjectExpression: function (properties) {
            return {
                type: Syntax.ObjectExpression,
                properties: properties
            };
        },

        createPostfixExpression: function (operator, argument) {
            return {
                type: Syntax.UpdateExpression,
                operator: operator,
                argument: argument,
                prefix: false
            };
        },

        createProgram: function (body) {
            return {
                type: Syntax.Program,
                body: body
            };
        },

        createProperty: function (kind, key, value) {
            return {
                type: Syntax.Property,
                key: key,
                value: value,
                kind: kind
            };
        },

        createReturnStatement: function (argument) {
            return {
                type: Syntax.ReturnStatement,
                argument: argument
            };
        },

        createSequenceExpression: function (expressions) {
            return {
                type: Syntax.SequenceExpression,
                expressions: expressions
            };
        },

        createSwitchCase: function (test, consequent) {
            return {
                type: Syntax.SwitchCase,
                test: test,
                consequent: consequent
            };
        },

        createSwitchStatement: function (discriminant, cases) {
            return {
                type: Syntax.SwitchStatement,
                discriminant: discriminant,
                cases: cases
            };
        },

        createThisExpression: function () {
            return {
                type: Syntax.ThisExpression
            };
        },

        createThrowStatement: function (argument) {
            return {
                type: Syntax.ThrowStatement,
                argument: argument
            };
        },

        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
            return {
                type: Syntax.TryStatement,
                block: block,
                guardedHandlers: guardedHandlers,
                handlers: handlers,
                finalizer: finalizer
            };
        },

        createUnaryExpression: function (operator, argument) {
            if (operator === '++' || operator === '--') {
                return {
                    type: Syntax.UpdateExpression,
                    operator: operator,
                    argument: argument,
                    prefix: true
                };
            }
            return {
                type: Syntax.UnaryExpression,
                operator: operator,
                argument: argument,
                prefix: true
            };
        },

        createVariableDeclaration: function (declarations, kind) {
            return {
                type: Syntax.VariableDeclaration,
                declarations: declarations,
                kind: kind
            };
        },

        createVariableDeclarator: function (id, init) {
            return {
                type: Syntax.VariableDeclarator,
                id: id,
                init: init
            };
        },

        createWhileStatement: function (test, body) {
            return {
                type: Syntax.WhileStatement,
                test: test,
                body: body
            };
        },

        createWithStatement: function (object, body) {
            return {
                type: Syntax.WithStatement,
                object: object,
                body: body
            };
        }
    };

    // Return true if there is a line terminator before the next token.

    function peekLineTerminator() {
        var pos, line, start, found;

        pos = index;
        line = lineNumber;
        start = lineStart;
        skipComment();
        found = lineNumber !== line;
        index = pos;
        lineNumber = line;
        lineStart = start;

        return found;
    }

    // Throw an exception

    function throwError(token, messageFormat) {
        var error,
            args = Array.prototype.slice.call(arguments, 2),
            msg = messageFormat.replace(
                /%(\d)/g,
                function (whole, index) {
                    assert(index < args.length, 'Message reference must be in range');
                    return args[index];
                }
            );

        if (typeof token.lineNumber === 'number') {
            error = new Error('Line ' + token.lineNumber + ': ' + msg);
            error.index = token.start;
            error.lineNumber = token.lineNumber;
            error.column = token.start - lineStart + 1;
        } else {
            error = new Error('Line ' + lineNumber + ': ' + msg);
            error.index = index;
            error.lineNumber = lineNumber;
            error.column = index - lineStart + 1;
        }

        error.description = msg;
        throw error;
    }

    function throwErrorTolerant() {
        try {
            throwError.apply(null, arguments);
        } catch (e) {
            if (extra.errors) {
                extra.errors.push(e);
            } else {
                throw e;
            }
        }
    }


    // Throw an exception because of the token.

    function throwUnexpected(token) {
        if (token.type === Token.EOF) {
            throwError(token, Messages.UnexpectedEOS);
        }

        if (token.type === Token.NumericLiteral) {
            throwError(token, Messages.UnexpectedNumber);
        }

        if (token.type === Token.StringLiteral) {
            throwError(token, Messages.UnexpectedString);
        }

        if (token.type === Token.Identifier) {
            throwError(token, Messages.UnexpectedIdentifier);
        }

        if (token.type === Token.Keyword) {
            if (isFutureReservedWord(token.value)) {
                throwError(token, Messages.UnexpectedReserved);
            } else if (strict && isStrictModeReservedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictReservedWord);
                return;
            }
            throwError(token, Messages.UnexpectedToken, token.value);
        }

        // BooleanLiteral, NullLiteral, or Punctuator.
        throwError(token, Messages.UnexpectedToken, token.value);
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
        }
    }

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpected(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var op;

        if (lookahead.type !== Token.Punctuator) {
            return false;
        }
        op = lookahead.value;
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
    }

    function consumeSemicolon() {
        var line;

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(index) === 0x3B || match(';')) {
            lex();
            return;
        }

        line = lineNumber;
        skipComment();
        if (lineNumber !== line) {
            return;
        }

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpected(lookahead);
        }
    }

    // Return true if provided expression is LeftHandSideExpression

    function isLeftHandSide(expr) {
        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
    }

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [], startToken;

        startToken = lookahead;
        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                elements.push(parseAssignmentExpression());

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        lex();

        return delegate.markEnd(delegate.createArrayExpression(elements), startToken);
    }

    // 11.1.5 Object Initialiser

    function parsePropertyFunction(param, first) {
        var previousStrict, body, startToken;

        previousStrict = strict;
        startToken = lookahead;
        body = parseFunctionSourceElements();
        if (first && strict && isRestrictedWord(param[0].name)) {
            throwErrorTolerant(first, Messages.StrictParamName);
        }
        strict = previousStrict;
        return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body), startToken);
    }

    function parseObjectPropertyKey() {
        var token, startToken;

        startToken = lookahead;
        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            if (strict && token.octal) {
                throwErrorTolerant(token, Messages.StrictOctalLiteral);
            }
            return delegate.markEnd(delegate.createLiteral(token), startToken);
        }

        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
    }

    function parseObjectProperty() {
        var token, key, id, value, param, startToken;

        token = lookahead;
        startToken = lookahead;

        if (token.type === Token.Identifier) {

            id = parseObjectPropertyKey();

            // Property Assignment: Getter and Setter.

            if (token.value === 'get' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                expect(')');
                value = parsePropertyFunction([]);
                return delegate.markEnd(delegate.createProperty('get', key, value), startToken);
            }
            if (token.value === 'set' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                token = lookahead;
                if (token.type !== Token.Identifier) {
                    expect(')');
                    throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
                    value = parsePropertyFunction([]);
                } else {
                    param = [ parseVariableIdentifier() ];
                    expect(')');
                    value = parsePropertyFunction(param, token);
                }
                return delegate.markEnd(delegate.createProperty('set', key, value), startToken);
            }
            expect(':');
            value = parseAssignmentExpression();
            return delegate.markEnd(delegate.createProperty('init', id, value), startToken);
        }
        if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
        } else {
            key = parseObjectPropertyKey();
            expect(':');
            value = parseAssignmentExpression();
            return delegate.markEnd(delegate.createProperty('init', key, value), startToken);
        }
    }

    function parseObjectInitialiser() {
        var properties = [], property, name, key, kind, map = {}, toString = String, startToken;

        startToken = lookahead;

        expect('{');

        while (!match('}')) {
            property = parseObjectProperty();

            if (property.key.type === Syntax.Identifier) {
                name = property.key.name;
            } else {
                name = toString(property.key.value);
            }
            kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;

            key = '$' + name;
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                if (map[key] === PropertyKind.Data) {
                    if (strict && kind === PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.StrictDuplicateProperty);
                    } else if (kind !== PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.AccessorDataProperty);
                    }
                } else {
                    if (kind === PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.AccessorDataProperty);
                    } else if (map[key] & kind) {
                        throwErrorTolerant({}, Messages.AccessorGetSet);
                    }
                }
                map[key] |= kind;
            } else {
                map[key] = kind;
            }

            properties.push(property);

            if (!match('}')) {
                expect(',');
            }
        }

        expect('}');

        return delegate.markEnd(delegate.createObjectExpression(properties), startToken);
    }

    // 11.1.6 The Grouping Operator

    function parseGroupExpression() {
        var expr;

        expect('(');

        expr = parseExpression();

        expect(')');

        return expr;
    }


    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr, startToken;

        if (match('(')) {
            return parseGroupExpression();
        }

        if (match('[')) {
            return parseArrayInitialiser();
        }

        if (match('{')) {
            return parseObjectInitialiser();
        }

        type = lookahead.type;
        startToken = lookahead;

        if (type === Token.Identifier) {
            expr =  delegate.createIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            if (strict && lookahead.octal) {
                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
            }
            expr = delegate.createLiteral(lex());
        } else if (type === Token.Keyword) {
            if (matchKeyword('function')) {
                return parseFunctionExpression();
            }
            if (matchKeyword('this')) {
                lex();
                expr = delegate.createThisExpression();
            } else {
                throwUnexpected(lex());
            }
        } else if (type === Token.BooleanLiteral) {
            token = lex();
            token.value = (token.value === 'true');
            expr = delegate.createLiteral(token);
        } else if (type === Token.NullLiteral) {
            token = lex();
            token.value = null;
            expr = delegate.createLiteral(token);
        } else if (match('/') || match('/=')) {
            if (typeof extra.tokens !== 'undefined') {
                expr = delegate.createLiteral(collectRegex());
            } else {
                expr = delegate.createLiteral(scanRegExp());
            }
            peek();
        } else {
            throwUnexpected(lex());
        }

        return delegate.markEnd(expr, startToken);
    }

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (index < length) {
                args.push(parseAssignmentExpression());
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token, startToken;

        startToken = lookahead;
        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpected(token);
        }

        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = parseExpression();

        expect(']');

        return expr;
    }

    function parseNewExpression() {
        var callee, args, startToken;

        startToken = lookahead;
        expectKeyword('new');
        callee = parseLeftHandSideExpression();
        args = match('(') ? parseArguments() : [];

        return delegate.markEnd(delegate.createNewExpression(callee, args), startToken);
    }

    function parseLeftHandSideExpressionAllowCall() {
        var previousAllowIn, expr, args, property, startToken;

        startToken = lookahead;

        previousAllowIn = state.allowIn;
        state.allowIn = true;
        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
        state.allowIn = previousAllowIn;

        for (;;) {
            if (match('.')) {
                property = parseNonComputedMember();
                expr = delegate.createMemberExpression('.', expr, property);
            } else if (match('(')) {
                args = parseArguments();
                expr = delegate.createCallExpression(expr, args);
            } else if (match('[')) {
                property = parseComputedMember();
                expr = delegate.createMemberExpression('[', expr, property);
            } else {
                break;
            }
            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    function parseLeftHandSideExpression() {
        var previousAllowIn, expr, property, startToken;

        startToken = lookahead;

        previousAllowIn = state.allowIn;
        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
        state.allowIn = previousAllowIn;

        while (match('.') || match('[')) {
            if (match('[')) {
                property = parseComputedMember();
                expr = delegate.createMemberExpression('[', expr, property);
            } else {
                property = parseNonComputedMember();
                expr = delegate.createMemberExpression('.', expr, property);
            }
            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    // 11.3 Postfix Expressions

    function parsePostfixExpression() {
        var expr, token, startToken = lookahead;

        expr = parseLeftHandSideExpressionAllowCall();

        if (lookahead.type === Token.Punctuator) {
            if ((match('++') || match('--')) && !peekLineTerminator()) {
                // 11.3.1, 11.3.2
                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                    throwErrorTolerant({}, Messages.StrictLHSPostfix);
                }

                if (!isLeftHandSide(expr)) {
                    throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
                }

                token = lex();
                expr = delegate.markEnd(delegate.createPostfixExpression(token.value, expr), startToken);
            }
        }

        return expr;
    }

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr, startToken;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('++') || match('--')) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            // 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwErrorTolerant({}, Messages.StrictLHSPrefix);
            }

            if (!isLeftHandSide(expr)) {
                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }

            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
        } else if (match('+') || match('-') || match('~') || match('!')) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                throwErrorTolerant({}, Messages.StrictDelete);
            }
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token, allowIn) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '|':
            prec = 3;
            break;

        case '^':
            prec = 4;
            break;

        case '&':
            prec = 5;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = allowIn ? 7 : 0;
            break;

        case '<<':
        case '>>':
        case '>>>':
            prec = 8;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // 11.5 Multiplicative Operators
    // 11.6 Additive Operators
    // 11.7 Bitwise Shift Operators
    // 11.8 Relational Operators
    // 11.9 Equality Operators
    // 11.10 Binary Bitwise Operators
    // 11.11 Binary Logical Operators

    function parseBinaryExpression() {
        var marker, markers, expr, token, prec, stack, right, operator, left, i;

        marker = lookahead;
        left = parseUnaryExpression();

        token = lookahead;
        prec = binaryPrecedence(token, state.allowIn);
        if (prec === 0) {
            return left;
        }
        token.prec = prec;
        lex();

        markers = [marker, lookahead];
        right = parseUnaryExpression();

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                expr = delegate.createBinaryExpression(operator, left, right);
                markers.pop();
                marker = markers[markers.length - 1];
                delegate.markEnd(expr, marker);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            markers.push(lookahead);
            expr = parseUnaryExpression();
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        markers.pop();
        while (i > 1) {
            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
            marker = markers.pop();
            delegate.markEnd(expr, marker);
        }

        return expr;
    }


    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent, alternate, startToken;

        startToken = lookahead;

        expr = parseBinaryExpression();

        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = parseAssignmentExpression();
            state.allowIn = previousAllowIn;
            expect(':');
            alternate = parseAssignmentExpression();

            expr = delegate.createConditionalExpression(expr, consequent, alternate);
            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    // 11.13 Assignment Operators

    function parseAssignmentExpression() {
        var token, left, right, node, startToken;

        token = lookahead;
        startToken = lookahead;

        node = left = parseConditionalExpression();

        if (matchAssign()) {
            // LeftHandSideExpression
            if (!isLeftHandSide(left)) {
                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }

            // 11.13.1
            if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
                throwErrorTolerant(token, Messages.StrictLHSAssignment);
            }

            token = lex();
            right = parseAssignmentExpression();
            node = delegate.markEnd(delegate.createAssignmentExpression(token.value, left, right), startToken);
        }

        return node;
    }

    // 11.14 Comma Operator

    function parseExpression() {
        var expr, startToken = lookahead;

        expr = parseAssignmentExpression();

        if (match(',')) {
            expr = delegate.createSequenceExpression([ expr ]);

            while (index < length) {
                if (!match(',')) {
                    break;
                }
                lex();
                expr.expressions.push(parseAssignmentExpression());
            }

            delegate.markEnd(expr, startToken);
        }

        return expr;
    }

    // 12.1 Block

    function parseStatementList() {
        var list = [],
            statement;

        while (index < length) {
            if (match('}')) {
                break;
            }
            statement = parseSourceElement();
            if (typeof statement === 'undefined') {
                break;
            }
            list.push(statement);
        }

        return list;
    }

    function parseBlock() {
        var block, startToken;

        startToken = lookahead;
        expect('{');

        block = parseStatementList();

        expect('}');

        return delegate.markEnd(delegate.createBlockStatement(block), startToken);
    }

    // 12.2 Variable Statement

    function parseVariableIdentifier() {
        var token, startToken;

        startToken = lookahead;
        token = lex();

        if (token.type !== Token.Identifier) {
            throwUnexpected(token);
        }

        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
    }

    function parseVariableDeclaration(kind) {
        var init = null, id, startToken;

        startToken = lookahead;
        id = parseVariableIdentifier();

        // 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            throwErrorTolerant({}, Messages.StrictVarName);
        }

        if (kind === 'const') {
            expect('=');
            init = parseAssignmentExpression();
        } else if (match('=')) {
            lex();
            init = parseAssignmentExpression();
        }

        return delegate.markEnd(delegate.createVariableDeclarator(id, init), startToken);
    }

    function parseVariableDeclarationList(kind) {
        var list = [];

        do {
            list.push(parseVariableDeclaration(kind));
            if (!match(',')) {
                break;
            }
            lex();
        } while (index < length);

        return list;
    }

    function parseVariableStatement() {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList();

        consumeSemicolon();

        return delegate.createVariableDeclaration(declarations, 'var');
    }

    // kind may be `const` or `let`
    // Both are experimental and not in the specification yet.
    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
    function parseConstLetDeclaration(kind) {
        var declarations, startToken;

        startToken = lookahead;

        expectKeyword(kind);

        declarations = parseVariableDeclarationList(kind);

        consumeSemicolon();

        return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind), startToken);
    }

    // 12.3 Empty Statement

    function parseEmptyStatement() {
        expect(';');
        return delegate.createEmptyStatement();
    }

    // 12.4 Expression Statement

    function parseExpressionStatement() {
        var expr = parseExpression();
        consumeSemicolon();
        return delegate.createExpressionStatement(expr);
    }

    // 12.5 If statement

    function parseIfStatement() {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
        } else {
            alternate = null;
        }

        return delegate.createIfStatement(test, consequent, alternate);
    }

    // 12.6 Iteration Statements

    function parseDoWhileStatement() {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
        }

        return delegate.createDoWhileStatement(body, test);
    }

    function parseWhileStatement() {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return delegate.createWhileStatement(test, body);
    }

    function parseForVariableDeclaration() {
        var token, declarations, startToken;

        startToken = lookahead;
        token = lex();
        declarations = parseVariableDeclarationList();

        return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value), startToken);
    }

    function parseForStatement() {
        var init, test, update, left, right, body, oldInIteration;

        init = test = update = null;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
        } else {
            if (matchKeyword('var') || matchKeyword('let')) {
                state.allowIn = false;
                init = parseForVariableDeclaration();
                state.allowIn = true;

                if (init.declarations.length === 1 && matchKeyword('in')) {
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                }
            } else {
                state.allowIn = false;
                init = parseExpression();
                state.allowIn = true;

                if (matchKeyword('in')) {
                    // LeftHandSideExpression
                    if (!isLeftHandSide(init)) {
                        throwErrorTolerant({}, Messages.InvalidLHSInForIn);
                    }

                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                }
            }

            if (typeof left === 'undefined') {
                expect(';');
            }
        }

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
            }
            expect(';');

            if (!match(')')) {
                update = parseExpression();
            }
        }

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return (typeof left === 'undefined') ?
                delegate.createForStatement(init, test, update, body) :
                delegate.createForInStatement(left, right, body);
    }

    // 12.7 The continue statement

    function parseContinueStatement() {
        var label = null, key;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source.charCodeAt(index) === 0x3B) {
            lex();

            if (!state.inIteration) {
                throwError({}, Messages.IllegalContinue);
            }

            return delegate.createContinueStatement(null);
        }

        if (peekLineTerminator()) {
            if (!state.inIteration) {
                throwError({}, Messages.IllegalContinue);
            }

            return delegate.createContinueStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError({}, Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError({}, Messages.IllegalContinue);
        }

        return delegate.createContinueStatement(label);
    }

    // 12.8 The break statement

    function parseBreakStatement() {
        var label = null, key;

        expectKeyword('break');

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(index) === 0x3B) {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError({}, Messages.IllegalBreak);
            }

            return delegate.createBreakStatement(null);
        }

        if (peekLineTerminator()) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError({}, Messages.IllegalBreak);
            }

            return delegate.createBreakStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError({}, Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError({}, Messages.IllegalBreak);
        }

        return delegate.createBreakStatement(label);
    }

    // 12.9 The return statement

    function parseReturnStatement() {
        var argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            throwErrorTolerant({}, Messages.IllegalReturn);
        }

        // 'return' followed by a space and an identifier is very common.
        if (source.charCodeAt(index) === 0x20) {
            if (isIdentifierStart(source.charCodeAt(index + 1))) {
                argument = parseExpression();
                consumeSemicolon();
                return delegate.createReturnStatement(argument);
            }
        }

        if (peekLineTerminator()) {
            return delegate.createReturnStatement(null);
        }

        if (!match(';')) {
            if (!match('}') && lookahead.type !== Token.EOF) {
                argument = parseExpression();
            }
        }

        consumeSemicolon();

        return delegate.createReturnStatement(argument);
    }

    // 12.10 The with statement

    function parseWithStatement() {
        var object, body;

        if (strict) {
            // TODO(ikarienator): Should we update the test cases instead?
            skipComment();
            throwErrorTolerant({}, Messages.StrictModeWith);
        }

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return delegate.createWithStatement(object, body);
    }

    // 12.10 The swith statement

    function parseSwitchCase() {
        var test, consequent = [], statement, startToken;

        startToken = lookahead;
        if (matchKeyword('default')) {
            lex();
            test = null;
        } else {
            expectKeyword('case');
            test = parseExpression();
        }
        expect(':');

        while (index < length) {
            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                break;
            }
            statement = parseStatement();
            consequent.push(statement);
        }

        return delegate.markEnd(delegate.createSwitchCase(test, consequent), startToken);
    }

    function parseSwitchStatement() {
        var discriminant, cases, clause, oldInSwitch, defaultFound;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        cases = [];

        if (match('}')) {
            lex();
            return delegate.createSwitchStatement(discriminant, cases);
        }

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;

        while (index < length) {
            if (match('}')) {
                break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
                if (defaultFound) {
                    throwError({}, Messages.MultipleDefaultsInSwitch);
                }
                defaultFound = true;
            }
            cases.push(clause);
        }

        state.inSwitch = oldInSwitch;

        expect('}');

        return delegate.createSwitchStatement(discriminant, cases);
    }

    // 12.13 The throw statement

    function parseThrowStatement() {
        var argument;

        expectKeyword('throw');

        if (peekLineTerminator()) {
            throwError({}, Messages.NewlineAfterThrow);
        }

        argument = parseExpression();

        consumeSemicolon();

        return delegate.createThrowStatement(argument);
    }

    // 12.14 The try statement

    function parseCatchClause() {
        var param, body, startToken;

        startToken = lookahead;
        expectKeyword('catch');

        expect('(');
        if (match(')')) {
            throwUnexpected(lookahead);
        }

        param = parseVariableIdentifier();
        // 12.14.1
        if (strict && isRestrictedWord(param.name)) {
            throwErrorTolerant({}, Messages.StrictCatchVariable);
        }

        expect(')');
        body = parseBlock();
        return delegate.markEnd(delegate.createCatchClause(param, body), startToken);
    }

    function parseTryStatement() {
        var block, handlers = [], finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handlers.push(parseCatchClause());
        }

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
        }

        if (handlers.length === 0 && !finalizer) {
            throwError({}, Messages.NoCatchOrFinally);
        }

        return delegate.createTryStatement(block, [], handlers, finalizer);
    }

    // 12.15 The debugger statement

    function parseDebuggerStatement() {
        expectKeyword('debugger');

        consumeSemicolon();

        return delegate.createDebuggerStatement();
    }

    // 12 Statements

    function parseStatement() {
        var type = lookahead.type,
            expr,
            labeledBody,
            key,
            startToken;

        if (type === Token.EOF) {
            throwUnexpected(lookahead);
        }

        if (type === Token.Punctuator && lookahead.value === '{') {
            return parseBlock();
        }

        startToken = lookahead;

        if (type === Token.Punctuator) {
            switch (lookahead.value) {
            case ';':
                return delegate.markEnd(parseEmptyStatement(), startToken);
            case '(':
                return delegate.markEnd(parseExpressionStatement(), startToken);
            default:
                break;
            }
        }

        if (type === Token.Keyword) {
            switch (lookahead.value) {
            case 'break':
                return delegate.markEnd(parseBreakStatement(), startToken);
            case 'continue':
                return delegate.markEnd(parseContinueStatement(), startToken);
            case 'debugger':
                return delegate.markEnd(parseDebuggerStatement(), startToken);
            case 'do':
                return delegate.markEnd(parseDoWhileStatement(), startToken);
            case 'for':
                return delegate.markEnd(parseForStatement(), startToken);
            case 'function':
                return delegate.markEnd(parseFunctionDeclaration(), startToken);
            case 'if':
                return delegate.markEnd(parseIfStatement(), startToken);
            case 'return':
                return delegate.markEnd(parseReturnStatement(), startToken);
            case 'switch':
                return delegate.markEnd(parseSwitchStatement(), startToken);
            case 'throw':
                return delegate.markEnd(parseThrowStatement(), startToken);
            case 'try':
                return delegate.markEnd(parseTryStatement(), startToken);
            case 'var':
                return delegate.markEnd(parseVariableStatement(), startToken);
            case 'while':
                return delegate.markEnd(parseWhileStatement(), startToken);
            case 'with':
                return delegate.markEnd(parseWithStatement(), startToken);
            default:
                break;
            }
        }

        expr = parseExpression();

        // 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            key = '$' + expr.name;
            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError({}, Messages.Redeclaration, 'Label', expr.name);
            }

            state.labelSet[key] = true;
            labeledBody = parseStatement();
            delete state.labelSet[key];
            return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody), startToken);
        }

        consumeSemicolon();

        return delegate.markEnd(delegate.createExpressionStatement(expr), startToken);
    }

    // 13 Function Definition

    function parseFunctionSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, startToken;

        startToken = lookahead;
        expect('{');

        while (index < length) {
            if (lookahead.type !== Token.StringLiteral) {
                break;
            }
            token = lookahead;

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;

        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;

        while (index < length) {
            if (match('}')) {
                break;
            }
            sourceElement = parseSourceElement();
            if (typeof sourceElement === 'undefined') {
                break;
            }
            sourceElements.push(sourceElement);
        }

        expect('}');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;

        return delegate.markEnd(delegate.createBlockStatement(sourceElements), startToken);
    }

    function parseParams(firstRestricted) {
        var param, params = [], token, stricted, paramSet, key, message;
        expect('(');

        if (!match(')')) {
            paramSet = {};
            while (index < length) {
                token = lookahead;
                param = parseVariableIdentifier();
                key = '$' + token.value;
                if (strict) {
                    if (isRestrictedWord(token.value)) {
                        stricted = token;
                        message = Messages.StrictParamName;
                    }
                    if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                        stricted = token;
                        message = Messages.StrictParamDupe;
                    }
                } else if (!firstRestricted) {
                    if (isRestrictedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamName;
                    } else if (isStrictModeReservedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictReservedWord;
                    } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                        firstRestricted = token;
                        message = Messages.StrictParamDupe;
                    }
                }
                params.push(param);
                paramSet[key] = true;
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return {
            params: params,
            stricted: stricted,
            firstRestricted: firstRestricted,
            message: message
        };
    }

    function parseFunctionDeclaration() {
        var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict, startToken;

        startToken = lookahead;

        expectKeyword('function');
        token = lookahead;
        id = parseVariableIdentifier();
        if (strict) {
            if (isRestrictedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictFunctionName);
            }
        } else {
            if (isRestrictedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictFunctionName;
            } else if (isStrictModeReservedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictReservedWord;
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
        }
        if (strict && stricted) {
            throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;

        return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body), startToken);
    }

    function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict, startToken;

        startToken = lookahead;
        expectKeyword('function');

        if (!match('(')) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    throwErrorTolerant(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
        }
        if (strict && stricted) {
            throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;

        return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body), startToken);
    }

    // 14 Program

    function parseSourceElement() {
        if (lookahead.type === Token.Keyword) {
            switch (lookahead.value) {
            case 'const':
            case 'let':
                return parseConstLetDeclaration(lookahead.value);
            case 'function':
                return parseFunctionDeclaration();
            default:
                return parseStatement();
            }
        }

        if (lookahead.type !== Token.EOF) {
            return parseStatement();
        }
    }

    function parseSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted;

        while (index < length) {
            token = lookahead;
            if (token.type !== Token.StringLiteral) {
                break;
            }

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        while (index < length) {
            sourceElement = parseSourceElement();
            /* istanbul ignore if */
            if (typeof sourceElement === 'undefined') {
                break;
            }
            sourceElements.push(sourceElement);
        }
        return sourceElements;
    }

    function parseProgram() {
        var body, startToken;

        skipComment();
        peek();
        startToken = lookahead;
        strict = false;

        body = parseSourceElements();
        return delegate.markEnd(delegate.createProgram(body), startToken);
    }

    function filterTokenLocation() {
        var i, entry, token, tokens = [];

        for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
                type: entry.type,
                value: entry.value
            };
            if (extra.range) {
                token.range = entry.range;
            }
            if (extra.loc) {
                token.loc = entry.loc;
            }
            tokens.push(token);
        }

        extra.tokens = tokens;
    }

    function tokenize(code, options) {
        var toString,
            token,
            tokens;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        delegate = SyntaxTreeDelegate;
        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1
        };

        extra = {};

        // Options matching.
        options = options || {};

        // Of course we collect tokens here.
        options.tokens = true;
        extra.tokens = [];
        extra.tokenize = true;
        // The following two fields are necessary to compute the Regex tokens.
        extra.openParenToken = -1;
        extra.openCurlyToken = -1;

        extra.range = (typeof options.range === 'boolean') && options.range;
        extra.loc = (typeof options.loc === 'boolean') && options.loc;

        if (typeof options.comment === 'boolean' && options.comment) {
            extra.comments = [];
        }
        if (typeof options.tolerant === 'boolean' && options.tolerant) {
            extra.errors = [];
        }

        try {
            peek();
            if (lookahead.type === Token.EOF) {
                return extra.tokens;
            }

            token = lex();
            while (lookahead.type !== Token.EOF) {
                try {
                    token = lex();
                } catch (lexError) {
                    token = lookahead;
                    if (extra.errors) {
                        extra.errors.push(lexError);
                        // We have to break on the first error
                        // to avoid infinite loops.
                        break;
                    } else {
                        throw lexError;
                    }
                }
            }

            filterTokenLocation();
            tokens = extra.tokens;
            if (typeof extra.comments !== 'undefined') {
                tokens.comments = extra.comments;
            }
            if (typeof extra.errors !== 'undefined') {
                tokens.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }
        return tokens;
    }

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        delegate = SyntaxTreeDelegate;
        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1
        };

        extra = {};
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

            if (extra.loc && options.source !== null && options.source !== undefined) {
                extra.source = toString(options.source);
            }

            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
            }
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
            }
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
            }
            if (extra.attachComment) {
                extra.range = true;
                extra.comments = [];
                extra.bottomRightStack = [];
                extra.trailingComments = [];
                extra.leadingComments = [];
            }
        }

        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                program.comments = extra.comments;
            }
            if (typeof extra.tokens !== 'undefined') {
                filterTokenLocation();
                program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }

        return program;
    }

    // Sync with *.json manifests.
    exports.version = '1.2.2';

    exports.tokenize = tokenize;

    exports.parse = parse;

    // Deep copy.
   /* istanbul ignore next */
    exports.Syntax = (function () {
        var name, types = {};

        if (typeof Object.create === 'function') {
            types = Object.create(null);
        }

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
            }
        }

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
        }

        return types;
    }());

}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],1:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"JSON_PATH":3,"DOLLAR":4,"PATH_COMPONENTS":5,"LEADING_CHILD_MEMBER_EXPRESSION":6,"PATH_COMPONENT":7,"MEMBER_COMPONENT":8,"SUBSCRIPT_COMPONENT":9,"CHILD_MEMBER_COMPONENT":10,"DESCENDANT_MEMBER_COMPONENT":11,"DOT":12,"MEMBER_EXPRESSION":13,"DOT_DOT":14,"STAR":15,"IDENTIFIER":16,"SCRIPT_EXPRESSION":17,"INTEGER":18,"END":19,"CHILD_SUBSCRIPT_COMPONENT":20,"DESCENDANT_SUBSCRIPT_COMPONENT":21,"[":22,"SUBSCRIPT":23,"]":24,"SUBSCRIPT_EXPRESSION":25,"SUBSCRIPT_EXPRESSION_LIST":26,"SUBSCRIPT_EXPRESSION_LISTABLE":27,",":28,"STRING_LITERAL":29,"ARRAY_SLICE":30,"FILTER_EXPRESSION":31,"QQ_STRING":32,"Q_STRING":33,"$accept":0,"$end":1},
terminals_: {2:"error",4:"DOLLAR",12:"DOT",14:"DOT_DOT",15:"STAR",16:"IDENTIFIER",17:"SCRIPT_EXPRESSION",18:"INTEGER",19:"END",22:"[",24:"]",28:",",30:"ARRAY_SLICE",31:"FILTER_EXPRESSION",32:"QQ_STRING",33:"Q_STRING"},
productions_: [0,[3,1],[3,2],[3,1],[3,2],[5,1],[5,2],[7,1],[7,1],[8,1],[8,1],[10,2],[6,1],[11,2],[13,1],[13,1],[13,1],[13,1],[13,1],[9,1],[9,1],[20,3],[21,4],[23,1],[23,1],[26,1],[26,3],[27,1],[27,1],[27,1],[25,1],[25,1],[25,1],[29,1],[29,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */
if (!yy.ast) {
    yy.ast = _ast;
    _ast.initialize();
}

var $0 = $$.length - 1;
switch (yystate) {
case 1:yy.ast.set({ expression: { type: "root", value: $$[$0] } }); yy.ast.unshift(); return yy.ast.yield()
break;
case 2:yy.ast.set({ expression: { type: "root", value: $$[$0-1] } }); yy.ast.unshift(); return yy.ast.yield()
break;
case 3:yy.ast.unshift(); return yy.ast.yield()
break;
case 4:yy.ast.set({ operation: "member", scope: "child", expression: { type: "identifier", value: $$[$0-1] }}); yy.ast.unshift(); return yy.ast.yield()
break;
case 5:
break;
case 6:
break;
case 7:yy.ast.set({ operation: "member" }); yy.ast.push()
break;
case 8:yy.ast.set({ operation: "subscript" }); yy.ast.push() 
break;
case 9:yy.ast.set({ scope: "child" })
break;
case 10:yy.ast.set({ scope: "descendant" })
break;
case 11:
break;
case 12:yy.ast.set({ scope: "child", operation: "member" })
break;
case 13:
break;
case 14:yy.ast.set({ expression: { type: "wildcard", value: $$[$0] } })
break;
case 15:yy.ast.set({ expression: { type: "identifier", value: $$[$0] } })
break;
case 16:yy.ast.set({ expression: { type: "script_expression", value: $$[$0] } })
break;
case 17:yy.ast.set({ expression: { type: "numeric_literal", value: parseInt($$[$0]) } })
break;
case 18:
break;
case 19:yy.ast.set({ scope: "child" })
break;
case 20:yy.ast.set({ scope: "descendant" })
break;
case 21:
break;
case 22:
break;
case 23:
break;
case 24:$$[$0].length > 1? yy.ast.set({ expression: { type: "union", value: $$[$0] } }) : this.$ = $$[$0]
break;
case 25:this.$ = [$$[$0]]
break;
case 26:this.$ = $$[$0-2].concat($$[$0])
break;
case 27:this.$ = { expression: { type: "numeric_literal", value: parseInt($$[$0]) } }; yy.ast.set(this.$)
break;
case 28:this.$ = { expression: { type: "string_literal", value: $$[$0] } }; yy.ast.set(this.$)
break;
case 29:this.$ = { expression: { type: "slice", value: $$[$0] } }; yy.ast.set(this.$)
break;
case 30:this.$ = { expression: { type: "wildcard", value: $$[$0] } }; yy.ast.set(this.$)
break;
case 31:this.$ = { expression: { type: "script_expression", value: $$[$0] } }; yy.ast.set(this.$)
break;
case 32:this.$ = { expression: { type: "filter_expression", value: $$[$0] } }; yy.ast.set(this.$)
break;
case 33:this.$ = $$[$0]
break;
case 34:this.$ = $$[$0]
break;
}
},
table: [{3:1,4:[1,2],6:3,13:4,15:[1,5],16:[1,6],17:[1,7],18:[1,8],19:[1,9]},{1:[3]},{1:[2,1],5:10,7:11,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,3],5:21,7:11,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,12],12:[2,12],14:[2,12],22:[2,12]},{1:[2,14],12:[2,14],14:[2,14],22:[2,14]},{1:[2,15],12:[2,15],14:[2,15],22:[2,15]},{1:[2,16],12:[2,16],14:[2,16],22:[2,16]},{1:[2,17],12:[2,17],14:[2,17],22:[2,17]},{1:[2,18],12:[2,18],14:[2,18],22:[2,18]},{1:[2,2],7:22,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,5],12:[2,5],14:[2,5],22:[2,5]},{1:[2,7],12:[2,7],14:[2,7],22:[2,7]},{1:[2,8],12:[2,8],14:[2,8],22:[2,8]},{1:[2,9],12:[2,9],14:[2,9],22:[2,9]},{1:[2,10],12:[2,10],14:[2,10],22:[2,10]},{1:[2,19],12:[2,19],14:[2,19],22:[2,19]},{1:[2,20],12:[2,20],14:[2,20],22:[2,20]},{13:23,15:[1,5],16:[1,6],17:[1,7],18:[1,8],19:[1,9]},{13:24,15:[1,5],16:[1,6],17:[1,7],18:[1,8],19:[1,9],22:[1,25]},{15:[1,29],17:[1,30],18:[1,33],23:26,25:27,26:28,27:32,29:34,30:[1,35],31:[1,31],32:[1,36],33:[1,37]},{1:[2,4],7:22,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,6],12:[2,6],14:[2,6],22:[2,6]},{1:[2,11],12:[2,11],14:[2,11],22:[2,11]},{1:[2,13],12:[2,13],14:[2,13],22:[2,13]},{15:[1,29],17:[1,30],18:[1,33],23:38,25:27,26:28,27:32,29:34,30:[1,35],31:[1,31],32:[1,36],33:[1,37]},{24:[1,39]},{24:[2,23]},{24:[2,24],28:[1,40]},{24:[2,30]},{24:[2,31]},{24:[2,32]},{24:[2,25],28:[2,25]},{24:[2,27],28:[2,27]},{24:[2,28],28:[2,28]},{24:[2,29],28:[2,29]},{24:[2,33],28:[2,33]},{24:[2,34],28:[2,34]},{24:[1,41]},{1:[2,21],12:[2,21],14:[2,21],22:[2,21]},{18:[1,33],27:42,29:34,30:[1,35],32:[1,36],33:[1,37]},{1:[2,22],12:[2,22],14:[2,22],22:[2,22]},{24:[2,26],28:[2,26]}],
defaultActions: {27:[2,23],29:[2,30],30:[2,31],31:[2,32]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
var _ast = {

  initialize: function() {
    this._nodes = [];
    this._node = {};
    this._stash = [];
  },

  set: function(props) {
    for (var k in props) this._node[k] = props[k];
    return this._node;
  },

  node: function(obj) {
    if (arguments.length) this._node = obj;
    return this._node;
  },

  push: function() {
    this._nodes.push(this._node);
    this._node = {};
  },

  unshift: function() {
    this._nodes.unshift(this._node);
    this._node = {};
  },

  yield: function() {
    var _nodes = this._nodes;
    this.initialize();
    return _nodes;
  }
};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 4
break;
case 1:return 14
break;
case 2:return 12
break;
case 3:return 15
break;
case 4:return 16
break;
case 5:return 22
break;
case 6:return 24
break;
case 7:return 28
break;
case 8:return 30
break;
case 9:return 18
break;
case 10:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 32;
break;
case 11:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 33;
break;
case 12:return 17
break;
case 13:return 31
break;
}
},
rules: [/^(?:\$)/,/^(?:\.\.)/,/^(?:\.)/,/^(?:\*)/,/^(?:[a-zA-Z_]+[a-zA-Z0-9_]*)/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?:((-?(?:0|[1-9][0-9]*)))?\:((-?(?:0|[1-9][0-9]*)))?(\:((-?(?:0|[1-9][0-9]*)))?)?)/,/^(?:(-?(?:0|[1-9][0-9]*)))/,/^(?:"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*")/,/^(?:'(?:\\['bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*')/,/^(?:\(.+?\)(?=\]))/,/^(?:\?\(.+?\)(?=\]))/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}

}).call(this,require('_process'))
},{"_process":14,"fs":12,"path":13}],2:[function(require,module,exports){
module.exports = {
  identifier: "[a-zA-Z_]+[a-zA-Z0-9_]*",
  integer: "-?(?:0|[1-9][0-9]*)",
  qq_string: "\"(?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*\"",
  q_string: "'(?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*'"
};

},{}],3:[function(require,module,exports){
var dict = require('./dict');
var fs = require('fs');
var grammar = {

    lex: {

        macros: {
            esc: "\\\\",
            int: dict.integer
        },

        rules: [
            ["\\$", "return 'DOLLAR'"],
            ["\\.\\.", "return 'DOT_DOT'"],
            ["\\.", "return 'DOT'"],
            ["\\*", "return 'STAR'"],
            [dict.identifier, "return 'IDENTIFIER'"],
            ["\\[", "return '['"],
            ["\\]", "return ']'"],
            [",", "return ','"],
            ["({int})?\\:({int})?(\\:({int})?)?", "return 'ARRAY_SLICE'"],
            ["{int}", "return 'INTEGER'"],
            [dict.qq_string, "yytext = yytext.substr(1,yyleng-2); return 'QQ_STRING';"],
            [dict.q_string, "yytext = yytext.substr(1,yyleng-2); return 'Q_STRING';"],
            ["\\(.+?\\)(?=\\])", "return 'SCRIPT_EXPRESSION'"],
            ["\\?\\(.+?\\)(?=\\])", "return 'FILTER_EXPRESSION'"]
        ]
    },

    start: "JSON_PATH",

    bnf: {

        JSON_PATH: [
                [ 'DOLLAR',                 'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()' ],
                [ 'DOLLAR PATH_COMPONENTS', 'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()' ],
                [ 'LEADING_CHILD_MEMBER_EXPRESSION',                 'yy.ast.unshift(); return yy.ast.yield()' ],
                [ 'LEADING_CHILD_MEMBER_EXPRESSION PATH_COMPONENTS', 'yy.ast.set({ operation: "member", scope: "child", expression: { type: "identifier", value: $1 }}); yy.ast.unshift(); return yy.ast.yield()' ] ],

        PATH_COMPONENTS: [
                [ 'PATH_COMPONENT',                 '' ],
                [ 'PATH_COMPONENTS PATH_COMPONENT', '' ] ],

        PATH_COMPONENT: [
                [ 'MEMBER_COMPONENT',    'yy.ast.set({ operation: "member" }); yy.ast.push()' ],
                [ 'SUBSCRIPT_COMPONENT', 'yy.ast.set({ operation: "subscript" }); yy.ast.push() ' ] ],

        MEMBER_COMPONENT: [
                [ 'CHILD_MEMBER_COMPONENT',      'yy.ast.set({ scope: "child" })' ],
                [ 'DESCENDANT_MEMBER_COMPONENT', 'yy.ast.set({ scope: "descendant" })' ] ],

        CHILD_MEMBER_COMPONENT: [
                [ 'DOT MEMBER_EXPRESSION', '' ] ],

        LEADING_CHILD_MEMBER_EXPRESSION: [
                [ 'MEMBER_EXPRESSION', 'yy.ast.set({ scope: "child", operation: "member" })' ] ],

        DESCENDANT_MEMBER_COMPONENT: [
                [ 'DOT_DOT MEMBER_EXPRESSION', '' ] ],

        MEMBER_EXPRESSION: [
                [ 'STAR',              'yy.ast.set({ expression: { type: "wildcard", value: $1 } })' ],
                [ 'IDENTIFIER',        'yy.ast.set({ expression: { type: "identifier", value: $1 } })' ],
                [ 'SCRIPT_EXPRESSION', 'yy.ast.set({ expression: { type: "script_expression", value: $1 } })' ],
                [ 'INTEGER',           'yy.ast.set({ expression: { type: "numeric_literal", value: parseInt($1) } })' ],
                [ 'END',               '' ] ],

        SUBSCRIPT_COMPONENT: [
                [ 'CHILD_SUBSCRIPT_COMPONENT',      'yy.ast.set({ scope: "child" })' ],
                [ 'DESCENDANT_SUBSCRIPT_COMPONENT', 'yy.ast.set({ scope: "descendant" })' ] ],

        CHILD_SUBSCRIPT_COMPONENT: [
                [ '[ SUBSCRIPT ]', '' ] ],

        DESCENDANT_SUBSCRIPT_COMPONENT: [
                [ 'DOT_DOT [ SUBSCRIPT ]', '' ] ],

        SUBSCRIPT: [
                [ 'SUBSCRIPT_EXPRESSION', '' ],
                [ 'SUBSCRIPT_EXPRESSION_LIST', '$1.length > 1? yy.ast.set({ expression: { type: "union", value: $1 } }) : $$ = $1' ] ],

        SUBSCRIPT_EXPRESSION_LIST: [
                [ 'SUBSCRIPT_EXPRESSION_LISTABLE', '$$ = [$1]'],
                [ 'SUBSCRIPT_EXPRESSION_LIST , SUBSCRIPT_EXPRESSION_LISTABLE', '$$ = $1.concat($3)' ] ],

        SUBSCRIPT_EXPRESSION_LISTABLE: [
                [ 'INTEGER',           '$$ = { expression: { type: "numeric_literal", value: parseInt($1) } }; yy.ast.set($$)' ],
                [ 'STRING_LITERAL',    '$$ = { expression: { type: "string_literal", value: $1 } }; yy.ast.set($$)' ],
                [ 'ARRAY_SLICE',       '$$ = { expression: { type: "slice", value: $1 } }; yy.ast.set($$)' ] ],

        SUBSCRIPT_EXPRESSION: [
                [ 'STAR',              '$$ = { expression: { type: "wildcard", value: $1 } }; yy.ast.set($$)' ],
                [ 'SCRIPT_EXPRESSION', '$$ = { expression: { type: "script_expression", value: $1 } }; yy.ast.set($$)' ],
                [ 'FILTER_EXPRESSION', '$$ = { expression: { type: "filter_expression", value: $1 } }; yy.ast.set($$)' ] ],

        STRING_LITERAL: [
                [ 'QQ_STRING', "$$ = $1" ],
                [ 'Q_STRING',  "$$ = $1" ] ]
    }
};
if (fs.readFileSync) {
  grammar.moduleInclude = fs.readFileSync(require.resolve("../include/module.js"));
  grammar.actionInclude = fs.readFileSync(require.resolve("../include/action.js"));
}

module.exports = grammar;

},{"./dict":2,"fs":12}],4:[function(require,module,exports){
var aesprim = require('./aesprim');
var slice = require('./slice');
var _evaluate = require('static-eval');
var _uniq = require('underscore').uniq;

var Handlers = function() {
  return this.initialize.apply(this, arguments);
}

Handlers.prototype.initialize = function() {
  this.traverse = traverser(true);
  this.descend = traverser();
}

Handlers.prototype.keys = Object.keys;

Handlers.prototype.resolve = function(component) {

  var key = [ component.operation, component.scope, component.expression.type ].join('-');
  var method = this._fns[key];

  if (!method) throw new Error("couldn't resolve key: " + key);
  return method.bind(this);
};

Handlers.prototype.register = function(key, handler) {

  if (!handler instanceof Function) {
    throw new Error("handler must be a function");
  }

  this._fns[key] = handler;
};

Handlers.prototype._fns = {

  'member-child-identifier': function(component, partial) {
    var key = component.expression.value;
    var value = partial.value;
    if (value instanceof Object && key in value) {
      return [ { value: value[key], path: partial.path.concat(key) } ]
    }
  },

  'member-descendant-identifier':
    _traverse(function(key, value, ref) { return key == ref }),

  'subscript-child-numeric_literal':
    _descend(function(key, value, ref) { return key === ref }),

  'member-child-numeric_literal':
    _descend(function(key, value, ref) { return String(key) === String(ref) }),

  'subscript-descendant-numeric_literal':
    _traverse(function(key, value, ref) { return key === ref }),

  'member-child-wildcard':
    _descend(function() { return true }),

  'member-descendant-wildcard':
    _traverse(function() { return true }),

  'subscript-descendant-wildcard':
    _traverse(function() { return true }),

  'subscript-child-wildcard':
    _descend(function() { return true }),

  'subscript-child-slice': function(component, partial) {
    if (is_array(partial.value)) {
      var args = component.expression.value.split(':').map(_parse_nullable_int);
      var values = partial.value.map(function(v, i) { return { value: v, path: partial.path.concat(i) } });
      return slice.apply(null, [values].concat(args));
    }
  },

  'subscript-child-union': function(component, partial) {
    var results = [];
    component.expression.value.forEach(function(component) {
      var _component = { operation: 'subscript', scope: 'child', expression: component.expression };
      var handler = this.resolve(_component);
      var _results = handler(_component, partial);
      if (_results) {
        results = results.concat(_results);
      }
    }, this);

    return unique(results);
  },

  'subscript-descendant-union': function(component, partial, count) {

    var jp = require('..');
    var self = this;

    var results = [];
    var nodes = jp.nodes(partial, '$..*').slice(1);

    nodes.forEach(function(node) {
      if (results.length >= count) return;
      component.expression.value.forEach(function(component) {
        var _component = { operation: 'subscript', scope: 'child', expression: component.expression };
        var handler = self.resolve(_component);
        var _results = handler(_component, node);
        results = results.concat(_results);
      });
    });

    return unique(results);
  },

  'subscript-child-filter_expression': function(component, partial, count) {

    // slice out the expression from ?(expression)
    var src = component.expression.value.slice(2, -1);
    var ast = aesprim.parse(src).body[0].expression;

    var passable = function(key, value) {
      return evaluate(ast, { '@': value });
    }

    return this.descend(partial, null, passable, count);

  },

  'subscript-descendant-filter_expression': function(component, partial, count) {

    // slice out the expression from ?(expression)
    var src = component.expression.value.slice(2, -1);
    var ast = aesprim.parse(src).body[0].expression;

    var passable = function(key, value) {
      return evaluate(ast, { '@': value });
    }

    return this.traverse(partial, null, passable, count);
  },

  'subscript-child-script_expression': function(component, partial) {
    var exp = component.expression.value.slice(1, -1);
    return eval_recurse(partial, exp, '$[{{value}}]');
  },

  'member-child-script_expression': function(component, partial) {
    var exp = component.expression.value.slice(1, -1);
    return eval_recurse(partial, exp, '$.{{value}}');
  },

  'member-descendant-script_expression': function(component, partial) {
    var exp = component.expression.value.slice(1, -1);
    return eval_recurse(partial, exp, '$..value');
  }
};

Handlers.prototype._fns['subscript-child-string_literal'] =
	Handlers.prototype._fns['member-child-identifier'];

Handlers.prototype._fns['member-descendant-numeric_literal'] =
    Handlers.prototype._fns['subscript-descendant-string_literal'] =
    Handlers.prototype._fns['member-descendant-identifier'];

function eval_recurse(partial, src, template) {

  var jp = require('./index');
  var ast = aesprim.parse(src).body[0].expression;
  var value = evaluate(ast, { '@': partial.value });
  var path = template.replace(/\{\{\s*value\s*\}\}/g, value);

  var results = jp.nodes(partial.value, path);
  results.forEach(function(r) {
    r.path = partial.path.concat(r.path.slice(1));
  });

  return results;
}

function is_array(val) {
  return Array.isArray(val);
}

function is_object(val) {
  // is this a non-array, non-null object?
  return val && !(val instanceof Array) && val instanceof Object;
}

function traverser(recurse) {

  return function(partial, ref, passable, count) {

    var value = partial.value;
    var path = partial.path;

    var results = [];

    var descend = function(value, path) {

      if (is_array(value)) {
        value.forEach(function(element, index) {
          if (results.length >= count) { return }
          if (passable(index, element, ref)) {
            results.push({ path: path.concat(index), value: element });
          }
        });
        value.forEach(function(element, index) {
          if (results.length >= count) { return }
          if (recurse) {
            descend(element, path.concat(index));
          }
        });
      } else if (is_object(value)) {
        this.keys(value).forEach(function(k) {
          if (results.length >= count) { return }
          if (passable(k, value[k], ref)) {
            results.push({ path: path.concat(k), value: value[k] });
          }
        })
        this.keys(value).forEach(function(k) {
          if (results.length >= count) { return }
          if (recurse) {
            descend(value[k], path.concat(k));
          }
        });
      }
    }.bind(this);
    descend(value, path);
    return results;
  }
}

function _descend(passable) {
  return function(component, partial, count) {
    return this.descend(partial, component.expression.value, passable, count);
  }
}

function _traverse(passable) {
  return function(component, partial, count) {
    return this.traverse(partial, component.expression.value, passable, count);
  }
}

function evaluate() {
  try { return _evaluate.apply(this, arguments) }
  catch (e) { }
}

function unique(results) {
  results = results.filter(function(d) { return d })
  return _uniq(
    results,
    function(r) { return r.path.map(function(c) { return String(c).replace('-', '--') }).join('-') }
  );
}

function _parse_nullable_int(val) {
  var sval = String(val);
  return sval.match(/^-?[0-9]+$/) ? parseInt(sval) : null;
}

module.exports = Handlers;

},{"..":"jsonpath","./aesprim":"./aesprim","./index":5,"./slice":7,"static-eval":15,"underscore":12}],5:[function(require,module,exports){
var assert = require('assert');
var dict = require('./dict');
var Parser = require('./parser');
var Handlers = require('./handlers');

var JSONPath = function() {
  this.initialize.apply(this, arguments);
};

JSONPath.prototype.initialize = function() {
  this.parser = new Parser();
  this.handlers = new Handlers();
};

JSONPath.prototype.parse = function(string) {
  assert.ok(_is_string(string), "we need a path");
  return this.parser.parse(string);
};

JSONPath.prototype.parent = function(obj, string) {

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(string, "we need a path");

  var node = this.nodes(obj, string)[0];
  var key = node.path.pop(); /* jshint unused:false */
  return this.value(obj, node.path);
}

JSONPath.prototype.apply = function(obj, string, fn) {

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(string, "we need a path");
  assert.equal(typeof fn, "function", "fn needs to be function")

  var nodes = this.nodes(obj, string).sort(function(a, b) {
    // sort nodes so we apply from the bottom up
    return b.path.length - a.path.length;
  });

  nodes.forEach(function(node) {
    var key = node.path.pop();
    var parent = this.value(obj, this.stringify(node.path));
    var val = node.value = fn.call(obj, parent[key]);
    parent[key] = val;
  }, this);

  return nodes;
}

JSONPath.prototype.value = function(obj, path, value) {

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(path, "we need a path");

  if (arguments.length >= 3) {
    var node = this.nodes(obj, path).shift();
    if (!node) return this._vivify(obj, path, value);
    var key = node.path.slice(-1).shift();
    var parent = this.parent(obj, this.stringify(node.path));
    parent[key] = value;
  }
  return this.query(obj, this.stringify(path), 1).shift();
}

JSONPath.prototype._vivify = function(obj, string, value) {

  var self = this;

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(string, "we need a path");

  var path = this.parser.parse(string)
    .map(function(component) { return component.expression.value });

  var setValue = function(path, value) {
    var key = path.pop();
    var node = self.value(obj, path);
    if (!node) {
      setValue(path.concat(), typeof key === 'string' ? {} : []);
      node = self.value(obj, path);
    }
    node[key] = value;
  }
  setValue(path, value);
  return this.query(obj, string)[0];
}

JSONPath.prototype.query = function(obj, string, count) {

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(_is_string(string), "we need a path");

  var results = this.nodes(obj, string, count)
    .map(function(r) { return r.value });

  return results;
};

JSONPath.prototype.paths = function(obj, string, count) {

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(string, "we need a path");

  var results = this.nodes(obj, string, count)
    .map(function(r) { return r.path });

  return results;
};

JSONPath.prototype.nodes = function(obj, string, count) {

  assert.ok(obj instanceof Object, "obj needs to be an object");
  assert.ok(string, "we need a path");

  if (count === 0) return [];

  var path = this.parser.parse(string);
  var handlers = this.handlers;

  var partials = [ { path: ['$'], value: obj } ];
  var matches = [];

  if (path.length && path[0].expression.type == 'root') path.shift();

  if (!path.length) return partials;

  path.forEach(function(component, index) {

    if (matches.length >= count) return;
    var handler = handlers.resolve(component);
    var _partials = [];

    partials.forEach(function(p) {

      if (matches.length >= count) return;
      var results = handler(component, p, count);

      if (index == path.length - 1) {
        // if we're through the components we're done
        matches = matches.concat(results || []);
      } else {
        // otherwise accumulate and carry on through
        _partials = _partials.concat(results || []);
      }
    });

    partials = _partials;

  });

  return count ? matches.slice(0, count) : matches;
};

JSONPath.prototype.stringify = function(path) {

  assert.ok(path, "we need a path");

  var string = '$';

  var templates = {
    'descendant-member': '..{{value}}',
    'child-member': '.{{value}}',
    'descendant-subscript': '..[{{value}}]',
    'child-subscript': '[{{value}}]'
  };

  path = this._normalize(path);

  path.forEach(function(component) {

    if (component.expression.type == 'root') return;

    var key = [component.scope, component.operation].join('-');
    var template = templates[key];
    var value;

    if (component.expression.type == 'string_literal') {
      value = JSON.stringify(component.expression.value)
    } else {
      value = component.expression.value;
    }

    if (!template) throw new Error("couldn't find template " + key);

    string += template.replace(/{{value}}/, value);
  });

  return string;
}

JSONPath.prototype._normalize = function(path) {

  assert.ok(path, "we need a path");

  if (typeof path == "string") {

    return this.parser.parse(path);

  } else if (Array.isArray(path) && typeof path[0] == "string") {

    var _path = [ { expression: { type: "root", value: "$" } } ];

    path.forEach(function(component, index) {

      if (component == '$' && index === 0) return;

      if (typeof component == "string" && component.match("^" + dict.identifier + "$")) {

        _path.push({
          operation: 'member',
          scope: 'child',
          expression: { value: component, type: 'identifier' }
        });

      } else {

        var type = typeof component == "number" ?
          'numeric_literal' : 'string_literal';

        _path.push({
          operation: 'subscript',
          scope: 'child',
          expression: { value: component, type: type }
        });
      }
    });

    return _path;

  } else if (Array.isArray(path) && typeof path[0] == "object") {

    return path
  }

  throw new Error("couldn't understand path " + path);
}

function _is_string(obj) {
  return Object.prototype.toString.call(obj) == '[object String]';
}

JSONPath.Handlers = Handlers;
JSONPath.Parser = Parser;

var instance = new JSONPath;
instance.JSONPath = JSONPath;

module.exports = instance;

},{"./dict":2,"./handlers":4,"./parser":6,"assert":8}],6:[function(require,module,exports){
var grammar = require('./grammar');
var gparser = require('../generated/parser');

var Parser = function() {

  var parser = new gparser.Parser();

  var _parseError = parser.parseError;
  parser.yy.parseError = function() {
    if (parser.yy.ast) {
      parser.yy.ast.initialize();
    }
    _parseError.apply(parser, arguments);
  }

  return parser;

};

Parser.grammar = grammar;
module.exports = Parser;

},{"../generated/parser":1,"./grammar":3}],7:[function(require,module,exports){
module.exports = function(arr, start, end, step) {

  if (typeof start == 'string') throw new Error("start cannot be a string");
  if (typeof end == 'string') throw new Error("end cannot be a string");
  if (typeof step == 'string') throw new Error("step cannot be a string");

  var len = arr.length;

  if (step === 0) throw new Error("step cannot be zero");
  step = step ? integer(step) : 1;

  // normalize negative values
  start = start < 0 ? len + start : start;
  end = end < 0 ? len + end : end;

  // default extents to extents
  start = integer(start === 0 ? 0 : !start ? (step > 0 ? 0 : len - 1) : start);
  end = integer(end === 0 ? 0 : !end ? (step > 0 ? len : -1) : end);

  // clamp extents
  start = step > 0 ? Math.max(0, start) : Math.min(len, start);
  end = step > 0 ? Math.min(end, len) : Math.max(-1, end);

  // return empty if extents are backwards
  if (step > 0 && end <= start) return [];
  if (step < 0 && start <= end) return [];

  var result = [];

  for (var i = start; i != end; i += step) {
    if ((step < 0 && i <= end) || (step > 0 && i >= end)) break;
    result.push(arr[i]);
  }

  return result;
}

function integer(val) {
  return String(val).match(/^[0-9]+$/) ? parseInt(val) :
    Number.isFinite(val) ? parseInt(val, 10) : 0;
}

},{}],8:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":11}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],11:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":10,"_process":14,"inherits":9}],12:[function(require,module,exports){

},{}],13:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr =  true
    ? function (str, start, len) { return str.substr(start, len) }
    : 0
;

}).call(this,require('_process'))
},{"_process":14}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
var unparse = require('escodegen').generate;

module.exports = function (ast, vars) {
    if (!vars) vars = {};
    var FAIL = {};
    
    var result = (function walk (node, scopeVars) {
        if (node.type === 'Literal') {
            return node.value;
        }
        else if (node.type === 'UnaryExpression'){
            var val = walk(node.argument)
            if (node.operator === '+') return +val
            if (node.operator === '-') return -val
            if (node.operator === '~') return ~val
            if (node.operator === '!') return !val
            return FAIL
        }
        else if (node.type === 'ArrayExpression') {
            var xs = [];
            for (var i = 0, l = node.elements.length; i < l; i++) {
                var x = walk(node.elements[i]);
                if (x === FAIL) return FAIL;
                xs.push(x);
            }
            return xs;
        }
        else if (node.type === 'ObjectExpression') {
            var obj = {};
            for (var i = 0; i < node.properties.length; i++) {
                var prop = node.properties[i];
                var value = prop.value === null
                    ? prop.value
                    : walk(prop.value)
                ;
                if (value === FAIL) return FAIL;
                obj[prop.key.value || prop.key.name] = value;
            }
            return obj;
        }
        else if (node.type === 'BinaryExpression' ||
                 node.type === 'LogicalExpression') {
            var l = walk(node.left);
            if (l === FAIL) return FAIL;
            var r = walk(node.right);
            if (r === FAIL) return FAIL;
            
            var op = node.operator;
            if (op === '==') return l == r;
            if (op === '===') return l === r;
            if (op === '!=') return l != r;
            if (op === '!==') return l !== r;
            if (op === '+') return l + r;
            if (op === '-') return l - r;
            if (op === '*') return l * r;
            if (op === '/') return l / r;
            if (op === '%') return l % r;
            if (op === '<') return l < r;
            if (op === '<=') return l <= r;
            if (op === '>') return l > r;
            if (op === '>=') return l >= r;
            if (op === '|') return l | r;
            if (op === '&') return l & r;
            if (op === '^') return l ^ r;
            if (op === '&&') return l && r;
            if (op === '||') return l || r;
            
            return FAIL;
        }
        else if (node.type === 'Identifier') {
            if ({}.hasOwnProperty.call(vars, node.name)) {
                return vars[node.name];
            }
            else return FAIL;
        }
        else if (node.type === 'ThisExpression') {
            if ({}.hasOwnProperty.call(vars, 'this')) {
                return vars['this'];
            }
            else return FAIL;
        }
        else if (node.type === 'CallExpression') {
            var callee = walk(node.callee);
            if (callee === FAIL) return FAIL;
            if (typeof callee !== 'function') return FAIL;
            
            var ctx = node.callee.object ? walk(node.callee.object) : FAIL;
            if (ctx === FAIL) ctx = null;

            var args = [];
            for (var i = 0, l = node.arguments.length; i < l; i++) {
                var x = walk(node.arguments[i]);
                if (x === FAIL) return FAIL;
                args.push(x);
            }
            return callee.apply(ctx, args);
        }
        else if (node.type === 'MemberExpression') {
            var obj = walk(node.object);
            // do not allow access to methods on Function 
            if((obj === FAIL) || (typeof obj == 'function')){
                return FAIL;
            }
            if (node.property.type === 'Identifier') {
                return obj[node.property.name];
            }
            var prop = walk(node.property);
            if (prop === FAIL) return FAIL;
            return obj[prop];
        }
        else if (node.type === 'ConditionalExpression') {
            var val = walk(node.test)
            if (val === FAIL) return FAIL;
            return val ? walk(node.consequent) : walk(node.alternate)
        }
        else if (node.type === 'ExpressionStatement') {
            var val = walk(node.expression)
            if (val === FAIL) return FAIL;
            return val;
        }
        else if (node.type === 'ReturnStatement') {
            return walk(node.argument)
        }
        else if (node.type === 'FunctionExpression') {
            
            var bodies = node.body.body;
            
            // Create a "scope" for our arguments
            var oldVars = {};
            Object.keys(vars).forEach(function(element){
                oldVars[element] = vars[element];
            })

            for(var i=0; i<node.params.length; i++){
                var key = node.params[i];
                if(key.type == 'Identifier'){
                  vars[key.name] = null;
                }
                else return FAIL;
            }
            for(var i in bodies){
                if(walk(bodies[i]) === FAIL){
                    return FAIL;
                }
            }
            // restore the vars and scope after we walk
            vars = oldVars;
            
            var keys = Object.keys(vars);
            var vals = keys.map(function(key) {
                return vars[key];
            });
            return Function(keys.join(', '), 'return ' + unparse(node)).apply(null, vals);
        }
        else if (node.type === 'TemplateLiteral') {
            var str = '';
            for (var i = 0; i < node.expressions.length; i++) {
                str += walk(node.quasis[i]);
                str += walk(node.expressions[i]);
            }
            str += walk(node.quasis[i]);
            return str;
        }
        else if (node.type === 'TaggedTemplateExpression') {
            var tag = walk(node.tag);
            var quasi = node.quasi;
            var strings = quasi.quasis.map(walk);
            var values = quasi.expressions.map(walk);
            return tag.apply(null, [strings].concat(values));
        }
        else if (node.type === 'TemplateElement') {
            return node.value.cooked;
        }
        else return FAIL;
    })(ast);
    
    return result === FAIL ? undefined : result;
};

},{"escodegen":12}],"jsonpath":[function(require,module,exports){
module.exports = require('./lib/index');

},{"./lib/index":5}]},{},["jsonpath"])("jsonpath")
});


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
exports.ApiException = exports.Errors2 = exports.Errors = exports.ValidationProblemDetailedInfo = exports.NotFoundProblemDetailedInfo = exports.ProblemDetailedInfo = exports.Currency = exports.ShippingRate = exports.ShippingRates = exports.ShippingType = exports.ClientErrorInfo = exports.LotState = exports.ManualCondition = exports.PurchaseInfo = exports.LotInfoShort = exports.LotInfo = exports.LotInfoWithProductId = exports.SearchQuery = exports.ProductWithId = exports.ProductWithoutId = exports.Client = void 0;
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
     * @return Ok
     */
    getProduct(id) {
        let url_ = this.baseUrl + "/products/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetProduct(_response);
        });
    }
    processGetProduct(response) {
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
                result200 = ProductWithId.fromJS(resultData200);
                return result200;
            });
        }
        else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400 = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = NotFoundProblemDetailedInfo.fromJS(resultData400);
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
     * @return Ok
     */
    getLots(productId) {
        let url_ = this.baseUrl + "/products/{productId}/lots/";
        if (productId === undefined || productId === null)
            throw new Error("The parameter 'productId' must be defined.");
        url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.http.fetch(url_, options_).then((_response) => {
            return this.processGetLots(_response);
        });
    }
    processGetLots(response) {
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
                        result200.push(LotInfoShort.fromJS(item));
                }
                else {
                    result200 = null;
                }
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
            this.titleChangeDate = _data["titleChangeDate"];
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
        data["titleChangeDate"] = this.titleChangeDate;
        if (Array.isArray(this.purchaseHistory)) {
            data["purchaseHistory"] = [];
            for (let item of this.purchaseHistory)
                data["purchaseHistory"].push(item.toJSON());
        }
        return data;
    }
}
exports.LotInfo = LotInfo;
class LotInfoShort {
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
            this.condition = _data["condition"];
            this.conditionDescription = _data["conditionDescription"];
            this.seller = _data["seller"];
            this.locatedIn = _data["locatedIn"];
            this.manualConditionId = _data["manualConditionId"];
            this.titleChangeDate = _data["titleChangeDate"];
            if (Array.isArray(_data["purchaseHistory"])) {
                this.purchaseHistory = [];
                for (let item of _data["purchaseHistory"])
                    this.purchaseHistory.push(PurchaseInfo.fromJS(item));
            }
        }
    }
    static fromJS(data) {
        data = typeof data === 'object' ? data : {};
        let result = new LotInfoShort();
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
        data["condition"] = this.condition;
        data["conditionDescription"] = this.conditionDescription;
        data["seller"] = this.seller;
        data["locatedIn"] = this.locatedIn;
        data["manualConditionId"] = this.manualConditionId;
        data["titleChangeDate"] = this.titleChangeDate;
        if (Array.isArray(this.purchaseHistory)) {
            data["purchaseHistory"] = [];
            for (let item of this.purchaseHistory)
                data["purchaseHistory"].push(item.toJSON());
        }
        return data;
    }
}
exports.LotInfoShort = LotInfoShort;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const EbayClient_1 = __webpack_require__(/*! ./EbayClient/EbayClient */ "./EbayClient/EbayClient.ts");
const jsonpath_1 = __importDefault(__webpack_require__(/*! jsonpath */ "./node_modules/jsonpath/jsonpath.js"));
const oauth2_client_1 = __webpack_require__(/*! @badgateway/oauth2-client */ "./node_modules/@badgateway/oauth2-client/browser/oauth2-client.min.js");
const FetchWrapperCustom_1 = __webpack_require__(/*! ./FetchWrapperCustom */ "./FetchWrapperCustom.ts");
const ignoreThatLotFieldName = "ignoreThatLot";
const manualConditionIdFieldName = "manualConditionId";
const productFieldName = "productId";
const pcsFieldName = "pcs";
const panelClass = "panel-div";
const formId = "product-form-id";
const errorElementId = "errorElement";
const submitId = "submitButton";
//const backendUrl = "https://localhost:7095/"
const backendUrl = "https://naks42.ru:17443/";
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/";
const notSetValue = "notSet";
const lightGreenColor = "#ecffec";
const lightPinkColor = "lightpink";
const lightYellowColor = "#e0e07f";
const supportedEuropeCountries = new Set([
    'Germany',
    'Italy',
    'France',
    'United Kingdom',
    'Bulgaria',
    'Lithuania',
    'Slovakia',
    'Latvia',
    'Romania',
    'Estonia',
    'Poland'
]);
const supportedShippingCountries = [
    'Germany',
    'Italy',
    'France',
    'United Kingdom',
    'Bulgaria',
    'Lithuania',
    'Slovakia',
    'Latvia',
    'Romania',
    'Estonia',
    'Poland',
    'United States',
    'Australia'
];
const supportedShippingCountriesDictionary = {
    "Germany": "DEU",
    "Italy": "ITA",
    "France": "FRA",
    "United Kingdom": "GBR",
    "United States": "USA",
    "Australia": "AUS",
    'Bulgaria': "BGR",
    'Lithuania': "LTU",
    'Slovakia': "SVK",
    'Latvia': "LVA",
    'Romania': "ROU",
    'Estonia': "EST",
    'Poland': "POL",
};
const zipCodes = {
    "United States": "40202",
    "Australia": "3000–3999"
};
const batchOpen = 5;
const searchQueryParam = 'searchQuery';
const ignoreThatLotDiv = "ignoreThatLotDiv";
const unsupportedLotDiv = "unsupportedLotDiv";
const lotInfo = new EbayClient_1.LotInfo();
let _serverLotInfo;
let _unsupportedLot = false;
let _knownLotsIds = [];
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
    let priceTrimmed = price.trim();
    let matches = priceTrimmed.match(/^(\D+)(\d+(?:[,.]\d+)?\s*)([(\/].+|$)/);
    if (matches) {
        return new Price(parseFloat(matches[2].replace(',', '.')), matches[1].trim());
    }
    else {
        let matches = priceTrimmed.match(/^(\d+(?:[,.]\d+)?)(\D+)([(\/].+|$)/);
        return new Price(parseFloat(matches[1].replace(',', '.')), matches[2].trim());
    }
}
class Price {
    constructor(price, currency) {
        this.currency = currency;
        this.price = price;
    }
}
function createPanel(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let bodyElement = yield sleepElementLoaded('body', document);
        let panel = bodyElement.querySelector('div.' + panelClass);
        if (panel !== null && panel !== undefined)
            return panel;
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
        <div id="${ignoreThatLotDiv}">
            <label for="${ignoreThatLotFieldName}">Игнорировать лот</label>
            <input id="${ignoreThatLotFieldName}" type="checkbox" name="${ignoreThatLotFieldName}"/>
            <br>
            <br>
        </div>
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
        <div id="${unsupportedLotDiv}" hidden="hidden">Лот не поддерживается, будет добавлен в игнор
        </div>
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
        return div;
    });
}
function createOpenMultipleButton() {
    return __awaiter(this, void 0, void 0, function* () {
        let bodyElement = yield sleepElementLoaded('body', document);
        let panel = bodyElement.querySelector('div.' + panelClass);
        if (panel !== null && panel !== undefined)
            return panel;
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
        <input id="${submitId}" type="submit" value="Окрыть ${batchOpen} лотов"/>
    `;
        form.addEventListener("submit", function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                event.preventDefault();
                let lastWindow;
                for (let x of _knownLotsIds.slice(0, batchOpen)) {
                    let url = "https://www.ebay.com/itm/" + x;
                    lastWindow = window.open(url, '_blank');
                    yield sleep(50);
                }
                lastWindow === null || lastWindow === void 0 ? void 0 : lastWindow.focus();
            });
        });
        div.appendChild(form);
        bodyElement.appendChild(div);
        return div;
    });
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
            if (_unsupportedLot) {
                ignoreThatLot = true;
            }
            lotInfo['ignoreThatLot'] = ignoreThatLot;
            if (ignoreThatLot) {
                if (!lotInfo.pcs) {
                    lotInfo.pcs = 1;
                }
                if (!lotInfo.manualConditionId) {
                    lotInfo.manualConditionId = notSetValue;
                }
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
    if (!matches) {
        matches = dateString.match(/([A-z]+\s\d+,\s\d+)\s(\d+):(\d+):(\d+)\s(PM|AM)\s([A-z]+)/);
    }
    if (!matches)
        throw new Error("Unable to parse time in " + dateString);
    let date = new Date(Date.parse(matches[1] + ' 00:00:00.000Z'));
    date.setUTCHours(parseInt(matches[2]));
    date.setUTCMinutes(parseInt(matches[3]));
    date.setUTCSeconds(parseInt(matches[4]));
    if (matches[5].toLowerCase() === "pm" && date.getUTCHours() !== 12) {
        date.setHours(date.getHours() + 12);
    }
    if (matches[5].toLowerCase() === "am" && date.getUTCHours() === 12) {
        date.setHours(date.getHours() - 12);
    }
    if (matches[6].toUpperCase() === "MSK") {
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
function getShipsTo(shippingDiv) {
    return new Set(shippingDiv.querySelector('div.ux-labels-values--shipsto').innerText.replace("Ships to:", "")
        .split(',').map(s => s.trim()));
}
function getExcludes(shippingDiv) {
    return new Set(shippingDiv.querySelector('div.ux-labels-values--excludes').innerText.replace("Excludes:", "")
        .split(',').map(s => s.trim()));
}
function showLotIsNotSupported() {
    return __awaiter(this, void 0, void 0, function* () {
        (yield sleepElementLoaded('div#' + ignoreThatLotDiv, document)).hidden = true;
        (yield sleepElementLoaded('div#' + unsupportedLotDiv, document)).hidden = false;
        _unsupportedLot = true;
    });
}
function fillShipping() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let shippingDiv = yield sleepElementLoaded('div.d-shipping-maxview', document);
        let shipsTo = getShipsTo(shippingDiv);
        let excludes = getExcludes(shippingDiv);
        let shippingFromCountry = lotInfo.locatedIn.split(',').pop().trim();
        let indexOfShippingFromCountries = supportedShippingCountries.indexOf(shippingFromCountry);
        if (indexOfShippingFromCountries >= 0) {
            supportedShippingCountries[indexOfShippingFromCountries] = supportedShippingCountries[0];
            supportedShippingCountries[0] = shippingFromCountry;
        }
        let shippingCountry;
        for (let i = 0; i < supportedShippingCountries.length; i++) {
            let currentShippingCountry = supportedShippingCountries[i];
            if (hasShippingToCountry(currentShippingCountry, shipsTo, excludes)) {
                shippingCountry = currentShippingCountry;
                break;
            }
        }
        if (shippingCountry === null) {
            throw new Error("shippingCountry is null");
        }
        let countryCode = supportedShippingCountriesDictionary[shippingCountry];
        let zipCode = (_a = zipCodes[shippingCountry]) !== null && _a !== void 0 ? _a : "";
        let shippingRatesUrl = "https://www.ebay.com/itemmodules/" + lotInfo.lotId +
            "?module_groups=GET_RATES_MODULE_GROUP&co=0&isGetRates=1&rt=nc&quantity=1&shipToCountryCode=" + countryCode
            + "&shippingZipCode=" + zipCode;
        let shippingInfoResponse = yield fetchResource(shippingRatesUrl, { method: 'GET', credentials: "include" });
        let text = yield shippingInfoResponse.text();
        let shippingJson = JSON.parse(text);
        //console.log(text)
        let jsonPathTablePrefix = "$.states[?(@.eventName=='ux-app__d-shipping-max-view__refreshState')].state.model.SHIPPING_SECTION_MODULE.sections.shippingTable.table";
        let jsonPathHeaderPrefix = jsonPathTablePrefix + ".header.cells";
        let jsonPathCellsPrefix = jsonPathTablePrefix + ".rows[0].cells";
        let headers = {};
        for (let i = 0; i <= 3; i++) {
            let jsonPathHeader = jsonPathHeaderPrefix + "[" + i + "].textSpans[0].text";
            let headerName = jsonpath_1.default.query(shippingJson, jsonPathHeader)[0].toString();
            headers[headerName] = i;
        }
        let shippingJsonPath = jsonPathCellsPrefix + "[0].textSpans[0].text";
        let shippingString = jsonpath_1.default.query(shippingJson, shippingJsonPath)[0].toString();
        if (shippingString === "Free shipping") {
            lotInfo.shipping = 0;
        }
        else {
            let shipping = extractPrice(shippingString);
            if (shipping.currency !== lotInfo.currency)
                throw new Error("shipping and lot currency mismatch, lotCurrency " + lotInfo.currency + ", shippingCurrency " + shipping.currency);
            lotInfo.shipping = shipping.price;
        }
        if (headers.hasOwnProperty("Each additional item")) {
            let shippingAdditionalJsonPath = jsonPathCellsPrefix + "[1].textSpans[0].text";
            let shippingAdditionalString = jsonpath_1.default.query(shippingJson, shippingAdditionalJsonPath)[0].toString();
            if (shippingAdditionalString === "Free") {
                lotInfo.shippingAdditional = 0;
            }
            else {
                let shippingAdditional = extractPrice(shippingAdditionalString);
                if (shippingAdditional.currency !== lotInfo.currency)
                    throw new Error("shipping additional and lot currency mismatch, lotCurrency " + lotInfo.currency + ", shippingAdditionalCurrency " + shippingAdditional.currency);
                lotInfo.shippingAdditional = shippingAdditional.price;
            }
        }
        else {
            lotInfo.shippingAdditional = 0;
        }
        let shippingToJsonPath = jsonPathCellsPrefix + "[" + headers["To"] + "].textSpans[0].text";
        let shippingTo = jsonpath_1.default.query(shippingJson, shippingToJsonPath)[0].toString();
        if (shippingTo !== shippingCountry)
            throw new Error("Shipping country expected to be " + shippingCountry + " but was " + shippingTo);
        lotInfo.shippingCountry = shippingCountry;
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
        if (!_unsupportedLot) {
            let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
            let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
            let response = yield fetchResource(purchaseHistoryUrl, { method: 'GET', credentials: 'include' });
            let text = yield response.text();
            lotInfo.purchaseHistory = parseSoldItemsPage(text);
        }
    });
}
function fillUpdateTitleDate() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_unsupportedLot) {
            let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
            let url = `https://${location.hostname}/rvh/${itemId}`;
            console.log(url);
            let response = yield fetchResource(url, { method: 'GET', credentials: 'include' });
            let text = yield response.text();
            lotInfo.titleChangeDate = parseRevisionSummary(text).toISOString();
        }
    });
}
function parseRevisionSummary(text) {
    console.log("parseRevisionSummary");
    let doc = new DOMParser().parseFromString(text, "text/html");
    let div = doc.querySelector('div#vi-revision-history-layout-container');
    let rows = [...div.querySelector('table').querySelectorAll('tr')];
    for (let row of rows.reverse()) {
        let columns = [...row.querySelectorAll('td')];
        if (columns.length === 0)
            continue;
        let changes = columns[2].innerText;
        if (changes.includes('Title')) {
            let date = columns[0].innerText;
            let time = columns[1].innerText;
            return parseDate(date + " " + time);
        }
    }
    return new Date(0);
}
function getSearchQuery() {
    var _a, _b, _c, _d, _e, _f;
    if (document.referrer) {
        return (_c = (_b = (_a = new URL(document.referrer).searchParams) === null || _a === void 0 ? void 0 : _a.get('_nkw')) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
    }
    return (_f = (_e = (_d = new URL(document.location.href).searchParams) === null || _d === void 0 ? void 0 : _d.get(searchQueryParam)) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.toLowerCase();
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
        serverLotInfoJson["seller"] = undefined;
        serverLotInfoJson["purchaseHistory"] = undefined;
        let lotInfoJson = lotInfo.toJSON();
        lotInfoJson["pcs"] = undefined;
        lotInfoJson["ignoreThatLot"] = undefined;
        lotInfoJson["manualConditionId"] = undefined;
        lotInfoJson["description"] = undefined;
        lotInfoJson["seller"] = undefined;
        lotInfoJson["purchaseHistory"] = undefined;
        let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson);
        let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson);
        let panel = yield sleepElementLoaded('div.' + panelClass, document);
        if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
            let serverMaxDate = getMax(serverLotInfoWithProductId.lotInfo.purchaseHistory.map(x => new Date(x.date).getTime()));
            let ebayMaxDate = getMax(lotInfo.purchaseHistory.map(x => {
                return new Date(x.date).getTime();
            }));
            if (_serverLotInfo.lotInfo.ignoreThatLot === true || ebayMaxDate === 0 || serverMaxDate === ebayMaxDate) {
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
function getMax(array) {
    let largest = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {
            largest = array[i];
        }
    }
    return largest;
}
function checkIfTypedLot() {
    return __awaiter(this, void 0, void 0, function* () {
        let mainContentDiv = yield sleepElementLoaded('div#mainContent', document);
        if (mainContentDiv.querySelector('div.x-msku__box-cont')) {
            yield showLotIsNotSupported();
        }
    });
}
function getDataFromPage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        fillId();
        yield Promise.all([
            fillPrice(),
            fillName(),
            fillSeller(),
            fillCondition(),
            fillConditionDescription(),
            fillLocatedIn(),
            fillDescription(),
            checkIfTypedLot(),
            getServerLotInfo(client)
        ]);
        let panel = yield createPanel(client);
        yield Promise.all([
            fillPurchaseHistory(),
            fillUpdateTitleDate(),
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
        let links = [];
        for (let li of [...searchResults.querySelectorAll('li')]) {
            if (li.classList.contains("srp-river-answer--REWRITE_START"))
                break;
            if (li.classList.contains("s-item")) {
                let link = li.querySelector('a.s-item__link');
                let soldDate = new Date(li.querySelector('span.POSITIVE').innerText.replace("Sold ", ""));
                links.push(new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate));
            }
        }
        let _ = updateStatusInfinite(client, links);
        yield createOpenMultipleButton();
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
                //console.log("UpdatingLotStates")
                let getLotStatesAnswer = yield client.getLotStates(ids);
                let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));
                let notKnownItems = [];
                links.forEach(function (x) {
                    let color = x.color;
                    if (knownLots.has(x.id)) {
                        let lotState = knownLots.get(x.id);
                        if (!lotState.ignoreThatLot) {
                            let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                            if (diffInDays > 0) {
                                x.color = lightYellowColor;
                                notKnownItems.push(x.id);
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
                        notKnownItems.push(x.id);
                    }
                    if (x.color !== null && color !== x.color) {
                        x.link.style.cssText = `background-color: ${x.color};`;
                    }
                });
                _knownLotsIds = notKnownItems;
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWJheS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxlQUFlLEtBQWlELG9CQUFvQixDQUF1SCxDQUFDLGlCQUFpQixPQUFPLGNBQWMsYUFBYSxzQ0FBc0MsU0FBUyw4Q0FBOEMsd0JBQXdCLGdCQUFnQiwrQkFBK0IsY0FBYywyR0FBMkcscUJBQXFCLGVBQWUsMEhBQTBILHNCQUFzQiwrR0FBK0csU0FBUyx5REFBeUQseUlBQXlJLDJCQUEyQixNQUFNLDJEQUEyRCxnS0FBZ0ssZUFBZSxJQUFJLFNBQVMsd0lBQXdJLDRHQUE0Ryx3RUFBd0Usa0JBQWtCLE1BQU0sU0FBUyxvRkFBb0Ysd0VBQXdFLHdCQUF3QixpREFBaUQsb0JBQW9CLFNBQVMsb0RBQW9ELCtDQUErQyxxQkFBcUIsNkVBQTZFLDhIQUE4SCxnRkFBZ0YsRUFBRSxtQkFBbUIsR0FBRywyRUFBMkUsVUFBVSx3RUFBd0UsNERBQTRELGlHQUFpRywwRUFBMEUsaUJBQWlCLE1BQU0sNkJBQTZCLE1BQU0sc0JBQXNCLElBQUksOENBQThDLFNBQVMsMElBQTBJLHFDQUFxQyxTQUFTLDJCQUEyQixFQUFFLGdCQUFnQiwrTUFBK00sbUNBQW1DLG1KQUFtSiwrQkFBK0IsMEZBQTBGLG1NQUFtTSxtQkFBbUIscUNBQXFDLG9EQUFvRCx5Q0FBeUMsdUZBQXVGLCtHQUErRyxNQUFNLHFJQUFxSSxNQUFNLG1IQUFtSCxxQ0FBcUMsa0NBQWtDLEVBQUUsOEJBQThCLFVBQVUsbWJBQW1iLDhCQUE4QixtQkFBbUIsTUFBTSxPQUFPLCtJQUErSSxJQUFJLHlCQUF5QixlQUFlLGFBQWEsc0NBQXNDLFNBQVMsbUZBQW1GLHdCQUF3QixvQkFBb0IsWUFBWSxvRkFBb0Ysb0NBQW9DLHNEQUFzRCxhQUFhLGtFQUFrRSw0REFBNEQsZUFBZSxvQ0FBb0MsY0FBYyxpQ0FBaUMsWUFBWSxXQUFXLDZCQUE2QixTQUFTLGNBQWMsK0dBQStHLHNDQUFzQyxlQUFlLGNBQWMseUJBQXlCLHlIQUF5SCxPQUFPLHNLQUFzSyxnRUFBZ0UsdUJBQXVCLGdLQUFnSyxlQUFlLElBQUksVUFBVSxxQ0FBcUMsb0NBQW9DLG9DQUFvQyxNQUFNLE9BQU8sZ0NBQWdDLGNBQWMsRUFBRSxzQkFBc0IsNkRBQTZELEVBQUUsNEJBQTRCLE1BQU0sZ0NBQWdDLCtIQUErSCw4RUFBOEUsRUFBRSxHQUFHLDZIQUE2SCxRQUFRLEdBQUcsT0FBTywwRUFBMEUsa0JBQWtCLFNBQVMscUdBQXFHLHVGQUF1Rix5Q0FBeUMsWUFBWSxNQUFNLDJCQUEyQixrQ0FBa0MsZUFBZSw0QkFBNEIsMEJBQTBCLG1DQUFtQyxHQUFHLElBQUksc0JBQXNCLGFBQWEsYUFBYSxzQ0FBc0MsU0FBUyx1QkFBdUIsc0JBQXNCLG1CQUFtQiw0Q0FBNEMsZ0JBQWdCLFlBQVksYUFBYSxzQ0FBc0MsU0FBUywyQ0FBMkMsZUFBZSx5T0FBeU8sbUVBQW1FLDRCQUE0QixpQkFBaUIseUJBQXlCLGtDQUFrQyxLQUFLLG9CQUFvQixvQ0FBb0MsZ0JBQWdCLDJDQUEyQyxpQkFBaUIsMEJBQTBCLGtDQUFrQyxnRkFBZ0YsVUFBVSxpQkFBaUIsaUhBQWlILHVCQUF1QiwyRUFBMkUscUJBQXFCLFFBQVEsZ0RBQWdELG1CQUFtQiw4QkFBOEIsUUFBUSxXQUFXLElBQUksK0VBQStFLFNBQVMsZ0ZBQWdGLCtDQUErQyxpRkFBaUYscUVBQXFFLFNBQVMsSUFBSSxJQUFJLGlDQUFpQyw2R0FBNkcsU0FBUyxzREFBc0QsUUFBUSx5QkFBeUIsa0JBQWtCLE1BQU0sd0NBQXdDLHdLQUF3Syx3Q0FBd0MsaURBQWlELElBQUksMEJBQTBCLFNBQVMseUZBQXlGLFlBQVksWUFBWSxNQUFNLGNBQWMsV0FBVywrQkFBK0IsWUFBWSxZQUFZLHFDQUFxQyxTQUFTLFlBQVksYUFBYSxRQUFRLHNDQUFzQyxTQUFTLDJHQUEyRyxhQUFhLHdDQUF3Qyw2QkFBNkIsdUJBQXVCLEVBQUUsYUFBYSx5REFBeUQsNkJBQTZCLHdDQUF3QyxrREFBa0QsNkJBQTZCLCtCQUErQixFQUFFLFlBQVksdUNBQXVDLDZCQUE2QixzQkFBc0IsRUFBRSxhQUFhLHVDQUF1Qyw2QkFBNkIsc0JBQXNCLEVBQUUsTUFBTTtBQUNuZ1c7Ozs7Ozs7Ozs7QUNEQTs7QUFFQSxhQUFhLEdBQUcsSUFBc0QsRUFBRSxtQkFBbUIsS0FBSyxVQUFpTyxDQUFDLGFBQWEsMEJBQTBCLDBCQUEwQixnQkFBZ0IsVUFBVSxVQUFVLE1BQU0sU0FBbUMsQ0FBQyxnQkFBZ0IsT0FBQyxPQUFPLG9CQUFvQiw4Q0FBOEMsa0NBQWtDLFlBQVksWUFBWSxtQ0FBbUMsaUJBQWlCLGdCQUFnQixzQkFBc0Isb0JBQW9CLE1BQU0sU0FBbUMsQ0FBQyxZQUFZLFdBQVcsWUFBWSxTQUFTLEdBQUc7QUFDNXlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOLGtDQUFrQztBQUNsQztBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QztBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdFQUFnRTs7QUFFaEU7O0FBRUEsaUJBQWlCOztBQUVqQix3QkFBd0I7QUFDeEI7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0Msc0JBQXNCO0FBQ3RCLDZDQUE2QztBQUM3QztBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLDZDQUE2QztBQUM3QyxzQkFBc0I7QUFDdEIsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQSx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQzs7QUFFQTtBQUNBLHFDQUFxQztBQUNyQzs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7O0FBRWpCOztBQUVBLGlCQUFpQjs7QUFFakI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7QUFFVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxvQkFBb0I7QUFDcEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxvQkFBb0I7QUFDcEI7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7O0FBRUEseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxvREFBb0Q7QUFDcEQ7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBOztBQUVBOztBQUVBO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlDQUFpQztBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUI7QUFDckIseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxpQkFBaUI7O0FBRWpCOztBQUVBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwrREFBK0Q7QUFDL0Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvQkFBb0IseUJBQXlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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OztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNENBQTRDLEtBQUs7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxvQ0FBb0MsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFVBQVU7QUFDVjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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QUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO29CQUM3RCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUNMLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLE1BQU0sa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUVMLENBQUM7Q0FBQTtBQS9CRCxrQkErQkM7QUFHRCxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztVQ2xtQ047VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1VFUEQ7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGJhZGdhdGV3YXkvb2F1dGgyLWNsaWVudC9icm93c2VyL29hdXRoMi1jbGllbnQubWluLmpzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9qc29ucGF0aC9qc29ucGF0aC5qcyIsIndlYnBhY2s6Ly9jaHJvbWVleHRlbnNpb24vLi9FYmF5Q2xpZW50L0ViYXlDbGllbnQudHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uLy4vRmV0Y2hXcmFwcGVyQ3VzdG9tLnRzIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi8uL21haW4udHMiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZWV4dGVuc2lvbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lZXh0ZW5zaW9uL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk9BdXRoMkNsaWVudD10KCk6ZS5PQXV0aDJDbGllbnQ9dCgpfShzZWxmLCgoKT0+KCgpPT57dmFyIGU9ezkzNDooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXQuT0F1dGgyQ2xpZW50PXZvaWQgMDtjb25zdCBuPXIoNDQzKSxpPXIoNjE4KTtmdW5jdGlvbiBvKGUsdCl7cmV0dXJuIG5ldyBVUkwoZSx0KS50b1N0cmluZygpfWZ1bmN0aW9uIHMoZSl7cmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGUpLmZpbHRlcigoKFtlLHRdKT0+dm9pZCAwIT09dCkpKSkudG9TdHJpbmcoKX10Lk9BdXRoMkNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmRpc2NvdmVyeURvbmU9ITEsdGhpcy5zZXJ2ZXJNZXRhZGF0YT1udWxsLChudWxsPT1lP3ZvaWQgMDplLmZldGNoKXx8KGUuZmV0Y2g9ZmV0Y2guYmluZChnbG9iYWxUaGlzKSksdGhpcy5zZXR0aW5ncz1lfWFzeW5jIHJlZnJlc2hUb2tlbihlKXtpZighZS5yZWZyZXNoVG9rZW4pdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0b2tlbiBkaWRuJ3QgaGF2ZSBhIHJlZnJlc2hUb2tlbi4gSXQncyBub3QgcG9zc2libGUgdG8gcmVmcmVzaCB0aGlzXCIpO2NvbnN0IHQ9e2dyYW50X3R5cGU6XCJyZWZyZXNoX3Rva2VuXCIscmVmcmVzaF90b2tlbjplLnJlZnJlc2hUb2tlbn07cmV0dXJuIHRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0fHwodC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCksdGhpcy50b2tlblJlc3BvbnNlVG9PQXV0aDJUb2tlbih0aGlzLnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfWFzeW5jIGNsaWVudENyZWRlbnRpYWxzKGUpe3ZhciB0O2NvbnN0IHI9W1wiY2xpZW50X2lkXCIsXCJjbGllbnRfc2VjcmV0XCIsXCJncmFudF90eXBlXCIsXCJzY29wZVwiXTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+ci5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7ci5qb2luKFwiJywgJ1wiKX0nYCk7Y29uc3Qgbj17Z3JhbnRfdHlwZTpcImNsaWVudF9jcmVkZW50aWFsc1wiLHNjb3BlOm51bGw9PT0odD1udWxsPT1lP3ZvaWQgMDplLnNjb3BlKXx8dm9pZCAwPT09dD92b2lkIDA6dC5qb2luKFwiIFwiKSwuLi5udWxsPT1lP3ZvaWQgMDplLmV4dHJhUGFyYW1zfTtpZighdGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQpdGhyb3cgbmV3IEVycm9yKFwiQSBjbGllbnRTZWNyZXQgbXVzdCBiZSBwcm92aWRlZCB0byB1c2UgY2xpZW50X2NyZWRlbnRpYWxzXCIpO3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixuKSl9YXN5bmMgcGFzc3dvcmQoZSl7dmFyIHQ7Y29uc3Qgcj17Z3JhbnRfdHlwZTpcInBhc3N3b3JkXCIsLi4uZSxzY29wZTpudWxsPT09KHQ9ZS5zY29wZSl8fHZvaWQgMD09PXQ/dm9pZCAwOnQuam9pbihcIiBcIil9O3JldHVybiB0aGlzLnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMucmVxdWVzdChcInRva2VuRW5kcG9pbnRcIixyKSl9Z2V0IGF1dGhvcml6YXRpb25Db2RlKCl7cmV0dXJuIG5ldyBpLk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50KHRoaXMpfWFzeW5jIGludHJvc3BlY3QoZSl7Y29uc3QgdD17dG9rZW46ZS5hY2Nlc3NUb2tlbix0b2tlbl90eXBlX2hpbnQ6XCJhY2Nlc3NfdG9rZW5cIn07cmV0dXJuIHRoaXMucmVxdWVzdChcImludHJvc3BlY3Rpb25FbmRwb2ludFwiLHQpfWFzeW5jIGdldEVuZHBvaW50KGUpe2lmKHZvaWQgMCE9PXRoaXMuc2V0dGluZ3NbZV0pcmV0dXJuIG8odGhpcy5zZXR0aW5nc1tlXSx0aGlzLnNldHRpbmdzLnNlcnZlcik7aWYoXCJkaXNjb3ZlcnlFbmRwb2ludFwiIT09ZSYmKGF3YWl0IHRoaXMuZGlzY292ZXIoKSx2b2lkIDAhPT10aGlzLnNldHRpbmdzW2VdKSlyZXR1cm4gbyh0aGlzLnNldHRpbmdzW2VdLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtpZighdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiAke2V9LiBFaXRoZXIgc3BlY2lmeSAke2V9IGluIHRoZSBzZXR0aW5ncywgb3IgdGhlIFwic2VydmVyXCIgZW5kcG9pbnQgdG8gbGV0IHRoZSBjbGllbnQgZGlzY292ZXIgaXQuYCk7c3dpdGNoKGUpe2Nhc2VcImF1dGhvcml6YXRpb25FbmRwb2ludFwiOnJldHVybiBvKFwiL2F1dGhvcml6ZVwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJ0b2tlbkVuZHBvaW50XCI6cmV0dXJuIG8oXCIvdG9rZW5cIix0aGlzLnNldHRpbmdzLnNlcnZlcik7Y2FzZVwiZGlzY292ZXJ5RW5kcG9pbnRcIjpyZXR1cm4gbyhcIi8ud2VsbC1rbm93bi9vYXV0aC1hdXRob3JpemF0aW9uLXNlcnZlclwiLHRoaXMuc2V0dGluZ3Muc2VydmVyKTtjYXNlXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIjpyZXR1cm4gbyhcIi9pbnRyb3NwZWN0XCIsdGhpcy5zZXR0aW5ncy5zZXJ2ZXIpfX1hc3luYyBkaXNjb3Zlcigpe3ZhciBlO2lmKHRoaXMuZGlzY292ZXJ5RG9uZSlyZXR1cm47bGV0IHQ7dGhpcy5kaXNjb3ZlcnlEb25lPSEwO3RyeXt0PWF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoXCJkaXNjb3ZlcnlFbmRwb2ludFwiKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIE9BdXRoMiBkaXNjb3ZlcnkgZW5kcG9pbnQgY291bGQgbm90IGJlIGRldGVybWluZWQuIEVpdGhlciBzcGVjaWZ5IHRoZSBcInNlcnZlclwiIG9yIFwiZGlzY292ZXJ5RW5kcG9pbnQnKX1jb25zdCByPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2godCx7aGVhZGVyczp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvblwifX0pO2lmKCFyLm9rKXJldHVybjtpZighKG51bGw9PT0oZT1yLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSkpcmV0dXJuIHZvaWQgY29uc29sZS53YXJuKFwiW29hdXRoMl0gT0F1dGgyIGRpc2NvdmVyeSBlbmRwb2ludCB3YXMgbm90IGEgSlNPTiByZXNwb25zZS4gUmVzcG9uc2UgaXMgaWdub3JlZFwiKTt0aGlzLnNlcnZlck1ldGFkYXRhPWF3YWl0IHIuanNvbigpO2NvbnN0IG49W1tcImF1dGhvcml6YXRpb25fZW5kcG9pbnRcIixcImF1dGhvcml6YXRpb25FbmRwb2ludFwiXSxbXCJ0b2tlbl9lbmRwb2ludFwiLFwidG9rZW5FbmRwb2ludFwiXSxbXCJpbnRyb3NwZWN0aW9uX2VuZHBvaW50XCIsXCJpbnRyb3NwZWN0aW9uRW5kcG9pbnRcIl1dO2lmKG51bGwhPT10aGlzLnNlcnZlck1ldGFkYXRhKXtmb3IoY29uc3RbZSxyXW9mIG4pdGhpcy5zZXJ2ZXJNZXRhZGF0YVtlXSYmKHRoaXMuc2V0dGluZ3Nbcl09byh0aGlzLnNlcnZlck1ldGFkYXRhW2VdLHQpKTt0aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWQmJiF0aGlzLnNldHRpbmdzLmF1dGhlbnRpY2F0aW9uTWV0aG9kJiYodGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZD10aGlzLnNlcnZlck1ldGFkYXRhLnRva2VuX2VuZHBvaW50X2F1dGhfbWV0aG9kc19zdXBwb3J0ZWRbMF0pfX1hc3luYyByZXF1ZXN0KGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmdldEVuZHBvaW50KGUpLGk9e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIn07bGV0IG89dGhpcy5zZXR0aW5ncy5hdXRoZW50aWNhdGlvbk1ldGhvZDtzd2l0Y2gob3x8KG89dGhpcy5zZXR0aW5ncy5jbGllbnRTZWNyZXQ/XCJjbGllbnRfc2VjcmV0X2Jhc2ljXCI6XCJjbGllbnRfc2VjcmV0X3Bvc3RcIiksbyl7Y2FzZVwiY2xpZW50X3NlY3JldF9iYXNpY1wiOmkuQXV0aG9yaXphdGlvbj1cIkJhc2ljIFwiK2J0b2EodGhpcy5zZXR0aW5ncy5jbGllbnRJZCtcIjpcIit0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7Y2FzZVwiY2xpZW50X3NlY3JldF9wb3N0XCI6dC5jbGllbnRfaWQ9dGhpcy5zZXR0aW5ncy5jbGllbnRJZCx0aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCYmKHQuY2xpZW50X3NlY3JldD10aGlzLnNldHRpbmdzLmNsaWVudFNlY3JldCk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBtZXRob2Qgbm90IHlldCBzdXBwb3J0ZWQ6XCIrbytcIi4gT3BlbiBhIGZlYXR1cmUgcmVxdWVzdCBpZiB5b3Ugd2FudCB0aGlzIVwiKX1jb25zdCBhPWF3YWl0IHRoaXMuc2V0dGluZ3MuZmV0Y2gocix7bWV0aG9kOlwiUE9TVFwiLGJvZHk6cyh0KSxoZWFkZXJzOml9KTtpZihhLm9rKXJldHVybiBhd2FpdCBhLmpzb24oKTtsZXQgYyxoLHU7dGhyb3cgYS5oZWFkZXJzLmhhcyhcIkNvbnRlbnQtVHlwZVwiKSYmYS5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKS5zdGFydHNXaXRoKFwiYXBwbGljYXRpb24vanNvblwiKSYmKGM9YXdhaXQgYS5qc29uKCkpLChudWxsPT1jP3ZvaWQgMDpjLmVycm9yKT8oaD1cIk9BdXRoMiBlcnJvciBcIitjLmVycm9yK1wiLlwiLGMuZXJyb3JfZGVzY3JpcHRpb24mJihoKz1cIiBcIitjLmVycm9yX2Rlc2NyaXB0aW9uKSx1PWMuZXJyb3IpOihoPVwiSFRUUCBFcnJvciBcIithLnN0YXR1cytcIiBcIithLnN0YXR1c1RleHQsNDAxPT09YS5zdGF0dXMmJnRoaXMuc2V0dGluZ3MuY2xpZW50U2VjcmV0JiYoaCs9XCIuIEl0J3MgbGlrZWx5IHRoYXQgdGhlIGNsaWVudElkIGFuZC9vciBjbGllbnRTZWNyZXQgd2FzIGluY29ycmVjdFwiKSx1PW51bGwpLG5ldyBuLk9BdXRoMkVycm9yKGgsdSxhLnN0YXR1cyl9dG9rZW5SZXNwb25zZVRvT0F1dGgyVG9rZW4oZSl7cmV0dXJuIGUudGhlbigoZT0+e3ZhciB0O3JldHVybnthY2Nlc3NUb2tlbjplLmFjY2Vzc190b2tlbixleHBpcmVzQXQ6ZS5leHBpcmVzX2luP0RhdGUubm93KCkrMWUzKmUuZXhwaXJlc19pbjpudWxsLHJlZnJlc2hUb2tlbjpudWxsIT09KHQ9ZS5yZWZyZXNoX3Rva2VuKSYmdm9pZCAwIT09dD90Om51bGx9fSkpfX0sdC5nZW5lcmF0ZVF1ZXJ5U3RyaW5nPXN9LDYxODooZSx0LHIpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5nZXRDb2RlQ2hhbGxlbmdlPXQuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD12b2lkIDA7Y29uc3Qgbj1yKDkzNCksaT1yKDQ0Myk7YXN5bmMgZnVuY3Rpb24gbyhlKXtjb25zdCB0PXMoKTtpZihudWxsPT10P3ZvaWQgMDp0LnN1YnRsZSlyZXR1cm5bXCJTMjU2XCIsYyhhd2FpdCB0LnN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsYShlKSkpXTt7Y29uc3QgdD1yKDIxMikuY3JlYXRlSGFzaChcInNoYTI1NlwiKTtyZXR1cm4gdC51cGRhdGUoYShlKSksW1wiUzI1NlwiLHQuZGlnZXN0KFwiYmFzZTY0dXJsXCIpXX19ZnVuY3Rpb24gcygpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jcnlwdG8pcmV0dXJuIHdpbmRvdy5jcnlwdG87aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJnNlbGYuY3J5cHRvKXJldHVybiBzZWxmLmNyeXB0bztjb25zdCBlPXIoMjEyKTtyZXR1cm4gZS53ZWJjcnlwdG8/ZS53ZWJjcnlwdG86bnVsbH1mdW5jdGlvbiBhKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09MjU1JmUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH1mdW5jdGlvbiBjKGUpe3JldHVybiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkoZSkpKS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoLz0rJC8sXCJcIil9dC5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1jbGFzc3tjb25zdHJ1Y3RvcihlKXt0aGlzLmNsaWVudD1lfWFzeW5jIGdldEF1dGhvcml6ZVVyaShlKXtjb25zdFt0LHJdPWF3YWl0IFByb21pc2UuYWxsKFtlLmNvZGVWZXJpZmllcj9vKGUuY29kZVZlcmlmaWVyKTp2b2lkIDAsdGhpcy5jbGllbnQuZ2V0RW5kcG9pbnQoXCJhdXRob3JpemF0aW9uRW5kcG9pbnRcIildKTtsZXQgaT17Y2xpZW50X2lkOnRoaXMuY2xpZW50LnNldHRpbmdzLmNsaWVudElkLHJlc3BvbnNlX3R5cGU6XCJjb2RlXCIscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV9jaGFsbGVuZ2VfbWV0aG9kOm51bGw9PXQ/dm9pZCAwOnRbMF0sY29kZV9jaGFsbGVuZ2U6bnVsbD09dD92b2lkIDA6dFsxXX07ZS5zdGF0ZSYmKGkuc3RhdGU9ZS5zdGF0ZSksZS5zY29wZSYmKGkuc2NvcGU9ZS5zY29wZS5qb2luKFwiIFwiKSk7Y29uc3Qgcz1PYmplY3Qua2V5cyhpKTtpZigobnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtcykmJk9iamVjdC5rZXlzKGUuZXh0cmFQYXJhbXMpLmZpbHRlcigoZT0+cy5pbmNsdWRlcyhlKSkpLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBleHRyYVBhcmFtcyBhcmUgZGlzYWxsb3dlZDogJyR7cy5qb2luKFwiJywgJ1wiKX0nYCk7cmV0dXJuIGk9ey4uLmksLi4ubnVsbD09ZT92b2lkIDA6ZS5leHRyYVBhcmFtc30scitcIj9cIisoMCxuLmdlbmVyYXRlUXVlcnlTdHJpbmcpKGkpfWFzeW5jIGdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChlLHQpe2NvbnN0e2NvZGU6cn09YXdhaXQgdGhpcy52YWxpZGF0ZVJlc3BvbnNlKGUse3N0YXRlOnQuc3RhdGV9KTtyZXR1cm4gdGhpcy5nZXRUb2tlbih7Y29kZTpyLHJlZGlyZWN0VXJpOnQucmVkaXJlY3RVcmksY29kZVZlcmlmaWVyOnQuY29kZVZlcmlmaWVyfSl9YXN5bmMgdmFsaWRhdGVSZXNwb25zZShlLHQpe3ZhciByO2NvbnN0IG49bmV3IFVSTChlKS5zZWFyY2hQYXJhbXM7aWYobi5oYXMoXCJlcnJvclwiKSl0aHJvdyBuZXcgaS5PQXV0aDJFcnJvcihudWxsIT09KHI9bi5nZXQoXCJlcnJvcl9kZXNjcmlwdGlvblwiKSkmJnZvaWQgMCE9PXI/cjpcIk9BdXRoMiBlcnJvclwiLG4uZ2V0KFwiZXJyb3JcIiksMCk7aWYoIW4uaGFzKFwiY29kZVwiKSl0aHJvdyBuZXcgRXJyb3IoYFRoZSB1cmwgZGlkIG5vdCBjb250YWluIGEgY29kZSBwYXJhbWV0ZXIgJHtlfWApO2lmKHQuc3RhdGUmJnQuc3RhdGUhPT1uLmdldChcInN0YXRlXCIpKXRocm93IG5ldyBFcnJvcihgVGhlIFwic3RhdGVcIiBwYXJhbWV0ZXIgaW4gdGhlIHVybCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCB2YWx1ZSBvZiAke3Quc3RhdGV9YCk7cmV0dXJue2NvZGU6bi5nZXQoXCJjb2RlXCIpLHNjb3BlOm4uaGFzKFwic2NvcGVcIik/bi5nZXQoXCJzY29wZVwiKS5zcGxpdChcIiBcIik6dm9pZCAwfX1hc3luYyBnZXRUb2tlbihlKXtjb25zdCB0PXtncmFudF90eXBlOlwiYXV0aG9yaXphdGlvbl9jb2RlXCIsY29kZTplLmNvZGUscmVkaXJlY3RfdXJpOmUucmVkaXJlY3RVcmksY29kZV92ZXJpZmllcjplLmNvZGVWZXJpZmllcn07cmV0dXJuIHRoaXMuY2xpZW50LnRva2VuUmVzcG9uc2VUb09BdXRoMlRva2VuKHRoaXMuY2xpZW50LnJlcXVlc3QoXCJ0b2tlbkVuZHBvaW50XCIsdCkpfX0sdC5nZW5lcmF0ZUNvZGVWZXJpZmllcj1hc3luYyBmdW5jdGlvbigpe2NvbnN0IGU9cygpO2lmKGUpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoMzIpO3JldHVybiBlLmdldFJhbmRvbVZhbHVlcyh0KSxjKHQpfXtjb25zdCBlPXIoMjEyKTtyZXR1cm4gbmV3IFByb21pc2UoKCh0LHIpPT57ZS5yYW5kb21CeXRlcygzMiwoKGUsbik9PntlJiZyKGUpLHQobi50b1N0cmluZyhcImJhc2U2NHVybFwiKSl9KSl9KSl9fSx0LmdldENvZGVDaGFsbGVuZ2U9b30sNDQzOihlLHQpPT57XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5PQXV0aDJFcnJvcj12b2lkIDA7Y2xhc3MgciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKGUsdCxyKXtzdXBlcihlKSx0aGlzLm9hdXRoMkNvZGU9dCx0aGlzLmh0dHBDb2RlPXJ9fXQuT0F1dGgyRXJyb3I9cn0sMTM6KGUsdCk9PntcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0Lk9BdXRoMkZldGNoPXZvaWQgMCx0Lk9BdXRoMkZldGNoPWNsYXNze2NvbnN0cnVjdG9yKGUpe3RoaXMudG9rZW49bnVsbCx0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPW51bGwsdGhpcy5hY3RpdmVSZWZyZXNoPW51bGwsdGhpcy5yZWZyZXNoVGltZXI9bnVsbCx2b2lkIDA9PT0obnVsbD09ZT92b2lkIDA6ZS5zY2hlZHVsZVJlZnJlc2gpJiYoZS5zY2hlZHVsZVJlZnJlc2g9ITApLHRoaXMub3B0aW9ucz1lLGUuZ2V0U3RvcmVkVG9rZW4mJih0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuPShhc3luYygpPT57dGhpcy50b2tlbj1hd2FpdCBlLmdldFN0b3JlZFRva2VuKCksdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbj1udWxsfSkoKSksdGhpcy5zY2hlZHVsZVJlZnJlc2goKX1hc3luYyBmZXRjaChlLHQpe2NvbnN0IHI9bmV3IFJlcXVlc3QoZSx0KTtyZXR1cm4gdGhpcy5tdygpKHIsKGU9PmZldGNoKGUpKSl9bXcoKXtyZXR1cm4gYXN5bmMoZSx0KT0+e2NvbnN0IHI9YXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO2xldCBuPWUuY2xvbmUoKTtuLmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLFwiQmVhcmVyIFwiK3IpO2xldCBpPWF3YWl0IHQobik7aWYoIWkub2smJjQwMT09PWkuc3RhdHVzKXtjb25zdCByPWF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7bj1lLmNsb25lKCksbi5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIixcIkJlYXJlciBcIityLmFjY2Vzc1Rva2VuKSxpPWF3YWl0IHQobil9cmV0dXJuIGl9fWFzeW5jIGdldFRva2VuKCl7cmV0dXJuIHRoaXMudG9rZW4mJihudWxsPT09dGhpcy50b2tlbi5leHBpcmVzQXR8fHRoaXMudG9rZW4uZXhwaXJlc0F0PkRhdGUubm93KCkpP3RoaXMudG9rZW46dGhpcy5yZWZyZXNoVG9rZW4oKX1hc3luYyBnZXRBY2Nlc3NUb2tlbigpe3JldHVybiBhd2FpdCB0aGlzLmFjdGl2ZUdldFN0b3JlZFRva2VuLChhd2FpdCB0aGlzLmdldFRva2VuKCkpLmFjY2Vzc1Rva2VufWFzeW5jIHJlZnJlc2hUb2tlbigpe3ZhciBlLHQ7aWYodGhpcy5hY3RpdmVSZWZyZXNoKXJldHVybiB0aGlzLmFjdGl2ZVJlZnJlc2g7Y29uc3Qgcj10aGlzLnRva2VuO3RoaXMuYWN0aXZlUmVmcmVzaD0oYXN5bmMoKT0+e3ZhciBlLHQ7bGV0IG49bnVsbDt0cnl7KG51bGw9PXI/dm9pZCAwOnIucmVmcmVzaFRva2VuKSYmKG49YXdhaXQgdGhpcy5vcHRpb25zLmNsaWVudC5yZWZyZXNoVG9rZW4ocikpfWNhdGNoKGUpe2NvbnNvbGUud2FybihcIltvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZSdsbCB0cnkgcmVhdXRoZW50aWNhdGluZ1wiKX1pZihufHwobj1hd2FpdCB0aGlzLm9wdGlvbnMuZ2V0TmV3VG9rZW4oKSksIW4pe2NvbnN0IHI9bmV3IEVycm9yKFwiVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWRcIik7dGhyb3cgbnVsbD09PSh0PShlPXRoaXMub3B0aW9ucykub25FcnJvcil8fHZvaWQgMD09PXR8fHQuY2FsbChlLHIpLHJ9cmV0dXJuIG59KSgpO3RyeXtjb25zdCByPWF3YWl0IHRoaXMuYWN0aXZlUmVmcmVzaDtyZXR1cm4gdGhpcy50b2tlbj1yLG51bGw9PT0odD0oZT10aGlzLm9wdGlvbnMpLnN0b3JlVG9rZW4pfHx2b2lkIDA9PT10fHx0LmNhbGwoZSxyKSx0aGlzLnNjaGVkdWxlUmVmcmVzaCgpLHJ9Y2F0Y2goZSl7dGhyb3cgdGhpcy5vcHRpb25zLm9uRXJyb3ImJnRoaXMub3B0aW9ucy5vbkVycm9yKGUpLGV9ZmluYWxseXt0aGlzLmFjdGl2ZVJlZnJlc2g9bnVsbH19c2NoZWR1bGVSZWZyZXNoKCl7dmFyIGU7aWYoIXRoaXMub3B0aW9ucy5zY2hlZHVsZVJlZnJlc2gpcmV0dXJuO2lmKHRoaXMucmVmcmVzaFRpbWVyJiYoY2xlYXJUaW1lb3V0KHRoaXMucmVmcmVzaFRpbWVyKSx0aGlzLnJlZnJlc2hUaW1lcj1udWxsKSwhKG51bGw9PT0oZT10aGlzLnRva2VuKXx8dm9pZCAwPT09ZT92b2lkIDA6ZS5leHBpcmVzQXQpfHwhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pcmV0dXJuO2NvbnN0IHQ9dGhpcy50b2tlbi5leHBpcmVzQXQtRGF0ZS5ub3coKTt0PDEyZTR8fCh0aGlzLnJlZnJlc2hUaW1lcj1zZXRUaW1lb3V0KChhc3luYygpPT57dHJ5e2F3YWl0IHRoaXMucmVmcmVzaFRva2VuKCl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihcIltmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoXCIsZSl9fSksdC02ZTQpKX19fSwyMTI6KCk9Pnt9fSx0PXt9O2Z1bmN0aW9uIHIobil7dmFyIGk9dFtuXTtpZih2b2lkIDAhPT1pKXJldHVybiBpLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fX07cmV0dXJuIGVbbl0obyxvLmV4cG9ydHMsciksby5leHBvcnRzfXZhciBuPXt9O3JldHVybigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBlPW47T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5PQXV0aDJFcnJvcj1lLk9BdXRoMkZldGNoPWUuZ2VuZXJhdGVDb2RlVmVyaWZpZXI9ZS5PQXV0aDJBdXRob3JpemF0aW9uQ29kZUNsaWVudD1lLk9BdXRoMkNsaWVudD12b2lkIDA7dmFyIHQ9cig5MzQpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQuT0F1dGgyQ2xpZW50fX0pO3ZhciBpPXIoNjE4KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIk9BdXRoMkF1dGhvcml6YXRpb25Db2RlQ2xpZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuT0F1dGgyQXV0aG9yaXphdGlvbkNvZGVDbGllbnR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJnZW5lcmF0ZUNvZGVWZXJpZmllclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBpLmdlbmVyYXRlQ29kZVZlcmlmaWVyfX0pO3ZhciBvPXIoMTMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiT0F1dGgyRmV0Y2hcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gby5PQXV0aDJGZXRjaH19KTt2YXIgcz1yKDQ0Myk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJPQXV0aDJFcnJvclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzLk9BdXRoMkVycm9yfX0pfSkoKSxufSkoKSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYXV0aDItY2xpZW50Lm1pbi5qcy5tYXAiLCIvKiEganNvbnBhdGggMS4xLjEgKi9cblxuKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuanNvbnBhdGggPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7XCIuL2Flc3ByaW1cIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICBDb3B5cmlnaHQgKEMpIDIwMTMgQXJpeWEgSGlkYXlhdCA8YXJpeWEuaGlkYXlhdEBnbWFpbC5jb20+XG4gIENvcHlyaWdodCAoQykgMjAxMyBUaGFkZGVlIFR5bCA8dGhhZGRlZS50eWxAZ21haWwuY29tPlxuICBDb3B5cmlnaHQgKEMpIDIwMTMgTWF0aGlhcyBCeW5lbnMgPG1hdGhpYXNAcWl3aS5iZT5cbiAgQ29weXJpZ2h0IChDKSAyMDEyIEFyaXlhIEhpZGF5YXQgPGFyaXlhLmhpZGF5YXRAZ21haWwuY29tPlxuICBDb3B5cmlnaHQgKEMpIDIwMTIgTWF0aGlhcyBCeW5lbnMgPG1hdGhpYXNAcWl3aS5iZT5cbiAgQ29weXJpZ2h0IChDKSAyMDEyIEpvb3N0LVdpbSBCb2VrZXN0ZWlqbiA8am9vc3Qtd2ltQGJvZWtlc3RlaWpuLm5sPlxuICBDb3B5cmlnaHQgKEMpIDIwMTIgS3JpcyBLb3dhbCA8a3Jpcy5rb3dhbEBjaXhhci5jb20+XG4gIENvcHlyaWdodCAoQykgMjAxMiBZdXN1a2UgU3V6dWtpIDx1dGF0YW5lLnRlYUBnbWFpbC5jb20+XG4gIENvcHlyaWdodCAoQykgMjAxMiBBcnBhZCBCb3Jzb3MgPGFycGFkLmJvcnNvc0Bnb29nbGVtYWlsLmNvbT5cbiAgQ29weXJpZ2h0IChDKSAyMDExIEFyaXlhIEhpZGF5YXQgPGFyaXlhLmhpZGF5YXRAZ21haWwuY29tPlxuXG4gIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4gICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG4gIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxuICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcbiAgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiovXG5cbi8qanNsaW50IGJpdHdpc2U6dHJ1ZSBwbHVzcGx1czp0cnVlICovXG4vKmdsb2JhbCBlc3ByaW1hOnRydWUsIGRlZmluZTp0cnVlLCBleHBvcnRzOnRydWUsIHdpbmRvdzogdHJ1ZSxcbnRocm93RXJyb3JUb2xlcmFudDogdHJ1ZSxcbnRocm93RXJyb3I6IHRydWUsIGdlbmVyYXRlU3RhdGVtZW50OiB0cnVlLCBwZWVrOiB0cnVlLFxucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbjogdHJ1ZSwgcGFyc2VCbG9jazogdHJ1ZSwgcGFyc2VFeHByZXNzaW9uOiB0cnVlLFxucGFyc2VGdW5jdGlvbkRlY2xhcmF0aW9uOiB0cnVlLCBwYXJzZUZ1bmN0aW9uRXhwcmVzc2lvbjogdHJ1ZSxcbnBhcnNlRnVuY3Rpb25Tb3VyY2VFbGVtZW50czogdHJ1ZSwgcGFyc2VWYXJpYWJsZUlkZW50aWZpZXI6IHRydWUsXG5wYXJzZUxlZnRIYW5kU2lkZUV4cHJlc3Npb246IHRydWUsXG5wYXJzZVVuYXJ5RXhwcmVzc2lvbjogdHJ1ZSxcbnBhcnNlU3RhdGVtZW50OiB0cnVlLCBwYXJzZVNvdXJjZUVsZW1lbnQ6IHRydWUgKi9cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLFxuICAgIC8vIFJoaW5vLCBhbmQgcGxhaW4gYnJvd3NlciBsb2FkaW5nLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KChyb290LmVzcHJpbWEgPSB7fSkpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgVG9rZW4sXG4gICAgICAgIFRva2VuTmFtZSxcbiAgICAgICAgRm5FeHByVG9rZW5zLFxuICAgICAgICBTeW50YXgsXG4gICAgICAgIFByb3BlcnR5S2luZCxcbiAgICAgICAgTWVzc2FnZXMsXG4gICAgICAgIFJlZ2V4LFxuICAgICAgICBTeW50YXhUcmVlRGVsZWdhdGUsXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgc3RyaWN0LFxuICAgICAgICBpbmRleCxcbiAgICAgICAgbGluZU51bWJlcixcbiAgICAgICAgbGluZVN0YXJ0LFxuICAgICAgICBsZW5ndGgsXG4gICAgICAgIGRlbGVnYXRlLFxuICAgICAgICBsb29rYWhlYWQsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBleHRyYTtcblxuICAgIFRva2VuID0ge1xuICAgICAgICBCb29sZWFuTGl0ZXJhbDogMSxcbiAgICAgICAgRU9GOiAyLFxuICAgICAgICBJZGVudGlmaWVyOiAzLFxuICAgICAgICBLZXl3b3JkOiA0LFxuICAgICAgICBOdWxsTGl0ZXJhbDogNSxcbiAgICAgICAgTnVtZXJpY0xpdGVyYWw6IDYsXG4gICAgICAgIFB1bmN0dWF0b3I6IDcsXG4gICAgICAgIFN0cmluZ0xpdGVyYWw6IDgsXG4gICAgICAgIFJlZ3VsYXJFeHByZXNzaW9uOiA5XG4gICAgfTtcblxuICAgIFRva2VuTmFtZSA9IHt9O1xuICAgIFRva2VuTmFtZVtUb2tlbi5Cb29sZWFuTGl0ZXJhbF0gPSAnQm9vbGVhbic7XG4gICAgVG9rZW5OYW1lW1Rva2VuLkVPRl0gPSAnPGVuZD4nO1xuICAgIFRva2VuTmFtZVtUb2tlbi5JZGVudGlmaWVyXSA9ICdJZGVudGlmaWVyJztcbiAgICBUb2tlbk5hbWVbVG9rZW4uS2V5d29yZF0gPSAnS2V5d29yZCc7XG4gICAgVG9rZW5OYW1lW1Rva2VuLk51bGxMaXRlcmFsXSA9ICdOdWxsJztcbiAgICBUb2tlbk5hbWVbVG9rZW4uTnVtZXJpY0xpdGVyYWxdID0gJ051bWVyaWMnO1xuICAgIFRva2VuTmFtZVtUb2tlbi5QdW5jdHVhdG9yXSA9ICdQdW5jdHVhdG9yJztcbiAgICBUb2tlbk5hbWVbVG9rZW4uU3RyaW5nTGl0ZXJhbF0gPSAnU3RyaW5nJztcbiAgICBUb2tlbk5hbWVbVG9rZW4uUmVndWxhckV4cHJlc3Npb25dID0gJ1JlZ3VsYXJFeHByZXNzaW9uJztcblxuICAgIC8vIEEgZnVuY3Rpb24gZm9sbG93aW5nIG9uZSBvZiB0aG9zZSB0b2tlbnMgaXMgYW4gZXhwcmVzc2lvbi5cbiAgICBGbkV4cHJUb2tlbnMgPSBbJygnLCAneycsICdbJywgJ2luJywgJ3R5cGVvZicsICdpbnN0YW5jZW9mJywgJ25ldycsXG4gICAgICAgICAgICAgICAgICAgICdyZXR1cm4nLCAnY2FzZScsICdkZWxldGUnLCAndGhyb3cnLCAndm9pZCcsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbm1lbnQgb3BlcmF0b3JzXG4gICAgICAgICAgICAgICAgICAgICc9JywgJys9JywgJy09JywgJyo9JywgJy89JywgJyU9JywgJzw8PScsICc+Pj0nLCAnPj4+PScsXG4gICAgICAgICAgICAgICAgICAgICcmPScsICd8PScsICdePScsICcsJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gYmluYXJ5L3VuYXJ5IG9wZXJhdG9yc1xuICAgICAgICAgICAgICAgICAgICAnKycsICctJywgJyonLCAnLycsICclJywgJysrJywgJy0tJywgJzw8JywgJz4+JywgJz4+PicsICcmJyxcbiAgICAgICAgICAgICAgICAgICAgJ3wnLCAnXicsICchJywgJ34nLCAnJiYnLCAnfHwnLCAnPycsICc6JywgJz09PScsICc9PScsICc+PScsXG4gICAgICAgICAgICAgICAgICAgICc8PScsICc8JywgJz4nLCAnIT0nLCAnIT09J107XG5cbiAgICBTeW50YXggPSB7XG4gICAgICAgIEFzc2lnbm1lbnRFeHByZXNzaW9uOiAnQXNzaWdubWVudEV4cHJlc3Npb24nLFxuICAgICAgICBBcnJheUV4cHJlc3Npb246ICdBcnJheUV4cHJlc3Npb24nLFxuICAgICAgICBCbG9ja1N0YXRlbWVudDogJ0Jsb2NrU3RhdGVtZW50JyxcbiAgICAgICAgQmluYXJ5RXhwcmVzc2lvbjogJ0JpbmFyeUV4cHJlc3Npb24nLFxuICAgICAgICBCcmVha1N0YXRlbWVudDogJ0JyZWFrU3RhdGVtZW50JyxcbiAgICAgICAgQ2FsbEV4cHJlc3Npb246ICdDYWxsRXhwcmVzc2lvbicsXG4gICAgICAgIENhdGNoQ2xhdXNlOiAnQ2F0Y2hDbGF1c2UnLFxuICAgICAgICBDb25kaXRpb25hbEV4cHJlc3Npb246ICdDb25kaXRpb25hbEV4cHJlc3Npb24nLFxuICAgICAgICBDb250aW51ZVN0YXRlbWVudDogJ0NvbnRpbnVlU3RhdGVtZW50JyxcbiAgICAgICAgRG9XaGlsZVN0YXRlbWVudDogJ0RvV2hpbGVTdGF0ZW1lbnQnLFxuICAgICAgICBEZWJ1Z2dlclN0YXRlbWVudDogJ0RlYnVnZ2VyU3RhdGVtZW50JyxcbiAgICAgICAgRW1wdHlTdGF0ZW1lbnQ6ICdFbXB0eVN0YXRlbWVudCcsXG4gICAgICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQ6ICdFeHByZXNzaW9uU3RhdGVtZW50JyxcbiAgICAgICAgRm9yU3RhdGVtZW50OiAnRm9yU3RhdGVtZW50JyxcbiAgICAgICAgRm9ySW5TdGF0ZW1lbnQ6ICdGb3JJblN0YXRlbWVudCcsXG4gICAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb246ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyxcbiAgICAgICAgRnVuY3Rpb25FeHByZXNzaW9uOiAnRnVuY3Rpb25FeHByZXNzaW9uJyxcbiAgICAgICAgSWRlbnRpZmllcjogJ0lkZW50aWZpZXInLFxuICAgICAgICBJZlN0YXRlbWVudDogJ0lmU3RhdGVtZW50JyxcbiAgICAgICAgTGl0ZXJhbDogJ0xpdGVyYWwnLFxuICAgICAgICBMYWJlbGVkU3RhdGVtZW50OiAnTGFiZWxlZFN0YXRlbWVudCcsXG4gICAgICAgIExvZ2ljYWxFeHByZXNzaW9uOiAnTG9naWNhbEV4cHJlc3Npb24nLFxuICAgICAgICBNZW1iZXJFeHByZXNzaW9uOiAnTWVtYmVyRXhwcmVzc2lvbicsXG4gICAgICAgIE5ld0V4cHJlc3Npb246ICdOZXdFeHByZXNzaW9uJyxcbiAgICAgICAgT2JqZWN0RXhwcmVzc2lvbjogJ09iamVjdEV4cHJlc3Npb24nLFxuICAgICAgICBQcm9ncmFtOiAnUHJvZ3JhbScsXG4gICAgICAgIFByb3BlcnR5OiAnUHJvcGVydHknLFxuICAgICAgICBSZXR1cm5TdGF0ZW1lbnQ6ICdSZXR1cm5TdGF0ZW1lbnQnLFxuICAgICAgICBTZXF1ZW5jZUV4cHJlc3Npb246ICdTZXF1ZW5jZUV4cHJlc3Npb24nLFxuICAgICAgICBTd2l0Y2hTdGF0ZW1lbnQ6ICdTd2l0Y2hTdGF0ZW1lbnQnLFxuICAgICAgICBTd2l0Y2hDYXNlOiAnU3dpdGNoQ2FzZScsXG4gICAgICAgIFRoaXNFeHByZXNzaW9uOiAnVGhpc0V4cHJlc3Npb24nLFxuICAgICAgICBUaHJvd1N0YXRlbWVudDogJ1Rocm93U3RhdGVtZW50JyxcbiAgICAgICAgVHJ5U3RhdGVtZW50OiAnVHJ5U3RhdGVtZW50JyxcbiAgICAgICAgVW5hcnlFeHByZXNzaW9uOiAnVW5hcnlFeHByZXNzaW9uJyxcbiAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjogJ1VwZGF0ZUV4cHJlc3Npb24nLFxuICAgICAgICBWYXJpYWJsZURlY2xhcmF0aW9uOiAnVmFyaWFibGVEZWNsYXJhdGlvbicsXG4gICAgICAgIFZhcmlhYmxlRGVjbGFyYXRvcjogJ1ZhcmlhYmxlRGVjbGFyYXRvcicsXG4gICAgICAgIFdoaWxlU3RhdGVtZW50OiAnV2hpbGVTdGF0ZW1lbnQnLFxuICAgICAgICBXaXRoU3RhdGVtZW50OiAnV2l0aFN0YXRlbWVudCdcbiAgICB9O1xuXG4gICAgUHJvcGVydHlLaW5kID0ge1xuICAgICAgICBEYXRhOiAxLFxuICAgICAgICBHZXQ6IDIsXG4gICAgICAgIFNldDogNFxuICAgIH07XG5cbiAgICAvLyBFcnJvciBtZXNzYWdlcyBzaG91bGQgYmUgaWRlbnRpY2FsIHRvIFY4LlxuICAgIE1lc3NhZ2VzID0ge1xuICAgICAgICBVbmV4cGVjdGVkVG9rZW46ICAnVW5leHBlY3RlZCB0b2tlbiAlMCcsXG4gICAgICAgIFVuZXhwZWN0ZWROdW1iZXI6ICAnVW5leHBlY3RlZCBudW1iZXInLFxuICAgICAgICBVbmV4cGVjdGVkU3RyaW5nOiAgJ1VuZXhwZWN0ZWQgc3RyaW5nJyxcbiAgICAgICAgVW5leHBlY3RlZElkZW50aWZpZXI6ICAnVW5leHBlY3RlZCBpZGVudGlmaWVyJyxcbiAgICAgICAgVW5leHBlY3RlZFJlc2VydmVkOiAgJ1VuZXhwZWN0ZWQgcmVzZXJ2ZWQgd29yZCcsXG4gICAgICAgIFVuZXhwZWN0ZWRFT1M6ICAnVW5leHBlY3RlZCBlbmQgb2YgaW5wdXQnLFxuICAgICAgICBOZXdsaW5lQWZ0ZXJUaHJvdzogICdJbGxlZ2FsIG5ld2xpbmUgYWZ0ZXIgdGhyb3cnLFxuICAgICAgICBJbnZhbGlkUmVnRXhwOiAnSW52YWxpZCByZWd1bGFyIGV4cHJlc3Npb24nLFxuICAgICAgICBVbnRlcm1pbmF0ZWRSZWdFeHA6ICAnSW52YWxpZCByZWd1bGFyIGV4cHJlc3Npb246IG1pc3NpbmcgLycsXG4gICAgICAgIEludmFsaWRMSFNJbkFzc2lnbm1lbnQ6ICAnSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBhc3NpZ25tZW50JyxcbiAgICAgICAgSW52YWxpZExIU0luRm9ySW46ICAnSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBmb3ItaW4nLFxuICAgICAgICBNdWx0aXBsZURlZmF1bHRzSW5Td2l0Y2g6ICdNb3JlIHRoYW4gb25lIGRlZmF1bHQgY2xhdXNlIGluIHN3aXRjaCBzdGF0ZW1lbnQnLFxuICAgICAgICBOb0NhdGNoT3JGaW5hbGx5OiAgJ01pc3NpbmcgY2F0Y2ggb3IgZmluYWxseSBhZnRlciB0cnknLFxuICAgICAgICBVbmtub3duTGFiZWw6ICdVbmRlZmluZWQgbGFiZWwgXFwnJTBcXCcnLFxuICAgICAgICBSZWRlY2xhcmF0aW9uOiAnJTAgXFwnJTFcXCcgaGFzIGFscmVhZHkgYmVlbiBkZWNsYXJlZCcsXG4gICAgICAgIElsbGVnYWxDb250aW51ZTogJ0lsbGVnYWwgY29udGludWUgc3RhdGVtZW50JyxcbiAgICAgICAgSWxsZWdhbEJyZWFrOiAnSWxsZWdhbCBicmVhayBzdGF0ZW1lbnQnLFxuICAgICAgICBJbGxlZ2FsUmV0dXJuOiAnSWxsZWdhbCByZXR1cm4gc3RhdGVtZW50JyxcbiAgICAgICAgU3RyaWN0TW9kZVdpdGg6ICAnU3RyaWN0IG1vZGUgY29kZSBtYXkgbm90IGluY2x1ZGUgYSB3aXRoIHN0YXRlbWVudCcsXG4gICAgICAgIFN0cmljdENhdGNoVmFyaWFibGU6ICAnQ2F0Y2ggdmFyaWFibGUgbWF5IG5vdCBiZSBldmFsIG9yIGFyZ3VtZW50cyBpbiBzdHJpY3QgbW9kZScsXG4gICAgICAgIFN0cmljdFZhck5hbWU6ICAnVmFyaWFibGUgbmFtZSBtYXkgbm90IGJlIGV2YWwgb3IgYXJndW1lbnRzIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0UGFyYW1OYW1lOiAgJ1BhcmFtZXRlciBuYW1lIGV2YWwgb3IgYXJndW1lbnRzIGlzIG5vdCBhbGxvd2VkIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0UGFyYW1EdXBlOiAnU3RyaWN0IG1vZGUgZnVuY3Rpb24gbWF5IG5vdCBoYXZlIGR1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXMnLFxuICAgICAgICBTdHJpY3RGdW5jdGlvbk5hbWU6ICAnRnVuY3Rpb24gbmFtZSBtYXkgbm90IGJlIGV2YWwgb3IgYXJndW1lbnRzIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0T2N0YWxMaXRlcmFsOiAgJ09jdGFsIGxpdGVyYWxzIGFyZSBub3QgYWxsb3dlZCBpbiBzdHJpY3QgbW9kZS4nLFxuICAgICAgICBTdHJpY3REZWxldGU6ICAnRGVsZXRlIG9mIGFuIHVucXVhbGlmaWVkIGlkZW50aWZpZXIgaW4gc3RyaWN0IG1vZGUuJyxcbiAgICAgICAgU3RyaWN0RHVwbGljYXRlUHJvcGVydHk6ICAnRHVwbGljYXRlIGRhdGEgcHJvcGVydHkgaW4gb2JqZWN0IGxpdGVyYWwgbm90IGFsbG93ZWQgaW4gc3RyaWN0IG1vZGUnLFxuICAgICAgICBBY2Nlc3NvckRhdGFQcm9wZXJ0eTogICdPYmplY3QgbGl0ZXJhbCBtYXkgbm90IGhhdmUgZGF0YSBhbmQgYWNjZXNzb3IgcHJvcGVydHkgd2l0aCB0aGUgc2FtZSBuYW1lJyxcbiAgICAgICAgQWNjZXNzb3JHZXRTZXQ6ICAnT2JqZWN0IGxpdGVyYWwgbWF5IG5vdCBoYXZlIG11bHRpcGxlIGdldC9zZXQgYWNjZXNzb3JzIHdpdGggdGhlIHNhbWUgbmFtZScsXG4gICAgICAgIFN0cmljdExIU0Fzc2lnbm1lbnQ6ICAnQXNzaWdubWVudCB0byBldmFsIG9yIGFyZ3VtZW50cyBpcyBub3QgYWxsb3dlZCBpbiBzdHJpY3QgbW9kZScsXG4gICAgICAgIFN0cmljdExIU1Bvc3RmaXg6ICAnUG9zdGZpeCBpbmNyZW1lbnQvZGVjcmVtZW50IG1heSBub3QgaGF2ZSBldmFsIG9yIGFyZ3VtZW50cyBvcGVyYW5kIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0TEhTUHJlZml4OiAgJ1ByZWZpeCBpbmNyZW1lbnQvZGVjcmVtZW50IG1heSBub3QgaGF2ZSBldmFsIG9yIGFyZ3VtZW50cyBvcGVyYW5kIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0UmVzZXJ2ZWRXb3JkOiAgJ1VzZSBvZiBmdXR1cmUgcmVzZXJ2ZWQgd29yZCBpbiBzdHJpY3QgbW9kZSdcbiAgICB9O1xuXG4gICAgLy8gU2VlIGFsc28gdG9vbHMvZ2VuZXJhdGUtdW5pY29kZS1yZWdleC5weS5cbiAgICBSZWdleCA9IHtcbiAgICAgICAgTm9uQXNjaWlJZGVudGlmaWVyU3RhcnQ6IG5ldyBSZWdFeHAoJ1tcXHhBQVxceEI1XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEUtXFx1MDNBMVxcdTAzQTMtXFx1MDNGNVxcdTAzRjctXFx1MDQ4MVxcdTA0OEEtXFx1MDUyN1xcdTA1MzEtXFx1MDU1NlxcdTA1NTlcXHUwNTYxLVxcdTA1ODdcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDg0MC1cXHUwODU4XFx1MDhBMFxcdTA4QTItXFx1MDhBQ1xcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTc3XFx1MDk3OS1cXHUwOTdGXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzNcXHUwQzM1LVxcdTBDMzlcXHUwQzNEXFx1MEM1OFxcdTBDNTlcXHUwQzYwXFx1MEM2MVxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ2MFxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEwRDAtXFx1MTBGQVxcdTEwRkMtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTNBMC1cXHUxM0Y0XFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZFRS1cXHUxNkYwXFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEN1xcdTE3RENcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFDXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlDMS1cXHUxOUM3XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUFBN1xcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzdEXFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE2MC1cXHUyMTg4XFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNS1cXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAzMS1cXHUzMDM1XFx1MzAzOC1cXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RC1cXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGQy1cXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkNDXFx1QTAwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OTdcXHVBNkEwLVxcdUE2RUZcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3OEVcXHVBNzkwLVxcdUE3OTNcXHVBN0EwLVxcdUE3QUFcXHVBN0Y4LVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlDRlxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTgwLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ10nKSxcbiAgICAgICAgTm9uQXNjaWlJZGVudGlmaWVyUGFydDogbmV3IFJlZ0V4cCgnW1xceEFBXFx4QjVcXHhCQVxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHhGOC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzAwLVxcdTAzNzRcXHUwMzc2XFx1MDM3N1xcdTAzN0EtXFx1MDM3RFxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RS1cXHUwM0ExXFx1MDNBMy1cXHUwM0Y1XFx1MDNGNy1cXHUwNDgxXFx1MDQ4My1cXHUwNDg3XFx1MDQ4QS1cXHUwNTI3XFx1MDUzMS1cXHUwNTU2XFx1MDU1OVxcdTA1NjEtXFx1MDU4N1xcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MTAtXFx1MDYxQVxcdTA2MjAtXFx1MDY2OVxcdTA2NkUtXFx1MDZEM1xcdTA2RDUtXFx1MDZEQ1xcdTA2REYtXFx1MDZFOFxcdTA2RUEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwLVxcdTA3NEFcXHUwNzRELVxcdTA3QjFcXHUwN0MwLVxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODJEXFx1MDg0MC1cXHUwODVCXFx1MDhBMFxcdTA4QTItXFx1MDhBQ1xcdTA4RTQtXFx1MDhGRVxcdTA5MDAtXFx1MDk2M1xcdTA5NjYtXFx1MDk2RlxcdTA5NzEtXFx1MDk3N1xcdTA5NzktXFx1MDk3RlxcdTA5ODEtXFx1MDk4M1xcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkMtXFx1MDlDNFxcdTA5QzdcXHUwOUM4XFx1MDlDQi1cXHUwOUNFXFx1MDlEN1xcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUzXFx1MDlFNi1cXHUwOUYxXFx1MEEwMS1cXHUwQTAzXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTNDXFx1MEEzRS1cXHUwQTQyXFx1MEE0N1xcdTBBNDhcXHUwQTRCLVxcdTBBNERcXHUwQTUxXFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNjYtXFx1MEE3NVxcdTBBODEtXFx1MEE4M1xcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCQy1cXHUwQUM1XFx1MEFDNy1cXHUwQUM5XFx1MEFDQi1cXHUwQUNEXFx1MEFEMFxcdTBBRTAtXFx1MEFFM1xcdTBBRTYtXFx1MEFFRlxcdTBCMDEtXFx1MEIwM1xcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNDLVxcdTBCNDRcXHUwQjQ3XFx1MEI0OFxcdTBCNEItXFx1MEI0RFxcdTBCNTZcXHUwQjU3XFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjNcXHUwQjY2LVxcdTBCNkZcXHUwQjcxXFx1MEI4MlxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJCRS1cXHUwQkMyXFx1MEJDNi1cXHUwQkM4XFx1MEJDQS1cXHUwQkNEXFx1MEJEMFxcdTBCRDdcXHUwQkU2LVxcdTBCRUZcXHUwQzAxLVxcdTBDMDNcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzNcXHUwQzM1LVxcdTBDMzlcXHUwQzNELVxcdTBDNDRcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNThcXHUwQzU5XFx1MEM2MC1cXHUwQzYzXFx1MEM2Ni1cXHUwQzZGXFx1MEM4MlxcdTBDODNcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JDLVxcdTBDQzRcXHUwQ0M2LVxcdTBDQzhcXHUwQ0NBLVxcdTBDQ0RcXHUwQ0Q1XFx1MENENlxcdTBDREVcXHUwQ0UwLVxcdTBDRTNcXHUwQ0U2LVxcdTBDRUZcXHUwQ0YxXFx1MENGMlxcdTBEMDJcXHUwRDAzXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRC1cXHUwRDQ0XFx1MEQ0Ni1cXHUwRDQ4XFx1MEQ0QS1cXHUwRDRFXFx1MEQ1N1xcdTBENjAtXFx1MEQ2M1xcdTBENjYtXFx1MEQ2RlxcdTBEN0EtXFx1MEQ3RlxcdTBEODJcXHUwRDgzXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBEQ0FcXHUwRENGLVxcdTBERDRcXHUwREQ2XFx1MEREOC1cXHUwRERGXFx1MERGMlxcdTBERjNcXHUwRTAxLVxcdTBFM0FcXHUwRTQwLVxcdTBFNEVcXHUwRTUwLVxcdTBFNTlcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCOVxcdTBFQkItXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRUM4LVxcdTBFQ0RcXHUwRUQwLVxcdTBFRDlcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEYxOFxcdTBGMTlcXHUwRjIwLVxcdTBGMjlcXHUwRjM1XFx1MEYzN1xcdTBGMzlcXHUwRjNFLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjcxLVxcdTBGODRcXHUwRjg2LVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAwMC1cXHUxMDQ5XFx1MTA1MC1cXHUxMDlEXFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzNUQtXFx1MTM1RlxcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RUUtXFx1MTZGMFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxNFxcdTE3MjAtXFx1MTczNFxcdTE3NDAtXFx1MTc1M1xcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3NzJcXHUxNzczXFx1MTc4MC1cXHUxN0QzXFx1MTdEN1xcdTE3RENcXHUxN0REXFx1MTdFMC1cXHUxN0U5XFx1MTgwQi1cXHUxODBEXFx1MTgxMC1cXHUxODE5XFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFDXFx1MTkyMC1cXHUxOTJCXFx1MTkzMC1cXHUxOTNCXFx1MTk0Ni1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MTlEMC1cXHUxOUQ5XFx1MUEwMC1cXHUxQTFCXFx1MUEyMC1cXHUxQTVFXFx1MUE2MC1cXHUxQTdDXFx1MUE3Ri1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUFBN1xcdTFCMDAtXFx1MUI0QlxcdTFCNTAtXFx1MUI1OVxcdTFCNkItXFx1MUI3M1xcdTFCODAtXFx1MUJGM1xcdTFDMDAtXFx1MUMzN1xcdTFDNDAtXFx1MUM0OVxcdTFDNEQtXFx1MUM3RFxcdTFDRDAtXFx1MUNEMlxcdTFDRDQtXFx1MUNGNlxcdTFEMDAtXFx1MURFNlxcdTFERkMtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDBDXFx1MjAwRFxcdTIwM0ZcXHUyMDQwXFx1MjA1NFxcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MjBEMC1cXHUyMERDXFx1MjBFMVxcdTIwRTUtXFx1MjBGMFxcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMkYtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTYwLVxcdTIxODhcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDdGLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyREUwLVxcdTJERkZcXHUyRTJGXFx1MzAwNS1cXHUzMDA3XFx1MzAyMS1cXHUzMDJGXFx1MzAzMS1cXHUzMDM1XFx1MzAzOC1cXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5OVxcdTMwOUFcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGQ0NcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MkJcXHVBNjQwLVxcdUE2NkZcXHVBNjc0LVxcdUE2N0RcXHVBNjdGLVxcdUE2OTdcXHVBNjlGLVxcdUE2RjFcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3OEVcXHVBNzkwLVxcdUE3OTNcXHVBN0EwLVxcdUE3QUFcXHVBN0Y4LVxcdUE4MjdcXHVBODQwLVxcdUE4NzNcXHVBODgwLVxcdUE4QzRcXHVBOEQwLVxcdUE4RDlcXHVBOEUwLVxcdUE4RjdcXHVBOEZCXFx1QTkwMC1cXHVBOTJEXFx1QTkzMC1cXHVBOTUzXFx1QTk2MC1cXHVBOTdDXFx1QTk4MC1cXHVBOUMwXFx1QTlDRi1cXHVBOUQ5XFx1QUEwMC1cXHVBQTM2XFx1QUE0MC1cXHVBQTREXFx1QUE1MC1cXHVBQTU5XFx1QUE2MC1cXHVBQTc2XFx1QUE3QVxcdUFBN0JcXHVBQTgwLVxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUZcXHVBQUYyLVxcdUFBRjZcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRUFcXHVBQkVDXFx1QUJFRFxcdUFCRjAtXFx1QUJGOVxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMUQtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkUwMC1cXHVGRTBGXFx1RkUyMC1cXHVGRTI2XFx1RkUzM1xcdUZFMzRcXHVGRTRELVxcdUZFNEZcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjEwLVxcdUZGMTlcXHVGRjIxLVxcdUZGM0FcXHVGRjNGXFx1RkY0MS1cXHVGRjVBXFx1RkY2Ni1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXScpXG4gICAgfTtcblxuICAgIC8vIEVuc3VyZSB0aGUgY29uZGl0aW9uIGlzIHRydWUsIG90aGVyd2lzZSB0aHJvdyBhbiBlcnJvci5cbiAgICAvLyBUaGlzIGlzIG9ubHkgdG8gaGF2ZSBhIGJldHRlciBjb250cmFjdCBzZW1hbnRpYywgaS5lLiBhbm90aGVyIHNhZmV0eSBuZXRcbiAgICAvLyB0byBjYXRjaCBhIGxvZ2ljIGVycm9yLiBUaGUgY29uZGl0aW9uIHNoYWxsIGJlIGZ1bGZpbGxlZCBpbiBub3JtYWwgY2FzZS5cbiAgICAvLyBEbyBOT1QgdXNlIHRoaXMgdG8gZW5mb3JjZSBhIGNlcnRhaW4gY29uZGl0aW9uIG9uIGFueSB1c2VyIGlucHV0LlxuXG4gICAgZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQVNTRVJUOiAnICsgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RlY2ltYWxEaWdpdChjaCkge1xuICAgICAgICByZXR1cm4gKGNoID49IDQ4ICYmIGNoIDw9IDU3KTsgICAvLyAwLi45XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNIZXhEaWdpdChjaCkge1xuICAgICAgICByZXR1cm4gJzAxMjM0NTY3ODlhYmNkZWZBQkNERUYnLmluZGV4T2YoY2gpID49IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPY3RhbERpZ2l0KGNoKSB7XG4gICAgICAgIHJldHVybiAnMDEyMzQ1NjcnLmluZGV4T2YoY2gpID49IDA7XG4gICAgfVxuXG5cbiAgICAvLyA3LjIgV2hpdGUgU3BhY2VcblxuICAgIGZ1bmN0aW9uIGlzV2hpdGVTcGFjZShjaCkge1xuICAgICAgICByZXR1cm4gKGNoID09PSAweDIwKSB8fCAoY2ggPT09IDB4MDkpIHx8IChjaCA9PT0gMHgwQikgfHwgKGNoID09PSAweDBDKSB8fCAoY2ggPT09IDB4QTApIHx8XG4gICAgICAgICAgICAoY2ggPj0gMHgxNjgwICYmIFsweDE2ODAsIDB4MTgwRSwgMHgyMDAwLCAweDIwMDEsIDB4MjAwMiwgMHgyMDAzLCAweDIwMDQsIDB4MjAwNSwgMHgyMDA2LCAweDIwMDcsIDB4MjAwOCwgMHgyMDA5LCAweDIwMEEsIDB4MjAyRiwgMHgyMDVGLCAweDMwMDAsIDB4RkVGRl0uaW5kZXhPZihjaCkgPj0gMCk7XG4gICAgfVxuXG4gICAgLy8gNy4zIExpbmUgVGVybWluYXRvcnNcblxuICAgIGZ1bmN0aW9uIGlzTGluZVRlcm1pbmF0b3IoY2gpIHtcbiAgICAgICAgcmV0dXJuIChjaCA9PT0gMHgwQSkgfHwgKGNoID09PSAweDBEKSB8fCAoY2ggPT09IDB4MjAyOCkgfHwgKGNoID09PSAweDIwMjkpO1xuICAgIH1cblxuICAgIC8vIDcuNiBJZGVudGlmaWVyIE5hbWVzIGFuZCBJZGVudGlmaWVyc1xuXG4gICAgZnVuY3Rpb24gaXNJZGVudGlmaWVyU3RhcnQoY2gpIHtcbiAgICAgICAgcmV0dXJuIChjaCA9PSAweDQwKSB8fCAgKGNoID09PSAweDI0KSB8fCAoY2ggPT09IDB4NUYpIHx8ICAvLyAkIChkb2xsYXIpIGFuZCBfICh1bmRlcnNjb3JlKVxuICAgICAgICAgICAgKGNoID49IDB4NDEgJiYgY2ggPD0gMHg1QSkgfHwgICAgICAgICAvLyBBLi5aXG4gICAgICAgICAgICAoY2ggPj0gMHg2MSAmJiBjaCA8PSAweDdBKSB8fCAgICAgICAgIC8vIGEuLnpcbiAgICAgICAgICAgIChjaCA9PT0gMHg1QykgfHwgICAgICAgICAgICAgICAgICAgICAgLy8gXFwgKGJhY2tzbGFzaClcbiAgICAgICAgICAgICgoY2ggPj0gMHg4MCkgJiYgUmVnZXguTm9uQXNjaWlJZGVudGlmaWVyU3RhcnQudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzSWRlbnRpZmllclBhcnQoY2gpIHtcbiAgICAgICAgcmV0dXJuIChjaCA9PT0gMHgyNCkgfHwgKGNoID09PSAweDVGKSB8fCAgLy8gJCAoZG9sbGFyKSBhbmQgXyAodW5kZXJzY29yZSlcbiAgICAgICAgICAgIChjaCA+PSAweDQxICYmIGNoIDw9IDB4NUEpIHx8ICAgICAgICAgLy8gQS4uWlxuICAgICAgICAgICAgKGNoID49IDB4NjEgJiYgY2ggPD0gMHg3QSkgfHwgICAgICAgICAvLyBhLi56XG4gICAgICAgICAgICAoY2ggPj0gMHgzMCAmJiBjaCA8PSAweDM5KSB8fCAgICAgICAgIC8vIDAuLjlcbiAgICAgICAgICAgIChjaCA9PT0gMHg1QykgfHwgICAgICAgICAgICAgICAgICAgICAgLy8gXFwgKGJhY2tzbGFzaClcbiAgICAgICAgICAgICgoY2ggPj0gMHg4MCkgJiYgUmVnZXguTm9uQXNjaWlJZGVudGlmaWVyUGFydC50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpKSk7XG4gICAgfVxuXG4gICAgLy8gNy42LjEuMiBGdXR1cmUgUmVzZXJ2ZWQgV29yZHNcblxuICAgIGZ1bmN0aW9uIGlzRnV0dXJlUmVzZXJ2ZWRXb3JkKGlkKSB7XG4gICAgICAgIHN3aXRjaCAoaWQpIHtcbiAgICAgICAgY2FzZSAnY2xhc3MnOlxuICAgICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgY2FzZSAnZXhwb3J0JzpcbiAgICAgICAgY2FzZSAnZXh0ZW5kcyc6XG4gICAgICAgIGNhc2UgJ2ltcG9ydCc6XG4gICAgICAgIGNhc2UgJ3N1cGVyJzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkKGlkKSB7XG4gICAgICAgIHN3aXRjaCAoaWQpIHtcbiAgICAgICAgY2FzZSAnaW1wbGVtZW50cyc6XG4gICAgICAgIGNhc2UgJ2ludGVyZmFjZSc6XG4gICAgICAgIGNhc2UgJ3BhY2thZ2UnOlxuICAgICAgICBjYXNlICdwcml2YXRlJzpcbiAgICAgICAgY2FzZSAncHJvdGVjdGVkJzpcbiAgICAgICAgY2FzZSAncHVibGljJzpcbiAgICAgICAgY2FzZSAnc3RhdGljJzpcbiAgICAgICAgY2FzZSAneWllbGQnOlxuICAgICAgICBjYXNlICdsZXQnOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1Jlc3RyaWN0ZWRXb3JkKGlkKSB7XG4gICAgICAgIHJldHVybiBpZCA9PT0gJ2V2YWwnIHx8IGlkID09PSAnYXJndW1lbnRzJztcbiAgICB9XG5cbiAgICAvLyA3LjYuMS4xIEtleXdvcmRzXG5cbiAgICBmdW5jdGlvbiBpc0tleXdvcmQoaWQpIHtcbiAgICAgICAgaWYgKHN0cmljdCAmJiBpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQoaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdjb25zdCcgaXMgc3BlY2lhbGl6ZWQgYXMgS2V5d29yZCBpbiBWOC5cbiAgICAgICAgLy8gJ3lpZWxkJyBhbmQgJ2xldCcgYXJlIGZvciBjb21wYXRpYmxpdHkgd2l0aCBTcGlkZXJNb25rZXkgYW5kIEVTLm5leHQuXG4gICAgICAgIC8vIFNvbWUgb3RoZXJzIGFyZSBmcm9tIGZ1dHVyZSByZXNlcnZlZCB3b3Jkcy5cblxuICAgICAgICBzd2l0Y2ggKGlkLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAnaWYnKSB8fCAoaWQgPT09ICdpbicpIHx8IChpZCA9PT0gJ2RvJyk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICd2YXInKSB8fCAoaWQgPT09ICdmb3InKSB8fCAoaWQgPT09ICduZXcnKSB8fFxuICAgICAgICAgICAgICAgIChpZCA9PT0gJ3RyeScpIHx8IChpZCA9PT0gJ2xldCcpO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAndGhpcycpIHx8IChpZCA9PT0gJ2Vsc2UnKSB8fCAoaWQgPT09ICdjYXNlJykgfHxcbiAgICAgICAgICAgICAgICAoaWQgPT09ICd2b2lkJykgfHwgKGlkID09PSAnd2l0aCcpIHx8IChpZCA9PT0gJ2VudW0nKTtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIChpZCA9PT0gJ3doaWxlJykgfHwgKGlkID09PSAnYnJlYWsnKSB8fCAoaWQgPT09ICdjYXRjaCcpIHx8XG4gICAgICAgICAgICAgICAgKGlkID09PSAndGhyb3cnKSB8fCAoaWQgPT09ICdjb25zdCcpIHx8IChpZCA9PT0gJ3lpZWxkJykgfHxcbiAgICAgICAgICAgICAgICAoaWQgPT09ICdjbGFzcycpIHx8IChpZCA9PT0gJ3N1cGVyJyk7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICdyZXR1cm4nKSB8fCAoaWQgPT09ICd0eXBlb2YnKSB8fCAoaWQgPT09ICdkZWxldGUnKSB8fFxuICAgICAgICAgICAgICAgIChpZCA9PT0gJ3N3aXRjaCcpIHx8IChpZCA9PT0gJ2V4cG9ydCcpIHx8IChpZCA9PT0gJ2ltcG9ydCcpO1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAnZGVmYXVsdCcpIHx8IChpZCA9PT0gJ2ZpbmFsbHknKSB8fCAoaWQgPT09ICdleHRlbmRzJyk7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICdmdW5jdGlvbicpIHx8IChpZCA9PT0gJ2NvbnRpbnVlJykgfHwgKGlkID09PSAnZGVidWdnZXInKTtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICdpbnN0YW5jZW9mJyk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA3LjQgQ29tbWVudHNcblxuICAgIGZ1bmN0aW9uIGFkZENvbW1lbnQodHlwZSwgdmFsdWUsIHN0YXJ0LCBlbmQsIGxvYykge1xuICAgICAgICB2YXIgY29tbWVudCwgYXR0YWNoZXI7XG5cbiAgICAgICAgYXNzZXJ0KHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicsICdDb21tZW50IG11c3QgaGF2ZSB2YWxpZCBwb3NpdGlvbicpO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgdGhlIHdheSB0aGUgYWN0dWFsIHRva2VuIGlzIHNjYW5uZWQsIG9mdGVuIHRoZSBjb21tZW50c1xuICAgICAgICAvLyAoaWYgYW55KSBhcmUgc2tpcHBlZCB0d2ljZSBkdXJpbmcgdGhlIGxleGljYWwgYW5hbHlzaXMuXG4gICAgICAgIC8vIFRodXMsIHdlIG5lZWQgdG8gc2tpcCBhZGRpbmcgYSBjb21tZW50IGlmIHRoZSBjb21tZW50IGFycmF5IGFscmVhZHlcbiAgICAgICAgLy8gaGFuZGxlZCBpdC5cbiAgICAgICAgaWYgKHN0YXRlLmxhc3RDb21tZW50U3RhcnQgPj0gc3RhcnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5sYXN0Q29tbWVudFN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAgICAgY29tbWVudCA9IHtcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGV4dHJhLnJhbmdlKSB7XG4gICAgICAgICAgICBjb21tZW50LnJhbmdlID0gW3N0YXJ0LCBlbmRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHRyYS5sb2MpIHtcbiAgICAgICAgICAgIGNvbW1lbnQubG9jID0gbG9jO1xuICAgICAgICB9XG4gICAgICAgIGV4dHJhLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XG4gICAgICAgIGlmIChleHRyYS5hdHRhY2hDb21tZW50KSB7XG4gICAgICAgICAgICBleHRyYS5sZWFkaW5nQ29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICAgICAgICAgIGV4dHJhLnRyYWlsaW5nQ29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBTaW5nbGVMaW5lQ29tbWVudChvZmZzZXQpIHtcbiAgICAgICAgdmFyIHN0YXJ0LCBsb2MsIGNoLCBjb21tZW50O1xuXG4gICAgICAgIHN0YXJ0ID0gaW5kZXggLSBvZmZzZXQ7XG4gICAgICAgIGxvYyA9IHtcbiAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0IC0gb2Zmc2V0XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICBpZiAoaXNMaW5lVGVybWluYXRvcihjaCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmEuY29tbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IHNvdXJjZS5zbGljZShzdGFydCArIG9mZnNldCwgaW5kZXggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jLmVuZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0IC0gMVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBhZGRDb21tZW50KCdMaW5lJywgY29tbWVudCwgc3RhcnQsIGluZGV4IC0gMSwgbG9jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAxMyAmJiBzb3VyY2UuY2hhckNvZGVBdChpbmRleCkgPT09IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICsrbGluZU51bWJlcjtcbiAgICAgICAgICAgICAgICBsaW5lU3RhcnQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXh0cmEuY29tbWVudHMpIHtcbiAgICAgICAgICAgIGNvbW1lbnQgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQgKyBvZmZzZXQsIGluZGV4KTtcbiAgICAgICAgICAgIGxvYy5lbmQgPSB7XG4gICAgICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkQ29tbWVudCgnTGluZScsIGNvbW1lbnQsIHN0YXJ0LCBpbmRleCwgbG9jKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBNdWx0aUxpbmVDb21tZW50KCkge1xuICAgICAgICB2YXIgc3RhcnQsIGxvYywgY2gsIGNvbW1lbnQ7XG5cbiAgICAgICAgaWYgKGV4dHJhLmNvbW1lbnRzKSB7XG4gICAgICAgICAgICBzdGFydCA9IGluZGV4IC0gMjtcbiAgICAgICAgICAgIGxvYyA9IHtcbiAgICAgICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgICAgICBsaW5lOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0IC0gMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGlzTGluZVRlcm1pbmF0b3IoY2gpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAweDBEICYmIHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMSkgPT09IDB4MEEpIHtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKytsaW5lTnVtYmVyO1xuICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKHt9LCBNZXNzYWdlcy5VbmV4cGVjdGVkVG9rZW4sICdJTExFR0FMJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMHgyQSkge1xuICAgICAgICAgICAgICAgIC8vIEJsb2NrIGNvbW1lbnQgZW5kcyB3aXRoICcqLycuXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMSkgPT09IDB4MkYpIHtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4dHJhLmNvbW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gc291cmNlLnNsaWNlKHN0YXJ0ICsgMiwgaW5kZXggLSAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYy5lbmQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ29tbWVudCgnQmxvY2snLCBjb21tZW50LCBzdGFydCwgaW5kZXgsIGxvYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCAnSUxMRUdBTCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBDb21tZW50KCkge1xuICAgICAgICB2YXIgY2gsIHN0YXJ0O1xuXG4gICAgICAgIHN0YXJ0ID0gKGluZGV4ID09PSAwKTtcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KTtcblxuICAgICAgICAgICAgaWYgKGlzV2hpdGVTcGFjZShjaCkpIHtcbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoKSkge1xuICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAweDBEICYmIHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSA9PT0gMHgwQSkge1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICArK2xpbmVOdW1iZXI7XG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgc3RhcnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMHgyRikgeyAvLyBVKzAwMkYgaXMgJy8nXG4gICAgICAgICAgICAgICAgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gMHgyRikge1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICBza2lwU2luZ2xlTGluZUNvbW1lbnQoMik7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAweDJBKSB7ICAvLyBVKzAwMkEgaXMgJyonXG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHNraXBNdWx0aUxpbmVDb21tZW50KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydCAmJiBjaCA9PT0gMHgyRCkgeyAvLyBVKzAwMkQgaXMgJy0nXG4gICAgICAgICAgICAgICAgLy8gVSswMDNFIGlzICc+J1xuICAgICAgICAgICAgICAgIGlmICgoc291cmNlLmNoYXJDb2RlQXQoaW5kZXggKyAxKSA9PT0gMHgyRCkgJiYgKHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMikgPT09IDB4M0UpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICctLT4nIGlzIGEgc2luZ2xlLWxpbmUgY29tbWVudFxuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAzO1xuICAgICAgICAgICAgICAgICAgICBza2lwU2luZ2xlTGluZUNvbW1lbnQoMyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMHgzQykgeyAvLyBVKzAwM0MgaXMgJzwnXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5zbGljZShpbmRleCArIDEsIGluZGV4ICsgNCkgPT09ICchLS0nKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7IC8vIGA8YFxuICAgICAgICAgICAgICAgICAgICArK2luZGV4OyAvLyBgIWBcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDsgLy8gYC1gXG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7IC8vIGAtYFxuICAgICAgICAgICAgICAgICAgICBza2lwU2luZ2xlTGluZUNvbW1lbnQoNCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5IZXhFc2NhcGUocHJlZml4KSB7XG4gICAgICAgIHZhciBpLCBsZW4sIGNoLCBjb2RlID0gMDtcblxuICAgICAgICBsZW4gPSAocHJlZml4ID09PSAndScpID8gNCA6IDI7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoICYmIGlzSGV4RGlnaXQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICBjaCA9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgICAgICBjb2RlID0gY29kZSAqIDE2ICsgJzAxMjM0NTY3ODlhYmNkZWYnLmluZGV4T2YoY2gudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFc2NhcGVkSWRlbnRpZmllcigpIHtcbiAgICAgICAgdmFyIGNoLCBpZDtcblxuICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KyspO1xuICAgICAgICBpZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpO1xuXG4gICAgICAgIC8vICdcXHUnIChVKzAwNUMsIFUrMDA3NSkgZGVub3RlcyBhbiBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgICAgaWYgKGNoID09PSAweDVDKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpICE9PSAweDc1KSB7XG4gICAgICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCAnSUxMRUdBTCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGNoID0gc2NhbkhleEVzY2FwZSgndScpO1xuICAgICAgICAgICAgaWYgKCFjaCB8fCBjaCA9PT0gJ1xcXFwnIHx8ICFpc0lkZW50aWZpZXJTdGFydChjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkID0gY2g7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFpc0lkZW50aWZpZXJQYXJ0KGNoKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGlkICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpO1xuXG4gICAgICAgICAgICAvLyAnXFx1JyAoVSswMDVDLCBVKzAwNzUpIGRlbm90ZXMgYW4gZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAgICAgICAgICBpZiAoY2ggPT09IDB4NUMpIHtcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cigwLCBpZC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpICE9PSAweDc1KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICBjaCA9IHNjYW5IZXhFc2NhcGUoJ3UnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNoIHx8IGNoID09PSAnXFxcXCcgfHwgIWlzSWRlbnRpZmllclBhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCAnSUxMRUdBTCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZCArPSBjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJZGVudGlmaWVyKCkge1xuICAgICAgICB2YXIgc3RhcnQsIGNoO1xuXG4gICAgICAgIHN0YXJ0ID0gaW5kZXgrKztcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gMHg1Qykge1xuICAgICAgICAgICAgICAgIC8vIEJsYWNrc2xhc2ggKFUrMDA1QykgbWFya3MgVW5pY29kZSBlc2NhcGUgc2VxdWVuY2UuXG4gICAgICAgICAgICAgICAgaW5kZXggPSBzdGFydDtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RXNjYXBlZElkZW50aWZpZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0lkZW50aWZpZXJQYXJ0KGNoKSkge1xuICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZShzdGFydCwgaW5kZXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5JZGVudGlmaWVyKCkge1xuICAgICAgICB2YXIgc3RhcnQsIGlkLCB0eXBlO1xuXG4gICAgICAgIHN0YXJ0ID0gaW5kZXg7XG5cbiAgICAgICAgLy8gQmFja3NsYXNoIChVKzAwNUMpIHN0YXJ0cyBhbiBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgICAgaWQgPSAoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpID09PSAweDVDKSA/IGdldEVzY2FwZWRJZGVudGlmaWVyKCkgOiBnZXRJZGVudGlmaWVyKCk7XG5cbiAgICAgICAgLy8gVGhlcmUgaXMgbm8ga2V5d29yZCBvciBsaXRlcmFsIHdpdGggb25seSBvbmUgY2hhcmFjdGVyLlxuICAgICAgICAvLyBUaHVzLCBpdCBtdXN0IGJlIGFuIGlkZW50aWZpZXIuXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHR5cGUgPSBUb2tlbi5JZGVudGlmaWVyO1xuICAgICAgICB9IGVsc2UgaWYgKGlzS2V5d29yZChpZCkpIHtcbiAgICAgICAgICAgIHR5cGUgPSBUb2tlbi5LZXl3b3JkO1xuICAgICAgICB9IGVsc2UgaWYgKGlkID09PSAnbnVsbCcpIHtcbiAgICAgICAgICAgIHR5cGUgPSBUb2tlbi5OdWxsTGl0ZXJhbDtcbiAgICAgICAgfSBlbHNlIGlmIChpZCA9PT0gJ3RydWUnIHx8IGlkID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICB0eXBlID0gVG9rZW4uQm9vbGVhbkxpdGVyYWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0eXBlID0gVG9rZW4uSWRlbnRpZmllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgdmFsdWU6IGlkLFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLy8gNy43IFB1bmN0dWF0b3JzXG5cbiAgICBmdW5jdGlvbiBzY2FuUHVuY3R1YXRvcigpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gaW5kZXgsXG4gICAgICAgICAgICBjb2RlID0gc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpLFxuICAgICAgICAgICAgY29kZTIsXG4gICAgICAgICAgICBjaDEgPSBzb3VyY2VbaW5kZXhdLFxuICAgICAgICAgICAgY2gyLFxuICAgICAgICAgICAgY2gzLFxuICAgICAgICAgICAgY2g0O1xuXG4gICAgICAgIHN3aXRjaCAoY29kZSkge1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBtb3N0IGNvbW1vbiBzaW5nbGUtY2hhcmFjdGVyIHB1bmN0dWF0b3JzLlxuICAgICAgICBjYXNlIDB4MkU6ICAvLyAuIGRvdFxuICAgICAgICBjYXNlIDB4Mjg6ICAvLyAoIG9wZW4gYnJhY2tldFxuICAgICAgICBjYXNlIDB4Mjk6ICAvLyApIGNsb3NlIGJyYWNrZXRcbiAgICAgICAgY2FzZSAweDNCOiAgLy8gOyBzZW1pY29sb25cbiAgICAgICAgY2FzZSAweDJDOiAgLy8gLCBjb21tYVxuICAgICAgICBjYXNlIDB4N0I6ICAvLyB7IG9wZW4gY3VybHkgYnJhY2VcbiAgICAgICAgY2FzZSAweDdEOiAgLy8gfSBjbG9zZSBjdXJseSBicmFjZVxuICAgICAgICBjYXNlIDB4NUI6ICAvLyBbXG4gICAgICAgIGNhc2UgMHg1RDogIC8vIF1cbiAgICAgICAgY2FzZSAweDNBOiAgLy8gOlxuICAgICAgICBjYXNlIDB4M0Y6ICAvLyA/XG4gICAgICAgIGNhc2UgMHg3RTogIC8vIH5cbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICBpZiAoZXh0cmEudG9rZW5pemUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PT0gMHgyOCkge1xuICAgICAgICAgICAgICAgICAgICBleHRyYS5vcGVuUGFyZW5Ub2tlbiA9IGV4dHJhLnRva2Vucy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb2RlID09PSAweDdCKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4dHJhLm9wZW5DdXJseVRva2VuID0gZXh0cmEudG9rZW5zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFRva2VuLlB1bmN0dWF0b3IsXG4gICAgICAgICAgICAgICAgdmFsdWU6IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSksXG4gICAgICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29kZTIgPSBzb3VyY2UuY2hhckNvZGVBdChpbmRleCArIDEpO1xuXG4gICAgICAgICAgICAvLyAnPScgKFUrMDAzRCkgbWFya3MgYW4gYXNzaWdubWVudCBvciBjb21wYXJpc29uIG9wZXJhdG9yLlxuICAgICAgICAgICAgaWYgKGNvZGUyID09PSAweDNEKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAweDJCOiAgLy8gK1xuICAgICAgICAgICAgICAgIGNhc2UgMHgyRDogIC8vIC1cbiAgICAgICAgICAgICAgICBjYXNlIDB4MkY6ICAvLyAvXG4gICAgICAgICAgICAgICAgY2FzZSAweDNDOiAgLy8gPFxuICAgICAgICAgICAgICAgIGNhc2UgMHgzRTogIC8vID5cbiAgICAgICAgICAgICAgICBjYXNlIDB4NUU6ICAvLyBeXG4gICAgICAgICAgICAgICAgY2FzZSAweDdDOiAgLy8gfFxuICAgICAgICAgICAgICAgIGNhc2UgMHgyNTogIC8vICVcbiAgICAgICAgICAgICAgICBjYXNlIDB4MjY6ICAvLyAmXG4gICAgICAgICAgICAgICAgY2FzZSAweDJBOiAgLy8gKlxuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogVG9rZW4uUHVuY3R1YXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpICsgU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlMiksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGluZGV4XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjYXNlIDB4MjE6IC8vICFcbiAgICAgICAgICAgICAgICBjYXNlIDB4M0Q6IC8vID1cbiAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gMjtcblxuICAgICAgICAgICAgICAgICAgICAvLyAhPT0gYW5kID09PVxuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpID09PSAweDNEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBUb2tlbi5QdW5jdHVhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNvdXJjZS5zbGljZShzdGFydCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDQtY2hhcmFjdGVyIHB1bmN0dWF0b3I6ID4+Pj1cblxuICAgICAgICBjaDQgPSBzb3VyY2Uuc3Vic3RyKGluZGV4LCA0KTtcblxuICAgICAgICBpZiAoY2g0ID09PSAnPj4+PScpIHtcbiAgICAgICAgICAgIGluZGV4ICs9IDQ7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFRva2VuLlB1bmN0dWF0b3IsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNoNCxcbiAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IGluZGV4XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMy1jaGFyYWN0ZXIgcHVuY3R1YXRvcnM6ID09PSAhPT0gPj4+IDw8PSA+Pj1cblxuICAgICAgICBjaDMgPSBjaDQuc3Vic3RyKDAsIDMpO1xuXG4gICAgICAgIGlmIChjaDMgPT09ICc+Pj4nIHx8IGNoMyA9PT0gJzw8PScgfHwgY2gzID09PSAnPj49Jykge1xuICAgICAgICAgICAgaW5kZXggKz0gMztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogVG9rZW4uUHVuY3R1YXRvcixcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2gzLFxuICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlciAyLWNoYXJhY3RlciBwdW5jdHVhdG9yczogKysgLS0gPDwgPj4gJiYgfHxcbiAgICAgICAgY2gyID0gY2gzLnN1YnN0cigwLCAyKTtcblxuICAgICAgICBpZiAoKGNoMSA9PT0gY2gyWzFdICYmICgnKy08PiZ8Jy5pbmRleE9mKGNoMSkgPj0gMCkpIHx8IGNoMiA9PT0gJz0+Jykge1xuICAgICAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogVG9rZW4uUHVuY3R1YXRvcixcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2gyLFxuICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLWNoYXJhY3RlciBwdW5jdHVhdG9yczogPCA+ID0gISArIC0gKiAlICYgfCBeIC9cbiAgICAgICAgaWYgKCc8Pj0hKy0qJSZ8Xi8nLmluZGV4T2YoY2gxKSA+PSAwKSB7XG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBUb2tlbi5QdW5jdHVhdG9yLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBjaDEsXG4gICAgICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICB9XG5cbiAgICAvLyA3LjguMyBOdW1lcmljIExpdGVyYWxzXG5cbiAgICBmdW5jdGlvbiBzY2FuSGV4TGl0ZXJhbChzdGFydCkge1xuICAgICAgICB2YXIgbnVtYmVyID0gJyc7XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIWlzSGV4RGlnaXQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bWJlciArPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVtYmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCAnSUxMRUdBTCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBUb2tlbi5OdW1lcmljTGl0ZXJhbCxcbiAgICAgICAgICAgIHZhbHVlOiBwYXJzZUludCgnMHgnICsgbnVtYmVyLCAxNiksXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGluZGV4XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2Nhbk9jdGFsTGl0ZXJhbChzdGFydCkge1xuICAgICAgICB2YXIgbnVtYmVyID0gJzAnICsgc291cmNlW2luZGV4KytdO1xuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghaXNPY3RhbERpZ2l0KHNvdXJjZVtpbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBudW1iZXIgKz0gc291cmNlW2luZGV4KytdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkgfHwgaXNEZWNpbWFsRGlnaXQoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCAnSUxMRUdBTCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IFRva2VuLk51bWVyaWNMaXRlcmFsLFxuICAgICAgICAgICAgdmFsdWU6IHBhcnNlSW50KG51bWJlciwgOCksXG4gICAgICAgICAgICBvY3RhbDogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuTnVtZXJpY0xpdGVyYWwoKSB7XG4gICAgICAgIHZhciBudW1iZXIsIHN0YXJ0LCBjaDtcblxuICAgICAgICBjaCA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgIGFzc2VydChpc0RlY2ltYWxEaWdpdChjaC5jaGFyQ29kZUF0KDApKSB8fCAoY2ggPT09ICcuJyksXG4gICAgICAgICAgICAnTnVtZXJpYyBsaXRlcmFsIG11c3Qgc3RhcnQgd2l0aCBhIGRlY2ltYWwgZGlnaXQgb3IgYSBkZWNpbWFsIHBvaW50Jyk7XG5cbiAgICAgICAgc3RhcnQgPSBpbmRleDtcbiAgICAgICAgbnVtYmVyID0gJyc7XG4gICAgICAgIGlmIChjaCAhPT0gJy4nKSB7XG4gICAgICAgICAgICBudW1iZXIgPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICBjaCA9IHNvdXJjZVtpbmRleF07XG5cbiAgICAgICAgICAgIC8vIEhleCBudW1iZXIgc3RhcnRzIHdpdGggJzB4Jy5cbiAgICAgICAgICAgIC8vIE9jdGFsIG51bWJlciBzdGFydHMgd2l0aCAnMCcuXG4gICAgICAgICAgICBpZiAobnVtYmVyID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICd4JyB8fCBjaCA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2FuSGV4TGl0ZXJhbChzdGFydCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc09jdGFsRGlnaXQoY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2FuT2N0YWxMaXRlcmFsKHN0YXJ0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkZWNpbWFsIG51bWJlciBzdGFydHMgd2l0aCAnMCcgc3VjaCBhcyAnMDknIGlzIGlsbGVnYWwuXG4gICAgICAgICAgICAgICAgaWYgKGNoICYmIGlzRGVjaW1hbERpZ2l0KGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChpc0RlY2ltYWxEaWdpdChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBudW1iZXIgKz0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgd2hpbGUgKGlzRGVjaW1hbERpZ2l0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICBudW1iZXIgKz0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoID09PSAnZScgfHwgY2ggPT09ICdFJykge1xuICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcblxuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnKycgfHwgY2ggPT09ICctJykge1xuICAgICAgICAgICAgICAgIG51bWJlciArPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNEZWNpbWFsRGlnaXQoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChpc0RlY2ltYWxEaWdpdChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlciArPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKHt9LCBNZXNzYWdlcy5VbmV4cGVjdGVkVG9rZW4sICdJTExFR0FMJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCAnSUxMRUdBTCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IFRva2VuLk51bWVyaWNMaXRlcmFsLFxuICAgICAgICAgICAgdmFsdWU6IHBhcnNlRmxvYXQobnVtYmVyKSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyA3LjguNCBTdHJpbmcgTGl0ZXJhbHNcblxuICAgIGZ1bmN0aW9uIHNjYW5TdHJpbmdMaXRlcmFsKCkge1xuICAgICAgICB2YXIgc3RyID0gJycsIHF1b3RlLCBzdGFydCwgY2gsIGNvZGUsIHVuZXNjYXBlZCwgcmVzdG9yZSwgb2N0YWwgPSBmYWxzZSwgc3RhcnRMaW5lTnVtYmVyLCBzdGFydExpbmVTdGFydDtcbiAgICAgICAgc3RhcnRMaW5lTnVtYmVyID0gbGluZU51bWJlcjtcbiAgICAgICAgc3RhcnRMaW5lU3RhcnQgPSBsaW5lU3RhcnQ7XG5cbiAgICAgICAgcXVvdGUgPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICBhc3NlcnQoKHF1b3RlID09PSAnXFwnJyB8fCBxdW90ZSA9PT0gJ1wiJyksXG4gICAgICAgICAgICAnU3RyaW5nIGxpdGVyYWwgbXVzdCBzdGFydHMgd2l0aCBhIHF1b3RlJyk7XG5cbiAgICAgICAgc3RhcnQgPSBpbmRleDtcbiAgICAgICAgKytpbmRleDtcblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4KytdO1xuXG4gICAgICAgICAgICBpZiAoY2ggPT09IHF1b3RlKSB7XG4gICAgICAgICAgICAgICAgcXVvdGUgPSAnJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgICAgIGlmICghY2ggfHwgIWlzTGluZVRlcm1pbmF0b3IoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0b3JlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmVzY2FwZWQgPSBzY2FuSGV4RXNjYXBlKGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bmVzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gdW5lc2NhcGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHJlc3RvcmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHInO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXGInO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXGYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHgwQic7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2N0YWxEaWdpdChjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID0gJzAxMjM0NTY3Jy5pbmRleE9mKGNoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFxcMCBpcyBub3Qgb2N0YWwgZXNjYXBlIHNlcXVlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAmJiBpc09jdGFsRGlnaXQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZSAqIDggKyAnMDEyMzQ1NjcnLmluZGV4T2Yoc291cmNlW2luZGV4KytdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAzIGRpZ2l0cyBhcmUgb25seSBhbGxvd2VkIHdoZW4gc3RyaW5nIHN0YXJ0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIDAsIDEsIDIsIDNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCcwMTIzJy5pbmRleE9mKGNoKSA+PSAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPCBsZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09jdGFsRGlnaXQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlICogOCArICcwMTIzNDU2NycuaW5kZXhPZihzb3VyY2VbaW5kZXgrK10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICsrbGluZU51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoID09PSAgJ1xccicgJiYgc291cmNlW2luZGV4XSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGluZVN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0ciArPSBjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChxdW90ZSAhPT0gJycpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBUb2tlbi5TdHJpbmdMaXRlcmFsLFxuICAgICAgICAgICAgdmFsdWU6IHN0cixcbiAgICAgICAgICAgIG9jdGFsOiBvY3RhbCxcbiAgICAgICAgICAgIHN0YXJ0TGluZU51bWJlcjogc3RhcnRMaW5lTnVtYmVyLFxuICAgICAgICAgICAgc3RhcnRMaW5lU3RhcnQ6IHN0YXJ0TGluZVN0YXJ0LFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RSZWdFeHAocGF0dGVybiwgZmxhZ3MpIHtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXcgUmVnRXhwKHBhdHRlcm4sIGZsYWdzKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuSW52YWxpZFJlZ0V4cCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5SZWdFeHBCb2R5KCkge1xuICAgICAgICB2YXIgY2gsIHN0ciwgY2xhc3NNYXJrZXIsIHRlcm1pbmF0ZWQsIGJvZHk7XG5cbiAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICBhc3NlcnQoY2ggPT09ICcvJywgJ1JlZ3VsYXIgZXhwcmVzc2lvbiBsaXRlcmFsIG11c3Qgc3RhcnQgd2l0aCBhIHNsYXNoJyk7XG4gICAgICAgIHN0ciA9IHNvdXJjZVtpbmRleCsrXTtcblxuICAgICAgICBjbGFzc01hcmtlciA9IGZhbHNlO1xuICAgICAgICB0ZXJtaW5hdGVkID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgICAgICBpZiAoY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgICAgIC8vIEVDTUEtMjYyIDcuOC41XG4gICAgICAgICAgICAgICAgaWYgKGlzTGluZVRlcm1pbmF0b3IoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW50ZXJtaW5hdGVkUmVnRXhwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyICs9IGNoO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuVW50ZXJtaW5hdGVkUmVnRXhwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xhc3NNYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICddJykge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc01hcmtlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVybWluYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICdbJykge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc01hcmtlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0ZXJtaW5hdGVkKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHt9LCBNZXNzYWdlcy5VbnRlcm1pbmF0ZWRSZWdFeHApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhjbHVkZSBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaC5cbiAgICAgICAgYm9keSA9IHN0ci5zdWJzdHIoMSwgc3RyLmxlbmd0aCAtIDIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IGJvZHksXG4gICAgICAgICAgICBsaXRlcmFsOiBzdHJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuUmVnRXhwRmxhZ3MoKSB7XG4gICAgICAgIHZhciBjaCwgc3RyLCBmbGFncywgcmVzdG9yZTtcblxuICAgICAgICBzdHIgPSAnJztcbiAgICAgICAgZmxhZ3MgPSAnJztcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICBpZiAoIWlzSWRlbnRpZmllclBhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xcXFwnICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ3UnKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RvcmUgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBzY2FuSGV4RXNjYXBlKCd1Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3MgKz0gY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHN0ciArPSAnXFxcXHUnOyByZXN0b3JlIDwgaW5kZXg7ICsrcmVzdG9yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBzb3VyY2VbcmVzdG9yZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHJlc3RvcmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFncyArPSAndSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFx1JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgJ0lMTEVHQUwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZsYWdzICs9IGNoO1xuICAgICAgICAgICAgICAgIHN0ciArPSBjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogZmxhZ3MsXG4gICAgICAgICAgICBsaXRlcmFsOiBzdHJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuUmVnRXhwKCkge1xuICAgICAgICB2YXIgc3RhcnQsIGJvZHksIGZsYWdzLCBwYXR0ZXJuLCB2YWx1ZTtcblxuICAgICAgICBsb29rYWhlYWQgPSBudWxsO1xuICAgICAgICBza2lwQ29tbWVudCgpO1xuICAgICAgICBzdGFydCA9IGluZGV4O1xuXG4gICAgICAgIGJvZHkgPSBzY2FuUmVnRXhwQm9keSgpO1xuICAgICAgICBmbGFncyA9IHNjYW5SZWdFeHBGbGFncygpO1xuICAgICAgICB2YWx1ZSA9IHRlc3RSZWdFeHAoYm9keS52YWx1ZSwgZmxhZ3MudmFsdWUpO1xuXG4gICAgICAgIGlmIChleHRyYS50b2tlbml6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBUb2tlbi5SZWd1bGFyRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaXRlcmFsOiBib2R5LmxpdGVyYWwgKyBmbGFncy5saXRlcmFsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbGxlY3RSZWdleCgpIHtcbiAgICAgICAgdmFyIHBvcywgbG9jLCByZWdleCwgdG9rZW47XG5cbiAgICAgICAgc2tpcENvbW1lbnQoKTtcblxuICAgICAgICBwb3MgPSBpbmRleDtcbiAgICAgICAgbG9jID0ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW5kZXggLSBsaW5lU3RhcnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZWdleCA9IHNjYW5SZWdFeHAoKTtcbiAgICAgICAgbG9jLmVuZCA9IHtcbiAgICAgICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKCFleHRyYS50b2tlbml6ZSkge1xuICAgICAgICAgICAgLy8gUG9wIHRoZSBwcmV2aW91cyB0b2tlbiwgd2hpY2ggaXMgbGlrZWx5ICcvJyBvciAnLz0nXG4gICAgICAgICAgICBpZiAoZXh0cmEudG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGV4dHJhLnRva2Vuc1tleHRyYS50b2tlbnMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnJhbmdlWzBdID09PSBwb3MgJiYgdG9rZW4udHlwZSA9PT0gJ1B1bmN0dWF0b3InKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJy8nIHx8IHRva2VuLnZhbHVlID09PSAnLz0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYS50b2tlbnMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4dHJhLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUmVndWxhckV4cHJlc3Npb24nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWdleC5saXRlcmFsLFxuICAgICAgICAgICAgICAgIHJhbmdlOiBbcG9zLCBpbmRleF0sXG4gICAgICAgICAgICAgICAgbG9jOiBsb2NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzSWRlbnRpZmllck5hbWUodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIHRva2VuLnR5cGUgPT09IFRva2VuLklkZW50aWZpZXIgfHxcbiAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IFRva2VuLktleXdvcmQgfHxcbiAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IFRva2VuLkJvb2xlYW5MaXRlcmFsIHx8XG4gICAgICAgICAgICB0b2tlbi50eXBlID09PSBUb2tlbi5OdWxsTGl0ZXJhbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZHZhbmNlU2xhc2goKSB7XG4gICAgICAgIHZhciBwcmV2VG9rZW4sXG4gICAgICAgICAgICBjaGVja1Rva2VuO1xuICAgICAgICAvLyBVc2luZyB0aGUgZm9sbG93aW5nIGFsZ29yaXRobTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc3dlZXQuanMvd2lraS9kZXNpZ25cbiAgICAgICAgcHJldlRva2VuID0gZXh0cmEudG9rZW5zW2V4dHJhLnRva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKCFwcmV2VG9rZW4pIHtcbiAgICAgICAgICAgIC8vIE5vdGhpbmcgYmVmb3JlIHRoYXQ6IGl0IGNhbm5vdCBiZSBhIGRpdmlzaW9uLlxuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3RSZWdleCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmV2VG9rZW4udHlwZSA9PT0gJ1B1bmN0dWF0b3InKSB7XG4gICAgICAgICAgICBpZiAocHJldlRva2VuLnZhbHVlID09PSAnXScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NhblB1bmN0dWF0b3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmV2VG9rZW4udmFsdWUgPT09ICcpJykge1xuICAgICAgICAgICAgICAgIGNoZWNrVG9rZW4gPSBleHRyYS50b2tlbnNbZXh0cmEub3BlblBhcmVuVG9rZW4gLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tUb2tlbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tUb2tlbi50eXBlID09PSAnS2V5d29yZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChjaGVja1Rva2VuLnZhbHVlID09PSAnaWYnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tUb2tlbi52YWx1ZSA9PT0gJ3doaWxlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrVG9rZW4udmFsdWUgPT09ICdmb3InIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tUb2tlbi52YWx1ZSA9PT0gJ3dpdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdFJlZ2V4KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXZUb2tlbi52YWx1ZSA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgLy8gRGl2aWRpbmcgYSBmdW5jdGlvbiBieSBhbnl0aGluZyBtYWtlcyBsaXR0bGUgc2Vuc2UsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHdlIGhhdmUgdG8gY2hlY2sgZm9yIHRoYXQuXG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhLnRva2Vuc1tleHRyYS5vcGVuQ3VybHlUb2tlbiAtIDNdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYS50b2tlbnNbZXh0cmEub3BlbkN1cmx5VG9rZW4gLSAzXS50eXBlID09PSAnS2V5d29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQW5vbnltb3VzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICBjaGVja1Rva2VuID0gZXh0cmEudG9rZW5zW2V4dHJhLm9wZW5DdXJseVRva2VuIC0gNF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tUb2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4dHJhLnRva2Vuc1tleHRyYS5vcGVuQ3VybHlUb2tlbiAtIDRdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYS50b2tlbnNbZXh0cmEub3BlbkN1cmx5VG9rZW4gLSA0XS50eXBlID09PSAnS2V5d29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTmFtZWQgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrVG9rZW4gPSBleHRyYS50b2tlbnNbZXh0cmEub3BlbkN1cmx5VG9rZW4gLSA1XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdFJlZ2V4KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NhblB1bmN0dWF0b3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY2hlY2tUb2tlbiBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGlzXG4gICAgICAgICAgICAgICAgLy8gYSBkZWNsYXJhdGlvbiBvciBhbiBleHByZXNzaW9uLlxuICAgICAgICAgICAgICAgIGlmIChGbkV4cHJUb2tlbnMuaW5kZXhPZihjaGVja1Rva2VuLnZhbHVlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEl0IGlzIGFuIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJdCBpcyBhIGRlY2xhcmF0aW9uLlxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0UmVnZXgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0UmVnZXgoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldlRva2VuLnR5cGUgPT09ICdLZXl3b3JkJykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3RSZWdleCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkdmFuY2UoKSB7XG4gICAgICAgIHZhciBjaDtcblxuICAgICAgICBza2lwQ29tbWVudCgpO1xuXG4gICAgICAgIGlmIChpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogVG9rZW4uRU9GLFxuICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGluZGV4LFxuICAgICAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KTtcblxuICAgICAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQoY2gpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NhbklkZW50aWZpZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZlcnkgY29tbW9uOiAoIGFuZCApIGFuZCA7XG4gICAgICAgIGlmIChjaCA9PT0gMHgyOCB8fCBjaCA9PT0gMHgyOSB8fCBjaCA9PT0gMHgzQikge1xuICAgICAgICAgICAgcmV0dXJuIHNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdHJpbmcgbGl0ZXJhbCBzdGFydHMgd2l0aCBzaW5nbGUgcXVvdGUgKFUrMDAyNykgb3IgZG91YmxlIHF1b3RlIChVKzAwMjIpLlxuICAgICAgICBpZiAoY2ggPT09IDB4MjcgfHwgY2ggPT09IDB4MjIpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2FuU3RyaW5nTGl0ZXJhbCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBEb3QgKC4pIFUrMDAyRSBjYW4gYWxzbyBzdGFydCBhIGZsb2F0aW5nLXBvaW50IG51bWJlciwgaGVuY2UgdGhlIG5lZWRcbiAgICAgICAgLy8gdG8gY2hlY2sgdGhlIG5leHQgY2hhcmFjdGVyLlxuICAgICAgICBpZiAoY2ggPT09IDB4MkUpIHtcbiAgICAgICAgICAgIGlmIChpc0RlY2ltYWxEaWdpdChzb3VyY2UuY2hhckNvZGVBdChpbmRleCArIDEpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY2FuTnVtZXJpY0xpdGVyYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRGVjaW1hbERpZ2l0KGNoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjYW5OdW1lcmljTGl0ZXJhbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2xhc2ggKC8pIFUrMDAyRiBjYW4gYWxzbyBzdGFydCBhIHJlZ2V4LlxuICAgICAgICBpZiAoZXh0cmEudG9rZW5pemUgJiYgY2ggPT09IDB4MkYpIHtcbiAgICAgICAgICAgIHJldHVybiBhZHZhbmNlU2xhc2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbGxlY3RUb2tlbigpIHtcbiAgICAgICAgdmFyIGxvYywgdG9rZW4sIHJhbmdlLCB2YWx1ZTtcblxuICAgICAgICBza2lwQ29tbWVudCgpO1xuICAgICAgICBsb2MgPSB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbmRleCAtIGxpbmVTdGFydFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRva2VuID0gYWR2YW5jZSgpO1xuICAgICAgICBsb2MuZW5kID0ge1xuICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgIGNvbHVtbjogaW5kZXggLSBsaW5lU3RhcnRcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVG9rZW4uRU9GKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHNvdXJjZS5zbGljZSh0b2tlbi5zdGFydCwgdG9rZW4uZW5kKTtcbiAgICAgICAgICAgIGV4dHJhLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBUb2tlbk5hbWVbdG9rZW4udHlwZV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHJhbmdlOiBbdG9rZW4uc3RhcnQsIHRva2VuLmVuZF0sXG4gICAgICAgICAgICAgICAgbG9jOiBsb2NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHRva2VuO1xuXG4gICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICBpbmRleCA9IHRva2VuLmVuZDtcbiAgICAgICAgbGluZU51bWJlciA9IHRva2VuLmxpbmVOdW1iZXI7XG4gICAgICAgIGxpbmVTdGFydCA9IHRva2VuLmxpbmVTdGFydDtcblxuICAgICAgICBsb29rYWhlYWQgPSAodHlwZW9mIGV4dHJhLnRva2VucyAhPT0gJ3VuZGVmaW5lZCcpID8gY29sbGVjdFRva2VuKCkgOiBhZHZhbmNlKCk7XG5cbiAgICAgICAgaW5kZXggPSB0b2tlbi5lbmQ7XG4gICAgICAgIGxpbmVOdW1iZXIgPSB0b2tlbi5saW5lTnVtYmVyO1xuICAgICAgICBsaW5lU3RhcnQgPSB0b2tlbi5saW5lU3RhcnQ7XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZWsoKSB7XG4gICAgICAgIHZhciBwb3MsIGxpbmUsIHN0YXJ0O1xuXG4gICAgICAgIHBvcyA9IGluZGV4O1xuICAgICAgICBsaW5lID0gbGluZU51bWJlcjtcbiAgICAgICAgc3RhcnQgPSBsaW5lU3RhcnQ7XG4gICAgICAgIGxvb2thaGVhZCA9ICh0eXBlb2YgZXh0cmEudG9rZW5zICE9PSAndW5kZWZpbmVkJykgPyBjb2xsZWN0VG9rZW4oKSA6IGFkdmFuY2UoKTtcbiAgICAgICAgaW5kZXggPSBwb3M7XG4gICAgICAgIGxpbmVOdW1iZXIgPSBsaW5lO1xuICAgICAgICBsaW5lU3RhcnQgPSBzdGFydDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBQb3NpdGlvbihsaW5lLCBjb2x1bW4pIHtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gU291cmNlTG9jYXRpb24oc3RhcnRMaW5lLCBzdGFydENvbHVtbiwgbGluZSwgY29sdW1uKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBuZXcgUG9zaXRpb24oc3RhcnRMaW5lLCBzdGFydENvbHVtbik7XG4gICAgICAgIHRoaXMuZW5kID0gbmV3IFBvc2l0aW9uKGxpbmUsIGNvbHVtbik7XG4gICAgfVxuXG4gICAgU3ludGF4VHJlZURlbGVnYXRlID0ge1xuXG4gICAgICAgIG5hbWU6ICdTeW50YXhUcmVlJyxcblxuICAgICAgICBwcm9jZXNzQ29tbWVudDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBsYXN0Q2hpbGQsIHRyYWlsaW5nQ29tbWVudHM7XG5cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09IFN5bnRheC5Qcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuYm9keS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHRyYS50cmFpbGluZ0NvbW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmEudHJhaWxpbmdDb21tZW50c1swXS5yYW5nZVswXSA+PSBub2RlLnJhbmdlWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWlsaW5nQ29tbWVudHMgPSBleHRyYS50cmFpbGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBleHRyYS50cmFpbGluZ0NvbW1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0cmEudHJhaWxpbmdDb21tZW50cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2subGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmEuYm90dG9tUmlnaHRTdGFja1tleHRyYS5ib3R0b21SaWdodFN0YWNrLmxlbmd0aCAtIDFdLnRyYWlsaW5nQ29tbWVudHMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2tbZXh0cmEuYm90dG9tUmlnaHRTdGFjay5sZW5ndGggLSAxXS50cmFpbGluZ0NvbW1lbnRzWzBdLnJhbmdlWzBdID49IG5vZGUucmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhaWxpbmdDb21tZW50cyA9IGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2tbZXh0cmEuYm90dG9tUmlnaHRTdGFjay5sZW5ndGggLSAxXS50cmFpbGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXh0cmEuYm90dG9tUmlnaHRTdGFja1tleHRyYS5ib3R0b21SaWdodFN0YWNrLmxlbmd0aCAtIDFdLnRyYWlsaW5nQ29tbWVudHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFYXRpbmcgdGhlIHN0YWNrLlxuICAgICAgICAgICAgd2hpbGUgKGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2subGVuZ3RoID4gMCAmJiBleHRyYS5ib3R0b21SaWdodFN0YWNrW2V4dHJhLmJvdHRvbVJpZ2h0U3RhY2subGVuZ3RoIC0gMV0ucmFuZ2VbMF0gPj0gbm9kZS5yYW5nZVswXSkge1xuICAgICAgICAgICAgICAgIGxhc3RDaGlsZCA9IGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2sucG9wKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsYXN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdENoaWxkLmxlYWRpbmdDb21tZW50cyAmJiBsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzW2xhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHMubGVuZ3RoIC0gMV0ucmFuZ2VbMV0gPD0gbm9kZS5yYW5nZVswXSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmxlYWRpbmdDb21tZW50cyA9IGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHM7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXh0cmEubGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA+IDAgJiYgZXh0cmEubGVhZGluZ0NvbW1lbnRzW2V4dHJhLmxlYWRpbmdDb21tZW50cy5sZW5ndGggLSAxXS5yYW5nZVsxXSA8PSBub2RlLnJhbmdlWzBdKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5sZWFkaW5nQ29tbWVudHMgPSBleHRyYS5sZWFkaW5nQ29tbWVudHM7XG4gICAgICAgICAgICAgICAgZXh0cmEubGVhZGluZ0NvbW1lbnRzID0gW107XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHRyYWlsaW5nQ29tbWVudHMpIHtcbiAgICAgICAgICAgICAgICBub2RlLnRyYWlsaW5nQ29tbWVudHMgPSB0cmFpbGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleHRyYS5ib3R0b21SaWdodFN0YWNrLnB1c2gobm9kZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFya0VuZDogZnVuY3Rpb24gKG5vZGUsIHN0YXJ0VG9rZW4pIHtcbiAgICAgICAgICAgIGlmIChleHRyYS5yYW5nZSkge1xuICAgICAgICAgICAgICAgIG5vZGUucmFuZ2UgPSBbc3RhcnRUb2tlbi5zdGFydCwgaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4dHJhLmxvYykge1xuICAgICAgICAgICAgICAgIG5vZGUubG9jID0gbmV3IFNvdXJjZUxvY2F0aW9uKFxuICAgICAgICAgICAgICAgICAgICBzdGFydFRva2VuLnN0YXJ0TGluZU51bWJlciA9PT0gdW5kZWZpbmVkID8gIHN0YXJ0VG9rZW4ubGluZU51bWJlciA6IHN0YXJ0VG9rZW4uc3RhcnRMaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBzdGFydFRva2VuLnN0YXJ0IC0gKHN0YXJ0VG9rZW4uc3RhcnRMaW5lU3RhcnQgPT09IHVuZGVmaW5lZCA/ICBzdGFydFRva2VuLmxpbmVTdGFydCA6IHN0YXJ0VG9rZW4uc3RhcnRMaW5lU3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBpbmRleCAtIGxpbmVTdGFydFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3N0UHJvY2Vzcyhub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4dHJhLmF0dGFjaENvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDb21tZW50KG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zdFByb2Nlc3M6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoZXh0cmEuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5sb2Muc291cmNlID0gZXh0cmEuc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlQXJyYXlFeHByZXNzaW9uOiBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkFycmF5RXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICBlbGVtZW50czogZWxlbWVudHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlQXNzaWdubWVudEV4cHJlc3Npb246IGZ1bmN0aW9uIChvcGVyYXRvciwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkFzc2lnbm1lbnRFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiByaWdodFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVCaW5hcnlFeHByZXNzaW9uOiBmdW5jdGlvbiAob3BlcmF0b3IsIGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IChvcGVyYXRvciA9PT0gJ3x8JyB8fCBvcGVyYXRvciA9PT0gJyYmJykgPyBTeW50YXguTG9naWNhbEV4cHJlc3Npb24gOlxuICAgICAgICAgICAgICAgICAgICAgICAgU3ludGF4LkJpbmFyeUV4cHJlc3Npb247XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJpZ2h0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUJsb2NrU3RhdGVtZW50OiBmdW5jdGlvbiAoYm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguQmxvY2tTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgYm9keTogYm9keVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVCcmVha1N0YXRlbWVudDogZnVuY3Rpb24gKGxhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5CcmVha1N0YXRlbWVudCxcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFiZWxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlQ2FsbEV4cHJlc3Npb246IGZ1bmN0aW9uIChjYWxsZWUsIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkNhbGxFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIGNhbGxlZTogY2FsbGVlLFxuICAgICAgICAgICAgICAgICdhcmd1bWVudHMnOiBhcmdzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUNhdGNoQ2xhdXNlOiBmdW5jdGlvbiAocGFyYW0sIGJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkNhdGNoQ2xhdXNlLFxuICAgICAgICAgICAgICAgIHBhcmFtOiBwYXJhbSxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUNvbmRpdGlvbmFsRXhwcmVzc2lvbjogZnVuY3Rpb24gKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3QsXG4gICAgICAgICAgICAgICAgY29uc2VxdWVudDogY29uc2VxdWVudCxcbiAgICAgICAgICAgICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVDb250aW51ZVN0YXRlbWVudDogZnVuY3Rpb24gKGxhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5Db250aW51ZVN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFiZWxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlRGVidWdnZXJTdGF0ZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkRlYnVnZ2VyU3RhdGVtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZURvV2hpbGVTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChib2R5LCB0ZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5Eb1doaWxlU3RhdGVtZW50LFxuICAgICAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVFbXB0eVN0YXRlbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguRW1wdHlTdGF0ZW1lbnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudDogZnVuY3Rpb24gKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogZXhwcmVzc2lvblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVGb3JTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChpbml0LCB0ZXN0LCB1cGRhdGUsIGJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LkZvclN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICBpbml0OiBpbml0LFxuICAgICAgICAgICAgICAgIHRlc3Q6IHRlc3QsXG4gICAgICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgICAgICAgYm9keTogYm9keVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVGb3JJblN0YXRlbWVudDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5Gb3JJblN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiByaWdodCxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICAgICAgICAgIGVhY2g6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUZ1bmN0aW9uRGVjbGFyYXRpb246IGZ1bmN0aW9uIChpZCwgcGFyYW1zLCBkZWZhdWx0cywgYm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguRnVuY3Rpb25EZWNsYXJhdGlvbixcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IGRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICAgICAgcmVzdDogbnVsbCxcbiAgICAgICAgICAgICAgICBnZW5lcmF0b3I6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUZ1bmN0aW9uRXhwcmVzc2lvbjogZnVuY3Rpb24gKGlkLCBwYXJhbXMsIGRlZmF1bHRzLCBib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5GdW5jdGlvbkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBkZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICAgICAgICAgIHJlc3Q6IG51bGwsXG4gICAgICAgICAgICAgICAgZ2VuZXJhdG9yOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVJZGVudGlmaWVyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUlmU3RhdGVtZW50OiBmdW5jdGlvbiAodGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5JZlN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0LFxuICAgICAgICAgICAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnQsXG4gICAgICAgICAgICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlTGFiZWxlZFN0YXRlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5MYWJlbGVkU3RhdGVtZW50LFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUxpdGVyYWw6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguTGl0ZXJhbCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdG9rZW4udmFsdWUsXG4gICAgICAgICAgICAgICAgcmF3OiBzb3VyY2Uuc2xpY2UodG9rZW4uc3RhcnQsIHRva2VuLmVuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlTWVtYmVyRXhwcmVzc2lvbjogZnVuY3Rpb24gKGFjY2Vzc29yLCBvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5NZW1iZXJFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIGNvbXB1dGVkOiBhY2Nlc3NvciA9PT0gJ1snLFxuICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVOZXdFeHByZXNzaW9uOiBmdW5jdGlvbiAoY2FsbGVlLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5OZXdFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIGNhbGxlZTogY2FsbGVlLFxuICAgICAgICAgICAgICAgICdhcmd1bWVudHMnOiBhcmdzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZU9iamVjdEV4cHJlc3Npb246IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5PYmplY3RFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlUG9zdGZpeEV4cHJlc3Npb246IGZ1bmN0aW9uIChvcGVyYXRvciwgYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LlVwZGF0ZUV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIGFyZ3VtZW50OiBhcmd1bWVudCxcbiAgICAgICAgICAgICAgICBwcmVmaXg6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVByb2dyYW06IGZ1bmN0aW9uIChib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5Qcm9ncmFtLFxuICAgICAgICAgICAgICAgIGJvZHk6IGJvZHlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlUHJvcGVydHk6IGZ1bmN0aW9uIChraW5kLCBrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN5bnRheC5Qcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAga2luZDoga2luZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVSZXR1cm5TdGF0ZW1lbnQ6IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguUmV0dXJuU3RhdGVtZW50LFxuICAgICAgICAgICAgICAgIGFyZ3VtZW50OiBhcmd1bWVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVTZXF1ZW5jZUV4cHJlc3Npb246IGZ1bmN0aW9uIChleHByZXNzaW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguU2VxdWVuY2VFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zOiBleHByZXNzaW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVTd2l0Y2hDYXNlOiBmdW5jdGlvbiAodGVzdCwgY29uc2VxdWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguU3dpdGNoQ2FzZSxcbiAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0LFxuICAgICAgICAgICAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlU3dpdGNoU3RhdGVtZW50OiBmdW5jdGlvbiAoZGlzY3JpbWluYW50LCBjYXNlcykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguU3dpdGNoU3RhdGVtZW50LFxuICAgICAgICAgICAgICAgIGRpc2NyaW1pbmFudDogZGlzY3JpbWluYW50LFxuICAgICAgICAgICAgICAgIGNhc2VzOiBjYXNlc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVUaGlzRXhwcmVzc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguVGhpc0V4cHJlc3Npb25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVGhyb3dTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguVGhyb3dTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgYXJndW1lbnQ6IGFyZ3VtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRyeVN0YXRlbWVudDogZnVuY3Rpb24gKGJsb2NrLCBndWFyZGVkSGFuZGxlcnMsIGhhbmRsZXJzLCBmaW5hbGl6ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LlRyeVN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICBibG9jazogYmxvY2ssXG4gICAgICAgICAgICAgICAgZ3VhcmRlZEhhbmRsZXJzOiBndWFyZGVkSGFuZGxlcnMsXG4gICAgICAgICAgICAgICAgaGFuZGxlcnM6IGhhbmRsZXJzLFxuICAgICAgICAgICAgICAgIGZpbmFsaXplcjogZmluYWxpemVyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVVuYXJ5RXhwcmVzc2lvbjogZnVuY3Rpb24gKG9wZXJhdG9yLCBhcmd1bWVudCkge1xuICAgICAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnKysnIHx8IG9wZXJhdG9yID09PSAnLS0nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LlVwZGF0ZUV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnQ6IGFyZ3VtZW50LFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6IHRydWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguVW5hcnlFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICBhcmd1bWVudDogYXJndW1lbnQsXG4gICAgICAgICAgICAgICAgcHJlZml4OiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb246IGZ1bmN0aW9uIChkZWNsYXJhdGlvbnMsIGtpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRpb24sXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zOiBkZWNsYXJhdGlvbnMsXG4gICAgICAgICAgICAgICAga2luZDoga2luZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVWYXJpYWJsZURlY2xhcmF0b3I6IGZ1bmN0aW9uIChpZCwgaW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguVmFyaWFibGVEZWNsYXJhdG9yLFxuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBpbml0OiBpbml0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVdoaWxlU3RhdGVtZW50OiBmdW5jdGlvbiAodGVzdCwgYm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTeW50YXguV2hpbGVTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgdGVzdDogdGVzdCxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVdpdGhTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChvYmplY3QsIGJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3ludGF4LldpdGhTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgICAgICAgYm9keTogYm9keVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGVyZSBpcyBhIGxpbmUgdGVybWluYXRvciBiZWZvcmUgdGhlIG5leHQgdG9rZW4uXG5cbiAgICBmdW5jdGlvbiBwZWVrTGluZVRlcm1pbmF0b3IoKSB7XG4gICAgICAgIHZhciBwb3MsIGxpbmUsIHN0YXJ0LCBmb3VuZDtcblxuICAgICAgICBwb3MgPSBpbmRleDtcbiAgICAgICAgbGluZSA9IGxpbmVOdW1iZXI7XG4gICAgICAgIHN0YXJ0ID0gbGluZVN0YXJ0O1xuICAgICAgICBza2lwQ29tbWVudCgpO1xuICAgICAgICBmb3VuZCA9IGxpbmVOdW1iZXIgIT09IGxpbmU7XG4gICAgICAgIGluZGV4ID0gcG9zO1xuICAgICAgICBsaW5lTnVtYmVyID0gbGluZTtcbiAgICAgICAgbGluZVN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH1cblxuICAgIC8vIFRocm93IGFuIGV4Y2VwdGlvblxuXG4gICAgZnVuY3Rpb24gdGhyb3dFcnJvcih0b2tlbiwgbWVzc2FnZUZvcm1hdCkge1xuICAgICAgICB2YXIgZXJyb3IsXG4gICAgICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgIG1zZyA9IG1lc3NhZ2VGb3JtYXQucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvJShcXGQpL2csXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHdob2xlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoaW5kZXggPCBhcmdzLmxlbmd0aCwgJ01lc3NhZ2UgcmVmZXJlbmNlIG11c3QgYmUgaW4gcmFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbi5saW5lTnVtYmVyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ0xpbmUgJyArIHRva2VuLmxpbmVOdW1iZXIgKyAnOiAnICsgbXNnKTtcbiAgICAgICAgICAgIGVycm9yLmluZGV4ID0gdG9rZW4uc3RhcnQ7XG4gICAgICAgICAgICBlcnJvci5saW5lTnVtYmVyID0gdG9rZW4ubGluZU51bWJlcjtcbiAgICAgICAgICAgIGVycm9yLmNvbHVtbiA9IHRva2VuLnN0YXJ0IC0gbGluZVN0YXJ0ICsgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdMaW5lICcgKyBsaW5lTnVtYmVyICsgJzogJyArIG1zZyk7XG4gICAgICAgICAgICBlcnJvci5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgZXJyb3IubGluZU51bWJlciA9IGxpbmVOdW1iZXI7XG4gICAgICAgICAgICBlcnJvci5jb2x1bW4gPSBpbmRleCAtIGxpbmVTdGFydCArIDE7XG4gICAgICAgIH1cblxuICAgICAgICBlcnJvci5kZXNjcmlwdGlvbiA9IG1zZztcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGhyb3dFcnJvclRvbGVyYW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhyb3dFcnJvci5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZXh0cmEuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgZXh0cmEuZXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIFRocm93IGFuIGV4Y2VwdGlvbiBiZWNhdXNlIG9mIHRoZSB0b2tlbi5cblxuICAgIGZ1bmN0aW9uIHRocm93VW5leHBlY3RlZCh0b2tlbikge1xuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uRU9GKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHRva2VuLCBNZXNzYWdlcy5VbmV4cGVjdGVkRU9TKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b2tlbi50eXBlID09PSBUb2tlbi5OdW1lcmljTGl0ZXJhbCkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih0b2tlbiwgTWVzc2FnZXMuVW5leHBlY3RlZE51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uU3RyaW5nTGl0ZXJhbCkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih0b2tlbiwgTWVzc2FnZXMuVW5leHBlY3RlZFN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih0b2tlbiwgTWVzc2FnZXMuVW5leHBlY3RlZElkZW50aWZpZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IFRva2VuLktleXdvcmQpIHtcbiAgICAgICAgICAgIGlmIChpc0Z1dHVyZVJlc2VydmVkV29yZCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKHRva2VuLCBNZXNzYWdlcy5VbmV4cGVjdGVkUmVzZXJ2ZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh0b2tlbiwgTWVzc2FnZXMuU3RyaWN0UmVzZXJ2ZWRXb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHRva2VuLCBNZXNzYWdlcy5VbmV4cGVjdGVkVG9rZW4sIHRva2VuLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJvb2xlYW5MaXRlcmFsLCBOdWxsTGl0ZXJhbCwgb3IgUHVuY3R1YXRvci5cbiAgICAgICAgdGhyb3dFcnJvcih0b2tlbiwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCB0b2tlbi52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gRXhwZWN0IHRoZSBuZXh0IHRva2VuIHRvIG1hdGNoIHRoZSBzcGVjaWZpZWQgcHVuY3R1YXRvci5cbiAgICAvLyBJZiBub3QsIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cblxuICAgIGZ1bmN0aW9uIGV4cGVjdCh2YWx1ZSkge1xuICAgICAgICB2YXIgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IFRva2VuLlB1bmN0dWF0b3IgfHwgdG9rZW4udmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWQodG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwZWN0IHRoZSBuZXh0IHRva2VuIHRvIG1hdGNoIHRoZSBzcGVjaWZpZWQga2V5d29yZC5cbiAgICAvLyBJZiBub3QsIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cblxuICAgIGZ1bmN0aW9uIGV4cGVjdEtleXdvcmQoa2V5d29yZCkge1xuICAgICAgICB2YXIgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IFRva2VuLktleXdvcmQgfHwgdG9rZW4udmFsdWUgIT09IGtleXdvcmQpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZCh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgbmV4dCB0b2tlbiBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgcHVuY3R1YXRvci5cblxuICAgIGZ1bmN0aW9uIG1hdGNoKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBsb29rYWhlYWQudHlwZSA9PT0gVG9rZW4uUHVuY3R1YXRvciAmJiBsb29rYWhlYWQudmFsdWUgPT09IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBrZXl3b3JkXG5cbiAgICBmdW5jdGlvbiBtYXRjaEtleXdvcmQoa2V5d29yZCkge1xuICAgICAgICByZXR1cm4gbG9va2FoZWFkLnR5cGUgPT09IFRva2VuLktleXdvcmQgJiYgbG9va2FoZWFkLnZhbHVlID09PSBrZXl3b3JkO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIGlzIGFuIGFzc2lnbm1lbnQgb3BlcmF0b3JcblxuICAgIGZ1bmN0aW9uIG1hdGNoQXNzaWduKCkge1xuICAgICAgICB2YXIgb3A7XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5QdW5jdHVhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgb3AgPSBsb29rYWhlYWQudmFsdWU7XG4gICAgICAgIHJldHVybiBvcCA9PT0gJz0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJyo9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICcvPScgfHxcbiAgICAgICAgICAgIG9wID09PSAnJT0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJys9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICctPScgfHxcbiAgICAgICAgICAgIG9wID09PSAnPDw9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICc+Pj0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJz4+Pj0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJyY9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICdePScgfHxcbiAgICAgICAgICAgIG9wID09PSAnfD0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN1bWVTZW1pY29sb24oKSB7XG4gICAgICAgIHZhciBsaW5lO1xuXG4gICAgICAgIC8vIENhdGNoIHRoZSB2ZXJ5IGNvbW1vbiBjYXNlIGZpcnN0OiBpbW1lZGlhdGVseSBhIHNlbWljb2xvbiAoVSswMDNCKS5cbiAgICAgICAgaWYgKHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSA9PT0gMHgzQiB8fCBtYXRjaCgnOycpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmUgPSBsaW5lTnVtYmVyO1xuICAgICAgICBza2lwQ29tbWVudCgpO1xuICAgICAgICBpZiAobGluZU51bWJlciAhPT0gbGluZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5FT0YgJiYgIW1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZChsb29rYWhlYWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRydWUgaWYgcHJvdmlkZWQgZXhwcmVzc2lvbiBpcyBMZWZ0SGFuZFNpZGVFeHByZXNzaW9uXG5cbiAgICBmdW5jdGlvbiBpc0xlZnRIYW5kU2lkZShleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyIHx8IGV4cHIudHlwZSA9PT0gU3ludGF4Lk1lbWJlckV4cHJlc3Npb247XG4gICAgfVxuXG4gICAgLy8gMTEuMS40IEFycmF5IEluaXRpYWxpc2VyXG5cbiAgICBmdW5jdGlvbiBwYXJzZUFycmF5SW5pdGlhbGlzZXIoKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdLCBzdGFydFRva2VuO1xuXG4gICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIGV4cGVjdCgnWycpO1xuXG4gICAgICAgIHdoaWxlICghbWF0Y2goJ10nKSkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCcsJykpIHtcbiAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24oKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoKCddJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KCcsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV4KCk7XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZGVsZWdhdGUuY3JlYXRlQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgLy8gMTEuMS41IE9iamVjdCBJbml0aWFsaXNlclxuXG4gICAgZnVuY3Rpb24gcGFyc2VQcm9wZXJ0eUZ1bmN0aW9uKHBhcmFtLCBmaXJzdCkge1xuICAgICAgICB2YXIgcHJldmlvdXNTdHJpY3QsIGJvZHksIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgcHJldmlvdXNTdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIGJvZHkgPSBwYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMoKTtcbiAgICAgICAgaWYgKGZpcnN0ICYmIHN0cmljdCAmJiBpc1Jlc3RyaWN0ZWRXb3JkKHBhcmFtWzBdLm5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoZmlyc3QsIE1lc3NhZ2VzLlN0cmljdFBhcmFtTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RyaWN0ID0gcHJldmlvdXNTdHJpY3Q7XG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUZ1bmN0aW9uRXhwcmVzc2lvbihudWxsLCBwYXJhbSwgW10sIGJvZHkpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdFByb3BlcnR5S2V5KCkge1xuICAgICAgICB2YXIgdG9rZW4sIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgdG9rZW4gPSBsZXgoKTtcblxuICAgICAgICAvLyBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbmx5IGZyb20gcGFyc2VPYmplY3RQcm9wZXJ0eSgpLCB3aGVyZVxuICAgICAgICAvLyBFT0YgYW5kIFB1bmN0dWF0b3IgdG9rZW5zIGFyZSBhbHJlYWR5IGZpbHRlcmVkIG91dC5cblxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uU3RyaW5nTGl0ZXJhbCB8fCB0b2tlbi50eXBlID09PSBUb2tlbi5OdW1lcmljTGl0ZXJhbCkge1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiB0b2tlbi5vY3RhbCkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh0b2tlbiwgTWVzc2FnZXMuU3RyaWN0T2N0YWxMaXRlcmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUxpdGVyYWwodG9rZW4pLCBzdGFydFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUlkZW50aWZpZXIodG9rZW4udmFsdWUpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdFByb3BlcnR5KCkge1xuICAgICAgICB2YXIgdG9rZW4sIGtleSwgaWQsIHZhbHVlLCBwYXJhbSwgc3RhcnRUb2tlbjtcblxuICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllcikge1xuXG4gICAgICAgICAgICBpZCA9IHBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcblxuICAgICAgICAgICAgLy8gUHJvcGVydHkgQXNzaWdubWVudDogR2V0dGVyIGFuZCBTZXR0ZXIuXG5cbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJ2dldCcgJiYgIW1hdGNoKCc6JykpIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBwYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcoJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcpJyk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZVByb3BlcnR5RnVuY3Rpb24oW10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZVByb3BlcnR5KCdnZXQnLCBrZXksIHZhbHVlKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT09ICdzZXQnICYmICFtYXRjaCgnOicpKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gcGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCgnKCcpO1xuICAgICAgICAgICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi50eXBlICE9PSBUb2tlbi5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdCgnKScpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQodG9rZW4sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgdG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlUHJvcGVydHlGdW5jdGlvbihbXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW0gPSBbIHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCkgXTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KCcpJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VQcm9wZXJ0eUZ1bmN0aW9uKHBhcmFtLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZVByb3BlcnR5KCdzZXQnLCBrZXksIHZhbHVlKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHBlY3QoJzonKTtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZGVsZWdhdGUuY3JlYXRlUHJvcGVydHkoJ2luaXQnLCBpZCwgdmFsdWUpLCBzdGFydFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uRU9GIHx8IHRva2VuLnR5cGUgPT09IFRva2VuLlB1bmN0dWF0b3IpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZCh0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrZXkgPSBwYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICAgICAgICBleHBlY3QoJzonKTtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZGVsZWdhdGUuY3JlYXRlUHJvcGVydHkoJ2luaXQnLCBrZXksIHZhbHVlKSwgc3RhcnRUb2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdEluaXRpYWxpc2VyKCkge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtdLCBwcm9wZXJ0eSwgbmFtZSwga2V5LCBraW5kLCBtYXAgPSB7fSwgdG9TdHJpbmcgPSBTdHJpbmcsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBleHBlY3QoJ3snKTtcblxuICAgICAgICB3aGlsZSAoIW1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgIHByb3BlcnR5ID0gcGFyc2VPYmplY3RQcm9wZXJ0eSgpO1xuXG4gICAgICAgICAgICBpZiAocHJvcGVydHkua2V5LnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHByb3BlcnR5LmtleS5uYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gdG9TdHJpbmcocHJvcGVydHkua2V5LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtpbmQgPSAocHJvcGVydHkua2luZCA9PT0gJ2luaXQnKSA/IFByb3BlcnR5S2luZC5EYXRhIDogKHByb3BlcnR5LmtpbmQgPT09ICdnZXQnKSA/IFByb3BlcnR5S2luZC5HZXQgOiBQcm9wZXJ0eUtpbmQuU2V0O1xuXG4gICAgICAgICAgICBrZXkgPSAnJCcgKyBuYW1lO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtYXAsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobWFwW2tleV0gPT09IFByb3BlcnR5S2luZC5EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgJiYga2luZCA9PT0gUHJvcGVydHlLaW5kLkRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh7fSwgTWVzc2FnZXMuU3RyaWN0RHVwbGljYXRlUHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtpbmQgIT09IFByb3BlcnR5S2luZC5EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLkFjY2Vzc29yRGF0YVByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChraW5kID09PSBQcm9wZXJ0eUtpbmQuRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvclRvbGVyYW50KHt9LCBNZXNzYWdlcy5BY2Nlc3NvckRhdGFQcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWFwW2tleV0gJiBraW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLkFjY2Vzc29yR2V0U2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBba2V5XSB8PSBraW5kO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXBba2V5XSA9IGtpbmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgIGlmICghbWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdCgnLCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0KCd9Jyk7XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZGVsZWdhdGUuY3JlYXRlT2JqZWN0RXhwcmVzc2lvbihwcm9wZXJ0aWVzKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgLy8gMTEuMS42IFRoZSBHcm91cGluZyBPcGVyYXRvclxuXG4gICAgZnVuY3Rpb24gcGFyc2VHcm91cEV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBleHByO1xuXG4gICAgICAgIGV4cGVjdCgnKCcpO1xuXG4gICAgICAgIGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cblxuICAgIC8vIDExLjEgUHJpbWFyeSBFeHByZXNzaW9uc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VQcmltYXJ5RXhwcmVzc2lvbigpIHtcbiAgICAgICAgdmFyIHR5cGUsIHRva2VuLCBleHByLCBzdGFydFRva2VuO1xuXG4gICAgICAgIGlmIChtYXRjaCgnKCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VHcm91cEV4cHJlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VBcnJheUluaXRpYWxpc2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2goJ3snKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlT2JqZWN0SW5pdGlhbGlzZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGUgPSBsb29rYWhlYWQudHlwZTtcbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBpZiAodHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgZXhwciA9ICBkZWxlZ2F0ZS5jcmVhdGVJZGVudGlmaWVyKGxleCgpLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBUb2tlbi5TdHJpbmdMaXRlcmFsIHx8IHR5cGUgPT09IFRva2VuLk51bWVyaWNMaXRlcmFsKSB7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGxvb2thaGVhZC5vY3RhbCkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudChsb29rYWhlYWQsIE1lc3NhZ2VzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByID0gZGVsZWdhdGUuY3JlYXRlTGl0ZXJhbChsZXgoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVG9rZW4uS2V5d29yZCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoS2V5d29yZCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZ1bmN0aW9uRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoS2V5d29yZCgndGhpcycpKSB7XG4gICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZVRoaXNFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZChsZXgoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVG9rZW4uQm9vbGVhbkxpdGVyYWwpIHtcbiAgICAgICAgICAgIHRva2VuID0gbGV4KCk7XG4gICAgICAgICAgICB0b2tlbi52YWx1ZSA9ICh0b2tlbi52YWx1ZSA9PT0gJ3RydWUnKTtcbiAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVMaXRlcmFsKHRva2VuKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBUb2tlbi5OdWxsTGl0ZXJhbCkge1xuICAgICAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgICAgIHRva2VuLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVMaXRlcmFsKHRva2VuKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnLycpIHx8IG1hdGNoKCcvPScpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dHJhLnRva2VucyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBleHByID0gZGVsZWdhdGUuY3JlYXRlTGl0ZXJhbChjb2xsZWN0UmVnZXgoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVMaXRlcmFsKHNjYW5SZWdFeHAoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwZWVrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWQobGV4KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZXhwciwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgLy8gMTEuMiBMZWZ0LUhhbmQtU2lkZSBFeHByZXNzaW9uc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VBcmd1bWVudHMoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgICAgZXhwZWN0KCcoJyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2gocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2goJyknKSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICByZXR1cm4gYXJncztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU5vbkNvbXB1dGVkUHJvcGVydHkoKSB7XG4gICAgICAgIHZhciB0b2tlbiwgc3RhcnRUb2tlbjtcblxuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICB0b2tlbiA9IGxleCgpO1xuXG4gICAgICAgIGlmICghaXNJZGVudGlmaWVyTmFtZSh0b2tlbikpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZCh0b2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVJZGVudGlmaWVyKHRva2VuLnZhbHVlKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VOb25Db21wdXRlZE1lbWJlcigpIHtcbiAgICAgICAgZXhwZWN0KCcuJyk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlTm9uQ29tcHV0ZWRQcm9wZXJ0eSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlQ29tcHV0ZWRNZW1iZXIoKSB7XG4gICAgICAgIHZhciBleHByO1xuXG4gICAgICAgIGV4cGVjdCgnWycpO1xuXG4gICAgICAgIGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJ10nKTtcblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU5ld0V4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBjYWxsZWUsIGFyZ3MsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgZXhwZWN0S2V5d29yZCgnbmV3Jyk7XG4gICAgICAgIGNhbGxlZSA9IHBhcnNlTGVmdEhhbmRTaWRlRXhwcmVzc2lvbigpO1xuICAgICAgICBhcmdzID0gbWF0Y2goJygnKSA/IHBhcnNlQXJndW1lbnRzKCkgOiBbXTtcblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVOZXdFeHByZXNzaW9uKGNhbGxlZSwgYXJncyksIHN0YXJ0VG9rZW4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTGVmdEhhbmRTaWRlRXhwcmVzc2lvbkFsbG93Q2FsbCgpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dJbiwgZXhwciwgYXJncywgcHJvcGVydHksIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBwcmV2aW91c0FsbG93SW4gPSBzdGF0ZS5hbGxvd0luO1xuICAgICAgICBzdGF0ZS5hbGxvd0luID0gdHJ1ZTtcbiAgICAgICAgZXhwciA9IG1hdGNoS2V5d29yZCgnbmV3JykgPyBwYXJzZU5ld0V4cHJlc3Npb24oKSA6IHBhcnNlUHJpbWFyeUV4cHJlc3Npb24oKTtcbiAgICAgICAgc3RhdGUuYWxsb3dJbiA9IHByZXZpb3VzQWxsb3dJbjtcblxuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBpZiAobWF0Y2goJy4nKSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcGFyc2VOb25Db21wdXRlZE1lbWJlcigpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVNZW1iZXJFeHByZXNzaW9uKCcuJywgZXhwciwgcHJvcGVydHkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnKCcpKSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IHBhcnNlQXJndW1lbnRzKCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZUNhbGxFeHByZXNzaW9uKGV4cHIsIGFyZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSBwYXJzZUNvbXB1dGVkTWVtYmVyKCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZU1lbWJlckV4cHJlc3Npb24oJ1snLCBleHByLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZWdhdGUubWFya0VuZChleHByLCBzdGFydFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTGVmdEhhbmRTaWRlRXhwcmVzc2lvbigpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dJbiwgZXhwciwgcHJvcGVydHksIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBwcmV2aW91c0FsbG93SW4gPSBzdGF0ZS5hbGxvd0luO1xuICAgICAgICBleHByID0gbWF0Y2hLZXl3b3JkKCduZXcnKSA/IHBhcnNlTmV3RXhwcmVzc2lvbigpIDogcGFyc2VQcmltYXJ5RXhwcmVzc2lvbigpO1xuICAgICAgICBzdGF0ZS5hbGxvd0luID0gcHJldmlvdXNBbGxvd0luO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCgnLicpIHx8IG1hdGNoKCdbJykpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSBwYXJzZUNvbXB1dGVkTWVtYmVyKCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZU1lbWJlckV4cHJlc3Npb24oJ1snLCBleHByLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcGFyc2VOb25Db21wdXRlZE1lbWJlcigpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVNZW1iZXJFeHByZXNzaW9uKCcuJywgZXhwciwgcHJvcGVydHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZWdhdGUubWFya0VuZChleHByLCBzdGFydFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIC8vIDExLjMgUG9zdGZpeCBFeHByZXNzaW9uc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VQb3N0Zml4RXhwcmVzc2lvbigpIHtcbiAgICAgICAgdmFyIGV4cHIsIHRva2VuLCBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuXG4gICAgICAgIGV4cHIgPSBwYXJzZUxlZnRIYW5kU2lkZUV4cHJlc3Npb25BbGxvd0NhbGwoKTtcblxuICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgPT09IFRva2VuLlB1bmN0dWF0b3IpIHtcbiAgICAgICAgICAgIGlmICgobWF0Y2goJysrJykgfHwgbWF0Y2goJy0tJykpICYmICFwZWVrTGluZVRlcm1pbmF0b3IoKSkge1xuICAgICAgICAgICAgICAgIC8vIDExLjMuMSwgMTEuMy4yXG4gICAgICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBleHByLnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyICYmIGlzUmVzdHJpY3RlZFdvcmQoZXhwci5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLlN0cmljdExIU1Bvc3RmaXgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaXNMZWZ0SGFuZFNpZGUoZXhwcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvclRvbGVyYW50KHt9LCBNZXNzYWdlcy5JbnZhbGlkTEhTSW5Bc3NpZ25tZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZVBvc3RmaXhFeHByZXNzaW9uKHRva2VuLnZhbHVlLCBleHByKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICAvLyAxMS40IFVuYXJ5IE9wZXJhdG9yc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VVbmFyeUV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciB0b2tlbiwgZXhwciwgc3RhcnRUb2tlbjtcblxuICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgIT09IFRva2VuLlB1bmN0dWF0b3IgJiYgbG9va2FoZWFkLnR5cGUgIT09IFRva2VuLktleXdvcmQpIHtcbiAgICAgICAgICAgIGV4cHIgPSBwYXJzZVBvc3RmaXhFeHByZXNzaW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2goJysrJykgfHwgbWF0Y2goJy0tJykpIHtcbiAgICAgICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgZXhwciA9IHBhcnNlVW5hcnlFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAvLyAxMS40LjQsIDExLjQuNVxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBleHByLnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyICYmIGlzUmVzdHJpY3RlZFdvcmQoZXhwci5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh7fSwgTWVzc2FnZXMuU3RyaWN0TEhTUHJlZml4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0xlZnRIYW5kU2lkZShleHByKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh7fSwgTWVzc2FnZXMuSW52YWxpZExIU0luQXNzaWdubWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVVbmFyeUV4cHJlc3Npb24odG9rZW4udmFsdWUsIGV4cHIpO1xuICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLm1hcmtFbmQoZXhwciwgc3RhcnRUb2tlbik7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2goJysnKSB8fCBtYXRjaCgnLScpIHx8IG1hdGNoKCd+JykgfHwgbWF0Y2goJyEnKSkge1xuICAgICAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgICAgIHRva2VuID0gbGV4KCk7XG4gICAgICAgICAgICBleHByID0gcGFyc2VVbmFyeUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVVbmFyeUV4cHJlc3Npb24odG9rZW4udmFsdWUsIGV4cHIpO1xuICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLm1hcmtFbmQoZXhwciwgc3RhcnRUb2tlbik7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hLZXl3b3JkKCdkZWxldGUnKSB8fCBtYXRjaEtleXdvcmQoJ3ZvaWQnKSB8fCBtYXRjaEtleXdvcmQoJ3R5cGVvZicpKSB7XG4gICAgICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgICAgIGV4cHIgPSBwYXJzZVVuYXJ5RXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZVVuYXJ5RXhwcmVzc2lvbih0b2tlbi52YWx1ZSwgZXhwcik7XG4gICAgICAgICAgICBleHByID0gZGVsZWdhdGUubWFya0VuZChleHByLCBzdGFydFRva2VuKTtcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZXhwci5vcGVyYXRvciA9PT0gJ2RlbGV0ZScgJiYgZXhwci5hcmd1bWVudC50eXBlID09PSBTeW50YXguSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh7fSwgTWVzc2FnZXMuU3RyaWN0RGVsZXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cHIgPSBwYXJzZVBvc3RmaXhFeHByZXNzaW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5hcnlQcmVjZWRlbmNlKHRva2VuLCBhbGxvd0luKSB7XG4gICAgICAgIHZhciBwcmVjID0gMDtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVG9rZW4uUHVuY3R1YXRvciAmJiB0b2tlbi50eXBlICE9PSBUb2tlbi5LZXl3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodG9rZW4udmFsdWUpIHtcbiAgICAgICAgY2FzZSAnfHwnOlxuICAgICAgICAgICAgcHJlYyA9IDE7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcmJic6XG4gICAgICAgICAgICBwcmVjID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgcHJlYyA9IDM7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgIHByZWMgPSA0O1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICBwcmVjID0gNTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJz09JzpcbiAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICBjYXNlICc9PT0nOlxuICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgcHJlYyA9IDY7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgIGNhc2UgJzw9JzpcbiAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICBjYXNlICdpbnN0YW5jZW9mJzpcbiAgICAgICAgICAgIHByZWMgPSA3O1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnaW4nOlxuICAgICAgICAgICAgcHJlYyA9IGFsbG93SW4gPyA3IDogMDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJzw8JzpcbiAgICAgICAgY2FzZSAnPj4nOlxuICAgICAgICBjYXNlICc+Pj4nOlxuICAgICAgICAgICAgcHJlYyA9IDg7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICBwcmVjID0gOTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICBwcmVjID0gMTE7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJlYztcbiAgICB9XG5cbiAgICAvLyAxMS41IE11bHRpcGxpY2F0aXZlIE9wZXJhdG9yc1xuICAgIC8vIDExLjYgQWRkaXRpdmUgT3BlcmF0b3JzXG4gICAgLy8gMTEuNyBCaXR3aXNlIFNoaWZ0IE9wZXJhdG9yc1xuICAgIC8vIDExLjggUmVsYXRpb25hbCBPcGVyYXRvcnNcbiAgICAvLyAxMS45IEVxdWFsaXR5IE9wZXJhdG9yc1xuICAgIC8vIDExLjEwIEJpbmFyeSBCaXR3aXNlIE9wZXJhdG9yc1xuICAgIC8vIDExLjExIEJpbmFyeSBMb2dpY2FsIE9wZXJhdG9yc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VCaW5hcnlFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgbWFya2VyLCBtYXJrZXJzLCBleHByLCB0b2tlbiwgcHJlYywgc3RhY2ssIHJpZ2h0LCBvcGVyYXRvciwgbGVmdCwgaTtcblxuICAgICAgICBtYXJrZXIgPSBsb29rYWhlYWQ7XG4gICAgICAgIGxlZnQgPSBwYXJzZVVuYXJ5RXhwcmVzc2lvbigpO1xuXG4gICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICBwcmVjID0gYmluYXJ5UHJlY2VkZW5jZSh0b2tlbiwgc3RhdGUuYWxsb3dJbik7XG4gICAgICAgIGlmIChwcmVjID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbi5wcmVjID0gcHJlYztcbiAgICAgICAgbGV4KCk7XG5cbiAgICAgICAgbWFya2VycyA9IFttYXJrZXIsIGxvb2thaGVhZF07XG4gICAgICAgIHJpZ2h0ID0gcGFyc2VVbmFyeUV4cHJlc3Npb24oKTtcblxuICAgICAgICBzdGFjayA9IFtsZWZ0LCB0b2tlbiwgcmlnaHRdO1xuXG4gICAgICAgIHdoaWxlICgocHJlYyA9IGJpbmFyeVByZWNlZGVuY2UobG9va2FoZWFkLCBzdGF0ZS5hbGxvd0luKSkgPiAwKSB7XG5cbiAgICAgICAgICAgIC8vIFJlZHVjZTogbWFrZSBhIGJpbmFyeSBleHByZXNzaW9uIGZyb20gdGhlIHRocmVlIHRvcG1vc3QgZW50cmllcy5cbiAgICAgICAgICAgIHdoaWxlICgoc3RhY2subGVuZ3RoID4gMikgJiYgKHByZWMgPD0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMl0ucHJlYykpIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gc3RhY2sucG9wKCkudmFsdWU7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgbWFya2Vycy5wb3AoKTtcbiAgICAgICAgICAgICAgICBtYXJrZXIgPSBtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgZGVsZWdhdGUubWFya0VuZChleHByLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goZXhwcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNoaWZ0LlxuICAgICAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgICAgIHRva2VuLnByZWMgPSBwcmVjO1xuICAgICAgICAgICAgc3RhY2sucHVzaCh0b2tlbik7XG4gICAgICAgICAgICBtYXJrZXJzLnB1c2gobG9va2FoZWFkKTtcbiAgICAgICAgICAgIGV4cHIgPSBwYXJzZVVuYXJ5RXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChleHByKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmFsIHJlZHVjZSB0byBjbGVhbi11cCB0aGUgc3RhY2suXG4gICAgICAgIGkgPSBzdGFjay5sZW5ndGggLSAxO1xuICAgICAgICBleHByID0gc3RhY2tbaV07XG4gICAgICAgIG1hcmtlcnMucG9wKCk7XG4gICAgICAgIHdoaWxlIChpID4gMSkge1xuICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZUJpbmFyeUV4cHJlc3Npb24oc3RhY2tbaSAtIDFdLnZhbHVlLCBzdGFja1tpIC0gMl0sIGV4cHIpO1xuICAgICAgICAgICAgaSAtPSAyO1xuICAgICAgICAgICAgbWFya2VyID0gbWFya2Vycy5wb3AoKTtcbiAgICAgICAgICAgIGRlbGVnYXRlLm1hcmtFbmQoZXhwciwgbWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuXG4gICAgLy8gMTEuMTIgQ29uZGl0aW9uYWwgT3BlcmF0b3JcblxuICAgIGZ1bmN0aW9uIHBhcnNlQ29uZGl0aW9uYWxFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgZXhwciwgcHJldmlvdXNBbGxvd0luLCBjb25zZXF1ZW50LCBhbHRlcm5hdGUsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBleHByID0gcGFyc2VCaW5hcnlFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgaWYgKG1hdGNoKCc/JykpIHtcbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgcHJldmlvdXNBbGxvd0luID0gc3RhdGUuYWxsb3dJbjtcbiAgICAgICAgICAgIHN0YXRlLmFsbG93SW4gPSB0cnVlO1xuICAgICAgICAgICAgY29uc2VxdWVudCA9IHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIHN0YXRlLmFsbG93SW4gPSBwcmV2aW91c0FsbG93SW47XG4gICAgICAgICAgICBleHBlY3QoJzonKTtcbiAgICAgICAgICAgIGFsdGVybmF0ZSA9IHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24oKTtcblxuICAgICAgICAgICAgZXhwciA9IGRlbGVnYXRlLmNyZWF0ZUNvbmRpdGlvbmFsRXhwcmVzc2lvbihleHByLCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xuICAgICAgICAgICAgZGVsZWdhdGUubWFya0VuZChleHByLCBzdGFydFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIC8vIDExLjEzIEFzc2lnbm1lbnQgT3BlcmF0b3JzXG5cbiAgICBmdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgdG9rZW4sIGxlZnQsIHJpZ2h0LCBub2RlLCBzdGFydFRva2VuO1xuXG4gICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuXG4gICAgICAgIG5vZGUgPSBsZWZ0ID0gcGFyc2VDb25kaXRpb25hbEV4cHJlc3Npb24oKTtcblxuICAgICAgICBpZiAobWF0Y2hBc3NpZ24oKSkge1xuICAgICAgICAgICAgLy8gTGVmdEhhbmRTaWRlRXhwcmVzc2lvblxuICAgICAgICAgICAgaWYgKCFpc0xlZnRIYW5kU2lkZShsZWZ0KSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh7fSwgTWVzc2FnZXMuSW52YWxpZExIU0luQXNzaWdubWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDExLjEzLjFcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgbGVmdC50eXBlID09PSBTeW50YXguSWRlbnRpZmllciAmJiBpc1Jlc3RyaWN0ZWRXb3JkKGxlZnQubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQodG9rZW4sIE1lc3NhZ2VzLlN0cmljdExIU0Fzc2lnbm1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgcmlnaHQgPSBwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICBub2RlID0gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVBc3NpZ25tZW50RXhwcmVzc2lvbih0b2tlbi52YWx1ZSwgbGVmdCwgcmlnaHQpLCBzdGFydFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIC8vIDExLjE0IENvbW1hIE9wZXJhdG9yXG5cbiAgICBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBleHByLCBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuXG4gICAgICAgIGV4cHIgPSBwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgaWYgKG1hdGNoKCcsJykpIHtcbiAgICAgICAgICAgIGV4cHIgPSBkZWxlZ2F0ZS5jcmVhdGVTZXF1ZW5jZUV4cHJlc3Npb24oWyBleHByIF0pO1xuXG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoKCcsJykpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgICAgIGV4cHIuZXhwcmVzc2lvbnMucHVzaChwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWxlZ2F0ZS5tYXJrRW5kKGV4cHIsIHN0YXJ0VG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgLy8gMTIuMSBCbG9ja1xuXG4gICAgZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnRMaXN0KCkge1xuICAgICAgICB2YXIgbGlzdCA9IFtdLFxuICAgICAgICAgICAgc3RhdGVtZW50O1xuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCA9IHBhcnNlU291cmNlRWxlbWVudCgpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0LnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlQmxvY2soKSB7XG4gICAgICAgIHZhciBibG9jaywgc3RhcnRUb2tlbjtcblxuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICBleHBlY3QoJ3snKTtcblxuICAgICAgICBibG9jayA9IHBhcnNlU3RhdGVtZW50TGlzdCgpO1xuXG4gICAgICAgIGV4cGVjdCgnfScpO1xuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUJsb2NrU3RhdGVtZW50KGJsb2NrKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgLy8gMTIuMiBWYXJpYWJsZSBTdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCkge1xuICAgICAgICB2YXIgdG9rZW4sIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgdG9rZW4gPSBsZXgoKTtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkKHRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUlkZW50aWZpZXIodG9rZW4udmFsdWUpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVZhcmlhYmxlRGVjbGFyYXRpb24oa2luZCkge1xuICAgICAgICB2YXIgaW5pdCA9IG51bGwsIGlkLCBzdGFydFRva2VuO1xuXG4gICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIGlkID0gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcblxuICAgICAgICAvLyAxMi4yLjFcbiAgICAgICAgaWYgKHN0cmljdCAmJiBpc1Jlc3RyaWN0ZWRXb3JkKGlkLm5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLlN0cmljdFZhck5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtpbmQgPT09ICdjb25zdCcpIHtcbiAgICAgICAgICAgIGV4cGVjdCgnPScpO1xuICAgICAgICAgICAgaW5pdCA9IHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24oKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnPScpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIGluaXQgPSBwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVWYXJpYWJsZURlY2xhcmF0b3IoaWQsIGluaXQpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGtpbmQpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBbXTtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBsaXN0LnB1c2gocGFyc2VWYXJpYWJsZURlY2xhcmF0aW9uKGtpbmQpKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2goJywnKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgIH0gd2hpbGUgKGluZGV4IDwgbGVuZ3RoKTtcblxuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVZhcmlhYmxlU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgZGVjbGFyYXRpb25zO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ3ZhcicpO1xuXG4gICAgICAgIGRlY2xhcmF0aW9ucyA9IHBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoKTtcblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCAndmFyJyk7XG4gICAgfVxuXG4gICAgLy8ga2luZCBtYXkgYmUgYGNvbnN0YCBvciBgbGV0YFxuICAgIC8vIEJvdGggYXJlIGV4cGVyaW1lbnRhbCBhbmQgbm90IGluIHRoZSBzcGVjaWZpY2F0aW9uIHlldC5cbiAgICAvLyBzZWUgaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpjb25zdFxuICAgIC8vIGFuZCBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmxldFxuICAgIGZ1bmN0aW9uIHBhcnNlQ29uc3RMZXREZWNsYXJhdGlvbihraW5kKSB7XG4gICAgICAgIHZhciBkZWNsYXJhdGlvbnMsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKGtpbmQpO1xuXG4gICAgICAgIGRlY2xhcmF0aW9ucyA9IHBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3Qoa2luZCk7XG5cbiAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCBraW5kKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgLy8gMTIuMyBFbXB0eSBTdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlRW1wdHlTdGF0ZW1lbnQoKSB7XG4gICAgICAgIGV4cGVjdCgnOycpO1xuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY3JlYXRlRW1wdHlTdGF0ZW1lbnQoKTtcbiAgICB9XG5cbiAgICAvLyAxMi40IEV4cHJlc3Npb24gU3RhdGVtZW50XG5cbiAgICBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoKSB7XG4gICAgICAgIHZhciBleHByID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZUV4cHJlc3Npb25TdGF0ZW1lbnQoZXhwcik7XG4gICAgfVxuXG4gICAgLy8gMTIuNSBJZiBzdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlSWZTdGF0ZW1lbnQoKSB7XG4gICAgICAgIHZhciB0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGU7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnaWYnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICB0ZXN0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgY29uc2VxdWVudCA9IHBhcnNlU3RhdGVtZW50KCk7XG5cbiAgICAgICAgaWYgKG1hdGNoS2V5d29yZCgnZWxzZScpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIGFsdGVybmF0ZSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbHRlcm5hdGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZUlmU3RhdGVtZW50KHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XG4gICAgfVxuXG4gICAgLy8gMTIuNiBJdGVyYXRpb24gU3RhdGVtZW50c1xuXG4gICAgZnVuY3Rpb24gcGFyc2VEb1doaWxlU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgYm9keSwgdGVzdCwgb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnZG8nKTtcblxuICAgICAgICBvbGRJbkl0ZXJhdGlvbiA9IHN0YXRlLmluSXRlcmF0aW9uO1xuICAgICAgICBzdGF0ZS5pbkl0ZXJhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG5cbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSBvbGRJbkl0ZXJhdGlvbjtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCd3aGlsZScpO1xuXG4gICAgICAgIGV4cGVjdCgnKCcpO1xuXG4gICAgICAgIHRlc3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICBpZiAobWF0Y2goJzsnKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY3JlYXRlRG9XaGlsZVN0YXRlbWVudChib2R5LCB0ZXN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVdoaWxlU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgdGVzdCwgYm9keSwgb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnd2hpbGUnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICB0ZXN0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgb2xkSW5JdGVyYXRpb24gPSBzdGF0ZS5pbkl0ZXJhdGlvbjtcbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSB0cnVlO1xuXG4gICAgICAgIGJvZHkgPSBwYXJzZVN0YXRlbWVudCgpO1xuXG4gICAgICAgIHN0YXRlLmluSXRlcmF0aW9uID0gb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZVdoaWxlU3RhdGVtZW50KHRlc3QsIGJvZHkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRm9yVmFyaWFibGVEZWNsYXJhdGlvbigpIHtcbiAgICAgICAgdmFyIHRva2VuLCBkZWNsYXJhdGlvbnMsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgZGVjbGFyYXRpb25zID0gcGFyc2VWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCgpO1xuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCB0b2tlbi52YWx1ZSksIHN0YXJ0VG9rZW4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRm9yU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgaW5pdCwgdGVzdCwgdXBkYXRlLCBsZWZ0LCByaWdodCwgYm9keSwgb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgaW5pdCA9IHRlc3QgPSB1cGRhdGUgPSBudWxsO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2ZvcicpO1xuXG4gICAgICAgIGV4cGVjdCgnKCcpO1xuXG4gICAgICAgIGlmIChtYXRjaCgnOycpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ3ZhcicpIHx8IG1hdGNoS2V5d29yZCgnbGV0JykpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbGxvd0luID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaW5pdCA9IHBhcnNlRm9yVmFyaWFibGVEZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFsbG93SW4gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluaXQuZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiBtYXRjaEtleXdvcmQoJ2luJykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpbml0O1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFsbG93SW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpbml0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWxsb3dJbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdpbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExlZnRIYW5kU2lkZUV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0xlZnRIYW5kU2lkZShpbml0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvclRvbGVyYW50KHt9LCBNZXNzYWdlcy5JbnZhbGlkTEhTSW5Gb3JJbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA9IGluaXQ7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGluaXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGV4cGVjdCgnOycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykge1xuXG4gICAgICAgICAgICBpZiAoIW1hdGNoKCc7JykpIHtcbiAgICAgICAgICAgICAgICB0ZXN0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHBlY3QoJzsnKTtcblxuICAgICAgICAgICAgaWYgKCFtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICBvbGRJbkl0ZXJhdGlvbiA9IHN0YXRlLmluSXRlcmF0aW9uO1xuICAgICAgICBzdGF0ZS5pbkl0ZXJhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG5cbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSBvbGRJbkl0ZXJhdGlvbjtcblxuICAgICAgICByZXR1cm4gKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykgP1xuICAgICAgICAgICAgICAgIGRlbGVnYXRlLmNyZWF0ZUZvclN0YXRlbWVudChpbml0LCB0ZXN0LCB1cGRhdGUsIGJvZHkpIDpcbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZS5jcmVhdGVGb3JJblN0YXRlbWVudChsZWZ0LCByaWdodCwgYm9keSk7XG4gICAgfVxuXG4gICAgLy8gMTIuNyBUaGUgY29udGludWUgc3RhdGVtZW50XG5cbiAgICBmdW5jdGlvbiBwYXJzZUNvbnRpbnVlU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgbGFiZWwgPSBudWxsLCBrZXk7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnY29udGludWUnKTtcblxuICAgICAgICAvLyBPcHRpbWl6ZSB0aGUgbW9zdCBjb21tb24gZm9ybTogJ2NvbnRpbnVlOycuXG4gICAgICAgIGlmIChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkgPT09IDB4M0IpIHtcbiAgICAgICAgICAgIGxleCgpO1xuXG4gICAgICAgICAgICBpZiAoIXN0YXRlLmluSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuSWxsZWdhbENvbnRpbnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZUNvbnRpbnVlU3RhdGVtZW50KG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBlZWtMaW5lVGVybWluYXRvcigpKSB7XG4gICAgICAgICAgICBpZiAoIXN0YXRlLmluSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuSWxsZWdhbENvbnRpbnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZUNvbnRpbnVlU3RhdGVtZW50KG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBsYWJlbCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG5cbiAgICAgICAgICAgIGtleSA9ICckJyArIGxhYmVsLm5hbWU7XG4gICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZS5sYWJlbFNldCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlVua25vd25MYWJlbCwgbGFiZWwubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgaWYgKGxhYmVsID09PSBudWxsICYmICFzdGF0ZS5pbkl0ZXJhdGlvbikge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuSWxsZWdhbENvbnRpbnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jcmVhdGVDb250aW51ZVN0YXRlbWVudChsYWJlbCk7XG4gICAgfVxuXG4gICAgLy8gMTIuOCBUaGUgYnJlYWsgc3RhdGVtZW50XG5cbiAgICBmdW5jdGlvbiBwYXJzZUJyZWFrU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgbGFiZWwgPSBudWxsLCBrZXk7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnYnJlYWsnKTtcblxuICAgICAgICAvLyBDYXRjaCB0aGUgdmVyeSBjb21tb24gY2FzZSBmaXJzdDogaW1tZWRpYXRlbHkgYSBzZW1pY29sb24gKFUrMDAzQikuXG4gICAgICAgIGlmIChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkgPT09IDB4M0IpIHtcbiAgICAgICAgICAgIGxleCgpO1xuXG4gICAgICAgICAgICBpZiAoIShzdGF0ZS5pbkl0ZXJhdGlvbiB8fCBzdGF0ZS5pblN3aXRjaCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKHt9LCBNZXNzYWdlcy5JbGxlZ2FsQnJlYWspO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuY3JlYXRlQnJlYWtTdGF0ZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGVla0xpbmVUZXJtaW5hdG9yKCkpIHtcbiAgICAgICAgICAgIGlmICghKHN0YXRlLmluSXRlcmF0aW9uIHx8IHN0YXRlLmluU3dpdGNoKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLklsbGVnYWxCcmVhayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jcmVhdGVCcmVha1N0YXRlbWVudChudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb29rYWhlYWQudHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgbGFiZWwgPSBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcigpO1xuXG4gICAgICAgICAgICBrZXkgPSAnJCcgKyBsYWJlbC5uYW1lO1xuICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3RhdGUubGFiZWxTZXQsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKHt9LCBNZXNzYWdlcy5Vbmtub3duTGFiZWwsIGxhYmVsLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuXG4gICAgICAgIGlmIChsYWJlbCA9PT0gbnVsbCAmJiAhKHN0YXRlLmluSXRlcmF0aW9uIHx8IHN0YXRlLmluU3dpdGNoKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuSWxsZWdhbEJyZWFrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jcmVhdGVCcmVha1N0YXRlbWVudChsYWJlbCk7XG4gICAgfVxuXG4gICAgLy8gMTIuOSBUaGUgcmV0dXJuIHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VSZXR1cm5TdGF0ZW1lbnQoKSB7XG4gICAgICAgIHZhciBhcmd1bWVudCA9IG51bGw7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgncmV0dXJuJyk7XG5cbiAgICAgICAgaWYgKCFzdGF0ZS5pbkZ1bmN0aW9uQm9keSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvclRvbGVyYW50KHt9LCBNZXNzYWdlcy5JbGxlZ2FsUmV0dXJuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdyZXR1cm4nIGZvbGxvd2VkIGJ5IGEgc3BhY2UgYW5kIGFuIGlkZW50aWZpZXIgaXMgdmVyeSBjb21tb24uXG4gICAgICAgIGlmIChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkgPT09IDB4MjApIHtcbiAgICAgICAgICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChzb3VyY2UuY2hhckNvZGVBdChpbmRleCArIDEpKSkge1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jcmVhdGVSZXR1cm5TdGF0ZW1lbnQoYXJndW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBlZWtMaW5lVGVybWluYXRvcigpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuY3JlYXRlUmV0dXJuU3RhdGVtZW50KG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXRjaCgnOycpKSB7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKCd9JykgJiYgbG9va2FoZWFkLnR5cGUgIT09IFRva2VuLkVPRikge1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZVJldHVyblN0YXRlbWVudChhcmd1bWVudCk7XG4gICAgfVxuXG4gICAgLy8gMTIuMTAgVGhlIHdpdGggc3RhdGVtZW50XG5cbiAgICBmdW5jdGlvbiBwYXJzZVdpdGhTdGF0ZW1lbnQoKSB7XG4gICAgICAgIHZhciBvYmplY3QsIGJvZHk7XG5cbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgLy8gVE9ETyhpa2FyaWVuYXRvcik6IFNob3VsZCB3ZSB1cGRhdGUgdGhlIHRlc3QgY2FzZXMgaW5zdGVhZD9cbiAgICAgICAgICAgIHNraXBDb21tZW50KCk7XG4gICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoe30sIE1lc3NhZ2VzLlN0cmljdE1vZGVXaXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ3dpdGgnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICBvYmplY3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICBib2R5ID0gcGFyc2VTdGF0ZW1lbnQoKTtcblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY3JlYXRlV2l0aFN0YXRlbWVudChvYmplY3QsIGJvZHkpO1xuICAgIH1cblxuICAgIC8vIDEyLjEwIFRoZSBzd2l0aCBzdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlU3dpdGNoQ2FzZSgpIHtcbiAgICAgICAgdmFyIHRlc3QsIGNvbnNlcXVlbnQgPSBbXSwgc3RhdGVtZW50LCBzdGFydFRva2VuO1xuXG4gICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ2RlZmF1bHQnKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICB0ZXN0ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cGVjdEtleXdvcmQoJ2Nhc2UnKTtcbiAgICAgICAgICAgIHRlc3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QoJzonKTtcblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaCgnfScpIHx8IG1hdGNoS2V5d29yZCgnZGVmYXVsdCcpIHx8IG1hdGNoS2V5d29yZCgnY2FzZScpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZW1lbnQgPSBwYXJzZVN0YXRlbWVudCgpO1xuICAgICAgICAgICAgY29uc2VxdWVudC5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVTd2l0Y2hDYXNlKHRlc3QsIGNvbnNlcXVlbnQpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVN3aXRjaFN0YXRlbWVudCgpIHtcbiAgICAgICAgdmFyIGRpc2NyaW1pbmFudCwgY2FzZXMsIGNsYXVzZSwgb2xkSW5Td2l0Y2gsIGRlZmF1bHRGb3VuZDtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdzd2l0Y2gnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICBkaXNjcmltaW5hbnQgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICBleHBlY3QoJ3snKTtcblxuICAgICAgICBjYXNlcyA9IFtdO1xuXG4gICAgICAgIGlmIChtYXRjaCgnfScpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jcmVhdGVTd2l0Y2hTdGF0ZW1lbnQoZGlzY3JpbWluYW50LCBjYXNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvbGRJblN3aXRjaCA9IHN0YXRlLmluU3dpdGNoO1xuICAgICAgICBzdGF0ZS5pblN3aXRjaCA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRGb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsYXVzZSA9IHBhcnNlU3dpdGNoQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGNsYXVzZS50ZXN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKHt9LCBNZXNzYWdlcy5NdWx0aXBsZURlZmF1bHRzSW5Td2l0Y2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0Rm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZXMucHVzaChjbGF1c2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUuaW5Td2l0Y2ggPSBvbGRJblN3aXRjaDtcblxuICAgICAgICBleHBlY3QoJ30nKTtcblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY3JlYXRlU3dpdGNoU3RhdGVtZW50KGRpc2NyaW1pbmFudCwgY2FzZXMpO1xuICAgIH1cblxuICAgIC8vIDEyLjEzIFRoZSB0aHJvdyBzdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlVGhyb3dTdGF0ZW1lbnQoKSB7XG4gICAgICAgIHZhciBhcmd1bWVudDtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCd0aHJvdycpO1xuXG4gICAgICAgIGlmIChwZWVrTGluZVRlcm1pbmF0b3IoKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcih7fSwgTWVzc2FnZXMuTmV3bGluZUFmdGVyVGhyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJndW1lbnQgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZVRocm93U3RhdGVtZW50KGFyZ3VtZW50KTtcbiAgICB9XG5cbiAgICAvLyAxMi4xNCBUaGUgdHJ5IHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VDYXRjaENsYXVzZSgpIHtcbiAgICAgICAgdmFyIHBhcmFtLCBib2R5LCBzdGFydFRva2VuO1xuXG4gICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2NhdGNoJyk7XG5cbiAgICAgICAgZXhwZWN0KCcoJyk7XG4gICAgICAgIGlmIChtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWQobG9va2FoZWFkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtID0gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcbiAgICAgICAgLy8gMTIuMTQuMVxuICAgICAgICBpZiAoc3RyaWN0ICYmIGlzUmVzdHJpY3RlZFdvcmQocGFyYW0ubmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh7fSwgTWVzc2FnZXMuU3RyaWN0Q2F0Y2hWYXJpYWJsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJyknKTtcbiAgICAgICAgYm9keSA9IHBhcnNlQmxvY2soKTtcbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZGVsZWdhdGUuY3JlYXRlQ2F0Y2hDbGF1c2UocGFyYW0sIGJvZHkpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVRyeVN0YXRlbWVudCgpIHtcbiAgICAgICAgdmFyIGJsb2NrLCBoYW5kbGVycyA9IFtdLCBmaW5hbGl6ZXIgPSBudWxsO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ3RyeScpO1xuXG4gICAgICAgIGJsb2NrID0gcGFyc2VCbG9jaygpO1xuXG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ2NhdGNoJykpIHtcbiAgICAgICAgICAgIGhhbmRsZXJzLnB1c2gocGFyc2VDYXRjaENsYXVzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ2ZpbmFsbHknKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICBmaW5hbGl6ZXIgPSBwYXJzZUJsb2NrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlcnMubGVuZ3RoID09PSAwICYmICFmaW5hbGl6ZXIpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLk5vQ2F0Y2hPckZpbmFsbHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNyZWF0ZVRyeVN0YXRlbWVudChibG9jaywgW10sIGhhbmRsZXJzLCBmaW5hbGl6ZXIpO1xuICAgIH1cblxuICAgIC8vIDEyLjE1IFRoZSBkZWJ1Z2dlciBzdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlRGVidWdnZXJTdGF0ZW1lbnQoKSB7XG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2RlYnVnZ2VyJyk7XG5cbiAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jcmVhdGVEZWJ1Z2dlclN0YXRlbWVudCgpO1xuICAgIH1cblxuICAgIC8vIDEyIFN0YXRlbWVudHNcblxuICAgIGZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50KCkge1xuICAgICAgICB2YXIgdHlwZSA9IGxvb2thaGVhZC50eXBlLFxuICAgICAgICAgICAgZXhwcixcbiAgICAgICAgICAgIGxhYmVsZWRCb2R5LFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgc3RhcnRUb2tlbjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gVG9rZW4uRU9GKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWQobG9va2FoZWFkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlID09PSBUb2tlbi5QdW5jdHVhdG9yICYmIGxvb2thaGVhZC52YWx1ZSA9PT0gJ3snKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VCbG9jaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBpZiAodHlwZSA9PT0gVG9rZW4uUHVuY3R1YXRvcikge1xuICAgICAgICAgICAgc3dpdGNoIChsb29rYWhlYWQudmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgJzsnOlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKHBhcnNlRW1wdHlTdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBjYXNlICcoJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChwYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFRva2VuLktleXdvcmQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobG9va2FoZWFkLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdicmVhayc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQocGFyc2VCcmVha1N0YXRlbWVudCgpLCBzdGFydFRva2VuKTtcbiAgICAgICAgICAgIGNhc2UgJ2NvbnRpbnVlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChwYXJzZUNvbnRpbnVlU3RhdGVtZW50KCksIHN0YXJ0VG9rZW4pO1xuICAgICAgICAgICAgY2FzZSAnZGVidWdnZXInOlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKHBhcnNlRGVidWdnZXJTdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBjYXNlICdkbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQocGFyc2VEb1doaWxlU3RhdGVtZW50KCksIHN0YXJ0VG9rZW4pO1xuICAgICAgICAgICAgY2FzZSAnZm9yJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChwYXJzZUZvclN0YXRlbWVudCgpLCBzdGFydFRva2VuKTtcbiAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChwYXJzZUZ1bmN0aW9uRGVjbGFyYXRpb24oKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBjYXNlICdpZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQocGFyc2VJZlN0YXRlbWVudCgpLCBzdGFydFRva2VuKTtcbiAgICAgICAgICAgIGNhc2UgJ3JldHVybic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQocGFyc2VSZXR1cm5TdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBjYXNlICdzd2l0Y2gnOlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKHBhcnNlU3dpdGNoU3RhdGVtZW50KCksIHN0YXJ0VG9rZW4pO1xuICAgICAgICAgICAgY2FzZSAndGhyb3cnOlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKHBhcnNlVGhyb3dTdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBjYXNlICd0cnknOlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKHBhcnNlVHJ5U3RhdGVtZW50KCksIHN0YXJ0VG9rZW4pO1xuICAgICAgICAgICAgY2FzZSAndmFyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChwYXJzZVZhcmlhYmxlU3RhdGVtZW50KCksIHN0YXJ0VG9rZW4pO1xuICAgICAgICAgICAgY2FzZSAnd2hpbGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKHBhcnNlV2hpbGVTdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBjYXNlICd3aXRoJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChwYXJzZVdpdGhTdGF0ZW1lbnQoKSwgc3RhcnRUb2tlbik7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwciA9IHBhcnNlRXhwcmVzc2lvbigpO1xuXG4gICAgICAgIC8vIDEyLjEyIExhYmVsbGVkIFN0YXRlbWVudHNcbiAgICAgICAgaWYgKChleHByLnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyKSAmJiBtYXRjaCgnOicpKSB7XG4gICAgICAgICAgICBsZXgoKTtcblxuICAgICAgICAgICAga2V5ID0gJyQnICsgZXhwci5uYW1lO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZS5sYWJlbFNldCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3Ioe30sIE1lc3NhZ2VzLlJlZGVjbGFyYXRpb24sICdMYWJlbCcsIGV4cHIubmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXRlLmxhYmVsU2V0W2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgbGFiZWxlZEJvZHkgPSBwYXJzZVN0YXRlbWVudCgpO1xuICAgICAgICAgICAgZGVsZXRlIHN0YXRlLmxhYmVsU2V0W2tleV07XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVMYWJlbGVkU3RhdGVtZW50KGV4cHIsIGxhYmVsZWRCb2R5KSwgc3RhcnRUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLm1hcmtFbmQoZGVsZWdhdGUuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudChleHByKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgLy8gMTMgRnVuY3Rpb24gRGVmaW5pdGlvblxuXG4gICAgZnVuY3Rpb24gcGFyc2VGdW5jdGlvblNvdXJjZUVsZW1lbnRzKCkge1xuICAgICAgICB2YXIgc291cmNlRWxlbWVudCwgc291cmNlRWxlbWVudHMgPSBbXSwgdG9rZW4sIGRpcmVjdGl2ZSwgZmlyc3RSZXN0cmljdGVkLFxuICAgICAgICAgICAgb2xkTGFiZWxTZXQsIG9sZEluSXRlcmF0aW9uLCBvbGRJblN3aXRjaCwgb2xkSW5GdW5jdGlvbkJvZHksIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgZXhwZWN0KCd7Jyk7XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgIT09IFRva2VuLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuXG4gICAgICAgICAgICBzb3VyY2VFbGVtZW50ID0gcGFyc2VTb3VyY2VFbGVtZW50KCk7XG4gICAgICAgICAgICBzb3VyY2VFbGVtZW50cy5wdXNoKHNvdXJjZUVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUVsZW1lbnQuZXhwcmVzc2lvbi50eXBlICE9PSBTeW50YXguTGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgbm90IGRpcmVjdGl2ZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlyZWN0aXZlID0gc291cmNlLnNsaWNlKHRva2VuLnN0YXJ0ICsgMSwgdG9rZW4uZW5kIC0gMSk7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlID09PSAndXNlIHN0cmljdCcpIHtcbiAgICAgICAgICAgICAgICBzdHJpY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChmaXJzdFJlc3RyaWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvclRvbGVyYW50KGZpcnN0UmVzdHJpY3RlZCwgTWVzc2FnZXMuU3RyaWN0T2N0YWxMaXRlcmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghZmlyc3RSZXN0cmljdGVkICYmIHRva2VuLm9jdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9sZExhYmVsU2V0ID0gc3RhdGUubGFiZWxTZXQ7XG4gICAgICAgIG9sZEluSXRlcmF0aW9uID0gc3RhdGUuaW5JdGVyYXRpb247XG4gICAgICAgIG9sZEluU3dpdGNoID0gc3RhdGUuaW5Td2l0Y2g7XG4gICAgICAgIG9sZEluRnVuY3Rpb25Cb2R5ID0gc3RhdGUuaW5GdW5jdGlvbkJvZHk7XG5cbiAgICAgICAgc3RhdGUubGFiZWxTZXQgPSB7fTtcbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuaW5Td2l0Y2ggPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuaW5GdW5jdGlvbkJvZHkgPSB0cnVlO1xuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZUVsZW1lbnQgPSBwYXJzZVNvdXJjZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZUVsZW1lbnRzLnB1c2goc291cmNlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJ30nKTtcblxuICAgICAgICBzdGF0ZS5sYWJlbFNldCA9IG9sZExhYmVsU2V0O1xuICAgICAgICBzdGF0ZS5pbkl0ZXJhdGlvbiA9IG9sZEluSXRlcmF0aW9uO1xuICAgICAgICBzdGF0ZS5pblN3aXRjaCA9IG9sZEluU3dpdGNoO1xuICAgICAgICBzdGF0ZS5pbkZ1bmN0aW9uQm9keSA9IG9sZEluRnVuY3Rpb25Cb2R5O1xuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUJsb2NrU3RhdGVtZW50KHNvdXJjZUVsZW1lbnRzKSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VQYXJhbXMoZmlyc3RSZXN0cmljdGVkKSB7XG4gICAgICAgIHZhciBwYXJhbSwgcGFyYW1zID0gW10sIHRva2VuLCBzdHJpY3RlZCwgcGFyYW1TZXQsIGtleSwgbWVzc2FnZTtcbiAgICAgICAgZXhwZWN0KCcoJyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICBwYXJhbVNldCA9IHt9O1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICAgICAgcGFyYW0gPSBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcigpO1xuICAgICAgICAgICAgICAgIGtleSA9ICckJyArIHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFBhcmFtTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtU2V0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFBhcmFtRHVwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZpcnN0UmVzdHJpY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSZXN0cmljdGVkV29yZCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFBhcmFtTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBNZXNzYWdlcy5TdHJpY3RSZXNlcnZlZFdvcmQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtU2V0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBNZXNzYWdlcy5TdHJpY3RQYXJhbUR1cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICAgICAgICAgIHBhcmFtU2V0W2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHBlY3QoJywnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdCgnKScpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgIHN0cmljdGVkOiBzdHJpY3RlZCxcbiAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZDogZmlyc3RSZXN0cmljdGVkLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRnVuY3Rpb25EZWNsYXJhdGlvbigpIHtcbiAgICAgICAgdmFyIGlkLCBwYXJhbXMgPSBbXSwgYm9keSwgdG9rZW4sIHN0cmljdGVkLCB0bXAsIGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSwgcHJldmlvdXNTdHJpY3QsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdmdW5jdGlvbicpO1xuICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgaWQgPSBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcigpO1xuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoaXNSZXN0cmljdGVkV29yZCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQodG9rZW4sIE1lc3NhZ2VzLlN0cmljdEZ1bmN0aW9uTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNSZXN0cmljdGVkV29yZCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gTWVzc2FnZXMuU3RyaWN0RnVuY3Rpb25OYW1lO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkID0gdG9rZW47XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFJlc2VydmVkV29yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRtcCA9IHBhcnNlUGFyYW1zKGZpcnN0UmVzdHJpY3RlZCk7XG4gICAgICAgIHBhcmFtcyA9IHRtcC5wYXJhbXM7XG4gICAgICAgIHN0cmljdGVkID0gdG1wLnN0cmljdGVkO1xuICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0bXAuZmlyc3RSZXN0cmljdGVkO1xuICAgICAgICBpZiAodG1wLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSB0bXAubWVzc2FnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZpb3VzU3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBib2R5ID0gcGFyc2VGdW5jdGlvblNvdXJjZUVsZW1lbnRzKCk7XG4gICAgICAgIGlmIChzdHJpY3QgJiYgZmlyc3RSZXN0cmljdGVkKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cmljdCAmJiBzdHJpY3RlZCkge1xuICAgICAgICAgICAgdGhyb3dFcnJvclRvbGVyYW50KHN0cmljdGVkLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBzdHJpY3QgPSBwcmV2aW91c1N0cmljdDtcblxuICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVGdW5jdGlvbkRlY2xhcmF0aW9uKGlkLCBwYXJhbXMsIFtdLCBib2R5KSwgc3RhcnRUb2tlbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VGdW5jdGlvbkV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciB0b2tlbiwgaWQgPSBudWxsLCBzdHJpY3RlZCwgZmlyc3RSZXN0cmljdGVkLCBtZXNzYWdlLCB0bXAsIHBhcmFtcyA9IFtdLCBib2R5LCBwcmV2aW91c1N0cmljdCwgc3RhcnRUb2tlbjtcblxuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICBleHBlY3RLZXl3b3JkKCdmdW5jdGlvbicpO1xuXG4gICAgICAgIGlmICghbWF0Y2goJygnKSkge1xuICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICBpZCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3JUb2xlcmFudCh0b2tlbiwgTWVzc2FnZXMuU3RyaWN0RnVuY3Rpb25OYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpc1Jlc3RyaWN0ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdEZ1bmN0aW9uTmFtZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaWN0TW9kZVJlc2VydmVkV29yZCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBNZXNzYWdlcy5TdHJpY3RSZXNlcnZlZFdvcmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG1wID0gcGFyc2VQYXJhbXMoZmlyc3RSZXN0cmljdGVkKTtcbiAgICAgICAgcGFyYW1zID0gdG1wLnBhcmFtcztcbiAgICAgICAgc3RyaWN0ZWQgPSB0bXAuc3RyaWN0ZWQ7XG4gICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRtcC5maXJzdFJlc3RyaWN0ZWQ7XG4gICAgICAgIGlmICh0bXAubWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IHRtcC5tZXNzYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNTdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGJvZHkgPSBwYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMoKTtcbiAgICAgICAgaWYgKHN0cmljdCAmJiBmaXJzdFJlc3RyaWN0ZWQpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3IoZmlyc3RSZXN0cmljdGVkLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RyaWN0ICYmIHN0cmljdGVkKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoc3RyaWN0ZWQsIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHN0cmljdCA9IHByZXZpb3VzU3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5tYXJrRW5kKGRlbGVnYXRlLmNyZWF0ZUZ1bmN0aW9uRXhwcmVzc2lvbihpZCwgcGFyYW1zLCBbXSwgYm9keSksIHN0YXJ0VG9rZW4pO1xuICAgIH1cblxuICAgIC8vIDE0IFByb2dyYW1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU291cmNlRWxlbWVudCgpIHtcbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5LZXl3b3JkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGxvb2thaGVhZC52YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnY29uc3QnOlxuICAgICAgICAgICAgY2FzZSAnbGV0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VDb25zdExldERlY2xhcmF0aW9uKGxvb2thaGVhZC52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRnVuY3Rpb25EZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VTdGF0ZW1lbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb29rYWhlYWQudHlwZSAhPT0gVG9rZW4uRU9GKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VTdGF0ZW1lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU291cmNlRWxlbWVudHMoKSB7XG4gICAgICAgIHZhciBzb3VyY2VFbGVtZW50LCBzb3VyY2VFbGVtZW50cyA9IFtdLCB0b2tlbiwgZGlyZWN0aXZlLCBmaXJzdFJlc3RyaWN0ZWQ7XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgICAgIGlmICh0b2tlbi50eXBlICE9PSBUb2tlbi5TdHJpbmdMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNvdXJjZUVsZW1lbnQgPSBwYXJzZVNvdXJjZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIHNvdXJjZUVsZW1lbnRzLnB1c2goc291cmNlRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoc291cmNlRWxlbWVudC5leHByZXNzaW9uLnR5cGUgIT09IFN5bnRheC5MaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBub3QgZGlyZWN0aXZlXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXJlY3RpdmUgPSBzb3VyY2Uuc2xpY2UodG9rZW4uc3RhcnQgKyAxLCB0b2tlbi5lbmQgLSAxKTtcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUgPT09ICd1c2Ugc3RyaWN0Jykge1xuICAgICAgICAgICAgICAgIHN0cmljdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0UmVzdHJpY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yVG9sZXJhbnQoZmlyc3RSZXN0cmljdGVkLCBNZXNzYWdlcy5TdHJpY3RPY3RhbExpdGVyYWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmaXJzdFJlc3RyaWN0ZWQgJiYgdG9rZW4ub2N0YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkID0gdG9rZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBzb3VyY2VFbGVtZW50ID0gcGFyc2VTb3VyY2VFbGVtZW50KCk7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZUVsZW1lbnRzLnB1c2goc291cmNlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZUVsZW1lbnRzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUHJvZ3JhbSgpIHtcbiAgICAgICAgdmFyIGJvZHksIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgc2tpcENvbW1lbnQoKTtcbiAgICAgICAgcGVlaygpO1xuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICBzdHJpY3QgPSBmYWxzZTtcblxuICAgICAgICBib2R5ID0gcGFyc2VTb3VyY2VFbGVtZW50cygpO1xuICAgICAgICByZXR1cm4gZGVsZWdhdGUubWFya0VuZChkZWxlZ2F0ZS5jcmVhdGVQcm9ncmFtKGJvZHkpLCBzdGFydFRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJUb2tlbkxvY2F0aW9uKCkge1xuICAgICAgICB2YXIgaSwgZW50cnksIHRva2VuLCB0b2tlbnMgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXh0cmEudG9rZW5zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBlbnRyeSA9IGV4dHJhLnRva2Vuc1tpXTtcbiAgICAgICAgICAgIHRva2VuID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IGVudHJ5LnR5cGUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGVudHJ5LnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGV4dHJhLnJhbmdlKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4ucmFuZ2UgPSBlbnRyeS5yYW5nZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHRyYS5sb2MpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5sb2MgPSBlbnRyeS5sb2M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICBleHRyYS50b2tlbnMgPSB0b2tlbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9rZW5pemUoY29kZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdG9TdHJpbmcsXG4gICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgIHRva2VucztcblxuICAgICAgICB0b1N0cmluZyA9IFN0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiBjb2RlICE9PSAnc3RyaW5nJyAmJiAhKGNvZGUgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICBjb2RlID0gdG9TdHJpbmcoY29kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxlZ2F0ZSA9IFN5bnRheFRyZWVEZWxlZ2F0ZTtcbiAgICAgICAgc291cmNlID0gY29kZTtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICBsaW5lTnVtYmVyID0gKHNvdXJjZS5sZW5ndGggPiAwKSA/IDEgOiAwO1xuICAgICAgICBsaW5lU3RhcnQgPSAwO1xuICAgICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICBsb29rYWhlYWQgPSBudWxsO1xuICAgICAgICBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGFsbG93SW46IHRydWUsXG4gICAgICAgICAgICBsYWJlbFNldDoge30sXG4gICAgICAgICAgICBpbkZ1bmN0aW9uQm9keTogZmFsc2UsXG4gICAgICAgICAgICBpbkl0ZXJhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBpblN3aXRjaDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0Q29tbWVudFN0YXJ0OiAtMVxuICAgICAgICB9O1xuXG4gICAgICAgIGV4dHJhID0ge307XG5cbiAgICAgICAgLy8gT3B0aW9ucyBtYXRjaGluZy5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgLy8gT2YgY291cnNlIHdlIGNvbGxlY3QgdG9rZW5zIGhlcmUuXG4gICAgICAgIG9wdGlvbnMudG9rZW5zID0gdHJ1ZTtcbiAgICAgICAgZXh0cmEudG9rZW5zID0gW107XG4gICAgICAgIGV4dHJhLnRva2VuaXplID0gdHJ1ZTtcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyB0d28gZmllbGRzIGFyZSBuZWNlc3NhcnkgdG8gY29tcHV0ZSB0aGUgUmVnZXggdG9rZW5zLlxuICAgICAgICBleHRyYS5vcGVuUGFyZW5Ub2tlbiA9IC0xO1xuICAgICAgICBleHRyYS5vcGVuQ3VybHlUb2tlbiA9IC0xO1xuXG4gICAgICAgIGV4dHJhLnJhbmdlID0gKHR5cGVvZiBvcHRpb25zLnJhbmdlID09PSAnYm9vbGVhbicpICYmIG9wdGlvbnMucmFuZ2U7XG4gICAgICAgIGV4dHJhLmxvYyA9ICh0eXBlb2Ygb3B0aW9ucy5sb2MgPT09ICdib29sZWFuJykgJiYgb3B0aW9ucy5sb2M7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNvbW1lbnQgPT09ICdib29sZWFuJyAmJiBvcHRpb25zLmNvbW1lbnQpIHtcbiAgICAgICAgICAgIGV4dHJhLmNvbW1lbnRzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnRvbGVyYW50ID09PSAnYm9vbGVhbicgJiYgb3B0aW9ucy50b2xlcmFudCkge1xuICAgICAgICAgICAgZXh0cmEuZXJyb3JzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGVlaygpO1xuICAgICAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5FT0YpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXh0cmEudG9rZW5zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgd2hpbGUgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5FT0YpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGxleEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0cmEuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYS5lcnJvcnMucHVzaChsZXhFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGJyZWFrIG9uIHRoZSBmaXJzdCBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaW5maW5pdGUgbG9vcHMuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGxleEVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWx0ZXJUb2tlbkxvY2F0aW9uKCk7XG4gICAgICAgICAgICB0b2tlbnMgPSBleHRyYS50b2tlbnM7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dHJhLmNvbW1lbnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRva2Vucy5jb21tZW50cyA9IGV4dHJhLmNvbW1lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHRyYS5lcnJvcnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zLmVycm9ycyA9IGV4dHJhLmVycm9ycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGV4dHJhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShjb2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm9ncmFtLCB0b1N0cmluZztcblxuICAgICAgICB0b1N0cmluZyA9IFN0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiBjb2RlICE9PSAnc3RyaW5nJyAmJiAhKGNvZGUgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICBjb2RlID0gdG9TdHJpbmcoY29kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxlZ2F0ZSA9IFN5bnRheFRyZWVEZWxlZ2F0ZTtcbiAgICAgICAgc291cmNlID0gY29kZTtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICBsaW5lTnVtYmVyID0gKHNvdXJjZS5sZW5ndGggPiAwKSA/IDEgOiAwO1xuICAgICAgICBsaW5lU3RhcnQgPSAwO1xuICAgICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICBsb29rYWhlYWQgPSBudWxsO1xuICAgICAgICBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGFsbG93SW46IHRydWUsXG4gICAgICAgICAgICBsYWJlbFNldDoge30sXG4gICAgICAgICAgICBpbkZ1bmN0aW9uQm9keTogZmFsc2UsXG4gICAgICAgICAgICBpbkl0ZXJhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBpblN3aXRjaDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0Q29tbWVudFN0YXJ0OiAtMVxuICAgICAgICB9O1xuXG4gICAgICAgIGV4dHJhID0ge307XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGV4dHJhLnJhbmdlID0gKHR5cGVvZiBvcHRpb25zLnJhbmdlID09PSAnYm9vbGVhbicpICYmIG9wdGlvbnMucmFuZ2U7XG4gICAgICAgICAgICBleHRyYS5sb2MgPSAodHlwZW9mIG9wdGlvbnMubG9jID09PSAnYm9vbGVhbicpICYmIG9wdGlvbnMubG9jO1xuICAgICAgICAgICAgZXh0cmEuYXR0YWNoQ29tbWVudCA9ICh0eXBlb2Ygb3B0aW9ucy5hdHRhY2hDb21tZW50ID09PSAnYm9vbGVhbicpICYmIG9wdGlvbnMuYXR0YWNoQ29tbWVudDtcblxuICAgICAgICAgICAgaWYgKGV4dHJhLmxvYyAmJiBvcHRpb25zLnNvdXJjZSAhPT0gbnVsbCAmJiBvcHRpb25zLnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZXh0cmEuc291cmNlID0gdG9TdHJpbmcob3B0aW9ucy5zb3VyY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMudG9rZW5zID09PSAnYm9vbGVhbicgJiYgb3B0aW9ucy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBleHRyYS50b2tlbnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jb21tZW50ID09PSAnYm9vbGVhbicgJiYgb3B0aW9ucy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgZXh0cmEuY29tbWVudHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50b2xlcmFudCA9PT0gJ2Jvb2xlYW4nICYmIG9wdGlvbnMudG9sZXJhbnQpIHtcbiAgICAgICAgICAgICAgICBleHRyYS5lcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHRyYS5hdHRhY2hDb21tZW50KSB7XG4gICAgICAgICAgICAgICAgZXh0cmEucmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV4dHJhLmNvbW1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgZXh0cmEuYm90dG9tUmlnaHRTdGFjayA9IFtdO1xuICAgICAgICAgICAgICAgIGV4dHJhLnRyYWlsaW5nQ29tbWVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICBleHRyYS5sZWFkaW5nQ29tbWVudHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9ncmFtID0gcGFyc2VQcm9ncmFtKCk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dHJhLmNvbW1lbnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHByb2dyYW0uY29tbWVudHMgPSBleHRyYS5jb21tZW50cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXh0cmEudG9rZW5zICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGZpbHRlclRva2VuTG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICBwcm9ncmFtLnRva2VucyA9IGV4dHJhLnRva2VucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXh0cmEuZXJyb3JzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHByb2dyYW0uZXJyb3JzID0gZXh0cmEuZXJyb3JzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgZXh0cmEgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9ncmFtO1xuICAgIH1cblxuICAgIC8vIFN5bmMgd2l0aCAqLmpzb24gbWFuaWZlc3RzLlxuICAgIGV4cG9ydHMudmVyc2lvbiA9ICcxLjIuMic7XG5cbiAgICBleHBvcnRzLnRva2VuaXplID0gdG9rZW5pemU7XG5cbiAgICBleHBvcnRzLnBhcnNlID0gcGFyc2U7XG5cbiAgICAvLyBEZWVwIGNvcHkuXG4gICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGV4cG9ydHMuU3ludGF4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5hbWUsIHR5cGVzID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0eXBlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKG5hbWUgaW4gU3ludGF4KSB7XG4gICAgICAgICAgICBpZiAoU3ludGF4Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdHlwZXNbbmFtZV0gPSBTeW50YXhbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5mcmVlemUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUodHlwZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH0oKSk7XG5cbn0pKTtcbi8qIHZpbTogc2V0IHN3PTQgdHM9NCBldCB0dz04MCA6ICovXG5cbn0se31dLDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8qIHBhcnNlciBnZW5lcmF0ZWQgYnkgamlzb24gMC40LjEzICovXG4vKlxuICBSZXR1cm5zIGEgUGFyc2VyIG9iamVjdCBvZiB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcblxuICBQYXJzZXI6IHtcbiAgICB5eToge31cbiAgfVxuXG4gIFBhcnNlci5wcm90b3R5cGU6IHtcbiAgICB5eToge30sXG4gICAgdHJhY2U6IGZ1bmN0aW9uKCksXG4gICAgc3ltYm9sc186IHthc3NvY2lhdGl2ZSBsaXN0OiBuYW1lID09PiBudW1iZXJ9LFxuICAgIHRlcm1pbmFsc186IHthc3NvY2lhdGl2ZSBsaXN0OiBudW1iZXIgPT0+IG5hbWV9LFxuICAgIHByb2R1Y3Rpb25zXzogWy4uLl0sXG4gICAgcGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgeXksIHl5c3RhdGUsICQkLCBfJCksXG4gICAgdGFibGU6IFsuLi5dLFxuICAgIGRlZmF1bHRBY3Rpb25zOiB7Li4ufSxcbiAgICBwYXJzZUVycm9yOiBmdW5jdGlvbihzdHIsIGhhc2gpLFxuICAgIHBhcnNlOiBmdW5jdGlvbihpbnB1dCksXG5cbiAgICBsZXhlcjoge1xuICAgICAgICBFT0Y6IDEsXG4gICAgICAgIHBhcnNlRXJyb3I6IGZ1bmN0aW9uKHN0ciwgaGFzaCksXG4gICAgICAgIHNldElucHV0OiBmdW5jdGlvbihpbnB1dCksXG4gICAgICAgIGlucHV0OiBmdW5jdGlvbigpLFxuICAgICAgICB1bnB1dDogZnVuY3Rpb24oc3RyKSxcbiAgICAgICAgbW9yZTogZnVuY3Rpb24oKSxcbiAgICAgICAgbGVzczogZnVuY3Rpb24obiksXG4gICAgICAgIHBhc3RJbnB1dDogZnVuY3Rpb24oKSxcbiAgICAgICAgdXBjb21pbmdJbnB1dDogZnVuY3Rpb24oKSxcbiAgICAgICAgc2hvd1Bvc2l0aW9uOiBmdW5jdGlvbigpLFxuICAgICAgICB0ZXN0X21hdGNoOiBmdW5jdGlvbihyZWdleF9tYXRjaF9hcnJheSwgcnVsZV9pbmRleCksXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uKCksXG4gICAgICAgIGxleDogZnVuY3Rpb24oKSxcbiAgICAgICAgYmVnaW46IGZ1bmN0aW9uKGNvbmRpdGlvbiksXG4gICAgICAgIHBvcFN0YXRlOiBmdW5jdGlvbigpLFxuICAgICAgICBfY3VycmVudFJ1bGVzOiBmdW5jdGlvbigpLFxuICAgICAgICB0b3BTdGF0ZTogZnVuY3Rpb24oKSxcbiAgICAgICAgcHVzaFN0YXRlOiBmdW5jdGlvbihjb25kaXRpb24pLFxuXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHJhbmdlczogYm9vbGVhbiAgICAgICAgICAgKG9wdGlvbmFsOiB0cnVlID09PiB0b2tlbiBsb2NhdGlvbiBpbmZvIHdpbGwgaW5jbHVkZSBhIC5yYW5nZVtdIG1lbWJlcilcbiAgICAgICAgICAgIGZsZXg6IGJvb2xlYW4gICAgICAgICAgICAgKG9wdGlvbmFsOiB0cnVlID09PiBmbGV4LWxpa2UgbGV4aW5nIGJlaGF2aW91ciB3aGVyZSB0aGUgcnVsZXMgYXJlIHRlc3RlZCBleGhhdXN0aXZlbHkgdG8gZmluZCB0aGUgbG9uZ2VzdCBtYXRjaClcbiAgICAgICAgICAgIGJhY2t0cmFja19sZXhlcjogYm9vbGVhbiAgKG9wdGlvbmFsOiB0cnVlID09PiBsZXhlciByZWdleGVzIGFyZSB0ZXN0ZWQgaW4gb3JkZXIgYW5kIGZvciBlYWNoIG1hdGNoaW5nIHJlZ2V4IHRoZSBhY3Rpb24gY29kZSBpcyBpbnZva2VkOyB0aGUgbGV4ZXIgdGVybWluYXRlcyB0aGUgc2NhbiB3aGVuIGEgdG9rZW4gaXMgcmV0dXJuZWQgYnkgdGhlIGFjdGlvbiBjb2RlKVxuICAgICAgICB9LFxuXG4gICAgICAgIHBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uKHl5LCB5eV8sICRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMsIFlZX1NUQVJUKSxcbiAgICAgICAgcnVsZXM6IFsuLi5dLFxuICAgICAgICBjb25kaXRpb25zOiB7YXNzb2NpYXRpdmUgbGlzdDogbmFtZSA9PT4gc2V0fSxcbiAgICB9XG4gIH1cblxuXG4gIHRva2VuIGxvY2F0aW9uIGluZm8gKEAkLCBfJCwgZXRjLik6IHtcbiAgICBmaXJzdF9saW5lOiBuLFxuICAgIGxhc3RfbGluZTogbixcbiAgICBmaXJzdF9jb2x1bW46IG4sXG4gICAgbGFzdF9jb2x1bW46IG4sXG4gICAgcmFuZ2U6IFtzdGFydF9udW1iZXIsIGVuZF9udW1iZXJdICAgICAgICh3aGVyZSB0aGUgbnVtYmVycyBhcmUgaW5kZXhlcyBpbnRvIHRoZSBpbnB1dCBzdHJpbmcsIHJlZ3VsYXIgemVyby1iYXNlZClcbiAgfVxuXG5cbiAgdGhlIHBhcnNlRXJyb3IgZnVuY3Rpb24gcmVjZWl2ZXMgYSAnaGFzaCcgb2JqZWN0IHdpdGggdGhlc2UgbWVtYmVycyBmb3IgbGV4ZXIgYW5kIHBhcnNlciBlcnJvcnM6IHtcbiAgICB0ZXh0OiAgICAgICAgKG1hdGNoZWQgdGV4dClcbiAgICB0b2tlbjogICAgICAgKHRoZSBwcm9kdWNlZCB0ZXJtaW5hbCB0b2tlbiwgaWYgYW55KVxuICAgIGxpbmU6ICAgICAgICAoeXlsaW5lbm8pXG4gIH1cbiAgd2hpbGUgcGFyc2VyIChncmFtbWFyKSBlcnJvcnMgd2lsbCBhbHNvIHByb3ZpZGUgdGhlc2UgbWVtYmVycywgaS5lLiBwYXJzZXIgZXJyb3JzIGRlbGl2ZXIgYSBzdXBlcnNldCBvZiBhdHRyaWJ1dGVzOiB7XG4gICAgbG9jOiAgICAgICAgICh5eWxsb2MpXG4gICAgZXhwZWN0ZWQ6ICAgIChzdHJpbmcgZGVzY3JpYmluZyB0aGUgc2V0IG9mIGV4cGVjdGVkIHRva2VucylcbiAgICByZWNvdmVyYWJsZTogKGJvb2xlYW46IFRSVUUgd2hlbiB0aGUgcGFyc2VyIGhhcyBhIGVycm9yIHJlY292ZXJ5IHJ1bGUgYXZhaWxhYmxlIGZvciB0aGlzIHBhcnRpY3VsYXIgZXJyb3IpXG4gIH1cbiovXG52YXIgcGFyc2VyID0gKGZ1bmN0aW9uKCl7XG52YXIgcGFyc2VyID0ge3RyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHsgfSxcbnl5OiB7fSxcbnN5bWJvbHNfOiB7XCJlcnJvclwiOjIsXCJKU09OX1BBVEhcIjozLFwiRE9MTEFSXCI6NCxcIlBBVEhfQ09NUE9ORU5UU1wiOjUsXCJMRUFESU5HX0NISUxEX01FTUJFUl9FWFBSRVNTSU9OXCI6NixcIlBBVEhfQ09NUE9ORU5UXCI6NyxcIk1FTUJFUl9DT01QT05FTlRcIjo4LFwiU1VCU0NSSVBUX0NPTVBPTkVOVFwiOjksXCJDSElMRF9NRU1CRVJfQ09NUE9ORU5UXCI6MTAsXCJERVNDRU5EQU5UX01FTUJFUl9DT01QT05FTlRcIjoxMSxcIkRPVFwiOjEyLFwiTUVNQkVSX0VYUFJFU1NJT05cIjoxMyxcIkRPVF9ET1RcIjoxNCxcIlNUQVJcIjoxNSxcIklERU5USUZJRVJcIjoxNixcIlNDUklQVF9FWFBSRVNTSU9OXCI6MTcsXCJJTlRFR0VSXCI6MTgsXCJFTkRcIjoxOSxcIkNISUxEX1NVQlNDUklQVF9DT01QT05FTlRcIjoyMCxcIkRFU0NFTkRBTlRfU1VCU0NSSVBUX0NPTVBPTkVOVFwiOjIxLFwiW1wiOjIyLFwiU1VCU0NSSVBUXCI6MjMsXCJdXCI6MjQsXCJTVUJTQ1JJUFRfRVhQUkVTU0lPTlwiOjI1LFwiU1VCU0NSSVBUX0VYUFJFU1NJT05fTElTVFwiOjI2LFwiU1VCU0NSSVBUX0VYUFJFU1NJT05fTElTVEFCTEVcIjoyNyxcIixcIjoyOCxcIlNUUklOR19MSVRFUkFMXCI6MjksXCJBUlJBWV9TTElDRVwiOjMwLFwiRklMVEVSX0VYUFJFU1NJT05cIjozMSxcIlFRX1NUUklOR1wiOjMyLFwiUV9TVFJJTkdcIjozMyxcIiRhY2NlcHRcIjowLFwiJGVuZFwiOjF9LFxudGVybWluYWxzXzogezI6XCJlcnJvclwiLDQ6XCJET0xMQVJcIiwxMjpcIkRPVFwiLDE0OlwiRE9UX0RPVFwiLDE1OlwiU1RBUlwiLDE2OlwiSURFTlRJRklFUlwiLDE3OlwiU0NSSVBUX0VYUFJFU1NJT05cIiwxODpcIklOVEVHRVJcIiwxOTpcIkVORFwiLDIyOlwiW1wiLDI0OlwiXVwiLDI4OlwiLFwiLDMwOlwiQVJSQVlfU0xJQ0VcIiwzMTpcIkZJTFRFUl9FWFBSRVNTSU9OXCIsMzI6XCJRUV9TVFJJTkdcIiwzMzpcIlFfU1RSSU5HXCJ9LFxucHJvZHVjdGlvbnNfOiBbMCxbMywxXSxbMywyXSxbMywxXSxbMywyXSxbNSwxXSxbNSwyXSxbNywxXSxbNywxXSxbOCwxXSxbOCwxXSxbMTAsMl0sWzYsMV0sWzExLDJdLFsxMywxXSxbMTMsMV0sWzEzLDFdLFsxMywxXSxbMTMsMV0sWzksMV0sWzksMV0sWzIwLDNdLFsyMSw0XSxbMjMsMV0sWzIzLDFdLFsyNiwxXSxbMjYsM10sWzI3LDFdLFsyNywxXSxbMjcsMV0sWzI1LDFdLFsyNSwxXSxbMjUsMV0sWzI5LDFdLFsyOSwxXV0sXG5wZXJmb3JtQWN0aW9uOiBmdW5jdGlvbiBhbm9ueW1vdXMoeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB5eSwgeXlzdGF0ZSAvKiBhY3Rpb25bMV0gKi8sICQkIC8qIHZzdGFjayAqLywgXyQgLyogbHN0YWNrICovXG4vKiovKSB7XG4vKiB0aGlzID09IHl5dmFsICovXG5pZiAoIXl5LmFzdCkge1xuICAgIHl5LmFzdCA9IF9hc3Q7XG4gICAgX2FzdC5pbml0aWFsaXplKCk7XG59XG5cbnZhciAkMCA9ICQkLmxlbmd0aCAtIDE7XG5zd2l0Y2ggKHl5c3RhdGUpIHtcbmNhc2UgMTp5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcInJvb3RcIiwgdmFsdWU6ICQkWyQwXSB9IH0pOyB5eS5hc3QudW5zaGlmdCgpOyByZXR1cm4geXkuYXN0LnlpZWxkKClcbmJyZWFrO1xuY2FzZSAyOnl5LmFzdC5zZXQoeyBleHByZXNzaW9uOiB7IHR5cGU6IFwicm9vdFwiLCB2YWx1ZTogJCRbJDAtMV0gfSB9KTsgeXkuYXN0LnVuc2hpZnQoKTsgcmV0dXJuIHl5LmFzdC55aWVsZCgpXG5icmVhaztcbmNhc2UgMzp5eS5hc3QudW5zaGlmdCgpOyByZXR1cm4geXkuYXN0LnlpZWxkKClcbmJyZWFrO1xuY2FzZSA0Onl5LmFzdC5zZXQoeyBvcGVyYXRpb246IFwibWVtYmVyXCIsIHNjb3BlOiBcImNoaWxkXCIsIGV4cHJlc3Npb246IHsgdHlwZTogXCJpZGVudGlmaWVyXCIsIHZhbHVlOiAkJFskMC0xXSB9fSk7IHl5LmFzdC51bnNoaWZ0KCk7IHJldHVybiB5eS5hc3QueWllbGQoKVxuYnJlYWs7XG5jYXNlIDU6XG5icmVhaztcbmNhc2UgNjpcbmJyZWFrO1xuY2FzZSA3Onl5LmFzdC5zZXQoeyBvcGVyYXRpb246IFwibWVtYmVyXCIgfSk7IHl5LmFzdC5wdXNoKClcbmJyZWFrO1xuY2FzZSA4Onl5LmFzdC5zZXQoeyBvcGVyYXRpb246IFwic3Vic2NyaXB0XCIgfSk7IHl5LmFzdC5wdXNoKCkgXG5icmVhaztcbmNhc2UgOTp5eS5hc3Quc2V0KHsgc2NvcGU6IFwiY2hpbGRcIiB9KVxuYnJlYWs7XG5jYXNlIDEwOnl5LmFzdC5zZXQoeyBzY29wZTogXCJkZXNjZW5kYW50XCIgfSlcbmJyZWFrO1xuY2FzZSAxMTpcbmJyZWFrO1xuY2FzZSAxMjp5eS5hc3Quc2V0KHsgc2NvcGU6IFwiY2hpbGRcIiwgb3BlcmF0aW9uOiBcIm1lbWJlclwiIH0pXG5icmVhaztcbmNhc2UgMTM6XG5icmVhaztcbmNhc2UgMTQ6eXkuYXN0LnNldCh7IGV4cHJlc3Npb246IHsgdHlwZTogXCJ3aWxkY2FyZFwiLCB2YWx1ZTogJCRbJDBdIH0gfSlcbmJyZWFrO1xuY2FzZSAxNTp5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcImlkZW50aWZpZXJcIiwgdmFsdWU6ICQkWyQwXSB9IH0pXG5icmVhaztcbmNhc2UgMTY6eXkuYXN0LnNldCh7IGV4cHJlc3Npb246IHsgdHlwZTogXCJzY3JpcHRfZXhwcmVzc2lvblwiLCB2YWx1ZTogJCRbJDBdIH0gfSlcbmJyZWFrO1xuY2FzZSAxNzp5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcIm51bWVyaWNfbGl0ZXJhbFwiLCB2YWx1ZTogcGFyc2VJbnQoJCRbJDBdKSB9IH0pXG5icmVhaztcbmNhc2UgMTg6XG5icmVhaztcbmNhc2UgMTk6eXkuYXN0LnNldCh7IHNjb3BlOiBcImNoaWxkXCIgfSlcbmJyZWFrO1xuY2FzZSAyMDp5eS5hc3Quc2V0KHsgc2NvcGU6IFwiZGVzY2VuZGFudFwiIH0pXG5icmVhaztcbmNhc2UgMjE6XG5icmVhaztcbmNhc2UgMjI6XG5icmVhaztcbmNhc2UgMjM6XG5icmVhaztcbmNhc2UgMjQ6JCRbJDBdLmxlbmd0aCA+IDE/IHl5LmFzdC5zZXQoeyBleHByZXNzaW9uOiB7IHR5cGU6IFwidW5pb25cIiwgdmFsdWU6ICQkWyQwXSB9IH0pIDogdGhpcy4kID0gJCRbJDBdXG5icmVhaztcbmNhc2UgMjU6dGhpcy4kID0gWyQkWyQwXV1cbmJyZWFrO1xuY2FzZSAyNjp0aGlzLiQgPSAkJFskMC0yXS5jb25jYXQoJCRbJDBdKVxuYnJlYWs7XG5jYXNlIDI3OnRoaXMuJCA9IHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcIm51bWVyaWNfbGl0ZXJhbFwiLCB2YWx1ZTogcGFyc2VJbnQoJCRbJDBdKSB9IH07IHl5LmFzdC5zZXQodGhpcy4kKVxuYnJlYWs7XG5jYXNlIDI4OnRoaXMuJCA9IHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcInN0cmluZ19saXRlcmFsXCIsIHZhbHVlOiAkJFskMF0gfSB9OyB5eS5hc3Quc2V0KHRoaXMuJClcbmJyZWFrO1xuY2FzZSAyOTp0aGlzLiQgPSB7IGV4cHJlc3Npb246IHsgdHlwZTogXCJzbGljZVwiLCB2YWx1ZTogJCRbJDBdIH0gfTsgeXkuYXN0LnNldCh0aGlzLiQpXG5icmVhaztcbmNhc2UgMzA6dGhpcy4kID0geyBleHByZXNzaW9uOiB7IHR5cGU6IFwid2lsZGNhcmRcIiwgdmFsdWU6ICQkWyQwXSB9IH07IHl5LmFzdC5zZXQodGhpcy4kKVxuYnJlYWs7XG5jYXNlIDMxOnRoaXMuJCA9IHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcInNjcmlwdF9leHByZXNzaW9uXCIsIHZhbHVlOiAkJFskMF0gfSB9OyB5eS5hc3Quc2V0KHRoaXMuJClcbmJyZWFrO1xuY2FzZSAzMjp0aGlzLiQgPSB7IGV4cHJlc3Npb246IHsgdHlwZTogXCJmaWx0ZXJfZXhwcmVzc2lvblwiLCB2YWx1ZTogJCRbJDBdIH0gfTsgeXkuYXN0LnNldCh0aGlzLiQpXG5icmVhaztcbmNhc2UgMzM6dGhpcy4kID0gJCRbJDBdXG5icmVhaztcbmNhc2UgMzQ6dGhpcy4kID0gJCRbJDBdXG5icmVhaztcbn1cbn0sXG50YWJsZTogW3szOjEsNDpbMSwyXSw2OjMsMTM6NCwxNTpbMSw1XSwxNjpbMSw2XSwxNzpbMSw3XSwxODpbMSw4XSwxOTpbMSw5XX0sezE6WzNdfSx7MTpbMiwxXSw1OjEwLDc6MTEsODoxMiw5OjEzLDEwOjE0LDExOjE1LDEyOlsxLDE4XSwxNDpbMSwxOV0sMjA6MTYsMjE6MTcsMjI6WzEsMjBdfSx7MTpbMiwzXSw1OjIxLDc6MTEsODoxMiw5OjEzLDEwOjE0LDExOjE1LDEyOlsxLDE4XSwxNDpbMSwxOV0sMjA6MTYsMjE6MTcsMjI6WzEsMjBdfSx7MTpbMiwxMl0sMTI6WzIsMTJdLDE0OlsyLDEyXSwyMjpbMiwxMl19LHsxOlsyLDE0XSwxMjpbMiwxNF0sMTQ6WzIsMTRdLDIyOlsyLDE0XX0sezE6WzIsMTVdLDEyOlsyLDE1XSwxNDpbMiwxNV0sMjI6WzIsMTVdfSx7MTpbMiwxNl0sMTI6WzIsMTZdLDE0OlsyLDE2XSwyMjpbMiwxNl19LHsxOlsyLDE3XSwxMjpbMiwxN10sMTQ6WzIsMTddLDIyOlsyLDE3XX0sezE6WzIsMThdLDEyOlsyLDE4XSwxNDpbMiwxOF0sMjI6WzIsMThdfSx7MTpbMiwyXSw3OjIyLDg6MTIsOToxMywxMDoxNCwxMToxNSwxMjpbMSwxOF0sMTQ6WzEsMTldLDIwOjE2LDIxOjE3LDIyOlsxLDIwXX0sezE6WzIsNV0sMTI6WzIsNV0sMTQ6WzIsNV0sMjI6WzIsNV19LHsxOlsyLDddLDEyOlsyLDddLDE0OlsyLDddLDIyOlsyLDddfSx7MTpbMiw4XSwxMjpbMiw4XSwxNDpbMiw4XSwyMjpbMiw4XX0sezE6WzIsOV0sMTI6WzIsOV0sMTQ6WzIsOV0sMjI6WzIsOV19LHsxOlsyLDEwXSwxMjpbMiwxMF0sMTQ6WzIsMTBdLDIyOlsyLDEwXX0sezE6WzIsMTldLDEyOlsyLDE5XSwxNDpbMiwxOV0sMjI6WzIsMTldfSx7MTpbMiwyMF0sMTI6WzIsMjBdLDE0OlsyLDIwXSwyMjpbMiwyMF19LHsxMzoyMywxNTpbMSw1XSwxNjpbMSw2XSwxNzpbMSw3XSwxODpbMSw4XSwxOTpbMSw5XX0sezEzOjI0LDE1OlsxLDVdLDE2OlsxLDZdLDE3OlsxLDddLDE4OlsxLDhdLDE5OlsxLDldLDIyOlsxLDI1XX0sezE1OlsxLDI5XSwxNzpbMSwzMF0sMTg6WzEsMzNdLDIzOjI2LDI1OjI3LDI2OjI4LDI3OjMyLDI5OjM0LDMwOlsxLDM1XSwzMTpbMSwzMV0sMzI6WzEsMzZdLDMzOlsxLDM3XX0sezE6WzIsNF0sNzoyMiw4OjEyLDk6MTMsMTA6MTQsMTE6MTUsMTI6WzEsMThdLDE0OlsxLDE5XSwyMDoxNiwyMToxNywyMjpbMSwyMF19LHsxOlsyLDZdLDEyOlsyLDZdLDE0OlsyLDZdLDIyOlsyLDZdfSx7MTpbMiwxMV0sMTI6WzIsMTFdLDE0OlsyLDExXSwyMjpbMiwxMV19LHsxOlsyLDEzXSwxMjpbMiwxM10sMTQ6WzIsMTNdLDIyOlsyLDEzXX0sezE1OlsxLDI5XSwxNzpbMSwzMF0sMTg6WzEsMzNdLDIzOjM4LDI1OjI3LDI2OjI4LDI3OjMyLDI5OjM0LDMwOlsxLDM1XSwzMTpbMSwzMV0sMzI6WzEsMzZdLDMzOlsxLDM3XX0sezI0OlsxLDM5XX0sezI0OlsyLDIzXX0sezI0OlsyLDI0XSwyODpbMSw0MF19LHsyNDpbMiwzMF19LHsyNDpbMiwzMV19LHsyNDpbMiwzMl19LHsyNDpbMiwyNV0sMjg6WzIsMjVdfSx7MjQ6WzIsMjddLDI4OlsyLDI3XX0sezI0OlsyLDI4XSwyODpbMiwyOF19LHsyNDpbMiwyOV0sMjg6WzIsMjldfSx7MjQ6WzIsMzNdLDI4OlsyLDMzXX0sezI0OlsyLDM0XSwyODpbMiwzNF19LHsyNDpbMSw0MV19LHsxOlsyLDIxXSwxMjpbMiwyMV0sMTQ6WzIsMjFdLDIyOlsyLDIxXX0sezE4OlsxLDMzXSwyNzo0MiwyOTozNCwzMDpbMSwzNV0sMzI6WzEsMzZdLDMzOlsxLDM3XX0sezE6WzIsMjJdLDEyOlsyLDIyXSwxNDpbMiwyMl0sMjI6WzIsMjJdfSx7MjQ6WzIsMjZdLDI4OlsyLDI2XX1dLFxuZGVmYXVsdEFjdGlvbnM6IHsyNzpbMiwyM10sMjk6WzIsMzBdLDMwOlsyLDMxXSwzMTpbMiwzMl19LFxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICBpZiAoaGFzaC5yZWNvdmVyYWJsZSkge1xuICAgICAgICB0aGlzLnRyYWNlKHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG4gICAgfVxufSxcbnBhcnNlOiBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuICAgIHZhciBzZWxmID0gdGhpcywgc3RhY2sgPSBbMF0sIHZzdGFjayA9IFtudWxsXSwgbHN0YWNrID0gW10sIHRhYmxlID0gdGhpcy50YWJsZSwgeXl0ZXh0ID0gJycsIHl5bGluZW5vID0gMCwgeXlsZW5nID0gMCwgcmVjb3ZlcmluZyA9IDAsIFRFUlJPUiA9IDIsIEVPRiA9IDE7XG4gICAgdmFyIGFyZ3MgPSBsc3RhY2suc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHRoaXMubGV4ZXIuc2V0SW5wdXQoaW5wdXQpO1xuICAgIHRoaXMubGV4ZXIueXkgPSB0aGlzLnl5O1xuICAgIHRoaXMueXkubGV4ZXIgPSB0aGlzLmxleGVyO1xuICAgIHRoaXMueXkucGFyc2VyID0gdGhpcztcbiAgICBpZiAodHlwZW9mIHRoaXMubGV4ZXIueXlsbG9jID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMubGV4ZXIueXlsbG9jID0ge307XG4gICAgfVxuICAgIHZhciB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgIGxzdGFjay5wdXNoKHl5bG9jKTtcbiAgICB2YXIgcmFuZ2VzID0gdGhpcy5sZXhlci5vcHRpb25zICYmIHRoaXMubGV4ZXIub3B0aW9ucy5yYW5nZXM7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnl5LnBhcnNlRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gdGhpcy55eS5wYXJzZUVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5wYXJzZUVycm9yO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwb3BTdGFjayhuKSB7XG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIgKiBuO1xuICAgICAgICB2c3RhY2subGVuZ3RoID0gdnN0YWNrLmxlbmd0aCAtIG47XG4gICAgICAgIGxzdGFjay5sZW5ndGggPSBsc3RhY2subGVuZ3RoIC0gbjtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHRva2VuID0gc2VsZi5sZXhlci5sZXgoKSB8fCBFT0Y7XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHNlbGYuc3ltYm9sc19bdG9rZW5dIHx8IHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG4gICAgdmFyIHN5bWJvbCwgcHJlRXJyb3JTeW1ib2wsIHN0YXRlLCBhY3Rpb24sIGEsIHIsIHl5dmFsID0ge30sIHAsIGxlbiwgbmV3U3RhdGUsIGV4cGVjdGVkO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXSkge1xuICAgICAgICAgICAgYWN0aW9uID0gdGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3ltYm9sID09PSBudWxsIHx8IHR5cGVvZiBzeW1ib2wgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjdGlvbiA9IHRhYmxlW3N0YXRlXSAmJiB0YWJsZVtzdGF0ZV1bc3ltYm9sXTtcbiAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgIWFjdGlvbi5sZW5ndGggfHwgIWFjdGlvblswXSkge1xuICAgICAgICAgICAgICAgIHZhciBlcnJTdHIgPSAnJztcbiAgICAgICAgICAgICAgICBleHBlY3RlZCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAocCBpbiB0YWJsZVtzdGF0ZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGVybWluYWxzX1twXSAmJiBwID4gVEVSUk9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKCdcXCcnICsgdGhpcy50ZXJtaW5hbHNfW3BdICsgJ1xcJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnNob3dQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnICsgKHl5bGluZW5vICsgMSkgKyAnOlxcbicgKyB0aGlzLmxleGVyLnNob3dQb3NpdGlvbigpICsgJ1xcbkV4cGVjdGluZyAnICsgZXhwZWN0ZWQuam9pbignLCAnKSArICcsIGdvdCBcXCcnICsgKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkgKyAnXFwnJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnICsgKHl5bGluZW5vICsgMSkgKyAnOiBVbmV4cGVjdGVkICcgKyAoc3ltYm9sID09IEVPRiA/ICdlbmQgb2YgaW5wdXQnIDogJ1xcJycgKyAodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKSArICdcXCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUVycm9yKGVyclN0ciwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmxleGVyLm1hdGNoLFxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmxleGVyLnl5bGluZW5vLFxuICAgICAgICAgICAgICAgICAgICBsb2M6IHl5bG9jLFxuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvblswXSBpbnN0YW5jZW9mIEFycmF5ICYmIGFjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiAnICsgc3RhdGUgKyAnLCB0b2tlbjogJyArIHN5bWJvbCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc3RhY2sucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuICAgICAgICAgICAgbHN0YWNrLnB1c2godGhpcy5sZXhlci55eWxsb2MpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChhY3Rpb25bMV0pO1xuICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghcHJlRXJyb3JTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcbiAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG4gICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3ZlcmluZy0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XG4gICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG4gICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGggLSBsZW5dO1xuICAgICAgICAgICAgeXl2YWwuXyQgPSB7XG4gICAgICAgICAgICAgICAgZmlyc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5maXJzdF9saW5lLFxuICAgICAgICAgICAgICAgIGxhc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIChsZW4gfHwgMSldLmZpcnN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2NvbHVtblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChyYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB5eXZhbC5fJC5yYW5nZSA9IFtcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5yYW5nZVswXSxcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5yYW5nZVsxXVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByID0gdGhpcy5wZXJmb3JtQWN0aW9uLmFwcGx5KHl5dmFsLCBbXG4gICAgICAgICAgICAgICAgeXl0ZXh0LFxuICAgICAgICAgICAgICAgIHl5bGVuZyxcbiAgICAgICAgICAgICAgICB5eWxpbmVubyxcbiAgICAgICAgICAgICAgICB0aGlzLnl5LFxuICAgICAgICAgICAgICAgIGFjdGlvblsxXSxcbiAgICAgICAgICAgICAgICB2c3RhY2ssXG4gICAgICAgICAgICAgICAgbHN0YWNrXG4gICAgICAgICAgICBdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVuKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5zbGljZSgwLCAtMSAqIGxlbiAqIDIpO1xuICAgICAgICAgICAgICAgIHZzdGFjayA9IHZzdGFjay5zbGljZSgwLCAtMSAqIGxlbik7XG4gICAgICAgICAgICAgICAgbHN0YWNrID0gbHN0YWNrLnNsaWNlKDAsIC0xICogbGVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVswXSk7XG4gICAgICAgICAgICB2c3RhY2sucHVzaCh5eXZhbC4kKTtcbiAgICAgICAgICAgIGxzdGFjay5wdXNoKHl5dmFsLl8kKTtcbiAgICAgICAgICAgIG5ld1N0YXRlID0gdGFibGVbc3RhY2tbc3RhY2subGVuZ3RoIC0gMl1dW3N0YWNrW3N0YWNrLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobmV3U3RhdGUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufX07XG52YXIgX2FzdCA9IHtcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9ub2RlcyA9IFtdO1xuICAgIHRoaXMuX25vZGUgPSB7fTtcbiAgICB0aGlzLl9zdGFzaCA9IFtdO1xuICB9LFxuXG4gIHNldDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICBmb3IgKHZhciBrIGluIHByb3BzKSB0aGlzLl9ub2RlW2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHRoaXMuX25vZGU7XG4gIH0sXG5cbiAgbm9kZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHRoaXMuX25vZGUgPSBvYmo7XG4gICAgcmV0dXJuIHRoaXMuX25vZGU7XG4gIH0sXG5cbiAgcHVzaDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fbm9kZXMucHVzaCh0aGlzLl9ub2RlKTtcbiAgICB0aGlzLl9ub2RlID0ge307XG4gIH0sXG5cbiAgdW5zaGlmdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fbm9kZXMudW5zaGlmdCh0aGlzLl9ub2RlKTtcbiAgICB0aGlzLl9ub2RlID0ge307XG4gIH0sXG5cbiAgeWllbGQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfbm9kZXMgPSB0aGlzLl9ub2RlcztcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICByZXR1cm4gX25vZGVzO1xuICB9XG59O1xuLyogZ2VuZXJhdGVkIGJ5IGppc29uLWxleCAwLjIuMSAqL1xudmFyIGxleGVyID0gKGZ1bmN0aW9uKCl7XG52YXIgbGV4ZXIgPSB7XG5cbkVPRjoxLFxuXG5wYXJzZUVycm9yOmZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG4gICAgICAgIGlmICh0aGlzLnl5LnBhcnNlcikge1xuICAgICAgICAgICAgdGhpcy55eS5wYXJzZXIucGFyc2VFcnJvcihzdHIsIGhhc2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyByZXNldHMgdGhlIGxleGVyLCBzZXRzIG5ldyBpbnB1dFxuc2V0SW5wdXQ6ZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9iYWNrdHJhY2sgPSB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcbiAgICAgICAgdGhpcy55eWxsb2MgPSB7XG4gICAgICAgICAgICBmaXJzdF9saW5lOiAxLFxuICAgICAgICAgICAgZmlyc3RfY29sdW1uOiAwLFxuICAgICAgICAgICAgbGFzdF9saW5lOiAxLFxuICAgICAgICAgICAgbGFzdF9jb2x1bW46IDBcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gWzAsMF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4vLyBjb25zdW1lcyBhbmQgcmV0dXJucyBvbmUgY2hhciBmcm9tIHRoZSBpbnB1dFxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcbiAgICAgICAgdGhpcy55eXRleHQgKz0gY2g7XG4gICAgICAgIHRoaXMueXlsZW5nKys7XG4gICAgICAgIHRoaXMub2Zmc2V0Kys7XG4gICAgICAgIHRoaXMubWF0Y2ggKz0gY2g7XG4gICAgICAgIHRoaXMubWF0Y2hlZCArPSBjaDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuICAgICAgICBpZiAobGluZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsaW5lbm8rKztcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLmxhc3RfbGluZSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4rKztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2VbMV0rKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UoMSk7XG4gICAgICAgIHJldHVybiBjaDtcbiAgICB9LFxuXG4vLyB1bnNoaWZ0cyBvbmUgY2hhciAob3IgYSBzdHJpbmcpIGludG8gdGhlIGlucHV0XG51bnB1dDpmdW5jdGlvbiAoY2gpIHtcbiAgICAgICAgdmFyIGxlbiA9IGNoLmxlbmd0aDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2guc3BsaXQoLyg/Olxcclxcbj98XFxuKS9nKTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XG4gICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy55eXRleHQuc3Vic3RyKDAsIHRoaXMueXl0ZXh0Lmxlbmd0aCAtIGxlbiAtIDEpO1xuICAgICAgICAvL3RoaXMueXlsZW5nIC09IGxlbjtcbiAgICAgICAgdGhpcy5vZmZzZXQgLT0gbGVuO1xuICAgICAgICB2YXIgb2xkTGluZXMgPSB0aGlzLm1hdGNoLnNwbGl0KC8oPzpcXHJcXG4/fFxcbikvZyk7XG4gICAgICAgIHRoaXMubWF0Y2ggPSB0aGlzLm1hdGNoLnN1YnN0cigwLCB0aGlzLm1hdGNoLmxlbmd0aCAtIDEpO1xuICAgICAgICB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSAxKTtcblxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgdGhpcy55eWxpbmVubyAtPSBsaW5lcy5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciByID0gdGhpcy55eWxsb2MucmFuZ2U7XG5cbiAgICAgICAgdGhpcy55eWxsb2MgPSB7XG4gICAgICAgICAgICBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5maXJzdF9saW5lLFxuICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vICsgMSxcbiAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uLFxuICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID9cbiAgICAgICAgICAgICAgICAobGluZXMubGVuZ3RoID09PSBvbGRMaW5lcy5sZW5ndGggPyB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4gOiAwKVxuICAgICAgICAgICAgICAgICArIG9sZExpbmVzW29sZExpbmVzLmxlbmd0aCAtIGxpbmVzLmxlbmd0aF0ubGVuZ3RoIC0gbGluZXNbMF0ubGVuZ3RoIDpcbiAgICAgICAgICAgICAgdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uIC0gbGVuXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gW3JbMF0sIHJbMF0gKyB0aGlzLnl5bGVuZyAtIGxlbl07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbi8vIFdoZW4gY2FsbGVkIGZyb20gYWN0aW9uLCBjYWNoZXMgbWF0Y2hlZCB0ZXh0IGFuZCBhcHBlbmRzIGl0IG9uIG5leHQgYWN0aW9uXG5tb3JlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbi8vIFdoZW4gY2FsbGVkIGZyb20gYWN0aW9uLCBzaWduYWxzIHRoZSBsZXhlciB0aGF0IHRoaXMgcnVsZSBmYWlscyB0byBtYXRjaCB0aGUgaW5wdXQsIHNvIHRoZSBuZXh0IG1hdGNoaW5nIHJ1bGUgKHJlZ2V4KSBzaG91bGQgYmUgdGVzdGVkIGluc3RlYWQuXG5yZWplY3Q6ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJhY2t0cmFja19sZXhlcikge1xuICAgICAgICAgICAgdGhpcy5fYmFja3RyYWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnICsgKHRoaXMueXlsaW5lbm8gKyAxKSArICcuIFlvdSBjYW4gb25seSBpbnZva2UgcmVqZWN0KCkgaW4gdGhlIGxleGVyIHdoZW4gdGhlIGxleGVyIGlzIG9mIHRoZSBiYWNrdHJhY2tpbmcgcGVyc3Vhc2lvbiAob3B0aW9ucy5iYWNrdHJhY2tfbGV4ZXIgPSB0cnVlKS5cXG4nICsgdGhpcy5zaG93UG9zaXRpb24oKSwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiXCIsXG4gICAgICAgICAgICAgICAgdG9rZW46IG51bGwsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy55eWxpbmVub1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4vLyByZXRhaW4gZmlyc3QgbiBjaGFyYWN0ZXJzIG9mIHRoZSBtYXRjaFxubGVzczpmdW5jdGlvbiAobikge1xuICAgICAgICB0aGlzLnVucHV0KHRoaXMubWF0Y2guc2xpY2UobikpO1xuICAgIH0sXG5cbi8vIGRpc3BsYXlzIGFscmVhZHkgbWF0Y2hlZCBpbnB1dCwgaS5lLiBmb3IgZXJyb3IgbWVzc2FnZXNcbnBhc3RJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXN0ID0gdGhpcy5tYXRjaGVkLnN1YnN0cigwLCB0aGlzLm1hdGNoZWQubGVuZ3RoIC0gdGhpcy5tYXRjaC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJzonJykgKyBwYXN0LnN1YnN0cigtMjApLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxuXG4vLyBkaXNwbGF5cyB1cGNvbWluZyBpbnB1dCwgaS5lLiBmb3IgZXJyb3IgbWVzc2FnZXNcbnVwY29taW5nSW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmV4dCA9IHRoaXMubWF0Y2g7XG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA8IDIwKSB7XG4gICAgICAgICAgICBuZXh0ICs9IHRoaXMuX2lucHV0LnN1YnN0cigwLCAyMC1uZXh0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXh0LnN1YnN0cigwLDIwKSArIChuZXh0Lmxlbmd0aCA+IDIwID8gJy4uLicgOiAnJykpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxuXG4vLyBkaXNwbGF5cyB0aGUgY2hhcmFjdGVyIHBvc2l0aW9uIHdoZXJlIHRoZSBsZXhpbmcgZXJyb3Igb2NjdXJyZWQsIGkuZS4gZm9yIGVycm9yIG1lc3NhZ2VzXG5zaG93UG9zaXRpb246ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJlID0gdGhpcy5wYXN0SW5wdXQoKTtcbiAgICAgICAgdmFyIGMgPSBuZXcgQXJyYXkocHJlLmxlbmd0aCArIDEpLmpvaW4oXCItXCIpO1xuICAgICAgICByZXR1cm4gcHJlICsgdGhpcy51cGNvbWluZ0lucHV0KCkgKyBcIlxcblwiICsgYyArIFwiXlwiO1xuICAgIH0sXG5cbi8vIHRlc3QgdGhlIGxleGVkIHRva2VuOiByZXR1cm4gRkFMU0Ugd2hlbiBub3QgYSBtYXRjaCwgb3RoZXJ3aXNlIHJldHVybiB0b2tlblxudGVzdF9tYXRjaDpmdW5jdGlvbiAobWF0Y2gsIGluZGV4ZWRfcnVsZSkge1xuICAgICAgICB2YXIgdG9rZW4sXG4gICAgICAgICAgICBsaW5lcyxcbiAgICAgICAgICAgIGJhY2t1cDtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJhY2t0cmFja19sZXhlcikge1xuICAgICAgICAgICAgLy8gc2F2ZSBjb250ZXh0XG4gICAgICAgICAgICBiYWNrdXAgPSB7XG4gICAgICAgICAgICAgICAgeXlsaW5lbm86IHRoaXMueXlsaW5lbm8sXG4gICAgICAgICAgICAgICAgeXlsbG9jOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmZpcnN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogdGhpcy55eWxsb2MubGFzdF9jb2x1bW5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHl5dGV4dDogdGhpcy55eXRleHQsXG4gICAgICAgICAgICAgICAgbWF0Y2g6IHRoaXMubWF0Y2gsXG4gICAgICAgICAgICAgICAgbWF0Y2hlczogdGhpcy5tYXRjaGVzLFxuICAgICAgICAgICAgICAgIG1hdGNoZWQ6IHRoaXMubWF0Y2hlZCxcbiAgICAgICAgICAgICAgICB5eWxlbmc6IHRoaXMueXlsZW5nLFxuICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgX21vcmU6IHRoaXMuX21vcmUsXG4gICAgICAgICAgICAgICAgX2lucHV0OiB0aGlzLl9pbnB1dCxcbiAgICAgICAgICAgICAgICB5eTogdGhpcy55eSxcbiAgICAgICAgICAgICAgICBjb25kaXRpb25TdGFjazogdGhpcy5jb25kaXRpb25TdGFjay5zbGljZSgwKSxcbiAgICAgICAgICAgICAgICBkb25lOiB0aGlzLmRvbmVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuICAgICAgICAgICAgICAgIGJhY2t1cC55eWxsb2MucmFuZ2UgPSB0aGlzLnl5bGxvYy5yYW5nZS5zbGljZSgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVzID0gbWF0Y2hbMF0ubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuICAgICAgICBpZiAobGluZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsaW5lbm8gKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueXlsbG9jID0ge1xuICAgICAgICAgICAgZmlyc3RfbGluZTogdGhpcy55eWxsb2MubGFzdF9saW5lLFxuICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vICsgMSxcbiAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4sXG4gICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aCAtIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLm1hdGNoKC9cXHI/XFxuPy8pWzBdLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKyBtYXRjaFswXS5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy55eXRleHQgKz0gbWF0Y2hbMF07XG4gICAgICAgIHRoaXMubWF0Y2ggKz0gbWF0Y2hbMF07XG4gICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuICAgICAgICB0aGlzLnl5bGVuZyA9IHRoaXMueXl0ZXh0Lmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gW3RoaXMub2Zmc2V0LCB0aGlzLm9mZnNldCArPSB0aGlzLnl5bGVuZ107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbW9yZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9iYWNrdHJhY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZShtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLm1hdGNoZWQgKz0gbWF0Y2hbMF07XG4gICAgICAgIHRva2VuID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwodGhpcywgdGhpcy55eSwgdGhpcywgaW5kZXhlZF9ydWxlLCB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV0pO1xuICAgICAgICBpZiAodGhpcy5kb25lICYmIHRoaXMuX2lucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9iYWNrdHJhY2spIHtcbiAgICAgICAgICAgIC8vIHJlY292ZXIgY29udGV4dFxuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBiYWNrdXApIHtcbiAgICAgICAgICAgICAgICB0aGlzW2tdID0gYmFja3VwW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBydWxlIGFjdGlvbiBjYWxsZWQgcmVqZWN0KCkgaW1wbHlpbmcgdGhlIG5leHQgcnVsZSBzaG91bGQgYmUgdGVzdGVkIGluc3RlYWQuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbi8vIHJldHVybiBuZXh0IG1hdGNoIGluIGlucHV0XG5uZXh0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5faW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG9rZW4sXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIHRlbXBNYXRjaCxcbiAgICAgICAgICAgIGluZGV4O1xuICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcbiAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5fY3VycmVudFJ1bGVzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRlbXBNYXRjaCA9IHRoaXMuX2lucHV0Lm1hdGNoKHRoaXMucnVsZXNbcnVsZXNbaV1dKTtcbiAgICAgICAgICAgIGlmICh0ZW1wTWF0Y2ggJiYgKCFtYXRjaCB8fCB0ZW1wTWF0Y2hbMF0ubGVuZ3RoID4gbWF0Y2hbMF0ubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoID0gdGVtcE1hdGNoO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJhY2t0cmFja19sZXhlcikge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudGVzdF9tYXRjaCh0ZW1wTWF0Y2gsIHJ1bGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JhY2t0cmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBydWxlIGFjdGlvbiBjYWxsZWQgcmVqZWN0KCkgaW1wbHlpbmcgYSBydWxlIE1JU21hdGNoLlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZTogdGhpcyBpcyBhIGxleGVyIHJ1bGUgd2hpY2ggY29uc3VtZXMgaW5wdXQgd2l0aG91dCBwcm9kdWNpbmcgYSB0b2tlbiAoZS5nLiB3aGl0ZXNwYWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5vcHRpb25zLmZsZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRlc3RfbWF0Y2gobWF0Y2gsIHJ1bGVzW2luZGV4XSk7XG4gICAgICAgICAgICBpZiAodG9rZW4gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZTogdGhpcyBpcyBhIGxleGVyIHJ1bGUgd2hpY2ggY29uc3VtZXMgaW5wdXQgd2l0aG91dCBwcm9kdWNpbmcgYSB0b2tlbiAoZS5nLiB3aGl0ZXNwYWNlKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pbnB1dCA9PT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFcnJvcignTGV4aWNhbCBlcnJvciBvbiBsaW5lICcgKyAodGhpcy55eWxpbmVubyArIDEpICsgJy4gVW5yZWNvZ25pemVkIHRleHQuXFxuJyArIHRoaXMuc2hvd1Bvc2l0aW9uKCksIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICAgICAgICAgIHRva2VuOiBudWxsLFxuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMueXlsaW5lbm9cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuLy8gcmV0dXJuIG5leHQgbWF0Y2ggdGhhdCBoYXMgYSB0b2tlblxubGV4OmZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGV4KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyBhY3RpdmF0ZXMgYSBuZXcgbGV4ZXIgY29uZGl0aW9uIHN0YXRlIChwdXNoZXMgdGhlIG5ldyBsZXhlciBjb25kaXRpb24gc3RhdGUgb250byB0aGUgY29uZGl0aW9uIHN0YWNrKVxuYmVnaW46ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sucHVzaChjb25kaXRpb24pO1xuICAgIH0sXG5cbi8vIHBvcCB0aGUgcHJldmlvdXNseSBhY3RpdmUgbGV4ZXIgY29uZGl0aW9uIHN0YXRlIG9mZiB0aGUgY29uZGl0aW9uIHN0YWNrXG5wb3BTdGF0ZTpmdW5jdGlvbiBwb3BTdGF0ZSgpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1swXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbi8vIHByb2R1Y2UgdGhlIGxleGVyIHJ1bGUgc2V0IHdoaWNoIGlzIGFjdGl2ZSBmb3IgdGhlIGN1cnJlbnRseSBhY3RpdmUgbGV4ZXIgY29uZGl0aW9uIHN0YXRlXG5fY3VycmVudFJ1bGVzOmZ1bmN0aW9uIF9jdXJyZW50UnVsZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAmJiB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnNbdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdXS5ydWxlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnNbXCJJTklUSUFMXCJdLnJ1bGVzO1xuICAgICAgICB9XG4gICAgfSxcblxuLy8gcmV0dXJuIHRoZSBjdXJyZW50bHkgYWN0aXZlIGxleGVyIGNvbmRpdGlvbiBzdGF0ZTsgd2hlbiBhbiBpbmRleCBhcmd1bWVudCBpcyBwcm92aWRlZCBpdCBwcm9kdWNlcyB0aGUgTi10aCBwcmV2aW91cyBjb25kaXRpb24gc3RhdGUsIGlmIGF2YWlsYWJsZVxudG9wU3RhdGU6ZnVuY3Rpb24gdG9wU3RhdGUobikge1xuICAgICAgICBuID0gdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxIC0gTWF0aC5hYnMobiB8fCAwKTtcbiAgICAgICAgaWYgKG4gPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2tbbl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJJTklUSUFMXCI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyBhbGlhcyBmb3IgYmVnaW4oY29uZGl0aW9uKVxucHVzaFN0YXRlOmZ1bmN0aW9uIHB1c2hTdGF0ZShjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5iZWdpbihjb25kaXRpb24pO1xuICAgIH0sXG5cbi8vIHJldHVybiB0aGUgbnVtYmVyIG9mIHN0YXRlcyBjdXJyZW50bHkgb24gdGhlIHN0YWNrXG5zdGF0ZVN0YWNrU2l6ZTpmdW5jdGlvbiBzdGF0ZVN0YWNrU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoO1xuICAgIH0sXG5vcHRpb25zOiB7fSxcbnBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eSx5eV8sJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucyxZWV9TVEFSVFxuLyoqLykge1xuXG52YXIgWVlTVEFURT1ZWV9TVEFSVDtcbnN3aXRjaCgkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zKSB7XG5jYXNlIDA6cmV0dXJuIDRcbmJyZWFrO1xuY2FzZSAxOnJldHVybiAxNFxuYnJlYWs7XG5jYXNlIDI6cmV0dXJuIDEyXG5icmVhaztcbmNhc2UgMzpyZXR1cm4gMTVcbmJyZWFrO1xuY2FzZSA0OnJldHVybiAxNlxuYnJlYWs7XG5jYXNlIDU6cmV0dXJuIDIyXG5icmVhaztcbmNhc2UgNjpyZXR1cm4gMjRcbmJyZWFrO1xuY2FzZSA3OnJldHVybiAyOFxuYnJlYWs7XG5jYXNlIDg6cmV0dXJuIDMwXG5icmVhaztcbmNhc2UgOTpyZXR1cm4gMThcbmJyZWFrO1xuY2FzZSAxMDp5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5zdWJzdHIoMSx5eV8ueXlsZW5nLTIpOyByZXR1cm4gMzI7XG5icmVhaztcbmNhc2UgMTE6eXlfLnl5dGV4dCA9IHl5Xy55eXRleHQuc3Vic3RyKDEseXlfLnl5bGVuZy0yKTsgcmV0dXJuIDMzO1xuYnJlYWs7XG5jYXNlIDEyOnJldHVybiAxN1xuYnJlYWs7XG5jYXNlIDEzOnJldHVybiAzMVxuYnJlYWs7XG59XG59LFxucnVsZXM6IFsvXig/OlxcJCkvLC9eKD86XFwuXFwuKS8sL14oPzpcXC4pLywvXig/OlxcKikvLC9eKD86W2EtekEtWl9dK1thLXpBLVowLTlfXSopLywvXig/OlxcWykvLC9eKD86XFxdKS8sL14oPzosKS8sL14oPzooKC0/KD86MHxbMS05XVswLTldKikpKT9cXDooKC0/KD86MHxbMS05XVswLTldKikpKT8oXFw6KCgtPyg/OjB8WzEtOV1bMC05XSopKSk/KT8pLywvXig/OigtPyg/OjB8WzEtOV1bMC05XSopKSkvLC9eKD86XCIoPzpcXFxcW1wiYmZucnQvXFxcXF18XFxcXHVbYS1mQS1GMC05XXs0fXxbXlwiXFxcXF0pKlwiKS8sL14oPzonKD86XFxcXFsnYmZucnQvXFxcXF18XFxcXHVbYS1mQS1GMC05XXs0fXxbXidcXFxcXSkqJykvLC9eKD86XFwoLis/XFwpKD89XFxdKSkvLC9eKD86XFw/XFwoLis/XFwpKD89XFxdKSkvXSxcbmNvbmRpdGlvbnM6IHtcIklOSVRJQUxcIjp7XCJydWxlc1wiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzXSxcImluY2x1c2l2ZVwiOnRydWV9fVxufTtcbnJldHVybiBsZXhlcjtcbn0pKCk7XG5wYXJzZXIubGV4ZXIgPSBsZXhlcjtcbmZ1bmN0aW9uIFBhcnNlciAoKSB7XG4gIHRoaXMueXkgPSB7fTtcbn1cblBhcnNlci5wcm90b3R5cGUgPSBwYXJzZXI7cGFyc2VyLlBhcnNlciA9IFBhcnNlcjtcbnJldHVybiBuZXcgUGFyc2VyO1xufSkoKTtcblxuXG5pZiAodHlwZW9mIHJlcXVpcmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuZXhwb3J0cy5wYXJzZXIgPSBwYXJzZXI7XG5leHBvcnRzLlBhcnNlciA9IHBhcnNlci5QYXJzZXI7XG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFyc2VyLnBhcnNlLmFwcGx5KHBhcnNlciwgYXJndW1lbnRzKTsgfTtcbmV4cG9ydHMubWFpbiA9IGZ1bmN0aW9uIGNvbW1vbmpzTWFpbihhcmdzKSB7XG4gICAgaWYgKCFhcmdzWzFdKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdVc2FnZTogJythcmdzWzBdKycgRklMRScpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICAgIHZhciBzb3VyY2UgPSByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhyZXF1aXJlKCdwYXRoJykubm9ybWFsaXplKGFyZ3NbMV0pLCBcInV0ZjhcIik7XG4gICAgcmV0dXJuIGV4cG9ydHMucGFyc2VyLnBhcnNlKHNvdXJjZSk7XG59O1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGV4cG9ydHMubWFpbihwcm9jZXNzLmFyZ3Yuc2xpY2UoMSkpO1xufVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSlcbn0se1wiX3Byb2Nlc3NcIjoxNCxcImZzXCI6MTIsXCJwYXRoXCI6MTN9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBpZGVudGlmaWVyOiBcIlthLXpBLVpfXStbYS16QS1aMC05X10qXCIsXG4gIGludGVnZXI6IFwiLT8oPzowfFsxLTldWzAtOV0qKVwiLFxuICBxcV9zdHJpbmc6IFwiXFxcIig/OlxcXFxcXFxcW1xcXCJiZm5ydC9cXFxcXFxcXF18XFxcXFxcXFx1W2EtZkEtRjAtOV17NH18W15cXFwiXFxcXFxcXFxdKSpcXFwiXCIsXG4gIHFfc3RyaW5nOiBcIicoPzpcXFxcXFxcXFtcXCdiZm5ydC9cXFxcXFxcXF18XFxcXFxcXFx1W2EtZkEtRjAtOV17NH18W15cXCdcXFxcXFxcXF0pKidcIlxufTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgZGljdCA9IHJlcXVpcmUoJy4vZGljdCcpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBncmFtbWFyID0ge1xuXG4gICAgbGV4OiB7XG5cbiAgICAgICAgbWFjcm9zOiB7XG4gICAgICAgICAgICBlc2M6IFwiXFxcXFxcXFxcIixcbiAgICAgICAgICAgIGludDogZGljdC5pbnRlZ2VyXG4gICAgICAgIH0sXG5cbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgIFtcIlxcXFwkXCIsIFwicmV0dXJuICdET0xMQVInXCJdLFxuICAgICAgICAgICAgW1wiXFxcXC5cXFxcLlwiLCBcInJldHVybiAnRE9UX0RPVCdcIl0sXG4gICAgICAgICAgICBbXCJcXFxcLlwiLCBcInJldHVybiAnRE9UJ1wiXSxcbiAgICAgICAgICAgIFtcIlxcXFwqXCIsIFwicmV0dXJuICdTVEFSJ1wiXSxcbiAgICAgICAgICAgIFtkaWN0LmlkZW50aWZpZXIsIFwicmV0dXJuICdJREVOVElGSUVSJ1wiXSxcbiAgICAgICAgICAgIFtcIlxcXFxbXCIsIFwicmV0dXJuICdbJ1wiXSxcbiAgICAgICAgICAgIFtcIlxcXFxdXCIsIFwicmV0dXJuICddJ1wiXSxcbiAgICAgICAgICAgIFtcIixcIiwgXCJyZXR1cm4gJywnXCJdLFxuICAgICAgICAgICAgW1wiKHtpbnR9KT9cXFxcOih7aW50fSk/KFxcXFw6KHtpbnR9KT8pP1wiLCBcInJldHVybiAnQVJSQVlfU0xJQ0UnXCJdLFxuICAgICAgICAgICAgW1wie2ludH1cIiwgXCJyZXR1cm4gJ0lOVEVHRVInXCJdLFxuICAgICAgICAgICAgW2RpY3QucXFfc3RyaW5nLCBcInl5dGV4dCA9IHl5dGV4dC5zdWJzdHIoMSx5eWxlbmctMik7IHJldHVybiAnUVFfU1RSSU5HJztcIl0sXG4gICAgICAgICAgICBbZGljdC5xX3N0cmluZywgXCJ5eXRleHQgPSB5eXRleHQuc3Vic3RyKDEseXlsZW5nLTIpOyByZXR1cm4gJ1FfU1RSSU5HJztcIl0sXG4gICAgICAgICAgICBbXCJcXFxcKC4rP1xcXFwpKD89XFxcXF0pXCIsIFwicmV0dXJuICdTQ1JJUFRfRVhQUkVTU0lPTidcIl0sXG4gICAgICAgICAgICBbXCJcXFxcP1xcXFwoLis/XFxcXCkoPz1cXFxcXSlcIiwgXCJyZXR1cm4gJ0ZJTFRFUl9FWFBSRVNTSU9OJ1wiXVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIHN0YXJ0OiBcIkpTT05fUEFUSFwiLFxuXG4gICAgYm5mOiB7XG5cbiAgICAgICAgSlNPTl9QQVRIOiBbXG4gICAgICAgICAgICAgICAgWyAnRE9MTEFSJywgICAgICAgICAgICAgICAgICd5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcInJvb3RcIiwgdmFsdWU6ICQxIH0gfSk7IHl5LmFzdC51bnNoaWZ0KCk7IHJldHVybiB5eS5hc3QueWllbGQoKScgXSxcbiAgICAgICAgICAgICAgICBbICdET0xMQVIgUEFUSF9DT01QT05FTlRTJywgJ3l5LmFzdC5zZXQoeyBleHByZXNzaW9uOiB7IHR5cGU6IFwicm9vdFwiLCB2YWx1ZTogJDEgfSB9KTsgeXkuYXN0LnVuc2hpZnQoKTsgcmV0dXJuIHl5LmFzdC55aWVsZCgpJyBdLFxuICAgICAgICAgICAgICAgIFsgJ0xFQURJTkdfQ0hJTERfTUVNQkVSX0VYUFJFU1NJT04nLCAgICAgICAgICAgICAgICAgJ3l5LmFzdC51bnNoaWZ0KCk7IHJldHVybiB5eS5hc3QueWllbGQoKScgXSxcbiAgICAgICAgICAgICAgICBbICdMRUFESU5HX0NISUxEX01FTUJFUl9FWFBSRVNTSU9OIFBBVEhfQ09NUE9ORU5UUycsICd5eS5hc3Quc2V0KHsgb3BlcmF0aW9uOiBcIm1lbWJlclwiLCBzY29wZTogXCJjaGlsZFwiLCBleHByZXNzaW9uOiB7IHR5cGU6IFwiaWRlbnRpZmllclwiLCB2YWx1ZTogJDEgfX0pOyB5eS5hc3QudW5zaGlmdCgpOyByZXR1cm4geXkuYXN0LnlpZWxkKCknIF0gXSxcblxuICAgICAgICBQQVRIX0NPTVBPTkVOVFM6IFtcbiAgICAgICAgICAgICAgICBbICdQQVRIX0NPTVBPTkVOVCcsICAgICAgICAgICAgICAgICAnJyBdLFxuICAgICAgICAgICAgICAgIFsgJ1BBVEhfQ09NUE9ORU5UUyBQQVRIX0NPTVBPTkVOVCcsICcnIF0gXSxcblxuICAgICAgICBQQVRIX0NPTVBPTkVOVDogW1xuICAgICAgICAgICAgICAgIFsgJ01FTUJFUl9DT01QT05FTlQnLCAgICAneXkuYXN0LnNldCh7IG9wZXJhdGlvbjogXCJtZW1iZXJcIiB9KTsgeXkuYXN0LnB1c2goKScgXSxcbiAgICAgICAgICAgICAgICBbICdTVUJTQ1JJUFRfQ09NUE9ORU5UJywgJ3l5LmFzdC5zZXQoeyBvcGVyYXRpb246IFwic3Vic2NyaXB0XCIgfSk7IHl5LmFzdC5wdXNoKCkgJyBdIF0sXG5cbiAgICAgICAgTUVNQkVSX0NPTVBPTkVOVDogW1xuICAgICAgICAgICAgICAgIFsgJ0NISUxEX01FTUJFUl9DT01QT05FTlQnLCAgICAgICd5eS5hc3Quc2V0KHsgc2NvcGU6IFwiY2hpbGRcIiB9KScgXSxcbiAgICAgICAgICAgICAgICBbICdERVNDRU5EQU5UX01FTUJFUl9DT01QT05FTlQnLCAneXkuYXN0LnNldCh7IHNjb3BlOiBcImRlc2NlbmRhbnRcIiB9KScgXSBdLFxuXG4gICAgICAgIENISUxEX01FTUJFUl9DT01QT05FTlQ6IFtcbiAgICAgICAgICAgICAgICBbICdET1QgTUVNQkVSX0VYUFJFU1NJT04nLCAnJyBdIF0sXG5cbiAgICAgICAgTEVBRElOR19DSElMRF9NRU1CRVJfRVhQUkVTU0lPTjogW1xuICAgICAgICAgICAgICAgIFsgJ01FTUJFUl9FWFBSRVNTSU9OJywgJ3l5LmFzdC5zZXQoeyBzY29wZTogXCJjaGlsZFwiLCBvcGVyYXRpb246IFwibWVtYmVyXCIgfSknIF0gXSxcblxuICAgICAgICBERVNDRU5EQU5UX01FTUJFUl9DT01QT05FTlQ6IFtcbiAgICAgICAgICAgICAgICBbICdET1RfRE9UIE1FTUJFUl9FWFBSRVNTSU9OJywgJycgXSBdLFxuXG4gICAgICAgIE1FTUJFUl9FWFBSRVNTSU9OOiBbXG4gICAgICAgICAgICAgICAgWyAnU1RBUicsICAgICAgICAgICAgICAneXkuYXN0LnNldCh7IGV4cHJlc3Npb246IHsgdHlwZTogXCJ3aWxkY2FyZFwiLCB2YWx1ZTogJDEgfSB9KScgXSxcbiAgICAgICAgICAgICAgICBbICdJREVOVElGSUVSJywgICAgICAgICd5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcImlkZW50aWZpZXJcIiwgdmFsdWU6ICQxIH0gfSknIF0sXG4gICAgICAgICAgICAgICAgWyAnU0NSSVBUX0VYUFJFU1NJT04nLCAneXkuYXN0LnNldCh7IGV4cHJlc3Npb246IHsgdHlwZTogXCJzY3JpcHRfZXhwcmVzc2lvblwiLCB2YWx1ZTogJDEgfSB9KScgXSxcbiAgICAgICAgICAgICAgICBbICdJTlRFR0VSJywgICAgICAgICAgICd5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcIm51bWVyaWNfbGl0ZXJhbFwiLCB2YWx1ZTogcGFyc2VJbnQoJDEpIH0gfSknIF0sXG4gICAgICAgICAgICAgICAgWyAnRU5EJywgICAgICAgICAgICAgICAnJyBdIF0sXG5cbiAgICAgICAgU1VCU0NSSVBUX0NPTVBPTkVOVDogW1xuICAgICAgICAgICAgICAgIFsgJ0NISUxEX1NVQlNDUklQVF9DT01QT05FTlQnLCAgICAgICd5eS5hc3Quc2V0KHsgc2NvcGU6IFwiY2hpbGRcIiB9KScgXSxcbiAgICAgICAgICAgICAgICBbICdERVNDRU5EQU5UX1NVQlNDUklQVF9DT01QT05FTlQnLCAneXkuYXN0LnNldCh7IHNjb3BlOiBcImRlc2NlbmRhbnRcIiB9KScgXSBdLFxuXG4gICAgICAgIENISUxEX1NVQlNDUklQVF9DT01QT05FTlQ6IFtcbiAgICAgICAgICAgICAgICBbICdbIFNVQlNDUklQVCBdJywgJycgXSBdLFxuXG4gICAgICAgIERFU0NFTkRBTlRfU1VCU0NSSVBUX0NPTVBPTkVOVDogW1xuICAgICAgICAgICAgICAgIFsgJ0RPVF9ET1QgWyBTVUJTQ1JJUFQgXScsICcnIF0gXSxcblxuICAgICAgICBTVUJTQ1JJUFQ6IFtcbiAgICAgICAgICAgICAgICBbICdTVUJTQ1JJUFRfRVhQUkVTU0lPTicsICcnIF0sXG4gICAgICAgICAgICAgICAgWyAnU1VCU0NSSVBUX0VYUFJFU1NJT05fTElTVCcsICckMS5sZW5ndGggPiAxPyB5eS5hc3Quc2V0KHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcInVuaW9uXCIsIHZhbHVlOiAkMSB9IH0pIDogJCQgPSAkMScgXSBdLFxuXG4gICAgICAgIFNVQlNDUklQVF9FWFBSRVNTSU9OX0xJU1Q6IFtcbiAgICAgICAgICAgICAgICBbICdTVUJTQ1JJUFRfRVhQUkVTU0lPTl9MSVNUQUJMRScsICckJCA9IFskMV0nXSxcbiAgICAgICAgICAgICAgICBbICdTVUJTQ1JJUFRfRVhQUkVTU0lPTl9MSVNUICwgU1VCU0NSSVBUX0VYUFJFU1NJT05fTElTVEFCTEUnLCAnJCQgPSAkMS5jb25jYXQoJDMpJyBdIF0sXG5cbiAgICAgICAgU1VCU0NSSVBUX0VYUFJFU1NJT05fTElTVEFCTEU6IFtcbiAgICAgICAgICAgICAgICBbICdJTlRFR0VSJywgICAgICAgICAgICckJCA9IHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcIm51bWVyaWNfbGl0ZXJhbFwiLCB2YWx1ZTogcGFyc2VJbnQoJDEpIH0gfTsgeXkuYXN0LnNldCgkJCknIF0sXG4gICAgICAgICAgICAgICAgWyAnU1RSSU5HX0xJVEVSQUwnLCAgICAnJCQgPSB7IGV4cHJlc3Npb246IHsgdHlwZTogXCJzdHJpbmdfbGl0ZXJhbFwiLCB2YWx1ZTogJDEgfSB9OyB5eS5hc3Quc2V0KCQkKScgXSxcbiAgICAgICAgICAgICAgICBbICdBUlJBWV9TTElDRScsICAgICAgICckJCA9IHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcInNsaWNlXCIsIHZhbHVlOiAkMSB9IH07IHl5LmFzdC5zZXQoJCQpJyBdIF0sXG5cbiAgICAgICAgU1VCU0NSSVBUX0VYUFJFU1NJT046IFtcbiAgICAgICAgICAgICAgICBbICdTVEFSJywgICAgICAgICAgICAgICckJCA9IHsgZXhwcmVzc2lvbjogeyB0eXBlOiBcIndpbGRjYXJkXCIsIHZhbHVlOiAkMSB9IH07IHl5LmFzdC5zZXQoJCQpJyBdLFxuICAgICAgICAgICAgICAgIFsgJ1NDUklQVF9FWFBSRVNTSU9OJywgJyQkID0geyBleHByZXNzaW9uOiB7IHR5cGU6IFwic2NyaXB0X2V4cHJlc3Npb25cIiwgdmFsdWU6ICQxIH0gfTsgeXkuYXN0LnNldCgkJCknIF0sXG4gICAgICAgICAgICAgICAgWyAnRklMVEVSX0VYUFJFU1NJT04nLCAnJCQgPSB7IGV4cHJlc3Npb246IHsgdHlwZTogXCJmaWx0ZXJfZXhwcmVzc2lvblwiLCB2YWx1ZTogJDEgfSB9OyB5eS5hc3Quc2V0KCQkKScgXSBdLFxuXG4gICAgICAgIFNUUklOR19MSVRFUkFMOiBbXG4gICAgICAgICAgICAgICAgWyAnUVFfU1RSSU5HJywgXCIkJCA9ICQxXCIgXSxcbiAgICAgICAgICAgICAgICBbICdRX1NUUklORycsICBcIiQkID0gJDFcIiBdIF1cbiAgICB9XG59O1xuaWYgKGZzLnJlYWRGaWxlU3luYykge1xuICBncmFtbWFyLm1vZHVsZUluY2x1ZGUgPSBmcy5yZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKFwiLi4vaW5jbHVkZS9tb2R1bGUuanNcIikpO1xuICBncmFtbWFyLmFjdGlvbkluY2x1ZGUgPSBmcy5yZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKFwiLi4vaW5jbHVkZS9hY3Rpb24uanNcIikpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdyYW1tYXI7XG5cbn0se1wiLi9kaWN0XCI6MixcImZzXCI6MTJ9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBhZXNwcmltID0gcmVxdWlyZSgnLi9hZXNwcmltJyk7XG52YXIgc2xpY2UgPSByZXF1aXJlKCcuL3NsaWNlJyk7XG52YXIgX2V2YWx1YXRlID0gcmVxdWlyZSgnc3RhdGljLWV2YWwnKTtcbnZhciBfdW5pcSA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKS51bmlxO1xuXG52YXIgSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5IYW5kbGVycy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRyYXZlcnNlID0gdHJhdmVyc2VyKHRydWUpO1xuICB0aGlzLmRlc2NlbmQgPSB0cmF2ZXJzZXIoKTtcbn1cblxuSGFuZGxlcnMucHJvdG90eXBlLmtleXMgPSBPYmplY3Qua2V5cztcblxuSGFuZGxlcnMucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihjb21wb25lbnQpIHtcblxuICB2YXIga2V5ID0gWyBjb21wb25lbnQub3BlcmF0aW9uLCBjb21wb25lbnQuc2NvcGUsIGNvbXBvbmVudC5leHByZXNzaW9uLnR5cGUgXS5qb2luKCctJyk7XG4gIHZhciBtZXRob2QgPSB0aGlzLl9mbnNba2V5XTtcblxuICBpZiAoIW1ldGhvZCkgdGhyb3cgbmV3IEVycm9yKFwiY291bGRuJ3QgcmVzb2x2ZSBrZXk6IFwiICsga2V5KTtcbiAgcmV0dXJuIG1ldGhvZC5iaW5kKHRoaXMpO1xufTtcblxuSGFuZGxlcnMucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24oa2V5LCBoYW5kbGVyKSB7XG5cbiAgaWYgKCFoYW5kbGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJoYW5kbGVyIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHRoaXMuX2Zuc1trZXldID0gaGFuZGxlcjtcbn07XG5cbkhhbmRsZXJzLnByb3RvdHlwZS5fZm5zID0ge1xuXG4gICdtZW1iZXItY2hpbGQtaWRlbnRpZmllcic6IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFydGlhbCkge1xuICAgIHZhciBrZXkgPSBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZTtcbiAgICB2YXIgdmFsdWUgPSBwYXJ0aWFsLnZhbHVlO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCAmJiBrZXkgaW4gdmFsdWUpIHtcbiAgICAgIHJldHVybiBbIHsgdmFsdWU6IHZhbHVlW2tleV0sIHBhdGg6IHBhcnRpYWwucGF0aC5jb25jYXQoa2V5KSB9IF1cbiAgICB9XG4gIH0sXG5cbiAgJ21lbWJlci1kZXNjZW5kYW50LWlkZW50aWZpZXInOlxuICAgIF90cmF2ZXJzZShmdW5jdGlvbihrZXksIHZhbHVlLCByZWYpIHsgcmV0dXJuIGtleSA9PSByZWYgfSksXG5cbiAgJ3N1YnNjcmlwdC1jaGlsZC1udW1lcmljX2xpdGVyYWwnOlxuICAgIF9kZXNjZW5kKGZ1bmN0aW9uKGtleSwgdmFsdWUsIHJlZikgeyByZXR1cm4ga2V5ID09PSByZWYgfSksXG5cbiAgJ21lbWJlci1jaGlsZC1udW1lcmljX2xpdGVyYWwnOlxuICAgIF9kZXNjZW5kKGZ1bmN0aW9uKGtleSwgdmFsdWUsIHJlZikgeyByZXR1cm4gU3RyaW5nKGtleSkgPT09IFN0cmluZyhyZWYpIH0pLFxuXG4gICdzdWJzY3JpcHQtZGVzY2VuZGFudC1udW1lcmljX2xpdGVyYWwnOlxuICAgIF90cmF2ZXJzZShmdW5jdGlvbihrZXksIHZhbHVlLCByZWYpIHsgcmV0dXJuIGtleSA9PT0gcmVmIH0pLFxuXG4gICdtZW1iZXItY2hpbGQtd2lsZGNhcmQnOlxuICAgIF9kZXNjZW5kKGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9KSxcblxuICAnbWVtYmVyLWRlc2NlbmRhbnQtd2lsZGNhcmQnOlxuICAgIF90cmF2ZXJzZShmdW5jdGlvbigpIHsgcmV0dXJuIHRydWUgfSksXG5cbiAgJ3N1YnNjcmlwdC1kZXNjZW5kYW50LXdpbGRjYXJkJzpcbiAgICBfdHJhdmVyc2UoZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0pLFxuXG4gICdzdWJzY3JpcHQtY2hpbGQtd2lsZGNhcmQnOlxuICAgIF9kZXNjZW5kKGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9KSxcblxuICAnc3Vic2NyaXB0LWNoaWxkLXNsaWNlJzogZnVuY3Rpb24oY29tcG9uZW50LCBwYXJ0aWFsKSB7XG4gICAgaWYgKGlzX2FycmF5KHBhcnRpYWwudmFsdWUpKSB7XG4gICAgICB2YXIgYXJncyA9IGNvbXBvbmVudC5leHByZXNzaW9uLnZhbHVlLnNwbGl0KCc6JykubWFwKF9wYXJzZV9udWxsYWJsZV9pbnQpO1xuICAgICAgdmFyIHZhbHVlcyA9IHBhcnRpYWwudmFsdWUubWFwKGZ1bmN0aW9uKHYsIGkpIHsgcmV0dXJuIHsgdmFsdWU6IHYsIHBhdGg6IHBhcnRpYWwucGF0aC5jb25jYXQoaSkgfSB9KTtcbiAgICAgIHJldHVybiBzbGljZS5hcHBseShudWxsLCBbdmFsdWVzXS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfSxcblxuICAnc3Vic2NyaXB0LWNoaWxkLXVuaW9uJzogZnVuY3Rpb24oY29tcG9uZW50LCBwYXJ0aWFsKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgICAgdmFyIF9jb21wb25lbnQgPSB7IG9wZXJhdGlvbjogJ3N1YnNjcmlwdCcsIHNjb3BlOiAnY2hpbGQnLCBleHByZXNzaW9uOiBjb21wb25lbnQuZXhwcmVzc2lvbiB9O1xuICAgICAgdmFyIGhhbmRsZXIgPSB0aGlzLnJlc29sdmUoX2NvbXBvbmVudCk7XG4gICAgICB2YXIgX3Jlc3VsdHMgPSBoYW5kbGVyKF9jb21wb25lbnQsIHBhcnRpYWwpO1xuICAgICAgaWYgKF9yZXN1bHRzKSB7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChfcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdW5pcXVlKHJlc3VsdHMpO1xuICB9LFxuXG4gICdzdWJzY3JpcHQtZGVzY2VuZGFudC11bmlvbic6IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFydGlhbCwgY291bnQpIHtcblxuICAgIHZhciBqcCA9IHJlcXVpcmUoJy4uJyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgbm9kZXMgPSBqcC5ub2RlcyhwYXJ0aWFsLCAnJC4uKicpLnNsaWNlKDEpO1xuXG4gICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAocmVzdWx0cy5sZW5ndGggPj0gY291bnQpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudC5leHByZXNzaW9uLnZhbHVlLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgICAgIHZhciBfY29tcG9uZW50ID0geyBvcGVyYXRpb246ICdzdWJzY3JpcHQnLCBzY29wZTogJ2NoaWxkJywgZXhwcmVzc2lvbjogY29tcG9uZW50LmV4cHJlc3Npb24gfTtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBzZWxmLnJlc29sdmUoX2NvbXBvbmVudCk7XG4gICAgICAgIHZhciBfcmVzdWx0cyA9IGhhbmRsZXIoX2NvbXBvbmVudCwgbm9kZSk7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChfcmVzdWx0cyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB1bmlxdWUocmVzdWx0cyk7XG4gIH0sXG5cbiAgJ3N1YnNjcmlwdC1jaGlsZC1maWx0ZXJfZXhwcmVzc2lvbic6IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFydGlhbCwgY291bnQpIHtcblxuICAgIC8vIHNsaWNlIG91dCB0aGUgZXhwcmVzc2lvbiBmcm9tID8oZXhwcmVzc2lvbilcbiAgICB2YXIgc3JjID0gY29tcG9uZW50LmV4cHJlc3Npb24udmFsdWUuc2xpY2UoMiwgLTEpO1xuICAgIHZhciBhc3QgPSBhZXNwcmltLnBhcnNlKHNyYykuYm9keVswXS5leHByZXNzaW9uO1xuXG4gICAgdmFyIHBhc3NhYmxlID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGV2YWx1YXRlKGFzdCwgeyAnQCc6IHZhbHVlIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRlc2NlbmQocGFydGlhbCwgbnVsbCwgcGFzc2FibGUsIGNvdW50KTtcblxuICB9LFxuXG4gICdzdWJzY3JpcHQtZGVzY2VuZGFudC1maWx0ZXJfZXhwcmVzc2lvbic6IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFydGlhbCwgY291bnQpIHtcblxuICAgIC8vIHNsaWNlIG91dCB0aGUgZXhwcmVzc2lvbiBmcm9tID8oZXhwcmVzc2lvbilcbiAgICB2YXIgc3JjID0gY29tcG9uZW50LmV4cHJlc3Npb24udmFsdWUuc2xpY2UoMiwgLTEpO1xuICAgIHZhciBhc3QgPSBhZXNwcmltLnBhcnNlKHNyYykuYm9keVswXS5leHByZXNzaW9uO1xuXG4gICAgdmFyIHBhc3NhYmxlID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGV2YWx1YXRlKGFzdCwgeyAnQCc6IHZhbHVlIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRyYXZlcnNlKHBhcnRpYWwsIG51bGwsIHBhc3NhYmxlLCBjb3VudCk7XG4gIH0sXG5cbiAgJ3N1YnNjcmlwdC1jaGlsZC1zY3JpcHRfZXhwcmVzc2lvbic6IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFydGlhbCkge1xuICAgIHZhciBleHAgPSBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgcmV0dXJuIGV2YWxfcmVjdXJzZShwYXJ0aWFsLCBleHAsICckW3t7dmFsdWV9fV0nKTtcbiAgfSxcblxuICAnbWVtYmVyLWNoaWxkLXNjcmlwdF9leHByZXNzaW9uJzogZnVuY3Rpb24oY29tcG9uZW50LCBwYXJ0aWFsKSB7XG4gICAgdmFyIGV4cCA9IGNvbXBvbmVudC5leHByZXNzaW9uLnZhbHVlLnNsaWNlKDEsIC0xKTtcbiAgICByZXR1cm4gZXZhbF9yZWN1cnNlKHBhcnRpYWwsIGV4cCwgJyQue3t2YWx1ZX19Jyk7XG4gIH0sXG5cbiAgJ21lbWJlci1kZXNjZW5kYW50LXNjcmlwdF9leHByZXNzaW9uJzogZnVuY3Rpb24oY29tcG9uZW50LCBwYXJ0aWFsKSB7XG4gICAgdmFyIGV4cCA9IGNvbXBvbmVudC5leHByZXNzaW9uLnZhbHVlLnNsaWNlKDEsIC0xKTtcbiAgICByZXR1cm4gZXZhbF9yZWN1cnNlKHBhcnRpYWwsIGV4cCwgJyQuLnZhbHVlJyk7XG4gIH1cbn07XG5cbkhhbmRsZXJzLnByb3RvdHlwZS5fZm5zWydzdWJzY3JpcHQtY2hpbGQtc3RyaW5nX2xpdGVyYWwnXSA9XG5cdEhhbmRsZXJzLnByb3RvdHlwZS5fZm5zWydtZW1iZXItY2hpbGQtaWRlbnRpZmllciddO1xuXG5IYW5kbGVycy5wcm90b3R5cGUuX2Zuc1snbWVtYmVyLWRlc2NlbmRhbnQtbnVtZXJpY19saXRlcmFsJ10gPVxuICAgIEhhbmRsZXJzLnByb3RvdHlwZS5fZm5zWydzdWJzY3JpcHQtZGVzY2VuZGFudC1zdHJpbmdfbGl0ZXJhbCddID1cbiAgICBIYW5kbGVycy5wcm90b3R5cGUuX2Zuc1snbWVtYmVyLWRlc2NlbmRhbnQtaWRlbnRpZmllciddO1xuXG5mdW5jdGlvbiBldmFsX3JlY3Vyc2UocGFydGlhbCwgc3JjLCB0ZW1wbGF0ZSkge1xuXG4gIHZhciBqcCA9IHJlcXVpcmUoJy4vaW5kZXgnKTtcbiAgdmFyIGFzdCA9IGFlc3ByaW0ucGFyc2Uoc3JjKS5ib2R5WzBdLmV4cHJlc3Npb247XG4gIHZhciB2YWx1ZSA9IGV2YWx1YXRlKGFzdCwgeyAnQCc6IHBhcnRpYWwudmFsdWUgfSk7XG4gIHZhciBwYXRoID0gdGVtcGxhdGUucmVwbGFjZSgvXFx7XFx7XFxzKnZhbHVlXFxzKlxcfVxcfS9nLCB2YWx1ZSk7XG5cbiAgdmFyIHJlc3VsdHMgPSBqcC5ub2RlcyhwYXJ0aWFsLnZhbHVlLCBwYXRoKTtcbiAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICByLnBhdGggPSBwYXJ0aWFsLnBhdGguY29uY2F0KHIucGF0aC5zbGljZSgxKSk7XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5mdW5jdGlvbiBpc19hcnJheSh2YWwpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKTtcbn1cblxuZnVuY3Rpb24gaXNfb2JqZWN0KHZhbCkge1xuICAvLyBpcyB0aGlzIGEgbm9uLWFycmF5LCBub24tbnVsbCBvYmplY3Q/XG4gIHJldHVybiB2YWwgJiYgISh2YWwgaW5zdGFuY2VvZiBBcnJheSkgJiYgdmFsIGluc3RhbmNlb2YgT2JqZWN0O1xufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZXIocmVjdXJzZSkge1xuXG4gIHJldHVybiBmdW5jdGlvbihwYXJ0aWFsLCByZWYsIHBhc3NhYmxlLCBjb3VudCkge1xuXG4gICAgdmFyIHZhbHVlID0gcGFydGlhbC52YWx1ZTtcbiAgICB2YXIgcGF0aCA9IHBhcnRpYWwucGF0aDtcblxuICAgIHZhciByZXN1bHRzID0gW107XG5cbiAgICB2YXIgZGVzY2VuZCA9IGZ1bmN0aW9uKHZhbHVlLCBwYXRoKSB7XG5cbiAgICAgIGlmIChpc19hcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA+PSBjb3VudCkgeyByZXR1cm4gfVxuICAgICAgICAgIGlmIChwYXNzYWJsZShpbmRleCwgZWxlbWVudCwgcmVmKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHsgcGF0aDogcGF0aC5jb25jYXQoaW5kZXgpLCB2YWx1ZTogZWxlbWVudCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID49IGNvdW50KSB7IHJldHVybiB9XG4gICAgICAgICAgaWYgKHJlY3Vyc2UpIHtcbiAgICAgICAgICAgIGRlc2NlbmQoZWxlbWVudCwgcGF0aC5jb25jYXQoaW5kZXgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChpc19vYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHRoaXMua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID49IGNvdW50KSB7IHJldHVybiB9XG4gICAgICAgICAgaWYgKHBhc3NhYmxlKGssIHZhbHVlW2tdLCByZWYpKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goeyBwYXRoOiBwYXRoLmNvbmNhdChrKSwgdmFsdWU6IHZhbHVlW2tdIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPj0gY291bnQpIHsgcmV0dXJuIH1cbiAgICAgICAgICBpZiAocmVjdXJzZSkge1xuICAgICAgICAgICAgZGVzY2VuZCh2YWx1ZVtrXSwgcGF0aC5jb25jYXQoaykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIGRlc2NlbmQodmFsdWUsIHBhdGgpO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZXNjZW5kKHBhc3NhYmxlKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb21wb25lbnQsIHBhcnRpYWwsIGNvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzY2VuZChwYXJ0aWFsLCBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZSwgcGFzc2FibGUsIGNvdW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfdHJhdmVyc2UocGFzc2FibGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFydGlhbCwgY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy50cmF2ZXJzZShwYXJ0aWFsLCBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZSwgcGFzc2FibGUsIGNvdW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBldmFsdWF0ZSgpIHtcbiAgdHJ5IHsgcmV0dXJuIF9ldmFsdWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIH1cbiAgY2F0Y2ggKGUpIHsgfVxufVxuXG5mdW5jdGlvbiB1bmlxdWUocmVzdWx0cykge1xuICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZCB9KVxuICByZXR1cm4gX3VuaXEoXG4gICAgcmVzdWx0cyxcbiAgICBmdW5jdGlvbihyKSB7IHJldHVybiByLnBhdGgubWFwKGZ1bmN0aW9uKGMpIHsgcmV0dXJuIFN0cmluZyhjKS5yZXBsYWNlKCctJywgJy0tJykgfSkuam9pbignLScpIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gX3BhcnNlX251bGxhYmxlX2ludCh2YWwpIHtcbiAgdmFyIHN2YWwgPSBTdHJpbmcodmFsKTtcbiAgcmV0dXJuIHN2YWwubWF0Y2goL14tP1swLTldKyQvKSA/IHBhcnNlSW50KHN2YWwpIDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGVycztcblxufSx7XCIuLlwiOlwianNvbnBhdGhcIixcIi4vYWVzcHJpbVwiOlwiLi9hZXNwcmltXCIsXCIuL2luZGV4XCI6NSxcIi4vc2xpY2VcIjo3LFwic3RhdGljLWV2YWxcIjoxNSxcInVuZGVyc2NvcmVcIjoxMn1dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xudmFyIGRpY3QgPSByZXF1aXJlKCcuL2RpY3QnKTtcbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcicpO1xudmFyIEhhbmRsZXJzID0gcmVxdWlyZSgnLi9oYW5kbGVycycpO1xuXG52YXIgSlNPTlBhdGggPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5KU09OUGF0aC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhcnNlciA9IG5ldyBQYXJzZXIoKTtcbiAgdGhpcy5oYW5kbGVycyA9IG5ldyBIYW5kbGVycygpO1xufTtcblxuSlNPTlBhdGgucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIGFzc2VydC5vayhfaXNfc3RyaW5nKHN0cmluZyksIFwid2UgbmVlZCBhIHBhdGhcIik7XG4gIHJldHVybiB0aGlzLnBhcnNlci5wYXJzZShzdHJpbmcpO1xufTtcblxuSlNPTlBhdGgucHJvdG90eXBlLnBhcmVudCA9IGZ1bmN0aW9uKG9iaiwgc3RyaW5nKSB7XG5cbiAgYXNzZXJ0Lm9rKG9iaiBpbnN0YW5jZW9mIE9iamVjdCwgXCJvYmogbmVlZHMgdG8gYmUgYW4gb2JqZWN0XCIpO1xuICBhc3NlcnQub2soc3RyaW5nLCBcIndlIG5lZWQgYSBwYXRoXCIpO1xuXG4gIHZhciBub2RlID0gdGhpcy5ub2RlcyhvYmosIHN0cmluZylbMF07XG4gIHZhciBrZXkgPSBub2RlLnBhdGgucG9wKCk7IC8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cbiAgcmV0dXJuIHRoaXMudmFsdWUob2JqLCBub2RlLnBhdGgpO1xufVxuXG5KU09OUGF0aC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbihvYmosIHN0cmluZywgZm4pIHtcblxuICBhc3NlcnQub2sob2JqIGluc3RhbmNlb2YgT2JqZWN0LCBcIm9iaiBuZWVkcyB0byBiZSBhbiBvYmplY3RcIik7XG4gIGFzc2VydC5vayhzdHJpbmcsIFwid2UgbmVlZCBhIHBhdGhcIik7XG4gIGFzc2VydC5lcXVhbCh0eXBlb2YgZm4sIFwiZnVuY3Rpb25cIiwgXCJmbiBuZWVkcyB0byBiZSBmdW5jdGlvblwiKVxuXG4gIHZhciBub2RlcyA9IHRoaXMubm9kZXMob2JqLCBzdHJpbmcpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIC8vIHNvcnQgbm9kZXMgc28gd2UgYXBwbHkgZnJvbSB0aGUgYm90dG9tIHVwXG4gICAgcmV0dXJuIGIucGF0aC5sZW5ndGggLSBhLnBhdGgubGVuZ3RoO1xuICB9KTtcblxuICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIga2V5ID0gbm9kZS5wYXRoLnBvcCgpO1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnZhbHVlKG9iaiwgdGhpcy5zdHJpbmdpZnkobm9kZS5wYXRoKSk7XG4gICAgdmFyIHZhbCA9IG5vZGUudmFsdWUgPSBmbi5jYWxsKG9iaiwgcGFyZW50W2tleV0pO1xuICAgIHBhcmVudFtrZXldID0gdmFsO1xuICB9LCB0aGlzKTtcblxuICByZXR1cm4gbm9kZXM7XG59XG5cbkpTT05QYXRoLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKG9iaiwgcGF0aCwgdmFsdWUpIHtcblxuICBhc3NlcnQub2sob2JqIGluc3RhbmNlb2YgT2JqZWN0LCBcIm9iaiBuZWVkcyB0byBiZSBhbiBvYmplY3RcIik7XG4gIGFzc2VydC5vayhwYXRoLCBcIndlIG5lZWQgYSBwYXRoXCIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubm9kZXMob2JqLCBwYXRoKS5zaGlmdCgpO1xuICAgIGlmICghbm9kZSkgcmV0dXJuIHRoaXMuX3ZpdmlmeShvYmosIHBhdGgsIHZhbHVlKTtcbiAgICB2YXIga2V5ID0gbm9kZS5wYXRoLnNsaWNlKC0xKS5zaGlmdCgpO1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudChvYmosIHRoaXMuc3RyaW5naWZ5KG5vZGUucGF0aCkpO1xuICAgIHBhcmVudFtrZXldID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXMucXVlcnkob2JqLCB0aGlzLnN0cmluZ2lmeShwYXRoKSwgMSkuc2hpZnQoKTtcbn1cblxuSlNPTlBhdGgucHJvdG90eXBlLl92aXZpZnkgPSBmdW5jdGlvbihvYmosIHN0cmluZywgdmFsdWUpIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgYXNzZXJ0Lm9rKG9iaiBpbnN0YW5jZW9mIE9iamVjdCwgXCJvYmogbmVlZHMgdG8gYmUgYW4gb2JqZWN0XCIpO1xuICBhc3NlcnQub2soc3RyaW5nLCBcIndlIG5lZWQgYSBwYXRoXCIpO1xuXG4gIHZhciBwYXRoID0gdGhpcy5wYXJzZXIucGFyc2Uoc3RyaW5nKVxuICAgIC5tYXAoZnVuY3Rpb24oY29tcG9uZW50KSB7IHJldHVybiBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZSB9KTtcblxuICB2YXIgc2V0VmFsdWUgPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgIHZhciBrZXkgPSBwYXRoLnBvcCgpO1xuICAgIHZhciBub2RlID0gc2VsZi52YWx1ZShvYmosIHBhdGgpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgc2V0VmFsdWUocGF0aC5jb25jYXQoKSwgdHlwZW9mIGtleSA9PT0gJ3N0cmluZycgPyB7fSA6IFtdKTtcbiAgICAgIG5vZGUgPSBzZWxmLnZhbHVlKG9iaiwgcGF0aCk7XG4gICAgfVxuICAgIG5vZGVba2V5XSA9IHZhbHVlO1xuICB9XG4gIHNldFZhbHVlKHBhdGgsIHZhbHVlKTtcbiAgcmV0dXJuIHRoaXMucXVlcnkob2JqLCBzdHJpbmcpWzBdO1xufVxuXG5KU09OUGF0aC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbihvYmosIHN0cmluZywgY291bnQpIHtcblxuICBhc3NlcnQub2sob2JqIGluc3RhbmNlb2YgT2JqZWN0LCBcIm9iaiBuZWVkcyB0byBiZSBhbiBvYmplY3RcIik7XG4gIGFzc2VydC5vayhfaXNfc3RyaW5nKHN0cmluZyksIFwid2UgbmVlZCBhIHBhdGhcIik7XG5cbiAgdmFyIHJlc3VsdHMgPSB0aGlzLm5vZGVzKG9iaiwgc3RyaW5nLCBjb3VudClcbiAgICAubWFwKGZ1bmN0aW9uKHIpIHsgcmV0dXJuIHIudmFsdWUgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5KU09OUGF0aC5wcm90b3R5cGUucGF0aHMgPSBmdW5jdGlvbihvYmosIHN0cmluZywgY291bnQpIHtcblxuICBhc3NlcnQub2sob2JqIGluc3RhbmNlb2YgT2JqZWN0LCBcIm9iaiBuZWVkcyB0byBiZSBhbiBvYmplY3RcIik7XG4gIGFzc2VydC5vayhzdHJpbmcsIFwid2UgbmVlZCBhIHBhdGhcIik7XG5cbiAgdmFyIHJlc3VsdHMgPSB0aGlzLm5vZGVzKG9iaiwgc3RyaW5nLCBjb3VudClcbiAgICAubWFwKGZ1bmN0aW9uKHIpIHsgcmV0dXJuIHIucGF0aCB9KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbkpTT05QYXRoLnByb3RvdHlwZS5ub2RlcyA9IGZ1bmN0aW9uKG9iaiwgc3RyaW5nLCBjb3VudCkge1xuXG4gIGFzc2VydC5vayhvYmogaW5zdGFuY2VvZiBPYmplY3QsIFwib2JqIG5lZWRzIHRvIGJlIGFuIG9iamVjdFwiKTtcbiAgYXNzZXJ0Lm9rKHN0cmluZywgXCJ3ZSBuZWVkIGEgcGF0aFwiKTtcblxuICBpZiAoY291bnQgPT09IDApIHJldHVybiBbXTtcblxuICB2YXIgcGF0aCA9IHRoaXMucGFyc2VyLnBhcnNlKHN0cmluZyk7XG4gIHZhciBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnM7XG5cbiAgdmFyIHBhcnRpYWxzID0gWyB7IHBhdGg6IFsnJCddLCB2YWx1ZTogb2JqIH0gXTtcbiAgdmFyIG1hdGNoZXMgPSBbXTtcblxuICBpZiAocGF0aC5sZW5ndGggJiYgcGF0aFswXS5leHByZXNzaW9uLnR5cGUgPT0gJ3Jvb3QnKSBwYXRoLnNoaWZ0KCk7XG5cbiAgaWYgKCFwYXRoLmxlbmd0aCkgcmV0dXJuIHBhcnRpYWxzO1xuXG4gIHBhdGguZm9yRWFjaChmdW5jdGlvbihjb21wb25lbnQsIGluZGV4KSB7XG5cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPj0gY291bnQpIHJldHVybjtcbiAgICB2YXIgaGFuZGxlciA9IGhhbmRsZXJzLnJlc29sdmUoY29tcG9uZW50KTtcbiAgICB2YXIgX3BhcnRpYWxzID0gW107XG5cbiAgICBwYXJ0aWFscy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcblxuICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID49IGNvdW50KSByZXR1cm47XG4gICAgICB2YXIgcmVzdWx0cyA9IGhhbmRsZXIoY29tcG9uZW50LCBwLCBjb3VudCk7XG5cbiAgICAgIGlmIChpbmRleCA9PSBwYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgLy8gaWYgd2UncmUgdGhyb3VnaCB0aGUgY29tcG9uZW50cyB3ZSdyZSBkb25lXG4gICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzLmNvbmNhdChyZXN1bHRzIHx8IFtdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG90aGVyd2lzZSBhY2N1bXVsYXRlIGFuZCBjYXJyeSBvbiB0aHJvdWdoXG4gICAgICAgIF9wYXJ0aWFscyA9IF9wYXJ0aWFscy5jb25jYXQocmVzdWx0cyB8fCBbXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXJ0aWFscyA9IF9wYXJ0aWFscztcblxuICB9KTtcblxuICByZXR1cm4gY291bnQgPyBtYXRjaGVzLnNsaWNlKDAsIGNvdW50KSA6IG1hdGNoZXM7XG59O1xuXG5KU09OUGF0aC5wcm90b3R5cGUuc3RyaW5naWZ5ID0gZnVuY3Rpb24ocGF0aCkge1xuXG4gIGFzc2VydC5vayhwYXRoLCBcIndlIG5lZWQgYSBwYXRoXCIpO1xuXG4gIHZhciBzdHJpbmcgPSAnJCc7XG5cbiAgdmFyIHRlbXBsYXRlcyA9IHtcbiAgICAnZGVzY2VuZGFudC1tZW1iZXInOiAnLi57e3ZhbHVlfX0nLFxuICAgICdjaGlsZC1tZW1iZXInOiAnLnt7dmFsdWV9fScsXG4gICAgJ2Rlc2NlbmRhbnQtc3Vic2NyaXB0JzogJy4uW3t7dmFsdWV9fV0nLFxuICAgICdjaGlsZC1zdWJzY3JpcHQnOiAnW3t7dmFsdWV9fV0nXG4gIH07XG5cbiAgcGF0aCA9IHRoaXMuX25vcm1hbGl6ZShwYXRoKTtcblxuICBwYXRoLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KSB7XG5cbiAgICBpZiAoY29tcG9uZW50LmV4cHJlc3Npb24udHlwZSA9PSAncm9vdCcpIHJldHVybjtcblxuICAgIHZhciBrZXkgPSBbY29tcG9uZW50LnNjb3BlLCBjb21wb25lbnQub3BlcmF0aW9uXS5qb2luKCctJyk7XG4gICAgdmFyIHRlbXBsYXRlID0gdGVtcGxhdGVzW2tleV07XG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKGNvbXBvbmVudC5leHByZXNzaW9uLnR5cGUgPT0gJ3N0cmluZ19saXRlcmFsJykge1xuICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeShjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBjb21wb25lbnQuZXhwcmVzc2lvbi52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRlbXBsYXRlKSB0aHJvdyBuZXcgRXJyb3IoXCJjb3VsZG4ndCBmaW5kIHRlbXBsYXRlIFwiICsga2V5KTtcblxuICAgIHN0cmluZyArPSB0ZW1wbGF0ZS5yZXBsYWNlKC97e3ZhbHVlfX0vLCB2YWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBzdHJpbmc7XG59XG5cbkpTT05QYXRoLnByb3RvdHlwZS5fbm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuXG4gIGFzc2VydC5vayhwYXRoLCBcIndlIG5lZWQgYSBwYXRoXCIpO1xuXG4gIGlmICh0eXBlb2YgcGF0aCA9PSBcInN0cmluZ1wiKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wYXJzZXIucGFyc2UocGF0aCk7XG5cbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhdGgpICYmIHR5cGVvZiBwYXRoWzBdID09IFwic3RyaW5nXCIpIHtcblxuICAgIHZhciBfcGF0aCA9IFsgeyBleHByZXNzaW9uOiB7IHR5cGU6IFwicm9vdFwiLCB2YWx1ZTogXCIkXCIgfSB9IF07XG5cbiAgICBwYXRoLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50LCBpbmRleCkge1xuXG4gICAgICBpZiAoY29tcG9uZW50ID09ICckJyAmJiBpbmRleCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PSBcInN0cmluZ1wiICYmIGNvbXBvbmVudC5tYXRjaChcIl5cIiArIGRpY3QuaWRlbnRpZmllciArIFwiJFwiKSkge1xuXG4gICAgICAgIF9wYXRoLnB1c2goe1xuICAgICAgICAgIG9wZXJhdGlvbjogJ21lbWJlcicsXG4gICAgICAgICAgc2NvcGU6ICdjaGlsZCcsXG4gICAgICAgICAgZXhwcmVzc2lvbjogeyB2YWx1ZTogY29tcG9uZW50LCB0eXBlOiAnaWRlbnRpZmllcicgfVxuICAgICAgICB9KTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBjb21wb25lbnQgPT0gXCJudW1iZXJcIiA/XG4gICAgICAgICAgJ251bWVyaWNfbGl0ZXJhbCcgOiAnc3RyaW5nX2xpdGVyYWwnO1xuXG4gICAgICAgIF9wYXRoLnB1c2goe1xuICAgICAgICAgIG9wZXJhdGlvbjogJ3N1YnNjcmlwdCcsXG4gICAgICAgICAgc2NvcGU6ICdjaGlsZCcsXG4gICAgICAgICAgZXhwcmVzc2lvbjogeyB2YWx1ZTogY29tcG9uZW50LCB0eXBlOiB0eXBlIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gX3BhdGg7XG5cbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhdGgpICYmIHR5cGVvZiBwYXRoWzBdID09IFwib2JqZWN0XCIpIHtcblxuICAgIHJldHVybiBwYXRoXG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoXCJjb3VsZG4ndCB1bmRlcnN0YW5kIHBhdGggXCIgKyBwYXRoKTtcbn1cblxuZnVuY3Rpb24gX2lzX3N0cmluZyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IFN0cmluZ10nO1xufVxuXG5KU09OUGF0aC5IYW5kbGVycyA9IEhhbmRsZXJzO1xuSlNPTlBhdGguUGFyc2VyID0gUGFyc2VyO1xuXG52YXIgaW5zdGFuY2UgPSBuZXcgSlNPTlBhdGg7XG5pbnN0YW5jZS5KU09OUGF0aCA9IEpTT05QYXRoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluc3RhbmNlO1xuXG59LHtcIi4vZGljdFwiOjIsXCIuL2hhbmRsZXJzXCI6NCxcIi4vcGFyc2VyXCI6NixcImFzc2VydFwiOjh9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBncmFtbWFyID0gcmVxdWlyZSgnLi9ncmFtbWFyJyk7XG52YXIgZ3BhcnNlciA9IHJlcXVpcmUoJy4uL2dlbmVyYXRlZC9wYXJzZXInKTtcblxudmFyIFBhcnNlciA9IGZ1bmN0aW9uKCkge1xuXG4gIHZhciBwYXJzZXIgPSBuZXcgZ3BhcnNlci5QYXJzZXIoKTtcblxuICB2YXIgX3BhcnNlRXJyb3IgPSBwYXJzZXIucGFyc2VFcnJvcjtcbiAgcGFyc2VyLnl5LnBhcnNlRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocGFyc2VyLnl5LmFzdCkge1xuICAgICAgcGFyc2VyLnl5LmFzdC5pbml0aWFsaXplKCk7XG4gICAgfVxuICAgIF9wYXJzZUVycm9yLmFwcGx5KHBhcnNlciwgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZXI7XG5cbn07XG5cblBhcnNlci5ncmFtbWFyID0gZ3JhbW1hcjtcbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyO1xuXG59LHtcIi4uL2dlbmVyYXRlZC9wYXJzZXJcIjoxLFwiLi9ncmFtbWFyXCI6M31dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnIsIHN0YXJ0LCBlbmQsIHN0ZXApIHtcblxuICBpZiAodHlwZW9mIHN0YXJ0ID09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoXCJzdGFydCBjYW5ub3QgYmUgYSBzdHJpbmdcIik7XG4gIGlmICh0eXBlb2YgZW5kID09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoXCJlbmQgY2Fubm90IGJlIGEgc3RyaW5nXCIpO1xuICBpZiAodHlwZW9mIHN0ZXAgPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcihcInN0ZXAgY2Fubm90IGJlIGEgc3RyaW5nXCIpO1xuXG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGlmIChzdGVwID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJzdGVwIGNhbm5vdCBiZSB6ZXJvXCIpO1xuICBzdGVwID0gc3RlcCA/IGludGVnZXIoc3RlcCkgOiAxO1xuXG4gIC8vIG5vcm1hbGl6ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgc3RhcnQgPSBzdGFydCA8IDAgPyBsZW4gKyBzdGFydCA6IHN0YXJ0O1xuICBlbmQgPSBlbmQgPCAwID8gbGVuICsgZW5kIDogZW5kO1xuXG4gIC8vIGRlZmF1bHQgZXh0ZW50cyB0byBleHRlbnRzXG4gIHN0YXJ0ID0gaW50ZWdlcihzdGFydCA9PT0gMCA/IDAgOiAhc3RhcnQgPyAoc3RlcCA+IDAgPyAwIDogbGVuIC0gMSkgOiBzdGFydCk7XG4gIGVuZCA9IGludGVnZXIoZW5kID09PSAwID8gMCA6ICFlbmQgPyAoc3RlcCA+IDAgPyBsZW4gOiAtMSkgOiBlbmQpO1xuXG4gIC8vIGNsYW1wIGV4dGVudHNcbiAgc3RhcnQgPSBzdGVwID4gMCA/IE1hdGgubWF4KDAsIHN0YXJ0KSA6IE1hdGgubWluKGxlbiwgc3RhcnQpO1xuICBlbmQgPSBzdGVwID4gMCA/IE1hdGgubWluKGVuZCwgbGVuKSA6IE1hdGgubWF4KC0xLCBlbmQpO1xuXG4gIC8vIHJldHVybiBlbXB0eSBpZiBleHRlbnRzIGFyZSBiYWNrd2FyZHNcbiAgaWYgKHN0ZXAgPiAwICYmIGVuZCA8PSBzdGFydCkgcmV0dXJuIFtdO1xuICBpZiAoc3RlcCA8IDAgJiYgc3RhcnQgPD0gZW5kKSByZXR1cm4gW107XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSAhPSBlbmQ7IGkgKz0gc3RlcCkge1xuICAgIGlmICgoc3RlcCA8IDAgJiYgaSA8PSBlbmQpIHx8IChzdGVwID4gMCAmJiBpID49IGVuZCkpIGJyZWFrO1xuICAgIHJlc3VsdC5wdXNoKGFycltpXSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpbnRlZ2VyKHZhbCkge1xuICByZXR1cm4gU3RyaW5nKHZhbCkubWF0Y2goL15bMC05XSskLykgPyBwYXJzZUludCh2YWwpIDpcbiAgICBOdW1iZXIuaXNGaW5pdGUodmFsKSA/IHBhcnNlSW50KHZhbCwgMTApIDogMDtcbn1cblxufSx7fV0sODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gd2hlbiB1c2VkIGluIG5vZGUsIHRoaXMgd2lsbCBhY3R1YWxseSBsb2FkIHRoZSB1dGlsIG1vZHVsZSB3ZSBkZXBlbmQgb25cbi8vIHZlcnN1cyBsb2FkaW5nIHRoZSBidWlsdGluIHV0aWwgbW9kdWxlIGFzIGhhcHBlbnMgb3RoZXJ3aXNlXG4vLyB0aGlzIGlzIGEgYnVnIGluIG5vZGUgbW9kdWxlIGxvYWRpbmcgYXMgZmFyIGFzIEkgYW0gY29uY2VybmVkXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG5cbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gc3RhY2tTdGFydEZ1bmN0aW9uLm5hbWU7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7XG4gIGlmICh1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgIHJldHVybiAnJyArIHZhbHVlO1xuICB9XG4gIGlmICh1dGlsLmlzTnVtYmVyKHZhbHVlKSAmJiAhaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgaWYgKHV0aWwuaXNGdW5jdGlvbih2YWx1ZSkgfHwgdXRpbC5pc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocykpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeShzZWxmLmFjdHVhbCwgcmVwbGFjZXIpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5leHBlY3RlZCwgcmVwbGFjZXIpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmICh1dGlsLmlzQnVmZmVyKGFjdHVhbCkgJiYgdXRpbC5pc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICBpZiAoYWN0dWFsLmxlbmd0aCAhPSBleHBlY3RlZC5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWN0dWFsW2ldICE9PSBleHBlY3RlZFtpXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICghdXRpbC5pc09iamVjdChhY3R1YWwpICYmICF1dGlsLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYikge1xuICBpZiAodXRpbC5pc051bGxPclVuZGVmaW5lZChhKSB8fCB1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LlxuICBpZiAoYS5wcm90b3R5cGUgIT09IGIucHJvdG90eXBlKSByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKSB7XG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIH1cbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKSxcbiAgICAgIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYik7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgIGtiID0gb2JqZWN0S2V5cyhiKSxcbiAgICAgIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHV0aWwuaXNTdHJpbmcoZXhwZWN0ZWQpKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFjdHVhbCA9IGU7XG4gIH1cblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICghc2hvdWxkVGhyb3cgJiYgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW3RydWVdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFtmYWxzZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHt0aHJvdyBlcnI7fX07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuXG59LHtcInV0aWwvXCI6MTF9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuXG59LHt9XSwxMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59XG59LHt9XSwxMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbn0se1wiLi9zdXBwb3J0L2lzQnVmZmVyXCI6MTAsXCJfcHJvY2Vzc1wiOjE0LFwiaW5oZXJpdHNcIjo5fV0sMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLy8gLmRpcm5hbWUsIC5iYXNlbmFtZSwgYW5kIC5leHRuYW1lIG1ldGhvZHMgYXJlIGV4dHJhY3RlZCBmcm9tIE5vZGUuanMgdjguMTEuMSxcbi8vIGJhY2twb3J0ZWQgYW5kIHRyYW5zcGxpdGVkIHdpdGggQmFiZWwsIHdpdGggYmFja3dhcmRzLWNvbXBhdCBmaXhlc1xuXG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xuICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuIGhhc1Jvb3QgPyAnLycgOiAnLic7XG4gIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkge1xuICAgIC8vIHJldHVybiAnLy8nO1xuICAgIC8vIEJhY2t3YXJkcy1jb21wYXQgZml4OlxuICAgIHJldHVybiAnLyc7XG4gIH1cbiAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcblxuICB2YXIgc3RhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICBlbmQgPSBpICsgMTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuICcnO1xuICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbn1cblxuLy8gVXNlcyBhIG1peGVkIGFwcHJvYWNoIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSwgYXMgZXh0IGJlaGF2aW9yIGNoYW5nZWRcbi8vIGluIG5ldyBOb2RlLmpzIHZlcnNpb25zLCBzbyBvbmx5IGJhc2VuYW1lKCkgYWJvdmUgaXMgYmFja3BvcnRlZCBoZXJlXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24gKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IGJhc2VuYW1lKHBhdGgpO1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcbiAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gIHZhciBzdGFydFBhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBleHRlbnNpb25cbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgZW5kID0gaSArIDE7XG4gICAgfVxuICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICBzdGFydERvdCA9IGk7XG4gICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxuICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpXG59LHtcIl9wcm9jZXNzXCI6MTR9XSwxNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG59LHt9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgdW5wYXJzZSA9IHJlcXVpcmUoJ2VzY29kZWdlbicpLmdlbmVyYXRlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhc3QsIHZhcnMpIHtcbiAgICBpZiAoIXZhcnMpIHZhcnMgPSB7fTtcbiAgICB2YXIgRkFJTCA9IHt9O1xuICAgIFxuICAgIHZhciByZXN1bHQgPSAoZnVuY3Rpb24gd2FsayAobm9kZSwgc2NvcGVWYXJzKSB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMaXRlcmFsJykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVW5hcnlFeHByZXNzaW9uJyl7XG4gICAgICAgICAgICB2YXIgdmFsID0gd2Fsayhub2RlLmFyZ3VtZW50KVxuICAgICAgICAgICAgaWYgKG5vZGUub3BlcmF0b3IgPT09ICcrJykgcmV0dXJuICt2YWxcbiAgICAgICAgICAgIGlmIChub2RlLm9wZXJhdG9yID09PSAnLScpIHJldHVybiAtdmFsXG4gICAgICAgICAgICBpZiAobm9kZS5vcGVyYXRvciA9PT0gJ34nKSByZXR1cm4gfnZhbFxuICAgICAgICAgICAgaWYgKG5vZGUub3BlcmF0b3IgPT09ICchJykgcmV0dXJuICF2YWxcbiAgICAgICAgICAgIHJldHVybiBGQUlMXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnQXJyYXlFeHByZXNzaW9uJykge1xuICAgICAgICAgICAgdmFyIHhzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGUuZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHggPSB3YWxrKG5vZGUuZWxlbWVudHNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICh4ID09PSBGQUlMKSByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgICAgICB4cy5wdXNoKHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHhzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ09iamVjdEV4cHJlc3Npb24nKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHByb3AudmFsdWUgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgPyBwcm9wLnZhbHVlXG4gICAgICAgICAgICAgICAgICAgIDogd2Fsayhwcm9wLnZhbHVlKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IEZBSUwpIHJldHVybiBGQUlMO1xuICAgICAgICAgICAgICAgIG9ialtwcm9wLmtleS52YWx1ZSB8fCBwcm9wLmtleS5uYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdCaW5hcnlFeHByZXNzaW9uJyB8fFxuICAgICAgICAgICAgICAgICBub2RlLnR5cGUgPT09ICdMb2dpY2FsRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgIHZhciBsID0gd2Fsayhub2RlLmxlZnQpO1xuICAgICAgICAgICAgaWYgKGwgPT09IEZBSUwpIHJldHVybiBGQUlMO1xuICAgICAgICAgICAgdmFyIHIgPSB3YWxrKG5vZGUucmlnaHQpO1xuICAgICAgICAgICAgaWYgKHIgPT09IEZBSUwpIHJldHVybiBGQUlMO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgb3AgPSBub2RlLm9wZXJhdG9yO1xuICAgICAgICAgICAgaWYgKG9wID09PSAnPT0nKSByZXR1cm4gbCA9PSByO1xuICAgICAgICAgICAgaWYgKG9wID09PSAnPT09JykgcmV0dXJuIGwgPT09IHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICchPScpIHJldHVybiBsICE9IHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICchPT0nKSByZXR1cm4gbCAhPT0gcjtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gJysnKSByZXR1cm4gbCArIHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICctJykgcmV0dXJuIGwgLSByO1xuICAgICAgICAgICAgaWYgKG9wID09PSAnKicpIHJldHVybiBsICogcjtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gJy8nKSByZXR1cm4gbCAvIHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICclJykgcmV0dXJuIGwgJSByO1xuICAgICAgICAgICAgaWYgKG9wID09PSAnPCcpIHJldHVybiBsIDwgcjtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gJzw9JykgcmV0dXJuIGwgPD0gcjtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gJz4nKSByZXR1cm4gbCA+IHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICc+PScpIHJldHVybiBsID49IHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICd8JykgcmV0dXJuIGwgfCByO1xuICAgICAgICAgICAgaWYgKG9wID09PSAnJicpIHJldHVybiBsICYgcjtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gJ14nKSByZXR1cm4gbCBeIHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICcmJicpIHJldHVybiBsICYmIHI7XG4gICAgICAgICAgICBpZiAob3AgPT09ICd8fCcpIHJldHVybiBsIHx8IHI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBGQUlMO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbCh2YXJzLCBub2RlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcnNbbm9kZS5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIEZBSUw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVGhpc0V4cHJlc3Npb24nKSB7XG4gICAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbCh2YXJzLCAndGhpcycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcnNbJ3RoaXMnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIEZBSUw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGVlID0gd2Fsayhub2RlLmNhbGxlZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGVlID09PSBGQUlMKSByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGN0eCA9IG5vZGUuY2FsbGVlLm9iamVjdCA/IHdhbGsobm9kZS5jYWxsZWUub2JqZWN0KSA6IEZBSUw7XG4gICAgICAgICAgICBpZiAoY3R4ID09PSBGQUlMKSBjdHggPSBudWxsO1xuXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlLmFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IHdhbGsobm9kZS5hcmd1bWVudHNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICh4ID09PSBGQUlMKSByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGN0eCwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSB3YWxrKG5vZGUub2JqZWN0KTtcbiAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBhY2Nlc3MgdG8gbWV0aG9kcyBvbiBGdW5jdGlvbiBcbiAgICAgICAgICAgIGlmKChvYmogPT09IEZBSUwpIHx8ICh0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnByb3BlcnR5LnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmpbbm9kZS5wcm9wZXJ0eS5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9wID0gd2Fsayhub2RlLnByb3BlcnR5KTtcbiAgICAgICAgICAgIGlmIChwcm9wID09PSBGQUlMKSByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgIHJldHVybiBvYmpbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnQ29uZGl0aW9uYWxFeHByZXNzaW9uJykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHdhbGsobm9kZS50ZXN0KVxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gRkFJTCkgcmV0dXJuIEZBSUw7XG4gICAgICAgICAgICByZXR1cm4gdmFsID8gd2Fsayhub2RlLmNvbnNlcXVlbnQpIDogd2Fsayhub2RlLmFsdGVybmF0ZSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdFeHByZXNzaW9uU3RhdGVtZW50Jykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHdhbGsobm9kZS5leHByZXNzaW9uKVxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gRkFJTCkgcmV0dXJuIEZBSUw7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ1JldHVyblN0YXRlbWVudCcpIHtcbiAgICAgICAgICAgIHJldHVybiB3YWxrKG5vZGUuYXJndW1lbnQpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnRnVuY3Rpb25FeHByZXNzaW9uJykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYm9kaWVzID0gbm9kZS5ib2R5LmJvZHk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIFwic2NvcGVcIiBmb3Igb3VyIGFyZ3VtZW50c1xuICAgICAgICAgICAgdmFyIG9sZFZhcnMgPSB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhcnMpLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICAgICAgICAgICAgb2xkVmFyc1tlbGVtZW50XSA9IHZhcnNbZWxlbWVudF07XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLnBhcmFtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG5vZGUucGFyYW1zW2ldO1xuICAgICAgICAgICAgICAgIGlmKGtleS50eXBlID09ICdJZGVudGlmaWVyJyl7XG4gICAgICAgICAgICAgICAgICB2YXJzW2tleS5uYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIEZBSUw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gYm9kaWVzKXtcbiAgICAgICAgICAgICAgICBpZih3YWxrKGJvZGllc1tpXSkgPT09IEZBSUwpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFJTDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXN0b3JlIHRoZSB2YXJzIGFuZCBzY29wZSBhZnRlciB3ZSB3YWxrXG4gICAgICAgICAgICB2YXJzID0gb2xkVmFycztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YXJzKTtcbiAgICAgICAgICAgIHZhciB2YWxzID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcnNba2V5XTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKGtleXMuam9pbignLCAnKSwgJ3JldHVybiAnICsgdW5wYXJzZShub2RlKSkuYXBwbHkobnVsbCwgdmFscyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVGVtcGxhdGVMaXRlcmFsJykge1xuICAgICAgICAgICAgdmFyIHN0ciA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmV4cHJlc3Npb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9IHdhbGsobm9kZS5xdWFzaXNbaV0pO1xuICAgICAgICAgICAgICAgIHN0ciArPSB3YWxrKG5vZGUuZXhwcmVzc2lvbnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyICs9IHdhbGsobm9kZS5xdWFzaXNbaV0pO1xuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24nKSB7XG4gICAgICAgICAgICB2YXIgdGFnID0gd2Fsayhub2RlLnRhZyk7XG4gICAgICAgICAgICB2YXIgcXVhc2kgPSBub2RlLnF1YXNpO1xuICAgICAgICAgICAgdmFyIHN0cmluZ3MgPSBxdWFzaS5xdWFzaXMubWFwKHdhbGspO1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHF1YXNpLmV4cHJlc3Npb25zLm1hcCh3YWxrKTtcbiAgICAgICAgICAgIHJldHVybiB0YWcuYXBwbHkobnVsbCwgW3N0cmluZ3NdLmNvbmNhdCh2YWx1ZXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdUZW1wbGF0ZUVsZW1lbnQnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS52YWx1ZS5jb29rZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gRkFJTDtcbiAgICB9KShhc3QpO1xuICAgIFxuICAgIHJldHVybiByZXN1bHQgPT09IEZBSUwgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG59O1xuXG59LHtcImVzY29kZWdlblwiOjEyfV0sXCJqc29ucGF0aFwiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvaW5kZXgnKTtcblxufSx7XCIuL2xpYi9pbmRleFwiOjV9XX0se30sW1wianNvbnBhdGhcIl0pKFwianNvbnBhdGhcIilcbn0pO1xuIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIDxhdXRvLWdlbmVyYXRlZD5cclxuLy8gICAgIEdlbmVyYXRlZCB1c2luZyB0aGUgTlN3YWcgdG9vbGNoYWluIHYxMy4yMC4wLjAgKE5Kc29uU2NoZW1hIHYxMC45LjAuMCAoTmV3dG9uc29mdC5Kc29uIHYxMy4wLjAuMCkpIChodHRwOi8vTlN3YWcub3JnKVxyXG4vLyA8L2F1dG8tZ2VuZXJhdGVkPlxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbi8vIFJlU2hhcnBlciBkaXNhYmxlIEluY29uc2lzdGVudE5hbWluZ1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudCB7XHJcbiAgICBwcml2YXRlIGh0dHA6IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfTtcclxuICAgIHByaXZhdGUgYmFzZVVybDogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIGpzb25QYXJzZVJldml2ZXI6ICgoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IGFueSkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZVVybD86IHN0cmluZywgaHR0cD86IHsgZmV0Y2godXJsOiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gfSkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IGh0dHAgPyBodHRwIDogd2luZG93IGFzIGFueTtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsICE9PSB1bmRlZmluZWQgJiYgYmFzZVVybCAhPT0gbnVsbCA/IGJhc2VVcmwgOiBcIi9hcGkvZWJheS92MVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBhbGwgcHJvZHVjdHNcclxuICAgICAqIEByZXR1cm4gT0tcclxuICAgICAqL1xyXG4gICAgZ2V0QWxsUHJvZHVjdHMoKTogUHJvbWlzZTxQcm9kdWN0V2l0aElkW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0QWxsUHJvZHVjdHMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldEFsbFByb2R1Y3RzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8UHJvZHVjdFdpdGhJZFtdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goUHJvZHVjdFdpdGhJZC5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8UHJvZHVjdFdpdGhJZFtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2R1Y3QocHJvZHVjdDogUHJvZHVjdFdpdGhvdXRJZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0c1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NDcmVhdGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDcmVhdGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IHJlc3VsdERhdGEyMDAgIT09IHVuZGVmaW5lZCA/IHJlc3VsdERhdGEyMDAgOiA8YW55Pm51bGw7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJFcnJvclwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHN0cmluZz4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHByb2R1Y3RcclxuICAgICAqIEByZXR1cm4gVXBkYXRlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQcm9kdWN0KHByb2R1Y3Q6IFByb2R1Y3RXaXRob3V0SWQsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH1cIjtcclxuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnaWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntpZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBpZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRfID0gSlNPTi5zdHJpbmdpZnkocHJvZHVjdCk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBkYXRlUHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBkYXRlUHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldFByb2R1Y3QoaWQ6IHN0cmluZyk6IFByb21pc2U8UHJvZHVjdFdpdGhJZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0UHJvZHVjdChfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0UHJvZHVjdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFByb2R1Y3RXaXRoSWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQyMDAgPSBQcm9kdWN0V2l0aElkLmZyb21KUyhyZXN1bHREYXRhMjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiRXJyb3JcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxQcm9kdWN0V2l0aElkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGUgcHJvZHVjdFxyXG4gICAgICogQHJldHVybiBEZWxldGVkXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVByb2R1Y3QoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve2lkfVwiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NEZWxldGVQcm9kdWN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NEZWxldGVQcm9kdWN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXJrUHJvZHVjdEFzQ2hlY2tlZFxyXG4gICAgICogQHJldHVybiBVcGRhdGVkXHJcbiAgICAgKi9cclxuICAgIG1hcmtQcm9kdWN0QXNDaGVja2VkKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3Byb2R1Y3RzL3tpZH0vbWFya19hc19jaGVja2VkL1wiO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdpZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie2lkfVwiLCBlbmNvZGVVUklDb21wb25lbnQoXCJcIiArIGlkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzTWFya1Byb2R1Y3RBc0NoZWNrZWQoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc01hcmtQcm9kdWN0QXNDaGVja2VkKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdHMocHJvZHVjdElkOiBzdHJpbmcpOiBQcm9taXNlPExvdEluZm9TaG9ydFtdPiB7XHJcbiAgICAgICAgbGV0IHVybF8gPSB0aGlzLmJhc2VVcmwgKyBcIi9wcm9kdWN0cy97cHJvZHVjdElkfS9sb3RzL1wiO1xyXG4gICAgICAgIGlmIChwcm9kdWN0SWQgPT09IHVuZGVmaW5lZCB8fCBwcm9kdWN0SWQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXJhbWV0ZXIgJ3Byb2R1Y3RJZCcgbXVzdCBiZSBkZWZpbmVkLlwiKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKFwie3Byb2R1Y3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBwcm9kdWN0SWQpKTtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uc186IFJlcXVlc3RJbml0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RzKF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRMb3RzKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TG90SW5mb1Nob3J0W10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChMb3RJbmZvU2hvcnQuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IDxhbnk+bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0MjAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0NDAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTQwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICByZXN1bHQ0MDAgPSBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8uZnJvbUpTKHJlc3VsdERhdGE0MDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJOb3RGb3VuZFwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzLCByZXN1bHQ0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gMjAwICYmIHN0YXR1cyAhPT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFeGNlcHRpb24oXCJBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPExvdEluZm9TaG9ydFtdPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LvQvtGC0LVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgdXBzZXJ0TG90SW5mbyhsb3RJbmZvOiBMb3RJbmZvLCBwcm9kdWN0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvcHJvZHVjdHMve3Byb2R1Y3RJZH0vbG90cy9cIjtcclxuICAgICAgICBpZiAocHJvZHVjdElkID09PSB1bmRlZmluZWQgfHwgcHJvZHVjdElkID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcGFyYW1ldGVyICdwcm9kdWN0SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntwcm9kdWN0SWR9XCIsIGVuY29kZVVSSUNvbXBvbmVudChcIlwiICsgcHJvZHVjdElkKSk7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShsb3RJbmZvKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgYm9keTogY29udGVudF8sXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVXBzZXJ0TG90SW5mbyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzVXBzZXJ0TG90SW5mbyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ0MDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhNDAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDQwMCA9IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC70L7RgtC1XHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldExvdEluZm8obG90SWQ6IG51bWJlcik6IFByb21pc2U8TG90SW5mb1dpdGhQcm9kdWN0SWQ+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdHMve2xvdElkfS9cIjtcclxuICAgICAgICBpZiAobG90SWQgPT09IHVuZGVmaW5lZCB8fCBsb3RJZCA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhcmFtZXRlciAnbG90SWQnIG11c3QgYmUgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZShcIntsb3RJZH1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KFwiXCIgKyBsb3RJZCkpO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldExvdEluZm8oX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdEluZm8ocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdDIwMCA9IExvdEluZm9XaXRoUHJvZHVjdElkLmZyb21KUyhyZXN1bHREYXRhMjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDQwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGE0MDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgcmVzdWx0NDAwID0gTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvLmZyb21KUyhyZXN1bHREYXRhNDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiTm90Rm91bmRcIiwgc3RhdHVzLCBfcmVzcG9uc2VUZXh0LCBfaGVhZGVycywgcmVzdWx0NDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxMb3RJbmZvV2l0aFByb2R1Y3RJZD4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRg9GH0YLQtdC90L3Ri9GFINC70L7RgtCw0YVcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0TG90U3RhdGVzKGxvdElkczogbnVtYmVyW10pOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2xvdF9zdGF0ZV9yZXF1ZXN0cy9cIjtcclxuICAgICAgICB1cmxfID0gdXJsXy5yZXBsYWNlKC9bPyZdJC8sIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50XyA9IEpTT04uc3RyaW5naWZ5KGxvdElkcyk7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKHVybF8sIG9wdGlvbnNfKS50aGVuKChfcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NHZXRMb3RTdGF0ZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldExvdFN0YXRlcyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPExvdFN0YXRlW10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChMb3RTdGF0ZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8TG90U3RhdGVbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC00LDQtdGCINC/0LXRgNC10YfQtdC90Ywg0LLQvtC30LzQvtC20L3Ri9GFINGB0L7RgdGC0L7Rj9C90LjQuSDQv9GA0L7QtNCw0LLQsNC10LzQvtCz0L4g0YLQvtCy0LDRgNCwXHJcbiAgICAgKiBAcmV0dXJuIE9rXHJcbiAgICAgKi9cclxuICAgIGdldE1hbnVhbENvbmRpdGlvbnNMaXN0KCk6IFByb21pc2U8TWFudWFsQ29uZGl0aW9uW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL21hbnVhbF9jb25kaXRpb25zL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldE1hbnVhbENvbmRpdGlvbnNMaXN0KF9yZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NHZXRNYW51YWxDb25kaXRpb25zTGlzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPE1hbnVhbENvbmRpdGlvbltdPiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgICAgIGxldCBfaGVhZGVyczogYW55ID0ge307IGlmIChyZXNwb25zZS5oZWFkZXJzICYmIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCkgeyByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHY6IGFueSwgazogYW55KSA9PiBfaGVhZGVyc1trXSA9IHYpOyB9O1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIwMDogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGEyMDAgPSBfcmVzcG9uc2VUZXh0ID09PSBcIlwiID8gbnVsbCA6IEpTT04ucGFyc2UoX3Jlc3BvbnNlVGV4dCwgdGhpcy5qc29uUGFyc2VSZXZpdmVyKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0RGF0YTIwMCkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIwMCA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0RGF0YTIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyMDAhLnB1c2goTWFudWFsQ29uZGl0aW9uLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSA8YW55Pm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDIwMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTxNYW51YWxDb25kaXRpb25bXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBnZXRTaGlwcGluZ1JhdGVzKCk6IFByb21pc2U8U2hpcHBpbmdUeXBlW10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL3NoaXBwaW5nX3JhdGVzL1wiO1xyXG4gICAgICAgIHVybF8gPSB1cmxfLnJlcGxhY2UoL1s/Jl0kLywgXCJcIik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0dldFNoaXBwaW5nUmF0ZXMoX3Jlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0dldFNoaXBwaW5nUmF0ZXMocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxTaGlwcGluZ1R5cGVbXT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQyMDA6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhMjAwID0gX3Jlc3BvbnNlVGV4dCA9PT0gXCJcIiA/IG51bGwgOiBKU09OLnBhcnNlKF9yZXNwb25zZVRleHQsIHRoaXMuanNvblBhcnNlUmV2aXZlcik7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdERhdGEyMDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyMDAgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdERhdGEyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MjAwIS5wdXNoKFNoaXBwaW5nVHlwZS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8U2hpcHBpbmdUeXBlW10+KG51bGwgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4gT2tcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVuY2llcygpOiBQcm9taXNlPEN1cnJlbmN5W10+IHtcclxuICAgICAgICBsZXQgdXJsXyA9IHRoaXMuYmFzZVVybCArIFwiL2N1cnJlbmNpZXMvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnNfOiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5mZXRjaCh1cmxfLCBvcHRpb25zXykudGhlbigoX3Jlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzR2V0Q3VycmVuY2llcyhfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzR2V0Q3VycmVuY2llcyhyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPEN1cnJlbmN5W10+IHtcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IF9oZWFkZXJzOiBhbnkgPSB7fTsgaWYgKHJlc3BvbnNlLmhlYWRlcnMgJiYgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKSB7IHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodjogYW55LCBrOiBhbnkpID0+IF9oZWFkZXJzW2tdID0gdik7IH07XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoX3Jlc3BvbnNlVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MjAwOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YTIwMCA9IF9yZXNwb25zZVRleHQgPT09IFwiXCIgPyBudWxsIDogSlNPTi5wYXJzZShfcmVzcG9uc2VUZXh0LCB0aGlzLmpzb25QYXJzZVJldml2ZXIpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHREYXRhMjAwKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHREYXRhMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIwMCEucHVzaChDdXJyZW5jeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0MjAwID0gPGFueT5udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQyMDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAyMDAgJiYgc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0V4Y2VwdGlvbihcIkFuIHVuZXhwZWN0ZWQgc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLCBzdGF0dXMsIF9yZXNwb25zZVRleHQsIF9oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8Q3VycmVuY3lbXT4obnVsbCBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZSBFcnJvclxyXG4gICAgICogQHJldHVybiBPa1xyXG4gICAgICovXHJcbiAgICBzYXZlRXJyb3IoZXJyb3I6IENsaWVudEVycm9ySW5mbyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCB1cmxfID0gdGhpcy5iYXNlVXJsICsgXCIvZXJyb3IvXCI7XHJcbiAgICAgICAgdXJsXyA9IHVybF8ucmVwbGFjZSgvWz8mXSQvLCBcIlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudF8gPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25zXzogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgICAgIGJvZHk6IGNvbnRlbnRfLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZmV0Y2godXJsXywgb3B0aW9uc18pLnRoZW4oKF9yZXNwb25zZTogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1NhdmVFcnJvcihfcmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwcm9jZXNzU2F2ZUVycm9yKHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICBsZXQgX2hlYWRlcnM6IGFueSA9IHt9OyBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmZvckVhY2gpIHsgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2OiBhbnksIGs6IGFueSkgPT4gX2hlYWRlcnNba10gPSB2KTsgfTtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChfcmVzcG9uc2VUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oKF9yZXNwb25zZVRleHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXhjZXB0aW9uKFwiQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsIHN0YXR1cywgX3Jlc3BvbnNlVGV4dCwgX2hlYWRlcnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPihudWxsIGFzIGFueSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0V2l0aG91dElkIGltcGxlbWVudHMgSVByb2R1Y3RXaXRob3V0SWQge1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIHNlYXJjaFF1ZXJpZXMhOiBTZWFyY2hRdWVyeVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHJvZHVjdFdpdGhvdXRJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IF9kYXRhW1wiTmFtZVwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW10gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzIS5wdXNoKFNlYXJjaFF1ZXJ5LmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBQcm9kdWN0V2l0aG91dElkIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgUHJvZHVjdFdpdGhvdXRJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VhcmNoUXVlcmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNlYXJjaFF1ZXJpZXMpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvZHVjdFdpdGhvdXRJZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hRdWVyaWVzOiBTZWFyY2hRdWVyeVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZHVjdFdpdGhJZCBpbXBsZW1lbnRzIElQcm9kdWN0V2l0aElkIHtcclxuICAgIGlkITogc3RyaW5nO1xyXG4gICAgbmFtZSE6IHN0cmluZztcclxuICAgIGxhc3RDaGVja1RpbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzZWFyY2hRdWVyaWVzITogU2VhcmNoUXVlcnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2R1Y3RXaXRoSWQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gX2RhdGFbXCJOYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RDaGVja1RpbWUgPSBfZGF0YVtcIkxhc3RDaGVja1RpbWVcIl07XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9kYXRhW1wiU2VhcmNoUXVlcmllc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJTZWFyY2hRdWVyaWVzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyEucHVzaChTZWFyY2hRdWVyeS5mcm9tSlMoaXRlbSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvZHVjdFdpdGhJZCB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFByb2R1Y3RXaXRoSWQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiSWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJOYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJMYXN0Q2hlY2tUaW1lXCJdID0gdGhpcy5sYXN0Q2hlY2tUaW1lO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VhcmNoUXVlcmllcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcIlNlYXJjaFF1ZXJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNlYXJjaFF1ZXJpZXMpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wiU2VhcmNoUXVlcmllc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvZHVjdFdpdGhJZCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgbGFzdENoZWNrVGltZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlYXJjaFF1ZXJpZXM6IFNlYXJjaFF1ZXJ5W107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hRdWVyeSBpbXBsZW1lbnRzIElTZWFyY2hRdWVyeSB7XHJcbiAgICBpZCE6IHN0cmluZztcclxuICAgIHF1ZXJ5ITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJU2VhcmNoUXVlcnkpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IF9kYXRhW1wiaWRcIl07XHJcbiAgICAgICAgICAgIHRoaXMucXVlcnkgPSBfZGF0YVtcInF1ZXJ5XCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFNlYXJjaFF1ZXJ5IHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2VhcmNoUXVlcnkoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiaWRcIl0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGRhdGFbXCJxdWVyeVwiXSA9IHRoaXMucXVlcnk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNlYXJjaFF1ZXJ5IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBxdWVyeTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mb1dpdGhQcm9kdWN0SWQgaW1wbGVtZW50cyBJTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgcHJvZHVjdElkITogc3RyaW5nO1xyXG4gICAgbG90SW5mbyE6IExvdEluZm87XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvV2l0aFByb2R1Y3RJZCkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9kdWN0SWQgPSBfZGF0YVtcInByb2R1Y3RJZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb3RJbmZvID0gX2RhdGFbXCJsb3RJbmZvXCJdID8gTG90SW5mby5mcm9tSlMoX2RhdGFbXCJsb3RJbmZvXCJdKSA6IG5ldyBMb3RJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTG90SW5mb1dpdGhQcm9kdWN0SWQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvV2l0aFByb2R1Y3RJZCgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcm9kdWN0SWRcIl0gPSB0aGlzLnByb2R1Y3RJZDtcclxuICAgICAgICBkYXRhW1wibG90SW5mb1wiXSA9IHRoaXMubG90SW5mbyA/IHRoaXMubG90SW5mby50b0pTT04oKSA6IDxhbnk+dW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvV2l0aFByb2R1Y3RJZCB7XHJcbiAgICBwcm9kdWN0SWQ6IHN0cmluZztcclxuICAgIGxvdEluZm86IExvdEluZm87XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RJbmZvIGltcGxlbWVudHMgSUxvdEluZm8ge1xyXG4gICAgbG90SWQhOiBudW1iZXI7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgcGNzITogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmdDb3VudHJ5ITogc3RyaW5nO1xyXG4gICAgY3VycmVuY3khOiBzdHJpbmc7XHJcbiAgICBwcmljZSE6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgc2hpcHBpbmdBZGRpdGlvbmFsPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgZGVzY3JpcHRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlciE6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbiE6IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbWFudWFsQ29uZGl0aW9uSWQhOiBzdHJpbmc7XHJcbiAgICB0aXRsZUNoYW5nZURhdGUhOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3RvcnkhOiBQdXJjaGFzZUluZm9bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucGNzID0gX2RhdGFbXCJwY3NcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdDb3VudHJ5ID0gX2RhdGFbXCJzaGlwcGluZ0NvdW50cnlcIl07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVuY3kgPSBfZGF0YVtcImN1cnJlbmN5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZyA9IF9kYXRhW1wic2hpcHBpbmdcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsID0gX2RhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGF0YVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IF9kYXRhW1wiY29uZGl0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gX2RhdGFbXCJjb25kaXRpb25EZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgdGhpcy5zZWxsZXIgPSBfZGF0YVtcInNlbGxlclwiXTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVkSW4gPSBfZGF0YVtcImxvY2F0ZWRJblwiXTtcclxuICAgICAgICAgICAgdGhpcy5pZ25vcmVUaGF0TG90ID0gX2RhdGFbXCJpZ25vcmVUaGF0TG90XCJdO1xyXG4gICAgICAgICAgICB0aGlzLm1hbnVhbENvbmRpdGlvbklkID0gX2RhdGFbXCJtYW51YWxDb25kaXRpb25JZFwiXTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZUNoYW5nZURhdGUgPSBfZGF0YVtcInRpdGxlQ2hhbmdlRGF0ZVwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkhLnB1c2goUHVyY2hhc2VJbmZvLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTG90SW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJsb3RJZFwiXSA9IHRoaXMubG90SWQ7XHJcbiAgICAgICAgZGF0YVtcIm5hbWVcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgZGF0YVtcInBjc1wiXSA9IHRoaXMucGNzO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ0NvdW50cnlcIl0gPSB0aGlzLnNoaXBwaW5nQ291bnRyeTtcclxuICAgICAgICBkYXRhW1wiY3VycmVuY3lcIl0gPSB0aGlzLmN1cnJlbmN5O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nXCJdID0gdGhpcy5zaGlwcGluZztcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdBZGRpdGlvbmFsXCJdID0gdGhpcy5zaGlwcGluZ0FkZGl0aW9uYWw7XHJcbiAgICAgICAgZGF0YVtcImRlc2NyaXB0aW9uXCJdID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uXCJdID0gdGhpcy5jb25kaXRpb247XHJcbiAgICAgICAgZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdID0gdGhpcy5jb25kaXRpb25EZXNjcmlwdGlvbjtcclxuICAgICAgICBkYXRhW1wic2VsbGVyXCJdID0gdGhpcy5zZWxsZXI7XHJcbiAgICAgICAgZGF0YVtcImxvY2F0ZWRJblwiXSA9IHRoaXMubG9jYXRlZEluO1xyXG4gICAgICAgIGRhdGFbXCJpZ25vcmVUaGF0TG90XCJdID0gdGhpcy5pZ25vcmVUaGF0TG90O1xyXG4gICAgICAgIGRhdGFbXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHRoaXMubWFudWFsQ29uZGl0aW9uSWQ7XHJcbiAgICAgICAgZGF0YVtcInRpdGxlQ2hhbmdlRGF0ZVwiXSA9IHRoaXMudGl0bGVDaGFuZ2VEYXRlO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHVyY2hhc2VIaXN0b3J5KSkge1xyXG4gICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5wdXJjaGFzZUhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW1wicHVyY2hhc2VIaXN0b3J5XCJdLnB1c2goaXRlbS50b0pTT04oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMb3RJbmZvIHtcclxuICAgIGxvdElkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwY3M6IG51bWJlcjtcclxuICAgIHNoaXBwaW5nQ291bnRyeTogc3RyaW5nO1xyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZz86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHNoaXBwaW5nQWRkaXRpb25hbD86IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW46IHN0cmluZztcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBtYW51YWxDb25kaXRpb25JZDogc3RyaW5nO1xyXG4gICAgdGl0bGVDaGFuZ2VEYXRlOiBzdHJpbmc7XHJcbiAgICBwdXJjaGFzZUhpc3Rvcnk6IFB1cmNoYXNlSW5mb1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG90SW5mb1Nob3J0IGltcGxlbWVudHMgSUxvdEluZm9TaG9ydCB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIG5hbWUhOiBzdHJpbmc7XHJcbiAgICBwY3MhOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZ0NvdW50cnkhOiBzdHJpbmc7XHJcbiAgICBjdXJyZW5jeSE6IHN0cmluZztcclxuICAgIHByaWNlITogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmc/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWw/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBjb25kaXRpb24hOiBzdHJpbmc7XHJcbiAgICBjb25kaXRpb25EZXNjcmlwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHNlbGxlciE6IHN0cmluZztcclxuICAgIGxvY2F0ZWRJbiE6IHN0cmluZztcclxuICAgIG1hbnVhbENvbmRpdGlvbklkITogc3RyaW5nO1xyXG4gICAgdGl0bGVDaGFuZ2VEYXRlITogc3RyaW5nO1xyXG4gICAgcHVyY2hhc2VIaXN0b3J5ITogUHVyY2hhc2VJbmZvW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElMb3RJbmZvU2hvcnQpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMucGNzID0gX2RhdGFbXCJwY3NcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdDb3VudHJ5ID0gX2RhdGFbXCJzaGlwcGluZ0NvdW50cnlcIl07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVuY3kgPSBfZGF0YVtcImN1cnJlbmN5XCJdO1xyXG4gICAgICAgICAgICB0aGlzLnByaWNlID0gX2RhdGFbXCJwcmljZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwcGluZyA9IF9kYXRhW1wic2hpcHBpbmdcIl07XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsID0gX2RhdGFbXCJzaGlwcGluZ0FkZGl0aW9uYWxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uID0gX2RhdGFbXCJjb25kaXRpb25cIl07XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uRGVzY3JpcHRpb24gPSBfZGF0YVtcImNvbmRpdGlvbkRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGxlciA9IF9kYXRhW1wic2VsbGVyXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZWRJbiA9IF9kYXRhW1wibG9jYXRlZEluXCJdO1xyXG4gICAgICAgICAgICB0aGlzLm1hbnVhbENvbmRpdGlvbklkID0gX2RhdGFbXCJtYW51YWxDb25kaXRpb25JZFwiXTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZUNoYW5nZURhdGUgPSBfZGF0YVtcInRpdGxlQ2hhbmdlRGF0ZVwiXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1cmNoYXNlSGlzdG9yeSA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZUhpc3RvcnkhLnB1c2goUHVyY2hhc2VJbmZvLmZyb21KUyhpdGVtKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RJbmZvU2hvcnQge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBMb3RJbmZvU2hvcnQoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wibG90SWRcIl0gPSB0aGlzLmxvdElkO1xyXG4gICAgICAgIGRhdGFbXCJuYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJwY3NcIl0gPSB0aGlzLnBjcztcclxuICAgICAgICBkYXRhW1wic2hpcHBpbmdDb3VudHJ5XCJdID0gdGhpcy5zaGlwcGluZ0NvdW50cnk7XHJcbiAgICAgICAgZGF0YVtcImN1cnJlbmN5XCJdID0gdGhpcy5jdXJyZW5jeTtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIGRhdGFbXCJzaGlwcGluZ1wiXSA9IHRoaXMuc2hpcHBpbmc7XHJcbiAgICAgICAgZGF0YVtcInNoaXBwaW5nQWRkaXRpb25hbFwiXSA9IHRoaXMuc2hpcHBpbmdBZGRpdGlvbmFsO1xyXG4gICAgICAgIGRhdGFbXCJjb25kaXRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbjtcclxuICAgICAgICBkYXRhW1wiY29uZGl0aW9uRGVzY3JpcHRpb25cIl0gPSB0aGlzLmNvbmRpdGlvbkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRhdGFbXCJzZWxsZXJcIl0gPSB0aGlzLnNlbGxlcjtcclxuICAgICAgICBkYXRhW1wibG9jYXRlZEluXCJdID0gdGhpcy5sb2NhdGVkSW47XHJcbiAgICAgICAgZGF0YVtcIm1hbnVhbENvbmRpdGlvbklkXCJdID0gdGhpcy5tYW51YWxDb25kaXRpb25JZDtcclxuICAgICAgICBkYXRhW1widGl0bGVDaGFuZ2VEYXRlXCJdID0gdGhpcy50aXRsZUNoYW5nZURhdGU7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5wdXJjaGFzZUhpc3RvcnkpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnB1cmNoYXNlSGlzdG9yeSlcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJwdXJjaGFzZUhpc3RvcnlcIl0ucHVzaChpdGVtLnRvSlNPTigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvdEluZm9TaG9ydCB7XHJcbiAgICBsb3RJZDogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgcGNzOiBudW1iZXI7XHJcbiAgICBzaGlwcGluZ0NvdW50cnk6IHN0cmluZztcclxuICAgIGN1cnJlbmN5OiBzdHJpbmc7XHJcbiAgICBwcmljZTogbnVtYmVyO1xyXG4gICAgc2hpcHBpbmc/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBzaGlwcGluZ0FkZGl0aW9uYWw/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBjb25kaXRpb246IHN0cmluZztcclxuICAgIGNvbmRpdGlvbkRlc2NyaXB0aW9uPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgc2VsbGVyOiBzdHJpbmc7XHJcbiAgICBsb2NhdGVkSW46IHN0cmluZztcclxuICAgIG1hbnVhbENvbmRpdGlvbklkOiBzdHJpbmc7XHJcbiAgICB0aXRsZUNoYW5nZURhdGU6IHN0cmluZztcclxuICAgIHB1cmNoYXNlSGlzdG9yeTogUHVyY2hhc2VJbmZvW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQdXJjaGFzZUluZm8gaW1wbGVtZW50cyBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHkhOiBudW1iZXI7XHJcbiAgICBkYXRlITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJUHVyY2hhc2VJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpY2UgPSBfZGF0YVtcInByaWNlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gX2RhdGFbXCJxdWFudGl0eVwiXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRlID0gX2RhdGFbXCJkYXRlXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFB1cmNoYXNlSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFB1cmNoYXNlSW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJwcmljZVwiXSA9IHRoaXMucHJpY2U7XHJcbiAgICAgICAgZGF0YVtcInF1YW50aXR5XCJdID0gdGhpcy5xdWFudGl0eTtcclxuICAgICAgICBkYXRhW1wiZGF0ZVwiXSA9IHRoaXMuZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHVyY2hhc2VJbmZvIHtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hbnVhbENvbmRpdGlvbiBpbXBsZW1lbnRzIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQhOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbiE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU1hbnVhbENvbmRpdGlvbikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gX2RhdGFbXCJpZFwiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IF9kYXRhW1wiZGVzY3JpcHRpb25cIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogTWFudWFsQ29uZGl0aW9uIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFudWFsQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImlkXCJdID0gdGhpcy5pZDtcclxuICAgICAgICBkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYW51YWxDb25kaXRpb24ge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb3RTdGF0ZSBpbXBsZW1lbnRzIElMb3RTdGF0ZSB7XHJcbiAgICBsb3RJZCE6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3QhOiBib29sZWFuO1xyXG4gICAgbGFzdFVwZGF0ZSE6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSUxvdFN0YXRlKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG90SWQgPSBfZGF0YVtcImxvdElkXCJdO1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZVRoYXRMb3QgPSBfZGF0YVtcImlnbm9yZVRoYXRMb3RcIl07XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IF9kYXRhW1wibGFzdFVwZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBMb3RTdGF0ZSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IExvdFN0YXRlKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImxvdElkXCJdID0gdGhpcy5sb3RJZDtcclxuICAgICAgICBkYXRhW1wiaWdub3JlVGhhdExvdFwiXSA9IHRoaXMuaWdub3JlVGhhdExvdDtcclxuICAgICAgICBkYXRhW1wibGFzdFVwZGF0ZVwiXSA9IHRoaXMubGFzdFVwZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTG90U3RhdGUge1xyXG4gICAgbG90SWQ6IG51bWJlcjtcclxuICAgIGlnbm9yZVRoYXRMb3Q6IGJvb2xlYW47XHJcbiAgICBsYXN0VXBkYXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnRFcnJvckluZm8gaW1wbGVtZW50cyBJQ2xpZW50RXJyb3JJbmZvIHtcclxuICAgIHVybCE6IHN0cmluZztcclxuICAgIGVycm9yITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJQ2xpZW50RXJyb3JJbmZvKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnRoaXMpW3Byb3BlcnR5XSA9ICg8YW55PmRhdGEpW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KF9kYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXJsID0gX2RhdGFbXCJ1cmxcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBfZGF0YVtcImVycm9yXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IENsaWVudEVycm9ySW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IENsaWVudEVycm9ySW5mbygpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJ1cmxcIl0gPSB0aGlzLnVybDtcclxuICAgICAgICBkYXRhW1wiZXJyb3JcIl0gPSB0aGlzLmVycm9yO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDbGllbnRFcnJvckluZm8ge1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICBlcnJvcjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2hpcHBpbmdUeXBlIGltcGxlbWVudHMgSVNoaXBwaW5nVHlwZSB7XHJcbiAgICBuYW1lITogc3RyaW5nO1xyXG4gICAgY3VycmVuY3khOiBzdHJpbmc7XHJcbiAgICByYXRlcyE6IFNoaXBwaW5nUmF0ZXNbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVNoaXBwaW5nVHlwZSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmF0ZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBfZGF0YVtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVuY3kgPSBfZGF0YVtcImN1cnJlbmN5XCJdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfZGF0YVtcInJhdGVzXCJdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJyYXRlc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhdGVzIS5wdXNoKFNoaXBwaW5nUmF0ZXMuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFNoaXBwaW5nVHlwZSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNoaXBwaW5nVHlwZSgpO1xyXG4gICAgICAgIHJlc3VsdC5pbml0KGRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGRhdGFbXCJuYW1lXCJdID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRhdGFbXCJjdXJyZW5jeVwiXSA9IHRoaXMuY3VycmVuY3k7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5yYXRlcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcInJhdGVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5yYXRlcylcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJyYXRlc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2hpcHBpbmdUeXBlIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGN1cnJlbmN5OiBzdHJpbmc7XHJcbiAgICByYXRlczogU2hpcHBpbmdSYXRlc1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2hpcHBpbmdSYXRlcyBpbXBsZW1lbnRzIElTaGlwcGluZ1JhdGVzIHtcclxuICAgIHNwZWNpZmllZENvdW50cmllcz86IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xyXG4gICAgcmF0ZXMhOiBTaGlwcGluZ1JhdGVbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVNoaXBwaW5nUmF0ZXMpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhdGVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJzcGVjaWZpZWRDb3VudHJpZXNcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWNpZmllZENvdW50cmllcyA9IFtdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2RhdGFbXCJzcGVjaWZpZWRDb3VudHJpZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVjaWZpZWRDb3VudHJpZXMhLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2RhdGFbXCJyYXRlc1wiXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmF0ZXMgPSBbXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9kYXRhW1wicmF0ZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYXRlcyEucHVzaChTaGlwcGluZ1JhdGUuZnJvbUpTKGl0ZW0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFNoaXBwaW5nUmF0ZXMge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBTaGlwcGluZ1JhdGVzKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zcGVjaWZpZWRDb3VudHJpZXMpKSB7XHJcbiAgICAgICAgICAgIGRhdGFbXCJzcGVjaWZpZWRDb3VudHJpZXNcIl0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnNwZWNpZmllZENvdW50cmllcylcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJzcGVjaWZpZWRDb3VudHJpZXNcIl0ucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5yYXRlcykpIHtcclxuICAgICAgICAgICAgZGF0YVtcInJhdGVzXCJdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5yYXRlcylcclxuICAgICAgICAgICAgICAgIGRhdGFbXCJyYXRlc1wiXS5wdXNoKGl0ZW0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2hpcHBpbmdSYXRlcyB7XHJcbiAgICBzcGVjaWZpZWRDb3VudHJpZXM/OiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcclxuICAgIHJhdGVzOiBTaGlwcGluZ1JhdGVbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNoaXBwaW5nUmF0ZSBpbXBsZW1lbnRzIElTaGlwcGluZ1JhdGUge1xyXG4gICAgbWluV2VpZ2h0ITogbnVtYmVyO1xyXG4gICAgbWF4V2VpZ2h0ITogbnVtYmVyO1xyXG4gICAgcHJpY2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElTaGlwcGluZ1JhdGUpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5taW5XZWlnaHQgPSBfZGF0YVtcIm1pbldlaWdodFwiXTtcclxuICAgICAgICAgICAgdGhpcy5tYXhXZWlnaHQgPSBfZGF0YVtcIm1heFdlaWdodFwiXTtcclxuICAgICAgICAgICAgdGhpcy5wcmljZSA9IF9kYXRhW1wicHJpY2VcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogU2hpcHBpbmdSYXRlIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2hpcHBpbmdSYXRlKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcIm1pbldlaWdodFwiXSA9IHRoaXMubWluV2VpZ2h0O1xyXG4gICAgICAgIGRhdGFbXCJtYXhXZWlnaHRcIl0gPSB0aGlzLm1heFdlaWdodDtcclxuICAgICAgICBkYXRhW1wicHJpY2VcIl0gPSB0aGlzLnByaWNlO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTaGlwcGluZ1JhdGUge1xyXG4gICAgbWluV2VpZ2h0OiBudW1iZXI7XHJcbiAgICBtYXhXZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaWNlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ3VycmVuY3kgaW1wbGVtZW50cyBJQ3VycmVuY3kge1xyXG4gICAgZWJheU5hbWUhOiBzdHJpbmc7XHJcbiAgICBydXNOYW1lITogc3RyaW5nO1xyXG4gICAgcmF0ZSE6IG51bWJlcjtcclxuICAgIGxhc3RVcGRhdGUhOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElDdXJyZW5jeSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmViYXlOYW1lID0gX2RhdGFbXCJlYmF5TmFtZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5ydXNOYW1lID0gX2RhdGFbXCJydXNOYW1lXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnJhdGUgPSBfZGF0YVtcInJhdGVcIl07XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IF9kYXRhW1wibGFzdFVwZGF0ZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBDdXJyZW5jeSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEN1cnJlbmN5KCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZGF0YVtcImViYXlOYW1lXCJdID0gdGhpcy5lYmF5TmFtZTtcclxuICAgICAgICBkYXRhW1wicnVzTmFtZVwiXSA9IHRoaXMucnVzTmFtZTtcclxuICAgICAgICBkYXRhW1wicmF0ZVwiXSA9IHRoaXMucmF0ZTtcclxuICAgICAgICBkYXRhW1wibGFzdFVwZGF0ZVwiXSA9IHRoaXMubGFzdFVwZGF0ZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ3VycmVuY3kge1xyXG4gICAgZWJheU5hbWU6IHN0cmluZztcclxuICAgIHJ1c05hbWU6IHN0cmluZztcclxuICAgIHJhdGU6IG51bWJlcjtcclxuICAgIGxhc3RVcGRhdGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gX2RhdGFbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gX2RhdGFbXCJ0aXRsZVwiXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBfZGF0YVtcInN0YXR1c1wiXTtcclxuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBfZGF0YVtcImRldGFpbFwiXTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSA9IF9kYXRhW1wiaW5zdGFuY2VcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tSlMoZGF0YTogYW55KTogUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYWJzdHJhY3QgY2xhc3MgJ1Byb2JsZW1EZXRhaWxlZEluZm8nIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1widHlwZVwiXSA9IHRoaXMudHlwZTtcclxuICAgICAgICBkYXRhW1widGl0bGVcIl0gPSB0aGlzLnRpdGxlO1xyXG4gICAgICAgIGRhdGFbXCJzdGF0dXNcIl0gPSB0aGlzLnN0YXR1cztcclxuICAgICAgICBkYXRhW1wiZGV0YWlsXCJdID0gdGhpcy5kZXRhaWw7XHJcbiAgICAgICAgZGF0YVtcImluc3RhbmNlXCJdID0gdGhpcy5pbnN0YW5jZTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgdGl0bGU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBzdGF0dXM/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBkZXRhaWw/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBpbnN0YW5jZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJTm90Rm91bmRQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9ycyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSU5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlci5pbml0KF9kYXRhKTtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBfZGF0YVtcImVycm9yc1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZXJyb3JzXCJdID0gdGhpcy5lcnJvcnM7XHJcbiAgICAgICAgc3VwZXIudG9KU09OKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8gZXh0ZW5kcyBJUHJvYmxlbURldGFpbGVkSW5mbyB7XHJcbiAgICBlcnJvcnM/OiBFcnJvcnMgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIFByb2JsZW1EZXRhaWxlZEluZm8gaW1wbGVtZW50cyBJVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8ge1xyXG4gICAgZXJyb3JzPzogRXJyb3JzMiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhPzogSVZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoX2RhdGEpO1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IF9kYXRhW1wiZXJyb3JzXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IFZhbGlkYXRpb25Qcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgICAgICBkYXRhID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHt9O1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8oKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBkYXRhW1wiZXJyb3JzXCJdID0gdGhpcy5lcnJvcnM7XHJcbiAgICAgICAgc3VwZXIudG9KU09OKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbyBleHRlbmRzIElQcm9ibGVtRGV0YWlsZWRJbmZvIHtcclxuICAgIGVycm9ycz86IEVycm9yczIgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvcnMgaW1wbGVtZW50cyBJRXJyb3JzIHtcclxuXHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YT86IElFcnJvcnMpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+dGhpcylbcHJvcGVydHldID0gKDxhbnk+ZGF0YSlbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX2RhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoX2RhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBfZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21KUyhkYXRhOiBhbnkpOiBFcnJvcnMge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMoKTtcclxuICAgICAgICByZXN1bHQuaW5pdChkYXRhKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTihkYXRhPzogYW55KSB7XHJcbiAgICAgICAgZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gdGhpc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvcnMge1xyXG5cclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yczIgaW1wbGVtZW50cyBJRXJyb3JzMiB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE/OiBJRXJyb3JzMikge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT50aGlzKVtwcm9wZXJ0eV0gPSAoPGFueT5kYXRhKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfZGF0YT86IGFueSkge1xyXG4gICAgICAgIGlmIChfZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IF9kYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbUpTKGRhdGE6IGFueSk6IEVycm9yczIge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBFcnJvcnMyKCk7XHJcbiAgICAgICAgcmVzdWx0LmluaXQoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oZGF0YT86IGFueSkge1xyXG4gICAgICAgIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge307XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHRoaXNbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JzMiB7XHJcblxyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgc3RhdHVzOiBudW1iZXI7XHJcbiAgICByZXNwb25zZTogc3RyaW5nO1xyXG4gICAgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH07XHJcbiAgICByZXN1bHQ6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogc3RyaW5nLCBoZWFkZXJzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSwgcmVzdWx0OiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBpc0FwaUV4Y2VwdGlvbiA9IHRydWU7XHJcblxyXG4gICAgc3RhdGljIGlzQXBpRXhjZXB0aW9uKG9iajogYW55KTogb2JqIGlzIEFwaUV4Y2VwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG9iai5pc0FwaUV4Y2VwdGlvbiA9PT0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGhyb3dFeGNlcHRpb24obWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IHN0cmluZywgaGVhZGVyczogeyBba2V5OiBzdHJpbmddOiBhbnk7IH0sIHJlc3VsdD86IGFueSk6IGFueSB7XHJcbiAgICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRocm93IHJlc3VsdDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aHJvdyBuZXcgQXBpRXhjZXB0aW9uKG1lc3NhZ2UsIHN0YXR1cywgcmVzcG9uc2UsIGhlYWRlcnMsIG51bGwpO1xyXG59IiwiaW1wb3J0IHtPQXV0aDJDbGllbnQsIE9BdXRoMlRva2VufSBmcm9tICdAYmFkZ2F0ZXdheS9vYXV0aDItY2xpZW50JztcclxuXHJcblxyXG50eXBlIE9BdXRoMkZldGNoT3B0aW9ucyA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyZW5jZSB0byBPQXV0aDIgY2xpZW50LlxyXG4gICAgICovXHJcbiAgICBjbGllbnQ6IE9BdXRoMkNsaWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFlvdSBhcmUgcmVzcG9uc2libGUgZm9yIGltcGxlbWVudGluZyB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgICogaXQncyBwdXJwb3NlIGlzIHRvIHN1cHBseSB0aGUgJ2luaXRpYWwnIG9hdXRoMiB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG1heSBiZSBhc3luYy4gUmV0dXJuIGBudWxsYCB0byBmYWlsIHRoZSBwcm9jZXNzLlxyXG4gICAgICovXHJcbiAgICBnZXROZXdUb2tlbigpOiBPQXV0aDJUb2tlbiB8IG51bGwgfCBQcm9taXNlPE9BdXRoMlRva2VuIHwgbnVsbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBzZXQsIHdpbGwgYmUgY2FsbGVkIGlmIGF1dGhlbnRpY2F0aW9uIGZhdGFsbHkgZmFpbGVkLlxyXG4gICAgICovXHJcbiAgICBvbkVycm9yPzogKGVycjogRXJyb3IpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgYWN0aXZlIHRva2VuIGNoYW5nZXMuIFVzaW5nIHRoaXMgaXNcclxuICAgICAqIG9wdGlvbmFsLCBidXQgaXQgbWF5IGJlIHVzZWQgdG8gKGZvciBleGFtcGxlKSBwdXQgdGhlIHRva2VuIGluIG9mZi1saW5lXHJcbiAgICAgKiBzdG9yYWdlIGZvciBsYXRlciB1c2FnZS5cclxuICAgICAqL1xyXG4gICAgc3RvcmVUb2tlbj86ICh0b2tlbjogT0F1dGgyVG9rZW4pID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbHNvIGFuIG9wdGlvbmFsIGZlYXR1cmUuIEltcGxlbWVudCB0aGlzIGlmIHlvdSB3YW50IHRoZSB3cmFwcGVyIHRvIHRyeSBhXHJcbiAgICAgKiBzdG9yZWQgdG9rZW4gYmVmb3JlIGF0dGVtcHRpbmcgYSBmdWxsIHJlLWF1dGhlbnRpY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIGFzeW5jLiBSZXR1cm4gbnVsbCBpZiB0aGVyZSB3YXMgbm8gdG9rZW4uXHJcbiAgICAgKi9cclxuICAgIGdldFN0b3JlZFRva2VuPzogKCkgPT4gT0F1dGgyVG9rZW4gfCBudWxsIHwgUHJvbWlzZTxPQXV0aDJUb2tlbiB8IG51bGw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IHNjaGVkdWxlIHRva2VuIHJlZnJlc2guXHJcbiAgICAgKlxyXG4gICAgICogQ2VydGFpbiBleGVjdXRpb24gZW52aXJvbm1lbnRzLCBlLmcuIFJlYWN0IE5hdGl2ZSwgZG8gbm90IGhhbmRsZSBzY2hlZHVsZWRcclxuICAgICAqIHRhc2tzIHdpdGggc2V0VGltZW91dCgpIGluIGEgZ3JhY2VmdWwgb3IgcHJlZGljdGFibGUgZmFzaGlvbi4gVGhlIGRlZmF1bHRcclxuICAgICAqIGJlaGF2aW9yIGlzIHRvIHNjaGVkdWxlIHJlZnJlc2guIFNldCB0aGlzIHRvIGZhbHNlIHRvIGRpc2FibGUgc2NoZWR1bGluZy5cclxuICAgICAqL1xyXG4gICAgc2NoZWR1bGVSZWZyZXNoPzogYm9vbGVhbjtcclxuXHJcbiAgICBmZXRjaD86IHR5cGVvZiBmZXRjaDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZldGNoV3JhcHBlckN1c3RvbSB7XHJcblxyXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPQXV0aDJGZXRjaE9wdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDdXJyZW50IGFjdGl2ZSB0b2tlbiAoaWYgYW55KVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIHVzZXIgaGFkIGEgc3RvcmVkVG9rZW4sIHRoZSBwcm9jZXNzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBtYXkgYmUgYXN5bmMuIFdlIGtlZXAgdHJhY2sgb2YgdGhpcyBwcm9jZXNzIGluIHRoaXNcclxuICAgICAqIHByb21pc2UsIHNvIGl0IG1heSBiZSBhd2FpdGVkIHRvIGF2b2lkIHJhY2UgY29uZGl0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBBcyBzb29uIGFzIHRoaXMgcHJvbWlzZSByZXNvbHZlcywgdGhpcyBwcm9wZXJ0eSBnZXQgbnVsbGVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZUdldFN0b3JlZFRva2VuOiBudWxsIHwgUHJvbWlzZTx2b2lkPiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogT0F1dGgyRmV0Y2hPcHRpb25zKSB7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zPy5zY2hlZHVsZVJlZnJlc2ggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNjaGVkdWxlUmVmcmVzaCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ2V0U3RvcmVkVG9rZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVHZXRTdG9yZWRUb2tlbiA9IChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gYXdhaXQgb3B0aW9ucy5nZXRTdG9yZWRUb2tlbiEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvZXMgYSBmZXRjaCByZXF1ZXN0IGFuZCBhZGRzIGEgQmVhcmVyIC8gYWNjZXNzIHRva2VuLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCB0aGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIGZldGNoIGl0XHJcbiAgICAgKiBmaXJzdC4gSWYgdGhlIGFjY2VzcyB0b2tlbiBpcyBhbG1vc3QgZXhwaXJpbmcsIHRoaXMgZnVuY3Rpb24gbWlnaHQgYXR0ZW1wdFxyXG4gICAgICogdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZmV0Y2goaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgICAgICBpZiAoaW5pdC5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYWNjZXNzVG9rZW5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbml0LmhlYWRlcnMgPSB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgYWNjZXNzVG9rZW59XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VG9rZW4gPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXQuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgbmV3VG9rZW5cclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2goaW5wdXQsIGluaXQpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgdG9rZW4gaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogVGhlcmUgcmVzdWx0IG9iamVjdCB3aWxsIGhhdmU6XHJcbiAgICAgKiAgICogYWNjZXNzVG9rZW5cclxuICAgICAqICAgKiBleHBpcmVzQXQgLSB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBudWxsLlxyXG4gICAgICogICAqIHJlZnJlc2hUb2tlbiAtIG1heSBiZSBudWxsXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGF0dGVtcHQgdG8gYXV0b21hdGljYWxseSByZWZyZXNoIGlmIHN0YWxlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRUb2tlbigpOiBQcm9taXNlPE9BdXRoMlRva2VuPiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLmV4cGlyZXNBdCA9PT0gbnVsbCB8fCB0aGlzLnRva2VuLmV4cGlyZXNBdCA+IERhdGUubm93KCkpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgY3VycmVudCB0b2tlbiBpcyBzdGlsbCB2YWxpZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoVG9rZW4oKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFjY2VzcyB0b2tlbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgY3VycmVudCBhY2Nlc3MgdG9rZW4gaXMgbm90IGtub3duLCBpdCB3aWxsIGF0dGVtcHQgdG8gZmV0Y2ggaXQuXHJcbiAgICAgKiBJZiB0aGUgYWNjZXNzIHRva2VuIGlzIGV4cGlyaW5nLCBpdCB3aWxsIGF0dGVtcHQgdG8gcmVmcmVzaCBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0QWNjZXNzVG9rZW4oKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgLy8gRW5zdXJlIGdldFN0b3JlZFRva2VuIGZpbmlzaGVkLlxyXG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZlR2V0U3RvcmVkVG9rZW47XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiB0b2tlbi5hY2Nlc3NUb2tlbjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBLZWVwaW5nIHRyYWNrIG9mIGFuIGFjdGl2ZSByZWZyZXNoVG9rZW4gb3BlcmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgd2lsbCBhbGxvdyB1cyB0byBlbnN1cmUgb25seSAxIHN1Y2ggb3BlcmF0aW9uIGhhcHBlbnMgYXQgYW55XHJcbiAgICAgKiBnaXZlbiB0aW1lLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFjdGl2ZVJlZnJlc2g6IFByb21pc2U8T0F1dGgyVG9rZW4+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZXMgYW4gYWNjZXNzIHRva2VuIHJlZnJlc2hcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaFRva2VuKCk6IFByb21pc2U8T0F1dGgyVG9rZW4+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgY3VycmVudGx5IGFscmVhZHkgZG9pbmcgdGhpcyBvcGVyYXRpb24sXHJcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBkbyBpdCB0d2ljZSBpbiBwYXJhbGxlbC5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUmVmcmVzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZFRva2VuID0gdGhpcy50b2tlbjtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlZnJlc2ggPSAoYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1Rva2VuOiBPQXV0aDJUb2tlbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRUb2tlbj8ucmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGFkIGEgcmVmcmVzaCB0b2tlbiwgbGV0cyBzZWUgaWYgd2UgY2FuIHVzZSBpdCFcclxuICAgICAgICAgICAgICAgICAgICBuZXdUb2tlbiA9IGF3YWl0IHRoaXMub3B0aW9ucy5jbGllbnQucmVmcmVzaFRva2VuKG9sZFRva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tvYXV0aDJdIHJlZnJlc2ggdG9rZW4gbm90IGFjY2VwdGVkLCB3ZVxcJ2xsIHRyeSByZWF1dGhlbnRpY2F0aW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIG5ld1Rva2VuID0gYXdhaXQgdGhpcy5vcHRpb25zLmdldE5ld1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3VG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIG9idGFpbiBPQXV0aDIgdG9rZW5zLCBhIGZ1bGwgcmVhdXRoIG1heSBiZSBuZWVkZWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yPy4oZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VG9rZW47XHJcblxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5hY3RpdmVSZWZyZXNoO1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zdG9yZVRva2VuPy4odG9rZW4pO1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVmcmVzaCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY2xlYXIgdGhlIGN1cnJlbnQgcmVmcmVzaCBvcGVyYXRpb24uXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVmcmVzaCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRpbWVyIHRyaWdnZXIgZm9yIHRoZSBuZXh0IGF1dG9tYXRlZCByZWZyZXNoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc2NoZWR1bGVSZWZyZXNoKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNjaGVkdWxlUmVmcmVzaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lcikge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZWZyZXNoVGltZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4/LmV4cGlyZXNBdCB8fCAhdGhpcy50b2tlbi5yZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB3aGVuIHRoZSB0b2tlbiBleHBpcmVzLCBvciBkb24ndCBoYXZlIGEgcmVmcmVzaF90b2tlbiwgZG9uJ3QgYm90aGVyLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSB0aGlzLnRva2VuLmV4cGlyZXNBdCAtIERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgc2NoZWR1bGUgdGhpcyBldmVudCBpZiBpdCBoYXBwZW5zIG1vcmUgdGhhbiAyIG1pbnV0ZXMgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICBpZiAoZXhwaXJlc0luIDwgMTIwICogMTAwMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTY2hlZHVsZSAxIG1pbnV0ZSBiZWZvcmUgZXhwaXJ5XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tmZXRjaC1tdy1vYXV0aDJdIGVycm9yIHdoaWxlIGRvaW5nIGEgYmFja2dyb3VuZCBPQXV0aDIgYXV0by1yZWZyZXNoJywgZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGV4cGlyZXNJbiAtIDYwICogMTAwMCk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgQ2xpZW50LCBDbGllbnRFcnJvckluZm8sXHJcbiAgICBMb3RJbmZvLFxyXG4gICAgTG90SW5mb1dpdGhQcm9kdWN0SWQsIE5vdEZvdW5kUHJvYmxlbURldGFpbGVkSW5mbyxcclxuICAgIFB1cmNoYXNlSW5mbywgVmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm9cclxufSBmcm9tIFwiLi9FYmF5Q2xpZW50L0ViYXlDbGllbnRcIlxyXG5cclxuaW1wb3J0IGpzb25wYXRoIGZyb20gXCJqc29ucGF0aFwiO1xyXG5pbXBvcnQge2dlbmVyYXRlQ29kZVZlcmlmaWVyLCBPQXV0aDJDbGllbnR9IGZyb20gJ0BiYWRnYXRld2F5L29hdXRoMi1jbGllbnQnO1xyXG5pbXBvcnQge0ZldGNoV3JhcHBlckN1c3RvbX0gZnJvbSBcIi4vRmV0Y2hXcmFwcGVyQ3VzdG9tXCI7XHJcblxyXG5jb25zdCBpZ25vcmVUaGF0TG90RmllbGROYW1lID0gXCJpZ25vcmVUaGF0TG90XCI7XHJcbmNvbnN0IG1hbnVhbENvbmRpdGlvbklkRmllbGROYW1lID0gXCJtYW51YWxDb25kaXRpb25JZFwiO1xyXG5jb25zdCBwcm9kdWN0RmllbGROYW1lID0gXCJwcm9kdWN0SWRcIjtcclxuY29uc3QgcGNzRmllbGROYW1lID0gXCJwY3NcIjtcclxuXHJcbmNvbnN0IHBhbmVsQ2xhc3MgPSBcInBhbmVsLWRpdlwiO1xyXG5jb25zdCBmb3JtSWQgPSBcInByb2R1Y3QtZm9ybS1pZFwiXHJcbmNvbnN0IGVycm9yRWxlbWVudElkID0gXCJlcnJvckVsZW1lbnRcIlxyXG5jb25zdCBzdWJtaXRJZCA9IFwic3VibWl0QnV0dG9uXCJcclxuLy9jb25zdCBiYWNrZW5kVXJsID0gXCJodHRwczovL2xvY2FsaG9zdDo3MDk1L1wiXHJcbmNvbnN0IGJhY2tlbmRVcmwgPSBcImh0dHBzOi8vbmFrczQyLnJ1OjE3NDQzL1wiXHJcbmNvbnN0IGJhc2VBcGlVcmwgPSBgJHtiYWNrZW5kVXJsfWFwaS9lYmF5L3YxYDtcclxuY29uc3QgYXV0aFJlZGlyZWN0VXJsID0gXCJodHRwczovL3d3dy5lYmF5LmNvbS9cIlxyXG5jb25zdCBub3RTZXRWYWx1ZSA9IFwibm90U2V0XCJcclxuY29uc3QgbGlnaHRHcmVlbkNvbG9yID0gXCIjZWNmZmVjXCJcclxuY29uc3QgbGlnaHRQaW5rQ29sb3IgPSBcImxpZ2h0cGlua1wiXHJcbmNvbnN0IGxpZ2h0WWVsbG93Q29sb3IgPSBcIiNlMGUwN2ZcIlxyXG5jb25zdCBzdXBwb3J0ZWRFdXJvcGVDb3VudHJpZXMgPSBuZXcgU2V0KFtcclxuICAgICdHZXJtYW55JyxcclxuICAgICdJdGFseScsXHJcbiAgICAnRnJhbmNlJyxcclxuICAgICdVbml0ZWQgS2luZ2RvbScsXHJcbiAgICAnQnVsZ2FyaWEnLFxyXG4gICAgJ0xpdGh1YW5pYScsXHJcbiAgICAnU2xvdmFraWEnLFxyXG4gICAgJ0xhdHZpYScsXHJcbiAgICAnUm9tYW5pYScsXHJcbiAgICAnRXN0b25pYScsXHJcbiAgICAnUG9sYW5kJ1xyXG5dKVxyXG5jb25zdCBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllcyA9IFtcclxuICAgICdHZXJtYW55JyxcclxuICAgICdJdGFseScsXHJcbiAgICAnRnJhbmNlJyxcclxuICAgICdVbml0ZWQgS2luZ2RvbScsXHJcbiAgICAnQnVsZ2FyaWEnLFxyXG4gICAgJ0xpdGh1YW5pYScsXHJcbiAgICAnU2xvdmFraWEnLFxyXG4gICAgJ0xhdHZpYScsXHJcbiAgICAnUm9tYW5pYScsXHJcbiAgICAnRXN0b25pYScsXHJcbiAgICAnUG9sYW5kJyxcclxuICAgICdVbml0ZWQgU3RhdGVzJyxcclxuICAgICdBdXN0cmFsaWEnXHJcbl1cclxuY29uc3Qgc3VwcG9ydGVkU2hpcHBpbmdDb3VudHJpZXNEaWN0aW9uYXJ5ID0ge1xyXG4gICAgXCJHZXJtYW55XCI6IFwiREVVXCIsXHJcbiAgICBcIkl0YWx5XCI6IFwiSVRBXCIsXHJcbiAgICBcIkZyYW5jZVwiOiBcIkZSQVwiLFxyXG4gICAgXCJVbml0ZWQgS2luZ2RvbVwiOiBcIkdCUlwiLFxyXG4gICAgXCJVbml0ZWQgU3RhdGVzXCI6IFwiVVNBXCIsXHJcbiAgICBcIkF1c3RyYWxpYVwiOiBcIkFVU1wiLFxyXG4gICAgJ0J1bGdhcmlhJzogXCJCR1JcIixcclxuICAgICdMaXRodWFuaWEnOiBcIkxUVVwiLFxyXG4gICAgJ1Nsb3Zha2lhJzogXCJTVktcIixcclxuICAgICdMYXR2aWEnOiBcIkxWQVwiLFxyXG4gICAgJ1JvbWFuaWEnOiBcIlJPVVwiLFxyXG4gICAgJ0VzdG9uaWEnOiBcIkVTVFwiLFxyXG4gICAgJ1BvbGFuZCc6IFwiUE9MXCIsXHJcbn1cclxuY29uc3QgemlwQ29kZXMgPSB7XHJcbiAgICBcIlVuaXRlZCBTdGF0ZXNcIjogXCI0MDIwMlwiLFxyXG4gICAgXCJBdXN0cmFsaWFcIjogXCIzMDAw4oCTMzk5OVwiXHJcbn1cclxuY29uc3QgYmF0Y2hPcGVuID0gNVxyXG5cclxuY29uc3Qgc2VhcmNoUXVlcnlQYXJhbSA9ICdzZWFyY2hRdWVyeSdcclxuXHJcbmNvbnN0IGlnbm9yZVRoYXRMb3REaXYgPSBcImlnbm9yZVRoYXRMb3REaXZcIlxyXG5jb25zdCB1bnN1cHBvcnRlZExvdERpdiA9IFwidW5zdXBwb3J0ZWRMb3REaXZcIlxyXG5cclxuY29uc3QgbG90SW5mbyA9IG5ldyBMb3RJbmZvKCk7XHJcbmxldCBfc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQ7XHJcbmxldCBfdW5zdXBwb3J0ZWRMb3QgPSBmYWxzZTtcclxubGV0IF9rbm93bkxvdHNJZHM6IG51bWJlcltdID0gW11cclxuXHJcbi8vIGZldGNoINGH0LXRgNC10LcgYmFja2dyb3VuZCBzY3JpcHQsINC/0L4g0LTRgNGD0LPQvtC80YMg0L3QtSDRgNCw0LHQvtGC0LDQtdGCXHJcbmZ1bmN0aW9uIGZldGNoUmVzb3VyY2UoaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2lucHV0LCBpbml0fSwgbWVzc2FnZVJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgW3Jlc3BvbnNlLCBlcnJvcl0gPSBtZXNzYWdlUmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSB1bmRlZmluZWQgb24gYSAyMDQgLSBObyBDb250ZW50XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gcmVzcG9uc2UuYm9keSA/IG5ldyBCbG9iKFtyZXNwb25zZS5ib2R5XSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBleHRyYWN0UHJpY2UocHJpY2U6IHN0cmluZyk6IFByaWNlIHtcclxuICAgIGxldCBwcmljZVRyaW1tZWQgPSBwcmljZS50cmltKClcclxuICAgIGxldCBtYXRjaGVzID0gcHJpY2VUcmltbWVkLm1hdGNoKC9eKFxcRCspKFxcZCsoPzpbLC5dXFxkKyk/XFxzKikoWyhcXC9dLit8JCkvKVxyXG4gICAgaWYgKG1hdGNoZXMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByaWNlKHBhcnNlRmxvYXQobWF0Y2hlc1syXS5yZXBsYWNlKCcsJywgJy4nKSksIG1hdGNoZXNbMV0udHJpbSgpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgbWF0Y2hlcyA9IHByaWNlVHJpbW1lZC5tYXRjaCgvXihcXGQrKD86WywuXVxcZCspPykoXFxEKykoWyhcXC9dLit8JCkvKVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJpY2UocGFyc2VGbG9hdChtYXRjaGVzWzFdLnJlcGxhY2UoJywnLCAnLicpKSwgbWF0Y2hlc1syXS50cmltKCkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByaWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByaWNlOiBudW1iZXIsIGN1cnJlbmN5OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW5jeSA9IGN1cnJlbmN5XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlXHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIHByaWNlOiBudW1iZXI7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBhbmVsKGNsaWVudDogQ2xpZW50KTogUHJvbWlzZTxIVE1MRGl2RWxlbWVudD4ge1xyXG4gICAgbGV0IGJvZHlFbGVtZW50ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdib2R5JywgZG9jdW1lbnQpO1xyXG5cclxuICAgIGxldCBwYW5lbCA9IGJvZHlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi4nICsgcGFuZWxDbGFzcylcclxuXHJcbiAgICBpZiAocGFuZWwgIT09IG51bGwgJiYgcGFuZWwgIT09IHVuZGVmaW5lZCkgcmV0dXJuIDxIVE1MRGl2RWxlbWVudD5wYW5lbDtcclxuXHJcbiAgICBsZXQgc3R5bGVzID0gYFxyXG4gICAgLiR7cGFuZWxDbGFzc30ge1xyXG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgICBwYWRkaW5nOiAxNXB4O1xyXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCAjMDAwMGNjO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICBjb2xvcjogIzAwMDBjYztcclxuICAgICAgcG9zaXRpb246Zml4ZWQ7XHJcbiAgICAgIHotaW5kZXg6MTAwO1xyXG4gICAgICBsZWZ0OjElO1xyXG4gICAgICBib3R0b206NSU7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbCB7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgICBmbG9hdDogbGVmdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gaW5wdXQge1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IHNlbGVjdCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gbGFiZWw6YWZ0ZXIgeyBjb250ZW50OiBcIjogXCIgfVxyXG5gXHJcblxyXG4gICAgbGV0IHN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIilcclxuICAgIHN0eWxlU2hlZXQuaW5uZXJUZXh0ID0gc3R5bGVzXHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChzdHlsZVNoZWV0KVxyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3MpO1xyXG5cclxuXHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKVxyXG4gICAgZm9ybS5pZCA9IGZvcm1JZFxyXG4gICAgbGV0IGl0ZW1JZCA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9cXC9pdG1cXC8oWzAtOV0rKS8pWzFdO1xyXG4gICAgbGV0IGRvbWFpbiA9IGxvY2F0aW9uLmhvc3RuYW1lO1xyXG5cclxuICAgIGxldCBoaXN0b3J5QnV0dG9uSHJlZiA9IGBodHRwczovLyR7ZG9tYWlufS9iaW4vcHVyY2hhc2VIaXN0b3J5P2l0ZW09JHtpdGVtSWR9YDtcclxuICAgIC8vIGxhbmd1YWdlPUhUTUxcclxuICAgIGZvcm0uaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxhIGhyZWY9XCIke2hpc3RvcnlCdXR0b25IcmVmfVwiIHRhcmdldD1cIl9ibGFua1wiPtCY0YHRgtC+0YDQuNGPINC/0YDQvtC00LDQtiDQu9C+0YLQsDwvYT5cclxuICAgICAgICA8YnI+0JHRjdC60LXQvdC0OiA8YSBocmVmPVwiJHtiYWNrZW5kVXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YmFja2VuZFVybH08L2E+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IGlkPVwiJHtpZ25vcmVUaGF0TG90RGl2fVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZ25vcmVUaGF0TG90RmllbGROYW1lfVwiPtCY0LPQvdC+0YDQuNGA0L7QstCw0YLRjCDQu9C+0YI8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCIke2lnbm9yZVRoYXRMb3RGaWVsZE5hbWV9XCIgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cIiR7aWdub3JlVGhhdExvdEZpZWxkTmFtZX1cIi8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Byb2R1Y3RGaWVsZE5hbWV9XCI+0KLQvtCy0LDRgDwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiIGlkPVwiJHtwcm9kdWN0RmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDRgtC+0LLQsNGAPC9vcHRpb24+XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCIke3Bjc0ZpZWxkTmFtZX1cIj5QQ1M8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7cGNzRmllbGROYW1lfVwiIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwiJHtwY3NGaWVsZE5hbWV9XCIvPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiJHttYW51YWxDb25kaXRpb25JZEZpZWxkTmFtZX1cIj7QodC+0YHRgtC+0Y/QvdC40LU8L2xhYmVsPlxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIiR7bWFudWFsQ29uZGl0aW9uSWRGaWVsZE5hbWV9XCIgaWQ9XCIke21hbnVhbENvbmRpdGlvbklkRmllbGROYW1lfVwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+0JLRi9Cx0LXRgNC40YLQtSDQodC+0YHRgtC+0Y/QvdC40LU8L29wdGlvbj5cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGRpdiBpZD1cIiR7dW5zdXBwb3J0ZWRMb3REaXZ9XCIgaGlkZGVuPVwiaGlkZGVuXCI+0JvQvtGCINC90LUg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGC0YHRjywg0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INCyINC40LPQvdC+0YBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6IHJlZDtcIiBpZD1cIiR7ZXJyb3JFbGVtZW50SWR9XCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxpbnB1dCBpZD1cIiR7c3VibWl0SWR9XCIgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2F2ZVwiIGRpc2FibGVkLz5cclxuICAgIGA7XHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoZXZlbnQsIGNsaWVudClcclxuICAgIH0pO1xyXG5cclxuICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKVxyXG4gICAgZGl2LmhpZGRlbiA9IHRydWU7XHJcbiAgICBib2R5RWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xyXG5cclxuICAgIHJldHVybiBkaXZcclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9wZW5NdWx0aXBsZUJ1dHRvbigpOiBQcm9taXNlPEhUTUxEaXZFbGVtZW50PiB7XHJcbiAgICBsZXQgYm9keUVsZW1lbnQgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2JvZHknLCBkb2N1bWVudCk7XHJcblxyXG4gICAgbGV0IHBhbmVsID0gYm9keUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LicgKyBwYW5lbENsYXNzKVxyXG5cclxuICAgIGlmIChwYW5lbCAhPT0gbnVsbCAmJiBwYW5lbCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gPEhUTUxEaXZFbGVtZW50PnBhbmVsO1xyXG5cclxuICAgIGxldCBzdHlsZXMgPSBgXHJcbiAgICAuJHtwYW5lbENsYXNzfSB7XHJcbiAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgIHBhZGRpbmc6IDE1cHg7XHJcbiAgICAgIGJvcmRlcjogM3B4IHNvbGlkICMwMDAwY2M7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgIGNvbG9yOiAjMDAwMGNjO1xyXG4gICAgICBwb3NpdGlvbjpmaXhlZDtcclxuICAgICAgei1pbmRleDoxMDA7XHJcbiAgICAgIGxlZnQ6MSU7XHJcbiAgICAgIGJvdHRvbTo1JTtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC4ke3BhbmVsQ2xhc3N9IGxhYmVsIHtcclxuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICB3aWR0aDogMjAwcHg7XHJcbiAgICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBpbnB1dCB7XHJcbiAgICAgIHdpZHRoOiAyMDBweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLiR7cGFuZWxDbGFzc30gc2VsZWN0IHtcclxuICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAuJHtwYW5lbENsYXNzfSBsYWJlbDphZnRlciB7IGNvbnRlbnQ6IFwiOiBcIiB9XHJcbmBcclxuXHJcbiAgICBsZXQgc3R5bGVTaGVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKVxyXG4gICAgc3R5bGVTaGVldC5pbm5lclRleHQgPSBzdHlsZXNcclxuICAgIGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlU2hlZXQpXHJcblxyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQocGFuZWxDbGFzcyk7XHJcblxyXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJylcclxuICAgIGZvcm0uaWQgPSBmb3JtSWRcclxuXHJcbiAgICAvLyBsYW5ndWFnZT1IVE1MXHJcbiAgICBmb3JtLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8aW5wdXQgaWQ9XCIke3N1Ym1pdElkfVwiIHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cItCe0LrRgNGL0YLRjCAke2JhdGNoT3Blbn0g0LvQvtGC0L7QslwiLz5cclxuICAgIGA7XHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudDogU3VibWl0RXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbGV0IGxhc3RXaW5kb3c6IFdpbmRvd1Byb3h5O1xyXG4gICAgICAgIGZvciAobGV0IHggb2YgX2tub3duTG90c0lkcy5zbGljZSgwLCBiYXRjaE9wZW4pKSB7XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIiArIHg7XHJcbiAgICAgICAgICAgIGxhc3RXaW5kb3cgPSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHNsZWVwKDUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhc3RXaW5kb3c/LmZvY3VzKClcclxuICAgIH0pO1xyXG5cclxuICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKVxyXG4gICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxuXHJcbiAgICByZXR1cm4gZGl2XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudDogU3VibWl0RXZlbnQsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD5ldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgICBsZXQgaWdub3JlVGhhdExvdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdpZ25vcmVUaGF0TG90Jykge1xyXG4gICAgICAgICAgICAgICAgaWdub3JlVGhhdExvdCA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm9ba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChfdW5zdXBwb3J0ZWRMb3QpIHtcclxuICAgICAgICAgICAgaWdub3JlVGhhdExvdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb3RJbmZvWydpZ25vcmVUaGF0TG90J10gPSBpZ25vcmVUaGF0TG90O1xyXG5cclxuICAgICAgICBpZiAoaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICBpZiAoIWxvdEluZm8ucGNzKSB7XHJcbiAgICAgICAgICAgICAgICBsb3RJbmZvLnBjcyA9IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWxvdEluZm8ubWFudWFsQ29uZGl0aW9uSWQpIHtcclxuICAgICAgICAgICAgICAgIGxvdEluZm8ubWFudWFsQ29uZGl0aW9uSWQgPSBub3RTZXRWYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgdG8gYmFja2VuZDogXCIgKyBKU09OLnN0cmluZ2lmeShsb3RJbmZvKSlcclxuXHJcblxyXG4gICAgICAgIGF3YWl0IGNsaWVudC51cHNlcnRMb3RJbmZvKGxvdEluZm8sIGRhdGEuZ2V0KCdwcm9kdWN0SWQnKS50b1N0cmluZygpKVxyXG5cclxuICAgICAgICBhd2FpdCBwcm9kdWN0UGFnZShjbGllbnQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGF3YWl0IHNob3dBbmRTYXZlRXJyb3IoZXJyb3IsIGNsaWVudClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNvbGRJdGVtc1Jlc3VsdChmaXhlZFByaWNlUm93czogSFRNTFRhYmxlUm93RWxlbWVudFtdLCByZXN1bHQ6IFB1cmNoYXNlSW5mb0lubmVyW10pIHtcclxuICAgIGZvciAobGV0IGZpeGVkUHJpY2VSb3cgb2YgZml4ZWRQcmljZVJvd3MpIHtcclxuICAgICAgICBsZXQgY29sdW1ucyA9IFsuLi5maXhlZFByaWNlUm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHByaWNlID0gY29sdW1uc1sxXVxyXG5cclxuICAgICAgICBpZiAocHJpY2UgPT09IFwiRXhwaXJlZFwiIHx8IHByaWNlID09PSBcIkRlY2xpbmVkXCIpIHtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcmljZSAhPT0gXCJTb2xkIGFzIGEgc3BlY2lhbCBvZmZlclwiICYmIHByaWNlICE9PSBcIkNvdW50ZXItb2ZmZXJlZFwiICYmIHByaWNlICE9PSBcIkFjY2VwdGVkXCIpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcmljZUV4dHJhY3RlZCA9IGV4dHJhY3RQcmljZShwcmljZSlcclxuICAgICAgICAgICAgaWYgKHByaWNlRXh0cmFjdGVkLmN1cnJlbmN5ICE9PSBsb3RJbmZvLmN1cnJlbmN5KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjdXJyZW5jeSBkb2Vzbid0IG1hdGNoIHdpdGggbG90IGN1cnJlbmN5IGxvdCBjdXJyZW5jeSBcIiArIGxvdEluZm8uY3VycmVuY3kgKyBcIiBleHRyYWN0ZWQgY3VycmVuY3kgXCIgKyBwcmljZUV4dHJhY3RlZC5jdXJyZW5jeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgUHVyY2hhc2VJbmZvSW5uZXIocGFyc2VJbnQoY29sdW1uc1syXSksIHBhcnNlRGF0ZShjb2x1bW5zWzNdKSwgcHJpY2VFeHRyYWN0ZWQpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBQdXJjaGFzZUluZm9Jbm5lcihwYXJzZUludChjb2x1bW5zWzJdKSwgcGFyc2VEYXRlKGNvbHVtbnNbM10pKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFB1cmNoYXNlSW5mb0lubmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHF1YW50aXR5OiBudW1iZXIsIGRhdGU6IERhdGUsIHByaWNlPzogUHJpY2UgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlXHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlXHJcbiAgICB9XHJcblxyXG4gICAgcXVhbnRpdHk6IG51bWJlcjtcclxuICAgIHByaWNlOiBQcmljZSB8IHVuZGVmaW5lZDtcclxuICAgIGRhdGU6IERhdGVcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVTdHJpbmc6c3RyaW5nKTogRGF0ZSB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IGRhdGVTdHJpbmcubWF0Y2goLyhcXGQrXFxzW0Etel0rXFxzXFxkKylcXHNhdFxccyhcXGQrKTooXFxkKyk6KFxcZCspKGFtfHBtKVxccyhbQS16XSspLylcclxuXHJcbiAgICBpZiAoIW1hdGNoZXMpIHtcclxuICAgICAgICAgbWF0Y2hlcyA9IGRhdGVTdHJpbmcubWF0Y2goLyhbQS16XStcXHNcXGQrLFxcc1xcZCspXFxzKFxcZCspOihcXGQrKTooXFxkKylcXHMoUE18QU0pXFxzKFtBLXpdKykvKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoIW1hdGNoZXMpIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBwYXJzZSB0aW1lIGluIFwiICsgZGF0ZVN0cmluZylcclxuICAgIFxyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKG1hdGNoZXNbMV0gKyAnIDAwOjAwOjAwLjAwMFonKSlcclxuXHJcbiAgICBkYXRlLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1hdGNoZXNbMl0pKTtcclxuICAgIGRhdGUuc2V0VVRDTWludXRlcyhwYXJzZUludChtYXRjaGVzWzNdKSk7XHJcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobWF0Y2hlc1s0XSkpO1xyXG5cclxuICAgIGlmIChtYXRjaGVzWzVdLnRvTG93ZXJDYXNlKCkgPT09IFwicG1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgIT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgKyAxMik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChtYXRjaGVzWzVdLnRvTG93ZXJDYXNlKCkgPT09IFwiYW1cIiAmJiBkYXRlLmdldFVUQ0hvdXJzKCkgPT09IDEyKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgLSAxMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1hdGNoZXNbNl0udG9VcHBlckNhc2UoKSA9PT0gXCJNU0tcIikge1xyXG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpIC0gMyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdGltZXpvbmUgXCIgKyBtYXRjaGVzWzZdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU29sZEl0ZW1zUGFnZSh0ZXh0OiBzdHJpbmcpOiBQdXJjaGFzZUluZm9bXSB7XHJcbiAgICBsZXQgZG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCBcInRleHQvaHRtbFwiKVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBuZXcgQXJyYXk8UHVyY2hhc2VJbmZvSW5uZXI+KCk7XHJcbiAgICBsZXQgZml4ZWRQcmljZUJsb2NrID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5maXhlZC1wcmljZSB0Ym9keScpXHJcbiAgICBpZiAoZml4ZWRQcmljZUJsb2NrICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZpeGVkUHJpY2VSb3dzID0gWy4uLmZpeGVkUHJpY2VCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCd0cicpXVxyXG4gICAgICAgIGZpbGxTb2xkSXRlbXNSZXN1bHQoZml4ZWRQcmljZVJvd3MsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9mZmVyQmxvY2sgPSBkb2MucXVlcnlTZWxlY3RvcignZGl2Lm9mZmVyIHRib2R5JylcclxuICAgIGlmIChvZmZlckJsb2NrICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IG9mZmVyUm93cyA9IFsuLi5vZmZlckJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJyldXHJcbiAgICAgICAgZmlsbFNvbGRJdGVtc1Jlc3VsdChvZmZlclJvd3MsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGIuZGF0ZS5nZXRUaW1lKCkgLSBhLmRhdGUuZ2V0VGltZSgpO1xyXG4gICAgfSkubWFwKGZ1bmN0aW9uICh4KSB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHVyY2hhc2VJbmZvKHtcclxuICAgICAgICAgICAgZGF0ZTogeC5kYXRlLnRvSVNPU3RyaW5nKCksIHF1YW50aXR5OiB4LnF1YW50aXR5LCBwcmljZTogeC5wcmljZT8ucHJpY2VcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxJZCgpIHtcclxuICAgIGxvdEluZm8ubG90SWQgPSBwYXJzZUludChsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQcmljZSgpIHtcclxuICAgIGxldCBwcmljZSA9IGV4dHJhY3RQcmljZSgoPEhUTUxFbGVtZW50PmF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LngtcHJpY2UtcHJpbWFyeSBzcGFuJywgZG9jdW1lbnQpKS5pbm5lclRleHQpXHJcbiAgICBsb3RJbmZvLnByaWNlID0gcHJpY2UucHJpY2VcclxuICAgIGxvdEluZm8uY3VycmVuY3kgPSBwcmljZS5jdXJyZW5jeVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTmFtZSgpIHtcclxuICAgIGxvdEluZm8ubmFtZSA9ICg8SFRNTEVsZW1lbnQ+YXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCcudmltIGgxJywgZG9jdW1lbnQpKS5pbm5lclRleHRcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFNlbGxlcigpIHtcclxuICAgIGxvdEluZm8uc2VsbGVyID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LXNlbGxlcmNhcmQtYXRmX19pbmZvX19hYm91dC1zZWxsZXIgYScsIGRvY3VtZW50KSkuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbENvbmRpdGlvbigpIHtcclxuICAgIGxvdEluZm8uY29uZGl0aW9uID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi54LWl0ZW0tY29uZGl0aW9uLXRleHQgc3Bhbi51eC10ZXh0c3BhbnMnLCBkb2N1bWVudCkpLmlubmVyVGV4dFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsQ29uZGl0aW9uRGVzY3JpcHRpb24oKSB7XHJcbiAgICBsZXQgY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LngtaXRlbS1jb25kaXRpb24tZGVzYycpXHJcbiAgICBpZiAoY29uZGl0aW9uRGVzY3JpcHRpb25FbGVtZW50ICE9IG51bGwpIHtcclxuICAgICAgICBsb3RJbmZvLmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gKDxIVE1MRWxlbWVudD5jb25kaXRpb25EZXNjcmlwdGlvbkVsZW1lbnQpLmlubmVyVGV4dFxyXG4gICAgICAgICAgICAucmVwbGFjZSgn4oCcJywgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCfigJ0nLCAnJylcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGhhc1NoaXBwaW5nVG9Db3VudHJ5KGNvdW50cnk6IHN0cmluZywgc2hpcHNUbzogU2V0PHN0cmluZz4sIGV4Y2x1ZGVzOiBTZXQ8c3RyaW5nPikge1xyXG4gICAgcmV0dXJuIChzaGlwc1RvLmhhcygnV29ybGR3aWRlJykgfHwgKHNoaXBzVG8uaGFzKFwiRXVyb3BlXCIpICYmIHN1cHBvcnRlZEV1cm9wZUNvdW50cmllcy5oYXMoY291bnRyeSkpIHx8IHNoaXBzVG8uaGFzKGNvdW50cnkpKSAmJiAhZXhjbHVkZXMuaGFzKGNvdW50cnkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaGlwc1RvKHNoaXBwaW5nRGl2OiBFbGVtZW50KTogU2V0PHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoKDxIVE1MRGl2RWxlbWVudD5zaGlwcGluZ0Rpdi5xdWVyeVNlbGVjdG9yKCdkaXYudXgtbGFiZWxzLXZhbHVlcy0tc2hpcHN0bycpKS5pbm5lclRleHQucmVwbGFjZShcIlNoaXBzIHRvOlwiLCBcIlwiKVxyXG4gICAgICAgIC5zcGxpdCgnLCcpLm1hcChzID0+IHMudHJpbSgpKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEV4Y2x1ZGVzKHNoaXBwaW5nRGl2OiBFbGVtZW50KTogU2V0PHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoKDxIVE1MRGl2RWxlbWVudD5zaGlwcGluZ0Rpdi5xdWVyeVNlbGVjdG9yKCdkaXYudXgtbGFiZWxzLXZhbHVlcy0tZXhjbHVkZXMnKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJFeGNsdWRlczpcIiwgXCJcIilcclxuICAgICAgICAuc3BsaXQoJywnKS5tYXAocyA9PiBzLnRyaW0oKSkpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzaG93TG90SXNOb3RTdXBwb3J0ZWQoKSB7XHJcbiAgICAoPEhUTUxEaXZFbGVtZW50Pihhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2RpdiMnICsgaWdub3JlVGhhdExvdERpdiwgZG9jdW1lbnQpKSkuaGlkZGVuID0gdHJ1ZTtcclxuICAgICg8SFRNTERpdkVsZW1lbnQ+KGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2IycgKyB1bnN1cHBvcnRlZExvdERpdiwgZG9jdW1lbnQpKSkuaGlkZGVuID0gZmFsc2U7XHJcblxyXG4gICAgX3Vuc3VwcG9ydGVkTG90ID0gdHJ1ZTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbFNoaXBwaW5nKCkge1xyXG4gICAgbGV0IHNoaXBwaW5nRGl2ID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCdkaXYuZC1zaGlwcGluZy1tYXh2aWV3JywgZG9jdW1lbnQpO1xyXG4gICAgbGV0IHNoaXBzVG8gPSBnZXRTaGlwc1RvKHNoaXBwaW5nRGl2KTtcclxuICAgIGxldCBleGNsdWRlcyA9IGdldEV4Y2x1ZGVzKHNoaXBwaW5nRGl2KTtcclxuXHJcbiAgICBsZXQgc2hpcHBpbmdGcm9tQ291bnRyeSA9IGxvdEluZm8ubG9jYXRlZEluLnNwbGl0KCcsJykucG9wKCkudHJpbSgpXHJcbiAgICBsZXQgaW5kZXhPZlNoaXBwaW5nRnJvbUNvdW50cmllcyA9IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzLmluZGV4T2Yoc2hpcHBpbmdGcm9tQ291bnRyeSlcclxuXHJcbiAgICBpZiAoaW5kZXhPZlNoaXBwaW5nRnJvbUNvdW50cmllcyA+PSAwKSB7XHJcbiAgICAgICAgc3VwcG9ydGVkU2hpcHBpbmdDb3VudHJpZXNbaW5kZXhPZlNoaXBwaW5nRnJvbUNvdW50cmllc10gPSBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllc1swXVxyXG4gICAgICAgIHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzWzBdID0gc2hpcHBpbmdGcm9tQ291bnRyeVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBzaGlwcGluZ0NvdW50cnk6IHN0cmluZyB8IG51bGxcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3VwcG9ydGVkU2hpcHBpbmdDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY3VycmVudFNoaXBwaW5nQ291bnRyeSA9IHN1cHBvcnRlZFNoaXBwaW5nQ291bnRyaWVzW2ldXHJcbiAgICAgICAgaWYgKGhhc1NoaXBwaW5nVG9Db3VudHJ5KGN1cnJlbnRTaGlwcGluZ0NvdW50cnksIHNoaXBzVG8sIGV4Y2x1ZGVzKSkge1xyXG4gICAgICAgICAgICBzaGlwcGluZ0NvdW50cnkgPSBjdXJyZW50U2hpcHBpbmdDb3VudHJ5XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2hpcHBpbmdDb3VudHJ5ID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hpcHBpbmdDb3VudHJ5IGlzIG51bGxcIilcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY291bnRyeUNvZGUgPSBzdXBwb3J0ZWRTaGlwcGluZ0NvdW50cmllc0RpY3Rpb25hcnlbc2hpcHBpbmdDb3VudHJ5XVxyXG4gICAgbGV0IHppcENvZGUgPSB6aXBDb2Rlc1tzaGlwcGluZ0NvdW50cnldID8/IFwiXCJcclxuXHJcbiAgICBsZXQgc2hpcHBpbmdSYXRlc1VybCA9IFwiaHR0cHM6Ly93d3cuZWJheS5jb20vaXRlbW1vZHVsZXMvXCIgKyBsb3RJbmZvLmxvdElkICtcclxuICAgICAgICBcIj9tb2R1bGVfZ3JvdXBzPUdFVF9SQVRFU19NT0RVTEVfR1JPVVAmY289MCZpc0dldFJhdGVzPTEmcnQ9bmMmcXVhbnRpdHk9MSZzaGlwVG9Db3VudHJ5Q29kZT1cIiArIGNvdW50cnlDb2RlXHJcbiAgICAgICAgKyBcIiZzaGlwcGluZ1ppcENvZGU9XCIgKyB6aXBDb2RlXHJcblxyXG4gICAgbGV0IHNoaXBwaW5nSW5mb1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShzaGlwcGluZ1JhdGVzVXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwifSlcclxuICAgIGxldCB0ZXh0ID0gYXdhaXQgc2hpcHBpbmdJbmZvUmVzcG9uc2UudGV4dCgpXHJcblxyXG4gICAgbGV0IHNoaXBwaW5nSnNvbiA9IEpTT04ucGFyc2UodGV4dClcclxuICAgIC8vY29uc29sZS5sb2codGV4dClcclxuICAgIGxldCBqc29uUGF0aFRhYmxlUHJlZml4ID0gXCIkLnN0YXRlc1s/KEAuZXZlbnROYW1lPT0ndXgtYXBwX19kLXNoaXBwaW5nLW1heC12aWV3X19yZWZyZXNoU3RhdGUnKV0uc3RhdGUubW9kZWwuU0hJUFBJTkdfU0VDVElPTl9NT0RVTEUuc2VjdGlvbnMuc2hpcHBpbmdUYWJsZS50YWJsZVwiXHJcblxyXG4gICAgbGV0IGpzb25QYXRoSGVhZGVyUHJlZml4ID0ganNvblBhdGhUYWJsZVByZWZpeCArIFwiLmhlYWRlci5jZWxsc1wiXHJcbiAgICBsZXQganNvblBhdGhDZWxsc1ByZWZpeCA9IGpzb25QYXRoVGFibGVQcmVmaXggKyBcIi5yb3dzWzBdLmNlbGxzXCJcclxuXHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSB7fVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGpzb25QYXRoSGVhZGVyID0ganNvblBhdGhIZWFkZXJQcmVmaXggKyBcIltcIiArIGkgKyBcIl0udGV4dFNwYW5zWzBdLnRleHRcIlxyXG4gICAgICAgIGxldCBoZWFkZXJOYW1lID0ganNvbnBhdGgucXVlcnkoc2hpcHBpbmdKc29uLCBqc29uUGF0aEhlYWRlcilbMF0udG9TdHJpbmcoKVxyXG4gICAgICAgIGhlYWRlcnNbaGVhZGVyTmFtZV0gPSBpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNoaXBwaW5nSnNvblBhdGggPSBqc29uUGF0aENlbGxzUHJlZml4ICsgXCJbMF0udGV4dFNwYW5zWzBdLnRleHRcIlxyXG5cclxuICAgIGxldCBzaGlwcGluZ1N0cmluZyA9IGpzb25wYXRoLnF1ZXJ5KHNoaXBwaW5nSnNvbiwgc2hpcHBpbmdKc29uUGF0aClbMF0udG9TdHJpbmcoKVxyXG4gICAgaWYgKHNoaXBwaW5nU3RyaW5nID09PSBcIkZyZWUgc2hpcHBpbmdcIikge1xyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgc2hpcHBpbmcgPSBleHRyYWN0UHJpY2Uoc2hpcHBpbmdTdHJpbmcpXHJcbiAgICAgICAgaWYgKHNoaXBwaW5nLmN1cnJlbmN5ICE9PSBsb3RJbmZvLmN1cnJlbmN5KSB0aHJvdyBuZXcgRXJyb3IoXCJzaGlwcGluZyBhbmQgbG90IGN1cnJlbmN5IG1pc21hdGNoLCBsb3RDdXJyZW5jeSBcIiArIGxvdEluZm8uY3VycmVuY3kgKyBcIiwgc2hpcHBpbmdDdXJyZW5jeSBcIiArIHNoaXBwaW5nLmN1cnJlbmN5KVxyXG4gICAgICAgIGxvdEluZm8uc2hpcHBpbmcgPSBzaGlwcGluZy5wcmljZVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KFwiRWFjaCBhZGRpdGlvbmFsIGl0ZW1cIikpIHtcclxuICAgICAgICBsZXQgc2hpcHBpbmdBZGRpdGlvbmFsSnNvblBhdGggPSBqc29uUGF0aENlbGxzUHJlZml4ICsgXCJbMV0udGV4dFNwYW5zWzBdLnRleHRcIlxyXG5cclxuICAgICAgICBsZXQgc2hpcHBpbmdBZGRpdGlvbmFsU3RyaW5nID0ganNvbnBhdGgucXVlcnkoc2hpcHBpbmdKc29uLCBzaGlwcGluZ0FkZGl0aW9uYWxKc29uUGF0aClbMF0udG9TdHJpbmcoKVxyXG4gICAgICAgIGlmIChzaGlwcGluZ0FkZGl0aW9uYWxTdHJpbmcgPT09IFwiRnJlZVwiKSB7XHJcbiAgICAgICAgICAgIGxvdEluZm8uc2hpcHBpbmdBZGRpdGlvbmFsID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgc2hpcHBpbmdBZGRpdGlvbmFsID0gZXh0cmFjdFByaWNlKHNoaXBwaW5nQWRkaXRpb25hbFN0cmluZylcclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nQWRkaXRpb25hbC5jdXJyZW5jeSAhPT0gbG90SW5mby5jdXJyZW5jeSlcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNoaXBwaW5nIGFkZGl0aW9uYWwgYW5kIGxvdCBjdXJyZW5jeSBtaXNtYXRjaCwgbG90Q3VycmVuY3kgXCIgKyBsb3RJbmZvLmN1cnJlbmN5ICsgXCIsIHNoaXBwaW5nQWRkaXRpb25hbEN1cnJlbmN5IFwiICsgc2hpcHBpbmdBZGRpdGlvbmFsLmN1cnJlbmN5KVxyXG4gICAgICAgICAgICBsb3RJbmZvLnNoaXBwaW5nQWRkaXRpb25hbCA9IHNoaXBwaW5nQWRkaXRpb25hbC5wcmljZVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG90SW5mby5zaGlwcGluZ0FkZGl0aW9uYWwgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzaGlwcGluZ1RvSnNvblBhdGggPSBqc29uUGF0aENlbGxzUHJlZml4ICsgXCJbXCIgKyBoZWFkZXJzW1wiVG9cIl0gKyBcIl0udGV4dFNwYW5zWzBdLnRleHRcIlxyXG5cclxuICAgIGxldCBzaGlwcGluZ1RvID0ganNvbnBhdGgucXVlcnkoc2hpcHBpbmdKc29uLCBzaGlwcGluZ1RvSnNvblBhdGgpWzBdLnRvU3RyaW5nKClcclxuICAgIGlmIChzaGlwcGluZ1RvICE9PSBzaGlwcGluZ0NvdW50cnkpIHRocm93IG5ldyBFcnJvcihcIlNoaXBwaW5nIGNvdW50cnkgZXhwZWN0ZWQgdG8gYmUgXCIgKyBzaGlwcGluZ0NvdW50cnkgKyBcIiBidXQgd2FzIFwiICsgc2hpcHBpbmdUbylcclxuXHJcbiAgICBsb3RJbmZvLnNoaXBwaW5nQ291bnRyeSA9IHNoaXBwaW5nQ291bnRyeVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBVbnRpbChmdW5jOiAoKSA9PiBib29sZWFuLCBzbGVlcE1zOiBudW1iZXIgPSAxMDAsIG1heEF0dGVtcHQ6IG51bWJlciA9IDEwMCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGF0dGVtcHQgPSAwO1xyXG4gICAgd2hpbGUgKGZ1bmMoKSkge1xyXG4gICAgICAgIGF0dGVtcHQrKztcclxuXHJcbiAgICAgICAgaWYgKGF0dGVtcHQgPiBtYXhBdHRlbXB0KSB0aHJvdyBuZXcgRXJyb3IoXCJBdHRlbXB0IGNvdW50cyBleGNlZWRlZCBcIiArIG1heEF0dGVtcHQgKyBcIiBcIiArIGZ1bmMudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgICAgYXdhaXQgc2xlZXAoc2xlZXBNcylcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q291bnRyeVNwYW5JdGVtKGNvdW50cnlOYW1lOiBzdHJpbmcsIGl0ZW1zTWVudTogSFRNTERpdkVsZW1lbnQpOiBIVE1MU3BhbkVsZW1lbnQge1xyXG5cclxuICAgIGlmIChjb3VudHJ5TmFtZSA9PT0gbnVsbCB8fCBjb3VudHJ5TmFtZSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoXCJjb3VudHJ5IG5hbWUgc2hvdWxkbid0IGJlIG51bGwgb3IgdW5kZWZpbmVkXCIpXHJcblxyXG4gICAgbGV0IHNwYW5zID0gaXRlbXNNZW51LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NwYW4uY24nKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgaWYgKCg8SFRNTEVsZW1lbnQ+c3BhbnNbaV0pLmlubmVyVGV4dCA9PT0gY291bnRyeU5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxIVE1MU3BhbkVsZW1lbnQ+c3BhbnNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmaW5kIGNvdW50cnkgaW4gbGlzdCBcIiArIGNvdW50cnlOYW1lKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTG9jYXRlZEluKCkge1xyXG4gICAgbGV0IG1hdGNoID0gKDxIVE1MRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi5kLXNoaXBwaW5nLW1pbnZpZXcnLCBkb2N1bWVudCkpLmlubmVyVGV4dC5tYXRjaCgvTG9jYXRlZFxcc2luOlxccyguKykvKVxyXG4gICAgaWYgKG1hdGNoICE9PSBudWxsKSB7XHJcbiAgICAgICAgbG90SW5mby5sb2NhdGVkSW4gPSBtYXRjaFsxXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb3RJbmZvLmxvY2F0ZWRJbiA9IFwiVW5rbm93blwiXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxEZXNjcmlwdGlvbigpIHtcclxuICAgIGxldCBmb3VuZEVsZW1lbnQgPSBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWRBbnkoWycjZGVzY19pZnInLCAnI3ZpX3NuaXBwZXRkZXNjX2J0biddKVxyXG5cclxuICAgIGxldCBkZXNjcmlwdGlvblVybDogc3RyaW5nXHJcbiAgICBpZiAoZm91bmRFbGVtZW50IGluc3RhbmNlb2YgSFRNTElGcmFtZUVsZW1lbnQpIHtcclxuICAgICAgICBkZXNjcmlwdGlvblVybCA9ICg8SFRNTElGcmFtZUVsZW1lbnQ+Zm91bmRFbGVtZW50KS5zcmNcclxuICAgIH0gZWxzZSBpZiAoZm91bmRFbGVtZW50IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcclxuICAgICAgICBkZXNjcmlwdGlvblVybCA9ICg8SFRNTEFuY2hvckVsZW1lbnQ+Zm91bmRFbGVtZW50KS5ocmVmXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coZGVzY3JpcHRpb25VcmwpXHJcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaFJlc291cmNlKGRlc2NyaXB0aW9uVXJsLCB7bWV0aG9kOiAnR0VUJywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pXHJcbiAgICBsb3RJbmZvLmRlc2NyaXB0aW9uID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxQdXJjaGFzZUhpc3RvcnkoKSB7XHJcbiAgICBpZiAoIV91bnN1cHBvcnRlZExvdCkge1xyXG4gICAgICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgICAgICBsZXQgcHVyY2hhc2VIaXN0b3J5VXJsID0gYGh0dHBzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX0vYmluL3B1cmNoYXNlSGlzdG9yeT9pdGVtPSR7aXRlbUlkfWA7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNvdXJjZShwdXJjaGFzZUhpc3RvcnlVcmwsIHttZXRob2Q6ICdHRVQnLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnfSlcclxuICAgICAgICBsZXQgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgICAgIGxvdEluZm8ucHVyY2hhc2VIaXN0b3J5ID0gcGFyc2VTb2xkSXRlbXNQYWdlKHRleHQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGxVcGRhdGVUaXRsZURhdGUoKSB7XHJcbiAgICBpZiAoIV91bnN1cHBvcnRlZExvdCkge1xyXG4gICAgICAgIGxldCBpdGVtSWQgPSBsb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFwvaXRtXFwvKFswLTldKykvKVsxXTtcclxuICAgICAgICBsZXQgdXJsID0gYGh0dHBzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX0vcnZoLyR7aXRlbUlkfWA7XHJcbiAgICAgICAgY29uc29sZS5sb2codXJsKTtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaFJlc291cmNlKHVybCwge21ldGhvZDogJ0dFVCcsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSd9KVxyXG4gICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgbG90SW5mby50aXRsZUNoYW5nZURhdGUgPSBwYXJzZVJldmlzaW9uU3VtbWFyeSh0ZXh0KS50b0lTT1N0cmluZygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlUmV2aXNpb25TdW1tYXJ5KHRleHQ6IHN0cmluZyk6IERhdGUge1xyXG4gICAgY29uc29sZS5sb2coXCJwYXJzZVJldmlzaW9uU3VtbWFyeVwiKVxyXG4gICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICBsZXQgZGl2ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2RpdiN2aS1yZXZpc2lvbi1oaXN0b3J5LWxheW91dC1jb250YWluZXInKVxyXG4gICAgbGV0IHJvd3MgPSBbLi4uZGl2LnF1ZXJ5U2VsZWN0b3IoJ3RhYmxlJykucXVlcnlTZWxlY3RvckFsbCgndHInKV1cclxuXHJcbiAgICBmb3IgKGxldCByb3cgb2Ygcm93cy5yZXZlcnNlKCkpIHtcclxuICAgICAgICBsZXQgY29sdW1ucyA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbCgndGQnKV1cclxuICAgICAgICBpZiAoY29sdW1ucy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xyXG4gICAgICAgIGxldCBjaGFuZ2VzID0gY29sdW1uc1syXS5pbm5lclRleHQ7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMuaW5jbHVkZXMoJ1RpdGxlJykpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGUgPSBjb2x1bW5zWzBdLmlubmVyVGV4dFxyXG4gICAgICAgICAgICBsZXQgdGltZSA9IGNvbHVtbnNbMV0uaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VEYXRlKGRhdGUgKyBcIiBcIiArIHRpbWUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgRGF0ZSgwKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWFyY2hRdWVyeSgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xyXG4gICAgaWYgKGRvY3VtZW50LnJlZmVycmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwoZG9jdW1lbnQucmVmZXJyZXIpLnNlYXJjaFBhcmFtcz8uZ2V0KCdfbmt3Jyk/LnRyaW0oKT8udG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXM/LmdldChzZWFyY2hRdWVyeVBhcmFtKT8udHJpbSgpPy50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUHJvZHVjdChwYW5lbDogSFRNTERpdkVsZW1lbnQsIGNsaWVudDogQ2xpZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IHByb2R1Y3RGaWVsZCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCMnICsgcHJvZHVjdEZpZWxkTmFtZSk7XHJcblxyXG4gICAgbGV0IHByb2R1Y3RJZCA9IHNlcnZlckxvdEluZm8/LnByb2R1Y3RJZD8udHJpbSgpPy50b0xvd2VyQ2FzZSgpXHJcbiAgICBsZXQgc2VhcmNoUXVlcnkgPSBnZXRTZWFyY2hRdWVyeSgpO1xyXG5cclxuICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IGNsaWVudC5nZXRBbGxQcm9kdWN0cygpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHByb2R1Y3RzW2ldLmlkO1xyXG4gICAgICAgIG9wdC5pbm5lckhUTUwgPSBwcm9kdWN0c1tpXS5uYW1lO1xyXG5cclxuICAgICAgICBpZiAocHJvZHVjdElkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3RJZCA9PT0gcHJvZHVjdHNbaV0uaWQudHJpbSgpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwcm9kdWN0c1tpXS5zZWFyY2hRdWVyaWVzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hRdWVyeSA9PT0geC5xdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5zZWxlY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2R1Y3RGaWVsZC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsTWFudWFsQ29uZGl0aW9uKHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgY2xpZW50OiBDbGllbnQsIHNlcnZlckxvdEluZm86IExvdEluZm9XaXRoUHJvZHVjdElkIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9uRmllbGQgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QjJyArIG1hbnVhbENvbmRpdGlvbklkRmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgbWFudWFsQ29uZGl0aW9uSWQgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5tYW51YWxDb25kaXRpb25JZD8udHJpbSgpPy50b0xvd2VyQ2FzZSgpXHJcblxyXG4gICAgbGV0IG1hbnVhbENvbmRpdGlvbnMgPSBhd2FpdCBjbGllbnQuZ2V0TWFudWFsQ29uZGl0aW9uc0xpc3QoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYW51YWxDb25kaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IG1hbnVhbENvbmRpdGlvbnNbaV0uaWQ7XHJcbiAgICAgICAgb3B0LmlubmVySFRNTCA9IG1hbnVhbENvbmRpdGlvbnNbaV0uZGVzY3JpcHRpb247XHJcblxyXG4gICAgICAgIGlmIChtYW51YWxDb25kaXRpb25JZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChtYW51YWxDb25kaXRpb25JZCA9PT0gbWFudWFsQ29uZGl0aW9uc1tpXS5pZC50cmltKCkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYW51YWxDb25kaXRpb25GaWVsZC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudDogQ2xpZW50KTogUHJvbWlzZTxMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBfc2VydmVyTG90SW5mbyA9IGF3YWl0IGNsaWVudC5nZXRMb3RJbmZvKGxvdEluZm8ubG90SWQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBOb3RGb3VuZFByb2JsZW1EZXRhaWxlZEluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxsUGNzKHBhbmVsOiBIVE1MRGl2RWxlbWVudCwgc2VydmVyTG90SW5mbzogTG90SW5mb1dpdGhQcm9kdWN0SWQgfCB1bmRlZmluZWQpIHtcclxuICAgIGxldCBwY3NGaWVsZCA9IDxIVE1MSW5wdXRFbGVtZW50PnBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBwY3NGaWVsZE5hbWUpO1xyXG5cclxuICAgIGxldCBzZXJ2ZXJQY3MgPSBzZXJ2ZXJMb3RJbmZvPy5sb3RJbmZvPy5wY3NcclxuICAgIGlmIChzZXJ2ZXJQY3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHBjc0ZpZWxkLnZhbHVlID0gc2VydmVyUGNzLnRvU3RyaW5nKClcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsbElnbm9yZVRoYXRMb3QocGFuZWw6IEhUTUxEaXZFbGVtZW50LCBzZXJ2ZXJMb3RJbmZvOiBMb3RJbmZvV2l0aFByb2R1Y3RJZCB8IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IGlnbm9yZVRoYXRMb3RGaWVsZCA9IDxIVE1MSW5wdXRFbGVtZW50PnBhbmVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0IycgKyBpZ25vcmVUaGF0TG90RmllbGROYW1lKTtcclxuXHJcbiAgICBsZXQgc2VydmVyUGNzID0gc2VydmVyTG90SW5mbz8ubG90SW5mbz8uaWdub3JlVGhhdExvdFxyXG4gICAgaWYgKHNlcnZlclBjcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWdub3JlVGhhdExvdEZpZWxkLmNoZWNrZWQgPSBzZXJ2ZXJQY3NcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvbXBhcmVMb3RJbmZvcyhzZXJ2ZXJMb3RJbmZvV2l0aFByb2R1Y3RJZDogTG90SW5mb1dpdGhQcm9kdWN0SWQpIHtcclxuICAgIGlmIChzZXJ2ZXJMb3RJbmZvV2l0aFByb2R1Y3RJZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHNlcnZlckxvdEluZm9Kc29uID0gc2VydmVyTG90SW5mb1dpdGhQcm9kdWN0SWQubG90SW5mby50b0pTT04oKVxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJwY3NcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wiaWdub3JlVGhhdExvdFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJkZXNjcmlwdGlvblwiXSA9IHVuZGVmaW5lZFxyXG4gICAgc2VydmVyTG90SW5mb0pzb25bXCJzZWxsZXJcIl0gPSB1bmRlZmluZWRcclxuICAgIHNlcnZlckxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gdW5kZWZpbmVkXHJcblxyXG4gICAgbGV0IGxvdEluZm9Kc29uID0gbG90SW5mby50b0pTT04oKVxyXG4gICAgbG90SW5mb0pzb25bXCJwY3NcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wiaWdub3JlVGhhdExvdFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJtYW51YWxDb25kaXRpb25JZFwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJkZXNjcmlwdGlvblwiXSA9IHVuZGVmaW5lZFxyXG4gICAgbG90SW5mb0pzb25bXCJzZWxsZXJcIl0gPSB1bmRlZmluZWRcclxuICAgIGxvdEluZm9Kc29uW1wicHVyY2hhc2VIaXN0b3J5XCJdID0gdW5kZWZpbmVkXHJcblxyXG4gICAgbGV0IHNlcnZlckxvdEluZm9Kc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoc2VydmVyTG90SW5mb0pzb24pXHJcbiAgICBsZXQgY3VycmVudFBhZ2VMb3RJbmZvSnNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGxvdEluZm9Kc29uKVxyXG5cclxuICAgIGxldCBwYW5lbCA9IDxIVE1MRGl2RWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Rpdi4nICsgcGFuZWxDbGFzcywgZG9jdW1lbnQpO1xyXG4gICAgaWYgKHNlcnZlckxvdEluZm9Kc29uU3RyaW5nID09PSBjdXJyZW50UGFnZUxvdEluZm9Kc29uU3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGxldCBzZXJ2ZXJNYXhEYXRlID0gZ2V0TWF4KHNlcnZlckxvdEluZm9XaXRoUHJvZHVjdElkLmxvdEluZm8ucHVyY2hhc2VIaXN0b3J5Lm1hcCh4ID0+IG5ldyBEYXRlKHguZGF0ZSkuZ2V0VGltZSgpKSlcclxuICAgICAgICBsZXQgZWJheU1heERhdGUgPSBnZXRNYXgobG90SW5mby5wdXJjaGFzZUhpc3RvcnkubWFwKHggPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoeC5kYXRlKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgaWYgKF9zZXJ2ZXJMb3RJbmZvLmxvdEluZm8uaWdub3JlVGhhdExvdCA9PT0gdHJ1ZSB8fCBlYmF5TWF4RGF0ZSA9PT0gMCB8fCBzZXJ2ZXJNYXhEYXRlID09PSBlYmF5TWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBwYW5lbC5zdHlsZS5jc3NUZXh0ID0gYGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHRHcmVlbkNvbG9yfTtgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGFuZWwuc3R5bGUuY3NzVGV4dCA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0WWVsbG93Q29sb3J9O2BcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodFBpbmtDb2xvcn07YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6IFwiICsgc2VydmVyTG90SW5mb0pzb25TdHJpbmcpXHJcbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnRQYWdlOiBcIiArIGN1cnJlbnRQYWdlTG90SW5mb0pzb25TdHJpbmcpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXgoYXJyYXk6IG51bWJlcltdKSB7XHJcbiAgICBsZXQgbGFyZ2VzdCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFycmF5W2ldID4gbGFyZ2VzdCkge1xyXG4gICAgICAgICAgICBsYXJnZXN0ID0gYXJyYXlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxhcmdlc3Q7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNoZWNrSWZUeXBlZExvdCgpIHtcclxuICAgIGxldCBtYWluQ29udGVudERpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2I21haW5Db250ZW50JywgZG9jdW1lbnQpXHJcblxyXG4gICAgaWYgKG1haW5Db250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi54LW1za3VfX2JveC1jb250JykpIHtcclxuXHJcbiAgICAgICAgYXdhaXQgc2hvd0xvdElzTm90U3VwcG9ydGVkKClcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YUZyb21QYWdlKGNsaWVudDogQ2xpZW50KSB7XHJcblxyXG4gICAgZmlsbElkKCk7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFByaWNlKCksXHJcbiAgICAgICAgZmlsbE5hbWUoKSxcclxuICAgICAgICBmaWxsU2VsbGVyKCksXHJcbiAgICAgICAgZmlsbENvbmRpdGlvbigpLFxyXG4gICAgICAgIGZpbGxDb25kaXRpb25EZXNjcmlwdGlvbigpLFxyXG4gICAgICAgIGZpbGxMb2NhdGVkSW4oKSxcclxuICAgICAgICBmaWxsRGVzY3JpcHRpb24oKSxcclxuICAgICAgICBjaGVja0lmVHlwZWRMb3QoKSxcclxuICAgICAgICBnZXRTZXJ2ZXJMb3RJbmZvKGNsaWVudClcclxuICAgIF0pXHJcblxyXG4gICAgbGV0IHBhbmVsID0gYXdhaXQgY3JlYXRlUGFuZWwoY2xpZW50KTtcclxuXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZmlsbFB1cmNoYXNlSGlzdG9yeSgpLFxyXG4gICAgICAgIGZpbGxVcGRhdGVUaXRsZURhdGUoKSxcclxuICAgICAgICBmaWxsUHJvZHVjdChwYW5lbCwgY2xpZW50LCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbE1hbnVhbENvbmRpdGlvbihwYW5lbCwgY2xpZW50LCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbFBjcyhwYW5lbCwgX3NlcnZlckxvdEluZm8pLFxyXG4gICAgICAgIGZpbGxJZ25vcmVUaGF0TG90KHBhbmVsLCBfc2VydmVyTG90SW5mbyksXHJcbiAgICAgICAgZmlsbFNoaXBwaW5nKCksXHJcbiAgICBdKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcInNob3cgcGFuZWxcIilcclxuICAgIHBhbmVsLmhpZGRlbiA9IGZhbHNlO1xyXG5cclxuICAgIGF3YWl0IGNvbXBhcmVMb3RJbmZvcyhfc2VydmVyTG90SW5mbyk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNhdmVFcnJvclRvQmFja2VuZChlcnJvcjogRXJyb3IsIGNsaWVudDogQ2xpZW50KSB7XHJcbiAgICBsZXQgZXJyb3JUZXh0ID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpICsgXCIgXCIgKyBlcnJvci5zdGFja1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBjbGllbnQuc2F2ZUVycm9yKG5ldyBDbGllbnRFcnJvckluZm8oe1xyXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JUZXh0LFxyXG4gICAgICAgICAgICB1cmw6IGRvY3VtZW50LmxvY2F0aW9uLmhyZWZcclxuICAgICAgICB9KSlcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHNhdmUgZXJyb3IgdG8gYmFja2VuZCBcIiArIGVycm9yVGV4dClcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2hvd0FuZFNhdmVFcnJvcihlcnJvcjogRXJyb3IsIGNsaWVudDogQ2xpZW50KSB7XHJcblxyXG4gICAgbGV0IGVycm9yVGV4dDogc3RyaW5nXHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBWYWxpZGF0aW9uUHJvYmxlbURldGFpbGVkSW5mbykge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uRXJyb3IgPSA8VmFsaWRhdGlvblByb2JsZW1EZXRhaWxlZEluZm8+ZXJyb3JcclxuICAgICAgICBlcnJvclRleHQgPSBKU09OLnN0cmluZ2lmeSh2YWxpZGF0aW9uRXJyb3IuZXJyb3JzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBlcnJvclRleHQgPSBlcnJvci5zdGFjaztcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIkVSUk9SIFwiICsgZXJyb3JUZXh0KVxyXG5cclxuICAgIGxldCBlcnJvckRpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzICsgJyAjJyArIGVycm9yRWxlbWVudElkLCBkb2N1bWVudClcclxuICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuICAgIHNwYW4uaW5uZXJIVE1MID0gZXJyb3JUZXh0XHJcbiAgICBlcnJvckRpdi5hcHBlbmRDaGlsZChzcGFuKVxyXG5cclxuICAgIGF3YWl0IHNhdmVFcnJvclRvQmFja2VuZChlcnJvciwgY2xpZW50KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZW5hYmxlU3VibWl0QnV0dG9uKCkge1xyXG4gICAgKDxIVE1MQnV0dG9uRWxlbWVudD5hd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJyMnICsgc3VibWl0SWQsIGRvY3VtZW50KSkuZGlzYWJsZWQgPSBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQ6IE9BdXRoMkNsaWVudCk6IEZldGNoV3JhcHBlckN1c3RvbSB7XHJcbiAgICByZXR1cm4gbmV3IEZldGNoV3JhcHBlckN1c3RvbSh7XHJcbiAgICAgICAgY2xpZW50OiBvQXV0aDJDbGllbnQsXHJcbiAgICAgICAgZ2V0TmV3VG9rZW46IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldEF1dGhvcml6ZVVyaSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFVyaTogYXV0aFJlZGlyZWN0VXJsLFxyXG4gICAgICAgICAgICAgICAgY29kZVZlcmlmaWVyLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsnRWJheS5TZXJ2ZXJBUEknXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTdG9yZWRUb2tlbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYmFja2VuZFVybCAhPT0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJiYWNrZW5kX3VybFwiXSkpLmJhY2tlbmRfdXJsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHRva2VuID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ0b2tlbl9zdG9yZVwiXSkpLnRva2VuX3N0b3JlO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pIHJldHVybiBKU09OLnBhcnNlKHRva2VuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaDogZmV0Y2hSZXNvdXJjZVxyXG4gICAgfSlcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGlkZUVycm9ycygpIHtcclxuICAgIGxldCBlcnJvckRpdiA9IGF3YWl0IHNsZWVwRWxlbWVudExvYWRlZCgnZGl2LicgKyBwYW5lbENsYXNzICsgJyAjJyArIGVycm9yRWxlbWVudElkLCBkb2N1bWVudClcclxuICAgIGVycm9yRGl2LmlubmVySFRNTCA9IFwiXCJcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcHJvZHVjdFBhZ2UoY2xpZW50OiBDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwicHJvZHVjdFBhZ2VcIilcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgZ2V0RGF0YUZyb21QYWdlKGNsaWVudCk7XHJcbiAgICAgICAgYXdhaXQgZW5hYmxlU3VibWl0QnV0dG9uKClcclxuICAgICAgICBhd2FpdCBoaWRlRXJyb3JzKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgYXdhaXQgc2hvd0FuZFNhdmVFcnJvcihlcnJvciwgY2xpZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYXV0aFBhZ2Uob0F1dGgyQ2xpZW50OiBPQXV0aDJDbGllbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiYXV0aFBhZ2VcIilcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJjb2RlXCIpKSB7XHJcbiAgICAgICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpLmNvZGVfdmVyaWZpZXI7XHJcbiAgICAgICAgbGV0IG9hdXRoMlRva2VuID0gYXdhaXQgb0F1dGgyQ2xpZW50LmF1dGhvcml6YXRpb25Db2RlLmdldFRva2VuRnJvbUNvZGVSZWRpcmVjdChcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IGF1dGhSZWRpcmVjdFVybCxcclxuICAgICAgICAgICAgICAgIGNvZGVWZXJpZmllclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2JhY2tlbmRfdXJsOiBiYWNrZW5kVXJsfSlcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe3Rva2VuX3N0b3JlOiBKU09OLnN0cmluZ2lmeShvYXV0aDJUb2tlbil9KVxyXG5cclxuICAgICAgICBsZXQgcmV0dXJuUGFnZSA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wicmV0dXJuX3BhZ2VcIl0pKT8ucmV0dXJuX3BhZ2U7XHJcblxyXG4gICAgICAgIGlmIChyZXR1cm5QYWdlICE9PSBudWxsICYmIHJldHVyblBhZ2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe3JldHVybl9wYWdlOiBudWxsfSlcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJldHVyblBhZ2VcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gYXV0aFJlZGlyZWN0VXJsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoUGFnZShjbGllbnQ6IENsaWVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJTZWFyY2hQYWdlXCIpXHJcbiAgICAvL9GC0L7Qu9GM0LrQviDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0L/RgNC+0LTQsNC90YvQtSDQu9C+0YLRi1xyXG4gICAgaWYgKG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zPy5nZXQoJ0xIX1NvbGQnKT8udHJpbSgpICE9PSBcIjFcIikgcmV0dXJuO1xyXG5cclxuICAgIGxldCBzZWFyY2hSZXN1bHRzID0gYXdhaXQgc2xlZXBFbGVtZW50TG9hZGVkKCd1bC5zcnAtcmVzdWx0cycsIGRvY3VtZW50KVxyXG5cclxuICAgIGxldCBsaW5rczogTG90TGlua1tdID0gW107XHJcbiAgICBmb3IgKGxldCBsaSBvZiBbLi4uc2VhcmNoUmVzdWx0cy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpXSkge1xyXG4gICAgICAgIGlmIChsaS5jbGFzc0xpc3QuY29udGFpbnMoXCJzcnAtcml2ZXItYW5zd2VyLS1SRVdSSVRFX1NUQVJUXCIpKSBicmVha1xyXG4gICAgICAgIGlmIChsaS5jbGFzc0xpc3QuY29udGFpbnMoXCJzLWl0ZW1cIikpIHtcclxuICAgICAgICAgICAgbGV0IGxpbmsgPSA8SFRNTEFuY2hvckVsZW1lbnQ+bGkucXVlcnlTZWxlY3RvcignYS5zLWl0ZW1fX2xpbmsnKVxyXG4gICAgICAgICAgICBsZXQgc29sZERhdGUgPSBuZXcgRGF0ZSgoPEhUTUxFbGVtZW50PmxpLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uUE9TSVRJVkUnKSkuaW5uZXJUZXh0LnJlcGxhY2UoXCJTb2xkIFwiLCBcIlwiKSlcclxuICAgICAgICAgICAgbGlua3MucHVzaChuZXcgTG90TGluayhwYXJzZUludChsaW5rLmhyZWYubWF0Y2goL2h0dHBzOlxcL1xcL1teXFwvXStcXC9pdG1cXC8oXFxkKykvKVsxXSksIGxpbmssIHNvbGREYXRlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBfID0gdXBkYXRlU3RhdHVzSW5maW5pdGUoY2xpZW50LCBsaW5rcyk7XHJcblxyXG4gICAgYXdhaXQgY3JlYXRlT3Blbk11bHRpcGxlQnV0dG9uKClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RhdHVzSW5maW5pdGUoY2xpZW50OiBDbGllbnQsIGxpbmtzOiBMb3RMaW5rW10pIHtcclxuICAgIGxldCBpZHMgPSBsaW5rcy5tYXAoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geC5pZFxyXG4gICAgfSlcclxuICAgIC8vIG5vaW5zcGVjdGlvbiBJbmZpbml0ZUxvb3BKU1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVXBkYXRpbmdMb3RTdGF0ZXNcIilcclxuICAgICAgICAgICAgbGV0IGdldExvdFN0YXRlc0Fuc3dlciA9IGF3YWl0IGNsaWVudC5nZXRMb3RTdGF0ZXMoaWRzKVxyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBrbm93bkxvdHMgPSBuZXcgTWFwKGdldExvdFN0YXRlc0Fuc3dlci5tYXAocCA9PiBbcC5sb3RJZCwgcF0pKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBub3RLbm93bkl0ZW1zID0gW11cclxuXHJcbiAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29sb3IgPSB4LmNvbG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrbm93bkxvdHMuaGFzKHguaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvdFN0YXRlID0ga25vd25Mb3RzLmdldCh4LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG90U3RhdGUuaWdub3JlVGhhdExvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGlmZkluRGF5cyA9IE1hdGguY2VpbCgoeC5zb2xkRGF0ZS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShsb3RTdGF0ZS5sYXN0VXBkYXRlKS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmZJbkRheXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvbG9yID0gbGlnaHRZZWxsb3dDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90S25vd25JdGVtcy5wdXNoKHguaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0R3JlZW5Db2xvclxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5jb2xvciA9IGxpZ2h0UGlua0NvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgbm90S25vd25JdGVtcy5wdXNoKHguaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh4LmNvbG9yICE9PSBudWxsICYmIGNvbG9yICE9PSB4LmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5saW5rLnN0eWxlLmNzc1RleHQgPSBgYmFja2dyb3VuZC1jb2xvcjogJHt4LmNvbG9yfTtgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBfa25vd25Mb3RzSWRzID0gbm90S25vd25JdGVtc1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNhdmVFcnJvclRvQmFja2VuZChlcnJvciwgY2xpZW50KVxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMb3RMaW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGxpbms6IEhUTUxBbmNob3JFbGVtZW50LCBzb2xkRGF0ZTogRGF0ZSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZFxyXG4gICAgICAgIHRoaXMubGluayA9IGxpbmtcclxuICAgICAgICB0aGlzLnNvbGREYXRlID0gc29sZERhdGVcclxuICAgICAgICB0aGlzLmNvbG9yID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudDtcclxuICAgIHNvbGREYXRlOiBEYXRlXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgbnVsbFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzbGVlcEVsZW1lbnRMb2FkZWQoc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudFRvU2VhcmNoSW46IERvY3VtZW50IHwgRWxlbWVudCk6IFByb21pc2U8RWxlbWVudD4ge1xyXG4gICAgbGV0IHJldHJ5ID0gMFxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICByZXRyeSsrO1xyXG4gICAgICAgIGlmIChyZXRyeSA+IDIwMCkgdGhyb3cgbmV3IEVycm9yKFwidW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvciBcIiArIHNlbGVjdG9yKVxyXG5cclxuICAgICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRUb1NlYXJjaEluLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IG51bGwpIHJldHVybiBlbGVtZW50XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2xlZXBFbGVtZW50TG9hZGVkQW55KHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPEVsZW1lbnQ+IHtcclxuXHJcbiAgICBsZXQgcmV0cnkgPSAwXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHJldHJ5Kys7XHJcbiAgICAgICAgaWYgKHJldHJ5ID4gMTAwMCkgdGhyb3cgbmV3IEVycm9yKFwidW5hYmxlIHRvIGZpbmQgYW55IGVsZW1lbnQgYnkgc2VsZWN0b3JzIFwiICsgc2VsZWN0b3JzLmpvaW4oXCIsIFwiKSlcclxuXHJcbiAgICAgICAgbGV0IGZvdW5kRWxlbWVudDogRWxlbWVudFxyXG4gICAgICAgIHNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih4KVxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZEVsZW1lbnQgPSBlbGVtZW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoZm91bmRFbGVtZW50ICE9PSBudWxsKSByZXR1cm4gZm91bmRFbGVtZW50XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzYXZlQ29kZVZlcmlmaWVyKCkge1xyXG4gICAgbGV0IGNvZGVWZXJpZmllciA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiY29kZV92ZXJpZmllclwiXSkpPy5jb2RlX3ZlcmlmaWVyO1xyXG5cclxuICAgIGlmIChjb2RlVmVyaWZpZXIgPT09IG51bGwgfHwgY29kZVZlcmlmaWVyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgY29kZVZlcmlmaWVyID0gYXdhaXQgZ2VuZXJhdGVDb2RlVmVyaWZpZXIoKTtcclxuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2NvZGVfdmVyaWZpZXI6IGNvZGVWZXJpZmllcn0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcbiAgICBhd2FpdCBzbGVlcEVsZW1lbnRMb2FkZWQoJ2Zvb3RlcicsIGRvY3VtZW50KVxyXG4gICAgYXdhaXQgc2F2ZUNvZGVWZXJpZmllcigpO1xyXG5cclxuICAgIGxldCBvQXV0aDJDbGllbnQgPSBuZXcgT0F1dGgyQ2xpZW50KHtcclxuICAgICAgICBzZXJ2ZXI6IGJhY2tlbmRVcmwsXHJcbiAgICAgICAgY2xpZW50SWQ6ICdFYmF5LkNocm9tZUV4dGVuc2lvbicsXHJcbiAgICAgICAgdG9rZW5FbmRwb2ludDogJy9jb25uZWN0L3Rva2VuJyxcclxuICAgICAgICBhdXRob3JpemF0aW9uRW5kcG9pbnQ6ICcvY29ubmVjdC9hdXRob3JpemUnLFxyXG4gICAgICAgIGZldGNoOiBmZXRjaFJlc291cmNlXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgY3VycmVudFBhZ2UgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgbG9jYXRpb24ucGF0aG5hbWVcclxuXHJcbiAgICBpZiAoY3VycmVudFBhZ2UgPT09IGF1dGhSZWRpcmVjdFVybCkge1xyXG4gICAgICAgIGF3YWl0IGF1dGhQYWdlKG9BdXRoMkNsaWVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7cmV0dXJuX3BhZ2U6IGRvY3VtZW50LmxvY2F0aW9uLmhyZWZ9KVxyXG5cclxuICAgICAgICBsZXQgY2xpZW50ID0gbmV3IENsaWVudChiYXNlQXBpVXJsLCBnZXRBdXRob3JpemVGZXRjaChvQXV0aDJDbGllbnQpKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL2l0bS9cIikpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHByb2R1Y3RQYWdlKGNsaWVudCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFBhZ2Uuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmViYXkuY29tL3NjaC9cIikpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHNlYXJjaFBhZ2UoY2xpZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNhdmVFcnJvclRvQmFja2VuZChlcnJvciwgY2xpZW50KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5ydW4oKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=