<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const n = 8
const cards = ref([])
for (let i = 1; i <= n; i++) {
  cards.value.push({
    name: `User ${i}`,
    services: `Plumbing`,
    profileImgSrc: 'src/assets/logo.svg',
    yearsOfExp: '5 years',
    location: 'Ang Mo Kio'
  })
}


const selectedServicesOption = ref('All services')


function selectServicesOption(option) {
    selectedServicesOption.value = option
}

</script>
<template>
  <div class="container-fluid">
    <div id="header">
      <h2>Services</h2>
    </div>
    <div id="filter">
      <div class="dropdown">
        <button
          class="btn drop dropdown-toggle rounded-pill"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          {{ selectedServicesOption }}
        </button>
        <ul class="dropdown-menu">
          <li
            class="dropdown-item"
            :class="{ active: selectedServicesOption === 'All categories' }"
            @click="selectServicesOption('All categories')"
          >
            All categories
          </li>
          <li
            class="dropdown-item"
            :class="{ active: selectedServicesOption === 'Plumbing' }"
            @click="selectServicesOption('Plumbing')"
          >
            Plumbing
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
              width="60"
              height="60"
            />
            <span class="name">{{ card.name }}</span>
          </div>
          <div class="card-body">
            <h6>Services: <p>{{ card.services }}</p></h6>
            <h6>Location: <p>{{ card.location }}</p></h6>
            <h6>Years of Experience: <p>{{ card.yearsOfExp }}</p></h6>
          </div>
          <div class="content-center text-center">
            <button class="btn rounded-pill" type="button"><a href="/services">View Profile</a></button>
            <button class="btn rounded-pill" type="button"><a href="/services">Chat</a></button>
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
  margin-top: 5px;
  padding-bottom: 0;
}

.userInfo {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.name {
  font-size: 20px;
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

button {
    background-color: lightblue;
    margin: 15px;
}

a {
    text-decoration: none;
    color: black;
}
</style>