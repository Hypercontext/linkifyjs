// NOTE: This file should only be used to build into a browser package
// Linkify with basic hashtags support
import linkify from './linkify';
import hashtag from './linkify/plugins/hashtag';
hashtag(linkify);
export default linkify;
