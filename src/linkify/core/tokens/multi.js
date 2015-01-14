/**
	@module linkify
	@submodule tokens
*/
import TEXT_TOKENS from './text';

const
TT_PROTOCOL	= TEXT_TOKENS.PROTOCOL,
TT_DOMAIN	= TEXT_TOKENS.DOMAIN,
TT_TLD		= TEXT_TOKENS.TLD,
TT_SLASH	= TEXT_TOKENS.SLASH;

// Is the given token a valid domain token?
// Should nums be included here?
function isDomainToken(token) {
	return TT_DOMAIN.test(token) ||
	TT_TLD.test(token);
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
class MultiToken {
	/**
		@method constructor
		@param {Array} value The array of `TextToken`s representing this
		particular MultiToken
	*/
	constructor(value) {
		this.v = value;

		/**
			String representing the type for this token
			@property type
			@default 'TOKEN'
		*/
		this.type = 'token';

		/**
			Is this multitoken a link?
			@property isLink
			@default false
		*/
		this.isLink = false;
	}

	/**
		Return the string this token represents.
		@method toString
		@return {String}
	*/
	toString() {
		let result = [];
		for (let i = 0; i < this.v.length; i++) {
			result.push(this.v[i].toString());
		}
		return result.join('');
	}

	/**
		What should the value for this token be in the `href` HTML attribute?
		Returns the `.toString` value by default.

		@method toHref
		@return {String}
	*/
	toHref() {
		return this.toString();
	}

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
			type: this.type,
			value: this.toString(),
			href: this.toHref(protocol)
		};
	}

	/**
		Is the given value an instance of this Token?
		@method test
		@static
		@param {Mixed} value
	*/
	static test(token) {
		return token instanceof this;
	}

}

/**
	Represents a list of tokens making up a valid email address
	@class EMAIL
	@extends MultiToken
*/
class EMAIL extends MultiToken {

	constructor(value) {
		super(value);
		this.type = 'email';
		this.isLink = true;
	}

	toHref() {
		return 'mailto:' + this.toString();
	}
}

/**
	Represents some plain text
	@class TEXT
	@extends MultiToken
*/
class TEXT extends MultiToken {
	constructor(value) {
		super(value);
		this.type = 'text';
	}
}

/**
	Represents a line break
	@class NL
	@extends MultiToken
*/
class NL extends MultiToken {
	constructor(value) {
		super(value);
		this.type = 'nl';
	}
}

/**
	Represents a list of tokens making up a valid URL
	@class URL
	@extends MultiToken
*/
class URL extends MultiToken {

	constructor(value) {
		super(value);
		this.type = 'url';
		this.isLink = true;
	}

	/**
		Lowercases relevant parts of the domain and adds the protocol if
		required. Note that this will not escape unsafe HTML characters in the
		URL.

		@method href
		@param {String} protocol
		@return {String}
	*/
	toHref(protocol = 'http') {
		let
		hasProtocol = false,
		hasSlashSlash = false,
		tokens = this.v,
		result = [],
		i = 0;

		// Make the first part of the domain lowercase
		// Lowercase protocol
		while (TT_PROTOCOL.test(tokens[i])) {
			hasProtocol = true;
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Skip slash-slash
		while (TT_SLASH.test(tokens[i])) {
			hasSlashSlash = true;
			result.push(tokens[i].toString());
			i++;
		}

		// Lowercase all other characters in the domain
		while (isDomainToken(tokens[i])) {
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Leave all other characters as they were written
		for (; i < tokens.length; i++) {
			result.push(tokens[i].toString());
		}

		result = result.join('');

		if (!(hasProtocol || hasSlashSlash)) {
			result = protocol + '://' + result;
		}

		return result;
	}

	hasProtocol() {
		return this.v[0] instanceof TT_PROTOCOL;
	}
}

export default {
	Base: MultiToken,
	EMAIL: EMAIL,
	NL: NL,
	TEXT: TEXT,
	URL: URL
};
