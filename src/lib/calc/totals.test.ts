import { describe, it, expect } from 'vitest';
import { invoiceTotals } from './totals';
import type { Invoice } from '../schemas/invoice';

const baseInvoice = (over: Partial<Invoice> = {}): Invoice => ({
	id: 'i',
	number: 'N',
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
	items: [
		{ id: '1', description: 'x', quantity: 2, rate: 100, taxRate: 0 },
		{ id: '2', description: 'y', quantity: 1, rate: 50, taxRate: 0 }
	],
	discount: null,
	shipping: null,
	shippingTaxable: false,
	taxMode: 'none',
	taxes: [],
	roundTotal: false,
	payment: {},
	meta: { status: 'draft' },
	...over
});

describe('invoiceTotals', () => {
	it('no tax, no discount, no shipping', () => {
		const r = invoiceTotals(baseInvoice());
		expect(r.subtotal).toBe(250);
		expect(r.tax).toBe(0);
		expect(r.grandTotal).toBe(250);
	});

	it('percent discount applies before tax', () => {
		const r = invoiceTotals(
			baseInvoice({
				discount: { type: 'percent', value: 10 },
				taxMode: 'simple',
				taxes: [{ name: 'Tax', rate: 10, compound: false }]
			})
		);
		expect(r.discountAmount).toBe(25);
		expect(r.taxableAfterDiscount).toBe(225);
		expect(r.tax).toBe(22.5);
		expect(r.grandTotal).toBe(247.5);
	});

	it('GST mode intra-state splits CGST + SGST', () => {
		const r = invoiceTotals(
			baseInvoice({
				taxMode: 'gst',
				taxes: [{ name: 'GST', rate: 18, compound: false }],
				from: { name: 'F', address: 'A', gstStateCode: '29' },
				to: { name: 'T', address: 'A', gstStateCode: '29' }
			})
		);
		expect(r.gst?.cgst).toBe(22.5);
		expect(r.gst?.sgst).toBe(22.5);
		expect(r.gst?.igst).toBe(0);
		expect(r.tax).toBe(45);
	});

	it('GST mode inter-state → IGST', () => {
		const r = invoiceTotals(
			baseInvoice({
				taxMode: 'gst',
				taxes: [{ name: 'GST', rate: 18, compound: false }],
				from: { name: 'F', address: 'A', gstStateCode: '29' },
				to: { name: 'T', address: 'A', gstStateCode: '07' }
			})
		);
		expect(r.gst?.igst).toBe(45);
	});
});
