var linkifyHtml = require('../../lib/linkify-html');
var htmlOptions = require('./html/options');

describe('linkify-html', function () {

	var options = { // test options
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
			'The URL is google.com and the email is <strong>test@example.com</strong>',
			'The URL is <a href="http://google.com" class="linkified" target="_blank">google.com</a> and the email is <strong><a href="mailto:test@example.com" class="linkified">test@example.com</a></strong>',
			'The URL is <span href="https://google.com" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">google.com</span> and the email is <strong><span href="mailto:test@example.com?subject=Hello%20from%20Linkify" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">test@example.com</span></strong>'
		], [
			'Super long maps URL https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en, a #hash-tag, and an email: test."wut".yo@gmail.co.uk!',
			'Super long maps URL <a href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="linkified" target="_blank">https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en</a>, a #hash-tag, and an email: <a href="mailto:test.&quot;wut&quot;.yo@gmail.co.uk" class="linkified">test."wut".yo@gmail.co.uk</a>!',
			'Super long maps URL <span href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">https://www.google.ca/maps/@43.472082,-8…</span>, a #hash-tag, and an email: <span href="mailto:test.&quot;wut&quot;.yo@gmail.co.uk?subject=Hello%20from%20Linkify" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">test."wut".yo@gmail.co.uk</span>!',
		], [
			'This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt http://github.com</h1>',
			'This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt <a href="http://github.com" class="linkified" target="_blank">http://github.com</a></h1>',
			'This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt <span href="http://github.com" class="my-linkify-class" target="_parent" rel="nofollow" onclick="javascript:;">http://github.com</span></h1>'
		], [
			'Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/',
			'Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/',
			'Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/'
		]
	];

	it('Works with default options', function () {
		tests.map(function (test) {
			expect(linkifyHtml(test[0])).to.be.eql(test[1]);
		});
	});

	it('Works with overriden options', function () {
		tests.map(function (test) {
			debugger;
			expect(linkifyHtml(test[0], options)).to.be.eql(test[2]);
		});
	});

	it('Works with HTML and default options', function () {
		var linkified = linkifyHtml(htmlOptions.original);
		expect(htmlOptions.linkified).to.contain(linkified);
	});

	it('Works with HTML and overriden options', function () {
		var linkified = linkifyHtml(
			htmlOptions.original,
			htmlOptions.altOptions
		);
		expect(htmlOptions.linkifiedAlt).to.contain(linkified);
	});




});
