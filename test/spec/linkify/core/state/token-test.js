const TokenState = require(`${__base}linkify/core/state`).TokenState;
const tokens = require(`${__base}linkify/core/tokens`);
const TEXT_TOKENS = tokens.text;
const MULTI_TOKENS = tokens.multi;

describe('linkify/core/state/TokenState', function () {
	var S_START, state;

	beforeEach(function () {
		S_START = new TokenState();
	});

	describe('#jump', () => {
		context('when called on a state without prior transitions', () => {
			context('with just a text token', () => {
				it('returns a non-accepting state', () => {
					state = S_START.jump(TEXT_TOKENS.AT);
					expect(state).to.be.an.instanceof(TokenState);
				});

				it('does not emit anything', () => {
					state = S_START.jump(TEXT_TOKENS.AT);
					expect(state.emit()).to.not.be.ok;
				});
			});

			context('with a text token and a multi-token', () => {
				it('returns an accepting state', () => {
					state = S_START.jump(TEXT_TOKENS.LOCALHOST, MULTI_TOKENS.URL);
					expect(state).to.be.an.instanceof(TokenState);
				});

				it('returns an accepting state', () => {
					state = S_START.jump(TEXT_TOKENS.LOCALHOST, MULTI_TOKENS.URL);
					expect(state.emit()).to.equal(MULTI_TOKENS.URL);
				});
			});
		});

		context('when called on a state with prior set transitions', () => {
			var S_AT, S_LOCALHOST;

			beforeEach(() => {
				S_START = new TokenState();
				S_AT = new TokenState();
				S_LOCALHOST = new TokenState(); // No accepting transition yet
				S_START.t(TEXT_TOKENS.AT, S_AT);
				S_START.t(TEXT_TOKENS.LOCALHOST, S_LOCALHOST);
			});

			context('with just a text token', () => {
				it('returns an exisiting state', () => {
					state = S_START.jump(TEXT_TOKENS.AT);
					expect(state).to.equal(S_AT);
				});

				it('returns an non-accepting state', () => {
					state = S_START.jump(TEXT_TOKENS.AT);
					expect(state.accepts()).to.not.be.ok;
				});
			});

			context('with a text token and a multi-token', () => {
				it('returns an exisiting state', () => {
					state = S_START.jump(TEXT_TOKENS.LOCALHOST, MULTI_TOKENS.URL);
					expect(state).to.equal(S_LOCALHOST);
				});

				it('returns an accepting state', () => {
					state = S_START.jump(TEXT_TOKENS.LOCALHOST, MULTI_TOKENS.URL);
					expect(state.accepts()).to.be.ok;
					expect(state.emit()).to.equal(MULTI_TOKENS.URL);
				});
			});

		});
	});
});
