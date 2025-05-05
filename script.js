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
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                // Scroll to the target with offset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
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

// Toggle between seller login and signup forms
document
  .getElementById("sellerLoginBtn")
  .addEventListener("click", function () {
    document.getElementById("sellerLoginForm").classList.remove("d-none");
    document.getElementById("sellerSignupForm").classList.add("d-none");
    document.getElementById("sellerLoginBtn").classList.add("active");
    document.getElementById("sellerSignupBtn").classList.remove("active");
  });

document
  .getElementById("sellerSignupBtn")
  .addEventListener("click", function () {
    document.getElementById("sellerLoginForm").classList.add("d-none");
    document.getElementById("sellerSignupForm").classList.remove("d-none");
    document.getElementById("sellerLoginBtn").classList.remove("active");
    document.getElementById("sellerSignupBtn").classList.add("active");
  });

// User authentication logic
document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const guestButtons = document.getElementById("guestButtons");
  const userDropdown = document.getElementById("userDropdown");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const userDropdownToggle = document.getElementById("userDropdownToggle");
  const userDropdownMenu = document.getElementById("userDropdownMenu");
  const adminPanelLink = document.getElementById("adminPanelLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const sellerLoginForm = document.getElementById("sellerLoginForm");
  const sellerSignupForm = document.getElementById("sellerSignupForm");
  const successToast = document.getElementById("successToast");
  const successToastMessage = document.getElementById("successToastMessage");

  // Check if user is logged in (from session storage)
  function checkLoginStatus() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser) {
      // User is logged in
      showLoggedInState(currentUser);
    }
  }

  // Show logged in state
  function showLoggedInState(user) {
    guestButtons.classList.add("d-none");
    userDropdown.classList.remove("d-none");

    // Get initials (e.g., "K R" → "KR")
    const nameParts = user.username.trim().split(" ");
    let initials = nameParts[0]?.charAt(0).toUpperCase() || "";
    if (nameParts.length > 1) {
      initials += nameParts[1]?.charAt(0).toUpperCase() || "";
    }

    usernameDisplay.textContent = initials;

    // Tooltip to show full username
    usernameDisplay.setAttribute("title", user.username);

    // Refresh tooltip
    bootstrap.Tooltip.getInstance(usernameDisplay)?.dispose();
    new bootstrap.Tooltip(usernameDisplay);

    // Show admin link if seller
    if (user.isSeller) {
      adminPanelLink.classList.remove("d-none");
    } else {
      adminPanelLink.classList.add("d-none");
    }
  }

  // Show logged out state
  function showLoggedOutState() {
    userDropdown.classList.add("d-none");
    guestButtons.classList.remove("d-none");
  }

  // Toggle dropdown menu
  userDropdownToggle.addEventListener("click", function () {
    userDropdownMenu.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (!userDropdown.contains(event.target)) {
      userDropdownMenu.classList.remove("show");
    }
  });

  // Login form submission
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simple validation
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Mock login (in a real app, this would be an API call)
    const user = {
      username: username,
      isSeller: false,
    };

    // Store user in session
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    // Update UI
    showLoggedInState(user);

    // Close modal - FIXED for Bootstrap 5
    const loginModal = bootstrap.Modal.getInstance(
      document.getElementById("authModal")
    );
    if (loginModal) {
      loginModal.hide();
    }

    // Show success message - Bootstrap 5 syntax
    successToastMessage.textContent = `Welcome back, ${username}!`;
    const toast = new bootstrap.Toast(document.getElementById("successToast"));
    toast.show();

    // Reset form
    loginForm.reset();
  });

  // Sign up form submission
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;
    const termsCheck = document.getElementById("termsCheck").checked;

    // Simple validation
    if (!username || !email || !password || !termsCheck) {
      alert("Please fill in all fields and agree to the terms");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // Mock sign up (in a real app, this would be an API call)
    const user = {
      username: username,
      email: email,
      isSeller: false,
    };

    // Store user in session
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    // Update UI
    showLoggedInState(user);

    // Close modal - FIXED for Bootstrap 5
    const signupModal = bootstrap.Modal.getInstance(
      document.getElementById("authModal")
    );
    if (signupModal) {
      signupModal.hide();
    }

    // Show success message - Bootstrap 5 syntax
    successToastMessage.textContent = `Account created successfully. Welcome, ${username}!`;
    const toast = new bootstrap.Toast(document.getElementById("successToast"));
    toast.show();

    // Reset form
    signupForm.reset();
  });

  // Seller login form submission
  sellerLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("sellerLoginUsername").value;
    const password = document.getElementById("sellerLoginPassword").value;

    // Simple validation
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Mock seller login (in a real app, this would be an API call)
    const user = {
      username: username,
      isSeller: true,
    };

    // Store user in session
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    // Update UI
    showLoggedInState(user);

    // Close modal - FIXED for Bootstrap 5
    const sellerModal = bootstrap.Modal.getInstance(
      document.getElementById("sellerModal")
    );
    if (sellerModal) {
      sellerModal.hide();
    }

    // Show success message - Bootstrap 5 syntax
    successToastMessage.textContent = `Welcome back, Seller ${username}!`;
    const toast = new bootstrap.Toast(document.getElementById("successToast"));
    toast.show();

    // Reset form
    sellerLoginForm.reset();
  });

  // Seller sign up form submission
  sellerSignupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const shopName = document.getElementById("shopName").value;
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    const termsCheck = document.getElementById("sellerTermsCheck").checked;

    // Simple validation
    if (
      !fullName ||
      !email ||
      !shopName ||
      !username ||
      !password ||
      !termsCheck
    ) {
      alert("Please fill in all fields and agree to the terms");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // Mock seller sign up (in a real app, this would be an API call)
    const user = {
      username: username,
      fullName: fullName,
      email: email,
      shopName: shopName,
      isSeller: true,
    };

    // Store user in session
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    // Update UI
    showLoggedInState(user);

    // Close modal - FIXED
    $("#sellerModal").modal("hide");

    // Show success message - Bootstrap 5 syntax
    successToastMessage.textContent = `Seller account created successfully. Welcome, ${username}!`;
    const toast = new bootstrap.Toast(document.getElementById("successToast"));
    toast.show();

    // Reset form
    sellerSignupForm.reset();
  });

  // Logout button
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();

    // Remove user from session
    sessionStorage.removeItem("currentUser");

    // Update UI
    showLoggedOutState();

    // Close dropdown
    userDropdownMenu.classList.remove("show");

    // Show success message - Bootstrap 5 syntax
    successToastMessage.textContent = "Logged out successfully!";
    const toast = new bootstrap.Toast(document.getElementById("successToast"));
    toast.show();
  });

  // Check login status on page load
  checkLoginStatus();
});

// Initialize tooltips - Bootstrap 5 syntax
document.addEventListener("DOMContentLoaded", function () {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get toggle checkbox and forms
  const authToggle = document.getElementById("authToggle");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const modalTitleText = document.getElementById("modalTitleText");

  // Toggle between login and signup forms
  authToggle.addEventListener("change", function () {
    if (this.checked) {
      // Show signup form, hide login form
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      modalTitleText.innerHTML = "Create an Account";
    } else {
      // Show login form, hide signup form
      loginForm.style.display = "block";
      signupForm.style.display = "none";
      modalTitleText.innerHTML = "Login to Your Account";
    }
  });

  // Reset to login form when modal is closed - Bootstrap 5 syntax
  document
    .getElementById("authModal")
    .addEventListener("hidden.bs.modal", function () {
      authToggle.checked = false;
      loginForm.style.display = "block";
      signupForm.style.display = "none";
      modalTitleText.innerHTML = "Login to Your Account";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Product data
  const products = [
    {
      id: 1,
      name: "Player: One",
      price: 126518,
      badge: "Entry Level",
      image: "Images/player-1-ww-09-04-24-hero-white-badge-amd.png",
      description: "H5 Flow RTX 3050 Gaming PC",
      rating: 4.5,
      reviewCount: 126,
      specs: [
        "AMD Ryzen 5 / Intel Core i5",
        "NVIDIA RTX 3050 8GB",
        "16GB DDR4 RAM",
        "1TB NVMe SSD",
      ],
    },
    {
      id: 2,
      name: "Player: Two",
      price: 136928,
      badge: "Mid-Range",
      image: "Images/player-two-base-ww-09-04-24-hero-white-badge.png",
      description: "H6 Flow RTX 4070 Gaming PC",
      rating: 4,
      reviewCount: 98,
      specs: [
        "AMD Ryzen 7 / Intel Core i7",
        "NVIDIA RTX 4070 12GB",
        "32GB DDR5 RAM",
        "2TB NVMe SSD",
      ],
    },
    {
      id: 3,
      name: "Player: Three",
      price: 193996,
      badge: "High-End",
      image: "Images/player-three-base-ww-09-04-24-hero-white-badge.png",
      description: "H7 Flow RTX 4070 Ti Gaming PC",
      rating: 3.5,
      reviewCount: 72,
      specs: [
        "AMD Ryzen 9 / Intel Core i9",
        "NVIDIA RTX 4070 Ti 16GB",
        "32GB DDR5 RAM",
        "2TB NVMe SSD",
      ],
    },
    {
      id: 4,
      name: "Player: One Prime",
      price: 105394,
      badge: "Value",
      image: "Images/player-1-prime-ww-09-04-24-hero-white-badge-amd.png",
      description: "H5 Flow RTX 4060 Ti Gaming PC",
      rating: 4,
      reviewCount: 85,
      specs: [
        "AMD Ryzen 5 / Intel Core i5",
        "NVIDIA RTX 4060 Ti 8GB",
        "16GB DDR5 RAM",
        "1TB NVMe SSD",
      ],
    },
    {
      id: 5,
      name: "Player: Two Prime",
      price: 111120,
      badge: "Popular",
      image: "Images/player-two-premium-ww-09-04-24-hero-white-amd.png",
      description: "H6 Flow RGB RTX 4070 Ti SUPER Gaming PC",
      rating: 4.5,
      reviewCount: 142,
      specs: [
        "AMD Ryzen 7 / Intel Core i7",
        "NVIDIA RTX 4070 Ti SUPER 16GB",
        "32GB DDR5 RAM",
        "2TB NVMe SSD",
      ],
    },
    {
      id: 6,
      name: "Player: Three Prime",
      price: 312133,
      badge: "Ultimate",
      image: "Images/player-three-prime-ww-09-04-24-hero-white-amd.png",
      description: "H9 Elite RTX 4090 Gaming PC",
      rating: 3.5,
      reviewCount: 54,
      specs: [
        "AMD Ryzen 9 / Intel Core i9",
        "NVIDIA RTX 4090 24GB",
        "64GB DDR5 RAM",
        "4TB NVMe SSD",
      ],
    },
  ];

  // Function to create star rating HTML
  function createStarRating(rating) {
    let starsHtml = "";
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 >= 0.5;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }

    return starsHtml;
  }

  // Function to create product HTML
  function createProductHTML(product) {
    return `
    <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="card product-card h-100" data-product-name="${
          product.name
        }" data-product-price="${product.price}">
            <div class="position-relative image-container">
                <span class="position-absolute badge">${product.badge}</span>
                <img src="${
                  product.image
                }" class="card-img-top product-image" alt="${product.name}">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <div class="product-rating mb-2">
                    ${createStarRating(product.rating)}
                    <span class="ms-1 text-muted">(${
                      product.reviewCount
                    } reviews)</span>
                </div>
                <p class=" product-price ">₹ ${product.price.toLocaleString(
                  "en-IN"
                )}</p>
                <p class="card-text">${product.description}</p>
                
                <h6 class="mt-3">Key Specifications:</h6>
                <ul class="list-unstyled specs-list mb-4">
                    ${product.specs
                      .map(
                        (spec) =>
                          `<li><i class="fas fa-${getIconForSpec(
                            spec
                          )} me-2"></i> ${spec}</li>`
                      )
                      .join("")}
                </ul>
                
                <button class="btn btn-primary mt-auto shop-button" data-bs-toggle="modal" data-bs-target="#buyNowModal" 
                        data-product-name="${
                          product.name
                        }" data-product-price="${product.price}">
                    Shop Now
                </button>
            </div>
        </div>
    </div>
`;
  }

  // Function to get appropriate icon for specification
  function getIconForSpec(spec) {
    if (spec.includes("Ryzen") || spec.includes("Core i")) return "microchip";
    if (spec.includes("RTX")) return "tv";
    if (spec.includes("RAM")) return "memory";
    if (spec.includes("SSD")) return "hdd";
    return "check";
  }

  // Function to toggle empty state visibility
  function toggleEmptyState() {
    const productContainer = document.getElementById("product-container");
    const emptyState = document.getElementById("empty-state");

    if (productContainer && emptyState) {
      if (productContainer.children.length === 0) {
        emptyState.style.display = "block";
      } else {
        emptyState.style.display = "none";
      }
    }
  }

  // Function to render products
  function renderProducts(productsToRender = products) {
    const productContainer = document.getElementById("product-container");
    if (!productContainer) return;

    productContainer.innerHTML = ""; // Clear existing products

    productsToRender.forEach((product) => {
      productContainer.innerHTML += createProductHTML(product);
    });

    // Toggle empty state visibility
    toggleEmptyState();
  }

  // Expose the renderProducts function globally
  window.renderProducts = renderProducts;

  // Function to load all products
  window.loadAllProducts = function () {
    document.querySelectorAll(".category-filters .btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    document.querySelector(".show-all-btn").classList.add("active");

    renderProducts();
  };
  loadAllProducts();

  // Function to load products by category
  window.loadProductsByCategory = function (category) {
    document.querySelectorAll(".category-filters .btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(".show-all-btn").classList.remove("active");

    document
      .querySelector(`.category-filters .btn[onclick*="${category}"]`)
      .classList.add("active");

    const filteredProducts = products.filter((product) => {
      if (category === "entry-level") {
        return product.badge === "Entry Level" || product.badge === "Value";
      } else if (category === "mid-range") {
        return product.badge === "Mid-Range" || product.badge === "Popular";
      } else if (category === "high-end") {
        return product.badge === "High-End" || product.badge === "Ultimate";
      }
      return true;
    });

    renderProducts(filteredProducts);
  };

  // Function to load products by price range
  window.loadProductsByPriceRange = function (minPrice, maxPrice) {
    document.querySelectorAll(".category-filters .btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(".show-all-btn").classList.remove("active");

    const filteredProducts = products.filter((product) => {
      return product.price >= minPrice && product.price <= maxPrice;
    });

    renderProducts(filteredProducts);
  };

  // Setup modal event listeners
  const buyNowModal = document.getElementById("buyNowModal");
  if (buyNowModal) {
    buyNowModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const productName = button.getAttribute("data-product-name");
      const productPrice = button.getAttribute("data-product-price");

      const modalProductName = document.getElementById("modalProductName");
      const modalProductPrice = document.getElementById("modalProductPrice");

      if (modalProductName && modalProductPrice) {
        modalProductName.textContent = productName;
        modalProductPrice.textContent =
          Number(productPrice).toLocaleString("en-IN");
      }
    });
  }

  // Add sort functionality
  window.sortProducts = function (sortBy) {
    let sortedProducts = [...products];

    if (sortBy === "price-low") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(sortedProducts);
  };

  // Initialize empty state on page load
  toggleEmptyState();
});

// Get the product details and set them in the modal when the "Shop Now" button is clicked
document.querySelectorAll(".shop-button").forEach((button) => {
    button.addEventListener("click", function () {
        const product = this.closest(".productt");
        const productName = product.getAttribute("data-product-name");
        const productPrice = product.getAttribute("data-product-price");
        document.getElementById("modalProductName").textContent = productName;
        document.getElementById("modalProductPrice").textContent = productPrice;
        document.getElementById("totalPrice").textContent = productPrice;
        
        // Use Bootstrap 5 modal method to show the modal
        const buyNowModal = new bootstrap.Modal(document.getElementById('buyNowModal'));
        buyNowModal.show();
    });
});

// Quantity selector functionality
const increaseButton = document.getElementById("increaseQuantity");
const decreaseButton = document.getElementById("decreaseQuantity");
const quantityInput = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
let pricePerUnit = 0;

increaseButton.addEventListener("click", function () {
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity++;
    quantityInput.value = currentQuantity;
    updateTotalPrice(currentQuantity);
});

decreaseButton.addEventListener("click", function () {
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
        updateTotalPrice(currentQuantity);
    }
});

// Helper function to update total price
function updateTotalPrice(quantity) {
    totalPrice.textContent = (quantity * pricePerUnit).toLocaleString('en-IN');
}

// Set the price per unit when the modal is shown - Bootstrap 5 syntax
const buyNowModal = document.getElementById('buyNowModal');
buyNowModal.addEventListener('shown.bs.modal', function () {
  // Reset the form and quantity input first
  document.getElementById("orderForm").reset();
  quantityInput.value = "1";

  // Then get the updated price and update total price
  pricePerUnit = parseInt(document.getElementById("modalProductPrice").textContent.replace(/[^\d]/g, ""));

  updateTotalPrice(1);  // use 1 since you just reset it
});

// Place order button functionality
document.getElementById("placeOrderButton").addEventListener("click", function () {
    const form = document.getElementById("orderForm");
    if (form.checkValidity()) {
        alert("Order placed successfully! This is a demo. In a real application, you would be redirected to payment processing.");
        
        // Hide modal using Bootstrap 5 method
        const modal = bootstrap.Modal.getInstance(buyNowModal);
        modal.hide();
    } else {
        form.reportValidity(); // Trigger validation
    }
});

// Animation effects on scroll
window.addEventListener('scroll', function () {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const position = card.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Initialize all tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});