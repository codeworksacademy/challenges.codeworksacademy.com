<template>
  <div class="leaderboard-backdrop">
    <section class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center mt-3">Leaderboards</h1>
        </div>
      </div>

      <section class="row mt-5" v-for="board in boards">
        <h3 class="col-12 text-center text-white">{{ board.name }}</h3>
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
import { AppState } from '../AppState.js'
import { computed, onMounted, ref } from 'vue'
import { participantsService } from "../services/ParticipantsService.js"
import LeaderCard from "../components/Leaderboards/LeaderCard.vue"
import Pop from "../utils/Pop.js"

export default {
  setup() {
    const filterBy = ref('');
    async function getLeaderboards() {
      try { await participantsService.getLeaderboards(); }
      catch (error) { Pop.error(error); }
    }
    onMounted(() => {
      getLeaderboards();
    });
    return {
      filterBy,
      boards: computed(() => AppState.leaderboards),
    };
  },
  components: { LeaderCard }
}
</script>

<style scoped lang="scss">
.leaderboard-backdrop {
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background: radial-gradient(circle, var(--border-main) 0%, var(--bg-main) 35%, var(--border-dark) 100%);
  color: var(--text-main);

  h1 {
    text-shadow: 2px 2px 2px black;
  }
}
</style>