export type Locale = 'en' | 'es'

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'es']

/** Extract locale from a URL pathname (e.g. /es/alternatives/canny -> 'es') */
export function getLocaleFromPath(pathname: string): Locale {
	const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
	if (match && SUPPORTED_LOCALES.includes(match[1] as Locale)) {
		return match[1] as Locale
	}
	return DEFAULT_LOCALE
}

/** Prefix a path with the locale (no prefix for English) */
export function localePath(path: string, locale: Locale): string {
	if (locale === 'en') return path
	return `/${locale}${path}`
}

/** Conjunction word for joining lists ("and" / "y") */
const CONJUNCTIONS: Record<Locale, string> = { en: ' and ', es: ' y ' }
export function conjunction(locale: Locale): string {
	return CONJUNCTIONS[locale] ?? CONJUNCTIONS.en
}

/** Locale-aware category labels for competitor categories */
const CATEGORY_LABELS_I18N: Record<Locale, Record<string, string>> = {
	en: {
		feedback: 'Feedback & Roadmap',
		'knowledge-base': 'Knowledge Base',
		survey: 'Survey & Forms',
		community: 'Community & Forum',
		'ai-support': 'AI Support',
		changelog: 'Changelog & Updates',
		'bug-tracking': 'Bug Tracking'
	},
	es: {
		feedback: 'Feedback y hoja de ruta',
		'knowledge-base': 'Base de conocimiento',
		survey: 'Encuestas y formularios',
		community: 'Comunidad y foro',
		'ai-support': 'Soporte con IA',
		changelog: 'Changelog y actualizaciones',
		'bug-tracking': 'Seguimiento de errores'
	}
}
export function getCategoryLabel(category: string, locale: Locale): string {
	return CATEGORY_LABELS_I18N[locale]?.[category] ?? CATEGORY_LABELS_I18N.en[category] ?? category
}

/** Language labels for the language switcher */
export const LOCALE_LABELS: Record<Locale, { code: string; label: string; nativeLabel: string }> = {
	en: { code: 'en', label: 'English', nativeLabel: 'English' },
	es: { code: 'es', label: 'Spanish', nativeLabel: 'Español' }
}
