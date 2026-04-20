<script lang="ts">
	import EditableField from '../editor/EditableField.svelte';
	import { invoiceTotals } from '$lib/calc/totals';
	import { formatMoney } from '$lib/utils/currency-format';
	import { formatHuman } from '$lib/utils/date';
	import type { TemplateProps } from './types';

	let { invoice, editable, onpatch, onitempatch, onadditem, onfocus }: TemplateProps = $props();
	const totals = $derived(invoiceTotals(invoice));
	const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
</script>

<article class="font-sans text-foreground leading-relaxed tracking-[-0.005em]">
	<header class="mb-14">
		<h1 class="text-5xl font-light tracking-[-0.04em] serif">Invoice</h1>
		<div class="text-[12px] font-mono text-secondary-foreground mt-3">
			#{invoice.number} · Issued {formatHuman(invoice.dateIssued)} · Due {formatHuman(invoice.dateDue)}
		</div>
	</header>

	<div class="grid grid-cols-2 gap-10 mb-12">
		<div>
			<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-2">From</div>
			{#if editable}
				<EditableField value={invoice.from.name} placeholder="Your name" class="font-semibold block text-lg tracking-[-0.01em]" onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })} onfocus={() => onfocus?.('from')} />
				<EditableField value={invoice.from.address} multiline placeholder="Address" class="text-[13px] text-secondary-foreground whitespace-pre-line block mt-1" onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })} />
			{:else}<p class="font-semibold text-lg tracking-[-0.01em]">{invoice.from.name}</p><p class="text-[13px] text-secondary-foreground whitespace-pre-line mt-1">{invoice.from.address}</p>{/if}
		</div>
		<div>
			<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-2">Billed to</div>
			{#if editable}
				<EditableField value={invoice.to.name} placeholder="Client" class="font-semibold block text-lg tracking-[-0.01em]" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} onfocus={() => onfocus?.('to')} />
				<EditableField value={invoice.to.address} multiline placeholder="Address" class="text-[13px] text-secondary-foreground whitespace-pre-line block mt-1" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} />
			{:else}<p class="font-semibold text-lg tracking-[-0.01em]">{invoice.to.name}</p><p class="text-[13px] text-secondary-foreground whitespace-pre-line mt-1">{invoice.to.address}</p>{/if}
		</div>
	</div>

	<table class="w-full border-collapse mb-4 text-[13px]">
		<thead>
			<tr class="border-b border-foreground text-[10px] uppercase tracking-[0.18em] text-secondary-foreground">
				<th class="text-left py-3 font-normal">Description</th>
				<th class="text-right py-3 font-normal w-16">Qty</th>
				<th class="text-right py-3 font-normal w-24">Rate</th>
				<th class="text-right py-3 font-normal w-28">Amount</th>
			</tr>
		</thead>
		<tbody>
			{#each invoice.items as item (item.id)}
				<tr class="border-b border-border/60">
					<td class="py-3">{#if editable}<EditableField value={item.description} placeholder="Item" onchange={(v) => onitempatch?.(item.id, { description: v })} />{:else}{item.description}{/if}</td>
					<td class="py-3 text-right">{#if editable}<EditableField value={String(item.quantity)} align="right" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />{:else}{item.quantity}{/if}</td>
					<td class="py-3 text-right">{#if editable}<EditableField value={String(item.rate)} align="right" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />{:else}{fmt(item.rate)}{/if}</td>
					<td class="py-3 text-right tabular-nums font-medium">{fmt(item.quantity * item.rate)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if editable}<button class="text-[12px] text-primary hover:underline" onclick={() => onadditem?.()}>+ Add line item</button>{/if}

	<div class="ml-auto w-72 mt-14 text-[13px] space-y-1">
		<div class="flex justify-between"><span class="text-secondary-foreground">Subtotal</span><span class="tabular-nums">{fmt(totals.subtotal)}</span></div>
		{#if totals.tax > 0}<div class="flex justify-between"><span class="text-secondary-foreground">Tax</span><span class="tabular-nums">{fmt(totals.tax)}</span></div>{/if}
		<div class="flex justify-between border-t border-foreground pt-3 mt-3 text-lg font-light tracking-[-0.01em]"><span>Total</span><span class="tabular-nums font-medium">{fmt(totals.grandTotal)}</span></div>
	</div>

	{#if invoice.notes}<p class="mt-14 text-[13px] italic text-secondary-foreground whitespace-pre-line">{invoice.notes}</p>{/if}
</article>
