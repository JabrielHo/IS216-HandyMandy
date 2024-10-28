<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { setDoc, doc, collection, getDocs, getDoc, query, orderBy } from "firebase/firestore";
import { db } from '../../firebaseConfig';

const router = useRouter();
const posts = ref([]);
let observer: IntersectionObserver;
const lastScrollY = ref(0);
const isScrollingUp = ref(false);

const currentPage = ref(1);
const postsPerPage = 8;

const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage));

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return posts.value.slice(start, end);
});

async function addPost(newPost) {
  try {
    await setDoc(doc(db, "posts", newPost.id.toString()), newPost);
    posts.value.push({ ...newPost, isVisible: false });
  } catch (error) {
    console.error("Error adding post:", error);
  }
}

async function fetchPosts() {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("time", "desc"));
  try {
    const querySnapshot = await getDocs(postsQuery); // Use getDocs to retrieve all documents

    // Fetch posts and get profile picture for each user
    posts.value = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
      const postData = docSnapshot.data();
      const userId = postData.userId;
      console.log(userId);

      // Fetch user profile picture based on userId
      const userDoc = await getDoc(doc(db, "users", userId));
      const userProfilePic = userDoc.exists() ? userDoc.data().profilePicture : '';

      return {
        id: docSnapshot.id,
        ...postData,
        profilePicture: userProfilePic,
        isVisible: false,
      };
    }));

    await nextTick();
    observePosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function observePosts() {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const post = posts.value.find(p => p.id === entry.target.getAttribute("data-id"));
      if (post) {
        // Check if the post is intersecting (entering the viewport)
        if (entry.isIntersecting) {
          if (!post.isVisible) { // Only update if it was previously not visible
            post.isVisible = true;
            // Add animation class when post comes into view
            entry.target.classList.add('float-up'); // Add animation class
          }
        } else if (!entry.isIntersecting && post.isVisible) {
          post.isVisible = false; // Reset visibility state when leaving viewport
          entry.target.classList.remove('float-up'); // Remove animation class
        }
      }
    });
  }, { threshold: 0.01  }); // Adjust threshold as needed

  document.querySelectorAll(".card").forEach(post => observer.observe(post));
}



function goToAddPost() {
  router.push('/addpost');
}

function goToPostDetail(postId) {
  router.push({ name: 'individualPostView', params: { postId } });
}

function likePost(postId) {
  const postIndex = posts.value.findIndex((post) => post.id === postId.toString());
  if (postIndex !== -1) {
    const post = posts.value[postIndex];
    const updatedPost = {
      ...post,
      liked: !post.liked,
      likes: post.likes + (post.liked ? -1 : 1)
    };
    posts.value.splice(postIndex, 1, updatedPost);
  }
}

function handleScroll() {
  if (window.scrollY === 0) {
    isScrollingUp.value = false; // Reset scrolling state when at the top
  } else if (window.scrollY < lastScrollY.value) {
    isScrollingUp.value = true; // User is scrolling up
  } else {
    isScrollingUp.value = false; // User is scrolling down
  }
  lastScrollY.value = window.scrollY;
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    nextTick(() => observePosts()); // Reapply observer to newly displayed posts
  }
}

onMounted(() => {
  fetchPosts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main class="backdrop" :class="{ 'is-scrolling-up': isScrollingUp }">
    <div class="hdb-block left-block">
      <img src="./pole.png" alt="Pole" class="pole-image left-pole" />
    </div>
    <button class="add-post-button" @click="goToAddPost">Add Post</button>

    <div class="card-container">
      <div v-for="(post, index) in paginatedPosts" :key="post.id" :data-id="post.id" class="card"
     @click="goToPostDetail(post.id)"
     :class="{ 'is-visible': post.isVisible, 'rotate-left': index % 2 === 0, 'rotate-right': index % 2 !== 0 }">
  <div class="card-header">
    <img :src="post.profilePicture" alt="User profile" class="user-image" />
    <div class="user-info">
      <h3>{{ post.username }}</h3>
      <p>{{ post.location }} | {{ post.time }}</p>
    </div>
  </div>
  <div class="card-body">
    <h2>{{ post.title }}</h2>
    <p class="truncate-multiline">{{ post.content }}</p>
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

    <!-- Move the pagination here -->
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <div class="page-number">Page {{ currentPage }} of {{ totalPages }}</div>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>

    <nav class="pagination-container">
      <div class="pagination">
        <a class="pagination-newer" href="#" @click.prevent="changePage(currentPage - 1)"
          :disabled="currentPage === 1">PREV</a>
        <span class="pagination-inner">
          <a v-for="page in totalPages" :key="page" :class="{ 'pagination-active': currentPage === page }" href="#"
            @click.prevent="changePage(page)">{{ page }}</a>
        </span>
        <a class="pagination-older" href="#" @click.prevent="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages">NEXT</a>
      </div>
    </nav>


    <div class="hdb-block right-block">
      <img src="./pole.png" alt="Pole" class="pole-image right-pole" />
    </div>
  </main>
</template>





<style scoped>
/* Add the background image */
.backdrop {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: auto;
  /* background-image: url('background1.jpeg'); */
  background-color: rgb(186, 236, 244);
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  flex-direction: column;
  /* Added for vertical flexbox */
}

.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* Two columns */
  gap: 150px;
  /* Spacing between cards */
  padding: 20px;
  margin: 0 auto;
  /* Center horizontally */
  max-width: 1200px;
  /* Max width of container */
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 400px;
  display: flex;
  flex-direction: column;
  margin-top: 150px;
  opacity: 0;
  transform: translateY(50px);
}

.card.is-visible {
  opacity: 1;
  transform: translateY(0);
  
  /* Faster float up */
}

.hdb-block {
  background-color: #e0e0e0;
  width: 300px;
  /* Adjust this width if needed */
  position: absolute;
  /* Set to absolute positioning */
  top: 0;
  /* Align to the top of the backdrop */
  bottom: 0;
  /* Stretch to the bottom of the backdrop */
  z-index: 1;
  /* Keep it above other content */
  margin-top: 200px;
  height: 2632px;
  
}

.left-block {
  left: 0;
  background-image: url(hdb.jpeg);
  background-position: top right;
  animation: slideInLeft 0.5s ease-out; /* Apply the slide-in animation for the left block */
}

.right-block {
  right: 0;
  background-image: url(hdb.jpeg);
  background-position: top left;
  animation: slideInRight 0.5s ease-out; /* Apply the slide-in animation for the right block */
}


.left-pole {
  position: absolute;
  /* Absolute positioning */
  bottom: 0;
  /* Align to the bottom of the HDB block */
  left: 230px;
  /* Adjust this value to control how much the pole sticks out */
  width: 450px;
  /* Set desired width for the pole image */
  height: auto;
  /* Maintain aspect ratio */
  rotate: 40deg;
}

.right-pole {
  position: absolute;
  /* Absolute positioning */
  bottom: 0;
  /* Align to the bottom of the HDB block */
  right: 230px;
  /* Adjust this value to control how much the pole sticks out */
  width: 450px;
  /* Set desired width for the pole image */
  height: auto;
  /* Maintain aspect ratio */
  rotate: 235deg;
}


.is-scrolling-up .card-container {
  transform: translateY(-15 px);
  /* Lift posts slightly on scroll up */
}

.float-up {
  animation: floatUp 0.5s ease-out forwards; /* New animation class */
}


@keyframes floatUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.is-scrolling-up.card {
  animation: none;
  /* Disable animation if scrolling up at the top */
  transform: translateY(0);
  /* Reset to original position */
}

@keyframes scrollUp {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-10px);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%); /* Start off-screen to the left */
    opacity: 0;
  }
  to {
    transform: translateX(0); /* End in the correct position */
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%); /* Start off-screen to the right */
    opacity: 0;
  }
  to {
    transform: translateX(0); /* End in the correct position */
    opacity: 1;
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
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
  /* margin: 10px 0; */

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
  top: 80px;
  /* Adjust as per the navbar height */
  right: 20px;
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  /* Initial color */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  /* Smooth transition for hover */
}

.add-post-button:hover {
  background-color: #0056b3;
  /* Change color on hover */
}

.card {
  transition: transform 0.2s ease;
  /* Add a transition for smooth effect */
}

.card:hover {
  transform: scale(1.05);
  /* Scale up the card on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.liked {
  color: blue;
  /* Change the color of the icon when liked */
}

.truncate-multiline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  /* Adjust this number to show more or fewer lines */
  overflow: hidden;
  max-width: 100%;
  /* Adjust this as needed */
}

@import url(https://fonts.googleapis.com/css?family=Roboto:400,300);

h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
}

.pagination-container {
  margin: 100px auto;
  text-align: center;
  background-color: grey;
  border-radius: 20px;
}

.pagination {
  position: relative;
}

a {
  position: relative;
  /* Fixed: added colon */
  display: inline-block;
  /* Fixed: added colon */
  color: #2c3e50;
  /* Fixed: added colon */
  text-decoration: none;
  /* Fixed: added colon */
  font-size: 1.2rem;
  /* Fixed: added colon */
  padding: 8px 16px 10px;
  /* Fixed: added colon */

  &:before {
    z-index: -1;
    /* Fixed: added colon */
    position: absolute;
    /* Fixed: added colon */
    height: 100%;
    /* Fixed: added colon */
    width: 100%;
    /* Fixed: added colon */
    content: "";
    /* Fixed: added colon */
    top: 0;
    /* Fixed: added colon */
    left: 0;
    /* Fixed: added colon */
    background-color: #2c3e50;
    /* Fixed: added colon */
    border-radius: 24px;
    /* Fixed: added colon */
    transform: scale(0);
    /* Fixed: added colon */
    transition: all 0.2s;
    /* Fixed: added colon */
  }

  &:hover,
  .pagination-active {
    color: #fff;

    &:before {
      transform: scale(1);
      /* Fixed: added colon */
    }
  }
}


&:hover,
.pagination-active {
  color: #fff;

  &:before {
    transform: scale(1);
    /* Fixed: added colon */
  }
}

.pagination-active {
  color: #fff;

  &:before {
    transform: scale(1);
    /* Fixed: added colon */
  }
}


.pagination-newer {
  margin-right: 50px;
  /* Fixed: added colon */
}

.pagination-older {
  margin-left: 50px;
  /* Fixed: added colon */
}
</style>
