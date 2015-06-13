<%= contents %>
require(['linkify', 'linkify/plugins/hashtag'], function (linkify, hashtag) {
	hashtag(linkify);
});
