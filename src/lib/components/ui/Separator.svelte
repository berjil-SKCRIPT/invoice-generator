<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import type { Action } from 'svelte/action'

	type Orientation = 'horizontal' | 'vertical'

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
		orientation?: Orientation
		class?: string
		container?: boolean
		animated?: boolean
		label?: string
	}

	let {
		orientation = 'horizontal',
		class: className = '',
		container = false,
		animated = false,
		label,
		...restProps
	}: Props = $props()

	let isVisible = $state(false)

	const baseStyles = 'shrink-0'

	const orientationStyles: Record<Orientation, string> = {
		horizontal: 'h-px w-full',
		vertical: 'self-stretch w-px'
	}

	let computedClass = $derived(
		`${container ? 'container ' : ''}${baseStyles} ${orientationStyles[orientation]} ${className}`.trim()
	)

	// Intersection observer action for viewport detection
	const inView: Action<HTMLElement, { once?: boolean }> = (
		node,
		params = { once: true }
	) => {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						isVisible = true
						if (params.once) {
							observer.unobserve(node)
						}
					} else if (!params.once) {
						isVisible = false
					}
				})
			},
			{ threshold: 0.1 }
		)

		observer.observe(node)

		return {
			destroy() {
				observer.disconnect()
			}
		}
	}
</script>

{#if label}
	<div class="{container ? 'container ' : ''}{className}">
		<p class="mb-2 text-xs font-medium tracking-wide text-secondary-foreground uppercase">{label}</p>
		<div
			role="separator"
			aria-orientation={orientation}
			class="{baseStyles} {orientationStyles[orientation]} bg-border"
			{...restProps}
		></div>
	</div>
{:else if animated}
	<div
		role="separator"
		aria-orientation={orientation}
		class="{computedClass} animated-separator"
		class:is-visible={isVisible}
		use:inView={{ once: true }}
		{...restProps}
	></div>
{:else}
	<div
		role="separator"
		aria-orientation={orientation}
		class="{computedClass} bg-border"
		{...restProps}
	></div>
{/if}

<style>
	.animated-separator {
		position: relative;
		background-color: var(--border);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
		will-change: transform;
	}

	.animated-separator::before,
	.animated-separator::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image: linear-gradient(
			90deg,
			rgb(0, 145, 255),
			rgb(255, 2, 240),
			rgb(247, 104, 8),
			rgb(102, 71, 240),
			rgb(0, 145, 255)
		);
		background-size: 200% 100%;
		opacity: 1;
		transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1) 400ms;
	}

	.animated-separator::before {
		inset: -6px 0;
		filter: blur(16px);
		opacity: 0.3;
	}

	.animated-separator.is-visible {
		transform: scaleX(1);
	}

	.animated-separator.is-visible::before,
	.animated-separator.is-visible::after {
		animation: separator-glow 1s linear 1;
		opacity: 0;
	}

	@keyframes separator-glow {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 200% 50%;
		}
	}
</style>
