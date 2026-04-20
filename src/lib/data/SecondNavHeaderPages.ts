// Routes that use SecondNavHeader component
const secondNavHeaderRoutes = [
	'/ai',
	'/boards',
	'/release-notes',
	'/forms-and-surveys',
	'/integrations',
	'/knowledge-base',
	'/roadmaps',
	'/ios'
] as const

/**
 * Check if a given path should have SecondNavHeader
 * @param pathname - The pathname to check (should not include query params or hash)
 * @returns true if the path should have SecondNavHeader
 */
export function hasSecondNavHeader(pathname: string | null | undefined): boolean {
	if (!pathname) return false

	// Remove query params and hash if present
	const cleanPath = pathname.split('?')[0].split('#')[0]

	// Check if path matches any of the routes or starts with them
	return secondNavHeaderRoutes.some(
		(route) => cleanPath === route || cleanPath.startsWith(route + '/')
	)
}
