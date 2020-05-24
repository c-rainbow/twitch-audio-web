
'use strict';



import Module from "src/test"

Module();

const twitchDomain = "twitch.tv/"

// These are not channels, but reserved paths in twitch.tv for other purposes.
// The list doesn't have to be comprehensive. The audio-only button will not be
// usable in non-video pages. Just having a shortcut to filter some of invalid channel names
const nonChannels = ["directory", "videos", "u", "settings"];

function getChannelName() {
    let url = location.href;
    console.log("channel name from " + url);
    let domainEnds = url.indexOf(twitchDomain);
    if (domainEnds == -1) {
        console.log("Channel name cannot be found from " + url);
        return null;
    }
    let startIndex = domainEnds + twitchDomain.length;
    let nextSlashIndex = url.indexOf("/", startIndex + 1);
    if (nextSlashIndex == -1) {
        let cn = url.substring(startIndex);  // The URL ends with streamer channel name
        console.log("Channel nameeeee " + cn + ", from URL: " + url)
        return cn;
    }

    let channelName = url.substring(startIndex, nextSlashIndex);
    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (channelName in nonChannels) {
        return null;
    }
    console.log("Channel name " + channelName + ", from URL: " + url)
    return channelName;
}









// Flag to play/not vaudio during development
const PLAY_FLAG = true;


// TODO: Any better way than HTML as string?
var initialButtonDom = `
<div class="tw-inline-flex tw-relative tw-tooltip-wrapper">
    <button class="audio-only-button audio-only-inactive tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
            data-a-target="audio-only-button"
            data-a-player-state="video"
            aria-label="Audio only">
        <div class="tw-align-items-center tw-flex tw-flex-grow-0">
            <span class="tw-button-icon__icon">
                <div style="width: 2rem; height: 2rem;">
                    <svg class="tw-icon__svg audio_only_icon" width="100%" height="100%"
                            version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 100 100">
                    
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
   
var inactiveRect = '<rect width="100" height="100" style="fill:#CCCCCC" />';
var activeRect = '<rect width="100" height="100" style="fill:#00CC55" />';

// Reference HLS instance
var hls = null;


function getRequiredDOMs() {
    // Only proceeds when videoplayer and the control group are available and unique in DOM
    let videoPlayerElems = document.getElementsByClassName("video-player");
    if (videoPlayerElems.length != 1) {
        console.log("videoPlayer length" + videoPlayerElems.length);
        return null;
    }
    let videoPlayer = videoPlayerElems[0];

    let leftControlGroupElems = videoPlayer.getElementsByClassName("player-controls__left-control-group");
    if (leftControlGroupElems.length != 1) {
        console.log("controlgroup length" + leftControlGroupElems.length);
        return null;
    }
    let leftControlGroup = leftControlGroupElems[0];
    
    return {
        player: videoPlayer,
        controls: leftControlGroup
    }
}


function appendAudioOnlyButton(controlGroup) {
    // TODO: Any better way to create elements than .innerHTML?
    let buttonWrapperDom = document.createElement("div")
    buttonWrapperDom.innerHTML = initialButtonDom;

    let svgDom = buttonWrapperDom.getElementsByClassName("tw-icon__svg")[0]
    svgDom.innerHTML = inactiveRect;
    controlGroup.appendChild(buttonWrapperDom);
    return buttonWrapperDom;
}


function parseM3U8(content) {
    if(!content) {
        return null;
    }
    const lines = content.split('\n');
    let lastHttps = null;
    lines.forEach(line => {
        if (line.indexOf("audio_only") != -1) {
            console.log("audio_only found");
        }
        if (line.startsWith("https://")) {
            lastHttps = line;
        }
    });
    return lastHttps;
}


function getM3u8Url(response, callback) {
    let usherUrl = response.usher_url;

    /**
     * TODO
     * parse the usher url
     * ensure that the usher url is not expired
     * If expired, use accessTokenUrl to get a new usherUrl
     */
    const newUsherUrl = usherUrl + "&allow_audio_only=true";
    console.log("new usher url: " + newUsherUrl)

    fetch(newUsherUrl, {headers:{"Content-Type": 'application/x-mpegURL'}})
        .then(function(m3u8Response) {
            m3u8Response.text().then(function(responseText) {
                const audioM3u8Url = parseM3U8(responseText);
                if (audioM3u8Url) {
                    callback(audioM3u8Url);
                }
            });
        })
}


function getVideoSrc(callback) {
    /**
     * TODO
     * Cache 
     */
    chrome.runtime.sendMessage({message: "get_urls", channelName: getChannelName()}, function(response) {
        console.log("Response obtained: " + JSON.stringify(response));
        /**
         * check validity of response format
         * parse the usher url
         * ensure that the usher url is not expired
         * append allow_audio_only=1
         * Get data from Usher url request
         * Parse and get audio_only .m3u8 address
         * return
         */
        if (response) {
            getM3u8Url(response, callback);
        }
        else {
            console.log("Response is null or undefined")
        }
    }); 
}




var main = (function() {

console.log("Inside contentscript. URL: " + location.href);

//debugger;
    
let requiredDoms = getRequiredDOMs();
if (requiredDoms == null) {
    console.log("Required DOM not exists: " + JSON.stringify(requiredDoms))
    return;
}
let videoPlayer = requiredDoms.player;
let controlGroup = requiredDoms.controls;





if(!videoPlayer) {
    console.log("No videoplayer");
}
if (!controlGroup) {
    console.log("No control group");
}

// Video Play/Pause button
let pauseButton = controlGroup.querySelector("button[data-a-target='player-play-pause-button']");
if (!pauseButton) {
    console.log("Play/Pause button is not found. The DOM structure may have changed.");
    return;
}

//console.log(console.invalid.invalid);

let buttonWrapperDom = appendAudioOnlyButton(controlGroup);

// less buffering with smaller value of liveSyncDurationCount
hls = new Hls({
    //debug: true,
    liveSyncDuration: 0,
    liveMaxLatencyDuration: 5,
    liveDurationInfinity: true  // true for live stream
});

// debug
//getChannelName();

// Reference video/audio element for sound
let audioElem = document.createElement("audio");
audioElem.style.display = "none";
videoPlayer.appendChild(audioElem);

// Add listeners to the audio-only button
let buttonDom = buttonWrapperDom.getElementsByTagName("button")[0];
buttonDom.addEventListener("click", function() {
    let classes = buttonDom.classList;
    let svgDom = buttonDom.getElementsByClassName("tw-icon__svg")[0]
    if (classes.contains("audio-only-inactive")) {
        getVideoSrc(function(videoSrc) {
            // Activate
            classes.remove("audio-only-inactive")
            classes.add("audio-only-active")
            svgDom.innerHTML = activeRect;

            console.log("class activated");
            if (PLAY_FLAG) {
                // TODO: Stop video if it is playing
                if (!videoSrc) {
                    console.log("diveoSrc is wierd: " + videoSrc)
                }
                hls.loadSource(videoSrc);
                hls.attachMedia(audioElem); 
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    audioElem.play().then(function() {
                        console.log("Play started");
                    });
                });
            }
        });
    }
    else if (classes.contains("audio-only-active")) {
        // Deactivate
        classes.remove("audio-only-active")
        classes.add("audio-only-inactive")
        svgDom.innerHTML = inactiveRect;

        console.log("class deactivated");
        if (PLAY_FLAG) {
            audioElem.pause()
            hls.stopLoad()
            hls.detachMedia()  // Attach/detach is needed for every play/pause?
        }
    }
    else {
        console.log("not active or inactive?????")
    }
});

// Event to mark end of stream
//Hls.Events.BUFFER_EOS.


// What is this event?
//Hls.Events.STREAM_STATE_TRANSITION
//Hls.Events.ERROR

});//();

// identify an element to observe
var elementToObserve = document.querySelector("body");

// create a new instance of `MutationObserver` named `observer`, 
// passing it a callback function
var observer = new MutationObserver(function(mutationList, observer) {
    console.log('callback that runs when observer is triggered');
    //let videoPlayerElems = document.getElementsByClassName("video-player");

    let requiredDoms = getRequiredDOMs()
    if(!requiredDoms.player || !requiredDoms.controls) {
        console.log("Required DOMs not available yet")
        return;
    }
    let pauseButton = requiredDoms.controls.querySelector("button[data-a-target='player-play-pause-button']");
    if (!pauseButton) {
        console.log("Play/Pause button not yet available.");
        return;
    }

    console.log("required DOMs and button available")
    observer.disconnect();
    main();
});

// call `observe` on that MutationObserver instance, 
// passing it the element to observe, and the options object
observer.observe(elementToObserve, {subtree: true, attributes: false, childList: true});
