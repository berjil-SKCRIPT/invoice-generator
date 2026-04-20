import { error } from '@sveltejs/kit';

const TEMPLATES: Record<string, { title: string; blurb: string }> = {
	modern: {
		title: 'Modern',
		blurb: 'Balanced header, itemized body, clear totals. The default for most invoices.'
	},
	minimal: {
		title: 'Minimal',
		blurb: 'Typographic, quiet, editorial. Distinctive serif heading.'
	},
	classic: {
		title: 'Classic',
		blurb: 'Formal bordered layout. Boardroom-ready, compliance-friendly.'
	},
	creative: {
		title: 'Creative',
		blurb: 'Brand-color gradient band. For agencies, studios, makers.'
	},
	corporate: {
		title: 'Corporate',
		blurb: 'Inverted header, navy total strip. For B2B procurement teams.'
	}
};

export const prerender = true;

export function entries() {
	return Object.keys(TEMPLATES).map((slug) => ({ slug }));
}

export function load({ params }) {
	const t = TEMPLATES[params.slug];
	if (!t) throw error(404, 'Template not found');
	return { slug: params.slug, ...t };
}
