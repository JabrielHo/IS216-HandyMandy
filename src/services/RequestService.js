import { db } from '../firebaseConfig'
import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

class RequestService {
  async getAllServiceRequests(sortOption, categoryOption, locationOption, page, itemsPerPage) {
    let q = query(collection(db, 'requests'), where('status', '==', 'Open'))

    if (categoryOption !== 'All Categories') {
      q = query(q, where('category', '==', categoryOption))
    }

    if (locationOption !== 'All Locations') {
      q = query(q, where('location', '==', locationOption))
    }

    if (sortOption === 'Sort by Newest') {
      q = query(q, orderBy('timestamp', 'desc'))
    } else if (sortOption === 'Sort by Oldest') {
      q = query(q, orderBy('timestamp', 'asc'))
    }

    const querySnapshot = await getDocs(q)
    const totalItems = querySnapshot.size
    const startAt = (page - 1) * itemsPerPage
    const endAt = startAt + itemsPerPage

    const result = querySnapshot.docs.slice(startAt, endAt).map((doc) => ({
      ...doc.data()
    }))

    return { items: result, totalItems }
  }

  async getServiceRequest(requestId) {
    const docRef = doc(db, 'requests', requestId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }
  }

  async getServiceRequestsByUser(userId) {
    let q = query(collection(db, 'requests'), where('userId', '==', userId))

    const querySnapshot = await getDocs(q)
    const result = querySnapshot.docs.map((doc) => ({
      ...doc.data()
    }))

    return result
  }

  async getAllCategories() {
    const q = collection(db, 'requests')
    const querySnapshot = await getDocs(q)
    const categories = new Set()

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.category && data.status === 'Open') {
        categories.add(data.category)
      }
    })

    return Array.from(categories)
  }

  async getAllLocations() {
    const q = collection(db, 'requests')
    const querySnapshot = await getDocs(q)
    const locations = new Set()

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.location && data.status === 'Open') {
        locations.add(data.location)
      }
    })

    return Array.from(locations)
  }

  async createServiceRequest(fields, image) {
    try {
      const docRef = await addDoc(collection(db, 'requests'), fields)
      const docId = docRef.id

      // Upload the image to Firebase Storage
      const storage = getStorage()
      const storageRef = ref(storage, `requests/${docId}`)
      await uploadBytes(storageRef, image)
      const imageUrl = await getDownloadURL(storageRef)

      await updateDoc(doc(db, 'requests', docId), {
        id: docId,
        imgSrc: imageUrl
      })

      return { success: true, id: docId }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async closeServiceRequest(requestId) {
    const requestRef = doc(db, 'requests', requestId)
    await updateDoc(requestRef, {
      status: 'Closed'
    })
    return true
  }
}

export default new RequestService()
