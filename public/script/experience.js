// Generate random particles
function createParticles() {
  const particles = document.getElementById("particles");
  const colors = ["#3b82f6", "#6366f1", "#8b5cf6"];

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random properties
    const size = Math.random() * 15 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Position
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;

    // Apply styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;

    // Animation properties
    particle.style.animationDuration = `${Math.random() * 30 + 15}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    particles.appendChild(particle);
  }
}

// Tab switching
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabSections = document.querySelectorAll(".timeline-section");
  const tabIndicator = document.querySelector(".tab-indicator");

  function setActiveTab(tabId) {
    // Hide all sections
    tabSections.forEach((section) => {
      section.classList.remove("active");
    });

    // Show the active section
    document.getElementById(`${tabId}-timeline`).classList.add("active");

    // Update buttons
    tabButtons.forEach((button) => {
      if (button.dataset.tab === tabId) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });

    // Move the indicator
    if (tabId === "academic") {
      tabIndicator.style.left = "0.25rem";
    } else {
      tabIndicator.style.left = "50%";
    }
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setActiveTab(this.dataset.tab);
    });
  });
}

// Scroll header effect
function scrollHeader() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Mobile menu toggle
function mobileMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll("nav ul li a");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.innerHTML = nav.classList.contains("active")
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

// Scroll to top
function scrollToTop() {
  const backToTop = document.getElementById("back-to-top");

  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Theme toggle (just for show - always stays in dark mode)
function themeToggle() {
  const themeToggle = document.getElementById("theme-toggle");

  themeToggle.addEventListener("click", () => {
    themeToggle.innerHTML = themeToggle.innerHTML.includes("moon")
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';

    // Show a notification
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.padding = "15px 20px";
    notification.style.background = "var(--accent-primary)";
    notification.style.color = "white";
    notification.style.borderRadius = "var(--border-radius)";
    notification.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    notification.style.zIndex = "1000";
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";
    notification.style.transition = "all 0.3s ease";
    notification.textContent =
      "Dark mode is the only available theme for this website.";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 100);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  });
}

// Timeline animation on scroll
function timelineAnimation() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
        }
      });
    },
    { threshold: 0.1 }
  );

  timelineItems.forEach((item) => {
    observer.observe(item);
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  setupTabs();
  scrollHeader();
  mobileMenuToggle();
  scrollToTop();
  themeToggle();
  timelineAnimation();

  // Add a simple page load animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
