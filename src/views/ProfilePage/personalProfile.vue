<template>
    <div class="center">
      <h1>John Doe</h1>
      <p>**** Ratings and Reviews</p>
    </div>

    <!-- <div style="width: 100%; height: 400px; background-image: ('profileBackground.avif') ; background-size: cover; background-position: center;"> -->
        <h2 style="margin-left: 10px;">Your services</h2>
  <div class="services-container">
    <div class="angled-rectangle">
      <p>Plumbing</p>
    </div>

    <div class="angled-rectangle">
      <p>Wifi Fixer</p>
    </div>

    <div class="angled-rectangle">
      <p>Furniture Assembly</p>
    </div>

    <div class="angled-rectangle">
      <p><h1>+</h1></p>
    </div>
  </div>

  <h2 style="margin-left: 10px;">Your Requests</h2>
    <div class="request-container">
      <div class="angled-rectangle">
        <p>Help me fix my phone</p>
      </div>
      <div class="angled-rectangle">
        <p>Help me paint my room</p>
      </div>
  
      
    <div class="angled-rectangle">
      <p><h1>+</h1></p>
    </div>

    </div>

    <h2 style="margin-left: 10px;">Your Reviews</h2>
    <div class="review-container">
      <div class="angled-rectangle">
        <p>Great Work!</p>
      </div>
      <div class="angled-rectangle">
        <p>Very Reliable</p>
      </div>
      <div class="angled-rectangle">
        <p>Highly Recommended</p>
      </div>
      <div class="angled-rectangle">
        <p>Professional Service</p>
      </div>
      
    <div class="angled-rectangle">
      <p><h1>+</h1></p>
    </div>
      
    </div>
  
  </template>
  



  <script>
  export default {
    name: "personalProfile",
    setup() {

    }
  };
  </script>
  <style scoped>
  .center {
  text-align: center;
}

.services-container, .request-container, .review-container {
  display: flex;              /* Use Flexbox to align children */
  justify-content: left;    /* Center the rectangles horizontally */
  align-items: center;        /* Center the rectangles vertically (if needed) */
}

.angled-rectangle {
  width: 100px;
  height: 80px;
  background-color: #aff3ff; /* Light color */
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%);
  margin: 20px;              /* Margin between rectangles */

  display: flex;
  justify-content: center; 
  align-items: center;     
  text-align: center;    
}

.angled-rectangle p {
  margin: 0; 
  font-size: 15px; 
  font-weight: bold;
}
</style>