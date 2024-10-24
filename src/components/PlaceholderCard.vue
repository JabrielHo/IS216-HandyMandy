<script setup>
import { ref } from 'vue'

const n = 12
const cards = ref(Array(n).fill({}))
</script>

<template>
  <div class="col-xl-3 col-lg-3 col-md-6 pt-4" v-for="(card, index) in cards" :key="index">
    <div class="card placeholder-card">
      <div class="userInfo">
        <div class="placeholder-img rounded-circle me-2"></div>
        <div class="placeholder-text name"></div>
      </div>
      <div class="card-body">
        <div class="placeholder-badge mb-2 me-1"></div>
        <div class="placeholder-text title"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.placeholder-card {
  padding: 8px;
  margin-bottom: 16px;
}

.placeholder-img {
  background-color: #e0e0e0;
  width: 40px;
  height: 40px;
}

.placeholder-text {
  background-color: #e0e0e0;
  height: 20px;
  width: 100px;
}

.placeholder-badge {
  background-color: #e0e0e0;
  height: 20px;
  width: 60px;
}

.title {
  width: 80%;
}

.card {
  padding: 8px;
  margin-bottom: 16px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.2);
}

.card-body {
  margin-top: 8px;
  padding-bottom: 0;
}

.userInfo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.name {
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}
</style>