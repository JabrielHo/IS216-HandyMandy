<template>
  <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6" v-for="(n, index) in 8" :key="n">
    <div
      id="product-card"
      :class="{ animate: isAnimated[index] }"
      @mouseenter="isAnimated[index] = true"
      @mouseleave="isAnimated[index] = false"
    >
      <div id="product-front">
        <div class="shadow"></div>
        <img
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/t-shirt.png"
          alt=""
          class="img-fluid"
        />
        <div class="image_overlay"></div>
        <div id="view_details">View details</div>
        <div class="stats">
          <div class="stats-container">
            <span class="product_price">$39</span>
            <span class="product_name">Adidas Originals</span>
            <p>Men's running shirt</p>
            <div class="product-options">
              <strong>SIZES</strong>
              <span>XS, S, M, L, XL, XXL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script>
export default {
  name: 'ProductCard',
  data() {
    return {
      isAnimated: Array(8).fill(false)
    }
  }
}
</script>

<style scoped>
body {
  background: #eaebec;
  font-family: 'Open Sans', sans-serif;
}

/* --- Product Card ---- */

#product-front {
  background: #fff;
  position: relative;
  transition: all 100ms ease-out;
}

#product-card {
  width: 100%;
  max-width: 300px;
  height: 490px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: 100ms ease-out;
  margin: auto;
}

#product-card.animate {
  box-shadow: 0px 13px 21px -5px rgba(0, 0, 0, 0.3);
  transition: 100ms ease-out;
}

.stats-container {
  background: #fff;
  position: absolute;
  top: 386px;
  left: 0;
  width: 100%;
  height: 300px;
  padding: 27px 35px 35px;
  transition: all 200ms ease-out;
}

#product-card.animate .stats-container {
  top: 272px;
  transition: all 200ms ease-out;
}

.product_name {
  font-size: 22px;
  color: #393c45;
}

.stats-container p {
  font-size: 16px;
  color: #b1b1b3;
  padding: 2px 0 20px 0;
}

.product_price {
  float: right;
  color: #48cfad;
  font-size: 22px;
  font-weight: 600;
}

.image_overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #48daa1;
  opacity: 0;
  transition: all 200ms ease-out;
}

#product-card.animate .image_overlay {
  opacity: 0.7;
  transition: all 200ms ease-out;
}

.product-options {
  padding: 2px 0 0;
}

.product-options strong {
  font-weight: 700;
  color: #393c45;
  font-size: 14px;
}

.product-options span {
  color: #969699;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

#view_details {
  position: absolute;
  top: 112px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #fff;
  color: #fff;
  font-size: 19px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  padding: 10px 0;
  width: 172px;
  opacity: 0;
  transition: all 200ms ease-out;
}

#view_details:hover {
  background: #fff;
  color: #48cfad;
  cursor: pointer;
}

#product-card.animate #view_details {
  opacity: 1;
  width: 152px;
  font-size: 15px;
  top: 115px;
  transition: all 200ms ease-out;
}

.shadow {
  width: 335px;
  height: 520px;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: none;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
}

@media (max-width: 1400px) {
  #product-card {
    max-width: 250px;
  }

  .shadow {
    width: 275px;
    height: 430px;
  }

  .stats-container {
    top: 300px;
  }

  #product-card.animate .stats-container {
    top: 190px;
  }

  #view_details {
    top: 90px;
    width: 140px;
    font-size: 16px;
  }

  #product-card.animate #view_details {
    top: 95px;
    width: 130px;
    font-size: 14px;
  }

  .product-options {
    opacity: 0;
    transition: opacity 200ms ease-out;
  }

  #product-card.animate .product-options {
    opacity: 1;
  }
}
</style>