export function detectRegion(): { region: 'IN' | 'INTL'; currency: string; locale: string } {
	if (typeof navigator === 'undefined') return { region: 'INTL', currency: 'USD', locale: 'en-US' };
	const lang = (navigator.language || 'en-US').toLowerCase();
	if (lang.startsWith('en-in') || lang.endsWith('-in')) {
		return { region: 'IN', currency: 'INR', locale: 'en-IN' };
	}
	if (lang.startsWith('en-gb')) return { region: 'INTL', currency: 'GBP', locale: 'en-GB' };
	if (
		lang.startsWith('de') ||
		lang.startsWith('fr') ||
		lang.startsWith('es') ||
		lang.startsWith('it') ||
		lang.startsWith('nl')
	) {
		return { region: 'INTL', currency: 'EUR', locale: navigator.language };
	}
	if (lang.startsWith('ja')) return { region: 'INTL', currency: 'JPY', locale: 'ja-JP' };
	return { region: 'INTL', currency: 'USD', locale: 'en-US' };
}
