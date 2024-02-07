<template>
  <section
    class="border-underline background-highlight row d-flex text-light justify-content-between align-items-center py-2">
    <div class="col-3 fw-semibold text-truncate fs-5">
      {{ moderationProp.profile.nickname || profile.name }}
    </div>
    <div class="col-3 fw-semibold text-truncate fs-5">
      {{ moderationProp.challenge.name }}
    </div>
    <div class="col-3 fw-semibold">
      {{ moderationProp.status.toUpperCase() }}
    </div>
    <div class="col-2 d-flex justify-content-evenly align-items-center">
      <button class="btn" @click="removeModeration(moderationProp.id)" title="remove moderation">
        <i class="mdi mdi-delete text-danger selectable"></i>
      </button>
      <button v-if="moderationProp.originId != account.id && moderationProp.status != 'active'" class="btn"
        @click="approveModeration(moderationProp.id)" title="approve moderation">
        <i class="mdi mdi-check-circle text-success selectable"></i>
      </button>
      <button v-else class="btn" title="moderation is active">
        <i class="mdi mdi-check-circle text-dark selectable"></i>
      </button>
    </div>
    <div class="col-1">
      <div class="d-flex align-items-center justify-content-center">
        <router-link :to="{ name: 'Challenge.overview', params: { challengeId: moderationProp.challenge.id } }">
          <button class="btn text-light" title="view challenge">
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { ChallengeModerator } from '../models/ChallengeModerator'
import { AppState } from '../AppState'
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

      async removeModeration(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?')
          if (!confirmRemove) {
            return
          }
          await challengeModeratorsService.removeModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },

      async approveModeration(moderationId) {
        try {
          const confirmApprove = await Pop.confirm('Approve Moderation?')
          if (!confirmApprove) {
            return
          }
          await challengeModeratorsService.approveModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
    }
  }
}
</script>


<style lang="scss" scoped>
.border-underline {
  border-bottom: 1px solid #2F3E57;
}

.background-highlight:hover {
  background-color: #1A2332;
}
</style>