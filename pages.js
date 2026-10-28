/* =====================================================================
   INNER PAGES — services list, service detail, news, article, about
   Picks what to render from <body data-page="…">
   ===================================================================== */
(() => {
  const AM = window.AM, SV = AM.SV, t = AM.t, esc = AM.esc, pad = AM.pad, I = AM.ICONS;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const main = $("#page");
  const CATS = ["all", "business", "property", "personal", "abroad"];
  const startHref = (id, i) => `index.html?service=${id}${i != null ? `&sub=${i}` : ""}#apply`;

  const hero = (eyebrow, h1, sub, extra = "") => `
    <section class="page-hero">
      <div class="ph-inner">
        <p class="eyebrow reveal"><span class="dot"></span> ${eyebrow}</p>
        <h1 class="ph-title reveal" data-delay="80">${h1}</h1>
        ${sub ? `<p class="ph-sub reveal" data-delay="160">${sub}</p>` : ""}
        ${extra}
      </div>
    </section>`;

  /* =================== SERVICES LIST =================== */
  let cat = "all", q = "";
  function servicesPage() {
    const shown = SV.filter(s => (cat === "all" || s.category === cat) &&
      (!q || [s.title, s.ar, s.blurb, s.blurbAr, s.goal, s.goalAr, ...s.subs.flatMap(u => [u.name, u.ar])].join(" ").toLowerCase().includes(q)));
    main.innerHTML = hero(t("svcp.eyebrow"), esc(t("svcp.title")), esc(t("svcp.sub")), `
      <div class="ph-tools reveal" data-delay="220">
        <div class="chips" role="tablist">${CATS.map(c => `<button type="button" class="chip${c === cat ? " active" : ""}" data-cat="${c}" role="tab" aria-selected="${c === cat}">${t("cat." + c)}</button>`).join("")}</div>
        <input type="search" id="svcSearch" value="${esc(q)}" data-i18n-ph="svc.search" placeholder="${esc(t("svc.search"))}" />
      </div>`) + `
    <section class="section">
      <div class="svc-list">${shown.map((s, i) => `
        <a class="svc-row tilt reveal" data-delay="${(i % 3) * 70}" style="--c:${s.color}" href="service.html?id=${s.id}">
          <span class="sr-ic">${I[s.icon]}</span>
          <span class="sr-main">
            <span class="sr-num">${pad(SV.indexOf(s) + 1)} · ${t("cat." + s.category)}</span>
            <b>${esc(AM.title(s))}</b>
            <span class="alt ${AM.isAR() ? "" : "ar"}">${esc(AM.altTitle(s))}</span>
            <span class="sr-blurb">${esc(AM.blurb(s))}</span>
          </span>
          <span class="sr-tx">${s.subs.map(u => `<span>${esc(AM.subName(u))}</span>`).join("")}</span>
          <span class="sr-go">${I.arrow}</span>
        </a>`).join("") || `<p class="muted">${t("svc.none")}</p>`}</div>
    </section>`;
    const inp = $("#svcSearch");
    inp.addEventListener("input", () => { q = inp.value.trim().toLowerCase(); const pos = inp.selectionStart; servicesPage(); const n = $("#svcSearch"); n.focus(); n.setSelectionRange(pos, pos); });
  }
  if (AM.page === "services") main.addEventListener("click", e => {
    const c = e.target.closest("[data-cat]"); if (c) { cat = c.dataset.cat; servicesPage(); }
  });

  /* =================== SERVICE DETAIL =================== */
  function servicePage() {
    const s = AM.svcById(AM.qs("id"));
    if (!s) { main.innerHTML = hero("404", esc(t("sp.notFound")), "", `<a class="btn" href="services.html">${t("common.allServices")}</a>`); return; }
    const idx = SV.indexOf(s), prev = SV[(idx - 1 + SV.length) % SV.length], next = SV[(idx + 1) % SV.length];
    document.body.style.setProperty("--c", s.color);
    document.title = `${AM.title(s)} — ${AM.isAR() ? AM.S.brandAr : AM.S.brand}`;
    main.innerHTML = `
    <section class="page-hero sp-hero" style="--c:${s.color}">
      <div class="ph-inner">
        <nav class="crumbs reveal" aria-label="Breadcrumb"><a href="index.html">${t("nav.home")}</a><span>/</span><a href="services.html">${t("nav.services")}</a><span>/</span><b>${esc(AM.title(s))}</b></nav>
        <div class="sp-head">
          <div class="sp-tile reveal" data-delay="60"><span>${I[s.icon]}</span></div>
          <div>
            <p class="eyebrow reveal" data-delay="100">${t("svc.title")} ${pad(idx + 1)} / ${SV.length} · ${t("cat." + s.category)}</p>
            <h1 class="ph-title reveal" data-delay="140">${esc(AM.title(s))}</h1>
            <p class="alt big-alt ${AM.isAR() ? "" : "ar"} reveal" data-delay="180">${esc(AM.altTitle(s))}</p>
          </div>
        </div>
        <p class="ph-sub reveal" data-delay="220">${esc(AM.pick(s.overview, s.overviewAr))}</p>
        <div class="sp-meta reveal" data-delay="260">
          <span class="pill">${I.building}<span><small>${t("common.handledAt")}</small>${esc(AM.pick(s.authority, s.authorityAr))}</span></span>
          <span class="pill">${I.register}<span><small>${t("sp.transactions")}</small>${t("common.tx", { n: s.subs.length })}</span></span>
        </div>
        <div class="hero-cta reveal" data-delay="300">
          <a class="btn" href="${startHref(s.id)}">${t("common.startFile")}</a>
          <a class="btn btn-ghost" href="#" data-wa>WhatsApp</a>
        </div>
      </div>
    </section>

    <section class="section sp-body" style="--c:${s.color}">
      <aside class="sp-side">
        <p class="eyebrow">${t("sp.jump")}</p>
        <ol>${s.subs.map((u, i) => `<li><a href="#tx-${i}"><span>${pad(i + 1)}</span>${esc(AM.subName(u))}</a></li>`).join("")}</ol>
        <a class="btn btn-small" href="${startHref(s.id)}">${t("common.startFile")}</a>
      </aside>
      <div class="sp-main">
        <div class="section-head reveal"><p class="eyebrow">${t("sp.transactions")}</p><h2>${t("sp.transactions")}</h2><p class="muted">${t("sp.txSub")}</p></div>
        ${s.subs.map((u, i) => `
        <article class="tx-card reveal" id="tx-${i}">
          <header>
            <span class="tx-num">${pad(i + 1)}</span>
            <div><h3>${esc(AM.subName(u))}</h3><p class="alt ${AM.isAR() ? "" : "ar"}">${esc(AM.isAR() ? u.name : u.ar)}</p></div>
            <span class="tx-count">${t("common.docs", { n: u.docs.length })}</span>
          </header>
          <ol class="tx-docs">${u.docs.map((d, k) => `<li><span class="tick">${I.check}</span><span>${esc(AM.doc(d))}</span></li>`).join("")}</ol>
          <footer>
            <a class="btn btn-small" href="${startHref(s.id, i)}">${t("common.startFile")}</a>
            <button type="button" class="btn btn-ghost btn-small" data-print="${i}">${I.print}<span>${t("common.print")}</span></button>
          </footer>
        </article>`).join("")}
        <p class="disclaimer reveal">${t("disclaimer")}</p>
      </div>
    </section>

    <section class="section">
      <div class="section-head reveal"><p class="eyebrow">${t("sp.how")}</p><h2>${t("sp.how")}</h2></div>
      <ol class="how">${[1, 2, 3, 4].map((n, i) => `
        <li class="reveal" data-delay="${i * 90}" style="--c:${s.color}"><span class="how-n">${pad(n)}</span><h3>${t(`sp.h${n}t`)}</h3><p>${t(`sp.h${n}p`)}</p></li>`).join("")}</ol>
    </section>

    <section class="section" id="spNews" hidden>
      <div class="section-head reveal"><p class="eyebrow">${t("nav.news")}</p><h2>${t("sp.news")}</h2></div>
      <div class="news-grid" id="spNewsGrid"></div>
    </section>

    <section class="section">
      <div class="help-band reveal tilt" style="--c:${s.color}">
        <div><h3>${t("sp.help")}</h3><p class="muted">${t("sp.helpSub")}</p></div>
        <a class="btn" href="#" data-wa>WhatsApp</a>
      </div>
      <nav class="pn reveal" aria-label="${t("sp.other")}">
        <a href="service.html?id=${prev.id}" style="--c:${prev.color}"><small>${t("sp.prev")}</small><b>${esc(AM.title(prev))}</b></a>
        <a href="services.html" class="pn-all">${t("common.allServices")}</a>
        <a href="service.html?id=${next.id}" style="--c:${next.color}"><small>${t("sp.next")}</small><b>${esc(AM.title(next))}</b></a>
      </nav>
    </section>`;

    AM.news().then(list => {
      const rel = list.filter(n => n.service === s.id).slice(0, 3);
      if (!rel.length) return;
      $("#spNews").hidden = false;
      $("#spNewsGrid").innerHTML = rel.map(AM.newsCard).join("");
      AM.reveal($("#spNews"));
    });
    // active link in the side list while scrolling
    const links = $$(".sp-side a[href^='#tx-']");
    const spy = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    $$(".tx-card").forEach(c => spy.observe(c));
    if (location.hash) setTimeout(() => { const el = $(location.hash); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); el && el.classList.add("flash"); }, 500);
  }
  if (AM.page === "service") main.addEventListener("click", e => {
    const p = e.target.closest("[data-print]"); if (!p) return;
    const card = $("#tx-" + p.dataset.print);
    card.classList.add("printing"); document.body.classList.add("print-one");
    window.print();
    setTimeout(() => { card.classList.remove("printing"); document.body.classList.remove("print-one"); }, 500);
  });

  /* =================== NEWS LIST =================== */
  let ncat = "all";
  function newsPage() {
    main.innerHTML = hero(t("news.eyebrow"), esc(t("news.title")), esc(t("news.sub")), `
      <div class="ph-tools reveal" data-delay="220"><div class="chips" id="ncats"></div></div>`) +
      `<section class="section"><div id="newsWrap"><div class="spinner"></div></div></section>`;
    AM.news().then(list => {
      const cats = ["all", ...["news", "guide", "announcement"].filter(c => list.some(n => n.category === c))];
      $("#ncats").innerHTML = cats.map(c => `<button type="button" class="chip${c === ncat ? " active" : ""}" data-ncat="${c}">${t("ncat." + c)}</button>`).join("");
      const shown = list.filter(n => ncat === "all" || n.category === ncat);
      if (!shown.length) { $("#newsWrap").innerHTML = `<p class="muted">${t("news.empty")}</p>`; return; }
      const [f, ...rest] = shown;
      $("#newsWrap").innerHTML = `
        <a class="news-feature reveal tilt" href="article.html?id=${encodeURIComponent(f.id)}" style="--c:${(AM.svcById(f.service) || {}).color || "#2ee6a8"}">
          <span class="nf-art" aria-hidden="true"><span>${I[(AM.svcById(f.service) || {}).icon] || I.news}</span></span>
          <span class="nf-body">
            <span class="nc-top"><span class="nc-cat c-${esc(f.category)}">${t("ncat." + f.category)}</span><time>${AM.fmtDate(f.date)}</time><span>${t("common.minRead", { n: AM.readMins(f) })}</span></span>
            <b>${esc(AM.pick(f.title, f.titleAr))}</b>
            <span class="nc-sum">${esc(AM.pick(f.summary, f.summaryAr))}</span>
            <span class="nc-more">${t("common.readMore")} ${I.arrow}</span>
          </span>
        </a>
        <div class="news-grid">${rest.map(AM.newsCard).join("")}</div>`;
      AM.reveal(main);
    });
  }
  if (AM.page === "news") main.addEventListener("click", e => {
    const c = e.target.closest("[data-ncat]"); if (c) { ncat = c.dataset.ncat; newsPage(); }
  });

  /* =================== ARTICLE =================== */
  function articlePage() {
    main.innerHTML = `<section class="section"><div class="spinner"></div></section>`;
    AM.news().then(list => {
      const n = list.find(x => x.id === AM.qs("id"));
      if (!n) { main.innerHTML = hero("404", esc(t("news.notFound")), "", `<a class="btn" href="news.html">${t("art.back")}</a>`); AM.reveal(main); return; }
      const s = AM.svcById(n.service);
      const body = (AM.isAR() ? (n.bodyAr && n.bodyAr.length ? n.bodyAr : n.body) : (n.body && n.body.length ? n.body : n.bodyAr)) || [];
      document.title = `${AM.pick(n.title, n.titleAr)} — ${AM.isAR() ? AM.S.brandAr : AM.S.brand}`;
      const more = list.filter(x => x.id !== n.id).slice(0, 3);
      main.innerHTML = `
      <article class="article" style="--c:${s ? s.color : "#2ee6a8"}">
        <header class="page-hero art-hero">
          <div class="ph-inner narrow">
            <nav class="crumbs reveal"><a href="news.html">${t("nav.news")}</a><span>/</span><b>${t("ncat." + n.category)}</b></nav>
            <span class="nc-top reveal" data-delay="60"><span class="nc-cat c-${esc(n.category)}">${t("ncat." + n.category)}</span><time datetime="${esc(n.date)}">${AM.fmtDate(n.date)}</time><span>${t("common.minRead", { n: AM.readMins(n) })}</span></span>
            <h1 class="art-title reveal" data-delay="120">${esc(AM.pick(n.title, n.titleAr))}</h1>
            <p class="ph-sub reveal" data-delay="180">${esc(AM.pick(n.summary, n.summaryAr))}</p>
          </div>
        </header>
        <div class="art-layout">
          <div class="art-body reveal">${body.map(p => `<p dir="auto">${esc(p)}</p>`).join("")}
            ${n.source && n.source.url ? `<p class="art-source">${t("common.source")}: <a href="${esc(n.source.url)}" target="_blank" rel="noopener">${esc(n.source.name || n.source.url)}</a></p>` : ""}
          </div>
          <aside class="art-side">
            ${s ? `<a class="art-svc tilt" href="service.html?id=${s.id}" style="--c:${s.color}"><small>${t("art.service")}</small><span class="sr-ic">${I[s.icon]}</span><b>${esc(AM.title(s))}</b><span class="nc-more">${t("common.details")} ${I.arrow}</span></a>` : ""}
            <div class="share">
              <p class="eyebrow">${t("common.share")}</p>
              <a class="btn btn-ghost btn-small" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(AM.pick(n.title, n.titleAr) + " " + location.href)}">${I.chat}<span>WhatsApp</span></a>
              <button type="button" class="btn btn-ghost btn-small" id="copyLink">${I.link}<span>${t("common.copy")}</span></button>
            </div>
          </aside>
        </div>
        ${more.length ? `<section class="section"><div class="section-head reveal"><h2>${t("art.more")}</h2></div><div class="news-grid">${more.map(AM.newsCard).join("")}</div></section>` : ""}
      </article>`;
      $("#copyLink") && $("#copyLink").addEventListener("click", () => {
        (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(() => AM.toast(t("common.copied"))).catch(() => AM.toast(location.href));
      });
      AM.reveal(main);
    });
  }

  /* =================== ABOUT =================== */
  function aboutPage() {
    main.innerHTML = hero(t("ab.eyebrow"), esc(t("ab.title")), esc(t("ab.sub"))) + `
    <section class="section ab-split">
      <div class="ab-orb reveal" aria-hidden="true"><span class="logo-mark"></span><i></i><i></i><i></i></div>
      <div class="reveal" data-delay="100"><p class="eyebrow">${t("ab.mission.t")}</p><h2>${t("ab.mission.t")}</h2><p class="lead">${t("ab.mission.p")}</p></div>
    </section>
    <section class="section">
      <div class="section-head reveal"><p class="eyebrow">${t("ab.values.t")}</p><h2>${t("ab.values.t")}</h2></div>
      <div class="values">${[1, 2, 3].map((n, i) => `
        <div class="value reveal tilt" data-delay="${i * 90}"><span class="v-n">${pad(n)}</span><h3>${t(`v${n}.t`)}</h3><p>${t(`v${n}.p`)}</p></div>`).join("")}</div>
    </section>
    <section class="section">
      <div class="section-head reveal"><p class="eyebrow">${t("ab.where.t")}</p><h2>${t("ab.where.t")}</h2><p class="muted">${t("ab.where.sub")}</p></div>
      <div class="where">${SV.map((s, i) => `
        <a class="where-item reveal" data-delay="${(i % 4) * 60}" href="service.html?id=${s.id}" style="--c:${s.color}">
          <span class="sr-ic">${I[s.icon]}</span><span><b>${esc(AM.pick(s.authority, s.authorityAr))}</b><small>${esc(AM.title(s))}</small></span>
        </a>`).join("")}</div>
    </section>
    <section class="section">
      <div class="help-band big reveal tilt">
        <div><h3>${t("ab.cta.t")}</h3><p class="muted">${t("ab.cta.p")}</p></div>
        <div class="hero-cta"><a class="btn" href="index.html#apply">${t("nav.cta")}</a><a class="btn btn-ghost" href="#" data-wa>WhatsApp</a></div>
      </div>
    </section>`;
  }

  const render = { services: servicesPage, service: servicePage, news: newsPage, article: articlePage, about: aboutPage }[AM.page];
  if (render) AM.onLang.push(() => {
    render();
    // re-apply WhatsApp links etc. inside freshly rendered markup
    $$("[data-wa]", main).forEach(a => { a.href = `https://wa.me/${AM.S.whatsapp}?text=${encodeURIComponent(t("wa.msg", { brand: AM.S.brand }))}`; a.target = "_blank"; a.rel = "noopener"; });
    AM.reveal(main);
  });
})();
