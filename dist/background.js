/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/clientIdManager.ts":
/*!********************************!*\
  !*** ./src/clientIdManager.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTwitchClientId": () => (/* binding */ getTwitchClientId),
/* harmony export */   "setTwitchClientId": () => (/* binding */ setTwitchClientId)
/* harmony export */ });
// Code shared by both service workers and content script
const TWITCH_CLIENT_ID_KEY = 'twitchClientId';
async function getTwitchClientId() {
    const result = await chrome.storage.local.get([TWITCH_CLIENT_ID_KEY]);
    return result[TWITCH_CLIENT_ID_KEY] ?? null;
}
async function setTwitchClientId(twitchClientId) {
    await chrome.storage.local.set({ twitchClientId });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _clientIdManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clientIdManager */ "./src/clientIdManager.ts");

chrome.webRequest.onSendHeaders.addListener(async function (details) {
    const headers = details.requestHeaders || [];
    for (const header of headers) {
        if ('client-id' === header.name.toLocaleLowerCase()) {
            const clientId = header.value;
            await (0,_clientIdManager__WEBPACK_IMPORTED_MODULE_0__.setTwitchClientId)(clientId);
        }
    }
}, { urls: ['*://gql.twitch.tv/gql/*'] }, ['requestHeaders']);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5REFBeUQ7QUFFekQsTUFBTSxvQkFBb0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUV2QyxLQUFLLFVBQVUsaUJBQWlCO0lBQ25DLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUFDO0FBQ2hELENBQUM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsY0FBc0I7SUFDMUQsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7Ozs7Ozs7VUNYRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTnNEO0FBRXRELE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FDdkMsS0FBSyxXQUFXLE9BQU87SUFDbkIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7SUFDN0MsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsSUFBSSxXQUFXLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO1lBQ2pELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDOUIsTUFBTSxtRUFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNyQztLQUNKO0FBQ0wsQ0FBQyxFQUNELEVBQUUsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUNyQyxDQUFDLGdCQUFnQixDQUFDLENBQ3JCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vLi9zcmMvY2xpZW50SWRNYW5hZ2VyLnRzIiwid2VicGFjazovL3R3aXRjaF9hdWRpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3R3aXRjaF9hdWRpby93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3R3aXRjaF9hdWRpby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3R3aXRjaF9hdWRpby8uL3NyYy9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvZGUgc2hhcmVkIGJ5IGJvdGggc2VydmljZSB3b3JrZXJzIGFuZCBjb250ZW50IHNjcmlwdFxyXG5cclxuY29uc3QgVFdJVENIX0NMSUVOVF9JRF9LRVkgPSAndHdpdGNoQ2xpZW50SWQnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFR3aXRjaENsaWVudElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtUV0lUQ0hfQ0xJRU5UX0lEX0tFWV0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdFtUV0lUQ0hfQ0xJRU5UX0lEX0tFWV0gPz8gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFR3aXRjaENsaWVudElkKHR3aXRjaENsaWVudElkOiBzdHJpbmcpIHtcclxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHR3aXRjaENsaWVudElkIH0pO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgc2V0VHdpdGNoQ2xpZW50SWQgfSBmcm9tICcuL2NsaWVudElkTWFuYWdlcic7XHJcblxyXG5jaHJvbWUud2ViUmVxdWVzdC5vblNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKFxyXG4gICAgYXN5bmMgZnVuY3Rpb24gKGRldGFpbHMpIHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gZGV0YWlscy5yZXF1ZXN0SGVhZGVycyB8fCBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGhlYWRlciBvZiBoZWFkZXJzKSB7XHJcbiAgICAgICAgICAgIGlmICgnY2xpZW50LWlkJyA9PT0gaGVhZGVyLm5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpZW50SWQgPSBoZWFkZXIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBzZXRUd2l0Y2hDbGllbnRJZChjbGllbnRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyB1cmxzOiBbJyo6Ly9ncWwudHdpdGNoLnR2L2dxbC8qJ10gfSxcclxuICAgIFsncmVxdWVzdEhlYWRlcnMnXVxyXG4pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=