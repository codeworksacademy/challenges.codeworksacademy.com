<template>
  <section class="container-fluid leaderboard-backdrop">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mt-3 mb-5">Leaderboards</h1>
      </div>
    </div>

    <section class="row" v-for="board in boards">
      <h3 class="col-12 text-center text-white mt-3 mb-5">{{ board.name }}</h3>
      <ol v-for="(participant, i) in board.participants" :key="participant.id"
        class="col-12 d-flex justify-content-center align-items-center mb-0">
        <LeaderCard class="my-0 me-3" :board="board" :participant="participant" :index="i + 1" />
      </ol>
    </section>

    <!-- TODO ADD MODAL BACK -->

  </section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { participantsService } from "../services/ParticipantsService.js"
import LeaderCard from "../components/Leaderboards/LeaderCard.vue"

export default {
  setup() {
    const filterBy = ref('')

    async function getLeaderboards() {
      try {
        await participantsService.getLeaderboards()
      } catch (error) {
        logger.error(error)
      }
    }

    onMounted(() => {
      getLeaderboards()
    })

    return {
      filterBy,
      boards: computed(() => AppState.leaderboards),
    }
  },
}
</script>

<style scoped lang="scss">
@import url('../assets/scss/_root.scss');

.leaderboard-backdrop {
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background: radial-gradient(circle, var(--border-main) 0%, var(--bg-main) 35%, var(--border-dark) 100%);
  color: var(--text-main);

  h1 {
    text-shadow: 2px 2px 2px black;
  }

  span {
    text-shadow: 1px 1px 1px black;
  }
}
</style>