
/**
 * When document_idle state (the default time when contentscript is loaded)
 * Watch DOM changes in body for video-player
 * 
 * If video-player is newly available:
 *  1. put class name video-player-processed, so that it doesn't get processed again
 *  2. Register the element into content script, which holds reference to all video player elements
 *  2. put a new MutationObserver for the controls and buttons
 *  3. When the play/pause button is available:
 *      3-1. Create an audio tag somewhere, with display:none
 *      3-2. Create audio-only button (not add to controls yet)
 *      3-3. Add click listener to audio-only button
 *          3-2-1. If clicked from paused to play:
 *              3-2-1-1. Pause the video play/pause button if necessary,
 *                       by clicking the video play/pause button
 *              3-2-1-2. Get audio_only video url
 *              3-2-1-3. If url is null, not do anything
 *              3-2-1-3. Create Hls, attach the <audio> element, startLoad the url, play.
 *              3-2-1-4. Stop all videos or audios in other video-player elements, if exists.
 *              3-2-1-5. Change audio-only button to "activated"
 *          3-2-2. If clicked from play to pause
 *              3-2-2-1. Pause the audio, stopLoad, detach the element (if necessary),
 *                       destroy Hls (if necessary)
 *              3-2-2-2. Change audio-only button to "deactivated"
 *      3-4. Add MutationObserver to video play/pause button to detect change in a-data-state ?
 *          3-2-1. If the attribute changed from paused to playing:
 *              3-2-1-1. Pause the audio, by clicking audio-only button
 *      3-5. Append the audio-only button to controls
 */



 /**
  * Getting the video url
  * 1. Content script send async requests to background with channelName and callback
  * 2. background checks cache
  *     2-1. If usherUrl does not exist, check accessTokenUrl
  *         2-1-1. If accessTokenUrl does not exist, Callback with null
  *         2-1-2. If accessTokenUrl exists, call the url to get token
  *             2-1-2-1. If the call to accessTokenUrl succeeds:
  *                 2-1-2-1-1. Parse the token to get expiration time
  *                 2-1-2-1-2. Store the new usherUrl and expiration time to cache
  *                 2-1-2-1-3. Callback with the new usherUrl
  *             2-1-2-2. If the call to accessTokenUrl fails:
  *                 2-1-2-2-1. Log the reason
  *                 2-1-2-2-2. Callback with null
  */

  /**
   * store accessTokenUrl and usherUrl
   * 1. parse and store to cache.
   */














(function() {





 




})();