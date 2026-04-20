import { writable } from 'svelte/store';

export interface ChangelogEntry {
	title: string;
	link: string;
	pubDate: string;
	relativeDate: string;
}

export const changelogEntries = writable<ChangelogEntry[]>([]);
