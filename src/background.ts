

import {
    getChannelFromTokenUrl,
    getChannelFromUsherUrl,
    parseAudioOnlyUrl
} from "./url_utils";
import UsherUrl from "./usher_url";
import {GetUrlsResponse} from "./data_types";


// Map of channel(string) to url(string)
var accessTokenUrlMap: Map<string, string> = new Map();
// Map of channel(string) to url(UsherUrl)
var usherUrlMap: Map<string, UsherUrl> = new Map();


function handleGetUrlsMessage(channel: string, callbackFunc: Function) {
    const callbackObj: GetUrlsResponse = {channel: channel, accessTokenUrl: null, usherUrl: null};
    const cachedUsherUrlObj = usherUrlMap.get(channel);
    if(cachedUsherUrlObj) {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        // 60 seconds buffer before token expiration
        if(secondsSinceEpoch + 60 < cachedUsherUrlObj.expiresAt) {
            callbackObj.usherUrl = cachedUsherUrlObj.getUrl();
        }
        console.log(`Cached URL for ${channel} is expired`);
    }

    // Cached usherUrl expired or does not exist
    const tokenUrl = accessTokenUrlMap.get(channel);
    if(tokenUrl) {
        callbackObj.accessTokenUrl = tokenUrl;
    }
    else {
        console.log("Access token URL is not found for channel " + channel);
        callbackObj.accessTokenUrl = null;
    }
    callbackFunc(callbackObj);
}


chrome.runtime.onMessage.addListener(
    function(request: any, sender: any, sendResponse: Function) {
        
        if (request.message !== "get_audio_url") {
            console.debug("message is not get_audio_url");
            sendResponse(null);
            return;
        }

        // TODO: Channel name may not be available for livestream in the main page
        if(!request.channel) {
            console.debug("Twitch channel name is not included in the request");
            sendResponse(null);
            return;
        }

        handleGetUrlsMessage(request.channel, sendResponse);
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