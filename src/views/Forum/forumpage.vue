<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, defineEmits, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  setDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  addDoc,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
  Timestamp,
  limit
} from 'firebase/firestore'
import { db, app } from '../../firebaseConfig'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import SavedPostsModal from './savedPostModal.vue'

const auth = getAuth()
const currentUser = ref(null) // Initialize as null or empty object
const emit = defineEmits() // Ensure this is called in setup
const router = useRouter()
const posts = ref([])
let observer
const lastScrollY = ref(0)
const isScrollingUp = ref(false)

// saved post refs
const savedPosts = ref([])
const isSavingPost = ref(false)
const showSavedPostsModal = ref(false)

// Pagination related refs
const currentPage = ref(1)
const postsPerPage = 10

// Add expandedPostId to track expanded posts
const expandedPostId = ref(null)
const title = ref('')
const description = ref('')
const categories = ref([
  'Repair',
  'Installation',
  'Plumbing',
  'Electrical',
  'Aircon',
  'Cleaning',
  'Gardening',
  'Painting'
]) // Example categories
const selectedCategory = ref('')
const selectedFilterCategory = ref('')
const loading = ref(false)
const topDiscussion = ref(null)
const searchQuery = ref('')
const topUser = ref(null)
const postsLoaded = ref(false)

// Compute total pages based on filtered posts
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

// Compute paginated posts
const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return filteredPosts.value.slice(startIndex, endIndex)
})

// Navigation methods
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo(0, 0) // Scroll to top when changing page
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo(0, 0) // Scroll to top when changing page
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo(0, 0) // Scroll to top when changing page
  }
}

// Generate array of page numbers for pagination
const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

function showAllSavedPosts() {
  showSavedPostsModal.value = true
}

async function handleUnsavePost(postId) {
  await toggleSavePost(new Event('click'), postId)
}

async function fetchSavedPosts() {
  if (!currentUser.value) return

  try {
    const userDoc = await getDoc(doc(db, 'users', currentUser.value.uid))
    const userData = userDoc.data()

    if (userData && userData.savedPosts) {
      const savedPostPromises = userData.savedPosts.map(async (postId) => {
        const postDoc = await getDoc(doc(db, 'posts', postId))
        if (postDoc.exists()) {
          return {
            id: postDoc.id,
            ...postDoc.data()
          }
        }
        return null
      })

      const fetchedPosts = await Promise.all(savedPostPromises)
      savedPosts.value = fetchedPosts.filter((post) => post !== null)
    }
  } catch (error) {
    console.error('Error fetching saved posts:', error)
  }
}

async function toggleSavePost(event, postId) {
  // Prevent post navigation when clicking save button
  // event.stopPropagation();

  if (!currentUser.value) {
    alert('You must be logged in to save posts.')
    return
  }

  if (isSavingPost.value) return
  isSavingPost.value = true

  try {
    const userRef = doc(db, 'users', currentUser.value.uid)
    const userDoc = await getDoc(userRef)
    const userData = userDoc.data()
    const savedPostsArray = userData?.savedPosts || []

    if (savedPostsArray.includes(postId)) {
      // Remove post from saved posts
      await updateDoc(userRef, {
        savedPosts: arrayRemove(postId)
      })
      savedPosts.value = savedPosts.value.filter((post) => post.id !== postId)
    } else {
      // Add post to saved posts
      await updateDoc(userRef, {
        savedPosts: arrayUnion(postId)
      })
      // Add the post to savedPosts.value
      const savedPost = posts.value.find((post) => post.id === postId)
      if (savedPost) {
        savedPosts.value = [savedPost, ...savedPosts.value]
      }
    }
  } catch (error) {
    console.error('Error toggling saved post:', error)
    alert('Failed to save/unsave the post. Please try again.')
  } finally {
    isSavingPost.value = false
  }
}

const isPostSaved = computed(() => {
  return (postId) => {
    if (!currentUser.value || !savedPosts.value) return false
    return savedPosts.value.some((post) => post.id === postId)
  }
})

async function submitPost() {
  // Validate input fields
  if (!title.value || !description.value || !selectedCategory.value) {
    alert('Please fill in all fields.')
    return
  }

  if (!currentUser.value) {
    alert('You must be logged in to submit a post.')
    return
  }

  try {
    console.log('Fetching user data from Firestore...')
    const userDoc = await getDoc(doc(db, 'users', currentUser.value.uid))
    if (!userDoc.exists()) {
      console.error('User not found in Firestore')
      alert('User data not found. Please try again.')
      return
    }

    const userData = userDoc.data()
    console.log('User data fetched:', userData)

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
      likedBy: []
    }

    console.log('Creating new post:', newPost)
    const docRef = await addDoc(collection(db, 'posts'), newPost)
    newPost.id = docRef.id
    console.log('Post added to Firestore with ID:', newPost.id)

    emit('add-post', newPost) // Now emit should work

    title.value = ''
    description.value = ''
    selectedCategory.value = ''

    await fetchPosts()
  } catch (error) {
    console.error('Error adding post:', error)
    alert('Failed to submit the post. Please try again.')
  }
}

async function fetchPosts() {
  loading.value = true // Start loading
  const postsCollection = collection(db, 'posts')
  const postsQuery = query(postsCollection, orderBy('time', 'desc'))
  try {
    const querySnapshot = await getDocs(postsQuery)
    const postPromises = querySnapshot.docs.map(async (docSnapshot) => {
      const postData = docSnapshot.data()
      const userId = postData.userId

      const userDoc = await getDoc(doc(db, 'users', userId))
      const userProfilePic = userDoc.exists() ? userDoc.data().profilePicture : ''

      // Check if the current user has liked the post
      const isLiked =
        currentUser.value && postData.likedBy && postData.likedBy.includes(currentUser.value.uid)

      return {
        id: docSnapshot.id,
        ...postData,
        profilePicture: userProfilePic,
        isVisible: false,
        isLiked: isLiked, // Add isLiked property to each post object,
        lastEdited: postData.lastEdited // Add this line to include the lastEdited field
      }
    })

    const postsWithProfiles = await Promise.all(postPromises)

    // Fetch comment counts in parallel after posts have been fetched
    const commentCountPromises = postsWithProfiles.map(async (post) => {
      const commentCount = await fetchCommentCount(post.id)
      return { ...post, comments: commentCount }
    })

    posts.value = await Promise.all(commentCountPromises)

    posts.value.forEach((post) => {
      console.log(`Post ID: ${post.id}, Comment Count: ${post.comments}`)
    })
    postsLoaded.value = true
    await nextTick()
    observePosts()
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false // End loading
  }
}

async function fetchTopDiscussion() {
  try {
    // Query for the post with the most likes
    const postsQuery = query(collection(db, 'posts'), orderBy('likes', 'desc'), limit(1))
    const querySnapshot = await getDocs(postsQuery)

    if (!querySnapshot.empty) {
      const topPostDoc = querySnapshot.docs[0]
      const topPostData = topPostDoc.data()

      // Fetch the user's profile picture
      const userDoc = await getDoc(doc(db, 'users', topPostData.userId))
      const userProfilePic = userDoc.exists() ? userDoc.data().profilePicture : ''

      topDiscussion.value = {
        id: topPostDoc.id,
        title: topPostData.title,
        profilePicture: userProfilePic
      }
    }
  } catch (error) {
    console.error('Error fetching top discussion:', error)
  }
}

function truncate(text, wordLimit) {
  const words = text.split(/\s+/)
  if (words.length <= wordLimit) {
    return text
  }
  return words.slice(0, wordLimit).join(' ') + '...'
}

async function fetchCommentCount(postId) {
  try {
    const commentsRef = collection(db, 'comments')
    const q = query(commentsRef, where('postID', '==', postId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.size // Return the count of comments
  } catch (error) {
    console.error('Error fetching comment count:', error)
    return 0 // Return 0 if there's an error
  }
}

function observePosts() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const post = posts.value.find((p) => p.id === entry.target.getAttribute('data-id'))
        if (post) {
          // Check if the post is intersecting (entering the viewport)
          if (entry.isIntersecting) {
            if (!post.isVisible) {
              // Only update if it was previously not visible
              post.isVisible = true
              // Add animation class when post comes into view
              entry.target.classList.add('float-up') // Add animation class
            }
          } else if (!entry.isIntersecting && post.isVisible) {
            post.isVisible = false // Reset visibility state when leaving viewport
            entry.target.classList.remove('float-up') // Remove animation class
          }
        }
      })
    },
    { threshold: 0.01 }
  ) // Adjust threshold as needed

  document.querySelectorAll('.card').forEach((post) => observer.observe(post))
}

function goToPostDetail(postId) {
  router
    .push({
      name: 'individualPostView',
      params: { postId }
    })
    .then(() => {
      // This will execute after navigation is complete
      window.scrollTo({
        top: 0,
        behavior: 'instant' // This makes it jump to top instantly without animation
      })
    })
}

function goToProfile(userId) {
  router.push({
    path: '/profile/' + userId,
    params: { userId }
  })
}

function handleScroll() {
  if (window.scrollY === 0) {
    isScrollingUp.value = false // Reset scrolling state when at the top
  } else if (window.scrollY < lastScrollY.value) {
    isScrollingUp.value = true // User is scrolling up
  } else {
    isScrollingUp.value = false // User is scrolling down
  }
  lastScrollY.value = window.scrollY
}

function toggleExpand(postId) {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null
  } else {
    expandedPostId.value = postId
  }
}
//////////////////////////////////////////////////////////
async function likePost(postId: string) {
  if (!currentUser.value) {
    alert('You must be logged in to like a post.')
    return
  }

  const postIndex = posts.value.findIndex((p) => p.id === postId)
  if (postIndex > -1) {
    posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked
    posts.value[postIndex].likes += posts.value[postIndex].isLiked ? 1 : -1
  }

  try {
    const postRef = doc(db, 'posts', postId)
    const postDoc = await getDoc(postRef)

    if (postDoc.exists()) {
      const postData = postDoc.data()
      const likedBy = postData.likedBy || []
      const userId = currentUser.value.uid

      if (likedBy.includes(userId)) {
        // User has already liked, so unlike the post
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likes: postData.likes - 1
        })
      } else {
        // User hasn't liked, so like the post
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
          likes: postData.likes + 1
        })
      }

      // No need to update posts array here since it was updated optimistically
    } else {
      console.error('Post not found in Firestore')
      alert('Post not found. Please try again.')

      // Revert the optimistic update if the post is not found
      if (postIndex > -1) {
        posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked
        posts.value[postIndex].likes += posts.value[postIndex].isLiked ? 1 : -1
      }
    }
    // await fetchPosts();
  } catch (error) {
    console.error('Error liking/unliking post:', error)
    alert('Failed to like/unlike the post. Please try again.')

    // Revert the optimistic update if there's an error
    if (postIndex > -1) {
      posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked
      posts.value[postIndex].likes += posts.value[postIndex].isLiked ? 1 : -1
    }
  }
}

function toggleFilter(category) {
  if (selectedFilterCategory.value === category) {
    selectedFilterCategory.value = '' // Reset to default
  } else {
    selectedFilterCategory.value = category // Set the new category
  }
}

const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((post) => post.title.toLowerCase().includes(query))
  }

  // Filter by category (if selected)
  if (selectedFilterCategory.value) {
    filtered = filtered.filter((post) => post.category === selectedFilterCategory.value)
  }

  return filtered
})

function formatPostDate(post) {
  try {
    // Check if lastEdited field is available
    if (post?.lastEdited) {
      // Use lastEdited field if available
      const lastEditedDate = post.lastEdited.toDate()
      return `Last edited: ${new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Hong_Kong',
        hour12: true
      }).format(lastEditedDate)}`
    } else {
      // Fallback to using the original time timestamp
      let date
      if (post.time instanceof Date) {
        date = post.time
      } else if (post.time.toDate) {
        date = post.time.toDate()
      } else {
        date = new Date(post.time)
      }

      // Validate date
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Hong_Kong',
        hour12: true
      }).format(date)
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid date'
  }
}

async function computeTopUser(posts) {
  // Create an object to store the post counts for each user
  const userPostCounts = {}

  // Loop through the posts and count the number of posts for each user
  for (const post of posts) {
    if (userPostCounts[post.userId]) {
      userPostCounts[post.userId]++
    } else {
      userPostCounts[post.userId] = 1
    }
  }

  console.log('User post counts:', userPostCounts)

  // Find the user with the maximum number of posts
  let topUserId = null
  let maxPostCount = 0
  for (const userId in userPostCounts) {
    if (userPostCounts[userId] > maxPostCount) {
      topUserId = userId
      maxPostCount = userPostCounts[userId]
    }
  }

  console.log('Top user ID:', topUserId)
  console.log('Max post count:', maxPostCount)

  // If no user is found, return null
  if (topUserId === null) {
    return null
  }

  return topUserId
}

async function getTopUser() {
  try {
    console.log('getTopUser called')
    if (postsLoaded.value && posts.value.length > 0) {
      console.log('posts.value has', posts.value.length, 'items')
      const topUserId = await computeTopUser(posts.value)
      if (topUserId) {
        console.log('Top user ID:', topUserId)
        const userDoc = await getDoc(doc(db, 'users', topUserId))
        if (userDoc.exists()) {
          topUser.value = {
            id: userDoc.id,
            ...userDoc.data()
          }
          console.log('Top user data:', topUser.value)
        } else {
          console.log('Top user document not found')
          topUser.value = null
        }
      } else {
        console.log('No top user found')
        topUser.value = null
      }
    } else {
      console.log('posts.value is empty or not loaded yet')
      topUser.value = null
    }
  } catch (error) {
    console.error('Error fetching top user:', error)
    topUser.value = null
  }
}

onMounted(() => {
  fetchPosts()
  fetchTopDiscussion()
  watch(postsLoaded, (loaded) => {
    if (loaded) {
      getTopUser()
    }
  })
  console.log(posts)
  window.addEventListener('scroll', handleScroll)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in, set currentUser to user's info
      currentUser.value = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        profilePicture: user.photoURL
      }
      fetchSavedPosts()
    } else {
      // User is logged out
      currentUser.value = null
    }
  })
})
</script>

<template>
  <!-- Header Section -->
  <main class="backdrop">
    <div class="topcontainer">
      <div class="header-wrapper">
        <h1>HandyMandy Discussion Forum</h1>
        <p>
          Join our community of self-help scientists! Start by connecting with like-minded
          individuals.
        </p>
        <div class="searchFilter">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Search posts by title..."
            />
          </div>
        </div>
      </div>
      <div class="header-wrapper2">
        <img src="./background.svg" alt="" class="floating-animation" />
      </div>
    </div>
    <div class="mainwrapper">
      <div class="row">
        <div class="col-lg-8 col-md-12">
          <div class="container-fluid">
            <div class="p-4 bg-light mb-3 rounded-5">
              <h5 class="text-start mb-3">Create a post here:</h5>
              <div class="mb-3">
                <input
                  type="text"
                  v-model="title"
                  class="form-control post-input title-input"
                  placeholder="Add a title"
                />
              </div>
              <div class="mb-3">
                <textarea
                  v-model="description"
                  class="form-control post-input content-input"
                  placeholder="What's on your mind? 🤔"
                ></textarea>
              </div>

              <div class="btn-group d-flex flex-wrap mb-3" role="group">
                <button
                  v-for="(category, index) in categories"
                  :key="index"
                  type="button"
                  class="btn btn-outline-primary rounded-pill flex-grow-1 mb-2 mx-1"
                  :class="{ active: selectedCategory === category }"
                  @click="selectedCategory = category"
                >
                  {{ category }}
                </button>
              </div>

              <!-- Make Add Post button responsive and centered -->
              <div class="d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-primary addpost w-100 w-md-auto"
                  @click="submitPost()"
                >
                  Add Post
                </button>
              </div>
            </div>
          </div>

          <div class="tab-content bg-white border">
            <div class="posts-header">
              <h1>Posts</h1>
              <span class="posts-count">{{ filteredPosts.length }}</span>
            </div>
            <div class="tab-pane fade show active" id="post">
              <div v-if="loading" class="loading-indicator d-flex align-items-center">
                <div class="spinner-border text-warning me-2" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <span style="color: #ff7043">Loading post...</span>
              </div>
              <div v-else>
                <!-- Display paginated posts -->
                <div v-for="post in paginatedPosts" :key="post.id" class="mb-3 post-card">
                  <div
                    class="d-flex align-items-start post-wrapper"
                    @click="goToPostDetail(post.id)"
                    style="cursor: pointer"
                  >
                    <img
                      :src="post.profilePicture"
                      alt="User profile"
                      class="user-image me-2"
                      @click.stop="goToProfile(post.userId)"
                      style="cursor: pointer"
                    />
                    <div class="post-content-wrapper">
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="post-info">
                          <h4 @click.stop="goToProfile(post.userId)" style="cursor: pointer">
                            {{ post.username }}
                          </h4>
                          <span class="date">
                            <i class="bi bi-clock"></i>
                            {{ formatPostDate(post) }}
                          </span>
                          <h6>{{ post.title }}</h6>
                        </div>
                        <button @click.stop="toggleSavePost(event, post.id)" class="btn-save">
                          <i
                            class="bi"
                            :class="{
                              'bi-bookmark-fill': isPostSaved(post.id),
                              'bi-bookmark': !isPostSaved(post.id)
                            }"
                          ></i>
                        </button>
                      </div>
                      <div
                        class="post-content"
                        :style="{ 'max-height': expandedPostId === post.id ? '500px' : '4.5rem' }"
                      >
                        <span v-if="post.content.split(/\s+/).length <= 70">{{
                          post.content
                        }}</span>
                        <span v-else>
                          <span v-if="expandedPostId === post.id">{{ post.content }}</span>
                          <span v-else>{{ truncate(post.content, 65) }}</span>
                        </span>
                      </div>
                      <button type="button" class="btn btn-outline-secondary btn-sm category-tag">
                        {{ post.category }}
                      </button>
                      <div
                        v-if="post.content.split(/\s+/).length > 70"
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div class="likes-comments">
                          <button @click.stop="likePost(post.id)" class="btn-like">
                            <i
                              class="bi"
                              :class="{ 'bi-heart-fill': post.isLiked, 'bi-heart': !post.isLiked }"
                            ></i>
                            <span class="like-count">{{ post.likes }}</span>
                          </button>
                          <span>Comments: {{ post.comments }}</span>
                        </div>
                        <button
                          type="button"
                          class="btn btn-outline-secondary btn-sm"
                          @click.stop="toggleExpand(post.id)"
                        >
                          <span>{{ expandedPostId !== post.id ? 'Expand' : 'Collapse' }}</span>
                          <i
                            class="fa-solid"
                            :class="{
                              'fa-chevron-down': expandedPostId !== post.id,
                              'fa-chevron-up': expandedPostId === post.id
                            }"
                          ></i>
                        </button>
                      </div>
                      <div v-else>
                        <div class="likes-comments">
                          <button @click.stop="likePost(post.id)" class="btn-like">
                            <i
                              class="bi"
                              :class="{ 'bi-heart-fill': post.isLiked, 'bi-heart': !post.isLiked }"
                            ></i>
                            <span class="like-count">{{ post.likes }}</span>
                          </button>
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
                        <button
                          class="page-link"
                          @click="previousPage"
                          :disabled="currentPage === 1"
                        >
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
                      <li
                        v-for="page in pageNumbers"
                        :key="page"
                        class="page-item"
                        v-if="
                          page !== 1 && page !== totalPages && Math.abs(currentPage - page) <= 1
                        "
                        :class="{ active: page === currentPage }"
                      >
                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                      </li>

                      <!-- Ellipsis for end (if needed) -->
                      <li v-if="currentPage < totalPages - 2" class="page-item disabled">
                        <span class="page-link">...</span>
                      </li>

                      <!-- Last page (if more than one page) -->
                      <li
                        v-if="totalPages > 1"
                        class="page-item"
                        :class="{ active: currentPage === totalPages }"
                      >
                        <button class="page-link" @click="goToPage(totalPages)">
                          {{ totalPages }}
                        </button>
                      </li>

                      <!-- Next button -->
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button
                          class="page-link"
                          @click="nextPage"
                          :disabled="currentPage === totalPages"
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>

                  <!-- Page info -->
                  <div class="text-center mt-2">
                    <small class="text-muted">
                      Page {{ currentPage }} of {{ totalPages }} ({{ filteredPosts.length }} total
                      posts)
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-12 rightbar">
          <div class="mb-3 p-3 bg-light rounded">
            <h6>Top discussion 🔥</h6>
            <a
              v-if="topDiscussion"
              @click="goToPostDetail(topDiscussion.id)"
              style="cursor: pointer"
            >
              <img
                v-if="topDiscussion.profilePicture"
                :src="topDiscussion.profilePicture"
                class="user-image"
                alt="Profile"
              />
              <span>{{ topDiscussion.title }}</span>
            </a>
            <p v-else>No discussions yet.</p>
          </div>

          <div class="mb-3 p-3 bg-light rounded">
            <h6>Recommended topics</h6>
            <div class="btn-group-horizontal" role="group">
              <button
                v-for="category in categories"
                :key="category"
                @click="toggleFilter(category)"
                :class="{ active: selectedFilterCategory === category }"
                class="btn rounded-pill"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <div class="p-3 bg-light rounded">
            <h6>Top User</h6>
            <div v-if="topUser" class="d-flex align-items-center mb-2">
              <img
                :src="topUser.profilePicture"
                class="user-image me-2"
                alt="Profile"
                @click="goToProfile(topUser.id)"
                style="cursor: pointer"
              />
              <div>
                <p class="m-0" style="cursor: pointer" @click="goToProfile(topUser.id)">
                  {{ topUser.username }}
                </p>
              </div>
            </div>
            <p v-else class="text-muted">No top user data available.</p>
          </div>
          <div class="my-3 p-3 bg-light rounded">
            <h6 class="d-flex align-items-center gap-2">
              <i class="bi bi-bookmark"></i>
              Saved Posts
            </h6>
            <div v-if="currentUser">
              <div v-if="savedPosts.length > 0" class="saved-posts-list">
                <div
                  v-for="post in savedPosts.slice(0, 3)"
                  :key="post.id"
                  class="saved-post-item mb-2 p-2 border rounded"
                  @click="goToPostDetail(post.id)"
                  style="cursor: pointer"
                >
                  <div class="d-flex align-items-start">
                    <img
                      :src="post.userImage || 'default-profile.png'"
                      alt="User profile"
                      class="user-image me-2"
                      style="width: 32px; height: 32px; border-radius: 50%"
                    />
                    <div class="flex-grow-1">
                      <p class="mb-1 text-truncate fw-bold" style="font-size: 0.9rem">
                        {{ post.title }}
                      </p>
                      <small class="text-muted">{{ post.username }}</small>
                    </div>
                  </div>
                </div>
                <button
                  v-if="savedPosts.length > 3"
                  class="btn btn-outline-primary btn-sm w-100 mt-2"
                  @click="showAllSavedPosts"
                >
                  View All ({{ savedPosts.length }})
                </button>
              </div>
              <p v-else class="text-muted small">
                No saved posts yet. Save posts to access them quickly!
              </p>
            </div>
            <div v-else class="text-muted small">Log in to save and access your favorite posts</div>
          </div>
        </div>
      </div>
    </div>
    <SavedPostsModal
      v-if="showSavedPostsModal"
      :show="showSavedPostsModal"
      :posts="savedPosts"
      @close="showSavedPostsModal = false"
      @unsave-post="handleUnsavePost"
      @view-post="goToPostDetail"
    />
  </main>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"
  />
</template>

<style scoped>
/* Add the background image */

.backdrop {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* margin: auto; */
  /* background-color: #FFEEAD; */
  background: url('../../assets/backdrop.png');
  background-size: contain;
  /* background-repeat: no-repeat; */
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  /* Added for vertical flexbox */
}

.rightbar {
  position: sticky;
  /* Add margin-top to account for navigation */
  top: 120px;
  /* Adjust this value based on your navigation height */
  max-height: calc(100vh - 120px);
  /* Viewport height minus top margin and some padding */
  overflow-y: auto;
  /* Allow scrolling if content is too long */
  align-self: flex-start;
  padding-bottom: 20px;
  /* Add some bottom padding */
  /* Add smooth scrolling */
  scroll-behavior: smooth;
  /* Style the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #ff7043 #f1f1f1;
}

/* search filter styling */
.searchFilter {
  max-width: 50%;
  margin-top: 20px;
}

.input-group-text {
  background-color: white;
  border-right: none;
}

.input-group input {
  border-left: none;
}

.input-group input:focus {
  box-shadow: none;
  border-color: #ced4da;
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

.rightbar::-webkit-scrollbar {
  width: 8px;
}

.rightbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.rightbar::-webkit-scrollbar-thumb {
  background: #ff7043;
  border-radius: 4px;
}

/* Navigation tabs styling */
.nav-tabs {
  background: white;
  position: sticky;
  top: 0;
  z-index: 2;
  padding-top: 10px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.topcontainer {
  width: 100%;
  height: fit-content;
  padding-bottom: 500px;
  align-content: center;
  text-align: center;
  background-color: #a6d7ba;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding: 2rem; */
  padding-top: 0px;
  padding-bottom: 4rem;
  clip-path: polygon(
    100% 0%,
    0% 0%,
    0% 81.65%,
    1% 81.9%,
    2% 82.63%,
    3% 83.79%,
    4% 85.32%,
    5% 87.13%,
    6% 89.1%,
    7% 91.12%,
    8% 93.07%,
    9% 94.83%,
    10% 96.3%,
    11% 97.39%,
    12% 98.03%,
    13% 98.19%,
    14% 97.86%,
    15% 97.05%,
    16% 95.81%,
    17% 94.23%,
    18% 92.39%,
    19% 90.4%,
    20% 88.38%,
    21% 86.45%,
    22% 84.73%,
    23% 83.33%,
    24% 82.31%,
    25% 81.76%,
    26% 81.69%,
    27% 82.11%,
    28% 83%,
    29% 84.3%,
    30% 85.94%,
    31% 87.82%,
    32% 89.82%,
    33% 91.83%,
    34% 93.73%,
    35% 95.4%,
    36% 96.74%,
    37% 97.68%,
    38% 98.15%,
    39% 98.13%,
    40% 97.62%,
    41% 96.65%,
    42% 95.28%,
    43% 93.59%,
    44% 91.68%,
    45% 89.67%,
    46% 87.67%,
    47% 85.81%,
    48% 84.19%,
    49% 82.91%,
    50% 82.06%,
    51% 81.67%,
    52% 81.78%,
    53% 82.38%,
    54% 83.42%,
    55% 84.86%,
    56% 86.59%,
    57% 88.53%,
    58% 90.55%,
    59% 92.53%,
    60% 94.36%,
    61% 95.92%,
    62% 97.13%,
    63% 97.9%,
    64% 98.2%,
    65% 98%,
    66% 97.32%,
    67% 96.2%,
    68% 94.71%,
    69% 92.93%,
    70% 90.96%,
    71% 88.94%,
    72% 86.98%,
    73% 85.19%,
    74% 83.69%,
    75% 82.56%,
    76% 81.87%,
    77% 81.66%,
    78% 81.94%,
    79% 82.7%,
    80% 83.9%,
    81% 85.45%,
    82% 87.27%,
    83% 89.25%,
    84% 91.27%,
    85% 93.21%,
    86% 94.96%,
    87% 96.4%,
    88% 97.46%,
    89% 98.06%,
    90% 98.19%,
    91% 97.81%,
    92% 96.97%,
    93% 95.7%,
    94% 94.09%,
    95% 92.24%,
    96% 90.24%,
    97% 88.22%,
    98% 86.31%,
    99% 84.61%,
    100% 83.23%
  );
}

.header-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.header-wrapper2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-wrapper2 img {
  max-width: 50%;
  height: auto;
}

.floating-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

.topcontainer h1 {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 1rem;
}

/* responsiveness for the waves */

.posts-header {
  padding: 0rem 1rem 1rem 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 112, 67, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.posts-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.posts-count {
  background-color: rgba(255, 112, 67, 0.1);
  color: #ff7043;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.date {
  font-size: 0.9rem;
  color: rgba(74, 74, 74, 0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-content {
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  width: 100%;
  line-height: 1.5rem;
}

.post-content[data-expanded='false'] {
  max-height: 2rem;
  /* Adjusted for 2 lines */
}

.post-content[data-expanded='true'] {
  max-height: 500px;
  /* Adjust as needed */
}

.post-content[data-expanded='true'] {
  animation: expand 0.3s ease-out forwards;
  /* Apply expand animation */
}

.post-content[data-expanded='false'] {
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
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.addpost {
  background-color: #ff7043;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  float: right;
}

.post-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.post-wrapper {
  position: relative;
  z-index: 1;
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: white;
  z-index: 0;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 112, 67, 0.1);
  box-shadow: 0 8px 24px rgba(255, 112, 67, 0.12);
}

.post-card:hover::before {
  background: linear-gradient(to bottom right, rgba(255, 112, 67, 0.02), rgba(255, 112, 67, 0.05));
}

.post-content-wrapper {
  flex: 1;
  transition: all 0.3s ease;
}

.post-card:hover .post-content-wrapper {
  padding-left: 8px;
}

.post-card:hover h4 {
  color: #ff7043;
}

.category-tag {
  transition: all 0.3s ease;
}

.post-card:hover .category-tag {
  background-color: #ff7043 !important;
  color: white !important;
  border-color: #ff7043 !important;
}

.btn-like {
  transition: all 0.3s ease;
}

.post-card:hover .btn-like {
  transform: scale(1.05);
}

/* Optional: Smooth transition for the hr element */
hr {
  transition: all 0.3s ease;
  margin: 16px 0;
  opacity: 0.9;
}

.post-card:hover hr {
  position: relative;
  background-color: #ff7043;
  opacity: 0.2;
}

/* Make sure images maintain their quality during transform */
.user-image {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* Add smooth transition to text elements */
h4,
h6,
.post-content {
  transition: all 0.3s ease;
}

/* Optional: Add a subtle scale effect to the profile image on hover */
.post-card:hover .user-image {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Enhance visibility of post content on hover */
.post-card:hover .post-content {
  color: #2c3e50;
}

.input-container {
  border-radius: 50px;
  background-color: white;
  /* Assuming you want a white background */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  /* Optional: adds subtle shadow */
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

.btn-like {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.btn-like:hover {
  background: rgba(255, 0, 0, 0.1);
}

.btn-like i {
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

/* Hollow heart style */
.btn-like .bi-heart {
  color: #ff0000;
}

/* Filled heart style */
.btn-like .bi-heart-fill {
  color: #ff0000;
}

.like-count {
  color: #666;
  font-weight: 500;
}

.container {
  width: 100%;
  margin: 0;
  padding: 0;
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
  border-color: #ff7043;
  color: #ff7043;
  background-color: transparent;
}

/* Active state styling */
.btn-outline-secondary.active {
  border-color: #ff7043;
  color: white;
  background-color: #ff7043;
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
  border-radius: 20px;
  padding-top: 20px;
}

/* Post Content styling */
.tab-content h6 {
  padding-top: 0.5rem;
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
  transition:
    background-color 0.3s,
    color 0.3s;
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

/* saved post styles */

.saved-posts-list {
  max-height: 300px;
  overflow-y: auto;
}

.saved-post-item {
  transition: background-color 0.2s;
  cursor: pointer;
}

.saved-post-item:hover {
  background-color: #f8f9fa;
}

.btn-save {
  position: absolute;
  top: 10px !important;
  right: 10px !important;
  z-index: 1;
  background: none;
  border: none;
  color: #6c757d;
  /* padding: 0.25rem 0.5rem; */
  transition: color 0.2s;
}

.btn-save:hover {
  color: #0d6efd;
}

.btn-save .bi-bookmark-fill {
  color: #0d6efd;
}

/* topuser styling */

.col-lg-4 .bg-light:hover {
  background-color: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* .bg-light:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
} */

.col-lg-4 .d-flex:hover .user-image {
  transform: scale(1.2);
  transition: transform 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.col-lg-4 .d-flex:hover p {
  color: #ff7043;
  transition: color 0.3s;
}

/* Style for top discussion link and image */
.bg-light a {
  display: flex;
  align-items: center;
  min-height: 100px;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.bg-light a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.bg-light a .user-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
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
