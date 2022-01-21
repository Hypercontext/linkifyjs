const scanner = require('linkifyjs/src/scanner');
const { text: t } = require('linkifyjs/src/tokens');

// The elements are
// 1. input string
// 2. Types for the resulting instances
// 3. String values for the resulting instances
const tests = [
	['', [], []],
	['@', [t.AT], ['@']],
	[':', [t.COLON], [':']],
	['.', [t.DOT], ['.']],
	['-', [t.HYPHEN], ['-']],
	['\n', [t.NL], ['\n']],
	['+', [t.PLUS], ['+']],
	['#', [t.POUND], ['#']],
	['/', [t.SLASH], ['/']],
	['&', [t.AMPERSAND], ['&']],
	['*', [t.ASTERISK], ['*']],
	['\\', [t.BACKSLASH], ['\\']],
	['%', [t.PERCENT], ['%']],
	['`', [t.BACKTICK], ['`']],
	['^', [t.CARET], ['^']],
	['|', [t.PIPE], ['|']],
	['~', [t.TILDE], ['~']],
	['$', [t.DOLLAR], ['$']],
	['=', [t.EQUALS], ['=']],
	['-', [t.HYPHEN], ['-']],
	['&?<>(', [t.AMPERSAND, t.QUERY, t.OPENANGLEBRACKET, t.CLOSEANGLEBRACKET, t.OPENPAREN], ['&', '?', '<', '>', '(']],
	['([{}])', [t.OPENPAREN, t.OPENBRACKET, t.OPENBRACE, t.CLOSEBRACE, t.CLOSEBRACKET, t.CLOSEPAREN], ['(', '[', '{', '}', ']', ')']],
	['!,;\'', [t.EXCLAMATION, t.COMMA, t.SEMI, t.APOSTROPHE], ['!', ',', ';', '\'']],
	['hello', [t.WORD], ['hello']],
	['Hello123', [t.WORD, t.NUM], ['Hello', '123']],
	['hello123world', [t.WORD, t.NUM, t.TLD], ['hello', '123', 'world']],
	['0123', [t.NUM], ['0123']],
	['123abc', [t.NUM, t.TLD], ['123', 'abc']],
	['http', [t.SLASH_SCHEME], ['http']],
	['http:', [t.SLASH_SCHEME, t.COLON], ['http', ':']],
	['https:', [t.SLASH_SCHEME, t.COLON], ['https', ':']],
	['files:', [t.WORD, t.COLON], ['files', ':']],
	['file//', [t.SCHEME, t.SLASH, t.SLASH], ['file', '/', '/']],
	['ftp://', [t.SLASH_SCHEME, t.COLON, t.SLASH, t.SLASH], ['ftp', ':', '/', '/']],
	['mailto', [t.SCHEME], ['mailto']],
	['mailto:', [t.SCHEME, t.COLON], ['mailto', ':']],
	['c', [t.WORD], ['c']],
	['co', [t.TLD], ['co']],
	['com', [t.TLD], ['com']],
	['comm', [t.WORD], ['comm']],
	['vermögensberater السعودية москва', [t.TLD, t.WS, t.UTLD, t.WS, t.UTLD], ['vermögensberater', ' ', 'السعودية', ' ', 'москва']],
	['abc 123  DoReMi', [t.TLD, t.WS, t.NUM, t.WS, t.WORD], ['abc', ' ',  '123', '  ', 'DoReMi']],
	['abc 123 \n  DoReMi', [t.TLD, t.WS, t.NUM, t.WS, t.NL, t.WS, t.WORD], ['abc', ' ',  '123', ' ', '\n', '  ', 'DoReMi']],
	['local', [t.WORD], ['local']],
	['localhost', [t.LOCALHOST], ['localhost']],
	['localhosts', [t.WORD], ['localhosts']],
	['500px', [t.NUM, t.WORD], ['500', 'px']],
	['500-px', [t.NUM, t.HYPHEN, t.WORD], ['500', '-', 'px']],
	['-500px', [t.HYPHEN, t.NUM, t.WORD], ['-', '500', 'px']],
	['500px-', [t.NUM, t.WORD, t.HYPHEN], ['500', 'px', '-']],
	['123-456', [t.NUM, t.HYPHEN, t.NUM], ['123', '-', '456']],
	['foo\u00a0bar', [t.TLD, t.WS, t.TLD], ['foo', '\u00a0', 'bar']], // nbsp
	['çïrâ.ca', [t.UWORD, t.WORD, t.UWORD, t.DOT, t.TLD], ['çï', 'r', 'â', '.', 'ca']],
	['❤️💚', [t.EMOJIS], ['❤️💚']],
	['👊🏿🧑🏼‍🔬🌚', [t.EMOJIS], ['👊🏿🧑🏼‍🔬🌚']], // contains zero-width joiner \u200d
	['www.🍕💩.ws', [t.WORD, t.DOT, t.EMOJIS, t.DOT, t.TLD], ['www', '.', '🍕💩', '.', 'ws']],
	[
		'za̡͊͠͝lgό.gay', // May support diacritics in the future if someone complains
		[t.TLD, t.SYM, t.SYM, t.SYM, t.SYM, t.WORD, t.UWORD, t.DOT, t.TLD],
		['za', '͠', '̡', '͊', '͝', 'lg', 'ό','.','gay']
	],
	[
		'Direniş İzleme Grubu\'nun',
		[t.WORD, t.UWORD, t.WS, t.UWORD, t.WORD, t.WS, t.WORD, t.APOSTROPHE, t.WORD],
		['Direni', 'ş', ' ', 'İ', 'zleme', ' ', 'Grubu', '\'', 'nun']
	],
	[
		'example.com　　　テスト', // spaces are ideographic space
		[t.WORD, t.DOT, t.TLD, t.WS, t.UWORD],
		['example', '.', 'com', '　　　', 'テスト']
	],
	[
		'#АБВ_бв #한글 #سلام',
		[t.POUND, t.UWORD, t.UNDERSCORE, t.UWORD, t.WS, t.POUND, t.UWORD, t.WS, t.POUND, t.UWORD],
		['#', 'АБВ', '_', 'бв', ' ', '#', '한글', ' ', '#', 'سلام']
	],
	[
		'テストexample.comテスト',
		[t.UWORD, t.WORD, t.DOT, t.TLD, t.UWORD],
		['テスト', 'example', '.', 'com', 'テスト']
	],
	[
		'テストhttp://example.comテスト',
		[t.UWORD, t.SLASH_SCHEME, t.COLON, t.SLASH, t.SLASH, t.WORD, t.DOT, t.TLD, t.UWORD],
		['テスト', 'http', ':', '/', '/', 'example', '.', 'com', 'テスト']
	]
];

const customSchemeTests = [
	['stea', [t.WORD], ['stea']],
	['steam', [t.SCHEME], ['steam']],
	['steams', [t.WORD], ['steams']],
	['view', [t.WORD], ['view']],
	['view-', [t.WORD, t.HYPHEN], ['view', '-']],
	['view-s', [t.WORD, t.HYPHEN, t.WORD], ['view', '-', 's']],
	['view-sour', [t.WORD, t.HYPHEN, t.WORD], ['view', '-', 'sour']],
	['view-source', [t.SLASH_SCHEME], ['view-source']],
	['view-sources', [t.SLASH_SCHEME, t.WORD], ['view-source', 's']], // This is an unfortunate consequence :(
	['fb', [t.SLASH_SCHEME], ['fb']],
	['twitter sux', [t.SLASH_SCHEME, t.WS, t.WORD], ['twitter', ' ', 'sux']],
	['ms-settings', [t.SCHEME], ['ms-settings']],
];


describe('linkifyjs/scanner#run()', () => {
	let start;
	before(() => { start = scanner.init(); });

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

	// eslint-disable-next-line mocha/no-setup-in-describe
	tests.map(makeTest, this);

	it('Correctly sets start and end indexes', () => {
		expect(scanner.run(start, 'Hello, World!')).to.eql([
			{ t: t.WORD, v: 'Hello', s: 0, e: 5 },
			{ t: t.COMMA, v: ',', s: 5, e: 6 },
			{ t: t.WS, v: ' ', s: 6, e: 7 },
			{ t: t.TLD, v: 'World', s: 7, e: 12 },
			{ t: t.EXCLAMATION, v: '!', s: 12, e: 13 },
		]);
	});

	describe('Custom protocols', () => {

		before(() => {
			start = scanner.init([
				['twitter', false],
				['fb', false],
				['steam', true],
				['view-source', false],
				['ms-settings', true]
			]);
		});

		// eslint-disable-next-line mocha/no-setup-in-describe
		customSchemeTests.map(makeTest, this);

		it('Correctly tokenizes a full custom protocols', () => {
			expect(scanner.run(start, 'steam://hello')).to.eql([
				{ t: t.SCHEME, v: 'steam', s: 0, e: 5 },
				{ t: t.COLON, v: ':', s: 5, e: 6 },
				{ t: t.SLASH, v: '/', s: 6, e: 7 },
				{ t: t.SLASH, v: '/', s: 7, e: 8 },
				{ t: t.WORD, v: 'hello', s: 8, e: 13 }
			]);
		});

		it('Classifies partial schemes', () => {
			expect(scanner.run(start, 'twitter sux')).to.eql([
				{ t: t.SLASH_SCHEME, v: 'twitter', s: 0, e: 7 },
				{ t: t.WS, v: ' ', s: 7, e: 8 },
				{ t: t.WORD, v: 'sux', s: 8, e: 11 }
			]);
		});
	});
});
