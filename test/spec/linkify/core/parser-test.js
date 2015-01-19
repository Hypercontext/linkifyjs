var
scanner = require('../../../../lib/linkify/core/scanner'),
parser = require('../../../../lib/linkify/core/parser'),
MULTI_TOKENS = require('../../../../lib/linkify/core/tokens').multi;

var
TEXT	= MULTI_TOKENS.TEXT,
URL		= MULTI_TOKENS.URL,
EMAIL	= MULTI_TOKENS.EMAIL;
// MNL			= MULTI_TOKENS.NL; // new line

/**
	[0] - Original text to parse (should tokenize first)
	[1] - The types of tokens the text should result in
	[2] - The values of the tokens the text should result in
*/
var tests = [
	// BEGIN: Original linkify tests
	[
		'google.com',
		[URL],
		['google.com']
	], [
		'I like google.com the most',
		[TEXT, URL, TEXT],
		['I like ', 'google.com', ' the most']
	], [
		'I like Google.com the most',
		[TEXT, URL, TEXT],
		['I like ', 'Google.com', ' the most']
	], ['there are two tests, brennan.com and nick.ca -- do they work?',
		[TEXT, URL, TEXT, URL, TEXT],
		['there are two tests, ', 'brennan.com', ' and ', 'nick.ca', ' -- do they work?']
	], [
		'there are two tests!brennan.com. and nick.ca? -- do they work?',
		[TEXT, URL, TEXT],
		['there are two tests!brennan.com. and ', 'nick.ca', '? -- do they work?']
	], [
		'This [i.imgur.com/ckSj2Ba.jpg)] should also work',
		[TEXT, URL, TEXT],
		['This [', 'i.imgur.com/ckSj2Ba.jpg', ')] should also work']
	], [
		'A link is http://nick.is.awesome/?q=nick+amazing&nick=yo%29%30hellp another is http://nick.con/?q=look',
		[TEXT, URL, TEXT],
		['A link is ', 'http://nick.is', '.awesome/?q=nick+amazing&nick=yo%29%30hellp another is http://nick.con/?q=look']
	], [
		'SOme URLS http://google.com https://google1.com google2.com google.com/search?q=potatoes+oven goo.gl/0192n1 google.com?q=asda test bit.ly/0912j www.bob.com indigo.dev.soapbox.co/mobile google.com/?q=.exe flickr.com/linktoimage.jpg',
		[TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL, TEXT, URL],
		['SOme URLS ', 'http://google.com', ' ', 'https://google1.com', ' ', 'google2.com', ' ', 'google.com/search?q=potatoes+oven', ' ', 'goo.gl/0192n1', ' ', 'google.com', '?q=asda test ', 'bit.ly/0912j', ' ', 'www.bob.com', ' ', 'indigo.dev.soapbox.co/mobile', ' ', 'google.com/?q=.exe', ' ', 'flickr.com/linktoimage.jpg'],
	], [
		'None.of these.should be.Links okay.please?',
		[TEXT],
		['None.of these.should be.Links okay.please?']
	], [
		'Here are some random emails: nick@soapbox.com, nick@soapbox.soda (invalid), Nick@dev.dev.soapbox.co, random nick.frasser_hitsend@http://facebook.com',
		[TEXT, EMAIL, TEXT, EMAIL, TEXT, URL],
		['Here are some random emails: ', 'nick@soapbox.com', ', nick@soapbox.soda (invalid), ', 'Nick@dev.dev.soapbox.co', ', random nick.frasser_hitsend@', 'http://facebook.com']
	], [
		't.c.com/sadqad is a great domain, so is ftp://i.am.a.b.ca/ okay?',
		[URL, TEXT, URL, TEXT],
		['t.c.com/sadqad', ' is a great domain, so is ', 'ftp://i.am.a.b.ca/', ' okay?']
	], [
		'This port is too short someport.com: this port is too long http://googgle.com:789023/myQuery this port is just right https://github.com:8080/SoapBox/jQuery-linkify/',
		[TEXT, URL, TEXT, URL, TEXT, URL],
		['This port is too short ', 'someport.com', ': this port is too long ', 'http://googgle.com:789023/myQuery', ' this port is just right ', 'https://github.com:8080/SoapBox/jQuery-linkify/']
	],
	// END: Original linkifiy tests
	// BEGIN: New linkify tests
	[
		'The best URL http://google.com/?love=true and t.co',
		[TEXT, URL, TEXT, URL],
		['The best URL ', 'http://google.com/?love=true', ' and ', 't.co']
	], [
		'Please email me at testy.test+123@gmail.com',
		[TEXT, EMAIL],
		['Please email me at ', 'testy.test+123@gmail.com'],
	], [
		'http://aws.amazon.com:8080/nick?was=here and localhost:3000 are also domains',
		[URL, TEXT, URL, TEXT],
		['http://aws.amazon.com:8080/nick?was=here', ' and ', 'localhost:3000', ' are also domains']
	], [
		'http://500-px.com is a real domain?',
		[URL, TEXT],
		['http://500-px.com', ' is a real domain?']
	], [
		'IP loops like email? 192.168.0.1@gmail.com works!!',
		[TEXT, EMAIL, TEXT],
		['IP loops like email? ', '192.168.0.1@gmail.com', ' works!!']
	], [
		'Url like bro-215.co with a hyphen?',
		[TEXT, URL, TEXT],
		['Url like ', 'bro-215.co', ' with a hyphen?']
	]
	// END: New linkify tests
];

describe('parser#run()', function () {

	function makeTest(test) {
		return it('Tokenizes the string "' + test[0] + '"', function () {
			var
			str = test[0],
			types = test[1],
			values = test[2],
			result = parser.run(scanner.run(str));

			result.map(function (token) { return token.constructor; })
			.should.eql(types);

			result.map(function (token) { return token.toString(); })
			.should.eql(values);
		});
	}

	tests.forEach(makeTest, this);

});
