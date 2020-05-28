
import { buildUsherUrl, parseAudioOnlyUrl } from "./url";


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


export async function fetchAudioStreamUrl(usherUrl: string) : Promise<string> {
    const content = await fetchContent(usherUrl);
    const streamUrl = parseAudioOnlyUrl(content);
    return streamUrl;
}


export async function fetchUsherUrl(channel: string, tokenUrl: string) : Promise<string> {
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