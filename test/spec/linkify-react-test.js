const jsdom = require('jsdom');
const htmlOptions = require('./html/options');
const extend = require('lodash/extend');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Linkify = require(`${__base}linkify-react`).default;

const options = { // test options
	tagName: 'em',
	target: '_parent',
	nl2br: true,
	linkClass: 'my-linkify-class',
	defaultProtocol: 'https',
	linkAttributes: {
		rel: 'nofollow',
		onClick() { alert('Hello World!'); }
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
};

describe('linkify-react', () => {
	// For each element in this array
	// [0] - Original text
	// [1] - Linkified with default options
	// [2] - Linkified with new options
	var tests = [
		[
			'Test with no links',
			'<span>Test with no links</span>',
			'<div class="lambda">Test with no links</div>',
		], [
			'The URL is google.com and the email is test@example.com',
			'<span>The URL is <a href="http://google.com" class="linkified" target="_blank">google.com</a> and the email is <a href="mailto:test@example.com" class="linkified">test@example.com</a></span>',
			'<div class="lambda">The URL is <em href="https://google.com" class="my-linkify-class" target="_parent" rel="nofollow">google.com</em> and the email is <em href="mailto:test@example.com" class="my-linkify-class" target="_parent" rel="nofollow">test@example.com</em></div>',
		], [
			'Super long maps URL https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en, a #hash-tag, and an email: test.wut.yo@gmail.co.uk!\n',
			'<span>Super long maps URL <a href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="linkified" target="_blank">https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en</a>, a #hash-tag, and an email: <a href="mailto:test.wut.yo@gmail.co.uk" class="linkified">test.wut.yo@gmail.co.uk</a>!\n</span>',
			'<div class="lambda">Super long maps URL <em href="https://www.google.ca/maps/@43.472082,-80.5426668,18z?hl=en" class="my-linkify-class" target="_parent" rel="nofollow">https://www.google.ca/maps/@43.472082,-8…</em>, a #hash-tag, and an email: <em href="mailto:test.wut.yo@gmail.co.uk" class="my-linkify-class" target="_parent" rel="nofollow">test.wut.yo@gmail.co.uk</em>!<br/></div>',
		]
	];

	it('Works with default options', function () {
		tests.map((test) => {
			let linkified = React.createElement(Linkify, null, test[0]);
			let result = ReactDOMServer.renderToStaticMarkup(linkified);
			expect(result).to.be.eql(test[1]);
		});
	});

	it('Works with overriden options', function () {
		tests.map((test) => {
			let props = {options, tagName: 'div', className: 'lambda'};
			let linkified = React.createElement(Linkify, props, test[0]);
			let result = ReactDOMServer.renderToStaticMarkup(linkified);
			expect(result).to.be.eql(test[2]);
		});
	});

	it('Finds links recursively', function () {
		let strong = React.createElement(
			'strong', null, 'https://facebook.github.io/react/'
		);
		let linkified = React.createElement(Linkify, null, 'A great site is google.com AND ', strong);
		let result = ReactDOMServer.renderToStaticMarkup(linkified);
		expect(result).to.be.eql('<span>A great site is <a href="http://google.com" class="linkified" target="_blank">google.com</a> AND <strong><a href="https://facebook.github.io/react/" class="linkified" target="_blank">https://facebook.github.io/react/</a></strong></span>');
	});

	it('Excludes self-closing elements', () => {
		let Delta = React.createClass({
			render() {
				return React.createElement(
					'strong', this.props, 'https://facebook.github.io/react/'
				);
			}
		});
		let delta = React.createElement(Delta);
		let linkified = React.createElement(Linkify, null, 'A great site is google.com AND ', delta);
		let result = ReactDOMServer.renderToStaticMarkup(linkified);
		expect(result).to.be.eql('<span>A great site is <a href="http://google.com" class="linkified" target="_blank">google.com</a> AND <strong>https://facebook.github.io/react/</strong></span>');
	});
});
