/* global test:true */
/* global equal:true */


test("linkify string basics", function () {

	var linkifyTests = [{
		name: 'Basic test',
		input: 'google.com',
		output: '<a href="http://google.com" class="linkified" target="_blank" >google.com</a>',
		options: null
	}, {
		name: 'basic test with a different tag name',
		input: 'I like google.com the most',
		output: 'I like <span href="http://google.com" class="linkified" target="_blank" >google.com</span> the most',
		options: {
			tagName: 'span'
		}
	}, {
		name: 'Capitalized domains should not be linkified',
		input: 'I like Google.com the most',
		output: 'I like Google.com the most',
		options: null
	}, {
		name: 'Detect tow different links',
		input: 'there are two tests, brennan.com and nick.ca -- do they work?',
		output: 'there are two tests, <a href="http://brennan.com" class="linkified alink" target="_parent" >brennan.com</a> and <a href="http://nick.ca" class="linkified alink" target="_parent" >nick.ca</a> -- do they work?',
		options: {
			linkClass: 'alink',
			target: '_parent'
		}
	}, {
		name: 'Detect some links with strange punctuation around them',
		input: 'there are two tests!brennan.com. and nick.ca? -- do they work?',
		output: 'there are two tests!<a href="http://brennan.com" class="linkified alink blink" target="_blank" data-link-test="awesome\'s" >brennan.com</a>. and <a href="http://nick.ca" class="linkified alink blink" target="_blank" data-link-test="awesome\'s" >nick.ca</a>? -- do they work?',
		options: {
			linkClasses: ['alink', 'blink'],
			linkAttributes: {
				'data-link-test': 'awesome\'s'
			}
		}
	}, {
		name: 'Links surrounded by irregular brackets',
		input: 'This [i.imgur.com/ckSj2Ba.jpg)] should also work',
		output: 'This [<a href="http://i.imgur.com/ckSj2Ba.jpg" class="linkified" target="_blank" rel="nofollow" >i.imgur.com/ckSj2Ba.jpg</a>)] should also work',
		options: {
			linkAttributes: {
				rel: 'nofollow'
			}
		}
	}, {
		name: 'Invalid top-level domains',
		input: 'A link is http://nick.is.awesome/?q=nick+amazing&nick=yo%29%30hellp another is http://nick.con/?q=look',
		output: 'A link is <a href="http://nick.is" class="linkified" target="_blank" >http://nick.is</a>.awesome/?q=nick+amazing&nick=yo%29%30hellp another is http://nick.con/?q=look',
		options: null
	}, {
		name: 'A lot of links, some consecutives',
		input: 'SOme URLS http://google.com https://google1.com google2.com google.com/search?q=potatoes+oven goo.gl/0192n1 google.com?q=asda test bit.ly/0912j www.bob.com indigo.dev.soapbox.co/mobile google.com?q=.exe flickr.com/linktoimage.jpg',
		output: 'SOme URLS <a href="http://google.com" class="linkified" target="_blank" >http://google.com</a> <a href="http://google1.com" class="linkified" target="_blank" >https://google1.com</a> <a href="http://google2.com" class="linkified" target="_blank" >google2.com</a> <a href="http://google.com/search?q=potatoes+oven" class="linkified" target="_blank" >google.com/search?q=potatoes+oven</a> <a href="http://goo.gl/0192n1" class="linkified" target="_blank" >goo.gl/0192n1</a> <a href="http://google.com?q=asda" class="linkified" target="_blank" >google.com?q=asda</a> test <a href="http://bit.ly/0912j" class="linkified" target="_blank" >bit.ly/0912j</a> <a href="http://www.bob.com" class="linkified" target="_blank" >www.bob.com</a> <a href="http://indigo.dev.soapbox.co/mobile" class="linkified" target="_blank" >indigo.dev.soapbox.co/mobile</a> <a href="http://google.com?q=.exe" class="linkified" target="_blank" >google.com?q=.exe</a> <a href="http://flickr.com/linktoimage.jpg" class="linkified" target="_blank" >flickr.com/linktoimage.jpg</a>',
		options: null
	}, {
		name: 'Word separated by dots should not be links',
		input: 'None.of these.should be.Links okay.please?',
		output: 'None.of these.should be.Links okay.please?',
		options: null
	}, {
		name: 'Email matching',
		input: 'Here are some random emails: nick@soapbox.com, nick@soapbox.soda (invalid), Nick@dev.dev.soapbox.co, random nick.frasser_hitsend@http://facebook.com',
		output: 'Here are some random emails: <a href="mailto:nick@soapbox.com" class="linkified" target="_blank" >nick@soapbox.com</a>, nick@soapbox.soda (invalid), <a href="mailto:Nick@dev.dev.soapbox.co" class="linkified" target="_blank" >Nick@dev.dev.soapbox.co</a>, random <a href="mailto:nick.frasser_hitsend@facebook.com" class="linkified" target="_blank" >nick.frasser_hitsend@http://facebook.com</a>',
		options: null
	}, {
		name: 'Single character domains',
		input: 't.c.com/sadqad is a great domain, so is ftp://i.am.a.b.ca/ okay?',
		output: '<a href="http://t.c.com/sadqad" class="linkified" target="_blank" >t.c.com/sadqad</a> is a great domain, so is <a href="http://i.am.a.b.ca/" class="linkified" target="_blank" >ftp://i.am.a.b.ca/</a> okay?',
		options: null
	}];

	for (var i = 0; i < linkifyTests.length; i++) {
		equal(
			(new Linkified(
				linkifyTests[i].input,
				linkifyTests[i].options
			)).toString(),
			linkifyTests[i].output,
			linkifyTests[i].name
		);
	}

});