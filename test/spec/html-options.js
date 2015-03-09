// HTML to use with linkify-element and linkify-jquery
module.exports = {
	original:
		'Hello here are some links to ftp://awesome.com/?where=this and '+
		'localhost:8080, pretty neat right? '+
		'<p>Here\'s a nested github.com/SoapBox/linkifyjs paragraph</p>',
	linkified:
		'Hello here are some links to <a ' +
		'href="ftp://awesome.com/?where=this" class="linkified" '+
		'target="_blank">ftp://awesome.com/?where=this</a> and <a ' +
		'href="http://localhost:8080" class="linkified" target="_blank">' +
		'localhost:8080</a>, pretty neat right? <p>Here\'s a nested ' +
		'<a href="http://github.com/SoapBox/linkifyjs" class="linkified" ' +
		'target="_blank">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	linkifiedAlt:
		'Hello here are some links to <a ' +
		'href="ftp://awesome.com/?where=this" class="linkified" '+
		'target="_blank">ftp://awesome.com/?where=this</a> and <a ' +
		'href="http://localhost:8080" class="linkified" target="_blank">' +
		'localhost:8080</a>, pretty neat right? <p>Here\'s a nested ' +
		'<a href="http://github.com/SoapBox/linkifyjs" class="linkified" ' +
		'target="_blank">github.com/SoapBox/linkifyjs</a> paragraph</p>',
	altOptions: {}
};
