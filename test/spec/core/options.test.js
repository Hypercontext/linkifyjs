import { expect } from 'chai';
import * as options from 'linkifyjs/src/core/options';
import * as scanner from 'linkifyjs/src/core/scanner';
import { multi as mtk } from 'linkifyjs/src/core/tokens';

const Options = options.Options;

describe('linkifyjs/core/options', () => {
	describe('defaults', () => {
		after(() => { options.defaults.defaultProtocol = 'http'; });

		it('is an object', () => {
			expect(options.defaults).to.be.an('object');
		});

		it('contains some keys', () => {
			expect(Object.keys(options.defaults).length).to.be.above(0);
		});

		it('defines the value for unspecified Options', () => {
			var opts = new Options();
			options.defaults.defaultProtocol = 'https';
			var newOpts = new Options();
			expect(opts.get('defaultProtocol')).to.equal('http');
			expect(newOpts.get('defaultProtocol')).to.equal('https');
		});

	});

	describe('Options', () => {
		const events = { click: () => alert('clicked!') };
		let urlToken, emailToken, scannerStart;
		let opts, renderOpts;

		before(() => {
			scannerStart = scanner.init();
			const inputUrl = 'github.com';
			const inputEmail = 'test@example.com';

			const urlTextTokens = scanner.run(scannerStart, inputUrl);
			const emailTextTokens = scanner.run(scannerStart, inputEmail);

			urlToken = new mtk.Url(inputUrl, urlTextTokens);
			emailToken = new mtk.Email(inputEmail, emailTextTokens);
		});

		beforeEach(() => {
			opts = new Options({
				defaultProtocol: 'https',
				events,
				format: (text) => `<${text}>`,
				formatHref: {
					url: (url) => `${url}/?from=linkify`,
					email: (mailto) => `${mailto}?subject=Hello+from+Linkify`
				},
				nl2br: true,
				validate: {
					url: (url) => /^http(s)?:\/\//.test(url) // only urls with protocols
				},
				ignoreTags: ['script', 'style'],
				rel: 'nofollow',
				attributes: () => ({ type: 'text/html' }),
				className: 'custom-class-name',
				truncate: 40
			});

			renderOpts = new Options({
				tagName: 'b',
				className: 'linkified',
				render: {
					email: ({ attributes, innerHTML }) => (
						// Ignore tagname and most attributes
						`<e to="${attributes.href}?subject=Hello+From+Linkify">${innerHTML}</e>`
					)
				}
			}, ({ tagName, attributes, innerHTML }) => {
				const attrStrs = Object.keys(attributes)
					.reduce((a, attr) => a.concat(`${attr}="${attributes[attr]}"`), []);
				return `<${tagName} ${attrStrs.join(' ')}>${innerHTML}</${tagName}>`;
			});
		});

		describe('#check()', () => {
			it('returns false for url token', () => {
				expect(opts.check(urlToken)).not.to.be.ok;
			});

			it('returns true for email token', () => {
				expect(opts.check(emailToken)).to.be.ok;
			});
		});

		describe('#render()', () => {
			it('Returns intermediate representation when render option not specified', () => {
				expect(opts.render(urlToken)).to.eql({
					tagName: 'a',
					attributes: {
						href: 'https://github.com/?from=linkify',
						class: 'custom-class-name',
						rel: 'nofollow',
						type: 'text/html'
					},
					innerHTML: '<github.com>',
					eventListeners: events
				});
			});

			it('renders a URL', () => {
				expect(renderOpts.render(urlToken)).to.eql('<b href="http://github.com" class="linkified">github.com</b>');
			});

			it('renders an email address', () => {
				expect(renderOpts.render(emailToken)).to.eql('<e to="mailto:test@example.com?subject=Hello+From+Linkify">test@example.com</e>');
			});
		});
	});

	describe('Nullifying Options', () => {
		var opts;

		beforeEach(() => {
			opts = new Options({ target: null, className: null });
		});

		describe('target', () => {
			it('should be nulled', () => {
				expect(opts.get('target')).to.be.null;
			});
		});

		describe('className', () => {
			it('should be nulled', () => {
				expect(opts.get('className')).to.be.null;
			});
		});
	});
});
