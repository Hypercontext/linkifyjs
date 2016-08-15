const options = require(`${__base}linkify/utils/options`);
const Options = options.Options;

describe('linkify/utils/options', () => {
	describe('defaults', () => {
		it('is an object', () => {
			expect(options.defaults).to.be.an('object');
		});

		it('contains some keys', () => {
			var count = 0;
			for (var opt in options.defaults) {
				count++;
			}
			expect(count).to.be.above(0);
		});

		it('defines the value for unspecified Options', () => {
			var opts = new Options();
			options.defaults.defaultProtocol = 'https';
			var newOpts = new Options();
			expect(opts.defaultProtocol).to.equal('http');
			expect(newOpts.defaultProtocol).to.equal('https');
		});

	});

	describe('contains', () => {
		it('returns true when an array contains the given value', () => {
			expect(options.contains([1, 2, 3], 2)).to.be.ok;
		});
		it('returns false when an array contains the given value', () => {
			expect(options.contains([1, 2, 3], 4)).to.not.be.ok;
		});
	});

	describe('Options', () => {
		var opts;
		var urlToken;
		var emailToken;

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
				attributes: () => ({rel: 'nofollow'}),
				className: 'custom-class-name'
			});

			urlToken = {
				type: 'url',
				isLink: true,
				toString: () => 'github.com',
				toHref: (protocol) => `${protocol}://github.com`,
				hasProtocol: () => false
			};

			emailToken = {
				type: 'email',
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
					target: '_blank',
					events: opts.events,
					attributes: {rel: 'nofollow'}
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
					attributes: {rel: 'nofollow'}
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
});
