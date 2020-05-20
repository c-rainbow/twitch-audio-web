

const twitchDomain = "twitch.tv/"

// These are not channels, but reserved paths in twitch.tv for other purposes.
// The list doesn't have to be comprehensive. The audio-only button will not be
// usable in non-video pages. Just having a shortcut to filter some of invalid channel names
const nonChannels = ["directory", "videos", "u", "settings"];

function getChannelName() {
    let url = location.href;
    console.log("channel name from " + url);
    let domainEnds = url.indexOf(twitchDomain);
    if (domainEnds == -1) {
        console.log("Channel name cannot be found from " + url);
        return null;
    }
    let startIndex = domainEnds + twitchDomain.length;
    let nextSlashIndex = url.indexOf("/", startIndex + 1);
    if (nextSlashIndex == -1) {
        return url.substring(startIndex);  // The URL ends with streamer channel name
    }

    let channelName = url.substring(startIndex + 1, nextSlashIndex);
    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (channelName in nonChannels) {
        return null;
    }
    return channelName;
}