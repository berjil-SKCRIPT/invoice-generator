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

<article class="font-sans text-foreground">
	<header class="text-center mb-10 pb-6 border-b-2 border-double border-foreground">
		<h1 class="text-4xl tracking-[0.3em] uppercase font-semibold">Invoice</h1>
		<div class="text-[11px] font-mono text-secondary-foreground mt-4">No. {invoice.number}</div>
	</header>

	<div class="grid grid-cols-2 gap-8 mb-8">
		<div>
			<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground">From</div>
			{#if editable}
				<EditableField value={invoice.from.name} placeholder="Name" class="font-semibold text-lg block mt-2 tracking-[-0.01em]" onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })} />
				<EditableField value={invoice.from.address} multiline placeholder="Address" class="text-[13px] whitespace-pre-line block text-secondary-foreground" onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })} />
			{:else}<p class="font-semibold text-lg mt-2 tracking-[-0.01em]">{invoice.from.name}</p><p class="text-[13px] whitespace-pre-line text-secondary-foreground">{invoice.from.address}</p>{/if}
		</div>
		<div>
			<div class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground">To</div>
			{#if editable}
				<EditableField value={invoice.to.name} placeholder="Client" class="font-semibold text-lg block mt-2 tracking-[-0.01em]" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} />
				<EditableField value={invoice.to.address} multiline placeholder="Address" class="text-[13px] whitespace-pre-line block text-secondary-foreground" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} />
			{:else}<p class="font-semibold text-lg mt-2 tracking-[-0.01em]">{invoice.to.name}</p><p class="text-[13px] whitespace-pre-line text-secondary-foreground">{invoice.to.address}</p>{/if}
		</div>
	</div>

	<div class="flex justify-between text-[12px] mb-6 border-y border-border py-2">
		<div><span class="uppercase tracking-[0.2em] text-[10px] text-secondary-foreground">Issued</span> <span class="ml-2">{formatHuman(invoice.dateIssued)}</span></div>
		<div><span class="uppercase tracking-[0.2em] text-[10px] text-secondary-foreground">Due</span> <span class="ml-2">{formatHuman(invoice.dateDue)}</span></div>
	</div>

	<table class="w-full border-collapse mb-6 text-[13px]">
		<thead>
			<tr class="bg-secondary text-[10px] uppercase tracking-[0.18em]">
				<th class="text-left py-2.5 px-2 font-normal">Description</th>
				<th class="text-right py-2.5 px-2 font-normal w-16">Qty</th>
				<th class="text-right py-2.5 px-2 font-normal w-24">Rate</th>
				<th class="text-right py-2.5 px-2 font-normal w-28">Amount</th>
			</tr>
		</thead>
		<tbody>
			{#each invoice.items as item (item.id)}
				<tr class="border-b border-border/60">
					<td class="py-3 px-2">{#if editable}<EditableField value={item.description} placeholder="Item" onchange={(v) => onitempatch?.(item.id, { description: v })} />{:else}{item.description}{/if}</td>
					<td class="py-3 px-2 text-right">{#if editable}<EditableField value={String(item.quantity)} align="right" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />{:else}{item.quantity}{/if}</td>
					<td class="py-3 px-2 text-right">{#if editable}<EditableField value={String(item.rate)} align="right" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />{:else}{fmt(item.rate)}{/if}</td>
					<td class="py-3 px-2 text-right tabular-nums font-medium">{fmt(item.quantity * item.rate)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if editable}<button class="text-[12px] text-primary hover:underline" onclick={() => onadditem?.()}>+ Add line item</button>{/if}

	<div class="ml-auto w-80 mt-8 text-[13px]">
		<div class="flex justify-between py-1"><span class="text-secondary-foreground">Subtotal</span><span class="tabular-nums">{fmt(totals.subtotal)}</span></div>
		{#if totals.tax > 0}<div class="flex justify-between py-1"><span class="text-secondary-foreground">Tax</span><span class="tabular-nums">{fmt(totals.tax)}</span></div>{/if}
		<div class="flex justify-between pt-3 mt-3 border-t-2 border-double border-foreground text-[15px] font-semibold uppercase tracking-widest">
			<span>Total</span><span class="tabular-nums">{fmt(totals.grandTotal)}</span>
		</div>
	</div>

	<footer class="mt-16 pt-6 border-t border-border text-center text-[11px] text-secondary-foreground">
		{#if invoice.notes}<p class="italic mb-4">{invoice.notes}</p>{/if}
		<p class="uppercase tracking-[0.2em]">Thank you</p>
	</footer>
</article>
