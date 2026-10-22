/* Touch: a horizontal swipe does what ← → do on the keyboard, so each page moves the same way by hand or by
   key. Swipes that start on the page's own controls or on an example screen are left to them. */
(function () {
  var OWN = "a, button, input, select, textarea, label, [role=tablist], .phone, .tv, .sim, .merge";
  var x0, y0, t0, on = false;
  document.addEventListener("touchstart", function (e) {
    on = e.touches.length === 1 && !(e.target.closest && e.target.closest(OWN));
    if (!on) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (!on) return;
    on = false;
    var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    if (Date.now() - t0 > 700 || Math.abs(dx) < 60 || Math.abs(dx) < 2 * Math.abs(dy)) return;
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: dx < 0 ? "ArrowRight" : "ArrowLeft", bubbles: true, cancelable: true }));
  }, { passive: true });
})();
