<template>
  <section class="container-fluid">
    <div v-if="challenge" :key="challenge.id" class="row d-flex justify-content-center align-items-center mx-1 bg-detail rounded-2">
      <div class="col-12 d-flex align-items-center p-3">
        <h3 style="color: #7A7A7A">Submissions</h3>
      </div>

      <!-- <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.description }} </h3>
      </div> -->
      <!-- <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center">Status: {{ challenge.status }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.creator.name }} </h3>
      </div> -->
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
  
<style scoped lang="scss">
  .bg-detail{
    background-color: #1c2332
  }
</style>

<script>
import ParticipantCard from "../components/ParticipantCard.vue"
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"
import ActiveChallengeDifficultyCard from "../components/ChallengeDetailsPage/ActiveChallengeDifficultyCard.vue"

export default {
  components: {
    ParticipantCard, ActiveChallengeDifficultyCard
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
      const isMod = AppState.moderators.find(m => m.accountId == AppState.AccountState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.user.id)
    })

    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
    })

    return {
      filterBy,
      editable,
      participant,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.AccountState.account.id)),
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
      difficulty: computed(() =>
        StrDifficultyNum(AppState.activeChallenge.difficulty)
      ),
    } 
  }
}
</script>