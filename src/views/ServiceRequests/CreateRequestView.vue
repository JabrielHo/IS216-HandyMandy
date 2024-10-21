<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import RequestService from '../../services/RequestService'
import { auth } from '../../firebaseConfig'
import { serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const title = ref('')
const description = ref('')
const location = ref('')
const category = ref('')
const image = ref(null)

function handleFileChange(event) {
  image.value = event.target.files[0]
}

async function createRequest() {
  const user = auth.currentUser

  const fields = {
    title: title.value,
    description: description.value,
    location: location.value,
    category: category.value,
    status: 'Open',
    userId: user.uid,
    timestamp: serverTimestamp()
  }

  const result = await RequestService.createServiceRequest(fields, image.value)

  if (result.success) {
    router.push('/request/' + result.id)
  } else {
    alert(`Failed to create request: ${result.error}`)
  }
}
</script>

<template>
  <div class="container">
    <h3 class="header">Service Request Form</h3>
    <p class="secondary">We just need a few details about your request</p>
    <div class="formgroup">
      <label for="title" class="form-label">Give your required service request a title</label>
      <input
        type="text"
        id="title"
        class="form-control"
        placeholder="Looking for air-con service man"
        aria-label="title"
        v-model="title"
      />
    </div>
    <div class="formgroup">
      <label for="description" class="form-label">What do you need help with?</label>
      <textarea
        class="form-control"
        id="description"
        rows="5"
        aria-label="description"
        placeholder="I need..."
        v-model="description"
      ></textarea>
    </div>
    <div class="formgroup">
      <label for="location" class="form-label">Provide your general location</label>
      <input
        type="text"
        id="location"
        class="form-control"
        placeholder="Ang Mo Kio"
        aria-label="location"
        v-model="location"
      />
    </div>
    <div class="formgroup">
      <label for="category" class="form-label">Which category fits your required service?</label>
      <select class="form-select" id="category" aria-label="category" v-model="category">
        <option disabled selected hidden>Select Category</option>
        <option value="Installation">Installation</option>
        <option value="Repair">Repair</option>
      </select>
    </div>
    <div class="formgroup">
      <label for="image" class="form-label">Attach images of your issue</label>
      <input
        class="form-control"
        type="file"
        id="image"
        accept="image/*"
        @change="handleFileChange"
      />
    </div>
    <div class="submit-button">
      <button class="btn btn-dark" @click="createRequest()">Submit Request</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  padding: 24px;
  background-color: rgb(248, 248, 248);
}

.header {
  font-weight: 700;
  letter-spacing: -0.025em;
  font-size: 1.5rem;
  line-height: 2rem;
}

.secondary {
  color: rgb(148 163 184);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
}

label {
  font-weight: bold;
}

.form-control:focus {
  border-color: black;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}

.formgroup {
  margin-bottom: 8px;
}

.submit-button {
  margin-top: 16px;
  text-align: right;
}
</style>