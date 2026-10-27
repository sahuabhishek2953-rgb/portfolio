const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

// Load data.js
function loadData() {
  const code = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
  const fn = new Function("window", `${code}; return window.DATA;`);
  return fn({});
}

describe("Data Integrity & Schema Tests", () => {
  const DATA = loadData();

  it("should have window.DATA defined with basic profile info", () => {
    assert.ok(DATA, "DATA object must exist");
    assert.strictEqual(typeof DATA.name, "string", "name must be a string");
    assert.strictEqual(typeof DATA.handle, "string", "handle must be a string");
    assert.strictEqual(typeof DATA.role, "string", "role must be a string");
    assert.strictEqual(typeof DATA.location, "string", "location must be a string");
    assert.ok(DATA.name.length > 0, "name should not be empty");
  });

  it("should have valid contact information", () => {
    assert.match(DATA.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/, "email must be valid format");
    assert.strictEqual(typeof DATA.phone, "string", "phone must be a string");
    assert.ok(DATA.phone.length > 5, "phone should have adequate length");
    assert.ok(DATA.github.startsWith("https://github.com/"), "github link must be valid");
    assert.ok(DATA.linkedin.startsWith("https://www.linkedin.com/"), "linkedin link must be valid");
  });

  it("should verify summary and stats exist", () => {
    assert.strictEqual(typeof DATA.summary, "string", "summary must be a string");
    assert.ok(DATA.summary.length > 20, "summary should be descriptive");
  });

  it("should verify skills categories and entries", () => {
    assert.strictEqual(typeof DATA.skills, "object", "skills must be an object");
    const requiredCategories = ["Languages", "Frontend", "Backend", "Databases", "Tools & Platforms", "Core CS"];
    for (const cat of requiredCategories) {
      assert.ok(Array.isArray(DATA.skills[cat]), `skills.${cat} must be an array`);
      assert.ok(DATA.skills[cat].length > 0, `skills.${cat} must have at least one skill`);
    }
  });

  it("should verify education entries", () => {
    assert.ok(Array.isArray(DATA.education), "education must be an array");
    assert.ok(DATA.education.length > 0, "education should have at least one entry");
    for (const edu of DATA.education) {
      assert.ok(edu.school, "education must have school");
      assert.ok(edu.degree, "education must have degree");
      assert.ok(edu.years, "education must have years");
    }
  });

  it("should verify projects entries and links", () => {
    assert.ok(Array.isArray(DATA.projects), "projects must be an array");
    assert.ok(DATA.projects.length >= 3, "should showcase at least 3 projects");
    for (const p of DATA.projects) {
      assert.ok(p.name, "project must have name");
      assert.ok(p.tagline, "project must have tagline");
      assert.ok(p.desc, "project must have desc");
      assert.ok(Array.isArray(p.points) && p.points.length > 0, `project ${p.name} must have bullet points`);
      assert.ok(Array.isArray(p.stack) && p.stack.length > 0, `project ${p.name} must have stack array`);
      assert.ok(p.live.startsWith("http"), `project ${p.name} must have a live demo URL`);
      if (p.repo) {
        assert.ok(p.repo.startsWith("https://github.com/"), `project ${p.name} repo must be valid github url if provided`);
      }
    }
  });

  it("should verify hackathons and awards", () => {
    assert.ok(Array.isArray(DATA.hackathons), "hackathons must be an array");
    assert.ok(DATA.hackathons.length > 0, "should have hackathons listed");
    for (const h of DATA.hackathons) {
      assert.ok(h.name, "hackathon must have name");
      assert.ok(h.result, "hackathon must have result");
      assert.ok(h.meta, "hackathon must have meta");
      assert.ok(h.desc, "hackathon must have desc");
      assert.ok(h.img, "hackathon must have img");
    }
    assert.ok(Array.isArray(DATA.alsoRecognised), "alsoRecognised must be an array");
    assert.ok(DATA.alsoRecognised.length > 0, "alsoRecognised must have items");
  });

  it("should verify achievements list", () => {
    assert.ok(Array.isArray(DATA.achievements), "achievements must be an array");
    assert.ok(DATA.achievements.length > 0, "achievements must not be empty");
    for (const a of DATA.achievements) {
      assert.ok(a.icon, "achievement must have icon");
      assert.ok(a.title, "achievement must have title");
      assert.ok(a.text, "achievement must have text");
    }
  });

  it("should verify certificates list", () => {
    assert.ok(Array.isArray(DATA.certificates), "certificates must be an array");
    assert.ok(DATA.certificates.length > 0, "certificates must not be empty");
    for (const c of DATA.certificates) {
      assert.ok(c.title, "certificate must have title");
      assert.ok(c.issuer, "certificate must have issuer");
      assert.ok(c.date, "certificate must have date");
      assert.ok(c.img, "certificate must have img");
    }
  });

  describe("Asset Existence on Disk", () => {
    it("should verify resume PDF exists and is not empty", () => {
      const cleanPath = DATA.resume.split("?")[0];
      const fullPath = path.join(ROOT, cleanPath);
      assert.ok(fs.existsSync(fullPath), `Resume file must exist: ${cleanPath}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 1000, "Resume file size must be > 1KB");
    });

    it("should verify profile photo exists and is not empty", () => {
      const cleanPath = DATA.photo.split("?")[0];
      const fullPath = path.join(ROOT, cleanPath);
      assert.ok(fs.existsSync(fullPath), `Profile photo must exist: ${cleanPath}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 1000, "Profile photo size must be > 1KB");
    });

    it("should verify all hackathon images exist", () => {
      for (const h of DATA.hackathons) {
        const cleanPath = h.img.split("?")[0];
        const fullPath = path.join(ROOT, cleanPath);
        assert.ok(fs.existsSync(fullPath), `Hackathon image must exist: ${cleanPath}`);
        assert.ok(fs.statSync(fullPath).size > 1000, `Hackathon image must not be empty: ${cleanPath}`);

        if (h.extra) {
          const extraPath = h.extra.split("?")[0];
          const fullExtraPath = path.join(ROOT, extraPath);
          assert.ok(fs.existsSync(fullExtraPath), `Hackathon extra image must exist: ${extraPath}`);
          assert.ok(fs.statSync(fullExtraPath).size > 1000, `Extra image must not be empty: ${extraPath}`);
        }
      }
    });

    it("should verify all certificate images and files exist", () => {
      for (const c of DATA.certificates) {
        const cleanImg = c.img.split("?")[0];
        const fullImgPath = path.join(ROOT, cleanImg);
        assert.ok(fs.existsSync(fullImgPath), `Certificate image must exist: ${cleanImg}`);
        assert.ok(fs.statSync(fullImgPath).size > 1000, `Certificate image must not be empty: ${cleanImg}`);

        if (c.file) {
          const cleanFile = c.file.split("?")[0];
          const fullFilePath = path.join(ROOT, cleanFile);
          assert.ok(fs.existsSync(fullFilePath), `Certificate file must exist: ${cleanFile}`);
          assert.ok(fs.statSync(fullFilePath).size > 1000, `Certificate file must not be empty: ${cleanFile}`);
        }
      }
    });
  });
});
