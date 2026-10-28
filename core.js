/* =====================================================================
   CORE — shared by every page
   Header, footer, language & theme, page transitions, cursor, toasts,
   news loader, helpers (window.AM). Page scripts run after this file.
   ===================================================================== */
(() => {
  const S = window.SITE, SV = window.SERVICES, T = window.I18N;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "home";

  /* ---------- language + text helpers ---------- */
  let lang = (() => {
    try {
      const q = new URLSearchParams(location.search).get("lang");
      if (q === "ar" || q === "en") return q;
      return localStorage.getItem("lang") === "ar" ? "ar" : "en";
    } catch { return "en"; }
  })();
  const AR = () => lang === "ar";
  const t = (k, vars) => {
    let s = (T[lang] && T[lang][k]) ?? T.en[k] ?? k;
    if (vars) for (const v in vars) s = s.split(`{${v}}`).join(vars[v]);
    return s;
  };
  const pick = (en, ar) => AR() ? (ar || en) : (en || ar);
  const title = s => AR() ? s.ar : s.title;
  const altTitle = s => AR() ? s.title : s.ar;
  const subName = u => AR() ? u.ar : u.name;
  const blurb = s => pick(s.blurb, s.blurbAr);
  const doc = d => Array.isArray(d) ? (AR() ? d[1] : d[0]) : d;
  const docEn = d => Array.isArray(d) ? d[0] : d;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const safe = s => String(s).replace(/[\\/:*?"<>|#%]+/g, " ").replace(/\s+/g, " ").trim();
  const ext = n => { const i = n.lastIndexOf("."); return i > 0 ? n.slice(i).toLowerCase() : ""; };
  const fmtDate = d => {
    try { return new Intl.DateTimeFormat(AR() ? "ar-LB" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d)); }
    catch { return String(d); }
  };
  const qs = k => new URLSearchParams(location.search).get(k);
  const svcById = id => SV.find(s => s.id === id);

  /* ---------- icons ---------- */
  const P = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    register: P('<path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4M8 12h8M8 16h5"/>'),
    shield: P('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    building: P('<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 13h.01M15 13h.01"/>'),
    car: P('<path d="M5 16 6.5 9.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="12" width="18" height="6" rx="2"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/>'),
    globe: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    umbrella: P('<path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z"/><path d="M12 12v6a2 2 0 0 0 4 0"/>'),
    calc: P('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'),
    badge: P('<rect x="4" y="5" width="16" height="15" rx="2"/><circle cx="12" cy="11" r="2.5"/><path d="M8 17c1-2 7-2 8 0M9 5V3h6v2"/>'),
    family: P('<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M2.5 20c.5-4 3-6 5.5-6s5 2 5.5 6M14 20c.3-3 1.6-4.5 3-4.5s2.8 1.5 3.3 4.5"/>'),
    spark: P('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
    permit: P('<path d="M7 3h10v18l-5-3-5 3z"/><path d="M10 9h4M10 12h4"/>'),
    pen: P('<path d="m15 4 5 5L9 20H4v-5z"/><path d="m13 6 5 5"/>'),
    arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    news: P('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>'),
    print: P('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>'),
    link: P('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    chat: P('<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.9A8 8 0 1 1 21 12z"/>'),
    check: P('<path d="m5 12 5 5L20 7"/>')
  };

  /* =====================================================================
     SHELL — header, footer, login window, My files, toast, WhatsApp
     ===================================================================== */
  const NAV = [
    ["index.html", "nav.home", "home"],
    ["services.html", "nav.services", "services"],
    ["news.html", "nav.news", "news"],
    ["about.html", "nav.about", "about"],
    ["index.html#contact", "nav.contact", "contact"]
  ];
  const active = { home: "home", services: "services", service: "services", news: "news", article: "news", about: "about" }[page];

  const header = `
  <header class="nav">
    <a href="index.html" class="logo"><span class="logo-mark"></span><span data-brand>Al Marjaa</span></a>
    <nav class="nav-links" id="navLinks" aria-label="Main">
      ${NAV.map(([href, key, id]) => `<a href="${href}" data-i18n="${key}"${id === active ? ' aria-current="page" class="active"' : ""}></a>`).join("")}
    </nav>
    <button class="theme" id="themeBtn" type="button" aria-label="Switch theme">
      <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>
      <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
    <button class="lang" id="langBtn" type="button" aria-label="Switch language">عربي</button>
    <a href="index.html#apply" class="btn btn-small nav-cta" id="navCta">
      <span class="avatar" id="navAvatar" hidden></span>
      <svg class="cta-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>
      <span id="navCtaText" data-i18n="nav.cta">Start a file</span>
    </a>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span></button>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="sf-inner">
      <div class="sf-brand">
        <a href="index.html" class="logo"><span class="logo-mark"></span><span data-brand>Al Marjaa</span></a>
        <p class="muted" data-i18n="footer.tagline"></p>
        <a href="#" data-wa class="btn btn-ghost btn-small sf-wa">${ICONS.chat}<span>WhatsApp</span></a>
      </div>
      <div><h4 data-i18n="footer.services"></h4><ul id="sfServices"></ul></div>
      <div><h4 data-i18n="footer.company"></h4><ul>
        <li><a href="about.html" data-i18n="nav.about"></a></li>
        <li><a href="news.html" data-i18n="nav.news"></a></li>
        <li><a href="services.html" data-i18n="footer.all"></a></li>
        <li><a href="index.html#faq" data-i18n="nav.faq"></a></li>
      </ul></div>
      <div><h4 data-i18n="footer.contact"></h4><ul class="sf-contact">
        <li><a data-tel dir="ltr"></a></li>
        <li><a data-mail dir="ltr"></a></li>
        <li data-addr></li>
        <li data-hours></li>
      </ul></div>
    </div>
    <div class="sf-bottom"><p>© <span data-year></span> <span data-brand>Al Marjaa</span>. <span data-i18n="footer"></span></p></div>
  </footer>`;

  const overlays = `
  <div class="modal auth" id="authModal" aria-hidden="true">
    <div class="modal-backdrop" data-aclose></div>
    <div class="modal-card auth-card" role="dialog" aria-modal="true" aria-labelledby="aTitle">
      <button class="modal-x" type="button" data-aclose aria-label="Close">×</button>
      <div class="auth-orb" aria-hidden="true"><span class="logo-mark"></span></div>
      <h3 id="aTitle"></h3>
      <p class="muted" id="aSub"></p>
      <p class="auth-need" id="aNeed" data-i18n="auth.needLogin" hidden></p>
      <div class="seg" id="aTabs">
        <button type="button" data-v="login" data-i18n="auth.login"></button>
        <button type="button" data-v="signup" data-i18n="auth.signup"></button>
      </div>
      <form id="authForm" novalidate>
        <label class="field" data-only="signup"><span data-i18n="auth.name"></span><input name="name" autocomplete="name" /></label>
        <label class="field" data-only="signup"><span data-i18n="auth.phone"></span><input name="phone" type="tel" dir="ltr" autocomplete="tel" placeholder="+961…" /></label>
        <label class="field" data-only="login signup reset"><span data-i18n="auth.email"></span><input name="email" type="email" dir="ltr" autocomplete="email" /></label>
        <label class="field" data-only="code"><span data-i18n="auth.code"></span><input name="code" inputmode="numeric" autocomplete="one-time-code" dir="ltr" maxlength="6" class="code-input" /></label>
        <label class="field" data-only="login signup code"><span data-i18n="auth.password"></span><input name="password" type="password" dir="ltr" autocomplete="current-password" />
          <small class="muted" data-only="signup code" data-i18n="auth.passwordHint"></small></label>
        <p class="auth-msg" id="aMsg" hidden></p>
        <button class="btn auth-submit" id="aSubmit" type="submit"></button>
        <div class="auth-links">
          <button type="button" class="linkbtn" id="aForgot" data-only="login" data-i18n="auth.forgot"></button>
          <button type="button" class="linkbtn" id="aBack" data-only="reset code" data-i18n="auth.back"></button>
        </div>
      </form>
    </div>
  </div>

  <div class="dash" id="dash" aria-hidden="true">
    <div class="dash-inner">
      <header class="dash-head">
        <div><p class="eyebrow" id="dSub"></p><h2 id="dHello"></h2></div>
        <div class="dash-actions">
          <button type="button" class="btn btn-small" id="dNew" data-i18n="dash.new"></button>
          <button type="button" class="btn btn-ghost btn-small" id="dRefresh" data-i18n="dash.refresh"></button>
          <button type="button" class="btn btn-ghost btn-small" id="dLogout" data-i18n="dash.logout"></button>
          <button type="button" class="dash-x" id="dClose" aria-label="Close">×</button>
        </div>
      </header>
      <div class="dash-tools" id="dTools" hidden>
        <div class="seg" id="dScope">
          <button type="button" data-v="all" data-i18n="dash.tab.all"></button>
          <button type="button" data-v="mine" data-i18n="dash.tab.mine"></button>
        </div>
        <input type="search" id="dSearch" data-i18n-ph="dash.search" />
        <select id="dFilter"></select>
      </div>
      <div class="dash-stats" id="dStats"></div>
      <div class="dash-list" id="dList"></div>
    </div>
  </div>

  <div class="toast" id="toast" role="status"></div>
  <a class="wa-float" href="#" data-wa aria-label="WhatsApp">
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
  </a>
  <div class="curtain" aria-hidden="true"><span class="logo-mark"></span></div>`;

  document.body.insertAdjacentHTML("afterbegin", header + `<canvas id="scene" aria-hidden="true"></canvas><div class="grain" aria-hidden="true"></div>`);
  document.body.insertAdjacentHTML("beforeend", footer + overlays);
  $("#sfServices").innerHTML = SV.slice(0, 6).map(s => `<li><a href="service.html?id=${s.id}" data-svc-title="${s.id}"></a></li>`).join("");

  /* ---------- toast ---------- */
  function toast(msg, err) {
    const el = $("#toast");
    el.textContent = msg; el.classList.toggle("err", !!err); el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 5000);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, d = +(el.dataset.delay || 0);
    if (d) el.style.transitionDelay = d + "ms";
    el.classList.add("in");
    setTimeout(() => (el.style.transitionDelay = ""), 1300 + d);
    io.unobserve(el);
  }), { threshold: .1, rootMargin: "0px 0px -40px 0px" });
  const reveal = (root = document) => $$(".reveal:not(.in):not([data-io])", root).forEach(el => { el.dataset.io = 1; io.observe(el); });

  /* ---------- language ---------- */
  const onLang = [];
  function applyLang() {
    const h = document.documentElement;
    h.lang = lang; h.dir = AR() ? "rtl" : "ltr";
    $$("[data-i18n]").forEach(e => e.textContent = t(e.dataset.i18n));
    $$("[data-i18n-ph]").forEach(e => e.placeholder = t(e.dataset.i18nPh));
    $("#langBtn").textContent = t("lang.toggle");
    $$("[data-brand]").forEach(e => e.textContent = AR() ? S.brandAr : S.brand);
    $$("[data-brand-ar]").forEach(e => { e.textContent = AR() ? S.brand : S.brandAr; e.classList.toggle("ar", !AR()); });
    $$("[data-svc-title]").forEach(e => { const s = svcById(e.dataset.svcTitle); if (s) e.textContent = title(s); });
    $$("[data-tel]").forEach(a => { a.textContent = S.phone; a.href = "tel:" + S.phone.replace(/\s/g, ""); });
    $$("[data-tel-text]").forEach(a => a.textContent = S.phone);
    $$("[data-mail]").forEach(a => { a.textContent = S.email; a.href = "mailto:" + S.email; });
    $$("[data-addr]").forEach(e => e.textContent = pick(S.address, S.addressAr));
    $$("[data-hours]").forEach(e => e.textContent = pick(S.hours, S.hoursAr));
    $$("[data-year]").forEach(e => e.textContent = new Date().getFullYear());
    $$("[data-wa]").forEach(a => { a.href = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(t("wa.msg", { brand: S.brand }))}`; a.target = "_blank"; a.rel = "noopener"; });
    const tk = document.body.dataset.titleKey;
    document.title = `${AR() ? S.brandAr : S.brand} — ${t(tk || "meta.title")}`;
    onLang.forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
    try { localStorage.setItem("lang", lang); } catch {}
    reveal();
  }
  $("#langBtn").addEventListener("click", () => { lang = AR() ? "en" : "ar"; applyLang(); });

  /* ---------- theme ---------- */
  const isLight = () => document.documentElement.dataset.theme === "light";
  const onTheme = [];
  $("#themeBtn").addEventListener("click", () => {
    const next = isLight() ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    onTheme.forEach(fn => fn());
  });

  /* ---------- nav ---------- */
  const nav = $(".nav");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("hide", y > lastY && y > 300 && !nav.classList.contains("open"));
    nav.classList.toggle("scrolled", y > 30);
    lastY = y;
  }, { passive: true });
  $("#burger").addEventListener("click", () => nav.classList.toggle("open"));
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- page transitions ---------- */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // same page: let #hash scroll
    e.preventDefault();
    if (reduced) { location.href = url.href; return; }
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = url.href), 420);
  });
  addEventListener("pageshow", () => document.body.classList.remove("leaving"));
  requestAnimationFrame(() => document.body.classList.add("entered"));

  /* ---------- magnetic glow cursor (desktop only) ---------- */
  if (!reduced && matchMedia("(pointer: fine)").matches) {
    const c = document.createElement("div"); c.className = "cursor"; c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; c.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerover", e => c.classList.toggle("big", !!e.target.closest("a, button, .card, .chip, summary, label.up, .wz-opt")));
    document.addEventListener("pointerleave", () => c.classList.remove("on"));
    (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
  }

  /* ---------- 3D tilt for anything with .tilt ---------- */
  document.addEventListener("pointermove", e => {
    if (reduced || e.pointerType === "touch") return;
    const el = e.target.closest(".tilt"); if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - .5) * 14}deg`);
    el.style.setProperty("--rx", `${(.5 - y) * 12}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  });
  document.addEventListener("pointerout", e => {
    const el = e.target.closest(".tilt");
    if (el && !el.contains(e.relatedTarget)) { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); }
  });

  /* ---------- news: local list + rows from the Google Sheet "News" tab ---------- */
  let newsPromise = null;
  const imgOk = u => /^https:\/\//.test(String(u || "")) ? String(u) : "";
  function news() {
    if (newsPromise) return newsPromise;
    const local = (window.NEWS || []).map(n => ({ ...n }));
    const url = S.googleScriptUrl;
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem("am_news2") || "null"); } catch {}
    const remote = cached ? Promise.resolve(cached) : !url ? Promise.resolve({ items: [], hidden: [] }) :
      Promise.race([
        fetch(url, { method: "POST", body: JSON.stringify({ action: "news" }) }).then(r => r.json())
          .then(o => o.ok ? { items: o.items || [], hidden: o.hidden || [] } : { items: [], hidden: [] }),
        new Promise(res => setTimeout(() => res(null), 6000))
      ]).catch(() => null).then(o => {
        if (o) { try { sessionStorage.setItem("am_news2", JSON.stringify(o)); } catch {} }
        return o || { items: [], hidden: [] };
      });
    newsPromise = remote.then(({ items, hidden }) => {
      const skip = new Set([...items.map(i => i.id), ...(hidden || [])]);
      return [...items.map(n => ({ ...n, fromSheet: true })), ...local.filter(n => !skip.has(n.id))]
        .filter(n => n.id && (n.title || n.titleAr))
        .map(n => ({ ...n, image: imgOk(n.image) }))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    });
    return newsPromise;
  }
  // after the office edits news on the site: forget the cached copy and re-render
  const newsListeners = [];
  function newsRefresh() {
    try { sessionStorage.removeItem("am_news2"); } catch {}
    newsPromise = null;
    newsListeners.forEach(f => { try { f(); } catch (e) { console.error(e); } });
  }
  const readMins = n => Math.max(1, Math.round(((AR() ? n.bodyAr : n.body) || []).join(" ").split(/\s+/).length / 200));

  // a broken picture link should never leave a broken-image icon behind
  document.addEventListener("error", e => {
    const im = e.target;
    if (!im || im.tagName !== "IMG") return;
    const box = im.closest(".nc-img, .nf-art, .art-cover, .nr-cover, .nr-thumb, .nr-pv");
    if (!box) return;
    const host = im.closest(".has-img"); if (host) host.classList.remove("has-img");
    if (box.matches(".nc-img, .art-cover")) box.remove(); else im.remove();
  }, true);

  /* ---------- shared card markup ---------- */
  const newsCard = (n, i = 0) => `
    <a class="news-card reveal tilt${n.image ? " has-img" : ""}" data-delay="${(i % 3) * 80}" data-nid="${esc(n.id)}" href="article.html?id=${encodeURIComponent(n.id)}">
      ${n.image ? `<span class="nc-img"><img src="${esc(n.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" /></span>` : ""}
      <span class="nc-top"><span class="nc-cat c-${esc(n.category)}">${t("ncat." + n.category)}</span><time>${fmtDate(n.date)}</time></span>
      <b>${esc(pick(n.title, n.titleAr))}</b>
      <span class="nc-sum">${esc(pick(n.summary, n.summaryAr))}</span>
      <span class="nc-more">${t("common.readMore")} ${ICONS.arrow}</span>
    </a>`;

  window.AM = {
    S, SV, t, esc, pad, safe, ext, toast, ICONS, qs, page,
    isAR: AR, lang: () => lang, pick, title, altTitle, subName, blurb, doc, docEn, svcById, fmtDate,
    isLight, reduced, onLang, onTheme, reveal, news, newsCard, readMins, applyLang,
    newsRefresh, onNews: newsListeners
  };

  // page scripts register their hooks first, then everything renders once
  document.addEventListener("DOMContentLoaded", () => {
    applyLang();
    setTimeout(() => { const l = $("#loader"); l && l.classList.add("done"); document.body.classList.add("ready"); }, page === "home" ? 500 : 50);
  });
})();
