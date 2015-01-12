/**
	@module linkify
	@submodule parser
*/
import BaseState from '../state/base';

/**
	Subclass of
	@class CharacterState
	@extends BaseState
*/
class TokenState extends BaseState {

	/**
		Is the given token an instance of the given token class?

		@method test
		@param {TextToken} token
		@param {Class} tokenClass
		@return {Boolean}
	*/
	test(token, tokenClass) {
		return tokenClass.test(token);
	}

}

export default TokenState;
