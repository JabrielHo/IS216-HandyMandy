<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import the router
import { db, auth } from '../../firebaseConfig'; // Ensure you have your Firebase configuration set up
import { addDoc, collection, doc, getDoc } from 'firebase/firestore'; // Import addDoc and collection
import { onAuthStateChanged } from 'firebase/auth'; // Import for authentication state

const emit = defineEmits();

const title = ref('');
const description = ref('');
const category = ref('');
const router = useRouter(); // Use the router instance
const currentUser = ref(null); // Create a ref to hold the current user

// Get the current authenticated user
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, set currentUser
      currentUser.value = user;
    } else {
      // User is signed out
      currentUser.value = null;
    }
  });
});

async function submitPost() {
  if (!title.value || !description.value || !category.value) {
    alert('Please fill in all fields.');
    return;
  }

  if (!currentUser.value) {
    alert('You must be logged in to submit a post.');
    return;
  }

  try {
    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", currentUser.value.uid));
    
    if (!userDoc.exists()) {
      console.error("User not found in Firestore");
      alert('User data not found. Please try again.');
      return;
    }

    const userData = userDoc.data();
    
    const newPost = {
      username: userData.username || 'Anonymous', // Use display name or fallback
      userId: currentUser.value.uid,
      location: 'UserLocation', // Replace with actual location if available
      time: new Date().toLocaleString(), // Use a dynamic timestamp
      userImage: userData.profilePicture || 'path_to_image', // Use user's photoURL or fallback
      title: title.value,
      content: description.value,
      likes: 0,
      dislikes: 0,
      comments: 0,
      liked: false,
      category: category.value,
    };

    // Add the new post to Firestore
    const docRef = await addDoc(collection(db, "posts"), newPost);
    
    newPost.id = docRef.id; // Assign the generated ID to newPost (if needed)

    emit('add-post', newPost);

    // Reset the form fields
    title.value = '';
    description.value = '';
    category.value = '';

    // Navigate to the forum page after submitting
    router.push({ name: 'forumpage' });
  } catch (error) {
    console.error("Error adding post:", error);
    alert('Failed to submit the post. Please try again.');
  }
}
</script>

<template>
  <div class="container">
    <h3 class="header">What do you want to post?</h3>
    <div class="formgroup">
      <label for="title" class="form-label">Title of the post</label>
      <input
        type="text"
        id="title"
        class="form-control"
        placeholder="How to do WAD 2 project?"
        aria-label="title"
        v-model="title"
      />
    </div>
    <div class="formgroup">
      <label for="description" class="form-label">Details</label>
      <textarea
        class="form-control"
        id="description"
        rows="5"
        aria-label="description"
        placeholder="I need..."
        v-model="description"
      ></textarea>
    </div>
    <div class="formgroup">
      <label for="category" class="form-label">Which category is the post about?</label>
      <select class="form-select" id="category" aria-label="category" v-model="category">
        <option disabled selected hidden>Select Category</option>
        <option value="Installation">Installation</option>
        <option value="Repair">Repair</option>
      </select>
    </div>
    <div class="submit-button">
      <button class="btn btn-dark" @click="submitPost">Create Post</button>
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

label {
  font-weight: bold;
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
</style>
