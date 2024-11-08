<template>
  <div
    id="profile-card"
    :class="{ animate: isAnimated }"
    @mouseenter="isAnimated = true"
    @mouseleave="isAnimated = false"
  >
    <div id="profile-front">
      <div class="shadow"></div>
      <div class="image-container">
        <img :src="service.profilePicture" alt="Profile Picture" class="profile-image" />
        <div class="image_overlay"></div>
        <div class="view-details-wrapper" v-if="service.userId != userData?.uid">
          <button id="view_details" @click="navigateToProfile(service.userId)">
            <span class="button-text">View Profile</span>
          </button>
        </div>
        <div class="view-details-wrapper" v-if="service.userId == userData?.uid">
          <button id="view_details" @click="navigateToPersonalProfile(userData.uId)">
            <span class="button-text">Edit Your Profile</span>
          </button>
        </div>
      </div>
      <div class="stats">
        <div class="stats-container">
          <span class="username">{{ service.username }}</span>
          <p class="details">
            Located at: {{ service.location }}
            <br />
            <span class="services">
              Services include:
              <span v-for="(ser, index) in service.service_type" :key="index">
                {{ ser }}
                <span v-if="index < service.service_type.length - 1">, </span>
              </span>
            </span>
          </p>
          <button
            class="chat-button"
            v-if="isAnimated && isLoggedIn && userData?.uid !== service.userId"
            @click="createChat(service.userId, service.serviceId)"
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { collection, query, where, getDocs, setDoc, Timestamp, doc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
const authStore = useAuthStore()

export default {
  name: 'ServiceCard',
  props: {
    service: {
      type: Object,
      required: true,
      default: () => ({
        profilePicture: 'default-profile-url',
        username: 'Unknown User',
        location: 'Unknown Location',
        service_type: [],
        yearsExperience: 0
      })
    }
  },
  data() {
    return {
      isAnimated: false
    }
  },
  computed: {
    isLoggedIn() {
      return authStore.user !== null
    },
    userData() {
      return authStore.user
    }
  },
  methods: {
    async createChat(userId, serviceId) {
      const helperUserId = userId
      const requesterUserId = this.userData.uid
      const requestId = serviceId
      const chatRoomRef = collection(db, 'chatRoom')
      const q = query(
        chatRoomRef,
        where('helperUserId', '==', helperUserId),
        where('requesterUserId', '==', requesterUserId),
        where('requestId', '==', requestId)
      )
      const querySnapshot = await getDocs(q)

      let chatRoomId

      if (querySnapshot.empty) {
        const newChatRoomRef = doc(chatRoomRef)
        await setDoc(newChatRoomRef, {
          id: newChatRoomRef.id,
          helperUserId: helperUserId,
          requesterUserId: requesterUserId,
          requestId: requestId,
          messages: [
            {
              msg: "Hello, I'm ready to provide assistance on any issues you have! Just drop a message here.",
              senderId: helperUserId,
              timestamp: Timestamp.now(),
              type: 'text'
            }
          ],
          createdAt: Timestamp.now(),
          type: 'Service'
        })
        chatRoomId = newChatRoomRef.id
      } else {
        chatRoomId = querySnapshot.docs[0].id
      }

      this.$router.push({ name: 'chatView', params: { chatRoomId } })
    },
    navigateToProfile(userId) {
      if (this.isLoggedIn) {
        this.$router.push({ name: 'UserProfile', params: { userId } })
      } else {
        alert('You must be logged in to view this service.')
      }
    }
  }
}
</script>

<style scoped>
#profile-card {
  width: 100%;
  height: auto;
  min-height: 400px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: 100ms ease-out;
  margin: 0 auto 20px;
  border: 1px solid rgb(177, 177, 177);
  background: #fff;
}

#profile-card.animate {
  box-shadow: 0px 13px 21px -5px rgba(0, 0, 0, 0.3);
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.profile-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stats-container {
  background: #fff;
  position: relative;
  width: 100%;
  padding: 15px;
  transition: all 200ms ease-out;
}

.username {
  font-size: 1.2rem;
  color: #a66e38;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.details {
  font-size: 0.9rem;
  color: black;
  margin: 0;
  line-height: 1.4;
}

.services {
  display: block;
  margin: 5px 0;
  word-wrap: break-word;
}

.experience {
  display: block;
  margin-top: 5px;
}

.image_overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffad60;
  opacity: 0;
  transition: all 200ms ease-out;
}

#profile-card.animate .image_overlay {
  opacity: 0.7;
}

.view-details-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#view_details {
  position: relative;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0;
  transition: all 200ms ease-out;
  width: min(80%, 200px);
  padding: min(3%, 12px) min(5%, 20px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-text {
  font-size: min(3.5vw, 1rem);
  white-space: nowrap;
  line-height: 1.2;
}

#view_details:hover {
  background: #fff;
  color: #ffad60;
  cursor: pointer;
}

#profile-card.animate #view_details {
  opacity: 1;
}

.chat-button {
  display: none;
  width: 100%;
  background-color: #ffad60;
  color: #fff;
  border: none;
  padding: clamp(6px, 1.5vw, 12px);
  text-align: center;
  font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 200ms ease-out;
}

#profile-card.animate .chat-button {
  display: block;
}

.chat-button:hover {
  background-color: #ff9f47;
}

/* Responsive Breakpoints */
@media (max-width: 1199.98px) {
  /* xl breakpoint */
  #profile-card {
    min-height: 350px;
  }

  .username {
    font-size: 1.1rem;
  }

  .details {
    font-size: 0.85rem;
  }

  #view_details {
    width: min(70%, 180px);
    border-width: 1.5px;
  }

  .button-text {
    font-size: min(3vw, 0.9rem);
  }
}

@media (max-width: 991.98px) {
  /* lg breakpoint */
  #profile-card {
    min-height: 300px;
  }

  .stats-container {
    padding: 10px;
  }

  #view_details {
    width: min(65%, 160px);
    border-width: 1.5px;
    padding: min(2.5%, 10px) min(4%, 16px);
  }

  .button-text {
    font-size: min(2.8vw, 0.85rem);
  }

  .chat-button {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

@media (max-width: 767.98px) {
  /* md breakpoint */
  #profile-card {
    min-height: 280px;
  }

  .username {
    font-size: 1rem;
  }

  .details {
    font-size: 0.8rem;
  }

  #view_details {
    width: min(60%, 140px);
    border-width: 1px;
    padding: min(2%, 8px) min(3%, 14px);
  }

  .button-text {
    font-size: min(2.5vw, 0.8rem);
  }
}

@media (max-width: 575.98px) {
  /* sm breakpoint */
  #profile-card {
    min-height: 250px;
    margin: 0 auto 15px;
  }

  .stats-container {
    padding: 8px;
  }

  #view_details {
    width: min(55%, 120px);
    padding: min(1.5%, 6px) min(2.5%, 12px);
  }

  .button-text {
    font-size: min(2.2vw, 0.75rem);
  }

  .chat-button {
    margin-top: 6px;
  }
}
</style>