/**
	Not exactly parser, more like the second-stage scanner (although we can
	theoretically hotswap the code here with a real parser in the future... but
	for a little URL-finding utility abstract syntax trees may be a little
	overkill).

	URL format: http://en.wikipedia.org/wiki/URI_scheme
	Email format: http://en.wikipedia.org/wiki/EmailAddress (links to RFC in
	reference)

	@module linkify
	@submodule parser
	@main run
*/

import {
	makeState,
	makeAcceptingState,
	takeT,
	makeT,
	makeMultiT
} from './fsm';
import * as tk from './text';
import * as mtk from './multi';

/**
 * Generate the parser multi token-based state machine
 * @returns {State} the starting state
 */
export function init() {
	// The universal starting state.
	const Start = makeState();

	// Intermediate states for URLs. Note that domains that begin with a protocol
	// are treated slighly differently from those that don't.
	const Scheme						= makeState(); // e.g., 'mailto'
	const SlashScheme					= makeState(); // e.g., 'http'
	const SlashSchemeColon				= makeState(); // e.g., 'http:'
	const SlashSchemeColonSlash			= makeState(); // e.g., 'http:/'
	const UriPrefix						= makeState(); // e.g., 'mailto:' or 'http://'

	const Domain						= makeState(); // parsed string ends with a potential domain name (A)
	const DomainDot						= makeState(); // domain followed by DOT
	const DomainHyphen					= makeState(); // domain followed by hyphen
	const DomainDotTld					= makeAcceptingState(mtk.Url); // Simplest possible URL with no query string
	const DomainDotTldColon				= makeState(); // URL followed by colon (potential port number here)
	const DomainDotTldColonPort			= makeAcceptingState(mtk.Url); // TLD followed by a port number

	const Url							= makeAcceptingState(mtk.Url); // Long URL with optional port and maybe query string
	const UrlNonaccept					= makeState(); // URL followed by some symbols (will not be part of the final URL)
	const UrlOpenbrace					= makeState(); // URL followed by {
	const UrlOpenbracket				= makeState(); // URL followed by [
	const UrlOpenanglebracket			= makeState(); // URL followed by <
	const UrlOpenparen					= makeState(); // URL followed by (
	const UrlOpenbraceQ					= makeAcceptingState(mtk.Url); // URL followed by { and some symbols that the URL can end it
	const UrlOpenbracketQ				= makeAcceptingState(mtk.Url); // URL followed by [ and some symbols that the URL can end it
	const UrlOpenanglebracketQ			= makeAcceptingState(mtk.Url); // URL followed by < and some symbols that the URL can end it
	const UrlOpenparenQ					= makeAcceptingState(mtk.Url); // URL followed by ( and some symbols that the URL can end it
	const UrlOpenbraceSyms				= makeState(); // UrlOpenbrace followed by some symbols it cannot end it
	const UrlOpenbracketSyms			= makeState(); // UrlOpenbracketQ followed by some symbols it cannot end it
	const UrlOpenanglebracketSyms		= makeState(); // UrlOpenanglebracketQ followed by some symbols it cannot end it
	const UrlOpenparenSyms				= makeState(); // UrlOpenparenQ followed by some symbols it cannot end it

	const EmailDomain					= makeState(); // parsed string starts with local email info + @ with a potential domain name
	const EmailDomainDot				= makeState(); // domain followed by DOT
	const EmailDomainHyphen				= makeState(); // parsed string starts with local email info + @ with a potential domain name
	const Email							= makeAcceptingState(mtk.Email); // Possible email address (could have more tlds)
	const EmailColon					= makeState(); // URL followed by colon (potential port number here)
	const EmailColonPort				= makeAcceptingState(mtk.Email); // URL followed by colon and potential port numner
	const Localpart						= makeState(); // Local part of the email address
	const LocalpartAt					= makeState(); // Local part of the email address plus @
	const LocalpartAtNum				= makeState(); // Local part of the email address plus @ plus a number
	const LocalpartDot					= makeState(); // Local part of the email address plus '.' (localpart cannot end in .)

	const Nl							= makeAcceptingState(mtk.Nl); // single new line

	// Make path from start to protocol (with '//')
	makeT(Start, tk.NL, Nl);
	makeT(Start, tk.SCHEME, Scheme);
	makeT(Start, tk.SLASH_SCHEME, SlashScheme);
	makeT(Start, tk.COMPOUND_SCHEME, Scheme);
	makeT(Start, tk.COMPOUND_SLASH_SCHEME, SlashScheme);

	// Most transitions after a UriPrefix will be considered URL tokens
	makeT(Scheme, tk.COLON, UriPrefix);
	makeT(SlashScheme, tk.COLON, SlashSchemeColon);
	makeT(SlashSchemeColon, tk.SLASH, SlashSchemeColonSlash);
	makeT(SlashSchemeColonSlash, tk.SLASH, UriPrefix);

	// The very first potential domain name + full URL
	makeT(Start, tk.LOCALHOST, DomainDotTld);

	// Some transitions from this call are ignored because they're already
	// accounted for in the scheme state definitions above
	makeMultiT(Start, tk.domain, Domain);


	// Account for dots and hyphens. Hyphens are usually parts of domain names
	// (but not TLDs)
	makeT(Domain, tk.DOT, DomainDot);
	makeT(Domain, tk.HYPHEN, DomainHyphen);
	makeMultiT(Domain, tk.domain, Domain);
	makeT(Scheme, tk.DOT, DomainDot);
	makeT(Scheme, tk.HYPHEN, DomainHyphen);
	makeMultiT(Scheme, tk.domain, Domain);
	makeT(SlashScheme, tk.DOT, DomainDot);
	makeT(SlashScheme, tk.HYPHEN, DomainHyphen);
	makeMultiT(SlashScheme, tk.domain, Domain);
	makeT(DomainDot, tk.TLD, DomainDotTld);
	makeT(DomainDot, tk.UTLD, DomainDotTld);
	makeMultiT(DomainDot, tk.domain, Domain);
	// Hyphen can jump back to a domain name
	makeMultiT(DomainHyphen, tk.domain, Domain);
	makeT(DomainDotTld, tk.DOT, DomainDot);
	makeT(DomainDotTld, tk.HYPHEN, DomainHyphen);
	makeMultiT(DomainDotTld, tk.domain, Domain);

	// Become real URLs after `SLASH` or `COLON NUM SLASH`
	// Here works with or without scheme:// prefix
	makeT(DomainDotTld, tk.COLON, DomainDotTldColon);
	makeT(DomainDotTld, tk.SLASH, Url);
	makeMultiT(DomainDotTldColon, tk.numeric, DomainDotTldColonPort);
	makeT(DomainDotTldColonPort, tk.SLASH, Url);

	// Force URL with scheme prefix followed by anything sane
	makeT(UriPrefix, tk.SLASH, Url);
	makeMultiT(UriPrefix, tk.domain, Url);

	// Types of characters the URL can definitely end in
	const qsAccepting = tk.domain.concat([
		tk.AMPERSAND,
		tk.ASTERISK,
		tk.AT,
		tk.BACKSLASH,
		tk.BACKTICK,
		tk.CARET,
		tk.DOLLAR,
		tk.EQUALS,
		tk.HYPHEN,
		tk.NUM,
		tk.PERCENT,
		tk.PIPE,
		tk.PLUS,
		tk.POUND,
		tk.SLASH,
		tk.SYM,
		tk.TILDE,
		tk.UNDERSCORE
	]);

	// Types of tokens that can follow a URL and be part of the query string
	// but cannot be the very last characters
	// Characters that cannot appear in the URL at all should be excluded
	const qsNonAccepting = [
		tk.APOSTROPHE,
		tk.CLOSEANGLEBRACKET,
		tk.CLOSEBRACE,
		tk.CLOSEBRACKET,
		tk.CLOSEPAREN,
		tk.COLON,
		tk.COMMA,
		tk.DOT,
		tk.EXCLAMATION,
		tk.OPENANGLEBRACKET,
		tk.OPENBRACE,
		tk.OPENBRACKET,
		tk.OPENPAREN,
		tk.QUERY,
		tk.QUOTE,
		tk.SEMI
	];

	// These states are responsible primarily for determining whether or not to
	// include the final round bracket.

	// URL, followed by an opening bracket
	makeT(Url, tk.OPENBRACE, UrlOpenbrace);
	makeT(Url, tk.OPENBRACKET, UrlOpenbracket);
	makeT(Url, tk.OPENANGLEBRACKET, UrlOpenanglebracket);
	makeT(Url, tk.OPENPAREN, UrlOpenparen);

	// URL with extra symbols at the end, followed by an opening bracket
	makeT(UrlNonaccept, tk.OPENBRACE, UrlOpenbrace);
	makeT(UrlNonaccept, tk.OPENBRACKET, UrlOpenbracket);
	makeT(UrlNonaccept, tk.OPENANGLEBRACKET, UrlOpenanglebracket);
	makeT(UrlNonaccept, tk.OPENPAREN, UrlOpenparen);

	// Closing bracket component. This character WILL be included in the URL
	makeT(UrlOpenbrace, tk.CLOSEBRACE, Url);
	makeT(UrlOpenbracket, tk.CLOSEBRACKET, Url);
	makeT(UrlOpenanglebracket, tk.CLOSEANGLEBRACKET, Url);
	makeT(UrlOpenparen, tk.CLOSEPAREN, Url);
	makeT(UrlOpenbrace, tk.CLOSEBRACE, Url);
	makeT(UrlOpenbracketQ, tk.CLOSEBRACKET, Url);
	makeT(UrlOpenanglebracketQ, tk.CLOSEANGLEBRACKET, Url);
	makeT(UrlOpenparenQ, tk.CLOSEPAREN, Url);
	makeT(UrlOpenbrace, tk.CLOSEBRACE, Url);
	makeT(UrlOpenbracketSyms, tk.CLOSEBRACKET, Url);
	makeT(UrlOpenanglebracketSyms, tk.CLOSEANGLEBRACKET, Url);
	makeT(UrlOpenparenSyms, tk.CLOSEPAREN, Url);

	// URL that beings with an opening bracket, followed by a symbols.
	// Note that the final state can still be `UrlOpenbrace` (if the URL only
	// has a single opening bracket for some reason).
	makeMultiT(UrlOpenbrace, qsAccepting, UrlOpenbrace);
	makeMultiT(UrlOpenbracket, qsAccepting, UrlOpenbracketQ);
	makeMultiT(UrlOpenanglebracket, qsAccepting, UrlOpenanglebracketQ);
	makeMultiT(UrlOpenparen, qsAccepting, UrlOpenparenQ);
	makeMultiT(UrlOpenbrace, qsNonAccepting, UrlOpenbrace);
	makeMultiT(UrlOpenbracket, qsNonAccepting, UrlOpenbracketSyms);
	makeMultiT(UrlOpenanglebracket, qsNonAccepting, UrlOpenanglebracketSyms);
	makeMultiT(UrlOpenparen, qsNonAccepting, UrlOpenparenSyms);

	// URL that begins with an opening bracket, followed by some symbols
	makeMultiT(UrlOpenbraceQ, qsAccepting, UrlOpenbraceQ);
	makeMultiT(UrlOpenbracketQ, qsAccepting, UrlOpenbracketQ);
	makeMultiT(UrlOpenanglebracketQ, qsAccepting, UrlOpenanglebracketQ);
	makeMultiT(UrlOpenparenQ, qsAccepting, UrlOpenparenQ);
	makeMultiT(UrlOpenbraceQ, qsNonAccepting, UrlOpenbraceQ);
	makeMultiT(UrlOpenbracketQ, qsNonAccepting, UrlOpenbracketQ);
	makeMultiT(UrlOpenanglebracketQ, qsNonAccepting, UrlOpenanglebracketQ);
	makeMultiT(UrlOpenparenQ, qsNonAccepting, UrlOpenparenQ);

	makeMultiT(UrlOpenbraceSyms, qsAccepting, UrlOpenbraceSyms);
	makeMultiT(UrlOpenbracketSyms, qsAccepting, UrlOpenbracketQ);
	makeMultiT(UrlOpenanglebracketSyms, qsAccepting, UrlOpenanglebracketQ);
	makeMultiT(UrlOpenparenSyms, qsAccepting, UrlOpenparenQ);
	makeMultiT(UrlOpenbraceSyms, qsNonAccepting, UrlOpenbraceSyms);
	makeMultiT(UrlOpenbracketSyms, qsNonAccepting, UrlOpenbracketSyms);
	makeMultiT(UrlOpenanglebracketSyms, qsNonAccepting, UrlOpenanglebracketSyms);
	makeMultiT(UrlOpenparenSyms, qsNonAccepting, UrlOpenparenSyms);

	// Account for the query string
	makeMultiT(Url, qsAccepting, Url);
	makeMultiT(UrlNonaccept, qsAccepting, Url);

	makeMultiT(Url, qsNonAccepting, UrlNonaccept);
	makeMultiT(UrlNonaccept, qsNonAccepting, UrlNonaccept);

	// Email address-specific state definitions
	// Note: We are not allowing '/' in email addresses since this would interfere
	// with real URLs

	// For addresses without the mailto prefix
	// Tokens allowed in the localpart of the email
	const localpartAccepting = [
		tk.AMPERSAND,
		tk.APOSTROPHE,
		tk.ASTERISK,
		tk.BACKSLASH,
		tk.BACKTICK,
		tk.CARET,
		tk.CLOSEBRACE,
		tk.DOLLAR,
		tk.EQUALS,
		tk.HYPHEN,
		tk.NUM,
		tk.OPENBRACE,
		tk.PERCENT,
		tk.PIPE,
		tk.PLUS,
		tk.POUND,
		tk.QUERY,
		tk.SLASH,
		tk.SYM,
		tk.TILDE,
		tk.UNDERSCORE
	];

	// Some of the tokens in `localpartAccepting` are already accounted for here and
	// will not be overwritten
	makeT(Start, tk.TILDE, Localpart);
	makeMultiT(Domain, localpartAccepting, Localpart);
	makeT(Domain, tk.AT, LocalpartAt);
	makeMultiT(DomainDotTld, localpartAccepting, Localpart);
	makeT(DomainDotTld, tk.AT, LocalpartAt);
	makeMultiT(DomainDot, localpartAccepting, Localpart);

	// Now in localpart of address

	makeMultiT(Localpart, tk.domain, Localpart);
	makeMultiT(Localpart, localpartAccepting, Localpart);
	makeT(Localpart, tk.AT, LocalpartAt); // close to an email address now
	makeT(Localpart, tk.DOT, LocalpartDot);
	makeMultiT(LocalpartDot, tk.domain, Localpart);
	makeMultiT(LocalpartDot, localpartAccepting, Localpart);
	makeT(LocalpartAt, tk.LOCALHOST, Email);
	makeMultiT(LocalpartAt, tk.domain, EmailDomain);
	makeMultiT(LocalpartAtNum, tk.domain, EmailDomain);

	makeT(EmailDomain, tk.DOT, EmailDomainDot);
	makeT(EmailDomain, tk.HYPHEN, EmailDomainHyphen);
	makeT(EmailDomainDot, tk.TLD, Email);
	makeT(EmailDomainDot, tk.UTLD, Email);
	makeMultiT(EmailDomainDot, tk.domain, EmailDomain);

	// Hyphen can jump back to a domain name
	makeMultiT(EmailDomainHyphen, tk.domain, EmailDomain);
	makeT(Email, tk.DOT, EmailDomainDot);
	makeT(Email, tk.HYPHEN, EmailDomainHyphen);
	makeMultiT(Email, tk.domain, EmailDomain);

	// Become real URLs after `SLASH` or `COLON NUM SLASH`
	// Here works with or without scheme:// prefix
	makeT(Email, tk.COLON, EmailColon);
	makeMultiT(EmailColon, tk.numeric, EmailColonPort);

	return Start;
}

/**
 * Run the parser state machine on a list of scanned string-based tokens to
 * create a list of multi tokens, each of which represents a URL, email address,
 * plain text, etc.
 *
 * @param {State} start parser start state
 * @param {string} input the original input used to generate the given tokens
 * @param {{t: string, v: string, s: number, e: number}[]} tokens list of scanned tokens
 * @returns {MultiToken[]}
 */
export function run(start, input, tokens) {
	let len = tokens.length;
	let cursor = 0;
	let multis = [];
	let textTokens = [];

	while (cursor < len) {
		let state = start;
		let secondState = null;
		let nextState = null;
		let multiLength = 0;
		let latestAccepting = null;
		let sinceAccepts = -1;

		while (cursor < len && !(secondState = takeT(state, tokens[cursor].t))) {
			// Starting tokens with nowhere to jump to.
			// Consider these to be just plain text
			textTokens.push(tokens[cursor++]);
		}

		while (cursor < len && (
			nextState = secondState || takeT(state, tokens[cursor].t))
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
			// No accepting state was found, part of a regular text token add
			// the first text token to the text tokens array and try again from
			// the next
			cursor -= multiLength;
			if (cursor < len) {
				textTokens.push(tokens[cursor]);
				cursor++;
			}
		} else {
			// Accepting state!
			// First close off the textTokens (if available)
			if (textTokens.length > 0) {
				multis.push(parserCreateMultiToken(mtk.Text, input, textTokens));
				textTokens = [];
			}

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			multiLength -= sinceAccepts;

			// Create a new multitoken
			const Multi = latestAccepting.t;
			const subtokens = tokens.slice(cursor - multiLength, cursor);
			multis.push(parserCreateMultiToken(Multi, input, subtokens));
		}
	}

	// Finally close off the textTokens (if available)
	if (textTokens.length > 0) {
		multis.push(parserCreateMultiToken(mtk.Text, input, textTokens));
	}

	return multis;
}

export { mtk as tokens };

/**
 * Utility function for instantiating a new multitoken with all the relevant
 * fields during parsing.
 * @param {Class<MultiToken>} Multi class to instantiate
 * @param {string} input original input string
 * @param {{t: string, v: string, s: number, e: number}[]} tokens consecutive tokens scanned from input string
 * @returns {MultiToken}
 */
function parserCreateMultiToken(Multi, input, tokens) {
	const startIdx = tokens[0].s;
	const endIdx = tokens[tokens.length - 1].e;
	const value = input.slice(startIdx, endIdx);
	return new Multi(value, tokens);
}
