<template>
    <div class="container">
      <!-- Left Column: Qualifications and What's Included -->
      <div class="left-column">
        <h1>John's Plumbing Services</h1>
  
        <h2>Qualifications</h2>
        <ul>
          <li>Licensed and insured plumber</li>
          <li>10+ years of experience in residential and commercial plumbing</li>
          <li>Specialized in leak repair, pipe installation, and maintenance</li>
          <li>Certified in eco-friendly plumbing solutions</li>
        </ul>
  
        <h2>What's Included</h2>
        <ul>
          <li>Comprehensive leak inspection and repair</li>
          <li>Pipe replacement and installation</li>
          <li>Drain cleaning and unclogging</li>
          <li>Water heater installation and maintenance</li>
          <li>24/7 emergency services</li>
        </ul>
      </div>
  
      <!-- Right Column: Image, Book Now Button, and Reviews -->
      <div class="right-column">
        <img :src="imageSrc" alt="Photo of John" class="profile-img" />
  
        <button class="book-button" @click="bookNow">Book Now</button>
  
        <div class="reviews">
          <h3>Customer Reviews</h3>
          <ul>
            <li v-for="review in reviews" :key="review">{{ review }}</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PlumbingService',
    data() {
      return {
        imageSrc: require('@/assets/profilepic.png'), // Updated image path
        reviews: [
          "“John was prompt and professional, fixing our leak quickly!” - John D.",
          "“Excellent service and very knowledgeable. Highly recommend!” - Sarah L.",
          "“Reliable and efficient, John is my go-to plumber.” - Mike R.",
          "“Friendly and provided a lasting solution for our drainage issues.” - Emily K."
        ]
      };
    },
    methods: {
      bookNow() {
        alert("Booking functionality will be implemented soon!"); // Replace with actual booking functionality
      }
    }
  };
  </script>
  
  <style scoped>
  /* Container for the entire layout */
  .container {
    display: flex;
    flex-direction: row;
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    font-family: Arial, sans-serif;
  }
  
  /* Left column for qualifications and what's included */
  .left-column {
    flex: 1;
    padding-right: 20px;
  }
  
  .left-column h1 {
    font-size: 2em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .left-column h2 {
    font-size: 1.5em;
    color: #333;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  .left-column ul {
    list-style-type: none;
    padding: 0;
    color: #666;
    font-size: 1em;
    line-height: 1.6;
  }
  
  .left-column ul li::before {
    content: "✔"; /* Tick icon for each item */
    color: #4CAF50;
    padding-right: 10px;
  }
  
  /* Right column for image and reviews */
  .right-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 300px;
  }
  
  .profile-img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
  }
  
  .book-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
    width: 100%;
  }
  
  .book-button:hover {
    background-color: #45a049;
  }
  
  .reviews {
    margin-top: 20px;
    text-align: left;
    width: 100%;
  }
  
  .reviews h3 {
    font-size: 1.3em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .reviews ul {
    list-style-type: none;
    padding: 0;
    color: #666;
    font-size: 0.9em;
  }
  
  .reviews ul li {
    margin-bottom: 10px;
    padding-left: 10px;
    position: relative;
  }
  
  .reviews ul li::before {
    content: "★";
    color: gold;
    font-size: 1.1em;
    position: absolute;
    left: 0;
  }
  </style>
  

