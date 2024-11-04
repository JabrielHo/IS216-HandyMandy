<template>
    <div class="backdrop">
        <article v-if="post" class="post-container">
            <!-- Post Header -->
            <div class="post-header">
                <div class="author-section">
                    <div class="profile-image">
                        <img :src="post.userImage || '/default-avatar.png'" :alt="post.username"
                            @error="handleImageError" />
                    </div>
                    <div class="author-info">
                        <h3 class="author-name">{{ post.username }}</h3>
                        <span class="date">
                            <i class="bi bi-clock"></i>
                            {{ formatPostDate(post.time) }}
                        </span>
                    </div>
                </div>
                
            </div>

            <div class="post-content">
                <div class="titleAndContent">
                    <h1 class="post-title">{{ post.title }}</h1>
                    <p class="content-text">{{ post.content }}</p>
                </div>
                <div class="likes-comments">
                    <button @click.stop="likePost(post.id)" class="btn-like">
                        <i class="bi" :class="{ 'bi-heart-fill': post.isLiked, 'bi-heart': !post.isLiked }"></i>
                        <span class="like-count">{{ post.likes }}</span>
                    </button>
                    <span>Comments: {{ post.comments }}</span>
                </div>

                <section class="comments-section">
                    <h3 class="section-title">Comments</h3>

                    <div class="comments-list">
                        <div v-for="(comment, index) in comments" :key="index" class="comment-card">
                            <div class="comment-header">
                                <div class="profile-image">
                                    <img :src="comment.profilePicture || '/default-avatar.png'" :alt="comment.username"
                                        @error="handleImageError" />
                                </div>
                                <div class="comment-info">
                                    <div class="comment-meta">
                                        <p class="username">{{ comment.username }}</p>
                                        <p class="timestamp">{{ formatPostDate(comment.timestamp) }}</p>
                                    </div>
                                    <div class="comment-content">
                                        {{ comment.content }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="comment-form" ref="commentForm">
                        <h3 class="form-title">Join the Discussion</h3>
                        <div class="input-group">
                            <textarea v-model="newCommentContent" class="comment-input" rows="3"
                                placeholder="Share your thoughts..." ref="commentInput"></textarea>
                            <button @click="addComment" class="btn-submit" :disabled="!newCommentContent.trim()">
                                Post Comment
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </article>
        <div v-else class="loading-container">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Loading post...</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs, addDoc, Timestamp, runTransaction, increment } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const route = useRoute();
const postId = route.params.postId;
const post = ref(null);
const comments = ref([]);
const newCommentContent = ref('');
const likeCount = ref(0);
const commentCount = ref(0);
const auth = getAuth();
const currentUser = ref(auth.currentUser);
const isAuthInitialized = ref(false); // Add this to track auth initialization

onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user?.uid); // Debug log
        currentUser.value = user;
        isAuthInitialized.value = true;
        
        // Refetch post when auth state changes to update like status
        if (post.value) {
            fetchPost();
        }
    });

    // Initial data fetch
    fetchPost();
    fetchComments();

});

const formatPostDate = (timestamp: any) => {
    if (!timestamp) return 'No date available';

    let date;
    if (timestamp instanceof Timestamp) {
        date = timestamp.toDate();
    } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        return 'Invalid date';
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, '0');

    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${month} ${day}, ${year} at ${formattedHours}:${minutes}:${seconds} ${ampm} UTC+8`;
};

async function fetchPost() {
    try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
            const postData = postDoc.data();
            const userData = await fetchUserData(postData.userId);
            
            // Check if the current user has liked the post
            const isLiked = currentUser.value && postData.likedBy?.includes(currentUser.value.uid);
            console.log('Fetch post - Like status:', { 
                isLiked, 
                currentUser: currentUser.value?.uid,
                likedBy: postData.likedBy 
            });
            
            post.value = {
                id: postDoc.id,
                ...postData,
                username: userData.username,
                userImage: userData.profilePicture,
                isLiked: isLiked,
                likes: postData.likes || 0
            };
        }
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}


async function fetchUserData(userId: string) {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                username: userData.username || 'Anonymous',
                profilePicture: userData.profilePicture || null
            };
        }
        return {
            username: 'Anonymous',
            profilePicture: null
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            username: 'Anonymous',
            profilePicture: null
        };
    }
}

async function fetchComments() {
    try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postID', '==', postId));
        const querySnapshot = await getDocs(q);

        const sortedComments = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        const commentPromises = sortedComments.map(async (commentData) => {
            const userData = await fetchUserData(commentData.userId);
            return {
                ...commentData,
                username: userData.username,
                profilePicture: userData.profilePicture
            };
        });

        comments.value = await Promise.all(commentPromises);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/default-avatar.png';
}

async function addComment() {
    const user = auth.currentUser;

    if (!user) {
        alert('You must be logged in to comment.');
        return;
    }

    if (newCommentContent.value.trim() === '') {
        alert('Comment cannot be empty!');
        return;
    }

    try {
        // Get post reference and data
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error('Post not found');
        }

        // Start transaction to ensure comment and count update atomically
        await runTransaction(db, async (transaction) => {
            // Add the comment
            const commentRef = doc(collection(db, 'comments'));
            transaction.set(commentRef, {
                content: newCommentContent.value,
                postID: postId,
                userId: user.uid,
                timestamp: new Date()
            });

            // Increment comment count
            transaction.update(postRef, {
                comments: increment(1)
            });
        });

        // Clear comment input
        newCommentContent.value = '';
        
        // Refresh comments and post data
        await Promise.all([
            fetchComments(),
            fetchPost() // Make sure this function exists to refresh post data
        ]);

    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
    }
}

async function likePost(postId: string) {
    console.log('Like attempt - Auth state:', { 
        currentUser: currentUser.value?.uid,
        isInitialized: isAuthInitialized.value 
    });

    if (!isAuthInitialized.value) {
        console.log('Auth not yet initialized');
        return;
    }

    if (!currentUser.value) {
        alert('You must be logged in to like a post.');
        return;
    }

    try {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            const postData = postDoc.data();
            const likedBy = postData.likedBy || [];
            const userId = currentUser.value.uid;

            // Optimistically update the UI
            const isCurrentlyLiked = likedBy.includes(userId);
            post.value.isLiked = !isCurrentlyLiked;
            post.value.likes = (postData.likes || 0) + (isCurrentlyLiked ? -1 : 1);

            try {
                await updateDoc(postRef, {
                    likedBy: isCurrentlyLiked ? arrayRemove(userId) : arrayUnion(userId),
                    likes: postData.likes + (isCurrentlyLiked ? -1 : 1)
                });

                console.log('Like operation successful');
            } catch (error) {
                // Revert optimistic update if the operation fails
                post.value.isLiked = isCurrentlyLiked;
                post.value.likes = postData.likes;
                console.error('Like operation failed:', error);
                throw error;
            }
        }
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        alert('Failed to like/unlike the post. Please try again.');
    }
}

</script>


<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.backdrop {
    display: flex;
    width: 100vw;
    justify-content: space-between;
    align-items: flex-start;
    margin: auto;
    background: url("../../assets/backdrop.png");
    background-size: cover;
    /* Changed from 'contain' to 'cover' */
    background-repeat: no-repeat;
    background-position: center;
    /* Added for better positioning */
    min-height: 100vh;
    flex-direction: column;
}

.post-container {
    width: 75%;
    /* max-width: 800px; */
    margin: 2rem auto;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.titleAndContent{
    padding-left: 4rem;
}

.post-header {
    padding: 2.5rem 3rem;
    padding-bottom: 1rem;
    background: linear-gradient(135deg, var(--primary-color), #FFE5B4);
    position: relative;
}

.author-section {
    display: flex;
    align-items: center;
}

.profile-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.author-info {
    margin-left: 1rem;
}

.author-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);
}

.date {
    font-size: 0.9rem;
    color: rgba(74, 74, 74, 0.8);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.post-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-color);
    line-height: 1.3;
}

.post-content {
    padding: 1rem 3rem;
}

.content-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-color);
    margin-bottom: 2rem;
}

.interaction-section {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
    padding: 1rem 0;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.likes-comments {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: auto;
}

.btn-like,
.btn-comment {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 50px;
    /* Changed from 8px to 50px for pill shape */
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    color: var(--text-color);
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

.comments-section {
    margin-top: 3rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 2rem;
}

.comment-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background: rgba(255, 238, 173, 0.3);
    border-radius: 12px;
    transition: transform 0.2s ease;
}

.comment-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.comment-header {
    display: flex;
    gap: 1rem;
}

.comment-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.username {
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
}

.timestamp {
    font-size: 0.85rem;
    color: #6c757d;
    margin: 0;
}

.comment-content {
    color: var(--text-color);
    line-height: 1.6;
}

.comment-form {
    background: rgba(255, 238, 173, 0.2);
    padding: 2rem;
    border-radius: 12px;
    margin-top: 2rem;
}

.form-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 1.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.comment-input {
    width: 100%;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 1rem;
    resize: vertical;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.comment-input:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(150, 206, 180, 0.2);
}

.btn-submit {
    align-self: flex-end;
    padding: 0.75rem 2rem;
    background: var(--secondary-color);
    background-color: white;
    color: #FF7043;
    border: none;
    border-radius: 9999px !important;
    /* Changed from 8px to 50px for pill shape */
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-submit:hover {
    background: #FF7043;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* Added subtle shadow on hover */
}

.btn-submit:disabled {
    background: #cccccc;
    color: white;
    cursor: not-allowed;
    transform: none;
    opacity: 0.7;
    /* Added opacity for better disabled state visibility */
}



.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(150, 206, 180, 0.2);
    border-top-color: var(--secondary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .post-container {
        margin: 1rem;
        border-radius: 12px;
    }

    .post-header {
        padding: 1.5rem;
    }

    .post-title {
        font-size: 1.8rem;
    }

    .post-content {
        padding: 1.5rem;
    }

    .content-text {
        font-size: 1rem;
    }

    .interaction-section {
        flex-wrap: wrap;
    }

    .btn-like,
    .btn-comment {
        flex: 1;
        justify-content: center;
    }

    .comment-form {
        padding: 1.5rem;
    }
}
</style>