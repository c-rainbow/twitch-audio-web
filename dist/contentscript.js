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
<div class="tw-inline-flex tw-relative tw-tooltip-wrapper">
    <button class="radio-mode-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
            data-a-target="radio-mode-button"
            data-radio-mode-state="disabled"
            aria-label="Radio Mode">
        <div class="tw-align-items-center tw-flex tw-flex-grow-0">
            <span class="tw-button-icon__icon">
                <div class="button-icon-div" style="width: 2rem; height: 2rem;">
                    <!-- Google Material Design Radio Icon. Apache License v2.0 -->
                    <svg class="tw-icon__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                        <path d="M3 18v-6a9 9 0 1118 0v6" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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
const controlGroupProcessedClass = "control-group-processed";
const playButtonAttr = "button[data-a-target='player-play-pause-button']";
const volumeSliderAttr = "input[data-a-target='player-volume-slider']";
const radioButtonPausedClass = "radio-mode-button-paused";
const radioButtonPlayingClass = "radio-mode-button-playing";
const radioButtonDisabledClass = "radio-mode-button-disabled";
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
        this.radioButton.setAttribute(radioModeStateAttr, this.player.playingState);
        this.radioButton.onclick = this.player.onRadioButtonClicked.bind(this.player);
        this.controlGroupElem.appendChild(buttonWrapperDom);
    }
    updateForPlay() {
        // NOTE: There is 1~3 seconds of delay between radio-mode button click and sound being played.
        // It's better to show some intermediate state (icon change, mouse cursor change, etc) in the meanwhile
        var _a;
        // Stop the video if playing
        const videoState = (_a = this.playButtonElem) === null || _a === void 0 ? void 0 : _a.getAttribute(videoPlayerStateAttr);
        if (videoState === "playing") {
            // Is there a better way to pause video than this "click" hack?
            this.playButtonElem.click();
        }
        // Change the radio button icon
        this.radioButton.setAttribute(radioModeStateAttr, "playing" /* PLAYING */);
    }
    updateForPause() {
        // Change the radio button icon
        this.radioButton.setAttribute(radioModeStateAttr, "paused" /* PAUSED */);
    }
    updateForDisabled() {
        // Change the radio button icon
        this.radioButton.setAttribute(radioModeStateAttr, "disabled" /* DISABLED */);
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
        this.playingState = "paused" /* PAUSED */;
        this.tryUpdatingControlGroup();
        this.controlGroupObserver = new MutationObserver(this.tryUpdatingControlGroup.bind(this));
        this.controlGroupObserver.observe(this.playerElem, domObserverConfig);
    }
    tryUpdatingControlGroup() {
        var _a, _b, _c;
        this.updateControlsPerLiveness();
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
    play(mediaUrl) {
        var _a, _b;
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
        this.audioElem.style.display = "none";
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
        (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.updateForPlay();
    }
    pause() {
        var _a;
        if (this.playingState === "paused" /* PAUSED */) {
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
    }
    // Pause audio in all players
    pauseAll() {
        this.container.pauseExcept(null);
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
                console.debug("response for get_audio_url received: " + JSON.stringify(response));
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
    updateControlsPerLiveness() {
        var _a;
        // If watching a live stream, enable the control group.
        // If watching VOD of clip, disable the control group.
        // For now, the logic for checking live/recorded video is existence of time seekbar.
        const seekbar = (_a = this.playerElem.getElementsByClassName("seekbar-interaction-area")) === null || _a === void 0 ? void 0 : _a[0];
        // When seekbar appeared and the radio button is not disabled yet.
        if (seekbar && this.playingState !== "disabled" /* DISABLED */) {
            this.disable();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFeEUsTUFBTSxTQUFTLEdBQVksNkJBQTZCLENBQUM7QUFDekQsTUFBTSxXQUFXLEdB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QUFDLFFBQWdCO1FBQ3hCLEtBQUksSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixJQUFHLE1BQU0sQ0FBQyxRQUFRLEtBQUssUUFBUTtnQkFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkQ7SUFDTCxDQUFDO0lBRUQsT0FBTzs7UUFDSCxVQUFJLENBQUMsUUFBUSwwQ0FBRSxVQUFVLEdBQUc7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7Q0FDSjs7O0FDdmtCK0Q7QUFHaEUsSUFBSSxTQUFTLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0FBQzNDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwiXHJcbmNvbnN0IHR3aXRjaERvbWFpbiA6IHN0cmluZyA9IFwidHdpdGNoLnR2L1wiO1xyXG4vLyBOb24tZXhodWFzdGl2ZSBsaXN0IG9mIG5vbi1jaGFubmVsIHJvdXRlcyBpbiB0d2l0Y2gudHZcclxuY29uc3Qgbm9uQ2hhbm5lbHMgOiBzdHJpbmdbXSA9IFtcImRpcmVjdG9yeVwiLCBcInZpZGVvc1wiLCBcInVcIiwgXCJzZXR0aW5nc1wiXTtcclxuXHJcbmNvbnN0IGFwaURvbWFpbiA6IHN0cmluZyA9IFwiYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvXCI7XHJcbmNvbnN0IGFjY2Vzc1Rva2VuIDogc3RyaW5nID0gXCIvYWNjZXNzX3Rva2VuXCI7XHJcblxyXG5jb25zdCB1c2hlckRvbWFpbiA6IHN0cmluZyA9IFwidXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy9cIjtcclxuY29uc3QgdXNoZXJFeHQgOiBzdHJpbmcgPSBcIi5tM3U4XCI7XHJcblxyXG5cclxuLy8gRXh0cmFjdCBhdWRpb19vbmx5IHN0cmVhbSAubTN1OCBmcm9tIHRoZSBtYXN0ZXIgcGxheWxpc3QgY29udGVudC5cclxuLy8gUmV0dXJucyB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIGEgVVJMIGFmdGVyIGF1ZGlvX29ubHkgbWV0YWRhdGEuXHJcbi8vIFRPRE86IFRoaXMgd29ya3MsIGJ1dCBldmVudHVhbGx5IHdlIHdpbGwgbmVlZCB0byBmdWxseSBwYXJzZSB0aGUgY29udGVudFxyXG4vLyBhbmQgZ2V0IGF1ZGlvX29ubHkgc3RyZWFtIHVybFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBpZighY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBhdWRpb09ubHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgZm9yKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgaWYgKGxpbmUuaW5jbHVkZXMoXCJhdWRpb19vbmx5XCIpKSBhdWRpb09ubHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGF1ZGlvT25seUZvdW5kICYmIGxpbmUuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tV2ViVXJsKHdlYnVybD86IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgLy8gQ2hhbm5lbCBuYW1lIG1heSBub3QgYmUgYXZhaWxhYmxlIGZyb20gdGhlIG1haW4gcGFnZSBVUkxcclxuICAgIGNvbnN0IHVybCA9IHdlYnVybCA/PyBsb2NhdGlvbi5ocmVmO1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1cmwsIHR3aXRjaERvbWFpbiwgXCIvXCIsIHRydWUpO1xyXG4gICAgY29uc29sZS5sb2coXCJDaGFubmVsIG5hbWUgXCIgKyBjaGFubmVsICsgXCIsIGZyb20gVVJMOiBcIiArIHVybClcclxuXHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChjaGFubmVsIGluIG5vbkNoYW5uZWxzKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVG9rZW5VcmwoYWNjZXNzVG9rZW5Vcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhhY2Nlc3NUb2tlblVybCwgYXBpRG9tYWluLCBhY2Nlc3NUb2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgYWNjZXNzIHRva2VuOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh1c2hlclVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVzaGVyVXJsLCB1c2hlckRvbWFpbiwgdXNoZXJFeHQpO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIHVzaGVyOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG4vLyBHZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2Ygc3RhcnRTdHIgYW5kIHRoZSBmaXJzdCBlbmRTdHIgYWZ0ZXIgc3RhcnRTdHIuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lQmV0d2VlblN0cmluZ3MoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsIHN0YXJ0U3RyOiBzdHJpbmcsIGVuZFN0cjogc3RyaW5nLCBlbmRPcHRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSA6IHN0cmluZyB7XHJcbiAgICBsZXQgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHN0YXJ0U3RyKTtcclxuICAgIGlmKHN0YXJ0SW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBzdGFydEluZGV4ICs9IHN0YXJ0U3RyLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihlbmRTdHIsIHN0YXJ0SW5kZXggKyAxKTtcclxuICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIGlmKGVuZE9wdGlvbmFsKSBlbmRJbmRleCA9IHVybC5sZW5ndGg7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxufVxyXG5cclxuXHJcbi8vIFRPRE86IEluc3RlYWQgb2YgcHJlLWRlZmluZWQgdXJsIGZvcm1hdCwgdXNlIHJlY2VudGx5IHVzZWQgb250IGluIFR3aXRjaCB3ZWJcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nLCBzaWc6IHN0cmluZykgOiBVc2hlclVybCB7XHJcbiAgICBjb25zdCB1c2hlclVybCA9IG5ldyBVc2hlclVybChgaHR0cHM6Ly91c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzLyR7Y2hhbm5lbH0ubTN1OGApO1xyXG4gICAgdXNoZXJVcmwudXBkYXRlKHRva2VuLCBzaWcpO1xyXG5cclxuICAgIC8vIEl0IGlzIG5vdCBjbGVhciBpZiBhbGwgb2YgdGhlc2UgcGFyYW1zIGFyZSByZXF1aXJlZCBvciBpZiB0aGVyZSBhcmUgYW55IG1pc3Npbmcgb25lcy5cclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwicGxheWVyXCIsIFwidHdpdGNod2ViXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19zb3VyY2VcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJ0eXBlXCIsIFwiYW55XCIpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdXNoZXJVcmw7XHJcbn1cclxuXHJcblxyXG4vLyBJbnRlcmZhY2UgdG8gY29tbXVuaWNhdGUgYmV0d2VlbiBiYWNrZ3JvdW5kIGFuZCBjb250ZW50c2NyaXB0XHJcbi8vIHRvIHJlcXVlc3QvcmVzcG9uZCBhY2Nlc3MgdG9rZW4gVVJMIGFuZCB1c2hlciBVUkwgZm9yIGEgY2hhbm5lbC5cclxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmxzUmVzcG9uc2Uge1xyXG4gICAgd2ViVXJsOiBVcmxHcm91cDtcclxuICAgIGxhc3RSZXF1ZXN0ZWQ6IFVybEdyb3VwO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVcmxHcm91cCB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBhY2Nlc3NUb2tlblVybDogc3RyaW5nO1xyXG4gICAgdXNoZXJVcmw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8vIENsYXNzIHRvIHN0b3JlIGFuZCBtYW5pcHVsYXRlIHVzaGVyIFVSTC5cclxuZXhwb3J0IGNsYXNzIFVzaGVyVXJsIHtcclxuICAgIG9yaWdpbmFsVXJsOiBzdHJpbmc7XHJcbiAgICB1cmxPYmplY3Q6IFVSTDtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGV4cGlyZXNBdDogbnVtYmVyOyAgLy8gVG9rZW4gZXhwaXJhdGlvbiBkYXRldGltZSBpbiBlcG9jaCBzZWNvbmRzXHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuZ2V0Q2hhbm5lbCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19hdWRpb19vbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVbmV4cGlyZWRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRzU2luY2VFcG9jaCA9IE1hdGgucm91bmQobm93LmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgICAgIC8vIDYwIHNlY29uZHMgYnVmZmVyIGJlZm9yZSB0b2tlbiBleHBpcmF0aW9uXHJcbiAgICAgICAgaWYoc2Vjb25kc1NpbmNlRXBvY2ggKyA2MCA8IHRoaXMuZXhwaXJlc0F0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVybCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBDYWNoZWQgVVJMIGZvciAke3RoaXMuY2hhbm5lbH0gaXMgZXhwaXJlZGApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cmxPYmplY3QudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRRdWVyeVN0cmluZyhrZXk6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldChrZXkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWVyeVN0cmluZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuc2V0KG5hbWUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeHBpcmVzQXQoKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5TdHJpbmcgPSB0aGlzLmdldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIik7XHJcbiAgICAgICAgaWYoIXRva2VuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW5Kc29uID0gSlNPTi5wYXJzZSh0b2tlblN0cmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2VuSnNvbi5leHBpcmVzIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXNBdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgcGFyc2UgdG9rZW4gaW4gdXNoZXIgVVJMLiBFcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYW5uZWwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwodGhpcy5vcmlnaW5hbFVybCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld1Rva2VuOiBzdHJpbmcsIG5ld1NpZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInRva2VuXCIsIG5ld1Rva2VuKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwic2lnXCIsIG5ld1NpZyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInBcIiwgdGhpcy5nZXRSYW5kb21OdW1iZXIoKS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tTnVtYmVyKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgeyBidWlsZFVzaGVyVXJsLCBwYXJzZUF1ZGlvT25seVVybCwgVXJsR3JvdXAgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb250ZW50KHVybDogc3RyaW5nKSB7XHJcbiAgICBpZighdXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgc3RhdHVzIGlmIG9rXHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgZmV0Y2hDb250ZW50IHRocmV3IGFuIGVycm9yOiAke2Vycn1gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hKc29uKHVybDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudCh1cmwpO1xyXG4gICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwSnNvbiA9IEpTT04ucGFyc2UocmVzcFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcEpzb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGNvdWxkIG5vdCBiZSBwYXJzZWQgdG8gSlNPTjogXCIgKyByZXNwVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdWRpb1N0cmVhbVVybCh1c2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVzaGVyVXJsKTtcclxuICAgIGNvbnN0IHN0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQpO1xyXG4gICAgcmV0dXJuIHN0cmVhbVVybDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW5Vcmw6IHN0cmluZywgbGFzdFJlcXVlc3RlZENoYW5uZWw6IHN0cmluZyxcclxuICAgICAgICBsYXN0UmVxdXN0ZWRVc2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbih0b2tlblVybCk7XHJcbiAgICBpZighcmVzcEpzb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbi50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbi5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYW5uZWwgaXMgZGlmZmVyZW50IGZyb20gdGhlIGNoYW5uZWwgb2YgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIHVybFxyXG4gICAgLy8gKFRoaXMgaXMgcG9zc2libGUgaWYgdGhlIGNoYW5uZWwncyBzdHJlYW1lciBpcyBob3N0aW5nIGFub3RoZXIgY2hhbm5lbClcclxuICAgIGlmKGxhc3RSZXF1ZXN0ZWRDaGFubmVsICYmIGNoYW5uZWwgIT09IGxhc3RSZXF1ZXN0ZWRDaGFubmVsKSB7XHJcbiAgICAgICAgaWYobGFzdFJlcXVzdGVkVXNoZXJVcmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXF1c3RlZFVzaGVyVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIHN0b3JlIGl0XHJcbiAgICAgICAgY29uc3QgdXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGxhc3RSZXF1ZXN0ZWRDaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgICAgICByZXR1cm4gdXNoZXJVcmwuZ2V0VXJsKCk7ICBcclxuICAgIH0gIFxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJ5RmV0Y2hpbmdQbGF5bGlzdChncm91cDogVXJsR3JvdXApIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmKCFncm91cCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gXHJcbiAgICAvLyBzZWUgaWYgdGhlIGV4aXN0aW5nIHVzaGVyIHVybCBjYW4gYmUgdXNlZFxyXG4gICAgaWYoZ3JvdXAudXNoZXJVcmwpIHtcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChncm91cC51c2hlclVybCk7XHJcbiAgICAgICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZighZ3JvdXAuYWNjZXNzVG9rZW5VcmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbihncm91cC5hY2Nlc3NUb2tlblVybCk7XHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uPy50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbj8uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ld1VzaGVyVXJsID0gYnVpbGRVc2hlclVybChncm91cC5jaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KG5ld1VzaGVyVXJsLmdldFVybCgpKTtcclxuICAgIHJldHVybiByZXNwVGV4dDtcclxufSIsIlxyXG5pbXBvcnQgeyB0cnlGZXRjaGluZ1BsYXlsaXN0IH0gZnJvbSBcIi4vZmV0Y2hcIjtcclxuaW1wb3J0IHsgZ2V0Q2hhbm5lbEZyb21XZWJVcmwsIEdldFVybHNSZXNwb25zZSwgcGFyc2VBdWRpb09ubHlVcmwgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBBbnkgYmV0dGVyIHdheSB0aGFuIEhUTUwgYXMgc3RyaW5nP1xyXG5jb25zdCBpbml0aWFsQnV0dG9uRG9tID0gYFxyXG48ZGl2IGNsYXNzPVwidHctaW5saW5lLWZsZXggdHctcmVsYXRpdmUgdHctdG9vbHRpcC13cmFwcGVyXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwicmFkaW8tbW9kZS1idXR0b24gdHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWFsaWduLW1pZGRsZSB0dy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJ1dHRvbi1pY29uIHR3LWJ1dHRvbi1pY29uLS1vdmVybGF5IHR3LWNvcmUtYnV0dG9uIHR3LWNvcmUtYnV0dG9uLS1vdmVybGF5IHR3LWlubGluZS1mbGV4IHR3LWludGVyYWN0aXZlIHR3LWp1c3RpZnktY29udGVudC1jZW50ZXIgdHctb3ZlcmZsb3ctaGlkZGVuIHR3LXJlbGF0aXZlXCJcclxuICAgICAgICAgICAgZGF0YS1hLXRhcmdldD1cInJhZGlvLW1vZGUtYnV0dG9uXCJcclxuICAgICAgICAgICAgZGF0YS1yYWRpby1tb2RlLXN0YXRlPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiUmFkaW8gTW9kZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctZmxleCB0dy1mbGV4LWdyb3ctMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3LWJ1dHRvbi1pY29uX19pY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWljb24tZGl2XCIgc3R5bGU9XCJ3aWR0aDogMnJlbTsgaGVpZ2h0OiAycmVtO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gR29vZ2xlIE1hdGVyaWFsIERlc2lnbiBSYWRpbyBJY29uLiBBcGFjaGUgTGljZW5zZSB2Mi4wIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJ0dy1pY29uX19zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zIDE4di02YTkgOSAwIDExMTggMHY2XCIgc3Ryb2tlLXdpZHRoPVwiMi4xXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgZmlsbD1cIm5vbmVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjEgMTlhMiAyIDAgMDEtMiAyaC0xYTIgMiAwIDAxLTItMnYtM2EyIDIgMCAwMTItMmgzdjV6TTMgMTlhMiAyIDAgMDAyIDJoMWEyIDIgMCAwMDItMnYtM2EyIDIgMCAwMC0yLTJIM3Y1elwiIHN0cm9rZS13aWR0aD1cIjIuMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGZpbGw9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGRpdiBjbGFzcz1cInR3LXRvb2x0aXAgdHctdG9vbHRpcC0tYWxpZ24tbGVmdCB0dy10b29sdGlwLS11cFwiIGRhdGEtYS10YXJnZXQ9XCJ0dy10b29sdGlwLWxhYmVsXCIgcm9sZT1cInRvb2x0aXBcIj5cclxuICAgICAgICBSYWRpbyBtb2RlXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5jb25zdCBwcm9jZXNzZWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHByb2Nlc3NlZEF0dHJWYWwgPSBcInByb2Nlc3NlZFwiXHJcblxyXG5jb25zdCB2aWRlb1BsYXllclN0YXRlQXR0ciA9IFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiO1xyXG5cclxuY29uc3QgcmFkaW9Nb2RlU3RhdGVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtc3RhdGVcIjtcclxuY29uc3QgcGxheWVySWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcGxheWVyLWlkXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklkUHJlZml4ID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgY29udHJvbEdyb3VwUHJvY2Vzc2VkQ2xhc3MgPSBcImNvbnRyb2wtZ3JvdXAtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHBsYXlCdXR0b25BdHRyID0gXCJidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLXBsYXktcGF1c2UtYnV0dG9uJ11cIjtcclxuY29uc3Qgdm9sdW1lU2xpZGVyQXR0ciA9IFwiaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXVwiO1xyXG5cclxuY29uc3QgcmFkaW9CdXR0b25QYXVzZWRDbGFzcyA9IFwicmFkaW8tbW9kZS1idXR0b24tcGF1c2VkXCI7XHJcbmNvbnN0IHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzID0gXCJyYWRpby1tb2RlLWJ1dHRvbi1wbGF5aW5nXCI7XHJcbmNvbnN0IHJhZGlvQnV0dG9uRGlzYWJsZWRDbGFzcyA9IFwicmFkaW8tbW9kZS1idXR0b24tZGlzYWJsZWRcIjtcclxuXHJcbmNvbnN0IGF0dHJPYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiBmYWxzZSwgc3VidHJlZTogZmFsc2UgfTtcclxuY29uc3QgZG9tT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IGZhbHNlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTtcclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlIFZpZGVvUGxheWVyQ29udGFpbmVyLCBhZGQgTXV0YXRpb25PYnNlcnZlciB0byBcclxuICogMS4gZG9jdW1lbnQuYm9keSBjaGVja3MgZm9yIG9uZSBzdWJ0cmVlIGNoYW5nZVxyXG4gKiAgIDEtMi4gSWYgZGl2IHdpdGggY2xhc3MgXCJ2aWRlby1wbGF5ZXJcIiwgcHJvY2VzcyBpdC4gQ2hlY2sgIzJcclxuICogXHJcbiAqIDIuIENyZWF0ZSBWaWRlb1BsYXllciwgdmlkZW8tcGxheWVyIGNsYXNzIGRpdiBjaGVja3MgZm9yIDEgYXR0cmlidXRlIGNoYW5nZSwgMyBzdWJ0cmVlIGNoYW5nZXNcclxuICogICAyLTEuIGF0dHJpYnV0ZSBcImRhdGEtYS1wbGF5ZXItdHlwZVwiOiBcInNpdGVcIiwgXCJzaXRlX21pbmlcIiwgXCJjbGlwcy13YXRjaFwiXHJcbiAqICAgICAyLTItMi4gQ2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIGlmIG5lY2Vzc2FyeVxyXG4gKiAgICAgMi0yLTMuIE1vZGU6IFR1cGxlIG9mIChsYXlvdXQsIHZpZGVvX3R5cGUpLlxyXG4gKiAgICAgICAyLTItMy0xLiBsYXlvdXQ6IFwic2l0ZVwiIHwgXCJzaXRlX21pbmlcIlxyXG4gKiAgICAgICAyLTItMy0yLiB2aWRlb190eXBlOiBcImxpdmVcIiwgXCJ2b2RcIiwgXCJjbGlwXCIuLiBhbmQgbW9yZT8/Pz8/XHJcbiAqICAgMi0yLiBzdWJ0cmVlIGRpdiB3aXRoIGNsYXNzIFwidm9kLXNlZWtiYXItdGltZS1sYWJlbHNcIiBhbmQgXCJzZWVrYmFyLWludGVyYWN0aW9uLWFyZWFcIlxyXG4gKiAgICAgMi0yLTEuIFRoaXMgb25seSBhcHBlYXJzIGluIFZPRCB3YXRjaFxyXG4gKiAgICAgMi0yLTIuIElmIGNyZWF0ZWQsIGNoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciB0byBWT0RcclxuICogICAgIDItMi0zLiBJZiByZW1vdmVkIChjaGFuZ2VkIGZyb20gVk9EIHRvIGxpdmUvY2xpcCksID8/Pz9cclxuICogICAyLTMuIGNoZWNrIGZvciBjb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIlxyXG4gKiAgICAgMi0zLTEuIElmIGNyZWF0ZWQsIGNoZWNrICMzIGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTMtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogICAyLTQuIGNoZWNrIGZvciBcInZpZGVvXCIgZWxlbWVudCBpbiB0aGUgcGxheWVyXHJcbiAqICAgICAyLTQtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzYgZm9yIGFjdGlvbnNcclxuICogICAgIDItNC0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiBcclxuICogMy4gQ29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCIgY2hlY2tzIGZvciBcclxuICogICAzLTEuIHN1YnRyZWUgYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddIGZvciB2aWRlbyBwbGF5L3BhdXNlIGJ1dHRvblxyXG4gKiAgICAgMy0xLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM0XHJcbiAqICAgICAzLTEtMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTIuIHN1YnRyZWUgaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXSBmb3Igdm9sdW1lIHNsaWRlclxyXG4gKiAgICAgMy0yLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM1XHJcbiAqICAgICAzLTItMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTMuIElmIGJvdGggY29tcG9uZW50cyBpbiAzLTEgYW5kIDMtMiBhcmUgcmVhZHk6XHJcbiAqICAgICAzLTMtMS4gQ3JlYXRlIHJhZGlvIG1vZGUgYnV0dG9uLCBhbmQgcHV0IE11dGF0aW9uT2JzZXJ2ZXIgKHNlZSAjNCBhbmQgIzUpXHJcbiAqICAgICAzLTMtMi4gSWYgYXQgbGVhc3Qgb25lIGNvbXBvbmVudCBpcyByZW1vdmVkIChzaXRlLT5zaXRlX21pbmkgY2hhbmdlLCBldGMpXHJcbiAqICAgICAgIDMtMy0yLTEuIGFsc28gcmVtb3ZlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBmcm9tIERPTVxyXG4gKiBcclxuICogNC4gVmlkZW8gcGxheS9wYXVzZSBidXR0b24gY2hlY2tzIGZvclxyXG4gKiAgIDQtMS4gQXR0cmlidXRlIGNoYW5nZSB2aWRlb1BsYXllclN0YXRlQXR0cjogXCJwbGF5aW5nXCIgb3IgXCJwYXVzZWRcIlxyXG4gKiAgICAgNC0xLTEuIElmIGF0dHJpYnV0ZSB2YWx1ZSBjaGFuZ2VkIHRvIFwicGxheWluZ1wiLCBzdG9wIGFsbCBhdWRpbyBpbiB0aGUgVmlkZW9QbGF5ZXJDb250YWluZXJcclxuICogXHJcbiAqIDUuIFZvbHVtZSBzbGlkZXIgY2hlY2tzIGZvclxyXG4gKiAgIDUtMS4gQXR0cmlidXRlIFwidmFsdWVcIiBjaGFuZ2U6IG51bWJlciBiZXR3ZWVuIDAgPD0gbnVtIDw9IDFcclxuICogICAgIDUtMS0xLiBJZiBjaGFuZ2UgaXMgZGV0ZWN0ZWQsIGFwcGx5IHRoZSBuZXcgdm9sdW1lIHRvIGF1ZGlvRWxlbS5cclxuICogXHJcbiAqIDYuIG9yaWdpbmFsIFwidmlkZW9cIiBlbGVtZW50IGluIHZpZGVvLXBsYXllciBjaGVja3MgZm9yXHJcbiAqICAgNi0xLiBBdHRyaWJ1dGUgXCJzcmNcIiBjaGFuZ2U6IG1lYW5zIHRoYXQgdGhlIHZpZGVvIHNvdXJjZSBjaGFuZ2VkIChsaWtlbHkgaG9zdGluZyBhbm90aGVyIHN0cmVhbWVyKVxyXG4gKiAgICAgNi0xLTEuIFJhZGlvIG1vZGUgYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZD8gUmUtY29uZmlndXJlZCB3aXRoIHRoZSBuZXcgc3RyZWFtZXIncyBVUkw/XHJcbiAqICAgIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb3cgdG8gZGV0ZWN0IHRoZSBjaGFubmVsIG9mIHRoZSBzdHJlYW0gYmVpbmcgcGxheWVkP1xyXG4gKiBHZXR0aW5nIGNoYW5uZWwgbmFtZSBmcm9tIFVSTCBoYXMgdGhlIGZvbGxsb3dpbmcgaXNzdWVzXHJcbiAqICgxKSBTdHJlYW1lciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbFxyXG4gKiAoMikgTWFpbiBwYWdlLiBDaGFubmVsIGNhbiBjaGFuZ2UgcXVpY2tseSBpbiB0aGUgY2Fyb3VzZWxcclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgS2VlcCB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgVVJMIGluIHRoZSB0YWIuIEd1ZXNzIHRoZSBjaGFubmVsIGZyb20gdGhlcmVcclxuICogKDIpIEZvciBcInNpdGVfbWluaVwiIHN0YXRlLCBzdG9yZSB0aGUgY2hhbm5lbCBuYW1lIGluIHZpZGVvIHBsYXllci5cclxuICogICAgIEluIHRoYXQgY2FzZSwgaXQgd2lsbCBiZSBwb3NzaWJsZSB0byByZXN1bWUgcGxheWluZyBpbiB0aGUgcmlnaHQgY2hhbm5lbC5cclxuICogKDMpIERpc2FibGUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGluIHRoZSBtYWluIHBhZ2VcclxuICogXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFkZCByYWRpbyBtb2RlIGJ1dHRvbiBpbiBzaXRlX21pbmk/XHJcbiAqIERvbid0IHN0b3JlIHRoZSBwbGF5c3RhdGUgaW4gRE9NOiBvbmx5IHN0b3JlIGl0IGluIFZpZGVvUGxheWVyIGNsYXNzIGFzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEVTcG9ydHMgcGFnZTogdmlkZW8gbWluaXBsYXllciBrZWVwcyBwbGF5aW5nIGV2ZW4gd2hlbiB0aGUgc2l0ZSBwbGF5ZXIgaW4gRXNwb3J0cyBwYWdlIGlzIGFsc28gYmVpbmcgcGxheWVkLlxyXG4gKiBTaG91bGQgdGhlIHJhZGlvIG1vZGUgZm9sbG93IHRoZSBzYW1lIGJlaGF2aW9yP1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBY2Nlc3MgdG9rZW4gdXJsIGhhcyBvYXV0aCBjb2RlLCB3aGljaCBpcyB1bmRlZmluZWQgaWYgdGhlIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICogTm90IHN1cmUgaG93IFR3aXRjaCByZXR1cm5zIGNvcnJlY3QgcmVzcG9uc2UgZm9yIGFub255bW91cyB1c2VyIHlldC5cclxuICogQ2FsbGluZyB0aGUgc2FtZSBhY2Nlc3MgdG9rZW4gVVJMIGZyb20gY29udGVudHNjcmlwdCByZXR1cm5zIGVycm9yLlxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBEaXNhYmxlIHRoZSBidXR0b24gd2hlbiB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqL1xyXG5cclxuXHJcbmNvbnN0IGVudW0gUGxheWluZ1N0YXRlIHtcclxuICAgIERJU0FCTEVEID0gXCJkaXNhYmxlZFwiLFxyXG4gICAgUEFVU0VEID0gXCJwYXVzZWRcIixcclxuICAgIFBMQVlJTkcgPSBcInBsYXlpbmdcIixcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBlbGVtZW50Py5nZXRBdHRyaWJ1dGUocHJvY2Vzc2VkQXR0cikgPT09IHByb2Nlc3NlZEF0dHJWYWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcmtQcm9jZXNzZWQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgZWxlbWVudD8uc2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIsIHByb2Nlc3NlZEF0dHJWYWwpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udHJvbEdyb3VwIHtcclxuICAgIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWVyOiBWaWRlb1BsYXllcjtcclxuICAgIHBsYXlCdXR0b25FbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICByYWRpb0J1dHRvbjogSFRNTEVsZW1lbnQ7XHJcbiAgICBjb21wb25lbnRzT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBwbGF5QnV0dG9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICB2b2x1bWVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjsgXHJcblxyXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBWaWRlb1BsYXllciwgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBjb250cm9sR3JvdXBFbGVtO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlci5vYnNlcnZlKHRoaXMuY29udHJvbEdyb3VwRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvLyBDaGVjayBmb3IgbmV3IFBsYXkvQXVkaW8gYnV0dG9uIGFuZCB2b2x1bWUgc2xpZGVyIFxyXG4gICAgICAgIGNvbnN0IHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHBsYXlCdXR0b25BdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW0pO1xyXG4gICAgICAgIGNvbnN0IHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3Rvcih2b2x1bWVTbGlkZXJBdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtKTtcclxuICAgICAgICAvLyBBZGQgdGhlIHJhZGlvIGJ1dHRvbiBpZiBub3QgZXhpc3RzXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAvLyBwbGF5IGJ1dHRvbiBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCFwbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMucGxheUJ1dHRvbkVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXlCdXR0b25FbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMucGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnMgaWYgYSB2aWRlbyBzdGFydHMgdG8gcGxheS5cclxuICAgICAgICAvLyBUaGlzIGlzIG5lY2VzYXNyeSBmb3IgYSBjYXNlIHdoZW4gdXNlciBicm93c2VzIHRvIGEgbm9uLWNoYW5uZWwgcGFnZSAoZS5nLiBtYWluLCBlc3BvcnRzKVxyXG4gICAgICAgIC8vIHdoaWNoIGF1dG9tYXRpY2FsbHkgcGxheXMgYSB2aWRlby5cclxuICAgICAgICB0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlbygpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXlCdXR0b25FbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlQXVkaW9Gb3JWaWRlbygpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gXCJwbGF5aW5nXCIpIHsgIC8vIFZpZGVvIHN0YXRlIGZyb20gcGF1c2VkIHRvIHBsYXlpbmdcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucGF1c2VBbGwoKTsgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFZvbHVtZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXllci5hdWRpb0VsZW0gJiYgdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IHRoaXMudm9sdW1lU2xpZGVyRWxlbS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYXVkaW9FbGVtLnZvbHVtZSA9IHBhcnNlRmxvYXQodm9sdW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICAvLyB2b2x1bWUgc2xpZGVyIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodm9sdW1lU2xpZGVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IHZvbHVtZVNsaWRlckVsZW07XHJcbiAgICAgICAgLy8gTXV0YXRpb25PYnNlcnZlciB0byB2b2x1bWVTbGlkZXJcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5hZGp1c3RWb2x1bWUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlci5vYnNlcnZlKHRoaXMudm9sdW1lU2xpZGVyRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCkge1xyXG4gICAgICAgIC8vIERvbid0IHByb2NlZWQgdW5sZXNzIGJvdGggcGxheUJ1dHRvbkVsZW0gYW5kIHZvbHVtZVNsaWRlckVsZW0gYXJlIGF2YWlsYWJsZVxyXG4gICAgICAgIGlmKCF0aGlzLnBsYXlCdXR0b25FbGVtIHx8ICF0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB3YXMgYWxyZWFkeSBjcmVhdGVkLCBkbyBub3RoaW5nXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodGhpcy5yYWRpb0J1dHRvbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogVXNlIHdlYnBhY2sgaHRtbCBsb2FkZXJcclxuICAgICAgICBjb25zdCBidXR0b25XcmFwcGVyRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJ1dHRvbldyYXBwZXJEb20uaW5uZXJIVE1MID0gaW5pdGlhbEJ1dHRvbkRvbTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIHRoaXMucGxheWVyLnBsYXlpbmdTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5vbmNsaWNrID0gdGhpcy5wbGF5ZXIub25SYWRpb0J1dHRvbkNsaWNrZWQuYmluZCh0aGlzLnBsYXllcik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtLmFwcGVuZENoaWxkKGJ1dHRvbldyYXBwZXJEb20pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBsYXkoKSB7XHJcbiAgICAgICAgLy8gTk9URTogVGhlcmUgaXMgMX4zIHNlY29uZHMgb2YgZGVsYXkgYmV0d2VlbiByYWRpby1tb2RlIGJ1dHRvbiBjbGljayBhbmQgc291bmQgYmVpbmcgcGxheWVkLlxyXG4gICAgICAgIC8vIEl0J3MgYmV0dGVyIHRvIHNob3cgc29tZSBpbnRlcm1lZGlhdGUgc3RhdGUgKGljb24gY2hhbmdlLCBtb3VzZSBjdXJzb3IgY2hhbmdlLCBldGMpIGluIHRoZSBtZWFud2hpbGVcclxuXHJcbiAgICAgICAgLy8gU3RvcCB0aGUgdmlkZW8gaWYgcGxheWluZ1xyXG4gICAgICAgIGNvbnN0IHZpZGVvU3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtPy5nZXRBdHRyaWJ1dGUodmlkZW9QbGF5ZXJTdGF0ZUF0dHIpO1xyXG4gICAgICAgIGlmKHZpZGVvU3RhdGUgPT09IFwicGxheWluZ1wiKSB7XHJcbiAgICAgICAgICAgIC8vIElzIHRoZXJlIGEgYmV0dGVyIHdheSB0byBwYXVzZSB2aWRlbyB0aGFuIHRoaXMgXCJjbGlja1wiIGhhY2s/XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0uY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSByYWRpbyBidXR0b24gaWNvblxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLlBMQVlJTkcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBhdXNlKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QQVVTRUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvckRpc2FibGVkKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIC8vIElzIHRoaXMgbmVjZXNzYXJ5P1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBWaWRlb1BsYXllciB7XHJcbiAgICBwbGF5ZXJJZDogc3RyaW5nO1xyXG4gICAgY29udGFpbmVyOiBWaWRlb1BsYXllckNvbnRhaW5lcjtcclxuICAgIHBsYXllckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWluZ1N0YXRlOiBQbGF5aW5nU3RhdGU7XHJcbiAgICBhdHRyaWJ1dGVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGNvbnRyb2xHcm91cDogQ29udHJvbEdyb3VwO1xyXG4gICAgY29udHJvbEdyb3VwT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBobHM6IEhscztcclxuICAgIGF1ZGlvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJZDogc3RyaW5nLCBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyLCBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0gPSBwbGF5ZXJFbGVtO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXllckVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzUGVyTGl2ZW5lc3MoKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKGNvbnRyb2xHcm91cEVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheShtZWRpYVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSA8dmlkZW8+IGVsZW1lbnQgdG8gcGxheSBhdWRpby5cclxuICAgICAgICAvLyA8YXVkaW8+IGNhbiBiZSBhbHNvIHVzZWQgYnkgaGxzLmpzLCBidXQgVHlwZXNjcmlwdCBmb3JjZXMgdGhpcyB0byBiZSBIVE1MVmlkZW9FbGVtZW50LlxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtID0gPEhUTUxWaWRlb0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uYWRqdXN0Vm9sdW1lKCk7ICAvLyBNYXRjaCB0aGUgaW5pdGlhbCB2b2x1bWUgd2l0aCB0aGUgc2xpZGVyIHZhbHVlLlxyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgdGhpcy5obHMgPSBuZXcgSGxzKHtcclxuICAgICAgICAgICAgLy9kZWJ1ZzogdHJ1ZSxcclxuICAgICAgICAgICAgbGl2ZVN5bmNEdXJhdGlvbjogMCxcclxuICAgICAgICAgICAgbGl2ZU1heExhdGVuY3lEdXJhdGlvbjogNSxcclxuICAgICAgICAgICAgbGl2ZUR1cmF0aW9uSW5maW5pdHk6IHRydWUgIC8vIHRydWUgZm9yIGxpdmUgc3RyZWFtXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5obHMubG9hZFNvdXJjZShtZWRpYVVybCk7XHJcbiAgICAgICAgdGhpcy5obHMuYXR0YWNoTWVkaWEodGhpcy5hdWRpb0VsZW0pOyBcclxuICAgICAgICAvLyBUT0RPOiBJcyB0aGlzIHNhZmUgdG8gcGxheSByaWdodCBhd2F5IGFmdGVyIGF0dGFjaGluZyB0aGUgbWVkaWE/XHJcbiAgICAgICAgLy8gVGhlIG1haW4gZXhhbXBsZSBhdCBobHMuanMgd2Vic2l0ZSB0ZWxscyB0byB1c2UgTUFOSUZFU1RfUEFSU0VEIGV2ZW50LFxyXG4gICAgICAgIC8vIGJ1dCBmb3Igc29tZSByZWFzb24gdGhlIGV2ZW50IGlzIG5vdCB0cmlnZ2VyZWQgd2l0aCB0eXBlc2NyaXB0K3dlYnBhY2suXHJcbiAgICAgICAgY29uc3QgYXVkaW9QbGF5Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5IHN0YXJ0ZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnBsYXkoKS50aGVuKGF1ZGlvUGxheUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBMQVlJTkc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBBVVNFRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaGxzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbS5wYXVzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gXCJET01FeGNlcHRpb246IFRoZSBwbGF5KCkgcmVxdWVzdCB3YXMgaW50ZXJydXB0ZWQgYnkgYSBjYWxsIHRvIHBhdXNlKClcIlxyXG4gICAgICAgICAgICAgICAgLy8gaXMgdGhyb3duIHdoZW4gdXNlciBwYXVzZXMgdGhlIGF1ZGlvIHRvbyBxdWlja2x5IGFmdGVyIHBsYXlpbmcuXHJcbiAgICAgICAgICAgICAgICAvLyBObyBhY3Rpb24gaXMgbmVlZGVkLiBUaGUgYXVkaW8gd2lsbCBiZSBwYXVzZWQgY29ycmVjdGx5IGFueXdheS5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhscy5zdG9wTG9hZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmhscy5kZXRhY2hNZWRpYSgpO1xyXG4gICAgICAgICAgICB0aGlzLmhscy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIC8vIFRoZXJlIHNlZW1zIHRvIGJlIGEgYnVnIHRoYXQgdGhlIEhMUyBvYmplY3QgZ2V0cyBzdHVjayBhZnRlciBtdWx0aXBsZSBwbGF5cyBhbmQgcGF1c2VzXHJcbiAgICAgICAgICAgIC8vIGlmIGl0IGlzIHJlLXVzZWQgZm9yIHRoZSBuZXh0IHBsYXkuIE5lZWQgdG8gZGVzdHJveSB0aGUgb2JqZWN0IGFuZCByZS1jcmVhdGUgaXQuXHJcbiAgICAgICAgICAgIHRoaXMuaGxzID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLnJlbW92ZUNoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QQVVTRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnNcclxuICAgIHBhdXNlQWxsKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JEaXNhYmxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaGF0IGVsc2UgdG8gZG8gaGVyZT9cclxuICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RQbGF5KCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2FsbGJhY2sgPSBhc3luYyBmdW5jdGlvbihyZXNwb25zZTogR2V0VXJsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJyZXNwb25zZSBmb3IgZ2V0X2F1ZGlvX3VybCByZWNlaXZlZDogXCIgKyBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICBpZighcmVzcG9uc2U/LndlYlVybD8uY2hhbm5lbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5IGluIGEgbm9uLWNoYW5uZWwgcGFnZS4gRGlzYWJsZSBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWxpc3QgPSBhd2FpdCB0cnlGZXRjaGluZ1BsYXlsaXN0KHJlc3BvbnNlLndlYlVybCk7XHJcbiAgICAgICAgICAgIGlmKCFwbGF5bGlzdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gT2ZmbGluZSBvciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbC4gRGlzYWJsZSBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGF1ZGlvU3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwocGxheWxpc3QpO1xyXG4gICAgICAgICAgICBpZihhdWRpb1N0cmVhbVVybCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQodGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoYXVkaW9TdHJlYW1VcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxyXG4gICAgICAgICAgICB7bWVzc2FnZTogXCJnZXRfYXVkaW9fdXJsXCIsIGNoYW5uZWw6IGNoYW5uZWx9LCByZXNwb25zZUNhbGxiYWNrLmJpbmQodGhpcykpOyBcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDb250cm9sc1BlckxpdmVuZXNzKCkge1xyXG4gICAgICAgIC8vIElmIHdhdGNoaW5nIGEgbGl2ZSBzdHJlYW0sIGVuYWJsZSB0aGUgY29udHJvbCBncm91cC5cclxuICAgICAgICAvLyBJZiB3YXRjaGluZyBWT0Qgb2YgY2xpcCwgZGlzYWJsZSB0aGUgY29udHJvbCBncm91cC5cclxuICAgICAgICAvLyBGb3Igbm93LCB0aGUgbG9naWMgZm9yIGNoZWNraW5nIGxpdmUvcmVjb3JkZWQgdmlkZW8gaXMgZXhpc3RlbmNlIG9mIHRpbWUgc2Vla2Jhci5cclxuICAgICAgICBjb25zdCBzZWVrYmFyID0gdGhpcy5wbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzZWVrYmFyLWludGVyYWN0aW9uLWFyZWFcIik/LlswXTtcclxuXHJcbiAgICAgICAgLy8gV2hlbiBzZWVrYmFyIGFwcGVhcmVkIGFuZCB0aGUgcmFkaW8gYnV0dG9uIGlzIG5vdCBkaXNhYmxlZCB5ZXQuXHJcbiAgICAgICAgaWYoc2Vla2JhciAmJiB0aGlzLnBsYXlpbmdTdGF0ZSAhPT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJhZGlvQnV0dG9uQ2xpY2tlZCgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJDb250YWluZXIge1xyXG4gICAgcGxheWVyczogVmlkZW9QbGF5ZXJbXTtcclxuICAgIG5leHRJZDogbnVtYmVyO1xyXG4gICAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAxMDAwMTsgIC8vIFJhbmRvbSBzdGFydCBpbmRleCBmb3IgcGxheWVyLlxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvLyBGaW5kIGV4aXN0aW5nIHZpZGVvIHBsYXllciBlbGVtZW50cyB0byBjcmVhdGUgVmlkZW9QbGF5ZXIgb2JqZWN0c1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgLy8gRGV0ZWN0IGZ1dHVyZSB2aWRlbyBwbGF5ZXIgZWxlbWVudHNcclxuICAgICAgICBjb25zdCBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibWFpblwiKVswXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKG1haW5FbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIC8vIFRPRE86IElzIGl0IGJldHRlciB0byBpdGVyYXRlIG9ubHkgdGhlIG11dGF0ZWQgZGl2cz9cclxuICAgICAgICBjb25zdCBwbGF5ZXJFbGVtcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh2aWRlb1BsYXllckNsYXNzKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpdiBpcyBub3QgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgaWYoIWlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTmV3IHZpZGVvIHBsYXllciBkZXRlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBuZWVkIHRvIHByb2NlZWQgaWYgdGhlcmUgYXJlIHRoZSBzYW1lIG51bWJlciBvZiBwbGF5ZXJzIGluIHRoZSBsaXN0IGFuZCBpbiBET00uXHJcbiAgICAgICAgaWYocGxheWVyRWxlbXMubGVuZ3RoID09PSB0aGlzLnBsYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FyYmFnZUNvbGxlY3RQbGF5ZXJzKHBsYXllckVsZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdmlkZW8gcGxheWVycyBub3QgaW4gRE9NIGFueW1vcmUuXHJcbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiBhIHVzZXIgYnJvd3NlcyBmcm9tIGEgbm9uLWNoYW5uZWwgcGFnZSAobWFpbiwgZGlyZWN0b3J5LCBldGMuKSB0byBhIGNoYW5uZWwgcGFnZSxcclxuICAgIC8vIG9yIGJldHdlZW4gbm9uLWNoYW5uZWwgcGFnZXMuXHJcbiAgICBnYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXM6IEhUTUxDb2xsZWN0aW9uT2Y8RWxlbWVudD4pIHtcclxuICAgICAgICBjb25zdCBhbGxQbGF5ZXJJZHNJbkRvbTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgYWxsUGxheWVySWRzSW5Eb20ucHVzaChwbGF5ZXJFbGVtLmdldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkFsbCBwbGF5ZXJJZHMgaW4gRE9NOiBcIiArIGFsbFBsYXllcklkc0luRG9tKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3bGlzdCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHBsYXllci5wbGF5ZXJJZDtcclxuICAgICAgICAgICAgaWYoYWxsUGxheWVySWRzSW5Eb20uaW5kZXhPZihwbGF5ZXJJZCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld2xpc3QucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgUGxheWVyICR7cGxheWVySWR9IGlzIG5vdCBpbiBET00gYW55bW9yZS4gRGVsZXRpbmcuLmApO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXdsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5ZXJFbGVtKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGxheWVySWQgPSB2aWRlb1BsYXllcklkUHJlZml4ICsgdGhpcy5uZXh0SWQ7XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgKz0gMTtcclxuICAgICAgICBwbGF5ZXJFbGVtLnNldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIsIG5ld1BsYXllcklkKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFZpZGVvUGxheWVyKG5ld1BsYXllcklkLCB0aGlzLCBwbGF5ZXJFbGVtKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlRXhjZXB0KHBsYXllcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgaWYocGxheWVyLnBsYXllcklkICE9PSBwbGF5ZXJJZCkgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaWxsIHRoaXMgZnVuY3Rpb24gZXZlciBiZSB1c2VkP1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIlxyXG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbnRhaW5lciB9IGZyb20gXCIuL3ZpZGVvX3BsYXllcl9jb250YWluZXJcIjtcclxuXHJcblxyXG52YXIgY29udGFpbmVyID0gbmV3IFZpZGVvUGxheWVyQ29udGFpbmVyKCk7XHJcbmNvbnRhaW5lci5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==