<script setup>
import { ref } from 'vue'

const n = 8
const cards = ref(Array(n).fill({}))
</script>

<template>
  <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6" v-for="(card, index) in cards" :key="index">
    <div class="card placeholder-card">
      <div class="placeholder-glow">
        <div class="placeholder w-100" style="height: 200px"></div>
      </div>
      <div class="card-body">
        <div class="userInfo">
          <div class="placeholder-img rounded-circle me-2"></div>
          <div class="placeholder-text name"></div>
        </div>
        <hr />
        <div class="placeholder-badge title mb-2 me-1"></div>
        <div class="placeholder-text title"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.placeholder-card {
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

.card-body {
  padding: 16px;
}

.userInfo {
  display: flex;
  align-items: center;
}
</style>