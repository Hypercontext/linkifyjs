import {createTokenClass} from './create-token-class';
import {inherits} from '../../utils/class';

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
	@class NL
	@extends TextToken
*/
const NL = inheritsToken('\n');

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

export {
	TextToken as Base,
	DOMAIN,
	AT,
	COLON,
	DOT,
	PUNCTUATION,
	LOCALHOST,
	NL,
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
