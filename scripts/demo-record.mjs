/**
 * PlayProof slow demo: section banners + large cursor, no translate UI.
 * node scripts/demo-record.mjs
 */
import { chromium } from "playwright-core";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const OVERLAY_CSS = `
  #pp-demo-cursor {
    position: fixed !important; z-index: 2147483646 !important; pointer-events: none !important;
    width: 36px; height: 36px; left: 0; top: 0;
    margin: 0; transform: translate(-4px, -2px);
    filter: drop-shadow(0 3px 6px rgba(0,0,0,.45));
    transition: none;
  }
  #pp-demo-banner {
    position: fixed !important; top: 28px; left: 50%; transform: translateX(-50%);
    z-index: 2147483645 !important; pointer-events: none !important;
    background: #0071e3; color: #fff;
    padding: 0.85rem 1.45rem; border-radius: 18px;
    font: 700 1.05rem/1.35 Pretendard, system-ui, sans-serif;
    letter-spacing: -0.02em; box-shadow: 0 14px 40px rgba(0,113,227,.35);
    opacity: 0; transition: opacity .3s ease;
    max-width: min(92vw, 760px); text-align: center;
  }
  #pp-demo-banner.show { opacity: 1; }
  #pp-demo-banner small {
    display: block; margin-top: 0.2rem; font-weight: 500;
    color: rgba(255,255,255,.88); font-size: 0.84rem;
  }
  #pp-demo-veil {
    position: fixed; inset: 0; z-index: 2147483644; pointer-events: none;
    background: linear-gradient(180deg, rgba(0,0,0,.08), transparent 120px);
    opacity: 0; transition: opacity .3s ease;
  }
  #pp-demo-veil.show { opacity: 1; }
  .skiptranslate, iframe.skiptranslate, .goog-te-banner-frame,
  #goog-gt-tt, .goog-te-balloon-frame, .VIpgJd-ZVi9od-ORHb-OEYmMd,
  .VIpgJd-yAWNEb-L7lbkb, font > font { display: none !important; visibility: hidden !important; }
  body { top: 0 !important; position: static !important; }
  html.translated-ltr body, html.translated-rtl body { top: 0 !important; }
`;

const OVERLAY_JS = `(() => {
  const killTranslate = () => {
    document.querySelectorAll('.skiptranslate, iframe.skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame')
      .forEach((el) => el.remove());
    document.body && (document.body.style.top = '0px');
    document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
  };
  killTranslate();
  if (!document.getElementById('pp-demo-style')) {
    const s = document.createElement('style');
    s.id = 'pp-demo-style';
    s.textContent = ${JSON.stringify(OVERLAY_CSS)};
    document.documentElement.appendChild(s);
  }
  if (!document.getElementById('pp-demo-cursor')) {
    const cursor = document.createElement('div');
    cursor.id = 'pp-demo-cursor';
    cursor.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L30 18.5L16.8 21L12 33L6 4Z" fill="#ffcc00" stroke="#1d1d1f" stroke-width="2" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(cursor);
  }
  if (!document.getElementById('pp-demo-banner')) {
    const banner = document.createElement('div');
    banner.id = 'pp-demo-banner';
    document.documentElement.appendChild(banner);
  }
  if (!document.getElementById('pp-demo-veil')) {
    const veil = document.createElement('div');
    veil.id = 'pp-demo-veil';
    document.documentElement.appendChild(veil);
  }
  window.__ppMoveCursor = (x, y) => {
    const c = document.getElementById('pp-demo-cursor');
    if (c) c.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  };
  window.__ppBanner = (title, sub) => {
    const b = document.getElementById('pp-demo-banner');
    const v = document.getElementById('pp-demo-veil');
    if (!b) return;
    b.innerHTML = sub ? (title + '<small>' + sub + '</small>') : title;
    b.classList.add('show');
    v && v.classList.add('show');
  };
  window.__ppBannerHide = () => {
    document.getElementById('pp-demo-banner')?.classList.remove('show');
    document.getElementById('pp-demo-veil')?.classList.remove('show');
  };
  if (!window.__ppTranslateObserver) {
    window.__ppTranslateObserver = new MutationObserver(killTranslate);
    window.__ppTranslateObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
})()`;

async function injectChrome(page) {
  await page.evaluate(OVERLAY_JS);
}

async function moveTo(page, x, y, steps = 40) {
  const start = await page.evaluate(() => {
    const c = document.getElementById("pp-demo-cursor");
    if (!c) return { x: 40, y: 40 };
    const t = c.style.transform || "translate(40px, 40px)";
    const m = /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/.exec(t);
    return m ? { x: Number(m[1]), y: Number(m[2]) } : { x: 40, y: 40 };
  });
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    const ease = 1 - Math.pow(1 - p, 2);
    const mx = start.x + (x - start.x) * ease;
    const my = start.y + (y - start.y) * ease;
    await page.mouse.move(mx, my);
    await page.evaluate(([a, b]) => window.__ppMoveCursor?.(a, b), [mx, my]);
    await sleep(12);
  }
}

async function clickLocator(page, locator, steps = 42) {
  await locator.scrollIntoViewIfNeeded();
  await sleep(250);
  const box = await locator.boundingBox();
  if (!box) throw new Error("no bounding box");
  const x = box.x + box.width / 2;
  const y = box.y + Math.min(box.height / 2, 24);
  await moveTo(page, x, y, steps);
  await sleep(450);
  await page.mouse.down();
  await sleep(140);
  await page.mouse.up();
  await sleep(550);
}

async function typeSlow(page, locator, text) {
  await clickLocator(page, locator, 28);
  await locator.fill("");
  for (const ch of text) {
    await page.keyboard.type(ch, { delay: 36 });
  }
  await sleep(700);
}

async function smoothScroll(page, y, duration = 1800) {
  await page.evaluate(
    async ({ target, duration }) => {
      const start = window.scrollY;
      const delta = target - start;
      const t0 = performance.now();
      await new Promise((resolve) => {
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / duration);
          const ease = 1 - Math.pow(1 - p, 3);
          window.scrollTo(0, start + delta * ease);
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    { target: y, duration },
  );
}

async function section(page, title, sub, hold = 3200) {
  await injectChrome(page);
  await page.evaluate(([t, s]) => window.__ppBanner?.(t, s), [title, sub]);
  await sleep(hold);
}

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
  const context = browser.contexts()[0];
  // Prefer disabling translate at browser level
  try {
    const client = await context.newCDPSession(context.pages()[0]);
    await client.send("Browser.setPermission", {}).catch(() => {});
  } catch {
    /* ignore */
  }

  const page =
    context.pages().find((p) => p.url().includes("127.0.0.1:5173")) ||
    context.pages()[0];

  page.setDefaultTimeout(25000);
  page.on("dialog", async (dialog) => {
    await sleep(1600);
    await dialog.accept();
  });

  await page.addInitScript({ content: OVERLAY_JS });

  await page.goto("http://127.0.0.1:5173/PlayProof/#/dev/new", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle" });
  await injectChrome(page);
  await moveTo(page, 240, 220, 8);
  await sleep(1000);

  await section(page, "Section 1 · 의뢰 작성", "구간 · 기획 의도 · 패키지 견적", 3200);
  await page.evaluate(() => window.__ppBannerHide?.());
  await sleep(2200);
  await page.locator("#quote").scrollIntoViewIfNeeded();
  await sleep(2000);
  await clickLocator(page, page.locator('#new-form button[type="submit"]'), 44);

  await page.waitForURL(/#\/dev\/posting/);
  await injectChrome(page);
  await section(page, "Section 2 · 모집 공고", "일반인 테스터 대상으로 게시", 3400);
  await page.evaluate(() => window.__ppBannerHide?.());
  await sleep(2400);
  await clickLocator(page, page.locator('a:has-text("테스터로 전환해 지원하기")'), 44);
  await sleep(1400);

  await injectChrome(page);
  await section(page, "Section 3 · 테스터 지원", "지원 → 당선 → 영상·피드백 제출", 3200);
  await page.evaluate(() => window.__ppBannerHide?.());
  const skip = page.locator("#skip-demo");
  if (await skip.count()) {
    await sleep(800);
    await clickLocator(page, skip, 36);
    await sleep(1600);
  }
  await injectChrome(page);
  await sleep(900);
  await clickLocator(page, page.locator("article.card", { hasText: "2차 보스" }).first(), 42);
  await sleep(2000);
  await injectChrome(page);

  const applyBtn = page.locator("#apply-btn");
  if (await applyBtn.count()) {
    await clickLocator(page, applyBtn, 40);
    await sleep(2000);
  }
  await injectChrome(page);

  await typeSlow(
    page,
    page.locator("#feedback"),
    "패턴이 있다는 걸 늦게 알아챘고, 초반은 운으로 버티는 느낌이었습니다.",
  );
  await typeSlow(
    page,
    page.locator("#improvement"),
    "첫 실패 후 약점을 이펙트로 한 번 더 강조해 주세요.",
  );
  await sleep(1100);
  await clickLocator(page, page.locator("#submit-form button[type='submit']"), 40);
  await sleep(2000);

  await page.goto("http://127.0.0.1:5173/PlayProof/#/dev/report/req_boss_01", {
    waitUntil: "networkidle",
  });
  await injectChrome(page);
  await section(page, "Section 4 · 납품 패키지", "정량 + 정성 + 원본 영상", 3400);
  await page.evaluate(() => window.__ppBannerHide?.());
  await sleep(2400);

  await clickLocator(page, page.locator('.package-tabs button[data-tab="qual"]'), 36);
  await sleep(2600);
  await clickLocator(page, page.locator('.package-tabs button[data-tab="video"]'), 36);
  await sleep(2600);
  await clickLocator(page, page.locator('.package-tabs button[data-tab="quant"]'), 36);
  await sleep(2400);

  await section(page, "Prove your Intent!", "PlayProof Demo End", 3200);
  await sleep(1200);

  console.log("DEMO_FLOW_DONE");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
