import assign from './assign';

/**
 * @property {string} defaultProtocol
 * @property {{[string]: (event) => void}]} [events]
 */
export const defaults = {
	defaultProtocol: 'http',
	events: null,
	format: noop,
	formatHref: noop,
	nl2br: false,
	tagName: 'a',
	target: null,
	rel: null,
	validate: true,
	truncate: Infinity,
	className: null,
	attributes: null,
	ignoreTags: [],
	render: null
};

/**
 * @typedef {?{ [event: string]: Function }} LinkifyEventListeners
 */

/**
 * @typedef {{ tagName: any, attributes: any, content: string, events: LinkifyEventListeners }} LinkifyIntermediateRepresentation
 */

/**
 * @class Options
 * @param {Object | Options} [opts] Set option properties besides the defaults
 * @param {(ir: LinkifyIntermediateRepresentation) => any} [defaultRender] (For internal use) default
 * 	 render function that determines how to generate an HTML element based on a
 *   link token's derived tagName, attributes and HTML. Similar to render option
 */
export function Options(opts, defaultRender = null) {
	const o = {};
	assign(o, defaults);
	if (opts) { assign(o, opts instanceof Options ? opts.o : opts); }

	// Ensure all ignored tags are uppercase
	const ignoredTags = o.ignoreTags;
	const uppercaseIgnoredTags = [];
	for (let i = 0; i < ignoredTags.length; i++) {
		uppercaseIgnoredTags.push(ignoredTags[i].toUpperCase());
	}
	this.o = o;
	this.defaultRender = defaultRender;
	this.ignoreTags = uppercaseIgnoredTags;
}

Options.prototype = {
	o: {},

	/**
	 * @property {(ir: LinkifyIntermediateRepresentation) => any} [defaultRender]
	 */
	defaultRender: null,

	/**
	 * Returns true or false based on whether a token should be displayed as a
	 * link based on the user options.
	 * @param {MultiToken} token
	 * @returns {boolean}
	 */
	check(token) {
		return this.get('validate', token.toString(), token);
	},

	// Private methods

	/**
	 * Resolve an option's value based on the value of the option and the given
	 * params. If operator and token are specified and the target option is
	 * callable, automatically calls the function with the given argument.
	 * @param {string} key Name of option to use
	 * @param {any} [operator] will be passed to the target option if it's a
	 * function. If not specified, RAW function value gets returned
	 * @param {MultiToken} [token] The token from linkify.tokenize
	 * @returns {any} Resolved option value
	 */
	get(key, operator, token) {
		const isCallable = operator != null;
		let option = this.o[key];
		if (!option) { return option; }
		if (typeof option === 'object') {
			option = token.t in option ? option[token.t] : defaults[key];
			if (typeof option === 'function' && isCallable) {
				option = option(operator, token);
			}
		} else if (typeof option === 'function' && isCallable) {
			option = option(operator, token.t, token);
		}

		return option;
	},

	getObj(key, operator, token) {
		let obj = this.o[key];
		if (typeof obj === 'function' && operator != null) {
			obj = obj(operator, token.t, token);
		}
		return obj;
	},

	/**
	 * Convert the given token to a rendered element that may be added to the
	 * calling-interface's DOM
	 * @param {MultiToken} token Token to render to an HTML element
	 * @returns {any} Render result; e.g., HTML string, DOM element, React
	 *   Component, etc.
	 */
	render(token) {
		const ir = token.render(this); // intermediate representation
		const renderFn = this.get('render', null, token) || this.defaultRender;
		return renderFn ? renderFn(ir, token.t, token) : ir;
	}
};

export { assign };

function noop(val) {
	return val;
}
