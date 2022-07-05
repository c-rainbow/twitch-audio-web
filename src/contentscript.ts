import log from 'loglevel';
import { VideoPlayerContainer } from './video_player_container';

// Although the script runs as a browser extension,
// Webpack optimizes it with the NODE_ENV environment variable in the build time.
// In the bundled contentscript.js, this expression is optimized to either true or false.
if (process.env.NODE_ENV === 'production') {
  log.setDefaultLevel(log.levels.ERROR);
}
else {
  log.setDefaultLevel(log.levels.DEBUG);
}


const container = new VideoPlayerContainer();
container.run();
