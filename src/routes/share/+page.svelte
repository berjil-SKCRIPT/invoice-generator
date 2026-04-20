<script lang="ts">
	import { onMount } from 'svelte';
	import { decodeInvoice } from '$lib/share/encode';
	import { TEMPLATES } from '$lib/components/templates/registry';
	import { downloadPdf } from '$lib/pdf/generate';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/conversion/Footer.svelte';
	import type { Invoice } from '$lib/schemas/invoice';

	let invoice = $state<Invoice | null>(null);
	let error = $state<string | null>(null);

	const Template = $derived(invoice ? (TEMPLATES[invoice.template] ?? TEMPLATES.modern) : null);

	onMount(() => {
		const hash = window.location.hash.replace(/^#/, '');
		if (!hash) {
			error = 'No invoice data in URL.';
			return;
		}
		const r = decodeInvoice(hash);
		if (!r.success) {
			error = 'This invoice link is corrupted or from an older version.';
			return;
		}
		invoice = r.data;
	});
</script>

<svelte:head>
	<title>Invoice · FeatureOS</title>
	<meta name="robots" content="noindex,nofollow" />
	<link rel="canonical" href="https://featureos.com/" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-secondary/40">
	<header class="no-print border-b border-border bg-background">
		<div class="max-w-[820px] mx-auto px-4 py-3 flex items-center justify-between">
			<a href="/" class="font-bold text-[14px] tracking-[-0.01em] flex items-center gap-2">
				<span class="inline-block h-5 w-5 rounded-md bg-primary"></span> FeatureOS Invoice
			</a>
			{#if invoice}
				<Button variant="default" size="md" onclick={() => downloadPdf(invoice!)}>Download PDF</Button>
			{/if}
		</div>
	</header>

	<main class="flex-1 py-10">
		<div class="mx-auto max-w-[820px] px-4">
			{#if error}
				<div class="rounded-2xl border border-border bg-background p-8 text-center">
					<p class="text-[14px]">{error}</p>
					<a href="/" class="text-primary hover:underline mt-3 inline-block font-medium text-[13px]">Make your own free invoice →</a>
				</div>
			{:else if invoice && Template}
				<div class="invoice-canvas bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_40px_-20px_rgba(0,0,0,0.15)] border border-border rounded-2xl p-8 sm:p-12">
					<Template {invoice} editable={false} />
				</div>
				<p class="text-center text-[12px] text-secondary-foreground mt-6">
					Shared via <a href="/" class="text-primary hover:underline">FeatureOS Invoice Generator</a> · Make your own free, no signup →
				</p>
			{:else}
				<p class="text-center text-secondary-foreground">Loading…</p>
			{/if}
		</div>
	</main>

	<Footer />
</div>
