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
	')(', // 5. Top-level domain - http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains
	'(?:ac|academy|accountants|active|actor|ad|ae|aero|af|ag|agency|ai|airforce|al|allfinanz|alsace|am|an|ao|aq|ar|archi|army|arpa|as|asia|associates|at|attorney|au|auction|audio|autos|aw|ax|axa|az|ba|bar|bargains|bayern|bb|bd|be|beer|berlin|best|bf|bg|bh|bi|bid|bike|bio|biz|bj|black|blackfriday|blue|bm|bmw|bn|bnpparibas|bo|boo|boutique|br|brussels|bs|bt|budapest|build|builders|business|buzz|bv|bw|by|bz|bzh|ca|cab|cal|camera|camp|cancerresearch|capetown|capital|caravan|cards|care|career|careers|casa|cash|cat|catering|cc|cd|center|ceo|cern|cf|cg|ch|channel|cheap|christmas|chrome|church|ci|citic|city|ck|cl|claims|cleaning|click|clinic|clothing|club|cm|cn|co|codes|coffee|college|cologne|com|community|company|computer|condos|construction|consulting|contractors|cooking|cool|coop|country|cr|credit|creditcard|cruises|cu|cuisinella|cv|cw|cx|cy|cymru|cz|dad|dance|dating|day|de|deals|degree|democrat|dental|dentist|desi|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|dnp|do|domains|durban|dvag|dz|eat|ec|edu|education|ee|eg|email|engineer|engineering|enterprises|equipment|er|es|esq|estate|et|eu|eus|events|exchange|expert|exposed|fail|farm|feedback|fi|finance|financial|fish|fishing|fitness|fj|fk|flights|florist|fly|fm|fo|foo|forsale|foundation|fr|frl|frogans|fund|furniture|futbol|ga|gal|gallery|gb|gbiz|gd|ge|gent|gf|gg|gh|gi|gift|gifts|gives|gl|glass|gle|global|globo|gm|gmail|gmo|gmx|gn|google|gop|gov|gp|gq|gr|graphics|gratis|green|gripe|gs|gt|gu|guide|guitars|guru|gw|gy|hamburg|haus|healthcare|help|here|hiphop|hiv|hk|hm|hn|holdings|holiday|homes|horse|host|hosting|house|how|hr|ht|hu|ibm|id|ie|il|im|immo|immobilien|in|industries|info|ing|ink|institute|insure|int|international|investments|io|iq|ir|is|it|je|jetzt|jm|jo|jobs|joburg|jp|juegos|kaufen|ke|kg|kh|ki|kim|kitchen|kiwi|km|kn|koeln|kp|kr|krd|kred|kw|ky|kz|la|lacaixa|land|lawyer|lb|lc|lease|lgbt|li|life|lighting|limited|limo|link|lk|loans|london|lotto|lr|ls|lt|ltda|lu|luxe|luxury|lv|ly|ma|maison|management|mango|market|marketing|mc|md|me|media|meet|melbourne|meme|menu|mg|mh|miami|mil|mini|mk|ml|mm|mn|mo|mobi|moda|moe|monash|mortgage|moscow|motorcycles|mov|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|nagoya|name|navy|nc|ne|net|network|neustar|new|nexus|nf|ng|ngo|nhk|ni|ninja|nl|no|np|nr|nra|nrw|nu|nyc|nz|okinawa|om|ong|onl|ooo|org|organic|otsuka|ovh|pa|paris|partners|parts|pe|pf|pg|ph|pharmacy|photo|photography|photos|physio|pics|pictures|pink|pizza|pk|pl|place|plumbing|pm|pn|pohl|post|pr|praxi|press|pro|prod|productions|prof|properties|property|ps|pt|pub|pw|py|qa|qpon|quebec|re|realtor|recipes|red|rehab|reise|reisen|ren|rentals|repair|report|republican|rest|restaurant|reviews|rich|rio|ro|rocks|rodeo|rs|rsvp|ru|ruhr|rw|ryukyu|sa|saarland|sarl|sb|sc|sca|scb|schmidt|schule|scot|sd|se|services|sexy|sg|sh|shiksha|shoes|si|singles|sj|sk|sl|sm|sn|so|social|software|sohu|solar|solutions|soy|space|spiegel|sr|st|su|supplies|supply|support|surf|surgery|suzuki|sv|sx|sy|systems|sz|tatar|tattoo|tax|tc|td|technology|tel|tf|tg|th|tienda|tips|tirol|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|town|toys|tp|tr|trade|training|travel|tt|tui|tv|tw|tz|ua|ug|uk|university|uno|uol|us|uy|uz|va|vacations|vc|ve|vegas|ventures|versicherung|vet|vg|vi|viajes|villas|vision|vlaanderen|vn|vodka|vote|voting|voto|voyage|vu|wales|wang|watch|webcam|website|wed|wf|whoswho|wien|wiki|williamhill|wme|work|works|world|ws|wtc|wtf|xn--1qqw23a|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--45brj9c|xn--4gbrim|xn--55qw42g|xn--55qx5d|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80asehdb|xn--80aswg|xn--90a3ac|xn--c1avg|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czru2d|xn--d1acj3b|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--gecrj9c|xn--h2brj9c|xn--i1b6b1a6a2e|xn--io0a7i|xn--j1amh|xn--j6w193g|xn--kprw13d|xn--kpry57d|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a4f16a|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbayh7gpa|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgberp4a5d4ar|xn--mgbx4cd0ab|xn--ngbc5azd|xn--nqv7f|xn--nqv7fs00ema|xn--o3cw4h|xn--ogbpf8fl|xn--p1acf|xn--p1ai|xn--pgbs0dh|xn--q9jyb4c|xn--rhqv96g|xn--s9brj9c|xn--ses554g|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xxx|xyz|yachts|yandex|ye|yokohama|youtube|yt|za|zip|zm|zone|zw)',
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
				children.push(Linkified.linkifyNode.call(this, childNode));

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
