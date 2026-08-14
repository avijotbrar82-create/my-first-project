# Verta Relief — Soft theme · Install guide

A complete Shopify **Online Store 2.0** theme built from the approved Soft designs.
Product data, prices, images, cart and checkout all come live from your Shopify store.

> ⚠️ This theme was authored offline and hasn't been rendered against a live Shopify
> store. **Install it as a new/unpublished theme and Preview it first** — don't publish
> over your live theme until you've clicked through it.

---

## Option A — Upload via Shopify admin (no tools needed)

1. Grab the packaged file **`verta-fit-soft-theme.zip`** from the repo root
   (or zip the **contents** of the `theme/` folder yourself — `layout/`, `sections/`,
   `templates/`, etc. must sit at the **root** of the zip, not inside a `theme/` folder).
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**.
3. On the new theme, click **⋯ → Preview** (or **Customize**) to review it.
4. When happy: **⋯ → Publish**.

## Option B — Shopify CLI (recommended for iterating)

```bash
cd theme
shopify theme dev      # live local preview against your store
# or
shopify theme push --unpublished   # upload as a new unpublished theme
```

---

## Post-install setup (5 minutes)

1. **Navigation menu.** Online Store → Navigation → make sure `main-menu` has:
   - Shop → `/collections/all`
   - About → `/pages/about-us`
   - Contact → `/pages/contact`
   (The header falls back to sensible links if the menu is empty, but setting it is best.)

2. **Assign page templates.** Online Store → Pages, and set each page's **Theme template**:
   - **About Us** → `page.about`
   - **Contact** → `page.contact`
   - **Track Order** → `page.track-order`
   - FAQs / policies → default `page`
   These pages already exist in your store with the right content.

3. **Featured collection.** In the theme editor, open the homepage **Featured collection**
   section and pick a collection (e.g. create one called *Recovery* with all 5 products).
   If left blank it automatically shows your first products.

4. **Product spotlight.** The homepage spotlight defaults to the Mini Massage Gun handle.
   If your handle differs, pick the product in the **Product spotlight** section.

5. **Branding (optional).** Theme settings → upload a logo + favicon, or tweak the
   palette (honey / cream / espresso). Leave the logo blank to use the built-in wordmark.

6. **Demo video (Massage Gun).** The **Mini Massage Gun** page shows a *"See it in action"*
   video band using the built-in clip (`assets/massage-gun-demo.mp4`), auto-scoped to that
   product's handle. To change it: theme editor → open the **Product** section → **Demo video**
   → either edit the handle list, or pick your own video from Shopify Files (that video then
   shows on every product using this template). Toggle it off there too. The clip is muted,
   loops, and only plays while on screen; it's paused for visitors with reduced-motion on.

7. **Butterfly Pillow landing page** (Derila-style long-form page). A page
   **"Butterfly Pillow"** (`/pages/butterfly-pillow`) is already created and set to the
   **`page.pillow`** template. Preview the theme and open that URL to see it. It pulls all
   its imagery from the **Ergonomic Butterfly Memory Neck Pillow** product, so swapping the
   product's photos updates the page. Edit copy/product in the theme editor → **Pillow
   landing** section (hero, headings, reviews and FAQs are all editable blocks).

That's it — product pages, collections, cart and checkout work out of the box.

---

## What's included
- **Homepage** — hero (image reveal → text), trust row, product grid, benefits,
  product spotlight, method steps, reviews, CTA.
- **Product** — media gallery + thumbnails, variant picker with live price/stock,
  add-to-cart, details accordion, **"See it in action" demo video**, related products.
- **Collection** — sortable, paginated product grid.
- **Pages** — About, Contact (working Shopify contact form), Track Order.
- **Cart**, search, collections list, blog/article, 404, gift card, password page,
  and full customer account templates (login, register, account, orders, addresses).
- Self-hosted fonts (Fraunces + Nunito Sans), warm honey palette, calm scroll animations.

---

## Launch sale + signup offer (added)

**What's already set up:**
- **Scrolling announcement bar** — "15% OFF SITEWIDE LAUNCH SALE · FREE SHIPPING · SIGN UP FOR YOUR 15% CODE" (edit text in theme editor → Announcement bar).
- **Signup popup** — collects name + email, creates a customer, and reveals the **WELCOME15** code (also on exit-intent; shows once per visitor). Edit in theme editor → Signup popup.
- **`WELCOME15`** discount code (15% off everything) — already created in your Shopify Discounts.
- **Bundle "Buy 1–5" selector** on product pages (10% / 10% / 15% / 20% at qty 2/3/4/5), with live prices.
- **"Build your bundle" builder** — the *Build your bundle* card in the homepage product grid now opens
  a picker: the customer chooses any 3 products (with variant/colour), sees their live saving, and taps
  **Add bundle & save 20%**. It adds all three to the cart and auto-applies the **`BUNDLE20`** code.
  - **`BUNDLE20`** (20% off when the cart has 3+ items, non-stacking) is **already created** in your
    Shopify Discounts, so this works out of the box.
  - Tune it in the theme editor → **Bundle builder** (products offered, items required, %, code, copy).
  - Because `BUNDLE20` just needs 3+ items, a shopper buying 3 of anything can also earn it — that's the
    same "pick 3, save 20%" promise, so it's intended. It won't stack with `WELCOME15` or the volume-app
    tiers (Shopify applies one discount; the bigger saving wins).

**2 things you need to do in Shopify:**

1. **Enforce the Buy 2/3/4/5 discounts** (the on-page selector is UI only — Shopify needs an engine to actually charge the tier price):
   - Install a **free quantity-breaks / volume-discount app** (e.g. search the Shopify App Store for "quantity breaks", "volume discount"). Set tiers: **2 → 10%, 3 → 10%, 4 → 15%, 5 → 20%**, applied to **all products**.
   - Or, for a code-free native version, tell me and I'll create automatic discounts (note Shopify only applies one tier at a time natively).

2. **(Optional) Email the WELCOME15 code automatically** on signup:
   - Shopify admin → **Marketing → Automations → "Welcome new subscribers"** → add the discount code to the email. Until you do, customers still get the code instantly in the popup.

> Note: `WELCOME15` (signup 15%) and the bundle tier discounts are separate. Shopify generally
> doesn't stack two automatic/product discounts, so a customer typically uses one or the other —
> the bigger saving wins. If you want them to stack, that needs a Shopify Function (ask me).
