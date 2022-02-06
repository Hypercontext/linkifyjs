import { createTokenClass } from 'linkifyjs';

const TicketToken = createTokenClass('ticket', { isLink: true });

/**
 * @type {import('linkifyjs').Plugin}
 */
export default function ticket({ scanner, parser }) {
	// TODO: Add cross-repo style tickets? e.g., Hypercontext/linkifyjs#42
	// Is that even feasible?
	const { POUND, numeric } = scanner.tokens;
	const Start = parser.start;

	const Hash = Start.tt(POUND);
	Hash.tt(numeric, TicketToken);
}
