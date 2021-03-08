/**
	Mention parser plugin for linkify
*/
import { registerPlugin } from '../linkify';

export const mention = ({ scanner, parser, utils }) => {
	const { DOMAIN, LOCALHOST, TLD, NUM, SLASH, UNDERSCORE, DOT, AT } = scanner.tokens;
	const START_STATE = parser.start;

	const Mention = utils.createTokenClass('mention', {
		isLink: true,
		toHref() {
			return '/' + this.toString().substr(1);
		}
	});

	// @
	const AT_STATE = START_STATE.tt(AT); // @

	// @_,
	const AT_SYMS_STATE = AT_STATE.tt(UNDERSCORE);

	//  @_*
	AT_SYMS_STATE.tt(UNDERSCORE, AT_SYMS_STATE);
	AT_SYMS_STATE.tt(DOT, AT_SYMS_STATE);

	// Valid mention (not made up entirely of symbols)
	const MENTION_STATE = AT_STATE.tt(DOMAIN, Mention);
	AT_STATE.tt(TLD, MENTION_STATE);
	AT_STATE.tt(LOCALHOST, MENTION_STATE);
	AT_STATE.tt(NUM, MENTION_STATE);

	// @[_.]* + valid mention
	AT_SYMS_STATE.tt(DOMAIN, MENTION_STATE);
	AT_SYMS_STATE.tt(LOCALHOST, MENTION_STATE);
	AT_SYMS_STATE.tt(TLD, MENTION_STATE);
	AT_SYMS_STATE.tt(NUM, MENTION_STATE);

	// More valid mentions
	MENTION_STATE.tt(DOMAIN, MENTION_STATE);
	MENTION_STATE.tt(LOCALHOST, MENTION_STATE);
	MENTION_STATE.tt(TLD, MENTION_STATE);
	MENTION_STATE.tt(NUM, MENTION_STATE);
	MENTION_STATE.tt(UNDERSCORE, MENTION_STATE);

	// Mention with a divider
	const MENTION_DIVIDER_STATE = MENTION_STATE.tt(SLASH);
	MENTION_STATE.tt(SLASH, MENTION_DIVIDER_STATE);
	MENTION_STATE.tt(DOT, MENTION_DIVIDER_STATE);
	MENTION_STATE.tt(AT, MENTION_DIVIDER_STATE);

	// Mention _ trailing stash plus syms
	const MENTION_DIVIDER_SYMS_STATE = MENTION_DIVIDER_STATE.tt(UNDERSCORE);
	MENTION_DIVIDER_SYMS_STATE.tt(UNDERSCORE, MENTION_DIVIDER_SYMS_STATE);

	// Once we get a word token, mentions can start up again
	MENTION_DIVIDER_STATE.tt(DOMAIN, MENTION_STATE);
	MENTION_DIVIDER_STATE.tt(LOCALHOST, MENTION_STATE);
	MENTION_DIVIDER_STATE.tt(TLD, MENTION_STATE);
	MENTION_DIVIDER_STATE.tt(NUM, MENTION_STATE);
	MENTION_DIVIDER_SYMS_STATE.tt(DOMAIN, MENTION_STATE);
	MENTION_DIVIDER_SYMS_STATE.tt(LOCALHOST, MENTION_STATE);
	MENTION_DIVIDER_SYMS_STATE.tt(TLD, MENTION_STATE);
	MENTION_DIVIDER_SYMS_STATE.tt(NUM, MENTION_STATE);
};

registerPlugin('mention', mention);
