/**
 * =====================================================================
 *  Al Marjaa — Google-only backend
 *  Accounts + uploads + tracking, using only your Google account:
 *    • Google Drive  → Al Marjaa — Client Files / <Client Name> / <Service> / files
 *    • Google Sheet  → "Al Marjaa — Tracking" (Inquiries, Files, Users tabs)
 *    • Gmail         → notifications + password-reset codes
 *
 *  Setup (details in README):
 *    1. Paste this file into script.google.com (signed in as the office account)
 *    2. Run  setup  once and allow the permissions
 *    3. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone
 *    4. Paste the /exec URL into data.js → googleScriptUrl
 * =====================================================================
 */

const CONFIG = {
  SITE_NAME: "Al Marjaa",
  ROOT_FOLDER_NAME: "Al Marjaa — Client Files",
  SHEET_NAME: "Al Marjaa — Tracking",
  OFFICE_EMAIL: "oliviadiaasayah@gmail.com",   // gets notifications; becomes admin when it signs up
  TIME_ZONE: "Asia/Beirut",
  SESSION_DAYS: 30,
  EMAIL_CLIENT_ON_STATUS_CHANGE: true
};

const STATUSES = ["received", "review", "missing", "progress", "ready", "completed", "cancelled"];
const STATUS_TEXT = {
  received:  ["Received", "تم الاستلام"],
  review:    ["Under review", "قيد المراجعة"],
  missing:   ["Missing documents", "مستندات ناقصة"],
  progress:  ["In progress", "قيد التنفيذ"],
  ready:     ["Ready for pickup", "جاهز للاستلام"],
  completed: ["Completed", "مُنجز"],
  cancelled: ["Cancelled", "ملغى"]
};
const INQ_COLS  = ["id", "created_at", "updated_at", "status", "status_note", "name", "phone", "email", "contact",
                   "service", "service_ar", "service_id", "transaction", "transaction_ar", "sub_index", "notes",
                   "user_id", "folder_id", "folder_url"];
const FILE_COLS = ["id", "inquiry_id", "user_id", "doc_index", "label", "label_ar", "file_name", "file_id", "size", "created_at"];
const NEWS_COLS = ["id", "date", "category", "service_id", "title", "title_ar", "summary", "summary_ar",
                   "body", "body_ar", "source_name", "source_url", "published"];
const USER_COLS = ["id", "email", "name", "phone", "role", "created_at", "last_login", "salt", "hash"];

/* =====================================================================
   ONE-TIME SETUP — run this from the editor
   ===================================================================== */
function setup() {
  const props = PropertiesService.getScriptProperties();
  const root = rootFolder_();
  let ss = null;
  const id = props.getProperty("SHEET_ID");
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(root);
    props.setProperty("SHEET_ID", ss.getId());
  }
  ensureSheet_(ss, "Inquiries", INQ_COLS);
  ensureSheet_(ss, "Files", FILE_COLS);
  ensureSheet_(ss, "Users", USER_COLS);
  const newsSh = ensureSheet_(ss, "News", NEWS_COLS);
  const nrows = Math.max(newsSh.getMaxRows() - 1, 1);
  newsSh.getRange(2, NEWS_COLS.indexOf("category") + 1, nrows, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["news", "guide", "announcement"], true).build());
  newsSh.getRange(2, NEWS_COLS.indexOf("published") + 1, nrows, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  ["body", "body_ar", "summary", "summary_ar"].forEach(c => newsSh.setColumnWidth(NEWS_COLS.indexOf(c) + 1, 320));
  const def = ss.getSheetByName("Sheet1"); if (def && ss.getSheets().length > 1) ss.deleteSheet(def);

  // status dropdown + colours on the Inquiries tab
  const inq = ss.getSheetByName("Inquiries");
  const sc = INQ_COLS.indexOf("status") + 1;
  const range = inq.getRange(2, sc, Math.max(inq.getMaxRows() - 1, 1), 1);
  range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build());
  const colours = { received: "#dbeafe", review: "#ede9fe", missing: "#ffedd5", progress: "#d1fae5", ready: "#fef3c7", completed: "#dcfce7", cancelled: "#e5e7eb" };
  inq.setConditionalFormatRules(STATUSES.map(s =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(colours[s]).setRanges([range]).build()));
  inq.setColumnWidth(INQ_COLS.indexOf("status_note") + 1, 320);
  // hide technical columns from day-to-day view
  ["user_id", "folder_id"].forEach(c => inq.hideColumns(INQ_COLS.indexOf(c) + 1));
  const users = ss.getSheetByName("Users");
  ["salt", "hash"].forEach(c => users.hideColumns(USER_COLS.indexOf(c) + 1));

  if (!props.getProperty("PEPPER")) props.setProperty("PEPPER", Utilities.getUuid() + Utilities.getUuid());

  // when you edit a status in the sheet: stamp the update time (+ email the client)
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === "onSheetEdit")) {
    ScriptApp.newTrigger("onSheetEdit").forSpreadsheet(ss).onEdit().create();
  }
  MailApp.getRemainingDailyQuota();   // asks for the Gmail permission now
  Logger.log("Ready. Tracking sheet: " + ss.getUrl());
  Logger.log("Drive folder: " + root.getUrl());
}

/* =====================================================================
   WEB API
   ===================================================================== */
function doGet() { return out_({ ok: true, message: CONFIG.SITE_NAME + " API is running." }); }

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: "bad_request" }); }
  try {
    const fn = ACTIONS[d.action];
    if (!fn) throw fail_("unknown_action");
    return out_(Object.assign({ ok: true }, fn(d) || {}));
  } catch (err) {
    console.error(err);
    return out_({ ok: false, error: err.code || "server", message: String(err.message || err) });
  }
}

const ACTIONS = {
  /* ---------- accounts ---------- */
  signup(d) {
    const email = cleanEmail_(d.email), name = String(d.name || "").trim(), phone = String(d.phone || "").trim();
    if (!email) throw fail_("email");
    if (String(d.password || "").length < 8) throw fail_("short");
    return withLock_(() => {
      if (findUser_(email)) throw fail_("exists");
      const salt = Utilities.getUuid();
      const user = {
        id: Utilities.getUuid(), email, name: name || email.split("@")[0], phone,
        role: email === CONFIG.OFFICE_EMAIL.toLowerCase() ? "admin" : "client",
        created_at: new Date(), last_login: new Date(), salt, hash: hash_(d.password, salt)
      };
      append_("Users", user);
      return { token: newSession_(user.id), user: publicUser_(user) };
    });
  },

  login(d) {
    const email = cleanEmail_(d.email);
    const cache = CacheService.getScriptCache(), key = "fail_" + email;
    if (+(cache.get(key) || 0) >= 8) throw fail_("many");
    const u = findUser_(email);
    if (!u || hash_(String(d.password || ""), u.salt) !== u.hash) {
      cache.put(key, String(+(cache.get(key) || 0) + 1), 900);
      throw fail_("invalid");
    }
    cache.remove(key);
    update_("Users", u._row, { last_login: new Date() });
    cleanupSessions_();
    return { token: newSession_(u.id), user: publicUser_(u) };
  },

  me(d) { return { user: publicUser_(auth_(d.token)) }; },

  logout(d) {
    if (d.token) PropertiesService.getScriptProperties().deleteProperty(sessKey_(d.token));
    return {};
  },

  forgot(d) {
    const email = cleanEmail_(d.email), u = findUser_(email);
    if (u) {   // same answer either way, so nobody can test which emails have accounts
      const code = String(Math.floor(100000 + Math.random() * 900000));
      CacheService.getScriptCache().put("reset_" + email, JSON.stringify({ code, tries: 0 }), 1800);
      MailApp.sendEmail({
        to: email, name: CONFIG.SITE_NAME,
        subject: CONFIG.SITE_NAME + " — password code / رمز كلمة المرور: " + code,
        body: "Your password reset code is: " + code + "\nIt expires in 30 minutes.\n\n" +
              "رمز إعادة تعيين كلمة المرور: " + code + "\nصالح لمدة 30 دقيقة.\n\n" +
              "If you didn't ask for this, ignore this email."
      });
    }
    return {};
  },

  reset(d) {
    const email = cleanEmail_(d.email), cache = CacheService.getScriptCache(), key = "reset_" + email;
    const rec = JSON.parse(cache.get(key) || "null");
    if (!rec || rec.tries >= 5) throw fail_("code");
    if (String(d.code || "").trim() !== rec.code) { rec.tries++; cache.put(key, JSON.stringify(rec), 1800); throw fail_("code"); }
    if (String(d.password || "").length < 8) throw fail_("short");
    const u = findUser_(email); if (!u) throw fail_("code");
    const salt = Utilities.getUuid();
    update_("Users", u._row, { salt, hash: hash_(d.password, salt), last_login: new Date() });
    cache.remove(key);
    return { token: newSession_(u.id), user: publicUser_(u) };
  },

  /* ---------- public: news rows from the "News" tab ---------- */
  news() {
    const truthy = v => v === true || /^(true|yes|y|1|نعم)$/i.test(String(v).trim());
    const paras = v => String(v || "").split(/\n\s*\n|\r\n\s*\r\n/).map(x => x.trim()).filter(Boolean);
    const items = rows_("News").filter(r => truthy(r.published) && (r.title || r.title_ar)).map(r => ({
      id: String(r.id), date: r.date instanceof Date ? Utilities.formatDate(r.date, CONFIG.TIME_ZONE, "yyyy-MM-dd") : String(r.date || ""),
      category: ["news", "guide", "announcement"].indexOf(r.category) >= 0 ? r.category : "news",
      service: String(r.service_id || ""),
      title: String(r.title || ""), titleAr: String(r.title_ar || ""),
      summary: String(r.summary || ""), summaryAr: String(r.summary_ar || ""),
      body: paras(r.body), bodyAr: paras(r.body_ar),
      source: r.source_url ? { name: String(r.source_name || r.source_url), url: String(r.source_url) } : null
    }));
    return { items };
  },

  /* ---------- inquiries ---------- */
  submit(d) {
    const u = auth_(d.token);
    if (!d.service) throw fail_("missing_fields");
    return withLock_(() => {
      const clientName = clean_(d.name) || clean_(u.name) || "Client";
      const folder = sub_(sub_(rootFolder_(), clientName), clean_(d.service) || "Other");
      const id = newInquiryId_();
      const now = new Date();
      append_("Inquiries", {
        id, created_at: now, updated_at: now, status: "received", status_note: "",
        name: d.name || u.name, phone: d.phone || u.phone, email: d.email || u.email, contact: d.contact || "",
        service: d.service, service_ar: d.serviceAr || "", service_id: d.serviceId || "",
        transaction: d.transaction || "", transaction_ar: d.transactionAr || "",
        sub_index: d.subIndex == null ? "" : d.subIndex, notes: d.notes || "",
        user_id: u.id, folder_id: folder.getId(), folder_url: folder.getUrl()
      });
      const saved = saveFiles_(folder, d.files || [], id, u.id);
      writeDetails_(folder, id, d, saved);
      notifyOffice_("New file " + id + ": " + (d.name || u.name) + " — " + d.service + " / " + (d.transaction || ""),
        [ "Client: " + (d.name || u.name), "Phone: " + (d.phone || ""), "Email: " + (d.email || u.email),
          "Prefers: " + (d.contact || ""), "Service: " + d.service + " — " + (d.transaction || ""),
          "", "Notes:", d.notes || "-", "", "Files (" + saved.length + "):" ]
          .concat(saved.map(f => " • " + f.file_name)).concat(["", "Folder: " + folder.getUrl(), "Tracking sheet: " + sheet_().getUrl()]).join("\n"),
        d.email || u.email);
      return { id };
    });
  },

  addFiles(d) {
    const u = auth_(d.token);
    return withLock_(() => {
      const inq = findInquiry_(d.inquiryId);
      if (!inq) throw fail_("not_found");
      if (inq.user_id !== u.id && u.role !== "admin") throw fail_("forbidden");
      const folder = DriveApp.getFolderById(inq.folder_id);
      const saved = saveFiles_(folder, d.files || [], inq.id, inq.user_id);
      const patch = { updated_at: new Date() };
      if (inq.status === "missing" && u.role !== "admin") patch.status = "review";
      update_("Inquiries", inq._row, patch);
      if (u.role !== "admin") notifyOffice_("Documents added to " + inq.id + " — " + inq.name,
        "The client added " + saved.length + " document(s):\n" + saved.map(f => " • " + f.file_name).join("\n") +
        "\n\nFolder: " + inq.folder_url, inq.email);
      return { added: saved.length };
    });
  },

  list(d) {
    const u = auth_(d.token);
    const all = d.scope === "all" && u.role === "admin";
    const inqs = rows_("Inquiries").filter(r => all || r.user_id === u.id);
    const ids = {}; inqs.forEach(r => ids[r.id] = true);
    const files = rows_("Files").filter(f => ids[f.inquiry_id]);
    const out = inqs.map(r => ({
      id: r.id, created_at: iso_(r.created_at), updated_at: iso_(r.updated_at),
      status: STATUSES.indexOf(r.status) >= 0 ? r.status : "received", status_note: r.status_note,
      name: r.name, phone: String(r.phone || ""), email: r.email, contact: r.contact,
      service: r.service, service_ar: r.service_ar, service_id: r.service_id,
      transaction: r.transaction, transaction_ar: r.transaction_ar,
      sub_index: r.sub_index === "" ? null : +r.sub_index, notes: r.notes,
      folder_url: u.role === "admin" ? r.folder_url : undefined,
      inquiry_files: files.filter(f => f.inquiry_id === r.id).map(f => ({
        id: f.id, doc_index: f.doc_index === "" ? null : +f.doc_index, label: f.label, label_ar: f.label_ar,
        file_name: f.file_name, size: +f.size || 0, created_at: iso_(f.created_at)
      }))
    })).sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    return { rows: out };
  },

  update(d) {
    const u = auth_(d.token);
    if (u.role !== "admin") throw fail_("forbidden");
    if (STATUSES.indexOf(d.status) < 0) throw fail_("missing_fields");
    return withLock_(() => {
      const inq = findInquiry_(d.id); if (!inq) throw fail_("not_found");
      update_("Inquiries", inq._row, { status: d.status, status_note: d.note || "", updated_at: new Date() });
      if (d.status !== inq.status || (d.note || "") !== String(inq.status_note || "")) emailClient_(Object.assign({}, inq, { status: d.status, status_note: d.note || "" }));
      return {};
    });
  },

  file(d) {
    const u = auth_(d.token);
    const f = rows_("Files").find(x => x.id === d.fileId);
    if (!f) throw fail_("not_found");
    if (f.user_id !== u.id && u.role !== "admin") throw fail_("forbidden");
    const blob = DriveApp.getFileById(f.file_id).getBlob();
    return { name: f.file_name, type: blob.getContentType(), data: Utilities.base64Encode(blob.getBytes()) };
  }
};

/* =====================================================================
   SHEET EDITS (installed by setup): stamp time + tell the client
   ===================================================================== */
function onSheetEdit(e) {
  try {
    const sh = e.range.getSheet();
    if (sh.getName() !== "Inquiries" || e.range.getRow() < 2) return;
    const col = e.range.getColumn();
    const sCol = INQ_COLS.indexOf("status") + 1, nCol = INQ_COLS.indexOf("status_note") + 1;
    if (col !== sCol && col !== nCol) return;
    const row = e.range.getRow();
    sh.getRange(row, INQ_COLS.indexOf("updated_at") + 1).setValue(new Date());
    if (col === sCol) {
      const vals = sh.getRange(row, 1, 1, INQ_COLS.length).getValues()[0];
      const inq = {}; INQ_COLS.forEach((c, i) => inq[c] = vals[i]);
      emailClient_(inq);
    }
  } catch (err) { console.error(err); }
}

/* =====================================================================
   HELPERS
   ===================================================================== */
function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function fail_(code) { const e = new Error(code); e.code = code; return e; }
function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function clean_(s) { return String(s || "").replace(/[\\\/:*?"<>|#%]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120); }
function cleanEmail_(s) { s = String(s || "").trim().toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ""; }
function iso_(v) { return v instanceof Date ? v.toISOString() : (v ? new Date(v).toISOString() : ""); }

function rootFolder_() { return sub_(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER_NAME); }
function sub_(parent, name) { const it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : parent.createFolder(name); }

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!id) throw fail_("not_setup");
  return SpreadsheetApp.openById(id);
}
function ensureSheet_(ss, name, cols) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  const have = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
  if (have.join() !== cols.join()) sh.getRange(1, 1, 1, cols.length).setValues([cols]);
  sh.getRange(1, 1, 1, cols.length).setFontWeight("bold").setBackground("#0e1528").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  return sh;
}
function rows_(name) {
  const sh = sheet_().getSheetByName(name);
  const vals = sh.getDataRange().getValues();
  const cols = vals.shift() || [];
  return vals.map((v, i) => { const o = { _row: i + 2 }; cols.forEach((c, j) => o[c] = v[j]); return o; })
             .filter(o => o.id !== "" && o.id != null);
}
function append_(name, obj) {
  const sh = sheet_().getSheetByName(name);
  const cols = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  // force phone numbers / ids to stay text
  sh.appendRow(cols.map(c => {
    const v = obj[c];
    if (v === undefined || v === null) return "";
    if (typeof v === "string" && /^[+0-9]/.test(v) && c !== "created_at") return "'" + v;
    return v;
  }));
}
function update_(name, row, patch) {
  const sh = sheet_().getSheetByName(name);
  const cols = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  Object.keys(patch).forEach(k => { const c = cols.indexOf(k); if (c >= 0) sh.getRange(row, c + 1).setValue(patch[k]); });
}
function findUser_(email) { return email ? rows_("Users").find(u => String(u.email).toLowerCase() === email) : null; }
function findInquiry_(id) { return rows_("Inquiries").find(r => r.id === id); }
function publicUser_(u) { return { id: u.id, email: u.email, name: u.name, phone: String(u.phone || ""), role: u.role || "client" }; }
function newInquiryId_() {
  const taken = {}; rows_("Inquiries").forEach(r => taken[r.id] = true);
  let id; do { id = "AM-" + Utilities.getUuid().replace(/-/g, "").slice(0, 6).toUpperCase(); } while (taken[id]);
  return id;
}

/* passwords: salted + peppered SHA-256, stretched */
function hash_(pw, salt) {
  const pepper = PropertiesService.getScriptProperties().getProperty("PEPPER") || "";
  let digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pw + "|" + salt + "|" + pepper, Utilities.Charset.UTF_8);
  for (let i = 0; i < 800; i++) {
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.base64Encode(digest) + salt, Utilities.Charset.UTF_8);
  }
  return Utilities.base64Encode(digest);
}

/* sessions: random token for the browser, only its hash is stored */
function sessKey_(token) {
  return "sess_" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(token))).slice(0, 40);
}
function newSession_(userId) {
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, "");
  PropertiesService.getScriptProperties().setProperty(sessKey_(token),
    JSON.stringify({ uid: userId, exp: Date.now() + CONFIG.SESSION_DAYS * 864e5 }));
  return token;
}
function auth_(token) {
  if (!token) throw fail_("auth");
  const props = PropertiesService.getScriptProperties();
  const s = JSON.parse(props.getProperty(sessKey_(token)) || "null");
  if (!s || s.exp < Date.now()) throw fail_("auth");
  const u = rows_("Users").find(x => x.id === s.uid);
  if (!u) throw fail_("auth");
  return u;
}
function cleanupSessions_() {
  const props = PropertiesService.getScriptProperties(), all = props.getProperties(), now = Date.now();
  Object.keys(all).forEach(k => {
    if (k.indexOf("sess_") !== 0) return;
    try { if (JSON.parse(all[k]).exp < now) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
  });
}

/* files arrive as base64 from the website */
function saveFiles_(folder, files, inquiryId, userId) {
  const saved = [];
  files.forEach(f => {
    const name = clean_(f.name) || "file";
    const blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.type || "application/octet-stream", name);
    const file = folder.createFile(blob);
    const rec = {
      id: Utilities.getUuid(), inquiry_id: inquiryId, user_id: userId,
      doc_index: f.docIndex == null ? "" : f.docIndex, label: f.label || "", label_ar: f.labelAr || "",
      file_name: name, file_id: file.getId(), size: file.getSize(), created_at: new Date()
    };
    append_("Files", rec);
    saved.push(rec);
  });
  return saved;
}
function writeDetails_(folder, id, d, saved) {
  const stamp = Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, "yyyy-MM-dd HH-mm");
  const txt = [
    "File no.:      " + id, "Date:          " + stamp,
    "Name:          " + (d.name || ""), "Phone:         " + (d.phone || ""), "Email:         " + (d.email || ""),
    "Contact by:    " + (d.contact || ""),
    "Service:       " + (d.service || "") + (d.serviceAr ? "  /  " + d.serviceAr : ""),
    "Transaction:   " + (d.transaction || "") + (d.transactionAr ? "  /  " + d.transactionAr : ""),
    "", "Notes:", d.notes || "-", "", "Files:"
  ].concat(saved.map(f => " • " + f.file_name)).join("\n");
  folder.createFile(id + " — " + stamp + ".txt", txt, MimeType.PLAIN_TEXT);
}
function notifyOffice_(subject, body, replyTo) {
  try {
    const m = { to: CONFIG.OFFICE_EMAIL, subject: subject, body: body, name: CONFIG.SITE_NAME + " website" };
    if (replyTo && cleanEmail_(replyTo)) m.replyTo = replyTo;
    MailApp.sendEmail(m);
  } catch (err) { console.error("notify failed", err); }
}
function emailClient_(inq) {
  if (!CONFIG.EMAIL_CLIENT_ON_STATUS_CHANGE) return;
  const to = cleanEmail_(inq.email); if (!to) return;
  const st = STATUS_TEXT[inq.status] || [inq.status, inq.status];
  try {
    MailApp.sendEmail({
      to, name: CONFIG.SITE_NAME,
      subject: CONFIG.SITE_NAME + " — " + inq.id + ": " + st[0] + " / " + st[1],
      body: [
        "Hello " + (inq.name || "") + ",", "",
        "Your file " + inq.id + " (" + inq.service + (inq.transaction ? " — " + inq.transaction : "") + ") is now: " + st[0] + ".",
        inq.status_note ? "Message from our office: " + inq.status_note : null,
        "Log in to the website and open “My files” to see the details.", "",
        "مرحباً " + (inq.name || "") + "،",
        "أصبحت حالة ملفك " + inq.id + " (" + (inq.service_ar || inq.service) + "): " + st[1] + ".",
        inq.status_note ? "رسالة من مكتبنا: " + inq.status_note : null,
        "سجّل الدخول إلى الموقع وافتح «ملفاتي» لرؤية التفاصيل.", "", "— " + CONFIG.SITE_NAME
      ].filter(x => x !== null).join("\n")
    });
  } catch (err) { console.error("client email failed", err); }
}
