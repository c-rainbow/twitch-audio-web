
import { getNameBetweenStrings, getChannelFromWebUrl } from "./url_utils.js";


export default class UsherUrl {


    // TODO: Use https://developer.mozilla.org/en-US/docs/Web/API/URL as possible

    constructor(url) {
        this.originalUrl = url;
        this.channel = getChannelFromWebUrl(url);
        this.queryStringList = this.parseQueryString(url);
        this.path = this.getPath(url);
        this.expiresAt = this.getExpirationTime(this.queryStringList);
    }

    getPath(url) {
        const endIndex = url.indexOf("?");
        if(endIndex == -1) {
            return url;
        }
        return url.substring(0, endIndex);
    }

    parseQueryString(url) {
        const startIndex = url.indexOf("?");
        const queryStrings = url.substring(startIndex + 1);
        const splited = queryStrings.split("&");
        
        let queryStringArray = [];
        splited.forEach(function(item) {
            const itemSplited = item.split("=");
            if(itemSplited) queryStringArray.push(itemSplited);
        })
        return queryStringArray;
    }

    getExpirationTime(queryStringList) {
        const tokenQueryString = queryStringList.find(item => item[0] == "token");
        if(!tokenQueryString) return null;
        const tokenJsonString = tokenQueryString[1];
        try {
            // TODO: Not sure if tokenJsonString is still URL-encoded.
            const tokenJson = json.parse(tokenJsonString);
            return tokenJson.expires;
        }
        catch(err) {
            console.log("Cannot parse token in usher URL: " + tokenJsonString);
        }
        return null;
    }

    getChannelFromUsherUrl(usherUrl) {
        const channel = getNameBetweenStrings(usherUrl, usherDomain, usherExt);
        console.log("channel name parsed usher: " + channel);
        return channel;
    }
}