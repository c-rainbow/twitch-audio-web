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
        this.playingState = this.isPossiblyInChannelPage() ? "paused" /* PAUSED */ : "disabled" /* DISABLED */;
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
        const onPause = function (result) {
            console.log('Value currently is ' + JSON.stringify(result));
            if (result.autoplay) {
                this.controlGroup.playButtonElem.click();
            }
        };
        chrome.storage.local.get(['autoplay'], onPause.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjO0lBQzNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsUUFBUTtDQUFDLENBQUM7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R0FBRztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixLQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNKOzs7QUNsbkIrRDtBQUdoRSxJQUFJLFNBQVMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFDM0MsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6ImNvbnRlbnRzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG4iLCJcclxuY29uc3QgdHdpdGNoRG9tYWluIDogc3RyaW5nID0gXCJ0d2l0Y2gudHYvXCI7XHJcbi8vIE5vbi1leGh1YXN0aXZlIGxpc3Qgb2Ygbm9uLWNoYW5uZWwgcm91dGVzIGluIHR3aXRjaC50dlxyXG5jb25zdCBub25DaGFubmVscyA6IHN0cmluZ1tdID0gW1xyXG4gICAgXCJcIiwgXCJkaXJlY3RvcnlcIiwgXCJ2aWRlb3NcIiwgXCJ1XCIsIFwic2V0dGluZ3NcIiwgXCJmcmllbmRzXCIsIFwic3Vic2NyaXB0aW9uc1wiLCBcImludmVudG9yeVwiLCBcIndhbGxldFwiXTtcclxuXHJcbmNvbnN0IGFwaURvbWFpbiA6IHN0cmluZyA9IFwiYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvXCI7XHJcbmNvbnN0IGFjY2Vzc1Rva2VuIDogc3RyaW5nID0gXCIvYWNjZXNzX3Rva2VuXCI7XHJcblxyXG5jb25zdCB1c2hlckRvbWFpbiA6IHN0cmluZyA9IFwidXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy9cIjtcclxuY29uc3QgdXNoZXJFeHQgOiBzdHJpbmcgPSBcIi5tM3U4XCI7XHJcblxyXG5cclxuLy8gRXh0cmFjdCBhdWRpb19vbmx5IHN0cmVhbSAubTN1OCBmcm9tIHRoZSBtYXN0ZXIgcGxheWxpc3QgY29udGVudC5cclxuLy8gUmV0dXJucyB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIGEgVVJMIGFmdGVyIGF1ZGlvX29ubHkgbWV0YWRhdGEuXHJcbi8vIFRPRE86IFRoaXMgd29ya3MsIGJ1dCBldmVudHVhbGx5IHdlIHdpbGwgbmVlZCB0byBmdWxseSBwYXJzZSB0aGUgY29udGVudFxyXG4vLyBhbmQgZ2V0IGF1ZGlvX29ubHkgc3RyZWFtIHVybFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBpZighY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBhdWRpb09ubHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgZm9yKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgaWYgKGxpbmUuaW5jbHVkZXMoXCJhdWRpb19vbmx5XCIpKSBhdWRpb09ubHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGF1ZGlvT25seUZvdW5kICYmIGxpbmUuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tV2ViVXJsKHdlYnVybD86IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgLy8gQ2hhbm5lbCBuYW1lIG1heSBub3QgYmUgYXZhaWxhYmxlIGZyb20gdGhlIG1haW4gcGFnZSBVUkxcclxuICAgIGNvbnN0IHVybCA9IHdlYnVybCA/PyBsb2NhdGlvbi5ocmVmO1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1cmwsIHR3aXRjaERvbWFpbiwgXCIvXCIsIHRydWUpO1xyXG4gICAgY29uc29sZS5sb2coXCJDaGFubmVsIG5hbWUgXCIgKyBjaGFubmVsICsgXCIsIGZyb20gVVJMOiBcIiArIHVybClcclxuXHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChub25DaGFubmVscy5pbmRleE9mKGNoYW5uZWwpICE9IC0xKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVG9rZW5VcmwoYWNjZXNzVG9rZW5Vcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhhY2Nlc3NUb2tlblVybCwgYXBpRG9tYWluLCBhY2Nlc3NUb2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgYWNjZXNzIHRva2VuOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh1c2hlclVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVzaGVyVXJsLCB1c2hlckRvbWFpbiwgdXNoZXJFeHQpO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIHVzaGVyOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG4vLyBHZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2Ygc3RhcnRTdHIgYW5kIHRoZSBmaXJzdCBlbmRTdHIgYWZ0ZXIgc3RhcnRTdHIuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lQmV0d2VlblN0cmluZ3MoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsIHN0YXJ0U3RyOiBzdHJpbmcsIGVuZFN0cjogc3RyaW5nLCBlbmRPcHRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSA6IHN0cmluZyB7XHJcbiAgICBsZXQgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHN0YXJ0U3RyKTtcclxuICAgIGlmKHN0YXJ0SW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBzdGFydEluZGV4ICs9IHN0YXJ0U3RyLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihlbmRTdHIsIHN0YXJ0SW5kZXggKyAxKTtcclxuICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIGlmKGVuZE9wdGlvbmFsKSBlbmRJbmRleCA9IHVybC5sZW5ndGg7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxufVxyXG5cclxuXHJcbi8vIFRPRE86IEluc3RlYWQgb2YgcHJlLWRlZmluZWQgdXJsIGZvcm1hdCwgdXNlIHJlY2VudGx5IHVzZWQgb250IGluIFR3aXRjaCB3ZWJcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nLCBzaWc6IHN0cmluZykgOiBVc2hlclVybCB7XHJcbiAgICBjb25zdCB1c2hlclVybCA9IG5ldyBVc2hlclVybChgaHR0cHM6Ly91c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzLyR7Y2hhbm5lbH0ubTN1OGApO1xyXG4gICAgdXNoZXJVcmwudXBkYXRlKHRva2VuLCBzaWcpO1xyXG5cclxuICAgIC8vIEl0IGlzIG5vdCBjbGVhciBpZiBhbGwgb2YgdGhlc2UgcGFyYW1zIGFyZSByZXF1aXJlZCBvciBpZiB0aGVyZSBhcmUgYW55IG1pc3Npbmcgb25lcy5cclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwicGxheWVyXCIsIFwidHdpdGNod2ViXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19zb3VyY2VcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJ0eXBlXCIsIFwiYW55XCIpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdXNoZXJVcmw7XHJcbn1cclxuXHJcblxyXG4vLyBJbnRlcmZhY2UgdG8gY29tbXVuaWNhdGUgYmV0d2VlbiBiYWNrZ3JvdW5kIGFuZCBjb250ZW50c2NyaXB0XHJcbi8vIHRvIHJlcXVlc3QvcmVzcG9uZCBhY2Nlc3MgdG9rZW4gVVJMIGFuZCB1c2hlciBVUkwgZm9yIGEgY2hhbm5lbC5cclxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmxzUmVzcG9uc2Uge1xyXG4gICAgd2ViVXJsOiBVcmxHcm91cDtcclxuICAgIGxhc3RSZXF1ZXN0ZWQ6IFVybEdyb3VwO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVcmxHcm91cCB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBhY2Nlc3NUb2tlblVybDogc3RyaW5nO1xyXG4gICAgdXNoZXJVcmw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8vIENsYXNzIHRvIHN0b3JlIGFuZCBtYW5pcHVsYXRlIHVzaGVyIFVSTC5cclxuZXhwb3J0IGNsYXNzIFVzaGVyVXJsIHtcclxuICAgIG9yaWdpbmFsVXJsOiBzdHJpbmc7XHJcbiAgICB1cmxPYmplY3Q6IFVSTDtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGV4cGlyZXNBdDogbnVtYmVyOyAgLy8gVG9rZW4gZXhwaXJhdGlvbiBkYXRldGltZSBpbiBlcG9jaCBzZWNvbmRzXHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuZ2V0Q2hhbm5lbCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19hdWRpb19vbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVbmV4cGlyZWRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRzU2luY2VFcG9jaCA9IE1hdGgucm91bmQobm93LmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgICAgIC8vIDYwIHNlY29uZHMgYnVmZmVyIGJlZm9yZSB0b2tlbiBleHBpcmF0aW9uXHJcbiAgICAgICAgaWYoc2Vjb25kc1NpbmNlRXBvY2ggKyA2MCA8IHRoaXMuZXhwaXJlc0F0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVybCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBDYWNoZWQgVVJMIGZvciAke3RoaXMuY2hhbm5lbH0gaXMgZXhwaXJlZGApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cmxPYmplY3QudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRRdWVyeVN0cmluZyhrZXk6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldChrZXkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWVyeVN0cmluZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuc2V0KG5hbWUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeHBpcmVzQXQoKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5TdHJpbmcgPSB0aGlzLmdldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIik7XHJcbiAgICAgICAgaWYoIXRva2VuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW5Kc29uID0gSlNPTi5wYXJzZSh0b2tlblN0cmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2VuSnNvbi5leHBpcmVzIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXNBdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgcGFyc2UgdG9rZW4gaW4gdXNoZXIgVVJMLiBFcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYW5uZWwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwodGhpcy5vcmlnaW5hbFVybCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld1Rva2VuOiBzdHJpbmcsIG5ld1NpZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInRva2VuXCIsIG5ld1Rva2VuKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwic2lnXCIsIG5ld1NpZyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInBcIiwgdGhpcy5nZXRSYW5kb21OdW1iZXIoKS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tTnVtYmVyKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgeyBidWlsZFVzaGVyVXJsLCBwYXJzZUF1ZGlvT25seVVybCwgVXJsR3JvdXAgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb250ZW50KHVybDogc3RyaW5nKSB7XHJcbiAgICBpZighdXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgc3RhdHVzIGlmIG9rXHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgZmV0Y2hDb250ZW50IHRocmV3IGFuIGVycm9yOiAke2Vycn1gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hKc29uKHVybDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudCh1cmwpO1xyXG4gICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwSnNvbiA9IEpTT04ucGFyc2UocmVzcFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcEpzb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGNvdWxkIG5vdCBiZSBwYXJzZWQgdG8gSlNPTjogXCIgKyByZXNwVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdWRpb1N0cmVhbVVybCh1c2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVzaGVyVXJsKTtcclxuICAgIGNvbnN0IHN0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQpO1xyXG4gICAgcmV0dXJuIHN0cmVhbVVybDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW5Vcmw6IHN0cmluZywgbGFzdFJlcXVlc3RlZENoYW5uZWw6IHN0cmluZyxcclxuICAgICAgICBsYXN0UmVxdXN0ZWRVc2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbih0b2tlblVybCk7XHJcbiAgICBpZighcmVzcEpzb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbi50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbi5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYW5uZWwgaXMgZGlmZmVyZW50IGZyb20gdGhlIGNoYW5uZWwgb2YgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIHVybFxyXG4gICAgLy8gKFRoaXMgaXMgcG9zc2libGUgaWYgdGhlIGNoYW5uZWwncyBzdHJlYW1lciBpcyBob3N0aW5nIGFub3RoZXIgY2hhbm5lbClcclxuICAgIGlmKGxhc3RSZXF1ZXN0ZWRDaGFubmVsICYmIGNoYW5uZWwgIT09IGxhc3RSZXF1ZXN0ZWRDaGFubmVsKSB7XHJcbiAgICAgICAgaWYobGFzdFJlcXVzdGVkVXNoZXJVcmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXF1c3RlZFVzaGVyVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIHN0b3JlIGl0XHJcbiAgICAgICAgY29uc3QgdXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGxhc3RSZXF1ZXN0ZWRDaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgICAgICByZXR1cm4gdXNoZXJVcmwuZ2V0VXJsKCk7ICBcclxuICAgIH0gIFxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJ5RmV0Y2hpbmdQbGF5bGlzdChncm91cDogVXJsR3JvdXApIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmKCFncm91cCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gXHJcbiAgICAvLyBzZWUgaWYgdGhlIGV4aXN0aW5nIHVzaGVyIHVybCBjYW4gYmUgdXNlZFxyXG4gICAgaWYoZ3JvdXAudXNoZXJVcmwpIHtcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChncm91cC51c2hlclVybCk7XHJcbiAgICAgICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZighZ3JvdXAuYWNjZXNzVG9rZW5VcmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbihncm91cC5hY2Nlc3NUb2tlblVybCk7XHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uPy50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbj8uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ld1VzaGVyVXJsID0gYnVpbGRVc2hlclVybChncm91cC5jaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KG5ld1VzaGVyVXJsLmdldFVybCgpKTtcclxuICAgIHJldHVybiByZXNwVGV4dDtcclxufSIsIlxyXG5pbXBvcnQgeyB0cnlGZXRjaGluZ1BsYXlsaXN0IH0gZnJvbSBcIi4vZmV0Y2hcIjtcclxuaW1wb3J0IHsgZ2V0Q2hhbm5lbEZyb21XZWJVcmwsIEdldFVybHNSZXNwb25zZSwgcGFyc2VBdWRpb09ubHlVcmwgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBBbnkgYmV0dGVyIHdheSB0aGFuIEhUTUwgYXMgc3RyaW5nP1xyXG5jb25zdCBpbml0aWFsQnV0dG9uRG9tID0gYFxyXG48ZGl2IGNsYXNzPVwidHctaW5saW5lLWZsZXggdHctcmVsYXRpdmUgdHctdG9vbHRpcC13cmFwcGVyIHJhZGlvLW1vZGUtYnV0dG9uLXdyYXBwZXJcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJyYWRpby1tb2RlLWJ1dHRvbiB0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctYWxpZ24tbWlkZGxlIHR3LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYnV0dG9uLWljb24gdHctYnV0dG9uLWljb24tLW92ZXJsYXkgdHctY29yZS1idXR0b24gdHctY29yZS1idXR0b24tLW92ZXJsYXkgdHctaW5saW5lLWZsZXggdHctaW50ZXJhY3RpdmUgdHctanVzdGlmeS1jb250ZW50LWNlbnRlciB0dy1vdmVyZmxvdy1oaWRkZW4gdHctcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICBkYXRhLWEtdGFyZ2V0PVwicmFkaW8tbW9kZS1idXR0b25cIlxyXG4gICAgICAgICAgICBkYXRhLXJhZGlvLW1vZGUtc3RhdGU9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJSYWRpbyBNb2RlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1mbGV4IHR3LWZsZXgtZ3Jvdy0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHctYnV0dG9uLWljb25fX2ljb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taWNvbi1kaXZcIiBzdHlsZT1cIndpZHRoOiAycmVtOyBoZWlnaHQ6IDJyZW07XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBHb29nbGUgTWF0ZXJpYWwgRGVzaWduIFJhZGlvIEljb24uIEFwYWNoZSBMaWNlbnNlIHYyLjAgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3LWljb25fX3N2Z1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMuMjQgNi4xNUMyLjUxIDYuNDMgMiA3LjE3IDIgOHYxMmMwIDEuMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uOSAyLTJWOGMwLTEuMTEtLjg5LTItMi0ySDguM2w4LjI2LTMuMzRMMTUuODggMSAzLjI0IDYuMTV6TTcgMjBjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0xMy04aC0ydi0yaC0ydjJINFY4aDE2djR6XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGRpdiBjbGFzcz1cInR3LXRvb2x0aXAgdHctdG9vbHRpcC0tYWxpZ24tbGVmdCB0dy10b29sdGlwLS11cFwiIGRhdGEtYS10YXJnZXQ9XCJ0dy10b29sdGlwLWxhYmVsXCIgcm9sZT1cInRvb2x0aXBcIj5cclxuICAgICAgICBSYWRpbyBtb2RlXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5jb25zdCBwcm9jZXNzZWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHByb2Nlc3NlZEF0dHJWYWwgPSBcInByb2Nlc3NlZFwiXHJcblxyXG5jb25zdCB2aWRlb1BsYXllclN0YXRlQXR0ciA9IFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiO1xyXG5cclxuY29uc3QgcmFkaW9Nb2RlU3RhdGVBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtc3RhdGVcIjtcclxuY29uc3QgcGxheWVySWRBdHRyID0gXCJkYXRhLXJhZGlvLW1vZGUtcGxheWVyLWlkXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCB2aWRlb1BsYXllcklkUHJlZml4ID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCBhdHRyT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcbmNvbnN0IGRvbU9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBWaWRlb1BsYXllckNvbnRhaW5lciwgYWRkIE11dGF0aW9uT2JzZXJ2ZXIgdG8gXHJcbiAqIDEuIGRvY3VtZW50LmJvZHkgY2hlY2tzIGZvciBvbmUgc3VidHJlZSBjaGFuZ2VcclxuICogICAxLTIuIElmIGRpdiB3aXRoIGNsYXNzIFwidmlkZW8tcGxheWVyXCIsIHByb2Nlc3MgaXQuIENoZWNrICMyXHJcbiAqIFxyXG4gKiAyLiBDcmVhdGUgVmlkZW9QbGF5ZXIsIHZpZGVvLXBsYXllciBjbGFzcyBkaXYgY2hlY2tzIGZvciAxIGF0dHJpYnV0ZSBjaGFuZ2UsIDMgc3VidHJlZSBjaGFuZ2VzXHJcbiAqICAgMi0xLiBhdHRyaWJ1dGUgXCJkYXRhLWEtcGxheWVyLXR5cGVcIjogXCJzaXRlXCIsIFwic2l0ZV9taW5pXCIsIFwiY2xpcHMtd2F0Y2hcIiwgXCJjaGFubmVsX2hvbWVfY2Fyb3VzZWxcIlxyXG4gKiAgICAgMi0yLTIuIENoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciBpZiBuZWNlc3NhcnlcclxuICogICAgIDItMi0zLiBNb2RlOiBUdXBsZSBvZiAobGF5b3V0LCB2aWRlb190eXBlKS5cclxuICogICAgICAgMi0yLTMtMS4gbGF5b3V0OiBcInNpdGVcIiB8IFwic2l0ZV9taW5pXCJcclxuICogICAgICAgMi0yLTMtMi4gdmlkZW9fdHlwZTogXCJsaXZlXCIsIFwidm9kXCIsIFwiY2xpcFwiLi4gYW5kIG1vcmU/Pz8/P1xyXG4gKiAgIDItMi4gc3VidHJlZSBkaXYgd2l0aCBjbGFzcyBcInZvZC1zZWVrYmFyLXRpbWUtbGFiZWxzXCIgYW5kIFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCJcclxuICogICAgIDItMi0xLiBUaGlzIG9ubHkgYXBwZWFycyBpbiBWT0Qgd2F0Y2hcclxuICogICAgIDItMi0yLiBJZiBjcmVhdGVkLCBjaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgdG8gVk9EXHJcbiAqICAgICAyLTItMy4gSWYgcmVtb3ZlZCAoY2hhbmdlZCBmcm9tIFZPRCB0byBsaXZlL2NsaXApLCA/Pz8/XHJcbiAqICAgMi0zLiBjaGVjayBmb3IgY29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCJcclxuICogICAgIDItMy0xLiBJZiBjcmVhdGVkLCBjaGVjayAjMyBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi0zLTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqICAgMi00LiBjaGVjayBmb3IgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdGhlIHBsYXllclxyXG4gKiAgICAgMi00LTEuIElmIGNyZWF0ZWQsIGNoZWNrICM2IGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTQtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogXHJcbiAqIDMuIENvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiIGNoZWNrcyBmb3IgXHJcbiAqICAgMy0xLiBzdWJ0cmVlIGJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXSBmb3IgdmlkZW8gcGxheS9wYXVzZSBidXR0b25cclxuICogICAgIDMtMS0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNFxyXG4gKiAgICAgMy0xLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0yLiBzdWJ0cmVlIGlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ10gZm9yIHZvbHVtZSBzbGlkZXJcclxuICogICAgIDMtMi0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNVxyXG4gKiAgICAgMy0yLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0zLiBJZiBib3RoIGNvbXBvbmVudHMgaW4gMy0xIGFuZCAzLTIgYXJlIHJlYWR5OlxyXG4gKiAgICAgMy0zLTEuIENyZWF0ZSByYWRpbyBtb2RlIGJ1dHRvbiwgYW5kIHB1dCBNdXRhdGlvbk9ic2VydmVyIChzZWUgIzQgYW5kICM1KVxyXG4gKiAgICAgMy0zLTIuIElmIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgaXMgcmVtb3ZlZCAoc2l0ZS0+c2l0ZV9taW5pIGNoYW5nZSwgZXRjKVxyXG4gKiAgICAgICAzLTMtMi0xLiBhbHNvIHJlbW92ZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gZnJvbSBET01cclxuICogXHJcbiAqIDQuIFZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uIGNoZWNrcyBmb3JcclxuICogICA0LTEuIEF0dHJpYnV0ZSBjaGFuZ2UgdmlkZW9QbGF5ZXJTdGF0ZUF0dHI6IFwicGxheWluZ1wiIG9yIFwicGF1c2VkXCJcclxuICogICAgIDQtMS0xLiBJZiBhdHRyaWJ1dGUgdmFsdWUgY2hhbmdlZCB0byBcInBsYXlpbmdcIiwgc3RvcCBhbGwgYXVkaW8gaW4gdGhlIFZpZGVvUGxheWVyQ29udGFpbmVyXHJcbiAqIFxyXG4gKiA1LiBWb2x1bWUgc2xpZGVyIGNoZWNrcyBmb3JcclxuICogICA1LTEuIEF0dHJpYnV0ZSBcInZhbHVlXCIgY2hhbmdlOiBudW1iZXIgYmV0d2VlbiAwIDw9IG51bSA8PSAxXHJcbiAqICAgICA1LTEtMS4gSWYgY2hhbmdlIGlzIGRldGVjdGVkLCBhcHBseSB0aGUgbmV3IHZvbHVtZSB0byBhdWRpb0VsZW0uXHJcbiAqIFxyXG4gKiA2LiBvcmlnaW5hbCBcInZpZGVvXCIgZWxlbWVudCBpbiB2aWRlby1wbGF5ZXIgY2hlY2tzIGZvclxyXG4gKiAgIDYtMS4gQXR0cmlidXRlIFwic3JjXCIgY2hhbmdlOiBtZWFucyB0aGF0IHRoZSB2aWRlbyBzb3VyY2UgY2hhbmdlZCAobGlrZWx5IGhvc3RpbmcgYW5vdGhlciBzdHJlYW1lcilcclxuICogICAgIDYtMS0xLiBSYWRpbyBtb2RlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQ/IFJlLWNvbmZpZ3VyZWQgd2l0aCB0aGUgbmV3IHN0cmVhbWVyJ3MgVVJMP1xyXG4gKiAgICBcclxuICovXHJcblxyXG4vKipcclxuICogSG93IHRvIGRldGVjdCB0aGUgY2hhbm5lbCBvZiB0aGUgc3RyZWFtIGJlaW5nIHBsYXllZD9cclxuICogR2V0dGluZyBjaGFubmVsIG5hbWUgZnJvbSBVUkwgaGFzIHRoZSBmb2xsbG93aW5nIGlzc3Vlc1xyXG4gKiAoMSkgU3RyZWFtZXIgaG9zdGluZyBhbm90aGVyIGNoYW5uZWxcclxuICogKDIpIE1haW4gcGFnZS4gQ2hhbm5lbCBjYW4gY2hhbmdlIHF1aWNrbHkgaW4gdGhlIGNhcm91c2VsXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIEtlZXAgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBpbiB0aGUgdGFiLiBHdWVzcyB0aGUgY2hhbm5lbCBmcm9tIHRoZXJlXHJcbiAqICgyKSBGb3IgXCJzaXRlX21pbmlcIiBzdGF0ZSwgc3RvcmUgdGhlIGNoYW5uZWwgbmFtZSBpbiB2aWRlbyBwbGF5ZXIuXHJcbiAqICAgICBJbiB0aGF0IGNhc2UsIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gcmVzdW1lIHBsYXlpbmcgaW4gdGhlIHJpZ2h0IGNoYW5uZWwuXHJcbiAqICgzKSBEaXNhYmxlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBpbiB0aGUgbWFpbiBwYWdlXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgcmFkaW8gbW9kZSBidXR0b24gaW4gc2l0ZV9taW5pP1xyXG4gKiBEb24ndCBzdG9yZSB0aGUgcGxheXN0YXRlIGluIERPTTogb25seSBzdG9yZSBpdCBpbiBWaWRlb1BsYXllciBjbGFzcyBhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFU3BvcnRzIHBhZ2U6IHZpZGVvIG1pbmlwbGF5ZXIga2VlcHMgcGxheWluZyBldmVuIHdoZW4gdGhlIHNpdGUgcGxheWVyIGluIEVzcG9ydHMgcGFnZSBpcyBhbHNvIGJlaW5nIHBsYXllZC5cclxuICogU2hvdWxkIHRoZSByYWRpbyBtb2RlIGZvbGxvdyB0aGUgc2FtZSBiZWhhdmlvcj9cclxuICovXHJcblxyXG4vKipcclxuICogQWNjZXNzIHRva2VuIHVybCBoYXMgb2F1dGggY29kZSwgd2hpY2ggaXMgdW5kZWZpbmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqIE5vdCBzdXJlIGhvdyBUd2l0Y2ggcmV0dXJucyBjb3JyZWN0IHJlc3BvbnNlIGZvciBhbm9ueW1vdXMgdXNlciB5ZXQuXHJcbiAqIENhbGxpbmcgdGhlIHNhbWUgYWNjZXNzIHRva2VuIFVSTCBmcm9tIGNvbnRlbnRzY3JpcHQgcmV0dXJucyBlcnJvci5cclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKi9cclxuXHJcblxyXG5jb25zdCBlbnVtIFBsYXlpbmdTdGF0ZSB7XHJcbiAgICBESVNBQkxFRCA9IFwiZGlzYWJsZWRcIixcclxuICAgIFBBVVNFRCA9IFwicGF1c2VkXCIsXHJcbiAgICBQTEFZSU5HID0gXCJwbGF5aW5nXCIsXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1Byb2Nlc3NlZChlbGVtZW50OiBFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZWxlbWVudD8uZ2V0QXR0cmlidXRlKHByb2Nlc3NlZEF0dHIpID09PSBwcm9jZXNzZWRBdHRyVmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXJrUHJvY2Vzc2VkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQ/LnNldEF0dHJpYnV0ZShwcm9jZXNzZWRBdHRyLCBwcm9jZXNzZWRBdHRyVmFsKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRyb2xHcm91cCB7XHJcbiAgICBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXllcjogVmlkZW9QbGF5ZXI7XHJcbiAgICBwbGF5QnV0dG9uRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcmFkaW9CdXR0b246IEhUTUxFbGVtZW50O1xyXG4gICAgY29tcG9uZW50c09ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgcGxheUJ1dHRvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdm9sdW1lT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcjogVmlkZW9QbGF5ZXIsIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gY29udHJvbEdyb3VwRWxlbTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNvbnRyb2xHcm91cEVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBQbGF5L0F1ZGlvIGJ1dHRvbiBhbmQgdm9sdW1lIHNsaWRlciBcclxuICAgICAgICBjb25zdCBwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3RvcihwbGF5QnV0dG9uQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtKTtcclxuICAgICAgICBjb25zdCB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3Iodm9sdW1lU2xpZGVyQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbSk7XHJcbiAgICAgICAgLy8gQWRkIHRoZSByYWRpbyBidXR0b24gaWYgbm90IGV4aXN0c1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgLy8gcGxheSBidXR0b24gY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighcGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnBsYXlCdXR0b25FbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoaXNQcm9jZXNzZWQocGxheUJ1dHRvbkVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZChwbGF5QnV0dG9uRWxlbSk7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzIGlmIGEgdmlkZW8gc3RhcnRzIHRvIHBsYXkuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBuZWNlc2FzcnkgZm9yIGEgY2FzZSB3aGVuIHVzZXIgYnJvd3NlcyB0byBhIG5vbi1jaGFubmVsIHBhZ2UgKGUuZy4gbWFpbiwgZXNwb3J0cylcclxuICAgICAgICAvLyB3aGljaCBhdXRvbWF0aWNhbGx5IHBsYXlzIGEgdmlkZW8uXHJcbiAgICAgICAgdGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8oKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5QnV0dG9uRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUF1ZGlvRm9yVmlkZW8oKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtLmdldEF0dHJpYnV0ZSh2aWRlb1BsYXllclN0YXRlQXR0cik7XHJcbiAgICAgICAgaWYoc3RhdGUgPT09IFwicGxheWluZ1wiKSB7ICAvLyBWaWRlbyBzdGF0ZSBmcm9tIHBhdXNlZCB0byBwbGF5aW5nXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnBhdXNlQWxsKCk7ICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyIGluc3RhbmNlc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGp1c3RWb2x1bWUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIuYXVkaW9FbGVtICYmIHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB2b2x1bWUgPSB0aGlzLnZvbHVtZVNsaWRlckVsZW0udmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmF1ZGlvRWxlbS52b2x1bWUgPSBwYXJzZUZsb2F0KHZvbHVtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gdm9sdW1lIHNsaWRlciBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCF2b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMudm9sdW1lU2xpZGVyRWxlbS4gSWdub3JlLlxyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHZvbHVtZVNsaWRlckVsZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh2b2x1bWVTbGlkZXJFbGVtKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSB2b2x1bWVTbGlkZXJFbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gdm9sdW1lU2xpZGVyXHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuYWRqdXN0Vm9sdW1lLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZvbHVtZVNsaWRlckVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpIHtcclxuICAgICAgICAvLyBEb24ndCBwcm9jZWVkIHVubGVzcyBib3RoIHBsYXlCdXR0b25FbGVtIGFuZCB2b2x1bWVTbGlkZXJFbGVtIGFyZSBhdmFpbGFibGVcclxuICAgICAgICBpZighdGhpcy5wbGF5QnV0dG9uRWxlbSB8fCAhdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBidXR0b24gd2FzIGFscmVhZHkgY3JlYXRlZCwgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmKGlzUHJvY2Vzc2VkKHRoaXMucmFkaW9CdXR0b24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFVzZSB3ZWJwYWNrIGh0bWwgbG9hZGVyXHJcbiAgICAgICAgY29uc3QgYnV0dG9uV3JhcHBlckRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgICAgICBidXR0b25XcmFwcGVyRG9tLmlubmVySFRNTCA9IGluaXRpYWxCdXR0b25Eb207XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbiA9IGJ1dHRvbldyYXBwZXJEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XHJcbiAgICAgICAgbWFya1Byb2Nlc3NlZCh0aGlzLnJhZGlvQnV0dG9uKTtcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCB0aGlzLnBsYXllci5wbGF5aW5nU3RhdGUpO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24ub25jbGljayA9IHRoaXMucGxheWVyLm9uUmFkaW9CdXR0b25DbGlja2VkLmJpbmQodGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbS5hcHBlbmRDaGlsZChidXR0b25XcmFwcGVyRG9tKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQbGF5KCkge1xyXG4gICAgICAgIC8vIE5PVEU6IFRoZXJlIGlzIDF+MyBzZWNvbmRzIG9mIGRlbGF5IGJldHdlZW4gcmFkaW8tbW9kZSBidXR0b24gY2xpY2sgYW5kIHNvdW5kIGJlaW5nIHBsYXllZC5cclxuICAgICAgICAvLyBJdCdzIGJldHRlciB0byBzaG93IHNvbWUgaW50ZXJtZWRpYXRlIHN0YXRlIChpY29uIGNoYW5nZSwgbW91c2UgY3Vyc29yIGNoYW5nZSwgZXRjKSBpbiB0aGUgbWVhbndoaWxlXHJcblxyXG4gICAgICAgIC8vIFN0b3AgdGhlIHZpZGVvIGlmIHBsYXlpbmdcclxuICAgICAgICBjb25zdCB2aWRlb1N0YXRlID0gdGhpcy5wbGF5QnV0dG9uRWxlbT8uZ2V0QXR0cmlidXRlKHZpZGVvUGxheWVyU3RhdGVBdHRyKTtcclxuICAgICAgICBpZih2aWRlb1N0YXRlID09PSBcInBsYXlpbmdcIikge1xyXG4gICAgICAgICAgICAvLyBJcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gcGF1c2UgdmlkZW8gdGhhbiB0aGlzIFwiY2xpY2tcIiBoYWNrP1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLnNldEF0dHJpYnV0ZShyYWRpb01vZGVTdGF0ZUF0dHIsIFBsYXlpbmdTdGF0ZS5QTEFZSU5HKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQYXVzZSgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuUEFVU0VEKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JEaXNhYmxlZCgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5zZXRBdHRyaWJ1dGUocmFkaW9Nb2RlU3RhdGVBdHRyLCBQbGF5aW5nU3RhdGUuRElTQUJMRUQpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAvLyBJcyB0aGlzIG5lY2Vzc2FyeT9cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY2xhc3MgVmlkZW9QbGF5ZXIge1xyXG4gICAgcGxheWVySWQ6IHN0cmluZztcclxuICAgIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXI7XHJcbiAgICBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXlpbmdTdGF0ZTogUGxheWluZ1N0YXRlO1xyXG4gICAgYXR0cmlidXRlT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBjb250cm9sR3JvdXA6IENvbnRyb2xHcm91cDtcclxuICAgIGNvbnRyb2xHcm91cE9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgaGxzOiBIbHM7XHJcbiAgICBhdWRpb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB2aWRlb0VsZW06IEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICBpbWFnZUVsZW06IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBvdmVybGF5QnV0dG9uOiBFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcklkOiBzdHJpbmcsIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXIsIHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbSA9IHBsYXllckVsZW07XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSB0aGlzLmlzUG9zc2libHlJbkNoYW5uZWxQYWdlKCkgPyBQbGF5aW5nU3RhdGUuUEFVU0VEIDogUGxheWluZ1N0YXRlLkRJU0FCTEVEO1xyXG5cclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvRWxlbSA9IHBsYXllckVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2aWRlb1wiKVswXTtcclxuICAgICAgICAvL3RoaXMudmlkZW9FbGVtLnNldEF0dHJpYnV0ZShcInBvc3RlclwiLCBcImh0dHBzOi8vc3RhdGljLWNkbi5qdHZudy5uZXQvdHR2LWJveGFydC9TY2llbmNlJTIwJiUyMFRlY2hub2xvZ3ktMjg1eDM4MC5qcGdcIik7XHJcbiAgICAgICAgdGhpcy5pbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VFbGVtLnNyYyA9IFwiaHR0cHM6Ly9zdGF0aWMtY2RuLmp0dm53Lm5ldC90dHYtYm94YXJ0L1NjaWVuY2UlMjAmJTIwVGVjaG5vbG9neS0yODV4MzgwLmpwZ1wiO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLnZpZGVvRWxlbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmltYWdlRWxlbSwgdGhpcy52aWRlb0VsZW0ubmV4dFNpYmxpbmcpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250cm9sc1BlckxpdmVuZXNzKCk7XHJcbiAgICAgICAgLy9kYXRhLWEtdGFyZ2V0PVwicGxheWVyLW92ZXJsYXktcGxheS1idXR0b25cIlxyXG4gICAgICAgIHRoaXMub3ZlcmxheUJ1dHRvbiA9IHRoaXMucGxheWVyRWxlbS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1vdmVybGF5LXBsYXktYnV0dG9uJ11cIik/LlswXTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uICYmIHRoaXMucGxheWluZ1N0YXRlID09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgICh0aGlzLm92ZXJsYXlCdXR0b24gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBjb250cm9sIGdyb3VwIERPTSBpcyByZWFkeVxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xHcm91cEVsZW0gPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjb250cm9sR3JvdXBDbGFzcyk/LlswXTtcclxuICAgICAgICBpZighY29udHJvbEdyb3VwRWxlbSkgeyAgLy8gY29udHJvbCBncm91cCBjYW5ub3QgYmUgZm91bmQgaW4gRE9NXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7ICAvLyBkZXN0cm95IHJlZmVyZW5jZSB0byB0aGUgcmVtb3ZlZCBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgcHJvY2Vzc2VkIGNsYXNzIG5hbWUgdG8gcHJldmVudCBkdXBsaWNhdGUgcHJvY2Vzc2luZyBvZiB0aGlzIGVsZW1lbnRcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChjb250cm9sR3JvdXBFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQoY29udHJvbEdyb3VwRWxlbSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXAgPSBuZXcgQ29udHJvbEdyb3VwKHRoaXMsIGNvbnRyb2xHcm91cEVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkobWVkaWFVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGlmKCFtZWRpYVVybCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTm8gbWVkaWFVcmwgaXMgZm91bmQgdG8gcGxheVwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmF1ZGlvRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiQXVkaW8gZWxlbWVudCBhbHJlYWR5IGV4aXN0c1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnZpZGVvRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtPy5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgICh0aGlzLm92ZXJsYXlCdXR0b24gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHNlcGFyYXRlIDx2aWRlbz4gZWxlbWVudCB0byBwbGF5IGF1ZGlvLlxyXG4gICAgICAgIC8vIDxhdWRpbz4gY2FuIGJlIGFsc28gdXNlZCBieSBobHMuanMsIGJ1dCBUeXBlc2NyaXB0IGZvcmNlcyB0aGlzIHRvIGJlIEhUTUxWaWRlb0VsZW1lbnQuXHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0gPSA8SFRNTFZpZGVvRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGxheSgpLnRoZW4oYXVkaW9QbGF5Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5obHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcIkRPTUV4Y2VwdGlvbjogVGhlIHBsYXkoKSByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBieSBhIGNhbGwgdG8gcGF1c2UoKVwiXHJcbiAgICAgICAgICAgICAgICAvLyBpcyB0aHJvd24gd2hlbiB1c2VyIHBhdXNlcyB0aGUgYXVkaW8gdG9vIHF1aWNrbHkgYWZ0ZXIgcGxheWluZy5cclxuICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBpcyBuZWVkZWQuIFRoZSBhdWRpbyB3aWxsIGJlIHBhdXNlZCBjb3JyZWN0bHkgYW55d2F5LlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLnN0b3BMb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRldGFjaE1lZGlhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgLy8gVGhlcmUgc2VlbXMgdG8gYmUgYSBidWcgdGhhdCB0aGUgSExTIG9iamVjdCBnZXRzIHN0dWNrIGFmdGVyIG11bHRpcGxlIHBsYXlzIGFuZCBwYXVzZXNcclxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgcmUtdXNlZCBmb3IgdGhlIG5leHQgcGxheS4gTmVlZCB0byBkZXN0cm95IHRoZSBvYmplY3QgYW5kIHJlLWNyZWF0ZSBpdC5cclxuICAgICAgICAgICAgdGhpcy5obHMgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckVsZW0ucmVtb3ZlQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy52aWRlb0VsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0VsZW0ucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5vdmVybGF5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheUJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJ0dy1ibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9uUGF1c2UgPSBmdW5jdGlvbihyZXN1bHQ6IGFueSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVmFsdWUgY3VycmVudGx5IGlzICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgICAgICAgICAgaWYocmVzdWx0LmF1dG9wbGF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cC5wbGF5QnV0dG9uRWxlbS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhdXRvcGxheSddLCBvblBhdXNlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzXHJcbiAgICBwYXVzZUFsbCgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNhYmxlKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yRGlzYWJsZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyAgLy8gV2hhdCBlbHNlIHRvIGRvIGhlcmU/XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0UGxheSgpIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZUNhbGxiYWNrID0gYXN5bmMgZnVuY3Rpb24ocmVzcG9uc2U6IEdldFVybHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwicmVzcG9uc2UgZm9yIGdldF9hdWRpb191cmwgcmVjZWl2ZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgaWYoIXJlc3BvbnNlPy53ZWJVcmw/LmNoYW5uZWwpIHtcclxuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnRseSBpbiBhIG5vbi1jaGFubmVsIHBhZ2UuIERpc2FibGUgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlsaXN0ID0gYXdhaXQgdHJ5RmV0Y2hpbmdQbGF5bGlzdChyZXNwb25zZS53ZWJVcmwpO1xyXG4gICAgICAgICAgICBpZighcGxheWxpc3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9mZmxpbmUgb3IgaG9zdGluZyBhbm90aGVyIGNoYW5uZWwuIERpc2FibGUgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBhdWRpb1N0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKHBsYXlsaXN0KTtcclxuICAgICAgICAgICAgaWYoYXVkaW9TdHJlYW1VcmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KGF1ZGlvU3RyZWFtVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiZ2V0X2F1ZGlvX3VybFwiLCBjaGFubmVsOiBjaGFubmVsfSwgcmVzcG9uc2VDYWxsYmFjay5iaW5kKHRoaXMpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgaXNQb3NzaWJseUluQ2hhbm5lbFBhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWwgIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ29udHJvbHNQZXJMaXZlbmVzcygpIHtcclxuICAgICAgICAvLyBJZiB3YXRjaGluZyBhIGxpdmUgc3RyZWFtLCBlbmFibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gSWYgd2F0Y2hpbmcgVk9EIG9mIGNsaXAsIGRpc2FibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gRm9yIG5vdywgdGhlIGxvZ2ljIGZvciBjaGVja2luZyBsaXZlL3JlY29yZGVkIHZpZGVvIGlzIGV4aXN0ZW5jZSBvZiB0aW1lIHNlZWtiYXIuXHJcbiAgICAgICAgY29uc3Qgc2Vla2JhciA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCIpPy5bMF07XHJcblxyXG4gICAgICAgIC8vIFdoZW4gc2Vla2JhciBhcHBlYXJlZCBhbmQgdGhlIHJhZGlvIGJ1dHRvbiBpcyBub3QgZGlzYWJsZWQgeWV0LlxyXG4gICAgICAgIGlmKHNlZWtiYXIgJiYgdGhpcy5wbGF5aW5nU3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25SYWRpb0J1dHRvbkNsaWNrZWQoKSB7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGxheWluZ1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBBVVNFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXkoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QTEFZSU5HOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyQ29udGFpbmVyIHtcclxuICAgIHBsYXllcnM6IFZpZGVvUGxheWVyW107XHJcbiAgICBuZXh0SWQ6IG51bWJlcjtcclxuICAgIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMubmV4dElkID0gMTAwMDE7ICAvLyBSYW5kb20gc3RhcnQgaW5kZXggZm9yIHBsYXllci5cclxuICAgIH1cclxuXHJcbiAgICBydW4oKSB7XHJcbiAgICAgICAgLy8gRmluZCBleGlzdGluZyB2aWRlbyBwbGF5ZXIgZWxlbWVudHMgdG8gY3JlYXRlIFZpZGVvUGxheWVyIG9iamVjdHNcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZGVvUGxheWVyTGlzdCgpO1xyXG4gICAgICAgIC8vIERldGVjdCBmdXR1cmUgdmlkZW8gcGxheWVyIGVsZW1lbnRzXHJcbiAgICAgICAgY29uc3QgbWFpbkVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1haW5cIilbMF07XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShtYWluRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZpZGVvUGxheWVyTGlzdCgpIHtcclxuICAgICAgICAvLyBUT0RPOiBJcyBpdCBiZXR0ZXIgdG8gaXRlcmF0ZSBvbmx5IHRoZSBtdXRhdGVkIGRpdnM/XHJcbiAgICAgICAgY29uc3QgcGxheWVyRWxlbXMgPSBkb2N1bWVudC5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodmlkZW9QbGF5ZXJDbGFzcyk7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXJFbGVtIG9mIHBsYXllckVsZW1zKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXYgaXMgbm90IGFscmVhZHkgcHJvY2Vzc2VkXHJcbiAgICAgICAgICAgIGlmKCFpc1Byb2Nlc3NlZChwbGF5ZXJFbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIk5ldyB2aWRlbyBwbGF5ZXIgZGV0ZWN0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtIGFzIEhUTUxFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm8gbmVlZCB0byBwcm9jZWVkIGlmIHRoZXJlIGFyZSB0aGUgc2FtZSBudW1iZXIgb2YgcGxheWVycyBpbiB0aGUgbGlzdCBhbmQgaW4gRE9NLlxyXG4gICAgICAgIGlmKHBsYXllckVsZW1zLmxlbmd0aCA9PT0gdGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhcmJhZ2VDb2xsZWN0UGxheWVycyhwbGF5ZXJFbGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHZpZGVvIHBsYXllcnMgbm90IGluIERPTSBhbnltb3JlLlxyXG4gICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gYSB1c2VyIGJyb3dzZXMgZnJvbSBhIG5vbi1jaGFubmVsIHBhZ2UgKG1haW4sIGRpcmVjdG9yeSwgZXRjLikgdG8gYSBjaGFubmVsIHBhZ2UsXHJcbiAgICAvLyBvciBiZXR3ZWVuIG5vbi1jaGFubmVsIHBhZ2VzLlxyXG4gICAgZ2FyYmFnZUNvbGxlY3RQbGF5ZXJzKHBsYXllckVsZW1zOiBIVE1MQ29sbGVjdGlvbk9mPEVsZW1lbnQ+KSB7XHJcbiAgICAgICAgY29uc3QgYWxsUGxheWVySWRzSW5Eb206IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXJFbGVtIG9mIHBsYXllckVsZW1zKSB7XHJcbiAgICAgICAgICAgIGFsbFBsYXllcklkc0luRG9tLnB1c2gocGxheWVyRWxlbS5nZXRBdHRyaWJ1dGUocGxheWVySWRBdHRyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJBbGwgcGxheWVySWRzIGluIERPTTogXCIgKyBhbGxQbGF5ZXJJZHNJbkRvbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld2xpc3QgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBwbGF5ZXIucGxheWVySWQ7XHJcbiAgICAgICAgICAgIGlmKGFsbFBsYXllcklkc0luRG9tLmluZGV4T2YocGxheWVySWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdsaXN0LnB1c2gocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYFBsYXllciAke3BsYXllcklkfSBpcyBub3QgaW4gRE9NIGFueW1vcmUuIERlbGV0aW5nLi5gKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gbmV3bGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBpZihpc1Byb2Nlc3NlZChwbGF5ZXJFbGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtQcm9jZXNzZWQocGxheWVyRWxlbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1BsYXllcklkID0gdmlkZW9QbGF5ZXJJZFByZWZpeCArIHRoaXMubmV4dElkO1xyXG4gICAgICAgIHRoaXMubmV4dElkICs9IDE7XHJcbiAgICAgICAgcGxheWVyRWxlbS5zZXRBdHRyaWJ1dGUocGxheWVySWRBdHRyLCBuZXdQbGF5ZXJJZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IG5ldyBWaWRlb1BsYXllcihuZXdQbGF5ZXJJZCwgdGhpcywgcGxheWVyRWxlbSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUV4Y2VwdChwbGF5ZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmKHBsYXllci5wbGF5ZXJJZCAhPT0gcGxheWVySWQpIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyAgLy8gV2lsbCB0aGlzIGZ1bmN0aW9uIGV2ZXIgYmUgdXNlZD9cclxuICAgICAgICB0aGlzLm9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJcclxuaW1wb3J0IHsgVmlkZW9QbGF5ZXJDb250YWluZXIgfSBmcm9tIFwiLi92aWRlb19wbGF5ZXJfY29udGFpbmVyXCI7XHJcblxyXG5cclxudmFyIGNvbnRhaW5lciA9IG5ldyBWaWRlb1BsYXllckNvbnRhaW5lcigpO1xyXG5jb250YWluZXIucnVuKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=