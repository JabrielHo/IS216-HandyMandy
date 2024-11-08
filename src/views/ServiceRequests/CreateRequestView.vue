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
const categories = ref([
  'Plumbing',
  'Electrical',
  'Air-con',
  'Cleaning',
  'Gardening',
  'Painting',
  'Repair',
  'Installation',
  'Miscellaneous'
])
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
    title: title.value.trim(),
    description: description.value.trim(),
    location: location.value.trim(),
    category: category.value.trim(),
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
  <section class="background">
    <div class="container con-background">
      <h4>Service Request Form</h4>
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
          <template v-for="categori in categories" :key="categori">
            <option :value="categori">{{ categori }}</option>
          </template>
        </select>
        <div v-if="v$.category.$error" class="invalid-feedback">
          <span>Location is required.</span>
        </div>
      </div>
      <div class="formgroup">
        <label for="image" class="form-label" :class="{ 'is-invalid': v$.image.$error }"
          >Attach a image of your issue</label
        >
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
        <button class="btn submitBtn" @click="createRequest()">Submit Request</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.submitBtn {
  background-color: #ffad60;
  color: white;
}

.submitBtn:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.container {
  max-width: 900px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  padding: 24px;
  background-color: rgb(248, 248, 248);
}

.con-background {
  background-color: #ffeead;
}

.background {
  background-image: url(../../assets/bg1.png);
}

.secondary {
  color: rgb(148, 163, 184);
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
