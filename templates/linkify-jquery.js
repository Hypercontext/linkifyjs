;(function (window, linkify, $) {
<%= contents %>
if (typeof $.fn.linkify !== 'function') {
    linkifyJquery($);
}
})(window, linkify, jQuery);
