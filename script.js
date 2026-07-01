(() => {
  const root = document.documentElement;
  const langToggle = document.getElementById("langToggle");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");

  const STORAGE_KEY = "linormor-lang";

  function applyLang(lang) {
    const isHe = lang === "he";
    root.lang = isHe ? "he" : "en";
    root.dir = isHe ? "rtl" : "ltr";
    root.classList.toggle("lang-he", isHe);
    root.classList.toggle("lang-en", !isHe);

    document.querySelectorAll("[data-he]").forEach((el) => {
      const text = isHe ? el.dataset.he : el.dataset.en;
      if (text !== undefined) el.textContent = text;
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  langToggle.addEventListener("click", () => {
    const current = root.classList.contains("lang-he") ? "he" : "en";
    applyLang(current === "he" ? "en" : "he");
  });

  const savedLang = localStorage.getItem(STORAGE_KEY);
  if (savedLang) applyLang(savedLang);

  // header scroll state
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // mobile menu
  menuToggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".site-nav a").forEach((a) => {
    a.addEventListener("click", () => header.classList.remove("nav-open"));
  });

  // scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in"), i * 60);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
})();
