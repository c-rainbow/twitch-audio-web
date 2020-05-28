

import UsherUrl from "./usher_url";
import {parseAudioOnlyUrl} from "./url_utils";
import {GetUrlsResponse} from "./data_types";


export async function fetchContent(url: string) {
    if(!url) return null;
    const response = await fetch(url);
    // TODO: Check if the status if ok
    const respText = await response.text();
    return respText;
}


export async function fetchJson(url: string) {
    const respText = await fetchContent(url);
    if(respText) {
        try {
            const respJson = JSON.parse(respText);
            return respJson;
        }
        catch(err) {
            console.log("Response could not be parsed to JSON: " + respText);
        }
    }
    return null;
}


export async function getAudioStreamUrl(usherUrl: string) : Promise<string> {
    const content = await fetchContent(usherUrl);
    const streamUrl = parseAudioOnlyUrl(content);
    return streamUrl;
}


// TODO: Instead of pre-defined url format, use recently used ont in Twitch web
function buildUsherUrl(channel: string, token: string, sig: string) : UsherUrl {
    const usherUrl = new UsherUrl(`https://usher.ttvnw.net/api/channel/hls/${channel}.m3u8`);
    usherUrl.update(token, sig);

    // It is not clear if all of these params are required or if there are any missing ones.
    usherUrl.setQueryString("player", "twitchweb");
    usherUrl.setQueryString("allow_source", "true");
    usherUrl.setQueryString("type", "any");
    
    return usherUrl;
}


export async function getUsherUrl(channel: string, tokenUrl: string) : Promise<string> {
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

    // Otherwise, create a new one and store it
    const usherUrl = buildUsherUrl(channel, token, sig);
    return usherUrl.getUrl();    
}