<template>
  <div class="leaderboard-backdrop">
    <section class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center mt-3 mb-5">Leaderboards</h1>
        </div>
      </div>

      <section class="row" v-for="board in boards">
        <h3 class="col-12 text-center text-white mt-5">{{ board.name }}</h3>
        <ol v-for="(profile, i) in board.profiles" :key="profile.id"
          class="col-12 d-flex justify-content-center align-items-center mb-0">
          <LeaderCard class="my-0 me-3" :board="board" :profile="profile" :index="i + 1" />
        </ol>
      </section>

      <!-- TODO ADD MODAL BACK -->

    </section>
  </div>
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

.leaderboard-backdrop {
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background: radial-gradient(circle, var(--border-main) 0%, var(--bg-main) 35%, var(--border-dark) 100%);
  color: var(--text-main);
  padding: 3em 0;

  h1 {
    text-shadow: 2px 2px 2px black;
  }

  span {
    text-shadow: 1px 1px 1px black;
  }
}
</style>