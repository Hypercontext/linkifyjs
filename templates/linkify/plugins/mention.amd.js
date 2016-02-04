<%= contents %>
require(['linkify', 'linkify/plugins/mention'], function (linkify, mention) {
	mention(linkify);
});
