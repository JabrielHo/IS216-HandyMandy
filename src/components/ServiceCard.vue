<template>
    <div
      id="profile-card"
      :class="{ animate: isAnimated }"
      @mouseenter="isAnimated = true"
      @mouseleave="isAnimated = false"
    >
      <div id="profile-front">
        <div class="shadow"></div>
        <img
          :src="service.profilePicture"
          alt="Profile Picture"
          class="img-fluid"
        />
        <div class="image_overlay"></div>
        <div id="view_details">View Profile</div>
        <div class="stats">
          <div class="stats-container">
            <span class="username">{{ service.username }}</span>
            <p>{{ service.location }} <br>
              <span v-for="(ser, index) in service.service_type" :key="index">
              {{ ser }}
              <span v-if="index < service.service_type.length - 1">, </span>
            </span>
            <br>
              Years of Experience: {{ service.yearsExperience }}
            </p>
            <div class="chat-button" v-if="isAnimated">Chat</div>
          </div>
        </div>
      </div>
    </div>
</template>
      
<script>
export default {
  name: "ServiceCard",
  props: {
    service: {
      type: Object,
      required: true,
      default: () => ({
        profilePicture: 'default-profile-url',
        username: 'Unknown User',
        location: 'Unknown Location',
        service_type: [],
        yearsExperience: 0,
      }),
    },
  },
  data() {
    return {
      isAnimated: false,
    };
  },
  mounted() {
    console.log("Service data:", this.service);
  },
};

</script>

<style scoped>
body {
  background: #eaebec;
  font-family: 'Open Sans', sans-serif;
}

/* --- Profile Card ---- */

#profile-front {
  background: #fff;
  position: relative;
  transition: all 100ms ease-out;
}

#profile-card {
  width: 100%;
  /* max-width: 300px; */
  height: 490px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: 100ms ease-out;
  margin: auto;
  border: 1px solid rgb(177, 177, 177);
}

#profile-card.animate {
  box-shadow: 0px 13px 21px -5px rgba(0, 0, 0, 0.3);
  transition: 100ms ease-out;
}

.stats-container {
  background: #fff;
  position: absolute;
  top: 350px;
  left: 0;
  width: 100%;
  height: 200px;
  padding: 10px 25px 25px;
  transition: all 200ms ease-out;
}

#profile-card.animate .stats-container {
  top: 250px;
  transition: all 200ms ease-out;
}

.username {
  font-size: 22px;
  color: #393c45;
}

.stats-container p {
  font-size: 16px;
  color: #b1b1b3;
  padding: 2px 0 10px 0;
  margin-bottom: 10px; 
}

.image_overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFAD60;
  opacity: 0;
  transition: all 200ms ease-out;
}

#profile-card.animate .image_overlay {
  opacity: 0.7;
  transition: all 200ms ease-out;
}

.profile-options {
  padding: 2px 0 0;
}

.profile-options strong {
  font-weight: 700;
  color: #393c45;
  font-size: 14px;
}

.profile-options span {
  color: #969699;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

#view_details {
  position: absolute;
  top: 112px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #fff;
  color: #fff;
  font-size: 19px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  padding: 10px 0;
  width: 172px;
  opacity: 0;
  transition: all 200ms ease-out;
}

#view_details:hover {
  background: #fff;
  color: #FFAD60;
  cursor: pointer;
}

#profile-card.animate #view_details {
  opacity: 1;
  width: 152px;
  font-size: 15px;
  top: 115px;
  transition: all 200ms ease-out;
}

.shadow {
  width: 335px;
  height: 520px;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: none;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
}

.chat-button {
  display: none;
  background-color: #FFAD60;
  color: #fff;
  border: none;
  padding: 10px 20px;
  text-align: center;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 200ms ease-out;
}

#profile-card.animate .chat-button {
  display: block;
}

@media (max-width: 1400px) {
  #profile-card {
    max-width: 150px;
  }

  .shadow {
    width: 275px;
    height: 430px;
  }

  .stats-container {
    top: 150px;
  }

  #profile-card.animate .stats-container {
    top: 190px;
  }

  #view_details {
    top: 90px;
    width: 140px;
    font-size: 16px;
  }

  #profile-card.animate #view_details {
    top: 95px;
    width: 130px;
    font-size: 14px;
  }

  .profile-options {
    opacity: 0;
    transition: opacity 200ms ease-out;
  }

  #profile-card.animate .profile-options {
    opacity: 1;
  }
}
</style>