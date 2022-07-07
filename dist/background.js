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

chrome.webRequest.onSendHeaders.addListener(function (details) {
    const headers = details.requestHeaders || [];
    for (const header of headers) {
        if ('Client-ID' === header.name) {
            const clientId = header.value;
            (0,_clientIdManager__WEBPACK_IMPORTED_MODULE_0__.setTwitchClientId)(clientId);
        }
    }
}, { urls: ['*://gql.twitch.tv/gql/*'] }, ['requestHeaders']);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5REFBeUQ7QUFFekQsTUFBTSxvQkFBb0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUV2QyxLQUFLLFVBQVUsaUJBQWlCO0lBQ25DLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUFDO0FBQ2hELENBQUM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsY0FBc0I7SUFDMUQsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7Ozs7Ozs7VUNYRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTnNEO0FBRXRELE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FDdkMsVUFBVSxPQUFPO0lBQ2IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7SUFDN0MsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsSUFBSSxXQUFXLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzlCLG1FQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO0tBQ0o7QUFDTCxDQUFDLEVBQ0QsRUFBRSxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEVBQ3JDLENBQUMsZ0JBQWdCLENBQUMsQ0FDckIsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3R3aXRjaF9hdWRpby8uL3NyYy9jbGllbnRJZE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vdHdpdGNoX2F1ZGlvL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3R3aXRjaF9hdWRpby93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHdpdGNoX2F1ZGlvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdHdpdGNoX2F1ZGlvL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdHdpdGNoX2F1ZGlvLy4vc3JjL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29kZSBzaGFyZWQgYnkgYm90aCBzZXJ2aWNlIHdvcmtlcnMgYW5kIGNvbnRlbnQgc2NyaXB0XHJcblxyXG5jb25zdCBUV0lUQ0hfQ0xJRU5UX0lEX0tFWSA9ICd0d2l0Y2hDbGllbnRJZCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHdpdGNoQ2xpZW50SWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1RXSVRDSF9DTElFTlRfSURfS0VZXSk7XHJcbiAgICByZXR1cm4gcmVzdWx0W1RXSVRDSF9DTElFTlRfSURfS0VZXSA/PyBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0VHdpdGNoQ2xpZW50SWQodHdpdGNoQ2xpZW50SWQ6IHN0cmluZykge1xyXG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgdHdpdGNoQ2xpZW50SWQgfSk7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzZXRUd2l0Y2hDbGllbnRJZCB9IGZyb20gJy4vY2xpZW50SWRNYW5hZ2VyJztcclxuXHJcbmNocm9tZS53ZWJSZXF1ZXN0Lm9uU2VuZEhlYWRlcnMuYWRkTGlzdGVuZXIoXHJcbiAgICBmdW5jdGlvbiAoZGV0YWlscykge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBkZXRhaWxzLnJlcXVlc3RIZWFkZXJzIHx8IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIGhlYWRlcnMpIHtcclxuICAgICAgICAgICAgaWYgKCdDbGllbnQtSUQnID09PSBoZWFkZXIubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpZW50SWQgPSBoZWFkZXIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBzZXRUd2l0Y2hDbGllbnRJZChjbGllbnRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyB1cmxzOiBbJyo6Ly9ncWwudHdpdGNoLnR2L2dxbC8qJ10gfSxcclxuICAgIFsncmVxdWVzdEhlYWRlcnMnXVxyXG4pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=