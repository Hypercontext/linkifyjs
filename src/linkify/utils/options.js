function noop(val) {
	return val;
}

function typeToTarget(type) {
	return type === 'url' ? '_blank' : null;
}

function normalize(opts) {
	opts = opts || {};
	let newLine = opts.newLine || false; // deprecated
	return {
		attributes:			opts.linkAttributes			|| null,
		defaultProtocol:	opts.defaultProtocol		|| 'http',
		format:				opts.format					|| noop,
		formatHref:			opts.formatHref				|| noop,
		newLine:			opts.newLine				|| false, // deprecated
		nl2br:				!!newLine	|| opts.nl2br	|| false,
		tagName:			opts.tagName				|| 'a',
		target:				opts.target					|| typeToTarget,
		linkClass:			opts.linkClass				|| 'linkified'
	};
}

function resolve(value, ...params) {
	return typeof value === 'function' ? value(...params) : value;
}

export {normalize, resolve};
