const TEXT_TOKENS = require(`${__base}linkify/core/tokens`).text;
const TokenState = require(`${__base}linkify/core/state`).TokenState;

describe('linkify/core/state/TokenState', function () {
	var TS_START;

	before(function () {
		TS_START = new TokenState();
	});
});
