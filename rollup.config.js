import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const plugins = [
	resolve(),
	babel({ babelHelpers: 'bundled' })
];

function linkifyInterface(name, opts = {}) {
	const iifeOpts = { name };
	if ('globalName' in opts) iifeOpts.name = opts.globalName;

	const globals =  {
		[`${__dirname}/src/linkify`]: 'linkify',
		'react': 'React',
		'jquery': 'jQuery'
	}

	return {
		input: `src/linkify-${name}.js`,
		external: ['./linkify', `${__dirname}/src/linkify`, 'react', 'jquery'],
		output: [
			{ file: `lib/linkify-${name}.js`, format: 'cjs', exports: 'auto' },
			{ file: `dist/linkify-${name}.js`, format: 'iife', globals, ...iifeOpts },
			{ file: `dist/linkify-${name}.min.js`, format: 'iife', globals, ...iifeOpts, plugins: [terser()] }
		],
		plugins
	}
}

function linkifyPlugin(name) {
	const globals =  { [`${__dirname}/src/linkify`]: 'linkify' }

	return {
		input: `src/plugins/${name}.js`,
		external: ['../linkify', `${__dirname}/src/linkify`],
		output: [
			{ file: `lib/plugins/${name}.js`, format: 'cjs', exports: 'auto' },
			{ file: `dist/linkify-plugin-${name}.js`, format: 'iife', globals, name: false },
			{ file: `dist/linkify-plugin-${name}.min.js`, format: 'iife', globals, name: false, plugins: [terser()] }
		],
		plugins
	}
}

export default [
	{
		input: 'src/linkify.js',
		output: [
			{
				file: 'lib/linkify.js',
				format: 'cjs',
				exports: 'auto'
			},
			{
				file: 'dist/linkify.js',
				name: 'linkify',
				format: 'iife'
			},
			{
				file: 'dist/linkify.min.js',
				name: 'linkify',
				format: 'iife',
				plugins: [terser()]
			}
		],
		plugins
	},

	// Interfaces
	linkifyInterface('string', { globalName: 'linkifyStr' }),
	linkifyInterface('html', { globalName: 'linkifyHtml' }),
	linkifyInterface('element', { globalName: 'linkifyElement' }),
	linkifyInterface('react', { globalName: 'Linkify' }),
	linkifyInterface('jquery', { globalName: false }),

	// Plugins
	linkifyPlugin('hashtag'),
	linkifyPlugin('mention'),
	linkifyPlugin('ticket')
];
