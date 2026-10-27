# Abhishek Sahu — Terminal Portfolio

> An interactive, retro CRT terminal-themed portfolio with a simulated BIOS boot sequence, bash-like command shell, rich command pages, and comprehensive automated test coverage.

[![Tests](https://img.shields.io/badge/tests-54%20passed-33ff88?style=flat-square&logo=node.js)](file:///./test)
[![Deployment](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://portfolio-zeta-steel-24.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-5ee0ff?style=flat-square)](LICENSE)

---

## 🚀 Live Demo

- **Live URL**: [portfolio-zeta-steel-24.vercel.app](https://portfolio-zeta-steel-24.vercel.app/)
- **GitHub Repository**: [github.com/sahuabhishek2953-rgb/portfolio](https://github.com/sahuabhishek2953-rgb)

---

## ✨ Key Features

- **Interactive CLI Shell**:
  - Full command execution with real-time output and prompt navigation.
  - Command history navigation using **ArrowUp** ($\uparrow$) and **ArrowDown** ($\downarrow$).
  - Intelligent **Tab-completion** for commands and aliases.
  - Shortcut support: **Ctrl + L** to clear terminal, **Esc** to return from any page or close modals.
  - Typo / near-match suggestions (e.g. `proj` $\rightarrow$ `projects`).
  - Fun easter eggs (e.g. `sudo hire abhishek`, `sudo`, `exit`).

- **Retro Aesthetics**:
  - CRT scanlines and screen glow effect.
  - Realistic BIOS boot sequence (skippable with any key or tap).
  - Modern dark-mode palette (`#070a08` with terminal greens and cyans).
  - Accessible: respects `prefers-reduced-motion`.

- **Rich Content Views (`~/`)**:
  - `about` / `whoami`: Professional summary, core CS background, categorized skills matrix, and education.
  - `projects`: Featured full-stack applications with live demos, tech stacks, and GitHub links.
  - `hackathons`: Hackathon podium finishes and certificates with interactive lightbox preview.
  - `achievements`: Competitive programming milestones (300+ DSA problems, LeetCode 100-day badge).
  - `certificates`: Verified course certifications (NPTEL Elite, Power BI, etc.) with PDF links.
  - `resume`: Embedded in-browser PDF viewer with one-click download.
  - `contact`: Direct email, phone, LinkedIn, and GitHub links.

- **Zero-Dependency Frontend**:
  - Pure Vanilla ES6+ JavaScript, semantic HTML5, and custom CSS3.
  - Single-page architecture with hash routing (`#/projects`, `#/about`, etc.).

---

## 📂 Project Structure

```text
portfolio/
├── assets/
│   ├── certs/                      # Hackathon & course certificates (JPG / PDF)
│   ├── img/                        # Profile photo & showcase pictures
│   └── Abhishek_Sahu_Resume.pdf    # Full-length downloadable resume
├── test/
│   ├── app.test.js                 # Terminal shell, router, and UI interaction tests
│   ├── data.test.js                # Schema validation & asset existence checks
│   ├── html-css.test.js            # Accessibility, HTML landmarks & CSS theme tests
│   └── server.test.js              # HTTP server MIME types & security tests
├── app.js                          # Terminal engine, command router, and UI renderers
├── data.js                         # Central portfolio content data source
├── index.html                      # Semantic shell with CRT overlay and OpenGraph tags
├── package.json                    # Scripts and devDependencies
├── serve.js                        # Zero-dependency local preview server
├── style.css                       # CRT styling, typography, responsive grids & layout
└── vercel.json                     # Vercel deployment configuration
```

---

## 🧪 Testing

The codebase includes an automated test suite with **54 unit & integration test cases** powered by Node's native test runner (`node:test`) and `jsdom`:

```bash
# Run all tests
npm test
```

### Test Coverage Breakdown

- **Data Integrity (`test/data.test.js`)**: Validates schema, project URLs, and confirms every image/certificate/PDF file exists on disk.
- **HTML & CSS Accessibility (`test/html-css.test.js`)**: Verifies semantic landmarks, accessibility attributes, color tokens, and responsive media queries.
- **Local Server Security (`test/server.test.js`)**: Checks MIME headers, 404 responses, and blocks directory traversal (`403 Forbidden`).
- **Runtime & UI (`test/app.test.js`)**: Tests boot skip, commands, aliases, history, autocomplete, lightbox modal, and back navigation.

---

## 💻 Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sahuabhishek2953-rgb/portfolio.git
   cd portfolio
   ```

2. **Install development dependencies**:
   ```bash
   npm install
   ```

3. **Start local preview server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Customization

All portfolio content is decoupled and stored in [`data.js`](./data.js). To update your details, simply edit:

- `name`, `role`, `location`, `email`, `phone`, `github`, `linkedin`
- `skills`: Add or modify language, frontend, backend, or database categories.
- `projects`: Update project titles, descriptions, live demo links, and GitHub repositories.
- `hackathons` & `certificates`: Add new awards or certificate image paths in `assets/certs/`.

---

## 👤 Author

**Abhishek Sahu**
- **GitHub**: [@sahuabhishek2953-rgb](https://github.com/sahuabhishek2953-rgb)
- **LinkedIn**: [Abhishek Sahu](https://www.linkedin.com/in/abhishek-sahu-104422344)
- **LeetCode**: [Abhishek_788](https://leetcode.com/u/Abhishek_788/)
- **Email**: [sahuabhishek2953@gmail.com](mailto:sahuabhishek2953@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
