# DJ-Dordje — djdordje.com (redesign)

New one-page site for **DJ Dordje** (DJ + live vocal, Athens), in the approved
"Black & White Tracklist" style with **Side A / Side B**:

- **Side A — Свадьба**: light cream theme, warm hero video, slower motion, elegant photos
- **Side B — Вечеринка**: dark club theme, red-tinted hero, outlined "DORDJE", faster motion, club photos

First-time visitors pick a side on the "Что празднуем?" screen; the choice is remembered.
Same domain: **djdordje.com**. Language: Russian (Greek and English versions to come).

## Structure

```
DJ-Dordje/
├─ index.html              the whole site (all copy lives here)
├─ 404.html                "track not found" page
├─ ru/index.html, en/index.html   redirect old WordPress URLs to /
├─ .htaccess               HTTPS, www→non-www, old URL redirects, caching (Apache/Hostinger)
├─ robots.txt, sitemap.xml
└─ assets/
   ├─ css/main.css         design tokens per side (.side-a / .side-b) + all styles
   ├─ js/main.js           side switch, chooser, animations, prices tracklist, booking form
   ├─ img/                 photos from the current site (resized), og.jpg, favicon.png
   └─ video/dordje-live.mp4   the banquet clip (converted from the original .mov)
```

## Direct links to a side

- `https://djdordje.com/?side=wedding` → opens straight on Side A (good for wedding ads)
- `https://djdordje.com/?side=party` → opens straight on Side B

## Editing

- **Text**: edit `index.html`. Text that differs per side is wrapped in
  `<span class="only-a">…</span>` (weddings) and `<span class="only-b">…</span>` (parties).
- **Prices**: section `05 PRICES` in `index.html` (the `.track` blocks).
- **Reviews**: section `07 REVIEWS` — replace the `[Текст отзыва …]` placeholders with the real texts.
- **Colours**: top of `assets/css/main.css` (`.side-b` and `.side-a` blocks).
- **WhatsApp number for the form**: `WA_NUMBER` at the top of `assets/js/main.js`.

## Booking form

No server needed: on submit it plays the "beat drop", then opens WhatsApp with a ready-made
message (name, type, date, guests, contact) to +30 694 277 0701. The client just presses Send.

## Animations

Letters of DORDJE rise in (A) or punch in (B) · equaliser in the "Now playing" bar ·
marquee speed follows scroll speed (BPM) · section numbers flick like a CDJ ·
headings slide in · photos go from B&W to colour on scroll · price "tracks" play a waveform ·
red "needle drop" wipe when switching sides · flash + shake on form submit.
All motion is switched off for visitors who set "reduce motion" on their device.

## Preview locally

```
cd DJ-Dordje
python -m http.server 8000     # then open http://localhost:8000
```

## Going live (same domain)

The site is plain static files. Two ways, same as our other projects:

**A. Hostinger hosting** (if djdordje.com is hosted there)
1. Back up the current WordPress site (Hostinger → Backups, or download `public_html`).
2. Upload the contents of this folder into `public_html` (File Manager or Git deploy),
   replacing the WordPress files. `.htaccess` must be included (it's a hidden file).

**B. GitHub + Vercel/Netlify**
1. Push this folder to a new GitHub repo (e.g. `J-ntk/DJ-Dordje`) with GitHub Desktop.
2. Import the repo in Vercel (framework: "Other", no build command).
3. In Vercel add the domain `djdordje.com`, then point the DNS records at the registrar
   to what Vercel shows. Note: `.htaccess` is ignored there; Vercel handles HTTPS itself.

## Still to do

- Real review texts (section 07)
- Confirm WhatsApp number (old site had two: +30 694 277 0701 and +30 694 969 6096)
- Greek and English versions
