import * as linkify from 'linkifyjs';
import { keyword, registerKeywords } from 'linkify-plugin-keyword/src/keyword';
import { expect } from 'chai';

describe('linkify-plugin-keyword', () => {
	before(() => { linkify.reset(); });
	after(() => { linkify.reset(); });

	it('cannot parse keywords before applying the plugin', () => {
		expect(linkify.find('Hello, World!')).to.be.eql([]);
	});

	describe('after plugin is applied', () => {
		const keywords = [
			'42',
			'world',
			'500px',
			'テスト',
			'öko123',
			'http',
			'view-source',
			'view--source',
			'-view-source-',
			'🍕💩',
			'Hello, World!',
			'world',
			'~ ^_^ ~'
		];
		beforeEach(() => {
			registerKeywords([]);  // just to test the branch
			registerKeywords(keywords);
			linkify.registerPlugin('keyword', keyword);
		});

		it('finds numeric keywords', () => {
			expect(linkify.find('The magic number is 42!')).to.be.eql([{
				type: 'keyword',
				value: '42',
				href: '42',
				isLink: true,
				start: 20,
				end: 22
			}]);
		});

		for (const keyword of keywords) {
			it(`Detects keyword ${keyword}`, () => {
				expect(linkify.test(keyword, 'keyword')).to.be.ok;
			});
		}
	});
});
