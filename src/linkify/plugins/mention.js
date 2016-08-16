/**
	Quick Mention parser plugin for linkify
*/
export default function mention(linkify) {
	let TT = linkify.scanner.TOKENS; // Text tokens
	let MT = linkify.parser.TOKENS; // Multi tokens
	let MultiToken = MT.Base;
	let S_START = linkify.parser.start;
	let S_AT, S_MENTION;

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
