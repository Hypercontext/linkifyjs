var w = null;

window.__karma__.start = (function (start) {
	return function () {
		require([
			'react',
			'react-dom',
			'linkify',
			'linkify-element',
			'linkify-html',
			'linkify-string',
			'linkify-react'
		], function (React, ReactDOM, linkify, linkifyElement, linkifyHtml, linkifyStr, LinkifyReact) {
			w = {
				React: React,
				ReactDOM: ReactDOM,
				linkify: linkify,
				linkifyElement: linkifyElement,
				linkifyHtml: linkifyHtml,
				linkifyStr: linkifyStr,
				LinkifyReact: LinkifyReact
			};
			start();
		});
	};
})(window.__karma__.start);
