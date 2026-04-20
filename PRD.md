# FeatureOS Invoice Generator — Product Requirements Document

**Owner:** karthik@skcript.com
**Date:** 2026-04-20
**Status:** Approved for implementation
**Spec source of truth:** This file (`PRD.md`). Mirror copy at `docs/superpowers/specs/2026-04-20-invoice-generator-design.md`.

---

## 1. Purpose & Strategy

A free, no-signup, browser-based invoice generator hosted on `featureos.com` to drive organic SEO traffic and brand awareness for FeatureOS.

**Why this tool:**
- "Invoice generator" and adjacent keywords ("free invoice generator", "gst invoice generator", "invoice template india") have very high monthly search volume globally and especially in India.
- A genuinely useful free tool earns natural backlinks, social shares, and brand recall — all of which lift the FeatureOS domain authority.
- The tool's "share invoice via link" feature creates outbound viral surface area: every shared invoice URL is a soft impression for FeatureOS.

**Success criteria (90 days post-launch):**
- 5,000+ monthly organic sessions to the tool routes
- Top 20 Google ranking for at least 3 of: "free invoice generator", "gst invoice generator", "invoice template india", "freelance invoice generator"
- ≥2% click-through rate from tool routes to the FeatureOS product pages
- ≥50 natural inbound links earned (no outreach)

**Non-goals:**
- This is **not** a billing/SaaS product. No accounts. No payments processed. No persistence beyond the user's browser.
- We do not compete with Zoho/QuickBooks. We compete with `invoice-generator.com` and `refrens.com/free-invoice-generator`.

---

## 2. Target Users

| Persona | Region | Primary need | Default settings |
|---|---|---|---|
| Indian freelancer / small agency | IN | GST-compliant invoice with HSN/SAC, INR, UPI QR | Region: India, Currency: INR, Tax: GST |
| Global freelancer / solopreneur | US/EU/UK/Global | Clean invoice, multi-currency, PayPal/Stripe link | Region: International, Currency: USD/EUR/GBP, Tax: Simple/VAT |
| SMB owner | Both | Quick one-off invoice for a client | Region auto-detected, sensible defaults |

Region is **auto-detected** by IP/locale on first load (with one-click override). India users see GST fields immediately; everyone else sees the international flow. No mode-switcher friction.

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **SvelteKit 2** with `adapter-static` | Prerendered SEO landing pages + SPA editor in one codebase. Static deploy, zero server cost. |
| UI runtime | **Svelte 5** (runes mode: `$state`, `$derived`, `$effect`) | Reactive state without external libs. |
| Language | **TypeScript** (strict) | Catch shape errors in the invoice data model early. |
| Styling | **Tailwind CSS v4** + CSS variables for theming | Fast iteration, design tokens, dark mode trivial. |
| PDF generation | **pdfmake** | Vector PDFs (selectable text, embeddable fonts, native QR support). Pure client-side. |
| Compression | **lz-string** | Encode invoice JSON for share-via-URL (~6× compression). |
| QR codes | **qrcode** | UPI/payment QR embedded in PDFs and on-screen. |
| Validation | **zod** | Runtime validation of localStorage, imported JSON, decoded share URLs. |
| Fonts | **@fontsource** (Inter, Space Grotesk, IBM Plex Serif, Geist Mono) | Self-hosted; no Google Fonts CDN (privacy + perf). |
| Date | **dayjs** | Lightweight (~7 kB) vs. date-fns. |
| IDs | **nanoid** | Compact unique IDs for items & invoices. |
| Animation | **@number-flow/svelte** + native View Transition API + **canvas-confetti** | Polished moments without animation framework bloat. |
| Tooling | Vite, ESLint, Prettier, Vitest, Playwright, axe-playwright, Lighthouse CI | Standard SvelteKit tooling. |
| Deploy | **Cloudflare Pages** (primary) or Vercel | Free tier, edge-cached static assets, unlimited bandwidth. |

**No backend at runtime.** All state is `localStorage` + URL-hash. Build-time only is server work (SvelteKit prerender).

---

## 4. Information Architecture (Routes)

Every public route is **prerendered HTML** with route-specific keyword content above the fold and the editor below the fold. Same editor component everywhere — only the seed defaults differ.

| Route | Keyword target | Seed defaults |
|---|---|---|
| `/` | "free invoice generator" | Region auto-detect, "Modern" template |
| `/gst-invoice-generator` | "gst invoice generator", "free gst invoice" | India, INR, GST mode pre-enabled, HSN field visible |
| `/freelance-invoice-generator` | "freelance invoice generator" | International, hourly line items, PayPal block |
| `/invoice-template-india` | "invoice template india" | India + showcases all 5 templates |
| `/invoice-template/[slug]` | Long-tail per template | One page per template (modern, minimal, classic, creative, corporate) |
| `/app` | (noindex) | The pure-SPA editor surface; landing pages embed it. |
| `/share` | (noindex, canonical → `/`) | Read-only invoice view; reads invoice JSON from URL hash (`/share/#<encoded>`). |

Each landing route includes:
- H1 with keyword, 200–400 word intro
- "How to make a [keyword]" 5-step section (HowTo schema.org structured data)
- 8–12 question FAQ (FAQPage schema.org)
- Comparison table vs. Refrens / invoice-generator.com / Zoho free
- Embedded editor (immediately usable, no scroll-jack)
- Sitemap.xml + robots.txt + per-route OG image (auto-generated at build)

---

## 5. Data Model

```ts
type Invoice = {
  id: string;                                         // nanoid
  number: string;                                     // "INV-2026-0001"
  createdAt: string;                                  // ISO
  updatedAt: string;
  region: 'IN' | 'INTL';
  template: 'modern' | 'minimal' | 'classic' | 'creative' | 'corporate';
  brand: { logoDataUrl?: string; color: string; font: 'inter' | 'space-grotesk' | 'plex-serif' };
  currency: string;                                   // ISO 4217 (e.g., 'INR', 'USD')
  locale: string;                                     // BCP-47 (e.g., 'en-IN', 'en-US')
  dateIssued: string;
  dateDue: string;
  paymentTerms: 'net0' | 'net7' | 'net15' | 'net30' | 'net60' | 'custom';
  from: Party;
  to: Party;
  items: LineItem[];
  discount: { type: 'percent' | 'flat'; value: number } | null;
  shipping: number | null;
  shippingTaxable: boolean;
  taxMode: 'none' | 'simple' | 'gst' | 'vat' | 'custom';
  taxes: TaxRule[];                                   // for 'custom'
  roundTotal: boolean;                                // round grand total to nearest whole
  notes?: string;
  terms?: string;
  payment: PaymentMethods;
  meta: { status: 'draft' | 'sent' | 'paid' };
};

type Party = {
  name: string;
  email?: string;
  phone?: string;
  address: string;                                    // multiline
  taxId?: string;                                     // GSTIN (IN) / VAT (EU) / EIN (US)
  gstStateCode?: string;                              // 2-digit prefix; auto-extracted from GSTIN
};

type LineItem = {
  id: string;
  description: string;
  hsnSac?: string;                                    // India only
  quantity: number;
  unit?: string;                                      // 'hrs' | 'pcs' | 'kg' | 'days' | custom
  rate: number;
  taxRate: number;                                    // percent; overrides invoice-level when > 0
  discountPct?: number;                               // per-item discount
};

type TaxRule = { name: string; rate: number; compound: boolean };

type PaymentMethods = {
  bank?: { accountName: string; accountNumber: string; ifsc?: string; swift?: string; bankName: string };
  upi?: string;                                       // generates UPI QR
  paypal?: string;                                    // PayPal.me handle
  stripeLink?: string;
  razorpayLink?: string;
  customLink?: { label: string; url: string };
  notes?: string;
};
```

**LocalStorage keys:**

| Key | Shape | Purpose |
|---|---|---|
| `featureos_inv_v1_history` | `Invoice[]` | All saved invoices |
| `featureos_inv_v1_draft` | `Invoice` | Auto-saved current draft |
| `featureos_inv_v1_prefs` | `Preferences` | Theme, default region/currency/template, brand defaults, last "From" party, recent recipients |
| `featureos_inv_v1_fx` | `{ base, rates, fetchedAt }` | FX rates cache (24h TTL) |

All reads validated by Zod. Corrupt data → user prompted to clear or download as JSON.

---

## 6. UX & Interaction Model — WYSIWYG

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ☰  FeatureOS Invoice  ·  INV-2026-0001  ·  Modern ▾       │
│  🌓  ⌘K  Templates  Currency  Share  Download PDF          │  ← top bar
├──────┬──────────────────────────────────────────────┬───────┤
│      │                                              │       │
│ My   │       ┌──────────────────────────┐           │ Insp- │
│ Inv- │       │                          │           │ ector │
│ oice │       │     INVOICE CANVAS       │           │ (con- │
│ s    │       │   (the actual document)  │           │ text- │
│      │       │   click-to-edit fields   │           │ ual)  │
│ Tem- │       │                          │           │       │
│ pla- │       └──────────────────────────┘           │       │
│ tes  │                                              │       │
└──────┴──────────────────────────────────────────────┴───────┘
```

- **Left rail** (collapsible, hidden by default on mobile): saved invoices, template gallery.
- **Main canvas**: the invoice itself. A4-aspect document on a soft gradient background. **Every field is click-to-edit** (`contenteditable` + native inputs). No separate form panel.
- **Right rail (Inspector)**: contextual settings tied to the focused field. E.g., focus the tax cell → inspector shows tax mode toggle, GST splits, custom tax editor. Auto-hides when nothing is focused.
- **Top bar**: invoice number, template picker, theme toggle, Cmd+K, primary actions.

### The "super cool" interactions

| Interaction | Implementation |
|---|---|
| Click any field → edit in place | `contenteditable` w/ controlled value, autosize textarea for multiline |
| Drag to reorder line items | Native HTML5 drag-and-drop, spring-eased reorder via View Transitions |
| Keyboard-first | `Tab`/`Shift+Tab` cycle, `Enter` adds new line item, `⌘D` duplicate row, `⌘S` save, `⌘P` print, `⌘E` export PDF, `⌘L` share link, `⌘K` palette |
| Cmd+K command palette | Fuzzy search every action (`fzf`-style), recent actions pinned, inline-typed values (e.g., "Currency EUR" sets currency) |
| Live number animation | `@number-flow/svelte` on totals — values morph rather than snap |
| Template switch | View Transition API morph; templates share field IDs so layout interpolates smoothly |
| Logo: drag-drop directly on header | Drop zone overlays the logo slot; auto-resizes & compresses to ≤200 KB base64 |
| Brand color picker | One-click in top bar → palette popover (Radix-style); all template accents update reactively via CSS vars |
| Confetti on PDF download | `canvas-confetti` burst once per session; respects `prefers-reduced-motion` |
| Smart paste | Paste tabular data into line items area → parses TSV/CSV → fills rows |
| Auto-save | Debounced 1.5s write to `featureos_inv_v1_draft`; toast on first save only |
| Share link | One-click `⌘L` → URL copied → toast "Share link copied · 1.2 KB" |
| Mobile | Single-column stack, inspector becomes bottom sheet, drag-handles enlarge |

### Accessibility

- WCAG 2.1 AA; verified with axe on every route in CI.
- All interactive elements keyboard reachable; focus visible always.
- ARIA live region announces total updates on change.
- `prefers-reduced-motion` disables confetti, view transitions, number-flow animations.
- Minimum contrast 4.5:1 in both themes; tested with simulated color-blindness.
- Logical heading order on landing pages.

### Theming

- **Light**, **Dark**, **OLED Black** (true #000), **System** (follows OS).
- Theme stored in `featureos_inv_v1_prefs`; applied via `data-theme` attribute on `<html>`.
- All accent colors derive from `--brand-color` CSS var so user's brand color theming Just Works in both themes.

---

## 7. Feature Modules

### 7.1 Editor Core
- WYSIWYG click-to-edit invoice document
- 5 templates: Modern, Minimal, Classic, Creative, Corporate
- Live template switching with morph animation
- 4 themes (light, dark, OLED, system)

### 7.2 Branding
- Logo upload (PNG/JPG/SVG; SVG → PNG@2x via OffscreenCanvas; max 200 KB base64)
- Brand color picker (HSL wheel + 12-color preset palette)
- Font choice: Inter (sans), Space Grotesk (display), IBM Plex Serif (classic)

### 7.3 Parties
- "From" party auto-loaded from preferences on new invoice
- "To" recipient auto-complete from past recipients (last 20 in localStorage)
- GSTIN validation (15-char regex + Mod-36 checksum) — inline warning, never blocking
- State code auto-extracted from GSTIN (positions 1–2) drives CGST+SGST vs IGST split

### 7.4 Line Items
- Inline-editable rows: Description · HSN/SAC (IN) · Qty · Unit · Rate · Tax % · Discount % · Amount
- Drag handle (left, on hover)
- Inline `+` to insert below; trash icon to delete; `⌘D` to duplicate
- Smart paste: TSV/CSV from clipboard auto-fills new rows
- Per-item tax/discount overrides invoice-level when set

### 7.5 Calculations Engine

Order of operations (TDD-tested):

```
itemSubtotal      = qty × rate
itemDiscount      = itemSubtotal × (item.discountPct / 100)
itemTaxable       = itemSubtotal − itemDiscount
itemTax           = itemTaxable × (item.taxRate || invoice.taxRate) / 100
itemTotal         = itemTaxable + itemTax

invoiceSubtotal   = Σ itemTaxable
invoiceDiscount   = (discount.type === 'percent') ? subtotal × discount.value/100 : discount.value
discountedSubtotal = invoiceSubtotal − invoiceDiscount
totalTax          = (taxMode === 'simple')  ? discountedSubtotal × rate/100
                  : (taxMode === 'gst')     ? gstSplit(discountedSubtotal, fromState, toState)
                  : (taxMode === 'vat')     ? discountedSubtotal × vatRate/100
                  : (taxMode === 'custom')  ? applyCustom(discountedSubtotal, taxes)
                  : 0
shippingTax       = shippingTaxable ? shipping × effectiveTaxRate : 0
grandTotal        = discountedSubtotal + totalTax + (shipping || 0) + shippingTax
finalTotal        = roundTotal ? Math.round(grandTotal) : round2(grandTotal)
```

GST split logic:
- If `fromState === toState` → CGST + SGST (each = totalTax / 2)
- If `fromState !== toState` (or either missing) → IGST (full totalTax)

### 7.6 Currency & FX
- 30+ ISO 4217 currencies
- Locale-aware formatting via `Intl.NumberFormat` (e.g., `₹1,00,000.00` for INR, `$100,000.00` for USD)
- FX rates fetched from `https://api.exchangerate.host/latest?base=USD` on first load → cached 24h in localStorage. Bundled fallback (snapshotted at build time) if fetch fails.
- "Convert to currency X" command in palette: recalculates all amounts at live rate; toast shows rate + date
- Optional dual-display footer: "Total: ₹1,23,456 · ≈ $1,481 USD"

### 7.7 Dates & Terms
- Date issued (default: today)
- Payment terms dropdown (Net 0/7/15/30/60/Custom) → due date auto-derived
- "OVERDUE" pill on invoice header if past due (calculated on view)

### 7.8 Payment Methods
- Bank transfer block (region-aware: IFSC for IN, SWIFT/IBAN for INTL)
- UPI ID → renders UPI QR (`upi://pay?pa=<id>&pn=<name>&am=<amount>&cu=INR`) embedded in PDF & on-screen
- PayPal.me link → renders as "Pay with PayPal" button in shared/printed invoice
- Stripe payment link, Razorpay payment link, generic custom link
- All shown in shared `/share/[encoded]` view as clickable buttons

### 7.9 Invoice History
- All saved invoices in left rail with status pill (draft/sent/paid)
- Search by number or recipient name
- Duplicate → opens copy with auto-incremented number
- Delete with 5-second undo toast
- Mark as paid (sets status; visual stamp on PDF)

### 7.10 Numbering
- Configurable format: `INV-{YYYY}-{####}` (default), `INV-{YY}{MM}-{###}`, custom literal-with-tokens
- Auto-increment per saved invoice (per-prefix counter in prefs)

### 7.11 Export
- **Download PDF** (pdfmake vector output) — primary CTA
- **Print** (browser native, dedicated print stylesheet so non-pdfmake fallback also looks correct)
- **Share via URL** (LZ-compressed invoice in URL hash → `/share/[encoded]`)
- **Export JSON** (full invoice for backup)
- **Import JSON** (restore single invoice)

### 7.12 Command Palette (Cmd+K)
Fuzzy-searchable actions:
- New invoice · Duplicate · Save · Delete
- Switch template (5)
- Switch currency (30+)
- Toggle GST / VAT / Simple tax / No tax
- Toggle dark mode
- Add line item · Clear all items
- Download PDF · Print · Copy share link · Export JSON
- "Set due date to next Friday" (parsed natural-language dates)

### 7.13 Onboarding
- First visit: 4-step animated overlay (skippable; ~20s) — "Click anything to edit", "Drag to reorder", "Cmd+K for everything", "Download or share"
- Sample invoice pre-populated; one-click "Clear sample" CTA
- Tooltip hint on `⌘K` for first 3 sessions

### 7.14 FeatureOS Conversion Layer
- **Footer (every page):** "A free tool by [FeatureOS](https://featureos.com) — turn customer feedback into shipped features. *Try it free →*"
- **Post-PDF success modal:** confetti, "Hope this saved you time! FeatureOS helps product teams collect feedback, build roadmaps, and ship what users want. *Learn more →*" — single dismissable card, never auto-shown again
- **Shared invoice view (`/share/[encoded]`):** persistent bottom strip "Made with FeatureOS Invoice Generator · *Make your own free →*" — this is the viral surface
- **Zero pre-value popups.** No newsletter modal on entry. No "give us your email" gate. Trust first.

---

## 8. PDF Generation

- **Library:** `pdfmake` declarative DSL.
- **One file per template:** `src/lib/pdf/templates/{modern,minimal,classic,creative,corporate}.ts` — each exports `(invoice: Invoice) => TDocumentDefinitions`.
- **Fonts:** embedded via `pdfMake.vfs`. Bundle Inter, Space Grotesk, IBM Plex Serif. Currency symbol coverage verified for `₹`, `€`, `$`, `£`, `¥`.
- **Logo:** base64 image inline. SVGs rasterized at 2× via OffscreenCanvas before embedding.
- **QR codes:** `qrcode` → data URL → `image: dataUrl` in pdfmake.
- **Filename:** `{number}_{recipientName}.pdf` (sanitized to `[A-Za-z0-9_-]`).
- **PAID stamp:** if `meta.status === 'paid'`, overlay rotated text watermark.
- **Failure mode:** if pdfmake throws, fall back to `window.print()` with toast: "PDF generation failed — opened print dialog instead."

---

## 9. Share via URL

Encoding:
```
share_url = `${origin}/share/#${LZString.compressToEncodedURIComponent(JSON.stringify(invoice))}`
```

- Stored in **URL hash** (after `#`) — never sent to server, never appears in server logs. No dynamic route segment needed.
- `/share` is a static SvelteKit route that reads `window.location.hash` client-side, decodes, validates with Zod, and renders the invoice **read-only** in the chosen template.
- "Download PDF" button on shared view re-runs the PDF generator client-side.
- **Size guard:** if compressed payload > 8 KB, show modal: "Invoice too large to share via link (logos make URLs huge). Download the PDF and share that instead."
- `<meta name="robots" content="noindex,nofollow">` on `/share` route; canonical → `/`.

---

## 10. Edge Cases & Error Handling

| Case | Behavior |
|---|---|
| Empty invoice (no items) | Show inline placeholder row "Click to add your first item"; PDF download disabled with tooltip |
| Invalid GSTIN | Inline yellow warning beside field; never blocks save/PDF |
| FX fetch fails | Use bundled snapshot (build time); footer note "FX rates from {date}" |
| `localStorage` quota exceeded | Toast: "Storage full — export your invoices, then we'll clear old drafts." Offer one-click "Export all & free space" |
| Long descriptions in PDF | pdfmake auto-wraps; UI truncates with `…` and tooltip in history list |
| Currency unset | Falls back to region default (INR for IN, USD for INTL) |
| Browser without Clipboard API | Modal with pre-selected text + "Press ⌘C" hint |
| Browser without View Transitions | Skip morph animation; instant template swap |
| Browser without OffscreenCanvas | SVG logo embeds raw (works in PDF), warns about size |
| Print fails (mobile Safari quirks) | Detect; offer PDF download as alternative |
| Decoded share URL fails Zod | Show "This invoice link is corrupted or from an old version" + link to homepage |

---

## 11. Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Unit | Vitest | Calculation engine (100%), GSTIN validator, FX converter, share-URL encode/decode round-trip |
| Component | Vitest + @testing-library/svelte | Each template renders fixture data; inspector responds to focus changes |
| E2E | Playwright | Golden paths: fill invoice → download PDF; share link round-trip; template switch; Cmd+K flow; mobile viewport |
| PDF snapshot | Playwright + pdf-parse | 5 fixture invoices × 5 templates → text content & page count match snapshot |
| Accessibility | axe-playwright | Zero violations on `/`, `/gst-invoice-generator`, `/app`, `/share` (sample fixture) |
| Performance | Lighthouse CI | Perf ≥95, SEO ≥95, A11y ≥95, Best Practices ≥95 on every prerendered route |
| Bundle | size-limit | Editor JS bundle ≤120 KB gzipped (excluding pdfmake, lazy-loaded) |

CI runs all of the above on every PR.

---

## 12. Performance Budgets

- First Contentful Paint < 1.0s on 4G (prerendered HTML)
- Largest Contentful Paint < 1.8s
- Time to Interactive < 2.5s
- Total Blocking Time < 200ms
- Editor JS shell ≤ 120 KB gzipped
- pdfmake (~300 KB gzipped) **lazy-loaded** on first PDF download — never blocks initial paint
- Fonts: subset to Latin + Devanagari + Indian Rupee glyph; preload only the first weight

---

## 13. SEO Implementation

- Server-side prerender all landing routes (`adapter-static` + explicit `prerender = true`)
- Per-route: unique `<title>`, `<meta description>`, OG image, Twitter card
- Schema.org structured data: `WebApplication` (homepage), `HowTo` (each landing), `FAQPage` (each landing), `BreadcrumbList`
- `sitemap.xml` generated at build
- `robots.txt` allows crawl of all landing routes; disallows `/share/`, `/app`
- Canonical URLs on every page
- OG images auto-generated at build (Satori or static SVGs per template)
- Internal linking: every landing page links to the other landing pages in a "Related tools" footer

---

## 14. Privacy & Trust

- **Plausible analytics** (cookieless, GDPR-compliant by default — no consent banner needed). Loaded async, never blocks rendering.
- No cookies. Region detection via `navigator.language` first; only fall back to one IP geolocation call (privacy-friendly endpoint) if locale is ambiguous; result cached in localStorage.
- Privacy policy page: "We don't store your invoice. Everything is in your browser. Share links contain your data encoded — anyone with the link can see the invoice."
- Self-hosted fonts (no Google Fonts CDN call)
- No third-party scripts in editor

---

## 15. Repository Structure

```
in-gen-tool/
├── PRD.md                              ← this file
├── README.md
├── package.json
├── svelte.config.js                    (adapter-static)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── playwright.config.ts
├── vitest.config.ts
├── docs/
│   └── superpowers/
│       ├── specs/2026-04-20-invoice-generator-design.md
│       └── plans/2026-04-20-invoice-generator-plan.md   (next step)
├── src/
│   ├── app.html
│   ├── app.css                         (tailwind + design tokens)
│   ├── lib/
│   │   ├── stores/                     (Svelte 5 runes-based state)
│   │   │   ├── invoice.svelte.ts
│   │   │   ├── prefs.svelte.ts
│   │   │   ├── history.svelte.ts
│   │   │   └── theme.svelte.ts
│   │   ├── schemas/                    (Zod schemas)
│   │   │   ├── invoice.ts
│   │   │   └── prefs.ts
│   │   ├── calc/
│   │   │   ├── totals.ts
│   │   │   ├── gst.ts
│   │   │   ├── currency.ts
│   │   │   └── totals.test.ts
│   │   ├── pdf/
│   │   │   ├── generate.ts
│   │   │   └── templates/
│   │   │       ├── modern.ts
│   │   │       ├── minimal.ts
│   │   │       ├── classic.ts
│   │   │       ├── creative.ts
│   │   │       └── corporate.ts
│   │   ├── share/
│   │   │   ├── encode.ts
│   │   │   ├── decode.ts
│   │   │   └── encode.test.ts
│   │   ├── components/
│   │   │   ├── editor/                 (canvas + field cells)
│   │   │   ├── inspector/              (right rail)
│   │   │   ├── command-palette/
│   │   │   ├── templates/              (Svelte renderers)
│   │   │   │   ├── Modern.svelte
│   │   │   │   ├── Minimal.svelte
│   │   │   │   ├── Classic.svelte
│   │   │   │   ├── Creative.svelte
│   │   │   │   └── Corporate.svelte
│   │   │   ├── seo/                    (FAQ, HowTo, Comparison sections)
│   │   │   └── ui/                     (Button, Modal, Toast, Popover, etc.)
│   │   ├── utils/
│   │   │   ├── gstin.ts
│   │   │   ├── currency-format.ts
│   │   │   ├── debounce.ts
│   │   │   └── shortcuts.ts
│   │   └── data/
│   │       ├── currencies.ts
│   │       ├── states-india.ts
│   │       └── fx-fallback.json
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte                (/)
│       ├── gst-invoice-generator/+page.svelte
│       ├── freelance-invoice-generator/+page.svelte
│       ├── invoice-template-india/+page.svelte
│       ├── invoice-template/[slug]/+page.svelte
│       ├── app/+page.svelte
│       └── share/+page.svelte
├── static/
│   ├── og/                             (per-route OG images)
│   ├── robots.txt
│   └── favicon.svg
└── tests/
    ├── e2e/
    └── fixtures/                       (sample Invoice JSONs)
```

---

## 16. Build Phases

| Phase | Days | Deliverable |
|---|---|---|
| 1. Foundation | 1–2 | SvelteKit scaffold, Tailwind v4, TS strict, Vitest+Playwright wiring, Zod schemas, localStorage service, design tokens |
| 2. Core editor | 3–5 | Invoice runes state, WYSIWYG canvas, line item CRUD + drag, calc engine (TDD-first) — Modern template only |
| 3. Essentials | 6–7 | Tax modes (simple/GST/VAT/custom), multi-currency + FX, dates & terms, branding (logo/color/font) |
| 4. Export | 8–9 | pdfmake Modern template, print stylesheet, share-via-URL + `/share/[encoded]` route, confetti success moment |
| 5. Templates & polish | 10–11 | 4 more templates (editor + PDF), View-Transition switch, Cmd+K palette, dark + OLED themes |
| 6. History & touches | 12–13 | Saved invoices history, duplicate/delete/search, keyboard shortcuts, onboarding, FeatureOS footer + post-PDF modal |
| 7. SEO & launch | 14 | Prerendered landing routes, FAQ/HowTo schema, OG images, sitemap, Lighthouse pass, deploy to Cloudflare Pages |

---

## 17. Open Questions (none blocking)

- **Domain path:** Is the tool at `featureos.com/invoice-generator/*` or a subdomain `tools.featureos.com/*`? Affects canonical URLs but not architecture. *Default: subpath unless told otherwise.*
- **Plausible analytics ID:** Need from Karthik before deploy; placeholder used in dev.

---

## 18. Out of Scope (explicitly)

- User accounts, authentication, server-side persistence
- Recurring invoices, subscription billing, dunning
- Quote → invoice conversion, expense tracking, time tracking
- Email delivery (no SMTP integration; user downloads/shares manually)
- Payment processing (links to external processors only)
- Multi-language UI (English-only at launch; i18n architecture in place for future)
- White-label / API access for other sites

These can be added later if traffic data justifies it.
