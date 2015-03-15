/*jshint -W030 */
var
TEXT_TOKENS = require('../../../../../lib/linkify/core/tokens').text,
MULTI_TOKENS = require('../../../../../lib/linkify/core/tokens').multi;

describe('MULTI_TOKENS', function () {

	describe('URL', function () {
		var
		urlTextTokens1, urlTextTokens2, urlTextTokens3,
		url1, url2, url3;

		before(function () {
			urlTextTokens1 = [ // 'Ftps://www.github.com/SoapBox/linkify'
				new TEXT_TOKENS.PROTOCOL('Ftps:'),
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.DOMAIN('www'),
				new TEXT_TOKENS.DOT(),
				new TEXT_TOKENS.DOMAIN('github'),
				new TEXT_TOKENS.DOT(),
				new TEXT_TOKENS.TLD('com'),
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.DOMAIN('SoapBox'),
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.DOMAIN('linkify'),
			],

			urlTextTokens2 = [ // '//Amazon.ca/Sales'
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.DOMAIN('Amazon'),
				new TEXT_TOKENS.DOT(),
				new TEXT_TOKENS.TLD('ca'),
				new TEXT_TOKENS.SLASH(),
				new TEXT_TOKENS.DOMAIN('Sales')
			],

			urlTextTokens3 = [ // 'co.co?o=%2D&p=@gc#wat'
				new TEXT_TOKENS.TLD('co'),
				new TEXT_TOKENS.DOT(),
				new TEXT_TOKENS.TLD('co'),
				new TEXT_TOKENS.SYM('?'),
				new TEXT_TOKENS.DOMAIN('o'),
				new TEXT_TOKENS.SYM('='),
				new TEXT_TOKENS.SYM('%'),
				new TEXT_TOKENS.DOMAIN('2D'),
				new TEXT_TOKENS.SYM('&'),
				new TEXT_TOKENS.DOMAIN('p'),
				new TEXT_TOKENS.SYM('='),
				new TEXT_TOKENS.AT(),
				new TEXT_TOKENS.DOMAIN('gc'),
				new TEXT_TOKENS.POUND(),
				new TEXT_TOKENS.DOMAIN('wat'),
			];

			url1 = new MULTI_TOKENS.URL(urlTextTokens1);
			url2 = new MULTI_TOKENS.URL(urlTextTokens2);
			url3 = new MULTI_TOKENS.URL(urlTextTokens3);
		});

		describe('#isLink', function () {
			it('Is true in all cases', function () {
				url1.isLink.should.be.ok;
				url2.isLink.should.be.ok;
				url3.isLink.should.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns the exact URL text', function () {
				url1.toString().should.be.eql('Ftps://www.github.com/SoapBox/linkify');
				url2.toString().should.be.eql('//Amazon.ca/Sales');
				url3.toString().should.be.eql('co.co?o=%2D&p=@gc#wat');
			});
		});

		describe('#toHref()', function () {
			it('Keeps the protocol the same as the original URL (and lowercases it)', function () {
				url1.toHref().should.be.eql('ftps://www.github.com/SoapBox/linkify');
			});

			it('Lowercases the domain name only and leaves off the protocol if the URL begins with "//"', function () {
				url2.toHref().should.be.eql('//amazon.ca/Sales');
			});

			it('Adds a default protocol, if required', function () {
				url3.toHref().should.be.eql('http://co.co?o=%2D&p=@gc#wat');
				url3.toHref('ftp').should.be.eql('ftp://co.co?o=%2D&p=@gc#wat');
			});
		});

		describe('#toObject()', function () {
			it('Returns a hash with correct type, value, and href', function () {

				url1.toObject('file').should.be.eql({
					type: 'url',
					value: 'Ftps://www.github.com/SoapBox/linkify',
					href: 'ftps://www.github.com/SoapBox/linkify'
				});

				url2.toObject().should.be.eql({
					type: 'url',
					value: '//Amazon.ca/Sales',
					href: '//amazon.ca/Sales'
				});

				url3.toObject('https').should.be.eql({
					type: 'url',
					value: 'co.co?o=%2D&p=@gc#wat',
					href: 'https://co.co?o=%2D&p=@gc#wat'
				});
			});
		});

		describe('#hasProtocol()', function () {
			it('Tests true when there is a protocol', function () {
				url1.hasProtocol().should.be.ok;
			});
			it('Tests false when there is no protocol', function () {
				url2.hasProtocol().should.not.be.ok;
				url3.hasProtocol().should.not.be.ok;
			});
		});

	});

	describe('EMAIL', function () {
		var emailTextTokens, email;

		before(function () {
			emailTextTokens = [ // test@example.com
				new TEXT_TOKENS.DOMAIN('test'),
				new TEXT_TOKENS.AT(),
				new TEXT_TOKENS.DOMAIN('example'),
				new TEXT_TOKENS.DOT(),
				new TEXT_TOKENS.TLD('com')
			];
			email = new MULTI_TOKENS.EMAIL(emailTextTokens);
		});

		describe('#isLink', function () {
			it('Is true in all cases', function () {
				email.isLink.should.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns the exact email address text', function () {
				email.toString().should.be.eql('test@example.com');
			});
		});

		describe('#toHref()', function () {
			it('Appends "mailto:" to the email address', function () {
				email.toHref().should.be.eql('mailto:test@example.com');
			});
		});

	});

	describe('NL', function () {
		var nlTokens, nl;

		before(function () {
			nlTokens = [new TEXT_TOKENS.NL()];
			nl = new MULTI_TOKENS.NL(nlTokens);
		});

		describe('#isLink', function () {
			it('Is false in all cases', function () {
				nl.isLink.should.not.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns a single newline character', function () {
				nl.toString().should.be.eql('\n');
			});
		});
	});

	describe('TEXT', function () {
		var textTokens, text;

		before(function () {
			textTokens = [ // 'Hello, World!'
				new TEXT_TOKENS.DOMAIN('Hello'),
				new TEXT_TOKENS.SYM(','),
				new TEXT_TOKENS.WS(' '),
				new TEXT_TOKENS.DOMAIN('World'),
				new TEXT_TOKENS.SYM('!')
			];
			text = new MULTI_TOKENS.TEXT(textTokens);
		});

		describe('#isLink', function () {
			it('Is false in all cases', function () {
				text.isLink.should.not.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns the original string text', function () {
				text.toString().should.be.eql('Hello, World!');
			});
		});
	});

	/**
		Static multitoken testing function
	*/
	describe('#test', function () {
		var textToken, multiTokenOne, multiTokenTwo;

		before(function () {
			textToken = new TEXT_TOKENS.DOMAIN('hi');
			multiTokenOne = new MULTI_TOKENS.Base([textToken]);
			multiTokenTwo = new MULTI_TOKENS.TEXT([textToken]);
		});

		it('Tests false for non-multitokens', function () {
			MULTI_TOKENS.Base.test().should.not.be.ok;
			MULTI_TOKENS.Base.test(null).should.not.be.ok;
			MULTI_TOKENS.Base.test(undefined).should.not.be.ok;
			MULTI_TOKENS.Base.test(true).should.not.be.ok;
			MULTI_TOKENS.Base.test(false).should.not.be.ok;
			MULTI_TOKENS.Base.test('').should.not.be.ok;
			MULTI_TOKENS.Base.test('wat').should.not.be.ok;
			MULTI_TOKENS.Base.test(function () {}).should.not.be.ok;
			MULTI_TOKENS.Base.test(textToken).should.not.be.ok;
		});

		it('Tests true for multitokens', function () {
			MULTI_TOKENS.Base.test(multiTokenOne).should.be.ok;
			MULTI_TOKENS.Base.test(multiTokenTwo).should.be.ok;
		});
	});

});
