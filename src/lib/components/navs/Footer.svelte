<script lang="ts">
	import Logo from '$lib/components/brand/Logo.svelte'
	import Tooltip from '$lib/components/ui/Tooltip.svelte'
	import Link from '$lib/components/ui/Link.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import Separator from '../ui/Separator.svelte'
	import SiteMeta from '$lib/data/SiteMeta'
	import { signupUrl } from '$lib/utils'
	import { footerCta } from '$lib/stores/footerCta'
	import { breadcrumb } from '$lib/stores/breadcrumb'
	import FooterLinks, { socialLinks } from '$lib/data/FooterLinks'
	import Icon from '@iconify/svelte'
	import ClientIcon from '../ui/ClientIcon.svelte'
	import {
		ArrowUpRight01Icon
	} from '@hugeicons-pro/core-solid-standard'
	import { page } from '$app/stores'
	import { SUPPORTED_LOCALES, LOCALE_LABELS, getLocaleFromPath, localePath } from '$lib/i18n'

	interface Props {
		class?: string
	}

	let { class: className = '' }: Props = $props()

	// Determine current locale and build locale switcher paths
	const currentLocale = $derived(getLocaleFromPath($page.url.pathname))
	const localeLinks = $derived(
		SUPPORTED_LOCALES.map((loc) => {
			// Strip current locale prefix to get the base path
			let basePath = $page.url.pathname
			if (currentLocale !== 'en') {
				basePath = basePath.replace(`/${currentLocale}`, '') || '/'
			}
			return {
				...LOCALE_LABELS[loc],
				href: localePath(basePath, loc),
				active: loc === currentLocale
			}
		})
	)
</script>

<!-- Footer CTA Section -->
<div
	class="container my-4 flex flex-col items-center justify-center gap-4 py-8 md:my-6 md:py-12"
>
	<h2
		class="max-w-2xl text-center text-2xl font-bold md:text-3xl"
	>
		{#if $footerCta.title}
			{$footerCta.title}
		{:else}
			{currentLocale === 'es' ? 'Cada voz escuchada.' : 'Every voice heard.'}<br />{currentLocale === 'es' ? 'Cada función lanzada.' : 'Every feature shipped.'}
		{/if}
	</h2>
	<p class="text-secondary-foreground max-w-xl text-center text-sm">
		{#if $footerCta.subtitle}
			{$footerCta.subtitle}
		{:else}
			{currentLocale === 'es' ? 'Listo para lanzar. Nosotros te ayudamos.' : "You're ready to ship. We're ready to help."}<br />{currentLocale === 'es' ? 'Comienza gratis, sin tarjeta de crédito.' : 'Start free, no credit card required.'}
		{/if}
	</p>
	<div class="flex flex-wrap items-center justify-center gap-2">
		<Button variant="default" href={signupUrl('footer_cta')}>{currentLocale === 'es' ? 'Prueba gratis' : 'Try for free'}</Button>
		<Button variant="secondary" href={SiteMeta.DemoURL}>
			{currentLocale === 'es' ? 'Vélo en acción' : 'See it in action'}
		</Button>
		<Button variant="naked" href="{SiteMeta.siteUrl}/support">
			{currentLocale === 'es' ? 'Chatea con nosotros' : 'Chat with us'}
		</Button>
	</div>
</div>

<!-- Breadcrumb (Apple-style, between CTA and footer) -->
{#if $breadcrumb.length > 0}
	<div class="container">
		<div class="border-t border-border"></div>
		<nav aria-label="Breadcrumb" class="py-4">
			<ol class="flex items-center gap-2 text-xs">
				{#each $breadcrumb as item, i}
					{#if i > 0}
						<li class="text-secondary-foreground" aria-hidden="true">/</li>
					{/if}
					<li>
						{#if item.href && i < $breadcrumb.length - 1}
							<a href={item.href} class="text-secondary-foreground transition-colors hover:text-foreground">{item.label}</a>
						{:else}
							<span class="font-medium text-foreground">{item.label}</span>
						{/if}
					</li>
				{/each}
			</ol>
		</nav>
	</div>
{/if}

<!-- Main Footer -->
<div class="bg-secondary">
	<footer class="container flex flex-col gap-8 py-10 md:py-12 {className}">
		<!-- Footer Links Grid with Logo Column -->
		<div
			class="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-7"
		>
			<!-- Logo + Description Column (hidden on mobile, shown on lg) -->
			<div class="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-2">
				<Link href="/" variant="unstyled" class="flex items-center gap-1">
					<Logo class="h-6 w-6" />
					<Logo variant="full" class="h-auto w-[100px]" />
				</Link>
				<p class="text-secondary-foreground hidden text-xs leading-relaxed lg:block">
					{SiteMeta.siteDescription}
				</p>
				<!-- Social Links -->
				<nav
					class="flex items-center gap-0.5"
					aria-label="Social media links"
				>
					{#each socialLinks as link}
						<Link
							href={link.url}
							variant="unstyled"
							class="text-secondary-foreground hover:text-foreground transition-colors duration-200"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Follow us on {link.name}"
						>
							<Icon icon={link.icon} width={26} height={26} class="p-1" />
						</Link>
					{/each}
				</nav>
			</div>

			<!-- Link Columns -->
			{#each FooterLinks as section, sectionIndex}
				<div class="relative flex flex-col gap-3">
					<h3 class="text-xs font-semibold">{section.title}</h3>
					<ul class="flex flex-col gap-2">
						{#each section.links as link}
							<li class="flex">
								<Link
									href={link.link}
									variant="secondary"
									class="group hover:text-secondary-foreground flex items-center gap-1 text-xs duration-200"
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
								>
									{link.name}
									{#if link.isSelf}
										<Tooltip text="We use FeatureOS to build FeatureOS">
											<Logo class="h-3 w-3 text-primary" />
										</Tooltip>
									{/if}
									{#if link.isNew}
										<span
											class="bg-success/15 text-success rounded-full px-1 py-0 text-[10px] font-medium"
										>
											New
										</span>
									{/if}
									{#if link.isUpdated}
										<span
											class="bg-primary hidden rounded-full px-1 py-0 text-[10px] font-medium text-white sm:inline"
										>
											Updated
										</span>
									{/if}
									{#if link.external && !link.isSelf}
										<ClientIcon
											icon={ArrowUpRight01Icon}
											size={10}
											class="text-primary hidden h-3 w-3 group-hover:block"
										/>
									{/if}
								</Link>
							</li>
						{/each}
					</ul>
					<!-- Vertical divider on mobile between column pairs -->
					{#if sectionIndex % 2 === 0}
						<Separator
							orientation="vertical"
							class="absolute top-0 right-0 h-full sm:hidden"
						/>
					{/if}
				</div>
			{/each}
		</div>

		<Separator />

		<!-- Bottom Bar -->
		<div
			class="flex flex-col items-center justify-between gap-3 text-xs md:flex-row"
		>
			<div class="text-secondary-foreground flex items-center gap-3">
				<span>&copy; 2013 - {new Date().getFullYear()}. Skcript Technology Co.</span>
				<span class="text-border">|</span>
				<Link href="/legal/terms" variant="secondary" class="hover:text-foreground text-xs transition-colors">Terms</Link>
				<Link href="/legal/privacy" variant="secondary" class="hover:text-foreground text-xs transition-colors">Privacy</Link>
				<Link href="/legal/gdpr-compliance" variant="secondary" class="hover:text-foreground text-xs transition-colors">GDPR</Link>
				<Link href="/legal" variant="secondary" class="hover:text-foreground text-xs transition-colors">Legal</Link>
				<span class="text-border">|</span>
				<div class="flex items-center gap-1">
					{#each localeLinks as loc}
						<Link
							href={loc.href}
							variant="unstyled"
							class="rounded px-1.5 py-0.5 text-xs transition-colors {loc.active
								? 'bg-background text-foreground font-medium'
								: 'text-secondary-foreground hover:text-foreground'}"
						>
							{loc.code.toUpperCase()}
						</Link>
					{/each}
				</div>
			</div>
			<Link
				href="{SiteMeta.organization.url}?ref=featureosfooter"
				target="_blank"
				rel="noopener noreferrer"
				variant="unstyled"
				class="text-foreground"
			>
				<svg
					width="572"
					height="90"
					viewBox="0 0 572 90"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="h-3 w-auto"
				>
					<g clip-path="url(#clip0_footer_skcript)">
						<path
							d="M48.4328 2.21594L0 33.6631L7.81335 56.4622L34.9902 51.5716L11.4369 67.0357L19.3069 90L42.5426 87.0434L90 55.8412L82.13 32.8769L57.4346 37.6316L78.648 22.7165L70.8629 0L48.4328 2.21594Z"
							fill="#F10600"
						/>
						<path
							d="M149.048 90C169.065 90 181 85.6212 181 71.9563C181 57.9894 169.065 56.0265 150.559 54.5921L147.462 54.3656C135.301 53.5351 133.262 52.4781 133.262 49.6848C133.262 47.3444 135.603 45.8344 145.196 45.8344C155.393 45.8344 160.303 47.3444 160.303 51.4967H178.734C178.054 39.4927 166.648 33 145.347 33C126.69 33 114.831 38.5868 114.831 49.6848C114.831 61.3113 123.971 66.445 144.743 67.653L147.387 67.804C160.53 68.6344 162.569 69.3139 162.569 72.6358C162.569 75.5046 160.303 77.1656 148.293 77.1656C136.51 77.1656 132.431 74.5232 132.431 70.5974H114C114.68 84.7907 127.219 90 149.048 90Z"
							fill="currentColor"
						/>
						<path
							d="M188 88H205.736V76.7187L217.736 66.5655L234.415 88H256L230.491 55.7354L256 34H229.887L205.736 55.4345V34H188V88Z"
							fill="currentColor"
						/>
						<path
							d="M291.19 90C311.371 90 325.558 80.7139 327 66.6715H308.033C307.122 71.4278 300.597 75.0517 291.19 75.0517C280.492 75.0517 273.588 69.5404 273.588 61.3868C273.588 53.3086 280.492 47.8728 291.19 47.8728C300.597 47.8728 307.122 51.4967 308.033 56.1775H327C325.558 42.2861 311.371 33 291.19 33C269.339 33 255 44.1735 255 61.3868C255 78.751 269.339 90 291.19 90Z"
							fill="currentColor"
						/>
						<path
							d="M334 88H351.625V72.7326H376.15C380.95 72.7326 382.3 74.1616 382.3 78.9749V88H399.925V76.117C399.925 69.4986 395.575 65.5125 388.675 65.0613C395.95 62.8802 400 57.9916 400 50.546C400 39.6407 392.65 34 377.875 34H334V88ZM351.625 58.5933V48.1393H373.675C378.4 48.1393 381.625 48.9666 381.625 53.3287C381.625 57.6908 378.4 58.5933 373.675 58.5933H351.625Z"
							fill="currentColor"
						/>
						<path d="M409 88H427V34H409V88Z" fill="currentColor" />
						<path
							d="M437 88H454.694V74.6128H479.315C492.793 74.6128 501 67.0167 501 54.3064C501 41.5209 492.793 34 479.315 34H437V88ZM454.694 59.7967V48.8914H475.099C480.144 48.8914 482.553 49.8691 482.553 54.3064C482.553 58.7437 480.144 59.7967 475.099 59.7967H454.694Z"
							fill="currentColor"
						/>
						<path
							d="M508 48.8914H531.232V88H548.843V48.8914H572V34H508V48.8914Z"
							fill="currentColor"
						/>
					</g>
					<defs>
						<clipPath id="clip0_footer_skcript">
							<rect width="572" height="90" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</Link>
		</div>
	</footer>
</div>
