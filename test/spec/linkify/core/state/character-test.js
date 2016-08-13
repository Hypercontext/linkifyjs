const TEXT_TOKENS = require(`${__base}linkify/core/tokens`).text;
const CharacterState = require(`${__base}linkify/core/state`).CharacterState;

describe('linkify/core/state/CharacterState', () => {
	var S_START, S_DOT, S_NUM;

	before(() => {
		S_START = new CharacterState();
		S_DOT = new CharacterState(TEXT_TOKENS.DOT);
		S_NUM = new CharacterState(TEXT_TOKENS.NUM);
	});

	describe('#next()', () => {
		it('Has no jumps and return null', () => {
			expect(S_START.j.length).to.eql(0);
			expect(S_START.next('.')).to.not.be.ok;
		});

		it('Should return an new state for the ":" character', () => {
			S_START.on('.', S_DOT);
			S_START.on(/[0-9]/, S_NUM);

			var results = [
				S_START.next('.'),
				S_START.next('7'),
			];

			expect(S_START.j.length).to.eql(2);

			results.map(function (result) {
				expect(result).to.be.ok;
				expect(result).to.be.an.instanceof(CharacterState);
			});

			expect(results[0]).to.be.eql(S_DOT);
			expect(results[1]).to.be.eql(S_NUM);
		});

		it('Can return itself (has recursion)', () => {
			S_NUM.on(/[0-9]/, S_NUM);
			expect(S_NUM.next('8')).to.be.eql(S_NUM);
			expect(S_NUM.next('0').next('4')).to.be.eql(S_NUM);
		});
	});

	describe('#emit()', () => {
		it('Should return a falsey value if initalized with no token', () => {
			expect((!S_START.emit())).to.be.ok;
		});

		it('Should return the token it was initialized with', () => {
			var state = new CharacterState(TEXT_TOKENS.QUERY);
			expect(state.emit()).to.be.eql(TEXT_TOKENS.QUERY);
		});
	});

	describe('#test()', () => {
		it('Ensures characters match the given token or regexp', () => {
			expect(S_START.test('a', 'a')).to.be.ok;
			expect(S_START.test('a', 'b')).to.not.be.ok;
			expect(S_START.test('b', /[a-z]/)).to.be.ok;
			expect(S_START.test('\n', /[^\S\n]/)).to.not.be.ok;
		});
	});
});
