
const twitchDomain = "twitch.tv/"
// Non-exhuastive list of non-channel routes in twitch.tv
const nonChannels = ["directory", "videos", "u", "settings"];

const apiDomain = "api.twitch.tv/api/channels/";
const accessToken = "/access_token";

const usherDomain = "usher.ttvnw.net/api/channel/hls/";
const usherExt = ".m3u8"


export function getChannelFromWebUrl() {
    const url = location.href;
    const channel = getNameBetweenStrings(url, twitchDomain, "/", true);
    console.log("Channel name " + channel + ", from URL: " + url)

    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (channel in nonChannels) return null;
    return channel;
}


export function getChannelFromTokenUrl(accessTokenUrl) {
    const channel = getNameBetweenStrings(accessTokenUrl, apiDomain, accessToken);
    console.log("channel name parsed access token: " + channel);
    return channel;
}


export function getChannelFromUsherUrl(usherUrl) {
    const channel = getNameBetweenStrings(usherUrl, usherDomain, usherExt);
    console.log("channel name parsed usher: " + channel);
    return channel;
}


// Get channel between the first occurance of startStr and the first endStr after startStr.
function getNameBetweenStrings(url, startStr, endStr, endOptional=false) {
    let startIndex = url.indexOf(startStr);
    if(startIndex == -1) {
        return null;
    }
    startIndex += startStr.length;

    let endIndex = url.indexOf(endStr, startIndex + 1);
    if(endIndex == -1) {
        if(endOptional) endIndex = url.length;
        else return null;
    }
    return url.substring(startIndex, endIndex);
}