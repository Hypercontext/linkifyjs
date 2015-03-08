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

	var testHtml, testHtmlLinkified;
	/**
		Set up the JavaScript document and the element for it
		This code allows testing on Node.js and on Browser environments
	*/
	before(function (done) {

		testHtml =
			'Hello here are some links to ftp://awesome.com/?where=this and '+
			'localhost:8080, pretty neat right? '+
			'<p>Here\'s a nested github.com/SoapBox/linkifyjs paragraph</p>';

		testHtmlLinkified =
			'Hello here are some links to <a ' +
			'href="ftp://awesome.com/?where=this" class="linkified" '+
			'target="_blank">ftp://awesome.com/?where=this</a> and <a ' +
			'href="http://localhost:8080" class="linkified" target="_blank">' +
			'localhost:8080</a>, pretty neat right? <p>Here\'s a nested ' +
			'<a href="http://github.com/SoapBox/linkifyjs" class="linkified" ' +
			'target="_blank">github.com/SoapBox/linkifyjs</a> paragraph</p>';

		function onDoc(doc) {
			testContainer = doc.createElement('div');
			testContainer.id = 'linkify-test-container';
			testContainer.innerHTML = testHtml;

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

	it('Has a helper function', function () {
		(linkifyElement.helper).should.be.a('function');
	});

	it('Works with default options', function () {
		(testContainer).should.be.okay;
		testContainer.should.be.a('object');
		var result = linkifyElement(testContainer, null, doc);
		result.should.eql(testContainer); // should return the same element
		testContainer.innerHTML.should.eql(testHtmlLinkified);
	});

});
