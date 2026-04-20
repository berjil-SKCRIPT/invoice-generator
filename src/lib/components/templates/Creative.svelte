<script lang="ts">
	import EditableField from '../editor/EditableField.svelte';
	import { invoiceTotals } from '$lib/calc/totals';
	import { formatMoney } from '$lib/utils/currency-format';
	import { formatHuman } from '$lib/utils/date';
	import type { TemplateProps } from './types';

	let { invoice, editable, onpatch, onitempatch, onadditem }: TemplateProps = $props();
	const totals = $derived(invoiceTotals(invoice));
	const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
</script>

<article class="font-sans text-foreground tracking-[-0.005em]" style="--brand: {invoice.brand.color};">
	<div class="rounded-3xl overflow-hidden ring-1 ring-border">
		<div class="p-7 flex items-end justify-between text-white" style="background: var(--brand);">
			<div>
				<div class="text-[10px] uppercase tracking-[0.3em] opacity-80">Invoice</div>
				<div class="text-4xl font-bold mt-1 tracking-[-0.03em]">#{invoice.number}</div>
			</div>
			<div class="text-right text-[12px] opacity-90">
				<div>Issued {formatHuman(invoice.dateIssued)}</div>
				<div>Due {formatHuman(invoice.dateDue)}</div>
			</div>
		</div>

		<div class="p-7 grid grid-cols-2 gap-8 bg-background">
			<div>
				<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-2">From</div>
				{#if editable}
					<EditableField value={invoice.from.name} placeholder="Your name" class="font-semibold text-lg block tracking-[-0.01em]" onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })} />
					<EditableField value={invoice.from.address} multiline placeholder="Address" class="text-[13px] text-secondary-foreground whitespace-pre-line block" onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })} />
				{:else}<p class="font-semibold text-lg tracking-[-0.01em]">{invoice.from.name}</p><p class="text-[13px] text-secondary-foreground whitespace-pre-line">{invoice.from.address}</p>{/if}
			</div>
			<div>
				<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-2">Billed to</div>
				{#if editable}
					<EditableField value={invoice.to.name} placeholder="Client" class="font-semibold text-lg block tracking-[-0.01em]" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} />
					<EditableField value={invoice.to.address} multiline placeholder="Address" class="text-[13px] text-secondary-foreground whitespace-pre-line block" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} />
				{:else}<p class="font-semibold text-lg tracking-[-0.01em]">{invoice.to.name}</p><p class="text-[13px] text-secondary-foreground whitespace-pre-line">{invoice.to.address}</p>{/if}
			</div>
		</div>
	</div>

	<div class="mt-6 space-y-1.5">
		{#each invoice.items as item (item.id)}
			<div class="grid grid-cols-[1fr_60px_100px_100px] gap-3 px-4 py-3 rounded-2xl border border-border items-center text-[13px]">
				{#if editable}<EditableField value={item.description} placeholder="Item" onchange={(v) => onitempatch?.(item.id, { description: v })} />{:else}<span>{item.description}</span>{/if}
				<div class="text-right text-secondary-foreground">{#if editable}<EditableField value={String(item.quantity)} align="right" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />{:else}{item.quantity}{/if}</div>
				<div class="text-right text-secondary-foreground">{#if editable}<EditableField value={String(item.rate)} align="right" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />{:else}{fmt(item.rate)}{/if}</div>
				<div class="text-right tabular-nums font-semibold">{fmt(item.quantity * item.rate)}</div>
			</div>
		{/each}
	</div>
	{#if editable}<button class="mt-4 text-[12px] hover:underline" style="color: var(--brand);" onclick={() => onadditem?.()}>+ Add line item</button>{/if}

	<div class="mt-8 flex justify-end">
		<div class="w-80 rounded-2xl p-5 text-white" style="background: var(--brand);">
			<div class="flex justify-between text-[13px] opacity-80"><span>Subtotal</span><span class="tabular-nums">{fmt(totals.subtotal)}</span></div>
			{#if totals.tax > 0}<div class="flex justify-between text-[13px] opacity-80 mt-1"><span>Tax</span><span class="tabular-nums">{fmt(totals.tax)}</span></div>{/if}
			<div class="flex justify-between mt-4 pt-4 border-t border-white/30 text-2xl font-bold tracking-[-0.02em]"><span>Total</span><span class="tabular-nums">{fmt(totals.grandTotal)}</span></div>
		</div>
	</div>

	{#if invoice.notes}<p class="mt-8 italic text-[13px] text-secondary-foreground whitespace-pre-line">{invoice.notes}</p>{/if}
</article>
