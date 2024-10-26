<template>
  <div class="container-fluid spinnercontainer">
    <div class="row">
      <div class="col-5 dropdown position-relative">
        <h1 class="fs-1 text-primary">{{ selectedService }}</h1>
        <input
          type="text"
          v-model="typedService"
          class="input-group-text ms-auto dropdown-toggle"
          @input="filterServices"
          placeholder="Type a service..."
        />
        <ul class="list-group serviceDropdown" v-if="filteredServices.length > 0">
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

export default {
  data() {
    return {
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

      const arc = d3
        .arc()
        .outerRadius(radius)
        .innerRadius(radius * 0.4)

      const pie = d3
        .pie()
        .sort(null)
        .value(function (d) {
          return d.count
        })

      const svg = d3
        .select('#services')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      const g = svg.selectAll('.arc').data(pie(this.data)).enter().append('g')

      g.append('path')
        .attr('d', arc)
        .style('fill', (d, i) => d.data.color)
        .attr('stroke', 'black')
        .style('stroke-width', 3)

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

        svg
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', seatradius)
          .style('fill', this.data[i].color)
          .style('stroke', 'black')
          .style('stroke-width', 2)

        svg
          .append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('transform', function () {
            // Rotate the text based on the angle
            return `rotate(${angle + 180}, ${x}, ${y})` // Rotate around the circle's center
          })
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .style('font-size', '10px')
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
  left: 0; /* Align to the start of the input box */
  width: 100%; /* Match the width of the input box */
  z-index: 1000; /* Ensure dropdown is above other elements */
  background-color: white; /* Set a background color for the dropdown */
  border: 1px solid #ccc; /* Optional: add a border */
  max-height: 200px; /* Optional: limit height */
  overflow-y: auto; /* Optional: enable scrolling */
}
</style>
