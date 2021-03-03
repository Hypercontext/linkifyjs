/**
	Quick Hashtag parser plugin for linkify
*/
import * as linkify from '../linkify'

let TT = linkify.scanner.TOKENS; // Text tokens
let MultiToken = linkify.parser.TOKENS.Base; // Base Multi token class
let S_START = linkify.parser.start;

function HASHTAG(value) {
	this.v = value;
}

linkify.inherits(MultiToken, HASHTAG, {
	type: 'hashtag',
	isLink: true
});

const S_HASH = S_START.jump(TT.POUND);
const S_HASHTAG = new linkify.parser.State(HASHTAG);

S_HASH.t(TT.DOMAIN, S_HASHTAG);
S_HASH.t(TT.TLD, S_HASHTAG);
S_HASH.t(TT.LOCALHOST, S_HASHTAG);

export default () => {} // noop for compatibility with v2
