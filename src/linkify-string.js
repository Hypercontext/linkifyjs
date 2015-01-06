/**
	Convert strings of text into linkable HTML text
*/

let linkify = require('./linkify');

function typeToTarget(type) {
	return type === 'url' ? '_blank' : null;
}

function attributesToString(attributes) {

	if (!attributes) return '';
	let result = [];

	for (let attr in attributes) {
		let val = (attributes[attr] + '').replace(/"/g, '&quot;');
		result.push(`${attr}="${val}}"`);
	}
	return result.join(' ');
}

/**
	Options:

	format: null
	linkAttributes: null,
	linkClass: null,
	newLine: '\n', // deprecated
	nl2br: false,
	tagName: 'a',
	target: '_blank',
*/
module.exports = function (str, options) {
	options = options || {};

	let
	tagName = options.tagName || 'a',
	target = options.target || typeToTarget,
	newLine = options.newLine || false, // deprecated
	nl2br =  !!newLine || options.nl2br || false,
	format = options.format || null,
	linkAttributes = options.linkAttributes || null,
	attributesStr = linkAttributes ? attributesToString(linkAttributes) : null,
	linkClass = 'linkified',
	result = [];

	if (options.linkClass) {
		linkClass += ' ' + options.linkClass;
	}

	let tokens = linkify.tokenize(str);

	for (let token of tokens) {
		if (token.isLink) {
			let link = `<${tagName} href="${token.toHref()}" class="${linkClass}"`;
			if (target) {
				link += ` target=${target}`;
			}
			if (attributesStr) {
				link += ` ${attributesStr}`;
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

};
