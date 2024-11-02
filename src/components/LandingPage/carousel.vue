<template>
  <div class="backgroundcard p-4 d-flex flex-column">
    <div class="textcontainer">
      <span class="display-4">Popular Services</span>
    </div>
    <div class="roundedcard">
      <div class="slider">
        <div
          v-for="(item, index) in slides"
          ref="cardRefs"
          @mouseover="onMouseEnter($event)"
          @mouseleave="onMouseLeave($event)"
          :key="index"
          class="px-2 maincard"
        >
          <div class="card" :style="{ backgroundImage: 'url(' + item.image + ')' }">
            <div class="titlecontainer">
              <h5 class="cardtitle text-center">{{ item.alt }}</h5>
            </div>
            <div class="card-content">
              <!-- Optional: Add more content here if needed -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import $ from 'jquery'
import 'slick-carousel'

const slides = ref([
  {
    image:
      'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Electrical',
    caption: 'This is the first slide'
  },
  {
    image:
      'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Air-Con',
    caption: 'This is the second slide'
  },
  {
    image:
      'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Plumbing',
    caption: 'This is the third slide'
  },
  {
    image:
      'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Repair',
    caption: 'This is the fourth slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+1',
    alt: 'Installation',
    caption: 'This is the fifth slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+2',
    alt: 'Painting',
    caption: 'This is the sixth slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+3',
    alt: 'Gardening',
    caption: 'This is the seventh slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+4',
    alt: 'Cleaning',
    caption: 'This is the eight slide'
  }
])

const cardRefs = ref([])

const onMouseEnter = (event) => {
  const card = event.currentTarget.querySelector('.card')
  console.log('hi')
  if (card) {
    card.style.transform = 'scale(1)'
    card.style.transition = 'transform 0.3s ease' // Smooth transition
  }
}

const onMouseLeave = (event) => {
  const card = event.currentTarget.querySelector('.card')
  if (card) {
    card.style.transform = 'scale(0.9)'
  }
}

onMounted(() => {
  $('.slider').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  })
})
</script>

<style>
.backgroundcard {
  display: flex;
}

.roundedcard {
  padding-top: 2vw; /* Padding inside the div */
  width: 100%; /* Allow it to grow */
}

.textcontainer {
  text-align: left; /* Aligns text within the container */
  display: flex; /* Enables control over alignment */
  justify-content: flex-start; /* Aligns content to the left */
  padding-left: 10%;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
  background-color: #ffad60; /* Fallback color */
  background-size: cover; /* Ensure background image covers the card */
  background-position: center; /* Center the image */
  height: 20vw; /* Set a height for the card */
  position: relative; /* Position relative to allow absolute children */
  border-radius: 10px; /* Optional: round the corners */
  transform: scale(0.9);
}

.maincard {
  padding-top: 50px;
}

.cardtitle {
  font-size: 2vw;
  margin: 0; /* Remove default margin */
  color: #fff; /* Ensure text is visible */
}

.titlecontainer {
  position: absolute; /* Position absolutely within the card */
  top: -30px; /* Adjust the position to move it above the card */
  left: 50%; /* Center it horizontally */
  transform: translateX(-50%); /* Adjust to center */
  background-color: #a66e38; /* Semi-transparent background */
  border-radius: 30px; /* Optional rounded corners */
  padding: 1vw;
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow */
  z-index: 1; /* Ensure it’s above the card */
  width: 90%;
}

.slider {
  width: 80%; /* Adjust width as needed */
  margin: 0 auto; /* Center the slider */
  position: relative; /* Add this to contain the arrows */
}

.slick-prev,
.slick-next {
  position: absolute; /* Position arrows absolutely */
  top: 50%; /* Center them vertically */
  transform: translateY(-50%); /* Adjust vertical alignment */
  z-index: 999999; /* Ensure arrows are above other elements */
}

.slick-prev:before,
.slick-next:before {
  color: black !important;
}
</style>
