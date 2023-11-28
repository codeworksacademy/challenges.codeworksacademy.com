<template>
  <section class="container-fluid" v-if="challengeCreator">

    <div v-if="challenge" :key="challenge.id" class="row d-flex justify-content-center align-items-center">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h1 class="text-center"> {{ challenge.name }} </h1>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.description }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.status }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.creator.name }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <p v-html="difficulty.html"></p>
      </div>
      <section>
        <div class="col-12 d-flex justify-content-center align-items-center">
          <h3 class="text-uppercase">Challenge Requirements</h3>
        </div>
        
      </section>
    </div>

  <div v-if="challengeCreator" class="col-9 d-flex justify-content-center align-items-center position-fixed bottom-2">
    <!-- STUB - OFFCANVAS BUTTON - Array of Submitted Challenge Participants -->
    <a
      role="button"
      class="d-flex justify-content-center align-items-center mdi mdi-chevron-up text-warning bg-primary rounded-circle fs-1"
      style="aspect-ratio: 1/1; height: 50px; width: 50px;"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#submissionsOffcanvas"
      aria-controls="offcanvasBottom">
    </a>
  </div>
  <!-- <div v-for="p in participants" :key="p.id" class="col-12 d-flex justify-content-center align-items-center pb-5 mb-5">
    <GradeSubmissionForm v-if="p.status === 'submitted'" :participant="p" />
  </div> -->
  <div v-for="p in participants" :key="p.id" class="col-12 d-flex justify-content-center align-items-center pb-5 mb-5">
    <div v-if="p.status === 'submitted'">
      <GradeSubmissionForm :participant="p" />
    </div>
  </div>
  </section>
</template>
  
<script>
import GradeSubmissionForm from "../components/GradeSubmissionForm.vue"
import ParticipantCard from "../components/ParticipantCard.vue"
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
// import SubmissionCard from '../components/SubmissionCard.vue'
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

export default {
  components: {
    GradeSubmissionForm,
  },
  setup() {
    let route = useRoute()

    const filterBy = ref('')
    const editable = computed(() => 
      newChallengeParticipant({ state: AppState }, filterBy.value)
    )

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
        logger.log(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    // async function getParticipantsByChallengeId() {
    //   try {
    //     const challengeId = route.params.challengeId
    //     await participantsService.getParticipantsByChallengeId(challengeId)
    //   } catch (error) {
    //     logger.error(error)
    //     Pop.toast(error, 'error')
    //   }
    // }

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const challenge = computed(() => {
      return AppState.challenges.find(c => c.id === AppState.activeChallenge.id)
    })
    const participant = computed(() => {
      return AppState.participants.find(p => p.id === AppState.activeParticipant?.id)
    })

    onMounted(() => {
      setActiveChallenge()
      // getParticipantsByChallengeId()
    })

    watchEffect(() => {
      editable.value.status = participant.value?.status
    })

    return {
      filterBy,
      editable,
      participant,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.account.id)),
      challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
      isModeratorStatus,
      difficulty: computed(() => StrDifficultyNum(AppState.activeChallenge.difficulty)),
      participants: computed(() => AppState.participants),
      isParticipant: computed(() => {
        return AppState.participants.find(p => p.accountId === AppState.account.id)
      }),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.participants
        } else {
          return AppState.participants.filter(p => p.status === filterBy.value)
        }
      }),
    } 
  }
}
</script>