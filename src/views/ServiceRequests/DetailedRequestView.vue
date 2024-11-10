<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'
import { db } from '../../firebaseConfig'
import { collection, query, where, getDocs, setDoc, Timestamp, doc } from 'firebase/firestore'
import RequestService from '../../services/RequestService'
import UserService from '../../services/UserService'
import PlaceholderDetailedRequestView from '@/components/PlaceholderDetailedRequestView.vue'

const route = useRoute()
const router = useRouter()
const serviceRequest = ref({})
const user = ref({})
const loading = ref(true)
const formattedDate = ref('')
const lat = ref('')
const long = ref('')
const authStore = useAuthStore()
const userData = computed(() => authStore.user)
const isLoggedIn = computed(() => authStore.user !== null)
const isMyRequest = ref(false)

function navigateToServiceRequest() {
  router.push('/requests')
}

function navigateToProfile(id) {
  router.push('/profile/' + id)
}

async function fetchServiceRequest(requestId) {
  loading.value = true
  serviceRequest.value = await RequestService.getServiceRequest(requestId)
  await fetchUserData(serviceRequest.value.userId)
  await formatDate(serviceRequest.value.timestamp)
  await getCoordinates(serviceRequest.value.location)
}

async function fetchUserData(userId) {
  if (userData.value) {
    if (userId !== userData.value.uid) {
      isMyRequest.value = false
      user.value = await UserService.getUserData(userId)
    } else {
      isMyRequest.value = true
    }
  } else {
    user.value = await UserService.getUserData(userId)
  }
}

async function initializeMap(x, y) {
  await nextTick()
  const map = L.map('map', {
    dragging: false,
    scrollWheelZoom: false,
    zoomControl: false
  }).setView([x, y], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
  map.doubleClickZoom.disable()
  L.marker([x, y]).addTo(map)
}

async function getCoordinates(location) {
  const url =
    'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=' +
    location +
    '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }
    const data = await response.json()
    lat.value = data.results[0].LATITUDE
    long.value = data.results[0].LONGITUDE
    loading.value = false
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
  }
}

function formatDate(timestamp) {
  let msgDate
  if (timestamp && timestamp.seconds) {
    // Convert Firebase timestamp to JavaScript Date
    msgDate = new Date(timestamp.seconds * 1000)
  }
  formattedDate.value = msgDate
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    .replace(',', '')
}

async function createChat() {
  const helperUserId = userData.value.uid
  const requesterUserId = serviceRequest.value.userId
  const requestId = route.params.id

  const chatRoomRef = collection(db, 'chatRoom')
  const q = query(
    chatRoomRef,
    where('helperUserId', '==', helperUserId),
    where('requesterUserId', '==', requesterUserId),
    where('requestId', '==', requestId)
  )
  const querySnapshot = await getDocs(q)

  let chatRoomId

  if (querySnapshot.empty) {
    const newChatRoomRef = doc(chatRoomRef)
    await setDoc(newChatRoomRef, {
      id: newChatRoomRef.id,
      status: 'Open',
      helperUserId: helperUserId,
      requesterUserId: requesterUserId,
      requestId: requestId,
      messages: [
        {
          msg:
            'Hello, I need help with my service request titled "' +
            serviceRequest.value.title +
            '". Could you please assist me with it?',
          senderId: requesterUserId,
          timestamp: Timestamp.now(),
          type: 'text'
        }
      ],
      createdAt: Timestamp.now(),
      type: 'Request'
    })
    chatRoomId = newChatRoomRef.id
  } else {
    chatRoomId = querySnapshot.docs[0].id
  }

  router.push({ name: 'chatView', params: { chatRoomId } })
}

onMounted(async () => {
  // Fetch Data
  await fetchServiceRequest(route.params.id)
  initializeMap(lat.value, long.value)
})
</script>

<template>
  <div class="background">
    <section class="container pt-2">
      <div v-if="loading">
        <PlaceholderDetailedRequestView></PlaceholderDetailedRequestView>
      </div>
      <div v-else>
        <nav style="--bs-breadcrumb-divider: '>'" aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item back" @click="navigateToServiceRequest()">
              Service Requests
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ serviceRequest.title }}</li>
          </ol>
        </nav>
    
         
<template class="card">
  <div class="card-content ">
    <!-- Image on the left -->
    <img :src="serviceRequest.imgSrc" alt="RequestImg" class="responsive-img rounded card-img" />
    
    <!-- Text content on the right -->
    <div class="card-text ">
      <h1 class="title">{{ serviceRequest.title }}</h1>
      <hr />
      <div class="contain">
        <div class="left">
          <span class="category-header">Category</span><br />
          <span class="category">{{ serviceRequest.category }}</span>
        </div>
        <div class="right">
          <span class="category-header">Created</span><br />
          <span class="category">{{ formattedDate }}</span>
        </div>
      </div>
      <hr />
      <h1 class="description-header">Description</h1>
      <span class="desc">{{ serviceRequest.description }}</span>
      <hr />
    </div>
    
  </div>
  <h1 class="description-header">Location</h1>
  <div id="map" class="responsive-map rounded"></div>
  <div v-if="!isMyRequest">
            <div class="card usercard">
              <div class="userInfo" @click="navigateToProfile(serviceRequest.userId)">
                <img
                  :src="user.profilePicture"
                  class="rounded-circle me-2 profilePic"
                  alt="Profile Picture"
                  width="40"
                  height="40"
                />
                <div class="text-container">
                  <span class="name">{{ user.username }}</span>
                  <span class="location">{{ serviceRequest.location }}</span>
                </div>
              </div>
              <button
                v-if="isLoggedIn && serviceRequest.status === 'Open'"
                type="button"
                class="btn chatBtn mt-2"
                @click="createChat"
              >
                Chat
              </button>
            </div>
          </div>
</template>
 
      </div>
    </section>
  </div>
</template>

<style scoped>



.chatBtn {
  background-color: #ffad60;
  color: white;
}

.chatBtn:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.background {
  background-image: url(../../assets/backdrop.png);
}

.profilePic {
  border: 1px solid rgb(177, 177, 177);
  object-fit: cover;
}
.card {
  padding: 18px;
}
.responsive-img {
  height:230px;
  width: auto;
}

.responsive-map {
  height: 300px;
  width: 100%
}

@media (max-width: 767px) {
  .responsive-map {
    min-height: 300px;
  }
}
.card-img {
 max-width: 200px; /* Limit the image width */
  margin-right: 20px;
}

.card-content {
  display: flex;
  align-items: flex-start;
}

.card-text {
  flex: 1; /* Allows text content to take up the remaining space */
}
.contain {
  display: flex;
  /* gap: 50px; */
  justify-content: space-between;
}

.left,
.right {
  flex:1;
}

.back {
  color: rgba(33, 37, 41, 0.75);
  text-decoration: none;
}

.back:hover {
  color: #ffad60;
  text-decoration: underline;
  cursor: pointer;
}

.title {
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 8px;
}

.category-header {
  font-size: 14px;
  line-height: 22px;
  color: rgb(109, 110, 113);
}

.category {
  font-size: 16px;
  line-height: 24px;
}

.description-header {
  font-size: 20px;
  line-height: 28px;
}

.usercard {
  margin-top: 10px;
  padding: 10px;
  box-shadow:
    0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2);
}

.userInfo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.location {
  font-size: 14px;
  color: rgb(105, 105, 105);
}
</style>