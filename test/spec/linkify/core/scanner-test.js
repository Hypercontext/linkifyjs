const scanner = require(`${__base}linkify/core/scanner`);
const t = require(`${__base}linkify/core/tokens`).text;

// The elements are
// 1. input string
// 2. Types for the resulting instances
// 3. String values for the resulting instances
const tests = [
	['', [], []],
	['@', [t.AT], ['@']],
	[':', [t.COLON], [':']],
	['.', [t.DOT], ['.']],
	['-', [t.SYM], ['-']],
	['\n', [t.NL], ['\n']],
	['+', [t.PLUS], ['+']],
	['#', [t.POUND], ['#']],
	['/', [t.SLASH], ['/']],
	['&', [t.AMPERSAND], ['&']],
	['&?<>(', [t.AMPERSAND, t.QUERY, t.OPENANGLEBRACKET, t.CLOSEANGLEBRACKET, t.OPENPAREN], ['&', '?', '<', '>', '(']],
	['([{}])', [t.OPENPAREN, t.OPENBRACKET, t.OPENBRACE, t.CLOSEBRACE, t.CLOSEBRACKET, t.CLOSEPAREN], ['(', '[', '{', '}', ']', ')']],
	['!,;\'', [t.PUNCTUATION, t.PUNCTUATION, t.PUNCTUATION, t.PUNCTUATION], ['!', ',', ';', '\'']],
	['hello', [t.DOMAIN], ['hello']],
	['Hello123', [t.DOMAIN], ['Hello123']],
	['hello123world', [t.DOMAIN], ['hello123world']],
	['0123', [t.NUM], ['0123']],
	['123abc', [t.DOMAIN], ['123abc']],
	['http', [t.DOMAIN], ['http']],
	['http:', [t.PROTOCOL], ['http:']],
	['https:', [t.PROTOCOL], ['https:']],
	['files:', [t.DOMAIN, t.COLON], ['files', ':']],
	['file//', [t.DOMAIN, t.SLASH, t.SLASH], ['file', '/', '/']],
	['ftp://', [t.PROTOCOL, t.SLASH, t.SLASH], ['ftp:', '/', '/']],
	['mailto', [t.DOMAIN], ['mailto']],
	['mailto:', [t.MAILTO], ['mailto:']],
	['c', [t.DOMAIN], ['c']],
	['co', [t.TLD], ['co']],
	['com', [t.TLD], ['com']],
	['comm', [t.DOMAIN], ['comm']],
	['abc 123  DoReMi', [t.TLD, t.WS, t.NUM, t.WS, t.DOMAIN], ['abc', ' ',  '123', '  ', 'DoReMi']],
	['abc 123 \n  DoReMi', [t.TLD, t.WS, t.NUM, t.WS, t.NL, t.WS, t.DOMAIN], ['abc', ' ',  '123', ' ', '\n', '  ', 'DoReMi']],
	['local', [t.DOMAIN], ['local']],
	['localhost', [t.LOCALHOST], ['localhost']],
	['localhosts', [t.DOMAIN], ['localhosts']],
	['500px', [t.DOMAIN], ['500px']],
	['500-px', [t.DOMAIN], ['500-px']],
	['-500px', [t.SYM, t.DOMAIN], ['-', '500px']],
	['500px-', [t.DOMAIN, t.SYM], ['500px', '-']],
	['123-456', [t.DOMAIN], ['123-456']],
	['foo\u00a0bar', [t.TLD, t.WS, t.TLD], ['foo', '\u00a0', 'bar']], // nbsp
	['çïrâ.ca', [t.DOMAIN, t.DOT, t.TLD], ['çïrâ', '.', 'ca']],
	['www.🍕💩.ws', [t.DOMAIN, t.DOT, t.DOMAIN, t.DOT, t.TLD], ['www', '.', '🍕💩', '.', 'ws']],
	[
		'za̡͊͠͝lgό.gay', // May support diacritics in the future if someone complains
		[t.TLD, t.SYM, t.SYM, t.SYM, t.SYM, t.DOMAIN, t.DOT, t.TLD],
		['za', '͠', '̡', '͊', '͝', 'lgό','.','gay']
	],
	[
		'Direniş İzleme Grubu\'nun',
		[t.DOMAIN, t.WS, t.DOMAIN, t.WS, t.DOMAIN, t.PUNCTUATION, t.DOMAIN],
		['Direniş', ' ', 'İzleme', ' ', 'Grubu', '\'', 'nun']
	],
	[
		'example.com　　　テスト', // spaces are ideographic space
		[t.DOMAIN, t.DOT, t.TLD, t.WS, t.DOMAIN],
		['example', '.', 'com', '　　　', 'テスト']
	],
	[
		'#АБВ_бв #한글 #سلام',
		[t.POUND, t.DOMAIN, t.UNDERSCORE, t.DOMAIN, t.WS, t.POUND, t.DOMAIN, t.WS, t.POUND, t.DOMAIN],
		['#', 'АБВ', '_', 'бв', ' ', '#', '한글', ' ', '#', 'سلام']
	]
];

let start = scanner.init();

describe('linkify/core/scanner#run()', () => {
	function makeTest(test) {
		return it('Tokenizes the string "' + test[0] + '"', () => {
			var str = test[0];
			var types = test[1];
			var values = test[2];
			var result = scanner.run(start, str);

			expect(result.map((token) => token.t)).to.eql(types);
			expect(result.map((token) => token.v)).to.eql(values);
		});
	}

	tests.map(makeTest, this);
});
