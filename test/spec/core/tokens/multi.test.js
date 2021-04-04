const tokens = require('linkifyjs/src/core/tokens');
const scanner = require('linkifyjs/src/core/scanner');
const { expect } = require('chai');
const tk = tokens.text;
const mkt = tokens.multi;

describe('linkifyjs/core/tokens/multi', () => {
	let scannerStart;
	before(() => { scannerStart = scanner.init(); });

	describe('Multitoken', () => {
		it('Constructor runs', () => {
			expect(new tokens.multi.Base()).to.be.ok;
		});
	});

	describe('Url', () => {
		let input1 = 'Ftps://www.github.com/SoapBox/linkify';
		let input2 = '//Amazon.ca/Sales';
		let input3 = 'co.co?o=%2D&p=@gc#wat';
		let url1, url2, url3;

		before(() => {
			const urlTextTokens1 = scanner.run(scannerStart, input1);
			const urlTextTokens2 = scanner.run(scannerStart, input2);
			const urlTextTokens3 = scanner.run(scannerStart, input3);

			url1 = new mkt.Url(input1, urlTextTokens1);
			url2 = new mkt.Url(input2, urlTextTokens2);
			url3 = new mkt.Url(input3, urlTextTokens3);
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
					value: input1,
					href: input1,
					isLink: true,
					start: 0,
					end: input1.length
				});

				expect(url2.toObject()).to.be.eql({
					type: 'url',
					value: input2,
					href: input2,
					isLink: true,
					start: 0,
					end: input2.length
				});

				expect(url3.toObject('https')).to.be.eql({
					type: 'url',
					value: input3,
					href: 'https://co.co?o=%2D&p=@gc#wat',
					isLink: true,
					start: 0,
					end: input3.length
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

	describe('Email', () => {
		let input = 'test@example.com';
		let email;

		before(() => {
			const emailTextTokens = scanner.run(scannerStart, input);
			email = new mkt.Email(input, emailTextTokens);
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

	describe('MailtoEmail', () => {
		let input = 'mailto:test@example.com';
		let email;

		before(() => {
			const emailTextTokens = scanner.run(scannerStart, input);
			email = new mkt.MailtoEmail(input, emailTextTokens);
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

	describe('Nl', () => {
		var nlTokens, nl;

		before(() => {
			nlTokens = [{t: tk.NL, v: '\n', s: 0, e: 1}];
			nl = new mkt.Nl('\n', nlTokens);
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

	describe('Text', () => {
		let text, input = 'Hello, World!';

		before(() => {
			const textTokens = scanner.run(scannerStart, input);
			text = new mkt.Text(input, textTokens);
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
