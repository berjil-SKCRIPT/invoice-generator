<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/navs/Navbar.svelte';
	import Footer from '$lib/components/navs/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
>
	Skip to content
</a>

<header>
	<Navbar />
</header>

<main id="main-content" class="pt-(--primary-nav-height)">
	{@render children()}
</main>

<Footer />
