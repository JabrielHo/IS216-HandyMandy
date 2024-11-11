<template>
    <section class="background">
      <div class="entireform">
      <div class="container con-background">
        <h4>Enter/Edit Your Certifications and Licenses</h4>
        <p class="secondary">Please list each certification/license, separated by line breaks</p>
  
        <div class="formgroup">
          <label for="certifications" class="form-label" :class="{ 'is-invalid': v$.certifications.$error }">
          </label>
          <textarea
            id="certifications"
            class="form-control"
            rows="5"
            placeholder="Enter/Edit your certifications and licenses here..."
            v-model="certifications"
            :class="{ 'is-invalid': v$.certifications.$error }"
          ></textarea>
          <div v-if="v$.certifications.$error" class="invalid-feedback">
            <span>At least one certification or license is required.</span>
          </div>
        </div>
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
  import { useRoute } from 'vue-router';

const certifications = ref('');
const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

// Validation rules
const rules = {
  certifications: { required }
};

const v$ = useVuelidate(rules, { certifications });

onMounted(async () => {
  const userId = route.params.userId;
  const user = await UserService.getUserData(userId);
  const userCertifications = user.certificationsLicenses || [];
  certifications.value = userCertifications.join('\n');
});

async function submitCertifications() {
  await v$.value.$touch();
  if (v$.value.$invalid) {
    // console.log('Form is invalid');
    return;
  }

  const certificationList = certifications.value
    .split('\n')
    .map(cert => cert.trim())
    .filter(cert => cert !== '');

  // console.log(certificationList);

  const result = await UserService.updateCertLicense(certificationList);

  if (result.success) {
    router.push('/profile/' + authStore.user.uid);
  }
}
</script>
  
  <style scoped>
  .entireform{
    margin: 20px;
    width:100%;
  }
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
  padding: 5% 10%;
  display: flex;
  align-items: center;
  background: url('../../assets/bg1.png');
  background-size: cover;
  background-position: bottom; /* Anchors background to the bottom */ 
  }
  
  .secondary {
    color: rgb(148, 163, 184);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    margin-bottom: 0px;
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
  