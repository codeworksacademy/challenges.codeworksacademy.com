<template>
  <div class="container-fluid">
    <section class="row align-items-center py-3 mt-3 border-underline dark-blue-bg rounded-top">
      <div class="col-12 d-flex align-items-center">
        <div class="dropdown">
          <button class="btn aqua-btn-outline dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Filter Challenges
          </button>
          <ul class="dropdown-menu blue-dropdown">
            <li><button @click="challengeTypes = 'Created'" class="btn dropdown-item">Created</button></li>
            <li><button @click="challengeTypes = 'Participating'" class="btn dropdown-item">Participating</button></li>
            <li v-if="isMyProfile"><button @click="challengeTypes = 'Moderated'"
                class="btn dropdown-item">Moderated</button></li>
          </ul>
        </div>
        <p class="ms-3 mb-0 text-white">
          <span class="highlight-text fw-semibold"> {{ challenges.length + ' ' }} </span>
          <span class="highlight-text fw-semibold"> {{ (challengeTypes.toUpperCase() || 'CREATED') + ' ' }} </span>
          Challenge{{ challenges.length > 1 || challenges.length == 0 ? 's' : '' }}
        </p>
      </div>
    </section>

    <section class="row justify-content-start mt-3 border-underline">
      <div class="col-11">
        <section class="row">
          <div class="col-12 col-md-6">
            <p class="text-white-50">
              CHALLENGE
            </p>
          </div>
          <div class="col-8 col-lg-4">
            <p class="text-white-50">
              CATEGORY
            </p>
          </div>
          <div class="col-4 col-lg-2 d-flex justify-content-center">
            <p class="text-white-50">
              POINTS
            </p>
          </div>
        </section>
      </div>
      <div class="col-1 d-none d-md-flex justify-content-md-center"
        v-if="isMyProfile && (challengeTypes == 'Participating')">
        <p class="text-white-50" title="Leave Challenge">
          LEAVE
        </p>
      </div>
    </section>

    <section v-if="loading" class="row">
      <div class="col-12 p-5 text-center">
        <h1 class="fs-1 fw-bold">
          Loading... <i class="mdi mdi-loading mdi-spin"></i>
        </h1>
      </div>
    </section>

    <section v-else-if="challenges.length > 0" class="row">
      <div class="col-12 mt-1" v-for="challenge in challenges">
        <ChallengeMiniCard :challenge="challenge" :type="challengeTypes" />
      </div>
    </section>

    <section v-else class="row badge-card text-white">
      <div class="col-12 rounded-top text-center">
        <div class="my-2"> <em> No {{ challengeTypes }} challenges yet! </em> </div>
        <router-link :to="{ name: 'Challenges.browse' }" class="d-flex justify-content-center">
          <p class="btn selectable">Create or join a challenge!</p>
        </router-link>
      </div>
    </section>

  </div>
</template>


<script>
import { useRoute } from "vue-router";
import { AppState } from '../AppState.js';
import { computed, ref, watch } from 'vue';
import ChallengeMiniCard from '../components/ProfilePage/ChallengeMiniCard.vue';

export default {
  setup() {
    const route = useRoute();
    const challenges = ref('');
    const challengeTypes = ref('Created');

    function updateFiltered() {
      let cf = [];
      if (challengeTypes.value === 'Created') {
        cf = AppState.ProfileState.challenges.filter(c => c.creatorId == AppState.ProfileState.profile.id);
      } else if (challengeTypes.value === 'Moderated') {
        cf = AppState.ProfileState.moderation.map(c => c.challenge);
      } else if (challengeTypes.value === 'Participating') {
        cf = AppState.ProfileState.participation.map(c => c.challenge);
      }
      challenges.value = cf;
    }

    watch(() => challengeTypes.value, updateFiltered, { immediate: true })
    watch(() => AppState.ProfileState.challenges, updateFiltered)

    return {
      challenges,
      challengeTypes,
      loading: computed(() => AppState.ProfileState.loading),
      isMyProfile: computed(() => route.params.profileId == AppState.AccountState.account.id),

    };
  },
  components: { ChallengeMiniCard }
}
</script>


<style lang="scss" scoped>
p {
  margin-bottom: .5rem;
}

.border-underline {
  border-bottom: 1px solid #2F3E57;
}

.blue-dropdown {
  background-color: #1A2332;
}

.dark-blue-bg {
  background-color: #0E141E;
}

.dropdown-item {
  color: white;
}

.dropdown-item:hover {
  background-color: #0E141E;
}

.aqua-btn-outline {
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.aqua-btn-outline:hover {
  background-color: #00CCE6;
  color: black;
}

.highlight-font {
  font-family: 'Lekton', sans-serif;
}
</style>