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
class TextToken {
	/**
		@method constructor
		@param {String} value The string of characters representing this particular Token
	*/
	constructor(value) {
		this.v = value;
	}

	/**
		String representing the type for this token
		@property type
		@default 'TOKEN'
	*/

	toString() {
		return this.v + '';
	}
}

/**
	A valid domain token
	@class DOMAIN
	@extends TextToken
*/
class DOMAIN extends TextToken {}

/**
	@class AT
	@extends TextToken
*/
class AT extends TextToken {
	constructor() { super('@'); }
}

/**
	Represents a single colon `:` character

	@class COLON
	@extends TextToken
*/
class COLON extends TextToken {
	constructor() { super(':'); }
}

/**
	@class DOT
	@extends TextToken
*/
class DOT extends TextToken {
	constructor() { super('.'); }
}

/**
	The word localhost (by itself)
	@class LOCALHOST
	@extends TextToken
*/
class LOCALHOST extends TextToken {}

/**
	Newline token
	@class TNL
	@extends TextToken
*/
class TNL extends TextToken {
	constructor() { super('\n'); }
}

/**
	@class NUM
	@extends TextToken
*/
class NUM extends TextToken {}

/**
	@class PLUS
	@extends TextToken
*/
class PLUS extends TextToken {
	constructor() { super('+'); }
}

/**
	@class POUND
	@extends TextToken
*/
class POUND extends TextToken {
	constructor() { super('#'); }
}

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
class PROTOCOL extends TextToken {}

/**
	@class QUERY
	@extends TextToken
*/
class QUERY extends TextToken {
	constructor() { super('?'); }
}

/**
	@class SLASH
	@extends TextToken
*/
class SLASH extends TextToken {
	constructor() { super('/'); }
}

/**
	One ore more non-whitespace symbol.
	@class SYM
	@extends TextToken
*/
class SYM extends TextToken {}

/**
	@class TLD
	@extends TextToken
*/
class TLD extends TextToken {}

/**
	Represents a string of consecutive whitespace characters

	@class WS
	@extends TextToken
*/
class WS extends TextToken {}

let text = {
	Base: TextToken,
	DOMAIN,
	AT,
	COLON,
	DOT,
	LOCALHOST,
	NL: TNL,
	NUM,
	PLUS,
	POUND,
	QUERY,
	PROTOCOL,
	SLASH,
	SYM,
	TLD,
	WS
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
	Multi-linebreak token - represents a line break
	@class MNL
	@extends MultiToken
*/
class MNL extends MultiToken {
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
			result = protocol + '://' + result;
		}

		return result;
	}

	hasProtocol() {
		return this.v[0] instanceof PROTOCOL;
	}
}

let multi = {
	Base: MultiToken,
	EMAIL,
	NL: MNL,
	TEXT,
	URL
};

export {text, multi};
