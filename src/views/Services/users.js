import { db } from '../../firebaseConfig'
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

class Services {
  async getAllServices(selCategory, selLocation, page, itemsPerPage) {
    let q = query(collection(db, 'services'))

    // Apply category filter if necessary
    if (selCategory !== 'All Categories') {
      q = query(q, where('service_type', 'array-contains', selCategory))
    }

    // Apply location filter if necessary
    if (selLocation !== 'All Locations') {
      q = query(q, where('location', '==', selLocation))
    }

    const querySnapshot = await getDocs(q)
    const totalItems = querySnapshot.size

    // Pagination logic
    const startAt = (page - 1) * itemsPerPage
    const endAt = startAt + itemsPerPage

    // Initialize an empty array for services
    const services = []

    // Process each document and push to services array
    querySnapshot.docs.slice(startAt, endAt).forEach((serviceDoc) => {
      const serviceData = serviceDoc.data()

      // Create a service object
      const service = {
        serviceId: serviceDoc.id,
        location: serviceData.location || '',
        service_type: serviceData.service_type || [],
        yearsExperience: serviceData.yearsExperience,
        userId: serviceData.userId || '' // Keeping userId if you still want to return it
        // Removed username and profilePicture since we're not fetching from users table
      }

      // Push the service object to the services array
      services.push(service)
    })

    // Return the items and totalItems
    return { items: services, totalItems }
  }

  async getService(serviceId) {
    const docRef = doc(db, 'services', serviceId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }
  }

  async getServicesByUser(userId) {
    let q = query(collection(db, 'services'), where('userId', '==', userId))

    const querySnapshot = await getDocs(q)
    const result = querySnapshot.docs.map((doc) => ({
      ...doc.data()
    }))

    return result
  }

  async getAllCategories() {
    const q = collection(db, 'services')
    const querySnapshot = await getDocs(q)
    const categories = new Set()

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.service_type && Array.isArray(data.service_type)) {
        data.service_type.forEach((type) => categories.add(type))
      }
    })

    return Array.from(categories)
  }

  async getAllLocations() {
    const q = collection(db, 'services')
    const querySnapshot = await getDocs(q)
    const location = new Set()

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.location) {
        location.add(data.location)
      }
    })

    return Array.from(location)
  }

  async createService(fields) {
    try {
      const docRef = await addDoc(collection(db, 'services'), fields)
      const docId = docRef.id

      await updateDoc(doc(db, 'services', docId), {
        serviceId: docId
      })

      return { success: true, id: docId }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async createDetailedServices(field, image) {
    try {
      const docRef = await addDoc(collection(db, 'userServiceDetails'), field)
      const docId = docRef.id

      // Upload the image to Firebase Storage
      const storage = getStorage()
      const storageRef = ref(storage, `userServiceDetails/${docId}`)
      await uploadBytes(storageRef, image)
      const imageUrl = await getDownloadURL(storageRef)

      await updateDoc(doc(db, 'userServiceDetails', docId), {
        userServiceDetailsId: docId,
        serviceImg: imageUrl
      })

      return { success: true, id: docId }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new Services()
