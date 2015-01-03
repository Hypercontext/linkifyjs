var TEXT_TOKENS = require('../../../build/tokens/text');

describe('TEXT_TOKENS', function () {

	// Test for two commonly-used tokens

	describe('DOMAIN', function () {
		var DOMAIN;

		before(function () {
			DOMAIN = new TEXT_TOKENS.DOMAIN('abc123');
		});

		describe('#toString()', function () {
			it ('should return the string "abc123"', function () {
				DOMAIN.toString().should.eql('abc123');
			});
		});
	});

	describe('AT', function () {
		var at;

		before(function () {
			at = new TEXT_TOKENS.AT('asdf'); // should ignore passed-in value
		});

		describe('#toString()', function () {
			it ('should return the string "@"', function () {
				at.toString().should.eql('@');
			});
		});
	});

});
