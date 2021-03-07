import * as options from './linkify/utils/options';
import * as scanner from './linkify/core/scanner';
import * as parser from './linkify/core/parser';

const warn = typeof console !== 'undefined' && console && console.warn || (() => {});

// Side-effect initialization state
export const INIT = {
	scanner: null,
	parser: null,
	pluginQueue: [],
	initialized: false,
};

/**
 * De-register all plugins. Used for testing; not required in practice
 */
export function reset() {
	INIT.scanner = null;
	INIT.parser = null;
	INIT.pluginQueue = [];
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
		warn(`linkifyjs: already initialized - will not register plugin "${name}" until you manually call linkify.init()`);
	}
}

/**
 * Initialize the linkify state machine. Called automatically the first time
 * linkify is called on a string, but may be called manually as well.
 */
export function init() {
	// Initialize state machines
	INIT.scanner = { start: scanner.init(), tokens: scanner.tokens };
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
	Converts a string into tokens that represent linkable and non-linkable bits
	@method tokenize
	@param {String} str
	@return {Array} tokens
*/
export function tokenize(str) {
	if (!INIT.initialized) { init(); }
	return parser.run(INIT.parser.start, scanner.run(INIT.scanner.start, str));
}

/**
	Returns a list of linkable items in the given string.
*/
export function find(str, type = null) {
	let tokens = tokenize(str);
	let filtered = [];

	for (var i = 0; i < tokens.length; i++) {
		let token = tokens[i];
		if (token.isLink && (!type || token.type === type)) {
			filtered.push(token.toObject());
		}
	}

	return filtered;
}

/**
	Is the given string valid linkable text of some sort
	Note that this does not trim the text for you.

	Optionally pass in a second `type` param, which is the type of link to test
	for.

	For example,

		test(str, 'email');

	Will return `true` if str is a valid email.
*/
export function test(str, type = null) {
	const tokens = tokenize(str);
	return tokens.length === 1 && tokens[0].isLink && (
		!type || tokens[0].t === type
	);
}

// Scanner and parser provide states and tokens for the lexicographic stage
// (will be used to add additional link types)
export { options };
