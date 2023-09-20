<template>

  <div class="container-fluid">
    <div class="login-box">
      <h3>Submit Challenge</h3>
      <form @submit.prevent="createChallenge">
        <div class="user-box">
          <input type="text" id="name" name="name" required v-model="editable.name">
          <label for="name">Challenge Name</label>
        </div>
        <div class="user-box">
          <input type="text" id="description" name="description" required v-model="editable.description">
          <label for="description">Description</label>
        </div>
        <div class="user-box">
          <input type="url" id="coverImg" name="coverImg" required minlength="5" maxlength="500" v-model="editable.coverImg">
          <label for="coverImg">Cover Image</label>
        </div>
        <div v-for="(link, index) in editable.supportLinks" :key="index">
          <div class="user-box">
            <input type="text" :id="'supportLinkName' + index" :name="'supportLinkName' + index" required v-model="link.name">
            <label :for="'supportLinkName' + index">Support Link Name</label>
          </div>
          <div class="user-box">
            <input type="url" :id="'supportLinkURL' + index" :name="'supportLinkURL' + index" required v-model="link.url">
            <label :for="'supportLinkURL' + index">Support Link URL</label>
          </div>
        </div>
        <div class="col-12 d-flex justify-content-end">
          <a role="button" type="submit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import { ref, computed } from 'vue'
import { AppState } from '../AppState'
import { logger } from "../utils/Logger.js"
import Pop from "../utils/Pop.js"
import { challengesService } from "../services/ChallengesService.js"

export default {
  setup() {

    const editable = ref({
      supportLinks: [{ name: '', url: '' }],

    })

    return {
      editable,

      challenges: computed(() => AppState.challenges),

      async createChallenge() {
        try {
          logger.log('Creating Challenge:', editable.value)
          const newChallenge = editable.value
          await challengesService.createChallenge(newChallenge)
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'Failed to create challenge')
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
.container-fluid {
  height: 100vh;
  width: 100vw;
  position: relative;
}

.login-box {
  position: relative;
  top: 10%;
  left: 50%;
  width: 400px;
  padding: 40px;
  color: #F0F0F0;
  text-shadow: 0 .5px 1px #38BB64;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,.5);
  box-sizing: border-box;
  box-shadow: 0 5px 15px #BB388F55;
  border-radius: 10px;
}

.login-box h3 {
  margin: 0 0 20px;
  padding: 0;
  text-align: center;
  color: #F0F0F0;
  text-shadow: 0px 1px 2px #38BB64;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #F0F0F0;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #F0F0F0;
  outline: none;
  background: transparent;
}
.login-box .user-box label {
  position: absolute;
  top:0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #388FBB;
  text-shadow: 0 .5px 1px #38BB64;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #388FBB;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}

.login-box a:hover {
  color: #F0F0F0;
  border-radius: 5px;
  box-shadow: 5px 0 5px 1px #38b464 inset,
              -5px 0 5px 1px #388fbb inset,
              0 -5px 5px 1px #bb388f inset,
              0 5px 5px 1px #bb6438 inset;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #388FBB);
  animation: btn-anim1 5s linear infinite .25s;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
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
  50%,100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #BB388F);
  animation: btn-anim3 5s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #BB6438);
  animation: btn-anim4 5s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
}

.user-box {
  height: 65px;
}

</style>