/**
  Convert strings of text into linkable HTML text
*/

import * as linkify from './linkify';

const {tokenize, options} = linkify;
const {Options} = options;

function escapeText(text) {
  return text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

function escapeAttr(href) {
  return href.replace(/"/g, '&quot;');
}

function attributesToString(attributes) {
  if (!attributes) { return ''; }
  let result = [];

  for (let attr in attributes) {
    let val = attributes[attr] + '';
    result.push(`${attr}="${escapeAttr(val)}"`);
  }
  return result.join(' ');
}

function linkifyStr(str, opts = {}) {
  opts = new Options(opts);

  let tokens = tokenize(str);
  let result = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (token.type === 'nl' && opts.nl2br) {
      result.push('<br>\n');
      continue;
    } else if (!token.isLink || !opts.check(token)) {
      result.push(escapeText(token.toString()));
      continue;
    }

    let {
      formatted,
      formattedHref,
      prefix,
      postfix,
      tagName,
      className,
      target,
      attributes,
    } = opts.resolve(token);

    let link = `<${tagName} href="${escapeAttr(formattedHref)}"`;

    if (className) {
      link += ` class="${escapeAttr(className)}"`;
    }

    if (target) {
      link += ` target="${escapeAttr(target)}"`;
    }

    if (attributes) {
      link += ` ${attributesToString(attributes)}`;
    }

    link += `>${escapeText(formatted)}</${tagName}>`;

    if (prefix) {
      result.push(prefix);
    }

    result.push(link);

    if (postfix) {
      result.push(postfix);
    }
  }

  return result.join('');
}

if (!String.prototype.linkify) {
  try {
    Object.defineProperty(String.prototype, 'linkify', {
      set: function() {},
      get: function() {
        return function linkify(opts) {
          return linkifyStr(this, opts);
        };
      }
    });
  } catch (e) {
    // IE 8 doesn't like Object.defineProperty on non-DOM objects
    if (!String.prototype.linkify) {
      String.prototype.linkify = function (opts) {
        return linkifyStr(this, opts);
      };
    }
  }

}

export default linkifyStr;
