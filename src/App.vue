<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/navbar.vue'
import foot_er from './components/foot_er.vue'
</script>

<template>
  <Navbar />
  <RouterView class="main" />
  <foot_er />
</template>

<style scoped></style>
