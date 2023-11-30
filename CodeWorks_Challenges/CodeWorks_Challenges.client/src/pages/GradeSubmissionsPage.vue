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
    </div>
    <div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-uppercase">Challenge Requirements</h3>
      </div>
    </div>
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div v-for="p in participants" :key="p.id" class="accordion-item">
        <div v-if="p.status === 'submitted' && challengeCreator">
          <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+ p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                {{ p.profile.name }}
              </button>
          </h2>
          <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <GradeSubmissionForm :participant="p" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="challengeCreator" class="col-9 d-flex justify-content-center align-items-center position-fixed bottom-2">
      <!-- STUB - OFFCANVAS BUTTON - Array of Submitted Challenge Participants -->
      <a
        role="button"
        class="d-flex justify-content-center align-items-center mdi mdi-chevron-up text-warning bg-primary rounded-circle fs-1"
        style="aspect-ratio: 1/1; height: 50px; width: 50px;"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#moderatorsOffcanvas"
        aria-controls="offcanvasBottom">
      </a>
    </div>
  </section>
</template>
  
<script>
import GradeSubmissionForm from "../components/GradeSubmissionForm.vue"
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"

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

    async function getParticipantsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await participantsService.getParticipantsByChallengeId(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const participant = computed(() => {
      return AppState.participants.find(p => p.id === AppState.activeParticipant?.id)
    })

    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
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
        return AppState.participants.find(p => p.accountId === AppState.user.id)
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