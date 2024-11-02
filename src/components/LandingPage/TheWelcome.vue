<template>
  <div class="yellowbg responsivescreen justify-content-around items-center">
    <!-- LEFT CONTAINER -->
    <div class="jumbo md:flex-column">
      <div class="flex-column">
        <h1 class="tagline font-bold text-gray-800">HandyMandy</h1>
        <p class="subtagline text-gray-600">Your Neighbourhood service provider</p>
      </div>
      <div :class="showWheel ? 'd-none' : 'd-inline'">
        <h1 class="text-primary mb-1 text-start">{{ selectedService }}</h1>
      </div>
      <div :class="showWheel ? 'input1' : 'input2'">
        <input
          type="text"
          v-model="typedService"
          class="input-group-text dropdown-toggle inputbox"
          @input="filterServices"
          placeholder="Find a service!"
          style="font-size: 2vw"
        />
      </div>

      <div :class="showWheel ? 'd-none' : 'd-inline'">
        <button type="button" @click="startWheel" class="btn d-none d-md-inline btncolor mt-2">
          Click to get started
        </button>
      </div>
    </div>

    <div :class="showWheel ? 'd-none' : 'characterpage'">
      <img src="./../../assets/bg1.png" alt="Character Image" class="img-fluid" />
    </div>

    <!-- Service Dropdown -->
    <div class="dropdownrep">
      <ul class="list-group serviceDropdown mx-auto" v-if="filteredServices.length > 0">
        <li
          v-for="service in filteredServices"
          :key="service"
          class="list-group-item list-group-item-action"
          @click="selectService(service)"
        >
          {{ service }}
        </li>
      </ul>
    </div>

    <!-- RIGHT WHEEL CONTAINER -->
    <Transition>
      <div v-show="showWheel" class="wheelcontainerrep">
        <div class="wheelwrapper flex justify-center items-center w-1/2" ref="wheelWrapper">
          <div>
            <h2 class="wheeltitle text-black text-center mb-2">Wheel Of Services</h2>
          </div>
          <div class="wheelcircle">
            <div id="services"></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import * as d3 from 'd3'
import maintableimage from '../../assets/table.png'
import sidetableimage from '../../assets/Singlechair.png'

export default {
  data() {
    return {
      maintable: maintableimage,
      sidetable: sidetableimage,
      services: [
        'plumbing',
        'electrical',
        'air-con',
        'cleaning',
        'gardening',
        'painting',
        'repair',
        'installation'
      ], // List of services
      data: [], // Initially empty
      selectedService: '',
      propellerInstance: null,
      typedService: '',
      filteredServices: [],
      showWheel: false
    }
  },
  mounted() {
    this.generateData('') // Generate data before drawing the wheel
    this.drawWheel()
    this.initPropeller()
  },
  watch: {
    typedService(service) {
      this.generateData(service)
      let wheel = document.getElementById('services')
      wheel.innerText = ''
      this.drawWheel()
    }
  },
  methods: {
    startWheel() {
      this.showWheel = true // Show the wheel when the button is clicked
    },
    filterServices() {
      if (this.typedService) {
        this.filteredServices = this.services.filter((service) =>
          service.startsWith(this.typedService.toLowerCase())
        )
      } else {
        this.filteredServices = []
      }
    },
    selectService(service) {
      this.selectedService = service
      this.typedService = service // Set the input value to the selected service
      this.filteredServices = [] // Clear the dropdown
    },
    generateData(text) {
      const colors = ['#a5d3e4', '#e4b5a5'] // Alternate colors
      this.data = []

      const filteredServices = this.services.filter((service) =>
        service.startsWith(text.toLowerCase())
      )

      for (let i = 0; i < filteredServices.length; i++) {
        this.data.push({
          name: filteredServices[i],
          count: 1,
          color: colors[i % colors.length],
          rotate: i * (360 / filteredServices.length),
          endrotate: i * (360 / filteredServices.length) + 360 / filteredServices.length,
          middlerotate: i * (360 / filteredServices.length) + 360 / filteredServices.length / 2
        })
      }
    },
    drawWheel() {
      const width = 400
      const height = 400
      const radius = 100
      const seatradius = 40
      const seatdistance = radius + seatradius + 10

      const svg = d3
        .select('#services')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      // Append the circle to the SVG
      svg
        .append('circle')
        .attr('cx', 0) // Center the circle on the X-axis
        .attr('cy', 0) // Center the circle on the Y-axis
        .attr('r', radius) // Set the radius of the circle
        .attr('fill', 'none') // Remove the fill or set it to 'none'

      // Append the image inside the circle
      svg
        .append('image')
        .attr('xlink:href', this.maintable) // Use the image URL from maintable
        .attr('x', -radius) // Set x to -radius to center the image
        .attr('y', -radius) // Set y to -radius to center the image
        .attr('width', radius * 2) // Match the width of the image to the circle
        .attr('height', radius * 2) // Match the height of the image to the circle
        .attr('preserveAspectRatio', 'xMidYMid slice') // Preserve aspect ratio

      // g.append('text')
      //   .attr('transform', function (d) {
      //     const [x, y] = arc.centroid(d) // Get the segment's centroid coordinates
      //     const angle = ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI) // Calculate the midpoint angle of the segment
      //     return `translate(${x}, ${y}) rotate(${angle + 90})` // Rotate the text by 90 degrees
      //   })
      //   .attr('dy', '0.35em') // Center vertically
      //   .style('text-anchor', 'middle')
      //   .style('font-size', '14px')
      //   .style('text-transform', 'uppercase')
      //   .text((d) => d.data.name)

      console.log('Number of seats:', this.data.length)

      for (let i = 0; i < this.data.length; i++) {
        const angle = this.data[i].middlerotate - 90
        const x = seatdistance * Math.cos((angle * Math.PI) / 180) // Ensure angle is in radians
        const y = seatdistance * Math.sin((angle * Math.PI) / 180) // Ensure angle is in radians

        // Append a circle for each data point
        svg.append('circle').attr('cx', x).attr('cy', y).attr('r', seatradius).style('fill', 'none')

        // Append an image for each data point
        svg
          .append('image')
          .attr('xlink:href', this.sidetable) // Use the image URL from sidetable
          .attr('x', x - seatradius) // Center the image horizontally
          .attr('y', y - seatradius) // Center the image vertically
          .attr('width', seatradius * 2) // Match the width of the image to the circle
          .attr('height', seatradius * 2) // Match the height of the image to the circle
          .attr('preserveAspectRatio', 'xMidYMid slice') // Preserve aspect ratio

        // Append a background rectangle for the text
        svg
          .append('rect')
          .attr('x', x - 30) // Adjust size as needed
          .attr('y', y - 10) // Adjust size as needed
          .attr('transform', function () {
            // Rotate the text based on the angle
            return `rotate(${angle + 180}, ${x}, ${y})` // Rotate around the circle's center
          })
          .attr('width', 60) // Adjust width as needed
          .attr('height', 20) // Adjust height as needed
          .attr('fill', 'rgba(0, 0, 0, 0.7)') // Background color with transparency
          .attr('rx', 5) // Rounded corners
          .attr('ry', 5) // Rounded corners

        // Append text for each data point in the center of the circle
        svg
          .append('text')
          .attr('x', x) // Center the text horizontally
          .attr('y', y) // Center the text vertically
          .attr('transform', function () {
            // Rotate the text based on the angle
            return `rotate(${angle + 180}, ${x}, ${y})` // Rotate around the circle's center
          })
          .attr('dy', '0.35em') // Align the text vertically
          .attr('text-anchor', 'middle') // Center the text horizontally
          .style('font-size', '10px')
          .style('fill', 'white') // Set text color (adjust if necessary)
          .text(this.data[i].name)
      }
    },
    initPropeller() {
      this.propellerInstance = new Propeller(document.getElementById('services'), {
        inertia: 0.99,
        ondragstop: () => {
          setTimeout(() => {
            let turn = this.propellerInstance.angle
            this.setService(turn)

            var targetService = this.data.find((service) => service.name === this.selectedService)
            var targetRotation = 360 - targetService.middlerotate - 90 // Position where the arrow should be above the service
            if (targetRotation < 0) {
              targetRotation = Math.abs(targetRotation)
              targetRotation = 360 - targetRotation
            }

            const rotateToTarget = () => {
              const currentAngle = this.propellerInstance.angle

              if (Math.abs(currentAngle - targetRotation) < 1) {
                // If the angle is close enough, stop adjusting
                this.propellerInstance.angle = targetRotation
                console.log('Aligned to target:', this.selectedService)
                return
              }

              // Gradually adjust the angle
              const adjustment = currentAngle > targetRotation ? -1 : 1 // Determine if we need to increase or decrease
              this.propellerInstance.angle += adjustment

              requestAnimationFrame(rotateToTarget) // Smooth animation using requestAnimationFrame
            }

            rotateToTarget() // Start the adjustment process
          }, 1000) // 1 second delay before the function executes
        }
      })
    },
    setService(turn) {
      turn = 360 - turn
      turn -= 90
      if (turn < 0) {
        turn = Math.abs(turn)
        turn = 360 - turn
      }

      for (const service of this.data) {
        if (turn > service.rotate && turn < service.endrotate) {
          console.log('Search for', service.name)
          console.log('Current angle:', turn)
          this.selectedService = service.name
          console.log('Angle to meet:', service.rotate, 'to', service.endrotate)
        }
      }
    }
  }
}
</script>

<style scoped>
.yellowbg {
  padding: 5% 10%;
  display: flex;
  align-items: center;
  background: url('../../assets/bg2.png');
  background-size: cover;
  background-position: bottom; /* Anchors background to the bottom */
  min-height: 37rem;
}

.left-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.responsivescreen {
  flex-direction: row;
}

@media (max-width: 767px) {
  .left-container {
    /* Adjustments for screens below 768px */
    gap: 10px; /* Example: reduce gap */
    flex-direction: row; /* Example: change to row layout */
  }
  .responsivescreen {
    flex-direction: column;
    text-align: center;
  }

  .input1 {
    display: flex; /* Show the input field on smaller screens */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
  }

  .input2 {
    display: flex; /* Show the input field on smaller screens */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
  }

  .wheelcontainerrep {
    display: none;
  }

  .dropdownrep {
    display: inline;
  }

  .jumbo {
    width: 100%;
  }

  .characterpage {
    display: none;
  }

  .yellowbg {
    min-height: 15rem;
  }
}

@media (min-width: 768px) {
  .input1 {
    display: inline; /* Keep it visible on larger screens after click */
  }

  .input2 {
    display: none; /* Keep the second input hidden */
  }

  .wheelcontainerrep {
    display: inline;
  }

  .dropdownrep {
    display: none;
  }

  .jumbo {
    width: 50%;
  }

  .characterpage {
    width: 40%; /* Ensure the container takes the full width */
    height: auto; /* Adjust height automatically */
    display: inline; /* Use flexbox for centering */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
  }
}

.wheelwrapper {
  width: 500px;
  height: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheeltitle {
  font-size: 1.5em;
  padding-bottom: 10px;
}

.wheelcircle {
  width: 400px;
  height: 400px;
}

.tagline {
  font-size: 5vw;
}

.subtagline {
  font-size: 2vw;
}

.characterpagenone {
  display: none;
}

/* Add specific transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.btncolor {
  background-color: #8a5a00;
  border-radius: 20px;
  font-size: 1.5vw;
  color: white;
}
</style>
