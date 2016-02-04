/**
	Quick Mention parser plugin for linkify
*/
function mention(linkify) {
	let
	TT = linkify.scanner.TOKENS, // Text tokens
	MT = linkify.parser.TOKENS, // Multi tokens
	MultiToken = MT.Base,
	S_START = linkify.parser.start,
	S_AT, S_MENTION;

	class MENTION extends MultiToken {
		constructor(value) {
			super(value);
			this.type = 'mention';
			this.isLink = true;
		}
	}

	S_AT = new linkify.parser.State();
	S_MENTION = new linkify.parser.State(MENTION);

	S_START.on(TT.AT, S_AT);
	S_AT.on(TT.DOMAIN, S_MENTION);
	S_AT.on(TT.TLD, S_MENTION);
}

export default mention;
