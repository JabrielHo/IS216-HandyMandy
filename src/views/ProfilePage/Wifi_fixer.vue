<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" integrity="sha384-9ndCyUa8Csi5SAWBJ6ZqT6bD6SpMimFzOYfKWjDMSTLVd54mtzU6r4p98wqlFZ6B" crossorigin="anonymous"></link>
<template>
  <div class="page-container yellowbg">
    <div class="container">
      <!-- Title Section -->
      <h1 class="page-title">Wifi Fixing</h1>
      
      <!-- Profile Section -->
      <section class="profile-section">
        <img :src="profileImage" alt="Profile of John Doe" class=" profile-pic">
        <div class="profile-info">
          <h2><a href="personalProfile_ExternalPOV" class="name">John Doe</a></h2>
          <p class="star-rating">★★★★☆ <span style="color: #6e4824; font-size: 16px;">(20 reviews)</span></p>
          <p style="color: #6e4824;"> About me: Reliable handyman with a strong eye for detail and years of experience tackling a wide range of home repairs and improvements. From plumbing and electrical work to general maintenance, I’m here to make your home projects hassle-free and done right the first time. Book now for quality service you can trust! </p>
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
            <img src="./images/wifi_fixing1.webp" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="./images/wifi_fixing2.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="./images/wifi_fixing3.jpg" class="d-block w-100" alt="...">
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
    <li>Wi-Fi network setup and optimization</li>
    <li>Router and modem installation and configuration</li>
    <li>Signal strength analysis and range extension</li>
    <li>Troubleshooting connectivity issues</li>
    <li>24/7 support for Wi-Fi-related emergencies</li>
  </ul>
</section>

<!-- Qualifications and Reviews Section -->
<div class="qualifications-reviews">
  <!-- Qualifications -->
  <section class="qualifications-section">
    <h2>Qualifications</h2>
    <ul>
      <li>Certified network technician with 5+ years of experience</li>
      <li>Specialized in residential and commercial Wi-Fi solutions</li>
      <li>Experienced in troubleshooting and optimizing network performance</li>
      <li>Trained in the latest Wi-Fi technology and security standards</li>
    </ul>
  </section>

  <!-- Reviews Section -->
  <section class="reviews-section">
    <h2>Customer Reviews</h2>
    <ul>
      <li>"John quickly diagnosed and fixed our Wi-Fi issues—now our entire house has strong coverage!" - Alex R.</li>
      <li>"Professional and knowledgeable. Set up our home network in no time!" - Lisa P.</li>
      <li>"Excellent service. John helped us extend our Wi-Fi range seamlessly." - Michael T.</li>
      <li>"Reliable and efficient. Great experience with a true Wi-Fi expert!" - Rachel K.</li>
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
  background-color: #fff8e6;
  padding: 20px;
  border-radius: 10px;
}


.profile-pic {
  width: 150px;
  height: 150px;
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
  background-color: #fff8e6;
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
  background-color: #fff8e6;
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
