import { newId } from '../utils/id';
import { today, dueFromTerms } from '../utils/date';
import type { Invoice, LineItem } from '../schemas/invoice';
import { InvoiceSchema } from '../schemas/invoice';
import { Storage } from '../storage/local';

const DRAFT_KEY = 'featureos_inv_v1_draft';

export function makeBlankItem(): LineItem {
	return { id: newId(), description: '', quantity: 1, rate: 0, taxRate: 0 };
}

export function makeBlankInvoice(): Invoice {
	const issued = today();
	return {
		id: newId(),
		number: 'INV-DRAFT',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		region: 'INTL',
		template: 'modern',
		brand: { color: '#4f46e5', font: 'inter' },
		currency: 'USD',
		locale: 'en-US',
		dateIssued: issued,
		dateDue: dueFromTerms(issued, 'net30'),
		paymentTerms: 'net30',
		from: { name: '', address: '' },
		to: { name: '', address: '' },
		items: [makeBlankItem()],
		discount: null,
		shipping: null,
		shippingTaxable: false,
		taxMode: 'none',
		taxes: [],
		roundTotal: false,
		payment: {},
		meta: { status: 'draft' }
	};
}

const draftStore = new Storage(DRAFT_KEY, InvoiceSchema, makeBlankInvoice());

export function createInvoiceStore(seed?: Partial<Invoice>) {
	const initial = { ...draftStore.read(), ...seed };
	let invoice = $state<Invoice>(initial);
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	function persistLater() {
		invoice.updatedAt = new Date().toISOString();
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(() => draftStore.write({ ...invoice }), 1500);
	}

	return {
		get value() {
			return invoice;
		},
		set(next: Invoice) {
			invoice = next;
			persistLater();
		},
		patch(p: Partial<Invoice>) {
			invoice = { ...invoice, ...p };
			persistLater();
		},
		addItem() {
			invoice.items = [...invoice.items, makeBlankItem()];
			persistLater();
		},
		removeItem(id: string) {
			invoice.items = invoice.items.filter((i) => i.id !== id);
			persistLater();
		},
		updateItem(id: string, p: Partial<LineItem>) {
			invoice.items = invoice.items.map((i) => (i.id === id ? { ...i, ...p } : i));
			persistLater();
		},
		appendRows(rows: Array<Pick<LineItem, 'description' | 'quantity' | 'rate'>>) {
			invoice.items = [
				...invoice.items,
				...rows.map((r) => ({ id: newId(), taxRate: 0, ...r }))
			];
			persistLater();
		},
		reorderItems(fromIdx: number, toIdx: number) {
			const next = [...invoice.items];
			const [m] = next.splice(fromIdx, 1);
			next.splice(toIdx, 0, m);
			invoice.items = next;
			persistLater();
		},
		duplicateItem(id: string) {
			const idx = invoice.items.findIndex((i) => i.id === id);
			if (idx < 0) return;
			const copy = { ...invoice.items[idx], id: newId() };
			const next = [...invoice.items];
			next.splice(idx + 1, 0, copy);
			invoice.items = next;
			persistLater();
		}
	};
}
