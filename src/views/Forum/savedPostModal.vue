<template>
    <div v-if="show" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-bookmark"></i>
            Saved Posts ({{ posts.length }})
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="posts.length > 0" class="saved-posts-container">
            <div v-for="post in posts" :key="post.id" 
                 class="saved-post-item mb-3 p-3 border rounded hover:bg-gray-50" 
                 @click="handlePostClick(post.id)">
              <div class="d-flex align-items-start gap-3">
                <img :src="post.userImage || 'default-profile.png'" 
                     alt="User profile" 
                     class="user-image"
                     style="width: 40px; height: 40px; border-radius: 50%;" />
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ post.title }}</h6>
                  <p class="mb-2 text-muted small">{{ truncateContent(post.content) }}</p>
                  <div class="d-flex align-items-center gap-3">
                    <span class="text-muted small">By {{ post.username }}</span>
                    <span class="text-muted small">
                      <i class="bi bi-heart-fill"></i> {{ post.likes }}
                    </span>
                    <span class="text-muted small">
                      <i class="bi bi-chat-fill"></i> {{ post.comments }}
                    </span>
                  </div>
                  <span class="badge bg-secondary mt-2">{{ post.category }}</span>
                </div>
                <button class="btn btn-outline-danger btn-sm" 
                        @click.stop="$emit('unsave-post', post.id)">
                  <i class="bi bi-bookmark-x"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-muted">
            No saved posts yet
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    show: Boolean,
    posts: {
      type: Array,
      default: () => []
    }
  });
  
  const emit = defineEmits(['close', 'unsave-post', 'view-post']);
  
  const truncateContent = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };
  
  const handlePostClick = (postId) => {
    emit('view-post', postId);
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  }
  
  .modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .modal-body {
    padding: 1rem;
    overflow-y: auto;
  }
  
  .saved-posts-container {
    max-height: calc(80vh - 120px);
    overflow-y: auto;
  }
  
  .saved-post-item {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .saved-post-item:hover {
    background-color: #f8f9fa;
  }
  </style>