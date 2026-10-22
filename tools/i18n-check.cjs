// Lists the English text the Icelandic dictionary (i18n.is.js) does not cover yet.
// Opens every page in English, plays through its example screens so the text the scripts draw appears too,
// and prints each string I18N.known() does not know. Nothing printed: every string has its Icelandic.
//   node tools/i18n-check.cjs            the list, one string per line, as JSON keys ready to paste
// Needs Playwright with a cached Chromium. Set PLAYWRIGHT=/path/to/node_modules/playwright if it is not resolvable.
const path = require("path");

function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT, "playwright"].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch (e) {} }
  throw new Error("Playwright not found. Set PLAYWRIGHT=/path/to/node_modules/playwright");
}
const { chromium } = loadPlaywright();
const ROOT = path.resolve(__dirname, "..");
const url = (f) => "file://" + path.join(ROOT, f) + "?lang=en";

// Runs in the page: every text node and translatable attribute outside translate="no" that the dictionary does not know
function unknown() {
  const out = [], seen = (window.__seen = window.__seen || new Set());
  const add = (t) => { t = t.trim(); if (t && /[A-Za-z]{2}/.test(t) && !I18N.known(t) && !seen.has(t)) { seen.add(t); out.push(t); } };
  const skip = (el) => !el || el.closest("[translate=no], script, style");
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) if (!skip(n.parentElement)) add(n.nodeValue);
  document.querySelectorAll("[title], [aria-label], [placeholder], [alt]").forEach((el) => {
    if (skip(el)) return;
    ["title", "aria-label", "placeholder", "alt"].forEach((a) => { const v = el.getAttribute(a); if (v) add(v); });
  });
  add(document.title);
  const md = document.querySelector("meta[name=description]"); if (md) add(md.content);
  return out;
}

const PAGES = [
  { file: "index.html" },
  { file: "chapters/a-problem.html" },
  { file: "chapters/b-solution.html", play: async (p, look) => {
    for (const d of ["today", "tomorrow", "sat"]) for (const v of ["out", "in"]) {
      await p.click(`#board-day [data-v='${d}']`); await p.click(`#board-dir [data-v='${v}']`); await look();
    }
    await p.click("#tv-cycle"); await look();
    await p.click("#notif"); await p.waitForTimeout(400);
    for (const a of ["options", "refund"]) {
      await p.click(`#alert-body [data-a='${a}']`); await look();
      for (const o of await p.$$eval("#alert-body [data-o]", (bs) => bs.map((b) => b.dataset.o))) {
        await p.click(`#alert-body [data-o='${o}']`); await look(); await p.click("#alert-body [data-a='back']"); await p.click(`#alert-body [data-a='${a}']`);
      }
      await p.click("#alert-body [data-a='back']");
    }
    await p.click("#alert-body [data-a='accept']"); await look();
    for (const t of ["fam", "foot", "car"]) {
      await p.click(`#book-body [data-tpl='${t}']`);
      for (const d of ["today", "tomorrow", "sat"]) { await p.click(`#book-body [data-d='${d}']`); await look(); }
    }
    await p.click("#book-body [data-car]"); await p.click("#book-body [data-p='you']"); await look();
    await p.click("#book-body [data-p='you']"); await p.click("#book-body [data-a='book']"); await look();
    await p.click("#book-body [data-p='partner']").catch(() => {});
    await p.click("#book-body [data-a='again']"); await p.click("#book-body [data-p='partner']"); await p.click("#book-body [data-a='book']"); await look();
    for (let i = 0; i < 4; i++) { await p.click("#pass-next"); await look(); }
  } },
  { file: "chapters/c-core.html", play: async (p, look) => {
    for (const mode of ["record", "today"]) {
      await p.evaluate((m) => __sim.setMode(m), mode);
      for (const pr of ["normal", "tho", "pending", "onetrip"]) {
        for (const conf of ["confirmed", "forecast"]) {
          await p.evaluate((id) => __sim.preset(id), pr);
          await p.click(`#conf [data-conf='${conf}']`); await look();
          await p.click("#publish"); await look();
          for (const l of ["is", "en", "pl"]) { await p.click(`#ntabs [data-lang='${l}']`); await look(); }
          for (const b of await p.$$("#b-phone .acts button")) { await b.click().catch(() => {}); }
          await look();
          await p.click("#b-fb .more"); await look();
        }
      }
      if (mode === "today") { await p.waitForTimeout(10000); await look(); }
    }
    await p.selectOption("#sel-VEY-1430", "pending"); await p.selectOption("#next", ""); await look();
    await p.selectOption("#sel-VEY-1430", "cancel"); await look();
    for (const n of ["15:00", "16:30", "18:00", "06:00+1"]) {
      await p.evaluate(() => __sim.preset("pending")); await p.selectOption("#next", n); await p.click("#publish"); await look();
    }
  } }
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const all = [];
  for (const P of PAGES) {
    await page.goto(url(P.file));
    const look = async () => { for (const t of await page.evaluate(unknown)) all.push([P.file, t]); };
    await look();
    if (P.play) await P.play(page, look);
  }
  await browser.close();
  let last = null;
  for (const [f, t] of all) { if (f !== last) { console.log("// " + f); last = f; } console.log("  " + JSON.stringify(t) + ": \"\","); }
  if (errors.length) { console.error("Page errors:\n" + errors.join("\n")); process.exitCode = 1; }
})();
