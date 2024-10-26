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
</script>

<template>
  <div
    class="card"
    @click="navigateToDetailedRequest(serviceRequest.id)"
    @mousedown="handleMouseDown($event, serviceRequest.id)"
  >
    <div class="userInfo">
      <img
        :src="serviceRequest.profilePicture"
        class="rounded-circle me-2"
        alt="Profile Picture"
        width="40"
        height="40"
      />
      <div class="text-container">
        <span class="name">{{ serviceRequest.name }}</span>
        <span class="location">{{ serviceRequest.location }}</span>
      </div>
    </div>
    <div class="img-container">
      <img :src="serviceRequest.imgSrc" class="card-img-top standard-img" alt="Request Image" />
      <span class="badge rounded-pill text-bg-secondary mb-2 bottom-right">{{
        serviceRequest.category
      }}</span>
    </div>
    <div class="card-body">
      <h6 class="truncate">{{ serviceRequest.title }}</h6>
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

.bottom-right {
  position: absolute;
  bottom: 1px;
  right: 5px;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card {
  padding: 8px;
  margin-bottom: 16px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.2);
}

.card-body {
  margin-top: 8px;
  padding: 0 8px;
}

.userInfo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
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