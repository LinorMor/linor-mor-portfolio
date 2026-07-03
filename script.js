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

  // portfolio video players
  document.querySelectorAll(".pf-media").forEach((media) => {
    const clips = JSON.parse(media.dataset.clips || "[]");
    if (!clips.length) return;
    let activeIdx = 0;
    const poster = media.querySelector(".pf-poster");
    const playBtn = media.querySelector(".pf-play");
    const dots = media.querySelectorAll(".pf-clip-dots button");

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        activeIdx = Number(dot.dataset.idx);
        poster.src = clips[activeIdx].poster;
        dots.forEach((d) => d.classList.toggle("active", d === dot));
      });
    });

    const playClip = () => {
      const clip = clips[activeIdx];
      const video = document.createElement("video");
      video.src = clip.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.className = "pf-video";
      media.innerHTML = "";
      media.appendChild(video);
    };

    playBtn.addEventListener("click", playClip);
    poster.addEventListener("click", playClip);
  });

  // about video: autoplay with sound once scrolled into view, pause when scrolled away
  const aboutVideo = document.getElementById("aboutVideo");
  if (aboutVideo) {
    const tryPlay = () => {
      aboutVideo.muted = false;
      const playPromise = aboutVideo.play();
      if (playPromise) {
        playPromise.catch(() => {
          aboutVideo.muted = true;
          aboutVideo.play().catch(() => {});
        });
      }
    };
    const videoIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            aboutVideo.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    videoIo.observe(aboutVideo);
  }

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
