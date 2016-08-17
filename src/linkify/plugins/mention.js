/**
	Mention parser plugin for linkify
*/
export default function mention(linkify) {
	const TT = linkify.scanner.TOKENS; // Text tokens
	const {TOKENS: MT, State} = linkify.parser; // Multi tokens, state
	const MultiToken = MT.Base;
	const S_START = linkify.parser.start;

	const TT_DOMAIN = TT.DOMAIN;
	const TT_LOCALHOST = TT.LOCALHOST;
	const TT_NUM = TT.NUM;
	const TT_SLASH = TT.SLASH;
	const TT_TLD = TT.TLD;
	const TT_UNDERSCORE = TT.UNDERSCORE;

	function MENTION(value) {
		this.v = value;
	}

	linkify.inherits(MultiToken, MENTION, {
		type: 'mention',
		isLink: true,
		toHref() {
			return '/' + this.toString().substr(1);
		}
	});

	const S_AT = S_START.jump(TT.AT); // @
	const S_AT_SYMS = new State();
	const S_MENTION = new State(MENTION);
	const S_MENTION_SLASH = new State();
	const S_MENTION_SLASH_SYMS = new State();

	// @_,
	S_AT.on(TT_UNDERSCORE, S_AT_SYMS);

	//  @_*
	S_AT_SYMS.on(TT_UNDERSCORE, S_AT_SYMS);

	// Valid mention (not made up entirely of symbols)
	S_AT
	.on(TT_DOMAIN, S_MENTION)
	.on(TT_LOCALHOST, S_MENTION)
	.on(TT_TLD, S_MENTION)
	.on(TT_NUM, S_MENTION);

	S_AT_SYMS
	.on(TT_DOMAIN, S_MENTION)
	.on(TT_LOCALHOST, S_MENTION)
	.on(TT_TLD, S_MENTION)
	.on(TT_NUM, S_MENTION);

	// More valid mentions
	S_MENTION
	.on(TT_DOMAIN, S_MENTION)
	.on(TT_LOCALHOST, S_MENTION)
	.on(TT_TLD, S_MENTION)
	.on(TT_NUM, S_MENTION)
	.on(TT_UNDERSCORE, S_MENTION);

	// Mention with a slash
	S_MENTION.on(TT_SLASH, S_MENTION_SLASH);

	// Mention _ trailing stash plus syms
	S_MENTION_SLASH.on(TT_UNDERSCORE, S_MENTION_SLASH_SYMS);
	S_MENTION_SLASH_SYMS.on(TT_UNDERSCORE, S_MENTION_SLASH_SYMS);

	// Once we get a word token, mentions can start up again
	S_MENTION_SLASH
	.on(TT_DOMAIN, S_MENTION)
	.on(TT_LOCALHOST, S_MENTION)
	.on(TT_TLD, S_MENTION)
	.on(TT_NUM, S_MENTION);

	S_MENTION_SLASH_SYMS
	.on(TT_DOMAIN, S_MENTION)
	.on(TT_LOCALHOST, S_MENTION)
	.on(TT_TLD, S_MENTION)
	.on(TT_NUM, S_MENTION);
}
