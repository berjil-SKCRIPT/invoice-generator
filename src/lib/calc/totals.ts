import type { Invoice } from '../schemas/invoice';
import { itemAmounts } from './items';
import { splitGst, type GstSplit } from './gst';

export type InvoiceTotals = {
	subtotal: number;
	discountAmount: number;
	taxableAfterDiscount: number;
	tax: number;
	shipping: number;
	shippingTax: number;
	grandTotal: number;
	gst?: GstSplit;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function invoiceTotals(inv: Invoice): InvoiceTotals {
	const fallbackTaxRate =
		inv.taxMode === 'simple' || inv.taxMode === 'vat' ? (inv.taxes[0]?.rate ?? 0) : 0;

	const itemSubs = inv.items.map((i) => itemAmounts(i, fallbackTaxRate));
	const subtotal = itemSubs.reduce((s, x) => s + x.taxable, 0);

	const discountAmount = inv.discount
		? inv.discount.type === 'percent'
			? subtotal * (inv.discount.value / 100)
			: inv.discount.value
		: 0;

	const taxableAfterDiscount = Math.max(0, subtotal - discountAmount);

	let tax = 0;
	let gst: GstSplit | undefined;
	switch (inv.taxMode) {
		case 'none':
			tax = 0;
			break;
		case 'simple':
		case 'vat': {
			const rate = inv.taxes[0]?.rate ?? 0;
			tax = taxableAfterDiscount * (rate / 100);
			break;
		}
		case 'gst': {
			const rate = inv.taxes[0]?.rate ?? 18;
			gst = splitGst(taxableAfterDiscount, rate, inv.from.gstStateCode, inv.to.gstStateCode);
			tax = gst.total;
			break;
		}
		case 'custom': {
			let base = taxableAfterDiscount;
			let total = 0;
			for (const t of inv.taxes) {
				const slice = base * (t.rate / 100);
				total += slice;
				if (t.compound) base += slice;
			}
			tax = total;
			break;
		}
	}

	const shipping = inv.shipping ?? 0;
	const effectiveRate = inv.taxes[0]?.rate ?? 0;
	const shippingTax =
		inv.shippingTaxable && effectiveRate ? shipping * (effectiveRate / 100) : 0;

	let grandTotal = round2(taxableAfterDiscount + tax + shipping + shippingTax);
	if (inv.roundTotal) grandTotal = Math.round(grandTotal);

	return {
		subtotal: round2(subtotal),
		discountAmount: round2(discountAmount),
		taxableAfterDiscount: round2(taxableAfterDiscount),
		tax: round2(tax),
		shipping: round2(shipping),
		shippingTax: round2(shippingTax),
		grandTotal,
		gst
	};
}
