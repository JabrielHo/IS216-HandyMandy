<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { setDoc, doc, collection, getDocs, getDoc, query, orderBy, addDoc, where, updateDoc, arrayRemove, arrayUnion, onSnapshot, Timestamp, limit } from "firebase/firestore";
import { db, app } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const currentUser = ref(null); // Initialize as null or empty object
const emit = defineEmits(); // Ensure this is called in setup
const router = useRouter();
const posts = ref([]);
let observer;
const lastScrollY = ref(0);
const isScrollingUp = ref(false);

// Pagination related refs
const currentPage = ref(1);
const postsPerPage = 10;

// Add expandedPostId to track expanded posts
const expandedPostId = ref(null);
const title = ref('');
const description = ref('');
const categories = ref(['Repair', 'Maintenance', 'Installation']); // Example categories
const selectedCategory = ref('');
const selectedFilterCategory = ref('');
const loading = ref(false);
const topDiscussion = ref(null);


// Compute total pages based on filtered posts
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage);
});

// Compute paginated posts
const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return filteredPosts.value.slice(startIndex, endIndex);
});

// Navigation methods
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo(0, 0); // Scroll to top when changing page
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo(0, 0); // Scroll to top when changing page
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo(0, 0); // Scroll to top when changing page
  }
}

// Generate array of page numbers for pagination
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});



async function submitPost() {
  // Validate input fields
  if (!title.value || !description.value || !selectedCategory.value) {
    alert('Please fill in all fields.');
    return;
  }

  if (!currentUser.value) {
    alert('You must be logged in to submit a post.');
    return;
  }

  try {
    console.log("Fetching user data from Firestore...");
    const userDoc = await getDoc(doc(db, "users", currentUser.value.uid));
    if (!userDoc.exists()) {
      console.error("User not found in Firestore");
      alert('User data not found. Please try again.');
      return;
    }

    const userData = userDoc.data();
    console.log("User data fetched:", userData);

    const newPost = {
      username: userData.username || 'Anonymous',
      userId: currentUser.value.uid,
      location: 'UserLocation', // Replace with actual location if available
      time: Timestamp.now(),
      userImage: userData.profilePicture || 'path_to_image',
      title: title.value,
      content: description.value,
      comments: 0,
      likes: 0,
      category: selectedCategory.value, // Use selectedCategory value here
      likedBy: [],
    };

    console.log("Creating new post:", newPost);
    const docRef = await addDoc(collection(db, "posts"), newPost);
    newPost.id = docRef.id;
    console.log("Post added to Firestore with ID:", newPost.id);

    emit('add-post', newPost); // Now emit should work

    title.value = '';
    description.value = '';
    selectedCategory.value = '';


    await fetchPosts();
  } catch (error) {
    console.error("Error adding post:", error);
    alert('Failed to submit the post. Please try again.');
  }
}



async function fetchPosts() {
  loading.value = true; // Start loading
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("time", "desc"));
  try {
    const querySnapshot = await getDocs(postsQuery);
    const postPromises = querySnapshot.docs.map(async docSnapshot => {
      const postData = docSnapshot.data();
      const userId = postData.userId;

      const userDoc = await getDoc(doc(db, "users", userId));
      const userProfilePic = userDoc.exists() ? userDoc.data().profilePicture : '';

      // Check if the current user has liked the post
      const isLiked = currentUser.value && postData.likedBy && postData.likedBy.includes(currentUser.value.uid);

      return {
        id: docSnapshot.id,
        ...postData,
        profilePicture: userProfilePic,
        isVisible: false,
        isLiked: isLiked, // Add isLiked property to each post object
      };
    });

    const postsWithProfiles = await Promise.all(postPromises);

    // Fetch comment counts in parallel after posts have been fetched
    const commentCountPromises = postsWithProfiles.map(async post => {
      const commentCount = await fetchCommentCount(post.id);
      return { ...post, comments: commentCount };
    });

    posts.value = await Promise.all(commentCountPromises);

    posts.value.forEach(post => {
      console.log(`Post ID: ${post.id}, Comment Count: ${post.comments}`);
    });

    await nextTick();
    observePosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    loading.value = false; // End loading
  }
}

async function fetchTopDiscussion() {
  try {
    // Query for the post with the most likes
    const postsQuery = query(collection(db, "posts"), orderBy("likes", "desc"), limit(1));
    const querySnapshot = await getDocs(postsQuery);

    if (!querySnapshot.empty) {
      const topPostDoc = querySnapshot.docs[0];
      const topPostData = topPostDoc.data();

      // Fetch the user's profile picture
      const userDoc = await getDoc(doc(db, "users", topPostData.userId));
      const userProfilePic = userDoc.exists() ? userDoc.data().profilePicture : '';

      topDiscussion.value = {
        id: topPostDoc.id,
        title: topPostData.title,
        profilePicture: userProfilePic,
      };
    }
  } catch (error) {
    console.error("Error fetching top discussion:", error);
  }
}


function truncate(text, wordLimit) {
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
}

async function fetchCommentCount(postId) {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postID', '==', postId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size; // Return the count of comments
  } catch (error) {
    console.error('Error fetching comment count:', error);
    return 0; // Return 0 if there's an error
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
  }, { threshold: 0.01 }); // Adjust threshold as needed

  document.querySelectorAll(".card").forEach(post => observer.observe(post));
}


function goToPostDetail(postId) {
  router.push({ name: 'individualPostView', params: { postId } });
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

function toggleExpand(postId) {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null;
  } else {
    expandedPostId.value = postId;
  }
}
//////////////////////////////////////////////////////////
async function likePost(postId: string) {
  if (!currentUser.value) {
    alert('You must be logged in to like a post.');
    return;
  }

  const postIndex = posts.value.findIndex(p => p.id === postId);
  if (postIndex > -1) {
    posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked;
    posts.value[postIndex].likes += posts.value[postIndex].isLiked ? 1 : -1;
  }

  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const
        likedBy = postData.likedBy || [];
      const userId = currentUser.value.uid;

      if (likedBy.includes(userId)) {
        // User has already liked, so unlike the post
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likes: postData.likes - 1,
        });
      } else {
        // User hasn't liked, so like the post
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
          likes: postData.likes + 1,
        });
      }

      // No need to update posts array here since it was updated optimistically
    } else {
      console.error("Post not found in Firestore");
      alert('Post not found. Please try again.');

      // Revert the optimistic update if the post is not found
      if (postIndex > -1) {
        posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked;
        posts.value[postIndex].likes += posts.value[postIndex].isLiked ? 1 : -1;
      }
    }
    // await fetchPosts();
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    alert('Failed to like/unlike the post. Please try again.');

    // Revert the optimistic update if there's an error
    if (postIndex > -1) {
      posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked;
      posts.value[postIndex].likes += posts.value[postIndex].isLiked ? 1 : -1;
    }
  }
}

function toggleFilter(category) {
  if (selectedFilterCategory.value === category) {
    selectedFilterCategory.value = ''; // Reset to default
  } else {
    selectedFilterCategory.value = category; // Set the new category
  }
}

const filteredPosts = computed(() => {
  if (!selectedFilterCategory.value) {
    return posts.value; // Show all posts if no category is selected
  }
  return posts.value.filter(post => post.category === selectedFilterCategory.value); // Filter posts by category
});


onMounted(() => {
  fetchPosts();
  fetchTopDiscussion();
  window.addEventListener('scroll', handleScroll);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in, set currentUser to user's info
      currentUser.value = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
      };
    } else {
      // User is logged out
      currentUser.value = null;
    }
  });
});


</script>

<template>
  <!-- Header Section -->
  <main class="backdrop">
    <div class="topcontainer">
      <h1>HandyMandy Discussion Forum</h1>
    </div>
    <div class="mainwrapper">
      <div class="row">
        <div class="col-lg-8">
          <div class="container">
            <div class="p-4 bg-light rounded mb-3">
              <h5 class="text-center">Community</h5>
              <div class="mb-3">
                <input type="text" v-model="title" class="form-control post-input title-input" placeholder="Add a title">
              </div>
              <div class="mb-3">
                <textarea v-model="description" class="form-control post-input content-input"
                  placeholder="What's on your mind? 🤔"></textarea>
              </div>

              <div class="btn-group d-flex flex-wrap mb-3" role="group">
                <button v-for="(category, index) in categories" :key="index" type="button"
                  class="btn btn-outline-primary rounded-pill flex-grow-1 mb-2 mx-1"
                  :class="{ active: selectedCategory === category }" @click="selectedCategory = category">
                  {{ category }}
                </button>
              </div>

              <!-- Make Add Post button responsive and centered -->
              <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary addpost w-100 w-md-auto" @click="submitPost()">
                  Add Post
                </button>
              </div>
            </div>
          </div>

          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" data-bs-toggle="tab" href="#post">Post</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#discussion">Discussion</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#resources">Resources</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#announcements">Announcements</a>
            </li>
          </ul>

          <div class="tab-content p-4 bg-white border rounded-bottom">
            <div class="tab-pane fade show active" id="post">
              <div v-if="loading" class="loading-indicator d-flex align-items-center">
                <div class="spinner-border text-warning me-2" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <span style="color: #FF7043;">Loading post...</span>
              </div>
              <div v-else>
                <!-- Display paginated posts -->
                <div v-for="post in paginatedPosts" :key="post.id" class="mb-3">
                  <div class="d-flex align-items-start" @click="goToPostDetail(post.id)" style="cursor: pointer;">
                    <img :src="post.profilePicture" alt="User profile" class="user-image me-2" />
                    <div>
                      <h6>{{ post.title }}</h6>
                      <div class="post-content" :style="{ 'max-height': expandedPostId === post.id ? '500px' : '4.5rem' }">
                        <span v-if="post.content.split(/\s+/).length <= 70">{{ post.content }}</span>
                        <span v-else>
                          <span v-if="expandedPostId === post.id">{{ post.content }}</span>
                          <span v-else>{{ truncate(post.content, 65) }}</span>
                        </span>
                      </div>
                      <button type="button" class="btn btn-outline-secondary btn-sm"
                        :style="{ color: '#FF7043', border: '1px solid #FF7043', backgroundColor: 'white' }">
                        {{ post.category }}
                      </button>
                      <div v-if="post.content.split(/\s+/).length > 70"
                        class="d-flex justify-content-between align-items-center">
                        <div class="likes-comments">
                          <span @click.stop="likePost(post.id)" :style="{ color: post.isLiked ? 'red' : 'black' }">
                            <i class="fas fa-thumbs-up"></i> {{ post.likes }}
                          </span>
                          <span>Comments: {{ post.comments }}</span>
                        </div>
                        <button type="button" class="btn btn-outline-secondary btn-sm" @click.stop="toggleExpand(post.id)">
                          <span>{{ expandedPostId !== post.id ? 'Expand' : 'Collapse' }}</span>
                          <i class="fa-solid"
                            :class="{ 'fa-chevron-down': expandedPostId !== post.id, 'fa-chevron-up': expandedPostId === post.id }"></i>
                        </button>
                      </div>
                      <div v-else>
                        <div class="likes-comments">
                          <span @click.stop="likePost(post.id)" :style="{ color: post.isLiked ? 'red' : 'black' }">
                            <i class="fas fa-thumbs-up"></i> {{ post.likes }}
                          </span>
                          <span>Comments: {{ post.comments }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <!-- Pagination controls -->
                <div class="pagination-container">
                  <nav aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center">
                      <!-- Previous button -->
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="previousPage" :disabled="currentPage === 1">
                          Previous
                        </button>
                      </li>

                      <!-- First page -->
                      <li class="page-item" :class="{ active: currentPage === 1 }">
                        <button class="page-link" @click="goToPage(1)">1</button>
                      </li>

                      <!-- Ellipsis for start (if needed) -->
                      <li v-if="currentPage > 3" class="page-item disabled">
                        <span class="page-link">...</span>
                      </li>

                      <!-- Pages around current page -->
                      <li v-for="page in pageNumbers" :key="page" class="page-item" 
                          v-if="page !== 1 && page !== totalPages && Math.abs(currentPage - page) <= 1"
                          :class="{ active: page === currentPage }">
                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                      </li>

                      <!-- Ellipsis for end (if needed) -->
                      <li v-if="currentPage < totalPages - 2" class="page-item disabled">
                        <span class="page-link">...</span>
                      </li>

                      <!-- Last page (if more than one page) -->
                      <li v-if="totalPages > 1" class="page-item" :class="{ active: currentPage === totalPages }">
                        <button class="page-link" @click="goToPage(totalPages)">{{ totalPages }}</button>
                      </li>

                      <!-- Next button -->
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>

                  <!-- Page info -->
                  <div class="text-center mt-2">
                    <small class="text-muted">
                      Page {{ currentPage }} of {{ totalPages }}
                      ({{ filteredPosts.length }} total posts)
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 rightbar">
          <div class="mb-3 p-3 bg-light rounded">
            <h6>Top discussion 🔥</h6>
            <a v-if="topDiscussion" href="#" @click="goToPostDetail(topDiscussion.id)">
              <img v-if="topDiscussion.profilePicture" :src="topDiscussion.profilePicture" class="rounded-circle me-2"
                alt="Profile" style="width: 20px; height: 20px;">
              {{ topDiscussion.title }}
            </a>
            <p v-else>No discussions yet.</p>
          </div>

          <div class="mb-3 p-3 bg-light rounded">
            <h6>Recommended topics</h6>
            <div class="btn-group-horizontal" role="group">
              <button v-for="category in categories" :key="category" @click="toggleFilter(category)"
                :class="{ active: selectedFilterCategory === category }" class="btn rounded-pill">
                {{ category }}
              </button>
            </div>
          </div>

          <div class="p-3 bg-light rounded">
            <h6>Top</h6>
            <div class="d-flex align-items-center mb-2">
              <img src="https://via.placeholder.com/40" class="rounded-circle me-2" alt="Profile" />
              <div>
                <p class="m-0">Mikey Jonah</p>
                <button class="btn btn-outline-primary btn-sm">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  background-color: #FFEEAD;
  width: 100vw;
  min-height: 100vh;
  flex-direction: column;
  /* Added for vertical flexbox */
}

.rightbar {
  position: sticky;
  /* Add margin-top to account for navigation */
  top: 100px; /* Adjust this value based on your navigation height */
  max-height: calc(100vh - 120px); /* Viewport height minus top margin and some padding */
  overflow-y: auto; /* Allow scrolling if content is too long */
  align-self: flex-start;
  padding-bottom: 20px; /* Add some bottom padding */
  /* Add smooth scrolling */
  scroll-behavior: smooth;
  /* Style the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #FF7043 #f1f1f1;
}

.mainwrapper {
  margin: 10px auto;
  width: 90%;
  padding: 15px;
  border-radius: 10px;
  position: relative;
  z-index: 1;
}

.row {
  width: 100%;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 991.98px) {
  .rightbar {
    position: static;
    height: auto;
    margin-top: 20px;
    max-height: none;
  }
}

.rightbar::-webkit-scrollbar {
  width: 8px;
}

.rightbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.rightbar::-webkit-scrollbar-thumb {
  background: #FF7043;
  border-radius: 4px;
}

/* Navigation tabs styling */
.nav-tabs {
  background: white;
  position: sticky;
  top: 0;
  z-index: 2;
  padding-top: 10px;
}


.topcontainer {
  width: 100%;
  height: 400px;
  align-content: center;
  text-align: center;
  background-color: #6dd2c3;
  position: relative;
  z-index: 1; /* Ensure the top container stays above other elements */
  clip-path: polygon(100% 0%, 0% 0%, 0.00% 81.65%, 1.00% 81.90%, 2.00% 82.63%, 3.00% 83.79%, 4.00% 85.32%, 5.00% 87.13%, 6.00% 89.10%, 7.00% 91.12%, 8.00% 93.07%, 9.00% 94.83%, 10.00% 96.30%, 11.00% 97.39%, 12.00% 98.03%, 13.00% 98.19%, 14.00% 97.86%, 15.00% 97.05%, 16.00% 95.81%, 17.00% 94.23%, 18.00% 92.39%, 19.00% 90.40%, 20.00% 88.38%, 21.00% 86.45%, 22.00% 84.73%, 23.00% 83.33%, 24.00% 82.31%, 25.00% 81.76%, 26.00% 81.69%, 27.00% 82.11%, 28.00% 83.00%, 29.00% 84.30%, 30.00% 85.94%, 31.00% 87.82%, 32.00% 89.82%, 33.00% 91.83%, 34.00% 93.73%, 35.00% 95.40%, 36.00% 96.74%, 37.00% 97.68%, 38.00% 98.15%, 39.00% 98.13%, 40.00% 97.62%, 41.00% 96.65%, 42.00% 95.28%, 43.00% 93.59%, 44.00% 91.68%, 45.00% 89.67%, 46.00% 87.67%, 47.00% 85.81%, 48.00% 84.19%, 49.00% 82.91%, 50.00% 82.06%, 51.00% 81.67%, 52.00% 81.78%, 53.00% 82.38%, 54.00% 83.42%, 55.00% 84.86%, 56.00% 86.59%, 57.00% 88.53%, 58.00% 90.55%, 59.00% 92.53%, 60.00% 94.36%, 61.00% 95.92%, 62.00% 97.13%, 63.00% 97.90%, 64.00% 98.20%, 65.00% 98.00%, 66.00% 97.32%, 67.00% 96.20%, 68.00% 94.71%, 69.00% 92.93%, 70.00% 90.96%, 71.00% 88.94%, 72.00% 86.98%, 73.00% 85.19%, 74.00% 83.69%, 75.00% 82.56%, 76.00% 81.87%, 77.00% 81.66%, 78.00% 81.94%, 79.00% 82.70%, 80.00% 83.90%, 81.00% 85.45%, 82.00% 87.27%, 83.00% 89.25%, 84.00% 91.27%, 85.00% 93.21%, 86.00% 94.96%, 87.00% 96.40%, 88.00% 97.46%, 89.00% 98.06%, 90.00% 98.19%, 91.00% 97.81%, 92.00% 96.97%, 93.00% 95.70%, 94.00% 94.09%, 95.00% 92.24%, 96.00% 90.24%, 97.00% 88.22%, 98.00% 86.31%, 99.00% 84.61%, 100.00% 83.23%);
}

.post-content {
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  width: 100%;
  line-height: 1.5rem;
}

.post-content[data-expanded="false"] {
  max-height: 2rem;
  /* Adjusted for 2 lines */
}

.post-content[data-expanded="true"] {
  max-height: 500px;
  /* Adjust as needed */
}

.post-content[data-expanded="true"] {
  animation: expand 0.3s ease-out forwards;
  /* Apply expand animation */
}

.post-content[data-expanded="false"] {
  animation: collapse 0.3s ease-in forwards;
  /* Apply collapse animation */
}

@keyframes expand {
  from {
    max-height: 3rem;
    /* Initial height */
    opacity: 0;
  }

  to {
    max-height: 500px;
    /* Final height (adjust as needed) */
    opacity: 1;
  }
}

@keyframes collapse {
  from {
    max-height: 500px;
    /* Initial height (adjust as needed) */
    opacity: 1;
  }

  to {
    max-height: 3rem;
    /* Final height */
    opacity: 0;
  }
}

.likes-comments {
  display: flex;
  /* justify-content: space-between; */
  margin-top: 10px;
  gap: 10px;
}

.addpost {
  background-color: #FF7043;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  float: right;
}

.post-input {
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 15px;
  font-size: 16px;
  color: #333;
  width: 100%;
  /* Make inputs take full width */
  box-sizing: border-box;
  /* Include padding and border in width */
  margin-bottom: 10px;
  /* Add space between inputs */
}

.title-input {
  height: 50px;
}

.content-input {
  height: 150px;
  /* Adjust height as needed */
  resize: vertical;
  /* Allow vertical resizing */
}

.post-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  /* Ensure the image fills the circle */
  vertical-align: top;
  /* Align the image to the top */
}


.container {
  max-width: 100%;
}

.container head {
  background-color: #A66E38;
  width: max-content;
  height: 500px;
  margin: 0;
}

/* Left Sidebar styling */
.bg-light {
  background-color: #ffffff !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.col-lg-8 .bg-light h5 {
  font-weight: bold;
  color: #333333;
}

.col-lg-8 .bg-light p {
  font-size: 0.9rem;
  color: #555555;
}

/* filter function buttons */
/* Button styling */
.btn-outline-secondary {
  border: 1px solid #6c757d;
  color: #6c757d;
}

/* Hover and focus styles */
.btn-outline-secondary:hover,
.btn-outline-secondary:focus {
  border-color: #FF7043;
  color: #FF7043;
  background-color: transparent;
}

/* Active state styling */
.btn-outline-secondary.active {
  border-color: #FF7043;
  color: white;
  background-color: #FF7043;
}


/* Tabs styling */
.nav-tabs .nav-link {
  color: #ff7043;
}

.nav-tabs .nav-link.active {
  color: #ff7043;
  border-color: #ff7043 #ff7043 #ffffff;
  font-weight: bold;
}

.tab-content {
  padding-top: 20px;
}

/* Post Content styling */
.tab-content h6 {
  font-size: 1rem;
  color: #333333;
  font-weight: bold;
}

.tab-content p {
  color: #555555;
  font-size: 0.9rem;
}

.tab-content hr {
  border-top: 1px solid #e6e6e6;
}

.tab-content .mb-3 {
  border-bottom: 1px solid lightgrey;
  /* Adjust color as needed */
  padding-bottom: 1rem;
  /* Adjust spacing as needed */
  margin-bottom: 1rem;
  /* Adjust spacing as needed */
}

/* Right Sidebar styling */
.col-lg-4 h6 {
  color: #333333;
  font-weight: bold;
}

.col-lg-4 a {
  display: block;
  color: #ff7043;
  text-decoration: none;
  margin: 5px 0;
}

.col-lg-4 a:hover {
  text-decoration: underline;
}

.btn-outline-secondary.btn-sm {
  color: #555555;
  background-color: #f1f1f1;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 5px 5px 5px 0;
}

.btn-outline-secondary.btn-sm:hover {
  background-color: #ff7043;
  color: #ffffff;
}

.btn.active,
.btn:hover {
  background-color: #ff7043;
  color: #ffffff;
}

/* People to follow styling */
.col-lg-4 .d-flex {
  align-items: center;
}

.col-lg-4 .d-flex img {
  width: 40px;
  height: 40px;
}

.col-lg-4 .d-flex div p {
  margin: 0;
  font-size: 0.9rem;
  color: #333333;
}

.btn-outline-primary.btn-sm {
  border-color: #ff7043;
  color: #ff7043;
}

.btn-outline-primary.btn-sm:hover {
  background-color: #ff7043;
  color: #ffffff;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .container {
    padding: 0 15px;
  }
}

/* button style for category choosing */

.btn-group .btn {
  display: inline-block;
  border-radius: 50px;
  /* Ensures buttons are fully rounded */
  margin-right: 10px;
  /* Adds separation between buttons */
  padding: 10px 20px;
  color: #ff7043;
  /* Default text color */
  border: 1px solid #ff7043;
  background-color: #ffffff;
  transition: background-color 0.3s, color 0.3s;
}

.btn-group .btn:hover {
  background-color: #ff7043;
  color: #ffffff;
}

.btn-group .btn.active,
.btn-group .btn:focus,
.btn-group .btn:active {
  background-color: #ff7043;
  /* Orange background when selected */
  color: #ffffff;
  /* White text when selected */
  border-color: #ff7043;
}
</style>
