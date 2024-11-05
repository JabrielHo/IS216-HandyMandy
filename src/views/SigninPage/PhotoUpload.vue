<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebaseConfig';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

const router = useRouter();
const storage = getStorage();

const photoFile = ref(null);
const photoPreview = ref(null);
const isUploading = ref(false);

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    photoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
};

const uploadPhoto = async () => {
  if (!photoFile.value || !auth.currentUser) {
    alert('Please select a photo first');
    return;
  }

  isUploading.value = true;
  const userId = auth.currentUser.uid;
  const fileExtension = photoFile.value.name.split('.').pop();
  const photoRef = storageRef(storage, `profile-photos/${userId}.${fileExtension}`);

  try {
    const snapshot = await uploadBytes(photoRef, photoFile.value);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user document with new profile picture URL
    await updateDoc(doc(db, "users", userId), {
      profilePicture: downloadURL
    });

    // Redirect to home page or dashboard
    router.push('/');
  } catch (error) {
    console.error('Error uploading photo:', error);
    alert('Failed to upload photo. Please try again.');
  } finally {
    isUploading.value = false;
  }
};

const skipUpload = () => {
  router.push('/');
};
</script>

<template>
  <div class="photo-upload-container">
    <div class="photo-upload-card">
      <h1 class="text-center">Upload Profile Photo</h1>
      <p class="upload-subtitle">Choose a profile photo to personalize your account</p>

      <div class="photo-preview-container">
        <img
          v-if="photoPreview"
          :src="photoPreview"
          class="photo-preview"
          alt="Profile preview"
        />
        <div v-else class="photo-placeholder">
          <span>No photo selected</span>
        </div>
      </div>

      <div class="form-group mb-4">
        <label for="photo" class="photo-upload-label">
          Select Photo
        </label>
        <input
          type="file"
          id="photo"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/*"
        >
      </div>

      <div class="button-container">
        <button
          class="btn btn-primary upload-btn"
          @click="uploadPhoto"
          :disabled="!photoFile || isUploading"
        >
          {{ isUploading ? 'Uploading...' : 'Upload Photo' }}
        </button>
        <button
          class="btn btn-secondary skip-btn"
          @click="skipUpload"
        >
          Skip for now
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.photo-upload-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
}

.upload-subtitle {
  text-align: center;
  color: #6c757d;
  margin-bottom: 2rem;
}

.photo-preview-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  color: #6c757d;
  text-align: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.upload-btn{
    background-color: #FF7043;
    color: white;
    border: none;
}

.upload-btn, .skip-btn {
  width: 100%;
  padding: 0.8rem;
}

.photo-upload-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}
</style>