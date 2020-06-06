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
        this.videoElem = playerElem.getElementsByTagName("video")[0];
        //this.videoElem.setAttribute("poster", "https://static-cdn.jtvnw.net/ttv-boxart/Science%20&%20Technology-285x380.jpg");
        this.imageElem = document.createElement("img");
        this.imageElem.src = "https://static-cdn.jtvnw.net/ttv-boxart/Science%20&%20Technology-285x380.jpg";
        this.imageElem.style.display = "none";
        this.videoElem.parentNode.insertBefore(this.imageElem, this.videoElem.nextSibling);
    }
    tryUpdatingControlGroup() {
        var _a, _b, _c, _d;
        this.updateControlsPerLiveness();
        //data-a-target="player-overlay-play-button"
        this.overlayButton = (_a = this.playerElem.querySelectorAll("button[data-a-target='player-overlay-play-button']")) === null || _a === void 0 ? void 0 : _a[0];
        if (this.overlayButton && this.playingState == "playing" /* PLAYING */) {
            this.overlayButton.style.display = "none";
            this.overlayButton.classList.remove("tw-block");
        }
        // Check if the control group DOM is ready
        const controlGroupElem = (_b = this.playerElem.getElementsByClassName(controlGroupClass)) === null || _b === void 0 ? void 0 : _b[0];
        if (!controlGroupElem) { // control group cannot be found in DOM
            (_c = this.controlGroup) === null || _c === void 0 ? void 0 : _c.destroy(); // destroy reference to the removed DOM
            this.controlGroup = null;
            return;
        }
        // Add processed class name to prevent duplicate processing of this element
        if (isProcessed(controlGroupElem)) {
            return;
        }
        markProcessed(controlGroupElem);
        (_d = this.controlGroup) === null || _d === void 0 ? void 0 : _d.destroy();
        this.controlGroup = new ControlGroup(this, controlGroupElem);
    }
    play(mediaUrl) {
        var _a, _b, _c;
        if (!mediaUrl) {
            console.debug("No mediaUrl is found to play");
            return;
        }
        if (this.audioElem) {
            console.debug("Audio element already exists");
            return;
        }
        if (this.videoElem) {
            this.videoElem.style.display = "none";
            (_a = this.imageElem) === null || _a === void 0 ? void 0 : _a.removeAttribute("style");
        }
        if (this.overlayButton) {
            this.overlayButton.style.display = "none";
            this.overlayButton.classList.remove("tw-block");
        }
        // Create a separate <video> element to play audio.
        // <audio> can be also used by hls.js, but Typescript forces this to be HTMLVideoElement.
        this.audioElem = document.createElement("audio");
        this.audioElem.style.display = "none";
        (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.adjustVolume(); // Match the initial volume with the slider value.
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
        (_c = this.controlGroup) === null || _c === void 0 ? void 0 : _c.updateForPlay();
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
        if (this.videoElem) {
            this.videoElem.removeAttribute("style");
            this.imageElem.style.display = "none";
        }
        if (this.overlayButton) {
            this.overlayButton.removeAttribute("style");
            this.overlayButton.classList.add("tw-block");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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QUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDakIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQ0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQjtRQUN4QixLQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUIsSUFBRyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVE7Z0JBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztJQUVELE9BQU87O1FBQ0gsVUFBSSxDQUFDLFFBQVEsMENBQUUsVUFBVSxHQUFHO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLEtBQUksSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQ0o7OztBQ3BtQitEO0FBR2hFLElBQUksU0FBUyxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztBQUMzQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMiLCJmaWxlIjoiY29udGVudHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcbiIsIlxyXG5jb25zdCB0d2l0Y2hEb21haW4gOiBzdHJpbmcgPSBcInR3aXRjaC50di9cIjtcclxuLy8gTm9uLWV4aHVhc3RpdmUgbGlzdCBvZiBub24tY2hhbm5lbCByb3V0ZXMgaW4gdHdpdGNoLnR2XHJcbmNvbnN0IG5vbkNoYW5uZWxzIDogc3RyaW5nW10gPSBbXHJcbiAgICBcIlwiLCBcImRpcmVjdG9yeVwiLCBcInZpZGVvc1wiLCBcInVcIiwgXCJzZXR0aW5nc1wiLCBcImZyaWVuZHNcIiwgXCJzdWJzY3JpcHRpb25zXCIsIFwiaW52ZW50b3J5XCIsIFwid2FsbGV0XCJdO1xyXG5cclxuY29uc3QgYXBpRG9tYWluIDogc3RyaW5nID0gXCJhcGkudHdpdGNoLnR2L2FwaS9jaGFubmVscy9cIjtcclxuY29uc3QgYWNjZXNzVG9rZW4gOiBzdHJpbmcgPSBcIi9hY2Nlc3NfdG9rZW5cIjtcclxuXHJcbmNvbnN0IHVzaGVyRG9tYWluIDogc3RyaW5nID0gXCJ1c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzL1wiO1xyXG5jb25zdCB1c2hlckV4dCA6IHN0cmluZyA9IFwiLm0zdThcIjtcclxuXHJcblxyXG4vLyBFeHRyYWN0IGF1ZGlvX29ubHkgc3RyZWFtIC5tM3U4IGZyb20gdGhlIG1hc3RlciBwbGF5bGlzdCBjb250ZW50LlxyXG4vLyBSZXR1cm5zIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2YgYSBVUkwgYWZ0ZXIgYXVkaW9fb25seSBtZXRhZGF0YS5cclxuLy8gVE9ETzogVGhpcyB3b3JrcywgYnV0IGV2ZW50dWFsbHkgd2Ugd2lsbCBuZWVkIHRvIGZ1bGx5IHBhcnNlIHRoZSBjb250ZW50XHJcbi8vIGFuZCBnZXQgYXVkaW9fb25seSBzdHJlYW0gdXJsXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF1ZGlvT25seVVybChjb250ZW50OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGlmKCFjb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gICAgbGV0IGF1ZGlvT25seUZvdW5kID0gZmFsc2U7XHJcbiAgICBmb3IobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgICBpZiAobGluZS5pbmNsdWRlcyhcImF1ZGlvX29ubHlcIikpIGF1ZGlvT25seUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICBpZiAoYXVkaW9Pbmx5Rm91bmQgJiYgbGluZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly9cIikpIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21XZWJVcmwod2VidXJsPzogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAvLyBDaGFubmVsIG5hbWUgbWF5IG5vdCBiZSBhdmFpbGFibGUgZnJvbSB0aGUgbWFpbiBwYWdlIFVSTFxyXG4gICAgY29uc3QgdXJsID0gd2VidXJsID8/IGxvY2F0aW9uLmhyZWY7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVybCwgdHdpdGNoRG9tYWluLCBcIi9cIiwgdHJ1ZSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNoYW5uZWwgbmFtZSBcIiArIGNoYW5uZWwgKyBcIiwgZnJvbSBVUkw6IFwiICsgdXJsKVxyXG5cclxuICAgIC8vIEZpbHRlciBvdXQgc29tZSBub24tY2hhbm5lbCBwYWdlcyB3aXRoIHNpbWlsYXIgVVJMIHBhdHRlcm4gYXMgY2hhbm5lbCBwYWdlc1xyXG4gICAgaWYgKGNoYW5uZWwgaW4gbm9uQ2hhbm5lbHMpIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Ub2tlblVybChhY2Nlc3NUb2tlblVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKGFjY2Vzc1Rva2VuVXJsLCBhcGlEb21haW4sIGFjY2Vzc1Rva2VuKTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCBhY2Nlc3MgdG9rZW46IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXNoZXJVcmwsIHVzaGVyRG9tYWluLCB1c2hlckV4dCk7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgdXNoZXI6IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbi8vIEdldCBjaGFubmVsIGJldHdlZW4gdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBzdGFydFN0ciBhbmQgdGhlIGZpcnN0IGVuZFN0ciBhZnRlciBzdGFydFN0ci5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhcclxuICAgICAgICB1cmw6IHN0cmluZywgc3RhcnRTdHI6IHN0cmluZywgZW5kU3RyOiBzdHJpbmcsIGVuZE9wdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIDogc3RyaW5nIHtcclxuICAgIGxldCBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc3RhcnRTdHIpO1xyXG4gICAgaWYoc3RhcnRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHN0YXJ0SW5kZXggKz0gc3RhcnRTdHIubGVuZ3RoO1xyXG5cclxuICAgIGxldCBlbmRJbmRleCA9IHVybC5pbmRleE9mKGVuZFN0ciwgc3RhcnRJbmRleCArIDEpO1xyXG4gICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgaWYoZW5kT3B0aW9uYWwpIGVuZEluZGV4ID0gdXJsLmxlbmd0aDtcclxuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG59XHJcblxyXG5cclxuLy8gVE9ETzogSW5zdGVhZCBvZiBwcmUtZGVmaW5lZCB1cmwgZm9ybWF0LCB1c2UgcmVjZW50bHkgdXNlZCBvbnQgaW4gVHdpdGNoIHdlYlxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcsIHNpZzogc3RyaW5nKSA6IFVzaGVyVXJsIHtcclxuICAgIGNvbnN0IHVzaGVyVXJsID0gbmV3IFVzaGVyVXJsKGBodHRwczovL3VzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvJHtjaGFubmVsfS5tM3U4YCk7XHJcbiAgICB1c2hlclVybC51cGRhdGUodG9rZW4sIHNpZyk7XHJcblxyXG4gICAgLy8gSXQgaXMgbm90IGNsZWFyIGlmIGFsbCBvZiB0aGVzZSBwYXJhbXMgYXJlIHJlcXVpcmVkIG9yIGlmIHRoZXJlIGFyZSBhbnkgbWlzc2luZyBvbmVzLlxyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJwbGF5ZXJcIiwgXCJ0d2l0Y2h3ZWJcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcImFsbG93X3NvdXJjZVwiLCBcInRydWVcIik7XHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInR5cGVcIiwgXCJhbnlcIik7XHJcbiAgICBcclxuICAgIHJldHVybiB1c2hlclVybDtcclxufVxyXG5cclxuXHJcbi8vIEludGVyZmFjZSB0byBjb21tdW5pY2F0ZSBiZXR3ZWVuIGJhY2tncm91bmQgYW5kIGNvbnRlbnRzY3JpcHRcclxuLy8gdG8gcmVxdWVzdC9yZXNwb25kIGFjY2VzcyB0b2tlbiBVUkwgYW5kIHVzaGVyIFVSTCBmb3IgYSBjaGFubmVsLlxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFVybHNSZXNwb25zZSB7XHJcbiAgICB3ZWJVcmw6IFVybEdyb3VwO1xyXG4gICAgbGFzdFJlcXVlc3RlZDogVXJsR3JvdXA7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFVybEdyb3VwIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmc7XHJcbiAgICB1c2hlclVybDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy8gQ2xhc3MgdG8gc3RvcmUgYW5kIG1hbmlwdWxhdGUgdXNoZXIgVVJMLlxyXG5leHBvcnQgY2xhc3MgVXNoZXJVcmwge1xyXG4gICAgb3JpZ2luYWxVcmw6IHN0cmluZztcclxuICAgIHVybE9iamVjdDogVVJMO1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgZXhwaXJlc0F0OiBudW1iZXI7ICAvLyBUb2tlbiBleHBpcmF0aW9uIGRhdGV0aW1lIGluIGVwb2NoIHNlY29uZHNcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxVcmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3QgPSBuZXcgVVJMKHVybCk7XHJcbiAgICAgICAgdGhpcy5jaGFubmVsID0gdGhpcy5nZXRDaGFubmVsKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcImFsbG93X2F1ZGlvX29ubHlcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVuZXhwaXJlZFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHNTaW5jZUVwb2NoID0gTWF0aC5yb3VuZChub3cuZ2V0VGltZSgpIC8gMTAwMCk7XHJcbiAgICAgICAgLy8gNjAgc2Vjb25kcyBidWZmZXIgYmVmb3JlIHRva2VuIGV4cGlyYXRpb25cclxuICAgICAgICBpZihzZWNvbmRzU2luY2VFcG9jaCArIDYwIDwgdGhpcy5leHBpcmVzQXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VXJsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYENhY2hlZCBVUkwgZm9yICR7dGhpcy5jaGFubmVsfSBpcyBleHBpcmVkYCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVybE9iamVjdC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgodXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiP1wiKTtcclxuICAgICAgICBpZihlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFF1ZXJ5U3RyaW5nKGtleTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuZ2V0KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFF1ZXJ5U3RyaW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5zZXQobmFtZSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4cGlyZXNBdCgpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCB0b2tlblN0cmluZyA9IHRoaXMuZ2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAgICBpZighdG9rZW5TdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkpzb24gPSBKU09OLnBhcnNlKHRva2VuU3RyaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgZXhwaXJlc0F0ID0gdG9rZW5Kc29uLmV4cGlyZXMgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlc0F0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYENhbm5vdCBwYXJzZSB0b2tlbiBpbiB1c2hlciBVUkwuIEVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbm5lbCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh0aGlzLm9yaWdpbmFsVXJsKTtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3VG9rZW46IHN0cmluZywgbmV3U2lnOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIiwgbmV3VG9rZW4pO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJzaWdcIiwgbmV3U2lnKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwicFwiLCB0aGlzLmdldFJhbmRvbU51bWJlcigpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21OdW1iZXIoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IGJ1aWxkVXNoZXJVcmwsIHBhcnNlQXVkaW9Pbmx5VXJsLCBVcmxHcm91cCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaENvbnRlbnQodXJsOiBzdHJpbmcpIHtcclxuICAgIGlmKCF1cmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBzdGF0dXMgaWYgb2tcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICB9XHJcbiAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBmZXRjaENvbnRlbnQgdGhyZXcgYW4gZXJyb3I6ICR7ZXJyfWApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVybCk7XHJcbiAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BKc29uID0gSlNPTi5wYXJzZShyZXNwVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwSnNvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgY291bGQgbm90IGJlIHBhcnNlZCB0byBKU09OOiBcIiArIHJlc3BUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEF1ZGlvU3RyZWFtVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXNoZXJVcmwpO1xyXG4gICAgY29uc3Qgc3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudCk7XHJcbiAgICByZXR1cm4gc3RyZWFtVXJsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlblVybDogc3RyaW5nLCBsYXN0UmVxdWVzdGVkQ2hhbm5lbDogc3RyaW5nLFxyXG4gICAgICAgIGxhc3RSZXF1c3RlZFVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKHRva2VuVXJsKTtcclxuICAgIGlmKCFyZXNwSnNvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uLnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uLnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgY2hhbm5lbCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY2hhbm5lbCBvZiB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgdXJsXHJcbiAgICAvLyAoVGhpcyBpcyBwb3NzaWJsZSBpZiB0aGUgY2hhbm5lbCdzIHN0cmVhbWVyIGlzIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsKVxyXG4gICAgaWYobGFzdFJlcXVlc3RlZENoYW5uZWwgJiYgY2hhbm5lbCAhPT0gbGFzdFJlcXVlc3RlZENoYW5uZWwpIHtcclxuICAgICAgICBpZihsYXN0UmVxdXN0ZWRVc2hlclVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGFzdFJlcXVzdGVkVXNoZXJVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgc3RvcmUgaXRcclxuICAgICAgICBjb25zdCB1c2hlclVybCA9IGJ1aWxkVXNoZXJVcmwobGFzdFJlcXVlc3RlZENoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgICAgIHJldHVybiB1c2hlclVybC5nZXRVcmwoKTsgIFxyXG4gICAgfSAgXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cnlGZXRjaGluZ1BsYXlsaXN0KGdyb3VwOiBVcmxHcm91cCkgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgaWYoIWdyb3VwKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiBcclxuICAgIC8vIHNlZSBpZiB0aGUgZXhpc3RpbmcgdXNoZXIgdXJsIGNhbiBiZSB1c2VkXHJcbiAgICBpZihncm91cC51c2hlclVybCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KGdyb3VwLnVzaGVyVXJsKTtcclxuICAgICAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCFncm91cC5hY2Nlc3NUb2tlblVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKGdyb3VwLmFjY2Vzc1Rva2VuVXJsKTtcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24/LnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uPy5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV3VXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGdyb3VwLmNoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQobmV3VXNoZXJVcmwuZ2V0VXJsKCkpO1xyXG4gICAgcmV0dXJuIHJlc3BUZXh0O1xyXG59IiwiXHJcbmltcG9ydCB7IHRyeUZldGNoaW5nUGxheWxpc3QgfSBmcm9tIFwiLi9mZXRjaFwiO1xyXG5pbXBvcnQgeyBnZXRDaGFubmVsRnJvbVdlYlVybCwgR2V0VXJsc1Jlc3BvbnNlLCBwYXJzZUF1ZGlvT25seVVybCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIFRPRE86IEFueSBiZXR0ZXIgd2F5IHRoYW4gSFRNTCBhcyBzdHJpbmc/XHJcbmNvbnN0IGluaXRpYWxCdXR0b25Eb20gPSBgXHJcbjxkaXYgY2xhc3M9XCJ0dy1pbmxpbmUtZmxleCB0dy1yZWxhdGl2ZSB0dy10b29sdGlwLXdyYXBwZXJcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJyYWRpby1tb2RlLWJ1dHRvbiB0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctYWxpZ24tbWlkZGxlIHR3LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYnV0dG9uLWljb24gdHctYnV0dG9uLWljb24tLW92ZXJsYXkgdHctY29yZS1idXR0b24gdHctY29yZS1idXR0b24tLW92ZXJsYXkgdHctaW5saW5lLWZsZXggdHctaW50ZXJhY3RpdmUgdHctanVzdGlmeS1jb250ZW50LWNlbnRlciB0dy1vdmVyZmxvdy1oaWRkZW4gdHctcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICBkYXRhLWEtdGFyZ2V0PVwicmFkaW8tbW9kZS1idXR0b25cIlxyXG4gICAgICAgICAgICBkYXRhLXJhZGlvLW1vZGUtc3RhdGU9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJSYWRpbyBNb2RlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1mbGV4IHR3LWZsZXgtZ3Jvdy0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHctYnV0dG9uLWljb25fX2ljb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taWNvbi1kaXZcIiBzdHlsZT1cIndpZHRoOiAycmVtOyBoZWlnaHQ6IDJyZW07XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBHb29nbGUgTWF0ZXJpYWwgRGVzaWduIFJhZGlvIEljb24uIEFwYWNoZSBMaWNlbnNlIHYyLjAgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3LWljb25fX3N2Z1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMuMjQgNi4xNUMyLjUxIDYuNDMgMiA3LjE3IDIgOHYxMmMwIDEuMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uOSAyLTJWOGMwLTEuMTEtLjg5LTItMi0ySDguM2w4LjI2LTMuMzRMMTUuODggMSAzLjI0IDYuMTV6TTcgMjBjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0xMy04aC0ydi0yaC0ydjJINFY4aDE2djR6XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGRpdiBjbGFzcz1cInR3LXRvb2x0aXAgdHctdG9vbHRpcC0tYWxpZ24tbGVmdCB0dy10b29sdGlwLS11cFwiIGRhdGEtYS10YXJnZXQ9XCJ0dy10b29sdGlwLWxhYmVsXCIgcm9sZT1cInRvb2x0aXBcIj5cclxuICAgICAgICBSYWRpbyBtb2RlXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5jb25zdCBwcm9jZXNzZWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHByb2Nlc3NlZEF0dHJWYWwgPSBcInByb2Nlc3NlZFwiXHJcblxyXG5jb25zdCB2aWRlb1BsYXllclN0YXRlQXR0ciA9IFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiO1xyXG5cclxuY29uc3QgcmFkaW9Nb2RlU3RhdGVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtc3RhdGVcIjtcclxuY29uc3QgcGxheWVySWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcGxheWVyLWlkXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklkUHJlZml4ID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCBhdHRyT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcbmNvbnN0IGRvbU9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBWaWRlb1BsYXllckNvbnRhaW5lciwgYWRkIE11dGF0aW9uT2JzZXJ2ZXIgdG8gXHJcbiAqIDEuIGRvY3VtZW50LmJvZHkgY2hlY2tzIGZvciBvbmUgc3VidHJlZSBjaGFuZ2VcclxuICogICAxLTIuIElmIGRpdiB3aXRoIGNsYXNzIFwidmlkZW8tcGxheWVyXCIsIHByb2Nlc3MgaXQuIENoZWNrICMyXHJcbiAqIFxyXG4gKiAyLiBDcmVhdGUgVmlkZW9QbGF5ZXIsIHZpZGVvLXBsYXllciBjbGFzcyBkaXYgY2hlY2tzIGZvciAxIGF0dHJpYnV0ZSBjaGFuZ2UsIDMgc3VidHJlZSBjaGFuZ2VzXHJcbiAqICAgMi0xLiBhdHRyaWJ1dGUgXCJkYXRhLWEtcGxheWVyLXR5cGVcIjogXCJzaXRlXCIsIFwic2l0ZV9taW5pXCIsIFwiY2xpcHMtd2F0Y2hcIiwgXCJjaGFubmVsX2hvbWVfY2Fyb3VzZWxcIlxyXG4gKiAgICAgMi0yLTIuIENoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciBpZiBuZWNlc3NhcnlcclxuICogICAgIDItMi0zLiBNb2RlOiBUdXBsZSBvZiAobGF5b3V0LCB2aWRlb190eXBlKS5cclxuICogICAgICAgMi0yLTMtMS4gbGF5b3V0OiBcInNpdGVcIiB8IFwic2l0ZV9taW5pXCJcclxuICogICAgICAgMi0yLTMtMi4gdmlkZW9fdHlwZTogXCJsaXZlXCIsIFwidm9kXCIsIFwiY2xpcFwiLi4gYW5kIG1vcmU/Pz8/P1xyXG4gKiAgIDItMi4gc3VidHJlZSBkaXYgd2l0aCBjbGFzcyBcInZvZC1zZWVrYmFyLXRpbWUtbGFiZWxzXCIgYW5kIFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCJcclxuICogICAgIDItMi0xLiBUaGlzIG9ubHkgYXBwZWFycyBpbiBWT0Qgd2F0Y2hcclxuICogICAgIDItMi0yLiBJZiBjcmVhdGVkLCBjaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgdG8gVk9EXHJcbiAqICAgICAyLTItMy4gSWYgcmVtb3ZlZCAoY2hhbmdlZCBmcm9tIFZPRCB0byBsaXZlL2NsaXApLCA/Pz8/XHJcbiAqICAgMi0zLiBjaGVjayBmb3IgY29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCJcclxuICogICAgIDItMy0xLiBJZiBjcmVhdGVkLCBjaGVjayAjMyBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi0zLTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqICAgMi00LiBjaGVjayBmb3IgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdGhlIHBsYXllclxyXG4gKiAgICAgMi00LTEuIElmIGNyZWF0ZWQsIGNoZWNrICM2IGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTQtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogXHJcbiAqIDMuIENvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiIGNoZWNrcyBmb3IgXHJcbiAqICAgMy0xLiBzdWJ0cmVlIGJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXSBmb3IgdmlkZW8gcGxheS9wYXVzZSBidXR0b25cclxuICogICAgIDMtMS0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNFxyXG4gKiAgICAgMy0xLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0yLiBzdWJ0cmVlIGlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ10gZm9yIHZvbHVtZSBzbGlkZXJcclxuICogICAgIDMtMi0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNVxyXG4gKiAgICAgMy0yLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0zLiBJZiBib3RoIGNvbXBvbmVudHMgaW4gMy0xIGFuZCAzLTIgYXJlIHJlYWR5OlxyXG4gKiAgICAgMy0zLTEuIENyZWF0ZSByYWRpbyBtb2RlIGJ1dHRvbiwgYW5kIHB1dCBNdXRhdGlvbk9ic2VydmVyIChzZWUgIzQgYW5kICM1KVxyXG4gKiAgICAgMy0zLTIuIElmIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgaXMgcmVtb3ZlZCAoc2l0ZS0+c2l0ZV9taW5pIGNoYW5nZSwgZXRjKVxyXG4gKiAgICAgICAzLTMtMi0xLiBhbHNvIHJlbW92ZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gZnJvbSBET01cclxuICogXHJcbiAqIDQuIFZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uIGNoZWNrcyBmb3JcclxuICogICA0LTEuIEF0dHJpYnV0ZSBjaGFuZ2UgdmlkZW9QbGF5ZXJTdGF0ZUF0dHI6IFwicGxheWluZ1wiIG9yIFwicGF1c2VkXCJcclxuICogICAgIDQtMS0xLiBJZiBhdHRyaWJ1dGUgdmFsdWUgY2hhbmdlZCB0byBcInBsYXlpbmdcIiwgc3RvcCBhbGwgYXVkaW8gaW4gdGhlIFZpZGVvUGxheWVyQ29udGFpbmVyXHJcbiAqIFxyXG4gKiA1LiBWb2x1bWUgc2xpZGVyIGNoZWNrcyBmb3JcclxuICogICA1LTEuIEF0dHJpYnV0ZSBcInZhbHVlXCIgY2hhbmdlOiBudW1iZXIgYmV0d2VlbiAwIDw9IG51bSA8PSAxXHJcbiAqICAgICA1LTEtMS4gSWYgY2hhbmdlIGlzIGRldGVjdGVkLCBhcHBseSB0aGUgbmV3IHZvbHVtZSB0byBhdWRpb0VsZW0uXHJcbiAqIFxyXG4gKiA2LiBvcmlnaW5hbCBcInZpZGVvXCIgZWxlbWVudCBpbiB2aWRlby1wbGF5ZXIgY2hlY2tzIGZvclxyXG4gKiAgIDYtMS4gQXR0cmlidXRlIFwic3JjXCIgY2hhbmdlOiBtZWFucyB0aGF0IHRoZSB2aWRlbyBzb3VyY2UgY2hhbmdlZCAobGlrZWx5IGhvc3RpbmcgYW5vdGhlciBzdHJlYW1lcilcclxuICogICAgIDYtMS0xLiBSYWRpbyBtb2RlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQ/IFJlLWNvbmZpZ3VyZWQgd2l0aCB0aGUgbmV3IHN0cmVhbWVyJ3MgVVJMP1xyXG4gKiAgICBcclxuICovXHJcblxyXG4vKipcclxuICogSG93IHRvIGRldGVjdCB0aGUgY2hhbm5lbCBvZiB0aGUgc3RyZWFtIGJlaW5nIHBsYXllZD9cclxuICogR2V0dGluZyBjaGFubmVsIG5hbWUgZnJvbSBVUkwgaGFzIHRoZSBmb2xsbG93aW5nIGlzc3Vlc1xyXG4gKiAoMSkgU3RyZWFtZXIgaG9zdGluZyBhbm90aGVyIGNoYW5uZWxcclxuICogKDIpIE1haW4gcGFnZS4gQ2hhbm5lbCBjYW4gY2hhbmdlIHF1aWNrbHkgaW4gdGhlIGNhcm91c2VsXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIEtlZXAgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBpbiB0aGUgdGFiLiBHdWVzcyB0aGUgY2hhbm5lbCBmcm9tIHRoZXJlXHJcbiAqICgyKSBGb3IgXCJzaXRlX21pbmlcIiBzdGF0ZSwgc3RvcmUgdGhlIGNoYW5uZWwgbmFtZSBpbiB2aWRlbyBwbGF5ZXIuXHJcbiAqICAgICBJbiB0aGF0IGNhc2UsIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gcmVzdW1lIHBsYXlpbmcgaW4gdGhlIHJpZ2h0IGNoYW5uZWwuXHJcbiAqICgzKSBEaXNhYmxlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBpbiB0aGUgbWFpbiBwYWdlXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgcmFkaW8gbW9kZSBidXR0b24gaW4gc2l0ZV9taW5pP1xyXG4gKiBEb24ndCBzdG9yZSB0aGUgcGxheXN0YXRlIGluIERPTTogb25seSBzdG9yZSBpdCBpbiBWaWRlb1BsYXllciBjbGFzcyBhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFU3BvcnRzIHBhZ2U6IHZpZGVvIG1pbmlwbGF5ZXIga2VlcHMgcGxheWluZyBldmVuIHdoZW4gdGhlIHNpdGUgcGxheWVyIGluIEVzcG9ydHMgcGFnZSBpcyBhbHNvIGJlaW5nIHBsYXllZC5cclxuICogU2hvdWxkIHRoZSByYWRpbyBtb2RlIGZvbGxvdyB0aGUgc2FtZSBiZWhhdmlvcj9cclxuICovXHJcblxyXG4vKipcclxuICogQWNjZXNzIHRva2VuIHVybCBoYXMgb2F1dGggY29kZSwgd2hpY2ggaXMgdW5kZWZpbmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqIE5vdCBzdXJlIGhvdyBUd2l0Y2ggcmV0dXJucyBjb3JyZWN0IHJlc3BvbnNlIGZvciBhbm9ueW1vdXMgdXNlciB5ZXQuXHJcbiAqIENhbGxpbmcgdGhlIHNhbWUgYWNjZXNzIHRva2VuIFVSTCBmcm9tIGNvbnRlbnRzY3JpcHQgcmV0dXJucyBlcnJvci5cclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKi9cclxuXHJcblxyXG5jb25zdCBlbnVtIFBsYXlpbmdTdGF0ZSB7XHJcbiAgICBESVNBQkxFRCA9IFwiZGlzYWJsZWRcIixcclxuICAgIFBBVVNFRCA9IFwicGF1c2VkXCIsXHJcbiAgICBQTEFZSU5HID0gXCJwbGF5aW5nXCIsXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1Byb2Nlc3NlZChlbGVtZW50OiBFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZWxlbWVudD8uZ2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIpID09PSBwcm9jZXNzZWRBdHRyVmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXJrUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQ/LnNldEF0dHJpYnV0ZShwcm9jZXNzZWRBdHRyLCBwcm9jZXNzZWRBdHRyVmFsKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRyb2xHcm91cCB7XHJcbiAgICBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXllcjogVmlkZW9QbGF5ZXI7XHJcbiAgICBwbGF5QnV0dG9uRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcmFkaW9CdXR0b246IEhUTUxFbGVtZW50O1xyXG4gICAgY29tcG9uZW50c09ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgcGxheUJ1dHRvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdm9sdW1lT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcjogVmlkZW9QbGF5ZXIsIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gY29udHJvbEdyb3VwRWxlbTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNvbnRyb2xHcm91cEVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBQbGF5L0F1ZGlvIGJ1dHRvbiBhbmQgdm9sdW1lIHNsaWRlciBcclxuICAgICAgICBjb25zdCBwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3RvcihwbGF5QnV0dG9uQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtKTtcclxuICAgICAgICBjb25zdCB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3Iodm9sdW1lU2xpZGVyQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbSk7XHJcbiAgICAgICAgLy8gQWRkIHRoZSByYWRpbyBidXR0b24gaWYgbm90IGV4aXN0c1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgLy8gcGxheSBidXR0b24gY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighcGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnBsYXlCdXR0b25FbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQocGxheUJ1dHRvbkVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSk7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzIGlmIGEgdmlkZW8gc3RhcnRzIHRvIHBsYXkuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBuZWNlc2FzcnkgZm9yIGEgY2FzZSB3aGVuIHVzZXIgYnJvd3NlcyB0byBhIG5vbi1jaGFubmVsIHBhZ2UgKGUuZy4gbWFpbiwgZXNwb3J0cylcclxuICAgICAgICAvLyB3aGljaCBhdXRvbWF0aWNhbGx5IHBsYXlzIGEgdmlkZW8uXHJcbiAgICAgICAgdGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8oKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5QnV0dG9uRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUF1ZGlvRm9yVmlkZW8oKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtLmdldEF0dHJpYnV0ZSh2aWRlb1BsYXllclN0YXRlQXR0cik7XHJcbiAgICAgICAgaWYoc3RhdGUgPT09IFwicGxheWluZ1wiKSB7ICAvLyBWaWRlbyBzdGF0ZSBmcm9tIHBhdXNlZCB0byBwbGF5aW5nXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnBhdXNlQWxsKCk7ICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyIGluc3RhbmNlc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGp1c3RWb2x1bWUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIuYXVkaW9FbGVtICYmIHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB2b2x1bWUgPSB0aGlzLnZvbHVtZVNsaWRlckVsZW0udmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmF1ZGlvRWxlbS52b2x1bWUgPSBwYXJzZUZsb2F0KHZvbHVtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gdm9sdW1lIHNsaWRlciBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCF2b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMudm9sdW1lU2xpZGVyRWxlbS4gSWdub3JlLlxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh2b2x1bWVTbGlkZXJFbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSB2b2x1bWVTbGlkZXJFbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gdm9sdW1lU2xpZGVyXHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuYWRqdXN0Vm9sdW1lLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZvbHVtZVNsaWRlckVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpIHtcclxuICAgICAgICAvLyBEb24ndCBwcm9jZWVkIHVubGVzcyBib3RoIHBsYXlCdXR0b25FbGVtIGFuZCB2b2x1bWVTbGlkZXJFbGVtIGFyZSBhdmFpbGFibGVcclxuICAgICAgICBpZighdGhpcy5wbGF5QnV0dG9uRWxlbSB8fCAhdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBidXR0b24gd2FzIGFscmVhZHkgY3JlYXRlZCwgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFVzZSB3ZWJwYWNrIGh0bWwgbG9hZGVyXHJcbiAgICAgICAgY29uc3QgYnV0dG9uV3JhcHBlckRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgICAgICBidXR0b25XcmFwcGVyRG9tLmlubmVySFRNTCA9IGluaXRpYWxCdXR0b25Eb207XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbiA9IGJ1dHRvbldyYXBwZXJEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh0aGlzLnJhZGlvQnV0dG9uKTtcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCB0aGlzLnBsYXllci5wbGF5aW5nU3RhdGUpO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24ub25jbGljayA9IHRoaXMucGxheWVyLm9uUmFkaW9CdXR0b25DbGlja2VkLmJpbmQodGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbS5hcHBlbmRDaGlsZChidXR0b25XcmFwcGVyRG9tKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQbGF5KCkge1xyXG4gICAgICAgIC8vIE5PVEU6IFRoZXJlIGlzIDF+MyBzZWNvbmRzIG9mIGRlbGF5IGJldHdlZW4gcmFkaW8tbW9kZSBidXR0b24gY2xpY2sgYW5kIHNvdW5kIGJlaW5nIHBsYXllZC5cclxuICAgICAgICAvLyBJdCdzIGJldHRlciB0byBzaG93IHNvbWUgaW50ZXJtZWRpYXRlIHN0YXRlIChpY29uIGNoYW5nZSwgbW91c2UgY3Vyc29yIGNoYW5nZSwgZXRjKSBpbiB0aGUgbWVhbndoaWxlXHJcblxyXG4gICAgICAgIC8vIFN0b3AgdGhlIHZpZGVvIGlmIHBsYXlpbmdcclxuICAgICAgICBjb25zdCB2aWRlb1N0YXRlID0gdGhpcy5wbGF5QnV0dG9uRWxlbT8uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZih2aWRlb1N0YXRlID09PSBcInBsYXlpbmdcIikge1xyXG4gICAgICAgICAgICAvLyBJcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gcGF1c2UgdmlkZW8gdGhhbiB0aGlzIFwiY2xpY2tcIiBoYWNrP1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QTEFZSU5HKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQYXVzZSgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuUEFVU0VEKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JEaXNhYmxlZCgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuRElTQUJMRUQpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAvLyBJcyB0aGlzIG5lY2Vzc2FyeT9cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY2xhc3MgVmlkZW9QbGF5ZXIge1xyXG4gICAgcGxheWVySWQ6IHN0cmluZztcclxuICAgIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXI7XHJcbiAgICBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXlpbmdTdGF0ZTogUGxheWluZ1N0YXRlO1xyXG4gICAgYXR0cmlidXRlT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBjb250cm9sR3JvdXA6IENvbnRyb2xHcm91cDtcclxuICAgIGNvbnRyb2xHcm91cE9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgaGxzOiBIbHM7XHJcbiAgICBhdWRpb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB2aWRlb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICBpbWFnZUVsZW06IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBvdmVybGF5QnV0dG9uOiBFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcklkOiBzdHJpbmcsIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXIsIHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbSA9IHBsYXllckVsZW07XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG5cclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IHBsYXllckVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2aWRlb1wiKVswXTtcclxuICAgICAgICAvL3RoaXMudmlkZW9FbGVtLnNldEF0dHJpYnV0ZShcInBvc3RlclwiLCBcImh0dHBzOi8vc3RhdGljLWNkbi5qdHZudy5uZXQvdHR2LWJveGFydC9TY2llbmNlJTIwJiUyMFRlY2hub2xvZ3ktMjg1eDM4MC5qcGdcIik7XHJcbiAgICAgICAgdGhpcy5pbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VFbGVtLnNyYyA9IFwiaHR0cHM6Ly9zdGF0aWMtY2RuLmp0dm53Lm5ldC90dHYtYm94YXJ0L1NjaWVuY2UlMjAmJTIwVGVjaG5vbG9neS0yODV4MzgwLmpwZ1wiO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLnZpZGVvRWxlbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmltYWdlRWxlbSwgdGhpcy52aWRlb0VsZW0ubmV4dFNpYmxpbmcpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250cm9sc1BlckxpdmVuZXNzKCk7XHJcbiAgICAgICAgLy9kYXRhLWEtdGFyZ2V0PVwicGxheWVyLW92ZXJsYXktcGxheS1idXR0b25cIlxyXG4gICAgICAgIHRoaXMub3ZlcmxheUJ1dHRvbiA9IHRoaXMucGxheWVyRWxlbS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1vdmVybGF5LXBsYXktYnV0dG9uJ11cIik/LlswXTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uICYmIHRoaXMucGxheWluZ1N0YXRlID09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgICh0aGlzLm92ZXJsYXlCdXR0b24gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBjb250cm9sIGdyb3VwIERPTSBpcyByZWFkeVxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xHcm91cEVsZW0gPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjb250cm9sR3JvdXBDbGFzcyk/LlswXTtcclxuICAgICAgICBpZighY29udHJvbEdyb3VwRWxlbSkgeyAgLy8gY29udHJvbCBncm91cCBjYW5ub3QgYmUgZm91bmQgaW4gRE9NXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7ICAvLyBkZXN0cm95IHJlZmVyZW5jZSB0byB0aGUgcmVtb3ZlZCBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgcHJvY2Vzc2VkIGNsYXNzIG5hbWUgdG8gcHJldmVudCBkdXBsaWNhdGUgcHJvY2Vzc2luZyBvZiB0aGlzIGVsZW1lbnRcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQoY29udHJvbEdyb3VwRWxlbSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXAgPSBuZXcgQ29udHJvbEdyb3VwKHRoaXMsIGNvbnRyb2xHcm91cEVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkobWVkaWFVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGlmKCFtZWRpYVVybCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTm8gbWVkaWFVcmwgaXMgZm91bmQgdG8gcGxheVwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmF1ZGlvRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiQXVkaW8gZWxlbWVudCBhbHJlYWR5IGV4aXN0c1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnZpZGVvRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtPy5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgICh0aGlzLm92ZXJsYXlCdXR0b24gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHNlcGFyYXRlIDx2aWRlbz4gZWxlbWVudCB0byBwbGF5IGF1ZGlvLlxyXG4gICAgICAgIC8vIDxhdWRpbz4gY2FuIGJlIGFsc28gdXNlZCBieSBobHMuanMsIGJ1dCBUeXBlc2NyaXB0IGZvcmNlcyB0aGlzIHRvIGJlIEhUTUxWaWRlb0VsZW1lbnQuXHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0gPSA8SFRNTFZpZGVvRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGxheSgpLnRoZW4oYXVkaW9QbGF5Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5obHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcIkRPTUV4Y2VwdGlvbjogVGhlIHBsYXkoKSByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBieSBhIGNhbGwgdG8gcGF1c2UoKVwiXHJcbiAgICAgICAgICAgICAgICAvLyBpcyB0aHJvd24gd2hlbiB1c2VyIHBhdXNlcyB0aGUgYXVkaW8gdG9vIHF1aWNrbHkgYWZ0ZXIgcGxheWluZy5cclxuICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBpcyBuZWVkZWQuIFRoZSBhdWRpbyB3aWxsIGJlIHBhdXNlZCBjb3JyZWN0bHkgYW55d2F5LlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLnN0b3BMb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRldGFjaE1lZGlhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgLy8gVGhlcmUgc2VlbXMgdG8gYmUgYSBidWcgdGhhdCB0aGUgSExTIG9iamVjdCBnZXRzIHN0dWNrIGFmdGVyIG11bHRpcGxlIHBsYXlzIGFuZCBwYXVzZXNcclxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgcmUtdXNlZCBmb3IgdGhlIG5leHQgcGxheS4gTmVlZCB0byBkZXN0cm95IHRoZSBvYmplY3QgYW5kIHJlLWNyZWF0ZSBpdC5cclxuICAgICAgICAgICAgdGhpcy5obHMgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckVsZW0ucmVtb3ZlQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy52aWRlb0VsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW0ucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheUJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnNcclxuICAgIHBhdXNlQWxsKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JEaXNhYmxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaGF0IGVsc2UgdG8gZG8gaGVyZT9cclxuICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RQbGF5KCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVdlYlVybCgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2FsbGJhY2sgPSBhc3luYyBmdW5jdGlvbihyZXNwb25zZTogR2V0VXJsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJyZXNwb25zZSBmb3IgZ2V0X2F1ZGlvX3VybCByZWNlaXZlZDogXCIgKyBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICBpZighcmVzcG9uc2U/LndlYlVybD8uY2hhbm5lbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5IGluIGEgbm9uLWNoYW5uZWwgcGFnZS4gRGlzYWJsZSBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWxpc3QgPSBhd2FpdCB0cnlGZXRjaGluZ1BsYXlsaXN0KHJlc3BvbnNlLndlYlVybCk7XHJcbiAgICAgICAgICAgIGlmKCFwbGF5bGlzdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gT2ZmbGluZSBvciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbC4gRGlzYWJsZSBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGF1ZGlvU3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwocGxheWxpc3QpO1xyXG4gICAgICAgICAgICBpZihhdWRpb1N0cmVhbVVybCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQodGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoYXVkaW9TdHJlYW1VcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxyXG4gICAgICAgICAgICB7bWVzc2FnZTogXCJnZXRfYXVkaW9fdXJsXCIsIGNoYW5uZWw6IGNoYW5uZWx9LCByZXNwb25zZUNhbGxiYWNrLmJpbmQodGhpcykpOyBcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDb250cm9sc1BlckxpdmVuZXNzKCkge1xyXG4gICAgICAgIC8vIElmIHdhdGNoaW5nIGEgbGl2ZSBzdHJlYW0sIGVuYWJsZSB0aGUgY29udHJvbCBncm91cC5cclxuICAgICAgICAvLyBJZiB3YXRjaGluZyBWT0Qgb2YgY2xpcCwgZGlzYWJsZSB0aGUgY29udHJvbCBncm91cC5cclxuICAgICAgICAvLyBGb3Igbm93LCB0aGUgbG9naWMgZm9yIGNoZWNraW5nIGxpdmUvcmVjb3JkZWQgdmlkZW8gaXMgZXhpc3RlbmNlIG9mIHRpbWUgc2Vla2Jhci5cclxuICAgICAgICBjb25zdCBzZWVrYmFyID0gdGhpcy5wbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzZWVrYmFyLWludGVyYWN0aW9uLWFyZWFcIik/LlswXTtcclxuXHJcbiAgICAgICAgLy8gV2hlbiBzZWVrYmFyIGFwcGVhcmVkIGFuZCB0aGUgcmFkaW8gYnV0dG9uIGlzIG5vdCBkaXNhYmxlZCB5ZXQuXHJcbiAgICAgICAgaWYoc2Vla2JhciAmJiB0aGlzLnBsYXlpbmdTdGF0ZSAhPT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJhZGlvQnV0dG9uQ2xpY2tlZCgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJDb250YWluZXIge1xyXG4gICAgcGxheWVyczogVmlkZW9QbGF5ZXJbXTtcclxuICAgIG5leHRJZDogbnVtYmVyO1xyXG4gICAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAxMDAwMTsgIC8vIFJhbmRvbSBzdGFydCBpbmRleCBmb3IgcGxheWVyLlxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvLyBGaW5kIGV4aXN0aW5nIHZpZGVvIHBsYXllciBlbGVtZW50cyB0byBjcmVhdGUgVmlkZW9QbGF5ZXIgb2JqZWN0c1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgLy8gRGV0ZWN0IGZ1dHVyZSB2aWRlbyBwbGF5ZXIgZWxlbWVudHNcclxuICAgICAgICBjb25zdCBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibWFpblwiKVswXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKG1haW5FbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIC8vIFRPRE86IElzIGl0IGJldHRlciB0byBpdGVyYXRlIG9ubHkgdGhlIG11dGF0ZWQgZGl2cz9cclxuICAgICAgICBjb25zdCBwbGF5ZXJFbGVtcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh2aWRlb1BsYXllckNsYXNzKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpdiBpcyBub3QgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgaWYoIWlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTmV3IHZpZGVvIHBsYXllciBkZXRlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBuZWVkIHRvIHByb2NlZWQgaWYgdGhlcmUgYXJlIHRoZSBzYW1lIG51bWJlciBvZiBwbGF5ZXJzIGluIHRoZSBsaXN0IGFuZCBpbiBET00uXHJcbiAgICAgICAgaWYocGxheWVyRWxlbXMubGVuZ3RoID09PSB0aGlzLnBsYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FyYmFnZUNvbGxlY3RQbGF5ZXJzKHBsYXllckVsZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdmlkZW8gcGxheWVycyBub3QgaW4gRE9NIGFueW1vcmUuXHJcbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiBhIHVzZXIgYnJvd3NlcyBmcm9tIGEgbm9uLWNoYW5uZWwgcGFnZSAobWFpbiwgZGlyZWN0b3J5LCBldGMuKSB0byBhIGNoYW5uZWwgcGFnZSxcclxuICAgIC8vIG9yIGJldHdlZW4gbm9uLWNoYW5uZWwgcGFnZXMuXHJcbiAgICBnYXJiYWdlQ29sbGVjdFBsYXllcnMocGxheWVyRWxlbXM6IEhUTUxDb2xsZWN0aW9uT2Y8RWxlbWVudD4pIHtcclxuICAgICAgICBjb25zdCBhbGxQbGF5ZXJJZHNJbkRvbTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgYWxsUGxheWVySWRzSW5Eb20ucHVzaChwbGF5ZXJFbGVtLmdldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkFsbCBwbGF5ZXJJZHMgaW4gRE9NOiBcIiArIGFsbFBsYXllcklkc0luRG9tKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3bGlzdCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHBsYXllci5wbGF5ZXJJZDtcclxuICAgICAgICAgICAgaWYoYWxsUGxheWVySWRzSW5Eb20uaW5kZXhPZihwbGF5ZXJJZCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld2xpc3QucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgUGxheWVyICR7cGxheWVySWR9IGlzIG5vdCBpbiBET00gYW55bW9yZS4gRGVsZXRpbmcuLmApO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXdsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHBsYXllckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5ZXJFbGVtKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGxheWVySWQgPSB2aWRlb1BsYXllcklkUHJlZml4ICsgdGhpcy5uZXh0SWQ7XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgKz0gMTtcclxuICAgICAgICBwbGF5ZXJFbGVtLnNldEF0dHJpYnV0ZShwbGF5ZXJJZEF0dHIsIG5ld1BsYXllcklkKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFZpZGVvUGxheWVyKG5ld1BsYXllcklkLCB0aGlzLCBwbGF5ZXJFbGVtKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlRXhjZXB0KHBsYXllcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgaWYocGxheWVyLnBsYXllcklkICE9PSBwbGF5ZXJJZCkgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaWxsIHRoaXMgZnVuY3Rpb24gZXZlciBiZSB1c2VkP1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIlxyXG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbnRhaW5lciB9IGZyb20gXCIuL3ZpZGVvX3BsYXllcl9jb250YWluZXJcIjtcclxuXHJcblxyXG52YXIgY29udGFpbmVyID0gbmV3IFZpZGVvUGxheWVyQ29udGFpbmVyKCk7XHJcbmNvbnRhaW5lci5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==