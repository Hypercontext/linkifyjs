// Karma CI configuration
const base = require('./conf');
const extend = require('lodash/extend');

module.exports = function (config) {

	// Check out https://saucelabs.com/platforms for all browser/platform combos
	var customLaunchers = {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome',
			version: '48'
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox',
			version: '45'
		},
		sl_safari: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '9'
		},
		sl_edge: {
			base: 'SauceLabs',
			browserName: 'MicrosoftEdge',
			platform: 'Windows 10',
			version: '13'
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11'
		},
		sl_ie_9: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '9'
		},
		sl_ie_8: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '8'
		}
	};

	config.set(extend(base, {

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		sauceLabs: {
			testName: 'Linkify Browser Tests'
		},
		browserDisconnectTimeout: 30000,
		browserNoActivityTimeout: 30000,
		browserDisconnectTolerance: 3,
		customLaunchers: customLaunchers,
		browsers: Object.keys(customLaunchers),
		autoWatch: false,
		singleRun: true,
		logLevel: config.LOG_WARN,
		reporters: [
			'dots',
			'saucelabs'
		],
	}));
};
