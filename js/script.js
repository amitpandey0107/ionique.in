const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const backToTop = document.querySelector(".back-to-top");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateScrollState() {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", isScrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navPanel.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navPanel.classList.toggle("is-open", !isOpen);
});
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const activeId = `#${entry.target.id}`;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === activeId));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const configurations = [...document.querySelectorAll("[data-config]")];
const galleryNumber = document.querySelector("#gallery-number");
const galleryLabel = document.querySelector("#gallery-label");
const galleryTitle = document.querySelector("#gallery-title");
const galleryImage = document.querySelector("#gallery-image");
const dialogImage = document.querySelector("#image-dialog img");
configurations.forEach((button) => {
  button.addEventListener("click", () => {
    const number = String(Number(button.dataset.config) + 1).padStart(2, "0");
    const label = `Vehicle Configuration ${number}`;
    configurations.forEach((item) => item.setAttribute("aria-selected", String(item === button)));
    galleryNumber.textContent = number;
    galleryLabel.textContent = label;
    galleryTitle.textContent = label;
    galleryImage.src = button.dataset.image;
    galleryImage.alt = `${label}, image extracted from the source document`;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = galleryImage.alt;
  });
});

const imageDialog = document.querySelector("#image-dialog");
document.querySelector("[data-open-image]").addEventListener("click", () => imageDialog.showModal());
document.querySelector(".dialog-close").addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

const video = document.querySelector("#presentation-video");
const videoFrame = document.querySelector(".video-frame");
document.querySelector("#video-play").addEventListener("click", async () => {
  try {
    await video.play();
    videoFrame.classList.add("is-playing");
  } catch {
    videoFrame.classList.remove("is-playing");
  }
});
video.addEventListener("play", () => videoFrame.classList.add("is-playing"));
video.addEventListener("pause", () => videoFrame.classList.remove("is-playing"));
video.addEventListener("ended", () => videoFrame.classList.remove("is-playing"));
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
document.querySelector("#copyright-year").textContent = String(new Date().getFullYear());
