// Import Firebase SDK
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

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTu9H9MJOVP7DooGv5ZAQrpd1PRBBKyBg",
  authDomain: "personal-web-site-9f769.firebaseapp.com",
  databaseURL: "https://personal-web-site-9f769-default-rtdb.firebaseio.com",
  projectId: "personal-web-site-9f769",
  storageBucket: "personal-web-site-9f769.firebasestorage.app",
  messagingSenderId: "783944910554",
  appId: "1:783944910554:web:d8af9c0572d9d61b6a47e3",
  measurementId: "G-8Q29E84FVH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        window.location.href = 'admin.html'; // Reindirizza alla pagina admin
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

// Load posts from Firestore
async function loadPosts() {
  try {
    const blogContainer = document.querySelector('.blog-container');
    const featuredBlogContent = document.querySelector('.featured-blog-card');
    
    if (!blogContainer) {
      console.error('Blog container not found');
      return;
    }
    
    // Clear existing content
    blogContainer.innerHTML = '<div class="loading">Loading posts...</div>';
    
    // Get featured post (limit to 1, order by timestamp)
    const featuredPostQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    
    const featuredSnapshot = await getDocs(featuredPostQuery);
    let featuredPost = null;
    
    if (!featuredSnapshot.empty) {
      featuredPost = {
        id: featuredSnapshot.docs[0].id,
        ...featuredSnapshot.docs[0].data()
      };
      
      // Update featured post section if it exists
      if (featuredBlogContent) {
        const featuredDate = featuredPost.timestamp 
          ? new Date(featuredPost.timestamp.toDate()).toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })
          : 'Date not available';
          
        featuredBlogContent.innerHTML = `
          <div class="featured-blog-image">
            <img src="${featuredPost.imageUrl || 'https://picsum.photos/800/600'}" alt="${featuredPost.title}">
          </div>
          <div class="featured-blog-content">
            <span class="featured-label">Featured Project</span>
            <h2 class="featured-blog-title">${featuredPost.title}</h2>
            <p class="featured-blog-excerpt">${featuredPost.content.substring(0, 200)}${featuredPost.content.length > 200 ? '...' : ''}</p>
            <div class="featured-blog-meta">
              <div class="blog-card-author">
                <div class="blog-card-author-image">
                  <img src="https://picsum.photos/100/100?random=1" alt="Author">
                </div>
                <span>${featuredPost.authorEmail || 'Admin'}</span>
              </div>
              <div class="blog-card-date">
                <i class="fa-regular fa-calendar"></i>
                <span>${featuredDate}</span>
              </div>
            </div>
            <a href="post.html?id=${featuredPost.id}" class="read-more">Read Full Project <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        `;
      }
    }
    
    // Get all posts excluding the featured one
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(6) // Limit to 6 posts for now
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    
    // Clear loading message
    blogContainer.innerHTML = '';
    
    if (postsSnapshot.empty && !featuredPost) {
      blogContainer.innerHTML = '<p class="no-posts">No posts available yet. Check back soon!</p>';
      return;
    }
    
    // Create blog cards for regular posts
    let delay = 1;
    postsSnapshot.forEach((doc) => {
      // Skip the featured post to avoid duplication
      if (featuredPost && doc.id === featuredPost.id) {
        return;
      }
      
      const post = doc.data();
      const postDate = post.timestamp 
        ? new Date(post.timestamp.toDate()).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          })
        : 'Date not available';
      
      // Create category tags
      let categoriesHTML = '';
      if (post.category) {
        categoriesHTML = `<span class="blog-tag">${post.category}</span>`;
      }
      
      // Create blog card
      const blogCard = document.createElement('div');
      blogCard.className = 'blog-card';
      blogCard.style = `--delay: ${delay}`;
      blogCard.innerHTML = `
        <div class="blog-card-image">
          <img src="${post.imageUrl || 'https://picsum.photos/600/400?random=' + delay}" alt="${post.title}">
        </div>
        <div class="blog-card-content">
          <div class="blog-card-tags">
            ${categoriesHTML}
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.content.substring(0, 120)}${post.content.length > 120 ? '...' : ''}</p>
          <div class="blog-card-meta">
            <div class="blog-card-author">
              <div class="blog-card-author-image">
                <img src="https://picsum.photos/100/100?random=${delay + 10}" alt="Author">
              </div>
              <span>${post.authorEmail || 'Admin'}</span>
            </div>
            <div class="blog-card-date">
              <i class="fa-regular fa-calendar"></i>
              <span>${postDate}</span>
            </div>
          </div>
        </div>
        <a href="post.html?id=${doc.id}" class="card-link" aria-label="Read more about ${post.title}"></a>
      `;
      
      blogContainer.appendChild(blogCard);
      delay++;
    });
    
    // Setup blog card animations
    setupBlogCards();
    
  } catch (error) {
    console.error("Error loading posts:", error);
    const blogContainer = document.querySelector('.blog-container');
    if (blogContainer) {
      blogContainer.innerHTML = '<p class="error-message">Error loading posts. Please try again later.</p>';
    }
  }
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

      const filter = this.dataset.filter;
      const blogContainer = document.querySelector('.blog-container');
      
      // Show loading state
      blogContainer.innerHTML = '<div class="loading">Filtering posts...</div>';
      
      try {
        // If "all" is selected, load all posts
        if (filter === "all") {
          await loadPosts();
          return;
        }
        
        // Otherwise, filter by category
        const postsQuery = query(
          collection(db, "posts"),
          where("category", "==", filter),
          orderBy("timestamp", "desc")
        );
        
        const postsSnapshot = await getDocs(postsQuery);
        
        // Clear loading
        blogContainer.innerHTML = '';
        
        if (postsSnapshot.empty) {
          blogContainer.innerHTML = `<p class="no-posts">No posts found in the "${filter}" category.</p>`;
          return;
        }
        
        // Create blog cards for filtered posts
        let delay = 1;
        postsSnapshot.forEach((doc) => {
          const post = doc.data();
          const postDate = post.timestamp 
            ? new Date(post.timestamp.toDate()).toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
              })
            : 'Date not available';
          
          // Create blog card
          const blogCard = document.createElement('div');
          blogCard.className = 'blog-card';
          blogCard.style = `--delay: ${delay}`;
          blogCard.innerHTML = `
            <div class="blog-card-image">
              <img src="${post.imageUrl || 'https://picsum.photos/600/400?random=' + delay}" alt="${post.title}">
            </div>
            <div class="blog-card-content">
              <div class="blog-card-tags">
                <span class="blog-tag">${post.category}</span>
              </div>
              <h3 class="blog-card-title">${post.title}</h3>
              <p class="blog-card-excerpt">${post.content.substring(0, 120)}${post.content.length > 120 ? '...' : ''}</p>
              <div class="blog-card-meta">
                <div class="blog-card-author">
                  <div class="blog-card-author-image">
                    <img src="https://picsum.photos/100/100?random=${delay + 10}" alt="Author">
                  </div>
                  <span>${post.authorEmail || 'Admin'}</span>
                </div>
                <div class="blog-card-date">
                  <i class="fa-regular fa-calendar"></i>
                  <span>${postDate}</span>
                </div>
              </div>
            </div>
            <a href="post.html?id=${doc.id}" class="card-link" aria-label="Read more about ${post.title}"></a>
          `;
          
          blogContainer.appendChild(blogCard);
          delay++;
        });
        
        // Setup blog card animations
        setupBlogCards();
        
      } catch (error) {
        console.error("Error filtering posts:", error);
        blogContainer.innerHTML = '<p class="error-message">Error filtering posts. Please try again later.</p>';
      }
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
      this.style.transform = "translateY(-10px)";
      this.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)";
      this.style.borderColor = "rgba(59, 130, 246, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
      this.style.borderColor = "rgba(148, 163, 184, 0.1)";
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
  
  // Load posts from Firebase
  loadPosts();

  // Add a simple page load animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});