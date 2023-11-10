<template>
  <div class="container-fluid" v-if="activeProfile">
    <section class="row">
      <div class="p-0">
        <img :src="activeProfile.coverImg" alt="Cover Image" class="coverImg-style">
      </div>
      <div class="d-flex col-12">
        <img :src="activeProfile.picture" :alt="activeProfile.name" class="avatar-md me-4 avatar-style">
        <div class="d-flex flex-column">
          <p class="fs-2 m-0">
            {{ activeProfile.name }}
          </p>
          <p>
            Rank: {{ activeProfile.title }} 
            <span class="ms-2">
              {{ activeProfile.rank }} XP
            </span>
            <span title="challenges created" class="ms-2">
              {{ challenges.length }}
              <i class="mdi mdi-head-lightbulb fs-5"></i>
            </span>
          </p>
        </div>
      </div>
    </section>
    <section class="row">
      <div class="col-12 my-3">
        <p class="fs-3 fw-semibold">
          {{ activeProfile.name }}'s Challenges
        </p>
      </div>
      <div class="col-12 my-2" v-for="c in challenges" :key="c.id">
        <ChallengeCard :challenge="c" class="position-relative"/>
      </div>
    </section>
  </div>
  <div class="container-fluid" v-else>
    <h1 class="fs-1 fw-bold">
      Loading... <i class="mdi mdi-loading mdi-spin"></i>
    </h1>
  </div>
</template>


<script>
import { useRoute } from 'vue-router';
import Pop from '../utils/Pop';
import { AppState } from '../AppState'
import { computed, onUnmounted, watchEffect } from 'vue';
import { profilesService } from '../services/ProfilesService';
import { logger } from '../utils/Logger';
import { challengesService } from '../services/ChallengesService';
import ChallengeCard from '../components/ChallengeCard.vue';

export default {
    setup() {
        const route = useRoute();
        async function getProfile() {
            try {
                const profileId = route.params.profileId;
                await profilesService.getProfile(profileId);
            }
            catch (error) {
                Pop.error(error.message);
            }
        }
        async function getProfileChallenges() {
            try {
                const profileId = route.params.profileId;
                await challengesService.getProfileChallenges(profileId);
            }
            catch (error) {
                Pop.error(error.message);
            }
        }
        function clearProfile() {
            try {
                profilesService.clearProfile();
            }
            catch (error) {
                Pop.error(error.message);
            }
        }
        watchEffect(() => {
            route.params.profileId;
            getProfile();
            getProfileChallenges();
        });
        onUnmounted(() => {
            clearProfile();
        });
        return {
            activeProfile: computed(() => AppState.activeProfile),
            challenges: computed(() => AppState.challenges)
        };
    },
    components: { ChallengeCard }
}
</script>


<style lang="scss" scoped>
.coverImg-style{
  object-fit: cover;
  object-position: center;
  height: 15vh;
  width: 100%;
}

.avatar-style{
  position: relative;
  top: -5.5vh;
}
</style>