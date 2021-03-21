// Karma CI configuration
const base = require('./conf');

module.exports = function (config) {

	// Check out https://saucelabs.com/platforms for all browser/platform combos
	var customLaunchers = {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome'
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox'
		},
		sl_safari: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '9'
		},
		/**
		// Too fragile
		sl_ios_safari: {
			base: 'SauceLabs',
			deviceName: 'iPhone Simulator',
			platformVersion: '11.3',
			platformName: 'iOS',
			browserName: 'Safari',
			deviceOrientation: 'portrait',
			appiumVersion: '1.9.1'
		},
		*/
		/*
		// Not working due to incorrect localhost hostname
		sl_android: {
			base: 'SauceLabs',
			deviceName: 'Android GoogleAPI Emulator',
			platformName: 'Android',
			platformVersion: '8.1',
			browserName: 'Chrome',
			deviceOrientation: 'portrait',
			appiumVersion: '1.20.2'
		},
		*/
		sl_edge: {
			base: 'SauceLabs',
			browserName: 'MicrosoftEdge',
			platform: 'Windows 10'
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11'
		}
	};

	config.set({
		...base,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		sauceLabs: {
			testName: 'Linkify Browser Tests'
		},
		customLaunchers: customLaunchers,
		browsers: Object.keys(customLaunchers),
		singleRun: true,
		logLevel: config.LOG_WARN,
		reporters: ['dots', 'saucelabs'],
	});
};
