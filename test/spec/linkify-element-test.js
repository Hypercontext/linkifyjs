/*jshint -W030 */
var
doc, testContainer,
jsdom = require('jsdom'),
linkifyElement = require('../../lib/linkify-element');

try {
	doc = document;
} catch (e) {
	doc = null;
}

describe('linkify-element', function () {

	/**
		Set up the JavaScript document and the element for it
		This code allows testing on Node.js and on Browser environments
	*/
	before(function (done) {

		function onDoc(doc) {
			testContainer = doc.createElement('div');
			testContainer.id = 'linkify-test-container';

			testContainer.innerHtml =
				'Hello here are some links to ftp://awesome.com/?where=this ' +
				'and localhost:8080, pretty neat right?' +
				'<p>Here\'s a nested github.com/SoapBox/linkifyjs paragraph</p>';

			doc.body.appendChild(testContainer);
			done();
		}

		if (doc) { return onDoc(doc); }
		// no document element, use a virtual dom to test

		jsdom.env(
			'<html><head><title>Linkify Test</title></head><body></body></html>',
			function (errors, window) {
				if (errors) { throw errors; }
				doc = window.document;
				return onDoc(window.document);
			}
		);
	});

	it('Works with default options', function () {
		testContainer.should.be.type('object');
		linkifyElement(testContainer, null, doc);
		(testContainer).should.be.okay;
	});

});
