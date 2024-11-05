<template>
  <div class="signin-container">
    <div class="signin-card">
      <h1 class="signin-title">Welcome back</h1>
      <p class="signin-subtitle">Please enter your details to sign in.</p>

      <button class="google-button" @click="loginWithGoogle">
        <img src="./googleIcon.png" alt="Google Icon" class="icon-image" />
        Sign in with Google
      </button>

      <div class="separator">
        <span class="separator-line"></span>
        <span class="separator-text">OR</span>
        <span class="separator-line"></span>
      </div>

      <form @submit.prevent="handleSubmit" class="signin-form">
        <div class="form-group">
          <label for="email">E-Mail Address</label>
          <input type="email" v-model="email" id="email" placeholder="Enter your email..." required />
        </div>
        <div class="form-group" style="position: relative;">
          <label for="password">Password</label>
          <div class="input-container">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" required />
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="signin-button">Sign in</button>
      </form>

      <p class="signup-link">
        Don't have an account yet? <router-link to="/register">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword, fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';


const db = getFirestore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();
const auth = getAuth(); // Initialize Firebase Auth


const handleSubmit = async () => {
  if (!email.value || !password.value) {
    alert('Please fill in both email and password fields.');
    return;
  }

  try {
    // First, check the sign-in methods available for this email
    const signInMethods = await fetchSignInMethodsForEmail(auth, email.value.toLowerCase());
    
    // If the user only has Google sign-in method
    if (signInMethods.length > 0 && signInMethods.includes('google.com') && !signInMethods.includes('password')) {
      alert('This email is registered with Google Sign-In. Please use the "Sign in with Google" button.');
      return;
    }

    // If email/password sign-in is available, proceed with sign-in
    await signInWithEmailAndPassword(auth, email.value.toLowerCase(), password.value);
    if (auth.currentUser) {
      router.push({ name: 'home' });
    }
  } catch (error) {
    console.error('Error during direct sign in:', error);

    if (error.code === 'auth/user-not-found') {
      alert('No account found with this email. Please create an account first.');
      router.push({ name: 'register' });
    } else if (error.code === 'auth/invalid-credential') {
      alert('Wrong Password. Please try again.');
    } else {
      alert('An error occurred. Please try again.');
    }
  }
};



const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid); // Reference to the user document
    const userDoc = await getDoc(userDocRef); // Get the user document

    if (!userDoc.exists()) {
      // Store user details in Firestore for new users
      await setDoc(userDocRef, {
        username: user.displayName || user.email.split('@')[0] || 'Anonymous',
        userId: user.uid,
        email: user.email,
      });
    }

    // Proceed to the home page
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Error during Google sign in:', error);
    alert(error.message);
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>


<style scoped>
.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.signin-card {
  background-color: #fff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 400px;
  text-align: center;
  /* Center text within the card */
}

.signin-title {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  color: #343a40;
  /* Darker title color */
}

.signin-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.signin-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  transition: border-color 0.2s ease;
  /* Add smooth transition */
}

input:focus {
  outline: none;
  border-color: #80bdff;
  /* Highlight border on focus */
}

.form-actions {
  display: flex;
  justify-content: center;
  /* Center the button horizontally */
  align-items: center;
  margin-bottom: 1.5rem;
}

.signin-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  /* Add smooth transition */
}

.signin-button:hover {
  background-color: #0056b3;
}

.signup-link {
  font-size: 0.9rem;
  color: #6c757d;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  /* Adjust size as needed */
  height: auto;
}

.separator {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.separator-line {
  flex-grow: 1;
  height: 1px;
  background-color: #ddd;
}

.separator-text {
  margin: 0 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.input-container {
  display: flex;
  align-items: center; /* Vertically center content */
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  /* Adjusts the vertical position */
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}


.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}


.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  /* Change background to white */
  color: #4285f4;
  /* Change text color to Google blue */
  border: 2px solid #4285f4;
  /* Add a border for visibility */
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin: 0 auto;
  /* Center the button horizontally */
  width: 100%;
  /* Optional: make button full width */
  max-width: 300px;
  /* Optional: set a max width for the button */
}

.google-button:hover {
  background-color: #f1f1f1;
  /* Light gray background on hover */
  transform: translateY(-2px);
  /* Slight lift effect */
}

.icon-image {
  width: 30px;
}
</style>
