/* Verta Relief — slide-out cart drawer (AJAX) */
(function () {
  'use strict';
  var root = document.documentElement;
  var drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;

  var CURR = drawer.getAttribute('data-currency') || 'AUD';
  var RESERVE_MIN = parseInt(drawer.getAttribute('data-reserve-min'), 10) || 7;
  var FREE_THRESH = parseInt(drawer.getAttribute('data-free-threshold'), 10) || 0;
  var FREE_LABEL = drawer.getAttribute('data-free-label') || 'FREE EXPRESS SHIPPING';
  var FREE_UNLOCKED = drawer.getAttribute('data-free-unlocked') || "You've unlocked free express shipping!";
  var PROT_VARIANT = drawer.getAttribute('data-protection-variant') || '';
  var REVIEWS = window.VR_REVIEWS || {};

  // compare-at map
  var COMPARE = {};
  try {
    var mapEl = drawer.querySelector('[data-cd-compare-map]');
    if (mapEl) COMPARE = JSON.parse(mapEl.textContent || '{}');
  } catch (e) { COMPARE = {}; }

  var fmt;
  try {
    fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: CURR });
  } catch (e) {
    fmt = { format: function (n) { return '$' + (n).toFixed(2); } };
  }
  function money(cents) { return fmt.format((cents || 0) / 100); }

  var els = {
    overlay: document.querySelector('.cd-overlay'),
    count: drawer.querySelector('[data-cd-count]'),
    items: drawer.querySelector('[data-cd-items]'),
    empty: drawer.querySelector('[data-cd-empty]'),
    scroll: drawer.querySelector('[data-cd-scroll]'),
    foot: drawer.querySelector('[data-cd-foot]'),
    total: drawer.querySelector('[data-cd-total]'),
    compare: drawer.querySelector('[data-cd-compare]'),
    saving: drawer.querySelector('[data-cd-saving]'),
    ship: drawer.querySelector('[data-cd-ship]'),
    shipMsg: drawer.querySelector('[data-cd-ship-msg]'),
    shipTitle: drawer.querySelector('[data-cd-ship-title]'),
    shipFill: drawer.querySelector('[data-cd-ship-fill]'),
    timer: drawer.querySelector('[data-cd-timer]'),
    protectToggle: drawer.querySelector('[data-cd-protect-toggle]')
  };

  /* ---------- open / close ---------- */
  function open() {
    root.classList.add('cd-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (els.overlay) els.overlay.hidden = false;
    startTimer();
    refresh();
  }
  function close() {
    root.classList.remove('cd-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (els.overlay) els.overlay.hidden = true;
  }

  /* ---------- countdown (persisted) ---------- */
  var timerInt = null;
  function startTimer() {
    if (!els.timer) return;
    var KEY = 'vr_cart_reserve';
    var now = Date.now();
    var end = parseInt(sessionStorage.getItem(KEY), 10);
    if (!end || end < now) { end = now + RESERVE_MIN * 60000; try { sessionStorage.setItem(KEY, end); } catch (e) {} }
    function tick() {
      var ms = end - Date.now();
      if (ms <= 0) { end = Date.now() + RESERVE_MIN * 60000; try { sessionStorage.setItem(KEY, end); } catch (e) {} ms = end - Date.now(); }
      var s = Math.floor(ms / 1000);
      var m = Math.floor(s / 60);
      var ss = s % 60;
      els.timer.textContent = (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
    }
    tick();
    if (timerInt) clearInterval(timerInt);
    timerInt = setInterval(tick, 1000);
  }

  /* ---------- matched review per item ---------- */
  function reviewFor(handle) {
    var list = REVIEWS[handle];
    if (!list || !list.length) return null;
    var five = list.filter(function (r) { return r.s === 5 && r.t && r.t.length > 30; });
    var r = (five[0] || list[0]);
    if (!r) return null;
    var t = r.t.length > 120 ? r.t.slice(0, 117).replace(/\s+\S*$/, '') + '…' : r.t;
    return { n: r.n, t: t };
  }

  /* ---------- render ---------- */
  function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function itemHTML(item) {
    var variant = (!item.product_has_only_default_variant && item.variant_title) ? '<div class="cd-item-variant">' + esc(item.variant_title) + '</div>' : '';
    var rev = reviewFor(item.handle);
    var revHTML = rev ? '<div class="cd-item-review"><span class="cd-ir-stars">★★★★★</span> “' + esc(rev.t) + '” <span class="cd-ir-name">— ' + esc(rev.n) + '</span></div>' : '';
    var isProtect = PROT_VARIANT && String(item.id) === String(PROT_VARIANT);
    var img = item.image ? item.image.replace(/(\.[a-z]+)(\?|$)/i, '_160x$1$2') : '';
    return '' +
      '<div class="cd-item" data-key="' + esc(item.key) + '">' +
        '<a class="cd-item-img" href="' + esc(item.url) + '">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '') + '</a>' +
        '<div class="cd-item-main">' +
          '<a class="cd-item-title" href="' + esc(item.url) + '">' + esc(item.product_title) + '</a>' +
          variant +
          '<div class="cd-item-row">' +
            (isProtect ? '<span class="cd-item-protect">Shipping Protection</span>' :
            '<div class="cd-qty" data-key="' + esc(item.key) + '">' +
              '<button type="button" data-cd-dec aria-label="Decrease">&minus;</button>' +
              '<span class="cd-qty-n">' + item.quantity + '</span>' +
              '<button type="button" data-cd-inc aria-label="Increase">+</button>' +
            '</div>') +
            '<div class="cd-item-price">' + money(item.final_line_price) + '</div>' +
          '</div>' +
          revHTML +
          '<button type="button" class="cd-item-remove" data-cd-remove data-key="' + esc(item.key) + '">Remove</button>' +
        '</div>' +
      '</div>';
  }

  function render(cart) {
    var count = cart.item_count || 0;
    if (els.count) els.count.textContent = '(' + count + ')';
    // header badge
    var badge = document.querySelector('.cart .badge');
    if (badge) { badge.textContent = count; badge.hidden = count === 0; }

    if (count === 0) {
      els.items.innerHTML = '';
      if (els.empty) els.empty.hidden = false;
      if (els.foot) els.foot.hidden = true;
      if (els.ship) els.ship.hidden = true;
      return;
    }
    if (els.empty) els.empty.hidden = true;
    if (els.foot) els.foot.hidden = false;

    els.items.innerHTML = cart.items.map(itemHTML).join('');

    // totals + savings (compare-at aware)
    var was = 0;
    cart.items.forEach(function (it) {
      var cmp = COMPARE[it.id];
      var unitWas = (cmp && cmp > it.final_price) ? cmp : it.final_price;
      was += unitWas * it.quantity;
    });
    var total = cart.total_price;
    els.total.textContent = money(total);
    var saving = was - total;
    if (saving > 0) {
      els.compare.hidden = false; els.compare.textContent = money(was);
      els.saving.hidden = false; els.saving.textContent = 'Was ' + money(was) + " · you're saving " + money(saving);
    } else {
      els.compare.hidden = true; els.saving.hidden = true;
    }

    // free shipping bar
    if (els.ship && FREE_THRESH > 0) {
      els.ship.hidden = false;
      var pct = Math.min(100, Math.round((total / FREE_THRESH) * 100));
      els.shipFill.style.width = pct + '%';
      if (total >= FREE_THRESH) {
        els.shipTitle.textContent = FREE_UNLOCKED;
        els.shipMsg.innerHTML = '<b>Unlocked ✓</b>';
      } else {
        els.shipTitle.textContent = FREE_LABEL;
        els.shipMsg.innerHTML = '<b>' + money(FREE_THRESH - total) + ' more</b> to unlock';
      }
    }

    // protection toggle state
    if (els.protectToggle && PROT_VARIANT) {
      var on = cart.items.some(function (it) { return String(it.id) === String(PROT_VARIANT); });
      els.protectToggle.setAttribute('aria-checked', on ? 'true' : 'false');
      els.protectToggle.classList.toggle('on', on);
    }
  }

  /* ---------- cart API ---------- */
  function getCart() { return fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }); }
  function refresh() { return getCart().then(render).catch(function () {}); }

  function changeKey(key, qty) {
    drawer.classList.add('cd-busy');
    return fetch('/cart/change.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); }).then(render).catch(function () {}).then(function () { drawer.classList.remove('cd-busy'); });
  }

  function addVariant(id, qty) {
    drawer.classList.add('cd-busy');
    return fetch('/cart/add.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: id, quantity: qty || 1 })
    }).then(function (r) { return r.json(); }).then(function () { return refresh(); }).then(function () { drawer.classList.remove('cd-busy'); });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open], .cart[href$="/cart"], a.cart')) {
      var opener = e.target.closest('[data-cart-open], a.cart');
      if (opener) { e.preventDefault(); open(); return; }
    }
    if (e.target.closest('[data-cd-close]')) { e.preventDefault(); close(); return; }

    var inc = e.target.closest('[data-cd-inc]');
    var dec = e.target.closest('[data-cd-dec]');
    var rem = e.target.closest('[data-cd-remove]');
    if (inc || dec) {
      var q = (inc || dec).closest('.cd-qty');
      var key = q.getAttribute('data-key');
      var n = parseInt(q.querySelector('.cd-qty-n').textContent, 10) || 1;
      changeKey(key, inc ? n + 1 : Math.max(0, n - 1));
      return;
    }
    if (rem) { e.preventDefault(); changeKey(rem.getAttribute('data-key'), 0); return; }

    if (e.target.closest('[data-cd-discount]')) {
      var row = drawer.querySelector('[data-cd-discount-row]');
      if (row) row.hidden = !row.hidden;
      return;
    }

    var prot = e.target.closest('[data-cd-protect-toggle]');
    if (prot && PROT_VARIANT) {
      var isOn = prot.getAttribute('aria-checked') === 'true';
      if (isOn) {
        getCart().then(function (c) {
          var it = c.items.filter(function (x) { return String(x.id) === String(PROT_VARIANT); })[0];
          if (it) changeKey(it.key, 0);
        });
      } else { addVariant(PROT_VARIANT, 1); }
      return;
    }
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* intercept add-to-cart forms → AJAX add + open drawer */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.action || form.action.indexOf('/cart/add') === -1) return;
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) { btn.classList.add('is-loading'); btn.disabled = true; }
    fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function () { open(); return refresh(); })
      .catch(function () { form.submit(); })
      .then(function () { if (btn) { btn.classList.remove('is-loading'); btn.disabled = false; } });
  });

  // keep badge fresh on load
  refresh();
})();
