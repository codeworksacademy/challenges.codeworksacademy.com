<template>
  <section v-if="user.isAuthenticated" :style="isEvent ? 'margin-top: 8.6em;' : ''" class="container-fluid pt-5 position-relative top-10 mt-4">
    <div class="form-box">
      <h3>Submit Event</h3>
      <form id="eventForm" @submit.prevent="createEvent()">
        <div class="input-box">
          <input
            id="name"
            name="name"
            type="text"
            required
            v-model="editable.name"
          >
          <label for="name">Event Name</label>
        </div>
        <div class="input-box mb-3">
          <input
            id="location"
            name="location"
            type="text"
            required
            v-model="editable.location"
          >
          <label for="location">Event Location</label>
        </div>
        <div class="input-box mb-3">
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            max="150"
            step="1"
            required
            v-model="editable.capacity"
          >
          <label for="capacity">Event Capacity</label>
        </div>
        <div class="input-box mb-3">
          <textarea
            id="description"
            name="description"
            type="text"
            rows="20"
            required
            v-model="editable.description"
          >
          </textarea>
          <label class="description-label" for="description">Description</label>
        </div>

        <div class="input-box">
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            v-model="editable.startDate"
          >
          <label for="startDate" class="start-date">Start Date</label>
          <i class="mdi mdi-calendar-month-outline"></i>
        </div>
        <div class="input-box">
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            v-model="editable.endDate"
          >
          <label for="endDate" class="end-date">End Date</label>
          <i class="mdi mdi-calendar-month-outline"></i>
        </div>
        <div class="input-box">
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            v-model="editable.startTime"
          >
          <label for="startTime" class="start-time">Starting At</label>
          <i class="mdi mdi-clock-outline"></i>
        </div>
        <div class="input-box">
          <input
            id="endTime"
            name="endTime"
            type="time"
            required
            v-model="editable.endTime"
          >
          <label for="endTime" class="end-time">Ending At</label>
          <i class="mdi mdi-clock-outline"></i>
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
            <label :for="'supportLinkName' + i">Event Link Name</label>
          </div>
          <div class="input-box">
            <input
              :id="'supportLinkURL' + i"
              :name="'supportLinkURL' + i"
              type="url"
              required
              v-model="link.url"
            >
            <label :for="'supportLinkURL' + i">Event Link URL</label>
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
        <!-- Add challenge input fields -->
        <div v-for="(challenge, i) in editable.challenges" :key="i">
          <div class="input-box">
            <input
              :id="'challengeName' + i"
              :name="'challengeName' + i"
              type="text"
              required
              v-model="challenge.name"
            >
            <label :for="'challengeName' + i">Challenge Name</label>
          </div>
          <!-- Add other challenge input fields here -->
          <div class="input-box">
            <input
              :id="'challengeDescription' + i"
              :name="'challengeDescription' + i"
              type="text"
              required
              v-model="challenge.description"
            >
            <label :for="'challengeDescription' + i">Challenge Description</label>
          </div>
          <div class="input-box">
            <input
              :id="'challengePointValue' + i"
              :name="'challengePointValue' + i"
              type="number"
              min="1"
              max="150"
              step="1"
              required
              v-model="challenge.pointValue"
            >
            <label :for="'challengePointValue' + i">Challenge Point Value</label>
          </div>
        </div>
        <button @click="addChallenge">Add Challenge</button>
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
import { eventsService } from "../services/EventsService.js"
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
      challenges: [],
    })

    const userAccess = AppState.user
    const authRoles = ref(
      hasRoles(userAccess.roles, ['admin', 'moderator', 'user'])
    )

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
      imageUploadOption,

      handleFileUpload,
      handleUrlChange,

      user: computed(() => AppState.user),
      events: computed(() => AppState.events),
      challenges: computed(() => AppState.challenges),
      // isAdmin: computed(() => 
      //   AppState.account.email === 'beepboopbeep@gmail.com' ||
      //   authRoles.value === true
      // ),
      isAdmin: computed(() => AppState.user.roles.includes('admin' || 'moderator') || AppState.account.email === 'beepboopbeep@gmail.com'),

      addChallenge() {
        editable.value.challenges.push({
          name: '',
          description: '',
          pointValue: 0
        })
      },

      async createEvent() {
        try {
          const event = {
            ...editable.value,
            challenges: [...editable.value.challenges],
          }
          logger.log('Creating Event:', editable.value)
          await eventsService.createEvent(event)
          editable.value = {};
        } catch (error) {
          logger.error(error);
          Pop.toast(error, 'Failed to create event');
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

input:-internal-autofill-selected {
  background-color: #00000000 !important;
  background-image: none !important;
  color: var(--text-primary) !important;
}

/* Apply styles for autofill inputs, targeting all browsers */
input:-webkit-autofill {
  -webkit-background-clip: text !important;
  -webkit-box-shadow: 0 0 0 30px #00000000 inset !important;
  -webkit-text-fill-color: var(--text-primary) !important;
}

/* Additional styles for autofill inputs, targeting Mozilla Firefox */
input:-moz-autofill {
  /* Firefox-specific styles */
  background-color: #00000000 !important;
  color: var(--text-primary) !important;
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

select:not(:placeholder-shown):valid {
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

input[type=number] {
  font-size: 16px;
  padding: 0 8px;
}
input[type=number]::-webkit-inner-spin-button { 
  -webkit-appearance: none;
  cursor:pointer;
  display:block;
  width:8px;
  color: #333;
  text-align:center;
  position:relative;
}    
input[type=number]:hover::-webkit-inner-spin-button { 
  background: #FfFfFf url('https://i.stack.imgur.com/YYySO.png') no-repeat 50% 50%;  
  width: 3px;
  height: 3px;
  padding: 9px;
  margin: auto;
  position: relative;
  right: 0px;
  border-radius: 28px;
  opacity: .75;
  opacity: .75;
  filter: grayscale(1);
  transform: scale(.8);
}

.form-box .input-box textarea#description {
  resize: none;
  width: 100%;
  height: 50px;
  padding: 5px;
  font-size: 16px;
  color: var(--text-primary);
  border: none;
  border-bottom: 1px solid var(--text-primary);
  outline: none;
  background: transparent;

  ~label.description-label {
      position: absolute;
      top: .25rem;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      pointer-events: none;
      transition: .5s;
    }

    &:focus {
      margin-top: 1rem;
      border: 1px solid var(--primary-blue);
      border-radius: 5px;
      box-shadow: 0 0 0 1px var(--primary-text);
    }

    &:focus~label, 
    &:valid~label {
      position: absolute;
      top: -20px;
      left: 0;
      color: var(--primary-blue);
      text-shadow: 0 .5px 1px #38BB64;
      font-size: 12px;
    }
}

::-webkit-scrollbar {
  width: 15px;
  background: transparent;
}

::-webkit-scrollbar-track {
  background: linear-gradient(90deg, transparent 0%, #222222FF 50%, transparent 100%);
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb {
  background: radial-gradient(#F0F0F0DD, #F0F0F0);
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
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

/* SECTION = Date and Time Picker Styling */
/*#region Date and Time Picker: How to hide the 'Date Picker' and 'Time Picker' text */
/* LIFEHACK - The following 4 rules hide the date picker text 'MM/DD/YYYY' */
input[type=date]::-webkit-datetime-edit-text {
  -webkit-appearance: none;
  display: none;
}
input[type=date]::-webkit-datetime-edit-month-field{
  -webkit-appearance: none;
  display: none;
}
input[type=date]::-webkit-datetime-edit-day-field {
  -webkit-appearance: none;
  display: none;
}
input[type=date]::-webkit-datetime-edit-year-field {
  -webkit-appearance: none;
  display: none;
}

/* LIFEHACK - The following 4 rules flip the hidden 'Date Picker' text back to visible after a selection is made */
input[type=date]:valid::-webkit-datetime-edit-month-field {
  -webkit-appearance: text;
  display: inline;
  padding: 0 0 0 10px;
}
input[type=date]:valid::-webkit-datetime-edit-day-field {
  -webkit-appearance: text;
  display: inline;
}
input[type=date]:valid::-webkit-datetime-edit-year-field {
  -webkit-appearance: text;
  display: inline;
}
input[type=date]:valid::-webkit-datetime-edit-text {
  -webkit-appearance: text;
  display: inline;
}

/* LIFEHACK - The following 4 rules hide the time picker text '--:-- --' */
input[type=time]::-webkit-datetime-edit-text {
  -webkit-appearance: none;
  display: none;
}
input[type=time]::-webkit-datetime-edit-hour-field {
  -webkit-appearance: none;
  display: none;
}
input[type=time]::-webkit-datetime-edit-minute-field {
  -webkit-appearance: none;
  display: none;
}
input[type=time]::-webkit-datetime-edit-ampm-field {
  -webkit-appearance: none;
  display: none;
}

/* LIFEHACK - The following 4 rules flip the hidden 'Time Picker' text back to visible after a selection is made */
input[type=time]:valid::-webkit-datetime-edit-hour-field {
  -webkit-appearance: text;
  display: inline;
  padding: 0 0 0 10px;
}
input[type=time]:valid::-webkit-datetime-edit-minute-field {
  -webkit-appearance: text;
  display: inline;
}
input[type=time]:valid::-webkit-datetime-edit-ampm-field {
  -webkit-appearance: text;
  display: inline;
}
input[type=time]:valid::-webkit-datetime-edit-text {
  -webkit-appearance: text;
  display: inline;
}
/*#endregion */

.form-box .input-box input[data-v-8019a23a][data-v-8019a23a], .form-box .input-box select[data-v-8019a23a][data-v-8019a23a] {
  color: var(--text-primary);
  transition: all .5s ease-in-out;
  display: inline;
}

.form-box .input-box input[data-v-8019a23a], .form-box .input-box select[data-v-8019a23a] {
  color: var(--text-primary);
  transition: all .5s ease-in-out;
}

.form-box .input-box input[data-v-a16fb1c8].event-date:focus {
  color: var(--text-primary);
  transition: all .5s ease-in-out;
}

.form-box .input-box input[type="date"]#startDate:focus {
  
}

input[type="time"]#startTime:focus {
  
}

.mdi-calendar-month-outline {
  color: var(--text-primary);
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
  opacity: 1;
  z-index: 1000;
  display: block;
  position: absolute;
  top: .75rem;
  right: 0;
}

.mdi-clock-outline {
  color: var(--text-primary);
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
  opacity: 1;
  z-index: 1000;
  display: block;
  position: absolute;
  top: .75rem;
  right: 0;
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