<template>
  <div v-if="isLoaded" class="yellowbg">
    <div class="overall">
      <!-- Profile Section -->
      <div class="row profile-section">
        <img
          :src="user?.profilePicture"
          :alt="`${user.name}'s Profile Picture`"
          class="profile-pic col-md-6"
        />
        <div class="profile-details">
          <h1 class="profile-name">{{ user.username }}</h1>
          <p v-if="averageRating !== 'No ratings'" class="profile-rating profile-name">
            {{ '⭐'.repeat(averageRating) }}
          </p>
          <p v-else class="profile-rating profile-name">{{ averageRating }}</p>
          <h3 class="certifications">Certifications & Licenses</h3>
          <div
            v-if="!user.certificationsLicenses || user.certificationsLicenses.length === 0"
            style="text-align: center"
          >
            No certifications or licenses
          </div>
          <div v-else class="certs">
            <ul
              class="certifications-list"
              v-for="(certs, index) in user.certificationsLicenses"
              :key="index"
            >
              <li>{{ certs }}</li>
            </ul>
          </div>
          <div class="certs">
            <button
              v-if="currUId == userId"
              class="addservice"
              style="margin-top: 8px"
              @click="navigateToCreateCertLicense(userId)"
            >
              Add Certifications and Licenses
            </button>
          </div>
        </div>
      </div>

      <h2 class="section-title">{{ user.username }}'s' Services</h2>
      <div v-if="userservice.length === 0" class="no-services-message">No services available.</div>
      <div v-else class="row services-container">
        <template v-for="service in userservice" :key="service.id">
          <div
            v-for="(servicename, index) in service.service_type"
            :key="index"
            class="service-rectangle col-md-6 col-lg-4"
            @click="openModal(service)"
          >
            <div>
              <div class="label">{{ servicename }}</div>
              <img
                :src="serviceImgs[servicename] || 'fallback-image-url.jpg'"
                :alt="`${servicename} Image`"
                class="service-image"
              />
            </div>
          </div>
        </template>
      </div>

      <button v-if="currUId == userId" class="addservice" @click="navigateToCreateService">
        Add service
      </button>

      <ServiceModal
        v-if="showModal"
        :service="selectedService"
        :serviceImage="selectedServiceImage"
        :description="selectedServiceDescription"
        :yearsExperience="selectedServiceExperience"
        @close="closeModal"
      />

      <h2 class="section-title">{{ user.username }}'s Requests</h2>
      <div class="row request-container"></div>
      <div v-if="userrequest.length === 0" class="no-requests-message">No requests available.</div>
      <div v-else class="row services-container">
        <div
          v-for="request in userrequest"
          :key="request.id"
          class="service-rectangle col-md-6 col-lg-4"
        >
          <router-link :to="`/request/${request.id}`" class="service-rectangle no-underline">
            <div class="label">{{ request.title }}</div>
            <img :src="request.imgSrc" alt="" class="service-image" />
          </router-link>
        </div>
      </div>
      <button v-if="currUId == userId" class="addrequest" @click="navigateToCreateRequest">
        Add request
      </button>

      <h2 class="section-title">{{ user.username }}'s Reviews</h2>
      <div v-if="!user.reviews || user.reviews.length === 0" class="no-reviews-message">
        No reviews available.
      </div>
      <div v-else-if="user.reviews && user.reviews.length > 0" class="review-container">
        <div class="review-rectangle">
          <div v-for="(reviewItem, index) in user.reviews" :key="index" class="review">
            <p class="review-text">{{ reviewItem.review }}</p>
            <div class="reviewer-info">
              <span class="username">- by {{ reviewItem.username }}</span>
              <span class="stars">{{ '⭐'.repeat(reviewItem.rating) }}</span>
            </div>
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
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import ServiceModal from './ServiceModal.vue'

const authStore = useAuthStore()

export default {
  data() {
    return {
      authStore: useAuthStore(),
      name: 'personalProfile',
      userrequest: [],
      userservice: [],
      detailedUserServices: {},
      user: [],
      userId: '',
      currUId: '',
      serviceImgs: {
        Electrical:
          'https://pluggedinatl.com/wp-content/uploads/2021/06/iStock-1025303196-scaled.jpg',
        'Air-con': 'https://www.socool.sg/wp-content/uploads/2022/11/Ac-service-3-2-1080x675.jpg',
        Plumbing:
          'https://hw-singaporeplumbing.com.sg/wp-content/uploads/2018/12/sanitary-repair.png',
        Repair:
          'https://megafurniture.sg/cdn/shop/articles/the-top-5-refrigerator-singapore-repair-services-review-megafurniture.png?v=1721303860&width=1200',
        Installation:
          'https://www.ikea.com/ext/ingkadam/m/7c8d0ce75bda3d21/original/PH186193-crop001.jpg?f=s',
        Painting: 'https://www.paintingservicesingapore.sg/wp-content/uploads/2020/12/67766.jpg',
        Gardening:
          'https://www.helpling.com.sg/wp-content/uploads/2023/06/Helpling-gardening_bg.webp',
        Cleaning: 'https://cleanlab.com.sg/wp-content/uploads//House-cleaning.jpg'
      },
      isLoaded: false,
      showModal: false,
      selectedService: null,
      selectedServiceImage: '',
      selectedServiceDescription: '',
      selectedServiceExperience: 0
    }
  },
  setup() {
    const route = useRoute()
    return { route }
  },
  watch: {
    'authStore.user': {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.uid) {
          this.currUId = newValue.uid
        }
        this.isLoaded = true
      }
    },
    'route.params.userId': {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.userId = newValue
          this.fetchServiceRequestsByUser(this.userId)
          this.fetchServicesByUser(this.userId)
          this.fetchUser(this.userId)
        }
      }
    }
  },
  components: {
    ServiceModal
  },
  computed: {
    averageRating() {
      if (this.user.reviews && this.user.reviews.length > 0) {
        const totalRating = this.user.reviews.reduce((sum, review) => sum + review.rating, 0)
        return (totalRating / this.user.reviews.length).toFixed(1)
      }
      return 'No ratings'
    }
  },
  methods: {
    async fetchServiceRequestsByUser(userId) {
      const requestresult = await RequestService.getServiceRequestsByUser(userId)
      this.userrequest = requestresult
    },
    async fetchServicesByUser(userId) {
      const serviceresult = await Services.getServicesByUser(userId)
      this.userservice = serviceresult
      console.log(serviceresult)
      const detailedServiceMap = {}

      for (const service of serviceresult) {
        // console.log(service)
        for (const type of service.service_type) {
          const detailedService = await Services.getDetailedService(service.serviceId, type)
          detailedServiceMap[type] = {
            ...detailedService
          }
        }
      }
      this.detailedUserServices = detailedServiceMap
    },
    async fetchUser(userId) {
      const userresult = await UserService.getUserData(userId)
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
    async navigateToCreateCertLicense(userId) {
      if (authStore.user?.uid) {
        this.$router.push({ name: 'createCertificationLicenses', params: { userId } })
      } else {
        alert('You must be logged in to create a new service.')
      }
    },
    async openModal(service) {
      const detailedService = await Services.getDetailedService(
        service.serviceId,
        service.service_type[0]
      )

      if (detailedService) {
        this.selectedService = service
        this.selectedServiceImage =
          this.serviceImgs[service.service_type[0]] || 'fallback-image-url.jpg'
        this.selectedServiceDescription = detailedService.description
        this.selectedServiceExperience = detailedService.yearsExperience
        this.showModal = true
      } else {
        alert('Service details could not be retrieved.')
      }
    },
    closeModal() {
      this.showModal = false
      this.selectedService = null
      this.selectedServiceDescription = ''
      this.selectedServiceExperience = 0
    }
  },
  mounted() {
    const userId = this.$route.params.userId
    this.userId = userId
    this.fetchServiceRequestsByUser(userId)
    this.fetchServicesByUser(userId)
    this.fetchUser(userId)
  }
}
</script>

<style scoped>
/* Background styling */
.certs {
  display: flex;
  flex-direction: column;
  align-items: center;
}
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
  /* position: relative; */
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
}

.profile-name {
  font-size: 36px;
  font-weight: bold;
  color: #a66e38;
  margin: 0;
  text-align: center;
  margin-top: 10px;
}

.profile-rating {
  font-size: 24px;
  color: #ffd700;
  margin-top: 5px;
}
.certifications {
  text-align: center;
  margin-top: 10px;
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
  max-width: 1100px;
}

.service-rectangle {
  width: 250px;
  height: 300px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  overflow: hidden;
  transition: transform 0.3s ease;
  border-radius: 15px;
}

.addservice,
.addrequest {
  padding: 2px;
  width: 80%;
  border: none;
  border-radius: 20px;
  position: relative;
  background-color: #f88765;
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
.text {
  width: 100%;
  padding: 8px;
}
/* Prevent blue underline */
.no-underline {
  text-decoration: none;
}

/* Service image styling */
.service-image {
  width: 250px;
  height: 300px;
  /* max-width: 250px;
  max-height: 300px; */
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
