# Verta Fit — Shopify Liquid theme (build in progress)

Direction chosen: **Soft**. This theme ports the approved Soft prototypes in
`design/prototypes/soft/` into a real Online Store 2.0 Shopify theme.

## Done so far
- Theme folder structure (`assets/ config/ layout/ sections/ snippets/ templates/ locales/`)
- Self-hosted fonts in `assets/` (Fraunces + Nunito Sans woff2)
- `assets/theme.css` — the Soft design system (extracted from the prototypes)
- `assets/hero-massage-guns.webp` — homepage hero marketing image
- `layout/theme.liquid` — base layout (head, fonts, grain, header/footer slots, main)

## Next up (resume here)
1. **Foundation finish:** `config/settings_schema.json`, `config/settings_data.json`,
   `locales/en.default.json`, `assets/theme.js` (robust reveal + interactions).
2. **Header + footer sections** (`sections/header.liquid`, `footer.liquid`, `announcement.liquid`)
   + `snippets/product-card.liquid`. Header transparent over hero on `index`, solid elsewhere.
3. **Homepage sections + `templates/index.json`:** hero (image reveal → text), trust row,
   featured-collection, benefits, spotlight, method, reviews, CTA.
4. **Product** (`sections/main-product.liquid` + `templates/product.json`): gallery, variant
   picker, add-to-cart form, spec band, details accordion, related products.
5. **Collection** (`sections/main-collection.liquid` + `templates/collection.json`).
6. **Pages:** about / contact (Shopify `{% form 'contact' %}`) / track-order + page templates.
7. **Cart + misc** (`templates/cart.liquid`, 404, gift_card) + finalize `settings_data.json`.
8. **Install guide** (upload via Shopify admin or `shopify theme push`).

## Reference (source of truth for design + content)
- Prototypes: `design/prototypes/soft/` (index, shop, product, about, contact, track-order)
- Tokens: `design/brand/soft/tokens.md`
- Real store content already pulled: product descriptions, About Us, contact
  (avijotbrar82@gmail.com · 0480 756 291 · Sydney Avenue, Barton ACT 2600),
  policies (free shipping all orders, 30-day returns, AU 7–14 days).

## Notes / constraints
- This sandbox can't push to Shopify or render Liquid; theme is built in-repo and
  installed by the merchant. Product images/prices come live from Shopify at render time.
