/*jshint -W030 */
var
TEXT_TOKENS	= require('../../../../../lib/linkify/core/tokens').text,
TokenState	= require('../../../../../lib/linkify/core/state').TokenState;

describe('linkify/core/state/TokenState', function () {
	var TS_START;

	before(function () {
		TS_START = new TokenState();
	});
});
