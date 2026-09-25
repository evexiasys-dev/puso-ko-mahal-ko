<div align="center">

# Evexia 3rd Anniversary Promo

### Health Screening Landing Page (formerly "Puso ko, Mahal ko!")

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Live-success?style=flat-square&logo=cloudflare)](https://evexia-events.evexia-sys.workers.dev/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*A responsive, mobile-friendly landing page for Evexia Wellness Center's 3rd Anniversary Promo health screening.*

[View Site](https://evexia-events.evexia-sys.workers.dev/) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Configuration](#configuration)
  - [Google Apps Script Integration](#google-apps-script-integration)
  - [Social Media Meta Tags](#social-media-meta-tags)
- [Optimization Guidelines](#optimization-guidelines)
- [Contributing](#contributing)
- [Security & Privacy](#security--privacy)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

This landing page promotes and manages pre-registrations for **Evexia Wellness Center's 3rd Anniversary Promo** on **October 16, 2026 (Friday), 7 AM – 12 PM**, in partnership with QualiCheck Diagnostic Clinic. It was first built for the Heart Month Health Screening (February 15, 2026) and reused for this event.

### Key Objectives

- 📢 Announce the 3rd Anniversary Promo event
- 📝 Collect pre-registrations through an integrated form
- 📱 Deliver a mobile-first, accessible user experience
- 🔧 Maintain simplicity for easy content updates by non-developers

---

## ✨ Features

- ✅ **Fully Responsive Design** - Optimized for mobile, tablet, and desktop
- ✅ **Interactive Registration Form** - Real-time validation with Google Sheets integration
- ✅ **Automatic Confirmation Email** - Sent to the patient's email as soon as they register
- ✅ **Smooth Animations** - Scroll effects and transitions for enhanced UX
- ✅ **SEO Optimized** - Complete meta tags for search engines and social media
- ✅ **Embedded Google Maps** - Interactive location finder
- ✅ **Social Media Integration** - Direct links to Facebook and Instagram
- ✅ **Zero Dependencies** - Pure HTML/CSS/JS with minimal external libraries
- ✅ **Fast Loading** - Optimized assets and deferred JavaScript

---

## 🛠️ Built With

- **HTML5** - Semantic markup structure
- **CSS3** - Custom styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - Form handling and interactive elements
- **Google Fonts** - Plus Jakarta Sans typography
- **Font Awesome 6** - Icon library
- **Google Apps Script** - Backend form processing
- **Google Maps Embed API** - Location mapping

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)
- Git installed on your machine

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/evexiasys-dev/puso-ko-mahal-ko.git
   cd puso-ko-mahal-ko
   ```

2. **Verify project structure**
   ```bash
   ls -la
   ```

### Local Development

#### Option 1: Python HTTP Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then navigate to `http://localhost:8000` in your browser.

#### Option 2: VS Code Live Server

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click on `index.html`
3. Select **"Open with Live Server"**

#### Option 3: Node.js HTTP Server

```bash
npx http-server -p 8000
```

---

## 📁 Project Structure

Working files for the current event sit at the top level; everything old lives in `BACKUP/`.

```
puso-ko-mahal-ko/
├── index.html                  # Event page + pre-registration form
├── privacypolicy.html          # Privacy policy
├── css/style.css               # All site styles
├── js/
│   ├── main.js                 # Navbar, form logic (names, birthday/age, barangay), submission
│   └── ph-address-book.js      # Barangay suggestions (copied from the QualiCheck CMS)
├── assets/images/
│   ├── EWC-logo.png            # Evexia logo (hero)
│   ├── favicon.png             # Browser tab icon / navbar logo
│   ├── qualicheck-partner.png  # Partner logo (site + emails)
│   ├── nanucell-partner.png    # Partner logo (site + emails)
│   └── preview.png             # Social media share image
├── email-confirmation/
│   ├── anniversary-apps-script.gs  # Google Apps Script: saves registrations, sends the emails
│   ├── build-previews.js           # Renders the two emails below from the script
│   ├── preview-confirmation.html   # Confirmation email (sent automatically on registration)
│   └── preview-reminder.html       # Reminder email (sent from the sheet menu on Oct 15)
├── wrangler.jsonc + .assetsignore  # Cloudflare deploy config (what gets published)
└── BACKUP/
    ├── B1.0/                   # February 2026 Heart Month site and its email scripts
    └── source-assets/          # Full-size originals of images no longer used directly
```

The email templates live inside `anniversary-apps-script.gs` (`createConfirmationEmailHTML`,
`createReminderEmailHTML`). After editing them, run `node email-confirmation/build-previews.js`
to refresh the preview files, then paste the script into Apps Script and deploy a new version.

---

## 🌐 Deployment

The public site is **https://evexia-events.evexia-sys.workers.dev**, a Cloudflare Worker serving
static assets (Evexia's Cloudflare account). Workers Builds deploys every push to `main`
by running `npx wrangler deploy`.

- `wrangler.jsonc` names the Worker (`evexia-events`) and serves the repo root as static assets.
- `.assetsignore` keeps `BACKUP/`, `email-confirmation/`, this README and config files off the public site.
  Add any new non-website file or folder there.

### Pushing from this Mac

The remote is set to push as the `ranselcrackers` collaborator account:

```bash
git remote set-url origin https://ranselcrackers@github.com/evexiasys-dev/puso-ko-mahal-ko.git
```

---

## ⚙️ Configuration

### Google Apps Script Integration

The form posts to a Google Apps Script web app (URL in `js/main.js`). The script lives in
[`email-confirmation/anniversary-apps-script.gs`](email-confirmation/anniversary-apps-script.gs) and:

- saves each registration to the **"Oct 16 Anniversary"** tab (created automatically with the columns in `CONFIG.HEADERS`: first/middle/last name, suffix, birthday, age, sex, status, email, contact, barangay, city, province, package)
- skips the email for patients who ticked **No email** (marked "No Email" in the sheet)
- **automatically emails the confirmation** to the patient and records the time in **Confirmation Sent**
- adds a **📧 Send Emails** menu to the sheet for resends and the **day-before reminder** (send on October 15)

#### Setting up the script

1. Open the event's Google Sheet → **Extensions → Apps Script**
2. Paste `anniversary-apps-script.gs` and **Save**
3. Run the **`setup`** function once and approve the permissions (Sheets + send email)
4. **Deploy → New deployment → Web app**, Execute as: **Me**, Who has access: **Anyone**
5. Put the web app `/exec` URL in `js/main.js` (`scriptURL`)
6. For later code changes use **Manage deployments → ✏️ Edit → New version**, so the URL stays the same
7. Submit a test registration with your own email address

> Daily email limit: ~100 recipients/day on a free Gmail account, 1,500 on Google Workspace.

The February event's email scripts are kept in `BACKUP/B1.0/email-confirmation/`.

### Social Media Meta Tags

For optimal social media sharing, update Open Graph images to use absolute URLs:

```html
<!-- Update in index.html -->
<meta property="og:image" content="https://raw.githubusercontent.com/evexiasys-dev/puso-ko-mahal-ko/main/assets/images/preview.png">
<meta name="twitter:image" content="https://raw.githubusercontent.com/evexiasys-dev/puso-ko-mahal-ko/main/assets/images/preview.png">
```

**Test your social previews:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## 🎨 Optimization Guidelines

### Performance

- **Image Optimization**
  - Convert PNG to WebP for 25-35% size reduction
  - Use image compression tools like TinyPNG or ImageOptim
  - Add `width` and `height` attributes to prevent layout shift

- **CSS/JS Optimization**
  - Minify CSS and JavaScript for production
  - Consider critical CSS inlining for above-the-fold content
  - Use async/defer for non-critical scripts

### Accessibility

- ✅ All images have descriptive `alt` attributes
- ✅ Form labels are properly associated with inputs
- ✅ Color contrast meets WCAG AA standards
- ⚠️ Consider adding `aria-labels` for icon-only buttons
- ⚠️ Implement skip-to-content link for keyboard navigation

### SEO

- ✅ Semantic HTML structure
- ✅ Meta descriptions and keywords
- ✅ Open Graph and Twitter Card tags
- ⚠️ Consider adding JSON-LD structured data for events
- ⚠️ Implement XML sitemap if scaling to multiple pages

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Keep changes focused and atomic
- Write clear, descriptive commit messages
- Add screenshots for visual changes
- Test across multiple browsers and devices
- Update documentation as needed

---

## 🔒 Security & Privacy

- 🚫 **Never commit API keys** or sensitive credentials to the repository
- ✅ All form data is transmitted securely via HTTPS
- ✅ Google Apps Script endpoint uses server-side validation
- ⚠️ Ensure compliance with data protection regulations (GDPR, PDPA)
- ⚠️ Implement proper data retention and deletion policies
- ⚠️ Consider adding a privacy policy and terms of service

**Data Collection Notice:** This form collects personal information. Ensure participants are informed about data usage and storage.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

```
SPDX-License-Identifier: MIT
```

---

## 📞 Contact

**Evexia Wellness Center**
- Facebook: [@evexiawellnesscenter.ph](https://www.facebook.com/evexiawellnesscenter.ph)
- Instagram: [@evexiawellnesscenter](https://www.instagram.com/evexiawellnesscenter/)

**Project Developer**
- Ransel Sumatra - [@ranselberry](https://www.instagram.com/ranselberry/)

**Repository**
- GitHub: [evexiasys-dev/puso-ko-mahal-ko](https://github.com/evexiasys-dev/puso-ko-mahal-ko)

---

## 🙏 Acknowledgments

- [Google Fonts](https://fonts.google.com/) - Plus Jakarta Sans typeface
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Google Maps Platform](https://developers.google.com/maps) - Embedded maps
- QualiCheck Mobile Laboratory - Event partnership
- Evexia Wellness Center - Event host and sponsor

---

<div align="center">

**Made with 💚 for Evexia's 3rd Anniversary**

</div>