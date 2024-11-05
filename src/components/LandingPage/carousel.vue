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
          <RouterLink :to="`/services/${item.service}`">
            <div class="card" :style="{ backgroundImage: 'url(' + item.image + ')' }">
              <div class="titlecontainer">
                <h5 class="cardtitle text-center">{{ item.alt }}</h5>
              </div>
              <div class="card-content">
                <!-- Add more content here if needed -->
              </div>
            </div>
          </RouterLink>
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
    image: 'https://pluggedinatl.com/wp-content/uploads/2021/06/iStock-1025303196-scaled.jpg',
    alt: 'Electrical',
    caption: 'This is the first slide',
    service: 'Electrical'
  },
  {
    image: 'https://www.socool.sg/wp-content/uploads/2022/11/Ac-service-3-2-1080x675.jpg',
    alt: 'Air-Con',
    caption: 'This is the second slide',
    service: 'Aircon'
  },
  {
    image: 'https://hw-singaporeplumbing.com.sg/wp-content/uploads/2018/12/sanitary-repair.png',
    alt: 'Plumbing',
    caption: 'This is the third slide',
    service: 'Plumbing'
  },
  {
    image:
      'https://megafurniture.sg/cdn/shop/articles/the-top-5-refrigerator-singapore-repair-services-review-megafurniture.png?v=1721303860&width=1200',
    alt: 'Repair',
    caption: 'This is the fourth slide',
    service: 'Repair'
  },
  {
    image: 'https://www.ikea.com/ext/ingkadam/m/7c8d0ce75bda3d21/original/PH186193-crop001.jpg?f=s',
    alt: 'Installation',
    caption: 'This is the fifth slide',
    service: 'Installation'
  },
  {
    image: 'https://www.paintingservicesingapore.sg/wp-content/uploads/2020/12/67766.jpg',
    alt: 'Painting',
    caption: 'This is the sixth slide',
    service: 'Painting'
  },
  {
    image: 'https://www.helpling.com.sg/wp-content/uploads/2023/06/Helpling-gardening_bg.webp',
    alt: 'Gardening',
    caption: 'This is the seventh slide',
    service: 'Gardening'
  },
  {
    image: 'https://cleanlab.com.sg/wp-content/uploads//House-cleaning.jpg',
    alt: 'Cleaning',
    caption: 'This is the eight slide',
    service: 'Cleaning'
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

<style scoped>
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
  color: black !important;
}

.slick-prev:before,
.slick-next:before {
  color: black !important;
}
</style>
