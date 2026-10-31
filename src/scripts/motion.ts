// Scroll behaviour shared by every page, modelled on newfront.com: Lenis smoothing, a header that hides
// on the way down and returns on the way up, the hero drifting under the first sheet, media that
// parallaxes as it passes, dividers that light up when seen, scroller arrows and the back-to-top button.
import Lenis from "lenis";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>(".header");
const hero = document.querySelector<HTMLElement>(".hero");
const heroBg = hero?.querySelector<HTMLElement>(".bg") ?? null;
const parallaxed = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
const totop = document.querySelector<HTMLElement>(".totop");
const menu = document.getElementById("menu");

let lastY = window.scrollY;

function frame(y: number, direction: number) {
  const vh = window.innerHeight;
  if (header) {
    const menuOpen = menu ? !menu.hidden : false;
    header.classList.toggle("is-hidden", !menuOpen && y > 80 && direction > 0);
  }
  if (totop) totop.classList.toggle("show", y > vh * 0.9);
  if (reduce) return;
  if (hero) {
    // The hero moves at a fifth of scroll speed (capped) so the sheet rides up over it; its backdrop
    // drifts the other way at a tenth, the way newfront's hero and media layers do.
    const s = Math.min(y, 1000);
    hero.style.transform = `translate3d(0, ${(s * 0.2).toFixed(2)}px, 0)`;
    if (heroBg) heroBg.style.transform = `translate3d(0, ${(-s * 0.1).toFixed(2)}px, 0)`;
  }
  for (const el of parallaxed) {
    const range = Number(el.dataset.parallax) || 0;
    const r = el.getBoundingClientRect();
    if (r.bottom < -range || r.top > vh + range) continue;
    const progress = ((r.top + r.height / 2) - vh / 2) / vh; // -1 above centre … 1 below
    el.style.transform = `translate3d(0, ${(Math.max(-1, Math.min(1, progress)) * range).toFixed(2)}px, 0)`;
  }
}

if (!reduce) {
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -120 },
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  lenis.on("scroll", ({ scroll, direction }: { scroll: number; direction: number }) => frame(scroll, direction));
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
} else {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    frame(y, y > lastY ? 1 : -1);
    lastY = y;
  }, { passive: true });
}
frame(window.scrollY, 0);

// Dividers: the accent segment runs along the line only while the divider is on screen
const dividers = document.querySelectorAll(".divider");
if (dividers.length) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle("in-view", e.isIntersecting);
  }, { threshold: 0.5 });
  dividers.forEach((d) => io.observe(d));
}

// Horizontal scrollers: the round arrows move one card at a time
for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-scroll]")) {
  btn.addEventListener("click", () => {
    const scroller = document.getElementById(btn.dataset.scroll!);
    const card = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(scroller).columnGap || "32");
    scroller.scrollBy({ left: btn.dataset.dir === "prev" ? -step : step, behavior: reduce ? "auto" : "smooth" });
  });
}

// Back to top
totop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
