// import { makeAcceptingState } from 'linkifyjs/src/fsm';

import * as tk from 'linkifyjs/src/text';
import * as fsm from 'linkifyjs/src/fsm';
// import { takeT, makeT, makeRegexT } from 'linkifyjs/src/fsm';
import { expect } from 'chai';

describe('linkifyjs/fsm/State', () => {
	let collections, Start, Num, Word;

	beforeEach(() => {
		collections = {};
		Start = new fsm.State();
		Start.tt('.', tk.DOT);
		Num = Start.tr(/[0-9]/, tk.NUM, collections, { numeric: true });
		Num.tr(/[0-9]/, Num);
		Word = Start.tr(/[a-z]/i, tk.WORD, collections, { ascii: true });
		Word.tr(/[a-z]/i, Word);
	});

	it('Creates DOT transition on Start state', () => {
		expect(Object.keys(Start.j)).to.eql(['.']);
		expect(Start.j['.'].t).to.eql(tk.DOT);
	});

	it('Creates regexp number transitions on Start state', () => {
		expect(Start.jr.length).to.eql(2);
		expect(Start.jr[0][0].test('42')).to.be.ok;
		expect(Start.jr[0][1].t).to.eql(tk.NUM);
	});

	it('Creates regexp word transitions on start state', () => {
		expect(Start.jr.length).to.eql(2);
		expect(Start.jr[1][0].test('hello')).to.be.ok;
		expect(Start.jr[1][1].t).to.eql(tk.WORD);
	});

	it('Populates collections', () => {
		expect(collections).to.eql({
			numeric: [tk.NUM],
			ascii: [tk.WORD],
			asciinumeric: [tk.NUM, tk.WORD],
			alpha: [tk.WORD],
			alphanumeric: [tk.NUM, tk.WORD],
			domain: [tk.NUM, tk.WORD]
		});
	});

	describe('Add schemes', () => {
		beforeEach(() => {
			Start.ts('http', 'http', collections, { ascii: true, scheme: true });
			Start.ts('https', 'https', collections, { ascii: true, scheme: true });
			Start.ts('view-source', 'view-source', collections, { domain: true, scheme: true });
		});

		it('Adds tokens to ascii collection', () => {
			expect(collections.ascii).not.contains('htt');
			expect(collections.ascii).contains('http');
			expect(collections.ascii).contains('https');
			expect(collections.ascii).not.contains('view-source');
		});
		it('Adds tokens to domain collection', () => {
			expect(collections.domain).not.contains('htt');
			expect(collections.domain).contains('http');
			expect(collections.domain).contains('https');
			expect(collections.domain).contains('view-source');
		});

		it('Adds tokens to scheme collection', () => {
			expect(collections.scheme).contains('http');
			expect(collections.scheme).contains('https');
			expect(collections.scheme).contains('view-source');
		});
	});
});
