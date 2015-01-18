<%= contents %>
require(['linkify-string'], function (linkifyStr) {
	String.prototype.linkify = function (options) {
		return linkifyStr(this, options);
	}
});
