import inherits from '../utils/inherits';

function createStateClass() {
	return function (tClass) {
		this.j = [];
		this.T = tClass || null;
	};
}

/**
	A simple state machine that can emit token classes

	The `j` property in this class refers to state jumps. It's a
	multidimensional array where for each element:

	* index [0] is a symbol or class of symbols to transition to.
	* index [1] is a State instance which matches

	The type of symbol will depend on the target implementation for this class.
	In Linkify, we have a two-stage scanner. Each stage uses this state machine
	but with a slighly different (polymorphic) implementation.

	The `T` property refers to the token class.

	TODO: Can the `on` and `next` methods be combined?

	@class BaseState
*/
const BaseState = createStateClass();
BaseState.prototype = {
	/**
		@method constructor
		@param {Class} tClass Pass in the kind of token to emit if there are
			no jumps after this state and the state is accepting.
	*/

	/**
		On the given symbol(s), this machine should go to the given state

		@method on
		@param {Array|Mixed} symbol
		@param {BaseState} state Note that the type of this state should be the
			same as the current instance (i.e., don't pass in a different
			subclass)
	*/
	on(symbol, state) {
		if (symbol instanceof Array) {
			for (let i = 0; i < symbol.length; i++) {
				this.j.push([symbol[i], state]);
			}
			return this;
		}
		this.j.push([symbol, state]);
		return this;
	},

	/**
		Given the next item, returns next state for that item
		@method next
		@param {Mixed} item Should be an instance of the symbols handled by
			this particular machine.
		@return {State} state Returns false if no jumps are available
	*/
	next(item) {

		for (let i = 0; i < this.j.length; i++) {

			let jump = this.j[i],
			symbol = jump[0],	// Next item to check for
			state = jump[1];	// State to jump to if items match

			// compare item with symbol
			if (this.test(item, symbol)) return state;
		}

		// Nowhere left to jump!
		return false;
	},

	/**
		Does this state accept?
		`true` only of `this.T` exists

		@method accepts
		@return {Boolean}
	*/
	accepts() {
		return !!this.T;
	},

	/**
		Determine whether a given item "symbolizes" the symbol, where symbol is
		a class of items handled by this state machine.

		This method should be overriden in extended classes.

		@method test
		@param {Mixed} item Does this item match the given symbol?
		@param {Mixed} symbol
		@return {Boolean}
	*/
	test(item, symbol) {
		return item === symbol;
	},

	/**
		Emit the token for this State (just return it in this case)
		If this emits a token, this instance is an accepting state
		@method emit
		@return {Class} T
	*/
	emit() {
		return this.T;
	}
};

/**
	State machine for string-based input

	@class CharacterState
	@extends BaseState
*/
const CharacterState = inherits(BaseState, createStateClass(), {
	/**
		Does the given character match the given character or regular
		expression?

		@method test
		@param {String} char
		@param {String|RegExp} charOrRegExp
		@return {Boolean}
	*/
	test(character, charOrRegExp) {
		return character === charOrRegExp || (
			charOrRegExp instanceof RegExp && charOrRegExp.test(character)
		);
	}
});


/**
	State machine for input in the form of TextTokens

	@class TokenState
	@extends BaseState
*/
const TokenState = inherits(BaseState, createStateClass(), {

	/**
		Is the given token an instance of the given token class?

		@method test
		@param {TextToken} token
		@param {Class} tokenClass
		@return {Boolean}
	*/
	test(token, tokenClass) {
		return token instanceof tokenClass;
	}
});

/**
	Given a non-empty target string, generates states (if required) for each
	consecutive substring of characters in str starting from the beginning of
	the string. The final state will have a special value, as specified in
	options. All other "in between" substrings will have a default end state.

	This turns the state machine into a Trie-like data structure (rather than a
	intelligently-designed DFA).

	Note that I haven't really tried these with any strings other than
	DOMAIN.

	@param {String} str
	@param {CharacterState} start State to jump from the first character
	@param {Class} endToken Token class to emit when the given string has been
		matched and no more jumps exist.
	@param {Class} defaultToken "Filler token", or which token type to emit when
		we don't have a full match
	@return {Array} list of newly-created states
*/
function stateify(str, start, endToken, defaultToken) {

	let i = 0,
	len = str.length,
	state = start,
	newStates = [],
	nextState;

	// Find the next state without a jump to the next character
	while (i < len && (nextState = state.next(str[i]))) {
		state = nextState;
		i++;
	}

	if (i >= len) return []; // no new tokens were added

	while (i < len - 1) {
		nextState = new CharacterState(defaultToken);
		newStates.push(nextState);
		state.on(str[i], nextState);
		state = nextState;
		i++;
	}

	nextState = new CharacterState(endToken);
	newStates.push(nextState);
	state.on(str[len - 1], nextState);

	return newStates;
}

export {CharacterState, TokenState, stateify};
