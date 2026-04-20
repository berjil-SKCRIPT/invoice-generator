<script lang="ts">
	import { page } from '$app/stores'
	import { afterNavigate } from '$app/navigation'
	import { fade, fly, slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import Logo from '$lib/components/brand/Logo.svelte'
	import SiteMeta from '$lib/data/SiteMeta'
	import { signupUrl } from '$lib/utils'
	import { hasSecondNavHeader } from '$lib/data/SecondNavHeaderPages'
	import Button from '../ui/Button.svelte'
	import { haptic } from '$lib/utils/haptics'
	import Link from '../ui/Link.svelte'
	import ClientIcon from '../ui/ClientIcon.svelte'
	import {
		Cancel01Icon,
		DeliveryBox01Icon,
		Menu01Icon,
		MessageAdd01Icon,
		Route03Icon
	} from '@hugeicons-pro/core-solid-standard'
	import { changelogEntries } from '$lib/stores/changelog'

	let clEntries = $derived($changelogEntries)
	let clIndex = $state(0)
	let clFlipping = $state(false)
	let prefersReducedMotion = $state(false)

	function stripEmoji(text: string): string {
		return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
	}

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		prefersReducedMotion = mq.matches
		const handler = (e: MediaQueryListEvent) => { prefersReducedMotion = e.matches }
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	})

	$effect(() => {
		if (clEntries.length <= 1 || prefersReducedMotion) return
		const interval = setInterval(() => {
			clFlipping = true
			setTimeout(() => {
				clIndex = (clIndex + 1) % clEntries.length
				clFlipping = false
			}, 300)
		}, 3500)
		return () => clearInterval(interval)
	})

	let clCurrent = $derived(clEntries[clIndex])
	let clMonthCount = $derived(() => {
		const now = new Date()
		return clEntries.filter((e) => {
			const d = new Date(e.pubDate)
			return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
		}).length
	})

	interface Props {
		hideOnPrint?: boolean
	}

	let { hideOnPrint = false }: Props = $props()

	let mobileMenuOpen = $state(false)
	let isScrolled = $state(false)
	let featuresOpen = $state(false)
	let featuresCloseTimeout: ReturnType<typeof setTimeout> | null = null

	// Check if current page has a secondary nav header
	let hasSecondNav = $derived(hasSecondNavHeader($page.url.pathname))

	function openFeatures() {
		if (featuresCloseTimeout) {
			clearTimeout(featuresCloseTimeout)
			featuresCloseTimeout = null
		}
		featuresOpen = true
	}

	function closeFeatures() {
		featuresCloseTimeout = setTimeout(() => {
			featuresOpen = false
		}, 150)
	}

	const NAVIGATION_LINKS = [
		{ name: 'Pricing', href: '/pricing' },
		{ name: 'Book a demo', href: '/request-demo' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Customers', href: '/customers' }
	]

	const FEATURE_GROUPS = [
		{
			name: 'Capture',
			icon: MessageAdd01Icon,
			items: [
				{
					title: 'Feedback Boards',
					href: '/boards',
					description: 'Capture every idea, effortlessly.'
				},
				{
					title: 'Forms and Surveys',
					href: '/forms-and-surveys',
					description: 'Collect data. Effortlessly.'
				}
			]
		},
		{
			name: 'Plan',
			icon: Route03Icon,
			items: [
				{
					title: 'Roadmap',
					href: '/roadmaps',
					description: 'Roadmaps. Simplified.'
				},
				{
					title: 'AI Features',
					href: '/ai',
					description: 'AI for product teams.'
				}
			]
		},
		{
			name: 'Ship',
			icon: DeliveryBox01Icon,
			items: [
				{
					title: 'Knowledge Base',
					href: '/knowledge-base',
					description: 'Self-service help center + AI.'
				},
				{
					title: 'Release Notes',
					href: '/release-notes',
					description: 'Sharing updates on releases.'
				}
			]
		}
	]

	const STANDALONE_FEATURES = [
		{
			title: 'All Features',
			href: '/features',
			description: 'Skim through all the features we ship every week to improve FeatureOS for you.'
		},
		{
			title: 'Integrations',
			href: '/integrations',
			description:
				'Connect with your favorite tools and build workflows that gives you the edge at work.'
		}
	]

	const ALL_FEATURES = [...FEATURE_GROUPS.flatMap((group) => group.items), ...STANDALONE_FEATURES]

	function isRouteActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/')
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen
	}

	function closeMobileMenu() {
		mobileMenuOpen = false
	}

	$effect(() => {
		function handleScroll() {
			isScrolled = window.scrollY > 10
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	})

	afterNavigate(() => {
		mobileMenuOpen = false
	})

	// Adjust nav height when ticker is present
	$effect(() => {
		if (clEntries.length > 0) {
			document.documentElement.style.setProperty('--primary-nav-height', '4.75rem')
		} else {
			document.documentElement.style.setProperty('--primary-nav-height', '3rem')
		}
	})

	$effect(() => {
		// Prevent body scroll when mobile menu is open
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	})
</script>

<div
	class="{hasSecondNav
		? 'relative'
		: 'fixed top-0 right-0 left-0'} isolate z-50 mx-auto w-full {hideOnPrint ? 'print:hidden' : ''}"
>
	<nav
		class="mx-auto w-full border-b border-transparent transition-colors duration-300 {isScrolled
			? 'border-border'
			: ''}"
	>
		<div
			class="absolute inset-0 -z-10 bg-background/60 backdrop-blur-md transition-all duration-300 {isScrolled
				? 'bg-background/80 shadow-sm'
				: ''}"
		></div>

		<div class="container flex h-12 w-full items-center justify-between">
			<!-- Logo Area -->
			<div class="flex shrink-0 items-center gap-3">
				<div class="flex h-10 items-center p-1">
					<Link
						href="/"
						variant="unstyled"
						class="flex items-center gap-x-2 rounded-md px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						<Logo class="h-8 w-8 transition-all duration-200 hover:text-primary" />
						<span class="sr-only">Go to homepage</span>
					</Link>
				</div>

				<!-- Pipe Separator -->
				<div class="hidden h-4 w-px bg-border md:block"></div>

				<!-- Desktop Menu -->
				<div class="navlinks hidden h-10 list-none items-center gap-1 px-2 md:flex">
					<!-- Features Dropdown -->
					<div
						class="relative"
						role="navigation"
						onmouseenter={openFeatures}
						onmouseleave={closeFeatures}
					>
						<button
							class="flex h-auto cursor-pointer items-center justify-between gap-1 rounded-full px-4 py-2.5 text-xs leading-none font-medium text-foreground/70 transition-all duration-200 outline-none select-none hover:bg-secondary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 {featuresOpen
								? 'bg-secondary/30'
								: ''}"
							aria-expanded={featuresOpen}
							aria-haspopup="true"
						>
							Features
							<svg
								class="h-3 w-3 transition-transform duration-200 {featuresOpen
									? 'rotate-180'
									: ''}"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						<!-- Dropdown Content with Fitts's Law safe zone -->
						{#if featuresOpen}
							<!-- Invisible hover bridge - prevents diagonal movement from closing dropdown -->
							<div class="absolute top-full left-0 h-3 w-full"></div>
							<div
								class="absolute top-full left-0 z-50 mt-3 w-[750px] rounded-xl border bg-background shadow-lg"
								transition:fly={{ y: -8, duration: 200, easing: cubicOut }}
							>
								<div class="p-4">
									<!-- Grouped features -->
									<div class="grid grid-cols-3 items-stretch gap-3">
										{#each FEATURE_GROUPS as group, gi}
											<div
												class="dropdown-stagger flex h-full flex-col space-y-2 rounded-lg bg-secondary/50 p-3 transition-colors duration-200 hover:bg-secondary/70"
												style:--stagger-delay="{gi * 50}ms"
											>
												<h3
													class="flex items-center gap-1.5 px-3 text-xs font-semibold tracking-wider text-secondary-foreground uppercase"
												>
													<ClientIcon icon={group.icon} size={14} class="text-foreground/70" />
													{group.name}
												</h3>
												<ul class="list-none space-y-1">
													{#each group.items as link}
														<li>
															<Link
																href={link.href}
																variant="unstyled"
																class="group block rounded-md px-3 py-3 text-sm leading-none no-underline transition-all duration-200 hover:bg-secondary/50 {isRouteActive(
																	link.href
																)
																	? 'bg-secondary/50'
																	: ''}"
															>
																<div
																	class="leading-tight font-semibold transition-all duration-200 group-hover:text-foreground"
																>
																	{link.title}
																</div>
																<p
																	class="mt-1 text-xs leading-relaxed text-secondary-foreground transition-colors duration-200 group-hover:text-foreground/80"
																>
																	{link.description}
																</p>
															</Link>
														</li>
													{/each}
												</ul>
											</div>
										{/each}
									</div>

									<!-- Separator -->
									<div class="my-4 border-t border-border"></div>

									<!-- Standalone links - Full-width hit areas -->
									<ul class="grid list-none grid-cols-2 items-stretch gap-2">
										{#each STANDALONE_FEATURES as link, si}
											<li class="h-full dropdown-stagger" style:--stagger-delay="{(si + 3) * 50}ms">
												<Link
													href={link.href}
													variant="unstyled"
													class="group block h-full rounded-md px-4 py-3 text-sm leading-none no-underline transition-all duration-200 hover:bg-secondary/50 {isRouteActive(
														link.href
													)
														? 'bg-secondary/50'
														: ''}"
												>
													<div
														class="leading-tight font-semibold transition-all duration-200 group-hover:text-foreground"
													>
														{link.title}
													</div>
													<p
														class="mt-1 text-xs leading-relaxed text-secondary-foreground transition-colors duration-200 group-hover:text-foreground/80"
													>
														{link.description}
													</p>
												</Link>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						{/if}
					</div>

					<!-- Navigation Links - Larger hit areas per Fitts's Law -->
					{#each NAVIGATION_LINKS as item}
						<Link
							href={item.href}
							variant="unstyled"
							class="block rounded-full px-4 py-2.5 text-xs leading-none font-medium text-foreground/70 no-underline transition-all duration-200 hover:bg-secondary/50 hover:text-foreground {isRouteActive(
								item.href
							)
								? 'bg-secondary/50 font-semibold text-foreground'
								: ''}"
						>
							{item.name}
						</Link>
					{/each}
				</div>
			</div>

			<!-- Right Side Actions -->
			<div class="flex shrink items-center justify-end gap-x-2">
				<div class="hidden h-10 items-center gap-x-2 p-1 md:flex">
					<Button variant="naked" size="sm" href={SiteMeta.SigninURL} onclick={() => haptic.trigger('light')}>Sign in</Button>
					<Button variant="default" size="sm" href={signupUrl('navbar')} onclick={() => haptic.trigger('medium')}>Sign up</Button>
				</div>

				<!-- Mobile Menu Button -->
				<div class="flex md:hidden">
					<button
						class="flex h-8 cursor-pointer items-center rounded-full border border-border bg-background/80 p-2 shadow-sm backdrop-blur-md transition-all duration-200 outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
						aria-label="Toggle mobile menu"
						aria-expanded={mobileMenuOpen}
						onclick={toggleMobileMenu}
					>
						<div class="relative h-4 w-4">
							<div
								class="absolute inset-0 flex items-center justify-center transition-all duration-300 {mobileMenuOpen
									? 'scale-0 rotate-90 opacity-0'
									: 'scale-100 rotate-0 opacity-100'}"
							>
								<ClientIcon icon={Menu01Icon} size={16} />
							</div>
							<div
								class="absolute inset-0 flex items-center justify-center transition-all duration-300 {mobileMenuOpen
									? 'scale-100 rotate-0 opacity-100'
									: 'scale-0 -rotate-90 opacity-0'}"
							>
								<ClientIcon icon={Cancel01Icon} size={16} />
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Changelog Ticker -->
	{#if clEntries.length > 0 && clCurrent}
		<div class="overflow-hidden bg-foreground">
			<div class="container flex items-stretch">
				<!-- Fixed left badge -->
				<div class="flex shrink-0 items-center gap-2 border-r border-background/10 pr-4 py-1.5 md:pr-5">
					<span class="relative flex h-1.5 w-1.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
						<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-success"></span>
					</span>
					<span class="hidden font-mono text-[10px] font-bold tracking-wider text-background/60 uppercase sm:inline">
						{clMonthCount()} shipped this month
					</span>
				</div>

				<!-- Flipping entry -->
				<Link
					href={clCurrent.link}
					variant="unstyled"
					class="flex min-w-0 flex-1 items-center justify-center gap-2.5 px-4 py-1.5 transition-colors duration-150 hover:bg-background/[0.03] md:px-5"
				>
					<span class="shrink-0 font-mono text-[10px] font-bold tracking-wider uppercase {clIndex === 0 ? 'text-success' : 'text-primary'}">
						{clIndex === 0 ? 'New' : 'Live'}
					</span>
					<span
						class="nav-ticker-text min-w-0 truncate text-xs font-medium text-background/80"
						class:is-flipping={clFlipping}
					>
						{stripEmoji(clCurrent.title)}
					</span>
					<span class="shrink-0 font-mono text-[10px] text-background/30">
						{clCurrent.relativeDate}
					</span>
				</Link>

				<!-- Progress dots -->
				<div class="hidden shrink-0 items-center gap-1 border-l border-background/10 pl-4 md:flex">
					{#each clEntries as _, i}
						<span
							class="h-1 rounded-full transition-all duration-300 {i === clIndex ? 'w-3 bg-primary' : 'w-1 bg-background/15'}"
						></span>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
	<div
		class="fixed inset-0 z-[1001] bg-foreground/40"
		transition:fade={{ duration: 200 }}
		onclick={closeMobileMenu}
		onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
		role="button"
		tabindex="-1"
		aria-label="Close menu"
	></div>

	<div
		class="fixed inset-x-0 bottom-0 z-[1002] flex h-[50vh] flex-col rounded-t-[10px] border-t bg-background"
		transition:slide={{ duration: 300, easing: cubicOut }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-border px-6 py-4">
			<span class="text-sm font-medium text-secondary-foreground">Menu</span>
			<button
				class="cursor-pointer rounded-full p-2 transition-colors outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				onclick={closeMobileMenu}
				aria-label="Close menu"
			>
				<ClientIcon icon={Cancel01Icon} size={16} />
			</button>
		</div>

		<!-- Scrollable content -->
		<div class="flex-1 overflow-y-auto">
			<div class="space-y-6 px-6 py-4">
				<!-- Features section -->
				<div class="space-y-3">
					<h3 class="px-3 text-xs font-semibold tracking-wider text-secondary-foreground uppercase">
						Features
					</h3>
					<div class="space-y-1">
						{#each ALL_FEATURES as link, mi}
							<div class="mobile-menu-item" style:--stagger-delay="{mi * 40}ms">
								<Link
									href={link.href}
									variant="unstyled"
									class="group flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 hover:opacity-70 {isRouteActive(
										link.href
									)
										? 'bg-secondary/50 font-semibold'
										: ''}"
									onclick={closeMobileMenu}
								>
									<span class="group-hover:text-foreground">{link.title}</span>
									<svg class="h-4 w-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</Link>
							</div>
						{/each}
					</div>
				</div>

				<!-- Navigation links section -->
				<div class="space-y-3">
					<h3 class="px-3 text-xs font-semibold tracking-wider text-secondary-foreground uppercase">
						Navigation
					</h3>
					<div class="space-y-1">
						{#each NAVIGATION_LINKS as item, ni}
							<div class="mobile-menu-item" style:--stagger-delay="{(ni + 8) * 40}ms">
								<Link
									href={item.href}
									variant="unstyled"
									class="group flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 hover:opacity-70 {isRouteActive(
										item.href
									)
										? 'bg-secondary/50 font-semibold'
										: ''}"
									onclick={closeMobileMenu}
								>
									<span class="group-hover:text-foreground">{item.name}</span>
									<svg class="h-4 w-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</Link>
							</div>
						{/each}
					</div>
				</div>

				<!-- Actions section -->
				<div class="space-y-3 border-t border-border pt-2">
					<div class="space-y-2">
						<Button variant="naked" size="sm" href={SiteMeta.SigninURL} class="w-full rounded-lg" onclick={() => haptic.trigger('light')}>
							Sign in
						</Button>
						<Button variant="default" size="sm" href={signupUrl('navbar_mobile')} class="w-full rounded-lg" onclick={() => haptic.trigger('medium')}>
							Sign up
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.dropdown-stagger {
		animation: dropdown-fade-in 200ms cubic-bezier(0.32, 0.72, 0, 1) backwards;
		animation-delay: var(--stagger-delay, 0ms);
	}

	.mobile-menu-item {
		animation: mobile-item-in 200ms cubic-bezier(0.32, 0.72, 0, 1) backwards;
		animation-delay: var(--stagger-delay, 0ms);
	}

	@keyframes dropdown-fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes mobile-item-in {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Ticker flip */
	.nav-ticker-text {
		transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1),
			opacity 300ms cubic-bezier(0.32, 0.72, 0, 1);
		transform: translateY(0);
		opacity: 1;
	}

	.nav-ticker-text.is-flipping {
		transform: translateY(-100%);
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.dropdown-stagger,
		.mobile-menu-item,
		.nav-ticker-text {
			animation: none;
			transition: none;
		}
	}
</style>
