<%= contents %>
require(['linkify', 'linkify/plugins/ticket'], function (linkify, ticket) {
	ticket(linkify);
});
