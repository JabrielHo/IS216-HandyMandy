<template>
    <section class="background">
      <div class="container con-background">
        <h4>Enter Your Certifications and Licenses</h4>
        <p class="secondary">Please list each certification/license, separated by line breaks</p>
  
        <div class="formgroup">
          <label for="certifications" class="form-label" :class="{ 'is-invalid': v$.certifications.$error }">
            Certifications/ Licenses (separate each with a line break)
          </label>
          <textarea
            id="certifications"
            class="form-control"
            rows="5"
            placeholder="Enter your certifications and licenses here..."
            v-model="certifications"
            :class="{ 'is-invalid': v$.certifications.$error }"
          ></textarea>
          <div v-if="v$.certifications.$error" class="invalid-feedback">
            <span>At least one certification or license is required.</span>
          </div>
        </div>
  
        <div v-if="existingCertifications.length > 0" class="existing-certifications">
          <h5>Your Current Certifications/ Licenses:</h5>
          <ul>
            <li v-for="(cert, index) in existingCertifications" :key="index">
              {{ cert }}
              <button @click="deleteCertification(index)" class="delete-btn">Delete</button>
            </li>
          </ul>
        </div>
  
        <div class="submit-button">
          <button class="btn submitBtn" @click="submitCertifications">Submit Certifications</button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { required } from '@vuelidate/validators';
  import useVuelidate from '@vuelidate/core';
  import UserService from "../../services/UserService";
  import { useAuthStore } from "../../stores/auth";
  import { useRouter } from 'vue-router';
  
  const certifications = ref('');
  const existingCertifications = ref([]);
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Fetch current user data
  onMounted(() => {
    const userCertifications = authStore.user.certificationsLicenses || [];
    existingCertifications.value = userCertifications;
    console.log(existingCertifications)
    certifications.value = userCertifications.join('\n');
  });
  
  const rules = {
    certifications: { required }
  };
  
  const v$ = useVuelidate(rules, { certifications });
  
  async function submitCertifications() {
    await v$.value.$touch();
    if (v$.value.$invalid) {
      console.log('Form is invalid');
      return;
    }
  
    // Split the certifications by line breaks and log the result
    const certificationList = certifications.value.split('\n').map(cert => cert.trim()).filter(cert => cert !== '');
  
    console.log(certificationList);
    const result = await UserService.updateCertLicense(certificationList);
  
    if (result.success) {
      router.push('/profile/' + authStore.user.uid); // Navigate to the user's profile page
    }
  
    // Reset the form after submission (optional)
    certifications.value = '';
  }
  
  // Delete certification
  function deleteCertification(index) {
    existingCertifications.value.splice(index, 1); // Remove from the existing list
    certifications.value = existingCertifications.value.join('\n'); // Update the text area
  
    // Update the user's certifications in the database after deletion
    const result = UserService.updateCertLicense(existingCertifications.value);
    if (result.success) {
      console.log("Certification removed successfully.");
    }
  }
  </script>
  
  <style scoped>
  .submitBtn {
    background-color: #ffad60;
    color: white;
  }
  
  .submitBtn:hover {
    transform: scale(1.01);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .container {
    max-width: 900px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;
    padding: 24px;
    background-color: rgb(248, 248, 248);
  }
  
  .con-background {
    background-color: #ffeead;
  }
  
  .background {
    background-image: url('../../assets/bg1.png');
  }
  
  .secondary {
    color: rgb(148, 163, 184);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }
  
  label {
    font-weight: 500;
  }
  
  .form-control:focus {
    border-color: black;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  }
  
  .formgroup {
    margin-bottom: 8px;
  }
  
  .submit-button {
    margin-top: 16px;
    text-align: right;
  }
  
  .is-invalid {
    border-color: red;
    color: red;
  }
  
  .invalid-feedback {
    color: red;
    font-size: 0.875rem;
  }
  
  .existing-certifications {
    margin-top: 20px;
  }
  
  .delete-btn {
    margin-left: 10px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .delete-btn:hover {
    background-color: darkred;
  }
  </style>
  