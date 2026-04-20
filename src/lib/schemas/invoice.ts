import { z } from 'zod';

export const PartySchema = z.object({
	name: z.string(),
	email: z.string().email().optional().or(z.literal('')),
	phone: z.string().optional(),
	address: z.string(),
	taxId: z.string().optional(),
	gstStateCode: z.string().length(2).optional()
});

export const LineItemSchema = z.object({
	id: z.string(),
	description: z.string(),
	hsnSac: z.string().optional(),
	quantity: z.number().min(0),
	unit: z.string().optional(),
	rate: z.number().min(0),
	taxRate: z.number().min(0).max(100),
	discountPct: z.number().min(0).max(100).optional()
});

export const TaxRuleSchema = z.object({
	name: z.string(),
	rate: z.number().min(0).max(100),
	compound: z.boolean()
});

export const PaymentMethodsSchema = z.object({
	bank: z
		.object({
			accountName: z.string(),
			accountNumber: z.string(),
			ifsc: z.string().optional(),
			swift: z.string().optional(),
			bankName: z.string()
		})
		.optional(),
	upi: z.string().optional(),
	paypal: z.string().optional(),
	stripeLink: z.string().url().optional().or(z.literal('')),
	razorpayLink: z.string().url().optional().or(z.literal('')),
	customLink: z.object({ label: z.string(), url: z.string().url() }).optional(),
	notes: z.string().optional()
});

export const BrandSchema = z.object({
	logoDataUrl: z.string().optional(),
	color: z.string(),
	font: z.enum(['inter', 'space-grotesk', 'plex-serif'])
});

export const InvoiceSchema = z.object({
	id: z.string(),
	number: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	region: z.enum(['IN', 'INTL']),
	template: z.enum(['modern', 'minimal', 'classic', 'creative', 'corporate']),
	brand: BrandSchema,
	currency: z.string().length(3),
	locale: z.string(),
	dateIssued: z.string(),
	dateDue: z.string(),
	paymentTerms: z.enum(['net0', 'net7', 'net15', 'net30', 'net60', 'custom']),
	from: PartySchema,
	to: PartySchema,
	items: z.array(LineItemSchema),
	discount: z
		.object({ type: z.enum(['percent', 'flat']), value: z.number() })
		.nullable(),
	shipping: z.number().nullable(),
	shippingTaxable: z.boolean(),
	taxMode: z.enum(['none', 'simple', 'gst', 'vat', 'custom']),
	taxes: z.array(TaxRuleSchema),
	roundTotal: z.boolean(),
	notes: z.string().optional(),
	terms: z.string().optional(),
	payment: PaymentMethodsSchema,
	meta: z.object({ status: z.enum(['draft', 'sent', 'paid']) })
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
export type Party = z.infer<typeof PartySchema>;
export type PaymentMethods = z.infer<typeof PaymentMethodsSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type TaxRule = z.infer<typeof TaxRuleSchema>;
