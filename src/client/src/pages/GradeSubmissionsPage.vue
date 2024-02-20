<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section class="row">
      <div class="col-12 pb-3">
        <h3 class="fs-2">User Participation & Submissions</h3>
      </div>

      <div class="col-12 px-3 accordion accordion-flush">
        <h3 class="text-warning">Needs Grading</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item mb-1 mx-2">
          <div v-if="p.status === 'submitted' && challengeCreator">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                <span>{{ p.profile.nickname || p.profile.name }}</span>
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

      <div class="col-12 px-3 mt-2 accordion accordion-flush">
        <h3 class="text-info">Started</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item mb-1 mx-2">
          <div v-if="p.status === 'started' && challengeCreator">
            <h2 class="accordion-header bg-dark text-light">
              <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                <span>{{ p.profile.nickname || p.profile.name }}</span>
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

      <div class="col-12 px-3 mt-2 mb-3 mb-md-5 accordion accordion-flush">
        <h3 class="text-success">Complete</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item mb-1 mx-2">
          <div v-if="p.status === 'completed' && challengeCreator" class="bg-detail rounded-bottom">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                <span>{{ p.profile.nickname || p.profile.name }}</span>
              </button>
            </h2>
            <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body text-light">
                <GradeSubmissionForm :participant="p" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>
  
<script>
import Pop from "../utils/Pop.js"
import { AppState } from '../AppState.js'
import { useRouter } from "vue-router"
import { computed, onMounted, ref, watchEffect } from 'vue'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'
import { newChallengeParticipant } from '../utils/NewChallengeParticipant.js'
import GradeSubmissionForm from '../components/Forms/GradeSubmissionForm.vue'
import { logger } from "../utils/Logger.js"

export default {
  components: {
    GradeSubmissionForm,
  },
  setup() {

    const filterBy = ref('')
    const editable = computed(() =>
      newChallengeParticipant({ state: AppState }, filterBy.value)
    )

    const router = useRouter();
    function modCheck() {
      if (!AppState.AccountState.account.id) { // give time for account to login
        logger.log('[MODCHECK] loop trigger, no ID:', AppState.AccountState.account.id);
        setTimeout(() => modCheck(), 200);
        return
      }
      logger.log('[MODCHECK] loop bypass trigger', AppState.AccountState.account.id);
      const authorizedUser = AppState.ChallengeState.challenge.creatorId == AppState.AccountState.account.id
        || !!AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id);
      // logger.log('[MODCHECK] ', AppState.ChallengeState.challenge.creatorId == AppState.AccountState.account.id);
      // logger.log('[MODCHECK] ', !!AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id));
      if (!authorizedUser) {
        Pop.error('[UNAUTHORIZED ACCESS] Grade Submission Page');
        router.push({ name: 'Error' });
      }
    }
    onMounted(() => { modCheck(); })

    function isModeratorStatus() {
      const isMod = AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.AccountState.account.id)
    })

    watchEffect(() => {
      editable.value.status = participant.value?.status
    })

    return {
      filterBy,
      editable,
      participant,
      isModeratorStatus,

      user: computed(() => AppState.user),
      profile: computed(() => AppState.ProfileState.profile),
      challenge: computed(() => AppState.ChallengeState.challenge),
      challengeCreator: computed(() => AppState.user.id === AppState.ChallengeState.challenge?.creatorId),
      myModerations: computed(() => AppState.ChallengeState.moderators.filter(m => m.accountId === AppState.AccountState.account.id)),
      difficulty: computed(() => StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)),
      participants: computed(() => AppState.ChallengeState.participants),
      isParticipant: computed(() => {
        return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
      }),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.ChallengeState.participants
        } else {
          return AppState.ChallengeState.participants.filter(p => p.status === filterBy.value)
        }
      }),
    }
  }
}
</script>

<style scoped lang="scss">
.profile-picture-small {
  height: 60px;
  width: 60px;
}

.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>