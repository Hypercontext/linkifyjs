/* global test:true */
/* global equal:true */


test("linkify basics", function () {

	var linkifyTests = [{
		input: 'google.com',
		output: '<a href="http://google.com" class="linkified" target="_blank" >google.com</a>',
		options: null
	}, {
		input: 'I like google.com the most',
		output: 'I like <span href="http://google.com" class="linkified" target="_blank" >google.com</span> the most',
		options: {
			tagName: 'span'
		}
	}, {
		input: 'I like Google.com the most',
		output: 'I like Google.com the most',
		options: null
	}, {
		input: 'there are two tests, brennan.com and nick.ca -- do they work?',
		output: 'there are two tests, <a href="http://brennan.com" class="linkified alink" target="_parent" >brennan.com</a> and <a href="http://nick.ca" class="linkified alink" target="_parent" >nick.ca</a> -- do they work?',
		options: {
			linkClass: 'alink',
			target: '_parent'
		}
	}, {
		input: 'there are two tests!brennan.com. and nick.ca? -- do they work?',
		output: 'there are two tests!<a href="http://brennan.com" class="linkified alink blink" target="_blank" data-link-test="awesome" >brennan.com</a>. and <a href="http://nick.ca" class="linkified alink blink" target="_blank" data-link-test="awesome" >nick.ca</a>? -- do they work?',
		options: {
			linkClasses: ['alink', 'blink'],
			linkAttributes: {
				'data-link-test': 'awesome'
			}
		}
	}];

	for (var i = 0; i < linkifyTests.length; i++) {
		equal(
			(new Linkified(
				linkifyTests[i].input,
				linkifyTests[i].options
			)).toString(),
			linkifyTests[i].output
		);
	}

});