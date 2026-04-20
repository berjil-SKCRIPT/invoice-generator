<script lang="ts">
	import EditorShell from '$lib/components/editor/EditorShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/conversion/Footer.svelte';

	const howToLd = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'How to create a free invoice',
		step: [
			{ '@type': 'HowToStep', position: 1, name: 'Add your business and client' },
			{ '@type': 'HowToStep', position: 2, name: 'List items, quantity, and price' },
			{ '@type': 'HowToStep', position: 3, name: 'Set taxes, currency, and terms' },
			{ '@type': 'HowToStep', position: 4, name: 'Download as PDF or share via link' }
		]
	};

	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Is this invoice generator free?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. No sign-up, no watermarks, no paywall. Your data stays on your device.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I create GST invoices for India?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. Enable GST mode, enter your GSTIN, and we automatically split CGST/SGST for same-state or IGST for interstate.'
				}
			},
			{
				'@type': 'Question',
				name: 'Where is my data stored?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Everything is saved in your browser only. No server, no database, no tracking.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I share an invoice without downloading?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. Copy a share link — the invoice is compressed into the URL, so no server stores it.'
				}
			}
		]
	};
</script>

<svelte:head>
	<title>Free Invoice Generator — No Signup, GST & Multi-Currency · FeatureOS</title>
	<meta
		name="description"
		content="Create, download, and share professional invoices in seconds. Free forever. GST-ready for India, 30+ currencies, 5 templates, no signup."
	/>
	<link rel="canonical" href="https://featureos.com/" />
	<meta property="og:title" content="Free Invoice Generator · FeatureOS" />
	<meta
		property="og:description"
		content="Beautiful invoices in seconds. Free, no signup, GST-ready, download as PDF or share via link."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://featureos.com/" />
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
			<nav class="hidden sm:flex items-center gap-1 text-[13px]">
				<a href="/gst-invoice-generator" class="px-3 py-1.5 rounded-full hover:bg-secondary/60 transition-colors">GST invoice</a>
				<a href="/freelance-invoice-generator" class="px-3 py-1.5 rounded-full hover:bg-secondary/60 transition-colors">Freelance</a>
				<a href="/invoice-template-india" class="px-3 py-1.5 rounded-full hover:bg-secondary/60 transition-colors">Templates</a>
				<Button href="/app" variant="default" size="sm">Open editor →</Button>
			</nav>
		</div>
	</header>

	<section class="no-print relative overflow-hidden">
		<div class="max-w-5xl mx-auto px-4 pt-16 sm:pt-24 pb-12 text-center">
			<div class="hero-pill inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/40 text-[12px] tracking-[-0.005em] text-secondary-foreground mb-6">
				<span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
				Free forever · No signup · Your data stays on your device
			</div>
			<h1 class="hero-title text-[44px] sm:text-[72px] leading-[0.98] tracking-[-0.035em] font-semibold text-foreground mb-6">
				Make a <span class="serif italic">beautiful</span><br />
				invoice in 60 seconds.
			</h1>
			<p class="hero-subtitle text-[16px] sm:text-[18px] tracking-[-0.005em] text-secondary-foreground max-w-[620px] mx-auto mb-8">
				A fast, modern invoice generator. Five designs, 30+ currencies, GST-ready for India.
				Download as PDF or share via a link that no server ever sees.
			</p>
			<div class="hero-cta flex items-center justify-center gap-3 flex-wrap">
				<Button href="#editor" variant="default" size="lg">Start an invoice →</Button>
				<Button href="/gst-invoice-generator" variant="secondary" size="lg">Need GST?</Button>
			</div>
			<p class="hero-cta mt-6 text-[12px] text-secondary-foreground">
				No email required · Works offline · PDF is vector (not a screenshot)
			</p>
		</div>
	</section>

	<section id="editor" class="hero-editor">
		<div class="max-w-[1400px] mx-auto px-2 sm:px-6">
			<div class="rounded-3xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_40px_80px_-40px_rgba(0,0,0,0.25)]">
				<EditorShell compact={true} />
			</div>
		</div>
	</section>

	<section class="no-print max-w-5xl mx-auto px-4 py-24">
		<h2 class="text-[32px] sm:text-[44px] leading-[1] tracking-[-0.03em] font-semibold text-center mb-14">
			<span class="serif italic">Everything</span> you need. Nothing you don't.
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each [
				{ title: 'Type anywhere', body: 'WYSIWYG editing. Click any field on the invoice and just type. No forms.' },
				{ title: '5 templates', body: 'Modern, Minimal, Classic, Creative, Corporate. Switch instantly without losing data.' },
				{ title: 'GST-ready', body: 'Auto CGST/SGST for same-state, IGST for interstate. GSTIN validated in real time.' },
				{ title: '30+ currencies', body: 'USD, EUR, INR, GBP, AUD, SGD — with locale-aware number formatting.' },
				{ title: 'Vector PDF', body: 'Text stays selectable. Renders crisp at any zoom. No screenshot hacks.' },
				{ title: 'Share via link', body: 'The invoice is compressed into the URL fragment. No server, no database.' },
				{ title: 'Paste a table', body: 'Copy rows from a spreadsheet, paste into the editor, they become line items.' },
				{ title: 'Your brand', body: 'Logo, accent color, and paper style — all saved across invoices.' },
				{ title: '⌘K everything', body: 'Command palette for templates, currency, tax mode, export, share, and more.' }
			] as f (f.title)}
				<div class="rounded-2xl border border-border bg-background p-5 hover:border-foreground/30 transition-colors">
					<h3 class="text-[15px] font-semibold tracking-[-0.01em] mb-1.5">{f.title}</h3>
					<p class="text-[13px] leading-[1.5] text-secondary-foreground">{f.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="no-print bg-secondary/30 border-y border-border">
		<div class="max-w-5xl mx-auto px-4 py-20">
			<h2 class="text-[32px] sm:text-[44px] leading-[1] tracking-[-0.03em] font-semibold text-center mb-14">
				How it <span class="serif italic">works</span>.
			</h2>
			<ol class="grid grid-cols-1 md:grid-cols-4 gap-4">
				{#each [
					{ step: '01', title: 'Add details', body: 'Business, client, logo — or let us detect your region and pre-fill the essentials.' },
					{ step: '02', title: 'List items', body: 'Description, qty, price. Paste from Excel to bulk-add. Tax is computed automatically.' },
					{ step: '03', title: 'Pick a look', body: 'Switch templates with one click. Set brand color. All existing data is preserved.' },
					{ step: '04', title: 'Send it', body: 'Download vector PDF, share via link, or print. Every option is one keystroke away.' }
				] as s (s.step)}
					<li class="rounded-2xl border border-border bg-background p-5">
						<div class="text-[12px] font-mono text-primary mb-3">{s.step}</div>
						<h3 class="text-[15px] font-semibold tracking-[-0.01em] mb-1.5">{s.title}</h3>
						<p class="text-[13px] leading-[1.5] text-secondary-foreground">{s.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="no-print max-w-3xl mx-auto px-4 py-24">
		<h2 class="text-[32px] sm:text-[44px] leading-[1] tracking-[-0.03em] font-semibold text-center mb-14">
			Questions, <span class="serif italic">answered</span>.
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
	</section>

	<section class="no-print border-t border-border">
		<div class="max-w-5xl mx-auto px-4 py-16">
			<h2 class="text-[20px] font-semibold tracking-[-0.01em] mb-6">Related tools</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[13px]">
				<a href="/gst-invoice-generator" class="rounded-2xl border border-border bg-background p-4 hover:border-foreground/30 transition-colors">
					<div class="font-semibold mb-1">GST Invoice Generator</div>
					<div class="text-secondary-foreground">For Indian businesses with CGST, SGST, IGST</div>
				</a>
				<a href="/freelance-invoice-generator" class="rounded-2xl border border-border bg-background p-4 hover:border-foreground/30 transition-colors">
					<div class="font-semibold mb-1">Freelance Invoice</div>
					<div class="text-secondary-foreground">Hourly billing, multiple currencies, clean design</div>
				</a>
				<a href="/invoice-template-india" class="rounded-2xl border border-border bg-background p-4 hover:border-foreground/30 transition-colors">
					<div class="font-semibold mb-1">India Invoice Templates</div>
					<div class="text-secondary-foreground">HSN/SAC, GSTIN, state-code aware</div>
				</a>
				<a href="/invoice-template/modern" class="rounded-2xl border border-border bg-background p-4 hover:border-foreground/30 transition-colors">
					<div class="font-semibold mb-1">Invoice Templates</div>
					<div class="text-secondary-foreground">Modern, minimal, classic, creative, corporate</div>
				</a>
			</div>
		</div>
	</section>

	<Footer />
</div>
