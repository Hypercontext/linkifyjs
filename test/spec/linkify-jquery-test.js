/*jshint -W030 */
var
$, doc, testContainer, jsdom,
applyLinkify = require('../../lib/linkify-jquery'),
htmlOptions = require('./html/options');

if (typeof Object.create != 'function') {
  // Production steps of ECMA-262, Edition 5, 15.2.3.5
  // Reference: http://es5.github.io/#x15.2.3.5
  Object.create = (function() {
    // To save on memory, use a shared constructor
    function Temp() {}

    // make a safe reference to Object.prototype.hasOwnProperty
    var hasOwn = Object.prototype.hasOwnProperty;

    return function (O) {
      // 1. If Type(O) is not Object or Null throw a TypeError exception.
      if (typeof O != 'object') {
        throw TypeError('Object prototype may only be an Object or null');
      }

      // 2. Let obj be the result of creating a new object as if by the
      //    expression new Object() where Object is the standard built-in
      //    constructor with that name
      // 3. Set the [[Prototype]] internal property of obj to O.
      Temp.prototype = O;
      var obj = new Temp();
      Temp.prototype = null; // Let's not keep a stray reference to O...

      // 4. If the argument Properties is present and not undefined, add
      //    own properties to obj as if by calling the standard built-in
      //    function Object.defineProperties with arguments obj and
      //    Properties.
      if (arguments.length > 1) {
        // Object.defineProperties does ToObject on its first argument.
        var Properties = Object(arguments[1]);
        for (var prop in Properties) {
          if (hasOwn.call(Properties, prop)) {
            obj[prop] = Properties[prop];
          }
        }
      }

      // 5. Return obj
      return obj;
    };
  })();
}

try {
	doc = document;
	$ = require('jquery'); // should be available through Browserify
} catch (e) {
	doc = null;
	$ = null;
}

describe('linkify-jquery', function () {

	// Sometimes jQuery is slow to load
	this.timeout(10000);

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

	// This works but is inconsistent across browsers
	xit('Works with the DOM Data API', function () {
		expect($('header').first().html()).to.be.eql(
			'Have a link to:<br><a href="https://github.com" class="linkified" target="_blank">github.com</a>!'
		);
		expect($('#linkify-test-div').html()).to.be.eql(
			'Another <i href="mailto:test@gmail.com" class="test-class" ' +
			'target="_parent">test@gmail.com</i> email as well as a <i '+
			'href="http://t.co" class="test-class" target="_parent">' +
			'http://t.co</i> link.'
		);
	});

	it('Works with default options', function () {
		var $container = $('#linkify-jquery-test-container');
		expect(($container.length)).to.be.eql(1);
		var result = $container.linkify();
		// `should` is not defined on jQuery objects
		expect((result === $container)).to.be.ok; // should return the same element
		expect(htmlOptions.linkified).to.contain($container.html());
	});

	it('Works with overriden options (general)', function () {
		var $container = $('#linkify-jquery-test-container');
		expect(($container.length)).to.be.eql(1);
		var result = $container.linkify(htmlOptions.altOptions);
		// `should` is not defined on jQuery objects
		expect((result === $container)).to.be.ok; // should return the same element
		expect(htmlOptions.linkifiedAlt).to.contain($container.html());
	});

	it('Works with overriden options (validate)', function () {
		var $container = $('#linkify-jquery-test-container');
		expect(($container.length)).to.be.eql(1);
		var result = $container.linkify(htmlOptions.validateOptions);
		// `should` is not defined on jQuery objects
		expect((result === $container)).to.be.ok; // should return the same element
		expect(htmlOptions.linkifiedValidate).to.contain($container.html());
	});
});
