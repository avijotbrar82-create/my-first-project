/* Verta Fit — Soft theme */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal (robust: reveals in-view on load, safety net) ---------- */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    function show(e) { e.classList.add('in'); }
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
    var h = window.innerHeight || 800;
    els.forEach(function (e) { if (e.getBoundingClientRect().top < h * 0.95) show(e); });
    setTimeout(function () { els.forEach(show); }, 1600);
  }

  /* ---------- mobile navigation drawer ---------- */
  function initNav() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-menu-toggle]')) {
        e.preventDefault();
        document.documentElement.classList.toggle('nav-open');
      } else if (e.target.closest('[data-menu-close]') || e.target.classList.contains('nav-overlay')) {
        document.documentElement.classList.remove('nav-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.documentElement.classList.remove('nav-open');
    });
  }

  /* ---------- quantity steppers ([data-qty] with two buttons + input) ---------- */
  function initQty() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qty-minus],[data-qty-plus]');
      if (!btn) return;
      var wrap = btn.closest('[data-qty]');
      if (!wrap) return;
      var input = wrap.querySelector('input');
      if (!input) return;
      var v = parseInt(input.value, 10) || 1;
      v = btn.hasAttribute('data-qty-plus') ? v + 1 : Math.max(1, v - 1);
      input.value = v;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () { initReveal(); initNav(); initQty(); });
})();
