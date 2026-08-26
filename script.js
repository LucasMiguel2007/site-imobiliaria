/* =========================================================
   ÓRBITA - JAVASCRIPT OTIMIZADO
   Refatorado mantendo os mesmos IDs e classes do projeto.

   Módulos:
   1. Preloader
   2. Header + Parallax
   3. Menu Mobile
   4. Navegação ativa
   5. Reveal
   6. Contadores
   7. Filtros
   8. Favoritos
   9. Modal
   10. Efeitos Desktop
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURAÇÃO
  ======================================================= */

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = matchMedia("(pointer:fine)").matches;

  /* Elementos principais */

  const preloader = $("#preloader");
  const header = $("#header");
  const navbar = $("#navbar");
  const menuToggle = $("#menuToggle");

  const navLinks = $$(".nav-link");
  const sections = $$("main section");
  const revealElements = $$(".reveal");
  const counters = $$("[data-counter]");
  const propertyCards = $$(".property-card");

  const modal = $("#propertyModal");
  const modalClose = $("#modalClose");
  const modalBackdrop = $(".modal-backdrop");

  const heroImage = $(".hero-img");


  /* =======================================================
     1. PRELOADER
  ======================================================= */

  window.addEventListener("load", () => {

    if (!preloader) return;

    setTimeout(() => {

      preloader.classList.add("hidden");
      document.body.classList.add("loaded");

    }, 350);

  });


  /* =======================================================
     2. HEADER + PARALLAX
     Um único listener usando requestAnimationFrame.
  ======================================================= */

  let ticking = false;

  function updateScrollEffects() {

    const scroll = window.scrollY;

    header?.classList.toggle("scrolled", scroll > 40);

    if (
      heroImage &&
      window.innerWidth > 850 &&
      !prefersReduced &&
      scroll < window.innerHeight
    ) {

      heroImage.style.transform =
        `translateY(${scroll * .08}px) scale(1.02)`;

    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {

    if (!ticking) {

      requestAnimationFrame(updateScrollEffects);
      ticking = true;

    }

  }, { passive:true });

  updateScrollEffects();


  /* =======================================================
     3. MENU MOBILE
  ======================================================= */

  function closeMenu() {

    menuToggle?.classList.remove("active");
    navbar?.classList.remove("open");

    menuToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

  }

  menuToggle?.addEventListener("click", () => {

    const opened =
      menuToggle.classList.toggle("active");

    navbar?.classList.toggle("open", opened);

    menuToggle.setAttribute(
      "aria-expanded",
      opened
    );

  });

  navLinks.forEach(link =>
    link.addEventListener("click", closeMenu)
  );


  /* =======================================================
     4. NAVEGAÇÃO ATIVA
  ======================================================= */

  const sectionObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const id = entry.target.id;

      navLinks.forEach(link => {

        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${id}`
        );

      });

    });

  }, {
    rootMargin:"-30% 0px -60% 0px"
  });

  sections.forEach(section => {

    if (section.id)
      sectionObserver.observe(section);

  });


  /* =======================================================
     5. REVEAL ON SCROLL
  ======================================================= */

  if (!prefersReduced) {

    const revealObserver = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);

      });

    }, { threshold:.12 });

    revealElements.forEach(el =>
      revealObserver.observe(el)
    );

  } else {

    revealElements.forEach(el =>
      el.classList.add("visible")
    );

  }


  /* =======================================================
     6. CONTADORES
  ======================================================= */

  function animateCounter(element) {

    const target = Number(element.dataset.counter);

    if (prefersReduced) {

      element.textContent =
        target.toLocaleString("pt-BR") + "+";

      return;
    }

    const start = performance.now();
    const duration = 1500;

    function update(now) {

      const progress =
        Math.min((now - start) / duration, 1);

      const ease =
        1 - Math.pow(1 - progress, 3);

      element.textContent =
        Math.floor(target * ease)
          .toLocaleString("pt-BR");

      if (progress < 1) {

        requestAnimationFrame(update);

      } else {

        element.textContent =
          target.toLocaleString("pt-BR") + "+";

      }

    }

    requestAnimationFrame(update);

  }

  const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);

    });

  }, { threshold:.7 });

  counters.forEach(counter =>
    counterObserver.observe(counter)
  );


  /* =======================================================
     7. FILTRO DE IMÓVEIS
     Delegação = apenas um listener.
  ======================================================= */

  document.addEventListener("click", event => {

    const button =
      event.target.closest(".filter-btn");

    if (!button) return;

    const filter = button.dataset.filter;

    $$(".filter-btn").forEach(btn =>
      btn.classList.toggle("active", btn === button)
    );

    propertyCards.forEach(card => {

      const categories =
        (card.dataset.category || "")
          .split(" ");

      const visible =
        filter === "all" ||
        categories.includes(filter);

      card.classList.toggle("hidden", !visible);

      if (visible && !prefersReduced) {

        card.animate([
          { opacity:0, transform:"translateY(10px)" },
          { opacity:1, transform:"translateY(0)" }
        ], {
          duration:250,
          easing:"ease-out"
        });

      }

    });

  });


  /* =======================================================
     8. FAVORITOS
     Mantém comportamento original.
  ======================================================= */

  document.addEventListener("click", event => {

    const favorite =
      event.target.closest(".favorite-btn");

    if (!favorite) return;

    event.stopPropagation();

    favorite.classList.toggle("active");

    const icon = favorite.querySelector("i");

    if (!icon) return;

    const active =
      favorite.classList.contains("active");

    icon.classList.toggle("fa-solid", active);
    icon.classList.toggle("fa-regular", !active);

  });


  /* =======================================================
     9. MODAL DE IMÓVEIS
     Altere somente os dados abaixo para adicionar imóveis.
  ======================================================= */

  const propertyData = {

  "casa-moderna":{
    image:"casa1.0.png",
    title:"Casa Moderna Premium",
    location:"Região central",
    bedrooms:"3",
    bathrooms:"3",
    parking:"2",
    price:"R$ 2,5 mi"
  },

  "casa-urbana": {
    image: "casa2.png",
    title: "Casa Urbana",
    location: "Bairro planejado",
    bedrooms: "2",
    bathrooms: "2",
    parking: "1",
    price: "R$ 1,5 mi"
  },

  "casa-contemporanea":{
    image:"casa3.png",
    title:"Casa Contemporânea",
    location:"Região residencial",
    bedrooms:"4",
    bathrooms:"4",
    parking:"3",
    price:"R$ 1,2 milhão"
  }

};

  /* Elementos do modal */

  const modalImage = $("#modalImage");
  const modalTitle = $("#modalTitle");
  const modalType = $("#modalType");
  const modalLocation = $("#modalLocation");
  const modalBedrooms = $("#modalBedrooms");
  const modalBathrooms = $("#modalBathrooms");
  const modalParking = $("#modalParking");
  const modalPrice = $("#modalPrice");


  let lastFocused = null;

  function openPropertyModal(id, trigger = null) {

    const property = propertyData[id];

    if (!property || !modal) return;

    lastFocused = trigger;

    if (modalImage) {
      modalImage.src = property.image;
      modalImage.alt = property.title;
    }

    if (modalTitle)
      modalTitle.textContent = property.title;

    if (modalType)
      modalType.textContent = property.type;

    if (modalLocation)
      modalLocation.textContent = property.location;

    if (modalBedrooms)
      modalBedrooms.textContent = property.bedrooms;

    if (modalBathrooms)
      modalBathrooms.textContent = property.bathrooms;

    if (modalParking)
      modalParking.textContent = property.parking;

    if (modalPrice)
      modalPrice.textContent = property.price;

    modal.classList.add("active");
    document.body.classList.add("modal-open");

    modalClose?.focus();

  }

  function closePropertyModal() {

    modal?.classList.remove("active");
    document.body.classList.remove("modal-open");

    lastFocused?.focus();
    lastFocused = null;

  }


/* =======================================================
   ABERTURA DOS IMÓVEIS — DESKTOP + MOBILE
======================================================= */

document.addEventListener("click", event => {
  const favorite = event.target.closest(".favorite-btn");
  if (favorite) return;

  const button = event.target.closest(".view-property");
  const card = event.target.closest(".property-card");

  if (!card) return;

  const propertyId = card.dataset.property;

  if (!propertyId || !propertyData[propertyId]) {
    console.warn("Imóvel não encontrado:", propertyId);
    return;
  }

  openPropertyModal(propertyId, button || card);
});


  modalClose?.addEventListener(
    "click",
    closePropertyModal
  );

  modalBackdrop?.addEventListener(
    "click",
    closePropertyModal
  );

  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      modal?.classList.contains("active")
    ) {

      closePropertyModal();

    }

  });


  /* =======================================================
     10. SMOOTH SCROLL
  ======================================================= */

  $$('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", event => {

      const id = anchor.getAttribute("href");

      if (!id || id === "#") return;

      const target = $(id);

      if (!target) return;

      event.preventDefault();

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (header?.offsetHeight || 0);

      window.scrollTo({
        top,
        behavior: prefersReduced ? "auto" : "smooth"
      });

    });

  });


  /* =======================================================
     11. EFEITO MAGNÉTICO
     Apenas desktop.
  ======================================================= */

  if (desktop && !prefersReduced) {

    $$(".magnetic").forEach(button => {

      button.addEventListener("mousemove", event => {

        const rect =
          button.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        button.style.transform =
          `translate(${x * .10}px,${y * .10}px)`;

      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });

    });


    /* =====================================================
       12. EFEITO 3D NOS CARDS
    ===================================================== */

    $$(".property-card, .feature-card")
      .forEach(card => {

        card.addEventListener("mousemove", event => {

          if (window.innerWidth < 900) return;

          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          const rotateX = -y / 28;
          const rotateY = x / 28;

          card.style.transform =
            `translateY(-8px)
             perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });

      });


    /* =====================================================
       13. CURSOR GLOW
    ===================================================== */

    const glow =
      document.createElement("div");

    glow.className = "cursor-glow";

    document.body.appendChild(glow);

    let glowTick = false;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", event => {

      mouseX = event.clientX;
      mouseY = event.clientY;

      if (glowTick) return;

      requestAnimationFrame(() => {

        glow.style.left = mouseX + "px";
        glow.style.top = mouseY + "px";

        glowTick = false;

      });

      glowTick = true;

    });

  }

});