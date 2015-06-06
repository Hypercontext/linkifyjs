/*jshint -W030 */
var
TEXT_TOKENS = require('../../../../../lib/linkify/core/tokens').text,
CharacterState = require('../../../../../lib/linkify/core/state').CharacterState;

describe('linkify/core/state/CharacterState', function () {
	var S_START, S_DOT, S_NUM;

	before(function () {
		S_START = new CharacterState();
		S_DOT = new CharacterState(TEXT_TOKENS.DOT);
		S_NUM = new CharacterState(TEXT_TOKENS.NUM);
	});

	describe('#next()', function () {

		it('Has no jumps and return null', function () {
			S_START.j.length.should.eql(0);
			S_START.next('.').should.not.be.ok;
		});

		it('Should return an new state for the ":" character', function () {
			S_START.on('.', S_DOT);
			S_START.on(/[0-9]/, S_NUM);

			var results = [
				S_START.next('.'),
				S_START.next('7'),
			];

			S_START.j.length.should.eql(2);

			results.map(function (result) {
				result.should.be.ok;
				result.should.be.an.instanceOf(CharacterState);
			});

			results[0].should.be.eql(S_DOT);
			results[1].should.be.eql(S_NUM);
		});

		it('Can return itself (has recursion)', function () {
			S_NUM.on(/[0-9]/, S_NUM);
			S_NUM.next('8').should.be.eql(S_NUM);
			S_NUM.next('0').next('4').should.be.eql(S_NUM);
		});
	});

	describe('#emit()', function () {
		it('Should return a falsey value if initalized with no token', function () {
			(!S_START.emit()).should.be.ok;
		});

		it('Should return the token it was initialized with', function () {
			var state = new CharacterState(TEXT_TOKENS.QUERY);
			state.emit().should.be.eql(TEXT_TOKENS.QUERY);
		});
	});

	describe('#test()', function () {
		it('Ensures characters match the given token or regexp', function () {
			S_START.test('a', 'a').should.be.ok;
			S_START.test('a', 'b').should.not.be.ok;
			S_START.test('b', /[a-z]/).should.be.ok;
			S_START.test('\n', /[^\S\n]/).should.not.be.ok;
		});
	});
});
