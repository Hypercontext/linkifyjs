/**
	Not exactly parser, more like the second-stage scanner (although we can
	theoretically hotswap the code here with a real parser in the future... but
	for a little URL-finding utility abstract syntax trees may be a little
	overkill).

	URL format: http://en.wikipedia.org/wiki/URI_scheme
	Email format: http://en.wikipedia.org/wiki/Email_address (links to RFC in
	reference)

	@module linkify
	@submodule parser
	@main parser
*/

import {
	makeState,
	makeAcceptingState,
	t,
	makeT,
	makeMultiT,
	accepts
} from './fsm';
import * as tk from './tokens/text';
import * as mtk from './tokens/multi';

// The universal starting state.
let S_START = makeState();

// Intermediate states for URLs. Note that domains that begin with a protocol
// are treated slighly differently from those that don't.
let S_PROTOCOL						= makeState(); // e.g., 'http:'
let S_MAILTO						= makeState(); // 'mailto:'
let S_PROTOCOL_SLASH				= makeState(); // e.g., '/', 'http:/''
let S_PROTOCOL_SLASH_SLASH			= makeState();  // e.g., '//', 'http://'
let S_DOMAIN						= makeState(); // parsed string ends with a potential domain name (A)
let S_DOMAIN_DOT					= makeState(); // (A) domain followed by DOT
let S_TLD							= makeAcceptingState(mtk.URL); // (A) Simplest possible URL with no query string
let S_TLD_COLON						= makeState(); // (A) URL followed by colon (potential port number here)
let S_TLD_PORT						= makeAcceptingState(mtk.URL); // TLD followed by a port number
let S_URL							= makeAcceptingState(mtk.URL); // Long URL with optional port and maybe query string
let S_URL_NON_ACCEPTING				= makeState(); // URL followed by some symbols (will not be part of the final URL)
let S_URL_OPENBRACE					= makeState(); // URL followed by {
let S_URL_OPENBRACKET				= makeState(); // URL followed by [
let S_URL_OPENANGLEBRACKET			= makeState(); // URL followed by <
let S_URL_OPENPAREN					= makeState(); // URL followed by (
let S_URL_OPENBRACE_Q				= makeAcceptingState(mtk.URL); // URL followed by { and some symbols that the URL can end it
let S_URL_OPENBRACKET_Q				= makeAcceptingState(mtk.URL); // URL followed by [ and some symbols that the URL can end it
let S_URL_OPENANGLEBRACKET_Q		= makeAcceptingState(mtk.URL); // URL followed by < and some symbols that the URL can end it
let S_URL_OPENPAREN_Q				= makeAcceptingState(mtk.URL); // URL followed by ( and some symbols that the URL can end it
let S_URL_OPENBRACE_SYMS			= makeState(); // S_URL_OPENBRACE_Q followed by some symbols it cannot end it
let S_URL_OPENBRACKET_SYMS			= makeState(); // S_URL_OPENBRACKET_Q followed by some symbols it cannot end it
let S_URL_OPENANGLEBRACKET_SYMS		= makeState(); // S_URL_OPENANGLEBRACKET_Q followed by some symbols it cannot end it
let S_URL_OPENPAREN_SYMS			= makeState(); // S_URL_OPENPAREN_Q followed by some symbols it cannot end it
let S_EMAIL_DOMAIN					= makeState(); // parsed string starts with local email info + @ with a potential domain name (C)
let S_EMAIL_DOMAIN_DOT				= makeState(); // (C) domain followed by DOT
let S_EMAIL							= makeAcceptingState(mtk.EMAIL); // (C) Possible email address (could have more tlds)
let S_EMAIL_COLON					= makeState(); // (C) URL followed by colon (potential port number here)
let S_EMAIL_PORT					= makeAcceptingState(mtk.EMAIL); // (C) Email address with a port
let S_MAILTO_EMAIL					= makeAcceptingState(mtk.MAILTOEMAIL); // Email that begins with the mailto prefix (D)
let S_MAILTO_EMAIL_NON_ACCEPTING	= makeState(); // (D) Followed by some non-query string chars
let S_LOCALPART						= makeState(); // Local part of the email address
let S_LOCALPART_AT					= makeState(); // Local part of the email address plus @
let S_LOCALPART_DOT					= makeState(); // Local part of the email address plus '.' (localpart cannot end in .)
let S_NL							= makeAcceptingState(mtk.NL); // single new line

// Make path from start to protocol (with '//')
makeT(S_START, tk.NL, S_NL);
makeT(S_START, tk.PROTOCOL, S_PROTOCOL);
makeT(S_START, tk.MAILTO, S_MAILTO);
makeT(S_START, tk.SLASH, S_PROTOCOL_SLASH);

makeT(S_PROTOCOL, tk.SLASH, S_PROTOCOL_SLASH);
makeT(S_PROTOCOL_SLASH, tk.SLASH, S_PROTOCOL_SLASH_SLASH);

// The very first potential domain name
makeT(S_START, tk.TLD, S_DOMAIN);
makeT(S_START, tk.DOMAIN, S_DOMAIN);
makeT(S_START, tk.LOCALHOST, S_TLD);
makeT(S_START, tk.NUM, S_DOMAIN);

// Force URL for protocol followed by anything sane
makeT(S_PROTOCOL_SLASH_SLASH, tk.TLD, S_URL);
makeT(S_PROTOCOL_SLASH_SLASH, tk.DOMAIN, S_URL);
makeT(S_PROTOCOL_SLASH_SLASH, tk.NUM, S_URL);
makeT(S_PROTOCOL_SLASH_SLASH, tk.LOCALHOST, S_URL);

// Account for dots and hyphens
// hyphens are usually parts of domain names
makeT(S_DOMAIN, tk.DOT, S_DOMAIN_DOT);
makeT(S_EMAIL_DOMAIN, tk.DOT, S_EMAIL_DOMAIN_DOT);

// Hyphen can jump back to a domain name

// After the first domain and a dot, we can find either a URL or another domain
makeT(S_DOMAIN_DOT, tk.TLD, S_TLD);
makeT(S_DOMAIN_DOT, tk.DOMAIN, S_DOMAIN);
makeT(S_DOMAIN_DOT, tk.NUM, S_DOMAIN);
makeT(S_DOMAIN_DOT, tk.LOCALHOST, S_DOMAIN);

makeT(S_EMAIL_DOMAIN_DOT, tk.TLD, S_EMAIL);
makeT(S_EMAIL_DOMAIN_DOT, tk.DOMAIN, S_EMAIL_DOMAIN);
makeT(S_EMAIL_DOMAIN_DOT, tk.NUM, S_EMAIL_DOMAIN);
makeT(S_EMAIL_DOMAIN_DOT, tk.LOCALHOST, S_EMAIL_DOMAIN);

// S_TLD accepts! But the URL could be longer, try to find a match greedily
// The `run` function should be able to "rollback" to the accepting state
makeT(S_TLD, tk.DOT, S_DOMAIN_DOT);
makeT(S_EMAIL, tk.DOT, S_EMAIL_DOMAIN_DOT);

// Become real URLs after `SLASH` or `COLON NUM SLASH`
// Here PSS and non-PSS converge
makeT(S_TLD, tk.COLON, S_TLD_COLON);
makeT(S_TLD, tk.SLASH, S_URL);
makeT(S_TLD_COLON, tk.NUM, S_TLD_PORT);
makeT(S_TLD_PORT, tk.SLASH, S_URL);
makeT(S_EMAIL, tk.COLON, S_EMAIL_COLON);
makeT(S_EMAIL_COLON, tk.NUM, S_EMAIL_PORT);

// Types of characters the URL can definitely end in
const qsAccepting = [
	tk.DOMAIN,
	tk.AT,
	tk.LOCALHOST,
	tk.NUM,
	tk.PLUS,
	tk.POUND,
	tk.PROTOCOL,
	tk.SLASH,
	tk.TLD,
	tk.UNDERSCORE,
	tk.SYM,
	tk.AMPERSAND
];

// Types of tokens that can follow a URL and be part of the query string
// but cannot be the very last characters
// Characters that cannot appear in the URL at all should be excluded
const qsNonAccepting = [
	tk.COLON,
	tk.DOT,
	tk.QUERY,
	tk.PUNCTUATION,
	tk.CLOSEBRACE,
	tk.CLOSEBRACKET,
	tk.CLOSEANGLEBRACKET,
	tk.CLOSEPAREN,
	tk.OPENBRACE,
	tk.OPENBRACKET,
	tk.OPENANGLEBRACKET,
	tk.OPENPAREN
];

// These states are responsible primarily for determining whether or not to
// include the final round bracket.

// URL, followed by an opening bracket
makeT(S_URL, tk.OPENBRACE, S_URL_OPENBRACE);
makeT(S_URL, tk.OPENBRACKET, S_URL_OPENBRACKET);
makeT(S_URL, tk.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET);
makeT(S_URL, tk.OPENPAREN, S_URL_OPENPAREN);

// URL with extra symbols at the end, followed by an opening bracket
makeT(S_URL_NON_ACCEPTING, tk.OPENBRACE, S_URL_OPENBRACE);
makeT(S_URL_NON_ACCEPTING, tk.OPENBRACKET, S_URL_OPENBRACKET);
makeT(S_URL_NON_ACCEPTING, tk.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET);
makeT(S_URL_NON_ACCEPTING, tk.OPENPAREN, S_URL_OPENPAREN);

// Closing bracket component. This character WILL be included in the URL
makeT(S_URL_OPENBRACE, tk.CLOSEBRACE, S_URL);
makeT(S_URL_OPENBRACKET, tk.CLOSEBRACKET, S_URL);
makeT(S_URL_OPENANGLEBRACKET, tk.CLOSEANGLEBRACKET, S_URL);
makeT(S_URL_OPENPAREN, tk.CLOSEPAREN, S_URL);
makeT(S_URL_OPENBRACE_Q, tk.CLOSEBRACE, S_URL);
makeT(S_URL_OPENBRACKET_Q, tk.CLOSEBRACKET, S_URL);
makeT(S_URL_OPENANGLEBRACKET_Q, tk.CLOSEANGLEBRACKET, S_URL);
makeT(S_URL_OPENPAREN_Q, tk.CLOSEPAREN, S_URL);
makeT(S_URL_OPENBRACE_SYMS, tk.CLOSEBRACE, S_URL);
makeT(S_URL_OPENBRACKET_SYMS, tk.CLOSEBRACKET, S_URL);
makeT(S_URL_OPENANGLEBRACKET_SYMS, tk.CLOSEANGLEBRACKET, S_URL);
makeT(S_URL_OPENPAREN_SYMS, tk.CLOSEPAREN, S_URL);

// URL that beings with an opening bracket, followed by a symbols.
// Note that the final state can still be `S_URL_OPENBRACE_Q` (if the URL only
// has a single opening bracket for some reason).
makeMultiT(S_URL_OPENBRACE, qsAccepting, S_URL_OPENBRACE_Q);
makeMultiT(S_URL_OPENBRACKET, qsAccepting, S_URL_OPENBRACKET_Q);
makeMultiT(S_URL_OPENANGLEBRACKET, qsAccepting, S_URL_OPENANGLEBRACKET_Q);
makeMultiT(S_URL_OPENPAREN, qsAccepting, S_URL_OPENPAREN_Q);
makeMultiT(S_URL_OPENBRACE, qsNonAccepting, S_URL_OPENBRACE_SYMS);
makeMultiT(S_URL_OPENBRACKET, qsNonAccepting, S_URL_OPENBRACKET_SYMS);
makeMultiT(S_URL_OPENANGLEBRACKET, qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
makeMultiT(S_URL_OPENPAREN, qsNonAccepting, S_URL_OPENPAREN_SYMS);

// URL that begins with an opening bracket, followed by some symbols
makeMultiT(S_URL_OPENBRACE_Q, qsAccepting, S_URL_OPENBRACE_Q);
makeMultiT(S_URL_OPENBRACKET_Q, qsAccepting, S_URL_OPENBRACKET_Q);
makeMultiT(S_URL_OPENANGLEBRACKET_Q, qsAccepting, S_URL_OPENANGLEBRACKET_Q);
makeMultiT(S_URL_OPENPAREN_Q, qsAccepting, S_URL_OPENPAREN_Q);
makeMultiT(S_URL_OPENBRACE_Q, qsNonAccepting, S_URL_OPENBRACE_Q);
makeMultiT(S_URL_OPENBRACKET_Q, qsNonAccepting, S_URL_OPENBRACKET_Q);
makeMultiT(S_URL_OPENANGLEBRACKET_Q, qsNonAccepting, S_URL_OPENANGLEBRACKET_Q);
makeMultiT(S_URL_OPENPAREN_Q, qsNonAccepting, S_URL_OPENPAREN_Q);

makeMultiT(S_URL_OPENBRACE_SYMS, qsAccepting, S_URL_OPENBRACE_Q);
makeMultiT(S_URL_OPENBRACKET_SYMS, qsAccepting, S_URL_OPENBRACKET_Q);
makeMultiT(S_URL_OPENANGLEBRACKET_SYMS, qsAccepting, S_URL_OPENANGLEBRACKET_Q);
makeMultiT(S_URL_OPENPAREN_SYMS, qsAccepting, S_URL_OPENPAREN_Q);
makeMultiT(S_URL_OPENBRACE_SYMS, qsNonAccepting, S_URL_OPENBRACE_SYMS);
makeMultiT(S_URL_OPENBRACKET_SYMS, qsNonAccepting, S_URL_OPENBRACKET_SYMS);
makeMultiT(S_URL_OPENANGLEBRACKET_SYMS, qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
makeMultiT(S_URL_OPENPAREN_SYMS, qsNonAccepting, S_URL_OPENPAREN_SYMS);

// Account for the query string
makeMultiT(S_URL, qsAccepting, S_URL);
makeMultiT(S_URL_NON_ACCEPTING, qsAccepting, S_URL);

makeMultiT(S_URL, qsNonAccepting, S_URL_NON_ACCEPTING);
makeMultiT(S_URL_NON_ACCEPTING, qsNonAccepting, S_URL_NON_ACCEPTING);

// Email address-specific state definitions
// Note: We are not allowing '/' in email addresses since this would interfere
// with real URLs

// For addresses with the mailto prefix
// 'mailto:' followed by anything sane is a valid email
makeT(S_MAILTO, tk.TLD, S_MAILTO_EMAIL);
makeT(S_MAILTO, tk.DOMAIN, S_MAILTO_EMAIL);
makeT(S_MAILTO, tk.NUM, S_MAILTO_EMAIL);
makeT(S_MAILTO, tk.LOCALHOST, S_MAILTO_EMAIL);

// Greedily get more potential valid email values
makeMultiT(S_MAILTO_EMAIL, qsAccepting, S_MAILTO_EMAIL);
makeMultiT(S_MAILTO_EMAIL, qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);
makeMultiT(S_MAILTO_EMAIL_NON_ACCEPTING, qsAccepting, S_MAILTO_EMAIL);
makeMultiT(S_MAILTO_EMAIL_NON_ACCEPTING, qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);

// For addresses without the mailto prefix
// Tokens allowed in the localpart of the email
const localpartAccepting = [
	tk.DOMAIN,
	tk.NUM,
	tk.PLUS,
	tk.POUND,
	tk.QUERY,
	tk.UNDERSCORE,
	tk.SYM,
	tk.AMPERSAND,
	tk.TLD
];

// Some of the tokens in `localpartAccepting` are already accounted for here and
// will not be overwritten (don't worry)
makeMultiT(S_DOMAIN, localpartAccepting, S_LOCALPART);
makeT(S_DOMAIN, tk.AT, S_LOCALPART_AT);
makeMultiT(S_TLD, localpartAccepting, S_LOCALPART);
makeT(S_TLD, tk.AT, S_LOCALPART_AT);
makeMultiT(S_DOMAIN_DOT, localpartAccepting, S_LOCALPART);

// Now in localpart of address
// TODO: IP addresses and what if the email starts with numbers?

makeMultiT(S_LOCALPART, localpartAccepting, S_LOCALPART);
makeT(S_LOCALPART, tk.AT, S_LOCALPART_AT); // close to an email address now
makeT(S_LOCALPART, tk.DOT, S_LOCALPART_DOT);
makeMultiT(S_LOCALPART_DOT, localpartAccepting, S_LOCALPART);
makeT(S_LOCALPART_AT, tk.TLD, S_EMAIL_DOMAIN);
makeT(S_LOCALPART_AT, tk.DOMAIN, S_EMAIL_DOMAIN);
makeT(S_LOCALPART_AT, tk.LOCALHOST, S_EMAIL);

// States following `@` defined above

const run = (tokens) => {
	debugger
	let len = tokens.length;
	let cursor = 0;
	let multis = [];
	let textTokens = [];

	while (cursor < len) {
		let state = S_START;
		let secondState = null;
		let nextState = null;
		let multiLength = 0;
		let latestAccepting = null;
		let sinceAccepts = -1;

		while (cursor < len && !(secondState = t(state, tokens[cursor].t))) {
			// Starting tokens with nowhere to jump to.
			// Consider these to be just plain text
			textTokens.push(tokens[cursor++]);
		}

		while (cursor < len && (
			nextState = secondState || t(state, tokens[cursor].t))
		) {

			// Get the next state
			secondState = null;
			state = nextState;

			// Keep track of the latest accepting state
			if (accepts(state)) {
				sinceAccepts = 0;
				latestAccepting = state;
			} else if (sinceAccepts >= 0) {
				sinceAccepts++;
			}

			cursor++;
			multiLength++;
		}

		if (sinceAccepts < 0) {

			// No accepting state was found, part of a regular text token
			// Add all the tokens we looked at to the text tokens array
			for (let i = cursor - multiLength; i < cursor; i++) {
				textTokens.push(tokens[i]);
			}

		} else {

			// Accepting state!

			// First close off the textTokens (if available)
			if (textTokens.length > 0) {
				multis.push(new mtk.TEXT(textTokens));
				textTokens = [];
			}

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			multiLength -= sinceAccepts;

			// Create a new multitoken
			let MULTI = latestAccepting.t;
			multis.push(new MULTI(tokens.slice(cursor - multiLength, cursor)));
		}
	}

	// Finally close off the textTokens (if available)
	if (textTokens.length > 0) {
		multis.push(new mtk.TEXT(textTokens));
	}

	return multis;
};

export { mtk as TOKENS, S_START as start, run };
