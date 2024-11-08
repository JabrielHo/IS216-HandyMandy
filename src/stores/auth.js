import { defineStore } from 'pinia'
import { auth } from '../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import UserService from '../services/UserService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    userData: null
  }),
  actions: {
    async logout() {
      try {
        await signOut(auth)
        this.user = null
        this.userData = null
      } catch (error) {
        console.error('Logout failed', error)
      }
    },
    checkAuth() {
      this.loading = true
      onAuthStateChanged(auth, (user) => {
        user ? console.log(user.uid) : console.log(user)
        this.user = user
        if (user) this.getUserData(user)
      })
      this.loading = false
    },
    async getUserData(user) {
      this.userData = await UserService.getUserData(user.uid)
    }
  }
})
