<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import RequestService from '../../services/RequestService'
import { serverTimestamp } from 'firebase/firestore'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const router = useRouter()
const authStore = useAuthStore()
const title = ref('')
const description = ref('')
const location = ref('')
const category = ref('')
const image = ref(null)
const userData = computed(() => authStore.user)

const rules = {
  title: { required },
  description: { required },
  location: { required },
  category: { required },
  image: { required }
}
const v$ = useVuelidate(rules, { title, description, location, category, image })

function handleFileChange(event) {
  image.value = event.target.files[0]
}

async function createRequest() {
  await v$.value.$touch()
  if (v$.value.$invalid) {
    console.log(v$.value.title)
    return
  }

  const fields = {
    title: title.value,
    description: description.value,
    location: location.value,
    category: category.value,
    status: 'Open',
    userId: userData.value.uid,
    timestamp: serverTimestamp()
  }

  const result = await RequestService.createServiceRequest(fields, image.value)

  if (result.success) {
    router.push('/request/' + result.id)
  }
}
</script>

<template>
  <div class="container">
    <h3 class="header">Service Request Form</h3>
    <p class="secondary">We just need a few details about your request</p>
    <div class="formgroup">
      <label for="title" class="form-label" :class="{ 'is-invalid': v$.title.$error }">
        Give your required service request a title
      </label>
      <input
        type="text"
        id="title"
        class="form-control"
        placeholder="Looking for air-con service man"
        aria-label="title"
        v-model="title"
        :class="{ 'is-invalid': v$.title.$error }"
      />
      <div v-if="v$.title.$error" class="invalid-feedback">
        <span>Title is required.</span>
      </div>
    </div>
    <div class="formgroup">
      <label for="description" class="form-label" :class="{ 'is-invalid': v$.description.$error }"
        >What do you need help with?</label
      >
      <textarea
        class="form-control"
        id="description"
        rows="5"
        aria-label="description"
        placeholder="I need..."
        v-model="description"
        :class="{ 'is-invalid': v$.description.$error }"
      ></textarea>
      <div v-if="v$.description.$error" class="invalid-feedback">
        <span>Description is required.</span>
      </div>
    </div>

    <div class="formgroup">
      <label for="location" class="form-label" :class="{ 'is-invalid': v$.location.$error }"
        >Provide your general location</label
      >
      <input
        type="text"
        id="location"
        class="form-control"
        placeholder="Ang Mo Kio"
        aria-label="location"
        v-model="location"
        :class="{ 'is-invalid': v$.location.$error }"
      />
      <div v-if="v$.location.$error" class="invalid-feedback">
        <span>Location is required.</span>
      </div>
    </div>
    <div class="formgroup">
      <label for="category" class="form-label" :class="{ 'is-invalid': v$.category.$error }"
        >Which category fits your required service?</label
      >
      <select
        class="form-select"
        id="category"
        aria-label="category"
        v-model="category"
        :class="{ 'is-invalid': v$.category.$error }"
      >
        <option disabled selected hidden>Select Category</option>
        <option value="Installation">Installation</option>
        <option value="Repair">Repair</option>
      </select>
      <div v-if="v$.category.$error" class="invalid-feedback">
        <span>Location is required.</span>
      </div>
    </div>
    <div class="formgroup">
      <label for="image" class="form-label" :class="{ 'is-invalid': v$.image.$error }">Attach a image of your issue</label>
      <input
        class="form-control"
        type="file"
        id="image"
        accept="image/*"
        :class="{ 'is-invalid': v$.image.$error }"
        @change="handleFileChange"
      />
      <div v-if="v$.image.$error" class="invalid-feedback">
        <span>Image is required.</span>
      </div>
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
  font-weight: 500;
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

.is-invalid {
  border-color: red;
  color: red;
}

.invalid-feedback {
  color: red;
  font-size: 0.875rem;
}
</style>