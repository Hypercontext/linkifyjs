/*jshint -W030 */
var
TEXT_TOKENS	= require('../../../../../lib/linkify/core/tokens').text,
TokenState	= require('../../../../../lib/linkify/core/state').TokenState;

describe('TokenState', function () {
	var TS_START;

	before(function () {
		TS_START = new TokenState();
	});

	describe('#test()', function () {
		it('Ensures token instances belong to the given token class', function () {
			// This method is used internally

			var
			dot = new TEXT_TOKENS.DOT(),
			text = new TEXT_TOKENS.DOMAIN('abc123doremi');

			TS_START.test(dot, TEXT_TOKENS.DOT).should.be.ok;
			TS_START.test(text, TEXT_TOKENS.DOMAIN).should.be.ok;
			TS_START.test(text, TEXT_TOKENS.DOT).should.not.be.ok;
			TS_START.test(dot, TEXT_TOKENS.DOMAIN).should.not.be.ok;

		});
	});
});
