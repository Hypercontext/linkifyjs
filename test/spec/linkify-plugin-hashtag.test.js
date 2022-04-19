import * as linkify from 'linkifyjs';
import hashtag from 'linkify-plugin-hashtag/src/hashtag';

describe('linkify-plugin-hashtag', () => {
	before(() => { linkify.reset(); });
	after(() => { linkify.reset(); });

	it('cannot parse hashtags before applying the plugin', () => {
		expect(linkify.find('There is a #hashtag #YOLO-2015 and #1234 and #%^&*( should not work'))
		.to.be.eql([]);

		expect(linkify.test('#wat', 'hashtag')).to.not.be.ok;
		expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
	});

	describe('after plugin is applied', () => {
		beforeEach(() => {
			linkify.registerPlugin('hashtag', hashtag);
		});

		it('can parse hashtags after applying the plugin', () => {
			expect(linkify.find('There is a #hashtag #YOLO_2015 #__swag__ and #1234 and #%^&*( #_ #__ should not work'))
			.to.be.eql([{
				type: 'hashtag',
				value: '#hashtag',
				href: '#hashtag',
				isLink: true,
				start: 11,
				end: 19
			}, {
				type: 'hashtag',
				value: '#YOLO_2015',
				href: '#YOLO_2015',
				isLink: true,
				start: 20,
				end: 30
			}, {
				type: 'hashtag',
				value: '#__swag__',
				href: '#__swag__',
				isLink: true,
				start: 31,
				end: 40
			}]);
		});

		it('Works with basic hashtags', () => {
			expect(linkify.test('#wat', 'hashtag')).to.be.ok;
		});

		it('Works with trailing underscores', () => {
			expect(linkify.test('#bug_', 'hashtag')).to.be.ok;
		});

		it('Works with underscores', () => {
			expect(linkify.test('#bug_test', 'hashtag')).to.be.ok;
		});

		it('Works with double underscores', () => {
			expect(linkify.test('#bug__test', 'hashtag')).to.be.ok;
		});

		it('Works with number prefix', () => {
			expect(linkify.test('#123abc', 'hashtag')).to.be.ok;
		});

		it('Works with number/underscore prefix', () => {
			expect(linkify.test('#123_abc', 'hashtag')).to.be.ok;
		});

		it('Works with Hangul characters', () => {
			expect(linkify.test('#일상', 'hashtag')).to.be.ok;
		});

		it('Works with Cyrillic characters', () => {
			expect(linkify.test('#АБВ_бв', 'hashtag')).to.be.ok;
		});

		it('Works with Arabic characters', () => {
			expect(linkify.test('#سلام', 'hashtag')).to.be.ok;
		});

		it('Does not work with just numbers', () => {
			expect(linkify.test('#987', 'hashtag')).to.not.be.ok;
		});

		it('Does not work with just numbers and underscore', () => {
			expect(linkify.test('#987_654', 'hashtag')).to.not.be.ok;
		});
	});
});
