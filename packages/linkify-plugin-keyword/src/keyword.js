import { createTokenClass, regexp, registerToken, stringToArray } from 'linkifyjs';

// Scanner text tokens
const KEYWORD = registerToken('KEYWORD');
const KEYWORD_NUMERIC = registerToken('KEYWORD_NUMERIC', ['numeric']);
const KEYWORD_ASCII = registerToken('KEYWORD_ASCII', ['ascii']);
const KEYWORD_ASCIINUMERIC = registerToken('KEYWORD_ASCIINUMERIC', ['asciinumeric']);
const KEYWORD_ALPHA = registerToken('KEYWORD_ALPHA', ['alpha']);
const KEYWORD_ALPHANUMERIC = registerToken('KEYWORD_ALPHANUMERIC', ['alphanumeric']);
const KEYWORD_DOMAIN = registerToken('KEYWORD_DOMAIN', ['domain']);

/**
 * Tokenize will emit token classes of this type
 */
 const Keyword = createTokenClass('keyword', { isLink: true });

/**
 * Keys are registered tokens recognized by the scanner in the plugin
 * definition, associated with one or more collections. Values are the list of
 * keywords that get scanned into those tokens.
 *
 * Organized this way to ensure other links that rely on these collections are
 * still recognized by the parser.
 */
const registeredKeywordsByToken = {
	[KEYWORD]: [],
	[KEYWORD_NUMERIC]: [],
	[KEYWORD_ASCII]: [],
	[KEYWORD_ASCIINUMERIC]: [],
	[KEYWORD_ALPHA]: [],
	[KEYWORD_ALPHANUMERIC]: [],
	[KEYWORD_DOMAIN]: [],
};

// Additional pre-processing regular expressions
// Clone from existing but add global flag
const ALL_LETTERS = new RegExp(regexp.LETTER, regexp.LETTER.flags + 'g');
const ALL_EMOJIS = new RegExp(regexp.EMOJI, regexp.EMOJI.flags + 'g');
const ALL_EMOJI_VARIATIONS = new RegExp(regexp.EMOJI_VARIATION, regexp.EMOJI_VARIATION.flags + 'g');

function pushIfMissing(item, list) {
	if (list.indexOf(item) < 0) {
		list.push(item);
	}
}

/**
 * Return the number of regexp matches in the given string
 * @param {string} str
 * @param {RegExp} regexp
 * @returns {number}
 */
function nMatch(str, regexp) {
	const matches = str.match(regexp);
	return matches ? matches.length : 0;
}

/**
 *
 * @param {string[]} keywords Keywords to linkify
 */
 export function registerKeywords(keywords) {
	// validate all keywords
	for (let i = 0; i < keywords.length; i++) {
		const keyword = keywords[i];
		if (typeof keyword !== 'string' || !keyword) {
			throw new Error(`linkify-plugin-keyword: Invalid keyword "${keyword}"`);
		}
	}

	for (let i = 0; i < keywords.length; i++) {
		const keyword = keywords[i].toLowerCase();
		if (/^[0-9]+$/.test(keyword)) {
			pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD_NUMERIC]);
			continue;
		}

		if (/^[a-z]+$/.test(keyword)) {
			pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD_ASCII]);
			continue;
		}

		if (/^[0-9a-z]+$/.test(keyword)) {
			pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD_ASCIINUMERIC]);
			continue;
		}

		const nLetters = nMatch(keyword, ALL_LETTERS);
		if (nLetters === keyword.length) {
			pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD_ALPHA]);
			continue;
		}

		const nNumbers = nMatch(keyword, /[0-9]/g);
		if (nLetters + nNumbers === keyword.length) {
			pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD_ALPHANUMERIC]);
			continue;
		}

		const nEmojis = nMatch(keyword, ALL_EMOJIS) + nMatch(keyword, ALL_EMOJI_VARIATIONS);
		const nHyphens = nMatch(keyword, /-/g);
		if (nLetters + nNumbers + nEmojis + nHyphens === keyword.length && !/(^-|-$|--)/.test(keyword)) {
			// Composed of letters, numbers hyphens or emojis. No leading,
			// trailing or consecutive hyphens. Valid domain name.
			pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD_DOMAIN]);
			continue;
		}

		// Keyword does not match any existing tokens that the scanner may recognize
		pushIfMissing(keyword, registeredKeywordsByToken[KEYWORD]);
	}
}

/**
 * @type import('linkifyjs').Plugin
 */
export function keyword({ scanner, parser }) {
	// Create scanner transitions from all registered tokens
	for (const token in registeredKeywordsByToken) {
		const keyword = registeredKeywordsByToken[token];
		const chars = stringToArray(keyword);
		const lastCharIdx = chars.length - 1;
		let state = scanner.start;
		for (let i = 0; i < lastCharIdx; i++) {
			state = state.tt(chars[i]);
		}
		state.tt(chars[lastCharIdx], token);

		// Parser transition for the current token with an immediately-accepting multitoken
		parser.start.tt(token, Keyword);
	}
}
