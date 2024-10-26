<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebaseConfig'; // Import Firestore
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider  } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore methods

const router = useRouter();

// Form data
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

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
      username: name.value, // Using 'name' as the username here
      userId: userCredential.user.uid,
      email: email.value,
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
    const
      user = result.user;


    // Check if the user is new (first time signing in)
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Store user details in Firestore for new users
      await setDoc(userDocRef, {
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userId: user.uid,
        email: user.email,
      });
    }

    // Redirect after successful login
    router.push('/welcome');
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    alert(error.message);
  }
};

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
        <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required />
      </div>
      <br>

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
        <button type="submit" class="btn btn-primary mt-3">Register</button>
        <p class="mt-3">Already have an account? <router-link to="/signin">Sign In</router-link></p>
      </div>
      
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  /* Set a maximum width for the registration form */
}
.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white; /* Change background to white */
  color: #4285f4; /* Change text color to Google blue */
  border: 2px solid #4285f4; /* Add a border for visibility */
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin: 0 auto; /* Center the button horizontally */
  width: 100%; /* Optional: make button full width */
  max-width: 300px; /* Optional: set a max width for the button */
}

.google-button:hover {
  background-color: #f1f1f1; /* Light gray background on hover */
  transform: translateY(-2px); /* Slight lift effect */
}

.icon-image{
  width: 30px;
}
</style>
