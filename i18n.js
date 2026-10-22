/* Language: English is the pages' own text. Icelandic replaces it text node by text node, from the
   dictionary in i18n.is.js, including what the pages' scripts draw later. Keys may hold {} for a part that
   varies ("Updated {}"); what fills it is translated too. A label made of parts joined by " · " is
   translated part by part. Anything inside translate="no" is left alone: the example screens that already
   speak several languages on purpose.
   The choice is made with EN | IS at the top of every page (or ?lang=is in a link) and remembered. */
(function () {
  var q = /[?&]lang=(en|is)\b/.exec(location.search), lang = q ? q[1] : null;
  try { if (lang) localStorage.setItem("ferry-lang", lang); else lang = localStorage.getItem("ferry-lang"); } catch (e) {}
  lang = lang === "is" ? "is" : "en";
  window.I18N = { lang: lang };

  var root = document.documentElement;
  var css = document.createElement("style");
  css.textContent =
    ".chapters .lang { align-self: center; display: inline-flex; gap: 2px; margin-left: 14px; padding: 2px; border: 1px solid var(--line); border-radius: 999px; }" +
    ".chapters .lang button { font: 700 12px/1 system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif; letter-spacing: .04em; border: 0; border-radius: 999px; padding: 5px 9px; background: none; color: var(--muted); cursor: pointer; }" +
    ".chapters .lang button[aria-pressed=\"true\"] { background: var(--ink); color: var(--page); cursor: default; }" +
    "@media (max-width: 760px) { nav.chapters > .lang { margin-left: auto; } }" +
    "html.i18n-wait body { visibility: hidden; }";
  document.head.appendChild(css);

  function addSwitch() {
    var nav = document.querySelector(".chapters");
    if (!nav) return;
    var g = document.createElement("span");
    g.className = "lang"; g.setAttribute("role", "group"); g.setAttribute("aria-label", "Language"); g.translate = false;
    [["en", "English"], ["is", "Íslenska"]].forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = l[0].toUpperCase(); b.title = l[1]; b.lang = l[0];
      b.setAttribute("aria-pressed", String(l[0] === lang));
      b.addEventListener("click", function () {
        if (l[0] === lang) return;
        try { localStorage.setItem("ferry-lang", l[0]); } catch (e) {}
        var u = new URL(location.href);
        u.searchParams.set("lang", l[0]);
        location.replace(u.href);
      });
      g.appendChild(b);
    });
    nav.appendChild(g);
  }

  var D = window.I18N_IS || {}, exact = {}, pats = [];
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  Object.keys(D).forEach(function (k) {
    if (k.charAt(0) === "_") return;
    if (k.indexOf("{}") < 0) { exact[k] = D[k]; return; }
    pats.push([new RegExp("^" + k.split("{}").map(reEsc).join("(.+?)") + "$"), D[k], k.replace(/\{\}/g, "").length]);
  });
  pats.sort(function (a, b) { return b[2] - a[2]; });   // the most specific key wins: "Decision at {}" before "Decision {}"

  // The translation of s, or null when the dictionary does not know it
  function look(s) {
    if (Object.prototype.hasOwnProperty.call(exact, s)) return exact[s];
    for (var i = 0; i < pats.length; i++) {
      var m = pats[i][0].exec(s);
      if (m) { var n = 0; return pats[i][1].replace(/\{(\d?)\}/g, function (_, d) { return tr(m[d ? +d : ++n]); }); }
    }
    if (s.indexOf(" · ") > 0) {
      var ok = true, parts = s.split(" · ").map(function (p) {
        var r = look(p); if (r === null && !neutral(p)) ok = false;
        return r === null ? p : r;
      });
      if (ok) return parts.join(" · ");
    }
    return null;
  }
  function tr(s) { var r = look(s); return r === null ? s : r; }
  // place names and codes read the same in both languages
  function neutral(s) { return !/[A-Za-z]{2}/.test(s.replace(/Vestmannaeyj\S*|Landeyjah\S*|Þorláksh\S*|Reykjav\S*|\b[A-Z]{2,}[-\d]*\b|AB 123/g, "")); }
  window.I18N.t = tr; window.I18N.known = function (s) { return neutral(s) || look(s) !== null; };   // tools/i18n-check.cjs asks

  if (lang === "en") { document.addEventListener("DOMContentLoaded", addSwitch); return; }

  root.lang = "is";
  root.classList.add("i18n-wait");

  var ATTRS = ["title", "aria-label", "placeholder", "alt"];
  function skip(el) { return !el || !!el.closest("[translate=no], script, style"); }
  function text(n) {
    if (skip(n.parentElement)) return;
    var v = n.nodeValue, t = v.trim();
    if (!t) return;
    var r = tr(t);
    if (r !== t) { var i = v.indexOf(t); n.nodeValue = v.slice(0, i) + r + v.slice(i + t.length); }
  }
  function attrs(el) {
    if (skip(el)) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) { var r = tr(v.trim()); if (r !== v.trim()) el.setAttribute(a, r); }
    });
  }
  function walk(n) {
    if (n.nodeType === 3) { text(n); return; }
    if (n.nodeType !== 1 || skip(n)) return;
    attrs(n);
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }

  document.addEventListener("DOMContentLoaded", function () {
    addSwitch();
    document.title = tr(document.title);
    var md = document.querySelector("meta[name=description]");
    if (md) md.content = tr(md.content);
    walk(document.body);
    root.classList.remove("i18n-wait");
    // what the pages' scripts draw from now on
    var obs = new MutationObserver(function (recs) {
      recs.forEach(function (r) {
        if (r.type === "characterData") text(r.target);
        else if (r.type === "attributes") attrs(r.target);
        else r.addedNodes.forEach(walk);
      });
      obs.takeRecords();   // our own replacements: nothing more to do
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  });
})();
