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
const videoPlayerInChannelAttr = "data-radio-mode-in-channel";
const videoPlayerIsLiveAttr = "data-radio-mode-is-live";
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
            text = "Radio mode can only be used in live stream in streamer's channel";
        }
        else if (newState === "paused" /* PAUSED */) {
            text = "Start Radio mode";
        }
        else if (newState === "playing" /* PLAYING */) {
            text = "End Radio mode";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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SyxFQUFFLENBQUM7U0FDbkQ7SUFDTCxDQUFDO0lBRUQsT0FBTzs7UUFDSCxVQUFJLENBQUMsUUFBUSwwQ0FBRSxVQUFVLEdBQUc7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7Q0FDSjs7O0FDbnJCK0Q7QUFHaEUsSUFBSSx1QkFBUyxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztBQUMzQyx1QkFBUyxDQUFDLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6ImNvbnRlbnRzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG4iLCJcclxuY29uc3QgdHdpdGNoRG9tYWluIDogc3RyaW5nID0gXCJ0d2l0Y2gudHYvXCI7XHJcbi8vIE5vbi1leGh1YXN0aXZlIGxpc3Qgb2Ygbm9uLWNoYW5uZWwgcm91dGVzIGluIHR3aXRjaC50dlxyXG5jb25zdCBub25DaGFubmVscyA6IHN0cmluZ1tdID0gW1xyXG4gICAgXCJcIiwgXCJkaXJlY3RvcnlcIiwgXCJ2aWRlb3NcIiwgXCJ1XCIsIFwic2V0dGluZ3NcIiwgXCJmcmllbmRzXCIsIFwic3Vic2NyaXB0aW9uc1wiLCBcImludmVudG9yeVwiLCBcIndhbGxldFwiXTtcclxuXHJcbmNvbnN0IGFwaURvbWFpbiA6IHN0cmluZyA9IFwiYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvXCI7XHJcbmNvbnN0IGFjY2Vzc1Rva2VuIDogc3RyaW5nID0gXCIvYWNjZXNzX3Rva2VuXCI7XHJcblxyXG5jb25zdCB1c2hlckRvbWFpbiA6IHN0cmluZyA9IFwidXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy9cIjtcclxuY29uc3QgdXNoZXJFeHQgOiBzdHJpbmcgPSBcIi5tM3U4XCI7XHJcblxyXG5cclxuLy8gRXh0cmFjdCBhdWRpb19vbmx5IHN0cmVhbSAubTN1OCBmcm9tIHRoZSBtYXN0ZXIgcGxheWxpc3QgY29udGVudC5cclxuLy8gUmV0dXJucyB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIGEgVVJMIGFmdGVyIGF1ZGlvX29ubHkgbWV0YWRhdGEuXHJcbi8vIFRPRE86IFRoaXMgd29ya3MsIGJ1dCBldmVudHVhbGx5IHdlIHdpbGwgbmVlZCB0byBmdWxseSBwYXJzZSB0aGUgY29udGVudFxyXG4vLyBhbmQgZ2V0IGF1ZGlvX29ubHkgc3RyZWFtIHVybFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBpZighY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBhdWRpb09ubHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgZm9yKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgaWYgKGxpbmUuaW5jbHVkZXMoXCJhdWRpb19vbmx5XCIpKSBhdWRpb09ubHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGF1ZGlvT25seUZvdW5kICYmIGxpbmUuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tV2ViVXJsKCkgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcclxuICAgIGNvbnN0IHNwbGl0ZWQgPSB1cmwucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgY29uc3QgZmlsdGVyZWQgPSBzcGxpdGVkLmZpbHRlcihlbGVtID0+IGVsZW0ubGVuZ3RoID4gMCk7XHJcbiAgICBjb25zb2xlLmRlYnVnKGBGaWx0ZXJlZDogJHtmaWx0ZXJlZH0sIHVybDogJHt1cmwuaHJlZn1gKTtcclxuICAgIGlmKGZpbHRlcmVkLmxlbmd0aCAhPSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgY29uc3QgY2hhbm5lbCA9IGZpbHRlcmVkWzBdO1xyXG4gICAgLy8gRmlsdGVyIG91dCBzb21lIG5vbi1jaGFubmVsIHBhZ2VzIHdpdGggc2ltaWxhciBVUkwgcGF0dGVybiBhcyBjaGFubmVsIHBhZ2VzXHJcbiAgICBpZiAobm9uQ2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKSAhPSAtMSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Ub2tlblVybChhY2Nlc3NUb2tlblVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKGFjY2Vzc1Rva2VuVXJsLCBhcGlEb21haW4sIGFjY2Vzc1Rva2VuKTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCBhY2Nlc3MgdG9rZW46IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXNoZXJVcmwsIHVzaGVyRG9tYWluLCB1c2hlckV4dCk7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgdXNoZXI6IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbi8vIEdldCBjaGFubmVsIGJldHdlZW4gdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBzdGFydFN0ciBhbmQgdGhlIGZpcnN0IGVuZFN0ciBhZnRlciBzdGFydFN0ci5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhcclxuICAgICAgICB1cmw6IHN0cmluZywgc3RhcnRTdHI6IHN0cmluZywgZW5kU3RyOiBzdHJpbmcsIGVuZE9wdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIDogc3RyaW5nIHtcclxuICAgIGxldCBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc3RhcnRTdHIpO1xyXG4gICAgaWYoc3RhcnRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHN0YXJ0SW5kZXggKz0gc3RhcnRTdHIubGVuZ3RoO1xyXG5cclxuICAgIGxldCBlbmRJbmRleCA9IHVybC5pbmRleE9mKGVuZFN0ciwgc3RhcnRJbmRleCArIDEpO1xyXG4gICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgaWYoZW5kT3B0aW9uYWwpIGVuZEluZGV4ID0gdXJsLmxlbmd0aDtcclxuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG59XHJcblxyXG5cclxuLy8gVE9ETzogSW5zdGVhZCBvZiBwcmUtZGVmaW5lZCB1cmwgZm9ybWF0LCB1c2UgcmVjZW50bHkgdXNlZCBvbnQgaW4gVHdpdGNoIHdlYlxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcsIHNpZzogc3RyaW5nKSA6IFVzaGVyVXJsIHtcclxuICAgIGNvbnN0IHVzaGVyVXJsID0gbmV3IFVzaGVyVXJsKGBodHRwczovL3VzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvJHtjaGFubmVsfS5tM3U4YCk7XHJcbiAgICB1c2hlclVybC51cGRhdGUodG9rZW4sIHNpZyk7XHJcblxyXG4gICAgLy8gSXQgaXMgbm90IGNsZWFyIGlmIGFsbCBvZiB0aGVzZSBwYXJhbXMgYXJlIHJlcXVpcmVkIG9yIGlmIHRoZXJlIGFyZSBhbnkgbWlzc2luZyBvbmVzLlxyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJwbGF5ZXJcIiwgXCJ0d2l0Y2h3ZWJcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcImFsbG93X3NvdXJjZVwiLCBcInRydWVcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInR5cGVcIiwgXCJhbnlcIik7XHJcbiAgICBcclxuICAgIHJldHVybiB1c2hlclVybDtcclxufVxyXG5cclxuXHJcbi8vIEludGVyZmFjZSB0byBjb21tdW5pY2F0ZSBiZXR3ZWVuIGJhY2tncm91bmQgYW5kIGNvbnRlbnRzY3JpcHRcclxuLy8gdG8gcmVxdWVzdC9yZXNwb25kIGFjY2VzcyB0b2tlbiBVUkwgYW5kIHVzaGVyIFVSTCBmb3IgYSBjaGFubmVsLlxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFVybHNSZXNwb25zZSB7XHJcbiAgICB3ZWJVcmw6IFVybEdyb3VwO1xyXG4gICAgbGFzdFJlcXVlc3RlZDogVXJsR3JvdXA7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFVybEdyb3VwIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmc7XHJcbiAgICB1c2hlclVybDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy8gQ2xhc3MgdG8gc3RvcmUgYW5kIG1hbmlwdWxhdGUgdXNoZXIgVVJMLlxyXG5leHBvcnQgY2xhc3MgVXNoZXJVcmwge1xyXG4gICAgb3JpZ2luYWxVcmw6IHN0cmluZztcclxuICAgIHVybE9iamVjdDogVVJMO1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgZXhwaXJlc0F0OiBudW1iZXI7ICAvLyBUb2tlbiBleHBpcmF0aW9uIGRhdGV0aW1lIGluIGVwb2NoIHNlY29uZHNcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxVcmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3QgPSBuZXcgVVJMKHVybCk7XHJcbiAgICAgICAgdGhpcy5jaGFubmVsID0gdGhpcy5nZXRDaGFubmVsKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcImFsbG93X2F1ZGlvX29ubHlcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVuZXhwaXJlZFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHNTaW5jZUVwb2NoID0gTWF0aC5yb3VuZChub3cuZ2V0VGltZSgpIC8gMTAwMCk7XHJcbiAgICAgICAgLy8gNjAgc2Vjb25kcyBidWZmZXIgYmVmb3JlIHRva2VuIGV4cGlyYXRpb25cclxuICAgICAgICBpZihzZWNvbmRzU2luY2VFcG9jaCArIDYwIDwgdGhpcy5leHBpcmVzQXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VXJsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYENhY2hlZCBVUkwgZm9yICR7dGhpcy5jaGFubmVsfSBpcyBleHBpcmVkYCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVybE9iamVjdC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgodXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiP1wiKTtcclxuICAgICAgICBpZihlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFF1ZXJ5U3RyaW5nKGtleTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuZ2V0KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFF1ZXJ5U3RyaW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5zZXQobmFtZSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4cGlyZXNBdCgpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCB0b2tlblN0cmluZyA9IHRoaXMuZ2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAgICBpZighdG9rZW5TdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkpzb24gPSBKU09OLnBhcnNlKHRva2VuU3RyaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgZXhwaXJlc0F0ID0gdG9rZW5Kc29uLmV4cGlyZXMgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlc0F0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYENhbm5vdCBwYXJzZSB0b2tlbiBpbiB1c2hlciBVUkwuIEVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbm5lbCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh0aGlzLm9yaWdpbmFsVXJsKTtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3VG9rZW46IHN0cmluZywgbmV3U2lnOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIiwgbmV3VG9rZW4pO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJzaWdcIiwgbmV3U2lnKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwicFwiLCB0aGlzLmdldFJhbmRvbU51bWJlcigpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21OdW1iZXIoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IGJ1aWxkVXNoZXJVcmwsIHBhcnNlQXVkaW9Pbmx5VXJsLCBVcmxHcm91cCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaENvbnRlbnQodXJsOiBzdHJpbmcpIHtcclxuICAgIGlmKCF1cmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBzdGF0dXMgaWYgb2tcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICB9XHJcbiAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBmZXRjaENvbnRlbnQgdGhyZXcgYW4gZXJyb3I6ICR7ZXJyfWApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVybCk7XHJcbiAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BKc29uID0gSlNPTi5wYXJzZShyZXNwVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwSnNvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgY291bGQgbm90IGJlIHBhcnNlZCB0byBKU09OOiBcIiArIHJlc3BUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEF1ZGlvU3RyZWFtVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXNoZXJVcmwpO1xyXG4gICAgY29uc3Qgc3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudCk7XHJcbiAgICByZXR1cm4gc3RyZWFtVXJsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlblVybDogc3RyaW5nLCBsYXN0UmVxdWVzdGVkQ2hhbm5lbDogc3RyaW5nLFxyXG4gICAgICAgIGxhc3RSZXF1c3RlZFVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKHRva2VuVXJsKTtcclxuICAgIGlmKCFyZXNwSnNvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uLnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uLnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgY2hhbm5lbCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY2hhbm5lbCBvZiB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgdXJsXHJcbiAgICAvLyAoVGhpcyBpcyBwb3NzaWJsZSBpZiB0aGUgY2hhbm5lbCdzIHN0cmVhbWVyIGlzIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsKVxyXG4gICAgaWYobGFzdFJlcXVlc3RlZENoYW5uZWwgJiYgY2hhbm5lbCAhPT0gbGFzdFJlcXVlc3RlZENoYW5uZWwpIHtcclxuICAgICAgICBpZihsYXN0UmVxdXN0ZWRVc2hlclVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGFzdFJlcXVzdGVkVXNoZXJVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgc3RvcmUgaXRcclxuICAgICAgICBjb25zdCB1c2hlclVybCA9IGJ1aWxkVXNoZXJVcmwobGFzdFJlcXVlc3RlZENoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgICAgIHJldHVybiB1c2hlclVybC5nZXRVcmwoKTsgIFxyXG4gICAgfSAgXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cnlGZXRjaGluZ1BsYXlsaXN0KGdyb3VwOiBVcmxHcm91cCkgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgaWYoIWdyb3VwKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiBcclxuICAgIC8vIHNlZSBpZiB0aGUgZXhpc3RpbmcgdXNoZXIgdXJsIGNhbiBiZSB1c2VkXHJcbiAgICBpZihncm91cC51c2hlclVybCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KGdyb3VwLnVzaGVyVXJsKTtcclxuICAgICAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCFncm91cC5hY2Nlc3NUb2tlblVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKGdyb3VwLmFjY2Vzc1Rva2VuVXJsKTtcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24/LnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uPy5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV3VXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGdyb3VwLmNoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQobmV3VXNoZXJVcmwuZ2V0VXJsKCkpO1xyXG4gICAgcmV0dXJuIHJlc3BUZXh0O1xyXG59IiwiXHJcbmltcG9ydCB7IHRyeUZldGNoaW5nUGxheWxpc3QgfSBmcm9tIFwiLi9mZXRjaFwiO1xyXG5pbXBvcnQgeyBnZXRDaGFubmVsRnJvbVdlYlVybCwgR2V0VXJsc1Jlc3BvbnNlLCBwYXJzZUF1ZGlvT25seVVybCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIFRPRE86IEFueSBiZXR0ZXIgd2F5IHRoYW4gSFRNTCBhcyBzdHJpbmc/XHJcbmNvbnN0IGluaXRpYWxCdXR0b25Eb20gPSBgXHJcbjxkaXYgY2xhc3M9XCJ0dy1pbmxpbmUtZmxleCB0dy1yZWxhdGl2ZSB0dy10b29sdGlwLXdyYXBwZXIgcmFkaW8tbW9kZS1idXR0b24td3JhcHBlclwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cInJhZGlvLW1vZGUtYnV0dG9uIHR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1hbGlnbi1taWRkbGUgdHctYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1idXR0b24taWNvbiB0dy1idXR0b24taWNvbi0tb3ZlcmxheSB0dy1jb3JlLWJ1dHRvbiB0dy1jb3JlLWJ1dHRvbi0tb3ZlcmxheSB0dy1pbmxpbmUtZmxleCB0dy1pbnRlcmFjdGl2ZSB0dy1qdXN0aWZ5LWNvbnRlbnQtY2VudGVyIHR3LW92ZXJmbG93LWhpZGRlbiB0dy1yZWxhdGl2ZVwiXHJcbiAgICAgICAgICAgIGRhdGEtYS10YXJnZXQ9XCJyYWRpby1tb2RlLWJ1dHRvblwiXHJcbiAgICAgICAgICAgIGRhdGEtcmFkaW8tbW9kZS1zdGF0ZT1cImRpc2FibGVkXCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlJhZGlvIE1vZGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWZsZXggdHctZmxleC1ncm93LTBcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0dy1idXR0b24taWNvbl9faWNvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1pY29uLWRpdlwiIHN0eWxlPVwid2lkdGg6IDJyZW07IGhlaWdodDogMnJlbTtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8IS0tIEdvb2dsZSBNYXRlcmlhbCBEZXNpZ24gUmFkaW8gSWNvbi4gQXBhY2hlIExpY2Vuc2UgdjIuMCAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwidHctaWNvbl9fc3ZnXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD1cIm5vbmVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMy4yNCA2LjE1QzIuNTEgNi40MyAyIDcuMTcgMiA4djEyYzAgMS4xLjg5IDIgMiAyaDE2YzEuMTEgMCAyLS45IDItMlY4YzAtMS4xMS0uODktMi0yLTJIOC4zbDguMjYtMy4zNEwxNS44OCAxIDMuMjQgNi4xNXpNNyAyMGMtMS42NiAwLTMtMS4zNC0zLTNzMS4zNC0zIDMtMyAzIDEuMzQgMyAzLTEuMzQgMy0zIDN6bTEzLThoLTJ2LTJoLTJ2Mkg0VjhoMTZ2NHpcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8ZGl2IGNsYXNzPVwidHctdG9vbHRpcCB0dy10b29sdGlwLS1hbGlnbi1sZWZ0IHR3LXRvb2x0aXAtLXVwXCIgZGF0YS1hLXRhcmdldD1cInR3LXRvb2x0aXAtbGFiZWxcIiByb2xlPVwidG9vbHRpcFwiPlxyXG4gICAgICAgIFxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG4gICBcclxuY29uc3QgcHJvY2Vzc2VkQXR0ciA9IFwiZGF0YS1yYWRpby1tb2RlLXByb2Nlc3NlZFwiO1xyXG5jb25zdCBwcm9jZXNzZWRBdHRyVmFsID0gXCJwcm9jZXNzZWRcIlxyXG5cclxuY29uc3QgdmlkZW9QbGF5ZXJTdGF0ZUF0dHIgPSBcImRhdGEtYS1wbGF5ZXItc3RhdGVcIjtcclxuXHJcbmNvbnN0IHJhZGlvTW9kZVN0YXRlQXR0ciA9IFwiZGF0YS1yYWRpby1tb2RlLXN0YXRlXCI7XHJcbmNvbnN0IHBsYXllcklkQXR0ciA9IFwiZGF0YS1yYWRpby1tb2RlLXBsYXllci1pZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllckluQ2hhbm5lbEF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1pbi1jaGFubmVsXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVySXNMaXZlQXR0ciA9IFwiZGF0YS1yYWRpby1tb2RlLWlzLWxpdmVcIjtcclxuXHJcbmNvbnN0IHZpZGVvUGxheWVyQ2xhc3MgPSBcInZpZGVvLXBsYXllclwiO1xyXG5jb25zdCB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzID0gXCJ2aWRlby1wbGF5ZXItcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVySWRQcmVmaXggPSB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzICsgXCItXCI7XHJcbmNvbnN0IGNvbnRyb2xHcm91cENsYXNzID0gXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiO1xyXG5jb25zdCBwbGF5QnV0dG9uQXR0ciA9IFwiYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddXCI7XHJcbmNvbnN0IHZvbHVtZVNsaWRlckF0dHIgPSBcImlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ11cIjtcclxuXHJcbmNvbnN0IGF0dHJPYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiBmYWxzZSwgc3VidHJlZTogZmFsc2UgfTtcclxuY29uc3QgZG9tT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IGZhbHNlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTtcclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlIFZpZGVvUGxheWVyQ29udGFpbmVyLCBhZGQgTXV0YXRpb25PYnNlcnZlciB0byBcclxuICogMS4gZG9jdW1lbnQuYm9keSBjaGVja3MgZm9yIG9uZSBzdWJ0cmVlIGNoYW5nZVxyXG4gKiAgIDEtMi4gSWYgZGl2IHdpdGggY2xhc3MgXCJ2aWRlby1wbGF5ZXJcIiwgcHJvY2VzcyBpdC4gQ2hlY2sgIzJcclxuICogXHJcbiAqIDIuIENyZWF0ZSBWaWRlb1BsYXllciwgdmlkZW8tcGxheWVyIGNsYXNzIGRpdiBjaGVja3MgZm9yIDEgYXR0cmlidXRlIGNoYW5nZSwgMyBzdWJ0cmVlIGNoYW5nZXNcclxuICogICAyLTEuIGF0dHJpYnV0ZSBcImRhdGEtYS1wbGF5ZXItdHlwZVwiOiBcInNpdGVcIiwgXCJzaXRlX21pbmlcIiwgXCJjbGlwcy13YXRjaFwiLCBcImNoYW5uZWxfaG9tZV9jYXJvdXNlbFwiXHJcbiAqICAgICAyLTItMi4gQ2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIGlmIG5lY2Vzc2FyeVxyXG4gKiAgICAgMi0yLTMuIE1vZGU6IFR1cGxlIG9mIChsYXlvdXQsIHZpZGVvX3R5cGUpLlxyXG4gKiAgICAgICAyLTItMy0xLiBsYXlvdXQ6IFwic2l0ZVwiIHwgXCJzaXRlX21pbmlcIlxyXG4gKiAgICAgICAyLTItMy0yLiB2aWRlb190eXBlOiBcImxpdmVcIiwgXCJ2b2RcIiwgXCJjbGlwXCIuLiBhbmQgbW9yZT8/Pz8/XHJcbiAqICAgMi0yLiBzdWJ0cmVlIGRpdiB3aXRoIGNsYXNzIFwidm9kLXNlZWtiYXItdGltZS1sYWJlbHNcIiBhbmQgXCJzZWVrYmFyLWludGVyYWN0aW9uLWFyZWFcIlxyXG4gKiAgICAgMi0yLTEuIFRoaXMgb25seSBhcHBlYXJzIGluIFZPRCB3YXRjaFxyXG4gKiAgICAgMi0yLTIuIElmIGNyZWF0ZWQsIGNoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciB0byBWT0RcclxuICogICAgIDItMi0zLiBJZiByZW1vdmVkIChjaGFuZ2VkIGZyb20gVk9EIHRvIGxpdmUvY2xpcCksID8/Pz9cclxuICogICAyLTMuIGNoZWNrIGZvciBjb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIlxyXG4gKiAgICAgMi0zLTEuIElmIGNyZWF0ZWQsIGNoZWNrICMzIGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTMtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogICAyLTQuIGNoZWNrIGZvciBcInZpZGVvXCIgZWxlbWVudCBpbiB0aGUgcGxheWVyXHJcbiAqICAgICAyLTQtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzYgZm9yIGFjdGlvbnNcclxuICogICAgIDItNC0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiBcclxuICogMy4gQ29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCIgY2hlY2tzIGZvciBcclxuICogICAzLTEuIHN1YnRyZWUgYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddIGZvciB2aWRlbyBwbGF5L3BhdXNlIGJ1dHRvblxyXG4gKiAgICAgMy0xLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM0XHJcbiAqICAgICAzLTEtMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTIuIHN1YnRyZWUgaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXSBmb3Igdm9sdW1lIHNsaWRlclxyXG4gKiAgICAgMy0yLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM1XHJcbiAqICAgICAzLTItMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTMuIElmIGJvdGggY29tcG9uZW50cyBpbiAzLTEgYW5kIDMtMiBhcmUgcmVhZHk6XHJcbiAqICAgICAzLTMtMS4gQ3JlYXRlIHJhZGlvIG1vZGUgYnV0dG9uLCBhbmQgcHV0IE11dGF0aW9uT2JzZXJ2ZXIgKHNlZSAjNCBhbmQgIzUpXHJcbiAqICAgICAzLTMtMi4gSWYgYXQgbGVhc3Qgb25lIGNvbXBvbmVudCBpcyByZW1vdmVkIChzaXRlLT5zaXRlX21pbmkgY2hhbmdlLCBldGMpXHJcbiAqICAgICAgIDMtMy0yLTEuIGFsc28gcmVtb3ZlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBmcm9tIERPTVxyXG4gKiBcclxuICogNC4gVmlkZW8gcGxheS9wYXVzZSBidXR0b24gY2hlY2tzIGZvclxyXG4gKiAgIDQtMS4gQXR0cmlidXRlIGNoYW5nZSB2aWRlb1BsYXllclN0YXRlQXR0cjogXCJwbGF5aW5nXCIgb3IgXCJwYXVzZWRcIlxyXG4gKiAgICAgNC0xLTEuIElmIGF0dHJpYnV0ZSB2YWx1ZSBjaGFuZ2VkIHRvIFwicGxheWluZ1wiLCBzdG9wIGFsbCBhdWRpbyBpbiB0aGUgVmlkZW9QbGF5ZXJDb250YWluZXJcclxuICogXHJcbiAqIDUuIFZvbHVtZSBzbGlkZXIgY2hlY2tzIGZvclxyXG4gKiAgIDUtMS4gQXR0cmlidXRlIFwidmFsdWVcIiBjaGFuZ2U6IG51bWJlciBiZXR3ZWVuIDAgPD0gbnVtIDw9IDFcclxuICogICAgIDUtMS0xLiBJZiBjaGFuZ2UgaXMgZGV0ZWN0ZWQsIGFwcGx5IHRoZSBuZXcgdm9sdW1lIHRvIGF1ZGlvRWxlbS5cclxuICogXHJcbiAqIDYuIG9yaWdpbmFsIFwidmlkZW9cIiBlbGVtZW50IGluIHZpZGVvLXBsYXllciBjaGVja3MgZm9yXHJcbiAqICAgNi0xLiBBdHRyaWJ1dGUgXCJzcmNcIiBjaGFuZ2U6IG1lYW5zIHRoYXQgdGhlIHZpZGVvIHNvdXJjZSBjaGFuZ2VkIChsaWtlbHkgaG9zdGluZyBhbm90aGVyIHN0cmVhbWVyKVxyXG4gKiAgICAgNi0xLTEuIFJhZGlvIG1vZGUgYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZD8gUmUtY29uZmlndXJlZCB3aXRoIHRoZSBuZXcgc3RyZWFtZXIncyBVUkw/XHJcbiAqICAgIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb3cgdG8gZGV0ZWN0IHRoZSBjaGFubmVsIG9mIHRoZSBzdHJlYW0gYmVpbmcgcGxheWVkP1xyXG4gKiBHZXR0aW5nIGNoYW5uZWwgbmFtZSBmcm9tIFVSTCBoYXMgdGhlIGZvbGxsb3dpbmcgaXNzdWVzXHJcbiAqICgxKSBTdHJlYW1lciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbFxyXG4gKiAoMikgTWFpbiBwYWdlLiBDaGFubmVsIGNhbiBjaGFuZ2UgcXVpY2tseSBpbiB0aGUgY2Fyb3VzZWxcclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgS2VlcCB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgVVJMIGluIHRoZSB0YWIuIEd1ZXNzIHRoZSBjaGFubmVsIGZyb20gdGhlcmVcclxuICogKDIpIEZvciBcInNpdGVfbWluaVwiIHN0YXRlLCBzdG9yZSB0aGUgY2hhbm5lbCBuYW1lIGluIHZpZGVvIHBsYXllci5cclxuICogICAgIEluIHRoYXQgY2FzZSwgaXQgd2lsbCBiZSBwb3NzaWJsZSB0byByZXN1bWUgcGxheWluZyBpbiB0aGUgcmlnaHQgY2hhbm5lbC5cclxuICogKDMpIERpc2FibGUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGluIHRoZSBtYWluIHBhZ2VcclxuICogXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFkZCByYWRpbyBtb2RlIGJ1dHRvbiBpbiBzaXRlX21pbmk/XHJcbiAqIERvbid0IHN0b3JlIHRoZSBwbGF5c3RhdGUgaW4gRE9NOiBvbmx5IHN0b3JlIGl0IGluIFZpZGVvUGxheWVyIGNsYXNzIGFzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEVTcG9ydHMgcGFnZTogdmlkZW8gbWluaXBsYXllciBrZWVwcyBwbGF5aW5nIGV2ZW4gd2hlbiB0aGUgc2l0ZSBwbGF5ZXIgaW4gRXNwb3J0cyBwYWdlIGlzIGFsc28gYmVpbmcgcGxheWVkLlxyXG4gKiBTaG91bGQgdGhlIHJhZGlvIG1vZGUgZm9sbG93IHRoZSBzYW1lIGJlaGF2aW9yP1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBY2Nlc3MgdG9rZW4gdXJsIGhhcyBvYXV0aCBjb2RlLCB3aGljaCBpcyB1bmRlZmluZWQgaWYgdGhlIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICogTm90IHN1cmUgaG93IFR3aXRjaCByZXR1cm5zIGNvcnJlY3QgcmVzcG9uc2UgZm9yIGFub255bW91cyB1c2VyIHlldC5cclxuICogQ2FsbGluZyB0aGUgc2FtZSBhY2Nlc3MgdG9rZW4gVVJMIGZyb20gY29udGVudHNjcmlwdCByZXR1cm5zIGVycm9yLlxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBEaXNhYmxlIHRoZSBidXR0b24gd2hlbiB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqL1xyXG5cclxuY29uc3QgZW51bSBQbGF5aW5nU3RhdGUge1xyXG4gICAgRElTQUJMRUQgPSBcImRpc2FibGVkXCIsXHJcbiAgICBQQVVTRUQgPSBcInBhdXNlZFwiLFxyXG4gICAgUExBWUlORyA9IFwicGxheWluZ1wiLFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNQcm9jZXNzZWQoZWxlbWVudDogRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ/LmdldEF0dHJpYnV0ZShwcm9jZXNzZWRBdHRyKSA9PT0gcHJvY2Vzc2VkQXR0clZhbDtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFya1Byb2Nlc3NlZChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgICBlbGVtZW50Py5zZXRBdHRyaWJ1dGUocHJvY2Vzc2VkQXR0ciwgcHJvY2Vzc2VkQXR0clZhbCk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBDb250cm9sR3JvdXAge1xyXG4gICAgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwbGF5ZXI6IFZpZGVvUGxheWVyO1xyXG4gICAgcGxheUJ1dHRvbkVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgdm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHJhZGlvQnV0dG9uOiBIVE1MRWxlbWVudDtcclxuICAgIHRvb2x0aXBFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIGNvbXBvbmVudHNPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIHBsYXlCdXR0b25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIHZvbHVtZU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFZpZGVvUGxheWVyLCBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbSA9IGNvbnRyb2xHcm91cEVsZW07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMoKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyLm9ic2VydmUodGhpcy5jb250cm9sR3JvdXBFbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb21wb25lbnRzKCkge1xyXG4gICAgICAgIC8vIENoZWNrIGZvciBuZXcgUGxheS9BdWRpbyBidXR0b24gYW5kIHZvbHVtZSBzbGlkZXIgXHJcbiAgICAgICAgY29uc3QgcGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3IocGxheUJ1dHRvbkF0dHIpO1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbSk7XHJcbiAgICAgICAgY29uc3Qgdm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHZvbHVtZVNsaWRlckF0dHIpO1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW0pO1xyXG4gICAgICAgIC8vIEFkZCB0aGUgcmFkaW8gYnV0dG9uIGlmIG5vdCBleGlzdHNcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUmFkaW9CdXR0b24oKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCkge1xyXG4gICAgICAgIC8vIHBsYXkgYnV0dG9uIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy5wbGF5QnV0dG9uRWxlbS4gSWdub3JlLlxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHBsYXlCdXR0b25FbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQocGxheUJ1dHRvbkVsZW0pO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy5wbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBwbGF5QnV0dG9uRWxlbTtcclxuICAgICAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVycyBpZiBhIHZpZGVvIHN0YXJ0cyB0byBwbGF5LlxyXG4gICAgICAgIC8vIFRoaXMgaXMgbmVjZXNhc3J5IGZvciBhIGNhc2Ugd2hlbiB1c2VyIGJyb3dzZXMgdG8gYSBub24tY2hhbm5lbCBwYWdlIChlLmcuIG1haW4sIGVzcG9ydHMpXHJcbiAgICAgICAgLy8gd2hpY2ggYXV0b21hdGljYWxseSBwbGF5cyBhIHZpZGVvLlxyXG4gICAgICAgIHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlby5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheUJ1dHRvbkVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VBdWRpb0ZvclZpZGVvKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5wbGF5QnV0dG9uRWxlbS5nZXRBdHRyaWJ1dGUodmlkZW9QbGF5ZXJTdGF0ZUF0dHIpO1xyXG4gICAgICAgIGlmKHN0YXRlID09PSBcInBsYXlpbmdcIikgeyAgLy8gVmlkZW8gc3RhdGUgZnJvbSBwYXVzZWQgdG8gcGxheWluZ1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5wYXVzZUFsbCgpOyAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllciBpbnN0YW5jZXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0Vm9sdW1lKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWVyLmF1ZGlvRWxlbSAmJiB0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gdGhpcy52b2x1bWVTbGlkZXJFbGVtLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hdWRpb0VsZW0udm9sdW1lID0gcGFyc2VGbG9hdCh2b2x1bWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICAgIC8vIHZvbHVtZSBzbGlkZXIgY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighdm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnZvbHVtZVNsaWRlckVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZCh2b2x1bWVTbGlkZXJFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQodm9sdW1lU2xpZGVyRWxlbSk7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gdm9sdW1lU2xpZGVyRWxlbTtcclxuICAgICAgICAvLyBNdXRhdGlvbk9ic2VydmVyIHRvIHZvbHVtZVNsaWRlclxyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmFkanVzdFZvbHVtZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyLm9ic2VydmUodGhpcy52b2x1bWVTbGlkZXJFbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUmFkaW9CdXR0b24oKSB7XHJcbiAgICAgICAgLy8gRG9uJ3QgcHJvY2VlZCB1bmxlc3MgYm90aCBwbGF5QnV0dG9uRWxlbSBhbmQgdm9sdW1lU2xpZGVyRWxlbSBhcmUgYXZhaWxhYmxlXHJcbiAgICAgICAgaWYoIXRoaXMucGxheUJ1dHRvbkVsZW0gfHwgIXRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgYnV0dG9uIHdhcyBhbHJlYWR5IGNyZWF0ZWQsIGRvIG5vdGhpbmdcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZCh0aGlzLnJhZGlvQnV0dG9uKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBVc2Ugd2VicGFjayBodG1sIGxvYWRlclxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICAgICAgYnV0dG9uV3JhcHBlckRvbS5pbm5lckhUTUwgPSBpbml0aWFsQnV0dG9uRG9tO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBidXR0b25XcmFwcGVyRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdO1xyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQodGhpcy5yYWRpb0J1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVXBkYXRlIHJhZGlvIGJ1dHRvbiBzdGF0ZVxyXG4gICAgICAgIGNvbnN0IHBsYXlpbmdTdGF0ZSA9IHRoaXMucGxheWVyLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIHRoaXMucGxheWVyLnBsYXlpbmdTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5vbmNsaWNrID0gdGhpcy5wbGF5ZXIub25SYWRpb0J1dHRvbkNsaWNrZWQuYmluZCh0aGlzLnBsYXllcik7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbHRpcEVsZW0gPSBidXR0b25XcmFwcGVyRG9tLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0dy10b29sdGlwXCIpPy5bMF0gYXMgSFRNTEVsZW1lbnQ7ICBcclxuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXBUZXh0KHBsYXlpbmdTdGF0ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbS5hcHBlbmRDaGlsZChidXR0b25XcmFwcGVyRG9tKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQbGF5KCkge1xyXG4gICAgICAgIC8vIE5PVEU6IFRoZXJlIGlzIDF+MyBzZWNvbmRzIG9mIGRlbGF5IGJldHdlZW4gcmFkaW8tbW9kZSBidXR0b24gY2xpY2sgYW5kIHNvdW5kIGJlaW5nIHBsYXllZC5cclxuICAgICAgICAvLyBJdCdzIGJldHRlciB0byBzaG93IHNvbWUgaW50ZXJtZWRpYXRlIHN0YXRlIChpY29uIGNoYW5nZSwgbW91c2UgY3Vyc29yIGNoYW5nZSwgZXRjKSBpbiB0aGUgbWVhbndoaWxlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QTEFZSU5HKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXBUZXh0KFBsYXlpbmdTdGF0ZS5QTEFZSU5HKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQYXVzZSgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbj8uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLlBBVVNFRCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChQbGF5aW5nU3RhdGUuUEFVU0VEKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JEaXNhYmxlZCgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbj8uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLkRJU0FCTEVEKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXBUZXh0KFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVG9vbHRpcFRleHQobmV3U3RhdGU6IFBsYXlpbmdTdGF0ZSkge1xyXG4gICAgICAgIGlmKCF0aGlzLnRvb2x0aXBFbGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZXh0ID0gXCJSYWRpbyBtb2RlXCI7XHJcbiAgICAgICAgaWYobmV3U3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gXCJSYWRpbyBtb2RlIGNhbiBvbmx5IGJlIHVzZWQgaW4gbGl2ZSBzdHJlYW0gaW4gc3RyZWFtZXIncyBjaGFubmVsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYobmV3U3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QQVVTRUQpIHtcclxuICAgICAgICAgICAgdGV4dCA9IFwiU3RhcnQgUmFkaW8gbW9kZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKG5ld1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0ZXh0ID0gXCJFbmQgUmFkaW8gbW9kZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcInVwZGF0ZVRvb2x0aXBUZXh0IGZvciBzdGF0ZSBcIiArIG5ld1N0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50b29sdGlwRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIC8vIElzIHRoaXMgbmVjZXNzYXJ5P1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcEVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBWaWRlb1BsYXllciB7XHJcbiAgICBwbGF5ZXJJZDogc3RyaW5nO1xyXG4gICAgY29udGFpbmVyOiBWaWRlb1BsYXllckNvbnRhaW5lcjtcclxuICAgIHBsYXllckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWluZ1N0YXRlOiBQbGF5aW5nU3RhdGU7XHJcbiAgICBhdHRyaWJ1dGVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGNvbnRyb2xHcm91cDogQ29udHJvbEdyb3VwO1xyXG4gICAgY29udHJvbEdyb3VwT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBobHM6IEhscztcclxuICAgIGF1ZGlvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuICAgIHZpZGVvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuICAgIHZpZGVvRWxlbU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJZDogc3RyaW5nLCBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyLCBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0gPSBwbGF5ZXJFbGVtO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKSA/IFBsYXlpbmdTdGF0ZS5QQVVTRUQgOiBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcblxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXllckVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpO1xyXG4gICAgICAgIHRoaXMudHJ5T2JzZXJ2aW5nVmlkZW9FbGVtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKGNvbnRyb2xHcm91cEVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5T2JzZXJ2aW5nVmlkZW9FbGVtKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLnZpZGVvRWxlbU9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrOiBNdXRhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24obXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT0gXCJzcmNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2aWRlb0VsZW0gPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2aWRlb1wiKT8uWzBdO1xyXG4gICAgICAgIGlmKCF2aWRlb0VsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW1PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHZpZGVvRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IHZpZGVvRWxlbTtcclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHRoaXMudmlkZW9FbGVtKTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMudmlkZW9FbGVtT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZpZGVvRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTsgXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdHVzKCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpO1xyXG4gICAgICAgIGlmKGNoYW5uZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbmFibGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2VGcm9tRGlzYWJsZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvckRpc2FibGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheShtZWRpYVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5QQVVTRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSA8dmlkZW8+IGVsZW1lbnQgdG8gcGxheSBhdWRpby5cclxuICAgICAgICAvLyA8YXVkaW8+IGNhbiBiZSBhbHNvIHVzZWQgYnkgaGxzLmpzLCBidXQgVHlwZXNjcmlwdCBmb3JjZXMgdGhpcyB0byBiZSBIVE1MVmlkZW9FbGVtZW50LlxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtID0gPEhUTUxWaWRlb0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLmNsYXNzTGlzdC5hZGQoXCJub2Rpc3BsYXlcIik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmFkanVzdFZvbHVtZSgpOyAgLy8gTWF0Y2ggdGhlIGluaXRpYWwgdm9sdW1lIHdpdGggdGhlIHNsaWRlciB2YWx1ZS5cclxuICAgICAgICB0aGlzLnBsYXllckVsZW0uYXBwZW5kQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgIHRoaXMuaGxzID0gbmV3IEhscyh7XHJcbiAgICAgICAgICAgIC8vZGVidWc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpdmVTeW5jRHVyYXRpb246IDAsXHJcbiAgICAgICAgICAgIGxpdmVNYXhMYXRlbmN5RHVyYXRpb246IDUsXHJcbiAgICAgICAgICAgIGxpdmVEdXJhdGlvbkluZmluaXR5OiB0cnVlICAvLyB0cnVlIGZvciBsaXZlIHN0cmVhbVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGxzLmxvYWRTb3VyY2UobWVkaWFVcmwpO1xyXG4gICAgICAgIHRoaXMuaGxzLmF0dGFjaE1lZGlhKHRoaXMuYXVkaW9FbGVtKTsgXHJcbiAgICAgICAgLy8gVE9ETzogSXMgdGhpcyBzYWZlIHRvIHBsYXkgcmlnaHQgYXdheSBhZnRlciBhdHRhY2hpbmcgdGhlIG1lZGlhP1xyXG4gICAgICAgIC8vIFRoZSBtYWluIGV4YW1wbGUgYXQgaGxzLmpzIHdlYnNpdGUgdGVsbHMgdG8gdXNlIE1BTklGRVNUX1BBUlNFRCBldmVudCxcclxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIHRoZSBldmVudCBpcyBub3QgdHJpZ2dlcmVkIHdpdGggdHlwZXNjcmlwdCt3ZWJwYWNrLlxyXG4gICAgICAgIGNvbnN0IGF1ZGlvUGxheUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheSBzdGFydGVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cC5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBcImxvYWRpbmdcIik7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGxheSgpLnRoZW4oYXVkaW9QbGF5Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdG9wIHRoZSB2aWRlbyBpZiBwbGF5aW5nXHJcbiAgICAgICAgdGhpcy5wYXVzZVZpZGVvKCk7XHJcbiAgICAgICAgLy90aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlRnJvbURpc2FibGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5wbGF5aW5nU3RhdGU7XHJcbiAgICAgICAgaWYoc3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZSgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheWluZ1N0YXRlO1xyXG4gICAgICAgIGlmKHN0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEIHx8IHN0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmhscykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFwiRE9NRXhjZXB0aW9uOiBUaGUgcGxheSgpIHJlcXVlc3Qgd2FzIGludGVycnVwdGVkIGJ5IGEgY2FsbCB0byBwYXVzZSgpXCJcclxuICAgICAgICAgICAgICAgIC8vIGlzIHRocm93biB3aGVuIHVzZXIgcGF1c2VzIHRoZSBhdWRpbyB0b28gcXVpY2tseSBhZnRlciBwbGF5aW5nLlxyXG4gICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIGlzIG5lZWRlZC4gVGhlIGF1ZGlvIHdpbGwgYmUgcGF1c2VkIGNvcnJlY3RseSBhbnl3YXkuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5obHMuc3RvcExvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGV0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyB0aGF0IHRoZSBITFMgb2JqZWN0IGdldHMgc3R1Y2sgYWZ0ZXIgbXVsdGlwbGUgcGxheXMgYW5kIHBhdXNlc1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyByZS11c2VkIGZvciB0aGUgbmV4dCBwbGF5LiBOZWVkIHRvIGRlc3Ryb3kgdGhlIG9iamVjdCBhbmQgcmUtY3JlYXRlIGl0LlxyXG4gICAgICAgICAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyRWxlbS5yZW1vdmVDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQYXVzZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBvblBhdXNlID0gZnVuY3Rpb24ocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYocmVzdWx0LmF1dG9wbGF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlWaWRlbygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ2F1dG9wbGF5J10sIG9uUGF1c2UuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVZpZGVvKCkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlVmlkZW9TdGF0ZUlmKFwicGF1c2VkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlVmlkZW8oKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVWaWRlb1N0YXRlSWYoXCJwbGF5aW5nXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVZpZGVvU3RhdGVJZihleHBlY3RlZFN0YXRlOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2aWRlb1BsYXlCdXR0b24gPSB0aGlzLmNvbnRyb2xHcm91cD8ucGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZSA9IHZpZGVvUGxheUJ1dHRvbj8uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZih2aWRlb1N0YXRlID09PSBleHBlY3RlZFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZpZGVvUGxheUJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyc1xyXG4gICAgcGF1c2VBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdoYXQgZWxzZSB0byBkbyBoZXJlP1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFBsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgaWYoIWNoYW5uZWwpIHtcclxuICAgICAgICAgICAgLy8gQ3VycmVudGx5IGluIGEgbm9uLWNoYW5uZWwgcGFnZS4gRGlzYWJsZSBcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2FsbGJhY2sgPSBhc3luYyBmdW5jdGlvbihyZXNwb25zZTogR2V0VXJsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmKCFyZXNwb25zZT8ud2ViVXJsPy5jaGFubmVsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50bHkgaW4gYSBub24tY2hhbm5lbCBwYWdlLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwbGF5bGlzdCA9IGF3YWl0IHRyeUZldGNoaW5nUGxheWxpc3QocmVzcG9uc2Uud2ViVXJsKTtcclxuICAgICAgICAgICAgaWYoIXBsYXlsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPZmZsaW5lIG9yIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYXVkaW9TdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChwbGF5bGlzdCk7XHJcbiAgICAgICAgICAgIGlmKGF1ZGlvU3RyZWFtVXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdCh0aGlzLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheShhdWRpb1N0cmVhbVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHttZXNzYWdlOiBcImdldF9hdWRpb191cmxcIiwgY2hhbm5lbDogY2hhbm5lbH0sIHJlc3BvbnNlQ2FsbGJhY2suYmluZCh0aGlzKSk7IFxyXG4gICAgfVxyXG5cclxuICAgIG9uUmFkaW9CdXR0b25DbGlja2VkKCkge1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnBsYXlpbmdTdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QQVVTRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RQbGF5KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUExBWUlORzpcclxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBWaWRlb1BsYXllckNvbnRhaW5lciB7XHJcbiAgICBwbGF5ZXJzOiBWaWRlb1BsYXllcltdO1xyXG4gICAgbmV4dElkOiBudW1iZXI7XHJcbiAgICBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLm5leHRJZCA9IDEwMDAxOyAgLy8gUmFuZG9tIHN0YXJ0IGluZGV4IGZvciBwbGF5ZXIuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIC8vIEZpbmQgZXhpc3RpbmcgdmlkZW8gcGxheWVyIGVsZW1lbnRzIHRvIGNyZWF0ZSBWaWRlb1BsYXllciBvYmplY3RzXHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QoKTtcclxuICAgICAgICAvLyBEZXRlY3QgZnV0dXJlIHZpZGVvIHBsYXllciBlbGVtZW50c1xyXG4gICAgICAgIGNvbnN0IG1haW5FbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJtYWluXCIpWzBdO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnVwZGF0ZVZpZGVvUGxheWVyTGlzdC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUobWFpbkVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWaWRlb1BsYXllckxpc3QoKSB7XHJcbiAgICAgICAgLy8gVE9ETzogSXMgaXQgYmV0dGVyIHRvIGl0ZXJhdGUgb25seSB0aGUgbXV0YXRlZCBkaXZzP1xyXG4gICAgICAgIGNvbnN0IHBsYXllckVsZW1zID0gZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHZpZGVvUGxheWVyQ2xhc3MpO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGl2IGlzIG5vdCBhbHJlYWR5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBpZighaXNQcm9jZXNzZWQocGxheWVyRWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJOZXcgdmlkZW8gcGxheWVyIGRldGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gcHJvY2VlZCBpZiB0aGVyZSBhcmUgdGhlIHNhbWUgbnVtYmVyIG9mIHBsYXllcnMgaW4gdGhlIGxpc3QgYW5kIGluIERPTS5cclxuICAgICAgICBpZihwbGF5ZXJFbGVtcy5sZW5ndGggPT09IHRoaXMucGxheWVycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB2aWRlbyBwbGF5ZXJzIG5vdCBpbiBET00gYW55bW9yZS5cclxuICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIGEgdXNlciBicm93c2VzIGZyb20gYSBub24tY2hhbm5lbCBwYWdlIChtYWluLCBkaXJlY3RvcnksIGV0Yy4pIHRvIGEgY2hhbm5lbCBwYWdlLFxyXG4gICAgLy8gb3IgYmV0d2VlbiBub24tY2hhbm5lbCBwYWdlcy5cclxuICAgIGdhcmJhZ2VDb2xsZWN0UGxheWVycyhwbGF5ZXJFbGVtczogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50Pikge1xyXG4gICAgICAgIGNvbnN0IGFsbFBsYXllcklkc0luRG9tOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICBhbGxQbGF5ZXJJZHNJbkRvbS5wdXNoKHBsYXllckVsZW0uZ2V0QXR0cmlidXRlKHBsYXllcklkQXR0cikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiQWxsIHBsYXllcklkcyBpbiBET006IFwiICsgYWxsUGxheWVySWRzSW5Eb20pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdsaXN0ID0gW107XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gcGxheWVyLnBsYXllcklkO1xyXG4gICAgICAgICAgICBpZihhbGxQbGF5ZXJJZHNJbkRvbS5pbmRleE9mKHBsYXllcklkKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3bGlzdC5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBQbGF5ZXIgJHtwbGF5ZXJJZH0gaXMgbm90IGluIERPTSBhbnltb3JlLiBEZWxldGluZy4uYCk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ld2xpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQocGxheWVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXllckVsZW0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQbGF5ZXJJZCA9IHZpZGVvUGxheWVySWRQcmVmaXggKyB0aGlzLm5leHRJZDtcclxuICAgICAgICB0aGlzLm5leHRJZCArPSAxO1xyXG4gICAgICAgIHBsYXllckVsZW0uc2V0QXR0cmlidXRlKHBsYXllcklkQXR0ciwgbmV3UGxheWVySWQpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIobmV3UGxheWVySWQsIHRoaXMsIHBsYXllckVsZW0pO1xyXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VFeGNlcHQocGxheWVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIucGxheWVySWQgIT09IHBsYXllcklkKSBwbGF5ZXIucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdpbGwgdGhpcyBmdW5jdGlvbiBldmVyIGJlIHVzZWQ/XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuIiwiXHJcbmltcG9ydCB7IFZpZGVvUGxheWVyQ29udGFpbmVyIH0gZnJvbSBcIi4vdmlkZW9fcGxheWVyX2NvbnRhaW5lclwiO1xyXG5cclxuXHJcbnZhciBjb250YWluZXIgPSBuZXcgVmlkZW9QbGF5ZXJDb250YWluZXIoKTtcclxuY29udGFpbmVyLnJ1bigpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9