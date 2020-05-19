
var recent_access_token_url = null;
var recent_usher_url = null;

var port = chrome.runtime.connect({name: "url_channel"})
function sendMsg(data) {
    console.log("sending message: " + JSON.stringify(data))
    chrome.runtime.sendMessage(data);
    console.log("Message sent")
}


chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        recent_access_token_url = details.url;
        chrome.runtime.sendMessage({access_token_url: details.url});
        console.log("Token request: " + details.url)
    },
    {urls: ["*://api.twitch.tv/api/channels/*/access_token*"]}
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        recent_usher_url = details.url;
        chrome.runtime.sendMessage({usher_url: details.url});
        console.log("Usher request: " + details.url)
    },
    {urls: ["*://usher.ttvnw.net/*"]}
);