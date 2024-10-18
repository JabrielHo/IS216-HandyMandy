import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBZpDl1uimrcCYgRK_2dgkSiXtb7MqH1Y0',
  authDomain: 'handymandy-cd15a.firebaseapp.com',
  projectId: 'handymandy-cd15a',
  storageBucket: 'handymandy-cd15a.appspot.com',
  messagingSenderId: '726421475154',
  appId: '1:726421475154:web:c5283fb401e17dd6a3748b',
  measurementId: 'G-0Z6N1XPYLT'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
export { db, auth }
