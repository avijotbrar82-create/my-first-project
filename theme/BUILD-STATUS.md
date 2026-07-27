# Verta Fit — Shopify Liquid theme (Soft) · COMPLETE

Full Online Store 2.0 theme ported from the approved Soft prototypes.
See INSTALL.md for upload + setup steps. Packaged as `verta-fit-soft-theme.zip` (repo root).

## Structure
- layout/: theme.liquid, password.liquid
- sections/: header, footer, hero, trust-row, featured-collection, benefits,
  product-spotlight, method-steps, reviews, cta-band, main-product, related-products,
  main-collection, page-about, value-props, page-contact, page-track-order, main-page,
  main-cart, main-search, main-list-collections, main-blog, main-article, main-404
- snippets/: product-card, icon
- templates/: index, product, collection, page (+ about/contact/track-order),
  cart, search, list-collections, blog, article, 404, gift_card, password, customers/*
- assets/: theme.css, theme.js, fonts (Fraunces + Nunito Sans), hero image
- config/: settings_schema, settings_data · locales/: en.default

## Data source
Products, prices, media, cart, checkout, policies, contact form → live from Shopify.

## Not done here (by design)
- Not rendered against a live store (sandbox can't run Liquid) — preview before publishing.
- Faceted collection filtering kept simple (sort + pagination).
