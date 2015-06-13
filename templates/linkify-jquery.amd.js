<%= contents %>
require(['jquery', 'linkify-jquery'], function ($, apply) {
	if (typeof $.fn.linkify !== 'function') {
		apply($);
	}
});
