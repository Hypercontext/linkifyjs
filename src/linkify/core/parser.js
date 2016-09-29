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

import {TokenState as State} from './state';
import * as TEXT_TOKENS from './tokens/text';
import * as MULTI_TOKENS from './tokens/multi';
import {
	DOMAIN,
	AT,
	COLON,
	DOT,
	PUNCTUATION,
	LOCALHOST,
	NL as TNL,
	NUM,
	PLUS,
	POUND,
	PROTOCOL,
	QUERY,
	SLASH,
	UNDERSCORE,
	SYM,
	TLD,
	OPENBRACE,
	OPENBRACKET,
	OPENANGLEBRACKET,
	OPENPAREN,
	CLOSEBRACE,
	CLOSEBRACKET,
	CLOSEANGLEBRACKET,
	CLOSEPAREN,
} from './tokens/text';

import {
	EMAIL,
	NL as MNL,
	TEXT,
	URL
} from './tokens/multi';

let makeState = (tokenClass) => new State(tokenClass);

// The universal starting state.
let S_START = makeState();

// Intermediate states for URLs. Note that domains that begin with a protocol
// are treated slighly differently from those that don't.
let S_PROTOCOL				= makeState(); // e.g., 'http:'
let S_PROTOCOL_SLASH		= makeState(); // e.g., '/', 'http:/''
let S_PROTOCOL_SLASH_SLASH	= makeState();  // e.g., '//', 'http://'
let S_DOMAIN				= makeState(); // parsed string ends with a potential domain name (A)
let S_DOMAIN_DOT			= makeState(); // (A) domain followed by DOT
let S_TLD					= makeState(URL); // (A) Simplest possible URL with no query string
let S_TLD_COLON				= makeState(); // (A) URL followed by colon (potential port number here)
let S_TLD_PORT				= makeState(URL); // TLD followed by a port number
let S_URL					= makeState(URL); // Long URL with optional port and maybe query string
let S_URL_NON_ACCEPTING		= makeState(); // URL followed by some symbols (will not be part of the final URL)
let S_URL_OPENBRACE			= makeState(); // URL followed by {
let S_URL_OPENBRACKET		= makeState(); // URL followed by [
let S_URL_OPENANGLEBRACKET		= makeState(); // URL followed by <
let S_URL_OPENPAREN			= makeState(); // URL followed by (
let S_URL_OPENBRACE_Q		= makeState(URL); // URL followed by { and some symbols that the URL can end it
let S_URL_OPENBRACKET_Q		= makeState(URL); // URL followed by [ and some symbols that the URL can end it
let S_URL_OPENANGLEBRACKET_Q	= makeState(URL); // URL followed by < and some symbols that the URL can end it
let S_URL_OPENPAREN_Q		= makeState(URL); // URL followed by ( and some symbols that the URL can end it
let S_URL_OPENBRACE_SYMS	= makeState(); // S_URL_OPENBRACE_Q followed by some symbols it cannot end it
let S_URL_OPENBRACKET_SYMS	= makeState(); // S_URL_OPENBRACKET_Q followed by some symbols it cannot end it
let S_URL_OPENANGLEBRACKET_SYMS	= makeState(); // S_URL_OPENANGLEBRACKET_Q followed by some symbols it cannot end it
let S_URL_OPENPAREN_SYMS	= makeState(); // S_URL_OPENPAREN_Q followed by some symbols it cannot end it
let S_EMAIL_DOMAIN			= makeState(); // parsed string starts with local email info + @ with a potential domain name (C)
let S_EMAIL_DOMAIN_DOT		= makeState(); // (C) domain followed by DOT
let S_EMAIL					= makeState(EMAIL); // (C) Possible email address (could have more tlds)
let S_EMAIL_COLON			= makeState(); // (C) URL followed by colon (potential port number here)
let S_EMAIL_PORT			= makeState(EMAIL); // (C) Email address with a port
let S_LOCALPART				= makeState(); // Local part of the email address
let S_LOCALPART_AT			= makeState(); // Local part of the email address plus @
let S_LOCALPART_DOT			= makeState(); // Local part of the email address plus '.' (localpart cannot end in .)
let S_NL					= makeState(MNL); // single new line

// Make path from start to protocol (with '//')
S_START
.on(TNL, S_NL)
.on(PROTOCOL, S_PROTOCOL)
.on(SLASH, S_PROTOCOL_SLASH);

S_PROTOCOL.on(SLASH, S_PROTOCOL_SLASH);
S_PROTOCOL_SLASH.on(SLASH, S_PROTOCOL_SLASH_SLASH);

// The very first potential domain name
S_START
.on(TLD, S_DOMAIN)
.on(DOMAIN, S_DOMAIN)
.on(LOCALHOST, S_TLD)
.on(NUM, S_DOMAIN);

// Force URL for anything sane followed by protocol
S_PROTOCOL_SLASH_SLASH
.on(TLD, S_URL)
.on(DOMAIN, S_URL)
.on(NUM, S_URL)
.on(LOCALHOST, S_URL);

// Account for dots and hyphens
// hyphens are usually parts of domain names
S_DOMAIN.on(DOT, S_DOMAIN_DOT);
S_EMAIL_DOMAIN.on(DOT, S_EMAIL_DOMAIN_DOT);

// Hyphen can jump back to a domain name

// After the first domain and a dot, we can find either a URL or another domain
S_DOMAIN_DOT
.on(TLD, S_TLD)
.on(DOMAIN, S_DOMAIN)
.on(NUM, S_DOMAIN)
.on(LOCALHOST, S_DOMAIN);

S_EMAIL_DOMAIN_DOT
.on(TLD, S_EMAIL)
.on(DOMAIN, S_EMAIL_DOMAIN)
.on(NUM, S_EMAIL_DOMAIN)
.on(LOCALHOST, S_EMAIL_DOMAIN);

// S_TLD accepts! But the URL could be longer, try to find a match greedily
// The `run` function should be able to "rollback" to the accepting state
S_TLD.on(DOT, S_DOMAIN_DOT);
S_EMAIL.on(DOT, S_EMAIL_DOMAIN_DOT);

// Become real URLs after `SLASH` or `COLON NUM SLASH`
// Here PSS and non-PSS converge
S_TLD
.on(COLON, S_TLD_COLON)
.on(SLASH, S_URL);
S_TLD_COLON.on(NUM, S_TLD_PORT);
S_TLD_PORT.on(SLASH, S_URL);
S_EMAIL.on(COLON, S_EMAIL_COLON);
S_EMAIL_COLON.on(NUM, S_EMAIL_PORT);

// Types of characters the URL can definitely end in
let qsAccepting = [
	DOMAIN,
	AT,
	LOCALHOST,
	NUM,
	PLUS,
	POUND,
	PROTOCOL,
	SLASH,
	TLD,
	UNDERSCORE,
	SYM
];

// Types of tokens that can follow a URL and be part of the query string
// but cannot be the very last characters
// Characters that cannot appear in the URL at all should be excluded
let qsNonAccepting = [
	COLON,
	DOT,
	QUERY,
	PUNCTUATION,
	CLOSEBRACE,
	CLOSEBRACKET,
	CLOSEANGLEBRACKET,
	CLOSEPAREN,
	OPENBRACE,
	OPENBRACKET,
	OPENANGLEBRACKET,
	OPENPAREN
];

// These states are responsible primarily for determining whether or not to
// include the final round bracket.

// URL, followed by an opening bracket
S_URL
.on(OPENBRACE, S_URL_OPENBRACE)
.on(OPENBRACKET, S_URL_OPENBRACKET)
.on(OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET)
.on(OPENPAREN, S_URL_OPENPAREN);

// URL with extra symbols at the end, followed by an opening bracket
S_URL_NON_ACCEPTING
.on(OPENBRACE, S_URL_OPENBRACE)
.on(OPENBRACKET, S_URL_OPENBRACKET)
.on(OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET)
.on(OPENPAREN, S_URL_OPENPAREN);

// Closing bracket component. This character WILL be included in the URL
S_URL_OPENBRACE.on(CLOSEBRACE, S_URL);
S_URL_OPENBRACKET.on(CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET.on(CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN.on(CLOSEPAREN, S_URL);
S_URL_OPENBRACE_Q.on(CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_Q.on(CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET_Q.on(CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN_Q.on(CLOSEPAREN, S_URL);
S_URL_OPENBRACE_SYMS.on(CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_SYMS.on(CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET_SYMS.on(CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN_SYMS.on(CLOSEPAREN, S_URL);

// URL that beings with an opening bracket, followed by a symbols.
// Note that the final state can still be `S_URL_OPENBRACE_Q` (if the URL only
// has a single opening bracket for some reason).
S_URL_OPENBRACE.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// URL that begins with an opening bracket, followed by some symbols
S_URL_OPENBRACE_Q.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_Q.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_Q.on(qsNonAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsNonAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_Q.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsNonAccepting, S_URL_OPENPAREN_Q);

S_URL_OPENBRACE_SYMS.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_SYMS.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_SYMS.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_SYMS.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_SYMS.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN_SYMS.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// Account for the query string
S_URL.on(qsAccepting, S_URL);
S_URL_NON_ACCEPTING.on(qsAccepting, S_URL);

S_URL.on(qsNonAccepting, S_URL_NON_ACCEPTING);
S_URL_NON_ACCEPTING.on(qsNonAccepting, S_URL_NON_ACCEPTING);

// Email address-specific state definitions
// Note: We are not allowing '/' in email addresses since this would interfere
// with real URLs

// Tokens allowed in the localpart of the email
let localpartAccepting = [
	DOMAIN,
	NUM,
	PLUS,
	POUND,
	QUERY,
	UNDERSCORE,
	SYM,
	TLD
];

// Some of the tokens in `localpartAccepting` are already accounted for here and
// will not be overwritten (don't worry)
S_DOMAIN
.on(localpartAccepting, S_LOCALPART)
.on(AT, S_LOCALPART_AT);
S_TLD
.on(localpartAccepting, S_LOCALPART)
.on(AT, S_LOCALPART_AT);
S_DOMAIN_DOT.on(localpartAccepting, S_LOCALPART);

// Okay we're on a localpart. Now what?
// TODO: IP addresses and what if the email starts with numbers?
S_LOCALPART
.on(localpartAccepting, S_LOCALPART)
.on(AT, S_LOCALPART_AT) // close to an email address now
.on(DOT, S_LOCALPART_DOT);
S_LOCALPART_DOT.on(localpartAccepting, S_LOCALPART);
S_LOCALPART_AT
.on(TLD, S_EMAIL_DOMAIN)
.on(DOMAIN, S_EMAIL_DOMAIN)
.on(LOCALHOST, S_EMAIL);
// States following `@` defined above

let run = function (tokens) {
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

		while (cursor < len && !(secondState = state.next(tokens[cursor]))) {
			// Starting tokens with nowhere to jump to.
			// Consider these to be just plain text
			textTokens.push(tokens[cursor++]);
		}

		while (cursor < len && (
			nextState = secondState || state.next(tokens[cursor]))
		) {

			// Get the next state
			secondState = null;
			state = nextState;

			// Keep track of the latest accepting state
			if (state.accepts()) {
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
				multis.push(new TEXT(textTokens));
				textTokens = [];
			}

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			multiLength -= sinceAccepts;

			// Create a new multitoken
			let MULTI = latestAccepting.emit();
			multis.push(new MULTI(tokens.slice(cursor - multiLength, cursor)));
		}
	}

	// Finally close off the textTokens (if available)
	if (textTokens.length > 0) {
		multis.push(new TEXT(textTokens));
	}

	return multis;
};

export {
	State,
	MULTI_TOKENS as TOKENS,
	run,
	S_START as start
};
