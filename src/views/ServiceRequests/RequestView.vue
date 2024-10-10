<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const n = 12
const cards = ref([])
for (let i = 1; i <= n; i++) {
  cards.value.push({
    name: `User ${i}`,
    title: `Need help on ${i}`,
    imgSrc: 'src/assets/logo.svg',
    profileImgSrc: 'src/assets/logo.svg',
    location: 'Location'
  })
}

const selectedSortOption = ref('Sort by Relevant')
const selectedCategoryOption = ref('All categories')

function selectSortOption(option) {
  selectedSortOption.value = option
}

function selectCategoryOption(option) {
  selectedCategoryOption.value = option
}

const router = useRouter()
function navigateToCreateRequest() {
  router.push('/service-request')
}
</script>
<template>
  <div class="container-fluid">
    <div id="header">
      <h2>Service Requests</h2>
      <button type="button" class="btn btn-danger" @click="navigateToCreateRequest">
        New Service Request
      </button>
    </div>
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
            :class="{ active: selectedSortOption === 'Sort by Relevant' }"
            @click="selectSortOption('Sort by Relevant')"
          >
            Sort by Relevant
          </li>
          <li
            class="dropdown-item"
            :class="{ active: selectedSortOption === 'Sort by Recent' }"
            @click="selectSortOption('Sort by Recent')"
          >
            Sort by Recent
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
          <li
            class="dropdown-item"
            :class="{ active: selectedCategoryOption === 'Installation' }"
            @click="selectCategoryOption('Installation')"
          >
            Installation
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-3 col-lg-3 col-md-6" v-for="(card, index) in cards" :key="index">
        <div class="card">
          <div class="userInfo">
            <img
              :src="card.profileImgSrc"
              class="rounded-circle me-2"
              alt="Profile Picture"
              width="40"
              height="40"
            />
            <span class="name">{{ card.name }}</span>
          </div>
          <img :src="card.imgSrc" class="card-img-top" alt="Request Image" />
          <div class="card-body">
            <span class="badge rounded-pill text-bg-dark mb-2">Installation</span>
            <h6>{{ card.title }}</h6>
            <span>{{ card.location }}</span>
          </div>
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

.card {
  padding: 8px;
  margin-bottom: 16px;
}

.card:hover {
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.2);
}

.card-body {
  margin-top: 8px;
  padding-bottom: 0;
}

.userInfo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.name {
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
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

@media (max-width: 500px) {
  #filter {
    flex-direction: column;
    align-items: stretch;
  }

  #header {
    flex-direction: column;
    align-items: stretch;
  }

  .dropdown {
    margin-bottom: 8px;
  }
}

.dropdown-toggle[aria-expanded='true']:after {
  transform: rotate(180deg);
}

.dropdown-toggle:after {
  transition: 0.1s;
}
</style>