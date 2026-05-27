/**
 * theme.js — Light/Dark mode + Hamburger nav
 * Persists preference in localStorage.
 * Syncs with OS prefers-color-scheme on first visit.
 */
(function () {
  'use strict';

  /* ── Theme ── */
  const root    = document.documentElement;
  const toggle  = document.getElementById('theme-toggle');
  const STORAGE = 'hema-theme';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      const label = toggle.querySelector('.toggle-label');
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    localStorage.setItem(STORAGE, theme);
  }

  // Apply on load (before paint to avoid flash)
  applyTheme(getPreferred());

  if (toggle) {
    toggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Sync if OS preference changes while page is open
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ── Hamburger nav ── */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked (mobile UX)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }
})();
