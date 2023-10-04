<template>
  <section v-if="challenge" :key="challenge?.id" class="">
    <div class="card card-custom border-secondary" style="">
      <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="" style="">
        <div class="card-custom-img" :style="`background-image: url(${challenge.coverImg}); opacity: .9;`">

          <div class="card-body selectable">
            <div class="row">
              <div class="col-8 d-flex justify-content-between align-items-center text-light" style="z-index: 1;">
                <div class="row">
                  <h5
                    class="col-5 mb-0"
                    style="filter: drop-shadow(3px 3px 0 #000000);"
                    :title="`Challenge Name: ${challenge.name}`"
                  >
                    {{ challenge.name }}
                  </h5>
                  <p 
                    class="col-8 offset-7 card-text-secondary mb-0"
                    style=""
                    :title="`Challenge Description: ${challenge.description}`"
                  >
                    {{ challenge.description }}
                  </p>
                  <p class="col-6 card-text-secondary mb-0" :title="`Challenge Category: ${challenge.category}`"> {{ challenge.category }} </p>
                  <div class="content-box">
                    <p class="col-6 my-0" :title="`Created on this Day: ${challenge.createdAt}`">Created: {{ challenge.createdAt }} </p>
                    <div
                      v-for="(link, i) in challenge.supportLinks"
                      :key="i"
                    >
                      <p class="col-6 position-relative" style="bottom: .2rem">
                        Source Code:
                        <a
                          :href="link.url"
                          :title="`Project Links: ${challenge.supportLinks}`"
                          class="text-light fw-bold hover-text-primary"
                        >
                          {{ link.name }}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-4 d-flex justify-content-center align-items-center" style="z-index: 1;">
                <p v-if="challenge.pointValue === 1" class="one-pt-badge"> {{ challenge.pointValue }} PT. </p>
                <p v-else-if="challenge.pointValue === 5" class="five-pt-badge"> {{ challenge.pointValue }} PTS. </p>
                <p v-else class="ten-pt-badge"> {{ challenge.pointValue }} PTS. </p>
                <div class="card-custom-avatar" style="">
                  <img class="img-fluid pt-0" style="" :src="challenge.creator.picture" alt="Creator Name" :title="`Go To Creator's Profile: ${challenge.creator.name}`" />
                </div>
              </div>

            </div>
          </div>

          <!-- <div v-if="user.isAuthenticated" class="row d-flex justify-content-center align-items-center m-auto">
            <div v-if="!challenge.isCancelled" class="col-5">
              <a role="button" @click="cancelChallenge" class="text-warning" :title="`Cancel ${challenge.name}?`">Cancel</a>
            </div>
            <div v-if="challenge.isCancelled || !challenge.isCancelled" class="col-5">
              <i role="button" @click="deleteChallenge(challenge.id)" class="mdi mdi-trash-can-outline text-danger offset-9" :title="`❗Delete ${challenge.name}?❗`"></i>
            </div>
          </div> -->
        </div>
      </router-link>
    </div>
  </section>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { AppState } from '../AppState'
import { Event } from '../models/Event'
import { Challenge } from '../models/Challenge'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { Modal } from 'bootstrap'

export default {

  props: {
    challenge: {
      type: Object,
      required: true
    },
    event: {
      type: Event || Object,
      required: false
    }
  },

  setup(props) {

    async function cancelChallenge() {
      try {
        if (await Pop.confirm('Are you sure you want to cancel this challenge?')) {
          const challengeId = props.challenge.id 
          await challengesService.cancelChallenge(challengeId)
        }
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function deleteChallenge(challengeId) {
      try {
        if (await Pop.confirm(`Are you sure you want to delete ${props.challenge.name}?`)) {
          await challengesService.deleteChallenge(challengeId)
          logger.log('Challenge Deleted')
        }
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getParticipants() {
      try {
        logger.log(`Getting Challenge Participants =>`)
        participantsService.getParticipants()
      } catch (error) {
        Pop.error(error)
        logger.error(error)
      }
    }

    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
      activeEvent: computed(() => AppState.activeEvent),
      challenges: computed(() => AppState.challenges),
      activeChallenge: computed(() => AppState.activeChallenge),
      participants: computed(() => AppState.participants),

      cancelChallenge,
      deleteChallenge,
      getParticipants,

      setActiveChallenge(challengeId) {
        try {
          logger.log(`Getting Challenge by Id: ${challengeId}`)
          challengesService.setActiveChallenge(challengeId)
        } catch (error) {
          Pop.error(error)
          logger.error(error)
        }
      },
    }
  }
}

</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';

.container-fluid {

}

.game-img {
  aspect-ratio: 1/.5;
  box-shadow: 0 0 15px 15px #000000;
  filter: drop-shadow(0 0 15px 15px #000000);
}

.card-custom {
  color: var(--text-primary);
  text-shadow: 0 1px 5px var(--primary-green);
  overflow: hidden;
  min-height: 100px;
  max-height: 100px;
  width: 75%;
  margin: 0 auto;
  background: #00000080;
  box-shadow: 0 0 15px 2px #0a0a0a4d;
  transition: all .5 ease-in-out;
}

a.btn-outline-primary {
  background: #2e6535;
  z-index: 1;
  font-size: .75rem;
  font-weight: 450;
  color: var(--text-primary);
  text-shadow: 1px 1px 2px #0F0F0F;
  border-color: #F0F0F074;
  transition: .5s ease-in-out;
    &:hover {
      background: #00000080;
      box-shadow: 0 0 15px 2px #0a0a0a4d;
      backdrop-filter: brightness(10%);
      color: var(--text-primary);
      box-shadow: 0 0 15px 2px #BB388FFF;
      border: none;
      transition: .5s ease-in-out;
    }
}

.card .card-custom .card-body .card-footer a {
  background: transparent;
  transition: .5s ease-in-out;
}

.card-custom-img {
  position: relative;
  background-color: #00000080;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: .8;
  filter: brightness(1.3);
  box-shadow: 0 10px 0 10px #000000;
  border-color: inherit;

    &>.card-body .content-box {
      font-size: .6rem;
      padding: .25rem 0 0 .25rem;
      margin: .5rem 0 auto .25rem;
      text-wrap: nowrap;
      background: linear-gradient(90deg, #000000F0 50%, #00000000);
      background-color: invert(#00000000);
      transition: .5s ease-in-out;
      border-radius: 5px;

        >p {
          filter: drop-shadow(0 0 10px 0px #000000);
        }
    }
}

/* First border-left-width setting is a fallback */
.card-custom-img::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  right: 0;
  left: 25%;
  width: 85%;
  height: 0;
  border-style: solid;
  border-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 100px;
  border-left-width: 5vw;
  border-top-color: transparent;
  border-bottom-color: #0b0d12;
  border-right-color: transparent;
  border-left-color: transparent;
  transition: all .5s ease-in-out;
}

.card-custom-img:hover::after,
.card-body .content-box {
  animation: slideAfter .5s ease-in-out forwards;
}

@keyframes slideAfter {
  0% {
    top: 0;
    bottom: 0;
    right: 0;
    left: 25%;
    width: 100%;
    height: 0;
    border-style: solid;
    border-width: 0;
    border-right-width: 0;
    border-top-width: 0;
    border-bottom-width: 100px;
    border-left-width: 5vw;
  }
  100% {
    top: 0;
    bottom: 0;
    right: 100px;
    left: 0;
    min-width: 100%;
    height: 100px;
    border-left-width: 0px;
    border-right-width: 100%;
    border-top-width: 100%;
    border-bottom-width: 100%;
    border-bottom-color: #000000FF;
  }
}

.card-custom-avatar img {
  position: absolute;
  bottom: .75rem;
  right: .75rem;
  object-fit: cover;
  height: 2rem;
  width: 2rem;
  border: 2.5px solid #000000;
  border-radius: 50%;
  box-shadow: 0 0 15px 3px #0a0a0a9a;
  z-index: 1;
  transition: all .5s ease-in-out;
}

.card-custom-avatar img:hover {
  filter: brightness(1.1);
  transition: all .5s ease-in-out;
  animation: buttonPrompt .75s forwards;
}

@keyframes buttonPrompt {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1) translateY(-.1rem) translateX(.1rem) rotateZ(10deg);
  }

  100% {
    transform: scale(1) translateY(0) translateX(0) rotateZ(0deg);
  }
}

.ten-pt-badge {
  font-weight: 650;
  background-color: #d0a342;
  color: #000 !important;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #fff6b0d9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #fff6b0d9 60%, #1e0a0a00 100%);
  background-repeat: repeat-y;
  background-position: -100px 0;
  animation: goldShimmer 6s linear infinite;
}

@keyframes goldShimmer {

  0% {
    background-position: -800px 0
  }

  50% {
    background-position: -200px 0
  }

  100% {
    background-position: 100px 0
  }
}

.five-pt-badge {
  background-color: #38BB6499;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #B0FFC0D9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #B0FFC4D9 60%, #1e0a0a00 100%);
  background-repeat: repeat-y;
  background-position: -100px 0;
  animation: goldShimmer 6s linear infinite;
}

.one-pt-badge {
  background-color: #388FBB99;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #B0CCFFD9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #B0CCFFD9 60%, #1e0a0a00 100%);
  background-repeat: repeat-y;
  background-position: -100px 0;
  animation: goldShimmer 6s linear infinite;
}

.ten-pt-badge,
.five-pt-badge,
.one-pt-badge {
  position: absolute;
  top: .65rem;
  right: .65rem;
  padding: 0 .5rem;
  font-size: .65rem;
  font-weight: 500;
  text-align: center;
  color: var(--text-primary);
  text-shadow: 0 1px 5px #000000;
  border: 2.5px solid #000000;
  border-radius: 3rem;
  width: 6.5vw;
  box-shadow: 0 0 15px 3px #0a0a0a9a;
  z-index: 1;
  transition: all .5s ease-in-out;
}

.card-body {
  min-height: 100px;
  max-height: 100px;
}

label {
  font-size: .75rem;
  font-weight: 400;
  color: var(--text-primary);
  text-shadow: 0 1px 5px var(--primary-green);
}

.card-text {
  font-size: .85rem;
  font-weight: 450;
  color: var(--text-primary);
  text-shadow: 0 1px 3px var(--primary-green);
}

.card-text-secondary {
  font-size: .75rem;
  font-weight: 400;
  color: var(--text-primary);
  text-shadow: 0 1px 1px #998ce2;
}

.card-custom:hover {
  filter: brightness(1.1);
  transition: all .5s ease-in-out;
}

a.btn-dark {
  text-shadow: 2px 2px .75px #000000;
  transition: .5s ease-in-out;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: #121722;
}

::-webkit-scrollbar-thumb {
  background-color: #38BB6466;
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background-color: #121722;
}

::-webkit-scrollbar-corner {
  background-color: #121722;
}

::-webkit-scrollbar-button {
  background: transparent;
  border-radius: 5px;
  height: 5px;
}


@media screen and (max-width: 1200px) {
  .host-badge {
    width: 8vw;
  }
}

@media screen and (max-width: 992px) {
  .host-badge {
    width: 10vw;
  }
}

@media screen and (max-width: 768px) {
  .host-badge {
    width: 12vw;
  }
}

</style>