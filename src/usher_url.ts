
import { getChannelFromUsherUrl } from "./url_utils";


export default class UsherUrl {
    originalUrl: string;
    urlObject: URL;
    channel: string;
    expiresAt: number;  // Token expiration datetime in epoch seconds

    // TODO: Use https://developer.mozilla.org/en-US/docs/Web/API/URL as possible
    constructor(url: string) {
        this.originalUrl = url;
        this.urlObject = new URL(url);
        this.channel = this.getChannel();        
        this.expiresAt = this.getExpiresAt();
        this.setQueryString("allow_audio_only", "true");
    }

    getUrl() : string {
        return this.urlObject.toString();
    }

    getPath(url: string) : string {
        const endIndex = url.indexOf("?");
        if(endIndex == -1) {
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
        if(!tokenString) return null;

        try {
            const tokenJson = JSON.parse(tokenString);
            const expires = <number>tokenJson.expires;
            return expires / 1000;  // Milliseconds to seconds
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