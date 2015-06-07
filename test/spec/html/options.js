// HTML to use with linkify-element and linkify-jquery
var fs = require('fs');

module.exports = {
	original: fs.readFileSync(__dirname + '/original.html', 'utf8').trim(),

	// These are split into arrays by line, where each line represents a
	// different attribute ordering (based on the rendering engine)
	// Each line is semantically identical.
	linkified: fs.readFileSync(__dirname + '/linkified.html', 'utf8')
		.trim()
		.split('\n'),
	linkifiedAlt: fs.readFileSync(__dirname + '/linkified-alt.html', 'utf8')
		.trim()
		.split('\n'),

	extra: fs.readFileSync(__dirname + '/extra.html', 'utf8').trim(), // for jQuery plugin tests
	altOptions: {
		linkAttributes: {
			rel: 'nofollow'
		},
		events: {
			click: function () {
				throw 'Clicked!';
			},
			mouseover: function () {
				throw 'Hovered!';
			}
		}
	}
};
