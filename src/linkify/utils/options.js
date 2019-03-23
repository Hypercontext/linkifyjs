var defaults = {
	defaultProtocol: 'http',
	events: null,
	format: noop,
	formatHref: noop,
	nl2br: false,
	tagName: 'a',
	target: typeToTarget,
	validate: true,
	ignoreTags: [],
	ignoreElementClasses: [],
	attributes: null,
	className: 'linkified', // Deprecated value - no default class will be provided in the future
};

export { defaults, Options, contains };

function Options(opts) {
	opts = opts || {};

	this.defaultProtocol = opts.hasOwnProperty('defaultProtocol') ? opts.defaultProtocol : defaults.defaultProtocol;
	this.events = opts.hasOwnProperty('events') ? opts.events : defaults.events;
	this.format = opts.hasOwnProperty('format') ? opts.format : defaults.format;
	this.formatHref = opts.hasOwnProperty('formatHref') ? opts.formatHref : defaults.formatHref;
	this.nl2br = opts.hasOwnProperty('nl2br') ? opts.nl2br : defaults.nl2br;
	this.tagName = opts.hasOwnProperty('tagName') ? opts.tagName : defaults.tagName;
	this.target = opts.hasOwnProperty('target') ? opts.target : defaults.target;
	this.validate = opts.hasOwnProperty('validate') ? opts.validate : defaults.validate;
	this.ignoreTags = [];
	this.ignoreElementClasses = [];

	// linkAttributes and linkClass is deprecated
	this.attributes = opts.attributes || opts.linkAttributes || defaults.attributes;
	this.className = opts.hasOwnProperty('className')
		? opts.className
		: (opts.linkClass || defaults.className);

	// Make all tags names upper case
	let ignoredTags = opts.hasOwnProperty('ignoreTags') ? opts.ignoreTags : defaults.ignoreTags;
	for (var i = 0; i < ignoredTags.length; i++) {
		this.ignoreTags.push(ignoredTags[i].toUpperCase());
	}
	// Make all classe names lower case
	let ignoredElementClasses = opts.hasOwnProperty('ignoreElementClasses') ? opts.ignoreElementClasses : defaults.ignoreElementClasses;
	for (var i = 0; i < ignoredElementClasses.length; i++) {
		this.ignoreElementClasses.push(ignoredElementClasses[i].toLowerCase());
	}
}

Options.prototype = {
	/**
	 * Given the token, return all options for how it should be displayed
	 */
	resolve(token) {
		let href = token.toHref(this.defaultProtocol);
		return {
			formatted: this.get('format', token.toString(), token),
			formattedHref: this.get('formatHref', href, token),
			tagName: this.get('tagName', href, token),
			className: this.get('className', href, token),
			target: this.get('target', href, token),
			events: this.getObject('events', href, token),
			attributes: this.getObject('attributes', href, token),
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
	 * @param {String} key Name of option to use
	 * @param operator will be passed to the target option if it's method
	 * @param {MultiToken} token The token from linkify.tokenize
	 */
	get(key, operator, token) {
		let optionValue, option = this[key];
		if (!option) { return option; }

		switch (typeof option) {
		case 'function': return option(operator, token.type);
		case 'object':
			optionValue = option.hasOwnProperty(token.type) ? option[token.type] : defaults[key];
			return typeof optionValue === 'function' ? optionValue(operator, token.type) : optionValue;
		}

		return option;
	},

	getObject(key, operator, token) {
		let option = this[key];
		return typeof option === 'function' ? option(operator, token.type) : option;
	}
};

/**
 * Quick indexOf replacement for checking the ignoreTags option
 */
function contains(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === value) { return true; }
	}
	return false;
}

function noop(val) {
	return val;
}

function typeToTarget(href, type) {
	return type === 'url' ? '_blank' : null;
}
