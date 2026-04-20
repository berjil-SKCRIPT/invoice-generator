export type GstSplit = { cgst: number; sgst: number; igst: number; total: number };

export function splitGst(
	taxable: number,
	ratePct: number,
	fromState: string | undefined,
	toState: string | undefined
): GstSplit {
	const total = taxable * (ratePct / 100);
	const sameState = !!fromState && !!toState && fromState === toState;
	if (sameState) {
		const half = total / 2;
		return { cgst: half, sgst: half, igst: 0, total };
	}
	return { cgst: 0, sgst: 0, igst: total, total };
}
