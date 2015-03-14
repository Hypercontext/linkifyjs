var
linkify = require('../../lib/linkify'),
MultiToken = linkify.parser.TOKENS.Base;

var tokensTest = [
	'The string is the URL https://github.com/ but www.gihub.com/search?utf8=✓ works too with the email test@example.com the end.',
	['text', 'url', 'text', 'url', 'text', 'email', 'text'],
	[{
		type: 'url',
		value: 'https://github.com/',
		href: 'https://github.com/'
	}, {
		type: 'url',
		value: 'www.gihub.com/search?utf8=✓',
		href: 'http://www.gihub.com/search?utf8=✓'
	}, {
		type: 'email',
		value: 'test@example.com',
		href: 'mailto:test@example.com'
	}],
];

describe('linkify', function () {
	it('Has all required methods and properties', function () {

		// Functions
		linkify.tokenize.should.be.a('function');
		linkify.tokenize.length.should.be.eql(1);
		linkify.find.should.be.a('function');
		linkify.find.length.should.be.eql(1); // type is optional
		linkify.test.should.be.a('function');
		linkify.test.length.should.be.eql(1); // type is optional

		// Properties
		linkify.options.should.be.a('object');
		linkify.parser.should.be.a('object');
		linkify.scanner.should.be.a('object');

	});
});

describe('linkify.tokenize', function () {
});

describe('linkify.find', function () {

});

describe('linkify.test', function () {
	/*
		For each element,

		* [0] is the input string
		* [1] is the expected return value
		* [2] (optional) the type of link to look for
	*/
	var tests = [
		['Herp derp', false],
		['Herp derp', false, 'email'],
		['Herp derp', false, 'asdf'],
		['https://google.com/?q=yey', true],
		['https://google.com/?q=yey', true, 'url'],
		['https://google.com/?q=yey', false, 'email'],
		['test+4@uwaterloo.ca', true],
		['test+4@uwaterloo.ca', false, 'url'],
		['test+4@uwaterloo.ca', true, 'email'],
		['t.co', true],
		['t.co g.co', false], // can only be one
		['test@g.co t.co', false] // can only be one
	];

	it('Correctly tests each example string', function () {
		var test;
		for (var i = 0; i < tests.length; i++) {
			test = tests[i];
			linkify.test(test[0], test[2]).should.be.eql(test[1]);
		}
	});

});
