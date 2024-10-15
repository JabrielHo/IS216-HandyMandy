<script setup lang="ts"></script>

<template>
  <footer class="footer pt-4 pb-5">
    <div class="container">
      <div class="row align-items-center">
        <!-- Logo -->
        <div class="col-12 col-md-4 text-center text-md-start mb-2 mb-md-0">
          <h2 class="footer-logo">HandyMandy</h2>
        </div>

        <!-- Navigation links -->
        <div class="col-12 col-md-8">
          <nav class="d-flex justify-content-center justify-content-md-end">
            <a href="#" class="footer-link mx-3">Join Us Today</a>
            <a href="#" class="footer-link mx-3">Our Services</a>
            <a href="#" class="footer-link mx-3">Our Location</a>
          </nav>
        </div>
      </div>

      <!-- Indicator section -->
    </div>
  </footer>
</template>

<!-- <script>
export default {
  name: 'foot_er'
}
</script> -->

<style scoped>
/* styles.css */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.footer {
  background: linear-gradient(to right, #ffcccc, #ccffff);
}

.footer-logo {
  font-size: 24px;
}

.footer-link {
  font-weight: bold; /* Bold text */
  text-decoration: none;
  color: black;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 767px) {
  .footer-logo {
    margin-bottom: 10px;
  }
}
</style>
