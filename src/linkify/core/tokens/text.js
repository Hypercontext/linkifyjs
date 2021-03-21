/******************************************************************************
	Text Tokens
	Tokens composed of strings
******************************************************************************/

// A valid web domain token
export const DOMAIN = 'DOMAIN';
export const LOCALHOST = 'LOCALHOST'; // special case of domain

// Valid top-level domain (see tlds.js)
export const TLD = 'TLD';

// Any sequence of digits 0-9
export const NUM = 'NUM';

// A web URL protocol. Supported types include
// - `http:`
// - `https:`
// - `ftp:`
// - `ftps:`
// - user-defined custom protocols
export const PROTOCOL = 'PROTOCOL';

// Start of the email URI protocol
export const MAILTO = 'MAILTO'; // mailto:

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

// Default token - anything that is not one of the above
export const SYM = 'SYM';
