/**
	Linkify a HTML DOM node
*/
import { tokenize, options } from 'linkifyjs';

const { Options } = options;
const HTML_NODE = 1, TXT_NODE = 3;

/**
 * @param {HTMLElement} parent
 * @param {Text | HTMLElement} oldChild
 * @param {Array<Text | HTMLElement>} newChildren
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
 * @param {Array<MultiToken>} tokens
 * @param {Object} opts
 * @param {Document} doc A
 * @returns {Array<Text | HTMLElement>}
 */
function tokensToNodes(tokens, opts, doc) {
	const result = [];
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.t === 'nl' && opts.nl2br) {
			result.push(doc.createElement('br'));
			continue;
		} else if (!token.isLink || !opts.check(token)) {
			result.push(doc.createTextNode(token.toString()));
			continue;
		}

		const {
			formatted,
			formattedHref,
			tagName,
			className,
			target,
			rel,
			events,
			attributes,
		} = opts.resolve(token);

		// Build the link
		const link = doc.createElement(tagName);
		link.setAttribute('href', formattedHref);

		if (className) { link.setAttribute('class', className); }
		if (target) { link.setAttribute('target', target); }
		if (rel) { link.setAttribute('rel', rel); }

		// Build up additional attributes
		if (attributes) {
			for (const attr in attributes) {
				link.setAttribute(attr, attributes[attr]);
			}
		}

		if (events) {
			for (const event in events) {
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

/**
 * Requires document.createElement
 * @param {HTMLElement} element
 * @param {Object} opts
 * @param {Document} doc
 * @returns {HTMLElement}
 */
function linkifyElementHelper(element, opts, doc) {

	// Can the element be linkified?
	if (!element || element.nodeType !== HTML_NODE) {
		throw new Error(`Cannot linkify ${element} - Invalid DOM Node type`);
	}

	const { ignoreTags } = opts;

	// Is this element already a link?
	if (element.tagName === 'A' || ignoreTags.indexOf(element.tagName) >= 0) {
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

/**
 * Recursively traverse the given DOM node, find all links in the text and
 * convert them to anchor tags.
 *
 * @param {HTMLElement} element A DOM node to linkify
 * @param {Object} opts linkify options
 * @param {Document} [doc] window.document implementation, if differs from global
 * @returns {HTMLElement}
 */
export default function linkifyElement(element, opts, doc = null) {
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
