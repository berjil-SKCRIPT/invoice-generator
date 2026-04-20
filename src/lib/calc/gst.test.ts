import { describe, it, expect } from 'vitest';
import { splitGst } from './gst';

describe('splitGst', () => {
	it('intra-state → CGST + SGST half each', () => {
		const r = splitGst(1000, 18, '29', '29');
		expect(r).toEqual({ cgst: 90, sgst: 90, igst: 0, total: 180 });
	});
	it('inter-state → IGST full', () => {
		const r = splitGst(1000, 18, '29', '07');
		expect(r).toEqual({ cgst: 0, sgst: 0, igst: 180, total: 180 });
	});
	it('missing toState defaults to IGST', () => {
		const r = splitGst(1000, 18, '29', undefined);
		expect(r.igst).toBe(180);
	});
});
