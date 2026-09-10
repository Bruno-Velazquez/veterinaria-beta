document.addEventListener("DOMContentLoaded", () => {
  // Iconos Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ---------- Menú mobile ---------- */
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenuBtn = document.getElementById("mobile-menu-close");
  const menuBackdrop = document.getElementById("mobile-menu-backdrop");

  function toggleMobileMenu(open) {
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");

    if (menuBackdrop) {
      menuBackdrop.classList.toggle("is-open", open);
    }

    // Bloquea el scroll del body para que la página no se mueva detrás del panel
    document.body.style.overflow = open ? "hidden" : "";
  }

  function openMobileMenu() {
    toggleMobileMenu(true);
  }

  function closeMobileMenu() {
    toggleMobileMenu(false);
  }

  if (menuBtn && mobileMenu && closeMenuBtn) {
    menuBtn.addEventListener("click", openMobileMenu);

    closeMenuBtn.addEventListener("click", () => {
      closeMobileMenu();
      menuBtn.focus();
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    if (menuBackdrop) {
      menuBackdrop.addEventListener("click", () => {
        closeMobileMenu();
        menuBtn.focus();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
        menuBtn.focus();
      }
    });
  }

  /* ---------- Sección activa en el menú mobile (scroll-spy) ---------- */
  /*
    Resalta en celeste el item de la sección que se está viendo. Sólo corre en
    index.html: en productos.html no existen estas secciones y el item activo
    ("Productos") ya viene marcado con aria-current="page" en el HTML.
  */
  const spySections = ["inicio", "servicios", "quienes-somos", "sucursal"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (spySections.length && "IntersectionObserver" in window) {
    const spyLinks = new Map();
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      const hash = link.getAttribute("href");
      if (hash && hash.startsWith("#")) {
        spyLinks.set(hash.slice(1), link);
      }
    });

    function setActiveSection(id) {
      spyLinks.forEach((link, sectionId) => {
        if (sectionId === id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    // Gana la sección que cruza el medio del viewport
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    spySections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- Dropdown "Servicios" (desktop) ---------- */
  const servicesBtn = document.getElementById("services-dropdown-btn");
  const servicesDropdown = document.getElementById("services-dropdown");

  if (servicesBtn && servicesDropdown) {
    function toggleDropdown(open) {
      servicesDropdown.classList.toggle("is-open", open);
      servicesBtn.setAttribute("aria-expanded", String(open));
    }

    servicesBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = servicesDropdown.classList.contains("is-open");
      toggleDropdown(!isOpen);
    });

    document.addEventListener("click", (e) => {
      if (!servicesDropdown.contains(e.target) && e.target !== servicesBtn) {
        toggleDropdown(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleDropdown(false);
    });
  }

  /* ---------- Acordeón FAQ ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      faqItems.forEach((i) => i.setAttribute("data-open", "false"));
      item.setAttribute("data-open", String(!isOpen));
      faqItems.forEach((i) => {
        i.querySelector(".faq-trigger").setAttribute(
          "aria-expanded",
          i.getAttribute("data-open")
        );
      });
    });
  });

  /* ---------- Carruseles con scroll-snap (marcas y testimonios) ---------- */
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    if (!track) return;

    function scrollByAmount(direction) {
      const amount = track.clientWidth * 0.8 * direction;
      track.scrollBy({ left: amount, behavior: "smooth" });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => scrollByAmount(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollByAmount(1));
  });

  /* ---------- Catálogo de productos: filtro por categoría ---------- */
  const catalogFilterBtns = document.querySelectorAll("[data-filter]");
  const catalogCards = document.querySelectorAll("[data-catalog-grid] [data-category]");

  const filterActiveClasses = ["bg-primary-500", "text-white"];
  const filterInactiveClasses = ["bg-white", "text-secondary-600", "ring-1", "ring-primary-200"];

  catalogFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      catalogFilterBtns.forEach((b) => {
        b.classList.remove(...filterActiveClasses);
        b.classList.add(...filterInactiveClasses);
      });
      btn.classList.remove(...filterInactiveClasses);
      btn.classList.add(...filterActiveClasses);

      catalogCards.forEach((card) => {
        const match = filter === "todos" || card.getAttribute("data-category") === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  /* ---------- Indicador "Abierto ahora" ---------- */
  // REEMPLAZAR: ajustar horario real de la sucursal La Falda.
  const HORARIO_SUCURSAL = {
    // 0 = domingo ... 6 = sábado. null = cerrado todo el día.
    0: null,
    1: [{ from: 9, to: 20 }],
    2: [{ from: 9, to: 20 }],
    3: [{ from: 9, to: 20 }],
    4: [{ from: 9, to: 20 }],
    5: [{ from: 9, to: 20 }],
    6: [{ from: 9, to: 13 }],
  };

  function isOpenNow() {
    const now = new Date();
    const ranges = HORARIO_SUCURSAL[now.getDay()];
    if (!ranges) return false;
    const hour = now.getHours() + now.getMinutes() / 60;
    return ranges.some((r) => hour >= r.from && hour < r.to);
  }

  const statusBadge = document.getElementById("branch-status");
  if (statusBadge) {
    const open = isOpenNow();
    statusBadge.textContent = open ? "Abierto ahora" : "Cerrado ahora";
    statusBadge.classList.toggle("bg-emerald-100", open);
    statusBadge.classList.toggle("text-emerald-700", open);
    statusBadge.classList.toggle("bg-slate-200", !open);
    statusBadge.classList.toggle("text-slate-600", !open);
  }

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Newsletter (solo UI, sin backend) ---------- */
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("newsletter-msg");
      if (msg) msg.classList.remove("hidden");
      newsletterForm.reset();
    });
  }
});
