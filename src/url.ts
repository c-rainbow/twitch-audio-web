
const twitchDomain : string = "twitch.tv/";
// Non-exhuastive list of non-channel routes in twitch.tv
const nonChannels : string[] = [
    "", "directory", "videos", "u", "settings", "friends", "subscriptions", "inventory", "wallet"];

const apiDomain : string = "api.twitch.tv/api/channels/";
const accessToken : string = "/access_token";

const usherDomain : string = "usher.ttvnw.net/api/channel/hls/";
const usherExt : string = ".m3u8";


// Extract audio_only stream .m3u8 from the master playlist content.
// Returns the first occurance of a URL after audio_only metadata.
// TODO: This works, but eventually we will need to fully parse the content
// and get audio_only stream url
export function parseAudioOnlyUrl(content: string) : string {
    if(!content) {
        return null;
    }
    const lines = content.split('\n');
    let audioOnlyFound = false;
    for(let line of lines) {
        if (line.includes("audio_only")) audioOnlyFound = true;
        if (audioOnlyFound && line.startsWith("https://")) return line;
    }
    return null;
}


export function getChannelFromWebUrl(weburl?: string) : string {
    // Channel name may not be available from the main page URL
    const url = weburl ?? location.href;
    const channel = getNameBetweenStrings(url, twitchDomain, "/", true);
    console.log("Channel name " + channel + ", from URL: " + url)

    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (nonChannels.indexOf(channel) != -1) return null;
    return channel;
}


export function getChannelFromTokenUrl(accessTokenUrl: string) : string {
    const channel = getNameBetweenStrings(accessTokenUrl, apiDomain, accessToken);
    console.log("channel name parsed access token: " + channel);
    return channel;
}


export function getChannelFromUsherUrl(usherUrl: string) : string {
    const channel = getNameBetweenStrings(usherUrl, usherDomain, usherExt);
    console.log("channel name parsed usher: " + channel);
    return channel;
}


// Get channel between the first occurance of startStr and the first endStr after startStr.
export function getNameBetweenStrings(
        url: string, startStr: string, endStr: string, endOptional: boolean = false) : string {
    let startIndex = url.indexOf(startStr);
    if(startIndex === -1) {
        return null;
    }
    startIndex += startStr.length;

    let endIndex = url.indexOf(endStr, startIndex + 1);
    if(endIndex === -1) {
        if(endOptional) endIndex = url.length;
        else return null;
    }
    return url.substring(startIndex, endIndex);
}


// TODO: Instead of pre-defined url format, use recently used ont in Twitch web
export function buildUsherUrl(channel: string, token: string, sig: string) : UsherUrl {
    const usherUrl = new UsherUrl(`https://usher.ttvnw.net/api/channel/hls/${channel}.m3u8`);
    usherUrl.update(token, sig);

    // It is not clear if all of these params are required or if there are any missing ones.
    usherUrl.setQueryString("player", "twitchweb");
    usherUrl.setQueryString("allow_source", "true");
    usherUrl.setQueryString("type", "any");
    
    return usherUrl;
}


// Interface to communicate between background and contentscript
// to request/respond access token URL and usher URL for a channel.
export interface GetUrlsResponse {
    webUrl: UrlGroup;
    lastRequested: UrlGroup;
}


export interface UrlGroup {
    channel: string;
    accessTokenUrl: string;
    usherUrl: string;
}


// Class to store and manipulate usher URL.
export class UsherUrl {
    originalUrl: string;
    urlObject: URL;
    channel: string;
    expiresAt: number;  // Token expiration datetime in epoch seconds

    constructor(url: string) {
        this.originalUrl = url;
        this.urlObject = new URL(url);
        this.channel = this.getChannel();        
        this.expiresAt = this.getExpiresAt();
        this.setQueryString("allow_audio_only", "true");
    }

    getUnexpiredUrl() : string {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        // 60 seconds buffer before token expiration
        if(secondsSinceEpoch + 60 < this.expiresAt) {
            return this.getUrl();
        }
        console.debug(`Cached URL for ${this.channel} is expired`);
        return null;
    }

    getUrl() : string {
        return this.urlObject.toString();
    }

    getPath(url: string) : string {
        const endIndex = url.indexOf("?");
        if(endIndex === -1) {
            return url;
        }
        return url.substring(0, endIndex);
    }

    getQueryString(key: string) : string {
        const value = this.urlObject.searchParams.get(key);
        return value;
    }

    setQueryString(name: string, value: string) {
        this.urlObject.searchParams.set(name, value);
    }

    getExpiresAt() : number {
        const tokenString = this.getQueryString("token");
        if(!tokenString) {
            return null;
        }

        try {
            const tokenJson = JSON.parse(tokenString);
            const expiresAt = tokenJson.expires as number;
            return expiresAt;
        }
        catch(err) {
            console.log(`Cannot parse token in usher URL. Error: ${err}`);
        }
        return null;
    }

    getChannel() : string {
        const channel = getChannelFromUsherUrl(this.originalUrl);
        return channel;
    }

    update(newToken: string, newSig: string) {
        this.setQueryString("token", newToken);
        this.setQueryString("sig", newSig);
        this.setQueryString("p", this.getRandomNumber().toString());
        this.expiresAt = this.getExpiresAt();
    }

    getRandomNumber() : number {
        return Math.floor(Math.random() * 1000000);
    }
}