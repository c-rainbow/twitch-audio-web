
import {
    getChannelFromTokenUrl,
    getChannelFromUsherUrl,
    GetUrlsResponse,
    UsherUrl
} from "./url";


// Map of channel(string) to url(string)
var accessTokenUrlMap: Map<string, string> = new Map();
// Map of channel(string) to url(UsherUrl)
var usherUrlMap: Map<string, UsherUrl> = new Map();


function handleGetUrlsMessage(channel: string) : GetUrlsResponse {
    const callbackObj: GetUrlsResponse = {channel: channel, accessTokenUrl: null, usherUrl: null};

    // Get Access Token URL
    const tokenUrl = accessTokenUrlMap.get(channel);
    if(tokenUrl) {
        callbackObj.accessTokenUrl = tokenUrl;
    }
    else {
        console.debug("Access token URL is not found for channel " + channel);
    }

    // Get Usher URL
    const cachedUsherUrlObj = usherUrlMap.get(channel);
    if(cachedUsherUrlObj) {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        // 60 seconds buffer before token expiration
        if(secondsSinceEpoch + 60 < cachedUsherUrlObj.expiresAt) {
            callbackObj.usherUrl = cachedUsherUrlObj.getUrl();
        }
        console.debug(`Cached URL for ${channel} is expired`);
    }
    else {
        console.debug(`No cached usherUrl object for channel ${channel}`);
    }

    return callbackObj;
}


chrome.runtime.onMessage.addListener(
    function(request: any, sender: any, sendResponse: Function) {
        if (request.message !== "get_audio_url") {
            console.debug("message is not get_audio_url");
            sendResponse(null);
            return;
        }

        if(!request.channel) {
            console.debug("Twitch channel name is not included in the request");
            sendResponse(null);
            return;
        }

        const responseObj = handleGetUrlsMessage(request.channel);
        sendResponse(responseObj);
    }
);


chrome.webRequest.onBeforeRequest.addListener(
    function(details: any) {
        console.log("Token request: " + details.url)
        const channel = getChannelFromTokenUrl(details.url);
        if(channel) {
            accessTokenUrlMap.set(channel, details.url);
        }
    },
    {urls: ["*://api.twitch.tv/api/channels/*/access_token*"]}
);


chrome.webRequest.onBeforeRequest.addListener(
    function(details: any) {
        console.log("Usher request: " + details.url);
        const channel = getChannelFromUsherUrl(details.url);
        const usherUrlObj = new UsherUrl(details.url);
        usherUrlMap.set(channel, usherUrlObj);
    },
    {urls: ["*://usher.ttvnw.net/*"]}
);