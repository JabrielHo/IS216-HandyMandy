<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ service.name }}</h2>
      <img :src="serviceImage" :alt="service.name" class="modal-image" />
      <p><strong>Description:</strong> {{ description }}</p>
      <p><strong>Years of Experience:</strong> {{ yearsExperience }}</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    service: Object,
    serviceImage: String,
    description: String,
    yearsExperience: Number,
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center; /* Center all text and elements inside the modal */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #ffad60;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffad10;
}
</style>

  