/**
 * PlayProof demo driver via existing Chrome CDP.
 * Run: node scripts/demo-record.mjs
 */
import { chromium } from "playwright-core";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
  const context = browser.contexts()[0];
  const page =
    context.pages().find((p) => p.url().includes("127.0.0.1:5173")) ||
    context.pages()[0];

  page.setDefaultTimeout(15000);
  page.on("dialog", async (dialog) => {
    await sleep(900);
    await dialog.accept();
  });

  await page.goto("http://127.0.0.1:5173/PlayProof/#/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle" });
  await sleep(800);

  // Dismiss Google Translate bar if present
  await page.evaluate(() => {
    document.querySelectorAll("iframe.skiptranslate, .goog-te-banner-frame, .skiptranslate").forEach((el) => {
      el.style.display = "none";
    });
    document.body.style.top = "0px";
  }).catch(() => {});

  // —— 1. Home hero ——
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(2200);
  await page.evaluate(() =>
    document.getElementById("intent")?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
  await sleep(2400);
  await page.evaluate(() =>
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
  await sleep(2200);

  // —— 2. New request ——
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(600);
  await page.locator('.m-hero-cta button:has-text("의뢰하기")').first().click();
  await page.waitForURL(/#\/dev\/new/);
  await sleep(2500);
  await page.locator("#quote").scrollIntoViewIfNeeded();
  await sleep(1200);
  await page.locator("#new-form button[type='submit']").click();

  // —— 3. Recruitment posting ——
  await page.waitForURL(/#\/dev\/posting/);
  await sleep(2800);

  // —— 4. Tester apply + qualitative submit ——
  await page.locator('a:has-text("테스터로 전환해 지원하기")').click();
  await sleep(1000);
  const skip = page.locator("#skip-demo");
  if (await skip.count()) {
    await skip.click();
    await sleep(1200);
  }

  const boss = page.locator("article.card", { hasText: "2차 보스" }).first();
  await boss.click();
  await sleep(1600);

  const applyBtn = page.locator("#apply-btn");
  if (await applyBtn.count()) {
    await applyBtn.click();
    await sleep(1600);
  }

  await page.locator("#feedback").fill(
    "패턴이 있다는 걸 늦게 알아챘고, 초반은 운으로 버티는 느낌이었습니다.",
  );
  await page.locator("#improvement").fill(
    "첫 실패 후 약점을 이펙트로 한 번 더 강조해 주세요.",
  );
  await sleep(1200);
  await page.locator("#submit-form button[type='submit']").click();
  await sleep(1600);

  // —— 5. Delivery package ——
  await page.goto("http://127.0.0.1:5173/PlayProof/#/dev/report/req_boss_01", {
    waitUntil: "networkidle",
  });
  await sleep(2400);
  await page.locator('.package-tabs button[data-tab="qual"]').click();
  await sleep(2200);
  await page.locator('.package-tabs button[data-tab="video"]').click();
  await sleep(2000);
  await page.locator('.package-tabs button[data-tab="quant"]').click();
  await sleep(1800);

  // —— 6. Close on home ——
  await page.goto("http://127.0.0.1:5173/PlayProof/#/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(2000);

  console.log("DEMO_FLOW_DONE");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
