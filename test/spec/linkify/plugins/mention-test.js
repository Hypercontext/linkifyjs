const linkify = require(`${__base}linkify`);
const mention = require(`${__base}linkify/plugins/mention`).default;

describe('linkify/plugins/mention', () => {
	it('Cannot parse mentions before applying the plugin', () => {
		expect(linkify.find('There is a @mention @YOLO2015 and @1234 and @%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('@wat', 'mention')).to.not.be.ok;
		expect(linkify.test('@987', 'mention')).to.not.be.ok;
	});

	describe('after plugin is applied', () => {
		before(() => {
			debugger;
			mention(linkify);
		});

		it ('Can parse mentions after applying the plugin', () => {
			expect(linkify.find('There is a @mention @YOLO2015 and @1234 and @%^&*( should not work'))
			.to.be.eql([{
				type: 'mention',
				value: '@mention',
				href: '@mention'
			}, {
				type: 'mention',
				value: '@YOLO2015',
				href: '@YOLO2015'
			}]);

			expect(linkify.test('@wat', 'mention')).to.be.ok;
			expect(linkify.test('@987', 'mention')).to.not.be.ok;
		});
	});
});
