import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Global variables
let app, db;
let currentFilter = "all";
let expandedPostId = null;

// Initialize Firebase by fetching config from Cloud Function
async function initializeFirebase() {
  try {    

    try {
      const firebaseConfig = {
        apiKey: "AIzaSyCTu9H9MJOVP7DooGv5ZAQrpd1PRBBKyBg",
        authDomain: "personal-web-site-9f769.firebaseapp.com",
        databaseURL: "https://personal-web-site-9f769-default-rtdb.firebaseio.com",
        projectId: "personal-web-site-9f769",
        storageBucket: "personal-web-site-9f769.firebasestorage.app",
        messagingSenderId: "783944910554",
        appId: "1:783944910554:web:d8af9c0572d9d61b6a47e3",
        measurementId: "G-8Q29E84FVH"
      };
      console.log("Firebase configuration loaded successfully");
      
      // Initialize Firebase with the fetched configuration
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      
      // Now that Firebase is initialized, load the blog content
      await loadPosts();
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      
      // Log the actual response text to help debug
      const responseText = await response.text();
      console.log("Response text:", responseText);
      
      showErrorMessage("Could not parse Firebase configuration. Please check your server response.");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    showErrorMessage("Error connecting to Firebase. Please try again later.");
  }
}

// Show error message in the blog container
function showErrorMessage(message) {
  const blogContainer = document.querySelector('.blog-container');
  if (blogContainer) {
    blogContainer.innerHTML = `
      <div class="error-message">
        <h3>Failed to load blog content</h3>
        <p>${message}</p>
        <button id="retryButton" class="retry-button">Retry</button>
      </div>
    `;
    
    // Add retry functionality
    document.getElementById('retryButton')?.addEventListener('click', () => {
      blogContainer.innerHTML = '<div class="loading">Connecting to database...</div>';
      initializeFirebase();
    });
  }
}

// Load posts from Firestore
async function loadPosts() {
  try {
    const blogContainer = document.querySelector('.blog-container');
    const featuredBlogContent = document.querySelector('.featured-blog-card');
    
    if (!blogContainer) {
      console.error('Blog container not found');
      return;
    }
    
    blogContainer.innerHTML = '<div class="loading">Loading posts...</div>';
    
    // Get featured post
    const featuredSnapshot = await getDocs(query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(1)
    ));
    
    let featuredPost = null;
    
    if (!featuredSnapshot.empty) {
      featuredPost = {
        id: featuredSnapshot.docs[0].id,
        ...featuredSnapshot.docs[0].data()
      };
      
      if (featuredBlogContent) {
        const featuredDate = featuredPost.timestamp 
          ? new Date(featuredPost.timestamp.toDate()).toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })
          : 'Date not available';
          
        // Costruzione condizionale del featured post
        const featuredImageHtml = featuredPost.imageUrl 
          ? `<div class="featured-blog-image">
               <img src="${featuredPost.imageUrl}" alt="${featuredPost.title}">
             </div>`
          : '';
          
        featuredBlogContent.innerHTML = `
          ${featuredImageHtml}
          <div class="featured-blog-content">
            <span class="blog-category">${featuredPost.category || 'Uncategorized'}</span>
            <h2 class="featured-blog-title">${featuredPost.title}</h2>
            <div class="blog-meta">
              <div class="blog-author">
                <span>${featuredPost.authorEmail || 'Admin'}</span>
              </div>
              <div class="blog-date">${featuredDate}</div>
            </div>
            <p>${featuredPost.content}</p>
          </div>
        `;

        // Aggiusta il layout in base alla presenza dell'immagine
        featuredBlogContent.className = `featured-blog-card${featuredPost.imageUrl ? ' has-image' : ' no-image'}`;
      }
    }
    
    // Get regular posts
    let postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(6)
    );
    
    if (currentFilter !== "all") {
      postsQuery = query(
        collection(db, "posts"),
        where("category", "==", currentFilter),
        orderBy("timestamp", "desc"),
        limit(6)
      );
    }
    
    const postsSnapshot = await getDocs(postsQuery);
    
    blogContainer.innerHTML = '';
    
    if (postsSnapshot.empty && !featuredPost) {
      blogContainer.innerHTML = '<p class="no-posts">No posts available yet. Check back soon!</p>';
      return;
    }
    
    let rowContainer = document.createElement('div');
    rowContainer.className = 'blog-row';
    blogContainer.appendChild(rowContainer);
    
    let delay = 1;
    postsSnapshot.forEach((doc) => {
      if (featuredPost && doc.id === featuredPost.id) return;
      
      const post = {
        id: doc.id,
        ...doc.data()
      };
      
      const postDate = post.timestamp 
        ? new Date(post.timestamp.toDate()).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          })
        : 'Date not available';
      
      // Costruzione condizionale della card
      const imageHtml = post.imageUrl 
        ? `<div class="blog-card-image">
             <img src="${post.imageUrl}" alt="${post.title}">
           </div>`
        : '';
      
      const blogCard = document.createElement('div');
      blogCard.className = `blog-card${post.imageUrl ? ' has-image' : ' no-image'}`;
      blogCard.style = `--delay: ${delay}`;
      blogCard.innerHTML = `
        ${imageHtml}
        <div class="blog-card-content">
          <span class="blog-category">${post.category || 'Uncategorized'}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <div class="blog-meta">
            <div class="blog-author">
              <span>${post.authorEmail || 'Admin'}</span>
            </div>
            <div class="blog-date">${postDate}</div>
          </div>
          <p>${post.content}</p>
        </div>
      `;
      
      rowContainer.appendChild(blogCard);
      delay++;
    });
    
  } catch (error) {
    console.error("Error loading posts:", error);
    showErrorMessage("Error fetching blog posts. Please check your connection or try again later.");
  }
}

// Setup expand/collapse functionality for posts
function setupExpandCollapse() {
  // For regular posts
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  expandButtons.forEach(button => {
    const postId = button.getAttribute('data-id');
    const contentElement = document.getElementById(`content-${postId}`);
    
    if (contentElement) {
      contentElement.style.display = 'none';
      
      button.addEventListener('click', function() {
        const isExpanded = this.classList.contains('expanded');
        
        // First collapse any currently expanded post
        if (expandedPostId && expandedPostId !== postId) {
          const prevButton = document.querySelector(`.expand-btn[data-id="${expandedPostId}"]`);
          const prevContent = document.getElementById(`content-${expandedPostId}`);
          
          if (prevButton && prevContent) {
            prevButton.classList.remove('expanded');
            prevContent.style.display = 'none';
          }
        }
        
        if (isExpanded) {
          // Collapse
          this.classList.remove('expanded');
          contentElement.style.display = 'none';
          expandedPostId = null;
        } else {
          // Expand
          this.classList.add('expanded');
          contentElement.style.display = 'block';
          expandedPostId = postId;
          
          // Smooth scroll to this card
          setTimeout(() => {
            const card = this.closest('.blog-card');
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
        
        // Re-equalize card heights after expanding/collapsing
        setTimeout(equalizeCardHeights, 400);
      });
    }
  });
}

// Make all cards in a row have equal height
function equalizeCardHeights() {
  const rows = document.querySelectorAll('.blog-row');
  
  rows.forEach(row => {
    const cards = row.querySelectorAll('.blog-card');
    let maxHeight = 0;
    
    // Reset heights first
    cards.forEach(card => {
      card.style.height = 'auto';
    });
    
    // Find the maximum height
    cards.forEach(card => {
      const cardHeight = card.offsetHeight;
      maxHeight = Math.max(maxHeight, cardHeight);
    });
    
    // Apply the maximum height to all cards
    if (maxHeight > 0) {
      cards.forEach(card => {
        card.style.height = `${maxHeight}px`;
      });
    }
  });
}

// Filter blog posts
function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-button");
  if (!filterButtons.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", async function() {
      // Update active state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      currentFilter = this.dataset.filter;
      
      // Reset expanded post
      expandedPostId = null;
      
      // Reload posts with new filter
      await loadPosts();
    });
  });
}

// Scroll header effect
function scrollHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  
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
  if (!menuToggle || !nav) return;
  
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
  if (!backToTop) return;

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
  if (!themeToggle) return;

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

// Generate random particles
function createParticles() {
  const particles = document.getElementById("particles");
  if (!particles) return;
  
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

// Blog card animations
function setupBlogCards() {
  const blogCards = document.querySelectorAll(".blog-card");
  if (!blogCards.length) return;

  // Fade in blog cards as they scroll into view
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

  blogCards.forEach((card) => {
    observer.observe(card);
  });

  // Add hover effects
  blogCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains('expanded')) {
        this.style.transform = "translateY(-10px)";
        this.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)";
        this.style.borderColor = "rgba(59, 130, 246, 0.2)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains('expanded')) {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
        this.style.borderColor = "rgba(148, 163, 184, 0.1)";
      }
    });
  });
}

// Pagination functionality
function setupPagination() {
  const paginationItems = document.querySelectorAll(".pagination-item");
  if (!paginationItems.length) return;

  paginationItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (
        this.innerHTML.includes("fa-arrow-right") ||
        this.innerHTML.includes("fa-ellipsis")
      ) {
        return; // Ignore special navigation buttons
      }

      // Update active state
      paginationItems.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");

      // In a real application, this would load a new page of posts
      console.log(`Page selected: ${this.textContent}`);

      // Scroll to top of blog section
      const blogSection = document.querySelector(".blog-section");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Admin Modal Setup
function setupAdminModal() {
  const adminButton = document.getElementById("adminButton");
  const adminModal = document.getElementById("adminModal");
  if (!adminButton || !adminModal) return;
  
  const modalClose = document.getElementById("modalClose");
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");
  const loginSuccess = document.getElementById("loginSuccess");
  const loginError = document.getElementById("loginError");
  const cancelButton = document.getElementById("cancelButton");

  // Open modal
  adminButton.addEventListener("click", () => {
    adminModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close modal
  modalClose.addEventListener("click", () => {
    adminModal.classList.remove("active");
    document.body.style.overflow = "auto";
    // Reset forms
    loginForm.style.display = "block";
    loginSuccess.style.display = "none";
    loginError.style.display = "none";
  });

  // Login handling
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple mock authentication
    if (username === 'admin' && password === 'password') {
      loginSuccess.style.display = 'block';
      loginError.style.display = 'none';
      
      // Redirect to admin page after delay
      setTimeout(() => {
        window.location.href = 'admin.html'; // Redirect to admin page
      }, 1500);
    } else {
      loginError.style.display = 'block';
      loginSuccess.style.display = 'none';
    }
  });

  // Cancel button in admin panel
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      adminModal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  // Close modal when clicking outside
  adminModal.addEventListener("click", (e) => {
    if (e.target === adminModal) {
      adminModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
}

// Handle window resize to re-equalize card heights
function handleResize() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      equalizeCardHeights();
    }, 250);
  });
}

// Setup image modal
function setupImageModal() {
  // Crea il modal una sola volta
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = '<img src="" alt="Enlarged image">';
  document.body.appendChild(modal);

  // Funzione per aprire il modal
  function openModal(imageSrc) {
    const modalImg = modal.querySelector('img');
    modalImg.src = imageSrc;
    modal.style.display = 'block';
  }

  // Chiudi il modal cliccando ovunque
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Aggiungi listener per tutte le immagini dei post
  document.addEventListener('click', (e) => {
    if (e.target.matches('.blog-card-image img, .featured-blog-image img')) {
      openModal(e.target.src);
    }
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded - initializing blog features");
  
  createParticles();
  setupAdminModal();
  scrollHeader();
  mobileMenuToggle();
  scrollToTop();
  themeToggle();
  setupPagination();
  setupFilters();
  handleResize();
  
  // Initialize Firebase securely and then load posts
  initializeFirebase();

  // Add a simple page load animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);

  // Chiama setupImageModal dopo aver caricato i post
  setupImageModal();
});