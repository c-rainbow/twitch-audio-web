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
    <button class="audio-only-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
            data-a-target="audio-only-button"
            aria-label="Audio only">
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
const videoPlayerClass = "video-player";
const videoPlayerProcessedClass = "video-player-processed";
const videoPlayerIdPrefix = videoPlayerProcessedClass + "-";
const controlGroupClass = "player-controls__left-control-group";
const controlGroupProcessedClass = "control-group-processed";
const playButtonAttr = "button[data-a-target='player-play-pause-button']";
const volumeSliderAttr = "input[data-a-target='player-volume-slider']";
const radioButtonPausedClass = "audio-only-button-paused";
const radioButtonPlayingClass = "audio-only-button-playing";
const radioButtonDisabledClass = "audio-only-button-disabled";
const attrObserverConfig = { attributes: true, childList: false, subtree: false };
const domObserverConfig = { attributes: false, childList: true, subtree: true };
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
        const classes = playButtonElem.classList;
        // This element was already added to this.playButtonElem. Ignore.
        if (classes.contains("play-pause-button-processed")) {
            return;
        }
        classes.add("play-pause-button-processed");
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
        const state = this.playButtonElem.getAttribute("data-a-player-state");
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
        const classes = volumeSliderElem.classList;
        // This element was already added to this.volumeSliderElem. Ignore.
        if (classes.contains("volume-slider-processed")) {
            return;
        }
        classes.add("volume-slider-processed");
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
        const classes = (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.classList;
        if (classes === null || classes === void 0 ? void 0 : classes.contains("radio-button-processed")) {
            return;
        }
        // TODO: Use webpack html loader
        const buttonWrapperDom = document.createElement("div");
        buttonWrapperDom.innerHTML = initialButtonDom;
        this.radioButton = buttonWrapperDom.getElementsByTagName("button")[0];
        this.radioButton.classList.add("radio-button-processed");
        let stateClass = radioButtonDisabledClass;
        switch (this.player.playingState) {
            case 0 /* DISABLED */:
                stateClass = radioButtonDisabledClass;
                break;
            case 1 /* PAUSED */:
                stateClass = radioButtonPausedClass;
                break;
            case 2 /* PLAYING */:
                stateClass = radioButtonPlayingClass;
                break;
        }
        this.radioButton.classList.add(stateClass);
        this.radioButton.onclick = this.player.onRadioButtonClicked.bind(this.player);
        this.controlGroupElem.appendChild(buttonWrapperDom);
    }
    updateForPlay() {
        // NOTE: There is 1~3 seconds of delay between audio-only button click and sound being played.
        // It's better to show some intermediate state (icon change, mouse cursor change, etc) in the meanwhile
        var _a, _b;
        // Stop the video if playing
        const videoState = (_a = this.playButtonElem) === null || _a === void 0 ? void 0 : _a.getAttribute("data-a-player-state");
        if (videoState === "playing") {
            // Is there a better way to pause video than this "click" hack?
            this.playButtonElem.click();
        }
        // Change the radio button icon
        const classes = (_b = this.radioButton) === null || _b === void 0 ? void 0 : _b.classList;
        classes === null || classes === void 0 ? void 0 : classes.remove(radioButtonPausedClass);
        classes === null || classes === void 0 ? void 0 : classes.add(radioButtonPlayingClass);
        classes === null || classes === void 0 ? void 0 : classes.remove(radioButtonDisabledClass);
    }
    updateForPause() {
        var _a;
        // Change the radio button icon
        const classes = (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.classList;
        classes === null || classes === void 0 ? void 0 : classes.add(radioButtonPausedClass);
        classes === null || classes === void 0 ? void 0 : classes.remove(radioButtonPlayingClass);
        classes === null || classes === void 0 ? void 0 : classes.remove(radioButtonDisabledClass);
    }
    updateForDisabled() {
        var _a;
        // Change the radio button icon
        const classes = (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.classList;
        classes === null || classes === void 0 ? void 0 : classes.remove(radioButtonPausedClass);
        classes === null || classes === void 0 ? void 0 : classes.remove(radioButtonPlayingClass);
        classes === null || classes === void 0 ? void 0 : classes.add(radioButtonDisabledClass);
    }
    destroy() {
        var _a, _b, _c;
        (_a = this.componentsObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.playButtonObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
        (_c = this.volumeObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
    }
}
class video_player_container_VideoPlayer {
    constructor(playerId, container, playerElem) {
        this.playerId = playerId;
        this.container = container;
        this.playerElem = playerElem;
        this.playingState = 1 /* PAUSED */;
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
        const classes = controlGroupElem.classList;
        if (classes.contains(controlGroupProcessedClass)) {
            return;
        }
        classes.add(controlGroupProcessedClass);
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
        this.playingState = 2 /* PLAYING */;
        (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.updateForPlay();
    }
    pause() {
        var _a;
        if (this.playingState === 1 /* PAUSED */) {
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
        this.playingState = 1 /* PAUSED */;
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForPause();
    }
    // Pause audio in all players
    pauseAll() {
        this.container.pauseExcept(null);
    }
    disable() {
        var _a;
        if (this.playingState === 0 /* DISABLED */) {
            return;
        }
        if (this.playingState === 2 /* PLAYING */) {
            this.pause();
        }
        this.playingState = 0 /* DISABLED */;
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
        // When seekbar disappeared and the button is still disabled.
        /*if(!seekbar && this.playingState === PlayingState.DISABLED) {
            this.pause();
        }
        // When seekbar appeared and the radio button is not disabled yet.
        else*/ if (seekbar && this.playingState != 0 /* DISABLED */) {
            this.disable();
        }
    }
    onRadioButtonClicked() {
        switch (this.playingState) {
            case 0 /* DISABLED */:
                break;
            case 1 /* PAUSED */:
                this.requestPlay();
                break;
            case 2 /* PLAYING */:
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
            if (!playerElem.classList.contains(videoPlayerProcessedClass)) {
                console.debug("New video player detected");
                this.createNewPlayer(playerElem);
            }
        }
        // No need to proceed if there are the same number of players in the list and in DOM.
        if (playerElems.length === this.players.length) {
            return;
        }
        this.destroyNonexistingPlayers(playerElems);
    }
    destroyNonexistingPlayers(playerElems) {
        // Remove video players not in DOM anymore
        const allPlayerIdsInDom = [];
        for (let playerElem of playerElems) {
            const classes = playerElem.classList;
            for (let className of classes) {
                if (className.startsWith(videoPlayerIdPrefix)) {
                    allPlayerIdsInDom.push(className);
                }
            }
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
        if (playerElem.classList.contains(videoPlayerProcessedClass)) {
            return;
        }
        const newPlayerId = videoPlayerIdPrefix + this.nextId;
        this.nextId += 1;
        playerElem.classList.add(videoPlayerProcessedClass);
        playerElem.classList.add(newPlayerId);
        const player = new video_player_container_VideoPlayer(newPlayerId, this, playerElem);
        this.players.push(player);
    }
    pauseExcept(playerId) {
        for (let player of this.players) {
            if (player.playerId != playerId)
                player.pause();
        }
    }
    destroy() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFeEUsTUFBTSxTQUFTLEdBQVksNkJBQTZCLENBQUM7QUFDekQsTUFBTSxXQUFXLEdB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dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcbiIsIlxyXG5jb25zdCB0d2l0Y2hEb21haW4gOiBzdHJpbmcgPSBcInR3aXRjaC50di9cIjtcclxuLy8gTm9uLWV4aHVhc3RpdmUgbGlzdCBvZiBub24tY2hhbm5lbCByb3V0ZXMgaW4gdHdpdGNoLnR2XHJcbmNvbnN0IG5vbkNoYW5uZWxzIDogc3RyaW5nW10gPSBbXCJkaXJlY3RvcnlcIiwgXCJ2aWRlb3NcIiwgXCJ1XCIsIFwic2V0dGluZ3NcIl07XHJcblxyXG5jb25zdCBhcGlEb21haW4gOiBzdHJpbmcgPSBcImFwaS50d2l0Y2gudHYvYXBpL2NoYW5uZWxzL1wiO1xyXG5jb25zdCBhY2Nlc3NUb2tlbiA6IHN0cmluZyA9IFwiL2FjY2Vzc190b2tlblwiO1xyXG5cclxuY29uc3QgdXNoZXJEb21haW4gOiBzdHJpbmcgPSBcInVzaGVyLnR0dm53Lm5ldC9hcGkvY2hhbm5lbC9obHMvXCI7XHJcbmNvbnN0IHVzaGVyRXh0IDogc3RyaW5nID0gXCIubTN1OFwiO1xyXG5cclxuXHJcbi8vIEV4dHJhY3QgYXVkaW9fb25seSBzdHJlYW0gLm0zdTggZnJvbSB0aGUgbWFzdGVyIHBsYXlsaXN0IGNvbnRlbnQuXHJcbi8vIFJldHVybnMgdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBhIFVSTCBhZnRlciBhdWRpb19vbmx5IG1ldGFkYXRhLlxyXG4vLyBUT0RPOiBUaGlzIHdvcmtzLCBidXQgZXZlbnR1YWxseSB3ZSB3aWxsIG5lZWQgdG8gZnVsbHkgcGFyc2UgdGhlIGNvbnRlbnRcclxuLy8gYW5kIGdldCBhdWRpb19vbmx5IHN0cmVhbSB1cmxcclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQ6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgaWYoIWNvbnRlbnQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICBsZXQgYXVkaW9Pbmx5Rm91bmQgPSBmYWxzZTtcclxuICAgIGZvcihsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwiYXVkaW9fb25seVwiKSkgYXVkaW9Pbmx5Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChhdWRpb09ubHlGb3VuZCAmJiBsaW5lLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVdlYlVybCh3ZWJ1cmw/OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIC8vIENoYW5uZWwgbmFtZSBtYXkgbm90IGJlIGF2YWlsYWJsZSBmcm9tIHRoZSBtYWluIHBhZ2UgVVJMXHJcbiAgICBjb25zdCB1cmwgPSB3ZWJ1cmwgPz8gbG9jYXRpb24uaHJlZjtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXJsLCB0d2l0Y2hEb21haW4sIFwiL1wiLCB0cnVlKTtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2hhbm5lbCBuYW1lIFwiICsgY2hhbm5lbCArIFwiLCBmcm9tIFVSTDogXCIgKyB1cmwpXHJcblxyXG4gICAgLy8gRmlsdGVyIG91dCBzb21lIG5vbi1jaGFubmVsIHBhZ2VzIHdpdGggc2ltaWxhciBVUkwgcGF0dGVybiBhcyBjaGFubmVsIHBhZ2VzXHJcbiAgICBpZiAoY2hhbm5lbCBpbiBub25DaGFubmVscykgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVRva2VuVXJsKGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3MoYWNjZXNzVG9rZW5VcmwsIGFwaURvbWFpbiwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIGFjY2VzcyB0b2tlbjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVXNoZXJVcmwodXNoZXJVcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1c2hlclVybCwgdXNoZXJEb21haW4sIHVzaGVyRXh0KTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCB1c2hlcjogXCIgKyBjaGFubmVsKTtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuLy8gR2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIHN0YXJ0U3RyIGFuZCB0aGUgZmlyc3QgZW5kU3RyIGFmdGVyIHN0YXJ0U3RyLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKFxyXG4gICAgICAgIHVybDogc3RyaW5nLCBzdGFydFN0cjogc3RyaW5nLCBlbmRTdHI6IHN0cmluZywgZW5kT3B0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkgOiBzdHJpbmcge1xyXG4gICAgbGV0IHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzdGFydFN0cik7XHJcbiAgICBpZihzdGFydEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgc3RhcnRJbmRleCArPSBzdGFydFN0ci5sZW5ndGg7XHJcblxyXG4gICAgbGV0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoZW5kU3RyLCBzdGFydEluZGV4ICsgMSk7XHJcbiAgICBpZihlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICBpZihlbmRPcHRpb25hbCkgZW5kSW5kZXggPSB1cmwubGVuZ3RoO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsLnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbn1cclxuXHJcblxyXG4vLyBUT0RPOiBJbnN0ZWFkIG9mIHByZS1kZWZpbmVkIHVybCBmb3JtYXQsIHVzZSByZWNlbnRseSB1c2VkIG9udCBpbiBUd2l0Y2ggd2ViXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW46IHN0cmluZywgc2lnOiBzdHJpbmcpIDogVXNoZXJVcmwge1xyXG4gICAgY29uc3QgdXNoZXJVcmwgPSBuZXcgVXNoZXJVcmwoYGh0dHBzOi8vdXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy8ke2NoYW5uZWx9Lm0zdThgKTtcclxuICAgIHVzaGVyVXJsLnVwZGF0ZSh0b2tlbiwgc2lnKTtcclxuXHJcbiAgICAvLyBJdCBpcyBub3QgY2xlYXIgaWYgYWxsIG9mIHRoZXNlIHBhcmFtcyBhcmUgcmVxdWlyZWQgb3IgaWYgdGhlcmUgYXJlIGFueSBtaXNzaW5nIG9uZXMuXHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInBsYXllclwiLCBcInR3aXRjaHdlYlwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfc291cmNlXCIsIFwidHJ1ZVwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwidHlwZVwiLCBcImFueVwiKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHVzaGVyVXJsO1xyXG59XHJcblxyXG5cclxuLy8gSW50ZXJmYWNlIHRvIGNvbW11bmljYXRlIGJldHdlZW4gYmFja2dyb3VuZCBhbmQgY29udGVudHNjcmlwdFxyXG4vLyB0byByZXF1ZXN0L3Jlc3BvbmQgYWNjZXNzIHRva2VuIFVSTCBhbmQgdXNoZXIgVVJMIGZvciBhIGNoYW5uZWwuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJsc1Jlc3BvbnNlIHtcclxuICAgIHdlYlVybDogVXJsR3JvdXA7XHJcbiAgICBsYXN0UmVxdWVzdGVkOiBVcmxHcm91cDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXJsR3JvdXAge1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgYWNjZXNzVG9rZW5Vcmw6IHN0cmluZztcclxuICAgIHVzaGVyVXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vLyBDbGFzcyB0byBzdG9yZSBhbmQgbWFuaXB1bGF0ZSB1c2hlciBVUkwuXHJcbmV4cG9ydCBjbGFzcyBVc2hlclVybCB7XHJcbiAgICBvcmlnaW5hbFVybDogc3RyaW5nO1xyXG4gICAgdXJsT2JqZWN0OiBVUkw7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBleHBpcmVzQXQ6IG51bWJlcjsgIC8vIFRva2VuIGV4cGlyYXRpb24gZGF0ZXRpbWUgaW4gZXBvY2ggc2Vjb25kc1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFVybCA9IHVybDtcclxuICAgICAgICB0aGlzLnVybE9iamVjdCA9IG5ldyBVUkwodXJsKTtcclxuICAgICAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmdldENoYW5uZWwoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfYXVkaW9fb25seVwiLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5leHBpcmVkVXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc1NpbmNlRXBvY2ggPSBNYXRoLnJvdW5kKG5vdy5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgICAgICAvLyA2MCBzZWNvbmRzIGJ1ZmZlciBiZWZvcmUgdG9rZW4gZXhwaXJhdGlvblxyXG4gICAgICAgIGlmKHNlY29uZHNTaW5jZUVwb2NoICsgNjAgPCB0aGlzLmV4cGlyZXNBdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVcmwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQ2FjaGVkIFVSTCBmb3IgJHt0aGlzLmNoYW5uZWx9IGlzIGV4cGlyZWRgKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsT2JqZWN0LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aCh1cmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCI/XCIpO1xyXG4gICAgICAgIGlmKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsLnN1YnN0cmluZygwLCBlbmRJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UXVlcnlTdHJpbmcoa2V5OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5nZXQoa2V5KTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UXVlcnlTdHJpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLnNldChuYW1lLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhwaXJlc0F0KCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHRva2VuU3RyaW5nID0gdGhpcy5nZXRRdWVyeVN0cmluZyhcInRva2VuXCIpO1xyXG4gICAgICAgIGlmKCF0b2tlblN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuSnNvbiA9IEpTT04ucGFyc2UodG9rZW5TdHJpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBleHBpcmVzQXQgPSB0b2tlbkpzb24uZXhwaXJlcyBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzQXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IHBhcnNlIHRva2VuIGluIHVzaGVyIFVSTC4gRXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFubmVsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHRoaXMub3JpZ2luYWxVcmwpO1xyXG4gICAgICAgIHJldHVybiBjaGFubmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdUb2tlbjogc3RyaW5nLCBuZXdTaWc6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiLCBuZXdUb2tlbik7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInNpZ1wiLCBuZXdTaWcpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJwXCIsIHRoaXMuZ2V0UmFuZG9tTnVtYmVyKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbU51bWJlcigpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHsgYnVpbGRVc2hlclVybCwgcGFyc2VBdWRpb09ubHlVcmwsIFVybEdyb3VwIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQ29udGVudCh1cmw6IHN0cmluZykge1xyXG4gICAgaWYoIXVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdGhlIHN0YXR1cyBpZiBva1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiByZXNwVGV4dDtcclxuICAgIH1cclxuICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYGZldGNoQ29udGVudCB0aHJldyBhbiBlcnJvcjogJHtlcnJ9YClcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSnNvbih1cmw6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXJsKTtcclxuICAgIGlmKHJlc3BUZXh0KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcEpzb24gPSBKU09OLnBhcnNlKHJlc3BUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BKc29uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBjb3VsZCBub3QgYmUgcGFyc2VkIHRvIEpTT046IFwiICsgcmVzcFRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXVkaW9TdHJlYW1VcmwodXNoZXJVcmw6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgY29udGVudCA9IGF3YWl0IGZldGNoQ29udGVudCh1c2hlclVybCk7XHJcbiAgICBjb25zdCBzdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChjb250ZW50KTtcclxuICAgIHJldHVybiBzdHJlYW1Vcmw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2hlclVybChjaGFubmVsOiBzdHJpbmcsIHRva2VuVXJsOiBzdHJpbmcsIGxhc3RSZXF1ZXN0ZWRDaGFubmVsOiBzdHJpbmcsXHJcbiAgICAgICAgbGFzdFJlcXVzdGVkVXNoZXJVcmw6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgLy8gR2V0IG5ldyB0b2tlbiBhbmQgc2lnIGZyb20gYWNjZXNzIHRva2VuIFVSTFxyXG4gICAgY29uc3QgcmVzcEpzb24gPSBhd2FpdCBmZXRjaEpzb24odG9rZW5VcmwpO1xyXG4gICAgaWYoIXJlc3BKc29uKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24udG9rZW4gYXMgc3RyaW5nO1xyXG4gICAgY29uc3Qgc2lnID0gcmVzcEpzb24uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFubmVsIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjaGFubmVsIG9mIHRoZSBsYXN0IHJlcXVlc3RlZCB1c2hlciB1cmxcclxuICAgIC8vIChUaGlzIGlzIHBvc3NpYmxlIGlmIHRoZSBjaGFubmVsJ3Mgc3RyZWFtZXIgaXMgaG9zdGluZyBhbm90aGVyIGNoYW5uZWwpXHJcbiAgICBpZihsYXN0UmVxdWVzdGVkQ2hhbm5lbCAmJiBjaGFubmVsICE9PSBsYXN0UmVxdWVzdGVkQ2hhbm5lbCkge1xyXG4gICAgICAgIGlmKGxhc3RSZXF1c3RlZFVzaGVyVXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXN0UmVxdXN0ZWRVc2hlclVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBuZXcgb25lIGFuZCBzdG9yZSBpdFxyXG4gICAgICAgIGNvbnN0IHVzaGVyVXJsID0gYnVpbGRVc2hlclVybChsYXN0UmVxdWVzdGVkQ2hhbm5lbCwgdG9rZW4sIHNpZyk7XHJcbiAgICAgICAgcmV0dXJuIHVzaGVyVXJsLmdldFVybCgpOyAgXHJcbiAgICB9ICBcclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyeUZldGNoaW5nUGxheWxpc3QoZ3JvdXA6IFVybEdyb3VwKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBpZighZ3JvdXApIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuIFxyXG4gICAgLy8gc2VlIGlmIHRoZSBleGlzdGluZyB1c2hlciB1cmwgY2FuIGJlIHVzZWRcclxuICAgIGlmKGdyb3VwLnVzaGVyVXJsKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQoZ3JvdXAudXNoZXJVcmwpO1xyXG4gICAgICAgIGlmKHJlc3BUZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwVGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWdyb3VwLmFjY2Vzc1Rva2VuVXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IG5ldyB0b2tlbiBhbmQgc2lnIGZyb20gYWNjZXNzIHRva2VuIFVSTFxyXG4gICAgY29uc3QgcmVzcEpzb24gPSBhd2FpdCBmZXRjaEpzb24oZ3JvdXAuYWNjZXNzVG9rZW5VcmwpO1xyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbj8udG9rZW4gYXMgc3RyaW5nO1xyXG4gICAgY29uc3Qgc2lnID0gcmVzcEpzb24/LnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXdVc2hlclVybCA9IGJ1aWxkVXNoZXJVcmwoZ3JvdXAuY2hhbm5lbCwgdG9rZW4sIHNpZyk7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChuZXdVc2hlclVybC5nZXRVcmwoKSk7XHJcbiAgICByZXR1cm4gcmVzcFRleHQ7XHJcbn0iLCJcclxuaW1wb3J0IHsgdHJ5RmV0Y2hpbmdQbGF5bGlzdCB9IGZyb20gXCIuL2ZldGNoXCI7XHJcbmltcG9ydCB7IGdldENoYW5uZWxGcm9tV2ViVXJsLCBHZXRVcmxzUmVzcG9uc2UsIHBhcnNlQXVkaW9Pbmx5VXJsIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuLy8gVE9ETzogQW55IGJldHRlciB3YXkgdGhhbiBIVE1MIGFzIHN0cmluZz9cclxuY29uc3QgaW5pdGlhbEJ1dHRvbkRvbSA9IGBcclxuPGRpdiBjbGFzcz1cInR3LWlubGluZS1mbGV4IHR3LXJlbGF0aXZlIHR3LXRvb2x0aXAtd3JhcHBlclwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImF1ZGlvLW9ubHktYnV0dG9uIHR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1hbGlnbi1taWRkbGUgdHctYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1idXR0b24taWNvbiB0dy1idXR0b24taWNvbi0tb3ZlcmxheSB0dy1jb3JlLWJ1dHRvbiB0dy1jb3JlLWJ1dHRvbi0tb3ZlcmxheSB0dy1pbmxpbmUtZmxleCB0dy1pbnRlcmFjdGl2ZSB0dy1qdXN0aWZ5LWNvbnRlbnQtY2VudGVyIHR3LW92ZXJmbG93LWhpZGRlbiB0dy1yZWxhdGl2ZVwiXHJcbiAgICAgICAgICAgIGRhdGEtYS10YXJnZXQ9XCJhdWRpby1vbmx5LWJ1dHRvblwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJBdWRpbyBvbmx5XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInR3LWFsaWduLWl0ZW1zLWNlbnRlciB0dy1mbGV4IHR3LWZsZXgtZ3Jvdy0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHctYnV0dG9uLWljb25fX2ljb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taWNvbi1kaXZcIiBzdHlsZT1cIndpZHRoOiAycmVtOyBoZWlnaHQ6IDJyZW07XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBHb29nbGUgTWF0ZXJpYWwgRGVzaWduIFJhZGlvIEljb24uIEFwYWNoZSBMaWNlbnNlIHYyLjAgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3LWljb25fX3N2Z1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMuMjQgNi4xNUMyLjUxIDYuNDMgMiA3LjE3IDIgOHYxMmMwIDEuMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uOSAyLTJWOGMwLTEuMTEtLjg5LTItMi0ySDguM2w4LjI2LTMuMzRMMTUuODggMSAzLjI0IDYuMTV6TTcgMjBjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0xMy04aC0ydi0yaC0ydjJINFY4aDE2djR6XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGRpdiBjbGFzcz1cInR3LXRvb2x0aXAgdHctdG9vbHRpcC0tYWxpZ24tbGVmdCB0dy10b29sdGlwLS11cFwiIGRhdGEtYS10YXJnZXQ9XCJ0dy10b29sdGlwLWxhYmVsXCIgcm9sZT1cInRvb2x0aXBcIj5cclxuICAgICAgICBSYWRpbyBtb2RlXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcbiAgIFxyXG5cclxuY29uc3QgdmlkZW9QbGF5ZXJDbGFzcyA9IFwidmlkZW8tcGxheWVyXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MgPSBcInZpZGVvLXBsYXllci1wcm9jZXNzZWRcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJJZFByZWZpeCA9IHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MgKyBcIi1cIjtcclxuY29uc3QgY29udHJvbEdyb3VwQ2xhc3MgPSBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCI7XHJcbmNvbnN0IGNvbnRyb2xHcm91cFByb2Nlc3NlZENsYXNzID0gXCJjb250cm9sLWdyb3VwLXByb2Nlc3NlZFwiO1xyXG5jb25zdCBwbGF5QnV0dG9uQXR0ciA9IFwiYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddXCI7XHJcbmNvbnN0IHZvbHVtZVNsaWRlckF0dHIgPSBcImlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ11cIjtcclxuXHJcbmNvbnN0IHJhZGlvQnV0dG9uUGF1c2VkQ2xhc3MgPSBcImF1ZGlvLW9ubHktYnV0dG9uLXBhdXNlZFwiO1xyXG5jb25zdCByYWRpb0J1dHRvblBsYXlpbmdDbGFzcyA9IFwiYXVkaW8tb25seS1idXR0b24tcGxheWluZ1wiO1xyXG5jb25zdCByYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MgPSBcImF1ZGlvLW9ubHktYnV0dG9uLWRpc2FibGVkXCI7XHJcblxyXG5jb25zdCBhdHRyT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcbmNvbnN0IGRvbU9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBWaWRlb1BsYXllckNvbnRhaW5lciwgYWRkIE11dGF0aW9uT2JzZXJ2ZXIgdG8gXHJcbiAqIDEuIGRvY3VtZW50LmJvZHkgY2hlY2tzIGZvciBvbmUgc3VidHJlZSBjaGFuZ2VcclxuICogICAxLTIuIElmIGRpdiB3aXRoIGNsYXNzIFwidmlkZW8tcGxheWVyXCIsIHByb2Nlc3MgaXQuIENoZWNrICMyXHJcbiAqIFxyXG4gKiAyLiBDcmVhdGUgVmlkZW9QbGF5ZXIsIHZpZGVvLXBsYXllciBjbGFzcyBkaXYgY2hlY2tzIGZvciAxIGF0dHJpYnV0ZSBjaGFuZ2UsIDMgc3VidHJlZSBjaGFuZ2VzXHJcbiAqICAgMi0xLiBhdHRyaWJ1dGUgXCJkYXRhLWEtcGxheWVyLXR5cGVcIjogXCJzaXRlXCIsIFwic2l0ZV9taW5pXCIsIFwiY2xpcHMtd2F0Y2hcIlxyXG4gKiAgICAgMi0yLTIuIENoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciBpZiBuZWNlc3NhcnlcclxuICogICAgIDItMi0zLiBNb2RlOiBUdXBsZSBvZiAobGF5b3V0LCB2aWRlb190eXBlKS5cclxuICogICAgICAgMi0yLTMtMS4gbGF5b3V0OiBcInNpdGVcIiB8IFwic2l0ZV9taW5pXCJcclxuICogICAgICAgMi0yLTMtMi4gdmlkZW9fdHlwZTogXCJsaXZlXCIsIFwidm9kXCIsIFwiY2xpcFwiLi4gYW5kIG1vcmU/Pz8/P1xyXG4gKiAgIDItMi4gc3VidHJlZSBkaXYgd2l0aCBjbGFzcyBcInZvZC1zZWVrYmFyLXRpbWUtbGFiZWxzXCIgYW5kIFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCJcclxuICogICAgIDItMi0xLiBUaGlzIG9ubHkgYXBwZWFycyBpbiBWT0Qgd2F0Y2hcclxuICogICAgIDItMi0yLiBJZiBjcmVhdGVkLCBjaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgdG8gVk9EXHJcbiAqICAgICAyLTItMy4gSWYgcmVtb3ZlZCAoY2hhbmdlZCBmcm9tIFZPRCB0byBsaXZlL2NsaXApLCA/Pz8/XHJcbiAqICAgMi0zLiBjaGVjayBmb3IgY29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCJcclxuICogICAgIDItMy0xLiBJZiBjcmVhdGVkLCBjaGVjayAjMyBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi0zLTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqICAgMi00LiBjaGVjayBmb3IgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdGhlIHBsYXllclxyXG4gKiAgICAgMi00LTEuIElmIGNyZWF0ZWQsIGNoZWNrICM2IGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTQtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogXHJcbiAqIDMuIENvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiIGNoZWNrcyBmb3IgXHJcbiAqICAgMy0xLiBzdWJ0cmVlIGJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXSBmb3IgdmlkZW8gcGxheS9wYXVzZSBidXR0b25cclxuICogICAgIDMtMS0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNFxyXG4gKiAgICAgMy0xLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0yLiBzdWJ0cmVlIGlucHV0W2RhdGEtYS10YXJnZXQ9J3BsYXllci12b2x1bWUtc2xpZGVyJ10gZm9yIHZvbHVtZSBzbGlkZXJcclxuICogICAgIDMtMi0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNVxyXG4gKiAgICAgMy0yLTIuIElmIHJlbW92ZWQgKHdoZW4gcGxheWVyIHR5cGUgY2hhbmdlZCBmcm9tIFwic2l0ZVwiIHRvIFwic2l0ZV9taW5pXCIsIGV0YyksID8/Pz8/XHJcbiAqICAgMy0zLiBJZiBib3RoIGNvbXBvbmVudHMgaW4gMy0xIGFuZCAzLTIgYXJlIHJlYWR5OlxyXG4gKiAgICAgMy0zLTEuIENyZWF0ZSByYWRpbyBtb2RlIGJ1dHRvbiwgYW5kIHB1dCBNdXRhdGlvbk9ic2VydmVyIChzZWUgIzQgYW5kICM1KVxyXG4gKiAgICAgMy0zLTIuIElmIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgaXMgcmVtb3ZlZCAoc2l0ZS0+c2l0ZV9taW5pIGNoYW5nZSwgZXRjKVxyXG4gKiAgICAgICAzLTMtMi0xLiBhbHNvIHJlbW92ZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gZnJvbSBET01cclxuICogXHJcbiAqIDQuIFZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uIGNoZWNrcyBmb3JcclxuICogICA0LTEuIEF0dHJpYnV0ZSBjaGFuZ2UgXCJkYXRhLWEtcGxheWVyLXN0YXRlXCI6IFwicGxheWluZ1wiIG9yIFwicGF1c2VkXCJcclxuICogICAgIDQtMS0xLiBJZiBhdHRyaWJ1dGUgdmFsdWUgY2hhbmdlZCB0byBcInBsYXlpbmdcIiwgc3RvcCBhbGwgYXVkaW8gaW4gdGhlIFZpZGVvUGxheWVyQ29udGFpbmVyXHJcbiAqIFxyXG4gKiA1LiBWb2x1bWUgc2xpZGVyIGNoZWNrcyBmb3JcclxuICogICA1LTEuIEF0dHJpYnV0ZSBcInZhbHVlXCIgY2hhbmdlOiBudW1iZXIgYmV0d2VlbiAwIDw9IG51bSA8PSAxXHJcbiAqICAgICA1LTEtMS4gSWYgY2hhbmdlIGlzIGRldGVjdGVkLCBhcHBseSB0aGUgbmV3IHZvbHVtZSB0byBhdWRpb0VsZW0uXHJcbiAqIFxyXG4gKiA2LiBvcmlnaW5hbCBcInZpZGVvXCIgZWxlbWVudCBpbiB2aWRlby1wbGF5ZXIgY2hlY2tzIGZvclxyXG4gKiAgIDYtMS4gQXR0cmlidXRlIFwic3JjXCIgY2hhbmdlOiBtZWFucyB0aGF0IHRoZSB2aWRlbyBzb3VyY2UgY2hhbmdlZCAobGlrZWx5IGhvc3RpbmcgYW5vdGhlciBzdHJlYW1lcilcclxuICogICAgIDYtMS0xLiBSYWRpbyBtb2RlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQ/IFJlLWNvbmZpZ3VyZWQgd2l0aCB0aGUgbmV3IHN0cmVhbWVyJ3MgVVJMP1xyXG4gKiAgICBcclxuICovXHJcblxyXG4vKipcclxuICogSG93IHRvIGRldGVjdCB0aGUgY2hhbm5lbCBvZiB0aGUgc3RyZWFtIGJlaW5nIHBsYXllZD9cclxuICogR2V0dGluZyBjaGFubmVsIG5hbWUgZnJvbSBVUkwgaGFzIHRoZSBmb2xsbG93aW5nIGlzc3Vlc1xyXG4gKiAoMSkgU3RyZWFtZXIgaG9zdGluZyBhbm90aGVyIGNoYW5uZWxcclxuICogKDIpIE1haW4gcGFnZS4gQ2hhbm5lbCBjYW4gY2hhbmdlIHF1aWNrbHkgaW4gdGhlIGNhcm91c2VsXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIEtlZXAgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIFVSTCBpbiB0aGUgdGFiLiBHdWVzcyB0aGUgY2hhbm5lbCBmcm9tIHRoZXJlXHJcbiAqICgyKSBGb3IgXCJzaXRlX21pbmlcIiBzdGF0ZSwgc3RvcmUgdGhlIGNoYW5uZWwgbmFtZSBpbiB2aWRlbyBwbGF5ZXIuXHJcbiAqICAgICBJbiB0aGF0IGNhc2UsIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gcmVzdW1lIHBsYXlpbmcgaW4gdGhlIHJpZ2h0IGNoYW5uZWwuXHJcbiAqICgzKSBEaXNhYmxlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBpbiB0aGUgbWFpbiBwYWdlXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgcmFkaW8gbW9kZSBidXR0b24gaW4gc2l0ZV9taW5pP1xyXG4gKiBEb24ndCBzdG9yZSB0aGUgcGxheXN0YXRlIGluIERPTTogb25seSBzdG9yZSBpdCBpbiBWaWRlb1BsYXllciBjbGFzcyBhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFU3BvcnRzIHBhZ2U6IHZpZGVvIG1pbmlwbGF5ZXIga2VlcHMgcGxheWluZyBldmVuIHdoZW4gdGhlIHNpdGUgcGxheWVyIGluIEVzcG9ydHMgcGFnZSBpcyBhbHNvIGJlaW5nIHBsYXllZC5cclxuICogU2hvdWxkIHRoZSByYWRpbyBtb2RlIGZvbGxvdyB0aGUgc2FtZSBiZWhhdmlvcj9cclxuICovXHJcblxyXG4vKipcclxuICogQWNjZXNzIHRva2VuIHVybCBoYXMgb2F1dGggY29kZSwgd2hpY2ggaXMgdW5kZWZpbmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqIE5vdCBzdXJlIGhvdyBUd2l0Y2ggcmV0dXJucyBjb3JyZWN0IHJlc3BvbnNlIGZvciBhbm9ueW1vdXMgdXNlciB5ZXQuXHJcbiAqIENhbGxpbmcgdGhlIHNhbWUgYWNjZXNzIHRva2VuIFVSTCBmcm9tIGNvbnRlbnRzY3JpcHQgcmV0dXJucyBlcnJvci5cclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKi9cclxuXHJcblxyXG5jb25zdCBlbnVtIFBsYXlpbmdTdGF0ZSB7XHJcbiAgICBESVNBQkxFRCxcclxuICAgIFBBVVNFRCxcclxuICAgIFBMQVlJTkcsXHJcbn1cclxuXHJcblxyXG5jbGFzcyBDb250cm9sR3JvdXAge1xyXG4gICAgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwbGF5ZXI6IFZpZGVvUGxheWVyO1xyXG4gICAgcGxheUJ1dHRvbkVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgdm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHJhZGlvQnV0dG9uOiBIVE1MRWxlbWVudDtcclxuICAgIGNvbXBvbmVudHNPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIHBsYXlCdXR0b25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIHZvbHVtZU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyOyBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFZpZGVvUGxheWVyLCBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbSA9IGNvbnRyb2xHcm91cEVsZW07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMoKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyLm9ic2VydmUodGhpcy5jb250cm9sR3JvdXBFbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb21wb25lbnRzKCkge1xyXG4gICAgICAgIC8vIENoZWNrIGZvciBuZXcgUGxheS9BdWRpbyBidXR0b24gYW5kIHZvbHVtZSBzbGlkZXIgXHJcbiAgICAgICAgY29uc3QgcGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3IocGxheUJ1dHRvbkF0dHIpO1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbSk7XHJcbiAgICAgICAgY29uc3Qgdm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHZvbHVtZVNsaWRlckF0dHIpO1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdWb2x1bWVzbGlkZXJFbGVtKHZvbHVtZVNsaWRlckVsZW0pO1xyXG4gICAgICAgIC8vIEFkZCB0aGUgcmFkaW8gYnV0dG9uIGlmIG5vdCBleGlzdHNcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUmFkaW9CdXR0b24oKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCkge1xyXG4gICAgICAgIC8vIHBsYXkgYnV0dG9uIGNhbm5vdCBiZSBmb3VuZCBpbiB0aGUgY29udHJvbCBncm91cC4gUmVtb3ZlIHJlZmVyZW5jZSB0byB0aGUgZGVsZXRlZCBub2RlXHJcbiAgICAgICAgaWYoIXBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gcGxheUJ1dHRvbkVsZW0uY2xhc3NMaXN0O1xyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnBsYXlCdXR0b25FbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoY2xhc3Nlcy5jb250YWlucyhcInBsYXktcGF1c2UtYnV0dG9uLXByb2Nlc3NlZFwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzZXMuYWRkKFwicGxheS1wYXVzZS1idXR0b24tcHJvY2Vzc2VkXCIpO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy5wbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBwbGF5QnV0dG9uRWxlbTtcclxuICAgICAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVycyBpZiBhIHZpZGVvIHN0YXJ0cyB0byBwbGF5LlxyXG4gICAgICAgIC8vIFRoaXMgaXMgbmVjZXNhc3J5IGZvciBhIGNhc2Ugd2hlbiB1c2VyIGJyb3dzZXMgdG8gYSBub24tY2hhbm5lbCBwYWdlIChlLmcuIG1haW4sIGVzcG9ydHMpXHJcbiAgICAgICAgLy8gd2hpY2ggYXV0b21hdGljYWxseSBwbGF5cyBhIHZpZGVvLlxyXG4gICAgICAgIHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlby5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheUJ1dHRvbkVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VBdWRpb0ZvclZpZGVvKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5wbGF5QnV0dG9uRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWEtcGxheWVyLXN0YXRlXCIpO1xyXG4gICAgICAgIGlmKHN0YXRlID09PSBcInBsYXlpbmdcIikgeyAgLy8gVmlkZW8gc3RhdGUgZnJvbSBwYXVzZWQgdG8gcGxheWluZ1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5wYXVzZUFsbCgpOyAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllciBpbnN0YW5jZXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0Vm9sdW1lKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWVyLmF1ZGlvRWxlbSAmJiB0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gdGhpcy52b2x1bWVTbGlkZXJFbGVtLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hdWRpb0VsZW0udm9sdW1lID0gcGFyc2VGbG9hdCh2b2x1bWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICAgIC8vIHZvbHVtZSBzbGlkZXIgY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighdm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB2b2x1bWVTbGlkZXJFbGVtLmNsYXNzTGlzdDtcclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoY2xhc3Nlcy5jb250YWlucyhcInZvbHVtZS1zbGlkZXItcHJvY2Vzc2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoXCJ2b2x1bWUtc2xpZGVyLXByb2Nlc3NlZFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSB2b2x1bWVTbGlkZXJFbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gdm9sdW1lU2xpZGVyXHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuYWRqdXN0Vm9sdW1lLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZvbHVtZVNsaWRlckVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpIHtcclxuICAgICAgICAvLyBEb24ndCBwcm9jZWVkIHVubGVzcyBib3RoIHBsYXlCdXR0b25FbGVtIGFuZCB2b2x1bWVTbGlkZXJFbGVtIGFyZSBhdmFpbGFibGVcclxuICAgICAgICBpZighdGhpcy5wbGF5QnV0dG9uRWxlbSB8fCAhdGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBidXR0b24gd2FzIGFscmVhZHkgY3JlYXRlZCwgZG8gbm90aGluZ1xyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLnJhZGlvQnV0dG9uPy5jbGFzc0xpc3Q7XHJcbiAgICAgICAgaWYoY2xhc3Nlcz8uY29udGFpbnMoXCJyYWRpby1idXR0b24tcHJvY2Vzc2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFVzZSB3ZWJwYWNrIGh0bWwgbG9hZGVyXHJcbiAgICAgICAgY29uc3QgYnV0dG9uV3JhcHBlckRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgICAgICBidXR0b25XcmFwcGVyRG9tLmlubmVySFRNTCA9IGluaXRpYWxCdXR0b25Eb207XHJcbiAgICBcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uID0gYnV0dG9uV3JhcHBlckRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJ1dHRvblwiKVswXTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyYWRpby1idXR0b24tcHJvY2Vzc2VkXCIpO1xyXG4gICAgICAgIGxldCBzdGF0ZUNsYXNzID0gcmFkaW9CdXR0b25EaXNhYmxlZENsYXNzO1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnBsYXllci5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNsYXNzID0gcmFkaW9CdXR0b25EaXNhYmxlZENsYXNzO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBBVVNFRDpcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvblBhdXNlZENsYXNzO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNsYXNzID0gcmFkaW9CdXR0b25QbGF5aW5nQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5jbGFzc0xpc3QuYWRkKHN0YXRlQ2xhc3MpO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24ub25jbGljayA9IHRoaXMucGxheWVyLm9uUmFkaW9CdXR0b25DbGlja2VkLmJpbmQodGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwRWxlbS5hcHBlbmRDaGlsZChidXR0b25XcmFwcGVyRG9tKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQbGF5KCkge1xyXG4gICAgICAgIC8vIE5PVEU6IFRoZXJlIGlzIDF+MyBzZWNvbmRzIG9mIGRlbGF5IGJldHdlZW4gYXVkaW8tb25seSBidXR0b24gY2xpY2sgYW5kIHNvdW5kIGJlaW5nIHBsYXllZC5cclxuICAgICAgICAvLyBJdCdzIGJldHRlciB0byBzaG93IHNvbWUgaW50ZXJtZWRpYXRlIHN0YXRlIChpY29uIGNoYW5nZSwgbW91c2UgY3Vyc29yIGNoYW5nZSwgZXRjKSBpbiB0aGUgbWVhbndoaWxlXHJcblxyXG4gICAgICAgIC8vIFN0b3AgdGhlIHZpZGVvIGlmIHBsYXlpbmdcclxuICAgICAgICBjb25zdCB2aWRlb1N0YXRlID0gdGhpcy5wbGF5QnV0dG9uRWxlbT8uZ2V0QXR0cmlidXRlKFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiKTtcclxuICAgICAgICBpZih2aWRlb1N0YXRlID09PSBcInBsYXlpbmdcIikge1xyXG4gICAgICAgICAgICAvLyBJcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gcGF1c2UgdmlkZW8gdGhhbiB0aGlzIFwiY2xpY2tcIiBoYWNrP1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvblBhdXNlZENsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5hZGQocmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MpO1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBhdXNlKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGNsYXNzZXM/LmFkZChyYWRpb0J1dHRvblBhdXNlZENsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MpO1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvckRpc2FibGVkKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvblBhdXNlZENsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MpO1xyXG4gICAgICAgIGNsYXNzZXM/LmFkZChyYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFZpZGVvUGxheWVyIHtcclxuICAgIHBsYXllcklkOiBzdHJpbmc7XHJcbiAgICBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyO1xyXG4gICAgcGxheWVyRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwbGF5aW5nU3RhdGU6IFBsYXlpbmdTdGF0ZTtcclxuICAgIGF0dHJpYnV0ZU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgY29udHJvbEdyb3VwOiBDb250cm9sR3JvdXA7XHJcbiAgICBjb250cm9sR3JvdXBPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGhsczogSGxzO1xyXG4gICAgYXVkaW9FbGVtOiBIVE1MVmlkZW9FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcklkOiBzdHJpbmcsIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXIsIHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbSA9IHBsYXllckVsZW07XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG5cclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udHJvbHNQZXJMaXZlbmVzcygpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgY29udHJvbCBncm91cCBET00gaXMgcmVhZHlcclxuICAgICAgICBjb25zdCBjb250cm9sR3JvdXBFbGVtID0gdGhpcy5wbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY29udHJvbEdyb3VwQ2xhc3MpPy5bMF07XHJcbiAgICAgICAgaWYoIWNvbnRyb2xHcm91cEVsZW0pIHsgIC8vIGNvbnRyb2wgZ3JvdXAgY2Fubm90IGJlIGZvdW5kIGluIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpOyAgLy8gZGVzdHJveSByZWZlcmVuY2UgdG8gdGhlIHJlbW92ZWQgRE9NXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIHByb2Nlc3NlZCBjbGFzcyBuYW1lIHRvIHByZXZlbnQgZHVwbGljYXRlIHByb2Nlc3Npbmcgb2YgdGhpcyBlbGVtZW50XHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IGNvbnRyb2xHcm91cEVsZW0uY2xhc3NMaXN0O1xyXG4gICAgICAgIGlmKGNsYXNzZXMuY29udGFpbnMoY29udHJvbEdyb3VwUHJvY2Vzc2VkQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoY29udHJvbEdyb3VwUHJvY2Vzc2VkQ2xhc3MpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwID0gbmV3IENvbnRyb2xHcm91cCh0aGlzLCBjb250cm9sR3JvdXBFbGVtIGFzIEhUTUxFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5KG1lZGlhVXJsOiBzdHJpbmcpIHtcclxuICAgICAgICBpZighbWVkaWFVcmwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIk5vIG1lZGlhVXJsIGlzIGZvdW5kIHRvIHBsYXlcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hdWRpb0VsZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkF1ZGlvIGVsZW1lbnQgYWxyZWFkeSBleGlzdHNcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHNlcGFyYXRlIDx2aWRlbz4gZWxlbWVudCB0byBwbGF5IGF1ZGlvLlxyXG4gICAgICAgIC8vIDxhdWRpbz4gY2FuIGJlIGFsc28gdXNlZCBieSBobHMuanMsIGJ1dCBUeXBlc2NyaXB0IGZvcmNlcyB0aGlzIHRvIGJlIEhUTUxWaWRlb0VsZW1lbnQuXHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0gPSA8SFRNTFZpZGVvRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGxheSgpLnRoZW4oYXVkaW9QbGF5Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWluZ1N0YXRlID09PSBQbGF5aW5nU3RhdGUuUEFVU0VEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5obHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcIkRPTUV4Y2VwdGlvbjogVGhlIHBsYXkoKSByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBieSBhIGNhbGwgdG8gcGF1c2UoKVwiXHJcbiAgICAgICAgICAgICAgICAvLyBpcyB0aHJvd24gd2hlbiB1c2VyIHBhdXNlcyB0aGUgYXVkaW8gdG9vIHF1aWNrbHkgYWZ0ZXIgcGxheWluZy5cclxuICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBpcyBuZWVkZWQuIFRoZSBhdWRpbyB3aWxsIGJlIHBhdXNlZCBjb3JyZWN0bHkgYW55d2F5LlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLnN0b3BMb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRldGFjaE1lZGlhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGxzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgLy8gVGhlcmUgc2VlbXMgdG8gYmUgYSBidWcgdGhhdCB0aGUgSExTIG9iamVjdCBnZXRzIHN0dWNrIGFmdGVyIG11bHRpcGxlIHBsYXlzIGFuZCBwYXVzZXNcclxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgcmUtdXNlZCBmb3IgdGhlIG5leHQgcGxheS4gTmVlZCB0byBkZXN0cm95IHRoZSBvYmplY3QgYW5kIHJlLWNyZWF0ZSBpdC5cclxuICAgICAgICAgICAgdGhpcy5obHMgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckVsZW0ucmVtb3ZlQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQYXVzZSBhdWRpbyBpbiBhbGwgcGxheWVyc1xyXG4gICAgcGF1c2VBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucGF1c2VFeGNlcHQobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nU3RhdGUgPT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvckRpc2FibGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgIC8vIFdoYXQgZWxzZSB0byBkbyBoZXJlP1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFBsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VDYWxsYmFjayA9IGFzeW5jIGZ1bmN0aW9uKHJlc3BvbnNlOiBHZXRVcmxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcInJlc3BvbnNlIGZvciBnZXRfYXVkaW9fdXJsIHJlY2VpdmVkOiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgIGlmKCFyZXNwb25zZT8ud2ViVXJsPy5jaGFubmVsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50bHkgaW4gYSBub24tY2hhbm5lbCBwYWdlLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwbGF5bGlzdCA9IGF3YWl0IHRyeUZldGNoaW5nUGxheWxpc3QocmVzcG9uc2Uud2ViVXJsKTtcclxuICAgICAgICAgICAgaWYoIXBsYXlsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPZmZsaW5lIG9yIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsLiBEaXNhYmxlIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYXVkaW9TdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChwbGF5bGlzdCk7XHJcbiAgICAgICAgICAgIGlmKGF1ZGlvU3RyZWFtVXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdCh0aGlzLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheShhdWRpb1N0cmVhbVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHttZXNzYWdlOiBcImdldF9hdWRpb191cmxcIiwgY2hhbm5lbDogY2hhbm5lbH0sIHJlc3BvbnNlQ2FsbGJhY2suYmluZCh0aGlzKSk7IFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNvbnRyb2xzUGVyTGl2ZW5lc3MoKSB7XHJcbiAgICAgICAgLy8gSWYgd2F0Y2hpbmcgYSBsaXZlIHN0cmVhbSwgZW5hYmxlIHRoZSBjb250cm9sIGdyb3VwLlxyXG4gICAgICAgIC8vIElmIHdhdGNoaW5nIFZPRCBvZiBjbGlwLCBkaXNhYmxlIHRoZSBjb250cm9sIGdyb3VwLlxyXG4gICAgICAgIC8vIEZvciBub3csIHRoZSBsb2dpYyBmb3IgY2hlY2tpbmcgbGl2ZS9yZWNvcmRlZCB2aWRlbyBpcyBleGlzdGVuY2Ugb2YgdGltZSBzZWVrYmFyLlxyXG4gICAgICAgIGNvbnN0IHNlZWtiYXIgPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlZWtiYXItaW50ZXJhY3Rpb24tYXJlYVwiKT8uWzBdO1xyXG5cclxuICAgICAgICAvLyBXaGVuIHNlZWtiYXIgZGlzYXBwZWFyZWQgYW5kIHRoZSBidXR0b24gaXMgc3RpbGwgZGlzYWJsZWQuXHJcbiAgICAgICAgLyppZighc2Vla2JhciAmJiB0aGlzLnBsYXlpbmdTdGF0ZSA9PT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gV2hlbiBzZWVrYmFyIGFwcGVhcmVkIGFuZCB0aGUgcmFkaW8gYnV0dG9uIGlzIG5vdCBkaXNhYmxlZCB5ZXQuXHJcbiAgICAgICAgZWxzZSovIGlmKHNlZWtiYXIgJiYgdGhpcy5wbGF5aW5nU3RhdGUgIT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJhZGlvQnV0dG9uQ2xpY2tlZCgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJDb250YWluZXIge1xyXG4gICAgcGxheWVyczogVmlkZW9QbGF5ZXJbXTtcclxuICAgIG5leHRJZDogbnVtYmVyO1xyXG4gICAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAxMDAwMTsgIC8vIFJhbmRvbSBzdGFydCBpbmRleCBmb3IgcGxheWVyLlxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvLyBGaW5kIGV4aXN0aW5nIHZpZGVvIHBsYXllciBlbGVtZW50cyB0byBjcmVhdGUgVmlkZW9QbGF5ZXIgb2JqZWN0c1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgLy8gRGV0ZWN0IGZ1dHVyZSB2aWRlbyBwbGF5ZXIgZWxlbWVudHNcclxuICAgICAgICBjb25zdCBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibWFpblwiKVswXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKG1haW5FbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmlkZW9QbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIC8vIFRPRE86IElzIGl0IGJldHRlciB0byBpdGVyYXRlIG9ubHkgdGhlIG11dGF0ZWQgZGl2cz9cclxuICAgICAgICBjb25zdCBwbGF5ZXJFbGVtcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh2aWRlb1BsYXllckNsYXNzKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpdiBpcyBub3QgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgaWYoIXBsYXllckVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTmV3IHZpZGVvIHBsYXllciBkZXRlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBuZWVkIHRvIHByb2NlZWQgaWYgdGhlcmUgYXJlIHRoZSBzYW1lIG51bWJlciBvZiBwbGF5ZXJzIGluIHRoZSBsaXN0IGFuZCBpbiBET00uXHJcbiAgICAgICAgaWYocGxheWVyRWxlbXMubGVuZ3RoID09PSB0aGlzLnBsYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVzdHJveU5vbmV4aXN0aW5nUGxheWVycyhwbGF5ZXJFbGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveU5vbmV4aXN0aW5nUGxheWVycyhwbGF5ZXJFbGVtczogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50Pikge1xyXG4gICAgICAgIC8vIFJlbW92ZSB2aWRlbyBwbGF5ZXJzIG5vdCBpbiBET00gYW55bW9yZVxyXG4gICAgICAgIGNvbnN0IGFsbFBsYXllcklkc0luRG9tOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gcGxheWVyRWxlbS5jbGFzc0xpc3Q7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2xhc3NOYW1lIG9mIGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGNsYXNzTmFtZS5zdGFydHNXaXRoKHZpZGVvUGxheWVySWRQcmVmaXgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsUGxheWVySWRzSW5Eb20ucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJBbGwgcGxheWVySWRzIGluIERPTTogXCIgKyBhbGxQbGF5ZXJJZHNJbkRvbSk7XHJcbiAgICAgICAgY29uc3QgbmV3bGlzdCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHBsYXllci5wbGF5ZXJJZDtcclxuICAgICAgICAgICAgaWYoYWxsUGxheWVySWRzSW5Eb20uaW5kZXhPZihwbGF5ZXJJZCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld2xpc3QucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgUGxheWVyICR7cGxheWVySWR9IGlzIG5vdCBpbiBET00gYW55bW9yZS4gRGVsZXRpbmcuLmApO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXdsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmKHBsYXllckVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1BsYXllcklkID0gdmlkZW9QbGF5ZXJJZFByZWZpeCArIHRoaXMubmV4dElkO1xyXG4gICAgICAgIHRoaXMubmV4dElkICs9IDE7XHJcbiAgICAgICAgcGxheWVyRWxlbS5jbGFzc0xpc3QuYWRkKHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MpO1xyXG4gICAgICAgIHBsYXllckVsZW0uY2xhc3NMaXN0LmFkZChuZXdQbGF5ZXJJZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IG5ldyBWaWRlb1BsYXllcihuZXdQbGF5ZXJJZCwgdGhpcywgcGxheWVyRWxlbSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUV4Y2VwdChwbGF5ZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmKHBsYXllci5wbGF5ZXJJZCAhPSBwbGF5ZXJJZCkgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaWxsIHRoaXMgZnVuY3Rpb24gZXZlciBiZSB1c2VkP1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIlxyXG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbnRhaW5lciB9IGZyb20gXCIuL3ZpZGVvX3BsYXllcl9jb250YWluZXJcIjtcclxuXHJcblxyXG52YXIgY29udGFpbmVyID0gbmV3IFZpZGVvUGxheWVyQ29udGFpbmVyKCk7XHJcbmNvbnRhaW5lci5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==