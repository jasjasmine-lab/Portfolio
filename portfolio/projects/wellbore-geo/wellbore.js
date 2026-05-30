/* Wellbore Geology Prediction page interactions: i18n + theme + scrollspy + viz data */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const i18n = window.WELLBORE_GEO_I18N;
  if (!i18n) return;

  // Global language sync across the whole portfolio site
  const GLOBAL_LANG_KEY = "portfolio_lang";

  const state = { lang: "zh", viz: null };

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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escapeAttr(s) {
    return String(s).replace(/\"/g, "&quot;");
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

  function setLang(nextLang, persist = true) {
    state.lang = nextLang === "en" ? "en" : "zh";
    setMeta(state.lang);
    render();
    if (persist) {
      try {
        localStorage.setItem(GLOBAL_LANG_KEY, state.lang);
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
  const sectionIds = ["overview", "results", "method"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = new Map(sectionIds.map((id) => [id, document.querySelector(`nav a[href=\"#${id}\"]`)]));

  function activate(id) {
    navLinks.forEach((a) => a && a.classList.remove("active"));
    const a = navLinks.get(id);
    if (a) a.classList.add("active");
  }

  function onScroll() {
    const y = window.scrollY + 120;
    let current = sectionIds[0];
    for (const s of sections) if (s.offsetTop <= y) current = s.id;
    activate(current);
  }

  function fmtNumber(x) {
    if (x == null || x === "") return "—";
    if (typeof x === "number") return x.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const n = Number(x);
    if (Number.isFinite(n)) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return String(x);
  }

  function fmtFloat(x, digits = 4) {
    if (x == null || x === "") return "—";
    const n = typeof x === "number" ? x : Number(x);
    if (!Number.isFinite(n)) return String(x);
    return n.toFixed(digits);
  }

  function applyVizMeta() {
    const meta = state.viz?.meta;
    if (!meta) return;

    $$("[data-field]").forEach((el) => {
      const k = el.getAttribute("data-field");
      const v = meta[k];
      if (k === "lb_rmse" || k === "oof_rmse") el.textContent = fmtFloat(v, 4);
      else el.textContent = fmtNumber(v);
    });
  }

  async function loadVizData() {
    try {
      const res = await fetch("../../raw/wellbore-geo/viz_data.json", { cache: "no-store" });
      if (!res.ok) return;
      state.viz = await res.json();
      applyVizMeta();
    } catch (e) {
      // keep placeholders
    }
  }

  function wire() {
    // Theme (sync early)
    try {
      const savedTheme = localStorage.getItem("site_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch {}

    // Language (global)
    const urlLang = new URL(location.href).searchParams.get("lang");
    let savedLang = null;
    try {
      savedLang = localStorage.getItem(GLOBAL_LANG_KEY);
    } catch {}
    setLang(urlLang || savedLang || "zh", false);
    if (urlLang === "zh" || urlLang === "en") {
      try {
        localStorage.setItem(GLOBAL_LANG_KEY, state.lang);
      } catch {}
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

    loadVizData();
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
