

import {
    getChannelFromTokenUrl,
    getChannelFromUsherUrl,
    parseAudioOnlyUrl
} from "./url_utils";
import {fetchContent, fetchJson} from "./fetch";
import UsherUrl from "./usher_url";


// Map of channel(string) to url(string)
var accessTokenUrlMap: Map<string, string> = new Map();
// Map of channel(string) to url(UsherUrl)
var usherUrlMap: Map<string, UsherUrl> = new Map();


async function getAudioStreamUrl(channel: string) : Promise<string> {
    const usherUrl = await getUsherUrl(channel);
    const content = await fetchContent(usherUrl);
    const streamUrl = parseAudioOnlyUrl(content);
    return streamUrl;
}


// TODO: Instead of pre-defined url format, use recently used ont in Twitch web
function buildUsherUrl(channel: string, token: string, sig: string) : UsherUrl {
    const usherUrl = new UsherUrl(`http://usher.twitch.tv/api/channel/hls/${channel}.m3u8`);
    usherUrl.update(token, sig);

    // It is not clear if all of these params are required or if there are any missing ones.
    usherUrl.setQueryString("player", "twitchweb");
    usherUrl.setQueryString("allow_source", "true");
    usherUrl.setQueryString("type", "any");
    
    return usherUrl;
}


 /**
  * Getting the video url
  * 1. Content script send async requests to background with channelName and callback
  * 2. background checks cache
  *     2-1. If usherUrl does not exist or is expired, check accessTokenUrl
  *         2-1-1. If accessTokenUrl does not exist, Callback with null
  *         2-1-2. If accessTokenUrl exists, call the url to get token
  *             2-1-2-1. If the call to accessTokenUrl succeeds:
  *                 2-1-2-1-1. Parse the token to get expiration time
  *                 2-1-2-1-2. Build usherUrl with allow_audio_only=true
  *                 2-1-2-1-3. Store the new usherUrl and expiration time to cache
  *                 2-1-2-1-4. Callback with the new usherUrl
  *             2-1-2-2. If the call to accessTokenUrl fails:
  *                 2-1-2-2-1. Log the reason
  *                 2-1-2-2-2. Callback with null
  *     2-2. If usherUrl exists and is not expired, callback with it.
  */
async function getUsherUrl(channel: string) : Promise<string> {
    // Check if there is a cached version
    let cachedUrl = usherUrlMap.get(channel);
    if(cachedUrl) {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        // 60 seconds buffer before token expiration
        if(secondsSinceEpoch + 60 < cachedUrl.expiresAt) {
            return cachedUrl.getUrl();
        }
        console.log(`Cached URL for ${channel} is expired`);
    }

    // Cached usherUrl expired or does not exist
    const tokenUrl = accessTokenUrlMap.get(channel);
    if(!tokenUrl) {
        console.log("Access token URL is not found for channel " + channel);
        return null;
    }

    // Get new token and sig from access token URL
    const respJson = await fetchJson(tokenUrl);
    if(!respJson) {
        return null;
    }
    
    const token = respJson.token as string;
    const sig = respJson.sig as string;
    if(!token || ! sig) {
        return null;
    }

    // In most cases, usherUrl was already cached for this channel.
    // Just update it.
    if(cachedUrl) {
        cachedUrl.update(token, sig);
        return cachedUrl.getUrl();
    }

    // Otherwise, create a new one and store it
    const usherUrl = buildUsherUrl(channel, token, sig);
    usherUrlMap.set(channel, usherUrl);
    return usherUrl.getUrl();    
}


chrome.runtime.onMessage.addListener(
    function(request: any, sender: any, sendResponse: any) {
        if (request.message !== "get_audio_url") {
            console.debug("message is not get_audio_url");
            sendResponse({audioStreamUrl: null});
        }

        // TODO: Channel name may not be available for livestream in the main page
        if(!request.channel) {
            console.debug("Twitch channel name is not included in the request");
            sendResponse({audioStreamUrl: null});   
        }

        const cachedUrl = usherUrlMap.get(request.channel)
        sendResponse({audioStreamUrl: cachedUrl.getUrl()});
        //const audioStreamUrl = await getAudioStreamUrl(request.channel)
        //sendResponse({audioStreamUrl: audioStreamUrl});

        /*const audioStreamUrl = await getAudioStreamUrl(request.channel).then(
            audioStreamUrl => sendResponse({audioStreamUrl: audioStreamUrl})
        ); */
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