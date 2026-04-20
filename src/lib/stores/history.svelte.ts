import { Storage } from '../storage/local';
import { InvoiceSchema, type Invoice } from '../schemas/invoice';
import { newId } from '../utils/id';
import { z } from 'zod';

const KEY = 'featureos_inv_v1_history';
const HistorySchema = z.array(InvoiceSchema);
const store = new Storage(KEY, HistorySchema, [] as Invoice[]);

export function createHistoryStore() {
	let items = $state<Invoice[]>(store.read());

	function persist() {
		store.write([...items]);
	}

	return {
		get value() {
			return items;
		},
		upsert(inv: Invoice) {
			const idx = items.findIndex((i) => i.id === inv.id);
			if (idx >= 0) items[idx] = inv;
			else items = [inv, ...items];
			persist();
		},
		remove(id: string) {
			items = items.filter((i) => i.id !== id);
			persist();
		},
		find(id: string) {
			return items.find((i) => i.id === id);
		},
		duplicate(id: string, newNumber: string): Invoice | null {
			const src = items.find((i) => i.id === id);
			if (!src) return null;
			const dup: Invoice = {
				...src,
				id: newId(),
				number: newNumber,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				meta: { status: 'draft' }
			};
			items = [dup, ...items];
			persist();
			return dup;
		}
	};
}
