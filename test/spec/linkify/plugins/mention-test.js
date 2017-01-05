const linkify = require(`${__base}linkify`);
const mention = require(`${__base}linkify/plugins/mention`).default;

describe('linkify/plugins/mention', () => {
	it('Cannot parse mentions before applying the plugin', () => {
		expect(linkify.find('There is a @mention @YOLO2016 and @1234 and @%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('@wat', 'mention')).to.not.be.ok;
		expect(linkify.test('@987', 'mention')).to.not.be.ok;
	});

	describe('after plugin is applied', () => {
		before(() => {
			mention(linkify);
		});

		it ('Can parse mentions after applying the plugin', () => {
			expect(linkify.find('There is a @mention @YOLO2016 and @1234 and @%^&*( should not work')).to.deep.equal([{
				type: 'mention',
				value: '@mention',
				href: '/mention'
			}, {
				type: 'mention',
				value: '@YOLO2016',
				href: '/YOLO2016'
			}, {
				type: 'mention',
				value: '@1234',
				href: '/1234'
			}]);

			expect(linkify.test('@wat', 'mention')).to.be.ok;
			expect(linkify.test('@987', 'mention')).to.be.ok;
		});

		it('detects mentions with just text', () => {
			expect(linkify.find('Hey @nfrasser')).to.deep.equal([{
				type: 'mention',
				value: '@nfrasser',
				href: '/nfrasser'
			}]);
		});

		it('parses mentions that begin and end with underscores', () => {
			expect(linkify.find('Mention for @__lI3t__')).to.deep.equal([{
				type: 'mention',
				value: '@__lI3t__',
				href: '/__lI3t__'
			}]);
		});

		it('parses mentions with hyphens and underscores', () => {
			expect(linkify.find('Paging @sir_mc-lovin')).to.deep.equal([{
				type: 'mention',
				value: '@sir_mc-lovin',
				href: '/sir_mc-lovin'
			}]);
		});

		it('parses github team-style mentions with slashes', () => {
			expect(linkify.find('Hey @500px/web please review this')).to.deep.equal([{
				type: 'mention',
				value: '@500px/web',
				href: '/500px/web'
			}]);
		});

		it('ignores extra slashes at the end of mentions', () => {
			expect(linkify.find('We should get ///@soapbox/_developers/@soapbox/cs//// to review these')).to.deep.equal([{
				type: 'mention',
				value: '@soapbox/_developers',
				href: '/soapbox/_developers'
			}, {
				type: 'mention',
				value: '@soapbox/cs',
				href: '/soapbox/cs'
			}]);
		});

		it('parses mentions with dots', () => {
			expect(linkify.find('Hey @john.doe please review this')).to.deep.equal([{
				type: 'mention',
				value: '@john.doe',
				href: '/john.doe'
			}]);
		});

		it('ignores extra dots at the end of mentions', () => {
			expect(linkify.find('We should get ...@soapbox._developers.@soapbox.cs.... to be awesome')).to.deep.equal([{
				type: 'mention',
				value: '@soapbox._developers',
				href: '/soapbox._developers'
			}, {
				type: 'mention',
				value: '@soapbox.cs',
				href: '/soapbox.cs'
			}]);
		});

		it('does not treat @/.* as a mention', () => {
			expect(linkify.find('What about @/ and @/nfrasser?')).to.deep.equal([]);
		});

		it('ignores text only made up of symbols', () => {
			expect(linkify.find('Is @- or @__ a person? What about @%_% no, probably not')).to.deep.equal([]);
		});

		it('ignores punctuation at the end of mentions', () => {
			expect(linkify.find('These people are awesome: @graham, @brennan, and @chris! Also @nick.')).to.deep.equal([{
				type: 'mention',
				value: '@graham',
				href: '/graham'
			}, {
				type: 'mention',
				value: '@brennan',
				href: '/brennan'
			}, {
				type: 'mention',
				value: '@chris',
				href: '/chris'
			}, {
				type: 'mention',
				value: '@nick',
				href: '/nick'
			}]);
		});

		it('detects numerical mentions', () => {
			expect(linkify.find('Hey @123 and @456_78910__')).to.deep.equal([{
				type: 'mention',
				value: '@123',
				href: '/123'
			}, {
				type: 'mention',
				value: '@456_78910__',
				href: '/456_78910__'
			}]);
		});

	});
});
