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
    async checkAuth() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            try {
              this.user = user
              if (user && !this.userData) {
                await this.getUserData(user)
              }
              this.loading = false
              unsubscribe() // Clean up listener
              resolve(user)
            } catch (error) {
              reject(error)
            }
          },
          (error) => {
            this.loading = false
            reject(error)
          }
        )
      })
    },
    async getUserData(user) {
      this.userData = await UserService.getUserData(user.uid)
    }
  }
})
