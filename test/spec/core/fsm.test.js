const { makeAcceptingState } = require('linkifyjs/src/core/fsm');

const tk = require('linkifyjs/src/core/tokens/text');
const { takeT, makeT, makeRegexT, ...fsm } = require('linkifyjs/src/core/fsm');

describe('linkifyjs/core/fsm', () => {
	var S_START, S_DOT, S_NUM;

	before(() => {
		S_START = fsm.makeState();
		S_DOT = fsm.makeAcceptingState(tk.DOT);
		S_NUM = fsm.makeAcceptingState(tk.NUM);
	});

	describe('#t()', () => {
		it('Has no jumps and return null', () => {
			expect(takeT(S_START, '.')).to.not.be.ok;
		});

		it('Should return an new state for the "." and numeric characters', () => {
			makeT(S_START, '.', S_DOT);
			makeRegexT(S_START, /[0-9]/, S_NUM);

			var results = [
				takeT(S_START, '.'),
				takeT(S_START, '7'),
			];

			expect(S_START.j).not.to.be.empty;

			results.map((result) => {
				expect(result).to.be.ok;
				expect(result).to.have.property('j');
				expect(result).to.have.property('jd');
				expect(result).to.have.property('t');
			});

			expect(results[0]).to.be.eql(S_DOT);
			expect(results[1]).to.be.eql(S_NUM);
		});

		it('Can return itself (has recursion)', () => {
			makeRegexT(S_NUM, /[0-9]/, S_NUM);
			expect(takeT(S_NUM, '8')).to.be.eql(S_NUM);
			expect(takeT(takeT(S_NUM, '0'), '4')).to.be.eql(S_NUM);
		});
	});

	describe('#accepts()', () => {
		it('Should return a falsey value if initalized with no token', () => {
			expect(S_START.accepts()).not.to.be.ok;
		});

		it('Should return the token it was initialized with', () => {
			var state = fsm.makeAcceptingState(tk.QUERY);
			expect(state.accepts()).to.be.ok;
		});
	});

	describe('#makeChainT()', () => {
		it('Makes states for the domain "co"', () => {
			fsm.makeChainT(S_START, 'co', makeAcceptingState(tk.TLD), () => makeAcceptingState(tk.DOMAIN));

			expect(S_START.j.c.t).to.eql(tk.DOMAIN);
			expect(S_START.j.c.j.o.t).to.eql(tk.TLD);
		});

		it('Makes states for the domain "com"', () => {
			fsm.makeChainT(S_START, 'com', makeAcceptingState(tk.TLD), () => makeAcceptingState(tk.DOMAIN));
			expect(S_START.j.c.j.o.j.m.t).to.eql(tk.TLD);
		});

		it('Makes states for the domain "community"', () => {
			var state = S_START;
			fsm.makeChainT(S_START, 'community',  makeAcceptingState(tk.TLD), () => makeAcceptingState(tk.DOMAIN));

			expect((state = takeT(state, 'c')).t).to.be.eql(tk.DOMAIN);
			expect((state = takeT(state, 'o')).t).to.be.eql(tk.TLD);
			expect((state = takeT(state, 'm')).t).to.be.eql(tk.TLD);
			expect((state = takeT(state, 'm')).t).to.be.eql(tk.DOMAIN);
			expect((state = takeT(state, 'u')).t).to.be.eql(tk.DOMAIN);
			expect((state = takeT(state, 'n')).t).to.be.eql(tk.DOMAIN);
			expect((state = takeT(state, 'i')).t).to.be.eql(tk.DOMAIN);
			expect((state = takeT(state, 't')).t).to.be.eql(tk.DOMAIN);
			expect((state = takeT(state, 'y')).t).to.be.eql(tk.TLD);
		});
	});
});
