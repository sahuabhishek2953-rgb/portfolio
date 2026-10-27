const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

describe("HTML and CSS Structure & Accessibility Tests", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");

  describe("index.html Structure", () => {
    it("should have <!doctype html> and <html lang=\"en\">", () => {
      assert.match(html, /<!doctype html>/i);
      assert.match(html, /<html\s+lang=["']en["']/i);
    });

    it("should have charset and viewport meta tags", () => {
      assert.match(html, /<meta\s+charset=["']utf-8["']/i);
      assert.match(html, /<meta\s+name=["']viewport["']/i);
    });

    it("should have descriptive title and meta description", () => {
      assert.match(html, /<title>.+<\/title>/);
      assert.match(html, /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i);
    });

    it("should link to fonts, style.css, data.js, and app.js", () => {
      assert.match(html, /href=["']style\.css(\?v=\d+)?["']/);
      assert.match(html, /src=["']data\.js(\?v=\d+)?["']/);
      assert.match(html, /src=["']app\.js(\?v=\d+)?["']/);
    });

    it("should contain all mandatory element IDs for app.js interaction", () => {
      const requiredIds = [
        "boot", "bootLog", "bootBar",
        "terminal", "termBody", "out", "line", "cmd",
        "page", "pagebar", "crumb", "pageBody", "backBtn",
        "lightbox"
      ];
      for (const id of requiredIds) {
        const hasId = html.includes(`id="${id}"`) || html.includes(`class="${id}"`);
        assert.ok(hasId, `index.html must contain id or class "${id}"`);
      }
    });

    it("should ensure input and buttons have accessible labels", () => {
      assert.match(html, /aria-label=["']Terminal command["']/);
      assert.match(html, /aria-label=["']Close["']/);
      assert.match(html, /<label\s+for=["']cmd["']/);
    });
  });

  describe("style.css Rules & Theme", () => {
    it("should define core theme CSS variables", () => {
      const requiredVars = ["--bg", "--panel", "--line", "--fg", "--dim", "--green", "--amber", "--cyan", "--red", "--mono", "--serif"];
      for (const v of requiredVars) {
        assert.ok(css.includes(v + ":"), `style.css must define variable ${v}`);
      }
    });

    it("should include responsive media queries", () => {
      assert.match(css, /@media\s*\([^)]*max-width:\s*700px\)/);
      assert.match(css, /@media\s*\([^)]*max-width:\s*820px\)/);
    });

    it("should include accessibility prefers-reduced-motion media query", () => {
      assert.match(css, /@media\s*\([^)]*prefers-reduced-motion:\s*reduce\)/);
    });

    it("should contain styling for CRT overlay, terminal, and cards", () => {
      assert.match(css, /\.crt/);
      assert.match(css, /\.win/);
      assert.match(css, /\.card/);
      assert.match(css, /\.chip/);
      assert.match(css, /\.pdfwrap/);
    });
  });
});
