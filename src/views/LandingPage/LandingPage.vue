<script setup lang="ts">
import TheWelcome from '../../components/LandingPage/TheWelcome.vue'
import spinner from '../../components/LandingPage/spinner.vue'
import carousel from '@/components/LandingPage/carousel.vue'
</script>

<template>
  <main class="maincontainer">
    <TheWelcome />
    <spinner />
    <carousel />
    <div class="container-fluid py-5 forumcontainer">
      <div class="row">
        <!-- Left section with two rows -->
        <div class="col-md-6 ps-5">
          <div class="mb-4">
            <h1 class="display-4">Forum Page</h1>
          </div>
          <div>
            <p class="text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut.
            </p>
          </div>
        </div>

        <!-- Right section with the button -->
        <div
          class="col-md-6 d-flex align-items-center justify-content-center justify-content-md-center"
        >
          <button class="btn btn-primary btn-lg pl-3">Discover your community</button>
        </div>
      </div>
    </div>

    <div class="container-fluid py-5 volunteercontainer">
      <div class="row">
        <div
          class="col-md-6 d-flex align-items-center justify-content-center justify-content-md-center"
        >
          <button class="btn btn-primary btn-lg pl-3">Be a volunteer today</button>
        </div>
        <div class="col-md-6 ps-5">
          <div class="mb-4">
            <h1 class="display-4">Start helping the community today.</h1>
          </div>
          <div>
            <p class="text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut.
            </p>
          </div>
        </div>

        <!-- Right section with the button -->
      </div>
    </div>
  </main>
</template>

<style scoped>
.forumcontainer {
  background-color: rgb(244, 172, 139);
}

.volunteercontainer {
  background-color: rgb(144, 229, 248);
}

.maincontainer {
  margin: 0 !important;
}
</style>
