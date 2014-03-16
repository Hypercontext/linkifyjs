/*
 *  Linkify - v1.1.3
 *  Find URLs in plain text and return HTML for discovered links.
 *  https://github.com/HitSend/jQuery-linkify/
 *
 *  Made by SoapBox Innovations, Inc.
 *  Under MIT License
 */
!function($, window, document, undefined) {
    "use strict";
    function Linkified(element, options) {
        this._defaults = defaults, this.element = element, this.setOptions(options), this.init();
    }
    var defaults = {
        tagName: "a",
        target: "_blank",
        linkClass: null,
        linkClasses: [],
        linkAttributes: null,
        format: function(link) {
            return link;
        },
        nl2br: !1,
        preserveWhitespace: !1
    };
    window.Linkified = Linkified, Linkified.prototype = {
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
    }, Linkified.linkMatch = new RegExp([ "(", "https?:\\/\\/|ftps?:\\/\\/", ")?(", "(?:(?:[a-z0-9][a-z0-9_%\\-_+]*\\.)+)", ")(", "(?:[a-z]{4-12}|com|biz|cab|cat|edu|eus|giv|int|mil|net|org|pro|tel|[a-z]{2})", ")(", "(?:", "[\\/|\\?]", "(?:", "[\\-a-zA-Z0-9_%#*&+=~!?,;:.\\/]*", ")*", ")", "[\\-\\/a-zA-Z0-9_%#*&+=~]", "|", "\\/?", ")?" ].join("")), 
    Linkified.emailLinkMatch = /[a-zA-Z0-9%\+_\-]+(\.[a-zA-Z0-9%\+_\-]*)+@([a-z0-9][a-z0-9_%\-_+]*\.)+([a-z]{2}|com|biz|cab|cat|edu|eus|giv|int|mil|net|org|pro|tel|[a-z]{4-12})/, 
    Linkified.linkify = function(text, options) {
        function textToNodes(text, nl2br) {
            var lines, nodes = [];
            if (nl2br) {
                lines = text.split("\n");
                for (var i = 0; i < lines.length; i++) nodes.push(new Text(lines[i])), i < lines.length - 1 && nodes.push(document.createElement("br"));
            } else nodes.push(new Text(text));
            return nodes;
        }
        var settings, linkClasses, words;
        this.constructor === Linkified && this.settings ? (settings = this.settings, options && (settings = Linkified.extendSettings(options, settings))) : settings = Linkified.extendSettings(options), 
        linkClasses = settings.linkClass ? settings.linkClass.split(/\s+/) : [], linkClasses.push.apply(linkClasses, settings.linkClasses), 
        words = text.split(settings.preserveWhitespace ? " " : /[^\S\n]+/);
        for (var defaultTarget = settings.target || settings.linkAttributes.target || "_blank", nodeList = [], dummyElement = Linkified._dummyElement, phrase = ""; dummyElement.firstChild; ) dummyElement.removeChild(dummyElement.firstChild);
        for (var i = 0; i < words.length; i++) {
            var word = words[i], action = null, linkPadding = null, hasMatch = !1, display = null, matches = null, href = null, target = null, searchIndex = word.search(/[.@#]/);
            if (searchIndex >= 0 && searchIndex < word.length - i) {
                if (target = defaultTarget, (matches = word.match(this.constructor.emailLinkMatch)) ? (hasMatch = !0, 
                linkPadding = word.split(matches[0], 2), display = matches[0], href = "mailto:" + display, 
                target = null, action = "a" === settings.tagName ? null : function() {
                    return window.location.href = href, !1;
                }) : (matches = word.match(this.constructor.linkMatch)) ? (hasMatch = !0, linkPadding = word.split(matches[0], 2), 
                display = matches[0], href = display, 0 !== display.search(/(https?|ftps?):\/\//) && (href = "http://" + display), 
                action = "a" === settings.tagName ? null : function() {
                    return window.open(href, target), !1;
                }) : phrase += word + " ", hasMatch) {
                    var linkified = document.createElement(settings.tagName);
                    linkified.setAttribute("href", href), target && linkified.setAttribute("target", target), 
                    linkified.setAttribute("class", "linkified " + linkClasses.join(" "));
                    for (var prop in settings.linkAttributes) linkified.setAttribute(prop, settings.linkAttributes[prop]);
                    linkified.innerText = display, action && (linkified.addEventListener ? linkified.addEventListener("click", action) : linkified.attachEvent && linkified.attachEvent("onclick", action)), 
                    phrase += linkPadding[0], nodeList.push.apply(nodeList, textToNodes(phrase, settings.nl2br)), 
                    nodeList.push(linkified), phrase = linkPadding[1] + " ";
                }
            } else phrase += word + " ";
        }
        return nodeList.push.apply(nodeList, textToNodes(phrase)), nodeList;
    }, Linkified.linkifyNode = function(node) {
        var children, childNode, childCount, dummyElement, i;
        if (node && "object" == typeof node && 1 === node.nodeType && "a" !== node.tagName.toLowerCase() && !/[^\s]linkified[\s$]/.test(node.className)) {
            for (children = [], dummyElement = Linkified._dummyElement || document.createElement("div"), 
            childNode = node.firstChild, childCount = node.childElementCount; childNode; ) 3 === childNode.nodeType ? children.push.apply(children, Linkified.linkify.call(this, childNode.textContent || childNode.innerText)) : 1 === childNode.nodeType ? children.push(Linkified.linkifyNode(childNode)) : children.push(childNode), 
            childNode = childNode.nextSibling;
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
                tagName: $this.attr("data-linkify-tagname") || undefined,
                newLine: $this.attr("data-linkify-newline") || undefined,
                target: $this.attr("data-linkify-target") || undefined,
                linkClass: $this.attr("data-linkify-linkclass") || undefined
            };
            $target = "this" === target ? $this : $this.find(target), $target.linkify(options);
        });
    }), $("body").on("click", ".linkified", function() {
        var $link = $(this), url = $link.attr("href"), isEmail = /^mailto:/i.test(url), target = $link.attr("target");
        return isEmail ? window.location.href = url : window.open(url, target), !1;
    });
}(jQuery, window, document);