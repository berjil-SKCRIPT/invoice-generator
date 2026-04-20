<script lang="ts">
	import { browser } from '$app/environment'
	import Icon from '@iconify/svelte'
	import { HugeiconsIcon } from '@hugeicons/svelte'

	interface Props {
		icon: string | unknown
		size?: number
		class?: string
	}

	let { icon, size = 24, class: className = '' }: Props = $props()
	let isStringIcon = $derived(typeof icon === 'string')
</script>

{#if browser}
	{#if isStringIcon}
		<Icon icon={icon as string} width={size} height={size} class={className} />
	{:else}
		<HugeiconsIcon {icon} size={size} class={className} />
	{/if}
{/if}
