<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
<template>
  <div class="yellowbg">
    <div class="overall">
      <!-- Profile Section -->
      <div class="row profile-section">
        <img src="./images/profilepic.png" alt="John Doe's Profile Picture" class="profile-pic col-md-6" />
        <div class="profile-details">
          <h1 class="profile-name">John Doe</h1>
          <p class="profile-rating">⭐⭐⭐⭐☆</p>
          <h3 class="certifications-title">Certifications & Licenses</h3>
          <ul class="certifications-list">
            <li>Certified Plumbing Specialist</li>
            <li>Licensed Electrician</li>
            <li>Furniture Assembly Expert</li>
            <li>Wifi Network Troubleshooter</li>
          </ul>
        </div>
      </div>
    
      <h2 class="section-title">John's Services</h2>
      <div class="row request-container col-12 "></div>
      <div v-for="service in userservice" class="request-container col-md-6">
        <div v-for="servicename in service.service_type">
        <router-link :to="`/service/${service.serviceId}`" class="service-rectangle no-underline col-md-6">
          <div class="label">{{ servicename }}</div>
          <!-- <img :src="request.imgSrc" alt="" class="service-image" /> -->
        </router-link>
      </div>
      <!-- <div class="row services-container col-12 "> -->

        <!-- <router-link to="./plumbing" class="service-rectangle no-underline col-md-6">
          <div class="label">Plumbing</div>
          <img src="./images/plumbingimage.jpg" alt="Plumbing Service" class="service-image" />
        </router-link>

        <router-link to="./wifi_fixer" class="service-rectangle no-underline col-md-6">
          <div class="label">Wifi Fixer</div>
          <img src="./images/wifi.jpg" alt="Wifi Fixer" class="service-image" />
        </router-link>

        <router-link to="./furnitureassembly" class="service-rectangle no-underline col-md-6">
          <div class="label">Furniture Assembly</div>
          <img src="./images/furniture_assembly.webp" alt="Furniture Assembly" class="service-image" />
        </router-link> -->
      </div> 
    <button class="addservice">Add another service</button>

      <h2 class="section-title">John's Requests</h2>
      <div class="row request-container col-12 "></div>
      <div v-for="request in userrequest" :key="request.id" class="request-container col-md-6">
        <router-link :to="`/request/${request.id}`" class="service-rectangle no-underline col-md-6">
          <div class="label">{{ request.title }}</div>
          <img :src="request.imgSrc" alt="" class="service-image" />
        </router-link>
  
      </div>
      <button class="addrequest">Add another request</button>
      <h2 class="section-title">John's Reviews</h2>
      <div class="review-container">
        <div class="review-rectangle">
          <div class="review">
            <p class="review-text">Great Work!</p>
            <div class="reviewer-info">
              <span class="username">- by JaneDoe</span>
              <span class="stars">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
          <hr />
          <div class="review">
            <p class="review-text">Very Reliable</p>
            <div class="reviewer-info">
              <span class="username">- by User123</span>
              <span class="stars">⭐⭐⭐⭐</span>
            </div>
          </div>
          <!-- New Reviews -->
          <div class="review">
            <p class="review-text">John was prompt, professional, and did an amazing job fixing our plumbing issue. Highly recommended!</p>
            <div class="reviewer-info">
              <span class="username">- by HappyCustomer</span>
              <span class="stars">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
          <hr />
          <div class="review">
            <p class="review-text">Outstanding service! He helped me with my kitchen sink that had been leaking for weeks. Very knowledgeable and courteous.</p>
            <div class="reviewer-info">
              <span class="username">- by SatisfiedClient</span>
              <span class="stars">⭐⭐⭐⭐⭐</span>
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


export default {
  data(){
    return{
  name: "personalProfile",
  userrequest:[],
  userservice:[],
    }
},
  setup() {},
  methods:{
    async fetchServiceRequestsByUser() {
  const requestresult = await RequestService.getServiceRequestsByUser("PpqAdVds6ZMptMp1o5KGKBWXAGM2")
  console.log(requestresult)
  this.userrequest = requestresult;

},
async fetchServicesByUser() {
  const serviceresult = await Services.getServicesByUser("PpqAdVds6ZMptMp1o5KGKBWXAGM2")
  console.log(serviceresult)
  this.userservice = serviceresult;

},

  },
  mounted() {
    this.fetchServiceRequestsByUser()
    this.fetchServicesByUser()
  }
};
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
  color: #A66E38;
  margin: 0;
}

.profile-rating {
  font-size: 24px;
  color: #FFD700;
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
  color: #40E0D0;
}

.section-title {
  text-align: center;
  color: #A66E38;
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
.addservice, .addrequest{
  padding: 2px;
  width: 80%;
  border: none;
  border-radius: 20px;
  position: relative;
  background-color: #FFAD60;
}
.addservice:hover , .addrequest:hover{
  background-color: #FFAD10;
}
.service-rectangle:hover {
  transform: scale(1.05);
}

.label {
  width: 100%;
  background-color: #A66E38;
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
  background-color: #96CEB4;
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
  color: #FFD700;
  margin-right: 5px;
}

hr {
  border: 0;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
</style>
