<div align="center">

# Puso ko, Mahal ko!

### Heart Month Health Screening Landing Page

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success?style=flat-square&logo=github)](https://evexiasys-dev.github.io/puso-ko-mahal-ko/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*A responsive, mobile-friendly landing page for Evexia Wellness Center's Heart Month Health Screening event.*

[View Demo](https://evexiasys-dev.github.io/puso-ko-mahal-ko/) • [Report Bug](../../issues) • [Request Feature](../../issues)

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

This landing page was developed for **Evexia Wellness Center** to promote and manage registrations for the Heart Month Health Screening event scheduled for **February 15, 2026**. The site provides comprehensive event information, package details, and a seamless registration experience.

### Key Objectives

- 📢 Announce the Heart Month Health Screening event
- 📝 Collect pre-registrations through an integrated form
- 📱 Deliver a mobile-first, accessible user experience
- 🔧 Maintain simplicity for easy content updates by non-developers

---

## ✨ Features

- ✅ **Fully Responsive Design** - Optimized for mobile, tablet, and desktop
- ✅ **Interactive Registration Form** - Real-time validation with Google Sheets integration
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

```
puso-ko-mahal-ko/
│
├── index.html              # Main HTML file
├── README.md               # Project documentation
│
├── css/
│   └── style.css          # All project styles
│
├── js/
│   └── main.js            # JavaScript functionality
│
└── assets/
    └── images/
        ├── favicon.png         # Browser tab icon
        ├── EWC-logo.png        # Evexia Wellness Center logo
        ├── header-bg.png       # Hero section background
        ├── qualicheck.png      # Partnership logo
        └── preview.png         # Social media preview image
```

---

## 🌐 Deployment

### GitHub Pages

1. **Push your changes to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Navigate to repository **Settings**
   - Click **Pages** in the sidebar
   - Under **Source**, select branch `main` and folder `/ (root)`
   - Click **Save**

3. **Access your site**
   - Your site will be available at: `https://[username].github.io/puso-ko-mahal-ko/`
   - Deployment typically takes 2-5 minutes

### Alternative Hosting Options

- **Netlify** - Drag and drop deployment
- **Vercel** - Git-based deployment
- **Cloudflare Pages** - Fast global CDN
- **AWS S3 + CloudFront** - Enterprise solution

---

## ⚙️ Configuration

### Google Apps Script Integration

The registration form submits data to Google Sheets via Apps Script.

#### Setup Instructions

1. **Create a Google Spreadsheet** with the following columns:
   ```
   Name | Age | Sex | Status | Email | Address | Contact | Package | Timestamp
   ```

2. **Create an Apps Script**
   - Open your spreadsheet
   - Click **Extensions** → **Apps Script**

3. **Deploy as Web App**
   - Click **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the **Web app URL**

4. **Update Form Endpoint**
   - Open `js/main.js`
   - Replace the `scriptURL` value with your deployment URL:
   ```javascript
   const scriptURL = 'YOUR_APPS_SCRIPT_URL_HERE';
   ```

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

**Made with 💚 for the Heart Month**

*"Be Kind to Your Heart!"*

</div>