<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import UserService from '../../services/UserService'
import RequestService from '../../services/RequestService'
import PlaceholderCard from '../../components/PlaceholderCard.vue'
import ServiceRequestCard from '../../components/ServiceRequestCard.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = useRouter()
const selectedSortOption = ref('Sort by Newest')
const selectedCategoryOption = ref('All categories')
const serviceRequests = ref([])
const categories = ref([])
const loading = ref(true)

function selectSortOption(option) {
  selectedSortOption.value = option
  fetchServiceRequests()
}

function selectCategoryOption(option) {
  selectedCategoryOption.value = option
  fetchServiceRequests()
}

function navigateToCreateRequest() {
  router.push('/service-request')
}

async function fetchServiceRequests() {
  loading.value = true
  const result = await RequestService.getAllServiceRequests(
    selectedSortOption.value,
    selectedCategoryOption.value
  )

  const requestPromises = result.map((item) => {
    return UserService.getUserData(item.userId).then((userData) => {
      item.name = userData.userName
      item.profilePicture = userData.profilePicture
      return item
    })
  })

  Promise.all(requestPromises).then((loadedData) => {
    serviceRequests.value = loadedData
    loading.value = false
  })
}

async function populateCategoryFilter() {
  const result = await RequestService.getAllCategories()
  result.map((item) => {
    categories.value.push(item)
  })
}

onMounted(() => {
  // Fetch Data
  fetchServiceRequests()
  populateCategoryFilter()
})
</script>

<template>
  <div class="container">
    <div id="header">
      <h1>Service Requests</h1>
      <button
        type="button"
        class="createBtn btn btn-danger"
        style="font-weight: bold"
        @click="navigateToCreateRequest"
      >
        New Service Request
      </button>
      <div class="fab" @click="navigateToCreateRequest"><i class="bi bi-plus"></i></div>
    </div>
    <div v-if="loading" class="row">
      <placeholder-card />
    </div>
    <div v-if="!loading && serviceRequests.length === 0" style="text-align: center">
      <h3>No Service Requests</h3>
    </div>
    <div v-else>
      <div id="filter">
        <div class="dropdown me-2">
          <button
            class="btn drop dropdown-toggle rounded-pill"
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
              Sort by Newest
            </li>
            <li
              class="dropdown-item"
              :class="{ active: selectedSortOption === 'Sort by Oldest' }"
              @click="selectSortOption('Sort by Oldest')"
            >
              Sort by Oldest
            </li>
          </ul>
        </div>
        <div class="dropdown">
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
              :class="{ active: selectedCategoryOption === 'All categories' }"
              @click="selectCategoryOption('All categories')"
            >
              All categories
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
      <div class="row">
        <div
          class="col-xl-3 col-lg-3 col-md-6 col-sm-6"
          v-for="serviceRequest in serviceRequests"
          :key="serviceRequest.id"
        >
          <ServiceRequestCard :serviceRequest="serviceRequest" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#filter {
  display: flex;
  justify-content: end;
  margin: 8px 0 14px 0;
}

.drop {
  background-color: white;
  border: 1px solid lightgray;
}

li {
  cursor: pointer;
}

.active {
  background-color: #f0eeee;
  color: black;
}

.dropdown-item:active {
  background-color: #f0eeee !important;
}

.dropdown-toggle[aria-expanded='true']:after {
  transform: rotate(180deg);
}

.dropdown-toggle:after {
  transition: 0.1s;
}

.fab {
  display: none;
  position: fixed;
  width: 55px;
  height: 55px;
  background-color: red;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  color: white;
  font-size: 30px;
}

@media (max-width: 500px) {
  #filter {
    flex-direction: column;
    align-items: stretch;
  }

  .dropdown {
    margin-bottom: 8px;
  }

  .fab {
    display: flex;
  }

  .createBtn {
    display: none;
  }
}
</style>