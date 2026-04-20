<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
	import ClientIcon from './ClientIcon.svelte'
	import Link from './Link.svelte'

	type Variant = 'default' | 'secondary' | 'ghost' | 'ghost-invert' | 'naked' | 'link'
	type Size = 'xs' | 'sm' | 'md' | 'lg'
	type IconPosition = 'left' | 'right'

	interface BaseProps {
		variant?: Variant
		size?: Size
		icon?: string | unknown
		iconPosition?: IconPosition
		class?: string
		children: Snippet
	}

	type ButtonProps = BaseProps &
		Omit<HTMLButtonAttributes, keyof BaseProps> & {
			href?: never
		}

	type AnchorProps = BaseProps &
		Omit<HTMLAnchorAttributes, keyof BaseProps | 'rel'> & {
			href: string
		}

	type Props = ButtonProps | AnchorProps

	let {
		variant = 'default',
		size = 'md',
		icon,
		iconPosition = 'left',
		class: className = '',
		children,
		href,
		...restProps
	}: Props = $props()

	const baseStyles =
		'inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full'

	const variantStyles: Record<Variant, string> = {
		default: 'bg-primary text-background hover:bg-primary/90',
		secondary: 'bg-secondary text-foreground hover:bg-secondary/60',
		ghost: 'text-foreground hover:bg-secondary/60',
		'ghost-invert': 'border border-background/20 text-background hover:bg-background/10',
		naked: 'hover:text-primary focus-visible:ring-primary hover:bg-secondary',
		link: 'text-primary underline-offset-4 hover:underline'
	}

	const sizeStyles: Record<Size, string> = {
		xs: 'h-5 gap-0.5 px-1.5 text-[11px]',
		sm: 'h-6 gap-1 px-2 has-[>svg]:px-1.5 text-[12px]',
		md: 'h-8 gap-1 px-3 has-[>svg]:px-2.5 text-[13px]',
		lg: 'h-10 px-6 text-sm'
	}

	const iconSizes: Record<Size, number> = {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18
	}

	let computedClass = $derived(
		`${baseStyles} ${variantStyles[variant]} ${size !== 'sm' || variant !== 'link' ? sizeStyles[size] : ''} ${className}`.trim()
	)

	let iconSize = $derived(iconSizes[size])
</script>

{#if href}
	<Link
		{href}
		variant="unstyled"
		class={computedClass}
		{...(restProps as Omit<HTMLAnchorAttributes, 'href' | 'class' | 'rel'>)}
	>
		{#if icon && iconPosition === 'left'}<ClientIcon {icon} size={iconSize} />{/if}
		{@render children()}
		{#if icon && iconPosition === 'right'}<ClientIcon {icon} size={iconSize} />{/if}
	</Link>
{:else}
	<button
		type="button"
		class={computedClass}
		{...(restProps as Omit<HTMLButtonAttributes, 'class'>)}
	>
		{#if icon && iconPosition === 'left'}<ClientIcon {icon} size={iconSize} />{/if}
		{@render children()}
		{#if icon && iconPosition === 'right'}<ClientIcon {icon} size={iconSize} />{/if}
	</button>
{/if}
