import log from 'loglevel';

import { buildUsherUrl, parseAudioOnlyUrl } from './url';
import { AccessTokenGqlPayload } from './accessToken';
import { getTwitchClientId } from './clientIdManager';

const GQL_ENDPOINT_URL: string = 'https://gql.twitch.tv/gql';

// Fetch text content
export async function fetchContent(url: string) {
    if (!url) {
        log.debug('URL is null');
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            log.debug(
                `fetchContent response is not ok with: ${response.status}`
            );
            return null;
        }
        const respText = await response.text();
        return respText;
    } catch (err) {
        log.debug(`fetchContent threw an error: ${err}`);
    }
    return null;
}

// Fetch JSON content
export async function fetchJson(url: string) {
    if (!url) {
        log.debug('URL is null');
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            log.debug(
                `fetchJson response is not ok with: ${response.status}`
            );
            return null;
        }
        const respJson = await response.json();
        return respJson;
    } catch (err) {
        log.debug(`fetchJson threw an error: ${err}`);
    }
    return null;
}

// Run GQL query
export async function fetchGql(payload: any) {
    try {
        const twitchClientId = await getTwitchClientId();
        const postResponse = await fetch(GQL_ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Client-ID': twitchClientId,
                'Content-Type': 'text/plain; charset=UTF-8',
            },
            body: JSON.stringify(payload),
        });
        const respJson = await postResponse.json();
        return respJson;
    } catch (err) {
        log.debug(`fetchGql threw an error: ${err}`);
    }
    return null;
}

export async function fetchAudioStreamUrl(usherUrl: string): Promise<string> {
    const content = await fetchContent(usherUrl);
    const streamUrl = parseAudioOnlyUrl(content);
    return streamUrl;
}

export async function fetchUsherUrl(
    channel: string,
    tokenUrl: string,
    lastRequestedChannel: string,
    lastRequstedUsherUrl: string
): Promise<string> {
    // Get new token and sig from access token URL
    const respJson = await fetchJson(tokenUrl);
    if (!respJson) {
        return null;
    }

    const token = respJson.token as string;
    const sig = respJson.sig as string;
    if (!token || !sig) {
        return null;
    }

    // Check if the channel is different from the channel of the last requested usher url
    // (This is possible if the channel's streamer is hosting another channel)
    if (lastRequestedChannel && channel !== lastRequestedChannel) {
        if (lastRequstedUsherUrl) {
            return lastRequstedUsherUrl;
        }
        // Otherwise, create a new one and store it
        const usherUrl = buildUsherUrl(lastRequestedChannel, token, sig);
        return usherUrl.getUrl();
    }
    return null;
}

export async function tryFetchingPlaylist(channel: string): Promise<string> {
    // If usher URL was not cached or is expired, make a GQL call and get a new one
    const tokenGqlPayload: any = Object.assign({}, AccessTokenGqlPayload);
    tokenGqlPayload['variables']['login'] = channel;

    const gqlResponseJson = await fetchGql(tokenGqlPayload);
    log.debug('gqlResponseJson', gqlResponseJson);

    if (!gqlResponseJson) {
        return null;
    }

    // Get new token and sig from access token URL
    const dataJson = gqlResponseJson?.data?.streamPlaybackAccessToken;
    const token = dataJson?.value as string;
    const sig = dataJson?.signature as string;
    if (!token || !sig) {
        return null;
    }

    const newUsherUrl = buildUsherUrl(channel, token, sig);
    const respText = await fetchContent(newUsherUrl.getUrl());
    log.debug('Playlist content', respText);
    return respText;
}
