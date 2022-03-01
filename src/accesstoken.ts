export const AccessTokenGqlPayload : object = {
  "operationName": "PlaybackAccessToken_Template",
  "query": "query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: \"web\", playerBackend: \"mediaplayer\", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: \"web\", playerBackend: \"mediaplayer\", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}",
  "variables": {
    "isLive": true,
    "login": null,  // to be replaced with streamer username
    "isVod": false,
    "vodID": "",
    "playerType": "site"
  }
}