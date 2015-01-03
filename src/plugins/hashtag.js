/**
	Quick Hashtag parser plugin for linkify
*/
module.exports = function (linkify) {
	let
	TT = linkify.scanner.TOKENS, // Text tokens
	MT = linkify.parser.TOKENS, // Multi tokens
	MultiToken = MT.Base,
	S_START = linkify.parser.start,
	S_HASH, S_HASHTAG;

	class HASHTAG extends MultiToken {
		get type() { return 'hashtag'; }
		get isLink() { return true; }
	}

	S_HASH = new linkify.parser.State();
	S_HASHTAG = new linkify.parser.State(HASHTAG);

	S_START.on(TT.POUND, S_HASH);
	S_HASH.on(TT.DOMAIN, S_HASHTAG);
};
