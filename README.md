# Puso ko, Mahal ko! — Heart Month Health Screening Landing Page

A lightweight, responsive landing page for Evexia Wellness Center's Heart Month Health Screening.  
This project is a static website (HTML/CSS/JS) designed to be served via GitHub Pages or any static host.

Live demo
- GitHub Pages (if enabled): https://evexiasys-dev.github.io/puso-ko-mahal-ko/

Why this repo exists
- Announce and collect pre-registrations for the Heart Month Health Screening (Feb 15, 2026).
- Provide an attractive, mobile-friendly layout with clear event details, packages, and a registration form.
- Keep structure small and maintainable so non-developers can update text, images, and event details easily.

Key features
- Responsive hero, packages, event details, registration form, and embedded map.
- Externalized CSS and JavaScript for maintainability (css/style.css and js/main.js).
- Assets organized under `assets/images/` for clarity.
- Form posts to a Google Apps Script endpoint (changeable).
- Simple, dependency-free build — only uses Google Fonts and Font Awesome as CDNs.

Project structure
- index.html — Main site HTML
- css/
  - style.css — All project CSS (extracted from the previous inline style)
- js/
  - main.js — All JavaScript (form handling, navbar scroll, smooth scroll)
- assets/
  - images/
    - favicon.png
    - EWC-logo.png
    - header-bg.png
    - qualicheck.png
    - preview.png
- README.md — This file

Quick start (local)
1. Clone the repo:
   ```
   git clone https://github.com/evexiasys-dev/puso-ko-mahal-ko.git
   cd puso-ko-mahal-ko
   ```

2. Serve locally with a simple HTTP server (recommended; some browser features behave differently when opening the file directly):
   - Python 3:
     ```
     python -m http.server 8000
     ```
     Then open http://localhost:8000 in your browser.

   - Or use VS Code Live Server extension.

3. Edit files:
   - Styles: `css/style.css`
   - JavaScript: `js/main.js`
   - Images: `assets/images/` (replace files there; keep filenames or update references)
   - Content / markup: `index.html`

Updating assets / reorganizing (example commands)
If you need to move image files from project root into the new `assets/images/` folder:

```bash
mkdir -p assets/images
git mv favicon.png assets/images/favicon.png
git mv EWC-logo.png assets/images/EWC-logo.png
git mv header-bg.png assets/images/header-bg.png
git mv qualicheck.png assets/images/qualicheck.png
git mv preview.png assets/images/preview.png
git add .
git commit -m "chore: move images into assets/images and reorganize project"
git push origin main
```

Deployment (GitHub Pages)
1. Push your changes to GitHub.
2. In the repository settings → Pages, choose branch `main` and folder `/ (root)` (or `gh-pages` if you use that branch).
3. Wait a few minutes for the site to be published. The URL will be displayed in GitHub Pages settings.

Open Graph images and social previews
- Social crawlers often require an absolute URL for OG images (not a relative path). You can use a raw GitHub URL like:
  ```
  https://raw.githubusercontent.com/<owner>/<repo>/<branch>/assets/images/preview.png
  ```
  Replace `<owner>`, `<repo>`, and `<branch>` with your repository values. Update the `og:image` and `twitter:image` meta tags in `index.html` to point to the absolute URL for reliable previews.

Form (Google Apps Script) notes
- The registration form posts to a Google Apps Script web app via the `scriptURL` variable in `js/main.js`.
- To change the destination:
  1. Open your Apps Script project (or create one).
  2. Deploy as a Web App (execute as: you; who has access: anyone).
  3. Replace the `scriptURL` value in `js/main.js` with the new endpoint.
- Important: always validate and sanitize form data on the server side (inside Apps Script) — client-side checks are only UX helpers.

Accessibility & SEO recommendations
- Link each `<label>` to inputs with `for="id"` and give inputs an `id` for better screen-reader support.
- Add descriptive `alt` attributes to all images (already present but double-check for clarity).
- Consider adding structured data (JSON-LD) for event details to improve search result appearance.
- Ensure color contrast meets WCAG AA for readability across sections.

Performance & optimization tips
- Compress images (PNG → optimized PNG or WebP) before committing. This reduces load time.
- Consider adding width and height attributes for images to reduce layout shift.
- Preload the main font or critical assets if you need faster first paint (use sparingly).
- The site already defers JS and uses external CSS file for caching.

Troubleshooting
- Icons not appearing? Ensure Font Awesome CDN link is reachable. Try using the latest CDN URL if needed.
- Images not visible? Confirm files exist under `assets/images/` and the filenames match.
- Google Maps iframe not loading? Check the embed URL and Google’s embed policy for referrer restrictions.
- OG image not appearing on social sites? Use the absolute raw GitHub URL and test with the Facebook/Twitter card validator tools.

Contributing
- PRs are welcome for content corrections, image improvements, accessibility fixes, or simple UI improvements.
- For code changes:
  - Fork → branch (feature/...) → commit → PR with description.
  - Keep changes small and focused. Add screenshots for visual changes.

Suggested Git workflow (example)
```bash
git checkout -b feature/update-styles
# make edits
git add css/style.css
git commit -m "style: tweak hero spacing and button styles"
git push origin feature/update-styles
# open a PR on GitHub
```

Security & privacy
- Do not embed private API keys or secrets in the client-side code.
- If collecting personal data via the registration form, ensure proper data handling, consent, and storage policies are followed (Apps Script spreadsheets are a common storage — secure access and retention policies are recommended).

License
- Place your preferred license here (e.g., MIT). Example:
  ```
  SPDX-License-Identifier: MIT
  ```
  Or add a `LICENSE` file at repo root.

Contact / Credits
- Website crafted by Ransel Sumatra — https://www.instagram.com/ranselberry/
- Maintainer / repo owner: evexiasys-dev (GitHub)
- For questions about form endpoints or data handling, edit `js/main.js` or contact the maintainer.

---

If you want, I can:
- Create this README.md and open a pull request with the change.
- Add a CONTRIBUTING.md with code style and PR checklist.
- Produce an accessibility checklist and auto-fix suggestions.

Which of those would you like next?
