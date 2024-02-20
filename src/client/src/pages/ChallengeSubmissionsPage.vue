<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section v-if="challenge" class="row justify-content-center align-items-center pb-3">
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

    <section class="row">
      <div class="col-12 d-flex justify-content-evenly align-items-center">
        <div v-for="p in participants" :key="p.id" class="col-2 p-3">

          <div v-if="p.status === 'submitted'">
            <ParticipantCard :participant="p" />
            <small class="d-flex justify-content-center align-items-center text-success text-capitalize"
              style="font-style: bold;">gradable</small>
          </div>
          <div v-else class="not-submitted">
            <ParticipantCard :participant="p" />
            <small class="d-flex justify-content-center align-items-center subtle-header text-capitalize p-0 m-0"
              style="font-style: italic;">not submitted</small>
          </div>

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
import ParticipantCard from "../components/ParticipantCard.vue"
import { computed, ref } from 'vue'
import { AppState } from '../AppState'

import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"

export default {
  components: {
    ParticipantCard
  },
  setup() {

    const filterBy = ref('')
    const editable = computed(() =>
      newChallengeParticipant({ state: AppState }, filterBy.value)
    )

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
    })

    return {
      filterBy,
      editable,
      participant,

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
      difficulty: computed(() =>
        StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)
      ),
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