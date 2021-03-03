module.exports = (api) => {
	// Cache configuration is a required option
	api.cache(false);

	const presets = [
		[
			"@babel/preset-env",
			{
				useBuiltIns: false,
				targets: {
					node: '10',
					browsers: [
						'defaults',
						'maintained node versions'
					]
				}
			}
		]
	];

	const sourceType = 'module'

	return { presets, sourceType };
}
