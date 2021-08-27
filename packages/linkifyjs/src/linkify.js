import * as scanner from './core/scanner';
import * as parser from './core/parser';

const warn = typeof console !== 'undefined' && console && console.warn || (() => {});

// Side-effect initialization state
const INIT = {
	scanner: null,
	parser: null,
	pluginQueue: [],
	customProtocols: [],
	initialized: false,
};

/**
 * De-register all plugins and reset the internal state-machine. Used for
 * testing; not required in practice.
 * @private
 */
export function reset() {
	INIT.scanner = null;
	INIT.parser = null;
	INIT.pluginQueue = [];
	INIT.customProtocols = [];
	INIT.initialized = false;
}

/**
 * Register a linkify extension plugin
 * @param {string} name of plugin to register
 * @param {Function} plugin function that accepts mutable linkify state
 */
export function registerPlugin(name, plugin) {
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
 * Detect URLs with the following additional protocol. Anything following
 * "protocol:" will be considered a link.
 * @param {string} protocol
 */
export function registerCustomProtocol(protocol) {
	if (INIT.initialized) {
		warn(`linkifyjs: already initialized - will not register custom protocol "${protocol}" until you manually call linkify.init(). To avoid this warning, please register all custom protocols before invoking linkify the first time.`);
	}
	if (!/^[a-z-]+$/.test(protocol)) {
		throw Error('linkifyjs: protocols containing characters other than a-z or - (hyphen) are not supported');
	}
	INIT.customProtocols.push(protocol);
}

/**
 * Initialize the linkify state machine. Called automatically the first time
 * linkify is called on a string, but may be called manually as well.
 */
export function init() {
	// Initialize state machines
	INIT.scanner = { start: scanner.init(INIT.customProtocols), tokens: scanner.tokens };
	INIT.parser = { start: parser.init(), tokens: parser.tokens };
	const utils = { createTokenClass: parser.tokens.createTokenClass };

	// Initialize plugins
	for (let i = 0; i < INIT.pluginQueue.length; i++) {
		INIT.pluginQueue[i][1]({
			scanner: INIT.scanner,
			parser: INIT.parser,
			utils
		});
	}
	INIT.initialized = true;
}

/**
	Parse a string into tokens that represent linkable and non-linkable sub-components
	@param {string} str
	@return {MultiToken[]} tokens
*/
export function tokenize(str) {
	if (!INIT.initialized) { init(); }
	return parser.run(INIT.parser.start, str, scanner.run(INIT.scanner.start, str));
}

/**
	Find a list of linkable items in the given string.
	@param {string} str string to find links in
	@param {string} [type] (optional) only find links of a specific type, e.g.,
	'url' or 'email'
*/
export function find(str, type = null) {
	const tokens = tokenize(str);
	const filtered = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.isLink && (!type || token.t === type)) {
			filtered.push(token.toObject());
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

export * as options from './core/options';
export { Options } from './core/options';
