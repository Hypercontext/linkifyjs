/**
	A Linkified object contains a DOM node (or just plain text) whose
	inner text is replaced by HTML containing `<a>` links to URLs
	discovered in that text. Call with

		new Linkified(text, options)

	Here are some the available options and their defaults

		{
			tagName: 'a',
			newLine: '\n',
			target: '_blank',
			linkClass: null,
			linkClasses: [],
			linkAttributes: null
		}

	TODO: Take out jQuery reliance

	@class Linkified
*/
;(function (window, document, undefined) {

	"use strict";

	var defaults = {
		tagName: 'a',
		newLine: '\n',
		target: '_blank',
		linkClass: null,
		linkClasses: [],
		linkAttributes: null
	};

	function Linkified(element, options) {

		// Setup
		this._defaults = defaults;
		this.element = element;
		this.setOptions(options);
		this.init();
	}

	Linkified.prototype = {

		constructor: Linkified,

		/**
			Initializer
			@method	init
		*/
		init: function () {
			if (this.element.nodeType === 1) {
				Linkified.linkifyNode.call(this, this.element);
			} else {
				this.element = Linkified.linkify.apply(
					this,
					this.element.toString()
				);
			}
		},

		/**
			Used to reset the options for this plugin
			@method	setOptions
			@param	{Object} options
		*/
		setOptions: function (options) {
			this.settings = Linkified.extendSettings(options, this.settings);
		},

		/**
			Returns the HTML of the linkified text.
			@method	toString
			@return	{String} html
		*/
		toString: function () {

			// Returned the linkified HTML
			return this.element.toString();
		}


	};

	/**
		Create an extended settings object using the default options.
		Include a second hash to use those as defaults instead.
	*/
	Linkified.extendSettings = function (options, settings) {
		var prop;

		settings = settings || {};

		for (prop in defaults) {
			if (!settings[prop]) {
				settings[prop] = defaults[prop];
			}
		}

		for (prop in options) {
			settings[prop] = options[prop];
		}
		return settings;
	};


	/**
		The url-matching regular expression for double-spaced text
		@property	linkMatch
		@static
		@type		RegExp
	*/
	Linkified.linkMatch = new RegExp([

		// The groups
		'(', // 1. Character before the link
		'\\s|[^a-zA-Z0-9.\\+_\\/"\\>\\-]|^',
		')(?:', //Main group
		'(', // 2. Email address (optional)
		'[a-zA-Z0-9\\+_\\-]+',
		'(?:',
		'\\.[a-zA-Z0-9\\+_\\-]+',
		')*@',
		')?(', // 3. Protocol (optional)
		'http:\\/\\/|https:\\/\\/|ftp:\\/\\/',
		')?(', // 4. Domain & Subdomains
		'(?:(?:[a-z0-9][a-z0-9_%\\-_+]*\\.)+)',
		')(', // 5. Top-level domain - http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains
		'(?:com|ca|co|edu|gov|net|org|dev|biz|cat|int|pro|tel|mil|aero|asia|coop|info|jobs|mobi|museum|name|post|travel|local|[a-z]{2})',
		')(', // 6. Query string (optional)
		'(?:',
		'[\\/|\\?]',
		'(?:',
		'[\\-a-zA-Z0-9_%#*&+=~!?,;:.\\/]*',
		')*',
		')',
		'[\\-\\/a-zA-Z0-9_%#*&+=~]',
		'|',
		'\\/?',
		')?',
		')(', // 7. Character after the link
		'[^a-zA-Z0-9\\+_\\/"\\<\\-]|$',
		')'
	].join(''), 'g');

	/**
		The regular expression of matching email links after the
		application of the initial link matcher.

		@property	emailLinkMatch
		@static
		@type		RegExp
	*/
	Linkified.emailLinkMatch = /(<[a-z]+ href=\")(http:\/\/)([a-zA-Z0-9\+_\-]+(?:\.[a-zA-Z0-9\+_\-]+)*@)/g;


	/**
		Linkify the given text
		@method	linkify
		@return	{String} html
	*/
	Linkified.linkify = function (text, options) {

		var attr,
			settings,
			linkClasses,
			linkReplace = [];

		if (this.constructor === Linkified && this.settings) {

			// Called from an instance of Linkified
			settings = this.settings;
			if (options) {
				settings = Linkified.extendSettings(options, settings);
			}

		} else {
			settings = Linkified.extendSettings(options);
		}

		// Normalize class names
		if (settings.linkClass) {
			linkClasses = settings.linkClass.split(/\s+/);
		} else {
			linkClasses = [];
		}

		linkClasses.push.apply(linkClasses, settings.linkClasses);


		// Get rid of tags and HTML-structure,
		// Duplicate whitespace in preparation for linking
		text = text
			.replace(/</g, '&lt;')
			.replace(/(\s)/g, '$1$1');

		// Build up the replacement string

		linkReplace.push(
			'$1<' + settings.tagName,
			'href="http://$2$4$5$6"'
		);

		// Add classes
		linkReplace.push(
			'class="linkified' +
			(linkClasses.length > 0 ? ' ' + linkClasses.join(' ') : '') +
			'"'
		);

		// Add target
		if (settings.target) {
			linkReplace.push('target="' + settings.target + '"');
		}

		// Add other (normalized) attributes
		for (attr in settings.linkAttributes) {
			linkReplace.push([
				attr,
				'="',
				settings.linkAttributes[attr]
					.replace(/\"/g, '&quot;')
					.replace(/\$/g, '&#36;'),
				'"'
			].join(''));
		}

		// Finish off
		linkReplace.push('>$2$3$4$5$6</' + settings.tagName + '>$7');

		// Create the link
		text = text.replace(Linkified.linkMatch, linkReplace.join(' '));

		// The previous line added `http://` to emails. Replace that with `mailto:`
		text = text.replace(Linkified.emailLinkMatch, '$1mailto:$3');

		// Revert whitespace characters back to a single character
		text = text.replace(/(\s){2}/g, '$1');

		// Trim and account for new lines
		text = text.replace(/\n/g, settings.newLine);

		return text;

	};

	/**
		Given a DOM node, linkify its contents
	*/
	Linkified.linkifyNode = function (node) {

		var children,
			childNode,
			childCount,
			dummyElement,
			i;

		// Don't linkify anchor tags or tags that have the .linkified class
		if (node &&
			typeof node === 'object' &&
			node.nodeType === 1 &&
			node.tagName.toLowerCase() !== 'a' &&
			!/[^\s]linkified[\s$]/.test(node.className)
		) {

			children = [];
			dummyElement = Linkified._dummyElement ||
				document.createElement('div');

			childNode = node.firstChild;
			childCount = node.childElementCount;

			while (childNode) {

				if (childNode.nodeType === 3) {

					// Linkify the text node
					dummyElement.innerHTML = Linkified.linkify.call(
						this,
						childNode.textContent || childNode.innerText
					);

					/*
						Parse the linkified text and append it to the
						new children
					*/
					children.push.apply(
						children,
						dummyElement.childNodes
					);

				} else if (childNode.nodeType === 1) {
					children.push(Linkified.linkifyNode(childNode));
				} else {
					children.push(childNode);
				}

				childNode = childNode.nextSibling;
			}

			// Replace nodes with the new ones
			for (i = 0; i < childCount; i++) {
				console.log(node.childNodes[i], children[i], i);
				node.replaceChild(children[i], node.childNodes[i]);
			}

			for (i; i < children.length; i++) {
				console.log(children[i], i);
				node.appendChild(children[i]);
			}

		}
		return node;
	},

	Linkified._dummyElement = document.createElement('div');

	if (window) {
		window.Linkified = Linkified;
	}

	return Linkified;

})(window, document, undefined);
