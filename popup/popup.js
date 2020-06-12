

i18nMap = {
    "extension-title-text": "POPUP_EXT_NAME",
    "config-name-autoplay": "AUTOPLAY_VIDEO_ON_RADIO_END",
    "extension-config-header": "EXT_CONFIG_HEADER"
};


function i18nUpdate() {
    for(let elemId in i18nMap) {
        const key = i18nMap[elemId];
        const elem = document.getElementById(elemId);
        elem.textContent = chrome.i18n.getMessage(key);
    }
}


function onConfigChanged() {
    let autoplay = Boolean(this.checked);
    chrome.storage.local.set({"autoplay": autoplay}, function() {
        console.log("autoplay set");
    });
}


document.addEventListener("DOMContentLoaded", function() {
    i18nUpdate();

    const autoplayBox = document.getElementById("autoplay-checkbox");
    chrome.storage.local.get(["autoplay"], function(result) {
        const autoplay = Boolean(result.autoplay);
        autoplayBox.checked = autoplay;
        autoplayBox.onchange = onConfigChanged.bind(autoplayBox);
    });
});
