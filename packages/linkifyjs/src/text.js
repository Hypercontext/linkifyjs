/******************************************************************************
Text Tokens
Identifiers for token outputs from the regexp scanner
******************************************************************************/

// A valid web domain token
export const WORD = 'WORD';  // only contains a-z
export const UWORD = 'UWORD';  // contains letters other than a-z, used for IDN

// Special case of word
export const LOCALHOST = 'LOCALHOST';

// Valid top-level domain, special case of WORD (see tlds.js)
export const TLD = 'TLD';

// Valid IDN TLD, special case of UWORD (see tlds.js)
export const UTLD = 'UTLD';

// The scheme portion of a web URI protocol. Supported types include: `mailto`,
// `file`, and user-defined custom protocols. Limited to schemes that contain
// only letters
export const SCHEME = 'SCHEME';

// Similar to SCHEME, except makes distinction for schemes that must always be
// followed by `://`, not just `:`. Supported types include `http`, `https`,
// `ftp`, `ftps`
export const SLASH_SCHEME = 'SLASH_SCHEME';

// Similar to SCHEME, except contains -
export const COMPOUND_SCHEME = 'COMPOUND_SCHEME';

// Similar to SLASH_SCHEME, except contains -
export const COMPOUND_SLASH_SCHEME = 'COMPOUND_SLASH_SCHEME';

// Any sequence of digits 0-9
export const NUM = 'NUM';

// Any number of consecutive whitespace characters that are not newline
export const WS = 'WS';

// New line (unix style)
export const NL = 'NL'; // \n

// Opening/closing bracket classes
export const OPENBRACE = 'OPENBRACE'; // {
export const OPENBRACKET = 'OPENBRACKET'; // [
export const OPENANGLEBRACKET = 'OPENANGLEBRACKET'; // <
export const OPENPAREN = 'OPENPAREN'; // (
export const CLOSEBRACE = 'CLOSEBRACE'; // }
export const CLOSEBRACKET = 'CLOSEBRACKET'; // ]
export const CLOSEANGLEBRACKET = 'CLOSEANGLEBRACKET'; // >
export const CLOSEPAREN = 'CLOSEPAREN'; // )

// Various symbols
export const AMPERSAND = 'AMPERSAND'; // &
export const APOSTROPHE = 'APOSTROPHE'; // '
export const ASTERISK = 'ASTERISK'; // *
export const AT = 'AT'; // @
export const BACKSLASH = 'BACKSLASH'; // \
export const BACKTICK = 'BACKTICK'; // `
export const CARET = 'CARET'; // ^
export const COLON = 'COLON'; // :
export const COMMA = 'COMMA'; // ,
export const DOLLAR = 'DOLLAR'; // $
export const DOT = 'DOT'; // .
export const EQUALS = 'EQUALS'; // =
export const EXCLAMATION = 'EXCLAMATION'; // !
export const HYPHEN = 'HYPHEN'; // -
export const PERCENT = 'PERCENT'; // %
export const PIPE = 'PIPE'; // |
export const PLUS = 'PLUS'; // +
export const POUND = 'POUND'; // #
export const QUERY = 'QUERY'; // ?
export const QUOTE = 'QUOTE'; // "

export const SEMI = 'SEMI'; // ;
export const SLASH = 'SLASH'; // /
export const TILDE = 'TILDE'; // ~
export const UNDERSCORE = 'UNDERSCORE'; // _

// Emoji symbol
export const EMOJIS = 'EMOJIS';

// Default token - anything that is not one of the above
export const SYM = 'SYM';

// Token collections for grouping similar jumps in the parser
export const numeric = [NUM];
export const ascii = [WORD, LOCALHOST, TLD, SCHEME, SLASH_SCHEME];
export const asciinumeric = ascii.concat(NUM);
export const alpha = ascii.concat(UWORD, UTLD);
export const alphanumeric = alpha.concat(NUM);
export const domain = alphanumeric.concat(COMPOUND_SCHEME, COMPOUND_SLASH_SCHEME, EMOJIS);
export const scheme = [SCHEME, SLASH_SCHEME, COMPOUND_SCHEME, COMPOUND_SLASH_SCHEME];

/**
 * Collections of text tokens. More may be added
 */
export const collections = {
	numeric,
	ascii,
	asciinumeric,
	alpha,
	alphanumeric,
	domain
	// scheme // purposely excluded
};

/**
 * @typedef {keyof collections} BuiltinTokenCollection
 */

/**
 * @typedef {BuiltinTokenCollection | string} Collection
 */

/**
 * Register a text token that the parser can recognize
 * @template {string} K
 * @param {K} name Token name in all caps (by convention)
 * @param {Collection[]} [collections] Flag whether this token should be added
 * to any built-in or new collection. Built-in collections that inherit from
 * each other don't have to be specified. For example, if you include `numeric`,
 * you don't have to also include `alphanumeric`, `domain`, etc.
 * @returns {K}
 */
export function registerToken(name, collections = []) {
	const flags = collections.reduce((f, k) => f[k] = true && f, {});
	if (flags.numeric) {
		flags.asciinumeric = true;
		flags.alphanumeric = true;
	}
	if (flags.ascii) {
		flags.asciinumeric = true;
		flags.alpha = true;
	}
	if (flags.alpha) {
		flags.alphanumeric = true;
	}
	if (flags.alphanumeric) {
		flags.domain = true;
	}
	for (const k in flags) {
		registerCollection(k).push(name);
	}
	return name;
}

/**
 * Convert a String to an Array of characters, taking into account that some
 * characters like emojis take up two string indexes.
 *
 * Adapted from core-js (MIT license)
 * https://github.com/zloirock/core-js/blob/2d69cf5f99ab3ea3463c395df81e5a15b68f49d9/packages/core-js/internals/string-multibyte.js
 *
 * @function stringToArray
 * @param {string} str
 * @returns {string[]}
 */
 export function stringToArray(str) {
	const result = [];
	const len = str.length;
	let index = 0;
	while (index < len) {
		let first = str.charCodeAt(index);
		let second;
		let char = first < 0xd800 || first > 0xdbff || index + 1 === len
		|| (second = str.charCodeAt(index + 1)) < 0xdc00 || second > 0xdfff
			? str[index] // single character
			: str.slice(index, index + 2); // two-index characters
		result.push(char);
		index += char.length;
	}
	return result;
}

/**
 * @param {string} name Name of text token collections. Will be available in plugins as scanner.tokens.collections.<name>
 * @returns {Collection[]} the collection
 */
function registerCollection(name) {
	if (!(name in collections)) {
		collections[name] = [];
	}
	return collections[name];
}
