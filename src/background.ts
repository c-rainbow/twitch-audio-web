
import {
    getChannelFromUsherUrl,
    GetUrlsResponse,
    UrlGroup,
    UsherUrl
} from "./url";


// Map of channel(string) to url(UsherUrl)
var usherUrlMap: Map<string, UsherUrl> = new Map();
var clientIdMap: Map<string, string> = new Map();


function getUrlGroup(channel: string) : UrlGroup {
    const group : UrlGroup = {channel: channel, usherUrl: null};

    // Get Usher URL
    const cachedUsherUrlObj = usherUrlMap.get(channel);
    if(cachedUsherUrlObj) {
        // TODO: Temporarily disable cache
        group.usherUrl = cachedUsherUrlObj.getUnexpiredUrl();
    }
    else {
        console.debug(`No cached usherUrl object for channel ${channel}`);
    }

    return group;
}


function handleGetUrlsMessage(channel: string, tabId: number) : GetUrlsResponse {
    const callbackObj: GetUrlsResponse = {webUrl: null};
    callbackObj.webUrl = getUrlGroup(channel);

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


chrome.webRequest.onSendHeaders.addListener(function(details) {
        const headers = details.requestHeaders || [];
        if (clientIdMap.has("Client-ID")) {
          return;
        }
        console.log("Header length: " + headers.length);
        for(const header of headers) {
            if("Client-ID" === header.name) {
                clientIdMap.set("Client-ID", header.value);
                console.log("Client-ID saved in client map");
            }
        }
    },
    {urls: ["*://gql.twitch.tv/gql/*"]},
    ["requestHeaders"]
);


chrome.webRequest.onBeforeRequest.addListener(function(details) {
        const channel = getChannelFromUsherUrl(details.url);
        const usherUrlObj = new UsherUrl(details.url);
        usherUrlMap.set(channel, usherUrlObj);
        // lastRequstedChannelByTab.set(details.tabId, channel);
    },
    {urls: ["*://usher.ttvnw.net/*"]}
);