<script lang="ts">
	import { TEMPLATE_LIST } from '$lib/components/templates/registry';
	import Button from '../ui/Button.svelte';

	let {
		invoiceNumber,
		currentTemplate,
		theme,
		onCmdK,
		onDownload,
		onShare,
		onPrint,
		onTemplate,
		onThemeCycle,
		onNew
	}: {
		invoiceNumber: string;
		currentTemplate: string;
		theme: string;
		onCmdK: () => void;
		onDownload: () => void;
		onShare: () => void;
		onPrint: () => void;
		onNew: () => void;
		onTemplate: (t: string) => void;
		onThemeCycle: () => void;
	} = $props();

	const themeIcon = $derived(
		theme === 'dark' ? '🌙' : theme === 'oled' ? '🌑' : theme === 'system' ? '◑' : '☀'
	);
</script>

<header class="no-print flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
	<div class="flex items-center gap-3 min-w-0">
		<a href="https://featureos.com" class="font-bold text-[15px] shrink-0 tracking-[-0.01em] flex items-center gap-1.5">
			<span class="inline-block h-5 w-5 rounded-md bg-primary"></span>
			<span>FeatureOS</span>
		</a>
		<span class="text-border hidden sm:inline">/</span>
		<span class="text-[13px] truncate hidden sm:flex items-center gap-2">
			<span class="text-secondary-foreground">Invoice</span>
			<span class="font-mono text-[11px] px-1.5 py-0.5 rounded bg-secondary">{invoiceNumber}</span>
		</span>
	</div>
	<div class="flex items-center gap-1.5 text-[13px]">
		<div class="hidden sm:flex items-center gap-1 rounded-full border border-border p-0.5 bg-secondary/40">
			{#each TEMPLATE_LIST as t (t)}
				<button
					onclick={() => onTemplate(t)}
					class="px-2.5 h-6 rounded-full text-[11px] capitalize transition {currentTemplate === t ? 'bg-background shadow-sm font-medium' : 'text-secondary-foreground hover:text-foreground'}"
				>{t}</button>
			{/each}
		</div>
		<select
			value={currentTemplate}
			onchange={(e) => onTemplate(e.currentTarget.value)}
			class="sm:hidden bg-transparent border border-border rounded-full px-2 py-1 capitalize text-[12px]"
		>
			{#each TEMPLATE_LIST as t}<option value={t}>{t}</option>{/each}
		</select>
		<button onclick={onThemeCycle} title="Theme: {theme}" class="h-8 w-8 grid place-items-center rounded-full border border-border hover:bg-secondary transition">{themeIcon}</button>
		<button onclick={onCmdK} class="hidden sm:inline-flex h-8 items-center gap-1 px-2.5 rounded-full border border-border hover:bg-secondary font-mono text-[11px] transition">⌘K</button>
		<Button variant="ghost" size="md" onclick={onNew} class="hidden md:inline-flex">New</Button>
		<Button variant="ghost" size="md" onclick={onPrint} class="hidden md:inline-flex">Print</Button>
		<Button variant="secondary" size="md" onclick={onShare}>Share</Button>
		<Button variant="default" size="md" onclick={onDownload}>Download PDF</Button>
	</div>
</header>
