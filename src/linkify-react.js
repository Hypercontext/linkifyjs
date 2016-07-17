import React from 'react';
import * as linkify from './linkify';

let options = linkify.options;

var Linkify = React.createClass({
	render() {
		let str = this.props.data;
		let opts = options.normalize(this.props);

		let tokens = linkify.tokenize(str);
		let elements = [];

		for (let i = 0; i < tokens.length; i++) {
			let token = tokens[i];

			if (token.type === 'nl' && opts.nl2br) {
				elements.push(React.createElement('br'));
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

		// Span is hardcoded for now
		return React.createElement('span', {}, ...elements);
	}
});

export default Linkify;
