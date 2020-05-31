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
        this.findVideoPlayerElems();
        // Detect future video player elements
        this.observer = new MutationObserver(this.findVideoPlayerElems.bind(this));
        this.observer.observe(document.body, domObserverConfig);
    }
    findVideoPlayerElems() {
        // TODO: Is it better to iterate only the mutated divs?
        const playerElems = document.body.getElementsByClassName(videoPlayerClass);
        for (let playerElem of playerElems) {
            // If the div is not already processed
            if (!playerElem.classList.contains(videoPlayerProcessedClass)) {
                console.debug("New video player detected");
                this.createNewPlayer(playerElem);
            }
        }
    }
    createNewPlayer(playerElem) {
        if (playerElem.classList.contains(videoPlayerProcessedClass)) {
            return;
        }
        const newPlayerId = videoPlayerProcessedClass + "-" + this.nextId;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFeEUsTUFBTSxTQUFTLEdBQVksNkJBQTZCLENBQUM7QUFDekQsTUFBTSxXQUFXLEdB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SUFBSSxDQUFDLENBQUM7UUFDakIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNwRCxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGtDQUFXLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsV0FBVyxDQUFDLFFBQWdCO1FBQ3hCLEtBQUksSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixJQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksUUFBUTtnQkFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbEQ7SUFDTCxDQUFDO0lBRUQsT0FBTzs7UUFDSCxVQUFJLENBQUMsUUFBUSwwQ0FBRSxVQUFVLEdBQUc7UUFDNUIsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7Q0FDSjs7O0FDemhCK0Q7QUFHaEUsSUFBSSxTQUFTLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0FBQzNDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwiXHJcbmNvbnN0IHR3aXRjaERvbWFpbiA6IHN0cmluZyA9IFwidHdpdGNoLnR2L1wiO1xyXG4vLyBOb24tZXhodWFzdGl2ZSBsaXN0IG9mIG5vbi1jaGFubmVsIHJvdXRlcyBpbiB0d2l0Y2gudHZcclxuY29uc3Qgbm9uQ2hhbm5lbHMgOiBzdHJpbmdbXSA9IFtcImRpcmVjdG9yeVwiLCBcInZpZGVvc1wiLCBcInVcIiwgXCJzZXR0aW5nc1wiXTtcclxuXHJcbmNvbnN0IGFwaURvbWFpbiA6IHN0cmluZyA9IFwiYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvXCI7XHJcbmNvbnN0IGFjY2Vzc1Rva2VuIDogc3RyaW5nID0gXCIvYWNjZXNzX3Rva2VuXCI7XHJcblxyXG5jb25zdCB1c2hlckRvbWFpbiA6IHN0cmluZyA9IFwidXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy9cIjtcclxuY29uc3QgdXNoZXJFeHQgOiBzdHJpbmcgPSBcIi5tM3U4XCI7XHJcblxyXG5cclxuLy8gRXh0cmFjdCBhdWRpb19vbmx5IHN0cmVhbSAubTN1OCBmcm9tIHRoZSBtYXN0ZXIgcGxheWxpc3QgY29udGVudC5cclxuLy8gUmV0dXJucyB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIGEgVVJMIGFmdGVyIGF1ZGlvX29ubHkgbWV0YWRhdGEuXHJcbi8vIFRPRE86IFRoaXMgd29ya3MsIGJ1dCBldmVudHVhbGx5IHdlIHdpbGwgbmVlZCB0byBmdWxseSBwYXJzZSB0aGUgY29udGVudFxyXG4vLyBhbmQgZ2V0IGF1ZGlvX29ubHkgc3RyZWFtIHVybFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBpZighY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBhdWRpb09ubHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgZm9yKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgaWYgKGxpbmUuaW5jbHVkZXMoXCJhdWRpb19vbmx5XCIpKSBhdWRpb09ubHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGF1ZGlvT25seUZvdW5kICYmIGxpbmUuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tV2ViVXJsKHdlYnVybD86IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgLy8gQ2hhbm5lbCBuYW1lIG1heSBub3QgYmUgYXZhaWxhYmxlIGZyb20gdGhlIG1haW4gcGFnZSBVUkxcclxuICAgIGNvbnN0IHVybCA9IHdlYnVybCA/PyBsb2NhdGlvbi5ocmVmO1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1cmwsIHR3aXRjaERvbWFpbiwgXCIvXCIsIHRydWUpO1xyXG4gICAgY29uc29sZS5sb2coXCJDaGFubmVsIG5hbWUgXCIgKyBjaGFubmVsICsgXCIsIGZyb20gVVJMOiBcIiArIHVybClcclxuXHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChjaGFubmVsIGluIG5vbkNoYW5uZWxzKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVG9rZW5VcmwoYWNjZXNzVG9rZW5Vcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhhY2Nlc3NUb2tlblVybCwgYXBpRG9tYWluLCBhY2Nlc3NUb2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgYWNjZXNzIHRva2VuOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh1c2hlclVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVzaGVyVXJsLCB1c2hlckRvbWFpbiwgdXNoZXJFeHQpO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIHVzaGVyOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG4vLyBHZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2Ygc3RhcnRTdHIgYW5kIHRoZSBmaXJzdCBlbmRTdHIgYWZ0ZXIgc3RhcnRTdHIuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lQmV0d2VlblN0cmluZ3MoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsIHN0YXJ0U3RyOiBzdHJpbmcsIGVuZFN0cjogc3RyaW5nLCBlbmRPcHRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSA6IHN0cmluZyB7XHJcbiAgICBsZXQgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHN0YXJ0U3RyKTtcclxuICAgIGlmKHN0YXJ0SW5kZXggPT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHN0YXJ0SW5kZXggKz0gc3RhcnRTdHIubGVuZ3RoO1xyXG5cclxuICAgIGxldCBlbmRJbmRleCA9IHVybC5pbmRleE9mKGVuZFN0ciwgc3RhcnRJbmRleCArIDEpO1xyXG4gICAgaWYoZW5kSW5kZXggPT0gLTEpIHtcclxuICAgICAgICBpZihlbmRPcHRpb25hbCkgZW5kSW5kZXggPSB1cmwubGVuZ3RoO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsLnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbn1cclxuXHJcblxyXG4vLyBUT0RPOiBJbnN0ZWFkIG9mIHByZS1kZWZpbmVkIHVybCBmb3JtYXQsIHVzZSByZWNlbnRseSB1c2VkIG9udCBpbiBUd2l0Y2ggd2ViXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW46IHN0cmluZywgc2lnOiBzdHJpbmcpIDogVXNoZXJVcmwge1xyXG4gICAgY29uc3QgdXNoZXJVcmwgPSBuZXcgVXNoZXJVcmwoYGh0dHBzOi8vdXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy8ke2NoYW5uZWx9Lm0zdThgKTtcclxuICAgIHVzaGVyVXJsLnVwZGF0ZSh0b2tlbiwgc2lnKTtcclxuXHJcbiAgICAvLyBJdCBpcyBub3QgY2xlYXIgaWYgYWxsIG9mIHRoZXNlIHBhcmFtcyBhcmUgcmVxdWlyZWQgb3IgaWYgdGhlcmUgYXJlIGFueSBtaXNzaW5nIG9uZXMuXHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInBsYXllclwiLCBcInR3aXRjaHdlYlwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfc291cmNlXCIsIFwidHJ1ZVwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwidHlwZVwiLCBcImFueVwiKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHVzaGVyVXJsO1xyXG59XHJcblxyXG5cclxuLy8gSW50ZXJmYWNlIHRvIGNvbW11bmljYXRlIGJldHdlZW4gYmFja2dyb3VuZCBhbmQgY29udGVudHNjcmlwdFxyXG4vLyB0byByZXF1ZXN0L3Jlc3BvbmQgYWNjZXNzIHRva2VuIFVSTCBhbmQgdXNoZXIgVVJMIGZvciBhIGNoYW5uZWwuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJsc1Jlc3BvbnNlIHtcclxuICAgIHdlYlVybDogVXJsR3JvdXA7XHJcbiAgICBsYXN0UmVxdWVzdGVkOiBVcmxHcm91cDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXJsR3JvdXAge1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgYWNjZXNzVG9rZW5Vcmw6IHN0cmluZztcclxuICAgIHVzaGVyVXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vLyBDbGFzcyB0byBzdG9yZSBhbmQgbWFuaXB1bGF0ZSB1c2hlciBVUkwuXHJcbmV4cG9ydCBjbGFzcyBVc2hlclVybCB7XHJcbiAgICBvcmlnaW5hbFVybDogc3RyaW5nO1xyXG4gICAgdXJsT2JqZWN0OiBVUkw7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICBleHBpcmVzQXQ6IG51bWJlcjsgIC8vIFRva2VuIGV4cGlyYXRpb24gZGF0ZXRpbWUgaW4gZXBvY2ggc2Vjb25kc1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFVybCA9IHVybDtcclxuICAgICAgICB0aGlzLnVybE9iamVjdCA9IG5ldyBVUkwodXJsKTtcclxuICAgICAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmdldENoYW5uZWwoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfYXVkaW9fb25seVwiLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5leHBpcmVkVXJsKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc1NpbmNlRXBvY2ggPSBNYXRoLnJvdW5kKG5vdy5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgICAgICAvLyA2MCBzZWNvbmRzIGJ1ZmZlciBiZWZvcmUgdG9rZW4gZXhwaXJhdGlvblxyXG4gICAgICAgIGlmKHNlY29uZHNTaW5jZUVwb2NoICsgNjAgPCB0aGlzLmV4cGlyZXNBdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVcmwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQ2FjaGVkIFVSTCBmb3IgJHt0aGlzLmNoYW5uZWx9IGlzIGV4cGlyZWRgKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsT2JqZWN0LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aCh1cmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCI/XCIpO1xyXG4gICAgICAgIGlmKGVuZEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIGVuZEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRRdWVyeVN0cmluZyhrZXk6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy51cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldChrZXkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWVyeVN0cmluZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuc2V0KG5hbWUsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeHBpcmVzQXQoKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5TdHJpbmcgPSB0aGlzLmdldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIik7XHJcbiAgICAgICAgaWYoIXRva2VuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdG9rZW5Kc29uID0gSlNPTi5wYXJzZSh0b2tlblN0cmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRva2VuSnNvbi5leHBpcmVzIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXNBdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgcGFyc2UgdG9rZW4gaW4gdXNoZXIgVVJMLiBFcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYW5uZWwoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tVXNoZXJVcmwodGhpcy5vcmlnaW5hbFVybCk7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld1Rva2VuOiBzdHJpbmcsIG5ld1NpZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInRva2VuXCIsIG5ld1Rva2VuKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwic2lnXCIsIG5ld1NpZyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcInBcIiwgdGhpcy5nZXRSYW5kb21OdW1iZXIoKS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tTnVtYmVyKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgeyBidWlsZFVzaGVyVXJsLCBwYXJzZUF1ZGlvT25seVVybCwgVXJsR3JvdXAgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb250ZW50KHVybDogc3RyaW5nKSB7XHJcbiAgICBpZighdXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgc3RhdHVzIGlmIG9rXHJcbiAgICAgICAgY29uc3QgcmVzcFRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgZmV0Y2hDb250ZW50IHRocmV3IGFuIGVycm9yOiAke2Vycn1gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hKc29uKHVybDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudCh1cmwpO1xyXG4gICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwSnNvbiA9IEpTT04ucGFyc2UocmVzcFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcEpzb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGNvdWxkIG5vdCBiZSBwYXJzZWQgdG8gSlNPTjogXCIgKyByZXNwVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdWRpb1N0cmVhbVVybCh1c2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVzaGVyVXJsKTtcclxuICAgIGNvbnN0IHN0cmVhbVVybCA9IHBhcnNlQXVkaW9Pbmx5VXJsKGNvbnRlbnQpO1xyXG4gICAgcmV0dXJuIHN0cmVhbVVybDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW5Vcmw6IHN0cmluZywgbGFzdFJlcXVlc3RlZENoYW5uZWw6IHN0cmluZyxcclxuICAgICAgICBsYXN0UmVxdXN0ZWRVc2hlclVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbih0b2tlblVybCk7XHJcbiAgICBpZighcmVzcEpzb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbi50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbi5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYW5uZWwgaXMgZGlmZmVyZW50IGZyb20gdGhlIGNoYW5uZWwgb2YgdGhlIGxhc3QgcmVxdWVzdGVkIHVzaGVyIHVybFxyXG4gICAgLy8gKFRoaXMgaXMgcG9zc2libGUgaWYgdGhlIGNoYW5uZWwncyBzdHJlYW1lciBpcyBob3N0aW5nIGFub3RoZXIgY2hhbm5lbClcclxuICAgIGlmKGxhc3RSZXF1ZXN0ZWRDaGFubmVsICYmIGNoYW5uZWwgIT09IGxhc3RSZXF1ZXN0ZWRDaGFubmVsKSB7XHJcbiAgICAgICAgaWYobGFzdFJlcXVzdGVkVXNoZXJVcmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXF1c3RlZFVzaGVyVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIHN0b3JlIGl0XHJcbiAgICAgICAgY29uc3QgdXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGxhc3RSZXF1ZXN0ZWRDaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgICAgICByZXR1cm4gdXNoZXJVcmwuZ2V0VXJsKCk7ICBcclxuICAgIH0gIFxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHJ5RmV0Y2hpbmdQbGF5bGlzdChncm91cDogVXJsR3JvdXApIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGlmKCFncm91cCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gXHJcbiAgICAvLyBzZWUgaWYgdGhlIGV4aXN0aW5nIHVzaGVyIHVybCBjYW4gYmUgdXNlZFxyXG4gICAgaWYoZ3JvdXAudXNoZXJVcmwpIHtcclxuICAgICAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IGZldGNoQ29udGVudChncm91cC51c2hlclVybCk7XHJcbiAgICAgICAgaWYocmVzcFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZighZ3JvdXAuYWNjZXNzVG9rZW5VcmwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbihncm91cC5hY2Nlc3NUb2tlblVybCk7XHJcbiAgICBjb25zdCB0b2tlbiA9IHJlc3BKc29uPy50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbj8uc2lnIGFzIHN0cmluZztcclxuICAgIGlmKCF0b2tlbiB8fCAhIHNpZykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ld1VzaGVyVXJsID0gYnVpbGRVc2hlclVybChncm91cC5jaGFubmVsLCB0b2tlbiwgc2lnKTtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KG5ld1VzaGVyVXJsLmdldFVybCgpKTtcclxuICAgIHJldHVybiByZXNwVGV4dDtcclxufSIsIlxyXG5pbXBvcnQgeyB0cnlGZXRjaGluZ1BsYXlsaXN0IH0gZnJvbSBcIi4vZmV0Y2hcIjtcclxuaW1wb3J0IHsgZ2V0Q2hhbm5lbEZyb21XZWJVcmwsIEdldFVybHNSZXNwb25zZSwgcGFyc2VBdWRpb09ubHlVcmwgfSBmcm9tIFwiLi91cmxcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBBbnkgYmV0dGVyIHdheSB0aGFuIEhUTUwgYXMgc3RyaW5nP1xyXG5jb25zdCBpbml0aWFsQnV0dG9uRG9tID0gYFxyXG48ZGl2IGNsYXNzPVwidHctaW5saW5lLWZsZXggdHctcmVsYXRpdmUgdHctdG9vbHRpcC13cmFwcGVyXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYXVkaW8tb25seS1idXR0b24gdHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWFsaWduLW1pZGRsZSB0dy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJ1dHRvbi1pY29uIHR3LWJ1dHRvbi1pY29uLS1vdmVybGF5IHR3LWNvcmUtYnV0dG9uIHR3LWNvcmUtYnV0dG9uLS1vdmVybGF5IHR3LWlubGluZS1mbGV4IHR3LWludGVyYWN0aXZlIHR3LWp1c3RpZnktY29udGVudC1jZW50ZXIgdHctb3ZlcmZsb3ctaGlkZGVuIHR3LXJlbGF0aXZlXCJcclxuICAgICAgICAgICAgZGF0YS1hLXRhcmdldD1cImF1ZGlvLW9ubHktYnV0dG9uXCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkF1ZGlvIG9ubHlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidHctYWxpZ24taXRlbXMtY2VudGVyIHR3LWZsZXggdHctZmxleC1ncm93LTBcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0dy1idXR0b24taWNvbl9faWNvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1pY29uLWRpdlwiIHN0eWxlPVwid2lkdGg6IDJyZW07IGhlaWdodDogMnJlbTtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8IS0tIEdvb2dsZSBNYXRlcmlhbCBEZXNpZ24gUmFkaW8gSWNvbi4gQXBhY2hlIExpY2Vuc2UgdjIuMCAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwidHctaWNvbl9fc3ZnXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD1cIm5vbmVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMy4yNCA2LjE1QzIuNTEgNi40MyAyIDcuMTcgMiA4djEyYzAgMS4xLjg5IDIgMiAyaDE2YzEuMTEgMCAyLS45IDItMlY4YzAtMS4xMS0uODktMi0yLTJIOC4zbDguMjYtMy4zNEwxNS44OCAxIDMuMjQgNi4xNXpNNyAyMGMtMS42NiAwLTMtMS4zNC0zLTNzMS4zNC0zIDMtMyAzIDEuMzQgMyAzLTEuMzQgMy0zIDN6bTEzLThoLTJ2LTJoLTJ2Mkg0VjhoMTZ2NHpcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8ZGl2IGNsYXNzPVwidHctdG9vbHRpcCB0dy10b29sdGlwLS1hbGlnbi1sZWZ0IHR3LXRvb2x0aXAtLXVwXCIgZGF0YS1hLXRhcmdldD1cInR3LXRvb2x0aXAtbGFiZWxcIiByb2xlPVwidG9vbHRpcFwiPlxyXG4gICAgICAgIFJhZGlvIG1vZGVcclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuICAgXHJcblxyXG5jb25zdCB2aWRlb1BsYXllckNsYXNzID0gXCJ2aWRlby1wbGF5ZXJcIjtcclxuY29uc3QgdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyA9IFwidmlkZW8tcGxheWVyLXByb2Nlc3NlZFwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBDbGFzcyA9IFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIjtcclxuY29uc3QgY29udHJvbEdyb3VwUHJvY2Vzc2VkQ2xhc3MgPSBcImNvbnRyb2wtZ3JvdXAtcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IHBsYXlCdXR0b25BdHRyID0gXCJidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLXBsYXktcGF1c2UtYnV0dG9uJ11cIjtcclxuY29uc3Qgdm9sdW1lU2xpZGVyQXR0ciA9IFwiaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXVwiO1xyXG5cclxuY29uc3QgcmFkaW9CdXR0b25QYXVzZWRDbGFzcyA9IFwiYXVkaW8tb25seS1idXR0b24tcGF1c2VkXCI7XHJcbmNvbnN0IHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzID0gXCJhdWRpby1vbmx5LWJ1dHRvbi1wbGF5aW5nXCI7XHJcbmNvbnN0IHJhZGlvQnV0dG9uRGlzYWJsZWRDbGFzcyA9IFwiYXVkaW8tb25seS1idXR0b24tZGlzYWJsZWRcIjtcclxuXHJcbmNvbnN0IGF0dHJPYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiBmYWxzZSwgc3VidHJlZTogZmFsc2UgfTtcclxuY29uc3QgZG9tT2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IGZhbHNlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTtcclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlIFZpZGVvUGxheWVyQ29udGFpbmVyLCBhZGQgTXV0YXRpb25PYnNlcnZlciB0byBcclxuICogMS4gZG9jdW1lbnQuYm9keSBjaGVja3MgZm9yIG9uZSBzdWJ0cmVlIGNoYW5nZVxyXG4gKiAgIDEtMi4gSWYgZGl2IHdpdGggY2xhc3MgXCJ2aWRlby1wbGF5ZXJcIiwgcHJvY2VzcyBpdC4gQ2hlY2sgIzJcclxuICogXHJcbiAqIDIuIENyZWF0ZSBWaWRlb1BsYXllciwgdmlkZW8tcGxheWVyIGNsYXNzIGRpdiBjaGVja3MgZm9yIDEgYXR0cmlidXRlIGNoYW5nZSwgMyBzdWJ0cmVlIGNoYW5nZXNcclxuICogICAyLTEuIGF0dHJpYnV0ZSBcImRhdGEtYS1wbGF5ZXItdHlwZVwiOiBcInNpdGVcIiwgXCJzaXRlX21pbmlcIiwgXCJjbGlwcy13YXRjaFwiXHJcbiAqICAgICAyLTItMi4gQ2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIGlmIG5lY2Vzc2FyeVxyXG4gKiAgICAgMi0yLTMuIE1vZGU6IFR1cGxlIG9mIChsYXlvdXQsIHZpZGVvX3R5cGUpLlxyXG4gKiAgICAgICAyLTItMy0xLiBsYXlvdXQ6IFwic2l0ZVwiIHwgXCJzaXRlX21pbmlcIlxyXG4gKiAgICAgICAyLTItMy0yLiB2aWRlb190eXBlOiBcImxpdmVcIiwgXCJ2b2RcIiwgXCJjbGlwXCIuLiBhbmQgbW9yZT8/Pz8/XHJcbiAqICAgMi0yLiBzdWJ0cmVlIGRpdiB3aXRoIGNsYXNzIFwidm9kLXNlZWtiYXItdGltZS1sYWJlbHNcIiBhbmQgXCJzZWVrYmFyLWludGVyYWN0aW9uLWFyZWFcIlxyXG4gKiAgICAgMi0yLTEuIFRoaXMgb25seSBhcHBlYXJzIGluIFZPRCB3YXRjaFxyXG4gKiAgICAgMi0yLTIuIElmIGNyZWF0ZWQsIGNoYW5nZSB0aGUgbW9kZSBvZiBWaWRlb1BsYXllciB0byBWT0RcclxuICogICAgIDItMi0zLiBJZiByZW1vdmVkIChjaGFuZ2VkIGZyb20gVk9EIHRvIGxpdmUvY2xpcCksID8/Pz9cclxuICogICAyLTMuIGNoZWNrIGZvciBjb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIlxyXG4gKiAgICAgMi0zLTEuIElmIGNyZWF0ZWQsIGNoZWNrICMzIGZvciBhY3Rpb25zXHJcbiAqICAgICAyLTMtMi4gSWYgcmVtb3ZlZCwgPz8/Pz9cclxuICogICAyLTQuIGNoZWNrIGZvciBcInZpZGVvXCIgZWxlbWVudCBpbiB0aGUgcGxheWVyXHJcbiAqICAgICAyLTQtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzYgZm9yIGFjdGlvbnNcclxuICogICAgIDItNC0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiBcclxuICogMy4gQ29udHJvbCBncm91cCBcInBsYXllci1jb250cm9sc19fbGVmdC1jb250cm9sLWdyb3VwXCIgY2hlY2tzIGZvciBcclxuICogICAzLTEuIHN1YnRyZWUgYnV0dG9uW2RhdGEtYS10YXJnZXQ9J3BsYXllci1wbGF5LXBhdXNlLWJ1dHRvbiddIGZvciB2aWRlbyBwbGF5L3BhdXNlIGJ1dHRvblxyXG4gKiAgICAgMy0xLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM0XHJcbiAqICAgICAzLTEtMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTIuIHN1YnRyZWUgaW5wdXRbZGF0YS1hLXRhcmdldD0ncGxheWVyLXZvbHVtZS1zbGlkZXInXSBmb3Igdm9sdW1lIHNsaWRlclxyXG4gKiAgICAgMy0yLTEuIElmIGNyZWF0ZWQsIGNoZWNrICM1XHJcbiAqICAgICAzLTItMi4gSWYgcmVtb3ZlZCAod2hlbiBwbGF5ZXIgdHlwZSBjaGFuZ2VkIGZyb20gXCJzaXRlXCIgdG8gXCJzaXRlX21pbmlcIiwgZXRjKSwgPz8/Pz9cclxuICogICAzLTMuIElmIGJvdGggY29tcG9uZW50cyBpbiAzLTEgYW5kIDMtMiBhcmUgcmVhZHk6XHJcbiAqICAgICAzLTMtMS4gQ3JlYXRlIHJhZGlvIG1vZGUgYnV0dG9uLCBhbmQgcHV0IE11dGF0aW9uT2JzZXJ2ZXIgKHNlZSAjNCBhbmQgIzUpXHJcbiAqICAgICAzLTMtMi4gSWYgYXQgbGVhc3Qgb25lIGNvbXBvbmVudCBpcyByZW1vdmVkIChzaXRlLT5zaXRlX21pbmkgY2hhbmdlLCBldGMpXHJcbiAqICAgICAgIDMtMy0yLTEuIGFsc28gcmVtb3ZlIHRoZSByYWRpbyBtb2RlIGJ1dHRvbiBmcm9tIERPTVxyXG4gKiBcclxuICogNC4gVmlkZW8gcGxheS9wYXVzZSBidXR0b24gY2hlY2tzIGZvclxyXG4gKiAgIDQtMS4gQXR0cmlidXRlIGNoYW5nZSBcImRhdGEtYS1wbGF5ZXItc3RhdGVcIjogXCJwbGF5aW5nXCIgb3IgXCJwYXVzZWRcIlxyXG4gKiAgICAgNC0xLTEuIElmIGF0dHJpYnV0ZSB2YWx1ZSBjaGFuZ2VkIHRvIFwicGxheWluZ1wiLCBzdG9wIGFsbCBhdWRpbyBpbiB0aGUgVmlkZW9QbGF5ZXJDb250YWluZXJcclxuICogXHJcbiAqIDUuIFZvbHVtZSBzbGlkZXIgY2hlY2tzIGZvclxyXG4gKiAgIDUtMS4gQXR0cmlidXRlIFwidmFsdWVcIiBjaGFuZ2U6IG51bWJlciBiZXR3ZWVuIDAgPD0gbnVtIDw9IDFcclxuICogICAgIDUtMS0xLiBJZiBjaGFuZ2UgaXMgZGV0ZWN0ZWQsIGFwcGx5IHRoZSBuZXcgdm9sdW1lIHRvIGF1ZGlvRWxlbS5cclxuICogXHJcbiAqIDYuIG9yaWdpbmFsIFwidmlkZW9cIiBlbGVtZW50IGluIHZpZGVvLXBsYXllciBjaGVja3MgZm9yXHJcbiAqICAgNi0xLiBBdHRyaWJ1dGUgXCJzcmNcIiBjaGFuZ2U6IG1lYW5zIHRoYXQgdGhlIHZpZGVvIHNvdXJjZSBjaGFuZ2VkIChsaWtlbHkgaG9zdGluZyBhbm90aGVyIHN0cmVhbWVyKVxyXG4gKiAgICAgNi0xLTEuIFJhZGlvIG1vZGUgYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZD8gUmUtY29uZmlndXJlZCB3aXRoIHRoZSBuZXcgc3RyZWFtZXIncyBVUkw/XHJcbiAqICAgIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb3cgdG8gZGV0ZWN0IHRoZSBjaGFubmVsIG9mIHRoZSBzdHJlYW0gYmVpbmcgcGxheWVkP1xyXG4gKiBHZXR0aW5nIGNoYW5uZWwgbmFtZSBmcm9tIFVSTCBoYXMgdGhlIGZvbGxsb3dpbmcgaXNzdWVzXHJcbiAqICgxKSBTdHJlYW1lciBob3N0aW5nIGFub3RoZXIgY2hhbm5lbFxyXG4gKiAoMikgTWFpbiBwYWdlLiBDaGFubmVsIGNhbiBjaGFuZ2UgcXVpY2tseSBpbiB0aGUgY2Fyb3VzZWxcclxuICogXHJcbiAqIFByb3Bvc2VkIHNvbHV0aW9uOlxyXG4gKiAoMSkgS2VlcCB0aGUgbGFzdCByZXF1ZXN0ZWQgdXNoZXIgVVJMIGluIHRoZSB0YWIuIEd1ZXNzIHRoZSBjaGFubmVsIGZyb20gdGhlcmVcclxuICogKDIpIEZvciBcInNpdGVfbWluaVwiIHN0YXRlLCBzdG9yZSB0aGUgY2hhbm5lbCBuYW1lIGluIHZpZGVvIHBsYXllci5cclxuICogICAgIEluIHRoYXQgY2FzZSwgaXQgd2lsbCBiZSBwb3NzaWJsZSB0byByZXN1bWUgcGxheWluZyBpbiB0aGUgcmlnaHQgY2hhbm5lbC5cclxuICogKDMpIERpc2FibGUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGluIHRoZSBtYWluIHBhZ2VcclxuICogXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFkZCByYWRpbyBtb2RlIGJ1dHRvbiBpbiBzaXRlX21pbmk/XHJcbiAqIERvbid0IHN0b3JlIHRoZSBwbGF5c3RhdGUgaW4gRE9NOiBvbmx5IHN0b3JlIGl0IGluIFZpZGVvUGxheWVyIGNsYXNzIGFzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEVTcG9ydHMgcGFnZTogdmlkZW8gbWluaXBsYXllciBrZWVwcyBwbGF5aW5nIGV2ZW4gd2hlbiB0aGUgc2l0ZSBwbGF5ZXIgaW4gRXNwb3J0cyBwYWdlIGlzIGFsc28gYmVpbmcgcGxheWVkLlxyXG4gKiBTaG91bGQgdGhlIHJhZGlvIG1vZGUgZm9sbG93IHRoZSBzYW1lIGJlaGF2aW9yP1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBY2Nlc3MgdG9rZW4gdXJsIGhhcyBvYXV0aCBjb2RlLCB3aGljaCBpcyB1bmRlZmluZWQgaWYgdGhlIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICogTm90IHN1cmUgaG93IFR3aXRjaCByZXR1cm5zIGNvcnJlY3QgcmVzcG9uc2UgZm9yIGFub255bW91cyB1c2VyIHlldC5cclxuICogQ2FsbGluZyB0aGUgc2FtZSBhY2Nlc3MgdG9rZW4gVVJMIGZyb20gY29udGVudHNjcmlwdCByZXR1cm5zIGVycm9yLlxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBEaXNhYmxlIHRoZSBidXR0b24gd2hlbiB1c2VyIGlzIG5vdCBsb2dnZWQgaW4uXHJcbiAqL1xyXG5cclxuXHJcbmNvbnN0IGVudW0gUGxheWluZ1N0YXRlIHtcclxuICAgIERJU0FCTEVELFxyXG4gICAgUEFVU0VELFxyXG4gICAgUExBWUlORyxcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRyb2xHcm91cCB7XHJcbiAgICBjb250cm9sR3JvdXBFbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHBsYXllcjogVmlkZW9QbGF5ZXI7XHJcbiAgICBwbGF5QnV0dG9uRWxlbTogSFRNTEVsZW1lbnQ7XHJcbiAgICB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcmFkaW9CdXR0b246IEhUTUxFbGVtZW50O1xyXG4gICAgY29tcG9uZW50c09ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgcGxheUJ1dHRvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdm9sdW1lT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcjogVmlkZW9QbGF5ZXIsIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gY29udHJvbEdyb3VwRWxlbTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNvbnRyb2xHcm91cEVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBQbGF5L0F1ZGlvIGJ1dHRvbiBhbmQgdm9sdW1lIHNsaWRlciBcclxuICAgICAgICBjb25zdCBwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3RvcihwbGF5QnV0dG9uQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtKTtcclxuICAgICAgICBjb25zdCB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3Iodm9sdW1lU2xpZGVyQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbSk7XHJcbiAgICAgICAgLy8gQWRkIHRoZSByYWRpbyBidXR0b24gaWYgbm90IGV4aXN0c1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgLy8gcGxheSBidXR0b24gY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighcGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBwbGF5QnV0dG9uRWxlbS5jbGFzc0xpc3Q7XHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMucGxheUJ1dHRvbkVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihjbGFzc2VzLmNvbnRhaW5zKFwicGxheS1wYXVzZS1idXR0b24tcHJvY2Vzc2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoXCJwbGF5LXBhdXNlLWJ1dHRvbi1wcm9jZXNzZWRcIik7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzIGlmIGEgdmlkZW8gc3RhcnRzIHRvIHBsYXkuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBuZWNlc2FzcnkgZm9yIGEgY2FzZSB3aGVuIHVzZXIgYnJvd3NlcyB0byBhIG5vbi1jaGFubmVsIHBhZ2UgKGUuZy4gbWFpbiwgZXNwb3J0cylcclxuICAgICAgICAvLyB3aGljaCBhdXRvbWF0aWNhbGx5IHBsYXlzIGEgdmlkZW8uXHJcbiAgICAgICAgdGhpcy5wYXVzZUF1ZGlvRm9yVmlkZW8oKTtcclxuICAgICAgICB0aGlzLnBsYXlCdXR0b25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMucGF1c2VBdWRpb0ZvclZpZGVvLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5QnV0dG9uRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZUF1ZGlvRm9yVmlkZW8oKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtYS1wbGF5ZXItc3RhdGVcIik7XHJcbiAgICAgICAgaWYoc3RhdGUgPT0gXCJwbGF5aW5nXCIpIHsgIC8vIFZpZGVvIHN0YXRlIGZyb20gcGF1c2VkIHRvIHBsYXlpbmdcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucGF1c2VBbGwoKTsgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFZvbHVtZSgpIHtcclxuICAgICAgICBpZih0aGlzLnBsYXllci5hdWRpb0VsZW0pIHtcclxuICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gdGhpcy52b2x1bWVTbGlkZXJFbGVtLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hdWRpb0VsZW0udm9sdW1lID0gcGFyc2VGbG9hdCh2b2x1bWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICAgIC8vIHZvbHVtZSBzbGlkZXIgY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighdm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB2b2x1bWVTbGlkZXJFbGVtLmNsYXNzTGlzdDtcclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoY2xhc3Nlcy5jb250YWlucyhcInZvbHVtZS1zbGlkZXItcHJvY2Vzc2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoXCJ2b2x1bWUtc2xpZGVyLXByb2Nlc3NlZFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSB2b2x1bWVTbGlkZXJFbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gdm9sdW1lU2xpZGVyXHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuYWRqdXN0Vm9sdW1lLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZvbHVtZVNsaWRlckVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpIHtcclxuICAgICAgICAvLyBEb24ndCBwcm9jZWVkIGlmIGJvdGggcGxheUJ1dHRvbkVsZW0gYW5kIHZvbHVtZVNsaWRlckVsZW0gYXJlIGF2YWlsYWJsZVxyXG4gICAgICAgIGlmKCF0aGlzLnBsYXlCdXR0b25FbGVtIHx8ICF0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB3YXMgYWxyZWFkeSBjcmVhdGVkLCBkbyBub3RoaW5nXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBpZihjbGFzc2VzPy5jb250YWlucyhcInJhZGlvLWJ1dHRvbi1wcm9jZXNzZWRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogVXNlIHdlYnBhY2sgaHRtbCBsb2FkZXJcclxuICAgICAgICAvLyBUT0RPOiBEaXNhYmxlIHRoZSBidXR0b24gaW4gY2xpcCBhbmQgKGFsc28gVk9EPylcclxuICAgICAgICBjb25zdCBidXR0b25XcmFwcGVyRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJ1dHRvbldyYXBwZXJEb20uaW5uZXJIVE1MID0gaW5pdGlhbEJ1dHRvbkRvbTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBidXR0b25XcmFwcGVyRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24uY2xhc3NMaXN0LmFkZChcInJhZGlvLWJ1dHRvbi1wcm9jZXNzZWRcIik7XHJcbiAgICAgICAgbGV0IHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3M7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGxheWVyLnBsYXlpbmdTdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgc3RhdGVDbGFzcyA9IHJhZGlvQnV0dG9uUGF1c2VkQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUExBWUlORzpcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvblBsYXlpbmdDbGFzcztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLmNsYXNzTGlzdC5hZGQoc3RhdGVDbGFzcyk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5vbmNsaWNrID0gdGhpcy5wbGF5ZXIub25SYWRpb0J1dHRvbkNsaWNrZWQuYmluZCh0aGlzLnBsYXllcik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtLmFwcGVuZENoaWxkKGJ1dHRvbldyYXBwZXJEb20pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBsYXkoKSB7XHJcbiAgICAgICAgLy8gTk9URTogVGhlcmUgaXMgMX4zIHNlY29uZHMgb2YgZGVsYXkgYmV0d2VlbiBhdWRpby1vbmx5IGJ1dHRvbiBjbGljayBhbmQgc291bmQgYmVpbmcgcGxheWVkLlxyXG4gICAgICAgIC8vIEl0J3MgYmV0dGVyIHRvIHNob3cgc29tZSBpbnRlcm1lZGlhdGUgc3RhdGUgKGljb24gY2hhbmdlLCBtb3VzZSBjdXJzb3IgY2hhbmdlLCBldGMpIGluIHRoZSBtZWFud2hpbGVcclxuXHJcbiAgICAgICAgLy8gU3RvcCB0aGUgdmlkZW8gaWYgcGxheWluZ1xyXG4gICAgICAgIGNvbnN0IHZpZGVvU3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtPy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWEtcGxheWVyLXN0YXRlXCIpO1xyXG4gICAgICAgIGlmKHZpZGVvU3RhdGUgPT0gXCJwbGF5aW5nXCIpIHtcclxuICAgICAgICAgICAgLy8gSXMgdGhlcmUgYSBiZXR0ZXIgd2F5IHRvIHBhdXNlIHZpZGVvIHRoYW4gdGhpcyBcImNsaWNrXCIgaGFjaz9cclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QYXVzZWRDbGFzcyk7XHJcbiAgICAgICAgY2xhc3Nlcz8uYWRkKHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25EaXNhYmxlZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQYXVzZSgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBjbGFzc2VzPy5hZGQocmFkaW9CdXR0b25QYXVzZWRDbGFzcyk7XHJcbiAgICAgICAgY2xhc3Nlcz8ucmVtb3ZlKHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25EaXNhYmxlZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JEaXNhYmxlZCgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QYXVzZWRDbGFzcyk7XHJcbiAgICAgICAgY2xhc3Nlcz8ucmVtb3ZlKHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5hZGQocmFkaW9CdXR0b25EaXNhYmxlZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBWaWRlb1BsYXllciB7XHJcbiAgICBwbGF5ZXJJZDogc3RyaW5nO1xyXG4gICAgY29udGFpbmVyOiBWaWRlb1BsYXllckNvbnRhaW5lcjtcclxuICAgIHBsYXllckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWluZ1N0YXRlOiBQbGF5aW5nU3RhdGU7XHJcbiAgICBhdHRyaWJ1dGVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGNvbnRyb2xHcm91cDogQ29udHJvbEdyb3VwO1xyXG4gICAgY29udHJvbEdyb3VwT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBobHM6IEhscztcclxuICAgIGF1ZGlvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJZDogc3RyaW5nLCBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyLCBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0gPSBwbGF5ZXJFbGVtO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBsYXllckVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzUGVyTGl2ZW5lc3MoKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjb250cm9sR3JvdXBFbGVtLmNsYXNzTGlzdDtcclxuICAgICAgICBpZihjbGFzc2VzLmNvbnRhaW5zKGNvbnRyb2xHcm91cFByb2Nlc3NlZENsYXNzKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzZXMuYWRkKGNvbnRyb2xHcm91cFByb2Nlc3NlZENsYXNzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheShtZWRpYVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSA8dmlkZW8+IGVsZW1lbnQgdG8gcGxheSBhdWRpby5cclxuICAgICAgICAvLyA8YXVkaW8+IGNhbiBiZSBhbHNvIHVzZWQgYnkgaGxzLmpzLCBidXQgVHlwZXNjcmlwdCBmb3JjZXMgdGhpcyB0byBiZSBIVE1MVmlkZW9FbGVtZW50LlxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cD8uYWRqdXN0Vm9sdW1lKCk7ICAvLyBNYXRjaCB0aGUgaW5pdGlhbCB2b2x1bWUgd2l0aCB0aGUgc2xpZGVyIHZhbHVlLlxyXG4gICAgICAgIHRoaXMucGxheWVyRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgdGhpcy5obHMgPSBuZXcgSGxzKHtcclxuICAgICAgICAgICAgLy9kZWJ1ZzogdHJ1ZSxcclxuICAgICAgICAgICAgbGl2ZVN5bmNEdXJhdGlvbjogMCxcclxuICAgICAgICAgICAgbGl2ZU1heExhdGVuY3lEdXJhdGlvbjogNSxcclxuICAgICAgICAgICAgbGl2ZUR1cmF0aW9uSW5maW5pdHk6IHRydWUgIC8vIHRydWUgZm9yIGxpdmUgc3RyZWFtXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5obHMubG9hZFNvdXJjZShtZWRpYVVybCk7XHJcbiAgICAgICAgdGhpcy5obHMuYXR0YWNoTWVkaWEodGhpcy5hdWRpb0VsZW0pOyBcclxuICAgICAgICAvLyBUT0RPOiBJcyB0aGlzIHNhZmUgdG8gcGxheSByaWdodCBhd2F5IGFmdGVyIGF0dGFjaGluZyB0aGUgbWVkaWE/XHJcbiAgICAgICAgLy8gVGhlIG1haW4gZXhhbXBsZSBhdCBobHMuanMgd2Vic2l0ZSB0ZWxscyB0byB1c2UgTUFOSUZFU1RfUEFSU0VEIGV2ZW50LFxyXG4gICAgICAgIC8vIGJ1dCBmb3Igc29tZSByZWFzb24gdGhlIGV2ZW50IGlzIG5vdCB0cmlnZ2VyZWQgd2l0aCB0eXBlc2NyaXB0K3dlYnBhY2suXHJcbiAgICAgICAgY29uc3QgYXVkaW9QbGF5Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5IHN0YXJ0ZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnBsYXkoKS50aGVuKGF1ZGlvUGxheUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBMQVlJTkc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZSgpIHtcclxuICAgICAgICBpZih0aGlzLmhscykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFwiRE9NRXhjZXB0aW9uOiBUaGUgcGxheSgpIHJlcXVlc3Qgd2FzIGludGVycnVwdGVkIGJ5IGEgY2FsbCB0byBwYXVzZSgpXCJcclxuICAgICAgICAgICAgICAgIC8vIGlzIHRocm93biB3aGVuIHVzZXIgcGF1c2VzIHRoZSBhdWRpbyB0b28gcXVpY2tseSBhZnRlciBwbGF5aW5nLlxyXG4gICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIGlzIG5lZWRlZC4gVGhlIGF1ZGlvIHdpbGwgYmUgcGF1c2VkIGNvcnJlY3RseSBhbnl3YXkuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5obHMuc3RvcExvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGV0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyB0aGF0IHRoZSBITFMgb2JqZWN0IGdldHMgc3R1Y2sgYWZ0ZXIgbXVsdGlwbGUgcGxheXMgYW5kIHBhdXNlc1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyByZS11c2VkIGZvciB0aGUgbmV4dCBwbGF5LiBOZWVkIHRvIGRlc3Ryb3kgdGhlIG9iamVjdCBhbmQgcmUtY3JlYXRlIGl0LlxyXG4gICAgICAgICAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyRWxlbS5yZW1vdmVDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQYXVzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhdXNlIGF1ZGlvIGluIGFsbCBwbGF5ZXJzXHJcbiAgICBwYXVzZUFsbCgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyAgLy8gV2hhdCBlbHNlIHRvIGRvIGhlcmU/XHJcbiAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFBsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IGdldENoYW5uZWxGcm9tV2ViVXJsKCk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VDYWxsYmFjayA9IGFzeW5jIGZ1bmN0aW9uKHJlc3BvbnNlOiBHZXRVcmxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcInJlc3BvbnNlIGZvciBnZXRfYXVkaW9fdXJsIHJlY2VpdmVkOiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgIGlmKCFyZXNwb25zZT8ud2ViVXJsPy5jaGFubmVsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwbGF5bGlzdCA9IGF3YWl0IHRyeUZldGNoaW5nUGxheWxpc3QocmVzcG9uc2Uud2ViVXJsKTtcclxuICAgICAgICAgICAgaWYoIXBsYXlsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5bGlzdCA9IGF3YWl0IHRyeUZldGNoaW5nUGxheWxpc3QocmVzcG9uc2UubGFzdFJlcXVlc3RlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYXVkaW9TdHJlYW1VcmwgPSBwYXJzZUF1ZGlvT25seVVybChwbGF5bGlzdCk7XHJcbiAgICAgICAgICAgIGlmKGF1ZGlvU3RyZWFtVXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5wYXVzZUV4Y2VwdCh0aGlzLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheShhdWRpb1N0cmVhbVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHttZXNzYWdlOiBcImdldF9hdWRpb191cmxcIiwgY2hhbm5lbDogY2hhbm5lbH0sIHJlc3BvbnNlQ2FsbGJhY2suYmluZCh0aGlzKSk7IFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNvbnRyb2xzUGVyTGl2ZW5lc3MoKSB7XHJcbiAgICAgICAgLy8gSWYgd2F0Y2hpbmcgYSBsaXZlIHN0cmVhbSwgZW5hYmxlIHRoZSBjb250cm9sIGdyb3VwLlxyXG4gICAgICAgIC8vIElmIHdhdGNoaW5nIFZPRCBvZiBjbGlwLCBkaXNhYmxlIHRoZSBjb250cm9sIGdyb3VwLlxyXG4gICAgICAgIC8vIEZvciBub3csIHRoZSBsb2dpYyBmb3IgY2hlY2tpbmcgbGl2ZS9yZWNvcmRlZCB2aWRlbyBpcyBleGlzdGVuY2Ugb2YgdGltZSBzZWVrYmFyLlxyXG4gICAgICAgIGNvbnN0IHNlZWtiYXIgPSB0aGlzLnBsYXllckVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlZWtiYXItaW50ZXJhY3Rpb24tYXJlYVwiKT8uWzBdO1xyXG5cclxuICAgICAgICAvLyBXaGVuIHNlZWtiYXIgZGlzYXBwZWFyZWQgYW5kIHRoZSBidXR0b24gaXMgc3RpbGwgZGlzYWJsZWQuXHJcbiAgICAgICAgaWYoIXNlZWtiYXIgJiYgdGhpcy5wbGF5aW5nU3RhdGUgPT0gUGxheWluZ1N0YXRlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LnVwZGF0ZUZvclBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFdoZW4gc2Vla2JhciBhcHBlYXJlZCBhbmQgdGhlIHJhZGlvIGJ1dHRvbiBpcyBub3QgZGlzYWJsZWQgeWV0LlxyXG4gICAgICAgIGVsc2UgaWYoc2Vla2JhciAmJiB0aGlzLnBsYXlpbmdTdGF0ZSAhPSBQbGF5aW5nU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JEaXNhYmxlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJhZGlvQnV0dG9uQ2xpY2tlZCgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5wbGF5aW5nU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJDb250YWluZXIge1xyXG4gICAgcGxheWVyczogVmlkZW9QbGF5ZXJbXTtcclxuICAgIG5leHRJZDogbnVtYmVyO1xyXG4gICAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAxMDAwMTsgIC8vIFJhbmRvbSBzdGFydCBpbmRleCBmb3IgcGxheWVyLlxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvLyBGaW5kIGV4aXN0aW5nIHZpZGVvIHBsYXllciBlbGVtZW50cyB0byBjcmVhdGUgVmlkZW9QbGF5ZXIgb2JqZWN0c1xyXG4gICAgICAgIHRoaXMuZmluZFZpZGVvUGxheWVyRWxlbXMoKTtcclxuICAgICAgICAvLyBEZXRlY3QgZnV0dXJlIHZpZGVvIHBsYXllciBlbGVtZW50c1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmZpbmRWaWRlb1BsYXllckVsZW1zLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZFZpZGVvUGxheWVyRWxlbXMoKSB7XHJcbiAgICAgICAgLy8gVE9ETzogSXMgaXQgYmV0dGVyIHRvIGl0ZXJhdGUgb25seSB0aGUgbXV0YXRlZCBkaXZzP1xyXG4gICAgICAgIGNvbnN0IHBsYXllckVsZW1zID0gZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHZpZGVvUGxheWVyQ2xhc3MpO1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyRWxlbSBvZiBwbGF5ZXJFbGVtcykge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGl2IGlzIG5vdCBhbHJlYWR5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBpZighcGxheWVyRWxlbS5jbGFzc0xpc3QuY29udGFpbnModmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJOZXcgdmlkZW8gcGxheWVyIGRldGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdQbGF5ZXIocGxheWVyRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgaWYocGxheWVyRWxlbS5jbGFzc0xpc3QuY29udGFpbnModmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGxheWVySWQgPSB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzICsgXCItXCIgKyB0aGlzLm5leHRJZDtcclxuICAgICAgICB0aGlzLm5leHRJZCArPSAxO1xyXG4gICAgICAgIHBsYXllckVsZW0uY2xhc3NMaXN0LmFkZCh2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzKTtcclxuICAgICAgICBwbGF5ZXJFbGVtLmNsYXNzTGlzdC5hZGQobmV3UGxheWVySWQpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIobmV3UGxheWVySWQsIHRoaXMsIHBsYXllckVsZW0pO1xyXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VFeGNlcHQocGxheWVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIucGxheWVySWQgIT0gcGxheWVySWQpIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIlxyXG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbnRhaW5lciB9IGZyb20gXCIuL3ZpZGVvX3BsYXllcl9jb250YWluZXJcIjtcclxuXHJcblxyXG52YXIgY29udGFpbmVyID0gbmV3IFZpZGVvUGxheWVyQ29udGFpbmVyKCk7XHJcbmNvbnRhaW5lci5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==