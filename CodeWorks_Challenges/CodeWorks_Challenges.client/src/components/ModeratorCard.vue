<template>
  <section class="container-fluid" v-if="moderator" :key="moderator?.id">
    <div class="d-flex flex-column justify-content-center align-items-center">
        <img
          :src="moderator.profile.picture"
          :title="`Visit ${moderator.profile.name}'s profile?'`"
          :alt="`Moderator's Name: ${moderator.profile.name}`"
          @click="routeToModeratorProfile()"
          class="rounded-circle img-fluid"
          height="150"
          width="150"
        />
        <small class="text-truncate"> {{ moderator.profile.name }} </small>
    </div>
  </section>
</template>

<script>
import Pop from "../utils/Pop.js";
import { useRouter } from "vue-router";
import { logger } from "../utils/Logger.js";
import { ChallengeModerator } from "../models/ChallengeModerator.js";
import { Offcanvas } from "bootstrap";

export default {
  props: {
    moderator: {
      type: ChallengeModerator || Object,
      required: true
    }
  },
  setup(props) {

    const router = useRouter();

    function changeRoute(route){
      router.push({
        path: `${route}/`
      })
    }

    async function routeToModeratorProfile() {
      try {
        await router.push({
          path: `/profiles/${props.moderator.profile.id}`
        })
        Offcanvas.getOrCreateInstance('#moderatorsOffcanvas').hide()
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    return {
      changeRoute,
      routeToModeratorProfile,
    }
  }
}
</script>