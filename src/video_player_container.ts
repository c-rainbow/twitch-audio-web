
import { fetchUsherUrl, fetchAudioStreamUrl } from "./fetch";
import { getChannelFromWebUrl, GetUrlsResponse } from "./url";


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

const radioIconPausedClass = "audio-only-svg-paused";
const radioIconPlayingClass = "audio-only-svg-playing";
const radioIconDisabledClass = "audio-only-svg-disabled";


/**
 * Create VideoPlayerContainer, add MutationObserver to 
 * 1. document.body checks for one subtree change
 *   1-2. If div with class "video-player", process it. Check #2
 * 
 * 2. Create VideoPlayer, video-player class div checks for 1 attribute change, 3 subtree changes
 *   2-1. attribute "data-a-player-type": "site", "site_mini", "clips-watch"
 *     2-2-2. Change the mode of VideoPlayer if necessary
 *     2-2-3. Mode: Tuple of (layout, video_type).
 *       2-2-3-1. layout: "site" | "site_mini"
 *       2-2-3-2. video_type: "live", "vod", "clip".. and more?????
 *   2-2. subtree div with class "vod-seekbar-time-labels" and "seekbar-interaction-area"
 *     2-2-1. This only appears in VOD watch
 *     2-2-2. If created, change the mode of VideoPlayer to VOD
 *     2-2-3. If removed (changed from VOD to live/clip), ????
 *   2-3. check for control group "player-controls__left-control-group"
 *     2-3-1. If created, check #3 for actions
 *     2-3-2. If removed, ?????
 *   2-4. check for "video" element in the player
 *     2-4-1. If created, check #6 for actions
 *     2-4-2. If removed, ?????
 * 
 * 3. Control group "player-controls__left-control-group" checks for 
 *   3-1. subtree button[data-a-target='player-play-pause-button'] for video play/pause button
 *     3-1-1. If created, check #4
 *     3-1-2. If removed (when player type changed from "site" to "site_mini", etc), ?????
 *   3-2. subtree input[data-a-target='player-volume-slider'] for volume slider
 *     3-2-1. If created, check #5
 *     3-2-2. If removed (when player type changed from "site" to "site_mini", etc), ?????
 *   3-3. If both components in 3-1 and 3-2 are ready:
 *     3-3-1. Create radio mode button, and put MutationObserver (see #4 and #5)
 *     3-3-2. If at least one component is removed (site->site_mini change, etc)
 *       3-3-2-1. also remove the radio mode button from DOM
 * 
 * 4. Video play/pause button checks for
 *   4-1. Attribute change "data-a-player-state": "playing" or "paused"
 *     4-1-1. If attribute value changed to "playing", stop all audio in the VideoPlayerContainer
 * 
 * 5. Volume slider checks for
 *   5-1. Attribute "value" change: number between 0 <= num <= 1
 *     5-1-1. If change is detected, apply the new volume to audioElem.
 * 
 * 6. original "video" element in video-player checks for
 *   6-1. Attribute "src" change: means that the video source changed (likely hosting another streamer)
 *     6-1-1. Radio mode button should be disabled? Re-configured with the new streamer's URL?
 *    
 */

/**
 * How to detect the channel of the stream being played?
 * Getting channel name from URL has the folllowing issues
 * (1) Streamer hosting another channel
 * (2) Main page. Channel can change quickly in the carousel
 * 
 * Proposed solution:
 * (1) Keep the last requested usher URL in the tab. Guess the channel from there
 * (2) For "site_mini" state, store the channel name in video player.
 *     In that case, it will be possible to resume playing in the right channel.
 * (3) Disable the radio mode button in the main page
 * 
 */

/**
 * Add radio mode button in site_mini?
 * Don't store the playstate in DOM: only store it in VideoPlayer class as the single source of truth
 */

/**
 * ESports page: video miniplayer keeps playing even when the site player in Esports page is also being played.
 * Should the radio mode follow the same behavior?
 */

/**
 * Access token url has oauth code, which is undefined if the user is not logged in.
 * Not sure how Twitch returns correct response for anonymous user yet.
 * Calling the same access token URL from contentscript returns error.
 */


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

        if(this.audioElem) {
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
            liveDurationInfinity: true  // true for live stream
        });
        this.hls.loadSource(mediaUrl);
        this.hls.attachMedia(this.audioElem); 
        // TODO: Is this safe to play right away after attaching the media?
        // The main example at hls.js website tells to use MANIFEST_PARSED event,
        // but for some reason the event is not triggered with typescript+webpack.
        this.audioElem.play().then(function() {
            console.log("Play started");
        });

        // NOTE: There is 1~3 seconds of delay between audio-only button click and sound being played.
        // It's better to show some intermediate state (icon change, mouse cursor change, etc) in the meanwhile

        // Stop the video if playing
        const videoState = this.playButtonElem.getAttribute("data-a-player-state");
        if(videoState == "playing") {
            // Is there a better way to pause video than this "click" hack?
            this.playButtonElem.click();
        }

        // Change the audio-only button icon
        this.audioOnlyButton.setAttribute("data-a-player-state", "playing");
        const svgDom = this.audioOnlyButton.getElementsByTagName("svg")[0];
        const classes = svgDom.classList;
        if(classes.contains(radioIconPausedClass)) {
            classes.remove(radioIconPausedClass);
            classes.add(radioIconPlayingClass);
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
            this.audioElem = null;
        }

        // Change the audio-only button icon
        this.audioOnlyButton.setAttribute("data-a-player-state", "paused");
        const svgDom = this.audioOnlyButton.getElementsByTagName("svg")[0];
        const classes = svgDom.classList;
        if(classes.contains(radioIconPlayingClass)) {
            classes.remove(radioIconPlayingClass);
            classes.add(radioIconPausedClass);
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
            if(state === "disabled") {
                return;
            }
            else if(state === "paused") {
                this.requestPlay();
            }
            else if(state === "playing"){
                this.pause();
            }
            else {

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
                usherUrl = await fetchUsherUrl(response.channel, response.accessTokenUrl);
            }
            
            const audioStreamUrl = await fetchAudioStreamUrl(usherUrl);
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
                console.debug("New video player detected");
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

