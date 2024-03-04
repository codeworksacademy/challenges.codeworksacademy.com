<template>
  <div class="container-fluid border-underline background-highlight">
    <section class="row text-light justify-content-between align-items-center py-2">
      <div class="col-4 fw-semibold text-truncate fs-5">
        <router-link :to="{ name: 'Challenge.overview', params: { challengeId: moderationProp.challenge.id } }">
          {{ moderationProp.challenge.name }}
        </router-link>
      </div>
      <div class="col-4 fw-semibold text-truncate fs-5">
        {{ moderationProp.profile.nickname || moderationProp.profile.name }}
      </div>
      <div class="col-2 fw-semibold">
        {{ moderationProp.status.toUpperCase() }}
      </div>
      <div class="col-2 d-flex justify-content-evenly align-items-center">
        <button class="btn" @click="removeModerationRole(moderationProp.id)" title="remove moderation">
          <i class="mdi mdi-delete text-danger selectable"></i>
        </button>
      </div>
    </section>
  </div>
</template>


<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'
import { ChallengeModerator } from '../models/ChallengeModerator.js'
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"
import Pop from "../utils/Pop.js"

export default {
  props: {
    moderationProp: { Type: ChallengeModerator, required: true }
  },

  setup() {
    return {
      account: computed(() => AppState.AccountState.account),

      async removeModerationRole(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?');
          if (!confirmRemove) { return }
          await challengeModeratorsService.removeModerationRole(moderationId);
        }
        catch (error) { Pop.error('[MODERATION CARD] removeModeration:: ' + error); }
      },

    }
  }
}
</script>


<style lang="scss" scoped></style>