<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import {
  collection,
  query,
  getDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
  orderBy,
  or,
  where
} from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { db } from '../../firebaseConfig'
import { useAuthStore } from '../../stores/auth'
import ChatWindow from './ChatWindow.vue'
import RequestService from '../../services/RequestService'

const route = useRoute()
const chatRooms = ref([])
const selectedChatId = ref('')
const selectedChatRoom = ref({})
const selectedUserData = ref({})
const selectedServiceRequest = ref({})
const myUserId = ref('')
const isMobile = ref(false)
const authStore = useAuthStore()
const isLoaded = ref(false)
const userData = computed(() => authStore.user)

async function fetchUserChatRooms(uid) {
  const q = query(
    collection(db, 'chatRoom'),
    or(where('requestUserId', '==', uid), where('userId', '==', uid)),
    orderBy('createdAt', 'desc')
  )
  onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      chatRooms.value = []
      selectedChatId.value = ''
      selectedChatRoom.value = {}
      selectedUserData.value = {}
      selectedServiceRequest.value = {}
      isLoaded.value = true
      return
    }
    populateInbox(querySnapshot)
  })
}

async function populateInbox(querySnapshot) {
  const incomingIds = querySnapshot.docs.map((doc) => doc.id)

  // Remove chatRooms that no longer exist in the querySnapshot
  chatRooms.value = chatRooms.value.filter((chat) => {
    const exists = incomingIds.includes(chat.id)
    return exists
  })

  if (chatRooms.value.length === 0) {
    selectedChatId.value = ''
    selectedServiceRequest.value = {}
    selectedUserData.value = {}
  }

  for (const document of querySnapshot.docs) {
    const data = document.data()
    const opponentId = data.requestUserId === myUserId.value ? data.userId : data.requestUserId
    const userDocRef = doc(db, 'users', opponentId)

    try {
      const docSnap = await getDoc(userDocRef)
      if (!docSnap.exists()) {
        console.warn(`User document for ID ${opponentId} does not exist.`)
        continue
      }
      const opponentData = docSnap.data()

      const serviceReq = await RequestService.getServiceRequest(data.requestId)
      if (!serviceReq) {
        console.warn(`Service request for ID ${data.requestId} not found.`)
        continue
      }

      const exists = chatRooms.value.some((chat) => chat.id === document.id)
      if (!exists) {
        chatRooms.value.push({
          serviceRequest: serviceReq,
          createdAt: data.createdAt,
          id: document.id,
          userData: opponentData
        })
      }
      if (selectedChatId.value === '') {
        selectedChatId.value = document.id
        selectedServiceRequest.value = serviceReq
        selectedUserData.value = opponentData
        fetchChatRoom(document.id)
      }
    } catch (error) {
      console.error(`Error processing chat room ${doc.id}:`, error)
    }
  }
  chatRooms.value.sort((a, b) => b.createdAt - a.createdAt)

  // Check for chatId in route after loading chatRooms
  const chatIdFromRoute = route.params.chatRoomId
  if (chatIdFromRoute) {
    const targetChat = chatRooms.value.find((chat) => chat.id === chatIdFromRoute)
    if (targetChat) {
      selectedChatId.value = targetChat.id
      selectedUserData.value = targetChat.userData
      selectedServiceRequest.value = targetChat.serviceRequest
      fetchChatRoom(targetChat.id)
    }
  }
  isLoaded.value = true
}

async function fetchChatRoom(id) {
  const q = doc(db, 'chatRoom', id)
  onSnapshot(q, async (docSnap) => {
    if (docSnap.exists()) {
      const chatData = docSnap.data()
      selectedChatRoom.value = chatData
      const request = await RequestService.getServiceRequest(chatData.requestId)
      selectedServiceRequest.value = request
    }
  })
}

async function handleSendMessage(message) {
  try {
    const q = doc(db, 'chatRoom', selectedChatId.value)
    const docSnap = await getDoc(q)
    if (docSnap.exists()) {
      const data = docSnap.data()
      const messagesArray = data.messages || []
      const newMessage = {
        msg: message.content,
        senderId: myUserId.value,
        timestamp: Timestamp.now(),
        type: message.type
      }
      messagesArray.push(newMessage)

      await updateDoc(q, {
        messages: messagesArray
      })
    }
  } catch (error) {
    console.error('Error updating document: ', error)
  }
}

async function handleCloseStatus(requestId, chatId) {
  await RequestService.closeServiceRequest(requestId)
  const chatRef = doc(db, 'chatRoom', chatId)
  await updateDoc(chatRef, {
    status: 'Closed'
  })
}

const selectChatRoom = (id, userData, serviceRequest) => {
  selectedUserData.value = userData
  selectedServiceRequest.value = serviceRequest
  selectedChatId.value = id
  fetchChatRoom(id)
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 991
}

onMounted(() => {
  watch(
    userData,
    (newVal) => {
      if (newVal) {
        myUserId.value = newVal.uid
        fetchUserChatRooms(newVal.uid)
      }
    },
    { immediate: true }
  )

  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div class="background py-2">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-12 column-right">
          <h3 class="header">Inbox</h3>
          <hr style="margin-bottom: 0px" />
          <div v-if="isLoaded">
            <div v-if="chatRooms.length === 0" class="spinner-container">
              <h5>No chat rooms found.</h5>
            </div>
            <div v-else>
              <div v-if="isMobile">
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle w-100 custom-dropdown-button"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ selectedUserData.username + ' - ' + selectedServiceRequest.title }}
                  </button>
                  <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                    <li v-for="chatRoom in chatRooms" :key="chatRoom.id">
                      <a
                        class="dropdown-item"
                        @click="
                          selectChatRoom(chatRoom.id, chatRoom.userData, chatRoom.serviceRequest)
                        "
                      >
                        {{ chatRoom.userData.username }} - {{ chatRoom.serviceRequest.title }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <ul v-else class="list-group list-group-flush">
                <li
                  href="#"
                  class="list-group-item list-group-item-action"
                  v-for="chatRoom in chatRooms"
                  :key="chatRoom.id"
                  :class="{ active: chatRoom.id === selectedChatId }"
                  @click="selectChatRoom(chatRoom.id, chatRoom.userData, chatRoom.serviceRequest)"
                >
                  <img
                    :src="chatRoom.userData.profilePicture"
                    class="rounded-circle me-2 profilePic"
                    alt="Profile Picture"
                    width="50"
                    height="50"
                  />
                  <div class="text-container">
                    <span class="name">{{ chatRoom.userData.username }}</span>
                    <span class="title">Request: {{ chatRoom.serviceRequest.title }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-else class="spinner-container">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <div class="col-lg-8 col-12 column">
          <div v-if="isLoaded">
            <ChatWindow
              v-if="chatRooms.length !== 0"
              :selectedChatRoom="selectedChatRoom"
              :selectedUserData="selectedUserData"
              :selectedServiceRequest="selectedServiceRequest"
              :isLoaded="isLoaded"
              :myUserId="myUserId"
              @sendMessage="handleSendMessage"
              @closeStatus="handleCloseStatus"
            />
          </div>
          <div v-else class="spinner-container">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url(../../assets/backdrop.png);
}

.profilePic {
  border: 1px solid rgb(177, 177, 177);
  object-fit: cover;
}

.dropdown-menu {
  max-height: 300px; /* Adjust the height as needed */
  overflow-y: auto; /* Enable vertical scrolling */
}

.column-right {
  padding: 0;
  background-color: white;
  border-right: 1px solid black;
}

.column {
  padding: 0;
}

.list-group {
  max-height: 72vh; /* Set maximum height for the list */
  overflow-y: auto; /* Enable scrolling */
}

.container {
  border: 1px solid rgb(0, 0, 0);
}

.dropdown-toggle[aria-expanded='true']:after {
  transform: rotate(180deg);
}

.dropdown-toggle:after {
  transition: 0.1s;
}

.list-group-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  
}

.header {
  padding: 16px 0 0 16px;
  margin: 0px;
}

.list-group-item.active {
  background-color: #ffad60 !important;
  border: 0px;
  color: black;
}

.name {
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}

.title {
  font-size: 14px;
  line-height: 22px;
}

.text-container {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.no-shadow {
  box-shadow: none;
  border: none;
  border-radius: 0;
  background-color: rgb(248, 248, 248);
}

@media (max-width: 991px) {
  .column {
    border-right: none;
    border-bottom: 1px solid lightgray;
    height: auto; /* Adjust height for mobile */
  }
  .row {
    flex-direction: column;
  }
  .col-md-4,
  .col-md-8 {
    width: 100%;
  }
}

.custom-dropdown-button {
  background-color: #FFAD60;
  text-align: left;
  color: black;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  padding: 20px;
}
</style> 
