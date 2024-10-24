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
  },
  // Add more post objects here
  {
    id: 2,
    username: 'Alex',
    location: 'Dhoby Ghaut',
    time: '2 hours ago',
    userImage: 'path_to_image',
    title: 'Looking for recommendations!',
    content: 'Any good places to eat around here?',
    likes: 5,
    dislikes: 0,
    comments: 3
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  },
  {
    id: 3,
    username: 'Jamie',
    location: 'Orchard',
    time: '1 hour ago',
    userImage: 'path_to_image',
    title: 'Help with my project!',
    content: 'I need some assistance with coding...',
    likes: 15,
    dislikes: 2,
    comments: 10
  }
];

</script>

<template>
  <main class="backdrop">
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
</style>
