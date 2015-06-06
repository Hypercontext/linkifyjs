var
scanner = require('../../../../lib/linkify/core/scanner'),
TEXT_TOKENS = require('../../../../lib/linkify/core/tokens').text;

var
DOMAIN		= TEXT_TOKENS.DOMAIN,
AT			= TEXT_TOKENS.AT,
COLON		= TEXT_TOKENS.COLON,
DOT			= TEXT_TOKENS.DOT,
LOCALHOST	= TEXT_TOKENS.LOCALHOST,
NL			= TEXT_TOKENS.NL,
NUM			= TEXT_TOKENS.NUM,
PLUS		= TEXT_TOKENS.PLUS,
POUND		= TEXT_TOKENS.POUND,
PROTOCOL	= TEXT_TOKENS.PROTOCOL,
QUERY		= TEXT_TOKENS.QUERY,
SLASH		= TEXT_TOKENS.SLASH,
SYM			= TEXT_TOKENS.SYM,
TLD			= TEXT_TOKENS.TLD,
WS			= TEXT_TOKENS.WS;

// The elements are
// 1. input string
// 2. Types for the resulting instances
// 3. String values for the resulting instances
var tests = [
	['', [], []],
	['@', [AT], ['@']],
	[':', [COLON], [':']],
	['.', [DOT], ['.']],
	['-', [SYM], ['-']],
	['\n', [NL], ['\n']],
	['+', [PLUS], ['+']],
	['#', [POUND], ['#']],
	['/', [SLASH], ['/']],
	['&', [SYM], ['&']],
	['&?<>(', [SYM, QUERY, SYM, SYM, SYM], ['&', '?', '<', '>', '(']],
	['hello', [DOMAIN], ['hello']],
	['Hello123', [DOMAIN], ['Hello123']],
	['hello123world', [DOMAIN], ['hello123world']],
	['0123', [NUM], ['0123']],
	['123abc', [DOMAIN], ['123abc']],
	['http', [DOMAIN], ['http']],
	['http:', [PROTOCOL], ['http:']],
	['https:', [PROTOCOL], ['https:']],
	['files:', [DOMAIN, COLON], ['files', ':']],
	['file//', [DOMAIN, SLASH, SLASH], ['file', '/', '/']],
	['ftp://', [PROTOCOL, SLASH, SLASH], ['ftp:', '/', '/']],
	['c', [DOMAIN], ['c']],
	['co', [TLD], ['co']],
	['com', [TLD], ['com']],
	['comm', [DOMAIN], ['comm']],
	['abc 123  DoReMi', [DOMAIN, WS, NUM, WS, DOMAIN], ['abc', ' ',  '123', '  ', 'DoReMi']],
	['abc 123 \n  DoReMi', [DOMAIN, WS, NUM, WS, NL, WS, DOMAIN], ['abc', ' ',  '123', ' ', '\n', '  ', 'DoReMi']],
	['local', [DOMAIN], ['local']],
	['localhost', [LOCALHOST], ['localhost']],
	['localhosts', [DOMAIN], ['localhosts']],
	['500px', [DOMAIN], ['500px']],
	['500-px', [DOMAIN], ['500-px']],
	['-500px', [SYM, DOMAIN], ['-', '500px']],
	['500px-', [DOMAIN, SYM], ['500px', '-']],
	['123-456', [DOMAIN], ['123-456']]
];

describe('linkify/core/scanner#run()', function () {

	function makeTest(test) {
		return it('Tokenizes the string "' + test[0] + '"', function () {
			var
			str = test[0],
			types = test[1],
			values = test[2],
			result = scanner.run(str);

			result.map(function (token) { return token.constructor; })
			.should.eql(types);

			result.map(function (token) { return token.toString(); })
			.should.eql(values);
		});
	}

	tests.forEach(makeTest, this);

});
