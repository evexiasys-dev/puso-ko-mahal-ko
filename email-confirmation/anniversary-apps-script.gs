/**
 * EVEXIA 3RD ANNIVERSARY PROMO — October 16, 2026
 * Registration handler + automatic confirmation email + reminder email
 *
 * What this does:
 *   - doPost() receives the website's pre-registration form, saves the row to the
 *     "Oct 16 Anniversary" tab, and IMMEDIATELY emails the confirmation to the
 *     patient. The send time is written to the "Confirmation Sent" column.
 *   - The "📧 Send Emails" menu is still available for resending a confirmation,
 *     catching up on any that failed, and sending the day-before reminder.
 *
 * SETUP (a new Google Sheet just for this event):
 *   1. Open the Google Sheet → Extensions → Apps Script.
 *   2. Paste this whole file and click Save.
 *   3. Select the function "setup" in the toolbar and click Run. Approve the
 *      permissions (Sheets + send email). This creates the "Oct 16 Anniversary" tab.
 *   4. Deploy → New deployment → Web app. Execute as: Me · Who has access: Anyone
 *      (not "Anyone with Google account"). Put the /exec URL in js/main.js (scriptURL).
 *   5. After later code changes: Deploy → Manage deployments → ✏️ Edit →
 *      Version: "New version" → Deploy, so the URL stays the same.
 *   6. Submit a test registration on the website with your own email.
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // New tab for this event, so February registrants are never emailed by mistake.
  // It is created automatically if missing, and any missing column is added.
  EVENT_SHEET_NAME: 'Oct 16 Anniversary',
  // Must match the form field names on the website (index.html).
  HEADERS: ['timestamp', 'First Name', 'Middle Name', 'Last Name', 'Suffix', 'Birthday', 'Age', 'Sex', 'Status',
    'Email', 'Contact', 'Barangay', 'City', 'Province', 'Package', 'Batch', 'Confirmation Sent', 'Reminder Sent'],

  CONFIRMATION_HEADER: 'Confirmation Sent',
  REMINDER_HEADER: 'Reminder Sent',

  SENDER_NAME: 'Evexia Wellness Center',
  EVENT_URL: 'https://evexia-events.evexia-sys.workers.dev/',

  CONFIRMATION_SUBJECT: '✓ You\'re Registered – Evexia 3rd Anniversary Promo (Oct 16)',
  REMINDER_SUBJECT: '⏰ Tomorrow: Evexia 3rd Anniversary Promo – Final Reminders'
};

const EVENT = {
  DATE: 'Friday, October 16, 2026',
  // Blood collection batches the patient picks on the form, with their fasting schedule
  BATCHES: [
    { name: 'Batch 1', time: '7:00 – 9:00 AM', dinner: '7:00 PM', lightMeal: '9:00 PM' },
    { name: 'Batch 2', time: '8:00 – 10:00 AM', dinner: '7:00 PM', lightMeal: '10:00 PM' }
  ],
  CONSULTATION: '7:00 AM – 2:00 PM',
  DOCTOR: 'Dr. Vico F. Escueta',
  DOCTOR_TITLE: 'Family Physician · Integrative Medicine & Naturopathy',
  VENUE: 'Evexia Wellness Center',
  ADDRESS: 'San Lorenzo Rd., Brgy. Dita, Sta. Rosa City, Laguna<br>Near Chapter 1 Café',
  EVEXIA_LOGO: 'https://i.imgur.com/hKzynDE.png',
  DOCTOR_SPECIALTIES: ['Family Medicine', 'Integrative Medicine', 'Nutrition', 'Occupational Medicine', 'Animal Bites'],
  // Same partner logos as the website's purple "In partnership with" band
  PARTNERS: [
    { name: 'QualiCheck Diagnostic Clinic', logo: 'https://evexia-events.evexia-sys.workers.dev/assets/images/qualicheck-partner.png', width: 210 },
    { name: 'Nanucell', logo: 'https://evexia-events.evexia-sys.workers.dev/assets/images/nanucell-partner.png', width: 180 }
  ]
};

const COLORS = {
  forest: '#0C3526',
  green: '#34B35F',
  darkGreen: '#1F7A43',
  coral: '#F0564A',
  darkCoral: '#C9372B',
  gold: '#F2C166',
  text: '#1F2A24',
  muted: '#5B6660',
  border: '#E6E3DC',
  cream: '#FAF8F4'
};

// ============================================
// ONE-TIME SETUP — run from the editor to authorize and create the tab
// ============================================
function setup() {
  const sheet = getEventSheet_();
  Logger.log('Event tab ready: "%s". Emails remaining today: %s',
    sheet.getName(), MailApp.getRemainingDailyQuota());
}

// ============================================
// WEB APP — receives the website form
// ============================================
function doPost(e) {
  const params = (e && e.parameter) || {};
  const lock = LockService.getScriptLock();
  let sheet, row;

  try {
    lock.waitLock(15000);
    sheet = getEventSheet_();

    const headers = getHeaders_(sheet);
    const values = headers.map(function (h) {
      const key = String(h).trim();
      if (key.toLowerCase() === 'timestamp') return new Date();
      if (key === CONFIG.CONFIRMATION_HEADER || key === CONFIG.REMINDER_HEADER) return '';
      return params[key] !== undefined ? asSheetText_(params[key]) : '';
    });

    row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
    SpreadsheetApp.flush();
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }

  // The registration is saved at this point; an email problem must not fail it.
  const emailStatus = sendAndMark_(sheet, row, participantFromRow_(sheet, row), 'confirmation');
  return json_({ result: 'success', row: row, email: emailStatus });
}

function doGet() {
  return json_({ result: 'ok', message: 'Evexia registration endpoint is running.' });
}

// ============================================
// MENU
// ============================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📧 Send Emails')
    .addSubMenu(ui.createMenu('✅ Registration Confirmation')
      .addItem('✉️ Resend to Selected Row', 'sendConfirmationToSelectedRow')
      .addItem('📧 Send to All (Not Sent)', 'sendConfirmationToAll'))
    .addSubMenu(ui.createMenu('⏰ Final Reminder (Oct 15)')
      .addItem('✉️ Send to Selected Row', 'sendReminderToSelectedRow')
      .addItem('📧 Send to All (Not Sent)', 'sendReminderToAll'))
    .addSeparator()
    .addItem('⚙️ Instructions', 'showInstructions')
    .addToUi();
}

function sendConfirmationToSelectedRow() { sendToSelectedRow_('confirmation'); }
function sendConfirmationToAll() { sendToAll_('confirmation'); }
function sendReminderToSelectedRow() { sendToSelectedRow_('reminder'); }
function sendReminderToAll() { sendToAll_('reminder'); }

function sendToSelectedRow_(emailType) {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== CONFIG.EVENT_SHEET_NAME) {
    showAlert('Please open the "' + CONFIG.EVENT_SHEET_NAME + '" tab and select a participant row.');
    return;
  }
  const row = sheet.getActiveRange().getRow();
  if (row < 2) {
    showAlert('Please select a participant row (not the header row).');
    return;
  }

  const participant = participantFromRow_(sheet, row);
  const status = sendAndMark_(sheet, row, participant, emailType);
  showAlert(status === 'sent'
    ? '✅ Email sent to:\n' + participant.email
    : '❌ Not sent: ' + status);
}

function sendToAll_(emailType) {
  const sheet = getEventSheet_();
  const trackingCol = getColumn_(sheet, trackingHeader_(emailType));
  const lastRow = sheet.getLastRow();
  let sent = 0, skipped = 0, errors = 0;

  for (let row = 2; row <= lastRow; row++) {
    // A date means it was sent; error notes are retried.
    if (sheet.getRange(row, trackingCol).getValue() instanceof Date) { skipped++; continue; }

    const participant = participantFromRow_(sheet, row);
    if (!participant.name) { skipped++; continue; }

    const status = sendAndMark_(sheet, row, participant, emailType);
    if (status === 'sent') {
      sent++;
      Utilities.sleep(1000); // stay under Gmail rate limits
    } else if (status === 'no email') {
      skipped++;
    } else {
      errors++;
    }
  }

  showAlert((emailType === 'confirmation' ? 'Confirmation' : 'Reminder') + ' campaign complete!\n\n' +
    '✅ Sent: ' + sent + '\n⏭️ Skipped (already sent / no email): ' + skipped + '\n❌ Errors: ' + errors);
}

// ============================================
// SENDING
// ============================================
/** Sends the email and records the result in the tracking column. Returns 'sent' or the error. */
function sendAndMark_(sheet, row, participant, emailType) {
  const cell = sheet.getRange(row, getColumn_(sheet, trackingHeader_(emailType)));

  const email = String(participant.email || '').trim();
  if (!email || email.toUpperCase() === 'N/A') {
    cell.setValue('No Email');
    return 'no email';
  }
  if (email.indexOf('@') === -1) {
    cell.setValue('Invalid Email');
    return 'invalid email';
  }

  try {
    MailApp.sendEmail({
      to: email,
      subject: emailType === 'confirmation' ? CONFIG.CONFIRMATION_SUBJECT : CONFIG.REMINDER_SUBJECT,
      htmlBody: emailType === 'confirmation'
        ? createConfirmationEmailHTML(participant)
        : createReminderEmailHTML(participant),
      name: CONFIG.SENDER_NAME
    });
    cell.setValue(new Date());
    return 'sent';
  } catch (err) {
    cell.setValue('Error: ' + err.message);
    return err.message;
  }
}

// ============================================
// SHEET HELPERS
// ============================================
function getSpreadsheet_() {
  // Supports the "form to Google Sheets" setup that stores the sheet id as a script property.
  const key = PropertiesService.getScriptProperties().getProperty('key');
  return key ? SpreadsheetApp.openById(key) : SpreadsheetApp.getActiveSpreadsheet();
}

function getEventSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(CONFIG.EVENT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.EVENT_SHEET_NAME);
    sheet.setFrozenRows(1);
  }
  ensureHeaders_(sheet);
  return sheet;
}

/** Adds any CONFIG.HEADERS column the tab doesn't have yet, at the end. */
function ensureHeaders_(sheet) {
  const existing = sheet.getLastColumn() > 0 ? getHeaders_(sheet) : [];
  const missing = CONFIG.HEADERS.filter(function (h) { return existing.indexOf(h) === -1; });
  if (!missing.length) return;
  const start = existing.filter(String).length + 1;
  sheet.getRange(1, start, 1, missing.length).setValues([missing]).setFontWeight('bold');
}

function getHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
}

/** Returns the 1-based column for a header, adding the header at the end if it is missing. */
function getColumn_(sheet, header) {
  const headers = getHeaders_(sheet);
  const index = headers.indexOf(header);
  if (index !== -1) return index + 1;
  const col = sheet.getLastColumn() + 1;
  sheet.getRange(1, col).setValue(header).setFontWeight('bold');
  return col;
}

function participantFromRow_(sheet, row) {
  const headers = getHeaders_(sheet);
  const data = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const get = function (name) {
    const i = headers.indexOf(name);
    return i === -1 ? '' : data[i];
  };
  const middle = String(get('Middle Name')).toUpperCase() === 'N/A' ? '' : get('Middle Name');
  const name = [get('First Name'), middle, get('Last Name'), get('Suffix')].filter(String).join(' ') || get('Name');
  const address = [get('Barangay'), get('City'), get('Province')].filter(String).join(', ');
  return { name: name, email: get('Email'), contact: get('Contact'), address: address, package: get('Package'), batch: get('Batch') };
}

function trackingHeader_(emailType) {
  return emailType === 'confirmation' ? CONFIG.CONFIRMATION_HEADER : CONFIG.REMINDER_HEADER;
}

/**
 * Stops user input like "=HYPERLINK(...)" from being run as a formula, and keeps
 * "+63…" and "09…" numbers as text so Sheets doesn't drop the leading 0.
 */
function asSheetText_(value) {
  const s = String(value);
  return /^[=+\-@]/.test(s) || /^0\d+$/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function showAlert(message) {
  SpreadsheetApp.getUi().alert(message);
}

function showInstructions() {
  showAlert(
    '📧 EMAIL INSTRUCTIONS\n\n' +
    'CONFIRMATION (automatic)\n' +
    '• Sent automatically as soon as someone registers on the website.\n' +
    '• To resend: select the row → Menu → Registration Confirmation → Resend to Selected Row.\n' +
    '• To retry failed ones: Menu → Registration Confirmation → Send to All (Not Sent).\n\n' +
    'FINAL REMINDER (manual, send on October 15)\n' +
    '• Menu → Final Reminder → Send to All (Not Sent).\n\n' +
    'TRACKING\n' +
    '• Patients who registered without an email are marked "No Email" and skipped.\n' +
    '• "' + CONFIG.CONFIRMATION_HEADER + '" and "' + CONFIG.REMINDER_HEADER + '" columns show when each email went out, or the error.\n' +
    '• Emails remaining today: ' + MailApp.getRemainingDailyQuota() + '\n\n' +
    'All actions use the "' + CONFIG.EVENT_SHEET_NAME + '" tab.'
  );
}

// ============================================
// EMAIL BUILDING BLOCKS
// ============================================
function packageDetails_(pkg) {
  const str = String(pkg || '').toUpperCase();
  const isB = str.indexOf('B') !== -1 || str.indexOf('850') !== -1;
  const base = ['FBS (Fasting Blood Sugar)', 'BUN', 'Uric Acid', 'Total Cholesterol', 'Triglycerides', 'Creatinine'];
  const tests = base.map(function (t) {
    return '<li style="margin:0 0 6px 0;font-size:14px;color:' + COLORS.text + ';">' + t + '</li>';
  });
  if (isB) {
    ['HDL (Good Cholesterol)', 'LDL (Bad Cholesterol)'].forEach(function (t) {
      tests.push('<li style="margin:0 0 6px 0;font-size:14px;color:' + COLORS.darkCoral + ';font-weight:700;">' + t + '</li>');
    });
  }
  return {
    name: isB ? 'Package B · ₱850 · 8 Tests' : 'Package A · ₱600 · 6 Tests',
    tests: tests.join('')
  };
}

/** The patient's batch from the sheet value ("Batch 2 (8-10 AM)" → Batch 2), or null if none. */
function batchDetails_(value) {
  const str = String(value || '');
  if (!str) return null;
  return str.indexOf('2') !== -1 ? EVENT.BATCHES[1] : EVENT.BATCHES[0];
}

/** Fasting instructions for the patient's batch, or for both batches if none was chosen. */
function fastingSteps_(p) {
  const batch = batchDetails_(p.batch);
  const batches = batch ? [batch] : EVENT.BATCHES;
  return batches.map(function (b) {
    return (batch ? '' : b.name + ': ') + 'Dinner at <strong>' + b.dinner + '</strong>, light meal by <strong>' + b.lightMeal +
      '</strong>, then fast until your blood collection (' + b.time + ')';
  });
}

function label_(text) {
  return '<p style="margin:0;color:' + COLORS.muted + ';font-size:12px;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;">' + text + '</p>';
}

function value_(html, extraStyle) {
  return '<p style="margin:4px 0 0 0;color:' + COLORS.text + ';font-size:15px;' + (extraStyle || '') + '">' + html + '</p>';
}

/** One row with an icon, label and value, separated by a top border unless first. */
function infoRow_(icon, label, valueHtml, first) {
  return '<tr><td style="padding:' + (first ? '0 0 14px 0' : '14px 0') + ';' + (first ? '' : 'border-top:1px solid ' + COLORS.border + ';') + '">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td width="34" valign="top" style="font-size:18px;">' + icon + '</td>' +
    '<td valign="top">' + label_(label) + valueHtml + '</td>' +
    '</tr></table></td></tr>';
}

function section_(innerHtml) {
  return '<tr><td class="mobile-padding" style="padding:0 40px 30px 40px;">' + innerHtml + '</td></tr>';
}

function card_(innerHtml, style) {
  return '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:10px;' + (style || '') + '">' +
    '<tr><td style="padding:22px 24px;">' + innerHtml + '</td></tr></table>';
}

function heading_(text) {
  return '<h3 style="color:' + COLORS.forest + ';font-size:18px;margin:0 0 14px 0;font-weight:700;">' + text + '</h3>';
}

function emailLayout_(title, headerHtml, bodyRows) {
  return '<!DOCTYPE html><html lang="en"><head>' +
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<meta http-equiv="X-UA-Compatible" content="IE=edge"><title>' + title + '</title>' +
    '<style type="text/css">' +
    '@media only screen and (max-width:600px){.email-container{width:100%!important;min-width:100%!important;}.mobile-padding{padding-left:20px!important;padding-right:20px!important;}h1{font-size:30px!important;}}' +
    'body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}' +
    'img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}' +
    '</style></head>' +
    '<body style="margin:0;padding:0;font-family:\'Segoe UI\',-apple-system,BlinkMacSystemFont,\'Helvetica Neue\',Arial,sans-serif;background-color:' + COLORS.cream + ';">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:' + COLORS.cream + ';"><tr><td align="center" style="padding:32px 12px;">' +
    '<table width="600" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color:#ffffff;border-radius:14px;overflow:hidden;max-width:600px;width:100%;border:1px solid ' + COLORS.border + ';">' +

    // Header
    '<tr><td class="mobile-padding" style="background-color:' + COLORS.forest + ';background-image:linear-gradient(160deg,#13523A 0%,' + COLORS.forest + ' 100%);padding:36px 40px 34px 40px;text-align:center;">' +
    '<img src="' + EVENT.EVEXIA_LOGO + '" alt="Evexia Wellness Center" style="width:140px;max-width:140px;height:auto;display:block;margin:0 auto 6px auto;">' +
    headerHtml +
    '</td></tr>' +
    '<tr><td style="height:5px;line-height:5px;font-size:0;background-color:' + COLORS.coral + ';background-image:linear-gradient(90deg,' + COLORS.green + ',' + COLORS.coral + ');">&nbsp;</td></tr>' +

    bodyRows +

    // Partners (purple band, same as the website)
    section_(card_(
      '<p style="color:#ffffff;font-size:11px;margin:0 0 14px 0;letter-spacing:2px;text-transform:uppercase;font-weight:700;text-align:center;">In Partnership With</p>' +
      '<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>' +
      EVENT.PARTNERS.map(function (partner) {
        return '<td align="center" valign="middle" style="padding:6px 12px;">' +
          '<img src="' + partner.logo + '" alt="' + partner.name + '" width="' + partner.width + '" style="width:' + partner.width + 'px;max-width:100%;height:auto;display:block;"></td>';
      }).join('') +
      '</tr></table>',
      'background-color:#8E44AD;background-image:linear-gradient(135deg,#9B59B6 0%,#8E44AD 50%,#7D3C98 100%);'
    )) +

    // CTA
    '<tr><td class="mobile-padding" style="padding:0 40px 36px 40px;text-align:center;">' +
    '<p style="color:' + COLORS.muted + ';font-size:14px;margin:0 0 16px 0;">Questions? Message us on Facebook or Instagram.</p>' +
    '<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>' +
    '<td align="center" style="border-radius:999px;background-color:' + COLORS.coral + ';">' +
    '<a href="' + CONFIG.EVENT_URL + '" style="display:inline-block;color:#ffffff;text-decoration:none;padding:14px 32px;font-weight:700;font-size:15px;border-radius:999px;">View Event Details</a>' +
    '</td></tr></table></td></tr>' +

    // Social + footer
    '<tr><td class="mobile-padding" style="padding:26px 40px;background-color:' + COLORS.cream + ';border-top:1px solid ' + COLORS.border + ';text-align:center;">' +
    '<p style="color:' + COLORS.muted + ';font-size:13px;margin:0 0 12px 0;font-weight:600;">Connect With Us</p>' +
    '<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>' +
    '<td style="padding:0 8px;"><a href="https://www.facebook.com/evexiawellnesscenter.ph"><img src="https://img.icons8.com/color/48/facebook.png" alt="Facebook" style="width:28px;height:28px;display:block;"></a></td>' +
    '<td style="padding:0 8px;"><a href="https://www.instagram.com/evexiawellnesscenter/"><img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram" style="width:28px;height:28px;display:block;"></a></td>' +
    '</tr></table></td></tr>' +
    '<tr><td class="mobile-padding" style="padding:28px 40px;background-color:#071D14;text-align:center;">' +
    '<p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 6px 0;">Evexia Wellness Center</p>' +
    '<p style="color:#9FB3A8;font-size:13px;margin:0;line-height:1.5;">' + EVENT.ADDRESS + '</p>' +
    '<p style="color:#6F8479;font-size:12px;margin:14px 0 0 0;">© 2026 Evexia Wellness Center. All rights reserved.</p>' +
    '</td></tr>' +

    '</table></td></tr></table></body></html>';
}

function eventInfoCard_(p) {
  const batch = batchDetails_(p.batch);
  const collection = batch
    ? value_(batch.name + ' · ' + batch.time, 'font-weight:600;')
    : EVENT.BATCHES.map(function (b) { return value_(b.name + ' · ' + b.time); }).join('');
  const rows =
    infoRow_('📆', 'Date', value_(EVENT.DATE, 'font-weight:600;'), true) +
    infoRow_('🩸', 'Blood Collection', collection +
      value_('Please arrive on time for your batch.', 'font-size:13px;color:' + COLORS.muted + ';')) +
    infoRow_('🩺', 'FREE Consultation',
      value_(EVENT.CONSULTATION) +
      value_(EVENT.DOCTOR, 'font-weight:600;') +
      value_(EVENT.DOCTOR_TITLE, 'font-size:13px;color:' + COLORS.muted + ';') +
      value_(EVENT.DOCTOR_SPECIALTIES.join(' · '), 'font-size:13px;color:' + COLORS.text + ';')) +
    infoRow_('🔬', 'QMRA & Live Blood Analysis', value_('Holistic wellness screening, also available at the event')) +
    infoRow_('📍', 'Venue',
      value_(EVENT.VENUE, 'font-weight:600;') +
      value_(EVENT.ADDRESS, 'font-size:14px;color:' + COLORS.muted + ';line-height:1.5;'));

  return card_('<table width="100%" cellpadding="0" cellspacing="0" border="0">' + rows + '</table>',
    'border:1px solid ' + COLORS.border + ';');
}

function packageCard_(p) {
  const pkg = packageDetails_(p.package);
  return card_(
    '<h4 style="color:' + COLORS.darkCoral + ';font-size:17px;margin:0 0 14px 0;font-weight:800;">' + pkg.name + '</h4>' +
    label_('Blood Chemistry Tests') +
    '<ul style="margin:10px 0 18px 0;padding-left:20px;">' + pkg.tests + '</ul>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;border:1px solid ' + COLORS.border + ';"><tr><td style="padding:14px 18px;">' +
    '<p style="margin:0 0 6px 0;color:' + COLORS.darkGreen + ';font-size:15px;font-weight:700;">✓ FREE ECG (Electrocardiogram)</p>' +
    '<p style="margin:0;color:' + COLORS.darkGreen + ';font-size:15px;font-weight:700;">✓ FREE Medical Consultation</p>' +
    '</td></tr></table>',
    'border:2px solid ' + COLORS.coral + ';background-color:#FEF1EF;'
  );
}

function reminderList_(items, color) {
  const rows = items.map(function (item, i) {
    return '<tr><td style="padding-bottom:' + (i === items.length - 1 ? '0' : '10px') + ';">' +
      '<p style="margin:0;color:' + color + ';font-size:14px;line-height:1.6;">' + item + '</p></td></tr>';
  }).join('');
  return '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + rows + '</table>';
}

// ============================================
// CONFIRMATION EMAIL (sent automatically on registration)
// ============================================
function createConfirmationEmailHTML(p) {
  const name = esc_(p.name);

  const header =
    '<p style="color:' + COLORS.gold + ';font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin:0 0 8px 0;">Celebrating 3 Years of Wellness</p>' +
    '<h1 style="color:#ffffff;font-size:36px;font-weight:800;margin:0;line-height:1.15;letter-spacing:-0.5px;">3<sup style="font-size:0.5em;">rd</sup> Anniversary <span style="color:' + COLORS.coral + ';">Promo</span></h1>';

  const body =
    '<tr><td class="mobile-padding" style="padding:36px 40px 30px 40px;">' +
    card_(
      '<h2 style="color:' + COLORS.darkGreen + ';font-size:20px;margin:0 0 8px 0;font-weight:800;">✓ You\'re registered!</h2>' +
      '<p style="color:' + COLORS.text + ';font-size:15px;margin:0;line-height:1.6;">Dear <strong>' + name + '</strong>,</p>' +
      '<p style="color:' + COLORS.text + ';font-size:15px;margin:8px 0 0 0;line-height:1.6;">Thank you for pre-registering for Evexia Wellness Center\'s <strong>3rd Anniversary Promo</strong>. Your slot is saved, and we\'re excited to celebrate this milestone with you on <strong>October 16</strong>.</p>',
      'background-color:#EAF7EF;border-left:4px solid ' + COLORS.green + ';'
    ) +
    '</td></tr>' +

    section_(heading_('Your Registration') + card_(
      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
      infoRow_('👤', 'Full Name', value_(name), true) +
      infoRow_('✉️', 'Email Address', value_(esc_(p.email))) +
      infoRow_('📱', 'Contact Number', value_(esc_(p.contact))) +
      (p.address ? infoRow_('🏠', 'Address', value_(esc_(p.address))) : '') +
      infoRow_('🧪', 'Selected Package', value_(esc_(p.package), 'color:' + COLORS.darkCoral + ';font-weight:700;')) +
      (p.batch ? infoRow_('⏰', 'Blood Collection Batch', value_(esc_(p.batch), 'font-weight:700;')) : '') +
      '</table>',
      'background-color:' + COLORS.cream + ';border:1px solid ' + COLORS.border + ';'
    )) +

    section_(heading_('Event Information') + eventInfoCard_(p)) +

    section_(heading_('Package Inclusions') + packageCard_(p)) +

    section_(card_(
      '<h3 style="color:#B45309;font-size:16px;margin:0 0 14px 0;font-weight:800;">Important Reminders</h3>' +
      reminderList_([
        '<strong>• Fast for 10–12 hours:</strong> ' + fastingSteps_(p).join('<br>') + '.',
        '<strong>• No water or other drinks:</strong> after your light meal, have nothing to eat or drink until your blood is collected.',
        '<strong>• Pay on-site:</strong> no payment is needed to pre-register. Payment is collected on the event day.'
      ], '#92400E'),
      'background-color:#FFF7E6;border-left:4px solid ' + COLORS.gold + ';'
    ));

  return emailLayout_('You\'re Registered – Evexia 3rd Anniversary Promo', header, body);
}

// ============================================
// FINAL REMINDER EMAIL (send manually on October 15)
// ============================================
function createReminderEmailHTML(p) {
  const name = esc_(p.name);

  const header =
    '<p style="color:' + COLORS.gold + ';font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin:0 0 8px 0;">Evexia 3<sup>rd</sup> Anniversary Promo</p>' +
    '<h1 style="color:#ffffff;font-size:36px;font-weight:800;margin:0;line-height:1.15;">See you <span style="color:' + COLORS.coral + ';">tomorrow!</span></h1>' +
    '<p style="color:rgba(255,255,255,0.85);font-size:16px;margin:10px 0 0 0;">' + EVENT.DATE + '</p>';

  const body =
    '<tr><td class="mobile-padding" style="padding:36px 40px 30px 40px;">' +
    '<p style="color:' + COLORS.text + ';font-size:15px;margin:0 0 10px 0;line-height:1.6;">Dear <strong>' + name + '</strong>,</p>' +
    '<p style="color:' + COLORS.text + ';font-size:15px;margin:0;line-height:1.6;">This is a friendly reminder that our <strong>3rd Anniversary Promo</strong> is <strong>tomorrow</strong>. Please review the preparation checklist below so your visit goes smoothly.</p>' +
    '</td></tr>' +

    section_(card_(
      '<h3 style="color:' + COLORS.darkCoral + ';font-size:16px;margin:0 0 14px 0;font-weight:800;">⚠️ Preparation Checklist</h3>' +
      reminderList_([
        '<strong>FASTING TONIGHT:</strong> ' + fastingSteps_(p).join('<br>') + '.',
        '<strong>NO WATER OR OTHER DRINKS</strong> after your light meal, until your blood is collected.',
        '<strong>BRING A VALID ID</strong> for verification.',
        '<strong>PREPARE PAYMENT.</strong> Payment is collected on-site on the event day.'
      ], COLORS.text),
      'background-color:#FEF1EF;border-left:4px solid ' + COLORS.coral + ';'
    )) +

    section_(heading_('Tomorrow\'s Schedule') + eventInfoCard_(p)) +

    section_(card_(
      label_('Your Selected Package') +
      value_(esc_(p.package), 'color:' + COLORS.darkCoral + ';font-size:17px;font-weight:800;') +
      value_('Includes FREE ECG and FREE Consultation', 'font-size:14px;color:' + COLORS.darkGreen + ';font-weight:600;'),
      'background-color:' + COLORS.cream + ';border:1px solid ' + COLORS.border + ';'
    )) +

    section_(card_(
      '<h3 style="color:' + COLORS.darkGreen + ';font-size:16px;margin:0 0 12px 0;font-weight:800;">💚 Quick Tips</h3>' +
      reminderList_([
        '• Get a good night\'s sleep tonight',
        '• Wear comfortable clothing with sleeves that roll up easily',
        '• Arrive at least 15 minutes early',
        '• Bring a light snack to eat after your blood extraction'
      ], COLORS.text),
      'background-color:#EAF7EF;border-left:4px solid ' + COLORS.green + ';'
    ));

  return emailLayout_('Tomorrow: Evexia 3rd Anniversary Promo', header, body);
}
