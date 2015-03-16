/*jshint -W030 */
var
$, doc, testContainer, jsdom,
applyLinkify = require('../../lib/linkify-jquery'),
htmlOptions = require('./html/options');

try {
	doc = document;
	$ = require('jquery'); // should be available through Browserify
} catch (e) {
	doc = null;
	$ = null;
}

describe('linkify-jquery', function () {

	/**
		Set up the JavaScript document and the element for it
		This code allows testing on Node.js and on Browser environments
	*/
	before(function (done) {

		function onDoc($, doc) {

			doc.body.innerHTML = htmlOptions.extra;

			// Add the linkify plugin to jQuery
			applyLinkify($, doc);
			$(doc).trigger('ready');

			testContainer = doc.createElement('div');
			testContainer.id = 'linkify-jquery-test-container';

			doc.body.appendChild(testContainer);
			done();
		}

		if (doc) { return onDoc($, doc); }
		// no document element, use a virtual dom to test

		jsdom = require('jsdom');
		jsdom.env(
			'<html><head><title>Linkify Test</title></head><body></body></html>',
			['http://code.jquery.com/jquery.js'],
			function (errors, window) {
				if (errors) { throw errors; }
				doc = window.document;
				$ = window.$; // this is pretty weird
				return onDoc(window.$, window.document);
			}
		);
	});

	beforeEach(function () {
		// Make sure we start out with a fresh DOM every time
		testContainer.innerHTML = htmlOptions.original;
	});

	it('Works with the DOM Data API', function () {
		$('header').first().html().should.be.eql(
			'Have a link to:<br><a href="https://github.com" class="linkified" target="_blank">github.com</a>!'
		);
		$('#linkify-test-div').html().should.be.eql(
			'Another <i href="mailto:test@gmail.com" class="test-class" ' +
			'target="_parent">test@gmail.com</i> email as well as a <i '+
			'href="http://t.co" class="test-class" target="_parent">' +
			'http://t.co</i> link.'
		);
	});

	it('Works with default options', function () {
		var $container = $('#linkify-jquery-test-container');
		($container.length).should.be.eql(1);
		var result = $container.linkify();
		(result === $container).should.be.true; // should return the same element
		$container.html().should.eql(htmlOptions.linkified);
	});

	it('Works with overriden options', function () {
		var $container = $('#linkify-jquery-test-container');
		($container.length).should.be.eql(1);
		var result = $container.linkify(htmlOptions.altOptions);
		(result === $container).should.be.true; // should return the same element
		$container.html().should.eql(htmlOptions.linkifiedAlt);
	});
});
