import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export const plugins = [
	resolve(),
	commonjs(),
	babel({ babelHelpers: 'bundled' })
];

// For interfaces in their dedicated packages
export function linkifyInterface(name, opts = {}) {
	const iifeOpts = { name };
	const globals = { linkifyjs: 'linkify' };
	const external = ['linkifyjs'];
	if ('globalName' in opts) { iifeOpts.name = opts.globalName; }
	if ('globals' in opts) { Object.assign(globals, opts.globals); }
	if ('external' in opts) { external.push(...opts.external); }

	return {
		input: `src/linkify-${name}.js`,
		external,
		output: [
			{ file: 'index.js', format: 'cjs', exports: 'auto' },
			{ file: `dist/linkify-${name}.js`, format: 'iife', globals, ...iifeOpts },
			{ file: `dist/linkify-${name}.min.js`, format: 'iife', globals, ...iifeOpts, plugins: [terser()] },
		],
		plugins
	};
}


// Interfaces embedded in the main linkifyjs package, not yet fully migrated
// over to their own packages. This should be removed in v3.1 or v4
export function linkifyClassicInterface(name, opts = {}) {
	const iifeOpts = { name };
	const globals = { linkifyjs: 'linkify' };
	if ('globalName' in opts) { iifeOpts.name = opts.globalName; }

	const output = [
		{ file: `dist/linkify-${name}.js`, format: 'iife', globals, ...iifeOpts },
		{ file: `dist/linkify-${name}.min.js`, format: 'iife', globals, ...iifeOpts, plugins: [terser()] },
	];
	if (opts.commonjs) {
		output.push({ file: `lib/plugins/${name}.js`, format: 'cjs', exports: 'auto' });
	}

	return {
		input: `../linkifyjs/src/linkify-${name}.js`,
		external: ['linkifyjs'], // add other dependent packages here
		output,
		plugins
	};
}

// Includes plugins from main linkifyjs package because those have not yet been
// fully migrated to their own packages to maintain backward compatibility with
// v2. Will change in v4
export function linkifyPlugin(name, opts = {}) {
	const globals =  { linkifyjs: 'linkify' };
	const output = [
		{ file: `dist/linkify-plugin-${name}.js`, format: 'iife', globals, name: false },
		{ file: `dist/linkify-plugin-${name}.min.js`, format: 'iife', globals, name: false, plugins: [terser()] }
	];
	if (opts.commonjs) {
		output.push({ file: `lib/plugins/${name}.js`, format: 'cjs', exports: 'auto' })
	}
	return {
		input: `../linkifyjs/src/plugins/${name}.js`,
		external: ['linkifyjs'],
		output,
		plugins
	};
}

export default [
	{
		input: 'src/polyfill.js',
		output: [
			{
				file: 'lib/linkify-polyfill.js',
				format: 'cjs',
				exports: 'auto'
			},
			{
				file: 'dist/linkify-polyfill.js',
				name: 'linkifyPolyfill',
				format: 'iife'
			},
			{
				file: 'dist/linkify-polyfill.min.js',
				name: 'linkifyPolyfill',
				format: 'iife',
				plugins: [terser()]
			}
		],
		plugins
	},
	/*
	{
		input: 'src/linkify/core/generated/state-machine.js',
		output: [
			{
				file: 'dist/state-machine.min.js',
				name: 'linkifyScannerStart',
				format: 'iife',
				plugins: [terser()]
			}
		],
		plugins
	},
	*/
];
