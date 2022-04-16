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

import { State, ta, tt } from './fsm';
import * as tk from './text';
import * as mtk from './multi';

/**
 * Generate the parser multi token-based state machine
 * @param {Collections<string> & typeof tk} tokens
 */
export function init(tokens) {
	// Types of characters the URL can definitely end in
	const qsAccepting = tokens.domain.concat([
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

	// The universal starting state.
	const Start = new State();
	const Localpart = tt(Start, tk.TILDE); // Local part of the email address
	ta(Localpart, localpartAccepting, Localpart);
	ta(Localpart, tokens.domain, Localpart);

	const Domain = ta(Start, tokens.domain); // parsed string ends with a potential domain name (A)
	const Scheme = ta(Start, tokens.scheme); // e.g., 'mailto'
	const SlashScheme = ta(Start, tokens.slashscheme); // e.g., 'http'

	ta(Domain, localpartAccepting, Localpart);
	ta(Domain, tokens.domain, Domain);

	const LocalpartAt = tt(Domain, tk.AT); // Local part of the email address plus @

	tt(Localpart, tk.AT, LocalpartAt); // close to an email address now

	const LocalpartDot = tt(Localpart, tk.DOT); // Local part of the email address plus '.' (localpart cannot end in .)
	ta(LocalpartDot, localpartAccepting, Localpart);
	ta(LocalpartDot, tokens.domain, Localpart);

	const EmailDomain = ta(LocalpartAt, tokens.domain); // parsed string starts with local email info + @ with a potential domain name
	const EmailDomainDot = tt(EmailDomain, tk.DOT); // domain followed by DOT
	ta(EmailDomainDot, tokens.domain, EmailDomain);

	const Email = ta(EmailDomainDot, tokens.tld, mtk.Email); // Possible email address (could have more tlds)
	ta(EmailDomainDot, tokens.utld, Email);
	tt(LocalpartAt, tk.LOCALHOST, Email);

	// Hyphen can jump back to a domain name
	const EmailDomainHyphen = tt(EmailDomain, tk.HYPHEN); // parsed string starts with local email info + @ with a potential domain name
	ta(EmailDomainHyphen, tokens.domain, EmailDomain);
	ta(Email, tokens.domain, EmailDomain);
	tt(Email, tk.DOT, EmailDomainDot);
	tt(Email, tk.HYPHEN, EmailDomainHyphen);

	// Final possible email states
	const EmailColon = tt(Email, tk.COLON); // URL followed by colon (potential port number here)
	/*const EmailColonPort = */ta(EmailColon, tokens.numeric, mtk.Email); // URL followed by colon and port numner

	// Account for dots and hyphens. Hyphens are usually parts of domain names
	// (but not TLDs)
	const DomainHyphen = tt(Domain, tk.HYPHEN); // domain followed by hyphen
	const DomainDot = tt(Domain, tk.DOT); // domain followed by DOT
	ta(DomainHyphen, tokens.domain, Domain);
	ta(DomainDot, localpartAccepting, Localpart);
	ta(DomainDot, tokens.domain, Domain);

	const DomainDotTld = ta(DomainDot, tokens.tld, mtk.Url);   // Simplest possible URL with no query string
	ta(DomainDot, tokens.utld, DomainDotTld);
	ta(DomainDotTld, tokens.domain, Domain);
	ta(DomainDotTld, localpartAccepting, Localpart);
	tt(DomainDotTld, tk.DOT, DomainDot);
	tt(DomainDotTld, tk.HYPHEN, DomainHyphen);
	tt(DomainDotTld, tk.AT, LocalpartAt);

	const DomainDotTldColon = tt(DomainDotTld, tk.COLON); // URL followed by colon (potential port number here)
	const DomainDotTldColonPort = ta(DomainDotTldColon, tokens.numeric, mtk.Url); // TLD followed by a port number

	// Long URL with optional port and maybe query string
	const Url = new State(mtk.Url);

	// URL with extra symbols at the end, followed by an opening bracket
	const UrlNonaccept = new State(); // URL followed by some symbols (will not be part of the final URL)

	// Query strings
	ta(Url, qsAccepting, Url);
	ta(Url, qsNonAccepting, UrlNonaccept);
	ta(UrlNonaccept, qsAccepting, Url);
	ta(UrlNonaccept, qsNonAccepting, UrlNonaccept);

	// Become real URLs after `SLASH` or `COLON NUM SLASH`
	// Here works with or without scheme:// prefix
	tt(DomainDotTld, tk.SLASH, Url);
	tt(DomainDotTldColonPort, tk.SLASH, Url);

	// Note that domains that begin with schemes are treated slighly differently
	const UriPrefix = tt(Scheme, tk.COLON); // e.g., 'mailto:' or 'http://'
	const SlashSchemeColon = tt(SlashScheme, tk.COLON); // e.g., 'http:'
	const SlashSchemeColonSlash = tt(SlashSchemeColon, tk.SLASH); // e.g., 'http:/'

	tt(SlashSchemeColonSlash, tk.SLASH, UriPrefix);

	// Scheme states can transition to domain states
	ta(Scheme, tokens.domain, Domain);
	tt(Scheme, tk.DOT, DomainDot);
	tt(Scheme, tk.HYPHEN, DomainHyphen);
	ta(SlashScheme, tokens.domain, Domain);
	tt(SlashScheme, tk.DOT, DomainDot);
	tt(SlashScheme, tk.HYPHEN, DomainHyphen);

	// Force URL with scheme prefix followed by anything sane
	ta(UriPrefix, tokens.domain, Url);
	tt(UriPrefix, tk.SLASH, Url);

	// URL, followed by an opening bracket
	const UrlOpenbrace = tt(Url, tk.OPENBRACE); // URL followed by {
	const UrlOpenbracket = tt(Url, tk.OPENBRACKET); // URL followed by [
	const UrlOpenanglebracket = tt(Url, tk.OPENANGLEBRACKET); // URL followed by <
	const UrlOpenparen = tt(Url, tk.OPENPAREN); // URL followed by (

	tt(UrlNonaccept, tk.OPENBRACE, UrlOpenbrace);
	tt(UrlNonaccept, tk.OPENBRACKET, UrlOpenbracket);
	tt(UrlNonaccept, tk.OPENANGLEBRACKET, UrlOpenanglebracket);
	tt(UrlNonaccept, tk.OPENPAREN, UrlOpenparen);

	// Closing bracket component. This character WILL be included in the URL
	tt(UrlOpenbrace, tk.CLOSEBRACE, Url);
	tt(UrlOpenbracket, tk.CLOSEBRACKET, Url);
	tt(UrlOpenanglebracket, tk.CLOSEANGLEBRACKET, Url);
	tt(UrlOpenparen, tk.CLOSEPAREN, Url);
	tt(UrlOpenbrace, tk.CLOSEBRACE, Url);

	// URL that beings with an opening bracket, followed by a symbols.
	// Note that the final state can still be `UrlOpenbrace` (if the URL only
	// has a single opening bracket for some reason).
	const UrlOpenbraceQ = ta(UrlOpenbrace, qsAccepting, mtk.Url); // URL followed by { and some symbols that the URL can end it
	const UrlOpenbracketQ = ta(UrlOpenbracket, qsAccepting, mtk.Url); // URL followed by [ and some symbols that the URL can end it
	const UrlOpenanglebracketQ = ta(UrlOpenanglebracket, qsAccepting, mtk.Url); // URL followed by < and some symbols that the URL can end it
	const UrlOpenparenQ = ta(UrlOpenparen, qsAccepting, mtk.Url); // URL followed by ( and some symbols that the URL can end it

	const UrlOpenbraceSyms = ta(UrlOpenbrace, qsNonAccepting); // UrlOpenbrace followed by some symbols it cannot end it
	const UrlOpenbracketSyms = ta(UrlOpenbracket, qsNonAccepting); // UrlOpenbracketQ followed by some symbols it cannot end it
	const UrlOpenanglebracketSyms = ta(UrlOpenanglebracket, qsNonAccepting); // UrlOpenanglebracketQ followed by some symbols it cannot end it
	const UrlOpenparenSyms = ta(UrlOpenparen, qsNonAccepting); // UrlOpenparenQ followed by some symbols it cannot end it

	// URL that begins with an opening bracket, followed by some symbols
	ta(UrlOpenbraceQ, qsAccepting, UrlOpenbraceQ);
	ta(UrlOpenbracketQ, qsAccepting, UrlOpenbracketQ);
	ta(UrlOpenanglebracketQ, qsAccepting, UrlOpenanglebracketQ);
	ta(UrlOpenparenQ, qsAccepting, UrlOpenparenQ);
	ta(UrlOpenbraceQ, qsNonAccepting, UrlOpenbraceQ);
	ta(UrlOpenbracketQ, qsNonAccepting, UrlOpenbracketQ);
	ta(UrlOpenanglebracketQ, qsNonAccepting, UrlOpenanglebracketQ);
	ta(UrlOpenparenQ, qsNonAccepting, UrlOpenparenQ);

	ta(UrlOpenbraceSyms, qsAccepting, UrlOpenbraceSyms);
	ta(UrlOpenbracketSyms, qsAccepting, UrlOpenbracketQ);
	ta(UrlOpenanglebracketSyms, qsAccepting, UrlOpenanglebracketQ);
	ta(UrlOpenparenSyms, qsAccepting, UrlOpenparenQ);
	ta(UrlOpenbraceSyms, qsNonAccepting, UrlOpenbraceSyms);
	ta(UrlOpenbracketSyms, qsNonAccepting, UrlOpenbracketSyms);
	ta(UrlOpenanglebracketSyms, qsNonAccepting, UrlOpenanglebracketSyms);
	ta(UrlOpenparenSyms, qsNonAccepting, UrlOpenparenSyms);

	// Close brace/bracket to become regular URL
	tt(UrlOpenbracketQ, tk.CLOSEBRACKET, Url);
	tt(UrlOpenanglebracketQ, tk.CLOSEANGLEBRACKET, Url);
	tt(UrlOpenparenQ, tk.CLOSEPAREN, Url);
	tt(UrlOpenbraceQ, tk.CLOSEBRACE, Url);
	tt(UrlOpenbracketSyms, tk.CLOSEBRACKET, Url);
	tt(UrlOpenanglebracketSyms, tk.CLOSEANGLEBRACKET, Url);
	tt(UrlOpenparenSyms, tk.CLOSEPAREN, Url);
	tt(UrlOpenbraceSyms, tk.CLOSEPAREN, Url);

	tt(Start, tk.LOCALHOST, DomainDotTld); // localhost is a valid URL state
	tt(Start, tk.NL, mtk.Nl); // single new line

	return { start: Start, tokens: tk };
}

/**
 * Run the parser state machine on a list of scanned string-based tokens to
 * create a list of multi tokens, each of which represents a URL, email address,
 * plain text, etc.
 *
 * @param {State<MultiToken>} start parser start state
 * @param {string} input the original input used to generate the given tokens
 * @param {Token[]} tokens list of scanned tokens
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

		while (cursor < len && !(secondState = state.go(tokens[cursor].t))) {
			// Starting tokens with nowhere to jump to.
			// Consider these to be just plain text
			textTokens.push(tokens[cursor++]);
		}

		while (cursor < len && (
			nextState = secondState || state.go(tokens[cursor].t))
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
				multis.push(initMultiToken(mtk.Text, input, textTokens));
				textTokens = [];
			}

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			multiLength -= sinceAccepts;

			// Create a new multitoken
			const Multi = latestAccepting.t;
			const subtokens = tokens.slice(cursor - multiLength, cursor);
			multis.push(initMultiToken(Multi, input, subtokens));
		}
	}

	// Finally close off the textTokens (if available)
	if (textTokens.length > 0) {
		multis.push(initMultiToken(mtk.Text, input, textTokens));
	}

	return multis;
}

export { mtk as tokens };

/**
 * Utility function for instantiating a new multitoken with all the relevant
 * fields during parsing.
 * @param {new (value: string, tokens: Token[]) => MultiToken} Multi class to instantiate
 * @param {string} input original input string
 * @param {Token[]} tokens consecutive tokens scanned from input string
 * @returns {MultiToken}
 */
function initMultiToken(Multi, input, tokens) {
	const startIdx = tokens[0].s;
	const endIdx = tokens[tokens.length - 1].e;
	const value = input.slice(startIdx, endIdx);
	return new Multi(value, tokens);
}
