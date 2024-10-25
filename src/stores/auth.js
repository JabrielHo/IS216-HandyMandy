import { defineStore } from 'pinia';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
  }),
  actions: {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
      } catch (error) {
        console.error("Login failed", error);
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
    checkAuth() {
      onAuthStateChanged(auth, (user) => {
        user ? console.log(user.uid) : console.log(user)
        this.user = user;
        this.loading = false;
      });
    }
  }
});