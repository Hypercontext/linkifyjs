/**
 * Finite State Machine generation utilities
 */
import assign from './assign';

/**
 * @template T
 * @typedef {{ [collection: string]: T[] }} Collections
 */

/**
 * @typedef {{ [collection: string]: true }} Flags
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
 * @param {Collections<T>} collections
 * @param {Flags} flags
 */
export function addToCollections(t, collections, flags) {
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

	for (const k in flags) {
		const collection = registerCollection(k, collections);
		if (collection.indexOf(t) < 0) { collection.push(t); }
	}
}

/**
 * @template T
 * @param {T} t token to check
 * @param {Collections<T>} collections
 * @returns {Flags} collection flags that contain this token
 */
function collectionFlagsForToken(t, collections) {
	const result = {};
	for (const c in collections) {
		if (collections[c].indexOf(t) >= 0) {
			result[c] = true;
		}
	}
	return result;
}

/**
 * @template T
 * @typedef {null | T } Transition
 */

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
	 * @param {Collections<T>} [collections] Master list of collections
	 * @param {Flags} [flags] Collections flags to add token to
	 */
	ta(inputs, next, collections, flags) {
		for (let i = 0; i < inputs.length; i++) {
			this.tt(inputs[i], next, collections, flags);
		}
	},

	/**
	 * Short for "take regexp transition"; defines a transition for this state
	 * when it encounters a token which matches the given regular expression
	 * @param {RegExp} regexp Regular expression transition (populate first)
	 * @param {T | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of collections
	 * @param {Flags} [flags] Collections flags to add token to
	 * @returns {State<T>} taken after the given input
	 */
	tr(regexp, next, collections, flags) {
		let nextState;
		if (next && next.j) {
			nextState = next;
		} else {
			// Token with maybe collections
			nextState = new State(next);
			if (collections && flags) {
				addToCollections(next, collections, flags);
			}
		}
		this.jr.push([regexp, nextState]);
		return nextState;
	},

	/**
	 * Short for "take transitions", will take as many sequential transitions as
	 * the length of the given input and returns the
	 * resulting final state.
	 * @param {string | string[]} input
	 * @param {T | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of collections
	 * @param {Flags} [flags] Collections flags to add token to
	 * @returns {State<T>} taken after the given input
	 */
	ts(input, next, collections, flags) {
		let state = this;
		const len = input.length;
		if (!len) { return state; }
		for (let i = 0; i < len - 1; i++) {
			state = state.tt(input[i]);
		}
		return state.tt(input[len - 1], next, collections, flags);
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
	 * @param {T | State<T>} [next] Transition options
	 * @param {Collections<T>} [collections] Master list of collections
	 * @param {Flags} [flags] Collections flags to add token to
	 * @returns {State<T>} taken after the given input
	 */
	tt(input, next, collections, flags) {
		const state = this;

		// Check if existing state given, just a basic transition
		if (next && next.j) {
			state.j[input] = next;
			return next;
		}

		const t = next;

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
			if (collections) {
				if (nextState.t) {
					const allFlags = assign(collectionFlagsForToken(nextState.t, collections), flags);
					addToCollections(t, collections, allFlags);
				} else if (flags) {
					addToCollections(t, collections, flags);
				}
			}
			nextState.t = t; // overwrite anything that was previously there
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
 * @param {Collections<T>} [collections]
 * @param {Flags} [flags]
 */
 export const ta = (state, input, next, collections, flags) => state.ta(input, next, collections, flags);

/**
 * @template T
 * @param {State<T>} state
 * @param {RegExp} regexp
 * @param {T | State<T>} [next]
 * @param {Collections<T>} [collections]
 * @param {Flags} [flags]
 */
export const tr = (state, regexp, next, collections, flags) => state.tr(regexp, next, collections, flags);

/**
 * @template T
 * @param {State<T>} state
 * @param {string | string[]} input
 * @param {T | State<T>} [next]
 * @param {Collections<T>} [collections]
 * @param {Flags} [flags]
 */
export const ts = (state, input, next, collections, flags) => state.ts(input, next, collections, flags);

/**
 * @template T
 * @param {State<T>} state
 * @param {string} input
 * @param {T | State<T>} [next]
 * @param {Collections<T>} [collections]
 * @param {Flags} [flags]
 */
export const tt = (state, input, next, collections, flags) => state.tt(input, next, collections, flags);
