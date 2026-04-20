# FeatureOS Invoice

A free, fast, privacy-first invoice generator for featureos.com. SvelteKit 2 + Svelte 5 runes + Tailwind v4 + TypeScript.

**Stack:** SvelteKit static adapter · Svelte 5 ($state/$derived/$effect) · Tailwind v4 (`@theme`) · Zod · pdfmake (vector PDF) · lz-string (URL-share) · dayjs · nanoid.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | SEO landing — hero + embedded editor + HowTo/FAQ |
| `/gst-invoice-generator` | SEO landing — India GST seed |
| `/freelance-invoice-generator` | SEO landing — hourly, INTL seed |
| `/invoice-template-india` | SEO landing — India templates showcase |
| `/invoice-template/[slug]` | Prerendered template showcase (5 slugs) |
| `/app` | Full editor (noindex) |
| `/share/#<lz>` | Read-only shared invoice (noindex, decoded from URL fragment) |
| `/sitemap.xml` | Auto-generated sitemap |

## Develop

```sh
npm install
npm run dev
```

## Build & verify

```sh
npm run build       # static site -> build/
npm run check       # svelte-check (TypeScript)
npm run test        # vitest unit tests (calc engine)
```

## Deploy

Any static host. The output in `build/` is fully prerendered HTML + a client-side SPA for the editor.

- **Cloudflare Pages:** `build` output directory, build command `npm run build`, framework preset "SvelteKit".
- **Netlify:** publish `build`, build command `npm run build`.
- **Vercel:** framework auto-detects SvelteKit static output.

## Privacy

No backend. No analytics cookies. All state lives in `localStorage` under the `featureos_inv_v1_*` namespace. Share links encode the invoice into the URL fragment (`#`) — never sent to any server.

## License

Proprietary — FeatureOS by Skcript.
# invoice-generator
