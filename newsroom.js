/* =====================================================================
   NEWSROOM — write, edit, publish and hide news from the website.
   Shown only to office (admin) accounts. Saves to the "News" tab of the
   Google Sheet through the Apps Script (actions newsAll / newsSave / newsDelete).
   ===================================================================== */
(() => {
  const AM = window.AM, A = window.Account;
  if (!AM || !A || !A.enabled || !window.I18N) return;

  Object.assign(I18N.en, {
    "nr.fab": "Newsroom", "nr.eyebrow": "Office only", "nr.title": "Newsroom", "nr.close": "Close",
    "nr.tab.list": "Posts", "nr.tab.edit": "Write", "nr.new": "New post", "nr.editThis": "Edit post",
    "nr.search": "Search posts…", "nr.f.all": "All", "nr.f.live": "Live", "nr.f.draft": "Drafts", "nr.f.builtin": "Built-in",
    "nr.s.live": "Live on the site", "nr.s.draft": "Drafts & hidden", "nr.s.builtin": "Built-in posts",
    "nr.st.live": "Live", "nr.st.draft": "Draft", "nr.st.builtin": "Built-in", "nr.st.hidden": "Hidden",
    "nr.edit": "Edit", "nr.view": "View", "nr.del": "Delete", "nr.sure": "Sure? Click again", "nr.reset": "Restore original",
    "nr.hide": "Hide", "nr.show": "Show", "nr.empty": "No posts match.", "nr.loading": "Loading posts…",
    "nr.lang.en": "English", "nr.lang.ar": "العربية",
    "nr.ph.title": "Write a headline…", "nr.summary": "Summary", "nr.ph.summary": "One or two sentences shown on the news card",
    "nr.body": "Article", "nr.ph.body": "Write the article here.\n\nLeave an empty line between paragraphs.",
    "nr.words": "{n} words · {m} min read",
    "nr.missing.ar": "No Arabic version yet. Arabic readers will see the English text.",
    "nr.missing.en": "No English version yet. English readers will see the Arabic text.",
    "nr.type": "Type", "nr.svc": "Related service", "nr.none": "None", "nr.date": "Date",
    "nr.cover": "Cover picture", "nr.drop": "Drop a picture here, click to choose, or paste one (Ctrl/⌘+V)",
    "nr.url": "…or paste a picture link (https://)", "nr.rmimg": "Remove picture",
    "nr.imgbad": "That file isn't a picture the browser can read. Try a JPG or PNG.",
    "nr.source": "Source (optional)", "nr.srcname": "Source name", "nr.srcurl": "Link",
    "nr.preview": "Live preview", "nr.pv.card": "Card", "nr.pv.article": "Article",
    "nr.draft": "Save draft", "nr.publish": "Publish", "nr.update": "Update",
    "nr.saving": "Saving…", "nr.saved.draft": "Saved as a draft.", "nr.saved.live": "Published. It's live on the site.",
    "nr.deleted": "Deleted.", "nr.restored": "Original restored.", "nr.hidden": "Hidden from the site.", "nr.shown": "Back on the site.",
    "nr.err.title": "Add a headline first (English or Arabic).",
    "nr.err.forbidden": "Only the office account can post news.",
    "nr.err.image": "Google Drive couldn't share the picture. Try again, or paste a picture link instead.",
    "nr.err.update": "Your Google script is older than the website. Paste the new Code.gs and deploy a new version.",
    "nr.err.generic": "Something went wrong. Please try again.",
    "nr.restoredDraft": "Your unsaved draft was brought back.", "nr.fresh": "Start fresh",
    "nr.untitled": "Untitled", "nr.shortcut": "Ctrl/⌘ + S saves",
    "nr.builtinNote": "This is a built-in post. Saving makes your own copy, which replaces it on the site.",
    "nr.today": "Today"
  });
  Object.assign(I18N.ar, {
    "nr.fab": "غرفة الأخبار", "nr.eyebrow": "للمكتب فقط", "nr.title": "غرفة الأخبار", "nr.close": "إغلاق",
    "nr.tab.list": "المنشورات", "nr.tab.edit": "كتابة", "nr.new": "منشور جديد", "nr.editThis": "تعديل المنشور",
    "nr.search": "ابحث في المنشورات…", "nr.f.all": "الكل", "nr.f.live": "منشورة", "nr.f.draft": "مسودّات", "nr.f.builtin": "مدمجة",
    "nr.s.live": "منشورة على الموقع", "nr.s.draft": "مسودّات ومخفيّة", "nr.s.builtin": "منشورات مدمجة",
    "nr.st.live": "منشور", "nr.st.draft": "مسودّة", "nr.st.builtin": "مدمج", "nr.st.hidden": "مخفي",
    "nr.edit": "تعديل", "nr.view": "عرض", "nr.del": "حذف", "nr.sure": "متأكد؟ اضغط مجدداً", "nr.reset": "استعادة الأصل",
    "nr.hide": "إخفاء", "nr.show": "إظهار", "nr.empty": "لا منشورات مطابقة.", "nr.loading": "جارٍ تحميل المنشورات…",
    "nr.lang.en": "English", "nr.lang.ar": "العربية",
    "nr.ph.title": "اكتب العنوان…", "nr.summary": "الملخّص", "nr.ph.summary": "جملة أو جملتان تظهران على بطاقة الخبر",
    "nr.body": "المقال", "nr.ph.body": "اكتب المقال هنا.\n\nاترك سطراً فارغاً بين الفقرات.",
    "nr.words": "{n} كلمة · قراءة {m} دقائق",
    "nr.missing.ar": "لا نسخة عربية بعد. سيرى قرّاء العربية النص الإنجليزي.",
    "nr.missing.en": "لا نسخة إنجليزية بعد. سيرى قرّاء الإنجليزية النص العربي.",
    "nr.type": "النوع", "nr.svc": "الخدمة المرتبطة", "nr.none": "لا شيء", "nr.date": "التاريخ",
    "nr.cover": "صورة الغلاف", "nr.drop": "اسحب صورة إلى هنا، أو اضغط للاختيار، أو الصقها (Ctrl/⌘+V)",
    "nr.url": "…أو الصق رابط صورة (https://)", "nr.rmimg": "إزالة الصورة",
    "nr.imgbad": "لا يمكن قراءة هذا الملف كصورة. جرّب JPG أو PNG.",
    "nr.source": "المصدر (اختياري)", "nr.srcname": "اسم المصدر", "nr.srcurl": "الرابط",
    "nr.preview": "معاينة مباشرة", "nr.pv.card": "البطاقة", "nr.pv.article": "المقال",
    "nr.draft": "حفظ كمسودّة", "nr.publish": "نشر", "nr.update": "تحديث",
    "nr.saving": "جارٍ الحفظ…", "nr.saved.draft": "حُفظ كمسودّة.", "nr.saved.live": "نُشر. صار ظاهراً على الموقع.",
    "nr.deleted": "حُذف.", "nr.restored": "استُعيد الأصل.", "nr.hidden": "أُخفي عن الموقع.", "nr.shown": "عاد إلى الموقع.",
    "nr.err.title": "أضف عنواناً أولاً (بالإنجليزية أو العربية).",
    "nr.err.forbidden": "فقط حساب المكتب يمكنه نشر الأخبار.",
    "nr.err.image": "لم يتمكّن Google Drive من مشاركة الصورة. حاول مجدداً أو الصق رابط صورة.",
    "nr.err.update": "سكربت Google أقدم من الموقع. الصق Code.gs الجديد وانشر نسخة جديدة.",
    "nr.err.generic": "حدث خطأ. حاول مجدداً.",
    "nr.restoredDraft": "استُعيدت مسودّتك غير المحفوظة.", "nr.fresh": "ابدأ من جديد",
    "nr.untitled": "بلا عنوان", "nr.shortcut": "Ctrl/⌘ + S للحفظ",
    "nr.builtinNote": "هذا منشور مدمج. الحفظ ينشئ نسختك الخاصة التي تحلّ مكانه على الموقع.",
    "nr.today": "اليوم"
  });

  const t = AM.t, esc = AM.esc, I = AM.ICONS, SV = AM.SV;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const CATS = ["news", "guide", "announcement"];
  const BUILTIN = new Map((window.NEWS || []).map(n => [n.id, n]));
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem("am_nr_" + k)); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem("am_nr_" + k) : localStorage.setItem("am_nr_" + k, JSON.stringify(v)); } catch {} }
  };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${AM.pad(d.getMonth() + 1)}-${AM.pad(d.getDate())}`; };
  const words = s => String(s || "").split(/\s+/).filter(Boolean).length;
  const https = u => /^https:\/\//.test(String(u || "").trim());

  let admin = false, wantOpen = location.hash === "#newsroom";
  let posts = [], loaded = false, loading = null;
  let view = "list", filter = "all", query = "";
  let ed = null, edLang = AM.isAR() ? "ar" : "en", pvMode = "card", busy = false;

  /* ---------------- data ---------------- */
  const toPost = n => ({
    id: n.id, date: n.date || today(), category: CATS.includes(n.category) ? n.category : "news", service: n.service || "",
    title: n.title || "", titleAr: n.titleAr || "", summary: n.summary || "", summaryAr: n.summaryAr || "",
    body: (n.body || []).join("\n\n"), bodyAr: (n.bodyAr || []).join("\n\n"),
    image: n.image || "", sourceName: (n.source && n.source.name) || "", sourceUrl: (n.source && n.source.url) || "",
    published: n.published !== false
  });
  function load(force) {
    if (loaded && !force) return Promise.resolve(posts);
    if (loading && !force) return loading;
    loading = A.api("newsAll").then(o => {
      const sheet = (o.items || []).map(n => ({ ...n, origin: "sheet", builtin: BUILTIN.has(n.id) }));
      const ids = new Set(sheet.map(n => n.id));
      const local = [...BUILTIN.values()].filter(n => !ids.has(n.id)).map(n => ({ ...n, origin: "builtin", builtin: true, published: true }));
      posts = [...sheet, ...local].sort((a, b) => String(b.date).localeCompare(String(a.date)));
      loaded = true; loading = null; return posts;
    }).catch(e => { loading = null; throw e; });
    return loading;
  }
  const stateOf = p => p.origin === "builtin" ? "builtin" : p.published ? "live" : p.builtin ? "hidden" : "draft";
  const errMsg = e => {
    const c = e && e.code;
    if (c === "forbidden") return t("nr.err.forbidden");
    if (c === "image_share") return t("nr.err.image");
    if (c === "unknown_action") return t("nr.err.update");
    if (c === "missing_fields") return t("nr.err.title");
    if (c === "network") return t("auth.err.network");
    return t("nr.err.generic");
  };
  async function save(post, okKey) {
    const payload = { ...post }; delete payload.imagePreview; delete payload.isNew; delete payload.builtinNote;
    const out = await A.api("newsSave", { post: payload });
    AM.newsRefresh(); await load(true);
    if (okKey) AM.toast(t(okKey));
    return out.item;
  }

  /* ---------------- shell ---------------- */
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "nr-fab"; fab.hidden = true;
  document.body.appendChild(fab);
  const root = document.createElement("div");
  root.className = "nr"; root.id = "newsroom"; root.setAttribute("aria-hidden", "true"); root.setAttribute("role", "dialog");
  document.body.appendChild(root);

  function shell() {
    fab.innerHTML = `${I.news}<span>${t("nr.fab")}</span>`;
    root.innerHTML = `
    <div class="nr-inner">
      <header class="nr-head">
        <div class="nr-brand"><span class="nr-orb" aria-hidden="true">${I.news}</span><div><p class="eyebrow">${t("nr.eyebrow")}</p><h2>${t("nr.title")}</h2></div></div>
        <div class="nr-tabs" role="tablist">
          <button type="button" role="tab" data-tab="list">${t("nr.tab.list")}</button>
          <button type="button" role="tab" data-tab="edit">${t("nr.tab.edit")}</button>
          <i class="nr-tab-ink" aria-hidden="true"></i>
        </div>
        <button type="button" class="dash-x" data-close aria-label="${t("nr.close")}">×</button>
      </header>
      <section class="nr-view nr-list" data-view="list"></section>
      <section class="nr-view nr-edit" data-view="edit"></section>
    </div>`;
  }

  function open(v) {
    if (!admin) return;
    root.classList.add("open"); root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("nr-lock");
    show(v || view);
  }
  function close() {
    root.classList.remove("open"); root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("nr-lock");
    if (location.hash === "#newsroom") history.replaceState(null, "", location.pathname + location.search);
  }
  function show(v) {
    view = v;
    $$(".nr-tabs [data-tab]", root).forEach(b => b.classList.toggle("active", b.dataset.tab === v));
    $$(".nr-view", root).forEach(s => s.classList.toggle("active", s.dataset.view === v));
    const act = $(`.nr-tabs [data-tab="${v}"]`, root), ink = $(".nr-tab-ink", root);
    if (act && ink) requestAnimationFrame(() => { ink.style.width = act.offsetWidth + "px"; ink.style.transform = `translateX(${act.offsetLeft}px)`; });
    if (v === "list") renderList(); else { if (!ed) newPost(); renderEditor(); }
  }

  /* ---------------- posts list ---------------- */
  function renderList() {
    const box = $(".nr-list", root);
    if (!loaded) {
      box.innerHTML = `<div class="nr-loading"><div class="spinner"></div><p class="muted">${t("nr.loading")}</p></div>`;
      load().then(renderList).catch(e => { box.innerHTML = `<p class="nr-err">${esc(errMsg(e))}</p>`; });
      return;
    }
    const n = s => posts.filter(p => stateOf(p) === s).length;
    const q = query.trim().toLowerCase();
    const list = posts.filter(p => {
      const st = stateOf(p);
      if (filter === "live" && st !== "live") return false;
      if (filter === "draft" && !(st === "draft" || st === "hidden")) return false;
      if (filter === "builtin" && st !== "builtin") return false;
      return !q || [p.title, p.titleAr, p.summary, p.summaryAr, p.id].join(" ").toLowerCase().includes(q);
    });
    box.innerHTML = `
      <div class="nr-stats">
        <div class="nr-stat s-live"><b>${n("live")}</b><span>${t("nr.s.live")}</span></div>
        <div class="nr-stat s-draft"><b>${n("draft") + n("hidden")}</b><span>${t("nr.s.draft")}</span></div>
        <div class="nr-stat s-builtin"><b>${n("builtin")}</b><span>${t("nr.s.builtin")}</span></div>
        <button type="button" class="nr-stat nr-stat-new" data-nrnew><span class="nr-plus">+</span><span>${t("nr.new")}</span></button>
      </div>
      <div class="nr-tools">
        <input type="search" class="nr-q" value="${esc(query)}" placeholder="${t("nr.search")}" />
        <div class="chips">${["all", "live", "draft", "builtin"].map(f => `<button type="button" class="chip${f === filter ? " active" : ""}" data-filter="${f}">${t("nr.f." + f)}</button>`).join("")}</div>
      </div>
      <div class="nr-rows">${list.length ? list.map(row).join("") : `<p class="muted nr-none">${t("nr.empty")}</p>`}</div>`;
  }
  function row(p, i) {
    const st = stateOf(p), s = AM.svcById(p.service);
    const ttl = AM.pick(p.title, p.titleAr) || t("nr.untitled");
    const thumb = p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : (s ? I[s.icon] : I.news);
    const toggle = st === "builtin" ? `<button type="button" class="nr-act" data-hide="${esc(p.id)}">${t("nr.hide")}</button>`
      : `<label class="nr-switch" title="${t(p.published ? "nr.hide" : "nr.show")}"><input type="checkbox" data-toggle="${esc(p.id)}"${p.published ? " checked" : ""} /><span></span></label>`;
    const del = st === "builtin" ? "" : `<button type="button" class="nr-act nr-danger" data-del="${esc(p.id)}">${t(p.builtin ? "nr.reset" : "nr.del")}</button>`;
    return `
      <div class="nr-row st-${st}" style="--c:${s ? s.color : "var(--em)"};--i:${i}">
        <span class="nr-thumb">${thumb}</span>
        <div class="nr-row-main">
          <b dir="auto">${esc(ttl)}</b>
          <span class="nc-top"><span class="nr-pill p-${st}">${t("nr.st." + st)}</span><span class="nc-cat c-${esc(p.category)}">${t("ncat." + p.category)}</span><time>${AM.fmtDate(p.date)}</time>${s ? `<span>${esc(AM.title(s))}</span>` : ""}</span>
        </div>
        <div class="nr-row-acts">
          ${toggle}
          <button type="button" class="nr-act" data-edit="${esc(p.id)}">${t("nr.edit")}</button>
          ${st === "live" || st === "builtin" ? `<a class="nr-act" href="article.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">${t("nr.view")}</a>` : ""}
          ${del}
        </div>
      </div>`;
  }

  /* ---------------- editor ---------------- */
  function newPost(force) {
    const saved = !force && store.get("draft");
    ed = saved && saved.isNew ? { ...saved, restored: true }
      : { isNew: true, id: "", date: today(), category: "news", service: "", title: "", titleAr: "", summary: "", summaryAr: "",
          body: "", bodyAr: "", image: "", sourceName: "", sourceUrl: "", published: true };
    edLang = AM.isAR() ? "ar" : "en";
  }
  function editPost(id) {
    const p = posts.find(x => x.id === id) || (BUILTIN.get(id) && { ...BUILTIN.get(id), origin: "builtin", builtin: true });
    if (!p) return;
    ed = { ...toPost(p), isNew: false, builtinNote: p.origin === "builtin" };
    if (p.origin === "builtin") ed.published = true;
    edLang = AM.isAR() ? (ed.titleAr || !ed.title ? "ar" : "en") : (ed.title || !ed.titleAr ? "en" : "ar");
    open("edit");
  }
  const F = k => edLang === "ar" ? k + "Ar" : k;    // which field the language tab edits
  const filled = L => { const s = L === "ar" ? "Ar" : ""; return !!(ed["title" + s].trim() && ed["body" + s].trim()); };
  const persist = () => { if (ed && ed.isNew) { const c = { ...ed }; delete c.imageData; delete c.imagePreview; delete c.restored; store.set("draft", c); } };

  function renderEditor() {
    const box = $(".nr-edit", root);
    const otherEmpty = !(ed[edLang === "ar" ? "title" : "titleAr"] || "").trim();
    const cover = ed.imagePreview || ed.image;
    box.innerHTML = `
      <form class="nr-form" novalidate>
        ${ed.restored ? `<p class="nr-note">${t("nr.restoredDraft")} <button type="button" class="nr-link" data-fresh>${t("nr.fresh")}</button></p>` : ""}
        ${ed.builtinNote ? `<p class="nr-note">${t("nr.builtinNote")}</p>` : ""}
        <div class="nr-lang" role="tablist">
          ${["en", "ar"].map(L => `<button type="button" data-lang="${L}" class="${L === edLang ? "active" : ""}${filled(L) ? " done" : ""}"><i></i>${t("nr.lang." + L)}</button>`).join("")}
        </div>
        <div class="nr-write" dir="${edLang === "ar" ? "rtl" : "ltr"}" lang="${edLang}">
          <textarea class="nr-title" data-f="title" rows="1" placeholder="${esc(I18N[edLang]["nr.ph.title"])}">${esc(ed[F("title")])}</textarea>
          <label class="field"><span>${esc(I18N[edLang]["nr.summary"])} <em class="nr-count" data-count="summary"></em></span>
            <textarea data-f="summary" rows="2" placeholder="${esc(I18N[edLang]["nr.ph.summary"])}">${esc(ed[F("summary")])}</textarea></label>
          <label class="field"><span>${esc(I18N[edLang]["nr.body"])}</span>
            <textarea data-f="body" class="nr-body" rows="9" placeholder="${esc(I18N[edLang]["nr.ph.body"])}">${esc(ed[F("body")])}</textarea></label>
          <p class="nr-meta"><span data-words></span><span class="nr-kbd">${t("nr.shortcut")}</span></p>
        </div>
        ${otherEmpty && ed[F("title")].trim() ? `<p class="nr-hint">${t(edLang === "ar" ? "nr.missing.en" : "nr.missing.ar")}</p>` : ""}

        <div class="nr-group"><span class="nr-lbl">${t("nr.type")}</span>
          <div class="nr-cats">${CATS.map(c => `<button type="button" data-cat="${c}" class="nc-cat c-${c}${ed.category === c ? " on" : ""}">${t("ncat." + c)}</button>`).join("")}</div></div>

        <div class="nr-group"><span class="nr-lbl">${t("nr.svc")}</span>
          <div class="nr-svcs">
            <button type="button" data-svc="" class="${!ed.service ? "on" : ""}" style="--c:var(--muted)"><span class="nr-svc-ic">∅</span>${t("nr.none")}</button>
            ${SV.map(s => `<button type="button" data-svc="${s.id}" class="${ed.service === s.id ? "on" : ""}" style="--c:${s.color}"><span class="nr-svc-ic">${I[s.icon]}</span>${esc(AM.title(s))}</button>`).join("")}
          </div></div>

        <div class="nr-group nr-date"><span class="nr-lbl">${t("nr.date")}</span>
          <div class="nr-date-row"><input type="date" data-k="date" value="${esc(ed.date)}" /><button type="button" class="nr-link" data-today>${t("nr.today")}</button></div></div>

        <div class="nr-group"><span class="nr-lbl">${t("nr.cover")}</span>
          ${cover ? `<div class="nr-cover"><img src="${esc(cover)}" alt="" referrerpolicy="no-referrer" /><button type="button" class="nr-act nr-danger" data-rmimg>${t("nr.rmimg")}</button></div>` : `
          <label class="nr-drop"><input type="file" accept="image/*" data-file /><span class="nr-drop-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg></span><span>${t("nr.drop")}</span></label>
          <input type="url" class="nr-url" data-k="image" dir="ltr" placeholder="${t("nr.url")}" value="${esc(ed.image)}" />`}
        </div>

        <details class="nr-src"${ed.sourceUrl ? " open" : ""}><summary>${t("nr.source")}</summary>
          <div class="row"><label class="field"><span>${t("nr.srcname")}</span><input data-k="sourceName" value="${esc(ed.sourceName)}" dir="auto" /></label>
          <label class="field"><span>${t("nr.srcurl")}</span><input type="url" data-k="sourceUrl" value="${esc(ed.sourceUrl)}" dir="ltr" placeholder="https://" /></label></div>
        </details>
      </form>

      <aside class="nr-side">
        <div class="nr-pv-head"><span class="nr-live-dot"></span><span>${t("nr.preview")}</span>
          <div class="nr-seg">${["card", "article"].map(m => `<button type="button" data-pv="${m}" class="${pvMode === m ? "on" : ""}">${t("nr.pv." + m)}</button>`).join("")}</div></div>
        <div class="nr-pv"></div>
        <div class="nr-actions">
          <button type="button" class="btn btn-ghost" data-save="draft">${t("nr.draft")}</button>
          <button type="button" class="btn" data-save="publish">${t(!ed.isNew && ed.published && !ed.builtinNote ? "nr.update" : "nr.publish")}</button>
          ${!ed.isNew && !ed.builtinNote ? `<button type="button" class="nr-act nr-danger" data-del="${esc(ed.id)}">${t(BUILTIN.has(ed.id) ? "nr.reset" : "nr.del")}</button>` : ""}
        </div>
      </aside>`;
    $$("textarea", box).forEach(grow);
    meta(); preview();
  }
  function grow(el) { el.style.height = "auto"; el.style.height = Math.max(el.scrollHeight, el.classList.contains("nr-body") ? 220 : 0) + "px"; }
  function meta() {
    const box = $(".nr-edit", root); if (!box || !ed) return;
    const w = words(ed[F("body")]);
    const wEl = $("[data-words]", box); if (wEl) wEl.textContent = I18N[edLang]["nr.words"].replace("{n}", w).replace("{m}", Math.max(1, Math.round(w / 200)));
    const c = $("[data-count=summary]", box); if (c) { const n = ed[F("summary")].length; c.textContent = n + " / 200"; c.classList.toggle("over", n > 200); }
    $$(".nr-lang [data-lang]", box).forEach(b => b.classList.toggle("done", filled(b.dataset.lang)));
  }

  /* live preview, drawn in the editor's language */
  function preview() {
    const pv = $(".nr-pv", root); if (!pv || !ed) return;
    const L = edLang, AR = L === "ar", T = I18N[L];
    const P = (en, ar) => AR ? (ar || en) : (en || ar);
    const s = AM.svcById(ed.service);
    const cover = ed.imagePreview || (https(ed.image) ? ed.image : "");
    const date = ed.date ? new Intl.DateTimeFormat(AR ? "ar-LB" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(ed.date + "T12:00")) : "";
    const title = P(ed.title, ed.titleAr) || T["nr.untitled"];
    const summary = P(ed.summary, ed.summaryAr);
    const body = String(P(ed.body, ed.bodyAr) || "").split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
    const cat = `<span class="nc-cat c-${ed.category}">${T["ncat." + ed.category]}</span>`;
    pv.setAttribute("dir", AR ? "rtl" : "ltr"); pv.setAttribute("lang", L);
    pv.innerHTML = pvMode === "card" ? `
      <div class="news-card nr-pv-card${cover ? " has-img" : ""}" style="--c:${s ? s.color : "var(--em)"}">
        ${cover ? `<span class="nc-img"><img src="${esc(cover)}" alt="" referrerpolicy="no-referrer" /></span>` : ""}
        <span class="nc-top">${cat}<time>${date}</time></span>
        <b>${esc(title)}</b>
        <span class="nc-sum">${esc(summary)}</span>
        <span class="nc-more">${T["common.readMore"]} ${I.arrow}</span>
      </div>` : `
      <div class="nr-pv-art" style="--c:${s ? s.color : "var(--em)"}">
        ${cover ? `<img class="nr-pv-cover" src="${esc(cover)}" alt="" referrerpolicy="no-referrer" />` : ""}
        <span class="nc-top">${cat}<time>${date}</time></span>
        <h3>${esc(title)}</h3>
        ${summary ? `<p class="nr-pv-sum">${esc(summary)}</p>` : ""}
        ${body.map(p => `<p>${esc(p)}</p>`).join("") || `<p class="muted">…</p>`}
        ${ed.sourceUrl ? `<p class="art-source">${T["common.source"]}: <a>${esc(ed.sourceName || ed.sourceUrl)}</a></p>` : ""}
        ${s ? `<p class="nr-pv-svc">${I[s.icon]}<span>${esc(AR ? s.ar : s.title)}</span></p>` : ""}
      </div>`;
  }

  /* pictures: shrink in the browser (max 1600px JPEG) before sending to Drive */
  function readImage(file) {
    return new Promise((res, rej) => {
      if (!file || !/^image\//.test(file.type)) return rej(new Error("type"));
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
        const g = c.getContext("2d"); g.fillStyle = "#ffffff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", .84));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("type")); };
      img.src = url;
    });
  }
  async function setCover(file) {
    try {
      const data = await readImage(file);
      Object.assign(ed, { imagePreview: data, imageData: data.split(",")[1], imageType: "image/jpeg", image: "" });
      renderEditor();
    } catch { AM.toast(t("nr.imgbad"), true); }
  }

  async function submit(publish) {
    if (busy || !ed) return;
    if (!ed.title.trim() && !ed.titleAr.trim()) { AM.toast(t("nr.err.title"), true); const ti = $(".nr-title", root); ti && ti.focus(); return; }
    busy = true;
    const btn = $(`[data-save="${publish ? "publish" : "draft"}"]`, root), lbl = btn && btn.textContent;
    $$("[data-save]", root).forEach(b => b.disabled = true);
    if (btn) { btn.classList.add("busy"); btn.textContent = t("nr.saving"); }
    try {
      const post = { ...ed, published: publish };
      if (!https(post.image)) post.image = "";
      const item = await save(post, publish ? "nr.saved.live" : "nr.saved.draft");
      if (ed.isNew) store.set("draft", null);
      ed = null; burst();
      show("list");
      flash(item && item.id);
    } catch (e) {
      AM.toast(errMsg(e), true);
      if (btn) { btn.classList.remove("busy"); btn.textContent = lbl; }
      $$("[data-save]", root).forEach(b => b.disabled = false);
    } finally { busy = false; }
  }
  function flash(id) {
    if (!id) return;
    const r = $(`.nr-row [data-edit="${CSS.escape(id)}"]`, root);
    r && r.closest(".nr-row").classList.add("flash");
  }
  function burst() {          // a small confetti of paper on publish
    if (AM.reduced) return;
    const b = document.createElement("div"); b.className = "nr-burst"; b.setAttribute("aria-hidden", "true");
    const cols = ["var(--em)", "var(--gold)", "var(--violet)", "#ff8fa3", "#5ed0ff"];
    b.innerHTML = Array.from({ length: 26 }, (_, i) => `<i style="--x:${(Math.random() - .5) * 520}px;--y:${-120 - Math.random() * 320}px;--r:${(Math.random() - .5) * 720}deg;--d:${(i % 6) * 40}ms;background:${cols[i % cols.length]}"></i>`).join("");
    document.body.appendChild(b); setTimeout(() => b.remove(), 1600);
  }

  /* ---------------- events ---------------- */
  fab.addEventListener("click", () => open());
  root.addEventListener("click", async e => {
    const x = e.target.closest("button, a, [data-close]"); if (!x) { if (e.target === root) close(); return; }
    if (x.hasAttribute("data-close")) return close();
    if (x.dataset.tab) return show(x.dataset.tab);
    if (x.hasAttribute("data-nrnew")) { ed = null; newPost(); return show("edit"); }
    if (x.dataset.filter) { filter = x.dataset.filter; return renderList(); }
    if (x.dataset.edit) return editPost(x.dataset.edit);
    if (x.dataset.lang) { edLang = x.dataset.lang; return renderEditor(); }
    if (x.dataset.cat) { ed.category = x.dataset.cat; $$("[data-cat]", root).forEach(b => b.classList.toggle("on", b === x)); persist(); return preview(); }
    if (x.dataset.svc !== undefined) { ed.service = x.dataset.svc; $$("[data-svc]", root).forEach(b => b.classList.toggle("on", b === x)); persist(); return preview(); }
    if (x.dataset.pv) { pvMode = x.dataset.pv; $$("[data-pv]", root).forEach(b => b.classList.toggle("on", b === x)); return preview(); }
    if (x.hasAttribute("data-today")) { ed.date = today(); renderEditor(); return persist(); }
    if (x.hasAttribute("data-rmimg")) { Object.assign(ed, { image: "", imageData: null, imagePreview: null }); persist(); return renderEditor(); }
    if (x.hasAttribute("data-fresh")) { store.set("draft", null); newPost(true); return renderEditor(); }
    if (x.dataset.save) return submit(x.dataset.save === "publish");
    if (x.dataset.hide) return quick(x, () => save({ ...toPost(posts.find(p => p.id === x.dataset.hide)), published: false }, "nr.hidden"));
    if (x.dataset.del) {
      if (!x.classList.contains("armed")) { x.classList.add("armed"); x.dataset.label = x.textContent; x.textContent = t("nr.sure"); setTimeout(() => { if (x.isConnected) { x.classList.remove("armed"); x.textContent = x.dataset.label; } }, 3200); return; }
      const id = x.dataset.del, was = BUILTIN.has(id);
      return quick(x, async () => { await A.api("newsDelete", { id }); AM.newsRefresh(); await load(true); AM.toast(t(was ? "nr.restored" : "nr.deleted")); ed = null; show("list"); });
    }
  });
  async function quick(el, fn) {
    el.classList.add("busy"); el.disabled = true;
    try { await fn(); if (view === "list") renderList(); } catch (e) { AM.toast(errMsg(e), true); el.classList.remove("busy"); el.disabled = false; }
  }
  root.addEventListener("change", e => {
    const el = e.target;
    if (el.dataset.toggle) {
      const p = posts.find(x => x.id === el.dataset.toggle); if (!p) return;
      const pub = el.checked;
      el.closest(".nr-row").classList.add("busy");
      quick(el, () => save({ ...toPost(p), published: pub }, pub ? "nr.shown" : "nr.hidden"));
    }
    if (el.dataset.file !== undefined && el.files && el.files[0]) setCover(el.files[0]);
  });
  root.addEventListener("input", e => {
    const el = e.target;
    if (el.classList.contains("nr-q")) { query = el.value; const pos = el.selectionStart; renderList(); const q = $(".nr-q", root); q.focus(); q.setSelectionRange(pos, pos); return; }
    if (!ed) return;
    if (el.dataset.f) { ed[F(el.dataset.f)] = el.value; grow(el); }
    else if (el.dataset.k) ed[el.dataset.k] = el.value;
    else return;
    persist(); meta(); preview();
  });
  root.addEventListener("dragover", e => { const d = e.target.closest && e.target.closest(".nr-drop"); if (d) { e.preventDefault(); d.classList.add("over"); } });
  root.addEventListener("dragleave", e => { const d = e.target.closest && e.target.closest(".nr-drop"); if (d) d.classList.remove("over"); });
  root.addEventListener("drop", e => {
    const d = e.target.closest && e.target.closest(".nr-drop"); if (!d) return;
    e.preventDefault(); d.classList.remove("over");
    const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) setCover(f);
  });
  root.addEventListener("paste", e => {
    if (view !== "edit" || !ed) return;
    const f = [...(e.clipboardData ? e.clipboardData.files : [])].find(x => /^image\//.test(x.type));
    if (f) { e.preventDefault(); setCover(f); }
  });
  addEventListener("keydown", e => {
    if (!root.classList.contains("open")) return;
    if (e.key === "Escape") { close(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && view === "edit") { e.preventDefault(); submit(ed && !ed.isNew && !ed.builtinNote ? ed.published : false); }
  });

  /* ---------------- edit buttons on the site itself ---------------- */
  function decorate() {
    if (!admin) {
      $$(".nr-pin, .nr-newbtn").forEach(b => b.remove());
      return;
    }
    $$("[data-nid]").forEach(el => {
      if (el.querySelector(":scope > .nr-pin")) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "nr-pin"; b.dataset.pin = el.dataset.nid;
      b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span>${t("nr.editThis")}</span>`;
      el.appendChild(b);
    });
    const tools = AM.page === "news" && $(".ph-tools");
    if (tools && !$(".nr-newbtn", tools)) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn btn-small nr-newbtn"; b.innerHTML = `<span class="nr-plus">+</span><span>${t("nr.new")}</span>`;
      tools.appendChild(b);
    }
  }
  document.addEventListener("click", e => {
    const pin = e.target.closest(".nr-pin");
    if (pin) {
      e.preventDefault(); e.stopPropagation();
      const id = pin.dataset.pin;
      load().then(() => editPost(id)).catch(err => AM.toast(errMsg(err), true));
      return;
    }
    if (e.target.closest(".nr-newbtn")) { ed = null; newPost(); open("edit"); }
  }, true);
  let queued = false;
  new MutationObserver(() => {
    if (queued || !admin) return; queued = true;
    requestAnimationFrame(() => { queued = false; decorate(); });
  }).observe(document.body, { childList: true, subtree: true });

  /* ---------------- who is looking ---------------- */
  function setAdmin(on) {
    admin = !!on;
    fab.hidden = !admin;
    document.documentElement.classList.toggle("is-office", admin);
    if (!admin) { close(); loaded = false; posts = []; }
    decorate();
    if (admin && wantOpen) { wantOpen = false; open("list"); }
  }
  A.onChange.push(setAdmin);
  AM.onLang.push(() => {
    shell();
    $$(".nr-pin, .nr-newbtn").forEach(b => b.remove());
    decorate();
    if (root.classList.contains("open")) show(view);
  });
  shell();
  setAdmin(A.isAdmin());
  // someone opened …#newsroom without being signed in as the office: ask them to log in
  if (wantOpen && !admin) setTimeout(() => { if (!A.isAdmin()) A.login(); }, 400);
})();
