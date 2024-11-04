<template>
  <div class="page-container yellowbg">
    <div class="container">
      <!-- Title Section -->
      <h1 class="page-title">Plumbing Services</h1>
      
      <!-- Profile Section -->
      <section class="profile-section">
        <img :src="profileImage" alt="Profile of John Doe" class="profile-pic">
        <div class="profile-info">
          <h2><a href="personalProfile_ExternalPOV" class="name">John Doe</a></h2>
          <p class="star-rating">★★★★☆</p>
        </div>
      </section>

      <!-- Carousel Section -->
      <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="./images/PlumbingCarousel1.avif" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="./images/PlumbingCarousel2.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="./images/PlumbingCarousel3.jpg" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <!-- What's Included Section -->
      <section class="included-section">
        <h2>What's Included</h2>
        <ul class="included-list">
          <li>Comprehensive leak inspection and repair</li>
          <li>Pipe replacement and installation</li>
          <li>Drain cleaning and unclogging</li>
          <li>Water heater installation and maintenance</li>
          <li>24/7 emergency services</li>
        </ul>
      </section>

      <!-- Qualifications and Reviews Section -->
      <div class="qualifications-reviews">
        <!-- Qualifications -->
        <section class="qualifications-section">
          <h2>Qualifications</h2>
          <ul>
            <li>Licensed and insured plumber</li>
            <li>10+ years of experience in residential and commercial plumbing</li>
            <li>Specialized in leak repair, pipe installation, and maintenance</li>
            <li>Certified in eco-friendly plumbing solutions</li>
          </ul>
        </section>

        <!-- Reviews Section -->
        <section class="reviews-section">
          <h2>Customer Reviews</h2>
          <ul>
            <li>"John was prompt and professional, fixing our leak quickly!" - John D.</li>
            <li>"Excellent service and very knowledgeable. Highly recommend!" - Sarah L.</li>
            <li>"Reliable and efficient, John is my go-to plumber." - Mike R.</li>
            <li>"Friendly and provided a lasting solution for our drainage issues." - Emily K.</li>
          </ul>
        </section>
      </div>

      <!-- Bottom Book Now Button -->
      <button class="book-button bottom-button" @click="bookNow">Book Now</button>
    </div>
  </div>
</template>

<script>
import profilepic from './images/profilepic.png';

export default {
  name: 'PlumbingServices',
  data() {
    return {
      profileImage: profilepic,
      carouselImages: [
        './images/PlumbingCarousel1.avif', // Replace with actual image paths
        './images/PlumbingCarousel_2.jpeg',
        './images/PlumbingCarousel_3.jpeg'
      ]
    };
  },
  methods: {
    bookNow() {
      alert("Booking functionality will be implemented soon!");
    }
  }
};
</script>

<style scoped>
/* Main Container */
.yellowbg {
  padding: 5% 10%;
  display: flex;
  align-items: center;
  background: url('../../assets/backdrop.png');
  background-size: cover;
  background-position: bottom; /* Anchors background to the bottom */
  min-height: 37rem;
}
.name {
  color: #6e4824;
}
.page-container {
  background-color: #FFEEAD;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  color: #6e4824;
  font-size: 2em;
  margin-bottom: 20px;
}

/* Profile Section */
.profile-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.profile-info h2 {
  font-size: 1.5em;
  color: #6e4824;
}

.star-rating {
  font-size: 1.2em;
  color: gold;
}

/* Carousel Section */
.carousel-section {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.carousel img {
  width: 80%;
  border-radius: 8px;
  margin: 0 5px;
}

/* What's Included Section */
.included-section {
  background-color: #fff3d4;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
}

.included-section h2 {
  color: #6e4824;
  font-size: 1.5em;
  margin-bottom: 10px; /* Add margin below the title */
}

.included-list {
  list-style-type: none;
  padding: 0;
  color: #6e4824;
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 10px; /* Ensure space below the list */
}

.included-list li::before {
  content: "✔";
  color: #96CEB4;
  padding-right: 10px;
  font-weight: bold;
}

/* Book Now Button */
.book-button {
  padding: 10px 20px;
  background-color: #FFAD60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.book-button:hover {
  background-color: #FFAD30;
}

.bottom-button {
  display: block;
  margin: 20px auto;
  width: 100%;
}

/* Qualifications and Reviews Section */
.qualifications-reviews {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.qualifications-section,
.reviews-section {
  background-color: #fff3d4;
  border-radius: 10px;
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  max-height: 200px;
}

.qualifications-section h2,
.reviews-section h2 {
  color: #6e4824;
  font-size: 1.3em;
  margin-bottom: 10px;
}

.qualifications-section ul,
.reviews-section ul {
  list-style-type: none;
  padding: 0;
  color: #6e4824;
}

.reviews-section ul li::before {
  content: "★";
  color: gold;
  font-size: 1.1em;
  margin-right: 5px;
}
</style>
