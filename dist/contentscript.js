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
    if (startIndex == -1) {
        return null;
    }
    startIndex += startStr.length;
    let endIndex = url.indexOf(endStr, startIndex + 1);
    if (endIndex == -1) {
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
        if (endIndex == -1) {
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
        if (state == "playing") { // Video state from paused to playing
            this.player.pauseAll(); // Pause audio in all player instances
        }
    }
    adjustVolume() {
        if (this.player.audioElem) {
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
        // Don't proceed if both playButtonElem and volumeSliderElem are available
        if (!this.playButtonElem || !this.volumeSliderElem) {
            return;
        }
        // If the button was already created, do nothing
        const classes = (_a = this.radioButton) === null || _a === void 0 ? void 0 : _a.classList;
        if (classes === null || classes === void 0 ? void 0 : classes.contains("radio-button-processed")) {
            return;
        }
        // TODO: Use webpack html loader
        // TODO: Disable the button in clip and (also VOD?)
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
        if (videoState == "playing") {
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
        this.audioElem = document.createElement("video");
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
    destroy() {
        var _a;
        this.pause();
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    requestPlay() {
        const channel = Object(url["e" /* getChannelFromWebUrl */])();
        const responseCallback = function (response) {
            var _a;
            return video_player_container_awaiter(this, void 0, void 0, function* () {
                console.debug("response for get_audio_url received: " + JSON.stringify(response));
                if (!((_a = response === null || response === void 0 ? void 0 : response.webUrl) === null || _a === void 0 ? void 0 : _a.channel)) {
                    return;
                }
                let playlist = yield tryFetchingPlaylist(response.webUrl);
                if (!playlist) {
                    playlist = yield tryFetchingPlaylist(response.lastRequested);
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
        var _a, _b, _c;
        // If watching a live stream, enable the control group.
        // If watching VOD of clip, disable the control group.
        // For now, the logic for checking live/recorded video is existence of time seekbar.
        const seekbar = (_a = this.playerElem.getElementsByClassName("seekbar-interaction-area")) === null || _a === void 0 ? void 0 : _a[0];
        // When seekbar disappeared and the button is still disabled.
        if (!seekbar && this.playingState == 0 /* DISABLED */) {
            this.playingState = 1 /* PAUSED */;
            (_b = this.controlGroup) === null || _b === void 0 ? void 0 : _b.updateForPause();
        }
        // When seekbar appeared and the radio button is not disabled yet.
        else if (seekbar && this.playingState != 0 /* DISABLED */) {
            this.playingState = 0 /* DISABLED */;
            (_c = this.controlGroup) === null || _c === void 0 ? void 0 : _c.updateForDisabled();
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
        if (playerElems.length == this.players.length) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFeEUsTUFBTSxTQUFTLEdBQVksNkJBQTZCLENBQUM7QUFDekQsTUFBTSxXQUFXLEdB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bUJBQW1CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUNqQixVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3BELFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sTUFBTSxHQUFHLElBQUksa0NBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBZ0I7UUFDeEIsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzVCLElBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxRQUFRO2dCQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNsRDtJQUNMLENBQUM7SUFFRCxPQUFPOztRQUNILFVBQUksQ0FBQyxRQUFRLDBDQUFFLFVBQVUsR0FBRztRQUM1QixLQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNKOzs7QUM1akIrRDtBQUdoRSxJQUFJLFNBQVMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFDM0MsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6ImNvbnRlbnRzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG4iLCJcclxuY29uc3QgdHdpdGNoRG9tYWluIDogc3RyaW5nID0gXCJ0d2l0Y2gudHYvXCI7XHJcbi8vIE5vbi1leGh1YXN0aXZlIGxpc3Qgb2Ygbm9uLWNoYW5uZWwgcm91dGVzIGluIHR3aXRjaC50dlxyXG5jb25zdCBub25DaGFubmVscyA6IHN0cmluZ1tdID0gW1wiZGlyZWN0b3J5XCIsIFwidmlkZW9zXCIsIFwidVwiLCBcInNldHRpbmdzXCJdO1xyXG5cclxuY29uc3QgYXBpRG9tYWluIDogc3RyaW5nID0gXCJhcGkudHdpdGNoLnR2L2FwaS9jaGFubmVscy9cIjtcclxuY29uc3QgYWNjZXNzVG9rZW4gOiBzdHJpbmcgPSBcIi9hY2Nlc3NfdG9rZW5cIjtcclxuXHJcbmNvbnN0IHVzaGVyRG9tYWluIDogc3RyaW5nID0gXCJ1c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzL1wiO1xyXG5jb25zdCB1c2hlckV4dCA6IHN0cmluZyA9IFwiLm0zdThcIjtcclxuXHJcblxyXG4vLyBFeHRyYWN0IGF1ZGlvX29ubHkgc3RyZWFtIC5tM3U4IGZyb20gdGhlIG1hc3RlciBwbGF5bGlzdCBjb250ZW50LlxyXG4vLyBSZXR1cm5zIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2YgYSBVUkwgYWZ0ZXIgYXVkaW9fb25seSBtZXRhZGF0YS5cclxuLy8gVE9ETzogVGhpcyB3b3JrcywgYnV0IGV2ZW50dWFsbHkgd2Ugd2lsbCBuZWVkIHRvIGZ1bGx5IHBhcnNlIHRoZSBjb250ZW50XHJcbi8vIGFuZCBnZXQgYXVkaW9fb25seSBzdHJlYW0gdXJsXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF1ZGlvT25seVVybChjb250ZW50OiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGlmKCFjb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gICAgbGV0IGF1ZGlvT25seUZvdW5kID0gZmFsc2U7XHJcbiAgICBmb3IobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgICBpZiAobGluZS5pbmNsdWRlcyhcImF1ZGlvX29ubHlcIikpIGF1ZGlvT25seUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICBpZiAoYXVkaW9Pbmx5Rm91bmQgJiYgbGluZS5zdGFydHNXaXRoKFwiaHR0cHM6Ly9cIikpIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21XZWJVcmwod2VidXJsPzogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAvLyBDaGFubmVsIG5hbWUgbWF5IG5vdCBiZSBhdmFpbGFibGUgZnJvbSB0aGUgbWFpbiBwYWdlIFVSTFxyXG4gICAgY29uc3QgdXJsID0gd2VidXJsID8/IGxvY2F0aW9uLmhyZWY7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVybCwgdHdpdGNoRG9tYWluLCBcIi9cIiwgdHJ1ZSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNoYW5uZWwgbmFtZSBcIiArIGNoYW5uZWwgKyBcIiwgZnJvbSBVUkw6IFwiICsgdXJsKVxyXG5cclxuICAgIC8vIEZpbHRlciBvdXQgc29tZSBub24tY2hhbm5lbCBwYWdlcyB3aXRoIHNpbWlsYXIgVVJMIHBhdHRlcm4gYXMgY2hhbm5lbCBwYWdlc1xyXG4gICAgaWYgKGNoYW5uZWwgaW4gbm9uQ2hhbm5lbHMpIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Ub2tlblVybChhY2Nlc3NUb2tlblVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKGFjY2Vzc1Rva2VuVXJsLCBhcGlEb21haW4sIGFjY2Vzc1Rva2VuKTtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hhbm5lbCBuYW1lIHBhcnNlZCBhY2Nlc3MgdG9rZW46IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVsRnJvbVVzaGVyVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXROYW1lQmV0d2VlblN0cmluZ3ModXNoZXJVcmwsIHVzaGVyRG9tYWluLCB1c2hlckV4dCk7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgdXNoZXI6IFwiICsgY2hhbm5lbCk7XHJcbiAgICByZXR1cm4gY2hhbm5lbDtcclxufVxyXG5cclxuXHJcbi8vIEdldCBjaGFubmVsIGJldHdlZW4gdGhlIGZpcnN0IG9jY3VyYW5jZSBvZiBzdGFydFN0ciBhbmQgdGhlIGZpcnN0IGVuZFN0ciBhZnRlciBzdGFydFN0ci5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhcclxuICAgICAgICB1cmw6IHN0cmluZywgc3RhcnRTdHI6IHN0cmluZywgZW5kU3RyOiBzdHJpbmcsIGVuZE9wdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIDogc3RyaW5nIHtcclxuICAgIGxldCBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc3RhcnRTdHIpO1xyXG4gICAgaWYoc3RhcnRJbmRleCA9PSAtMSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgc3RhcnRJbmRleCArPSBzdGFydFN0ci5sZW5ndGg7XHJcblxyXG4gICAgbGV0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoZW5kU3RyLCBzdGFydEluZGV4ICsgMSk7XHJcbiAgICBpZihlbmRJbmRleCA9PSAtMSkge1xyXG4gICAgICAgIGlmKGVuZE9wdGlvbmFsKSBlbmRJbmRleCA9IHVybC5sZW5ndGg7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxufVxyXG5cclxuXHJcbi8vIFRPRE86IEluc3RlYWQgb2YgcHJlLWRlZmluZWQgdXJsIGZvcm1hdCwgdXNlIHJlY2VudGx5IHVzZWQgb250IGluIFR3aXRjaCB3ZWJcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nLCBzaWc6IHN0cmluZykgOiBVc2hlclVybCB7XHJcbiAgICBjb25zdCB1c2hlclVybCA9IG5ldyBVc2hlclVybChgaHR0cHM6Ly91c2hlci50dHZudy5uZXQvYXBpL2NoYW5uZWwvaGxzLyR7Y2hhbm5lbH0ubTN1OGApO1xyXG4gICAgdXNoZXJVcmwudXBkYXRlKHRva2VuLCBzaWcpO1xyXG5cclxuICAgIC8vIEl0IGlzIG5vdCBjbGVhciBpZiBhbGwgb2YgdGhlc2UgcGFyYW1zIGFyZSByZXF1aXJlZCBvciBpZiB0aGVyZSBhcmUgYW55IG1pc3Npbmcgb25lcy5cclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwicGxheWVyXCIsIFwidHdpdGNod2ViXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19zb3VyY2VcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdXNoZXJVcmwuc2V0UXVlcnlTdHJpbmcoXCJ0eXBlXCIsIFwiYW55XCIpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdXNoZXJVcmw7XHJcbn1cclxuXHJcblxyXG4vLyBJbnRlcmZhY2UgdG8gY29tbXVuaWNhdGUgYmV0d2VlbiBiYWNrZ3JvdW5kIGFuZCBjb250ZW50c2NyaXB0XHJcbi8vIHRvIHJlcXVlc3QvcmVzcG9uZCBhY2Nlc3MgdG9rZW4gVVJMIGFuZCB1c2hlciBVUkwgZm9yIGEgY2hhbm5lbC5cclxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmxzUmVzcG9uc2Uge1xyXG4gICAgd2ViVXJsOiBVcmxHcm91cDtcclxuICAgIGxhc3RSZXF1ZXN0ZWQ6IFVybEdyb3VwO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVcmxHcm91cCB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBhY2Nlc3NUb2tlblVybDogc3RyaW5nO1xyXG4gICAgdXNoZXJVcmw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8vIENsYXNzIHRvIHN0b3JlIGFuZCBtYW5pcHVsYXRlIHVzaGVyIFVSTC5cclxuZXhwb3J0IGNsYXNzIFVzaGVyVXJsIHtcclxuICAgIG9yaWdpbmFsVXJsOiBzdHJpbmc7XHJcbiAgICB1cmxPYmplY3Q6IFVSTDtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGV4cGlyZXNBdDogbnVtYmVyOyAgLy8gVG9rZW4gZXhwaXJhdGlvbiBkYXRldGltZSBpbiBlcG9jaCBzZWNvbmRzXHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuZ2V0Q2hhbm5lbCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSB0aGlzLmdldEV4cGlyZXNBdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJhbGxvd19hdWRpb19vbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVbmV4cGlyZWRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRzU2luY2VFcG9jaCA9IE1hdGgucm91bmQobm93LmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgICAgIC8vIDYwIHNlY29uZHMgYnVmZmVyIGJlZm9yZSB0b2tlbiBleHBpcmF0aW9uXHJcbiAgICAgICAgaWYoc2Vjb25kc1NpbmNlRXBvY2ggKyA2MCA8IHRoaXMuZXhwaXJlc0F0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVybCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBDYWNoZWQgVVJMIGZvciAke3RoaXMuY2hhbm5lbH0gaXMgZXhwaXJlZGApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cmxPYmplY3QudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYoZW5kSW5kZXggPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFF1ZXJ5U3RyaW5nKGtleTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuZ2V0KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFF1ZXJ5U3RyaW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5zZXQobmFtZSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4cGlyZXNBdCgpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCB0b2tlblN0cmluZyA9IHRoaXMuZ2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAgICBpZighdG9rZW5TdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkpzb24gPSBKU09OLnBhcnNlKHRva2VuU3RyaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgZXhwaXJlc0F0ID0gdG9rZW5Kc29uLmV4cGlyZXMgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlc0F0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYENhbm5vdCBwYXJzZSB0b2tlbiBpbiB1c2hlciBVUkwuIEVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbm5lbCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh0aGlzLm9yaWdpbmFsVXJsKTtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3VG9rZW46IHN0cmluZywgbmV3U2lnOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIiwgbmV3VG9rZW4pO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJzaWdcIiwgbmV3U2lnKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwicFwiLCB0aGlzLmdldFJhbmRvbU51bWJlcigpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21OdW1iZXIoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IGJ1aWxkVXNoZXJVcmwsIHBhcnNlQXVkaW9Pbmx5VXJsLCBVcmxHcm91cCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaENvbnRlbnQodXJsOiBzdHJpbmcpIHtcclxuICAgIGlmKCF1cmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBzdGF0dXMgaWYgb2tcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICB9XHJcbiAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGBmZXRjaENvbnRlbnQgdGhyZXcgYW4gZXJyb3I6ICR7ZXJyfWApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVybCk7XHJcbiAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BKc29uID0gSlNPTi5wYXJzZShyZXNwVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwSnNvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgY291bGQgbm90IGJlIHBhcnNlZCB0byBKU09OOiBcIiArIHJlc3BUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEF1ZGlvU3RyZWFtVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXNoZXJVcmwpO1xyXG4gICAgY29uc3Qgc3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudCk7XHJcbiAgICByZXR1cm4gc3RyZWFtVXJsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlblVybDogc3RyaW5nLCBsYXN0UmVxdWVzdGVkQ2hhbm5lbDogc3RyaW5nLFxyXG4gICAgICAgIGxhc3RSZXF1c3RlZFVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKHRva2VuVXJsKTtcclxuICAgIGlmKCFyZXNwSnNvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uLnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uLnNpZyBhcyBzdHJpbmc7XHJcbiAgICBpZighdG9rZW4gfHwgISBzaWcpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgY2hhbm5lbCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY2hhbm5lbCBvZiB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgdXJsXHJcbiAgICAvLyAoVGhpcyBpcyBwb3NzaWJsZSBpZiB0aGUgY2hhbm5lbCdzIHN0cmVhbWVyIGlzIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsKVxyXG4gICAgaWYobGFzdFJlcXVlc3RlZENoYW5uZWwgJiYgY2hhbm5lbCAhPT0gbGFzdFJlcXVlc3RlZENoYW5uZWwpIHtcclxuICAgICAgICBpZihsYXN0UmVxdXN0ZWRVc2hlclVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGFzdFJlcXVzdGVkVXNoZXJVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgc3RvcmUgaXRcclxuICAgICAgICBjb25zdCB1c2hlclVybCA9IGJ1aWxkVXNoZXJVcmwobGFzdFJlcXVlc3RlZENoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgICAgIHJldHVybiB1c2hlclVybC5nZXRVcmwoKTsgIFxyXG4gICAgfSAgXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cnlGZXRjaGluZ1BsYXlsaXN0KGdyb3VwOiBVcmxHcm91cCkgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgaWYoIWdyb3VwKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiBcclxuICAgIC8vIHNlZSBpZiB0aGUgZXhpc3RpbmcgdXNoZXIgdXJsIGNhbiBiZSB1c2VkXHJcbiAgICBpZihncm91cC51c2hlclVybCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KGdyb3VwLnVzaGVyVXJsKTtcclxuICAgICAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcFRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCFncm91cC5hY2Nlc3NUb2tlblVybCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCBuZXcgdG9rZW4gYW5kIHNpZyBmcm9tIGFjY2VzcyB0b2tlbiBVUkxcclxuICAgIGNvbnN0IHJlc3BKc29uID0gYXdhaXQgZmV0Y2hKc29uKGdyb3VwLmFjY2Vzc1Rva2VuVXJsKTtcclxuICAgIGNvbnN0IHRva2VuID0gcmVzcEpzb24/LnRva2VuIGFzIHN0cmluZztcclxuICAgIGNvbnN0IHNpZyA9IHJlc3BKc29uPy5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV3VXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGdyb3VwLmNoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCBmZXRjaENvbnRlbnQobmV3VXNoZXJVcmwuZ2V0VXJsKCkpO1xyXG4gICAgcmV0dXJuIHJlc3BUZXh0O1xyXG59IiwiXHJcbmltcG9ydCB7IHRyeUZldGNoaW5nUGxheWxpc3QgfSBmcm9tIFwiLi9mZXRjaFwiO1xyXG5pbXBvcnQgeyBnZXRDaGFubmVsRnJvbVdlYlVybCwgR2V0VXJsc1Jlc3BvbnNlLCBwYXJzZUF1ZGlvT25seVVybCB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIFRPRE86IEFueSBiZXR0ZXIgd2F5IHRoYW4gSFRNTCBhcyBzdHJpbmc/XHJcbmNvbnN0IGluaXRpYWxCdXR0b25Eb20gPSBgXHJcbjxkaXYgY2xhc3M9XCJ0dy1pbmxpbmUtZmxleCB0dy1yZWxhdGl2ZSB0dy10b29sdGlwLXdyYXBwZXJcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJhdWRpby1vbmx5LWJ1dHRvbiB0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctYWxpZ24tbWlkZGxlIHR3LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYnV0dG9uLWljb24gdHctYnV0dG9uLWljb24tLW92ZXJsYXkgdHctY29yZS1idXR0b24gdHctY29yZS1idXR0b24tLW92ZXJsYXkgdHctaW5saW5lLWZsZXggdHctaW50ZXJhY3RpdmUgdHctanVzdGlmeS1jb250ZW50LWNlbnRlciB0dy1vdmVyZmxvdy1oaWRkZW4gdHctcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICBkYXRhLWEtdGFyZ2V0PVwiYXVkaW8tb25seS1idXR0b25cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiQXVkaW8gb25seVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctZmxleCB0dy1mbGV4LWdyb3ctMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3LWJ1dHRvbi1pY29uX19pY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWljb24tZGl2XCIgc3R5bGU9XCJ3aWR0aDogMnJlbTsgaGVpZ2h0OiAycmVtO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gR29vZ2xlIE1hdGVyaWFsIERlc2lnbiBSYWRpbyBJY29uLiBBcGFjaGUgTGljZW5zZSB2Mi4wIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJ0dy1pY29uX19zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zLjI0IDYuMTVDMi41MSA2LjQzIDIgNy4xNyAyIDh2MTJjMCAxLjEuODkgMiAyIDJoMTZjMS4xMSAwIDItLjkgMi0yVjhjMC0xLjExLS44OS0yLTItMkg4LjNsOC4yNi0zLjM0TDE1Ljg4IDEgMy4yNCA2LjE1ek03IDIwYy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3ptMTMtOGgtMnYtMmgtMnYySDRWOGgxNnY0elwiLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxkaXYgY2xhc3M9XCJ0dy10b29sdGlwIHR3LXRvb2x0aXAtLWFsaWduLWxlZnQgdHctdG9vbHRpcC0tdXBcIiBkYXRhLWEtdGFyZ2V0PVwidHctdG9vbHRpcC1sYWJlbFwiIHJvbGU9XCJ0b29sdGlwXCI+XHJcbiAgICAgICAgUmFkaW8gbW9kZVxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG4gICBcclxuXHJcbmNvbnN0IHZpZGVvUGxheWVyQ2xhc3MgPSBcInZpZGVvLXBsYXllclwiO1xyXG5jb25zdCB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzID0gXCJ2aWRlby1wbGF5ZXItcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHZpZGVvUGxheWVySWRQcmVmaXggPSB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzICsgXCItXCI7XHJcbmNvbnN0IGNvbnRyb2xHcm91cENsYXNzID0gXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBQcm9jZXNzZWRDbGFzcyA9IFwiY29udHJvbC1ncm91cC1wcm9jZXNzZWRcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCByYWRpb0J1dHRvblBhdXNlZENsYXNzID0gXCJhdWRpby1vbmx5LWJ1dHRvbi1wYXVzZWRcIjtcclxuY29uc3QgcmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MgPSBcImF1ZGlvLW9ubHktYnV0dG9uLXBsYXlpbmdcIjtcclxuY29uc3QgcmFkaW9CdXR0b25EaXNhYmxlZENsYXNzID0gXCJhdWRpby1vbmx5LWJ1dHRvbi1kaXNhYmxlZFwiO1xyXG5cclxuY29uc3QgYXR0ck9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBzdWJ0cmVlOiBmYWxzZSB9O1xyXG5jb25zdCBkb21PYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogZmFsc2UsIGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgVmlkZW9QbGF5ZXJDb250YWluZXIsIGFkZCBNdXRhdGlvbk9ic2VydmVyIHRvIFxyXG4gKiAxLiBkb2N1bWVudC5ib2R5IGNoZWNrcyBmb3Igb25lIHN1YnRyZWUgY2hhbmdlXHJcbiAqICAgMS0yLiBJZiBkaXYgd2l0aCBjbGFzcyBcInZpZGVvLXBsYXllclwiLCBwcm9jZXNzIGl0LiBDaGVjayAjMlxyXG4gKiBcclxuICogMi4gQ3JlYXRlIFZpZGVvUGxheWVyLCB2aWRlby1wbGF5ZXIgY2xhc3MgZGl2IGNoZWNrcyBmb3IgMSBhdHRyaWJ1dGUgY2hhbmdlLCAzIHN1YnRyZWUgY2hhbmdlc1xyXG4gKiAgIDItMS4gYXR0cmlidXRlIFwiZGF0YS1hLXBsYXllci10eXBlXCI6IFwic2l0ZVwiLCBcInNpdGVfbWluaVwiLCBcImNsaXBzLXdhdGNoXCJcclxuICogICAgIDItMi0yLiBDaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgaWYgbmVjZXNzYXJ5XHJcbiAqICAgICAyLTItMy4gTW9kZTogVHVwbGUgb2YgKGxheW91dCwgdmlkZW9fdHlwZSkuXHJcbiAqICAgICAgIDItMi0zLTEuIGxheW91dDogXCJzaXRlXCIgfCBcInNpdGVfbWluaVwiXHJcbiAqICAgICAgIDItMi0zLTIuIHZpZGVvX3R5cGU6IFwibGl2ZVwiLCBcInZvZFwiLCBcImNsaXBcIi4uIGFuZCBtb3JlPz8/Pz9cclxuICogICAyLTIuIHN1YnRyZWUgZGl2IHdpdGggY2xhc3MgXCJ2b2Qtc2Vla2Jhci10aW1lLWxhYmVsc1wiIGFuZCBcInNlZWtiYXItaW50ZXJhY3Rpb24tYXJlYVwiXHJcbiAqICAgICAyLTItMS4gVGhpcyBvbmx5IGFwcGVhcnMgaW4gVk9EIHdhdGNoXHJcbiAqICAgICAyLTItMi4gSWYgY3JlYXRlZCwgY2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIHRvIFZPRFxyXG4gKiAgICAgMi0yLTMuIElmIHJlbW92ZWQgKGNoYW5nZWQgZnJvbSBWT0QgdG8gbGl2ZS9jbGlwKSwgPz8/P1xyXG4gKiAgIDItMy4gY2hlY2sgZm9yIGNvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiXHJcbiAqICAgICAyLTMtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzMgZm9yIGFjdGlvbnNcclxuICogICAgIDItMy0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiAgIDItNC4gY2hlY2sgZm9yIFwidmlkZW9cIiBlbGVtZW50IGluIHRoZSBwbGF5ZXJcclxuICogICAgIDItNC0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNiBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi00LTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqIFxyXG4gKiAzLiBDb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIiBjaGVja3MgZm9yIFxyXG4gKiAgIDMtMS4gc3VidHJlZSBidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLXBsYXktcGF1c2UtYnV0dG9uJ10gZm9yIHZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uXHJcbiAqICAgICAzLTEtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzRcclxuICogICAgIDMtMS0yLiBJZiByZW1vdmVkICh3aGVuIHBsYXllciB0eXBlIGNoYW5nZWQgZnJvbSBcInNpdGVcIiB0byBcInNpdGVfbWluaVwiLCBldGMpLCA/Pz8/P1xyXG4gKiAgIDMtMi4gc3VidHJlZSBpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddIGZvciB2b2x1bWUgc2xpZGVyXHJcbiAqICAgICAzLTItMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzVcclxuICogICAgIDMtMi0yLiBJZiByZW1vdmVkICh3aGVuIHBsYXllciB0eXBlIGNoYW5nZWQgZnJvbSBcInNpdGVcIiB0byBcInNpdGVfbWluaVwiLCBldGMpLCA/Pz8/P1xyXG4gKiAgIDMtMy4gSWYgYm90aCBjb21wb25lbnRzIGluIDMtMSBhbmQgMy0yIGFyZSByZWFkeTpcclxuICogICAgIDMtMy0xLiBDcmVhdGUgcmFkaW8gbW9kZSBidXR0b24sIGFuZCBwdXQgTXV0YXRpb25PYnNlcnZlciAoc2VlICM0IGFuZCAjNSlcclxuICogICAgIDMtMy0yLiBJZiBhdCBsZWFzdCBvbmUgY29tcG9uZW50IGlzIHJlbW92ZWQgKHNpdGUtPnNpdGVfbWluaSBjaGFuZ2UsIGV0YylcclxuICogICAgICAgMy0zLTItMS4gYWxzbyByZW1vdmUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGZyb20gRE9NXHJcbiAqIFxyXG4gKiA0LiBWaWRlbyBwbGF5L3BhdXNlIGJ1dHRvbiBjaGVja3MgZm9yXHJcbiAqICAgNC0xLiBBdHRyaWJ1dGUgY2hhbmdlIFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiOiBcInBsYXlpbmdcIiBvciBcInBhdXNlZFwiXHJcbiAqICAgICA0LTEtMS4gSWYgYXR0cmlidXRlIHZhbHVlIGNoYW5nZWQgdG8gXCJwbGF5aW5nXCIsIHN0b3AgYWxsIGF1ZGlvIGluIHRoZSBWaWRlb1BsYXllckNvbnRhaW5lclxyXG4gKiBcclxuICogNS4gVm9sdW1lIHNsaWRlciBjaGVja3MgZm9yXHJcbiAqICAgNS0xLiBBdHRyaWJ1dGUgXCJ2YWx1ZVwiIGNoYW5nZTogbnVtYmVyIGJldHdlZW4gMCA8PSBudW0gPD0gMVxyXG4gKiAgICAgNS0xLTEuIElmIGNoYW5nZSBpcyBkZXRlY3RlZCwgYXBwbHkgdGhlIG5ldyB2b2x1bWUgdG8gYXVkaW9FbGVtLlxyXG4gKiBcclxuICogNi4gb3JpZ2luYWwgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdmlkZW8tcGxheWVyIGNoZWNrcyBmb3JcclxuICogICA2LTEuIEF0dHJpYnV0ZSBcInNyY1wiIGNoYW5nZTogbWVhbnMgdGhhdCB0aGUgdmlkZW8gc291cmNlIGNoYW5nZWQgKGxpa2VseSBob3N0aW5nIGFub3RoZXIgc3RyZWFtZXIpXHJcbiAqICAgICA2LTEtMS4gUmFkaW8gbW9kZSBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkPyBSZS1jb25maWd1cmVkIHdpdGggdGhlIG5ldyBzdHJlYW1lcidzIFVSTD9cclxuICogICAgXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEhvdyB0byBkZXRlY3QgdGhlIGNoYW5uZWwgb2YgdGhlIHN0cmVhbSBiZWluZyBwbGF5ZWQ/XHJcbiAqIEdldHRpbmcgY2hhbm5lbCBuYW1lIGZyb20gVVJMIGhhcyB0aGUgZm9sbGxvd2luZyBpc3N1ZXNcclxuICogKDEpIFN0cmVhbWVyIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsXHJcbiAqICgyKSBNYWluIHBhZ2UuIENoYW5uZWwgY2FuIGNoYW5nZSBxdWlja2x5IGluIHRoZSBjYXJvdXNlbFxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBLZWVwIHRoZSBsYXN0IHJlcXVlc3RlZCB1c2hlciBVUkwgaW4gdGhlIHRhYi4gR3Vlc3MgdGhlIGNoYW5uZWwgZnJvbSB0aGVyZVxyXG4gKiAoMikgRm9yIFwic2l0ZV9taW5pXCIgc3RhdGUsIHN0b3JlIHRoZSBjaGFubmVsIG5hbWUgaW4gdmlkZW8gcGxheWVyLlxyXG4gKiAgICAgSW4gdGhhdCBjYXNlLCBpdCB3aWxsIGJlIHBvc3NpYmxlIHRvIHJlc3VtZSBwbGF5aW5nIGluIHRoZSByaWdodCBjaGFubmVsLlxyXG4gKiAoMykgRGlzYWJsZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gaW4gdGhlIG1haW4gcGFnZVxyXG4gKiBcclxuICovXHJcblxyXG4vKipcclxuICogQWRkIHJhZGlvIG1vZGUgYnV0dG9uIGluIHNpdGVfbWluaT9cclxuICogRG9uJ3Qgc3RvcmUgdGhlIHBsYXlzdGF0ZSBpbiBET006IG9ubHkgc3RvcmUgaXQgaW4gVmlkZW9QbGF5ZXIgY2xhc3MgYXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcclxuICovXHJcblxyXG4vKipcclxuICogRVNwb3J0cyBwYWdlOiB2aWRlbyBtaW5pcGxheWVyIGtlZXBzIHBsYXlpbmcgZXZlbiB3aGVuIHRoZSBzaXRlIHBsYXllciBpbiBFc3BvcnRzIHBhZ2UgaXMgYWxzbyBiZWluZyBwbGF5ZWQuXHJcbiAqIFNob3VsZCB0aGUgcmFkaW8gbW9kZSBmb2xsb3cgdGhlIHNhbWUgYmVoYXZpb3I/XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFjY2VzcyB0b2tlbiB1cmwgaGFzIG9hdXRoIGNvZGUsIHdoaWNoIGlzIHVuZGVmaW5lZCBpZiB0aGUgdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKiBOb3Qgc3VyZSBob3cgVHdpdGNoIHJldHVybnMgY29ycmVjdCByZXNwb25zZSBmb3IgYW5vbnltb3VzIHVzZXIgeWV0LlxyXG4gKiBDYWxsaW5nIHRoZSBzYW1lIGFjY2VzcyB0b2tlbiBVUkwgZnJvbSBjb250ZW50c2NyaXB0IHJldHVybnMgZXJyb3IuXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIERpc2FibGUgdGhlIGJ1dHRvbiB3aGVuIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICovXHJcblxyXG5cclxuY29uc3QgZW51bSBQbGF5aW5nU3RhdGUge1xyXG4gICAgRElTQUJMRUQsXHJcbiAgICBQQVVTRUQsXHJcbiAgICBQTEFZSU5HLFxyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udHJvbEdyb3VwIHtcclxuICAgIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWVyOiBWaWRlb1BsYXllcjtcclxuICAgIHBsYXlCdXR0b25FbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICByYWRpb0J1dHRvbjogSFRNTEVsZW1lbnQ7XHJcbiAgICBjb21wb25lbnRzT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBwbGF5QnV0dG9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICB2b2x1bWVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjsgXHJcblxyXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBWaWRlb1BsYXllciwgY29udHJvbEdyb3VwRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0gPSBjb250cm9sR3JvdXBFbGVtO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdDb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNPYnNlcnZlci5vYnNlcnZlKHRoaXMuY29udHJvbEdyb3VwRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvLyBDaGVjayBmb3IgbmV3IFBsYXkvQXVkaW8gYnV0dG9uIGFuZCB2b2x1bWUgc2xpZGVyIFxyXG4gICAgICAgIGNvbnN0IHBsYXlCdXR0b25FbGVtOiBIVE1MQnV0dG9uRWxlbWVudCA9IHRoaXMuY29udHJvbEdyb3VwRWxlbS5xdWVyeVNlbGVjdG9yKHBsYXlCdXR0b25BdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW0pO1xyXG4gICAgICAgIGNvbnN0IHZvbHVtZVNsaWRlckVsZW06IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3Rvcih2b2x1bWVTbGlkZXJBdHRyKTtcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtKTtcclxuICAgICAgICAvLyBBZGQgdGhlIHJhZGlvIGJ1dHRvbiBpZiBub3QgZXhpc3RzXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdQbGF5QnV0dG9uRWxlbShwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAvLyBwbGF5IGJ1dHRvbiBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCFwbGF5QnV0dG9uRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHBsYXlCdXR0b25FbGVtLmNsYXNzTGlzdDtcclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy5wbGF5QnV0dG9uRWxlbS4gSWdub3JlLlxyXG4gICAgICAgIGlmKGNsYXNzZXMuY29udGFpbnMoXCJwbGF5LXBhdXNlLWJ1dHRvbi1wcm9jZXNzZWRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc2VzLmFkZChcInBsYXktcGF1c2UtYnV0dG9uLXByb2Nlc3NlZFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMucGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW07XHJcbiAgICAgICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnMgaWYgYSB2aWRlbyBzdGFydHMgdG8gcGxheS5cclxuICAgICAgICAvLyBUaGlzIGlzIG5lY2VzYXNyeSBmb3IgYSBjYXNlIHdoZW4gdXNlciBicm93c2VzIHRvIGEgbm9uLWNoYW5uZWwgcGFnZSAoZS5nLiBtYWluLCBlc3BvcnRzKVxyXG4gICAgICAgIC8vIHdoaWNoIGF1dG9tYXRpY2FsbHkgcGxheXMgYSB2aWRlby5cclxuICAgICAgICB0aGlzLnBhdXNlQXVkaW9Gb3JWaWRlbygpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXlCdXR0b25FbGVtLCBhdHRyT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlQXVkaW9Gb3JWaWRlbygpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiKTtcclxuICAgICAgICBpZihzdGF0ZSA9PSBcInBsYXlpbmdcIikgeyAgLy8gVmlkZW8gc3RhdGUgZnJvbSBwYXVzZWQgdG8gcGxheWluZ1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5wYXVzZUFsbCgpOyAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllciBpbnN0YW5jZXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0Vm9sdW1lKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheWVyLmF1ZGlvRWxlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB2b2x1bWUgPSB0aGlzLnZvbHVtZVNsaWRlckVsZW0udmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmF1ZGlvRWxlbS52b2x1bWUgPSBwYXJzZUZsb2F0KHZvbHVtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nVm9sdW1lc2xpZGVyRWxlbSh2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gdm9sdW1lIHNsaWRlciBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIGNvbnRyb2wgZ3JvdXAuIFJlbW92ZSByZWZlcmVuY2UgdG8gdGhlIGRlbGV0ZWQgbm9kZVxyXG4gICAgICAgIGlmKCF2b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHZvbHVtZVNsaWRlckVsZW0uY2xhc3NMaXN0O1xyXG4gICAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgYWxyZWFkeSBhZGRlZCB0byB0aGlzLnZvbHVtZVNsaWRlckVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihjbGFzc2VzLmNvbnRhaW5zKFwidm9sdW1lLXNsaWRlci1wcm9jZXNzZWRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc2VzLmFkZChcInZvbHVtZS1zbGlkZXItcHJvY2Vzc2VkXCIpO1xyXG5cclxuICAgICAgICAvLyBJZiBleGlzdHMsIHJlbW92ZSB0aGUgZXhpc3Rpbmcgb25lXHJcbiAgICAgICAgaWYodGhpcy52b2x1bWVTbGlkZXJFbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJFbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IHZvbHVtZVNsaWRlckVsZW07XHJcbiAgICAgICAgLy8gTXV0YXRpb25PYnNlcnZlciB0byB2b2x1bWVTbGlkZXJcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5hZGp1c3RWb2x1bWUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlci5vYnNlcnZlKHRoaXMudm9sdW1lU2xpZGVyRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1JhZGlvQnV0dG9uKCkge1xyXG4gICAgICAgIC8vIERvbid0IHByb2NlZWQgaWYgYm90aCBwbGF5QnV0dG9uRWxlbSBhbmQgdm9sdW1lU2xpZGVyRWxlbSBhcmUgYXZhaWxhYmxlXHJcbiAgICAgICAgaWYoIXRoaXMucGxheUJ1dHRvbkVsZW0gfHwgIXRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgYnV0dG9uIHdhcyBhbHJlYWR5IGNyZWF0ZWQsIGRvIG5vdGhpbmdcclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGlmKGNsYXNzZXM/LmNvbnRhaW5zKFwicmFkaW8tYnV0dG9uLXByb2Nlc3NlZFwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBVc2Ugd2VicGFjayBodG1sIGxvYWRlclxyXG4gICAgICAgIC8vIFRPRE86IERpc2FibGUgdGhlIGJ1dHRvbiBpbiBjbGlwIGFuZCAoYWxzbyBWT0Q/KVxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICAgICAgYnV0dG9uV3JhcHBlckRvbS5pbm5lckhUTUwgPSBpbml0aWFsQnV0dG9uRG9tO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbiA9IGJ1dHRvbldyYXBwZXJEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwicmFkaW8tYnV0dG9uLXByb2Nlc3NlZFwiKTtcclxuICAgICAgICBsZXQgc3RhdGVDbGFzcyA9IHJhZGlvQnV0dG9uRGlzYWJsZWRDbGFzcztcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5ZXIucGxheWluZ1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgc3RhdGVDbGFzcyA9IHJhZGlvQnV0dG9uRGlzYWJsZWRDbGFzcztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QQVVTRUQ6XHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNsYXNzID0gcmFkaW9CdXR0b25QYXVzZWRDbGFzcztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QTEFZSU5HOlxyXG4gICAgICAgICAgICAgICAgc3RhdGVDbGFzcyA9IHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24uY2xhc3NMaXN0LmFkZChzdGF0ZUNsYXNzKTtcclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLm9uY2xpY2sgPSB0aGlzLnBsYXllci5vblJhZGlvQnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMucGxheWVyKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cEVsZW0uYXBwZW5kQ2hpbGQoYnV0dG9uV3JhcHBlckRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRm9yUGxheSgpIHtcclxuICAgICAgICAvLyBOT1RFOiBUaGVyZSBpcyAxfjMgc2Vjb25kcyBvZiBkZWxheSBiZXR3ZWVuIGF1ZGlvLW9ubHkgYnV0dG9uIGNsaWNrIGFuZCBzb3VuZCBiZWluZyBwbGF5ZWQuXHJcbiAgICAgICAgLy8gSXQncyBiZXR0ZXIgdG8gc2hvdyBzb21lIGludGVybWVkaWF0ZSBzdGF0ZSAoaWNvbiBjaGFuZ2UsIG1vdXNlIGN1cnNvciBjaGFuZ2UsIGV0YykgaW4gdGhlIG1lYW53aGlsZVxyXG5cclxuICAgICAgICAvLyBTdG9wIHRoZSB2aWRlbyBpZiBwbGF5aW5nXHJcbiAgICAgICAgY29uc3QgdmlkZW9TdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0/LmdldEF0dHJpYnV0ZShcImRhdGEtYS1wbGF5ZXItc3RhdGVcIik7XHJcbiAgICAgICAgaWYodmlkZW9TdGF0ZSA9PSBcInBsYXlpbmdcIikge1xyXG4gICAgICAgICAgICAvLyBJcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gcGF1c2UgdmlkZW8gdGhhbiB0aGlzIFwiY2xpY2tcIiBoYWNrP1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlCdXR0b25FbGVtLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvblBhdXNlZENsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5hZGQocmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MpO1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBhdXNlKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGNsYXNzZXM/LmFkZChyYWRpb0J1dHRvblBhdXNlZENsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MpO1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvckRpc2FibGVkKCkge1xyXG4gICAgICAgIC8vIENoYW5nZSB0aGUgcmFkaW8gYnV0dG9uIGljb25cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5yYWRpb0J1dHRvbj8uY2xhc3NMaXN0O1xyXG4gICAgICAgIGNsYXNzZXM/LnJlbW92ZShyYWRpb0J1dHRvblBhdXNlZENsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MpO1xyXG4gICAgICAgIGNsYXNzZXM/LmFkZChyYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFZpZGVvUGxheWVyIHtcclxuICAgIHBsYXllcklkOiBzdHJpbmc7XHJcbiAgICBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyO1xyXG4gICAgcGxheWVyRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwbGF5aW5nU3RhdGU6IFBsYXlpbmdTdGF0ZTtcclxuICAgIGF0dHJpYnV0ZU9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgY29udHJvbEdyb3VwOiBDb250cm9sR3JvdXA7XHJcbiAgICBjb250cm9sR3JvdXBPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGhsczogSGxzO1xyXG4gICAgYXVkaW9FbGVtOiBIVE1MVmlkZW9FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcklkOiBzdHJpbmcsIGNvbnRhaW5lcjogVmlkZW9QbGF5ZXJDb250YWluZXIsIHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbSA9IHBsYXllckVsZW07XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG5cclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudHJ5VXBkYXRpbmdDb250cm9sR3JvdXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udHJvbHNQZXJMaXZlbmVzcygpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgY29udHJvbCBncm91cCBET00gaXMgcmVhZHlcclxuICAgICAgICBjb25zdCBjb250cm9sR3JvdXBFbGVtID0gdGhpcy5wbGF5ZXJFbGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY29udHJvbEdyb3VwQ2xhc3MpPy5bMF07XHJcbiAgICAgICAgaWYoIWNvbnRyb2xHcm91cEVsZW0pIHsgIC8vIGNvbnRyb2wgZ3JvdXAgY2Fubm90IGJlIGZvdW5kIGluIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpOyAgLy8gZGVzdHJveSByZWZlcmVuY2UgdG8gdGhlIHJlbW92ZWQgRE9NXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIHByb2Nlc3NlZCBjbGFzcyBuYW1lIHRvIHByZXZlbnQgZHVwbGljYXRlIHByb2Nlc3Npbmcgb2YgdGhpcyBlbGVtZW50XHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IGNvbnRyb2xHcm91cEVsZW0uY2xhc3NMaXN0O1xyXG4gICAgICAgIGlmKGNsYXNzZXMuY29udGFpbnMoY29udHJvbEdyb3VwUHJvY2Vzc2VkQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoY29udHJvbEdyb3VwUHJvY2Vzc2VkQ2xhc3MpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwID0gbmV3IENvbnRyb2xHcm91cCh0aGlzLCBjb250cm9sR3JvdXBFbGVtIGFzIEhUTUxFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5KG1lZGlhVXJsOiBzdHJpbmcpIHtcclxuICAgICAgICBpZighbWVkaWFVcmwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIk5vIG1lZGlhVXJsIGlzIGZvdW5kIHRvIHBsYXlcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hdWRpb0VsZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIkF1ZGlvIGVsZW1lbnQgYWxyZWFkeSBleGlzdHNcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHNlcGFyYXRlIDx2aWRlbz4gZWxlbWVudCB0byBwbGF5IGF1ZGlvLlxyXG4gICAgICAgIC8vIDxhdWRpbz4gY2FuIGJlIGFsc28gdXNlZCBieSBobHMuanMsIGJ1dCBUeXBlc2NyaXB0IGZvcmNlcyB0aGlzIHRvIGJlIEhUTUxWaWRlb0VsZW1lbnQuXHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5hZGp1c3RWb2x1bWUoKTsgIC8vIE1hdGNoIHRoZSBpbml0aWFsIHZvbHVtZSB3aXRoIHRoZSBzbGlkZXIgdmFsdWUuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICB0aGlzLmhscyA9IG5ldyBIbHMoe1xyXG4gICAgICAgICAgICAvL2RlYnVnOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXZlU3luY0R1cmF0aW9uOiAwLFxyXG4gICAgICAgICAgICBsaXZlTWF4TGF0ZW5jeUR1cmF0aW9uOiA1LFxyXG4gICAgICAgICAgICBsaXZlRHVyYXRpb25JbmZpbml0eTogdHJ1ZSAgLy8gdHJ1ZSBmb3IgbGl2ZSBzdHJlYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5sb2FkU291cmNlKG1lZGlhVXJsKTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLmF1ZGlvRWxlbSk7IFxyXG4gICAgICAgIC8vIFRPRE86IElzIHRoaXMgc2FmZSB0byBwbGF5IHJpZ2h0IGF3YXkgYWZ0ZXIgYXR0YWNoaW5nIHRoZSBtZWRpYT9cclxuICAgICAgICAvLyBUaGUgbWFpbiBleGFtcGxlIGF0IGhscy5qcyB3ZWJzaXRlIHRlbGxzIHRvIHVzZSBNQU5JRkVTVF9QQVJTRUQgZXZlbnQsXHJcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiB0aGUgZXZlbnQgaXMgbm90IHRyaWdnZXJlZCB3aXRoIHR5cGVzY3JpcHQrd2VicGFjay5cclxuICAgICAgICBjb25zdCBhdWRpb1BsYXlDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXkgc3RhcnRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGxheSgpLnRoZW4oYXVkaW9QbGF5Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIGlmKHRoaXMuaGxzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvRWxlbS5wYXVzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gXCJET01FeGNlcHRpb246IFRoZSBwbGF5KCkgcmVxdWVzdCB3YXMgaW50ZXJydXB0ZWQgYnkgYSBjYWxsIHRvIHBhdXNlKClcIlxyXG4gICAgICAgICAgICAgICAgLy8gaXMgdGhyb3duIHdoZW4gdXNlciBwYXVzZXMgdGhlIGF1ZGlvIHRvbyBxdWlja2x5IGFmdGVyIHBsYXlpbmcuXHJcbiAgICAgICAgICAgICAgICAvLyBObyBhY3Rpb24gaXMgbmVlZGVkLiBUaGUgYXVkaW8gd2lsbCBiZSBwYXVzZWQgY29ycmVjdGx5IGFueXdheS5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhscy5zdG9wTG9hZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmhscy5kZXRhY2hNZWRpYSgpO1xyXG4gICAgICAgICAgICB0aGlzLmhscy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIC8vIFRoZXJlIHNlZW1zIHRvIGJlIGEgYnVnIHRoYXQgdGhlIEhMUyBvYmplY3QgZ2V0cyBzdHVjayBhZnRlciBtdWx0aXBsZSBwbGF5cyBhbmQgcGF1c2VzXHJcbiAgICAgICAgICAgIC8vIGlmIGl0IGlzIHJlLXVzZWQgZm9yIHRoZSBuZXh0IHBsYXkuIE5lZWQgdG8gZGVzdHJveSB0aGUgb2JqZWN0IGFuZCByZS1jcmVhdGUgaXQuXHJcbiAgICAgICAgICAgIHRoaXMuaGxzID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbGVtLnJlbW92ZUNoaWxkKHRoaXMuYXVkaW9FbGVtKTtcclxuICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QQVVTRUQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGF1c2UgYXVkaW8gaW4gYWxsIHBsYXllcnNcclxuICAgIHBhdXNlQWxsKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaGF0IGVsc2UgdG8gZG8gaGVyZT9cclxuICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0UGxheSgpIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZUNhbGxiYWNrID0gYXN5bmMgZnVuY3Rpb24ocmVzcG9uc2U6IEdldFVybHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwicmVzcG9uc2UgZm9yIGdldF9hdWRpb191cmwgcmVjZWl2ZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgaWYoIXJlc3BvbnNlPy53ZWJVcmw/LmNoYW5uZWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlsaXN0ID0gYXdhaXQgdHJ5RmV0Y2hpbmdQbGF5bGlzdChyZXNwb25zZS53ZWJVcmwpO1xyXG4gICAgICAgICAgICBpZighcGxheWxpc3QpIHtcclxuICAgICAgICAgICAgICAgIHBsYXlsaXN0ID0gYXdhaXQgdHJ5RmV0Y2hpbmdQbGF5bGlzdChyZXNwb25zZS5sYXN0UmVxdWVzdGVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBhdWRpb1N0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKHBsYXlsaXN0KTtcclxuICAgICAgICAgICAgaWYoYXVkaW9TdHJlYW1VcmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KGF1ZGlvU3RyZWFtVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiZ2V0X2F1ZGlvX3VybFwiLCBjaGFubmVsOiBjaGFubmVsfSwgcmVzcG9uc2VDYWxsYmFjay5iaW5kKHRoaXMpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ29udHJvbHNQZXJMaXZlbmVzcygpIHtcclxuICAgICAgICAvLyBJZiB3YXRjaGluZyBhIGxpdmUgc3RyZWFtLCBlbmFibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gSWYgd2F0Y2hpbmcgVk9EIG9mIGNsaXAsIGRpc2FibGUgdGhlIGNvbnRyb2wgZ3JvdXAuXHJcbiAgICAgICAgLy8gRm9yIG5vdywgdGhlIGxvZ2ljIGZvciBjaGVja2luZyBsaXZlL3JlY29yZGVkIHZpZGVvIGlzIGV4aXN0ZW5jZSBvZiB0aW1lIHNlZWtiYXIuXHJcbiAgICAgICAgY29uc3Qgc2Vla2JhciA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2Vla2Jhci1pbnRlcmFjdGlvbi1hcmVhXCIpPy5bMF07XHJcblxyXG4gICAgICAgIC8vIFdoZW4gc2Vla2JhciBkaXNhcHBlYXJlZCBhbmQgdGhlIGJ1dHRvbiBpcyBzdGlsbCBkaXNhYmxlZC5cclxuICAgICAgICBpZighc2Vla2JhciAmJiB0aGlzLnBsYXlpbmdTdGF0ZSA9PSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8udXBkYXRlRm9yUGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gV2hlbiBzZWVrYmFyIGFwcGVhcmVkIGFuZCB0aGUgcmFkaW8gYnV0dG9uIGlzIG5vdCBkaXNhYmxlZCB5ZXQuXHJcbiAgICAgICAgZWxzZSBpZihzZWVrYmFyICYmIHRoaXMucGxheWluZ1N0YXRlICE9IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvckRpc2FibGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUmFkaW9CdXR0b25DbGlja2VkKCkge1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnBsYXlpbmdTdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QQVVTRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RQbGF5KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUExBWUlORzpcclxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBWaWRlb1BsYXllckNvbnRhaW5lciB7XHJcbiAgICBwbGF5ZXJzOiBWaWRlb1BsYXllcltdO1xyXG4gICAgbmV4dElkOiBudW1iZXI7XHJcbiAgICBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLm5leHRJZCA9IDEwMDAxOyAgLy8gUmFuZG9tIHN0YXJ0IGluZGV4IGZvciBwbGF5ZXIuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIC8vIEZpbmQgZXhpc3RpbmcgdmlkZW8gcGxheWVyIGVsZW1lbnRzIHRvIGNyZWF0ZSBWaWRlb1BsYXllciBvYmplY3RzXHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWRlb1BsYXllckxpc3QoKTtcclxuICAgICAgICAvLyBEZXRlY3QgZnV0dXJlIHZpZGVvIHBsYXllciBlbGVtZW50c1xyXG4gICAgICAgIGNvbnN0IG1haW5FbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJtYWluXCIpWzBdO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnVwZGF0ZVZpZGVvUGxheWVyTGlzdC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUobWFpbkVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWaWRlb1BsYXllckxpc3QoKSB7XHJcbiAgICAgICAgLy8gVE9ETzogSXMgaXQgYmV0dGVyIHRvIGl0ZXJhdGUgb25seSB0aGUgbXV0YXRlZCBkaXZzP1xyXG4gICAgICAgIGNvbnN0IHBsYXllckVsZW1zID0gZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHZpZGVvUGxheWVyQ2xhc3MpO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGl2IGlzIG5vdCBhbHJlYWR5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBpZighcGxheWVyRWxlbS5jbGFzc0xpc3QuY29udGFpbnModmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJOZXcgdmlkZW8gcGxheWVyIGRldGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gcHJvY2VlZCBpZiB0aGVyZSBhcmUgdGhlIHNhbWUgbnVtYmVyIG9mIHBsYXllcnMgaW4gdGhlIGxpc3QgYW5kIGluIERPTS5cclxuICAgICAgICBpZihwbGF5ZXJFbGVtcy5sZW5ndGggPT0gdGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRlc3Ryb3lOb25leGlzdGluZ1BsYXllcnMocGxheWVyRWxlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3lOb25leGlzdGluZ1BsYXllcnMocGxheWVyRWxlbXM6IEhUTUxDb2xsZWN0aW9uT2Y8RWxlbWVudD4pIHtcclxuICAgICAgICAvLyBSZW1vdmUgdmlkZW8gcGxheWVycyBub3QgaW4gRE9NIGFueW1vcmVcclxuICAgICAgICBjb25zdCBhbGxQbGF5ZXJJZHNJbkRvbTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IHBsYXllckVsZW0uY2xhc3NMaXN0O1xyXG4gICAgICAgICAgICBmb3IobGV0IGNsYXNzTmFtZSBvZiBjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICBpZihjbGFzc05hbWUuc3RhcnRzV2l0aCh2aWRlb1BsYXllcklkUHJlZml4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbFBsYXllcklkc0luRG9tLnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiQWxsIHBsYXllcklkcyBpbiBET006IFwiICsgYWxsUGxheWVySWRzSW5Eb20pO1xyXG4gICAgICAgIGNvbnN0IG5ld2xpc3QgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBwbGF5ZXIucGxheWVySWQ7XHJcbiAgICAgICAgICAgIGlmKGFsbFBsYXllcklkc0luRG9tLmluZGV4T2YocGxheWVySWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdsaXN0LnB1c2gocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYFBsYXllciAke3BsYXllcklkfSBpcyBub3QgaW4gRE9NIGFueW1vcmUuIERlbGV0aW5nLi5gKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gbmV3bGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBpZihwbGF5ZXJFbGVtLmNsYXNzTGlzdC5jb250YWlucyh2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdQbGF5ZXJJZCA9IHZpZGVvUGxheWVySWRQcmVmaXggKyB0aGlzLm5leHRJZDtcclxuICAgICAgICB0aGlzLm5leHRJZCArPSAxO1xyXG4gICAgICAgIHBsYXllckVsZW0uY2xhc3NMaXN0LmFkZCh2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzKTtcclxuICAgICAgICBwbGF5ZXJFbGVtLmNsYXNzTGlzdC5hZGQobmV3UGxheWVySWQpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIobmV3UGxheWVySWQsIHRoaXMsIHBsYXllckVsZW0pO1xyXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VFeGNlcHQocGxheWVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIucGxheWVySWQgIT0gcGxheWVySWQpIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyAgLy8gV2lsbCB0aGlzIGZ1bmN0aW9uIGV2ZXIgYmUgdXNlZD9cclxuICAgICAgICB0aGlzLm9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJcclxuaW1wb3J0IHsgVmlkZW9QbGF5ZXJDb250YWluZXIgfSBmcm9tIFwiLi92aWRlb19wbGF5ZXJfY29udGFpbmVyXCI7XHJcblxyXG5cclxudmFyIGNvbnRhaW5lciA9IG5ldyBWaWRlb1BsYXllckNvbnRhaW5lcigpO1xyXG5jb250YWluZXIucnVuKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=