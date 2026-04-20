<script lang="ts">
	import type { Command } from './commands';

	let { open, commands, onclose }: {
		open: boolean;
		commands: Command[];
		onclose: () => void;
	} = $props();

	let query = $state('');
	let activeIdx = $state(0);

	const filtered = $derived(filter(commands, query));

	function filter(cmds: Command[], q: string): Command[] {
		if (!q) return cmds.slice(0, 30);
		const lq = q.toLowerCase();
		return cmds
			.map((c) => ({ c, score: scoreMatch(c.label.toLowerCase(), lq) }))
			.filter((x) => x.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 30)
			.map((x) => x.c);
	}

	function scoreMatch(text: string, query: string): number {
		let i = 0,
			score = 0;
		for (const ch of text) {
			if (ch === query[i]) {
				score += 2 + i;
				i++;
				if (i >= query.length) return score;
			}
		}
		return 0;
	}

	function onkey(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (e.key === 'ArrowDown') {
			activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
			e.preventDefault();
		}
		if (e.key === 'ArrowUp') {
			activeIdx = Math.max(activeIdx - 1, 0);
			e.preventDefault();
		}
		if (e.key === 'Enter') {
			filtered[activeIdx]?.run();
			onclose();
		}
	}

	$effect(() => {
		if (open) {
			query = '';
			activeIdx = 0;
		}
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-start justify-center pt-28"
		onclick={onclose}
		onkeydown={(e) => e.key === 'Escape' && onclose()}
		role="presentation"
	>
		<div
			class="bg-background rounded-2xl shadow-2xl w-full max-w-xl mx-4 border border-border overflow-hidden ring-1 ring-foreground/5"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<input
				type="text"
				bind:value={query}
				onkeydown={onkey}
				placeholder="Type a command…"
				class="w-full px-5 py-3.5 bg-transparent border-b border-border outline-none text-[14px] placeholder:text-secondary-foreground"
			/>
			<ul class="max-h-96 overflow-auto py-1">
				{#each filtered as c, i (c.id)}
					<li>
						<button
							onclick={() => {
								c.run();
								onclose();
							}}
							class="w-full text-left px-5 py-2 flex justify-between items-center gap-3 {i === activeIdx ? 'bg-secondary' : ''} hover:bg-secondary"
							onmouseenter={() => (activeIdx = i)}
						>
							<span class="flex items-center gap-3 text-[13px] min-w-0">
								<span class="text-[10px] uppercase tracking-[0.15em] text-secondary-foreground w-20 shrink-0 font-medium">{c.group}</span>
								<span class="truncate">{c.label}</span>
							</span>
							{#if c.hint}<span class="text-[10px] text-secondary-foreground font-mono shrink-0">{c.hint}</span>{/if}
						</button>
					</li>
				{/each}
				{#if filtered.length === 0}
					<li class="px-4 py-8 text-center text-[13px] text-secondary-foreground">No commands match.</li>
				{/if}
			</ul>
			<div class="border-t border-border px-4 py-2 flex justify-between items-center text-[11px] text-secondary-foreground bg-secondary/50">
				<span><kbd class="font-mono px-1.5 py-0.5 rounded bg-background border border-border">↑↓</kbd> navigate</span>
				<span><kbd class="font-mono px-1.5 py-0.5 rounded bg-background border border-border">enter</kbd> select · <kbd class="font-mono px-1.5 py-0.5 rounded bg-background border border-border ml-1">esc</kbd> close</span>
			</div>
		</div>
	</div>
{/if}
