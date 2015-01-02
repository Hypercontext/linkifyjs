/**
	@module linkify
	@submodule scanner
*/
let BaseState = require('../state/base');

/**
	Subclass of
	@class CharacterState
	@extends BaseState
*/
class CharacterState extends BaseState {

	/**
		Does the given character match the given character or regular
		expression?

		@method test
		@param {String} char
		@param {String|RegExp} charOrRegExp
		@return {Boolean}
	*/
	test(char, charOrRegExp) {
		return char === charOrRegExp || (
			charOrRegExp instanceof RegExp && charOrRegExp.test(char)
		);
	}

}

module.exports = CharacterState;
