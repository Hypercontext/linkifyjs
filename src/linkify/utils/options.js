function noop(val) {
	return val;
}

function yes(val) {
	return true;
}

function typeToTarget(href, type) {
	return type === 'url' ? '_blank' : null;
}

function normalize(opts) {
	opts = opts || {};
	let newLine = opts.newLine || false; // deprecated
	let ignoreTags = opts.ignoreTags || [];

	// Make all tags names upper case
	for (var i = 0; i < ignoreTags.length; i++) {
		ignoreTags[i] = ignoreTags[i].toUpperCase();
	}

	return {
		attributes:			opts.linkAttributes			|| null,
		defaultProtocol:	opts.defaultProtocol		|| 'http',
		events:				opts.events					|| null,
		format:				opts.format					|| noop,
		validate:			opts.validate				|| yes,
		formatHref:			opts.formatHref				|| noop,
		newLine:			opts.newLine				|| false, // deprecated
		nl2br:				!!newLine	|| opts.nl2br	|| false,
		tagName:			opts.tagName				|| 'a',
		target:				opts.target					|| typeToTarget,
		linkClass:			opts.linkClass				|| 'linkified',
		ignoreTags:			ignoreTags
	};
}

function resolve(value, ...params) {
	return typeof value === 'function' ? value(...params) : value;
}

export {normalize, resolve};
