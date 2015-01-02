var TEXT_TOKENS = require('../../../build/tokens/text');

describe('TEXT_TOKENS', function () {

	// Test for two commonly-used tokens

	describe('DOMAIN', function () {
		var DOMAIN;

		before(function () {
			DOMAIN = new TEXT_TOKENS.DOMAIN('abc123');
		});

		describe('#type()', function () {
			it('should have a type of DOMAIN', function () {
				DOMAIN.type.should.eql('DOMAIN');
			});
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

		describe('#type()', function () {
			it('should have a type of AT', function () {
				at.type.should.eql('AT');
			});
		});

		describe('#toString()', function () {
			it ('should return the string "@"', function () {
				at.toString().should.eql('@');
			});
		});
	});

});
