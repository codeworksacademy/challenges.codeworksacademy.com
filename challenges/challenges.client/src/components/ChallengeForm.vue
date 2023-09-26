<template>
  <section v-if="user.isAuthenticated" :style="isEvent ? 'margin-top: 8.6em;' : ''" class="container-fluid pt-5 position-relative top-5">
    <div class="form-box">
      <h3>Submit Challenge</h3>
      <form id="challengeForm" @submit.prevent="createChallenge()">
        <div class="input-box">
          <input
            id="name"
            name="name"
            type="text"
            required
            v-model="editable.name"
          >
          <label for="name">Challenge Name</label>
        </div>

        <!-- Toggle for event-specific inputs -->
        <!-- <section v-if="isAdmin" id="event-form">
          <div class="form-check">
            <input
              @change="toggleChallengeType"
              id="isEvent"
              type="checkbox"
              class="form-check-input"
            >
            <label class="form-check-label text-grey darken-10 mb-3" for="isEvent">Is this an Event?</label>
          </div> -->
  
          <!-- Event-specific inputs, shown conditionally -->
          <!-- <div v-if="isEvent && events" :key="events?.id" class="position-relative ">
            <div class="input-box">
              <input
                id="eventDate"
                class="event-date"
                name="eventDate"
                type="date"
                required
                v-model="editable.event.eventDate"
              ><i class="mdi mdi-calendar-month-outline position-absolute top-1 end-0 text-grey lighten-10"></i>
              <label for="eventDate">Event Date</label>
            </div>
            <div class="input-box">
              <input
                id="eventTime"
                name="eventTime"
                type="text"
                required
                v-model="editable.event.eventTime"
              >
              <label for="eventTime">Event Time</label>
            </div>
            <div class="input-box mb-3">
              <input
                id="eventLocation"
                name="eventLocation"
                type="text"
                required
                v-model="editable.event.eventLocation"
              >
              <label for="eventLocation">Event Location</label>
            </div>
            <div class="col-6 m-auto input-box">
              <select
                id="type"
                name="type"
                class="d-flex justify-content-center align-items-center ps-2 pt-2"
                style="height: 45px;"
                required
                v-model="editable.event.type"
              >
                <option value="" class="text-center" selected disabled>Event Type</option>
                <option value="local">Local</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
        </section> -->

        <!-- ... (continue with other challenge properties) -->
        <div class="input-box">
          <input
            id="description"
            name="description"
            type="text"
            required
            v-model="editable.description"
          >
          <label for="description">Description</label>
        </div>
        <div v-for="(link, i) in editable.supportLinks" :key="i">
          <div class="input-box">
            <input
              :id="'supportLinkName' + i"
              :name="'supportLinkName' + i"
              type="text"
              required
              v-model="link.name"
            >
            <label :for="'supportLinkName' + i">Challenge Link Name</label>
          </div>
          <div class="input-box">
            <input
              :id="'supportLinkURL' + i"
              :name="'supportLinkURL' + i"
              type="url"
              required
              v-model="link.url"
            >
            <label :for="'supportLinkURL' + i">Challenge Link URL</label>
          </div>
        </div>
        <div v-if="imageUploadOption === 'url'">
          <div class="input-box">
            <input
              id="coverImg"
              name="coverImg"
              type="url"
              minlength="5"
              maxlength="500"
              required
              v-model="editable.coverImg"
              placeholder="Enter Image URL"
            />
          </div>
          <div class="form-check form-switch">
            <input
              @change="handleUrlChange"
              id="radioDefault"
              type="checkbox"
              class="form-check-input"
            >
            <label class="form-check-label text-grey darken-10" for="radioDefault">Upload Image File</label>
          </div>
        </div>
        <div v-if="imageUploadOption === 'file'">
          <div class="input-box">
            <label for="coverImg" class="custom-file-input">Select File</label>
            <input
              id="coverImg"
              name="coverImg"
              type="file"
              accept="image/*"
              class="form-control"
              style=""
              required
              @change="handleFileUpload"
            />
          </div>
          <div class="form-check form-switch">
            <input
              @change="handleUrlChange"
              id="radioChecked"
              type="checkbox"
              class="form-check-input"
              checked
            >
            <label class="form-check-label text-grey darken-10" for="radioChecked">Upload Image URL</label>
          </div>
        </div>
        <div class="input-box d-flex justify-content-center align-items-center pt-5">
          <div class="col-8">
            <select
              id="pointValue"
              name="pointValue"
              class="d-flex justify-content-center align-items-center ps-2"
              required
              v-model="editable.pointValue"
            >
              <option value="" class="text-center" selected disabled>Point Value</option>
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
        <div class="col-12 d-flex justify-content-end">
          <button class="bg-transparent" style="" type="submit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue'
import { AppState } from '../AppState'
import { logger } from "../utils/Logger.js"
import Pop from "../utils/Pop.js"
import { challengesService } from "../services/ChallengesService.js"
import { hasRoles } from "@bcwdev/auth0provider-client"

export default {
  setup() {

    const editable = ref({
      supportLinks: [
        {
          name: '',
          url: ''
        }
      ],
      pointValue: 'Point Value',
      event: {
        eventDate: Date,
        eventTime: '',
        eventLocation: '',
        type: 'local'
      }
    })

    const userAccess = AppState.account
    const authRoles = ref(
      hasRoles(userAccess.roles, ['admin', 'moderator', 'user'])
    )
      
    const isEvent = ref(false)
    function toggleChallengeType() {
      isEvent.value = !isEvent.value
      if (!isEvent.value) {
        editable.value.event = {
          eventDate: Date,
          eventTime: '',
          eventLocation: '',
          type: 'local'
        }
      }
    }
    
    const imageUploadOption = ref('url')
    function handleUrlChange() {
      if (imageUploadOption.value === 'url') {
        imageUploadOption.value = 'file'
      } else {
        imageUploadOption.value = 'url'
      }
    }

    function handleFileUpload(e) {
      const file = e.target.files[0]
      if (!file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          editable.value.coverImg = reader.result
        }
      }
    }

    return {
      authRoles,
      editable,
      isEvent,
      imageUploadOption,

      toggleChallengeType,
      handleFileUpload,
      handleUrlChange,

      user: computed(() => AppState.user),
      challenges: computed(() => AppState.challenges),
      events: computed(() => AppState.events),
      isAdmin: computed(() => 
        AppState.account.email === 'beepboopbeep@gmail.com' ||
        authRoles.value === true
      ),

      async createChallenge() {
        try {
          logger.log('Creating Challenge:', editable.value)
          const challenge = editable.value
          await challengesService.createChallenge(challenge)
          editable.value = {};
        } catch (error) {
          logger.error(error);
          Pop.toast(error, 'Failed to create challenge');
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
@import '../src/assets/scss/variables.scss';
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

.form-box {
  position: relative;
  top: 10%;
  left: 50%;
  width: 400px;
  padding: 40px;
  color: var(--text-primary);
  text-shadow: 0 .5px 1px #38BB64;
  transform: translate(-50%, -50%);
  background: #00000080;
  box-sizing: border-box;
  box-shadow: 0 5px 15px #BB388F55;
  border-radius: 10px;
}

.form-box h3 {
  margin: 0 0 20px;
  padding: 0;
  text-align: center;
  color: var(--text-primary);
  text-shadow: 0px 1px 2px #38BB64;
}

.form-box .input-box {
  position: relative;
}

input:not(:placeholder-shown):valid, textarea:not(:placeholder-shown):valid, select:not(:placeholder-shown):valid {
  border: 1px solid #38BB6433 !important;
  box-shadow: 0 0 0 1px #388FBBab !important;
  --bs-form-switch-bg: url(
    "https://clipart-library.com/images_k/black-circle-with-transparent-background/black-circle-with-transparent-background-13.png") !important;
}

input:checked {
  background-color: #38BB6499;
}

input:not(:checked) {
  background-image: url(
    'https://1001freedownloads.s3.amazonaws.com/vector/thumb/92443/1311627658.png'
  );
  background-repeat: no-repeat;
  background-size: 18px 18px;
  background-position-y: -1.75px;
  background-position-x: -2px;
  background-color: #555;
  border-color: #141b23; /* Change the border color when checked */
}

select {
  outline: none;
  width: 100%;
  height: 100%;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
  border: 1px solid var(--text-primary) !important;
  border-radius: 5px;
}

select:focus {
  border: 1px solid var(--primary-blue) !important;
  box-shadow: 0 0 0 1px var(--primary-blue) !important;
}

option {
  background: #000;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  padding: 0 2px 1px;
  display: inline-block;
  border: 1px solid var(--text-primary) !important;
  border-radius: 5px;
  text-align: center;
}

.form-box .input-box input,
.form-box .input-box select {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: var(--text-primary);
  border: none;
  border-bottom: 1px solid var(--text-primary);
  outline: none;
  background: transparent;
}

.form-box .input-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

.form-box .input-box input:focus~label,
.form-box .input-box input:valid~label {
  top: -20px;
  left: 0;
  color: var(--primary-blue);
  text-shadow: 0 .5px 1px #38BB64;
  font-size: 12px;
}

.form-box form button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: var(--primary-blue);
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px;
  background: transparent;
  border: none;
}

.form-box form button:hover {
  color: var(--text-primary);
  border-radius: 5px;
  box-shadow: 5px 0 5px 1px #38b464 inset,
    -5px 0 5px 1px var(--primary-blue) inset,
    0 -5px 5px 1px var(--secondary-magenta) inset,
    0 5px 5px 1px var(--tertiary-orange) inset;
}

.form-box .input-box input[data-v-a16fb1c8].event-date {
  color: transparent;
}

.form-box .input-box input[data-v-a16fb1c8].event-date:focus {
  color: var(--text-primary);
  transition: all .5s ease-in-out;
}

.mdi-calendar-month-outline {
  color: #797A7A;
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

/* Set the initial background colors for the pseudo-elements */
.form-box form button span:nth-child(1) {
  background: var(--primary-blue);
}

.form-box form button span:nth-child(2) {
  background: #38BB64;
}

.form-box form button span:nth-child(3) {
  background: var(--secondary-magenta);
}

.form-box form button span:nth-child(4) {
  background: var(--tertiary-orange);
}

.form-box form button span {
  position: absolute;
  display: block;

}

.input-box>input[type="file"] {
  position: relative;
  width: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 1;
}

.custom-file-input {
  position: relative;
  background-color: #25713e;
  color: #FFF;
  border: none;
  width: 30%;
  bottom: 21px;
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
  text-align: center;
  z-index: 2;
  filter: brightness(.9);
}

.custom-file-input~input[type="file"]:hover::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-left: 35px;
  content: 'Click to Select an image...';
  display: flex;
  justify-content: center;
  align-items: center;
  offset: 1;
  background-color: black;
  font-size: 16px;
  color: var(--text-primary);
  border-radius: 5px;
  color: var(--text-primary);
  z-index: 1; 
}

.form-box button span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-blue));
  animation: btn-anim1 5s linear infinite .25s;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.form-box button span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #38BB64);
  animation: btn-anim2 5s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

.form-box button span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, var(--secondary-magenta));
  animation: btn-anim3 5s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

.form-box button span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, var(--tertiary-orange));
  animation: btn-anim4 5s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}

.input-box {
  height: 65px;
}
</style>