/* eslint-disable mocha/no-setup-in-describe */
const linkify = require(`${__base}linkify`);

describe('linkify', () => {
	describe('tokenize', () => {
		it('is a function', () => {
			expect(linkify.tokenize).to.be.a('function');
		});
		it('takes a single argument', () => {
			expect(linkify.tokenize.length).to.be.eql(1);
		});
	});

	describe('find', () => {
		it('is a function', () => {
			expect(linkify.find).to.be.a('function');
		});
		it('takes a single argument', () => {
			expect(linkify.find.length).to.be.eql(1); // type is optional
		});
	});

	describe('test', () => {
		/*
			For each element,

			* [0] is the input string
			* [1] is the expected return value
			* [2] (optional) the type of link to look for
		*/
		const tests = [
			['Herp derp', false],
			['Herp derp', false, 'email'],
			['Herp derp', false, 'asdf'],
			['https://google.com/?q=yey', true],
			['https://google.com/?q=yey', true, 'url'],
			['https://google.com/?q=yey', false, 'email'],
			['test+4@uwaterloo.ca', true],
			['test+4@uwaterloo.ca', false, 'url'],
			['test+4@uwaterloo.ca', true, 'email'],
			['mailto:test+5@uwaterloo.ca', true, 'email'],
			['t.co', true],
			['t.co g.co', false], // can only be one
			['test@g.co t.co', false] // can only be one
		];

		it('is a function', () => {
			expect(linkify.test).to.be.a('function');
		});
		it('takes a single argument', () => {
			expect(linkify.test.length).to.be.eql(1); // type is optional
		});

		let testName;
		for (const test of tests) {
			testName = 'Correctly tests the string "' + test[0] + '"';
			testName += ' as `' + (test[1] ? 'true' : 'false') + '`';
			if (test[2]) {
				testName += ' (' + test[2] + ')';
			}
			testName += '.';

			it(testName, () => {
				expect(linkify.test(test[0], test[2])).to.be.eql(test[1]);
			});
		}
	});

	describe('options', () => {
		it('is an object', () => {
			expect(linkify.options).to.be.a('object');
		});
	});
});
