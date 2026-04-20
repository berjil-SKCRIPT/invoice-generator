<script lang="ts">
	import type { Invoice } from '$lib/schemas/invoice';
	import type { FocusContext } from '$lib/stores/focus.svelte';
	import { CURRENCIES } from '$lib/data/currencies';
	import { isValidGstin } from '$lib/utils/gstin';
	import { INDIA_STATES } from '$lib/data/states-india';
	import { dueFromTerms, type PaymentTerms } from '$lib/utils/date';

	let { invoice, context, onpatch }: {
		invoice: Invoice;
		context: FocusContext;
		onpatch: (p: Partial<Invoice>) => void;
	} = $props();

	const gstinOk = $derived.by(() => {
		if (invoice.region !== 'IN') return true;
		const a = !invoice.from.taxId || isValidGstin(invoice.from.taxId);
		const b = !invoice.to.taxId || isValidGstin(invoice.to.taxId);
		return a && b;
	});

	const labelCls = 'block text-[10px] uppercase tracking-[0.15em] text-secondary-foreground mb-1';
	const controlCls =
		'w-full h-8 px-2.5 bg-secondary border-0 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition';
</script>

<div class="space-y-6 text-[13px] p-4">
	<section>
		<h3 class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-3 font-medium">Document</h3>

		<label class="block mb-3">
			<span class={labelCls}>Region</span>
			<select
				value={invoice.region}
				onchange={(e) => {
					const r = e.currentTarget.value as 'IN' | 'INTL';
					onpatch({
						region: r,
						currency: r === 'IN' ? 'INR' : 'USD',
						locale: r === 'IN' ? 'en-IN' : 'en-US',
						taxMode: r === 'IN' ? 'gst' : 'none',
						taxes: r === 'IN' ? [{ name: 'GST', rate: 18, compound: false }] : []
					});
				}}
				class={controlCls}
			>
				<option value="INTL">International</option>
				<option value="IN">India (GST)</option>
			</select>
		</label>

		<label class="block mb-3">
			<span class={labelCls}>Currency</span>
			<select
				value={invoice.currency}
				onchange={(e) => {
					const code = e.currentTarget.value;
					const c = CURRENCIES.find((x) => x.code === code);
					onpatch({ currency: code, locale: c?.locale ?? invoice.locale });
				}}
				class={controlCls}
			>
				{#each CURRENCIES as c (c.code)}
					<option value={c.code}>{c.code} — {c.name}</option>
				{/each}
			</select>
		</label>

		<label class="block mb-3">
			<span class={labelCls}>Brand color</span>
			<div class="flex items-center gap-2">
				<input
					type="color"
					value={invoice.brand.color}
					oninput={(e) => onpatch({ brand: { ...invoice.brand, color: e.currentTarget.value } })}
					class="h-8 w-10 rounded-full border-0 cursor-pointer appearance-none"
					style="background: {invoice.brand.color};"
				/>
				<span class="font-mono text-[11px] text-secondary-foreground">{invoice.brand.color}</span>
			</div>
		</label>

		<label class="block">
			<span class={labelCls}>Payment terms</span>
			<select
				value={invoice.paymentTerms}
				onchange={(e) => {
					const t = e.currentTarget.value as PaymentTerms;
					onpatch({ paymentTerms: t, dateDue: dueFromTerms(invoice.dateIssued, t) });
				}}
				class={controlCls}
			>
				<option value="net0">Due on receipt</option>
				<option value="net7">Net 7</option>
				<option value="net15">Net 15</option>
				<option value="net30">Net 30</option>
				<option value="net60">Net 60</option>
				<option value="custom">Custom</option>
			</select>
		</label>
	</section>

	<section>
		<h3 class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-3 font-medium">Tax</h3>
		<label class="block mb-3">
			<span class={labelCls}>Mode</span>
			<select
				value={invoice.taxMode}
				onchange={(e) => {
					const m = e.currentTarget.value as Invoice['taxMode'];
					onpatch({
						taxMode: m,
						taxes:
							m === 'none'
								? []
								: invoice.taxes.length
									? invoice.taxes
									: [{ name: m.toUpperCase(), rate: m === 'gst' ? 18 : 10, compound: false }]
					});
				}}
				class={controlCls}
			>
				<option value="none">None</option>
				<option value="simple">Simple</option>
				<option value="gst">GST (India)</option>
				<option value="vat">VAT</option>
				<option value="custom">Custom</option>
			</select>
		</label>
		{#if invoice.taxMode !== 'none' && invoice.taxMode !== 'custom'}
			<label class="block">
				<span class={labelCls}>Rate %</span>
				<input
					type="number"
					value={invoice.taxes[0]?.rate ?? 18}
					min="0"
					max="100"
					oninput={(e) =>
						onpatch({
							taxes: [
								{ name: invoice.taxMode.toUpperCase(), rate: Number(e.currentTarget.value) || 0, compound: false }
							]
						})}
					class={controlCls}
				/>
			</label>
		{/if}
		{#if invoice.region === 'IN' && !gstinOk}
			<p class="text-[11px] text-amber-600 mt-2">⚠ GSTIN format looks off.</p>
		{/if}
		{#if invoice.region === 'IN' && invoice.from.gstStateCode}
			<p class="text-[11px] text-secondary-foreground mt-2">From state: <span class="font-medium text-foreground">{INDIA_STATES[invoice.from.gstStateCode] ?? invoice.from.gstStateCode}</span></p>
		{/if}
	</section>

	<section>
		<h3 class="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground mb-3 font-medium">Adjustments</h3>
		<label class="block mb-3">
			<span class={labelCls}>Discount</span>
			<div class="flex gap-2">
				<select
					value={invoice.discount?.type ?? 'percent'}
					onchange={(e) =>
						onpatch({
							discount: { type: e.currentTarget.value as 'percent' | 'flat', value: invoice.discount?.value ?? 0 }
						})}
					class="h-8 px-2.5 bg-secondary rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40"
				>
					<option value="percent">%</option>
					<option value="flat">Flat</option>
				</select>
				<input
					type="number"
					value={invoice.discount?.value ?? 0}
					oninput={(e) => {
						const v = Number(e.currentTarget.value) || 0;
						onpatch({ discount: v === 0 ? null : { type: invoice.discount?.type ?? 'percent', value: v } });
					}}
					class="flex-1 h-8 px-2.5 bg-secondary rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
			</div>
		</label>

		<label class="block mb-3">
			<span class={labelCls}>Shipping</span>
			<input
				type="number"
				value={invoice.shipping ?? 0}
				oninput={(e) => {
					const v = Number(e.currentTarget.value) || 0;
					onpatch({ shipping: v === 0 ? null : v });
				}}
				class={controlCls}
			/>
		</label>

		<label class="flex items-center gap-2 mt-3">
			<input
				type="checkbox"
				checked={invoice.roundTotal}
				onchange={(e) => onpatch({ roundTotal: e.currentTarget.checked })}
				class="accent-primary"
			/>
			<span class="text-[12px] text-secondary-foreground">Round total to whole number</span>
		</label>
	</section>
</div>
