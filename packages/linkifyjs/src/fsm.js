/**
 * Finite State Machine generation utilities
 */
import assign from './assign';

/**
 * Define a basic state machine state. j is the list of character transitions,
 * jr is the list of regex-match transitions, jd is the default state to
 * transition to t is the accepting token type, if any. If this is the terminal
 * state, then it does not emit a token.
 *
 * The template type T represents the type of the token this state accepts. This
 * should be either one of the token exports in text.js or a MultiToken subclass
 * from multi.js
 *
 * @template T
 * @param {T} [token] Token that this state emits
 */
export function State(token = null) {
	// this.n = null; // DEBUG: State name
	/** @type {{ [token: string]: State<T> }} j */
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
	 * @param {string | string[]} input character, token type or collection to transition on
	 * @param {T | State<T>} [tokenOrState] transition to a matching state
	 * @returns {State<T>} taken after the given input
	 */
	tt(input, tokenOrState = null) {
		if (input instanceof Array) {
			// Recursive case
			if (input.length === 0) { return; }
			const nextState = this.tt(input[0], tokenOrState);
			for (let i = 1; i < input.length; i++) {
				this.tt(input[i], nextState);
			}
			return nextState;
		}

		if (tokenOrState && tokenOrState instanceof State) {
			// State, default a basic transition
			this.j[input] = tokenOrState;
			return tokenOrState;
		}

		// See if there's a direct state transition (not regex or default)
		const token = tokenOrState;
		let nextState = this.j[input];
		if (nextState) {
			if (token) { nextState.t = token; } // overrwites previous token
			return nextState;
		}

		// Create a new state for this input
		nextState = makeState();

		// Take the transition using the usual default mechanisms
		const templateState = takeT(this, input);
		if (templateState) {
			// Some default state transition, make a prime state based on this one
			assign(nextState.j, templateState.j);
			nextState.jr.append(templateState.jr);
			nextState.jr = templateState.jd;
			nextState.t = token || templateState.t;
		} else {
			nextState.t = token;
		}

		this.j[input] = nextState;
		return nextState;
	},
};

/**
 * Utility function to create state without using new keyword (reduced file size
 * when minified)
 */
export const makeState = (/*name*/) => {
	const s = new State();
	// if (name) { s.n = name; } // DEBUG
	return s;
};

/**
 * Similar to previous except it is an accepting state that emits a token
 * @template T
 * @param {T} token
 */
export const makeAcceptingState = (token/*, name*/) => {
	const s = new State(token);
	// if (name) { s.n = name; } // DEBUG
	return s;
};

/**
 * Create a transition from startState to nextState via the given character
 * @param {State} startState transition from thie starting state
 * @param {string} input via this input character or other concrete token type
 * @param {State} nextState to this next state
 * @return {State}
 */
export const makeT = (startState, input, nextState) => {
	// IMPLEMENTATION 1: Add to object (fast)
	if (!startState.j[input]) { startState.j[input] = nextState; }

	// IMPLEMENTATION 2: Add to array (slower)
	// startState.j.push([input, nextState]);
	return startState.j[input];
};

/**
 * @param {State} startState stransition from this starting state
 * @param {RegExp} regex Regular expression to match on input
 * @param {State} nextState transition to this next state if there's are regex match
 */
export const makeRegexT = (startState, regex, nextState) => {
	startState.jr.push([regex, nextState]);
};

/**
 * Follow the transition from the given character to the next state
 * @param {State} state
 * @param {string} input character or other concrete token type to transition
 * @returns {?State} the next state, if any
 */
export const takeT = (state, input) => {
	// IMPLEMENTATION 1: Object key lookup (faster)
	const nextState  = state.j[input];
	if (nextState) { return nextState; }

	// IMPLEMENTATION 2: List lookup (slower)
	// Loop through all the state transitions and see if there's a match
	// for (let i = 0; i < state.j.length; i++) {
	//	const val = state.j[i][0];
	//	const nextState = state.j[i][1];
	// 	if (input === val) { return nextState; }
	// }

	for (let i = 0; i < state.jr.length; i++) {
		const regex = state.jr[i][0];
		const nextState = state.jr[i][1];  // note: might be empty to prevent default jump
		if (nextState && regex.test(input)) { return nextState; }
	}
	// Nowhere left to jump! Return default, if any
	return state.jd;
};

/**
 * Similar to makeT, but takes a list of characters that all transition to the
 * same nextState startState
 * @param {State} startState
 * @param {string[]} chars
 * @param {State} nextState
 */
export const makeMultiT = (startState, chars, nextState) => {
	for (let i = 0; i < chars.length; i++) {
		makeT(startState, chars[i], nextState);
	}
};

/**
 * Set up a list of multiple transitions at once. transitions is a list of
 * tuples, where the first element is the transitions character and the second
 * is the state to transition to
 * @param {State} startState
 * @param {[string, State][]} transitions
 */
export const makeBatchT = (startState, transitions) => {
	for (let i = 0; i < transitions.length; i++) {
		const input = transitions[i][0];
		const nextState = transitions[i][1];
		// if (!nextState.n && typeof input === 'string') { nextState.n = input; } // DEBUG
		makeT(startState, input, nextState);
	}
};

/**
 * For state machines that transition on characters only; given a non-empty
 * target string, generates states (if required) for each consecutive substring
 * of characters starting from the beginning of the string. The final state will
 * have a special value, as specified in options. All other "in between"
 * substrings will have a default end state.
 *
 * This turns the state machine into a Trie-like data structure (rather than a
 * intelligently-designed DFA).
 * @param {State} state
 * @param {string} str
 * @param {State} endState
 * @param {() => State} defaultStateFactory
 * @return {State} the final state
 */
export const makeChainT = (state, str, endState, defaultStateFactory) => {
	let i = 0, len = str.length, nextState;

	// Find the next state without a jump to the next character
	while (i < len && (nextState = state.j[str[i]])) {
		state = nextState;
		i++;
	}

	if (i >= len) { return state; } // no new tokens were added

	while (i < len - 1) {
		nextState = defaultStateFactory();
		makeT(state, str[i], nextState);
		state = nextState;
		i++;
	}

	makeT(state, str[len - 1], endState);
	// if (!endState.n) { endState.n === str; } // DEBUG
	return endState;
};
