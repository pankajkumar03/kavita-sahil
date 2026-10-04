# Engagement Invitation — "Auspicious Beginnings"

A mobile-first Indian engagement invitation website: React + TypeScript + Vite + Tailwind CSS,
with custom SVG ornaments (floral corners, mandala, lotus, paisley, diya, haveli arch & skyline).

## 1. Add your details — one file

Everything (names, date, venue, links, photos, music) lives in
**`src/config/invitation.ts`**. Search that file for `REPLACE`.

| What | Where in `invitation.ts` |
| --- | --- |
| Bride's name, parents, family name | `bride.name`, `bride.parents`, `bride.familyName` |
| Groom's name, parents, family name | `groom.name`, `groom.parents`, `groom.familyName` |
| Date & time | `event.date` (`YYYY-MM-DD`), `event.time` (`HH:MM`, 24-hour) |
| Venue, address, city | `event.venue`, `event.address`, `event.city` |
| Google Maps link | `event.mapsUrl` (leave empty to search by address); `event.showLiveMap: true` for a live map |
| Music | put the song in `public/music/background.mp3` (or change `music.url`); the button appears once the file is there |
| Photos | see `public/images/README.md` for file names and sizes |
| Link preview (WhatsApp) | `site.url` (after deploying) and `public/images/og-cover.jpg` (1200×630) |

Names look best written normally (`Priya Sharma`): they are set in engraved small caps automatically.
Missing photos show a soft placeholder, so you can add them gradually.

## 2. Run it

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # production files in dist/
```

## 3. Deploy

`dist/` is a static site: drag it onto Netlify Drop, or connect the folder to Vercel /
Cloudflare Pages (build command `npm run build`, output `dist`). After deploying, put the
public URL in `site.url` and rebuild so WhatsApp link previews show your cover image.

Tip: sharing `https://your-site/#venue` (or `#details`, `#gallery`) opens straight to that
section, skipping the cover.

## What works client-side

- Opening cover with drawn mandala → "Open Invitation" door transition
- Live countdown (timezone-correct via `event.timezoneOffset`)
- Add to Calendar: Google Calendar link + downloadable `.ics` (Apple / Outlook)
- View Location / Get Directions (Google Maps)
- Gallery: swipe on mobile, masonry on desktop, keyboard + swipe lightbox
- Music starts when the guest taps "Open Invitation" (fades in; `music.autoplayOnOpen`), with a pause/play button; never plays on page load
- Reduced-motion support, keyboard navigation, screen-reader labels

## Structure

```
src/config/invitation.ts   ← your details
src/components/            ← one component per section (Hero, FamilyBlessings, Gallery, …)
src/components/decor/      ← reusable SVG ornaments
src/lib/                   ← calendar, maps links, music
src/index.css              ← colour tokens, typography, all styling
```
