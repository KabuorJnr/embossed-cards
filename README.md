# Embossed

Digital cards that feel like paper. Choose a layered card with gold leaf, glitter, letterpress and die cut flowers, write inside it in handwriting, and send it as a link. The person you send it to gets a sealed envelope, cracks the wax seal, and the card slides out for them to open.

## What makes it work

- **Every design is drawn in code.** Paper grain, gold leaf, glitter, watercolour and letterpress are SVG filters, so the artwork is original and needs no licensed images.
- **Real depth.** Each card is a stack of paper layers in 3D. Die cuts sit higher than the card, so they move against it as you tilt.
- **Light that moves.** Foil and glitter catch a moving highlight that follows the mouse, a finger, or the phone's motion sensor.
- **Opens like a book.** Tap the card and the cover lifts off the page and swings open to the handwritten insert, darkening as it turns away from the light and casting its shadow across the page. The back of any die cut shows through on the inside.
- **An opening worth waiting for.** The envelope drifts down and floats while the name is written on. Pressing the wax seal cracks it in two with a flare of light and a scatter of wax, warm light spills out as the flap lifts, and gold dust trails the card as it slides free. The first time the card opens, paper confetti in the card's own colours falls across the page. All of it is skipped for people who prefer reduced motion.
- **No server, no database.** The whole card is compressed into the part of the link after `#`, which browsers never send to a server. Nothing to store, nothing to leak.

## Designs

| Design | Materials |
| --- | --- |
| Frangipani | Gold leaf stripes, teal edged glitter stars, raised pink frangipani that overhang the edges |
| Hibiscus | Painted red card, green stems, glitter edged hibiscus that spill off the card |
| Letterpress | Cotton card, painted frangipani spray, gold foil words pressed in (editable) |
| Acacia dusk | Layered paper savannah with giraffes, gold leaf sun, parallax between layers |
| Kanga | Kanga print with korosho motifs in gold and its saying on the hem (editable) |
| Deco | Emerald card, raised die cut arch frame, gold leaf sunburst, blind debossed lattice, gold foil words (editable) |
| Midnight | Holographic foil moon, silver constellations, glitter shooting star, layered paper clouds past the edge (editable) |
| Monstera | Four depths of cut paper monstera leaves with gold foil veins, words pressed into a gold leaf sun (editable) |
| Lace | Laser cut ivory lace lifted over blush card, scalloped window ringed with pearls, gold foil words (editable) |

Designs live in `src/card/designs/`. Each returns layers of SVG plus optional foil and glitter shapes; the viewer handles depth, light and opening. Foil comes in gold, rose, silver, copper and holographic (`sheenTone: 'holo'` gives a rainbow band of light). `tests/designs.test.ts` checks that every design's SVG ids are unique and every reference resolves.

## Run it

```bash
npm install
npm run dev      # local site at http://localhost:5173
npm test         # link encoding and design tests
npm run build    # production build in dist/
```

## Deploy

The site is hosted on Vercel, connected to this repository. Every push to `main` deploys to production automatically; Vercel detects Vite and runs `npm run build`.

`.github/workflows/check.yml` runs the tests and a build on every push and pull request, so a broken change shows up before you rely on the deployment.

The build uses relative paths, so `dist/` also works on any other static host.

## Before launch

Edit `src/config/business.json`. Every page reads its business details from there:

- `EMAIL`: a real contact address (currently a placeholder)
- `SITE_URL`: the public production address, used for link previews (set to the default Vercel address; change it if you add a custom domain)
- `UPDATED`: the date the policies last changed

## Compliance checklist

| Requirement | Where |
| --- | --- |
| Privacy policy | `legal/privacy.html` |
| Terms of service | `legal/terms.html` |
| Refund policy | `legal/refunds.html` (free today; terms ready for paid cards) |
| Cookie policy | `legal/cookies.html` |
| Consent banner | `src/ui/consent.ts`: equal choices, no cookies, drafts only on yes |
| Checked form consents | Send step requires an unticked age and terms checkbox |
| No unnecessary data | No accounts, analytics or server storage |
| Third party SDKs | None. Fonts are self hosted |
| No dark patterns or hidden fees | Free, no upsells, equal weight choices |
| No fake reviews or unsupported claims | None on the site |
| Alt text, contrast, keyboard | Decorative art hidden from screen readers, AA contrast, full keyboard support, reduced motion |
| Business details | Footer and `legal/about.html` |
| Age consent | Send step checkbox and terms |
| Unsubscribe link | Not applicable: Embossed sends no email |
| Licensed fonts and images | OFL fonts, see `THIRD_PARTY_NOTICES.md`; all artwork drawn in code |
| Data deletion path | `legal/delete-data.html` |

## Next: paid finishes

The refund policy already describes how paid cards would work. Adding M-Pesa means a small serverless function for the Daraja STK push, which would also need the privacy policy updated before going live.
