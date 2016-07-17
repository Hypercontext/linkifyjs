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

import {text as TEXT_TOKENS, multi as MULTI_TOKENS} from './tokens';
import {TokenState as State} from './state';

let makeState = (tokenClass) => new State(tokenClass);

const
TT_DOMAIN		= TEXT_TOKENS.DOMAIN,
TT_AT			= TEXT_TOKENS.AT,
TT_COLON		= TEXT_TOKENS.COLON,
TT_DOT			= TEXT_TOKENS.DOT,
TT_PUNCTUATION	= TEXT_TOKENS.PUNCTUATION,
TT_LOCALHOST	= TEXT_TOKENS.LOCALHOST,
TT_NL			= TEXT_TOKENS.NL,
TT_NUM			= TEXT_TOKENS.NUM,
TT_PLUS			= TEXT_TOKENS.PLUS,
TT_POUND		= TEXT_TOKENS.POUND,
TT_PROTOCOL		= TEXT_TOKENS.PROTOCOL,
TT_QUERY		= TEXT_TOKENS.QUERY,
TT_SLASH		= TEXT_TOKENS.SLASH,
TT_SYM			= TEXT_TOKENS.SYM,
TT_TLD			= TEXT_TOKENS.TLD,
TT_OPENBRACE	= TEXT_TOKENS.OPENBRACE,
TT_OPENBRACKET	= TEXT_TOKENS.OPENBRACKET,
TT_OPENPAREN	= TEXT_TOKENS.OPENPAREN,
TT_CLOSEBRACE	= TEXT_TOKENS.CLOSEBRACE,
TT_CLOSEBRACKET	= TEXT_TOKENS.CLOSEBRACKET,
TT_CLOSEPAREN	= TEXT_TOKENS.CLOSEPAREN;

// TT_WS 			= TEXT_TOKENS.WS;

const
T_EMAIL	= MULTI_TOKENS.EMAIL,
T_NL	= MULTI_TOKENS.NL,
T_TEXT	= MULTI_TOKENS.TEXT,
T_URL	= MULTI_TOKENS.URL;

// The universal starting state.
let S_START = makeState();

// Intermediate states for URLs. Note that domains that begin with a protocol
// are treated slighly differently from those that don't.
let
S_PROTOCOL				= makeState(), // e.g., 'http:'
S_PROTOCOL_SLASH		= makeState(), // e.g., '/', 'http:/''
S_PROTOCOL_SLASH_SLASH	= makeState(),  // e.g., '//', 'http://'
S_DOMAIN				= makeState(), // parsed string ends with a potential domain name (A)
S_DOMAIN_DOT			= makeState(), // (A) domain followed by DOT
S_TLD					= makeState(T_URL), // (A) Simplest possible URL with no query string
S_TLD_COLON				= makeState(), // (A) URL followed by colon (potential port number here)
S_TLD_PORT				= makeState(T_URL), // TLD followed by a port number
S_URL					= makeState(T_URL), // Long URL with optional port and maybe query string
S_URL_NON_ACCEPTING		= makeState(), // URL followed by some symbols (will not be part of the final URL)
S_URL_OPENBRACE			= makeState(), // URL followed by {
S_URL_OPENBRACKET		= makeState(), // URL followed by [
S_URL_OPENPAREN			= makeState(), // URL followed by (
S_URL_OPENBRACE_Q		= makeState(T_URL), // URL followed by { and some symbols that the URL can end it
S_URL_OPENBRACKET_Q		= makeState(T_URL), // URL followed by [ and some symbols that the URL can end it
S_URL_OPENPAREN_Q		= makeState(T_URL), // URL followed by ( and some symbols that the URL can end it
S_URL_OPENBRACE_SYMS	= makeState(), // S_URL_OPENBRACE_Q followed by some symbols it cannot end it
S_URL_OPENBRACKET_SYMS	= makeState(), // S_URL_OPENBRACKET_Q followed by some symbols it cannot end it
S_URL_OPENPAREN_SYMS	= makeState(), // S_URL_OPENPAREN_Q followed by some symbols it cannot end it
S_EMAIL_DOMAIN			= makeState(), // parsed string starts with local email info + @ with a potential domain name (C)
S_EMAIL_DOMAIN_DOT		= makeState(), // (C) domain followed by DOT
S_EMAIL					= makeState(T_EMAIL), // (C) Possible email address (could have more tlds)
S_EMAIL_COLON			= makeState(), // (C) URL followed by colon (potential port number here)
S_EMAIL_PORT			= makeState(T_EMAIL), // (C) Email address with a port
S_LOCALPART				= makeState(), // Local part of the email address
S_LOCALPART_AT			= makeState(), // Local part of the email address plus @
S_LOCALPART_DOT			= makeState(), // Local part of the email address plus '.' (localpart cannot end in .)
S_NL					= makeState(T_NL); // single new line

// Make path from start to protocol (with '//')
S_START
.on(TT_NL, S_NL)
.on(TT_PROTOCOL, S_PROTOCOL)
.on(TT_SLASH, S_PROTOCOL_SLASH);

S_PROTOCOL.on(TT_SLASH, S_PROTOCOL_SLASH);
S_PROTOCOL_SLASH.on(TT_SLASH, S_PROTOCOL_SLASH_SLASH);

// The very first potential domain name
S_START
.on(TT_TLD, S_DOMAIN)
.on(TT_DOMAIN, S_DOMAIN)
.on(TT_LOCALHOST, S_TLD)
.on(TT_NUM, S_DOMAIN);

// Force URL for anything sane followed by protocol
S_PROTOCOL_SLASH_SLASH
.on(TT_TLD, S_URL)
.on(TT_DOMAIN, S_URL)
.on(TT_NUM, S_URL)
.on(TT_LOCALHOST, S_URL);

// Account for dots and hyphens
// hyphens are usually parts of domain names
S_DOMAIN.on(TT_DOT, S_DOMAIN_DOT);
S_EMAIL_DOMAIN.on(TT_DOT, S_EMAIL_DOMAIN_DOT);

// Hyphen can jump back to a domain name

// After the first domain and a dot, we can find either a URL or another domain
S_DOMAIN_DOT
.on(TT_TLD, S_TLD)
.on(TT_DOMAIN, S_DOMAIN)
.on(TT_NUM, S_DOMAIN)
.on(TT_LOCALHOST, S_DOMAIN);

S_EMAIL_DOMAIN_DOT
.on(TT_TLD, S_EMAIL)
.on(TT_DOMAIN, S_EMAIL_DOMAIN)
.on(TT_NUM, S_EMAIL_DOMAIN)
.on(TT_LOCALHOST, S_EMAIL_DOMAIN);

// S_TLD accepts! But the URL could be longer, try to find a match greedily
// The `run` function should be able to "rollback" to the accepting state
S_TLD.on(TT_DOT, S_DOMAIN_DOT);
S_EMAIL.on(TT_DOT, S_EMAIL_DOMAIN_DOT);

// Become real URLs after `SLASH` or `COLON NUM SLASH`
// Here PSS and non-PSS converge
S_TLD
.on(TT_COLON, S_TLD_COLON)
.on(TT_SLASH, S_URL);
S_TLD_COLON.on(TT_NUM, S_TLD_PORT);
S_TLD_PORT.on(TT_SLASH, S_URL);
S_EMAIL.on(TT_COLON, S_EMAIL_COLON);
S_EMAIL_COLON.on(TT_NUM, S_EMAIL_PORT);

// Types of characters the URL can definitely end in
let qsAccepting = [
	TT_DOMAIN,
	TT_AT,
	TT_LOCALHOST,
	TT_NUM,
	TT_PLUS,
	TT_POUND,
	TT_PROTOCOL,
	TT_SLASH,
	TT_TLD,
	TT_SYM
];

// Types of tokens that can follow a URL and be part of the query string
// but cannot be the very last characters
// Characters that cannot appear in the URL at all should be excluded
let qsNonAccepting = [
	TT_COLON,
	TT_DOT,
	TT_QUERY,
	TT_PUNCTUATION,
	TT_CLOSEBRACE,
	TT_CLOSEBRACKET,
	TT_CLOSEPAREN,
	TT_OPENBRACE,
	TT_OPENBRACKET,
	TT_OPENPAREN
];

// These states are responsible primarily for determining whether or not to
// include the final round bracket.

// URL, followed by an opening bracket
S_URL
.on(TT_OPENBRACE, S_URL_OPENBRACE)
.on(TT_OPENBRACKET, S_URL_OPENBRACKET)
.on(TT_OPENPAREN, S_URL_OPENPAREN);

// URL with extra symbols at the end, followed by an opening bracket
S_URL_NON_ACCEPTING
.on(TT_OPENBRACE, S_URL_OPENBRACE)
.on(TT_OPENBRACKET, S_URL_OPENBRACKET)
.on(TT_OPENPAREN, S_URL_OPENPAREN);

// Closing bracket component. This character WILL be included in the URL
S_URL_OPENBRACE.on(TT_CLOSEBRACE, S_URL);
S_URL_OPENBRACKET.on(TT_CLOSEBRACKET, S_URL);
S_URL_OPENPAREN.on(TT_CLOSEPAREN, S_URL);
S_URL_OPENBRACE_Q.on(TT_CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_Q.on(TT_CLOSEBRACKET, S_URL);
S_URL_OPENPAREN_Q.on(TT_CLOSEPAREN, S_URL);
S_URL_OPENBRACE_SYMS.on(TT_CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_SYMS.on(TT_CLOSEBRACKET, S_URL);
S_URL_OPENPAREN_SYMS.on(TT_CLOSEPAREN, S_URL);

// URL that beings with an opening bracket, followed by a symbols.
// Note that the final state can still be `S_URL_OPENBRACE_Q` (if the URL only
// has a single opening bracket for some reason).
S_URL_OPENBRACE.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENPAREN.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENPAREN.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// URL that begins with an opening bracket, followed by some symbols
S_URL_OPENBRACE_Q.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_Q.on(qsNonAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsNonAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsNonAccepting, S_URL_OPENPAREN_Q);

S_URL_OPENBRACE_SYMS.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_SYMS.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENPAREN_SYMS.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_SYMS.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
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
	TT_DOMAIN,
	TT_NUM,
	TT_PLUS,
	TT_POUND,
	TT_QUERY,
	TT_SYM,
	TT_TLD
];

// Some of the tokens in `localpartAccepting` are already accounted for here and
// will not be overwritten (don't worry)
S_DOMAIN
.on(localpartAccepting, S_LOCALPART)
.on(TT_AT, S_LOCALPART_AT);
S_TLD
.on(localpartAccepting, S_LOCALPART)
.on(TT_AT, S_LOCALPART_AT);
S_DOMAIN_DOT.on(localpartAccepting, S_LOCALPART);

// Okay we're on a localpart. Now what?
// TODO: IP addresses and what if the email starts with numbers?
S_LOCALPART
.on(localpartAccepting, S_LOCALPART)
.on(TT_AT, S_LOCALPART_AT) // close to an email address now
.on(TT_DOT, S_LOCALPART_DOT);
S_LOCALPART_DOT.on(localpartAccepting, S_LOCALPART);
S_LOCALPART_AT
.on(TT_TLD, S_EMAIL_DOMAIN)
.on(TT_DOMAIN, S_EMAIL_DOMAIN)
.on(TT_LOCALHOST, S_EMAIL);
// States following `@` defined above

let run = function (tokens) {
	let
	len = tokens.length,
	cursor = 0,
	multis = [],
	textTokens = [];

	while (cursor < len) {

		let
		state = S_START,
		secondState = null,
		nextState = null,
		multiLength = 0,
		latestAccepting = null,
		sinceAccepts = -1;

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
				multis.push(new T_TEXT(textTokens));
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
		multis.push(new T_TEXT(textTokens));
	}

	return multis;
};

let
TOKENS = MULTI_TOKENS,
start = S_START;
export { State, TOKENS, run, start };
