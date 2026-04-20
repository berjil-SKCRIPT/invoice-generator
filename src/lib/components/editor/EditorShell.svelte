<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';

	import type { Invoice } from '$lib/schemas/invoice';
	import { createInvoiceStore, makeBlankInvoice } from '$lib/stores/invoice.svelte';
	import { createPrefsStore } from '$lib/stores/prefs.svelte';
	import { createThemeStore } from '$lib/stores/theme.svelte';
	import { createHistoryStore } from '$lib/stores/history.svelte';
	import { createFocusStore } from '$lib/stores/focus.svelte';
	import { createToastStore } from '$lib/stores/toasts.svelte';

	import { detectRegion } from '$lib/utils/region';
	import { newId } from '$lib/utils/id';
	import { downloadPdf } from '$lib/pdf/generate';
	import { encodeInvoice, encodedSize } from '$lib/share/encode';
	import { buildCommands } from '$lib/components/command-palette/commands';
	import { CURRENCIES } from '$lib/data/currencies';
	import { TEMPLATES } from '$lib/components/templates/registry';

	import TopBar from './TopBar.svelte';
	import Sidebar from './Sidebar.svelte';
	import Inspector from '../inspector/Inspector.svelte';
	import CommandPalette from '../command-palette/CommandPalette.svelte';
	import Welcome from '../onboarding/Welcome.svelte';
	import Toast from '../ui/Toast.svelte';
	import PostDownload from '../conversion/PostDownload.svelte';

	let { seed, compact = false }: { seed?: Partial<Invoice>; compact?: boolean } = $props();

	const invoice = createInvoiceStore(seed);
	const prefs = createPrefsStore();
	const theme = createThemeStore();
	const history = createHistoryStore();
	const focus = createFocusStore();
	const toasts = createToastStore();

	let paletteOpen = $state(false);
	let showWelcome = $state(false);
	let showPostDownload = $state(false);

	const CurrentTemplate = $derived(TEMPLATES[invoice.value.template] ?? TEMPLATES.modern);

	function switchTemplate(t: string) {
		const apply = () => invoice.patch({ template: t as Invoice['template'] });
		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			(document as any).startViewTransition(apply);
		} else apply();
	}

	async function handleDownload() {
		try {
			await downloadPdf(invoice.value);
			if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
				confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: [invoice.value.brand.color, '#4f46e5', '#22c55e'] });
			}
			if (!sessionStorage.getItem('featureos_inv_v1_postdownload')) {
				sessionStorage.setItem('featureos_inv_v1_postdownload', '1');
				showPostDownload = true;
			}
		} catch (e) {
			toasts.push({ message: 'PDF failed. Try Print instead.' });
		}
	}

	async function shareInvoice() {
		const enc = encodeInvoice(invoice.value);
		if (encodedSize(enc) > 8192) {
			toasts.push({ message: 'Invoice too large to share via link (likely a big logo). Use Download PDF.' });
			return;
		}
		const url = `${window.location.origin}/share/#${enc}`;
		try {
			await navigator.clipboard.writeText(url);
			toasts.push({ message: `Share link copied · ${(new Blob([enc]).size / 1024).toFixed(1)} KB` });
		} catch {
			toasts.push({ message: 'Could not copy. URL: ' + url });
		}
	}

	function handlePrint() {
		window.print();
	}

	function saveInvoice() {
		const current = invoice.value;
		let number = current.number;
		if (number === 'INV-DRAFT') {
			number = prefs.consumeNumber();
			invoice.patch({ number });
		}
		history.upsert({ ...invoice.value, number });
		toasts.push({ message: `Saved ${number}` });
	}

	function newInvoice() {
		invoice.set(makeBlankInvoice());
	}

	function duplicateInvoice() {
		const n = prefs.consumeNumber();
		invoice.set({ ...invoice.value, id: newId(), number: n, meta: { status: 'draft' } });
		toasts.push({ message: 'Duplicated — edit the copy' });
	}

	const commands = $derived(
		buildCommands({
			setTemplate: (t) => switchTemplate(t),
			setCurrency: (code, locale) => invoice.patch({ currency: code, locale }),
			setTaxMode: (m) => invoice.patch({
				taxMode: m,
				taxes: m === 'none' ? [] : (invoice.value.taxes.length ? invoice.value.taxes : [{ name: m.toUpperCase(), rate: m === 'gst' ? 18 : 10, compound: false }])
			}),
			cycleTheme: () => theme.cycle(),
			download: handleDownload,
			share: shareInvoice,
			print: handlePrint,
			save: saveInvoice,
			newInvoice,
			duplicate: duplicateInvoice,
			currencies: CURRENCIES
		})
	);

	onMount(() => {
		const drafted = localStorage.getItem('featureos_inv_v1_draft_seeded');
		if (!drafted && !seed && !invoice.value.from.name) {
			const d = detectRegion();
			invoice.patch({
				region: d.region,
				currency: d.currency,
				locale: d.locale,
				taxMode: d.region === 'IN' ? 'gst' : 'none',
				taxes: d.region === 'IN' ? [{ name: 'GST', rate: 18, compound: false }] : []
			});
			localStorage.setItem('featureos_inv_v1_draft_seeded', '1');
		}
		if (!localStorage.getItem('featureos_inv_v1_welcome_done')) showWelcome = true;

		function onKey(e: KeyboardEvent) {
			const mod = e.metaKey || e.ctrlKey;
			if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); paletteOpen = !paletteOpen; }
			else if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); saveInvoice(); }
			else if (mod && e.key.toLowerCase() === 'e') { e.preventDefault(); handleDownload(); }
			else if (mod && e.key.toLowerCase() === 'l') { e.preventDefault(); shareInvoice(); }
			else if (mod && e.key.toLowerCase() === 'p') { e.preventDefault(); handlePrint(); }
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<div class="flex flex-col bg-secondary/30 {compact ? 'min-h-[720px]' : 'min-h-screen'}">
	<TopBar
		invoiceNumber={invoice.value.number}
		currentTemplate={invoice.value.template}
		theme={theme.value}
		onCmdK={() => (paletteOpen = true)}
		onDownload={handleDownload}
		onShare={shareInvoice}
		onPrint={handlePrint}
		onTemplate={switchTemplate}
		onThemeCycle={() => theme.cycle()}
		onNew={newInvoice}
	/>

	<div class="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px]">
		<aside class="no-print hidden md:block border-r border-border bg-background overflow-auto">
			<Sidebar
				history={history.value}
				activeId={invoice.value.id}
				onnew={newInvoice}
				onopen={(id) => { const i = history.find(id); if (i) invoice.set(i); }}
				onduplicate={(id) => {
					const dup = history.duplicate(id, prefs.consumeNumber());
					if (dup) invoice.set(dup);
				}}
				ondelete={(id) => {
					const snap = history.find(id);
					history.remove(id);
					toasts.push({ message: 'Invoice deleted', action: { label: 'Undo', run: () => snap && history.upsert(snap) } });
				}}
			/>
		</aside>

		<main class="p-4 sm:p-8 overflow-auto">
			<div
				class="invoice-canvas mx-auto max-w-[820px] bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_40px_-20px_rgba(0,0,0,0.15)] border border-border rounded-2xl p-8 sm:p-12"
				style="view-transition-name: invoice-canvas;"
			>
				<CurrentTemplate
					invoice={invoice.value}
					editable={true}
					onpatch={(p: Partial<Invoice>) => invoice.patch(p)}
					onitempatch={(id: string, p: any) => invoice.updateItem(id, p)}
					onadditem={() => invoice.addItem()}
					onremoveitem={(id: string) => invoice.removeItem(id)}
					onreorder={(f: number, t: number) => invoice.reorderItems(f, t)}
					onappendrows={(rows: any) => invoice.appendRows(rows)}
					onfocus={(ctx: any) => focus.set(ctx)}
				/>
			</div>
		</main>

		<aside class="no-print hidden lg:block border-l border-border bg-background overflow-auto">
			<Inspector invoice={invoice.value} context={focus.value} onpatch={(p) => invoice.patch(p)} />
		</aside>
	</div>
</div>

<CommandPalette open={paletteOpen} {commands} onclose={() => (paletteOpen = false)} />
<Toast toasts={toasts.value} ondismiss={toasts.dismiss} />
{#if showWelcome}
	<Welcome
		onfinish={() => {
			showWelcome = false;
			localStorage.setItem('featureos_inv_v1_welcome_done', '1');
		}}
	/>
{/if}
{#if showPostDownload}
	<PostDownload onclose={() => (showPostDownload = false)} />
{/if}
