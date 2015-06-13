if (typeof expect !== 'function') {
	if (typeof window !== 'undefined') {
		window.expect = require('expect.js');
	} else if (typeof global !== 'undefined') {
		global.expect = require('expect.js');
	}
}
