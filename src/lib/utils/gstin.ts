const PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function isValidGstin(value: string): boolean {
	if (!PATTERN.test(value)) return false;
	let sum = 0;
	for (let i = 0; i < 14; i++) {
		const v = ALPHA.indexOf(value[i]);
		const factor = i % 2 === 0 ? 1 : 2;
		let prod = v * factor;
		prod = Math.floor(prod / 36) + (prod % 36);
		sum += prod;
	}
	const check = (36 - (sum % 36)) % 36;
	return ALPHA[check] === value[14];
}

export function stateFromGstin(value: string): string | undefined {
	if (!value || value.length < 2) return undefined;
	return value.slice(0, 2);
}
