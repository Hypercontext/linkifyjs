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
		Num = Start.tr(/[0-9]/, [tk.NUM, ['numeric']], collections);
		Num.tr(/[0-9]/, Num);
		Word = Start.tr(/[a-z]/i, [tk.WORD, ['ascii']], collections);
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
			Start.ts('http', ['http', ['ascii', 'scheme']], collections);
			Start.ts('https', ['https', ['ascii', 'scheme']], collections);
			Start.ts('view-source', ['view-source', ['domain', 'scheme']], collections);
		});

		it('Adds tokens to ascii collection', () => {
			expect(collections.ascii.indexOf('htt')).lessThan(0);
			expect(collections.ascii.indexOf('http')).greaterThanOrEqual(0);
			expect(collections.ascii.indexOf('https')).greaterThanOrEqual(0);
			expect(collections.ascii.indexOf('view-source')).lessThan(0);
		});
		it('Adds tokens to domain collection', () => {
			expect(collections.domain.indexOf('htt')).lessThan(0);
			expect(collections.domain.indexOf('http')).greaterThanOrEqual(0);
			expect(collections.domain.indexOf('https')).greaterThanOrEqual(0);
			expect(collections.domain.indexOf('view-source')).greaterThanOrEqual(0);
		});

		it('Adds tokens to scheme collection', () => {
			expect(collections.scheme.indexOf('http')).greaterThanOrEqual(0);
			expect(collections.scheme.indexOf('https')).greaterThanOrEqual(0);
			expect(collections.scheme.indexOf('view-source')).greaterThanOrEqual(0);
		});
	});
});
