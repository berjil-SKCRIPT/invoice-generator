<script lang="ts">
	import type { Toast } from '$lib/stores/toasts.svelte';
	let { toasts, ondismiss }: { toasts: Toast[]; ondismiss: (id: string) => void } = $props();
</script>

<div class="no-print fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
	{#each toasts as t (t.id)}
		<div class="bg-foreground text-background rounded-full pl-4 pr-2 py-1.5 shadow-lg shadow-foreground/10 flex items-center gap-4 min-w-[260px] animate-[hero-fade-up_0.25s_cubic-bezier(0.32,0.72,0,1)_forwards]">
			<span class="text-[13px] flex-1">{t.message}</span>
			{#if t.action}
				<button
					class="text-[12px] px-3 h-7 rounded-full bg-background/20 hover:bg-background/30 font-medium transition"
					onclick={() => {
						t.action!.run();
						ondismiss(t.id);
					}}
				>{t.action.label}</button>
			{/if}
		</div>
	{/each}
</div>
