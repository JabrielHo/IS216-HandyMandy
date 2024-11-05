<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" integrity="sha384-9ndCyUa8Csi5SAWBJ6ZqT6bD6SpMimFzOYfKWjDMSTLVd54mtzU6r4p98wqlFZ6B" crossorigin="anonymous"></link>
<template>
  <div class="page-container yellowbg">
    <div class="container">
      <!-- Title Section -->
     
    
      <h1 class="page-title">Fix my Phone</h1>

      <!-- Carousel Section -->
      <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="./images/broken_phone.webp" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="./images/broken_phone2.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="./images/broken_phone3.jpg" class="d-block w-100" alt="...">
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
      <section class="description-section">
        <h2>Description of Issue</h2>
        <ul class="description-list">
          <li>My phone has a cracked screen and it no longer powers on. I'm looking for help with screen replacement and diagnostic repair. Any guidance or assistance with fixing these issues would be appreciated.</li>
          <li>I will provide the materials needed to fix my phone. Just let me know what I need to get to fix the phone.</li>
        </ul>
        <br>
        <h2>Location</h2>
        <span style="color: #6e4824;">123 Yishun Avenue 9, #12-345
        Singapore 760123</span>
      </section>

   

      <!-- Bottom Book Now Button -->
      <button class="book-button bottom-button" @click="bookNow">Chat with John</button>
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
  background-color: #FFffff;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  color: #6e4824;
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

/* Profile Section */
.profile-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #fff8e6;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #c6b4a2;
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
.description-section {
  background-color: #fff8e6;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  border: 2px solid #c6b4a2;
}

.description-section h2 {
  color: #6e4824;
  font-size: 1.5em;
  margin-bottom: 10px; 
  font-weight: bold;
}

.description-list {
  padding-left: 20px;
  color: #6e4824;
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 10px; /* Ensure space below the list */
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
  border: 2px solid #c6b4a2;
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
