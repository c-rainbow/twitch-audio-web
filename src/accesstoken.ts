export const AccessTokenGqlPayload : object = {
  "operationName": "PlaybackAccessToken_Template",
  "query": "query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: \"web\", playerBackend: \"mediaplayer\", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: \"web\", playerBackend: \"mediaplayer\", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}",
  "variables": {
    "isLive": true,
    "login": null,  // to be replaced with streamer username
    "isVod": false,
    "vodID": "",
    // There is a high chance that ads will be skipped if the player type is
    // one of "thunderdome", "pop_tart", or "picture-by-picture".
    // For more information, see https://github.com/cleanlock/VideoAdBlockForTwitch/blob/2a02cb392c906a1fe555ab30a4e5353f4fa0b714/chrome/remove_video_ads.js#L63-L66
    "playerType": "picture-by-picture"
  }
}