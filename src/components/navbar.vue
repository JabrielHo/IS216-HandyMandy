<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.user !== null)
const isLoading = computed(() => authStore.loading)

const navigateToSignIn = () => {
  router.push('/signin') // Navigate to the sign-in page
}

const navigateToRegister = () => {
  router.push('/register') // Navigate to the sign-in page
}

const logout = async () => {
  try {
    await authStore.logout()
    window.location.reload()
  } catch (error) {
    console.error('Logout failed', error)
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!-- Logo and Search Bar -->
      <a class="navbar-brand d-flex align-items-center" href="/">
        <span class="ms-2">HandyMandy</span>
      </a>

      <!-- Search Bar -->
      <div class="input-group me-2 hide" style="flex: 1">
        <input type="text" class="form-control" placeholder="Search for services here!" />
        <button class="btn btn-outline-secondary" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
            />
          </svg>
        </button>
      </div>

      <!-- Dropdown for Search Bar -->
      <div class="dropdown appear me-auto">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          id="searchDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Search
        </button>
        <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="searchDropdown">
          <li class="p-2">
            <input type="text" class="form-control" placeholder="Search for services here!" />
          </li>
        </ul>
      </div>

      <!-- Toggler for Mobile View -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/services">Services</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/requests">Requests</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/">Workshops</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/Forum">Forum</a>
          </li>
        </ul>

        <!-- Sign-in and Register buttons -->
        <div v-if="!isLoading && !isLoggedIn" class="d-none d-lg-block align-items-center ms-3">
          <button class="btn btn-outline-secondary me-2" type="button" @click="navigateToSignIn">
            Sign In
          </button>
          <button class="btn btn-dark" type="button" @click="navigateToRegister">Register</button>
        </div>
        <div v-if="!isLoading && isLoggedIn" class="d-none d-lg-block align-items-center ms-3">
          <button class="btn btn-dark" type="button" data-bs-toggle="modal" data-bs-target="#logoutModal">Log out</button>
        </div>
      </div>
      <!--End of navbar links-->
    </div>
    <!--End for container fluid-->
  </nav>

  <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Log out?</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to log out of your account?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="logout">Log out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styles */
.custom-divider {
  width: 100%; /* Width of the divider */
  height: 1px; /* Height of the divider */
  background-color: rgb(0, 0, 0, 0.2); /* Color of the divider */
  margin: 20px 15px 20px 15px; /* Space around the divider */
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.2rem;
}

.input-group {
  width: 350px; /* Adjust based on desired width */
}

.nav-link {
  margin-right: 1rem;
}

@media (max-width: 880px) {
  .hide {
    display: none !important; /* Hide buttons on small screens */
  }
}

@media (min-width: 880px) {
  .appear {
    display: none !important; /* Show buttons on medium and larger screens */
  }
}
</style>
