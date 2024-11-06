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

<style>
@import url('https://fonts.googleapis.com/css2?family=Acme&family=DynaPuff&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Quicksand:wght@495&display=swap');

body {
  font-family: 'Quicksand';
}
</style>
