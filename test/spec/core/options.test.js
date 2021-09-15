const options = require('linkifyjs/src/core/options');
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
			expect(opts.defaultProtocol).to.equal('http');
			expect(newOpts.defaultProtocol).to.equal('https');
		});

	});

	describe('Options', () => {
		let opts, urlToken, emailToken;

		beforeEach(() => {
			opts = new Options({
				defaultProtocol: 'https',
				events: {
					click: () => alert('clicked!')
				},
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

			urlToken = {
				t: 'url',
				isLink: true,
				toString: () => 'github.com',
				toHref: (protocol) => `${protocol}://github.com`,
				hasProtocol: () => false
			};

			emailToken = {
				t: 'email',
				isLink: true,
				toString: () => 'test@example.com',
				toHref: () => 'mailto:test@example.com'
			};
		});

		describe('#resolve', () => {
			it('returns the correct set of options for a url token', () => {
				expect(opts.resolve(urlToken)).to.deep.equal({
					formatted: '<github.com>',
					formattedHref: 'https://github.com/?from=linkify',
					tagName: 'a',
					className: 'custom-class-name',
					target: null,
					events: opts.events,
					rel: 'nofollow',
					attributes: { type: 'text/html' },
					truncate: 40
				});
			});

			it('returns the correct set of options for an email token', () => {
				expect(opts.resolve(emailToken)).to.deep.equal({
					formatted: '<test@example.com>',
					formattedHref: 'mailto:test@example.com?subject=Hello+from+Linkify',
					tagName: 'a',
					className: 'custom-class-name',
					target: null,
					events: opts.events,
					rel: 'nofollow',
					attributes: { type: 'text/html' },
					truncate: 40
				});
			});
		});

		describe('#check', () => {
			it('returns false for url token', () => {
				expect(opts.check(urlToken)).not.to.be.ok;
			});

			it('returns true for email token', () => {
				expect(opts.check(emailToken)).to.be.ok;
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
				expect(opts.target).to.be.null;
			});
		});

		describe('className', () => {
			it('should be nulled', () => {
				expect(opts.className).to.be.null;
			});
		});
	});
});
