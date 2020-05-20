
var access_token_url_map = {};
var usher_url_map = {};

var recent_access_token_url = null;
var recent_usher_url = null;

const apiDomain = "api.twitch.tv/api/channels/";
const accessToken = "/access_token";

function parseChannelNameToken(accessTokenUrl) {
    let apiDomainIndex = accessTokenUrl.indexOf(apiDomain);
    if (apiDomainIndex == -1) {
        console.log("Access token url is wrong no apiIndex? " + accessTokenUrl)
        return null;
    }
    let startIndex = apiDomainIndex + apiDomain.length;
    let endIndex = accessTokenUrl.indexOf(accessToken);
    if (endIndex == -1) {
        console.log("Access token url is wrong no endIndex? " + accessTokenUrl)
        return null;
    }

    let chanName = accessTokenUrl.substring(startIndex, endIndex);
    console.log("channel name parsed access token: " + chanName);
    return chanName;
}


const usherDomain = "usher.ttvnw.net/api/channel/hls/";
const usherExt = ".m3u8"
function parseChannelNameUsher(usherUrl) {
    let usherDomainIndex = usherUrl.indexOf(usherDomain);
    if (usherDomainIndex == -1) {
        console.log("Usher url is wrong no usherDomainIndex? " + usherUrl)
        return null;
    }
    let startIndex = usherDomainIndex + usherDomain.length;
    let endIndex = usherUrl.indexOf(usherExt);
    if (endIndex == -1) {
        console.log("Usher url is wrong no endIndex? " + usherUrl)
        return null;
    }

    let chanName = usherUrl.substring(startIndex, endIndex);
    console.log("channel name parsed usher: " + chanName);
    return chanName;
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "get_urls") {
            if(!request.channelName) {
                console.log("Twitch channel name is not included in the request");
                //console.log("Request")
                //return;
            }
            let channelName = request.channelName
            let access_token_url = access_token_url_map[channelName] || null;
            let usher_url = usher_url_map[channelName] || null;
            sendResponse({
                access_token_url: access_token_url,
                usher_url: usher_url
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
        let channelName = parseChannelNameToken(details.url);
        console.log("Token request: " + details.url)
        if(channelName) {
            access_token_url_map[channelName] = details.url;
        }
    },
    {urls: ["*://api.twitch.tv/api/channels/*/access_token*"]}
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        recent_usher_url = details.url;
        let channelName = parseChannelNameUsher(details.url);
        console.log("Usher request: " + details.url);
        if(channelName) {
            usher_url_map[channelName] = details.url;
        }
    },
    {urls: ["*://usher.ttvnw.net/*"]}
);