<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import { page } from '$app/stores'
	import ClientIcon from './ClientIcon.svelte'
	import {
		SquareArrowUpRightIcon
	} from '@hugeicons-pro/core-solid-standard'

	type Variant = 'default' | 'secondary' | 'primary' | 'unstyled'
	type ActiveMatchMode = 'exact' | 'startsWith'
	type Prefetch = 'hover' | 'tap' | 'off'

	interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'rel'> {
		href: string
		variant?: Variant
		external?: boolean
		disabled?: boolean
		highlightCurrentPath?: boolean
		activeMatchMode?: ActiveMatchMode
		activeClass?: string
		showExternalIcon?: boolean
		prefetch?: Prefetch
		rel?: string
		class?: string
		children?: Snippet
	}

	let {
		href,
		variant = 'default',
		external,
		disabled = false,
		highlightCurrentPath = false,
		activeMatchMode = 'exact',
		activeClass = 'text-primary',
		showExternalIcon = false,
		prefetch = 'hover',
		rel,
		class: className = '',
		children,
		...restProps
	}: Props = $props()

	const isExternal = $derived(
		external ??
			(href.startsWith('http://') ||
				href.startsWith('https://') ||
				href.startsWith('mailto:') ||
				href.startsWith('tel:'))
	)

	const isActive = $derived(
		highlightCurrentPath &&
			(activeMatchMode === 'startsWith' && href !== '/'
				? $page.url.pathname.startsWith(href)
				: $page.url.pathname === href)
	)

	function cn(...classes: (string | false | undefined)[]) {
		return classes.filter(Boolean).join(' ')
	}

	const baseStyles =
		'transition-colors duration-75 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

	const variantStyles: Record<Variant, string> = {
		default: 'text-foreground hover:text-primary',
		secondary: 'text-secondary-foreground hover:text-foreground',
		primary: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline',
		unstyled: ''
	}

	const disabledStyles = 'pointer-events-none opacity-50'

	let computedClass = $derived(
		variant === 'unstyled'
			? className
			: cn(
					baseStyles,
					variantStyles[variant],
					disabled && disabledStyles,
					isActive && activeClass,
					className
				)
	)

	const isFirstParty = $derived(
		isExternal && (href.includes('featureos.app') || href.includes('featureos.com'))
	)

	let computedRel = $derived(
		rel ?? (isExternal ? (isFirstParty ? 'noopener' : 'noopener noreferrer') : undefined)
	)
</script>

<a
	{href}
	class={computedClass}
	target={isExternal ? '_blank' : undefined}
	rel={computedRel}
	data-sveltekit-preload-data={isExternal || prefetch === 'off' ? undefined : prefetch}
	aria-current={isActive ? 'page' : undefined}
	aria-disabled={disabled ? 'true' : undefined}
	tabindex={disabled ? -1 : undefined}
	{...restProps}
>
	{#if children}{@render children()}{/if}
	{#if isExternal && showExternalIcon}
		<span class="sr-only">(opens in new tab)</span>
		<span class="ml-1 inline-block align-baseline" aria-hidden="true">
			<ClientIcon icon={SquareArrowUpRightIcon} size={12} />
		</span>
	{/if}
</a>
