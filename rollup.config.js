import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export const plugins = [resolve(), commonjs(), babel({ babelHelpers: 'bundled' })];

// For interfaces in their dedicated packages
export function linkifyInterface(name, opts = {}) {
	const iifeOpts = { name };
	const globals = { linkifyjs: 'linkify' };
	const external = ['linkifyjs'];
	if ('globalName' in opts) {
		iifeOpts.name = opts.globalName;
	}
	if ('globals' in opts) {
		Object.assign(globals, opts.globals);
	}
	if ('external' in opts) {
		external.push(...opts.external);
	}

	return {
		input: `src/linkify-${name}.js`,
		external,
		output: [
			{ file: `dist/linkify-${name}.js`, format: 'iife', globals, ...iifeOpts },
			{ file: `dist/linkify-${name}.min.js`, format: 'iife', globals, ...iifeOpts, plugins: [terser()] },
			{ file: `dist/linkify-${name}.cjs.js`, format: 'cjs', exports: 'auto' },
			{ file: `dist/linkify-${name}.es.js`, format: 'es' },
		],
		plugins,
	};
}

// Includes plugins from main linkifyjs package because those have not yet been
// fully migrated to their own packages to maintain backward compatibility with
// v2. Will change in v4
export function linkifyPlugin(plugin, opts = {}) {
	const name = opts.globalName || false; // Most plugins don't export anything
	const globals = { linkifyjs: 'linkify' };
	return {
		input: 'src/index.js',
		external: ['linkifyjs'],
		output: [
			{ file: `dist/linkify-plugin-${plugin}.js`, format: 'iife', globals, name },
			{ file: `dist/linkify-plugin-${plugin}.min.js`, format: 'iife', globals, name, plugins: [terser()] },
			{ file: `dist/linkify-plugin-${plugin}.cjs.js`, format: 'cjs', exports: 'auto' },
			{ file: `dist/linkify-plugin-${plugin}.es.js`, format: 'es' },
		],
		plugins,
	};
}
