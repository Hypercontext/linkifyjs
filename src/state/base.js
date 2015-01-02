/**
	@module linkify
	@submodule state
*/

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
class BaseState {

	/**
		@method constructor
		@param {Class} tClass Pass in the kind of token to emit if there are
			no jumps after this state and the state is accepting.
	*/
	constructor(tClass) {
		this.j = [];
		this.T = tClass || null;
	}

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
			return;
		}
		this.j.push([symbol, state]);
	}

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
	}

	/**
		Does this state accept?
		`true` only of `this.T` exists

		@method accepts
		@return {Boolean}
	*/
	accepts() {
		return !!this.T;
	}

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
	}

	/**
		Emit the token for this State (just return it in this case)
		If this emits a token, this instance is an accepting state
		@method emit
		@return {Class} T
	*/
	emit() {
		return this.T;
	}
}

module.exports = BaseState;
