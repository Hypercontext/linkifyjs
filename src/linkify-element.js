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
	// TODO: Write this
}

// Requires document.createElement
function linkifyElement(element, opts, doc=null) {

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

	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}

	return linkifyElement;
}

module.exports = linkifyElement;
