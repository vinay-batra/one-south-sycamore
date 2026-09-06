# V Flowers — project notes

Marketing site for **V Flowers**, a one-man flower shop in Newtown, PA.
Client is **Vince** (sole owner, sole point of contact). Built free; changes are free.
Vinay owns and manages the domain and does all deploys.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Supabase (not yet provisioned).

```bash
npm run dev    # localhost:3006
npm run build
npm run lint
```

## Client facts (intake, Sep 5 2026)

Everything below came from Vince directly. Don't invent shop details — ask.

| | |
|---|---|
| Business name | **V Flowers** (domain is vjsflowers.com — the name and the domain differ on purpose) |
| Address | 1 South Sycamore Street, Newtown, **PA** 18940 |
| Landmark | Across from the Lukoil, corner of Washington & Sycamore, center of town |
| Phone | (609) 649-1992 — call **and** text |
| Email | **None.** Vince doesn't use email. Never put an email address on the site. |
| Hours | Constantly changing. Site shows placeholder hours + "call for availability" — Vince approved this approach |
| Delivery | Local only. $100 order minimum, delivery from $20, customer covers it |
| Payment | Cash, card, Apple Pay, Venmo. No online checkout — he does not want one |
| Pricing | **Call for pricing.** No prices anywhere on the site |
| Instagram | [@1southsycamore](https://www.instagram.com/1southsycamore/), auto-posts to Facebook |
| Google Business | Does not exist yet — worth setting up, would help him more than the site will |
| Sells | Everyday arrangements, custom, weddings, funerals/sympathy, plants, **succulents**, gift baskets, corporate |

**The story** (his words, don't over-polish it): started right out of school, didn't want to
work for anyone, met a guy with a great flower connection, never stopped. 25 years. Brooklyn
and Manhattan, street stands, a store in Brooklyn. "Every day is a new day, and a new inventory."

**Sourcing**: flowers are field-cut worldwide — New Zealand, Japan, South America, Kenya — and
shipped in. Most local florists can't say this; it's the site's strongest differentiator.

**How he actually sells** (observed at the intake): a customer says what the occasion is, Vince
walks them to the back, shows them the cooler, suggests combinations, and prices it on the spot.
No set options. The site must never contradict this by looking like a catalog with fixed products.

## Design

Modern, clean, neutral — Vince's brief was "neutrals, white green lights pastel."
Warm-white paper, deep forest green ink, pale sage fields, one blush accent.
Instrument Serif for display, Inter for body. Tokens live in `app/globals.css` under `@theme`.

Logo is a **draft** (`components/logo.tsx`): the V drawn as two cut stems with a leaf.
Vince asked for a logo to be made; he hasn't seen this one yet.

## Structure

- `app/(site)/` — public pages: home, `/board`, `/gallery`, `/about`, `/visit`
- `app/admin/` — password-gated panel: overview, board, photos, messages
- `lib/site.ts` — every shop fact (address, phone, hours, delivery, payment). Single source of truth
- `lib/content.ts` — editorial copy, services, default board items, gallery categories
- `components/photo-slot.tsx` — placeholder that becomes a real `<Image>` once given a `src`
- `supabase/migrations/0001_init.sql` — schema, **not yet applied**

### The board

Vince asked for a restaurant-style numbered board (#1, #2, #3…). Six defaults live in
`lib/content.ts`. They're deliberately loose — "what it usually is, not what it always is" —
because inventory turns over daily. #6 "Dealer's Choice" is the one that matches how he really works.

### Admin

One shop, one owner, one shared password — not Supabase Auth. `lib/admin-auth.ts` signs an
expiry into an HMAC cookie (30 days); the password is never stored in the cookie. The gate is
the `(dashboard)` layout, not a proxy, so HMAC verification runs on the Node runtime.

Currently **read-only**: board and photo editing are laid out but not wired, and the panel says
so plainly rather than pretending to save.

## Launch blockers

1. **Supabase project** — create it, run `0001_init.sql`, create a public `gallery` storage
   bucket, set env vars. Until then the contact form stores nothing (dev logs it; **production
   returns 503 and tells people to call**, by design — a real customer must never be silently dropped).
2. **Wire the admin writes** — board CRUD and photo upload. This is the feature Vince actually
   asked for; the site is not done without it.
3. **Real photos** — every image is a placeholder. Sources: his Instagram (approved) + in-store
   shots Vinay takes. He has "tons" of succulent pictures.
4. **Buy vjsflowers.com** and deploy.
5. **Draft review with Vince, in person** — he explicitly asked for this before launch. Confirm
   the slogan ("No set menu. Just what's beautiful today." is invented, not his), the logo, the
   placeholder hours, and the board copy.
6. Consider: Vercel Hobby forbids commercial use — same question that's open on Moreco.

## Rules

- No prices, ever. No email address, ever. No online checkout.
- The site sells the *conversation with Vince*, not a product list.
- `lib/site.ts` is the only place shop facts belong.
- Placeholder copy that Vince hasn't approved (slogan, board descriptions, hours) is marked
  in comments — keep it marked until he signs off.
