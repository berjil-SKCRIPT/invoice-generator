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

<article class="font-sans text-foreground text-[13px] tracking-[-0.005em]">
	<header class="grid grid-cols-2 gap-8 pb-6 border-b-2 border-foreground mb-6">
		<div>
			{#if invoice.brand.logoDataUrl}<img src={invoice.brand.logoDataUrl} alt="" class="max-h-12 mb-3" />{/if}
			{#if editable}
				<EditableField value={invoice.from.name} placeholder="Company Ltd" class="font-bold text-lg block tracking-[-0.01em]" onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })} />
				<EditableField value={invoice.from.address} multiline placeholder="Registered address" class="text-[11px] text-secondary-foreground whitespace-pre-line block" onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })} />
			{:else}<p class="font-bold text-lg tracking-[-0.01em]">{invoice.from.name}</p><p class="text-[11px] text-secondary-foreground whitespace-pre-line">{invoice.from.address}</p>{/if}
		</div>
		<div class="text-right">
			<div class="text-3xl font-bold tracking-[-0.03em] serif">Tax Invoice</div>
			<div class="text-[12px] font-mono mt-1">#{invoice.number}</div>
			<div class="text-[11px] text-secondary-foreground mt-2">Issued: {formatHuman(invoice.dateIssued)} · Due: {formatHuman(invoice.dateDue)}</div>
		</div>
	</header>

	<div class="grid grid-cols-2 gap-6 mb-6">
		<div>
			<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-1">Bill to</div>
			{#if editable}
				<EditableField value={invoice.to.name} placeholder="Client" class="font-semibold block tracking-[-0.005em]" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} />
				<EditableField value={invoice.to.address} multiline placeholder="Address" class="text-[11px] whitespace-pre-line block text-secondary-foreground" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} />
			{:else}<p class="font-semibold tracking-[-0.005em]">{invoice.to.name}</p><p class="text-[11px] whitespace-pre-line text-secondary-foreground">{invoice.to.address}</p>{/if}
		</div>
		{#if invoice.to.taxId}
			<div>
				<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-1">Tax ID</div>
				<div class="font-mono text-[12px]">{invoice.to.taxId}</div>
			</div>
		{/if}
	</div>

	<table class="w-full border-collapse border border-border mb-6">
		<thead class="bg-foreground text-background">
			<tr class="text-[10px] uppercase tracking-[0.15em]">
				<th class="text-left py-2 px-3 font-normal">#</th>
				<th class="text-left py-2 px-3 font-normal">Description</th>
				<th class="text-right py-2 px-3 font-normal w-16">Qty</th>
				<th class="text-right py-2 px-3 font-normal w-24">Rate</th>
				<th class="text-right py-2 px-3 font-normal w-16">Tax</th>
				<th class="text-right py-2 px-3 font-normal w-28">Amount</th>
			</tr>
		</thead>
		<tbody>
			{#each invoice.items as item, idx (item.id)}
				<tr class="border-b border-border/60">
					<td class="py-2 px-3 text-secondary-foreground">{idx + 1}</td>
					<td class="py-2 px-3">{#if editable}<EditableField value={item.description} placeholder="Item" onchange={(v) => onitempatch?.(item.id, { description: v })} />{:else}{item.description}{/if}</td>
					<td class="py-2 px-3 text-right">{#if editable}<EditableField value={String(item.quantity)} align="right" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />{:else}{item.quantity}{/if}</td>
					<td class="py-2 px-3 text-right">{#if editable}<EditableField value={String(item.rate)} align="right" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />{:else}{fmt(item.rate)}{/if}</td>
					<td class="py-2 px-3 text-right text-secondary-foreground">{item.taxRate}%</td>
					<td class="py-2 px-3 text-right tabular-nums font-medium">{fmt(item.quantity * item.rate)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if editable}<button class="text-[12px] text-primary hover:underline mb-6" onclick={() => onadditem?.()}>+ Add line item</button>{/if}

	<div class="ml-auto w-80">
		<div class="flex justify-between py-1 text-[12px]"><span class="text-secondary-foreground">Subtotal</span><span class="tabular-nums">{fmt(totals.subtotal)}</span></div>
		{#if totals.tax > 0}<div class="flex justify-between py-1 text-[12px]"><span class="text-secondary-foreground">Tax</span><span class="tabular-nums">{fmt(totals.tax)}</span></div>{/if}
		<div class="flex justify-between py-3 mt-2 bg-foreground text-background px-3 font-semibold text-[15px] tracking-[0.1em] uppercase">
			<span>Grand Total</span><span class="tabular-nums">{fmt(totals.grandTotal)}</span>
		</div>
	</div>

	<footer class="mt-16 pt-4 border-t border-border text-[11px] text-secondary-foreground flex justify-between">
		<div>{invoice.notes ?? ''}</div>
		<div class="text-right">Authorised signatory</div>
	</footer>
</article>
