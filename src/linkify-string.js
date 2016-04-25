/**
	Convert strings of text into linkable HTML text
*/

import * as linkify from './linkify';

var tokenize = linkify.tokenize;
var options = linkify.options;

function escapeText(text) {
	return text
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');
}

function escapeAttr(href) {
	return href.replace(/"/g, '&quot;');
}

function attributesToString(attributes) {

	if (!attributes) return '';
	let result = [];

	for (let attr in attributes) {
		let val = (attributes[attr] + '').replace(/"/g, '&quot;');
		result.push(`${attr}="${escapeAttr(val)}"`);
	}
	return result.join(' ');
}

function linkifyStr(str, opts={}) {

	opts = options.normalize(opts);

	let
	tokens = tokenize(str),
	result = [];

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];
		let validated = token.isLink && options.resolve(opts.validate, token.toString(), token.type);

		if (token.isLink && validated) {

			let
			href			= token.toHref(opts.defaultProtocol),
			formatted		= options.resolve(opts.format, token.toString(), token.type),

			formattedHref	= options.resolve(opts.formatHref, href, token.type),
			attributesHash	= options.resolve(opts.attributes, href, token.type),
			tagName			= options.resolve(opts.tagName, href, token.type),
			linkClass		= options.resolve(opts.linkClass, href, token.type),
			target			= options.resolve(opts.target, href, token.type);

			let link = `<${tagName} href="${escapeAttr(formattedHref)}" class="${escapeAttr(linkClass)}"`;
			if (target) {
				link += ` target="${escapeAttr(target)}"`;
			}

			if (attributesHash) {
				link += ` ${attributesToString(attributesHash)}`;
			}

			link += `>${escapeText(formatted)}</${tagName}>`;
			result.push(link);
		} else if (token.type === 'nl' && opts.nl2br) {
			if (opts.newLine) {
				result.push(opts.newLine);
			} else {
				result.push('<br>\n');
			}
		} else {
			result.push(escapeText(token.toString()));
		}
	}

	return result.join('');
}

if (!String.prototype.linkify) {
	String.prototype.linkify = function (options) {
		return linkifyStr(this, options);
	};
}

export default linkifyStr;
