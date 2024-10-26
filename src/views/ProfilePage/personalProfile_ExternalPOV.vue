<template>
  <div class="center">
    <h1>John Doe</h1>
    <p>**** Ratings and Reviews</p>
  </div>

  <h2 style="margin-left: 10px;">John's services</h2>
  <div class="services-container">
    <div class="angled-rectangle">
      <button><a href="plumbing.vue">Plumbing</a></button>
    </div>

    <div class="angled-rectangle">
      <button>Wifi Fixer</button>
    </div>

    <div class="angled-rectangle">
      <button>Furniture Assembly</button>
    </div>


  </div>

  <h2 style="margin-left: 10px;">John's Requests</h2>
  <div class="request-container">
    <div class="angled-rectangle">
      <button>Help me fix my phone</button>
    </div>
    <div class="angled-rectangle">
      <button>Help me paint my room</button>
    </div>

  </div>

  <h2 style="margin-left: 10px;">John's Reviews</h2>
  <div class="review-container">
    <div class="angled-rectangle">
      <button>Great Work!</button>
    </div>
    <div class="angled-rectangle">
      <button>Very Reliable</button>
    </div>
    <div class="angled-rectangle" style="width:min-content;">
      <button>Highly Recommended</button>
    </div>
    <div class="angled-rectangle">
      <button>Professional Service</button>
    </div>

  </div>
</template>

<script>
export default {
  name: "personalProfile_ExternalPOV",
  setup() {}
};
</script>

<style scoped>
.center {
  text-align: center;
}

.services-container, .request-container, .review-container {
  display: flex;              /* Use Flexbox to align children */
  justify-content: left;       /* Align rectangles to the left */
  align-items: center;         /* Center the rectangles vertically */
}

.angled-rectangle {
  width: 100px;
  height: 80px;
  background-color: #aff3ff;   /* Light color */
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%);
  margin: 20px;                /* Margin between rectangles */
  display: flex;
  justify-content: center; 
  align-items: center;     
  text-align: center;
}

.angled-rectangle button {
  width: 100%;                 /* Ensure button fills the rectangle */
  height: 100%;                /* Ensure button takes full height */
  background-color: transparent;
  border: none;                /* Remove button borders */
  font-size: 15px; 
  font-weight: bold;
  cursor: pointer;
}

.angled-rectangle button:hover {
  background-color: #8fe1ff;   /* Change background on hover */
}

a {
  color: black;
  text-decoration: none;
  font-weight: bold;
}
</style>
