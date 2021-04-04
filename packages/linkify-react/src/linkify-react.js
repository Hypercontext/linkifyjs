import * as React from 'react';
import { tokenize, options } from 'linkifyjs';

const { Options } = options;

// Given a string, converts to an array of valid React components
// (which may include strings)
function stringToElements(str, opts) {

	const tokens = tokenize(str);
	const elements = [];
	let linkId = 0;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.t === 'nl' && opts.nl2br) {
			elements.push(React.createElement('br', {key: `linkified-${++linkId}`}));
			continue;
		} else if (!token.isLink || !opts.check(token)) {
			// Regular text
			elements.push(token.toString());
			continue;
		}

		const {
			formatted,
			formattedHref,
			tagName,
			className,
			target,
			rel,
			attributes
		} = opts.resolve(token);

		const props = { key: `linkified-${++linkId}`, href: formattedHref };

		if (className) { props.className = className; }
		if (target) { props.target = target; }
		if (rel) { props.rel = rel; }

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

	const children = [];

	React.Children.forEach(element.props.children, (child) => {
		if (typeof child === 'string') {
			// ensure that we always generate unique element IDs for keys
			elementId = elementId + 1;
			children.push(...stringToElements(child, opts));
		} else if (React.isValidElement(child)) {
			if (typeof child.type === 'string'
				&& opts.ignoreTags.indexOf(child.type.toUpperCase()) >= 0
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
	const newProps = { key: `linkified-element-${elementId}` };
	for (const prop in element.props) {
		newProps[prop] = element.props[prop];
	}

	return React.cloneElement(element, newProps, children);
}

/**
 * @class Linkify
 */
export default class Linkify extends React.Component {
	render() {
		// Copy over all non-linkify-specific props
		const newProps = { key: 'linkified-element-0' };
		for (const prop in this.props) {
			if (prop !== 'options' && prop !== 'tagName') {
				newProps[prop] = this.props[prop];
			}
		}

		const opts = new Options(this.props.options);
		const tagName = this.props.tagName || 'span';
		const element = React.createElement(tagName, newProps);

		return linkifyReactElement(element, opts, 0);
	}
}

