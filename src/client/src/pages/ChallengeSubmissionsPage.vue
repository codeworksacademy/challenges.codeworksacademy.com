<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section class="row justify-content-center align-items-center pb-3" v-if="challenge">
      <div class="col-12 pb-3">
        <h3 class="fs-2" style="color: #7A7A7A">Challenge Submissions</h3>
      </div>

      <div class="col-auto">
        <h3>Status: {{ challenge.status }} </h3>
      </div>

      <div class="col-auto ms-auto">
        <h3>Creator: {{ challenge.creator.name }} </h3>
      </div>
    </section>

    <section class="row justify-content-evenly align-items-center">
      <div v-for="p in participants" :key="p.id" class="col-2 p-3">

        <div>
          <ParticipantCard :participant="p" />
          <small v-if="p.status === 'completed'"></small>
          <small class="d-flex justify-content-center text-success text-capitalize"
            v-else-if="p.status === 'submitted'"><b>gradable</b></small>
          <small v-else class="d-flex justify-content-center subtle-header text-capitalize p-0 m-0">
            <em>not submitted</em></small>
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.bg-detail {
  background-color: #1c2332
}
</style>

<script>
import Pop from "../utils/Pop.js"
import { useRouter } from "vue-router"
import { AppState } from '../AppState.js'
import { computed, onMounted, ref } from 'vue'
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"
import ParticipantCard from "../components/ParticipantCard.vue"
import { logger } from "../utils/Logger.js"

export default {
  components: {
    ParticipantCard
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
      if (!authorizedUser) {
        Pop.error('[UNAUTHORIZED ACCESS] Challenge Submission Page');
        router.push({ name: 'Error' });
      }
    }
    onMounted(() => { modCheck(); })

    return {
      filterBy,
      editable,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.ChallengeState.challenge),
      myModerations: computed(() => AppState.ChallengeState.moderators.filter(m => m.accountId === AppState.AccountState.account.id)),
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
.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>