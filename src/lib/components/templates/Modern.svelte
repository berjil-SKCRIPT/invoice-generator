<script lang="ts">
	import EditableField from '../editor/EditableField.svelte';
	import { invoiceTotals } from '$lib/calc/totals';
	import { formatMoney } from '$lib/utils/currency-format';
	import { formatHuman } from '$lib/utils/date';
	import { fileToCompressedDataUrl } from '$lib/utils/image';
	import { parseTabular } from '$lib/utils/paste';
	import type { TemplateProps } from './types';

	let {
		invoice,
		editable,
		onpatch,
		onitempatch,
		onadditem,
		onremoveitem,
		onreorder,
		onappendrows,
		onfocus
	}: TemplateProps = $props();

	const totals = $derived(invoiceTotals(invoice));
	const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);

	async function handleLogo(e: Event) {
		const f = (e.target as HTMLInputElement).files?.[0];
		if (!f) return;
		const url = await fileToCompressedDataUrl(f);
		onpatch?.({ brand: { ...invoice.brand, logoDataUrl: url } });
	}

	function handleBodyPaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text/plain') ?? '';
		if (!text.includes('\t') && !text.includes(',') && !text.includes('\n')) return;
		const rows = parseTabular(text);
		if (rows.length < 2) return;
		e.preventDefault();
		onappendrows?.(rows);
	}
</script>

<article class="font-sans text-foreground tracking-[-0.005em]" style="--brand: {invoice.brand.color};">
	<header class="flex items-start justify-between mb-10 gap-6">
		<div class="flex-1 min-w-0">
			{#if editable}
				<label class="inline-block cursor-pointer mb-5 min-h-[56px]">
					{#if invoice.brand.logoDataUrl}
						<img src={invoice.brand.logoDataUrl} alt="Logo" class="max-h-14" />
					{:else}
						<span class="inline-block px-3 py-1.5 text-[11px] rounded-full border border-dashed border-border text-secondary-foreground hover:text-primary hover:border-primary/40 transition">+ Add logo</span>
					{/if}
					<input type="file" accept="image/*" class="hidden" onchange={handleLogo} />
				</label>
				<EditableField
					value={invoice.from.name}
					placeholder="Your business name"
					class="text-[22px] font-semibold tracking-[-0.01em] block"
					onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })}
					onfocus={() => onfocus?.('from')}
				/>
				<EditableField
					value={invoice.from.address}
					multiline
					placeholder="Street · City · Country"
					class="text-[13px] text-secondary-foreground whitespace-pre-line block mt-1 leading-relaxed"
					onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })}
					onfocus={() => onfocus?.('from')}
				/>
				{#if invoice.region === 'IN'}
					<EditableField
						value={invoice.from.taxId ?? ''}
						placeholder="GSTIN"
						class="text-[11px] font-mono text-secondary-foreground block mt-1.5"
						onchange={(v) => onpatch?.({ from: { ...invoice.from, taxId: v, gstStateCode: v.slice(0, 2) || undefined } })}
						onfocus={() => onfocus?.('from')}
					/>
				{/if}
			{:else}
				{#if invoice.brand.logoDataUrl}<img src={invoice.brand.logoDataUrl} alt="" class="max-h-14 mb-5" />{/if}
				<h2 class="text-[22px] font-semibold tracking-[-0.01em]">{invoice.from.name}</h2>
				<p class="text-[13px] text-secondary-foreground whitespace-pre-line mt-1 leading-relaxed">{invoice.from.address}</p>
				{#if invoice.from.taxId}<p class="text-[11px] font-mono text-secondary-foreground mt-1.5">{invoice.from.taxId}</p>{/if}
			{/if}
		</div>
		<div class="text-right shrink-0">
			<div class="text-[26px] font-bold tracking-[-0.035em] leading-none" style="color: var(--brand);">Invoice</div>
			<div class="text-[11px] font-mono text-secondary-foreground mt-2 tracking-wide">#{invoice.number}</div>
			<dl class="mt-5 text-[13px] space-y-0.5">
				<div class="flex justify-end gap-3">
					<dt class="text-secondary-foreground">Issued</dt>
					<dd class="font-medium">{formatHuman(invoice.dateIssued)}</dd>
				</div>
				<div class="flex justify-end gap-3">
					<dt class="text-secondary-foreground">Due</dt>
					<dd class="font-medium">{formatHuman(invoice.dateDue)}</dd>
				</div>
			</dl>
		</div>
	</header>

	<section class="mb-8 p-5 rounded-xl bg-secondary/70">
		<div class="text-[10px] uppercase tracking-[0.15em] text-secondary-foreground mb-1.5">Bill to</div>
		{#if editable}
			<EditableField value={invoice.to.name} placeholder="Client name" class="font-semibold block tracking-[-0.005em]" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} onfocus={() => onfocus?.('to')} />
			<EditableField value={invoice.to.address} multiline placeholder="Client address" class="text-[13px] text-secondary-foreground whitespace-pre-line block mt-0.5 leading-relaxed" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} onfocus={() => onfocus?.('to')} />
			{#if invoice.region === 'IN'}
				<EditableField value={invoice.to.taxId ?? ''} placeholder="Client GSTIN" class="text-[11px] font-mono text-secondary-foreground block mt-1" onchange={(v) => onpatch?.({ to: { ...invoice.to, taxId: v, gstStateCode: v.slice(0, 2) || undefined } })} onfocus={() => onfocus?.('to')} />
			{/if}
		{:else}
			<p class="font-semibold tracking-[-0.005em]">{invoice.to.name}</p>
			<p class="text-[13px] text-secondary-foreground whitespace-pre-line mt-0.5 leading-relaxed">{invoice.to.address}</p>
			{#if invoice.to.taxId}<p class="text-[11px] font-mono text-secondary-foreground mt-1">{invoice.to.taxId}</p>{/if}
		{/if}
	</section>

	<table class="w-full border-collapse mb-2 text-[13px]">
		<thead>
			<tr class="text-[10px] uppercase tracking-[0.15em] text-secondary-foreground border-b border-border">
				<th class="text-left py-2 font-normal">Description</th>
				{#if invoice.region === 'IN'}<th class="text-left py-2 font-normal w-24">HSN/SAC</th>{/if}
				<th class="text-right py-2 font-normal w-16">Qty</th>
				<th class="text-right py-2 font-normal w-24">Rate</th>
				<th class="text-right py-2 font-normal w-16">Tax</th>
				<th class="text-right py-2 font-normal w-28">Amount</th>
				{#if editable}<th class="w-6"></th>{/if}
			</tr>
		</thead>
		<tbody onpaste={handleBodyPaste}>
			{#each invoice.items as item, idx (item.id)}
				<tr
					class="border-b border-border/60 group"
					draggable={editable}
					ondragstart={(e) => e.dataTransfer?.setData('text/plain', String(idx))}
					ondragover={(e) => e.preventDefault()}
					ondrop={(e) => {
						e.preventDefault();
						const from = Number(e.dataTransfer?.getData('text/plain'));
						if (!Number.isNaN(from) && from !== idx) onreorder?.(from, idx);
					}}
				>
					<td class="py-3">
						{#if editable}<EditableField value={item.description} placeholder="Item description" onchange={(v) => onitempatch?.(item.id, { description: v })} onfocus={() => onfocus?.('item')} />{:else}{item.description}{/if}
					</td>
					{#if invoice.region === 'IN'}
						<td class="py-3 font-mono text-[12px]">
							{#if editable}<EditableField value={item.hsnSac ?? ''} placeholder="—" onchange={(v) => onitempatch?.(item.id, { hsnSac: v })} />{:else}{item.hsnSac ?? ''}{/if}
						</td>
					{/if}
					<td class="py-3 text-right">
						{#if editable}<EditableField value={String(item.quantity)} align="right" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />{:else}{item.quantity}{/if}
					</td>
					<td class="py-3 text-right">
						{#if editable}<EditableField value={String(item.rate)} align="right" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />{:else}{fmt(item.rate)}{/if}
					</td>
					<td class="py-3 text-right text-secondary-foreground">
						{#if editable}<EditableField value={String(item.taxRate)} align="right" onchange={(v) => onitempatch?.(item.id, { taxRate: Number(v) || 0 })} onfocus={() => onfocus?.('tax')} />{:else}{item.taxRate}%{/if}
					</td>
					<td class="py-3 text-right tabular-nums font-medium">{fmt(item.quantity * item.rate)}</td>
					{#if editable}
						<td class="py-3 text-right">
							<button onclick={() => onremoveitem?.(item.id)} class="opacity-0 group-hover:opacity-100 text-secondary-foreground hover:text-red-500 transition text-lg leading-none" aria-label="Remove row">×</button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>

	{#if editable}
		<button class="text-[12px] text-primary hover:underline mt-2 mb-10 inline-flex items-center gap-1" onclick={() => onadditem?.()}>
			<span class="text-base leading-none">+</span> Add line item
		</button>
	{/if}

	<section class="ml-auto w-full max-w-xs space-y-1.5 text-[13px] mt-6">
		<div class="flex justify-between">
			<span class="text-secondary-foreground">Subtotal</span>
			<span class="tabular-nums">{fmt(totals.subtotal)}</span>
		</div>
		{#if totals.discountAmount > 0}
			<div class="flex justify-between">
				<span class="text-secondary-foreground">Discount</span>
				<span class="tabular-nums">−{fmt(totals.discountAmount)}</span>
			</div>
		{/if}
		{#if totals.gst}
			{#if totals.gst.cgst > 0}
				<div class="flex justify-between"><span class="text-secondary-foreground">CGST</span><span class="tabular-nums">{fmt(totals.gst.cgst)}</span></div>
				<div class="flex justify-between"><span class="text-secondary-foreground">SGST</span><span class="tabular-nums">{fmt(totals.gst.sgst)}</span></div>
			{:else}
				<div class="flex justify-between"><span class="text-secondary-foreground">IGST</span><span class="tabular-nums">{fmt(totals.gst.igst)}</span></div>
			{/if}
		{:else if totals.tax > 0}
			<div class="flex justify-between"><span class="text-secondary-foreground">Tax</span><span class="tabular-nums">{fmt(totals.tax)}</span></div>
		{/if}
		{#if totals.shipping > 0}
			<div class="flex justify-between"><span class="text-secondary-foreground">Shipping</span><span class="tabular-nums">{fmt(totals.shipping)}</span></div>
		{/if}
		<div class="flex justify-between pt-3 mt-2 border-t border-foreground/80 font-semibold text-[15px]">
			<span>Total</span>
			<span class="tabular-nums" style="color: var(--brand);">{fmt(totals.grandTotal)}</span>
		</div>
	</section>

	{#if editable || invoice.notes}
		<section class="mt-12">
			<div class="text-[10px] uppercase tracking-[0.15em] text-secondary-foreground mb-2">Notes</div>
			{#if editable}
				<EditableField value={invoice.notes ?? ''} multiline placeholder="Thanks for your business!" class="text-[13px] text-secondary-foreground whitespace-pre-line block leading-relaxed" onchange={(v) => onpatch?.({ notes: v })} onfocus={() => onfocus?.('notes')} />
			{:else}
				<p class="text-[13px] text-secondary-foreground whitespace-pre-line leading-relaxed">{invoice.notes}</p>
			{/if}
		</section>
	{/if}
</article>
