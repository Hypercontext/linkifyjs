let linkify = require('./linkify');
require('./plugins/hashtag')(linkify);
module.exports = linkify;
