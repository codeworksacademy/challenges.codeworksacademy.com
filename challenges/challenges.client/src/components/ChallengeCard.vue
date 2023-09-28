<template>
  <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="selectable" style="">
  <section v-if="challenge" :key="challenge?.id">
    <div class="card card-custom border-secondary" style="">
      <div class="card-custom-img" :style="`background-image: url(${challenge.coverImg}); opacity: .6;`">
        <div class="card-body">
        <div class="col-6 position-absolute top-half left-half p-1">
          <a ref="challenge" id="challengeDetailsButton" type="button" role="button"  @click="setActiveChallenge(challenge?.id)" data-bs-target="#challengeDetails" data-bs-toggle="modal" aria-label="Go to Active Challenge Modal" class="btn btn-outline-primary" title="See who's Competing">Who's In?</a>
        </div>
        <div class="position-relative" style="z-index: 1;">
          <p v-if="challenge.pointValue === 1" class="one-pt-badge"> {{ challenge.pointValue }} PT. </p>
          <p v-else-if="challenge.pointValue === 5" class="five-pt-badge"> {{ challenge.pointValue }} PTS. </p>
          <p v-else class="ten-pt-badge"> {{ challenge.pointValue }} PTS. </p>
        </div>
        <div class="card-custom-avatar">
          <img class="img-fluid" style="object-fit: cover; z-index: 1;" :src="challenge.creator.picture" alt="Creator Name" :title="`Go To Creator's Profile: ${challenge.creator.name}`" />
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
    </div>
  </section>
  </router-link>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { AppState } from '../AppState'
import { Event } from '../models/Event'
import { Challenge } from '../models/Challenge'
import { challengesService } from '../services/ChallengesService'
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

    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
      activeEvent: computed(() => AppState.activeEvent),
      challenges: computed(() => AppState.challenges),
      activeChallenge: computed(() => AppState.activeChallenge),

      cancelChallenge,
      deleteChallenge,

      setActiveChallenge(challengeId) {
        try {
          logger.log(`Getting Challenge by Id: ${challengeId}`)
          challengesService.setActiveChallenge(challengeId)
        } catch (error) {
          Pop.error(error)
          logger.error(error)
        }
      },
      getChallengeParticipants(challengeId) {
        try {
          logger.log(`Getting Challenge Participants by active Challenge: ${challengeId}`)
          challengesService.getChallengeParticipants(challengeId)
          Modal.getOrCreateInstance('#challengeDetails').show()
        } catch (error) {
          Pop.error(error)
          logger.error(error)
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';

.container-fluid {
  --bs-gutter-x: 0;
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
  max-height: 160px;
  width: 100%;
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
}

.card-custom-img {
  height: 260px;
  min-height: 160px;
  width: auto;
  min-width: auto;
  position: relative;
  background-color: #00000080;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: .8;
  filter: brightness(1.3);
  box-shadow: 0 10px 0 10px #000000;
  border-color: inherit;
}

/* First border-left-width setting is a fallback */
.card-custom-img::after {
  position: absolute;
  content: '';
  
  bottom: 0;
  right: 0;
  width: 85%;
  height: 0;
  border-style: solid;
  border-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 50vw;
  border-left-width: 30vh;
  border-top-color: transparent;
  border-bottom-color: #0b0d12;
  border-right-color: transparent;
  border-left-color: transparent;

}

.card-custom-avatar img {
  border-radius: 50%;
  box-shadow: 0 0 15px 3px #0a0a0a9a;
  position: absolute;
  border: 2.5px solid #000000;
  top: 75px;
  right: 1.5rem;
  width: 65px;
  height: 65px;
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
    transform: scale(1.1) translateY(-.25rem) translateX(.25rem) rotateZ(10deg);
  }

  100% {
    transform: scale(1) translateY(0) translateX(0) rotateZ(0deg);
  }
}

.ten-pt-badge {
  padding: .25rem;
  font-size: 1rem;
  text-align: center;
  background-color: #f9c450;
  color: aliceblue;
  text-shadow: 1px 1px 1px #000;
  border-radius: 3rem;
  min-width: 4vw;
  position: absolute;
  top: 1rem;
  right: 1rem;
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
  padding: .25rem;
  font-size: .9rem;
  text-align: center;
  background-color: var(--primary-green);
  color: aliceblue;
  text-shadow: 1px 1px 1px #000;
  border-radius: 3rem;
  min-width: 3.5vw;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #B0FFC0D9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #B0FFC4D9 60%, #1e0a0a00 100%);
  background-repeat: repeat-y;
  background-position: -100px 0;
  animation: goldShimmer 6s linear infinite;
}

.one-pt-badge {
  padding: .25rem;
  font-size: .7rem;
  text-align: center;
  background-color: var(--primary-blue);
  color: aliceblue;
  text-shadow: 1px 1px 1px #000;
  border-radius: 3rem;
  min-width: 3vw;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #B0CCFFD9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #B0CCFFD9 60%, #1e0a0a00 100%);
  background-repeat: repeat-y;
  background-position: -100px 0;
  animation: goldShimmer 6s linear infinite;
}

.card-body {
  min-height: 125px;
  max-height: 125px;
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
  text-shadow: 0 1px 5px #998ce2;
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

.modal-body {
  background-color: slategray;
  overflow-x: hidden;
  width: 100%;
  --bs-gutter-x: 0;
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