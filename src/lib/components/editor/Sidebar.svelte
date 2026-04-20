<script lang="ts">
	import type { Invoice } from '$lib/schemas/invoice';

	let { history, activeId, onopen, onnew, onduplicate, ondelete }: {
		history: Invoice[];
		activeId: string;
		onopen: (id: string) => void;
		onnew: () => void;
		onduplicate: (id: string) => void;
		ondelete: (id: string) => void;
	} = $props();

	let query = $state('');
	const filtered = $derived(
		history.filter(
			(h) =>
				h.number.toLowerCase().includes(query.toLowerCase()) ||
				h.to.name.toLowerCase().includes(query.toLowerCase())
		)
	);
</script>

<div class="flex flex-col h-full p-3 gap-3">
	<button onclick={onnew} class="w-full px-3 h-8 rounded-full bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition active:scale-[0.98]">+ New invoice</button>
	<input
		bind:value={query}
		placeholder="Search…"
		class="w-full px-3 h-8 bg-secondary border-0 rounded-full text-[13px] placeholder:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
	/>
	<div class="flex-1 overflow-auto -mx-1">
		{#if filtered.length === 0}
			<p class="text-[11px] text-secondary-foreground px-3 py-4 leading-relaxed">No saved invoices yet. Press ⌘S to save the current one.</p>
		{/if}
		<ul class="space-y-0.5">
			{#each filtered as inv (inv.id)}
				<li class="group">
					<button
						onclick={() => onopen(inv.id)}
						class="w-full text-left px-3 py-2 rounded-lg transition {inv.id === activeId ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-secondary'}"
					>
						<div class="flex justify-between items-baseline">
							<span class="font-mono text-[10px] text-secondary-foreground">{inv.number}</span>
							<span class="text-[9px] uppercase tracking-[0.15em] {inv.meta.status === 'paid' ? 'text-success' : 'text-secondary-foreground'}">{inv.meta.status}</span>
						</div>
						<div class="text-[13px] truncate mt-0.5 font-medium">{inv.to.name || '(no client)'}</div>
					</button>
					<div class="hidden group-hover:flex text-[10px] px-3 pb-2 gap-3">
						<button onclick={() => onduplicate(inv.id)} class="hover:text-primary">Duplicate</button>
						<button onclick={() => ondelete(inv.id)} class="hover:text-danger">Delete</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
