// HTML to use with linkify-element and linkify-jquery
var fs = require('fs');

module.exports = {
	original: fs.readFileSync(__dirname + '/original.html', 'utf8').trim(),
	linkified: fs.readFileSync(__dirname + '/linkified.html', 'utf8').trim(),
	linkifiedAlt: fs.readFileSync(__dirname + '/linkified-alt.html', 'utf8').trim(),
	extra: fs.readFileSync(__dirname + '/extra.html', 'utf8').trim(), // for jQuery plugin tests
	altOptions: {
		linkAttributes: {
			rel: 'nofollow'
		}
	}
};
