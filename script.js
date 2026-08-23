/* =========================================================
   CONFIGURAÇÕES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const preloader =
        document.getElementById("preloader");

    const header =
        document.getElementById("header");

    const navbar =
        document.getElementById("navbar");

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const sections =
        document.querySelectorAll("main section");

    const revealElements =
        document.querySelectorAll(".reveal");

    const counters =
        document.querySelectorAll("[data-counter]");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const propertyCards =
        document.querySelectorAll(".property-card");

    const favoriteButtons =
        document.querySelectorAll(".favorite-btn");

    const modal =
        document.getElementById("propertyModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalBackdrop =
        document.querySelector(".modal-backdrop");

    const modalImage =
        document.getElementById("modalImage");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalType =
        document.getElementById("modalType");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalBedrooms =
        document.getElementById("modalBedrooms");

    const modalBathrooms =
        document.getElementById("modalBathrooms");

    const modalParking =
        document.getElementById("modalParking");

    const modalPrice =
        document.getElementById("modalPrice");


    /* =====================================================
       PRELOADER
    ====================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            preloader.classList.add("hidden");

            document.body.classList.add("loaded");

        }, 500);

    });


    /* =====================================================
       HEADER DINÂMICO
    ====================================================== */

    const updateHeader = () => {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    updateHeader();


    /* =====================================================
       MENU MOBILE
    ====================================================== */

    menuToggle.addEventListener("click", () => {

        const isOpen =
            menuToggle.classList.toggle("active");

        navbar.classList.toggle(
            "open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    /* Fechar menu ao clicar em um link */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            menuToggle.classList.remove("active");

            navbar.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /* =====================================================
       NAVEGAÇÃO ATIVA PELO SCROLL
    ====================================================== */

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    const currentId =
                        entry.target.getAttribute("id");

                    navLinks.forEach(link => {

                        const href =
                            link.getAttribute("href");

                        link.classList.toggle(
                            "active",
                            href === `#${currentId}`
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-30% 0px -60% 0px"
            }
        );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });


    /* =====================================================
       REVEAL ON SCROLL
    ====================================================== */

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: .12
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });


    /* =====================================================
       CONTADORES ANIMADOS
    ====================================================== */

    const animateCounter = element => {

        const target =
            Number(
                element.dataset.counter
            );

        const duration = 1600;

        const startTime =
            performance.now();


        const update = currentTime => {

            const progress =
                Math.min(
                    (currentTime - startTime) /
                    duration,
                    1
                );


            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.floor(
                    easedProgress * target
                );


            element.textContent =
                current.toLocaleString("pt-BR");


            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                element.textContent =
                    target.toLocaleString("pt-BR") +
                    "+";

            }

        };


        requestAnimationFrame(update);

    };


    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        animateCounter(
                            entry.target
                        );

                        counterObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: .7
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });


    /* =====================================================
       FILTRO DE IMÓVEIS
    ====================================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                const selectedFilter =
                    button.dataset.filter;


                propertyCards.forEach(card => {

                    const categories =
                        card.dataset.category
                            .split(" ");


                    const shouldShow =
                        selectedFilter === "all" ||
                        categories.includes(
                            selectedFilter
                        );


                    if (shouldShow) {

                        card.classList.remove(
                            "hidden"
                        );

                        card.style.opacity = "0";

                        requestAnimationFrame(() => {

                            card.style.opacity =
                                "1";

                        });

                    } else {

                        card.classList.add(
                            "hidden"
                        );

                    }

                });

            }
        );

    });


    /* =====================================================
       FAVORITOS
    ====================================================== */

    favoriteButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                button.classList.toggle(
                    "active"
                );


                const icon =
                    button.querySelector("i");


                if (
                    button.classList.contains(
                        "active"
                    )
                ) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );

                } else {

                    icon.classList.remove(
                        "fa-solid"
                    );

                    icon.classList.add(
                        "fa-regular"
                    );

                }

            }
        );

    });


    /* =====================================================
       MODAL DE IMÓVEIS
    ====================================================== */

    const propertyData = {

        "casa-moderna": {

            image: "casa1.0.png",

            title:
                "Casa Moderna Premium",

            location:
                "Região central",

            bedrooms:
                "3",

            bathrooms:
                "3",

            parking:
                "2",

            price:
                "R$ 2,5 mi"

        },


        "apartamento-urbano": {

            image: "casa2.png",

            title:
                "Apartamento Urban",
            location:
                "Bairro planejado",

            bedrooms:
                "2",

            bathrooms:
                "2",

            parking:
                "1",

            price:
                "R$ 1,5 mi"

        },


        "casa-contemporanea": {

            image: "casa3.png",

            title:
                "Casa Contemporânea",
                
            location:
                "Região residencial",

            bedrooms:
                "4",

            bathrooms:
                "4",

            parking:
                "3",

            price:
                "R$ 1,2 milhão"

        }

    };


    const openPropertyModal =
        propertyId => {

            const property =
                propertyData[propertyId];


            if (!property)
                return;


            modalImage.src =
                property.image;

            modalImage.alt =
                property.title;


            modalTitle.textContent =
                property.title;

            modalType.textContent =
                property.type;

            modalLocation.textContent =
                property.location;

            modalBedrooms.textContent =
                property.bedrooms;

            modalBathrooms.textContent =
                property.bathrooms;

            modalParking.textContent =
                property.parking;

            modalPrice.textContent =
                property.price;


            modal.classList.add(
                "active"
            );

            document.body.classList.add(
                "modal-open"
            );


            modalClose.focus();

        };


    const closePropertyModal =
        () => {

            modal.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "modal-open"
            );

        };


    document
        .querySelectorAll(".view-property")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const card =
                        button.closest(
                            ".property-card"
                        );


                    openPropertyModal(
                        card.dataset.property
                    );

                }
            );

        });


    propertyCards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".favorite-btn"
                    )
                ) {
                    return;
                }


                openPropertyModal(
                    card.dataset.property
                );

            }
        );

    });


    modalClose.addEventListener(
        "click",
        closePropertyModal
    );


    modalBackdrop.addEventListener(
        "click",
        closePropertyModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "active"
                )
            ) {

                closePropertyModal();

            }

        }
    );


    /* =====================================================
       EFEITO MAGNÉTICO DOS BOTÕES
    ====================================================== */

    const magneticButtons =
        document.querySelectorAll(
            ".magnetic"
        );


    magneticButtons.forEach(button => {

        button.addEventListener(
            "mousemove",
            event => {

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
                    `translate(${x * .12}px, ${y * .12}px)`;

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform =
                    "";

            }
        );

    });


    /* =====================================================
       PARALLAX DA IMAGEM HERO
    ====================================================== */

    const heroImage =
        document.querySelector(
            ".hero-img"
        );


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.innerWidth <= 850
            ) {
                return;
            }


            const scroll =
                window.scrollY;


            if (scroll < window.innerHeight) {

                heroImage.style.transform =
                    `translateY(${scroll * .08}px) scale(1.02)`;

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       EFEITO 3D NOS CARDS
    ====================================================== */

    const cards3D =
        document.querySelectorAll(
            ".property-card, .feature-card"
        );


    cards3D.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 900
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    (y - centerY) /
                    30;


                const rotateY =
                    (centerX - x) /
                    30;


                card.style.transform =
                    `
                    translateY(-8px)
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    `;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });


    /* =====================================================
       SMOOTH SCROLL PERSONALIZADO
    ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const targetId =
                        anchor.getAttribute(
                            "href"
                        );


                    if (
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target)
                        return;


                    event.preventDefault();


                    const headerHeight =
                        header.offsetHeight;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        });


    /* =====================================================
       CURSOR GLOW DESKTOP
    ====================================================== */

    if (
        window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {

        const cursorGlow =
            document.createElement(
                "div"
            );


        cursorGlow.className =
            "cursor-glow";


        document.body.appendChild(
            cursorGlow
        );


        const cursorStyle =
            document.createElement(
                "style"
            );


        cursorStyle.textContent = `

            .cursor-glow {

                position: fixed;

                width: 180px;
                height: 180px;

                border-radius: 50%;

                pointer-events: none;

                z-index: 1;

                transform:
                    translate(-50%, -50%);

                transition:
                    left .15s ease-out,
                    top .15s ease-out;

            }

        `;


        document.head.appendChild(
            cursorStyle
        );


        window.addEventListener(
            "mousemove",
            event => {

                cursorGlow.style.left =
                    `${event.clientX}px`;

                cursorGlow.style.top =
                    `${event.clientY}px`;

            }
        );

    }


    /* =====================================================
       PREVENIR ERRO DE IMAGEM
    ====================================================== */

    document
        .querySelectorAll("img")
        .forEach(img => {

            img.addEventListener(
                "error",
                () => {

                }
            );

        });

});