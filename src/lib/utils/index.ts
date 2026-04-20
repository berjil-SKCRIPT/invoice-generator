import SiteMeta from '$lib/data/SiteMeta';

/**
 * Build a signup URL with UTM parameters for tracking.
 * @param medium - identifies the page/section (e.g. 'home_hero', 'pricing', 'navbar')
 * @param extra - additional query params (e.g. { plan: 'starter' })
 */
export function signupUrl(medium: string, extra?: Record<string, string>): string {
	const url = new URL(SiteMeta.SignupURL);
	url.searchParams.set('utm_source', 'featureos_website');
	url.searchParams.set('utm_medium', medium);
	if (extra) {
		for (const [key, value] of Object.entries(extra)) {
			url.searchParams.set(key, value);
		}
	}
	return url.toString();
}
