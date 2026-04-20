<script lang="ts">
	import EditorShell from '$lib/components/editor/EditorShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/conversion/Footer.svelte';
	import { newId } from '$lib/utils/id';
	import type { Invoice } from '$lib/schemas/invoice';

	const seed: Partial<Invoice> = {
		region: 'INTL',
		currency: 'USD',
		locale: 'en-US',
		taxMode: 'none',
		taxes: [],
		paymentTerms: 'net15',
		template: 'minimal',
		items: [
			{ id: newId(), description: 'Design — hourly', quantity: 10, rate: 100, taxRate: 0 },
			{ id: newId(), description: 'Development — hourly', quantity: 20, rate: 120, taxRate: 0 }
		]
	};

	const howToLd = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'How a freelancer sends a professional invoice',
		step: [
			{ '@type': 'HowToStep', position: 1, name: 'Add your name and client company' },
			{ '@type': 'HowToStep', position: 2, name: 'List hours and hourly rate per service' },
			{ '@type': 'HowToStep', position: 3, name: 'Set currency and payment terms' },
			{ '@type': 'HowToStep', position: 4, name: 'Share a link or email the PDF' }
		]
	};

	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{ '@type': 'Question', name: 'Can I bill hourly?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Use quantity as hours and rate as hourly rate. Totals compute automatically.' } },
			{ '@type': 'Question', name: 'Which currencies are supported?', acceptedAnswer: { '@type': 'Answer', text: 'USD, EUR, GBP, INR, AUD, CAD, SGD, and 25+ more with locale-aware number formatting.' } },
			{ '@type': 'Question', name: 'Can I add my logo?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upload your logo — we compress it locally and include it in the PDF.' } },
			{ '@type': 'Question', name: 'How do I get paid?', acceptedAnswer: { '@type': 'Answer', text: 'Add your bank details or payment links (Stripe, PayPal, UPI) in the Payment section — they appear at the bottom of the PDF.' } }
		]
	};
</script>

<svelte:head>
	<title>Free Freelance Invoice Generator — Hourly, Multi-Currency · FeatureOS</title>
	<meta
		name="description"
		content="The fastest way for freelancers to send invoices. Hourly billing, 30+ currencies, clean minimal templates. Free, no signup, your data stays on your device."
	/>
	<link rel="canonical" href="https://featureos.com/freelance-invoice-generator" />
	<meta property="og:title" content="Freelance Invoice Generator · FeatureOS" />
	<meta property="og:description" content="Hourly billing. Multi-currency. Minimal design. Free forever." />
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
			For designers, developers, writers, consultants
		</div>
		<h1 class="hero-title text-[40px] sm:text-[64px] leading-[0.98] tracking-[-0.035em] font-semibold text-foreground mb-6">
			The <span class="serif italic">freelancer's</span><br />
			invoice generator.
		</h1>
		<p class="hero-subtitle text-[16px] sm:text-[18px] text-secondary-foreground max-w-[640px] mx-auto mb-8">
			Hourly billing, multi-currency, minimal design. Send professional invoices in a minute,
			without a subscription or a form. Your data never leaves your browser.
		</p>
		<div class="hero-cta flex items-center justify-center gap-3 flex-wrap">
			<Button href="#editor" variant="default" size="lg">Send an invoice →</Button>
			<Button href="/invoice-template/minimal" variant="secondary" size="lg">See templates</Button>
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
			Made for <span class="serif italic">solo</span> operators.
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each [
				{ title: 'Hourly or fixed', body: 'Set quantity as hours, rate as hourly. Or use flat project fees.' },
				{ title: '30+ currencies', body: 'Bill US clients in USD, EU clients in EUR, UK clients in GBP.' },
				{ title: 'Stripe & UPI', body: 'Paste a payment link or UPI ID. Clients tap-to-pay from the PDF.' },
				{ title: 'Save clients', body: 'Recent clients auto-fill. Reuse billing details across invoices.' },
				{ title: 'Minimal template', body: 'Clean typographic design that looks right next to your portfolio.' },
				{ title: 'No vendor lock-in', body: 'Your data lives on your device. Export, download, move on anytime.' }
			] as f (f.title)}
				<div class="rounded-2xl border border-border bg-background p-5 hover:border-foreground/30 transition-colors">
					<h3 class="text-[15px] font-semibold tracking-[-0.01em] mb-1.5">{f.title}</h3>
					<p class="text-[13px] leading-[1.5] text-secondary-foreground">{f.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<Footer />
</div>
