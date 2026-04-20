<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		text: string
		children: Snippet
	}

	let { text, children }: Props = $props()
</script>

<div class="group relative inline-flex">
	{@render children()}
	<!-- Invisible hover bridge fills gap between trigger and tooltip -->
	<div class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 group-hover:pointer-events-auto">
		<!-- Bridge element -->
		<div class="absolute -bottom-2 left-0 h-2 w-full"></div>
		<div class="tooltip-enter bg-foreground text-background w-max max-w-72 rounded px-2 py-1 text-xs">
			{text}
		</div>
		<div
			class="tooltip-enter border-foreground absolute left-3 top-full border-4 border-transparent border-t-current"
		></div>
	</div>
</div>

<style>
	.tooltip-enter {
		opacity: 0;
		transform: scale(0.96) translateY(4px);
		transition: opacity 150ms cubic-bezier(0.32, 0.72, 0, 1),
			transform 150ms cubic-bezier(0.32, 0.72, 0, 1);
		transition-delay: 300ms;
	}

	:global(.group:hover) .tooltip-enter {
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.tooltip-enter {
			transition-duration: 0ms;
			transform: none;
		}

		:global(.group:hover) .tooltip-enter {
			transform: none;
		}
	}
</style>
