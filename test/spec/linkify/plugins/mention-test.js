/*jshint -W030 */
var
linkify = require('../../../../lib/linkify'),
mention = require('../../../../lib/linkify/plugins/mention');

describe('linkify/plugins/mention', function () {

	it('Cannot parse mentions before applying the plugin', function () {
		expect(linkify.find('There is a @mention @YOLO2015 and @1234 and @%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('@wat', 'mention')).to.not.be.ok;
		expect(linkify.test('@987', 'mention')).to.not.be.ok;
	});

	it ('Can parse mentions after applying the plugin', function () {

		mention(linkify);

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
