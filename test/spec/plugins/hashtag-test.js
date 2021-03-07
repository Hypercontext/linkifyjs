const linkify = require(`${__base}linkify`);
const { hashtag } = require(`${__base}plugins/hashtag`);

describe('plugins/hashtag', () => {
	it('cannot parse hashtags before applying the plugin', () => {
		expect(linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('#wat', 'hashtag')).to.not.be.ok;
		expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
	});

	describe('after plugin is applied', () => {
		beforeEach(() => { linkify.registerPlugin('hashtag', hashtag); });

		it ('can parse hashtags after applying the plugin', () => {
			expect(linkify.find('There is a #hashtag #YOLO-2015 #__swag__ and #1234 and #%^&*( #_ #__ should not work'))
			.to.be.eql([{
				type: 'hashtag',
				value: '#hashtag',
				href: '#hashtag'
			}, {
				type: 'hashtag',
				value: '#YOLO-2015',
				href: '#YOLO-2015'
			}, {
				type: 'hashtag',
				value: '#__swag__',
				href: '#__swag__'
			}]);

			expect(linkify.test('#wat', 'hashtag')).to.be.ok;
			expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
		});
	});
});
