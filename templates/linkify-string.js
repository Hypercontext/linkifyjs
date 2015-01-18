;(function (linkify) {
"use strict";
var tokenize = linkify.tokenize;
<%= contents %>
window.linkifyStr = linkifyStr;
String.prototype.linkify = function (options) {
	return linkifyStr(this, options);
};
})(window.linkify);
