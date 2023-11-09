module.exports = (api) => {
	// Cache configuration is a required option
	api.cache(false);

	const presets = [
		[
			'@babel/preset-env',
			{
				useBuiltIns: false,
				loose: true,
				targets: {
					node: '10',
					browsers: ['defaults', 'maintained node versions'],
				},
			},
		],
	];

	return {
		presets,
		sourceType: 'module',
		babelrcRoots: ['.', 'packages/*'],
	};
};
