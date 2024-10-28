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
  orderBy
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
const serviceRequest = ref({})
const myUserId = ref('')
const isMobile = ref(false)
const authStore = useAuthStore()
const isLoaded = ref(false)
const userData = computed(() => authStore.user)

async function fetchUserChatRooms(uid) {
  const q = query(collection(db, 'chatRoom'), orderBy('createdAt', 'desc'))
  onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      isLoaded.value = true
      chatRooms.value = []
      selectedChatId.value = ''
      selectedChatRoom.value = {}
      selectedUserData.value = {}
      serviceRequest.value = {}
      return
    }

    const currentChatRoomIds = new Set(chatRooms.value.map((room) => room.id))
    let defaultSelection = null

    querySnapshot.forEach((doc) => {
      const userId = doc.data().userId
      const requestUserId = doc.data().requestUserId
      const requestId = doc.data().requestId
      const id = doc.data().id

      if (userId === uid || requestUserId === uid) {
        if (!defaultSelection) {
          defaultSelection = id
        }
        if (!currentChatRoomIds.has(id)) {
          if (userId === uid) {
            populateInbox(requestUserId, requestId, id)
          } else if (requestUserId === uid) {
            populateInbox(userId, requestId, id)
          }
        }
        currentChatRoomIds.delete(id)
      }
    })

    chatRooms.value = chatRooms.value.filter((room) => !currentChatRoomIds.has(room.id))

    if (selectedChatId.value == '') {
      selectedChatId.value = defaultSelection
      fetchChatRoom(defaultSelection)
    } else {
      fetchChatRoom(selectedChatId.value)
    }
  })
}

async function populateInbox(uid, requestId, id) {
  const q = doc(db, 'users', uid)
  const docSnap = await getDoc(q)
  const serviceRequest = await RequestService.getServiceRequest(requestId)
  if (docSnap.exists()) {
    const userData = docSnap.data()
    if (!selectedUserData.value.username) {
      selectedUserData.value = userData
    }
    chatRooms.value.push({
      profilePicture: userData.profilePicture,
      username: userData.username,
      title: serviceRequest.title,
      location: serviceRequest.location,
      id: id,
      userData: userData
    })
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
      serviceRequest.value = request
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
        msg: message,
        senderId: myUserId.value,
        timestamp: Timestamp.now()
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

const selectChatRoom = (id, userData) => {
  selectedUserData.value = userData
  selectedChatId.value = id
  fetchChatRoom(id)
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  watch(
    userData,
    (newVal) => {
      if (newVal) {
        const chatIdFromRoute = route.params.chatRoomId
        if (chatIdFromRoute) {
          selectedChatId.value = chatIdFromRoute
        }
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
  <div class="container">
    <div class="row">
      <div class="col-lg-4 col-12 column">
        <h3 class="header">Inbox</h3>
        <hr style="margin-bottom: 0px" />
        <div v-if="isLoaded">
          <div v-if="chatRooms.length === 0" class="spinner-container">
            <p>No chat rooms found.</p>
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
                  {{
                    selectedChatId
                      ? selectedUserData.username + ' - ' + serviceRequest.title
                      : 'Select User'
                  }}
                </button>
                <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                  <li v-for="chatRoom in chatRooms" :key="chatRoom.id">
                    <a
                      class="dropdown-item"
                      @click="selectChatRoom(chatRoom.id, chatRoom.userData)"
                    >
                      {{ chatRoom.username }} - {{ chatRoom.title }}
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
                @click="selectChatRoom(chatRoom.id, chatRoom.userData)"
              >
                <img
                  :src="chatRoom.profilePicture"
                  class="rounded-circle me-2"
                  alt="Profile Picture"
                  width="50"
                  height="50"
                />
                <div class="text-container">
                  <span class="name">{{ chatRoom.username }}</span>
                  <span class="title">Request: {{ chatRoom.title }}</span>
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
            :serviceRequest="serviceRequest"
            :isLoaded="isLoaded"
            :myUserId="myUserId"
            @sendMessage="handleSendMessage"
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
</template>

<style scoped>
.column {
  padding: 0;
  border-right: 1px solid lightgray;
}

.container {
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgb(248, 248, 248);
}

@media (max-width: 767px) {
  .column {
    border-right: none;
    border-bottom: 1px solid lightgray;
  }
  .row {
    flex-direction: column;
  }
  .col-md-4,
  .col-md-8 {
    width: 100%;
  }
}

.dropdown-toggle[aria-expanded='true']:after {
  transform: rotate(180deg);
}

.dropdown-toggle:after {
  transition: 0.1s;
}
.list-group-item {
  cursor: pointer;
  background-color: rgb(248, 248, 248);
  display: flex;
  align-items: center;
}

.header {
  padding: 16px 0 0 16px;
  margin: 0px;
}

.list-group-item.active {
  background-color: #dedfdf !important;
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

@media (max-width: 768px) {
  .list-group {
    display: none;
  }
}

.custom-dropdown-button {
  background-color: rgb(248, 248, 248);
  border: none;
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
