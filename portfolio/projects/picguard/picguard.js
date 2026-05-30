/* PicGuard page interactions: i18n + scrollspy + theme + links */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const i18n = window.PICGUARD_I18N;
  if (!i18n) return;

  // Global language sync across the whole portfolio site
  const GLOBAL_LANG_KEY = "portfolio_lang";
  const LEGACY_LANG_KEY = "picguard_lang";

  const state = { lang: "zh" };

  function t(path) {
    const parts = path.split(".");
    let cur = i18n[state.lang];
    for (const p of parts) {
      if (cur == null) return "";
      cur = cur[p];
    }
    return cur ?? "";
  }

  function setMeta(lang) {
    const meta = i18n[lang]?.meta;
    if (!meta) return;
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.description);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
  }

  function render() {
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = String(t(key));
    });

    $$("[data-i18n-list]").forEach((el) => {
      const key = el.getAttribute("data-i18n-list");
      const arr = t(key);
      if (!Array.isArray(arr)) return;
      el.innerHTML = arr.map((s) => `<li>${escapeHtml(String(s))}</li>`).join("");
    });

    $$("[data-i18n-links]").forEach((el) => {
      const key = el.getAttribute("data-i18n-links");
      const arr = t(key);
      if (!Array.isArray(arr)) return;
      el.innerHTML = arr
        .map((x) => `<a class="pill" href="${escapeAttr(x.href)}">${escapeHtml(x.label)}</a>`)
        .join("");
    });

    const langBtn = $("#langBtn");
    if (langBtn) langBtn.textContent = t("nav.lang");

    const themeBtn = $("#themeBtn");
    if (themeBtn) {
      const cur = document.documentElement.getAttribute("data-theme") || "";
      if (cur === "dark") themeBtn.textContent = t("nav.theme_dark");
      else if (cur === "light") themeBtn.textContent = t("nav.theme_light");
      else {
        const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        themeBtn.textContent = sysDark ? t("nav.theme_dark") : t("nav.theme_light");
      }
    }
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escapeAttr(s) {
    return String(s).replace(/\"/g, "&quot;");
  }

  function setLang(nextLang, persist = true) {
    state.lang = nextLang === "en" ? "en" : "zh";
    setMeta(state.lang);
    render();
    if (persist) {
      try {
        localStorage.setItem(GLOBAL_LANG_KEY, state.lang);
        localStorage.removeItem(LEGACY_LANG_KEY);
      } catch {}
    }
  }

  function setTheme(nextTheme, persist = true) {
    if (nextTheme === "dark" || nextTheme === "light") {
      document.documentElement.setAttribute("data-theme", nextTheme);
      if (persist) localStorage.setItem("site_theme", nextTheme);
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (persist) localStorage.removeItem("site_theme");
    }
    render();
  }

  // Scrollspy
  const sectionIds = ["overview", "results", "method", "sources"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = new Map(sectionIds.map((id) => [id, document.querySelector(`nav a[href=\"#${id}\"]`)]));

  function activate(id) {
    navLinks.forEach((a) => a && a.classList.remove("active"));
    const a = navLinks.get(id);
    if (a) a.classList.add("active");
  }

  function onScroll() {
    const y = window.scrollY + 120;
    let current = "overview";
    for (const s of sections) if (s.offsetTop <= y) current = s.id;
    activate(current);
  }

  function wire() {
    try {
      const savedTheme = localStorage.getItem("site_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch {}

    const urlLang = new URL(location.href).searchParams.get("lang");
    let savedLang = null;
    let legacyLang = null;
    try {
      savedLang = localStorage.getItem(GLOBAL_LANG_KEY);
      legacyLang = localStorage.getItem(LEGACY_LANG_KEY);
      if (!savedLang && (legacyLang === "zh" || legacyLang === "en")) {
        localStorage.setItem(GLOBAL_LANG_KEY, legacyLang);
        savedLang = legacyLang;
        localStorage.removeItem(LEGACY_LANG_KEY);
      }
    } catch {}
    setLang(urlLang || savedLang || legacyLang || "zh", false);
    if (urlLang === "zh" || urlLang === "en") {
      try { localStorage.setItem(GLOBAL_LANG_KEY, state.lang); } catch {}
    }

    const langBtn = $("#langBtn");
    if (langBtn) langBtn.addEventListener("click", () => setLang(state.lang === "zh" ? "en" : "zh"));

    const themeBtn = $("#themeBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme");
        if (!cur) {
          const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTheme(sysDark ? "light" : "dark");
          return;
        }
        setTheme(cur === "dark" ? "light" : "dark");
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
