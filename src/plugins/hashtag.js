/**
	Quick Hashtag parser plugin for linkify
*/
export default function (linkify) {
	let
	TT = linkify.scanner.TOKENS, // Text tokens
	MT = linkify.parser.TOKENS, // Multi tokens
	MultiToken = MT.Base,
	S_START = linkify.parser.start,
	S_HASH, S_HASHTAG;

	class HASHTAG extends MultiToken {
		constructor(value) {
			super(value);
			this.type = 'hashtag';
			this.isLink = true;
		}
	}

	S_HASH = new linkify.parser.State();
	S_HASHTAG = new linkify.parser.State(HASHTAG);

	S_START.on(TT.POUND, S_HASH);
	S_HASH.on(TT.DOMAIN, S_HASHTAG);
	S_HASH.on(TT.TLD, S_HASHTAG);
}
