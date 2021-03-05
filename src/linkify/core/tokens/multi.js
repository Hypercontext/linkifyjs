import { DOMAIN, PROTOCOL, TLD, SLASH } from './text';

/******************************************************************************
	Multi-Tokens
	Tokens composed of arrays of TextTokens
******************************************************************************/

function createTokenClass() {
	return function (value) {
		if (value) {
			this.v = value;
		}
	};
}

function inherits(parent, child, props={}) {
	let extended = Object.create(parent.prototype);
	for (var p in props) {
		extended[p] = props[p];
	}
	extended.constructor = child;
	child.prototype = extended;
	return child;
}


// Is the given token a valid domain token?
// Should nums be included here?
function isDomain(token) {
	return token.t === DOMAIN || token.t === TLD;
}

/**
	Abstract class used for manufacturing tokens of text tokens. That is rather
	than the value for a token being a small string of text, it's value an array
	of text tokens.

	Used for grouping together URLs, emails, hashtags, and other potential
	creations.

	@class MultiToken
	@abstract
*/
export const MultiToken = createTokenClass();

MultiToken.prototype = {
	/**
		String representing the type for this token
		@property t
		@default 'TOKEN'
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
		@return {String}
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
		@return {String}
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
		@param {String} [protocol] `'http'` by default
		@return {Object}
	*/
	toObject(protocol = 'http') {
		return {
			type: this.t,
			value: this.toString(),
			href: this.toHref(protocol)
		};
	}
};

/**
	Represents an arbitrarily mailto email address with the prefix included
	@class MAILTO
	@extends MultiToken
*/
export const MAILTOEMAIL = inherits(MultiToken, createTokenClass(), {
	t: 'email',
	isLink: true
});

/**
	Represents a list of tokens making up a valid email address
	@class EMAIL
	@extends MultiToken
*/
export const EMAIL = inherits(MultiToken, createTokenClass(), {
	t: 'email',
	isLink: true,
	toHref() {
		return 'mailto:' + this.toString();
	}
});

/**
	Represents some plain text
	@class TEXT
	@extends MultiToken
*/
export const TEXT = inherits(MultiToken, createTokenClass(), {t: 'text'});

/**
	Multi-linebreak token - represents a line break
	@class NL
	@extends MultiToken
*/
export const NL = inherits(MultiToken, createTokenClass(), {t: 'nl'});

/**
	Represents a list of tokens making up a valid URL
	@class URL
	@extends MultiToken
*/
export const URL = inherits(MultiToken, createTokenClass(), {
	t: 'url',
	isLink: true,

	/**
		Lowercases relevant parts of the domain and adds the protocol if
		required. Note that this will not escape unsafe HTML characters in the
		URL.

		@method href
		@param {String} protocol
		@return {String}
	*/
	toHref(protocol = 'http') {
		let hasProtocol = false;
		let hasSlashSlash = false;
		let tokens = this.v;
		let result = [];
		let i = 0;

		// Make the first part of the domain lowercase
		// Lowercase protocol
		while (tokens[i].t === PROTOCOL) {
			hasProtocol = true;
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Skip slash-slash
		while (tokens[i].t === SLASH) {
			hasSlashSlash = true;
			result.push(tokens[i].toString());
			i++;
		}

		// Lowercase all other characters in the domain
		while (isDomain(tokens[i])) {
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Leave all other characters as they were written
		for (; i < tokens.length; i++) {
			result.push(tokens[i].toString());
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

export { MultiToken as Base };
