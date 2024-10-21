import { db, auth } from '../firebaseConfig'
import { signInAnonymously } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

class UserService {
  loginAnon() {
    signInAnonymously(auth)
      .then(async () => {
        const userId = auth.currentUser.uid
        const userDocRef = doc(db, 'users', userId)
        await setDoc(userDocRef, {
          userId: 'userId',
          userName: 'TestUser',
          profilePicture:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  async getUserData(userId) {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("User doesn't exist")
    }
  }
}

export default new UserService()
