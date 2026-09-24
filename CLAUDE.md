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

Everything below came from Vince directly. Don't invent shop details. Ask.

| | |
|---|---|
| Business name | **One South Sycamore**, the name on the street blade over the door and the Instagram handle. The domain is vjsflowers.com and deliberately differs: people search for flowers, not an address. An early draft called it "V Flowers", which appeared nowhere a customer could see. |
| Address | 1 South Sycamore Street, Newtown, **PA** 18940 |
| Landmark | Across from the Lukoil, corner of Washington & Sycamore, center of town |
| Phone | (609) 649-1992. Call **and** text |
| Email | **None.** Vince doesn't use email. Never put an email address on the site. |
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

`components/bloom/` rebuilds one of Vince's photographs as a cloud of points beside
the headline. Click it and the cloud is thrown clear across the page, changes colour
mid-flight and gathers back as the next photograph.

- Every point takes its colour from a pixel of a real photo, so the front page is
  always his actual stock. Nothing organic is modelled by hand here, and nothing
  should be.
- **Density is the whole thing.** 76,800 points on desktop (240x320), 19,200 on a
  phone, drawn at 1.45x the grid pitch so no page background shows between them.
  Circles on a square grid need about 1.41x before the diamond gaps at the four-way
  junctions close. The first pass ran 9,408 points at 0.82x pitch and read as a coarse
  halftone you could not identify, which defeats the point of using a photograph.
  At rest this should look like the photograph; the particles are the reveal on the
  click, not something to sit through beforehand. The per-frame cost is not the
  constraint: 120,000 points measured at 4% of a 60fps budget.
- The cloud **sleeps** once it settles, skipping both the integration and the ~900KB
  position upload, so at rest the figure costs nothing. That is what pays for the
  point count. Idle motion continues on the GPU regardless.
- Depth is perceptual luminance plus a gentle barrel curve, so the bright petals stand
  proud, the surface reads as a surface, and both parallax when the cloud turns with
  the pointer. The camera sits close enough that the plane overfills its box, because
  this is a photograph and should run to the edges like every other one on the site.
- Sampling frames and posters come from the same hand-picked crop
  (`scripts/generate-bloom-frames.mjs` → `public/bloom/`, manifest in
  `lib/bloom-sources.ts`), which is what keeps the crossfade from jumping. Crop tight:
  the figure sits on a pale page, so every bit of shop wall, ceiling or strip light in
  frame reads as a hole in it. All three masters need pulling down onto the flowers.
- The simulation is a class, not refs and memos. Tens of thousands of points are
  rewritten in place every frame and React must not be able to see any of it; the
  compiler's immutability rules will reject the memo version, correctly.
- Spring constants are tuned together, not guessed: k=14 with c=5 is underdamped at
  zeta≈0.67, and the throw velocities put the peak of the scatter at about the edge
  of the frame with a settle just under two seconds. Change one and re-check the
  other, headless, because a throttled browser will not show you the difference.
- **The throw is three parts, not a spring.** A spring has one constant for both how
  far the points go and how long they take, so far always means fast, and the whole
  thing was over in 1.7 seconds. They are now thrown into pure drag (0.85s), which
  carries them out past the edge of the frame and lets them slow to a hang, and only
  then walked home on an eased tween (2.7s) whose length is set independently. Points
  set off home from the middle outward, so the picture grows back rather than
  appearing all at once.
- Outward speed **scales with how far out the point already sits**. A flat push moves
  every point the same distance and blows a hole through the middle, which reads as a
  smoke ring; measured centre density went from 0.00 to 0.10 of the peak when this
  changed, and the throw reads as a bloom instead.
- **The canvas is deliberately bigger than the picture** (2.1x wide, 1.6x tall, the
  insets in hero-bloom paired with FRAME_SCALE_X/Y and the camera distance here) and
  nothing clips it, so a throw crosses the page instead of piling up against an edge.
  The hero section carries `overflow-x-clip` so that overhang does not push out a
  horizontal scrollbar; clip rather than hidden, so the vertical axis stays visible.
- Points **dissolve with distance from home**, which is what lets the throw thin out
  into the page with no visible canvas boundary. It also means the entrance scatter
  has to stay small, or the page opens on a pale haze instead of a picture.
- **Scrolling past blows the picture apart.** Gated on the bottom edge of the
  photograph, not the canvas, which is much taller: nothing happens until the picture
  is halfway out of the viewport. Get this wrong and the figure is simply invisible on
  a page that has been scrolled at all, which looks exactly like a dead canvas and
  cost an hour of chasing a bug that was not there.
- A real photograph paints first and holds the layout. three.js is held back 300ms,
  the cloud crossfades over the still, and reduced motion never loads it at all.

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
- Regenerate with `scripts/process-photos.mjs`, then `scripts/generate-bloom-frames.mjs`
  if any of the three hero frames changed.

## Structure

- `app/(site)/`: public pages, home, `/gallery`, `/about`, `/visit`, `/contact`, `/privacy`
- `app/admin/`: password-gated panel, overview, photos, messages
- `lib/site.ts`: every shop fact (address, phone, hours, delivery, payment). Single source of truth
- `lib/content.ts`: editorial copy, services, order steps, gallery categories
- `components/photo-slot.tsx`: placeholder that becomes a real `<Image>` once given a `src`
- `supabase/migrations/0001_init.sql`: schema, **not yet applied**

### The board

Vince asked for a restaurant-style numbered board (#1, #2, #3…). It was built, then
removed: a fixed list of combinations contradicts the one thing that makes the shop
what it is. `DEFAULT_BOARD` in `lib/content.ts` is all that is left, kept only so the
decision is reversible. Nothing renders it. He has not been told yet.

### Admin

One shop, one owner, one shared password, not Supabase Auth. `lib/admin-auth.ts` signs an
expiry into an HMAC cookie (30 days); the password is never stored in the cookie. The gate is
the `(dashboard)` layout, not a proxy, so HMAC verification runs on the Node runtime.

Currently **read-only**: photo editing is laid out but not wired, and the panel says
so plainly rather than pretending to save.

## Launch blockers

Ordered by what actually blocks going live.

1. **Decide where the contact form goes, then wire it.** This is the last real
   engineering. The form currently writes to `contact_messages` and shows in the admin,
   which assumes Vince logs into an admin panel; he will not. He has no email and lives
   on his phone. Wire it to **text him** (Twilio from `app/api/contact/route.ts`), or to
   email Vinay who relays. Until something is wired, production returns 503 and tells
   people to call, which is deliberate: a real customer must never be silently dropped.

   Related decision, see the hosting notes: **this site does not need Supabase at all.**
   One table and an HMAC cookie login. If the form texts instead of storing, the database
   disappears and photo uploads can go to Vercel Blob.

2. **Photo uploads for Vince.** The one feature he asked for that is not built. The
   admin panel lays it out and says plainly that it is off. Target Vercel Blob rather
   than Supabase Storage, per the above.

3. **More photographs.** Ten are in. Still missing: **Vince himself** (a slot is held
   open at the top of /about and renders a visible placeholder until it exists), and
   anything of wedding, sympathy or gift-basket work, which are three services currently
   sold with no picture.

4. **Buy vjsflowers.com and deploy.** Set `NEXT_PUBLIC_SITE_URL` to the real https
   origin in production; the build throws otherwise, on purpose.

5. **Vercel Hobby forbids commercial use.** This is a client site, so either Vercel Pro
   at $20/mo or Cloudflare Workers, whose free tier permits it. Same open question as
   Moreco.

6. **The in-person review Vince asked for.** Bring the open questions below, plus: the
   slogan, the logo and the placeholder hours are all invented or drafted, and the
   numbered board he asked for has been removed.

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
   The domain (vjsflowers.com) matches neither.
2. ~~**He sells art.**~~ **Answered.** The canvases are Vince's own: spray paint on
   canvas, made at a setup behind the shop, sold off the walls inside, and not a
   separate business. Nothing is priced ahead, same as the flowers, so the price is a
   conversation. The home page now says so in its own section. Still worth confirming
   the wording with him, since it is his work being described.

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
  in comments. Keep it marked until he signs off.
