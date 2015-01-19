var usageInitial = process.memoryUsage();
var linkify = require('../lib/linkify');
var usageLinkify = process.memoryUsage();

var sum = 0, ITERATIONS = 2000;

function benchmark() {
	var start = new Date(), end, diff;

	// linkify.tokenize('The URL is http://google.com The URL is http://google.com');
	// linkify.tokenize('google.com');
	// linkify.tokenize('I like google.com the most I like google.com the most');
	// linkify.tokenize('I like Google.com the most');
	// linkify.tokenize('there are two tests, brennan.com and nick.ca -- do they work?');
	// linkify.tokenize('there are two tests!brennan.com. and nick.ca? -- do they work?');
	// linkify.tokenize('This [i.imgur.com/ckSj2Ba.jpg)] should also work');
	// linkify.tokenize('A link is http://nick.is.awesome/?q=nick+amazing&nick=yo%29%30hellp another is http://nick.con/?q=look');
	// linkify.tokenize('SOme URLS http://google.com https://google1.com google2.com google.com/search?q=potatoes+oven goo.gl/0192n1 google.com?q=asda test bit.ly/0912j www.bob.com indigo.dev.soapbox.co/mobile google.com?q=.exe flickr.com/linktoimage.jpg');
	// linkify.tokenize('None.of these.should be.Links okay.please?');
	// linkify.tokenize('Here are some random emails: nick@soapbox.com, nick@soapbox.soda (invalid), Nick@dev.dev.soapbox.co, random nick.frasser_hitsend@http://facebook.com');
	// linkify.tokenize('t.c.com/sadqad is a great domain, so is ftp://i.am.a.b.ca/ okay?');
	// linkify.tokenize('This port is too short someport.com: this port is too long http://googgle.com:789023/myQuery this port is just right https://github.com:8080/SoapBox/jQuery-linkify/');
	//
	linkify.tokenize('About a year ago Graham and I went to Google IO (https://developers.google.com/events/io/) to learn about some upcoming technology and meet some tech folk in the valley. The experience was great. We met a bunch of great people and got our hands on some new technology — check out this page for more on our experience http://digitalmediazone.ryerson.ca/toronto-incubator/brennans-experience-at-google-io/experience. Beyond everything else, the best thing we got out of that conference was a technology/development mentor & a new startup development process. As soapboxhq.com grew, we tweaked our development and deployment process as needed. At the very start we used cheap hosting providers such as ca.godaddy.com and learned to deal with their limitations. We knew there were other ways of doing things, but they seemed to add complex rules and process. This worked for us, so why fix it? We then met Ian (http://iandouglas.com/about/) at Google IO, who agreed to share some of his insight from scaling over and over again. Ian is a senior web developer/architect working over at Sendgrid. Ian is awesome and we really take his advice to heart. He deserves the credit for a lot of what you see below (including the joke I shamelessly stole from him). To see the rest of this post, visit http://soapboxhq.com/blog/startup-development-process-how-we-develop/ or email soapbox-dev-team@example.com.');

	end = new Date();
	diff = end.valueOf() - start.valueOf();
	sum += diff;
}


console.log('Doing ' + ITERATIONS + ' iterations...');
console.log('Start:', (new Date()).valueOf());

var usageBeforeIterations = process.memoryUsage();
for (var i = 0; i < ITERATIONS; i++) {
	benchmark();
}
var usageAfterIterations = process.memoryUsage();

console.log('End:', (new Date()).valueOf());
console.log('Total time (ms):', sum);
console.log('Average (ms):', sum/i);
console.log('Memory usage:');
console.log('    Before require:', usageInitial);
console.log('    After require:', usageLinkify);
console.log('    Before benchmark:', usageBeforeIterations);
console.log('    After benchmark:', usageAfterIterations);

