
import { buildUsherUrl, parseAudioOnlyUrl, UrlGroup } from "./url";


export async function fetchContent(url: string) {
    if(!url) {
        return null;
    }
    try {
        const response = await fetch(url);
        // TODO: Check if the status if ok
        const respText = await response.text();
        return respText;
    }
    catch(err) {
        console.debug(`fetchContent threw an error: ${err}`)
    }
    return null;
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


export async function fetchAudioStreamUrl(usherUrl: string) : Promise<string> {
    const content = await fetchContent(usherUrl);
    const streamUrl = parseAudioOnlyUrl(content);
    return streamUrl;
}


export async function fetchUsherUrl(channel: string, tokenUrl: string, lastRequestedChannel: string,
        lastRequstedUsherUrl: string) : Promise<string> {
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

    // Check if the channel is different from the channel of the last requested usher url
    // (This is possible if the channel's streamer is hosting another channel)
    if(lastRequestedChannel && channel !== lastRequestedChannel) {
        if(lastRequstedUsherUrl) {
            return lastRequstedUsherUrl;
        }
        // Otherwise, create a new one and store it
        const usherUrl = buildUsherUrl(lastRequestedChannel, token, sig);
        return usherUrl.getUrl();  
    }  
    return null;
}


export async function tryFetchingPlaylist(group: UrlGroup) : Promise<string> {
    if(!group) {
        return null;
    }
 
    // see if the existing usher url can be used
    if(group.usherUrl) {
        const respText = await fetchContent(group.usherUrl);
        if(respText) {
            return respText;
        }
    }

    if(!group.accessTokenUrl) {
        return null;
    }

    // Get new token and sig from access token URL
    const respJson = await fetchJson(group.accessTokenUrl);
    const token = respJson?.token as string;
    const sig = respJson?.sig as string;
    if(!token || ! sig) {
        return null;
    }

    const newUsherUrl = buildUsherUrl(group.channel, token, sig);
    const respText = await fetchContent(newUsherUrl.getUrl());
    return respText;
}