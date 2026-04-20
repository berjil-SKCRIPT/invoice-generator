import { describe, it, expect } from 'vitest';
import { encodeInvoice, decodeInvoice } from './encode';
import type { Invoice } from '../schemas/invoice';

const sample: Invoice = {
	id: 'a',
	number: 'INV-1',
	createdAt: '',
	updatedAt: '',
	region: 'INTL',
	template: 'modern',
	brand: { color: '#000', font: 'inter' },
	currency: 'USD',
	locale: 'en-US',
	dateIssued: '2026-04-20',
	dateDue: '2026-05-20',
	paymentTerms: 'net30',
	from: { name: 'F', address: 'A' },
	to: { name: 'T', address: 'A' },
	items: [],
	discount: null,
	shipping: null,
	shippingTaxable: false,
	taxMode: 'none',
	taxes: [],
	roundTotal: false,
	payment: {},
	meta: { status: 'draft' }
};

describe('share encode/decode', () => {
	it('round-trips a valid invoice', () => {
		const enc = encodeInvoice(sample);
		const dec = decodeInvoice(enc);
		expect(dec.success).toBe(true);
		if (dec.success) expect(dec.data.number).toBe('INV-1');
	});
	it('returns error on garbage input', () => {
		const dec = decodeInvoice('garbage');
		expect(dec.success).toBe(false);
	});
});
