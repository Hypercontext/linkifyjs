/*jshint -W030 */
var
TEXT_TOKENS = require('../../../../../lib/linkify/core/tokens').text,
MULTI_TOKENS = require('../../../../../lib/linkify/core/tokens').multi;

describe('linkify/core/tokens/MULTI_TOKENS', function () {

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
				expect(url1.isLink).to.be.ok;
				expect(url2.isLink).to.be.ok;
				expect(url3.isLink).to.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns the exact URL text', function () {
				expect(url1.toString()).to.be.eql('Ftps://www.github.com/SoapBox/linkify');
				expect(url2.toString()).to.be.eql('//Amazon.ca/Sales');
				expect(url3.toString()).to.be.eql('co.co?o=%2D&p=@gc#wat');
			});
		});

		describe('#toHref()', function () {
			it('Keeps the protocol the same as the original URL (and lowercases it)', function () {
				expect(url1.toHref()).to.be.eql('ftps://www.github.com/SoapBox/linkify');
			});

			it('Lowercases the domain name only and leaves off the protocol if the URL begins with "//"', function () {
				expect(url2.toHref()).to.be.eql('//amazon.ca/Sales');
			});

			it('Adds a default protocol, if required', function () {
				expect(url3.toHref()).to.be.eql('http://co.co?o=%2D&p=@gc#wat');
				expect(url3.toHref('ftp')).to.be.eql('ftp://co.co?o=%2D&p=@gc#wat');
			});
		});

		describe('#toObject()', function () {
			it('Returns a hash with correct type, value, and href', function () {

				expect(url1.toObject('file')).to.be.eql({
					type: 'url',
					value: 'Ftps://www.github.com/SoapBox/linkify',
					href: 'ftps://www.github.com/SoapBox/linkify'
				});

				expect(url2.toObject()).to.be.eql({
					type: 'url',
					value: '//Amazon.ca/Sales',
					href: '//amazon.ca/Sales'
				});

				expect(url3.toObject('https')).to.be.eql({
					type: 'url',
					value: 'co.co?o=%2D&p=@gc#wat',
					href: 'https://co.co?o=%2D&p=@gc#wat'
				});
			});
		});

		describe('#hasProtocol()', function () {
			it('Tests true when there is a protocol', function () {
				expect(url1.hasProtocol()).to.be.ok;
			});
			it('Tests false when there is no protocol', function () {
				expect(url2.hasProtocol()).to.not.be.ok;
				expect(url3.hasProtocol()).to.not.be.ok;
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
				expect(email.isLink).to.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns the exact email address text', function () {
				expect(email.toString()).to.be.eql('test@example.com');
			});
		});

		describe('#toHref()', function () {
			it('Appends "mailto:" to the email address', function () {
				expect(email.toHref()).to.be.eql('mailto:test@example.com');
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
				expect(nl.isLink).to.not.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns a single newline character', function () {
				expect(nl.toString()).to.be.eql('\n');
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
				expect(text.isLink).to.not.be.ok;
			});
		});

		describe('#toString()', function () {
			it('Returns the original string text', function () {
				expect(text.toString()).to.be.eql('Hello, World!');
			});
		});
	});

});
