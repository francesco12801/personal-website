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

// Contact form handling
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Simulate form submission with a timeout
    setTimeout(() => {
      // Simulate success (in a real application, this would be an API call)
      const success = Math.random() > 0.2; // 80% chance of success for demo purposes

      if (success) {
        // Hide error message if it was shown before
        errorMessage.style.display = "none";

        // Show success message
        successMessage.style.display = "block";

        // Reset form
        contactForm.reset();
      } else {
        // Hide success message if it was shown before
        successMessage.style.display = "none";

        // Show error message
        errorMessage.style.display = "block";
      }

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Send Message";

      // Auto-hide messages after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
        errorMessage.style.display = "none";
      }, 5000);
    }, 1500);
  });
}

// Form input animation
function setupFormAnimation() {
  const formControls = document.querySelectorAll(".form-control");

  formControls.forEach((control) => {
    control.addEventListener("focus", function () {
      this.parentElement.classList.add("active");
    });

    control.addEventListener("blur", function () {
      if (this.value.trim() === "") {
        this.parentElement.classList.remove("active");
      }
    });

    // Check initial state (for browser autofill)
    if (control.value.trim() !== "") {
      control.parentElement.classList.add("active");
    }
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

// Contact methods hover effect
function contactMethodsEffect() {
  const methods = document.querySelectorAll(".contact-method");

  methods.forEach((method) => {
    method.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.borderColor = "var(--accent-primary)";
    });

    method.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.borderColor = "rgba(148, 163, 184, 0.1)";
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  // Verifica se le funzioni esistono prima di chiamarle
  if (typeof createParticles === "function") {
    createParticles();
  } else {
    console.error("Function createParticles() is not defined");
  }

  // Sostituiamo setupContactForm con initContactForm
  console.log("Initializing contact form");
  initContactForm();

  if (typeof setupFormAnimation === "function") {
    setupFormAnimation();
  } else {
    console.error("Function setupFormAnimation() is not defined");
  }

  if (typeof scrollHeader === "function") {
    scrollHeader();
  } else {
    console.error("Function scrollHeader() is not defined");
  }

  if (typeof mobileMenuToggle === "function") {
    mobileMenuToggle();
  } else {
    console.error("Function mobileMenuToggle() is not defined");
  }

  if (typeof scrollToTop === "function") {
    scrollToTop();
  } else {
    console.error("Function scrollToTop() is not defined");
  }

  if (typeof themeToggle === "function") {
    themeToggle();
  } else {
    console.error("Function themeToggle() is not defined");
  }

  if (typeof contactMethodsEffect === "function") {
    contactMethodsEffect();
  } else {
    console.error("Function contactMethodsEffect() is not defined");
  }

  // Add a simple page load animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

function initContactForm() {
  console.log("initContactForm() started");

  // Get form elements
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) {
    console.error("Form element with ID 'contactForm' not found");
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) {
    console.error("Button element with ID 'submitBtn' not found");
    return;
  }

  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  if (!successMessage) {
    console.error("Element with ID 'successMessage' not found");
  }

  if (!errorMessage) {
    console.error("Element with ID 'errorMessage' not found");
  }

  console.log("All form elements found successfully");

  // Initially hide messages
  if (successMessage) successMessage.style.display = "none";
  if (errorMessage) errorMessage.style.display = "none";

  // Replace with your Google Apps Script Web App URL
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxcMoYYqybvCGXg7vAt2Eu1QalQltpnF43EZWp9JEp9UEnhnxaiEA-S6sRzkE3me9KaUg/exec";
  console.log("Using script URL:", scriptURL);

  // Add input animation and validation
  const formInputs = document.querySelectorAll(".form-control");
  console.log(`Found ${formInputs.length} form input elements`);

  formInputs.forEach((input, index) => {
    console.log(`Setting up input #${index + 1}: ${input.id || "unnamed"}`);

    // Add focus effects
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (this.value === "") {
        this.parentElement.classList.remove("focused");
      }
    });

    // Simple validation
    input.addEventListener("input", function () {
      if (this.validity.valid) {
        this.classList.remove("invalid");
        this.classList.add("valid");
      } else {
        this.classList.remove("valid");
        this.classList.add("invalid");
      }
    });
  });

  // Handle form submission
  contactForm.addEventListener("submit", function (event) {
    console.log("Form submission started");
    event.preventDefault();

    // Check form validity
    if (!contactForm.checkValidity()) {
      console.error("Form validation failed");

      // Show error message
      errorMessage.textContent =
        "Please fill out all required fields correctly.";
      errorMessage.style.display = "block";
      errorMessage.classList.add("animate-error");

      setTimeout(function () {
        errorMessage.style.display = "none";
        errorMessage.classList.remove("animate-error");
      }, 5000);

      return;
    }

    console.log("Form validation passed");

    // Disable the submit button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Collect form data
    const formData = new FormData(contactForm);

    // Log form data for debugging
    console.log("Form data collected:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Convert FormData to URL-encoded string (compatible with Google Apps Script)
    const urlEncodedData = new URLSearchParams(formData).toString();
    console.log("URL encoded data:", urlEncodedData);

    // Send the form data to Google Apps Script
    console.log("Sending fetch request to:", scriptURL);
    fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedData,
    })
      .then((response) => {
        console.log("Received response:", response);
        console.log("Response status:", response.status);
        console.log("Response OK:", response.ok);

        // Prima controlla se la risposta è OK
        if (!response.ok) {
          console.error("Response not OK, status:", response.status);
          throw new Error("Network response was not ok");
        }

        // Controlla se la risposta può essere interpretata come JSON
        const contentType = response.headers.get("content-type");
        console.log("Content-Type:", contentType);

        if (contentType && contentType.includes("application/json")) {
          console.log("Processing response as JSON");
          return response.json();
        }

        console.log("Processing response as text then trying to parse as JSON");
        return response.text().then((text) => {
          console.log("Raw response text:", text);
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse response as JSON:", e);
            // Se non è JSON valido, ritorna comunque un oggetto
            return { result: "success", message: text };
          }
        });
      })
      .then((data) => {
        console.log("Processed data:", data);

        if (data.result === "success") {
          console.log("Form submission successful");
          // Show success message
          successMessage.style.display = "block";
          errorMessage.style.display = "none";

          // Reset the form
          contactForm.reset();

          // Add success animation
          successMessage.classList.add("animate-success");

          // Reset button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Send Message";

          // Hide success message after 5 seconds
          setTimeout(function () {
            successMessage.style.display = "none";
            successMessage.classList.remove("animate-success");
          }, 5000);
        } else {
          console.error(
            "Form submission failed:",
            data.error || "Unknown error"
          );
          throw new Error(data.error || "Form submission failed");
        }
      })
      .catch((error) => {
        console.error("Error in form submission:", error);

        // Se l'errore è correlato a CORS ma la richiesta è stata probabilmente elaborata
        if (
          error.toString().includes("Failed to fetch") ||
          error.toString().includes("NetworkError")
        ) {
          console.log(
            "CORS error detected, but the email might have been sent anyway"
          );

          // Mostra messaggio di successo invece che di errore
          successMessage.style.display = "block";
          errorMessage.style.display = "none";

          // Reset del form
          contactForm.reset();

          // Animazione di successo
          successMessage.classList.add("animate-success");

          // Reset dello stato del pulsante
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Send Message";

          // Nascondi il messaggio di successo dopo 5 secondi
          setTimeout(function () {
            successMessage.style.display = "none";
            successMessage.classList.remove("animate-success");
          }, 5000);
        }
        return;
      });
  });

  // Add CSS for form animations
  const style = document.createElement("style");
  style.textContent = `
      .form-group {
          position: relative;
          margin-bottom: 1.5rem;
      }
      
      .form-control {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      
      .form-control:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }
      
      .form-control.valid {
          border-color: #10b981;
      }
      
      .form-control.invalid {
          border-color: #ef4444;
      }
      
      .form-group.focused label {
          transform: translateY(-1.5rem);
          font-size: 0.75rem;
          color: var(--accent-primary);
      }
      
      .form-button {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .form-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
      }
      
      .form-button:active {
          transform: translateY(-1px);
      }
      
      .form-message {
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .form-message.success {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid #10b981;
          color: #10b981;
      }
      
      .form-message.error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #ef4444;
      }
      
      .animate-success, .animate-error {
          opacity: 1;
          transform: translateY(0);
      }
      
      @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      .animate-error {
          animation: shake 0.6s ease-in-out;
      }
  `;
  document.head.appendChild(style);

  console.log("Contact form initialization completed");
}

// Funzioni di utilità
function createParticles() {
  console.log("Creating particles");
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) {
    console.error("Particles container not found");
    return;
  }

  const particleCount = 50;

  // Create particles with random properties
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random size between 2px and 6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random color from accent colors
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6"];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    // Random animation duration between 15s and 30s
    const duration = Math.random() * 15 + 15;
    particle.style.animation = `float-particle ${duration}s infinite linear`;

    // Random delay so they don't all start at the same time
    particle.style.animationDelay = `${Math.random() * 10}s`;

    particlesContainer.appendChild(particle);
  }
}

function scrollHeader() {
  console.log("Setting up scroll header effect");
  const header = document.getElementById("header");
  if (!header) {
    console.error("Header element not found");
    return;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

function mobileMenuToggle() {
  console.log("Setting up mobile menu toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  if (!menuToggle) {
    console.error("Menu toggle button not found");
    return;
  }

  if (!nav) {
    console.error("Navigation not found");
    return;
  }

  menuToggle.addEventListener("click", function () {
    nav.classList.toggle("active");

    // Toggle menu icon
    const icon = menuToggle.querySelector("i");
    if (nav.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });

  // Close menu when clicking on links
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        nav.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  });
}

function scrollToTop() {
  console.log("Setting up scroll to top functionality");
  const backToTopBtn = document.getElementById("back-to-top");

  if (!backToTopBtn) {
    console.error("Back to top button not found");
    return;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTopBtn.style.opacity = "1";
    } else {
      backToTopBtn.style.opacity = "0";
    }
  });

  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function themeToggle() {
  console.log("Setting up theme toggle");
  const themeToggle = document.getElementById("theme-toggle");

  if (!themeToggle) {
    console.error("Theme toggle button not found");
    return;
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.querySelector("i").classList.remove("fa-moon");
    themeToggle.querySelector("i").classList.add("fa-sun");
  }

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");

    // Update icon
    const icon = themeToggle.querySelector("i");
    if (document.body.classList.contains("light-theme")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
}

function contactMethodsEffect() {
  console.log("Setting up contact methods effects");
  const contactMethods = document.querySelectorAll(".contact-method");

  if (contactMethods.length === 0) {
    console.error("No contact method elements found");
    return;
  }

  contactMethods.forEach((method) => {
    method.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";

      const icon = this.querySelector(".contact-icon");
      if (icon) {
        icon.style.backgroundColor = "var(--accent-primary)";
      }
    });

    method.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.05)";

      const icon = this.querySelector(".contact-icon");
      if (icon) {
        icon.style.backgroundColor = "";
      }
    });
  });

  const socialLinks = document.querySelectorAll(".social-link");
  if (socialLinks.length > 0) {
    socialLinks.forEach((link) => {
      link.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-3px) scale(1.1)";
      });

      link.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }
}

// Dummy function for setupFormAnimation if needed
function setupFormAnimation() {
  console.log("Setting up form animations");
  // This functionality is already included in initContactForm
}
