(function () {
  "use strict";

  // Toggle .scrolled class to body
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  // Mobile nav toggle
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  // Hide mobile nav on same-page/hash links
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  // Toggle mobile nav dropdowns
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  // Preloader
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  // Scroll top button
  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // AOS init
  function aosInit() {
    AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
  }
  window.addEventListener('load', aosInit);

  // Carousel indicators
  document.querySelectorAll('.carousel-indicators').forEach(carouselIndicator => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((item, index) => {
      carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>`;
    });
  });

  // Pure Counter
  new PureCounter();

  // Swiper init
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  // GLightbox init
  const glightbox = GLightbox({ selector: '.glightbox' });

  // Isotope layout and filter with pagination
  window.addEventListener("DOMContentLoaded", function () {
    const allItems = Array.from(document.querySelectorAll(".portfolio-item"));
    const container = document.querySelector(".isotope-container");
    const pagination = document.getElementById("pagination");
    const itemsPerPage = 6;
    let currentPage = 1;
    let isotopeInstance;

    function getTotalPages() {
      const visibleItems = allItems.filter(item => item.style.display !== 'none');
      return Math.ceil(visibleItems.length / itemsPerPage);
    }

    function renderPage(page) {
      currentPage = page;
      container.innerHTML = "";
      const visibleItems = allItems.filter(item => item.style.display !== 'none');
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const itemsToShow = visibleItems.slice(start, end);
      itemsToShow.forEach(item => container.appendChild(item));

      if (isotopeInstance) isotopeInstance.destroy();
      isotopeInstance = new Isotope(container, {
        itemSelector: ".portfolio-item",
        layoutMode: "masonry"
      });

      if (typeof AOS !== "undefined") AOS.refresh();

      updatePagination(page, getTotalPages());
    }

    function updatePagination(current, total) {
      pagination.innerHTML = "";
      const prev = document.createElement("li");
      prev.className = "page-item";
      prev.innerHTML = `<a class="page-link" href="#portfolio">«</a>`;
      prev.addEventListener("click", () => {
        if (current > 1) renderPage(current - 1);
      });
      pagination.appendChild(prev);

      for (let i = 1; i <= total; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === current ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#portfolio">${i}</a>`;
        li.addEventListener("click", () => renderPage(i));
        pagination.appendChild(li);
      }

      const next = document.createElement("li");
      next.className = "page-item";
      next.innerHTML = `<a class="page-link" href="#portfolio">»</a>`;
      next.addEventListener("click", () => {
        if (current < total) renderPage(current + 1);
      });
      pagination.appendChild(next);
    }

    // Filter handling
    document.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
      filterBtn.addEventListener('click', function () {
        document.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        const filterValue = this.getAttribute('data-filter');

        allItems.forEach(item => {
          if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });

        renderPage(1);
      });
    });

    if (container && pagination && allItems.length > 0) {
      renderPage(1);
    }
  });

  // Hash scroll fix
  window.addEventListener('load', function () {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const current = new URL(window.location.href);
    const currentPage = current.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll('#navmenu a');

    // 🔻 Xóa mọi class active cũ
    navLinks.forEach(link => link.classList.remove('active'));

    // 🔻 Thêm active đúng link hiện tại
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.split("/").pop();
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add("active");
      }
    });
  });

})();
