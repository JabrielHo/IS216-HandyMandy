<script setup>
import { ref, computed, watch, onMounted, onUpdated } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = ref('')
const chatContainer = ref(null)
const props = defineProps({
  selectedChatRoom: Object,
  selectedUserData: Object,
  serviceRequest: Object,
  myUserId: String,
  isLoaded: Boolean
})

const emit = defineEmits(['sendMessage'])
const sendMessage = () => {
  if (message.value.trim()) {
    emit('sendMessage', message.value)
    message.value = ''
  }
}

const processedMessages = computed(() => {
  const messages = props.selectedChatRoom?.messages || []
  let lastDate = null
  return messages.map((msg) => {
    let msgDate
    if (msg.timestamp && msg.timestamp.seconds) {
      // Convert Firebase timestamp to JavaScript Date
      msgDate = new Date(msg.timestamp.seconds * 1000)
    } else {
      // Fallback for other timestamp formats
      msgDate = new Date(msg.timestamp)
    }
    const formattedDate = msgDate
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      .replace(',', '')
    const showTimestamp = formattedDate !== lastDate
    lastDate = formattedDate
    return { ...msg, showTimestamp, formattedDate }
  })
})

function goToRequestPage(requestId) {
  router.push('/request/' + requestId)
}

// Scroll to the bottom of the chat container
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Watch for changes in the messages and scroll to bottom on update
watch(
  () => props.selectedChatRoom?.messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

// Ensure scroll to bottom on initial load or updates
onMounted(scrollToBottom)
onUpdated(scrollToBottom)
</script>


<template>
  <div v-if="!isLoaded" class="spinner-container">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="card">
      <div class="card-header">
        <img
          :src="selectedUserData.profilePicture"
          class="rounded-circle me-2"
          alt="Profile Picture"
          width="50"
          height="50"
        />
        <span class="name">{{ selectedUserData.username }}</span>
      </div>
      <div class="card-header" @click="goToRequestPage(serviceRequest.id)">
        <img :src="serviceRequest.imgSrc" class="me-2" alt="Request Img" width="50" height="50" />
        <div class="text-container">
          <span class="title">{{ serviceRequest.title }}</span>
          <span class="location">{{ serviceRequest.location }}</span>
        </div>
      </div>
      <div class="card-body" ref="chatContainer">
        <div v-for="(message, index) in processedMessages" :key="index" class="mb-2">
          <div v-if="message.showTimestamp" class="conversation-timestamp">
            {{ message.formattedDate }}
          </div>
          <div v-if="message.senderId === myUserId" class="text-end">
            <div class="chat-bubble me">
              <span>{{ message.msg }}</span>
            </div>
          </div>
          <div v-else>
            <div class="chat-bubble other">
              <span>{{ message.msg }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group">
      <div class="input-wrapper">
        <input
          type="text"
          class="form-control"
          v-model="message"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <span class="clip-icon" @click="attachImage"><i class="bi bi-image"></i></span>
      </div>
    </div>
  </div>
</template>


<style scoped>
.name {
  font-size: 20px;
  font-weight: 600;
}

.title {
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}

.location {
  font-size: 14px;
  line-height: 22px;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.card {
  border-radius: 0;
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.card-body {
  height: 60vh;
  overflow-y: auto;
  position: relative;
}

.conversation-timestamp {
  text-align: center;
  font-size: 12px;
  color: gray;
  margin-bottom: 10px;
}

.input-group {
  padding: 8px;
  background-color: white;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.form-control {
  background-color: rgb(248, 248, 248);
  border-color: lightgray;
  border-radius: 25px;
  padding-right: 30px;
}

.form-control:focus {
  border-color: lightgray;
  outline: none;
  box-shadow: none;
}

.clip-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
}

.chat-bubble {
  display: inline-block;
  padding: 5px 10px 5px 10px;
  border-radius: 20px;
  max-width: 60%;
  word-wrap: break-word;
  text-align: left;
}

.chat-bubble.me {
  border: 1px solid lightgray;
  background-color: #efefef;
  color: black;
  align-self: flex-end;
}

.chat-bubble.other {
  border: 1px solid lightgray;
  background-color: #ffffff;
  color: black;
  align-self: flex-start;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}
</style>