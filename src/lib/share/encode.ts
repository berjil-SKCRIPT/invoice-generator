import LZString from 'lz-string';
import { InvoiceSchema, type Invoice } from '../schemas/invoice';

export function encodeInvoice(invoice: Invoice): string {
	return LZString.compressToEncodedURIComponent(JSON.stringify(invoice));
}

export type DecodeResult =
	| { success: true; data: Invoice }
	| { success: false; reason: string };

export function decodeInvoice(encoded: string): DecodeResult {
	try {
		const json = LZString.decompressFromEncodedURIComponent(encoded);
		if (!json) return { success: false, reason: 'empty' };
		const parsed = JSON.parse(json);
		const result = InvoiceSchema.safeParse(parsed);
		if (!result.success) return { success: false, reason: 'invalid-schema' };
		return { success: true, data: result.data };
	} catch {
		return { success: false, reason: 'parse-error' };
	}
}

export function encodedSize(encoded: string): number {
	return new Blob([encoded]).size;
}
