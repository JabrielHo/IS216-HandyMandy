<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Services from '../Services/users'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const router = useRouter()
const authStore = useAuthStore()
const location = ref('')
const selectedServices = ref([])
const yearsExperience = ref(0)
const userData = computed(() => authStore.user)

const rules = {
  location: { required },
  selectedServices: { required, minLength: minLength(1) },
  yearsExperience: { required }
}
const v$ = useVuelidate(rules, { location, selectedServices, yearsExperience })

const serviceOptions = [
  'Plumbing',
  'Electrical',
  'Air-Con',
  'Cleaning',
  'Gardening',
  'Painting',
  'Repair',
  'Installation'
]

async function createRequest() {
  await v$.value.$touch()
  if (v$.value.$invalid) {
    console.log('Validation failed', v$.value)
    return
  }

  const fields = {
    location: location.value.trim(),
    service_type: selectedServices.value,
    yearsExperience: yearsExperience.value,
    userId: userData.value.uid,
  }

  const result = await Services.createService(fields)

  if (result.success) {
    router.push('/services')
  }
}
</script>

<template>
  <div class="container">
    <h4>Service Request Form</h4>
    <p class="secondary">Provide details about your service</p>
    
    <div class="formgroup">
      <label for="location" class="form-label" :class="{ 'is-invalid': v$.location.$error }">
        Your Location
      </label>
      <input
        type="text"
        id="location"
        class="form-control"
        placeholder="Enter your location"
        v-model="location"
        :class="{ 'is-invalid': v$.location.$error }"
      />
      <div v-if="v$.location.$error" class="invalid-feedback">
        Location is required.
      </div>
    </div>

    <div class="formgroup">
      <label class="form-label" :class="{ 'is-invalid': v$.selectedServices.$error }">
        Service Types
      </label>
      <div>
        <div v-for="service in serviceOptions" :key="service" class="form-check">
          <input
            type="checkbox"
            :id="service"
            :value="service"
            v-model="selectedServices"
            class="form-check-input"
          />
          <label :for="service" class="form-check-label">{{ service }}</label>
        </div>
      </div>
      <div v-if="v$.selectedServices.$error" class="invalid-feedback">
        At least one service type is required.
      </div>
    </div>

    <div class="formgroup">
      <label for="yearsExperience" class="form-label" :class="{ 'is-invalid': v$.yearsExperience.$error }">
        Years of Experience
      </label>
      <input
        type="number"
        id="yearsExperience"
        class="form-control"
        placeholder="Enter your years of experience"
        v-model="yearsExperience"
        :class="{ 'is-invalid': v$.yearsExperience.$error }"
      />
      <div v-if="v$.yearsExperience.$error" class="invalid-feedback">
        Years of experience is required.
      </div>
    </div>

    <div class="submit-button">
      <button class="btn btn-dark" @click="createRequest()">Submit Service</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;
  background-color: #f8f8f8;
}

.formgroup {
  margin-bottom: 16px;
}

.form-label {
  font-weight: bold;
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  color: red;
}
</style>
