import { db } from '../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth';

class UserService {
  async getUserData(userId) {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }
  }
  async updateCertLicense(certificationList) {
    const authStore = useAuthStore();
    const userId = authStore.user.uid;
    console.log(userId)
    
    try {
      const userDocRef = doc(db, 'users', userId);

      // Update the certificationsLicenses field with the new certification list
      await updateDoc(userDocRef, {
        certificationsLicenses: certificationList
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating certifications/licenses: ", error);
      return { success: false, error };
    }
  }
}

export default new UserService()
