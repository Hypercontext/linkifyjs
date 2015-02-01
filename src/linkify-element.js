/**
	Linkify a HTML DOM node
*/

import {tokenize} from './linkify';
import * as options from './linkify/utils/options';

let
HTML_NODE = 1,
TXT_NODE = 3;

/**
	Given an array of MultiTokens, return an array of Nodes that are either
	(a) Plain Text nodes (node type 3)
	(b) Anchor tag nodes (usually, unless tag name is overriden in the options)

	Takes the same options as linkifyElement and an optional doc element (this should be passed in by linkifyElement)
*/
function tokensToNodes(tokens, opts, doc) {
	let result = [];

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];
		if (token.isLink) {
			let
			tagName			= options.resolve(opts.tagName, token.type),
			linkClass		= options.resolve(opts.linkClass, token.type),
			target			= options.resolve(opts.target, token.type),
			formatted		= options.resolve(opts.format, token.toString(), token.type),
			href			= token.toHref(opts.defaultProtocol),
			formattedHref	= options.resolve(opts.formatHref, href, token.type),
			attributesHash	= options.resolve(opts.attributes, token.type);

			// Build the link
			let link = doc.createElement(tagName);
			link.setAttribute('href', formattedHref);
			link.setAttribute('class', linkClass);
			if (target) {
				link.setAttribute('target', target);
			}

			// Build up additional attributes
			if (attributesHash) {
				for (let attr in attributesHash) {
					link.setAttribute(attr, attributesHash);
				}
			}

			link.appendChild(doc.createTextNode(formatted));
			result.push(link);
		}
	}

	return result;
}

// Requires document.createElement
function linkifyElement(element, opts, doc) {

	doc = doc || window && window.document || global && global.document;

	if (!doc) {
		throw new Error(
			'Cannot find document implementation. ' +
			'If you are in a non-browser environment like Node.js, ' +
			'pass the document implementation as the third argument to linkifyElement.'
		);
	}

	// Can the element be linkified?
	if (!element || typeof element !== 'object' || element.nodeType !== HTML_NODE) {
		throw new Error(`Cannot linkify ${element} - Invalid DOM Node type`);
	}

	// Is this element already a link?
	if (element.tagName.toLowerCase() === 'a' /*|| element.hasClass('linkified')*/) {
		// No need to linkify
		return element;
	}

	let
	children = [],
	childElement = element.firstChild;

	while (childElement) {

		switch (childElement.nodeType) {
		case HTML_NODE:
			children.push(linkifyElement(childElement, opts));
			break;
		case TXT_NODE:

			let
			str = childElement.nodeValue,
			tokens = tokenize(str);

			children.push(...tokensToNodes(tokens, opts, doc));

			break;

		default: children.push(childElement); break;
		}

		childElement = childElement.nextSibling;
	}

	// Clear out the element
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}

	return linkifyElement;
}

export { linkifyElement };
export default function (element, opts, doc=null) {
	opts = options.normalize(opts);
	return linkifyElement(element, opts, doc);
}
