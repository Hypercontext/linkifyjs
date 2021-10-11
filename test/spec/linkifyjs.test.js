/* eslint-disable mocha/no-setup-in-describe */
const { expect } = require('chai');
const linkify = require('linkifyjs/src/linkify');

const ticketPlugin = ({ scanner, parser, utils }) => {
	const { POUND, numeric } = scanner.tokens;
	const TicketToken = utils.createTokenClass('ticket', { isLink: true });
	const Hash = parser.start.tt(POUND);
	Hash.tt(numeric, TicketToken);
};

describe('linkifyjs', () => {
	describe('registerPlugin', () => {
		beforeEach(() => {
			linkify.registerPlugin('ticket', ticketPlugin);
		});

		it('Detects tickets after applying', () => {
			expect(linkify.test('#123', 'ticket')).to.be.ok;
		});

		it('Logs a warning if registering same plugin twice', () => {
			linkify.registerPlugin('ticket', ticketPlugin);
			expect(linkify.test('#123', 'ticket')).to.be.ok;
		});

		it('Logs a warning if already initialized', () => {
			linkify.init();
			linkify.registerPlugin('ticket2', ticketPlugin);
		});
	});

	describe('registerCustomProtocol', () => {
		beforeEach(() => {
			linkify.registerCustomProtocol('instagram', true);
			linkify.registerCustomProtocol('view-source');
		});

		it('Detects basic protocol', () => {
			expect(linkify.test('instagram:user/nfrasser', 'url')).to.be.ok;
		});

		it('Detects basic protocol with slash slash', () => {
			expect(linkify.test('instagram://user/nfrasser', 'url')).to.be.ok;
		});

		it('Detects compound protocol', () => {
			expect(linkify.test('view-source://http://github.com/', 'url')).to.be.ok;
		});

		it('Does not detect protocol with non-optional //', () => {
			expect(linkify.test('view-source:http://github.com/', 'url')).to.not.be.ok;
		});

		it('Does not detect custom protocol if already initialized', () => {
			linkify.init();
			linkify.registerCustomProtocol('fb');
			expect(linkify.test('fb://feed')).to.not.be.ok;
		});

		it('Throws error when protocol has invalid format', () => {
			expect(() => linkify.registerCustomProtocol('-')).to.throw();
			expect(() => linkify.registerCustomProtocol('-fb')).to.throw();
			expect(() => linkify.registerCustomProtocol('fb-')).to.throw();
			expect(() => linkify.registerCustomProtocol('git+https')).to.throw(); // this may work in the future
		});
	});

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

		it('Find nothing in an empty string', () => {
			expect(linkify.find('')).to.deep.eql([]);
		});

		it('Find nothing in a string with no links', () => {
			expect(linkify.find('Hello World!')).to.deep.eql([]);
		});

		it('Find the link', () => {
			expect(linkify.find('hello.world!')).to.deep.eql([{
				type: 'url',
				value: 'hello.world',
				href: 'http://hello.world',
				isLink: true,
				start: 0,
				end: 11
			}]);
		});

		it('Find the link of the specific type', () => {
			expect(linkify.find('For help with github.com, please contact support@example.com', 'email')).to.deep.eql([{
				type: 'email',
				value: 'support@example.com',
				href: 'mailto:support@example.com',
				isLink: true,
				start: 41,
				end: 60
			}]);
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
			['mailto:test+5@uwaterloo.ca', true, 'url'],
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
