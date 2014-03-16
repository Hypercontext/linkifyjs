/* globals Text */

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
			preserveWhitespace: false
		}

	@class Linkified
*/

var defaults = {
	tagName: 'a',
	target: "_blank",
	linkClass: null,
	linkClasses: [],
	linkAttributes: null,
	format: function (link/*, type*/) {
		return link;
	},
	nl2br: false,
	preserveWhitespace: false
};

function Linkified(element, options) {

	// Setup
	this._defaults = defaults;
	this.element = element;
	this.setOptions(options);
	this.init();
}

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

window.Linkified = Linkified;

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
			this.element = Linkified.linkify.call(
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
		return this._element.innerHTML;
	}


};

/**
	Create an extended settings object using the default options.
	Include a second hash to use those as defaults instead.
	@method	extendSettings
	@static
	@param	{Object} options Hash of options to use for extending
	@param	{Object} settings Existing settings object to extend from. If undefined, the defaults will be used
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
	The url-matching regular expression for a single word

	@property	linkMatch
	@static
	@type		RegExp
*/
Linkified.linkMatch = new RegExp([

	// Note: Character before the link should  match /[^a-zA-Z0-9.\+_\/"\-]/

	// The groups
	'^(',		// 1. Protocol (optional)
	'https?:\\/\\/|ftps?:\\/\\/',
	')?(',		// 2. Domain & Subdomains
	'(?:(?:[a-zA-Z0-9][a-zA-Z0-9_%\\-_+]*\\.)+)',
	')(',		// 3. Top-level domain - http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains
	'(?:[a-z]{4-12}|com|biz|cab|cat|edu|eus|giv|int|mil|net|org|pro|tel|[a-z]{2})', // .construction is a thing.
	')(',		// 4. Query string (optional)
	'(?:',
	'[\\/|\\?]',
	'(?:',
	'[\\-a-zA-Z0-9_%#*&+=~!?,;:.\\/]*',
	')*',
	')',
	'[\\-\\/a-zA-Z0-9_%#*&+=~]',
	'|',
	'\\/?',
	')?$'

	// Note: Character after the link should match [^a-zA-Z0-9\+_\/"\-]

].join(''));

/**
	The regular expression seeing if an email link matches a given word

	@property	emailLinkMatch
	@static
	@type		RegExp
*/
Linkified.emailLinkMatch =
	/^[a-zA-Z0-9%\+_\-]+(\.[a-zA-Z0-9%\+_\-]*)+@([a-z0-9][a-z0-9_%\-_+]*\.)+([a-z]{2}|com|biz|cab|cat|edu|eus|giv|int|mil|net|org|pro|tel|[a-z]{4-12})$/;


/**
	Linkify the given text
	@method	linkify
	@param	{String} text Plain text to linkify
	@param	{Options} options to linkify with, in addition to the defaults for the context
	@return	{NodeList} element (Changed spec) List of DOM nodes with attached event listeners
*/
Linkified.linkify = function (text, options) {

	var settings, linkClasses, words;

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
	//text = text.replace(/</g, '&lt;');
		//.replace(/(\s)/g, '$1$1');

	// get individual words
	words = text.split(
		settings.preserveWhitespace ? ' ' : /[^\S\n]+/
	);

	var defaultTarget = settings.target ||  settings.linkAttributes.target || "_blank";
	var nodeList = [];
	var dummyElement = document.createElement('div');
	var phrase = '';

	function textToNodes(text, nl2br) {

		var nodes = [], lines;

		if (nl2br) {

			lines = text.split('\n');

			for (var i = 0; i < lines.length; i++) {
				nodes.push(new Text(lines[i]));
				if (i < lines.length - 1) {
					nodes.push(document.createElement('br'));
				}
			}
		} else {
			nodes.push(new Text(text));
		}

		return nodes;
	}

	for (var i = 0; i < words.length; i++) {

		var word = words[i];
		var action = null;
		var linkPadding = null;
		var hasMatch = false;
		var display = null, matches = null, href = null, target = null;

		// search for one of the characters the URL must have
		var searchIndex = word.search(/[.@#]/); // # for hashtags in the future

		if (searchIndex >= 0 && searchIndex < word.length - i) {

			// Matching character is before the last character of the word
			// try to find a URL


			target = defaultTarget;

			if (matches = word.match(this.constructor.emailLinkMatch)) {

				// There's an email!
				hasMatch = true;
				linkPadding = word.split(matches[0], 2); // get the link without surrounding characters

				display = matches[0];
				href = 'mailto:' + display;

				target = null;

				action = settings.tagName === 'a' ? null : function () {
					window.location.href = href;
					return false;
				};

			} else if (matches = word.match(this.constructor.linkMatch)) {

				// There's a link!
				hasMatch = true;
				linkPadding = word.split(matches[0], 2);

				display = matches[0];
				href = display;

				if (display.search(/(https?|ftps?):\/\//) !== 0) {
					// Append http to href
					href = 'http://' + display;
				}

				action = settings.tagName === 'a' ? null : function () {
					window.open(href, target);
					return false;
				};

			} else {

				phrase += word + ' ';

			}

			//console.log(matches);


			if (hasMatch) {

				var linkified = document.createElement(settings.tagName);

				// Set href and target and what not
				linkified.setAttribute('href', href);

				if (target) {
					linkified.setAttribute('target', target);
				}

				var className = 'linkified';
				if (linkClasses.length) {
					className += ' ' + linkClasses.join(' ');
				}

				linkified.setAttribute('class', className);

				// Add all the given properties
				for (var prop in settings.linkAttributes) {
					linkified.setAttribute(prop, settings.linkAttributes[prop]);
				}

				linkified.innerText = display;

				if (action) {
					if (linkified.addEventListener){
						linkified.addEventListener('click', action);
					} else if(linkified.attachEvent){ // IE < 9 :(
						linkified.attachEvent('onclick', action);
					}
				}

				phrase += linkPadding[0];

				nodeList.push.apply(
					nodeList,
					textToNodes(phrase, settings.nl2br)
				);

				nodeList.push(linkified);

				phrase = linkPadding[1] + ' ';

			}

		} else {

			phrase += word + ' ';

		}
	}

	nodeList.push.apply(nodeList, textToNodes(phrase.replace(/\s+$/, '')));

	for (i = 0; i < nodeList.length; i++) {
		dummyElement.appendChild(nodeList[i]);
	}

	this._element = dummyElement;

	return dummyElement.childNodes;

};

/**
	Given an HTML DOM node, linkify its contents
	@method	linkifyNode
	@static
	@param	{Element} node The HTML node to find URLs in
	@return {Element} node
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

				children.push.apply(
					children,
					Linkified.linkify.call(
						this,
						childNode.textContent || childNode.innerText
					)
				);

			} else if (childNode.nodeType === 1) {

				// This is an HTML node, linkify it and add it
				children.push(Linkified.linkifyNode(childNode));

			} else {

				// This is some other kind of node, just push it
				children.push(childNode);
			}

			childNode = childNode.nextSibling;
		}


		// Remove all existing nodes.
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}

		// Replace with all the new nodes
		for (i = 0; i < children.length; i++) {
			node.appendChild(children[i]);
		}

	}
	return node;
},

Linkified._dummyElement = document.createElement('div');
