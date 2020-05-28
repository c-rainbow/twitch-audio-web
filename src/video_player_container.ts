

//var chrome = require("chrome"); 
//import chrome from "chrome";
//import "chrome";
//import Hls from "hls.js";


import { getUsherUrl, getAudioStreamUrl } from "./fetch";
import { GetUrlsResponse } from "./data_types";


// TODO: Any better way than HTML as string?
const initialButtonDom = `
<div class="tw-inline-flex tw-relative tw-tooltip-wrapper">
    <button class="audio-only-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
            data-a-target="audio-only-button"
            data-a-player-state="paused"
            aria-label="Audio only">
        <div class="tw-align-items-center tw-flex tw-flex-grow-0">
            <span class="tw-button-icon__icon">
                <div class="button-icon-div" style="width: 2rem; height: 2rem;">
                    <!-- Google Material Design Radio Icon. Apache License v2.0 -->
                    <svg class="tw-icon__svg audio-only-svg-paused" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
                    </svg>
                </div>
            </span>
        </div>
    </button>
    <div class="tw-tooltip tw-tooltip--align-left tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip">
        Audio only
    </div>
</div>
`;
   

const videoPlayerClass = "video-player";
const videoPlayerProcessedClass = "video-player-processed";
const controlGroupClass = "player-controls__left-control-group";
const playButtonAttr = "button[data-a-target='player-play-pause-button']";
const volumnSliderAttr = "input[data-a-target='player-volume-slider']";




const twitchDomain : string = "twitch.tv/";
// Non-exhuastive list of non-channel routes in twitch.tv
const nonChannels : string[] = ["directory", "videos", "u", "settings"];

function getChannelFromWebUrl(weburl?: string) : string {
    // Channel name may not be available from the main page URL
    const url = weburl || location.href;
    const channel = getNameBetweenStrings(url, twitchDomain, "/", true);
    console.log("Channel name " + channel + ", from URL: " + url)

    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (channel in nonChannels) return null;
    return channel;
}


// Get channel between the first occurance of startStr and the first endStr after startStr.
function getNameBetweenStrings(
        url: string, startStr: string, endStr: string, endOptional: boolean = false) : string {
    let startIndex = url.indexOf(startStr);
    if(startIndex == -1) {
        return null;
    }
    startIndex += startStr.length;

    let endIndex = url.indexOf(endStr, startIndex + 1);
    if(endIndex == -1) {
        if(endOptional) endIndex = url.length;
        else return null;
    }
    return url.substring(startIndex, endIndex);
}



class VideoPlayer {
    playerId: string;
    container: VideoPlayerContainer;
    playerElem: HTMLElement;
    controlGroupElem: HTMLElement;
    playButtonElem: HTMLElement;
    volumeSliderElem: HTMLElement;
    audioOnlyButton: HTMLElement;
    hls: Hls;
    audioElem: HTMLVideoElement;
    playButtonObserver: MutationObserver;
    volumeObserver: MutationObserver;

    constructor(playerId: string, container: VideoPlayerContainer, playerElem: HTMLElement,
            controlGroupElem: HTMLElement, playButtonElem: HTMLElement, volumeSliderElem: HTMLElement) {
        this.playerId = playerId;
        this.container = container;
        this.playerElem = playerElem;
        this.controlGroupElem = controlGroupElem;
        this.playButtonElem = playButtonElem;
        this.volumeSliderElem = volumeSliderElem;
    }

    run() {
        this.hls = new Hls({
            //debug: true,
            liveSyncDuration: 0,
            liveMaxLatencyDuration: 5,
            liveDurationInfinity: true  // true for live stream
        });

        // Create a separate <audio> tag to play audio
        this.audioElem = document.createElement("video");
        this.audioElem.style.display = "none";
        this.playerElem.appendChild(this.audioElem);
        this.populateComponents();
    }

    populateComponents() {
        const audioOnlyButton = this.appendAudioOnlyButton();
        this.controlGroupElem.appendChild(audioOnlyButton);

        const buttonConfig = { attributes: true, childList: false, subtree: false };
            
        // MutationObserver to playButtonElem
        let playButtonCallback: MutationCallback = function(mutationList, observer) {
            const state = this.playButtonElem.getAttribute("data-a-player-state");
            if(state == "playing") {  // From paused to playing
                this.pause();  // Pause audio
            }                
        }
        this.playButtonObserver = new MutationObserver(playButtonCallback.bind(this));
        this.playButtonObserver.observe(this.playButtonElem, buttonConfig);
        
        // MutationObserver to volumeSlider
        let volumeChangeCallback: MutationCallback = function(mutationList, observer) {
            const volume = this.volumeSliderElem.value;
            this.audioElem.volume = volume;
        }
        this.volumeObserver = new MutationObserver(volumeChangeCallback.bind(this));
        this.volumeObserver.observe(this.volumeSliderElem, buttonConfig);
    }

    play(mediaUrl: string) {
        if(!mediaUrl) {
            console.log("No mediaUrl is found to play")
            return;
        }

        this.hls = new Hls({
            //debug: true,
            liveSyncDuration: 0,
            liveMaxLatencyDuration: 5,
            liveDurationInfinity: true  // true for live stream
        });
        this.hls.loadSource(mediaUrl);
        this.hls.attachMedia(this.audioElem); 
        // TODO: Is this safe to play right away after attaching the media?
        // The main example at hls.js website tells to user MANIFEST_PARSED event,
        // but for some reason it doesn't work with typescript+webpack.
        this.audioElem.play().then(function() {
            console.log("Play started");
        });

        // Stop the video if playing
        const videoState = this.playButtonElem.getAttribute("data-a-player-state");
        if(videoState == "playing") {
            // Is there a better way than this "click" hack?
            this.playButtonElem.click();
        }

        // Change the audio-only button icon
        this.audioOnlyButton.setAttribute("data-a-player-state", "playing");
        const svgDom = this.audioOnlyButton.getElementsByTagName("svg")[0];
        const classes = svgDom.classList;
        if(classes.contains("audio-only-svg-paused")) {
            classes.remove("audio-only-svg-paused");
            classes.add("audio-only-svg-playing");
        }
    }

    pause() {
        if(this.hls) {
            this.audioElem.pause();
            this.hls.stopLoad();
            this.hls.detachMedia();
            this.hls.destroy();
            // There seems to be a bug that the HLS object gets stuck after multiple plays and pauses
            // if it is re-used for the next play. Need to destroy the object and re-create it.
            this.hls = null;
        }

        // Change the audio-only button icon
        this.audioOnlyButton.setAttribute("data-a-player-state", "paused");
        const svgDom = this.audioOnlyButton.getElementsByTagName("svg")[0];
        const classes = svgDom.classList;
        if(classes.contains("audio-only-svg-playing")) {
            classes.remove("audio-only-svg-playing");
            classes.add("audio-only-svg-paused");
        }
    }

    destroy() {  // What else to do here?
        this.pause();
        this.playButtonObserver.disconnect();
        this.volumeObserver.disconnect();
    }

    appendAudioOnlyButton() {
        // TODO: Use webpack html loader
        // TODO: Disable the button in clip and (also VOD?)
        const buttonWrapperDom = document.createElement("div")
        buttonWrapperDom.innerHTML = initialButtonDom;
    
        this.audioOnlyButton = buttonWrapperDom.getElementsByTagName("button")[0];
        const onclickCallback = function() {
            const state = this.audioOnlyButton.getAttribute("data-a-player-state");
            if(state === "paused") {
                this.requestPlay();
            }
            else {
                this.pause();
            }
        }
        this.audioOnlyButton.onclick = onclickCallback.bind(this);
        this.controlGroupElem.appendChild(buttonWrapperDom);
        return buttonWrapperDom;
    }

    requestPlay() {
        const channel = getChannelFromWebUrl();
        const responseCallback = async function(response: GetUrlsResponse) {
            console.debug("response for get_audio_url received: " + JSON.stringify(response));
            if(!response || !response.channel) {
                return;
            }

            let usherUrl = response.usherUrl;
            if(!usherUrl) {
                usherUrl = await getUsherUrl(response.channel, response.accessTokenUrl);
            }
            
            const audioStreamUrl = await getAudioStreamUrl(usherUrl);
            this.container.pauseExcept(this.playerId);
            this.play(audioStreamUrl);
        }
        chrome.runtime.sendMessage(
            {message: "get_audio_url", channel: channel}, responseCallback.bind(this)); 
    }
}


export default class VideoPlayerContainer {
    players: VideoPlayer[];
    nextId: number;
    observer: MutationObserver;

    constructor() {
        this.players = [];
        this.nextId = 10001;  // Random start index for player.
    }

    run() {
        // Find existing video player elements to create VideoPlayer objects
        this.findVideoPlayerElems();

        // Detect future video player elements
        const config = { attributes: false, childList: true, subtree: true };
        this.observer = new MutationObserver(this.findVideoPlayerElems.bind(this));
        this.observer.observe(document.body, config);
    }

    findVideoPlayerElems() {
        // TODO: Is it better to iterate only the mutated divs?
        const playerElems = document.body.getElementsByClassName(videoPlayerClass);
        for(let playerElem of playerElems) {
            // If the div is not already processed
            if(!playerElem.classList.contains(videoPlayerProcessedClass)) {
                this.tryCreatingNewPlayer(playerElem as HTMLElement);
            }
        }
    }

    tryCreatingNewPlayer(playerElem: HTMLElement) {
        if(playerElem.classList.contains(videoPlayerProcessedClass)) {
            return;
        }

        // Check if all required DOMs are ready
        const controlGroupElems = playerElem.getElementsByClassName(controlGroupClass);
        if(!controlGroupElems) {
            return;
        }

        const controlGroupElem = controlGroupElems[0] as HTMLElement
        const playButtonElem = controlGroupElem.querySelector(playButtonAttr);
        const volumeSliderElem = controlGroupElem.querySelector(volumnSliderAttr);
        if(!playButtonElem || !volumeSliderElem) {
            return;
        }

        // All required DOMs are ready.
        const newPlayerId = videoPlayerProcessedClass + "-" + this.nextId;
        this.nextId += 1;
        playerElem.classList.add(videoPlayerProcessedClass);
        playerElem.classList.add(newPlayerId);

        const player = new VideoPlayer(
            newPlayerId, this, playerElem, controlGroupElem, playButtonElem as HTMLElement,
            volumeSliderElem as HTMLElement);
        this.players.push(player);
        player.run();
    }

    pauseExcept(playerId: string) {
        for(let player of this.players) {
            if(player.playerId != playerId) player.pause();
        }
    }

    destroy() {
        this.observer.disconnect();
        for(let player of this.players) {
            player.destroy();
        }
        this.players = [];
    }
}

