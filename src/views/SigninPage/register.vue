<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebaseConfig'; // Import Firestore
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import TheWelcome from '@/components/LandingPage/TheWelcome.vue';

const router = useRouter();

// Form data
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const category = ref<string[]>([]); // Keep only the selected categories

// Computed property to check if "None" is selected
const isNoneSelected = computed(() => category.value.includes('None'));

// Watch for changes in the category array
watch(category, (newValue, oldValue) => {
  if (newValue.includes('None') && newValue.length > 1) {
    category.value = ['None']; 
  } else if (oldValue?.includes('None') && !newValue.includes('None')) { 
    // When "None" is unchecked, clear the array to uncheck all
    category.value = [];
  } 
  // No need for an else block here, as we're only concerned with "None"
});

// Function to handle form submission
const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

    // Store user details in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username: name.value,
      userId: userCredential.user.uid,
      email: email.value,
      profilePicture: "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
      category: category.value // Adds the selected categories array
    });

    // Log registered user details (for debugging)
    console.log('Registered user:', {
      uid: userCredential.user.uid,
      name: name.value,
      email: email.value,
    });

    // Redirect to another page after successful registration
    router.push('/welcome');
  } catch (error) {
    console.log('Error during registration:', error);
    alert(error.message);
  }
};

// Function to handle Google Sign-In
const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the user is new (first time signing in)
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Store user details in Firestore for new users
      await setDoc(userDocRef, {
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userId: user.uid,
        email: user.email,
        profilePicture: "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        category: category.value // Adds the selected categories array
      });
    }

    // Redirect after successful login
    router.push('/welcome');
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    alert(error.message);
  }
};

const categories = ["Repair", "Installation", "None"];
</script>



<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-body">
        <h1 class="text-center">Register</h1>
        <p class="register-subtitle">Please enter your details to sign in.</p>
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
            <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required />
          </div>
          <div class="mb-3">
            <label>Categories:</label>
            <div v-for="cat in categories" :key="cat"> 
              <input type="checkbox" :id="cat" :value="cat" v-model="category"
                :disabled="cat !== 'None' && isNoneSelected" />
              <label :for="cat">{{ cat }}</label>
            </div>
          </div>
          <div style="text-align: center">
            <button type="submit" class="btn btn-primary mt-3 mb-3">Register</button>
          </div>

          <div style="text-align: center;">
            <hr style="display: inline-block; width: 30%; border-top: 1px solid #000; vertical-align: middle;">
            <span style="padding: 0 10px; background-color: white; color: grey;">OR</span>
            <hr style="display: inline-block; width: 30%; border-top: 1px solid #000; vertical-align: middle;">
          </div>

          <div class="text-center">
            <button class="google-button" @click="handleGoogleSignIn">
              <img src="./googleIcon.png" alt="Google Icon" class="icon-image" />
              Register with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.register-card {
  background-color: #fff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 400px;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.register-subtitle {
  text-align: center;
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #4285f4;
  border: 2px solid #4285f4;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin: 0 auto;
  width: 100%;
  max-width: 300px;
}

.google-button:hover {
  background-color: #f1f1f1;
  transform: translateY(-2px);
}

.icon-image {
  width: 30px;
}
</style>
