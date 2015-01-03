let
scanner = require('./scanner'),
parser = require('./parser');

/**
	Converts a string into tokens that represent linkable and non-linkable bits
	@method tokenize
	@param {String} str
	@return {Array} tokens
*/
let tokenize = function (str) {
	return parser.run(scanner.run(str));
};

/**
	Returns a list of linkable items in the given string.
*/
let find = function (str) {

	let
	tokens = tokenize(str),
	filtered = [];

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].isLink) {
			filtered.push(tokens[i].toObject());
		}
	}

	return filtered;
};

// Scanner and parser provide states and tokens for the lexicographic stage
// (will be used to add additional link types)
module.exports = {
	find: find,
	parser: parser,
	scanner: scanner,
	tokenize: tokenize
};
