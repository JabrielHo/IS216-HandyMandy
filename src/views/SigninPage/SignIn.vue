<template>
  <div class="signin-container">
    <h1 class="signin-title">Sign In</h1>
    <form @submit.prevent="handleSubmit" class="signin-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit" class="signin-button">Sign In</button>
      <p class="footer-text">
        Don't have an account? <router-link to="/register">Sign Up</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async () => {
  try {
    // Authenticate user with email and password using the auth store
    await authStore.login(email.value, password.value)

    // Check if the user is authenticated
    if (authStore.user) {
      // Redirect to another page after successful sign in
      router.push({ name: 'home' }) // Change 'home' to your desired route
    } else {
      alert('Login failed. Please check your credentials.')
    }
  } catch (error) {
    console.error('Error during sign in:', error)
    alert(error.message) // Show error message to the user
  }
}
</script>

<style scoped>
.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0; /* Light background for contrast */
}

.signin-title {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.signin-form {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px; /* Fixed width for the form */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.signin-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff; /* Bootstrap primary color */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.signin-button:hover {
  background-color: #0056b3; /* Darker shade on hover */
}

.footer-text {
  margin-top: 15px;
  text-align: center;
}

.footer-text a {
  color: #007bff;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}
</style>
