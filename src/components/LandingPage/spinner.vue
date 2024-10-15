<template>
  <div class="container-fluid spinnercontainer">
    <div class="row">
      <div class="col-md-6">
        <h1>{{ selectedAnimal }}</h1>
      </div>

      <div class="col-md-6">
        <div class="wheelwrapper">
          <h2 id="wheeltitle" class="centered"></h2>
          <img
            src="http://developedbydave.com/wp-content/uploads/2022/06/arrow.png"
            class="arrow"
            style="position: absolute; left: 50%; transform: translateX(-50%); margin-top: -10px"
          />
          <div class="wheelcircle">
            <div id="animals"></div>
          </div>
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
      data: [
        { name: 'giraffe', count: 1, color: '#a5d3e4', rotate: '36' },
        { name: 'dog', count: 1, color: '#e4b5a5', rotate: '108' },
        { name: 'cat', count: 1, color: '#a5d3e4', rotate: '180' },
        { name: 'fish', count: 1, color: '#e4b5a5', rotate: '252' },
        { name: 'monkey', count: 1, color: '#a5d3e4', rotate: '324' }
      ],
      selectedAnimal: '',
      propellerInstance: null
    }
  },
  mounted() {
    this.drawWheel()
    this.initPropeller()
  },
  methods: {
    drawWheel() {
      const width = 400
      const height = 400
      const radius = 180

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
        .select('#animals')
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

      g.append('text')
        .attr('transform', function (d) {
          var _d = arc.centroid(d)
          _d[0] *= 0.95 // adjust position
          _d[1] *= 0.95
          var rot = d.data.rotate
          return 'translate(' + _d + ') rotate(' + rot + ')'
        })
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', 14)
        .style('text-transform', 'uppercase')
        .text(function (d) {
          return d.data.name
        })
    },
    initPropeller() {
      this.propellerInstance = new Propeller(document.getElementById('animals'), {
        inertia: 0.9,
        onStop: () => {
          let turn = this.propellerInstance.angle
          console.log(turn)
          this.setAnimal(turn)
          const targetAnimal = this.data.find((animal) => animal.name === this.selectedAnimal)
          console.log(targetAnimal.rotate)
          this.propellerInstance.angle = 360 - targetAnimal.rotate
        }
      })
    },
    setAnimal(turn) {
      if (turn > 0 && turn < 72) {
        this.selectedAnimal = 'monkey'
      } else if (turn > 73 && turn < 144) {
        this.selectedAnimal = 'fish'
      } else if (turn > 145 && turn < 216) {
        this.selectedAnimal = 'cat'
      } else if (turn > 217 && turn < 288) {
        this.selectedAnimal = 'dog'
      } else if (turn > 289 && turn < 360) {
        this.selectedAnimal = 'giraffe'
      }
      console.log(this.selectedAnimal)
      console.log(this.speed)
    }
  }
}
</script>

<style scoped>
.spinnercontainer {
  background-color: rgb(216, 214, 255);
}

.wheelwrapper {
  width: 500px;
  height: 500px;
  position: relative;
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
.animaldiv {
  display: none;
  margin-top: 50px;
  color: red;
  background-color: white;
}
</style>
