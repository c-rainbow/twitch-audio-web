
import { getNameBetweenStrings, getChannelFromWebUrl } from "./url_utils.js";


export default class UsherUrl {

    originalUrl: string;
    channel: string;
    queryStringList: string[][];
    path: string;
    expiresAt: number;
    urlObject: URL;

    // TODO: Use https://developer.mozilla.org/en-US/docs/Web/API/URL as possible
    constructor(url: string) {
        this.originalUrl = url;
        this.urlObject = new URL(url);
        this.channel = getChannelFromWebUrl(url);
        this.queryStringList = this.parseQueryString(url);
        this.path = this.getPath(url);
        this.expiresAt = this.getExpirationTime(this.queryStringList);
    }

    getPath(url: string) : string {
        const endIndex = url.indexOf("?");
        if(endIndex == -1) {
            return url;
        }
        return url.substring(0, endIndex);
    }

    parseQueryString(url: string) : string[][] {
        const startIndex = url.indexOf("?");
        const queryStrings = url.substring(startIndex + 1);
        const splited = queryStrings.split("&");
        
        const queryStringArray: string[][] = [];
        splited.forEach(function(item) {
            const itemSplited = item.split("=");
            if(itemSplited) queryStringArray.push(itemSplited);
        })
        return queryStringArray;
    }

    getExpirationTime(queryStringList: string[][]) : number {
        const expiresQueryString = queryStringList.find(item => item[0] == "expiresAt");
        if(!expiresQueryString) return null;

        try {
            // expiresQueryString looks like ["2020-05-17T09:44:09Z"]
            const expiresAt = Date.parse(expiresQueryString[0]);
            return expiresAt / 1000;  // Milliseconds to seconds
        }
        catch(err) {
            console.log("Cannot parse token in usher URL: " + expiresQueryString[0]);
        }
        return null;
    }

    getChannelFromUsherUrl(usherUrl: string) : string {
        const channel = getNameBetweenStrings(usherUrl, usherDomain, usherExt);
        console.log("channel name parsed usher: " + channel);
        return channel;
    }
}