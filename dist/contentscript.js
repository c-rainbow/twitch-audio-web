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
function getChannelFromWebUrl(weburl) {
    // Channel name may not be available from the main page URL
    const url = weburl !== null && weburl !== void 0 ? weburl : location.href;
    const channel = getNameBetweenStrings(url, twitchDomain, "/", true);
    console.log("Channel name " + channel + ", from URL: " + url);
    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (nonChannels.indexOf(channel) != -1)
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
        this.radioButton.setAttribute(radioModeStateAttr, this.player.playingState);
        this.radioButton.onclick = this.player.onRadioButtonClicked.bind(this.player);
        this.tooltipElem = (_a = buttonWrapperDom.getElementsByClassName("tw-tooltip")) === null || _a === void 0 ? void 0 : _a[0];
        this.controlGroupElem.appendChild(buttonWrapperDom);
    }
    updateForPlay() {
        // NOTE: There is 1~3 seconds of delay between radio-mode button click and sound being played.
        // It's better to show some intermediate state (icon change, mouse cursor change, etc) in the meanwhile
        var _a;
        // Change the radio button icon
        (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.setAttribute(radioModeStateAttr, "playing" /* PLAYING */);
    }
    updateForPause() {
        var _a;
        // Change the radio button icon
        (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.setAttribute(radioModeStateAttr, "paused" /* PAUSED */);
    }
    updateForDisabled() {
        var _a;
        // Change the radio button icon
        (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.setAttribute(radioModeStateAttr, "disabled" /* DISABLED */);
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
        this.playingState = "unknown" /* UNKNOWN */;
        this.tryUpdatingComponents();
        this.controlGroupObserver = new MutationObserver(this.tryUpdatingComponents.bind(this));
        this.controlGroupObserver.observe(this.playerElem, domObserverConfig);
        this.videoElem = playerElem.getElementsByTagName("video")[0];
        const videoMutationCallback = function () {
            console.log("Video mutation callback");
            this.tryUpdatingComponents();
        };
        if (this.videoElem) {
            this.videoElemObserver = new MutationObserver(videoMutationCallback.bind(this));
            this.videoElemObserver.observe(this.videoElem, attrObserverConfig);
        }
    }
    tryUpdatingComponents() {
        this.tryUpdatingControlGroup();
        const mediaMetadata = this.getMediaMetadata();
        const inChannelAttrVal = this.playerElem.getAttribute(videoPlayerInChannelAttr);
        const isLiveAttrVal = this.playerElem.getAttribute(videoPlayerIsLiveAttr);
        if (mediaMetadata.isInChannel !== inChannelAttrVal || mediaMetadata.isVideoLive !== isLiveAttrVal) {
            // Refresh the radio mode button
            this.tryRadioButtonRefresh(mediaMetadata);
        }
    }
    tryRadioButtonRefresh(metadata) {
        var _a;
        const radioButton = (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.radioButton;
        if (!radioButton) {
            return;
        }
        if (this.isLoading(metadata)) {
            // Wait until components should be enabled or disabled
        }
        if (this.shouldEnableRadio(metadata)) {
            this.enable();
        }
        else if (this.shouldDisableRadio(metadata)) {
            this.disable(metadata);
        }
        this.playerElem.setAttribute(videoPlayerInChannelAttr, metadata.isInChannel);
        this.playerElem.setAttribute(videoPlayerIsLiveAttr, metadata.isVideoLive);
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
    isLoading(metadata) {
        if (metadata.isInChannel === "unknown" /* UNKNOWN */ || metadata.isVideoLive === "unknown" /* UNKNOWN */) {
            return true;
        }
        return false;
    }
    shouldEnableRadio(metadata) {
        if (metadata.isInChannel === "true" /* TRUE */ && metadata.isVideoLive === "true" /* TRUE */) {
            return true;
        }
        return false;
    }
    shouldDisableRadio(metadata) {
        if (metadata.isInChannel === "false" /* FALSE */ || metadata.isVideoLive === "false" /* FALSE */) {
            return true;
        }
        return false;
    }
    getMediaMetadata() {
        return {
            isInChannel: this.isPossiblyInChannelPage(),
            isVideoLive: this.isVideoLive()
        };
    }
    enable() {
        const state = this.playingState;
        if (state === "disabled" /* DISABLED */ || state === "unknown" /* UNKNOWN */) {
            this.pause();
        }
    }
    disable(mediaMetadata) {
        var _a;
        if (this.playingState === "disabled" /* DISABLED */) {
            return;
        }
        if (this.playingState === "playing" /* PLAYING */) {
            this.pause();
        }
        this.playingState = "disabled" /* DISABLED */;
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForDisabled();
        this.updateTooltipText(mediaMetadata);
    }
    play(mediaUrl) {
        var _a, _b;
        const playingState = this.playingState;
        if (playingState === "disabled" /* DISABLED */ || playingState === "playing" /* PLAYING */) {
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
            console.log("Play started");
        };
        this.audioElem.play().then(audioPlayCallback.bind(this));
        this.playingState = "playing" /* PLAYING */;
        // Stop the video if playing
        this.pauseVideo();
        (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.updateForPlay();
        this.updateTooltipText();
    }
    pause() {
        var _a;
        const playingState = this.playingState;
        if (playingState === "disabled" /* DISABLED */ || playingState === "paused" /* PAUSED */) {
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
        this.updateTooltipText();
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
        const responseCallback = function (response) {
            var _a;
            return video_player_container_awaiter(this, void 0, void 0, function* () {
                if (!((_a = response === null || response === void 0 ? void 0 : response.webUrl) === null || _a === void 0 ? void 0 : _a.channel)) {
                    // Currently in a non-channel page. Disable 
                    this.disable({ isChannel: false });
                    return;
                }
                let playlist = yield tryFetchingPlaylist(response.webUrl);
                if (!playlist) {
                    // Offline or hosting another channel. Disable 
                    this.disable({ isChannel: true, isLive: false });
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
    isPossiblyInChannelPage() {
        const channel = Object(url["e" /* getChannelFromWebUrl */])();
        return channel !== null ? "true" /* TRUE */ : "false" /* FALSE */;
    }
    isVideoLive() {
        var _a, _b, _c;
        // If watching a live stream, enable the control group.
        // If watching VOD of clip, disable the control group.
        // For now, the logic for checking live/recorded video is existence of time seekbar.
        const seekbar = (_a = this.playerElem.getElementsByClassName("seekbar-interaction-area")) === null || _a === void 0 ? void 0 : _a[0];
        if (seekbar) {
            return "false" /* FALSE */;
        }
        // Consider the video live, if we don't see the seekbar but see
        // the play/pause button and the volume slider.
        const videoPlayButton = (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.playButtonElem;
        const volumeSlider = (_c = this.controlGroup) === null || _c === void 0 ? void 0 : _c.volumeSliderElem;
        if (videoPlayButton && volumeSlider) {
            return "true" /* TRUE */;
        }
        // Otherwise, wait more for other control inputs to be available.
        // The DOM is not loaded enough yet.
        return "unknown" /* UNKNOWN */;
    }
    updateTooltipText(metadata) {
        var _a;
        const tooltipElem = (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.tooltipElem;
        if (!tooltipElem) {
            return;
        }
        /**
         * Cases
         * 1. Disabled because main page
         * 2. Disabled because non-channel page
         * 3. Disabled because VOD/clip
         * 4. Paused
         * 5. Playing
         */
        const playingState = this.playingState;
        if (playingState === "disabled" /* DISABLED */) {
            if ((metadata === null || metadata === void 0 ? void 0 : metadata.isVideoLive) === "false" /* FALSE */) { // false, not null nor undefined
                tooltipElem.textContent = "Radio mode can only be used in live stream";
                return;
            }
            if ((metadata === null || metadata === void 0 ? void 0 : metadata.isInChannel) === "false" /* FALSE */) { // false, not null nor undefined
                tooltipElem.textContent = "Radio mode is only available in streamer channels";
                return;
            }
            tooltipElem.textContent = "Radio mode is disabled";
        }
        else if (playingState === "paused" /* PAUSED */) {
            tooltipElem.textContent = "Start Radio mode";
        }
        else if (playingState === "playing" /* PLAYING */) {
            tooltipElem.textContent = "End Radio mode";
        }
        else {
            console.debug("updateTooltipText for state " + playingState);
        }
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

var container = new VideoPlayerContainer();
container.run();


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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LE1BQU0sTUFBTSxHQUFHLElBQUksa0NBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBZ0I7UUFDeEIsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzVCLElBQUcsTUFBTSxDQUFDLFFBQVEsS0FBSyxRQUFRO2dCQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNuRDtJQUNMLENBQUM7SUFFRCxPQUFPOztRQUNILFVBQUksQ0FBQyxRQUFRLDBDQUFFLFVBQVUsR0FBRztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixLQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNKOzs7QUN4dkIrRDtBQUdoRSxJQUFJLFNBQVMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFDM0MsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6ImNvbnRlbnRzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG4iLCJcclxuY29uc3QgdHdpdGNoRG9tYWluIDogc3RyaW5nID0gXCJ0d2l0Y2gudHYvXCI7XHJcbi8vIE5vbi1leGh1YXN0aXZlIGxpc3Qgb2Ygbm9uLWNoYW5uZWwgcm91dGVzIGluIHR3aXRjaC50dlxyXG5jb25zdCBub25DaGFubmVscyA6IHN0cmluZ1tdID0gW1xyXG4gICAgXCJcIiwgXCJkaXJlY3RvcnlcIiwgXCJ2aWRlb3NcIiwgXCJ1XCIsIFwic2V0dGluZ3NcIiwgXCJmcmllbmRzXCIsIFwic3Vic2NyaXB0aW9uc1wiLCBcImludmVudG9yeVwiLCBcIndhbGxldFwiXTtcclxuXHJcbmNvbnN0IGFwaURvbWFpbiA6IHN0cmluZyA9IFwiYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvXCI7XHJcbmNvbnN0IGFjY2Vzc1Rva2VuIDogc3RyaW5nID0gXCIvYWNjZXNzX3Rva2VuXCI7XHJcblxyXG5jb25zdCB1c2hlckRvbWFpbiA6IHN0cmluZyA9IFwidXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy9cIjtcclxuY29uc3QgdXNoZXJFeHQgOiBzdHJpbmcgPSBcIi5tM3U4XCI7XHJcblxyXG5cclxuLy8gRXh0cmFjdCBhdWRpb19vbmx5IHN0cmVhbSAubTN1OCBmcm9tIHRoZSBtYXN0ZXIgcGxheWxpc3QgY29udGVudC5cclxuLy8gUmV0dXJucyB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIGEgVVJMIGFmdGVyIGF1ZGlvX29ubHkgbWV0YWRhdGEuXHJcbi8vIFRPRE86IFRoaXMgd29ya3MsIGJ1dCBldmVudHVhbGx5IHdlIHdpbGwgbmVlZCB0byBmdWxseSBwYXJzZSB0aGUgY29udGVudFxyXG4vLyBhbmQgZ2V0IGF1ZGlvX29ubHkgc3RyZWFtIHVybFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBpZighY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBhdWRpb09ubHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgZm9yKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgaWYgKGxpbmUuaW5jbHVkZXMoXCJhdWRpb19vbmx5XCIpKSBhdWRpb09ubHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGF1ZGlvT25seUZvdW5kICYmIGxpbmUuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tV2ViVXJsKHdlYnVybD86IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgLy8gQ2hhbm5lbCBuYW1lIG1heSBub3QgYmUgYXZhaWxhYmxlIGZyb20gdGhlIG1haW4gcGFnZSBVUkxcclxuICAgIGNvbnN0IHVybCA9IHdlYnVybCA/PyBsb2NhdGlvbi5ocmVmO1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1cmwsIHR3aXRjaERvbWFpbiwgXCIvXCIsIHRydWUpO1xyXG4gICAgY29uc29sZS5sb2coXCJDaGFubmVsIG5hbWUgXCIgKyBjaGFubmVsICsgXCIsIGZyb20gVVJMOiBcIiArIHVybClcclxuXHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChub25DaGFubmVscy5pbmRleE9mKGNoYW5uZWwpICE9IC0xKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVG9rZW5VcmwoYWNjZXNzVG9rZW5Vcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhhY2Nlc3NUb2tlblVybCwgYXBpRG9tYWluLCBhY2Nlc3NUb2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgYWNjZXNzIHRva2VuOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh1c2hlclVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVzaGVyVXJsLCB1c2hlckRvbWFpbiwgdXNoZXJFeHQpO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIHVzaGVyOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG4vLyBHZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2Ygc3RhcnRTdHIgYW5kIHRoZSBmaXJzdCBlbmRTdHIgYWZ0ZXIgc3RhcnRTdHIuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lQmV0d2VlblN0cmluZ3MoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsIHN0YXJ0U3RyOiBzdHJpbmcsIGVuZFN0cjogc3RyaW5nLCBlbmRPcHRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSA6IHN0cmluZyB7XHJcbiAgICBsZXQgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHN0YXJ0U3RyKTtcclxuICAgIGlmKHN0YXJ0SW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBzdGFydEluZGV4ICs9IHN0YXJ0U3RyLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihlbmRTdHIsIHN0YXJ0SW5kZXggKyAxKTtcclxuICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIGlmKGVuZE9wdGlvbmFsKSBlbmRJbmRleCA9IHVybC5sZW5ndGg7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxufVxyXG5cclxuXHJcbi8vIFRPRE86IEluc3RlYWQgb2YgcHJlLWRlZmluZWQgdXJsIGZvcm1hdCwgdXNlIHJlY2VudGx5IHVzZWQgb250IGluIFR3aXRjaCB3ZWJcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nLCBzaWc6IHN0cmluZykgOiBVc2hlclVybCB7XHJcbiAgICBjb25zdCB1c2hlclVybCA9IG5ldyBVc2hlclVybChgaHR0cHM6Ly91c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzLyR7Y2hhbm5lbH0ubTN1OGApO1xyXG4gICAgdXNoZXJVcmwudXBkYXRlKHRva2VuLCBzaWcpO1xyXG5cclxuICAgIC8vIEl0IGlzIG5vdCBjbGVhciBpZiBhbGwgb2YgdGhlc2UgcGFyYW1zIGFyZSByZXF1aXJlZCBvciBpZiB0aGVyZSBhcmUgYW55IG1pc3Npbmcgb25lcy5cclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwicGxheWVyXCIsIFwidHdpdGNod2ViXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19zb3VyY2VcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJ0eXBlXCIsIFwiYW55XCIpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdXNoZXJVcmw7XHJcbn1cclxuXHJcblxyXG4vLyBJbnRlcmZhY2UgdG8gY29tbXVuaWNhdGUgYmV0d2VlbiBiYWNrZ3JvdW5kIGFuZCBjb250ZW50c2NyaXB0XHJcbi8vIHRvIHJlcXVlc3QvcmVzcG9uZCBhY2Nlc3MgdG9rZW4gVVJMIGFuZCB1c2hlciBVUkwgZm9yIGEgY2hhbm5lbC5cclxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmxzUmVzcG9uc2Uge1xyXG4gICAgd2ViVXJsOiBVcmxHcm91cDtcclxuICAgIGxhc3RSZXF1ZXN0ZWQ6IFVybEdyb3VwO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVcmxHcm91cCB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBhY2Nlc3NUb2tlblVybDogc3RyaW5nO1xyXG4gICAgdXNoZXJVcmw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8vIENsYXNzIHRvIHN0b3JlIGFuZCBtYW5pcHVsYXRlIHVzaGVyIFVSTC5cclxuZXhwb3J0IGNsYXNzIFVzaGVyVXJsIHtcclxuICAgIG9yaWdpbmFsVXJsOiBzdHJpbmc7XHJcbiAgICB1cmxPYmplY3Q6IFVSTDtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGV4cGlyZXNBdDogbnVtYmVyOyAgLy8gVG9rZW4gZXhwaXJhdGlvbiBkYXRldGltZSBpbiBlcG9jaCBzZWNvbmRzXHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuZ2V0Q2hhbm5lbCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19hdWRpb19vbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVbmV4cGlyZWRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRzU2luY2VFcG9jaCA9IE1hdGgucm91bmQobm93LmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgICAgIC8vIDYwIHNlY29uZHMgYnVmZmVyIGJlZm9yZSB0b2tlbiBleHBpcmF0aW9uXHJcbiAgICAgICAgaWYoc2Vjb25kc1NpbmNlRXBvY2ggKyA2MCA8IHRoaXMuZXhwaXJlc0F0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVybCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBDYWNoZWQgVVJMIGZvciAke3RoaXMuY2hhbm5lbH0gaXMgZXhwaXJlZGApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cmxPYmplY3QudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRRdWVyeVN0cmluZyhrZXk6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldChrZXkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWVyeVN0cmluZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuc2V0KG5hbWUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeHBpcmVzQXQoKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5TdHJpbmcgPSB0aGlzLmdldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIik7XHJcbiAgICAgICAgaWYoIXRva2VuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW5Kc29uID0gSlNPTi5wYXJzZSh0b2tlblN0cmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2VuSnNvbi5leHBpcmVzIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXNBdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgcGFyc2UgdG9rZW4gaW4gdXNoZXIgVVJMLiBFcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYW5uZWwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwodGhpcy5vcmlnaW5hbFVybCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld1Rva2VuOiBzdHJpbmcsIG5ld1NpZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInRva2VuXCIsIG5ld1Rva2VuKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwic2lnXCIsIG5ld1NpZyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInBcIiwgdGhpcy5nZXRSYW5kb21OdW1iZXIoKS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tTnVtYmVyKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgeyBidWlsZFVzaGVyVXJsLCBwYXJzZUF1ZGlvT25seVVybCwgVXJsR3JvdXAgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb250ZW50KHVybDogc3RyaW5nKSB7XHJcbiAgICBpZighdXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgc3RhdHVzIGlmIG9rXHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgZmV0Y2hDb250ZW50IHRocmV3IGFuIGVycm9yOiAke2Vycn1gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hKc29uKHVybDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudCh1cmwpO1xyXG4gICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwSnNvbiA9IEpTT04ucGFyc2UocmVzcFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcEpzb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGNvdWxkIG5vdCBiZSBwYXJzZWQgdG8gSlNPTjogXCIgKyByZXNwVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdWRpb1N0cmVhbVVybCh1c2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVzaGVyVXJsKTtcclxuICAgIGNvbnN0IHN0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQpO1xyXG4gICAgcmV0dXJuIHN0cmVhbVVybDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW5Vcmw6IHN0cmluZywgbGFzdFJlcXVlc3RlZENoYW5uZWw6IHN0cmluZyxcclxuICAgICAgICBsYXN0UmVxdXN0ZWRVc2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbih0b2tlblVybCk7XHJcbiAgICBpZighcmVzcEpzb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbi50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbi5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYW5uZWwgaXMgZGlmZmVyZW50IGZyb20gdGhlIGNoYW5uZWwgb2YgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIHVybFxyXG4gICAgLy8gKFRoaXMgaXMgcG9zc2libGUgaWYgdGhlIGNoYW5uZWwncyBzdHJlYW1lciBpcyBob3N0aW5nIGFub3RoZXIgY2hhbm5lbClcclxuICAgIGlmKGxhc3RSZXF1ZXN0ZWRDaGFubmVsICYmIGNoYW5uZWwgIT09IGxhc3RSZXF1ZXN0ZWRDaGFubmVsKSB7XHJcbiAgICAgICAgaWYobGFzdFJlcXVzdGVkVXNoZXJVcmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXF1c3RlZFVzaGVyVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIHN0b3JlIGl0XHJcbiAgICAgICAgY29uc3QgdXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGxhc3RSZXF1ZXN0ZWRDaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgICAgICByZXR1cm4gdXNoZXJVcmwuZ2V0VXJsKCk7ICBcclxuICAgIH0gIFxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJ5RmV0Y2hpbmdQbGF5bGlzdChncm91cDogVXJsR3JvdXApIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmKCFncm91cCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gXHJcbiAgICAvLyBzZWUgaWYgdGhlIGV4aXN0aW5nIHVzaGVyIHVybCBjYW4gYmUgdXNlZFxyXG4gICAgaWYoZ3JvdXAudXNoZXJVcmwpIHtcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChncm91cC51c2hlclVybCk7XHJcbiAgICAgICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZighZ3JvdXAuYWNjZXNzVG9rZW5VcmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbihncm91cC5hY2Nlc3NUb2tlblVybCk7XHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uPy50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbj8uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ld1VzaGVyVXJsID0gYnVpbGRVc2hlclVybChncm91cC5jaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KG5ld1VzaGVyVXJsLmdldFVybCgpKTtcclxuICAgIHJldHVybiByZXNwVGV4dDtcclxufSIsIlxyXG5pbXBvcnQgeyB0cnlGZXRjaGluZ1BsYXlsaXN0IH0gZnJvbSBcIi4vZmV0Y2hcIjtcclxuaW1wb3J0IHsgZ2V0Q2hhbm5lbEZyb21XZWJVcmwsIEdldFVybHNSZXNwb25zZSwgcGFyc2VBdWRpb09ubHlVcmwgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBBbnkgYmV0dGVyIHdheSB0aGFuIEhUTUwgYXMgc3RyaW5nP1xyXG5jb25zdCBpbml0aWFsQnV0dG9uRG9tID0gYFxyXG48ZGl2IGNsYXNzPVwidHctaW5saW5lLWZsZXggdHctcmVsYXRpdmUgdHctdG9vbHRpcC13cmFwcGVyIHJhZGlvLW1vZGUtYnV0dG9uLXdyYXBwZXJcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJyYWRpby1tb2RlLWJ1dHRvbiB0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctYWxpZ24tbWlkZGxlIHR3LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYnV0dG9uLWljb24gdHctYnV0dG9uLWljb24tLW92ZXJsYXkgdHctY29yZS1idXR0b24gdHctY29yZS1idXR0b24tLW92ZXJsYXkgdHctaW5saW5lLWZsZXggdHctaW50ZXJhY3RpdmUgdHctanVzdGlmeS1jb250ZW50LWNlbnRlciB0dy1vdmVyZmxvdy1oaWRkZW4gdHctcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICBkYXRhLWEtdGFyZ2V0PVwicmFkaW8tbW9kZS1idXR0b25cIlxyXG4gICAgICAgICAgICBkYXRhLXJhZGlvLW1vZGUtc3RhdGU9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJSYWRpbyBNb2RlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1mbGV4IHR3LWZsZXgtZ3Jvdy0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHctYnV0dG9uLWljb25fX2ljb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taWNvbi1kaXZcIiBzdHlsZT1cIndpZHRoOiAycmVtOyBoZWlnaHQ6IDJyZW07XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBHb29nbGUgTWF0ZXJpYWwgRGVzaWduIFJhZGlvIEljb24uIEFwYWNoZSBMaWNlbnNlIHYyLjAgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3LWljb25fX3N2Z1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMuMjQgNi4xNUMyLjUxIDYuNDMgMiA3LjE3IDIgOHYxMmMwIDEuMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uOSAyLTJWOGMwLTEuMTEtLjg5LTItMi0ySDguM2w4LjI2LTMuMzRMMTUuODggMSAzLjI0IDYuMTV6TTcgMjBjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0xMy04aC0ydi0yaC0ydjJINFY4aDE2djR6XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGRpdiBjbGFzcz1cInR3LXRvb2x0aXAgdHctdG9vbHRpcC0tYWxpZ24tbGVmdCB0dy10b29sdGlwLS11cFwiIGRhdGEtYS10YXJnZXQ9XCJ0dy10b29sdGlwLWxhYmVsXCIgcm9sZT1cInRvb2x0aXBcIj5cclxuICAgICAgICBcclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuICAgXHJcbmNvbnN0IHByb2Nlc3NlZEF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1wcm9jZXNzZWRcIjtcclxuY29uc3QgcHJvY2Vzc2VkQXR0clZhbCA9IFwicHJvY2Vzc2VkXCJcclxuXHJcbmNvbnN0IHZpZGVvUGxheWVyU3RhdGVBdHRyID0gXCJkYXRhLWEtcGxheWVyLXN0YXRlXCI7XHJcblxyXG5jb25zdCByYWRpb01vZGVTdGF0ZUF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1zdGF0ZVwiO1xyXG5jb25zdCBwbGF5ZXJJZEF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1wbGF5ZXItaWRcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJJbkNoYW5uZWxBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtaW4tY2hhbm5lbFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklzTGl2ZUF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1pcy1saXZlXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklkUHJlZml4ID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCBhdHRyT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcbmNvbnN0IGRvbU9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBWaWRlb1BsYXllckNvbnRhaW5lciwgYWRkIE11dGF0aW9uT2JzZXJ2ZXIgdG8gXHJcbiAqIDEuIGRvY3VtZW50LmJvZHkgY2hlY2tzIGZvciBvbmUgc3VidHJlZSBjaGFuZ2VcclxuICogICAxLTIuIElmIGRpdiB3aXRoIGNsYXNzIFwidmlkZW8tcGxheWVyXCIsIHByb2Nlc3MgaXQuIENoZWNrICMyXHJcbiAqIFxyXG4gKiAyLiBDcmVhdGUgVmlkZW9QbGF5ZXIsIHZpZGVvLXBsYXllciBjbGFzcyBkaXYgY2hlY2tzIGZvciAxIGF0dHJpYnV0ZSBjaGFuZ2UsIDMgc3VidHJlZSBjaGFuZ2VzXHJcbiAqICAgMi0xLiBhdHRyaWJ1dGUgXCJkYXRhLWEtcGxheWVyLXR5cGVcIjogXCJzaXRlXCIsIFwic2l0ZV9taW5pXCIsIFwiY2xpcHMtd2F0Y2hcIiwgXCJjaGFubmVsX2hvbWVfY2Fyb3VzZWxcIlxyXG4gKiAgICAgMi0yLTIuIENoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciBpZiBuZWNlc3NhcnlcclxuICogICAgIDItMi0zLiBNb2RlOiBUdXBsZSBvZiAobGF5b3V0LCB2aWRlb190eXBlKS5cclxuICogICAgICAgMi0yLTMtMS4gbGF5b3V0OiBcInNpdGVcIiB8IFwic2l0ZV9taW5pXCJcclxuICogICAgICAgMi0yLTMtMi4gdmlkZW9fdHlwZTogXCJsaXZlXCIsIFwidm9kXCIsIFwiY2xpcFwiLi4gYW5kIG1vcmU/Pz8/P1xyXG4gKiAgIDItMi4gc3VidHJlZSBkaXYgd2l0aCBjbGFzcyBcInZvZC1zZWVrYmFyLXRpbWUtbGFiZWxzXCIgYW5kIFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCJcclxuICogICAgIDItMi0xLiBUaGlzIG9ubHkgYXBwZWFycyBpbiBWT0Qgd2F0Y2hcclxuICogICAgIDItMi0yLiBJZiBjcmVhdGVkLCBjaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgdG8gVk9EXHJcbiAqICAgICAyLTItMy4gSWYgcmVtb3ZlZCAoY2hhbmdlZCBmcm9tIFZPRCB0byBsaXZlL2NsaXApLCA/Pz8/XHJcbiAqICAgMi0zLiBjaGVjayBmb3IgY29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCJcclxuICogICAgIDItMy0xLiBJZiBjcmVhdGVkLCBjaGVjayAjMyBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi0zLTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqICAgMi00LiBjaGVjayBmb3IgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdGhlIHBsYXllclxyXG4gKiAgICAgMi00LTEuIElmIGNyZWF0ZWQsIGNoZWNrICM2IGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTQtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogXHJcbiAqIDMuIENvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiIGNoZWNrcyBmb3IgXHJcbiAqICAgMy0xLiBzdWJ0cmVlIGJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXSBmb3IgdmlkZW8gcGxheS9wYXVzZSBidXR0b25cclxuICogICAgIDMtMS0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNFxyXG4gKiAgICAgMy0xLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0yLiBzdWJ0cmVlIGlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ10gZm9yIHZvbHVtZSBzbGlkZXJcclxuICogICAgIDMtMi0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNVxyXG4gKiAgICAgMy0yLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0zLiBJZiBib3RoIGNvbXBvbmVudHMgaW4gMy0xIGFuZCAzLTIgYXJlIHJlYWR5OlxyXG4gKiAgICAgMy0zLTEuIENyZWF0ZSByYWRpbyBtb2RlIGJ1dHRvbiwgYW5kIHB1dCBNdXRhdGlvbk9ic2VydmVyIChzZWUgIzQgYW5kICM1KVxyXG4gKiAgICAgMy0zLTIuIElmIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgaXMgcmVtb3ZlZCAoc2l0ZS0+c2l0ZV9taW5pIGNoYW5nZSwgZXRjKVxyXG4gKiAgICAgICAzLTMtMi0xLiBhbHNvIHJlbW92ZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gZnJvbSBET01cclxuICogXHJcbiAqIDQuIFZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uIGNoZWNrcyBmb3JcclxuICogICA0LTEuIEF0dHJpYnV0ZSBjaGFuZ2UgdmlkZW9QbGF5ZXJTdGF0ZUF0dHI6IFwicGxheWluZ1wiIG9yIFwicGF1c2VkXCJcclxuICogICAgIDQtMS0xLiBJZiBhdHRyaWJ1dGUgdmFsdWUgY2hhbmdlZCB0byBcInBsYXlpbmdcIiwgc3RvcCBhbGwgYXVkaW8gaW4gdGhlIFZpZGVvUGxheWVyQ29udGFpbmVyXHJcbiAqIFxyXG4gKiA1LiBWb2x1bWUgc2xpZGVyIGNoZWNrcyBmb3JcclxuICogICA1LTEuIEF0dHJpYnV0ZSBcInZhbHVlXCIgY2hhbmdlOiBudW1iZXIgYmV0d2VlbiAwIDw9IG51bSA8PSAxXHJcbiAqICAgICA1LTEtMS4gSWYgY2hhbmdlIGlzIGRldGVjdGVkLCBhcHBseSB0aGUgbmV3IHZvbHVtZSB0byBhdWRpb0VsZW0uXHJcbiAqIFxyXG4gKiA2LiBvcmlnaW5hbCBcInZpZGVvXCIgZWxlbWVudCBpbiB2aWRlby1wbGF5ZXIgY2hlY2tzIGZvclxyXG4gKiAgIDYtMS4gQXR0cmlidXRlIFwic3JjXCIgY2hhbmdlOiBtZWFucyB0aGF0IHRoZSB2aWRlbyBzb3VyY2UgY2hhbmdlZCAobGlrZWx5IGhvc3RpbmcgYW5vdGhlciBzdHJlYW1lcilcclxuICogICAgIDYtMS0xLiBSYWRpbyBtb2RlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQ/IFJlLWNvbmZpZ3VyZWQgd2l0aCB0aGUgbmV3IHN0cmVhbWVyJ3MgVVJMP1xyXG4gKiAgICBcclxuICovXHJcblxyXG4vKipcclxuICogSG93IHRvIGRldGVjdCB0aGUgY2hhbm5lbCBvZiB0aGUgc3RyZWFtIGJlaW5nIHBsYXllZD9cclxuICogR2V0dGluZyBjaGFubmVsIG5hbWUgZnJvbSBVUkwgaGFzIHRoZSBmb2xsbG93aW5nIGlzc3Vlc1xyXG4gKiAoMSkgU3RyZWFtZXIgaG9zdGluZyBhbm90aGVyIGNoYW5uZWxcclxuICogKDIpIE1haW4gcGFnZS4gQ2hhbm5lbCBjYW4gY2hhbmdlIHF1aWNrbHkgaW4gdGhlIGNhcm91c2VsXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIEtlZXAgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBpbiB0aGUgdGFiLiBHdWVzcyB0aGUgY2hhbm5lbCBmcm9tIHRoZXJlXHJcbiAqICgyKSBGb3IgXCJzaXRlX21pbmlcIiBzdGF0ZSwgc3RvcmUgdGhlIGNoYW5uZWwgbmFtZSBpbiB2aWRlbyBwbGF5ZXIuXHJcbiAqICAgICBJbiB0aGF0IGNhc2UsIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gcmVzdW1lIHBsYXlpbmcgaW4gdGhlIHJpZ2h0IGNoYW5uZWwuXHJcbiAqICgzKSBEaXNhYmxlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBpbiB0aGUgbWFpbiBwYWdlXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgcmFkaW8gbW9kZSBidXR0b24gaW4gc2l0ZV9taW5pP1xyXG4gKiBEb24ndCBzdG9yZSB0aGUgcGxheXN0YXRlIGluIERPTTogb25seSBzdG9yZSBpdCBpbiBWaWRlb1BsYXllciBjbGFzcyBhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFU3BvcnRzIHBhZ2U6IHZpZGVvIG1pbmlwbGF5ZXIga2VlcHMgcGxheWluZyBldmVuIHdoZW4gdGhlIHNpdGUgcGxheWVyIGluIEVzcG9ydHMgcGFnZSBpcyBhbHNvIGJlaW5nIHBsYXllZC5cclxuICogU2hvdWxkIHRoZSByYWRpbyBtb2RlIGZvbGxvdyB0aGUgc2FtZSBiZWhhdmlvcj9cclxuICovXHJcblxyXG4vKipcclxuICogQWNjZXNzIHRva2VuIHVybCBoYXMgb2F1dGggY29kZSwgd2hpY2ggaXMgdW5kZWZpbmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqIE5vdCBzdXJlIGhvdyBUd2l0Y2ggcmV0dXJucyBjb3JyZWN0IHJlc3BvbnNlIGZvciBhbm9ueW1vdXMgdXNlciB5ZXQuXHJcbiAqIENhbGxpbmcgdGhlIHNhbWUgYWNjZXNzIHRva2VuIFVSTCBmcm9tIGNvbnRlbnRzY3JpcHQgcmV0dXJucyBlcnJvci5cclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKi9cclxuXHJcbmNvbnN0IGVudW0gQm9vbGVhblN0YXRlIHtcclxuICAgIFVOS05PV04gPSBcInVua25vd25cIixcclxuICAgIEZBTFNFID0gXCJmYWxzZVwiLFxyXG4gICAgVFJVRSA9IFwidHJ1ZVwiLFxyXG59XHJcblxyXG5cclxuaW50ZXJmYWNlIE1lZGlhTWV0YWRhdGEge1xyXG4gICAgaXNJbkNoYW5uZWw6IEJvb2xlYW5TdGF0ZTtcclxuICAgIGlzVmlkZW9MaXZlOiBCb29sZWFuU3RhdGU7XHJcbn1cclxuXHJcblxyXG5jb25zdCBlbnVtIFBsYXlpbmdTdGF0ZSB7XHJcbiAgICBVTktOT1dOID0gXCJ1bmtub3duXCIsXHJcbiAgICBESVNBQkxFRCA9IFwiZGlzYWJsZWRcIixcclxuICAgIFBBVVNFRCA9IFwicGF1c2VkXCIsXHJcbiAgICBQTEFZSU5HID0gXCJwbGF5aW5nXCIsXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1Byb2Nlc3NlZChlbGVtZW50OiBFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZWxlbWVudD8uZ2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIpID09PSBwcm9jZXNzZWRBdHRyVmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXJrUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQ/LnNldEF0dHJpYnV0ZShwcm9jZXNzZWRBdHRyLCBwcm9jZXNzZWRBdHRyVmFsKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRyb2xHcm91cCB7XHJcbiAgICBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXllcjogVmlkZW9QbGF5ZXI7XHJcbiAgICBwbGF5QnV0dG9uRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcmFkaW9CdXR0b246IEhUTUxFbGVtZW50O1xyXG4gICAgdG9vbHRpcEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgY29tcG9uZW50c09ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgcGxheUJ1dHRvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdm9sdW1lT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFZpZGVvUGxheWVyLCBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbSA9IGNvbnRyb2xHcm91cEVsZW07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMoKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyLm9ic2VydmUodGhpcy5jb250cm9sR3JvdXBFbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb21wb25lbnRzKCkge1xyXG4gICAgICAgIC8vIENoZWNrIGZvciBuZXcgUGxheS9BdWRpbyBidXR0b24gYW5kIHZvbHVtZSBzbGlkZXIgXHJcbiAgICAgICAgY29uc3QgcGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3IocGxheUJ1dHRvbkF0dHIpO1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbSk7XHJcbiAgICAgICAgY29uc3Qgdm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHZvbHVtZVNsaWRlckF0dHIpO1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW0pO1xyXG4gICAgICAgIC8vIEFkZCB0aGUgcmFkaW8gYnV0dG9uIGlmIG5vdCBleGlzdHNcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUmFkaW9CdXR0b24oKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCkge1xyXG4gICAgICAgIC8vIHBsYXkgYnV0dG9uIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy5wbGF5QnV0dG9uRWxlbS4gSWdub3JlLlxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHBsYXlCdXR0b25FbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQocGxheUJ1dHRvbkVsZW0pO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy5wbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBwbGF5QnV0dG9uRWxlbTtcclxuICAgICAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVycyBpZiBhIHZpZGVvIHN0YXJ0cyB0byBwbGF5LlxyXG4gICAgICAgIC8vIFRoaXMgaXMgbmVjZXNhc3J5IGZvciBhIGNhc2Ugd2hlbiB1c2VyIGJyb3dzZXMgdG8gYSBub24tY2hhbm5lbCBwYWdlIChlLmcuIG1haW4sIGVzcG9ydHMpXHJcbiAgICAgICAgLy8gd2hpY2ggYXV0b21hdGljYWxseSBwbGF5cyBhIHZpZGVvLlxyXG4gICAgICAgIHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlby5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheUJ1dHRvbkVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VBdWRpb0ZvclZpZGVvKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5wbGF5QnV0dG9uRWxlbS5nZXRBdHRyaWJ1dGUodmlkZW9QbGF5ZXJTdGF0ZUF0dHIpO1xyXG4gICAgICAgIGlmKHN0YXRlID09PSBcInBsYXlpbmdcIikgeyAgLy8gVmlkZW8gc3RhdGUgZnJvbSBwYXVzZWQgdG8gcGxheWluZ1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5wYXVzZUFsbCgpOyAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllciBpbnN0YW5jZXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0Vm9sdW1lKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWVyLmF1ZGlvRWxlbSAmJiB0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gdGhpcy52b2x1bWVTbGlkZXJFbGVtLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hdWRpb0VsZW0udm9sdW1lID0gcGFyc2VGbG9hdCh2b2x1bWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICAgIC8vIHZvbHVtZSBzbGlkZXIgY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighdm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnZvbHVtZVNsaWRlckVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZCh2b2x1bWVTbGlkZXJFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQodm9sdW1lU2xpZGVyRWxlbSk7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gdm9sdW1lU2xpZGVyRWxlbTtcclxuICAgICAgICAvLyBNdXRhdGlvbk9ic2VydmVyIHRvIHZvbHVtZVNsaWRlclxyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmFkanVzdFZvbHVtZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyLm9ic2VydmUodGhpcy52b2x1bWVTbGlkZXJFbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUmFkaW9CdXR0b24oKSB7XHJcbiAgICAgICAgLy8gRG9uJ3QgcHJvY2VlZCB1bmxlc3MgYm90aCBwbGF5QnV0dG9uRWxlbSBhbmQgdm9sdW1lU2xpZGVyRWxlbSBhcmUgYXZhaWxhYmxlXHJcbiAgICAgICAgaWYoIXRoaXMucGxheUJ1dHRvbkVsZW0gfHwgIXRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgYnV0dG9uIHdhcyBhbHJlYWR5IGNyZWF0ZWQsIGRvIG5vdGhpbmdcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZCh0aGlzLnJhZGlvQnV0dG9uKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBVc2Ugd2VicGFjayBodG1sIGxvYWRlclxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICAgICAgYnV0dG9uV3JhcHBlckRvbS5pbm5lckhUTUwgPSBpbml0aWFsQnV0dG9uRG9tO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBidXR0b25XcmFwcGVyRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdO1xyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQodGhpcy5yYWRpb0J1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVXBkYXRlIHJhZGlvIGJ1dHRvbiBzdGF0ZVxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgdGhpcy5wbGF5ZXIucGxheWluZ1N0YXRlKTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLm9uY2xpY2sgPSB0aGlzLnBsYXllci5vblJhZGlvQnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMucGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy50b29sdGlwRWxlbSA9IGJ1dHRvbldyYXBwZXJEb20uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInR3LXRvb2x0aXBcIik/LlswXSBhcyBIVE1MRWxlbWVudDsgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbS5hcHBlbmRDaGlsZChidXR0b25XcmFwcGVyRG9tKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQbGF5KCkge1xyXG4gICAgICAgIC8vIE5PVEU6IFRoZXJlIGlzIDF+MyBzZWNvbmRzIG9mIGRlbGF5IGJldHdlZW4gcmFkaW8tbW9kZSBidXR0b24gY2xpY2sgYW5kIHNvdW5kIGJlaW5nIHBsYXllZC5cclxuICAgICAgICAvLyBJdCdzIGJldHRlciB0byBzaG93IHNvbWUgaW50ZXJtZWRpYXRlIHN0YXRlIChpY29uIGNoYW5nZSwgbW91c2UgY3Vyc29yIGNoYW5nZSwgZXRjKSBpbiB0aGUgbWVhbndoaWxlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QTEFZSU5HKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQYXVzZSgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbj8uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLlBBVVNFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yRGlzYWJsZWQoKSB7XHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24/LnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIC8vIElzIHRoaXMgbmVjZXNzYXJ5P1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBWaWRlb1BsYXllciB7XHJcbiAgICBwbGF5ZXJJZDogc3RyaW5nO1xyXG4gICAgY29udGFpbmVyOiBWaWRlb1BsYXllckNvbnRhaW5lcjtcclxuICAgIHBsYXllckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWluZ1N0YXRlOiBQbGF5aW5nU3RhdGU7XHJcbiAgICBhdHRyaWJ1dGVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGNvbnRyb2xHcm91cDogQ29udHJvbEdyb3VwO1xyXG4gICAgY29udHJvbEdyb3VwT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBobHM6IEhscztcclxuICAgIGF1ZGlvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuICAgIHZpZGVvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuICAgIHZpZGVvRWxlbU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJZDogc3RyaW5nLCBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyLCBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0gPSBwbGF5ZXJFbGVtO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlVOS05PV047XHJcblxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXllckVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuXHJcbiAgICAgICAgdGhpcy52aWRlb0VsZW0gPSBwbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidmlkZW9cIilbMF07ICAgXHJcblxyXG4gICAgICAgIGNvbnN0IHZpZGVvTXV0YXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpZGVvIG11dGF0aW9uIGNhbGxiYWNrXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy52aWRlb0VsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW1PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHZpZGVvTXV0YXRpb25DYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW1PYnNlcnZlci5vYnNlcnZlKHRoaXMudmlkZW9FbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWVkaWFNZXRhZGF0YSA9IHRoaXMuZ2V0TWVkaWFNZXRhZGF0YSgpO1xyXG4gICAgICAgIGNvbnN0IGluQ2hhbm5lbEF0dHJWYWwgPSB0aGlzLnBsYXllckVsZW0uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVySW5DaGFubmVsQXR0cik7XHJcbiAgICAgICAgY29uc3QgaXNMaXZlQXR0clZhbCA9IHRoaXMucGxheWVyRWxlbS5nZXRBdHRyaWJ1dGUodmlkZW9QbGF5ZXJJc0xpdmVBdHRyKTtcclxuXHJcbiAgICAgICAgaWYobWVkaWFNZXRhZGF0YS5pc0luQ2hhbm5lbCAhPT0gaW5DaGFubmVsQXR0clZhbCB8fCBtZWRpYU1ldGFkYXRhLmlzVmlkZW9MaXZlICE9PSBpc0xpdmVBdHRyVmFsKSB7XHJcbiAgICAgICAgICAgIC8vIFJlZnJlc2ggdGhlIHJhZGlvIG1vZGUgYnV0dG9uXHJcbiAgICAgICAgICAgIHRoaXMudHJ5UmFkaW9CdXR0b25SZWZyZXNoKG1lZGlhTWV0YWRhdGEpO1xyXG4gICAgICAgIH0gICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0cnlSYWRpb0J1dHRvblJlZnJlc2gobWV0YWRhdGE6IE1lZGlhTWV0YWRhdGEpIHtcclxuICAgICAgICBjb25zdCByYWRpb0J1dHRvbiA9IHRoaXMuY29udHJvbEdyb3VwPy5yYWRpb0J1dHRvbjtcclxuICAgICAgICBpZighcmFkaW9CdXR0b24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5pc0xvYWRpbmcobWV0YWRhdGEpKSB7XHJcbiAgICAgICAgICAgIC8vIFdhaXQgdW50aWwgY29tcG9uZW50cyBzaG91bGQgYmUgZW5hYmxlZCBvciBkaXNhYmxlZFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNob3VsZEVuYWJsZVJhZGlvKG1ldGFkYXRhKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuc2hvdWxkRGlzYWJsZVJhZGlvKG1ldGFkYXRhKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGUobWV0YWRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllckVsZW0uc2V0QXR0cmlidXRlKHZpZGVvUGxheWVySW5DaGFubmVsQXR0ciwgbWV0YWRhdGEuaXNJbkNoYW5uZWwpO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbS5zZXRBdHRyaWJ1dGUodmlkZW9QbGF5ZXJJc0xpdmVBdHRyLCBtZXRhZGF0YS5pc1ZpZGVvTGl2ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKGNvbnRyb2xHcm91cEVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBpc0xvYWRpbmcobWV0YWRhdGE6IE1lZGlhTWV0YWRhdGEpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYobWV0YWRhdGEuaXNJbkNoYW5uZWwgPT09IEJvb2xlYW5TdGF0ZS5VTktOT1dOIHx8IG1ldGFkYXRhLmlzVmlkZW9MaXZlID09PSBCb29sZWFuU3RhdGUuVU5LTk9XTikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3VsZEVuYWJsZVJhZGlvKG1ldGFkYXRhOiBNZWRpYU1ldGFkYXRhKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmKG1ldGFkYXRhLmlzSW5DaGFubmVsID09PSBCb29sZWFuU3RhdGUuVFJVRSAmJiBtZXRhZGF0YS5pc1ZpZGVvTGl2ZSA9PT0gQm9vbGVhblN0YXRlLlRSVUUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzaG91bGREaXNhYmxlUmFkaW8obWV0YWRhdGE6IE1lZGlhTWV0YWRhdGEpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYobWV0YWRhdGEuaXNJbkNoYW5uZWwgPT09IEJvb2xlYW5TdGF0ZS5GQUxTRSB8fCBtZXRhZGF0YS5pc1ZpZGVvTGl2ZSA9PT0gQm9vbGVhblN0YXRlLkZBTFNFKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TWVkaWFNZXRhZGF0YSgpOiBNZWRpYU1ldGFkYXRhIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpc0luQ2hhbm5lbDogdGhpcy5pc1Bvc3NpYmx5SW5DaGFubmVsUGFnZSgpLFxyXG4gICAgICAgICAgICBpc1ZpZGVvTGl2ZTogdGhpcy5pc1ZpZGVvTGl2ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVuYWJsZSgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheWluZ1N0YXRlO1xyXG4gICAgICAgIGlmKHN0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQgfHwgc3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5VTktOT1dOKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZShtZWRpYU1ldGFkYXRhPzogTWVkaWFNZXRhZGF0YSkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yRGlzYWJsZWQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXBUZXh0KG1lZGlhTWV0YWRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkobWVkaWFVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHBsYXlpbmdTdGF0ZSA9IHRoaXMucGxheWluZ1N0YXRlO1xyXG4gICAgICAgIGlmKHBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEIHx8IHBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSA8dmlkZW8+IGVsZW1lbnQgdG8gcGxheSBhdWRpby5cclxuICAgICAgICAvLyA8YXVkaW8+IGNhbiBiZSBhbHNvIHVzZWQgYnkgaGxzLmpzLCBidXQgVHlwZXNjcmlwdCBmb3JjZXMgdGhpcyB0byBiZSBIVE1MVmlkZW9FbGVtZW50LlxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtID0gPEhUTUxWaWRlb0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLmNsYXNzTGlzdC5hZGQoXCJub2Rpc3BsYXlcIik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmFkanVzdFZvbHVtZSgpOyAgLy8gTWF0Y2ggdGhlIGluaXRpYWwgdm9sdW1lIHdpdGggdGhlIHNsaWRlciB2YWx1ZS5cclxuICAgICAgICB0aGlzLnBsYXllckVsZW0uYXBwZW5kQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgIHRoaXMuaGxzID0gbmV3IEhscyh7XHJcbiAgICAgICAgICAgIC8vZGVidWc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpdmVTeW5jRHVyYXRpb246IDAsXHJcbiAgICAgICAgICAgIGxpdmVNYXhMYXRlbmN5RHVyYXRpb246IDUsXHJcbiAgICAgICAgICAgIGxpdmVEdXJhdGlvbkluZmluaXR5OiB0cnVlICAvLyB0cnVlIGZvciBsaXZlIHN0cmVhbVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGxzLmxvYWRTb3VyY2UobWVkaWFVcmwpO1xyXG4gICAgICAgIHRoaXMuaGxzLmF0dGFjaE1lZGlhKHRoaXMuYXVkaW9FbGVtKTsgXHJcbiAgICAgICAgLy8gVE9ETzogSXMgdGhpcyBzYWZlIHRvIHBsYXkgcmlnaHQgYXdheSBhZnRlciBhdHRhY2hpbmcgdGhlIG1lZGlhP1xyXG4gICAgICAgIC8vIFRoZSBtYWluIGV4YW1wbGUgYXQgaGxzLmpzIHdlYnNpdGUgdGVsbHMgdG8gdXNlIE1BTklGRVNUX1BBUlNFRCBldmVudCxcclxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIHRoZSBldmVudCBpcyBub3QgdHJpZ2dlcmVkIHdpdGggdHlwZXNjcmlwdCt3ZWJwYWNrLlxyXG4gICAgICAgIGNvbnN0IGF1ZGlvUGxheUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheSBzdGFydGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbS5wbGF5KCkudGhlbihhdWRpb1BsYXlDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QTEFZSU5HO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFN0b3AgdGhlIHZpZGVvIGlmIHBsYXlpbmdcclxuICAgICAgICB0aGlzLnBhdXNlVmlkZW8oKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZSgpIHtcclxuICAgICAgICBjb25zdCBwbGF5aW5nU3RhdGUgPSB0aGlzLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICBpZihwbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCB8fCBwbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QQVVTRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmhscykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFwiRE9NRXhjZXB0aW9uOiBUaGUgcGxheSgpIHJlcXVlc3Qgd2FzIGludGVycnVwdGVkIGJ5IGEgY2FsbCB0byBwYXVzZSgpXCJcclxuICAgICAgICAgICAgICAgIC8vIGlzIHRocm93biB3aGVuIHVzZXIgcGF1c2VzIHRoZSBhdWRpbyB0b28gcXVpY2tseSBhZnRlciBwbGF5aW5nLlxyXG4gICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIGlzIG5lZWRlZC4gVGhlIGF1ZGlvIHdpbGwgYmUgcGF1c2VkIGNvcnJlY3RseSBhbnl3YXkuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5obHMuc3RvcExvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGV0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyB0aGF0IHRoZSBITFMgb2JqZWN0IGdldHMgc3R1Y2sgYWZ0ZXIgbXVsdGlwbGUgcGxheXMgYW5kIHBhdXNlc1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyByZS11c2VkIGZvciB0aGUgbmV4dCBwbGF5LiBOZWVkIHRvIGRlc3Ryb3kgdGhlIG9iamVjdCBhbmQgcmUtY3JlYXRlIGl0LlxyXG4gICAgICAgICAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyRWxlbS5yZW1vdmVDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQYXVzZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25QYXVzZSA9IGZ1bmN0aW9uKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdC5hdXRvcGxheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5VmlkZW8oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhdXRvcGxheSddLCBvblBhdXNlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlWaWRlbygpIHtcclxuICAgICAgICB0aGlzLnRvZ2dsZVZpZGVvU3RhdGVJZihcInBhdXNlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZVZpZGVvKCkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlVmlkZW9TdGF0ZUlmKFwicGxheWluZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVWaWRlb1N0YXRlSWYoZXhwZWN0ZWRTdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdmlkZW9QbGF5QnV0dG9uID0gdGhpcy5jb250cm9sR3JvdXA/LnBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIGNvbnN0IHZpZGVvU3RhdGUgPSB2aWRlb1BsYXlCdXR0b24/LmdldEF0dHJpYnV0ZSh2aWRlb1BsYXllclN0YXRlQXR0cik7XHJcbiAgICAgICAgaWYodmlkZW9TdGF0ZSA9PT0gZXhwZWN0ZWRTdGF0ZSkge1xyXG4gICAgICAgICAgICB2aWRlb1BsYXlCdXR0b24uY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnNcclxuICAgIHBhdXNlQWxsKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaGF0IGVsc2UgdG8gZG8gaGVyZT9cclxuICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RQbGF5KCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2FsbGJhY2sgPSBhc3luYyBmdW5jdGlvbihyZXNwb25zZTogR2V0VXJsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmKCFyZXNwb25zZT8ud2ViVXJsPy5jaGFubmVsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50bHkgaW4gYSBub24tY2hhbm5lbCBwYWdlLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKHtpc0NoYW5uZWw6IGZhbHNlfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwbGF5bGlzdCA9IGF3YWl0IHRyeUZldGNoaW5nUGxheWxpc3QocmVzcG9uc2Uud2ViVXJsKTtcclxuICAgICAgICAgICAgaWYoIXBsYXlsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPZmZsaW5lIG9yIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKHtpc0NoYW5uZWw6IHRydWUsIGlzTGl2ZTogZmFsc2V9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBhdWRpb1N0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKHBsYXlsaXN0KTtcclxuICAgICAgICAgICAgaWYoYXVkaW9TdHJlYW1VcmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KGF1ZGlvU3RyZWFtVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiZ2V0X2F1ZGlvX3VybFwiLCBjaGFubmVsOiBjaGFubmVsfSwgcmVzcG9uc2VDYWxsYmFjay5iaW5kKHRoaXMpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgaXNQb3NzaWJseUluQ2hhbm5lbFBhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWwgIT09IG51bGwgPyBCb29sZWFuU3RhdGUuVFJVRSA6IEJvb2xlYW5TdGF0ZS5GQUxTRTtcclxuICAgIH1cclxuXHJcbiAgICBpc1ZpZGVvTGl2ZSgpIDogQm9vbGVhblN0YXRlIHtcclxuICAgICAgICAvLyBJZiB3YXRjaGluZyBhIGxpdmUgc3RyZWFtLCBlbmFibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gSWYgd2F0Y2hpbmcgVk9EIG9mIGNsaXAsIGRpc2FibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gRm9yIG5vdywgdGhlIGxvZ2ljIGZvciBjaGVja2luZyBsaXZlL3JlY29yZGVkIHZpZGVvIGlzIGV4aXN0ZW5jZSBvZiB0aW1lIHNlZWtiYXIuXHJcbiAgICAgICAgY29uc3Qgc2Vla2JhciA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCIpPy5bMF07XHJcbiAgICAgICAgaWYoc2Vla2Jhcikge1xyXG4gICAgICAgICAgICByZXR1cm4gQm9vbGVhblN0YXRlLkZBTFNFO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBDb25zaWRlciB0aGUgdmlkZW8gbGl2ZSwgaWYgd2UgZG9uJ3Qgc2VlIHRoZSBzZWVrYmFyIGJ1dCBzZWVcclxuICAgICAgICAvLyB0aGUgcGxheS9wYXVzZSBidXR0b24gYW5kIHRoZSB2b2x1bWUgc2xpZGVyLlxyXG4gICAgICAgIGNvbnN0IHZpZGVvUGxheUJ1dHRvbiA9IHRoaXMuY29udHJvbEdyb3VwPy5wbGF5QnV0dG9uRWxlbTtcclxuICAgICAgICBjb25zdCB2b2x1bWVTbGlkZXIgPSB0aGlzLmNvbnRyb2xHcm91cD8udm9sdW1lU2xpZGVyRWxlbTtcclxuICAgICAgICBpZih2aWRlb1BsYXlCdXR0b24gJiYgdm9sdW1lU2xpZGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCb29sZWFuU3RhdGUuVFJVRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgd2FpdCBtb3JlIGZvciBvdGhlciBjb250cm9sIGlucHV0cyB0byBiZSBhdmFpbGFibGUuXHJcbiAgICAgICAgLy8gVGhlIERPTSBpcyBub3QgbG9hZGVkIGVub3VnaCB5ZXQuXHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW5TdGF0ZS5VTktOT1dOO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRvb2x0aXBUZXh0KG1ldGFkYXRhPzogTWVkaWFNZXRhZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHRvb2x0aXBFbGVtID0gdGhpcy5jb250cm9sR3JvdXA/LnRvb2x0aXBFbGVtO1xyXG4gICAgICAgIGlmKCF0b29sdGlwRWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYXNlc1xyXG4gICAgICAgICAqIDEuIERpc2FibGVkIGJlY2F1c2UgbWFpbiBwYWdlXHJcbiAgICAgICAgICogMi4gRGlzYWJsZWQgYmVjYXVzZSBub24tY2hhbm5lbCBwYWdlXHJcbiAgICAgICAgICogMy4gRGlzYWJsZWQgYmVjYXVzZSBWT0QvY2xpcFxyXG4gICAgICAgICAqIDQuIFBhdXNlZFxyXG4gICAgICAgICAqIDUuIFBsYXlpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBwbGF5aW5nU3RhdGUgPSB0aGlzLnBsYXlpbmdTdGF0ZTtcclxuICAgICAgICBpZihwbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICBpZihtZXRhZGF0YT8uaXNWaWRlb0xpdmUgPT09IEJvb2xlYW5TdGF0ZS5GQUxTRSkgeyAgLy8gZmFsc2UsIG5vdCBudWxsIG5vciB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBFbGVtLnRleHRDb250ZW50ID0gXCJSYWRpbyBtb2RlIGNhbiBvbmx5IGJlIHVzZWQgaW4gbGl2ZSBzdHJlYW1cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYobWV0YWRhdGE/LmlzSW5DaGFubmVsID09PSBCb29sZWFuU3RhdGUuRkFMU0UpIHsgIC8vIGZhbHNlLCBub3QgbnVsbCBub3IgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwRWxlbS50ZXh0Q29udGVudCA9IFwiUmFkaW8gbW9kZSBpcyBvbmx5IGF2YWlsYWJsZSBpbiBzdHJlYW1lciBjaGFubmVsc1wiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRvb2x0aXBFbGVtLnRleHRDb250ZW50ID0gXCJSYWRpbyBtb2RlIGlzIGRpc2FibGVkXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYocGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHRvb2x0aXBFbGVtLnRleHRDb250ZW50ID0gXCJTdGFydCBSYWRpbyBtb2RlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYocGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0b29sdGlwRWxlbS50ZXh0Q29udGVudCA9IFwiRW5kIFJhZGlvIG1vZGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJ1cGRhdGVUb29sdGlwVGV4dCBmb3Igc3RhdGUgXCIgKyBwbGF5aW5nU3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJhZGlvQnV0dG9uQ2xpY2tlZCgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJDb250YWluZXIge1xyXG4gICAgcGxheWVyczogVmlkZW9QbGF5ZXJbXTtcclxuICAgIG5leHRJZDogbnVtYmVyO1xyXG4gICAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAxMDAwMTsgIC8vIFJhbmRvbSBzdGFydCBpbmRleCBmb3IgcGxheWVyLlxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvLyBGaW5kIGV4aXN0aW5nIHZpZGVvIHBsYXllciBlbGVtZW50cyB0byBjcmVhdGUgVmlkZW9QbGF5ZXIgb2JqZWN0c1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgLy8gRGV0ZWN0IGZ1dHVyZSB2aWRlbyBwbGF5ZXIgZWxlbWVudHNcclxuICAgICAgICBjb25zdCBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibWFpblwiKVswXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKG1haW5FbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIC8vIFRPRE86IElzIGl0IGJldHRlciB0byBpdGVyYXRlIG9ubHkgdGhlIG11dGF0ZWQgZGl2cz9cclxuICAgICAgICBjb25zdCBwbGF5ZXJFbGVtcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh2aWRlb1BsYXllckNsYXNzKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpdiBpcyBub3QgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgaWYoIWlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTmV3IHZpZGVvIHBsYXllciBkZXRlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBuZWVkIHRvIHByb2NlZWQgaWYgdGhlcmUgYXJlIHRoZSBzYW1lIG51bWJlciBvZiBwbGF5ZXJzIGluIHRoZSBsaXN0IGFuZCBpbiBET00uXHJcbiAgICAgICAgaWYocGxheWVyRWxlbXMubGVuZ3RoID09PSB0aGlzLnBsYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FyYmFnZUNvbGxlY3RQbGF5ZXJzKHBsYXllckVsZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdmlkZW8gcGxheWVycyBub3QgaW4gRE9NIGFueW1vcmUuXHJcbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiBhIHVzZXIgYnJvd3NlcyBmcm9tIGEgbm9uLWNoYW5uZWwgcGFnZSAobWFpbiwgZGlyZWN0b3J5LCBldGMuKSB0byBhIGNoYW5uZWwgcGFnZSxcclxuICAgIC8vIG9yIGJldHdlZW4gbm9uLWNoYW5uZWwgcGFnZXMuXHJcbiAgICBnYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXM6IEhUTUxDb2xsZWN0aW9uT2Y8RWxlbWVudD4pIHtcclxuICAgICAgICBjb25zdCBhbGxQbGF5ZXJJZHNJbkRvbTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgYWxsUGxheWVySWRzSW5Eb20ucHVzaChwbGF5ZXJFbGVtLmdldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkFsbCBwbGF5ZXJJZHMgaW4gRE9NOiBcIiArIGFsbFBsYXllcklkc0luRG9tKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3bGlzdCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHBsYXllci5wbGF5ZXJJZDtcclxuICAgICAgICAgICAgaWYoYWxsUGxheWVySWRzSW5Eb20uaW5kZXhPZihwbGF5ZXJJZCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld2xpc3QucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgUGxheWVyICR7cGxheWVySWR9IGlzIG5vdCBpbiBET00gYW55bW9yZS4gRGVsZXRpbmcuLmApO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXdsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5ZXJFbGVtKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGxheWVySWQgPSB2aWRlb1BsYXllcklkUHJlZml4ICsgdGhpcy5uZXh0SWQ7XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgKz0gMTtcclxuICAgICAgICBwbGF5ZXJFbGVtLnNldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIsIG5ld1BsYXllcklkKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFZpZGVvUGxheWVyKG5ld1BsYXllcklkLCB0aGlzLCBwbGF5ZXJFbGVtKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlRXhjZXB0KHBsYXllcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgaWYocGxheWVyLnBsYXllcklkICE9PSBwbGF5ZXJJZCkgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaWxsIHRoaXMgZnVuY3Rpb24gZXZlciBiZSB1c2VkP1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIlxyXG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbnRhaW5lciB9IGZyb20gXCIuL3ZpZGVvX3BsYXllcl9jb250YWluZXJcIjtcclxuXHJcblxyXG52YXIgY29udGFpbmVyID0gbmV3IFZpZGVvUGxheWVyQ29udGFpbmVyKCk7XHJcbmNvbnRhaW5lci5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==