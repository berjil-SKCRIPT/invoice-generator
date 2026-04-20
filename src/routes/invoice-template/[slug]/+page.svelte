<script lang="ts">
	import EditorShell from '$lib/components/editor/EditorShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/conversion/Footer.svelte';
	import type { Invoice } from '$lib/schemas/invoice';

	let { data }: { data: { slug: string; title: string; blurb: string } } = $props();

	const seed = $derived<Partial<Invoice>>({ template: data.slug as Invoice['template'] });
</script>

<svelte:head>
	<title>{data.title} Invoice Template — Free, Editable · FeatureOS</title>
	<meta name="description" content={`${data.blurb} Free invoice template — edit in place, download as PDF.`} />
	<link rel="canonical" href={`https://featureos.com/invoice-template/${data.slug}`} />
	<meta property="og:title" content={`${data.title} Invoice Template · FeatureOS`} />
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

	<section class="no-print max-w-5xl mx-auto px-4 pt-16 sm:pt-20 pb-8 text-center">
		<div class="hero-pill inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/40 text-[12px] text-secondary-foreground mb-6">
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
			Template · {data.title}
		</div>
		<h1 class="hero-title text-[40px] sm:text-[56px] leading-[0.98] tracking-[-0.035em] font-semibold text-foreground mb-4">
			<span class="serif italic">{data.title}</span> invoice template.
		</h1>
		<p class="hero-subtitle text-[16px] text-secondary-foreground max-w-[620px] mx-auto mb-6">{data.blurb}</p>
		<div class="hero-cta flex items-center justify-center gap-2 flex-wrap text-[13px]">
			{#each ['modern', 'minimal', 'classic', 'creative', 'corporate'] as s (s)}
				<a
					href={`/invoice-template/${s}`}
					class="px-3 py-1.5 rounded-full border border-border {s === data.slug ? 'bg-foreground text-background' : 'bg-background hover:bg-secondary/60'} transition-colors capitalize"
				>{s}</a>
			{/each}
		</div>
	</section>

	<section class="hero-editor">
		<div class="max-w-[1400px] mx-auto px-2 sm:px-6">
			<div class="rounded-3xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_40px_80px_-40px_rgba(0,0,0,0.25)]">
				{#key data.slug}
					<EditorShell {seed} compact={true} />
				{/key}
			</div>
		</div>
	</section>

	<Footer />
</div>
