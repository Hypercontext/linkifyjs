import { PROTOCOL, SLASH } from './text';
import { defaults } from '../../utils/options';

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
	@param {string} type
	@param {Array<{t: string, v: string}>} value
	@abstract
*/
export function MultiToken(type, value) {
	this.t = type;
	this.v = value;
	this.isLink = false;
}
MultiToken.prototype = {
	/**
		String representing the type for this token
		@property t
		@default 'token'
	*/
	t: 'token',

	/**
		Is this multitoken a link?
		@property isLink
		@default false
	*/
	isLink: false,

	/**
		Return the string this token represents.
		@method toString
		@return {string}
	*/
	toString() {
		let result = [];
		for (let i = 0; i < this.v.length; i++) {
			result.push(this.v[i].v);
		}
		return result.join('');
	},

	/**
		What should the value for this token be in the `href` HTML attribute?
		Returns the `.toString` value by default.

		@method toHref
		@return {string}
	*/
	toHref() {
		return this.toString();
	},

	/**
		Returns a hash of relevant values for this token, which includes keys
		* type - Kind of token ('url', 'email', etc.)
		* value - Original text
		* href - The value that should be added to the anchor tag's href
			attribute

		@method toObject
		@param {string} [protocol] `'http'` by default
		@return {{type: string, value: string, href: string}}
	*/
	toObject(protocol = defaults.defaultProtocol) {
		return {
			type: this.t,
			value: this.toString(),
			href: this.toHref(protocol)
		};
	}
};

// Base token
export { MultiToken as Base };

/**
 * Create a new token that can be emitted by the parser state machine
 * @param {string} type readable type of the token
 * @param {object} props properties to assign or override, including isLink = true or false
 * @returns {(value: string) => MultiToken} new token class
 */
export function createTokenClass(type, props) {
	function Token(value) {
		this.t = type;
		this.v = value;
	}
	inherits(MultiToken, Token, props);
	return Token;
}

/**
	Represents an arbitrarily mailto email address with the prefix included
	@class MailtoEmail
	@extends MultiToken
*/
export const MailtoEmail = createTokenClass('email', { isLink: true });

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

		@method href
		@param {string} protocol
		@return {string}
	*/
	toHref(protocol = defaults.defaultProtocol) {
		const tokens = this.v;
		let hasProtocol = false;
		let hasSlashSlash = false;
		let result = [];
		let i = 0;

		// Make the first part of the domain lowercase
		// Lowercase protocol
		while (tokens[i].t === PROTOCOL) {
			hasProtocol = true;
			result.push(tokens[i].v);
			i++;
		}

		// Skip slash-slash
		while (tokens[i].t === SLASH) {
			hasSlashSlash = true;
			result.push(tokens[i].v);
			i++;
		}

		// Continue pushing characters
		for (; i < tokens.length; i++) {
			result.push(tokens[i].v);
		}

		result = result.join('');

		if (!(hasProtocol || hasSlashSlash)) {
			result = `${protocol}://${result}`;
		}

		return result;
	},

	hasProtocol() {
		return this.v[0].t === PROTOCOL;
	}
});
