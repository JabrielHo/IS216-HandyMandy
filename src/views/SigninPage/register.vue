<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Function to handle form submission
const handleSubmit = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }
  // Here you would typically send the data to your server for registration
  console.log('Registering:', {
    name: name.value,
    email: email.value,
    password: password.value
  })
  // Redirect to another page after successful registration
  router.push('/welcome') // Change '/welcome' to your desired route
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center">Register</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" class="form-control" v-model="name" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-control" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" class="form-control" v-model="password" required />
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          class="form-control"
          v-model="confirmPassword"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
      <p class="mt-3">Already have an account? <router-link to="/signin">Sign In</router-link></p>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px; /* Set a maximum width for the registration form */
}
</style>
