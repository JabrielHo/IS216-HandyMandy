<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from '../../firebaseConfig'; // Ensure this path is correct

const router = useRouter();

const posts = ref([]); // Start with an empty array for posts

async function addPost(newPost) {
  try {
    await setDoc(doc(db, "posts", newPost.id.toString()), newPost);
    posts.value.push(newPost); // Add to local posts array
  } catch (error) {
    console.error("Error adding post:", error);
  }
}

onMounted(async () => {
  await fetchPosts();
});

async function fetchPosts() {
  const postsCollection = collection(db, "posts");
  try {
    const querySnapshot = await getDocs(postsCollection);
    posts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function goToAddPost() {
  router.push('/addpost'); // Adjust the route as per your route configuration
}

function goToPostDetail(postId) {
  router.push({ name: 'individualPostView', params: { postId } });
}


function likePost(postId) {
  const postIndex = posts.value.findIndex((post) => post.id === postId.toString());
  
  if (postIndex !== -1) {
    const post = posts.value[postIndex];
    
    // Toggle liked state and adjust likes count
    const updatedPost = {
      ...post,
      liked: !post.liked,
      likes: post.likes + (post.liked ? -1 : 1)
    };
    
    // Update the post in the array to trigger reactivity
    posts.value.splice(postIndex, 1, updatedPost);
  }
}

</script>

<template>
  <main class="backdrop">
    <button class="add-post-button" @click="goToAddPost">Add Post</button>
    <div class="card-container">
      <div class="card" v-for="post in posts" :key="post.id" @click="goToPostDetail(post.id)">
        <div class="card-header">
          <img :src="post.userImage" alt="User profile" class="user-image" />
          <div class="user-info">
            <h3>{{ post.username }}</h3>
            <p>{{ post.location }} | {{ post.time }}</p>
          </div>
        </div>
        <div class="card-body">
          <h2>{{ post.title }}</h2>
          <p>{{ post.content }}</p>
        </div>
        <div class="card-footer">
          <span @click.stop="likePost(post.id)">
            <i class="fas fa-thumbs-up" :class="{ liked: post.liked }"></i> {{ post.likes }}
          </span>
          <span><i class="fas fa-thumbs-down"></i> {{ post.dislikes }}</span>
          <span><i class="fas fa-comment"></i> {{ post.comments }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Add the background image */
.backdrop {
  margin: auto;
  background-image: url('WAD drawing-2 2.jpg'); /* Path to your image */
  background-size: cover; /* Cover the entire area */
  background-position: top; /* Start from the top */
  background-repeat: no-repeat; /* Prevent the image from repeating */
  width: 100vw; /* Cover the full width of the viewport */
  min-height: 100vh; /* Ensure the background takes the full viewport height */
  display: flex; /* Allows better layout positioning if needed */
  flex-direction: column; /* Adjust to your needs */
  justify-content: center; /* Centers content vertically */
  align-items: center; /* Centers content horizontally */
  overflow: hidden; /* Prevents overflow in case of content */
}

.card-container {
  display: flex; /* Enable flexbox */
  flex-wrap: wrap; /* Allow wrapping of cards */
  justify-content: center; /* Center the cards in the container */
  gap: 20px; /* Space between cards */
  width: 800px;
  padding: 20px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: calc(50% - 20px); /* Set the width to 50% minus the gap */
  max-width: 600px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-info h3 {
  margin: 0;
  font-size: 18px;
}

.user-info p {
  font-size: 14px;
  color: gray;
  margin: 0;
}

.card-body h2 {
  font-size: 22px;
  margin: 10px 0;
}

.card-body p {
  color: #333;
}

.card-footer {
  display: flex;
  justify-content: flex-start;
  font-size: 16px;
  color: gray;
  background-color: white;
  border: none;
}

.card-footer span {
  display: flex;
  align-items: center;
  padding: 0px 5px;
}

.card-footer i {
  margin-right: 5px;
}

.add-post-button {
  position: absolute;
  top: 80px; /* Adjust as per the navbar height */
  right: 20px;
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff; /* Initial color */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Smooth transition for hover */
}

.add-post-button:hover {
  background-color: #0056b3; /* Change color on hover */
}

.card {
  transition: transform 0.2s ease; /* Add a transition for smooth effect */
}

.card:hover {
  transform: scale(1.05); /* Scale up the card on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.liked {
  color: blue; /* Change the color of the icon when liked */
}
</style>
