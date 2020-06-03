# Twitch Radio Mode Chrome Extension

This extension for Google Chrome browser lets users play the stream in radio mode.



## Use

After installing the extension, go to a Twitch channel webpage. You will see a radio icon next to the volume slider in the video player area.

<------Add a screenshot

Clicking the icon will start playing the audio_only stream, and the icon becomes yellow.

<------Add a screenshot

If you want to pause, just click the radio icon one more time.

<------Add a screenshot

The audio will automatically stop if the video is played.



## Install

The official installation instruction can be found [here](https://developer.chrome.com/extensions/getstarted).

1. Download or clone the code, and unzip the file
2. In Google Chrome, go to chrome://extensions
3. On the top right, enable "Developer Mode"
4. Click "Load Unpacked", locate the unzipped directory.

The code comes with pre-built Javascript code which can be readily used as an extension.


## Develop

The extension is created with TypeScript and uses Webpack to build the code.

Please install webpack and other dependencies for the project.

```
> npm i
```

After you build the project, two files (dist/background.js, dist/conentscript.js) will be updated with the current TypeScript code.

```
> webpack
```

Load the extension in Chrome browser as instructed in _Install_ section.