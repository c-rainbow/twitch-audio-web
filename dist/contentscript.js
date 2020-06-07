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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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
const nonChannels = [
    "", "directory", "videos", "u", "settings", "friends", "subscriptions", "inventory", "wallet"
];
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
function getChannelFromWebUrl() {
    const url = new URL(location.href);
    const splited = url.pathname.split("/");
    const filtered = splited.filter(elem => elem.length > 0);
    console.debug(`Filtered: ${filtered}, url: ${url.href}`);
    if (filtered.length != 1) {
        return null;
    }
    const channel = filtered[0];
    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (nonChannels.indexOf(channel) != -1) {
        return null;
    }
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
    if (startIndex === -1) {
        return null;
    }
    startIndex += startStr.length;
    let endIndex = url.indexOf(endStr, startIndex + 1);
    if (endIndex === -1) {
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
        if (endIndex === -1) {
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
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/url.ts
var url = __webpack_require__(0);

// CONCATENATED MODULE: ./src/fetch.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function fetchContent(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url) {
            return null;
        }
        try {
            const response = yield fetch(url);
            // TODO: Check if the status if ok
            const respText = yield response.text();
            return respText;
        }
        catch (err) {
            console.debug(`fetchContent threw an error: ${err}`);
        }
        return null;
    });
}
function fetchJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const respText = yield fetchContent(url);
        if (respText) {
            try {
                const respJson = JSON.parse(respText);
                return respJson;
            }
            catch (err) {
                console.log("Response could not be parsed to JSON: " + respText);
            }
        }
        return null;
    });
}
function fetchAudioStreamUrl(usherUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fetchContent(usherUrl);
        const streamUrl = Object(url["f" /* parseAudioOnlyUrl */])(content);
        return streamUrl;
    });
}
function fetchUsherUrl(channel, tokenUrl, lastRequestedChannel, lastRequstedUsherUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get new token and sig from access token URL
        const respJson = yield fetchJson(tokenUrl);
        if (!respJson) {
            return null;
        }
        const token = respJson.token;
        const sig = respJson.sig;
        if (!token || !sig) {
            return null;
        }
        // Check if the channel is different from the channel of the last requested usher url
        // (This is possible if the channel's streamer is hosting another channel)
        if (lastRequestedChannel && channel !== lastRequestedChannel) {
            if (lastRequstedUsherUrl) {
                return lastRequstedUsherUrl;
            }
            // Otherwise, create a new one and store it
            const usherUrl = Object(url["b" /* buildUsherUrl */])(lastRequestedChannel, token, sig);
            return usherUrl.getUrl();
        }
        return null;
    });
}
function tryFetchingPlaylist(group) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!group) {
            return null;
        }
        // see if the existing usher url can be used
        if (group.usherUrl) {
            const respText = yield fetchContent(group.usherUrl);
            if (respText) {
                return respText;
            }
        }
        if (!group.accessTokenUrl) {
            return null;
        }
        // Get new token and sig from access token URL
        const respJson = yield fetchJson(group.accessTokenUrl);
        const token = respJson === null || respJson === void 0 ? void 0 : respJson.token;
        const sig = respJson === null || respJson === void 0 ? void 0 : respJson.sig;
        if (!token || !sig) {
            return null;
        }
        const newUsherUrl = Object(url["b" /* buildUsherUrl */])(group.channel, token, sig);
        const respText = yield fetchContent(newUsherUrl.getUrl());
        return respText;
    });
}

// CONCATENATED MODULE: ./src/video_player_container.ts
var video_player_container_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


// TODO: Any better way than HTML as string?
const initialButtonDom = `
<div class="tw-inline-flex tw-relative tw-tooltip-wrapper radio-mode-button-wrapper">
    <button class="radio-mode-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
            data-a-target="radio-mode-button"
            data-radio-mode-state="disabled"
            aria-label="Radio Mode">
        <div class="tw-align-items-center tw-flex tw-flex-grow-0">
            <span class="tw-button-icon__icon">
                <div class="button-icon-div" style="width: 2rem; height: 2rem;">
                    <!-- Google Material Design Radio Icon. Apache License v2.0 -->
                    <svg class="tw-icon__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
                    </svg>
                </div>
            </span>
        </div>
    </button>
    <div class="tw-tooltip tw-tooltip--align-left tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip">
        
    </div>
</div>
`;
const processedAttr = "data-radio-mode-processed";
const processedAttrVal = "processed";
const videoPlayerStateAttr = "data-a-player-state";
const radioModeStateAttr = "data-radio-mode-state";
const playerIdAttr = "data-radio-mode-player-id";
const videoPlayerClass = "video-player";
const videoPlayerProcessedClass = "video-player-processed";
const videoPlayerIdPrefix = videoPlayerProcessedClass + "-";
const controlGroupClass = "player-controls__left-control-group";
const playButtonAttr = "button[data-a-target='player-play-pause-button']";
const volumeSliderAttr = "input[data-a-target='player-volume-slider']";
const attrObserverConfig = { attributes: true, childList: false, subtree: false };
const domObserverConfig = { attributes: false, childList: true, subtree: true };
function isProcessed(element) {
    return (element === null || element === void 0 ? void 0 : element.getAttribute(processedAttr)) === processedAttrVal;
}
function markProcessed(element) {
    element === null || element === void 0 ? void 0 : element.setAttribute(processedAttr, processedAttrVal);
}
class ControlGroup {
    constructor(player, controlGroupElem) {
        this.player = player;
        this.controlGroupElem = controlGroupElem;
        this.tryUpdatingComponents();
        this.componentsObserver = new MutationObserver(this.tryUpdatingComponents.bind(this));
        this.componentsObserver.observe(this.controlGroupElem, domObserverConfig);
    }
    tryUpdatingComponents() {
        // Check for new Play/Audio button and volume slider 
        const playButtonElem = this.controlGroupElem.querySelector(playButtonAttr);
        this.tryUpdatingPlayButtonElem(playButtonElem);
        const volumeSliderElem = this.controlGroupElem.querySelector(volumeSliderAttr);
        this.tryUpdatingVolumesliderElem(volumeSliderElem);
        // Add the radio button if not exists
        this.tryUpdatingRadioButton();
    }
    tryUpdatingPlayButtonElem(playButtonElem) {
        var _a, _b;
        // play button cannot be found in the control group. Remove reference to the deleted node
        if (!playButtonElem) {
            (_a = this.playButtonObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.playButtonElem = null;
            return;
        }
        // This element was already added to this.playButtonElem. Ignore.
        if (isProcessed(playButtonElem)) {
            return;
        }
        markProcessed(playButtonElem);
        // If exists, remove the existing one
        if (this.playButtonElem) {
            (_b = this.playButtonObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
            this.playButtonElem = null;
        }
        this.playButtonElem = playButtonElem;
        // Pause audio in all players if a video starts to play.
        // This is necesasry for a case when user browses to a non-channel page (e.g. main, esports)
        // which automatically plays a video.
        this.pauseAudioForVideo();
        this.playButtonObserver = new MutationObserver(this.pauseAudioForVideo.bind(this));
        this.playButtonObserver.observe(this.playButtonElem, attrObserverConfig);
    }
    pauseAudioForVideo() {
        const state = this.playButtonElem.getAttribute(videoPlayerStateAttr);
        if (state === "playing") { // Video state from paused to playing
            this.player.pauseAll(); // Pause audio in all player instances
        }
    }
    adjustVolume() {
        if (this.player.audioElem && this.volumeSliderElem) {
            const volume = this.volumeSliderElem.value;
            this.player.audioElem.volume = parseFloat(volume);
        }
    }
    tryUpdatingVolumesliderElem(volumeSliderElem) {
        var _a, _b;
        // volume slider cannot be found in the control group. Remove reference to the deleted node
        if (!volumeSliderElem) {
            (_a = this.volumeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.volumeSliderElem = null;
            return;
        }
        // This element was already added to this.volumeSliderElem. Ignore.
        if (isProcessed(volumeSliderElem)) {
            return;
        }
        markProcessed(volumeSliderElem);
        // If exists, remove the existing one
        if (this.volumeSliderElem) {
            (_b = this.volumeObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
            this.volumeSliderElem = null;
        }
        this.volumeSliderElem = volumeSliderElem;
        // MutationObserver to volumeSlider
        this.volumeObserver = new MutationObserver(this.adjustVolume.bind(this));
        this.volumeObserver.observe(this.volumeSliderElem, attrObserverConfig);
    }
    tryUpdatingRadioButton() {
        var _a;
        // Don't proceed unless both playButtonElem and volumeSliderElem are available
        if (!this.playButtonElem || !this.volumeSliderElem) {
            return;
        }
        // If the button was already created, do nothing
        if (isProcessed(this.radioButton)) {
            return;
        }
        // TODO: Use webpack html loader
        const buttonWrapperDom = document.createElement("div");
        buttonWrapperDom.innerHTML = initialButtonDom;
        this.radioButton = buttonWrapperDom.getElementsByTagName("button")[0];
        markProcessed(this.radioButton);
        // Update radio button state
        const playingState = this.player.playingState;
        this.radioButton.setAttribute(radioModeStateAttr, this.player.playingState);
        this.radioButton.onclick = this.player.onRadioButtonClicked.bind(this.player);
        this.tooltipElem = (_a = buttonWrapperDom.getElementsByClassName("tw-tooltip")) === null || _a === void 0 ? void 0 : _a[0];
        this.updateTooltipText(playingState);
        this.controlGroupElem.appendChild(buttonWrapperDom);
    }
    updateForPlay() {
        // NOTE: There is 1~3 seconds of delay between radio-mode button click and sound being played.
        // It's better to show some intermediate state (icon change, mouse cursor change, etc) in the meanwhile
        var _a;
        // Change the radio button icon
        (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.setAttribute(radioModeStateAttr, "playing" /* PLAYING */);
        this.updateTooltipText("playing" /* PLAYING */);
    }
    updateForPause() {
        var _a;
        // Change the radio button icon
        (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.setAttribute(radioModeStateAttr, "paused" /* PAUSED */);
        this.updateTooltipText("paused" /* PAUSED */);
    }
    updateForDisabled() {
        var _a;
        // Change the radio button icon
        (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.setAttribute(radioModeStateAttr, "disabled" /* DISABLED */);
        this.updateTooltipText("disabled" /* DISABLED */);
    }
    updateTooltipText(newState) {
        if (!this.tooltipElem) {
            return;
        }
        let text = "Radio mode";
        if (newState === "disabled" /* DISABLED */) {
            text = chrome.i18n.getMessage("RADIO_MODE_DISABLED");
        }
        else if (newState === "paused" /* PAUSED */) {
            text = chrome.i18n.getMessage("RADIO_MODE_START");
        }
        else if (newState === "playing" /* PLAYING */) {
            text = chrome.i18n.getMessage("RADIO_MODE_END");
        }
        else {
            console.debug("updateTooltipText for state " + newState);
        }
        this.tooltipElem.textContent = text;
    }
    destroy() {
        var _a, _b, _c;
        (_a = this.componentsObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.playButtonObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
        (_c = this.volumeObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
        // Is this necessary?
        this.controlGroupElem = null;
        this.player = null;
        this.playButtonElem = null;
        this.volumeSliderElem = null;
        this.radioButton = null;
        this.tooltipElem = null;
        this.componentsObserver = null;
        this.playButtonObserver = null;
        this.volumeObserver = null;
    }
}
class video_player_container_VideoPlayer {
    constructor(playerId, container, playerElem) {
        this.playerId = playerId;
        this.container = container;
        this.playerElem = playerElem;
        this.playingState = Object(url["e" /* getChannelFromWebUrl */])() ? "paused" /* PAUSED */ : "disabled" /* DISABLED */;
        this.tryUpdatingComponents();
        this.controlGroupObserver = new MutationObserver(this.tryUpdatingComponents.bind(this));
        this.controlGroupObserver.observe(this.playerElem, domObserverConfig);
    }
    tryUpdatingComponents() {
        this.tryUpdatingControlGroup();
        this.tryObservingVideoElem();
    }
    tryUpdatingControlGroup() {
        var _a, _b, _c;
        // Check if the control group DOM is ready
        const controlGroupElem = (_a = this.playerElem.getElementsByClassName(controlGroupClass)) === null || _a === void 0 ? void 0 : _a[0];
        if (!controlGroupElem) { // control group cannot be found in DOM
            (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.destroy(); // destroy reference to the removed DOM
            this.controlGroup = null;
            return;
        }
        // Add processed class name to prevent duplicate processing of this element
        if (isProcessed(controlGroupElem)) {
            return;
        }
        markProcessed(controlGroupElem);
        (_c = this.controlGroup) === null || _c === void 0 ? void 0 : _c.destroy();
        this.controlGroup = new ControlGroup(this, controlGroupElem);
    }
    tryObservingVideoElem() {
        var _a, _b;
        if (!this.videoElemObserver) {
            const callback = function (mutations) {
                for (let mutation of mutations) {
                    if (mutation.attributeName == "src") {
                        this.updateStatus();
                    }
                }
            };
            this.videoElemObserver = new MutationObserver(callback.bind(this));
        }
        const videoElem = (_a = this.playerElem.getElementsByTagName("video")) === null || _a === void 0 ? void 0 : _a[0];
        if (!videoElem) {
            (_b = this.videoElemObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
            this.videoElem = null;
            return;
        }
        if (isProcessed(videoElem)) {
            return;
        }
        this.videoElem = videoElem;
        markProcessed(this.videoElem);
        this.videoElemObserver.observe(this.videoElem, attrObserverConfig);
    }
    updateStatus() {
        const channel = Object(url["e" /* getChannelFromWebUrl */])();
        if (channel) {
            this.enable();
        }
        else {
            this.disable();
        }
    }
    enable() {
        const state = this.playingState;
        if (state === "disabled" /* DISABLED */) {
            this.pauseFromDisabled();
        }
    }
    disable() {
        var _a;
        if (this.playingState === "disabled" /* DISABLED */) {
            return;
        }
        if (this.playingState === "playing" /* PLAYING */) {
            this.pause();
        }
        this.playingState = "disabled" /* DISABLED */;
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForDisabled();
    }
    play(mediaUrl) {
        var _a;
        if (this.playingState !== "paused" /* PAUSED */) {
            return;
        }
        if (!mediaUrl) {
            console.debug("No mediaUrl is found to play");
            return;
        }
        if (this.audioElem) {
            console.debug("Audio element already exists");
            return;
        }
        // Create a separate <video> element to play audio.
        // <audio> can be also used by hls.js, but Typescript forces this to be HTMLVideoElement.
        this.audioElem = document.createElement("audio");
        this.audioElem.classList.add("nodisplay");
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.adjustVolume(); // Match the initial volume with the slider value.
        this.playerElem.appendChild(this.audioElem);
        this.hls = new Hls({
            //debug: true,
            liveSyncDuration: 0,
            liveMaxLatencyDuration: 5,
            liveDurationInfinity: true // true for live stream
        });
        this.hls.loadSource(mediaUrl);
        this.hls.attachMedia(this.audioElem);
        // TODO: Is this safe to play right away after attaching the media?
        // The main example at hls.js website tells to use MANIFEST_PARSED event,
        // but for some reason the event is not triggered with typescript+webpack.
        const audioPlayCallback = function () {
            var _a;
            console.log("Play started");
            (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForPlay();
        };
        this.controlGroup.radioButton.setAttribute(radioModeStateAttr, "loading");
        this.audioElem.play().then(audioPlayCallback.bind(this));
        this.playingState = "playing" /* PLAYING */;
        // Stop the video if playing
        this.pauseVideo();
        //this.controlGroup?.updateForPlay();
    }
    pauseFromDisabled() {
        var _a;
        const state = this.playingState;
        if (state !== "disabled" /* DISABLED */) {
            return;
        }
        this.playingState = "paused" /* PAUSED */;
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForPause();
    }
    pause() {
        var _a;
        const state = this.playingState;
        if (state === "paused" /* PAUSED */ || state === "disabled" /* DISABLED */) {
            return;
        }
        if (this.hls) {
            try {
                this.audioElem.pause();
            }
            catch (err) {
                // "DOMException: The play() request was interrupted by a call to pause()"
                // is thrown when user pauses the audio too quickly after playing.
                // No action is needed. The audio will be paused correctly anyway.
            }
            this.hls.stopLoad();
            this.hls.detachMedia();
            this.hls.destroy();
            // There seems to be a bug that the HLS object gets stuck after multiple plays and pauses
            // if it is re-used for the next play. Need to destroy the object and re-create it.
            this.hls = null;
            this.playerElem.removeChild(this.audioElem);
            this.audioElem = null;
        }
        this.playingState = "paused" /* PAUSED */;
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForPause();
        const onPause = function (result) {
            if (result.autoplay) {
                this.playVideo();
            }
        };
        chrome.storage.local.get(['autoplay'], onPause.bind(this));
    }
    playVideo() {
        this.toggleVideoStateIf("paused");
    }
    pauseVideo() {
        this.toggleVideoStateIf("playing");
    }
    toggleVideoStateIf(expectedState) {
        var _a;
        const videoPlayButton = (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.playButtonElem;
        const videoState = videoPlayButton === null || videoPlayButton === void 0 ? void 0 : videoPlayButton.getAttribute(videoPlayerStateAttr);
        if (videoState === expectedState) {
            videoPlayButton.click();
        }
    }
    // Pause audio in all players
    pauseAll() {
        this.container.pauseExcept(null);
    }
    destroy() {
        var _a;
        this.disable();
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    requestPlay() {
        const channel = Object(url["e" /* getChannelFromWebUrl */])();
        if (!channel) {
            // Currently in a non-channel page. Disable 
            this.disable();
            return;
        }
        const responseCallback = function (response) {
            var _a;
            return video_player_container_awaiter(this, void 0, void 0, function* () {
                if (!((_a = response === null || response === void 0 ? void 0 : response.webUrl) === null || _a === void 0 ? void 0 : _a.channel)) {
                    // Currently in a non-channel page. Disable 
                    this.disable();
                    return;
                }
                let playlist = yield tryFetchingPlaylist(response.webUrl);
                if (!playlist) {
                    // Offline or hosting another channel. Disable 
                    this.disable();
                    return;
                }
                const audioStreamUrl = Object(url["f" /* parseAudioOnlyUrl */])(playlist);
                if (audioStreamUrl) {
                    this.container.pauseExcept(this.playerId);
                    this.play(audioStreamUrl);
                }
            });
        };
        chrome.runtime.sendMessage({ message: "get_audio_url", channel: channel }, responseCallback.bind(this));
    }
    onRadioButtonClicked() {
        switch (this.playingState) {
            case "disabled" /* DISABLED */:
                break;
            case "paused" /* PAUSED */:
                this.requestPlay();
                break;
            case "playing" /* PLAYING */:
                this.pause();
                break;
        }
    }
}
class VideoPlayerContainer {
    constructor() {
        this.players = [];
        this.nextId = 10001; // Random start index for player.
    }
    run() {
        // Find existing video player elements to create VideoPlayer objects
        this.updateVideoPlayerList();
        // Detect future video player elements
        const mainElem = document.getElementsByTagName("main")[0];
        this.observer = new MutationObserver(this.updateVideoPlayerList.bind(this));
        this.observer.observe(mainElem, domObserverConfig);
    }
    updateVideoPlayerList() {
        // TODO: Is it better to iterate only the mutated divs?
        const playerElems = document.body.getElementsByClassName(videoPlayerClass);
        for (let playerElem of playerElems) {
            // If the div is not already processed
            if (!isProcessed(playerElem)) {
                console.debug("New video player detected");
                this.createNewPlayer(playerElem);
            }
        }
        // No need to proceed if there are the same number of players in the list and in DOM.
        if (playerElems.length === this.players.length) {
            return;
        }
        this.garbageCollectPlayers(playerElems);
    }
    // Remove video players not in DOM anymore.
    // This happens when a user browses from a non-channel page (main, directory, etc.) to a channel page,
    // or between non-channel pages.
    garbageCollectPlayers(playerElems) {
        const allPlayerIdsInDom = [];
        for (let playerElem of playerElems) {
            allPlayerIdsInDom.push(playerElem.getAttribute(playerIdAttr));
        }
        console.debug("All playerIds in DOM: " + allPlayerIdsInDom);
        const newlist = [];
        for (let player of this.players) {
            const playerId = player.playerId;
            if (allPlayerIdsInDom.indexOf(playerId) != -1) {
                newlist.push(player);
            }
            else {
                console.debug(`Player ${playerId} is not in DOM anymore. Deleting..`);
                player.destroy();
            }
        }
        this.players = newlist;
    }
    createNewPlayer(playerElem) {
        if (isProcessed(playerElem)) {
            return;
        }
        markProcessed(playerElem);
        const newPlayerId = videoPlayerIdPrefix + this.nextId;
        this.nextId += 1;
        playerElem.setAttribute(playerIdAttr, newPlayerId);
        const player = new video_player_container_VideoPlayer(newPlayerId, this, playerElem);
        this.players.push(player);
    }
    pauseExcept(playerId) {
        for (let player of this.players) {
            if (player.playerId !== playerId)
                player.pause();
        }
    }
    destroy() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.observer = null;
        for (let player of this.players) {
            player.destroy();
        }
        this.players = [];
    }
}

// CONCATENATED MODULE: ./src/contentscript.ts

var contentscript_container = new VideoPlayerContainer();
contentscript_container.run();


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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LFFBQVEsS0FBSyxRQUFRO2dCQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNuRDtJQUNMLENBQUM7SUFFRCxPQUFPOztRQUNILFVBQUksQ0FBQyxRQUFRLDBDQUFFLFVBQVUsR0FBRztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixLQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNKOzs7QUNqckIrRDtBQUdoRSxJQUFJLHVCQUFTLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0FBQzNDLHVCQUFTLENBQUMsR0FBRyxFQUFFLENBQUMiLCJmaWxlIjoiY29udGVudHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcbiIsIlxyXG5jb25zdCB0d2l0Y2hEb21haW4gOiBzdHJpbmcgPSBcInR3aXRjaC50di9cIjtcclxuLy8gTm9uLWV4aHVhc3RpdmUgbGlzdCBvZiBub24tY2hhbm5lbCByb3V0ZXMgaW4gdHdpdGNoLnR2XHJcbmNvbnN0IG5vbkNoYW5uZWxzIDogc3RyaW5nW10gPSBbXHJcbiAgICBcIlwiLCBcImRpcmVjdG9yeVwiLCBcInZpZGVvc1wiLCBcInVcIiwgXCJzZXR0aW5nc1wiLCBcImZyaWVuZHNcIiwgXCJzdWJzY3JpcHRpb25zXCIsIFwiaW52ZW50b3J5XCIsIFwid2FsbGV0XCJdO1xyXG5cclxuY29uc3QgYXBpRG9tYWluIDogc3RyaW5nID0gXCJhcGkudHdpdGNoLnR2L2FwaS9jaGFubmVscy9cIjtcclxuY29uc3QgYWNjZXNzVG9rZW4gOiBzdHJpbmcgPSBcIi9hY2Nlc3NfdG9rZW5cIjtcclxuXHJcbmNvbnN0IHVzaGVyRG9tYWluIDogc3RyaW5nID0gXCJ1c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzL1wiO1xyXG5jb25zdCB1c2hlckV4dCA6IHN0cmluZyA9IFwiLm0zdThcIjtcclxuXHJcblxyXG4vLyBFeHRyYWN0IGF1ZGlvX29ubHkgc3RyZWFtIC5tM3U4IGZyb20gdGhlIG1hc3RlciBwbGF5bGlzdCBjb250ZW50LlxyXG4vLyBSZXR1cm5zIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2YgYSBVUkwgYWZ0ZXIgYXVkaW9fb25seSBtZXRhZGF0YS5cclxuLy8gVE9ETzogVGhpcyB3b3JrcywgYnV0IGV2ZW50dWFsbHkgd2Ugd2lsbCBuZWVkIHRvIGZ1bGx5IHBhcnNlIHRoZSBjb250ZW50XHJcbi8vIGFuZCBnZXQgYXVkaW9fb25seSBzdHJlYW0gdXJsXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF1ZGlvT25seVVybChjb250ZW50OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGlmKCFjb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gICAgbGV0IGF1ZGlvT25seUZvdW5kID0gZmFsc2U7XHJcbiAgICBmb3IobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgICBpZiAobGluZS5pbmNsdWRlcyhcImF1ZGlvX29ubHlcIikpIGF1ZGlvT25seUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICBpZiAoYXVkaW9Pbmx5Rm91bmQgJiYgbGluZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly9cIikpIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgY29uc3Qgc3BsaXRlZCA9IHVybC5wYXRobmFtZS5zcGxpdChcIi9cIik7XHJcbiAgICBjb25zdCBmaWx0ZXJlZCA9IHNwbGl0ZWQuZmlsdGVyKGVsZW0gPT4gZWxlbS5sZW5ndGggPiAwKTtcclxuICAgIGNvbnNvbGUuZGVidWcoYEZpbHRlcmVkOiAke2ZpbHRlcmVkfSwgdXJsOiAke3VybC5ocmVmfWApO1xyXG4gICAgaWYoZmlsdGVyZWQubGVuZ3RoICE9IDEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gICBcclxuXHJcbiAgICBjb25zdCBjaGFubmVsID0gZmlsdGVyZWRbMF07XHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChub25DaGFubmVscy5pbmRleE9mKGNoYW5uZWwpICE9IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVRva2VuVXJsKGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3MoYWNjZXNzVG9rZW5VcmwsIGFwaURvbWFpbiwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIGFjY2VzcyB0b2tlbjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVXNoZXJVcmwodXNoZXJVcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1c2hlclVybCwgdXNoZXJEb21haW4sIHVzaGVyRXh0KTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCB1c2hlcjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuLy8gR2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIHN0YXJ0U3RyIGFuZCB0aGUgZmlyc3QgZW5kU3RyIGFmdGVyIHN0YXJ0U3RyLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKFxyXG4gICAgICAgIHVybDogc3RyaW5nLCBzdGFydFN0cjogc3RyaW5nLCBlbmRTdHI6IHN0cmluZywgZW5kT3B0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkgOiBzdHJpbmcge1xyXG4gICAgbGV0IHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzdGFydFN0cik7XHJcbiAgICBpZihzdGFydEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgc3RhcnRJbmRleCArPSBzdGFydFN0ci5sZW5ndGg7XHJcblxyXG4gICAgbGV0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoZW5kU3RyLCBzdGFydEluZGV4ICsgMSk7XHJcbiAgICBpZihlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICBpZihlbmRPcHRpb25hbCkgZW5kSW5kZXggPSB1cmwubGVuZ3RoO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsLnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbn1cclxuXHJcblxyXG4vLyBUT0RPOiBJbnN0ZWFkIG9mIHByZS1kZWZpbmVkIHVybCBmb3JtYXQsIHVzZSByZWNlbnRseSB1c2VkIG9udCBpbiBUd2l0Y2ggd2ViXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW46IHN0cmluZywgc2lnOiBzdHJpbmcpIDogVXNoZXJVcmwge1xyXG4gICAgY29uc3QgdXNoZXJVcmwgPSBuZXcgVXNoZXJVcmwoYGh0dHBzOi8vdXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy8ke2NoYW5uZWx9Lm0zdThgKTtcclxuICAgIHVzaGVyVXJsLnVwZGF0ZSh0b2tlbiwgc2lnKTtcclxuXHJcbiAgICAvLyBJdCBpcyBub3QgY2xlYXIgaWYgYWxsIG9mIHRoZXNlIHBhcmFtcyBhcmUgcmVxdWlyZWQgb3IgaWYgdGhlcmUgYXJlIGFueSBtaXNzaW5nIG9uZXMuXHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInBsYXllclwiLCBcInR3aXRjaHdlYlwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfc291cmNlXCIsIFwidHJ1ZVwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwidHlwZVwiLCBcImFueVwiKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHVzaGVyVXJsO1xyXG59XHJcblxyXG5cclxuLy8gSW50ZXJmYWNlIHRvIGNvbW11bmljYXRlIGJldHdlZW4gYmFja2dyb3VuZCBhbmQgY29udGVudHNjcmlwdFxyXG4vLyB0byByZXF1ZXN0L3Jlc3BvbmQgYWNjZXNzIHRva2VuIFVSTCBhbmQgdXNoZXIgVVJMIGZvciBhIGNoYW5uZWwuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJsc1Jlc3BvbnNlIHtcclxuICAgIHdlYlVybDogVXJsR3JvdXA7XHJcbiAgICBsYXN0UmVxdWVzdGVkOiBVcmxHcm91cDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXJsR3JvdXAge1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgYWNjZXNzVG9rZW5Vcmw6IHN0cmluZztcclxuICAgIHVzaGVyVXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vLyBDbGFzcyB0byBzdG9yZSBhbmQgbWFuaXB1bGF0ZSB1c2hlciBVUkwuXHJcbmV4cG9ydCBjbGFzcyBVc2hlclVybCB7XHJcbiAgICBvcmlnaW5hbFVybDogc3RyaW5nO1xyXG4gICAgdXJsT2JqZWN0OiBVUkw7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBleHBpcmVzQXQ6IG51bWJlcjsgIC8vIFRva2VuIGV4cGlyYXRpb24gZGF0ZXRpbWUgaW4gZXBvY2ggc2Vjb25kc1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFVybCA9IHVybDtcclxuICAgICAgICB0aGlzLnVybE9iamVjdCA9IG5ldyBVUkwodXJsKTtcclxuICAgICAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmdldENoYW5uZWwoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfYXVkaW9fb25seVwiLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5leHBpcmVkVXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc1NpbmNlRXBvY2ggPSBNYXRoLnJvdW5kKG5vdy5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgICAgICAvLyA2MCBzZWNvbmRzIGJ1ZmZlciBiZWZvcmUgdG9rZW4gZXhwaXJhdGlvblxyXG4gICAgICAgIGlmKHNlY29uZHNTaW5jZUVwb2NoICsgNjAgPCB0aGlzLmV4cGlyZXNBdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVcmwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQ2FjaGVkIFVSTCBmb3IgJHt0aGlzLmNoYW5uZWx9IGlzIGV4cGlyZWRgKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsT2JqZWN0LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aCh1cmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCI/XCIpO1xyXG4gICAgICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsLnN1YnN0cmluZygwLCBlbmRJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UXVlcnlTdHJpbmcoa2V5OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5nZXQoa2V5KTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UXVlcnlTdHJpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLnNldChuYW1lLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhwaXJlc0F0KCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHRva2VuU3RyaW5nID0gdGhpcy5nZXRRdWVyeVN0cmluZyhcInRva2VuXCIpO1xyXG4gICAgICAgIGlmKCF0b2tlblN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuSnNvbiA9IEpTT04ucGFyc2UodG9rZW5TdHJpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBleHBpcmVzQXQgPSB0b2tlbkpzb24uZXhwaXJlcyBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzQXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IHBhcnNlIHRva2VuIGluIHVzaGVyIFVSTC4gRXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFubmVsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHRoaXMub3JpZ2luYWxVcmwpO1xyXG4gICAgICAgIHJldHVybiBjaGFubmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdUb2tlbjogc3RyaW5nLCBuZXdTaWc6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiLCBuZXdUb2tlbik7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInNpZ1wiLCBuZXdTaWcpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJwXCIsIHRoaXMuZ2V0UmFuZG9tTnVtYmVyKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbU51bWJlcigpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHsgYnVpbGRVc2hlclVybCwgcGFyc2VBdWRpb09ubHlVcmwsIFVybEdyb3VwIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQ29udGVudCh1cmw6IHN0cmluZykge1xyXG4gICAgaWYoIXVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdGhlIHN0YXR1cyBpZiBva1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiByZXNwVGV4dDtcclxuICAgIH1cclxuICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYGZldGNoQ29udGVudCB0aHJldyBhbiBlcnJvcjogJHtlcnJ9YClcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSnNvbih1cmw6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXJsKTtcclxuICAgIGlmKHJlc3BUZXh0KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcEpzb24gPSBKU09OLnBhcnNlKHJlc3BUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BKc29uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBjb3VsZCBub3QgYmUgcGFyc2VkIHRvIEpTT046IFwiICsgcmVzcFRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXVkaW9TdHJlYW1VcmwodXNoZXJVcmw6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgY29udGVudCA9IGF3YWl0IGZldGNoQ29udGVudCh1c2hlclVybCk7XHJcbiAgICBjb25zdCBzdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChjb250ZW50KTtcclxuICAgIHJldHVybiBzdHJlYW1Vcmw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuVXJsOiBzdHJpbmcsIGxhc3RSZXF1ZXN0ZWRDaGFubmVsOiBzdHJpbmcsXHJcbiAgICAgICAgbGFzdFJlcXVzdGVkVXNoZXJVcmw6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgLy8gR2V0IG5ldyB0b2tlbiBhbmQgc2lnIGZyb20gYWNjZXNzIHRva2VuIFVSTFxyXG4gICAgY29uc3QgcmVzcEpzb24gPSBhd2FpdCBmZXRjaEpzb24odG9rZW5VcmwpO1xyXG4gICAgaWYoIXJlc3BKc29uKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24udG9rZW4gYXMgc3RyaW5nO1xyXG4gICAgY29uc3Qgc2lnID0gcmVzcEpzb24uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFubmVsIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjaGFubmVsIG9mIHRoZSBsYXN0IHJlcXVlc3RlZCB1c2hlciB1cmxcclxuICAgIC8vIChUaGlzIGlzIHBvc3NpYmxlIGlmIHRoZSBjaGFubmVsJ3Mgc3RyZWFtZXIgaXMgaG9zdGluZyBhbm90aGVyIGNoYW5uZWwpXHJcbiAgICBpZihsYXN0UmVxdWVzdGVkQ2hhbm5lbCAmJiBjaGFubmVsICE9PSBsYXN0UmVxdWVzdGVkQ2hhbm5lbCkge1xyXG4gICAgICAgIGlmKGxhc3RSZXF1c3RlZFVzaGVyVXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXN0UmVxdXN0ZWRVc2hlclVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBuZXcgb25lIGFuZCBzdG9yZSBpdFxyXG4gICAgICAgIGNvbnN0IHVzaGVyVXJsID0gYnVpbGRVc2hlclVybChsYXN0UmVxdWVzdGVkQ2hhbm5lbCwgdG9rZW4sIHNpZyk7XHJcbiAgICAgICAgcmV0dXJuIHVzaGVyVXJsLmdldFVybCgpOyAgXHJcbiAgICB9ICBcclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyeUZldGNoaW5nUGxheWxpc3QoZ3JvdXA6IFVybEdyb3VwKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBpZighZ3JvdXApIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuIFxyXG4gICAgLy8gc2VlIGlmIHRoZSBleGlzdGluZyB1c2hlciB1cmwgY2FuIGJlIHVzZWRcclxuICAgIGlmKGdyb3VwLnVzaGVyVXJsKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQoZ3JvdXAudXNoZXJVcmwpO1xyXG4gICAgICAgIGlmKHJlc3BUZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwVGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWdyb3VwLmFjY2Vzc1Rva2VuVXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IG5ldyB0b2tlbiBhbmQgc2lnIGZyb20gYWNjZXNzIHRva2VuIFVSTFxyXG4gICAgY29uc3QgcmVzcEpzb24gPSBhd2FpdCBmZXRjaEpzb24oZ3JvdXAuYWNjZXNzVG9rZW5VcmwpO1xyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbj8udG9rZW4gYXMgc3RyaW5nO1xyXG4gICAgY29uc3Qgc2lnID0gcmVzcEpzb24/LnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXdVc2hlclVybCA9IGJ1aWxkVXNoZXJVcmwoZ3JvdXAuY2hhbm5lbCwgdG9rZW4sIHNpZyk7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChuZXdVc2hlclVybC5nZXRVcmwoKSk7XHJcbiAgICByZXR1cm4gcmVzcFRleHQ7XHJcbn0iLCJcclxuaW1wb3J0IHsgdHJ5RmV0Y2hpbmdQbGF5bGlzdCB9IGZyb20gXCIuL2ZldGNoXCI7XHJcbmltcG9ydCB7IGdldENoYW5uZWxGcm9tV2ViVXJsLCBHZXRVcmxzUmVzcG9uc2UsIHBhcnNlQXVkaW9Pbmx5VXJsIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuLy8gVE9ETzogQW55IGJldHRlciB3YXkgdGhhbiBIVE1MIGFzIHN0cmluZz9cclxuY29uc3QgaW5pdGlhbEJ1dHRvbkRvbSA9IGBcclxuPGRpdiBjbGFzcz1cInR3LWlubGluZS1mbGV4IHR3LXJlbGF0aXZlIHR3LXRvb2x0aXAtd3JhcHBlciByYWRpby1tb2RlLWJ1dHRvbi13cmFwcGVyXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwicmFkaW8tbW9kZS1idXR0b24gdHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWFsaWduLW1pZGRsZSB0dy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJ1dHRvbi1pY29uIHR3LWJ1dHRvbi1pY29uLS1vdmVybGF5IHR3LWNvcmUtYnV0dG9uIHR3LWNvcmUtYnV0dG9uLS1vdmVybGF5IHR3LWlubGluZS1mbGV4IHR3LWludGVyYWN0aXZlIHR3LWp1c3RpZnktY29udGVudC1jZW50ZXIgdHctb3ZlcmZsb3ctaGlkZGVuIHR3LXJlbGF0aXZlXCJcclxuICAgICAgICAgICAgZGF0YS1hLXRhcmdldD1cInJhZGlvLW1vZGUtYnV0dG9uXCJcclxuICAgICAgICAgICAgZGF0YS1yYWRpby1tb2RlLXN0YXRlPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiUmFkaW8gTW9kZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctZmxleCB0dy1mbGV4LWdyb3ctMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3LWJ1dHRvbi1pY29uX19pY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWljb24tZGl2XCIgc3R5bGU9XCJ3aWR0aDogMnJlbTsgaGVpZ2h0OiAycmVtO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gR29vZ2xlIE1hdGVyaWFsIERlc2lnbiBSYWRpbyBJY29uLiBBcGFjaGUgTGljZW5zZSB2Mi4wIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJ0dy1pY29uX19zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zLjI0IDYuMTVDMi41MSA2LjQzIDIgNy4xNyAyIDh2MTJjMCAxLjEuODkgMiAyIDJoMTZjMS4xMSAwIDItLjkgMi0yVjhjMC0xLjExLS44OS0yLTItMkg4LjNsOC4yNi0zLjM0TDE1Ljg4IDEgMy4yNCA2LjE1ek03IDIwYy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3ptMTMtOGgtMnYtMmgtMnYySDRWOGgxNnY0elwiLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxkaXYgY2xhc3M9XCJ0dy10b29sdGlwIHR3LXRvb2x0aXAtLWFsaWduLWxlZnQgdHctdG9vbHRpcC0tdXBcIiBkYXRhLWEtdGFyZ2V0PVwidHctdG9vbHRpcC1sYWJlbFwiIHJvbGU9XCJ0b29sdGlwXCI+XHJcbiAgICAgICAgXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5jb25zdCBwcm9jZXNzZWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHByb2Nlc3NlZEF0dHJWYWwgPSBcInByb2Nlc3NlZFwiXHJcblxyXG5jb25zdCB2aWRlb1BsYXllclN0YXRlQXR0ciA9IFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiO1xyXG5cclxuY29uc3QgcmFkaW9Nb2RlU3RhdGVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtc3RhdGVcIjtcclxuY29uc3QgcGxheWVySWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcGxheWVyLWlkXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklkUHJlZml4ID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCBhdHRyT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcbmNvbnN0IGRvbU9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBWaWRlb1BsYXllckNvbnRhaW5lciwgYWRkIE11dGF0aW9uT2JzZXJ2ZXIgdG8gXHJcbiAqIDEuIGRvY3VtZW50LmJvZHkgY2hlY2tzIGZvciBvbmUgc3VidHJlZSBjaGFuZ2VcclxuICogICAxLTIuIElmIGRpdiB3aXRoIGNsYXNzIFwidmlkZW8tcGxheWVyXCIsIHByb2Nlc3MgaXQuIENoZWNrICMyXHJcbiAqIFxyXG4gKiAyLiBDcmVhdGUgVmlkZW9QbGF5ZXIsIHZpZGVvLXBsYXllciBjbGFzcyBkaXYgY2hlY2tzIGZvciAxIGF0dHJpYnV0ZSBjaGFuZ2UsIDMgc3VidHJlZSBjaGFuZ2VzXHJcbiAqICAgMi0xLiBhdHRyaWJ1dGUgXCJkYXRhLWEtcGxheWVyLXR5cGVcIjogXCJzaXRlXCIsIFwic2l0ZV9taW5pXCIsIFwiY2xpcHMtd2F0Y2hcIiwgXCJjaGFubmVsX2hvbWVfY2Fyb3VzZWxcIlxyXG4gKiAgICAgMi0yLTIuIENoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciBpZiBuZWNlc3NhcnlcclxuICogICAgIDItMi0zLiBNb2RlOiBUdXBsZSBvZiAobGF5b3V0LCB2aWRlb190eXBlKS5cclxuICogICAgICAgMi0yLTMtMS4gbGF5b3V0OiBcInNpdGVcIiB8IFwic2l0ZV9taW5pXCJcclxuICogICAgICAgMi0yLTMtMi4gdmlkZW9fdHlwZTogXCJsaXZlXCIsIFwidm9kXCIsIFwiY2xpcFwiLi4gYW5kIG1vcmU/Pz8/P1xyXG4gKiAgIDItMi4gc3VidHJlZSBkaXYgd2l0aCBjbGFzcyBcInZvZC1zZWVrYmFyLXRpbWUtbGFiZWxzXCIgYW5kIFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCJcclxuICogICAgIDItMi0xLiBUaGlzIG9ubHkgYXBwZWFycyBpbiBWT0Qgd2F0Y2hcclxuICogICAgIDItMi0yLiBJZiBjcmVhdGVkLCBjaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgdG8gVk9EXHJcbiAqICAgICAyLTItMy4gSWYgcmVtb3ZlZCAoY2hhbmdlZCBmcm9tIFZPRCB0byBsaXZlL2NsaXApLCA/Pz8/XHJcbiAqICAgMi0zLiBjaGVjayBmb3IgY29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCJcclxuICogICAgIDItMy0xLiBJZiBjcmVhdGVkLCBjaGVjayAjMyBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi0zLTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqICAgMi00LiBjaGVjayBmb3IgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdGhlIHBsYXllclxyXG4gKiAgICAgMi00LTEuIElmIGNyZWF0ZWQsIGNoZWNrICM2IGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTQtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogXHJcbiAqIDMuIENvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiIGNoZWNrcyBmb3IgXHJcbiAqICAgMy0xLiBzdWJ0cmVlIGJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXSBmb3IgdmlkZW8gcGxheS9wYXVzZSBidXR0b25cclxuICogICAgIDMtMS0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNFxyXG4gKiAgICAgMy0xLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0yLiBzdWJ0cmVlIGlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ10gZm9yIHZvbHVtZSBzbGlkZXJcclxuICogICAgIDMtMi0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNVxyXG4gKiAgICAgMy0yLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0zLiBJZiBib3RoIGNvbXBvbmVudHMgaW4gMy0xIGFuZCAzLTIgYXJlIHJlYWR5OlxyXG4gKiAgICAgMy0zLTEuIENyZWF0ZSByYWRpbyBtb2RlIGJ1dHRvbiwgYW5kIHB1dCBNdXRhdGlvbk9ic2VydmVyIChzZWUgIzQgYW5kICM1KVxyXG4gKiAgICAgMy0zLTIuIElmIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgaXMgcmVtb3ZlZCAoc2l0ZS0+c2l0ZV9taW5pIGNoYW5nZSwgZXRjKVxyXG4gKiAgICAgICAzLTMtMi0xLiBhbHNvIHJlbW92ZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gZnJvbSBET01cclxuICogXHJcbiAqIDQuIFZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uIGNoZWNrcyBmb3JcclxuICogICA0LTEuIEF0dHJpYnV0ZSBjaGFuZ2UgdmlkZW9QbGF5ZXJTdGF0ZUF0dHI6IFwicGxheWluZ1wiIG9yIFwicGF1c2VkXCJcclxuICogICAgIDQtMS0xLiBJZiBhdHRyaWJ1dGUgdmFsdWUgY2hhbmdlZCB0byBcInBsYXlpbmdcIiwgc3RvcCBhbGwgYXVkaW8gaW4gdGhlIFZpZGVvUGxheWVyQ29udGFpbmVyXHJcbiAqIFxyXG4gKiA1LiBWb2x1bWUgc2xpZGVyIGNoZWNrcyBmb3JcclxuICogICA1LTEuIEF0dHJpYnV0ZSBcInZhbHVlXCIgY2hhbmdlOiBudW1iZXIgYmV0d2VlbiAwIDw9IG51bSA8PSAxXHJcbiAqICAgICA1LTEtMS4gSWYgY2hhbmdlIGlzIGRldGVjdGVkLCBhcHBseSB0aGUgbmV3IHZvbHVtZSB0byBhdWRpb0VsZW0uXHJcbiAqIFxyXG4gKiA2LiBvcmlnaW5hbCBcInZpZGVvXCIgZWxlbWVudCBpbiB2aWRlby1wbGF5ZXIgY2hlY2tzIGZvclxyXG4gKiAgIDYtMS4gQXR0cmlidXRlIFwic3JjXCIgY2hhbmdlOiBtZWFucyB0aGF0IHRoZSB2aWRlbyBzb3VyY2UgY2hhbmdlZCAobGlrZWx5IGhvc3RpbmcgYW5vdGhlciBzdHJlYW1lcilcclxuICogICAgIDYtMS0xLiBSYWRpbyBtb2RlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQ/IFJlLWNvbmZpZ3VyZWQgd2l0aCB0aGUgbmV3IHN0cmVhbWVyJ3MgVVJMP1xyXG4gKiAgICBcclxuICovXHJcblxyXG4vKipcclxuICogSG93IHRvIGRldGVjdCB0aGUgY2hhbm5lbCBvZiB0aGUgc3RyZWFtIGJlaW5nIHBsYXllZD9cclxuICogR2V0dGluZyBjaGFubmVsIG5hbWUgZnJvbSBVUkwgaGFzIHRoZSBmb2xsbG93aW5nIGlzc3Vlc1xyXG4gKiAoMSkgU3RyZWFtZXIgaG9zdGluZyBhbm90aGVyIGNoYW5uZWxcclxuICogKDIpIE1haW4gcGFnZS4gQ2hhbm5lbCBjYW4gY2hhbmdlIHF1aWNrbHkgaW4gdGhlIGNhcm91c2VsXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIEtlZXAgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBpbiB0aGUgdGFiLiBHdWVzcyB0aGUgY2hhbm5lbCBmcm9tIHRoZXJlXHJcbiAqICgyKSBGb3IgXCJzaXRlX21pbmlcIiBzdGF0ZSwgc3RvcmUgdGhlIGNoYW5uZWwgbmFtZSBpbiB2aWRlbyBwbGF5ZXIuXHJcbiAqICAgICBJbiB0aGF0IGNhc2UsIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gcmVzdW1lIHBsYXlpbmcgaW4gdGhlIHJpZ2h0IGNoYW5uZWwuXHJcbiAqICgzKSBEaXNhYmxlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBpbiB0aGUgbWFpbiBwYWdlXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgcmFkaW8gbW9kZSBidXR0b24gaW4gc2l0ZV9taW5pP1xyXG4gKiBEb24ndCBzdG9yZSB0aGUgcGxheXN0YXRlIGluIERPTTogb25seSBzdG9yZSBpdCBpbiBWaWRlb1BsYXllciBjbGFzcyBhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFU3BvcnRzIHBhZ2U6IHZpZGVvIG1pbmlwbGF5ZXIga2VlcHMgcGxheWluZyBldmVuIHdoZW4gdGhlIHNpdGUgcGxheWVyIGluIEVzcG9ydHMgcGFnZSBpcyBhbHNvIGJlaW5nIHBsYXllZC5cclxuICogU2hvdWxkIHRoZSByYWRpbyBtb2RlIGZvbGxvdyB0aGUgc2FtZSBiZWhhdmlvcj9cclxuICovXHJcblxyXG4vKipcclxuICogQWNjZXNzIHRva2VuIHVybCBoYXMgb2F1dGggY29kZSwgd2hpY2ggaXMgdW5kZWZpbmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqIE5vdCBzdXJlIGhvdyBUd2l0Y2ggcmV0dXJucyBjb3JyZWN0IHJlc3BvbnNlIGZvciBhbm9ueW1vdXMgdXNlciB5ZXQuXHJcbiAqIENhbGxpbmcgdGhlIHNhbWUgYWNjZXNzIHRva2VuIFVSTCBmcm9tIGNvbnRlbnRzY3JpcHQgcmV0dXJucyBlcnJvci5cclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKi9cclxuXHJcbmNvbnN0IGVudW0gUGxheWluZ1N0YXRlIHtcclxuICAgIERJU0FCTEVEID0gXCJkaXNhYmxlZFwiLFxyXG4gICAgUEFVU0VEID0gXCJwYXVzZWRcIixcclxuICAgIFBMQVlJTkcgPSBcInBsYXlpbmdcIixcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBlbGVtZW50Py5nZXRBdHRyaWJ1dGUocHJvY2Vzc2VkQXR0cikgPT09IHByb2Nlc3NlZEF0dHJWYWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcmtQcm9jZXNzZWQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgZWxlbWVudD8uc2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIsIHByb2Nlc3NlZEF0dHJWYWwpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udHJvbEdyb3VwIHtcclxuICAgIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWVyOiBWaWRlb1BsYXllcjtcclxuICAgIHBsYXlCdXR0b25FbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICByYWRpb0J1dHRvbjogSFRNTEVsZW1lbnQ7XHJcbiAgICB0b29sdGlwRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBjb21wb25lbnRzT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBwbGF5QnV0dG9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICB2b2x1bWVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBWaWRlb1BsYXllciwgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBjb250cm9sR3JvdXBFbGVtO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlci5vYnNlcnZlKHRoaXMuY29udHJvbEdyb3VwRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvLyBDaGVjayBmb3IgbmV3IFBsYXkvQXVkaW8gYnV0dG9uIGFuZCB2b2x1bWUgc2xpZGVyIFxyXG4gICAgICAgIGNvbnN0IHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHBsYXlCdXR0b25BdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW0pO1xyXG4gICAgICAgIGNvbnN0IHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3Rvcih2b2x1bWVTbGlkZXJBdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtKTtcclxuICAgICAgICAvLyBBZGQgdGhlIHJhZGlvIGJ1dHRvbiBpZiBub3QgZXhpc3RzXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAvLyBwbGF5IGJ1dHRvbiBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCFwbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMucGxheUJ1dHRvbkVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXlCdXR0b25FbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMucGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnMgaWYgYSB2aWRlbyBzdGFydHMgdG8gcGxheS5cclxuICAgICAgICAvLyBUaGlzIGlzIG5lY2VzYXNyeSBmb3IgYSBjYXNlIHdoZW4gdXNlciBicm93c2VzIHRvIGEgbm9uLWNoYW5uZWwgcGFnZSAoZS5nLiBtYWluLCBlc3BvcnRzKVxyXG4gICAgICAgIC8vIHdoaWNoIGF1dG9tYXRpY2FsbHkgcGxheXMgYSB2aWRlby5cclxuICAgICAgICB0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlbygpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXlCdXR0b25FbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlQXVkaW9Gb3JWaWRlbygpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gXCJwbGF5aW5nXCIpIHsgIC8vIFZpZGVvIHN0YXRlIGZyb20gcGF1c2VkIHRvIHBsYXlpbmdcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucGF1c2VBbGwoKTsgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFZvbHVtZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXllci5hdWRpb0VsZW0gJiYgdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IHRoaXMudm9sdW1lU2xpZGVyRWxlbS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYXVkaW9FbGVtLnZvbHVtZSA9IHBhcnNlRmxvYXQodm9sdW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICAvLyB2b2x1bWUgc2xpZGVyIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodm9sdW1lU2xpZGVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IHZvbHVtZVNsaWRlckVsZW07XHJcbiAgICAgICAgLy8gTXV0YXRpb25PYnNlcnZlciB0byB2b2x1bWVTbGlkZXJcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5hZGp1c3RWb2x1bWUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlci5vYnNlcnZlKHRoaXMudm9sdW1lU2xpZGVyRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCkge1xyXG4gICAgICAgIC8vIERvbid0IHByb2NlZWQgdW5sZXNzIGJvdGggcGxheUJ1dHRvbkVsZW0gYW5kIHZvbHVtZVNsaWRlckVsZW0gYXJlIGF2YWlsYWJsZVxyXG4gICAgICAgIGlmKCF0aGlzLnBsYXlCdXR0b25FbGVtIHx8ICF0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB3YXMgYWxyZWFkeSBjcmVhdGVkLCBkbyBub3RoaW5nXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodGhpcy5yYWRpb0J1dHRvbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogVXNlIHdlYnBhY2sgaHRtbCBsb2FkZXJcclxuICAgICAgICBjb25zdCBidXR0b25XcmFwcGVyRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJ1dHRvbldyYXBwZXJEb20uaW5uZXJIVE1MID0gaW5pdGlhbEJ1dHRvbkRvbTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVwZGF0ZSByYWRpbyBidXR0b24gc3RhdGVcclxuICAgICAgICBjb25zdCBwbGF5aW5nU3RhdGUgPSB0aGlzLnBsYXllci5wbGF5aW5nU3RhdGU7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCB0aGlzLnBsYXllci5wbGF5aW5nU3RhdGUpO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24ub25jbGljayA9IHRoaXMucGxheWVyLm9uUmFkaW9CdXR0b25DbGlja2VkLmJpbmQodGhpcy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHctdG9vbHRpcFwiKT8uWzBdIGFzIEhUTUxFbGVtZW50OyAgXHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChwbGF5aW5nU3RhdGUpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0uYXBwZW5kQ2hpbGQoYnV0dG9uV3JhcHBlckRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yUGxheSgpIHtcclxuICAgICAgICAvLyBOT1RFOiBUaGVyZSBpcyAxfjMgc2Vjb25kcyBvZiBkZWxheSBiZXR3ZWVuIHJhZGlvLW1vZGUgYnV0dG9uIGNsaWNrIGFuZCBzb3VuZCBiZWluZyBwbGF5ZWQuXHJcbiAgICAgICAgLy8gSXQncyBiZXR0ZXIgdG8gc2hvdyBzb21lIGludGVybWVkaWF0ZSBzdGF0ZSAoaWNvbiBjaGFuZ2UsIG1vdXNlIGN1cnNvciBjaGFuZ2UsIGV0YykgaW4gdGhlIG1lYW53aGlsZVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uPy5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuUExBWUlORyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChQbGF5aW5nU3RhdGUuUExBWUlORyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yUGF1c2UoKSB7XHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QQVVTRUQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQoUGxheWluZ1N0YXRlLlBBVVNFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yRGlzYWJsZWQoKSB7XHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChQbGF5aW5nU3RhdGUuRElTQUJMRUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRvb2x0aXBUZXh0KG5ld1N0YXRlOiBQbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICBpZighdGhpcy50b29sdGlwRWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IFwiUmFkaW8gbW9kZVwiO1xyXG4gICAgICAgIGlmKG5ld1N0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgdGV4dCA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJSQURJT19NT0RFX0RJU0FCTEVEXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKG5ld1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBjaHJvbWUuaTE4bi5nZXRNZXNzYWdlKFwiUkFESU9fTU9ERV9TVEFSVFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihuZXdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHtcclxuICAgICAgICAgICAgdGV4dCA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJSQURJT19NT0RFX0VORFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJ1cGRhdGVUb29sdGlwVGV4dCBmb3Igc3RhdGUgXCIgKyBuZXdTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG9vbHRpcEVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAvLyBJcyB0aGlzIG5lY2Vzc2FyeT9cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY2xhc3MgVmlkZW9QbGF5ZXIge1xyXG4gICAgcGxheWVySWQ6IHN0cmluZztcclxuICAgIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXI7XHJcbiAgICBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXlpbmdTdGF0ZTogUGxheWluZ1N0YXRlO1xyXG4gICAgYXR0cmlidXRlT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBjb250cm9sR3JvdXA6IENvbnRyb2xHcm91cDtcclxuICAgIGNvbnRyb2xHcm91cE9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgaGxzOiBIbHM7XHJcbiAgICBhdWRpb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB2aWRlb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB2aWRlb0VsZW1PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGxheWVySWQ6IHN0cmluZywgY29udGFpbmVyOiBWaWRlb1BsYXllckNvbnRhaW5lciwgcGxheWVyRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtID0gcGxheWVyRWxlbTtcclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCkgPyBQbGF5aW5nU3RhdGUuUEFVU0VEIDogUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG5cclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cE9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5ZXJFbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKTtcclxuICAgICAgICB0aGlzLnRyeU9ic2VydmluZ1ZpZGVvRWxlbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCkge1xyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBjb250cm9sIGdyb3VwIERPTSBpcyByZWFkeVxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xHcm91cEVsZW0gPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjb250cm9sR3JvdXBDbGFzcyk/LlswXTtcclxuICAgICAgICBpZighY29udHJvbEdyb3VwRWxlbSkgeyAgLy8gY29udHJvbCBncm91cCBjYW5ub3QgYmUgZm91bmQgaW4gRE9NXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7ICAvLyBkZXN0cm95IHJlZmVyZW5jZSB0byB0aGUgcmVtb3ZlZCBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgcHJvY2Vzc2VkIGNsYXNzIG5hbWUgdG8gcHJldmVudCBkdXBsaWNhdGUgcHJvY2Vzc2luZyBvZiB0aGlzIGVsZW1lbnRcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQoY29udHJvbEdyb3VwRWxlbSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXAgPSBuZXcgQ29udHJvbEdyb3VwKHRoaXMsIGNvbnRyb2xHcm91cEVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeU9ic2VydmluZ1ZpZGVvRWxlbSgpIHtcclxuICAgICAgICBpZighdGhpcy52aWRlb0VsZW1PYnNlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjazogTXV0YXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09IFwic3JjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW1PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmlkZW9FbGVtID0gdGhpcy5wbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidmlkZW9cIik/LlswXTtcclxuICAgICAgICBpZighdmlkZW9FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW9FbGVtT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZCh2aWRlb0VsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52aWRlb0VsZW0gPSB2aWRlb0VsZW07XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh0aGlzLnZpZGVvRWxlbSk7XHJcbiAgICBcclxuICAgICAgICB0aGlzLnZpZGVvRWxlbU9ic2VydmVyLm9ic2VydmUodGhpcy52aWRlb0VsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7IFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVN0YXR1cygpIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKTtcclxuICAgICAgICBpZihjaGFubmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZW5hYmxlKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5wbGF5aW5nU3RhdGU7XHJcbiAgICAgICAgaWYoc3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlRnJvbURpc2FibGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JEaXNhYmxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkobWVkaWFVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlICE9PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFtZWRpYVVybCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTm8gbWVkaWFVcmwgaXMgZm91bmQgdG8gcGxheVwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmF1ZGlvRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiQXVkaW8gZWxlbWVudCBhbHJlYWR5IGV4aXN0c1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgc2VwYXJhdGUgPHZpZGVvPiBlbGVtZW50IHRvIHBsYXkgYXVkaW8uXHJcbiAgICAgICAgLy8gPGF1ZGlvPiBjYW4gYmUgYWxzbyB1c2VkIGJ5IGhscy5qcywgYnV0IFR5cGVzY3JpcHQgZm9yY2VzIHRoaXMgdG8gYmUgSFRNTFZpZGVvRWxlbWVudC5cclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IDxIVE1MVmlkZW9FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbS5jbGFzc0xpc3QuYWRkKFwibm9kaXNwbGF5XCIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXAucmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgXCJsb2FkaW5nXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnBsYXkoKS50aGVuKGF1ZGlvUGxheUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBMQVlJTkc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU3RvcCB0aGUgdmlkZW8gaWYgcGxheWluZ1xyXG4gICAgICAgIHRoaXMucGF1c2VWaWRlbygpO1xyXG4gICAgICAgIC8vdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUZyb21EaXNhYmxlZCgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheWluZ1N0YXRlO1xyXG4gICAgICAgIGlmKHN0YXRlICE9PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QQVVTRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBBVVNFRCB8fCBzdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5obHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcIkRPTUV4Y2VwdGlvbjogVGhlIHBsYXkoKSByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBieSBhIGNhbGwgdG8gcGF1c2UoKVwiXHJcbiAgICAgICAgICAgICAgICAvLyBpcyB0aHJvd24gd2hlbiB1c2VyIHBhdXNlcyB0aGUgYXVkaW8gdG9vIHF1aWNrbHkgYWZ0ZXIgcGxheWluZy5cclxuICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBpcyBuZWVkZWQuIFRoZSBhdWRpbyB3aWxsIGJlIHBhdXNlZCBjb3JyZWN0bHkgYW55d2F5LlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLnN0b3BMb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRldGFjaE1lZGlhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgLy8gVGhlcmUgc2VlbXMgdG8gYmUgYSBidWcgdGhhdCB0aGUgSExTIG9iamVjdCBnZXRzIHN0dWNrIGFmdGVyIG11bHRpcGxlIHBsYXlzIGFuZCBwYXVzZXNcclxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgcmUtdXNlZCBmb3IgdGhlIG5leHQgcGxheS4gTmVlZCB0byBkZXN0cm95IHRoZSBvYmplY3QgYW5kIHJlLWNyZWF0ZSBpdC5cclxuICAgICAgICAgICAgdGhpcy5obHMgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckVsZW0ucmVtb3ZlQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25QYXVzZSA9IGZ1bmN0aW9uKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdC5hdXRvcGxheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5VmlkZW8oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhdXRvcGxheSddLCBvblBhdXNlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlWaWRlbygpIHtcclxuICAgICAgICB0aGlzLnRvZ2dsZVZpZGVvU3RhdGVJZihcInBhdXNlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZVZpZGVvKCkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlVmlkZW9TdGF0ZUlmKFwicGxheWluZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVWaWRlb1N0YXRlSWYoZXhwZWN0ZWRTdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdmlkZW9QbGF5QnV0dG9uID0gdGhpcy5jb250cm9sR3JvdXA/LnBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIGNvbnN0IHZpZGVvU3RhdGUgPSB2aWRlb1BsYXlCdXR0b24/LmdldEF0dHJpYnV0ZSh2aWRlb1BsYXllclN0YXRlQXR0cik7XHJcbiAgICAgICAgaWYodmlkZW9TdGF0ZSA9PT0gZXhwZWN0ZWRTdGF0ZSkge1xyXG4gICAgICAgICAgICB2aWRlb1BsYXlCdXR0b24uY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnNcclxuICAgIHBhdXNlQWxsKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaGF0IGVsc2UgdG8gZG8gaGVyZT9cclxuICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RQbGF5KCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpO1xyXG4gICAgICAgIGlmKCFjaGFubmVsKSB7XHJcbiAgICAgICAgICAgIC8vIEN1cnJlbnRseSBpbiBhIG5vbi1jaGFubmVsIHBhZ2UuIERpc2FibGUgXHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXNwb25zZUNhbGxiYWNrID0gYXN5bmMgZnVuY3Rpb24ocmVzcG9uc2U6IEdldFVybHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZighcmVzcG9uc2U/LndlYlVybD8uY2hhbm5lbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5IGluIGEgbm9uLWNoYW5uZWwgcGFnZS4gRGlzYWJsZSBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWxpc3QgPSBhd2FpdCB0cnlGZXRjaGluZ1BsYXlsaXN0KHJlc3BvbnNlLndlYlVybCk7XHJcbiAgICAgICAgICAgIGlmKCFwbGF5bGlzdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gT2ZmbGluZSBvciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbC4gRGlzYWJsZSBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGF1ZGlvU3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwocGxheWxpc3QpO1xyXG4gICAgICAgICAgICBpZihhdWRpb1N0cmVhbVVybCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQodGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoYXVkaW9TdHJlYW1VcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxyXG4gICAgICAgICAgICB7bWVzc2FnZTogXCJnZXRfYXVkaW9fdXJsXCIsIGNoYW5uZWw6IGNoYW5uZWx9LCByZXNwb25zZUNhbGxiYWNrLmJpbmQodGhpcykpOyBcclxuICAgIH1cclxuXHJcbiAgICBvblJhZGlvQnV0dG9uQ2xpY2tlZCgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJDb250YWluZXIge1xyXG4gICAgcGxheWVyczogVmlkZW9QbGF5ZXJbXTtcclxuICAgIG5leHRJZDogbnVtYmVyO1xyXG4gICAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAxMDAwMTsgIC8vIFJhbmRvbSBzdGFydCBpbmRleCBmb3IgcGxheWVyLlxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvLyBGaW5kIGV4aXN0aW5nIHZpZGVvIHBsYXllciBlbGVtZW50cyB0byBjcmVhdGUgVmlkZW9QbGF5ZXIgb2JqZWN0c1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgLy8gRGV0ZWN0IGZ1dHVyZSB2aWRlbyBwbGF5ZXIgZWxlbWVudHNcclxuICAgICAgICBjb25zdCBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibWFpblwiKVswXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKG1haW5FbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIC8vIFRPRE86IElzIGl0IGJldHRlciB0byBpdGVyYXRlIG9ubHkgdGhlIG11dGF0ZWQgZGl2cz9cclxuICAgICAgICBjb25zdCBwbGF5ZXJFbGVtcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh2aWRlb1BsYXllckNsYXNzKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpdiBpcyBub3QgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgaWYoIWlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTmV3IHZpZGVvIHBsYXllciBkZXRlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBuZWVkIHRvIHByb2NlZWQgaWYgdGhlcmUgYXJlIHRoZSBzYW1lIG51bWJlciBvZiBwbGF5ZXJzIGluIHRoZSBsaXN0IGFuZCBpbiBET00uXHJcbiAgICAgICAgaWYocGxheWVyRWxlbXMubGVuZ3RoID09PSB0aGlzLnBsYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FyYmFnZUNvbGxlY3RQbGF5ZXJzKHBsYXllckVsZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdmlkZW8gcGxheWVycyBub3QgaW4gRE9NIGFueW1vcmUuXHJcbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiBhIHVzZXIgYnJvd3NlcyBmcm9tIGEgbm9uLWNoYW5uZWwgcGFnZSAobWFpbiwgZGlyZWN0b3J5LCBldGMuKSB0byBhIGNoYW5uZWwgcGFnZSxcclxuICAgIC8vIG9yIGJldHdlZW4gbm9uLWNoYW5uZWwgcGFnZXMuXHJcbiAgICBnYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXM6IEhUTUxDb2xsZWN0aW9uT2Y8RWxlbWVudD4pIHtcclxuICAgICAgICBjb25zdCBhbGxQbGF5ZXJJZHNJbkRvbTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgYWxsUGxheWVySWRzSW5Eb20ucHVzaChwbGF5ZXJFbGVtLmdldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkFsbCBwbGF5ZXJJZHMgaW4gRE9NOiBcIiArIGFsbFBsYXllcklkc0luRG9tKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3bGlzdCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHBsYXllci5wbGF5ZXJJZDtcclxuICAgICAgICAgICAgaWYoYWxsUGxheWVySWRzSW5Eb20uaW5kZXhPZihwbGF5ZXJJZCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld2xpc3QucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgUGxheWVyICR7cGxheWVySWR9IGlzIG5vdCBpbiBET00gYW55bW9yZS4gRGVsZXRpbmcuLmApO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXdsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5ZXJFbGVtKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGxheWVySWQgPSB2aWRlb1BsYXllcklkUHJlZml4ICsgdGhpcy5uZXh0SWQ7XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgKz0gMTtcclxuICAgICAgICBwbGF5ZXJFbGVtLnNldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIsIG5ld1BsYXllcklkKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFZpZGVvUGxheWVyKG5ld1BsYXllcklkLCB0aGlzLCBwbGF5ZXJFbGVtKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlRXhjZXB0KHBsYXllcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgaWYocGxheWVyLnBsYXllcklkICE9PSBwbGF5ZXJJZCkgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaWxsIHRoaXMgZnVuY3Rpb24gZXZlciBiZSB1c2VkP1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIlxyXG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbnRhaW5lciB9IGZyb20gXCIuL3ZpZGVvX3BsYXllcl9jb250YWluZXJcIjtcclxuXHJcblxyXG52YXIgY29udGFpbmVyID0gbmV3IFZpZGVvUGxheWVyQ29udGFpbmVyKCk7XHJcbmNvbnRhaW5lci5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==