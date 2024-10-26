import { db } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

class UserService {
  async getUserData(userId) {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }
  }
}

export default new UserService()
