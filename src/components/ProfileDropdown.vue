<!-- ProfileDropdown.vue -->
<template>
  <div class="profile-dropdown">
    <div class="dropdown">
      <button class="profile-button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <img
          :src="
            profileImage ||
            'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='
          "
          alt="Profile"
          class="profile-image"
        />
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <router-link :to="`/personalProfile`" class="dropdown-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="me-2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </router-link>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <router-link to="/inbox" class="dropdown-item">
            <i class="fa fa-inbox me-2" aria-hidden="true"></i>Inbox
          </router-link>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <button
            class="dropdown-item text-danger"
            data-bs-toggle="modal"
            data-bs-target="#logoutModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="me-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  profileImage: {
    type: String,
    default: null
  }
})


</script>

<style scoped>
.profile-dropdown {
  margin-left: 0.75rem;
}

.profile-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e0e0e0;
  transition: border-color 0.2s ease;
}

.profile-image:hover {
  border-color: #ff8e53;
}

.dropdown-menu {
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  color: #2d2d2d;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #fff8f0;
}

.dropdown-item.text-danger {
  color: #dc3545;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
}

.dropdown-divider {
  margin: 0.2rem 0;
  border-color: #f0f0f0;
}
</style>
