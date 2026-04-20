export type PastedRow = { description: string; quantity: number; rate: number };

export function parseTabular(text: string): PastedRow[] {
	return text
		.split(/\r?\n/)
		.filter((l) => l.trim().length > 0)
		.map((l) => {
			const cells = l.includes('\t') ? l.split('\t') : l.split(',');
			const [desc, qty, rate] = [cells[0] ?? '', cells[1] ?? '0', cells[2] ?? '0'];
			return {
				description: desc.trim(),
				quantity: Number(qty.trim()) || 0,
				rate: Number(rate.trim().replace(/[^0-9.\-]/g, '')) || 0
			};
		});
}
