<template>
  <div class="container-fluid spinnercontainer">
    <div class="row">
      <div class="col-5 dropdown position-relative mx-auto">
        <div class="container mx-auto text-center my-3">
          <h1 class="display-4 text-primary mb-1 text-start">{{ selectedService }}</h1>
          <h3
            class="text-secondary text-start py-2"
            style="line-height: 1.5; font-weight: 300; border-radius: 10px"
          >
            Searching for cleaning services for homes and offices? Look through our endless listings
            to find a company that suits your cleaning needs!
          </h3>
        </div>
        <input
          type="text"
          v-model="typedService"
          class="input-group-text mx-auto dropdown-toggle"
          @input="filterServices"
          placeholder="Find a service!"
          style="font-size: 2em"
        />
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
      <div class="col-2">
        <img
          src="http://developedbydave.com/wp-content/uploads/2022/06/arrow.png"
          class="arrow"
          style="
            position: absolute;
            margin-top: -10px;
            rotate: -90deg;
            transform: translateY(180px) translateX(20px);
          "
        />
      </div>
      <div class="wheelwrapper col-5">
        <h2 id="wheeltitle" class="centered"></h2>
        <div class="wheelcircle">
          <div id="services"></div>
        </div>
      </div>
    </div>
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
      filteredServices: []
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
.spinnercontainer {
  background-color: rgb(216, 214, 255);
  overflow: hidden;
}

.wheelwrapper {
  width: 500px;
  height: 500px;
  position: relative;
  /* left: 50%; 
  transform: translateX(-110%);  */
}

.wheelwrapper h2 {
  color: #fff;
  padding-top: 20px;
  text-align: center;
}

.wheelcircle {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

.servicediv {
  display: none;
  margin-top: 50px;
  color: red;
  background-color: white;
}

.row {
  display: flex;
  align-items: center; /* Optional: vertically align items */
  flex-wrap: nowrap; /* Prevents wrapping to new rows */
}

.serviceDropdown {
  position: absolute;
  top: calc(100% + 5px); /* Position below the input box */
  width: 100%; /* Match the width of the input box */
  z-index: 1000; /* Ensure dropdown is above other elements */
  background-color: white; /* Set a background color for the dropdown */
  border: 1px solid #ccc; /* Optional: add a border */
  max-height: 200px; /* Optional: limit height */
  overflow-y: auto; /* Optional: enable scrolling */
}
</style>
