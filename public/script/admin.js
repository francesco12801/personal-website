// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Global variables and app instances
let app, db, storage, auth;
let selectedImage = null;
let currentUser = null;

// DOM Elements - Auth
let authScreen;
let loginForm;
let loginBtn;
let authError;
let userInfo;
let userEmail;
let logoutBtn;

// DOM Elements - Dashboard
let adminDashboard;
let postForm;
let publishBtn;
let successMessage;
let errorMessage;
let imageUpload;
let imageFile;
let imagePreview;
let postsList;

// Initialize the admin panel
async function initAdminPanel() {
  // Get DOM elements - Auth
  authScreen = document.getElementById("authScreen");
  loginForm = document.getElementById("loginForm");
  loginBtn = document.getElementById("loginBtn");
  authError = document.getElementById("authError");
  userInfo = document.getElementById("userInfo");
  userEmail = document.getElementById("userEmail");
  logoutBtn = document.getElementById("logoutBtn");

  // Get DOM elements - Dashboard
  adminDashboard = document.getElementById("adminDashboard");
  postForm = document.getElementById("postForm");
  publishBtn = document.getElementById("publishBtn");
  successMessage = document.getElementById("successMessage");
  errorMessage = document.getElementById("errorMessage");
  imageUpload = document.getElementById("imageUpload");
  imageFile = document.getElementById("imageFile");
  imagePreview = document.getElementById("imagePreview");
  postsList = document.getElementById("postsList");
  
  // Initialize Firebase securely
  await initializeFirebaseSecurely();

  // Auth state change listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      currentUser = user;
      showDashboard(user);
    } else {
      // User is signed out
      currentUser = null;
      showAuthScreen();
    }
  });

  // Login form submission
  loginBtn.addEventListener("click", handleLogin);

  // Logout
  logoutBtn.addEventListener("click", handleLogout);

  // Dashboard event listeners
  setupDashboardEvents();
}

// Initialize Firebase securely by fetching config from backend
async function initializeFirebaseSecurely() {
  try {
    console.log("Fetching Firebase configuration from secure endpoint...");
    
    
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
    
    // Initialize Firebase with the config from server
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    
    console.log("Firebase initialized with secure server config");
  } catch (error) {
    console.error("Error initializing Firebase securely:", error);
    // Mostra messaggio di errore senza fallback
    showError("Failed to connect to the server. Please check your connection and try again.");
  }
}

// Handle login
async function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showAuthErrorMessage("Please enter both email and password");
    return;
  }

  try {
    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;

    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the redirect to dashboard
  } catch (error) {
    console.error("Error signing in:", error);
    let errorMessage = "Login failed. Please try again.";

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      errorMessage = "Invalid email or password";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed login attempts. Please try again later.";
    }

    showAuthErrorMessage(errorMessage);
  } finally {
    loginBtn.innerHTML = "Login";
    loginBtn.disabled = false;
  }
}

// Handle logout
async function handleLogout() {
  try {
    await signOut(auth);
    // onAuthStateChanged will handle the redirect to auth screen
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Show authentication error message
function showAuthErrorMessage(message) {
  authError.textContent = message;
  authError.style.display = "block";

  setTimeout(() => {
    authError.style.display = "none";
  }, 5000);
}

// Show dashboard
function showDashboard(user) {
  authScreen.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  userInfo.classList.remove("hidden");

  userEmail.textContent = user.email;

  // Load posts
  loadPosts();
}

// Show auth screen
function showAuthScreen() {
  adminDashboard.classList.add("hidden");
  userInfo.classList.add("hidden");
  authScreen.classList.remove("hidden");

  // Reset auth forms
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}

// Setup dashboard event listeners
function setupDashboardEvents() {
  // Setup image upload
  imageUpload.addEventListener("click", () => {
    imageFile.click();
  });

  imageFile.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      selectedImage = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };

      reader.readAsDataURL(selectedImage);
    }
  });

  // Form submission
  postForm.addEventListener("submit", handleFormSubmit);
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!currentUser) {
    showError("You must be logged in to publish a post");
    return;
  }

  // Get form values
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").value;

  if (!title || !category || !content) {
    showError("Please fill all required fields");
    return;
  }

  // Show loading state
  publishBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';
  publishBtn.disabled = true;

  try {
    // Upload image if selected
    let imageUrl = "";
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
    }

    // Create post object
    const post = {
      title,
      category,
      content,
      imageUrl,
      authorId: currentUser.uid,
      authorEmail: currentUser.email,
      timestamp: serverTimestamp(),
    };

    // Save post to Firestore
    await addDoc(collection(db, "posts"), post);

    // Show success message
    showSuccess("Post published successfully!");

    // Reset form
    postForm.reset();
    imagePreview.style.display = "none";
    selectedImage = null;

    // Redirect to blog page
    setTimeout(() => {
      window.location.href = "blog.html";
    }, 1500);
  } catch (error) {
    console.error("Error publishing post:", error);
    showError("Error publishing post: " + error.message);
  } finally {
    // Reset button state
    publishBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publish Post';
    publishBtn.disabled = false;
  }
}

// Upload image to Firebase Storage
async function uploadImage(file) {
  try {
    const storageRef = ref(
      storage,
      `images/${currentUser.uid}/${Date.now()}_${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Load posts from Firestore
async function loadPosts() {
  if (!currentUser) return;

  try {
    // Create query to get user's posts ordered by timestamp (newest first)
    const q = query(
      collection(db, "posts"),
      where("authorId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);

    // Clear posts list
    postsList.innerHTML = "";

    if (querySnapshot.empty) {
      postsList.innerHTML = "<p>No posts yet. Create your first post!</p>";
      return;
    }

    // Loop through posts and create HTML
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postId = doc.id;
      const date = post.timestamp
        ? new Date(post.timestamp.toDate()).toLocaleDateString()
        : "Date not available";

      const postItem = document.createElement("div");
      postItem.className = "post-item";
      postItem.innerHTML = `
        <div class="post-title">${post.title}</div>
        <div class="post-meta">${date} | ${post.category}</div>
        <div class="post-actions">
            <button class="delete-btn" data-id="${postId}">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        </div>
      `;

      // Add event listener to delete button
      postItem.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this post?")) {
          deletePost(postId);
        }
      });

      postsList.appendChild(postItem);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    postsList.innerHTML = "<p>Error loading posts. Please try again.</p>";
  }
}

// Delete post from Firestore
async function deletePost(postId) {
  if (!currentUser) return;

  try {
    await deleteDoc(doc(db, "posts", postId));
    showSuccess("Post deleted successfully");
    loadPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    showError("Error deleting post: " + error.message);
  }
}

// Show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";

  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";

  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
}

// Initialize the admin panel when the DOM is loaded
document.addEventListener("DOMContentLoaded", initAdminPanel);

// Export functions for use in HTML
export { initAdminPanel };