// Comprehensive fix for Bootstrap offcanvas issues with improved z-index management
document.addEventListener("DOMContentLoaded", function () {
    // Get the offcanvas element
    const mobileSidebar = document.getElementById("mobileSidebar");
  
    if (mobileSidebar) {
      // Create a single, global offcanvas instance that we'll reuse
      let offcanvasInstance;
  
      // Function to safely initialize or get the offcanvas instance
      const getOffcanvasInstance = () => {
        // Check if an instance exists
        const existingInstance = bootstrap.Offcanvas.getInstance(mobileSidebar);
  
        if (existingInstance) {
          return existingInstance;
        } else {
          // Create a new instance if one doesn't exist
          return new bootstrap.Offcanvas(mobileSidebar);
        }
      };
  
      // Initialize the instance once
      offcanvasInstance = getOffcanvasInstance();
  
      // Z-index management functions
      const setOpenZIndex = () => {
        mobileSidebar.style.zIndex = "1051"; // Higher z-index when open
  
        // Also ensure backdrop has appropriate z-index
        const backdrop = document.querySelector(".offcanvas-backdrop");
        if (backdrop) backdrop.style.zIndex = "1050";
      };
  
      const resetZIndex = () => {
        // Only reset z-index after animation completes
        mobileSidebar.style.zIndex = "1045"; // Default z-index when closed
      };
  
      // Handle custom close button if it exists
      const customCloseButton = mobileSidebar.querySelector(
        ".custom-offcanvas-close"
      );
      if (customCloseButton) {
        // Fix accessibility issue
        customCloseButton.setAttribute("tabindex", "-1");
  
        customCloseButton.addEventListener("click", function (e) {
          e.preventDefault();
          offcanvasInstance = getOffcanvasInstance();
          offcanvasInstance.hide();
        });
      }
  
      // Handle all the nav links within the offcanvas
      const navLinks = mobileSidebar.querySelectorAll("a");
      navLinks.forEach((link) => {
        // Remove any existing data-bs-dismiss attribute to prevent default behavior
        if (link.hasAttribute("data-bs-dismiss")) {
          link.removeAttribute("data-bs-dismiss");
        }
  
        // Fix accessibility
        link.setAttribute("tabindex", "-1");
  
        // Add our custom click handler
        link.addEventListener("click", function (e) {
          // Don't interfere with links that should behave normally
          if (this.classList.contains("dropdown-toggle")) return;
  
          // Get the latest instance and hide it
          offcanvasInstance = getOffcanvasInstance();
          offcanvasInstance.hide();
        });
      });
  
      // Use the inert attribute instead of aria-hidden
      mobileSidebar.addEventListener("hide.bs.offcanvas", function () {
        mobileSidebar.setAttribute("inert", "");
      });
  
      // Remove inert when showing
      mobileSidebar.addEventListener("show.bs.offcanvas", function () {
        mobileSidebar.removeAttribute("inert");
  
        // Set higher z-index when opened
        setOpenZIndex();
  
        // Make all focusable elements focusable again
        const focusableElements = mobileSidebar.querySelectorAll(
          "a, button, input, select, textarea"
        );
        focusableElements.forEach((el) => {
          el.removeAttribute("tabindex");
        });
      });
  
      // Ensure backdrop is properly removed after hiding
      mobileSidebar.addEventListener("hidden.bs.offcanvas", function () {
        const backdrops = document.querySelectorAll(".offcanvas-backdrop");
        backdrops.forEach((backdrop) => {
          backdrop.remove();
        });
  
        // Reset the body styling that Bootstrap adds
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.body.classList.remove("modal-open");
  
        // Reset to default z-index after animation completes
        resetZIndex();
      });
  
      // Add a global document click handler to ensure offcanvas can always be triggered
      const offcanvasTogglers = document.querySelectorAll(
        '[data-bs-toggle="offcanvas"][data-bs-target="#mobileSidebar"]'
      );
      offcanvasTogglers.forEach((toggler) => {
        toggler.addEventListener("click", function (e) {
          e.preventDefault();
  
          // Get the latest instance and show it
          offcanvasInstance = getOffcanvasInstance();
          offcanvasInstance.show();
        });
      });
  
      // Initialize with inert attribute if offcanvas is initially hidden
      if (!mobileSidebar.classList.contains("show")) {
        mobileSidebar.setAttribute("inert", "");
      }
    }
  
    // Clean up any stray backdrops on page load (safeguard)
    const strayBackdrops = document.querySelectorAll(".offcanvas-backdrop");
    strayBackdrops.forEach((backdrop) => {
      backdrop.remove();
    });
  
    // Add styles for custom close button with improved visibility
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .custom-offcanvas-close {
        box-sizing: content-box;
        width: 1em;
        height: 1em;
        padding: 0.5rem;
        color: #ffffff; /* Changed to white for better visibility */
        background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
        border: 0;
        border-radius: 0.25rem;
        opacity: 1;
        cursor: pointer;
        transition: opacity 0.15s linear;
        position: absolute; /* Make it absolute positioned */
        top: 10px; /* Position from top */
        right: 10px; /* Position from right */
        z-index: 1052; /* Higher than the offcanvas itself */
      }
      
      .custom-offcanvas-close:hover {
        opacity: 0.75;
        text-decoration: none;
      }
      
      .custom-offcanvas-close:focus {
        outline: none;
        box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.5); /* Changed to white for better visibility */
      }
      
      /* Ensure offcanvas is visible while transitioning */
      .offcanvas.offcanvas-start {
        visibility: visible !important;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
      }
      
      .offcanvas.offcanvas-start.show {
        transform: translateX(0);
      }
      
      /* Ensure offcanvas is hidden properly when closed */
      .offcanvas[inert] {
        pointer-events: none;
        cursor: default;
      }
  
      .modal-backdrop.show {
      // opacity: 0; 
      }
    `;
    document.head.appendChild(styleElement);
  
    // Handle mobile navbar z-index to prevent overlay cutoff
    const mobileScrollNavbar = document.querySelector(".mobile-scroll-navbar");
    if (mobileScrollNavbar) {
      // Adjust z-index when offcanvas is shown/hidden
      document.body.addEventListener("shown.bs.offcanvas", function () {
        mobileScrollNavbar.style.zIndex = "1039"; // Below the offcanvas and backdrop
      });
  
      document.body.addEventListener("hidden.bs.offcanvas", function () {
        // Give it a small delay to avoid flickering
        setTimeout(() => {
          mobileScrollNavbar.style.zIndex = "1049"; // Reset z-index but keep below potentially active elements
        }, 300);
      });
    }
  });
  
  // Handle mobile navbar on scroll
  const scrollNav = document.querySelector(".mobile-scroll-navbar");
  const mobileLine1 = document.querySelector(".mobile-nav-line-1");
  const mobileLine2 = document.querySelector(".mobile-nav-line-2");
  
  // Handle scroll events
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 100) {
        if (scrollNav) scrollNav.style.display = "flex";
        if (mobileLine1) mobileLine1.style.display = "none";
        if (mobileLine2) mobileLine2.style.display = "none";
      } else {
        if (scrollNav) scrollNav.style.display = "none";
        if (mobileLine1) mobileLine1.style.display = "flex";
        if (mobileLine2) mobileLine2.style.display = "flex";
      }
    }
  });
  
  // Handle window resize events
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      if (scrollNav) scrollNav.style.display = "none";
      if (mobileLine1) mobileLine1.style.display = "none";
      if (mobileLine2) mobileLine2.style.display = "none";
    } else {
      if (window.scrollY > 100) {
        if (scrollNav) scrollNav.style.display = "flex";
        if (mobileLine1) mobileLine1.style.display = "none";
        if (mobileLine2) mobileLine2.style.display = "none";
      } else {
        if (scrollNav) scrollNav.style.display = "none";
        if (mobileLine1) mobileLine1.style.display = "flex";
        if (mobileLine2) mobileLine2.style.display = "flex";
      }
    }
  });
  
  // Initialize correctly on page load
  window.addEventListener("load", () => {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 100) {
        if (scrollNav) scrollNav.style.display = "flex";
        if (mobileLine1) mobileLine1.style.display = "none";
        if (mobileLine2) mobileLine2.style.display = "none";
      } else {
        if (scrollNav) scrollNav.style.display = "none";
        if (mobileLine1) mobileLine1.style.display = "flex";
        if (mobileLine2) mobileLine2.style.display = "flex";
      }
    } else {
      if (scrollNav) scrollNav.style.display = "none";
      if (mobileLine1) mobileLine1.style.display = "none";
      if (mobileLine2) mobileLine2.style.display = "none";
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    // Calculate navbar height to use for offset
    const getNavbarHeight = () => {
      const navbar = document.querySelector(".custom-navbar");
      return navbar ? navbar.offsetHeight : 0;
    };
  
    // 1. Set active class based on current URL hash or pathname
    function setActiveNavLink() {
      const currentLocation = window.location.hash || window.location.pathname;
      const navLinks = document.querySelectorAll(".nav-link");
  
      // First, remove active class from all links
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });
  
      // Then set active based on current location
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === "#") return; // Skip empty links
  
        // For dropdown toggle links, check if we're in that section
        if (
          link.classList.contains("dropdown-toggle") &&
          currentLocation.includes(href.replace("#", ""))
        ) {
          link.classList.add("active");
          return;
        }
  
        // For normal links, check exact match
        if (
          currentLocation === href ||
          currentLocation.endsWith(href) ||
          (href === "#home" &&
            (currentLocation === "/" ||
              currentLocation === "/index.html" ||
              currentLocation === ""))
        ) {
          link.classList.add("active");
        }
      });
  
      // Also handle dropdown items
      const dropdownItems = document.querySelectorAll(".dropdown-item");
      dropdownItems.forEach((item) => {
        const href = item.getAttribute("href");
        if (currentLocation === href || currentLocation.endsWith(href)) {
          // Find parent dropdown and set it active too
          const parentDropdown = item
            .closest(".dropdown")
            .querySelector(".dropdown-toggle");
          if (parentDropdown) {
            parentDropdown.classList.add("active");
          }
        }
      });
    }
  
    // Handle smooth scrolling with offset
    function handleNavLinkClick(e) {
      // Get all nav links that point to anchors
      const anchorLinks = document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
      );
  
      anchorLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          // Prevent default anchor click behavior
          e.preventDefault();
  
          // Get the target element
          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);
  
          if (targetElement) {
            // Calculate the position to scroll to (with navbar offset)
            const navbarHeight = getNavbarHeight();
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - navbarHeight;
  
            // Smooth scroll to the target with offset
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
  
            // Update the URL hash without scrolling
            history.pushState(null, null, targetId);
  
            // Update active nav link
            setActiveNavLink();
          }
        });
      });
    }
  
    // Fix anchor links on page load
    function fixAnchorsOnLoad() {
      // Check if there's a hash in the URL
      if (window.location.hash) {
        // Wait a moment for everything to load
        setTimeout(() => {
          const targetId = window.location.hash;
          const targetElement = document.querySelector(targetId);
  
          if (targetElement) {
            // Calculate position with navbar offset
            const navbarHeight = getNavbarHeight();
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - navbarHeight;
  
            // Scroll to the target with offset
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
  
    // Set active link initially
    setActiveNavLink();
  
    // Set up smooth scrolling
    handleNavLinkClick();
  
    // Fix anchors on page load
    fixAnchorsOnLoad();
  
    // Update active link when hash changes
    window.addEventListener("hashchange", setActiveNavLink);
  
    // Add click handler for nav links
    const navLinks = document.querySelectorAll(".nav-link:not(.dropdown-toggle)");
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // Don't interfere with dropdown toggle behavior
        if (this.classList.contains("dropdown-toggle")) return;
  
        // Set this link as active
        navLinks.forEach((navLink) => navLink.classList.remove("active"));
        this.classList.add("active");
  
        // On mobile, close the navbar after clicking a link
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      });
    });
  
    // Handle dropdown items click
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Find parent dropdown toggle and set it active
        const parentDropdown =
          this.closest(".dropdown").querySelector(".dropdown-toggle");
        if (parentDropdown) {
          navLinks.forEach((navLink) => navLink.classList.remove("active"));
          parentDropdown.classList.add("active");
        }
  
        // On mobile, close the navbar after clicking
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      });
    });
  
    // If no active link is set, default to home
    if (!document.querySelector(".nav-link.active")) {
      document.querySelector('.nav-link[href="#home"]').classList.add("active");
    }
  });


// =====================================================
//  DROPDOWN FUNCTIONALITY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    // =====================================================
    // MANAGE ACTIVE STATE FOR ALL NAV LINKS
    // =====================================================
    const allNavLinks = document.querySelectorAll(
      ".navbar-nav .nav-link:not(.dropdown-toggle):not(.custom-dropdown-toggle)"
    );
    const dropdownToggles = document.querySelectorAll(
      ".navbar-nav .dropdown-toggle, .navbar-nav .custom-dropdown-toggle"
    );
  
    // Handle regular nav link clicks
    allNavLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // Clear active class from all nav links
        clearActiveStates();
  
        // Add active class to clicked link
        this.classList.add("active");
  
        // Store active page/section
        sessionStorage.setItem("activePage", this.getAttribute("href"));
        sessionStorage.removeItem("activeNavSection");
      });
    });
  
    // Helper function to clear all active states
    function clearActiveStates() {
      allNavLinks.forEach((link) => link.classList.remove("active"));
      dropdownToggles.forEach((toggle) => toggle.classList.remove("active"));
    }
  
    // =====================================================
    // DROPDOWN FUNCTIONALITY WITH ALWAYS-VISIBLE MOBILE DROPDOWNS
    // =====================================================
    document.addEventListener("DOMContentLoaded", function () {
      // =====================================================
      // DESKTOP DROPDOWN FUNCTIONALITY
      // =====================================================
      const desktopDropdowns = document.querySelectorAll(".navbar-nav .dropdown");
  
      desktopDropdowns.forEach((dropdown) => {
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        const dropdownToggle = dropdown.querySelector(
          ".dropdown-toggle, .custom-dropdown-toggle"
        );
        let timeout;
  
        // Add hover persistence for desktop
        dropdown.addEventListener("mouseenter", function () {
          if (window.innerWidth >= 992) {
            clearTimeout(timeout);
            dropdown.classList.add("show");
            dropdownMenu.classList.add("show");
          }
        });
  
        // Add slight delay before closing on mouseleave
        dropdown.addEventListener("mouseleave", function () {
          if (window.innerWidth >= 992) {
            timeout = setTimeout(function () {
              dropdown.classList.remove("show");
              dropdownMenu.classList.remove("show");
            }, 200); // 200ms delay before closing
          }
        });
  
        // Add click handler for dropdown links
        const dropdownLinks = dropdown.querySelectorAll(
          ".dropdown-menu .nav-link, .dropdown-menu .dropdown-item"
        );
        dropdownLinks.forEach((link) => {
          link.addEventListener("click", function () {
            // Close dropdown when clicking a link
            dropdown.classList.remove("show");
            dropdownMenu.classList.remove("show");
  
            // If using Bootstrap's API
            if (typeof bootstrap !== "undefined") {
              const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
              if (bsDropdown) {
                bsDropdown.hide();
              }
            }
  
            // Handle additional functionality like active states if needed
            if (typeof clearActiveStates === "function") {
              clearActiveStates();
              dropdownToggle.classList.add("active");
            }
  
            // Store the active section in sessionStorage
            sessionStorage.setItem("activeNavSection", link.getAttribute("href"));
            sessionStorage.removeItem("activePage");
  
            // Close mobile sidebar if needed
            if (window.innerWidth < 992 && typeof bootstrap !== "undefined") {
              const mobileSidebar = document.getElementById("mobileSidebar");
              if (mobileSidebar) {
                const bsOffcanvas =
                  bootstrap.Offcanvas.getInstance(mobileSidebar);
                if (bsOffcanvas) {
                  bsOffcanvas.hide();
                }
              }
            }
          });
        });
      });
  
      // =====================================================
      // ALWAYS-VISIBLE MOBILE DROPDOWN FUNCTIONALITY
      // =====================================================
      // Add mobile-specific CSS to make dropdown always visible on mobile
      const mobileStyle = document.createElement("style");
      mobileStyle.textContent = `
      /* Mobile dropdown styles */
      @media (max-width: 991px) {
        /* Always show mobile dropdown menu */
        .mobile-dropdown .mobile-dropdown-menu {
          display: block !important;
          padding-left: 15px;
          margin-top: 5px;
          list-style: none;
        }
        
        /* Remove dropdown icon or make it always point to open state */
        .mobile-dropdown .mobile-dropdown-toggle {
          transform: rotate(180deg);
        }
        
        /* Optional: Hide the dropdown toggle on mobile */
        .mobile-dropdown .custom-mobile-dropdown .fa-caret-down {
          display: none;
        }
        
        /* Optional: Style the dropdown header like a category */
        .mobile-dropdown .custom-mobile-dropdown {
          font-weight: bold;
          color: #333; /* Adjust to match your design */
          pointer-events: none; /* Remove clickability */
        }
        
        /* Indent menu items for visual hierarchy */
        .mobile-dropdown-menu .nav-link {
          padding-left: 15px;
          font-size: 0.95em; /* Slightly smaller than parent */
        }
      }
      
      /* Desktop dropdown styles - hide for larger screens */
      @media (min-width: 992px) {
        .mobile-dropdown {
          display: none;
        }
      }
    `;
      document.head.appendChild(mobileStyle);
  
      // Get all mobile dropdown items
      const mobileDropdownItems = document.querySelectorAll(
        ".mobile-dropdown-menu .nav-link"
      );
  
      // Add click handlers for mobile dropdown items
      mobileDropdownItems.forEach((item) => {
        item.addEventListener("click", function () {
          // Close mobile sidebar if it exists
          const mobileSidebar = document.getElementById("mobileSidebar");
          if (mobileSidebar && typeof bootstrap !== "undefined") {
            const sidebar = bootstrap.Offcanvas.getInstance(mobileSidebar);
            if (sidebar) {
              sidebar.hide();
            }
          }
  
          // Store the active section in sessionStorage
          sessionStorage.setItem("activeNavSection", this.getAttribute("href"));
          sessionStorage.removeItem("activePage");
        });
      });
  
      // =====================================================
      // CLOSE DESKTOP DROPDOWNS WHEN CLICKING OUTSIDE
      // =====================================================
      document.addEventListener("click", function (e) {
        // For desktop dropdowns
        if (!e.target.closest(".dropdown")) {
          const openDropdowns = document.querySelectorAll(".dropdown.show");
          openDropdowns.forEach((openDropdown) => {
            openDropdown.classList.remove("show");
            const menu = openDropdown.querySelector(".dropdown-menu");
            if (menu) menu.classList.remove("show");
  
            if (typeof bootstrap !== "undefined") {
              const dropdownToggle = openDropdown.querySelector(
                ".dropdown-toggle, .custom-dropdown-toggle"
              );
              if (dropdownToggle) {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                if (bsDropdown) {
                  bsDropdown.hide();
                }
              }
            }
          });
        }
      });
  
      // Function to handle active states if needed
      window.clearActiveStates =
        window.clearActiveStates ||
        function () {
          const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
          navLinks.forEach((link) => {
            link.classList.remove("active");
          });
        };
  
      // Handle responsive behavior on window resize
      window.addEventListener("resize", function () {
        // No additional behavior needed as CSS media queries handle the display
      });
    });
  
    // =====================================================
    // HANDLE ACTIVE STATE ON PAGE LOAD AND SCROLL
    // =====================================================
    // Check for active section/page on page load
    function setActiveNavItem() {
      const activePage = sessionStorage.getItem("activePage");
      const activeSection = sessionStorage.getItem("activeNavSection");
  
      // First clear all active states
      clearActiveStates();
  
      if (activeSection) {
        // Find the dropdown menu item with this href
        const activeLink = document.querySelector(
          `.dropdown-menu .dropdown-item[href="${activeSection}"]`
        );
        if (activeLink) {
          // Set the parent dropdown as active
          const parentDropdown = activeLink.closest(".dropdown");
          if (parentDropdown) {
            const dropdownToggle = parentDropdown.querySelector(
              ".dropdown-toggle, .custom-dropdown-toggle"
            );
            if (dropdownToggle) {
              dropdownToggle.classList.add("active");
            }
          }
        }
      } else if (activePage) {
        // Find and activate regular nav link
        const activeNavLink = document.querySelector(
          `.navbar-nav .nav-link[href="${activePage}"]`
        );
        if (activeNavLink) {
          activeNavLink.classList.add("active");
        }
      } else {
        // Default behavior - check if we're on a specific page/section
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  
        // Find link that matches current path
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          // Skip anchors and javascript links
          if (href && !href.startsWith("#") && !href.startsWith("javascript")) {
            if (
              href === currentPath ||
              href === currentPath + "/" ||
              currentPath.endsWith(href)
            ) {
              link.classList.add("active");
            }
          }
        });
  
        // If hash exists, check for matching section
        if (window.location.hash) {
          const hash = window.location.hash;
          const sectionLink = document.querySelector(
            `.dropdown-menu .dropdown-item[href="${hash}"]`
          );
          if (sectionLink) {
            const parentDropdown = sectionLink.closest(".dropdown");
            if (parentDropdown) {
              const dropdownToggle = parentDropdown.querySelector(
                ".dropdown-toggle, .custom-dropdown-toggle"
              );
              if (dropdownToggle) {
                clearActiveStates();
                dropdownToggle.classList.add("active");
              }
            }
          }
        }
      }
    }
  
    // Set active state on page load
    setActiveNavItem();
  
    // Update active state on scroll but only for section links
    // This prevents the product link from staying active when scrolling past sections
    window.addEventListener("scroll", function () {
      // Only update based on scroll if we have an active section
      if (sessionStorage.getItem("activeNavSection")) {
        // Get all sections that are targets of dropdown items
        const sections = document.querySelectorAll("section[id], div[id]");
        let currentSection = "";
  
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
  
          // If we've scrolled to this section
          if (window.scrollY >= sectionTop - 200) {
            currentSection = "#" + section.getAttribute("id");
          }
        });
  
        if (currentSection !== "") {
          // Find the dropdown item that links to this section
          const activeLink = document.querySelector(
            `.dropdown-menu .dropdown-item[href="${currentSection}"]`
          );
          if (activeLink) {
            // Store the current section
            sessionStorage.setItem("activeNavSection", currentSection);
  
            // Set parent dropdown as active
            const parentDropdown = activeLink.closest(".dropdown");
            if (parentDropdown) {
              const dropdownToggle = parentDropdown.querySelector(
                ".dropdown-toggle, .custom-dropdown-toggle"
              );
              if (dropdownToggle) {
                clearActiveStates();
                dropdownToggle.classList.add("active");
              }
            }
          }
        }
      }
    });
  });
  