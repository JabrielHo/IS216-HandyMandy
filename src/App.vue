<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/navbar.vue'
import foot_er from './components/foot_er.vue'
</script>

<template>
  <Navbar />
  <RouterView />
  <foot_er />
</template>

