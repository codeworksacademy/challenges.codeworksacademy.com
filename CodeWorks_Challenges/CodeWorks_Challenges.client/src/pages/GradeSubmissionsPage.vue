<template>
  <section class="bg-detail p-3 mx-3 rounded-3" v-if="challengeCreator">
    <div class="">
      <div class="col-md-8" v-if="challenge">
        <h3> {{ challenge.name }}</h3>
        <h3>Grading</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10 accordion accordion-flush" id="accordionFlushExample">
        <h3 class="text-warning">Needs Grading</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item">
          <div v-if="p.status === 'submitted' && challengeCreator">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+ p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                  <span>{{ p.profile.name }}</span>
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
      <div class="col-md-10 accordion accordion-flush" id="accordionFlushExample">
        <h3 class="text-info">Started</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item">
          <div v-if="p.status === 'started' && challengeCreator">
            <h2 class="accordion-header bg-dark text-light">
                <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+ p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                  <span>{{ p.profile.name }}</span>
                </button>
            </h2>
            <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body bg-dark">
                <GradeSubmissionForm :participant="p" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-10 accordion accordion-flush" id="accordionFlushExample">
        <h3 class="text-success">Complete</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item">
          <div v-if="p.status === 'completed' && challengeCreator">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+ p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                   <span>{{ p.profile.name }}</span>
                </button>
            </h2>
            <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body bg-dark text-light">
                <GradeSubmissionForm :participant="p" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script>
import GradeSubmissionForm from '../components/Forms/GradeSubmissionForm.vue'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import Pop from '../utils/Pop'
import { logger } from '../utils/Logger'  
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'
import { newChallengeParticipant } from '../utils/NewChallengeParticipant'

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

<style scoped lang="scss">

.profile-picture-small{
  height: 60px;
  width: 60px;
}

.bg-detail{
    background-color: #1c2332
  }

</style>