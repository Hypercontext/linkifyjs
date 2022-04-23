import * as linkify from 'linkifyjs';
import { tokens, ip } from 'linkify-plugin-ip/src/ip';
import { expect } from 'chai';

describe('linkify-plugin-ip', () => {
	before(() => { linkify.reset(); });
	after(() => { linkify.reset(); });

	it('cannot parse IP addresse before applying the plugin', () => {
		expect(
			linkify.find('No place like 127.0.0.1')
		).to.be.eql([]);

		expect(linkify.test('255.255.255.255', 'ipv4')).to.not.be.ok;
	});

	describe('after plugin is applied', () => {
		beforeEach(() => {
			linkify.registerTokenPlugin('ip', tokens);
			linkify.registerPlugin('ip', ip);
		})

		it('can parse ips after applying the plugin', () => {
			expect(linkify.find('No place like 127.0.0.1')).to.be.eql([{
				type: 'ipv4',
				value: '127.0.0.1',
				href: 'http://127.0.0.1',
				isLink: true,
				start: 14,
				end: 23
			}]);

			expect(linkify.test('255.255.255.255', 'ipv4')).to.be.ok;
		});

		const validTests = [
			['0.0.0.0', 'ipv4'],
			['192.168.0.1', 'ipv4'],
			['255.255.255.255', 'ipv4'],
			['232.121.20.3/', 'url'],
			['232.121.20.3:255', 'url'],
			['232.121.20.3:3000', 'url'],
		]

		const invalidTests = [
			'0.0.0.0.0',
			'255.255.256.255',
			'232.121.20/',
			'232.121.3:255',
			'121.20.3.242.232:3000',
		]

		for (const test of validTests) {
			it(`Detects ${test[0]} as ${test[1]}`, () => {
				expect(linkify.test(test[0], test[1])).to.be.ok;
			});
		}

		for (const test of invalidTests) {
			it(`Does not detects ${test} as ip`, () => {
				expect(linkify.test(test)).to.not.be.ok;
			});
		}
	});
});
