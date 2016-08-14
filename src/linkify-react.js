import React from 'react';
import * as linkify from './linkify';

let options = linkify.options;

// Given a string, converts to an array of valid React components
// (which may include strings)
function stringToElements(str, opts) {

	let tokens = linkify.tokenize(str);
	let elements = [];
	var linkId = 0;

	for (const token of tokens) {
		if (token.type === 'nl' && opts.nl2br) {
			elements.push(React.createElement('br', {key: `linkified-${++linkId}`}));
			continue;
		} else if (
			!token.isLink ||
			!options.resolve(opts.validate, token.toString(), token.type)
		) {
			// Regular text
			elements.push(token.toString());
			continue;
		}

		let href = token.toHref(opts.defaultProtocol);
		let formatted = options.resolve(opts.format, token.toString(), token.type);
		let formattedHref = options.resolve(opts.formatHref, href, token.type);
		let attributesHash = options.resolve(opts.attributes, href, token.type);
		let tagName = options.resolve(opts.tagName, href, token.type);
		let linkClass = options.resolve(opts.linkClass, href, token.type);
		let target = options.resolve(opts.target, href, token.type);
		let events = options.resolve(opts.events, href, token.type);

		let props = {
			key: `linkified-${++linkId}`,
			href: href,
			className: linkClass,
		};

		if (target) {
			props.target = target;
		}

		// Build up additional attributes
		// Support for events via attributes hash
		if (attributesHash) {
			for (var attr in attributesHash) {
				props[attr] = attributesHash[attr];
			}
		}

		elements.push(React.createElement(tagName, props, formatted));
	}

	return elements;
}

// Recursively linkify the contents of the given React Element instance
function linkifyReactElement(element, opts, elementId = 0) {
	if (React.Children.count(element.props.children) === 0) {
		// No need to clone if the element had no children
		return element;
	}

	let children = [];

	React.Children.forEach(element.props.children, (child) => {
		if (typeof child === 'string') {
			children.push(...stringToElements(child, opts));
		} else if (React.isValidElement(child)) {
			if (typeof child.type === 'string'
				&& options.contains(opts.ignoreTags, child.type.toUpperCase())
			) {
				// Don't linkify this element
				children.push(child);
			} else {
				children.push(linkifyReactElement(child, opts, ++elementId));
			}
		} else {
			// Unknown  element type, just push
			children.push(child);
		}
	});

	// Set a default unique key, copy over remaining props
	let newProps = {key: `linkified-element-${elementId}`};
	for (var prop in element.props) {
		newProps[prop] = element.props[prop];
	}

	return React.cloneElement(element, newProps, children);
}

var Linkify = React.createClass({
	render() {
		// Copy over all non-linkify-specific props
		let newProps = {key: 'linkified-element-0'};
		for (var prop in this.props) {
			if (prop !== 'options' && prop !== 'tagName') {
				newProps[prop] = this.props[prop];
			}
		}

		var opts = options.normalize(this.props.options);
		var tagName = this.props.tagName || 'span';
		let element = React.createElement(tagName, newProps);

		return linkifyReactElement(element, opts, 0);
	}
});

export default Linkify;
