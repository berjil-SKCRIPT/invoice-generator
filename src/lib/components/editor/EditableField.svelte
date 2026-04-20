<script lang="ts">
	type Props = {
		value: string;
		placeholder?: string;
		multiline?: boolean;
		class?: string;
		align?: 'left' | 'right' | 'center';
		onchange: (v: string) => void;
		onfocus?: () => void;
	};
	let {
		value,
		placeholder = '',
		multiline = false,
		class: cls = '',
		align = 'left',
		onchange,
		onfocus
	}: Props = $props();

	let el: HTMLElement | undefined = $state();

	$effect(() => {
		if (el && el.innerText !== value) {
			el.innerText = value;
		}
	});

	function handleInput() {
		if (!el) return;
		onchange(el.innerText);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!multiline && e.key === 'Enter') {
			e.preventDefault();
			(e.target as HTMLElement).blur();
		}
	}
</script>

<span
	bind:this={el}
	role="textbox"
	tabindex="0"
	contenteditable="plaintext-only"
	data-placeholder={placeholder}
	class="editable-field outline-none rounded-md px-1 -mx-1 py-0.5 hover:bg-secondary/50 focus:bg-secondary/40 focus:ring-2 focus:ring-primary/40 transition-colors {cls}"
	style="text-align: {align};"
	oninput={handleInput}
	onkeydown={handleKeydown}
	onfocus={() => onfocus?.()}
></span>

<style>
	.editable-field:empty::before {
		content: attr(data-placeholder);
		color: var(--secondary-foreground);
		pointer-events: none;
	}
</style>
