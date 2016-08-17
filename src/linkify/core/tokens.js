import {inherits} from '../utils/class';

function createTokenClass() {
	return function (value) {
		if (value) {
			this.v = value;
		}
	};
}

/******************************************************************************
	Text Tokens
	Tokens composed of strings
******************************************************************************/

/**
	Abstract class used for manufacturing text tokens.
	Pass in the value this token represents

	@class TextToken
	@abstract
*/

const TextToken = createTokenClass();

TextToken.prototype = {
	toString() {
		return this.v + '';
	}
};


function inheritsToken(value) {
	var props = value ? {v: value} : {};
	return inherits(TextToken, createTokenClass(), props);
}

/**
	A valid domain token
	@class DOMAIN
	@extends TextToken
*/
const DOMAIN = inheritsToken();

/**
	@class AT
	@extends TextToken
*/
const AT = inheritsToken('@');

/**
	Represents a single colon `:` character

	@class COLON
	@extends TextToken
*/
const COLON = inheritsToken(':');

/**
	@class DOT
	@extends TextToken
*/
const DOT = inheritsToken('.');

/**
	A character class that can surround the URL, but which the URL cannot begin
	or end with. Does not include certain English punctuation like parentheses.

	@class PUNCTUATION
	@extends TextToken
*/
const PUNCTUATION = inheritsToken();

/**
	The word localhost (by itself)
	@class LOCALHOST
	@extends TextToken
*/
const LOCALHOST = inheritsToken();

/**
	Newline token
	@class TNL
	@extends TextToken
*/
const TNL = inheritsToken('\n');

/**
	@class NUM
	@extends TextToken
*/
const NUM = inheritsToken();

/**
	@class PLUS
	@extends TextToken
*/
const PLUS = inheritsToken('+');

/**
	@class POUND
	@extends TextToken
*/
const POUND = inheritsToken('#');

/**
	Represents a web URL protocol. Supported types include

	* `http:`
	* `https:`
	* `ftp:`
	* `ftps:`
	* There's Another super weird one

	@class PROTOCOL
	@extends TextToken
*/
const PROTOCOL = inheritsToken();

/**
	@class QUERY
	@extends TextToken
*/
const QUERY = inheritsToken('?');

/**
	@class SLASH
	@extends TextToken
*/
const SLASH = inheritsToken('/');

/**
	@class UNDERSCORE
	@extends TextToken
*/
const UNDERSCORE = inheritsToken('_');

/**
	One ore more non-whitespace symbol.
	@class SYM
	@extends TextToken
*/
const SYM = inheritsToken();

/**
	@class TLD
	@extends TextToken
*/
const TLD = inheritsToken();

/**
	Represents a string of consecutive whitespace characters

	@class WS
	@extends TextToken
*/
const WS = inheritsToken();

/**
	Opening/closing bracket classes
*/

const OPENBRACE = inheritsToken('{');
const OPENBRACKET = inheritsToken('[');
const OPENPAREN = inheritsToken('(');
const CLOSEBRACE = inheritsToken('}');
const CLOSEBRACKET = inheritsToken(']');
const CLOSEPAREN = inheritsToken(')');

let text = {
	Base: TextToken,
	DOMAIN,
	AT,
	COLON,
	DOT,
	PUNCTUATION,
	LOCALHOST,
	NL: TNL,
	NUM,
	PLUS,
	POUND,
	QUERY,
	PROTOCOL,
	SLASH,
	UNDERSCORE,
	SYM,
	TLD,
	WS,
	OPENBRACE,
	OPENBRACKET,
	OPENPAREN,
	CLOSEBRACE,
	CLOSEBRACKET,
	CLOSEPAREN
};

/******************************************************************************
	Multi-Tokens
	Tokens composed of arrays of TextTokens
******************************************************************************/


// Is the given token a valid domain token?
// Should nums be included here?
function isDomainToken(token) {
	return token instanceof DOMAIN || token instanceof TLD;
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
const MultiToken = createTokenClass();

MultiToken.prototype = {
	/**
		String representing the type for this token
		@property type
		@default 'TOKEN'
	*/
	type: 'token',

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
			result.push(this.v[i].toString());
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
			type: this.type,
			value: this.toString(),
			href: this.toHref(protocol)
		};
	}
};

/**
	Represents a list of tokens making up a valid email address
	@class EMAIL
	@extends MultiToken
*/
const EMAIL = inherits(MultiToken, createTokenClass(), {
	type: 'email',
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
const TEXT = inherits(MultiToken, createTokenClass(), {type: 'text'});

/**
	Multi-linebreak token - represents a line break
	@class MNL
	@extends MultiToken
*/
const MNL = inherits(MultiToken, createTokenClass(), {type: 'nl'});

/**
	Represents a list of tokens making up a valid URL
	@class URL
	@extends MultiToken
*/
const URL = inherits(MultiToken, createTokenClass(), {
	type: 'url',
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
		while (tokens[i] instanceof PROTOCOL) {
			hasProtocol = true;
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Skip slash-slash
		while (tokens[i] instanceof SLASH) {
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
			result = `${protocol}://${result}`;
		}

		return result;
	},

	hasProtocol() {
		return this.v[0] instanceof PROTOCOL;
	}
});

let multi = {
	Base: MultiToken,
	EMAIL,
	NL: MNL,
	TEXT,
	URL
};

export {text, multi};
