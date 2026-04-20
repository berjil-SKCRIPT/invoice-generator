<script lang="ts">
	import Button from '../ui/Button.svelte';

	const STEPS = [
		{ title: 'Click anything to edit', body: 'Every field on the invoice is editable in place. Just click and type — no forms, no panels getting in the way.' },
		{ title: 'Drag to reorder', body: 'Grab any line-item row and drop it wherever. The invoice reflows instantly.' },
		{ title: '⌘K is your friend', body: 'Switch templates, currencies, tax modes — all from a single keystroke.' },
		{ title: 'Download or share', body: 'Free PDF, no signup. Or copy a share link your client can open in any browser — no account required.' }
	];
	let index = $state(0);
	let { onfinish }: { onfinish: () => void } = $props();
</script>

<div class="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-md flex items-center justify-center p-6" role="dialog" aria-modal="true">
	<div class="bg-background rounded-3xl shadow-2xl p-7 max-w-md w-full border border-border animate-[hero-fade-up_0.4s_cubic-bezier(0.32,0.72,0,1)_forwards]">
		<div class="flex items-center justify-between mb-4">
			<div class="font-mono text-[10px] text-secondary-foreground uppercase tracking-[0.2em]">Welcome · {index + 1} / {STEPS.length}</div>
			<div class="flex gap-1">
				{#each STEPS as _, i}
					<span class="h-1 w-5 rounded-full transition-colors {i === index ? 'bg-primary' : 'bg-border'}"></span>
				{/each}
			</div>
		</div>
		<h2 class="text-2xl font-semibold tracking-[-0.02em] serif">{STEPS[index].title}</h2>
		<p class="text-[14px] text-secondary-foreground mt-3 leading-relaxed">{STEPS[index].body}</p>
		<div class="mt-6 flex justify-between items-center">
			<button class="text-[12px] text-secondary-foreground hover:text-foreground hover:underline" onclick={onfinish}>Skip</button>
			{#if index < STEPS.length - 1}
				<Button size="md" onclick={() => index++}>Next →</Button>
			{:else}
				<Button size="md" onclick={onfinish}>Let's go →</Button>
			{/if}
		</div>
	</div>
</div>
