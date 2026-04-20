import { browser } from '$app/environment';
import type { ZodTypeAny, z } from 'zod';

export class Storage<S extends ZodTypeAny> {
	constructor(
		private key: string,
		private schema: S,
		private fallback: z.infer<S>
	) {}

	read(): z.infer<S> {
		if (!browser) return this.fallback;
		const raw = localStorage.getItem(this.key);
		if (!raw) return this.fallback;
		try {
			const parsed = JSON.parse(raw);
			const result = this.schema.safeParse(parsed);
			if (result.success) return result.data;
			localStorage.removeItem(this.key);
			return this.fallback;
		} catch {
			localStorage.removeItem(this.key);
			return this.fallback;
		}
	}

	write(value: z.infer<S>): void {
		if (!browser) return;
		try {
			localStorage.setItem(this.key, JSON.stringify(value));
		} catch {
			// quota exceeded or private mode; swallow here, UI layer surfaces error
		}
	}

	clear(): void {
		if (!browser) return;
		localStorage.removeItem(this.key);
	}
}
