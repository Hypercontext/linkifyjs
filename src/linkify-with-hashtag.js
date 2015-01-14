// NOTE: This file should only be used to build into a browser package
// Linkify with basic hashtags support
import linkify from './linkify';
require('./plugins/hashtag')(linkify);
export default linkify;
