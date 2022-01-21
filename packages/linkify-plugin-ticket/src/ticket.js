import { registerPlugin } from 'linkifyjs';

/**
	Ticket number detector
*/
export const ticket = ({ scanner, parser, utils }) => {
	// TODO: Add cross-repo style tickets? e.g., Hypercontext/linkifyjs#42
	// Is that even feasible?
	const { POUND, numeric } = scanner.tokens;
	const Start = parser.start;
	const TicketToken = utils.createTokenClass('ticket', { isLink: true });

	const Hash = Start.tt(POUND);
	Hash.tt(numeric, TicketToken);
};

registerPlugin('ticket', ticket);
