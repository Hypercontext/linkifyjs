import { createTokenClass, State, options, multi } from "linkifyjs";

const IPv4Token = createTokenClass("ipv4", {
	isLink: true,
	toHref(scheme = options.defaults.defaultProtocol) {
		return `${scheme}://${this.v}`;
	},
});

const IPv6Token = createTokenClass("ipv6", {
	isLink: true,
	toHref(scheme = options.defaults.defaultProtocol) {
		return `${scheme}://[${this.v}]`;
	},
});

/**
 * @type {import('linkifyjs').TokenPlugin}
 */

export function tokens({ scanner }) {
	const { start, tokens } = scanner;
	const flags = { byte: true, numeric: true };

	// States for [0, 9]
	const Digits = [];
	for (let i = 0; i < 10; i++) {
		const Digit = start.tt(`${i}`, `${i}`, flags);
		Digits.push(Digit);
	}

	// States [10, 99]
	for (let i = 1; i < 10; i++) {
		const Digit = Digits[i];
		for (let j = 0; j < 10; j++) {
			Digit.tt(`${j}`, `${i}${j}`, flags);
		}
	}

	// States for [100, 199]
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			Digits[1].tt(`${i}`).tt(`${j}`, `1${i}${j}`, flags);
		}
	}

	// States for [200, 249]
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 10; j++) {
			Digits[2].tt(`${i}`).tt(`${j}`, `2${i}${j}`, flags);
		}
	}

	// States for [250, 255]
	for (let i = 0; i < 6; i++) {
		Digits[2].tt('5').tt(`${i}`, `25${i}`, flags);
	}
}

/**
 * @type {import('linkifyjs').Plugin}
 */
export function ip({ scanner, parser }) {
	const { COLON, DOT, SLASH, LOCALHOST, groups } = scanner.tokens;

	const ByteDot = new State()
	const ByteDotByte = new State()
	const ByteDotByteDotByte = new State()
	const IPv4 = new State(IPv4Token);

	for (let i = 0; i < groups.byte.length; i++) {
		parser.start.tt(groups.byte[i]).tt(DOT, ByteDot);
	}

	ByteDot.ta(groups.byte, ByteDotByte);
	ByteDotByte.tt(DOT).ta(groups.byte, ByteDotByteDotByte);
	ByteDotByteDotByte.tt(DOT).ta(groups.byte, IPv4);

	// If IP followed by port or slash, make URL. Get existing URL state
	const Url = parser.start.go(LOCALHOST).go(SLASH);
	IPv4.tt(SLASH, Url);

	const IPv4Colon = IPv4.tt(COLON);
	const IPv4ColonPort = new State(multi.Url);
	IPv4Colon.ta(groups.numeric, IPv4ColonPort);
	IPv4ColonPort.tt(SLASH, Url);

}
