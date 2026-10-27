/**
 * ZipURL — Full Stack Test Suite
 * Tests: PostgreSQL, Redis (cache miss + cache hit), Shorten, Redirect, Stats
 */

require("dotenv").config();

const { get: redisGet, set: redisSet } = require("./src/redis/client");
const prisma = require("./src/prisma/client");

const BASE = "http://localhost:3000";
const TEST_URL = "https://www.example.com/test-full-suite-" + Date.now();

let results = [];

function log(name, passed, detail = "") {
  const icon = passed ? "✅" : "❌";
  results.push({ name, passed, detail });
  console.log(`${icon}  ${name}${detail ? " — " + detail : ""}`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── 1. PostgreSQL Direct Write ───────────────────────────────────────────────
async function testPostgres() {
  console.log("\n─── 1. PostgreSQL (Neon) ────────────────────────────────");
  try {
    const record = await prisma.url.create({
      data: { originalUrl: TEST_URL, shortCode: "test_" + Date.now() },
    });
    log("PostgreSQL: Write record", !!record.id, `id=${record.id}`);

    const found = await prisma.url.findUnique({ where: { id: record.id } });
    log("PostgreSQL: Read record back", found?.originalUrl === TEST_URL);

    // cleanup
    await prisma.url.delete({ where: { id: record.id } });
    log("PostgreSQL: Delete record", true);
  } catch (err) {
    log("PostgreSQL: Connection", false, err.message);
  }
}

// ─── 2. Redis Direct Get/Set ──────────────────────────────────────────────────
async function testRedis() {
  console.log("\n─── 2. Redis (Upstash) ──────────────────────────────────");
  try {
    const testKey = "zipurl_test_" + Date.now();
    const testVal = "https://redis-test.example.com";

    await redisSet(testKey, testVal, "EX", 60);
    log("Redis: SET value", true, `key=${testKey}`);

    await sleep(300); // small gap

    const fetched = await redisGet(testKey);
    log("Redis: GET value", fetched === testVal, `got="${fetched}"`);

    // test missing key
    const missing = await redisGet("key_that_does_not_exist_xyz");
    log("Redis: GET missing key returns null", missing === null, `got=${missing}`);
  } catch (err) {
    log("Redis: Connection", false, err.message);
  }
}

// ─── 3. POST /api/shorten ─────────────────────────────────────────────────────
async function testShorten() {
  console.log("\n─── 3. POST /api/shorten ────────────────────────────────");
  try {
    const res = await fetch(`${BASE}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: TEST_URL }),
    });
    const data = await res.json();

    log("Shorten: HTTP 201", res.status === 201, `status=${res.status}`);
    log("Shorten: Returns shortUrl", !!data.shortUrl, `shortUrl=${data.shortUrl}`);

    return data.shortUrl; // e.g. http://localhost:3000/abc
  } catch (err) {
    log("Shorten: API call", false, err.message);
    return null;
  }
}

// ─── 4. Invalid URL rejected ──────────────────────────────────────────────────
async function testShortenInvalid() {
  console.log("\n─── 4. Validation — invalid URL ─────────────────────────");
  try {
    const res = await fetch(`${BASE}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "not-a-url" }),
    });
    log("Validation: Invalid URL returns 400", res.status === 400, `status=${res.status}`);
  } catch (err) {
    log("Validation: API call", false, err.message);
  }
}

// ─── 5. GET /api/stats/:shortCode ─────────────────────────────────────────────
async function testStats(shortUrl) {
  console.log("\n─── 5. GET /api/stats/:shortCode ────────────────────────");
  if (!shortUrl) { log("Stats: Skipped (no shortUrl)", false); return; }
  const shortCode = shortUrl.split("/").pop();
  try {
    const res = await fetch(`${BASE}/api/stats/${shortCode}`);
    const data = await res.json();

    log("Stats: HTTP 200", res.status === 200, `status=${res.status}`);
    log("Stats: Has originalUrl", data.originalUrl === TEST_URL);
    log("Stats: Has clickCount", typeof data.clickCount === "number", `clickCount=${data.clickCount}`);
    log("Stats: Has createdAt", !!data.createdAt);
    log("Stats: Has shortCode", data.shortCode === shortCode);
  } catch (err) {
    log("Stats: API call", false, err.message);
  }
}

// ─── 6. GET /:shortCode — Cache MISS then cache HIT ───────────────────────────
async function testRedirect(shortUrl) {
  console.log("\n─── 6. GET /:shortCode (Redirect + Redis cache) ─────────");
  if (!shortUrl) { log("Redirect: Skipped (no shortUrl)", false); return; }
  const shortCode = shortUrl.split("/").pop();

  try {
    // First hit = DB lookup (cache miss), server will 302 redirect
    const res1 = await fetch(`${BASE}/${shortCode}`, { redirect: "manual" });
    log(
      "Redirect: First hit (DB miss) → 302",
      res1.status === 302,
      `status=${res1.status}, Location=${res1.headers.get("location")}`
    );
    log(
      "Redirect: Location matches original URL",
      res1.headers.get("location") === TEST_URL
    );

    // Wait a moment so Redis write finishes
    await sleep(500);

    // Check Redis was populated
    const cached = await redisGet(shortCode);
    log("Redirect: Redis populated after first hit", cached === TEST_URL, `cached="${cached}"`);

    // Second hit = should come from Redis cache
    const res2 = await fetch(`${BASE}/${shortCode}`, { redirect: "manual" });
    log(
      "Redirect: Second hit (cache HIT) → 302",
      res2.status === 302,
      `status=${res2.status}`
    );
  } catch (err) {
    log("Redirect: API call", false, err.message);
  }
}

// ─── 7. Click count increment ─────────────────────────────────────────────────
async function testClickCount(shortUrl) {
  console.log("\n─── 7. Click count increment ────────────────────────────");
  if (!shortUrl) { log("ClickCount: Skipped", false); return; }
  const shortCode = shortUrl.split("/").pop();
  try {
    // Hit redirect a few more times
    await fetch(`${BASE}/${shortCode}`, { redirect: "manual" });
    await fetch(`${BASE}/${shortCode}`, { redirect: "manual" });
    await sleep(500); // let async increments settle

    const res = await fetch(`${BASE}/api/stats/${shortCode}`);
    const data = await res.json();
    log("ClickCount: Incremented (≥2)", data.clickCount >= 2, `clickCount=${data.clickCount}`);
  } catch (err) {
    log("ClickCount: Test", false, err.message);
  }
}

// ─── 8. 404 for unknown shortCode ─────────────────────────────────────────────
async function test404() {
  console.log("\n─── 8. 404 for unknown short code ───────────────────────");
  try {
    const res = await fetch(`${BASE}/ZZZNOTEXIST`, { redirect: "manual" });
    log("404: Unknown code returns 404", res.status === 404, `status=${res.status}`);
  } catch (err) {
    log("404: API call", false, err.message);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(55));
  console.log("  ZipURL — Comprehensive Test Suite");
  console.log("=".repeat(55));

  await testPostgres();
  await testRedis();
  const shortUrl = await testShorten();
  await testShortenInvalid();
  await testStats(shortUrl);
  await testRedirect(shortUrl);
  await testClickCount(shortUrl);
  await test404();

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(55));
  console.log("  RESULTS");
  console.log("=".repeat(55));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  results.forEach((r) => {
    console.log(`  ${r.passed ? "✅" : "❌"}  ${r.name}${r.detail ? " [" + r.detail + "]" : ""}`);
  });
  console.log(`\n  Total: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log("  🎉 ALL TESTS PASSED — SAFE TO DEPLOY!");
  } else {
    console.log("  ⚠️  Some tests failed — review above before deploying.");
    process.exitCode = 1;
  }

  await prisma.$disconnect();
  process.exit(process.exitCode || 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
