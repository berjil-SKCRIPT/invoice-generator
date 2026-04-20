import type { Invoice, LineItem } from '$lib/schemas/invoice';
import type { FocusContext } from '$lib/stores/focus.svelte';

export type TemplateProps = {
	invoice: Invoice;
	editable: boolean;
	onpatch?: (patch: Partial<Invoice>) => void;
	onitempatch?: (id: string, patch: Partial<LineItem>) => void;
	onadditem?: () => void;
	onremoveitem?: (id: string) => void;
	onreorder?: (from: number, to: number) => void;
	onappendrows?: (rows: Array<Pick<LineItem, 'description' | 'quantity' | 'rate'>>) => void;
	onfocus?: (ctx: FocusContext) => void;
};
