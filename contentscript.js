
//(async function() {



var inactive_button_dom = '<div class="tw-inline-flex tw-relative tw-tooltip-wrapper"> <button class="audio-only-inactive tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative" data-a-target="audio-only-button" data-a-player-state="video" aria-label="Audio only"><div class="tw-align-items-center tw-flex tw-flex-grow-0"> <span class="tw-button-icon__icon"><div style="width: 2rem; height: 2rem;"> <svg class="tw-icon__svg" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100"> </svg></div> </span></div> </button><div class="tw-tooltip tw-tooltip--align-left tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip"> Audio only</div></div>';


    
let inactive_rect = '<rect width="100" height="100" style="fill:#CCCCCC" />';
let active_rect = '<rect width="100" height="100" style="fill:#00CC55" />';


let videoPlayer = document.getElementsByClassName("video-player")[0];


let leftControlGroup = videoPlayer.getElementsByClassName("player-controls__left-control-group")[0];

let buttonWrapperDom = document.createElement("div")
buttonWrapperDom.innerHTML = inactive_button_dom;
let svgDom = buttonWrapperDom.getElementsByClassName("tw-icon__svg")[0]
svgDom.innerHTML = inactive_rect;

console.log("buttomDom ready")
leftControlGroup.appendChild(buttonWrapperDom)



//console.log(d);
//Wconsole.log(d[0].childNodes[0].childNodes);
//console.log(d[0].childNodes[0].childNodes.length)

var hls = new Hls({liveSyncDurationCount:0}); // less buffering with smaller value of liveSyncDurationCount

let pauseButton = document.querySelector("button[data-a-target='player-play-pause-button']");
console.log("pauseButton " +  pauseButton)
console.log("recent token:" + recent_access_token_url);
console.log("usher url: " + recent_usher_url);


/*
setTimeout(function() {
    let state = pauseButton.getAttribute("data-a-player-state");
    console.log("statef: " + state);
    if (state == "playing") {
        //pauseButton.setAttribute("data-a-player-state", "paused")
        pauseButton.click()
    }
}, 5000);
*/



let buttonDom = buttonWrapperDom.getElementsByTagName("button")[0]
buttonDom.addEventListener("click", function() {
    let classes = buttonDom.classList;
    if (classes.contains("audio-only-inactive")) {
        classes.remove("audio-only-inactive")
        classes.add("audio-only-active")
        // Activate
        svgDom.innerHTML = active_rect;
        alert("class activated")

    }
    else {
        // Deactivate
        classes.remove("audio-only-active")
        classes.add("audio-only-inactive")

        alert("cladd deactivated")
        svgDom.innerHTML = inactive_rect;
    }
});



/*
let newDom = document.createElement("div");
newDom.classList.add("temporary-class-name")

let newVideo = document.createElement("audio")
//newVideo.classList.add("nodisplay")
newDom.appendChild(newVideo)

let pauseAudio = document.createElement("button")
pauseAudio.innerHTML = "PAUSE"

let resumeAudio = document.createElement("button")
resumeAudio.innerHTML = "PLAY"


newDom.appendChild(pauseAudio)
newDom.appendChild(resumeAudio)


pauseAudio.addEventListener("click", function() {
    newVideo.pause()
    hls.stopLoad()
    hls.detachMedia()
});

resumeAudio.addEventListener("click", function() {
    hls.loadSource(videoSrc);
    hls.attachMedia(newVideo);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        newVideo.play();
    });
});



let videoSrc = ""
//videoSrc = null;


let state = pauseButton.getAttribute("data-a-player-state");
console.log("state: " + state);
//pauseButton.click()
//state = pauseButton.getAttribute("data-a-player-state");
//console.log("state: " + state);


let container = d[0].childNodes[0];

container.childNodes.forEach(function(elem) {
    elem.classList.add("nodisplay");
});

container.appendChild(newDom)


if (videoSrc) {
    console.log("videoSrc not null")
    if(Hls.isSupported()) {
        hls.loadSource(videoSrc);
        hls.attachMedia(newVideo);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            newVideo.play();
        });
    }
    else {
        console.log("HLS not supported")
    }
}



//doit();

//setTimeout(doit, 5000);

*/




/*
setTimeout(() => {

    
    console.log("World!"); 
    let container = d[0].childNodes[0];

    container.childNodes.forEach(function(elem) {
        elem.classList.add("nodisplay");
    });


    let newDom = document.createElement("div");
    newDom.classList.add("temporary-class-name")

    container.appendChild(newDom)


}, 10000);
*/

//}());