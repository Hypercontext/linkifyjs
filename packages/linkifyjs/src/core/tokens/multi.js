import { scheme, COLON } from './text';
import { defaults } from '../options';

/******************************************************************************
	Multi-Tokens
	Tokens composed of arrays of TextTokens
******************************************************************************/

function inherits(parent, child, props={}) {
	const extended = Object.create(parent.prototype);
	for (const p in props) {
		extended[p] = props[p];
	}
	extended.constructor = child;
	child.prototype = extended;
	return child;
}

/**
	Abstract class used for manufacturing tokens of text tokens. That is rather
	than the value for a token being a small string of text, it's value an array
	of text tokens.

	Used for grouping together URLs, emails, hashtags, and other potential
	creations.

	@class MultiToken
	@param {string} value
	@param {{t: string, v: string, s: number, e: number}[]} tokens
	@abstract
*/
export function MultiToken() {}

MultiToken.prototype = {
	/**
	 * String representing the type for this token
	 * @property t
	 * @default 'token'
	 */
	t: 'token',

	/**
	 * Is this multitoken a link?
	 * @property isLink
	 * @default false
	 */
	isLink: false,

	/**
	 * Return the string this token represents.
	 * @param {Options | string} [_opts] Formatting options
	 * @return {string}
	 */
	toString() {
		return this.v;
	},

	/**
	 * What should the value for this token be in the `href` HTML attribute?
	 * Returns the `.toString` value by default.
	 * @param {Options | string} [_opts] Formatting options
	 * @return {string}
	*/
	toHref() {
		return this.toString();
	},

	/**
	 * @param {Options} opts Formatting options
	 * @returns {string}
	 */
	toFormattedString(opts) {
		const val = this.toString();
		const truncate = opts.get('truncate', val, this);
		const formatted = opts.get('format', val, this);
		return (truncate && formatted.length > truncate)
			? formatted.substring(0, truncate) + '…'
			: formatted;
	},

	/**
	 *
	 * @param {Options} [opts]
	 * @returns {string}
	 */
	toFormattedHref(opts) {
		return opts.get('formatHref', this.toHref(opts.get('defaultProtocol')), this);
	},

	/**
	 * The start index of this token in the original input string
	 * @returns {number}
	 */
	startIndex() {
		return this.tk[0].s;
	},

	/**
	 * The end index of this token in the original input string (up to this
	 * index but not including it)
	 * @returns {number}
	 */
	endIndex() {
		return this.tk[this.tk.length - 1].e;
	},

	/**
		Returns an object  of relevant values for this token, which includes keys
		* type - Kind of token ('url', 'email', etc.)
		* value - Original text
		* href - The value that should be added to the anchor tag's href
			attribute

		@method toObject
		@param {string} [protocol] `'http'` by default
	*/
	toObject(protocol = defaults.defaultProtocol) {
		return {
			type: this.t,
			value: this.toString(),
			isLink: this.isLink,
			href: this.toHref(protocol),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},

	/**
	 *
	 * @param {Options} opts Formatting option
	 */
	toFormattedObject(opts) {
		return {
			type: this.t,
			value: this.toFormattedString(opts),
			isLink: this.isLink,
			href: this.toFormattedHref(opts),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},

	/**
	 * Whether this token should be rendered as a link according to the given options
	 * @param {Options} opts
	 * @returns {boolean}
	 */
	validate(opts) {
		return opts.get('validate', this.toString(), this);
	},

	/**
	 * Return an object that represents how this link should be rendered.
	 * @param {Options} opts Formattinng options
	 */
	render(opts) {
		const token = this;
		const tagName = opts.get('tagName', href, token);
		const href = this.toFormattedHref(opts);
		const innerHTML = this.toFormattedString(opts);

		const attributes = {};
		const className = opts.get('className', href, token);
		const target = opts.get('target', href, token);
		const rel = opts.get('rel', href, token);
		const attrs = opts.getObj('attributes', href, token);
		const eventListeners = opts.getObj('events', href, token);

		attributes.href = href;
		if (className) { attributes.class = className; }
		if (target) { attributes.target = target; }
		if (rel) { attributes.rel = rel; }
		if (attrs) { Object.assign(attributes, attrs); }

		return { tagName, attributes, innerHTML, eventListeners };
	}
};

// Base token
export { MultiToken as Base };

/**
 * Create a new token that can be emitted by the parser state machine
 * @param {string} type readable type of the token
 * @param {object} props properties to assign or override, including isLink = true or false
 * @returns {(value: string, tokens: {t: string, v: string, s: number, e: number}) => MultiToken} new token class
 */
export function createTokenClass(type, props) {
	function Token(value, tokens) {
		this.t = type;
		this.v = value;
		this.tk = tokens;
	}
	inherits(MultiToken, Token, props);
	return Token;
}

/**
	Represents a list of tokens making up a valid email address
	@class Email
	@extends MultiToken
*/
export const Email = createTokenClass('email', {
	isLink: true,
	toHref() {
		return 'mailto:' + this.toString();
	}
});

/**
	Represents some plain text
	@class Text
	@extends MultiToken
*/
export const Text = createTokenClass('text');

/**
	Multi-linebreak token - represents a line break
	@class Nl
	@extends MultiToken
*/
export const Nl = createTokenClass('nl');

/**
	Represents a list of text tokens making up a valid URL
	@class Url
	@extends MultiToken
*/
export const Url = createTokenClass('url', {
	isLink: true,

	/**
		Lowercases relevant parts of the domain and adds the protocol if
		required. Note that this will not escape unsafe HTML characters in the
		URL.

		@param {string} [scheme] default scheme (e.g., 'https')
		@return {string} the full href
	*/
	toHref(scheme = defaults.defaultProtocol) {
		// Check if already has a prefix scheme
		return this.hasProtocol() ? this.v : `${scheme}://${this.v}`;
	},

	/**
	 * Check whether this URL token has a protocol
	 * @return {boolean}
	 */
	hasProtocol() {
		const tokens = this.tk;
		return tokens.length >= 2 && scheme.indexOf(tokens[0].t) >= 0 && tokens[1].t === COLON;
	}
});
