/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/storageManager.ts":
/*!*******************************!*\
  !*** ./src/storageManager.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTwitchClientId: () => (/* binding */ getTwitchClientId),
/* harmony export */   getTwitchOauthToken: () => (/* binding */ getTwitchOauthToken),
/* harmony export */   setTwitchClientId: () => (/* binding */ setTwitchClientId),
/* harmony export */   setTwitchOauthToken: () => (/* binding */ setTwitchOauthToken)
/* harmony export */ });
// Code shared by both service workers and content script
const TWITCH_CLIENT_ID_KEY = 'twitchClientId';
const TWITCH_OAUTH_TOKEN_KEY = 'twitchOauthToken';
async function getTwitchClientId() {
    const result = await chrome.storage.local.get([TWITCH_CLIENT_ID_KEY]);
    return result[TWITCH_CLIENT_ID_KEY] || null;
}
async function setTwitchClientId(twitchClientId) {
    await chrome.storage.local.set({ [TWITCH_CLIENT_ID_KEY]: twitchClientId });
}
async function getTwitchOauthToken() {
    const result = await chrome.storage.local.get([TWITCH_OAUTH_TOKEN_KEY]);
    return result[TWITCH_OAUTH_TOKEN_KEY] || null;
}
async function setTwitchOauthToken(twitchOauthToken) {
    await chrome.storage.local.set({ [TWITCH_OAUTH_TOKEN_KEY]: twitchOauthToken });
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
/* harmony import */ var _storageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storageManager */ "./src/storageManager.ts");

chrome.webRequest.onSendHeaders.addListener(async function (details) {
    let oauthTokenFound = false;
    const headers = details.requestHeaders || [];
    for (const header of headers) {
        const headerName = header.name.toLocaleLowerCase();
        if ('client-id' === headerName) {
            const clientId = header.value;
            await (0,_storageManager__WEBPACK_IMPORTED_MODULE_0__.setTwitchClientId)(clientId);
        }
        else if ('authorization' === headerName) {
            const oauthToken = header.value;
            if (oauthToken) {
                await (0,_storageManager__WEBPACK_IMPORTED_MODULE_0__.setTwitchOauthToken)(oauthToken);
                oauthTokenFound = true;
                // console.log('Authorization found', header.value);
            }
        }
    }
    // If user logged out
    if (!oauthTokenFound) {
        // console.log('Authorization not found');
        await (0,_storageManager__WEBPACK_IMPORTED_MODULE_0__.setTwitchOauthToken)(null);
    }
}, { urls: ['*://gql.twitch.tv/gql/*'] }, ['requestHeaders']);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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L3NyYy9zdG9yYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHdpdGNoX2F1ZGlvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90d2l0Y2hfYXVkaW8vLi9zcmMvYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb2RlIHNoYXJlZCBieSBib3RoIHNlcnZpY2Ugd29ya2VycyBhbmQgY29udGVudCBzY3JpcHRcblxuY29uc3QgVFdJVENIX0NMSUVOVF9JRF9LRVkgPSAndHdpdGNoQ2xpZW50SWQnO1xuY29uc3QgVFdJVENIX09BVVRIX1RPS0VOX0tFWSA9ICd0d2l0Y2hPYXV0aFRva2VuJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFR3aXRjaENsaWVudElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbVFdJVENIX0NMSUVOVF9JRF9LRVldKTtcbiAgICByZXR1cm4gcmVzdWx0W1RXSVRDSF9DTElFTlRfSURfS0VZXSB8fCBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0VHdpdGNoQ2xpZW50SWQodHdpdGNoQ2xpZW50SWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtUV0lUQ0hfQ0xJRU5UX0lEX0tFWV06IHR3aXRjaENsaWVudElkIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHdpdGNoT2F1dGhUb2tlbigpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtUV0lUQ0hfT0FVVEhfVE9LRU5fS0VZXSk7XG4gIHJldHVybiByZXN1bHRbVFdJVENIX09BVVRIX1RPS0VOX0tFWV0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFR3aXRjaE9hdXRoVG9rZW4odHdpdGNoT2F1dGhUb2tlbjogc3RyaW5nIHwgbnVsbCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbVFdJVENIX09BVVRIX1RPS0VOX0tFWV06IHR3aXRjaE9hdXRoVG9rZW4gfSk7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzZXRUd2l0Y2hDbGllbnRJZCwgc2V0VHdpdGNoT2F1dGhUb2tlbiB9IGZyb20gJy4vc3RvcmFnZU1hbmFnZXInO1xuXG5jaHJvbWUud2ViUmVxdWVzdC5vblNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKFxuICAgIGFzeW5jIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgICAgIGxldCBvYXV0aFRva2VuRm91bmQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IGRldGFpbHMucmVxdWVzdEhlYWRlcnMgfHwgW107XG4gICAgICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlck5hbWUgPSBoZWFkZXIubmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpXG4gICAgICAgICAgICBpZiAoJ2NsaWVudC1pZCcgPT09IGhlYWRlck5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGllbnRJZCA9IGhlYWRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICBhd2FpdCBzZXRUd2l0Y2hDbGllbnRJZChjbGllbnRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgnYXV0aG9yaXphdGlvbicgPT09IGhlYWRlck5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYXV0aFRva2VuID0gaGVhZGVyLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvYXV0aFRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNldFR3aXRjaE9hdXRoVG9rZW4ob2F1dGhUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIG9hdXRoVG9rZW5Gb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdBdXRob3JpemF0aW9uIGZvdW5kJywgaGVhZGVyLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdXNlciBsb2dnZWQgb3V0XG4gICAgICAgIGlmICghb2F1dGhUb2tlbkZvdW5kKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQXV0aG9yaXphdGlvbiBub3QgZm91bmQnKTtcbiAgICAgICAgICAgIGF3YWl0IHNldFR3aXRjaE9hdXRoVG9rZW4obnVsbCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHsgdXJsczogWycqOi8vZ3FsLnR3aXRjaC50di9ncWwvKiddIH0sXG4gICAgWydyZXF1ZXN0SGVhZGVycyddXG4pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9