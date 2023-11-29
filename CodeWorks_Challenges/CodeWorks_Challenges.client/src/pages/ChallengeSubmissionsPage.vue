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
        <div class="col-12 d-flex justify-content-between align-items-center">
          <div v-for="p in participants" :key="p.id" class="col-2 p-3">
            <div v-if="p.status === 'submitted'">
              <ParticipantCard :participant="p" />
              <!-- <small class="d-flex justify-content-center align-items-center text-success text-capitalize" style="font-style: bold;">gradable</small> -->
            </div>
            <div v-else class="not-submitted">
              <ParticipantCard :participant="p" />
              <!-- <small class="d-flex justify-content-center align-items-center subtle-header text-capitalize p-0 m-0" style="font-style: italic;">not submitted</small> -->
            </div>
          </div>
        </div>
      </section>
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
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"

export default {
  components: {
    ParticipantCard
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


    const challenge = computed(() => {
      return AppState.challenges.find(c => c.id === AppState.activeChallenge.id)
    })
    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.user.id)
    })

    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
    })

    watchEffect(() => {
    })

    return {
      filterBy,
      editable,
      // challenge,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      // challengeRequirements,
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.account.id)),
      participant,
      participants: computed(() => AppState.participants),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.participants
        } else {
          return AppState.participants.filter(p => p.status === filterBy.value)
        }
      }),
      // challenge: computed(() => AppState.activeChallenge),
      challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
      isModeratorStatus,
      isParticipant: computed(() => {
        return AppState.participants.find(p => p.accountId === AppState.user.id)
      }),
      difficulty: computed(() =>
        StrDifficultyNum(AppState.activeChallenge.difficulty)
      ),
    } 
  }
}
</script>

<style scoped lang="scss">
  // .not-submitted {
  //   opacity: 0.75;
  //   filter: grayscale(100%);
  // }
</style>