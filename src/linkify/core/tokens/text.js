/******************************************************************************
	Text Tokens
	Tokens composed of strings
******************************************************************************/

// A valid web domain token
export const DOMAIN = 'DOMAIN';
export const LOCALHOST = 'LOCALHOST'; // special case of domain

// Valid top-level domain (see tlds.js)
export const TLD = 'TLD';

// Various punctionation
export const AT = 'AT'; // '@'
export const COLON = 'COLON'; // ':'
export const DOT = 'DOT'; // '.'

// A character class that can surround the URL, but which the URL cannot begin
// or end with. Does not include certain English punctuation like parentheses.
export const PUNCTUATION = 'PUNCTUATION';

// New line (unix style)
export const NL = 'NL'; // '\n'

// Any sequence of digits 0-9
export const NUM = 'NUM';

// Various symbols
export const PLUS = 'PLUS'; // '+'
export const POUND = 'POUND'; // '#'
export const QUERY = 'QUERY'; // '?'
export const SLASH = 'SLASH'; // '/'
export const UNDERSCORE = 'UNDERSCORE'; // '_'

// A web URL protocol. Supported types include
// - `http:`
// - `https:`
// - `ftp:`
// - `ftps:`
export const PROTOCOL = 'PROTOCOL';

// Start of the email URI protocol
export const MAILTO = 'MAILTO'; // 'mailto:'

// Any number of consecutive whitespace characters that are not newline
export const WS = 'WS';

// Opening/closing bracket classes
export const OPENBRACE = 'OPENBRACE'; // '{'
export const OPENBRACKET = 'OPENBRACKET'; // '['
export const OPENANGLEBRACKET = 'OPENANGLEBRACKET'; // '<'
export const OPENPAREN = 'OPENPAREN'; // '('
export const CLOSEBRACE = 'CLOSEBRACE'; // '}'
export const CLOSEBRACKET = 'CLOSEBRACKET'; // ']'
export const CLOSEANGLEBRACKET = 'CLOSEANGLEBRACKET'; // '>'
export const CLOSEPAREN = 'CLOSEPAREN'; // ')'
export const AMPERSAND = 'AMPERSAND'; // '&'

// Default token - anything that is not one of the above
export const SYM = 'SYM';
