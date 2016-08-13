const TEXT_TOKENS = require(`${__base}linkify/core/tokens`).text;

describe('linkify/core/tokens#TEXT_TOKENS', () => {

	// Test for two commonly-used tokens
	describe('DOMAIN', () => {
		var DOMAIN;

		before(() => {
			DOMAIN = new TEXT_TOKENS.DOMAIN('abc123');
		});

		describe('#toString()', () => {
			it ('should return the string "abc123"', () => {
				expect(DOMAIN.toString()).to.eql('abc123');
			});
		});
	});

	describe('AT', () => {
		var at;

		before(() => {
			at = new TEXT_TOKENS.AT();
		});

		describe('#toString()', () => {
			it ('should return the string "@"', () => {
				expect(at.toString()).to.eql('@');
			});
		});
	});
});
