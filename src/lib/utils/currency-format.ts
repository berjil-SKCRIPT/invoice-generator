export function formatMoney(amount: number, currency: string, locale: string): string {
	try {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(amount);
	} catch {
		return `${currency} ${amount.toFixed(2)}`;
	}
}
