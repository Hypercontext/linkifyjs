const tokens = require(`${__base}linkify/core/tokens`);
const tk = tokens.text;
const mkt = tokens.multi;

describe('linkify/core/tokens/multi', () => {
	describe('URL', () => {
		var urlTextTokens1, urlTextTokens2, urlTextTokens3, url1, url2, url3;

		before(() => {
			urlTextTokens1 = [ // 'Ftps://www.github.com/SoapBox/linkify'
				{ t: tk.PROTOCOL, v: 'Ftps:' },
				{ t: tk.SLASH, v: '/' },
				{ t: tk.SLASH, v: '/' },
				{ t: tk.DOMAIN, v: 'www' },
				{ t: tk.DOT, v: '.' },
				{ t: tk.DOMAIN, v: 'github' },
				{ t: tk.DOT, v: '.' },
				{ t: tk.TLD, v: 'com' },
				{ t: tk.SLASH, v: '/' },
				{ t: tk.DOMAIN, v: 'SoapBox' },
				{ t: tk.SLASH, v: '/' },
				{ t: tk.DOMAIN, v: 'linkify' },
			],

			urlTextTokens2 = [ // '//Amazon.ca/Sales'
				{ t: tk.SLASH, v: '/' },
				{ t: tk.SLASH, v: '/' },
				{ t: tk.DOMAIN, v: 'Amazon' },
				{ t: tk.DOT, v: '.' },
				{ t: tk.TLD, v: 'ca' },
				{ t: tk.SLASH, v: '/' },
				{ t: tk.DOMAIN, v: 'Sales' },
			],

			urlTextTokens3 = [ // 'co.co?o=%2D&p=@gc#wat'
				{ t: tk.TLD, v: 'co' },
				{ t: tk.DOT, v: '.' },
				{ t: tk.TLD, v: 'co' },
				{ t: tk.SYM, v: '?' },
				{ t: tk.DOMAIN, v: 'o' },
				{ t: tk.SYM, v: '=' },
				{ t: tk.SYM, v: '%' },
				{ t: tk.DOMAIN, v: '2D' },
				{ t: tk.SYM, v: '&' },
				{ t: tk.DOMAIN, v: 'p' },
				{ t: tk.SYM, v: '=' },
				{ t: tk.AT, v: '@' },
				{ t: tk.DOMAIN, v: 'gc' },
				{ t: tk.POUND, v: '#' },
				{ t: tk.DOMAIN, v: 'wat' },
			];

			url1 = new mkt.Url(urlTextTokens1);
			url2 = new mkt.Url(urlTextTokens2);
			url3 = new mkt.Url(urlTextTokens3);
		});

		describe('#isLink', () => {
			it('Is true in all cases', () => {
				expect(url1.isLink).to.be.ok;
				expect(url2.isLink).to.be.ok;
				expect(url3.isLink).to.be.ok;
			});
		});

		describe('#toString()', () => {
			it('Returns the exact URL text', () => {
				expect(url1.toString()).to.be.eql('Ftps://www.github.com/SoapBox/linkify');
				expect(url2.toString()).to.be.eql('//Amazon.ca/Sales');
				expect(url3.toString()).to.be.eql('co.co?o=%2D&p=@gc#wat');
			});
		});

		describe('#toHref()', () => {
			it('Keeps the protocol the same as the original URL (and lowercases it)', () => {
				expect(url1.toHref()).to.be.eql('Ftps://www.github.com/SoapBox/linkify');
			});

			it('Lowercases the domain name only and leaves off the protocol if the URL begins with "//"', () => {
				expect(url2.toHref()).to.be.eql('//Amazon.ca/Sales');
			});

			it('Adds a default protocol, if required', () => {
				expect(url3.toHref()).to.be.eql('http://co.co?o=%2D&p=@gc#wat');
				expect(url3.toHref('ftp')).to.be.eql('ftp://co.co?o=%2D&p=@gc#wat');
			});
		});

		describe('#toObject()', () => {
			it('Returns a hash with correct type, value, and href', () => {

				expect(url1.toObject('file')).to.be.eql({
					type: 'url',
					value: 'Ftps://www.github.com/SoapBox/linkify',
					href: 'Ftps://www.github.com/SoapBox/linkify'
				});

				expect(url2.toObject()).to.be.eql({
					type: 'url',
					value: '//Amazon.ca/Sales',
					href: '//Amazon.ca/Sales'
				});

				expect(url3.toObject('https')).to.be.eql({
					type: 'url',
					value: 'co.co?o=%2D&p=@gc#wat',
					href: 'https://co.co?o=%2D&p=@gc#wat'
				});
			});
		});

		describe('#hasProtocol()', () => {
			it('Tests true when there is a protocol', () => {
				expect(url1.hasProtocol()).to.be.ok;
			});
			it('Tests false when there is no protocol', () => {
				expect(url2.hasProtocol()).to.not.be.ok;
				expect(url3.hasProtocol()).to.not.be.ok;
			});
		});

	});

	describe('EMAIL', () => {
		var emailTextTokens, email;

		before(() => {
			emailTextTokens = [ // test@example.com
				{ t: tk.DOMAIN, v: 'test' },
				{ t: tk.AT, v: '@' },
				{ t: tk.DOMAIN, v: 'example' },
				{ t: tk.DOT, v: '.' },
				{ t: tk.TLD, v: 'com' },
			];
			email = new mkt.Email(emailTextTokens);
		});

		describe('#isLink', () => {
			it('Is true in all cases', () => {
				expect(email.isLink).to.be.ok;
			});
		});

		describe('#toString()', () => {
			it('Returns the exact email address text', () => {
				expect(email.toString()).to.be.eql('test@example.com');
			});
		});

		describe('#toHref()', () => {
			it('Appends "mailto:" to the email address', () => {
				expect(email.toHref()).to.be.eql('mailto:test@example.com');
			});
		});

	});

	describe('MAILTOEMAIL', () => {
		var emailTextTokens, email;

		before(() => {
			emailTextTokens = [ // test@example.com
				{ t: tk.MAILTO, v: 'mailto:' },
				{ t: tk.DOMAIN, v: 'test' },
				{ t: tk.AT, v: '@' },
				{ t: tk.DOMAIN, v: 'example' },
				{ t: tk.DOT, v: '.' },
				{ t: tk.TLD, v: 'com' },
			];
			email = new mkt.MailtoEmail(emailTextTokens);
		});

		describe('#isLink', () => {
			it('Is true in all cases', () => {
				expect(email.isLink).to.be.ok;
			});
		});

		describe('#toString()', () => {
			it('Returns mailto:test@example.com', () => {
				expect(email.toString()).to.be.eql('mailto:test@example.com');
			});
		});

		describe('#toHref()', () => {
			it('Returns mailto:test@example.com', () => {
				expect(email.toHref()).to.be.eql('mailto:test@example.com');
			});
		});

	});

	describe('NL', () => {
		var nlTokens, nl;

		before(() => {
			nlTokens = [{t: tk.NL, v: '\n' }];
			nl = new mkt.Nl(nlTokens);
		});

		describe('#isLink', () => {
			it('Is false in all cases', () => {
				expect(nl.isLink).to.not.be.ok;
			});
		});

		describe('#toString()', () => {
			it('Returns a single newline character', () => {
				expect(nl.toString()).to.be.eql('\n');
			});
		});
	});

	describe('TEXT', () => {
		var textTokens, text;

		before(() => {
			textTokens = [ // 'Hello, World!'
				{ t: tk.DOMAIN, v: 'Hello' },
				{ t: tk.SYM, v: ',' },
				{ t: tk.WS, v: ' ' },
				{ t: tk.DOMAIN, v: 'World' },
				{ t: tk.SYM, v: '!' },
			];
			text = new mkt.Text(textTokens);
		});

		describe('#isLink', () => {
			it('Is false in all cases', () => {
				expect(text.isLink).to.not.be.ok;
			});
		});

		describe('#toString()', () => {
			it('Returns the original string text', () => {
				expect(text.toString()).to.be.eql('Hello, World!');
			});
		});
	});
});
