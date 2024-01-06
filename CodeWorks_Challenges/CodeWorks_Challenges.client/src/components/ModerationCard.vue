<template>
  <section class="border-underline background-highlight row d-flex text-light justify-content-between align-items-center py-2">
    <div class="col-3 fw-semibold text-truncate fs-5">
      {{ moderationProp.profile.name }}
    </div>
    <div class="col-3 fw-semibold text-truncate fs-5">
      {{ moderationProp.challenge.name }}
    </div>
    <div class="col-3 fw-semibold">
      {{ moderationProp.status.toUpperCase() }}
    </div>
    <div class="col-3 d-flex justify-content-evenly align-items-center">
      <button class="btn" @click="removeModeration(moderationProp.id)" title="remove moderation">
        <i class="mdi mdi-delete text-danger selectable"></i>
      </button>
      <button v-if="moderationProp.originId != account.id" class="btn" @click="approveModeration(moderationProp.id)"
        title="approve moderation">
        <i class="mdi mdi-check-circle text-success selectable"></i>
      </button>
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
.border-underline{
  border-bottom: 1px solid #2F3E57;
}

.background-highlight:hover{
  background-color: #1A2332;
}
</style>