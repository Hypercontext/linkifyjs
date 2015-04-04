/*jshint -W030 */
var
doc, testContainer, jsdom, Ev,
linkifyElement = require('../../lib/linkify-element'),
htmlOptions = require('./html/options');

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
			testContainer.id = 'linkify-element-test-container';

			doc.body.appendChild(testContainer);
			done();
		}

		if (doc) {
			Ev = window.Event;
			return onDoc(doc);
		}

		// no document element, use a virtual dom to test
		jsdom = require('jsdom');

		jsdom.env(
			'<html><head><title>Linkify Test</title></head><body></body></html>',
			function (errors, window) {
				if (errors) { throw errors; }
				doc = window.document;
				Ev = window.Event;
				return onDoc(window.document);
			}
		);
	});

	beforeEach(function () {
		// Make sure we start out with a fresh DOM every time
		testContainer.innerHTML = htmlOptions.original;
	});

	it('Has a helper function', function () {
		(linkifyElement.helper).should.be.a('function');
	});

	it('Works with default options', function () {
		(testContainer).should.be.okay;
		testContainer.should.be.a('object');
		var result = linkifyElement(testContainer, null, doc);
		result.should.eql(testContainer); // should return the same element
		testContainer.innerHTML.should.eql(htmlOptions.linkified);
	});

	it('Works with overriden options', function () {
		(testContainer).should.be.okay;
		testContainer.should.be.a('object');
		var result = linkifyElement(testContainer, htmlOptions.altOptions, doc);
		result.should.eql(testContainer); // should return the same element
		testContainer.innerHTML.should.eql(htmlOptions.linkifiedAlt);

		/*
		// These don't work across all test suites :(
		(function () {
			testContainer.getElementsByTagName('a')[0].dispatchEvent(new Ev('click'));
		}).should.throw('Clicked!');

		(function () {
			testContainer.getElementsByTagName('a')[0].dispatchEvent(new Ev('mouseover'));
		}).should.throw('Hovered!');
		*/
	});

});
