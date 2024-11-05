<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'
import UserService from '../../services/UserService'
import RequestService from '../../services/RequestService'
import PlaceholderCard from '../../components/PlaceholderCard.vue'
import ServiceRequestCard from '../../components/ServiceRequestCard.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = useRouter()
const authStore = useAuthStore()
const selectedSortOption = ref('Sort by Newest')
const selectedCategoryOption = ref('All Categories')
const selectedLocationOption = ref('All Locations')
const serviceRequests = ref([])
const categories = ref([])
const locations = ref([])
const isLoggedIn = computed(() => authStore.user !== null)
const loading = ref(true)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(8)
const totalItems = ref(0)

function selectSortOption(option) {
  selectedSortOption.value = option
  fetchServiceRequests()
}

function selectCategoryOption(option) {
  selectedCategoryOption.value = option
  fetchServiceRequests()
}

function selectLocationOption(option) {
  selectedLocationOption.value = option
  fetchServiceRequests()
}

function navigateToCreateRequest() {
  router.push('/service-request')
}

async function fetchServiceRequests() {
  loading.value = true
  const result = await RequestService.getAllServiceRequests(
    selectedSortOption.value,
    selectedCategoryOption.value,
    selectedLocationOption.value,
    currentPage.value,
    itemsPerPage.value
  )

  const requestPromises = result.items.map((item) => {
    return UserService.getUserData(item.userId).then((userData) => {
      item.name = userData.username
      item.profilePicture = userData.profilePicture
      return item
    })
  })

  Promise.all(requestPromises).then((loadedData) => {
    serviceRequests.value = loadedData
    totalItems.value = result.totalItems
    loading.value = false
  })
}

async function populateCategoryFilter() {
  const result = await RequestService.getAllCategories()
  result.map((item) => {
    categories.value.push(item)
  })
}

async function populateLocationFilter() {
  const result = await RequestService.getAllLocations()
  result.map((item) => {
    locations.value.push(item)
  })
}

function changePage(page) {
  if (currentPage.value !== page) {
    currentPage.value = page
    fetchServiceRequests()
  }
}

onMounted(() => {
  // Fetch Data
  fetchServiceRequests()
  populateCategoryFilter()
  populateLocationFilter()
})
</script>

<template>
  <div class="background">
    <section class="text-center container">
      <div class="row pt-4">
        <div class="col-lg-6 col-md-8 mx-auto">
          <h1 class="fw-light">Service Requests</h1>
          <p class="lead text-body-secondary">
            Wish to lend a hand? This collection brings together all service requests, from quick
            repairs to full installations. Help someone out today!
          </p>
          <p>
            <a v-if="isLoggedIn" class="createBtn btn my-2" @click="navigateToCreateRequest"
              >New Service Request</a
            >
            <a v-if="isLoggedIn" class="fab" @click="navigateToCreateRequest"
              ><i class="bi bi-plus"></i
            ></a>
          </p>
        </div>
      </div>
    </section>
    <hr />
    <section class="container">
      <div v-if="!loading" class="my-4 filter">
        <div class="dropdown">
          <button
            class="btn drop dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedSortOption }}
          </button>
          <ul class="dropdown-menu">
            <li
              class="dropdown-item"
              :class="{ active: selectedSortOption === 'Sort by Newest' }"
              @click="selectSortOption('Sort by Newest')"
            >
              Newest
            </li>
            <li
              class="dropdown-item"
              :class="{ active: selectedSortOption === 'Sort by Oldest' }"
              @click="selectSortOption('Sort by Oldest')"
            >
              Oldest
            </li>
          </ul>
        </div>
        <div class="dropdown ml-auto">
          <button
            class="btn drop dropdown-toggle"
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
        <div class="dropdown">
          <button
            class="btn drop dropdown-toggle"
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
      </div>
      <div v-if="loading" class="row">
        <placeholder-card />
      </div>
      <div v-if="!loading && serviceRequests.length === 0" class="noRequests">
        <h1 class="fw-light">No Service Requests Found</h1>
      </div>
      <div v-else>
        <div class="row">
          <div
            class="col-xl-3 col-lg-3 col-md-6 col-sm-6"
            v-for="serviceRequest in serviceRequests"
            :key="serviceRequest.id"
          >
            <ServiceRequestCard :serviceRequest="serviceRequest" />
          </div>
        </div>
        <nav aria-label="pagination" class="d-flex justify-content-end">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click="changePage(currentPage - 1)"
                ><i class="bi bi-chevron-left"></i
              ></a>
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
              <a class="page-link" @click="changePage(currentPage + 1)"
                ><i class="bi bi-chevron-right"></i
              ></a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped>
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
  background-color: #ffad60;
  color: white;
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

.fab {
  display: none;
  position: fixed;
  width: 55px;
  height: 55px;
  background-color: #ffad60;
  color: white;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  font-size: 30px;
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

  .fab {
    display: flex;
  }

  .createBtn {
    display: none;
  }
}
</style>
