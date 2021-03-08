const scanner = require(`${__base}linkify/core/scanner`);
const parser = require(`${__base}linkify/core/parser`);
const MULTI_TOKENS = require(`${__base}linkify/core/tokens`).multi;

const TEXT = MULTI_TOKENS.TEXT;
const URL = MULTI_TOKENS.URL;
const EMAIL = MULTI_TOKENS.EMAIL;
const MAILTOEMAIL = MULTI_TOKENS.MAILTOEMAIL;

/**
	[0] - Original text to parse (should tokenize first)
	[1] - The types of tokens the text should result in
	[2] - The values of the tokens the text should result in
*/
var tests = [
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
		[TEXT, URL, TEXT, URL, TEXT],
		['there are two tests!', 'brennan.com', '. and ', 'nick.ca', '? -- do they work?']
	], [
		'This [i.imgur.com/ckSj2Ba.jpg)] should also work',
		[TEXT, URL, TEXT],
		['This [', 'i.imgur.com/ckSj2Ba.jpg', ')] should also work']
	], [
		'A link is http://nick.is.awesome/?q=nick+amazing&nick=yo%29%30hellp another is http://nick.con/?q=look',
		[TEXT, URL, TEXT, URL],
		['A link is ', 'http://nick.is.awesome/?q=nick+amazing&nick=yo%29%30hellp', ' another is ', 'http://nick.con/?q=look']
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
	], [
		'The best URL http://google.com/?love=true, and t.co',
		[TEXT, URL, TEXT, URL],
		['The best URL ', 'http://google.com/?love=true', ', and ', 't.co']
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
		'IP loops like email? 192.168.0.1@gmail.com! works!!',
		[TEXT, EMAIL, TEXT],
		['IP loops like email? ', '192.168.0.1@gmail.com', '! works!!']
	], [
		'Url like bro-215.co; with a hyphen?',
		[TEXT, URL, TEXT],
		['Url like ', 'bro-215.co', '; with a hyphen?']
	], [
		'This URL http://23456789098.sydney is a number',
		[TEXT, URL, TEXT],
		['This URL ', 'http://23456789098.sydney', ' is a number']
	], [
		'This URL http://23456789098.sydney is a number',
		[TEXT, URL, TEXT],
		['This URL ', 'http://23456789098.sydney', ' is a number']
	], [
		'A URL with only numbers is 123.456.ca another is //7.8.com/?wat=1 is valid',
		[TEXT, URL, TEXT, URL, TEXT],
		['A URL with only numbers is ', '123.456.ca', ' another is ', '//7.8.com/?wat=1', ' is valid']
	], [
		'URL Numbers 6.wat.78.where.eu and u.0.e.9.kp',
		[TEXT, URL, TEXT, URL],
		['URL Numbers ', '6.wat.78.where.eu', ' and ', 'u.0.e.9.kp']
	], [
		'Emails like nick:f@gmail.com do not have colons in them',
		[TEXT, EMAIL, TEXT],
		['Emails like nick:', 'f@gmail.com', ' do not have colons in them']
	], [
		'Emails cannot have two dots, e.g.: nick..f@yahoo.ca',
		[TEXT, EMAIL],
		['Emails cannot have two dots, e.g.: nick..', 'f@yahoo.ca']
	], [
		'The `mailto:` part should be included in mailto:this.is.a.test@yandex.ru',
		[TEXT, MAILTOEMAIL],
		['The `mailto:` part should be included in ', 'mailto:this.is.a.test@yandex.ru']
	], [
		'mailto:echalk-dev@logicify.com?Subject=Hello%20again is another test',
		[MAILTOEMAIL, TEXT],
		['mailto:echalk-dev@logicify.com?Subject=Hello%20again', ' is another test']
	], [
		'Mailto is greedy mailto:localhost?subject=Hello%20World.',
		[TEXT, MAILTOEMAIL, TEXT],
		['Mailto is greedy ', 'mailto:localhost?subject=Hello%20World', '.']
	], [
		'Emails like: test@42.domain.com and test@42.abc.11.domain.com should be matched in its entirety.',
		[TEXT, EMAIL, TEXT, EMAIL, TEXT],
		['Emails like: ', 'test@42.domain.com', ' and ', 'test@42.abc.11.domain.com', ' should be matched in its entirety.']
	], [
		'Bu haritanın verileri Direniş İzleme Grubu\'nun yaptığı Türkiye İşçi Eylemleri haritası ile birleşebilir esasen. https://graphcommons.com/graphs/00af1cd8-5a67-40b1-86e5-32beae436f7c?show=Comments',
		[TEXT, URL],
		['Bu haritanın verileri Direniş İzleme Grubu\'nun yaptığı Türkiye İşçi Eylemleri haritası ile birleşebilir esasen. ', 'https://graphcommons.com/graphs/00af1cd8-5a67-40b1-86e5-32beae436f7c?show=Comments']
	], [
		'Links with brackets and parens https://en.wikipedia.org/wiki/Blur_[band] wat',
		[TEXT, URL, TEXT],
		['Links with brackets and parens ', 'https://en.wikipedia.org/wiki/Blur_[band]', ' wat'],
	], [
		'This has dots {https://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx}',
		[TEXT, URL, TEXT],
		['This has dots {', 'https://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx', '}']
	], [ // This test is correct, will count nested brackets as being part of the first
		'A really funky one (example.com/?id=asd2{hellow}and%20it%20continues(23&((@)) and it ends',
		[TEXT, URL, TEXT],
		['A really funky one (', 'example.com/?id=asd2{hellow}and%20it%20continues(23&((@)', ') and it ends']
	], [
		'URL enclosed in angle brackets: <http://example.com/exemplary> should not include trailing bracket',
		[TEXT, URL, TEXT],
		['URL enclosed in angle brackets: <', 'http://example.com/exemplary', '> should not include trailing bracket']
	], [
		'URL with angle brackets in it: http://example.com/exemplary_<remix> should be included',
		[TEXT, URL, TEXT],
		['URL with angle brackets in it: ', 'http://example.com/exemplary_<remix>', ' should be included']
	], [
		'Force http:/ and http:// are not but http://a and http://b.local?qeasd3qas=23 are all links',
		[TEXT, URL, TEXT, URL, TEXT],
		['Force http:/ and http:// are not but ', 'http://a', ' and ', 'http://b.local?qeasd3qas=23', ' are all links']
	], [
		'HTTP Auth URLs should work: http://username:password@example.com',
		[TEXT, URL],
		['HTTP Auth URLs should work: ', 'http://username:password@example.com']
	], [
		'Trailing equal symbol should work: http://example.com/foo/bar?token=CtFOYuk0wjiqvHZF==',
		[TEXT, URL],
		['Trailing equal symbol should work: ', 'http://example.com/foo/bar?token=CtFOYuk0wjiqvHZF==']
	], [
		'"https://surrounded.by.quotes/"',
		[TEXT, URL, TEXT],
		['"', 'https://surrounded.by.quotes/', '"']
	], [
		'More weird character in http://facebook.com/#aZ?/:@-._~!$&\'()*+,;= that URL',
		[TEXT, URL, TEXT],
		['More weird character in ', 'http://facebook.com/#aZ?/:@-._~!$&\'()*+,;=', ' that URL']
	], [
		'Email with a underscore is n_frasser@example.xyz asd',
		[TEXT, EMAIL, TEXT],
		['Email with a underscore is ', 'n_frasser@example.xyz', ' asd']
	], [
		'Url followed by nbsp: example.com/foo\u00a0bar',
		[TEXT, URL, TEXT],
		['Url followed by nbsp: ', 'example.com/foo', '\u00a0bar']
	], [
		'A link in \'singlequote.club/wat\' extra fluff at the end',
		[TEXT, URL, TEXT],
		['A link in \'', 'singlequote.club/wat', '\' extra fluff at the end']
	], [
		'Email with mailsomething dot com domain in foo@mailsomething.com',
		[TEXT, EMAIL],
		['Email with mailsomething dot com domain in ', 'foo@mailsomething.com']
	]
];

describe('linkify/core/parser#run()', () => {

	function makeTest(test) {
		return it('Tokenizes the string "' + test[0] + '"', () => {
			var str = test[0];
			var types = test[1];
			var values = test[2];
			var result = parser.run(scanner.run(str));

			expect(result.map(function (token) {
				return token.toString();
			})).to.eql(values);

			expect(result.map(function (token) {
				return token.constructor;
			})).to.eql(types);

		});
	}

	tests.map(makeTest, this);

});
