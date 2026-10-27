(() => {
const D = window.DATA;
const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => (s == null ? "" : String(s).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
const safe = (fn, d) => { try { return fn(); } catch { return d; } };

const views = { boot: $("#boot"), terminal: $("#terminal"), page: $("#page") };
function show(name) {
  for (const k in views) views[k].hidden = k !== name;
  window.scrollTo(0, 0);
}

/* ================= BOOT ================= */
const bootLines = [
  ["", "BIOS v2.6 — ABHISHEK-OS firmware", "dim"],
  ["", "Checking memory ............ 16384 MB", "ok"],
  ["", "Detecting devices ........... keyboard, display, network", "ok"],
  ["", "Mounting /dev/portfolio ..... done", "ok"],
  ["", "Loading kernel modules:", ""],
  ["", "  [  OK  ] react", "ok"],
  ["", "  [  OK  ] node", "ok"],
  ["", "  [  OK  ] postgres / mongo", "ok"],
  ["", "  [  OK  ] socket.io", "ok"],
  ["", "  [ WARN ] coffee level low", "warn"],
  ["", "Starting terminal service ... ", ""],
  ["", "Welcome, visitor.", "ok"]
];
let bootDone = false, bootTimer;
function runBoot() {
  show("boot");
  const log = $("#bootLog"), fill = $("#bootBar i");
  let i = 0;
  const step = () => {
    if (bootDone) return;
    if (i >= bootLines.length) return finishBoot();
    const [, text, cls] = bootLines[i++];
    log.append(el("div", cls, esc(text) || "&nbsp;"));
    fill.style.width = Math.round((i / bootLines.length) * 100) + "%";
    bootTimer = setTimeout(step, 150 + Math.random() * 190);
  };
  step();
}
function finishBoot() {
  if (bootDone) return;
  bootDone = true;
  clearTimeout(bootTimer);
  safe(() => sessionStorage.setItem("booted", "1"));
  setTimeout(() => { route(); }, 350);
}
["keydown", "click", "touchstart"].forEach((ev) =>
  document.addEventListener(ev, () => { if (!bootDone && !views.boot.hidden) finishBoot(); }, { passive: true }));

/* ================= TERMINAL ================= */
const out = $("#out"), cmd = $("#cmd"), body = $("#termBody");
const history = []; let hIdx = 0;

const PAGES = {
  about:        { title: "About",         desc: "who I am, skills, education" },
  projects:     { title: "Projects",      desc: "all projects with GitHub + live links" },
  hackathons:   { title: "Hackathons",    desc: "hackathons & competitions" },
  achievements: { title: "Achievements",  desc: "wins, badges, milestones" },
  certificates: { title: "Certificates",  desc: "courses & certifications" },
  resume:       { title: "Resume",        desc: "view my resume right here" },
  contact:      { title: "Contact",       desc: "email, phone, socials" }
};
const ALIASES = {
  project: "projects", proj: "projects", work: "projects",
  hackathon: "hackathons", hack: "hackathons",
  achievement: "achievements", awards: "achievements", wins: "achievements",
  certificate: "certificates", certs: "certificates", cert: "certificates",
  me: "about", whoami: "about", "about me": "about", "about project": "projects", "about projects": "projects",
  skills: "about", education: "about", cv: "resume"
};

function print(html, cls = "") { const r = el("div", "row " + cls, html); out.append(r); return r; }
function scrollEnd() { body.scrollTop = body.scrollHeight; }
function chip(c) { return `<button class="chip" data-cmd="${c}">${c}</button>`; }

function banner() {
  print(`<pre class="ascii">╔══════════════════════════════════════╗
║   A B H I S H E K   S A H U   v1.0   ║
║   portfolio terminal · tty1          ║
╚══════════════════════════════════════╝</pre>`);
  print(`<span class="g">${esc(D.name)}</span> <span class="d">—</span> ${esc(D.role)}`);
  print(`<span class="d">Type a command and press Enter — or just click one below. Type</span> ${chip("help")} <span class="d">to list everything.</span>`, "gap");
  helpList(true);
}
function helpList(compact) {
  const rows = Object.entries(PAGES).map(([k, v]) => `${chip(k)}<span class="d">${esc(v.desc)}</span>`).join("");
  const extra = [["clear", "clear the terminal"], ["help", "show this list"]]
    .map(([k, d]) => `${chip(k)}<span class="d">${d}</span>`).join("");
  out.append(el("div", "cmdlist", rows + extra));
  if (!compact) print(`<span class="d">Tips: ↑/↓ history · Tab autocomplete · Esc returns from any page · aliases like</span> project<span class="d">,</span> skills<span class="d">,</span> certs <span class="d">work too.</span>`);
}

function run(raw) {
  const text = raw.trim();
  print(`<span class="g">visitor@abhishek:~$</span> ${esc(text)}`, "gap");
  if (!text) return;
  history.push(text); hIdx = history.length;
  const key = text.toLowerCase().replace(/\s+/g, " ");
  const name = PAGES[key] ? key : ALIASES[key] || key;

  if (name === "help" || name === "?" || name === "ls") { helpList(false); }
  else if (name === "clear" || name === "cls") { out.innerHTML = ""; }
  else if (PAGES[name]) {
    print(`<span class="d">Opening</span> <span class="a">${name}</span><span class="d">…</span>`);
    setTimeout(() => {
      if (location.hash === "#/" + name) route();
      else location.hash = "#/" + name;
    }, 220);
  }
  else if (key === "sudo hire abhishek" || key === "sudo hire me") {
    print(`<span class="g">[sudo] permission granted. Offer letter drafted. 🎉</span> Try ${chip("contact")}`);
  }
  else if (key === "sudo" || key.startsWith("sudo ")) { print(`<span class="r">visitor is not in the sudoers file. This incident will be reported.</span>`); }
  else if (key === "exit") { print(`<span class="d">There is no escape. Try</span> ${chip("projects")}`); }
  else {
    const near = Object.keys(PAGES).find((p) => p.startsWith(key.slice(0, 3)) && key.length >= 3);
    print(`<span class="r">command not found:</span> ${esc(text)}${near ? ` <span class="d">— did you mean</span> ${chip(near)}<span class="d">?</span>` : ` <span class="d">— type</span> ${chip("help")}`}`);
  }
  scrollEnd();
}

$("#line").addEventListener("submit", (e) => { e.preventDefault(); const v = cmd.value; cmd.value = ""; run(v); });
out.addEventListener("click", (e) => { const b = e.target.closest("[data-cmd]"); if (b) run(b.dataset.cmd); });
body.addEventListener("click", () => { if (!getSelection().toString()) cmd.focus(); });
cmd.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx > 0) cmd.value = history[--hIdx]; }
  else if (e.key === "ArrowDown") { e.preventDefault(); cmd.value = hIdx < history.length - 1 ? history[++hIdx] : (hIdx = history.length, ""); }
  else if (e.key === "Tab") {
    e.preventDefault();
    const v = cmd.value.toLowerCase();
    if (!v) return;
    const all = [...new Set([...Object.keys(PAGES), ...Object.keys(ALIASES), "help", "clear"])];
    const m = all.filter((c) => c.startsWith(v));
    if (m.length === 1) cmd.value = m[0];
    else if (m.length > 1) print(`<span class="d">${m.join("   ")}</span>`);
    scrollEnd();
  }
  else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
});

let bannerShown = false;
function showTerminal() {
  show("terminal");
  if (!bannerShown) { banner(); bannerShown = true; }
  scrollEnd();
  if (matchMedia("(hover:hover)").matches) cmd.focus({ preventScroll: true });
}

/* ================= PAGES ================= */
const linkBtn = (href, label, cls = "") =>
  href ? `<a class="btn ${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`
       : `<span class="btn off" title="Not available">${label} — n/a</span>`;
const pageBtn = (name, label, cls = "") => `<a class="btn ${cls}" href="#/${name}">${label}</a>`;
const pills = (a) => `<div class="pills">${a.map((s) => `<span class="pill">${esc(s)}</span>`).join("")}</div>`;
const head = (cmdName, sub) => `<h1>${cmdName}</h1><p class="sub">${sub}</p>`;

const renderers = {
  about() {
    const skills = Object.entries(D.skills).map(([k, v]) =>
      `<div class="skillrow"><b>${esc(k)}</b><span>${v.map(esc).join('<i> / </i>')}</span></div>`).join("");
    const edu = D.education.map((e) => `<div class="edu"><div><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p></div><div class="edu-r"><span>${esc(e.years)}</span><span>${esc(e.score)}</span></div></div>`).join("");
    const stats = [
      ["300+", "DSA problems solved"],
      [String(D.projects.length), "projects shipped & deployed"],
      ["1st", "runner-up, Spark 2026"],
      [D.hackathons.length + "+", "hackathons & competitions"]
    ].map(([n, l]) => `<div class="stat"><strong>${n}</strong><span>${l}</span></div>`).join("");
    return `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">// hello, world</p>
          <div class="display">I'm <em>Abhishek</em>.<br>I build full-stack<br>things that ship.</div>
          <p class="lead">${esc(D.summary)}</p>
          <div class="links">${pageBtn("resume", "Resume →")}${linkBtn(D.github, "GitHub ↗", "alt")}${linkBtn(D.linkedin, "LinkedIn ↗", "alt")}</div>
        </div>
        <figure class="portrait">
          <div class="frame">
            <img src="${D.photo}" alt="Portrait of ${esc(D.name)}">
            <i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>
          </div>
          <span class="float f1">B.Tech CSE · '27</span>
          <span class="float f2">${esc(D.location.split(",")[0])}, IN</span>
          <figcaption>abhishek_sahu.jpg</figcaption>
        </figure>
      </section>

      <div class="stats">${stats}</div>

      <h2><span>01</span> whoami</h2>
      <div class="fetch">
        <div class="fh">abhishek<em>@</em>portfolio</div>
        <dl>
          <dt>role</dt><dd>${esc(D.role)}</dd>
          <dt>school</dt><dd>${esc(D.education[0].school)}</dd>
          <dt>based in</dt><dd>${esc(D.location)}</dd>
          <dt>daily stack</dt><dd>React · Node.js · PostgreSQL / MongoDB</dd>
          <dt>languages</dt><dd>${D.skills.Languages.map(esc).join(" · ")}</dd>
          <dt>leetcode</dt><dd>${esc(D.leetcode)}</dd>
          <dt>email</dt><dd><a href="mailto:${D.email}">${D.email}</a></dd>
        </dl>
      </div>

      <h2><span>02</span> skills</h2>${skills}
      <h2><span>03</span> education</h2>${edu}`;
  },
  projects() {
    const cards = D.projects.map((p, i) => `
      <article class="card">
        <h3>${String(i + 1).padStart(2, "0")}. ${esc(p.name)}</h3>
        <p class="tag">${esc(p.tagline)}</p>
        <p>${esc(p.desc)}</p>
        <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        ${pills(p.stack)}
        <div class="links">${linkBtn(p.repo, "GitHub ↗")}${linkBtn(p.live, "Live demo ↗", "alt")}</div>
      </article>`).join("");
    return head("projects", `ls ./projects — ${D.projects.length} projects`) + cards;
  },
  hackathons() {
    const cards = D.hackathons.map((h) => `
      <article class="card">
        <img class="thumb" src="${h.img}" alt="${esc(h.name)} certificate" loading="lazy" data-zoom="${h.img}">
        <h3>${esc(h.name)}</h3>
        <span class="result">${esc(h.result)}</span>
        <p class="tag">${esc(h.meta)}</p>
        <p>${esc(h.desc)}</p>
        ${h.extra ? `<img class="thumb" src="${h.extra}" alt="Team with the winners cheque" loading="lazy" data-zoom="${h.extra}">` : ""}
      </article>`).join("");
    return head("hackathons", "ls ./hackathons") + `<div class="grid">${cards}</div>
      <h2>Also recognised at</h2>${pills(D.alsoRecognised)}`;
  },
  achievements() {
    return head("achievements", "cat achievements.log") + `<div class="log">` + D.achievements.map((a, i) => `
      <div class="logrow"><span class="n">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div></div>`).join("") + `</div>`;
  },
  certificates() {
    const cards = D.certificates.map((c) => `
      <article class="card">
        <img class="thumb" src="${c.img}" alt="${esc(c.title)} certificate" loading="lazy" data-zoom="${c.img}">
        <h3 style="font-size:17px">${esc(c.title)}</h3>
        <p class="tag">${esc(c.issuer)} · ${esc(c.date)}</p>
        ${c.note ? `<p class="d" style="color:var(--dim);margin:0">${esc(c.note)}</p>` : ""}
        ${c.file ? `<div class="links">${linkBtn(c.file, "Open PDF ↗", "alt")}</div>` : ""}
      </article>`).join("");
    return head("certificates", "ls ./certificates — click an image to enlarge") + `<div class="grid">${cards}</div>`;
  },
  resume() {
    return head("resume", "cat resume.pdf") + `
      <div class="links" style="margin:0 0 18px">
        <a class="btn" href="${D.resume}" download="Abhishek_Sahu_Resume.pdf">Download ↓</a>
        <a class="btn alt" href="${D.resume}" target="_blank" rel="noopener">Open in new tab ↗</a>
      </div>
      <div class="pdfwrap"><iframe src="${D.resume}#view=FitH" title="Resume of ${esc(D.name)}"></iframe></div>
      <p class="d" style="color:var(--dim);font-size:12.5px">Can't see the preview on your device? Use "Open in new tab".</p>`;
  },
  contact() {
    return head("contact", "let's build something together") + `
      <div class="card"><dl class="kv">
        <dt>email</dt><dd><a href="mailto:${D.email}">${D.email}</a></dd>
        <dt>phone</dt><dd><a href="tel:${D.phone.replace(/\s/g, "")}">${D.phone}</a></dd>
        <dt>location</dt><dd>${esc(D.location)}</dd>
      </dl>
      <div class="links">${linkBtn(D.github, "GitHub ↗")}${linkBtn(D.linkedin, "LinkedIn ↗", "alt")}${pageBtn("resume", "Resume →", "alt")}</div></div>`;
  }
};

function showPage(name) {
  show("page");
  $("#crumb").textContent = `~/${name}`;
  $("#pageBody").innerHTML = renderers[name]();
  document.title = `${PAGES[name].title} — ${D.name}`;
}

$("#backBtn").addEventListener("click", () => { location.hash = "#/"; });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#lightbox").hidden) return closeBox();
  if (!views.page.hidden) location.hash = "#/";
});

/* lightbox */
const box = $("#lightbox");
function closeBox() { box.hidden = true; }
box.addEventListener("click", closeBox);
$("#pageBody").addEventListener("click", (e) => {
  const z = e.target.closest("[data-zoom]");
  if (z) { const img = box.querySelector("img"); img.src = z.dataset.zoom; img.alt = z.alt || "Enlarged certificate"; box.hidden = false; }
});

/* ================= ROUTER ================= */
function route() {
  if (!bootDone) return;
  const raw = location.hash.replace(/^#\/?/, "");
  const name = PAGES[raw] ? raw : ALIASES[raw];
  if (PAGES[name]) return showPage(name);
  document.title = `${D.name} — Portfolio`;
  showTerminal();
}
window.addEventListener("hashchange", route);

if (safe(() => sessionStorage.getItem("booted")) || (location.hash && (PAGES[location.hash.replace(/^#\/?/, "")] || ALIASES[location.hash.replace(/^#\/?/, "")]))) {
  bootDone = true; route();
} else runBoot();
})();
