const linkify = require('linkifyjs');
const { hashtag } = require('linkifyjs/src/plugins/hashtag');

describe('plugins/hashtag', () => {
	beforeEach(() => { linkify.reset(); });

	it('cannot parse hashtags before applying the plugin', () => {
		expect(linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('#wat', 'hashtag')).to.not.be.ok;
		expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
	});

	describe('after plugin is applied', () => {
		it ('can parse hashtags after applying the plugin', () => {
			linkify.registerPlugin('hashtag', hashtag);
			expect(linkify.find('There is a #hashtag #YOLO-2015 #__swag__ and #1234 and #%^&*( #_ #__ should not work'))
			.to.be.eql([{
				type: 'hashtag',
				value: '#hashtag',
				href: '#hashtag',
				isLink: true,
				start: 11,
				end: 19
			}, {
				type: 'hashtag',
				value: '#YOLO-2015',
				href: '#YOLO-2015',
				isLink: true,
				start: 20,
				end: 30
			}, {
				type: 'hashtag',
				value: '#__swag__',
				href: '#__swag__',
				isLink: true,
				start: 31,
				end: 40
			}]);

			expect(linkify.test('#wat', 'hashtag')).to.be.ok;
			expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
		});
	});
});
