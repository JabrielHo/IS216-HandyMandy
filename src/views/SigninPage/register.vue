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

const handleFacebookSignIn = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);   

    const user = result.user;

    // Check if user is new
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

    router.push('/welcome');
  } catch (error) {
    console.error('Error during Facebook sign-in:', error);
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
        <div class="icon-image-container">
          <img src="./googleIcon.png" alt="Profile" class="icon-image" @click="handleGoogleSignIn">
          <img src="./facebookIcon.png" alt="Profile" class="icon-image" style="width: 65px;" @click="handleFacebookSignIn">
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </div>
      <p class="mt-3">Already have an account? <router-link to="/signin">Sign In</router-link></p>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  /* Set a maximum width for the registration form */
}

.icon-image {
  width: 70px;
  margin: 0px 5px;
}

.icon-image-container {
  margin: 10px;
  justify-items: center;
}

.icon-image-container img:hover {
  opacity: 0.7; /* Slightly reduce opacity on hover */
  cursor: pointer; /* Change cursor to pointer to indicate interactivity */
  transform: scale(1.1); /* Slightly increase size on hover */
  transition: all 0.2s ease; /* Add a smooth transition effect */
}
</style>
