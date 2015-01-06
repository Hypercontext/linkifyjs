// NOTE: This file should only be used to build into a browser package
// Linkify with basic hashtags support
let linkify = require('./linkify');
require('./plugins/hashtag')(linkify);
module.exports = linkify;
