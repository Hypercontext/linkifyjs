/*
 *  Linkify - v1.1.6
 *  Find URLs in plain text and return HTML for discovered links.
 *  https://github.com/HitSend/jQuery-linkify/
 *
 *  Made by SoapBox Innovations, Inc.
 *  Under MIT License
 */
!function($, window, document) {
    "use strict";
    function Linkified(element, options) {
        this._defaults = defaults, this.element = element, this.setOptions(options), this.init();
    }
    var defaults = {
        tagName: "a",
        newLine: "\n",
        target: "_blank",
        linkClass: null,
        linkClasses: [],
        linkAttributes: null
    };
    Linkified.prototype = {
        constructor: Linkified,
        init: function() {
            1 === this.element.nodeType ? Linkified.linkifyNode.call(this, this.element) : this.element = Linkified.linkify.call(this, this.element.toString());
        },
        setOptions: function(options) {
            this.settings = Linkified.extendSettings(options, this.settings);
        },
        toString: function() {
            return this.element.toString();
        }
    }, Linkified.extendSettings = function(options, settings) {
        var prop;
        settings = settings || {};
        for (prop in defaults) settings[prop] || (settings[prop] = defaults[prop]);
        for (prop in options) settings[prop] = options[prop];
        return settings;
    }, Linkified.linkMatch = new RegExp([ "(", '\\s|[^a-zA-Z0-9.\\+_\\/"\\>\\-]|^', ")(?:", "(", "[a-zA-Z0-9\\+_\\-]+", "(?:", "\\.[a-zA-Z0-9\\+_\\-]+", ")*@", ")?(", "http:\\/\\/|https:\\/\\/|ftp:\\/\\/", ")?(", "(?:(?:[a-z0-9][a-z0-9_%\\-_+]*\\.)+)", ")(", "(?:ac|academy|accountants|active|actor|ad|ae|aero|af|ag|agency|ai|airforce|al|am|an|ao|aq|ar|archi|army|arpa|as|asia|associates|at|attorney|au|audio|autos|aw|ax|axa|az|ba|bar|bargains|bayern|bb|bd|be|beer|berlin|best|bf|bg|bh|bi|bid|bike|bio|biz|bj|black|blackfriday|blue|bm|bmw|bn|bo|boutique|br|brussels|bs|bt|build|builders|buzz|bv|bw|by|bz|bzh|ca|cab|camera|camp|cancerresearch|capetown|capital|cards|care|career|careers|cash|cat|catering|cc|cd|center|ceo|cf|cg|ch|cheap|christmas|church|ci|citic|ck|cl|claims|cleaning|clinic|clothing|club|cm|cn|co|codes|coffee|college|cologne|com|community|company|computer|condos|construction|consulting|contractors|cooking|cool|coop|country|cr|credit|creditcard|cruises|cu|cuisinella|cv|cw|cx|cy|cz|dance|dating|de|degree|democrat|dental|dentist|desi|diamonds|digital|direct|directory|discount|dj|dk|dm|dnp|do|domains|durban|dz|ec|edu|education|ee|eg|email|engineer|engineering|enterprises|equipment|er|es|estate|et|eu|eus|events|exchange|expert|exposed|fail|farm|feedback|fi|finance|financial|fish|fishing|fitness|fj|fk|flights|florist|fm|fo|foo|foundation|fr|frogans|fund|furniture|futbol|ga|gal|gallery|gb|gd|ge|gf|gg|gh|gi|gift|gives|gl|glass|global|globo|gm|gmo|gn|gop|gov|gp|gq|gr|graphics|gratis|green|gripe|gs|gt|gu|guide|guitars|guru|gw|gy|hamburg|haus|hiphop|hiv|hk|hm|hn|holdings|holiday|homes|horse|host|house|hr|ht|hu|id|ie|il|im|immobilien|in|industries|info|ink|institute|insure|int|international|investments|io|iq|ir|is|it|je|jetzt|jm|jo|jobs|joburg|jp|juegos|kaufen|ke|kg|kh|ki|kim|kitchen|kiwi|km|kn|koeln|kp|kr|kred|kw|ky|kz|la|land|lawyer|lb|lc|lease|li|life|lighting|limited|limo|link|lk|loans|london|lotto|lr|ls|lt|lu|luxe|luxury|lv|ly|ma|maison|management|mango|market|marketing|mc|md|me|media|meet|menu|mg|mh|miami|mil|mini|mk|ml|mm|mn|mo|mobi|moda|moe|monash|mortgage|moscow|motorcycles|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|nagoya|name|navy|nc|ne|net|neustar|nf|ng|nhk|ni|ninja|nl|no|np|nr|nu|nyc|nz|okinawa|om|onl|org|organic|ovh|pa|paris|partners|parts|pe|pf|pg|ph|photo|photography|photos|physio|pics|pictures|pink|pk|pl|place|plumbing|pm|pn|post|pr|press|pro|productions|properties|ps|pt|pub|pw|py|qa|qpon|quebec|re|recipes|red|rehab|reise|reisen|ren|rentals|repair|report|republican|rest|reviews|rich|rio|ro|rocks|rodeo|rs|ru|ruhr|rw|ryukyu|sa|saarland|sb|sc|schmidt|schule|scot|sd|se|services|sexy|sg|sh|shiksha|shoes|si|singles|sj|sk|sl|sm|sn|so|social|software|sohu|solar|solutions|soy|space|sr|st|su|supplies|supply|support|surf|surgery|suzuki|sv|sx|sy|systems|sz|tattoo|tax|tc|td|technology|tel|tf|tg|th|tienda|tips|tirol|tj|tk|tl|tm|tn|to|today|tokyo|tools|town|toys|tp|tr|trade|training|travel|tt|tv|tw|tz|ua|ug|uk|university|uno|us|uy|uz|va|vacations|vc|ve|vegas|ventures|versicherung|vet|vg|vi|viajes|villas|vision|vlaanderen|vn|vodka|vote|voting|voto|voyage|vu|wang|watch|webcam|website|wed|wf|wien|wiki|works|ws|wtc|wtf|xn|xxx|xyz|yachts|ye|yokohama|yt|za|zm|zone|zw|[a-z]{2})", ")(", "(?::\\d{1,5})", ")?(", "(?:", "[\\/|\\?]", "(?:", "[\\-a-zA-Z0-9_%#*&+=~!?,;:.\\/]*", ")*", ")", "[\\-\\/a-zA-Z0-9_%#*&+=~]", "|", "\\/?", ")?", ")(", '[^a-zA-Z0-9\\+_\\/"\\<\\-]|$', ")" ].join(""), "g"), 
    Linkified.emailLinkMatch = /(<[a-z]+ href=\")(http:\/\/)([a-zA-Z0-9\+_\-]+(?:\.[a-zA-Z0-9\+_\-]+)*@)/g, 
    Linkified.linkify = function(text, options) {
        var attr, settings, linkClasses, linkReplace = [];
        this.constructor === Linkified && this.settings ? (settings = this.settings, options && (settings = Linkified.extendSettings(options, settings))) : settings = Linkified.extendSettings(options), 
        linkClasses = settings.linkClass ? settings.linkClass.split(/\s+/) : [], linkClasses.push.apply(linkClasses, settings.linkClasses), 
        text = text.replace(/</g, "&lt;").replace(/(\s)/g, "$1$1"), linkReplace.push("$1<" + settings.tagName, 'href="http://$2$4$5$6$7"'), 
        linkReplace.push('class="linkified' + (linkClasses.length > 0 ? " " + linkClasses.join(" ") : "") + '"'), 
        settings.target && linkReplace.push('target="' + settings.target + '"');
        for (attr in settings.linkAttributes) linkReplace.push([ attr, '="', settings.linkAttributes[attr].replace(/\"/g, "&quot;").replace(/\$/g, "&#36;"), '"' ].join(""));
        return linkReplace.push(">$2$3$4$5$6$7</" + settings.tagName + ">$8"), text = text.replace(Linkified.linkMatch, linkReplace.join(" ")), 
        text = text.replace(Linkified.emailLinkMatch, "$1mailto:$3"), text = text.replace(/(\s){2}/g, "$1"), 
        text = text.replace(/\n/g, settings.newLine);
    }, Linkified.linkifyNode = function(node) {
        var children, childNode, childCount, dummyElement, i;
        if (node && "object" == typeof node && 1 === node.nodeType && "a" !== node.tagName.toLowerCase() && !/[^\s]linkified[\s$]/.test(node.className)) {
            for (children = [], dummyElement = Linkified._dummyElement || document.createElement("div"), 
            childNode = node.firstChild, childCount = node.childElementCount; childNode; ) {
                if (3 === childNode.nodeType) {
                    for (;dummyElement.firstChild; ) dummyElement.removeChild(dummyElement.firstChild);
                    for (dummyElement.innerHTML = Linkified.linkify.call(this, childNode.textContent || childNode.innerText || childNode.nodeValue), 
                    children.push.apply(children, dummyElement.childNodes); dummyElement.firstChild; ) dummyElement.removeChild(dummyElement.firstChild);
                } else 1 === childNode.nodeType ? children.push(Linkified.linkifyNode(childNode)) : children.push(childNode);
                childNode = childNode.nextSibling;
            }
            for (;node.firstChild; ) node.removeChild(node.firstChild);
            for (i = 0; i < children.length; i++) node.appendChild(children[i]);
        }
        return node;
    }, Linkified._dummyElement = document.createElement("div"), $.fn.linkify = function(options) {
        return this.each(function() {
            var linkified;
            (linkified = $.data(this, "plugin-linkify")) ? (linkified.setOptions(options), linkified.init()) : $.data(this, "plugin-linkify", new Linkified(this, options));
        });
    }, $.fn.linkify.Constructor = Linkified, $(window).on("load", function() {
        $("[data-linkify]").each(function() {
            var $target, $this = $(this), target = $this.attr("data-linkify"), options = {
                tagName: $this.attr("data-linkify-tagname"),
                newLine: $this.attr("data-linkify-newline"),
                target: $this.attr("data-linkify-target"),
                linkClass: $this.attr("data-linkify-linkclass")
            };
            for (var option in options) "undefined" == typeof options[option] && delete options[option];
            $target = "this" === target ? $this : $this.find(target), $target.linkify(options);
        });
    }), $("body").on("click", ".linkified", function() {
        var $link = $(this), url = $link.attr("href"), isEmail = /^mailto:/i.test(url), target = $link.attr("target");
        return isEmail ? window.location.href = url : window.open(url, target), !1;
    });
}(jQuery, window, document);
