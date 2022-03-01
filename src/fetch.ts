
import { buildUsherUrl, parseAudioOnlyUrl, UrlGroup, gqlUrl } from "./url";
import { AccessTokenGqlPayload } from "./accessToken";

// TODO: Fill with Twitch client ID
const twitchClientId = '';

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


export async function fetchGql(url: string, header: any, body: string) {
    try {
        const startTime = Date.now();
        const postResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Client-ID": twitchClientId,
                "Content-Type": "text/plain; charset=UTF-8"
            },
            body
        });
        const respJson = await postResponse.json();
        console.log("respJson:" + JSON.stringify(respJson));
        console.debug("fetchGql took" + (Date.now() - startTime) + "ms");
        return respJson;
    }
    catch(err) {
        console.debug(`fetchGql threw an error: ${err}`);
    }
}


export async function fetchAudioStreamUrl(usherUrl: string) : Promise<string> {
    const startTime = Date.now();
    const content = await fetchContent(usherUrl);
    const streamUrl = parseAudioOnlyUrl(content);
    console.debug("fetchAudioStreamUrl took" + (Date.now() - startTime) + "ms");
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


export async function tryFetchingPlaylist(channel: string, group: UrlGroup) : Promise<string> {
    if(!group) {
        console.debug('URL group does not exist');
        return null;
    }
 
    // see if the existing usher url can be used
    if(group.usherUrl) {
        console.debug('Usher URL exists');
        const respText = await fetchContent(group.usherUrl);
        if(respText) {
            console.debug('URL group does not exist');
            return respText;
        }
    }
    else {
        console.debug('Usher url cache does not exist');
    }

    // If usher URL was not cached or is expired, make a GQL call and get a new one
    const tokenGqlPayload : any = Object.assign({}, AccessTokenGqlPayload);
    tokenGqlPayload['variables']['login'] = channel;

    console.debug("Token GQL payload: ", tokenGqlPayload);

    const gqlResponseJson = await fetchGql(gqlUrl, {}, JSON.stringify(tokenGqlPayload));
    console.debug("gqlResponseJson", gqlResponseJson);

    if(!gqlResponseJson) {
        return null;
    }

    // Get new token and sig from access token URL
    const dataJson = gqlResponseJson?.data?.streamPlaybackAccessToken;
    const token = dataJson?.value as string;
    const sig = dataJson?.signature as string;
    if(!token || ! sig) {
        return null;
    }

    const newUsherUrl = buildUsherUrl(group.channel, token, sig);
    const respText = await fetchContent(newUsherUrl.getUrl());
    console.debug('Final response text', respText);
    return respText;
}