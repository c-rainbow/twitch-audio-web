import { setTwitchClientId, setTwitchOauthToken } from './storageManager';

chrome.webRequest.onSendHeaders.addListener(
    async function (details) {
        let oauthTokenFound = false;
        const headers = details.requestHeaders || [];
        for (const header of headers) {
            const headerName = header.name.toLocaleLowerCase()
            if ('client-id' === headerName) {
                const clientId = header.value;
                await setTwitchClientId(clientId);
            }
            else if ('authorization' === headerName) {
                const oauthToken = header.value;
                if (oauthToken) {
                    await setTwitchOauthToken(oauthToken);
                    oauthTokenFound = true;
                    // console.log('Authorization found', header.value);
                }
            }
        }
        // If user logged out
        if (!oauthTokenFound) {
            // console.log('Authorization not found');
            await setTwitchOauthToken(null);
        }
    },
    { urls: ['*://gql.twitch.tv/gql/*'] },
    ['requestHeaders']
);
