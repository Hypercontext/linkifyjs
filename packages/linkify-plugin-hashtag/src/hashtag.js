import { createTokenClass } from 'linkifyjs';

// Create a new token that class that the parser emits when it finds a hashtag
const HashtagToken = createTokenClass('hashtag', { isLink: true });

/**
 * @type {import('linkifyjs').Plugin}
 */
 export default function hashtag({ scanner, parser }) {
	// Various tokens that may compose a hashtag
	const { POUND, NUM, UNDERSCORE, alpha } = scanner.tokens;

	// The start state
	const Start = parser.start;

	// Take or create a transition from start to the '#' sign (non-accepting)
	const Hash = Start.tt(POUND);

	// Take transition from '#' to any text token to yield valid hashtag state
	const Hashtag = Hash.tt(alpha, HashtagToken);
	Hashtag.tt(NUM, Hashtag);
	Hashtag.tt(UNDERSCORE, Hashtag); // Trailing underscore is okay
	Hashtag.tt(alpha, Hashtag);

	// Account for leading underscore (non-accepting unless followed by domain)
	const HashPrefix = Hash.tt(NUM);

	Hash.tt(UNDERSCORE, HashPrefix);
	HashPrefix.tt(NUM, HashPrefix);
	HashPrefix.tt(UNDERSCORE, HashPrefix);
	HashPrefix.tt(alpha, Hashtag);
}
