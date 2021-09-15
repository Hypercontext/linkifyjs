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
	truncate: 0,
	className: null,
	attributes: null,
	ignoreTags: []
};

/**
 * @class Options
 * @param {Object} [opts] Set option properties besides the defaults
 */
export function Options(opts) {
	opts = opts || {};

	this.defaultProtocol	= 'defaultProtocol' in opts ? opts.defaultProtocol : defaults.defaultProtocol;
	this.events				= 'events' in opts ? opts.events : defaults.events;
	this.format				= 'format' in opts ? opts.format : defaults.format;
	this.formatHref			= 'formatHref' in opts ? opts.formatHref : defaults.formatHref;
	this.nl2br				= 'nl2br' in opts ? opts.nl2br : defaults.nl2br;
	this.tagName			= 'tagName' in opts ? opts.tagName : defaults.tagName;
	this.target				= 'target' in opts ? opts.target : defaults.target;
	this.rel				= 'rel' in opts ? opts.rel : defaults.rel;
	this.validate			= 'validate' in opts ? opts.validate : defaults.validate;
	this.truncate			= 'truncate' in opts ? opts.truncate : defaults.truncate;
	this.className 			= 'className' in opts ? opts.className : defaults.className;
	this.attributes 		= opts.attributes || defaults.attributes;
	this.ignoreTags			= [];

	// Make all tags names upper case
	const ignoredTags = 'ignoreTags' in opts ? opts.ignoreTags : defaults.ignoreTags;
	for (let i = 0; i < ignoredTags.length; i++) {
		this.ignoreTags.push(ignoredTags[i].toUpperCase());
	}
}

Options.prototype = {
	/**
	 * Given the token, return all options for how it should be displayed
	 */
	resolve(token) {
		const href = token.toHref(this.defaultProtocol);
		return {
			formatted: this.get('format', token.toString(), token),
			formattedHref: this.get('formatHref', href, token),
			tagName: this.get('tagName', href, token),
			className: this.get('className', href, token),
			target: this.get('target', href, token),
			rel: this.get('rel', href, token),
			events: this.getObject('events', href, token),
			attributes: this.getObject('attributes', href, token),
			truncate: this.get('truncate', href, token),
		};
	},

	/**
	 * Returns true or false based on whether a token should be displayed as a
	 * link based on the user options. By default,
	 */
	check(token) {
		return this.get('validate', token.toString(), token);
	},

	// Private methods

	/**
	 * Resolve an option's value based on the value of the option and the given
	 * params.
	 * @param {string} key Name of option to use
	 * @param operator will be passed to the target option if it's method
	 * @param {MultiToken} token The token from linkify.tokenize
	 */
	get(key, operator, token) {
		const option = this[key];
		if (!option) { return option; }

		let optionValue;
		switch (typeof option) {
		case 'function':
			return option(operator, token.t);
		case 'object':
			optionValue = token.t in option ? option[token.t] : defaults[key];
			return typeof optionValue === 'function' ? optionValue(operator, token.t) : optionValue;
		}

		return option;
	},

	getObject(key, operator, token) {
		const option = this[key];
		return typeof option === 'function' ? option(operator, token.t) : option;
	}
};

function noop(val) {
	return val;
}
