const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const htmlSource = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const dataCode = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
const appCode = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

function createEnv(initialHash = "") {
  const dom = new JSDOM(htmlSource, {
    url: `http://localhost:3000/${initialHash}`,
    runScripts: "outside-only"
  });
  const { window } = dom;

  // Polyfills for JSDOM
  window.matchMedia = () => ({ matches: true });
  window.scrollTo = () => {};

  // Execute data.js and app.js inside this DOM context
  dom.window.eval(dataCode);
  dom.window.eval(appCode);

  return dom;
}

describe("App Runtime & UI Interaction Tests", () => {
  it("should start on boot screen when not previously booted", () => {
    const dom = createEnv();
    const doc = dom.window.document;
    const boot = doc.querySelector("#boot");
    assert.strictEqual(boot.hidden, false, "boot view should be visible initially");
  });

  it("should skip boot when any key is pressed or clicked", async () => {
    const dom = createEnv();
    const doc = dom.window.document;
    const boot = doc.querySelector("#boot");
    const terminal = doc.querySelector("#terminal");

    assert.strictEqual(boot.hidden, false);
    // Simulate keydown
    doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Enter" }));

    // Wait for finishBoot setTimeout
    await new Promise((r) => setTimeout(r, 450));

    assert.strictEqual(boot.hidden, true, "boot should now be hidden");
    assert.strictEqual(terminal.hidden, false, "terminal should now be visible");
  });

  it("should bypass boot if already flagged as booted in sessionStorage", () => {
    const dom = new JSDOM(htmlSource, {
      url: "http://localhost:3000/",
      runScripts: "outside-only"
    });
    dom.window.matchMedia = () => ({ matches: true });
    dom.window.scrollTo = () => {};
    dom.window.sessionStorage.setItem("booted", "1");

    dom.window.eval(dataCode);
    dom.window.eval(appCode);

    const doc = dom.window.document;
    assert.strictEqual(doc.querySelector("#boot").hidden, true);
    assert.strictEqual(doc.querySelector("#terminal").hidden, false);
  });

  describe("Terminal Commands and History", () => {
    function setupTerminal() {
      const dom = new JSDOM(htmlSource, {
        url: "http://localhost:3000/",
        runScripts: "outside-only"
      });
      dom.window.matchMedia = () => ({ matches: true });
      dom.window.scrollTo = () => {};
      dom.window.sessionStorage.setItem("booted", "1");
      dom.window.eval(dataCode);
      dom.window.eval(appCode);

      const doc = dom.window.document;
      const cmd = doc.querySelector("#cmd");
      const form = doc.querySelector("#line");
      const out = doc.querySelector("#out");

      function sendCmd(text) {
        cmd.value = text;
        form.dispatchEvent(new dom.window.Event("submit", { cancelable: true }));
      }

      return { dom, doc, cmd, form, out, sendCmd };
    }

    it("should display initial terminal banner and prompt", () => {
      const { out, doc } = setupTerminal();
      assert.match(out.innerHTML, /ABHISHEK\s+SAHU/i);
      assert.match(doc.querySelector(".prompt").textContent, /visitor@abhishek/);
    });

    it("should handle 'help', '?', and 'ls' commands", () => {
      const { sendCmd, out } = setupTerminal();
      sendCmd("help");
      assert.match(out.textContent, /projects/);
      assert.match(out.textContent, /skills/);

      sendCmd("ls");
      assert.match(out.textContent, /certificates/);
    });

    it("should handle 'clear' and 'cls' commands", () => {
      const { sendCmd, out } = setupTerminal();
      assert.ok(out.innerHTML.length > 0);
      sendCmd("clear");
      assert.strictEqual(out.innerHTML, "");
    });

    it("should handle easter eggs and sudo", () => {
      const { sendCmd, out } = setupTerminal();
      sendCmd("sudo hire abhishek");
      assert.match(out.innerHTML, /permission granted/i);

      sendCmd("sudo rm -rf /");
      assert.match(out.innerHTML, /not in the sudoers file/i);

      sendCmd("exit");
      assert.match(out.innerHTML, /There is no escape/i);
    });

    it("should show suggestions for misspelled commands", () => {
      const { sendCmd, out } = setupTerminal();
      sendCmd("projx");
      assert.match(out.innerHTML, /did you mean.*projects/i);

      sendCmd("xyzabc");
      assert.match(out.innerHTML, /command not found.*xyzabc/i);
    });

    it("should navigate history with ArrowUp and ArrowDown", () => {
      const { sendCmd, cmd } = setupTerminal();
      sendCmd("about");
      sendCmd("projects");
      sendCmd("contact");

      assert.strictEqual(cmd.value, "");

      // Press ArrowUp: should show 'contact'
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "ArrowUp" }));
      assert.strictEqual(cmd.value, "contact");

      // Press ArrowUp again: should show 'projects'
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "ArrowUp" }));
      assert.strictEqual(cmd.value, "projects");

      // Press ArrowDown: should return to 'contact'
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.strictEqual(cmd.value, "contact");

      // Press ArrowDown: should clear
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.strictEqual(cmd.value, "");
    });

    it("should autocomplete command on Tab key", () => {
      const { cmd, out } = setupTerminal();
      // Single match: 'res' -> 'resume'
      cmd.value = "res";
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "Tab" }));
      assert.strictEqual(cmd.value, "resume");

      // Multiple matches: 'pro' prints suggestions
      cmd.value = "pro";
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "Tab" }));
      assert.match(out.textContent, /projects/);
    });

    it("should clear screen on Ctrl+L", () => {
      const { cmd, out } = setupTerminal();
      assert.ok(out.innerHTML.length > 0);
      cmd.dispatchEvent(new cmd.ownerDocument.defaultView.KeyboardEvent("keydown", { key: "l", ctrlKey: true }));
      assert.strictEqual(out.innerHTML, "");
    });

    it("should trigger page route when navigating via command", async () => {
      const { dom, sendCmd, doc } = setupTerminal();
      sendCmd("projects");

      await new Promise((r) => setTimeout(r, 300));
      assert.strictEqual(dom.window.location.hash, "#/projects");
      assert.strictEqual(doc.querySelector("#page").hidden, false);
      assert.strictEqual(doc.querySelector("#terminal").hidden, true);
    });
  });

  describe("Page Rendering & Router", () => {
    function loadPage(pageHash) {
      const dom = new JSDOM(htmlSource, {
        url: `http://localhost:3000/#/${pageHash}`,
        runScripts: "outside-only"
      });
      dom.window.matchMedia = () => ({ matches: true });
      dom.window.scrollTo = () => {};
      dom.window.sessionStorage.setItem("booted", "1");
      dom.window.eval(dataCode);
      dom.window.eval(appCode);
      return dom;
    }

    it("should render 'about' page correctly", () => {
      const dom = loadPage("about");
      const doc = dom.window.document;
      assert.strictEqual(doc.querySelector("#page").hidden, false);
      assert.match(doc.querySelector("#crumb").textContent, /~\/about/);
      assert.match(doc.querySelector("#pageBody").textContent, /Abhishek/);
      assert.match(doc.querySelector("#pageBody").textContent, /Full-Stack/);
      assert.match(doc.querySelector("#pageBody").textContent, /Maharana Pratap/);
      assert.match(doc.title, /About/i);
    });

    it("should render 'projects' page with all cards", () => {
      const dom = loadPage("projects");
      const doc = dom.window.document;
      const body = doc.querySelector("#pageBody");
      assert.match(body.textContent, /JobArena/);
      assert.match(body.textContent, /FoodArena/);
      assert.match(body.textContent, /CodeArena/);
      assert.match(body.textContent, /MedNexa/);
      assert.match(body.textContent, /RailYatra/);
      // JobArena has no repo, should render n/a
      assert.match(body.innerHTML, /n\/a/);
    });

    it("should render 'hackathons' page with certificates and badges", () => {
      const dom = loadPage("hackathons");
      const doc = dom.window.document;
      const body = doc.querySelector("#pageBody");
      assert.match(body.textContent, /Spark/);
      assert.match(body.textContent, /Build With Bharat/);
      assert.match(body.textContent, /RIFT/);
      assert.match(body.textContent, /HackVega/);
      assert.ok(body.querySelector("[data-zoom]"));
    });

    it("should render 'achievements' page", () => {
      const dom = loadPage("achievements");
      const doc = dom.window.document;
      const body = doc.querySelector("#pageBody");
      assert.match(body.textContent, /First Runner-up/);
      assert.match(body.textContent, /300\+ DSA/);
      assert.match(body.textContent, /LeetCode 100/);
    });

    it("should render 'certificates' page", () => {
      const dom = loadPage("certificates");
      const doc = dom.window.document;
      const body = doc.querySelector("#pageBody");
      assert.match(body.textContent, /Programming in Java/);
      assert.match(body.textContent, /Power BI/);
      assert.match(body.textContent, /Marketing/);
      assert.match(body.textContent, /LeetCode/);
      assert.ok(body.querySelector("a[href*='.pdf']"));
    });

    it("should render 'resume' page with download button and iframe", () => {
      const dom = loadPage("resume");
      const doc = dom.window.document;
      const body = doc.querySelector("#pageBody");
      assert.ok(body.querySelector("a[download]"));
      assert.ok(body.querySelector("iframe[src*='Resume.pdf']"));
    });

    it("should render 'contact' page with phone and email links", () => {
      const dom = loadPage("contact");
      const doc = dom.window.document;
      const body = doc.querySelector("#pageBody");
      assert.ok(body.querySelector("a[href^='mailto:']"));
      assert.ok(body.querySelector("a[href^='tel:']"));
    });

    it("should support navigation aliases in URL hash", () => {
      // test alias 'certs' -> certificates
      const dom = loadPage("certs");
      const doc = dom.window.document;
      assert.match(doc.querySelector("#crumb").textContent, /certificates/);

      // test alias 'cv' -> resume
      const dom2 = loadPage("cv");
      assert.match(dom2.window.document.querySelector("#crumb").textContent, /resume/);

      // test alias 'skills' -> about
      const dom3 = loadPage("skills");
      assert.match(dom3.window.document.querySelector("#crumb").textContent, /about/);
    });

    it("should navigate back to terminal via back button", () => {
      const dom = loadPage("projects");
      const doc = dom.window.document;
      const backBtn = doc.querySelector("#backBtn");
      backBtn.dispatchEvent(new dom.window.MouseEvent("click"));
      assert.strictEqual(dom.window.location.hash, "#/");
    });

    it("should return to terminal when pressing Escape", () => {
      const dom = loadPage("projects");
      const doc = dom.window.document;
      doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape" }));
      assert.strictEqual(dom.window.location.hash, "#/");
    });

    it("should open and close lightbox when clicking zoomable thumbnails", () => {
      const dom = loadPage("certificates");
      const doc = dom.window.document;
      const lightbox = doc.querySelector("#lightbox");
      const zoomImg = doc.querySelector("[data-zoom]");

      assert.strictEqual(lightbox.hidden, true);

      // Click the zoomable image
      zoomImg.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
      assert.strictEqual(lightbox.hidden, false);
      assert.ok(lightbox.querySelector("img").src.includes(zoomImg.dataset.zoom));

      // Click lightbox to close
      lightbox.dispatchEvent(new dom.window.MouseEvent("click"));
      assert.strictEqual(lightbox.hidden, true);

      // Open again and close via Escape
      zoomImg.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
      assert.strictEqual(lightbox.hidden, false);
      doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape" }));
      assert.strictEqual(lightbox.hidden, true);
    });
  });
});
