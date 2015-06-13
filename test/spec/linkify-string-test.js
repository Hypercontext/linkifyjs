/*jshint scripturl:true*/

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
			return val.truncate(40);
		},
		formatHref: function (href, type) {
			if (type === 'email') {
				href += '?subject=Hello%20from%20Linkify';
			}
			return href;
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
			'The URL is <a href="http://google.com" class="linkified" target="_blank">google.com</a> and the email is <a href="mailto:test@example.com" class="linkified">test@example.com</a>',
			'The URL is <span href="https://google.com" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">google.com</span> and the email is <span href="mailto:test@example.com?subject=Hello%20from%20Linkify" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">test@example.com</span>'
		], [
			'Super long maps URL https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en, a #hash-tag, and an email: test."wut".yo@gmail.co.uk!\n',
			'Super long maps URL <a href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="linkified" target="_blank">https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en</a>, a #hash-tag, and an email: <a href="mailto:test.&quot;wut&quot;.yo@gmail.co.uk" class="linkified">test."wut".yo@gmail.co.uk</a>!\n',
			'Super long maps URL <span href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">https://www.google.ca/maps/@43.472082,-8…</span>, a #hash-tag, and an email: <span href="mailto:test.&quot;wut&quot;.yo@gmail.co.uk?subject=Hello%20from%20Linkify" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">test."wut".yo@gmail.co.uk</span>!<br>\n',
		]
	];

	it('Works with default options', function () {
		tests.map(function (test) {
			expect(linkifyStr(test[0])).to.be.eql(test[1]);
		});
	});

	it('Works with overriden options', function () {
		tests.map(function (test) {
			expect(linkifyStr(test[0], options)).to.be.eql(test[2]);
		});
	});
});
