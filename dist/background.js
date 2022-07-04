/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/clientIdManager.ts
// Code shared by both service workers and content script
const TWITCH_CLIENT_ID_KEY = 'twitchClientId';
async function getTwitchClientId() {
    const result = await chrome.storage.local.get([TWITCH_CLIENT_ID_KEY]);
    return result[TWITCH_CLIENT_ID_KEY] ?? null;
}
async function setTwitchClientId(twitchClientId) {
    await chrome.storage.local.set({ twitchClientId });
}

;// CONCATENATED MODULE: ./src/background.ts

chrome.webRequest.onSendHeaders.addListener(function (details) {
    const headers = details.requestHeaders || [];
    for (const header of headers) {
        if ('Client-ID' === header.name) {
            const clientId = header.value;
            setTwitchClientId(clientId);
            console.log('Client-ID saved in client map');
        }
    }
}, { urls: ['*://gql.twitch.tv/gql/*'] }, ['requestHeaders']);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlEQUF5RDtBQUV6RCxNQUFNLG9CQUFvQixHQUFHLGdCQUFnQixDQUFDO0FBRXZDLEtBQUssVUFBVSxpQkFBaUI7SUFDbkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7SUFDdEUsT0FBTyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDaEQsQ0FBQztBQUVNLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxjQUFzQjtJQUMxRCxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDdkQsQ0FBQzs7O0FDWHFEO0FBRXRELE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FDdkMsVUFBVSxPQUFPO0lBQ2IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7SUFDN0MsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsSUFBSSxXQUFXLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzlCLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztTQUNoRDtLQUNKO0FBQ0wsQ0FBQyxFQUNELEVBQUUsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUNyQyxDQUFDLGdCQUFnQixDQUFDLENBQ3JCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vLi9zcmMvY2xpZW50SWRNYW5hZ2VyLnRzIiwid2VicGFjazovL3R3aXRjaF9hdWRpby8uL3NyYy9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvZGUgc2hhcmVkIGJ5IGJvdGggc2VydmljZSB3b3JrZXJzIGFuZCBjb250ZW50IHNjcmlwdFxuXG5jb25zdCBUV0lUQ0hfQ0xJRU5UX0lEX0tFWSA9ICd0d2l0Y2hDbGllbnRJZCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRUd2l0Y2hDbGllbnRJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1RXSVRDSF9DTElFTlRfSURfS0VZXSk7XG4gICAgcmV0dXJuIHJlc3VsdFtUV0lUQ0hfQ0xJRU5UX0lEX0tFWV0gPz8gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFR3aXRjaENsaWVudElkKHR3aXRjaENsaWVudElkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyB0d2l0Y2hDbGllbnRJZCB9KTtcbn1cbiIsImltcG9ydCB7IHNldFR3aXRjaENsaWVudElkIH0gZnJvbSAnLi9jbGllbnRJZE1hbmFnZXInO1xyXG5cclxuY2hyb21lLndlYlJlcXVlc3Qub25TZW5kSGVhZGVycy5hZGRMaXN0ZW5lcihcclxuICAgIGZ1bmN0aW9uIChkZXRhaWxzKSB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IGRldGFpbHMucmVxdWVzdEhlYWRlcnMgfHwgW107XHJcbiAgICAgICAgZm9yIChjb25zdCBoZWFkZXIgb2YgaGVhZGVycykge1xyXG4gICAgICAgICAgICBpZiAoJ0NsaWVudC1JRCcgPT09IGhlYWRlci5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGllbnRJZCA9IGhlYWRlci52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHNldFR3aXRjaENsaWVudElkKGNsaWVudElkKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDbGllbnQtSUQgc2F2ZWQgaW4gY2xpZW50IG1hcCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgdXJsczogWycqOi8vZ3FsLnR3aXRjaC50di9ncWwvKiddIH0sXHJcbiAgICBbJ3JlcXVlc3RIZWFkZXJzJ11cclxuKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9