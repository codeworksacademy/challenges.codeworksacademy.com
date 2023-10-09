<template>
  <div class="d-flex">
    <img :src="activeProfile.picture" :alt="activeProfile.name">
    <p>
      {{ activeProfile.name }}
    </p>
  </div>
</template>


<script>
import { useRoute } from 'vue-router';
import Pop from '../utils/Pop';
import { AppState } from '../AppState'
import { computed, onUnmounted, watchEffect } from 'vue';
import { profilesService } from '../services/ProfilesService';
import { logger } from '../utils/Logger';

export default {
  setup(){

    const route = useRoute()

    async function getProfile() {
      try {
        const profileId = route.params.profileId

        logger.log(profileId)

        await profilesService.getProfile(profileId)
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

</style>