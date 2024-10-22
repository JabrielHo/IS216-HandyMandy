import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBZpDl1uimrcCYgRK_2dgkSiXtb7MqH1Y0',
  authDomain: 'handymandy-cd15a.firebaseapp.com',
  projectId: 'handymandy-cd15a',
  storageBucket: 'handymandy-cd15a.appspot.com',
  messagingSenderId: '726421475154',
  appId: '1:726421475154:web:5e1bedb8e6a7713da3748b',
  measurementId: 'G-FQPLL74EGZ'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
export { db, auth }
