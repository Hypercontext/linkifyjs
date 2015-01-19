// Karma CI configuration

var
base = require('./conf'),
extend = require('lodash').extend;

module.exports = function (config) {

	// Check out https://saucelabs.com/platforms for all browser/platform combos
	var customLaunchers = {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome',
			platform: 'Windows 7',
			version: '35'
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox',
			version: '30'
		},
		sl_ios_safari: {
			base: 'SauceLabs',
			browserName: 'iphone',
			platform: 'OS X 10.9',
			version: '7.1'
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11'
		}
	};

	config.set(extend(base, {

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		sauceLabs: {
				testName: 'Linkify Browser Tests'
		},

		logLevel: config.LOG_WARN,
		browsers: ['Chrome'],
		autoWatch: false,
		singleRun: true

	}));
};
