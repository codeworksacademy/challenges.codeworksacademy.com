<template>
  <section class="container-fluid">
    <div v-if="challenge" :key="challenge.id"
      class="row d-flex justify-content-center align-items-center mx-1 bg-detail rounded-2">
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