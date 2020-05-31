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
    const url = weburl || location.href;
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
        if (!url)
            return null;
        const response = yield fetch(url);
        // TODO: Check if the status if ok
        const respText = yield response.text();
        return respText;
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
function fetchUsherUrl(channel, tokenUrl) {
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
        // Otherwise, create a new one and store it
        const usherUrl = Object(url["b" /* buildUsherUrl */])(channel, token, sig);
        return usherUrl.getUrl();
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
        // MutationObserver to playButtonElem
        let playButtonCallback = function (mutationList, observer) {
            const state = this.playButtonElem.getAttribute("data-a-player-state");
            if (state == "playing") { // Video state from paused to playing
                this.player.pause(); // Pause audio
            }
        };
        this.playButtonObserver = new MutationObserver(playButtonCallback.bind(this));
        this.playButtonObserver.observe(this.playButtonElem, attrObserverConfig);
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
        let volumeChangeCallback = function (mutationList, observer) {
            if (this.player.audioElem) {
                const volume = this.volumeSliderElem.value;
                this.player.audioElem.volume = volume;
            }
        };
        this.volumeObserver = new MutationObserver(volumeChangeCallback.bind(this));
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
        const attributeCallback = function (mutations, observer) {
            for (let mutation of mutations) {
                if (mutation.attributeName == "data-a-player-type") {
                    const playerType = this.playerElem.getAttribute("data-a-player-type");
                    switch (playerType) {
                        case "site":
                            break; // state change function
                        case "site_mini":
                            break;
                        case "clips-watch":
                            break;
                    }
                    return;
                }
            }
        };
        this.attributeObserver = new MutationObserver(attributeCallback.bind(this));
        this.attributeObserver.observe(this.playerElem, attrObserverConfig);
        this.tryUpdatingControlGroup();
        const controlGroupCallback = function (mutations, observer) {
            this.tryUpdatingControlGroup();
        };
        this.controlGroupObserver = new MutationObserver(controlGroupCallback.bind(this));
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
        const classes = controlGroupElem.classList;
        if (classes.contains(controlGroupProcessedClass)) {
            return;
        }
        classes.add(controlGroupProcessedClass);
        (_c = this.controlGroup) === null || _c === void 0 ? void 0 : _c.destroy();
        this.controlGroup = new ControlGroup(this, controlGroupElem);
    }
    play(mediaUrl) {
        var _a;
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
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.updateForPlay();
    }
    pause() {
        var _a;
        if (this.hls) {
            this.audioElem.pause();
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
    destroy() {
        var _a;
        this.pause();
        (_a = this.controlGroup) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    requestPlay() {
        const channel = Object(url["e" /* getChannelFromWebUrl */])();
        const responseCallback = function (response) {
            return video_player_container_awaiter(this, void 0, void 0, function* () {
                console.debug("response for get_audio_url received: " + JSON.stringify(response));
                if (!(response === null || response === void 0 ? void 0 : response.channel)) {
                    return;
                }
                let usherUrl = response.usherUrl;
                if (!usherUrl) {
                    usherUrl = yield fetchUsherUrl(response.channel, response.accessTokenUrl);
                }
                const audioStreamUrl = yield fetchAudioStreamUrl(usherUrl);
                this.container.pauseExcept(this.playerId);
                this.play(audioStreamUrl);
            });
        };
        chrome.runtime.sendMessage({ message: "get_audio_url", channel: channel }, responseCallback.bind(this));
    }
    onRadioButtonClicked() {
        switch (this.playingState) {
            case 0 /* DISABLED */:
                break;
            case 1 /* PAUSED */:
                console.debug("Radio button is clicked in paused state");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmV0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvX3BsYXllcl9jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFNLFlBQVksR0FBWSxZQUFZLENBQUM7QUFDM0MseURBQXlEO0FBQ3pELE1BQU0sV0FBVyxHQUFjLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFeEUsTUFBTSxTQUFTLEdBQVksNkJBQTZCLENBQUM7QUFDekQsTUFBTSxXQUFXLEdB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aEUsSUFBSSxTQUFTLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0FBQzNDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwiXHJcbmNvbnN0IHR3aXRjaERvbWFpbiA6IHN0cmluZyA9IFwidHdpdGNoLnR2L1wiO1xyXG4vLyBOb24tZXhodWFzdGl2ZSBsaXN0IG9mIG5vbi1jaGFubmVsIHJvdXRlcyBpbiB0d2l0Y2gudHZcclxuY29uc3Qgbm9uQ2hhbm5lbHMgOiBzdHJpbmdbXSA9IFtcImRpcmVjdG9yeVwiLCBcInZpZGVvc1wiLCBcInVcIiwgXCJzZXR0aW5nc1wiXTtcclxuXHJcbmNvbnN0IGFwaURvbWFpbiA6IHN0cmluZyA9IFwiYXBpLnR3aXRjaC50di9hcGkvY2hhbm5lbHMvXCI7XHJcbmNvbnN0IGFjY2Vzc1Rva2VuIDogc3RyaW5nID0gXCIvYWNjZXNzX3Rva2VuXCI7XHJcblxyXG5jb25zdCB1c2hlckRvbWFpbiA6IHN0cmluZyA9IFwidXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy9cIjtcclxuY29uc3QgdXNoZXJFeHQgOiBzdHJpbmcgPSBcIi5tM3U4XCI7XHJcblxyXG5cclxuLy8gRXh0cmFjdCBhdWRpb19vbmx5IHN0cmVhbSAubTN1OCBmcm9tIHRoZSBtYXN0ZXIgcGxheWxpc3QgY29udGVudC5cclxuLy8gUmV0dXJucyB0aGUgZmlyc3Qgb2NjdXJhbmNlIG9mIGEgVVJMIGFmdGVyIGF1ZGlvX29ubHkgbWV0YWRhdGEuXHJcbi8vIFRPRE86IFRoaXMgd29ya3MsIGJ1dCBldmVudHVhbGx5IHdlIHdpbGwgbmVlZCB0byBmdWxseSBwYXJzZSB0aGUgY29udGVudFxyXG4vLyBhbmQgZ2V0IGF1ZGlvX29ubHkgc3RyZWFtIHVybFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBpZighY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBhdWRpb09ubHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgZm9yKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgaWYgKGxpbmUuaW5jbHVkZXMoXCJhdWRpb19vbmx5XCIpKSBhdWRpb09ubHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGF1ZGlvT25seUZvdW5kICYmIGxpbmUuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tV2ViVXJsKHdlYnVybD86IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgLy8gQ2hhbm5lbCBuYW1lIG1heSBub3QgYmUgYXZhaWxhYmxlIGZyb20gdGhlIG1haW4gcGFnZSBVUkxcclxuICAgIGNvbnN0IHVybCA9IHdlYnVybCB8fCBsb2NhdGlvbi5ocmVmO1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyh1cmwsIHR3aXRjaERvbWFpbiwgXCIvXCIsIHRydWUpO1xyXG4gICAgY29uc29sZS5sb2coXCJDaGFubmVsIG5hbWUgXCIgKyBjaGFubmVsICsgXCIsIGZyb20gVVJMOiBcIiArIHVybClcclxuXHJcbiAgICAvLyBGaWx0ZXIgb3V0IHNvbWUgbm9uLWNoYW5uZWwgcGFnZXMgd2l0aCBzaW1pbGFyIFVSTCBwYXR0ZXJuIGFzIGNoYW5uZWwgcGFnZXNcclxuICAgIGlmIChjaGFubmVsIGluIG5vbkNoYW5uZWxzKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBjaGFubmVsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYW5uZWxGcm9tVG9rZW5VcmwoYWNjZXNzVG9rZW5Vcmw6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldE5hbWVCZXR3ZWVuU3RyaW5ncyhhY2Nlc3NUb2tlblVybCwgYXBpRG9tYWluLCBhY2Nlc3NUb2tlbik7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5uZWwgbmFtZSBwYXJzZWQgYWNjZXNzIHRva2VuOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh1c2hlclVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0TmFtZUJldHdlZW5TdHJpbmdzKHVzaGVyVXJsLCB1c2hlckRvbWFpbiwgdXNoZXJFeHQpO1xyXG4gICAgY29uc29sZS5sb2coXCJjaGFubmVsIG5hbWUgcGFyc2VkIHVzaGVyOiBcIiArIGNoYW5uZWwpO1xyXG4gICAgcmV0dXJuIGNoYW5uZWw7XHJcbn1cclxuXHJcblxyXG4vLyBHZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2Ygc3RhcnRTdHIgYW5kIHRoZSBmaXJzdCBlbmRTdHIgYWZ0ZXIgc3RhcnRTdHIuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lQmV0d2VlblN0cmluZ3MoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsIHN0YXJ0U3RyOiBzdHJpbmcsIGVuZFN0cjogc3RyaW5nLCBlbmRPcHRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSA6IHN0cmluZyB7XHJcbiAgICBsZXQgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHN0YXJ0U3RyKTtcclxuICAgIGlmKHN0YXJ0SW5kZXggPT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHN0YXJ0SW5kZXggKz0gc3RhcnRTdHIubGVuZ3RoO1xyXG5cclxuICAgIGxldCBlbmRJbmRleCA9IHVybC5pbmRleE9mKGVuZFN0ciwgc3RhcnRJbmRleCArIDEpO1xyXG4gICAgaWYoZW5kSW5kZXggPT0gLTEpIHtcclxuICAgICAgICBpZihlbmRPcHRpb25hbCkgZW5kSW5kZXggPSB1cmwubGVuZ3RoO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsLnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbn1cclxuXHJcblxyXG4vLyBUT0RPOiBJbnN0ZWFkIG9mIHByZS1kZWZpbmVkIHVybCBmb3JtYXQsIHVzZSByZWNlbnRseSB1c2VkIG9udCBpbiBUd2l0Y2ggd2ViXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVzaGVyVXJsKGNoYW5uZWw6IHN0cmluZywgdG9rZW46IHN0cmluZywgc2lnOiBzdHJpbmcpIDogVXNoZXJVcmwge1xyXG4gICAgY29uc3QgdXNoZXJVcmwgPSBuZXcgVXNoZXJVcmwoYGh0dHBzOi8vdXNoZXIudHR2bncubmV0L2FwaS9jaGFubmVsL2hscy8ke2NoYW5uZWx9Lm0zdThgKTtcclxuICAgIHVzaGVyVXJsLnVwZGF0ZSh0b2tlbiwgc2lnKTtcclxuXHJcbiAgICAvLyBJdCBpcyBub3QgY2xlYXIgaWYgYWxsIG9mIHRoZXNlIHBhcmFtcyBhcmUgcmVxdWlyZWQgb3IgaWYgdGhlcmUgYXJlIGFueSBtaXNzaW5nIG9uZXMuXHJcbiAgICB1c2hlclVybC5zZXRRdWVyeVN0cmluZyhcInBsYXllclwiLCBcInR3aXRjaHdlYlwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwiYWxsb3dfc291cmNlXCIsIFwidHJ1ZVwiKTtcclxuICAgIHVzaGVyVXJsLnNldFF1ZXJ5U3RyaW5nKFwidHlwZVwiLCBcImFueVwiKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHVzaGVyVXJsO1xyXG59XHJcblxyXG5cclxuLy8gSW50ZXJmYWNlIHRvIGNvbW11bmljYXRlIGJldHdlZW4gYmFja2dyb3VuZCBhbmQgY29udGVudHNjcmlwdFxyXG4vLyB0byByZXF1ZXN0L3Jlc3BvbmQgYWNjZXNzIHRva2VuIFVSTCBhbmQgdXNoZXIgVVJMIGZvciBhIGNoYW5uZWwuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJsc1Jlc3BvbnNlIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIGFjY2Vzc1Rva2VuVXJsOiBzdHJpbmc7XHJcbiAgICB1c2hlclVybDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy8gQ2xhc3MgdG8gc3RvcmUgYW5kIG1hbmlwdWxhdGUgdXNoZXIgVVJMLlxyXG5leHBvcnQgY2xhc3MgVXNoZXJVcmwge1xyXG4gICAgb3JpZ2luYWxVcmw6IHN0cmluZztcclxuICAgIHVybE9iamVjdDogVVJMO1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgZXhwaXJlc0F0OiBudW1iZXI7ICAvLyBUb2tlbiBleHBpcmF0aW9uIGRhdGV0aW1lIGluIGVwb2NoIHNlY29uZHNcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxVcmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxPYmplY3QgPSBuZXcgVVJMKHVybCk7XHJcbiAgICAgICAgdGhpcy5jaGFubmVsID0gdGhpcy5nZXRDaGFubmVsKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IHRoaXMuZ2V0RXhwaXJlc0F0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVyeVN0cmluZyhcImFsbG93X2F1ZGlvX29ubHlcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cmxPYmplY3QudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHVybDogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYoZW5kSW5kZXggPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFF1ZXJ5U3RyaW5nKGtleTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnVybE9iamVjdC5zZWFyY2hQYXJhbXMuZ2V0KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFF1ZXJ5U3RyaW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5zZXQobmFtZSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4cGlyZXNBdCgpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCB0b2tlblN0cmluZyA9IHRoaXMuZ2V0UXVlcnlTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAgICBpZighdG9rZW5TdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkpzb24gPSBKU09OLnBhcnNlKHRva2VuU3RyaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgZXhwaXJlc0F0ID0gdG9rZW5Kc29uLmV4cGlyZXMgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlc0F0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYENhbm5vdCBwYXJzZSB0b2tlbiBpbiB1c2hlciBVUkwuIEVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbm5lbCgpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21Vc2hlclVybCh0aGlzLm9yaWdpbmFsVXJsKTtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3VG9rZW46IHN0cmluZywgbmV3U2lnOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwidG9rZW5cIiwgbmV3VG9rZW4pO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlcnlTdHJpbmcoXCJzaWdcIiwgbmV3U2lnKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXJ5U3RyaW5nKFwicFwiLCB0aGlzLmdldFJhbmRvbU51bWJlcigpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuZXhwaXJlc0F0ID0gdGhpcy5nZXRFeHBpcmVzQXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21OdW1iZXIoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IGJ1aWxkVXNoZXJVcmwsIHBhcnNlQXVkaW9Pbmx5VXJsIH0gZnJvbSBcIi4vdXJsXCI7XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQ29udGVudCh1cmw6IHN0cmluZykge1xyXG4gICAgaWYoIXVybCkgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgc3RhdHVzIGlmIG9rXHJcbiAgICBjb25zdCByZXNwVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgIHJldHVybiByZXNwVGV4dDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHJlc3BUZXh0ID0gYXdhaXQgZmV0Y2hDb250ZW50KHVybCk7XHJcbiAgICBpZihyZXNwVGV4dCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BKc29uID0gSlNPTi5wYXJzZShyZXNwVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwSnNvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgY291bGQgbm90IGJlIHBhcnNlZCB0byBKU09OOiBcIiArIHJlc3BUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEF1ZGlvU3RyZWFtVXJsKHVzaGVyVXJsOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmZXRjaENvbnRlbnQodXNoZXJVcmwpO1xyXG4gICAgY29uc3Qgc3RyZWFtVXJsID0gcGFyc2VBdWRpb09ubHlVcmwoY29udGVudCk7XHJcbiAgICByZXR1cm4gc3RyZWFtVXJsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNoZXJVcmwoY2hhbm5lbDogc3RyaW5nLCB0b2tlblVybDogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAvLyBHZXQgbmV3IHRva2VuIGFuZCBzaWcgZnJvbSBhY2Nlc3MgdG9rZW4gVVJMXHJcbiAgICBjb25zdCByZXNwSnNvbiA9IGF3YWl0IGZldGNoSnNvbih0b2tlblVybCk7XHJcbiAgICBpZighcmVzcEpzb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgdG9rZW4gPSByZXNwSnNvbi50b2tlbiBhcyBzdHJpbmc7XHJcbiAgICBjb25zdCBzaWcgPSByZXNwSnNvbi5zaWcgYXMgc3RyaW5nO1xyXG4gICAgaWYoIXRva2VuIHx8ICEgc2lnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBuZXcgb25lIGFuZCBzdG9yZSBpdFxyXG4gICAgY29uc3QgdXNoZXJVcmwgPSBidWlsZFVzaGVyVXJsKGNoYW5uZWwsIHRva2VuLCBzaWcpO1xyXG4gICAgcmV0dXJuIHVzaGVyVXJsLmdldFVybCgpOyAgICBcclxufSIsIlxyXG5pbXBvcnQgeyBmZXRjaFVzaGVyVXJsLCBmZXRjaEF1ZGlvU3RyZWFtVXJsIH0gZnJvbSBcIi4vZmV0Y2hcIjtcclxuaW1wb3J0IHsgZ2V0Q2hhbm5lbEZyb21XZWJVcmwsIEdldFVybHNSZXNwb25zZSB9IGZyb20gXCIuL3VybFwiO1xyXG5cclxuXHJcbi8vIFRPRE86IEFueSBiZXR0ZXIgd2F5IHRoYW4gSFRNTCBhcyBzdHJpbmc/XHJcbmNvbnN0IGluaXRpYWxCdXR0b25Eb20gPSBgXHJcbjxkaXYgY2xhc3M9XCJ0dy1pbmxpbmUtZmxleCB0dy1yZWxhdGl2ZSB0dy10b29sdGlwLXdyYXBwZXJcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJhdWRpby1vbmx5LWJ1dHRvbiB0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctYWxpZ24tbWlkZGxlIHR3LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYnV0dG9uLWljb24gdHctYnV0dG9uLWljb24tLW92ZXJsYXkgdHctY29yZS1idXR0b24gdHctY29yZS1idXR0b24tLW92ZXJsYXkgdHctaW5saW5lLWZsZXggdHctaW50ZXJhY3RpdmUgdHctanVzdGlmeS1jb250ZW50LWNlbnRlciB0dy1vdmVyZmxvdy1oaWRkZW4gdHctcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICBkYXRhLWEtdGFyZ2V0PVwiYXVkaW8tb25seS1idXR0b25cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiQXVkaW8gb25seVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0dy1hbGlnbi1pdGVtcy1jZW50ZXIgdHctZmxleCB0dy1mbGV4LWdyb3ctMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3LWJ1dHRvbi1pY29uX19pY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWljb24tZGl2XCIgc3R5bGU9XCJ3aWR0aDogMnJlbTsgaGVpZ2h0OiAycmVtO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gR29vZ2xlIE1hdGVyaWFsIERlc2lnbiBSYWRpbyBJY29uLiBBcGFjaGUgTGljZW5zZSB2Mi4wIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJ0dy1pY29uX19zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zLjI0IDYuMTVDMi41MSA2LjQzIDIgNy4xNyAyIDh2MTJjMCAxLjEuODkgMiAyIDJoMTZjMS4xMSAwIDItLjkgMi0yVjhjMC0xLjExLS44OS0yLTItMkg4LjNsOC4yNi0zLjM0TDE1Ljg4IDEgMy4yNCA2LjE1ek03IDIwYy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3ptMTMtOGgtMnYtMmgtMnYySDRWOGgxNnY0elwiLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxkaXYgY2xhc3M9XCJ0dy10b29sdGlwIHR3LXRvb2x0aXAtLWFsaWduLWxlZnQgdHctdG9vbHRpcC0tdXBcIiBkYXRhLWEtdGFyZ2V0PVwidHctdG9vbHRpcC1sYWJlbFwiIHJvbGU9XCJ0b29sdGlwXCI+XHJcbiAgICAgICAgUmFkaW8gbW9kZVxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG4gICBcclxuXHJcbmNvbnN0IHZpZGVvUGxheWVyQ2xhc3MgPSBcInZpZGVvLXBsYXllclwiO1xyXG5jb25zdCB2aWRlb1BsYXllclByb2Nlc3NlZENsYXNzID0gXCJ2aWRlby1wbGF5ZXItcHJvY2Vzc2VkXCI7XHJcbmNvbnN0IGNvbnRyb2xHcm91cENsYXNzID0gXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiO1xyXG5jb25zdCBjb250cm9sR3JvdXBQcm9jZXNzZWRDbGFzcyA9IFwiY29udHJvbC1ncm91cC1wcm9jZXNzZWRcIjtcclxuY29uc3QgcGxheUJ1dHRvbkF0dHIgPSBcImJ1dHRvbltkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItcGxheS1wYXVzZS1idXR0b24nXVwiO1xyXG5jb25zdCB2b2x1bWVTbGlkZXJBdHRyID0gXCJpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddXCI7XHJcblxyXG5jb25zdCByYWRpb0J1dHRvblBhdXNlZENsYXNzID0gXCJhdWRpby1vbmx5LWJ1dHRvbi1wYXVzZWRcIjtcclxuY29uc3QgcmFkaW9CdXR0b25QbGF5aW5nQ2xhc3MgPSBcImF1ZGlvLW9ubHktYnV0dG9uLXBsYXlpbmdcIjtcclxuY29uc3QgcmFkaW9CdXR0b25EaXNhYmxlZENsYXNzID0gXCJhdWRpby1vbmx5LWJ1dHRvbi1kaXNhYmxlZFwiO1xyXG5cclxuY29uc3QgYXR0ck9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBzdWJ0cmVlOiBmYWxzZSB9O1xyXG5jb25zdCBkb21PYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogZmFsc2UsIGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgVmlkZW9QbGF5ZXJDb250YWluZXIsIGFkZCBNdXRhdGlvbk9ic2VydmVyIHRvIFxyXG4gKiAxLiBkb2N1bWVudC5ib2R5IGNoZWNrcyBmb3Igb25lIHN1YnRyZWUgY2hhbmdlXHJcbiAqICAgMS0yLiBJZiBkaXYgd2l0aCBjbGFzcyBcInZpZGVvLXBsYXllclwiLCBwcm9jZXNzIGl0LiBDaGVjayAjMlxyXG4gKiBcclxuICogMi4gQ3JlYXRlIFZpZGVvUGxheWVyLCB2aWRlby1wbGF5ZXIgY2xhc3MgZGl2IGNoZWNrcyBmb3IgMSBhdHRyaWJ1dGUgY2hhbmdlLCAzIHN1YnRyZWUgY2hhbmdlc1xyXG4gKiAgIDItMS4gYXR0cmlidXRlIFwiZGF0YS1hLXBsYXllci10eXBlXCI6IFwic2l0ZVwiLCBcInNpdGVfbWluaVwiLCBcImNsaXBzLXdhdGNoXCJcclxuICogICAgIDItMi0yLiBDaGFuZ2UgdGhlIG1vZGUgb2YgVmlkZW9QbGF5ZXIgaWYgbmVjZXNzYXJ5XHJcbiAqICAgICAyLTItMy4gTW9kZTogVHVwbGUgb2YgKGxheW91dCwgdmlkZW9fdHlwZSkuXHJcbiAqICAgICAgIDItMi0zLTEuIGxheW91dDogXCJzaXRlXCIgfCBcInNpdGVfbWluaVwiXHJcbiAqICAgICAgIDItMi0zLTIuIHZpZGVvX3R5cGU6IFwibGl2ZVwiLCBcInZvZFwiLCBcImNsaXBcIi4uIGFuZCBtb3JlPz8/Pz9cclxuICogICAyLTIuIHN1YnRyZWUgZGl2IHdpdGggY2xhc3MgXCJ2b2Qtc2Vla2Jhci10aW1lLWxhYmVsc1wiIGFuZCBcInNlZWtiYXItaW50ZXJhY3Rpb24tYXJlYVwiXHJcbiAqICAgICAyLTItMS4gVGhpcyBvbmx5IGFwcGVhcnMgaW4gVk9EIHdhdGNoXHJcbiAqICAgICAyLTItMi4gSWYgY3JlYXRlZCwgY2hhbmdlIHRoZSBtb2RlIG9mIFZpZGVvUGxheWVyIHRvIFZPRFxyXG4gKiAgICAgMi0yLTMuIElmIHJlbW92ZWQgKGNoYW5nZWQgZnJvbSBWT0QgdG8gbGl2ZS9jbGlwKSwgPz8/P1xyXG4gKiAgIDItMy4gY2hlY2sgZm9yIGNvbnRyb2wgZ3JvdXAgXCJwbGF5ZXItY29udHJvbHNfX2xlZnQtY29udHJvbC1ncm91cFwiXHJcbiAqICAgICAyLTMtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzMgZm9yIGFjdGlvbnNcclxuICogICAgIDItMy0yLiBJZiByZW1vdmVkLCA/Pz8/P1xyXG4gKiAgIDItNC4gY2hlY2sgZm9yIFwidmlkZW9cIiBlbGVtZW50IGluIHRoZSBwbGF5ZXJcclxuICogICAgIDItNC0xLiBJZiBjcmVhdGVkLCBjaGVjayAjNiBmb3IgYWN0aW9uc1xyXG4gKiAgICAgMi00LTIuIElmIHJlbW92ZWQsID8/Pz8/XHJcbiAqIFxyXG4gKiAzLiBDb250cm9sIGdyb3VwIFwicGxheWVyLWNvbnRyb2xzX19sZWZ0LWNvbnRyb2wtZ3JvdXBcIiBjaGVja3MgZm9yIFxyXG4gKiAgIDMtMS4gc3VidHJlZSBidXR0b25bZGF0YS1hLXRhcmdldD0ncGxheWVyLXBsYXktcGF1c2UtYnV0dG9uJ10gZm9yIHZpZGVvIHBsYXkvcGF1c2UgYnV0dG9uXHJcbiAqICAgICAzLTEtMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzRcclxuICogICAgIDMtMS0yLiBJZiByZW1vdmVkICh3aGVuIHBsYXllciB0eXBlIGNoYW5nZWQgZnJvbSBcInNpdGVcIiB0byBcInNpdGVfbWluaVwiLCBldGMpLCA/Pz8/P1xyXG4gKiAgIDMtMi4gc3VidHJlZSBpbnB1dFtkYXRhLWEtdGFyZ2V0PSdwbGF5ZXItdm9sdW1lLXNsaWRlciddIGZvciB2b2x1bWUgc2xpZGVyXHJcbiAqICAgICAzLTItMS4gSWYgY3JlYXRlZCwgY2hlY2sgIzVcclxuICogICAgIDMtMi0yLiBJZiByZW1vdmVkICh3aGVuIHBsYXllciB0eXBlIGNoYW5nZWQgZnJvbSBcInNpdGVcIiB0byBcInNpdGVfbWluaVwiLCBldGMpLCA/Pz8/P1xyXG4gKiAgIDMtMy4gSWYgYm90aCBjb21wb25lbnRzIGluIDMtMSBhbmQgMy0yIGFyZSByZWFkeTpcclxuICogICAgIDMtMy0xLiBDcmVhdGUgcmFkaW8gbW9kZSBidXR0b24sIGFuZCBwdXQgTXV0YXRpb25PYnNlcnZlciAoc2VlICM0IGFuZCAjNSlcclxuICogICAgIDMtMy0yLiBJZiBhdCBsZWFzdCBvbmUgY29tcG9uZW50IGlzIHJlbW92ZWQgKHNpdGUtPnNpdGVfbWluaSBjaGFuZ2UsIGV0YylcclxuICogICAgICAgMy0zLTItMS4gYWxzbyByZW1vdmUgdGhlIHJhZGlvIG1vZGUgYnV0dG9uIGZyb20gRE9NXHJcbiAqIFxyXG4gKiA0LiBWaWRlbyBwbGF5L3BhdXNlIGJ1dHRvbiBjaGVja3MgZm9yXHJcbiAqICAgNC0xLiBBdHRyaWJ1dGUgY2hhbmdlIFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiOiBcInBsYXlpbmdcIiBvciBcInBhdXNlZFwiXHJcbiAqICAgICA0LTEtMS4gSWYgYXR0cmlidXRlIHZhbHVlIGNoYW5nZWQgdG8gXCJwbGF5aW5nXCIsIHN0b3AgYWxsIGF1ZGlvIGluIHRoZSBWaWRlb1BsYXllckNvbnRhaW5lclxyXG4gKiBcclxuICogNS4gVm9sdW1lIHNsaWRlciBjaGVja3MgZm9yXHJcbiAqICAgNS0xLiBBdHRyaWJ1dGUgXCJ2YWx1ZVwiIGNoYW5nZTogbnVtYmVyIGJldHdlZW4gMCA8PSBudW0gPD0gMVxyXG4gKiAgICAgNS0xLTEuIElmIGNoYW5nZSBpcyBkZXRlY3RlZCwgYXBwbHkgdGhlIG5ldyB2b2x1bWUgdG8gYXVkaW9FbGVtLlxyXG4gKiBcclxuICogNi4gb3JpZ2luYWwgXCJ2aWRlb1wiIGVsZW1lbnQgaW4gdmlkZW8tcGxheWVyIGNoZWNrcyBmb3JcclxuICogICA2LTEuIEF0dHJpYnV0ZSBcInNyY1wiIGNoYW5nZTogbWVhbnMgdGhhdCB0aGUgdmlkZW8gc291cmNlIGNoYW5nZWQgKGxpa2VseSBob3N0aW5nIGFub3RoZXIgc3RyZWFtZXIpXHJcbiAqICAgICA2LTEtMS4gUmFkaW8gbW9kZSBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkPyBSZS1jb25maWd1cmVkIHdpdGggdGhlIG5ldyBzdHJlYW1lcidzIFVSTD9cclxuICogICAgXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEhvdyB0byBkZXRlY3QgdGhlIGNoYW5uZWwgb2YgdGhlIHN0cmVhbSBiZWluZyBwbGF5ZWQ/XHJcbiAqIEdldHRpbmcgY2hhbm5lbCBuYW1lIGZyb20gVVJMIGhhcyB0aGUgZm9sbGxvd2luZyBpc3N1ZXNcclxuICogKDEpIFN0cmVhbWVyIGhvc3RpbmcgYW5vdGhlciBjaGFubmVsXHJcbiAqICgyKSBNYWluIHBhZ2UuIENoYW5uZWwgY2FuIGNoYW5nZSBxdWlja2x5IGluIHRoZSBjYXJvdXNlbFxyXG4gKiBcclxuICogUHJvcG9zZWQgc29sdXRpb246XHJcbiAqICgxKSBLZWVwIHRoZSBsYXN0IHJlcXVlc3RlZCB1c2hlciBVUkwgaW4gdGhlIHRhYi4gR3Vlc3MgdGhlIGNoYW5uZWwgZnJvbSB0aGVyZVxyXG4gKiAoMikgRm9yIFwic2l0ZV9taW5pXCIgc3RhdGUsIHN0b3JlIHRoZSBjaGFubmVsIG5hbWUgaW4gdmlkZW8gcGxheWVyLlxyXG4gKiAgICAgSW4gdGhhdCBjYXNlLCBpdCB3aWxsIGJlIHBvc3NpYmxlIHRvIHJlc3VtZSBwbGF5aW5nIGluIHRoZSByaWdodCBjaGFubmVsLlxyXG4gKiAoMykgRGlzYWJsZSB0aGUgcmFkaW8gbW9kZSBidXR0b24gaW4gdGhlIG1haW4gcGFnZVxyXG4gKiBcclxuICovXHJcblxyXG4vKipcclxuICogQWRkIHJhZGlvIG1vZGUgYnV0dG9uIGluIHNpdGVfbWluaT9cclxuICogRG9uJ3Qgc3RvcmUgdGhlIHBsYXlzdGF0ZSBpbiBET006IG9ubHkgc3RvcmUgaXQgaW4gVmlkZW9QbGF5ZXIgY2xhc3MgYXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcclxuICovXHJcblxyXG4vKipcclxuICogRVNwb3J0cyBwYWdlOiB2aWRlbyBtaW5pcGxheWVyIGtlZXBzIHBsYXlpbmcgZXZlbiB3aGVuIHRoZSBzaXRlIHBsYXllciBpbiBFc3BvcnRzIHBhZ2UgaXMgYWxzbyBiZWluZyBwbGF5ZWQuXHJcbiAqIFNob3VsZCB0aGUgcmFkaW8gbW9kZSBmb2xsb3cgdGhlIHNhbWUgYmVoYXZpb3I/XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFjY2VzcyB0b2tlbiB1cmwgaGFzIG9hdXRoIGNvZGUsIHdoaWNoIGlzIHVuZGVmaW5lZCBpZiB0aGUgdXNlciBpcyBub3QgbG9nZ2VkIGluLlxyXG4gKiBOb3Qgc3VyZSBob3cgVHdpdGNoIHJldHVybnMgY29ycmVjdCByZXNwb25zZSBmb3IgYW5vbnltb3VzIHVzZXIgeWV0LlxyXG4gKiBDYWxsaW5nIHRoZSBzYW1lIGFjY2VzcyB0b2tlbiBVUkwgZnJvbSBjb250ZW50c2NyaXB0IHJldHVybnMgZXJyb3IuXHJcbiAqIFxyXG4gKiBQcm9wb3NlZCBzb2x1dGlvbjpcclxuICogKDEpIERpc2FibGUgdGhlIGJ1dHRvbiB3aGVuIHVzZXIgaXMgbm90IGxvZ2dlZCBpbi5cclxuICovXHJcblxyXG5cclxuY29uc3QgZW51bSBQbGF5aW5nU3RhdGUge1xyXG4gICAgRElTQUJMRUQsXHJcbiAgICBQQVVTRUQsXHJcbiAgICBQTEFZSU5HLFxyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udHJvbEdyb3VwIHtcclxuICAgIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWVyOiBWaWRlb1BsYXllcjtcclxuICAgIHBsYXlCdXR0b25FbGVtOiBIVE1MRWxlbWVudDtcclxuICAgIHZvbHVtZVNsaWRlckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcmFkaW9CdXR0b246IEhUTUxFbGVtZW50O1xyXG4gICAgY29tcG9uZW50c09ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgcGxheUJ1dHRvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdm9sdW1lT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcjogVmlkZW9QbGF5ZXIsIGNvbnRyb2xHcm91cEVsZW06IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtID0gY29udHJvbEdyb3VwRWxlbTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy50cnlVcGRhdGluZ0NvbXBvbmVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNvbnRyb2xHcm91cEVsZW0sIGRvbU9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ0NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBQbGF5L0F1ZGlvIGJ1dHRvbiBhbmQgdm9sdW1lIHNsaWRlciBcclxuICAgICAgICBjb25zdCBwbGF5QnV0dG9uRWxlbTogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLmNvbnRyb2xHcm91cEVsZW0ucXVlcnlTZWxlY3RvcihwbGF5QnV0dG9uQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1BsYXlCdXR0b25FbGVtKHBsYXlCdXR0b25FbGVtKTtcclxuICAgICAgICBjb25zdCB2b2x1bWVTbGlkZXJFbGVtOiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5jb250cm9sR3JvdXBFbGVtLnF1ZXJ5U2VsZWN0b3Iodm9sdW1lU2xpZGVyQXR0cik7XHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbSk7XHJcbiAgICAgICAgLy8gQWRkIHRoZSByYWRpbyBidXR0b24gaWYgbm90IGV4aXN0c1xyXG4gICAgICAgIHRoaXMudHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeVVwZGF0aW5nUGxheUJ1dHRvbkVsZW0ocGxheUJ1dHRvbkVsZW06IEhUTUxCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgLy8gcGxheSBidXR0b24gY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighcGxheUJ1dHRvbkVsZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBwbGF5QnV0dG9uRWxlbS5jbGFzc0xpc3Q7XHJcbiAgICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMucGxheUJ1dHRvbkVsZW0uIElnbm9yZS5cclxuICAgICAgICBpZihjbGFzc2VzLmNvbnRhaW5zKFwicGxheS1wYXVzZS1idXR0b24tcHJvY2Vzc2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoXCJwbGF5LXBhdXNlLWJ1dHRvbi1wcm9jZXNzZWRcIik7XHJcblxyXG4gICAgICAgIC8vIElmIGV4aXN0cywgcmVtb3ZlIHRoZSBleGlzdGluZyBvbmVcclxuICAgICAgICBpZih0aGlzLnBsYXlCdXR0b25FbGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUJ1dHRvbkVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gcGxheUJ1dHRvbkVsZW1cclxuICAgICAgICBsZXQgcGxheUJ1dHRvbkNhbGxiYWNrOiBNdXRhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24obXV0YXRpb25MaXN0LCBvYnNlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMucGxheUJ1dHRvbkVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1hLXBsYXllci1zdGF0ZVwiKTtcclxuICAgICAgICAgICAgaWYoc3RhdGUgPT0gXCJwbGF5aW5nXCIpIHsgIC8vIFZpZGVvIHN0YXRlIGZyb20gcGF1c2VkIHRvIHBsYXlpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnBhdXNlKCk7ICAvLyBQYXVzZSBhdWRpb1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIocGxheUJ1dHRvbkNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbk9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5QnV0dG9uRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlVcGRhdGluZ1ZvbHVtZXNsaWRlckVsZW0odm9sdW1lU2xpZGVyRWxlbTogSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICAgIC8vIHZvbHVtZSBzbGlkZXIgY2Fubm90IGJlIGZvdW5kIGluIHRoZSBjb250cm9sIGdyb3VwLiBSZW1vdmUgcmVmZXJlbmNlIHRvIHRoZSBkZWxldGVkIG5vZGVcclxuICAgICAgICBpZighdm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB2b2x1bWVTbGlkZXJFbGVtLmNsYXNzTGlzdDtcclxuICAgICAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIGFscmVhZHkgYWRkZWQgdG8gdGhpcy52b2x1bWVTbGlkZXJFbGVtLiBJZ25vcmUuXHJcbiAgICAgICAgaWYoY2xhc3Nlcy5jb250YWlucyhcInZvbHVtZS1zbGlkZXItcHJvY2Vzc2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3Nlcy5hZGQoXCJ2b2x1bWUtc2xpZGVyLXByb2Nlc3NlZFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgZXhpc3RzLCByZW1vdmUgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICAgIGlmKHRoaXMudm9sdW1lU2xpZGVyRWxlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudm9sdW1lU2xpZGVyRWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckVsZW0gPSB2b2x1bWVTbGlkZXJFbGVtO1xyXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgdG8gdm9sdW1lU2xpZGVyXHJcbiAgICAgICAgbGV0IHZvbHVtZUNoYW5nZUNhbGxiYWNrOiBNdXRhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24obXV0YXRpb25MaXN0LCBvYnNlcnZlcikge1xyXG4gICAgICAgICAgICBpZih0aGlzLnBsYXllci5hdWRpb0VsZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IHRoaXMudm9sdW1lU2xpZGVyRWxlbS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmF1ZGlvRWxlbS52b2x1bWUgPSB2b2x1bWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52b2x1bWVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHZvbHVtZUNoYW5nZUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudm9sdW1lT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZvbHVtZVNsaWRlckVsZW0sIGF0dHJPYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdSYWRpb0J1dHRvbigpIHtcclxuICAgICAgICAvLyBEb24ndCBwcm9jZWVkIGlmIGJvdGggcGxheUJ1dHRvbkVsZW0gYW5kIHZvbHVtZVNsaWRlckVsZW0gYXJlIGF2YWlsYWJsZVxyXG4gICAgICAgIGlmKCF0aGlzLnBsYXlCdXR0b25FbGVtIHx8ICF0aGlzLnZvbHVtZVNsaWRlckVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGJ1dHRvbiB3YXMgYWxyZWFkeSBjcmVhdGVkLCBkbyBub3RoaW5nXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBpZihjbGFzc2VzPy5jb250YWlucyhcInJhZGlvLWJ1dHRvbi1wcm9jZXNzZWRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogVXNlIHdlYnBhY2sgaHRtbCBsb2FkZXJcclxuICAgICAgICAvLyBUT0RPOiBEaXNhYmxlIHRoZSBidXR0b24gaW4gY2xpcCBhbmQgKGFsc28gVk9EPylcclxuICAgICAgICBjb25zdCBidXR0b25XcmFwcGVyRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGJ1dHRvbldyYXBwZXJEb20uaW5uZXJIVE1MID0gaW5pdGlhbEJ1dHRvbkRvbTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24gPSBidXR0b25XcmFwcGVyRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdO1xyXG4gICAgICAgIHRoaXMucmFkaW9CdXR0b24uY2xhc3NMaXN0LmFkZChcInJhZGlvLWJ1dHRvbi1wcm9jZXNzZWRcIik7XHJcbiAgICAgICAgbGV0IHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3M7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGxheWVyLnBsYXlpbmdTdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvbkRpc2FibGVkQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAgICAgc3RhdGVDbGFzcyA9IHJhZGlvQnV0dG9uUGF1c2VkQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBQbGF5aW5nU3RhdGUuUExBWUlORzpcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2xhc3MgPSByYWRpb0J1dHRvblBsYXlpbmdDbGFzcztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uLmNsYXNzTGlzdC5hZGQoc3RhdGVDbGFzcyk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbi5vbmNsaWNrID0gdGhpcy5wbGF5ZXIub25SYWRpb0J1dHRvbkNsaWNrZWQuYmluZCh0aGlzLnBsYXllcik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXBFbGVtLmFwcGVuZENoaWxkKGJ1dHRvbldyYXBwZXJEb20pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZvclBsYXkoKSB7XHJcbiAgICAgICAgLy8gTk9URTogVGhlcmUgaXMgMX4zIHNlY29uZHMgb2YgZGVsYXkgYmV0d2VlbiBhdWRpby1vbmx5IGJ1dHRvbiBjbGljayBhbmQgc291bmQgYmVpbmcgcGxheWVkLlxyXG4gICAgICAgIC8vIEl0J3MgYmV0dGVyIHRvIHNob3cgc29tZSBpbnRlcm1lZGlhdGUgc3RhdGUgKGljb24gY2hhbmdlLCBtb3VzZSBjdXJzb3IgY2hhbmdlLCBldGMpIGluIHRoZSBtZWFud2hpbGVcclxuXHJcbiAgICAgICAgLy8gU3RvcCB0aGUgdmlkZW8gaWYgcGxheWluZ1xyXG4gICAgICAgIGNvbnN0IHZpZGVvU3RhdGUgPSB0aGlzLnBsYXlCdXR0b25FbGVtPy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWEtcGxheWVyLXN0YXRlXCIpO1xyXG4gICAgICAgIGlmKHZpZGVvU3RhdGUgPT0gXCJwbGF5aW5nXCIpIHtcclxuICAgICAgICAgICAgLy8gSXMgdGhlcmUgYSBiZXR0ZXIgd2F5IHRvIHBhdXNlIHZpZGVvIHRoYW4gdGhpcyBcImNsaWNrXCIgaGFjaz9cclxuICAgICAgICAgICAgdGhpcy5wbGF5QnV0dG9uRWxlbS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QYXVzZWRDbGFzcyk7XHJcbiAgICAgICAgY2xhc3Nlcz8uYWRkKHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25EaXNhYmxlZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JQYXVzZSgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBjbGFzc2VzPy5hZGQocmFkaW9CdXR0b25QYXVzZWRDbGFzcyk7XHJcbiAgICAgICAgY2xhc3Nlcz8ucmVtb3ZlKHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25EaXNhYmxlZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVGb3JEaXNhYmxlZCgpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgdGhlIHJhZGlvIGJ1dHRvbiBpY29uXHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMucmFkaW9CdXR0b24/LmNsYXNzTGlzdDtcclxuICAgICAgICBjbGFzc2VzPy5yZW1vdmUocmFkaW9CdXR0b25QYXVzZWRDbGFzcyk7XHJcbiAgICAgICAgY2xhc3Nlcz8ucmVtb3ZlKHJhZGlvQnV0dG9uUGxheWluZ0NsYXNzKTtcclxuICAgICAgICBjbGFzc2VzPy5hZGQocmFkaW9CdXR0b25EaXNhYmxlZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c09ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnV0dG9uT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLnZvbHVtZU9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBWaWRlb1BsYXllciB7XHJcbiAgICBwbGF5ZXJJZDogc3RyaW5nO1xyXG4gICAgY29udGFpbmVyOiBWaWRlb1BsYXllckNvbnRhaW5lcjtcclxuICAgIHBsYXllckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgcGxheWluZ1N0YXRlOiBQbGF5aW5nU3RhdGU7XHJcbiAgICBhdHRyaWJ1dGVPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcclxuICAgIGNvbnRyb2xHcm91cDogQ29udHJvbEdyb3VwO1xyXG4gICAgY29udHJvbEdyb3VwT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICBobHM6IEhscztcclxuICAgIGF1ZGlvRWxlbTogSFRNTFZpZGVvRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJZDogc3RyaW5nLCBjb250YWluZXI6IFZpZGVvUGxheWVyQ29udGFpbmVyLCBwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0gPSBwbGF5ZXJFbGVtO1xyXG4gICAgICAgIHRoaXMucGxheWluZ1N0YXRlID0gUGxheWluZ1N0YXRlLlBBVVNFRDtcclxuXHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlQ2FsbGJhY2s6IE11dGF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbihtdXRhdGlvbnMsIG9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZihtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09IFwiZGF0YS1hLXBsYXllci10eXBlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGF5ZXJUeXBlID0gdGhpcy5wbGF5ZXJFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtYS1wbGF5ZXItdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2gocGxheWVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2l0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAvLyBzdGF0ZSBjaGFuZ2UgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNpdGVfbWluaVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjbGlwcy13YXRjaFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoYXR0cmlidXRlQ2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVPYnNlcnZlci5vYnNlcnZlKHRoaXMucGxheWVyRWxlbSwgYXR0ck9ic2VydmVyQ29uZmlnKTtcclxuXHJcbiAgICAgICAgdGhpcy50cnlVcGRhdGluZ0NvbnRyb2xHcm91cCgpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xHcm91cENhbGxiYWNrOiBNdXRhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24obXV0YXRpb25zLCBvYnNlcnZlcikge1xyXG4gICAgICAgICAgICB0aGlzLnRyeVVwZGF0aW5nQ29udHJvbEdyb3VwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjb250cm9sR3JvdXBDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cE9ic2VydmVyLm9ic2VydmUodGhpcy5wbGF5ZXJFbGVtLCBkb21PYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5VXBkYXRpbmdDb250cm9sR3JvdXAoKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRyb2wgZ3JvdXAgRE9NIGlzIHJlYWR5XHJcbiAgICAgICAgY29uc3QgY29udHJvbEdyb3VwRWxlbSA9IHRoaXMucGxheWVyRWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRyb2xHcm91cENsYXNzKT8uWzBdO1xyXG4gICAgICAgIGlmKCFjb250cm9sR3JvdXBFbGVtKSB7ICAvLyBjb250cm9sIGdyb3VwIGNhbm5vdCBiZSBmb3VuZCBpbiBET01cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTsgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlIHRvIHRoZSByZW1vdmVkIERPTVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9jZXNzZWQgY2xhc3MgbmFtZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjb250cm9sR3JvdXBFbGVtLmNsYXNzTGlzdDtcclxuICAgICAgICBpZihjbGFzc2VzLmNvbnRhaW5zKGNvbnRyb2xHcm91cFByb2Nlc3NlZENsYXNzKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzZXMuYWRkKGNvbnRyb2xHcm91cFByb2Nlc3NlZENsYXNzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cCA9IG5ldyBDb250cm9sR3JvdXAodGhpcywgY29udHJvbEdyb3VwRWxlbSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheShtZWRpYVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYoIW1lZGlhVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJObyBtZWRpYVVybCBpcyBmb3VuZCB0byBwbGF5XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXVkaW9FbGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJBdWRpbyBlbGVtZW50IGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSA8dmlkZW8+IGVsZW1lbnQgdG8gcGxheSBhdWRpby5cclxuICAgICAgICAvLyA8YXVkaW8+IGNhbiBiZSBhbHNvIHVzZWQgYnkgaGxzLmpzLCBidXQgVHlwZXNjcmlwdCBmb3JjZXMgdGhpcyB0byBiZSBIVE1MVmlkZW9FbGVtZW50LlxyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLnBsYXllckVsZW0uYXBwZW5kQ2hpbGQodGhpcy5hdWRpb0VsZW0pO1xyXG4gICAgICAgIHRoaXMuaGxzID0gbmV3IEhscyh7XHJcbiAgICAgICAgICAgIC8vZGVidWc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpdmVTeW5jRHVyYXRpb246IDAsXHJcbiAgICAgICAgICAgIGxpdmVNYXhMYXRlbmN5RHVyYXRpb246IDUsXHJcbiAgICAgICAgICAgIGxpdmVEdXJhdGlvbkluZmluaXR5OiB0cnVlICAvLyB0cnVlIGZvciBsaXZlIHN0cmVhbVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGxzLmxvYWRTb3VyY2UobWVkaWFVcmwpO1xyXG4gICAgICAgIHRoaXMuaGxzLmF0dGFjaE1lZGlhKHRoaXMuYXVkaW9FbGVtKTsgXHJcbiAgICAgICAgLy8gVE9ETzogSXMgdGhpcyBzYWZlIHRvIHBsYXkgcmlnaHQgYXdheSBhZnRlciBhdHRhY2hpbmcgdGhlIG1lZGlhP1xyXG4gICAgICAgIC8vIFRoZSBtYWluIGV4YW1wbGUgYXQgaGxzLmpzIHdlYnNpdGUgdGVsbHMgdG8gdXNlIE1BTklGRVNUX1BBUlNFRCBldmVudCxcclxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIHRoZSBldmVudCBpcyBub3QgdHJpZ2dlcmVkIHdpdGggdHlwZXNjcmlwdCt3ZWJwYWNrLlxyXG4gICAgICAgIGNvbnN0IGF1ZGlvUGxheUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheSBzdGFydGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmF1ZGlvRWxlbS5wbGF5KCkudGhlbihhdWRpb1BsYXlDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QTEFZSU5HO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgaWYodGhpcy5obHMpIHtcclxuICAgICAgICAgICAgdGhpcy5hdWRpb0VsZW0ucGF1c2UoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuc3RvcExvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGV0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgdGhpcy5obHMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyB0aGF0IHRoZSBITFMgb2JqZWN0IGdldHMgc3R1Y2sgYWZ0ZXIgbXVsdGlwbGUgcGxheXMgYW5kIHBhdXNlc1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyByZS11c2VkIGZvciB0aGUgbmV4dCBwbGF5LiBOZWVkIHRvIGRlc3Ryb3kgdGhlIG9iamVjdCBhbmQgcmUtY3JlYXRlIGl0LlxyXG4gICAgICAgICAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyRWxlbS5yZW1vdmVDaGlsZCh0aGlzLmF1ZGlvRWxlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5aW5nU3RhdGUgPSBQbGF5aW5nU3RhdGUuUEFVU0VEO1xyXG4gICAgICAgIHRoaXMuY29udHJvbEdyb3VwPy51cGRhdGVGb3JQYXVzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7ICAvLyBXaGF0IGVsc2UgdG8gZG8gaGVyZT9cclxuICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sR3JvdXA/LmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0UGxheSgpIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gZ2V0Q2hhbm5lbEZyb21XZWJVcmwoKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZUNhbGxiYWNrID0gYXN5bmMgZnVuY3Rpb24ocmVzcG9uc2U6IEdldFVybHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwicmVzcG9uc2UgZm9yIGdldF9hdWRpb191cmwgcmVjZWl2ZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgaWYoIXJlc3BvbnNlPy5jaGFubmVsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB1c2hlclVybCA9IHJlc3BvbnNlLnVzaGVyVXJsO1xyXG4gICAgICAgICAgICBpZighdXNoZXJVcmwpIHtcclxuICAgICAgICAgICAgICAgIHVzaGVyVXJsID0gYXdhaXQgZmV0Y2hVc2hlclVybChyZXNwb25zZS5jaGFubmVsLCByZXNwb25zZS5hY2Nlc3NUb2tlblVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGF1ZGlvU3RyZWFtVXJsID0gYXdhaXQgZmV0Y2hBdWRpb1N0cmVhbVVybCh1c2hlclVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnBhdXNlRXhjZXB0KHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXkoYXVkaW9TdHJlYW1VcmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiZ2V0X2F1ZGlvX3VybFwiLCBjaGFubmVsOiBjaGFubmVsfSwgcmVzcG9uc2VDYWxsYmFjay5iaW5kKHRoaXMpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgb25SYWRpb0J1dHRvbkNsaWNrZWQoKSB7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGxheWluZ1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWluZ1N0YXRlLlBBVVNFRDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJSYWRpbyBidXR0b24gaXMgY2xpY2tlZCBpbiBwYXVzZWQgc3RhdGVcIilcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXkoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXlpbmdTdGF0ZS5QTEFZSU5HOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyQ29udGFpbmVyIHtcclxuICAgIHBsYXllcnM6IFZpZGVvUGxheWVyW107XHJcbiAgICBuZXh0SWQ6IG51bWJlcjtcclxuICAgIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMubmV4dElkID0gMTAwMDE7ICAvLyBSYW5kb20gc3RhcnQgaW5kZXggZm9yIHBsYXllci5cclxuICAgIH1cclxuXHJcbiAgICBydW4oKSB7XHJcbiAgICAgICAgLy8gRmluZCBleGlzdGluZyB2aWRlbyBwbGF5ZXIgZWxlbWVudHMgdG8gY3JlYXRlIFZpZGVvUGxheWVyIG9iamVjdHNcclxuICAgICAgICB0aGlzLmZpbmRWaWRlb1BsYXllckVsZW1zKCk7XHJcbiAgICAgICAgLy8gRGV0ZWN0IGZ1dHVyZSB2aWRlbyBwbGF5ZXIgZWxlbWVudHNcclxuICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5maW5kVmlkZW9QbGF5ZXJFbGVtcy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgZG9tT2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRWaWRlb1BsYXllckVsZW1zKCkge1xyXG4gICAgICAgIC8vIFRPRE86IElzIGl0IGJldHRlciB0byBpdGVyYXRlIG9ubHkgdGhlIG11dGF0ZWQgZGl2cz9cclxuICAgICAgICBjb25zdCBwbGF5ZXJFbGVtcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh2aWRlb1BsYXllckNsYXNzKTtcclxuICAgICAgICBmb3IobGV0IHBsYXllckVsZW0gb2YgcGxheWVyRWxlbXMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpdiBpcyBub3QgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgaWYoIXBsYXllckVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTmV3IHZpZGVvIHBsYXllciBkZXRlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3UGxheWVyKHBsYXllckVsZW0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU5ld1BsYXllcihwbGF5ZXJFbGVtOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmKHBsYXllckVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHZpZGVvUGxheWVyUHJvY2Vzc2VkQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1BsYXllcklkID0gdmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyArIFwiLVwiICsgdGhpcy5uZXh0SWQ7XHJcbiAgICAgICAgdGhpcy5uZXh0SWQgKz0gMTtcclxuICAgICAgICBwbGF5ZXJFbGVtLmNsYXNzTGlzdC5hZGQodmlkZW9QbGF5ZXJQcm9jZXNzZWRDbGFzcyk7XHJcbiAgICAgICAgcGxheWVyRWxlbS5jbGFzc0xpc3QuYWRkKG5ld1BsYXllcklkKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFZpZGVvUGxheWVyKG5ld1BsYXllcklkLCB0aGlzLCBwbGF5ZXJFbGVtKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlRXhjZXB0KHBsYXllcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IobGV0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgaWYocGxheWVyLnBsYXllcklkICE9IHBsYXllcklkKSBwbGF5ZXIucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmVyPy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgZm9yKGxldCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJcclxuaW1wb3J0IHsgVmlkZW9QbGF5ZXJDb250YWluZXIgfSBmcm9tIFwiLi92aWRlb19wbGF5ZXJfY29udGFpbmVyXCI7XHJcblxyXG5cclxudmFyIGNvbnRhaW5lciA9IG5ldyBWaWRlb1BsYXllckNvbnRhaW5lcigpO1xyXG5jb250YWluZXIucnVuKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=