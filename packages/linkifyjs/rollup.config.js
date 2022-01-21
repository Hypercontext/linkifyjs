import { terser } from 'rollup-plugin-terser';
import { plugins } from '../../rollup.config';

export default [
	{
		input: 'src/linkify.js',
		output: [
			{ file: 'index.js', format: 'cjs', exports: 'auto' },
			{ file: 'dist/linkify.js', name: 'linkify', format: 'iife' },
			{ file: 'dist/linkify.min.js', name: 'linkify', format: 'iife', plugins: [terser()] },
			{ file: 'dist/linkify.module.js', format: 'es' }
		],
		plugins
	}
];
