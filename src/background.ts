import { setTwitchClientId } from './clientIdManager';

chrome.webRequest.onSendHeaders.addListener(
    async function (details) {
        const headers = details.requestHeaders || [];
        for (const header of headers) {
            if ('client-id' === header.name.toLocaleLowerCase()) {
                const clientId = header.value;
                await setTwitchClientId(clientId);
            }
        }
    },
    { urls: ['*://gql.twitch.tv/gql/*'] },
    ['requestHeaders']
);
