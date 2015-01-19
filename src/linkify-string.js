/**
	Convert strings of text into linkable HTML text
*/

import {tokenize} from './linkify';

function typeToTarget(type) {
	return type === 'url' ? '_blank' : null;
}

function cleanText(text) {
	return text
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');
}

function cleanAttr(href) {
	return href.replace(/"/g, '&quot;');
}

function attributesToString(attributes) {

	if (!attributes) return '';
	let result = [];

	for (let attr in attributes) {
		let val = (attributes[attr] + '').replace(/"/g, '&quot;');
		result.push(`${attr}="${cleanAttr(val)}"`);
	}
	return result.join(' ');
}

function resolveOption(value, ...params) {
	return typeof value === 'function' ? value(...params) : value;
}

function noop(val) {
	return val;
}

function linkifyStr(str, opts={}) {

	let
	attributes		= opts.linkAttributes		|| null,
	defaultProtocol	= opts.defaultProtocol		|| 'http',
	format			= opts.format				|| noop,
	formatHref		= opts.formatHref			|| noop,
	newLine			= opts.newLine				|| false, // deprecated
	nl2br			= !!newLine	|| opts.nl2br 	|| false,
	tagName			= opts.tagName				|| 'a',
	target			= opts.target				|| typeToTarget,
	linkClass		= opts.linkClass			|| 'linkified';

	let result = [];
	let tokens = tokenize(str);

	for (let i = 0; i < tokens.length; i++ ) {
		let token = tokens[i];
		if (token.isLink) {

			let
			tagNameStr		= resolveOption(tagName, token.type),
			classStr		= resolveOption(linkClass, token.type),
			targetStr		= resolveOption(target, token.type),
			formatted		= resolveOption(format, token.toString(), token.type),
			href			= token.toHref(defaultProtocol),
			formattedHref	= resolveOption(formatHref, href, token.type),
			attributesHash	= resolveOption(attributes, token.type);

			let link = `<${tagNameStr} href="${cleanAttr(formattedHref)}" class="${classStr}"`;
			if (targetStr) {
				link += ` target="${targetStr}"`;
			}

			if (attributesHash) {
				link += ` ${attributesToString(attributesHash)}`;
			}

			link += `>${cleanText(formatted)}</${tagNameStr}>`;
			result.push(link);

		} else if (token.type === 'nl' && nl2br) {
			if (newLine) {
				result.push(newLine);
			} else {
				result.push('<br>\n');
			}
		} else {
			result.push(cleanText(token.toString()));
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
