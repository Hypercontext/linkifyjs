/**
	@module linkify
	@submodule scanner
*/
import BaseState from './base';

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
	test(character, charOrRegExp) {
		return character === charOrRegExp || (
			charOrRegExp instanceof RegExp && charOrRegExp.test(character)
		);
	}

}

export default CharacterState;
