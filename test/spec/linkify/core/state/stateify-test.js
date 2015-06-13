var
TOKENS		= require('../../../../../lib/linkify/core/tokens').text,
State		= require('../../../../../lib/linkify/core/state').CharacterState,
stateify	= require('../../../../../lib/linkify/core/state').stateify;

describe('linkify/core/state/stateify', function () {
	var S_START;

	before(function () {
		S_START = new State();
	});

	it('Makes states for the domain "co"', function () {
		var result = stateify('co', S_START, TOKENS.TLD, TOKENS.DOMAIN);

		expect(result).to.be.an(Array);
		expect(result.length).to.eql(2);
		expect(result[0].T).to.eql(TOKENS.DOMAIN);
		expect(result[1].T).to.eql(TOKENS.TLD);
	});

	it('Makes states for the domain "com"', function () {
		var result = stateify('com', S_START, TOKENS.TLD, TOKENS.DOMAIN);
		expect(result).to.be.an(Array);
		expect(result.length).to.eql(1);
		expect(result[0].T).to.eql(TOKENS.TLD);
	});

	it('Adding "com" again should not make any new states', function () {
		var result = stateify('com', S_START, TOKENS.TLD, TOKENS.DOMAIN);
		expect(result).to.be.an(Array);
		expect(result.length).to.eql(0);
	});

	it('Makes states for the domain "community"', function () {
		var state = S_START,
		result = stateify('community', S_START, TOKENS.TLD, TOKENS.DOMAIN);

		expect(result).to.be.an(Array);
		expect(result.length).to.eql(6);

		expect((state = state.next('c')).T).to.be.eql(TOKENS.DOMAIN);
		expect((state = state.next('o')).T).to.be.eql(TOKENS.TLD);
		expect((state = state.next('m')).T).to.be.eql(TOKENS.TLD);
		expect((state = state.next('m')).T).to.be.eql(TOKENS.DOMAIN);
		expect((state = state.next('u')).T).to.be.eql(TOKENS.DOMAIN);
		expect((state = state.next('n')).T).to.be.eql(TOKENS.DOMAIN);
		expect((state = state.next('i')).T).to.be.eql(TOKENS.DOMAIN);
		expect((state = state.next('t')).T).to.be.eql(TOKENS.DOMAIN);
		expect((state = state.next('y')).T).to.be.eql(TOKENS.TLD);

	});

});
