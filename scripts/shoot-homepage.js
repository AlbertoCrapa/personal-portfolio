/*
 * Homepage screenshot sweep across viewports and themes.
 *
 *   npm i -D playwright && npx playwright install chromium   (first run only)
 *   npm run build
 *   cd build && python3 -m http.server 4321 &
 *   node scripts/shoot-homepage.js
 *
 * playwright is deliberately NOT a declared dependency — this is a local
 * inspection tool, not part of the build.
 *
 * Writes to /screenshots (gitignored) and reports any console/page errors it
 * saw, which is how the grid-stretch overflow in the projects column was
 * caught. Captures are deterministic: smooth scrolling is disabled and each
 * jump settles before the shutter.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:4321/";
const OUT = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const DEVICES = [
  { name: "mobile-360", width: 360, height: 740, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "mobile-430", width: 430, height: 932, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "tabletL-1024", width: 1024, height: 768, mobile: false },
  { name: "laptop-1280", width: 1280, height: 800, mobile: false },
  { name: "laptop-1440", width: 1440, height: 900, mobile: false },
  { name: "desktop-1920", width: 1920, height: 1080, mobile: false },
  { name: "ultrawide-2560", width: 2560, height: 1300, mobile: false },
];

const SECTIONS = [
  ["projects", "Featured Projects"],
  ["blog", "Recent Blog Posts"],
  ["about", "More about me"],
  ["contact", "let's talk"],
];

async function shootDevice(browser, device, theme) {
  const suffix = theme === "light" ? "-light" : "";
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: 1,
    isMobile: device.mobile,
    hasTouch: device.mobile,
    reducedMotion: "no-preference",
  });

  await context.addInitScript((t) => {
    try {
      localStorage.setItem("albyeah-theme", t);
      sessionStorage.setItem("albyeah-session-welcome-shown", "1");
    } catch (e) {}
  }, theme);

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT, `${device.name}${suffix}-1-hero.png`) });

  // Deterministic captures: no smooth scrolling, settle after each jump.
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await page.waitForTimeout(1200);

  const tops = await page.evaluate((sections) => {
    const found = {};
    for (const [key, text] of sections) {
      const el = [...document.querySelectorAll("h2, h1")].find((n) =>
        (n.textContent || "").trim().toLowerCase().startsWith(text.toLowerCase()),
      );
      if (el) found[key] = Math.round(el.getBoundingClientRect().top + window.scrollY);
    }
    return found;
  }, SECTIONS);

  for (const [key, y] of Object.entries(tops)) {
    await page.evaluate((yy) => window.scrollTo(0, Math.max(0, yy - 80)), y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `${device.name}${suffix}-2-${key}.png`) });
  }

  await context.close();
  return errors;
}

(async () => {
  const browser = await chromium.launch({
    args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"],
  });
  const allErrors = {};
  for (const d of DEVICES) {
    allErrors[d.name] = await shootDevice(browser, d, "dark");
    process.stdout.write(`✓ ${d.name}\n`);
  }
  for (const d of DEVICES.filter((x) => ["mobile-390", "tablet-768", "laptop-1440"].includes(x.name))) {
    allErrors[`${d.name}-light`] = await shootDevice(browser, d, "light");
    process.stdout.write(`✓ ${d.name} (light)\n`);
  }
  await browser.close();
  const bad = Object.entries(allErrors).filter(([, e]) => e.length);
  console.log(bad.length ? JSON.stringify(bad, null, 1) : "\nNo page errors in any viewport.");
})();
