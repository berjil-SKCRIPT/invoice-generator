import { writable } from 'svelte/store';

interface FooterCta {
	title?: string;
	subtitle?: string;
}

export const footerCta = writable<FooterCta>({});
