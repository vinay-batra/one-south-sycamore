# One South Sycamore: project notes

Marketing site for **One South Sycamore**, a one-man flower shop in Newtown, PA.
Client is **Vince** (sole owner, sole point of contact). Built free; changes are free.
Vinay owns and manages the domain and does all deploys.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4. **No database.**

```bash
npm run dev    # localhost:3006
npm run build
npm run lint
```

## Client facts (intake, Sep 5 2026)

Everything below came from Vince directly. Don't invent shop details. Ask.

| | |
|---|---|
| Business name | **One South Sycamore**: the street blade over the door, the Instagram handle, and the domain. Bought Sep 24 2026. An early draft called it "V Flowers", which appeared nowhere a customer could see. Vince said vjsflowers.com at the intake; that was dropped rather than run a fourth name. |
| Address | 1 South Sycamore Street, Newtown, **PA** 18940 |
| Landmark | Across from the Lukoil, corner of Washington & Sycamore, center of town |
| Phone | (609) 649-1992. Call **and** text |
| Email | **None.** Vince doesn't use email. Never put an email address on the site. |
| Getting in touch | **Call or text only.** There is no contact form. One was built and removed: it had no destination Vince would ever check, so the site was inventing a channel the shop does not have. |
| Hours | Constantly changing. Site shows placeholder hours + "call for availability", which Vince approved |
| Delivery | Local only. $100 order minimum, delivery from $20, customer covers it |
| Payment | Cash, card, Apple Pay, Venmo. No online checkout, and he does not want one |
| Pricing | **Call for pricing.** No prices anywhere on the site |
| Instagram | [@1southsycamore](https://www.instagram.com/1southsycamore/), auto-posts to Facebook |
| Google Business | Does not exist yet. Worth setting up: it would help him more than the site will |
| Sells | Everyday arrangements, custom, weddings, funerals/sympathy, plants, **succulents**, gift baskets, corporate |

**The story** (his words, don't over-polish it): started right out of school, didn't want to
work for anyone, met a guy with a great flower connection, never stopped. 25 years. Brooklyn
and Manhattan, street stands, a store in Brooklyn. "Every day is a new day, and a new inventory."

**Sourcing**: flowers are field-cut worldwide (New Zealand, Japan, South America, Kenya) and
shipped in. Most local florists can't say this; it's the site's strongest differentiator.

**How he actually sells** (observed at the intake): a customer says what the occasion is, Vince
walks them to the back, shows them the cooler, suggests combinations, and prices it on the spot.
No set options. The site must never contradict this by looking like a catalog with fixed products.

## Design

Modern, clean, neutral. Vince's brief was "neutrals, white green lights pastel."
Warm-white paper, deep forest green ink, pale sage fields, one blush accent, and a
single near-black green (`--color-board`) used for the dark fields. Instrument Serif
for display, Inter for body. Tokens live in `app/globals.css` under `@theme`.

**The neutral palette is deliberate**: Vince's photographs are extremely saturated
(magenta roses, green trick dianthus, spray-paint canvases). The interface stays quiet
so the photographs carry all the colour. Don't add brand colour to the chrome.

**Not a generic template.** The first pass used the same sticky translucent top bar as
every other site in this account; it was replaced with a printed **masthead**: shop
name at size, address set as a dateline, double rule, ruled nav row, and it scrolls
away instead of following. On mobile the phone stays reachable through a fixed bottom call
strip, not a top bar. Interior pages compress the masthead to a folio. Sections are
ruled ledgers, not cards.

**Contrast is verified, not eyeballed.** Every text/background pair on every page was
measured by compositing the real (often `oklab`, alpha-modified) colours on a canvas.
`--color-muted` is `#5f6a5e` because the original `#7c8479` failed AA at small sizes,
and text on `--color-board` never goes below `chalk/50` for body or `chalk/40` for
display numerals. Re-measure if you touch either token.

Logo is a **draft** (`components/logo.tsx`): the V drawn as two cut stems with a leaf.
Vince asked for a logo to be made; he hasn't seen this one yet.

## The two three.js pieces

### The hero figure

`components/hero/` shows one of Vince's photographs at full quality beside the
headline and melts it into the next one every few seconds, the way ink spreads in
water. Click advances it early.

**The rule it is built around, learned the hard way:** never make the photograph look
worse than it already does. His pictures are the best thing on this site. A particle
version came before this one, went through three rounds of tuning (9,408 points, then
76,800, then a throw that crossed the page) and was cut, because no density of dots
beats the actual photograph standing still. At rest this figure is the photograph,
pixel for pixel, with a drift of a pixel or two so it is not dead. Everything
interesting happens in the transition.

- The melt is a **diagonal front bent by a flow field**: it sweeps the new picture
  across the old one and pushes the two apart along the seam. Progress is stretched
  past both ends (`uProgress * 1.34 - 0.17`) so the front is fully out of frame at 0
  and at 1, which is what keeps the resting photograph clean.
- The flow field is crossed sine pairs, not real noise. For something this smooth and
  this slow the difference is invisible and it costs a fraction as much.
- A soft lens follows the pointer, and the plane tilts with it. The plane overfills the
  frame by 7% so the tilt never opens a gap at the edge.
- The `<img>` underneath and the WebGL texture **use the same file**, so the texture is
  a cache hit rather than a second download. That is why it is a plain `<img>` and not
  next/image: routing one through the optimizer would fetch the picture twice.
- The caption and the dots change at the **halfway point of the melt**, not when the
  next photograph is asked for, or the label runs ahead of the picture.
- Material and transition state live in a class. It is written every frame and React
  must not be able to see it; the compiler's immutability rules reject the
  memo-and-refs version, correctly.
- Nothing advances while the figure is off screen. A real photograph paints first and
  holds the layout, three.js is held back 300ms, and reduced motion never loads it.

### The globe

`components/globe/` renders the sourcing story: four growing regions arced to Newtown.
It is the second section now, under its own heading, rather than the thing you land on:
the claim is made in type first and the globe is the evidence for it.

- Land is a **texture**, not points: `public/globe/land.png`, 4096×2048, rasterised
  from Natural Earth 50m land polygons by `scripts/generate-globe-texture.mjs`. An
  earlier point-cloud version could not hold recognisable coastlines and read as noise.
- `SphereGeometry`'s UVs are rotated a quarter turn against a standard equirectangular
  map, so the texture is brought back with `repeat.x = 1; offset.x = 0.25` and no
  mirroring. Geo-alignment is verified by sampling the PNG at known coordinates
  (Newtown, Nairobi, Tokyo, mid-Pacific). An earlier version mirrored it, and was
  self-consistently wrong on both halves.
- Arc lift is `0.025 + angle * 0.055`, peaking at ~1.15× radius. An earlier formula
  peaked at 1.68× and the routes looked like they were leaving orbit.
- Distances in the panel are computed great-circle, not estimated.
- three.js (~900 KB) is **not** in the first load: the section holds it back behind an
  IntersectionObserver so the phone number paints first on cell data.

## Photographs

Ten of Vince's photos, all 3:4 portrait. Layouts are built around that ratio. Don't
crop them into wide bands: it cuts the sign off the storefront shot.

- Masters: `public/photos/*.webp`, 2400px, ~7.7 MB total (from 37 MB of JPEGs).
- `lib/photos.ts` is generated: dimensions plus a 16px inline `blurDataURL` per photo.
- Originals are in `photo-originals/`, gitignored, so they are not deployed.
- Regenerate with `scripts/process-photos.mjs`, then `scripts/generate-hero-frames.mjs`
  if any of the three hero frames changed.

## Structure

- `app/(site)/`: public pages, home, `/gallery`, `/about`, `/visit`, `/privacy`
- `app/admin/`: password-gated panel, overview and photos
- `lib/site.ts`: every shop fact (address, phone, hours, delivery, payment). Single source of truth
- `lib/content.ts`: editorial copy, services, order steps, gallery categories
- `components/photo-slot.tsx`: placeholder that becomes a real `<Image>` once given a `src`

**There is no database and no API route.** Every public page is static. The contact
form was the only thing that ever wrote anything, and with it gone the Supabase client,
the schema, the messages tab, zod and resend all went too. Keep it that way: when the
photo uploader is built it goes to Vercel Blob, which needs no table of its own.

### The board

Vince asked for a restaurant-style numbered board (#1, #2, #3…). It was built, then
removed: a fixed list of combinations contradicts the one thing that makes the shop
what it is. `DEFAULT_BOARD` in `lib/content.ts` is all that is left, kept only so the
decision is reversible. Nothing renders it. He has not been told yet.

### Admin

One shop, one owner, one shared password, not a real auth provider. `lib/admin-auth.ts` signs an
expiry into an HMAC cookie (30 days); the password is never stored in the cookie. The gate is
the `(dashboard)` layout, not a proxy, so HMAC verification runs on the Node runtime.

Currently **read-only**: photo editing is laid out but not wired, and the panel says
so plainly rather than pretending to save. It is the only reason `/admin` exists.

## Launch blockers

Ordered by what actually blocks going live.

1. **Photo uploads for Vince.** The one feature he asked for that is not built, and now
   the only engineering left. The admin panel lays it out and says plainly that it is
   off. Target Vercel Blob: no table, no database, nothing to pay for monthly.

2. **More photographs.** Ten are in. Still missing: **Vince himself** (a slot is held
   open at the top of /about and renders a visible placeholder until it exists), and
   anything of wedding, sympathy or gift-basket work, which are three services currently
   sold with no picture.

3. **Buy the domain and deploy.** Set `NEXT_PUBLIC_SITE_URL` to the real https origin in
   production; the build throws otherwise, on purpose. The domain should match whatever
   the Google listing ends up saying, see the name question below.

4. **Vercel Hobby forbids commercial use.** This is a client site, so either Vercel Pro
   at $20/mo or Cloudflare Workers, whose free tier permits it. Same question as Moreco.
   The site is now entirely static with no server runtime, which makes a plain static
   host a real option as well.

5. **The in-person review Vince asked for.** Bring the open questions below, plus: the
   slogan, the logo and the placeholder hours are all invented or drafted, the numbered
   board he asked for has been removed, and so has the contact form.

## Layout decisions worth not undoing

- **The paper grain is the only thing over everything.** A fixed, 3% noise overlay on
  `body::after`. Large flat fields of near-white read as screen rather than as paper
  without it. It is hidden in print.
- **No full-bleed dark sections on public pages.** There used to be several, and every
  one meant two hard colour changes on the way past, however gently they were ramped.
  The globe is dark enough on its own to anchor the page. The only dark surface left is
  the gallery lightbox, which is meant to be a different mode.
- **The front page opens on the headline and the particle figure, not the globe.** The
  globe is the second section, with the sourcing claim set in type above it. Both are
  lazy: the figure waits 300ms behind a real photograph, the globe waits for an
  IntersectionObserver, so neither is in the first payload.
- **Two matched buttons under the lede, nothing floating beside it.** A filled "Fill out
  a request" to /contact and an outlined "Call or text the shop", identical geometry,
  both under the paragraph they belong to. The previous pairing was a solid button and a
  small underlined "or text" set off to the right, which read as an afterthought.
- **Selecting a region flies to it and then releases control.** Steering the rotation for
  as long as a region stayed selected undid every drag on the next frame, which felt
  like the globe had locked.
- **Say the "no set menu, hours vary" thing once.** It was on the masthead, in the hero
  and in the footer at the same time. The footer's hours note carries it now.
- **The footer does not repeat the masthead.** It used to open with the shop name at
  display size, the logo and the phone, all three of which are at the top of every
  page. It is four equal columns now, and nothing else.
- **Page headers are a single column.** /visit and /contact each had a second column
  beside the h1 repeating the landmark and the phone, which the page already carried
  further down.

## Open questions for Vince

Both of these came out of his own photographs, not the intake. Ask before acting.

1. **The name is settled on the site but not in the world.** The site is now
   One South Sycamore, matching the blade over the door and the Instagram handle.
   But his Google listing still reads **"V flowers"**, and Google is what feeds the
   map pack. Whichever name wins, the listing and the site have to agree, or local
   search splits between two businesses. Ask him which one he wants and update the
   Google listing to match.

   Original note: **The shop's sign says ONE SOUTH SYCAMORE.** It is on the building in the storefront
   shots, and it is his Instagram handle (@1southsycamore). The site currently calls the
   business "V Flowers" because that is what Vinay was told. Which name goes on the site?
   The domain is onesouthsycamore.com and matches the site.
2. ~~**He sells art.**~~ **Answered.** The canvases are Vince's own: spray paint on
   canvas, made at a setup behind the shop, sold off the walls inside, and not a
   separate business. Nothing is priced ahead, same as the flowers, so the price is a
   conversation. The home page now says so in its own section. Still worth confirming
   the wording with him, since it is his work being described.

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
  in comments. Keep it marked until he signs off.
