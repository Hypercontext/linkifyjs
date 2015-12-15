var linkifyHtml = require('../../lib/linkify-html');
var htmlOptions = require('./html/options');

describe('linkify-html', function () {

	it('Works with default options', function () {
		var linkified = linkifyHtml(htmlOptions.original);
		expect(htmlOptions.linkified).to.contain(linkified);
	});

	it('Works with overriden options', function () {
		var linkified = linkifyHtml(
			htmlOptions.original,
			htmlOptions.altOptions
		);
		expect(htmlOptions.linkifiedAlt).to.contain(linkified);
	});

});
