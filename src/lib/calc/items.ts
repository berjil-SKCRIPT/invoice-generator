import type { LineItem } from '../schemas/invoice';

export type ItemAmounts = {
	subtotal: number;
	discount: number;
	taxable: number;
	tax: number;
	total: number;
};

export function itemAmounts(item: LineItem, fallbackTaxRate = 0): ItemAmounts {
	const subtotal = item.quantity * item.rate;
	const discount = subtotal * ((item.discountPct ?? 0) / 100);
	const taxable = subtotal - discount;
	const effectiveTax = item.taxRate > 0 ? item.taxRate : fallbackTaxRate;
	const tax = taxable * (effectiveTax / 100);
	const total = taxable + tax;
	return { subtotal, discount, taxable, tax, total };
}
