/* RoboTRAC page interactions: i18n + scrollspy + copy */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const i18n = window.ROBOTRAC_I18N;
  if (!i18n) return;

  const state = {
    lang: "zh",
  };

  function setMeta(lang) {
    const meta = i18n[lang]?.meta;
    if (!meta) return;
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.description);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
  }

  function t(path) {
    const parts = path.split(".");
    let cur = i18n[state.lang];
    for (const p of parts) {
      if (cur == null) return "";
      cur = cur[p];
    }
    return cur ?? "";
  }

  function renderTextNodes() {
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val == null) return;
      el.textContent = String(val);
    });

    // lists
    $$("[data-i18n-list]").forEach((el) => {
      const key = el.getAttribute("data-i18n-list");
      const arr = t(key);
      if (!Array.isArray(arr)) return;
      el.innerHTML = arr.map((s) => `<li>${escapeHtml(String(s))}</li>`).join("");
    });

    // links list
    $$("[data-i18n-links]").forEach((el) => {
      const key = el.getAttribute("data-i18n-links");
      const arr = t(key);
      if (!Array.isArray(arr)) return;
      el.innerHTML = arr
        .map(
          (x) =>
            `<a class="pill" href="${escapeAttr(x.href)}">${escapeHtml(
              x.label
            )}</a>`
        )
        .join("");
    });

    // button label
    const langBtn = $("#langBtn");
    if (langBtn) langBtn.textContent = t("nav.lang");

    // copy buttons
    $$("[data-copy]").forEach((btn) => {
      btn.textContent = t("blocks.copy");
    });
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
    renderTextNodes();
    if (persist) localStorage.setItem("roboTRAC_lang", state.lang);
  }

  // Scrollspy
  const sectionIds = ["overview", "results", "method", "reproducibility", "sources"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = new Map(sectionIds.map((id) => [id, document.querySelector(`nav a[href="#${id}"]`)]));

  function activate(id) {
    navLinks.forEach((a) => a && a.classList.remove("active"));
    const a = navLinks.get(id);
    if (a) a.classList.add("active");
  }

  function onScroll() {
    const y = window.scrollY + 120;
    let current = "overview";
    for (const s of sections) {
      if (s.offsetTop <= y) current = s.id;
    }
    activate(current);
  }

  // Copy
  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = t("blocks.copied");
      setTimeout(() => (btn.textContent = t("blocks.copy")), 900);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      btn.textContent = t("blocks.copied");
      setTimeout(() => (btn.textContent = t("blocks.copy")), 900);
    }
  }

  function wire() {
    const urlLang = new URL(location.href).searchParams.get("lang");
    const savedLang = localStorage.getItem("roboTRAC_lang");
    setLang(urlLang || savedLang || "zh", false);

    const langBtn = $("#langBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => setLang(state.lang === "zh" ? "en" : "zh"));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    $$("[data-copy]").forEach((btn) => {
      const target = btn.getAttribute("data-copy");
      const pre = document.querySelector(target);
      if (!pre) return;
      btn.addEventListener("click", () => copyText(pre.textContent || "", btn));
    });
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
