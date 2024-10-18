<script setup lang="ts">
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
const posts = [
  {
    id: 1,
    username: 'Kelyn',
    location: 'Simei',
    time: '5 hours ago',
    userImage: 'path_to_image',
    title: 'How can I post a request for help?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    likes: 10,
    dislikes: 1,
    comments: 20
  }
  // Add more post objects here
];
</script>

<template>
  <main class="backdrop">
    <!-- You can add your components here -->

    <div class="card-container">
      <div class="card" v-for="post in posts" :key="post.id">
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
          <span><i class="fas fa-thumbs-up"></i> {{ post.likes }}</span>
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
  background-image: url('IMG_0234.jpeg');
  /* Path to your image */
  background-size: cover; /* Make the image cover the whole area */
  background-position: center; /* Center the image */
  width: 100vw; /* Cover the full width of the viewport */
  min-height: 100vh; /* Ensure the background takes the full viewport height */
  display: flex; /* Allows better layout positioning if needed */
  flex-direction: column; /* Adjust to your needs */
  justify-content: center; /* Centers content vertically */
  align-items: center; /* Centers content horizontally */
  overflow: hidden; /* Prevents overflow in case of content */
}

.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  /* space between cards */
  padding: 20px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  padding: 20px;
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
  justify-content: space-between;
  font-size: 16px;
  color: gray;
}

.card-footer span {
  display: flex;
  align-items: center;
}

.card-footer i {
  margin-right: 5px;
}
</style>
