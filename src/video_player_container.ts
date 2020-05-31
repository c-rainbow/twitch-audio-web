
import { fetchUsherUrl, fetchAudioStreamUrl } from "./fetch";
import { getChannelFromWebUrl, GetUrlsResponse } from "./url";


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

const radioButtonPausedClass = "audio-only-svg-paused";
const radioButtonPlayingClass = "audio-only-svg-playing";
const radioButtonDisabledClass = "audio-only-svg-disabled";

const attrObserverConfig = { attributes: true, childList: false, subtree: false };
const domObserverConfig = { attributes: false, childList: true, subtree: true };


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
 * 
 * Proposed solution:
 * (1) Disable the button when user is not logged in.
 */


const enum PlayingState {
    INACTIVE,
    PAUSED,
    PLAYING,
}


class ControlGroup {
    controlGroupElem: HTMLElement;
    player: VideoPlayer;
    playButtonElem: HTMLElement;
    volumeSliderElem: HTMLElement;
    radioButton: HTMLElement;
    componentsObserver: MutationObserver;
    playButtonObserver: MutationObserver;
    volumeObserver: MutationObserver; 

    constructor(player: VideoPlayer, controlGroupElem: HTMLElement) {
        this.player = player;
        this.controlGroupElem = controlGroupElem;
        
        this.tryUpdatingComponents();
        this.componentsObserver = new MutationObserver(this.tryUpdatingComponents.bind(this));
        this.componentsObserver.observe(this.controlGroupElem, domObserverConfig);
    }

    tryUpdatingComponents() {
        // Check for new Play/Audio button and volume slider 
        const playButtonElem: HTMLButtonElement = this.controlGroupElem.querySelector(playButtonAttr);
        this.tryUpdatingPlayButtonElem(playButtonElem);
        const volumeSliderElem: HTMLInputElement = this.controlGroupElem.querySelector(volumeSliderAttr);
        this.tryUpdatingVolumesliderElem(volumeSliderElem);
        // Add the radio button if not exists
        this.tryUpdatingRadioButton();
    }

    tryUpdatingPlayButtonElem(playButtonElem: HTMLButtonElement) {
        // play button cannot be found in the control group. Remove reference to the deleted node
        if(!playButtonElem) {
            this.playButtonObserver.disconnect();
            this.playButtonElem = null;
            return;
        }

        const classes = playButtonElem.classList;
        // This element was already added to this.playButtonElem. Ignore.
        if(classes.contains("play-pause-button-processed")) {
            return;
        }
        classes.add("play-pause-button-processed");

        // If exists, remove the existing one
        if(this.playButtonElem) {
            this.playButtonObserver.disconnect();
            this.playButtonElem = null;
        }

        this.playButtonElem = playButtonElem;
        // MutationObserver to playButtonElem
        let playButtonCallback: MutationCallback = function(mutationList, observer) {
            const state = this.playButtonElem.getAttribute("data-a-player-state");
            if(state == "playing") {  // Video state from paused to playing
                this.player.pause();  // Pause audio
            }
        }
        this.playButtonObserver = new MutationObserver(playButtonCallback.bind(this));
        this.playButtonObserver.observe(this.playButtonElem, attrObserverConfig);
    }

    tryUpdatingVolumesliderElem(volumeSliderElem: HTMLInputElement) {
        // volume slider cannot be found in the control group. Remove reference to the deleted node
        if(!volumeSliderElem) {
            this.volumeObserver.disconnect();
            this.volumeSliderElem = null;
            return;
        }

        const classes = volumeSliderElem.classList;
        // This element was already added to this.volumeSliderElem. Ignore.
        if(classes.contains("volume-slider-processed")) {
            return;
        }
        classes.add("volume-slider-processed");

        // If exists, remove the existing one
        if(this.volumeSliderElem) {
            this.volumeObserver.disconnect();
            this.volumeSliderElem = null;
        }

        // MutationObserver to volumeSlider
        let volumeChangeCallback: MutationCallback = function(mutationList, observer) {
            if(this.audioElem) {
                const volume = this.volumeSliderElem.value;
                this.audioElem.volume = volume;
            }
        }
        this.volumeObserver = new MutationObserver(volumeChangeCallback.bind(this));
        this.volumeObserver.observe(this.volumeSliderElem, attrObserverConfig);
    }

    tryUpdatingRadioButton() {
        // Don't proceed if both playButtonElem and volumeSliderElem are available
        if(!this.playButtonElem || !this.volumeSliderElem) {
            return;
        }

        // If the button was already created, do nothing
        const classes = this.radioButton?.classList;
        if(classes?.contains("radio-button-processed")) {
            return;
        }

        // TODO: Use webpack html loader
        // TODO: Disable the button in clip and (also VOD?)
        const buttonWrapperDom = document.createElement("div")
        buttonWrapperDom.innerHTML = initialButtonDom;
    
        this.radioButton = buttonWrapperDom.getElementsByTagName("button")[0];
        this.radioButton.classList.add("radio-button-processed");
        this.radioButton.onclick = this.player.onRadioButtonClicked.bind(this.player);
        this.controlGroupElem.appendChild(buttonWrapperDom);
    }

    updateForPlay() {
        // NOTE: There is 1~3 seconds of delay between audio-only button click and sound being played.
        // It's better to show some intermediate state (icon change, mouse cursor change, etc) in the meanwhile

        // Stop the video if playing
        const videoState = this.playButtonElem?.getAttribute("data-a-player-state");
        if(videoState == "playing") {
            // Is there a better way to pause video than this "click" hack?
            this.playButtonElem.click();
        }
        
        // Change the radio button icon
        const classes = this.radioButton?.classList;
        classes?.remove(radioButtonPausedClass);
        classes?.add(radioButtonPlayingClass);
        classes?.remove(radioButtonDisabledClass);
    }

    updateForPause() {
        // Change the radio button icon
        const classes = this.radioButton?.classList;
        classes?.add(radioButtonPausedClass);
        classes?.remove(radioButtonPlayingClass);
        classes?.remove(radioButtonDisabledClass);
    }

    updateForInactive() {
        // Change the radio button icon
        const classes = this.radioButton?.classList;
        classes?.remove(radioButtonPausedClass);
        classes?.remove(radioButtonPlayingClass);
        classes?.add(radioButtonDisabledClass);
    }

    destroy() {
        this.componentsObserver.disconnect();
        this.playButtonObserver.disconnect();
        this.volumeObserver.disconnect();
    }
}


class VideoPlayer {
    playerId: string;
    container: VideoPlayerContainer;
    playerElem: HTMLElement;
    playingState: PlayingState;
    attributeObserver: MutationObserver;
    controlGroup: ControlGroup;
    controlGroupObserver: MutationObserver;
    hls: Hls;
    audioElem: HTMLVideoElement;

    constructor(playerId: string, container: VideoPlayerContainer, playerElem: HTMLElement) {
        this.playerId = playerId;
        this.container = container;
        this.playerElem = playerElem;
        this.playingState = PlayingState.PAUSED;

        const attributeCallback: MutationCallback = function(mutations, observer) {
            for(let mutation of mutations) {
                if(mutation.attributeName == "data-a-player-type") {
                    const playerType = this.playerElem.getAttribute("data-a-player-type");
                    switch(playerType) {
                        case "site":
                            break;  // state change function
                        case "site_mini":
                            break;
                        case "clips-watch":
                            break;
                    }
                    return;
                }
            }
        }
        this.attributeObserver = new MutationObserver(attributeCallback.bind(this));
        this.attributeObserver.observe(this.playerElem, attrObserverConfig);

        this.tryUpdatingControlGroup();
        const controlGroupCallback: MutationCallback = function(mutations, observer) {
            this.tryUpdatingControlGroup();
        }
        this.controlGroupObserver = new MutationObserver(controlGroupCallback.bind(this));
        this.controlGroupObserver.observe(this.playerElem, domObserverConfig);
    }

    tryUpdatingControlGroup() {
        // Check if the control group DOM is ready
        const controlGroupElem = this.playerElem.getElementsByClassName(controlGroupClass)?.[0];
        if(!controlGroupElem) {  // control group cannot be found in DOM
            this.controlGroup?.destroy();  // destroy reference to the removed DOM
            this.controlGroup = null;
            return;
        }

        // Add processed class name to prevent duplicate processing of this element
        const classes = controlGroupElem.classList;
        if(classes.contains(controlGroupProcessedClass)) {
            return;
        }
        classes.add(controlGroupProcessedClass);

        this.controlGroup?.destroy();
        this.controlGroup = new ControlGroup(this, controlGroupElem as HTMLElement);
    }

    play(mediaUrl: string) {
        if(!mediaUrl) {
            console.debug("No mediaUrl is found to play")
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
        const audioPlayCallback = function() {
            console.log("Play started");
        }
        this.audioElem.play().then(audioPlayCallback.bind(this));
        this.playingState = PlayingState.PLAYING;
        this.controlGroup?.updateForPlay();
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
            this.playerElem.removeChild(this.audioElem);
            this.audioElem = null;
        }
        this.controlGroup?.updateForPause();
    }

    destroy() {  // What else to do here?
        this.pause();
        this.controlGroup?.destroy();
    }

    requestPlay() {
        const channel = getChannelFromWebUrl();
        const responseCallback = async function(response: GetUrlsResponse) {
            console.debug("response for get_audio_url received: " + JSON.stringify(response));
            if(!response?.channel) {
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

    onRadioButtonClicked() {
        switch(this.playingState) {
            case PlayingState.INACTIVE:
                break;
            case PlayingState.PAUSED:
                this.requestPlay();
                break;
            case PlayingState.PLAYING:
                this.pause();
                break;
        }
    }
}


export class VideoPlayerContainer {
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
        this.observer = new MutationObserver(this.findVideoPlayerElems.bind(this));
        this.observer.observe(document.body, domObserverConfig);
    }

    findVideoPlayerElems() {
        // TODO: Is it better to iterate only the mutated divs?
        const playerElems = document.body.getElementsByClassName(videoPlayerClass);
        for(let playerElem of playerElems) {
            // If the div is not already processed
            if(!playerElem.classList.contains(videoPlayerProcessedClass)) {
                console.debug("New video player detected");
                this.createNewPlayer(playerElem as HTMLElement);
            }
        }
    }

    createNewPlayer(playerElem: HTMLElement) {
        if(playerElem.classList.contains(videoPlayerProcessedClass)) {
            return;
        }

        const newPlayerId = videoPlayerProcessedClass + "-" + this.nextId;
        this.nextId += 1;
        playerElem.classList.add(videoPlayerProcessedClass);
        playerElem.classList.add(newPlayerId);

        const player = new VideoPlayer(newPlayerId, this, playerElem);
        this.players.push(player);
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

