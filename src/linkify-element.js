/**
	Linkify a HTML DOM node
*/

import * as linkify from './linkify';

const {tokenize, options} = linkify;
const {Options} = options;

const HTML_NODE = 1, TXT_NODE = 3;

/**
	Given a parent element and child node that the parent contains, replaces
	that child with the given array of new children
*/
function replaceChildWithChildren(parent, oldChild, newChildren) {
	let lastNewChild = newChildren[newChildren.length - 1];
	parent.replaceChild(lastNewChild, oldChild);
	for (let i = newChildren.length - 2; i >= 0; i--) {
		parent.insertBefore(newChildren[i], lastNewChild);
		lastNewChild = newChildren[i];
	}
}

/**
	Given an array of MultiTokens, return an array of Nodes that are either
	(a) Plain Text nodes (node type 3)
	(b) Anchor tag nodes (usually, unless tag name is overridden in the options)

	Takes the same options as linkifyElement and an optional doc element
	(this should be passed in by linkifyElement)
*/
function tokensToNodes(tokens, opts, doc) {
	let result = [];

	for (const token of tokens) {
		if (token.type === 'nl' && opts.nl2br) {
			result.push(doc.createElement('br'));
			continue;
		} else if (!token.isLink || !opts.check(token)) {
			result.push(doc.createTextNode(token.toString()));
			continue;
		}

		let {
			formatted,
			formattedHref,
			tagName,
			className,
			target,
			events,
			attributes,
		} = opts.resolve(token);

		// Build the link
		let link = doc.createElement(tagName);
		link.setAttribute('href', formattedHref);

		if (className) {
			link.setAttribute('class', className);
		}

		if (target) {
			link.setAttribute('target', target);
		}

		// Build up additional attributes
		if (attributes) {
			for (var attr in attributes) {
				link.setAttribute(attr, attributes[attr]);
			}
		}

		if (events) {
			for (var event in events) {
				if (link.addEventListener) {
					link.addEventListener(event, events[event]);
				} else if (link.attachEvent)  {
					link.attachEvent('on' + event, events[event]);
				}
			}
		}

		link.appendChild(doc.createTextNode(formatted));
		result.push(link);
	}

	return result;
}

// Requires document.createElement
function linkifyElementHelper(element, opts, doc) {

	// Can the element be linkified?
	if (!element || element.nodeType !== HTML_NODE) {
		throw new Error(`Cannot linkify ${element} - Invalid DOM Node type`);
	}

	let ignoreTags = opts.ignoreTags;

	// Is this element already a link?
	if (element.tagName === 'A' || options.contains(ignoreTags, element.tagName)) {
		// No need to linkify
		return element;
	}

	let childElement = element.firstChild;

	while (childElement) {
		let str, tokens, nodes;

		switch (childElement.nodeType) {
		case HTML_NODE:
			linkifyElementHelper(childElement, opts, doc);
			break;
		case TXT_NODE: {
			str = childElement.nodeValue;
			tokens = tokenize(str);

			if (tokens.length === 0 || tokens.length === 1 && tokens[0].t === 'text') {
				// No node replacement required
				break;
			}

			nodes = tokensToNodes(tokens, opts, doc);

			// Swap out the current child for the set of nodes
			replaceChildWithChildren(element, childElement, nodes);

			// so that the correct sibling is selected next
			childElement = nodes[nodes.length - 1];

			break;
		}
		}

		childElement = childElement.nextSibling;
	}

	return element;
}

function linkifyElement(element, opts, doc = false) {

	try {
		doc = doc || document || window && window.document || global && global.document;
	} catch (e) { /* do nothing for now */ }

	if (!doc) {
		throw new Error(
			'Cannot find document implementation. ' +
			'If you are in a non-browser environment like Node.js, ' +
			'pass the document implementation as the third argument to linkifyElement.'
		);
	}

	opts = new Options(opts);
	return linkifyElementHelper(element, opts, doc);
}

// Maintain reference to the recursive helper to cache option-normalization
linkifyElement.helper = linkifyElementHelper;
linkifyElement.normalize = (opts) => new Options(opts);

export default linkifyElement;
