/**
	Quick Hashtag parser plugin for linkify
*/
import { registerPlugin } from '../linkify';

export const hashtag = ({ scanner, parser, utils }) => {
	// Various tokens that may compose a hashtag
	const { POUND, DOMAIN, TLD, LOCALHOST, UNDERSCORE } = scanner.tokens;

	// The start state
	const START_STATE = parser.start;

	// Create a new token that class that the parser emits when it finds a hashtag
	const Hashtag = utils.createTokenClass('hashtag', { isLink: true });

	// Take or create a transition from start to the '#' sign (non-accepting)
	const HASH_STATE = START_STATE.tt(POUND);

	// Take transition from '#' to any text token to yield valid hashtag state
	const HASHTAG_STATE = HASH_STATE.tt(DOMAIN, Hashtag);

	// Now that we have the hashtag state, no need to create new states
	HASH_STATE.tt(TLD, HASHTAG_STATE);
	HASH_STATE.tt(LOCALHOST, HASHTAG_STATE);

	// Account for leading underscore (non-accepting unless followed by domain)
	const HASH_UNDERSCORE_STATE = HASH_STATE.tt(UNDERSCORE);
	HASH_UNDERSCORE_STATE.tt(UNDERSCORE, HASH_UNDERSCORE_STATE);
	HASH_UNDERSCORE_STATE.tt(DOMAIN, HASHTAG_STATE);
	HASH_UNDERSCORE_STATE.tt(TLD, HASHTAG_STATE);
	HASH_UNDERSCORE_STATE.tt(LOCALHOST, HASHTAG_STATE);

	// Trailing underscore is okay
	HASHTAG_STATE.tt(UNDERSCORE, HASHTAG_STATE);
};

registerPlugin('hashtag', hashtag);
