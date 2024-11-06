<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import ProfileDropdown from './ProfileDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.user !== null)
const isLoading = computed(() => authStore.loading)
const searchQuery = ref('')
const isSearchExpanded = ref(false)
const isMobile = ref(window.innerWidth < 768) // Track mobile state based on initial screen size

const navigateToSignIn = () => {
  router.push('/signin')
}

const navigateToRegister = () => {
  router.push('/register')
}

const logout = async () => {
  try {
    await authStore.logout()
    window.location.reload()
  } catch (error) {
    console.error('Logout failed', error)
  }
}

const toggleSearch = () => {
  isSearchExpanded.value = !isSearchExpanded.value
}

// Function to handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// Close the navbar dropdown when switching from mobile to desktop
watch(isMobile, (newValue) => {
  if (!newValue) {
    const navbarCollapse = document.getElementById('navbarNav')
    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show')
    }
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav class="navbar-container">
    <div class="navbar-content no-wrap">
      <!-- Logo Section -->
      <router-link to="/" class="logo-section no-wrap">
        <img src="../assets/HandyMandyLogo1.png" alt="Handy Mandy Logo" class="logo" />
        <span class="brand-name">HandyMandy</span>
      </router-link>

      <!-- Desktop Search Bar -->
      <div class="search-section desktop-search">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search for services here!"
            class="search-input"
          />
          <button class="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 16 16"
              class="search-icon"
            >
              <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Search Dropdown -->
      <div class="mobile-search">
        <button @click="toggleSearch" class="mobile-search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            class="search-icon"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
            />
          </svg>
        </button>
        <div v-show="isSearchExpanded" class="mobile-search-dropdown">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search for services here!"
            class="mobile-search-input"
          />
        </div>
      </div>

      <!-- Navigation Toggle -->
      <button
        class="nav-toggle dropdownres"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="nav-toggle-icon circle-icon">
          <img src="../assets/dropdown.png" alt="Dropdown Logo" class="dropdown-logo" />
          <!-- Logo image -->
        </span>
      </button>

      <!--Nav Links Desktop-->
      <div class="navbarres me-5">
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link" active-class="active">Home</router-link></li>
          <li>
            <router-link to="/services" class="nav-link" active-class="active"
              >Services</router-link
            >
          </li>
          <li>
            <router-link to="/requests" class="nav-link" active-class="active"
              >Requests</router-link
            >
          </li>
          <li>
            <router-link to="/forum" class="nav-link" active-class="active">Forum</router-link>
          </li>

          <li>
            <div v-if="!isLoading" class="auth-buttons">
              <template v-if="!isLoggedIn">
                <button @click="navigateToSignIn" class="sign-in-button">Sign In</button>
                <button @click="navigateToRegister" class="register-button">Register</button>
              </template>
              <ProfileDropdown v-else :profile-image="authStore.user?.profileImage" />
            </div>
          </li>
        </ul>
      </div>

      <!-- Navigation Links Mobile -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link" active-class="active">Home</router-link></li>
          <li>
            <router-link to="/personalProfile" class="nav-link" active-class="active">Profile</router-link>
          </li>
          <li>
            <router-link to="/inbox" class="nav-link" active-class="active">Inbox</router-link>
          </li>
          <li>
            <router-link to="/services" class="nav-link" active-class="active"
              >Services</router-link
            >
          </li>
          <li>
            <router-link to="/requests" class="nav-link" active-class="active"
              >Requests</router-link
            >
          </li>
          <li>
            <router-link to="/forum" class="nav-link" active-class="active">Forum</router-link>
          </li>
        </ul>

        <!-- Auth Buttons -->
        <div v-if="!isLoading" class="auth-buttons">
          <template v-if="!isLoggedIn">
            <button @click="navigateToSignIn" class="sign-in-button">Sign In</button>
            <button @click="navigateToRegister" class="register-button">Register</button>
          </template>
          <button v-else class="logout-button" data-bs-toggle="modal" data-bs-target="#logoutModal">
            Log out
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Logout Modal -->
  <div class="modal fade" id="logoutModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Log out?</h2>
          <button type="button" class="modal-close" data-bs-dismiss="modal" aria-label="Close">
            ×
          </button>
        </div>
        <div class="modal-body">Are you sure you want to log out of your account?</div>
        <div class="modal-footer">
          <button type="button" class="modal-cancel" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="modal-logout" @click="logout">Log out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar-container {
  background-color: #fff8f0;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-content {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  white-space: nowrap;
}

.no-wrap {
  white-space: nowrap;
}

.logo-section {
  text-decoration: none;
  color: #2d2d2d;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  color: transparent;
  white-space: nowrap;
}

.search-section {
  flex: 1;
  max-width: 500px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: #ff8e53;
  box-shadow: 0 0 0 2px rgba(255, 142, 83, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 0.95rem;
}

.search-button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
}

.search-button:hover {
  color: #ff8e53;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #2d2d2d;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #ff8e53;
}

.nav-link.active {
  color: #ff6b6b;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.sign-in-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ff8e53;
  background: none;
  color: #ff8e53;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sign-in-button:hover {
  background: rgba(255, 142, 83, 0.1);
}

.register-button,
.logout-button {
  padding: 0.5rem 1rem;
  border: none;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.register-button:hover,
.logout-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);
}

.mobile-search {
  display: none;
}

.profile {
  display: flex;
}

.dropdownres {
  display: none;
}

.navbarres {
  display: inline;
}

@media (max-width: 1024px) {
  .desktop-search {
    display: none;
  }

  .mobile-search {
    display: block;
    position: relative;
  }

  .mobile-search-button {
    padding: 0.5rem;
    background: none;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    color: #666;
  }

  .mobile-search-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 280px;
    padding: 0.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 0.5rem;
  }

  .mobile-search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    outline: none;
  }
}

@media (max-width: 767px) {
  .navbar-content {
    flex-wrap: wrap;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    padding: 1rem 0;
  }

  .auth-buttons {
    width: 100%;
    justify-content: center;
    padding: 1rem 0;
  }

  .dropdownres {
    display: inline-flex;
  }

  .navbarres {
    display: none;
  }
}

/* Modal Styles */
.modal-content {
  border-radius: 12px;
  border: none;
}

.modal-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  color: #666;
}

.modal-footer {
  border-top: 1px solid #f0f0f0;
  padding: 1.25rem;
  gap: 0.75rem;
}

.modal-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: none;
  border-radius: 6px;
  color: #666;
}

.modal-logout {
  padding: 0.5rem 1rem;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 6px;
  font-weight: 500;
}

.modal-logout:hover {
  background: #c82333;
}

.logo {
  min-width: 3rem;
  width: 5vw; /* Adjust as needed */
  height: auto; /* Maintain aspect ratio */
  margin-right: 10px;
}

.circle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px; /* Adjust as needed */
  height: 40px; /* Ensure equal size for circle */
  border-radius: 50%; /* Makes the container circular */
  background-color: #fff8f0; /* Optional background color */
  overflow: hidden; /* Ensure overflow is hidden */
}

.dropdown-logo {
  width: 90%; /* Scale the image to fit the container */
  height: auto; /* Maintain aspect ratio */
  border-radius: 50%; /* Keep the image circular */
  object-fit: cover; /* Ensure the image covers the container while maintaining aspect ratio */
}

.nav-toggle {
  background: none; /* Removes the default button background */
  border: none; /* Removes the default button border */
  padding: 0; /* Resets padding */
  margin: 0; /* Resets margin */
  cursor: pointer; /* Ensures pointer cursor on hover */
  align-items: center; /* Center items vertically */
}
</style>
