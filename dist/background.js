/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return parseAudioOnlyUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getChannelFromWebUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getChannelFromTokenUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getChannelFromUsherUrl; });
/* unused harmony export getNameBetweenStrings */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return buildUsherUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsherUrl; });
const twitchDomain = "twitch.tv/";
// Non-exhuastive list of non-channel routes in twitch.tv
const nonChannels = ["directory", "videos", "u", "settings"];
const apiDomain = "api.twitch.tv/api/channels/";
const accessToken = "/access_token";
const usherDomain = "usher.ttvnw.net/api/channel/hls/";
const usherExt = ".m3u8";
// Extract audio_only stream .m3u8 from the master playlist content.
// Returns the first occurance of a URL after audio_only metadata.
// TODO: This works, but eventually we will need to fully parse the content
// and get audio_only stream url
function parseAudioOnlyUrl(content) {
    if (!content) {
        return null;
    }
    const lines = content.split('\n');
    let audioOnlyFound = false;
    for (let line of lines) {
        if (line.includes("audio_only"))
            audioOnlyFound = true;
        if (audioOnlyFound && line.startsWith("https://"))
            return line;
    }
    return null;
}
function getChannelFromWebUrl(weburl) {
    // Channel name may not be available from the main page URL
    const url = weburl !== null && weburl !== void 0 ? weburl : location.href;
    const channel = getNameBetweenStrings(url, twitchDomain, "/", true);
    console.log("Channel name " + channel + ", from URL: " + url);
    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (channel in nonChannels)
        return null;
    return channel;
}
function getChannelFromTokenUrl(accessTokenUrl) {
    const channel = getNameBetweenStrings(accessTokenUrl, apiDomain, accessToken);
    console.log("channel name parsed access token: " + channel);
    return channel;
}
function getChannelFromUsherUrl(usherUrl) {
    const channel = getNameBetweenStrings(usherUrl, usherDomain, usherExt);
    console.log("channel name parsed usher: " + channel);
    return channel;
}
// Get channel between the first occurance of startStr and the first endStr after startStr.
function getNameBetweenStrings(url, startStr, endStr, endOptional = false) {
    let startIndex = url.indexOf(startStr);
    if (startIndex == -1) {
        return null;
    }
    startIndex += startStr.length;
    let endIndex = url.indexOf(endStr, startIndex + 1);
    if (endIndex == -1) {
        if (endOptional)
            endIndex = url.length;
        else
            return null;
    }
    return url.substring(startIndex, endIndex);
}
// TODO: Instead of pre-defined url format, use recently used ont in Twitch web
function buildUsherUrl(channel, token, sig) {
    const usherUrl = new UsherUrl(`https://usher.ttvnw.net/api/channel/hls/${channel}.m3u8`);
    usherUrl.update(token, sig);
    // It is not clear if all of these params are required or if there are any missing ones.
    usherUrl.setQueryString("player", "twitchweb");
    usherUrl.setQueryString("allow_source", "true");
    usherUrl.setQueryString("type", "any");
    return usherUrl;
}
// Class to store and manipulate usher URL.
class UsherUrl {
    constructor(url) {
        this.originalUrl = url;
        this.urlObject = new URL(url);
        this.channel = this.getChannel();
        this.expiresAt = this.getExpiresAt();
        this.setQueryString("allow_audio_only", "true");
    }
    getUnexpiredUrl() {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        // 60 seconds buffer before token expiration
        if (secondsSinceEpoch + 60 < this.expiresAt) {
            return this.getUrl();
        }
        console.debug(`Cached URL for ${this.channel} is expired`);
        return null;
    }
    getUrl() {
        return this.urlObject.toString();
    }
    getPath(url) {
        const endIndex = url.indexOf("?");
        if (endIndex == -1) {
            return url;
        }
        return url.substring(0, endIndex);
    }
    getQueryString(key) {
        const value = this.urlObject.searchParams.get(key);
        return value;
    }
    setQueryString(name, value) {
        this.urlObject.searchParams.set(name, value);
    }
    getExpiresAt() {
        const tokenString = this.getQueryString("token");
        if (!tokenString) {
            return null;
        }
        try {
            const tokenJson = JSON.parse(tokenString);
            const expiresAt = tokenJson.expires;
            return expiresAt;
        }
        catch (err) {
            console.log(`Cannot parse token in usher URL. Error: ${err}`);
        }
        return null;
    }
    getChannel() {
        const channel = getChannelFromUsherUrl(this.originalUrl);
        return channel;
    }
    update(newToken, newSig) {
        this.setQueryString("token", newToken);
        this.setQueryString("sig", newSig);
        this.setQueryString("p", this.getRandomNumber().toString());
        this.expiresAt = this.getExpiresAt();
    }
    getRandomNumber() {
        return Math.floor(Math.random() * 1000000);
    }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

// Map of channel(string) to url(string)
var accessTokenUrlMap = new Map();
// Map of channel(string) to url(UsherUrl)
var usherUrlMap = new Map();
// Last requested usher URL by tab. Needed to detect main page or hosted channel
var lastRequstedChannelByTab = new Map();
function getUrlGroup(channel) {
    const group = { channel: channel, accessTokenUrl: null, usherUrl: null };
    // Get Access Token URL
    const tokenUrl = accessTokenUrlMap.get(channel);
    if (tokenUrl) {
        group.accessTokenUrl = tokenUrl;
    }
    else {
        console.debug("Access token URL is not found for channel " + channel);
    }
    // Get Usher URL
    const cachedUsherUrlObj = usherUrlMap.get(channel);
    if (cachedUsherUrlObj) {
        group.usherUrl = cachedUsherUrlObj.getUnexpiredUrl();
    }
    else {
        console.debug(`No cached usherUrl object for channel ${channel}`);
    }
    return group;
}
function handleGetUrlsMessage(channel, tabId) {
    var _a;
    const callbackObj = { webUrl: null, lastRequested: null };
    callbackObj.webUrl = getUrlGroup(channel);
    const lastRequstedChannel = (_a = lastRequstedChannelByTab.get(tabId)) !== null && _a !== void 0 ? _a : null;
    callbackObj.lastRequested = getUrlGroup(lastRequstedChannel);
    return callbackObj;
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message !== "get_audio_url") {
        console.debug("message is not get_audio_url");
        sendResponse(null);
        return;
    }
    if (!request.channel) {
        console.debug("Twitch channel name is not included in the request");
        sendResponse(null);
        return;
    }
    const responseObj = handleGetUrlsMessage(request.channel, sender.tab.id);
    sendResponse(responseObj);
});
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    console.log("Token request: " + details.url);
    const channel = Object(_url__WEBPACK_IMPORTED_MODULE_0__[/* getChannelFromTokenUrl */ "c"])(details.url);
    if (channel) {
        accessTokenUrlMap.set(channel, details.url);
    }
}, { urls: ["*://api.twitch.tv/api/channels/*/access_token*"] });
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    console.log("tabId: " + details.tabId);
    console.log("Usher request: " + details.url);
    const channel = Object(_url__WEBPACK_IMPORTED_MODULE_0__[/* getChannelFromUsherUrl */ "d"])(details.url);
    const usherUrlObj = new _url__WEBPACK_IMPORTED_MODULE_0__[/* UsherUrl */ "a"](details.url);
    usherUrlMap.set(channel, usherUrlObj);
    lastRequstedChannelByTab.set(details.tabId, channel);
}, { urls: ["*://usher.ttvnw.net/*"] });


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7OztBQ2pGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BQU0sWUFBWSxHQUFZLFlBQVksQ0FBQztBQUMzQyx5REFBeUQ7QUFDekQsTUFBTSxXQUFXLEdBQWMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUV4RSxNQUFNLFNBQVMsR0FBWSw2QkFBNkIsQ0FBQztBQUN6RCxNQUFNLFdBQVcsR0FBWSxlQUFlLENBQUM7QUFFN0MsTUFBTSxXQUFXLEdBQVksa0NBQWtDLENBQUM7QUFDaEUsTUFBTSxRQUFRLEdBQVksT0FBTyxDQUFD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LENBQUMiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcbiIsIlxyXG5jb25zdCB0d2l0Y2hEb21haW4gOiBzdHJpbmcgPSBcInR3aXRjaC50di9cIjtcclxuLy8gTm9uLWV4aHVhc3RpdmUgbGlzdCBvZiBub24tY2hhbm5lbCByb3V0ZXMgaW4gdHdpdGNoLnR2XHJcbmNvbnN0IG5vbkNoYW5uZWxzIDogc3RyaW5nW10gPSBbXCJkaXJlY3RvcnlcIiwgXCJ2aWRlb3NcIiwgXCJ1XCIsIFwic2V0dGluZ3NcIl07XHJcblxyXG5jb25zdCBhcGlEb21haW4gOiBzdHJpbmcgPSBcImFwaS50d2l0Y2gudHYvYXBpL2NoYW5uZWxzL1wiO1xyXG5jb25zdCBhY2Nlc3NUb2tlbiA6IHN0cmluZyA9IFwiL2FjY2Vzc190b2tlblwiO1xyXG5cclxuY29uc3QgdXNoZXJEb21haW4gOiBzdHJpbmcgPSBcInVzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvXCI7XHJcbmNvbnN0IHVzaGVyRXh0IDogc3RyaW5nID0gXCIubTN1OFwiO1xyXG5cclxuXHJcbi8vIEV4dHJhY3QgYXVkaW9fb25seSBzdHJlYW0gLm0zdTggZnJvbSB0aGUgbWFzdGVyIHBsYXlsaXN0IGNvbnRlbnQuXHJcbi8vIFJldHVybnMgdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBhIFVSTCBhZnRlciBhdWRpb19vbmx5IG1ldGFkYXRhLlxyXG4vLyBUT0RPOiBUaGlzIHdvcmtzLCBidXQgZXZlbnR1YWxseSB3ZSB3aWxsIG5lZWQgdG8gZnVsbHkgcGFyc2UgdGhlIGNvbnRlbnRcclxuLy8gYW5kIGdldCBhdWRpb19vbmx5IHN0cmVhbSB1cmxcclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQ6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgaWYoIWNvbnRlbnQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICBsZXQgYXVkaW9Pbmx5Rm91bmQgPSBmYWxzZTtcclxuICAgIGZvcihsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwiYXVkaW9fb25seVwiKSkgYXVkaW9Pbmx5Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChhdWRpb09ubHlGb3VuZCAmJiBsaW5lLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVdlYlVybCh3ZWJ1cmw/OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIC8vIENoYW5uZWwgbmFtZSBtYXkgbm90IGJlIGF2YWlsYWJsZSBmcm9tIHRoZSBtYWluIHBhZ2UgVVJMXHJcbiAgICBjb25zdCB1cmwgPSB3ZWJ1cmwgPz8gbG9jYXRpb24uaHJlZjtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXJsLCB0d2l0Y2hEb21haW4sIFwiL1wiLCB0cnVlKTtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2hhbm5lbCBuYW1lIFwiICsgY2hhbm5lbCArIFwiLCBmcm9tIFVSTDogXCIgKyB1cmwpXHJcblxyXG4gICAgLy8gRmlsdGVyIG91dCBzb21lIG5vbi1jaGFubmVsIHBhZ2VzIHdpdGggc2ltaWxhciBVUkwgcGF0dGVybiBhcyBjaGFubmVsIHBhZ2VzXHJcbiAgICBpZiAoY2hhbm5lbCBpbiBub25DaGFubmVscykgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVRva2VuVXJsKGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3MoYWNjZXNzVG9rZW5VcmwsIGFwaURvbWFpbiwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIGFjY2VzcyB0b2tlbjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVXNoZXJVcmwodXNoZXJVcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1c2hlclVybCwgdXNoZXJEb21haW4sIHVzaGVyRXh0KTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCB1c2hlcjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuLy8gR2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIHN0YXJ0U3RyIGFuZCB0aGUgZmlyc3QgZW5kU3RyIGFmdGVyIHN0YXJ0U3RyLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKFxyXG4gICAgICAgIHVybDogc3RyaW5nLCBzdGFydFN0cjogc3RyaW5nLCBlbmRTdHI6IHN0cmluZywgZW5kT3B0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkgOiBzdHJpbmcge1xyXG4gICAgbGV0IHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzdGFydFN0cik7XHJcbiAgICBpZihzdGFydEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBzdGFydEluZGV4ICs9IHN0YXJ0U3RyLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihlbmRTdHIsIHN0YXJ0SW5kZXggKyAxKTtcclxuICAgIGlmKGVuZEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgaWYoZW5kT3B0aW9uYWwpIGVuZEluZGV4ID0gdXJsLmxlbmd0aDtcclxuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG59XHJcblxyXG5cclxuLy8gVE9ETzogSW5zdGVhZCBvZiBwcmUtZGVmaW5lZCB1cmwgZm9ybWF0LCB1c2UgcmVjZW50bHkgdXNlZCBvbnQgaW4gVHdpdGNoIHdlYlxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcsIHNpZzogc3RyaW5nKSA6IFVzaGVyVXJsIHtcclxuICAgIGNvbnN0IHVzaGVyVXJsID0gbmV3IFVzaGVyVXJsKGBodHRwczovL3VzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvJHtjaGFubmVsfS5tM3U4YCk7XHJcbiAgICB1c2hlclVybC51cGRhdGUodG9rZW4sIHNpZyk7XHJcblxyXG4gICAgLy8gSXQgaXMgbm90IGNsZWFyIGlmIGFsbCBvZiB0aGVzZSBwYXJhbXMgYXJlIHJlcXVpcmVkIG9yIGlmIHRoZXJlIGFyZSBhbnkgbWlzc2luZyBvbmVzLlxyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJwbGF5ZXJcIiwgXCJ0d2l0Y2h3ZWJcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcImFsbG93X3NvdXJjZVwiLCBcInRydWVcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInR5cGVcIiwgXCJhbnlcIik7XHJcbiAgICBcclxuICAgIHJldHVybiB1c2hlclVybDtcclxufVxyXG5cclxuXHJcbi8vIEludGVyZmFjZSB0byBjb21tdW5pY2F0ZSBiZXR3ZWVuIGJhY2tncm91bmQgYW5kIGNvbnRlbnRzY3JpcHRcclxuLy8gdG8gcmVxdWVzdC9yZXNwb25kIGFjY2VzcyB0b2tlbiBVUkwgYW5kIHVzaGVyIFVSTCBmb3IgYSBjaGFubmVsLlxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFVybHNSZXNwb25zZSB7XHJcbiAgICB3ZWJVcmw6IFVybEdyb3VwO1xyXG4gICAgbGFzdFJlcXVlc3RlZDogVXJsR3JvdXA7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFVybEdyb3VwIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmc7XHJcbiAgICB1c2hlclVybDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy8gQ2xhc3MgdG8gc3RvcmUgYW5kIG1hbmlwdWxhdGUgdXNoZXIgVVJMLlxyXG5leHBvcnQgY2xhc3MgVXNoZXJVcmwge1xyXG4gICAgb3JpZ2luYWxVcmw6IHN0cmluZztcclxuICAgIHVybE9iamVjdDogVVJMO1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgZXhwaXJlc0F0OiBudW1iZXI7ICAvLyBUb2tlbiBleHBpcmF0aW9uIGRhdGV0aW1lIGluIGVwb2NoIHNlY29uZHNcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxVcmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3QgPSBuZXcgVVJMKHVybCk7XHJcbiAgICAgICAgdGhpcy5jaGFubmVsID0gdGhpcy5nZXRDaGFubmVsKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcImFsbG93X2F1ZGlvX29ubHlcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVuZXhwaXJlZFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHNTaW5jZUVwb2NoID0gTWF0aC5yb3VuZChub3cuZ2V0VGltZSgpIC8gMTAwMCk7XHJcbiAgICAgICAgLy8gNjAgc2Vjb25kcyBidWZmZXIgYmVmb3JlIHRva2VuIGV4cGlyYXRpb25cclxuICAgICAgICBpZihzZWNvbmRzU2luY2VFcG9jaCArIDYwIDwgdGhpcy5leHBpcmVzQXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VXJsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYENhY2hlZCBVUkwgZm9yICR7dGhpcy5jaGFubmVsfSBpcyBleHBpcmVkYCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVybE9iamVjdC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgodXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiP1wiKTtcclxuICAgICAgICBpZihlbmRJbmRleCA9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsLnN1YnN0cmluZygwLCBlbmRJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UXVlcnlTdHJpbmcoa2V5OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5nZXQoa2V5KTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UXVlcnlTdHJpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLnNldChuYW1lLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhwaXJlc0F0KCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHRva2VuU3RyaW5nID0gdGhpcy5nZXRRdWVyeVN0cmluZyhcInRva2VuXCIpO1xyXG4gICAgICAgIGlmKCF0b2tlblN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuSnNvbiA9IEpTT04ucGFyc2UodG9rZW5TdHJpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBleHBpcmVzQXQgPSB0b2tlbkpzb24uZXhwaXJlcyBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzQXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IHBhcnNlIHRva2VuIGluIHVzaGVyIFVSTC4gRXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFubmVsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHRoaXMub3JpZ2luYWxVcmwpO1xyXG4gICAgICAgIHJldHVybiBjaGFubmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdUb2tlbjogc3RyaW5nLCBuZXdTaWc6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiLCBuZXdUb2tlbik7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInNpZ1wiLCBuZXdTaWcpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJwXCIsIHRoaXMuZ2V0UmFuZG9tTnVtYmVyKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbU51bWJlcigpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHtcclxuICAgIGdldENoYW5uZWxGcm9tVG9rZW5VcmwsXHJcbiAgICBnZXRDaGFubmVsRnJvbVVzaGVyVXJsLFxyXG4gICAgR2V0VXJsc1Jlc3BvbnNlLFxyXG4gICAgVXJsR3JvdXAsXHJcbiAgICBVc2hlclVybFxyXG59IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIE1hcCBvZiBjaGFubmVsKHN0cmluZykgdG8gdXJsKHN0cmluZylcclxudmFyIGFjY2Vzc1Rva2VuVXJsTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xyXG4vLyBNYXAgb2YgY2hhbm5lbChzdHJpbmcpIHRvIHVybChVc2hlclVybClcclxudmFyIHVzaGVyVXJsTWFwOiBNYXA8c3RyaW5nLCBVc2hlclVybD4gPSBuZXcgTWFwKCk7XHJcbi8vIExhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBieSB0YWIuIE5lZWRlZCB0byBkZXRlY3QgbWFpbiBwYWdlIG9yIGhvc3RlZCBjaGFubmVsXHJcbnZhciBsYXN0UmVxdXN0ZWRDaGFubmVsQnlUYWI6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VXJsR3JvdXAoY2hhbm5lbDogc3RyaW5nKSA6IFVybEdyb3VwIHtcclxuICAgIGNvbnN0IGdyb3VwIDogVXJsR3JvdXAgPSB7Y2hhbm5lbDogY2hhbm5lbCwgYWNjZXNzVG9rZW5Vcmw6IG51bGwsIHVzaGVyVXJsOiBudWxsfTtcclxuICAgIFxyXG4gICAgLy8gR2V0IEFjY2VzcyBUb2tlbiBVUkxcclxuICAgIGNvbnN0IHRva2VuVXJsID0gYWNjZXNzVG9rZW5VcmxNYXAuZ2V0KGNoYW5uZWwpO1xyXG4gICAgaWYodG9rZW5VcmwpIHtcclxuICAgICAgICBncm91cC5hY2Nlc3NUb2tlblVybCA9IHRva2VuVXJsO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkFjY2VzcyB0b2tlbiBVUkwgaXMgbm90IGZvdW5kIGZvciBjaGFubmVsIFwiICsgY2hhbm5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IFVzaGVyIFVSTFxyXG4gICAgY29uc3QgY2FjaGVkVXNoZXJVcmxPYmogPSB1c2hlclVybE1hcC5nZXQoY2hhbm5lbCk7XHJcbiAgICBpZihjYWNoZWRVc2hlclVybE9iaikge1xyXG4gICAgICAgIGdyb3VwLnVzaGVyVXJsID0gY2FjaGVkVXNoZXJVcmxPYmouZ2V0VW5leHBpcmVkVXJsKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBObyBjYWNoZWQgdXNoZXJVcmwgb2JqZWN0IGZvciBjaGFubmVsICR7Y2hhbm5lbH1gKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVHZXRVcmxzTWVzc2FnZShjaGFubmVsOiBzdHJpbmcsIHRhYklkOiBudW1iZXIpIDogR2V0VXJsc1Jlc3BvbnNlIHtcclxuICAgIGNvbnN0IGNhbGxiYWNrT2JqOiBHZXRVcmxzUmVzcG9uc2UgPSB7d2ViVXJsOiBudWxsLCBsYXN0UmVxdWVzdGVkOiBudWxsfTtcclxuICAgIGNhbGxiYWNrT2JqLndlYlVybCA9IGdldFVybEdyb3VwKGNoYW5uZWwpO1xyXG5cclxuICAgIGNvbnN0IGxhc3RSZXF1c3RlZENoYW5uZWwgPSBsYXN0UmVxdXN0ZWRDaGFubmVsQnlUYWIuZ2V0KHRhYklkKSA/PyBudWxsO1xyXG4gICAgY2FsbGJhY2tPYmoubGFzdFJlcXVlc3RlZCA9IGdldFVybEdyb3VwKGxhc3RSZXF1c3RlZENoYW5uZWwpO1xyXG5cclxuICAgIHJldHVybiBjYWxsYmFja09iajtcclxufVxyXG5cclxuXHJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xyXG4gICAgaWYgKHJlcXVlc3QubWVzc2FnZSAhPT0gXCJnZXRfYXVkaW9fdXJsXCIpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwibWVzc2FnZSBpcyBub3QgZ2V0X2F1ZGlvX3VybFwiKTtcclxuICAgICAgICBzZW5kUmVzcG9uc2UobnVsbCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCFyZXF1ZXN0LmNoYW5uZWwpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiVHdpdGNoIGNoYW5uZWwgbmFtZSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIHJlcXVlc3RcIik7XHJcbiAgICAgICAgc2VuZFJlc3BvbnNlKG51bGwpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZU9iaiA9IGhhbmRsZUdldFVybHNNZXNzYWdlKHJlcXVlc3QuY2hhbm5lbCwgc2VuZGVyLnRhYi5pZCk7XHJcbiAgICBzZW5kUmVzcG9uc2UocmVzcG9uc2VPYmopO1xyXG59KTtcclxuXHJcblxyXG5jaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVJlcXVlc3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24oZGV0YWlscykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVG9rZW4gcmVxdWVzdDogXCIgKyBkZXRhaWxzLnVybClcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Ub2tlblVybChkZXRhaWxzLnVybCk7XHJcbiAgICAgICAgaWYoY2hhbm5lbCkge1xyXG4gICAgICAgICAgICBhY2Nlc3NUb2tlblVybE1hcC5zZXQoY2hhbm5lbCwgZGV0YWlscy51cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7dXJsczogW1wiKjovL2FwaS50d2l0Y2gudHYvYXBpL2NoYW5uZWxzLyovYWNjZXNzX3Rva2VuKlwiXX1cclxuKTtcclxuXHJcblxyXG5jaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVJlcXVlc3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24oZGV0YWlscykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGFiSWQ6IFwiICsgZGV0YWlscy50YWJJZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJVc2hlciByZXF1ZXN0OiBcIiArIGRldGFpbHMudXJsKTtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybChkZXRhaWxzLnVybCk7XHJcbiAgICAgICAgY29uc3QgdXNoZXJVcmxPYmogPSBuZXcgVXNoZXJVcmwoZGV0YWlscy51cmwpO1xyXG4gICAgICAgIHVzaGVyVXJsTWFwLnNldChjaGFubmVsLCB1c2hlclVybE9iaik7XHJcbiAgICAgICAgbGFzdFJlcXVzdGVkQ2hhbm5lbEJ5VGFiLnNldChkZXRhaWxzLnRhYklkLCBjaGFubmVsKTtcclxuICAgIH0sXHJcbiAgICB7dXJsczogW1wiKjovL3VzaGVyLnR0dm53Lm5ldC8qXCJdfVxyXG4pOyJdLCJzb3VyY2VSb290IjoiIn0=