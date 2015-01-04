// Linkify with basic hashtags support
let linkify = require('./linkify');
require('./plugins/hashtag')(linkify);
module.exports = linkify;
