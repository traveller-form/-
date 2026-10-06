/**
 * Travel Desk - booking request receiver
 *
 * Lives inside the Google Sheet that collects the requests:
 *   Extensions -> Apps Script -> paste this over the empty Code.gs -> Save
 *   Deploy -> New deployment -> Web app
 *     Execute as:       Me
 *     Who has access:   Anyone
 *   Copy the /exec URL into CONFIG.endpoint in index.html
 *
 * The sheet must have a tab named exactly 'Responses', with the column
 * headers in row 1. The script matches incoming fields to those headers,
 * so you can reorder or add columns without touching this file.
 */

// Must match CONFIG.secret in index.html exactly.
var SHARED_SECRET = 'change-this-to-a-long-random-string';

var SHEET_NAME = 'Responses';

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    // Stops two submissions landing on the same row.
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorised' });
    }

    var data = body.data || {};
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      return json({ ok: false, error: 'sheet tab "' + SHEET_NAME + '" not found' });
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    var row = headers.map(function (header) {
      var value = data[header];
      if (value === undefined || value === null) return '';
      if (value === true) return 'Yes';
      if (value === false) return 'No';
      return value;
    });

    sheet.appendRow(row);

    return json({ ok: true, reference: data['Reference'] || '' });

  } catch (err) {
    return json({ ok: false, error: String(err) });

  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/**
 * Opening the /exec URL in a browser hits this instead of doPost.
 * Useful for checking the deployment is live.
 */
function doGet() {
  return json({ ok: true, message: 'Travel desk receiver is running.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
