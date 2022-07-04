import { setTwitchClientId } from './clientIdManager';


// Store Twitch client ID
chrome.webRequest.onSendHeaders.addListener(
    function (details) {
        const headers = details.requestHeaders || [];
        for (const header of headers) {
            if ('Client-ID' === header.name) {
                const clientId = header.value;
                setTwitchClientId(clientId);
                console.log('Client-ID saved in client map');
            }
        }
    },
    { urls: ['*://gql.twitch.tv/gql/*'] },
    ['requestHeaders']
);


// webNavigation API only works in background script.
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log('New url:', details.url);
});