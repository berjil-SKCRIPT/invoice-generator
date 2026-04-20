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
		template: 'classic'
	};
</script>

<svelte:head>
	<title>Invoice Template India — GST, HSN, Rupee · Free Download · FeatureOS</title>
	<meta
		name="description"
		content="Free invoice templates made for Indian businesses. GST-ready with HSN/SAC codes, GSTIN, CGST/SGST/IGST split, and rupee formatting. Customize and download PDF."
	/>
	<link rel="canonical" href="https://featureos.com/invoice-template-india" />
	<meta property="og:title" content="India Invoice Templates · FeatureOS" />
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
			India · GST · HSN/SAC · ₹
		</div>
		<h1 class="hero-title text-[40px] sm:text-[64px] leading-[0.98] tracking-[-0.035em] font-semibold text-foreground mb-6">
			<span class="serif italic">Invoice templates</span><br />
			for India.
		</h1>
		<p class="hero-subtitle text-[16px] sm:text-[18px] text-secondary-foreground max-w-[640px] mx-auto mb-8">
			Five clean, GST-compliant templates with HSN/SAC, GSTIN, and CGST/SGST/IGST split.
			Edit in place, download a vector PDF. Free forever.
		</p>
		<div class="hero-cta flex items-center justify-center gap-3 flex-wrap">
			<Button href="#editor" variant="default" size="lg">Use this template →</Button>
			<Button href="/gst-invoice-generator" variant="secondary" size="lg">GST generator</Button>
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
			<span class="serif italic">Five</span> templates, one editor.
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each [
				{ slug: 'modern', title: 'Modern', body: 'Balanced header, itemized body, clear totals.' },
				{ slug: 'minimal', title: 'Minimal', body: 'Typographic, quiet, editorial. Hero serif heading.' },
				{ slug: 'classic', title: 'Classic', body: 'Formal bordered layout. Boardroom-ready.' },
				{ slug: 'creative', title: 'Creative', body: 'Brand-color gradient band. For agencies and studios.' },
				{ slug: 'corporate', title: 'Corporate', body: 'Inverted header, navy total strip. For B2B.' }
			] as t (t.slug)}
				<a
					href={`/invoice-template/${t.slug}`}
					class="rounded-2xl border border-border bg-background p-5 hover:border-foreground/30 transition-colors block"
				>
					<h3 class="text-[15px] font-semibold tracking-[-0.01em] mb-1.5">{t.title}</h3>
					<p class="text-[13px] leading-[1.5] text-secondary-foreground">{t.body}</p>
					<div class="text-[12px] text-primary mt-3">Preview →</div>
				</a>
			{/each}
		</div>
	</section>

	<Footer />
</div>
