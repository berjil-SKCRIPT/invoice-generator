<script lang="ts">
	import EditorShell from '$lib/components/editor/EditorShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/conversion/Footer.svelte';
	import type { Invoice } from '$lib/schemas/invoice';

	const seed: Partial<Invoice> = {
		region: 'IN',
		currency: 'INR',
		locale: 'en-IN',
		taxMode: 'gst',
		taxes: [{ name: 'GST', rate: 18, compound: false }],
		paymentTerms: 'net15'
	};

	const howToLd = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'How to create a GST invoice in India',
		step: [
			{ '@type': 'HowToStep', position: 1, name: 'Add your business and 15-digit GSTIN' },
			{ '@type': 'HowToStep', position: 2, name: 'Add client with their GSTIN for auto CGST/SGST or IGST split' },
			{ '@type': 'HowToStep', position: 3, name: 'List items with HSN/SAC and taxable amount' },
			{ '@type': 'HowToStep', position: 4, name: 'Download GST-compliant PDF invoice' }
		]
	};

	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Does this generate valid GST invoices?',
				acceptedAnswer: { '@type': 'Answer', text: 'Yes. The invoice includes GSTIN, HSN/SAC, place of supply, and auto-splits CGST+SGST for same-state or IGST for interstate based on the GSTIN state codes.' }
			},
			{
				'@type': 'Question',
				name: 'What GST rates are supported?',
				acceptedAnswer: { '@type': 'Answer', text: 'All — 0%, 5%, 12%, 18%, 28%, and any custom rate. Set a default rate or apply per-line-item.' }
			},
			{
				'@type': 'Question',
				name: 'Does it validate GSTIN?',
				acceptedAnswer: { '@type': 'Answer', text: 'Yes. We validate the 15-character GSTIN format and the Mod-36 checksum in real time as you type.' }
			},
			{
				'@type': 'Question',
				name: 'Is this accepted as a GST invoice for ITC claims?',
				acceptedAnswer: { '@type': 'Answer', text: 'The generated invoice contains all fields required under CGST Rule 46 (GSTIN, invoice number, date, HSN/SAC, taxable value, tax split). Your buyer can use it for ITC claims.' }
			}
		]
	};
</script>

<svelte:head>
	<title>Free GST Invoice Generator — CGST, SGST, IGST Auto-Split · FeatureOS</title>
	<meta
		name="description"
		content="Generate GST-compliant invoices free. Auto CGST+SGST split for same-state, IGST for interstate. GSTIN validation, HSN/SAC, India rupee formatting. No signup."
	/>
	<link rel="canonical" href="https://featureos.com/gst-invoice-generator" />
	<meta property="og:title" content="Free GST Invoice Generator · FeatureOS" />
	<meta property="og:description" content="GST-compliant invoices with CGST/SGST/IGST auto-split. Free forever." />
	{@html `<script type="application/ld+json">${JSON.stringify(howToLd)}</${'script'}>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}</${'script'}>`}
</svelte:head>

<div class="min-h-screen bg-background">
	<header class="no-print border-b border-border">
		<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
			<a href="/" class="font-bold text-[14px] tracking-[-0.01em] flex items-center gap-2">
				<span class="inline-block h-5 w-5 rounded-md bg-primary"></span>
				FeatureOS Invoice
			</a>
			<Button href="/app" variant="default" size="sm">Open editor →</Button>
		</div>
	</header>

	<section class="no-print max-w-5xl mx-auto px-4 pt-16 sm:pt-24 pb-12 text-center">
		<div class="hero-pill inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/40 text-[12px] text-secondary-foreground mb-6">
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
			Made for Indian businesses · GSTIN validated · Free forever
		</div>
		<h1 class="hero-title text-[40px] sm:text-[64px] leading-[0.98] tracking-[-0.035em] font-semibold text-foreground mb-6">
			<span class="serif italic">GST invoice</span><br />
			generator for India.
		</h1>
		<p class="hero-subtitle text-[16px] sm:text-[18px] text-secondary-foreground max-w-[640px] mx-auto mb-8">
			CGST + SGST for same-state, IGST for interstate — computed from your GSTIN automatically.
			HSN/SAC fields, rupee formatting, and a clean PDF your CA will love.
		</p>
		<div class="hero-cta flex items-center justify-center gap-3 flex-wrap">
			<Button href="#editor" variant="default" size="lg">Create GST invoice →</Button>
			<Button href="/" variant="secondary" size="lg">International invoice</Button>
		</div>
	</section>

	<section id="editor" class="hero-editor">
		<div class="max-w-[1400px] mx-auto px-2 sm:px-6">
			<div class="rounded-3xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_40px_80px_-40px_rgba(0,0,0,0.25)]">
				<EditorShell {seed} compact={true} />
			</div>
		</div>
	</section>

	<section class="no-print max-w-5xl mx-auto px-4 py-24">
		<h2 class="text-[32px] sm:text-[44px] leading-[1] tracking-[-0.03em] font-semibold text-center mb-14">
			Built for <span class="serif italic">Indian</span> compliance.
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each [
				{ title: 'GSTIN validation', body: '15-character format + Mod-36 checksum verified as you type.' },
				{ title: 'Auto tax split', body: 'Same state → CGST+SGST. Different state → IGST. Derived from GSTIN state code.' },
				{ title: 'HSN/SAC per item', body: 'Add HSN for goods or SAC for services. Shown in the PDF tax table.' },
				{ title: 'All GST rates', body: '0%, 5%, 12%, 18%, 28%, or custom. Per-item or invoice-wide.' },
				{ title: 'Reverse charge', body: 'Mark invoices under reverse charge mechanism with one checkbox.' },
				{ title: 'Rupee formatting', body: 'Indian numbering with lakhs and crores. en-IN locale by default.' }
			] as f (f.title)}
				<div class="rounded-2xl border border-border bg-background p-5 hover:border-foreground/30 transition-colors">
					<h3 class="text-[15px] font-semibold tracking-[-0.01em] mb-1.5">{f.title}</h3>
					<p class="text-[13px] leading-[1.5] text-secondary-foreground">{f.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="no-print bg-secondary/30 border-y border-border">
		<div class="max-w-3xl mx-auto px-4 py-20">
			<h2 class="text-[32px] sm:text-[40px] leading-[1] tracking-[-0.03em] font-semibold text-center mb-12">
				GST <span class="serif italic">FAQ</span>.
			</h2>
			<dl class="space-y-4">
				{#each faqLd.mainEntity as qa (qa.name)}
					<details class="group rounded-2xl border border-border bg-background px-5 py-4 open:bg-secondary/40 transition-colors">
						<summary class="cursor-pointer text-[15px] font-semibold tracking-[-0.01em] flex items-center justify-between">
							{qa.name}
							<span class="text-secondary-foreground text-[18px] leading-none group-open:rotate-45 transition-transform">+</span>
						</summary>
						<p class="mt-3 text-[13px] leading-[1.6] text-secondary-foreground">{qa.acceptedAnswer.text}</p>
					</details>
				{/each}
			</dl>
		</div>
	</section>

	<Footer />
</div>
