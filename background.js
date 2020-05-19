
var recent_access_token_url = null; // Cache access token URL
var recent_usher_url = null; // Cache Usher URL

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "get_urls") {
            console.log("get_url message is received");
            sendResponse({
                access_token_url: recent_access_token_url,
                usher_url: recent_usher_url
            });
        }
        else {
            console.log("What message is this?" + JSON.stringify(request));
        }
    }
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        recent_access_token_url = details.url;
        console.log("Token request: " + details.url)
    },
    {urls: ["*://api.twitch.tv/api/channels/*/access_token*"]}
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        recent_usher_url = details.url;
        console.log("Usher request: " + details.url)
    },
    {urls: ["*://usher.ttvnw.net/*"]}
);