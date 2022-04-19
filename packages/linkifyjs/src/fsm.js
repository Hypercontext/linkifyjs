/**
 * Finite State Machine generation utilities
 */
import assign from './assign';

/**
 * @template T
 * @typedef {{ [collection: string]: T[] }} Collections
 */

// Keys in scanner Collections instances
export const numeric = 'numeric';
export const ascii = 'ascii';
export const alpha = 'alpha';
export const asciinumeric = 'asciinumeric';
export const alphanumeric = 'alphanumeric';
export const domain = 'domain';
export const emoji = 'emoji';
export const tld = 'tld';
export const utld = 'utld';
export const scheme = 'scheme';
export const slashscheme = 'slashscheme';
export const whitespace = 'whitespace';

/**
 * @template T
 * @param {string} name
 * @param {Collections<T>} collections to register in
 * @returns {T[]} Current list of tokens in the given collection
 */
function registerCollection(name, collections) {
	if (!(name in collections)) {
		collections[name] = [];
	}
	return collections[name];
}

/**
 * @template T
 * @param {T} t token to add
 * @param {string[]} collectionNames
 * @param {Collections<T>} collections
 * @returns {string[]} final list of collections for the given token
 */
function addToCollections(t, collectionNames, collections) {
	const flags = collectionNames.reduce((f, k) => f[k] = true && f, {});
	if (flags[numeric]) {
		flags[asciinumeric] = true;
		flags[alphanumeric] = true;
	}
	if (flags[ascii]) {
		flags[asciinumeric] = true;
		flags[alpha] = true;
	}
	if (flags[asciinumeric]) {
		flags[alphanumeric] = true;
	}
	if (flags[alpha]) {
		flags[alphanumeric] = true;
	}
	if (flags[alphanumeric]) {
		flags[domain] = true;
	}
	if (flags[emoji]) {
		flags[domain] = true;
	}

	collectionNames = [];
	for (const k in flags) {
		collectionNames.push(k);
		const collection = registerCollection(k, collections);
		if (collection.indexOf(t) < 0) { collection.push(t); }
	}

	return collectionNames;
}

/**
 * @template T
 * @param {T} t token to check
 * @param {Collections<T>} collections
 * @returns {string[]} collection names that contain this token
 */
function collectionNamesForToken(t, collections) {
	const result = [];
	for (const c in collections) {
		const coll = collections[c];
		if (coll instanceof Array && coll.indexOf(t) >= 0) {
			result.push(c);
		}
	}
	return result;
}

/**
 * @template T
 * @typedef {null | T | [T, string[]]} Transition
 */

/**
 * @template T
 * @param {Transition<T>} next
 */
function toTokenAndCollections(next) {
	return next instanceof Array ? { t: next[0], c: next[1] } : { t: next, c: [] };
}

/**
 * Define a basic state machine state. j is the list of character transitions,
 * jr is the list of regex-match transitions, jd is the default state to
 * transition to t is the accepting token type, if any. If this is the terminal
 * state, then it does not emit a token.
 *
 * The template type T represents the type of the token this state accepts. This
 * should be a string (such as of the token exports in `text.js`) or a
 * MultiToken subclass (from `multi.js`)
 *
 * @template T
 * @param {T} [token] Token that this state emits
 */
export function State(token = null) {
	// this.n = null; // DEBUG: State name
	/** @type {{ [input: string]: State<T> }} j */
	this.j = {}; // IMPLEMENTATION 1
	// this.j = []; // IMPLEMENTATION 2
	/** @type {[RegExp, State<T>][]} jr */
	this.jr = [];
	/** @type {?State<T>} jd */
	this.jd = null;
	/** @type {?T} t */
	this.t = token;
}

State.prototype = {
	accepts() {
		return !!this.t;
	},

	/**
	 * Follow an existing transition from the given input to the next state.
	 * Does not mutate.
	 * @param {string} input character or token type to transition on
	 * @returns {?State<T>} the next state, if any
	 */
	go(input) {
		const state = this;
		const nextState  = state.j[input];
		if (nextState) { return nextState; }

		for (let i = 0; i < state.jr.length; i++) {
			const regex = state.jr[i][0];
			const nextState = state.jr[i][1];  // note: might be empty to prevent default jump
			if (nextState && regex.test(input)) { return nextState; }
		}
		// Nowhere left to jump! Return default, if any
		return state.jd;
	},

	/**
	 * Whether the state has a transition for the given input. Set the second
	 * argument to true to only look for an exact match (and not a default or
	 * regular-expression-based transition)
	 * @param {string} input
	 * @param {boolean} exactOnly
	 */
	has(input, exactOnly = false) {
		return exactOnly ? input in this.j : !!this.go(input);
	},

	/**
	 * Short for "transition all"; create a transition from the array of items
	 * in the given list to the same final resulting state.
	 * @param {string | string[]} inputs Group of inputs to transition on
	 * @param {Transition<T> | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of token collections
	 */
	ta(inputs, next = null, collections = {}) {
		for (let i = 0; i < inputs.length; i++) {
			this.tt(inputs[i], next, collections);
		}
	},

	/**
	 * Short for "take regexp transition"; defines a transition for this state
	 * when it encounters a token which matches the given regular expression
	 * @param {RegExp} regexp Regular expression transition (populate first)
	 * @param {Transition<T> | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of token collections
	 * @returns {State<T>} taken after the given input
	 */
	tr(regexp, next = null, collections = {}) {
		let nextState;
		if (next instanceof State) {
			nextState = next;
		} else if (next) {
			// Token with maybe collections
			let { t, c } = toTokenAndCollections(next);
			nextState = new State(t);
			addToCollections(t, c, collections);
		} else {
			nextState = new State();
		}
		this.jr.push([regexp, nextState]);
		return nextState;
	},

	/**
	 * Short for "take transitions", will take as many sequential transitions as
	 * the length of the given input and returns the
	 * resulting final state.
	 * @param {string | string[]} input
	 * @param {Transition<T> | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of token collections
	 * @returns {State<T>} taken after the given input
	 */
	ts(input, next, collections = {}) {
		let state = this;
		const len = input.length;
		if (!len) { return state; }
		for (let i = 0; i < len - 1; i++) {
			state = state.tt(input[i]);
		}
		return state.tt(input[len - 1], next, collections);
	},

	/**
	 * Short for "take transition", this is a method for building/working with
	 * state machines.
	 *
	 * If a state already exists for the given input, returns it.
	 *
	 * If a token is specified, that state will emit that token when reached by
	 * the linkify engine.
	 *
	 * If no state exists, it will be initialized with some default transitions
	 * that resemble existing default transitions.
	 *
	 * If a state is given for the second argument, that state will be
	 * transitioned to on the given input regardless of what that input
	 * previously did.
	 *
	 * Specify a collections list along with tokens to define groups that this
	 * token belongs to. The token will be added to corresponding entires in the
	 * given collections object.
	 *
	 * @param {string} input character, token type to transition on
	 * @param {Transition<T> | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of collections; not
	 * required for most plugins.
	 * @returns {State<T>} taken after the given input
	 */
	tt(input, next = null, collections = {}) {
		const state = this;

		// Check if existing state given, just a basic transition
		if (next instanceof State) {
			state.j[input] = next;
			return next;
		}

		let { t, c } = toTokenAndCollections(next); // Known token or null

		// // Check for existing easy (non-regex) transition
		// const existingState = state.j[input];
		// if (existingState && existingState.t) {
		// 	// Don't overwrite
		// 	if (c.length > 0) { addToCollections(existingState.t, c, collections); }
		// 	return existingState;
		// }

		// Take the transition with the usual default mechanisms and use that as
		// a template for creating the next state
		let nextState, templateState = state.go(input);
		if (templateState) {
			nextState = new State();
			assign(nextState.j, templateState.j);
			nextState.jr.push.apply(nextState.jr, templateState.jr);
			nextState.jd = templateState.jd;
			nextState.t = templateState.t;
		} else {
			nextState = new State();
		}

		if (t) {
			// Ensure newly token is in the same collections as the old token
			if (nextState.t) {
				c = c.concat(collectionNamesForToken(nextState.t, collections));
			}
			nextState.t = t; // overwrite anything that was previously there
			addToCollections(t, c, collections);
		}

		state.j[input] = nextState;
		return nextState;
	}
};

// Helper functions to improve minification (not exported outside linkifyjs module)

/**
 * @template T
 * @param {State<T>} state
 * @param {string | string[]} input
 * @param {Transition<T> | State<T>} [next]
 * @param {{ [collection: string]: T[] }} [collections]
 */
 export const ta = (state, input, next, collections) => state.ta(input, next, collections);

/**
 * @template T
 * @param {State<T>} state
 * @param {RegExp} regexp
 * @param {Transition<T> | State<T>} [next]
 * @param {{ [collection: string]: T[] }} [collections]
 */
export const tr = (state, regexp, next, collections) => state.tr(regexp, next, collections);

/**
 * @template T
 * @param {State<T>} state
 * @param {string | string[]} input
 * @param {Transition<T> | State<T>} [next]
 * @param {{ [collection: string]: T[] }} [collections]
 */
export const ts = (state, input, next, collections) => state.ts(input, next, collections);

/**
 * @template T
 * @param {State<T>} state
 * @param {string} input
 * @param {Transition<T> | State<T>} [next]
 * @param {{ [collection: string]: T[] }} [collections]
 */
export const tt = (state, input, next, collections) => state.tt(input, next, collections);
