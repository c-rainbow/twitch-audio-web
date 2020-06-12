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
        Radio mode
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
        var _a, _b, _c, _d;
        // Check if the control group DOM is ready
        const controlGroupElem = (_a = this.playerElem.getElementsByClassName(controlGroupClass)) === null || _a === void 0 ? void 0 : _a[0];
        if (!controlGroupElem) { // control group cannot be found in DOM
            (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.destroy(); // destroy reference to the removed DOM
            this.controlGroup = null;
            return;
        }
        this.overlayButton = (_c = this.playerElem.querySelectorAll("button[data-a-target='player-overlay-play-button']")) === null || _c === void 0 ? void 0 : _c[0];
        if (this.overlayButton && this.playingState == "playing" /* PLAYING */) {
            this.overlayButton.classList.add("nodisplay");
            this.overlayButton.classList.remove("tw-block");
        }
        // Add processed class name to prevent duplicate processing of this element
        if (isProcessed(controlGroupElem)) {
            return;
        }
        markProcessed(controlGroupElem);
        (_d = this.controlGroup) === null || _d === void 0 ? void 0 : _d.destroy();
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
        if (this.videoElem) {
            this.videoElem.classList.add("nodisplay");
            //this.imageElem?.removeAttribute("style");
        }
        if (this.overlayButton) {
            this.overlayButton.classList.add("nodisplay");
            this.overlayButton.classList.remove("tw-block");
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
        if (this.videoElem) {
            this.videoElem.classList.remove("nodisplay");
            //this.imageElem.style.display = "none";
        }
        if (this.overlayButton) {
            this.overlayButton.classList.remove("nodisplay");
            this.overlayButton.classList.add("tw-block");
        }
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
        const playerElems = document.getElementsByClassName(videoPlayerClass);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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VUFBVSxHQUFHO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLEtBQUksSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQ0o7OztBQzFzQitEO0FBR2hFLElBQUksdUJBQVMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFDM0MsdUJBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwiXHJcbmNvbnN0IHR3aXRjaERvbWFpbiA6IHN0cmluZyA9IFwidHdpdGNoLnR2L1wiO1xyXG4vLyBOb24tZXhodWFzdGl2ZSBsaXN0IG9mIG5vbi1jaGFubmVsIHJvdXRlcyBpbiB0d2l0Y2gudHZcclxuY29uc3Qgbm9uQ2hhbm5lbHMgOiBzdHJpbmdbXSA9IFtcclxuICAgIFwiXCIsIFwiZGlyZWN0b3J5XCIsIFwidmlkZW9zXCIsIFwidVwiLCBcInNldHRpbmdzXCIsIFwiZnJpZW5kc1wiLCBcInN1YnNjcmlwdGlvbnNcIiwgXCJpbnZlbnRvcnlcIiwgXCJ3YWxsZXRcIl07XHJcblxyXG5jb25zdCBhcGlEb21haW4gOiBzdHJpbmcgPSBcImFwaS50d2l0Y2gudHYvYXBpL2NoYW5uZWxzL1wiO1xyXG5jb25zdCBhY2Nlc3NUb2tlbiA6IHN0cmluZyA9IFwiL2FjY2Vzc190b2tlblwiO1xyXG5cclxuY29uc3QgdXNoZXJEb21haW4gOiBzdHJpbmcgPSBcInVzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvXCI7XHJcbmNvbnN0IHVzaGVyRXh0IDogc3RyaW5nID0gXCIubTN1OFwiO1xyXG5cclxuXHJcbi8vIEV4dHJhY3QgYXVkaW9fb25seSBzdHJlYW0gLm0zdTggZnJvbSB0aGUgbWFzdGVyIHBsYXlsaXN0IGNvbnRlbnQuXHJcbi8vIFJldHVybnMgdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBhIFVSTCBhZnRlciBhdWRpb19vbmx5IG1ldGFkYXRhLlxyXG4vLyBUT0RPOiBUaGlzIHdvcmtzLCBidXQgZXZlbnR1YWxseSB3ZSB3aWxsIG5lZWQgdG8gZnVsbHkgcGFyc2UgdGhlIGNvbnRlbnRcclxuLy8gYW5kIGdldCBhdWRpb19vbmx5IHN0cmVhbSB1cmxcclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQ6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgaWYoIWNvbnRlbnQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICBsZXQgYXVkaW9Pbmx5Rm91bmQgPSBmYWxzZTtcclxuICAgIGZvcihsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwiYXVkaW9fb25seVwiKSkgYXVkaW9Pbmx5Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChhdWRpb09ubHlGb3VuZCAmJiBsaW5lLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVdlYlVybCgpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XHJcbiAgICBjb25zdCBzcGxpdGVkID0gdXJsLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IGZpbHRlcmVkID0gc3BsaXRlZC5maWx0ZXIoZWxlbSA9PiBlbGVtLmxlbmd0aCA+IDApO1xyXG4gICAgY29uc29sZS5kZWJ1ZyhgRmlsdGVyZWQ6ICR7ZmlsdGVyZWR9LCB1cmw6ICR7dXJsLmhyZWZ9YCk7XHJcbiAgICBpZihmaWx0ZXJlZC5sZW5ndGggIT0gMSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSAgIFxyXG5cclxuICAgIGNvbnN0IGNoYW5uZWwgPSBmaWx0ZXJlZFswXTtcclxuICAgIC8vIEZpbHRlciBvdXQgc29tZSBub24tY2hhbm5lbCBwYWdlcyB3aXRoIHNpbWlsYXIgVVJMIHBhdHRlcm4gYXMgY2hhbm5lbCBwYWdlc1xyXG4gICAgaWYgKG5vbkNoYW5uZWxzLmluZGV4T2YoY2hhbm5lbCkgIT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVG9rZW5VcmwoYWNjZXNzVG9rZW5Vcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhhY2Nlc3NUb2tlblVybCwgYXBpRG9tYWluLCBhY2Nlc3NUb2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgYWNjZXNzIHRva2VuOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh1c2hlclVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVzaGVyVXJsLCB1c2hlckRvbWFpbiwgdXNoZXJFeHQpO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIHVzaGVyOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG4vLyBHZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2Ygc3RhcnRTdHIgYW5kIHRoZSBmaXJzdCBlbmRTdHIgYWZ0ZXIgc3RhcnRTdHIuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lQmV0d2VlblN0cmluZ3MoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsIHN0YXJ0U3RyOiBzdHJpbmcsIGVuZFN0cjogc3RyaW5nLCBlbmRPcHRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSA6IHN0cmluZyB7XHJcbiAgICBsZXQgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHN0YXJ0U3RyKTtcclxuICAgIGlmKHN0YXJ0SW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBzdGFydEluZGV4ICs9IHN0YXJ0U3RyLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihlbmRTdHIsIHN0YXJ0SW5kZXggKyAxKTtcclxuICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIGlmKGVuZE9wdGlvbmFsKSBlbmRJbmRleCA9IHVybC5sZW5ndGg7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxufVxyXG5cclxuXHJcbi8vIFRPRE86IEluc3RlYWQgb2YgcHJlLWRlZmluZWQgdXJsIGZvcm1hdCwgdXNlIHJlY2VudGx5IHVzZWQgb250IGluIFR3aXRjaCB3ZWJcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nLCBzaWc6IHN0cmluZykgOiBVc2hlclVybCB7XHJcbiAgICBjb25zdCB1c2hlclVybCA9IG5ldyBVc2hlclVybChgaHR0cHM6Ly91c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzLyR7Y2hhbm5lbH0ubTN1OGApO1xyXG4gICAgdXNoZXJVcmwudXBkYXRlKHRva2VuLCBzaWcpO1xyXG5cclxuICAgIC8vIEl0IGlzIG5vdCBjbGVhciBpZiBhbGwgb2YgdGhlc2UgcGFyYW1zIGFyZSByZXF1aXJlZCBvciBpZiB0aGVyZSBhcmUgYW55IG1pc3Npbmcgb25lcy5cclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwicGxheWVyXCIsIFwidHdpdGNod2ViXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19zb3VyY2VcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJ0eXBlXCIsIFwiYW55XCIpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdXNoZXJVcmw7XHJcbn1cclxuXHJcblxyXG4vLyBJbnRlcmZhY2UgdG8gY29tbXVuaWNhdGUgYmV0d2VlbiBiYWNrZ3JvdW5kIGFuZCBjb250ZW50c2NyaXB0XHJcbi8vIHRvIHJlcXVlc3QvcmVzcG9uZCBhY2Nlc3MgdG9rZW4gVVJMIGFuZCB1c2hlciBVUkwgZm9yIGEgY2hhbm5lbC5cclxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmxzUmVzcG9uc2Uge1xyXG4gICAgd2ViVXJsOiBVcmxHcm91cDtcclxuICAgIGxhc3RSZXF1ZXN0ZWQ6IFVybEdyb3VwO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVcmxHcm91cCB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBhY2Nlc3NUb2tlblVybDogc3RyaW5nO1xyXG4gICAgdXNoZXJVcmw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8vIENsYXNzIHRvIHN0b3JlIGFuZCBtYW5pcHVsYXRlIHVzaGVyIFVSTC5cclxuZXhwb3J0IGNsYXNzIFVzaGVyVXJsIHtcclxuICAgIG9yaWdpbmFsVXJsOiBzdHJpbmc7XHJcbiAgICB1cmxPYmplY3Q6IFVSTDtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGV4cGlyZXNBdDogbnVtYmVyOyAgLy8gVG9rZW4gZXhwaXJhdGlvbiBkYXRldGltZSBpbiBlcG9jaCBzZWNvbmRzXHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuZ2V0Q2hhbm5lbCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19hdWRpb19vbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVbmV4cGlyZWRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRzU2luY2VFcG9jaCA9IE1hdGgucm91bmQobm93LmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgICAgIC8vIDYwIHNlY29uZHMgYnVmZmVyIGJlZm9yZSB0b2tlbiBleHBpcmF0aW9uXHJcbiAgICAgICAgaWYoc2Vjb25kc1NpbmNlRXBvY2ggKyA2MCA8IHRoaXMuZXhwaXJlc0F0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVybCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBDYWNoZWQgVVJMIGZvciAke3RoaXMuY2hhbm5lbH0gaXMgZXhwaXJlZGApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cmxPYmplY3QudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRRdWVyeVN0cmluZyhrZXk6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldChrZXkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWVyeVN0cmluZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuc2V0KG5hbWUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeHBpcmVzQXQoKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5TdHJpbmcgPSB0aGlzLmdldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIik7XHJcbiAgICAgICAgaWYoIXRva2VuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW5Kc29uID0gSlNPTi5wYXJzZSh0b2tlblN0cmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2VuSnNvbi5leHBpcmVzIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXNBdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgcGFyc2UgdG9rZW4gaW4gdXNoZXIgVVJMLiBFcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYW5uZWwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwodGhpcy5vcmlnaW5hbFVybCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld1Rva2VuOiBzdHJpbmcsIG5ld1NpZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInRva2VuXCIsIG5ld1Rva2VuKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwic2lnXCIsIG5ld1NpZyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInBcIiwgdGhpcy5nZXRSYW5kb21OdW1iZXIoKS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tTnVtYmVyKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgeyBidWlsZFVzaGVyVXJsLCBwYXJzZUF1ZGlvT25seVVybCwgVXJsR3JvdXAgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb250ZW50KHVybDogc3RyaW5nKSB7XHJcbiAgICBpZighdXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgc3RhdHVzIGlmIG9rXHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgZmV0Y2hDb250ZW50IHRocmV3IGFuIGVycm9yOiAke2Vycn1gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hKc29uKHVybDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudCh1cmwpO1xyXG4gICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwSnNvbiA9IEpTT04ucGFyc2UocmVzcFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcEpzb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGNvdWxkIG5vdCBiZSBwYXJzZWQgdG8gSlNPTjogXCIgKyByZXNwVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdWRpb1N0cmVhbVVybCh1c2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVzaGVyVXJsKTtcclxuICAgIGNvbnN0IHN0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQpO1xyXG4gICAgcmV0dXJuIHN0cmVhbVVybDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW5Vcmw6IHN0cmluZywgbGFzdFJlcXVlc3RlZENoYW5uZWw6IHN0cmluZyxcclxuICAgICAgICBsYXN0UmVxdXN0ZWRVc2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbih0b2tlblVybCk7XHJcbiAgICBpZighcmVzcEpzb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbi50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbi5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYW5uZWwgaXMgZGlmZmVyZW50IGZyb20gdGhlIGNoYW5uZWwgb2YgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIHVybFxyXG4gICAgLy8gKFRoaXMgaXMgcG9zc2libGUgaWYgdGhlIGNoYW5uZWwncyBzdHJlYW1lciBpcyBob3N0aW5nIGFub3RoZXIgY2hhbm5lbClcclxuICAgIGlmKGxhc3RSZXF1ZXN0ZWRDaGFubmVsICYmIGNoYW5uZWwgIT09IGxhc3RSZXF1ZXN0ZWRDaGFubmVsKSB7XHJcbiAgICAgICAgaWYobGFzdFJlcXVzdGVkVXNoZXJVcmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXF1c3RlZFVzaGVyVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIHN0b3JlIGl0XHJcbiAgICAgICAgY29uc3QgdXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGxhc3RSZXF1ZXN0ZWRDaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgICAgICByZXR1cm4gdXNoZXJVcmwuZ2V0VXJsKCk7ICBcclxuICAgIH0gIFxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJ5RmV0Y2hpbmdQbGF5bGlzdChncm91cDogVXJsR3JvdXApIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmKCFncm91cCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gXHJcbiAgICAvLyBzZWUgaWYgdGhlIGV4aXN0aW5nIHVzaGVyIHVybCBjYW4gYmUgdXNlZFxyXG4gICAgaWYoZ3JvdXAudXNoZXJVcmwpIHtcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChncm91cC51c2hlclVybCk7XHJcbiAgICAgICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZighZ3JvdXAuYWNjZXNzVG9rZW5VcmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbihncm91cC5hY2Nlc3NUb2tlblVybCk7XHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uPy50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbj8uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ld1VzaGVyVXJsID0gYnVpbGRVc2hlclVybChncm91cC5jaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KG5ld1VzaGVyVXJsLmdldFVybCgpKTtcclxuICAgIHJldHVybiByZXNwVGV4dDtcclxufSIsIlxyXG5pbXBvcnQgeyB0cnlGZXRjaGluZ1BsYXlsaXN0IH0gZnJvbSBcIi4vZmV0Y2hcIjtcclxuaW1wb3J0IHsgZ2V0Q2hhbm5lbEZyb21XZWJVcmwsIEdldFVybHNSZXNwb25zZSwgcGFyc2VBdWRpb09ubHlVcmwgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBBbnkgYmV0dGVyIHdheSB0aGFuIEhUTUwgYXMgc3RyaW5nP1xyXG5jb25zdCBpbml0aWFsQnV0dG9uRG9tID0gYFxyXG48ZGl2IGNsYXNzPVwidHctaW5saW5lLWZsZXggdHctcmVsYXRpdmUgdHctdG9vbHRpcC13cmFwcGVyIHJhZGlvLW1vZGUtYnV0dG9uLXdyYXBwZXJcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJyYWRpby1tb2RlLWJ1dHRvbiB0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctYWxpZ24tbWlkZGxlIHR3LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYnV0dG9uLWljb24gdHctYnV0dG9uLWljb24tLW92ZXJsYXkgdHctY29yZS1idXR0b24gdHctY29yZS1idXR0b24tLW92ZXJsYXkgdHctaW5saW5lLWZsZXggdHctaW50ZXJhY3RpdmUgdHctanVzdGlmeS1jb250ZW50LWNlbnRlciB0dy1vdmVyZmxvdy1oaWRkZW4gdHctcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICBkYXRhLWEtdGFyZ2V0PVwicmFkaW8tbW9kZS1idXR0b25cIlxyXG4gICAgICAgICAgICBkYXRhLXJhZGlvLW1vZGUtc3RhdGU9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJSYWRpbyBNb2RlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1mbGV4IHR3LWZsZXgtZ3Jvdy0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHctYnV0dG9uLWljb25fX2ljb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taWNvbi1kaXZcIiBzdHlsZT1cIndpZHRoOiAycmVtOyBoZWlnaHQ6IDJyZW07XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBHb29nbGUgTWF0ZXJpYWwgRGVzaWduIFJhZGlvIEljb24uIEFwYWNoZSBMaWNlbnNlIHYyLjAgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3LWljb25fX3N2Z1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMuMjQgNi4xNUMyLjUxIDYuNDMgMiA3LjE3IDIgOHYxMmMwIDEuMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uOSAyLTJWOGMwLTEuMTEtLjg5LTItMi0ySDguM2w4LjI2LTMuMzRMMTUuODggMSAzLjI0IDYuMTV6TTcgMjBjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0xMy04aC0ydi0yaC0ydjJINFY4aDE2djR6XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGRpdiBjbGFzcz1cInR3LXRvb2x0aXAgdHctdG9vbHRpcC0tYWxpZ24tbGVmdCB0dy10b29sdGlwLS11cFwiIGRhdGEtYS10YXJnZXQ9XCJ0dy10b29sdGlwLWxhYmVsXCIgcm9sZT1cInRvb2x0aXBcIj5cclxuICAgICAgICBSYWRpbyBtb2RlXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5jb25zdCBwcm9jZXNzZWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHByb2Nlc3NlZEF0dHJWYWwgPSBcInByb2Nlc3NlZFwiXHJcblxyXG5jb25zdCB2aWRlb1BsYXllclN0YXRlQXR0ciA9IFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiO1xyXG5cclxuY29uc3QgcmFkaW9Nb2RlU3RhdGVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtc3RhdGVcIjtcclxuY29uc3QgcGxheWVySWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcGxheWVyLWlkXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklkUHJlZml4ID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCBhdHRyT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcbmNvbnN0IGRvbU9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBWaWRlb1BsYXllckNvbnRhaW5lciwgYWRkIE11dGF0aW9uT2JzZXJ2ZXIgdG8gXHJcbiAqIDEuIGRvY3VtZW50LmJvZHkgY2hlY2tzIGZvciBvbmUgc3VidHJlZSBjaGFuZ2VcclxuICogICAxLTIuIElmIGRpdiB3aXRoIGNsYXNzIFwidmlkZW8tcGxheWVyXCIsIHByb2Nlc3MgaXQuIENoZWNrICMyXHJcbiAqIFxyXG4gKiAyLiBDcmVhdGUgVmlkZW9QbGF5ZXIsIHZpZGVvLXBsYXllciBjbGFzcyBkaXYgY2hlY2tzIGZvciAxIGF0dHJpYnV0ZSBjaGFuZ2UsIDMgc3VidHJlZSBjaGFuZ2VzXHJcbiAqICAgMi0xLiBhdHRyaWJ1dGUgXCJkYXRhLWEtcGxheWVyLXR5cGVcIjogXCJzaXRlXCIsIFwic2l0ZV9taW5pXCIsIFwiY2xpcHMtd2F0Y2hcIiwgXCJjaGFubmVsX2hvbWVfY2Fyb3VzZWxcIlxyXG4gKiAgICAgMi0yLTIuIENoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciBpZiBuZWNlc3NhcnlcclxuICogICAgIDItMi0zLiBNb2RlOiBUdXBsZSBvZiAobGF5b3V0LCB2aWRlb190eXBlKS5cclxuICogICAgICAgMi0yLTMtMS4gbGF5b3V0OiBcInNpdGVcIiB8IFwic2l0ZV9taW5pXCJcclxuICogICAgICAgMi0yLTMtMi4gdmlkZW9fdHlwZTogXCJsaXZlXCIsIFwidm9kXCIsIFwiY2xpcFwiLi4gYW5kIG1vcmU/Pz8/P1xyXG4gKiAgIDItMi4gc3VidHJlZSBkaXYgd2l0aCBjbGFzcyBcInZvZC1zZWVrYmFyLXRpbWUtbGFiZWxzXCIgYW5kIFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCJcclxuICogICAgIDItMi0xLiBUaGlzIG9ubHkgYXBwZWFycyBpbiBWT0Qgd2F0Y2hcclxuICogICAgIDItMi0yLiBJZiBjcmVhdGVkLCBjaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgdG8gVk9EXHJcbiAqICAgICAyLTItMy4gSWYgcmVtb3ZlZCAoY2hhbmdlZCBmcm9tIFZPRCB0byBsaXZlL2NsaXApLCA/Pz8/XHJcbiAqICAgMi0zLiBjaGVjayBmb3IgY29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCJcclxuICogICAgIDItMy0xLiBJZiBjcmVhdGVkLCBjaGVjayAjMyBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi0zLTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqICAgMi00LiBjaGVjayBmb3IgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdGhlIHBsYXllclxyXG4gKiAgICAgMi00LTEuIElmIGNyZWF0ZWQsIGNoZWNrICM2IGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTQtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogXHJcbiAqIDMuIENvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiIGNoZWNrcyBmb3IgXHJcbiAqICAgMy0xLiBzdWJ0cmVlIGJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXSBmb3IgdmlkZW8gcGxheS9wYXVzZSBidXR0b25cclxuICogICAgIDMtMS0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNFxyXG4gKiAgICAgMy0xLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0yLiBzdWJ0cmVlIGlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ10gZm9yIHZvbHVtZSBzbGlkZXJcclxuICogICAgIDMtMi0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNVxyXG4gKiAgICAgMy0yLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0zLiBJZiBib3RoIGNvbXBvbmVudHMgaW4gMy0xIGFuZCAzLTIgYXJlIHJlYWR5OlxyXG4gKiAgICAgMy0zLTEuIENyZWF0ZSByYWRpbyBtb2RlIGJ1dHRvbiwgYW5kIHB1dCBNdXRhdGlvbk9ic2VydmVyIChzZWUgIzQgYW5kICM1KVxyXG4gKiAgICAgMy0zLTIuIElmIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgaXMgcmVtb3ZlZCAoc2l0ZS0+c2l0ZV9taW5pIGNoYW5nZSwgZXRjKVxyXG4gKiAgICAgICAzLTMtMi0xLiBhbHNvIHJlbW92ZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gZnJvbSBET01cclxuICogXHJcbiAqIDQuIFZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uIGNoZWNrcyBmb3JcclxuICogICA0LTEuIEF0dHJpYnV0ZSBjaGFuZ2UgdmlkZW9QbGF5ZXJTdGF0ZUF0dHI6IFwicGxheWluZ1wiIG9yIFwicGF1c2VkXCJcclxuICogICAgIDQtMS0xLiBJZiBhdHRyaWJ1dGUgdmFsdWUgY2hhbmdlZCB0byBcInBsYXlpbmdcIiwgc3RvcCBhbGwgYXVkaW8gaW4gdGhlIFZpZGVvUGxheWVyQ29udGFpbmVyXHJcbiAqIFxyXG4gKiA1LiBWb2x1bWUgc2xpZGVyIGNoZWNrcyBmb3JcclxuICogICA1LTEuIEF0dHJpYnV0ZSBcInZhbHVlXCIgY2hhbmdlOiBudW1iZXIgYmV0d2VlbiAwIDw9IG51bSA8PSAxXHJcbiAqICAgICA1LTEtMS4gSWYgY2hhbmdlIGlzIGRldGVjdGVkLCBhcHBseSB0aGUgbmV3IHZvbHVtZSB0byBhdWRpb0VsZW0uXHJcbiAqIFxyXG4gKiA2LiBvcmlnaW5hbCBcInZpZGVvXCIgZWxlbWVudCBpbiB2aWRlby1wbGF5ZXIgY2hlY2tzIGZvclxyXG4gKiAgIDYtMS4gQXR0cmlidXRlIFwic3JjXCIgY2hhbmdlOiBtZWFucyB0aGF0IHRoZSB2aWRlbyBzb3VyY2UgY2hhbmdlZCAobGlrZWx5IGhvc3RpbmcgYW5vdGhlciBzdHJlYW1lcilcclxuICogICAgIDYtMS0xLiBSYWRpbyBtb2RlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQ/IFJlLWNvbmZpZ3VyZWQgd2l0aCB0aGUgbmV3IHN0cmVhbWVyJ3MgVVJMP1xyXG4gKiAgICBcclxuICovXHJcblxyXG4vKipcclxuICogSG93IHRvIGRldGVjdCB0aGUgY2hhbm5lbCBvZiB0aGUgc3RyZWFtIGJlaW5nIHBsYXllZD9cclxuICogR2V0dGluZyBjaGFubmVsIG5hbWUgZnJvbSBVUkwgaGFzIHRoZSBmb2xsbG93aW5nIGlzc3Vlc1xyXG4gKiAoMSkgU3RyZWFtZXIgaG9zdGluZyBhbm90aGVyIGNoYW5uZWxcclxuICogKDIpIE1haW4gcGFnZS4gQ2hhbm5lbCBjYW4gY2hhbmdlIHF1aWNrbHkgaW4gdGhlIGNhcm91c2VsXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIEtlZXAgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBpbiB0aGUgdGFiLiBHdWVzcyB0aGUgY2hhbm5lbCBmcm9tIHRoZXJlXHJcbiAqICgyKSBGb3IgXCJzaXRlX21pbmlcIiBzdGF0ZSwgc3RvcmUgdGhlIGNoYW5uZWwgbmFtZSBpbiB2aWRlbyBwbGF5ZXIuXHJcbiAqICAgICBJbiB0aGF0IGNhc2UsIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gcmVzdW1lIHBsYXlpbmcgaW4gdGhlIHJpZ2h0IGNoYW5uZWwuXHJcbiAqICgzKSBEaXNhYmxlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBpbiB0aGUgbWFpbiBwYWdlXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgcmFkaW8gbW9kZSBidXR0b24gaW4gc2l0ZV9taW5pP1xyXG4gKiBEb24ndCBzdG9yZSB0aGUgcGxheXN0YXRlIGluIERPTTogb25seSBzdG9yZSBpdCBpbiBWaWRlb1BsYXllciBjbGFzcyBhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFU3BvcnRzIHBhZ2U6IHZpZGVvIG1pbmlwbGF5ZXIga2VlcHMgcGxheWluZyBldmVuIHdoZW4gdGhlIHNpdGUgcGxheWVyIGluIEVzcG9ydHMgcGFnZSBpcyBhbHNvIGJlaW5nIHBsYXllZC5cclxuICogU2hvdWxkIHRoZSByYWRpbyBtb2RlIGZvbGxvdyB0aGUgc2FtZSBiZWhhdmlvcj9cclxuICovXHJcblxyXG4vKipcclxuICogQWNjZXNzIHRva2VuIHVybCBoYXMgb2F1dGggY29kZSwgd2hpY2ggaXMgdW5kZWZpbmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqIE5vdCBzdXJlIGhvdyBUd2l0Y2ggcmV0dXJucyBjb3JyZWN0IHJlc3BvbnNlIGZvciBhbm9ueW1vdXMgdXNlciB5ZXQuXHJcbiAqIENhbGxpbmcgdGhlIHNhbWUgYWNjZXNzIHRva2VuIFVSTCBmcm9tIGNvbnRlbnRzY3JpcHQgcmV0dXJucyBlcnJvci5cclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKi9cclxuXHJcbmNvbnN0IGVudW0gUGxheWluZ1N0YXRlIHtcclxuICAgIERJU0FCTEVEID0gXCJkaXNhYmxlZFwiLFxyXG4gICAgUEFVU0VEID0gXCJwYXVzZWRcIixcclxuICAgIFBMQVlJTkcgPSBcInBsYXlpbmdcIixcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBlbGVtZW50Py5nZXRBdHRyaWJ1dGUocHJvY2Vzc2VkQXR0cikgPT09IHByb2Nlc3NlZEF0dHJWYWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcmtQcm9jZXNzZWQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgZWxlbWVudD8uc2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIsIHByb2Nlc3NlZEF0dHJWYWwpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udHJvbEdyb3VwIHtcclxuICAgIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWVyOiBWaWRlb1BsYXllcjtcclxuICAgIHBsYXlCdXR0b25FbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICByYWRpb0J1dHRvbjogSFRNTEVsZW1lbnQ7XHJcbiAgICB0b29sdGlwRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBjb21wb25lbnRzT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBwbGF5QnV0dG9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICB2b2x1bWVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBWaWRlb1BsYXllciwgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBjb250cm9sR3JvdXBFbGVtO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlci5vYnNlcnZlKHRoaXMuY29udHJvbEdyb3VwRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvLyBDaGVjayBmb3IgbmV3IFBsYXkvQXVkaW8gYnV0dG9uIGFuZCB2b2x1bWUgc2xpZGVyIFxyXG4gICAgICAgIGNvbnN0IHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHBsYXlCdXR0b25BdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW0pO1xyXG4gICAgICAgIGNvbnN0IHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3Rvcih2b2x1bWVTbGlkZXJBdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtKTtcclxuICAgICAgICAvLyBBZGQgdGhlIHJhZGlvIGJ1dHRvbiBpZiBub3QgZXhpc3RzXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAvLyBwbGF5IGJ1dHRvbiBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCFwbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMucGxheUJ1dHRvbkVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXlCdXR0b25FbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMucGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnMgaWYgYSB2aWRlbyBzdGFydHMgdG8gcGxheS5cclxuICAgICAgICAvLyBUaGlzIGlzIG5lY2VzYXNyeSBmb3IgYSBjYXNlIHdoZW4gdXNlciBicm93c2VzIHRvIGEgbm9uLWNoYW5uZWwgcGFnZSAoZS5nLiBtYWluLCBlc3BvcnRzKVxyXG4gICAgICAgIC8vIHdoaWNoIGF1dG9tYXRpY2FsbHkgcGxheXMgYSB2aWRlby5cclxuICAgICAgICB0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlbygpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXlCdXR0b25FbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlQXVkaW9Gb3JWaWRlbygpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gXCJwbGF5aW5nXCIpIHsgIC8vIFZpZGVvIHN0YXRlIGZyb20gcGF1c2VkIHRvIHBsYXlpbmdcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucGF1c2VBbGwoKTsgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFZvbHVtZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXllci5hdWRpb0VsZW0gJiYgdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IHRoaXMudm9sdW1lU2xpZGVyRWxlbS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYXVkaW9FbGVtLnZvbHVtZSA9IHBhcnNlRmxvYXQodm9sdW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICAvLyB2b2x1bWUgc2xpZGVyIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodm9sdW1lU2xpZGVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IHZvbHVtZVNsaWRlckVsZW07XHJcbiAgICAgICAgLy8gTXV0YXRpb25PYnNlcnZlciB0byB2b2x1bWVTbGlkZXJcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5hZGp1c3RWb2x1bWUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlci5vYnNlcnZlKHRoaXMudm9sdW1lU2xpZGVyRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCkge1xyXG4gICAgICAgIC8vIERvbid0IHByb2NlZWQgdW5sZXNzIGJvdGggcGxheUJ1dHRvbkVsZW0gYW5kIHZvbHVtZVNsaWRlckVsZW0gYXJlIGF2YWlsYWJsZVxyXG4gICAgICAgIGlmKCF0aGlzLnBsYXlCdXR0b25FbGVtIHx8ICF0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB3YXMgYWxyZWFkeSBjcmVhdGVkLCBkbyBub3RoaW5nXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodGhpcy5yYWRpb0J1dHRvbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogVXNlIHdlYnBhY2sgaHRtbCBsb2FkZXJcclxuICAgICAgICBjb25zdCBidXR0b25XcmFwcGVyRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJ1dHRvbldyYXBwZXJEb20uaW5uZXJIVE1MID0gaW5pdGlhbEJ1dHRvbkRvbTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVwZGF0ZSByYWRpbyBidXR0b24gc3RhdGVcclxuICAgICAgICBjb25zdCBwbGF5aW5nU3RhdGUgPSB0aGlzLnBsYXllci5wbGF5aW5nU3RhdGU7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCB0aGlzLnBsYXllci5wbGF5aW5nU3RhdGUpO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24ub25jbGljayA9IHRoaXMucGxheWVyLm9uUmFkaW9CdXR0b25DbGlja2VkLmJpbmQodGhpcy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHctdG9vbHRpcFwiKT8uWzBdIGFzIEhUTUxFbGVtZW50OyAgXHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChwbGF5aW5nU3RhdGUpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0uYXBwZW5kQ2hpbGQoYnV0dG9uV3JhcHBlckRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yUGxheSgpIHtcclxuICAgICAgICAvLyBOT1RFOiBUaGVyZSBpcyAxfjMgc2Vjb25kcyBvZiBkZWxheSBiZXR3ZWVuIHJhZGlvLW1vZGUgYnV0dG9uIGNsaWNrIGFuZCBzb3VuZCBiZWluZyBwbGF5ZWQuXHJcbiAgICAgICAgLy8gSXQncyBiZXR0ZXIgdG8gc2hvdyBzb21lIGludGVybWVkaWF0ZSBzdGF0ZSAoaWNvbiBjaGFuZ2UsIG1vdXNlIGN1cnNvciBjaGFuZ2UsIGV0YykgaW4gdGhlIG1lYW53aGlsZVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uPy5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuUExBWUlORyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChQbGF5aW5nU3RhdGUuUExBWUlORyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yUGF1c2UoKSB7XHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QQVVTRUQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQoUGxheWluZ1N0YXRlLlBBVVNFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yRGlzYWJsZWQoKSB7XHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwVGV4dChQbGF5aW5nU3RhdGUuRElTQUJMRUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRvb2x0aXBUZXh0KG5ld1N0YXRlOiBQbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICBpZighdGhpcy50b29sdGlwRWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IFwiUmFkaW8gbW9kZVwiO1xyXG4gICAgICAgIGlmKG5ld1N0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgdGV4dCA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJSQURJT19NT0RFX0RJU0FCTEVEXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKG5ld1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBjaHJvbWUuaTE4bi5nZXRNZXNzYWdlKFwiUkFESU9fTU9ERV9TVEFSVFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihuZXdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHtcclxuICAgICAgICAgICAgdGV4dCA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJSQURJT19NT0RFX0VORFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJ1cGRhdGVUb29sdGlwVGV4dCBmb3Igc3RhdGUgXCIgKyBuZXdTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG9vbHRpcEVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAvLyBJcyB0aGlzIG5lY2Vzc2FyeT9cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY2xhc3MgVmlkZW9QbGF5ZXIge1xyXG4gICAgcGxheWVySWQ6IHN0cmluZztcclxuICAgIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXI7XHJcbiAgICBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXlpbmdTdGF0ZTogUGxheWluZ1N0YXRlO1xyXG4gICAgYXR0cmlidXRlT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBjb250cm9sR3JvdXA6IENvbnRyb2xHcm91cDtcclxuICAgIGNvbnRyb2xHcm91cE9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgaGxzOiBIbHM7XHJcbiAgICBhdWRpb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB2aWRlb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB2aWRlb0VsZW1PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIG92ZXJsYXlCdXR0b246IEVsZW1lbnQ7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcklkOiBzdHJpbmcsIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXIsIHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbSA9IHBsYXllckVsZW07XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpID8gUGxheWluZ1N0YXRlLlBBVVNFRCA6IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDtcclxuXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMoKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cE9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy50cnlPYnNlcnZpbmdWaWRlb0VsZW0oKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpIHtcclxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgY29udHJvbCBncm91cCBET00gaXMgcmVhZHlcclxuICAgICAgICBjb25zdCBjb250cm9sR3JvdXBFbGVtID0gdGhpcy5wbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY29udHJvbEdyb3VwQ2xhc3MpPy5bMF07XHJcbiAgICAgICAgaWYoIWNvbnRyb2xHcm91cEVsZW0pIHsgIC8vIGNvbnRyb2wgZ3JvdXAgY2Fubm90IGJlIGZvdW5kIGluIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpOyAgLy8gZGVzdHJveSByZWZlcmVuY2UgdG8gdGhlIHJlbW92ZWQgRE9NXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uID0gdGhpcy5wbGF5ZXJFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLW92ZXJsYXktcGxheS1idXR0b24nXVwiKT8uWzBdO1xyXG4gICAgICAgIGlmKHRoaXMub3ZlcmxheUJ1dHRvbiAmJiB0aGlzLnBsYXlpbmdTdGF0ZSA9PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlCdXR0b24uY2xhc3NMaXN0LmFkZChcIm5vZGlzcGxheVwiKTtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKGNvbnRyb2xHcm91cEVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5T2JzZXJ2aW5nVmlkZW9FbGVtKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLnZpZGVvRWxlbU9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrOiBNdXRhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24obXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT0gXCJzcmNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2aWRlb0VsZW0gPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2aWRlb1wiKT8uWzBdO1xyXG4gICAgICAgIGlmKCF2aWRlb0VsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW1PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHZpZGVvRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IHZpZGVvRWxlbTtcclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHRoaXMudmlkZW9FbGVtKTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMudmlkZW9FbGVtT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZpZGVvRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTsgXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdHVzKCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpO1xyXG4gICAgICAgIGlmKGNoYW5uZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbmFibGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2VGcm9tRGlzYWJsZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvckRpc2FibGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheShtZWRpYVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5QQVVTRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnZpZGVvRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbS5jbGFzc0xpc3QuYWRkKFwibm9kaXNwbGF5XCIpO1xyXG4gICAgICAgICAgICAvL3RoaXMuaW1hZ2VFbGVtPy5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibm9kaXNwbGF5XCIpO1xyXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcInR3LWJsb2NrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgc2VwYXJhdGUgPHZpZGVvPiBlbGVtZW50IHRvIHBsYXkgYXVkaW8uXHJcbiAgICAgICAgLy8gPGF1ZGlvPiBjYW4gYmUgYWxzbyB1c2VkIGJ5IGhscy5qcywgYnV0IFR5cGVzY3JpcHQgZm9yY2VzIHRoaXMgdG8gYmUgSFRNTFZpZGVvRWxlbWVudC5cclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IDxIVE1MVmlkZW9FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbS5jbGFzc0xpc3QuYWRkKFwibm9kaXNwbGF5XCIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXAucmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgXCJsb2FkaW5nXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnBsYXkoKS50aGVuKGF1ZGlvUGxheUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBMQVlJTkc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU3RvcCB0aGUgdmlkZW8gaWYgcGxheWluZ1xyXG4gICAgICAgIHRoaXMucGF1c2VWaWRlbygpO1xyXG4gICAgICAgIC8vdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUZyb21EaXNhYmxlZCgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheWluZ1N0YXRlO1xyXG4gICAgICAgIGlmKHN0YXRlICE9PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QQVVTRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBBVVNFRCB8fCBzdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5obHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcIkRPTUV4Y2VwdGlvbjogVGhlIHBsYXkoKSByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBieSBhIGNhbGwgdG8gcGF1c2UoKVwiXHJcbiAgICAgICAgICAgICAgICAvLyBpcyB0aHJvd24gd2hlbiB1c2VyIHBhdXNlcyB0aGUgYXVkaW8gdG9vIHF1aWNrbHkgYWZ0ZXIgcGxheWluZy5cclxuICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBpcyBuZWVkZWQuIFRoZSBhdWRpbyB3aWxsIGJlIHBhdXNlZCBjb3JyZWN0bHkgYW55d2F5LlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLnN0b3BMb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRldGFjaE1lZGlhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgLy8gVGhlcmUgc2VlbXMgdG8gYmUgYSBidWcgdGhhdCB0aGUgSExTIG9iamVjdCBnZXRzIHN0dWNrIGFmdGVyIG11bHRpcGxlIHBsYXlzIGFuZCBwYXVzZXNcclxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgcmUtdXNlZCBmb3IgdGhlIG5leHQgcGxheS4gTmVlZCB0byBkZXN0cm95IHRoZSBvYmplY3QgYW5kIHJlLWNyZWF0ZSBpdC5cclxuICAgICAgICAgICAgdGhpcy5obHMgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckVsZW0ucmVtb3ZlQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy52aWRlb0VsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW0uY2xhc3NMaXN0LnJlbW92ZShcIm5vZGlzcGxheVwiKTtcclxuICAgICAgICAgICAgLy90aGlzLmltYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMub3ZlcmxheUJ1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcIm5vZGlzcGxheVwiKTtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9uUGF1c2UgPSBmdW5jdGlvbihyZXN1bHQ6IGFueSkge1xyXG4gICAgICAgICAgICBpZihyZXN1bHQuYXV0b3BsYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheVZpZGVvKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsnYXV0b3BsYXknXSwgb25QYXVzZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5VmlkZW8oKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVWaWRlb1N0YXRlSWYoXCJwYXVzZWRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VWaWRlbygpIHtcclxuICAgICAgICB0aGlzLnRvZ2dsZVZpZGVvU3RhdGVJZihcInBsYXlpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlVmlkZW9TdGF0ZUlmKGV4cGVjdGVkU3RhdGU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHZpZGVvUGxheUJ1dHRvbiA9IHRoaXMuY29udHJvbEdyb3VwPy5wbGF5QnV0dG9uRWxlbTtcclxuICAgICAgICBjb25zdCB2aWRlb1N0YXRlID0gdmlkZW9QbGF5QnV0dG9uPy5nZXRBdHRyaWJ1dGUodmlkZW9QbGF5ZXJTdGF0ZUF0dHIpO1xyXG4gICAgICAgIGlmKHZpZGVvU3RhdGUgPT09IGV4cGVjdGVkU3RhdGUpIHtcclxuICAgICAgICAgICAgdmlkZW9QbGF5QnV0dG9uLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzXHJcbiAgICBwYXVzZUFsbCgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyAgLy8gV2hhdCBlbHNlIHRvIGRvIGhlcmU/XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0UGxheSgpIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKTtcclxuICAgICAgICBpZighY2hhbm5lbCkge1xyXG4gICAgICAgICAgICAvLyBDdXJyZW50bHkgaW4gYSBub24tY2hhbm5lbCBwYWdlLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VDYWxsYmFjayA9IGFzeW5jIGZ1bmN0aW9uKHJlc3BvbnNlOiBHZXRVcmxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYoIXJlc3BvbnNlPy53ZWJVcmw/LmNoYW5uZWwpIHtcclxuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnRseSBpbiBhIG5vbi1jaGFubmVsIHBhZ2UuIERpc2FibGUgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlsaXN0ID0gYXdhaXQgdHJ5RmV0Y2hpbmdQbGF5bGlzdChyZXNwb25zZS53ZWJVcmwpO1xyXG4gICAgICAgICAgICBpZighcGxheWxpc3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9mZmxpbmUgb3IgaG9zdGluZyBhbm90aGVyIGNoYW5uZWwuIERpc2FibGUgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBhdWRpb1N0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKHBsYXlsaXN0KTtcclxuICAgICAgICAgICAgaWYoYXVkaW9TdHJlYW1VcmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KGF1ZGlvU3RyZWFtVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiZ2V0X2F1ZGlvX3VybFwiLCBjaGFubmVsOiBjaGFubmVsfSwgcmVzcG9uc2VDYWxsYmFjay5iaW5kKHRoaXMpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgb25SYWRpb0J1dHRvbkNsaWNrZWQoKSB7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGxheWluZ1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBBVVNFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXkoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QTEFZSU5HOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyQ29udGFpbmVyIHtcclxuICAgIHBsYXllcnM6IFZpZGVvUGxheWVyW107XHJcbiAgICBuZXh0SWQ6IG51bWJlcjtcclxuICAgIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMubmV4dElkID0gMTAwMDE7ICAvLyBSYW5kb20gc3RhcnQgaW5kZXggZm9yIHBsYXllci5cclxuICAgIH1cclxuXHJcbiAgICBydW4oKSB7XHJcbiAgICAgICAgLy8gRmluZCBleGlzdGluZyB2aWRlbyBwbGF5ZXIgZWxlbWVudHMgdG8gY3JlYXRlIFZpZGVvUGxheWVyIG9iamVjdHNcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZGVvUGxheWVyTGlzdCgpO1xyXG4gICAgICAgIC8vIERldGVjdCBmdXR1cmUgdmlkZW8gcGxheWVyIGVsZW1lbnRzXHJcbiAgICAgICAgY29uc3QgbWFpbkVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1haW5cIilbMF07XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShtYWluRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZpZGVvUGxheWVyTGlzdCgpIHtcclxuICAgICAgICAvLyBUT0RPOiBJcyBpdCBiZXR0ZXIgdG8gaXRlcmF0ZSBvbmx5IHRoZSBtdXRhdGVkIGRpdnM/XHJcbiAgICAgICAgY29uc3QgcGxheWVyRWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHZpZGVvUGxheWVyQ2xhc3MpO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGl2IGlzIG5vdCBhbHJlYWR5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBpZighaXNQcm9jZXNzZWQocGxheWVyRWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJOZXcgdmlkZW8gcGxheWVyIGRldGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gcHJvY2VlZCBpZiB0aGVyZSBhcmUgdGhlIHNhbWUgbnVtYmVyIG9mIHBsYXllcnMgaW4gdGhlIGxpc3QgYW5kIGluIERPTS5cclxuICAgICAgICBpZihwbGF5ZXJFbGVtcy5sZW5ndGggPT09IHRoaXMucGxheWVycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB2aWRlbyBwbGF5ZXJzIG5vdCBpbiBET00gYW55bW9yZS5cclxuICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIGEgdXNlciBicm93c2VzIGZyb20gYSBub24tY2hhbm5lbCBwYWdlIChtYWluLCBkaXJlY3RvcnksIGV0Yy4pIHRvIGEgY2hhbm5lbCBwYWdlLFxyXG4gICAgLy8gb3IgYmV0d2VlbiBub24tY2hhbm5lbCBwYWdlcy5cclxuICAgIGdhcmJhZ2VDb2xsZWN0UGxheWVycyhwbGF5ZXJFbGVtczogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50Pikge1xyXG4gICAgICAgIGNvbnN0IGFsbFBsYXllcklkc0luRG9tOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICBhbGxQbGF5ZXJJZHNJbkRvbS5wdXNoKHBsYXllckVsZW0uZ2V0QXR0cmlidXRlKHBsYXllcklkQXR0cikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiQWxsIHBsYXllcklkcyBpbiBET006IFwiICsgYWxsUGxheWVySWRzSW5Eb20pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdsaXN0ID0gW107XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gcGxheWVyLnBsYXllcklkO1xyXG4gICAgICAgICAgICBpZihhbGxQbGF5ZXJJZHNJbkRvbS5pbmRleE9mKHBsYXllcklkKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3bGlzdC5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBQbGF5ZXIgJHtwbGF5ZXJJZH0gaXMgbm90IGluIERPTSBhbnltb3JlLiBEZWxldGluZy4uYCk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ld2xpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQocGxheWVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXllckVsZW0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQbGF5ZXJJZCA9IHZpZGVvUGxheWVySWRQcmVmaXggKyB0aGlzLm5leHRJZDtcclxuICAgICAgICB0aGlzLm5leHRJZCArPSAxO1xyXG4gICAgICAgIHBsYXllckVsZW0uc2V0QXR0cmlidXRlKHBsYXllcklkQXR0ciwgbmV3UGxheWVySWQpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIobmV3UGxheWVySWQsIHRoaXMsIHBsYXllckVsZW0pO1xyXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VFeGNlcHQocGxheWVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIucGxheWVySWQgIT09IHBsYXllcklkKSBwbGF5ZXIucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdpbGwgdGhpcyBmdW5jdGlvbiBldmVyIGJlIHVzZWQ/XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuIiwiXHJcbmltcG9ydCB7IFZpZGVvUGxheWVyQ29udGFpbmVyIH0gZnJvbSBcIi4vdmlkZW9fcGxheWVyX2NvbnRhaW5lclwiO1xyXG5cclxuXHJcbnZhciBjb250YWluZXIgPSBuZXcgVmlkZW9QbGF5ZXJDb250YWluZXIoKTtcclxuY29udGFpbmVyLnJ1bigpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9