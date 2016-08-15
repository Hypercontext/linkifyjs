if (typeof expect !== 'function') {
	if (typeof window !== 'undefined') {
		window.expect = require('chai').expect;
	} else if (typeof global !== 'undefined') {
		global.expect = require('chai').expect;
	}
}
