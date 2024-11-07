<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router' // Import useRouter and useRoute
import { useAuthStore } from '../../stores/auth'
import Services from './users'
import UserService from '../../services/UserService'
import ServiceCard from '../../components/ServiceCard.vue'
import PlaceholderCard from '../../components/PlaceholderCard.vue'

const router = useRouter()
const route = useRoute() // Use useRoute to access route params
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.user !== null)

const selectedCategoryOption = ref(route.params.selectedservice || 'All Categories')
const selectedLocationOption = ref('All Locations')
const services = ref([])
const categories = ref([])
const locations = ref([])
const loading = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

async function fetchServices() {
  loading.value = true
  console.log('Fetching services...')
  console.log(selectedCategoryOption.value)
  console.log(route.params.selectedservice)
  const result = await Services.getAllServices(
    selectedCategoryOption.value,
    selectedLocationOption.value,
    currentPage.value,
    itemsPerPage.value
  )

  console.log('Fetched result:', result) // Debug fetched result

  const servicePromises = result.items.map((service) => {
    return UserService.getUserData(service.userId).then((userData) => {
      service.username = userData.username
      service.profilePicture = userData.profilePicture
      return service
    })
  })

  Promise.all(servicePromises).then((loadedData) => {
    services.value = loadedData
    totalItems.value = result.totalItems
    loading.value = false
  })
  console.log(services)
}

// Fetch Categories and Locations
async function populateCategoryFilter() {
  const result = await Services.getAllCategories()
  categories.value = result
  console.log('categories', categories.value)
}

async function populateLocationFilter() {
  const result = await Services.getAllLocations()
  locations.value = result
}

// Create a new service request
function navigateToCreateService() {
  if (isLoggedIn.value) {
    router.push('/create-service')
  } else {
    alert('You must be logged in to create a new service.')
  }
}

// Handle pagination
function changePage(page) {
  if (page >= 1 && page <= Math.ceil(totalItems.value / itemsPerPage.value)) {
    currentPage.value = page
    fetchServices()
  }
}

// Handle selection of category option
function selectCategoryOption(category) {
  selectedCategoryOption.value = category
  currentPage.value = 1 // Reset to the first page when changing the filter
  fetchServices() // Fetch services with the new filter
}

// Handle selection of location option
function selectLocationOption(location) {
  selectedLocationOption.value = location
  currentPage.value = 1 // Reset to the first page when changing the filter
  fetchServices() // Fetch services with the new filter
}

onMounted(() => {
  fetchServices()
  populateCategoryFilter()
  populateLocationFilter()
  // inisetup()
})

// Access the selected service from the route
// function inisetup() {
//   const serviceParam = route.params.selectedservice // Access the route parameter
//   console.log('Selected service:', serviceParam)
//   if (typeof serviceParam !== 'undefined') {
//     console.log('success')
//     selectCategoryOption(serviceParam)
//   } else {
//     console.log('failed')
//   }
// }
</script>

<template>
  <div class="background">
  <section class="text-center container">
    <div class="row pt-4">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="heading">Available Services</h1>
        <p class="lead text-body-secondary">
          Discover a variety of services offered by others. Whether you're looking for help or
          offering services, connect today!
        </p>
        <p>
          <button v-if="isLoggedIn" class="createBtn btn my-2" @click="navigateToCreateService">
            Add Your Service!
          </button>
        </p>
      </div>
    </div>
  </section>

  <section class="container">
    <div v-if="!loading" class="my-4 filter">
      <!-- Filters for Categories and Locations -->
      <!-- Dropdown for Categories -->
      <div class="dropdown me-md-2">
        <button
          class="btn drop dropdown-toggle rounded-pill"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ selectedCategoryOption }}
        </button>
        <ul class="dropdown-menu">
          <li
            class="dropdown-item"
            :class="{ active: selectedCategoryOption === 'All Categories' }"
            @click="selectCategoryOption('All Categories')"
          >
            All Categories
          </li>
          <div v-for="category in categories" :key="category">
            <li
              class="dropdown-item"
              :class="{ active: selectedCategoryOption === category }"
              @click="selectCategoryOption(category)"
            >
              {{ category }}
            </li>
          </div>
        </ul>
      </div>

      <!-- Dropdown for Locations -->
      <div class="dropdown me-md-2">
        <button
          class="btn drop dropdown-toggle rounded-pill"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ selectedLocationOption }}
        </button>
        <ul class="dropdown-menu">
          <li
            class="dropdown-item"
            :class="{ active: selectedLocationOption === 'All Locations' }"
            @click="selectLocationOption('All Locations')"
          >
            All Locations
          </li>
          <div v-for="location in locations" :key="location">
            <li
              class="dropdown-item"
              :class="{ active: selectedLocationOption === location }"
              @click="selectLocationOption(location)"
            >
              {{ location }}
            </li>
          </div>
        </ul>
      </div>
    </div>

    <div v-if="loading" class="row">
      <PlaceholderCard />
    </div>

    <div v-if="!loading && services.length === 0" class="noRequests">
      <h1 class="fw-light">No Services Found</h1>
    </div>

    <div v-else>
      <div class="row">
        <div
          class="col-xl-3 col-lg-3 col-md-4 col-sm-6"
          v-for="service in services"
          :key="service.userId"
        >
          <ServiceCard v-if="service" :service="service" />
        </div>
      </div>

      <!-- Pagination Controls -->
      <nav aria-label="pagination" class="d-flex justify-content-end">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click="changePage(currentPage - 1)"><i class="bi bi-chevron-left"></i></a>
          </li>
          <li
            class="page-item"
            v-for="page in Math.ceil(totalItems / itemsPerPage)"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" @click="changePage(page)">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === Math.ceil(totalItems / itemsPerPage) }"
          >
            <a class="page-link" @click="changePage(currentPage + 1)"><i class="bi bi-chevron-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</div>
</template>

<style scoped>
.heading {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.pagination .active .page-link {
  background-color: #ffad60; /* Desired active background color */
  border-color: gray; /* Desired active border color */
  color: #ffffff; /* Desired active text color */
}
.pagination .page-link {
  color: black;
}
.createBtn {
  background-color: #ffad60;
  color: white;
}
.background {
  background-image: url(../../assets/backdrop.png);
}
.filter {
  display: flex;
  justify-content: space-between;
}

.ml-auto {
  margin-left: auto;
  margin-right: 8px;
}

li {
  cursor: pointer;
}

.drop {
  border: none;
}

.active {
  background-color: #f0eeee;
  color: black;
}

.dropdown- .dropdown-item:active {
  background-color: #f0eeee !important;
}

.dropdown-toggle[aria-expanded='true']:after {
  transform: rotate(180deg);
}

.dropdown-toggle:after {
  transition: 0.1s;
}

.dropdown-item:active,
.dropdown-item:focus {
  background-color: transparent !important;
  color: inherit !important;
}

.noRequests {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

@media (max-width: 500px) {
  .filter {
    flex-direction: column;
    align-items: stretch;
  }

  .dropdown {
    margin-bottom: 8px;
    margin: 0 0 8px 0;
    border: 1px solid black;
  }

  .drop {
    width: 100%;
  }

  .dropdown-menu {
    width: 100%;
  }

  .createBtn {
    display: none;
  }
}
</style>
