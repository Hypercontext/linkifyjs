import React from "react";
import * as linkify from "./linkify";

const {options} = linkify;
const {Options} = options;

// Given a string, converts to an array of valid React components
// (which may include strings)
function stringToElements(str, opts) {

	let tokens = linkify.tokenize(str);
	let elements = [];
	var linkId = 0;

	for (var i = 0; i < tokens.length; i++) {
		let token = tokens[i];

		if (token.type === 'nl' && opts.nl2br) {
			elements.push(React.createElement('br', {key: `linkified-${++linkId}`}));
			continue;
		} else if (!token.isLink || !opts.check(token)) {
			// Regular text
			elements.push(token.toString());
			continue;
		}

		let {
			href,
			formatted,
			formattedHref,
			tagName,
			className,
			target,
			attributes,
			events
		} = opts.resolve(token);

		let props = {
			key: `linkified-${++linkId}`,
			href: formattedHref,
		};

		if (className) {
			props.className = className;
		}

		if (target) {
			props.target = target;
		}

		// Build up additional attributes
		// Support for events via attributes hash
		if (attributes) {
			for (var attr in attributes) {
				props[attr] = attributes[attr];
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
			// Unknown element type, just push
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

class Linkify extends React.Component {
	render() {
		// Copy over all non-linkify-specific props
		let newProps = {key: 'linkified-element-0'};
		for (var prop in this.props) {
			if (prop !== 'options' && prop !== 'tagName') {
				newProps[prop] = this.props[prop];
			}
		}

		let opts = new Options(this.props.options);
		let tagName = this.props.tagName || 'span';
		let element = React.createElement(tagName, newProps);

		return linkifyReactElement(element, opts, 0);

	}
}

export default Linkify;
