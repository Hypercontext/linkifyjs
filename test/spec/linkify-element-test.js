/*jshint -W030 */
var
doc, testContainer, jsdom, Ev,
linkifyElement = require('../../lib/linkify-element').default,
htmlOptions = require('./html/options');

try {
	doc = document;
} catch (e) {
	doc = null;
}

jsdom = doc ? null : require('jsdom');

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
		expect(linkifyElement.helper).to.be.a('function');
	});

	it('Works with default options', function () {
		expect(testContainer).to.be.ok;
		expect(testContainer).to.be.a('object');
		var result = linkifyElement(testContainer, null, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(htmlOptions.linkified).to.contain(testContainer.innerHTML);
	});

	it('Works with overriden options (general)', function () {
		expect(testContainer).to.be.ok;
		expect(testContainer).to.be.a('object');
		var result = linkifyElement(testContainer, htmlOptions.altOptions, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(htmlOptions.linkifiedAlt).to.contain(testContainer.innerHTML);

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

	it('Works with overriden options (validate)', function () {
		expect(testContainer).to.be.ok;
		expect(testContainer).to.be.a('object');
		var result = linkifyElement(testContainer, htmlOptions.validateOptions, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(htmlOptions.linkifiedValidate).to.contain(testContainer.innerHTML);
	});
});
