const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const server = require("../serve");

describe("Static Web Server Tests (serve.js)", () => {
  let port;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  function get(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`${baseUrl}${urlPath}`, (res) => {
        let body = [];
        res.on("data", (chunk) => body.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(body)
          });
        });
      }).on("error", reject);
    });
  }

  it("should serve index.html on / with status 200 and text/html", async () => {
    const res = await get("/");
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.headers["content-type"], /text\/html/);
    assert.match(res.body.toString("utf8"), /Abhishek Sahu/);
  });

  it("should serve style.css with status 200 and text/css", async () => {
    const res = await get("/style.css");
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.headers["content-type"], /text\/css/);
    assert.match(res.body.toString("utf8"), /--green/);
  });

  it("should serve data.js with status 200 and text/javascript", async () => {
    const res = await get("/data.js");
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.headers["content-type"], /text\/javascript/);
    assert.match(res.body.toString("utf8"), /window\.DATA/);
  });

  it("should serve app.js with status 200 and text/javascript", async () => {
    const res = await get("/app.js");
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.headers["content-type"], /text\/javascript/);
  });

  it("should serve images with image/jpeg", async () => {
    const res = await get("/assets/img/profile.jpg");
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers["content-type"], "image/jpeg");
    assert.ok(res.body.length > 1000);
  });

  it("should serve PDF with application/pdf", async () => {
    const res = await get("/assets/Abhishek_Sahu_Resume.pdf");
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers["content-type"], "application/pdf");
    assert.ok(res.body.length > 1000);
  });

  it("should return 404 for nonexistent files", async () => {
    const res = await get("/does-not-exist.xyz");
    assert.strictEqual(res.statusCode, 404);
  });

  it("should block directory traversal attacks with 403", async () => {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({ host: "127.0.0.1", port, path: "/../outside.txt" }, (r) => {
        resolve({ statusCode: r.statusCode });
      });
      req.on("error", reject);
      req.end();
    });
    assert.strictEqual(res.statusCode, 403);
  });
});
