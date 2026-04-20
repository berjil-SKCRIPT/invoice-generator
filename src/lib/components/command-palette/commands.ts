import type { Invoice } from '$lib/schemas/invoice';
import type { Currency } from '$lib/data/currencies';

export type Command = {
	id: string;
	label: string;
	hint?: string;
	group: 'Document' | 'Template' | 'Tax' | 'Currency' | 'Theme' | 'Action';
	run: () => void;
};

export type CommandCtx = {
	setTemplate: (t: Invoice['template']) => void;
	setCurrency: (code: string, locale: string) => void;
	setTaxMode: (m: Invoice['taxMode']) => void;
	cycleTheme: () => void;
	download: () => void;
	share: () => void;
	print: () => void;
	save: () => void;
	newInvoice: () => void;
	duplicate: () => void;
	currencies: Currency[];
};

export function buildCommands(ctx: CommandCtx): Command[] {
	return [
		{ id: 'new', label: 'New invoice', group: 'Document', run: ctx.newInvoice, hint: '⌘N' },
		{ id: 'save', label: 'Save invoice', group: 'Document', run: ctx.save, hint: '⌘S' },
		{ id: 'dup', label: 'Duplicate invoice', group: 'Document', run: ctx.duplicate, hint: '⌘D' },
		{ id: 'download', label: 'Download PDF', group: 'Action', run: ctx.download, hint: '⌘E' },
		{ id: 'share', label: 'Copy share link', group: 'Action', run: ctx.share, hint: '⌘L' },
		{ id: 'print', label: 'Print', group: 'Action', run: ctx.print, hint: '⌘P' },
		{ id: 'theme', label: 'Cycle theme', group: 'Theme', run: ctx.cycleTheme },
		...(['modern', 'minimal', 'classic', 'creative', 'corporate'] as const).map((t) => ({
			id: `tpl:${t}`,
			label: `Switch to ${t} template`,
			group: 'Template' as const,
			run: () => ctx.setTemplate(t)
		})),
		...(['none', 'simple', 'gst', 'vat', 'custom'] as const).map((m) => ({
			id: `tax:${m}`,
			label: `Set tax mode: ${m}`,
			group: 'Tax' as const,
			run: () => ctx.setTaxMode(m)
		})),
		...ctx.currencies.map((c) => ({
			id: `cur:${c.code}`,
			label: `Set currency: ${c.code} · ${c.name}`,
			group: 'Currency' as const,
			run: () => ctx.setCurrency(c.code, c.locale)
		}))
	];
}
