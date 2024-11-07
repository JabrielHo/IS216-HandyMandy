<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
<template>
  <div class="yellowbg">
    <div class="overall">
      <!-- Profile Section -->
      <div class="row profile-section">
        <img
          :src="user.profilePicture"
          :alt="`${user.name}'s Profile Picture`"
          class="profile-pic col-md-6"
        />
        <div class="profile-details">
          <h1 class="profile-name">{{ user.username }}</h1>
          <!-- <p class="profile-rating">⭐⭐⭐⭐☆</p> -->
          <!-- <h3 class="certifications-title">Certifications & Licenses</h3>
          <ul class="certifications-list">
            <li>Certified Plumbing Specialist</li>
            <li>Licensed Electrician</li>
            <li>Furniture Assembly Expert</li>
            <li>Wifi Network Troubleshooter</li>
          </ul> -->
        </div>
      </div>

      <h2 class="section-title">{{ user.username }}'s' Services</h2>
      <div class="row request-container col-12"></div>
      <div v-if="userservice.length === 0" class="no-services-message">No services available.</div>
      <div v-else>
        <div v-for="service in userservice" :key="service.id" class="request-container col-md-6">
          <div v-for="(servicename, index) in service.service_type" :key="index">
            <router-link
              class="service-rectangle no-underline col-md-6"
            >
              <div class="label">{{ servicename }}</div>
              <img :src="serviceImgs[servicename] || 'fallback-image-url.jpg'" :alt="`${servicename} Image`" class="service-image"/>
            </router-link>
          </div>
        </div>
      </div>
      <button class="addservice" @click="navigateToCreateService">Add service</button>

      <h2 class="section-title">{{ user.username }}'s Requests</h2>
      <div class="row request-container col-12"></div>
      <div v-if="userrequest.length === 0" class="no-requests-message">No requests available.</div>
      <div v-else>
        <div v-for="request in userrequest" :key="request.id" class="request-container col-md-6">
          <router-link
            :to="`/request/${request.id}`"
            class="service-rectangle no-underline col-md-6"
          >
            <div class="label">{{ request.title }}</div>
            <img :src="request.imgSrc" alt="" class="service-image" />
          </router-link>
        </div>
      </div>
      <button class="addrequest" @click="navigateToCreateRequest">Add another request</button>


      <h2 class="section-title">{{ user.username }}'s Reviews</h2>
      <div class="review-container">
        <div class="review-rectangle">
          <!-- Iterate over each review in the reviews array -->
          <div v-for="(reviewItem, index) in user.reviews" :key="index" class="review">
            <p class="review-text">{{ reviewItem.review }}</p>
            <div class="reviewer-info">
              <span class="username">- by {{ reviewItem.username }}</span>
              <!-- Render star ratings dynamically based on the rating value -->
              <span class="stars">{{ '⭐'.repeat(reviewItem.rating) }}</span>
            </div>
            <!-- Separate reviews visually with a horizontal line, except for the last one -->
            <hr v-if="index < user.reviews.length - 1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RequestService from '../../services/RequestService'
import Services from '../Services/users'
import UserService from '../../services/UserService'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

export default {
  data() {
    return {
      name: 'personalProfile',
      userrequest: [],
      userservice: [],
      detailedUserServices: {}, 
      user: [],
      serviceImgs: 
      {
        "Electrical": "https://pluggedinatl.com/wp-content/uploads/2021/06/iStock-1025303196-scaled.jpg",
        "Air-Con" : 'https://www.socool.sg/wp-content/uploads/2022/11/Ac-service-3-2-1080x675.jpg',
        "Plumbing": 'https://hw-singaporeplumbing.com.sg/wp-content/uploads/2018/12/sanitary-repair.png',
        "Repair": "https://megafurniture.sg/cdn/shop/articles/the-top-5-refrigerator-singapore-repair-services-review-megafurniture.png?v=1721303860&width=1200",
        "Installation": "https://www.ikea.com/ext/ingkadam/m/7c8d0ce75bda3d21/original/PH186193-crop001.jpg?f=s",
        "Painting": 'https://www.paintingservicesingapore.sg/wp-content/uploads/2020/12/67766.jpg',
        "Gardening" : 'https://www.helpling.com.sg/wp-content/uploads/2023/06/Helpling-gardening_bg.webp',
        "Cleaning" : 'https://cleanlab.com.sg/wp-content/uploads//House-cleaning.jpg'

      }
    }
  },
  setup() {},
  computed: {
    userId() {
      return authStore.user?.uid
    }
  },
  watch: {
    userId(newId) {
      if (newId) {
        this.fetchServiceRequestsByUser(newId)
        this.fetchServicesByUser(newId)
        this.fetchUser(newId)
      }
    }
  },
  methods: {
    async fetchServiceRequestsByUser(userId) {
      const requestresult = await RequestService.getServiceRequestsByUser(userId)
      console.log(requestresult)
      this.userrequest = requestresult
    },
    async fetchServicesByUser(userId) {
      const serviceresult = await Services.getServicesByUser(userId)
      console.log(serviceresult)
      this.userservice = serviceresult

      // Initialize a new object to store services by type
      const detailedServiceMap = {};

      // Process each service and each type within it
      for (const service of serviceresult) {
        console.log(service)
        for (const type of service.service_type) {
          // Fetch detailed information for each type
          const detailedService = await Services.getDetailedService(service.serviceId, type);

          // Store each service by its type name
          detailedServiceMap[type] = {
            ...detailedService
          };
        }
      }
      this.detailedUserServices = detailedServiceMap;
      console.log(this.detailedUserServices)
    },
    async fetchUser(userId) {
      const userresult = await UserService.getUserData(userId)
      console.log(userresult)
      this.user = userresult
    },
    async navigateToCreateService() {
      if (authStore.user?.uid) {
        this.$router.push('/create-service')
      } else {
        alert('You must be logged in to create a new service.')
      }
    },
    async navigateToCreateRequest() {
      if (authStore.user?.uid) {
        this.$router.push('/service-request')
      } else {
        alert('You must be logged in to create a new service.')
      }
    },
    getCurrentUserId() {
      const id = authStore.user?.uid
      console.log('current user ID:', id)
      return id
    }
  },
  mounted() {
    const userId = this.getCurrentUserId()
    this.fetchServiceRequestsByUser(userId)
    this.fetchServicesByUser(userId)
    this.fetchUser(userId)
  }
}
</script>

<style scoped>
/* Background styling */

.yellowbg {
  padding: 5% 10%;
  display: flex;
  align-items: center;
  background: url('../../assets/backdrop.png');
  background-size: cover;
  background-position: bottom; /* Anchors background to the bottom */
  min-height: 37rem;
}

.overall {
  position: relative;
  z-index: 3;
  background-color: #fff8e6;
  border: 2px solid #ffc935;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px 15px 15px 15px;
}

/* Profile section styling */
.profile-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 20px;
}

.profile-pic {
  /* width: 25%; */
  max-width: 300px;
  height: auto;
  border-radius: 100px;
  margin-right: 100px;
  margin-left: 100px; /* Increased margin to push text further */
}

.profile-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.profile-name {
  font-size: 36px;
  font-weight: bold;
  color: #a66e38;
  margin: 0;
}

.profile-rating {
  font-size: 24px;
  color: #ffd700;
  margin-top: 5px;
}

.certifications-title {
  font-size: 24px;
  font-weight: bold;
  color: #555;
  margin-top: 10px;
  margin-bottom: 5px;
}

.certifications-list {
  list-style-type: none;
  padding: 0;
  color: #555;
}

.certifications-list li::before {
  content: '✔️';
  margin-right: 8px;
  color: #40e0d0;
}

.section-title {
  text-align: center;
  color: #a66e38;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* Service container styling */
.services-container,
.request-container,
.review-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
}

.service-rectangle {
  width: 250px;
  height: 300px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.addservice,
.addrequest {
  padding: 2px;
  width: 80%;
  border: none;
  border-radius: 20px;
  position: relative;
  background-color: #ffad60;
}
.addservice:hover,
.addrequest:hover {
  background-color: #ffad10;
}
.service-rectangle:hover {
  transform: scale(1.05);
}

.label {
  width: 100%;
  background-color: #a66e38;
  color: white;
  padding: 10px 0;
  border-radius: 15px 15px 0 0;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  z-index: 1;
}

/* Prevent blue underline */
.no-underline {
  text-decoration: none;
}

/* Service image styling */
.service-image {
  width: 100%;
  height: 100%;
  max-width: 250px;
  max-height: 280px;
  object-fit: cover;
  border-radius: 0 0 15px 15px;
}

/* Review container styling */
.review-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
}

.review-rectangle {
  width: 100%;
  max-width: 600px; /* Increased width */
  background-color: #96ceb4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  overflow-y: auto;
  height: 200px; /* Set height for scrolling */
  border-radius: 10px;
}

.review {
  margin-bottom: 10px;
}

.review-text {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.username {
  font-size: 14px;
  color: #555;
}

.stars {
  font-size: 18px;
  color: #ffd700;
  margin-right: 5px;
}

hr {
  border: 0;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
</style>
