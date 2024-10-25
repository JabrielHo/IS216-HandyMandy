<template>
    <article v-if="post" class="post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>

        <div class="likes">
            <button @click="likePost" class="fas fa-thumbs-up">Like</button>
            <span style="margin: 5px;">{{ likeCount }}</span>
        </div>

        <section class="comments-section">
            <div v-for="(comment, index) in comments" :key="index" class="comment">
                <p><strong>{{ comment.username }}</strong></p>
                <p>{{ comment.content }}</p>
                <p class="comment-time">{{ comment.timestamp.toDate().toLocaleString() }}</p>
            </div>
        </section>


        <section class="reply">
            <h3>Leave a Comment</h3>
            <textarea v-model="newCommentContent" placeholder="Write your comment..." rows="3"></textarea>
            <button @click="addComment">Submit</button>
        </section>
    </article>
    <p v-else>Loading post...</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 

const route = useRoute();
const postId = route.params.postId;
const post = ref(null);
const comments = ref([]); 

onMounted(async () => {
    await fetchPost();
    await fetchComments();
});

// Fetch the individual post
async function fetchPost() {
    try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
            post.value = { id: postDoc.id, ...postDoc.data() };
        } else {
            console.error('No such document!');
        }
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}

// Fetch comments where postID matches the current postId
async function fetchComments() {
    try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postID', '==', postId));
        const querySnapshot = await getDocs(q);

        const commentPromises = querySnapshot.docs.map(async (doc) => {
            const commentData = { id: doc.id, ...doc.data() };
            const username = await fetchUsername(commentData.userId); 
            return { ...commentData, username }; 
        });

        comments.value = await Promise.all(commentPromises);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Fetches username from the "users" collection in Firestore
async function fetchUsername(userId: string): Promise<string> {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data().username || 'Anonymous';
        } else {
            console.error('No username found for this user!');
            return 'Anonymous';
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        return 'Anonymous';
    }
}
</script>


<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background-color: #f4f4f9;
    color: #333;
}

/* Main Container */
.container-fluid {
    max-width: 1200px;
    margin: 20px auto;
    padding: 15px;
    background-color: #DFDEDE;
    border-radius: 10px;
}

/* Post Styles */
.post {
    border-radius: 10px;
    background-color: white;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 20px;
    font-size: 16px;
}

.post h2 {
    font-size: 28px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
}

.post p {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
}

/* Tags Styles */
.tags {
    margin-top: 15px;

}

.tag {
    display: inline-block;
    background-color: #007bff;
    color: white;
    padding: 7px 15px;
    margin-right: 8px;
    margin-bottom: 8px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 500;

}

.tag:hover {
    background-color: #0056b3;
}

/* Comments Section */
.comments-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.comments-section h3 {
    font-size: 20px;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 20px;
}

.comment {
    border-top: 1px solid #ddd;
    padding-top: 15px;
    margin-top: 15px;
}

.comment p {
    font-size: 14px;
    color: #555;
}

.comment-time {
    font-size: 12px;
    color: gray;
}

/* Reply Section */
.reply {
    margin-top: 30px;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
}

.reply h3 {
    font-size: 18px;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 10px;
}

textarea {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'Arial', sans-serif;
    resize: vertical;
}

button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #218838;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container-fluid {
        padding: 10px;
    }

    .post h2 {
        font-size: 24px;
    }

    .comments-section h3 {
        font-size: 18px;
    }

    button {
        width: 100%;
    }
}

/* ... (your existing styles) */

.likes {
    margin-top: 10px;
}

.likes button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
