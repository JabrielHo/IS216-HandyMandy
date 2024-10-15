<template>
  <div class="bgc p-4">
    <div class="slider">
      <div v-for="(item, index) in slides" :key="index" class="px-2">
        <div class="card">
          <img :src="item.image" :alt="item.alt" class="card-img-top" />
          <div>
            <h5 class="card-title">{{ item.alt }}</h5>
            <p class="card-text">{{ item.caption }}</p>
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
    image: 'https://via.placeholder.com/300x200?text=Slide+1',
    alt: 'Slide 1',
    caption: 'This is the first slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+2',
    alt: 'Slide 2',
    caption: 'This is the second slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+3',
    alt: 'Slide 3',
    caption: 'This is the third slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+4',
    alt: 'Slide 4',
    caption: 'This is the fourth slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+1',
    alt: 'Slide 5',
    caption: 'This is the fifth slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+2',
    alt: 'Slide 6',
    caption: 'This is the sixth slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+3',
    alt: 'Slide 7',
    caption: 'This is the seventh slide'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Slide+4',
    alt: 'Slide 8',
    caption: 'This is the eight slide'
  }
])

onMounted(() => {
  $('.slider').slick({
    dots: true, // Show dot indicators
    infinite: false, // Infinite looping
    speed: 300, // Animation speed
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 4, // Number of slides to scroll
    autoplay: false, // Enable autoplay
    autoplaySpeed: 2000, // Autoplay speed
    arrows: true // Enable next/prev arrows
  })
})

// arrow[0].style.color
</script>

<style>
.bgc {
  background-color: antiquewhite;
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
  /* color: black; Ensure arrows are visible */
  z-index: 999999; /* Ensure arrows are above other elements */
}

.slick-prev:before,
.slick-next:before {
  color: black !important;
}
</style>
