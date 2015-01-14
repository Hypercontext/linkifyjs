/**
	@module linkify
	@submodule tokens
	@main tokens
*/
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

	/**
		Is the given value an instance of this Token?
		@method test
		@static
		@param {Mixed} value
	*/
	static test(value) {
		return value instanceof this;
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
	@class NL
	@extends TextToken
*/
class NL extends TextToken {
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

module.exports = {
	Base: TextToken,
	DOMAIN: DOMAIN,
	AT: AT,
	COLON: COLON,
	DOT: DOT,
	LOCALHOST: LOCALHOST,
	NL: NL,
	NUM: NUM,
	PLUS: PLUS,
	POUND: POUND,
	QUERY: QUERY,
	PROTOCOL: PROTOCOL,
	SLASH: SLASH,
	SYM: SYM,
	TLD: TLD,
	WS: WS
};
