var
TOKENS		= require('../../../../../lib/linkify/core/tokens').text,
State		= require('../../../../../lib/linkify/core/state').CharacterState,
stateify	= require('../../../../../lib/linkify/core/state').stateify;

describe('stateify', function () {
	var S_START;

	before(function () {
		S_START = new State();
	});

	it('Makes states for the domain "co"', function () {
		var result = stateify('co', S_START, TOKENS.TLD, TOKENS.DOMAIN);

		result.should.be.an.instanceOf(Array);
		result.length.should.eql(2);
		result[0].T.should.eql(TOKENS.DOMAIN);
		result[1].T.should.eql(TOKENS.TLD);
	});

	it('Makes states for the domain "com"', function () {
		var result = stateify('com', S_START, TOKENS.TLD, TOKENS.DOMAIN);
		result.should.be.an.instanceOf(Array);
		result.length.should.eql(1);
		result[0].T.should.eql(TOKENS.TLD);
	});

	it('Adding "com" again should not make any new states', function () {
		var result = stateify('com', S_START, TOKENS.TLD, TOKENS.DOMAIN);
		result.should.be.an.instanceOf(Array);
		result.length.should.eql(0);
	});

	it('Makes states for the domain "community"', function () {
		var state = S_START,
		result = stateify('community', S_START, TOKENS.TLD, TOKENS.DOMAIN);

		result.should.be.an.instanceOf(Array);
		result.length.should.eql(6);

		(state = state.next('c')).T.should.be.eql(TOKENS.DOMAIN);
		(state = state.next('o')).T.should.be.eql(TOKENS.TLD);
		(state = state.next('m')).T.should.be.eql(TOKENS.TLD);
		(state = state.next('m')).T.should.be.eql(TOKENS.DOMAIN);
		(state = state.next('u')).T.should.be.eql(TOKENS.DOMAIN);
		(state = state.next('n')).T.should.be.eql(TOKENS.DOMAIN);
		(state = state.next('i')).T.should.be.eql(TOKENS.DOMAIN);
		(state = state.next('t')).T.should.be.eql(TOKENS.DOMAIN);
		(state = state.next('y')).T.should.be.eql(TOKENS.TLD);

	});

});
