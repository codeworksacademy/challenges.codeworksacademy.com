<template>
  <div class="container-fluid">
    <section class="row mt-3">
      <div class="dropdown text-end">
        <button class="btn aqua-btn-outline dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Filter Challenges
        </button>
        <ul class="dropdown-menu blue-dropdown">
          <li><button @click="challengeTypes = 'Created'" class="btn dropdown-item">Created</button></li>
          <li><button @click="challengeTypes = 'Moderated'" class="btn dropdown-item">Moderated</button></li>
          <li><button @click="challengeTypes = 'Participating'" class="btn dropdown-item">Participating</button></li>
        </ul>
      </div>
    </section>

    <section class="row pt-3 mt-3 border-underline dark-blue-bg">
      <div class="col-6">
        <p class="text-white fw-semibold">
          {{ challengeTypes.toUpperCase() || 'CREATED' }}
        </p>
      </div>
      <div class="col-3"></div>
      <div class="col-3 text-end">
        <p class="text-white">
          <span class="highlight-text fw-semibold">{{ challenges.length }} </span> {{ challengeTypes || 'Created' }} challenges
        </p>
      </div>
    </section>

    <section class="row mt-3 border-underline">
      <div class="col-3">
        <p class="text-white-50">
          CHALLENGE
        </p>
      </div>
      <div class="col-3">
        <p class="text-white-50">
          CATEGORY
        </p>
      </div>
      <div class="col-3">
        <p class="text-white-50">
          POINTS
        </p>
      </div>
      <div class="col-3">
      </div>
    </section>
    <section class="row">
      <div class="col-12 mt-1" v-for="challenge in challenges">
        <ChallengeMiniCard :challengeProp="challenge" />
      </div>
    </section>
  </div>
</template>


<script>
import { computed, ref } from 'vue';
import { AppState } from '../AppState';
import ChallengeMiniCard from '../components/AccountAndProfilePage/ChallengeMiniCard.vue';

export default {
    setup() {
      const challengeTypes = ref('')
        return {
          challengeTypes,
          challenges: computed(() => {
            if(challengeTypes.value == 'Created'){
              return AppState.myChallenges
            } else if(challengeTypes.value == 'Moderated'){
              const modChallenges = []

              const approvedModerations = AppState.moderations.filter(m => m.status == 'active' && m.challenge.creatorId != AppState.account.id)

              approvedModerations.forEach(m => modChallenges.push(m.challenge))

              return modChallenges
            } else if(challengeTypes.value == 'Participating'){
              const partChallenges = []

              AppState.myParticipants.forEach(p => partChallenges.push(p.challenge))

              return partChallenges
            } else{
              return AppState.myChallenges
            }
          }),
        };
      },
    components: { ChallengeMiniCard }
}
</script>


<style lang="scss" scoped>
.border-underline{
  border-bottom: 1px solid #2F3E57;
}

.blue-dropdown{
  background-color: #1A2332;
}

.dark-blue-bg{
  background-color: #0E141E;
}

.dropdown-item{
  color: white;
}

.dropdown-item:hover{
  background-color: #0E141E;
}

.aqua-btn-outline{
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.aqua-btn-outline:hover{
  background-color: #00CCE6;
  color: black;
}

.highlight-font{
  font-family: 'Lekton', sans-serif;
}
</style>