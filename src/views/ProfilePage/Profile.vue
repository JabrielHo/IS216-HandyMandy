<template>
  <div v-if="isLoaded" class="yellowbg">
    <div class="overall">
      <!-- Profile Section -->
      <div class="row profile-section">
        <div class="col-md-4">
          <img
            :src="user?.profilePicture"
            :alt="`${user.name}'s Profile Picture`"
            class="profile-pic"
          />
        </div>
        <div class="profile-details col-md-8">
          <h1 class="profile-name">{{ user.username }}</h1>
          <p v-if="averageRating !== 'No ratings'" class="profile-rating profile-name">
            {{ '⭐'.repeat(averageRating) }}
          </p>
          <p v-else class="profile-rating profile-name">{{ averageRating }}</p>
        </div>
      </div>

      <div if="certification-container">
        <h2 class="section-title">Certifications & Licenses</h2>
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

      <div id="service-container">
        <h2 class="section-title">{{ user.username }}'s Services</h2>
        <div v-if="userservice.length === 0">No services available.</div>
        <div v-else class="row services-container">
          <template v-for="service in userservice" :key="service.id">
            <div
              v-for="(servicename, index) in service.service_type"
              :key="index"
              class="service-rectangle col-lg-4 col-md-6 col-sm-3"
              @click="openModal(service, servicename)"
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
      <div v-if="userrequest.length === 0">No requests available.</div>
      <div v-else class="row request-container">
        <div
          v-for="request in userrequest"
          :key="request.id"
          class="service-rectangle col-sm-3 col-md-6 col-lg-4"
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

      <div id="review-container" class="mx-auto text-center mb-5">
        <h2 class="section-title">{{ user.username }}'s Reviews</h2>
        <div v-if="!user.reviews || user.reviews.length === 0">No reviews available.</div>
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
    async openModal(service, servicename) {
      // console.log(service, servicename)
      const detailedService = await Services.getDetailedService(service.serviceId, servicename)

      if (detailedService) {
        this.selectedService = service
        this.selectedServiceImage = this.serviceImgs[servicename]
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
  padding-top: clamp(1rem, 1vw, 2rem);
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
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  margin-top: clamp(2rem, 2vw, 5rem);
  margin-bottom: clamp(1rem, 1vw, 5rem);
}

.profile-pic {
  /* width: 25%; */
  width: 100%;
  height: 100%;
  border-radius: 100px;
  /* margin-right: 100px;
  margin-left: 100px;
  margin-bottom: 20px; */
}

.profile-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: clamp(2rem, 4vw, 5rem);
  font-weight: bold;
  color: #a66e38;
  margin: 0;
  text-align: center;
  margin-top: 10px;
}

.profile-rating {
  font-size: clamp(1rem, 4vw, 5rem);
  color: #ffd700;
  margin-top: 5px;
}
.certifications {
  text-align: center;
  margin-top: clamp(2rem, 2vw, 2rem);
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
  gap: 1vw;
  /* margin-bottom: 50px; */
  /* max-width: 1100px;
  margin-top: 10px;
  width: 100%; */
}

.service-rectangle {
  width: clamp(100px, 100%, 120px);
  height: clamp(150px, 30vh, 220px);
  background-color: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  overflow: hidden;
  transition: transform 0.3s ease;
  border-radius: 15px;
}

/* iPhone SE and smaller screens */
@media (max-width: 375px) {
  .service-rectangle {
    width: clamp(0px, 100%, 300px);
    height: clamp(0px, 35vh, 250px);
  }
}

/* Small tablets and larger phones */
@media (min-width: 376px) and (max-width: 576px) {
  .service-rectangle {
    width: clamp(130px, 100%, 200px);
    height: clamp(160px, 32vh, 230px);
  }
}

/* Medium devices */
@media (min-width: 577px) {
  .service-rectangle {
    width: clamp(160px, 100%, 220px);
    height: clamp(180px, 35vh, 220px);
  }
}

/* Service image styling */
.service-image {
  width: 100%;
  height: 100%;
  /* max-width: 250px;
  max-height: 300px; */
  object-fit: cover;
  border-radius: 0 0 15px 15px;
}

.addservice,
.addrequest {
  padding: 12px 24px;
  margin-bottom: 20px;
  margin-top: 20px;
  width: min(80%, 300px);
  border: none;
  border-radius: 25px;
  position: relative;
  background-color: #f88765;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(248, 135, 101, 0.3);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.addservice:hover,
.addrequest:hover {
  background-color: #ffad10;
  box-shadow: 0 4px 15px rgba(255, 173, 16, 0.4);
  transform: translateY(-2px);
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
  font-size: clamp(1rem, 1vw, 2rem);
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
