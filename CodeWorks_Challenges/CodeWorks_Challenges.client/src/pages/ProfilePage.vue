<template>
  <div class="container-fluid" v-if="activeProfile">
    <section class="row">
      <div class="d-flex align-items-center col-12 my-3">
        <img :src="activeProfile.picture" :alt="activeProfile.name" class="avatar-sm me-4">
        <p class="">
          {{ activeProfile.name }}
        </p>
      </div>
      <div class="col-12">
        <p>
          Rank: {{ activeProfile.experience }}
        </p>
        <p>
          Reputation: {{ activeProfile.reputation }}
        </p>
      </div>
    </section>
    <section class="row">
      
    </section>
  </div>
  <div class="container-fluid" v-else>
    <h1>
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

export default {
  setup(){

    const route = useRoute()

    async function getProfile() {
      try {
        const profileId = route.params.profileId

        await profilesService.getProfile(profileId)
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function getProfileChallenges(){
      try {
        const profileId = route.params.profileId

        await challengesService.getProfileChallenges(profileId)
      } catch (error) {
        Pop.error(error.message)
      }
    }

    function clearProfile(){
      try {
        profilesService.clearProfile()
      } catch (error) {
        Pop.error(error.message)
      }
    }


    watchEffect(() => {
      route.params.profileId
      getProfile()
      getProfileChallenges()
    })

    onUnmounted(() =>{
      clearProfile()
    })

    return {
      activeProfile: computed(() => AppState.activeProfile)
    }
  }
}
</script>


<style lang="scss" scoped>
.avatar-sm{
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}
</style>