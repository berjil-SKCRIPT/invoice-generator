<script lang="ts">
	let { onclose }: { onclose: () => void } = $props();
</script>

<div class="no-print fixed bottom-6 right-6 bg-background border border-border rounded-2xl shadow-2xl p-5 max-w-sm z-40 animate-[hero-fade-up_0.45s_cubic-bezier(0.32,0.72,0,1)_forwards]">
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="font-semibold text-[14px] tracking-[-0.005em]">Hope that saved you time!</p>
			<p class="text-[13px] text-secondary-foreground mt-1.5 leading-relaxed">FeatureOS helps product teams collect feedback, build roadmaps, and ship what users actually want.</p>
			<a href="https://featureos.com" class="text-[13px] text-primary hover:underline mt-3 inline-flex items-center gap-1 font-medium">Explore FeatureOS <span aria-hidden="true">→</span></a>
		</div>
		<button onclick={onclose} aria-label="Close" class="text-secondary-foreground text-lg leading-none hover:text-foreground transition h-6 w-6 rounded-full hover:bg-secondary grid place-items-center">×</button>
	</div>
</div>
