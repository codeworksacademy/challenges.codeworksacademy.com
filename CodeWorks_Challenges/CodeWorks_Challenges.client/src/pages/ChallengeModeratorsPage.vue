<template>
  <div class="container-fluid">
    <section class="row">

      <div class="col-12 d-flex flex-column">
        <div>
          This is the Moderators page for your challenge
        </div>
        <div>
          Here you can search for new moderators
          <div>
            <ModSearchForm />
          </div>
        </div>
      </div>

      <div class="col-12 d-flex flex-column">
        These are the moderators that are apart of your challenge
        <div v-for="moderator in moderators" :key="moderator.id">
          {{ moderators.profile.name }}
        </div>
      </div>

      <div class="col-12 d-flex flex-column">
        These are the users that have been invited but have not acceppted the invite
        <div v-for="moderator in moderators" :key="moderator.id">
          {{ moderators.profile.name }}
        </div>
      </div>

    </section>
  </div>
</template>


<script>
import { computed, onMounted, watchEffect } from "vue";
import ModSearchForm from "../components/ModSearchForm.vue";
import Pop from "../utils/Pop.js";
import { useRoute } from "vue-router";
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js";
import { AppState } from "../AppState.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
    const route = useRoute()

    async function getModeratorsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await challengeModeratorsService.getModeratorsByChallengeId(challengeId)
      } catch (error) {
        Pop.error(error.message, '[getModeratorsByChallengeId - Challenge Moderators Page]')
      }
    }

    onMounted(() => {
      getModeratorsByChallengeId();
    })
    return {
      moderators: computed(() => AppState.moderators)
    };
  },
  components: { ModSearchForm }
}
</script>


<style lang="scss" scoped></style>