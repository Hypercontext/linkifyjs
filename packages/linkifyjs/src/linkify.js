import { init as initScanner, run as runScanner, tokens as textTokens } from './scanner';
import { init as initParser, run as runParser, tokens as multiTokens } from './parser';
import { Options } from './options';

const warn = typeof console !== 'undefined' && console && console.warn || (() => {});

// Side-effect initialization state
const INIT = {
	scanner: null,
	parser: null,
	pluginQueue: [],
	customSchemes: [],
	initialized: false,
};

export const scanner = Object.freeze({ tokens: textTokens });
export const parser = Object.freeze({ tokens: multiTokens });

/**
 * @typedef {(arg: {
 * 	scanner: { start: State<string> } & typeof scanner,
 * 	parser: { start: State<MultiToken> } & typeof parser
 * }) => void} Plugin
 */

/**
 * De-register all plugins and reset the internal state-machine. Used for
 * testing; not required in practice.
 * @private
 */
export function reset() {
	INIT.scanner = null;
	INIT.parser = null;
	INIT.pluginQueue = [];
	INIT.customSchemes = [];
	INIT.initialized = false;
}

/**
 * Register a linkify extension plugin
 * @param {string} name of plugin to register
 * @param {Plugin} plugin function that accepts mutable linkify state
 */
export function registerPlugin(name, plugin) {
	if (typeof plugin !== 'function') { throw new Error(`linkifyjs: Invalid plugin ${plugin} (expects function)`); }
	for (let i = 0; i < INIT.pluginQueue.length; i++) {
		if (name === INIT.pluginQueue[i][0]) {
			warn(`linkifyjs: plugin "${name}" already registered - will be overwritten`);
			INIT.pluginQueue[i] = [name, plugin];
			return;
		}
	}
	INIT.pluginQueue.push([name, plugin]);
	if (INIT.initialized) {
		warn(`linkifyjs: already initialized - will not register plugin "${name}" until you manually call linkify.init(). To avoid this warning, please register all plugins before invoking linkify the first time.`);
	}
}

/**
 * Detect URLs with the following additional protocol. Anything with format
 * "protocol://..." will be considered a link. If `optionalSlashSlash` is set to
 * `true`, anything with format "protocol:..." will be considered a link.
 * @param {string} protocol
 * @param {boolean} [optionalSlashSlash]
 */
export function registerCustomProtocol(protocol, optionalSlashSlash = false) {
	if (INIT.initialized) {
		warn(`linkifyjs: already initialized - will not register custom protocol "${protocol}" until you manually call linkify.init(). To avoid this warning, please register all custom schemes before invoking linkify the first time.`);
	}
	if (!/^[a-z]+(-[a-z]+)*$/.test(protocol)) {
		throw new Error('linkifyjs: incorrect protocol format.\n 1. Must only contain lowercase ASCII letters or -\n 2. Cannot start or end with -\n 3. - cannot repeat');
	}
	INIT.customSchemes.push([protocol, optionalSlashSlash]);
}

/**
 * Initialize the linkify state machine. Called automatically the first time
 * linkify is called on a string, but may be called manually as well.
 */
export function init() {
	// Initialize state machines
	INIT.scanner = { start: initScanner(INIT.customSchemes), tokens: textTokens };
	INIT.parser = { start: initParser(), tokens: multiTokens };

	// Initialize plugins
	for (let i = 0; i < INIT.pluginQueue.length; i++) {
		INIT.pluginQueue[i][1]({
			scanner: INIT.scanner,
			parser: INIT.parser,
		});
	}
	INIT.initialized = true;
}

/**
 * Parse a string into tokens that represent linkable and non-linkable sub-components
 * @param {string} str
 * @return {MultiToken[]} tokens
 */
export function tokenize(str) {
	if (!INIT.initialized) { init(); }
	return runParser(INIT.parser.start, str, runScanner(INIT.scanner.start, str));
}

/**
 * Find a list of linkable items in the given string.
 * @param {string} str string to find links in
 * @param {string} [type] only find links of a specific type, e.g., 'url' or 'email'
 * @param {Opts} [opts] formatting options for final output
*/
export function find(str, type = null, opts = null) {
	const options = new Options(opts);
	const tokens = tokenize(str);
	const filtered = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.isLink && (!type || token.t === type)) {
			filtered.push(token.toFormattedObject(options));
		}
	}

	return filtered;
}

/**
 * Is the given string valid linkable text of some sort. Note that this does not
 * trim the text for you.
 *
 * Optionally pass in a second `type` param, which is the type of link to test
 * for.
 *
 * For example,
 *
 *     linkify.test(str, 'email');
 *
 * Returns `true` if str is a valid email.
 * @param {string} str string to test for links
 * @param {string} [type] optional specific link type to look for
 * @returns boolean true/false
 */
export function test(str, type = null) {
	const tokens = tokenize(str);
	return tokens.length === 1 && tokens[0].isLink && (
		!type || tokens[0].t === type
	);
}

export * as options from './options';
export * as regexp from './regexp';
export { registerToken, stringToArray } from './text';
export { MultiToken, createTokenClass } from './multi';
export { State } from './fsm';
export { Options };
