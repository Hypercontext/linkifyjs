/******************************************************************************
	Text Tokens
	Tokens composed of strings
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

// TODO: Move this to keyword plugin
// Arbirary words that can keyword links
// export const KEYWORD = 'KEYWORD'; // simple [0-9a-z]
// export const UKEYWORD = 'UKEYWORD'; // containing [0-9\{Letter}]
// export const COMPOUND_KEYWORD = 'COMPOUND_KEYWORD'; // similar to KEYWORD but can have hyphens
// export const COMPOUND_UKEYWORD = 'COMPOUND_UKEYWORD'; // similar to UKEYWORD but can have hyphens

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
export const words = ascii.concat(UWORD, UTLD);
export const alphanumeric = words.concat(NUM);
export const domain = words.concat(COMPOUND_SCHEME, COMPOUND_SLASH_SCHEME, NUM, EMOJIS);
export const scheme = [SCHEME, SLASH_SCHEME, COMPOUND_SCHEME, COMPOUND_SLASH_SCHEME];

// Define each property separately to let typescript know that this object is
// open for adding more collections.
export const collections = {};
collections.ascii = ascii;
collections.asciinumeric = asciinumeric;
collections.words = words;
collections.alphanumeric = alphanumeric;
collections.domain = domain;
collections.scheme = scheme;

/**
 * @param {string} name Name of text token collections. Will be available in plugins as scanner.tokens.collections.<name>
 * @returns {string[]} the collection
 */
export function registerTextTokenCollection(name) {
	if (!(name in collections)) {
		collections[name] = [];
	}
	return collections[name];
}

export function collectionsWithToken(name) {
	let collectionNames = [];
	for (let col in collections) {
		if (collections[col].indexOf(name) >= 0) {
			collectionNames.push(col);
		}
	}
	return collectionNames;
}

/**
 * Register a text token that the parser can recognize
 * @param {string} name Token name in all caps (by convention)
 * @param {string[]} collectionNames List of collections into which to add this token. Any previously-unknown collection will be created.
 * @returns {string}
 */
export function registerTextToken(name, collectionNames = []) {
	for (let i = 0; i < collectionNames.length; i++) {
		const collection = registerTextTokenCollection(collectionNames[i]);
		collection.push(name);
	}
	return name;
}

/**
 * @typedef {{t: string, v: string, s: number, e: number}} Token
 */
