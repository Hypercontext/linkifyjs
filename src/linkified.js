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

	@class Linkified
*/

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
		return this.element.toString();
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
	')(', 
	/** 
	 * 	5. TLD
	 * 
	 *	@link	http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains	
	 *	@link	https://data.iana.org/TLD/tlds-alpha-by-domain.txt
	*/
	'(?:ac|academy|accountants|active|actor|ad|ae|aero|af|ag|agency|ai|airforce|al|am|an|ao|aq|ar|archi|army|arpa|as|asia|associates|at|attorney|au|audio|autos|aw|ax|axa|az|ba|bar|bargains|bayern|bb|bd|be|beer|berlin|best|bf|bg|bh|bi|bid|bike|bio|biz|bj|black|blackfriday|blue|bm|bmw|bn|bo|boutique|br|brussels|bs|bt|build|builders|buzz|bv|bw|by|bz|bzh|ca|cab|camera|camp|cancerresearch|capetown|capital|cards|care|career|careers|cash|cat|catering|cc|cd|center|ceo|cf|cg|ch|cheap|christmas|church|ci|citic|ck|cl|claims|cleaning|clinic|clothing|club|cm|cn|co|codes|coffee|college|cologne|com|community|company|computer|condos|construction|consulting|contractors|cooking|cool|coop|country|cr|credit|creditcard|cruises|cu|cuisinella|cv|cw|cx|cy|cz|dance|dating|de|degree|democrat|dental|dentist|desi|diamonds|digital|direct|directory|discount|dj|dk|dm|dnp|do|domains|durban|dz|ec|edu|education|ee|eg|email|engineer|engineering|enterprises|equipment|er|es|estate|et|eu|eus|events|exchange|expert|exposed|fail|farm|feedback|fi|finance|financial|fish|fishing|fitness|fj|fk|flights|florist|fm|fo|foo|foundation|fr|frogans|fund|furniture|futbol|ga|gal|gallery|gb|gd|ge|gf|gg|gh|gi|gift|gives|gl|glass|global|globo|gm|gmo|gn|gop|gov|gp|gq|gr|graphics|gratis|green|gripe|gs|gt|gu|guide|guitars|guru|gw|gy|hamburg|haus|hiphop|hiv|hk|hm|hn|holdings|holiday|homes|horse|host|house|hr|ht|hu|id|ie|il|im|immobilien|in|industries|info|ink|institute|insure|int|international|investments|io|iq|ir|is|it|je|jetzt|jm|jo|jobs|joburg|jp|juegos|kaufen|ke|kg|kh|ki|kim|kitchen|kiwi|km|kn|koeln|kp|kr|kred|kw|ky|kz|la|land|lawyer|lb|lc|lease|li|life|lighting|limited|limo|link|lk|loans|london|lotto|lr|ls|lt|lu|luxe|luxury|lv|ly|ma|maison|management|mango|market|marketing|mc|md|me|media|meet|menu|mg|mh|miami|mil|mini|mk|ml|mm|mn|mo|mobi|moda|moe|monash|mortgage|moscow|motorcycles|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|nagoya|name|navy|nc|ne|net|neustar|nf|ng|nhk|ni|ninja|nl|no|np|nr|nu|nyc|nz|okinawa|om|onl|org|organic|ovh|pa|paris|partners|parts|pe|pf|pg|ph|photo|photography|photos|physio|pics|pictures|pink|pk|pl|place|plumbing|pm|pn|post|pr|press|pro|productions|properties|ps|pt|pub|pw|py|qa|qpon|quebec|re|recipes|red|rehab|reise|reisen|ren|rentals|repair|report|republican|rest|reviews|rich|rio|ro|rocks|rodeo|rs|ru|ruhr|rw|ryukyu|sa|saarland|sb|sc|schmidt|schule|scot|sd|se|services|sexy|sg|sh|shiksha|shoes|si|singles|sj|sk|sl|sm|sn|so|social|software|sohu|solar|solutions|soy|space|sr|st|su|supplies|supply|support|surf|surgery|suzuki|sv|sx|sy|systems|sz|tattoo|tax|tc|td|technology|tel|tf|tg|th|tienda|tips|tirol|tj|tk|tl|tm|tn|to|today|tokyo|tools|town|toys|tp|tr|trade|training|travel|tt|tv|tw|tz|ua|ug|uk|university|uno|us|uy|uz|va|vacations|vc|ve|vegas|ventures|versicherung|vet|vg|vi|viajes|villas|vision|vlaanderen|vn|vodka|vote|voting|voto|voyage|vu|wang|watch|webcam|website|wed|wf|wien|wiki|works|ws|wtc|wtf|xn|xxx|xyz|yachts|ye|yokohama|yt|za|zm|zone|zw|[a-z]{2})',
	')(', // 6. Port (optional)
	'(?::\\d{1,5})',
	')?(', // 7. Query string (optional)
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
	@param	{String} text Plain text to linkify
	@param	{Options} options to linkify with, in addition to the defaults for the context
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
		'href="http://$2$4$5$6$7"'
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
	linkReplace.push('>$2$3$4$5$6$7</' + settings.tagName + '>$8');

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

				/*
					Cleanup dummy node. This is to make sure that
					existing nodes don't get improperly removed
				*/
				while (dummyElement.firstChild) {
					dummyElement.removeChild(dummyElement.firstChild);
				}

				/*
					Linkify the text node, set the result to the
					dummy's contents
				*/
				dummyElement.innerHTML = Linkified.linkify.call(
					this,
					childNode.textContent || childNode.innerText || childNode.nodeValue
				);

				/*
					Parse the linkified text and append it to the
					new children
				*/
				children.push.apply(
					children,
					dummyElement.childNodes
				);

				// Clean up the dummy again?
				while (dummyElement.firstChild) {
					dummyElement.removeChild(dummyElement.firstChild);
				}

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
