const tk = require(`${__base}linkify/core/tokens/text`);
const { t, makeT, makeRegexT, accepts, ...fsm } = require(`${__base}linkify/core/fsm`);

describe('linkify/core/fsm', () => {
	var S_START, S_DOT, S_NUM;

	before(() => {
		S_START = fsm.makeState();
		S_DOT = fsm.makeAcceptingState(tk.DOT);
		S_NUM = fsm.makeAcceptingState(tk.NUM);
	});

	describe('#t()', () => {
		it('Has no jumps and return null', () => {
			expect(t(S_START, '.')).to.not.be.ok;
		});

		it('Should return an new state for the "." and numeric characters', () => {
			makeT(S_START, '.', S_DOT);
			makeRegexT(S_START, /[0-9]/, S_NUM);

			var results = [
				t(S_START, '.'),
				t(S_START, '7'),
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
			expect(t(S_NUM, '8')).to.be.eql(S_NUM);
			expect(t(t(S_NUM, '0'), '4')).to.be.eql(S_NUM);
		});
	});

	describe('#accepts()', () => {
		it('Should return a falsey value if initalized with no token', () => {
			expect(accepts(S_START)).not.to.be.ok;
		});

		it('Should return the token it was initialized with', () => {
			var state = fsm.makeAcceptingState(tk.QUERY);
			expect(accepts(state)).to.be.ok;
		});
	});

	describe('#makeChainT()', () => {
		it('Makes states for the domain "co"', () => {
			var result = fsm.makeChainT(S_START, 'co', tk.TLD, tk.DOMAIN);

			expect(result).to.be.an.instanceof(Array);
			expect(result.length).to.eql(2);
			expect(result[0].t).to.eql(tk.DOMAIN);
			expect(result[1].t).to.eql(tk.TLD);
		});

		it('Makes states for the domain "com"', () => {
			var result = fsm.makeChainT(S_START, 'com', tk.TLD, tk.DOMAIN);
			expect(result).to.be.an.instanceof(Array);
			expect(result.length).to.eql(1);
			expect(result[0].t).to.eql(tk.TLD);
		});

		it('Adding "com" again should not make any new states', () => {
			var result = fsm.makeChainT(S_START, 'com', tk.TLD, tk.DOMAIN);
			expect(result).to.be.an.instanceof(Array);
			expect(result.length).to.eql(0);
		});

		it('Makes states for the domain "community"', () => {
			var state = S_START;
			var result = fsm.makeChainT(S_START, 'community', tk.TLD, tk.DOMAIN);

			expect(result).to.be.an.instanceof(Array);
			expect(result.length).to.eql(6);

			expect((state = t(state, 'c')).t).to.be.eql(tk.DOMAIN);
			expect((state = t(state, 'o')).t).to.be.eql(tk.TLD);
			expect((state = t(state, 'm')).t).to.be.eql(tk.TLD);
			expect((state = t(state, 'm')).t).to.be.eql(tk.DOMAIN);
			expect((state = t(state, 'u')).t).to.be.eql(tk.DOMAIN);
			expect((state = t(state, 'n')).t).to.be.eql(tk.DOMAIN);
			expect((state = t(state, 'i')).t).to.be.eql(tk.DOMAIN);
			expect((state = t(state, 't')).t).to.be.eql(tk.DOMAIN);
			expect((state = t(state, 'y')).t).to.be.eql(tk.TLD);
		});
	});
});
