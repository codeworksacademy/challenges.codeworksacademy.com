<template>
  <div class="container-fluid">
    <section class="row align-items-center py-3 mt-3 border-underline dark-blue-bg rounded-top">
      <div class="col">
        <p class="mb-0 text-white fw-semibold">
          {{ challengeTypes.toUpperCase() || 'CREATED' }}
        </p>
      </div>

      <div class="col-4 ms-auto d-flex justify-content-center">
        <div class="dropdown text-end">
          <button class="btn aqua-btn-outline dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Filter Challenges
          </button>
          <ul class="dropdown-menu blue-dropdown">
            <li><button @click="challengeTypes = 'Created'" class="btn dropdown-item">Created</button></li>
            <li><button @click="challengeTypes = 'Moderated'" class="btn dropdown-item">Moderated</button></li>
            <li><button @click="challengeTypes = 'Participating'" class="btn dropdown-item">Participating</button></li>
          </ul>
        </div>
      </div>

      <div class="col ms-auto text-end pe-3">
        <p class="mb-0 text-white">
          <span class="highlight-text fw-semibold">{{ challenges.length }} </span> {{ challengeTypes || 'Created' }}
          challenge{{ challenges.length > 1 || challenges.length == 0 ? 's' : '' }}
        </p>
      </div>
    </section>

    <section class="row justify-content-start mt-3 border-underline">
      <div class="col-11 p-0">
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
          <div class="col-4 col-lg-2">
            <p class="text-white-50">
              POINTS
            </p>
          </div>
        </section>
      </div>
      <div class="col-1 d-none d-md-flex align-items-center">
        <p class="text-white-50" title="Leave Challenge">
          LEAVE
        </p>
      </div>
    </section>

    <section v-if="challenges.length > 0" class="row">
      <div class="col-12 mt-1" v-for="challenge in challenges">
        <ChallengeMiniCard :challenge="challenge" />
      </div>
    </section>

    <section v-else class="row badge-card text-white">
      <div class="col-12 rounded-top text-center">
        <div class="my-2"> <em> No challenges yet! </em> </div>
        <router-link :to="{ name: 'Challenges.browse' }" class="d-flex justify-content-center">
          <p class="btn selectable">Create or join a challenge!</p>
        </router-link>
      </div>
    </section>

  </div>
</template>


<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../AppState';
import ChallengeMiniCard from '../components/ProfilePage/ChallengeMiniCard.vue';

export default {
  setup() {
    const route = useRoute();
    const challengeTypes = ref('')
    return {
      challengeTypes,
      challenge: computed(() => AppState.AccountState.challenges.find(c => c.id == route.params.challengeId)),
      challenges: computed(() => {
        let challengesFiltered = []
        let cf = []
        if (challengeTypes.value === 'Created') {
          challengesFiltered = AppState.AccountState.challenges.filter(c => c.creatorId == AppState.AccountState.account.id)
        } else if (challengeTypes.value === 'Moderated') {
          cf = AppState.AccountState.moderation
          cf.forEach(c => {
            challengesFiltered.push(c.challenge)
          });
        } else if (challengeTypes.value === 'Participating') {
          cf = AppState.AccountState.participation.filter(p => p.challengeId == p.challenge?.id)
          cf.forEach(c => {
            challengesFiltered.push(c.challenge)
          });
        } else {
          challengesFiltered = AppState.AccountState.challenges.filter(c => c.creatorId == AppState.AccountState.account.id)
        }
        return challengesFiltered
      })
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