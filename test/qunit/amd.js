var w = null;

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
});
