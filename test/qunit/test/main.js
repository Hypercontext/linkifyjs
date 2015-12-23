/**
	Linkify basic global tests
*/
QUnit.assert.oneOf = function (value, possibleExpected, message) {
	message = message || 'Expected ' + value + ' to be contained in ' + possibleExpected + '.';
	this.push(possibleExpected.indexOf(value) >= 0, value, possibleExpected, message);
};

QUnit.module('linkify');

QUnit.test('exists in window', function (assert) {
	assert.ok('linkify' in w);
});

QUnit.test('contains find function', function (assert) {
	assert.ok('find' in w.linkify);
	assert.equal(typeof w.linkify.find, 'function');
});

QUnit.test('contains test function', function (assert) {
	assert.ok('test' in w.linkify);
	assert.equal(typeof w.linkify.test, 'function');
});

QUnit.test('contains tokenize function', function (assert) {
	assert.ok('tokenize' in w.linkify);
	assert.equal(typeof w.linkify.tokenize, 'function');
});

QUnit.test('contains an options object', function (assert) {
	assert.ok('options' in w.linkify);
	assert.equal(typeof w.linkify.options, 'object');
});

QUnit.test('contains a parser object', function (assert) {
	assert.ok('parser' in w.linkify);
	assert.equal(typeof w.linkify.parser, 'object');
});

QUnit.test('contains a scanner object', function (assert) {
	assert.ok('scanner' in w.linkify);
	assert.equal(typeof w.linkify.scanner, 'object');
});


QUnit.module('linkify.find');

QUnit.test('linkify.find correctly finds a URL', function (assert) {
	var result = w.linkify.find('The url is github.com');
	assert.equal(result.length, 1);
	assert.equal(result[0].type, 'url');
	assert.equal(result[0].value, 'github.com');
	assert.equal(result[0].href, 'http://github.com');
});

QUnit.test('linkify.find correctly finds an email address', function (assert) {
	var result = w.linkify.find('The url is github.com and the email is test@example.com', 'email');
	assert.equal(result.length, 1);
	assert.equal(result[0].type, 'email');
	assert.equal(result[0].value, 'test@example.com');
	assert.equal(result[0].href, 'mailto:test@example.com');
});


QUnit.module('linkify.test');

QUnit.test('correctly identifies a URL as a link', function (assert) {
	assert.ok(w.linkify.test('github.com'));
});

QUnit.test('correctly identifies a URL as NOT an email', function (assert) {
	assert.notOk(w.linkify.test('github.com', 'email'));
});

QUnit.test('correctly identifies text as not an email', function (assert) {
	assert.notOk(w.linkify.test('gobbledegook'));
});


QUnit.module('linkify.options');

QUnit.test('contains normalize function', function (assert) {
	assert.ok('normalize' in w.linkify.options);
	assert.equal(typeof w.linkify.options.normalize, 'function');
});

QUnit.test('contains resolve function', function (assert) {
	assert.ok('resolve' in w.linkify.options);
	assert.equal(typeof w.linkify.options.resolve, 'function');
});


QUnit.module('linkify.options.normalize');

QUnit.test('returns in the hash of default options when given an empty object', function (assert) {
	var result = w.linkify.options.normalize({});
	assert.propEqual(result, {
		attributes: null,
		defaultProtocol: 'http',
		events: null,
		format: function () {},
		formatHref: function () {},
		newLine: false, // deprecated
		nl2br: false,
		tagName: 'a',
		target: function () {},
		linkClass: 'linkified'
	});
	assert.equal(typeof result.format, 'function');
	assert.equal(result.format('test'), 'test');
	assert.equal(typeof result.formatHref, 'function');
	assert.equal(result.formatHref('test'), 'test');
	assert.equal(typeof result.target, 'function');
	assert.equal(result.target('test', 'url'), '_blank');
	assert.equal(result.target('email'), null);
});


QUnit.module('linkify.options.resolve');

QUnit.test('results in the value given when called with a non-function', function (assert) {
	var result0 = 0;
	var result1 = 1;
	var result2 = 'test';
	var result3 = {test: 'test'};

	assert.equal(w.linkify.options.resolve(result0), result0);
	assert.equal(w.linkify.options.resolve(result1), result1);
	assert.equal(w.linkify.options.resolve(result2), result2);
	assert.equal(w.linkify.options.resolve(result3), result3);
});

QUnit.test('Results the results of the function when called with a function and arguments', function (assert) {
	function concat(str1, str2) {
		return str1 + str2;
	}

	assert.equal(
		w.linkify.options.resolve(concat, 'testone', 'testtwo'), 'testonetesttwo'
	);
});


QUnit.module('linkify-plugin-hashtag');

QUnit.test('finds valid hashtags', function (assert) {
	var result = w.linkify.find('#urls are #awesome2015');
	assert.deepEqual(result, [{
		type: 'hashtag',
		value: '#urls',
		href: '#urls',
	}, {
		type: 'hashtag',
		value: '#awesome2015',
		href: '#awesome2015'
	}]);
});

// HTML rendered in body
var originalHtml = 'Hello here are some links to ftp://awesome.com/?where=this and localhost:8080, pretty neat right? <p>Here\'s a nested github.com/SoapBox/linkifyjs paragraph</p>';

// Possible results with regular settings (will vary by browser)
var linkifiedHtml = [
	'Hello here are some links to <a href="ftp://awesome.com/?where=this" class="linkified" target="_blank">ftp://awesome.com/?where=this</a> and <a href="http://localhost:8080" class="linkified" target="_blank">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a href="http://github.com/SoapBox/linkifyjs" class="linkified" target="_blank">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	'Hello here are some links to <a target="_blank" class="linkified" href="ftp://awesome.com/?where=this">ftp://awesome.com/?where=this</a> and <a target="_blank" class="linkified" href="http://localhost:8080">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a target="_blank" class="linkified" href="http://github.com/SoapBox/linkifyjs">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	'Hello here are some links to <a class="linkified" href="ftp://awesome.com/?where=this" target="_blank">ftp://awesome.com/?where=this</a> and <a class="linkified" href="http://localhost:8080" target="_blank">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a class="linkified" href="http://github.com/SoapBox/linkifyjs" target="_blank">github.com/SoapBox/linkifyjs</a> paragraph</p>'
];

// Possible results with overriden settings
var linkifiedHtmlAlt = [
	'Hello here are some links to <a href="ftp://awesome.com/?where=this" class="linkified" target="_blank" rel="nofollow">ftp://awesome.com/?where=this</a> and <a href="http://localhost:8080" class="linkified" target="_blank" rel="nofollow">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a href="http://github.com/SoapBox/linkifyjs" class="linkified" target="_blank" rel="nofollow">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	'Hello here are some links to <a rel="nofollow" target="_blank" class="linkified" href="ftp://awesome.com/?where=this">ftp://awesome.com/?where=this</a> and <a rel="nofollow" target="_blank" class="linkified" href="http://localhost:8080">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a rel="nofollow" target="_blank" class="linkified" href="http://github.com/SoapBox/linkifyjs">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	'Hello here are some links to <a class="linkified" href="ftp://awesome.com/?where=this" target="_blank" rel="nofollow">ftp://awesome.com/?where=this</a> and <a class="linkified" href="http://localhost:8080" target="_blank" rel="nofollow">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a class="linkified" href="http://github.com/SoapBox/linkifyjs" target="_blank" rel="nofollow">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	'Hello here are some links to <a class="linkified" href="ftp://awesome.com/?where=this" rel="nofollow" target="_blank">ftp://awesome.com/?where=this</a> and <a class="linkified" href="http://localhost:8080" rel="nofollow" target="_blank">localhost:8080</a>, pretty neat right? <p>Here\'s a nested <a class="linkified" href="http://github.com/SoapBox/linkifyjs" rel="nofollow" target="_blank">github.com/SoapBox/linkifyjs</a> paragraph</p>'
];

QUnit.module('linkify-jquery', {
	beforeEach: function () {
		var $elem = jQuery('<div id="linkify-test-elem"/>');
		$elem.html(originalHtml);
		jQuery('body').append($elem);
	},
	afterEach: function () {
		jQuery('#linkify-test-elem').remove();
	}
});

QUnit.test('jQuery plugin exists', function (assert) {
	assert.ok('linkify' in jQuery.fn);
	assert.equal(typeof jQuery.fn.linkify, 'function');
});

QUnit.test('works with default options', function (assert) {
	var $elem = jQuery('#linkify-test-elem').linkify();
	assert.oneOf($elem.html(), linkifiedHtml);
});

QUnit.test('works with overriden options', function (assert) {
	var $elem = jQuery('#linkify-test-elem').linkify({
		linkAttributes: {
			rel: 'nofollow'
		}
	});
	assert.oneOf($elem.html(), linkifiedHtmlAlt);
});

QUnit.module('linkify-element', {
	beforeEach: function () {
		var $elem = jQuery('<div id="linkify-test-elem"/>');
		$elem.html(originalHtml);
		jQuery('body').append($elem);
	},
	afterEach: function () {
		jQuery('#linkify-test-elem').remove();
	}
});

QUnit.test('linkifyElement exists', function (assert) {
	assert.ok('linkifyElement' in w);
	assert.equal(typeof w.linkifyElement, 'function');
});

QUnit.test('works with default options', function (assert) {
	var elem = document.getElementById('linkify-test-elem');
	w.linkifyElement(elem);
	assert.oneOf(jQuery(elem).html(), linkifiedHtml);
});

QUnit.test('works with overriden options', function (assert) {
	var elem = document.getElementById('linkify-test-elem');
	w.linkifyElement(elem, {
		linkAttributes: {
			rel: 'nofollow'
		}
	});
	assert.oneOf(jQuery(elem).html(), linkifiedHtmlAlt);
});


QUnit.module('linkify-html');

QUnit.test('linkifyHtml exists', function (assert) {
	assert.ok('linkifyHtml' in w);
	assert.equal(typeof w.linkifyHtml, 'function');
});

QUnit.test('works with default options', function (assert) {
	var result = w.linkifyHtml(originalHtml);
	assert.equal(result, linkifiedHtml[0]);
});

QUnit.test('works with overriden options', function (assert) {
	var result = w.linkifyHtml(originalHtml, {
		linkAttributes: {
			rel: 'nofollow'
		}
	});
	assert.equal(result, linkifiedHtmlAlt[0]);
});


QUnit.module('linkify-string');

QUnit.test('linkifyStr exists', function (assert) {
	assert.ok('linkifyStr' in w);
	assert.equal(typeof w.linkifyStr, 'function');
});

QUnit.test('works with default options', function (assert) {
	var result = w.linkifyStr('google.ca and me@gmail.com');
	assert.equal(result, '<a href="http://google.ca" class="linkified" target="_blank">google.ca</a> and <a href="mailto:me@gmail.com" class="linkified">me@gmail.com</a>');
});

QUnit.test('works with overriden options', function (assert) {
	var result = w.linkifyStr('google.ca and me@gmail.com', {
		linkAttributes: {
			rel: 'nofollow'
		}
	});
	assert.equal(result, '<a href="http://google.ca" class="linkified" target="_blank" rel="nofollow">google.ca</a> and <a href="mailto:me@gmail.com" class="linkified" rel="nofollow">me@gmail.com</a>');
});
