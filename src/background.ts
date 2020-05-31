
import {
    getChannelFromTokenUrl,
    getChannelFromUsherUrl,
    GetUrlsResponse,
    UrlGroup,
    UsherUrl
} from "./url";


// Map of channel(string) to url(string)
var accessTokenUrlMap: Map<string, string> = new Map();
// Map of channel(string) to url(UsherUrl)
var usherUrlMap: Map<string, UsherUrl> = new Map();
// Last requested usher URL by tab. Needed to detect main page or hosted channel
var lastRequstedChannelByTab: Map<number, string> = new Map();


function getUrlGroup(channel: string) : UrlGroup {
    const group : UrlGroup = {channel: channel, accessTokenUrl: null, usherUrl: null};
    
    // Get Access Token URL
    const tokenUrl = accessTokenUrlMap.get(channel);
    if(tokenUrl) {
        group.accessTokenUrl = tokenUrl;
    }
    else {
        console.debug("Access token URL is not found for channel " + channel);
    }

    // Get Usher URL
    const cachedUsherUrlObj = usherUrlMap.get(channel);
    if(cachedUsherUrlObj) {
        group.usherUrl = cachedUsherUrlObj.getUnexpiredUrl();
    }
    else {
        console.debug(`No cached usherUrl object for channel ${channel}`);
    }

    return group;
}


function handleGetUrlsMessage(channel: string, tabId: number) : GetUrlsResponse {
    const callbackObj: GetUrlsResponse = {webUrl: null, lastRequested: null};
    callbackObj.webUrl = getUrlGroup(channel);

    const lastRequstedChannel = lastRequstedChannelByTab.get(tabId) ?? null;
    callbackObj.lastRequested = getUrlGroup(lastRequstedChannel);

    return callbackObj;
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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

    const responseObj = handleGetUrlsMessage(request.channel, sender.tab.id);
    sendResponse(responseObj);
});


chrome.webRequest.onBeforeRequest.addListener(function(details) {
        console.log("Token request: " + details.url)
        const channel = getChannelFromTokenUrl(details.url);
        if(channel) {
            accessTokenUrlMap.set(channel, details.url);
        }
    },
    {urls: ["*://api.twitch.tv/api/channels/*/access_token*"]}
);


chrome.webRequest.onBeforeRequest.addListener(function(details) {
        console.log("tabId: " + details.tabId);
        console.log("Usher request: " + details.url);
        const channel = getChannelFromUsherUrl(details.url);
        const usherUrlObj = new UsherUrl(details.url);
        usherUrlMap.set(channel, usherUrlObj);
        lastRequstedChannelByTab.set(details.tabId, channel);
    },
    {urls: ["*://usher.ttvnw.net/*"]}
);