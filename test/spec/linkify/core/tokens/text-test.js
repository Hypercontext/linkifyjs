var TEXT_TOKENS = require('../../../../../lib/linkify/core/tokens').text;

describe('linkify/core/tokens#TEXT_TOKENS', function () {

	// Test for two commonly-used tokens

	describe('DOMAIN', function () {
		var DOMAIN;

		before(function () {
			DOMAIN = new TEXT_TOKENS.DOMAIN('abc123');
		});

		describe('#toString()', function () {
			it ('should return the string "abc123"', function () {
				expect(DOMAIN.toString()).to.eql('abc123');
			});
		});
	});

	describe('AT', function () {
		var at;

		before(function () {
			at = new TEXT_TOKENS.AT();
		});

		describe('#toString()', function () {
			it ('should return the string "@"', function () {
				expect(at.toString()).to.eql('@');
			});
		});
	});

});
