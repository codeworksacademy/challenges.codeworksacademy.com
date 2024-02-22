<template>
  <div class="container-fluid">
    <section class="row badge-card text-white justify-space-evenly align-items-center mt-4 me-3"
      v-if="challengeBadges.length > 0">
      <div class="col-3 rounded-top d-flex flex-column justify-content-center align-items-center my-3"
        v-for="earnedBadge in challengeBadges" :key="earnedBadge">

        <router-link :to="{ name: 'Challenge.overview', params: { challengeId: earnedBadge.challengeId } }"
          :title="`Click to visit the '${earnedBadge.challenge.name}' Challenge Page to earn this badge!`"
          class="badge-link">
          <ChallengeBadge :challenge="earnedBadge.challenge" :badge="earnedBadge.challenge.badge" />
        </router-link>

        <div class="card col-12 d-flex justify-content-center align-items-center text-light mt-2 pb-2">

          <span class="text-capitalize bg-black fw-semibold text-truncate text-center py-1 mb-1" style="width: 100%">
            {{ earnedBadge.challenge.name }} </span>

          <div v-if="earnedBadge.challenge.difficulty === 1"
            class="d-flex flex-column justify-content-center align-items-center">
            <img src="../assets/img/easy-difficulty-chart.svg" alt="Easy Difficulty Icon" class="img-fluid"
              style="width: 30px; height: 30px;" :title="`Difficulty Rating: ${earnedBadge.challenge.difficulty}`">
            <!-- <span class="text-capitalize text-success"> {{ earnedBadge.challenge.difficultyStr.text }}</span> -->
          </div>

          <div v-if="earnedBadge.challenge.difficulty === 2"
            class="d-flex flex-column justify-content-center align-items-center">
            <img src="../assets/img/medium-difficulty-chart.svg" alt="Medium Difficulty Icon" class="img-fluid"
              style="width: 30px; height: 30px;" :title="`Difficulty Rating: ${earnedBadge.challenge.difficulty}`">
            <!-- <span class="text-capitalize text-warning"> {{ earnedBadge.challenge.difficultyStr.text }}</span> -->
          </div>

          <div v-if="earnedBadge.challenge.difficulty === 3"
            class="d-flex flex-column justify-content-center align-items-center">
            <img src="../assets/img/hard-difficulty-chart.svg" alt="Hard Difficulty Icon" class="img-fluid"
              style="width: 30px; height: 30px;" :title="`Difficulty Rating: ${earnedBadge.challenge.difficulty}`">
            <!-- <span class="text-capitalize text-danger"> {{ earnedBadge.challenge.difficultyStr.text }}</span> -->
          </div>

        </div>

      </div>
    </section>
    <section v-else class="row badge-card text-white">
      <div class="col-12 rounded-top text-center">
        <div class="my-2"> <em> No Badges yet! </em> </div>
        <router-link :to="{ name: 'Challenges.browse' }" class="d-flex justify-content-center">
          <p class="btn selectable">Find and complete a challenge!</p>
        </router-link>
      </div>
    </section>
  </div>
</template>


<script>
import { computed } from "vue";
import { AppState } from '../AppState';
import ChallengeBadge from "../components/ChallengePage/ChallengeBadge.vue";

export default {
  setup() {

    return {
      profile: computed(() => AppState.ProfileState.profile),
      challenges: computed(() => {
        return AppState.ProfileState.challenges.filter(c => c.creatorId !== AppState.ProfileState.profile.id)
      }),
      challengeBadges: computed(() => AppState.ProfileState.participation.filter(p => p.status == 'completed'))
    }
  },
  components: { ChallengeBadge }
}
</script>


<style scoped lang="scss">
.badge-card {
  background-color: #1D213A;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  height: 100%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 100%;
  transition: all .3s ease-in-out;
  user-select: none;

  .badge-link {
    position: relative;
    bottom: 0;
    transition: all .3s ease-in-out;

    &:hover {
      position: relative;
      bottom: 5px;
      transition: all .3s ease-in-out;
      transform: rotate(-2deg);
      filter: brightness(1.2);
    }
  }

  .card>span {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .card {
    background-color: var(--border-main);
    text-shadow: 0 1px #000000;
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }
}
</style>