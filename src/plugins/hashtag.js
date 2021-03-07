/**
	Quick Hashtag parser plugin for linkify
*/
import { registerPlugin } from '../linkify';

registerPlugin('hashtag', ({ scanner, parser, utils }) => {
	// Various tokens that may compose a hashtag
	const { POUND, DOMAIN, TLD, LOCALHOST, UNDERSCORE } = scanner.tokens;

	// The start state
	const S_START = parser.start;

	// Create a new token that class that the parser emits when it finds a hashtag
	const HASHTAG = utils.createTokenClass('hashtag', { isLink: true });

	// Take or create a transition from start to the '#' sign (non-accepting)
	const S_HASH = S_START.tt(POUND);

	// Take transition from '#' to any text token to yield valid hashtag state
	const S_HASHTAG = S_HASH.tt(DOMAIN, HASHTAG);

	// Now that we have the hashtag state, no need to create new states
	S_HASH.tt(TLD, S_HASHTAG);
	S_HASH.tt(LOCALHOST, S_HASHTAG);

	// Account for leading underscore (non-accepting unless followed by domain)
	const S_HASH_UNDERSCORE = S_HASH.tt(UNDERSCORE);
	S_HASH_UNDERSCORE.tt(UNDERSCORE, S_HASH_UNDERSCORE);
	S_HASH_UNDERSCORE.tt(DOMAIN, S_HASHTAG);
	S_HASH_UNDERSCORE.tt(TLD, S_HASHTAG);
	S_HASH_UNDERSCORE.tt(LOCALHOST, S_HASHTAG);

	// Trailing underscore is okay
	S_HASHTAG.tt(UNDERSCORE, S_HASHTAG);
});

export default () => {}; // noop for compatibility with v2
