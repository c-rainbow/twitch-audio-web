

function onConfigChanged() {
    let autoplay = Boolean(this.checked);
    chrome.storage.local.set({"autoplay": autoplay}, function() {
        console.log("autoplay set");
    });
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("event DOMContentLoaded start");
    const autoplayBox = document.getElementById("autoplay-checkbox");
    chrome.storage.local.get(["autoplay"], function(result) {
        const autoplay = Boolean(result.autoplay);
        autoplayBox.checked = autoplay;
        autoplayBox.onchange = onConfigChanged.bind(autoplayBox);
    });
    
});
