<script setup lang="ts">
// You can add any required imports here
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Logo and Description -->
      <div class="footer-brand">
        <h2 class="footer-logo">HandyMandy</h2>
        <p class="footer-tagline">Your trusted partner in home solutions</p>
      </div>

      <!-- Navigation Links -->
      <nav class="footer-nav">
        <div class="nav-group">
          <h3 class="nav-title">Quick Links</h3>
          <router-link to="/register" class="nav-link footer-link" active-class="active"
            >Join Us Today</router-link
          >
          <router-link to="/services" class="nav-link footer-link" active-class="active"
            >Our Services</router-link
          >
          <a
            href="https://www.google.com.sg/maps/place/Singapore+Changi+Airport/@1.3513098,103.965973,14z/data=!3m2!4b1!5s0x31da17969b92192d:0x26b7e4dc37bb6d88!4m6!3m5!1s0x31da17d693d0cde3:0xd6d6dd5e414e4503!8m2!3d1.358604!4d103.9899436!16zL20vMDEydnN3?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"
            class="footer-link"
            >Our Location</a
          >
        </div>
      </nav>

      <!-- Spacing -->
      <div class="footer-cta"></div>
    </div>

    <!-- Copyright Bar -->
    <div class="footer-bottom">
      <p>&copy; 2024 HandyMandy. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, rgba(222, 250, 231, 0.95), rgba(255, 173, 96, 0.95));
  padding: clamp(2rem, 4vw, 4rem) 0 0 0;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  width: min(95%, 1400px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(2rem, 4vw, 4rem);
  padding: 0 clamp(1rem, 3vw, 2rem);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  font-size: clamp(1.5rem, 3vw + 1rem, 2.5rem);
  font-weight: 700;
  color: #2a4338;
  margin: 0;
}

.footer-tagline {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
  color: #2a4338;
  opacity: 0.8;
  margin: 0;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-title {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
  color: #2a4338;
  margin: 0;
  font-weight: 600;
}

.footer-link {
  color: #2a4338;
  text-decoration: none;
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
  transition: all 0.3s ease;
  width: fit-content;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #8a5a00;
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

.footer-cta {
  display: flex;
  align-items: flex-start;
}

.cta-button {
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
  background-color: #8a5a00;
  color: white;
  border: none;
  border-radius: clamp(0.25rem, 0.5vw, 0.5rem);
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #6d4700;
  transform: translateY(-2px);
}

.footer-bottom {
  margin-top: clamp(2rem, 4vw, 4rem);
  padding: 1rem;
  text-align: center;
  background-color: rgba(42, 67, 56, 0.1);
  color: #2a4338;
  font-size: clamp(0.75rem, 1vw + 0.5rem, 0.875rem);
}

/* Touch device optimizations */
@media (hover: none) {
  .cta-button:hover {
    transform: none;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .footer-content {
    text-align: center;
    gap: 2rem;
  }

  .footer-brand,
  .nav-group {
    align-items: center;
  }

  .footer-cta {
    justify-content: center;
  }

  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .footer {
    background: linear-gradient(135deg, rgba(34, 51, 41, 0.95), rgba(138, 90, 0, 0.95));
  }

  .footer-logo,
  .footer-tagline,
  .nav-title,
  .footer-link,
  .footer-bottom {
    color: #e0f5e9;
  }

  .footer-bottom {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .footer-link::after,
  .cta-button {
    transition: none;
  }
}
</style>
