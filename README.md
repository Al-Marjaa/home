# Al Marjaa — المرجع

A 3D, bilingual (English / العربية) website with light and dark modes for a Lebanese government-transactions office. The site is hosted free on **GitHub Pages**. Everything else runs on **your Google account**:

| What | Where it lives |
|---|---|
| Client files | Google Drive → `Al Marjaa — Client Files / <Client Name> / <Service> / files` |
| Inquiries + statuses | Google Sheet **"Al Marjaa — Tracking"** (tabs: Inquiries, Files, Users, News) |
| Accounts (log in / sign up) | The same Sheet (passwords stored scrambled, never readable) |
| Emails | Your Gmail: new-file alerts to you, status updates and reset codes to clients |

## Files
| File | Upload to GitHub? |
|---|---|
| **Pages:** `index.html`, `services.html`, `service.html`, `news.html`, `article.html`, `about.html` | **Yes** |
| **Style and scripts:** `style.css`, `core.js`, `scene.js`, `home.js`, `pages.js`, `account.js`, `i18n.js`, `data.js`, `news.js` | **Yes** |
| `google-apps-script/Code.gs` | No — pasted into Google (step 2) |

> Seeing the old name or a broken layout? GitHub still has old files. Delete everything in the repo, upload all 15 files (and delete the old `app.js`), wait 1–2 minutes, then hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).

## 1. Publish on GitHub Pages
1. Create a public repository on github.com and upload all 15 files.
2. Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)` → Save.
3. The site appears at `https://<username>.github.io/<repo>/`.

## 2. Connect Google (about 5 minutes)
Do all of this signed in as **oliviadiaasayah@gmail.com**.
1. Open https://script.google.com → **New project**. Rename it "Al Marjaa".
2. Delete the sample code, paste everything from `google-apps-script/Code.gs`, then press **Save**.
3. In the function dropdown at the top choose **setup** → **Run**. Allow the permissions (Drive, Sheets, Gmail). If Google says the app isn't verified, click **Advanced → Go to Al Marjaa**; it's your own script.
   This creates the **Al Marjaa — Client Files** folder in your Drive with the **Al Marjaa — Tracking** sheet inside it.
4. **Deploy → New deployment** → gear icon → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy** → copy the **Web app URL** (ends in `/exec`).
5. Paste it into `data.js`:
   ```js
   googleScriptUrl: "https://script.google.com/macros/s/…/exec",
   ```
   and upload `data.js` to GitHub again.
6. **Right away, sign up on your live website with oliviadiaasayah@gmail.com.** That address automatically becomes the office (admin) account. Do this before you share the site.

**Updating from the one-page version?** Paste the new `Code.gs` over the old one → Save → run **setup** again (it adds the **News** tab and keeps your data) → then do the redeploy below.

Changed `Code.gs` later? Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

## 3. Daily use
**Clients:** click **Start a file** → sign up → fill the form and attach documents → follow everything in **My files**: status timeline, your messages, their documents, and a checklist of what's still missing. They can add documents at any time.

**You (office):** log in on the website → **My files** shows **All clients**. Open a file to:
- call or WhatsApp the client, or open their Drive folder
- set the **status** and write a **message** → **Save update**. The client sees it in the dashboard and gets an email.

You can also work straight in the **Tracking sheet**: change the `status` dropdown or type in `status_note`. The update time is stamped and the client is emailed automatically.

| Status (sheet value) | Client sees |
|---|---|
| `received` | Received |
| `review` | Under review |
| `missing` | Missing documents. When the client uploads, it moves back to `review` by itself |
| `progress` | In progress |
| `ready` | Ready for pickup |
| `completed` / `cancelled` | Closed |

To make another staff member an office admin, have them sign up on the site, then in the sheet's **Users** tab change their `role` from `client` to `admin`.

**Forgot password:** clients click *Forgot password?*, get a 6-digit code by email (valid 30 minutes), and choose a new password.

## 4. Posting news
The **News** page shows two kinds of posts together, newest first:
- **From the sheet (easiest):** open the **News** tab of the Tracking sheet and add a row:
  - `id`: a short name with no spaces, like `office-closed-nov-22`
  - `date`: like `2026-11-20`
  - `category`: `news`, `guide` or `announcement`
  - `service_id` (optional): links the post to a service, e.g. `vehicles`, `realestate`, `nssf`, `mofa`, `commercial`, `insurance`
  - `title` / `title_ar`, `summary` / `summary_ar`
  - `body` / `body_ar`: leave a blank line between paragraphs (Alt+Enter twice inside the cell)
  - `source_name` / `source_url` (optional)
  - tick **published**. Untick it to hide the post.

  It appears on the site within a minute (visitors who already have the site open see it on their next visit).
- **Built in:** the posts in `news.js` (guides and a few real news items). Edit or delete them there if you like.

## Limits to know
- Each upload can be up to **25 MB** in total (`maxUploadMB` in `data.js`). Bigger files can go by WhatsApp.
- A free Gmail account sends about **100 emails/day**, which covers alerts, status emails and codes. Turn off client status emails with `EMAIL_CLIENT_ON_STATUS_CHANGE: false` in `Code.gs`.
- Each action takes 1–3 seconds (Google's servers).
- Two clients with exactly the same name share a Drive folder; their files stay separate inside it, and the sheet shows who sent what.

Until `googleScriptUrl` is filled in, the form falls back to emailing inquiries through FormSubmit.

## Disclaimer
Document lists are a general guide from public sources (Dawlati, TMO, Invest in Lebanon, embassy legalisation pages, insurers). Requirements change, so review each list before going live.
