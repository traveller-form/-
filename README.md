# Traveller Booking Request

A single-page travel booking request form. Travellers fill it in on the web;
each submission is appended as a row to a Google Sheet, which the travel desk
reviews without opening the site.

**Live form:** https://USERNAME.github.io/traveller-form/

## How it works

```
index.html  (GitHub Pages)
     |  POST, JSON
     v
Code.gs  (Google Apps Script web app)
     |  appendRow()
     v
Google Sheet, "Responses" tab
```

No server, no database, no API keys in the page.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole form - markup, styles and script in one file |
| `Code.gs` | The Apps Script that receives submissions and writes the row |

## Setup

1. **Sheet** - create a Google Sheet with a tab named `Responses` and the column
   headers in row 1 (the headers must match the values in `SHEET_COLUMNS` in
   `index.html`).
2. **Script** - in that Sheet: Extensions -> Apps Script, paste `Code.gs`, save.
3. **Deploy** - Deploy -> New deployment -> Web app. Execute as *Me*, Who has
   access *Anyone*. Authorise when prompted. Copy the `/exec` URL.
4. **Wire it up** - in `index.html`, set `CONFIG.endpoint` to that URL and
   `CONFIG.secret` to the same string as `SHARED_SECRET` in `Code.gs`.
5. **Publish** - push to GitHub, then Settings -> Pages -> Deploy from branch ->
   `main` / `root`.

## Changing the questions

Add or rename a column in the sheet, then update `SHEET_COLUMNS` in
`index.html` so the form field points at the new header. `Code.gs` reads the
header row at submission time, so it needs no change.

## Notes

- Re-deploying the script: use Deploy -> Manage deployments -> edit the existing
  one, so the `/exec` URL stays the same. A new deployment gives a new URL.
- The shared secret is visible in the page source. It deters stray bots posting
  to the script URL; it is not access control. Anyone with the form link can
  submit.
- The form collects personal information. Keep the Sheet shared with named
  people only, not "anyone with the link".
