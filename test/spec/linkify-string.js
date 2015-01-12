var linkifyStr = require('../../lib/linkify-string');

/**
	Gracefully truncate a string to a given limit. Will replace extraneous
	text with a single ellipsis character (`…`).
*/
String.prototype.truncate = function (limit) {
	var string = this.toString();
	limit = limit || Infinity;

	if (limit <= 3) {
		string = '…';
	} else if (string.length > limit) {
		string = string.slice(0, limit).split(/\s/);
		if (string.length > 1) {
			string.pop();
		}
		string = string.join(' ') + '…';
	}
	return string;
};

describe('linkify-string', function () {
	var
	options = { // test options
		tagName: 'span',
		target: '_parent',
		nl2br: true,
		linkClass: 'my-linkify-class',
		defaultProtocol: 'https',
		linkAttributes: {
			rel: 'nofollow',
			onclick: 'javascript:;'
		},
		format: function (val) {
			return val.truncate(20);
		}
	},

	// For each element in this array
	// [0] - Original text
	// [1] - Linkified with default options
	// [2] - Linkified with new options
	tests = [
		[
			'Test with no links',
			'Test with no links',
			'Test with no links'
		], [
			'The URL is google.com and the email is test@example.com',
			'The URL is <a href="http://google.com and the email is test@example.com'
		]
	];

	it('Works with default options', function () {

	});
});
