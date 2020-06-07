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
        this.playingState = this.isPossiblyInChannelPage() ? "paused" /* PAUSED */ : "disabled" /* DISABLED */;
        this.tryUpdatingControlGroup();
        this.controlGroupObserver = new MutationObserver(this.tryUpdatingControlGroup.bind(this));
        this.controlGroupObserver.observe(this.playerElem, domObserverConfig);
        this.videoElem = playerElem.getElementsByTagName("video")[0];
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
        if (this.playingState === "disabled" /* DISABLED */ || this.playingState === "paused" /* PAUSED */) {
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
        const videoPlayButton = this.controlGroup.playButtonElem;
        const videoState = videoPlayButton === null || videoPlayButton === void 0 ? void 0 : videoPlayButton.getAttribute(videoPlayerStateAttr);
        if (videoState === expectedState) {
            videoPlayButton.click();
        }
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
    isPossiblyInChannelPage() {
        const channel = Object(url["e" /* getChannelFromWebUrl */])();
        return channel !== null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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Q0o7OztBQzdsQitEO0FBR2hFLElBQUksU0FBUyxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztBQUMzQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMiLCJmaWxlIjoiY29udGVudHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcbiIsIlxyXG5jb25zdCB0d2l0Y2hEb21haW4gOiBzdHJpbmcgPSBcInR3aXRjaC50di9cIjtcclxuLy8gTm9uLWV4aHVhc3RpdmUgbGlzdCBvZiBub24tY2hhbm5lbCByb3V0ZXMgaW4gdHdpdGNoLnR2XHJcbmNvbnN0IG5vbkNoYW5uZWxzIDogc3RyaW5nW10gPSBbXHJcbiAgICBcIlwiLCBcImRpcmVjdG9yeVwiLCBcInZpZGVvc1wiLCBcInVcIiwgXCJzZXR0aW5nc1wiLCBcImZyaWVuZHNcIiwgXCJzdWJzY3JpcHRpb25zXCIsIFwiaW52ZW50b3J5XCIsIFwid2FsbGV0XCJdO1xyXG5cclxuY29uc3QgYXBpRG9tYWluIDogc3RyaW5nID0gXCJhcGkudHdpdGNoLnR2L2FwaS9jaGFubmVscy9cIjtcclxuY29uc3QgYWNjZXNzVG9rZW4gOiBzdHJpbmcgPSBcIi9hY2Nlc3NfdG9rZW5cIjtcclxuXHJcbmNvbnN0IHVzaGVyRG9tYWluIDogc3RyaW5nID0gXCJ1c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzL1wiO1xyXG5jb25zdCB1c2hlckV4dCA6IHN0cmluZyA9IFwiLm0zdThcIjtcclxuXHJcblxyXG4vLyBFeHRyYWN0IGF1ZGlvX29ubHkgc3RyZWFtIC5tM3U4IGZyb20gdGhlIG1hc3RlciBwbGF5bGlzdCBjb250ZW50LlxyXG4vLyBSZXR1cm5zIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2YgYSBVUkwgYWZ0ZXIgYXVkaW9fb25seSBtZXRhZGF0YS5cclxuLy8gVE9ETzogVGhpcyB3b3JrcywgYnV0IGV2ZW50dWFsbHkgd2Ugd2lsbCBuZWVkIHRvIGZ1bGx5IHBhcnNlIHRoZSBjb250ZW50XHJcbi8vIGFuZCBnZXQgYXVkaW9fb25seSBzdHJlYW0gdXJsXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF1ZGlvT25seVVybChjb250ZW50OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGlmKCFjb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gICAgbGV0IGF1ZGlvT25seUZvdW5kID0gZmFsc2U7XHJcbiAgICBmb3IobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgICBpZiAobGluZS5pbmNsdWRlcyhcImF1ZGlvX29ubHlcIikpIGF1ZGlvT25seUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICBpZiAoYXVkaW9Pbmx5Rm91bmQgJiYgbGluZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly9cIikpIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21XZWJVcmwod2VidXJsPzogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAvLyBDaGFubmVsIG5hbWUgbWF5IG5vdCBiZSBhdmFpbGFibGUgZnJvbSB0aGUgbWFpbiBwYWdlIFVSTFxyXG4gICAgY29uc3QgdXJsID0gd2VidXJsID8/IGxvY2F0aW9uLmhyZWY7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVybCwgdHdpdGNoRG9tYWluLCBcIi9cIiwgdHJ1ZSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNoYW5uZWwgbmFtZSBcIiArIGNoYW5uZWwgKyBcIiwgZnJvbSBVUkw6IFwiICsgdXJsKVxyXG5cclxuICAgIC8vIEZpbHRlciBvdXQgc29tZSBub24tY2hhbm5lbCBwYWdlcyB3aXRoIHNpbWlsYXIgVVJMIHBhdHRlcm4gYXMgY2hhbm5lbCBwYWdlc1xyXG4gICAgaWYgKG5vbkNoYW5uZWxzLmluZGV4T2YoY2hhbm5lbCkgIT0gLTEpIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Ub2tlblVybChhY2Nlc3NUb2tlblVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKGFjY2Vzc1Rva2VuVXJsLCBhcGlEb21haW4sIGFjY2Vzc1Rva2VuKTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCBhY2Nlc3MgdG9rZW46IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXNoZXJVcmwsIHVzaGVyRG9tYWluLCB1c2hlckV4dCk7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgdXNoZXI6IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbi8vIEdldCBjaGFubmVsIGJldHdlZW4gdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBzdGFydFN0ciBhbmQgdGhlIGZpcnN0IGVuZFN0ciBhZnRlciBzdGFydFN0ci5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhcclxuICAgICAgICB1cmw6IHN0cmluZywgc3RhcnRTdHI6IHN0cmluZywgZW5kU3RyOiBzdHJpbmcsIGVuZE9wdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIDogc3RyaW5nIHtcclxuICAgIGxldCBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc3RhcnRTdHIpO1xyXG4gICAgaWYoc3RhcnRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHN0YXJ0SW5kZXggKz0gc3RhcnRTdHIubGVuZ3RoO1xyXG5cclxuICAgIGxldCBlbmRJbmRleCA9IHVybC5pbmRleE9mKGVuZFN0ciwgc3RhcnRJbmRleCArIDEpO1xyXG4gICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgaWYoZW5kT3B0aW9uYWwpIGVuZEluZGV4ID0gdXJsLmxlbmd0aDtcclxuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG59XHJcblxyXG5cclxuLy8gVE9ETzogSW5zdGVhZCBvZiBwcmUtZGVmaW5lZCB1cmwgZm9ybWF0LCB1c2UgcmVjZW50bHkgdXNlZCBvbnQgaW4gVHdpdGNoIHdlYlxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcsIHNpZzogc3RyaW5nKSA6IFVzaGVyVXJsIHtcclxuICAgIGNvbnN0IHVzaGVyVXJsID0gbmV3IFVzaGVyVXJsKGBodHRwczovL3VzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvJHtjaGFubmVsfS5tM3U4YCk7XHJcbiAgICB1c2hlclVybC51cGRhdGUodG9rZW4sIHNpZyk7XHJcblxyXG4gICAgLy8gSXQgaXMgbm90IGNsZWFyIGlmIGFsbCBvZiB0aGVzZSBwYXJhbXMgYXJlIHJlcXVpcmVkIG9yIGlmIHRoZXJlIGFyZSBhbnkgbWlzc2luZyBvbmVzLlxyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJwbGF5ZXJcIiwgXCJ0d2l0Y2h3ZWJcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcImFsbG93X3NvdXJjZVwiLCBcInRydWVcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInR5cGVcIiwgXCJhbnlcIik7XHJcbiAgICBcclxuICAgIHJldHVybiB1c2hlclVybDtcclxufVxyXG5cclxuXHJcbi8vIEludGVyZmFjZSB0byBjb21tdW5pY2F0ZSBiZXR3ZWVuIGJhY2tncm91bmQgYW5kIGNvbnRlbnRzY3JpcHRcclxuLy8gdG8gcmVxdWVzdC9yZXNwb25kIGFjY2VzcyB0b2tlbiBVUkwgYW5kIHVzaGVyIFVSTCBmb3IgYSBjaGFubmVsLlxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFVybHNSZXNwb25zZSB7XHJcbiAgICB3ZWJVcmw6IFVybEdyb3VwO1xyXG4gICAgbGFzdFJlcXVlc3RlZDogVXJsR3JvdXA7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFVybEdyb3VwIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmc7XHJcbiAgICB1c2hlclVybDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy8gQ2xhc3MgdG8gc3RvcmUgYW5kIG1hbmlwdWxhdGUgdXNoZXIgVVJMLlxyXG5leHBvcnQgY2xhc3MgVXNoZXJVcmwge1xyXG4gICAgb3JpZ2luYWxVcmw6IHN0cmluZztcclxuICAgIHVybE9iamVjdDogVVJMO1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgZXhwaXJlc0F0OiBudW1iZXI7ICAvLyBUb2tlbiBleHBpcmF0aW9uIGRhdGV0aW1lIGluIGVwb2NoIHNlY29uZHNcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxVcmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3QgPSBuZXcgVVJMKHVybCk7XHJcbiAgICAgICAgdGhpcy5jaGFubmVsID0gdGhpcy5nZXRDaGFubmVsKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcImFsbG93X2F1ZGlvX29ubHlcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVuZXhwaXJlZFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHNTaW5jZUVwb2NoID0gTWF0aC5yb3VuZChub3cuZ2V0VGltZSgpIC8gMTAwMCk7XHJcbiAgICAgICAgLy8gNjAgc2Vjb25kcyBidWZmZXIgYmVmb3JlIHRva2VuIGV4cGlyYXRpb25cclxuICAgICAgICBpZihzZWNvbmRzU2luY2VFcG9jaCArIDYwIDwgdGhpcy5leHBpcmVzQXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VXJsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYENhY2hlZCBVUkwgZm9yICR7dGhpcy5jaGFubmVsfSBpcyBleHBpcmVkYCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVybE9iamVjdC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgodXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiP1wiKTtcclxuICAgICAgICBpZihlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFF1ZXJ5U3RyaW5nKGtleTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuZ2V0KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFF1ZXJ5U3RyaW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5zZXQobmFtZSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4cGlyZXNBdCgpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCB0b2tlblN0cmluZyA9IHRoaXMuZ2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAgICBpZighdG9rZW5TdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkpzb24gPSBKU09OLnBhcnNlKHRva2VuU3RyaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgZXhwaXJlc0F0ID0gdG9rZW5Kc29uLmV4cGlyZXMgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlc0F0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYENhbm5vdCBwYXJzZSB0b2tlbiBpbiB1c2hlciBVUkwuIEVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbm5lbCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh0aGlzLm9yaWdpbmFsVXJsKTtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3VG9rZW46IHN0cmluZywgbmV3U2lnOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIiwgbmV3VG9rZW4pO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJzaWdcIiwgbmV3U2lnKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwicFwiLCB0aGlzLmdldFJhbmRvbU51bWJlcigpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21OdW1iZXIoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IGJ1aWxkVXNoZXJVcmwsIHBhcnNlQXVkaW9Pbmx5VXJsLCBVcmxHcm91cCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaENvbnRlbnQodXJsOiBzdHJpbmcpIHtcclxuICAgIGlmKCF1cmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBzdGF0dXMgaWYgb2tcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICB9XHJcbiAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBmZXRjaENvbnRlbnQgdGhyZXcgYW4gZXJyb3I6ICR7ZXJyfWApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVybCk7XHJcbiAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BKc29uID0gSlNPTi5wYXJzZShyZXNwVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwSnNvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgY291bGQgbm90IGJlIHBhcnNlZCB0byBKU09OOiBcIiArIHJlc3BUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEF1ZGlvU3RyZWFtVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXNoZXJVcmwpO1xyXG4gICAgY29uc3Qgc3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudCk7XHJcbiAgICByZXR1cm4gc3RyZWFtVXJsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlblVybDogc3RyaW5nLCBsYXN0UmVxdWVzdGVkQ2hhbm5lbDogc3RyaW5nLFxyXG4gICAgICAgIGxhc3RSZXF1c3RlZFVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKHRva2VuVXJsKTtcclxuICAgIGlmKCFyZXNwSnNvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uLnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uLnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgY2hhbm5lbCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY2hhbm5lbCBvZiB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgdXJsXHJcbiAgICAvLyAoVGhpcyBpcyBwb3NzaWJsZSBpZiB0aGUgY2hhbm5lbCdzIHN0cmVhbWVyIGlzIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsKVxyXG4gICAgaWYobGFzdFJlcXVlc3RlZENoYW5uZWwgJiYgY2hhbm5lbCAhPT0gbGFzdFJlcXVlc3RlZENoYW5uZWwpIHtcclxuICAgICAgICBpZihsYXN0UmVxdXN0ZWRVc2hlclVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGFzdFJlcXVzdGVkVXNoZXJVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgc3RvcmUgaXRcclxuICAgICAgICBjb25zdCB1c2hlclVybCA9IGJ1aWxkVXNoZXJVcmwobGFzdFJlcXVlc3RlZENoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgICAgIHJldHVybiB1c2hlclVybC5nZXRVcmwoKTsgIFxyXG4gICAgfSAgXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cnlGZXRjaGluZ1BsYXlsaXN0KGdyb3VwOiBVcmxHcm91cCkgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgaWYoIWdyb3VwKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiBcclxuICAgIC8vIHNlZSBpZiB0aGUgZXhpc3RpbmcgdXNoZXIgdXJsIGNhbiBiZSB1c2VkXHJcbiAgICBpZihncm91cC51c2hlclVybCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KGdyb3VwLnVzaGVyVXJsKTtcclxuICAgICAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCFncm91cC5hY2Nlc3NUb2tlblVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKGdyb3VwLmFjY2Vzc1Rva2VuVXJsKTtcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24/LnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uPy5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV3VXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGdyb3VwLmNoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQobmV3VXNoZXJVcmwuZ2V0VXJsKCkpO1xyXG4gICAgcmV0dXJuIHJlc3BUZXh0O1xyXG59IiwiXHJcbmltcG9ydCB7IHRyeUZldGNoaW5nUGxheWxpc3QgfSBmcm9tIFwiLi9mZXRjaFwiO1xyXG5pbXBvcnQgeyBnZXRDaGFubmVsRnJvbVdlYlVybCwgR2V0VXJsc1Jlc3BvbnNlLCBwYXJzZUF1ZGlvT25seVVybCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIFRPRE86IEFueSBiZXR0ZXIgd2F5IHRoYW4gSFRNTCBhcyBzdHJpbmc/XHJcbmNvbnN0IGluaXRpYWxCdXR0b25Eb20gPSBgXHJcbjxkaXYgY2xhc3M9XCJ0dy1pbmxpbmUtZmxleCB0dy1yZWxhdGl2ZSB0dy10b29sdGlwLXdyYXBwZXIgcmFkaW8tbW9kZS1idXR0b24td3JhcHBlclwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cInJhZGlvLW1vZGUtYnV0dG9uIHR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1hbGlnbi1taWRkbGUgdHctYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1idXR0b24taWNvbiB0dy1idXR0b24taWNvbi0tb3ZlcmxheSB0dy1jb3JlLWJ1dHRvbiB0dy1jb3JlLWJ1dHRvbi0tb3ZlcmxheSB0dy1pbmxpbmUtZmxleCB0dy1pbnRlcmFjdGl2ZSB0dy1qdXN0aWZ5LWNvbnRlbnQtY2VudGVyIHR3LW92ZXJmbG93LWhpZGRlbiB0dy1yZWxhdGl2ZVwiXHJcbiAgICAgICAgICAgIGRhdGEtYS10YXJnZXQ9XCJyYWRpby1tb2RlLWJ1dHRvblwiXHJcbiAgICAgICAgICAgIGRhdGEtcmFkaW8tbW9kZS1zdGF0ZT1cImRpc2FibGVkXCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlJhZGlvIE1vZGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWZsZXggdHctZmxleC1ncm93LTBcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0dy1idXR0b24taWNvbl9faWNvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1pY29uLWRpdlwiIHN0eWxlPVwid2lkdGg6IDJyZW07IGhlaWdodDogMnJlbTtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8IS0tIEdvb2dsZSBNYXRlcmlhbCBEZXNpZ24gUmFkaW8gSWNvbi4gQXBhY2hlIExpY2Vuc2UgdjIuMCAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwidHctaWNvbl9fc3ZnXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD1cIm5vbmVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMy4yNCA2LjE1QzIuNTEgNi40MyAyIDcuMTcgMiA4djEyYzAgMS4xLjg5IDIgMiAyaDE2YzEuMTEgMCAyLS45IDItMlY4YzAtMS4xMS0uODktMi0yLTJIOC4zbDguMjYtMy4zNEwxNS44OCAxIDMuMjQgNi4xNXpNNyAyMGMtMS42NiAwLTMtMS4zNC0zLTNzMS4zNC0zIDMtMyAzIDEuMzQgMyAzLTEuMzQgMy0zIDN6bTEzLThoLTJ2LTJoLTJ2Mkg0VjhoMTZ2NHpcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8ZGl2IGNsYXNzPVwidHctdG9vbHRpcCB0dy10b29sdGlwLS1hbGlnbi1sZWZ0IHR3LXRvb2x0aXAtLXVwXCIgZGF0YS1hLXRhcmdldD1cInR3LXRvb2x0aXAtbGFiZWxcIiByb2xlPVwidG9vbHRpcFwiPlxyXG4gICAgICAgIFJhZGlvIG1vZGVcclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuICAgXHJcbmNvbnN0IHByb2Nlc3NlZEF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1wcm9jZXNzZWRcIjtcclxuY29uc3QgcHJvY2Vzc2VkQXR0clZhbCA9IFwicHJvY2Vzc2VkXCJcclxuXHJcbmNvbnN0IHZpZGVvUGxheWVyU3RhdGVBdHRyID0gXCJkYXRhLWEtcGxheWVyLXN0YXRlXCI7XHJcblxyXG5jb25zdCByYWRpb01vZGVTdGF0ZUF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1zdGF0ZVwiO1xyXG5jb25zdCBwbGF5ZXJJZEF0dHIgPSBcImRhdGEtcmFkaW8tbW9kZS1wbGF5ZXItaWRcIjtcclxuXHJcbmNvbnN0IHZpZGVvUGxheWVyQ2xhc3MgPSBcInZpZGVvLXBsYXllclwiO1xyXG5jb25zdCB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzID0gXCJ2aWRlby1wbGF5ZXItcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVySWRQcmVmaXggPSB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzICsgXCItXCI7XHJcbmNvbnN0IGNvbnRyb2xHcm91cENsYXNzID0gXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiO1xyXG5jb25zdCBwbGF5QnV0dG9uQXR0ciA9IFwiYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddXCI7XHJcbmNvbnN0IHZvbHVtZVNsaWRlckF0dHIgPSBcImlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ11cIjtcclxuXHJcbmNvbnN0IGF0dHJPYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiBmYWxzZSwgc3VidHJlZTogZmFsc2UgfTtcclxuY29uc3QgZG9tT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IGZhbHNlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTtcclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlIFZpZGVvUGxheWVyQ29udGFpbmVyLCBhZGQgTXV0YXRpb25PYnNlcnZlciB0byBcclxuICogMS4gZG9jdW1lbnQuYm9keSBjaGVja3MgZm9yIG9uZSBzdWJ0cmVlIGNoYW5nZVxyXG4gKiAgIDEtMi4gSWYgZGl2IHdpdGggY2xhc3MgXCJ2aWRlby1wbGF5ZXJcIiwgcHJvY2VzcyBpdC4gQ2hlY2sgIzJcclxuICogXHJcbiAqIDIuIENyZWF0ZSBWaWRlb1BsYXllciwgdmlkZW8tcGxheWVyIGNsYXNzIGRpdiBjaGVja3MgZm9yIDEgYXR0cmlidXRlIGNoYW5nZSwgMyBzdWJ0cmVlIGNoYW5nZXNcclxuICogICAyLTEuIGF0dHJpYnV0ZSBcImRhdGEtYS1wbGF5ZXItdHlwZVwiOiBcInNpdGVcIiwgXCJzaXRlX21pbmlcIiwgXCJjbGlwcy13YXRjaFwiLCBcImNoYW5uZWxfaG9tZV9jYXJvdXNlbFwiXHJcbiAqICAgICAyLTItMi4gQ2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIGlmIG5lY2Vzc2FyeVxyXG4gKiAgICAgMi0yLTMuIE1vZGU6IFR1cGxlIG9mIChsYXlvdXQsIHZpZGVvX3R5cGUpLlxyXG4gKiAgICAgICAyLTItMy0xLiBsYXlvdXQ6IFwic2l0ZVwiIHwgXCJzaXRlX21pbmlcIlxyXG4gKiAgICAgICAyLTItMy0yLiB2aWRlb190eXBlOiBcImxpdmVcIiwgXCJ2b2RcIiwgXCJjbGlwXCIuLiBhbmQgbW9yZT8/Pz8/XHJcbiAqICAgMi0yLiBzdWJ0cmVlIGRpdiB3aXRoIGNsYXNzIFwidm9kLXNlZWtiYXItdGltZS1sYWJlbHNcIiBhbmQgXCJzZWVrYmFyLWludGVyYWN0aW9uLWFyZWFcIlxyXG4gKiAgICAgMi0yLTEuIFRoaXMgb25seSBhcHBlYXJzIGluIFZPRCB3YXRjaFxyXG4gKiAgICAgMi0yLTIuIElmIGNyZWF0ZWQsIGNoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciB0byBWT0RcclxuICogICAgIDItMi0zLiBJZiByZW1vdmVkIChjaGFuZ2VkIGZyb20gVk9EIHRvIGxpdmUvY2xpcCksID8/Pz9cclxuICogICAyLTMuIGNoZWNrIGZvciBjb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIlxyXG4gKiAgICAgMi0zLTEuIElmIGNyZWF0ZWQsIGNoZWNrICMzIGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTMtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogICAyLTQuIGNoZWNrIGZvciBcInZpZGVvXCIgZWxlbWVudCBpbiB0aGUgcGxheWVyXHJcbiAqICAgICAyLTQtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzYgZm9yIGFjdGlvbnNcclxuICogICAgIDItNC0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiBcclxuICogMy4gQ29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCIgY2hlY2tzIGZvciBcclxuICogICAzLTEuIHN1YnRyZWUgYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddIGZvciB2aWRlbyBwbGF5L3BhdXNlIGJ1dHRvblxyXG4gKiAgICAgMy0xLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM0XHJcbiAqICAgICAzLTEtMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTIuIHN1YnRyZWUgaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXSBmb3Igdm9sdW1lIHNsaWRlclxyXG4gKiAgICAgMy0yLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM1XHJcbiAqICAgICAzLTItMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTMuIElmIGJvdGggY29tcG9uZW50cyBpbiAzLTEgYW5kIDMtMiBhcmUgcmVhZHk6XHJcbiAqICAgICAzLTMtMS4gQ3JlYXRlIHJhZGlvIG1vZGUgYnV0dG9uLCBhbmQgcHV0IE11dGF0aW9uT2JzZXJ2ZXIgKHNlZSAjNCBhbmQgIzUpXHJcbiAqICAgICAzLTMtMi4gSWYgYXQgbGVhc3Qgb25lIGNvbXBvbmVudCBpcyByZW1vdmVkIChzaXRlLT5zaXRlX21pbmkgY2hhbmdlLCBldGMpXHJcbiAqICAgICAgIDMtMy0yLTEuIGFsc28gcmVtb3ZlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBmcm9tIERPTVxyXG4gKiBcclxuICogNC4gVmlkZW8gcGxheS9wYXVzZSBidXR0b24gY2hlY2tzIGZvclxyXG4gKiAgIDQtMS4gQXR0cmlidXRlIGNoYW5nZSB2aWRlb1BsYXllclN0YXRlQXR0cjogXCJwbGF5aW5nXCIgb3IgXCJwYXVzZWRcIlxyXG4gKiAgICAgNC0xLTEuIElmIGF0dHJpYnV0ZSB2YWx1ZSBjaGFuZ2VkIHRvIFwicGxheWluZ1wiLCBzdG9wIGFsbCBhdWRpbyBpbiB0aGUgVmlkZW9QbGF5ZXJDb250YWluZXJcclxuICogXHJcbiAqIDUuIFZvbHVtZSBzbGlkZXIgY2hlY2tzIGZvclxyXG4gKiAgIDUtMS4gQXR0cmlidXRlIFwidmFsdWVcIiBjaGFuZ2U6IG51bWJlciBiZXR3ZWVuIDAgPD0gbnVtIDw9IDFcclxuICogICAgIDUtMS0xLiBJZiBjaGFuZ2UgaXMgZGV0ZWN0ZWQsIGFwcGx5IHRoZSBuZXcgdm9sdW1lIHRvIGF1ZGlvRWxlbS5cclxuICogXHJcbiAqIDYuIG9yaWdpbmFsIFwidmlkZW9cIiBlbGVtZW50IGluIHZpZGVvLXBsYXllciBjaGVja3MgZm9yXHJcbiAqICAgNi0xLiBBdHRyaWJ1dGUgXCJzcmNcIiBjaGFuZ2U6IG1lYW5zIHRoYXQgdGhlIHZpZGVvIHNvdXJjZSBjaGFuZ2VkIChsaWtlbHkgaG9zdGluZyBhbm90aGVyIHN0cmVhbWVyKVxyXG4gKiAgICAgNi0xLTEuIFJhZGlvIG1vZGUgYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZD8gUmUtY29uZmlndXJlZCB3aXRoIHRoZSBuZXcgc3RyZWFtZXIncyBVUkw/XHJcbiAqICAgIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb3cgdG8gZGV0ZWN0IHRoZSBjaGFubmVsIG9mIHRoZSBzdHJlYW0gYmVpbmcgcGxheWVkP1xyXG4gKiBHZXR0aW5nIGNoYW5uZWwgbmFtZSBmcm9tIFVSTCBoYXMgdGhlIGZvbGxsb3dpbmcgaXNzdWVzXHJcbiAqICgxKSBTdHJlYW1lciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbFxyXG4gKiAoMikgTWFpbiBwYWdlLiBDaGFubmVsIGNhbiBjaGFuZ2UgcXVpY2tseSBpbiB0aGUgY2Fyb3VzZWxcclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgS2VlcCB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgVVJMIGluIHRoZSB0YWIuIEd1ZXNzIHRoZSBjaGFubmVsIGZyb20gdGhlcmVcclxuICogKDIpIEZvciBcInNpdGVfbWluaVwiIHN0YXRlLCBzdG9yZSB0aGUgY2hhbm5lbCBuYW1lIGluIHZpZGVvIHBsYXllci5cclxuICogICAgIEluIHRoYXQgY2FzZSwgaXQgd2lsbCBiZSBwb3NzaWJsZSB0byByZXN1bWUgcGxheWluZyBpbiB0aGUgcmlnaHQgY2hhbm5lbC5cclxuICogKDMpIERpc2FibGUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGluIHRoZSBtYWluIHBhZ2VcclxuICogXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFkZCByYWRpbyBtb2RlIGJ1dHRvbiBpbiBzaXRlX21pbmk/XHJcbiAqIERvbid0IHN0b3JlIHRoZSBwbGF5c3RhdGUgaW4gRE9NOiBvbmx5IHN0b3JlIGl0IGluIFZpZGVvUGxheWVyIGNsYXNzIGFzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEVTcG9ydHMgcGFnZTogdmlkZW8gbWluaXBsYXllciBrZWVwcyBwbGF5aW5nIGV2ZW4gd2hlbiB0aGUgc2l0ZSBwbGF5ZXIgaW4gRXNwb3J0cyBwYWdlIGlzIGFsc28gYmVpbmcgcGxheWVkLlxyXG4gKiBTaG91bGQgdGhlIHJhZGlvIG1vZGUgZm9sbG93IHRoZSBzYW1lIGJlaGF2aW9yP1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBY2Nlc3MgdG9rZW4gdXJsIGhhcyBvYXV0aCBjb2RlLCB3aGljaCBpcyB1bmRlZmluZWQgaWYgdGhlIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICogTm90IHN1cmUgaG93IFR3aXRjaCByZXR1cm5zIGNvcnJlY3QgcmVzcG9uc2UgZm9yIGFub255bW91cyB1c2VyIHlldC5cclxuICogQ2FsbGluZyB0aGUgc2FtZSBhY2Nlc3MgdG9rZW4gVVJMIGZyb20gY29udGVudHNjcmlwdCByZXR1cm5zIGVycm9yLlxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBEaXNhYmxlIHRoZSBidXR0b24gd2hlbiB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqL1xyXG5cclxuXHJcbmNvbnN0IGVudW0gUGxheWluZ1N0YXRlIHtcclxuICAgIERJU0FCTEVEID0gXCJkaXNhYmxlZFwiLFxyXG4gICAgUEFVU0VEID0gXCJwYXVzZWRcIixcclxuICAgIFBMQVlJTkcgPSBcInBsYXlpbmdcIixcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBlbGVtZW50Py5nZXRBdHRyaWJ1dGUocHJvY2Vzc2VkQXR0cikgPT09IHByb2Nlc3NlZEF0dHJWYWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcmtQcm9jZXNzZWQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgZWxlbWVudD8uc2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIsIHByb2Nlc3NlZEF0dHJWYWwpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udHJvbEdyb3VwIHtcclxuICAgIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWVyOiBWaWRlb1BsYXllcjtcclxuICAgIHBsYXlCdXR0b25FbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICByYWRpb0J1dHRvbjogSFRNTEVsZW1lbnQ7XHJcbiAgICBjb21wb25lbnRzT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBwbGF5QnV0dG9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICB2b2x1bWVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjsgXHJcblxyXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBWaWRlb1BsYXllciwgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBjb250cm9sR3JvdXBFbGVtO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlci5vYnNlcnZlKHRoaXMuY29udHJvbEdyb3VwRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvLyBDaGVjayBmb3IgbmV3IFBsYXkvQXVkaW8gYnV0dG9uIGFuZCB2b2x1bWUgc2xpZGVyIFxyXG4gICAgICAgIGNvbnN0IHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHBsYXlCdXR0b25BdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW0pO1xyXG4gICAgICAgIGNvbnN0IHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3Rvcih2b2x1bWVTbGlkZXJBdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtKTtcclxuICAgICAgICAvLyBBZGQgdGhlIHJhZGlvIGJ1dHRvbiBpZiBub3QgZXhpc3RzXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAvLyBwbGF5IGJ1dHRvbiBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCFwbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMucGxheUJ1dHRvbkVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHBsYXlCdXR0b25FbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMucGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnMgaWYgYSB2aWRlbyBzdGFydHMgdG8gcGxheS5cclxuICAgICAgICAvLyBUaGlzIGlzIG5lY2VzYXNyeSBmb3IgYSBjYXNlIHdoZW4gdXNlciBicm93c2VzIHRvIGEgbm9uLWNoYW5uZWwgcGFnZSAoZS5nLiBtYWluLCBlc3BvcnRzKVxyXG4gICAgICAgIC8vIHdoaWNoIGF1dG9tYXRpY2FsbHkgcGxheXMgYSB2aWRlby5cclxuICAgICAgICB0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlbygpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXlCdXR0b25FbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlQXVkaW9Gb3JWaWRlbygpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZihzdGF0ZSA9PT0gXCJwbGF5aW5nXCIpIHsgIC8vIFZpZGVvIHN0YXRlIGZyb20gcGF1c2VkIHRvIHBsYXlpbmdcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucGF1c2VBbGwoKTsgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFZvbHVtZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXllci5hdWRpb0VsZW0gJiYgdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IHRoaXMudm9sdW1lU2xpZGVyRWxlbS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYXVkaW9FbGVtLnZvbHVtZSA9IHBhcnNlRmxvYXQodm9sdW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICAvLyB2b2x1bWUgc2xpZGVyIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodm9sdW1lU2xpZGVyRWxlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IHZvbHVtZVNsaWRlckVsZW07XHJcbiAgICAgICAgLy8gTXV0YXRpb25PYnNlcnZlciB0byB2b2x1bWVTbGlkZXJcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5hZGp1c3RWb2x1bWUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlci5vYnNlcnZlKHRoaXMudm9sdW1lU2xpZGVyRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCkge1xyXG4gICAgICAgIC8vIERvbid0IHByb2NlZWQgdW5sZXNzIGJvdGggcGxheUJ1dHRvbkVsZW0gYW5kIHZvbHVtZVNsaWRlckVsZW0gYXJlIGF2YWlsYWJsZVxyXG4gICAgICAgIGlmKCF0aGlzLnBsYXlCdXR0b25FbGVtIHx8ICF0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB3YXMgYWxyZWFkeSBjcmVhdGVkLCBkbyBub3RoaW5nXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQodGhpcy5yYWRpb0J1dHRvbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogVXNlIHdlYnBhY2sgaHRtbCBsb2FkZXJcclxuICAgICAgICBjb25zdCBidXR0b25XcmFwcGVyRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJ1dHRvbldyYXBwZXJEb20uaW5uZXJIVE1MID0gaW5pdGlhbEJ1dHRvbkRvbTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcclxuICAgICAgICBtYXJrUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIHRoaXMucGxheWVyLnBsYXlpbmdTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5vbmNsaWNrID0gdGhpcy5wbGF5ZXIub25SYWRpb0J1dHRvbkNsaWNrZWQuYmluZCh0aGlzLnBsYXllcik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtLmFwcGVuZENoaWxkKGJ1dHRvbldyYXBwZXJEb20pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBsYXkoKSB7XHJcbiAgICAgICAgLy8gTk9URTogVGhlcmUgaXMgMX4zIHNlY29uZHMgb2YgZGVsYXkgYmV0d2VlbiByYWRpby1tb2RlIGJ1dHRvbiBjbGljayBhbmQgc291bmQgYmVpbmcgcGxheWVkLlxyXG4gICAgICAgIC8vIEl0J3MgYmV0dGVyIHRvIHNob3cgc29tZSBpbnRlcm1lZGlhdGUgc3RhdGUgKGljb24gY2hhbmdlLCBtb3VzZSBjdXJzb3IgY2hhbmdlLCBldGMpIGluIHRoZSBtZWFud2hpbGVcclxuICAgICAgICBcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbj8uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLlBMQVlJTkcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBhdXNlKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uPy5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuUEFVU0VEKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JEaXNhYmxlZCgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbj8uc2V0QXR0cmlidXRlKHJhZGlvTW9kZVN0YXRlQXR0ciwgUGxheWluZ1N0YXRlLkRJU0FCTEVEKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgLy8gSXMgdGhpcyBuZWNlc3Nhcnk/XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFZpZGVvUGxheWVyIHtcclxuICAgIHBsYXllcklkOiBzdHJpbmc7XHJcbiAgICBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyO1xyXG4gICAgcGxheWVyRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwbGF5aW5nU3RhdGU6IFBsYXlpbmdTdGF0ZTtcclxuICAgIGF0dHJpYnV0ZU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgY29udHJvbEdyb3VwOiBDb250cm9sR3JvdXA7XHJcbiAgICBjb250cm9sR3JvdXBPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGhsczogSGxzO1xyXG4gICAgYXVkaW9FbGVtOiBIVE1MVmlkZW9FbGVtZW50O1xyXG4gICAgdmlkZW9FbGVtOiBIVE1MVmlkZW9FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcklkOiBzdHJpbmcsIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXIsIHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbSA9IHBsYXllckVsZW07XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSB0aGlzLmlzUG9zc2libHlJbkNoYW5uZWxQYWdlKCkgPyBQbGF5aW5nU3RhdGUuUEFVU0VEIDogUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG5cclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IHBsYXllckVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2aWRlb1wiKVswXTsgICBcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzUGVyTGl2ZW5lc3MoKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKGNvbnRyb2xHcm91cEVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheShtZWRpYVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSA8dmlkZW8+IGVsZW1lbnQgdG8gcGxheSBhdWRpby5cclxuICAgICAgICAvLyA8YXVkaW8+IGNhbiBiZSBhbHNvIHVzZWQgYnkgaGxzLmpzLCBidXQgVHlwZXNjcmlwdCBmb3JjZXMgdGhpcyB0byBiZSBIVE1MVmlkZW9FbGVtZW50LlxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtID0gPEhUTUxWaWRlb0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLmNsYXNzTGlzdC5hZGQoXCJub2Rpc3BsYXlcIik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmFkanVzdFZvbHVtZSgpOyAgLy8gTWF0Y2ggdGhlIGluaXRpYWwgdm9sdW1lIHdpdGggdGhlIHNsaWRlciB2YWx1ZS5cclxuICAgICAgICB0aGlzLnBsYXllckVsZW0uYXBwZW5kQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgIHRoaXMuaGxzID0gbmV3IEhscyh7XHJcbiAgICAgICAgICAgIC8vZGVidWc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpdmVTeW5jRHVyYXRpb246IDAsXHJcbiAgICAgICAgICAgIGxpdmVNYXhMYXRlbmN5RHVyYXRpb246IDUsXHJcbiAgICAgICAgICAgIGxpdmVEdXJhdGlvbkluZmluaXR5OiB0cnVlICAvLyB0cnVlIGZvciBsaXZlIHN0cmVhbVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGxzLmxvYWRTb3VyY2UobWVkaWFVcmwpO1xyXG4gICAgICAgIHRoaXMuaGxzLmF0dGFjaE1lZGlhKHRoaXMuYXVkaW9FbGVtKTsgXHJcbiAgICAgICAgLy8gVE9ETzogSXMgdGhpcyBzYWZlIHRvIHBsYXkgcmlnaHQgYXdheSBhZnRlciBhdHRhY2hpbmcgdGhlIG1lZGlhP1xyXG4gICAgICAgIC8vIFRoZSBtYWluIGV4YW1wbGUgYXQgaGxzLmpzIHdlYnNpdGUgdGVsbHMgdG8gdXNlIE1BTklGRVNUX1BBUlNFRCBldmVudCxcclxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIHRoZSBldmVudCBpcyBub3QgdHJpZ2dlcmVkIHdpdGggdHlwZXNjcmlwdCt3ZWJwYWNrLlxyXG4gICAgICAgIGNvbnN0IGF1ZGlvUGxheUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheSBzdGFydGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbS5wbGF5KCkudGhlbihhdWRpb1BsYXlDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QTEFZSU5HO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFN0b3AgdGhlIHZpZGVvIGlmIHBsYXlpbmdcclxuICAgICAgICB0aGlzLnBhdXNlVmlkZW8oKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQgfHwgdGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QQVVTRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmhscykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFwiRE9NRXhjZXB0aW9uOiBUaGUgcGxheSgpIHJlcXVlc3Qgd2FzIGludGVycnVwdGVkIGJ5IGEgY2FsbCB0byBwYXVzZSgpXCJcclxuICAgICAgICAgICAgICAgIC8vIGlzIHRocm93biB3aGVuIHVzZXIgcGF1c2VzIHRoZSBhdWRpbyB0b28gcXVpY2tseSBhZnRlciBwbGF5aW5nLlxyXG4gICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIGlzIG5lZWRlZC4gVGhlIGF1ZGlvIHdpbGwgYmUgcGF1c2VkIGNvcnJlY3RseSBhbnl3YXkuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5obHMuc3RvcExvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGV0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyB0aGF0IHRoZSBITFMgb2JqZWN0IGdldHMgc3R1Y2sgYWZ0ZXIgbXVsdGlwbGUgcGxheXMgYW5kIHBhdXNlc1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyByZS11c2VkIGZvciB0aGUgbmV4dCBwbGF5LiBOZWVkIHRvIGRlc3Ryb3kgdGhlIG9iamVjdCBhbmQgcmUtY3JlYXRlIGl0LlxyXG4gICAgICAgICAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyRWxlbS5yZW1vdmVDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQYXVzZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBvblBhdXNlID0gZnVuY3Rpb24ocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYocmVzdWx0LmF1dG9wbGF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlWaWRlbygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhdXRvcGxheSddLCBvblBhdXNlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlWaWRlbygpIHtcclxuICAgICAgICB0aGlzLnRvZ2dsZVZpZGVvU3RhdGVJZihcInBhdXNlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZVZpZGVvKCkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlVmlkZW9TdGF0ZUlmKFwicGxheWluZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVWaWRlb1N0YXRlSWYoZXhwZWN0ZWRTdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdmlkZW9QbGF5QnV0dG9uID0gdGhpcy5jb250cm9sR3JvdXAucGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZSA9IHZpZGVvUGxheUJ1dHRvbj8uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZih2aWRlb1N0YXRlID09PSBleHBlY3RlZFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZpZGVvUGxheUJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyc1xyXG4gICAgcGF1c2VBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvckRpc2FibGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdoYXQgZWxzZSB0byBkbyBoZXJlP1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFBsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VDYWxsYmFjayA9IGFzeW5jIGZ1bmN0aW9uKHJlc3BvbnNlOiBHZXRVcmxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYoIXJlc3BvbnNlPy53ZWJVcmw/LmNoYW5uZWwpIHtcclxuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnRseSBpbiBhIG5vbi1jaGFubmVsIHBhZ2UuIERpc2FibGUgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlsaXN0ID0gYXdhaXQgdHJ5RmV0Y2hpbmdQbGF5bGlzdChyZXNwb25zZS53ZWJVcmwpO1xyXG4gICAgICAgICAgICBpZighcGxheWxpc3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9mZmxpbmUgb3IgaG9zdGluZyBhbm90aGVyIGNoYW5uZWwuIERpc2FibGUgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBhdWRpb1N0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKHBsYXlsaXN0KTtcclxuICAgICAgICAgICAgaWYoYXVkaW9TdHJlYW1VcmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KGF1ZGlvU3RyZWFtVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiZ2V0X2F1ZGlvX3VybFwiLCBjaGFubmVsOiBjaGFubmVsfSwgcmVzcG9uc2VDYWxsYmFjay5iaW5kKHRoaXMpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgaXNQb3NzaWJseUluQ2hhbm5lbFBhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWwgIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ29udHJvbHNQZXJMaXZlbmVzcygpIHtcclxuICAgICAgICAvLyBJZiB3YXRjaGluZyBhIGxpdmUgc3RyZWFtLCBlbmFibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gSWYgd2F0Y2hpbmcgVk9EIG9mIGNsaXAsIGRpc2FibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gRm9yIG5vdywgdGhlIGxvZ2ljIGZvciBjaGVja2luZyBsaXZlL3JlY29yZGVkIHZpZGVvIGlzIGV4aXN0ZW5jZSBvZiB0aW1lIHNlZWtiYXIuXHJcbiAgICAgICAgY29uc3Qgc2Vla2JhciA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCIpPy5bMF07XHJcblxyXG4gICAgICAgIC8vIFdoZW4gc2Vla2JhciBhcHBlYXJlZCBhbmQgdGhlIHJhZGlvIGJ1dHRvbiBpcyBub3QgZGlzYWJsZWQgeWV0LlxyXG4gICAgICAgIGlmKHNlZWtiYXIgJiYgdGhpcy5wbGF5aW5nU3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25SYWRpb0J1dHRvbkNsaWNrZWQoKSB7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGxheWluZ1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBBVVNFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXkoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QTEFZSU5HOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyQ29udGFpbmVyIHtcclxuICAgIHBsYXllcnM6IFZpZGVvUGxheWVyW107XHJcbiAgICBuZXh0SWQ6IG51bWJlcjtcclxuICAgIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMubmV4dElkID0gMTAwMDE7ICAvLyBSYW5kb20gc3RhcnQgaW5kZXggZm9yIHBsYXllci5cclxuICAgIH1cclxuXHJcbiAgICBydW4oKSB7XHJcbiAgICAgICAgLy8gRmluZCBleGlzdGluZyB2aWRlbyBwbGF5ZXIgZWxlbWVudHMgdG8gY3JlYXRlIFZpZGVvUGxheWVyIG9iamVjdHNcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZGVvUGxheWVyTGlzdCgpO1xyXG4gICAgICAgIC8vIERldGVjdCBmdXR1cmUgdmlkZW8gcGxheWVyIGVsZW1lbnRzXHJcbiAgICAgICAgY29uc3QgbWFpbkVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1haW5cIilbMF07XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShtYWluRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZpZGVvUGxheWVyTGlzdCgpIHtcclxuICAgICAgICAvLyBUT0RPOiBJcyBpdCBiZXR0ZXIgdG8gaXRlcmF0ZSBvbmx5IHRoZSBtdXRhdGVkIGRpdnM/XHJcbiAgICAgICAgY29uc3QgcGxheWVyRWxlbXMgPSBkb2N1bWVudC5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodmlkZW9QbGF5ZXJDbGFzcyk7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXJFbGVtIG9mIHBsYXllckVsZW1zKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXYgaXMgbm90IGFscmVhZHkgcHJvY2Vzc2VkXHJcbiAgICAgICAgICAgIGlmKCFpc1Byb2Nlc3NlZChwbGF5ZXJFbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIk5ldyB2aWRlbyBwbGF5ZXIgZGV0ZWN0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtIGFzIEhUTUxFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm8gbmVlZCB0byBwcm9jZWVkIGlmIHRoZXJlIGFyZSB0aGUgc2FtZSBudW1iZXIgb2YgcGxheWVycyBpbiB0aGUgbGlzdCBhbmQgaW4gRE9NLlxyXG4gICAgICAgIGlmKHBsYXllckVsZW1zLmxlbmd0aCA9PT0gdGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhcmJhZ2VDb2xsZWN0UGxheWVycyhwbGF5ZXJFbGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHZpZGVvIHBsYXllcnMgbm90IGluIERPTSBhbnltb3JlLlxyXG4gICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gYSB1c2VyIGJyb3dzZXMgZnJvbSBhIG5vbi1jaGFubmVsIHBhZ2UgKG1haW4sIGRpcmVjdG9yeSwgZXRjLikgdG8gYSBjaGFubmVsIHBhZ2UsXHJcbiAgICAvLyBvciBiZXR3ZWVuIG5vbi1jaGFubmVsIHBhZ2VzLlxyXG4gICAgZ2FyYmFnZUNvbGxlY3RQbGF5ZXJzKHBsYXllckVsZW1zOiBIVE1MQ29sbGVjdGlvbk9mPEVsZW1lbnQ+KSB7XHJcbiAgICAgICAgY29uc3QgYWxsUGxheWVySWRzSW5Eb206IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXJFbGVtIG9mIHBsYXllckVsZW1zKSB7XHJcbiAgICAgICAgICAgIGFsbFBsYXllcklkc0luRG9tLnB1c2gocGxheWVyRWxlbS5nZXRBdHRyaWJ1dGUocGxheWVySWRBdHRyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJBbGwgcGxheWVySWRzIGluIERPTTogXCIgKyBhbGxQbGF5ZXJJZHNJbkRvbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld2xpc3QgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBwbGF5ZXIucGxheWVySWQ7XHJcbiAgICAgICAgICAgIGlmKGFsbFBsYXllcklkc0luRG9tLmluZGV4T2YocGxheWVySWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdsaXN0LnB1c2gocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYFBsYXllciAke3BsYXllcklkfSBpcyBub3QgaW4gRE9NIGFueW1vcmUuIERlbGV0aW5nLi5gKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gbmV3bGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChwbGF5ZXJFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQocGxheWVyRWxlbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1BsYXllcklkID0gdmlkZW9QbGF5ZXJJZFByZWZpeCArIHRoaXMubmV4dElkO1xyXG4gICAgICAgIHRoaXMubmV4dElkICs9IDE7XHJcbiAgICAgICAgcGxheWVyRWxlbS5zZXRBdHRyaWJ1dGUocGxheWVySWRBdHRyLCBuZXdQbGF5ZXJJZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IG5ldyBWaWRlb1BsYXllcihuZXdQbGF5ZXJJZCwgdGhpcywgcGxheWVyRWxlbSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUV4Y2VwdChwbGF5ZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmKHBsYXllci5wbGF5ZXJJZCAhPT0gcGxheWVySWQpIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyAgLy8gV2lsbCB0aGlzIGZ1bmN0aW9uIGV2ZXIgYmUgdXNlZD9cclxuICAgICAgICB0aGlzLm9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJcclxuaW1wb3J0IHsgVmlkZW9QbGF5ZXJDb250YWluZXIgfSBmcm9tIFwiLi92aWRlb19wbGF5ZXJfY29udGFpbmVyXCI7XHJcblxyXG5cclxudmFyIGNvbnRhaW5lciA9IG5ldyBWaWRlb1BsYXllckNvbnRhaW5lcigpO1xyXG5jb250YWluZXIucnVuKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=