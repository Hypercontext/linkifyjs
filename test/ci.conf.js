// Karma CI configuration
const base = require('./conf');

module.exports = function (config) {

	// https://www.browserstack.com/docs/automate/api-reference/selenium/introduction#rest-api-browsers
	const customLaunchers = {
		bs_chrome_mac: {
			base: 'BrowserStack',
			browser: 'chrome',
			os: 'OS X',
			os_version: 'Big Sur'
		},
		bs_chrome_windows: {
			base: 'BrowserStack',
			browser: 'chrome',
			os: 'Windows',
			os_version: '10'
		},
		bs_firefox_windows: {
			base: 'BrowserStack',
			browser: 'firefox',
			os: 'Windows',
			os_version: '10'
		},
		bs_safari_sierra: {
			base: 'BrowserStack',
			browser: 'safari',
			os: 'OS X',
			os_version: 'Sierra'
		},
		bs_safari_bigsur: {
			base: 'BrowserStack',
			browser: 'safari',
			os: 'OS X',
			os_version: 'Big Sur'
		},
		bs_ios_safari: {
			base: 'BrowserStack',
			browser: 'iphone',
			os: 'ios',
			os_version: '12',
			device: 'iPhone 8',
		},
		bs_android_8: {
			base: 'BrowserStack',
			os: 'android',
			os_version: '9.0',
			browser: 'android',
			device: 'Google Pixel 3',
		},
		bs_android_11: {
			base: 'BrowserStack',
			os: 'android',
			os_version: '11.0',
			browser: 'android',
			device: 'Google Pixel 5',
		},
		bs_edge: {
			base: 'BrowserStack',
			browser: 'edge',
			os: 'Windows',
			os_version: '10'
		},
		bs_ie_11: {
			base: 'BrowserStack',
			browser: 'ie',
			browser_version: '11.0',
			os: 'Windows',
			os_version: '8.1'
		}
	};

	config.set({
		...base,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		browserStack: {
			project: 'linkifyjs',
			username: process.env.BROWSERSTACK_USERNAME,
			accessKey: process.env.BROWSERSTACK_ACCESS_KEY
		},

		customLaunchers,
		browsers: Object.keys(customLaunchers),
		singleRun: true,
		reporters: ['dots', 'BrowserStack'],
	});
};
