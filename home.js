/* =====================================================================
   HOME — service cards, service finder, live tracking demo,
   latest news, and the inquiry form (uploads → Google Drive)
   ===================================================================== */
(() => {
  const AM = window.AM, S = AM.S, SV = AM.SV, t = AM.t, esc = AM.esc, pad = AM.pad;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];

  /* ---------- counters + marquee ---------- */
  const stats = $$("[data-count]");
  stats[0].dataset.count = SV.length;
  stats[1].dataset.count = SV.reduce((n, s) => n + s.subs.length, 0);
  const mq = SV.map(s => `<a href="service.html?id=${s.id}">${esc(s.title)} <span class="ar">${esc(s.ar)}</span><i></i></a>`).join("");
  $("#marquee").innerHTML = mq + mq;
  function countUp() {
    stats.forEach(el => {
      const end = +el.dataset.count, t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 1400);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        p < 1 && requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  setTimeout(countUp, 700);

  /* ---------- service cards → full service pages ---------- */
  const grid = $("#servicesGrid");
  function renderCards() {
    grid.innerHTML = SV.map((s, i) => `
      <a class="card tilt reveal" data-delay="${(i % 4) * 70}" style="--c:${s.color}" data-id="${s.id}" href="service.html?id=${s.id}">
        <span class="card-num">${pad(i + 1)}</span>
        <span class="card-icon">${AM.ICONS[s.icon] || AM.ICONS.register}</span>
        <h3>${esc(AM.title(s))}</h3>
        <span class="alt ${AM.isAR() ? "" : "ar"}">${esc(AM.altTitle(s))}</span>
        <p>${esc(AM.blurb(s))}</p>
        <span class="card-foot"><span>${t("card.tx", { n: s.subs.length })}</span><b>${t("common.details")} ${AM.ICONS.arrow}</b></span>
      </a>`).join("") + `<p class="no-results" hidden>${t("svc.none")}</p>`;
    filterCards();
  }
  function filterCards() {
    const q = $("#search").value.trim().toLowerCase();
    let shown = 0;
    $$(".card", grid).forEach(c => {
      const s = AM.svcById(c.dataset.id);
      const hay = [s.title, s.ar, s.blurb, s.blurbAr, s.goal, s.goalAr, ...s.subs.flatMap(u => [u.name, u.ar, ...u.docs.flat()])].join(" ").toLowerCase();
      const ok = !q || hay.includes(q);
      c.classList.toggle("hidden", !ok); ok && shown++;
    });
    const nr = $(".no-results", grid); if (nr) nr.hidden = shown > 0;
  }
  $("#search").addEventListener("input", filterCards);

  /* ---------- service finder (two taps) ---------- */
  const wz = $("#wz");
  let wzSvc = null, wzSub = null;
  function renderWizard() {
    const step = wzSvc == null ? 1 : wzSub == null ? 2 : 3;
    const dots = `<div class="wz-dots" aria-hidden="true">${[1, 2, 3].map(n => `<span class="${n <= step ? "on" : ""}"></span>`).join("")}</div>`;
    if (step === 1) {
      wz.innerHTML = `${dots}<p class="wz-q">${t("wz.q1")}<small>${t("wz.step", { n: 1 })}</small></p>
        <div class="wz-grid">${SV.map((s, i) => `
          <button type="button" class="wz-opt tilt" style="--c:${s.color}; --i:${i}" data-s="${s.id}">
            <span class="wz-ic">${AM.ICONS[s.icon]}</span>
            <span class="wz-txt"><b>${esc(AM.pick(s.goal, s.goalAr))}</b><small>${esc(AM.title(s))}</small></span>
          </button>`).join("")}</div>`;
    } else if (step === 2) {
      const s = AM.svcById(wzSvc);
      wz.innerHTML = `${dots}<p class="wz-q"><button type="button" class="wz-back" data-back="1" aria-label="${t("common.back")}">${AM.ICONS.arrow}</button>${t("wz.q2")}<small>${esc(AM.title(s))}</small></p>
        <div class="wz-grid wz-subs">${s.subs.map((u, i) => `
          <button type="button" class="wz-opt tilt" style="--c:${s.color}; --i:${i}" data-u="${i}">
            <span class="wz-num">${pad(i + 1)}</span>
            <span class="wz-txt"><b>${esc(AM.subName(u))}</b><small>${t("common.docs", { n: u.docs.length })}</small></span>
          </button>`).join("")}</div>`;
    } else {
      const s = AM.svcById(wzSvc), u = s.subs[wzSub];
      wz.innerHTML = `${dots}
        <div class="wz-result" style="--c:${s.color}">
          <div class="wz-res-head">
            <span class="wz-ic big">${AM.ICONS[s.icon]}</span>
            <div><p class="eyebrow">${t("wz.result")}</p><h3>${esc(AM.subName(u))}</h3><p class="muted">${esc(AM.title(s))} · ${t("common.handledAt")}: ${esc(AM.pick(s.authority, s.authorityAr))}</p></div>
          </div>
          <ol class="wz-docs">${u.docs.map((d, i) => `<li style="--i:${i}"><span>${pad(i + 1)}</span>${esc(AM.doc(d))}</li>`).join("")}</ol>
          <div class="wz-actions">
            <button type="button" class="btn" data-start>${t("common.startFile")}</button>
            <a class="btn btn-ghost" href="service.html?id=${s.id}#tx-${wzSub}">${t("common.details")}</a>
            <button type="button" class="linkbtn" data-restart>${t("wz.restart")}</button>
          </div>
        </div>`;
    }
  }
  wz.addEventListener("click", e => {
    const o = e.target.closest(".wz-opt");
    if (e.target.closest("[data-back]")) { wzSvc = null; wzSub = null; }
    else if (e.target.closest("[data-restart]")) { wzSvc = null; wzSub = null; }
    else if (e.target.closest("[data-start]")) { preselect(wzSvc, wzSub); $("#apply").scrollIntoView({ behavior: "smooth" }); return; }
    else if (o && o.dataset.s) wzSvc = o.dataset.s;
    else if (o && o.dataset.u != null) wzSub = +o.dataset.u;
    else return;
    wz.classList.remove("swap"); void wz.offsetWidth; wz.classList.add("swap");
    renderWizard();
  });

  /* ---------- live tracking demo ---------- */
  const STEPS = ["received", "review", "progress", "ready", "completed"];
  let trkAt = 0, trkTimer = null;
  function renderTracker() {
    const box = $("#trkSteps"); if (!box) return;
    box.innerHTML = STEPS.map((s, i) => `<li class="${i < trkAt ? "done" : i === trkAt ? "now" : ""}"><span></span><em>${t("status." + s)}</em></li>`).join("");
    $("#trkBadge").textContent = t("status." + STEPS[trkAt]);
    $("#trkBadge").className = "badge s-" + STEPS[trkAt];
  }
  const trkObs = new IntersectionObserver(es => es.forEach(en => {
    clearInterval(trkTimer);
    if (en.isIntersecting && !AM.reduced) trkTimer = setInterval(() => { trkAt = (trkAt + 1) % STEPS.length; renderTracker(); }, 1700);
  }), { threshold: .3 });
  trkObs.observe($("#tracker"));
  $("#trkCta").addEventListener("click", e => { e.preventDefault(); $("#navCta").click(); });

  /* ---------- latest news ---------- */
  function renderNews() {
    AM.news().then(list => {
      $("#homeNews").innerHTML = list.slice(0, 3).map(AM.newsCard).join("") || `<p class="muted">${t("news.empty")}</p>`;
      AM.reveal($("#homeNews"));
    });
  }
  AM.onNews.push(renderNews);

  /* =====================================================================
     INQUIRY FORM
     ===================================================================== */
  const form = $("#inquiryForm"), fService = $("#fService"), fSub = $("#fSub");
  const extra = $("#extraFiles");
  const svc = () => AM.svcById(fService.value);
  const sub = () => { const s = svc(); return s ? (s.subs[+fSub.value] || s.subs[0]) : null; };

  function fillServiceOptions() {
    const v = fService.value;
    fService.innerHTML = `<option value="" disabled ${v ? "" : "selected"}>${t("f.choose")}</option>` +
      SV.map(s => `<option value="${s.id}">${esc(AM.title(s))}</option>`).join("") +
      `<option value="other">${t("f.other")}</option>`;
    if (v) fService.value = v;
  }
  function fillSubs() {
    const v = fSub.value, s = svc();
    fSub.innerHTML = s
      ? s.subs.map((u, i) => `<option value="${i}">${esc(AM.subName(u))}</option>`).join("")
      : `<option value="other">${t("f.general")}</option>`;
    if (v && [...fSub.options].some(o => o.value === v)) fSub.value = v;
  }
  function renderChecklist() {
    const cl = $("#checklistCard"), s = svc(), u = sub();
    if (!s) {
      cl.innerHTML = `<h4>${t("cl.title")}</h4><p class="muted small">${t(fService.value === "other" ? "cl.other" : "cl.empty")}</p>`;
      return;
    }
    cl.style.setProperty("--c", s.color);
    cl.innerHTML = `<h4>${esc(AM.subName(u))}</h4><ol>${u.docs.map(d => `<li>${esc(AM.doc(d))}</li>`).join("")}</ol>`;
  }
  function renderUploads() {
    const box = $("#uploads"), u = sub();
    renderChecklist();
    if (!u) { box.innerHTML = ""; updateSize(); return; }
    box.innerHTML = `<p class="uploads-title">${t("up.title")}</p>` +
      u.docs.map((d, i) => `
        <label class="up" data-i="${i}">
          <span class="up-ic">${i + 1}</span>
          <span class="up-txt"><span class="up-label">${esc(AM.doc(d))}</span><small>${t("up.hint")}</small></span>
          <input type="file" name="Document ${i + 1}" data-i="${i}" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" />
        </label>`).join("");
    updateSize();
  }
  function relabelUploads() {
    const u = sub(); if (!u) return;
    const ttl = $(".uploads-title"); if (ttl) ttl.textContent = t("up.title");
    $$(".up").forEach(up => {
      const i = +up.dataset.i, inp = $("input", up);
      $(".up-label", up).textContent = AM.doc(u.docs[i]);
      $("small", up).textContent = fileHint(inp);
    });
    dropHint();
  }
  const fileHint = inp => !inp.files.length ? t("up.hint") : inp.files.length === 1 ? inp.files[0].name : t("up.n", { n: inp.files.length });
  const dropHint = () => $("[data-drop] p").textContent = extra.files.length ? t("drop.n", { n: extra.files.length }) : t("drop");

  function preselect(id, i) {
    if (!AM.svcById(id)) return;
    fService.value = id; fSub.value = ""; fillSubs();
    if (i != null && fSub.options[i]) fSub.value = String(i);
    renderUploads();
  }

  fService.addEventListener("change", () => { fSub.value = ""; fillSubs(); renderUploads(); });
  fSub.addEventListener("change", renderUploads);
  form.addEventListener("change", e => {
    const inp = e.target;
    if (inp.type !== "file") return;
    const up = inp.closest(".up");
    if (up) {
      up.classList.toggle("has", inp.files.length > 0);
      $("small", up).textContent = fileHint(inp);
      $(".up-ic", up).textContent = inp.files.length ? "✓" : +up.dataset.i + 1;
    }
    if (inp === extra) dropHint();
    updateSize();
  });
  const drop = $("[data-drop]");
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, () => drop.classList.add("over")));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove("over")));

  const allFiles = () => $$("input[type=file]", form).flatMap(i => [...i.files]);
  const totalMB = () => allFiles().reduce((a, f) => a + f.size, 0) / 1048576;
  function updateSize() {
    const mb = totalMB(), el = $("#sizeInfo");
    el.textContent = t("f.size", { a: mb.toFixed(1), b: S.maxUploadMB });
    el.style.color = mb > S.maxUploadMB ? "#ff6b6b" : "";
  }
  const shortLabel = s => { s = AM.safe(s); return s.length > 60 ? s.slice(0, 60).replace(/\s+\S*$/, "") : s; };
  function collectFiles() {
    const u = sub(), list = [];
    $$(".up input", form).forEach(inp => {
      const i = +inp.dataset.i;
      const label = u ? shortLabel(AM.docEn(u.docs[i])) : "Document";
      [...inp.files].forEach((f, k) => list.push({ f, docIndex: i, label: u ? u.docs[i] : ["Document", "مستند"],
        name: `${pad(i + 1)} - ${label}${inp.files.length > 1 ? ` (${k + 1})` : ""}${AM.ext(f.name)}` }));
    });
    [...extra.files].forEach(f => list.push({ f, docIndex: null, label: ["Extra file", "ملف إضافي"], name: `Extra - ${AM.safe(f.name)}` }));
    return list;
  }

  form.addEventListener("submit", async e => {
    if (!form.reportValidity()) { e.preventDefault(); return; }
    if (totalMB() > S.maxUploadMB) { e.preventDefault(); return AM.toast(t("toast.big", { b: S.maxUploadMB }), true); }
    const s = svc(), u = sub();
    const svcEn = s ? s.title : "Other";
    const subEn = u ? u.name : "General inquiry";
    const useAccount = !!(window.Account && Account.enabled);

    // fallback until the Google script is connected: email via FormSubmit
    if (!useAccount) {
      $("#fSubject").value = `New inquiry: ${svcEn} — ${subEn} (${form.Name.value})`;
      fService.options[fService.selectedIndex].value = svcEn;
      fSub.options[fSub.selectedIndex].value = subEn;
      $("#fNext").value = location.origin + location.pathname + "?sent=1#apply";
      form.action = `https://formsubmit.co/${S.email}`;
      setBusy(true);
      return;
    }
    e.preventDefault();
    if (form._honey.value) return;
    let user;
    try { user = await Account.requireUser(); } catch { return; }
    const meta = {
      name: form.Name.value.trim(), phone: form.Phone.value.trim(),
      email: form.email.value.trim() || (user && user.email) || "",
      contact: $("#fPref").value,
      service: svcEn, serviceAr: s ? s.ar : "", serviceId: s ? s.id : "other",
      transaction: subEn, transactionAr: u ? u.ar : "", subIndex: s ? +fSub.value : null,
      notes: form.Message.value.trim(), lang: AM.lang(), account: user ? user.email : ""
    };
    const list = collectFiles();
    setBusy(true);
    try {
      await Account.saveInquiry(meta, list, progress);
      progress(100);
      AM.toast(t("toast.okAccount"));
      resetForm();
      Account.openDashboard();
    } catch (err) {
      console.error(err);
      AM.toast(t("toast.fail"), true);
    } finally { setBusy(false); }
  });
  function setBusy(b) {
    const btn = $("#submitBtn");
    btn.disabled = b;
    btn.textContent = t(b ? "f.sending" : "f.send");
    $("#progress").hidden = !b || !(window.Account && Account.enabled);
    if (!b) progress(0);
  }
  const progress = p => $("#progress span").style.width = p + "%";
  function resetForm() {
    form.reset();
    fService.value = ""; fillServiceOptions(); fillSubs(); renderUploads(); dropHint(); updateSize();
    window.Account && Account.prefill && Account.prefill();
  }

  /* ---------- language hook + first render ---------- */
  AM.onLang.push(() => {
    renderCards(); renderWizard(); renderTracker(); renderNews();
    fillServiceOptions(); fillSubs(); renderChecklist(); relabelUploads(); updateSize();
    if (!$("#submitBtn").disabled) $("#submitBtn").textContent = t("f.send");
  });

  // arriving from a service page: ?service=commercial&sub=2#apply
  const qSvc = AM.qs("service");
  document.addEventListener("DOMContentLoaded", () => {
    if (qSvc) {
      preselect(qSvc, AM.qs("sub") != null ? +AM.qs("sub") : null);
      setTimeout(() => $("#apply").scrollIntoView({ behavior: "smooth" }), 600);
    }
    if (AM.qs("sent")) {
      setTimeout(() => AM.toast(t("toast.ok")), 900);
      history.replaceState(null, "", location.pathname + "#apply");
    }
  });
})();
