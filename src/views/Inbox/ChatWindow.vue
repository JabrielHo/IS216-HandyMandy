<script setup>
import { ref, computed, watch, onMounted, onUpdated, nextTick } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useRouter } from 'vue-router'
import { ref as storageRef, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import { db } from '../../firebaseConfig'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'

const router = useRouter()
const message = ref('')
const chatContainer = ref(null)
const props = defineProps({
  selectedChatRoom: Object,
  selectedUserData: Object,
  selectedServiceRequest: Object,
  myUserId: String,
  isLoaded: Boolean
})
const reviewText = ref('')
const rating = ref(0)
const fileInput = ref(null)
const emit = defineEmits(['sendMessage', 'closeStatus', 'acceptStatus'])
const hasReviewed = ref(false)
const isReviewLoading = ref(false)

function setRating(star) {
  rating.value = star
}

async function openReviewModal() {
  rating.value = 0
  reviewText.value = ''
  isReviewLoading.value = true
  try {
    const docSnap = await getDoc(doc(db, 'users', props.selectedUserData.userId))
    const userData = docSnap.data()
    if (Array.isArray(userData.reviews)) {
      const existingReview = userData.reviews.find(
        (review) =>
          review.userId === props.myUserId && review.chatRoomId === props.selectedChatRoom.id
      )
      hasReviewed.value = !!existingReview
    } else {
      hasReviewed.value = false
    }
  } catch (error) {
    console.error('Error submitting review:', error)
  } finally {
    isReviewLoading.value = false
  }
}

function validateReview() {
  let isValid = true
  if (!rating.value) {
    isValid = false
  }

  if (!reviewText.value.trim()) {
    isValid = false
  }

  return isValid
}

async function submitReview() {
  if (validateReview()) {
    if (rating.value && reviewText.value.trim()) {
      try {
        const currentUserDoc = await getDoc(doc(db, 'users', props.myUserId))

        const review = {
          userId: props.myUserId,
          username: currentUserDoc.data().username,
          rating: rating.value,
          review: reviewText.value,
          chatRoomId: props.selectedChatRoom.id,
          timestamp: new Date()
        }

        const userRef = doc(db, 'users', props.selectedUserData.userId)
        await updateDoc(userRef, {
          reviews: arrayUnion(review)
        })
        // Reset the form
        rating.value = 0
        reviewText.value = ''
      } catch (error) {
        console.error('Error submitting review:', error)
      }
    }
  }
}

const sendMessage = () => {
  if (message.value.trim()) {
    emit('sendMessage', { type: 'text', content: message.value })
    message.value = ''
    scrollToBottom()
  }
}

function attachImage() {
  fileInput.value.click()
}

function closeRequest() {
  emit('closeStatus', props.selectedServiceRequest.id, props.selectedChatRoom.id)
}

function acceptRequest() {
  emit('acceptStatus', props.selectedServiceRequest.id, props.selectedChatRoom.id)
}

async function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    const storage = getStorage()
    const imgRef = storageRef(
      storage,
      `chatRooms/${props.selectedChatRoom.id}/${Date.now()}_${file.name}`
    )
    try {
      const snapshot = await uploadBytes(imgRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      emit('sendMessage', { type: 'image', content: downloadURL })
      event.target.value = null
      scrollToBottom()
    } catch (error) {
      console.error('Error uploading image:', error)
    }
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

function navigateToProfile(id) {
  router.push('/profile/' + id)
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
// Watch for changes in the messages and scroll to bottom on update
watch(
  () => processedMessages.value,
  async () => {
    await nextTick()
    scrollToBottom()
  },
  { immediate: true }
)

// Ensure scroll to bottom on initial load or updates
onMounted(async () => {
  await nextTick()
  scrollToBottom()
})
onUpdated(async () => {
  await nextTick()
  scrollToBottom()
})

function openImage(imageUrl) {
  window.open(imageUrl, '_blank')
}
</script>

<template>
  <div class="background">
    <div v-if="!isLoaded" class="spinner-container">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div class="card" :class="{ 'has-request': selectedChatRoom.type === 'Request' }">
        <div class="card-header">
          <img
            :src="selectedUserData.profilePicture"
            class="rounded-circle me-2 profilePic userClass"
            alt="Profile Picture"
            width="50"
            height="50"
            @click="navigateToProfile(selectedUserData.userId)"
          />
          <div
            class="text-container userClass"
            @click="navigateToProfile(selectedUserData.userId)"
            v-if="selectedChatRoom.type === 'Request'"
          >
            <span class="name">{{ selectedUserData.username }}</span>
            <span class="location">Status: {{ selectedChatRoom.status }}</span>
          </div>
          <div
            class="text-container userClass"
            @click="navigateToProfile(selectedUserData.userId)"
            v-else
          >
            <span class="name">{{ selectedUserData.username }}</span>
          </div>
          <button
            v-if="
              selectedChatRoom.requesterUserId === myUserId && selectedChatRoom.status === 'Closed' || selectedChatRoom.type === 'Service' && selectedChatRoom.requesterUserId === myUserId
            "
            class="btn reviewBtn"
            data-bs-toggle="modal"
            data-bs-target="#reviewModal"
          >
            <i class="bi bi-pencil"></i> &nbsp;Write a Review
          </button>
        </div>
        <div class="card-header" v-if="selectedChatRoom.type === 'Request'">
          <img
            :src="selectedServiceRequest.imgSrc"
            class="me-2 requestClass"
            alt="Request Img"
            width="50"
            height="50"
            @click="goToRequestPage(selectedServiceRequest.id)"
          />
          <div
            class="text-container requestClass"
            @click="goToRequestPage(selectedServiceRequest.id)"
          >
            <span class="title">{{ selectedServiceRequest.title }}</span>
            <span class="location">{{ selectedServiceRequest.location }}</span>
          </div>
          <button
            v-if="
              selectedChatRoom.status === 'Open' &&
              selectedChatRoom.requesterUserId === myUserId &&
              selectedChatRoom.type === 'Request'
            "
            class="btn reviewBtn"
            @click="acceptRequest()"
          >
            Accept service
          </button>
          <div
            v-if="
              selectedChatRoom.status === 'Accepted' &&
              selectedChatRoom.requesterUserId === myUserId &&
              selectedChatRoom.type === 'Request'
            "
            class="dropdown request-status"
          >
            <div
              role="button"
              class="dropdown-toggle no-caret"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </div>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#closeModal"
                  >Close Request</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body" ref="chatContainer">
          <div v-for="(message, index) in processedMessages" :key="index" class="mb-2">
            <div v-if="message.showTimestamp" class="conversation-timestamp">
              {{ message.formattedDate }}
            </div>
            <div v-if="message.type === 'text'">
              <div v-if="message.senderId === myUserId" class="text-end">
                <div class="chat-bubble me">
                  <span>{{ message.msg }}</span>
                </div>
              </div>
              <div v-else class="d-flex align-items-start">
                <img
                  :src="selectedUserData.profilePicture"
                  class="rounded-circle me-2 profilePic"
                  alt="User Profile"
                  width="36"
                  height="36"
                />
                <div class="chat-bubble other">
                  <span>{{ message.msg }}</span>
                </div>
              </div>
            </div>
            <div v-else-if="message.type === 'image'">
              <div v-if="message.senderId === myUserId" class="text-end">
                <div class="chat-bubble-img me" @click="openImage(message.msg)">
                  <img
                    :src="message.msg"
                    alt="Sent Image"
                    class="chat-image"
                    @load="scrollToBottom"
                  />
                </div>
              </div>
              <div v-else class="d-flex align-items-start">
                <img
                  :src="selectedUserData.profilePicture"
                  class="rounded-circle me-2 profilePic"
                  alt="User Profile"
                  width="36"
                  height="36"
                />
                <div class="chat-bubble-img other" @click="openImage(message.msg)">
                  <img
                    :src="message.msg"
                    alt="Received Image"
                    class="chat-image"
                    @load="scrollToBottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="selectedChatRoom.status !== 'Closed' || selectedChatRoom.type === 'Service'"
        class="input-group"
      >
        <div class="input-wrapper">
          <input
            type="text"
            class="form-control-chat form-control"
            v-model="message"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
          />
          <span class="clip-icon" @click="attachImage"><i class="bi bi-image"></i></span>
          <span class="send-icon" @click="sendMessage"><i class="bi bi-send"></i></span>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            style="display: none"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="closeModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Close Request?</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Are you sure you want to close this request? This is irreversable!
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
          <button
            type="button"
            class="btn closeBtn"
            @click="closeRequest()"
            data-bs-dismiss="modal"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Review Modal -->
  <div
    class="modal fade"
    id="reviewModal"
    tabindex="-1"
    aria-labelledby="reviewModalLabel"
    aria-hidden="true"
    v-on="{ 'show.bs.modal': openReviewModal }"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="reviewModalLabel">
            Liked {{ selectedUserData.username }}'s Service?
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div v-if="!isReviewLoading" class="modal-body">
          <template v-if="hasReviewed">
            <p>You have already submitted a review for this request.</p>
          </template>
          <template v-else>
            <form>
              <div class="mb-3">
                <label for="reviewText" class="form-label">Review:</label>
                <textarea
                  id="reviewText"
                  class="form-control"
                  v-model="reviewText"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="rating" class="form-label">Rating:</label>
                <div>
                  <i
                    v-for="star in 5"
                    :key="star"
                    class="bi"
                    :class="star <= rating ? 'bi-star-fill' : 'bi-star'"
                    @click="setRating(star)"
                    style="cursor: pointer; font-size: 1.5rem; color: gold"
                  ></i>
                </div>
              </div>
            </form>
          </template>
        </div>
        <div class="modal-footer" v-if="!hasReviewed">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
          <button
            type="button"
            class="btn closeBtn"
            @click="submitReview"
            data-bs-dismiss="modal"
            :disabled="!rating || !reviewText.trim()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviewBtn {
  display: flex;
  margin-left: auto;
  background-color: #F88765;
  color: white;
}

.reviewBtn:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.closeBtn {
  background-color: #F88765;
  color: white;
}

.closeBtn:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.background {
  background-color: #ffeead;
}

.request {
  background-color: #F88765;
}

.profilePic {
  border: 1px solid rgb(177, 177, 177);
  object-fit: cover;
}

.dropdown-menu .dropdown-item:hover,
.dropdown-menu .dropdown-item:focus {
  background-color: #F88765;
  color: white;
  cursor: pointer;
}

.no-caret::after {
  display: none;
}

.userClass {
  cursor: pointer;
}

.requestClass {
  cursor: pointer;
}

.profilePic {
  border: 1px solid rgb(177, 177, 177);
}

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
  --request-header-height: 67px;
}

.card-header {
  display: flex;
  background-color: white;
  align-items: center;
}

.request-status {
  display: flex;
  margin-left: auto;
}

.card-body {
  overflow-y: auto;
  position: relative;
}

.card.has-request .card-body {
  height: calc(72vh - 54px - var(--request-header-height));
}

.card:not(.has-request) .card-body {
  height: calc(72vh - 54px);
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

.form-control-chat {
  background-color: rgb(248, 248, 248);
  border-color: lightgray;
  border-radius: 25px;
  padding-right: 70px;
}

.form-control:focus {
  border-color: lightgray;
  outline: none;
  box-shadow: none;
}

.clip-icon {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
}

.send-icon {
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
  border-radius: 15px;
  max-width: 60%;
  word-wrap: break-word;
  text-align: left;
}

.chat-bubble-img {
  display: inline-block;
  border-radius: 15px;
  max-width: 60%;
  word-wrap: break-word;
  text-align: left;
}

.chat-bubble.me {
  background-color: #F88765;
  border: 1px solid lightgray;
  color: black;
  align-self: flex-end;
}

.chat-bubble.other {
  background-color: #ffffff;
  border: 1px solid lightgray;

  color: black;
  align-self: flex-start;
}

.chat-image {
  max-width: 100%;
  border-radius: 10px;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}
</style>
