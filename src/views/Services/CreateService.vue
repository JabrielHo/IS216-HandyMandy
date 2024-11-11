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
const currentStep = ref(0)
const serviceDetails = ref({})
const isLoading = ref(false)
const userData = computed(() => authStore.user)

const baseRules = {
  location: { required },
  selectedServices: { required, minLength: minLength(1) }
}

// Service details validation rules
const serviceDetailsRules = computed(() => {
  const rules = {}
  selectedServices.value.forEach((service) => {
    rules[service] = {
      yearsExperience: { required },
      description: { required }
    }
  })
  return rules
})

const v$ = useVuelidate(baseRules, { location, selectedServices })
const v$ServiceDetails = useVuelidate(serviceDetailsRules, serviceDetails)
const serviceError = ref(false);

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

// Initialize service details when services are selected
function initializeServiceDetails() {
  selectedServices.value.forEach((service) => {
    if (!serviceDetails.value[service]) {
      serviceDetails.value[service] = {
        yearsExperience: 0,
        description: ''
      }
    }
  })
}

// Navigation functions
function nextStep() {
  v$.value.$touch()
  if (v$.value.$invalid) return

  if (currentStep.value === 0) {
    if (selectedServices.value.length === 0) {
      serviceError.value = true
      return
    } else {
      serviceError.value = false
      initializeServiceDetails()
    }
  }
  else {
    // Validate the current service details before moving to the next step
    const currentService = getCurrentService()
    v$ServiceDetails.value[currentService].$touch()
    if (v$ServiceDetails.value[currentService].$invalid) return
  }
  currentStep.value++
}

function prevStep() {
  currentStep.value--
}

function getCurrentService() {
  return selectedServices.value[currentStep.value - 1]
}

// Form submission
async function createService() {
  isLoading.value = true
  v$.value.$touch()

  if (v$.value.$invalid) {
    isLoading.value = false
    return
  }
  
  for (const service of selectedServices.value) {
    const detailsValidation = v$ServiceDetails.value[service]
    detailsValidation.$touch() // Mark fields as touched
    if (detailsValidation.$invalid) {
      alert(`Please complete all fields for the "${service}" service.`)
      isLoading.value = false
      return
    }
  }

  try {
    const serviceTypes = selectedServices.value
    const userId = userData.value.uid
    const userLocation = location.value.trim()

    // Construct the data object
    const requestData = {
      userId,
      location: userLocation,
      service_type: serviceTypes
    }

    const result = await Services.createService(requestData)

    if (result.success) {
      const serviceId = result.id
      for (const service of serviceTypes) {
        const details = serviceDetails.value[service]

        const detailedRequest = {
          description: details.description,
          serviceId: serviceId,
          service_type: service,
          userId: userId,
          yearsExperience: details.yearsExperience
        }

        const detailedResult = await Services.createDetailedServices(detailedRequest)

        if (detailedResult.success) {
          console.log(`Detailed service created with ID: ${detailedResult.id}`)
        } else {
          console.error('Error creating detailed service:', detailedResult.error)
        }
      }
    }
    console.log(result)
    router.push('/services')
  } catch (error) {
    console.error('Error creating service:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <!-- Progress bar -->
    <div class="progress-bar">
      <div
        class="progress-step"
        v-for="(step, index) in selectedServices.length + 1"
        :key="index"
        :class="{ active: currentStep >= index }"
      >
        {{ index === 0 ? 'Basic Info' : selectedServices[index - 1] }}
      </div>
    </div>


    <div v-if="currentStep === 0" class="form-step">
      <h4>Basic Information</h4>
      <p class="text-secondary">Let's start with your location and services</p>

      <div class="form-group">
        <label for="location" :class="{ 'is-invalid': v$.location.$error }"> Your Location </label>
        <input
          type="text"
          id="location"
          class="form-control"
          placeholder="Enter your location"
          v-model="location"
          :class="{ 'is-invalid': v$.location.$error }"
        />
        <div v-if="v$.location.$error" class="invalid-feedback">Location is required.</div>
      </div>

      <div class="form-group">
        <label :class="{ 'is-invalid': v$.selectedServices.$error }"> Select Services </label>
        <div class="services-grid">
          <div
            v-for="service in serviceOptions"
            :key="service"
            class="service-option"
            :class="{ selected: selectedServices.includes(service) }"
            @click="
              selectedServices.includes(service)
                ? (selectedServices = selectedServices.filter((s) => s !== service))
                : selectedServices.push(service)
            "
          >
            {{ service }}
          </div>
        </div>
        <div v-if="v$.selectedServices.$error" class="invalid-feedback">
          Please select at least one service.
        </div>
        <div v-if="serviceError" class="invalid-feedback">
          You must select at least one service to proceed.
      </div>
      </div>
    </div>

    <!-- Service Details Steps -->
    <div v-else class="form-step">
      <div class="service-details">
        <h4>{{ getCurrentService() }} Service Details</h4>
        <p class="text-secondary">Provide specific details for this service</p>

        <div class="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            class="form-control"
            v-model="serviceDetails[getCurrentService()].yearsExperience"
            placeholder="Enter years of experience"
          />
        </div>

        <div class="form-group">
          <label>Service Description</label>
          <textarea
            class="form-control"
            v-model="serviceDetails[getCurrentService()].description"
            placeholder="Describe your service offerings"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="form-navigation">
      <button v-if="currentStep > 0" class="btn btn-secondary" @click="prevStep">Previous</button>
      <button
        v-if="currentStep < selectedServices.length"
        class="btn btn-primary"
        @click="nextStep"
      >
        Next
      </button>
      <button
        v-if="currentStep === selectedServices.length"
        class="btn btn-success"
        @click="createService"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Submitting...' : 'Submit Services' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  display: flex;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-step {
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  color: #6c757d;
}

.progress-step.active {
  color: #ffad60;
  font-weight: bold;
}

.progress-step.active::after {
  background: #ffad60;
}

.form-step {
  animation: fadeIn 0.3s ease-in-out;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.service-option {
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.service-option:hover {
  border-color: #ffad60;
}

.service-option.selected {
  background: #ffad60;
  color: white;
  border-color: #ffad60;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #ffad60;
  outline: none;
}

.upload-placeholder {
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  background: #f8f9fa;
}

.upload-placeholder:hover {
  background: #e9ecef;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.hidden {
  display: none;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #ffad60;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #ffad60;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>