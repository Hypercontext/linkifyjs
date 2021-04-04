import { terser } from 'rollup-plugin-terser';
import { plugins, linkifyClassicInterface, linkifyPlugin } from '../../rollup.config';

export default [
	{
		input: 'src/linkify.js',
		output: [
			{ file: 'lib/linkify.js', format: 'cjs', exports: 'auto' },
			{ file: 'dist/linkify.js', name: 'linkify', format: 'iife' },
			{ file: 'dist/linkify.min.js', name: 'linkify', format: 'iife', plugins: [terser()] }
		],
		plugins
	},
	{
		input: 'src/polyfill.js',
		output: {
			file: 'lib/polyfill.js',
			format: 'cjs',
			exports: 'auto'
		},
		plugins
	},

	// Interfaces
	linkifyClassicInterface('string', { globalName: 'linkifyStr', commonjs: true }),
	linkifyClassicInterface('html', { globalName: 'linkifyHtml', commonjs: true }),

	// Plugins
	linkifyPlugin('hashtag', { commonjs: true }),
	linkifyPlugin('mention', { commonjs: true }),
	linkifyPlugin('ticket', { commonjs: true })
];
