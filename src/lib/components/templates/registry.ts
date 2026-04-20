import Modern from './Modern.svelte';
import Minimal from './Minimal.svelte';
import Classic from './Classic.svelte';
import Creative from './Creative.svelte';
import Corporate from './Corporate.svelte';
import type { Component } from 'svelte';

export const TEMPLATES: Record<string, Component<any>> = {
	modern: Modern,
	minimal: Minimal,
	classic: Classic,
	creative: Creative,
	corporate: Corporate
};

export const TEMPLATE_LIST = ['modern', 'minimal', 'classic', 'creative', 'corporate'] as const;
