import { setTwitchClientId } from './clientIdManager';

chrome.webRequest.onSendHeaders.addListener(
    function (details) {
        const headers = details.requestHeaders || [];
        for (const header of headers) {
            if ('Client-ID' === header.name) {
                const clientId = header.value;
                setTwitchClientId(clientId);
            }
        }
    },
    { urls: ['*://gql.twitch.tv/gql/*'] },
    ['requestHeaders']
);
