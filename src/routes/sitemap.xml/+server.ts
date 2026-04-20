export const prerender = true;

const SITE = 'https://featureos.com';

const routes = [
	'/',
	'/gst-invoice-generator',
	'/freelance-invoice-generator',
	'/invoice-template-india',
	'/invoice-template/modern',
	'/invoice-template/minimal',
	'/invoice-template/classic',
	'/invoice-template/creative',
	'/invoice-template/corporate'
];

export function GET() {
	const now = new Date().toISOString().slice(0, 10);
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(r) => `	<url>
		<loc>${SITE}${r}</loc>
		<lastmod>${now}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>${r === '/' ? '1.0' : '0.8'}</priority>
	</url>`
	)
	.join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
