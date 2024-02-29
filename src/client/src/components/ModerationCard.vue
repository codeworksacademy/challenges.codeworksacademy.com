<template>
  <div class="container-fluid border-underline background-highlight">
    <section class="row text-light justify-content-between align-items-center py-2">
      <div class="col-3 fw-semibold text-truncate fs-5">
        <router-link :to="{ name: 'Challenge.overview', params: { challengeId: moderationProp.challenge.id } }">
          {{ moderationProp.challenge.name }}
        </router-link>
      </div>
      <div class="col-3 fw-semibold text-truncate fs-5">
        {{ moderationProp.profile.nickname || moderationProp.profile.name }}
      </div>
      <div class="col-3 fw-semibold">
        {{ moderationProp.status.toUpperCase() }}
      </div>
      <div class="col-3 d-flex justify-content-evenly align-items-center">
        <button class="btn" @click="removeModerationRole(moderationProp.id)" title="remove moderation">
          <i class="mdi mdi-delete text-danger selectable"></i>
        </button>
        <button v-if="moderationProp.originId != account.id && moderationProp.status != 'active'" class="btn"
          @click="acceptModerationRole(moderationProp.id)" title="accept moderator role">
          <i class="mdi mdi-check-circle-outline text-success selectable"></i>
        </button>
        <span v-else-if="moderationProp.originId != account.id && moderationProp.status == 'active'" class="mx-1 px-2"
          title="moderation role is active for this challenge">
          <i class="mdi mdi-check-circle text-success"></i>
        </span>
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

  setup(props) {
    return {
      props,

      account: computed(() => AppState.AccountState.account),

      async removeModerationRole(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?')
          if (!confirmRemove) { return }
          await challengeModeratorsService.removeModerationRole(moderationId)
        }
        catch (error) { Pop.error('[MODERATION CARD] removeModeration:: ' + error); }
      },

      async acceptModerationRole(moderationId) {
        try {
          const confirmApprove = await Pop.confirm('Approve Moderation?')
          if (!confirmApprove) { return }
          await challengeModeratorsService.acceptModerationRole(moderationId)
        }
        catch (error) { Pop.error('[MODERATION CARD] acceptModerationRole:: ' + error); }
      },
    }
  }
}
</script>


<style lang="scss" scoped></style>