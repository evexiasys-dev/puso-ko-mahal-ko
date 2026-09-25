// Renders the confirmation and reminder emails from anniversary-apps-script.gs into
// HTML files you can open in a browser. The .gs file is the source of truth; run this
// again after editing it:  node email-confirmation/build-previews.js
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, 'anniversary-apps-script.gs'), 'utf8');
const { createConfirmationEmailHTML, createReminderEmailHTML } =
  new Function(source + '\nreturn { createConfirmationEmailHTML, createReminderEmailHTML };')();

const sample = {
  name: 'Juan Santos Dela Cruz',
  email: 'juan.delacruz@gmail.com',
  contact: '09171234567',
  address: 'Dita, Santa Rosa, Laguna',
  package: 'Package B (850)'
};

fs.writeFileSync(path.join(__dirname, 'preview-confirmation.html'), createConfirmationEmailHTML(sample));
fs.writeFileSync(path.join(__dirname, 'preview-reminder.html'), createReminderEmailHTML(sample));
console.log('Wrote preview-confirmation.html and preview-reminder.html');
