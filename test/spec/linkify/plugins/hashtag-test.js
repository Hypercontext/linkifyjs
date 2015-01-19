/*jshint -W030 */
var
linkify = require('../../../../lib/linkify'),
hashtag = require('../../../../lib/linkify/plugins/hashtag');

describe('Linkify Hashtag Plugin', function () {

	it('Cannot parse hashtags before applying the plugin', function () {
		linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work')
		.should.be.eql([]);

		linkify.test('#wat', 'hashtag').should.not.be.ok;
		linkify.test('#987', 'hashtag').should.not.be.ok;
	});

	it ('Can parse hashtags after applying the plugin', function () {

		hashtag(linkify);

		linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work')
		.should.be.eql([{
			type: 'hashtag',
			value: '#hashtag',
			href: '#hashtag'
		}, {
			type: 'hashtag',
			value: '#YOLO-2015',
			href: '#YOLO-2015'
		}]);

		linkify.test('#wat', 'hashtag').should.be.ok;
		linkify.test('#987', 'hashtag').should.not.be.ok;
	});
});
