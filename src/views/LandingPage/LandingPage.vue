<script setup lang="ts">
import TheWelcome from '../../components/LandingPage/TheWelcome.vue'
import spinner from '../../components/LandingPage/spinner.vue'
import carousel from '@/components/LandingPage/carousel.vue'
</script>

<template>
  <main class="maincontainer">
    <TheWelcome class="up" />
    <carousel />

    <!-- Forum Section -->
    <section class="container-section forum-section">
      <div class="content-wrapper">
        <div class="content-col">
          <h1 class="heading-primary">Forum</h1>
          <p class="description">
            Join our community of self-help scientists! Start by connecting with like-minded
            individuals.
          </p>
        </div>

        <div class="media-col">
          <div class="image-wrapper">
            <img
              src="../../assets/photo1.jpg"
              alt="Forum community"
              class="feature-image"
              loading="lazy"
            />
          </div>
          <button class="cta-button">Discover your community</button>
        </div>
      </div>
    </section>

    <div class="section-divider"></div>

    <!-- Volunteer Section -->
    <section class="container-section volunteer-section">
      <div class="content-wrapper">
        <div class="content-col">
          <h1 class="heading-primary">
            <span class="nowrap">Start helping</span>
            <span class="line-break">today</span>
          </h1>
          <p class="description">Be part of the volunteer group that is bigger than oneself!</p>
        </div>

        <div class="media-col">
          <div class="image-wrapper">
            <img
              src="../../assets/photo1.jpg"
              alt="Volunteer"
              class="feature-image"
              loading="lazy"
            />
          </div>
          <button class="cta-button">Be a volunteer</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Base styles */
.maincontainer {
  min-height: 100vh;
  background: url('../../assets/backdrop.png') black;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.up {
  position: relative;
  z-index: 1;
}

/* Container styles */
.container-section {
  margin: 2rem 10%; /* Added vertical margin */
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  width: auto; /* Changed from 100% to auto to respect margins */
  border-radius: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 1400px; /* Added max-width for very large screens */
}
.forum-section {
  background-color: rgba(222, 250, 231, 0.99);
  color: #2a4338;
  backdrop-filter: blur(10px);
}

.volunteer-section {
  background-color: #ffad60;
}

/* Layout */
.content-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
  align-items: center;
}

.content-col {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.media-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 2vw, 1.5rem);
}

/* Typography */
.heading-primary {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
  line-height: 1.2;
  font-weight: 700;
  word-wrap: break-word;
  hyphens: auto;
}

.description {
  font-size: clamp(1rem, 1vw + 0.5rem, 1.5rem);
  line-height: 1.6;
  font-weight: 300;
  opacity: 0.9;
  max-width: 65ch;
}

/* Images */
.image-wrapper {
  width: 100%;
  border-radius: clamp(0.5rem, 1vw, 1rem);
  overflow: hidden;
}

.feature-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 16/9;
  transition: transform 0.3s ease;
}

.feature-image:hover {
  transform: scale(1.02);
}

/* Buttons */
.cta-button {
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.25rem);
  background-color: #8a5a00;
  color: white;
  border: none;
  border-radius: clamp(0.25rem, 0.5vw, 0.5rem);
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  min-width: 200px;
  text-align: center;
}

.cta-button:hover {
  background-color: #6d4700;
  transform: translateY(-2px);
}

.section-divider {
  height: clamp(1rem, 3vw, 2rem);
}

.nowrap {
  white-space: nowrap;
}

.line-break {
  display: block;
}

/* Touch device optimizations */
@media (hover: none) {
  .feature-image:hover {
    transform: none;
  }

  .cta-button:hover {
    transform: none;
  }
}

/* Small screens */
@media (max-width: 480px) {
  .container-section {
    border-radius: 1rem;
    margin: 0.5rem auto;
  }

  .content-col {
    text-align: center;
  }

  .cta-button {
    width: 100%;
    min-width: unset;
  }

  .description {
    margin: 0 auto;
  }
}

/* Medium screens */
@media (min-width: 481px) and (max-width: 768px) {
  .content-col {
    text-align: center;
  }

  .description {
    margin: 0 auto;
  }
}

/* Large screens */
@media (min-width: 1400px) {
  .container-section {
    padding: 4rem 3rem;
  }

  .content-wrapper {
    gap: 3rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .forum-section {
    background-color: rgba(34, 51, 41, 0.95);
    color: #e0f5e9;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .feature-image,
  .cta-button {
    transition: none;
  }
}
</style>
