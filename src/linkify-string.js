/**
	Convert strings of text into linkable HTML text
	TODO: Support for computed attributes based on the type?
*/

import linkify from './linkify';

function typeToTarget(type) {
	return type === 'url' ? '_blank' : null;
}

function attributesToString(attributes) {

	if (!attributes) return '';
	let result = [];

	for (let attr in attributes) {
		let val = (attributes[attr] + '').replace(/"/g, '&quot;');
		result.push(`${attr}="${val}"`);
	}
	return result.join(' ');
}

/**
	Options:

	defaultProtocol: 'http'
	format: null
	linkAttributes: null,
	linkClass: null,
	newLine: '\n', // deprecated
	nl2br: false,
	tagName: 'a',
	target: '_blank',
*/
export default function (str, options) {
	options = options || {};

	let
	defaultProtocol = options.defaultProtocol || 'http',
	tagName = options.tagName || 'a',
	target = options.target || typeToTarget,
	newLine = options.newLine || false, // deprecated
	nl2br =  !!newLine || options.nl2br || false,
	format = options.format || null,
	attributes = options.linkAttributes || null,
	linkClass = 'linkified',
	result = [];

	if (options.linkClass) {
		linkClass += ' ' + options.linkClass;
	}

	let tokens = linkify.tokenize(str);

	for (let i = 0; i < tokens.length; i++ ) {
		let token = tokens[i];
		if (token.isLink) {

			let
			link = `<${tagName} href="${token.toHref(defaultProtocol)}" class="${linkClass}"`,
			targetStr = typeof target === 'function' ?
				target(token.type) : target,
			attributesHash = typeof attributes === 'function' ?
				attributes(token.type) : attributes;

			if (targetStr) {
				link += ` target="${targetStr}"`;
			}

			if (attributesHash) {
				link += ` ${attributesToString(attributesHash)}`;
			}

			link += '>';
			link += typeof format === 'function' ?
				format(token.toString(), token.type) : token.toString();
			link += `</${tagName}>`;

			result.push(link);

		} else if (token.type === 'nl' && nl2br) {
			if (newLine) {
				result.push(newLine);
			} else {
				result.push('<br>\n');
			}
		} else {
			result.push(token.toString());
		}
	}

	return result.join('');
}
