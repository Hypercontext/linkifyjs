/**
	Quick Hashtag parser plugin for linkify
*/
import { registerPlugin } from 'linkifyjs';

export const hashtag = ({ scanner, parser, utils }) => {
	// Various tokens that may compose a hashtag
	const { POUND, NUM, UNDERSCORE, words } = scanner.tokens;

	// The start state
	const Start = parser.start;

	// Create a new token that class that the parser emits when it finds a hashtag
	const HashtagToken = utils.createTokenClass('hashtag', { isLink: true });

	// Take or create a transition from start to the '#' sign (non-accepting)
	const Hash = Start.tt(POUND);

	// Take transition from '#' to any text token to yield valid hashtag state
	const Hashtag = Hash.tt(words, HashtagToken);
	Hashtag.tt(NUM, Hashtag);
	Hashtag.tt(UNDERSCORE, Hashtag); // Trailing underscore is okay
	Hashtag.tt(words, Hashtag);

	// Account for leading underscore (non-accepting unless followed by domain)
	const HashPrefix = Hash.tt(NUM);

	Hash.tt(UNDERSCORE, HashPrefix);
	HashPrefix.tt(NUM, HashPrefix);
	HashPrefix.tt(UNDERSCORE, HashPrefix);
	HashPrefix.tt(words, Hashtag);


};

registerPlugin('hashtag', hashtag);
