import { registerPlugin } from '../linkify';

/**
	Ticket number detector
	TODO: Add cross-repo style tickets? e.g., SoapBox/linkifyjs#42
	Is that even feasible?
*/
export const ticket = ({ scanner, parser, utils }) => {
	const { POUND, NUM } = scanner.tokens;
	const START_STATE = parser.start;
	const Ticket = utils.createTokenClass('ticket', { isLink: true });

	const HASH_STATE = START_STATE.tt(POUND);
	HASH_STATE.tt(NUM, Ticket);
};

registerPlugin('ticket', ticket);
