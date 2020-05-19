var recent_access_token_url = null;
var recent_usher_url = null;

console.log("receiving end")


var port = chrome.runtime.connect({name: "url_channel"})

port.onMessage.addListener(
    function(request) {
        if (request.access_token_url) {
            console.log("access token url received: " + request.access_token_url);
            recent_access_token_url = request.access_token_url;
        }
        else if(request.usher_url) {
            console.log("usher url received: " + request.usher_url);
            recent_usher_url = request.usher_url;
        }
        else {
            console.log("What message is this?" + JSON.stringify(request));
        }
        console.log("Received: " + request)
    }
);
