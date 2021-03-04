/**
 * Finite State Machine generation utilities
 */

/**
 * Define a basic state machine state. j is the list of character transitions,
 * jr is the list of regex-match transitions, jd is the default state to
 * transition to t is the accepting token type, if any. If this is the terminal
 * state, then it does not emit a token.
 */
export const makeState = () => ({ j: [], jr: [], jd: null, t: null });

/**
 * Similar to previous except it is an accepting state that emits a token
 * @param {Token} token
 */
export const makeAcceptingState = (token) => ({ j: [], jr: [], jd: null, t: token });

/**
 * Create a transition from startState to nextState via the given character
 * @param {State} startState transition from thie starting state
 * @param {Token} input via this input character or other concrete token type
 * @param {State} nextState to this next state
 */
export const makeT = (startState, input, nextState) => {
	startState.j.push([input, nextState]);
};

/**
 * Follow the transition from the given character to the next state
 * @param {State} state
 * @param {Token} input character or other concrete token type to transition
 * @returns {?State} the next state, if any
 */
export const t = (state, input) => {
	// Loop through all the state transitions and see if there's a match
	for (let i = 0; i < state.j.length; i++) {
		const [val, nextState] = state.j[i];
		if (input === val) { return nextState; }
	}
	// Nowhere left to jump! Return default, if any
	// TODO: Regex transitions for i18n?
	return state.jd;
};

/**
 * Similar to makeT, but takes a list of characters that all transition to the
 * same nextState startState
 * @param {State} startState
 * @param {Array} chars
 * @param {State} nextState
 */
export const makeMultiT = (startState, chars, nextState) => {
	for (let i = 0; i < chars.length; i++) {
		startState.j.push([chars[i], nextState]);
	}
};

/**
 * Set up a list of multiple transitions at once. transitions is a list of
 * tuples, where the first element is the transitions character and the second
 * is the state to transition to
 * @param {State} startState
 * @param {Array} transitions
 */
export const makeBatchT = (startState, transitions) => {
	startState.j.push.apply(startState.j, transitions);
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
 * @param {String} str
 * @param {Token} endToken
 * @param {Token} defaultToken
 */
export const makeChainT = (state, str, endToken, defaultToken) => {
	let i = 0, len = str.length, nextState;

	// Find the next state without a jump to the next character
	while (i < len && (nextState = t(state, str[i]))) {
		state = nextState;
		i++;
	}

	if (i >= len) { return []; } // no new tokens were added

	const newStates = [];
	while (i < len - 1) {
		nextState = makeAcceptingState(defaultToken);
		newStates.push(nextState);
		makeT(state, str[i], nextState);
		state = nextState;
		i++;
	}

	nextState = makeAcceptingState(endToken);
	newStates.push(nextState);
	makeT(state, str[len - 1], nextState);

	return newStates;
};

/**
 * Whether this is an accepting state
 * @param {State} state
 */
export const accepts = (state) => !!state.t;
