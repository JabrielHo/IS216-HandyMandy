<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  serviceRequest: Object
})

const router = useRouter()

function navigateToDetailedRequest(id) {
  router.push('/request/' + id)
}

function handleMouseDown(event, id) {
  if (event.button === 1) {
    event.preventDefault()
    window.open('/request/' + id, '_blank')
  }
}

function formatDate(timestamp) {
  let msgDate
  if (timestamp && timestamp.seconds) {
    // Convert Firebase timestamp to JavaScript Date
    msgDate = new Date(timestamp.seconds * 1000)
  }
  return msgDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div
    class="card"
    @click="navigateToDetailedRequest(serviceRequest.id)"
    @mousedown="handleMouseDown($event, serviceRequest.id)"
  >
    <div class="img-container">
      <img :src="serviceRequest.imgSrc" class="card-img-top standard-img" alt="Request Image" />
      <span class="badge rounded-pill text-bg-secondary mb-2 category-badge">{{
        serviceRequest.category
      }}</span>
    </div>

    <div class="card-body">
      <div class="userInfo">
        <img
          :src="serviceRequest.profilePicture"
          class="rounded-circle me-2 profilePic"
          alt="Profile Picture"
          width="40"
          height="40"
        />
        <div class="text-container">
          <span class="name">{{ serviceRequest.name }}</span>
          <span class="date">{{ formatDate(serviceRequest.timestamp) }}</span>
        </div>
      </div>
      <hr class="my-2" />
      <span class="title">{{ serviceRequest.title }}</span
      ><br />
      <span class="date">{{ serviceRequest.location }}</span>
      <span class="description">{{ serviceRequest.description }}</span>
    </div>
  </div>
</template>

<style scoped>
.standard-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  aspect-ratio: 1 / 1;
}

.img-container {
  position: relative;
}

.category-badge {
  position: absolute;
  bottom: 1px;
  right: 5px;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profilePic {
  border: 1px solid rgb(177, 177, 177);
}

.card {
  margin-bottom: 16px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.2);
}

.card-body {
  padding: 16px;
}

.userInfo {
  display: flex;
  align-items: center;
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.date {
  font-size: 14px;
  color: rgb(105, 105, 105);
}

.description {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>