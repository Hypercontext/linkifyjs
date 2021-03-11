const linkifyHtml = require(`${__base}linkify-html`).default;
const { expect } = require('chai');
const htmlOptions = require('./html/options');

describe('linkify-html', () => {

	// For each element in this array
	// [0] - Original text
	// [1] - Linkified with default options
	// [2] - Linkified with new options
	const  tests = [
		[
			'Test with no links',
			'Test with no links',
			'Test with no links'
		], [
			'The URL is google.com and the email is <strong>test@example.com</strong>',
			'The URL is <a href="http://google.com">google.com</a> and the email is <strong><a href="mailto:test@example.com">test@example.com</a></strong>',
			'The URL is <span href="https://google.com" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">google.com</span> and the email is <strong><span href="mailto:test@example.com?subject=Hello%20from%20Linkify" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">test@example.com</span></strong>'
		], [
			'Super long maps URL https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en, a #hash-tag, and an email: test.wut.yo@gmail.co.uk!',
			'Super long maps URL <a href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en">https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en</a>, a #hash-tag, and an email: <a href="mailto:test.wut.yo@gmail.co.uk">test.wut.yo@gmail.co.uk</a>!',
			'Super long maps URL <span href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">https://www.google.ca/maps/@43.472082,-8…</span>, a #hash-tag, and an email: <span href="mailto:test.wut.yo@gmail.co.uk?subject=Hello%20from%20Linkify" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">test.wut.yo@gmail.co.uk</span>!',
		], [
			'This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt http://github.com</h1>',
			'This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt <a href="http://github.com">http://github.com</a></h1>',
			'This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt <span href="http://github.com" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">http://github.com</span></h1>'
		], [
			'Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/',
			'Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/',
			'Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/'
		], [
			'Ignore tags like <script>const a = {}; a.ca = "Hello";</script> and <style>b.com {color: blue;}</style>',
			'Ignore tags like <script>const a = {}; <a href="http://a.ca">a.ca</a> = "Hello";</script> and <style><a href="http://b.com">b.com</a> {color: blue;}</style>',
			'Ignore tags like <script>const a = {}; a.ca = "Hello";</script> and <style>b.com {color: blue;}</style>'
		], [
			'6. Link followed by nbsp escape sequence https://github.com&nbsp;',
			'6. Link followed by nbsp escape sequence <a href="https://github.com">https://github.com</a>\u00a0',
			'6. Link followed by nbsp escape sequence <span href="https://github.com" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">https://github.com</span>\u00a0'
		]
	];

	let options;
	before(() => {
		options = {
			tagName: 'span',
			target: '_parent',
			nl2br: true,
			className: 'my-linkify-class',
			defaultProtocol: 'https',
			rel: 'nofollow',
			attributes: {
				onclick: 'console.log(\'Hello World!\')'
			},
			format(val) {
				return val.truncate(40);
			},
			formatHref: {
				email: (href) => href + '?subject=Hello%20from%20Linkify'
			},
			ignoreTags: [
				'script',
				'style'
			]
		};
	});

	it('Works with default options', () => {
		tests.map(function (test) {
			expect(linkifyHtml(test[0])).to.be.eql(test[1]);
		});
	});

	it('Works with overriden options (general)', () => {
		tests.map(function (test) {
			expect(linkifyHtml(test[0], options)).to.be.eql(test[2]);
		});
	});

	it('Works with truncate options (truncate has priority in formatting chars)', () => {
		options.truncate = 30;

		expect(linkifyHtml(
			'Super long maps URL https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en',
			options
		)).to.be.eql(
			'Super long maps URL <span href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="my-linkify-class" target="_parent" rel="nofollow" onclick="console.log(\'Hello World!\')">https://www.google.ca/maps/@43…</span>'
		);
	});

	it('Works with overriden options (validate)', () => {
		const  optionsValidate = {
			validate: {
				url: function (text) {
					return /^(http|ftp)s?:\/\//.test(text) || text.slice(0,3) === 'www';
				}
			}
		};

		const testsValidate = [
			[
				'1.Test with no links',
				'1.Test with no links'
			], [
				'2.The URL is google.com and the email is <strong>test@example.com</strong>',
				'2.The URL is google.com and the email is <strong><a href="mailto:test@example.com">test@example.com</a></strong>'
			], [
				'3.Super long maps URL https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en, a #hash-tag, and an email: test.wut.yo@gmail.co.uk!',
				'3.Super long maps URL <a href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en">https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en</a>, a #hash-tag, and an email: <a href="mailto:test.wut.yo@gmail.co.uk">test.wut.yo@gmail.co.uk</a>!'
			], [
				'4a.This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt http://github.com</h1>',
				'4a.This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt <a href="http://github.com">http://github.com</a></h1>'
			], [
				'4b.This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt github.com</h1>',
				'4b.This link is already in an anchor tag <a href="#bro">google.com</a> LOL and this one <h1>isnt github.com</h1>'
			], [
				'5.Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/',
				'5.Unterminated anchor tag <a href="http://google.com"> This <em>is a link google.com</em> and this works!! https://reddit.com/r/photography/'
			]
		];

		testsValidate.map(function (test) {
			expect(linkifyHtml(test[0], optionsValidate)).to.be.eql(test[1]);
		});
	});

	it('Works with HTML and default options', () => {
		const linkified = linkifyHtml(htmlOptions.original);
		expect(linkified).to.be.oneOf(htmlOptions.linkified);
	});

	it('Works with HTML and overriden options', () => {
		const linkified = linkifyHtml(
			htmlOptions.original,
			htmlOptions.altOptions
		);
		expect(linkified).to.be.oneOf(htmlOptions.linkifiedAlt);
	});

	it('Treats null target options properly', () => {
		let linkified = linkifyHtml('http://google.com', { target: { url: null }});
		expect(linkified).to.be.eql('<a href="http://google.com">http://google.com</a>');

		linkified = linkifyHtml('http://google.com', { target: null });
		expect(linkified).to.be.eql('<a href="http://google.com">http://google.com</a>');
	});

	it('Handles HTML with doctype', () => {
		const input = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:rn="http://schemas.rightnow.com/crm/document">
		<head>
		<link rel="stylesheet" type="text/css" href="style.css">
		</head>
		<body style="FONT-FAMILY: Segoe UI, Verdana, sans-serif">

		<div>
		<div id="checksum" align="right">
		<span style="font-size: 1pt">
		[---002:000651:00385---]
		</span>
		</div>
		</div>
		</body>
		</html>`;
		expect(linkifyHtml(input)).to.eql(input); // no change
	});

	it('Hadnles mixed-language content', () => {
		const input = '這禮拜是我們新的循環 (3/23-4/19), 我將於這週日給 Jeffrey 補課，並且我們會在這期間選另外一個可以上課的日期。';
		expect(linkifyHtml(input)).to.be.ok;
	});
});
