# One South Sycamore: project notes

Marketing site for **One South Sycamore**, a one-man flower shop in Newtown, PA.
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
| Business name | **One South Sycamore**, the name on the street blade over the door and the Instagram handle. The domain is vjsflowers.com and deliberately differs: people search for flowers, not an address. An early draft called it "V Flowers", which appeared nowhere a customer could see. |
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
Warm-white paper, deep forest green ink, pale sage fields, one blush accent, and a
single near-black green (`--color-board`) used for the dark fields. Instrument Serif
for display, Inter for body. Tokens live in `app/globals.css` under `@theme`.

**The neutral palette is deliberate**: Vince's photographs are extremely saturated
(magenta roses, green trick dianthus, spray-paint canvases). The interface stays quiet
so the photographs carry all the colour. Don't add brand colour to the chrome.

**Not a generic template.** The first pass used the same sticky translucent top bar as
every other site in this account; it was replaced with a printed **masthead** — shop
name at size, address set as a dateline, double rule, ruled nav row — that scrolls away
instead of following. On mobile the phone stays reachable through a fixed bottom call
strip, not a top bar. Interior pages compress the masthead to a folio. Sections are
ruled ledgers, not cards.

**Contrast is verified, not eyeballed.** Every text/background pair on every page was
measured by compositing the real (often `oklab`, alpha-modified) colours on a canvas.
`--color-muted` is `#5f6a5e` because the original `#7c8479` failed AA at small sizes,
and text on `--color-board` never goes below `chalk/50` for body or `chalk/40` for
display numerals. Re-measure if you touch either token.

Logo is a **draft** (`components/logo.tsx`): the V drawn as two cut stems with a leaf.
Vince asked for a logo to be made; he hasn't seen this one yet.

## The globe

`components/globe/` renders the sourcing story: four growing regions arced to Newtown.

- Land is a **texture**, not points — `public/globe/land.png`, 4096×2048, rasterised
  from Natural Earth 50m land polygons by `scripts/generate-globe-texture.mjs`. An
  earlier point-cloud version could not hold recognisable coastlines and read as noise.
- `SphereGeometry`'s UVs run opposite to a standard equirectangular map, so the texture
  is mirrored back with `repeat.x = -1; offset.x = 1`. Geo-alignment is verified by
  sampling the PNG at known coordinates (Newtown, Nairobi, Tokyo, mid-Pacific).
- Arc lift is `0.025 + angle * 0.055`, peaking at ~1.15× radius. An earlier formula
  peaked at 1.68× and the routes looked like they were leaving orbit.
- Distances in the panel are computed great-circle, not estimated.
- three.js (~900 KB) is **not** in the first load: the section holds it back behind an
  IntersectionObserver so the phone number paints first on cell data.

## Photographs

Ten of Vince's photos, all 3:4 portrait. Layouts are built around that ratio — don't
crop them into wide bands, it cuts the sign off the storefront shot.

- Masters: `public/photos/*.webp`, 2400px, ~7.7 MB total (from 37 MB of JPEGs).
- `lib/photos.ts` is generated: dimensions plus a 16px inline `blurDataURL` per photo.
- Originals are in `photo-originals/`, gitignored — they are not deployed.
- Regenerate with `scripts/process-photos.mjs`.

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
3. ~~Real photos~~ **Ten are in.** A portrait slot for Vince at the bench is held open at
   the top of /about and renders the placeholder until the photograph exists. Still
   nothing of wedding, sympathy or gift-basket work.
4. **Buy vjsflowers.com** and deploy.
5. **Draft review with Vince, in person** — he explicitly asked for this before launch. Confirm
   the slogan ("No set menu. Just what's beautiful today." is invented, not his), the logo, the
   placeholder hours, and the board copy.
6. Consider: Vercel Hobby forbids commercial use — same question that's open on Moreco.

## Layout decisions worth not undoing

- **No full-bleed dark sections on public pages.** There used to be several, and every
  one meant two hard colour changes on the way past, however gently they were ramped.
  The globe is dark enough on its own to anchor the page. The only dark surface left is
  the gallery lightbox, which is meant to be a different mode.
- **The globe sits directly under the header** and is the first thing you land on. It is
  lazy-loaded behind an IntersectionObserver, so it still is not in the first payload.
- **Selecting a region flies to it and then releases control.** Steering the rotation for
  as long as a region stayed selected undid every drag on the next frame, which felt
  like the globe had locked.
- **Say the "no set menu, hours vary" thing once.** It was on the masthead, in the hero
  and in the footer at the same time. The footer's hours note carries it now.

## Open questions for Vince

Both of these came out of his own photographs, not the intake — ask before acting.

1. **The name is settled on the site but not in the world.** The site is now
   One South Sycamore, matching the blade over the door and the Instagram handle.
   But his Google listing still reads **"V flowers"**, and Google is what feeds the
   map pack. Whichever name wins, the listing and the site have to agree, or local
   search splits between two businesses. Ask him which one he wants and update the
   Google listing to match.

   Original note: **The shop's sign says ONE SOUTH SYCAMORE.** It is on the building in the storefront
   shots, and it is his Instagram handle (@1southsycamore). The site currently calls the
   business "V Flowers" because that is what Vinay was told. Which name goes on the site?
   The domain (vjsflowers.com) matches neither.
2. **He sells art.** Three of the ten photos are spray-paint canvases, there is a hanging
   rack of spray cans, and an "ART" sign stands out front. The intake never mentioned it
   and the site says nothing about it. Is the art his? Is it for sale? It may deserve its
   own section — right now those photos sit in the gallery under "The Shop", which states
   nothing untrue but undersells what is clearly a real part of the business.

### The contact form, and where it goes

The form lives at `/contact`. Submissions land in `contact_messages` and surface in the
admin Messages tab.

**That is probably not good enough.** Vince does not use email and does not sit at a
computer; expecting him to log into an admin panel to find a customer enquiry is
optimistic. Either wire the form to text him (a Twilio send on successful insert is a
few lines in `app/api/contact/route.ts`) or reconsider having a form at all. Until one
of those happens, the page copy deliberately points anyone in a hurry at the phone.

## SEO, and the traps in it

- **`NEXT_PUBLIC_SITE_URL` decides every canonical, og:url, sitemap entry and
  JSON-LD url.** A local production build once baked `http://localhost:3000` into
  all of them. `lib/site.ts` now throws on a production build with a non-https
  origin, and the variable is deliberately absent from `.env.local` so local
  builds fall back to the real domain.
- Every page declares its own `alternates.canonical` **and** `openGraph.url`. The
  root layout must not set either, or all six pages claim to be the home page.
- JSON-LD omits `openingHours` (placeholders) and `geo` (the only coordinates in
  the repo were authored to place a dot on the globe and are the town centroid,
  not a surveyed pin). Add either only once someone has confirmed the real value.
- The single biggest local-search win is not in this repo: **claim the Google
  Business Profile.** The map pack sits above every organic result.

## Accessibility

Contrast is measured, not eyeballed (see Design above). Beyond that:

- The globe is decorative and `aria-hidden`; the four regions, their distances
  and the destination all exist as real buttons and text beside it.
- Animated figures (`CountUp`) are hidden from assistive technology and the
  final number is carried in the button's `aria-label`, so a control's name
  does not mutate every frame.
- Reveals start at `opacity: 0` and are shown by script, so `.no-js` forces them
  visible and reduced-motion skips the observer entirely.
- Disabled-looking admin controls use `aria-disabled`, not `disabled`, so they
  stay in the tab order and can point at the banner explaining why.

## Rules

- No prices, ever. No email address, ever. No online checkout.
- No em dashes anywhere: copy, comments, commits. Rewrite the sentence instead.
- The /privacy page claims there is no analytics, no tracking pixel and no
  cookie banner. That is currently true. If anything is ever added, that page
  has to change in the same commit.
- The site sells the *conversation with Vince*, not a product list.
- `lib/site.ts` is the only place shop facts belong.
- Placeholder copy that Vince hasn't approved (slogan, board descriptions, hours) is marked
  in comments — keep it marked until he signs off.
