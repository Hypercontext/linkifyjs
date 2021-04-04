/**
	Convert strings of text into linkable HTML text
*/
import { options, tokenize } from 'linkifyjs';
const { Options } = options;

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
	if (!attributes) { return ''; }
	let result = [];

	for (let attr in attributes) {
		let val = attributes[attr] + '';
		result.push(`${attr}="${escapeAttr(val)}"`);
	}
	return result.join(' ');
}

/**
 * Convert a plan text string to an HTML string with links. Expects that the
 * given strings does not contain any HTML entities. Use the linkify-html
 * interface if you need to parse HTML entities.
 *
 * @param {string} str string to linkify
 * @param {object} [opts] overridable options
 * @returns {string}
 */
function linkifyStr(str, opts = {}) {
	opts = new Options(opts);

	let tokens = tokenize(str);
	let result = [];

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];

		if (token.t === 'nl' && opts.nl2br) {
			result.push('<br>\n');
			continue;
		} else if (!token.isLink || !opts.check(token)) {
			result.push(escapeText(token.toString()));
			continue;
		}

		const {
			formatted,
			formattedHref,
			tagName,
			className,
			target,
			rel,
			attributes,
		} = opts.resolve(token);

		const link = [`<${tagName} href="${escapeAttr(formattedHref)}"`];

		if (className) { link.push(` class="${escapeAttr(className)}"`); }
		if (target) { link.push(` target="${escapeAttr(target)}"`); }
		if (rel) { link.push(` rel="${escapeAttr(rel)}"`); }
		if (attributes) { link.push(` ${attributesToString(attributes)}`); }

		link.push(`>${escapeText(formatted)}</${tagName}>`);
		result.push(link.join(''));
	}

	return result.join('');
}

if (!String.prototype.linkify) {
	Object.defineProperty(String.prototype, 'linkify', {
		writable: false,
		value: function linkify(options) {
			return linkifyStr(this, options);
		}
	});
}

export default linkifyStr;
