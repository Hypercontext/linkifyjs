/*jshint -W030 */
var
linkify = require('../../../../lib/linkify'),
hashtag = require('../../../../lib/linkify/plugins/hashtag');

describe('linkify/plugins/hashtag', function () {

	it('Cannot parse hashtags before applying the plugin', function () {
		expect(linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('#wat', 'hashtag')).to.not.be.ok;
		expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
	});

	it ('Can parse hashtags after applying the plugin', function () {

		hashtag(linkify);

		expect(linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work'))
		.to.be.eql([{
			type: 'hashtag',
			value: '#hashtag',
			href: '#hashtag'
		}, {
			type: 'hashtag',
			value: '#YOLO-2015',
			href: '#YOLO-2015'
		}]);

		expect(linkify.test('#wat', 'hashtag')).to.be.ok;
		expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
	});
});
