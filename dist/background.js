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
    const url = weburl || location.href;
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
function handleGetUrlsMessage(channel) {
    const callbackObj = { channel: channel, accessTokenUrl: null, usherUrl: null };
    // Get Access Token URL
    const tokenUrl = accessTokenUrlMap.get(channel);
    if (tokenUrl) {
        callbackObj.accessTokenUrl = tokenUrl;
    }
    else {
        console.debug("Access token URL is not found for channel " + channel);
    }
    // Get Usher URL
    const cachedUsherUrlObj = usherUrlMap.get(channel);
    if (cachedUsherUrlObj) {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        // 60 seconds buffer before token expiration
        if (secondsSinceEpoch + 60 < cachedUsherUrlObj.expiresAt) {
            callbackObj.usherUrl = cachedUsherUrlObj.getUrl();
        }
        console.debug(`Cached URL for ${channel} is expired`);
    }
    else {
        console.debug(`No cached usherUrl object for channel ${channel}`);
    }
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
    const responseObj = handleGetUrlsMessage(request.channel);
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
    console.log("Usher request: " + details.url);
    const channel = Object(_url__WEBPACK_IMPORTED_MODULE_0__[/* getChannelFromUsherUrl */ "d"])(details.url);
    const usherUrlObj = new _url__WEBPACK_IMPORTED_MODULE_0__[/* UsherUrl */ "a"](details.url);
    usherUrlMap.set(channel, usherUrlObj);
}, { urls: ["*://usher.ttvnw.net/*"] });


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7OztBQ2pGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BQU0sWUFBWSxHQUFZLFlBQVksQ0FBQztBQUMzQyx5REFBeUQ7QUFDekQsTUFBTSxXQUFXLEdBQWMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUV4RSxNQUFNLFNBQVMsR0FBWSw2QkFBNkIsQ0FBQztBQUN6RCxNQUFNLFdBQVcsR0FBWSxlQUFlLENBQUM7QUFFN0MsTUFBTSxXQUFXLEdBQVksa0NBQWtDLENBQUM7QUFDaEUsTUFBTSxRQUFRLEdBQVksT0FBTyxDQUFD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RyxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QyxNQUFNLE9BQU8sR0FBRywyRUFBc0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxxREFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMxQyxDQUFDLEVBQ0QsRUFBQyxJQUFJLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFDLENBQ3BDLENBQUMiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcbiIsIlxyXG5jb25zdCB0d2l0Y2hEb21haW4gOiBzdHJpbmcgPSBcInR3aXRjaC50di9cIjtcclxuLy8gTm9uLWV4aHVhc3RpdmUgbGlzdCBvZiBub24tY2hhbm5lbCByb3V0ZXMgaW4gdHdpdGNoLnR2XHJcbmNvbnN0IG5vbkNoYW5uZWxzIDogc3RyaW5nW10gPSBbXCJkaXJlY3RvcnlcIiwgXCJ2aWRlb3NcIiwgXCJ1XCIsIFwic2V0dGluZ3NcIl07XHJcblxyXG5jb25zdCBhcGlEb21haW4gOiBzdHJpbmcgPSBcImFwaS50d2l0Y2gudHYvYXBpL2NoYW5uZWxzL1wiO1xyXG5jb25zdCBhY2Nlc3NUb2tlbiA6IHN0cmluZyA9IFwiL2FjY2Vzc190b2tlblwiO1xyXG5cclxuY29uc3QgdXNoZXJEb21haW4gOiBzdHJpbmcgPSBcInVzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvXCI7XHJcbmNvbnN0IHVzaGVyRXh0IDogc3RyaW5nID0gXCIubTN1OFwiO1xyXG5cclxuXHJcbi8vIEV4dHJhY3QgYXVkaW9fb25seSBzdHJlYW0gLm0zdTggZnJvbSB0aGUgbWFzdGVyIHBsYXlsaXN0IGNvbnRlbnQuXHJcbi8vIFJldHVybnMgdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBhIFVSTCBhZnRlciBhdWRpb19vbmx5IG1ldGFkYXRhLlxyXG4vLyBUT0RPOiBUaGlzIHdvcmtzLCBidXQgZXZlbnR1YWxseSB3ZSB3aWxsIG5lZWQgdG8gZnVsbHkgcGFyc2UgdGhlIGNvbnRlbnRcclxuLy8gYW5kIGdldCBhdWRpb19vbmx5IHN0cmVhbSB1cmxcclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQ6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgaWYoIWNvbnRlbnQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICBsZXQgYXVkaW9Pbmx5Rm91bmQgPSBmYWxzZTtcclxuICAgIGZvcihsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwiYXVkaW9fb25seVwiKSkgYXVkaW9Pbmx5Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChhdWRpb09ubHlGb3VuZCAmJiBsaW5lLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVdlYlVybCh3ZWJ1cmw/OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIC8vIENoYW5uZWwgbmFtZSBtYXkgbm90IGJlIGF2YWlsYWJsZSBmcm9tIHRoZSBtYWluIHBhZ2UgVVJMXHJcbiAgICBjb25zdCB1cmwgPSB3ZWJ1cmwgfHwgbG9jYXRpb24uaHJlZjtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXJsLCB0d2l0Y2hEb21haW4sIFwiL1wiLCB0cnVlKTtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2hhbm5lbCBuYW1lIFwiICsgY2hhbm5lbCArIFwiLCBmcm9tIFVSTDogXCIgKyB1cmwpXHJcblxyXG4gICAgLy8gRmlsdGVyIG91dCBzb21lIG5vbi1jaGFubmVsIHBhZ2VzIHdpdGggc2ltaWxhciBVUkwgcGF0dGVybiBhcyBjaGFubmVsIHBhZ2VzXHJcbiAgICBpZiAoY2hhbm5lbCBpbiBub25DaGFubmVscykgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVRva2VuVXJsKGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3MoYWNjZXNzVG9rZW5VcmwsIGFwaURvbWFpbiwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIGFjY2VzcyB0b2tlbjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVXNoZXJVcmwodXNoZXJVcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1c2hlclVybCwgdXNoZXJEb21haW4sIHVzaGVyRXh0KTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCB1c2hlcjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuLy8gR2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIHN0YXJ0U3RyIGFuZCB0aGUgZmlyc3QgZW5kU3RyIGFmdGVyIHN0YXJ0U3RyLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKFxyXG4gICAgICAgIHVybDogc3RyaW5nLCBzdGFydFN0cjogc3RyaW5nLCBlbmRTdHI6IHN0cmluZywgZW5kT3B0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkgOiBzdHJpbmcge1xyXG4gICAgbGV0IHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzdGFydFN0cik7XHJcbiAgICBpZihzdGFydEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBzdGFydEluZGV4ICs9IHN0YXJ0U3RyLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihlbmRTdHIsIHN0YXJ0SW5kZXggKyAxKTtcclxuICAgIGlmKGVuZEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgaWYoZW5kT3B0aW9uYWwpIGVuZEluZGV4ID0gdXJsLmxlbmd0aDtcclxuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG59XHJcblxyXG5cclxuLy8gVE9ETzogSW5zdGVhZCBvZiBwcmUtZGVmaW5lZCB1cmwgZm9ybWF0LCB1c2UgcmVjZW50bHkgdXNlZCBvbnQgaW4gVHdpdGNoIHdlYlxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcsIHNpZzogc3RyaW5nKSA6IFVzaGVyVXJsIHtcclxuICAgIGNvbnN0IHVzaGVyVXJsID0gbmV3IFVzaGVyVXJsKGBodHRwczovL3VzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvJHtjaGFubmVsfS5tM3U4YCk7XHJcbiAgICB1c2hlclVybC51cGRhdGUodG9rZW4sIHNpZyk7XHJcblxyXG4gICAgLy8gSXQgaXMgbm90IGNsZWFyIGlmIGFsbCBvZiB0aGVzZSBwYXJhbXMgYXJlIHJlcXVpcmVkIG9yIGlmIHRoZXJlIGFyZSBhbnkgbWlzc2luZyBvbmVzLlxyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJwbGF5ZXJcIiwgXCJ0d2l0Y2h3ZWJcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcImFsbG93X3NvdXJjZVwiLCBcInRydWVcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInR5cGVcIiwgXCJhbnlcIik7XHJcbiAgICBcclxuICAgIHJldHVybiB1c2hlclVybDtcclxufVxyXG5cclxuXHJcbi8vIEludGVyZmFjZSB0byBjb21tdW5pY2F0ZSBiZXR3ZWVuIGJhY2tncm91bmQgYW5kIGNvbnRlbnRzY3JpcHRcclxuLy8gdG8gcmVxdWVzdC9yZXNwb25kIGFjY2VzcyB0b2tlbiBVUkwgYW5kIHVzaGVyIFVSTCBmb3IgYSBjaGFubmVsLlxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFVybHNSZXNwb25zZSB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBhY2Nlc3NUb2tlblVybDogc3RyaW5nO1xyXG4gICAgdXNoZXJVcmw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8vIENsYXNzIHRvIHN0b3JlIGFuZCBtYW5pcHVsYXRlIHVzaGVyIFVSTC5cclxuZXhwb3J0IGNsYXNzIFVzaGVyVXJsIHtcclxuICAgIG9yaWdpbmFsVXJsOiBzdHJpbmc7XHJcbiAgICB1cmxPYmplY3Q6IFVSTDtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGV4cGlyZXNBdDogbnVtYmVyOyAgLy8gVG9rZW4gZXhwaXJhdGlvbiBkYXRldGltZSBpbiBlcG9jaCBzZWNvbmRzXHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuZ2V0Q2hhbm5lbCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19hdWRpb19vbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsT2JqZWN0LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aCh1cmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCI/XCIpO1xyXG4gICAgICAgIGlmKGVuZEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRRdWVyeVN0cmluZyhrZXk6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldChrZXkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWVyeVN0cmluZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuc2V0KG5hbWUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeHBpcmVzQXQoKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5TdHJpbmcgPSB0aGlzLmdldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIik7XHJcbiAgICAgICAgaWYoIXRva2VuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW5Kc29uID0gSlNPTi5wYXJzZSh0b2tlblN0cmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2VuSnNvbi5leHBpcmVzIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXNBdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgcGFyc2UgdG9rZW4gaW4gdXNoZXIgVVJMLiBFcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYW5uZWwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwodGhpcy5vcmlnaW5hbFVybCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld1Rva2VuOiBzdHJpbmcsIG5ld1NpZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInRva2VuXCIsIG5ld1Rva2VuKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwic2lnXCIsIG5ld1NpZyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInBcIiwgdGhpcy5nZXRSYW5kb21OdW1iZXIoKS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tTnVtYmVyKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQge1xyXG4gICAgZ2V0Q2hhbm5lbEZyb21Ub2tlblVybCxcclxuICAgIGdldENoYW5uZWxGcm9tVXNoZXJVcmwsXHJcbiAgICBHZXRVcmxzUmVzcG9uc2UsXHJcbiAgICBVc2hlclVybFxyXG59IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIE1hcCBvZiBjaGFubmVsKHN0cmluZykgdG8gdXJsKHN0cmluZylcclxudmFyIGFjY2Vzc1Rva2VuVXJsTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xyXG4vLyBNYXAgb2YgY2hhbm5lbChzdHJpbmcpIHRvIHVybChVc2hlclVybClcclxudmFyIHVzaGVyVXJsTWFwOiBNYXA8c3RyaW5nLCBVc2hlclVybD4gPSBuZXcgTWFwKCk7XHJcblxyXG5cclxuZnVuY3Rpb24gaGFuZGxlR2V0VXJsc01lc3NhZ2UoY2hhbm5lbDogc3RyaW5nKSA6IEdldFVybHNSZXNwb25zZSB7XHJcbiAgICBjb25zdCBjYWxsYmFja09iajogR2V0VXJsc1Jlc3BvbnNlID0ge2NoYW5uZWw6IGNoYW5uZWwsIGFjY2Vzc1Rva2VuVXJsOiBudWxsLCB1c2hlclVybDogbnVsbH07XHJcblxyXG4gICAgLy8gR2V0IEFjY2VzcyBUb2tlbiBVUkxcclxuICAgIGNvbnN0IHRva2VuVXJsID0gYWNjZXNzVG9rZW5VcmxNYXAuZ2V0KGNoYW5uZWwpO1xyXG4gICAgaWYodG9rZW5VcmwpIHtcclxuICAgICAgICBjYWxsYmFja09iai5hY2Nlc3NUb2tlblVybCA9IHRva2VuVXJsO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkFjY2VzcyB0b2tlbiBVUkwgaXMgbm90IGZvdW5kIGZvciBjaGFubmVsIFwiICsgY2hhbm5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IFVzaGVyIFVSTFxyXG4gICAgY29uc3QgY2FjaGVkVXNoZXJVcmxPYmogPSB1c2hlclVybE1hcC5nZXQoY2hhbm5lbCk7XHJcbiAgICBpZihjYWNoZWRVc2hlclVybE9iaikge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc1NpbmNlRXBvY2ggPSBNYXRoLnJvdW5kKG5vdy5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgICAgICAvLyA2MCBzZWNvbmRzIGJ1ZmZlciBiZWZvcmUgdG9rZW4gZXhwaXJhdGlvblxyXG4gICAgICAgIGlmKHNlY29uZHNTaW5jZUVwb2NoICsgNjAgPCBjYWNoZWRVc2hlclVybE9iai5leHBpcmVzQXQpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2tPYmoudXNoZXJVcmwgPSBjYWNoZWRVc2hlclVybE9iai5nZXRVcmwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQ2FjaGVkIFVSTCBmb3IgJHtjaGFubmVsfSBpcyBleHBpcmVkYCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBObyBjYWNoZWQgdXNoZXJVcmwgb2JqZWN0IGZvciBjaGFubmVsICR7Y2hhbm5lbH1gKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FsbGJhY2tPYmo7XHJcbn1cclxuXHJcblxyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXHJcbiAgICBmdW5jdGlvbihyZXF1ZXN0OiBhbnksIHNlbmRlcjogYW55LCBzZW5kUmVzcG9uc2U6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHJlcXVlc3QubWVzc2FnZSAhPT0gXCJnZXRfYXVkaW9fdXJsXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIm1lc3NhZ2UgaXMgbm90IGdldF9hdWRpb191cmxcIik7XHJcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZShudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXJlcXVlc3QuY2hhbm5lbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiVHdpdGNoIGNoYW5uZWwgbmFtZSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIHJlcXVlc3RcIik7XHJcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZShudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VPYmogPSBoYW5kbGVHZXRVcmxzTWVzc2FnZShyZXF1ZXN0LmNoYW5uZWwpO1xyXG4gICAgICAgIHNlbmRSZXNwb25zZShyZXNwb25zZU9iaik7XHJcbiAgICB9XHJcbik7XHJcblxyXG5cclxuY2hyb21lLndlYlJlcXVlc3Qub25CZWZvcmVSZXF1ZXN0LmFkZExpc3RlbmVyKFxyXG4gICAgZnVuY3Rpb24oZGV0YWlsczogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUb2tlbiByZXF1ZXN0OiBcIiArIGRldGFpbHMudXJsKVxyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVRva2VuVXJsKGRldGFpbHMudXJsKTtcclxuICAgICAgICBpZihjaGFubmVsKSB7XHJcbiAgICAgICAgICAgIGFjY2Vzc1Rva2VuVXJsTWFwLnNldChjaGFubmVsLCBkZXRhaWxzLnVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHt1cmxzOiBbXCIqOi8vYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvKi9hY2Nlc3NfdG9rZW4qXCJdfVxyXG4pO1xyXG5cclxuXHJcbmNocm9tZS53ZWJSZXF1ZXN0Lm9uQmVmb3JlUmVxdWVzdC5hZGRMaXN0ZW5lcihcclxuICAgIGZ1bmN0aW9uKGRldGFpbHM6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXNoZXIgcmVxdWVzdDogXCIgKyBkZXRhaWxzLnVybCk7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwoZGV0YWlscy51cmwpO1xyXG4gICAgICAgIGNvbnN0IHVzaGVyVXJsT2JqID0gbmV3IFVzaGVyVXJsKGRldGFpbHMudXJsKTtcclxuICAgICAgICB1c2hlclVybE1hcC5zZXQoY2hhbm5lbCwgdXNoZXJVcmxPYmopO1xyXG4gICAgfSxcclxuICAgIHt1cmxzOiBbXCIqOi8vdXNoZXIudHR2bncubmV0LypcIl19XHJcbik7Il0sInNvdXJjZVJvb3QiOiIifQ==