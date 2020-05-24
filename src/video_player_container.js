

const videoPlayerClass = "video-player";
const videoPlayerProcessedClass = "video-player-processed";
const controlGroupClass = "player-controls__left-control-group";
const playButtonAttr = "button[data-a-target='player-play-pause-button']";
const volumnSliderAttr = "[button[data-a-target='player-volume-slider']";

/**
 * VideoPlayer class
 * 1. create(element)
 *      1-1. MutationObserver for DOM change, wait for the player/pause button
 *      1-2. 
 * 2. play(url)
*       3-1. Get video url, and then
*       3-2-1-1. Pause the video play/pause button if necessary,
*                by clicking the video play/pause button
*       3-2-1-2. Get audio_only video url
*       3-2-1-3. If url is null, not do anything
*       3-2-1-3. Create Hls, attach the <audio> element, startLoad the url, play.
*       3-2-1-4. Stop all videos or audios in other video-player elements, if exists.
*       3-2-1-5. Change audio-only button to "activated"
 * 3. pause()
 *      3-2-2. If clicked from play to pause
*              3-2-2-1. Pause the audio, stopLoad, detach the element (if necessary),
*                       destroy Hls (if necessary)
*              3-2-2-2. Change audio-only button to "deactivated"
 * 4. destroy()
 * 
 * 
 * 
 */
class VideoPlayer {
    constructor(playerId, playerElem) {
        this.playerId = playerId;
        this.playerElem = playerElem;
        this.createNewPlayer(playerElem)
        this.hls = new Hls({
            //debug: true,
            liveSyncDuration: 0,
            liveMaxLatencyDuration: 5,
            liveDurationInfinity: true  // true for live stream
        });

        // Create a separate <audio> tag to play audio
        this.audioElem = document.createElement("audio");
        this.audioElem.style.display = "none";
        this.playerElem.appendChild(this.audioElem);
    }

    createNewPlayer(playerElem) {
        const config = { attributes: false, childList: true, subtree: true };
        const buttonConfig = { attributes: true, childList: false, subtree: false };
        const callback = function(mutaitonList, observer) {
            let controlGoupElem = this.playerElem.getElementsByClassName(controlGroupClass);
            if(!controlGoupElem) {
                return;
            }
            let playButtonElem = this.playerElem.querySelector(playButtonAttr);
            let volumeSliderElem = this.playerElem.querySelector(volumnSliderAttr);
            if(!playButtonElem || !volumeSliderElem) {
                return;
            }
            this.controlGoupElem = controlGoupElem;
            this.playButtonElem = playButtonElem;
            this.volumnSliderElem = volumeSliderElem;

            // TODO: Add audio-only button
            this.addAudioOnlyButton(controlGoupElem);
            
            // MutationObserver to playButtonElem
            let playButtonCallback = function(mutationList, observer) {
                const state = this.playButtonElem.getAttribute("data-a-player-state");
                if(state == "playing") {  // From paused to playing
                    this.pause();  // Pause audio
                }                
            }
            this.playButtonObserver = MutationObserver(playButtonCallback);
            this.playButtonObserver.observe(this.playButtonElem, buttonConfig);
            
            // MutationObserver to volumeSlider
            let volumeChangeCallback = function(mutationList, observer) {
                const volume = this.volumnSliderElem.value;
                this.audioElem.volume = volume;
            }
            this.volumeObserver = MutationObserver(volumeChangeCallback);
            this.volumeObserver.observe(this.volumnSliderElem, buttonConfig);

            observer.destroy()
            return;
        };
        const observer = MutationObserver(callback);
        observer.observe(this.playerElem, config)
    }

    play(mediaUrl) {
        if(!mediaUrl) {
            console.log("No mediaUrl is found to play")
            return;
        }
        hls.loadSource(mediaUrl);
        hls.attachMedia(audioElem); 
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            this.audioElem.play().then(function() {
                console.log("Play started");
            });
        });
    }

    pause() {
        if(this.hls) {
            this.hls.pause();
        }
    }

    destroy() {

    }

    appendAudioOnlyButton(controlGroup) {
        // TODO: Use webpack html loader
        let buttonWrapperDom = document.createElement("div")
        buttonWrapperDom.innerHTML = initialButtonDom;
    
        let svgDom = buttonWrapperDom.getElementsByClassName("tw-icon__svg")[0]
        svgDom.innerHTML = inactiveRect;
        controlGroup.appendChild(buttonWrapperDom);
        return buttonWrapperDom;
    }
}




/**
 * VideoPlayerContainer
 *  1. CreateNewPlayer(element)
 *      1-1. create a new VideoPlayer object with the element
 *  2. PauseAll(playerId) 
 *      2-1. Iterate all elements managed by this manager
 *      2-2. If the element does not match the argument (differnet ID?), call pause()
 *  3. Play(playerId)
 *      3-1. Call PauseAll(playerId)
 *      3-2. Iterate all elements managed by this manager
 *          3-2-1. If its ID matches playerId, play()

 *      3-1. Get video url, and then
 *      3-2-1-1. Pause the video play/pause button if necessary,
 *               by clicking the video play/pause button
 *      3-2-1-2. Get audio_only video url
 *      3-2-1-3. If url is null, not do anything
 *      3-2-1-3. Create Hls, attach the <audio> element, startLoad the url, play.
 *      3-2-1-4. Stop all videos or audios in other video-player elements, if exists.
 *      3-2-1-5. Change audio-only button to "activated"
 */
export default class VideoPlayerContainer {
    constructor() {
        this.players = [];
        this.nextId = 10001;  // Random start index for player.
        
        // Find existing video player elements to create VideoPlayer objects
        findVideoPlayerElems();

        // Detect future vider player elements
        const config = { attributes: false, childList: true, subtree: true };
        this.observer = MutationObserver(this.findVideoPlayerElems);
        this.observer.observe(document.body, config);
    }

    findVideoPlayerElems() {
        // TODO: Is it better to iterate only the mutated divs?
        playerElems = document.body.getElementsByClassName(videoPlayerClass);
        playerElems.forEach(function(playerElem) {
            if(!playerElem.classList.contains(videoPlayerProcessedClass)) {
                this.tryCreatingNewPlayer(playerElem);
            }
        });
    }

    tryCreatingNewPlayer(playerElem) {
        // Check if all required DOMs are ready
        let controlGoupElem = playerElem.getElementsByClassName(controlGroupClass);
        if(!controlGoupElem) {
            return;
        }
        let playButtonElem = playerElem.querySelector(playButtonAttr);
        let volumeSliderElem = playerElem.querySelector(volumnSliderAttr);
        if(!playButtonElem || !volumeSliderElem) {
            return;
        }

        // All required DOMs are ready.
        const newPlayerId = videoPlayerProcessedClass + "-" + this.nextId;
        this.nextId += 1;
        playerElem.classList.add(videoPlayerProcessedClass);
        playerElem.classList.add(newPlayerId);

        let player = new VideoPlayer(
            newPlayerId, this, playerElem, controlGroupElem, playButtonElem, volumeSliderElem);
        this.players.push(player);
    }

    pauseExcept(playerId) {
        this.players.forEach(function(player) {
            if(player.playerId != playerId) player.pause();
        });
    }

    play(playerId) {
        this.players.forEach(function(player) {
            if(player.playerId == playerId) player.play();
        });
    }

    destroy() {
        this.players.forEach(function(player) {
            player.destroy();
        })
        this.players = [];
        this.observer.disconnect();
    }
}