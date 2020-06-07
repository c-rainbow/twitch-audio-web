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
        this.tryUpdatingControlGroup();
        this.controlGroupObserver = new MutationObserver(this.tryUpdatingControlGroup.bind(this));
        this.controlGroupObserver.observe(this.playerElem, domObserverConfig);
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
    enable() {
        const state = this.playingState;
        if (state === "disabled" /* DISABLED */) {
            this.pause();
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
        var _a, _b;
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
            console.log("Play started");
        };
        this.audioElem.play().then(audioPlayCallback.bind(this));
        this.playingState = "playing" /* PLAYING */;
        // Stop the video if playing
        this.pauseVideo();
        (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.updateForPlay();
    }
    pause() {
        var _a;
        if (this.playingState !== "playing" /* PLAYING */) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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QUFDLEVBQUU7WUFDeEIsT0FBTztTQUNWO1FBQ0QsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTFCLE1BQU0sV0FBVyxHQUFHLG1CQUFtQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDakIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQ0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQjtRQUN4QixLQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUIsSUFBRyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVE7Z0JBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztJQUVELE9BQU87O1FBQ0gsVUFBSSxDQUFDLFFBQVEsMENBQUUsVUFBVSxHQUFHO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLEtBQUksSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQ0o7OztBQzFuQitEO0FBR2hFLElBQUksdUJBQVMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFDM0MsdUJBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwiXHJcbmNvbnN0IHR3aXRjaERvbWFpbiA6IHN0cmluZyA9IFwidHdpdGNoLnR2L1wiO1xyXG4vLyBOb24tZXhodWFzdGl2ZSBsaXN0IG9mIG5vbi1jaGFubmVsIHJvdXRlcyBpbiB0d2l0Y2gudHZcclxuY29uc3Qgbm9uQ2hhbm5lbHMgOiBzdHJpbmdbXSA9IFtcclxuICAgIFwiXCIsIFwiZGlyZWN0b3J5XCIsIFwidmlkZW9zXCIsIFwidVwiLCBcInNldHRpbmdzXCIsIFwiZnJpZW5kc1wiLCBcInN1YnNjcmlwdGlvbnNcIiwgXCJpbnZlbnRvcnlcIiwgXCJ3YWxsZXRcIl07XHJcblxyXG5jb25zdCBhcGlEb21haW4gOiBzdHJpbmcgPSBcImFwaS50d2l0Y2gudHYvYXBpL2NoYW5uZWxzL1wiO1xyXG5jb25zdCBhY2Nlc3NUb2tlbiA6IHN0cmluZyA9IFwiL2FjY2Vzc190b2tlblwiO1xyXG5cclxuY29uc3QgdXNoZXJEb21haW4gOiBzdHJpbmcgPSBcInVzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvXCI7XHJcbmNvbnN0IHVzaGVyRXh0IDogc3RyaW5nID0gXCIubTN1OFwiO1xyXG5cclxuXHJcbi8vIEV4dHJhY3QgYXVkaW9fb25seSBzdHJlYW0gLm0zdTggZnJvbSB0aGUgbWFzdGVyIHBsYXlsaXN0IGNvbnRlbnQuXHJcbi8vIFJldHVybnMgdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBhIFVSTCBhZnRlciBhdWRpb19vbmx5IG1ldGFkYXRhLlxyXG4vLyBUT0RPOiBUaGlzIHdvcmtzLCBidXQgZXZlbnR1YWxseSB3ZSB3aWxsIG5lZWQgdG8gZnVsbHkgcGFyc2UgdGhlIGNvbnRlbnRcclxuLy8gYW5kIGdldCBhdWRpb19vbmx5IHN0cmVhbSB1cmxcclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQ6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgaWYoIWNvbnRlbnQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICBsZXQgYXVkaW9Pbmx5Rm91bmQgPSBmYWxzZTtcclxuICAgIGZvcihsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwiYXVkaW9fb25seVwiKSkgYXVkaW9Pbmx5Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChhdWRpb09ubHlGb3VuZCAmJiBsaW5lLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVdlYlVybCgpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XHJcbiAgICBjb25zdCBzcGxpdGVkID0gdXJsLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IGZpbHRlcmVkID0gc3BsaXRlZC5maWx0ZXIoZWxlbSA9PiBlbGVtLmxlbmd0aCA+IDApO1xyXG4gICAgaWYoZmlsdGVyZWQubGVuZ3RoICE9IDEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gICBcclxuXHJcbiAgICBjb25zdCBjaGFubmVsID0gZmlsdGVyZWRbMF07XHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChub25DaGFubmVscy5pbmRleE9mKGNoYW5uZWwpICE9IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVRva2VuVXJsKGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3MoYWNjZXNzVG9rZW5VcmwsIGFwaURvbWFpbiwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIGFjY2VzcyB0b2tlbjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVXNoZXJVcmwodXNoZXJVcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1c2hlclVybCwgdXNoZXJEb21haW4sIHVzaGVyRXh0KTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCB1c2hlcjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuLy8gR2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIHN0YXJ0U3RyIGFuZCB0aGUgZmlyc3QgZW5kU3RyIGFmdGVyIHN0YXJ0U3RyLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKFxyXG4gICAgICAgIHVybDogc3RyaW5nLCBzdGFydFN0cjogc3RyaW5nLCBlbmRTdHI6IHN0cmluZywgZW5kT3B0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkgOiBzdHJpbmcge1xyXG4gICAgbGV0IHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzdGFydFN0cik7XHJcbiAgICBpZihzdGFydEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgc3RhcnRJbmRleCArPSBzdGFydFN0ci5sZW5ndGg7XHJcblxyXG4gICAgbGV0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoZW5kU3RyLCBzdGFydEluZGV4ICsgMSk7XHJcbiAgICBpZihlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICBpZihlbmRPcHRpb25hbCkgZW5kSW5kZXggPSB1cmwubGVuZ3RoO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsLnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbn1cclxuXHJcblxyXG4vLyBUT0RPOiBJbnN0ZWFkIG9mIHByZS1kZWZpbmVkIHVybCBmb3JtYXQsIHVzZSByZWNlbnRseSB1c2VkIG9udCBpbiBUd2l0Y2ggd2ViXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW46IHN0cmluZywgc2lnOiBzdHJpbmcpIDogVXNoZXJVcmwge1xyXG4gICAgY29uc3QgdXNoZXJVcmwgPSBuZXcgVXNoZXJVcmwoYGh0dHBzOi8vdXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy8ke2NoYW5uZWx9Lm0zdThgKTtcclxuICAgIHVzaGVyVXJsLnVwZGF0ZSh0b2tlbiwgc2lnKTtcclxuXHJcbiAgICAvLyBJdCBpcyBub3QgY2xlYXIgaWYgYWxsIG9mIHRoZXNlIHBhcmFtcyBhcmUgcmVxdWlyZWQgb3IgaWYgdGhlcmUgYXJlIGFueSBtaXNzaW5nIG9uZXMuXHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInBsYXllclwiLCBcInR3aXRjaHdlYlwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfc291cmNlXCIsIFwidHJ1ZVwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwidHlwZVwiLCBcImFueVwiKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHVzaGVyVXJsO1xyXG59XHJcblxyXG5cclxuLy8gSW50ZXJmYWNlIHRvIGNvbW11bmljYXRlIGJldHdlZW4gYmFja2dyb3VuZCBhbmQgY29udGVudHNjcmlwdFxyXG4vLyB0byByZXF1ZXN0L3Jlc3BvbmQgYWNjZXNzIHRva2VuIFVSTCBhbmQgdXNoZXIgVVJMIGZvciBhIGNoYW5uZWwuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJsc1Jlc3BvbnNlIHtcclxuICAgIHdlYlVybDogVXJsR3JvdXA7XHJcbiAgICBsYXN0UmVxdWVzdGVkOiBVcmxHcm91cDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXJsR3JvdXAge1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgYWNjZXNzVG9rZW5Vcmw6IHN0cmluZztcclxuICAgIHVzaGVyVXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vLyBDbGFzcyB0byBzdG9yZSBhbmQgbWFuaXB1bGF0ZSB1c2hlciBVUkwuXHJcbmV4cG9ydCBjbGFzcyBVc2hlclVybCB7XHJcbiAgICBvcmlnaW5hbFVybDogc3RyaW5nO1xyXG4gICAgdXJsT2JqZWN0OiBVUkw7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBleHBpcmVzQXQ6IG51bWJlcjsgIC8vIFRva2VuIGV4cGlyYXRpb24gZGF0ZXRpbWUgaW4gZXBvY2ggc2Vjb25kc1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFVybCA9IHVybDtcclxuICAgICAgICB0aGlzLnVybE9iamVjdCA9IG5ldyBVUkwodXJsKTtcclxuICAgICAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmdldENoYW5uZWwoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfYXVkaW9fb25seVwiLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5leHBpcmVkVXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc1NpbmNlRXBvY2ggPSBNYXRoLnJvdW5kKG5vdy5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgICAgICAvLyA2MCBzZWNvbmRzIGJ1ZmZlciBiZWZvcmUgdG9rZW4gZXhwaXJhdGlvblxyXG4gICAgICAgIGlmKHNlY29uZHNTaW5jZUVwb2NoICsgNjAgPCB0aGlzLmV4cGlyZXNBdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVcmwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQ2FjaGVkIFVSTCBmb3IgJHt0aGlzLmNoYW5uZWx9IGlzIGV4cGlyZWRgKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsT2JqZWN0LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aCh1cmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCI/XCIpO1xyXG4gICAgICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsLnN1YnN0cmluZygwLCBlbmRJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UXVlcnlTdHJpbmcoa2V5OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5nZXQoa2V5KTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UXVlcnlTdHJpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLnNldChuYW1lLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhwaXJlc0F0KCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHRva2VuU3RyaW5nID0gdGhpcy5nZXRRdWVyeVN0cmluZyhcInRva2VuXCIpO1xyXG4gICAgICAgIGlmKCF0b2tlblN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuSnNvbiA9IEpTT04ucGFyc2UodG9rZW5TdHJpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBleHBpcmVzQXQgPSB0b2tlbkpzb24uZXhwaXJlcyBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzQXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IHBhcnNlIHRva2VuIGluIHVzaGVyIFVSTC4gRXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFubmVsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHRoaXMub3JpZ2luYWxVcmwpO1xyXG4gICAgICAgIHJldHVybiBjaGFubmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdUb2tlbjogc3RyaW5nLCBuZXdTaWc6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiLCBuZXdUb2tlbik7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInNpZ1wiLCBuZXdTaWcpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJwXCIsIHRoaXMuZ2V0UmFuZG9tTnVtYmVyKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbU51bWJlcigpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHsgYnVpbGRVc2hlclVybCwgcGFyc2VBdWRpb09ubHlVcmwsIFVybEdyb3VwIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQ29udGVudCh1cmw6IHN0cmluZykge1xyXG4gICAgaWYoIXVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdGhlIHN0YXR1cyBpZiBva1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiByZXNwVGV4dDtcclxuICAgIH1cclxuICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYGZldGNoQ29udGVudCB0aHJldyBhbiBlcnJvcjogJHtlcnJ9YClcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSnNvbih1cmw6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXJsKTtcclxuICAgIGlmKHJlc3BUZXh0KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcEpzb24gPSBKU09OLnBhcnNlKHJlc3BUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BKc29uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBjb3VsZCBub3QgYmUgcGFyc2VkIHRvIEpTT046IFwiICsgcmVzcFRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXVkaW9TdHJlYW1VcmwodXNoZXJVcmw6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgY29udGVudCA9IGF3YWl0IGZldGNoQ29udGVudCh1c2hlclVybCk7XHJcbiAgICBjb25zdCBzdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChjb250ZW50KTtcclxuICAgIHJldHVybiBzdHJlYW1Vcmw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuVXJsOiBzdHJpbmcsIGxhc3RSZXF1ZXN0ZWRDaGFubmVsOiBzdHJpbmcsXHJcbiAgICAgICAgbGFzdFJlcXVzdGVkVXNoZXJVcmw6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgLy8gR2V0IG5ldyB0b2tlbiBhbmQgc2lnIGZyb20gYWNjZXNzIHRva2VuIFVSTFxyXG4gICAgY29uc3QgcmVzcEpzb24gPSBhd2FpdCBmZXRjaEpzb24odG9rZW5VcmwpO1xyXG4gICAgaWYoIXJlc3BKc29uKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24udG9rZW4gYXMgc3RyaW5nO1xyXG4gICAgY29uc3Qgc2lnID0gcmVzcEpzb24uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFubmVsIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjaGFubmVsIG9mIHRoZSBsYXN0IHJlcXVlc3RlZCB1c2hlciB1cmxcclxuICAgIC8vIChUaGlzIGlzIHBvc3NpYmxlIGlmIHRoZSBjaGFubmVsJ3Mgc3RyZWFtZXIgaXMgaG9zdGluZyBhbm90aGVyIGNoYW5uZWwpXHJcbiAgICBpZihsYXN0UmVxdWVzdGVkQ2hhbm5lbCAmJiBjaGFubmVsICE9PSBsYXN0UmVxdWVzdGVkQ2hhbm5lbCkge1xyXG4gICAgICAgIGlmKGxhc3RSZXF1c3RlZFVzaGVyVXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXN0UmVxdXN0ZWRVc2hlclVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBuZXcgb25lIGFuZCBzdG9yZSBpdFxyXG4gICAgICAgIGNvbnN0IHVzaGVyVXJsID0gYnVpbGRVc2hlclVybChsYXN0UmVxdWVzdGVkQ2hhbm5lbCwgdG9rZW4sIHNpZyk7XHJcbiAgICAgICAgcmV0dXJuIHVzaGVyVXJsLmdldFVybCgpOyAgXHJcbiAgICB9ICBcclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyeUZldGNoaW5nUGxheWxpc3QoZ3JvdXA6IFVybEdyb3VwKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBpZighZ3JvdXApIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuIFxyXG4gICAgLy8gc2VlIGlmIHRoZSBleGlzdGluZyB1c2hlciB1cmwgY2FuIGJlIHVzZWRcclxuICAgIGlmKGdyb3VwLnVzaGVyVXJsKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQoZ3JvdXAudXNoZXJVcmwpO1xyXG4gICAgICAgIGlmKHJlc3BUZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwVGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWdyb3VwLmFjY2Vzc1Rva2VuVXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IG5ldyB0b2tlbiBhbmQgc2lnIGZyb20gYWNjZXNzIHRva2VuIFVSTFxyXG4gICAgY29uc3QgcmVzcEpzb24gPSBhd2FpdCBmZXRjaEpzb24oZ3JvdXAuYWNjZXNzVG9rZW5VcmwpO1xyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbj8udG9rZW4gYXMgc3RyaW5nO1xyXG4gICAgY29uc3Qgc2lnID0gcmVzcEpzb24/LnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXdVc2hlclVybCA9IGJ1aWxkVXNoZXJVcmwoZ3JvdXAuY2hhbm5lbCwgdG9rZW4sIHNpZyk7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChuZXdVc2hlclVybC5nZXRVcmwoKSk7XHJcbiAgICByZXR1cm4gcmVzcFRleHQ7XHJcbn0iLCJcclxuaW1wb3J0IHsgdHJ5RmV0Y2hpbmdQbGF5bGlzdCB9IGZyb20gXCIuL2ZldGNoXCI7XHJcbmltcG9ydCB7IGdldENoYW5uZWxGcm9tV2ViVXJsLCBHZXRVcmxzUmVzcG9uc2UsIHBhcnNlQXVkaW9Pbmx5VXJsIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuLy8gVE9ETzogQW55IGJldHRlciB3YXkgdGhhbiBIVE1MIGFzIHN0cmluZz9cclxuY29uc3QgaW5pdGlhbEJ1dHRvbkRvbSA9IGBcclxuPGRpdiBjbGFzcz1cInR3LWlubGluZS1mbGV4IHR3LXJlbGF0aXZlIHR3LXRvb2x0aXAtd3JhcHBlciByYWRpby1tb2RlLWJ1dHRvbi13cmFwcGVyXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwicmFkaW8tbW9kZS1idXR0b24gdHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWFsaWduLW1pZGRsZSB0dy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJ1dHRvbi1pY29uIHR3LWJ1dHRvbi1pY29uLS1vdmVybGF5IHR3LWNvcmUtYnV0dG9uIHR3LWNvcmUtYnV0dG9uLS1vdmVybGF5IHR3LWlubGluZS1mbGV4IHR3LWludGVyYWN0aXZlIHR3LWp1c3RpZnktY29udGVudC1jZW50ZXIgdHctb3ZlcmZsb3ctaGlkZGVuIHR3LXJlbGF0aXZlXCJcclxuICAgICAgICAgICAgZGF0YS1hLXRhcmdldD1cInJhZGlvLW1vZGUtYnV0dG9uXCJcclxuICAgICAgICAgICAgZGF0YS1yYWRpby1tb2RlLXN0YXRlPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiUmFkaW8gTW9kZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctZmxleCB0dy1mbGV4LWdyb3ctMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3LWJ1dHRvbi1pY29uX19pY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWljb24tZGl2XCIgc3R5bGU9XCJ3aWR0aDogMnJlbTsgaGVpZ2h0OiAycmVtO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gR29vZ2xlIE1hdGVyaWFsIERlc2lnbiBSYWRpbyBJY29uLiBBcGFjaGUgTGljZW5zZSB2Mi4wIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJ0dy1pY29uX19zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zLjI0IDYuMTVDMi41MSA2LjQzIDIgNy4xNyAyIDh2MTJjMCAxLjEuODkgMiAyIDJoMTZjMS4xMSAwIDItLjkgMi0yVjhjMC0xLjExLS44OS0yLTItMkg4LjNsOC4yNi0zLjM0TDE1Ljg4IDEgMy4yNCA2LjE1ek03IDIwYy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3ptMTMtOGgtMnYtMmgtMnYySDRWOGgxNnY0elwiLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxkaXYgY2xhc3M9XCJ0dy10b29sdGlwIHR3LXRvb2x0aXAtLWFsaWduLWxlZnQgdHctdG9vbHRpcC0tdXBcIiBkYXRhLWEtdGFyZ2V0PVwidHctdG9vbHRpcC1sYWJlbFwiIHJvbGU9XCJ0b29sdGlwXCI+XHJcbiAgICAgICAgXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5jb25zdCBwcm9jZXNzZWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHByb2Nlc3NlZEF0dHJWYWwgPSBcInByb2Nlc3NlZFwiXHJcblxyXG5jb25zdCB2aWRlb1BsYXllclN0YXRlQXR0ciA9IFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiO1xyXG5cclxuY29uc3QgcmFkaW9Nb2RlU3RhdGVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtc3RhdGVcIjtcclxuY29uc3QgcGxheWVySWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcGxheWVyLWlkXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVySW5DaGFubmVsQXR0ciA9IFwiZGF0YS1yYWRpby1tb2RlLWluLWNoYW5uZWxcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJJc0xpdmVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtaXMtbGl2ZVwiO1xyXG5cclxuY29uc3QgdmlkZW9QbGF5ZXJDbGFzcyA9IFwidmlkZW8tcGxheWVyXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MgPSBcInZpZGVvLXBsYXllci1wcm9jZXNzZWRcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJJZFByZWZpeCA9IHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MgKyBcIi1cIjtcclxuY29uc3QgY29udHJvbEdyb3VwQ2xhc3MgPSBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCI7XHJcbmNvbnN0IHBsYXlCdXR0b25BdHRyID0gXCJidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLXBsYXktcGF1c2UtYnV0dG9uJ11cIjtcclxuY29uc3Qgdm9sdW1lU2xpZGVyQXR0ciA9IFwiaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXVwiO1xyXG5cclxuY29uc3QgYXR0ck9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBzdWJ0cmVlOiBmYWxzZSB9O1xyXG5jb25zdCBkb21PYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogZmFsc2UsIGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgVmlkZW9QbGF5ZXJDb250YWluZXIsIGFkZCBNdXRhdGlvbk9ic2VydmVyIHRvIFxyXG4gKiAxLiBkb2N1bWVudC5ib2R5IGNoZWNrcyBmb3Igb25lIHN1YnRyZWUgY2hhbmdlXHJcbiAqICAgMS0yLiBJZiBkaXYgd2l0aCBjbGFzcyBcInZpZGVvLXBsYXllclwiLCBwcm9jZXNzIGl0LiBDaGVjayAjMlxyXG4gKiBcclxuICogMi4gQ3JlYXRlIFZpZGVvUGxheWVyLCB2aWRlby1wbGF5ZXIgY2xhc3MgZGl2IGNoZWNrcyBmb3IgMSBhdHRyaWJ1dGUgY2hhbmdlLCAzIHN1YnRyZWUgY2hhbmdlc1xyXG4gKiAgIDItMS4gYXR0cmlidXRlIFwiZGF0YS1hLXBsYXllci10eXBlXCI6IFwic2l0ZVwiLCBcInNpdGVfbWluaVwiLCBcImNsaXBzLXdhdGNoXCIsIFwiY2hhbm5lbF9ob21lX2Nhcm91c2VsXCJcclxuICogICAgIDItMi0yLiBDaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgaWYgbmVjZXNzYXJ5XHJcbiAqICAgICAyLTItMy4gTW9kZTogVHVwbGUgb2YgKGxheW91dCwgdmlkZW9fdHlwZSkuXHJcbiAqICAgICAgIDItMi0zLTEuIGxheW91dDogXCJzaXRlXCIgfCBcInNpdGVfbWluaVwiXHJcbiAqICAgICAgIDItMi0zLTIuIHZpZGVvX3R5cGU6IFwibGl2ZVwiLCBcInZvZFwiLCBcImNsaXBcIi4uIGFuZCBtb3JlPz8/Pz9cclxuICogICAyLTIuIHN1YnRyZWUgZGl2IHdpdGggY2xhc3MgXCJ2b2Qtc2Vla2Jhci10aW1lLWxhYmVsc1wiIGFuZCBcInNlZWtiYXItaW50ZXJhY3Rpb24tYXJlYVwiXHJcbiAqICAgICAyLTItMS4gVGhpcyBvbmx5IGFwcGVhcnMgaW4gVk9EIHdhdGNoXHJcbiAqICAgICAyLTItMi4gSWYgY3JlYXRlZCwgY2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIHRvIFZPRFxyXG4gKiAgICAgMi0yLTMuIElmIHJlbW92ZWQgKGNoYW5nZWQgZnJvbSBWT0QgdG8gbGl2ZS9jbGlwKSwgPz8/P1xyXG4gKiAgIDItMy4gY2hlY2sgZm9yIGNvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiXHJcbiAqICAgICAyLTMtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzMgZm9yIGFjdGlvbnNcclxuICogICAgIDItMy0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiAgIDItNC4gY2hlY2sgZm9yIFwidmlkZW9cIiBlbGVtZW50IGluIHRoZSBwbGF5ZXJcclxuICogICAgIDItNC0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNiBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi00LTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqIFxyXG4gKiAzLiBDb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIiBjaGVja3MgZm9yIFxyXG4gKiAgIDMtMS4gc3VidHJlZSBidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLXBsYXktcGF1c2UtYnV0dG9uJ10gZm9yIHZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uXHJcbiAqICAgICAzLTEtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzRcclxuICogICAgIDMtMS0yLiBJZiByZW1vdmVkICh3aGVuIHBsYXllciB0eXBlIGNoYW5nZWQgZnJvbSBcInNpdGVcIiB0byBcInNpdGVfbWluaVwiLCBldGMpLCA/Pz8/P1xyXG4gKiAgIDMtMi4gc3VidHJlZSBpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddIGZvciB2b2x1bWUgc2xpZGVyXHJcbiAqICAgICAzLTItMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzVcclxuICogICAgIDMtMi0yLiBJZiByZW1vdmVkICh3aGVuIHBsYXllciB0eXBlIGNoYW5nZWQgZnJvbSBcInNpdGVcIiB0byBcInNpdGVfbWluaVwiLCBldGMpLCA/Pz8/P1xyXG4gKiAgIDMtMy4gSWYgYm90aCBjb21wb25lbnRzIGluIDMtMSBhbmQgMy0yIGFyZSByZWFkeTpcclxuICogICAgIDMtMy0xLiBDcmVhdGUgcmFkaW8gbW9kZSBidXR0b24sIGFuZCBwdXQgTXV0YXRpb25PYnNlcnZlciAoc2VlICM0IGFuZCAjNSlcclxuICogICAgIDMtMy0yLiBJZiBhdCBsZWFzdCBvbmUgY29tcG9uZW50IGlzIHJlbW92ZWQgKHNpdGUtPnNpdGVfbWluaSBjaGFuZ2UsIGV0YylcclxuICogICAgICAgMy0zLTItMS4gYWxzbyByZW1vdmUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGZyb20gRE9NXHJcbiAqIFxyXG4gKiA0LiBWaWRlbyBwbGF5L3BhdXNlIGJ1dHRvbiBjaGVja3MgZm9yXHJcbiAqICAgNC0xLiBBdHRyaWJ1dGUgY2hhbmdlIHZpZGVvUGxheWVyU3RhdGVBdHRyOiBcInBsYXlpbmdcIiBvciBcInBhdXNlZFwiXHJcbiAqICAgICA0LTEtMS4gSWYgYXR0cmlidXRlIHZhbHVlIGNoYW5nZWQgdG8gXCJwbGF5aW5nXCIsIHN0b3AgYWxsIGF1ZGlvIGluIHRoZSBWaWRlb1BsYXllckNvbnRhaW5lclxyXG4gKiBcclxuICogNS4gVm9sdW1lIHNsaWRlciBjaGVja3MgZm9yXHJcbiAqICAgNS0xLiBBdHRyaWJ1dGUgXCJ2YWx1ZVwiIGNoYW5nZTogbnVtYmVyIGJldHdlZW4gMCA8PSBudW0gPD0gMVxyXG4gKiAgICAgNS0xLTEuIElmIGNoYW5nZSBpcyBkZXRlY3RlZCwgYXBwbHkgdGhlIG5ldyB2b2x1bWUgdG8gYXVkaW9FbGVtLlxyXG4gKiBcclxuICogNi4gb3JpZ2luYWwgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdmlkZW8tcGxheWVyIGNoZWNrcyBmb3JcclxuICogICA2LTEuIEF0dHJpYnV0ZSBcInNyY1wiIGNoYW5nZTogbWVhbnMgdGhhdCB0aGUgdmlkZW8gc291cmNlIGNoYW5nZWQgKGxpa2VseSBob3N0aW5nIGFub3RoZXIgc3RyZWFtZXIpXHJcbiAqICAgICA2LTEtMS4gUmFkaW8gbW9kZSBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkPyBSZS1jb25maWd1cmVkIHdpdGggdGhlIG5ldyBzdHJlYW1lcidzIFVSTD9cclxuICogICAgXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEhvdyB0byBkZXRlY3QgdGhlIGNoYW5uZWwgb2YgdGhlIHN0cmVhbSBiZWluZyBwbGF5ZWQ/XHJcbiAqIEdldHRpbmcgY2hhbm5lbCBuYW1lIGZyb20gVVJMIGhhcyB0aGUgZm9sbGxvd2luZyBpc3N1ZXNcclxuICogKDEpIFN0cmVhbWVyIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsXHJcbiAqICgyKSBNYWluIHBhZ2UuIENoYW5uZWwgY2FuIGNoYW5nZSBxdWlja2x5IGluIHRoZSBjYXJvdXNlbFxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBLZWVwIHRoZSBsYXN0IHJlcXVlc3RlZCB1c2hlciBVUkwgaW4gdGhlIHRhYi4gR3Vlc3MgdGhlIGNoYW5uZWwgZnJvbSB0aGVyZVxyXG4gKiAoMikgRm9yIFwic2l0ZV9taW5pXCIgc3RhdGUsIHN0b3JlIHRoZSBjaGFubmVsIG5hbWUgaW4gdmlkZW8gcGxheWVyLlxyXG4gKiAgICAgSW4gdGhhdCBjYXNlLCBpdCB3aWxsIGJlIHBvc3NpYmxlIHRvIHJlc3VtZSBwbGF5aW5nIGluIHRoZSByaWdodCBjaGFubmVsLlxyXG4gKiAoMykgRGlzYWJsZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gaW4gdGhlIG1haW4gcGFnZVxyXG4gKiBcclxuICovXHJcblxyXG4vKipcclxuICogQWRkIHJhZGlvIG1vZGUgYnV0dG9uIGluIHNpdGVfbWluaT9cclxuICogRG9uJ3Qgc3RvcmUgdGhlIHBsYXlzdGF0ZSBpbiBET006IG9ubHkgc3RvcmUgaXQgaW4gVmlkZW9QbGF5ZXIgY2xhc3MgYXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcclxuICovXHJcblxyXG4vKipcclxuICogRVNwb3J0cyBwYWdlOiB2aWRlbyBtaW5pcGxheWVyIGtlZXBzIHBsYXlpbmcgZXZlbiB3aGVuIHRoZSBzaXRlIHBsYXllciBpbiBFc3BvcnRzIHBhZ2UgaXMgYWxzbyBiZWluZyBwbGF5ZWQuXHJcbiAqIFNob3VsZCB0aGUgcmFkaW8gbW9kZSBmb2xsb3cgdGhlIHNhbWUgYmVoYXZpb3I/XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFjY2VzcyB0b2tlbiB1cmwgaGFzIG9hdXRoIGNvZGUsIHdoaWNoIGlzIHVuZGVmaW5lZCBpZiB0aGUgdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKiBOb3Qgc3VyZSBob3cgVHdpdGNoIHJldHVybnMgY29ycmVjdCByZXNwb25zZSBmb3IgYW5vbnltb3VzIHVzZXIgeWV0LlxyXG4gKiBDYWxsaW5nIHRoZSBzYW1lIGFjY2VzcyB0b2tlbiBVUkwgZnJvbSBjb250ZW50c2NyaXB0IHJldHVybnMgZXJyb3IuXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIERpc2FibGUgdGhlIGJ1dHRvbiB3aGVuIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICovXHJcblxyXG5jb25zdCBlbnVtIFBsYXlpbmdTdGF0ZSB7XHJcbiAgICBESVNBQkxFRCA9IFwiZGlzYWJsZWRcIixcclxuICAgIFBBVVNFRCA9IFwicGF1c2VkXCIsXHJcbiAgICBQTEFZSU5HID0gXCJwbGF5aW5nXCIsXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1Byb2Nlc3NlZChlbGVtZW50OiBFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZWxlbWVudD8uZ2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIpID09PSBwcm9jZXNzZWRBdHRyVmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXJrUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQ/LnNldEF0dHJpYnV0ZShwcm9jZXNzZWRBdHRyLCBwcm9jZXNzZWRBdHRyVmFsKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRyb2xHcm91cCB7XHJcbiAgICBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXllcjogVmlkZW9QbGF5ZXI7XHJcbiAgICBwbGF5QnV0dG9uRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcmFkaW9CdXR0b246IEhUTUxFbGVtZW50O1xyXG4gICAgdG9vbHRpcEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgY29tcG9uZW50c09ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgcGxheUJ1dHRvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdm9sdW1lT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcjogVmlkZW9QbGF5ZXIsIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gY29udHJvbEdyb3VwRWxlbTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNvbnRyb2xHcm91cEVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBQbGF5L0F1ZGlvIGJ1dHRvbiBhbmQgdm9sdW1lIHNsaWRlciBcclxuICAgICAgICBjb25zdCBwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3RvcihwbGF5QnV0dG9uQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtKTtcclxuICAgICAgICBjb25zdCB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3Iodm9sdW1lU2xpZGVyQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbSk7XHJcbiAgICAgICAgLy8gQWRkIHRoZSByYWRpbyBidXR0b24gaWYgbm90IGV4aXN0c1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgLy8gcGxheSBidXR0b24gY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighcGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnBsYXlCdXR0b25FbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQocGxheUJ1dHRvbkVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSk7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzIGlmIGEgdmlkZW8gc3RhcnRzIHRvIHBsYXkuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBuZWNlc2FzcnkgZm9yIGEgY2FzZSB3aGVuIHVzZXIgYnJvd3NlcyB0byBhIG5vbi1jaGFubmVsIHBhZ2UgKGUuZy4gbWFpbiwgZXNwb3J0cylcclxuICAgICAgICAvLyB3aGljaCBhdXRvbWF0aWNhbGx5IHBsYXlzIGEgdmlkZW8uXHJcbiAgICAgICAgdGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8oKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5QnV0dG9uRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUF1ZGlvRm9yVmlkZW8oKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtLmdldEF0dHJpYnV0ZSh2aWRlb1BsYXllclN0YXRlQXR0cik7XHJcbiAgICAgICAgaWYoc3RhdGUgPT09IFwicGxheWluZ1wiKSB7ICAvLyBWaWRlbyBzdGF0ZSBmcm9tIHBhdXNlZCB0byBwbGF5aW5nXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnBhdXNlQWxsKCk7ICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyIGluc3RhbmNlc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGp1c3RWb2x1bWUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIuYXVkaW9FbGVtICYmIHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB2b2x1bWUgPSB0aGlzLnZvbHVtZVNsaWRlckVsZW0udmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmF1ZGlvRWxlbS52b2x1bWUgPSBwYXJzZUZsb2F0KHZvbHVtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gdm9sdW1lIHNsaWRlciBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCF2b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMudm9sdW1lU2xpZGVyRWxlbS4gSWdub3JlLlxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh2b2x1bWVTbGlkZXJFbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSB2b2x1bWVTbGlkZXJFbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gdm9sdW1lU2xpZGVyXHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuYWRqdXN0Vm9sdW1lLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZvbHVtZVNsaWRlckVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpIHtcclxuICAgICAgICAvLyBEb24ndCBwcm9jZWVkIHVubGVzcyBib3RoIHBsYXlCdXR0b25FbGVtIGFuZCB2b2x1bWVTbGlkZXJFbGVtIGFyZSBhdmFpbGFibGVcclxuICAgICAgICBpZighdGhpcy5wbGF5QnV0dG9uRWxlbSB8fCAhdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBidXR0b24gd2FzIGFscmVhZHkgY3JlYXRlZCwgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFVzZSB3ZWJwYWNrIGh0bWwgbG9hZGVyXHJcbiAgICAgICAgY29uc3QgYnV0dG9uV3JhcHBlckRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgICAgICBidXR0b25XcmFwcGVyRG9tLmlubmVySFRNTCA9IGluaXRpYWxCdXR0b25Eb207XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbiA9IGJ1dHRvbldyYXBwZXJEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh0aGlzLnJhZGlvQnV0dG9uKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVcGRhdGUgcmFkaW8gYnV0dG9uIHN0YXRlXHJcbiAgICAgICAgY29uc3QgcGxheWluZ1N0YXRlID0gdGhpcy5wbGF5ZXIucGxheWluZ1N0YXRlO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgdGhpcy5wbGF5ZXIucGxheWluZ1N0YXRlKTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLm9uY2xpY2sgPSB0aGlzLnBsYXllci5vblJhZGlvQnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMucGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy50b29sdGlwRWxlbSA9IGJ1dHRvbldyYXBwZXJEb20uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInR3LXRvb2x0aXBcIik/LlswXSBhcyBIVE1MRWxlbWVudDsgIFxyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQocGxheWluZ1N0YXRlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtLmFwcGVuZENoaWxkKGJ1dHRvbldyYXBwZXJEb20pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBsYXkoKSB7XHJcbiAgICAgICAgLy8gTk9URTogVGhlcmUgaXMgMX4zIHNlY29uZHMgb2YgZGVsYXkgYmV0d2VlbiByYWRpby1tb2RlIGJ1dHRvbiBjbGljayBhbmQgc291bmQgYmVpbmcgcGxheWVkLlxyXG4gICAgICAgIC8vIEl0J3MgYmV0dGVyIHRvIHNob3cgc29tZSBpbnRlcm1lZGlhdGUgc3RhdGUgKGljb24gY2hhbmdlLCBtb3VzZSBjdXJzb3IgY2hhbmdlLCBldGMpIGluIHRoZSBtZWFud2hpbGVcclxuICAgICAgICBcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbj8uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLlBMQVlJTkcpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQoUGxheWluZ1N0YXRlLlBMQVlJTkcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBhdXNlKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uPy5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuUEFVU0VEKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXBUZXh0KFBsYXlpbmdTdGF0ZS5QQVVTRUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvckRpc2FibGVkKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uPy5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuRElTQUJMRUQpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcFRleHQoUGxheWluZ1N0YXRlLkRJU0FCTEVEKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUb29sdGlwVGV4dChuZXdTdGF0ZTogUGxheWluZ1N0YXRlKSB7XHJcbiAgICAgICAgaWYoIXRoaXMudG9vbHRpcEVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRleHQgPSBcIlJhZGlvIG1vZGVcIjtcclxuICAgICAgICBpZihuZXdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBcIlJhZGlvIG1vZGUgY2FuIG9ubHkgYmUgdXNlZCBpbiBsaXZlIHN0cmVhbSBpbiBzdHJlYW1lcidzIGNoYW5uZWxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihuZXdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBBVVNFRCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gXCJTdGFydCBSYWRpbyBtb2RlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYobmV3U3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBcIkVuZCBSYWRpbyBtb2RlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwidXBkYXRlVG9vbHRpcFRleHQgZm9yIHN0YXRlIFwiICsgbmV3U3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgLy8gSXMgdGhpcyBuZWNlc3Nhcnk/XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50b29sdGlwRWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFZpZGVvUGxheWVyIHtcclxuICAgIHBsYXllcklkOiBzdHJpbmc7XHJcbiAgICBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyO1xyXG4gICAgcGxheWVyRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwbGF5aW5nU3RhdGU6IFBsYXlpbmdTdGF0ZTtcclxuICAgIGF0dHJpYnV0ZU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgY29udHJvbEdyb3VwOiBDb250cm9sR3JvdXA7XHJcbiAgICBjb250cm9sR3JvdXBPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGhsczogSGxzO1xyXG4gICAgYXVkaW9FbGVtOiBIVE1MVmlkZW9FbGVtZW50O1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJZDogc3RyaW5nLCBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyLCBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0gPSBwbGF5ZXJFbGVtO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKSA/IFBsYXlpbmdTdGF0ZS5QQVVTRUQgOiBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcblxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cE9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbnRyb2xHcm91cC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cE9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5ZXJFbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKGNvbnRyb2xHcm91cEVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZW5hYmxlKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5wbGF5aW5nU3RhdGU7XHJcbiAgICAgICAgaWYoc3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JEaXNhYmxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkobWVkaWFVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlICE9PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFtZWRpYVVybCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTm8gbWVkaWFVcmwgaXMgZm91bmQgdG8gcGxheVwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmF1ZGlvRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiQXVkaW8gZWxlbWVudCBhbHJlYWR5IGV4aXN0c1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgc2VwYXJhdGUgPHZpZGVvPiBlbGVtZW50IHRvIHBsYXkgYXVkaW8uXHJcbiAgICAgICAgLy8gPGF1ZGlvPiBjYW4gYmUgYWxzbyB1c2VkIGJ5IGhscy5qcywgYnV0IFR5cGVzY3JpcHQgZm9yY2VzIHRoaXMgdG8gYmUgSFRNTFZpZGVvRWxlbWVudC5cclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IDxIVE1MVmlkZW9FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbS5jbGFzc0xpc3QuYWRkKFwibm9kaXNwbGF5XCIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGxheSgpLnRoZW4oYXVkaW9QbGF5Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdG9wIHRoZSB2aWRlbyBpZiBwbGF5aW5nXHJcbiAgICAgICAgdGhpcy5wYXVzZVZpZGVvKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSAhPT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmhscykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFwiRE9NRXhjZXB0aW9uOiBUaGUgcGxheSgpIHJlcXVlc3Qgd2FzIGludGVycnVwdGVkIGJ5IGEgY2FsbCB0byBwYXVzZSgpXCJcclxuICAgICAgICAgICAgICAgIC8vIGlzIHRocm93biB3aGVuIHVzZXIgcGF1c2VzIHRoZSBhdWRpbyB0b28gcXVpY2tseSBhZnRlciBwbGF5aW5nLlxyXG4gICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIGlzIG5lZWRlZC4gVGhlIGF1ZGlvIHdpbGwgYmUgcGF1c2VkIGNvcnJlY3RseSBhbnl3YXkuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5obHMuc3RvcExvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGV0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyB0aGF0IHRoZSBITFMgb2JqZWN0IGdldHMgc3R1Y2sgYWZ0ZXIgbXVsdGlwbGUgcGxheXMgYW5kIHBhdXNlc1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyByZS11c2VkIGZvciB0aGUgbmV4dCBwbGF5LiBOZWVkIHRvIGRlc3Ryb3kgdGhlIG9iamVjdCBhbmQgcmUtY3JlYXRlIGl0LlxyXG4gICAgICAgICAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyRWxlbS5yZW1vdmVDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQYXVzZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBvblBhdXNlID0gZnVuY3Rpb24ocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYocmVzdWx0LmF1dG9wbGF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlWaWRlbygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ2F1dG9wbGF5J10sIG9uUGF1c2UuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVZpZGVvKCkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlVmlkZW9TdGF0ZUlmKFwicGF1c2VkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlVmlkZW8oKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVWaWRlb1N0YXRlSWYoXCJwbGF5aW5nXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVZpZGVvU3RhdGVJZihleHBlY3RlZFN0YXRlOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2aWRlb1BsYXlCdXR0b24gPSB0aGlzLmNvbnRyb2xHcm91cD8ucGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZSA9IHZpZGVvUGxheUJ1dHRvbj8uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZih2aWRlb1N0YXRlID09PSBleHBlY3RlZFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZpZGVvUGxheUJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyc1xyXG4gICAgcGF1c2VBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdoYXQgZWxzZSB0byBkbyBoZXJlP1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFBsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgaWYoIWNoYW5uZWwpIHtcclxuICAgICAgICAgICAgLy8gQ3VycmVudGx5IGluIGEgbm9uLWNoYW5uZWwgcGFnZS4gRGlzYWJsZSBcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2FsbGJhY2sgPSBhc3luYyBmdW5jdGlvbihyZXNwb25zZTogR2V0VXJsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmKCFyZXNwb25zZT8ud2ViVXJsPy5jaGFubmVsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50bHkgaW4gYSBub24tY2hhbm5lbCBwYWdlLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwbGF5bGlzdCA9IGF3YWl0IHRyeUZldGNoaW5nUGxheWxpc3QocmVzcG9uc2Uud2ViVXJsKTtcclxuICAgICAgICAgICAgaWYoIXBsYXlsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPZmZsaW5lIG9yIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYXVkaW9TdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChwbGF5bGlzdCk7XHJcbiAgICAgICAgICAgIGlmKGF1ZGlvU3RyZWFtVXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdCh0aGlzLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheShhdWRpb1N0cmVhbVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHttZXNzYWdlOiBcImdldF9hdWRpb191cmxcIiwgY2hhbm5lbDogY2hhbm5lbH0sIHJlc3BvbnNlQ2FsbGJhY2suYmluZCh0aGlzKSk7IFxyXG4gICAgfVxyXG5cclxuICAgIG9uUmFkaW9CdXR0b25DbGlja2VkKCkge1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnBsYXlpbmdTdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QQVVTRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RQbGF5KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUExBWUlORzpcclxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBWaWRlb1BsYXllckNvbnRhaW5lciB7XHJcbiAgICBwbGF5ZXJzOiBWaWRlb1BsYXllcltdO1xyXG4gICAgbmV4dElkOiBudW1iZXI7XHJcbiAgICBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLm5leHRJZCA9IDEwMDAxOyAgLy8gUmFuZG9tIHN0YXJ0IGluZGV4IGZvciBwbGF5ZXIuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIC8vIEZpbmQgZXhpc3RpbmcgdmlkZW8gcGxheWVyIGVsZW1lbnRzIHRvIGNyZWF0ZSBWaWRlb1BsYXllciBvYmplY3RzXHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QoKTtcclxuICAgICAgICAvLyBEZXRlY3QgZnV0dXJlIHZpZGVvIHBsYXllciBlbGVtZW50c1xyXG4gICAgICAgIGNvbnN0IG1haW5FbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJtYWluXCIpWzBdO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnVwZGF0ZVZpZGVvUGxheWVyTGlzdC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUobWFpbkVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWaWRlb1BsYXllckxpc3QoKSB7XHJcbiAgICAgICAgLy8gVE9ETzogSXMgaXQgYmV0dGVyIHRvIGl0ZXJhdGUgb25seSB0aGUgbXV0YXRlZCBkaXZzP1xyXG4gICAgICAgIGNvbnN0IHBsYXllckVsZW1zID0gZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHZpZGVvUGxheWVyQ2xhc3MpO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGl2IGlzIG5vdCBhbHJlYWR5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBpZighaXNQcm9jZXNzZWQocGxheWVyRWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJOZXcgdmlkZW8gcGxheWVyIGRldGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gcHJvY2VlZCBpZiB0aGVyZSBhcmUgdGhlIHNhbWUgbnVtYmVyIG9mIHBsYXllcnMgaW4gdGhlIGxpc3QgYW5kIGluIERPTS5cclxuICAgICAgICBpZihwbGF5ZXJFbGVtcy5sZW5ndGggPT09IHRoaXMucGxheWVycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB2aWRlbyBwbGF5ZXJzIG5vdCBpbiBET00gYW55bW9yZS5cclxuICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIGEgdXNlciBicm93c2VzIGZyb20gYSBub24tY2hhbm5lbCBwYWdlIChtYWluLCBkaXJlY3RvcnksIGV0Yy4pIHRvIGEgY2hhbm5lbCBwYWdlLFxyXG4gICAgLy8gb3IgYmV0d2VlbiBub24tY2hhbm5lbCBwYWdlcy5cclxuICAgIGdhcmJhZ2VDb2xsZWN0UGxheWVycyhwbGF5ZXJFbGVtczogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50Pikge1xyXG4gICAgICAgIGNvbnN0IGFsbFBsYXllcklkc0luRG9tOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICBhbGxQbGF5ZXJJZHNJbkRvbS5wdXNoKHBsYXllckVsZW0uZ2V0QXR0cmlidXRlKHBsYXllcklkQXR0cikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiQWxsIHBsYXllcklkcyBpbiBET006IFwiICsgYWxsUGxheWVySWRzSW5Eb20pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdsaXN0ID0gW107XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gcGxheWVyLnBsYXllcklkO1xyXG4gICAgICAgICAgICBpZihhbGxQbGF5ZXJJZHNJbkRvbS5pbmRleE9mKHBsYXllcklkKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3bGlzdC5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBQbGF5ZXIgJHtwbGF5ZXJJZH0gaXMgbm90IGluIERPTSBhbnltb3JlLiBEZWxldGluZy4uYCk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ld2xpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQocGxheWVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXllckVsZW0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQbGF5ZXJJZCA9IHZpZGVvUGxheWVySWRQcmVmaXggKyB0aGlzLm5leHRJZDtcclxuICAgICAgICB0aGlzLm5leHRJZCArPSAxO1xyXG4gICAgICAgIHBsYXllckVsZW0uc2V0QXR0cmlidXRlKHBsYXllcklkQXR0ciwgbmV3UGxheWVySWQpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIobmV3UGxheWVySWQsIHRoaXMsIHBsYXllckVsZW0pO1xyXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VFeGNlcHQocGxheWVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIucGxheWVySWQgIT09IHBsYXllcklkKSBwbGF5ZXIucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdpbGwgdGhpcyBmdW5jdGlvbiBldmVyIGJlIHVzZWQ/XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuIiwiXHJcbmltcG9ydCB7IFZpZGVvUGxheWVyQ29udGFpbmVyIH0gZnJvbSBcIi4vdmlkZW9fcGxheWVyX2NvbnRhaW5lclwiO1xyXG5cclxuXHJcbnZhciBjb250YWluZXIgPSBuZXcgVmlkZW9QbGF5ZXJDb250YWluZXIoKTtcclxuY29udGFpbmVyLnJ1bigpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9