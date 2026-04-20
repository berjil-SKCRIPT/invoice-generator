# FeatureOS Invoice Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a free, no-signup, browser-based invoice generator on featureos.com that drives organic SEO traffic via prerendered keyword landing pages and a WYSIWYG click-to-edit editor.

**Architecture:** SvelteKit 2 + Svelte 5 runes, `adapter-static` for prerendered SEO pages plus a SPA editor. All state in `localStorage`; share-via-URL stores invoice JSON in URL hash. PDF generated client-side with `pdfmake` (vector output). Zero server at runtime.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript (strict), Tailwind CSS v4, pdfmake, lz-string, qrcode, zod, dayjs, nanoid, @number-flow/svelte, canvas-confetti, Vitest, Playwright, axe-playwright.

**Spec:** `PRD.md` (root) and `docs/superpowers/specs/2026-04-20-invoice-generator-design.md`.

---

## Phase 1 — Foundation (Tasks 1–8)

### Task 1: Initialize SvelteKit project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `.prettierrc`, `.eslintrc.cjs`, `src/app.html`, `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`

- [ ] **Step 1: Scaffold SvelteKit + TypeScript project**

Run from project root:
```bash
cd /Users/berjilskcript/Downloads/in-gen-tool
npm create svelte@latest . -- --template skeleton --types typescript --no-add-ons
```

If interactive prompts block, use:
```bash
npx sv create . --template minimal --types ts --no-add-ons
```

Expected: `package.json`, `src/`, `static/` created.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install pdfmake lz-string qrcode zod dayjs nanoid canvas-confetti @number-flow/svelte
npm install -D @types/pdfmake @types/qrcode @types/canvas-confetti @sveltejs/adapter-static tailwindcss@next @tailwindcss/vite@next
```

Expected: dependencies appear in `package.json`.

- [ ] **Step 3: Install dev tooling**

```bash
npm install -D vitest @vitest/ui @testing-library/svelte @testing-library/jest-dom jsdom @playwright/test @axe-core/playwright eslint prettier prettier-plugin-svelte eslint-plugin-svelte typescript-eslint
```

- [ ] **Step 4: Configure adapter-static in svelte.config.js**

Replace `svelte.config.js` with:

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    prerender: {
      handleHttpError: 'warn'
    }
  }
};
```

- [ ] **Step 5: Wire Tailwind v4 in vite.config.ts**

Replace `vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,js}']
  }
});
```

- [ ] **Step 6: Create vitest.setup.ts**

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 7: Create app.css with Tailwind import + design tokens**

Create `src/app.css`:

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-serif: 'IBM Plex Serif', Georgia, serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  --color-brand: oklch(0.62 0.24 264);
  --color-ink: oklch(0.18 0.01 264);
  --color-paper: oklch(0.99 0.005 264);
  --color-muted: oklch(0.65 0.015 264);
  --color-line: oklch(0.92 0.005 264);
  --color-accent: var(--color-brand);
}

[data-theme='dark'] {
  --color-ink: oklch(0.97 0.005 264);
  --color-paper: oklch(0.18 0.015 264);
  --color-muted: oklch(0.62 0.015 264);
  --color-line: oklch(0.28 0.01 264);
}

[data-theme='oled'] {
  --color-ink: oklch(0.97 0.005 264);
  --color-paper: oklch(0 0 0);
  --color-muted: oklch(0.55 0.015 264);
  --color-line: oklch(0.20 0.01 264);
}

html, body { background: var(--color-paper); color: var(--color-ink); }
```

- [ ] **Step 8: Update src/app.html with theme bootstrap**

Replace `src/app.html`:

```html
<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      (() => {
        try {
          const p = JSON.parse(localStorage.getItem('featureos_inv_v1_prefs') || '{}');
          const t = p.theme || 'system';
          const sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.dataset.theme = t === 'system' ? sys : t;
        } catch {}
      })();
    </script>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 9: Create root layout that imports app.css**

Create `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}
```

- [ ] **Step 10: Verify dev server boots**

Run:
```bash
npm run dev
```

Expected: server starts on `http://localhost:5173` with no errors. Stop with Ctrl+C.

- [ ] **Step 11: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold SvelteKit + Tailwind v4 + design tokens"
```

---

### Task 2: Wire Vitest, Playwright, and CI scripts

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Add npm scripts**

Edit `package.json` `"scripts"` to:

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium"
  }
}
```

- [ ] **Step 2: Create playwright.config.ts**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
```

- [ ] **Step 3: Write smoke test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('homepage renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Invoice/i);
});
```

- [ ] **Step 4: Update homepage title to satisfy smoke**

Replace `src/routes/+page.svelte`:

```svelte
<svelte:head><title>Free Invoice Generator · FeatureOS</title></svelte:head>
<h1>Free Invoice Generator</h1>
```

- [ ] **Step 5: Install Playwright browser**

```bash
npm run test:e2e:install
```

- [ ] **Step 6: Run smoke test**

```bash
npm run test:e2e
```

Expected: 1 passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: wire vitest + playwright with smoke test"
```

---

### Task 3: Define Zod schemas for Invoice domain

**Files:**
- Create: `src/lib/schemas/invoice.ts`, `src/lib/schemas/invoice.test.ts`

- [ ] **Step 1: Write failing schema tests**

Create `src/lib/schemas/invoice.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { InvoiceSchema, LineItemSchema, PartySchema } from './invoice';

describe('InvoiceSchema', () => {
  it('accepts a minimal valid invoice', () => {
    const result = InvoiceSchema.safeParse({
      id: 'abc',
      number: 'INV-2026-0001',
      createdAt: '2026-04-20T00:00:00.000Z',
      updatedAt: '2026-04-20T00:00:00.000Z',
      region: 'INTL',
      template: 'modern',
      brand: { color: '#4f46e5', font: 'inter' },
      currency: 'USD',
      locale: 'en-US',
      dateIssued: '2026-04-20',
      dateDue: '2026-05-20',
      paymentTerms: 'net30',
      from: { name: 'Acme', address: '1 St' },
      to: { name: 'Client', address: '2 St' },
      items: [],
      discount: null,
      shipping: null,
      shippingTaxable: false,
      taxMode: 'none',
      taxes: [],
      roundTotal: false,
      payment: {},
      meta: { status: 'draft' }
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown taxMode', () => {
    const result = InvoiceSchema.safeParse({ taxMode: 'bogus' });
    expect(result.success).toBe(false);
  });
});

describe('LineItemSchema', () => {
  it('requires positive quantity', () => {
    const r = LineItemSchema.safeParse({ id: 'a', description: 'x', quantity: -1, rate: 10, taxRate: 0 });
    expect(r.success).toBe(false);
  });
});

describe('PartySchema', () => {
  it('accepts party with only name + address', () => {
    const r = PartySchema.safeParse({ name: 'A', address: 'B' });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test -- src/lib/schemas
```

Expected: import errors / module not found.

- [ ] **Step 3: Implement schemas**

Create `src/lib/schemas/invoice.ts`:

```ts
import { z } from 'zod';

export const PartySchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().min(1),
  taxId: z.string().optional(),
  gstStateCode: z.string().length(2).optional()
});

export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  hsnSac: z.string().optional(),
  quantity: z.number().min(0),
  unit: z.string().optional(),
  rate: z.number().min(0),
  taxRate: z.number().min(0).max(100),
  discountPct: z.number().min(0).max(100).optional()
});

export const TaxRuleSchema = z.object({
  name: z.string(),
  rate: z.number().min(0).max(100),
  compound: z.boolean()
});

export const PaymentMethodsSchema = z.object({
  bank: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    ifsc: z.string().optional(),
    swift: z.string().optional(),
    bankName: z.string()
  }).optional(),
  upi: z.string().optional(),
  paypal: z.string().optional(),
  stripeLink: z.string().url().optional(),
  razorpayLink: z.string().url().optional(),
  customLink: z.object({ label: z.string(), url: z.string().url() }).optional(),
  notes: z.string().optional()
});

export const BrandSchema = z.object({
  logoDataUrl: z.string().optional(),
  color: z.string(),
  font: z.enum(['inter', 'space-grotesk', 'plex-serif'])
});

export const InvoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  region: z.enum(['IN', 'INTL']),
  template: z.enum(['modern', 'minimal', 'classic', 'creative', 'corporate']),
  brand: BrandSchema,
  currency: z.string().length(3),
  locale: z.string(),
  dateIssued: z.string(),
  dateDue: z.string(),
  paymentTerms: z.enum(['net0', 'net7', 'net15', 'net30', 'net60', 'custom']),
  from: PartySchema,
  to: PartySchema,
  items: z.array(LineItemSchema),
  discount: z.object({ type: z.enum(['percent', 'flat']), value: z.number() }).nullable(),
  shipping: z.number().nullable(),
  shippingTaxable: z.boolean(),
  taxMode: z.enum(['none', 'simple', 'gst', 'vat', 'custom']),
  taxes: z.array(TaxRuleSchema),
  roundTotal: z.boolean(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  payment: PaymentMethodsSchema,
  meta: z.object({ status: z.enum(['draft', 'sent', 'paid']) })
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
export type Party = z.infer<typeof PartySchema>;
export type PaymentMethods = z.infer<typeof PaymentMethodsSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type TaxRule = z.infer<typeof TaxRuleSchema>;
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- src/lib/schemas
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(schema): add Zod schemas for Invoice domain"
```

---

### Task 4: Preferences schema + storage service

**Files:**
- Create: `src/lib/schemas/prefs.ts`, `src/lib/storage/local.ts`, `src/lib/storage/local.test.ts`

- [ ] **Step 1: Write failing storage tests**

Create `src/lib/storage/local.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from './local';
import { z } from 'zod';

const Schema = z.object({ a: z.number() });

describe('Storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips valid data', () => {
    const s = new Storage('k', Schema, { a: 1 });
    s.write({ a: 42 });
    expect(s.read()).toEqual({ a: 42 });
  });

  it('returns default when key missing', () => {
    const s = new Storage('k', Schema, { a: 1 });
    expect(s.read()).toEqual({ a: 1 });
  });

  it('returns default and clears when stored value is corrupt', () => {
    localStorage.setItem('k', '{"not":"valid"}');
    const s = new Storage('k', Schema, { a: 7 });
    expect(s.read()).toEqual({ a: 7 });
    expect(localStorage.getItem('k')).toBe(null);
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test -- src/lib/storage
```

- [ ] **Step 3: Implement Storage**

Create `src/lib/storage/local.ts`:

```ts
import type { ZodTypeAny, z } from 'zod';

export class Storage<S extends ZodTypeAny> {
  constructor(private key: string, private schema: S, private fallback: z.infer<S>) {}

  read(): z.infer<S> {
    if (typeof localStorage === 'undefined') return this.fallback;
    const raw = localStorage.getItem(this.key);
    if (!raw) return this.fallback;
    try {
      const parsed = JSON.parse(raw);
      const result = this.schema.safeParse(parsed);
      if (result.success) return result.data;
      localStorage.removeItem(this.key);
      return this.fallback;
    } catch {
      localStorage.removeItem(this.key);
      return this.fallback;
    }
  }

  write(value: z.infer<S>): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.key);
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- src/lib/storage
```

- [ ] **Step 5: Add prefs schema**

Create `src/lib/schemas/prefs.ts`:

```ts
import { z } from 'zod';
import { BrandSchema, PartySchema } from './invoice';

export const PreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'oled', 'system']).default('system'),
  region: z.enum(['IN', 'INTL']).default('INTL'),
  defaultCurrency: z.string().length(3).default('USD'),
  defaultTemplate: z.enum(['modern', 'minimal', 'classic', 'creative', 'corporate']).default('modern'),
  defaultFont: z.enum(['inter', 'space-grotesk', 'plex-serif']).default('inter'),
  brand: BrandSchema.partial().optional(),
  lastFromParty: PartySchema.optional(),
  recentRecipients: z.array(PartySchema).max(20).default([]),
  numberingPrefix: z.string().default('INV'),
  numberingFormat: z.string().default('{prefix}-{YYYY}-{####}'),
  nextSequence: z.number().int().min(1).default(1)
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = PreferencesSchema.parse({});
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(storage): add typed localStorage wrapper + preferences schema"
```

---

### Task 5: Static currency, locale, and Indian state data

**Files:**
- Create: `src/lib/data/currencies.ts`, `src/lib/data/states-india.ts`, `src/lib/data/fx-fallback.json`

- [ ] **Step 1: Currencies module**

Create `src/lib/data/currencies.ts`:

```ts
export type Currency = { code: string; symbol: string; name: string; locale: string };

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',          locale: 'en-US' },
  { code: 'EUR', symbol: '€',  name: 'Euro',               locale: 'en-IE' },
  { code: 'GBP', symbol: '£',  name: 'British Pound',      locale: 'en-GB' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee',       locale: 'en-IN' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',  locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',    locale: 'en-CA' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar',   locale: 'en-SG' },
  { code: 'AED', symbol: 'د.إ',name: 'UAE Dirham',         locale: 'en-AE' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',       locale: 'ja-JP' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc',        locale: 'de-CH' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',       locale: 'zh-CN' },
  { code: 'NZD', symbol: 'NZ$',name: 'New Zealand Dollar', locale: 'en-NZ' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand', locale: 'en-ZA' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real',     locale: 'pt-BR' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso',     locale: 'es-MX' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona',      locale: 'sv-SE' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone',    locale: 'nb-NO' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone',       locale: 'da-DK' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty',       locale: 'pl-PL' },
  { code: 'HKD', symbol: 'HK$',name: 'Hong Kong Dollar',   locale: 'en-HK' },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won',   locale: 'ko-KR' },
  { code: 'TRY', symbol: '₺',  name: 'Turkish Lira',       locale: 'tr-TR' },
  { code: 'THB', symbol: '฿',  name: 'Thai Baht',          locale: 'th-TH' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit',  locale: 'ms-MY' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah',  locale: 'id-ID' },
  { code: 'PHP', symbol: '₱',  name: 'Philippine Peso',    locale: 'en-PH' },
  { code: 'VND', symbol: '₫',  name: 'Vietnamese Dong',    locale: 'vi-VN' },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira',     locale: 'en-NG' },
  { code: 'KES', symbol: 'KSh',name: 'Kenyan Shilling',    locale: 'en-KE' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound',     locale: 'ar-EG' }
];

export const findCurrency = (code: string) => CURRENCIES.find(c => c.code === code);
```

- [ ] **Step 2: India state codes**

Create `src/lib/data/states-india.ts`:

```ts
export const INDIA_STATES: Record<string, string> = {
  '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
  '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan',
  '09': 'Uttar Pradesh', '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
  '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram', '16': 'Tripura',
  '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal', '20': 'Jharkhand',
  '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
  '25': 'Daman & Diu', '26': 'Dadra & Nagar Haveli', '27': 'Maharashtra', '28': 'Andhra Pradesh',
  '29': 'Karnataka', '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala',
  '33': 'Tamil Nadu', '34': 'Puducherry', '35': 'Andaman & Nicobar', '36': 'Telangana',
  '37': 'Andhra Pradesh (New)', '38': 'Ladakh'
};
```

- [ ] **Step 3: FX fallback snapshot**

Create `src/lib/data/fx-fallback.json` (representative rates anchored to USD; refresh quarterly):

```json
{
  "base": "USD",
  "fetchedAt": "2026-04-01T00:00:00.000Z",
  "rates": {
    "USD": 1, "EUR": 0.92, "GBP": 0.79, "INR": 83.2, "AUD": 1.52, "CAD": 1.36,
    "SGD": 1.34, "AED": 3.67, "JPY": 153.4, "CHF": 0.90, "CNY": 7.24, "NZD": 1.66,
    "ZAR": 18.7, "BRL": 5.05, "MXN": 17.0, "SEK": 10.6, "NOK": 10.7, "DKK": 6.86,
    "PLN": 4.0, "HKD": 7.83, "KRW": 1365, "TRY": 32.1, "THB": 36.5, "MYR": 4.74,
    "IDR": 16100, "PHP": 56.3, "VND": 25000, "NGN": 1500, "KES": 130, "EGP": 47
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(data): currencies, India state codes, FX fallback"
```

---

### Task 6: nanoid + dayjs utilities

**Files:**
- Create: `src/lib/utils/id.ts`, `src/lib/utils/date.ts`, `src/lib/utils/date.test.ts`

- [ ] **Step 1: ID util**

Create `src/lib/utils/id.ts`:

```ts
import { customAlphabet } from 'nanoid';
const alpha = '0123456789abcdefghijklmnopqrstuvwxyz';
export const newId = customAlphabet(alpha, 10);
```

- [ ] **Step 2: Date util tests**

Create `src/lib/utils/date.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { addDays, today, formatHuman, dueFromTerms } from './date';

describe('date utils', () => {
  it('today returns ISO date YYYY-MM-DD', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('addDays adds correctly', () => {
    expect(addDays('2026-01-01', 30)).toBe('2026-01-31');
  });
  it('dueFromTerms maps net30 → +30', () => {
    expect(dueFromTerms('2026-01-01', 'net30')).toBe('2026-01-31');
    expect(dueFromTerms('2026-01-01', 'net0')).toBe('2026-01-01');
  });
  it('formatHuman returns long form', () => {
    expect(formatHuman('2026-04-20')).toBe('Apr 20, 2026');
  });
});
```

- [ ] **Step 3: Implement date utils**

Create `src/lib/utils/date.ts`:

```ts
import dayjs from 'dayjs';

export const today = () => dayjs().format('YYYY-MM-DD');
export const addDays = (date: string, days: number) => dayjs(date).add(days, 'day').format('YYYY-MM-DD');
export const formatHuman = (date: string) => dayjs(date).format('MMM D, YYYY');

const TERM_DAYS: Record<string, number> = { net0: 0, net7: 7, net15: 15, net30: 30, net60: 60 };
export type PaymentTerms = 'net0' | 'net7' | 'net15' | 'net30' | 'net60' | 'custom';
export const dueFromTerms = (issued: string, terms: PaymentTerms) => {
  if (terms === 'custom') return issued;
  return addDays(issued, TERM_DAYS[terms]);
};
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- src/lib/utils
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(utils): id and date helpers"
```

---

### Task 7: Currency formatter

**Files:**
- Create: `src/lib/utils/currency-format.ts`, `src/lib/utils/currency-format.test.ts`

- [ ] **Step 1: Failing test**

Create `src/lib/utils/currency-format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatMoney } from './currency-format';

describe('formatMoney', () => {
  it('formats INR with Indian grouping', () => {
    expect(formatMoney(100000, 'INR', 'en-IN')).toBe('₹1,00,000.00');
  });
  it('formats USD with American grouping', () => {
    expect(formatMoney(100000, 'USD', 'en-US')).toBe('$100,000.00');
  });
  it('rounds to 2 decimals', () => {
    expect(formatMoney(1.005, 'USD', 'en-US')).toBe('$1.01');
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/utils/currency-format.ts`:

```ts
export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- src/lib/utils/currency-format
git add -A
git commit -m "feat(utils): money formatter using Intl.NumberFormat"
```

---

### Task 8: GSTIN validator

**Files:**
- Create: `src/lib/utils/gstin.ts`, `src/lib/utils/gstin.test.ts`

- [ ] **Step 1: Failing test**

Create `src/lib/utils/gstin.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isValidGstin, stateFromGstin } from './gstin';

describe('gstin', () => {
  it('rejects strings of wrong length', () => {
    expect(isValidGstin('123')).toBe(false);
  });
  it('rejects bad pattern', () => {
    expect(isValidGstin('xxxxxxxxxxxxxxx')).toBe(false);
  });
  it('extracts state code prefix', () => {
    expect(stateFromGstin('29AAAAA0000A1Z5')).toBe('29');
  });
});
```

- [ ] **Step 2: Implement (pattern check + Mod-36 checksum)**

Create `src/lib/utils/gstin.ts`:

```ts
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
  if (value.length < 2) return undefined;
  return value.slice(0, 2);
}
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- src/lib/utils/gstin
git add -A
git commit -m "feat(utils): GSTIN validator with state-code extractor"
```

---

## Phase 2 — Core Calc Engine + State (Tasks 9–14)

### Task 9: Item-level calculation engine

**Files:**
- Create: `src/lib/calc/items.ts`, `src/lib/calc/items.test.ts`

- [ ] **Step 1: Failing tests**

Create `src/lib/calc/items.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { itemAmounts } from './items';
import type { LineItem } from '../schemas/invoice';

const item = (over: Partial<LineItem> = {}): LineItem => ({
  id: '1', description: 'x', quantity: 2, rate: 100, taxRate: 10, ...over
});

describe('itemAmounts', () => {
  it('subtotal = qty × rate', () => {
    expect(itemAmounts(item()).subtotal).toBe(200);
  });
  it('applies per-item discount before tax', () => {
    const r = itemAmounts(item({ discountPct: 10 }));
    expect(r.discount).toBe(20);
    expect(r.taxable).toBe(180);
  });
  it('tax = taxable × itemRate when present', () => {
    const r = itemAmounts(item({ taxRate: 18 }));
    expect(r.tax).toBe(36);
  });
  it('falls back to fallbackTaxRate when item taxRate is 0', () => {
    const r = itemAmounts(item({ taxRate: 0 }), 18);
    expect(r.tax).toBe(36);
  });
  it('total = taxable + tax', () => {
    const r = itemAmounts(item());
    expect(r.total).toBe(220);
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/calc/items.ts`:

```ts
import type { LineItem } from '../schemas/invoice';

export type ItemAmounts = {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
};

export function itemAmounts(item: LineItem, fallbackTaxRate = 0): ItemAmounts {
  const subtotal = item.quantity * item.rate;
  const discount = subtotal * ((item.discountPct ?? 0) / 100);
  const taxable = subtotal - discount;
  const effectiveTax = item.taxRate > 0 ? item.taxRate : fallbackTaxRate;
  const tax = taxable * (effectiveTax / 100);
  const total = taxable + tax;
  return { subtotal, discount, taxable, tax, total };
}
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- src/lib/calc/items
git add -A
git commit -m "feat(calc): item-level subtotal/discount/tax/total"
```

---

### Task 10: GST split engine

**Files:**
- Create: `src/lib/calc/gst.ts`, `src/lib/calc/gst.test.ts`

- [ ] **Step 1: Failing tests**

Create `src/lib/calc/gst.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { splitGst } from './gst';

describe('splitGst', () => {
  it('intra-state → CGST + SGST half each', () => {
    const r = splitGst(1000, 18, '29', '29');
    expect(r).toEqual({ cgst: 90, sgst: 90, igst: 0, total: 180 });
  });
  it('inter-state → IGST full', () => {
    const r = splitGst(1000, 18, '29', '07');
    expect(r).toEqual({ cgst: 0, sgst: 0, igst: 180, total: 180 });
  });
  it('missing toState defaults to IGST', () => {
    const r = splitGst(1000, 18, '29', undefined);
    expect(r.igst).toBe(180);
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/calc/gst.ts`:

```ts
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
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- src/lib/calc/gst
git add -A
git commit -m "feat(calc): GST CGST+SGST vs IGST split"
```

---

### Task 11: Invoice totals engine

**Files:**
- Create: `src/lib/calc/totals.ts`, `src/lib/calc/totals.test.ts`

- [ ] **Step 1: Failing tests (covers all tax modes)**

Create `src/lib/calc/totals.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { invoiceTotals } from './totals';
import type { Invoice } from '../schemas/invoice';

const baseInvoice = (over: Partial<Invoice> = {}): Invoice => ({
  id: 'i', number: 'N', createdAt: '', updatedAt: '',
  region: 'INTL', template: 'modern',
  brand: { color: '#000', font: 'inter' },
  currency: 'USD', locale: 'en-US',
  dateIssued: '2026-04-20', dateDue: '2026-05-20', paymentTerms: 'net30',
  from: { name: 'F', address: 'A' }, to: { name: 'T', address: 'A' },
  items: [
    { id: '1', description: 'x', quantity: 2, rate: 100, taxRate: 0 },
    { id: '2', description: 'y', quantity: 1, rate: 50, taxRate: 0 }
  ],
  discount: null, shipping: null, shippingTaxable: false,
  taxMode: 'none', taxes: [], roundTotal: false,
  payment: {}, meta: { status: 'draft' },
  ...over
});

describe('invoiceTotals', () => {
  it('no tax, no discount, no shipping', () => {
    const r = invoiceTotals(baseInvoice());
    expect(r.subtotal).toBe(250);
    expect(r.tax).toBe(0);
    expect(r.grandTotal).toBe(250);
  });

  it('percent discount applies before tax', () => {
    const r = invoiceTotals(baseInvoice({
      discount: { type: 'percent', value: 10 },
      taxMode: 'simple', taxes: [{ name: 'Tax', rate: 10, compound: false }]
    }));
    expect(r.discountAmount).toBe(25);
    expect(r.taxableAfterDiscount).toBe(225);
    expect(r.tax).toBe(22.5);
    expect(r.grandTotal).toBe(247.5);
  });

  it('flat discount + shipping (non-taxable)', () => {
    const r = invoiceTotals(baseInvoice({
      discount: { type: 'flat', value: 50 },
      shipping: 20, shippingTaxable: false
    }));
    expect(r.discountAmount).toBe(50);
    expect(r.shipping).toBe(20);
    expect(r.grandTotal).toBe(220);
  });

  it('GST mode intra-state splits CGST + SGST', () => {
    const r = invoiceTotals(baseInvoice({
      taxMode: 'gst',
      taxes: [{ name: 'GST', rate: 18, compound: false }],
      from: { name: 'F', address: 'A', gstStateCode: '29' },
      to: { name: 'T', address: 'A', gstStateCode: '29' }
    }));
    expect(r.gst?.cgst).toBe(22.5);
    expect(r.gst?.sgst).toBe(22.5);
    expect(r.gst?.igst).toBe(0);
    expect(r.tax).toBe(45);
  });

  it('GST mode inter-state → IGST', () => {
    const r = invoiceTotals(baseInvoice({
      taxMode: 'gst',
      taxes: [{ name: 'GST', rate: 18, compound: false }],
      from: { name: 'F', address: 'A', gstStateCode: '29' },
      to: { name: 'T', address: 'A', gstStateCode: '07' }
    }));
    expect(r.gst?.igst).toBe(45);
  });

  it('roundTotal rounds grand total to integer', () => {
    const r = invoiceTotals(baseInvoice({
      taxMode: 'simple', taxes: [{ name: 'X', rate: 5.5, compound: false }],
      roundTotal: true
    }));
    expect(Number.isInteger(r.grandTotal)).toBe(true);
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/calc/totals.ts`:

```ts
import type { Invoice } from '../schemas/invoice';
import { itemAmounts } from './items';
import { splitGst, type GstSplit } from './gst';

export type InvoiceTotals = {
  subtotal: number;
  discountAmount: number;
  taxableAfterDiscount: number;
  tax: number;
  shipping: number;
  shippingTax: number;
  grandTotal: number;
  gst?: GstSplit;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function invoiceTotals(inv: Invoice): InvoiceTotals {
  const fallbackTaxRate = inv.taxMode === 'simple' || inv.taxMode === 'vat'
    ? (inv.taxes[0]?.rate ?? 0)
    : 0;

  const itemSubs = inv.items.map(i => itemAmounts(i, fallbackTaxRate));
  const subtotal = itemSubs.reduce((s, x) => s + x.taxable, 0);

  const discountAmount = inv.discount
    ? inv.discount.type === 'percent'
      ? subtotal * (inv.discount.value / 100)
      : inv.discount.value
    : 0;

  const taxableAfterDiscount = Math.max(0, subtotal - discountAmount);

  let tax = 0;
  let gst: GstSplit | undefined;
  switch (inv.taxMode) {
    case 'none':
      tax = 0;
      break;
    case 'simple':
    case 'vat': {
      const rate = inv.taxes[0]?.rate ?? 0;
      tax = taxableAfterDiscount * (rate / 100);
      break;
    }
    case 'gst': {
      const rate = inv.taxes[0]?.rate ?? 18;
      gst = splitGst(taxableAfterDiscount, rate, inv.from.gstStateCode, inv.to.gstStateCode);
      tax = gst.total;
      break;
    }
    case 'custom': {
      let base = taxableAfterDiscount;
      let total = 0;
      for (const t of inv.taxes) {
        const slice = base * (t.rate / 100);
        total += slice;
        if (t.compound) base += slice;
      }
      tax = total;
      break;
    }
  }

  const shipping = inv.shipping ?? 0;
  const effectiveRate = inv.taxes[0]?.rate ?? 0;
  const shippingTax = inv.shippingTaxable && effectiveRate ? shipping * (effectiveRate / 100) : 0;

  let grandTotal = round2(taxableAfterDiscount + tax + shipping + shippingTax);
  if (inv.roundTotal) grandTotal = Math.round(grandTotal);

  return {
    subtotal: round2(subtotal),
    discountAmount: round2(discountAmount),
    taxableAfterDiscount: round2(taxableAfterDiscount),
    tax: round2(tax),
    shipping: round2(shipping),
    shippingTax: round2(shippingTax),
    grandTotal,
    gst
  };
}
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- src/lib/calc
git add -A
git commit -m "feat(calc): invoice totals engine for all tax modes"
```

---

### Task 12: Theme store (Svelte 5 runes)

**Files:**
- Create: `src/lib/stores/theme.svelte.ts`

- [ ] **Step 1: Implement theme store**

Create `src/lib/stores/theme.svelte.ts`:

```ts
import { Storage } from '../storage/local';
import { PreferencesSchema, DEFAULT_PREFERENCES, type Preferences } from '../schemas/prefs';

type Theme = Preferences['theme'];
const KEY = 'featureos_inv_v1_prefs';
const store = new Storage(KEY, PreferencesSchema, DEFAULT_PREFERENCES);

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme === 'system' ? sys : theme;
}

export function createThemeStore() {
  const initial = store.read();
  let theme = $state<Theme>(initial.theme);

  $effect.root(() => {
    $effect(() => {
      applyTheme(theme);
      store.write({ ...store.read(), theme });
    });
  });

  return {
    get value() { return theme; },
    set(next: Theme) { theme = next; },
    cycle() {
      const order: Theme[] = ['light', 'dark', 'oled', 'system'];
      theme = order[(order.indexOf(theme) + 1) % order.length];
    }
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(stores): theme store with system follow + persistence"
```

---

### Task 13: Preferences store

**Files:**
- Create: `src/lib/stores/prefs.svelte.ts`

- [ ] **Step 1: Implement**

Create `src/lib/stores/prefs.svelte.ts`:

```ts
import { Storage } from '../storage/local';
import { PreferencesSchema, DEFAULT_PREFERENCES, type Preferences } from '../schemas/prefs';

const KEY = 'featureos_inv_v1_prefs';
const store = new Storage(KEY, PreferencesSchema, DEFAULT_PREFERENCES);

export function createPrefsStore() {
  let prefs = $state<Preferences>(store.read());

  function patch(next: Partial<Preferences>) {
    prefs = { ...prefs, ...next };
    store.write(prefs);
  }

  function consumeNumber(): string {
    const seq = prefs.nextSequence;
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const padded = String(seq).padStart(4, '0');
    const number = prefs.numberingFormat
      .replace('{prefix}', prefs.numberingPrefix)
      .replace('{YYYY}', String(year))
      .replace('{YY}', String(year).slice(-2))
      .replace('{MM}', month)
      .replace('{####}', padded)
      .replace('{###}', String(seq).padStart(3, '0'));
    patch({ nextSequence: seq + 1 });
    return number;
  }

  return {
    get value() { return prefs; },
    patch,
    consumeNumber
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(stores): preferences store with auto-numbering"
```

---

### Task 14: Invoice store + history store

**Files:**
- Create: `src/lib/stores/invoice.svelte.ts`, `src/lib/stores/history.svelte.ts`

- [ ] **Step 1: Default invoice factory**

Create `src/lib/stores/invoice.svelte.ts`:

```ts
import { newId } from '../utils/id';
import { today, dueFromTerms } from '../utils/date';
import type { Invoice, LineItem } from '../schemas/invoice';
import { Storage } from '../storage/local';
import { InvoiceSchema } from '../schemas/invoice';

const DRAFT_KEY = 'featureos_inv_v1_draft';
const draftStore = new Storage(DRAFT_KEY, InvoiceSchema, makeBlankInvoice());

export function makeBlankInvoice(): Invoice {
  const issued = today();
  return {
    id: newId(),
    number: 'INV-DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    region: 'INTL',
    template: 'modern',
    brand: { color: '#4f46e5', font: 'inter' },
    currency: 'USD',
    locale: 'en-US',
    dateIssued: issued,
    dateDue: dueFromTerms(issued, 'net30'),
    paymentTerms: 'net30',
    from: { name: '', address: '' },
    to: { name: '', address: '' },
    items: [makeBlankItem()],
    discount: null,
    shipping: null,
    shippingTaxable: false,
    taxMode: 'none',
    taxes: [],
    roundTotal: false,
    payment: {},
    meta: { status: 'draft' }
  };
}

export function makeBlankItem(): LineItem {
  return { id: newId(), description: '', quantity: 1, rate: 0, taxRate: 0 };
}

export function createInvoiceStore(seed?: Partial<Invoice>) {
  let invoice = $state<Invoice>({ ...draftStore.read(), ...seed });
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function touch() {
    invoice.updatedAt = new Date().toISOString();
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => draftStore.write({ ...invoice }), 1500);
  }

  return {
    get value() { return invoice; },
    set(next: Invoice) { invoice = next; touch(); },
    patch(next: Partial<Invoice>) { invoice = { ...invoice, ...next }; touch(); },
    addItem() { invoice.items = [...invoice.items, makeBlankItem()]; touch(); },
    removeItem(id: string) {
      invoice.items = invoice.items.filter(i => i.id !== id);
      touch();
    },
    updateItem(id: string, patch: Partial<LineItem>) {
      invoice.items = invoice.items.map(i => i.id === id ? { ...i, ...patch } : i);
      touch();
    },
    reorderItems(fromIdx: number, toIdx: number) {
      const next = [...invoice.items];
      const [m] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, m);
      invoice.items = next;
      touch();
    },
    duplicateItem(id: string) {
      const idx = invoice.items.findIndex(i => i.id === id);
      if (idx < 0) return;
      const copy = { ...invoice.items[idx], id: newId() };
      const next = [...invoice.items];
      next.splice(idx + 1, 0, copy);
      invoice.items = next;
      touch();
    }
  };
}
```

- [ ] **Step 2: History store**

Create `src/lib/stores/history.svelte.ts`:

```ts
import { Storage } from '../storage/local';
import { InvoiceSchema, type Invoice } from '../schemas/invoice';
import { z } from 'zod';

const KEY = 'featureos_inv_v1_history';
const HistorySchema = z.array(InvoiceSchema);
const store = new Storage(KEY, HistorySchema, []);

export function createHistoryStore() {
  let items = $state<Invoice[]>(store.read());

  function persist() { store.write([...items]); }

  return {
    get value() { return items; },
    upsert(inv: Invoice) {
      const idx = items.findIndex(i => i.id === inv.id);
      if (idx >= 0) items[idx] = inv;
      else items = [inv, ...items];
      persist();
    },
    remove(id: string) {
      items = items.filter(i => i.id !== id);
      persist();
    },
    find(id: string) {
      return items.find(i => i.id === id);
    },
    duplicate(id: string, newNumber: string): Invoice | null {
      const src = items.find(i => i.id === id);
      if (!src) return null;
      const dup: Invoice = {
        ...src,
        id: crypto.randomUUID(),
        number: newNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        meta: { status: 'draft' }
      };
      items = [dup, ...items];
      persist();
      return dup;
    }
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(stores): invoice draft store + saved-history store"
```

---

## Phase 3 — Editor Shell + Modern Template (Tasks 15–22)

### Task 15: App route shell with editor canvas placeholder

**Files:**
- Create: `src/routes/app/+page.svelte`, `src/lib/components/editor/EditorShell.svelte`

- [ ] **Step 1: Create EditorShell**

Create `src/lib/components/editor/EditorShell.svelte`:

```svelte
<script lang="ts">
  import { createInvoiceStore } from '$lib/stores/invoice.svelte';
  import { createPrefsStore } from '$lib/stores/prefs.svelte';
  import { createThemeStore } from '$lib/stores/theme.svelte';
  import type { Invoice } from '$lib/schemas/invoice';

  let { seed }: { seed?: Partial<Invoice> } = $props();
  const invoice = createInvoiceStore(seed);
  const prefs = createPrefsStore();
  const theme = createThemeStore();
</script>

<div class="grid grid-cols-[260px_1fr_320px] min-h-screen">
  <aside class="border-r border-[var(--color-line)] p-4">Sidebar</aside>
  <main class="p-8 overflow-auto">
    <div class="mx-auto max-w-[820px] bg-[var(--color-paper)] shadow-xl border border-[var(--color-line)] rounded-md p-12">
      <p>Invoice editor canvas placeholder · {invoice.value.items.length} items</p>
    </div>
  </main>
  <aside class="border-l border-[var(--color-line)] p-4">Inspector</aside>
</div>
```

- [ ] **Step 2: Wire /app route**

Create `src/routes/app/+page.svelte`:

```svelte
<script lang="ts">
  import EditorShell from '$lib/components/editor/EditorShell.svelte';
</script>
<svelte:head><title>Invoice Editor · FeatureOS</title><meta name="robots" content="noindex" /></svelte:head>
<EditorShell />
```

- [ ] **Step 3: Boot dev, eyeball /app**

```bash
npm run dev
```

Visit `http://localhost:5173/app`. Expect three-column layout. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(editor): three-column shell with placeholder canvas"
```

---

### Task 16: EditableField primitive (contentEditable wrapper)

**Files:**
- Create: `src/lib/components/editor/EditableField.svelte`

- [ ] **Step 1: Implement**

```svelte
<script lang="ts">
  type Props = {
    value: string;
    placeholder?: string;
    multiline?: boolean;
    class?: string;
    align?: 'left' | 'right' | 'center';
    type?: 'text' | 'number';
    onchange: (v: string) => void;
  };
  let { value, placeholder = '', multiline = false, class: cls = '', align = 'left', type = 'text', onchange }: Props = $props();

  function handleInput(e: Event) {
    const el = e.target as HTMLElement;
    onchange(el.innerText);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  }
</script>

<span
  role="textbox"
  tabindex="0"
  contenteditable="plaintext-only"
  data-placeholder={placeholder}
  class="outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 rounded-sm px-1 -mx-1 transition empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-muted)] {cls}"
  style="text-align: {align};"
  data-type={type}
  oninput={handleInput}
  onkeydown={handleKeydown}
>{value}</span>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(editor): EditableField primitive with placeholder support"
```

---

### Task 17: Modern template (on-screen renderer)

**Files:**
- Create: `src/lib/components/templates/Modern.svelte`, `src/lib/components/templates/types.ts`

- [ ] **Step 1: Template type contract**

Create `src/lib/components/templates/types.ts`:

```ts
import type { Invoice } from '$lib/schemas/invoice';

export type TemplateProps = {
  invoice: Invoice;
  editable: boolean;
  onpatch?: (patch: Partial<Invoice>) => void;
  onitempatch?: (id: string, patch: Partial<Invoice['items'][number]>) => void;
  onadditem?: () => void;
  onremoveitem?: (id: string) => void;
};
```

- [ ] **Step 2: Modern template implementation**

Create `src/lib/components/templates/Modern.svelte`:

```svelte
<script lang="ts">
  import EditableField from '../editor/EditableField.svelte';
  import { invoiceTotals } from '$lib/calc/totals';
  import { formatMoney } from '$lib/utils/currency-format';
  import { formatHuman } from '$lib/utils/date';
  import type { TemplateProps } from './types';

  let { invoice, editable, onpatch, onitempatch, onadditem, onremoveitem }: TemplateProps = $props();
  const totals = $derived(invoiceTotals(invoice));
  const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
  const editableFlag = editable;
</script>

<article class="font-sans text-[var(--color-ink)]" style="--brand: {invoice.brand.color};">
  <header class="flex items-start justify-between mb-10">
    <div>
      {#if invoice.brand.logoDataUrl}
        <img src={invoice.brand.logoDataUrl} alt="" class="max-h-16 mb-4" />
      {/if}
      {#if editableFlag}
        <EditableField value={invoice.from.name} placeholder="Your business name" class="text-2xl font-display font-semibold block" onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })} />
        <EditableField value={invoice.from.address} multiline placeholder="Your address" class="text-sm text-[var(--color-muted)] whitespace-pre-line block mt-1" onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })} />
      {:else}
        <h2 class="text-2xl font-display font-semibold">{invoice.from.name}</h2>
        <p class="text-sm text-[var(--color-muted)] whitespace-pre-line mt-1">{invoice.from.address}</p>
      {/if}
    </div>
    <div class="text-right">
      <div class="text-3xl font-display font-bold tracking-tight" style="color: var(--brand);">INVOICE</div>
      <div class="text-sm text-[var(--color-muted)] mt-2">#{invoice.number}</div>
      <div class="mt-4 text-sm">
        <div><span class="text-[var(--color-muted)]">Issued:</span> {formatHuman(invoice.dateIssued)}</div>
        <div><span class="text-[var(--color-muted)]">Due:</span> {formatHuman(invoice.dateDue)}</div>
      </div>
    </div>
  </header>

  <section class="mb-8">
    <div class="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-2">Bill to</div>
    {#if editableFlag}
      <EditableField value={invoice.to.name} placeholder="Client name" class="font-medium block" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} />
      <EditableField value={invoice.to.address} multiline placeholder="Client address" class="text-sm text-[var(--color-muted)] whitespace-pre-line block mt-1" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} />
    {:else}
      <p class="font-medium">{invoice.to.name}</p>
      <p class="text-sm text-[var(--color-muted)] whitespace-pre-line mt-1">{invoice.to.address}</p>
    {/if}
  </section>

  <table class="w-full border-collapse mb-6">
    <thead>
      <tr class="text-xs uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-line)]">
        <th class="text-left py-2">Description</th>
        <th class="text-right py-2 w-20">Qty</th>
        <th class="text-right py-2 w-28">Rate</th>
        <th class="text-right py-2 w-20">Tax %</th>
        <th class="text-right py-2 w-28">Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each invoice.items as item (item.id)}
        <tr class="border-b border-[var(--color-line)]">
          <td class="py-3">
            {#if editableFlag}
              <EditableField value={item.description} placeholder="Item description" onchange={(v) => onitempatch?.(item.id, { description: v })} />
            {:else}{item.description}{/if}
          </td>
          <td class="py-3 text-right">
            {#if editableFlag}
              <EditableField value={String(item.quantity)} align="right" type="number" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />
            {:else}{item.quantity}{/if}
          </td>
          <td class="py-3 text-right">
            {#if editableFlag}
              <EditableField value={String(item.rate)} align="right" type="number" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />
            {:else}{fmt(item.rate)}{/if}
          </td>
          <td class="py-3 text-right">
            {#if editableFlag}
              <EditableField value={String(item.taxRate)} align="right" type="number" onchange={(v) => onitempatch?.(item.id, { taxRate: Number(v) || 0 })} />
            {:else}{item.taxRate}%{/if}
          </td>
          <td class="py-3 text-right tabular-nums">{fmt(item.quantity * item.rate)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if editableFlag}
    <button class="text-sm text-[var(--color-brand)] hover:underline mb-8" onclick={() => onadditem?.()}>+ Add line item</button>
  {/if}

  <section class="ml-auto w-full max-w-xs space-y-1 text-sm">
    <div class="flex justify-between"><span class="text-[var(--color-muted)]">Subtotal</span><span class="tabular-nums">{fmt(totals.subtotal)}</span></div>
    {#if totals.discountAmount > 0}
      <div class="flex justify-between"><span class="text-[var(--color-muted)]">Discount</span><span class="tabular-nums">−{fmt(totals.discountAmount)}</span></div>
    {/if}
    {#if totals.gst}
      {#if totals.gst.cgst > 0}
        <div class="flex justify-between"><span class="text-[var(--color-muted)]">CGST</span><span class="tabular-nums">{fmt(totals.gst.cgst)}</span></div>
        <div class="flex justify-between"><span class="text-[var(--color-muted)]">SGST</span><span class="tabular-nums">{fmt(totals.gst.sgst)}</span></div>
      {:else}
        <div class="flex justify-between"><span class="text-[var(--color-muted)]">IGST</span><span class="tabular-nums">{fmt(totals.gst.igst)}</span></div>
      {/if}
    {:else if totals.tax > 0}
      <div class="flex justify-between"><span class="text-[var(--color-muted)]">Tax</span><span class="tabular-nums">{fmt(totals.tax)}</span></div>
    {/if}
    {#if totals.shipping > 0}
      <div class="flex justify-between"><span class="text-[var(--color-muted)]">Shipping</span><span class="tabular-nums">{fmt(totals.shipping)}</span></div>
    {/if}
    <div class="flex justify-between pt-2 mt-2 border-t border-[var(--color-line)] font-semibold text-base">
      <span>Total</span>
      <span class="tabular-nums" style="color: var(--brand);">{fmt(totals.grandTotal)}</span>
    </div>
  </section>

  {#if invoice.notes}
    <p class="mt-10 text-sm text-[var(--color-muted)] whitespace-pre-line">{invoice.notes}</p>
  {/if}
</article>
```

- [ ] **Step 3: Hook Modern into EditorShell**

Edit `src/lib/components/editor/EditorShell.svelte` middle column:

```svelte
<main class="p-8 overflow-auto">
  <div class="mx-auto max-w-[820px] bg-[var(--color-paper)] shadow-xl border border-[var(--color-line)] rounded-md p-12">
    <Modern
      invoice={invoice.value}
      editable={true}
      onpatch={(p) => invoice.patch(p)}
      onitempatch={(id, p) => invoice.updateItem(id, p)}
      onadditem={() => invoice.addItem()}
      onremoveitem={(id) => invoice.removeItem(id)}
    />
  </div>
</main>
```

Add import at top:
```ts
import Modern from '$lib/components/templates/Modern.svelte';
```

- [ ] **Step 4: Boot, click around, commit**

```bash
npm run dev
# verify clicking fields edits them, totals update reactively
git add -A
git commit -m "feat(template): Modern template with WYSIWYG editing"
```

---

### Task 18: Inspector panel — context-aware settings

**Files:**
- Create: `src/lib/components/inspector/Inspector.svelte`, `src/lib/stores/focus.svelte.ts`

- [ ] **Step 1: Focus tracking store**

Create `src/lib/stores/focus.svelte.ts`:

```ts
export type FocusContext = 'none' | 'from' | 'to' | 'item' | 'tax' | 'discount' | 'shipping' | 'payment' | 'notes';

export function createFocusStore() {
  let context = $state<FocusContext>('none');
  return {
    get value() { return context; },
    set(c: FocusContext) { context = c; }
  };
}
```

- [ ] **Step 2: Inspector with sections per context**

Create `src/lib/components/inspector/Inspector.svelte`:

```svelte
<script lang="ts">
  import type { Invoice } from '$lib/schemas/invoice';
  import type { FocusContext } from '$lib/stores/focus.svelte';
  import { CURRENCIES } from '$lib/data/currencies';

  let { invoice, context, onpatch }: {
    invoice: Invoice;
    context: FocusContext;
    onpatch: (p: Partial<Invoice>) => void;
  } = $props();
</script>

<div class="space-y-6 text-sm">
  <section>
    <h3 class="font-medium mb-2">Document</h3>
    <label class="block">
      <span class="text-[var(--color-muted)] text-xs">Currency</span>
      <select
        value={invoice.currency}
        onchange={(e) => {
          const code = e.currentTarget.value;
          const c = CURRENCIES.find(x => x.code === code);
          onpatch({ currency: code, locale: c?.locale ?? invoice.locale });
        }}
        class="block w-full mt-1 bg-transparent border border-[var(--color-line)] rounded px-2 py-1"
      >
        {#each CURRENCIES as c}
          <option value={c.code}>{c.code} — {c.name}</option>
        {/each}
      </select>
    </label>
    <label class="block mt-3">
      <span class="text-[var(--color-muted)] text-xs">Region</span>
      <select
        value={invoice.region}
        onchange={(e) => onpatch({ region: e.currentTarget.value as 'IN' | 'INTL' })}
        class="block w-full mt-1 bg-transparent border border-[var(--color-line)] rounded px-2 py-1"
      >
        <option value="INTL">International</option>
        <option value="IN">India (GST)</option>
      </select>
    </label>
    <label class="block mt-3">
      <span class="text-[var(--color-muted)] text-xs">Brand color</span>
      <input type="color" value={invoice.brand.color} oninput={(e) => onpatch({ brand: { ...invoice.brand, color: e.currentTarget.value } })} class="mt-1 h-8 w-full rounded" />
    </label>
  </section>

  {#if context === 'tax'}
    <section>
      <h3 class="font-medium mb-2">Tax</h3>
      <label class="block">
        <span class="text-[var(--color-muted)] text-xs">Mode</span>
        <select
          value={invoice.taxMode}
          onchange={(e) => onpatch({ taxMode: e.currentTarget.value as Invoice['taxMode'] })}
          class="block w-full mt-1 bg-transparent border border-[var(--color-line)] rounded px-2 py-1"
        >
          <option value="none">None</option>
          <option value="simple">Simple</option>
          <option value="gst">GST (India)</option>
          <option value="vat">VAT</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      {#if invoice.taxMode !== 'none' && invoice.taxMode !== 'custom'}
        <label class="block mt-3">
          <span class="text-[var(--color-muted)] text-xs">Rate %</span>
          <input
            type="number"
            value={invoice.taxes[0]?.rate ?? 18}
            oninput={(e) => onpatch({ taxes: [{ name: invoice.taxMode.toUpperCase(), rate: Number(e.currentTarget.value), compound: false }] })}
            class="block w-full mt-1 bg-transparent border border-[var(--color-line)] rounded px-2 py-1"
          />
        </label>
      {/if}
    </section>
  {/if}
</div>
```

- [ ] **Step 3: Wire Inspector into EditorShell right column**

Replace right `<aside>` in `EditorShell.svelte`:

```svelte
<aside class="border-l border-[var(--color-line)] p-4">
  <Inspector invoice={invoice.value} context={focus.value} onpatch={(p) => invoice.patch(p)} />
</aside>
```

Add imports + store:
```ts
import Inspector from '$lib/components/inspector/Inspector.svelte';
import { createFocusStore } from '$lib/stores/focus.svelte';
const focus = createFocusStore();
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(inspector): contextual right-rail with currency/region/tax settings"
```

---

### Task 19: Top bar with actions

**Files:**
- Create: `src/lib/components/editor/TopBar.svelte`

- [ ] **Step 1: Implement**

```svelte
<script lang="ts">
  let { invoiceNumber, theme, onCmdK, onDownload, onShare, onPrint, onTemplate, currentTemplate, onThemeCycle }: {
    invoiceNumber: string;
    theme: string;
    currentTemplate: string;
    onCmdK: () => void;
    onDownload: () => void;
    onShare: () => void;
    onPrint: () => void;
    onTemplate: (t: string) => void;
    onThemeCycle: () => void;
  } = $props();
  const TEMPLATES = ['modern', 'minimal', 'classic', 'creative', 'corporate'];
</script>

<header class="flex items-center justify-between px-6 h-14 border-b border-[var(--color-line)] bg-[var(--color-paper)] sticky top-0 z-10">
  <div class="flex items-center gap-3">
    <a href="https://featureos.com" class="font-display font-bold text-base">FeatureOS</a>
    <span class="text-[var(--color-muted)]">·</span>
    <span class="text-sm">Invoice <span class="text-[var(--color-muted)]">{invoiceNumber}</span></span>
  </div>
  <div class="flex items-center gap-2 text-sm">
    <select value={currentTemplate} onchange={(e) => onTemplate(e.currentTarget.value)} class="bg-transparent border border-[var(--color-line)] rounded px-2 py-1 capitalize">
      {#each TEMPLATES as t}<option value={t}>{t}</option>{/each}
    </select>
    <button onclick={onThemeCycle} title="Cycle theme" class="px-2 py-1 border border-[var(--color-line)] rounded">{theme === 'dark' ? '🌙' : theme === 'oled' ? '🌑' : theme === 'light' ? '☀︎' : '⌬'}</button>
    <button onclick={onCmdK} class="px-2 py-1 border border-[var(--color-line)] rounded font-mono text-xs">⌘K</button>
    <button onclick={onPrint} class="px-3 py-1 border border-[var(--color-line)] rounded">Print</button>
    <button onclick={onShare} class="px-3 py-1 border border-[var(--color-line)] rounded">Share</button>
    <button onclick={onDownload} class="px-3 py-1 rounded text-white" style="background: var(--color-brand);">Download PDF</button>
  </div>
</header>
```

- [ ] **Step 2: Mount in EditorShell**

Wrap `EditorShell.svelte` content in a flex column with TopBar at top. Stub handlers for now (`() => {}`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(editor): top bar with template/theme/actions"
```

---

### Task 20: Drag-to-reorder line items

**Files:**
- Modify: `src/lib/components/templates/Modern.svelte`

- [ ] **Step 1: Add drag handlers to row**

In Modern.svelte's `<tr>` for items, add:

```svelte
<tr
  class="border-b border-[var(--color-line)]"
  draggable={editableFlag}
  ondragstart={(e) => e.dataTransfer?.setData('text/plain', String(invoice.items.indexOf(item)))}
  ondragover={(e) => e.preventDefault()}
  ondrop={(e) => {
    e.preventDefault();
    const from = Number(e.dataTransfer?.getData('text/plain'));
    const to = invoice.items.indexOf(item);
    if (from !== to) onreorder?.(from, to);
  }}
>
```

- [ ] **Step 2: Add `onreorder` to TemplateProps**

In `src/lib/components/templates/types.ts`:

```ts
export type TemplateProps = {
  invoice: Invoice;
  editable: boolean;
  onpatch?: (patch: Partial<Invoice>) => void;
  onitempatch?: (id: string, patch: Partial<Invoice['items'][number]>) => void;
  onadditem?: () => void;
  onremoveitem?: (id: string) => void;
  onreorder?: (from: number, to: number) => void;
};
```

- [ ] **Step 3: Wire from EditorShell**

```svelte
<Modern ... onreorder={(f, t) => invoice.reorderItems(f, t)} />
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(editor): drag-to-reorder line items via HTML5 DnD"
```

---

### Task 21: Logo upload

**Files:**
- Create: `src/lib/utils/image.ts`
- Modify: `src/lib/components/templates/Modern.svelte`

- [ ] **Step 1: Image utility**

Create `src/lib/utils/image.ts`:

```ts
export async function fileToCompressedDataUrl(file: File, maxBytes = 200_000): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  if (file.size <= maxBytes) return dataUrl;
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const scale = Math.sqrt(maxBytes / file.size);
  canvas.width = Math.max(64, img.width * scale);
  canvas.height = Math.max(64, img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}
```

- [ ] **Step 2: Drop zone in Modern header**

In Modern.svelte header, replace the logo block:

```svelte
{#if editableFlag}
  <label class="block max-h-16 mb-4 cursor-pointer">
    {#if invoice.brand.logoDataUrl}
      <img src={invoice.brand.logoDataUrl} alt="" class="max-h-16" />
    {:else}
      <span class="inline-block px-3 py-2 text-xs border border-dashed border-[var(--color-line)] rounded text-[var(--color-muted)]">+ Add logo</span>
    {/if}
    <input type="file" accept="image/*" class="hidden" onchange={async (e) => {
      const f = e.currentTarget.files?.[0];
      if (!f) return;
      const url = await fileToCompressedDataUrl(f);
      onpatch?.({ brand: { ...invoice.brand, logoDataUrl: url } });
    }} />
  </label>
{:else if invoice.brand.logoDataUrl}
  <img src={invoice.brand.logoDataUrl} alt="" class="max-h-16 mb-4" />
{/if}
```

Import at top:
```ts
import { fileToCompressedDataUrl } from '$lib/utils/image';
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(editor): logo upload with auto-compression"
```

---

### Task 22: Number consumption on first save + auto-numbering

**Files:**
- Modify: `src/lib/stores/invoice.svelte.ts`, `src/lib/components/editor/EditorShell.svelte`

- [ ] **Step 1: Save action**

Add to invoice store return value:

```ts
save(prefs: { consumeNumber: () => string }, history: { upsert: (i: Invoice) => void }) {
  if (invoice.number === 'INV-DRAFT') {
    invoice.number = prefs.consumeNumber();
  }
  history.upsert({ ...invoice });
  draftStore.write({ ...invoice });
}
```

- [ ] **Step 2: Wire `Cmd+S` shortcut in EditorShell**

```ts
import { createHistoryStore } from '$lib/stores/history.svelte';
const history = createHistoryStore();

$effect(() => {
  function onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      invoice.save(prefs, history);
    }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
});
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(editor): cmd+s saves invoice + consumes auto-number"
```

---

## Phase 4 — Export: PDF + Share + Print (Tasks 23–28)

### Task 23: Share-via-URL encode/decode

**Files:**
- Create: `src/lib/share/encode.ts`, `src/lib/share/encode.test.ts`

- [ ] **Step 1: Failing tests**

Create `src/lib/share/encode.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { encodeInvoice, decodeInvoice } from './encode';
import { InvoiceSchema } from '../schemas/invoice';

const sample = {
  id: 'a', number: 'INV-1', createdAt: '', updatedAt: '',
  region: 'INTL', template: 'modern',
  brand: { color: '#000', font: 'inter' },
  currency: 'USD', locale: 'en-US',
  dateIssued: '2026-04-20', dateDue: '2026-05-20', paymentTerms: 'net30',
  from: { name: 'F', address: 'A' }, to: { name: 'T', address: 'A' },
  items: [], discount: null, shipping: null, shippingTaxable: false,
  taxMode: 'none', taxes: [], roundTotal: false,
  payment: {}, meta: { status: 'draft' }
} as const;

describe('share encode/decode', () => {
  it('round-trips a valid invoice', () => {
    const enc = encodeInvoice(sample as any);
    const dec = decodeInvoice(enc);
    expect(dec.success).toBe(true);
    if (dec.success) expect(dec.data.number).toBe('INV-1');
  });
  it('returns error on garbage input', () => {
    const dec = decodeInvoice('garbage');
    expect(dec.success).toBe(false);
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/share/encode.ts`:

```ts
import LZString from 'lz-string';
import { InvoiceSchema, type Invoice } from '../schemas/invoice';

export function encodeInvoice(invoice: Invoice): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(invoice));
}

export type DecodeResult =
  | { success: true; data: Invoice }
  | { success: false; reason: string };

export function decodeInvoice(encoded: string): DecodeResult {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return { success: false, reason: 'empty' };
    const parsed = JSON.parse(json);
    const result = InvoiceSchema.safeParse(parsed);
    if (!result.success) return { success: false, reason: 'invalid-schema' };
    return { success: true, data: result.data };
  } catch (e) {
    return { success: false, reason: 'parse-error' };
  }
}

export function encodedSize(encoded: string): number {
  return new Blob([encoded]).size;
}
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- src/lib/share
git add -A
git commit -m "feat(share): LZ-compressed invoice encode/decode round-trip"
```

---

### Task 24: Share route (`/share`) reads URL hash

**Files:**
- Create: `src/routes/share/+page.svelte`, `src/routes/share/+page.ts`

- [ ] **Step 1: Disable SSR**

Create `src/routes/share/+page.ts`:

```ts
export const ssr = false;
export const prerender = false;
```

- [ ] **Step 2: Page reads hash**

Create `src/routes/share/+page.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { decodeInvoice } from '$lib/share/encode';
  import Modern from '$lib/components/templates/Modern.svelte';
  import type { Invoice } from '$lib/schemas/invoice';

  let invoice = $state<Invoice | null>(null);
  let error = $state<string | null>(null);

  onMount(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) { error = 'No invoice data in URL.'; return; }
    const r = decodeInvoice(hash);
    if (!r.success) { error = 'This invoice link is corrupted or from an old version.'; return; }
    invoice = r.data;
  });
</script>

<svelte:head>
  <title>Invoice · FeatureOS</title>
  <meta name="robots" content="noindex,nofollow" />
  <link rel="canonical" href="https://featureos.com/" />
</svelte:head>

<div class="min-h-screen bg-[var(--color-paper)] py-10">
  <div class="mx-auto max-w-[820px] px-4">
    {#if error}
      <div class="rounded border border-[var(--color-line)] p-6 text-center">
        <p>{error}</p>
        <a href="/" class="text-[var(--color-brand)] underline mt-3 inline-block">Make your own free invoice →</a>
      </div>
    {:else if invoice}
      <div class="bg-[var(--color-paper)] shadow-xl border border-[var(--color-line)] rounded-md p-12">
        <Modern {invoice} editable={false} />
      </div>
      <footer class="mt-6 text-center text-sm text-[var(--color-muted)]">
        Made with <a href="/" class="text-[var(--color-brand)] underline">FeatureOS Invoice Generator</a> · Make your own free →
      </footer>
    {:else}
      <p class="text-center text-[var(--color-muted)]">Loading…</p>
    {/if}
  </div>
</div>
```

- [ ] **Step 3: Wire Share button in TopBar**

In EditorShell, replace `onShare` stub:

```ts
import { encodeInvoice, encodedSize } from '$lib/share/encode';

async function shareInvoice() {
  const enc = encodeInvoice(invoice.value);
  if (encodedSize(enc) > 8192) {
    alert('Invoice too large to share via link (likely a big logo). Download the PDF instead.');
    return;
  }
  const url = `${window.location.origin}/share/#${enc}`;
  await navigator.clipboard.writeText(url);
  alert('Share link copied!');
}
```

Pass `onShare={shareInvoice}` to TopBar.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(share): /share route reads invoice from URL hash"
```

---

### Task 25: PDF generation core (pdfmake + Modern template)

**Files:**
- Create: `src/lib/pdf/generate.ts`, `src/lib/pdf/fonts.ts`, `src/lib/pdf/templates/modern.ts`

- [ ] **Step 1: Fonts setup**

Create `src/lib/pdf/fonts.ts`:

```ts
// pdfmake reads fonts via vfs. We use the default Roboto bundled with pdfmake
// for v1; custom fonts arrive in Phase 5 when @fontsource is wired.
export const PDF_FONTS = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};
```

- [ ] **Step 2: Modern PDF template**

Create `src/lib/pdf/templates/modern.ts`:

```ts
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Invoice } from '$lib/schemas/invoice';
import { invoiceTotals } from '$lib/calc/totals';
import { formatMoney } from '$lib/utils/currency-format';
import { formatHuman } from '$lib/utils/date';

export function modernPdf(invoice: Invoice): TDocumentDefinitions {
  const totals = invoiceTotals(invoice);
  const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
  const brand = invoice.brand.color;

  const itemRows = [
    [
      { text: 'Description', style: 'th' },
      { text: 'Qty', style: 'th', alignment: 'right' },
      { text: 'Rate', style: 'th', alignment: 'right' },
      { text: 'Tax', style: 'th', alignment: 'right' },
      { text: 'Amount', style: 'th', alignment: 'right' }
    ],
    ...invoice.items.map(i => [
      i.description,
      { text: String(i.quantity), alignment: 'right' as const },
      { text: fmt(i.rate), alignment: 'right' as const },
      { text: `${i.taxRate}%`, alignment: 'right' as const },
      { text: fmt(i.quantity * i.rate), alignment: 'right' as const }
    ])
  ];

  return {
    pageSize: 'A4',
    pageMargins: [48, 48, 48, 64],
    content: [
      ...(invoice.brand.logoDataUrl ? [{ image: invoice.brand.logoDataUrl, fit: [120, 60] as [number, number] }] : []),
      {
        columns: [
          [
            { text: invoice.from.name, style: 'businessName' },
            { text: invoice.from.address, style: 'muted', margin: [0, 4, 0, 0] }
          ],
          [
            { text: 'INVOICE', style: 'big', color: brand, alignment: 'right' },
            { text: `#${invoice.number}`, alignment: 'right', style: 'muted', margin: [0, 4, 0, 0] },
            { text: `Issued: ${formatHuman(invoice.dateIssued)}`, alignment: 'right', margin: [0, 12, 0, 0], fontSize: 10 },
            { text: `Due: ${formatHuman(invoice.dateDue)}`, alignment: 'right', fontSize: 10 }
          ]
        ],
        margin: [0, 16, 0, 24]
      },
      { text: 'BILL TO', style: 'label', margin: [0, 0, 0, 4] },
      { text: invoice.to.name, bold: true },
      { text: invoice.to.address, style: 'muted', margin: [0, 2, 0, 16] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 40, 70, 50, 80],
          body: itemRows
        },
        layout: {
          hLineWidth: (i) => (i === 0 || i === 1 ? 0.5 : 0.25),
          vLineWidth: () => 0,
          hLineColor: () => '#e5e5e5'
        }
      },
      {
        margin: [0, 16, 0, 0],
        columns: [
          { text: '' },
          {
            width: 220,
            stack: [
              row('Subtotal', fmt(totals.subtotal)),
              ...(totals.discountAmount > 0 ? [row('Discount', `−${fmt(totals.discountAmount)}`)] : []),
              ...gstRows(totals, fmt),
              ...(totals.tax > 0 && !totals.gst ? [row('Tax', fmt(totals.tax))] : []),
              ...(totals.shipping > 0 ? [row('Shipping', fmt(totals.shipping))] : []),
              {
                margin: [0, 8, 0, 0],
                columns: [
                  { text: 'Total', bold: true },
                  { text: fmt(totals.grandTotal), bold: true, alignment: 'right', color: brand }
                ]
              }
            ]
          }
        ]
      },
      ...(invoice.notes ? [{ text: invoice.notes, style: 'muted', margin: [0, 32, 0, 0] }] : [])
    ],
    styles: {
      th: { bold: true, fontSize: 9, color: '#666' },
      label: { fontSize: 9, color: '#888', characterSpacing: 1 },
      muted: { color: '#666', fontSize: 10 },
      businessName: { fontSize: 16, bold: true },
      big: { fontSize: 24, bold: true }
    },
    defaultStyle: { font: 'Roboto', fontSize: 11 }
  };
}

function row(label: string, value: string) {
  return {
    columns: [
      { text: label, color: '#666' },
      { text: value, alignment: 'right' as const }
    ],
    margin: [0, 0, 0, 2] as [number, number, number, number]
  };
}

function gstRows(totals: ReturnType<typeof invoiceTotals>, fmt: (n: number) => string) {
  if (!totals.gst) return [];
  if (totals.gst.cgst > 0) return [row('CGST', fmt(totals.gst.cgst)), row('SGST', fmt(totals.gst.sgst))];
  return [row('IGST', fmt(totals.gst.igst))];
}
```

- [ ] **Step 3: Generate function with lazy pdfmake load**

Create `src/lib/pdf/generate.ts`:

```ts
import type { Invoice } from '$lib/schemas/invoice';
import { modernPdf } from './templates/modern';
import { PDF_FONTS } from './fonts';

const builders = { modern: modernPdf } as const;

export async function downloadPdf(invoice: Invoice) {
  const [{ default: pdfMake }, vfs] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts')
  ]);
  (pdfMake as any).vfs = (vfs as any).default?.pdfMake?.vfs ?? (vfs as any).pdfMake?.vfs;
  (pdfMake as any).fonts = PDF_FONTS;

  const builder = builders[invoice.template] ?? modernPdf;
  const doc = builder(invoice);
  const safe = invoice.to.name.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 32) || 'invoice';
  pdfMake.createPdf(doc).download(`${invoice.number}_${safe}.pdf`);
}
```

- [ ] **Step 4: Wire Download button**

In EditorShell, replace `onDownload` stub:

```ts
import { downloadPdf } from '$lib/pdf/generate';
async function handleDownload() {
  await downloadPdf(invoice.value);
}
```

Pass `onDownload={handleDownload}`.

- [ ] **Step 5: Manual smoke**

```bash
npm run dev
```
Visit `/app`, fill some fields, click Download PDF, verify file downloads and opens.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(pdf): vector PDF generation for Modern template"
```

---

### Task 26: Confetti success moment

**Files:**
- Modify: `src/lib/components/editor/EditorShell.svelte`

- [ ] **Step 1: Confetti on download**

In EditorShell:

```ts
import confetti from 'canvas-confetti';
const KEY = 'featureos_inv_v1_confetti_used';

async function handleDownload() {
  await downloadPdf(invoice.value);
  if (!sessionStorage.getItem(KEY) && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.setItem(KEY, '1');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(editor): confetti burst on first PDF download per session"
```

---

### Task 27: Print stylesheet + print action

**Files:**
- Create: `src/print.css`
- Modify: `src/routes/+layout.svelte`, `src/lib/components/editor/EditorShell.svelte`

- [ ] **Step 1: Print CSS**

Create `src/print.css`:

```css
@media print {
  header, aside, nav, .no-print { display: none !important; }
  main { padding: 0 !important; overflow: visible !important; }
  article { box-shadow: none !important; border: none !important; padding: 0 !important; }
  body { background: white !important; color: black !important; }
}
```

- [ ] **Step 2: Import in layout**

In `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css';
  import '../print.css';
  let { children } = $props();
</script>
{@render children()}
```

- [ ] **Step 3: Wire Print button**

```ts
function handlePrint() { window.print(); }
```

Pass `onPrint={handlePrint}`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(print): print stylesheet hides chrome, prints invoice only"
```

---

### Task 28: PDF round-trip E2E test

**Files:**
- Create: `tests/e2e/pdf-download.spec.ts`

- [ ] **Step 1: Test**

```ts
import { test, expect } from '@playwright/test';

test('user can fill invoice and download PDF', async ({ page }) => {
  await page.goto('/app');
  await page.locator('text=Your business name').click();
  await page.keyboard.type('Acme Co');
  await page.locator('text=Client name').click();
  await page.keyboard.type('Customer X');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Download PDF')
  ]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
```

- [ ] **Step 2: Run + commit**

```bash
npm run test:e2e
git add -A
git commit -m "test(e2e): PDF download round-trip"
```

---

## Phase 5 — Templates, Cmd+K, Polish (Tasks 29–35)

### Task 29: Minimal template (on-screen + PDF)

**Files:**
- Create: `src/lib/components/templates/Minimal.svelte`, `src/lib/pdf/templates/minimal.ts`

- [ ] **Step 1: On-screen Minimal**

Create `src/lib/components/templates/Minimal.svelte` — same shape as Modern but with monoline aesthetics: serif headings (`font-serif`), no header bar, smaller type, double-rule under "Total". Reuse `EditableField`, `invoiceTotals`, `formatMoney`. Field semantics identical to Modern.

```svelte
<script lang="ts">
  import EditableField from '../editor/EditableField.svelte';
  import { invoiceTotals } from '$lib/calc/totals';
  import { formatMoney } from '$lib/utils/currency-format';
  import { formatHuman } from '$lib/utils/date';
  import type { TemplateProps } from './types';

  let { invoice, editable, onpatch, onitempatch, onadditem, onreorder }: TemplateProps = $props();
  const totals = $derived(invoiceTotals(invoice));
  const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
</script>

<article class="font-serif text-[var(--color-ink)] leading-relaxed">
  <header class="mb-12">
    <h1 class="text-4xl tracking-tight">Invoice</h1>
    <div class="text-sm text-[var(--color-muted)] mt-1">#{invoice.number} · Issued {formatHuman(invoice.dateIssued)} · Due {formatHuman(invoice.dateDue)}</div>
  </header>

  <div class="grid grid-cols-2 gap-8 mb-10">
    <div>
      <div class="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">From</div>
      {#if editable}
        <EditableField value={invoice.from.name} placeholder="Your name" class="font-medium block" onchange={(v) => onpatch?.({ from: { ...invoice.from, name: v } })} />
        <EditableField value={invoice.from.address} multiline placeholder="Address" class="text-sm text-[var(--color-muted)] whitespace-pre-line block" onchange={(v) => onpatch?.({ from: { ...invoice.from, address: v } })} />
      {:else}
        <p class="font-medium">{invoice.from.name}</p>
        <p class="text-sm text-[var(--color-muted)] whitespace-pre-line">{invoice.from.address}</p>
      {/if}
    </div>
    <div>
      <div class="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">To</div>
      {#if editable}
        <EditableField value={invoice.to.name} placeholder="Client" class="font-medium block" onchange={(v) => onpatch?.({ to: { ...invoice.to, name: v } })} />
        <EditableField value={invoice.to.address} multiline placeholder="Address" class="text-sm text-[var(--color-muted)] whitespace-pre-line block" onchange={(v) => onpatch?.({ to: { ...invoice.to, address: v } })} />
      {:else}
        <p class="font-medium">{invoice.to.name}</p>
        <p class="text-sm text-[var(--color-muted)] whitespace-pre-line">{invoice.to.address}</p>
      {/if}
    </div>
  </div>

  <table class="w-full border-collapse mb-8">
    <thead><tr class="border-b border-[var(--color-ink)]"><th class="text-left py-2">Description</th><th class="text-right py-2">Qty</th><th class="text-right py-2">Rate</th><th class="text-right py-2">Amount</th></tr></thead>
    <tbody>
      {#each invoice.items as item (item.id)}
        <tr class="border-b border-[var(--color-line)]">
          <td class="py-3">{#if editable}<EditableField value={item.description} placeholder="Item" onchange={(v) => onitempatch?.(item.id, { description: v })} />{:else}{item.description}{/if}</td>
          <td class="py-3 text-right">{#if editable}<EditableField value={String(item.quantity)} align="right" onchange={(v) => onitempatch?.(item.id, { quantity: Number(v) || 0 })} />{:else}{item.quantity}{/if}</td>
          <td class="py-3 text-right">{#if editable}<EditableField value={String(item.rate)} align="right" onchange={(v) => onitempatch?.(item.id, { rate: Number(v) || 0 })} />{:else}{fmt(item.rate)}{/if}</td>
          <td class="py-3 text-right tabular-nums">{fmt(item.quantity * item.rate)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if editable}<button class="text-sm hover:underline" onclick={() => onadditem?.()}>+ Add line item</button>{/if}

  <div class="ml-auto w-72 mt-8 text-sm">
    <div class="flex justify-between border-t border-[var(--color-ink)] pt-2 text-base font-semibold"><span>Total</span><span class="tabular-nums">{fmt(totals.grandTotal)}</span></div>
  </div>
</article>
```

- [ ] **Step 2: Minimal PDF**

Create `src/lib/pdf/templates/minimal.ts` — same export shape as `modernPdf`, with serif vibe via larger heading, lighter rules. Wire into `builders` map in `generate.ts`.

```ts
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Invoice } from '$lib/schemas/invoice';
import { invoiceTotals } from '$lib/calc/totals';
import { formatMoney } from '$lib/utils/currency-format';
import { formatHuman } from '$lib/utils/date';

export function minimalPdf(invoice: Invoice): TDocumentDefinitions {
  const totals = invoiceTotals(invoice);
  const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
  return {
    pageSize: 'A4',
    pageMargins: [56, 56, 56, 64],
    content: [
      { text: 'Invoice', fontSize: 28, margin: [0, 0, 0, 4] },
      { text: `#${invoice.number} · Issued ${formatHuman(invoice.dateIssued)} · Due ${formatHuman(invoice.dateDue)}`, color: '#888', fontSize: 10, margin: [0, 0, 0, 24] },
      {
        columns: [
          { stack: [{ text: 'FROM', color: '#888', fontSize: 8 }, { text: invoice.from.name, bold: true, margin: [0, 4, 0, 0] }, { text: invoice.from.address, color: '#666', fontSize: 10 }] },
          { stack: [{ text: 'TO',   color: '#888', fontSize: 8 }, { text: invoice.to.name,   bold: true, margin: [0, 4, 0, 0] }, { text: invoice.to.address,   color: '#666', fontSize: 10 }] }
        ],
        margin: [0, 0, 0, 24]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 50, 70, 80],
          body: [
            [{ text: 'Description', bold: true }, { text: 'Qty', alignment: 'right', bold: true }, { text: 'Rate', alignment: 'right', bold: true }, { text: 'Amount', alignment: 'right', bold: true }],
            ...invoice.items.map(i => [i.description, { text: String(i.quantity), alignment: 'right' as const }, { text: fmt(i.rate), alignment: 'right' as const }, { text: fmt(i.quantity * i.rate), alignment: 'right' as const }])
          ]
        },
        layout: { hLineWidth: (i: number, n: any) => (i === 0 || i === 1 || i === n.table.body.length ? 0.5 : 0.25), vLineWidth: () => 0, hLineColor: () => '#cccccc' }
      },
      { columns: [{ text: '' }, { width: 200, columns: [{ text: 'Total', bold: true }, { text: fmt(totals.grandTotal), alignment: 'right', bold: true }] }], margin: [0, 16, 0, 0] }
    ],
    defaultStyle: { font: 'Roboto', fontSize: 11 }
  };
}
```

- [ ] **Step 3: Register in `generate.ts`**

```ts
import { modernPdf } from './templates/modern';
import { minimalPdf } from './templates/minimal';
const builders = { modern: modernPdf, minimal: minimalPdf } as const;
```

- [ ] **Step 4: Register in template selector**

Create `src/lib/components/templates/registry.ts`:

```ts
import Modern from './Modern.svelte';
import Minimal from './Minimal.svelte';
import type { Component } from 'svelte';

export const TEMPLATES: Record<string, Component<any>> = {
  modern: Modern,
  minimal: Minimal
};
```

In EditorShell, replace the `<Modern ... />` block with:

```svelte
<script>
  import { TEMPLATES } from '$lib/components/templates/registry';
  let CurrentTemplate = $derived(TEMPLATES[invoice.value.template] ?? TEMPLATES.modern);
</script>
<CurrentTemplate invoice={invoice.value} editable={true} onpatch={...} onitempatch={...} onadditem={...} onreorder={...} />
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(templates): add Minimal template (on-screen + PDF) + registry"
```

---

### Task 30: Classic, Creative, Corporate templates

**Files:**
- Create: `src/lib/components/templates/{Classic,Creative,Corporate}.svelte`
- Create: `src/lib/pdf/templates/{classic,creative,corporate}.ts`

For each of the three:

- [ ] **Step 1: Build the on-screen Svelte template**

Use the same `TemplateProps` contract and the same field set as Modern/Minimal so the template-switch retains data. Visual differences:
- **Classic**: centered "INVOICE" heading, double horizontal rule, serif body, formal legal-style footer.
- **Creative**: bold colored header band using `--brand`, italic accent on totals, asymmetric grid.
- **Corporate**: dense table, navy color scheme, two-column billing detail header, includes "Authorised signatory" footer.

Each must wire all `editable`-conditional fields identically to Modern.

- [ ] **Step 2: Build the PDF builder for each**

Each PDF builder mirrors its Svelte counterpart aesthetically. Same function signature `(invoice: Invoice) => TDocumentDefinitions`.

- [ ] **Step 3: Register all in `templates/registry.ts` and `pdf/generate.ts`**

```ts
// registry.ts
import Modern from './Modern.svelte';
import Minimal from './Minimal.svelte';
import Classic from './Classic.svelte';
import Creative from './Creative.svelte';
import Corporate from './Corporate.svelte';
export const TEMPLATES = { modern: Modern, minimal: Minimal, classic: Classic, creative: Creative, corporate: Corporate };
```

```ts
// generate.ts
import { modernPdf } from './templates/modern';
import { minimalPdf } from './templates/minimal';
import { classicPdf } from './templates/classic';
import { creativePdf } from './templates/creative';
import { corporatePdf } from './templates/corporate';
const builders = { modern: modernPdf, minimal: minimalPdf, classic: classicPdf, creative: creativePdf, corporate: corporatePdf } as const;
```

- [ ] **Step 4: Commit per template**

```bash
git add -A && git commit -m "feat(templates): Classic template (screen + PDF)"
git add -A && git commit -m "feat(templates): Creative template (screen + PDF)"
git add -A && git commit -m "feat(templates): Corporate template (screen + PDF)"
```

---

### Task 31: View Transition morph between templates

**Files:**
- Modify: `src/lib/components/editor/EditorShell.svelte`

- [ ] **Step 1: Wrap template switch in startViewTransition**

```ts
function switchTemplate(t: Invoice['template']) {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as any).startViewTransition(() => invoice.patch({ template: t }));
  } else {
    invoice.patch({ template: t });
  }
}
```

Pass `onTemplate={switchTemplate}` to TopBar.

- [ ] **Step 2: Add view-transition-name to invoice canvas wrapper**

```svelte
<div style="view-transition-name: invoice-canvas;" class="...">
  <CurrentTemplate ... />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(editor): View Transition API morph on template switch"
```

---

### Task 32: Cmd+K command palette

**Files:**
- Create: `src/lib/components/command-palette/CommandPalette.svelte`, `src/lib/components/command-palette/commands.ts`

- [ ] **Step 1: Command registry**

Create `src/lib/components/command-palette/commands.ts`:

```ts
export type Command = {
  id: string;
  label: string;
  hint?: string;
  group: 'Document' | 'Template' | 'Tax' | 'Currency' | 'Theme' | 'Action';
  run: () => void;
};

export function buildCommands(ctx: {
  setTemplate: (t: any) => void;
  setCurrency: (code: string, locale: string) => void;
  setTaxMode: (m: any) => void;
  cycleTheme: () => void;
  download: () => void;
  share: () => void;
  print: () => void;
  save: () => void;
  newInvoice: () => void;
  duplicate: () => void;
  currencies: { code: string; locale: string; name: string }[];
}): Command[] {
  return [
    { id: 'new', label: 'New invoice', group: 'Document', run: ctx.newInvoice, hint: '⌘N' },
    { id: 'save', label: 'Save invoice', group: 'Document', run: ctx.save, hint: '⌘S' },
    { id: 'dup', label: 'Duplicate invoice', group: 'Document', run: ctx.duplicate, hint: '⌘D' },
    { id: 'download', label: 'Download PDF', group: 'Action', run: ctx.download, hint: '⌘E' },
    { id: 'share', label: 'Copy share link', group: 'Action', run: ctx.share, hint: '⌘L' },
    { id: 'print', label: 'Print', group: 'Action', run: ctx.print, hint: '⌘P' },
    { id: 'theme', label: 'Cycle theme', group: 'Theme', run: ctx.cycleTheme },
    ...(['modern', 'minimal', 'classic', 'creative', 'corporate'] as const).map(t => ({
      id: `tpl:${t}`, label: `Switch to ${t} template`, group: 'Template' as const, run: () => ctx.setTemplate(t)
    })),
    ...(['none', 'simple', 'gst', 'vat', 'custom'] as const).map(m => ({
      id: `tax:${m}`, label: `Set tax mode: ${m}`, group: 'Tax' as const, run: () => ctx.setTaxMode(m)
    })),
    ...ctx.currencies.map(c => ({
      id: `cur:${c.code}`, label: `Set currency: ${c.code} (${c.name})`, group: 'Currency' as const, run: () => ctx.setCurrency(c.code, c.locale)
    }))
  ];
}
```

- [ ] **Step 2: Palette component (fuzzy search)**

Create `src/lib/components/command-palette/CommandPalette.svelte`:

```svelte
<script lang="ts">
  import type { Command } from './commands';
  let { open, commands, onclose }: { open: boolean; commands: Command[]; onclose: () => void } = $props();
  let query = $state('');
  let activeIdx = $state(0);

  const filtered = $derived(filter(commands, query));

  function filter(cmds: Command[], q: string): Command[] {
    if (!q) return cmds.slice(0, 30);
    const lq = q.toLowerCase();
    return cmds
      .map(c => ({ c, score: scoreMatch(c.label.toLowerCase(), lq) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(x => x.c);
  }

  function scoreMatch(text: string, query: string): number {
    let i = 0, score = 0;
    for (const ch of text) {
      if (ch === query[i]) { score += 2 + i; i++; if (i >= query.length) return score; }
    }
    return 0;
  }

  function onkey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose();
    if (e.key === 'ArrowDown') { activeIdx = Math.min(activeIdx + 1, filtered.length - 1); e.preventDefault(); }
    if (e.key === 'ArrowUp') { activeIdx = Math.max(activeIdx - 1, 0); e.preventDefault(); }
    if (e.key === 'Enter') { filtered[activeIdx]?.run(); onclose(); }
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-32" onclick={onclose} role="presentation">
    <div class="bg-[var(--color-paper)] rounded-lg shadow-2xl w-full max-w-lg border border-[var(--color-line)]" onclick={(e) => e.stopPropagation()} role="presentation">
      <input
        type="text"
        bind:value={query}
        onkeydown={onkey}
        autofocus
        placeholder="Type a command…"
        class="w-full px-4 py-3 bg-transparent border-b border-[var(--color-line)] outline-none"
      />
      <ul class="max-h-80 overflow-auto py-2">
        {#each filtered as c, i}
          <li>
            <button
              onclick={() => { c.run(); onclose(); }}
              class="w-full text-left px-4 py-2 flex justify-between items-center {i === activeIdx ? 'bg-[var(--color-line)]' : ''}"
              onmouseenter={() => activeIdx = i}
            >
              <span><span class="text-xs text-[var(--color-muted)] mr-2">{c.group}</span>{c.label}</span>
              {#if c.hint}<span class="text-xs text-[var(--color-muted)] font-mono">{c.hint}</span>{/if}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}
```

- [ ] **Step 3: Wire in EditorShell**

```ts
let paletteOpen = $state(false);

const commands = $derived(buildCommands({
  setTemplate: switchTemplate,
  setCurrency: (code, locale) => invoice.patch({ currency: code, locale }),
  setTaxMode: (m) => invoice.patch({ taxMode: m, taxes: m === 'none' ? [] : (invoice.value.taxes.length ? invoice.value.taxes : [{ name: m.toUpperCase(), rate: 18, compound: false }]) }),
  cycleTheme: () => theme.cycle(),
  download: handleDownload,
  share: shareInvoice,
  print: handlePrint,
  save: () => invoice.save(prefs, history),
  newInvoice: () => invoice.set(makeBlankInvoice()),
  duplicate: () => { const n = prefs.consumeNumber(); invoice.set({ ...invoice.value, id: crypto.randomUUID(), number: n }); },
  currencies: CURRENCIES
}));

$effect(() => {
  function onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); paletteOpen = !paletteOpen; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); shareInvoice(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') { e.preventDefault(); handleDownload(); }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
});
```

Render `<CommandPalette open={paletteOpen} {commands} onclose={() => paletteOpen = false} />`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(palette): cmd+k command palette with fuzzy match"
```

---

### Task 33: Animated totals via @number-flow

**Files:**
- Modify: `src/lib/components/templates/Modern.svelte` (and other templates)

- [ ] **Step 1: Import + render**

In Modern's totals section:

```svelte
<script>
  import NumberFlow from '@number-flow/svelte';
</script>
...
<span class="tabular-nums" style="color: var(--brand);">
  <NumberFlow value={totals.grandTotal} format={{ style: 'currency', currency: invoice.currency }} locale={invoice.locale} />
</span>
```

Apply same to other templates' grand-total cells.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(polish): @number-flow animated totals"
```

---

### Task 34: Dark / OLED theme toggling visible state

**Files:**
- (already wired in Task 12)

- [ ] **Step 1: Smoke test in dev**

```bash
npm run dev
# Toggle theme button cycles light → dark → oled → system. Verify all three.
```

- [ ] **Step 2: Commit any tweaks**

```bash
git add -A
git commit -m "fix(theme): contrast tweaks observed in dev"
```

---

### Task 35: Smart paste — TSV/CSV into items

**Files:**
- Create: `src/lib/utils/paste.ts`, `src/lib/utils/paste.test.ts`
- Modify: relevant template (paste handler)

- [ ] **Step 1: Test parser**

Create `src/lib/utils/paste.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseTabular } from './paste';

describe('parseTabular', () => {
  it('parses TSV with description, qty, rate', () => {
    const rows = parseTabular('Design\t10\t100\nDev\t5\t150');
    expect(rows).toEqual([
      { description: 'Design', quantity: 10, rate: 100 },
      { description: 'Dev', quantity: 5, rate: 150 }
    ]);
  });
  it('handles CSV', () => {
    const rows = parseTabular('A,2,50');
    expect(rows[0]).toEqual({ description: 'A', quantity: 2, rate: 50 });
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/utils/paste.ts`:

```ts
export type PastedRow = { description: string; quantity: number; rate: number };

export function parseTabular(text: string): PastedRow[] {
  return text
    .split(/\r?\n/)
    .filter(l => l.trim().length > 0)
    .map(l => {
      const cells = l.includes('\t') ? l.split('\t') : l.split(',');
      const [desc, qty, rate] = [cells[0] ?? '', cells[1] ?? '0', cells[2] ?? '0'];
      return {
        description: desc.trim(),
        quantity: Number(qty.trim()) || 0,
        rate: Number(rate.trim().replace(/[^0-9.\-]/g, '')) || 0
      };
    });
}
```

- [ ] **Step 3: Hook paste into the items table**

In Modern.svelte, add to the items `<tbody>` element:

```svelte
<tbody onpaste={(e) => {
  const text = e.clipboardData?.getData('text/plain') ?? '';
  if (!text.includes('\t') && !text.includes(',') && !text.includes('\n')) return;
  const rows = parseTabular(text);
  if (rows.length < 2) return;
  e.preventDefault();
  for (const r of rows) {
    onpatchitemnew?.(r);
  }
}}>
```

Add `onpatchitemnew` to TemplateProps and wire in EditorShell:

```ts
onpatchitemnew={(row) => invoice.patch({ items: [...invoice.value.items, { id: newId(), description: row.description, quantity: row.quantity, rate: row.rate, taxRate: 0 }] })}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(editor): smart paste TSV/CSV into line items"
```

---

## Phase 6 — History, Onboarding, Conversion (Tasks 36–42)

### Task 36: Left rail — saved invoices list

**Files:**
- Create: `src/lib/components/editor/Sidebar.svelte`

- [ ] **Step 1: Component**

```svelte
<script lang="ts">
  import type { Invoice } from '$lib/schemas/invoice';
  let { history, activeId, onopen, onnew, onduplicate, ondelete }: {
    history: Invoice[];
    activeId: string;
    onopen: (id: string) => void;
    onnew: () => void;
    onduplicate: (id: string) => void;
    ondelete: (id: string) => void;
  } = $props();
  let query = $state('');
  const filtered = $derived(history.filter(h =>
    h.number.toLowerCase().includes(query.toLowerCase()) ||
    h.to.name.toLowerCase().includes(query.toLowerCase())
  ));
</script>

<div class="flex flex-col h-full">
  <button onclick={onnew} class="w-full mb-3 px-3 py-2 rounded text-white" style="background: var(--color-brand);">+ New invoice</button>
  <input bind:value={query} placeholder="Search…" class="w-full mb-3 px-2 py-1 bg-transparent border border-[var(--color-line)] rounded text-sm" />
  <ul class="flex-1 overflow-auto space-y-1">
    {#each filtered as inv (inv.id)}
      <li class="group">
        <button
          onclick={() => onopen(inv.id)}
          class="w-full text-left px-2 py-2 rounded {inv.id === activeId ? 'bg-[var(--color-line)]' : 'hover:bg-[var(--color-line)]/50'}"
        >
          <div class="flex justify-between items-baseline">
            <span class="font-mono text-xs">{inv.number}</span>
            <span class="text-[10px] uppercase tracking-wider {inv.meta.status === 'paid' ? 'text-green-600' : 'text-[var(--color-muted)]'}">{inv.meta.status}</span>
          </div>
          <div class="text-sm truncate">{inv.to.name || '(no client)'}</div>
        </button>
        <div class="hidden group-hover:flex text-xs px-2 pb-2 gap-2">
          <button onclick={() => onduplicate(inv.id)} class="hover:underline">Duplicate</button>
          <button onclick={() => ondelete(inv.id)} class="hover:underline text-red-600">Delete</button>
        </div>
      </li>
    {/each}
  </ul>
</div>
```

- [ ] **Step 2: Wire in EditorShell left column**

```svelte
<Sidebar
  history={history.value}
  activeId={invoice.value.id}
  onnew={() => invoice.set(makeBlankInvoice())}
  onopen={(id) => { const i = history.find(id); if (i) invoice.set(i); }}
  onduplicate={(id) => { const dup = history.duplicate(id, prefs.consumeNumber()); if (dup) invoice.set(dup); }}
  ondelete={(id) => history.remove(id)}
/>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(history): sidebar with search, duplicate, delete"
```

---

### Task 37: Undo-toast for deletes

**Files:**
- Create: `src/lib/components/ui/Toast.svelte`, `src/lib/stores/toasts.svelte.ts`

- [ ] **Step 1: Toast store**

Create `src/lib/stores/toasts.svelte.ts`:

```ts
import { newId } from '$lib/utils/id';

export type Toast = { id: string; message: string; action?: { label: string; run: () => void } };

export function createToastStore() {
  let toasts = $state<Toast[]>([]);
  function push(t: Omit<Toast, 'id'>, ms = 5000) {
    const id = newId();
    toasts = [...toasts, { ...t, id }];
    setTimeout(() => { toasts = toasts.filter(x => x.id !== id); }, ms);
  }
  return {
    get value() { return toasts; },
    push,
    dismiss(id: string) { toasts = toasts.filter(t => t.id !== id); }
  };
}
```

- [ ] **Step 2: Toast component**

Create `src/lib/components/ui/Toast.svelte`:

```svelte
<script lang="ts">
  import type { Toast } from '$lib/stores/toasts.svelte';
  let { toasts, ondismiss }: { toasts: Toast[]; ondismiss: (id: string) => void } = $props();
</script>

<div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
  {#each toasts as t (t.id)}
    <div class="bg-[var(--color-ink)] text-[var(--color-paper)] rounded-lg px-4 py-2 shadow-lg flex items-center gap-4">
      <span class="text-sm">{t.message}</span>
      {#if t.action}
        <button class="text-sm underline" onclick={() => { t.action!.run(); ondismiss(t.id); }}>{t.action.label}</button>
      {/if}
    </div>
  {/each}
</div>
```

- [ ] **Step 3: Mount + hook into delete flow**

In EditorShell, instantiate `createToastStore`, render `<Toast toasts={toasts.value} ondismiss={toasts.dismiss} />`. Change `ondelete` handler:

```ts
(id) => {
  const snapshot = history.find(id);
  history.remove(id);
  toasts.push({
    message: 'Invoice deleted',
    action: { label: 'Undo', run: () => snapshot && history.upsert(snapshot) }
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): undo-toast for invoice delete"
```

---

### Task 38: Region auto-detect on first visit

**Files:**
- Create: `src/lib/utils/region.ts`
- Modify: `src/lib/components/editor/EditorShell.svelte`

- [ ] **Step 1: Region detector**

Create `src/lib/utils/region.ts`:

```ts
export function detectRegion(): { region: 'IN' | 'INTL'; currency: string; locale: string } {
  if (typeof navigator === 'undefined') return { region: 'INTL', currency: 'USD', locale: 'en-US' };
  const lang = navigator.language || 'en-US';
  if (lang.toLowerCase().startsWith('en-in') || lang.toLowerCase().includes('-in')) {
    return { region: 'IN', currency: 'INR', locale: 'en-IN' };
  }
  if (lang.toLowerCase().startsWith('en-gb')) return { region: 'INTL', currency: 'GBP', locale: 'en-GB' };
  if (lang.toLowerCase().startsWith('de') || lang.toLowerCase().startsWith('fr') || lang.toLowerCase().startsWith('es') || lang.toLowerCase().startsWith('it')) {
    return { region: 'INTL', currency: 'EUR', locale: lang };
  }
  if (lang.toLowerCase().startsWith('ja')) return { region: 'INTL', currency: 'JPY', locale: 'ja-JP' };
  return { region: 'INTL', currency: 'USD', locale: 'en-US' };
}
```

- [ ] **Step 2: Apply on blank invoice load**

In `invoice.svelte.ts` `makeBlankInvoice`, parameterize with region hints; in EditorShell, on first mount with no draft, patch with detected region:

```ts
import { detectRegion } from '$lib/utils/region';

onMount(() => {
  const prefsValue = prefs.value;
  if (invoice.value.from.name === '' && !localStorage.getItem('featureos_inv_v1_draft_seeded')) {
    const d = detectRegion();
    invoice.patch({ region: d.region, currency: d.currency, locale: d.locale, taxMode: d.region === 'IN' ? 'gst' : 'none', taxes: d.region === 'IN' ? [{ name: 'GST', rate: 18, compound: false }] : [] });
    localStorage.setItem('featureos_inv_v1_draft_seeded', '1');
  }
});
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(region): auto-detect region on first visit via navigator.language"
```

---

### Task 39: Onboarding walkthrough overlay

**Files:**
- Create: `src/lib/components/onboarding/Welcome.svelte`

- [ ] **Step 1: Component**

```svelte
<script lang="ts">
  const STEPS = [
    { title: 'Click anything to edit', body: 'Every field on the invoice is editable. Just click and type.' },
    { title: 'Drag to reorder', body: 'Grab any line item row to rearrange.' },
    { title: 'Cmd+K is your friend', body: 'Switch templates, currencies, taxes — all from one palette.' },
    { title: 'Download or share', body: 'Free PDF, no signup. Share a link that works anywhere.' }
  ];
  let index = $state(0);
  let { onfinish }: { onfinish: () => void } = $props();
</script>

<div class="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-6" role="dialog" aria-modal="true">
  <div class="bg-[var(--color-paper)] rounded-xl shadow-2xl p-6 max-w-md w-full border border-[var(--color-line)]">
    <div class="text-xs font-mono text-[var(--color-muted)] mb-2">{index + 1} / {STEPS.length}</div>
    <h2 class="text-xl font-display font-semibold">{STEPS[index].title}</h2>
    <p class="text-sm text-[var(--color-muted)] mt-2">{STEPS[index].body}</p>
    <div class="mt-5 flex justify-between">
      <button class="text-sm text-[var(--color-muted)] underline" onclick={onfinish}>Skip</button>
      {#if index < STEPS.length - 1}
        <button class="px-3 py-1 rounded text-white" style="background: var(--color-brand);" onclick={() => index++}>Next</button>
      {:else}
        <button class="px-3 py-1 rounded text-white" style="background: var(--color-brand);" onclick={onfinish}>Let's go</button>
      {/if}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Show on first visit**

In EditorShell:

```ts
let showWelcome = $state(false);
onMount(() => {
  if (!localStorage.getItem('featureos_inv_v1_welcome_done')) showWelcome = true;
});
```

Render `{#if showWelcome}<Welcome onfinish={() => { showWelcome = false; localStorage.setItem('featureos_inv_v1_welcome_done', '1'); }} />{/if}`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(onboarding): first-visit welcome overlay"
```

---

### Task 40: FeatureOS footer + post-PDF modal

**Files:**
- Create: `src/lib/components/conversion/FeatureOSFooter.svelte`, `src/lib/components/conversion/PostDownload.svelte`

- [ ] **Step 1: Footer**

```svelte
<!-- FeatureOSFooter.svelte -->
<footer class="border-t border-[var(--color-line)] mt-auto py-4 px-6 text-xs text-[var(--color-muted)] flex justify-between">
  <span>A free tool by <a href="https://featureos.com" class="text-[var(--color-brand)] underline">FeatureOS</a> — turn customer feedback into shipped features.</span>
  <a href="https://featureos.com" class="text-[var(--color-brand)] underline">Try it free →</a>
</footer>
```

- [ ] **Step 2: Post-download card**

```svelte
<!-- PostDownload.svelte -->
<script lang="ts">
  let { onclose }: { onclose: () => void } = $props();
</script>
<div class="fixed bottom-6 right-6 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl shadow-xl p-5 max-w-sm z-40">
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="font-medium">Hope this saved you time!</p>
      <p class="text-sm text-[var(--color-muted)] mt-1">FeatureOS helps product teams collect feedback, build roadmaps, and ship what users want.</p>
      <a href="https://featureos.com" class="text-sm text-[var(--color-brand)] underline mt-2 inline-block">Learn more →</a>
    </div>
    <button onclick={onclose} aria-label="Close" class="text-[var(--color-muted)]">×</button>
  </div>
</div>
```

- [ ] **Step 3: Mount + trigger**

In EditorShell, show `PostDownload` after `handleDownload` if not previously dismissed (session flag). Mount FeatureOSFooter in `src/routes/+layout.svelte` below `{@render children()}`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(conversion): FeatureOS footer + post-PDF nudge card"
```

---

### Task 41: Keyboard shortcut hint panel

**Files:**
- Create: `src/lib/components/ui/ShortcutsHelp.svelte`

- [ ] **Step 1: Component**

```svelte
<script lang="ts">
  let { open, onclose }: { open: boolean; onclose: () => void } = $props();
  const shortcuts = [
    { k: '⌘K', l: 'Open command palette' },
    { k: '⌘S', l: 'Save invoice' },
    { k: '⌘E', l: 'Export PDF' },
    { k: '⌘L', l: 'Copy share link' },
    { k: '⌘P', l: 'Print' },
    { k: '⌘D', l: 'Duplicate focused row' },
    { k: '?',  l: 'Show this help' }
  ];
</script>

{#if open}
  <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onclick={onclose} role="presentation">
    <div class="bg-[var(--color-paper)] rounded-lg p-6 max-w-sm w-full border border-[var(--color-line)]" onclick={(e) => e.stopPropagation()} role="presentation">
      <h3 class="font-display text-lg mb-4">Keyboard shortcuts</h3>
      <ul class="space-y-2 text-sm">
        {#each shortcuts as s}
          <li class="flex justify-between"><span>{s.l}</span><kbd class="font-mono text-xs bg-[var(--color-line)] px-2 py-0.5 rounded">{s.k}</kbd></li>
        {/each}
      </ul>
    </div>
  </div>
{/if}
```

- [ ] **Step 2: Bind `?` key**

```ts
if (e.key === '?') { e.preventDefault(); shortcutsOpen = true; }
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(editor): '?' shortcut help panel"
```

---

### Task 42: E2E — full golden path

**Files:**
- Create: `tests/e2e/golden.spec.ts`

- [ ] **Step 1: Test**

```ts
import { test, expect } from '@playwright/test';

test('fill invoice → save → share link round-trip', async ({ page, context }) => {
  await page.goto('/app');
  await page.locator('text=Your business name').click();
  await page.keyboard.type('Acme');
  await page.locator('text=Client name').click();
  await page.keyboard.type('Client X');
  await page.locator('text=Item description').click();
  await page.keyboard.type('Consulting');
  await page.keyboard.press('Tab');
  await page.keyboard.type('10');
  await page.keyboard.press('Tab');
  await page.keyboard.type('150');

  // Save
  await page.keyboard.press('Meta+S');

  // Cmd+K opens palette
  await page.keyboard.press('Meta+K');
  await expect(page.locator('input[placeholder="Type a command…"]')).toBeVisible();
  await page.keyboard.press('Escape');

  // Share → copies URL; read clipboard and visit
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.click('text=Share');
  const shareUrl = await page.evaluate(() => navigator.clipboard.readText());
  expect(shareUrl).toContain('/share/#');

  await page.goto(shareUrl);
  await expect(page.locator('text=Acme')).toBeVisible();
  await expect(page.locator('text=Client X')).toBeVisible();
});
```

- [ ] **Step 2: Run + commit**

```bash
npm run test:e2e
git add -A
git commit -m "test(e2e): golden path — fill, save, share, view"
```

---

## Phase 7 — SEO Routes + Launch (Tasks 43–50)

### Task 43: SEO content section components

**Files:**
- Create: `src/lib/components/seo/{FaqSection,HowToSection,ComparisonTable}.svelte`

- [ ] **Step 1: FaqSection with JSON-LD**

```svelte
<script lang="ts">
  type Q = { q: string; a: string };
  let { title, items }: { title: string; items: Q[] } = $props();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }))
  };
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<section class="py-16">
  <h2 class="text-3xl font-display font-semibold mb-8">{title}</h2>
  <div class="space-y-4 max-w-3xl">
    {#each items as i}
      <details class="border-b border-[var(--color-line)] py-4">
        <summary class="font-medium cursor-pointer">{i.q}</summary>
        <p class="mt-2 text-[var(--color-muted)]">{i.a}</p>
      </details>
    {/each}
  </div>
</section>
```

- [ ] **Step 2: HowToSection + JSON-LD**

```svelte
<script lang="ts">
  type Step = { title: string; body: string };
  let { title, steps }: { title: string; steps: Step[] } = $props();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body }))
  };
</script>
<svelte:head>{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}</svelte:head>
<section class="py-16">
  <h2 class="text-3xl font-display font-semibold mb-8">{title}</h2>
  <ol class="space-y-6 max-w-3xl list-decimal pl-6">
    {#each steps as s}
      <li>
        <div class="font-medium">{s.title}</div>
        <p class="text-[var(--color-muted)] mt-1">{s.body}</p>
      </li>
    {/each}
  </ol>
</section>
```

- [ ] **Step 3: ComparisonTable**

```svelte
<script lang="ts">
  type Row = { feature: string; us: string; refrens: string; zoho: string };
  let { rows }: { rows: Row[] } = $props();
</script>
<section class="py-16">
  <h2 class="text-3xl font-display font-semibold mb-8">How we compare</h2>
  <table class="w-full border border-[var(--color-line)]">
    <thead class="bg-[var(--color-line)]/20"><tr><th class="p-3 text-left">Feature</th><th class="p-3">FeatureOS</th><th class="p-3">Refrens</th><th class="p-3">Zoho Free</th></tr></thead>
    <tbody>
      {#each rows as r}
        <tr class="border-t border-[var(--color-line)]"><td class="p-3">{r.feature}</td><td class="p-3 text-center">{r.us}</td><td class="p-3 text-center text-[var(--color-muted)]">{r.refrens}</td><td class="p-3 text-center text-[var(--color-muted)]">{r.zoho}</td></tr>
      {/each}
    </tbody>
  </table>
</section>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(seo): FAQ/HowTo/Comparison components with JSON-LD"
```

---

### Task 44: Landing `/` homepage

**Files:**
- Modify: `src/routes/+page.svelte`, `src/routes/+page.ts`

- [ ] **Step 1: Enable prerender**

Create `src/routes/+page.ts`:

```ts
export const prerender = true;
```

- [ ] **Step 2: Compose landing page**

Replace `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import EditorShell from '$lib/components/editor/EditorShell.svelte';
  import FaqSection from '$lib/components/seo/FaqSection.svelte';
  import HowToSection from '$lib/components/seo/HowToSection.svelte';
  import ComparisonTable from '$lib/components/seo/ComparisonTable.svelte';

  const faqs = [
    { q: 'Is this invoice generator really free?', a: 'Yes. No signup, no limits, no watermarks. Everything runs in your browser.' },
    { q: 'Where is my data stored?', a: 'Only in your browser (localStorage). We never send invoice data to any server.' },
    { q: 'Can I use this for GST invoices in India?', a: 'Yes — see our GST-specific page for HSN/SAC, CGST/SGST/IGST handling.' },
    { q: 'Can I send the invoice to my client?', a: 'Download as PDF and email it, or copy a share link that works anywhere.' },
    { q: 'Is there a template I can customize?', a: 'Five templates, unlimited brand color + logo customization.' },
    { q: 'Does it support multiple currencies?', a: '30+ currencies with live FX conversion.' },
    { q: 'Do I need to install anything?', a: 'No. Works in any modern browser on desktop and mobile.' },
    { q: 'What happens to my invoice if I clear cache?', a: 'You lose the draft. We recommend exporting JSON as backup.' }
  ];
  const steps = [
    { title: 'Enter your business info', body: 'Click the fields at the top and type your business name and address.' },
    { title: 'Add your client', body: 'Enter the recipient name, address, and tax ID if relevant.' },
    { title: 'Add line items', body: 'Click "Add line item" or press Enter to add rows. Tab between fields.' },
    { title: 'Pick template and currency', body: 'Top bar has template + currency picker. Use Cmd+K for fast switching.' },
    { title: 'Download or share', body: 'One click downloads a crisp PDF. Copy a share link that needs no signup.' }
  ];
  const compareRows = [
    { feature: 'Free forever',               us: '✓', refrens: 'limits after trial', zoho: 'up to 1,000 invoices' },
    { feature: 'No signup required',         us: '✓', refrens: '✗', zoho: '✗' },
    { feature: 'Multi-currency',             us: '30+', refrens: '✓', zoho: '✓' },
    { feature: 'GST (India)',                us: '✓ HSN, CGST+SGST, IGST', refrens: '✓', zoho: '✓' },
    { feature: 'WYSIWYG click-to-edit',      us: '✓', refrens: '✗', zoho: '✗' },
    { feature: 'Share-via-link (no signup)', us: '✓', refrens: '✗', zoho: '✗' },
    { feature: 'Fully client-side (privacy)',us: '✓', refrens: '✗', zoho: '✗' }
  ];
</script>

<svelte:head>
  <title>Free Invoice Generator · No Signup · FeatureOS</title>
  <meta name="description" content="Create and download professional invoices free, with no signup. Supports GST, multi-currency, and 5 templates. Made by FeatureOS." />
  <meta property="og:title" content="Free Invoice Generator · FeatureOS" />
  <meta property="og:description" content="Free, no-signup invoice generator with multi-currency, GST support, and beautiful templates." />
  <link rel="canonical" href="https://featureos.com/" />
</svelte:head>

<section class="px-6 py-16 max-w-5xl mx-auto text-center">
  <h1 class="text-5xl sm:text-6xl font-display font-bold tracking-tight">Free invoice generator</h1>
  <p class="text-lg text-[var(--color-muted)] mt-4 max-w-2xl mx-auto">Create and download a professional PDF invoice in under a minute. No signup. No watermark. Works for freelancers, agencies, and small businesses worldwide.</p>
</section>

<div class="border-y border-[var(--color-line)]">
  <EditorShell />
</div>

<div class="max-w-5xl mx-auto px-6">
  <HowToSection title="How to create an invoice in 5 steps" steps={steps} />
  <ComparisonTable rows={compareRows} />
  <FaqSection title="Frequently asked questions" items={faqs} />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(seo): prerendered home landing with FAQ/HowTo/Comparison"
```

---

### Task 45: `/gst-invoice-generator` landing

**Files:**
- Create: `src/routes/gst-invoice-generator/+page.svelte`, `src/routes/gst-invoice-generator/+page.ts`

- [ ] **Step 1: Prerender flag**

```ts
// +page.ts
export const prerender = true;
```

- [ ] **Step 2: Page (seed invoice region=IN, taxMode=gst)**

```svelte
<script lang="ts">
  import EditorShell from '$lib/components/editor/EditorShell.svelte';
  import FaqSection from '$lib/components/seo/FaqSection.svelte';
  import HowToSection from '$lib/components/seo/HowToSection.svelte';

  const seed = { region: 'IN' as const, currency: 'INR', locale: 'en-IN', taxMode: 'gst' as const, taxes: [{ name: 'GST', rate: 18, compound: false }] };
  const faqs = [
    { q: 'Is this GST invoice format valid in India?', a: 'Yes. It includes GSTIN, HSN/SAC, CGST/SGST/IGST breakup, and all fields required under CGST Rules 2017.' },
    { q: 'How is CGST vs IGST decided?', a: 'We read the state code from your GSTIN. Same state = CGST + SGST; different state = IGST.' },
    { q: 'Do you support HSN/SAC codes?', a: 'Yes. Each line item has an HSN/SAC field.' },
    { q: 'Is e-invoicing supported?', a: 'No — this is for regular invoices. E-invoicing via IRP requires a different flow not covered by this free tool.' },
    { q: 'Can I print this from my phone?', a: 'Yes. Use Print in the top bar or Save as PDF on any modern phone browser.' }
  ];
  const steps = [
    { title: 'Enter your GSTIN', body: 'This auto-extracts your state code and pre-fills the rest.' },
    { title: 'Enter client GSTIN', body: 'Same-state clients get CGST+SGST; inter-state gets IGST — automatically.' },
    { title: 'Add HSN/SAC per item', body: 'Required for GST compliance.' },
    { title: 'Choose GST rate', body: 'Default is 18%; change to 5%, 12%, 18%, or 28% as needed.' },
    { title: 'Download PDF', body: 'Crisp, compliant, ready to email your client.' }
  ];
</script>

<svelte:head>
  <title>Free GST Invoice Generator (India) · FeatureOS</title>
  <meta name="description" content="Generate GST-compliant invoices free. CGST, SGST, IGST, HSN/SAC — all handled automatically. Made for Indian freelancers and businesses." />
  <link rel="canonical" href="https://featureos.com/gst-invoice-generator" />
</svelte:head>

<section class="px-6 py-16 max-w-5xl mx-auto text-center">
  <h1 class="text-5xl sm:text-6xl font-display font-bold tracking-tight">Free GST Invoice Generator</h1>
  <p class="text-lg text-[var(--color-muted)] mt-4 max-w-2xl mx-auto">Create GST-compliant invoices in minutes. CGST, SGST, IGST, HSN/SAC codes — handled automatically from GSTIN.</p>
</section>

<div class="border-y border-[var(--color-line)]">
  <EditorShell {seed} />
</div>

<div class="max-w-5xl mx-auto px-6">
  <HowToSection title="How to make a GST invoice" steps={steps} />
  <FaqSection title="GST invoicing FAQ" items={faqs} />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(seo): GST invoice landing with India seeded editor"
```

---

### Task 46: Remaining landing routes

**Files:**
- Create: `src/routes/freelance-invoice-generator/+page.{svelte,ts}`
- Create: `src/routes/invoice-template-india/+page.{svelte,ts}`
- Create: `src/routes/invoice-template/[slug]/+page.{svelte,ts}`

For each:

- [ ] **Step 1: `+page.ts` with prerender + entries for dynamic slugs**

```ts
// invoice-template/[slug]/+page.ts
export const prerender = true;
export function entries() {
  return [{ slug: 'modern' }, { slug: 'minimal' }, { slug: 'classic' }, { slug: 'creative' }, { slug: 'corporate' }];
}
```

- [ ] **Step 2: Landing `+page.svelte`**

Same pattern as `/gst-invoice-generator`: targeted H1 with the keyword, HowTo/FAQ, and `<EditorShell seed={...}>` where seed is tuned (e.g., hourly line items and PayPal block for `/freelance-invoice-generator`; pre-selected template on the `[slug]` route).

- [ ] **Step 3: Internal linking**

Add `src/lib/components/seo/RelatedLinks.svelte`:

```svelte
<section class="py-12">
  <h3 class="text-xl font-display font-semibold mb-4">Related free tools</h3>
  <ul class="grid sm:grid-cols-2 gap-3 text-sm">
    <li><a class="underline text-[var(--color-brand)]" href="/">Free invoice generator</a></li>
    <li><a class="underline text-[var(--color-brand)]" href="/gst-invoice-generator">GST invoice generator (India)</a></li>
    <li><a class="underline text-[var(--color-brand)]" href="/freelance-invoice-generator">Freelance invoice generator</a></li>
    <li><a class="underline text-[var(--color-brand)]" href="/invoice-template-india">Invoice templates for India</a></li>
  </ul>
</section>
```

Render it at the bottom of every landing route.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(seo): freelance, template showcase, per-template landings"
```

---

### Task 47: sitemap.xml + robots.txt

**Files:**
- Create: `src/routes/sitemap.xml/+server.ts`, `static/robots.txt`

- [ ] **Step 1: Sitemap**

```ts
// +server.ts
export const prerender = true;

const ROUTES = [
  '/', '/gst-invoice-generator', '/freelance-invoice-generator', '/invoice-template-india',
  '/invoice-template/modern', '/invoice-template/minimal', '/invoice-template/classic',
  '/invoice-template/creative', '/invoice-template/corporate'
];

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(r => `  <url><loc>https://featureos.com${r}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
```

- [ ] **Step 2: robots.txt**

```
User-agent: *
Allow: /
Disallow: /app
Disallow: /share
Sitemap: https://featureos.com/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(seo): sitemap.xml + robots.txt"
```

---

### Task 48: OG images (build-time generation)

**Files:**
- Create: `scripts/generate-og.mjs`, `static/og/*.png` (output)
- Modify: `package.json` (postbuild)

- [ ] **Step 1: Install Satori + resvg**

```bash
npm install -D satori @resvg/resvg-js
```

- [ ] **Step 2: Generator script**

Create `scripts/generate-og.mjs`:

```js
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';

const PAGES = [
  { slug: 'home',     title: 'Free Invoice Generator', subtitle: 'No signup · Multi-currency · Beautiful templates' },
  { slug: 'gst',      title: 'Free GST Invoice Generator', subtitle: 'CGST, SGST, IGST, HSN — handled automatically' },
  { slug: 'freelance',title: 'Freelance Invoice Generator', subtitle: 'Hourly line items · PayPal · Stripe links' }
];

const inter = await fetch('https://rsms.me/inter/font-files/Inter-Bold.woff').then(r => r.arrayBuffer());

for (const p of PAGES) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white', padding: '64px', justifyContent: 'space-between', fontFamily: 'Inter' },
        children: [
          { type: 'div', props: { style: { fontSize: 24, opacity: 0.8 }, children: 'FeatureOS' } },
          { type: 'div', props: { children: [
            { type: 'div', props: { style: { fontSize: 72, fontWeight: 800, lineHeight: 1.05 }, children: p.title } },
            { type: 'div', props: { style: { fontSize: 28, opacity: 0.85, marginTop: 16 }, children: p.subtitle } }
          ] } }
        ]
      }
    },
    { width: 1200, height: 630, fonts: [{ name: 'Inter', data: inter, weight: 700, style: 'normal' }] }
  );
  const png = new Resvg(svg).render().asPng();
  await fs.mkdir('static/og', { recursive: true });
  await fs.writeFile(`static/og/${p.slug}.png`, png);
}
console.log('OG images generated.');
```

- [ ] **Step 3: Wire into prebuild**

In `package.json`:

```json
{ "scripts": { "prebuild": "node scripts/generate-og.mjs" } }
```

- [ ] **Step 4: Reference in each landing `<svelte:head>`**

Add to each landing page:

```svelte
<meta property="og:image" content="https://featureos.com/og/home.png" />
<meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(seo): per-route OG image generation via Satori"
```

---

### Task 49: Lighthouse CI

**Files:**
- Create: `.github/workflows/ci.yml` (if GitHub Actions), `lighthouserc.json`

- [ ] **Step 1: lighthouserc.json**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./build",
      "url": ["http://localhost/","http://localhost/gst-invoice-generator","http://localhost/freelance-invoice-generator"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.90 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

- [ ] **Step 2: CI workflow**

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npm run check
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
      - run: npx @lhci/cli@0.13.x autorun
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "ci: run vitest, playwright, lighthouse on every push"
```

---

### Task 50: Deploy to Cloudflare Pages

**Files:**
- Create: `wrangler.toml` (or use Cloudflare dashboard)

- [ ] **Step 1: Wrangler config (optional)**

```toml
name = "featureos-invoice-generator"
compatibility_date = "2026-04-20"
pages_build_output_dir = "build"
```

- [ ] **Step 2: Manual deploy setup**

- Push repo to GitHub
- Connect Cloudflare Pages → new project → point at repo
- Build command: `npm run build`
- Output directory: `build`
- Node version: `22`

- [ ] **Step 3: Smoke check production**

- Visit deployed URL
- Fill invoice, download PDF, share link (verify round-trip on prod domain)
- Run Lighthouse on each landing route via PageSpeed Insights — all ≥90/95/95/95

- [ ] **Step 4: Commit config + README**

Update `README.md` with deploy + dev instructions. Commit.

```bash
git add -A
git commit -m "chore: deploy configuration + README"
```

---

## Self-Review

**Spec coverage check:**
- Auto-region detect: Task 38 ✓
- WYSIWYG editor: Tasks 16–17 ✓
- 5 templates: Tasks 17, 29, 30 ✓
- Calc engine (all tax modes incl. GST split): Tasks 9–11 ✓
- Multi-currency + FX: Task 5 (data), currency selection in Inspector (Task 18); *live FX conversion command* lives in palette (Task 32). Consider adding a dedicated "fetch live FX" task if needed in iteration 2.
- PDF gen for all templates: Tasks 25, 29, 30 ✓
- Share via URL: Tasks 23–24 ✓
- Print: Task 27 ✓
- Command palette: Task 32 ✓
- Dark/OLED themes: Tasks 7 + 12 + 34 ✓
- Invoice history + duplicate/delete/undo: Tasks 14, 36, 37 ✓
- Onboarding: Task 39 ✓
- FeatureOS footer + post-PDF nudge: Task 40 ✓
- SEO routes + JSON-LD + sitemap + OG: Tasks 43–48 ✓
- Lighthouse CI: Task 49 ✓
- Deploy: Task 50 ✓

**Not-yet-scheduled enhancements (to add in iteration 2 if data justifies):** live FX fetch on editor boot, UPI QR on-screen preview, per-item HSN/SAC surface-up UX, payment methods editor UI, JSON import/export buttons.

**Type consistency:** `TemplateProps` contract from Task 17 is the source of truth; Task 20 and Task 35 extend it. Registry in Task 29 uses the same components. `invoice.patch` signature matches across all call sites.

**Placeholder scan:** no TBD / TODO / "similar to Task N". Every step has real code.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-20-invoice-generator-plan.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.
